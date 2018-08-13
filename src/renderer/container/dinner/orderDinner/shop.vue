<template>
    <div style="height: 100%">
        <zing-head :title="'点餐'">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="hideSearch('icon')"></i>
                </span>
            </div>
        </zing-head>
        <div v-show="isShowSearch">
            <search
                class="search"
                @on-blur="searchBlur"
                @on-cancel="hideSearch"
                @on-change="getResultSearch"
                @on-submit="onSubmitSearch"
                ref="dinnerSearch"></search>
        </div>
        <!--<div :style="{height:screenHeight + 'px'}">-->
        <div :style="{height:'calc(100% - 98px)',background: '#fff'}">
            <div class="goods" :style="{bottom:'48px'}">
                <div v-show="!isShowSearch" class="menu-wrapper" ref="menuWrapper">
                    <ul class="clazz-ul">
                        <li class="menu-item" v-for="(item,index) in clazzDataList" :key="index"
                            :class="{active : clazzIndex !== -1 ? clazzIndex === index : currentIndex === index}"
                            @click="chooseClazz(index,$event)">
                            <span class="text border-1px" >{{item.dinnerClazzName}}</span>
                        </li>
                    </ul>
                </div>
                <div class="foods-wrapper" :style="{marginTop:isShowSearch?'44px':0}" ref="foodWrapper">
                    <ul class="foods-ul" style="background: #fff">
                        <li class="food-list food-list-hook"
                            v-for="(clazzItem,clazzIndex) in clazzDataList" :key="clazzIndex">
                            <h1 v-show="!isShowSearch" class="title">{{clazzItem.dinnerClazzName}}</h1>
                            <ul>
                                <li class="food-item border-1px" v-for="(dinnerItem,dinnerIndex) in dinnerList"
                                    :key="dinnerIndex" v-if="clazzItem.dinnerClazzId === dinnerItem.dinnerClazzId && dinnerItem.isShow">
                                    <div class="icon">
                                        <img width="57" height="57" :src="dinnerItem.dinnerImg">
                                    </div>
                                    <div class="content">
                                        <h2 class="name" style="width:200px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{dinnerItem.dinnerName}}</h2>
                                        <p class="description" style="width:200px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{dinnerItem.dinnerDescribe}}</p>
                                        <div class="price">￥<span class="now">{{dinnerItem.dinnerPriceMin}}</span>
                                            <div class="cartcontrol-wrapper" :style="{right:rightM}" v-if="dinnerItem.dinnerModelInfo.length === 1">
                                                <div class="cartcontrol">
                                                    <div v-if="(dinnerItem.dinnerModelInfo[0].addCarNum + '').indexOf('.') >= 0" v-show="dinnerItem.dinnerModelInfo[0].addCarNum > 0" class="inner iconfont icon-shanchu"></div>
                                                    <div v-else v-show="dinnerItem.dinnerModelInfo[0].addCarNum > 0" @click="delDinnerCar(dinnerItem)" class="inner iconfont icon-shanchu"></div>
                                                    <div class="count" v-show="dinnerItem.dinnerModelInfo[0].addCarNum > 0" @click="addNumber(dinnerItem)">{{dinnerItem.dinnerModelInfo[0].addCarNum}}</div>
                                                    <div v-if="(dinnerItem.dinnerModelInfo[0].addCarNum + '').indexOf('.') >= 0" class="add iconfont icon-tianjia1"></div>
                                                    <div v-else class="add iconfont icon-tianjia1" @click="addDinnerCar(dinnerItem)"></div>
                                                </div>
                                            </div>
                                            <div class="cartcontrol-wrapper" :style="{right:rightM}" v-else>
                                                <div class="cartcontrol">
                                                    <x-button style="background: #eee" :mini="true" @click.native="showModel(dinnerItem)">选规格</x-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <div class="shopcart">
                <div class="content">
                    <div class="content-left">
                        <div class="logo-wrapper">
                            <div class="logo active">
                                <i class="iconfont icon-caigou-tianchong active" @click="showCarDinnerList"
                                   style="font-size:38px; color:#ffffff;"></i>
                            </div>
                            <div class="num" style="">{{parseInt(addCount)}}</div>
                        </div>
                        <div class="price active">￥{{countPrice}}元</div>
                    </div>
                    <div class="content-right">
                        <div class="pay" v-if="(addCount) === 0">请点菜</div>
                        <div class="pay active" v-else @click="goOrder">去下单</div>
                    </div>
                </div>
                <div class="shopcart-list" v-show="showCarList">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="emptyCar">清空</span>
                    </div>
                    <div class="list-content" ref="shopcartS">
                        <ul class="car-ul">
                            <li class="food" v-for="(item,index) in dinnerCarList" :key="index">
                                <div class="name" style="width: 50%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{item.dinnerName}}{{item.dinnerModelInfo[0].modelName ? "(" + item.dinnerModelInfo[0].modelName + ")" : ""}}</div>
                                <p style="padding-top: 10px;" @click="showTagFun(index)">
                                    <span class="iconfont icon-fabubiaoshu"></span>
                                    <span style="color: #93999f;font-size: 12px;">备注：{{(carItemtagData["inputTag"+index] ? carItemtagData["inputTag"+index]+" " : "") +
                                            (carItemtagData[index] ? carItemtagData[index].join(" ") : "")}}</span>
                                </p>
                                <div class="price">
                                        <span>
                                            ￥{{(((item.dinnerModelInfo[0].dinnerPrice*Math.pow(10,(item.dinnerModelInfo[0].dinnerPrice+"").indexOf(".")>=0?
                                            (item.dinnerModelInfo[0].dinnerPrice+"").split(".")[1].length:0))
                                            *(item.dinnerModelInfo[0].addCarNum*Math.pow(10,(item.dinnerModelInfo[0].addCarNum+"").indexOf(".")>=0?
                                            (item.dinnerModelInfo[0].addCarNum+"").split(".")[1].length:0)))/
                                            (Math.pow(10,(item.dinnerModelInfo[0].dinnerPrice+"").indexOf(".")>=0?
                                            (item.dinnerModelInfo[0].dinnerPrice+"").split(".")[1].length:0) *
                                            Math.pow(10,(item.dinnerModelInfo[0].addCarNum+"").indexOf(".")>=0?
                                            (item.dinnerModelInfo[0].addCarNum+"").split(".")[1].length:0))).toFixed(2)}}
                                        </span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <div class="cartcontrol">
                                        <div v-if="(item.dinnerModelInfo[0].addCarNum + '').indexOf('.') >= 0" class="decrease iconfont icon-shanchu"></div>
                                        <div v-else class="decrease iconfont icon-shanchu" @click="delDinnerCar(item)"></div>
                                        <div class="count" @click="addNumber(item)">{{item.dinnerModelInfo[0].addCarNum}}</div>
                                        <div v-if="(item.dinnerModelInfo[0].addCarNum + '').indexOf('.') >= 0" class="add iconfont icon-tianjia1"></div>
                                        <div v-else class="add iconfont icon-tianjia1" @click="addDinnerCar(item)"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="list-mask" v-show="showCarList" @click="showCarList = false"></div>
        </div>
        <!--  标签弹框 -->
        <div>
            <div>
                <popup v-model="showTag" style="z-index: 515;">
                    <div style="background-color:#f3f5f7;margin:0 auto;border-radius:5px;padding-top:10px;">
                        <div style="min-height: 330px;background: #ffffff;">
                            <group style="padding-bottom: 10px">
                                <x-input :show-clear="false" placeholder="输入备注（选填）" v-model="inputTag" class="fontColor"></x-input>
                            </group>
                            <group>
                                <checker v-model="tagData" type="checkbox" default-item-class="demo4-item"
                                         selected-item-class="demo4-item-selected" disabled-item-class="demo4-item-disabled">
                                    <checker-item v-for="(item,index) in tagDataList" :key="index" :value="item.labelName">
                                        {{item.labelName}} </checker-item>
                                </checker>
                            </group>
                        </div>
                        <div>
                            <group>
                                <flexbox :gutter="0">
                                    <flexbox-item>
                                        <x-button class="btn-save" type="warn" @click.native="closeTag">取消</x-button>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <x-button class="btn-common" type="primary" @click.native="chooseTag(inputTag)">选择</x-button>
                                    </flexbox-item>
                                </flexbox>
                            </group>
                        </div>
                    </div>
                </popup>
            </div>
        </div>
        <!--  model弹框  -->
        <x-dialog v-model="showModelBox" class="dialog-demo"
                  :dialog-style="{'max-width': '90%', width: '100%', height: '200px',background: '#f5f7fa',marginTop: '30%'}">
            <p class="dialog-title">选择规格</p>
            <i class="iconfont icon-shanchu2" @click="showModelBox=false"
               style="float: right;font-size: 30px;margin-top: -34px;margin-right: 4px;"></i>
            <div class="img-box" style="text-align: left;height: 110px;overflow-y: auto;">
                <checker v-model="modelChoose" default-item-class="demo4-item"
                    selected-item-class="demo4-item-selected" disabled-item-class="demo4-item-disabled">
                    <checker-item v-for="(modelItem,modelIdex) in modelBoxData.dinnerModelInfo"
                                  :key="modelIdex" :value="modelItem.modelId">
                        {{modelItem.modelName}} </checker-item>
                </checker>
            </div>
            <div style="position: absolute;left: 10px;bottom: 30px;">
                价格：<span style="color: red">￥{{Number(modelBoxData.dinnerId ? Number(modelNum)===0 ? Number(modelBoxData.dinnerModelInfo[modelindex].dinnerPrice)
                : Number(modelBoxData.dinnerModelInfo[modelindex].dinnerPrice)*Number(modelNum) : "0.00").toFixed(2)}}</span>
            </div>
            <div class="cartcontrol-wrapper" v-show="modelChoose">
                <div class="cartcontrol">
                    <div v-if="(modelNum + '').indexOf('.') >= 0" class="decrease iconfont icon-shanchu"></div>
                    <div v-else class="decrease iconfont icon-shanchu" @click="delDinnerCar(modelBoxData,'model')"></div>
                    <div class="count" @click="addNumber(modelBoxData,'model')">{{modelNum}}</div>
                    <div v-if="(modelNum + '').indexOf('.') >= 0" class="add iconfont icon-tianjia1"></div>
                    <div v-else class="add iconfont icon-tianjia1" @click="addDinnerCar(modelBoxData,'model')"></div>
                </div>
            </div>
        </x-dialog>
        <x-dialog v-model="showPrintBox" class="dialog-demo">
            <div class="img-box" style="height:100px;padding:45px 5px;text-align: center">
                {{prentMas}}
            </div>
            <div @click="showPrintBox=false">
                <group>
                    <flexbox :gutter="0">
                        <flexbox-item>
                            <x-button class="btn-save" @click.native="toOrderPage" type="primary">知道了</x-button>
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </x-dialog>
        <popup v-model="addNum" height="100%" width="100%" position="right" style="z-index: 5001;">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'手动输入数字'" :show-bottom-border="false"
                          @on-click-left="addNum = false" @on-click-right="addNumFun">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="数量：" type="number" v-model="dinnerNum"></x-input>
                </group>
            </div>
        </popup>
        <popup v-model="orderRemark" height="100%" width="100%" style="z-index: 511;" position="right">
            <popup-header v-if="isClick" :left-text="'取消'" :right-text="'确定'" :title="'订单备注'" :show-bottom-border="false"
                          @on-click-left="orderRemark = false" @on-click-right="orderRemarkFun">
            </popup-header>
            <popup-header v-else :left-text="'取消'" :right-text="'确定'" :title="'订单备注'" :show-bottom-border="false"
                          @on-click-left="" @on-click-right="">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="备注：" v-model="remarkOrder"></x-input>
                </group>
            </div>
        </popup>
        <loading-dinner v-show="showLoading"></loading-dinner>
        <section v-show="showLoading" style="z-index: 1000">
            <img src="../../../assets/img/shop_back_svg.svg">
        </section>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import BScroll from 'better-scroll'
    import ZingHead from "@/components/zingHead/ZingHead"
    import loadingDinner from '@/container/dinner/orderDinner/loading'
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import { isPc,getThumbUrl } from '@/utils/fn'
    import { Checker, CheckerItem, XDialog, Group, XButton,Popup,PopupHeader,Flexbox,FlexboxItem,Confirm,Search,Loading,XInput } from 'vux'
    export default {
        name: "shop",
        components: {
            loadingDinner, ZingHead, GridCard, Avatar, XDialog, Checker, CheckerItem, Group, XButton,Popup,
            Flexbox,FlexboxItem,Confirm,Search,Loading,PopupHeader,XInput
        },
        data() {
            return {
                isClick:true,
                dinnerNum:"",
                remarkOrder:"",
                addNum:false,
                dinnerIndex:0,
                modelindex:0,
                modelStr:"",
                isPc:isPc(),
                rightM:"10px",
                screenHeight: 0,//高度
                showPrintBox:false,
                prentMas:"",//打印机提示
                printDinnerOrderId:"",//打印失败订单保存成功id
                isShowSearch:false,//搜索显示隐藏
                searchData:"",//搜索框数据
                searchDataChina:false,//是否为中文
                clazzIndex:-1,//选中的餐饮序号
                showLoading: true, //显示加载动画
                clazzDataList: [],//分类列表
                dinnerList: [],//菜品列表
                dinnerCarList:[],//购物车菜品列表
                addCount:0,//菜品添加的总量
                countPrice:0,//总金额
                countModelPrice:0,//总金额多model
                showCarList:false,//显示隐藏购物车列表
                showTag:false,
                tagCarIndex:0,//选择tag时下标
                tagDataList:[],
                tagData:[],
                inputTag:"",
                carItemtagData:{},
                showModelBox:false,//选择型号弹框
                modelChoose:null,//选择的model
                showChoose:false,//是否显示选择按钮
                modelBoxData:{},//当前菜品型号
                modelNum:0,//当前型号的菜品添加的数量
                disabledClick:true,
                deskId:"",
                companyId:"",
                personNum:"",
                dinnerOrderId:"",
                orderRemark:false,//订单备注弹框
                //滑动参数
                listHeight:[],//高度集合
                scrollY:0,
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
        computed:{
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            }
        },
        watch: {
            modelChoose:{
                handler(curVal,oldVal) {
                    if (!this.modelChoose) {
                        this.modelNum = 0
                        this.modelindex = 0
                    } else {
                        for (let i = 0; i < this.modelBoxData.dinnerModelInfo.length; i++) {
                            if (this.modelBoxData.dinnerModelInfo[i].modelId === this.modelChoose) {
                                this.modelNum = this.modelBoxData.dinnerModelInfo[i].addCarNum
                                this.modelindex = i
                            }
                        }
                    }
                },
                deep:true
            },
            dinnerCarList:{
                handler(curVal,oldVal) { //
                    this.countPrice = 0
                    this.addCount = 0
                    for (let i = 0; i < curVal.length; i++) {
                        let str = curVal[i].dinnerModelInfo[0].addCarNum + ""
                        if (str.indexOf(".") >= 0) {
                            this.addCount = this.addCount + 1
                        } else {
                            this.addCount = this.addCount + curVal[i].dinnerModelInfo[0].addCarNum
                        }
                        let strNum = curVal[i].dinnerModelInfo[0].addCarNum + ""
                        let strPrice= curVal[i].dinnerModelInfo[0].dinnerPrice + ""
                        let lenNum = 0
                        let lenPrice = 0
                        if (strNum.indexOf(".") >= 0) {
                            lenNum = strNum.split(".")[1].length
                        }
                        if (strPrice.indexOf(".") >= 0) {
                            lenPrice = strPrice.split(".")[1].length
                        }
                        this.countPrice =  this.countPrice + (((Number(strNum)*Math.pow(10,lenNum))*(Number(strPrice)*Math.pow(10,lenPrice)))/(Math.pow(10,lenNum)*Math.pow(10,lenPrice)))
                    }
                    this.countPrice = Number(this.countPrice).toFixed(2)
                    if(this.addCount === 0){
                        this.showCarList = false
                    }
                },
                deep:true
            },
            searchData:{
                handler(curVal,oldVal) { //
                    this.foodsScroll.scrollTo(0,0)
                    let curValList = curVal.toUpperCase().split("")
                    for (let i = 0; i < this.dinnerList.length; i++) {
                        this.dinnerList[i].isShow = true
                        if (this.dinnerList[i].dinnerName.indexOf(curVal) < 0) {
                            let notes = false
                            let dinnerInitialList = this.dinnerList[i].dinnerInitial.split(" ")
                            let dinnerInitialStr = dinnerInitialList.join("")
                            let io = dinnerInitialList.indexOf(curValList[0])
                            if ((dinnerInitialList.length - (io)) >= curValList.length) {
                                if (curVal.length > 1) {
                                    for (let j = 0; j < curValList.length; j++) {
                                        let remunber = ""
                                        let num = -1
                                        for (let z = 0; z < dinnerInitialList.length; z++) {
                                            if (dinnerInitialList[z].indexOf(curValList[j]) >= 0) {
                                                num = z
                                                remunber = remunber + "1"
                                            } else {
                                                remunber = remunber + "0"
                                            }
                                        }
                                        if (num === -1 || !dinnerInitialList[num + 1] || dinnerInitialList[num + 1].indexOf(curValList[j + 1]) < 0) {
                                            remunber = remunber.replace(/1/g, '0');
                                        }
                                        if (remunber.indexOf("1") < 0) {
                                            notes = true
                                            break
                                        }
                                        if (j === (curValList.length - 2)) {
                                            break
                                        }
                                    }
                                } else {
                                    if (dinnerInitialStr.indexOf(curVal.toUpperCase()) < 0) {
                                        notes = true
                                    }
                                }
                                /*for (let j = 0; j < curValList.length; j++) {
                                    let index = dinnerInitialStr.indexOf(curValList[j])
                                    if (curValList.length >= 2 && j <= (curValList.length - 2)) {
                                        let indexB = dinnerInitialStr.indexOf(curValList[j+1])
                                        if (index < 0 || indexB < 0 || index !== (indexB - 1)) {
                                            notes = true
                                            break
                                        }
                                    } else if (index < 0) {
                                        notes = true
                                        break
                                    }
                                }*/
                                if (notes) {
                                    this.dinnerList[i].isShow = false
                                    this.$set(this.dinnerList,i,this.dinnerList[i])
                                }
                            } else {
                                this.dinnerList[i].isShow = false
                                this.$set(this.dinnerList,i,this.dinnerList[i])
                            }
                        }
                    }
                },
                deep:true
            },
        },
        created() { //
            this.screenHeight = document.documentElement.clientHeight - 50;
            this.personNum = this.$route.query.personNum
            this.deskId = this.$route.query.deskId
            this.companyId = this.$route.query.companyId
            this.dinnerOrderId = this.$route.query.dinnerOrderId
            if(this.isPc) {
                this.rightM = "200px"
            }
            this.initAllClazzDinner()
            this.initTag()
            let that = this;
            window.addEventListener("hashchange", function(e) { //监听返回事件
                //console.log(e.newURL)
                let url = "/zingbiz/dinner/updateDesk";
                let param = {
                    deskId:that.deskId,
                    isOnUse:"false",
                    deskPicture:0,
                }
                that.$http.post(url, param).then(res => {
                    if (!res.data.success) {
                        that.$vux.toast.show({
                            text: "桌位修改状态失败，请联系管理员", type: "cancel", onHide() {}
                        })
                    }
                }).catch(error => {
                    that.$vux.toast.show({
                        text: "请求异常，请联系管理员", type: "cancel", onHide() {}
                    })
                })
            }, {once: true});
        },
        mounted(){
            this.$nextTick(function () {
                this.initDinnerScroll()
                this.calculateHeight()
            })
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            searchBlur() {
                if (this.isShowSearch && !this.addNum) {
                    this.$refs.dinnerSearch.setFocus()//设置获取焦点
                }
            },
            initTag() {
                let that = this;
                let url = "/zingbiz/dinner/getLabelList";
                let param = {pageNumber: 0, pageSize: 1000};
                this.$http.get(url, {params: param}).then(res => {
                    if (res.data.success) {
                        that.tagDataList = res.data.data.data;
                    } else {
                        that.$vux.toast.show({
                            text: "加载失败，请重试", type: "cancel", onHide() {
                            }
                        })
                    }
                }).catch(error => {
                    that.$vux.toast.show({
                        text: "请求异常，请重试", type: "cancel", onHide() {
                        }
                    })
                })
            },
            initAllClazzDinner() {
                let that = this;
                let url = "/zingbiz/dinner/getOrderDishesInfo";
                let param = {
                    pageNumber: 0,
                    pageSize: 1000
                };
                this.$http.get(url, {params: param}).then(res => {
                    that.showLoading = false //隐藏loading动画
                    let useData = []
                    let useClazz = []
                    if (res.data.success) {
                        console.log("=========res=========",res.data.data)
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].dinnerInfo.length > 0) {
                                res.data.data[i].dinnerInfo.forEach(dinnerItem => {
                                    dinnerItem.dinnerImg = getThumbUrl(dinnerItem.dinnerImg, 100, 100, "/ZingVue/static/images/ysImg.png", false)
                                    dinnerItem.dinnerPriceMin = parseFloat(dinnerItem.dinnerPriceMin).toFixed(2)
                                    dinnerItem.isShow = true
                                    dinnerItem.dinnerModelInfo.forEach(modelItem => {
                                        modelItem.addCarNum = 0
                                    })
                                    useData.push(dinnerItem)
                                })
                                useClazz.push(res.data.data[i])
                            }
                        }
                        that.dinnerList = useData
                        that.clazzDataList = useClazz
                    } else {
                        that.$vux.toast.show({
                            text: "加载失败，请重试", type: "cancel", onHide() {
                            }
                        })
                    }
                }).catch(error => {
                    that.showLoading = false //隐藏loading动画
                    that.$vux.toast.show({
                        text: "请求异常，请重试", type: "cancel", onHide() {
                        }
                    })
                })
            },
            initDinnerScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper,{
                    click:true,   //允许better-scroll列表上的点击事件
                    mouseWheel: { //鼠标滚动事件
                        speed: 20, //鼠标滚动速度
                        invert: false,//是否为反方向滚动
                        easeTime: 300//缓动时间
                    }
                })
                this.foodsScroll = new BScroll(this.$refs.foodWrapper,{
                    click:true,
                    probeType : 3,   //让better-scroll监听scroll事件
                    mouseWheel: { //鼠标滚动事件
                        speed: 20, //鼠标滚动速度
                        invert: false,//是否为反方向滚动
                        easeTime: 300//缓动时间
                    }
                })
                this.cartScroll = new BScroll(this.$refs.shopcartS,{
                    click:true,
                    mouseWheel: { //鼠标滚动事件
                        speed: 20, //鼠标滚动速度
                        invert: false,//是否为反方向滚动
                        easeTime: 300//缓动时间
                    }
                })
                this.foodsScroll.on('scroll',(pos) => {
                    this.scrollY =Math.abs(Math.round(pos.y));
                })
                this.foodsScroll.on('touchEnd',(pos) => {
                    this.clazzIndex = -1
                })
            },
            hideSearch(icon) {
                if (icon === "icon") {
                    this.isShowSearch = !this.isShowSearch
                } else {
                    this.isShowSearch = false
                }
                for (let i = 0; i < this.dinnerList.length; i++) {
                    this.dinnerList[i].isShow = true
                }
            },
            addNumber(dinnerIndex,model) {
                this.dinnerIndex = dinnerIndex
                this.modelStr = model
                this.addNum = true
            },
            addNumFun() {
                let num = Number(this.dinnerNum)
                if (num < 0) {
                    this.$vux.toast.text("请输入大于0的数字", 'bottom');
                    return false
                }
                this.addDinnerCar(this.dinnerIndex,this.modelStr,num)
                this.addNum = false
            },
            getResultSearch(val) { //搜索输入
                let item = val.replace(/ /g,'')
                this.searchData = item
            },
            onSubmitSearch() {  //搜索提交

            },
            calculateHeight() {
                let foodList = this.$refs.foodWrapper.getElementsByClassName("food-list-hook");
                setTimeout(() => {
                    let height = 0;
                    this.listHeight.push(height);
                 /*
                 * clientHeight 获取不到margin 所以加18
                 * */
                  for (let i = 0; i < foodList.length; i++) {
                        let item = foodList[i];
                        height += (item.clientHeight + 18)
                        this.listHeight.push(height)
                    }
                }, 3000)
            },
            chooseClazz(index,event) { //选择的分类
                /*if(!event._constructed) {
                    return ;
                }*/
                this.clazzIndex = index
                let foodList = this.$refs.foodWrapper.getElementsByClassName("food-list-hook");
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el,300);
            },
            showModel(item){
                this.showModelBox=true
                this.modelChoose = null
                this.showChoose = false
                this.modelBoxData=JSON.parse(JSON.stringify(item));
            },
            showTagFun(index) {
                this.showTag=true;
                this.showCarList = false
                this.tagCarIndex=index;
                let propN = "inputTag" + index
                this.inputTag = this.carItemtagData[propN] ? this.carItemtagData[propN] : ""
                this.tagData = this.carItemtagData[index] ? this.carItemtagData[index] : []
            },
            chooseTag(inputTag) {
                this.showTag = false;
                this.showCarList = true
                //this.tagData.push(this.inputTag)
                let propN = "inputTag" + this.tagCarIndex
                this.carItemtagData[propN] = inputTag ? inputTag : ""
                this.carItemtagData[this.tagCarIndex] = this.tagData
            },
            closeTag() {
                this.showTag = false;
                this.showCarList = true
                this.tagData = this.carItemtagData[this.tagCarIndex] ? this.carItemtagData[this.tagCarIndex] : []
            },
            addDinnerCar(dinnerItem,model,num){ //菜品数量加一
                let modelCar = {}
                let isIndex = true
                //处理商品列表数据
                for (let i = 0; i < this.dinnerList.length; i++) {
                    for (let j = 0; j < this.dinnerList[i].dinnerModelInfo.length; j++) {
                        if (model === "model") {
                            if (this.dinnerList[i].dinnerModelInfo[j].modelId === this.modelChoose) {
                                this.showChoose = true
                                if (num || num === 0) {
                                    dinnerItem.dinnerModelInfo[j].addCarNum = num //当前菜品加一
                                } else {
                                    dinnerItem.dinnerModelInfo[j].addCarNum = dinnerItem.dinnerModelInfo[j].addCarNum + 1 //当前菜品加一
                                }
                                this.modelNum = dinnerItem.dinnerModelInfo[j].addCarNum //model数量
                                this.$set(this.dinnerList,i,dinnerItem)
                                //选出当前model
                                modelCar = JSON.parse(JSON.stringify(dinnerItem))
                                modelCar.dinnerModelInfo = [modelCar.dinnerModelInfo[j]]
                            }
                        } else {
                            if (this.dinnerList[i].dinnerModelInfo[j].modelId === dinnerItem.dinnerModelInfo[0].modelId) {
                                if (num || num === 0) {
                                    this.dinnerList[i].dinnerModelInfo[j].addCarNum = num //当前菜品加一
                                } else {
                                    this.dinnerList[i].dinnerModelInfo[j].addCarNum = this.dinnerList[i].dinnerModelInfo[j].addCarNum + 1 //当前菜品加一
                                }
                                modelCar = JSON.parse(JSON.stringify(this.dinnerList[i]))
                                this.$set(this.dinnerList,i,this.dinnerList[i])
                            }
                        }
                    }
                }
                //处理购物车数据
                for (let i = 0; i < this.dinnerCarList.length; i++) {
                    if (model === "model") {
                        if (this.dinnerCarList[i].dinnerModelInfo[0].modelId === this.modelChoose) {
                            isIndex = false
                            if (num || num === 0) {
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = num //当前菜品加一
                            } else {
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = this.dinnerCarList[i].dinnerModelInfo[0].addCarNum + 1 //购物车列表中当前菜品加一
                            }
                            this.$set(this.dinnerCarList,i,this.dinnerCarList[i])
                        }
                    } else {
                        if (this.dinnerCarList[i].dinnerModelInfo[0].modelId === dinnerItem.dinnerModelInfo[0].modelId) {
                            isIndex = false
                            if (num || num === 0) {
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = num //当前菜品加一
                            } else {
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = this.dinnerCarList[i].dinnerModelInfo[0].addCarNum + 1 //购物车列表中当前菜品加一
                            }
                            this.$set(this.dinnerCarList,i,this.dinnerCarList[i])
                        }
                    }
                }
                if (isIndex) {
                    this.dinnerCarList.push(modelCar)
                }
            },
            delDinnerCar(dinnerItem,model){ //菜品数量减一
                for (let i = 0; i < this.dinnerList.length; i++) {
                    for (let j = 0; j < this.dinnerList[i].dinnerModelInfo.length; j++) {
                        if (model === "model") {
                            if (this.dinnerList[i].dinnerModelInfo[j].modelId === this.modelChoose) {
                                if (dinnerItem.dinnerModelInfo[j].addCarNum > 0) {
                                    if (this.dinnerList[i].dinnerModelInfo[j].addCarNum > 1) {
                                        dinnerItem.dinnerModelInfo[j].addCarNum = dinnerItem.dinnerModelInfo[j].addCarNum - 1//当前菜品加一
                                    } else {
                                        dinnerItem.dinnerModelInfo[j].addCarNum = 0
                                    }
                                    this.modelNum = dinnerItem.dinnerModelInfo[j].addCarNum //model数量
                                    this.$set(this.dinnerList,i,dinnerItem)
                                }
                            }
                        } else {
                            if (this.dinnerList[i].dinnerModelInfo[j].modelId === dinnerItem.dinnerModelInfo[0].modelId) {
                                if (this.dinnerList[i].dinnerModelInfo[j].addCarNum > 1) {
                                    let num = this.dinnerList[i].dinnerModelInfo[j].addCarNum - 1
                                    this.dinnerList[i].dinnerModelInfo[j].addCarNum = num
                                } else {
                                    this.dinnerList[i].dinnerModelInfo[j].addCarNum = 0
                                }
                                this.$set(this.dinnerList,i,this.dinnerList[i])
                            }
                        }
                    }
                }
                //处理购物车数据
                for (let i = 0; i < this.dinnerCarList.length; i++) {
                    if (model === "model") {
                        if (this.dinnerCarList[i].dinnerModelInfo[0].modelId === this.modelChoose) {
                            if (this.dinnerCarList[i].dinnerModelInfo[0].addCarNum > 1) {
                                let num = this.dinnerCarList[i].dinnerModelInfo[0].addCarNum - 1
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = num
                                this.$set(this.dinnerCarList,i,this.dinnerCarList[i])
                            } else {
                                this.dinnerCarList.splice(i,1)
                                this.showChoose = false
                            }
                        }
                    } else {
                        if (this.dinnerCarList[i].dinnerModelInfo[0].modelId === dinnerItem.dinnerModelInfo[0].modelId) {
                            if (this.dinnerCarList[i].dinnerModelInfo[0].addCarNum > 1) {
                                let num = this.dinnerCarList[i].dinnerModelInfo[0].addCarNum - 1
                                this.dinnerCarList[i].dinnerModelInfo[0].addCarNum = num

                                this.$set(this.dinnerCarList,i,this.dinnerCarList[i])
                            } else {
                                this.dinnerCarList.splice(i,1)
                            }
                        }
                    }
                }
            },
            pointAdd(num) {
                let len = 0
                let str = num + ""
                if(str.indexOf(".") >= 0) {
                    len = str.split(".")[1].length
                }
                return len
            },
            showCarDinnerList() { //显示购物车列表
                this.$nextTick(() => {
                    if(this.addCount > 0){
                        this.cartScroll.scrollTo(0, 0, 300)//第一次滑动不生效问题
                        this.showCarList = true
                    }
                })
            },
            emptyCar(){ //清空购物车列表
                this.dinnerCarList = []
                for (let i = 0; i < this.dinnerList.length; i++) {
                    for (let j = 0; j < this.dinnerList[i].dinnerModelInfo.length; j++) {
                        this.dinnerList[i].dinnerModelInfo[j].addCarNum = 0 //当前菜品加一
                        this.$set(this.dinnerList,i,this.dinnerList[i])
                    }
                }
            },
            goOrder() {
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
                            let isUse = false
                            res.data.data.data.forEach(row => {
                                if (row.useCardUrl) {
                                    if (that.deskId === row.deskId && row.isOnUse !== "middle"
                                        && res.data.data.nowCardUrl !== row.useCardUrl) {
                                        isUse = true
                                    }
                                }
                            })
                            if (isUse) {
                                this.$vux.toast.text("该台位已被清台，请重新进入", 'bottom')
                            } else {
                                this.orderRemark = true
                            }
                        } else {
                            that.$vux.toast.text("台位信息错误，请重试", 'bottom')
                        }
                    }).catch(error => {
                        console.log("error=========>>",error)
                        that.$vux.toast.text("台位信息错误，请重试", 'bottom')
                })
            },
            orderRemarkFun(){
                let that = this
                this.isClick = false
                let pushCarData = []
                this.dinnerCarList.forEach((item,index) => {
                    let pushCarItem = {}
                    pushCarItem.dinnerRemarks = (that.carItemtagData["inputTag"+index] ? that.carItemtagData["inputTag"+index]+" " : "") +
                        (that.carItemtagData[index] ? that.carItemtagData[index].join(" ") : "")
                    pushCarItem.remarks = this.remarkOrder
                    pushCarItem.dinnerId = item.dinnerId
                    pushCarItem.dinnerName = item.dinnerName
                    pushCarItem.dinnerImg = item.dinnerImg
                    pushCarItem.dinnerClazzId = item.dinnerClazzId
                    pushCarItem.dinnerPrice = item.dinnerModelInfo[0].dinnerPrice
                    pushCarItem.dinnerCounts = item.dinnerModelInfo[0].addCarNum
                    pushCarItem.modelId = item.dinnerModelInfo[0].modelId
                    pushCarItem.productId = item.dinnerModelInfo[0].productId
                    pushCarItem.modelName = item.dinnerModelInfo[0].modelName
                    if (this.dinnerOrderId) {
                        pushCarItem.dinnerOrderId = this.dinnerOrderId
                        pushCarItem.dinnerState = "1"
                    } else {
                        pushCarItem.dinnerState = "0"
                    }
                    pushCarData.push(pushCarItem)
                })
                let params = {}
                ///^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$//\s/g
                if (this.remarkOrder && !this.remarkOrder.match(/^[\u4E00-\u9FA5a-zA-Z0-9 ]{1,20}$/)) {
                    this.$vux.toast.text("备注中含有特殊字符或备注过长，请重新设置", 'bottom')
                    return false
                }
                params.remark = this.remarkOrder//备注
                params.deskId = this.deskId//桌位Id
                params.dinnerPersonCounts = this.personNum//餐饮消费人数
                params.orderAccounts = this.countPrice
                if (this.dinnerOrderId !== "") {
                    params.isAddDish = "true"//判断加菜、或点菜
                    params.dinnerOrderId = this.dinnerOrderId
                }
                params.data = JSON.stringify(pushCarData)//菜品信息
                let url = "/zingbiz/dinner/orderOrAddDinner";
                this.$vux.loading.show({
                    text: '正在提交订单...'
                })
                this.$http.post(url, params).then(res => {
                    this.$vux.loading.hide()
                    try {
                        if (res.data.success) {
                            that.orderRemark = false
                            this.isClick = true
                            that.$router.push({
                                path:"/dinner/orderDetails",
                                query:{ dinnerOrderId:res.data.data.dinnerOrderId }
                            })
                        } else {
                            that.$vux.toast.show({ text: "结算失败，请重试",type:"cancel",onHide(){}})
                        }
                    } catch (ex) {
                        that.$vux.toast.show({ text:"结算失败 failed " + ex.name + ": " + ex.message,type:"cancel",onHide(){} })
                    }
                });
            },
            toOrderPage() {
                this.$router.push({
                    path:"/dinner/orderDetails",
                    query:{ dinnerOrderId:this.printDinnerOrderId }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .search{
        position: relative !important;
        z-index: 100;
    }
    .goods {
        display: flex;
        top: 50px;
        position: absolute;
        bottom: 48px;
        width: 100%;
        overflow: hidden;
        .border-1px{
            border-bottom: 1px solid #eeeff0;
        }
        .menu-wrapper {
            touch-action: none;
            position: relative;
            -webkit-box-flex: 0;
            width: 80px;
            flex: 0 0 80px;
            background: rgb(243, 245, 247);
            .menu-item {
                display: table;
                height: 54px;
                font-size: 0px;
                color: rgb(20, 20, 20);
                padding: 0px 12px;
                .text {
                    display: table-cell;
                    vertical-align: middle;
                    line-height: 14px;
                    width: 56px;
                    font-size: 12px;
                    position: relative;
                }
            }
            .active {
                position: relative;
                margin-top: -1px;
                z-index: 10;
                background: rgb(255, 255, 255);
            }
        }
        .foods-wrapper {
            touch-action: none;
            position: relative;
            -webkit-box-flex: 1;
            flex: 110%;
            .title {
                padding-left: 14px;
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: rgb(147, 153, 159);
                border-left: 2px solid rgb(208, 221, 225);
                background: rgb(243, 245, 247);
                margin-bottom: 5px;
            }
            .food-item {
                display: flex;
                padding-bottom:16px;
                margin: 18px;
                position: relative;
                .icon {
                    -webkit-box-flex: 0;
                    margin-right: 10px;
                    flex: 0 0 57px;
                }
                .content {
                    -webkit-box-flex: 1;
                    flex: 110%;
                    .name {
                        padding-top: 3px;
                        height: 17px;
                        line-height: 14px;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                        margin: 2px 0px 8px;
                    }
                    .description {
                        margin-bottom: 8px;
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .extra {
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                        .count {
                            margin-right: 12px;
                        }
                    }
                    .price {
                        line-height: 14px;
                        font-size: 10px;
                        font-weight: 700;
                        color: rgb(240, 20, 20);
                        .now {
                            margin-right: 8px;
                            font-size: 14px;
                        }
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0px;
                        bottom: 7px;
                        .cartcontrol {
                            font-size: 0px;
                            display: flex;
                            flex-direction: row;
                            align-items: flex-start;
                            .inner{
                                display: inline-block;
                                line-height: 24px;
                                font-size: 24px;
                                color: rgb(0, 160, 220);
                                padding: 6px;
                            }
                            .count {
                                display: inline-block;
                                vertical-align: top;
                                line-height: 24px;
                                text-align: center;
                                font-size: 10px;
                                color: rgb(147, 153, 159);
                                padding: 6px;
                            }
                            .add{
                                display: inline-block;
                                line-height: 24px;
                                font-size: 24px;
                                color: rgb(0, 160, 220);
                                padding: 6px;
                            }
                        }
                    }
                }
            }
        }
    }
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 48px;
        z-index: 511;
        //overflow: visible;
        .content {
            display: -ms-flexbox;
            display: flex;
            height: 48px;
            background: #141d27;
            font-size: 0;
            overflow: visible;
            .content-left {
                overflow : visible;
                -webkit-box-flex: 1;
                flex: 1;
                .logo-wrapper {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    top: -10px;
                    margin: 0 12px;
                    padding: 6px;
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    border-radius: 50%;
                    background: #141d27;
                    .logo.active {
                        background: #00a0dc;
                    }
                    .logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #2b343c;
                        text-align: center;
                    }
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 16px;
                        line-height: 16px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 8px;
                        font-weight: 700;
                        color: #fff;
                        background: #f01414;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
                    }
                }
                .price {
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 12px;
                    line-height: 24px;
                    padding-right: 12px;
                    box-sizing: border-box;
                    border-right: 1px solid hsla(0,0%,100%,.1);
                    font-size: 16px;
                    font-weight: 700;
                    color: hsla(0,0%,100%,.4);
                }
                .price.active {
                    color: #fff;
                }
                .description {
                    display: inline-block;
                    vertical-align: top;
                    margin: 12px 0 0 12px;
                    line-height: 26px;
                    color: hsla(0,0%,100%,.4);
                    font-size: 10px;
                }
            }
            .content-right {
                -webkit-box-flex: 0;
                //-ms-flex: 0 0 105px;
                flex: 0 0 105px;
                width: 105px;
                .pay {
                    line-height: 48px;
                    height: 48px;
                    text-align: center;
                    font-size: 12px;
                    color: hsla(0,0%,100%,.4);
                    font-weight: 700;
                    background: #2b333b;
                }
                .active {
                    background: #FF8000;
                    color: #fff;
                }
            }
        }
        .shopcart-list {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            -webkit-transform: translate3d(0,-100%,0);
            transform: translate3d(0,-100%,0);
            .list-header {
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                border-bottom: 1px solid rgba(7,17,27,.1);
                background: #f3f5f7;
                .title {
                    float: left;
                    font-size: 14px;
                    color: #07111b;
                }
                .empty {
                    float: right;
                    font-size: 12px;
                    color: #00a0dc;
                }
            }
            .list-content {
                padding: 0 18px;
                max-height: 217px;
                overflow: hidden;
                background: #fff;
                .food {
                    padding: 12px 0;
                    box-sizing: border-box;
                    position: relative;
                    .name {
                        line-height: 24px;
                        font-size: 14px;
                        color: #07111b;
                    }
                    .price {
                        position: absolute;
                        right: 90px;
                        top: 10px;
                        line-height: 24px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #f01414;
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        top: 5px;
                        .cartcontrol{
                            font-size: 0;
                            display: flex;
                            flex-direction: row;
                            align-items: flex-start;
                            .decrease{
                                display: inline-block;
                                padding: 6px;
                                transition: all .4s linear;
                                display: inline-block;
                                line-height: 24px;
                                font-size: 24px;
                                color: #00a0dc;
                                transition: all .5s linear;
                            }
                            .count{
                                display: inline-block;
                                vertical-align: top;
                                padding-top: 6px;
                                line-height: 24px;
                                text-align: center;
                                font-size: 10px;
                                color: #93999f;
                            }
                            .add{
                                display: inline-block;
                                padding: 6px;
                                line-height: 24px;
                                font-size: 24px;
                                color: #00a0dc;
                            }
                        }
                    }
                }
            }
        }
    }
    .food {
        -ms-touch-action: none;
        touch-action: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #fff;
        transition: all .5s;
    }
    .list-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 499;
        blur: 10px;
        transition: all .5s;
        opacity: 1;
        background: rgba(7,17,27,.6);
    }
    .demo4-item {
        background-color: #ddd;
        color: #222;
        font-size: 14px;
        line-height: 18px;
        border-radius: 15px;
        padding : 5px;
        margin-right: 5px;
        margin-left : 5px;
        margin-top: 10px;
        width: 30%;
        text-align: center;
        overflow: hidden;
    }
    .demo4-item-selected {
        background-color: #FF3B3B;
        color: #fff;
    }
    .demo4-item-disabled {
        color: #999;
    }
    .dialog-demo {
        .weui-dialog {
            width: 95%;
            max-width: 500px;
            border-radius: 8px;
            padding-bottom: 8px;
        }
        .dialog-title {
            line-height: 40px;
            color: #666;
            font-size: 16px;
            background: #ebeef5;
        }
        .cartcontrol-wrapper {
            position: absolute;
            right: 0px;
            bottom: 20px;
            .cartcontrol {
                font-size: 0px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                .decrease{
                    display: inline-block;
                    padding: 6px;
                    transition: all 0.4s linear;
                    display: inline-block;
                    line-height: 24px;
                    font-size: 24px;
                    color: rgb(0, 160, 220);
                    transition: all 0.5s linear;
                }
                .count {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 24px;
                    text-align: center;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                    padding: 6px;
                }
                .add{
                    display: inline-block;
                    line-height: 24px;
                    font-size: 24px;
                    color: rgb(0, 160, 220);
                    padding: 6px;
                }
            }
        }
    }
</style>
<style>
    .weui-search-bar__cancel-btn {
        color: #FF8000 !important;
    }
    .vux-popup-header-right {
        color: #ff8000 !important;
    }
</style>
