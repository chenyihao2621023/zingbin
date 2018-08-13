<template>
  <div class="retGoodsList">
    <div class="page_content" :style="{ height: screenHeight + 'px'}">
      <GridCard v-for="(item ,index) in items" :key="index" @click.native="goRetGoodsDetail(item.dataType,item.rowId)">
        <div slot="cardLeft" class="left">
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{ item.receiveRefundCode }}</p>
            <div class="left-wrapper-title">
              <span v-if="item.dataType == 'LQ'">领取人：</span>
              <span v-if="item.dataType == 'TH'">退还人：</span>
              {{ item.receiveRefundUser}}

            </div>
          </div>
        </div>
        <div slot="cardRight" class="right">
          <div class="tag-wrapper">
            <tag type="primary" v-if="item.dataType == 'LQ'">领单</tag>
            <tag type="primary" v-if="item.dataType == 'TH'">退单</tag>
          </div>
        </div>
      </GridCard>
    </div>
  </div>
</template>

<script>
import GridCard from "@/components/gridcard/GridCard";
import Tag from "@/components/tag/Tag";

export default {
  components: {
    GridCard,
    Tag
  },
  props: ["goodsRowId"],
  data() {
    return {
      screenHeight: 0,
      items: []
    };
  },
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 150;
    this.getReceiveRefundCode();
  },
  methods: {
    goRetGoodsDetail(type, rowId) {
      let pageType = "1";
      if (type === "LQ") {
        pageType = "1";
      } else {
        pageType = "2";
      }
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/receiveReturnDetail",
        query: {
          receiveRefundRowId: rowId,
          goodsRowId: this.goodsRowId,
          pageType: pageType
        }
      });
    },
    getReceiveRefundCode() {
      //获取退领单列表
      let url = "/zingbiz/resourceLibrary/receiveRefund/selectByProductId";
      this.$http
        .get(url, {
          params: {
            productRowId: this.goodsRowId
          }
        })
        .then(res => {
          if (!res.data.success) {
            console.error("getProductByRowId error", res);
            return;
          }

          let retDate = res.data.data;
          this.items = retDate;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.grid-card {
  flex-center(row, space-between, center);
  padding: 10px 20px;
  border-bottom: 1px solid #eaeefb;
}

.page_content {
  overflow-y: auto;
}
</style>