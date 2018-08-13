<template>
    <div class="resource" style="height: 100%">
        <zing-head :title="'桌位管理'" :isComeBack="false" @doSome="1">
            <div slot="header-left"></div>
        </zing-head>
        <!--<div class="scroll-list-wrap" :style="{ height: screenHeight + 'px',overflow:'auto' }">-->
        <div class="scroll-list-wrap" style="height:calc(100% - 50px);overflow: auto">
            <!--<scroll ref="scroll" :scrollbar="true" :data="[]" :startY="0" :pullUpLoad="{threshold: 0, txt: {more: 'more', noMore: 'noMore'} }">-->
                <ul v-if="deskListData.length > 0">
                    <li v-for="(item,index) in deskListData" v-show="item.deskStatus === '1'" :key="index" @click="clickTheDesk(item)">
                        <GridCard :style="{height: '60px'}">
                            <div slot="cardLeft" class="left">
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">{{item.deskNum}}</p>
                                    <div class="left-wrapper-desc">{{item.deskName}}</div>
                                </div>
                            </div>
                            <div slot="cardRight" class="right">
                                <div><i class="iconfont icon-gengduo" @click.stop="showMoreModal(item)"></i></div>
                                <div><span v-if="item.isOnUse ==='middle' && !item.dinnerOrderId" class="onUse">正在下单</span></div>
                                <div><span v-if="item.isOnUse ==='true' || item.dinnerOrderId" class="onUse">正在使用</span></div>
                            </div>
                        </GridCard>
                    </li>
                </ul>
                <ul v-show="!pageError && deskListData.length < 1">
                    <div class="no-data-style">
                        没有查询到桌位
                    </div>
                </ul>
            <!--</scroll>-->
        </div>
        <x-dialog v-model="showMoreDialog" hide-on-blur>
            <div class="mBtn" @click="viewHistoryOrder">查看历史订单</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='true' || deskTarget.dinnerOrderId" @click="clearDesk">清台</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='middle' && !deskTarget.dinnerOrderId" @click="middleClearDesk">清台</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='true'" @click="changeDeak">换台</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='true'" @click="reminderDesk=true;showMoreDialog=false">催单</div>
        </x-dialog>
        <div v-transfer-dom>
            <confirm ref="personNumRef" v-model="personNumModal" :show-input="true" :title="'宾客人数'" :input-attrs="{type :'number'}"
                     @on-cancel="personNumModal = false" @on-show="defaultPersonNum" :close-on-confirm="false" @on-confirm="confirmToDinner">
            </confirm>
        </div>
        <div>
            <confirm ref="reminder" v-model="reminderDesk" show-input :title="'催单'" :input-attrs="{type :'text'}"
                     @on-show="defaultReminder" :close-on-confirm="false" @on-cancel="reminderDesk = false" @on-confirm="orderReminderkFun">
            </confirm>
        </div>
        <x-dialog v-model="showPrintBox" class="dialog-demo">
            <div class="img-box" style="height:100px;padding:45px 5px;text-align: center">
                {{prentMas}}
            </div>
            <div @click="showPrintBox=false">
                <group>
                    <flexbox :gutter="0">
                        <flexbox-item>
                            <x-button class="btn-save" @click.native="reloadPage" type="primary">知道了</x-button>
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </x-dialog>
        <!--引用组件集-->
        <div class="components">
            <select-desk :showSelectDesk="selectDeskModal" :deskData="deskListNoUse" @selected="confirmSelected" @cancel="cancelSelect"></select-desk>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { XDialog,Confirm,Group,Flexbox,FlexboxItem,XButton,TransferDomDirective as TransferDom } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    import SelectDesk from "@/container/dinner/components/SelectDesk";

    export default {
        name: "deskList",
        directives: {
            TransferDom
        },
        components: {
            Scroll, GridCard, ZingHead, XDialog,Confirm,SelectDesk,Group,Flexbox,FlexboxItem,XButton
        },
        data() {
            return {
                screenHeight:0,
                pageError:true,
                deskListData:[],
                deskListNoUse:[],
                showMoreDialog: false,
                deskTarget:{},
                personNumModal:false,
                selectDeskModal:false,
                ordersDetail:{},//即时订单详情
                reminderDesk:false,//催单
                showPrintBox : false,//打印失败弹框
                prentMas : "",//打印失败信息
                deskPersonNum : "",
                loadTrue:false,
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.setMode(false)
            })
        },
        beforeRouteLeave (to, from, next) {
            this.setMode(true)
            next()
        },
        created() {
            this.setPageHeight();
            setTimeout(() => {
                this.initData();
            },1000)
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            setPageHeight() {
                this.screenHeight = document.documentElement.clientHeight - 100;
            },
            initData(deskUse) {
                let that = this;
                let url = "/zingbiz/dinner/getDeskList";
                let param = {
                    pageNumber: 1,
                    pageSize: 500
                };
                this.$http
                    .get(url, { params:param })
                    .then(res => {
                        if (res.data.success) {
                            that.deskListData = res.data.data.data;
                            console.log("desk=========",that.deskListData)
                            that.pageError = false;
                            if (deskUse && deskUse === "deskUse") {
                                let isUse = false
                                that.deskListData.forEach(row => {
                                    if (that.deskTarget.deskId === row.deskId && row.isOnUse === "false") {
                                        isUse = true
                                    }
                                })
                                if (isUse) {
                                    that.deskPersonNum = that.deskTarget.seatNumber
                                    that.personNumModal = true;
                                } else {
                                    that.$vux.toast.text("桌位正在使用中", 'bottom')
                                }
                            }
                        } else {
                            that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                        that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            showMoreModal(item) {
                this.showMoreDialog = true;
                this.deskTarget = item;
            },
            clickTheDesk(item) { //middle
               this.deskTarget = item;
               if (item.isOnUse === "true" || item.dinnerOrderId) {
                   this.$router.push({
                       path:"/dinner/orderDetails",
                       query:{ dinnerOrderId:item.dinnerOrderId }
                   })
               } else {
                   this.initData("deskUse")
               }
            },
            defaultPersonNum() {
                this.$refs.personNumRef.setInputValue(this.deskPersonNum)
            },
            confirmToDinner(val) {
                let that = this
                if (!val) {
                    this.$vux.toast.text("请输入宾客人数", 'bottom')
                    return false
                }
                this.personNumModal = false
                let url = "/zingbiz/dinner/updateDesk";
                let param = {
                    deskId:this.deskTarget.deskId,
                    isOnUse:"middle"
                }
                this.$http.post(url, param).then(res => {
                    if (res.data.success) {
                        that.$router.push({
                            path:"/dinner/shop",
                            query: {
                                deskId: that.deskTarget.deskId,
                                companyId: that.deskTarget.companyId,
                                personNum: val
                            }
                        })
                    } else {
                        that.$vux.toast.show({
                            text: "桌位修改状态失败，请联系管理员", type: "cancel", onHide() {}
                        })
                    }
                }).catch(error => {
                    that.$vux.toast.show({
                        text: "请求异常，请联系管理员", type: "cancel", onHide() {}
                    })
                })
            },
            showMoreModal(item) {
                this.showMoreDialog = true;
                this.deskTarget = item;
            },
            viewHistoryOrder() {
                this.showMoreDialog = false;
                this.$router.push({
                    path:"/dinner/orderList",
                    query:{ deskId:this.deskTarget.deskId }
                })
            },
            /**middle清台*/
            middleClearDesk() {
                this.showMoreDialog = false;
                let that = this
                let url = "/zingbiz/dinner/updateDesk";
                let param = {
                    deskId:that.deskTarget.deskId,
                    isOnUse:"false"
                }
                this.$http.post(url, param).then(res => {
                    if (!res.data.success) {
                        that.$vux.toast.show({
                            text: "桌位修改状态失败，请联系管理员", type: "cancel", onHide() {}
                        })
                    } else {
                        that.initData()
                    }
                }).catch(error => {
                    that.$vux.toast.show({
                        text: "请求异常，请联系管理员", type: "cancel", onHide() {}
                    })
                })
            },
            /**清台*/
            clearDesk() {
                let self = this;
                this.showMoreDialog = false;
                this.$vux.confirm.show({
                    title: '确定清台吗',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/returnDesk";
                        let param = {
                            deskId : self.deskTarget.deskId
                        };
                        self.$vux.loading.show({
                            text: ''
                        })
                        self.$http
                            .get(url, { params:param })
                            .then(res => {
                                self.$vux.loading.hide()
                                if (res.data.success) {
                                    /*if (res.data.data.data.state === "error") {
                                        self.showPrintBox = true
                                        self.prentMas = res.data.data.data.msg
                                    } else {*/
                                        self.$vux.toast.show({ text:"清台成功", type:"success" })
                                        self.initData();
                                    //}
                                } else {
                                    self.$vux.toast.show({ text:"清台失败", type:"cancel" })
                                }
                            })
                            .catch(error => {
                                that.$vux.toast.show({
                                    text: "清台失败，请重试", type: "cancel", onHide() {}
                                })
                            })
                    }
                })
            },
            reloadPage() {
                this.$vux.toast.show({ text:"清台成功", type:"success" })
                this.initData();
            },
            cancelSelect(flag) {
                this.selectDeskModal = false;
            },
            /**换台*/
            confirmSelected(obj) {
                let self = this;
                if (!obj.deskId) {
                    this.$vux.toast.text("请选择一个台位", 'bottom')
                    return false
                }
                this.selectDeskModal = false;
                let url = "/zingbiz/dinner/covertDesk";
                let param = {
                    deskId : self.deskTarget.deskId,
                    covertDeskId : obj.deskId
                };
                self.$vux.loading.show({
                    text: '请稍后...'
                })
                self.$http
                    .get(url, { params : param })
                    .then(res => {
                        self.$vux.loading.hide()
                        if (res.data.success) {
                            self.$vux.toast.show({ text:"换台成功", type:"success" })
                            self.initData();
                        } else {
                            self.$vux.toast.show({ text:"换台失败", type:"cancel" })
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.show({ text:"换台成功", type:"cancel" })
                    })
            },
            changeDeak() {
                this.showMoreDialog = false;
                this.selectDeskModal = true;
                this.deskListNoUse = []
                for (let i = 0; i < this.deskListData.length; i++) {
                    if (this.deskListData[i].isOnUse === "false") {
                        this.deskListNoUse.push(this.deskListData[i])
                    }
                }
            },
            defaultReminder(){
                this.$refs.reminder.setInputValue('催单')
            },
            orderReminderkFun(val){
                let that = this
                let item = val.replace(/ /g,'')
                if (!item || item === "" || item === null) {
                    this.$vux.toast.text("催单备注不能为空", 'bottom')
                    return false
                } else {
                    let url = "/zingbiz/dinner/reminderRemark"
                    this.reminderDesk = false
                    this.deskTarget.reminderRemark = val
                    if (this.deskTarget.es_score) delete this.deskTarget.es_score
                    if (this.deskTarget._id) delete this.deskTarget._id
                    if (this.deskTarget._routing) delete this.deskTarget._routing
                    console.log(this.deskTarget)
                    this.$http
                        .post(url, this.deskTarget)
                        .then(res => {
                            console.log(res.data)
                            if (res.data.success) {
                                that.$vux.toast.show({ text:"催单成功", type:"success" })
                            } else {
                                that.$vux.toast.show({ text:"催单失败", type:"cancel" })
                            }
                        })
                        .catch(error => {
                            console.log("催单error====",error)
                            that.$vux.toast.show({ text:"催单失败", type:"cancel" })
                        })
                }
            },
            filterDesk(list) {
                let unUse = [];
                list.forEach(item => {
                    if (!item.isOnUse) {
                        unUse.push(item);
                    }
                });
                return unUse;
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .mBtn {
        height : 40px;
        line-height: 40px;
    }
    .onUse{
        font-size 12px;
        color: #cda325;
    }
    .no-data-style{
        margin-top: 20px;
        text-align: center;
        font-size: 18px;
        color: #ff8000;
    }
    .weui-dialog__btn_primary {
        color: #ff8000 !important;
    }
    .resource {
        height: 100%;
        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;
            .left {
                flex: 1;
                flex-center(row, start, center);
                .iconfont{
                    font-size 36px
                }
                &-wrapper {
                    margin-left: 10px;
                    flex: 1;
                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }
                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
            .right {
                flex: 1;
                text-align: right;

                .tag-wrapper {
                    margin-top: 10px;

                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-left {
                &-name {
                    margin-bottom: 10px;
                }
                &-tag-wrapper {
                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-right {
                align-self: flex-start;
            }
            .edit {
                min-height: 40px;
                line-height: 40px;
            }
        }
    }
</style>

