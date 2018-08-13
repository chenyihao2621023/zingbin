<template>
  <div class="otherInOrOutExamine">
    <!--<scroll>-->
    <group label-width="4.5em" class="group-no-top-border">
      <x-input title="期间" v-model="pzPeriods" :show-clear="false" :disabled="true" placeholder=""></x-input>
      <selector title="凭证字<span style='color: red;'>*</span>" placeholder="请选择" :options="wordData" v-model="voucherInfo.pzWord"></selector>
      <x-input title="凭证号" v-model="voucherInfo.pzNo" :show-clear="true" :disabled="true" placeholder="凭证号提取后自增"></x-input>
      <x-input title="附件总数" v-model="voucherInfo.pzFileCount" :show-clear="false" :disabled="false" placeholder="请填写附件总数"></x-input>
      <x-input title="结算方式" v-model="voucherInfo.pzSettlementMethod" :show-clear="false" :disabled="false" placeholder="请填写结算方式"></x-input>
      <x-input title="结算号" v-model="voucherInfo.pzSettlementNumber" :show-clear="false" :disabled="false" placeholder="请填写结算号"></x-input>
      <x-input title="业务往来" v-model="voucherInfo.pzCurrentBusiness" :show-clear="false" :disabled="false" placeholder="请填写业务往来信息"></x-input>
      <x-input title="经办" v-model="voucherInfo.pzHaddingName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzHadding,'JB')" :disabled="true" placeholder="请选择经办人"></x-input>
      <x-input title="审核" v-model="voucherInfo.pzEexamineName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzEexamine,'SH')" :disabled="true" placeholder="请选择审核人"></x-input>
      <x-input title="过账" v-model="voucherInfo.pzPostingName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzPosting,'GZ')" :disabled="true" placeholder="请选择过账人"></x-input>
      <x-input title="出纳" v-model="voucherInfo.pzCashierName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzCashier,'CN')" :disabled="true" placeholder="请选择出纳人"></x-input>
      <x-input title="制单" v-model="voucherInfo.pzMakeFormName" :show-clear="false" @click.native="selectManDialog(voucherInfo.pzMakeForm,'ZD')" :disabled="true" placeholder="请选择制单人"></x-input>
    </group>

    <org-member-picker :initialSelected="initialSelected" :showTab="['colleague']" :showPicker="showMemberPicker" :multiple="false" @picked="getMemberPickedData" @abort="onMemberPickAbort"></org-member-picker>

    <div v-for="(item, index) in voucherInfoItems" :key="index">
      <group label-width="4.5em">
        <div slot="title" style="height: 32px;padding-top:2px">
          <i  v-if="voucherInfoItems.length > 1" class="iconfont icon-shanchu2" v-on:click="delEntry(index)" style="float: right;font-size: 30px;"></i>
        </div>
        <image-picker :files="item.imageListSH" :companyId="voucherInfo.companyId" selectable multiple @onChange="fliesChange(arguments,index)" @onImageClick="onImageClick" />
        <x-input title="业务描述" v-model="item.pzServiceDesc" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder="请选择业务描述"></x-input>
        <x-input title="科目代码<span style='color: red;'>*</span>" v-model="item.projectId" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder="请选择科目代码"></x-input>
        <x-input title="科目名称<span style='color: red;'>*</span>" v-model="item.projectName" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index)" placeholder="请选择科目名称"></x-input>
        <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" v-model="item.pzSummary" :readonly="disabled" placeholder=""></x-textarea>
        <x-input title="金额<span style='color: red;'>*</span>" v-model="item.pzAccount" :show-clear="false" :disabled="disabled" placeholder="0.00"></x-input>
      </group>
      <group class="vux-1px-b">
        <div style="float:left;line-height:45px;margin-left:13px;width: 4.5em;">借贷方向</div>
        <checker v-model="item.examineAspect" radio-required="true" type="radio" style="float:right;margin:5px 0px;"
            default-item-class="examineAspectItem"
            selected-item-class="examineAspectItem-selected"
            >
          <checker-item  value="借">借</checker-item>
          <checker-item  value="贷">贷</checker-item>
        </checker>
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
import ImagePicker from "components/imagepicker/ImagePicker";
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
  Radio,
  Checker,
  CheckerItem
} from "vux";
export default {
  name: "otherInOrOutExamine",
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
    ImagePicker,
    OrgMemberPicker,
    Selector,
    Radio,
    Checker,
    CheckerItem
  },
  props: ["voucherInfoParam", "voucherInfoOutPzItemsParam"],
  data() {
    return {
      pzPeriods: "", //期间
      wordData: [], //凭证字
      voucherType: "",
      voucherInfo: {
        pzWord: "", //所选凭证字
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
          pzAccount: "", //金额
          examineAspect: "贷", //借贷
          imageListSH: [], //表中为pzImgs字段
          projectId: "", //科目代码
          projectName: "", //科目名称
          projectPath: "", //科目地址
          pzServiceDesc: "", //业务描述
          pzSummary: "", //摘要
          pzType: "outPz",
          dataType: "WP",
          voucherType: this.voucherType,
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
          sum = (parseFloat(sum) + parseFloat(item.pzAccount)).toFixed(3);
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
    this.voucherType = this.$route.query.voucherType;
    let that = this;
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
        that.wordData = [];
        for (let i = 0; i < res.data.data.data.data.length; i++) {
          that.wordData.push({
            key: res.data.data.data.data[i].voucherId,
            value: res.data.data.data.data[i].voucherName
          });
        }
      } else {
        this.$vux.toast.show({
          text: "加载失败，请重试"
        });
      }
    });
  },
  methods: {
    addEntry() {
      //添加条目
      this.voucherInfoItems.push({
        pzCount: "",
        pzAccount: "", //金额
        examineAspect: "贷", //借贷
        imageListSH: [], //表中为pzImgs字段
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
        pzType: "outPz",
        dataType: "WP",
        voucherType: this.voucherType,
        pzImgs: ""
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
    //上传图片组件方法
    fliesChange(event, clickKMIndex) {
      let imgs = this.voucherInfoItems[clickKMIndex].imageListSH;
      imgs.forEach(img => {
        this.voucherInfoItems[clickKMIndex].pzImgs = img.url + " ";
      });
    },
    onImageClick(index, files) {
      //
    },
    SHSubmit() {
      //审核方提交方法
      /* for (let i = 0; i < this.voucherInfoItems.length; i++) {
        //imageListYW
        if (this.voucherInfoItems[i].imageListSH.length <= 0) {
          this.$vux.toast.show({
            text: "请上传图片"
          });
          return false;
        }
      } */
      this.voucherInfo.pzSecondMoney = this.pzSecondMoney;
      if (
        typeof this.voucherInfo.pzWord !== "string" ||
        this.voucherInfo.pzWord.trim() === 0
      ) {
        this.$vux.toast.show({
          text: "请选择凭证字"
        });
        return false;
      }
      let positiveInteger = /^\+?[1-9][0-9]*$/;
      if (
        typeof this.voucherInfo.pzFileCount != "undefined" &&
        this.voucherInfo.pzFileCount != null &&
        this.voucherInfo.pzFileCount.trim() !== ""
      ) {
        if (!positiveInteger.test(this.voucherInfo.pzFileCount)) {
          this.$vux.toast.text("附件总数必须为非零正整数");
          result = false;
        }
      }
      for (let i = 0; i < this.voucherInfoItems.length; i++) {
        if (
          typeof this.voucherInfoItems[i].projectId !== "string" ||
          this.voucherInfoItems[i].projectId.length === 0
        ) {
          this.$vux.toast.text("请选择科目");
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
          typeof this.voucherInfoItems[i].pzAccount !== "string" ||
          this.voucherInfoItems[i].pzAccount.length === 0
        ) {
          this.$vux.toast.text("请填写金额");
          return false;
        }
        let reg1 = /^[+-]?\d*\.?\d{0,3}$/;
        if (!reg1.test(this.voucherInfoItems[i].pzAccount)) {
          this.$vux.toast.text("金额必须是数字");
          result = false;
        }
      }
      if (
        parseFloat(this.voucherInfo.pzFirstMoney) !==
        parseFloat(this.voucherInfo.pzSecondMoney)
      ) {
        this.$vux.toast.text("业务方金额不等于审核方金额！");
        return false;
      }
      this.voucherInfo.withTrello = "true";
      this.voucherInfo.dataType = "WP";
      this.voucherInfo.voucherType = this.voucherType;
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;

      let url = "/zingbiz/resourceLibrary/voucher/updateVoucherInfo";
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          this.$router.push({
            path: "/workflow/showNode",
            query: {
              companyId: this.voucherInfo.companyId,
              workflow_id: this.voucherInfo.pzWorkId
            }
          });
        } else {
          this.$vux.toast.show({
            text: "保存失败，请重试"
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.otherInOrOutExamine {
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

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
}
</style>  
