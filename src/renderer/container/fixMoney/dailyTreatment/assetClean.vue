<template>
    <div style="font-size:14px;height:100%">
        <ZingHead :title="assetTitle" :isComeBack="false" @doSome="backClick">
        </ZingHead>
        <div class="asset" :data="asset">
            <group label-width="8em" label-margin-right="2em" class="asset-list">
                <x-input title="固定资产" v-model="asset.assetName" class="asset" placeholder="JQ009-笔记本" :readonly="TabreadOnly" :disabled="TabreadOnly"></x-input>
                <!-- <datetime v-model="asset.cleanData" title="清理日期" :readonly="TabreadOnly"></datetime> -->
                <x-input v-model="asset.cleanData" title="清理日期" :readonly="TabreadOnly"></x-input>
                <x-input title="原数量" v-model="asset.originAcount" class="assetCode" placeholder="1" :readonly="TabreadOnly"></x-input>
                <x-input title="清理数量" v-model="asset.count" placeholder="0" :readonly="TabreadOnly"></x-input>
                <x-input title="清理费用" v-model="asset.cleaningCosts" placeholder="0.00" @on-blur="onBlurValidCosts" :readonly="TabreadOnly"></x-input>
                <x-input title="残值收入" placeholder="0.00" class="assetName" @on-blur="onBlurValidesidual" v-model="asset.residualIncome" :readonly="TabreadOnly">
                </x-input>
                <x-input title="变动方式" v-model="asset.changeWay" style="display:none"></x-input>
                <x-input title="变动方式" v-model="asset.changeMethod" class="subjectName" placeholder="请选择变动方式" disabled @click.native="onClickstorgy" :readonly="TabreadOnly"></x-input>
                <x-input title="摘要" placeholder="请输入摘要信息" class="remark" v-model="asset.summary" :readonly="TabreadOnly">
                </x-input>
            </group>
            <flexbox :gutter="0" class="main-footer" v-if="TabStatus">
                <flexbox-item v-if="TabStatus">
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="cancleItem">关闭</x-button>
                </flexbox-item>
            </flexbox>
            <flexbox :gutter="0" class="main-footer" v-else>
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="deleteItem">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submitAsset">提交</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <popupChangeWay :showPopup="changeWayPopup" @backClick="clickBack" @checkItem="checkChangeWay"></popupChangeWay>
        <!-- <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="checkAssetType"></popupAssetType> -->
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Datetime,
  Popup
} from "vux";
import popupAssetType from "./selectorPopup/popupAssetType";
import popupChangeWay from "./selectorPopup/popupChangeWay";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Datetime,
    Popup,
    Scroll,
    Tree,
    popupAssetType,
    popupChangeWay
  },
  data() {
    return {
      paramtemp: {},
      TabreadOnly: false,
      TabStatus: false,
      asset: {},
      deleteItemIcon: true,
      asetTitle: "",
      changeWayPopup: false
    };
  },
  created() {
    let vm = this;
    vm.paramtemp = vm.$route.query;
    console.info(vm.$route.query.item);
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let currencyDate = year + '-' + month + '-' + day
    vm.asset = {
      assetName: vm.paramtemp.item.assetsName,
      originAcount:vm.paramtemp.item.count,
      cleanData: currencyDate
    };
    if (vm.paramtemp.flag === "add") {
      vm.TabreadOnly = false;
      vm.assetTitle = "固定资产清理";
      vm.TabStatus = false;
    } else {
      this.TabreadOnly = true;
      vm.TabStatus = true;
      vm.assetTitle = "清理情况查看";
      vm.getcleanData();
    }
  },
  methods: {
    getcleanData() {
      let id = this.paramtemp.originId;
      this.$http
        .get("/zingbiz/fixedAssets/cleanRecord/select/" + { id })
        .then(res => {
          this.asset = res.data.data;
        });
    },
    //     //固定资产选择
    // checkAssetType(item) {
    //   let vm = this;
    //   vm.asset.assetName = item.code + '-' + item.name;
    //   vm.assetPopup = false;
    // },
    //变动方式
    checkChangeWay(item) {
      let vm = this;
      vm.changeWayPopup = false;
      vm.asset.changeMethod = item.name;
      vm.asset.changeWay = item.code;
    },
    backClick() {
      this.$router.go(-1);
    },
    cancleItem() {
      this.$router.go(-1);
    },
    deleteItem() {
      this.$router.go(-1);
    },
    clickback() {
      this.changeWayPopup = false;
    },
    //制保留2位小数，如：2，会在2后面补上00.即2.00
    toDecimal(x) {
      let f = parseFloat(x);
      if (isNaN(f)) {
        return 0.0;
      }
      let fn = Math.round(x * 100) / 100;
      let s = fn.toString();
      let rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    onBlurValidCosts(val) {
      this.asset.cleaningCosts = this.toDecimal(val);
    },
    onBlurValidesidual(val) {
      this.asset.residualIncome = this.toDecimal(val);
    },
    // 存放地点popup显示
    onClickstorgy() {
      this.changeWayPopup = true;
    },
    submitAsset() {
      let vm = this;
      if (Z_IsEmpty20(vm.asset.changeWay)) {
        vm.$vux.toast.text("请选择存放地点");
        return;
      }
     let amount = vm.asset.originAcount - vm.asset.count
      if (amount < 0) {
            vm.$vux.toast.text("请正确输入数量");
            return;
      }
      let cleanId = "";
      if (vm.paramtemp.type === "add") {
        cleanId = vm.paramtemp.originId;
      } else if (
        vm.paramtemp.type === "clean" ||
        vm.paramtemp.type === "change"
      ) {
        cleanId = vm.paramtemp.item.originId;
      }
      let url = "/zingbiz/fixedAssets/assetsManagement/clean";
      //清理日期  原数量  清理数量 残值收入
      let assetManagement = {
        originalId: cleanId,
        count: vm.asset.count,
        changeWay: vm.asset.changeWay, //变动方式 ,
        residualIncome: vm.asset.residualIncome,
        cleaningCosts: vm.asset.cleaningCosts, // 清理费用 ,
        type: "clean", //操作类型[add(新增), clean(清理), change(变动)]
        summary: vm.asset.summary //摘要
      };
      vm.$http.post(url, assetManagement).then(res => {
        if (res.data.success) {
          vm.$vux.toast.text(res.data.msg);
        }
      });
    }
  }
};
</script>
<style >
.asset {
  height: 100%;
}
.asset-list {
  height: calc(100%-94px);
}
.asset .subjectName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 85px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>


