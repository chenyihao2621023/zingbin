<template>
  <div>
    <group label-width="4.5em">
      <x-input title="编号" v-model="voucherInfo.pzId" :show-clear="false" :disabled="true" placeholder="" class="fontColor"></x-input>
      <x-input title="期间" v-model="voucherInfo.pzPeriods" :show-clear="false" :disabled="true" placeholder=""></x-input>
      <x-input title="科目代码" v-model="voucherInfo.ckProjectId" :show-clear="false" :disabled="true" placeholder=""></x-input>
      <x-input title="科目名称" v-model="voucherInfo.ckProjectName" :show-clear="false" :disabled="true" placeholder=""></x-input>
     </group>

    <group label-width="4.5em" v-for="(item, index) in voucherInfoItems" :key="index">
      <div slot="title" style="height: 32px;padding-top:2px">
        <i v-if="voucherInfoItems.length > 1" class="iconfont icon-shanchu2" v-on:click="delEntry(index)" style="float: right;font-size: 30px;"></i>
      </div>
      <x-textarea title="说明<span style='color: red;'>*</span>" placeholder="" v-model="item.pzSummary" class="fontColor"></x-textarea>
      <x-input title="金额<span style='color: red;'>*</span>" :show-clear="false" :disabled="disabled" placeholder="0.00" @on-change="calculateAccount" v-model="item.pzAccount" class="fontColor"></x-input>
    </group>
    <!-- 科目 -->
    <group v-if="!powerRole">
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button class="btn-save" type="primary" @click.native="addEntry">增加工资条</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button class="btn-common" type="primary" @click.native="savePZ('SAVE')">保存</x-button>
        </flexbox-item>
      </flexbox>
    </group>

    <div slot="content" class="card-demo-flex">
      <div>
        <span class="flex-span">{{voucherInfo.cheapAccount}}</span>
        <br/> 本月扣除
      </div>
      <div class="flex-child-div">
        <span class="flex-span">{{voucherInfo.pzFirstMoney}}</span>
        <br/> 实发工资
      </div>
    </div>

  </div>
</template>


<script>
import TaskSelection from "../../common/task/taskSelection";
import ZingHead from "@/components/zingHead/ZingHead";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import ImagePicker from "components/imagepicker/ImagePicker";
//import WarehouseList from "./warehouseList";
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
    TaskSelection,
    ZingHead,
    ImagePicker,
    SubjectPicker
    //WarehouseList
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
      voucherInfo: {
        pzId: "",
        voucherName: "",
        pzType: "inSalary",
        withTrello: "true",
        pzStatus: "",
        voucherType: "CW",
        dataType: "CW"
      }, //凭证数据
      voucherInfoItems: [
        {
          rowId: "",
          pzCount: "",
          pzImgs: "",
          pzPrice: "", //金额
          pzAccount: "",
          projectId: "", //科目代码
          projectName: "", //科目名称
          projectPath: "", //科目地址
          pzServiceDesc: "", //业务描述
          pzSummary: "", //摘要
          pzType: "inSalary",
          dataType: "CW",
          voucherType: "CW"
        }
      ],
      renWuData: [], //任务列表
      disabled: false //是否可修改
    };
  },
  computed: {},
  watch: {
    voucherInfoParam(val, oldVal) {
      this.voucherInfo = val;
    },
    voucherInfoInPzItemsParam(val, oldVal) {
      this.voucherInfoItems = val;
    }
  },
  created: function() {},
  methods: {
    calculateAccount() {
      let pzFirstMoney = 0;
      let cheapAccount = 0;
      this.voucherInfoItems.forEach(element => {
        var reg = /^(-?\d+)(\.\d{1,3})?$/;
        if (reg.test(element.pzAccount)) {
          pzFirstMoney += parseFloat(element.pzAccount);
          if (/^(-{1})/.test(element.pzAccount)) {
            cheapAccount += parseFloat(element.pzAccount);
          }
        }
        this.voucherInfo.cheapAccount = cheapAccount;
        this.voucherInfo.pzFirstMoney = pzFirstMoney;
      });
    },
    addEntry() {
      //添加一组条目
      this.voucherInfoItems.push({
        rowId: "",
        pzCount: "",
        imageListYW: [], //图片列表,pzImgs
        pzImgs: "",
        pzPrice: "", //金额
        pzAccount: "",
        projectId: this.voucherInfo.ckProjectId, //科目代码
        projectName: this.voucherInfo.ckProjectName, //科目名称
        projectPath: this.voucherInfo.ckProjectPath, //科目地址
        pzServiceDesc: this.voucherInfo.pzServiceDesc, //业务描述
        pzSummary: "", //摘要
        pzType: "inSalary",
        dataType: "CW",
        voucherType: "CW"
      });
    },
    delEntry(val) {
      let _this = this;
      //删除一组条目
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          //删除一组条目
          if (_this.voucherInfoItems.length > 1) {
            _this.voucherInfoItems.splice(val, 1);
            _this.calculateAccount();
          }
        }
      });
    },
    savePZ(operate) {
      let msg = "";
      let flag = true;
      for (let i = 0; i < this.voucherInfoItems.length; i++) {
        let item = this.voucherInfoItems[i];
        if (
          typeof item.pzSummary === "undefined" ||
          item.pzSummary === null ||
          item.pzSummary.trim().length === 0
        ) {
          flag = false;
          msg = "说明不能为空！";
          break;
        }
        if (typeof item.pzAccount === "undefined" || item.pzAccount === null) {
          flag = false;
          msg = "金额不能为空！";
          break;
        }
        var reg = /^(-?\d+)(\.\d{1,3})?$/;
        if (!reg.test(item.pzAccount)) {
          flag = false;
          msg = "金额只能为数字且最多保留3位小数！";
        }
      }
      if (!flag) {
        this.$vux.toast.text(msg);
        return;
      }
      this.voucherInfo.operate = operate;
      this.voucherInfo.pzStatus = "YSH";
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;

      let url = "/zingbiz/resourceLibrary/voucher/updateVoucher";
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          this.$router.go(-1);
        } else {
          this.$message({ type: "error", message: "保存失败，请重试" });
        }
      });
    }
  }
};
</script>

<style scoped>
.flex-span {
  color: #ff8000;
  font-size: 30px !important;
}

.flex-child-div {
  border-left: 1px solid;
  border-color: #7e8c8d;
}

.card-demo-flex {
  display: flex;
  padding: 10px 0;
  margin-top: 18px;
  background-color: #ffffff;
}

.card-demo-flex > div {
  flex: 2;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
}
</style>