<template>
  <div class="otherInOrOutlist">
    <ZingHead :title="headTitle" :isComeBack="!isReferenced" @doSome="doSome">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span class="header-jiahao" v-show="isShowOptions">
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
    <group>
      <flexbox class="searchParamDiv" v-show="!isReferenced">
        <flexbox-item>
          <selector ref="defaultResourceLibraryRef" :options="resourceLibraryInfoList" v-model="defaultResourceLibraryInfo" @on-change="loadVoucherInfos"></selector>
        </flexbox-item>
        <flexbox-item>
          <selector ref="defaultPzStatusRef" :options="pzStatusList" v-model="defaultPzStatus" @on-change="loadVoucherInfos"></selector>
        </flexbox-item>
      </flexbox>
    </group>
    <div v-if="voucherInfos.length > 0" style="height:calc(100% - 94px)" class="scroll-list-wrap">
      <scroll ref="scroll" :scrollbar="true" :startY="0">
        <GridCard v-for="(item,index) in voucherInfos" :key="index">
          <div slot="cardLeft" class="left" @click="voucherItemClick(item)">
            <avatar :src="item.pzShowImg"></avatar>
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.pzId}}</p>
              <div class="left-wrapper-desc">金额：{{item.pzFirstMoney}}</div>
            </div>
          </div>
          <div slot="cardRight" class="right">
            <i class="iconfont icon-gengduo" @click="mask(item,index)"></i>
            <div class="tag-wrapper">
              <!-- <tag type="success">凭证未提交</tag> -->
            </div>
          </div>
        </GridCard>
      </scroll>
    </div>
    <div v-else class="prompt">该状态下没有数据</div>
  </div>
</template>
<script>
import Dropdown from "@/components/dropdown/Dropdown";
import GridCard from "@/components/gridcard/GridCard.vue";
import Scroll from "@/components/scroll/Scroll";
import Avatar from "@/components/avatar/Avatar.vue";
import ZingHead from "@/components/zingHead/ZingHead.vue";
import Search from "@/components/search/search";
import Tag from "@/components/tag/Tag.vue";
import { XDialog, Alert, Selector, Flexbox, FlexboxItem, Group } from "vux";

export default {
  name: "otherInOrOutlist",
  components: {
    Group,
    Selector,
    Flexbox,
    FlexboxItem,
    Dropdown,
    GridCard,
    Avatar,
    ZingHead,
    Search,
    Tag,
    XDialog,
    Alert,
    Scroll
  },
  data() {
    return {
      pzStatusList: [
        { key: "YSH", value: "已审核" },
        { key: "DSH", value: "未审核" },
        { key: "WTJ", value: "未提交" },
        { key: "FQ", value: "废弃" }
      ],
      defaultPzStatus: "YSH",
      resourceLibraryInfoList: [{ key: "all", value: "请选择物品库" }],
      defaultResourceLibraryInfo: "all",
      isShow: false,
      clickItem: {},
      currentIndex: 0,
      voucherInfos: []
    };
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    voucherTypeParam: {
      type: String,
      default: function() {
        return "";
      }
    },
    ckIdParam: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  computed: {
    isShowOptions() {
      let voucherType = this.$route.query.voucherType;
      return !this.isReferenced && "saleSend" !== voucherType;
    },
    headTitle() {
      let title = "";
      let voucherType = this.$route.query.voucherType;
      if (this.isReferenced) {
        voucherType = this.voucherTypeParam;
      }
      switch (voucherType) {
        case "buyIn":
          title = "采购入库单";
          break;
        case "buyBack":
          title = "采购退货单";
          break;
        case "saleOut":
          title = "销售订单";
          break;
        case "saleBack":
          title = "销售退货单";
          break;
        default:
          title = "销售发货单";
      }
      return title;
    },
    datas() {
      let voucherType = this.$route.query.voucherType;
      if (this.isReferenced) {
        voucherType = this.voucherTypeParam;
      }
      let url =
        "/resourceLibrary/invoicing/addOrUpdate?pageStatus=add&voucherType=" +
        voucherType;

      let content = "";
      switch (voucherType) {
        case "buyIn":
          content = "新建采购入库单";
          break;
        case "buyBack":
          content = "新建采购退货单";
          break;
        case "saleOut":
          content = "新建销售订单";
          break;
        case "saleBack":
          content = "新建销售退货单";
          break;
        default:
          content = "新建销售发货单";
      }

      return [
        {
          content,
          url
        }
      ];
    }
  },
  created() {
    this.selCkInfo();
  },
  methods: {
    doSome() {
      if (this.isReferenced) {
        this.$emit("invoicingListBack");
      }
    },
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    },
    onCancel() {
      this.isShow = false;
    },
    onSubmit(val) {
      console.log(val);
    },
    showSearch() {
      this.isShow = !this.isShow;
    },
    loadVoucherInfos() {
      let voucherType = this.$route.query.voucherType;
      if (this.isReferenced) {
        voucherType = this.voucherTypeParam;
        this.defaultResourceLibraryInfo = this.ckIdParam;
      } else if (this.defaultResourceLibraryInfo === "all") {
        return;
      }
      let that = this;
      let params = {
        ckId: this.defaultResourceLibraryInfo,
        pzStatus: this.defaultPzStatus,
        voucherType,
        pageNumber: 0,
        pageSize: 2000
      };
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
      if (this.isReferenced) {
        this.$emit("invoicingItemClick", val);
      } else {
        this.$router.push({
          path: "/resourceLibrary/invoicing/invoicingVoucherDetail",
          query: {
            rowId: val.rowId,
            voucherType: val.voucherType,
            companyId: this.$route.query.companyId
          }
        });
      }
    },
    mask(rowData, index) {
      this.clickItem = rowData;
      this.currentIndex = index;

      let _this = this;
      let menus = {};
      if (this.clickItem.pzStatus !== "WTJ") {
        menus.flow = "查看审批流";
      }
      if (
        this.clickItem.pzStatus === "WTJ" ||
        this.clickItem.pzStatus === "FQ"
      ) {
        menus.delete = "删除凭证";
      }

      this.$vux.actionsheet.show({
        menus,
        onMenuClick(text, key) {
          switch (key) {
            case "flow":
              _this.lookFlow();
              break;
            case "delete":
              _this.deleteVoucher();
              break;
          }
          this.show = false;
        }
      });
    },
    //查看审批流,暂时没有重构
    lookFlow() {
      const pzWorkId = this.clickItem.pzWorkId;
      const companyId = this.clickItem.companyId;
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
    },
    deleteVoucher() {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.$http
            .get("/zingbiz/resourceLibrary/voucher/deleteVoucherInfo", {
              params: {
                pzRowId: _this.clickItem.rowId
              }
            })
            .then(function(response) {
              if (response.data.success) {
                _this.voucherInfos.splice(_this.currentIndex, 1);
              }
            });
        }
      });
    },
    selCkInfo() {
      let params = {
        pageNumber: 0,
        pageSize: 2000,
        ckTypeStrs: "WP"
      };
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/select";
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          if (res.data.success) {
            let ckDatas = res.data.data.data;
            if (ckDatas.length > 0) {
              let defaultCkId = "";
              this.resourceLibraryInfoList = [];
              ckDatas.forEach(item => {
                defaultCkId += item.rowId + "#";
                this.resourceLibraryInfoList.push({
                  key: item.rowId,
                  value: item.ckName
                });
              });
              defaultCkId = defaultCkId.substring(0, defaultCkId.length - 1);

              this.resourceLibraryInfoList.unshift({
                key: defaultCkId,
                value: "全部物品库"
              });

              this.defaultResourceLibraryInfo = defaultCkId;
            }
            // this.resourceLibraryInfoList;
          } else {
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.otherInOrOutlist {
  height: 100%;
  overflow: auto;

  .search {
    position: relative !important;
  }

  .searchParamDiv {
    .weui-cell {
      select {
        direction: ltr;
      }

      .weui-select {
        padding-left: 0px;
      }
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