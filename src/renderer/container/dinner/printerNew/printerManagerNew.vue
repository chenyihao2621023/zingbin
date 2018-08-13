<template>
    <div class="printerManager" style="height: 100%">
        <zing-head :title="'打印机管理'">
            <div slot="header-right">
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo" @click="addShow"></i>
                </span>
            </div>
        </zing-head>
        <div class="scroll-list-wrap" style="height:calc(100% - 50px)">
            <ul v-if="printerData.length > 0">
                <li v-for="(item,index) in printerData" :key="index">
                    <GridCard :style="{height: '60px'}">
                        <div slot="cardLeft" class="left" style="max-width: 70%;">
                            <div class="left-wrapper" style="max-width: 100%;">
                                <p class="left-wrapper-title left-title-hidden">{{item.printerName}}({{item.goodsClazzNamePrint}})</p>
                                <div class="left-wrapper-desc" style="color: #888888">{{item.printerIP}}</div>
                            </div>
                        </div>
                        <div slot="cardRight" class="right">
                            <div><i class="iconfont icon-gengduo" @click.stop="showMoreModal(item)"></i></div>
                            <div>
                                <span v-if="item.machineStatus ==='连接异常'" class="onFalse">{{item.machineStatus}}</span>
                                <span v-else class="onTrue">{{item.machineStatus}}</span>
                            </div>
                        </div>
                    </GridCard>
                </li>
            </ul>
            <ul v-show="printerData.length < 1">
                <div class="no-data-style">
                    没有查询到打印机列表
                </div>
            </ul>
            <!--</scroll>-->
        </div>
        <x-dialog v-model="showMoreDialog" hide-on-blur>
            <div class="mBtn" @click="testMethod(ckickData)">测试</div>
            <div class="mBtn" @click="editMethod(ckickData)">编辑</div>
            <div class="mBtn" @click="delMethod(ckickData)">删除</div>
        </x-dialog>
        <div>
            <popup v-model="addPriteModal" position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                              @on-click-left="addPriteModal = false" @on-click-right="confirmSubmit($refs.clazzChoose.getFullValue())"></popup-header>
                <group gutter="0">
                    <x-input title="编号" placeholder="输入打印机编号" v-model="addPrinterData.printerNID"></x-input>
                    <x-input title="打印机标题" placeholder="输入打印机标题" v-model="addPrinterData.printerName"></x-input>
                    <x-input title="打印机IP" placeholder="输入打印机IP" v-model="addPrinterData.printerIP"></x-input>
                    <x-input title="打印份数" placeholder="输入打印份数" v-model="addPrinterData.printerNumbers"></x-input>
                    <x-textarea title="备注" v-model="addPrinterData.msg"></x-textarea>
                    <selector title="打印方式" :options="printerTypeOption" v-model="addPrinterData.printerType" @on-change="typeChenge"></selector>
                    <selector v-show="typeShow" title="打印切纸" :options="printerNumbersOption" v-model="addPrinterData.cutpaperOfType"></selector>
                    <checklist v-show="typeShow" title="品项类别" ref="clazzChoose" :options="clazzList" v-model="checkList" @on-change=""></checklist>
                </group>
            </popup>
        </div>
    </div>
</template>

<script>
    import {
        XDialog, Confirm, Group, Flexbox, FlexboxItem, XButton, Popup, PopupHeader, XInput, Selector, XTextarea, Checklist
    } from "vux";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "PrinterManagerNew",
        components: {
            GridCard, ZingHead, XDialog, Confirm, Group, Flexbox, FlexboxItem, XButton, Popup, PopupHeader, XInput, Selector, XTextarea, Checklist
        },
        data: () => ({
            showMoreDialog:false,
            addPriteModal:false,
            printerTypeOption:[
                { key:"0",value:"收款单" },
                { key:"1",value:"品相类别" },
                { key:"2",value:"厨单" },
                { key:"5",value:"催单" }
            ],
            printerNumbersOption:[
                { key:"0",value:"一整单" },
                { key:"1",value:"一个菜品一张单" }
            ],
            clazzList:[],
            checkList: [],//分类id列表
            AORU: "",
            editTitle:"添加打印机",
            typeShow: true,//品项类别隐藏显示
            dialogLabelWidth: '80px',
            screenHeight: 0,//页面高度
            ckickData: {},//商品分类id列表
            goodsClazzList: [],//商品分类列表
            addPrinterData: {
                printerNID: "",
                printerType: "0",
                cutpaperOfType: "",
                printerName: "",
                printerIP: "",
                printerNumbers: "1",
                msg: ""
            },
            printerData: [],//打印机列表
        }),
        created() {
            this.screenHeight = document.documentElement.clientHeight - 100;
            this.initClazz()
        },

        methods: {
            initPrinter() {
                let that = this
                let param = {};
                let urlPrinter = "/zingbiz/printerManager/search"
                this.loading = true;
                this.$http.post(urlPrinter, param).then(res => { //加载商品分类
                    try {
                        if (res.data) {
                            that.loading = false;
                            for (let i = 0; i < res.data.data.data.length; i++) {
                                let cpName = []
                                that.goodsClazzList.forEach(item => {
                                    if (res.data.data.data[i].goodsClazzIdPrint.indexOf(item.dinnerClazzId) >= 0) {
                                        cpName.push(item.dinnerClazzName)
                                    }
                                })
                                res.data.data.data[i].goodsClazzNamePrint = cpName.join(" ")
                            }
                            that.printerData = res.data.data.data
                            console.log(that.printerData)
                        }
                    } catch (ex) {
                        that.loading = false;
                        console.log(ex)
                        that.$vux.toast.show({
                            text: "查询失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            initClazz() {
                let that = this
                let urlClazz = "/zingbiz/dinner/getDinnerClazzList"
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                this.$http.get(urlClazz, { params: param }).then(res => { //加载商品分类
                    try {
                        if (res.data) {
                            that.goodsClazzList = res.data.data.data;
                            that.goodsClazzList.forEach(item => {
                                that.clazzList.push({ key:item.dinnerClazzId,value:item.dinnerClazzName })
                            })
                            this.initPrinter()
                        }
                    } catch (ex) {
                        that.$vux.toast.show({
                            text: "查询失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            showMoreModal(item) { //显示三个点弹框
                this.showMoreDialog = true
                this.ckickData = {}
                this.ckickData = JSON.parse(JSON.stringify(item))
            },
            typeChenge(val) { //品项类别选择
                this.typeShow = val === "0" || val === "5" ? false : true
                if (!this.typeShow) {
                    this.checkList = []
                    this.addPrinterData.cutpaperOfType = ""
                }
            },
            editMethod(item) { //修改方法
                this.$nextTick(() => {
                    this.editTitle = "编辑打印机"
                    this.addPrinterData = {}
                    this.addPrinterData = JSON.parse(JSON.stringify(this.ckickData))
                    if (this.addPrinterData.printerType === "0" || this.addPrinterData.printerType === "5") {
                        this.typeShow = false
                    }
                    this.checkList = []
                    this.checkList = this.ckickData.goodsClazzIdPrint.split(" ")
                    this.AORU = "U"
                    this.addPriteModal = true
                    this.showMoreDialog = false
                })
            },
            testMethod(item) { //测试连接
                let that = this
                let param = {} ;
                param.tid = "test" ;
                param.printerIP = item.printerIP ;
                let url = "/zingbiz/printerManager/testPrinterButton.action"
                that.$http.post(url,param ).then(res => { //加载一个仓库数据
                    try {
                        if (res.data.data.state !== "error") {
                            that.showMoreDialog = false
                            that.$vux.toast.show({
                                text: "测试页已发送",
                                type: "success",
                                onHide() {
                                }
                            })
                        } else {
                            that.$vux.toast.show({
                                text: "测试页发送超时",
                                type: "cancel",
                                onHide() {
                                }
                            })
                        }
                    } catch (ex) {
                        that.$vux.toast.show({
                            text: "测试页发送失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            delMethod(item) { //刪除方法
                let that = this
                this.$vux.confirm.show({
                    title: '提示',
                    content: '此操作将永久删除该打印机数据, 是否继续?',
                    onCancel() {
                        that.$vux.confirm.hide();
                    },
                    onConfirm() {
                        that.$http
                            .post("/zingbiz/printerManager/delete", {rowId: item.rowId})
                            .then(res => {
                                if (res.data.success) {
                                    that.showMoreDialog = false
                                    that.$message({type: "success", message: "删除成功"});
                                    that.initPrinter()
                                } else {
                                    that.$message({type: "error", message: "删除失败，请重试"});
                                }
                            }).catch(error => {
                            that.$message({type: "error", message: "删除失败，请重试"});
                        });
                    }
                })
            },
            addShow() {
                this.editTitle = "添加打印机"
                this.AORU = "A"
                this.addPriteModal = true
                this.typeShow = false
                this.checkList = []
                this.addPrinterData = {
                    printerNID: "",
                    printerType: "0",
                    cutpaperOfType: "",
                    printerName: "",
                    printerIP: "",
                    printerNumbers: "1",
                    msg: ""
                }
            },
            confirmSubmit(data) { //添加方法
                let that = this
                if (that.addPrinterData.printerType !== "0" && that.addPrinterData.printerType !== "5") {
                    if (that.checkList.length === 0) {
                        that.$vux.toast.text("请选择品项类别!", 'bottom')
                        return false
                    }
                    if (!that.addPrinterData.cutpaperOfType) {
                        that.$vux.toast.text("请填写打印切纸", 'bottom')
                        return false
                    }
                    if (!that.addPrinterData.printerName) {
                        that.$vux.toast.text("请填写打印机名称", 'bottom')
                        return false
                    }
                    if (!that.addPrinterData.printerIP) {
                        that.$vux.toast.text("请填写打印机IP", 'bottom')
                        return false
                    }
                    if (!that.addPrinterData.printerNID) {
                        that.$vux.toast.text("请填写打印机编号", 'bottom')
                        return false
                    }
                    let goodsClassName = []
                    data.forEach(item => {
                        goodsClassName.push(item.label)
                    })
                    this.addPrinterData.goodsClazzIdPrint = this.checkList.join(" ")
                    this.addPrinterData.goodsClazzNamePrint = goodsClassName.join(" ")
                    console.log(this.addPrinterData)
                } else {
                    that.addPrinterData.goodsClazzIdPrint = that.addPrinterData.printerType === "5" ? "CD123456" : ""
                    that.addPrinterData.goodsClazzNamePrint = ""
                    that.addPrinterData.cutpaperOfType = ""
                }
                let url = this.AORU === "U" ? "/zingbiz/printerManager/update"
                    : "/zingbiz/printerManager/insert"
                let message = that.AORU === "U" ? "修改" : "添加"
                that.$http.post(url, that.addPrinterData).then(res => { //加载一个仓库数据
                    try {
                        if (res.data.success) {
                            this.initPrinter()
                            that.$vux.toast.show({
                                text: message + '成功',
                                type: "success",
                                onHide() {
                                }
                            })
                            this.addPriteModal = false
                        } else {
                            that.$vux.toast.show({
                                text: message + "失败，请重试",
                                type: "cancel",
                                onHide() {
                                }
                            })
                        }
                    } catch (ex) {
                        that.$vux.toast.show({
                            text: message + "失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .printerManager{
        .zing-pagination {
            margin-top: 10px;
            float: right;
        }
        .no-data-style {
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
            color: #ff8000;
        }
        .mBtn {
            height : 40px;
            line-height: 40px;
        }
        .onFalse {
            font-size: 12px;
            color: #CD550E;
        }
        .onTrue {
            font-size: 12px;
            color: #00CD17;
        }
        .left-title-hidden {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-top: 5px;
        }
    }
</style>

