<template>
  <div class="list">
    <ZingHead title="库位列表" :isComeBack="isComeBack" @doSome="doSome">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span v-if="!isReferenced" class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </ZingHead>

    <!-- <div v-show="isShow">
      <search @on-change="getResult" position="absolute" auto-scroll-to-top top="46px" ref="search" class="search">
      </search>
    </div> -->
    <search :searchFlag="isShow" @cancelInput="cancelInput" @confirmInput="getResult">

    </search>
    <scroll v-if="allCKLocation.length!=0" ref="scroll" :data="items" :scrollbar="true" @pullingDown="onPullingDown">

      <GridCard v-for="(item,index) in allCKLocation" :key="index">
        <div slot="cardLeft" class="left" @click="locationItemClick(item)">
          <avatar :src="item.ckLocationImg"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.ckLocationName}}</p>
            <div class="left-wrapper-desc">{{item.ckLocationCode}}</div>
          </div>
        </div>
        <div v-if="!isReferenced" slot="cardRight" class="right">
          <i class="iconfont icon-gengduo" @click="mask(item,index)"></i>
        </div>
      </GridCard>

    </scroll>
    <div v-else class="prompt">暂无相应库位</div>

    <confirm title="提示" v-model="showAlert" @on-confirm="onConfirm">确认删除吗？</confirm>

    <alert v-model="show" title="提示">扫描只能用APP</alert>

    <confirm title="提示" v-model="scanFailPrompt" @on-confirm="onScanConfirm">没有找到相应库位，是否去新增？</confirm>

  </div>
</template>
<script>
import Scroll from "components/scroll/Scroll";
import Dropdown from "components/dropdown/Dropdown";
import GridCard from "components/gridcard/GridCard.vue";
import Avatar from "components/avatar/Avatar.vue";
import ZingHead from "components/zingHead/ZingHead.vue";
import { XDialog, Confirm, Alert } from "vux";
import Search from "components/search/search.vue";
import { mapState, mapActions } from "vuex";
import { isMhApp } from "utils/fn.js";

export default {
  components: {
    Scroll,
    Dropdown,
    GridCard,
    Avatar,
    XDialog,
    ZingHead,
    Confirm,
    Search,
    Alert
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isComeBack: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  data() {
    return {
      items: [],
      showDialog: false,
      showAlert: false,
      isShow: false,
      show: false,
      clickItem: {},
      clickIndex: 0,
      scanFailPrompt: false,
      allCKLocation: []
    };
  },
  computed: {
    datas() {
      if (
        this.allCKLocation.length > 0 &&
        this.$route.query.ckOutMethod === "auto"
      ) {
        return [{ content: "扫描库位" }];
      } else {
        return [
          {
            content: "新建库位",
            url: "/resourceLibrary/goodsWarehouse/locationAddOrUpdate"
          },
          { content: "扫描库位" }
        ];
      }
    }
  },
  created() {
    if (!this.isReferenced) {
      const params = {
        condition: "",
        ckId: this.$route.query.ckId,
        pageNumber: "0",
        pageSize: "2000"
      };
      this.loadLiactions(params);
    }
  },
  methods: {
    doSome() {
      if (!this.isComeBack) {
        this.$emit("locationListBack");
      }
    },
    onPullingDown() {
      // 模拟更新数据
      console.log("pulling down and load data");
      setTimeout(() => {
        if (this._isDestroyed) {
          return;
        }
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.$refs.scroll.forceUpdate();
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 2000);
    },

    handleMenu(data) {
      if (data.url) {
        this.$router.push({
          path: data.url,
          query: {
            storehouse: "add",
            ckId: this.$route.query.ckId,
            companyId: this.$route.query.companyId
          }
        });
      } else {
        //扫描库位
        if (isMhApp()) {
          window.MHAppapi.startBarCodeScanner(); //调用扫码接口

          window.MHAppJSBridge.onBarcodeScanResult = function(barcode) {
            const params = {
              barCode: barcode,
              companyId: this.$route.query.companyId
            };

            /* this.barCodeResult(params);
              if (this.getBarCode.success) {
                this.$router.push({
                  path: "",
                  query: {
                    rowId: this.getBarCode.rowId
                  }
                });
              } else {
                this.scanFailPrompt = true;
              } */
          };
        } else {
          this.show = true;
        }
      }
    },
    locationItemClick(data) {
      if (!this.isReferenced) {
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/locationGoodsList",
          query: {
            kwId: data.rowId
          }
        });
      } else {
        this.$emit("locationItemClick", data);
      }
    },
    mask(data, index) {
      let _this = this;
      this.clickItem = data;
      this.clickIndex = index;
      this.$vux.actionsheet.show({
        menus: ["编辑", "删除"],
        onMenuClick(text, key) {
          switch (key) {
            case 0:
              _this.editKW();
              break;
            case 1:
              _this.del();
              break;
          }
          this.show = false;
        }
      });
    },
    editKW() {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/locationAddOrUpdate",
        query: {
          storehouse: "edit",
          rowId: this.clickItem.rowId,
          ckId: this.$route.query.ckId,
          companyId: this.$route.query.companyId
        }
      });
    },
    del() {
      this.showAlert = true;
    },
    onConfirm() {
      const delParams = {
        rowId: this.clickItem.rowId
      };
      this.delCKLocation(delParams);
    },
    showSearch() {
      this.isShow = !this.isShow;
    },
    getResult(val) {
      console.log(val);
      this.isShow = false
    },
    cancelInput() {
      this.isShow = false
    },
    onScanConfirm() {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/locationAddOrUpdate",
        query: {
          ckId: this.$route.query.ckId,
          companyId: this.$route.query.companyId
        }
      });
    },
    loadLiactions(params) {
      let url = "/zingbiz/resourceLibrary/location/selectAllLocationByCKId";
      let _this = this;
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          _this.allCKLocation = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    delCKLocation(params) {
      let _this = this;
      let url = "/zingbiz/resourceLibrary/location/deleteLocation";
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          if (res.data.success === false) {
            if (res.data.msg === "2") {
              this.$vux.toast.text("库位下存在物品，无法删除");
            } else {
              this.$vux.toast.text(res.data.msg);
            }
          } else {
            _this.allCKLocation.splice(_this.clickIndex, 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.list {
  height: 100%;

  .edit, .dialog-head, .dialog-content, .dialog-foot {
    min-height: 40px;
    line-height: 40px;
  }

  .dialog-foot {
    display: flex;
    justify-content: space-around;

    a {
      width: 100%;
      height: 100%;
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