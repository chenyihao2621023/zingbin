<template>
  <div class="inventoryAddOrUpdate">
    <ZingHead :title="title">
    </ZingHead>
    <div class="content">
      <!--头部盘点基本信息-->
      <group class="group-no-top-border">
        <cell title="盘点编号" v-model="inventoryDetail.pdId" value-align="right"></cell>
        <x-input title="盘点物品库" readonly @click.native="chooseWarehouse" placeholder="请选择需要盘点的物品库" v-model="inventoryDetail.ckName" placeholder-align="right"></x-input>
        <cell>
          <span slot="title">有{{inventoryDetail.productNum}}个物品</span>
          <div>
            <!-- <span style="margin-right: 3em;">盘亏:{{inventoryDetail.losses}}</span>
            <span>盘盈:{{inventoryDetail.profit}}</span> -->
          </div>
        </cell>
      </group>
      <div class="storage">
        <div class="location" v-for="(item, index) in inventoryDetailItems" :key="index">
          <div class="title">
            库位名称：{{item.kwName }}
          </div>
          <flexbox class="batch">
            <flexbox-item :span="'100px'">
              <div class="headImg">
                <img :src="getImageUrl(item.productImg)" alt="">
              </div>
            </flexbox-item>
            <flexbox-item>
              <flexbox orient="vertical">
                <flexbox-item>
                  <cell title="物品名称：" :value="item.productName"></cell>
                </flexbox-item>
                <flexbox-item>
                  <cell :title="'库存：' + (typeof item.stockCount ==='undefined' ? '' : item.stockCount)" :value="item.profitLosses"></cell>
                </flexbox-item>
                <flexbox-item>
                  <flexbox>
                    <x-input title="盘点数量：" placeholder="请输入盘点数量" v-model="item.pdCount" @on-change="calculate()" placeholder-align="right"></x-input>
                  </flexbox>
                </flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <!--底部按钮-->
    <div class="bottom">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="weui-btn btn-save weui-btn_primary" @click.native="inventorySave('save')">保存</x-button>
        </flexbox-item>
        <flexbox-item class="inventory-btn">
          <x-button type="warn" class="weui-btn btn-common weui-btn_primary" @click.native="inventorySave('submit')">盘点完成</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <popup v-model="showWarehoseList" style="height:100%;width:100%;background-color:#fff" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @warehouseItemClick="warehouseItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
  </div>
</template>
<script type="text/ecmascript-6">
import {
  XButton,
  Flexbox,
  FlexboxItem,
  XInput,
  Group,
  Cell,
  Toast,
  Search,
  Popup
} from "vux";
import GridCard from "../../../components/gridcard/GridCard";
import Avatar from "../../../components/avatar/Avatar";
import Tag from "../../../components/tag/Tag";
import warehouseList from "./warehouseList";
import ZingHead from "@/components/zingHead/ZingHead";
export default {
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    XInput,
    Group,
    GridCard,
    Avatar,
    Tag,
    Cell,
    Search,
    Toast,
    ZingHead,
    warehouseList,
    Popup
  },
  data() {
    return {
      title: "新建盘点",

      productIds: {},
      inventoryDetailItems: [],
      inventoryDetail: {
        pdId: "",
        ckId: "",
        ckName: "",
        operate: "",
        pdStatus: "",
        productNum: 0,
        losses: 0,
        profit: 0
      },
      showWarehoseList: false
    };
  },
  computed: {},
  created() {
    if (
      typeof this.$route.query.pdId === "string" &&
      this.$route.query.pdId.trim().length > 0
    ) {
      this.loadInventoryDetail(this.$route.query.pdId);
    } else {
      this.loadPdNum();
    }
  },
  methods: {
    chooseWarehouse() {
      this.showWarehoseList = true;
    },
    warehouseItemClick(data) {
      this.inventoryDetail.ckName = data.ckName;
      this.inventoryDetail.ckId = data.rowId;
      this.showWarehoseList = false;
      this.loadStock();
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    loadPdNum() {
      let params = {};
      this.$http
        .get("/zingbiz/resourceLibrary/inventory/getPDNumber", {
          params
        })
        .then(response => {
          if (response.data.success) {
            this.inventoryDetail.pdId = response.data.data;
          }
        });
    },
    loadInventoryDetail(pdId) {
      let params = {
        pdId
      };
      this.$http
        .get("/zingbiz/resourceLibrary/inventory/getInventoryDetail", {
          params
        })
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            this.inventoryDetail = data;
            this.productIds = {};
            this.inventoryDetail.productNum = 0;
            data.inventoryDetailItems.forEach(element => {
              if (!this.productIds[element.productId]) {
                this.productIds[element.productId] = true;
                this.inventoryDetail.productNum += 1;
              }

              if (element.status === "py") {
                element.profitLosses = "盘盈：" + element.pyPkCount;
              } else if (element.status === "pyPk") {
                element.profitLosses = "盘盈盘亏：" + element.pyPkCount;
              } else {
                element.profitLosses = "盘亏：" + element.pyPkCount;
              }
            });

            this.inventoryDetailItems = data.inventoryDetailItems;
          }
        });
    },
    loadStock() {
      let params = {
        ckId: this.inventoryDetail.ckId
      };
      this.$http
        .get("/zingbiz/resourceLibrary/resourceLibraryInfo/selectStocks", {
          params
        })
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            this.productIds = {};
            this.inventoryDetail.productNum = 0;
            this.inventoryDetailItems = [];
            data.forEach(element => {
              if (!this.productIds[element.productId]) {
                this.productIds[element.productId] = true;
                this.inventoryDetail.productNum += 1;
              }
              this.inventoryDetailItems.push({
                kwId: element.kwId,
                kwName: element.kwName,
                productImg: element.productImg,
                productName: element.productName,
                productId: element.productId,
                stockCount: element.productCount,
                pdCount: "",
                pyPkCount: 0,
                profitLosses: "盘亏：" + element.productCount,
                status: "pyPk"
              });
            });
          }
        });
    },
    calculate: function() {
      let that = this;
      that.profit = 0;
      that.Losses = 0;
      let reg = new RegExp("^[0-9]*$");
      let isPy = false;
      let isPk = false;
      //内部判断盘盈盘亏
      that.inventoryDetailItems.filter(function(item) {
        if (!item) {
          return false;
        }
        let pdCount = reg.test(item.pdCount) ? item.pdCount : 0;

        item.pyPkCount = pdCount - item.stockCount;
        if (item.pyPkCount > 0) {
          isPy = true;
          item.status = "py";
          item.profitLosses = "盘盈：" + item.pyPkCount;
        } else if (item.pyPkCount === 0) {
          item.status = "pyPk";
          item.profitLosses = "盘盈盘亏:0";
        } else {
          isPk = true;
          item.status = "pk";
          item.pyPkCount = Math.abs(item.pyPkCount);
          item.profitLosses = "盘亏：" + item.pyPkCount;
        }
        return true;
      });
      if (isPy && isPk) {
        this.inventoryDetail.operate = "pyPk";
      } else if (isPy) {
        this.inventoryDetail.operate = "py";
      } else if (isPk) {
        this.inventoryDetail.operate = "pk";
      } else {
        this.inventoryDetail.operate = "";
      }
    },
    //临时保存
    inventorySave: function(pdStatus) {
      let url = "/zingbiz/resourceLibrary/inventory/insertInventory";
      if (
        typeof this.$route.query.pdId === "string" &&
        this.$route.query.pdId.trim().length > 0
      ) {
        url = "/zingbiz/resourceLibrary/inventory/updateInventoryDetail";
      }
      this.inventoryDetail.inventoryDetailItems = this.inventoryDetailItems;
      this.inventoryDetail.pdStatus = pdStatus;
      this.$http.post(url, this.inventoryDetail).then(res => {
        this.$router.back(-1);
      });
    },
    //路径转换
    getImageUrl: function(url, errorUrl) {
      if (typeof url !== "undefined" && url != null && url.length > 0) {
        let THUMB_DEFAULT_SIZE = 200;

        if (url.indexOf("checkJpg") >= 0 || url.indexOf("checkFile") >= 0) {
          let final_url = url;
          if (url.indexOf("?") !== -1) {
            final_url = url.substring(0, url.indexOf("?"));
          }
          let suffix = final_url.substring(final_url.lastIndexOf("."));
          if (
            suffix !== ".jpg" &&
            suffix !== ".png" &&
            suffix !== ".jpeg" &&
            suffix !== "bmp"
          ) {
            console.log("getImageUrl 格式不支持");
            return url;
          }
          return (
            "/ImgRender?imgpath=" +
            final_url +
            "&thumb=" +
            THUMB_DEFAULT_SIZE +
            "x" +
            THUMB_DEFAULT_SIZE +
            "&errpath=" +
            errorUrl +
            "&time=9999.9999&type=" +
            suffix
          );
        } else {
          return url;
        }
      } else {
        return "";
      }
    }
  }
};
</script>
<style  lang="stylus" rel="stylesheet/stylus">
.inventoryAddOrUpdate {
  .weui-cell__ft {
    -webkit-text-fill-color: #000
  }
}
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
@import '../../../assets/stylus/base.styl';

.inventoryAddOrUpdate {
  height: 100%;

  .content {
    background-color: #F5F5FA;
    height: calc(100% -94px);
    overflow: auto;
    padding-bottom: 20px;

    &::-webkit-scrollbar {
      display: none;
    }

    .storage {
      .location {
        background-color: #fff;
        line-height: 20px;
        margin-top: 10px;
        font-size: 17px;

        .title {
          height: 50px;
          line-height: 50px;
          padding-left: 10px;
          border-bottom: 1px solid #d4dde4;
        }

        .batch {
          padding-top: 10px;
          border-bottom: 1px solid #d4dde4;

          .headImg {
            width: 80px;
            height: 80px;
            margin: 0px 0px 10px 10px;

            img {
              width: 80px;
              height: 80px;
            }
          }

          .weui-cell {
            padding: 0px 13px !important;
          }
        }
      }
    }
  }
  .bottom {
    .inventory-btn {
      margin-left: 0px !important;
    }
  }
}
</style>