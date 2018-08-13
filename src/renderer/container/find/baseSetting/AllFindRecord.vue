<template>
    <div class="all-find-record">
        <zing-head title="发现记录">
            <div slot="header-right" v-show="showRightDeng && saveList.length">
                  <span class="find-record-btn" @click="onClickRightTitle">
                      {{rightTitle}}
                  </span>
            </div>
        </zing-head>
        <all-publish ref="allPublish" :postLoad="postLoad" warningText="暂无发现" @onPullingUp="onPullingUp" @onPullingDown="onPullingDown" :dataList="saveList" :showInput="showInput" @changeSelected="onChangeSelected" :showAdImage="false"></all-publish>
        <div class="bottom_btn" v-show="showBottom">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" class="weui-btn btn-save weui-btn_primary" @click.native="clickAll">{{selectedFlag}}</x-button>
                </flexbox-item>
                <flexbox-item class="inventory-btn">
                    <x-button type="warn" class="weui-btn btn-common weui-btn_primary" @click.native="onRemove">删除</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import AllPublish from './AllPublish'
    import ZingHead from '@/components/zingHead/ZingHead.vue';
    import { mapMutations } from 'vuex';
    import { Flexbox,FlexboxItem,XButton } from 'vux'
    import { processData } from './findUilt'
    export default {
        name: "AllFindRecord",
        components: {
            AllPublish,ZingHead,Flexbox,FlexboxItem,XButton
        },
        data () {
            return {
                showRight:false,
                saveList:[],
                companyId:'',
                cardUrl:'',
                pageNumber:1,
                hasMore:true,
                showBottom:false,
                rightTitle:'编辑',
                saveSelected:[],
                postLoad:false,
                showRightDeng:false,
                showInput:false,
                selectedList:[] //选中
            }
        },
        computed: {
            selectedFlag () {
                return this.saveList.length ? (this.saveSelected.length === this.saveList.length ? "全不选" : "全选") : "全选"
            }
        },
        created () {
            this.initData();
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.setMode(false)
            })
        },
        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例
            this.setMode(true);
            next();
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            //全选不全选
            clickAll () {
                if (this.selectedFlag === "全选") {
                    if (this.saveSelected.length === this.saveList.length) return;
                    this.saveSelected = [];
                    this.saveList = this.saveList.map(item => {
                        this.saveSelected.push(item.rowId);
                        item.selectInput = true;
                        return item
                    });
                } else {
                  this.clickCancel()
                }
            },
            //取消
            clickCancel() {
                this.saveSelected = [];
                this.saveList = this.saveList.map(item => {
                    item.selectInput = false;
                    return item
                });
            },
            onPullingUp (cb) {
                const _this = this;
                setTimeout(() => {
                    if (_this.hasMore) {
                        _this.pageNumber += 1;
                        _this.getAllDiscoveryInfo(_this.pageNumber);
                        cb()
                    } else {
                        cb(false)
                    }
                },1000)
            },
            onPullingDown (cb) {
                let _this = this;
                setTimeout(() => {
                    _this.pageNumber = 1;
                    _this.getAllDiscoveryInfo(_this.pageNumber);
                    setTimeout(() => {
                        cb()
                    },2000)

                },1000)
            },
            //编辑取消
            onClickRightTitle () {
                if (this.rightTitle === "编辑") {
                    this.rightTitle = "取消";
                    this.showBottom = true
                    this.showInput = true
                } else {
                    this.rightTitle = "编辑";
                    this.showBottom = false
                    this.showInput = false;
                    this.clickCancel()
                }
            },
            // //删除
            // onRemovePublic () {
            // @removeItemPublish="onRemovePublic"
            //     this.getDiscoveryInfoByCompanyId();
            // },
            //选中按钮
            onChangeSelected (rowId) {
                if (this.saveSelected.includes(rowId)) {
                   this.saveSelected = this.saveSelected.filter(item => item !== rowId)
               } else {
                   this.saveSelected.push(rowId)
               }
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
            // getCardUrl(num) {
            //     let url = '/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl';
            //     this.$http.post(url,{}).then(res => {
            //         if (res.data.success) {
            //             this.companyId = res.data.data.companyId;
            //             this.cardUrl = res.data.data.cardUrl;
            //             this.getAllDiscoveryInfo()
            //         }
            //     },err => {
            //         console.log(err);
            //     });
            // },

            onRemove () {
                let saveSelectedList = this.saveSelected;
                if (!saveSelectedList.length) return;
                const _this = this;
                let discoveryIds = saveSelectedList.join(',');
                _this.$vux.confirm.show({
                    title: "删除提示",
                    content: "是否确定删除发现？?",
                    onCancel() {
                        _this.$vux.confirm.hide();
                    },
                    onConfirm() {
                        let url = `/zingbiz/discovery/discoveryinfo/deleDiscoveryInfoByIds`;
                        let params = {
                            discoveryIds
                        };
                        _this.$http.post(url, params).then(res => {
                            console.log(res);
                            if (res.data.success) {
                                _this.bottomToast('删除成功');
                                _this.$emit('removeItem')
                                // _this.getDiscoveryInfoByCompanyId()
                                _this.getAllDiscoveryInfo()
                            } else {
                                _this.bottomToast('删除失败','warn')
                            }
                        },err => {
                            console.log(err);
                            _this.bottomToast('删除失败','warn')
                        });
                    }
                });

            },
            getAllDiscoveryInfo (num) {
                const _this = this;
                let pageNumber = num || 1;
                let url = `/zingbiz/discovery/discoveryinfo/getDiscoveryInfoByCompanyId`;
                let params = {
                    pageNumber,
                    "pageSize":6,
                    companyId: this.companyId
                };
                _this.$http.post(url,params).then(res => {
                    if (res.data.success) {
                        let { total,data } = res.data.data;
                        _this.postLoad = true;
                        if (pageNumber === 1 && !data.length) {
                            _this.saveList = [];
                            return
                        }
                        if (!data.length) {
                            _this.hasMore = false;
                            return;
                        }
                        let list = processData(data,_this.cardUrl,_this.selectedFlag);
                        if (pageNumber === 1) {
                            if (_this.selectedFlag === "全不选") {
                                _this.saveSelected = list.map(item => item.rowId)
                            }
                            _this.saveList = list;
                        } else {
                            if (_this.selectedFlag === "全不选") {
                                list.forEach(item => {
                                    _this.saveSelected.push(item.rowId);
                                })
                            }
                            _this.saveList = [..._this.saveList,...list];
                        }
                        _this.hasMore = total > _this.saveList.length
                    }
                })
            },
            //权限
            checkIsDiscoveryAdmin () {
                let url = '/zingbiz/discovery/discoveryinfo/checkIsDiscoveryAdmin';
                this.$http.post(url,{}).then(res => {
                    if (res.data.success) {
                        this.showRightDeng = res.data.data.isDiscoveryAdmin
                    }

                })
            },
            // getDiscoveryInfoByCompanyId (num) {
            //    if (this.companyId) {
            //        this.getAllDiscoveryInfo(num)
            //    } else {
            //        this.getCardUrl()
            //    }
            // },
            //获取数据
            initData() {
               this.companyId = this.$route.query.companyId;
               this.checkIsDiscoveryAdmin();
               this.getAllDiscoveryInfo()
            }
        }
    }
</script>
<style>
    .all-find-record .vux-flexbox-item{
        margin-left:0 !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    @import '../../../assets/stylus/base.styl';

    .all-find-record
       height 100%

    .find-record-btn
       margin-right: 10px
       border: 1px solid #FF8000
       padding: 2px 8px
       color #FF8000
    .bottom_btn
        position: fixed
        bottom: 0
        width: 100%
        left: 0
        z-index: 10
</style>
