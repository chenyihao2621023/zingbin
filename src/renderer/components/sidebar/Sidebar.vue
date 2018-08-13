<template>
    <div>
        <popup v-model="popupTop" position="top" @on-hide="popupTop = false">
            <div class="position-vertical-demo">
                <img width="100%" src="/ZingVue/static/images/follow1.png"/>
            </div>
        </popup>
        <div class="sidebar-content">
            <!--<img v-for="(itemIcon,index) in dataImage" :key="index" :src="itemIcon.img" @click="clickItemIcon(itemIcon.value)" v-show="itemIcon.showIcon"/>-->
            <i v-for="(itemIcon,index) in dataImage" :class="itemIcon.class" :key="index" @click="clickItemIcon(itemIcon.value)" v-show="itemIcon.showIcon"></i>
        </div>
        <popup v-model="shareRemark" @on-hide="shareRemark = false" style="z-index: 1002">
            <div class="popupClass">
                <img height="80px" width="80px" src="/ZingVue/static/images/ysImg.png" @click="shareZinlabs"/>
                <img v-if="!isPc" height="80px" width="80px" src="/ZingVue/static/images/wxImg.png" @click="shareFriend"/>
                <img v-if="!isPc" height="80px" width="80px" src="/ZingVue/static/images/pengyouquan.png" @click="shareTimeline"/>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,PopupHeader } from "vux";
    import { isIos,isPc,isWeiXin,isMhApp } from '@/utils/fn'
    const imageList = [
        {
            //.icon-yulanxiazai
            class:"iconfont icon-faxian",
            // img:require('../../assets/img/yulanxiazai.png'),
            value:'goFind',
            showItem(_this) {
                return _this.showFind
            }
        },
        {
            //.icon-fenxiang,
            class:"iconfont icon-fenxiang",
            // img:require('../../assets/img/fenxiang.png'),
            value:'shareImg',
            showItem(_this) {
                return _this.showShareIcon
            }
        },
        {
            //icon-wenjianguishangchuan
            class:"iconfont icon-wenjianguishangchuan",
            // img:require('../../assets/img/wenjianshangchuan.png'),
            value:'saveImg',
            showItem(_this) {
                return _this.showCloudIcon
            }
        },
        {
            //.icon-yulanxiazai
            class:"iconfont icon-yulanxiazai",
            // img:require('../../assets/img/yulanxiazai.png'),
            value:'previewImg',
            showItem(_this) {
                return _this.showDownloadIcon
            }
        }
    ];
    export default {
        name: 'Sidebar',
        components: { Popup,PopupHeader },
        props:{
            showShareIcon: {
                type: Boolean,
                default: true
            },
            showCloudIcon: {
                type: Boolean,
                default: true
            },
            showDownloadIcon: {
                type: Boolean,
                default: true
            },
            showFind: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                shareRemark:false,
                dataImage:imageList,
                isPc:isPc(),
                popupTop:false,
            }
        },
        computed: {},
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.dataImage = imageList.map(item => {
                    item.showIcon = item.showItem(this);
                    return item
                })
            },
            shareZinlabs() {
                this.$emit('shareMessage')
            },
            shareFriend() {
                if (isWeiXin()) {
                    this.shareRemark = false
                    this.popupTop = true
                } else {
                    this.$emit('shareFriend')
                }
            },
            shareTimeline() {
                if (isWeiXin()) {
                    this.shareRemark = false
                    this.popupTop = true
                } else {
                    this.$emit('shareTimeline')
                }
            },
            clickItemIcon(value) {
                switch (value) {
                    case 'shareImg':
                        this.shareRemark = true
                        break;
                    case 'saveImg':
                        this.$emit('uploadFileCabinets')
                        break;
                    case 'previewImg':
                        this.$emit('previewDownload')
                        break;
                    case 'goFind':
                        this.$emit('goFind')
                        break;
                    default:
                        console.log(value);
                }
            }
        },
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .popupClass {
        padding-bottom:15px;
        height:200px;
        text-align: center;
        padding-top: 55px;
        background-color: #fff;
    }
    .sidebar-content
        position:fixed
        bottom:50px
        right: 22px
        display:flex
        flex-direction:column
        color:orange
        z-index:1001
        .iconfont
          font-size 35px
          margin-top 80%
</style>
