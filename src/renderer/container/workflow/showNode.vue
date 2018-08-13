<template>
    <div class="showNode">
        <div :style="headClass">
            <zing-head :title="'审批流详情'"></zing-head>

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

        <div style="margin-top: 94px;">
            <!-- tab 我的任务 -->
            <div v-show="tabTpl.myTask" >
                <my-task v-if="myTaskData!=undefined && myTaskData.length>0" ref="myTask"
                         :initData="myTaskData"
                         :allNodeData="allNodeData"
                         :workflowData="workflowData"
                         :bType="bType"
                         :queryParams="queryParams"
                         @reloadMyTask="getMyTaskData"
                         :fpIsOk="fpIsOk"
                         :otherModuleData="otherModuleData"
                ></my-task>
            </div>

            <!-- tab 总览 -->
            <div v-show="tabTpl.zongLan" >
                <zong-lan v-if="zongLanData!=undefined && zongLanData.length>0" ref="zongLan"
                          :initData="zongLanData"
                          :workflowData="workflowData"
                          :cyrData="cyrData"
                          :otherModuleData="otherModuleData"
                          :queryParams="queryParams"
                          :curUserCardUrl="curUserCardUrl"
                ></zong-lan>
            </div>

            <!-- tab 工单 -->
            <div v-show="tabTpl.gongDan" >
                <gong-dan v-if="gongDanData!=undefined && gongDanData.length>0" ref="gongDan"
                          :initData="gongDanData"
                          :workflowData="workflowData"
                          :otherModuleData="otherModuleData"
                          :queryParams="queryParams"
                ></gong-dan>
            </div>

            <!-- tab 附件会签 -->
            <div style="padding: 1px 0px 0px 0px;" v-show="tabTpl.fuJianHuiQian" >
                <fu-jian-hui-qian v-if="isLoadFuJianHuiQian" ref="fuJianHuiQian"
                                  :workflowData="workflowData"
                                  :zxrData="zxrData"
                                  :cyrData="cyrData"
                                  :bType="bType"
                                  :curUserCardUrl="curUserCardUrl"
                                  @reLoad="getZongLanData('fuJianHuiQian')"
                ></fu-jian-hui-qian>
            </div>
        </div>

    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import myTask from '@/container/workflow/showNodeTabTpl/myTask';
    import zongLan from '@/container/workflow/showNodeTabTpl/zongLan';
    import gongDan from '@/container/workflow/showNodeTabTpl/gongDan';
    import fuJianHuiQian from '@/container/workflow/showNodeTabTpl/fuJianHuiQian';
    import { Z_IsEmpty20,isPc } from "@/utils/fn";

    import {
        Group,XInput,XTextarea,Datetime,Flexbox, FlexboxItem,XButton,Tab, TabItem

    } from 'vux'
    export default {
        name: 'showNode',
        components: {
            Group,XInput,ZingHead,XTextarea,Datetime,
            Flexbox, FlexboxItem,XButton,Tab, TabItem,
            myTask,zongLan,gongDan,fuJianHuiQian
        },
        data() {
            return {
                headClass:{
                    "position":"absolute",
                    "z-index":"500",
                    "width":"100%",
                    "background-color":"#f7f7fa"
                },
                tabTitle: ["我的任务", "总览","工单","附件会签"],
                defTab: "我的任务",
                isShowMyTaskTab:true,
                curWorkflowId:"",
                queryParams:{
                    workflow_id:"",
                    companyId:"",
                    jump:"",
                },
                tabTpl:{
                    //我的任务tab
                    myTask:true,
                    //总览tab
                    zongLan:false,
                    //工单tab
                    gongDan:false,
                    //附件会签
                    fuJianHuiQian:false
                },
                myTaskData:[],
                allNodeData:[],
                zongLanData:[],
                workflowData:{},
                zxrData:[],
                cyrData:[],
                gongDanData:[],
                bType:"",
                fpIsOk:"true",
                otherModuleData:{},
                curUserCardUrl:"",
                isLoadFuJianHuiQian:false,

            };
        },
        //钩子加载完触发
        created: function () {
            if(isPc()){
                this.headClass.width = (document.body.clientWidth-200)+"px";
            }
            //处理url参数值
            this.handleQueryParams();
            //整理请求需要参数值
            let pat = {};
            let companyId = this.queryParams.companyId;
            let workflow_id = this.queryParams.workflow_id==undefined?"":this.queryParams.workflow_id;
            pat.woowId = workflow_id;
            pat.companyId = companyId;
            console.log(" workflow_id : "+ workflow_id);
            this.bType = "WOOW";
            if(workflow_id.indexOf("WOOW")>=0){
                this.curWorkflowId = workflow_id.substring(4);
            }else{
                this.bType =  "KH_ORDER";
                this.curWorkflowId = workflow_id.substring(8);
            }

            //验证当前登录人是否为审批执行人 控制我的任务tab是否显示
            this.isZhiXingRenForCurCardUrl(pat);

            //获取审批流主数据
            let self = this;
            setTimeout(function (args) {
                self.getWorkflowDataById();
            },600);



        },
        methods: {
            handleQueryParams(){
                this.queryParams.workflow_id=this.$route.query.workflow_id;
                this.queryParams.companyId=this.$route.query.companyId;

            },
            getWorkflowDataById(){
                let self = this;
                var pat={};
                var wfid = self.curWorkflowId;
                if(wfid==undefined && wfid==null && wfid==""){
                    return null;
                }
                pat.id=wfid;
                var companyId=self.queryParams.companyId;
                if(companyId!=undefined && companyId!=""){
                    pat.idbid=companyId;
                    pat.companyId=companyId;
                }
                var url="/zingbiz/workflow/workFlowQuery/getWorkflowDataById";
                self.$http.post(url,pat).then(res => {
                    let dataTemp = res.data;
                if(dataTemp&&dataTemp.data){
                    var rd = dataTemp.data;
                    self.workflowData=rd;
                    if(self.workflowData.workflow_state=="驳回"){

                    }
                    if(self.workflowData.check_invite=="是"){
//                        isCanYaoQing = true;
                    }
                    if(self.workflowData.linkTaskIds!=undefined && self.workflowData.linkTaskIds!=""){
//                        var taskIds = workflowData.linkTaskIds;
//                        var taskIdsArr = taskIds.split(",");
//                        cacheTaskData = taskIdsArr;
                    }
                    self.getOtherModuleType(rd);

                    if(self.isShowMyTaskTab){
                        //请求我的任务数据
                        self.getMyTaskData();
                    }else{
                        //请求总览数据
                        self.getZongLanData();
                    }
                }
            });

            },
            getOtherModuleType(wfData){
                let self = this;
                if(wfData!=undefined){
                    if(wfData.moduleType==="TYPE_HR_QJ"){
                        //获取请假数据
                        let url = "/zingbiz/hrManager/AskForLeave/getAskForLeaveDataById";
                        var params = {
                            rowId:wfData.orderId
                        };
                        self.$http.post(url,params).then(res => {
                        self.otherModuleData = res.data.data;
                        self.otherModuleData.workflow_name=wfData.workflow_name;
                        self.otherModuleData.workflow_describe=wfData.workflow_describe;

                    });
                    }else if(wfData.moduleType==="MODULE_TYPE_ZYK"){
                        //获取凭证数据
                        let url = "/zingbiz/resourceLibrary/voucher/selectVoucherInfoById";
                        let rowId = wfData.orderId;
                        var params = {
                            rowId
                        };
                        self.$http.get(url,{ params }).then(res => {
                            if(res.data.data){
                                self.otherModuleData = res.data.data;
                                self.otherModuleData.dataStatus=res.data.data.pzStatus;
                            }
                            self.otherModuleData.workflow_name=wfData.workflow_name;
                            self.otherModuleData.workflow_describe=wfData.workflow_describe;

                        });

                    }else if(wfData.moduleType==="MODULE_TYPE_HR_XZTZ"){
                        //获取薪资调整数据
                        let url = "/zingbiz/hrManager/salaryAdjustment/getSalaryAdjustmentById";
                        var params = {
                            rowId:wfData.orderId
                        };
                        self.$http.post(url,params).then(res => {
                        self.otherModuleData = res.data.data;
                        self.otherModuleData.workflow_name=wfData.workflow_name;
                        self.otherModuleData.workflow_describe=wfData.workflow_describe;

                    });
                    }else if(wfData.moduleType==="MT_GDZC"){
                        //获取固定资产数据
                        let url = "/zingbiz/fixedAssets/assetsManagement/select";
                        let rowId = wfData.orderId;
                        var params = {
                            id:rowId
                        };
                        self.$http.get(url,params).then(res => {
                            if(res.data.data){
                                self.otherModuleData = res.data.data;
                                self.otherModuleData.dataStatus=res.data.data.status;
                            }
                            self.otherModuleData.workflow_name=wfData.workflow_name;
                            self.otherModuleData.workflow_describe=wfData.workflow_describe;

                        });

                    }else{
                        self.otherModuleData = wfData;
                    }
                }

            },
            getMyTaskData(){
                let self = this;
                let url = "/zingbiz/workflow/workflowRelationTable/xiankuang";
                let params = {};
                params.companyId=self.queryParams.companyId;
                params.workflow_id=self.curWorkflowId;
                params.templateId = self.workflowData.workflow_sort_id;
                self.$http.post(url,params).then(res => {
                    console.log("返回数据",res.data)
                this.myTaskData = res.data.data.xkData;
                this.allNodeData = res.data.data.allNodeData;

            });

            },
            getZongLanData(toType){

                let self = this;
                let url = "/zingbiz/workflow/workflowRelationTable/zonglan";
                let params = {};
                params.companyId=self.queryParams.companyId;
                params.workflow_id=self.curWorkflowId;
                params.templateId = self.workflowData.workflow_sort_id;
                self.$http.post(url,params).then(res => {
                    console.log("返回数据",res.data)

                let retData =res.data;
                self.zongLanData = retData.data.stepList;
                self.allNodeData = retData.data.stepList;

                self.zxrData = retData.data.stepList;
                self.cyrData = retData.data.cyrData;
                if(toType!=undefined && toType==="fuJianHuiQian"){
                    self.isLoadFuJianHuiQian = true;
                }

                //处理数据
                for(let i in self.zongLanData){
                    let ndTemp = self.zongLanData[i];

                    //判断节点是否有前序节点
                    if(ndTemp.relationNodes!=undefined && ndTemp.relationNodes!=""){
                        let relationNodesStr = ndTemp.relationNodes;
                        //判断前序节点的完成状态
                        let relationNodesArr = [];
                        for(let k in self.allNodeData){
                            if(relationNodesStr.indexOf(self.allNodeData[k].stepId)>=0){
                                let isOk = false;
                                if(self.allNodeData[k].staff_state==="已完成"){
                                    isOk = true;
                                }
                                let relationNodesJson = {};
                                relationNodesJson.nodeName=self.allNodeData[k].stepName;
                                relationNodesJson.isOk=isOk;
                                relationNodesJson.zxr=self.allNodeData[k].stepName;
                                relationNodesArr.push(relationNodesJson);
                            }
                        }
                        self.zongLanData[i].relationNodesData = relationNodesArr;
                    }

                    //判断当前节点是否存在语音数据
                    let voiceStr = ndTemp.mp3s==undefined?"":ndTemp.mp3s;
                    if(!Z_IsEmpty20(voiceStr)){
                        let mp3Arr = voiceStr.split(",");
                        let mp3Data = [];
                        for(let k = 0 ; k<mp3Arr.length;k++){
                            var voiceSrc = mp3Arr[k]+"?t="+new Date().getTime();
                            mp3Data.push(voiceSrc);
                        }
                        self.zongLanData[i].voiceData = mp3Data;
                    }
                }
                self.getGongDanData();

            });

            },
            getGongDanData(){
                let self = this;
//                self.getZongLanData();
                let gongDanDataTemp = this.zongLanData;
                //处理数据
                for(let i = 0; i<gongDanDataTemp.length;i++){
                    let curCardUrl=gongDanDataTemp[i].cardUrl;
                    if((parseInt(i)+1)<gongDanDataTemp.length){
                        let dTemp = gongDanDataTemp[parseInt(i)+1];
                        //判断下一个节点执行人是否和当前节点执行人相同
                        if(dTemp.cardUrl == curCardUrl){
                            //判断当前节点是否已经执行完成
                            if(gongDanDataTemp[i].staff_state==='已完成'){
                                gongDanDataTemp[parseInt(i)+1].previousExecuteTime = gongDanDataTemp[i].staff_finish_time;
                            }else{
                                if(gongDanDataTemp[i].previousExecuteTime!=undefined && gongDanDataTemp[i].previousExecuteTime!=""){
                                    gongDanDataTemp[parseInt(i)+1].previousExecuteTime = gongDanDataTemp[i].previousExecuteTime;
                                }else{
                                    gongDanDataTemp[parseInt(i)+1].previousExecuteTime = "";
                                }

                            }

                            if(i==gongDanDataTemp.length-1){
                                gongDanDataTemp[i].isShowZxr = true;
                            }else{
                                gongDanDataTemp[i].isShowZxr = false;
                            }
                        }else{
                            if(gongDanDataTemp[i].staff_state==='已完成'){
                                gongDanDataTemp[i].previousExecuteTime = gongDanDataTemp[i].staff_finish_time;
                            }
                            gongDanDataTemp[i].isShowZxr = true;
                            gongDanDataTemp[parseInt(i)+1].isShowTopLine = true;
                            if(i==0){
                                gongDanDataTemp[i].isShowTopLine = true;
                            }
                        }
                    }else{
                        //最后一个节点了
                        if(gongDanDataTemp[i].staff_state==='已完成'){
                            gongDanDataTemp[i].previousExecuteTime = gongDanDataTemp[i].staff_finish_time;
                        }
                        let dTemp;
                        if(gongDanDataTemp.length == 1){
                            dTemp = gongDanDataTemp[parseInt(i)];
                        }else{
                            dTemp = gongDanDataTemp[parseInt(i)-1];
                        }

                        //判断下一个节点执行人是否和当前节点执行人相同
                        if(dTemp.cardUrl == gongDanDataTemp[i].cardUrl){
                            if(gongDanDataTemp.length == 1){
                                gongDanDataTemp[i].isShowTopLine = true;
                            }else{
                                gongDanDataTemp[i].isShowTopLine = false;
                            }

                        }else{
                            gongDanDataTemp[i].isShowTopLine = true;
                        }
                        gongDanDataTemp[i].isShowZxr = true;
                    }
                }

                console.log("数据",gongDanDataTemp);
                this.gongDanData = gongDanDataTemp;
            },
            doSubmit(btnType){
                //alert(JSON.stringify(this.$refs.baseForm.formParams));

            },
            chengeTab(index) {
                if(!this.isShowMyTaskTab){
                    index+=1;
                }
                if (index === 0) {
                    this.tabTpl.myTask = true;
                    this.tabTpl.zongLan = false;
                    this.tabTpl.gongDan = false;
                    this.tabTpl.fuJianHuiQian = false;
                    this.getMyTaskData();
                } else if (index === 1) {
                    this.tabTpl.myTask = false;
                    this.tabTpl.zongLan = true;
                    this.tabTpl.gongDan = false;
                    this.tabTpl.fuJianHuiQian = false;
                    this.getZongLanData();
                } else if (index === 2) {
                    this.tabTpl.myTask = false;
                    this.tabTpl.zongLan = false;
                    this.tabTpl.gongDan = true;
                    this.tabTpl.fuJianHuiQian = false;
                    this.getZongLanData();

                } else if (index === 3) {
                    this.tabTpl.myTask = false;
                    this.tabTpl.zongLan = false;
                    this.tabTpl.gongDan = false;
                    this.tabTpl.fuJianHuiQian = true;
                    this.getZongLanData("fuJianHuiQian");
                }
            },
            isZhiXingRenForCurCardUrl(params){
                let self = this;
                params.workflow_id = self.curWorkflowId;
                let url = "/zingbiz/workflow/workflowRelationTable/isZhiXingRenForCurCardUrl"
                this.$http.post(url,params).then(res => {
                    console.log("返回数据",res.data.data)
                let retData = res.data.data;
                self.curUserCardUrl = retData.cardUrl;
                if(retData.isZXR!="true"){
                    this.isShowMyTaskTab=false;
                    this.tabTitle = ["总览","工单","附件会签"];
                    this.defTab = "总览";
                    this.chengeTab(0);
                }

            });

            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';
    .showNode {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .formFontSize{
        font-size: 16px !important;
    }
</style>
