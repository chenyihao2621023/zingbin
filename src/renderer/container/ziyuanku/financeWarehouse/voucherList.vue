<template>
  <div class="voucherList">
    <zing-head :title="headTitle">
      <div slot="header-right">
        <span class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <div class="prompt" v-show="prompt">该状态下没有数据</div>
    <group>
      <flexbox class="searchParamDiv">
        <flexbox-item v-show="showCkSelection">
          <selector ref="defaultResourceLibraryRef" direction="ltr" :options="resourceLibraryInfoList" v-model="defaultResourceLibraryInfo" @on-change="loadVoucherInfos"></selector>
        </flexbox-item>
        <flexbox-item>
          <selector :title="showCkSelection ? '' : '凭证状态'" :direction="showCkSelection ? 'ltr' : 'rtl'" ref="defaultPzStatusRef" :options="pzStatusList" v-model="defaultPzStatus" @on-change="loadVoucherInfos"></selector>
        </flexbox-item>
      </flexbox>
    </group>
    <div class="listContainer">
      <div>
        <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index" @click.native="itemJump(item)">
          <div slot="cardLeft" class="left">
            <avatar shape="square" :src="getImageUrl(item.pzShowImg,'./static/images/userDef_.jpg')"></avatar>
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.pzId}}</p>
              <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
            </div>
          </div>
          <div slot="cardRight" class="right">
            <i class="iconfont icon-gengduo" v-if="!isChoose" @click="lookingFor($event,item,index)"></i>
          </div>
        </GridCard>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import {
  XDialog,
  Confirm,
  XButton,
  Flexbox,
  FlexboxItem,
  Selector,
  Group
} from "vux";
import Dropdown from "../../../components/dropdown/Dropdown";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import scroll from "@/components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
import { getImageUrl } from "@/utils/fn";
export default {
  components: {
    Dropdown,
    GridCard,
    Avatar,
    Tag,
    XDialog,
    scroll,
    Confirm,
    XButton,
    ZingHead,
    Flexbox,
    FlexboxItem,
    Selector,
    Group
  },
  props: {
    pzStatus: {
      default: "YSH"
    },
    showHead: {
      default: false
    },
    isChoose: {
      default: false
    }
  },
  data() {
    return {
      headTitle: "凭证管理",
      pzStatusList: [
        { key: "YSH", value: "已审核" },
        { key: "YGZ", value: "已过账" },
        { key: "YJZ", value: "已结账" },
        { key: "DSH", value: "未审核" },
        { key: "WTJ", value: "未提交" },
        { key: "FQ", value: "废弃" },
        { key: "YHZ", value: "已汇总" }
      ],
      defaultPzStatus: "YSH",
      resourceLibraryInfoList: [{ key: "all", value: "全部财务库" }],
      defaultResourceLibraryInfo: "all",
      prompt: false,
      dialogText: [],
      list: [],
      item: "",
      clickItem: "",
      datas: [
        {
          content: "新建凭证",
          url: "/resourceLibrary/financeWarehouse/voucherAdd"
        }
      ],
      showCkSelection: true
    };
  },
  created() {
    let ckId = this.$route.query.ckId;
    if (ckId && ckId != null && ckId != "") {
      this.defaultResourceLibraryInfo = ckId;
      this.showCkSelection = false;
      this.headTitle = this.$route.query.ckName;
    } else {
      this.selCkInfo();
    }
  },
  methods: {
    getImageUrl,
    selCkInfo() {
      let params = {
        pageNumber: 0,
        pageSize: 2000,
        ckTypeStrs: "CW"
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
                value: "全部财务库"
              });

              this.defaultResourceLibraryInfo = defaultCkId;
            }
            // this.resourceLibraryInfoList;
          } else {
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    },
    loadVoucherInfos() {
      if (this.defaultResourceLibraryInfo === "all") {
        return;
      }
      let params = {
        pzStatus: this.defaultPzStatus,
        voucherType: "CW",
        pageNumber: 0,
        pageSize: 2000,
        ckId: this.defaultResourceLibraryInfo
      };
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/queryVoucher", {
          params
        })
        .then(response => {
          if (response.data.total !== 0) {
            let data = response.data.data;
            this.list = data;
          } else {
            this.prompt = true;
          }
        });
    },
    handleMenu(data) {
      if (data.url) {
        let companyId = this.$route.query.companyId;
        let ckId = this.$route.query.ckId;
        let ckName = this.$route.query.ckName;

        let url = data.url + "?companyId=" + companyId;
        if (ckId) {
          url += "&ckId=" + ckId;
        }
        if (ckName) {
          url += "&ckName=" + ckName;
        }
        this.$router.push(url);
      }
    },
    lookingFor: function($event, rowData, index) {
      $event.stopPropagation();
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
          }
          this.show = false;
        }
      });
    },
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
    //删除凭证
    deleteVoucher: function() {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.$http
            .get("/zingbiz/resourceLibrary/voucher/deleteVoucherInfo.action", {
              params: {
                pzRowId: _this.clickItem.rowId
              }
            })
            .then(res => {
              //如果成功了 重新加载界面
              if (res.data.success === true) {
                let index = _this.list.findIndex(val => {
                  return val.rowId === _this.clickItem.rowId;
                });
                _this.list.splice(index, 1);
              }
            });
        }
      });
    },
    //列表跳转
    itemJump: function(item) {
      if (this.isChoose) {
        this.$emit("voucherListItemClick", item);
      } else {
        let query = {
          pzRowId: item.rowId,
          companyId: item.companyId
        };

        this.$router.push({
          path: "/resourceLibrary/financeWarehouse/voucherAdd",
          query
        });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.voucherList {
  height: 100%;

  .searchParamDiv {
    .weui-cell {
      .weui-select {
        padding-left: 0px;
      }
    }
  }

  .prompt {
    text-align: center;
    color: #ff8000;
    margin-top: 20px;
    font-size: 18px;
  }

  .listContainer {
    height: calc(100% - 94px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>