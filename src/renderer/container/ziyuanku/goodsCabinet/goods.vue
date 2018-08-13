<template>
  <div class="goods">
    <zing-head title="物品详情">

    </zing-head>
    <div class="root-div">
      <tab :line-width="2" active-color="#ff8000">
        <tab-item class="vue-tab" :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="goodsDetailShow" class="gz-div">
        <goods-detail :goodsRowId="goodsRowId"></goods-detail>
      </div>
      <div v-show="receiveReturnShow" class="gz-div">
        <receive-return-list :goodsRowId="goodsRowId"></receive-return-list>
      </div>
    </div>
  </div>
</template>


<script>
import { Tab, TabItem } from "vux";
import GoodsDetail from "@/container/ziyuanku/goodsCabinet/goodsDetail";
import ReceiveReturnList from "@/container/ziyuanku/goodsCabinet/receiveReturnList";
import ZingHead from "@/components/zingHead/ZingHead";

export default {
  components: {
    Tab,
    TabItem,
    GoodsDetail,
    ReceiveReturnList,
    ZingHead
  },
  directives: {
    //自定义标签属性
  },
  data() {
    return {
      tabTitle: ["物品详情", "退领单"],
      defTab: "物品详情",
      goodsDetailShow: true,
      receiveReturnShow: false,
      goodsRowId: ""
    };
  },
  created: function() {
    this.goodsRowId = this.$route.query.rowId;
  },
  methods: {
    chengeTab(index) {
      if (index === 0) {
        this.goodsDetailShow = true;
        this.receiveReturnShow = false;
      } else {
        this.goodsDetailShow = false;
        this.receiveReturnShow = true;
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';

.goods {
  height: 100%;

  .root-div {
    height: calc(100% - 50px);

    .gz-div {
      height: calc(100% - 30px);
    }
  }
}
</style>