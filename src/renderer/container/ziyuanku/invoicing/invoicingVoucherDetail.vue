<template>
  <div class="otherInOrOutVoucherDetail">
    <zing-head title="单据详情"></zing-head>

    <div class="main">
      <div class="head" @click="showVoucherInOrOut">
        <span class="leftImg">
          <img :src="voucher.pzShowImg" alt="">
        </span>
        <span class="rightText">
          <p>批次：{{voucher.pzId}}</p>
          <p>单据日期：{{voucher.statusTime}}</p>
          <p>创建人：{{voucher.cardUserName}}</p>
        </span>
      </div>
      <div class="content">
        <div class="contentHead">
          <div class="leftDiv">
            <span>总金额：{{voucher.pzFirstMoney}}</span>
            <span>总数量：{{voucher.productCount}}</span>
          </div>
          <div class="rightDiv">
            <span>优惠率：{{typeof voucher.cheapPre === "undefined" || voucher.cheapPre===null || isNaN(voucher.cheapPre)  ? 0 : voucher.cheapPre}}%</span>
            <span>总优惠：{{typeof voucher.cheapPrice === "undefined" || voucher.cheapPrice===null ? 0 : voucher.cheapPrice}}元</span>
          </div>
        </div>
        <div class="contentList" v-for="(item,index) in voucherItems" @click="showProductDetail(item)" :key="index">
          <flexbox>
            <flexbox-item>
              <span>{{item.productName}}</span>
            </flexbox-item>
          </flexbox>
          <div>
            <flexbox>
              <flexbox-item>
                <div>数量：{{item.pzCount}}</div>
                <div>单价：￥{{item.pzPrice}}</div>
              </flexbox-item>
              <flexbox-item>
                <div>单位：{{item.pzUnit}}</div>
                <div>总金额:{{item.pzAccount}}元</div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import ZingHead from "@/components/zingHead/ZingHead.vue";
import Tag from "@/components/tag/Tag.vue";
import { Flexbox, FlexboxItem, XButton, Group, Cell, XHeader } from "vux";

export default {
  name: "invoicingVoucherDetail",
  components: {
    ZingHead,
    Tag,
    XButton,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    XHeader
  },
  data() {
    return {
      voucher: {},
      voucherItems: []
    };
  },
  computed: {},
  created() {
    this.loadVoucherDetail();
  },
  methods: {
    showVoucherInOrOut() {
      this.$router.push({
        path: "/resourceLibrary/invoicing/addOrUpdate",
        query: {
          pzRowId: this.voucher.rowId,
          voucherType: this.$route.query.voucherType,
          companyId: this.$route.query.companyId
        }
      });
    },
    showProductDetail(productItem) {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/goodsDetail",
        query: {
          rowId: productItem.productRowId,
          pzItemId: productItem.rowId,
          companyId: this.$route.query.companyId
        }
      });
    },
    loadVoucherDetail() {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/selectVoucherInfoById", {
          params: {
            rowId: this.$route.query.rowId
          }
        })
        .then(response => {
          if (response.data.success) {
            this.voucher = response.data.data;
            let vItems = response.data.data.voucherInfoItems;
            vItems.forEach(element => {
              if (element.pzType === "inPz") {
                this.voucherItems.push(element);
              }
            });
          }
        });
    },
    reAudit() {
      this.$router.push({
        path: ""
      });
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
@import '../../../assets/stylus/unify.styl';

.otherInOrOutVoucherDetail {
  height: 100%;
  background-color: #f5f5f5;

  .main {
    height: calc(100% - 50px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .head {
      display: flex;
      padding: 10px;
      background-color: #fff;

      .leftImg {
        flex: 1;
        height: 70px;

        img {
          height: 70px;
          width: 70px;
          border-radius: 3px;
        }
      }

      .rightText {
        display: flex;
        color: #000;
        flex: 3;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .content {
      .contentHead {
        margin-top: 4px;
        display: flex;
        padding: 5px 10px;
        background-color: #fff;

        .leftDiv, .rightDiv {
          flex: 1;

          span {
            display: inline-block;
            width: 100%;
            min-height: 25px;
            line-height: 25px;
          }
        }
      }

      .contentList {
        padding: 5px 10px;
        background-color: #fff;
        margin-top: 4px;
        color: #000;
        line-height: 25px;
      }
    }

    .voucherItems {
      .header {
        height: 50px;
        line-height: 50px;
        position: relative;

        .header-left {
          position: absolute;
          padding-left: 13px;
          top: 50%;
          transform: translateY(-50%);
        }

        .header-right {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          /* 修复inline-block受font-size的影响 */
          font-size: 0;

          &>div>* {
            font-size: 14px;
          }

          .header-jiahao {
            display: inline-block;
            width: 50px;
            line-height: 50px;
            padding-left: 12.5px;
            font-size: 0 !important;

            &>* {
              font-size: 14px !important;
            }

            .icon-gengduo {
              font-size: 25px !important;
              color: black !important;
            }
          }
        }
      }
    }
  }
}
</style>