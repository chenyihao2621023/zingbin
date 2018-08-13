<template>
  <div class="otherInOrOutlist">
    <ZingHead :title="headTitle" :isComeBack="false" @doSome="doSome">
    </ZingHead>
    <div v-if="voucherInfos.length > 0">
      <GridCard v-for="(item,index) in voucherInfos" :key="index">
        <div slot="cardLeft" class="left" @click="itemClick(item)">
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.pzId}}</p>
            <div class="left-wrapper-desc">库位：{{item.kwName}}</div>
          </div>
        </div>
        <div slot="cardRight">
          {{item.productCount}}
        </div>  
      </GridCard>
    </div>
    <div v-else class="prompt">该状态下没有数据</div>
  </div>
</template>
<script>
import GridCard from "../../../components/gridcard/GridCard.vue";
import Avatar from "../../../components/avatar/Avatar.vue";
import ZingHead from "../../../components/zingHead/ZingHead.vue";

export default {
  name: "otherInOrOutlist",
  components: {
    GridCard,
    Avatar,
    ZingHead
  },
  props: {
    batchListBack: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      clickItem: {},
      currentIndex: 0,
      voucherInfos: []
    };
  },
  computed: {
    headTitle() {
      return "批次信息";
    }
  },
  created() {
    //this.loadVoucherItemDetails();
  },
  methods: {
    doSome() {
      this.$emit("batchListBack");
    },
    loadVoucherItemDetails(queryParams) {
      let that = this;
      let params = Object.assign({}, queryParams);
      this.$http
        .get("/zingbiz/resourceLibrary/voucherInfoDetail/selectDetailById", {
          params
        })
        .then(function(response) {
          if (response.data.success) {
            that.voucherInfos = response.data.data;
          }
        });
    },
    itemClick(val) {
      this.$emit("itemClick", val);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.otherInOrOutlist {
  .prompt {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #ff8000;
  }

  .left {
    height: 50px;
  }
}
</style>