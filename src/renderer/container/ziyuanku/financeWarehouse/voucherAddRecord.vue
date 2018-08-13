<template>
  <div class="voucherAddRecord">

    <ul v-if="jiluData.length > 0">
      <li v-for="(item,index) in jiluData" :key="index">
        <GridCard>
          <div slot="cardLeft" class="left">
            <!--<avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="zhuanrengong" size="large"></avatar>-->
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.recordStatus}}</p>
              <div class="left-wrapper-desc">{{item.genTime}}</div>
            </div>
          </div>
          <div slot="cardRight" class="right">
            {{item.cardUserName}}
          </div>
        </GridCard>
      </li>
    </ul>
    <ul v-else>
      <div class="no-data-style">
        暂无操作记录
      </div>
    </ul>
  </div>

</template>

<script>
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";

export default {
  name: "financialJiLu",
  components: {
    GridCard,
    Avatar,
    Scroll,
    Tag
  },
  data() {
    return {
      jiluData: []
    };
  },
  created: function() {
    let rowId = this.$route.query.pzRowId;
    if (typeof rowId !== "undefined") {
      this.loadRecord(rowId);
    }
  },
  methods: {
    loadRecord(pzId) {
      let url = "/zingbiz/resourceLibrary/record/searchRecord";
      let params = {
        pzId
      };
      this.$http.get(url, { params }).then(res => {
        if (res.data.success) {
          this.jiluData = res.data.data;
        } else {
          this.$message({ type: "error", message: "加载失败，请重试" });
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.voucherAddRecord {
  height: 100%;
  background-color: #fff;

  .left {
    height: 50px;
  }

  .no-data-style {
    color: #ff8000;
    font-size: 18px;
    padding-top: 15px;
    min-height: 100px;
    text-align: center;
  }
}
</style>