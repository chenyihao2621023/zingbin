<template>
    <div class="find-scroll">
        <scroll
            :observeDOM="true"
            ref="scroll" :data="[]"
            :scrollbar="true"
            :pullUpLoad="pullUpLoad"
            :pullDownRefresh="pullDownRefresh"
            @pullingUp="pullingUp"
            @pullingDown="pullingDown"
            :listenScroll="true"
        >
            <div class="link-find-list">
                <div class="link-content-list">
                    <div class="all-publish">
                        <div class="find-pic" v-if="showAdImage">
                            <img src="../../../assets/img/workbench.jpg" alt="">
                        </div>
                        <div class="weui-cell moments__post" v-show="dataList.length" v-for="(item,index) in dataList" :key="index">
                            <div class="weui-cell__hd" @click="goCompany(item)">
                                <img
                                    v-if="cacheFlag"
                                    :src="'./static/images/userDef_.jpg'"
                                     :data-src="getImageUrl(item.src,'./static/images/userDef_.jpg')"
                                     data-error="./static/images/userDef_.jpg"
                                     v-lazy-image
                                >
                                <img v-else :src="item.src" alt="">
                            </div>
                            <div class="weui-cell__bd">
                                <!-- 人名链接 -->
                                <a class="weui-cell__bd_name" @click="goCompany">
                                    <span> {{item.name}}</span>
                                </a>
                                <!-- post内容 -->
                                <p class="weui-cell__bd_text" :class="{'text-has-more': item.hideText}">{{item.text}}</p>

                                <div class="weui-cell__bd_check">
                                    <check-icon class="weui-cell__bd_input" v-show="showInput" :value.sync="item.selectInput" @click.native="onChange(item.rowId)"></check-icon>
                                </div>
                                <a v-if="item.hideText||item.showText" class="paragraphExtender" @click="showFull(item.rowId)">{{ item.hideText ? '全文' : '收起' }}</a>
                                <!-- 相册 -->
                                <div class="thumbnails my-gallery" v-if="item.list&&item.list.length">
                                    <show-pictures :imageList="item.list"></show-pictures>
                                </div>
                                <!-- 评论 -->
                                <div class="liketext" style=" justify-content:space-between">
                                    <span class="liketext-time">{{item.time}}</span>
                                    <span>
                        <span v-show="item.isAdmin && showRemove" class="liketext-remove" @click="removeItem(item)">删除</span>
                           <a v-show="showTab" class="liketext_dianzan" @click="clickLikeTab(item)"><i :class="{'praise-color':item.already,'icon-zannor':item.already}" class="icon iconfont icon-zansel my-icon"></i>{{item.praiseNum}}</a>

                           <a v-show="showTab" class="liketext_pl" @click="goFindComment(item)"><i class="icon iconfont icon-pinglun my-icon"></i>
                           {{item.commentNum}}
                           </a>
                    </span>
                                </div>
                            </div>
                            <!-- 结束 post -->
                        </div>
                        <div class="warning" v-show="!dataList.length && postLoad">
                            {{warningText}}
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
    import Scroll from "@/components/scroll/Scroll";
    import  ShowPictures from './ShowPictures'
    import { CheckIcon } from "vux"
    import { getImageUrl } from '../../../utils/fn'
    import LazyImage from '../../../directives/lazyimage/lazy-image'
    export default {
        name: "AllPublish",
        directives: {
            LazyImage
        },
        components: {
            ShowPictures,Scroll,CheckIcon
        },
        props: {
            dataList: {
                type: Array,
                default () {
                    return []
               }
            },
            showTab: {
                type:Boolean,
                default: false
            },
            showRemove: {
                type:Boolean,
                default: false
            },
            allSelected: {
                type:Number,
                default: 0
            },
            showAdImage: {
                type: Boolean,
                default: false
            },
            postLoad: {
                type: Boolean,
                default: false
            },
            warningText: {
                type: String,
                default: '暂无数据'
            },
            companyId: {
                type: String,
                default: ''
            },
            showInput: {
                type: Boolean,
                default: false
            },
            cacheFlag:{
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pullUpLoad:{ threshold: 0,txt:{ more: '', noMore: '' }},
                pullDownRefresh: { threshold: 50,stop:50, txt: '加载完成' }
            }
        },
        methods:{
            pullingUp () {
              this.$emit('onPullingUp',this.$refs.scroll.forceUpdate)
            },
            pullingDown () {
                this.$emit('onPullingDown',this.$refs.scroll.forceUpdate)
            },
            showFull(rowId) {
                this.dataList = this.dataList.map(item => {
                        if ( item.rowId === rowId) {
                            item.hideText = !item.hideText;
                            item.showText = !item.showText;
                        }
                        return item
                 })
            },
            goFindComment(item) {
                this.$router.push({
                        path:'/find/findComment',
                        query:{
                            rowId:item.rowId
                        }
                    })
            },
            goCompany(item) {
                if (!item.source.companyId) return;
                this.$router.push({
                    path:'/businessIntroduction',
                    query:{
                        companyId: item.source.companyId
                    }
                })
            },
            clickLikeTab (item) {
               this.$emit('likeTab',item)
            },
            getImageUrl,
            onChange (rowId) {
                this.$emit('changeSelected',rowId)
            },
            removeItem (item) {
                const _this = this;
                _this.$vux.confirm.show({
                    title: "删除提示",
                    content: "是否确定删除此发现？",
                    onCancel() {
                        _this.$vux.confirm.hide();
                    },
                    onConfirm() {
                        _this.$emit('removeItemPublish',item.rowId)

                    }
                });
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';
    .find-scroll
        height calc(100% - 50px)
        overflow hidden
        .find-pic
            width: 100%;
            height: 170px;
            z-index: 5;
            padding-bottom: 10px
            img
                width 100%
                height 100%
        .link-content-list
            position: relative
            flex-center(row, start, center)


    .all-publish
      width 100%
     .warning
        text-align center
        margin-top 15px
        font-size 16px
        color #ff8000
     .moments__post
        background: #fff;
        display: block;
        border-bottom: 1px solid #f2eeee
        position relative
        width 100%
        .weui-cell__hd
            position absolute
            top:10px
            left 13px
            width 50px
            height 50px
            img
                width 100%
                height 100%
        .weui-cell__bd
            font-size: 15px;
            padding-left: 60px
            .weui-cell__bd_name
                color: #101010
                font-size 16px
            .weui-cell__bd_text
                font-size 14px
                line-height 20px
                margin 13px 0 5px
                white-space: pre-wrap
                width 275px
            .weui-cell__bd_input
                width: 24px
                height: 24px
                position: absolute
                right: 14px
                top:8px
            .text-has-more
                height 98px
                overflow hidden
            .paragraphExtender
                margin: 5px auto;
                color #40AFFC
            .thumbnails
                width: 100%;
                margin-top 6px
            .liketext
               display: flex;
               margin-top: 8px;
               width: 100%;
               font-size 14px
               flex-wrap: wrap
               .liketext-remove
                  color #ff8000
               .liketext-time
                  font-size 12px
               .liketext_dianzan
                  display inline-block
                  width 20px
                  margin 0 32px
               .my-icon
                  font-size 15px!important
                  margin-right 1px
               .praise-color
                  color #ff8000
</style>

