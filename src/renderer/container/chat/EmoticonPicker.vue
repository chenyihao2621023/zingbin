<template>
    <div class="emoticon-picker">
        <div class="emoticon-wrapper">
            <ul class="emoticon-container">
                <li class="emoticon-li">
                    <a
                        class="emoticon-link"
                        href="javascript:;"
                        v-for="(emoticon, index) in emoticonData[emoticonActive]"
                        :key="index" @click="selectItem(emoticonActive, index)">
                        <img
                            class="emoticon-item"
                            :title="index"
                            :class="'emoticon-' + emoticonActive + '-' + index"
                            :src="'./static/emoticon/' + emoticonActive + '/' + emoticon"/>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import data from './emoticon-data'
    import { mapState, mapMutations } from 'vuex'

    export default {
        name: 'Emoticon',
        props: {
            emoticonActive: {
                type: String,
                default: 'smiley'
            }
        },
        data () {
            return {
                emoticonData: data
            }
        },
        methods: {
            ...mapMutations({
                insertText: 'INSERT_TEXT'
            }),
            selectItem (emoticonActive, name) {
                this.$emit('select', emoticonActive, name)
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .emoticon-picker
        height: 100%
        width: 100%
        overflow-x hidden
        .emoticon-wrapper
            width: calc(100% + 20px)
            height: 100%
            overflow-y: auto
            .emoticon-container
                width: calc(100% - 20px)
                height: 100%
                position: relative
                hide-scrollbar()
                scrollbar(#c7ccd7)
                .emoticon-btn
                    width: 56px
                    position: absolute
                    right: 24px
                    height: 30px
                    bottom: 0.6rem
                    color: #858489
                    flex-center(,space-between)
                    .emoticon-send
                        height: 20px
                        line-height: 20px
                        margin-top: 2px
                        padding-left: 6px
                        border-left: 1px solid #E4E4E6
                        font-size: 1rem
                .emoticon-li
                    font-size: 0
                    padding: 5px
                    .emoticon-link
                        float: left
                        overflow: hidden
                        height: 60px
                        transition: all ease-out .2s
                        border-radius: 4px
                        &:hover
                            background-color: #F4F5F7
                            border-color: #F4F5F7
                        .emoticon-item
                            width: 50px
                            height: 50px
                            display: inline-block
                            border: 1px solid transparent
                            cursor: pointer
</style>
