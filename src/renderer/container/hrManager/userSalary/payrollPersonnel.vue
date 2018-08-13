<template>
  <div class="voucherAddExamine">
    <!--<scroll>-->
    <group label-width="4.5em">
      <x-input title="凭证号<span style='color: red;'>*</span>" v-model="voucherInfo.pzNo" :show-clear="true" :disabled="true" placeholder="凭证号提取后自增"></x-input>
      <x-input title="附件总数" v-model="voucherInfo.pzFileCount" :show-clear="false" :disabled="false" placeholder=""></x-input>
      <x-input title="结算方式" v-model="voucherInfo.pzSettlementMethod" :show-clear="false" :disabled="false" placeholder=""></x-input>
      <x-input title="结算号" v-model="voucherInfo.pzSettlementNumber" :show-clear="false" :disabled="false" placeholder=""></x-input>
      <x-input title="业务往来" v-model="voucherInfo.pzCurrentBusiness" :show-clear="false" :disabled="false" placeholder=""></x-input>
      <x-input title="经办" v-model="voucherInfo.pzHaddingName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzHadding,'JB')" :disabled="true" placeholder=""></x-input>
      <x-input title="审核" v-model="voucherInfo.pzEexamineName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzEexamine,'SH')" :disabled="true" placeholder=""></x-input>
      <x-input title="过账" v-model="voucherInfo.pzPostingName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzPosting,'GZ')" :disabled="true" placeholder=""></x-input>
      <x-input title="出纳" v-model="voucherInfo.pzCashierName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzCashier,'CN')" :disabled="true" placeholder=""></x-input>
      <x-input title="制单" v-model="voucherInfo.pzMakeFormName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzMakeForm,'ZD')" :disabled="true" placeholder=""></x-input>
    </group>

    <org-member-picker :initialSelected="initialSelected" :showTab="['colleague']" :showPicker="showMemberPicker" :multiple="false" @picked="getMemberPickedData" @abort="onMemberPickAbort"></org-member-picker>

    <div v-for="(item, index) in voucherInfoItems" :key="index">
      <group label-width="4.5em">
        <div slot="title" style="height: 32px;padding-top:2px">
          <i class="iconfont icon-shanchu2" v-on:click="delEntry(index)" style="float: right;font-size: 30px;"></i>
        </div>
        <x-input title="业务描述" v-model="item.pzServiceDesc" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder=""></x-input>
        <x-input title="科目代码<span style='color: red;'>*</span>" v-model="item.projectId" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder=""></x-input>
        <x-input title="科目名称<span style='color: red;'>*</span>" v-model="item.projectName" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder=""></x-input>
        <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" v-model="item.pzSummary" :readonly="disabled" placeholder=""></x-textarea>
        <x-input title="金额<span style='color: red;'>*</span>" v-model="item.pzPrice" :show-clear="false" :disabled="disabled" placeholder="0.00"></x-input>
      </group>
    </div>

    <!-- 科目 -->
    <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>

    <group style="margin:20px 0px;">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="addEntry">增加条目</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-input title="￥ " v-model="pzSecondMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button class="btn-save" type="warn" @click.native="SHSubmit">提交</x-button>
        </flexbox-item>
      </flexbox>
    </group>
    <!--</scroll>-->
  </div>
</template>


<script>
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import {
  XTextarea,
  XInput,
  Group,
  XButton,
  Cell,
  Flexbox,
  FlexboxItem
} from "vux";
export default {
  name: "voucherAddExamine",
  components: {
    XInput,
    Group,
    XButton,
    Cell,
    XTextarea,
    Flexbox,
    FlexboxItem,
    SubjectPicker,
    OrgMemberPicker
  },
  props: ["voucherInfoParam", "voucherInfoOutPzItemsParam"],
  data() {
    return {
      voucherInfo: {
        pzNo: "", //凭证号
        pzFileCount: "", //附件总数
        pzSettlementMethod: "", //结算方式
        pzSettlementNumber: "", //结算号
        pzCurrentBusiness: "", //业务往来
        orgMemberJBData: {}, //经办人
        orgMemberSHData: {}, //审核人
        orgMemberGZData: {}, //过账人
        orgMemberCNData: {}, //出纳人
        orgMemberZDData: {} //制单人
      },
      initialSelected: [], //人员id列表
      disabled: false,
      showPicker: false, //控制显示科目代码
      showMemberPicker: false, //控制选人组件隐藏显示
      orgMemberType: "", //人员功能类型
      clickKMIndex: 0, //条目下标
      voucherInfoItems: [
        {
          pzCount: "",
          pzPrice: "", //金额
          projectId: "", //科目代码
          projectName: "", //科目名称
          projectPath: "", //科目地址
          pzServiceDesc: "", //业务描述
          pzSummary: "", //摘要
          pzType: "outPz",
          dataType: "CW",
          voucherType: "CW"
        }
      ]
    };
  },
  computed: {
    pzSecondMoney: {
      //审核方总金额，pzFirstMoney为业务方总金额
      get: function() {
        let sum = 0;
        this.voucherInfoItems.forEach(function(item) {
          sum = (parseFloat(sum) + parseFloat(item.pzPrice)).toFixed(2);
        });
        return isNaN(sum) ? 0 : sum;
      },
      set: function() {}
    }
  },
  watch: {
    voucherInfoParam(val, oldVal) {
      this.voucherInfo = val;
    },
    voucherInfoOutPzItemsParam(val, oldVal) {
      this.voucherInfoItems = val;
    }
  },
  created: function() {
    //加载凭证号
  },
  methods: {
    addEntry() {
      //添加条目
      this.voucherInfoItems.push({
        pzCount: "",
        pzPrice: "0.00", //金额
        projectId: this.voucherInfo.ckProjectId
          ? this.voucherInfo.ckProjectId
          : "", //科目代码
        projectName: this.voucherInfo.ckProjectName
          ? this.voucherInfo.ckProjectName
          : "", //科目名称
        projectPath: this.voucherInfo.ckProjectPath
          ? this.voucherInfo.ckProjectPath
          : "", //科目地址
        pzServiceDesc: this.voucherInfo.pzServiceDesc
          ? this.voucherInfo.pzServiceDesc
          : "", //业务描述
        pzSummary: "", //摘要
        pzType: "outSalary",
        dataType: "CW",
        voucherType: "CW"
      });
    },
    delEntry(val) {
      //删除条目
      if (this.voucherInfoItems.length > 1) {
        this.voucherInfoItems.splice(val, 1);
      }
    },
    /* 选择科目 */
    selectPickedDialog(index) {
      this.clickKMIndex = index;
      this.showPicker = true;
    },
    getPickedData(pickedData) {
      //获取科目数据
      this.voucherInfoItems[this.clickKMIndex].projectId = pickedData.fileId;
      this.voucherInfoItems[this.clickKMIndex].projectName =
        pickedData.filename;
      this.voucherInfoItems[this.clickKMIndex].projectPath = pickedData.modleId;
      this.voucherInfoItems[this.clickKMIndex].pzServiceDesc =
        pickedData.description;
      this.showPicker = false;
    },
    subjectAbort() {
      this.showPicker = false;
    },
    /* 选择组织机构人员*/
    selectManDialog(userData, type) {
      if (typeof userData === "string" && userData.length > 0) {
        let arr = userData.split("#");
        this.initialSelected = [{ type: arr[2], value: arr[0] }];
      } else {
        this.initialSelected = [];
      }
      this.orgMemberType = type;
      this.showMemberPicker = true;
    },
    getMemberPickedData(data) {
      if (data.length > 0) {
        let userData =
          data[0]["id"] + "#" + data[0]["title"] + "#" + data[0]["type"];
        //获取组织机构人员数据
        if (this.orgMemberType === "JB") {
          this.voucherInfo.pzHadding = userData;
          this.voucherInfo.pzHaddingName = data[0]["title"];
        } else if (this.orgMemberType === "SH") {
          this.voucherInfo.pzEexamine = userData;
          this.voucherInfo.pzEexamineName = data[0]["title"];
        } else if (this.orgMemberType === "GZ") {
          this.voucherInfo.pzPosting = userData;
          this.voucherInfo.pzPostingName = data[0]["title"];
        } else if (this.orgMemberType === "CN") {
          this.voucherInfo.pzCashier = userData;
          this.voucherInfo.pzCashierName = data[0]["title"];
        } else {
          this.voucherInfo.pzMakeForm = userData;
          this.voucherInfo.pzMakeFormName = data[0]["title"];
        }
      }

      this.showMemberPicker = false;
    },
    onMemberPickAbort() {
      //隐藏组织机构人员页面
      this.showMemberPicker = false;
    },
    SHSubmit() {
      //审核方提交方法
      /*  for (let i = 0; i < this.voucherInfoItems.length; i++) {
        //imageListYW
        if (this.voucherInfoItems[i].imageListSH.length <= 0) {
          this.$vux.toast.text("请上传图片");
          return false;
        }
      } */
      this.voucherInfo.withTrello = "true";
      this.voucherInfo.dataType = "CW";
      this.voucherInfo.voucherType = "CW";
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;

      let url = "/zingbiz/resourceLibrary/voucher/updateVoucherInfo";
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          this.$router.push({
            path: "/resourceLibrary/financeWarehouse/payrollList",
            query: {
              companyId: this.$route.query.companyId,
              cardUrl: this.$route.query.cardUrl
            }
          });
        } else {
          this.$vux.toast.text("保存失败，请重试");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>