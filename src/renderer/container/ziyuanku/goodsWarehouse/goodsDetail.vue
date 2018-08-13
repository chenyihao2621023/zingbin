<template>
  <div class="goodsDetail">
    <zing-head title="物品详情"></zing-head>
    <div class="content">
      <group style="margin-top:0px">
        <div class="head">
          <span class="leftImg">
            <img :src="goods.productImgs" alt="">
          </span>
          <span class="rightText">
            <h3>{{goods.productName}}</h3>
          </span>
        </div>
        <cell title="科目代码" :value="goods.productProjectCode"></cell>
        <cell title="科目名称" :value="goods.productProjectName"></cell>
        <cell title="科目描述" :value="goods.productProjectDesc"></cell>
        <cell title="单位" :value="goods.productUnit"></cell>
        <cell title="规格" :value="goods.productProp"></cell>
        <cell title="产地" :value="goods.productArea"></cell>
        <cell title="品牌" :value="goods.productBrand"></cell>
        <cell title="平均单价" :value="goods.productAvgPrice"></cell>
        <cell title="销售单价" :value="goods.xsPrice"></cell>
        <cell title="总数量" :value="goods.productCount"></cell>
        <cell title="总价值" :value="totalValue"></cell>
      </group>
      <group style="margin-top:20px;" v-for="(list,index) in goods.voucherInfoItemDetails" :key="index">
        <cell title="物品库" :value="list.ckName"></cell>
        <cell title="批次" :value="list.pzId"></cell>
        <cell title="库位" :value="list.kwName"></cell>
        <cell title="单价" :value="list.kwPrice"></cell>
        <cell title="数量" :value="list.productCount"></cell>
        <div class="tagWrapper">
          <tag v-if="list.status=='WTJ'" type="warning">未提交</tag>
          <tag v-else-if="list.status=='DSH'" type="danger">待审核</tag>
          <tag v-else-if="list.status=='YSH'" type="success">已审核</tag>
          <tag v-else-if="list.status=='FQ'" type="primary">废弃</tag>
        </div>
      </group>
      <group style="">
        <x-button type="primary" style="margin-bottom:0px;" @click.native="edit" class="btn-common">修改</x-button>
      </group>
    </div>
  </div>
</template>
<script>
import Tag from "components/tag/Tag.vue";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Group, Cell, XButton } from "vux";

export default {
  name: 'goodsDetail2',
  components: {
    XButton,
    Tag,
    ZingHead,
    Group,
    Cell
  },
  data() {
    return {
      goods: {
        voucherInfoItemDetails: []
      }
    };
  },
  computed: {
    totalValue: function() {
      let total = this.goods.productAvgPrice * this.goods.productCount;
      return isNaN(total) ? 0 : total;
    }
  },
  methods: {
    loadGoodsDetail() {
      let _this = this;
      let params = {
        productId: this.$route.query.rowId
      };
      let pzItemId = this.$route.query.pzItemId;
      if (typeof pzItemId === "string" && pzItemId.trim().length > 0) {
        params.type = "PZ";
        params.id = pzItemId;
      }
      let url = "/zingbiz/resourceLibrary/product/selectProductInfoDetail";

      this.$http
        .get(url, { params: params })
        .then(res => {
          _this.goods = res.data.data;

          /* _this.goods.voucherInfoItemDetails = [
            {
              ckName: "aa",
              batchNumber: 300,
              ckLocatName: "bb",
              ckLocatPrice: 5,
              productCount: 300
            }
          ]; */
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit() {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/goodsAddOrUpdate",
        query: {
          pageStatus: "U",
          rowId: this.$route.query.rowId,
          companyId: this.$route.query.companyId
        }
      });
    }
  },
  created() {
    this.loadGoodsDetail();
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.goodsDetail {
  height: 100%;

  .content {
    height: calc(100% - 50px);
    overflow: auto;
    background-color: #f5f5f5;

    .head {
      display: flex;
      padding: 10px 0px 10px 13px;
      background-color: #fff;

      .leftImg {
        flex: 1;
        min-height: 70px;

        img {
          height: 70px;
          width: 70px;
          border-radius: 5px;
        }
      }

      .rightText {
        position: relative;
        padding-top: 5px;
        flex: 3;

        h3 {
          line-height: 22px !important;
          font-size: 16px;
        }

        span {
          position: absolute;
          right: 0;
          bottom: 0;
          background-color: #e4f2fc;
          color: #4da9eb;
          width: 70px;
          text-align: center;
          height: 23px;
          line-height: 23px;
          border-radius: 5px;
        }
      }
    }

    .tagWrapper {
      float: right;
      margin: 0px 10px 10px 0px;
    }
  }
}
</style>