<!-- 固定资产清单-->
<template>
    <div v-show="searchPage" class="searchPage">
        <div v-show="defaultPage" class="defaultPage">
            <group class="default-content" :data="asset">
                <datetime :title="'会计期间'" v-model="asset.period" format="YYYY-MM" :placeholder="'请选择会计期间'"></datetime>
                <x-input title="资产编码" v-model="asset.assetsCoding" class="assetCode" placeholder="默认按照类别规则取值，可自定义"></x-input>
                <x-input title="资产名称 " placeholder="请输入资产名称" class="assetName" v-model="asset.assetsName">
                </x-input>
                 <x-input title="资产类别" class="assetType" v-model="asset.assetsClassName" placeholder="请选择资产类别" @on-focus="onClickAssetType"></x-input>
                <x-input title="资产类别" v-model="asset.assetsClass" style="display:none"></x-input>
                <x-input title="变动方式" class="changeWay" placeholder="请选择变动方式" v-model="asset.changeMethod" @on-focus="onClickchangeWay"></x-input>
                <x-input title="变动方式" v-model="asset.changeWay" style="display:none"></x-input>
                <x-input title="使用状况" class="useStatu" placeholder="请选择使用状况" v-model="asset.useStatu" @on-focus="onClickuseStatu"></x-input>
                <x-input title="使用状况" v-model="asset.workingConditionId" style="display:none"></x-input>
                <x-input title="存放地点" class="palce" v-model="asset.storePlace" placeholder="请选择存放地点" @on-focus="onClickstorgy"></x-input>
                <x-input title="存放地点" v-model="asset.storePlaceId" style="display:none"></x-input>
                <selector title="经营用途" placeholder="" v-model="asset.economicUse" direction="rtl" class="operatList" :options="operatList"></selector>
                <flexbox class="voucherState">
                    <flexbox-item class="voucherState-content">
                        <span class="voucherState-content-yes">
                            <span class="voucherState-content-yes-icon" v-bind:style="{ borderColor:borderColor }" @click="voucherStateYes">
                                <span :class="{radioed: yes }"></span>
                            </span>
                            <span>在册固定资产</span>
                        </span>
                    </flexbox-item>
                    <flexbox-item class="voucherState-content">
                        <span class="voucherState-content-no">
                            <span class="voucherState-content-no-icon" v-bind:style="{ borderColor:otherColor }" @click="voucherStateNo">
                                <span :class="{radioed: no }"></span>
                            </span>
                            <span>退役固定资产</span>
                        </span>
                    </flexbox-item>
                </flexbox>
                <cell title="机制标志"></cell>
                <div class="voucherState">
                    <span class="voucherState-content">
                        <span class="voucherState-content-yes">
                            <span class="voucherState-content-yes-icon" v-bind:style="{ borderColor:addborderColor }" @click="auditStateAdd">
                                <span :class="{radioed: StateAdd }"></span>
                            </span>
                            <span>新增</span>
                        </span>
                        <span class="voucherState-content-no">
                            <span class="voucherState-content-no-icon" v-bind:style="{ borderColor:changeborderColor }" @click="auditStateChange">
                                <span :class="{radioed: change }"></span>
                            </span>
                            <span>变动</span>
                        </span>
                    </span>
                    <span class="voucherState-content">
                        <span class="voucherState-content-yes">
                            <span class="voucherState-content-yes-icon" v-bind:style="{ borderColor:removeborderColor }" @click="auditStateRemove">
                                <span :class="{radioed: removed }"></span>
                            </span>
                            <span>部分清理</span>
                        </span>
                        <span class="voucherState-content-no">
                            <span class="voucherState-content-no-icon" v-bind:style="{ borderColor:deleteborderColor }" @click="auditStateDelete">
                                <span :class="{radioed: deleted }"></span>
                            </span>
                            <span>完全清理</span>
                        </span>
                    </span>
                </div>
            </group>

            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color: #40affc " type="primary" @click.native="storageBasicInfo">重置</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: #ea7e26;" type="primary" @click.native="submitBasicInfo">查询</x-button>
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
  Checklist,
  Confirm,
  Selector,
  Datetime,
  Popup,
  Cell
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
    Checklist,
    Confirm,
    Selector,
    Popup,
    Datetime,
    Cell,
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
      operatList: ["全部", "经营用", "非经营用"], // 经营用途
      borderColor: "#c9c9c9",
      otherColor: "#c9c9c9",
      StateAdd: false,
      change: false,
      removed: false,
      deleted: false,
      addborderColor: "#c9c9c9",
      changeborderColor: "#c9c9c9",
      removeborderColor: "#c9c9c9",
      deleteborderColor: "#c9c9c9",
      yes: false,
      no: false,
      assetPopup: false, //固定资产类型选择
      storagePopup: false, //存放地点
      useStatuPopup: false, // 使用状况
      changeWayPopup: false //变动方式
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
    storageBasicInfo() {
      this.showPopup = false;
    },
    submitBasicInfo() {
      let vm = this;
      if (Z_IsEmpty20(vm.asset.period)) {
        vm.$vux.toast.text("请选择会计期间");
        return;
      }
      let operastatus = "";
      if (vm.StateAdd) {
        operastatus = "add";
      } else if (vm.change) {
        operastatus = "change";
      } else if (vm.removed) {
        operastatus = "clean";
      } else if (vm.deleted) {
        operastatus = "allclean";
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
      let invalid = state ? { invalid: state } : {};
      let economicUse = vm.asset.economicUse
        ? { economicUse: vm.asset.economicUse }
        : {};
      let operationStatus = operastatus ? { operationStatus: operastatus } : {};
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
        invalid,
        operationStatus
      );
      this.$emit("submitAssetList", param);
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
      vm.asset.assetsClassName = item.name;
      vm.asset.assetsClass = item.code;
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
    voucherStateYes() {
      this.yes = true;
      this.no = false;
      this.borderColor = "#40affc";
      this.otherColor = "#c9c9c9";
    },
    voucherStateNo() {
      this.yes = false;
      this.no = true;
      this.borderColor = "#c9c9c9";
      this.otherColor = "#40affc";
    },
    auditStateAdd() {
      this.StateAdd = true;
      this.change = false;
      this.removed = false;
      this.deleted = false;
      this.addborderColor = "#40affc";
      this.changeborderColor = "#c9c9c9";
      this.removeborderColor = "#c9c9c9";
      this.deleteborderColor = "#c9c9c9";
    },
    auditStateChange() {
      this.StateAdd = false;
      this.change = true;
      this.removed = false;
      this.deleted = false;
      this.addborderColor = "#c9c9c9";
      this.changeborderColor = "#40affc";
      this.removeborderColor = "#c9c9c9";
      this.deleteborderColor = "#c9c9c9";
    },
    auditStateRemove() {
      this.StateAdd = false;
      this.change = false;
      this.removed = true;
      this.deleted = false;
      this.addborderColor = "#c9c9c9";
      this.changeborderColor = "#c9c9c9";
      this.removeborderColor = "#40affc";
      this.deleteborderColor = "#c9c9c9";
    },
    auditStateDelete() {
      this.StateAdd = false;
      this.change = false;
      this.removed = false;
      this.deleted = true;
      this.addborderColor = "#c9c9c9";
      this.changeborderColor = "#c9c9c9";
      this.removeborderColor = "#c9c9c9";
      this.deleteborderColor = "#40affc";
    }
  }
};
</script>
<style>
.default-content .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 83px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.searchPage {
    height: 100%;

    .defaultPage {
        height: 100%;

        .default-content {
            height: calc(100% - 95px);
        }
    }
}

.voucherState, .auditState {
    position: relative;
    height: 44px;
    line-height: 44px;
    border-top: 1px solid #f5f5f5;
    padding-left: 13px;
    font-size: 16px;

    &-content {
        position: initial;
        right: 13px;

        &-all {
            &-icon {
                position: relative;
                box-sizing: border-box;
                display: inline-block;
                width: 21px;
                height: 21px;
                background-color: #fff;
                border: 1px solid #f5f5f5;
                border-radius: 11px;
            }
        }

        &-yes {
            margin: 0 5px;

            &-icon {
                position: relative;
                box-sizing: border-box;
                display: inline-block;
                width: 21px;
                height: 21px;
                background-color: #fff;
                border: 1px solid #f5f5f5;
                border-radius: 11px;
            }
        }

        &-no {
            &-icon {
                position: relative;
                box-sizing: border-box;
                display: inline-block;
                width: 21px;
                height: 21px;
                background-color: #fff;
                border: 1px solid #f5f5f5;
                border-radius: 11px;
            }
        }
    }
}

.radioed {
    box-sizing: border-box;
    content: '';
    display: inline-block;
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #40affc;
}
</style>
