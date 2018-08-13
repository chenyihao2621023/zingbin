<template>
    <div class="full-page-slide-wrapper">
        <transition name="fade" mode="out-in">
            <slide key="emoji" ref="slide" :autoPlay="false" :loop="false" :showDot="true"
                   v-if="fooderContent === 'emoji'">
                <div>
                    <emoji-picker :emojiActive="'表情'"/>
                </div>
                <div>
                    <emoticon-picker :emoticonActive="'smiley'" @select="emoticonSelected"/>
                </div>
                <div>
                    <emoticon-picker :emoticonActive="'xiong'" @select="emoticonSelected"/>
                </div>
                <div>
                    <emoticon-picker :emoticonActive="'mayi'" @select="emoticonSelected"/>
                </div>
            </slide>
            <div v-else-if="fooderContent === 'more'" key="more">
                <More @itemClick="moreItemClick"/>
            </div>
        </transition>
    </div>
</template>

<script>
    import Slide from '@/components/slide/Slide'
    import EmojiPicker from '../../../chat/EmojiPicker'
    import EmoticonPicker from '../../../chat/EmoticonPicker'
    import More from './detailMore'

    export default{
        name: 'FullPageSlide',
        components: {
            Slide,
            EmojiPicker,
            EmoticonPicker,
            More
        },
        props: {
            fooderContent: {
                type: String,
                default: 'emoji'
            },
        },
        data() {
            return {}
        },
        methods: {
            moreItemClick(type) {
                this.$emit('moreItemClick', type)
            },
            emoticonSelected(type, name) {
                this.$emit('emoticonSelected', type, name)   //detailChatbottom
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../../../assets/stylus/variable.styl"
    @import "../../../../assets/stylus/mixin.styl"

    .full-page-slide-wrapper
        width: 100%
        height: 100%
        padding: 10px 20px
        background: #f5f5f5
        overflow: hidden
        .fade-enter-active, .fade-leave-active
            transition: all .2s ease
            transform: translateY(0)
        .fade-enter, .fade-leave-to
            opacity: 0
            transform: translateY(100px)
        .slide-move-wrap
            transition: all 5s cubic-bezier(0.77, 0, 0.175, 1)
            height: 100%
            position: relative
            .queueAnim-debug
                height: 100%
                .slide
                    height: 100%
                    overflow: hidden
                    &.queue-anim-leaving
                        position: absolute
                        width: 100%
                    .slide-group
                        height: 85%
                        .slide-item
                            height: 100%
                            .full-page-img-wrapper
                                position: relative
                                height: 100%
                                background-size: cover
                                transform: translateZ(0)
                                .button-wrapper
                                    position: fixed
                                    bottom: 85px
                                    display: block
                                    width: 100%
                                    overflow: hidden
                                    .button
                                        display: inline-block
                                        width: 130px
                                        padding: 15px 0
                                        border: 4px solid rgba(255, 255, 255, 0.7)
                                        border-radius: 4px
                                        color: rgba(255, 255, 255, 0.7)
                                        font-size: 20px
            .keyboard-wrapper
                position: absolute
                height: calc(100% + 40px)
                width: calc(100% + 40px)
                left: -20px
                top: -20px
                padding: 10px
</style>

