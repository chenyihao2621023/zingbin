<template>
    <div class="pop-menu">
        <popup v-model="show14"  @on-hide="close" position="bottom" should-rerender-on-show>
            <div class="pop-menu-title">
                <div class="menu-row-scroll-wrapper">
                    <scroll
                        direction="horizontal"
                    >
                        <div class="menu-row-scroll-inner">
                            <div class="menu-row-content" v-for="(item, index) in titleMenu" :key="index" @click="clickItem(item.value?item.value:item.text)">
                                <div class="icon-wrapper">
                                    <i :class="`iconfont icon-${item.icon}`"></i>
                                </div>
                                <div class="desc-wrapper">
                                    <span>{{item.text}}</span>
                                </div>
                            </div>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="line"></div>
            <div class="pop-menu-content">
                <div class="menu-row-scroll-wrapper">
                    <scroll
                        direction="horizontal"
                    >
                        <div class="menu-row-scroll-inner">
                            <div class="menu-row-content" v-for="(item, index) in contentMenu" :key="index" @click="clickItem(item.text)">
                                <div class="icon-wrapper">
                                    <i :class="`iconfont icon-${item.icon}`"></i>
                                </div>
                                <div class="desc-wrapper">
                                    <span>{{item.text}}</span>
                                </div>
                            </div>
                            <div class="menu-row-content" v-for="(item, index) in menuData" :key="index" @click="clickItem(item.text)">
                                <div class="icon-wrapper">
                                    <i :class="`iconfont icon-${item.icon}`"></i>
                                </div>
                                <div class="desc-wrapper">
                                    <span>{{item.text}}</span>
                                </div>
                            </div>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="pop-menu-bottom" @click="cancel">
                取消
            </div>
        </popup>
    </div>
</template>

<script>
    import { Grid, Popup } from 'vux';
    import Scroll from 'components/scroll/Scroll'
    export default {
        name: "",
        components: {
            Grid, Popup, Scroll
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            menuData: {
                type: Array,
                default() {
                    return []
                }
            },
            titleMenu: {
                type: Array,
                default() {
                    return [{
                        icon: 'fenxiang',
                        text: '分享到英商'
                    },{
                        icon: 'excel',
                        text: '分享到微信',
                        value:'shareTimeline'
                    },{
                        icon: 'excel',
                        text: '分享到朋友圈',
                        value:'shareFriend'
                    }
                    ]
                }
            },
            contentMenu: {
                type: Array,
                default() {
                    return [{
                        icon: 'shoucangbiaoji',
                        text: '收藏'
                    },{
                        icon: 'qunliao',
                        text: '发起群聊',
                        value: 'createChat'
                    },{
                        icon: 'jiaren',
                        text: '添加好友',
                        value: 'addFriend'
                    },{
                        icon: 'yaoqinghaoyou',
                        text: '邀请好友'
                    }]
                }
            }
        },
        data() {
            return {
                show14: false

            };
        },
        methods: {
            clickItem(val) {
                this.$emit('click-menu-item', val)
            },
            close() {
                this.$emit('on-hide')
            },
            cancel() {
                this.$emit('cancel')
            }
        },
        watch: {
            show(val) {
                this.show14 = val
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .pop-menu
        .menu-row-scroll-wrapper
            width 100%
            overflow hidden
            .menu-row-scroll-inner
                flex-center(row, space-between, start)
                padding 10px 10px
                width: fit-content
                .menu-row-content
                    flex-center(column, start, center)
                    width 20vw
                    flex-shrink 0
                    .icon-wrapper
                        padding 10px
                        background #fff
                        border-radius 10px
                        .iconfont
                            font-size 30px
                            &.icon-fenxiang
                                color: $primary-color
                            &.icon-excel
                                color: #83D943
                    .desc-wrapper
                        text-align: center
                        margin-top 6px
                        line-height 20px
                        color #999
                .menu-row-content + .menu-row-content
                    margin-left 10px
        .line
            width 90%
            height 1px
            background-color $border-color-base
            margin 0 auto
        .vux-popup-dialog
            overflow hidden
        .pop-menu-bottom
            flex-center()
            height 40px
            background-color $background-color-base
            color: #000

</style>

