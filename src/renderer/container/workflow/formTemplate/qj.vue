<template>
    <div id="qjForm">
        <!-- <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div> -->
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="类型：" :value="formParams.type"></cell>
        <selector v-else style="padding:0px 15px !important;height: 34px !important;" class="formFontSize" title="类型&nbsp;<span style='color: red;'>*</span>：" :options="qjType" v-model="formParams.type"></selector>

        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="开始日期：" :value="formParams.startTime"></cell>
        <datetime v-else class="formFontSize" title="开始日期&nbsp;<span style='color: red;'>*</span>：" v-model="formParams.startTime" value-text-align="right"></datetime>

        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="结束日期：" :value="formParams.endTime"></cell>
        <datetime v-else class="formFontSize" title="结束日期&nbsp;<span style='color: red;'>*</span>：" v-model="formParams.endTime" value-text-align="right"></datetime>

        <div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" title="请假原因：" :value="formParams.reason"></cell>
        <x-textarea v-else class="formFontSize" title="请假原因&nbsp;<span style='color: red;'>*</span>：" placeholder="请填写请假原因" v-model="formParams.reason" :show-counter="false" :rows="3">
          <span slot="label">请假原因&nbsp;<span style='color: red;'>*</span>: </span>
        </x-textarea>

        <!--<div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>-->
        <!--<cell title="上传图片：" value-align="left"></cell>-->
        <!--<image-picker-->
            <!--:files="files"-->
            <!--:companyId="companyId"-->
            <!--selectable-->
            <!--multiple-->
            <!--@onChange="imgOkCallback"-->
            <!--@onImageClick="onImageClick"-->
        <!--/>-->
        <!--<div v-show="isShowLine" style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>-->
        <!--<cell title="模板描述：" :value="formParams.workflow_sort_describe"></cell>-->

    </div>
</template>

<script>
import ImagePicker from "@/components/imagepicker/ImagePicker";

import {
  Group,
  Cell,
  XInput,
  XTextarea,
  Datetime,
  Flexbox,
  FlexboxItem,
  XButton,
  XSwitch,
  Selector
} from "vux";
export default {
  name: "qjForm",
  components: {
    Group,
    Cell,
    XInput,
    XTextarea,
    Datetime,
    Flexbox,
    FlexboxItem,
    XButton,
    XSwitch,
    ImagePicker,
    Selector
  },
  data() {
    return {
      files: [], //图片列表
      imgStr: "",
      qjType: [
        { key: "病假", value: "病假" },
        { key: "事假", value: "事假" },
        { key: "年假", value: "年假" },
        { key: "调休", value: "调休" },
        { key: "婚假", value: "婚假" },
        { key: "产假", value: "产假" },
        { key: "陪产假", value: "陪产假" },
        { key: "路途假", value: "路途假" },
        { key: "其他", value: "其他" }
      ],
      formParams: {
        workflow_name: "",
        workflow_describe: "",
        expiration_time: "",
        workflow_sort_describe: "",
        type: "",
        startTime: "",
        endTime: "",
        reason: ""
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
    companyId: {
      type: String,
      default: function() {
        return "";
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
    //上传图片组件方法
    imgOkCallback(files, operationType, index) {
      this.files = files;
      let imgArr = [];
      files.forEach(function(obj) {
        imgArr.push(obj.url);
      });
      this.imgStr = imgArr.join(",");
      this.formParams.fjForImg = imgStr;
    },
    onImageClick() {}
  }
};
</script>

<style lang="stylus">
.formFontSize {
  font-size: 16px !important;
}

.weui-cell__ft {
  color: #999 !important;
}
</style>
