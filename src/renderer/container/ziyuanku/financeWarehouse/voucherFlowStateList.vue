<template>
  <div class="innerMost">
    <zing-head :isComeBack="false" @doSome="doSome" v-if="showHead" :title="'财务凭证'"></zing-head>
    <div class="prompt" v-show="prompt">该状态下没有数据</div>
    <scroll ref="scroll">
      <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index" @click.native="itemJump(item)">
        <div slot="cardLeft" class="left">
          <avatar shape="square" :src="getImageUrl(item.pzShowImg,'./static/images/userDef_.jpg')"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.pzId}}</p>
            <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
          </div>
        </div>
        <div slot="cardRight" class="right">
          <i class="iconfont icon-gengduo" v-if="!isChoose" @click="lookingFor($event,item,index)"></i>
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
import { getImageUrl } from "@/utils/fn";
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
    },
    showHead: {
      default: false
    },
    isChoose: {
      default: false
    },
    ckId: {
      default: ""
    }
  },
  data() {
    return {
      clickItem: {},
      currentIndex: 0,
      prompt: false,
      tagText: "",
      dialogText: [],
      list: [],
      item: ""
    };
  },
  created() {
    this.loadVoucher();
  },
  methods: {
    getImageUrl,
    loadVoucher(startTime, endTime) {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/queryVoucher", {
          params: {
            ckId: this.ckId,
            pzStatus: this.pzStatus,
            voucherType: "CW",
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
    doSome() {
      this.$emit("voucherListBack");
    },
    //调用页面判断
    lookingFor: function($event, rowData, index) {
      $event.stopPropagation();
      this.clickItem = rowData;
      this.currentIndex = index;

      let _this = this;
      let menus = {};
      if (this.clickItem.pzStatus !== "WTJ") {
        menus.flow = "查看审批流";
      }
      if (
        this.clickItem.pzStatus === "WTJ" ||
        this.clickItem.pzStatus === "FQ"
      ) {
        menus.delete = "删除凭证";
      }

      this.$vux.actionsheet.show({
        menus,
        onMenuClick(text, key) {
          switch (key) {
            case "flow":
              _this.lookFlow();
              break;
            case "delete":
              _this.deleteVoucher();
              this.show = false;
          }
        }
      });
    },
    lookFlow() {
      const pzWorkId = this.clickItem.pzWorkId;
      const companyId = this.clickItem.companyId;
      if (pzWorkId) {
        // this.$router.push();
        this.$router.push({
          path: "/workflow/showNode",
          query: {
            companyId: companyId,
            workflow_id: pzWorkId
          }
        });
      }
    },
    //删除凭证
    deleteVoucher: function() {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.$http
            .get("/zingbiz/resourceLibrary/voucher/deleteVoucherInfo.action", {
              params: {
                pzRowId: _this.clickItem.rowId
              }
            })
            .then(res => {
              //如果成功了 重新加载界面
              if (res.data.success === true) {
                let index = _this.list.findIndex(val => {
                  return val.rowId === _this.clickItem.rowId;
                });
                _this.list.splice(index, 1);
              }
            });
        }
      });
    },
    //列表跳转
    itemJump: function(item) {
      if (this.isChoose) {
        this.$emit("voucherListItemClick", item);
      } else {
        let query = {
          pzRowId: item.rowId,
          companyId: item.companyId
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