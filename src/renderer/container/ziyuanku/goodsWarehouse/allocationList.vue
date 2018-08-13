<template>
  <div class="allocationList">
    <ZingHead :title="headTitle" :isComeBack="true" :doSome="showSearch">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
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
    </ZingHead>
    <!-- <div v-show="isShow">
      <search class="search" @on-cancel="onCancel" @on-change="getResult" @on-submit="onSubmit" ref="search"></search>
    </div> -->
    <search
      ref="search"
      class="searchStyle"
      :searchFlag="isShow"
      @cancelInput ="onCancel"
      @confirmInput="onSubmit"
    ></search>
    <tab>
      <tab-item selected @on-item-click="onItemClick">已审核</tab-item>
      <tab-item @on-item-click="onItemClick">未审核</tab-item>
    </tab>
    <div class="tab-content">
      <div v-if="voucherInfos.length > 0">
        <GridCard v-for="(item,index) in voucherInfos" :key="index">
          <div slot="cardLeft" class="left" @click="voucherItemClick(item)">
            <div class="left-wrapper">
              <div>{{item.ckName}} -> {{item.toCkName}}</div>
              <div>{{getFormatDate(item.genTime)}}</div>
              <div>调拨人：{{item.cardUserName}}</div>
            </div>
          </div>
        </GridCard>
      </div>
      <div v-else class="prompt">该状态下没有数据</div>
    </div>
  </div>
</template>
<script>
import Dropdown from "@/components/dropdown/Dropdown";
import GridCard from "@/components/gridcard/GridCard.vue";
import Avatar from "@/components/avatar/Avatar.vue";
import ZingHead from "@/components/zingHead/ZingHead.vue";
import Tag from "@/components/tag/Tag.vue";
import search from "@/components/search/search";
import { XDialog, Alert, Selector, Tab, TabItem, Group } from "vux";

export default {
  name: "allocationList",
  components: {
    Group,
    Selector,
    Tab,
    TabItem,
    Dropdown,
    GridCard,
    Avatar,
    ZingHead,
    search,
    Tag,
    XDialog,
    Alert
  },
  data() {
    return {
      pzStatusList: [
        { key: "YSH", value: "已审核" },
        { key: "DSH", value: "未审核" },
        { key: "FQ", value: "废弃" }
      ],
      resourceLibraryInfoList: [{ key: "all", value: "请选择物品库" }],
      defaultResourceLibraryInfo: "all",
      isShow: false,
      clickItem: {},
      currentIndex: 0,
      voucherInfos: []
    };
  },
  computed: {
    headTitle() {
      return "调拨";
    },
    datas() {
      let voucherType = this.$route.query.voucherType;
      let url = "/resourceLibrary/goodsWarehouse/allocationAddOrUpdate";

      return [
        {
          content: "新建调拨单",
          url
        }
      ];
    }
  },
  created() {
    this.loadVoucher("YSH");
  },
  methods: {
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    },
    onCancel() {
      this.isShow = false;
    },
    getResult(val) {
      //console.log(val);
    },
    onSubmit(val) {
      //console.log(val);
    },
    showSearch() {
      this.isShow = !this.isShow;
    },
    onItemClick(index) {
      if (index === 0) {
        this.loadVoucher("YSH");
      } else {
        this.loadVoucher("DSH");
      }
    },
    loadVoucher(status) {
      let params = {
        voucherType: "DBD",
        pzStatus: status,
        pageNumber: 0,
        pageSize: 2000
      };
      let that = this;
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/queryVoucher", {
          params
        })
        .then(function(response) {
          if (response.data.success) {
            that.voucherInfos = response.data.data;
          }
        });
    },
    voucherItemClick(val) {
      if (val.pzStatus === "YSH") {
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/allocationDetail",
          query: {
            rowId: val.rowId,
            companyId: this.$route.query.companyId
          }
        });
      } else {
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/allocationAddOrUpdate",
          query: {
            rowId: val.rowId,
            ckId: val.ckId,
            productId: val.productRowIds,
            voucherType: val.voucherType,
            companyId: this.$route.query.companyId
          }
        });
      }
    },
    getFormatDate(dateStr) {
      let arr = dateStr.split(" ");
      let dates = arr[0].split("-");
      return dates[0] + "年" + dates[1] + "月" + dates[2] + "日";
    }
    //查看审批流,暂时没有重构
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.allocationList {
  height: 100%;

  .search {
    position: relative !important;
  }

  .tab-content {
    height: calc(100% -94px);

    .left {
      font-size: 15px;
      line-height: 20px;
    }
  }

  .prompt {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #ff8000;
  }
}
</style>