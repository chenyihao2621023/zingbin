<template>
    <div class="chat-header">
        <div class="back-btn" @click="goBack">
            <i class="iconfont icon-zuojiantou"></i>
            <span>返回</span>
        </div>
        <div class="title-wrapper">
            <div class="title">{{ title }}</div>
            <div class="title-ext">{{ titleExt }}</div>
            <div class="title-ext-ico">
                <i v-if="titleExtIco" :class="'iconfont ' + titleExtIco"></i>
            </div>
        </div>
        <div class="detail-btn" @click="goDetail" v-if="hasDetail">
            <!--<i class="iconfont icon-wode1" v-if="chatType === 'chat'"></i>
            <i class="iconfont icon-qunliao" v-if="chatType === 'group' || chatType === 'GROUP' || chatType === 'ORG'"></i>-->
            <i class="iconfont icon-gengduo"></i>
        </div>
        <slot class="right-slot" name="right" v-if="!hasDetail">
            <div class="detail-btn"></div>
        </slot>
    </div>
</template>

<script>
    export default{
        name: 'ChatHead',
        components: {},
        props: {
            title: {
                type: String
            },
            titleExt: {
                type: String,
                default: ''
            },
            titleExtIco: {
                type: String,
                default: ''
            },
            hasDetail: {
                type: Boolean,
                default: true
            },
            chatType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        methods: {
            goBack() {
                this.$emit('goBack')
            },
            goDetail() {
                if (['chat', 'GROUP', 'group', 'ORG'].indexOf(this.chatType) === -1) return
                this.$emit('goDetail')
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"
    .chat-header
        width: 100%
        height: 45px
        font-size: .8rem
        color: #101010
        background-color: #F8F8F8
        flex-center(,space-between,)
        & > div
            height: 44px
            line-height: 44px
        .back-btn
            position: relative
            padding: 0 1rem
            flex-shrink: 0
            font-size 14px
            i
                font-size 9px
        .detail-btn
        .right-slot
            position: relative
            width: calc(25px + 2rem)
            padding: 0 1rem
            flex-shrink: 0
        .detail-btn > i
            font-size: 30px
            /*color: #40affc*/
        /*.back-btn:after
            display: inline-block
            position: absolute
            right: 0
            content: '|'
            color: #000
            font-size: 25px
            font-weight: 100*/
        .title-wrapper
            flex-grow: 2
            overflow: hidden
            padding: 0 .7rem
            font-size: 18px
            flex-center(,center,)
            .title
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                font-weight: 300
            .title-ext
                flex-shrink: 0
                font-weight: 300
            .title-ext-ico
                flex-shrink: 0
                font-weight: 300
                padding-left: 5px
                i
                    font-size: 18px
                    vertical-align: top
                    position: relative
                    top: -3px
                    color: #8a8a8a
    div
        color: #101010
    i
        color: #101010
        font-size: 25px
</style>
