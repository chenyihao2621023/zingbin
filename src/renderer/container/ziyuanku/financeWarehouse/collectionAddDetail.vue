<template>
  <div>
    <group label-width="4.5em">
      <x-input title="编号" v-model="voucherInfo.pzId" :show-clear="false" :disabled="true" placeholder="" class="fontColor"></x-input>
      <x-input title="日期" :show-clear="false" :disabled="true" placeholder="" class="fontColor"></x-input>
      <x-input title="创建者" v-model="voucherInfo.voucherName" :show-clear="false" placeholder="" class="fontColor"></x-input>
    </group>

    <group label-width="4.5em" v-for="(item, index) in voucherInfoItems" :key="index">
      <image-picker :files="item.imageListYW" :companyId="voucherInfo.companyId" selectable multiple />
      <selector title="单据类型" placeholder="请选择单据类型" :readonly="false" v-model="item.docType" :options="docTypeList"></selector>
      <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" placeholder="" v-model="item.pzSummary" class="fontColor"></x-textarea>
      <x-input title="金额<span style='color: red;'>*</span>" :show-clear="false" :disabled="disabled" placeholder="0.00" v-model="item.pzPrice" class="fontColor"></x-input>
      <x-input title="业务描述" :show-clear="false" placeholder="请选择业务描述" :disabled="true" v-model="item.pzServiceDesc"  class="fontColor"></x-input>
      <x-input title="科目代码<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="item.projectId" :disabled="true"   class="fontColor"></x-input>
      <x-input title="科目名称<span style='color: red;'>*</span>" placeholder="请选择科目名称" :show-clear="false" v-model="item.projectName" :disabled="true"  class="fontColor"></x-input>
      <x-input title="财务库<span style='color: red;'>*</span>" :show-clear="false" v-model="item.ckName" :disabled="true" placeholder="" class="fontColor"></x-input>
      <x-input title="原凭证<span style='color: red;'>*</span>" :show-clear="false" v-model="item.pzId" :disabled="true" placeholder="" class="fontColor"></x-input>
    </group>
    <!-- 科目 -->
    <group style="margin-top:20px;">
      <flexbox>
        <flexbox-item>
          <x-input title="￥" v-model="pzFirstMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </flexbox-item>
      </flexbox>
    </group>

    <group>
      <flexbox :gutter="0" v-show="voucherInfo.pzStatus !== 'DSH' && !isQuote">
        <flexbox-item v-show="voucherInfo.pzStatus !== 'YSH'">
          <x-button class="btn-save" type="primary" @click.native="savePZ('SAVE')">保存</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button class="btn-common" type="warn" @click.native="savePZ('SUBMIT')">{{pzStatusText}}</x-button>
        </flexbox-item>
      </flexbox>
    </group>

  </div>
</template>


<script>
import ZingHead from "@/components/zingHead/ZingHead";
import {
  XTextarea,
  XInput,
  Group,
  XButton,
  Popup,
  Cell,
  Flexbox,
  FlexboxItem,
  Selector,
  XSwitch,
  GroupTitle
} from "vux";

export default {
  name: "financialVocational",
  components: {
    XInput,
    Group,
    XButton,
    Popup,
    Cell,
    XTextarea,
    Flexbox,
    FlexboxItem,
    Selector,
    XSwitch,
    GroupTitle,
    ZingHead
  },
  props: {
    voucherInfoParam: { type: "Object" },
    voucherInfoInPzItemsParam: { type: "Object" },
    isQuote: {
      type: "Boolean",
      default: false
    }
  },
  data() {
    return {
      showWarehoseList: false,
      boradIdArr: [],
      cardIdArr: [],
      listIdListArr: [],
      ckId: "",
      ckName: "",
      companyId: "",
      pzStatusText: "提交审核",
      financialRenwuShow: false, //控制弹框的隐藏显示
      showPicker: false, //控制显示科目代码
      clickKMIndex: 0, //点击的条目下标
      docTypeList: [
        //单据类型数组
        { key: "CLBXD", value: "差旅报销单" },
        { key: "ZCPZ", value: "支出凭证" },
        { key: "FYBX", value: "费用报销" },
        { key: "QT", value: "其它" }
      ],
      voucherInfo: {
        pzId: "",
        voucherName: "",
        pzType: "inPz",
        withTrello: "true",
        pzStatus: "",
        voucherType: "CW",
        dataType: "CW"
      }, //凭证数据
      voucherInfoItems: [
        {
          rowId: "",
          pzCount: "",
          docType: "CLBXD", //单据类型
          imageListYW: [], //图片列表,pzImgs
          pzImgs: "",
          pzPrice: "", //金额
          pzAccount: "",
          projectId: "", //科目代码
          projectName: "", //科目名称
          projectPath: "", //科目地址
          pzServiceDesc: "", //业务描述
          pzSummary: "", //摘要
          pzType: "inPz",
          dataType: "CW",
          voucherType: "CW"
        }
      ],
      renWuData: [], //任务列表
      disabled: false //是否可修改
    };
  },
  computed: {
    pzFirstMoney: {
      //pzFirstMoney为业务方总金额
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
      let rowId = this.$route.query.pzRowId;
      let pzId = this.voucherInfo.pzId;
      let voucherName = this.voucherInfo.voucherName;
      this.voucherInfo = val;
      if ((typeof rowId !== "string" || rowId.length === 0) && !this.isQuote) {
        this.voucherInfo.pzId = pzId;
        this.voucherInfo.voucherName = voucherName;
        delete this.voucherInfo.rowId;
      }
      if (this.voucherInfo) {
        if (this.voucherInfo.pzStatus === "DSH") {
          this.pzStatusText = "提交审核";
        } else if (this.voucherInfo.pzStatus === "YSH") {
          this.pzStatusText = "返审核";
        }
      }
    },
    voucherInfoInPzItemsParam(val, oldVal) {
      this.voucherInfoItems = val;
    }
  },
  created: function() {
    this.ckId = this.$route.query.ckId;
    this.ckName = this.$route.query.ckName;
    this.companyId = this.$route.query.companyId;

    this.voucherInfoItems[0].ckId = this.ckId;
    this.voucherInfoItems[0].ckName = this.ckName;

    let rowId = this.$route.query.pzRowId;
    if (typeof rowId !== "string" && !this.isQuote) {
      this.loadVoucherNum();
    }
  },
  methods: {
    loadVoucherNum() {
      let urlNum = "/zingbiz/resourceLibrary/voucher/getVoucherNumber";
      this.$http.get(urlNum, { params: { voucherType: "CW" } }).then(res => {
        //加载编号
        if (res.data.success) {
          this.voucherInfo.pzId = res.data.data.pzId;
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    },
    savePZ(operate) {
      for (let i = 0; i < this.voucherInfoItems.length; i++) {
        //imageListYW
        if (this.voucherInfoItems[i].imageListYW.length <= 0) {
          this.$vux.toast.text("请上传图片");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].pzSummary !== "string" ||
          this.voucherInfoItems[i].pzSummary.length === 0
        ) {
          this.$vux.toast.text("请填写摘要");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].pzPrice !== "string" ||
          this.voucherInfoItems[i].pzPrice.length === 0
        ) {
          this.$vux.toast.text("请填写金额");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].projectId !== "string" ||
          this.voucherInfoItems[i].projectId.length === 0
        ) {
          this.$vux.toast.text("请选择科目");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].ckId !== "string" ||
          this.voucherInfoItems[i].ckId.length === 0
        ) {
          this.$vux.toast.text("请选择财务库");
          return false;
        }
      }
      this.voucherInfo.pzBoradIdSpace = this.boradIdArr.join(" ");
      this.voucherInfo.pzCardIdSpace = this.cardIdArr.join(" ");
      this.voucherInfo.pzListIdSpace = this.listIdListArr.join(" ");
      this.voucherInfo.pzFirstMoney = this.pzFirstMoney;
      this.voucherInfo.operate = operate;
      this.voucherInfo.pzStatus = "WTJ";
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;

      let url = "/zingbiz/resourceLibrary/voucher/insertVoucherFinance";
      let rowId = this.$route.query.pzRowId;
      if (typeof rowId !== "undefined") {
        url = "/zingbiz/resourceLibrary/voucher/updateVoucher";
      }
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          if (operate === "SUBMIT") {
            //跳转发起审批页面
            this.$router.push({
              path: "/workflow/workflowMain",
              query: {
                pzRowId: res.data.data.rowId,
                voucherType: this.voucherInfo.voucherType,
                companyId: this.companyId,
                wfType: "MODULE_TYPE_ZYK"
              }
            });
          } else if (operate === "SAVE") {
            if (
              typeof this.$route.query.ckId === "string" &&
              this.$route.query.ckId.length > 0
            ) {
              this.$router.push({
                path: "/resourceLibrary/financeWarehouse/voucherEntranceList",
                query: {
                  ckId: this.ckId,
                  ckName: this.ckName,
                  companyId: this.companyId
                }
              });
            } else {
              this.$router.push({
                path: "/resourceLibrary/financeWarehouse/voucherList"
              });
            }
          }
        } else {
          this.$message({ type: "error", message: "保存失败，请重试" });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>