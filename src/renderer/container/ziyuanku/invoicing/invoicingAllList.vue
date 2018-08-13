<template>
  <div class="invoicingAllList">
    <ZingHead :title="headTitle" :isComeBack="true" :doSome="showSearch">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
          <i class="iconfont icon-fangdajing"></i>
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
      <flexbox gutter="0" class="searchParamDiv">
        <flexbox-item>
          <selector ref="defaultVoucherTypeRef" :options="voucherTypeList" @on-change="loadVoucherInfos" v-model="defaultVoucherType"></selector>
        </flexbox-item>
        <flexbox-item>
          <selector ref="defaultResourceLibraryRef" :options="resourceLibraryInfoList" @on-change="loadVoucherInfos" v-model="defaultResourceLibraryInfo"></selector>
        </flexbox-item>
        <flexbox-item>
          <selector ref="defaultPzStatusRef" :options="pzStatusList" @on-change="loadVoucherInfos" v-model="defaultPzStatus"></selector>
        </flexbox-item>
      </flexbox>
    </group>
    <div v-if="voucherInfos.length > 0" style="height:calc(100% - 94px);overflow:auto;">
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
    </div>
    <div v-else class="prompt">该状态下没有数据</div>
  </div>
</template>
<script>
import Dropdown from "@/components/dropdown/Dropdown";
import GridCard from "@/components/gridcard/GridCard.vue";
import Avatar from "@/components/avatar/Avatar.vue";
import ZingHead from "@/components/zingHead/ZingHead.vue";
import search from "@/components/search/search";
import Tag from "@/components/tag/Tag.vue";
import { XDialog, Alert, Selector, Flexbox, FlexboxItem, Group } from "vux";

export default {
  name: "invoicingAllList",
  components: {
    Group,
    Selector,
    Flexbox,
    FlexboxItem,
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
        { key: "WTJ", value: "未提交" },
        { key: "FQ", value: "废弃" }
      ],
      voucherTypeList: [
        { key: "", value: "请选择单据" },
        /* { key: "otherIn", value: "其他入库单" },
        { key: "otherOut", value: "其他出库单" }, */
        { key: "buyIn", value: "采购入库单" },
        { key: "buyBack", value: "采购退货单" },
        { key: "saleOut", value: "销售订单" },
        { key: "saleBack", value: "销售退货单" },
        { key: "saleSend", value: "销售发货单" }
      ],
      resourceLibraryInfoList: [{ key: "all", value: "选择物品库" }],
      defaultPzStatus: "YSH",
      defaultVoucherType: "",
      defaultResourceLibraryInfo: "all",
      isShow: false,
      clickItem: {},
      currentIndex: 0,
      voucherInfos: []
    };
  },
  computed: {
    headTitle() {
      return "单据查询";
    }
  },
  created() {
    this.selCkInfo();
  },
  methods: {
    onCancel() {
      this.isShow = false;
    },
    getResult(val) {
      console.log(val);
    },
    onSubmit(val) {
      console.log(val);
    },
    showSearch() {
      this.isShow = !this.isShow;
    },
    loadVoucherInfos() {
      if (this.defaultResourceLibraryInfo === "all") {
        return;
      }

      let that = this;
      let params = {
        ckId: this.defaultResourceLibraryInfo,
        pzStatus: this.defaultPzStatus,
        voucherType: this.defaultVoucherType,
        pageNumber: 0,
        pageSize: 10
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
      this.$router.push({
        path: "/resourceLibrary/invoicing/invoicingVoucherDetail",
        query: {
          rowId: val.rowId,
          voucherType: val.voucherType,
          companyId: this.$route.query.companyId
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
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.invoicingAllList {
  height: 100%;

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
        padding-right: 10px;
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