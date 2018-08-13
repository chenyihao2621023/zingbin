<template>
  <div class="voucherEntranceList">
    <zing-head :title="headTitle">
      <div slot="header-right">
        <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head> 
    <popup v-model="searchPop" height="180px" is-transparent>
      <div style="width: 95%;background-color:#fff;height:170px;font-size:17px;margin:0 auto;border-radius:5px;padding-top:20px;">
        <datetime title="起始日期" v-model="startDate" ></datetime>
        <datetime title="截止日期" v-model="endDate" ></datetime>
        <div style="padding:20px 13px 10px 13px;">
          <x-button class="btn-common" @click.native="query" type="primary">确定</x-button>
        </div>
      </div>
    </popup>
    <!-- <group>
      <datetime-range title="截至日期" start-date="1970-01-01" end-date="2017-02-02" :format="$t('daterange-format')" v-model="value" @on-change="onChange"></datetime-range>
    </group> -->
    <div class="inner" :style="{ height: 'calc(100% - '+reduceHeight+'px)'}">
      <div class="vue-tab">
        <tab class="" :line-width="2">
          <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab(index)" @click="defTab = item" :key="index">{{item}}
          </tab-item>
        </tab>
      </div>

      <div class="tab-content">
        <div class="tabDiv"  v-show="auditedListShow">
          <voucher-flow-state-list ref="auditedRef" :ckId="ckId" pzStatus="YSH"></voucher-flow-state-list>
        </div>
        <div class="tabDiv"  v-show="collectedShow">
          <voucher-flow-state-list ref="collectedRef" :ckId="ckId" pzStatus="YHZ"></voucher-flow-state-list>
        </div>    
        <div class="tabDiv" ref="unauditedRef" v-show="unauditedListShow">
          <voucher-flow-state-list :ckId="ckId" pzStatus="DSH"></voucher-flow-state-list>
        </div>
        <div class="tabDiv" ref="unsubmittedRef" v-show="unsubmittedShow ">
          <voucher-flow-state-list :ckId="ckId" pzStatus="WTJ"></voucher-flow-state-list>
        </div>
        <div class="tabDiv" ref="discardedRef" v-show="discardedListShow">
          <voucher-flow-state-list :ckId="ckId" pzStatus="FQ"></voucher-flow-state-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, Datetime, XButton, Popup } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import VoucherFlowStateList from "./voucherFlowStateList";
import Dropdown from "@/components/dropdown/Dropdown";
import Search from "@/components/search/search.vue";
import { parse } from "path";

export default {
  name: "voucherEntranceList",
  components: {
    Tab,
    TabItem,
    Search,
    ZingHead,
    VoucherFlowStateList,
    Dropdown,
    Group,
    Datetime,
    XButton,
    Popup
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      searchPop: false,
      reduceHeight: "53",
      tabTitle: ["已审核", "已汇总", "未审核", "未提交", "废弃"],
      defTab: "已审核",
      auditedListShow: true,
      collectedShow: false,
      unauditedListShow: false,
      unsubmittedShow: false,
      discardedListShow: false,
      headTitle: "",
      datas: [
        {
          content: "新建凭证",
          url:
            "/resourceLibrary/financeWarehouse/voucherAdd?ckId=" +
            this.$route.query.ckId +
            "&ckName=" +
            this.$route.query.ckName +
            "&companyId=" +
            this.$route.query.companyId
        }
      ]
    };
  },
  //钩子加载完触发
  created: function() {
    this.ckId = this.$route.query.ckId;
    this.headTitle = this.$route.query.ckName;
  },
  methods: {
    search() {
      this.searchPop = !this.searchPop;
    },
    chengeTab(index) {
      if (index === 0) {
        this.auditedListShow = true;
        this.collectedShow = false;
        this.unauditedListShow = false;
        this.unsubmittedShow = false;
        this.discardedListShow = false;
      } else if (index === 1) {
        this.auditedListShow = false;
        this.collectedShow = true;
        this.unauditedListShow = false;
        this.unsubmittedShow = false;
        this.discardedListShow = false;
      } else if (index === 2) {
        this.auditedListShow = false;
        this.collectedShow = false;
        this.unauditedListShow = true;
        this.unsubmittedShow = false;
        this.discardedListShow = false;
      } else if (index === 3) {
        this.auditedListShow = false;
        this.collectedShow = false;
        this.unauditedListShow = false;
        this.unsubmittedShow = true;
        this.discardedListShow = false;
      } else {
        this.auditedListShow = false;
        this.collectedShow = false;
        this.unauditedListShow = false;
        this.unsubmittedShow = false;
        this.discardedListShow = true;
      }
    },
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
      if (data.method) {
        this.$emit(data.method);
      }
    },
    query() {
      if (this.auditedListShow) {
        this.$refs.auditedRef.loadVoucher(this.startDate, this.endDate);
      } else if (this.collectedShow) {
        this.$refs.collectedRef.loadVoucher(this.startDate, this.endDate);
      } else if (this.unauditedListShow) {
        this.$refs.unauditedRef.loadVoucher(this.startDate, this.endDate);
      } else if (this.unsubmittedShow) {
        this.$refs.unsubmittedRef.loadVoucher(this.startDate, this.endDate);
      } else {
        this.$refs.discardedRef.loadVoucher(this.startDate, this.endDate);
      }
      this.startDate = "";
      this.endDate = "";
      this.searchPop = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/variable.styl';

.voucherEntranceList {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fbf9fe;

  .inner {
    .vue-tab {
      flex-shrink: 0;

      .vux-tab-item {
        flex: 0 0 20%;
      }
    }

    .tab-content {
      flex-grow: 1;
      height: calc(100% - 44px);
      background-color: #fff;

      .tabDiv {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>