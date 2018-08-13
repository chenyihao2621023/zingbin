<template>
  <div class="voucherPost">
    <zing-head title="凭证过账"></zing-head>
    <div class="tips">
      提示：
      <br/> 一、凭证过账仅针对已审核通过的凭证，对于未审核通过的不执行过账操作。
      <br/> 二、该过账操作针对所有凭证
    </div>
    <div class="main">
      <div class="content">
        <div class="title">
          请选择凭证范围
        </div>
        <group>
          <radio :options="rangeOptions" @on-change="showDateTime" value="all"></radio>
          <datetime v-show="isShowDateTime" v-model="specifiedDate" title="选择日期<span style='color: red;'>*</span>"></datetime>
        </group>
      </div>
      <x-button class="btn-common" type="warn" @click.native="startVoucherPost()">开始过账</x-button>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Radio, Datetime, XButton } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
export default {
  name: "voucherPost",
  components: {
    ZingHead,
    Group,
    Cell,
    Radio,
    Datetime,
    XButton
  },
  data() {
    return {
      specifiedDate: "2015-11-12",
      isShowDateTime: false,
      rangeOptions: [
        {
          key: "all",
          value: "全部未过账凭证"
        },
        {
          key: "date",
          value: "指定日期之前的凭证"
        }
      ]
    };
  },
  created() {
    this.getNewDate();
  },
  methods: {
    showDateTime(val) {
      if (val === "date") {
        this.isShowDateTime = true;
      } else {
        this.isShowDateTime = false;
      }
    },
    getNewDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let date = new Date().getDate();
      date = date > 9 ? date : "0" + date;
      this.specifiedDate = year + "-" + month + "-" + date;
    },
    startVoucherPost() {
      let params = {
        flag: true
      };
      if (this.isShowDateTime) {
        params.specifiedDate = this.specifiedDate;
      }
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/voucherPost.action", {
          params
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.msg === "1") {
              this.$vux.toast.text("存在未审核、未提交或废弃凭证，无法过账");
            } else if (res.data.msg === "2") {
              this.$vux.toast.text("不存在需要过账的凭证");
            } else {
              this.$vux.toast.text("过账成功");
            }
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.voucherPost {
  height: 100%;
  background-color: #F8F8F8;

  .tips {
    height: 110px;
    font-size: 14px;
    background-color: #fff;
    line-height: 20px;
    padding: 13px;
    margin-bottom: 10px;
  }

  .main {
    height: calc(100% - 170px);
    background-color: #fff;

    .content {
      font-size: 16px;
      height: calc(100% - 44px);

      .title {
        height: 44px;
        line-height: 44px;
        padding-left: 13px;
      }
    }
  }
}
</style>