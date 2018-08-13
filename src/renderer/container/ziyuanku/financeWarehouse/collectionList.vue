<template>
  <div class="collectionList">
    <zing-head :title="'凭证汇总'">
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
    <scroll ref="scroll">
      <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index" @click.native="itemJump(item)">
        <div slot="cardLeft" class="left">
          <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="present"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.pzNo}}</p>
            <div class="left-wrapper-desc">金额:{{item.hzAccount}}</div>
          </div>
        </div>
        <div slot="cardRight" class="right">
          <div>
            <tag class="pdStatus" v-if="item.dataStatus === 'YSH'" type="success">{{item.tagText}}</tag>
            <tag class="pdStatus" v-else type="warning">{{item.tagText}}</tag>
          </div>
        </div> 
      </GridCard>
    </scroll>
    <popup v-model="collectionVoucherChoiseShow" style="background-color: #fff;" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <collection-voucher-choise @choosed="choosed" @voucherChoiseBack="voucherChoiseBack"></collection-voucher-choise>
    </popup>
    <popup v-model="collectionAddShow" style="background-color: #fff;" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <collection-add :isReferenced="true" ref="collectionAddRef" :pzRowIds="pzRowIds" :voucherInfoItems="voucherInfoItems" @collectionAddBack="collectionAddBack" @collectionSave="collectionSave"></collection-add>
    </popup>
  </div>
</template>

<script type="text/ecmascript-6">
import { XDialog, Confirm, XButton, Popup } from "vux";
import Dropdown from "../../../components/dropdown/Dropdown";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import scroll from "@/components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
import CollectionVoucherChoise from "./collectionVoucherChoise";
import CollectionAdd from "./collectionAdd";
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
    Popup,
    CollectionVoucherChoise,
    CollectionAdd
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
      collectionVoucherChoiseShow: false,
      collectionAddShow: false,
      prompt: false,
      showToast: false,
      show: false,
      tagText: "",
      dialogText: [],
      list: [],
      voucherInfoItems: [],
      item: "",
      pzRowId: "",
      pzRowIds: "",
      datas: [
        {
          content: "新建汇总"
        }
      ]
    };
  },
  created() {
    this.loadCollections();
  },
  methods: {
    voucherChoiseBack() {
      this.collectionVoucherChoiseShow = false;
    },
    choosed(pzRowIds, items) {
      this.pzRowIds = pzRowIds;
      this.voucherInfoItems = items;
      this.collectionAddShow = true;
      this.$refs.collectionAddRef.loadVoucherDetail();
    },
    collectionAddBack() {
      this.collectionAddShow = false;
    },
    collectionSave() {
      this.collectionAddShow = false;
      this.loadCollections();
    },
    loadCollections() {
      let params = {
        pzStatus: this.defaultPzStatus,
        voucherType: "CW",
        pageNumber: 0,
        pageSize: 2000
      };
      if (this.defaultResourceLibraryInfo !== "all") {
        params.ckId = this.defaultResourceLibraryInfo;
      }
      this.$http
        .get("/zingbiz/resourceLibrary/collection/selectPzCollect", {
          params
        })
        .then(response => {
          if (response.data.total !== 0) {
            let data = response.data.data;
            data.forEach(val => {
              if (val.dataStatus === "YSH") {
                val.tagText = "已汇总";
              } else {
                val.tagText = "未汇总";
              }
            });
            this.list = data;
          } else {
            this.prompt = true;
          }
        });
    },
    handleMenu(data) {
      this.collectionVoucherChoiseShow = true;
    },
    //列表跳转
    itemJump: function(item) {
      if (this.isChoose) {
        this.$emit("collectionListItemClick", item);
      } else {
        let query = {
          pzRowId: item.rowId,
          companyId: item.companyId
        };

        this.$router.push({
          path: "/resourceLibrary/financeWarehouse/collectionAdd",
          query
        });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" >
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.collectionList {
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
    color: #ff8000;
    margin-top: 20px;
    font-size: 18px;
  }
}
</style>