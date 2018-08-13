<template>
    <div id="gongDan">
        <br/>
        <div v-if="fpIsOk=='true'">
            <div style="font-size:14px;text-align:left;margin-left:8px;">
                <p>流水号：{{workflowData.workflow_id}}</p><br>
                <p>审批流名称：{{workflowData.workflow_name}}</p><br>
                <p>审批流模板：{{workflowData.workflow_sort}}</p><br>
                <p>发起人：{{workflowData.RealName}}</p><br>
                <p>创建时间：{{workflowData.create_time}}</p>
                <br>
                <p v-if="workflowData.workflowType==='MODULE_TYPE_ZYK'">凭证：
                    <a href="javascript:void(0);" @click="openPz">查看凭证</a>
                </p>
            </div>
            <br/>
            <div v-for="(nd,index) in initData" style="padding:0px 2px;" :key="index">
                <div v-if="nd.stepType!='FP'">
                    <div v-if="!nd.isShowZxr">
                        <div v-if="index==0" class="weui-form-preview__bd" style="border-left:1px solid #ccc;border-top:1px solid #ccc;border-right: 1px solid #ccc;padding: 0px !important;">
                            <div>
                                <div style="padding:10px 5px;" class="weui-form-preview__item">
                                    <label class="weui-form-preview__label"><strong>{{nd.stepName}}</strong></label>
                                    <span style="text-align: left !important;" class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                                </div>
                                <div style="margin: 0 auto;border-bottom: 1px solid #ccc;width:98%;"></div>
                            </div>

                        </div>
                        <div v-else>
                            <div v-if="nd.isShowTopLine" class="weui-form-preview__bd" style="margin-top:10px !important;border-left:1px solid #ccc;border-top:1px solid #ccc;border-right: 1px solid #ccc;padding: 0px !important;">
                                <div>
                                    <div style="padding:10px 5px;" class="weui-form-preview__item">
                                        <label class="weui-form-preview__label"><strong>{{nd.stepName}}</strong></label>
                                        <span style="text-align: left !important;" class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                                    </div>
                                    <div style="margin: 0 auto;border-bottom: 1px solid #ccc;width:98%;"></div>
                                </div>
                            </div>
                            <div v-else class="weui-form-preview__bd" style="border-left:1px solid #ccc;border-right: 1px solid #ccc;padding: 0px !important;">
                                <div>
                                    <div style="padding:10px 5px;" class="weui-form-preview__item">
                                        <label class="weui-form-preview__label"><strong>{{nd.stepName}}</strong></label>
                                        <span style="text-align: left !important;" class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                                    </div>
                                    <div style="margin: 0 auto;border-bottom: 1px solid #ccc;width:98%;"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="nd.isShowTopLine" class="weui-form-preview__bd" style="margin-top:10px !important;border-top:1px solid #ccc;border-left:1px solid #ccc;border-bottom:1px solid #ccc;border-right: 1px solid #ccc;padding: 0px !important;">
                            <div style="padding:10px 5px;" class="weui-form-preview__item">
                                <label class="weui-form-preview__label"><strong>{{nd.stepName}}</strong></label>
                                <span style="text-align: left !important;" class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                            </div>
                            <div style="margin: 0 auto;border-bottom: 1px solid #ccc;width:98%;"></div>
                            <div v-if="nd.isShowZxr" style="padding:0px 5px;" class="weui-form-preview__item">
                                <strong>执行人：</strong><span>{{nd.user_name}}</span>
                            </div>
                            <div v-if="nd.isShowZxr" style="padding:0px 5px;" class="weui-form-preview__item">
                                <strong>完成时间：</strong><span>{{nd.previousExecuteTime}}</span>
                            </div>

                        </div>
                        <div v-else class="weui-form-preview__bd" style="border-left:1px solid #ccc;border-bottom:1px solid #ccc;border-right: 1px solid #ccc;padding: 0px !important;">
                            <div style="padding:10px 5px;" class="weui-form-preview__item">
                                <label class="weui-form-preview__label"><strong>{{nd.stepName}}</strong></label>
                                <span style="text-align: left !important;" class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                            </div>
                            <div style="margin: 0 auto;border-bottom: 1px solid #ccc;width:98%;"></div>
                            <div v-if="nd.isShowZxr" style="padding:0px 5px;" class="weui-form-preview__item">
                                <strong>执行人：</strong><span>{{nd.user_name}}</span>
                            </div>
                            <div v-if="nd.isShowZxr" style="padding:0px 5px;" class="weui-form-preview__item">
                                <strong>完成时间：</strong><span>{{nd.previousExecuteTime}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <flexbox style="margin-top: 30px;position: sticky;width: 100%;bottom: 0px;">
                <flexbox-item>
                    <x-button type="primary" class="btn-common" @click.native="workorderDownload">Excel 导出</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div v-else>
            <div style="font-size: 16px;color: #ff8000;text-align: center;width:100%;">暂未进行受理，请稍后查看！</div>
        </div>
    </div>
</template>

<script>
import {
  Group,
  XInput,
  XTextarea,
  Datetime,
  Cell,
  Flexbox,
  FlexboxItem,
  XButton
} from "vux";
import {
  isWeiXin,
  isMhApp,
  Z_IsEmpty20,
  Z_IsEmpty,
  formatFileSize
} from "@/utils/fn";
export default {
  name: "gongDan",
  components: {
    Group,
    XInput,
    XTextarea,
    Datetime,
    Cell,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data() {
    return {
      fpIsOk: "true"
    };
  },
  watch: {
    workflowData: {
      handler: function() {
        if (
          this.workflowData.workflowType === "KH" &&
          this.workflowData.workflow_state === "待处理"
        ) {
          this.fpIsOk = "false";
        }
      }
    }
  },
  //钩子加载完触发
  created: function() {
    //判断客户审批  分配人员是否已经处理  如果没有处理 审批的状态是待处理
    if (
      this.workflowData.workflowType === "KH" &&
      this.workflowData.workflow_state === "待处理"
    ) {
      this.fpIsOk = "false";
    }
  },
  props: {
    initData: {
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
    queryParams: {
      type: Object,
      default: function() {
        return {};
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
    workorderDownload() {
      let self = this;
      let sendData = {};
      let fileUrl = "";
      let fileId = "";
      sendData.workflow_id = self.workflowData.workflow_id;
      sendData.companyId = self.workflowData.companyId;
      let url = "/zingbiz/workflow/helper/workOrderDownload.action";

      self.$http.post(url, sendData).then(res => {
        let data = res.data;
        if (data && data.data) {
          let reData = data.data;
          fileUrl = reData.fileUrl;
          fileId = reData.fileId;

          if (isWeiXin()) {
            window.location =
              "/ZingMH/zh_cn/fileManage/download.htm?id=" +
              fileId +
              "&companyId=" +
              self.workflowData.companyId +
              "&departmentId=&t=" +
              new Date().getTime();
          } else {
            if (isMhApp()) {
              //$.showLoadingMask(undefined,undefined,"downLoad");
            }
            window.location =
              "/ZingMH/ZDesk/UploadFile/downloadFile.action?id=" +
              fileId +
              "&companyId=" +
              self.workflowData.companyId;
            //$.hideLoadingMask();
          }
          event.stopPropagation();
        } else {
          self.$vux.toast.text("导出异常，请稍后重试！", "top");
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.vux-form-preview {
  overflow: hidden;
}

.weui-form-preview {
  position: relative;
  background-color: #FFFFFF;
}

.weui-form-preview:before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 0px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.weui-form-preview:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 0px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.weui-form-preview__hd {
  position: relative;
  padding: 0px 6px;
  text-align: right;
  line-height: 2.5em;
}

.weui-form-preview__label {
  float: left;
  margin-right: 1em;
  min-width: 4em;
  color: #000;
  text-align: justify;
  text-align-last: justify;
}

.weui-form-preview__hd .weui-form-preview__value {
  font-style: normal;
  font-size: 1em !important;
}

.weui-form-preview__value {
  display: block;
  overflow: hidden;
  word-break: normal;
  word-wrap: break-word;
}

.weui-form-preview__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 0px;
}

.weui-form-preview__bd {
  padding: 6px 6px;
  font-size: 0.9em;
  text-align: right;
  color: #000;
  line-height: 2;
}

.weui-form-preview__item {
  overflow: hidden;
}

.weui-form-preview__ft {
  position: relative;
  line-height: 40px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.weui-form-preview__ft:after {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #D5D5D6;
  color: #D5D5D6;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.weui-form-preview__btn {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  color: #3CC51F;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.weui-form-preview__btn_default {
  color: #999999;
}
</style>
