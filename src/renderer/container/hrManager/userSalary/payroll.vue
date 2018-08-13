<template>
  <div>
    <zing-head :title="'工资单'"></zing-head>
    <div class="root-div vue-tab">
      <tab :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="personnelShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <payroll-employee :voucherInfoParam="voucherInfoParam" :voucherInfoInPzItemsParam="voucherInfoInPzItemsParam"></payroll-employee>
      </div>
      <div v-show="employeeShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <payroll-personnel :voucherInfoParam="voucherInfoParam" :voucherInfoOutPzItemsParam="voucherInfoOutPzItemsParam"></payroll-personnel>
      </div>
    </div>
  </div>
</template>


<script>
import { Tab, TabItem, XButton, Popup } from "vux";
import PayrollEmployee from "@/container/hrManager/userSalary/payrollEmployee";
import PayrollPersonnel from "@/container/hrManager/userSalary/payrollPersonnel";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";

export default {
  name: "financialManage",
  components: {
    XButton,
    Popup,
    Tab,
    TabItem,
    ZingHead,
    Dropdown,
    PayrollEmployee,
    PayrollPersonnel
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      tabTitle: ["员工", "人事"],
      defTab: "员工",
      personnelShow: true,
      employeeShow: false,
      screenHeight: "0px",
      voucherInfoParam: {},
      voucherInfoInPzItemsParam: [],
      voucherInfoOutPzItemsParam: []
    };
  },
  //钩子加载完触发
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 95;
    let rowId = this.$route.query.pzRowId;
    if (typeof rowId !== "undefined") {
      this.loadVoucherDetail(rowId, false);
    }
  },
  methods: {
    handleMenu() {
      this.voucherQuoteList();
    },
    chengeTab(index) {
      if (index === 0) {
        this.personnelShow = true;
        this.employeeShow = false;
      } else {
        this.personnelShow = false;
        this.employeeShow = true;
      }
    },
    loadVoucherDetail(rowId) {
      let urlNum = "/zingbiz/resourceLibrary/voucher/selectVoucherInfoById";
      var params = {
        rowId
      };
      this.$http.get(urlNum, { params }).then(res => {
        //加载编号
        if (res.data.success) {
          let voucherInfo = res.data.data;
          if (
            typeof voucherInfo.pzHadding === "string" &&
            voucherInfo.pzHadding.length > 0
          ) {
            voucherInfo.pzHaddingName = voucherInfo.pzHadding.split("#")[1];
          }
          if (
            typeof voucherInfo.pzEexamine === "string" &&
            voucherInfo.pzEexamine.length > 0
          ) {
            voucherInfo.pzEexamineName = voucherInfo.pzEexamine.split("#")[1];
          }
          if (
            typeof voucherInfo.pzPosting === "string" &&
            voucherInfo.pzPosting.length > 0
          ) {
            voucherInfo.pzPostingName = voucherInfo.pzPosting.split("#")[1];
          }
          if (
            typeof voucherInfo.pzCashier === "string" &&
            voucherInfo.pzCashier.length > 0
          ) {
            voucherInfo.pzCashierName = voucherInfo.pzCashier.split("#")[1];
          }
          if (
            typeof voucherInfo.pzMakeForm === "string" &&
            voucherInfo.pzMakeForm.length > 0
          ) {
            voucherInfo.pzMakeFormName = voucherInfo.pzMakeForm.split("#")[1];
          }
          this.voucherInfoParam = voucherInfo;
          let items = res.data.data.voucherInfoItems;
          if (items.length > 0) {
            let inIndex = 0;
            let outIndex = 0;
            for (let i = 0; i < items.length; i++) {
              let item = items[i];
              if (item.pzType === "inSalary") {
                this.$set(this.voucherInfoInPzItemsParam, inIndex, item);
                this.$set(
                  this.voucherInfoInPzItemsParam[inIndex],
                  "imageListYW",
                  []
                );
                if (typeof item.pzImgs === "string" && item.pzImgs.length > 0) {
                  item.pzImgs.split(" ").forEach((img, imgIndex) => {
                    if (img.trim().length > 0) {
                      this.$set(
                        this.voucherInfoInPzItemsParam[inIndex].imageListYW,
                        imgIndex,
                        {
                          url: img
                        }
                      );
                    }
                  });
                }
                inIndex++;
              } else {
                this.$set(this.voucherInfoOutPzItemsParam, outIndex, item);
                this.$set(
                  this.voucherInfoOutPzItemsParam[outIndex],
                  "imageListSH",
                  []
                );
                if (typeof item.pzImgs === "string" && item.pzImgs.length > 0) {
                  item.pzImgs.split(" ").forEach((img, imgIndex) => {
                    if (img.trim().length > 0) {
                      this.$set(
                        this.voucherInfoOutPzItemsParam[outIndex].imageListSH,
                        imgIndex,
                        {
                          url: img
                        }
                      );
                    }
                  });
                }
                outIndex++;
              }
            }
          }
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';

.root-div {
  height: 100%;
  background: #fbf9fe;
}

.cw-div {
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>