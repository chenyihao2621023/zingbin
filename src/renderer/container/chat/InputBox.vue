<template>
    <div class="input-box border-top-1px">
        <div class="input-box-left">
            <i class="iconfont icon-yuyin2" @click="handleVoice" v-if="inputShow"></i>
            <i class="iconfont icon-jianpan" @click="handleKeyboard" v-else></i>
        </div>
        <div class="voice-wrapper" v-if="!inputShow">
            <div class="voice-inner"
                 @touchstart.stop="voiceTouchStart"
                 @touchmove.stop="voiceTouchMove"
                 @touchend.stop="voiceTouchEnd">
                按住 说话
            </div>
        </div>
        <div class="input-text" :class="{active: inputActive}" v-else>
            <div class="input-scroll-mask">
                <textarea
                    id="chat_message2"
                    ref="input"
                    @focus="onFocus"
                    @blur="onBlur"
                    @click="onClick"
                    @paste="onPaste"
                    @change="onChange"
                    v-model="text"
                    rows="1"
                    v-adjust-and-scroll
                    @resize="onInputResize"
                />
            </div>
        </div>
        <div class="input-box-right">
            <i class="iconfont icon-biaoqing" @click="handleEmoji" v-if="fooderContent !== 'emoji'"></i>
            <i class="iconfont icon-jianpan" @click="handleKeyboardRight" v-else></i>
            <i class="iconfont icon-tianjia1" @click="handleMore" v-if="text.length === 0"></i>
            <div
                class="send-btn"
                v-else
                @click="send">
                {{'发送'}}
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex'
    import AdjustAndScroll from './adjust-and-scroll'

    export default {
        name: 'InputBox',
        directives: {
            AdjustAndScroll
        },
        props: {
            // inputContent: {
            //   type: String,
            //   default: 'input'
            // },
            // inputLeft: {
            //   type: String,
            //   default: 'keyboardIcon'
            // }
            inputShow: {
                type: Boolean,
                default: true
            },
            emojiIconShow: {
                type: Boolean,
                default: true
            },
            fooderContent: {
                type: String,
                default: 'emoji'
            }
        },
        data() {
            return {
                clientY: 0,
                inputActive: false,
                text: '',
            }
        },
        computed: {
            ...mapState({
                insertTexts: state => state.chat.insertTexts
            })
        },
        watch: {
            insertTexts(val) {
                if (!val) return
                // 重复发送相同表情需要清空上次状态
                this.insertText('')
                setTimeout(() => {
                    this.insertAtCursor(this.$refs.input, val, value => {
                        this.text = value
                    });
                }, 200)
            }
        },
        mounted() {
            let that=this;
            $(document).on(PSMU.RESEND_MSG, (evt, revMsg) => {
                PSMU.debug("rev msg RESEND_MSG",evt,revMsg)
                that.send();
            });
        },
        methods: {
            ...mapMutations({
                insertText: 'INSERT_TEXT',
                insertTextEnd: 'INSERT_TEXT_END'
            }),
            insertAtCursor(input, value, cb) {
                if (document.selection) {
//                    input.focus();
                    const sel = document.selection.createRange();
                    sel.text = value;
                    sel.select();
                }
                else if (input.selectionStart || input.selectionStart === '0') {
                    const startPos = input.selectionStart;
                    const endPos = input.selectionEnd;
                    const restoreTop = input.scrollTop;
                    input.value = input.value.substring(0, startPos) + value + input.value.substring(endPos, input.value.length);
                    if (restoreTop > 0) {
                    input.scrollTop = restoreTop;
                    }
                    // input.focus();
                    input.selectionStart = startPos + value.length;
                    input.selectionEnd = startPos + value.length;
                } else {
                    input.value += value;
//                    input.focus();
                }
                // 触发input事件
                let inputEvt = new Event('input', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                })
                input.dispatchEvent(inputEvt)

                cb(input.value)
            },
            onFocus() {
                this.inputActive = true
                this.$emit('inputFocus')
            },
            onBlur() {
                this.inputActive = false
            },
            onClick() {
                this.$emit('inputClick')
            },
            onPaste() {

            },
            onChange() {

            },
            onInputResize() {
                this.$emit('inputResize')
            },
            voiceTouchStart(e) {
                this.$emit('voiceTouchStart', e)
            },
            voiceTouchMove(e) {
                this.$emit('voiceTouchMove', e)
            },
            voiceTouchEnd(e) {
                this.$emit('voiceTouchEnd', e)
            },
            handleEmoji() {
                this.$emit('emojiClick')
            },
            handleMore() {
                this.$emit('moreClick')
            },
            handleVoice() {
                this.$emit('voiceIconClick')
            },
            handleKeyboard() {
                this.$emit('keyboardClick')
            },
            handleKeyboardRight() {
                this.$emit('rightKeyboardClick')
            },
            send() {
                let that=this;
                PSMU.chatInfo.sendBtn(this.text,function(msg){
                    $(document).triggerHandler(PSMU.SELF_MSG, msg)
                    that.$emit('send', that.text)
                    that.text = ''
                    that.$refs.input.focus()
                    // 输入框恢复原样（todo，目前没找到更合适的方法）
                    that.$refs.input.style.height = '30px'
                });
            }
        }
    }
</script>
<style lang="stylus">

    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"
    .input-box
        padding: 6px 10px
        background-color: #f2f2f2
        width: 100%
        border-top: 1px solid #d9d9d9
        flex-center(, space-between, center)
        .input-box-left
            height: 100%
            line-height: 1
        .iconfont
            font-size: 30px
        &.border-top-1px
            border-top-1px(#E4E4E6)
        i
            color: #7d7d7d
        .voice-wrapper
            height: 32px
            padding: 0 12px
            flex: 1
            user-select: none;
            .voice-inner
                height: 100%
                width: 100%
                line-height: 100%
                border: 1px solid #E0E0E2
                border-radius: 5px
                flex-center(,center)
                font-size: .875rem
                user-select: none;
        /* 14/16 */
        .input-text
            flex: 1
            padding: 0 10px
            .input-scroll-mask
                width: 100%
                overflow: hidden
                textarea
                    width: calc(100% + 10px)
                    padding: 5px 10px 5px 0
                    border: none
                    border-bottom: 1px #d0d0d0 solid
                    background-color: transparent !important
                    max-height: 84px
                    font-size: 16px
                    resize: none
                    overflow-y: auto
                    &:focus
                        outline: none
            &.active
                .input-scroll-mask
                    textarea
                        border-bottom: 1px #fe8c19 solid
        .input-box-right
            flex-center(row, center, center)
            & > i:first-child
                margin-right: .2rem
            & > .send-btn
                display inline-block
                width 44px
                height 30px
                font-size 16px
                line-height 32px
                text-align center
                background-color #FF8000
                color #fff
                border-radius 3px
                user-select none
        .open-height
            height: 40px

</style>

