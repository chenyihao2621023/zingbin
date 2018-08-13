<template>
  <div class="inventoryAddOrUpdate">
    <ZingHead :title="title">
    </ZingHead>
    <div class="content">
      <!--头部盘点基本信息-->
      <group>
        <x-input title="盘点编号" disabled v-model="inventoryDetail.pdId" class="fontColor"></x-input>
        <x-input title="物品库" disabled v-model="inventoryDetail.ckName" class="fontColor"></x-input>
        <x-input title="盘点时间" disabled v-model="inventoryDetail.pdTime" class="fontColor"></x-input>
        <x-input title="盘点人" disabled v-model="inventoryDetail.cardUserName" class="fontColor"></x-input>
        <x-input title="盘点状态" disabled v-model="inventoryDetail.pdStatusText" class="fontColor"></x-input>
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
                    <x-input title="盘点数量：" placeholder="请输入盘点数量" v-model="item.pdCount" disabled placeholder-align="right"></x-input>
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
        <flexbox-item v-show="inventoryDetail.py">
          <x-button type="primary" class="weui-btn btn-save weui-btn_primary" @click.native="toInVoucher">编辑盘盈单</x-button>
        </flexbox-item>
        <flexbox-item v-show="inventoryDetail.pk" class="inventory-btn">
          <x-button type="warn" class="weui-btn btn-common weui-btn_primary" @click.native="toOutVoucher">编辑盘亏单</x-button>
        </flexbox-item>
      </flexbox>
    </div>
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
    Popup
  },
  data() {
    return {
      title: "盘点单",

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
    }
  },
  methods: {
    toInVoucher(val) {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/otherInOrOut",
        query: {
          pzRowId: this.inventoryDetail.pyPzId,
          voucherType: "otherIn"
        }
      });
    },
    toOutVoucher(val) {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/otherInOrOut",
        query: {
          pzRowId: this.inventoryDetail.pkPzId,
          voucherType: "otherOut"
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
            this.inventoryDetail.pdTime = this.inventoryDetail.genTime.substring(
              0,
              10
            );
            this.inventoryDetail.pdStatusText =
              this.inventoryDetail.pdStatus === "save" ? "未提交" : "已完成";

            this.inventoryDetail.py = false;
            this.inventoryDetail.pk = false;
            if (data.operate === "pyPk") {
              this.inventoryDetail.py = true;
              this.inventoryDetail.pk = true;
            } else if (data.operate === "py") {
              this.inventoryDetail.py = true;
            } else if (data.operate === "pk") {
              this.inventoryDetail.pk = true;
            }

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
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
@import '../../../assets/stylus/base.styl';

.inventoryAddOrUpdate {
  height: 100%;

  .content {
    background-color: #F5F5FA;
    height: calc(100% - 109px);
    overflow: auto;
    padding-bottom: 10px;

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
            margin: 10px 0px 0px 10px;

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
}
</style>