<template>
  <div class="voucherChoise">
    <zing-head :title="'凭证选择'" :isComeBack="false" @doSome="doSome"></zing-head>
     <div class="content">
      <tab :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="warehouseListShow" class="listContent">
        <GridCard v-for="(item,index) in warehouseList" @click.native="itemClick(item)" :key="index">
          <div slot="cardLeft" class="left">
            <avatar shape="square" size="large" :style="{backgroundColor: '#9659AE'}" :icon="item.ckImg"></avatar>
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.ckName}}</p>
              <div class="left-wrapper-desc">{{item.ckDesc}}</div>
            </div>
          </div>
          <div v-if="!isReferenced" slot="cardRight" class="right">
            <!-- <i class="iconfont icon-gengduo" @click="gotoUpdateDelPage(item)"></i> -->
            <div class="tag-wrapper">
              <tag color="#20a0ff">我参与的</tag>
            </div>
          </div>
        </GridCard>
      </div>
      <div v-show="shShow" class="listContent">
        
      </div>
      <div v-show="pzShow" class="listContent">
        
      </div>
    </div>
    <popup v-model="voucherListChoiseShow" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <collection-voucher-list-choise ref="listChoiseRef" @voucherListChoiseCancle="voucherListChoiseCancle" @voucherListChoiseChoose="voucherListChoiseChoose" @voucherListChoiseBack="voucherListChoiseBack"></collection-voucher-list-choise>
    </popup>
    
  </div>
</template>

<script>
import { Tab, TabItem, Popup } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import CollectionVoucherListChoise from "./collectionVoucherListChoise";
export default {
  name: "voucherChoise",
  components: {
    Tab,
    TabItem,
    GridCard,
    Avatar,
    Tag,
    Popup,
    ZingHead,
    CollectionVoucherListChoise
  },
  props: {},
  data() {
    return {
      voucherListChoiseShow: false,
      tabTitle: ["财务库", "租赁单", "餐饮单"],
      defTab: "财务库",
      warehouseListShow: true,
      shShow: false,
      pzShow: false,
      warehouseList: []
    };
  },
  computed: {},
  created() {
    this.loadCkInfo();
  },
  mounted() {
    //console.info(this.$refs["goodsListRef"]);
  },
  methods: {
    doSome() {
      this.$emit("voucherChoiseBack");
    },
    voucherListChoiseBack() {
      this.voucherListChoiseShow = false;
    },
    voucherListChoiseCancle(isPop) {
      this.voucherListChoiseShow = false;
    },
    voucherListChoiseChoose(isPop, rowIds) {
      if (typeof rowIds === "string" && rowIds.trim().length > 0) {
        if (isPop) {
          this.doSome();
        }
        this.loadVoucherInfoItems(rowIds, vals => {
          this.voucherListChoiseShow = false;
          this.$emit("choosed", rowIds, vals);
        });
      } else {
        this.$vux.toast.text("前先选择数据");
      }
    },
    chengeTab(index) {
      if (index === 0) {
        this.warehouseListShow = true;
        this.shShow = false;
        this.pzShow = false;
        this.loadCkInfo();
      } else if (index === 1) {
        this.warehouseListShow = false;
        this.shShow = true;
        this.pzShow = false;
      } else {
        this.warehouseListShow = false;
        this.shShow = false;
        this.pzShow = true;
      }
    },
    itemClick(item) {
      this.voucherListChoiseShow = true;
      this.$refs.listChoiseRef.loadVoucherInfos(item.rowId);
    },
    loadCkInfo() {
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
            this.warehouseList = res.data.data.data;
          } else {
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    },
    loadVoucherInfoItems(pzRowIds, call) {
      let params = {
        pzRowIds
      };
      let url = "/zingbiz/resourceLibrary/collection/getVoucherInfoItems";
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          if (res.data.success) {
            if (typeof call === "function") {
              call(res.data.data);
            }
          } else {
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    }
  }
};
</script>

<style scoped rel="stylesheet/stylus" lang="stylus" >
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.voucherChoise {
  height: 100%;

  .content {
    height: calc(100% - 50px);

    .listcontent {
      height: calc(100% - 44px);
    }
  }

  .vux-popup-dialog {
    background: #fff;
  }
}
</style>