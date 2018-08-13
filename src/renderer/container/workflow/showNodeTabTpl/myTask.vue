<template>
    <div id="myTask">
        <div :style="headClass">
            <div class="vue-tab">
                <tab class="" :line-width="2">
                    <tab-item :selected="defTab === item"
                              v-for="(item, index) in tabTitle"
                              @on-item-click="chengeTab"
                              @click="defTab = item"
                              :key="index">{{item}}
                    </tab-item>
                </tab>
            </div>
        </div>

        <div style="padding-top: 40px;">
            <div v-if="fpIsOk=='true'">
                <!-- tab 待执行任务 -->
                <div v-if="haveDzxData">
                    <div v-show="tabTpl.daiZhiXing" >
                        <dai-zhi-xing v-if="daiZhiXingData!=undefined && daiZhiXingData.length>0" ref="daiZhiXing"
                                      @nodeExecution="handlePostUrl"
                                      @weiTuo="weiTuo"
                                      :initData="daiZhiXingData"
                                      @reloadMyTask="reloadMyTask"
                                      :workflowData="workflowData"
                                      @openPz="openPz"
                                      :otherModuleData="otherModuleData"
                                      :companyId="queryParams.companyId"
                        ></dai-zhi-xing>
                    </div>
                </div>
                <div v-else-if="tabTpl.daiZhiXing">
                    <div style="margin-top: 15px;font-size: 16px;color: #ff8000;text-align: center;width:100%;">暂无待执行任务！</div>
                </div>

                <!-- tab 已执行任务 -->
                <div v-if="haveYzxData">
                    <div v-show="tabTpl.yiZhiXing" >
                        <yi-zhi-xing v-if="yiZhiXingData!=undefined && yiZhiXingData.length>0" ref="yiZhiXing"
                                     @nodeExecution="handlePostUrl"
                                     :initData="yiZhiXingData"
                                     @reloadMyTask="reloadMyTask"
                                     :workflowData="workflowData"
                                     @openPz="openPz"
                                     :otherModuleData="otherModuleData"
                                     :companyId="queryParams.companyId"
                        ></yi-zhi-xing>
                    </div>
                </div>
                <div v-else-if="tabTpl.yiZhiXing">
                    <div style="margin-top: 15px;font-size: 16px;color: #ff8000;text-align: center;width:100%;">暂无已执行任务！</div>
                </div>
            </div>
            <div v-else>
                <div style="font-size: 16px;color: #ff8000;text-align: center;width:100%;">暂未进行受理，请稍后查看！</div>
            </div>
        </div>
        <node-execution ref="nodeExecutionForm"
                        :showNodeExecution="showNodeExecution"
                        @cancel="cancel"
                        @submit="nodeExecution"
                        @backClick="backClick"
                        :nodeData="curNodeExecutionParams.nodeData"
                        :workflowData="workflowData"
                        :otherModuleFormShow="otherModuleFormShow"
        ></node-execution>
    </div>
</template>

<script>
    import daiZhiXing from "@/container/workflow/showNodeTabTpl/daiZhiXing";
    import yiZhiXing from "@/container/workflow/showNodeTabTpl/yiZhiXing";
    import nodeExecution from "@/container/workflow/showNodeTabTpl/nodeExecution";
    import { Z_IsEmpty20,isPc } from "@/utils/fn";

    import { Group, XInput, XTextarea, Datetime, Cell, Tab, TabItem } from "vux";
    export default {
        name: "myTask",
        components: {
            Group,
            XInput,
            XTextarea,
            Datetime,
            Cell,
            Tab,
            TabItem,
            daiZhiXing,
            yiZhiXing,
            nodeExecution
        },
        data() {
            return {
                headClass:{
                    "position":"absolute",
                    "z-index":"500",
                    "width":"100%",
                    "background-color":"#f7f7fa"
                },
                tabTitle: ["待执行任务", "已执行任务"],
                defTab: "待执行任务",
                tabTpl: {
                    //待执行任务
                    daiZhiXing: true,
                    //已执行任务
                    yiZhiXing: false
                },
                daiZhiXingData: [],
                yiZhiXingData: [],
                showNodeExecution: false,
                curNodeExecutionParams: {},
                haveDzxData: true,
                haveYzxData: true,
                postUrl: "",
                postOtherModuleParams: {},
                otherModuleFormShow: {
                    isShowKq: false
                }
            };
        },
        //钩子加载完触发
        created: function() {
            if(isPc()){
                this.headClass.width = (document.body.clientWidth-200)+"px";
            }
            //处理数据
            for (let i in this.initData) {
                let isCanZx = true;
                let ndTemp = this.initData[i];
                //判断节点是否有前序节点
                if (ndTemp.relationNodes != undefined && ndTemp.relationNodes != "") {
                    let relationNodesStr = ndTemp.relationNodes;

                    //判断前序节点的完成状态
                    let relationNodesArr = [];
                    for (let k in this.allNodeData) {
                        if (relationNodesStr.indexOf(this.allNodeData[k].stepId) >= 0) {
                            let isOk = false;
                            if (this.allNodeData[k].staff_state === "已完成" || this.allNodeData[k].staff_state === "驳回") {
                                isOk = true;
                            } else {
                                if (isCanZx) {
                                    isCanZx = false;
                                }
                            }
                            let relationNodesJson = {};
                            relationNodesJson.nodeName = this.allNodeData[k].stepName;
                            relationNodesJson.isOk = isOk;
                            relationNodesJson.zxr = this.allNodeData[k].user_name;
                            relationNodesArr.push(relationNodesJson);
                        }
                    }

                    this.initData[i].relationNodesData = relationNodesArr;
                }
                this.initData[i].isCanZx = isCanZx;
                //判断当前节点是否存在语音数据
                let voiceStr = ndTemp.mp3s == undefined ? "" : ndTemp.mp3s;
                if (!Z_IsEmpty20(voiceStr)) {
                    let mp3Arr = voiceStr.split(",");
                    let mp3Data = [];
                    for (let k = 0; k < mp3Arr.length; k++) {
                        var voiceSrc = mp3Arr[k] + "?t=" + new Date().getTime();
                        mp3Data.push(voiceSrc);
                    }
                    this.initData[i].voiceData = mp3Data;
                }
                if (this.initData[i].stepType != "FP") {
                    if (ndTemp.staff_state === "已完成" || ndTemp.staff_state === "驳回") {
                        this.yiZhiXingData.push(this.initData[i]);
                    } else {
                        this.daiZhiXingData.push(this.initData[i]);
                    }
                }
            }
            if (this.daiZhiXingData == undefined || this.daiZhiXingData.length == 0) {
                this.haveDzxData = false;
            }
            if (this.yiZhiXingData == undefined || this.yiZhiXingData.length == 0) {
                this.haveYzxData = false;
            }
        },
        watch: {
            daiZhiXingData() {
                if (this.daiZhiXingData == undefined || this.daiZhiXingData.length == 0) {
                    this.haveDzxData = false;
                }
            },
            yiZhiXingData() {
                if (this.yiZhiXingData == undefined || this.yiZhiXingData.length == 0) {
                    this.haveYzxData = false;
                }
            }
        },
        props: {
            initData: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            allNodeData: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            workflowData: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            otherModuleData: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            bType: {
                type: String,
                default: function() {
                    return "";
                }
            },
            queryParams: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            fpIsOk: {
                type: String,
                default: function() {
                    return "";
                }
            }
        },
        methods: {
            openPz() {
                let self = this;
                let query = {
                    pageStatus: "update",
                    voucherType: self.otherModuleData.voucherType,
                    pzRowId: self.otherModuleData.rowId,
                    companyId: self.queryParams.companyId
                };
                if (
                    typeof self.otherModuleData.parentId === "string" &&
                    self.otherModuleData.parentId.length > 0
                ) {
                    query.parentId = self.otherModuleData.parentId;
                }
                self.$router.push({
                    path: "/resourceLibrary/accountingDistribute",
                    query
                });
            },
            chengeTab(index) {
                if (index === 0) {
                    this.tabTpl.daiZhiXing = true;
                    this.tabTpl.yiZhiXing = false;
                } else if (index === 1) {
                    this.tabTpl.daiZhiXing = false;
                    this.tabTpl.yiZhiXing = true;
                }
                this.reloadMyTask();
            },
            cancel() {
                let self = this;
                self.showNodeExecution = false;
            },
            //节点执行 由于maven的模块之间不可相互依赖 故审批只被调用 不做其他模块的调用 所以需要在此控制请求action
            handlePostUrl(params) {
                let self = this;
                self.curNodeExecutionParams = params;
                let moduleType = self.workflowData.moduleType;
                let btnType = params.btnType;
                if (
                    moduleType != undefined &&
                    moduleType != "" &&
                    moduleType === "TYPE_HR_QJ"
                ) {
                    //请假审批
                    //判断点击是哪个按钮 赋值请求url
                    self.otherModuleFormShow.isShowKq = false;
                    self.postOtherModuleParams.askForLeaveRowId = self.workflowData.orderId;
                    if (btnType === "KQ") {
                        self.otherModuleFormShow.isShowKq = true;
                        self.postUrl =
                            "/zingbiz/hrManager/AskForLeave/askForLeaveDeductMoney";
                    } else if (
                        btnType === "ZX" ||
                        btnType === "YYZX" ||
                        btnType === "TJ" ||
                        btnType === "YYTJ"
                    ) {
                        self.postUrl = "/zingbiz/hrManager/AskForLeave/workFlowNodeExecute";
                    } else if (btnType === "BH") {
                        self.postUrl = "/zingbiz/hrManager/AskForLeave/delSalaryItem";
                    }
                } else if (
                    moduleType != undefined &&
                    moduleType != "" &&
                    moduleType === "MODULE_TYPE_ZYK"
                ) {
                    //凭证审批
                    //判断点击是哪个按钮 赋值请求url
                    if (btnType === "SHWC") {
                        self.postOtherModuleParams.voucherInfoId = self.workflowData.orderId;
                        let voucherType = "plain";
                        if (self.otherModuleData.rowId != undefined) {
                            if (self.otherModuleData.voucherType === "DBD") {
                                voucherType = "allocation";
                            }
                        }
                        self.postOtherModuleParams.voucherType = voucherType;
                        self.postOtherModuleParams.voucherStatus = "YSH";
                        self.postUrl = "/zingbiz/resourceLibrary/voucher/approvalExecution";
                    } else if (
                        btnType === "ZX" ||
                        btnType === "YYZX" ||
                        btnType === "TJ" ||
                        btnType === "YYTJ"
                    ) {
                        if (self.otherModuleData.rowId != undefined) {
                            self.postOtherModuleParams.voucherInfoId = self.workflowData.orderId;
                            let voucherType = "plain";
                            if (self.otherModuleData.voucherType == "DBD") {
                                voucherType = "allocation";
                                self.postOtherModuleParams.voucherType = voucherType;
                                self.postOtherModuleParams.voucherStatus = "YSH";
                                self.postUrl = "/zingbiz/resourceLibrary/voucher/approvalExecution";
                            }else if(self.otherModuleData.parentId!=undefined && self.otherModuleData.parentId!=""){
                                self.postOtherModuleParams.voucherType = voucherType;
                                self.postOtherModuleParams.voucherStatus = "YSH";
                                self.postUrl = "/zingbiz/resourceLibrary/voucher/approvalExecution";
                            }else{
                                self.postUrl = "/zingbiz/workflow/helper/executeNode";
                            }

                        }else{
                            self.postUrl = "/zingbiz/workflow/helper/executeNode";
                        }

                    } else if (btnType === "BH") {
                        self.postOtherModuleParams.voucherInfoId = self.workflowData.orderId;
                        let voucherType = "plain";
                        if (self.otherModuleData.rowId != undefined) {
                            if (self.otherModuleData.voucherType === "DBD") {
                                voucherType = "allocation";
                            }
//                            else if(self.otherModuleData.parentId!=undefined && self.otherModuleData.parentId!=""){
//                                voucherType = "allocation";
//                            }
                        }
                        self.postOtherModuleParams.voucherType = voucherType;
                        self.postOtherModuleParams.voucherStatus = "FQ";
                        self.postUrl = "/zingbiz/resourceLibrary/voucher/approvalExecution";
                    }
                } else if (
                    moduleType != undefined &&
                    moduleType != "" &&
                    moduleType === "MT_GDZC"
                ) {
                    //固定资产审批
                    //判断点击是哪个按钮 赋值请求url
                    if (btnType === "SHWC") {
                        self.postOtherModuleParams.cardId = self.workflowData.orderId;
                        self.postOtherModuleParams.cardStatus = "YSH";
                        self.postUrl = "/zingbiz/fixedAssets/assetsManagement/updateStatus";
                    } else if (
                        btnType === "ZX" ||
                        btnType === "YYZX" ||
                        btnType === "TJ" ||
                        btnType === "YYTJ"
                    ) {
                        self.postUrl = "/zingbiz/workflow/helper/executeNode";

                    } else if (btnType === "BH") {
                        self.postOtherModuleParams.cardId = self.workflowData.orderId;
                        self.postOtherModuleParams.cardStatus = "FQ";
                        self.postUrl = "/zingbiz/fixedAssets/assetsManagement/updateStatus";
                    }
                } else if (
                    moduleType != undefined &&
                    moduleType != "" &&
                    moduleType === "MODULE_TYPE_HR_XZTZ"
                ) {
                    //薪资调整审批
                    //判断点击是哪个按钮 赋值请求url
                    if (btnType === "ZX") {
                        self.postOtherModuleParams.askForLeaveRowId =
                            self.workflowData.orderId;
                        self.postUrl =
                            "/zingbiz/hrManager/salaryAdjustment/workFlowNodeExecute";
                    } else if (btnType === "BH") {
                        self.postUrl = "/zingbiz/workflow/helper/executeNode";
                    }
                } else {
                    //基础审批
                    //判断点击是哪个按钮 赋值请求url
                    if (
                        btnType === "ZX" ||
                        btnType === "YYZX" ||
                        btnType === "TJ" ||
                        btnType === "YYTJ"
                    ) {
                        self.postUrl = "/zingbiz/workflow/helper/executeNode";
                    } else if (btnType === "BH") {
                        self.postUrl = "/zingbiz/workflow/helper/executeNode";
                    }
                }
                self.showNodeExecution = true;
            },
            executeCountForCurNode() {
                let self = this;
                let executeCount =
                    self.curNodeExecutionParams.nodeData.executeCount == undefined
                        ? ""
                        : self.curNodeExecutionParams.nodeData.executeCount;
                if (isNaN(executeCount)) {
                    executeCount = 0;
                }
                executeCount = Number(executeCount) + 1;
                return executeCount;
            },
            validateForOtherModule(formData) {
                let self = this;
                if (self.curNodeExecutionParams.btnType == "KQ") {
                    if (formData.hasOwnProperty("deductMoneyNum")) {
                        if (
                            formData.deductMoneyNum != undefined &&
                            formData.deductMoneyNum != ""
                        ) {
                            let exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
                            if (!exp.test(formData.deductMoneyNum)) {
                                self.$vux.toast.text("请正确填入扣钱金额！", "top");
                                return false;
                            }
                        }
                    }
                }
                return true;
            },
            requestDataForOtherModule(formData) {
                if (formData.hasOwnProperty("deductMoneyNum")) {
                    if (
                        formData.deductMoneyNum == undefined ||
                        formData.deductMoneyNum == ""
                    ) {
                        formData.deductMoneyNum = 0;
                    }
                }

                return formData;
            },
            nodeExecution(formData) {
                //                alert(JSON.stringify(formData));
                let self = this;
                let sendData = self.postOtherModuleParams;
                sendData.workflow_id = self.curNodeExecutionParams.nodeData.workflow_id;
                sendData.nodeid = self.curNodeExecutionParams.nodeData.stepId;
                let stepName = self.curNodeExecutionParams.nodeData.stepName;
                sendData.execMsg = formData.staff_state_describe;
                let executeCount = self.executeCountForCurNode();
                sendData.executeCount = executeCount;
                sendData.alertMsg = "执行 " + stepName + "：" + sendData.execMsg;
                sendData.bType = self.bType;
                sendData.companyId = self.queryParams.companyId;

                if (formData.staff_state_describe == "") {
                    self.$vux.toast.text("请输入文字描述！", "top");
                    return false;
                }

                if (!self.validateForOtherModule(formData)) {
                    return false;
                }

                //添加请求类型
                sendData.reqType = self.curNodeExecutionParams.requestType;
                //添加当前执行的审批是否正处于驳回的记录
                sendData.isCurWorkfowForBoHui =
                    self.workflowData.workflow_state === "驳回" ? true : false;

                sendData = self.requestDataForOtherModule(sendData);

                //处理节点子节点数据
                let curExecuteNodeId = self.curNodeExecutionParams.nodeData.stepId;
                //获取当前节点的子节点数据
                let curNodeSubNodeData = self.workflowData.subNodeData[curExecuteNodeId];
                if(curNodeSubNodeData!=undefined && curNodeSubNodeData.length>0){
                    let postSubNodeData = {
                        subNodeData : curNodeSubNodeData
                    };
                    sendData.subNodeData = JSON.stringify(postSubNodeData);
                }

                if (!Z_IsEmpty20(sendData.execMsg) && !Z_IsEmpty20(sendData.nodeid)) {
                    let url = self.postUrl;
                    this.showNodeExecution = false;
                    self.$http.post(url, sendData).then(res => {
                        console.log("返回数据", res.data);
                    let data = res.data;

                    try {
                        if (data && data.success) {
                            //新需求调整 执行后跳转到我审批的列表页面
                            setTimeout(function() {
                                if (self.curNodeExecutionParams.requestType == "BH") {
                                    self.$vux.toast.text("驳回成功！", "top");
                                } else {
                                    self.$vux.toast.text("执行节点成功！", "top");
                                }

                                self.goToForAfterExecute(self.curNodeExecutionParams.nodeData);
                            }, 500);
                        } else {
                            this.$vux.toast.text(
                                res.data.msg == undefined ? res.data.mgs : res.data.msg,
                                "top"
                            );
                        }
                    } catch (e) {}
                });
                }
            },
            weiTuo(params) {
                let self = this;
                var sendData = {};
                sendData.workflow_id = params.nodeData.workflow_id;
                sendData.nodeid = params.nodeData.stepId;
                sendData.nodeName = params.nodeData.stepName;
                sendData.cardUrlPeer = params.selCardUrl;
                var companyId = self.queryParams.companyId;
                if (companyId != undefined && companyId != "") {
                    sendData.idbid = companyId;
                } else {
                    sendData.isCookieDBId = "true";
                }
                var url = "/zingbiz/workflow/helper/tranWoow";

                self.$http.post(url, sendData).then(res => {
                    console.log("返回数据", res.data);
                let data = res.data;

                try {
                    if (data && data.success) {
                        self.$vux.toast.text("委托成功！", "top");
                    } else {
                        self.$vux.toast.text(
                            res.data.msg == undefined ? res.data.mgs : res.data.msg,
                            "top"
                        );
                        return;
                    }
                    self.goToForAfterExecute(nodeData);
                } catch (e) {}
            });
            },
            goToForAfterExecute(nodeData) {
                let self = this;

                if (self.queryParams.jump == "KHGDL") {
                    self.$router.push({
                        path: "showNode",
                        query: {
                            _FRID: nodeData.rowId,
                            companyId: self.queryParams.companyId
                        }
                    });
                } else if (self.queryParams.jump == "CYL") {
                    self.$router.push({
                        path: "showNode",
                        query: {
                            _FRID: nodeData.rowId,
                            companyId: self.queryParams.companyId
                        }
                    });
                } else {
                    this.$router.push({
                        path: "workflowMyApproval",
                        query: {
                            companyId: this.queryParams.companyId,
                            wfType: "YG",
                            _FRID: nodeData.rowId
                        }
                    });
                }
            },
            backClick() {
                let self = this;
                self.showNodeExecution = false;
            },
            reloadMyTask() {
                this.$emit("reloadMyTask");
            }
        }
    };
</script>

<style lang="stylus">
</style>
