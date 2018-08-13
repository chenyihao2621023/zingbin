<template>
  <div class="voucherEntranceList">
    <zing-head :title="headTitle">
    </zing-head> 
    
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
        <div class="tabDiv" v-show="auditedListShow">
          <housing-order-state-list  pzStatus="YSH"></housing-order-state-list>
        </div>
        <div class="tabDiv" v-show="unauditedListShow">
          <housing-order-state-list pzStatus="DSH"></housing-order-state-list>
        </div>
        <div class="tabDiv" v-show="unsubmittedShow ">
          <housing-order-state-list pzStatus="WTJ"></housing-order-state-list>
        </div>
        <div class="tabDiv" ref="discardedRef" v-show="discardedListShow">
          <housing-order-state-list pzStatus="FQ"></housing-order-state-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Group, Datetime, XButton, Popup } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import HousingOrderStateList from "./housingOrderStateList";
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
    HousingOrderStateList,
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
      reduceHeight: "53",
      tabTitle: ["已审核", "未审核", "未提交", "废弃"],
      defTab: "已审核",
      auditedListShow: true,
      unauditedListShow: false,
      unsubmittedShow: false,
      discardedListShow: false,
      headTitle: "订房订单"
    };
  },
  //钩子加载完触发
  created: function() {},
  methods: {
    chengeTab(index) {
      if (index === 0) {
        this.auditedListShow = true;
        this.unauditedListShow = false;
        this.unsubmittedShow = false;
        this.discardedListShow = false;
      } else if (index === 1) {
        this.auditedListShow = false;
        this.unauditedListShow = true;
        this.unsubmittedShow = false;
        this.discardedListShow = false;
      } else if (index === 2) {
        this.auditedListShow = false;
        this.unauditedListShow = false;
        this.unsubmittedShow = true;
        this.discardedListShow = false;
      } else {
        this.auditedListShow = false;
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
        flex: 0 0 25%;
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