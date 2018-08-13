<template>
  <div>
    <zing-head :title="'财务凭证'">
      <div slot="header-right" v-if="voucherInfoParam.voucherType ==='CW'">
        <span v-if="voucherInfoParam.pzStatus && voucherInfoParam.pzStatus!=='WTJ'" @click="lookFlow" style="font-size:14px;color:#40affc">
          查看审批流
          <i style="font-size:14px" class="iconfont icon-arrow-right"></i>
        </span>
        <span v-else class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <div class="root-div vue-tab">
      <tab :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="ywShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <voucher-add-detail :voucherInfoParam="voucherInfoParam" :code2Suject="code2Suject" :voucherInfoInPzItemsParam="voucherInfoInPzItemsParam"></voucher-add-detail>
      </div>
      <div v-show="shShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <voucher-add-examine :voucherInfoParam="voucherInfoParam" :code2Suject="code2Suject" :voucherInfoOutPzItemsParam="voucherInfoOutPzItemsParam"></voucher-add-examine>
      </div>
      <div v-show="pzShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <voucher-add-record></voucher-add-record>
      </div>
    </div>
    <popup v-model="voucherQuoteListShow" style="background-color:#fff" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <voucher-flow-state-list :isChoose="true" @voucherListItemClick="voucherListItemClick" @voucherListBack="voucherListBack" :showHead="true" pzStatus="YSH"></voucher-flow-state-list>
    </popup>
    <popup v-model="voucherQuoteDetailShow" style="background-color:#fff" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <voucher-add-quote ref="voucherAddQuoteRef" @quote="quote" @voucherAddQuoteBack="voucherAddQuoteBack"></voucher-add-quote>
    </popup>
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
import VoucherAddQuote from "./voucherAddQuote";
import Dropdown from "@/components/dropdown/Dropdown";

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
    VoucherFlowStateList,
    VoucherAddQuote,
    Dropdown
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      datas: [{ content: "引用" }],
      tabTitle: ["业务", "审核", "凭证记录"],
      defTab: "业务",
      ywShow: true,
      shShow: false,
      pzShow: false,
      screenHeight: "0px",
      voucherQuoteListShow: false,
      voucherQuoteDetailShow: false,
      code2Suject: {},
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
    this.screenHeight = document.documentElement.clientHeight - 94;
    let rowId = this.$route.query.pzRowId;
    let voucherType = this.$route.query.voucherType;
    if (typeof voucherType === "string" && voucherType.trim().length > 0) {
      this.voucherInfoParam.voucherType = voucherType;
    } else {
      this.voucherInfoParam.voucherType = "CW";
    }
    if (typeof rowId !== "undefined") {
      this.loadVoucherDetail(rowId, false);
    }
    this.loadSubjectWithCurrency();
  },
  methods: {
    handleMenu() {
      this.voucherQuoteList();
    },
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
    voucherListBack() {
      this.voucherQuoteListShow = false;
    },
    voucherListItemClick(item) {
      this.voucherQuoteDetailShow = true;
      this.voucherQuoteListShow = false;
      this.$refs.voucherAddQuoteRef.loadVoucherDetail(item.rowId);
    },
    loadSubjectWithCurrency() {
      let urlNum = "/zingbiz/finance/subject/findSubjectWithCurrency";
      var params = {};
      this.$http.get(urlNum, { params }).then(res => {
        res.data.data.forEach(item => {
          this.code2Suject[item.subjectCode] = item;
        });
      });
    },
    quote(
      voucherInfoParam,
      voucherInfoInPzItemsParam,
      voucherInfoOutPzItemsParam
    ) {
      this.voucherInfoParam = voucherInfoParam;
      this.voucherInfoParam.pzStatus = "WTJ";

      this.voucherInfoInPzItemsParam = voucherInfoInPzItemsParam;
      this.voucherInfoOutPzItemsParam = voucherInfoOutPzItemsParam;
      this.voucherQuoteDetailShow = false;
    },
    voucherAddQuoteBack() {
      this.voucherQuoteDetailShow = false;
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
              item.pzOriginalAccount = item.pzOriginalAccount
                ? item.pzOriginalAccount
                : "";
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
            console.info(
              this.voucherInfoInPzItemsParam,
              this.voucherInfoOutPzItemsParam
            );
          }
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    },
    voucherQuoteList() {
      this.voucherQuoteListShow = true;
    },
    lookFlow() {
      const pzWorkId = this.voucherInfoParam.pzWorkId;
      const companyId = this.voucherInfoParam.companyId;
      if (pzWorkId) {
        // this.$router.push();
        this.$router.push({
          path: "/workflow/showNode",
          query: {
            companyId: companyId,
            workflow_id: pzWorkId
          }
        });
      }
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