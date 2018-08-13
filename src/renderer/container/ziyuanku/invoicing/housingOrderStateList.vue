<template>
  <div class="innerMost">
    <div class="prompt" v-show="prompt">该状态下没有数据</div>
    <scroll ref="scroll">
      <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index" @click.native="itemJump(item)">
        <div slot="cardLeft" class="left">
          <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="present"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.pzId}}</p>
            <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
          </div>
        </div>
      </GridCard>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { XDialog, Confirm, XButton } from "vux";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import scroll from "@/components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
export default {
  components: {
    GridCard,
    Avatar,
    Tag,
    XDialog,
    scroll,
    Confirm,
    XButton,
    ZingHead
  },
  props: {
    pzStatus: {
      default: "YSH"
    }
  },
  data() {
    return {
      clickItem: {},
      currentIndex: 0,
      prompt: false,
      showToast: false,
      show: false,
      tagText: "",
      dialogText: [],
      list: [],
      item: "",
      pzRowId: ""
    };
  },
  created() {
    this.loadVoucher();
  },
  methods: {
    loadVoucher(startTime, endTime) {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/queryVoucher", {
          params: {
            ckId: this.ckId,
            pzStatus: this.pzStatus,
            voucherType: "ZLDD",
            pageNumber: 0,
            pageSize: 2000,
            startTime,
            endTime
          }
        })
        .then(response => {
          if (response.data.total !== 0) {
            let data = response.data.data;
            this.list = data;
          } else {
            this.prompt = true;
          }
        });
    },
    //列表跳转
    itemJump: function(item) {
      let query = {
        pzRowId: item.rowId,
        companyId: item.companyId,
        voucherType: "ZLDD"
      };

      if (typeof item.ckId === "string" && item.ckId.length > 0) {
        if (item.ckId.split(" ").length === 1) {
          query.ckId = item.ckId;
        }
      }

      if (typeof item.ckName === "string" && item.ckName.length > 0) {
        if (item.ckName.split(" ").length === 1) {
          query.ckName = item.ckName.split("#")[1];
        }
      }

      this.$router.push({
        path: "/resourceLibrary/financeWarehouse/voucherAdd",
        query
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.innerMost {
  margin-top: 3px height calc(100% - 48px);
}

.tagColor {
  background-color: #00cccc !important;
}

.prompt {
  text-align: center color #ff8000 margin-top 20px font-size 18px;
}
</style>