<template>
    <div class="launchWorkflow">
        <zing-head :title="'创建审批流'"></zing-head>

        <!-- 基础表单项 -->
        <div v-show="formTemplate.baseForm" >
            <base-form v-if="formTemplate.baseForm" ref="baseForm"
                       :formData="formData"
            ></base-form>
        </div>
        <!-- 薪资调整表单项 -->
        <div v-show="formTemplate.xztzForm" >
            <xztz-form v-if="formTemplate.xztzForm" ref="xztzForm"
                       :formData="formData"
            ></xztz-form>
        </div>
        <!-- 请假表单项 -->
        <div v-show="formTemplate.qjForm" >
            <qj-form v-if="formTemplate.qjForm" ref="qjForm"
                     :formData="formData"
            ></qj-form>
        </div>
        <!-- 凭证表单项 -->
        <div v-show="formTemplate.pzForm" >
            <pz-form v-if="formTemplate.pzForm" ref="pzForm"
                     :formData="formData"
            ></pz-form>
        </div>
        <!-- 关联任务 -->
        <div v-show="formTemplate.linkTaskWorkForm" >
            <link-task-work v-if="formTemplate.linkTaskWorkForm" ref="linkTaskForm"
                            :formData="formData"
            ></link-task-work>
        </div>
        <!-- 节点流程DOM -->
        <show-node-and-sel-executor v-if="nodeDataForTemplate" ref="nodeForm"
                                    :nodeData="nodeDataForTemplate"
                                    :canYuRenData="canYuRenData"
        ></show-node-and-sel-executor>

        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <x-switch title="允许审批开始后继续邀请参与人" :value-map="['否', '是']" v-model="formParams.check_invite"></x-switch>

        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <div style="margin-top: 20px;">
            <flexbox>
                <flexbox-item>
                    <x-button style="font-size: 16px;" type="primary" class="btn-save" @click.native="doSubmit('ZC')">暂 存</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="font-size: 16px;" type="primary" class="btn-common" @click.native="doSubmit('tj')">提 交</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <br/>

    </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead";
import baseForm from "@/container/workflow/formTemplate/base";
import pzForm from "@/container/workflow/formTemplate/pz";
import qjForm from "@/container/workflow/formTemplate/qj";
import xztzForm from "@/container/workflow/formTemplate/xztz";
import showNodeAndSelExecutor from "@/container/workflow/formTemplate/showNodeAndSelExecutor";
import linkTaskWork from "@/container/workflow/formTemplate/linkTaskWork";
import { compareDate, dateFormat } from "../../utils/date";
import { Z_IsEmpty20 } from "@/utils/fn";

import {
  Group,
  XInput,
  XTextarea,
  Datetime,
  Flexbox,
  FlexboxItem,
  XButton,
  XSwitch,
  Confirm
} from "vux";
export default {
  name: "launchWorkflow",
  components: {
    Group,
    XInput,
    ZingHead,
    XTextarea,
    Datetime,
    baseForm,
    qjForm,
    xztzForm,
    Flexbox,
    FlexboxItem,
    XButton,
    XSwitch,
    showNodeAndSelExecutor,
    linkTaskWork,
    pzForm,
    Confirm
  },
  data() {
    return {
      isLinkTask: false,
      showConfirm: false,
      confirmTitle: "",
      confirmContent: "",
      queryParams: {
        tplId: "",
        cType: "",
        pzRowId: "",
        toNewPage: "",
        voucherType: "",
        WF_ZCID: "",
        id: "",
        companyId: ""
      },
      formTemplate: {
        //基础表单项
        baseForm: false,
        //薪资调整表单项
        xztzForm: false,
        //请假表单项
        qjForm: false,
        //资源库凭证
        pzForm: false,
        //关联任务
        linkTaskWorkForm: false
      },
      formParams: {
        check_invite: "是"
      },
      formData: {
        workflow_name: "",
        workflow_describe: "",
        expiration_time: "",
        workflow_sort_describe: ""
      },
      categoryTpl: {},
      categorys: {},
      tplMap: {},
      flowData: {},
      nodeDataForTemplate: [],
      RealName: {},
      workflowDataForZC: {},
      workflowDataForExistWorkflow: {},
      dataForFriends: {},
      canYuRenData: []
    };
  },
  //钩子加载完触发
  created: function() {
    //处理url参数值
    this.handleQueryParams();

    //获取页面中所需要的所有数据
    this.getAllPageData();
  },
  methods: {
    handleQueryParams() {
      this.queryParams.tplId =
        this.$route.query.tplId == undefined ||
        this.$route.query.tplId == "undefined"
          ? ""
          : this.$route.query.tplId;
      this.queryParams.cType =
        this.$route.query.cType == undefined ||
        this.$route.query.cType == "undefined"
          ? ""
          : this.$route.query.cType;
      this.queryParams.pzRowId =
        this.$route.query.pzRowId == undefined ||
        this.$route.query.pzRowId == "undefined"
          ? ""
          : this.$route.query.pzRowId;
      this.queryParams.toNewPage =
        this.$route.query.toNewPage == undefined ||
        this.$route.query.toNewPage == "undefined"
          ? ""
          : this.$route.query.toNewPage;
      this.queryParams.voucherType =
        this.$route.query.voucherType == undefined ||
        this.$route.query.voucherType == "undefined"
          ? ""
          : this.$route.query.voucherType;

      this.queryParams.WF_ZCID =
        this.$route.query.WF_ZCID == undefined ||
        this.$route.query.WF_ZCID == "undefined"
          ? ""
          : this.$route.query.WF_ZCID;
      this.queryParams.id =
        this.$route.query.id == undefined || this.$route.query.id == "undefined"
          ? ""
          : this.$route.query.id;
      this.queryParams.companyId =
        this.$route.query.companyId == undefined ||
        this.$route.query.companyId == "undefined"
          ? ""
          : this.$route.query.companyId;
    },
    doSubmit(submitType) {
      let self = this;
      self.handleFormParams();
      if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "TYPE_HR_QJ"
      ) {
        self.createWFForQj(submitType);
      } else if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "MODULE_TYPE_ZYK"
      ) {
        self.createWFForZYK(submitType);
      } else if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "MODULE_TYPE_HR_XZTZ"
      ) {
        self.createWFForZXTZ(submitType);
      } else {
        self.createWorkFlow(submitType);
      }
    },
    mergeTowJson(jsonbject1, jsonbject2) {
      let resultJsonObject = {};
      for (let attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
      }
      for (let attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr];
      }
      return resultJsonObject;
    },
    handleFormParams() {
      if (
        this.queryParams.cType != undefined &&
        this.queryParams.cType == "TYPE_HR_QJ"
      ) {
        let subFormParams = this.$refs.qjForm.formParams;
        this.formParams = this.mergeTowJson(this.formParams, subFormParams);
      } else if (
        this.queryParams.cType != undefined &&
        this.queryParams.cType == "MODULE_TYPE_ZYK"
      ) {
        let subFormParams = this.$refs.pzForm.formParams;
        this.formParams = this.mergeTowJson(this.formParams, subFormParams);
      } else if (
        this.queryParams.cType != undefined &&
        this.queryParams.cType == "MODULE_TYPE_HR_XZTZ"
      ) {
        let subFormParams = this.$refs.xztzForm.formParams;
        this.formParams = this.mergeTowJson(this.formParams, subFormParams);
      } else {
        let subFormParams = this.$refs.baseForm.formParams;
        this.formParams = this.mergeTowJson(this.formParams, subFormParams);
      }
      if (this.isLinkTask) {
        //数据格式：boardId=xxx&listId=xxx&cardId=xxx&title=xxx,boardId=xxx&listId=xxx&cardId=xxx&title=xxx
        let linkTaskData = this.$refs.linkTaskForm.linkTaskData;
        let linkTaskIds = "";
        if (linkTaskData != undefined && linkTaskData.length > 0) {
          linkTaskData.forEach(item => {
            linkTaskIds +=
              "boardId=" +
              item.boardId +
              "&listId=" +
              item.listId +
              "&cardId=" +
              item.cardId +
              "&title=" +
              item.title +
              ",";
          });
          if (linkTaskIds != undefined && linkTaskIds.length > 0) {
            linkTaskIds = linkTaskIds.substring(0, linkTaskIds.length - 1);
          }
        }
        this.formParams.linkTaskIds = linkTaskIds;
      }
    },
    vForm(params) {
      let self = this;
      if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "TYPE_HR_QJ"
      ) {
        //请假审批表单验证
        if (!self.formParams.type) {
          self.$vux.toast.text("请选择请假类型！", "top");
          return false;
        }
        if (!self.formParams.startTime) {
          self.$vux.toast.text("请选择请假起始日期！", "top");
          return false;
        }
        if (!self.formParams.endTime) {
          self.$vux.toast.text("请选择请假期截至日期！", "top");
          return false;
        }
        if (
          compareDate(
            self.formParams.startTime + " 00:00:00",
            self.formParams.endTime + " 00:00:00"
          ) > 0
        ) {
          self.$vux.toast.text("起始日期不能大于结束日期！", "top");
          return false;
        }

        if (!self.formParams.reason) {
          self.$vux.toast.text("请填写请假原因！", "top");
          return false;
        }
      } else if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "MODULE_TYPE_ZYK"
      ) {
        //资源库凭证审批表单验证
        if (!self.formParams.workflow_name) {
          self.$vux.toast.text("请填写审批流名称！", "top");
          return false;
        }
        if (!self.formParams.workflow_describe) {
          self.$vux.toast.text("请填写审批流描述！", "top");
          return false;
        }
        if (self.formParams.workflow_name.length > 100) {
          self.$vux.toast.text("审批流名称不能超过100个字！", "top");
          return false;
        }
        if (!self.formParams.workflow_describe.length > 1000) {
          self.$vux.toast.text("审批流描述不能超过1000个字！", "top");
          return false;
        }
      } else if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType == "MODULE_TYPE_HR_XZTZ"
      ) {
        //薪资调整审批表单验证
        if (!self.formParams.salaryRegulatorCardUrl) {
          self.$vux.toast.text("请选择薪资调整人！", "top");
          return false;
        }
        if (!self.formParams.startTime) {
          self.$vux.toast.text("请选择调整日期！", "top");
          return false;
        }
        if (
          self.formParams.changeSalaryNum != "" &&
          self.formParams.changeSalaryNum != undefined
        ) {
          let exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
          if (!exp.test(self.formParams.changeSalaryNum)) {
            self.$vux.toast.text("请正确填入调整金额！", "top");
            return false;
          }
        } else {
          self.formParams.changeSalaryNum = 0;
        }
        if (
          self.formParams.rewardNum != "" &&
          self.formParams.rewardNum != undefined
        ) {
          var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
          if (!exp.test(self.formParams.rewardNum)) {
            showBottomPrompt("！", 2000);
            self.$vux.toast.text("请正确填入奖惩金额！", "top");
            return false;
          }
        } else {
          self.formParams.rewardNum = 0;
        }
      } else {
        //基础审批表单验证
        if (self.flowData == null || self.flowData == "null") {
          if (!self.formParams.workflow_classify_id) {
            self.$vux.toast.text("请选择分类！", "top");
            return false;
          }
          if (!self.formParams.workflow_sort_id) {
            self.$vux.toast.text("请选择模板！", "top");
            return false;
          }
          if (!self.formParams.workflow_name) {
            self.$vux.toast.text("请填写审批流名称！", "top");
            return false;
          }
          if (!self.formParams.workflow_describe) {
            self.$vux.toast.text("请填写审批流描述！", "top");
            return false;
          }
          if (self.formParams.workflow_name.length > 100) {
            self.$vux.toast.text("审批流名称不能超过100个字！", "top");
            return false;
          }
          if (!self.formParams.workflow_describe.length > 1000) {
            self.$vux.toast.text("审批流描述不能超过1000个字！", "top");
            return false;
          }
          let et = self.formParams.expiration_time;
          if (et != undefined && et != null && et != "") {
            if (compareDate(et, dateFormat(new Date(), "yyyy-MM-dd")) <= 0) {
              self.$vux.toast.text("失效日期无效，必须大于当前日期！", "top");
              return false;
            }
          }
        }
      }
      //验证是否关联了任务
      if (self.isLinkTask) {
        let linkTaskData = self.$refs.linkTaskForm.linkTaskData;
        if (
          linkTaskData == undefined ||
          Z_IsEmpty20(linkTaskData) ||
          linkTaskData.length == 0
        ) {
          self.$vux.toast.text("请选择关联任务！", "top");
          return false;
        }
      }

      //验证审批节点是否正常
      let uData = params["uData"];
      //判断节点是否有执行者
      let ndata = uData["nodeData"];
      let ntf = true;
      if (ndata != undefined && ndata != null && ndata != "") {
        for (let i = 0; i < ndata.length; i++) {
          let d = ndata[i];
          if (d.stepType == "YG") {
            if (
              d["cardUrl"] == undefined ||
              d["cardUrl"] == null ||
              d["cardUrl"] == ""
            ) {
              self.$vux.toast.text(
                "请选择“流程信息” 中 “" + d["stepName"] + "” 的执行人。",
                "top"
              );
              ntf = false;
              break;
            }
          }
        }
      } else {
        self.$vux.toast.text(
          "无效流程设定，该流程没有设定节点或数据异常，无法提交！",
          "top"
        );
        return false;
      }
      if (!ntf) {
        return false;
      }

      return true;
    },
    createWorkFlow(submitType) {
      let self = this;
      let params = self.formParams;

      let uData = {
        canYuZheData: self.$refs.nodeForm.canYuRenData,
        nodeData: self.$refs.nodeForm.nodeData
      };
      params["uData"] = uData;
      let bool = self.vForm(params);
      if (!bool) {
        return;
      }
      let configStr = "";
      if (submitType != undefined && submitType == "ZC") {
        configStr = "是否确认暂存？";
      } else {
        configStr = "是否确认提交？";
      }
      params.companyId = self.queryParams.companyId;
      params["wData_nodeData"] = JSON.stringify(uData);

      if (
        self.flowData != undefined &&
        self.flowData != null &&
        self.flowData != "null"
      ) {
        params["workflow_sort_id"] = self.flowData["workflow_sort_id"];
        params["workflow_classify_id"] = self.flowData["workflow_classify_id"];
        params["workflow_classify"] = self.flowData.workflow_classify;
        params.workflow_sort = self.flowData.workflow_sort;
      }
      let url = "/zingbiz/workflow/createWorkFlow/createWorkflow.action";
      //                    $("#btnForSubmit").attr("disabled","true");
      if (!Z_IsEmpty20(self.queryParams.id)) {
        params.workflow_id = self.queryParams.id;
      }
      if (submitType != undefined && submitType == "ZC") {
        self.submitForZC(params);
      } else {
        //判断是否需要传入暂存id
        if (!Z_IsEmpty20(self.workflowDataForZC)) {
          params.WFZCID = self.workflowDataForZC.workflow_id;
        }
        delete params.uData;
        self.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              let woowId = res.data.data;
              if (self.isLinkTask) {
                //TODO 添加任务关联数据
              }
              self.$router.push({
                path: "showNode",
                query: {
                  workflow_id: woowId,
                  companyId: self.queryParams.companyId
                }
              });
            } else {
              self.$vux.toast.text(
                res.data.msg == undefined ? res.data.mgs : res.data.msg,
                "top"
              );
            }
          })
          .catch(err => {
            self.$vux.toast.text("操作异常，请稍后重试！", "top");
          });
      }
    },
    createWFForQj(submitType) {
      let self = this;
      let params = self.formParams;

      let uData = {
        canYuZheData: self.$refs.nodeForm.canYuRenData,
        nodeData: self.$refs.nodeForm.nodeData
      };
      params["uData"] = uData;
      let bool = self.vForm(params);
      if (!bool) {
        return;
      }
      let configStr = "";
      if (submitType != undefined && submitType == "ZC") {
        configStr = "是否确认暂存？";
      } else {
        configStr = "是否确认提交？";
      }
      params.companyId = self.queryParams.companyId;
      params["wData_nodeData"] = JSON.stringify(uData);

      if (
        self.flowData != undefined &&
        self.flowData != null &&
        self.flowData != "null"
      ) {
        params["workflow_sort_id"] = self.flowData["workflow_sort_id"];
        params["workflow_classify_id"] = self.flowData["workflow_classify_id"];
        params["workflow_classify"] = self.flowData.workflow_classify;
        params.workflow_sort = self.flowData.workflow_sort;
      }
      let url = "/zingbiz/hrManager/AskForLeave/addAskForLeave";
      //                    $("#btnForSubmit").attr("disabled","true");
      if (!Z_IsEmpty20(self.queryParams.id)) {
        params.workflow_id = self.queryParams.id;
      }
      if (submitType != undefined && submitType == "ZC") {
        self.submitForZC(params);
      } else {
        //判断是否需要传入暂存id
        if (!Z_IsEmpty20(self.workflowDataForZC)) {
          params.WFZCID = self.workflowDataForZC.workflow_id;
        }
        delete params.uData;
        self.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              let woowId = res.data.data.woowId;
              if (self.isLinkTask) {
                //TODO 添加任务关联数据
              }
              self.$router.push({
                path: "showNode",
                query: {
                  workflow_id: woowId,
                  companyId: self.queryParams.companyId
                }
              });
            } else {
              self.$vux.toast.text(
                res.data.msg == undefined ? res.data.mgs : res.data.msg,
                "top"
              );
            }
          })
          .catch(err => {
            self.$vux.toast.text("操作异常，请稍后重试！", "top");
          });
      }
    },
    createWFForZYK(submitType) {
      let self = this;
      let params = self.formParams;

      let uData = {
        canYuZheData: self.$refs.nodeForm.canYuRenData,
        nodeData: self.$refs.nodeForm.nodeData
      };
      params["uData"] = uData;
      let bool = self.vForm(params);
      if (!bool) {
        return;
      }
      let configStr = "";
      if (submitType != undefined && submitType == "ZC") {
        configStr = "是否确认暂存？";
      } else {
        configStr = "是否确认提交？";
      }
      params.companyId = self.queryParams.companyId;
      params["wData_nodeData"] = JSON.stringify(uData);

      if (
        self.flowData != undefined &&
        self.flowData != null &&
        self.flowData != "null"
      ) {
        params["workflow_sort_id"] = self.flowData["workflow_sort_id"];
        params["workflow_classify_id"] = self.flowData["workflow_classify_id"];
        params["workflow_classify"] = self.flowData.workflow_classify;
        params.workflow_sort = self.flowData.workflow_sort;
      }
      let url = "/zingbiz/resourceLibrary/voucher/updateVoucherInfoStatus";
      //                    $("#btnForSubmit").attr("disabled","true");
      if (!Z_IsEmpty20(self.queryParams.id)) {
        params.workflow_id = self.queryParams.id;
      }
      params.pzRowId = self.queryParams.pzRowId;
      params.orderId = self.queryParams.pzRowId;
      params.voucherType = self.queryParams.voucherType;
      params.pzStatus = "DSH";
      params.moduleType = "MODULE_TYPE_ZYK";
      params.voucherInfoId = self.queryParams.pzRowId;
      if (submitType != undefined && submitType == "ZC") {
        self.submitForZC(params);
      } else {
        //判断是否需要传入暂存id
        if (!Z_IsEmpty20(self.workflowDataForZC)) {
          params.WFZCID = self.workflowDataForZC.workflow_id;
        }
        delete params.uData;
        self.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              let woowId = res.data.data.data;
              if (self.isLinkTask) {
                //TODO 添加任务关联数据
              }
              let query = {
                pageStatus: "update",
                pzRowId: self.queryParams.pzRowId,
                companyId: self.queryParams.companyId
              };
              let voucherType = self.queryParams.voucherType;
              if (voucherType.indexOf("child") >= 0) {
                query.voucherType = voucherType
                  .replace("child", "")
                  .replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
                    return $1.toLowerCase() + $2;
                  });
                query.parentId = this.$route.query.parentId;
              } else {
                query.voucherType = voucherType;
              }
              self.$router.push({
                path: "/resourceLibrary/accountingDistribute",
                query
              });
            } else {
              self.$vux.toast.text(
                res.data.msg == undefined ? res.data.mgs : res.data.msg,
                "top"
              );
            }
          })
          .catch(err => {
            self.$vux.toast.text("操作异常，请稍后重试！", "top");
          });
      }
    },
    createWFForZXTZ(submitType) {
      let self = this;
      let params = self.formParams;

      let uData = {
        canYuZheData: self.$refs.nodeForm.canYuRenData,
        nodeData: self.$refs.nodeForm.nodeData
      };
      params["uData"] = uData;
      let bool = self.vForm(params);
      if (!bool) {
        return;
      }
      let configStr = "";
      if (submitType != undefined && submitType == "ZC") {
        configStr = "是否确认暂存？";
      } else {
        configStr = "是否确认提交？";
      }
      params.companyId = self.queryParams.companyId;
      params["wData_nodeData"] = JSON.stringify(uData);

      if (
        self.flowData != undefined &&
        self.flowData != null &&
        self.flowData != "null"
      ) {
        params["workflow_sort_id"] = self.flowData["workflow_sort_id"];
        params["workflow_classify_id"] = self.flowData["workflow_classify_id"];
        params["workflow_classify"] = self.flowData.workflow_classify;
        params.workflow_sort = self.flowData.workflow_sort;
      }
      let url =
        "/zingbiz/hrManager/salaryAdjustment/startSalaryAdjustmentWorkFlow";
      //                    $("#btnForSubmit").attr("disabled","true");
      if (!Z_IsEmpty20(self.queryParams.id)) {
        params.workflow_id = self.queryParams.id;
      }
      if (submitType != undefined && submitType == "ZC") {
        self.submitForZC(params);
      } else {
        //判断是否需要传入暂存id
        if (!Z_IsEmpty20(self.workflowDataForZC)) {
          params.WFZCID = self.workflowDataForZC.workflow_id;
        }
        delete params.uData;
        self.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              let woowId = res.data.data.woowId;
              if (self.isLinkTask) {
                //TODO 添加任务关联数据
              }
              self.$router.push({
                path: "showNode",
                query: {
                  workflow_id: woowId,
                  companyId: self.queryParams.companyId
                }
              });
            } else {
              self.$vux.toast.text(
                res.data.msg == undefined ? res.data.mgs : res.data.msg,
                "top"
              );
            }
          })
          .catch(err => {
            self.$vux.toast.text("操作异常，请稍后重试！", "top");
          });
      }
    },
    submitForZC(params) {
      let url = "/zingbiz/workflow/temporaryWorkflow/add";

      let uData = params.uData;
      //处理参与人数据
      params.dataForCYR = uData.canYuZheData;
      //处理节点执行人数据
      let dataForZXR = {};
      if (uData.nodeData != undefined && !Z_IsEmpty20(uData.nodeData)) {
        for (let i = 0; i < uData.nodeData.length; i++) {
          let zxrTemp = {
            cardUrl: uData.nodeData[i].cardUrl,
            executor: uData.nodeData[i].executor
          };
          dataForZXR[uData.nodeData[i].nodeId] = zxrTemp;
        }
        params.dataForZXR = dataForZXR;
      }

      delete params.wData_nodeData;
      delete params.uData;
      delete params.workflow_id;

      params.imgData = "";

      params.formData = JSON.stringify(params);
      delete params.dataForCYR;
      delete params.dataForZXR;
      delete params.imgData;
      //处理url中的参数 进行记录
      let urlParamsStr = "";
      if (this.queryParams != undefined && !Z_IsEmpty20(this.queryParams)) {
        delete this.queryParams.WF_ZCID;

        for (let k in this.queryParams) {
          urlParamsStr += "&" + k + "=" + this.queryParams[k];
        }
      }
      params.urlParams = urlParamsStr;
      params.companyId = this.queryParams.companyId;

      //判断是否有传入暂存数据的id
      if (
        this.workflowDataForZC != undefined &&
        !Z_IsEmpty20(this.workflowDataForZC)
      ) {
        params.ZCID = this.workflowDataForZC.workflow_id;
      }

      let existWFID = this.queryParams.id;
      if (existWFID != undefined && existWFID != "") {
        params.existForWorkflowId = existWFID;
      }
      if (this.queryParams.pzRowId != undefined) {
        params.otherModuleDataId = this.queryParams.pzRowId;
      }

      this.$http
        .post(url, params)
        .then(res => {
          if (res.data.success) {
            this.$vux.toast.text("暂存成功！", "top");
            //暂时定义跳转到我发起的页面
            this.$router.push({
              path: "workflowMyself",
              query: {
                companyId: this.queryParams.companyId
              }
            });
          } else {
            this.$vux.toast.text(
              res.data.msg == undefined ? res.data.mgs : res.data.msg,
              "top"
            );
          }
        })
        .catch(err => {
          this.$vux.toast.text("操作异常，请稍后重试！", "top");
        });
    },
    getAllPageData() {
      let self = this;
      let postdata = {};
      postdata.companyId = self.queryParams.companyId;
      postdata.id = self.queryParams.id == undefined ? "" : self.queryParams.id;
      if (
        self.queryParams.cType != undefined &&
        self.queryParams.cType != "" &&
        self.queryParams.cType != "undefined"
      ) {
        postdata.wfType = self.queryParams.cType;
      }
      if (
        self.queryParams.tplId != undefined &&
        self.queryParams.tplId != "" &&
        self.queryParams.tplId != "undefined"
      ) {
        postdata.tplId = self.queryParams.tplId;
      }

      //判断是否查询暂存数据
      let zcidTemp = Z_IsEmpty20(this.queryParams.WF_ZCID)
        ? ""
        : this.queryParams.WF_ZCID;
      if (!Z_IsEmpty20(zcidTemp)) {
        postdata.WFZCID = zcidTemp;
      }
      let existWFID = Z_IsEmpty20(this.queryParams.id)
        ? ""
        : this.queryParams.id;
      if (!Z_IsEmpty20(existWFID)) {
        postdata.existWorkflowId = existWFID;
      }

      let url = "/zingbiz/workflow/createWorkFlow/getBeforCreateFlowData";
      self.$http
        .post(url, postdata)
        .then(res => {
          console.log("返回数据", res.data.data);
          let allData = res.data;
          let curRealName = allData.data.curRealName;
          //模板map
          self.tplMap = allData.data.tplMap;
          //需要初始化的数据
          self.flowData = allData.data.flowData;

          //处理表单中分类和模板数据
          if (self.tplMap != undefined) {
            if (
              self.queryParams.tplId != undefined &&
              self.queryParams.tplId != "" &&
              self.queryParams.tplId != "undefined"
            ) {
              let curTplData = self.tplMap[self.queryParams.tplId];
              if (curTplData != undefined && !curTplData.isEmpty) {
                self.formParams.workflow_classify_id = curTplData.categoryId;
                self.formParams.workflow_classify = curTplData.categoryName;
                self.formParams.workflow_sort_id = curTplData.templateId;
                self.formParams.workflow_sort = curTplData.templateName;
                self.formParams.workflow_sort_describe =
                  curTplData.templateDesc;
              }
            }
          }

          this.workflowDataForZC =
            allData.data.workflowDataForZC == undefined ||
            allData.data.workflowDataForZC.formData == undefined
              ? ""
              : allData.data.workflowDataForZC;
          //由于客户审批流特殊 如果是客户审批流 并且客户审批流已经暂存过数据 则开始进行展现暂存的数据
          if (this.queryParams.id != undefined && this.queryParams.id != "") {
            if (
              this.queryParams.WF_ZCID == undefined ||
              this.queryParams.WF_ZCID == ""
            ) {
              if (
                !Z_IsEmpty20(allData.data.workflowDataForExistWorkflow) &&
                allData.data.workflowDataForExistWorkflow.length > 0
              ) {
                this.workflowDataForZC = this.workflowDataForExistWorkflow;
              }
            }
          }

          if (!Z_IsEmpty20(self.flowData) && self.flowData != "null") {
            let wfData = self.flowData;
            if (wfData != undefined && !wfData.isEmpty) {
              if (wfData.length > 0) {
                self.flowData = wfData[0];
              }
            }
            self.formInit();
          }

          if (
            self.queryParams.tplId != undefined &&
            self.queryParams.tplId != "" &&
            self.queryParams.tplId != "undefined"
          ) {
            //获取当前模板数据
            let tplData = self.tplMap[self.queryParams.tplId];
            let isLinkTaskStr = tplData.isLinkTask;
            if (isLinkTaskStr != undefined && isLinkTaskStr == "是") {
              self.isLinkTask = true;
              self.formTemplate.linkTaskWorkForm = true;
            }
            //添加审批流名称缺省
            self.formData.workflow_name =
              curRealName + ":" + tplData.templateName;
            //添加显示模板描述
            self.formData.workflow_sort_describe = tplData.templateDesc;
            console.log("初始表单数据：", self.formData);
          }
          //控制显示那个表单模板
          self.handleFormShow();
          //如果有暂存数据则开始渲染暂存的数据到表单中
          let nodeDataTemp = Z_IsEmpty20(allData.data.nodeData)
            ? {}
            : allData.data.nodeData;
          nodeDataTemp = this.handleNodeDataForHaveZC(nodeDataTemp);
          //节点数据
          self.nodeDataForTemplate = nodeDataTemp;
        })
        .catch(err => {
          this.$vux.toast.text("异常，请稍后重试！", "top");
        });
    },
    handleNodeDataForHaveZC(nd) {
      if (
        !Z_IsEmpty20(this.workflowDataForZC) &&
        !Z_IsEmpty20(this.workflowDataForZC.formData)
      ) {
        let zc_formData = JSON.parse(
          this.workflowDataForZC.formData == undefined
            ? {}
            : this.workflowDataForZC.formData
        );
        this.formData = zc_formData;
        let zc_zxr = zc_formData.dataForZXR;
        for (let k in nd) {
          if (zc_zxr.hasOwnProperty(nd[k].nodeId)) {
            nd[k].cardUrl = zc_zxr[nd[k].nodeId].cardUrl;
            nd[k].executor = zc_zxr[nd[k].nodeId].executor;
            nd[k].executor_name = zc_zxr[nd[k].nodeId].executor;
          }
        }
        let zc_cyr = zc_formData.dataForCYR;
        if (!Z_IsEmpty20(zc_cyr)) {
          this.canYuRenData = zc_cyr;
        }
      }
      return nd;
    },
    formInit() {
      this.formData = this.flowData;
    },
    handleFormShow() {
      let cTypeTemp = this.queryParams.cType;
      if (cTypeTemp != undefined && cTypeTemp === "TYPE_HR_QJ") {
        this.formTemplate.qjForm = true;
      } else if (cTypeTemp != undefined && cTypeTemp === "MODULE_TYPE_ZYK") {
        this.formTemplate.pzForm = true;
      } else if (
        cTypeTemp != undefined &&
        cTypeTemp === "MODULE_TYPE_HR_XZTZ"
      ) {
        this.formTemplate.xztzForm = true;
      } else {
        this.formTemplate.baseForm = true;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../assets/stylus/variable.styl';
@import '../../assets/stylus/mixin.styl';
@import '../../assets/stylus/unify.styl';

.launchWorkflow {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.formFontSize {
    font-size: 16px !important;
}
</style>
