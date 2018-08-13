<template>
    <div class="vux-confirm">
        <x-dialog
            v-model="showValue"
            :dialog-class="/*theme === 'android' ? 'weui-dialog weui-skin_android' : */'weui-dialog'"
            :mask-transition="maskTransition"
            :dialog-transition="/*theme === 'android' ? 'vux-fade' : */dialogTransition"
            :hide-on-blur="hideOnBlur"
            :mask-z-index="maskZIndex"
            @on-hide="$emit('on-hide')">
            <div class="weui-dialog__hd" v-if="!!title" :class="{'with-no-content': !showContent}">
                <strong class="weui-dialog__title">{{ title }}</strong>
            </div>
            <template v-if="showContent">
                <div class="weui-dialog__bd" v-if="!showForm">
                    <slot><div v-html="content"></div></slot>
                </div>
                <div v-else class="vux-prompt" >
                    <template v-if="getFormAttrs().length === 1 && getFormAttrs()[0].isShowTitle===undefined"><!--isShowTitle 默认一个元素不显示title-->
                        <input v-if="getFormAttrs()[0].type === 'text'" class="vux-prompt-msgbox" v-bind="getFormAttrs()[0]" v-model="msgList[0]" ref="input" @focus="onShowDialog"/>
                        <select v-else-if="getFormAttrs()[0].type === 'select'" class="vux-prompt-msgbox" v-model="msgList[0]">
                            <option disabled value="">{{ getFormAttrs()[0].placeholder }}</option>
                            <option v-for="(option, index) in getFormAttrs()[0].options" :key="index" :value="option.key">{{option.value}}</option>
                        </select>
                        <!-- todo more type -->
                        <datetime v-if="getFormAttrs()[0].type === 'datetime'" class="vux-prompt-msgbox" v-bind="getFormAttrs()[0]" v-model="msgList[0]"></datetime>
                    </template>
                    <group label-width="5em" label-margin-right="2em" label-align="left" v-else>
                        <template v-for="(formAttr, index) in getFormAttrs()">
                            <x-input v-if="formAttr.type === 'text'" :key="index" v-bind="formAttr" v-model="msgList[index]" ref="input" @on-focus="onShowDialog" >
                                <div slot="label">
                                    {{ formAttr.title}}
                                    <template v-if="formAttr.redDot">
                                        <span style="color: red; padding-left: 5px;">*</span>
                                    </template>
                                </div>
                            </x-input>
                            <selector v-if="formAttr.type === 'select'" :key="index" v-bind="formAttr" :options="formAttr.options" v-model="msgList[index]" ref="input"/>
                            <datetime v-if="formAttr.type === 'datetime'" :key="index" v-bind="formAttr" v-model="msgList[index]" style="border-bottom: 1px solid #d9d9d9;"></datetime>
                            <datetime v-if="formAttr.type === 'date'" :key="index" v-bind="formAttr" v-model="msgList[index]" format="YYYY-MM" style="border-bottom: 1px solid #d9d9d9;"></datetime>

                        </template>
                    </group>
                </div>
            </template>
            <div class="weui-dialog__ft">
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">{{cancelText || '取消'}}</a>
                <a href="javascript:;" class="weui-dialog__btn" :class="`weui-dialog__btn_${confirmType}`" @click="_onConfirm">{{confirmText || '确定'}}</a>
            </div>
        </x-dialog>
    </div>
</template>

<script>
    import { XDialog, Group, XInput, Selector ,Datetime,Checklist } from 'vux'

    export default {
        name: 'FormDialog',
        components: {
            XDialog,
            Group,
            XInput,
            Selector,
            Datetime,
            Checklist
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            /*showInput: {
                type: Boolean,
                default: false
            },*/
            showForm: {
                type: Boolean,
                default: false
            },
            /*placeholder: {
                type: String,
                default: ''
            },*/
            /*theme: {
                type: String,
                default: 'ios'
            },*/
            hideOnBlur: {
                type: Boolean,
                default: false
            },
            title: String,
            redDot: {
                type: Boolean,
                default: false
            },
            confirmText: String,
            cancelText: String,
            maskTransition: {
                type: String,
                default: 'vux-fade'
            },
            maskZIndex: [Number, String],
            dialogTransition: {
                type: String,
                default: 'vux-dialog'
            },
            content: String,
            closeOnConfirm: {
                type: Boolean,
                default: true
            },
//            inputAttrs: Object,
            formAttrs: Array,
            showContent: {
                type: Boolean,
                default: true
            },
            confirmType: {
                type: String,
                default: 'primary'
            }
        },
        data () {
            return {
//                msg: '',
                msgList: [],
                showValue: false
            }
        },
        watch: {
            value (val) {
                this.showValue = val
            },
            showValue (val) {
                this.$emit('input', val)
                if (val) {
                    if (this.showForm) {
                        setTimeout(() => {
//                            console.log(this.$refs.input)
                            if (this.$refs.input) {
                                this.setInputFocus()
                            }
                        }, 300)
                    }
                    this.$emit('on-show') // emit just after msg is cleared
                } else {
                    if (this.showForm) {
                        this.msgList = this.msgList.map(() => {
                            return ''
                        })
                    }
                }
            },
            formAttrs () {
                let size = this.getFormAttrs().length
                this.msgList = new Array(size)
            },
            msgList(val) {
               // console.log('watch msgList', val)
            }
        },
        created () {
            this.showValue = this.show
            if (this.value) {
                this.showValue = this.value
            }
        },
        methods: {
            /*getInputAttrs () {
                return this.inputAttrs || {
                        type: 'text'
                    }
            },*/
            getFormAttrs () {
                return this.formAttrs || [{
                        type: 'text',
                        placeholder: ''
                    }]
            },
            /*setInputValue (val) {
                this.msg = val
            },*/
            setFormValues (vals) {
                console.log('formDialog setFormValues', vals)
                for (let i = 0; i < vals.length; i++) {
                    this.$set(this.msgList, i, vals[i])
                }
                // this.msgList = vals
                console.log('formDialog msglist', this.msgList)
            },
            setInputFocus () {
           /*     if (this.$refs.input) {
                    if (this.$refs.input instanceof Array) {
                        this.$refs.input[0].focus()
                    } else {
                        this.$refs.input.focus()
                    }
                }*/
            },
            _onConfirm () {
                if (!this.showValue) {
                    return
                }
                if (this.closeOnConfirm) {
                    this.showValue = false
                }

                this.$emit('on-confirm', this.msgList);
            },
            _onCancel () {
                if (!this.showValue) {
                    return
                }
                this.showValue = false;
                this.$emit('on-cancel')
            },
            onShowDialog () {
                this.$emit('on-focus');
            }
        }
    }
</script>

<style lang="less">
    .vux-prompt {
        padding-bottom: 0;
    }

    .vux-prompt-msgbox {
        width: 80%;
        border: 1px solid #dedede;
        border-radius: 5px;
        padding: 4px 5px;
        appearance: none;
        outline: none;
        font-size: 16px;
    }
</style>
