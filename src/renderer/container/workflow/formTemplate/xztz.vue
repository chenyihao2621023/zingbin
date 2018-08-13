<template>
    <div id="xztzForm">
        <!-- <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div> -->
        <cell v-if="isShowDetail" style="padding:0px !important;text-align: left !important;" title="调薪：">
            <checker v-model="changeSalaryTyleSelData"
                     default-item-class="demo1-item"
                     selected-item-class="demo1-item-selected"
                     :disabled="true"
                     @on-change="checkChangeForTX"
            >
                <checker-item :value="item" v-for="(item, index) in changeSalaryTyleData" :key="index">
                    {{item.value}}
                </checker-item>
            </checker>
        </cell>
        <cell v-else style="padding:0px 15px;" title="调薪&nbsp;<span style='color: red;'>*</span>：">
            <checker v-model="changeSalaryTyleSelData"
                     default-item-class="demo1-item"
                     selected-item-class="demo1-item-selected"
                     @on-change="checkChangeForTX"
            >
                <checker-item :value="item" v-for="(item, index) in changeSalaryTyleData" :key="index">
                    {{item.value}}
                </checker-item>
            </checker>
        </cell>
        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="调薪金额：" :value="formParams.changeSalaryNum"></cell>
        <x-input v-else class="formFontSize" title="调薪金额&nbsp;<span style='color: red;'>*</span>：" placeholder="请填写调薪金额" v-model="formParams.changeSalaryNum"></x-input>
        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell v-if="isShowDetail" style="padding:0px !important;text-align: left !important;" title="奖惩：">
            <checker v-model="rewardTyleSelData"
                     default-item-class="demo1-item"
                     selected-item-class="demo1-item-selected"
                     @on-change="checkChangeForJC"
                     :disabled="true"
            >
                <checker-item :value="item" v-for="(item, index) in rewardTyleData" :key="index">
                    {{item.value}}
                </checker-item>
            </checker>
        </cell>
        <cell v-else style="padding:0px 15px;text-align: left !important;" title="奖惩&nbsp;<span style='color: red;'>*</span>：">
            <checker v-model="rewardTyleSelData"
                     default-item-class="demo1-item"
                     selected-item-class="demo1-item-selected"
                     @on-change="checkChangeForJC"
            >
                <checker-item :value="item" v-for="(item, index) in rewardTyleData" :key="index">
                    {{item.value}}
                </checker-item>
            </checker>
        </cell>
        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="奖惩金额：" :value="formParams.rewardNum"></cell>
        <x-input v-else class="formFontSize" title="奖惩金额&nbsp;<span style='color: red;'>*</span>：" placeholder="请填写降薪金额" v-model="formParams.rewardNum"></x-input>

        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="薪资调整人：" :value="formParams.salaryRegulatorName"></cell>
        <cell v-else title="薪资调整人&nbsp;<span style='color: red;'>*</span>：" is-link
              @click.native="selectInputPerson()"
        >
            <span v-if="formParams.salaryRegulatorName!=undefined && formParams.salaryRegulatorName!=''">{{formParams.salaryRegulatorName}}</span>
            <span v-else>选择薪资调整人</span>
        </cell>

        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="调整日期：" :value="formParams.startTime"></cell>
        <datetime v-else class="formFontSize" v-model="formParams.startTime" value-text-align="right">
          <span slot="title">调整日期<span style='color:red'>*</span>：</span>
        </datetime>
        <!--<div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>-->
        <!--<cell title="模板描述：" :value="formParams.workflow_sort_describe"></cell>-->

        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson"
                           :initialSelectedType="'cardUrl'"
                           :showTab="showTab"
                           :showPicker="showPersonPicker"
                           :multiple="false"
                           @picked="onPicked"
                           @abort="onPickAbort"></org-member-picker>
    </div>
</template>

<script>
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";

import {
  Group,
  XInput,
  XTextarea,
  Datetime,
  Cell,
  Checker,
  CheckerItem
} from "vux";
export default {
  name: "xztzForm",
  components: {
    Group,
    XInput,
    XTextarea,
    Datetime,
    Cell,
    Checker,
    CheckerItem,
    OrgMemberPicker
  },
  data() {
    return {
      changeSalaryTyleData: [
        {
          key: "1",
          value: "加薪"
        },
        {
          key: "0",
          value: "降薪"
        }
      ],
      rewardTyleData: [
        {
          key: "1",
          value: "奖金"
        },
        {
          key: "0",
          value: "罚金"
        }
      ],
      changeSalaryTyleSelData: { key: "1", value: "加薪" },
      rewardTyleSelData: { key: "1", value: "奖金" },
      formParams: {
        workflow_name: "",
        workflow_describe: "",
        expiration_time: "",
        workflow_sort_describe: "",
        changeSalaryTyle: "1",
        rewardTyle: "1",
        startTime: "",
        salaryRegulatorName: "",
        salaryRegulatorCardUrl: "",
        changeSalaryNum: "",
        rewardNum: ""
      },
      initSelectPerson: [],
      showPersonPicker: false,
      showTab: ["colleague"]
    };
  },
  //钩子加载完触发
  created: function() {
    //渲染表单数据
    for (let key in this.formData) {
      if (this.formParams.hasOwnProperty(key)) {
        this.formParams[key] = this.formData[key];
      }
    }
  },
  props: {
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isShowLine: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    isShowDetail: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    checkChangeForTX(value) {
      this.formParams.changeSalaryTyle = value.key;
    },
    checkChangeForJC(value) {
      this.formParams.rewardTyle = value.key;
    },
    selectInputPerson() {
      this.initSelectPerson.push();
      this.showPersonPicker = true;
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    onPicked(list) {
      this.showPersonPicker = false;
      let selTemp = list.map(item => {
        let map = {};
        map.key = item.userName;
        map.value = item.cardUrl;
        return map;
      });
      if (selTemp !== undefined && selTemp.length >= 1) {
        this.formParams.salaryRegulatorName = selTemp[0].key;
        this.formParams.salaryRegulatorCardUrl = selTemp[0].value;
      }
    }
  }
};
</script>

<style lang="stylus">
.formFontSize {
  font-size: 16px !important;
}

.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
  margin-left: 10px;
}

.demo1-item-selected {
  border: 1px solid green;
}

.weui-cell:before {
  border-top: 0px !important;
}

.weui-cell__ft {
  color: #999 !important;
}
</style>
