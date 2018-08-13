<!-- 固定资产-->
<template>
    <div v-show="searchPage" class="searchPage">
        <div v-show="defaultPage" class="defaultPage">
            <group class="default-content">
                <datetime :title="'会计期间'" v-model="asset.period" format="YYYY-MM" :placeholder="'请选择会计期间'"></datetime>
                <x-input title="资产编码" v-model="asset.assetCode" class="assetCode" placeholder="默认按照类别规则取值，可自定义"></x-input>
                     <x-input title="资产名称 " placeholder="请输入资产名称" class="assetName" v-model="asset.assetsName">
                </x-input>
                <x-input title="资产类别" class="assetType" v-model="asset.assetsClass" placeholder="请选择资产类别" @on-focus="onClickAssetType"></x-input>
                <x-input title="变动方式" class="changeWay" placeholder="请选择变动方式" v-model="asset.changeMethod" @on-focus="onClickchangeWay"></x-input>
                <x-input title="变动方式" v-model="asset.changeWay" style="display:none"></x-input>
                <x-input title="使用状况" class="useStatu" placeholder="请选择使用状况" v-model="asset.useStatu" @on-focus="onClickuseStatu"></x-input>
                <x-input title="使用状况" v-model="asset.workingConditionId" style="display:none"></x-input>
                <x-input title="存放地点" class="palce" v-model="asset.storePlace" placeholder="请选择存放地点" @on-focus="onClickstorgy"></x-input>
                <x-input title="存放地点" v-model="asset.storePlaceId" style="display:none"></x-input>
                <selector title="经营用途" placeholder="" v-model="asset.operatList" direction="rtl" class="operatList" :options="operatList"></selector>
                <selector title="汇总项目" placeholder="" v-model="asset.summaryProject" direction="rtl" class="operatList" :options="projectList"></selector>
                <check-icon :value.sync="chcekCard" type="plain">包含本期已清理的卡片</check-icon>
            </group>

            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color: #40affc " type="primary" @click.native="reset">重置</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: #ea7e26;" type="primary" @click.native="selectChange">查询</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="checkAssetType"></popupAssetType>
        <popupStorage :showPopup="storagePopup" @backClick="clickBack" @checkItem="checkStorage"></popupStorage>
        <popupUseStatu :showPopup="useStatuPopup" @backClick="clickBack" @checkItem="checkUseStatu"></popupUseStatu>
        <popupChangeWay :showPopup="changeWayPopup" @backClick="clickBack" @checkItem="checkChangeWay"></popupChangeWay>
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Selector,
  Datetime,
  Popup,
  CheckIcon
} from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import popupAssetType from "../../fixMoney/dailyTreatment/selectorPopup/popupAssetType.vue";
import popupStorage from "../../fixMoney/dailyTreatment/selectorPopup/popupStorage";
import popupUseStatu from "../../fixMoney/dailyTreatment/selectorPopup/popupUseStatu";
import popupChangeWay from "../../fixMoney/dailyTreatment/selectorPopup/popupChangeWay";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Selector,
    Popup,
    Datetime,
    CheckIcon,
    popupAssetType,
    popupStorage,
    popupUseStatu,
    popupChangeWay
  },
  props: {
    searchPage: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      asset: {},
      defaultPage: true,
      // 经营用途
      operatList: ["全部", "经营用", "非经营用"], // 经营用途
      //汇总项目
      projectList: [
        //   "资产类别" ,"使用状态", "变动方式","经营用途","存放地点","使用部门"
        { key: "assetsClass", value: "资产类别" },
        { key: "workingCondition", value: "使用状态" },
        { key: "changeWay", value: "变动方式" },
        { key: "economicUse", value: "经营用途" },
        { key: "storePlace", value: "存放地点" },
      ],
      assetPopup: false, //固定资产类型选择
      storagePopup: false, //存放地点
      useStatuPopup: false, // 使用状况
      changeWayPopup: false, //变动方式
      chcekCard: false
    };
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    //关闭资产类别Popup框
    clickBack() {
      let vm = this;
      vm.assetPopup = false;
      vm.storagePopup = false;
      vm.useStatuPopup = false;
      vm.changeWayPopup = false;
    },
    //选择资产类型popup
    onClickAssetType() {
      this.assetPopup = true;
    },
    // 存放地点popup显示
    onClickstorgy() {
      this.storagePopup = true;
    },
    // 使用状态popup显示
    onClickuseStatu() {
      this.useStatuPopup = true;
    },
    //变动方式popup显示
    onClickchangeWay() {
      this.changeWayPopup = true;
    },
 //固定资产选择
    checkAssetType(item) {
      let vm = this;
      console.info(item);
      vm.asset.assetsClass = item.name;
      vm.assetPopup = false;
    },
    // 存放地点
    checkStorage(item) {
      let vm = this;
      vm.storagePopup = false;
      vm.asset.storePlace = item.name;
      vm.asset.storePlaceId = item.code;
    },
    //使用状况
    checkUseStatu(item) {
      let vm = this;
      vm.useStatuPopup = false;
      vm.asset.useStatu = item.name;
      vm.asset.workingConditionId = item.code;
    },
    //变动方式
    checkChangeWay(item) {
      let vm = this;
      vm.changeWayPopup = false;
      vm.asset.changeMethod = item.name;
      vm.asset.changeWay = item.code;
    },
    reset() {
        this.asset = {}
    },
    selectChange() {
      let vm = this
      if (Z_IsEmpty20(vm.asset.period)) {
          vm.$vux.toast.text("请选择会计期间");
          return;
      }
       let state = "";
      if (vm.yes) {
        state = "true";
      } else if (vm.no) {
        state = "false";
      }
      let assetsCoding = vm.asset.assetsCoding
        ? { assetsCoding: vm.asset.assetsCoding }
        : {};
      let assetsName = vm.asset.assetsName
        ? { assetsName: vm.asset.assetsName }
        : {};
      let assetsClass = vm.asset.assetsClass
        ? { assetsClass: vm.asset.assetsClass }
        : {};
      let changeWay = vm.asset.changeWay
        ? { changeWay: vm.asset.changeWay }
        : {};
      let workingConditionId = vm.asset.workingConditionId
        ? { workingConditionId: vm.asset.workingConditionId }
        : {};
      let storePlaceId = vm.asset.storePlaceId
        ? { storePlaceId: vm.asset.storePlaceId }
        : {};
      let isInclude = state ? { isInclude: state } : {};
      let economicUse = vm.asset.economicUse
        ? { economicUse: vm.asset.economicUse }
        : {};
      let summaryProject = vm.asset.summaryProject
       ? { summaryProject: vm.asset.summaryProject } : {};
      let params = {
        period: vm.asset.period
      };
      let param = Object.assign(
        {},
        params,
        assetsCoding,
        assetsName,
        assetsClass,
        changeWay,
        workingConditionId,
        storePlaceId,
        economicUse,
        isInclude,
        summaryProject
      );
      this.$emit("submitAssetChange", param);
    }
  }
};
</script>
<style>
.assetList {
  height: 100%;
}
.popup-group {
  height: calc(100%-100px);
}
.popupDate-picker-popup {
  height: 100%;
}
.assetList .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.searchPage {
    height: 100%;

    .defaultPage {
        height: 100%;

        .default-content {
            height: calc(100% - 94px);
        }
    }
}
</style>


