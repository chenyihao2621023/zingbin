<template>
    <div id="baseForm">
        <!-- <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div> -->
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="标题：" :value="formParams.workflow_name"></cell>
        <x-input v-else class="formFontSize" title="标题&nbsp;<span style='color: red;'>*</span>：" placeholder="请填写标题" v-model="formParams.workflow_name"></x-input>
        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="描述：" :value="formParams.workflow_describe"></cell>
        <x-textarea v-else class="formFontSize" title="描述&nbsp;<span style='color: red;'>*</span>：" placeholder="请填写描述" v-model="formParams.workflow_describe" :show-counter="false" :rows="3">
          <span slot="label">描述&nbsp;<span style='color: red;'>*</span>: </span>
        </x-textarea>
        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="失效日期：" :readonly="isDisabled" :value="formParams.expiration_time"></cell>
        <datetime v-else :readonly="isDisabled" class="formFontSize" title="失效日期：" v-model="formParams.expiration_time" value-text-align="right"></datetime>
        <!--<div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>-->
        <!--<cell title="模板描述：" :value="formParams.workflow_sort_describe"></cell>-->

    </div>
</template>

<script>
import { Group, XInput, XTextarea, Datetime, Cell } from "vux";
export default {
  name: "baseForm",
  components: {
    Group,
    XInput,
    XTextarea,
    Datetime,
    Cell
  },
  data() {
    return {
      formParams: {
        workflow_name: "",
        workflow_describe: "",
        expiration_time: "",
        workflow_sort_describe: ""
      }
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
    },
    isDisabled: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {}
};
</script>

<style lang="stylus">
.formFontSize {
  font-size: 16px !important;
}

.weui-cell:before {
  border-top: 0px !important;
}

.weui-cell__ft {
  color: #999 !important;
}
</style>
