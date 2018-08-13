<template>
  <div class="locationGoodsList">
    <goods-list ref="goodsListRef" :isReferenced="isReferenced" @loadGoods="loadGoods" @goodsItemClick="goodsItemClick"></goods-list>
  </div>
</template>
<script>
import GoodsList from "./goodsList";

export default {
  components: {
    GoodsList
  },
  data() {
    return {
      isReferenced: true
    };
  },
  computed: {},
  created() {},
  methods: {
    loadGoods() {
      if (Object.keys(this.$route.query).length !== 0) {
        this.queryParams = this.$route.query;
      }

      let params = {
        kwId: this.queryParams.kwId,
        pageSize: 10,
        pageNumber: 0
      };
      let url = "/zingbiz/resourceLibrary/product/selectProductListByKWId";

      this.$http
        .get(url, { params: params })
        .then(res => {
          this.$refs.goodsListRef.setAllGoods(res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    goodsItemClick() {
      console.info("aaa");
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.locationGoodsList {
  height: 100%;
}
</style>