<template>
  <div class="otherInOrOut">
    <zing-head :title="headTitle"></zing-head>
    <div class="vue-tab">
      <tab class="" :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
    </div>

    <div class="tab-content">
      <div class="tabDiv" v-show="ywShow">
        <other-in-or-out-voucher :showHead="false" :voucherInfoParam="voucherInfoParam" :voucherInfoInPzItemsParam="voucherInfoInPzItemsParam"></other-in-or-out-voucher>
      </div>
      <div class="tabDiv" v-show="shShow">
        <other-in-or-out-examine :voucherInfoParam="voucherInfoParam" :voucherInfoOutPzItemsParam="voucherInfoOutPzItemsParam"></other-in-or-out-examine>
      </div>
      <div class="tabDiv" v-show="pzShow">
        <other-in-or-out-record></other-in-or-out-record>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import OtherInOrOutVoucher from "./otherInOrOutVoucher";
import OtherInOrOutExamine from "./otherInOrOutExamine";
import OtherInOrOutRecord from "./otherInOrOutRecord";

export default {
  name: "otherInOrOut",
  components: {
    Tab,
    TabItem,
    ZingHead,
    OtherInOrOutVoucher,
    OtherInOrOutExamine,
    OtherInOrOutRecord
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      tabTitle: ["业务", "审核", "凭证记录"],
      defTab: "业务",
      ywShow: true,
      shShow: false,
      pzShow: false,
      headTitle: "",
      pageStatus: "",
      voucherInfoParam: {},
      voucherInfoInPzItemsParam: [],
      voucherInfoOutPzItemsParam: []
    };
  },
  //钩子加载完触发
  created: function() {
    this.pageStatus = this.$route.query.pageStatus;
    if (this.$route.query.voucherType === "otherIn") {
      this.headTitle = "其他入库单";
    } else {
      this.headTitle = "其他出库单";
    }
    let rowId = this.$route.query.pzRowId;
    if (typeof rowId !== "undefined") {
      this.loadVoucherDetail(rowId);
    }
  },
  methods: {
    chengeTab(index) {
      if (index === 0) {
        this.ywShow = true;
        this.shShow = false;
        this.pzShow = false;
      } else if (index === 1) {
        this.ywShow = false;
        this.shShow = true;
        this.pzShow = false;
      } else {
        this.ywShow = false;
        this.shShow = false;
        this.pzShow = true;
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
              if (item.pzType === "inPz") {
                this.$set(this.voucherInfoInPzItemsParam, inIndex, item);
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
          this.$message({ type: "error", message: "加载失败，请重试" });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/variable.styl';

.otherInOrOut {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fbf9fe;

  .vue-tab {
    flex-shrink: 0;
  }

  .tab-content {
    flex-grow: 1;
    height: calc(100% - 94px);

    .tabDiv {
      height: 100%;
    }
  }
}
</style>