<template>
  <div>
    <zing-head :title="'查看凭证'" :isComeBack="false" @doSome="doSome"></zing-head>
    <div class="root-div vue-tab">
      <tab :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="ywShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <voucher-add-detail :isQuote="true" :voucherInfoParam="voucherInfoParam" :voucherInfoInPzItemsParam="voucherInfoInPzItemsParam"></voucher-add-detail>
      </div>
      <div v-show="shShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <voucher-add-examine :voucherInfoParam="voucherInfoParam" :voucherInfoOutPzItemsParam="voucherInfoOutPzItemsParam"></voucher-add-examine>
      </div>
    </div>
    <group>
      <flexbox>
        <flexbox-item>
          <x-button class="btn-common" type="primary" @click.native="quote()">引用</x-button>
        </flexbox-item>
      </flexbox>
    </group>
  </div>
</template>


<script>
import { Tab, TabItem, XButton, Popup } from "vux";
import VoucherAddDetail from "./voucherAddDetail";
import VoucherAddExamine from "./voucherAddExamine";
import VoucherAddRecord from "./voucherAddRecord";
import ZingHead from "@/components/zingHead/ZingHead";
import VoucherAddList from "./voucherAddList";
import VoucherFlowStateList from "./voucherFlowStateList";

export default {
  name: "financialManage",
  components: {
    XButton,
    Popup,
    Tab,
    TabItem,
    VoucherAddDetail,
    VoucherAddExamine,
    VoucherAddRecord,
    ZingHead,
    VoucherAddList,
    VoucherFlowStateList
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      tabTitle: ["业务", "审核"],
      defTab: "业务",
      ywShow: true,
      shShow: false,
      screenHeight: "0px",
      dialogShowCWList: false,
      dialogShowVoucher: false,
      voucherInfoParam: {},
      voucherInfoInPzItemsParam: [],
      voucherInfoOutPzItemsParam: [],
      cwkDatas: [],
      pzDatas: {},
      ckInfo: {},
      pzDatasForVS: {} //审核与财务页面凭证数据
    };
  },
  //钩子加载完触发
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 145;
  },
  methods: {
    chengeTab(index) {
      if (index === 0) {
        this.ywShow = true;
        this.shShow = false;
      } else {
        this.ywShow = false;
        this.shShow = true;
      }
    },
    doSome() {
      this.$emit("voucherAddQuoteBack");
    },
    quote() {
      this.$emit(
        "quote",
        this.voucherInfoParam,
        this.voucherInfoInPzItemsParam,
        this.voucherInfoOutPzItemsParam
      );
      console.info("aaaaaa");
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
          this.$message({ type: "error", message: "加载失败，请重试" });
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