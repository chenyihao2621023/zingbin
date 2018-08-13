<template>
    <div class="deskListNew" style="height: 100%">
        <zing-head :title="'桌位管理'" :isComeBack="false" @doSome="1">
            <div slot="header-left">
                <popup-picker
                    :show.sync="showPopupPicker"
                    :data="filterAreaList"
                    :columns="2"
                    ref="picker"
                    :show-cell="false"
                    @on-change="changeArea"
                >
                </popup-picker>
                <div class="popupTitle" @click="showPopupPicker = true">
                    <span>{{popupTitle}}</span>
                    <i class="iconfont icon-youjiantou" style="font-size: 10px;"></i>
                </div>
            </div>
            <div slot="header-right">
                <dropdown v-if="isGoDinner" :data="dropDownMenu" :placementXAbs="-30" trigger="click" placement="bottomRight" @item-click="handleMenu">
                    <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                        <span class="header-jiahao">
                            <i class="iconfont icon-gengduo"></i>
                        </span>
                    </a>
                </dropdown>
            </div>
        </zing-head>
        <div class="scroll-list-wrap" style="height:calc(100% - 50px);overflow: auto">
            <!--v-if="deskType.areaId === deskAreaItem.areaTypeId"-->
            <div v-if="deskTypeList.length > 0 && deskListData.length > 0">
                <div v-if="areaId === '0' || deskType.areaId === areaId" v-for="(deskType,indexType) in deskTypeList" :key="indexType">
                    <div class="deskType" :style="indexType===0?{marginTop:'0px'}:{}">
                        <span>{{deskType.areaTypeName}}</span>
                    </div>
                    <div style="margin:13px;margin-right: 8px;">
                        <flexbox :gutter="0" wrap="wrap">
                            <flexbox-item :span="span" v-for="(desk,deskIndex) in deskListData" :key="deskIndex"
                                          v-if="deskType.areaTypeId === desk.deskTypeId&&desk.deskStatus==='1'" >
                                <div class="flex-demo" @click="clickTheDesk(desk)">
                                    <div style="padding: 5px;">
                                        <div style="height: 70px">
                                            <p style="font-size: 18px;">{{desk.deskNum}}</p>
                                            <p style="padding: 5px 0px">{{desk.deskName}}</p>
                                            <p>{{desk.deskPicture ? desk.deskPicture : 0}}/{{desk.seatNumber}}</p>
                                        </div>
                                        <!--<div :style="{ float:'right',marginTop:desk.deskName?'-60px':'-47px',marginRight:'-5px'}">-->
                                        <div :style="{ float:'right',marginTop:'-76px',marginRight:'-5px'}">
                                            <i class="iconfont icon-gengduo" style="font-size: 28px" @click.stop="showMoreModal(desk)"></i>
                                        </div>
                                    </div>
                                    <div v-if="desk.isOnUse === 'middle'" class="isOrder" style="background: #17C295"><span>待下单</span></div>
                                    <div v-if="desk.isOnUse === 'true'" class="isOrder"><span>待结账</span></div>
                                </div>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </div>
            </div>
            <ul v-if="deskTypeList.length < 1 && deskListData.length < 1 && showNoData">
                <div class="no-data-style">
                    没有查询到桌位
                </div>
            </ul>
        </div>
        <x-dialog v-model="showMoreDialog" hide-on-blur>
            <div class="mBtn" @click="viewHistoryOrder">查看历史订单</div>
            <div class="mBtn" v-if="isClearDinner" v-show="deskTarget.isOnUse==='true' || deskTarget.dinnerOrderId" @click="clearDesk">清台</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='middle' && !deskTarget.dinnerOrderId" @click="middleClearDesk">清台</div>
            <div class="mBtn" v-if="isChengeDinner" v-show="deskTarget.isOnUse==='true'" @click="changeDeak">换台</div>
            <div class="mBtn" v-show="deskTarget.isOnUse==='true'" @click="reminderDesk=true;showMoreDialog=false">催单</div>
        </x-dialog>
        <popup v-model="personNumModal" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'宾客人数'" :show-bottom-border="false"
                          @on-click-left="personNumModal = false" @on-click-right="confirmToDinner">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="人数：" type="number" mask="9999" v-model="deskPersonNum"></x-input>
                </group>
            </div>
        </popup>
        <popup v-model="reminderDesk" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'催单'" :show-bottom-border="false"
                          @on-click-left="reminderDesk = false" @on-click-right="orderReminderkFun">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="催单：" v-model="reminderk"></x-input>
                </group>
            </div>
        </popup>
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
        <out-work :dinnerOutWorkShow="dinnerOutWorkShow" :userLogin="userLogin" :outWorkDetails="outWorkDetails" @outWorkBack="outWorkBack" @outWork="outWork"></out-work>
        <!--引用组件集-->
        <div class="components">
            <select-desk :showSelectDesk="selectDeskModal" :deskData="deskListNoUse" @selected="confirmSelected" @cancel="cancelSelect"></select-desk>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { isPc,getThumbUrl } from '@/utils/fn'
    import { dateFormat } from '@/utils/date'
    import { Popup,PopupHeader,PopupPicker,XInput,XDialog,Confirm,Group,Flexbox,FlexboxItem,XButton,Selector,TransferDomDirective as TransferDom } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    import OutWork from "@/container/dinner/orderDinner/dinnerOutWorkDetails"
    import SelectDesk from "@/container/dinner/components/SelectDesk";
    import Dropdown from '@/components/dropdown/Dropdown';

    export default {
        name: "deskListNew",
        directives: {
            TransferDom
        },
        components: {
            Popup,PopupHeader,PopupPicker,XInput,Scroll, GridCard, ZingHead, XDialog,Confirm,SelectDesk,Group,Flexbox,FlexboxItem,XButton,Dropdown,Selector,OutWork
        },
        data() {
            return {
                span:1/3,
                dinnerOutWorkShow:false,
                showPopupPicker: false,
                popupTitle:"全部分类",
                isGoDinner:false,
                isChengeDinner:false,
                isClearDinner:false,
                showNoData:false,
                pageError:true,
                reminderk:"催单",
                defaultArea:"all",
                areaId:"0",
                nowCardUrl:"",
                deskAreaItem:{},
                controlDeskAll:false,//上下班数据
                deskListData:[],
                deskTypeList:[],
                deskAreaList:[],
                deskListNoUse:[],
                dropDownMenu: [{ content: "签到", url: "" }],
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
                userLogin:{},
                outWorkDetails:{},
            }
        },
        computed:{
            filterAreaList() {
                let filterArr = [{ value: "all", name: "全部区域",parent: 0 }];
                this.deskAreaList.forEach((item,index) => {
                    let dat = {};
                    dat.value = index;
                    dat.name = item.areaTypeName;
                    dat.parent = 0;
                    filterArr.push(dat);
                });
                return filterArr;
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
            if (isPc()) {
                this.span = 1/((document.documentElement.clientWidth - 200)/133)
            } else if (document.documentElement.clientWidth >= 600) {
                this.span = 1/(document.documentElement.clientWidth/133)
            } else {
                this.span = 1/3
            }
            setTimeout(() => {
                this.initData()
                this.lodeRole()
                this.loadAreaTypeList()
                this.loadCompany()
            },1000)
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            loadCompany() {
                let url = "/zingbiz/auth/user/getThisUserInfo";
                let that = this;
                this.$http
                    .post(url, {})
                    .then(res => {
                        that.userLogin = res.data.data;
                    })
                    .catch(err => {
                        console.log("getThisUserInfo ==== ", err);
                    });
            },
            lodeRole() {
                let that = this;
                let url = "/zingbiz/auth/role/loadMyRole";
                this.$http.post(url, {}).then(res => {
                        if (res.data.success) {
                            res.data.data.forEach(item => {
                                if (item.resInfoVal === "knottingClassFunctionPower") {
                                    that.isGoDinner = true
                                }
                                if (item.resInfoVal === "changeTableFcunctionPower") {
                                    that.isChengeDinner = true
                                }
                                if (item.resInfoVal === "cleanTableFunctionPower") {
                                    that.isClearDinner = true
                                }
                            })
                        } else {
                            that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                    that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            loadAreaTypeList(inWork,clickData) {
                let that = this;
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                let deskListUrl = "/zingbiz/dinner/getAreaTypeList";
                this.$http
                    .get(deskListUrl, { params :param })
                    .then(res => {
                        if (res.data.success) {
                            let al = []
                            let tl = []
                            let isFirst = true
                            res.data.data.data.forEach((item,index) => {
                                if (item.stated !== "ALL") {
                                    item.stated === "TYPE" ? tl.push(item) : al.push(item)
                                } else {
                                    isFirst = false
                                    that.dropDownMenu =  [{ content: item.areaTypeTag === "0" ? "签到" : "结班", url: "" }],
                                    that.controlDeskAll = item
                                    if (inWork) {
                                        this.isInOutFun(inWork,item,clickData)
                                    }
                                }
                            })
                            if (isFirst) {
                                console.log("=====初次开班=====")
                                that.dropDownMenu =  [{ content:"结班", url: "" }],
                                    that.controlDeskAll = {}
                                if (inWork) {
                                    this.isInOutFun(inWork,{},clickData)
                                }
                            }
                            that.deskTypeList = tl
                            that.deskAreaList = al
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {
                    that.$message({ type: "error", message: "加载失败，请重试" });
                });
            },
            isInOutFun(inWork,item,clickData) {
                if (inWork && inWork === "inWork") {
                    if (!item.areaTypeTag || item.areaTypeTag === "0") {
                        this.inOUtWork("1")
                    } else {
                        this.$vux.toast.text("已经开班，可直接使用", 'bottom')
                    }
                }
                if (inWork && inWork === "outWork") {
                    if (item.areaTypeTag === "0") {
                        this.$vux.toast.text("已经结班", 'bottom')
                    } else {
                        this.dinnerOutWorkShow = true
                        this.outWorkDetails = {
                            companyId:this.userLogin.companyId,
                            cardUrl:this.userLogin.cardUrl,
                            startDate: this.controlDeskAll.createTime,
                            endDate: dateFormat(new Date())
                        }
                    }
                }
                if (inWork && inWork === "clickDesk") {
                    if(!this.controlDeskAll || this.controlDeskAll.areaTypeTag === "0") {
                        this.$vux.toast.text("开班后才可以使用", 'bottom')
                        return
                    }
                    this.deskTarget = clickData;
                    if (clickData.isOnUse === "true" || clickData.dinnerOrderId) {
                        this.$router.push({
                            path:"/dinner/orderDetails",
                            query:{ dinnerOrderId:clickData.dinnerOrderId }
                        })
                    } else {
                        this.initData("deskUse")
                    }
                }
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
                            that.showNoData = true
                            that.nowCardUrl = res.data.data.nowCardUrl
                            that.pageError = false;
                            if (deskUse && deskUse === "deskUse") {
                                this.deskUseFun(that.deskListData)
                            }
                            if (deskUse && deskUse === "isOutWork") {
                                this.outWorkFun(that.deskListData)
                            }
                        } else {
                            that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                        that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            deskUseFun(deskListData) {
                let isUse = false
                deskListData.forEach(row => {
                    if (this.deskTarget.deskId === row.deskId && row.isOnUse === "false") {
                        isUse = true
                    }
                })
                if (isUse || this.deskTarget.useCardUrl === this.nowCardUrl) {
                    this.deskPersonNum = this.deskTarget.seatNumber
                    this.personNumModal = true;
                } else {
                    this.$vux.toast.text("桌位正在使用中", 'bottom')
                }
            },
            outWorkFun(deskListData) {
                let isUse = false
                deskListData.forEach(row => {
                    if (row.isOnUse !== "false") {
                        isUse = true
                    }
                })
                if (isUse) {
                    this.$vux.toast.text("桌位正在使用中,结班失败", 'bottom')
                } else {
                   this.loadAreaTypeList("outWork")
                }
            },
            outWork() {
                this.dropDownMenu[0].content = "签到"
                this.inOUtWork("0")
            },
            outWorkBack() {
                this.dinnerOutWorkShow = false
            },
            showMoreModal(item) {
                if(!this.controlDeskAll || this.controlDeskAll.areaTypeTag === "0") {
                    return
                }
                this.showMoreDialog = true;
                this.deskTarget = item;
            },
            clickTheDesk(item) { //middle
                this.loadAreaTypeList("clickDesk",item)
            },
            handleMenu(data) {
                if (data.content === "签到") {
                    this.dropDownMenu[0].content = "结班"
                    this.loadAreaTypeList("inWork")
                } else if (data.content === "结班") {
                    this.initData("isOutWork")
                }
            },
            inOUtWork(areaTypeTag) {
                let that = this
                let url = "/zingbiz/dinner/isInWork"
                let param = {
                    areaTypeId : this.controlDeskAll ? this.controlDeskAll.areaTypeId : "",
                    areaTypeTag : areaTypeTag,
                    dinnerWorkId : this.controlDeskAll ? this.controlDeskAll.areaId : "",
                }
                this.$http
                    .post(url, param)
                    .then(res => {
                        if (res.data.success) {
                            that.dinnerOutWorkShow = false
                            this.loadAreaTypeList()
                            this.initData();
                            that.$vux.toast.show({ text:areaTypeTag === "1" ? "签到成功" : "结班成功", type:"success" })
                        } else {
                            that.$vux.toast.show({ text:areaTypeTag === "1" ? "签到失败" : "结班失败", type:"cancel" })
                        }
                    })
                    .catch(error => {
                        console.log("===error====",error)
                        that.$vux.toast.show({ text:areaTypeTag === "1" ? "签到失败" : "结班失败", type:"cancel" })
                    })
            },
            confirmToDinner() {
                let that = this
                if (!this.deskPersonNum) {
                    this.$vux.toast.text("请输入宾客人数", 'bottom')
                    return false
                }
                //this.personNumModal = false
                let url = "/zingbiz/dinner/updateDesk";
                let param = {
                    deskId:this.deskTarget.deskId,
                    isOnUse:"middle",
                    useCardUrl:this.nowCardUrl,
                    deskPicture:this.deskPersonNum
                }
                this.$http.post(url, param).then(res => {
                    if (res.data.success) {
                        this.personNumModal = false
                        that.$router.push({
                            path:"/dinner/shop",
                            query: {
                                deskId: that.deskTarget.deskId,
                                companyId: that.deskTarget.companyId,
                                personNum: this.deskPersonNum
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
                    isOnUse:"false",
                    deskPicture:0
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
                    title: '提示',
                    content: '确定清台吗?',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/returnDesk";
                        let param = {
                            deskId : self.deskTarget.deskId,
                            deskPicture:0
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
                    deskPicture:self.deskTarget.deskPicture ? self.deskTarget.deskPicture : 0,
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
            orderReminderkFun(){
                let that = this
                let item = this.reminderk.replace(/ /g,'')
                if (!item || item === "" || item === null) {
                    this.$vux.toast.text("催单备注不能为空", 'bottom')
                    return false
                } else {
                    let url = "/zingbiz/dinner/reminderRemark"
                    this.reminderDesk = false
                    this.deskTarget.reminderRemark = this.reminderk
                    if (this.deskTarget.es_score) delete this.deskTarget.es_score
                    if (this.deskTarget._id) delete this.deskTarget._id
                    if (this.deskTarget._routing) delete this.deskTarget._routing
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
            },
            changeArea(key) {
                if (key[0] === "all") {
                    this.areaId = "0";
                    this.popupTitle = "全部分类"
                } else {
                    this.areaId = this.deskAreaList[key[0]].areaTypeId
                    this.popupTitle = this.deskAreaList[key[0]].areaTypeName
                }
            },
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .vux-popup-header-right {
        color: #ff8000 !important;
    }
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
    .deskListNew {
        height: 100%;
        .popupTitle {
            margin-left: 13px;
        }
        .flex-demo {
            border: 1px solid #ff8000;
            height: 150px;
            background-color: #fff;
            border-radius: 4px;
            background-clip: padding-box;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .isOrder {
            float: right;
            width: 80%;
            height: 60px;
            border-radius: 5px;
            text-align: center;
            margin-right: 10%;
            color: #fff;
            padding-top: 22px;
            background: #ff8000;
        }
        .deskType {
            width: 100%;
            height: 30px;
            padding-top: 8px;
            color: #fff;
            background: #888888;
            margin-top: 5px;
            padding-left: 13px;
            padding-right: 5px;
        }
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

