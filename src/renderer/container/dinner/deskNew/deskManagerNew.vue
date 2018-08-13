<template>
    <div class="deskManagerNew" style="height: 100%">
        <zing-head :title="'桌位管理'">
            <div slot="header-right">
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo" @click=""></i>
                </span>
            </div>
        </zing-head>
        <div v-if="deskAreaList.length > 0" style="height: 100%;">
            <div style="width:calc(100% - 45px);">
                <tab style="width: calc(100%);">
                    <tab-item v-for="(deskArea,index) in deskAreaList" :key="index" :selected="0===index"
                              @click.native="deskAreaItem = deskArea">{{ deskArea.areaTypeName }}</tab-item>
                </tab>
            </div>
            <button class="but-area" style="background: #40AFFC" @click="deskAreaShow">编辑</button>
            <div style="height: calc(100% - 95px);overflow-y: auto">
                <div v-for="(deskType,index) in deskTypeList" v-if="deskType.areaId === deskAreaItem.areaTypeId" :key="index">
                    <div class="deskType" :style="index===0?{marginTop:'0px'}:{}">
                        <span>{{deskType.areaTypeName}}</span>
                        <button class="but" style="background: #ff8000;margin-left: 5px;" @click="delDeskTepy(deskType)">删除</button>
                        <button class="but" style="background: #40AFFC" @click="updateDeskType(deskType)">编辑</button>
                    </div>
                    <div style="margin:13px;margin-right: 8px;">
                    <flexbox :gutter="0" wrap="wrap">
                        <flexbox-item :span="span" v-for="(desk,index) in deskDataList" :key="index" v-if="deskType.areaTypeId === desk.deskTypeId" >
                            <div v-if="isShowCheck"
                                 @click="chooseDesk(desk,index,$event)"
                                 class="flex-demo">
                                <div style="padding: 5px">
                                    <p>{{desk.deskNum}}</p>
                                    <p style="padding-top: 5px">{{desk.seatNumber}}人桌</p>
                                    <div v-if="desk.isOnUse === 'false'" style="float: right;margin-top: -35px;margin-right: -8px;">
                                        <check-icon :value.sync="desk.isCheckDesk"></check-icon>
                                    </div>
                                </div>
                                <div v-if="desk.isOnUse === 'middle'" class="isOrder">待下单</div>
                                <div v-if="desk.isOnUse === 'true'" class="isOrder">待结账</div>
                            </div>
                            <div v-else
                                 @mousedown="mousedownFun"
                                 @mouseup ="mouseupFun($event,desk,deskType)"
                                 @touchstart='touchStart'
                                 @touchend='touchEnd($event,desk,deskType)'
                                 @click="openUpdateDesk(desk,deskType)"
                                 class="flex-demo" :style="desk.deskStatus==='0'?{background:'#BAB6BA'}:{}">
                                <div style="padding: 5px" :style="desk.deskStatus==='0'?{color:'#fff'}:{}">
                                    <p>{{desk.deskNum}}</p>
                                    <p style="padding-top: 5px">{{desk.seatNumber}}人桌</p>
                                </div>
                                <div v-if="desk.isOnUse === 'middle'" class="isOrder">待下单</div>
                                <div v-if="desk.isOnUse === 'true'" class="isOrder">待结账</div>
                            </div>
                        </flexbox-item>
                        <flexbox-item :span="span">
                            <div class="flex-demo">
                                <div style="text-align: center;line-height: 2.1;">
                                    <i class="iconfont icon-jiahao1" style="font-size: 36px" @click="openAddDesk(deskType)"></i>
                                </div>
                            </div>
                        </flexbox-item>
                    </flexbox>
                    </div>
                </div>
                <group v-if="isShowCheck" style="margin-top: 50px">
                    <flexbox :gutter="0">
                        <flexbox-item><x-button class="btn-common" type="primary" :style="{height:'40px'}" @click.native="closeDeskChecked">取消</x-button></flexbox-item>
                        <flexbox-item><x-button class="btn-save" type="primary" :style="{height:'40px'}" @click.native="downDeskQRCode">下载二维码</x-button></flexbox-item>
                        <flexbox-item><x-button class="btn-common" type="warn" :style="{height:'40px'}" @click.native="delDesk">删除</x-button></flexbox-item>
                    </flexbox>
                </group>
                <group v-else style="margin-top: 50px">
                    <flexbox :gutter="0">
                        <flexbox-item><x-button class="btn-common" type="primary" :style="{height:'40px'}" @click.native="addDeskType">新建台位类型</x-button></flexbox-item>
                     </flexbox>
                </group>
            </div>
        </div>
        <div v-if="deskAreaList.length < 1 && showNoData">
            <div class="no-data-style" @click="addDeskArea">
                还没有桌位区域，<a>点我去添加</a>
            </div>
        </div>
        <div>
            <popup v-model="deskDialogShow" position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                              @on-click-left="deskDialogShow = false" @on-click-right="confirmSubmit"></popup-header>
                <group gutter="0">
                    <x-input title="台号" placeholder="输入台号" v-model="deskData.deskNum"></x-input>
                    <x-input title="台位名称" placeholder="输入台位名称" v-model="deskData.deskName"></x-input>
                    <x-input title="台位类型" disabled placeholder="输入台位类型" v-model="deskData.deskType"></x-input>
                    <x-input title="所属区域" disabled placeholder="输入所属区域" v-model="deskData.deskArea"></x-input>
                    <x-input title="座位数" placeholder="输入座位数" v-model="deskData.seatNumber"></x-input>
                    <x-input title="显示顺序" placeholder="输入显示顺序" v-model="deskData.showOrder"></x-input>
                    <x-switch v-if="" v-model="deskStatus" title="是否启用"></x-switch>
                </group>
            </popup>
        </div>
        <div>
            <popup v-model="deskAreaDialogShow" position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="''" title="编辑所属区域" :show-bottom-border="false"
                              @on-click-left="deskAreaDialogShow = false"></popup-header>
                <div class="scroll-list-wrap" style="height:calc(100% - 95px);overflow: auto;background: #fff;">
                    <ul v-if="deskAreaList.length > 0">
                        <li v-for="(item,index) in deskAreaList" :key="index">
                            <GridCard :style="{height: '60px'}">
                                <div slot="cardLeft" class="left">
                                    <div class="left-wrapper">
                                        <p class="left-wrapper-title">{{item.areaTypeName}}</p>
                                    </div>
                                </div>
                                <div slot="cardRight" class="right">
                                    <button class="but" style="background: #ff8000;margin-left: 5px;" @click="delDeskArea(item)">删除</button>
                                    <button class="but" style="background: #40AFFC" @click="updateDeskArea(item)">编辑</button>
                                </div>
                            </GridCard>
                        </li>
                    </ul>
                    <ul v-show="deskAreaList.length < 1 && showNoData">
                        <div class="no-data-style">
                            暂无所属区域
                        </div>
                    </ul>
                </div>
                <group>
                    <flexbox :gutter="0">
                        <flexbox-item><x-button class="btn-common" type="primary" :style="{height:'50px'}" @click.native="addDeskArea">添加区域</x-button></flexbox-item>
                    </flexbox>
                </group>
            </popup>
        </div>
        <popup v-model="deskAddConfirmShow" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="deskConfirmName" :show-bottom-border="false"
                          @on-click-left="deskAddConfirmShow = false" @on-click-right="deskAddConfirm">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="名称：" v-model="areaTypeName"></x-input>
                </group>
            </div>
        </popup>
        <popup v-model="deskUpdateConfirmShow" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="deskConfirmName" :show-bottom-border="false"
                          @on-click-left="deskUpdateConfirmShow = false" @on-click-right="deskUpdateConfirm">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="名称：" v-model="areaTypeName"></x-input>
                </group>
            </div>
        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import { isPc,getThumbUrl } from '@/utils/fn'
    import {
        XDialog, Confirm, Group, Flexbox, FlexboxItem, XButton, Popup, PopupHeader, XInput,
        Selector, XTextarea, Checklist, Tab, TabItem, XSwitch, CheckIcon
    } from "vux";
    export default {
        name: "deskMangerNew",
        components: {
            ZingHead, XDialog, Confirm, Group, Flexbox, FlexboxItem, XButton, Popup, PopupHeader, XInput,
            Selector, XTextarea, Checklist, TabItem, Tab, XSwitch, CheckIcon, GridCard
        },
        data() {
            return {
                showNoData:false,
                editTitle:"添加桌位",
                span:1/3,
                isShowCheck:false,
                deskAddConfirmShow:false,
                deskUpdateConfirmShow:false,
                deskConfirmName:'',
                deskDataList:[],//桌位列表
                deskAreaList:[],//区域列表
                deskTypeList:[],//类型列表
                deskDialogShow:false,//
                deskAreaDialogShow:false,
                deskStatus:true,
                deskAreaItem:{},
                touchStartTime:0,
                chooseDeskData:{},
                deskAreaTypeForm:{},
                areaTypeName:"",
                deskNumStr:"",
                deskData:{
                    deskNum:"",
                    deskName:"",
                    deskType:"",
                    deskArea:"",
                    seatNumber:"",
                    showOrder:"",
                    isOnUse:"false",
                },
            };
        },
        created() {
            if (isPc()) {
                this.span = 1/((document.documentElement.clientWidth - 200)/133)
            } else if (document.documentElement.clientWidth >= 600) {
                this.span = 1/(document.documentElement.clientWidth/133)
            } else {
                this.span = 1/3
            }
            this.loadList()
            this.loadAreaTypeList()
        },
        methods: {
            loadList() {
                let that = this;
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                let deskListUrl = "/zingbiz/dinner/getDeskList";
                this.$http
                    .get(deskListUrl, { params :param })
                    .then(res => {
                        if (res.data.success) {
                            if(res.data.data.data) {
                                let deskNumList = []
                                this.deskNumStr = ""
                                res.data.data.data.forEach(item => {
                                    item.isCheckDesk = false
                                    deskNumList.push("#" + item.deskNum + "#")
                                })
                                that.deskNumStr = deskNumList.join("")
                                that.deskDataList = res.data.data.data;
                                that.showNoData = true
                            }
                            console.log("====deskDataList=====", that.deskDataList)
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {
                    that.$message({ type: "error", message: "加载失败，请重试" });
                });
            },
            loadAreaTypeList() {
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
                            if(res.data.data.data) {
                                let al = []
                                let tl = []
                                res.data.data.data.forEach((item,index) => {
                                    if (item.stated !== "ALL") {
                                        item.stated === "TYPE" ? tl.push(item) : al.push(item)
                                    }
                                })
                                console.log(res.data.data.data)
                                that.deskAreaList = al
                                that.deskTypeList = tl
                                that.deskAreaItem = !that.deskAreaItem.areaTypeId && that.deskAreaList.length > 0 ? that.deskAreaList[0] : that.deskAreaItem
                            }
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {
                    that.$message({ type: "error", message: "加载失败，请重试" });
                });
            },
            openUpdateDesk(desk,deskType) {
                if (desk.isOnUse !== 'false') {
                    this.$vux.toast.text("该桌位正在使用，请稍后重试", 'bottom')
                    return false
                }
                this.editTitle = "编辑桌位"
                this.deskData = desk
                this.deskStatus = desk.deskStatus === "1" ? true : false
                this.deskData.deskType = deskType.areaTypeName
                this.deskData.deskTypeId = deskType.areaTypeId
                this.deskData.deskArea = this.deskAreaItem.areaTypeName
                this.deskData.deskAreaId = this.deskAreaItem.areaTypeId
                this.deskDialogShow = true
            },
            openAddDesk(itme) {
                this.deskData = {
                    deskNum:"",
                    deskName:"",
                    deskType:itme.areaTypeName,
                    deskTypeId:itme.areaTypeId,
                    deskArea:this.deskAreaItem.areaTypeName,
                    deskAreaId:this.deskAreaItem.areaTypeId,
                    seatNumber:"",
                    showOrder:"",
                    isOnUse:"false",
                }
                this.deskDialogShow = true
            },
            mousedownFun(even) { //鼠标事件
                let that = this
                this.touchStartTime = even.timeStamp
                clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
                this.Loop=setTimeout(() => {
                    that.isShowCheck = true
                },2000);
            },
            mouseupFun(even,desk,deskType) {
                clearInterval(this.Loop);
                /*if ((even.timeStamp - this.touchStartTime) < 1000) {
                    this.openUpdateDesk(desk,deskType)
                }*/
            },
            touchStart(even) { //触摸事件
                let that = this
                this.touchStartTime = even.timeStamp
                clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
                this.Loop=setTimeout(() => {
                    that.isShowCheck = true
                },2000);
            },
            touchEnd(even,desk,deskType) {
                clearInterval(this.Loop);//时间不足一秒钟，则会清空定时器，定时器取消执行
                /*if ((even.timeStamp - this.touchStartTime) < 1000) {
                    this.openUpdateDesk(desk,deskType)
                }*/
            },
            chooseDesk(desk,index,event) { //选择desk
                if(desk.isOnUse === 'false') {
                    desk.isCheckDesk = event.target.className.indexOf("weui-icon") >= 0 ? desk.isCheckDesk : !(desk.isCheckDesk)
                    if(desk.isCheckDesk) {
                        this.chooseDeskData[desk.deskId] = desk
                    } else {
                        delete this.chooseDeskData[desk.deskId]
                    }
                }
            },
            closeDeskChecked() { //取消批量修改
                this.isShowCheck = false
                this.deskDataList.forEach(item => {
                    item.isCheckDesk = false
                })
            },
            addDeskArea() {
                this.deskAddConfirmShow = true
                this.areaTypeName = ""
                this.deskConfirmName = '新建所属区域'
                this.deskAreaTypeForm = {
                    areaTypeName:"",        //名称
                    stated:"AREA",          //YPE为类型，AREA为区域，ALL为是否开班
                }
            },
            addDeskType() {
                this.deskAddConfirmShow = true
                this.deskConfirmName = '新建台位类型'
                this.areaTypeName = ""
                this.deskAreaTypeForm = {
                    areaTypeName:"",        //名称
                    stated:"TYPE",              //TYPE为类型，AREA为区域，ALL为是否开班
                    areaId:this.deskAreaItem.areaTypeId,
                }
            },
            deskAddConfirm() {
                let that = this
                let valName = this.areaTypeName.replace(/ /g,'')
                if (!valName) {
                    this.$vux.toast.text(this.deskAreaTypeForm.stated === "TYPE" ? "台位类型名称不能为空" : "所属区域名称不能为空", 'bottom');
                    return false
                }
                if (this.deskAreaTypeForm.stated === "TYPE") {
                    this.deskAreaTypeForm.areaTypeName = this.deskAreaItem.areaTypeName + "--" + valName
                } else {
                    this.deskAreaTypeForm.areaTypeName = valName
                }
                let url = "/zingbiz/dinner/addDeskAreaType";
                this.$http
                    .post(url, this.deskAreaTypeForm)
                    .then(res => {
                        if (res.data.success) {
                            that.deskAddConfirmShow = false
                            //this.loadList()
                            this.loadAreaTypeList()
                        } else {
                            that.$message({ type: "error", message: "添加失败，请重试" });
                        }
                    }).catch(error => {
                    console.log("error ===== >:",error)
                    that.$message({ type: "error", message: "添加失败，请重试" });
                });
            },
            updateDeskArea(item) {
                this.deskUpdateConfirmShow = true
                this.deskConfirmName = '修改所属区域'
                this.deskAreaTypeForm = item
                this.areaTypeName = item.areaTypeName
            },
            updateDeskType(item) {
                this.deskUpdateConfirmShow = true
                this.deskConfirmName = '修改台位类型'
                this.deskAreaTypeForm = item
                this.deskAreaTypeForm.areaId = this.deskAreaItem.areaTypeId
                this.areaTypeName = item.areaTypeName.split("--")[1]
            },
            delDeskArea(item) {
                let isOnUse = false
                let deskIds = []
                let deskTypeIds = []
                this.deskTypeList.forEach(type => {
                    if (type.areaId && type.areaId === item.areaTypeId) {
                        deskTypeIds.push(type.areaTypeId)
                    }
                })
                this.deskDataList.forEach(desk => {
                    if (desk.deskAreaId === item.areaTypeId) {
                        if (desk.isOnUse !== "false") {
                            isOnUse = true
                        }
                        deskIds.push(desk.deskId)
                    }
                })
                if (isOnUse) {
                    this.$vux.toast.text("该台位区域下有桌位正在使用，请稍后重试", 'bottom')
                    return false
                }
                let that = this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定要删除该台位区域及所属台位吗?',
                    onCancel() {
                        that.$vux.confirm.hide();
                    },
                    onConfirm() {
                        let param = {
                            params: {
                                areaTypeId: item.areaTypeId,
                                deskIds: deskIds.join(" "),
                                deskTypeIds:deskTypeIds.join(" ")
                            }
                        };
                        that.$http
                            .get("/zingbiz/dinner/delDeskArea", param)
                            .then(res => {
                                if (res.data.success) {
                                    that.$message({ type: "success", message: "删除成功" });
                                    that.loadList()
                                    that.loadAreaTypeList()
                                } else {
                                    that.$message({ type: "error", message: "删除失败，请重试" });
                                }
                            }).catch(error => {
                            that.$message({ type: "error", message: "删除失败，请重试" });
                        });
                    }
                })
            },
            delDeskTepy(item) {
                let isOnUse = false
                let deskIds = []
                this.deskDataList.forEach(desk => {
                    if (desk.deskTypeId === item.areaTypeId) {
                        if (desk.isOnUse !== "false") {
                            isOnUse = true
                        }
                        deskIds.push(desk.deskTypeId)
                    }
                })
                if (isOnUse) {
                    this.$vux.toast.text("该台位类型下有桌位正在使用，请稍后重试", 'bottom')
                    return false
                }
                let that = this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定要删除该台位类型及所属台位吗?',
                    onCancel() {
                        that.$vux.confirm.hide();
                    },
                    onConfirm() {
                        let param = {
                            params: {
                                areaTypeId: item.areaTypeId,
                                deskIds: deskIds.join(" ")
                            }
                        };
                        that.$http
                            .get("/zingbiz/dinner/delDeskType", param)
                            .then(res => {
                                if (res.data.success) {
                                    that.$message({ type: "success", message: "删除成功" });
                                    that.loadList()
                                    that.loadAreaTypeList()
                                } else {
                                    that.$message({ type: "error", message: "删除失败，请重试" });
                                }
                            }).catch(error => {
                            that.$message({ type: "error", message: "删除失败，请重试" });
                        });
                    }
                })
            },
            delDesk() { //删除桌位
                let deskIds = Object.keys(this.chooseDeskData)
                if (deskIds.length === 0) {
                    this.$vux.toast.text("请选择桌位", 'bottom')
                    return false
                }
                let that = this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定要删除该台位吗?',
                    onCancel() {
                        that.$vux.confirm.hide();
                    },
                    onConfirm() {
                        let param = {
                            params: {
                                deskIds: deskIds.join(" ")
                            }
                        };
                        that.$http.get("/zingbiz/dinner/delDesks", param)
                            .then(res => {
                                if (res.data.success) {
                                    that.$message({ type: "success", message: "删除成功" });
                                    that.loadList()
                                    //that.loadAreaTypeList()
                                } else {
                                    that.$message({ type: "error", message: "删除失败，请重试" });
                                }
                            }).catch(error => {
                            that.$message({ type: "error", message: "删除失败，请重试" });
                        });
                    }
                })
            },
            deskUpdateConfirm() {
                let that = this
                let valName = this.areaTypeName.replace(/ /g,'')
                if (!valName) {
                    this.$vux.toast.text(this.deskAreaTypeForm.stated === "TYPE" ? "台位类型名称不能为空" : "所属区域名称不能为空", 'bottom');
                    return false
                }
                if (this.deskAreaTypeForm.stated === "TYPE") {
                    this.deskAreaTypeForm.areaTypeName = this.deskAreaItem.areaTypeName + "--" + valName
                } else {
                    this.deskAreaTypeForm.areaTypeName = valName
                }
                let url = "/zingbiz/dinner/updateDeskAreaType";
                that.deskUpdateConfirmShow = false
                this.$http
                    .post(url, this.deskAreaTypeForm)
                    .then(res => {
                        if (res.data.success) {
                            //this.loadList()
                            this.loadAreaTypeList()
                        } else {
                            that.$message({ type: "error", message: "添加失败，请重试" });
                        }
                    }).catch(error => {
                    console.log("error ===== >:",error)
                    that.$message({ type: "error", message: "添加失败，请重试" });
                });
            },
            downDeskQRCode() { //下载二维码
                this.$vux.toast.text("功能维护中", 'bottom')
            },
            deskAreaShow() {
                this.deskAreaDialogShow = true
            },
            confirmSubmit() { //添加修改方法
                let that = this;
                this.deskData.deskStatus = this.deskStatus ? "1" : "0"
                let mas = "添加"
                let url = "/zingbiz/dinner/addDesk";
                if (this.deskData.deskId) {
                    mas = "修改"
                    url = "/zingbiz/dinner/updateDesk"
                }
                if (!this.deskData.deskId && this.deskNumStr.indexOf(("#" + this.deskData.deskNum + "#")) >= 0) {
                    this.$vux.toast.text("桌号已经存在", 'bottom')
                    return false
                }
                let params = {
                    deskArea:this.deskData.deskArea,
                    deskAreaId:this.deskData.deskAreaId,
                    deskId:this.deskData.deskId ? this.deskData.deskId : "",
                    deskName:this.deskData.deskName,
                    deskNum:this.deskData.deskNum,
                    deskStatus:this.deskData.deskStatus,
                    deskType:this.deskData.deskType,
                    deskTypeId:this.deskData.deskTypeId,
                    dinnerOrderId:this.deskData.dinnerOrderId ? this.deskData.dinnerOrderId : "",
                    genTime:this.deskData.genTime ? this.deskData.genTime : "",
                    isOnUse:this.deskData.isOnUse ? this.deskData.isOnUse : "false",
                    seatNumber:this.deskData.seatNumber,
                    showOrder:this.deskData.showOrder
                }
                that.deskDialogShow = false;
                that.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            that.$vux.toast.show({ text: mas + "成功",type:"success",onHide (){}})
                            //this.loadAreaTypeList()
                            this.loadList()
                        } else {
                            that.$vux.toast.show({ text: mas + "失败",onHide (){}})
                        }
                    })
                    .catch(error => {
                        that.$vux.toast.show({ text: mas + "失败",onHide (){}})
                    });
            },
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .deskManagerNew {
        .no-data-style{
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
            color: #ff8000;
        }
        .flex-demo {
            border: 1px solid #ff8000;
            height: 80px;
            background-color: #fff;
            border-radius: 4px;
            background-clip: padding-box;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .isOrder {
            text-align: right;
            margin-top: 15px;
            margin-right: 5px;
            color: #ff8000;
        }
        .deskType {
            width: 100%;
            height: 30px;
            padding-top: 5px;
            color: #fff;
            background: #888888;
            margin-top: 5px;
            padding-left: 13px;
            padding-right: 5px;
        }
        .but {
            float: right;
            text-align: center;
            text-decoration: none;
            color: #fff;
            border-radius: 5px;
            overflow: hidden;
            border: 1px;
        }
        .but-area {
            float: right;
            text-align: center;
            text-decoration: none;
            color: #fff;
            overflow: hidden;
            border: 1px;
            width: 45px;
            height: 45px;
            margin-top: -45px;
        }
        .scrollable .vux-tab-ink-bar {
            display: none !important;
        }
        .vux-tab .vux-tab-item.vux-tab-selected {
            color: #fff !important;
            border-bottom: 3px solid rgb(252, 165, 106) !important;
            background: rgb(252, 165, 106) !important;
        }
    }
</style>
