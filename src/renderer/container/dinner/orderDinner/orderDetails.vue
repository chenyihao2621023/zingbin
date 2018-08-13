<template>
    <div class="resource bkColor" style="height: 100%">
        <zing-head :title="title" :isComeBack="false" @doSome="goBackShow">
            <div slot="header-right">
                <span class="header-jiahao" @click="myHome">
                    <i class="icon iconfont icon-guojijiudiandingdan" style="font-size: 25px !important;"></i>
                </span>
            </div>
        </zing-head>
        <div :style="{ height: orderDetail.orderStatus =='0' || this.orderDetail.orderStatus === '-1' ?
            'calc(100% - 50px)':'calc(100% - 100px)',width:'100%',overflowY:'auto' }">
            <div class="orderDetail">
                <div class="whiteBlock">
                    <div class="p10 line">
                        <span>订单号：</span>
                        <span>{{orderDetail.dinnerOrderNo}}</span>
                    </div>
                    <div class="orderInfo p10 grey">
                        <div class="item">
                            <span class="labelTitle">桌号</span>
                            <span class="labelVal">&nbsp;{{deskInfo.deskNum}}</span>
                        </div>
                        <div class="item" v-for="(item,i) in orderInfoKey" :key="i">
                            <span class="labelTitle">{{item.val}}</span>
                            <span class="labelVal">&nbsp;{{orderDetail[item.key] ? orderDetail[item.key]:"--"}}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="p10 grey line" style="text-align: center">订单明细</div>
                    <div v-for="(opt,index) in dinnerTypeKey" :key="index">
                        <div v-if="dinnerData[opt.key].length > 0" class="whiteBlock line m10">
                            <div style="width: 100%" v-for="(time,index) in dinnerDataNew[opt.key].enTimeList" :key="index">
                                <div v-if="index !== 0" style="width: 100%;height: 5px;background: #eeeeee"></div>
                                <div class="line p10 grey">{{opt.val}}：{{time}} -- {{opt.userName}}：{{dinnerDataNew[opt.key].detailsList[time][0].userName}}</div>
                                <GridCard v-for="(item,index) in dinnerDataNew[opt.key].detailsList[time]" :key="index">
                                    <div slot="cardLeft" class="left" style="width: 70%">
                                        <avatar class="imgLeft" style="border-radius: 0px;" shape="square" size="large" :src="item.dinnerImg"></avatar>
                                        <div class="left-wrapper" style="width: 60%">
                                            <p class="m5" style="padding-top: 5px;color:#000 !important;cursor: pointer;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">名称：{{item.dinnerName}}</p>
                                            <p class="m5" style="color:#000 !important;padding: 5px 0px;">数量：{{item.dinnerCounts}}</p>
                                            <p class="m5" style="color:#000 !important;">规格：{{item.modelName}}</p>
                                            <!--<p class="m5 left-wrapper-desc">库存：暂无</p>-->
                                        </div>
                                    </div>
                                    <div slot="cardRight" class="right" style="width: 30%">
                                        <p class="m5" style="color:#000 !important;">
                                            ￥{{Number(item.dinnerPrice).toFixed(2)}}  --  {{item.dinnerDiscount?item.dinnerDiscount:"100"}}%
                                        </p>
                                        <p class="m5" style="color:#888888 !important;padding-top: 5px;">
                                            备注：{{item.dinnerRemarks}}
                                        </p>
                                    </div>
                                </GridCard>
                                <div class="whiteBlock m10 p10" style="height: 40px;">
                                    <span style="float:right;font-weight: 700">备注：{{dinnerDataNew[opt.key].detailsList[time][0].remarks}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="whiteBlock m10">
                <div class="right line p10">
                    <div class="p10 bold">
                        合计：<span class="red">{{orderAccounts}}</span>
                    </div>
                    <x-button v-if="orderDetail.orderStatus =='1'" mini type="primary" @click.native="setDiscount">设置折扣</x-button>
                </div>
                <div class="p10">
                    折扣金额：<span class="red">{{parseFloat(discountTotal).toFixed(2)}}</span>
                </div>
                <div class="right p10 bold">
                    应收金额：<span class="red bold">{{receivables}}</span>
                </div>
            </div>
            <div class="whiteBlock m10" v-if="orderDetail.orderStatus =='0'  || this.orderDetail.orderStatus === '-1'">
                <div class="p10">结账方式：<span>{{formatPayType}}</span></div>
                <div class="p10">实收金额：<span>{{parseFloat(orderDetail.paidInAccounts).toFixed(2)}}</span></div>
                <div class="p10">抹零金额：<span>{{orderDetail.smallTotal ? parseFloat(orderDetail.smallTotal).toFixed(2) : "0.00"}}</span></div>
                <div class="p10">
                    发票信息：<span>{{invSettingInfo&&invSettingInfo.invNumber?invSettingInfo.invNumber:"暂无发票信息"}}</span>
                    <!--v-if="orderDetail.isSetInv && !invSettingInfo.invNumber"-->
                    <span v-if="orderDetail.isSetInv === 'true'" style="float: right;" @click="showModelBox=true"><a>编辑发票</a></span>
                </div>
                <div class="p10">
                    <img v-if="invSettingInfo.invImg" @click="showBigImage=true" height="60px" width="60px" :src="invSettingInfo.invImg"/>
                </div>
            </div>
            <div class="p10 right">
                <button class="print" @click="printOrder">
                    <i class="iconfont icon-baocun-tianchong" style="font-size: 30px"></i>
                    <sapn>打印</sapn>
                </button>
            </div>
        </div>
        <div class="btnList" :style="{width:butWidth}" v-if="orderDetail.orderStatus =='1'">
            <group>
                <flexbox :gutter="0">
                    <flexbox-item v-if="isBackDinner"><x-button class="btn-common" type="primary" :style="{height:'50px'}" @click.native="dropDinner">退菜</x-button></flexbox-item>
                    <flexbox-item><x-button class="btn-save" type="primary" :style="{height:'50px'}" @click.native="addDinner">加菜</x-button></flexbox-item>
                    <flexbox-item v-if="isPayDinner"><x-button class="btn-common" type="warn" :style="{height:'50px'}" @click.native="settleAccounts">结账</x-button></flexbox-item>
                </flexbox>
            </group>
        </div>
        <div class="components">
            <set-discount :showDiscount="setDiscountModal" :returnable="returnableDinner" @confirm="confirmDiscount" @cancel="cancelDiscount"></set-discount>
            <drop-dinner :showDropDinner="dropDinnerModal" :otherData="dropDinnerOther" :returnable="returnableDinner" @cancel="dropDinnerModal = false" @confirm="confirmDropDinner" ></drop-dinner>
            <finish-order :showOrderFinish="finishOrderModal" :dataAll="dataAll" :returnable="returnableDinner" :finishOrderData="finishOrderData" @cancel="finishOrderModal = false" @confirm="confirmFinishOrder"></finish-order>
        </div>
        <div>
            <popup v-model="showModelBox" position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="'确定'" :title="'发票处理'" :show-bottom-border="false"
                              @on-click-left="showModelBox = false" @on-click-right="saveInvSetting"></popup-header>
                <group label-width="4.5em">
                    <x-input title="发票号" :show-clear="false"
                             placeholder="" v-model="invSettingInfo.invNumber" class="fontColor"></x-input>
                    <x-textarea title="备注" :max="2000" placeholder=""
                                v-model="invSettingInfo.invRemarks" class="fontColor"></x-textarea>
                    <image-picker
                        style="margin-top: 10px;"
                        :files="imageList"
                        :companyId="orderDetail.companyId"
                        :selectable="imageList.length<1"
                        multiple
                        @onChange="fliesChange(arguments,index)"
                    />
                </group>
            </popup>
        </div>
        <x-dialog v-model="showBigImage" class="dialog-demo"
                  :dialog-style="{'max-width': '100%', width: '100%', height: '100%'}">
            <i class="iconfont icon-shanchu2 " @click="showBigImage=false"
               style="float: right;font-size: 30px;"></i>
            <div class="img-box">
                <img :src="invSettingInfo.invImg" :style="{'max-height':'95%','max-width':'95%'}">
            </div>
        </x-dialog>
    </div>
</template>
<script>
    import { InlineXNumber, XButton,Flexbox, FlexboxItem,Group,XDialog,XInput,XTextarea,PopupHeader,Popup } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import ZingHead from "@/components/zingHead/ZingHead";
    import SetDiscount from "@/container/dinner/components/SetDiscount";
    import FinishOrder from "@/container/dinner/components/FinishOrder";
    import DropDinner from "@/container/dinner/components/DropDinner";
    import ImagePicker from 'components/imagepicker/ImagePicker';
    import { mapMutations } from 'vuex';
    import { isPc } from '@/utils/fn'
    export default {
        name: "deskList",
        components: {
            Scroll, GridCard, ZingHead, InlineXNumber, XButton, Flexbox, FlexboxItem,Avatar,
            SetDiscount,FinishOrder,DropDinner,Group,XDialog,XInput,ImagePicker,XTextarea,PopupHeader,Popup
        },

        data() {
            return {
                title: "餐饮订单",
                butWidth:"100%",
                isBackDinner:false,
                isPayDinner:false,
                isPc:isPc(),
                dataAll:{},
                isHBig:true,
                showModelBox:false,
                showBigImage:false,
                orderInfoKey:[{ key:"dinnerPersonCounts",val:"人数" },{ key:"genTime",val:"下单时间" },{ key:"userName",val:"服务员" },{ key:"payTime",val:"结账时间" } ,{ key:"accountsName",val:"收银员" }],
                dinnerTypeKey:[{ key:"mainDetailsInfo",val:"点菜时间",userName:"服务员" },{ key:"addDetailsInfo",val:"加菜时间",userName:"服务员" },{ key:"returnDetailsInfo",val:"退菜时间",userName:"服务员" }],
                dinnerTitle:["品名","规格","数量","价格","小计","折扣"],
                orderId: "",
                screenHeight:0,
                orderDetail: {},
                dinnerData:{
                    mainDetailsInfo:[],     //点菜列表
                    addDetailsInfo:[],      //加菜列表
                    returnDetailsInfo:[],   //退菜列表
                },
                dinnerDataNew:{
                    mainDetailsInfo:{},     //点菜列表
                    addDetailsInfo:{},      //加菜列表
                    returnDetailsInfo:{},   //退菜列表
                },
                returnableDinner:[],        //可退菜
                deskInfo: {},
                payRecordInfo: {},
                invSettingInfo: {
                    invImg:"",
                    invNumber:"",
                    invRemarks:""
                },
                setDiscountModal:false,
                orderAccounts:0,        //总金额
                discountTotal:0,        //折扣总额
                receivables:0,           //应收账款
                discountData:{
                    type:"0",           //0 不打，1 定额，2 比例，3 分类，4 菜
                    discounts :[],       //传参
                    percent:0,
                },
                finishOrderModal:false,
                finishOrderData:{},
                dropDinnerModal:false,
                dropDinnerOther:{},
                imageList:[],
                dinnerClazzIdStrs:"",
                accountsRole:"",
            };
        },
        computed:{
          formatPayType:function () {
              let str = "";
              this.payRecordInfo.forEach(item => {
                  if (Number(item.payMoney) !== 0) {
                      str += item.payDesc + "(" + item.payMoney + ")" + " ";
                  }
              })
              return str;
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
            if(this.isPc) {
                this.butWidth = "calc(100% - 200px)"
            }
            this.parseUrl();
            this.setPageHeight();
            this.initData();
            this.initReturnable();
            this.lodeRole();
        },
        methods: {
            setPageHeight() {
                this.screenHeight = document.documentElement.clientHeight - 100;
                let screenWidth = document.documentElement.clientWidth - document.documentElement.clientHeight;
                this.isHBig = screenWidth >  0 ? true : false
            },
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            parseUrl() {
                this.orderId = this.$route.query.dinnerOrderId;
            },
            lodeRole() {
                let that = this;
                let url = "/zingbiz/auth/role/loadMyRole";
                this.$http.post(url, {}).then(res => {
                    if (res.data.success) {
                        res.data.data.forEach(item => {
                            if (item.resInfoVal === "13-11") {
                                that.isBackDinner = true
                            }
                            if (item.resInfoVal === "13-10") {
                                that.isPayDinner = true
                            }
                        })
                    } else {
                        that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    }
                }).catch(error => {
                    that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            initReturnable() {
                let self = this;
                let url = "/zingbiz/dinner/getReturnDeshesInfo";
                this.$http
                    .get(url, { params: { dinnerOrderId: this.orderId }})
                    .then(res => {
                        if (res.data.success) {
                            self.returnableDinner = res.data.data;
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    });
            },
            initData() {
                let self = this;
                let url = "/zingbiz/dinner/getDinnerOrdersDetailData";
                this.$http
                    .get(url, { params: { dinnerOrderId: this.orderId }})
                    .then(res => {
                        if (res.data.success) {
                            console.log(res.data.data)
                            self.dataAll = res.data.data
                            self.orderDetail = res.data.data.orderInfo;
                            self.dinnerData.addDetailsInfo = res.data.data.addDetailsInfo;
                            self.dinnerData.mainDetailsInfo = res.data.data.mainDetailsInfo;
                            self.dinnerData.returnDetailsInfo = res.data.data.returnDetailsInfo;
                            self.dinnerDataNew.addDetailsInfo = this.handleData(res.data.data.addDetailsInfo)
                            self.dinnerDataNew.mainDetailsInfo = this.handleData(res.data.data.mainDetailsInfo)
                            self.dinnerDataNew.returnDetailsInfo = this.handleData(res.data.data.returnDetailsInfo)
                            self.deskInfo = res.data.data.deskInfo.data[0];
                            self.payRecordInfo = res.data.data.payRecordInfo.data;
                            self.invSettingInfo = res.data.data.invSettingInfo.data[0] ? res.data.data.invSettingInfo.data[0]
                            : {
                                invImg:"",
                                invNumber:"",
                                invRemarks:""
                            };
                            self.imageList = self.invSettingInfo && self.invSettingInfo.invImg ?
                                [{ url : self.invSettingInfo.invImg }] : []
                            self.flushData();
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    });
            },
            handleData(data) {
                let main = {}
                let mainStr = []
                let userName = ""
                data.forEach(item => {
                    if (mainStr.join(",").indexOf(item.genTime) < 0) {
                        main[item.genTime] = []
                        main[item.genTime].push(item)
                        mainStr.push(item.genTime)
                    } else {
                        main[item.genTime].push(item)
                    }
                })
                return { detailsList:main,enTimeList:mainStr }
            },
            closeModelBox() {
                this.showModelBox=false
                this.invSettingInfo = {
                    invImg:"",
                    invNumber:"",
                    invRemarks:""
                }
            },
            saveInvSetting() { //发票编辑
                let params = {}
                if (!this.invSettingInfo.invNumber) {
                    this.$vux.toast.text("发票号不能为空", 'bottom')
                    return false
                }
                params.invNumber = this.invSettingInfo.invNumber
                params.invImg = this.invSettingInfo.invImg
                params.invRemarks = this.invSettingInfo.invRemarks
                if (!this.invSettingInfo.dinnerInvId) {
                    params.dinnerOrderId = this.orderDetail.dinnerOrderId
                }
                params.dinnerInvType = "-1"
                let self = this;
                let url = "/zingbiz/dinner/saveDinnerInvSetting";
                this.$http
                    .post(url, params)
                    .then(res => {
                        self.showModelBox = false
                        if (res.data.success) {
                            self.$vux.toast.text("添加发票成功", 'bottom')
                            self.initData();
                            self.initReturnable();
                        } else {
                            self.$vux.toast.text("添加发票失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("添加发票失败，请重试", 'bottom')
                    });
            },
            //上传图片组件方法
            fliesChange(event,index) {
                let images = []
                if (event[1] === "add") {
                    this.imageList = event[0];
                    for (let i = 0; i < event[0].length; i++) {
                        images.push(event[0][i].url)
                    }
                    this.invSettingInfo.invImg = images.join(" ")
                }
                if (event[1] === "remove") {
                    this.imageList = event[0];
                    for (let i = 0; i < event[0].length; i++) {
                        images.push(event[0][i].url)
                    }
                    this.invSettingInfo.invImg = images.join(" ")
                }
            },
            setDiscount() {
                this.setDiscountModal = true;
            },
            goBackShow(){
                this.$router.push({ path: "/dinner/deskList" });
            },
            /**确认打折---------------todo 待优化-----------------------------------优化----------*/
            confirmDiscount(obj) {
                this.setDiscountModal = false;
                //1.清空前次打折
                this.discountData.type = obj.discountType;
                this.discountData.discounts = [];
                this.discountData.percent = 0;

                this.dinnerData.mainDetailsInfo.forEach(item => {
                    item.dinnerDiscount = "100";
                });
                this.dinnerData.addDetailsInfo.forEach(item => {
                    item.dinnerDiscount = "100";
                });
                this.dinnerData.returnDetailsInfo.forEach(item => {
                    item.dinnerDiscount = "100";
                });
                //设置打折  2比例打折，3分类打折
                if (obj.discountType === "2" || obj.discountType === "3") {
                    if (obj.discountType === "2") {
                        this.discountData.percent = obj.value[0].dinnerDiscount;
                    }
                    obj.value.forEach(item => {
                        let obj = {
                            dinnerClazzId :item.dinnerClazzId,
                            dinnerDiscount:item.dinnerDiscount ? item.dinnerDiscount : "100",
                            dinnerOrderId:this.orderId
                        };
                        //组织传参数据
                        this.discountData.discounts.push(obj);
                        //设置打折数据(涉及页面更新)
                        this.dinnerData.mainDetailsInfo.forEach(item => {
                            if (item.dinnerClazzId === obj.dinnerClazzId) {
                                item.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                        this.dinnerData.addDetailsInfo.forEach(item => {
                            if (item.dinnerClazzId === obj.dinnerClazzId) {
                                item.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                        this.dinnerData.returnDetailsInfo.forEach(item => {
                            if (item.dinnerClazzId === obj.dinnerClazzId) {
                                item.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                    });
                } else if (obj.discountType === "4") {      //4菜品打折
                    obj.value.forEach(item => {
                        let obj = {
                            modelId:item.modelId,
                            dinnerId :item.dinnerId,
                            dinnerDiscount:item.dinnerDiscount ? item.dinnerDiscount : "100",
                            dinnerOrderId:this.orderId
                        };
                        //组织传参数据
                        this.discountData.discounts.push(obj);
                        //设置打折数据(涉及页面更新)
                        this.dinnerData.mainDetailsInfo.forEach(mainData => {
                            if (mainData.modelId === obj.modelId) {
                                mainData.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                        this.dinnerData.addDetailsInfo.forEach(addData => {
                            if (addData.modelId === obj.modelId) {
                                addData.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                        this.dinnerData.returnDetailsInfo.forEach(returnData => {
                            if (returnData.modelId === obj.modelId) {
                                returnData.dinnerDiscount = obj.dinnerDiscount
                            }
                        });
                    });
                }
                //刷新页面
                this.flushData(obj);
            },
            //主要刷新：总金额、总折扣、应收金额
            flushData(obj) {
                let tempTotal = 0;
                let tempDiscount = 0;
                //点的菜
                this.dinnerData.mainDetailsInfo.forEach(item => {
                    let oneTotal = Number(item.dinnerPrice) * Number(item.dinnerCounts);
                    tempTotal += oneTotal;
                    tempDiscount += (oneTotal * ((100 - item.dinnerDiscount) / 100));
                });
                //加的菜
                this.dinnerData.addDetailsInfo.forEach(item => {
                    let oneTotal = Number(item.dinnerPrice) * Number(item.dinnerCounts);
                    tempTotal += oneTotal;
                    tempDiscount += (oneTotal * ((100 - item.dinnerDiscount) / 100));
                });
                //退的菜 ---虽然退菜不打折，但加减菜是按流水插入的，因此上面打过折的要加回来
                this.dinnerData.returnDetailsInfo.forEach(item => {
                    let oneTotal = Number(item.dinnerPrice) * Number(item.dinnerCounts);
                    tempTotal += oneTotal;
                    tempDiscount += (oneTotal * ((100 - item.dinnerDiscount) / 100));
                });

                //总折扣  如果有打折，且为定额打折 1
                if (obj && obj.discountType === "1" || this.orderDetail.discountType === "1") {
                    this.discountTotal = !obj.value ? 0 : obj.value;
                } else {//receivables
                    this.discountTotal = (Number.isNaN(tempDiscount) ? 0 : Number(tempDiscount).toFixed(2));
                }
                //总金额
                this.orderAccounts = Number(tempTotal).toFixed(2);
                //应收金额
                this.receivables = Number(this.orderAccounts - this.discountTotal).toFixed(2);
            },
            /**取消打折*/
            cancelDiscount(obj) {
                this.setDiscountModal = false;
            },
            /**退菜*/
            dropDinner() {

                this.dropDinnerOther = {
                  orderId:this.orderId,
                  userName:this.orderDetail.userName,
                  deskInfo:this.deskInfo
                };
                this.dropDinnerModal = true;
            },
            /**加菜*/
            addDinner() {
                this.$router.push({
                    path:"/dinner/shop",
                    query:{
                        dinnerOrderId:this.orderId
                    }
                })
            },
            /**结账*/
            settleAccounts() {
                this.finishOrderData = {
                    orderId:this.orderId,
                    deskId:this.deskInfo.deskId,
                    deskNum:this.deskInfo.deskNum,
                    money:{
                        orderAccounts:this.orderAccounts,
                        discountTotal:this.discountTotal,
                        smallTotal:"0.00",
                        receivables:this.receivables
                    },
                    discounts:this.discountData.discounts,
                    discountType:this.discountData.type,
                    percent:this.discountData.percent,
                };
                this.finishOrderModal = true;
            },
            confirmFinishOrder(obj) {
                this.initData(obj);
                this.finishOrderModal = false;
            },
            confirmDropDinner(obj) {
                this.initData();
                this.initReturnable();
                this.dropDinnerModal = false;
            },
            //打印订单
            printOrder() {
                let self = this;
                let url = "/zingbiz/dinner/printAccounts";
                let params = {
                    //goodsData: JSON.stringify(this.returnableDinner),
                    deskNum :this.deskInfo.deskNum,
                    deskName:this.deskInfo.deskName,
                    deskArea:this.deskInfo.deskArea,
                    dinnerOrderId:this.orderId,
                    orderAccounts:this.orderAccounts,
                    receivables:this.receivables,
                    totalDiscount:this.discountTotal,
                    userName:this.orderDetail.userName
                };
                //如果已结账
                if (this.orderDetail.orderStatus === "0" || this.orderDetail.orderStatus === "-1") {
                    let arr = [];
                    this.payRecordInfo.forEach(item => {
                        arr.push({
                            payCode:item.payCode,
                            payDesc:item.payDesc,
                            payMoney:item.payMoney,
                        });
                    });
                    params.isCloseAccountsPrint = "true";
                    params.paymentsWay = JSON.stringify(arr);
                    params.paidInAccounts = this.orderDetail.paidInAccounts;
                }
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            self.$vux.toast.text("打印成功", 'bottom')
                        } else {
                            self.$vux.toast.text("打印失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                        self.$vux.toast.text("打印失败，请重试", 'bottom')
                })
            },
            myHome() {
                this.$router.push({
                    path:"/dinner/deskList",
                })
            }
        }
    };
</script>
<style scoped>
    .item .labelTitle{
        float: left;
        min-width: 4em;
        text-align: justify;
        text-align-last: justify;
        margin-right: 1em;
    }
    .item .labelVal{
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
        text-align: right;
    }
    .bkColor{
        background-color: #eeeeee; }
    .whiteBlock{
        background-color: white;}
    .p10 {
        padding: 10px; }
    .pt5{
        padding-top: 5px;
    }
    .m10 {
        margin-top: 5px }
    .grey {
        color: #999999;}
    .line{
        border-bottom: 1px solid #D9D9D9;}
    .orderDetail .item{
        margin-top: 10px;
    }
    .bold{
        font-weight: bold;
    }
    .red{
        color: red;
    }
    .right{
        text-align: right;
    }
    .flex{
        display: flex;
    }
    .w30{
        width: 25%;
    }
    .w10{
        width: 25%;
    }
    .dd-title{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    .print{
        width: 60px;
        //font-size: 14px;
        border-radius: 5px;
        padding-bottom: 0px;
        padding-top: 5px;
        line-height: 1.5;
    }
    .btnList {
        position: absolute;
        width: 100%;
        bottom: 0px;
        .butOne{
            height: 50px;
        }
    }
    .img-box{
        text-align: center;
        margin-top: 30px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .vux-x-textarea.weui-cell {
        border-bottom: 1px solid #f4f4f4;
    }
</style>

