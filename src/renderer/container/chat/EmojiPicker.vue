<template>
    <div class="emoji-picker">
        <div class="emoji-wrapper">
            <ul class="emoji-container">
                <li class="emoji-li">
                    <a
                        class="emoji-link"
                        href="javascript:;"
                        v-for="(emoji, index) in emojiData[emojiActive]"
                        :key="index" @click="selectItem(emoji)" v-html="text2image(emoji)">
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import data from './emoji-data.js'
    import { text2image, text2emoji } from './emoji-convertor'
    import { mapState, mapMutations } from 'vuex'

    export default {
        name: 'Emoji',
        props: {
            emojiActive: {
                type: String,
                default: '表情'
            }
        },
        data () {
            return {
                emojiData: data,
                pannels: ['表情', '自然', '物品', '地点', '符号'],
                activeIndex: 0
            }
        },
        methods: {
            ...mapMutations({
                insertText: 'INSERT_TEXT'
            }),
            changeActive (index) {
                this.activeIndex = index
            },
            selectItem (emoji) {
                this.insertText(text2emoji(emoji))
                this.$emit('select', emoji)
            },
            text2image: text2image,
            text2emoji: text2emoji
        },
        computed: {},
        mounted() {

        }
    }
</script>
<style lang="stylus">
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .emoji-picker
        height: 100%
        width: 100%
        overflow-x hidden
        .emoji-wrapper
            width: calc(100% + 20px)
            height: 100%
            overflow-y: auto
            overflow-x: hidden
            .emoji-container
                width: calc(100% - 20px)
                height: 100%
                position: relative
                hide-scrollbar()
                scrollbar(#c7ccd7)
                .emoji-btn
                    width: 56px
                    position: absolute
                    right: 24px
                    height: 30px
                    bottom: 0.6rem
                    color: #858489
                    flex-center(,space-between)
                    .emoji-delete
                        color: #858489
                        border-radius: 4px
                        line-height: 20px
                        text-align: center
                        height: 20px
                        width: 20px
                        font-size: 1.2rem
                        padding: 1px
                        &::before
                            content: "\2716"
                    .emoji-send
                        height: 20px
                        line-height: 20px
                        margin-top: 2px
                        padding-left: 6px
                        border-left: 1px solid #E4E4E6
                        font-size: 1rem
                .emoji-li
                    font-size: 0
                    padding: 5px
                    .emoji-link
                        float: left
                        overflow: hidden
                        height: 35px
                        transition: all ease-out .2s
                        border-radius: 4px
                        &:hover
                            background-color: #F4F5F7
                            border-color: #F4F5F7
                        .emoji
                            display: inline-block
                        .emoji-sizer
                            width: 25px
                            height: 25px
                            background-size: 25px 25px
                            border: 1px solid transparent
                            cursor: pointer
</style>
