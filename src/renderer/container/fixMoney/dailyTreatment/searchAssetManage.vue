<template>
    <div style="height:100%">
        <popup v-model="searchShowPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <!-- <div class="popupDate-picker-popup"> -->
            <ZingHead :title="title" :isComeBack="false" @doSome="doSome()">
            </ZingHead>
            <div style="height:100%">
                <div class="search-param" style="overflow-y:scroll;" :data="asset">
                    <group label-width="6em" label-margin-right="2em">
                    <x-input title="资产类别" class="assetType" v-model="asset.assetsClassName" placeholder="请选择资产类别" disabled @click.native="onClickAssetType"></x-input>
                         <x-input v-model="asset.assetsClass" style="display:none"></x-input>
                        <!-- <selector title="资产类别" :options="assetTypeList" v-model="asset.assetsClass" placeholder=""></selector> -->
                        <datetime :title="'年度'" v-model="asset.year" format="YYYY" :placeholder="'全部'"></datetime>
                        <datetime :title="'期间'" v-model="asset.Data" format="MM" :placeholder="'全部'"></datetime>
                        <x-input title="资产名称 " placeholder="请输入资产名称" v-model="asset.assetsName"></x-input>
                        <x-input title="资产编码" v-model="asset.assetsCoding" placeholder="请输入资产编码"></x-input>
                        <selector title="经营用途" :options="operatList" placeholder="" v-model="asset.economicUse" direction="rtl"></selector>
                        <!-- <x-input title="变动方式" placeholder="请选择变动方式" v-model="asset.changeWay" @click.native="onClickchangeWay"></x-input> -->
                        <!-- <selector title="使用状况" :options="useStatuList" placeholder="" v-model="asset.workingConditionId"></selector>
                        <selector title="存放地点" :options="assetpalceList" v-model="asset.storePlaceId" placeholder=""></selector>
                        <selector title="折旧方法" :options="depreciatmentList" v-model="asset.depreciationMethod" placeholder=""></selector> -->
                       <x-input title="存放地点" class="palce" v-model="asset.storePlaceIdName " placeholder="请选择存放地点" disabled @click.native="onClickstorgy"></x-input>
                        <x-input v-model="asset.storePlaceId" style="display:none"></x-input>
                        <x-input title="使用状况" class="useStatu" placeholder="请选择使用状况" v-model="asset.workingConditionIdName" disabled @click.native="onClickuseStatu"></x-input>
                        <x-input v-model="asset.workingConditionId " style="display:none"></x-input>
                        <x-input title="变动方式" class="changeWay" placeholder="请选择变动方式" v-model="asset.changeWayName" disabled @click.native="onClickchangeWay"></x-input>
                        <x-input v-model="asset.changeWay" style="display:none"></x-input>
                        <x-input title="计量单位" v-model="asset.measureUnitId" placeholder="请输入计量单位"></x-input>
                        <datetime :title="'变动日期'" v-model="asset.changeData" format="YYYY-MM-DD" :placeholder="'请选择变动日期'"></datetime>
                        <x-input title="制造商 " placeholder="请输入制造商" v-model="asset.manufacturer"></x-input>
                        <x-input title="产地" v-model="asset.source" placeholder="请输入产地信息"></x-input>
                        <x-input title="供应商 " placeholder="请输入供应商" v-model="asset.supplier"></x-input>
                        <datetime :title="'开始使用日期'" v-model="asset.startDate" :placeholder="'请选择开始使用日期'"></datetime>
                        <x-input title="数量" placeholder="0" v-model="asset.count"></x-input>
                        <x-input title="使用部门" v-model="asset.deptment" placeholder="请选择使用部门" disabled @click.native="onClickdept"></x-input>
                    </group>
                </div>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item>
                        <x-button @click.native="cancle" class="btn-save" type="primary">取消</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button @click.native="submitBasicInfo" type="primary" class="btn-common">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
            <!-- </div> -->
        </popup>
        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson" :multiple="false" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPickDept" @abort="onPickAbortdept"></org-member-picker>
        <popupChangeWay :showPopup="changeWayPopup" @backClick="clickBack" @checkItem="checkChangeWay"></popupChangeWay>
        <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="checkAssetType"></popupAssetType>
        <popupStorage :showPopup="storagePopup" @backClick="clickBack" @checkItem="checkStorage"></popupStorage>
        <popupUseStatu :showPopup="useStatuPopup" @backClick="clickBack" @checkItem="checkUseStatu"></popupUseStatu>
    </div>
</template>
<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import popupAssetType from "./selectorPopup/popupAssetType";
import popupStorage from "./selectorPopup/popupStorage";
import popupUseStatu from "./selectorPopup/popupUseStatu";
import popupChangeWay from "./selectorPopup/popupChangeWay";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Datetime,
  Selector,
  Popup
} from "vux";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Datetime,
    Selector,
    Popup,
    popupAssetType,
    popupStorage,
    popupUseStatu,
    popupChangeWay,
    OrgMemberPicker
  },
  props: {
    searchShowPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      title: "筛选条件",
      asset: {},
      TabreadOnly: false,
      assetTypeList: [],
      operatList: ["全部", "经营用", "非经营用"], // 经营用途
      depreciatmentList: [
        {
          key: "pingjun-nianxian-a",
          value: "平均年限法（基于入账原值和入账预计使用期间）"
        },
        {
          key: "pingjun-nianxian-b",
          value: "平均年限法（基于入账净值和入账剩余使用期间）"
        },
        { key: "nianshu-zhonghe", value: "年数总和法" },
        {
          key: "shuangbei-yue-a",
          value: "双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "shuangbei-yue-b",
          value: "双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-pingjunnian", value: "动态平均年限法" },
        {
          key: "dongtai-shuangbeiyu-a",
          value: "动态双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "dongtai-shuangbeiyu-b",
          value: "动态双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-nianshu", value: "动态年数总和法" },
        { key: "gongzuoliang", value: "工作量法" }
      ],
      useStatuList: [],
      assetpalceList: [],
      //   storagePopup: false,
      deleteItemIcon: true,
      assetPopup: false, //固定资产类型选择
    //   unitPopup: false, //计量单位
      storagePopup: false, //存放地点
      useStatuPopup: false, // 使用状况
      changeWayPopup: false, //变动方式
      initSelectPerson: [],
      isAuthRole: ["org"],
      showPersonPicker: false
    };
  },
  methods: {
    //关闭资产类别Popup框
    clickBack() {
      let vm = this;
      vm.assetPopup = false;
      vm.unitPopup = false;
      vm.storagePopup = false;
      vm.useStatuPopup = false;
      vm.changeWayPopup = false;
    },
    //固定资产选择
    checkAssetType(item) {
      let vm = this;
      vm.asset.assetsClassName = item.name;
      vm.asset.assetsClass = item.code;
      vm.assetPopup = false;
    },
    // //计量单位
    // changeCheck(val, label) {
    //   let vm = this;
    //   vm.asset.measureUnitId = label.toString();
    //   vm.unitPopup = false;
    // },
    // 存放地点
    checkStorage(item) {
      let vm = this;
      vm.storagePopup = false;
      vm.asset.storePlaceIdName = item.name;
      vm.asset.storePlaceId = item.code;
    },
    //使用状况
    checkUseStatu(item) {
      let vm = this;
      vm.useStatuPopup = false;
      vm.asset.workingConditionIdName = item.name;
      vm.asset.workingConditionId = item.code;
    },
    //变动方式
    checkChangeWay(item) {
      let vm = this;
      vm.changeWayPopup = false;
      vm.asset.changeWayName = item.name;
      vm.asset.changeWay = item.code;
    },
    //选择资产类型popup
    onClickAssetType() {
      this.assetPopup = true;
    },
    // // 选择计量单位popup显示
    // onClickunit() {
    //   this.unitPopup = true;
    // },
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
    doSome() {
      this.$router.go(-1);
    },
    cancle() {
      this.$router.go(-1);
    },
    //提交数据
    submitBasicInfo() {
      let vm = this;
      let assetsClass = vm.asset.assetsClass
        ? { assetsClass: vm.asset.assetsClass }
        : {};
      //let year= vm.asset.year ? {year:vm.asset.year} : {}
      //let date= vm.asset.Data ? {date:vm.asset.Data} : {}
      let assetsName = vm.asset.assetsName
        ? { assetsName: vm.asset.assetsName }
        : {};
      let assetsCoding = vm.asset.assetsCoding
        ? { assetsCoding: vm.asset.assetsCoding }
        : {};
      let changeWay = vm.asset.changeWay
        ? { changeWay: vm.asset.changeWay }
        : {};
      let economicUse = vm.asset.economicUse
        ? { economicUse: vm.asset.economicUse }
        : {};
      let workingConditionId = vm.asset.workingConditionId
        ? { workingConditionId: vm.asset.workingConditionId }
        : {};
      let storePlaceId = vm.asset.storePlaceId
        ? { storePlaceId: vm.asset.storePlaceId }
        : {};
      let depreciationMethod = vm.asset.depreciationMethod
        ? { depreciationMethod: vm.asset.depreciationMethod }
        : {};
      let measureUnitId = vm.asset.measureUnitId
        ? { measureUnitId: vm.asset.measureUnitId }
        : {};
      //    let  changeData=vm.asset.changeData ?{changeData:vm.asset.changeData} :{}
      let manufacturer = vm.asset.manufacturer
        ? { manufacturer: vm.asset.manufacturer }
        : {};
      //let source=vm.asset.source ?{source:vm.asset.source }:{}
      let supplier = vm.asset.supplier ? { supplier: vm.asset.supplier } : {};
      let startDstartDateate = vm.asset.startDate
        ? { startDstartDateate: vm.asset.startDate }
        : {};
      let count = vm.asset.count ? { count: vm.asset.count } : {};
      //let deptment=vm.asset.deptment ? {deptment:vm.asset.deptment} : {}
      let param = Object.assign(
        {},
        assetsClass,
        assetsName,
        assetsCoding,
        changeWay,
        economicUse,
        workingConditionId,
        storePlaceId,
        depreciationMethod,
        measureUnitId,
        manufacturer,
        supplier,
        startDstartDateate,
        count
      );
      this.$emit("submitBasicInfo", param);
    },
    // checkChangeWay(item) {
    //   console.info(item)
    //   this.changeWayPopup = false;
    //   this.asset.changeWay = item.name;
    // },
    onClickdept() {
      this.showPersonPicker = true;
    },
    onPickDept(list) {
        console.info(list)
      this.asset.deptment = list[0].text;
      this.showPersonPicker = false;
    },
    onPickAbortdept() {
      this.showPersonPicker = false;
    }
  }
};
</script>
<style>
.search-param {
  height: calc(100%-93px);
  padding-bottom: 2px;
  font-family: Arial;
  font-size: 16px;
}
.search-param .weui-cell__hd,
.search-param .weui-select,
.search-param .weui-cell__bd input,
.weui-cell__bd textarea,
.search-param .weui-cell_access {
  font-family: Arial;
  font-size: 16px !important;
}
</style>


