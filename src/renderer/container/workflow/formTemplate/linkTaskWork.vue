<template>
    <div id="linkTaskWork">
        <div v-if="type!='check'">
            <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
            <!-- 发起审批时显示 -->
            <cell title="关联任务：" value="value">
                <div @click="addTaskWork()" style="display: inline;padding:10px;"><i class="iconfont icon-tianjia" style="font-size: 30px;"></i></div>
            </cell>
            <div v-if="linkTaskData.length>0" style="padding:6px 18px;">
                <cell style="padding:0px !important;" v-for="(item,index) in linkTaskData" :key="index" :title="item.title" >
                    <i @click="delLinkTask(item)" class="iconfont icon-shanchu3" style="font-size: 20px;padding:10px;"></i>
                </cell>
            </div>
        </div>
        <div v-else>
            <!-- 审批详情总览显示 -->
            <cell style="padding:0px 0px 0px 5px !important;height:40px;color:#999 !important;" title="关联任务：" value="value">
                <div v-if="curUserCardUrl==workflowData.workflowCreater" @click="addTaskWork()" style="display: inline;padding:10px;"><i class="iconfont icon-tianjia" style="font-size: 30px;"></i></div>
            </cell>
            <div v-if="linkTaskData.length>0" style="padding:6px 5px;">
                <cell style="padding:0px !important;color:#999 !important;" v-for="(item,index) in linkTaskData" :key="index" :title="item.title" >
                    <i v-if="curUserCardUrl==workflowData.workflowCreater" @click="delLinkTask(item)" class="iconfont icon-shanchu3" style="font-size: 20px;padding:10px;"></i>
                </cell>
            </div>
        </div>


        <!-- 关联任务 -->
        <task-selection :showTaskSelection="showTaskSelection"
                        @confirmTaskSelection="confirmTaskSelection"
                        @cancleTaskSelection="cancleTaskSelection"
        ></task-selection>

    </div>
</template>

<script>
import TaskSelection from "@/container/common/task/taskSelection";

import { Group, XInput, XTextarea, Datetime, Cell } from "vux";
export default {
  name: "linkTaskWork",
  components: {
    Group,
    XInput,
    XTextarea,
    Datetime,
    Cell,
    TaskSelection
  },
  data() {
    return {
      showTaskSelection: false,
      linkTaskData: []
    };
  },
  //钩子加载完触发
  created: function() {
    if (
      this.formData.linkTaskIds != undefined &&
      this.formData.linkTaskIds != ""
    ) {
      let linkTaskIds = this.formData.linkTaskIds;
      let linkTaskArr = linkTaskIds.split(",");

      linkTaskArr.forEach(item => {
        let dTemp = this.urlParse(item);
        this.linkTaskData.push(dTemp);
      });
    }
  },
  props: {
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    type: {
      type: String,
      default: function() {
        return "";
      }
    },
    workflowData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    curUserCardUrl: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  methods: {
    addTaskWork() {
      this.showTaskSelection = true;
    },
    confirmTaskSelection(backData) {
      this.linkTaskData = this.linkTaskData.filter(
        item => item.cardId !== backData.cardId
      );
      this.linkTaskData.push(backData);
      this.showTaskSelection = false;

      if (this.type == "check") {
        //变更关联数据
        this.changeForLinkTask("添加关联任务成功。");
      }
    },
    cancleTaskSelection() {
      this.showTaskSelection = false;
    },
    delLinkTask(taskData) {
      if (this.linkTaskData.length == 1 && this.type == "check") {
        this.$vux.toast.text("至少需要保留一个任务关联！", "top");
        return false;
      }
      this.linkTaskData = this.linkTaskData.filter(
        item => item.cardId !== taskData.cardId
      );
      if (this.type == "check") {
        //变更关联数据
        this.changeForLinkTask("删除关联任务成功。");
      }
    },
    urlParse(url) {
      let obj = {}; // 创建一个Object
      let reg = /[?&][^?&]+=[^?&]+/g; // 正则匹配 ?&开始 =拼接  非?&结束  的参数
      let arr = url.match(reg); // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
      if (arr) {
        arr.forEach(item => {
          /**
           * tempArr数组    ['id','12345']和['a','b']
           * 第一个是key，第二个是value
           * */
          let tempArr = item.substring(1).split("=");
          let key = decodeURIComponent(tempArr[0]);
          let val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
        });
      }
      return obj;
    },
    changeForLinkTask(alertMsg) {
      let self = this;
      //变更审批的关联任务数据
      let url = "/zingbiz/workflow/helper/updataOneWorkflowForLinkTask";
      let pat = {};
      pat.workflowId = self.workflowData.workflow_id;
      pat.companyId = self.workflowData.companyId;
      //数据格式：boardId=xxx&listId=xxx&cardId=xxx&title=xxx,boardId=xxx&listId=xxx&cardId=xxx&title=xxx
      let linkTaskData = self.linkTaskData;
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
      pat.linkTaskIds = linkTaskIds;

      self.$http
        .post(url, pat)
        .then(res => {
          if (res.data.success) {
            this.$vux.toast.text(alertMsg, "top");
          } else {
            this.$vux.toast.text("操作异常，请稍后重试！", "top");
          }
        })
        .catch(err => {
          this.$vux.toast.text("操作异常，请稍后重试！", "top");
        });
    }
  }
};
</script>

<style lang="stylus">
.formFontSize {
  font-size: 16px !important;
}
</style>
