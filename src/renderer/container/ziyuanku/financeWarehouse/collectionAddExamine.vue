<template>
  <div class="voucherAddExamine">
    <!--<scroll>-->
    <div v-for="(item, index) in voucherInfoItems" :key="index">
      <group label-width="4.5em">
        <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" v-model="item.pzSummary" :readonly="disabled" placeholder=""></x-textarea>
        <x-input title="金额<span style='color: red;'>*</span>" v-model="item.pzPrice" :show-clear="false" :disabled="disabled" placeholder="0.00"></x-input>
        <x-input title="业务描述" v-model="item.pzServiceDesc" :show-clear="false" :disabled="true" placeholder=""></x-input>
        <x-input title="科目代码<span style='color: red;'>*</span>" v-model="item.projectId" :show-clear="false" :disabled="true" placeholder=""></x-input>
        <x-input title="科目名称<span style='color: red;'>*</span>" v-model="item.projectName" :show-clear="false" :disabled="true" placeholder=""></x-input>
        <x-input title="原来凭证<span style='color: red;'>*</span>" v-model="item.pzId" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </group>
    </div>

    <group style="margin:20px 0px;">
      <flexbox>
        <flexbox-item>
          <x-input title="￥ " v-model="pzSecondMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <flexbox v-show="voucherInfo.pzStatus === 'DSH'" :gutter="0">
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
  Popup,
  Cell,
  Flexbox,
  FlexboxItem,
  XSwitch,
  GroupTitle,
  Selector,
  Checker,
  CheckerItem
} from "vux";
export default {
  name: "voucherAddExamine",
  components: {
    XInput,
    Group,
    XButton,
    Popup,
    Cell,
    XTextarea,
    Flexbox,
    FlexboxItem,
    XSwitch,
    GroupTitle,
    SubjectPicker,
    OrgMemberPicker,
    Selector,
    Checker,
    CheckerItem
  },
  props: ["voucherInfoParam", "voucherInfoOutPzItemsParam"],
  data() {
    return {
      pzPeriods: "", //期间
      wordData: [], //凭证字
      voucherInfo: {
        wordDataId: "", //所选凭证字
        pzNo: "", //凭证号
        pzFileCount: "", //附件总数
        pzSettlementMethod: "", //结算方式
        pzSettlementNumber: "", //结算号
        pzCurrentBusiness: "" //业务往来
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
          examineAspect: "贷", //借贷
          imageListSH: [], //表中为pzImgs字段
          projectId: "", //科目代码
          projectName: "", //科目名称
          projectPath: "", //科目地址
          pzServiceDesc: "", //业务描述
          pzSummary: "", //摘要
          pzType: "outPz",
          dataType: "CW",
          voucherType: "CW",
          pzImgs: ""
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
    //获取当前年月
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let timeStr = year.toString() + month.toString();
    this.pzPeriods = timeStr;
    //加载凭证号
    let url = "/zingbiz/finance/voucher/searchVoucher";
    this.$http.post(url, { status: "1" }).then(res => {
      if (res.data.success) {
        this.wordData = [];
        for (let i = 0; i < res.data.data.data.data.length; i++) {
          this.wordData.push({
            key: res.data.data.data.data[i].voucherId,
            value: res.data.data.data.data[i].voucherName
          });
        }
      } else {
        this.$vux.toast.text("加载失败，请重试");
      }
    });
  },
  methods: {}
};
</script>

<style scoped>
.examineAspectItem {
  width: 50px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 13px;
}
.examineAspectItem-selected {
  background: #ffffff bottom;
  border-color: #ff8000;
}
</style>