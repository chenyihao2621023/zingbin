<!-- 工作量查询 -->
<template>
    <div style="height:100%">
        <ZingHead title="工作量查询" :isComeBack="false" @doSome="close()">
        </ZingHead>
        <div class="workquery" :data="workquery">
            <group label-width="6em" label-margin-right="2em" class="workquery-child">
                <x-input title="会计年度" v-model="workquery.year" placeholder="请输入会计年度"></x-input>
                <x-input title="会计期间 " placeholder="请输入会计期间" v-model="workquery.period"></x-input>
                <x-input title="类别名称" v-model="workquery.assetsClassName" placeholder="请输入类别名称" disabled @click.native="onClickAssetType"></x-input>
                <x-input v-model="workquery.assetsClass" style="display:none"></x-input>
                <x-input title="资产编码 " placeholder="请输入会资产编码" v-model="workquery.assetsCoding"></x-input>
                <x-input title="资产名称" v-model="workquery.assetsName" placeholder="请输入资产名称"></x-input>
                 <x-input v-model="workquery.departmentId" style="display:none"></x-input>
                <x-input title="部门" placeholder="请选择部门" v-model="workquery.department" disabled @click.native="onClickDept"></x-input>
                <x-input title="工作量单位" v-model="workquery.workUnit" placeholder="请输入工作量单位"></x-input>
            </group>
            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="close()">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="submit">查询</x-button>
                </flexbox-item>
            </flexbox>
        </div>
         <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="checkAssetType"></popupAssetType>
        <query-result :showPopup="showquery" :tableData="tableData" @search="searchResult" @backClick="doSome"></query-result>
        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson" :multiple="false" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPickDept" @abort="onPickAbortdept"></org-member-picker>
    </div>
</template>
<script>
import { Group, XInput, Flexbox, FlexboxItem, XButton } from "vux";
import queryResult from "./workQueryResult";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import ZingHead from "components/zingHead/ZingHead.vue";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    queryResult,
    OrgMemberPicker
  },
  data() {
    return {
      workquery: {},
      showquery: false,
      tableData:[],
      initSelectPerson: [],
      isAuthRole: ["org"],
      showPersonPicker: false,
      assetPopup: false, //固定资产类型选择
    };
  },
  //   created() {
  //   },
  methods: {
    close() {
      this.$router.go(-1);
    },
     //关闭资产类别Popup框
    clickBack() {
      let vm = this;
      vm.assetPopup = false;
    },
        //选择资产类型popup
    onClickAssetType() {
      this.assetPopup = true;
    },
        //固定资产选择
    checkAssetType(item) {
      let vm = this;
      vm.workquery.assetsClassName = item.name;
      vm.workquery.assetsClass = item.code;
      vm.assetPopup = false;
    },
    submit() {
      // 未输入则默认查询全部
      let vm = this;
      let url = "/zingbiz/fixedAssets/assetsManagement/selectWorkManage"
      let year = vm.workquery.year ? { year:vm.workquery.year } : {}
      let period = vm.workquery.period ? { period:vm.workquery.period } : {}
      let assetsClass = vm.workquery.assetsClass ? { assetsClass:vm.workquery.assetsClass } : {}
      let assetsName = vm.workquery.assetsName ? { assetsName:vm.workquery.assetsName } : {}
      let assetsCoding = vm.workquery.assetsCoding ? { assetsCoding:vm.workquery.assetsCoding } : {}
      let department = vm.workquery.departmentId ? { department:vm.workquery.departmentId } : {}
      let workUnit = vm.workquery.workUnit ? { workUnit:vm.workquery.workUnit } : {}
      let param = Object.assign({},year,period,assetsClass,assetsName,assetsCoding,department,workUnit)
      this.$http.post(url, param).then(res => {
         if (res.data.success) {
             vm.tableData = res.data.data
         }
      })
      vm.showquery = true;
    },
    searchResult() {
      this.showquery = false;
    },
    doSome() {
      this.showquery = false;
    },
    onClickDept() {
      this.showPersonPicker = true;
    },
    onPickAbortDept() {
      this.showPersonPicker = false;
    },
    onPickDept(list) {
        console.info(list)
      this.workquery.departmentId = list[0].id;
      this.workquery.department = list[0].text;
      this.showPersonPicker = false;
    }
  }
};
</script>
<style scoped>
.workquery {
  height: 100%;
}
.workquery-child {
  height: calc(100%-94px);
}
.workquery .weui-cell {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
</style>
