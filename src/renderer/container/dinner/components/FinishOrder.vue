<template>
    <div>
    <div class="select-desk" v-show="!selectRoomModal">
        <popup v-model="showOrderFinish" class="zIndexP" height="100%" width="100%" :hide-on-deactivated="false" position="right" :popup-style="{'overflow': 'hidden'}">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="title" :show-bottom-border="false"
                          @on-click-left="cancelFinish" @on-click-right="confirmFinish">
            </popup-header>
            <div :style="{ height: screenHeight + 'px',overflowY:'auto' }">
                <div :style="{ overflowY:'auto' }">
                    <div class="line whiteBlock">
                        <div class="p10" v-for="(item,k) in options" :key="k">
                            <span class="labelTitle">{{item.key}}</span>
                            <span class="labelVal red">{{parseFloat(item.value).toFixed(2)}}</span>
                        </div>

                    </div>
                    <div class="p10 line">收款方式：</div>
                    <div class="p10 whiteBlock">
                        <div class="group" v-for="(item,index) in payType" :key="index">
                            <check-icon :style="{width:'130px'}" @click.native="choosePayType(index)" :value.sync="item.id">{{item.key}}</check-icon>
                            <input class="input moneyInput" v-model="item.value" type="number" placeholder="金额">
                        </div>
                        <div class="group" v-for="(item,index) in payTypeR" :key="index">
                            <check-icon :style="{width:'130px'}" @click.native="choosePayTypeR(index)" :value.sync="item.id">{{item.key}}</check-icon>
                            <input v-show="item.key !== '挂账'" class="input moneyInput" v-model="item.value" type="number" placeholder="金额">
                            <input v-show="item.key === '挂账'" style="width: 25%" class="input moneyInput" v-model="item.value" type="number" placeholder="金额">
                            <!--<input v-if="item.key === '挂账'" v-model="roomName" style="width: 25%" class="input moneyInput" disabled>-->
                            <button v-if="item.key === '挂账'" :style="{maxWidth:'25%'}" class="input moneyInput" @click="doSome">{{roomName ? roomName + "房间" : "选择房间"}}</button>
                        </div>
                    </div>
                    <group>
                        <x-switch title="是否开发票" v-model="isInvoice"></x-switch>
                    </group>
                </div>
            </div>
        </popup>
    </div>
        <select-room :show="selectRoomModal" :tags="transRoomTag"
                     @cancel="selectRoomModal=false" @callback="getRoomInfoCallBack"></select-room>
    </div>
</template>
<script>
    import { Popup,PopupHeader,CheckIcon ,Group,XSwitch } from 'vux';
    import SelectRoom from "../../hotel/components/selectCheckInRoom/SelectCheckInRoom";
    export default {
        name :"FinishOrder",
        components: {
            Popup, PopupHeader, XSwitch, Group, CheckIcon, SelectRoom
        },
        props: {//
            showOrderFinish:{
                type: Boolean,
                default:function () {
                    return false
                }
            },
            finishOrderData :{
                type:Object,
            },
            returnable :{
                type:Object,
            },
            dataAll :{
                type:Object,
            }
        },
        data() {
            return {
                roomId:"",
                roomIds:"",
                roomName:"",
                transRoomTag:[],
                selectRoomModal:false,
                selectCheckIn:true,
                screenHeight:0,
                selected :{},
                title:"结账",
                check:"0",
                payWayData:[],
                payType:[],
                payTypeR:[
                    { key:"挂账",id:false,value:"0.00",payCode:10 },
                    { key:"宴请",id:false,value:"0.00",payCode:13 },
                    { key:"跑单",id:false,value:"0.00",payCode:14 },
                ],
                isInvoice:false,
            }
        },
        computed:{
            options :function () {
                let arr = [];
                if (this.finishOrderData && this.finishOrderData.money) {
                    Object.keys(this.finishOrderData.money).forEach(key => {
                        var obj = {
                            orderAccounts:"合计",
                            discountTotal:"折扣总额",
                            smallTotal:"抹零金额",
                            receivables:"应收金额"
                        };
                        let a = {
                            key:  obj[key],
                            value:this.finishOrderData.money[key]
                        };
                        arr.push(a);
                    });
                }
                return arr;
            }
        },
        watch:{
            showOrderFinish :function (show) {
                if (this.showOrderFinish) {
                    this.payType.forEach(item => {
                        item.id = false
                        item.value = "0.00"
                    })
                    this.transRoomTag = []
                    this.roomId = ""
                    this.payTypeR = [
                        { key:"挂账",id:false,value:"0.00",payCode:10 },
                        { key:"宴请",id:false,value:"0.00",payCode:13 },
                        { key:"跑单",id:false,value:"0.00",payCode:14 },
                    ]
                    this.setPageHeight();
                }
            },
            payType:{
                handler(curVal,oldVal) {
                    let inputCount = 0
                    let hasChoose = false
                    for (let i = 0; i < this.payType.length; i++) {
                        if (this.payType[i].id) {
                            hasChoose = true
                            inputCount = inputCount + parseFloat(this.payType[i].value ? this.payType[i].value : "0.00")
                        }
                    }
                    if (hasChoose) {
                        this.transRoomTag = []
                        this.roomId = ""
                        this.payTypeR = [
                            { key:"挂账",id:false,value:"0.00",payCode:10 },
                            { key:"宴请",id:false,value:"0.00",payCode:13 },
                            { key:"跑单",id:false,value:"0.00",payCode:14 },
                        ]
                    }
                    if (this.finishOrderData.money) {
                        this.finishOrderData.money.smallTotal = hasChoose ? (inputCount - parseFloat(this.options[3].value)).toFixed(2) : "0.00"
                    }
                },
                deep:true
            },
        },
        created() {
            this.initPayWay();
        },
        methods :{
            setPageHeight() {
                this.screenHeight = document.documentElement.clientHeight - 44;
            },
            confirmFinish() {
                this.finish();
            },
            initPayWay() {
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getTradeCodeDishesConfig";
                this.$http
                    .get(url, {})
                    .then(res => {
                        if (res.data.success) {
                            self.payWayData = res.data.data
                            self.payWayData.forEach(item => {
                                self.payType.push({
                                    key:item.descript,id:false,value:"0.00",payCode:item.rowId,subjectCode:item.subjectCode,subjectCodeInv:item.subjectCodeInv
                                })
                            })
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        console.log("error========>",error)
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    });
            },
            doSome() {
                if (!this.payTypeR[0].id){
                    this.$vux.toast.text("请先选择挂账为支付方式", 'bottom');
                    return false
                }
                this.transRoomTag = []
                this.transRoomTag.push({
                    roomId : this.roomId
                })
                this.selectRoomModal = true
            },
            getRoomInfoCallBack(item) {
                this.roomIds = item[0].orderRoomId
                this.roomName = item[0].roomNo
                this.roomId = item[0].roomId
                this.selectRoomModal = false
            },
            cancelFinish() {
                this.roomIds = ""
                this.roomName = ""
                this.$emit('cancel', false);
            },
            choosePayType(index) {
                let isFirst = 0
                this.roomIds = ""
                this.roomName = ""
                for (let i = 0; i < this.payType.length; i++) {
                    if (this.payType[i].id) {
                        isFirst++
                    }
                }
                if (this.payType[index].id) {
                    this.payType[index].value = isFirst < 2 ? this.options[3].value : "0.00"
                } else {
                    this.payType[index].value = "0.00"
                    if (JSON.stringify(this.payType).indexOf(this.options[3].value) < 0) {
                        for (let i = 0; i < this.payType.length; i++) {
                            if (this.payType[i].id) {
                                this.payType[i].value = this.options[3].value
                                break
                            }
                        }
                    }
                }
            },
            choosePayTypeR(index) {
                this.roomIds = ""
                this.roomName = ""
                this.transRoomTag = []
                this.roomId = ""
                let hasChoose = this.payTypeR[index].id
                this.payTypeR[index].value = this.options[3].value
                for (let i = 0; i < this.payTypeR.length; i++) {
                    if (i !== index) {
                        this.payTypeR[i].id = false
                        this.payTypeR[i].value = "0.00"
                    }
                }
                if (hasChoose) {
                    this.payType.forEach(item => {
                        item.id = false
                        item.value = "0.00"
                    })
                } else {
                    this.payTypeR.forEach(item => {
                        item.id = false
                        item.value = "0.00"
                    })
                }
                this.finishOrderData.money.smallTotal = "0.00"
            },
            getPayData() {
                this.transRoomTag = []
                this.roomId = ""
                let payData = {
                    payCode:[],
                    payMoney:0,
                    isChoose:true,
                    isOnAccount:false
                };
                for (let i = 0; i < this.payType.length; i++) {
                    if (this.payType[i].id) {
                        payData.isChoose = false
                        payData.payCode.push({
                            payCode:this.payType[i].payCode,
                            dinnerOrderId :this.finishOrderData.orderId,
                            payMoney:this.payType[i].value,
                            payDesc:this.payType[i].key,
                            subjectCode:this.payType[i].subjectCode,
                            subjectCodeInv:this.payType[i].subjectCodeInv
                        });
                        payData.payMoney += Number(this.payType[i].value);
                        payData.isSubject = true;
                    }
                }
                for (let i = 0; i < this.payTypeR.length; i++) {
                    if (this.payTypeR[i].id) {
                        payData.isChoose = false
                        payData.payCode.push({
                            payCode:this.payTypeR[i].payCode,
                            dinnerOrderId :this.finishOrderData.orderId,
                            payMoney:this.payTypeR[i].value,
                            payDesc:this.payTypeR[i].key,
                        });
                        payData.isOnAccount = this.payTypeR[i].key === '挂账'
                        payData.payMoney = Number(this.payTypeR[i].value);
                        payData.isSubject = false;
                    }
                }
                return payData;
            },
            printBill(paymentsWay,isCloseAccountsPrint,paidInAccounts){
                let self = this
                let printData={
                    //goodsData: JSON.stringify(this.returnable),
                    deskNum:this.dataAll.deskInfo.data[0].deskNum,
                    deskName:this.dataAll.deskInfo.data[0].deskName,
                    deskArea:this.dataAll.deskInfo.data[0].deskArea,
                    dinnerOrderId:this.dataAll.orderInfo.dinnerOrderId,
                    userName:this.dataAll.orderInfo.userName,
                    orderAccounts:this.finishOrderData.money.orderAccounts,
                    receivables:this.finishOrderData.money.receivables,
                    totalDiscount:new Number(this.finishOrderData.money.discountTotal).toFixed(2)
                };
                if(isCloseAccountsPrint){
                    printData.isCloseAccountsPrint="true";
                    printData.paymentsWay=paymentsWay;
                    printData.paidInAccounts=new Number(paidInAccounts).toFixed(2)
                }
                let url = "/zingbiz/dinner/printAccounts"
                this.$http
                    .post(url, printData)
                    .then(res => {
                        if (!res.data.success) {
                            self.$vux.toast.text("打印超时，请检查打印程序...", 'bottom');
                        }
                    })
                    .catch(error => {
                        console.log("error========>",error)
                        self.$vux.toast.text("打印超时，请检查打印程序...", 'bottom')
                    });
            },
            finish() {
                let self = this;
                let url = "/zingbiz/dinner/closeAccounts";
                let payData = this.getPayData();
                if (payData.isChoose) {
                    self.$vux.toast.text("请选择支付方式", 'bottom');
                    return false
                }
                if (payData.isOnAccount && !this.roomIds) {
                    self.$vux.toast.text("请选择挂账房间", 'bottom');
                    return false
                }
                if (parseFloat(payData.payMoney) < (parseFloat(this.finishOrderData.money.receivables)
                        + parseFloat(this.finishOrderData.money.smallTotal))) {
                    self.$vux.toast.text("支付金额错误", 'bottom');
                    return false
                }
                let params = {
                    dinnerOrderId :this.finishOrderData.orderId,
                    orderAccounts : this.finishOrderData.money.orderAccounts,
                    smallTotal : this.finishOrderData.money.smallTotal,
                    receivables:this.finishOrderData.money.receivables,
                    deskId:this.finishOrderData.deskId,
                    deskNum:this.finishOrderData.deskNum,
                    discounts:JSON.stringify(this.finishOrderData.discounts),
                    discountType:this.finishOrderData.discountType,
                    isSetInv:this.isInvoice,
                    paymentsWay:JSON.stringify(payData.payCode),
                    paidInAccounts:payData.payMoney,
                    roomIds:this.roomIds,
                    isOnAccount:payData.isOnAccount ? "true" : "false",
                    quotaConcessions:0,
                    percentDiscount:0,
                    dinnerOrderNo:this.dataAll.orderInfo.dinnerOrderNo,
                    isSubject:payData.isSubject
                };
                //根据打折类型赋值
                if (params.discountType === "1") {
                    params.quotaConcessions = this.finishOrderData.money.discountTotal;
                } else if (params.discountType === "2") {
                    params.percentDiscount = this.finishOrderData.percent;
                }
                console.log(params)
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            setTimeout(function () {
                                self.printBill(params.paymentsWay,true,params.paidInAccounts)
                                self.$emit('confirm',"finish")
                            },3000)
                            self.$vux.toast.text("结账完成,正在跳转订单页...", 'bottom');
                        } else {
                            self.$vux.toast.text("结账失败，请刷新重试", 'bottom');
                        }
                    })
                    .catch(error => {
                        console.log("error========>",error)
                        self.$vux.toast.text("结账失败", 'bottom')
                    });
            },
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .p10 {
        padding: 10px;
    }
    .line{
        border-bottom: 1px solid #D9D9D9;
    }
    .whiteBlock{
        background-color: white;
    }
    .checkbox{
        float : left;
        width: 40px;
    }
    .group{
        height 44px;
        line-height: 44px;
    }
    .labelTitle{
        float: left;
        min-width: 4em;
        text-align: justify;
        text-align-last: justify;
        margin-right: 1em;
    }
    .labelVal{
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
        text-align: right;
    }
    .red{
        color :red;
    }
    .zIndexP{
        z-index: 511 !important;
    }
    .input{
        padding 5px;
        border :1px solid #dadada;
        max-width: 50%
    }
    .vux-popup-header-right {
        color: #ff8000 !important;
    }
</style>
