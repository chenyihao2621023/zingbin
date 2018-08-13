<template>
    <div class="find-main">
                   <zing-head title="发现">
                       <div slot="header-right" v-show="showRightDeng">
                          <span class="header-jiahao">
                    <dropdown style="margin-top:-2px" :data="menuData" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                          </span>
                       </div>
                   </zing-head>
        <all-pubish :companyId="companyId" warningText="暂无发现" :postLoad="postLoad" :dataList="discoveryList" :showTab="true" :showRemove="true" @onPullingUp="onPullingUp" @onPullingDown="onPullingDown" :showAdImage="true" @likeTab="onLikeTab" @removeItemPublish="onRemoveItemPublish">
        </all-pubish>
        <popup v-model="showPublish" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <post-pictures :screenHeight="screenHeight" @postPict="onPostPict" @goBack="goBack" :showPublishImage="showPublishImage" :companyId="companyId"></post-pictures>
        </popup>
    </div>
</template>

<script>
    const menuList = [
        {
            content:'发布图片',
            type: 'image'
        },
        {
            content:'发布文字',
            type: 'text'
        }
    ];
    import { Popup } from 'vux'
    import ZingHead from '@/components/zingHead/ZingHead.vue';
    import Dropdown from '@/components/dropdown/Dropdown'
    import AllPubish from './baseSetting/AllPublish'
    import PostPictures from './baseSetting/PostPictures'
    import { processData } from './baseSetting/findUilt'
    import Scroll from "@/components/scroll/Scroll";
    export default {
        name: "find",
        components: {
            ZingHead,
            Dropdown,
            AllPubish,
            Popup,
            PostPictures,
            Scroll
        },
        data () {
          return {
              load_dz: true,
              menuData: menuList,
              discoveryList: [],
              cardUrl:'',
              companyId:'',
              timer:null,
              loadFlag:true,
              hasMore:false,
              showPublish: false,
              showPublishImage:false,
              pageNumber:1,
              screenHeight:200,
              postLoad:false,
              showRightDeng:true
          }
        },
        created() {
          this.initData();
        },
        methods: {
            goBack () {
                this.showPublish = false
            },

            onPullingDown (cb) {
                let _this = this;
                setTimeout(() => {
                        _this.pageNumber = 1;
                        _this.getDiscoveryInfoByCompanyIds(_this.pageNumber);
                        _this.timer && clearTimeout(_this.timer)
                        _this.timer = setTimeout(() => {
                           cb()
                       },2000)

                },1000)
            },
            onPullingUp (cb) {
                let _this = this;
                setTimeout(() => {
                   if (_this.hasMore) {
                       _this.pageNumber += 1;
                       _this.getDiscoveryInfoByCompanyIds(_this.pageNumber);
                       _this.timer && clearTimeout(_this.timer)
                       _this.timer = setTimeout(() => {
                           cb()
                       },1000)
                   } else {
                       cb(false)
                   }
                },1000)
            },
            handleMenu (data) {
                switch (data.type) {
                    case 'image':
                        this.screenHeight = document.documentElement.clientHeight - 500;
                        this.onReleaseImage();
                        break;
                    case 'text':
                        this.screenHeight = document.documentElement.clientHeight - 125;
                        this.onReleaseText();
                        break;
                    default:
                        console.log(data.type);
                }
            },

            onLikeTab (item) {
                const _this = this;
                if (_this.load_dz) {
                    _this.load_dz = false
                    let praiseCont = Number(item.praiseNum);
                    let discoveryId = item.rowId;
                    item.already ? praiseCont -= 1 : praiseCont += 1;
                    praiseCont = praiseCont > 0 ? praiseCont : 0;
                    let url = `/zingbiz/discovery/discoveryinfo/updatePraise`;
                    let params = {
                        discoveryId,praiseCont
                    };
                    _this.$http.post(url,params,{ silent: true }).then(res => {
                        if (res.data.success) {
                            this.discoveryList = this.discoveryList.map(item => {
                                if ( item.rowId === discoveryId) {
                                    item.praiseNum = praiseCont;
                                    item.already = !item.already;
                                }
                                return item
                            });
                            _this.load_dz = true
                        }
                    });
                }
            },
            onReleaseImage () {
                this.showPublish = true;
                this.showPublishImage = true;
            },
            onReleaseText () {
                this.showPublish = true;
                this.showPublishImage = false;
            },
            onPostPict (pictureCont) {
                this.showPublish = false;
                this.getDiscoveryInfoByCompanyIds();
            },
            bottomToast (msg, type,wh) {
                let _this = this
                if (!msg) return
                let tp = type ? type : 'success';
                let width = wh ? wh : '8em';
                this.$vux.toast.show({
                    text: msg,
                    type: tp,
                    position: 'middle',
                    width,
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            onRemoveItemPublish (rowId) {
                let _this = this;
                let url = `/zingbiz/discovery/discoveryinfo/deleDiscoveryInfoById`;
                let params = {
                    discoveryId: rowId
                };
                _this.$http.post(url, params).then(res => {
                    if (res.data.success) {
                        _this.bottomToast('删除成功');
                        _this.getDiscoveryInfoByCompanyIds();
                    } else {
                        _this.bottomToast('删除失败')
                    }
                }, err => {
                    console.log(err);
                    _this.bottomToast('删除失败')
                });
            },
            getCardUrl(num) {
                let url = '/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl';
                this.$http.post(url,{}).then(res => {
                    if (res.data.success) {
                        this.cardUrl = res.data.data.cardUrl;
                        this.companyId = res.data.data.companyId;
                        this.getDiscoveryInfo(num)
                    }
                },err => {
                    console.log(err);
                });
            },
            getDiscoveryInfoByCompanyIds(num) {
                if (this.cardUrl) {
                    console.log('getDiscoveryInfo');
                    this.getDiscoveryInfo(num);
                } else {
                    this.getCardUrl(num)
                }
            },
            checkIsDiscoveryAdmin () {
              let url = '/zingbiz/discovery/discoveryinfo/checkIsDiscoveryAdmin';
              this.$http.post(url,{}).then(res => {
                  if (res.data.success) {
                      this.showRightDeng = res.data.data.isDiscoveryAdmin
                  }

              })
            },
            getDiscoveryInfo(num) {
                if (this.loadFlag) {
                    this.loadFlag = false
                    let _this = this;
                    let pageNumber = num || 1;
                    let time = new Date();
                    let url = `/zingbiz/discovery/discoveryinfo/getDiscoveryInfoByCompanyIds?v=${time}`;
                    let params = {
                        pageNumber,
                        pageSize:5,
                        cardUrl: this.cardUrl
                    };
                    _this.$http.post(url,params,{ silent: true }).then(res => {
                        if (res.data.success) {
                            _this.loadFlag = true
                            _this.postLoad = true;
                            let { total,data } = res.data.data;
                            if (!data.length) {
                                _this.hasMore = false;
                                return;
                            }
                            let list = processData(data,_this.cardUrl);
                            if (pageNumber === 1) {
                                _this.discoveryList = list;
                            } else {
                                _this.discoveryList = [..._this.discoveryList,...list];
                            }
                            console.log(_this.discoveryList,'送数据');
                            _this.hasMore = total > _this.discoveryList.length
                        }
                    },err => {
                        console.log(err);
                    })
                }
            },
            initData() {
               this.checkIsDiscoveryAdmin();
               this.getDiscoveryInfoByCompanyIds();
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .find-main
        width: 100%
        height: 100%
        & > div
            width: 100%
</style>
<!--<scroll-->
    <!--:observeDOM="true"-->
    <!--ref="scroll"-->
    <!--:data="dataList"-->
    <!--:pullDownRefresh="{threshold:0,stop:0}"-->
    <!--:scrollbar="true"-->
    <!--:pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }">-->
