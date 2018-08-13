<template>
  <div class="finalCheckout">
    <zing-head title="期末结账">
    </zing-head>
    <div class="tips">
      <div v-show="showCheckoutTips" class="checkoutTips">
        <div class="table">
          <div class="table-tr">
            <div class="table-td">
              为了总结某一会计期间（年度或月度）的经营活动情况，必须定期进行结账。
            </div>
          </div>
          <div class="table-tr">
            <div class="table-td">
              在结账之前，应先检查本期发生的各种凭证是否都已登记入账。对各种成本费用类账户，也应当在结账前对余额进行结转，并登记入账
            </div>
          </div>
        </div>
      </div>
      <div v-show="showCounterCheckoutTips" class="counterCheckoutTips">
        <div>
          您可以利用“反结账”工具将当前会计期间返回到已结账的期间，所有当期已过账凭证可以选择自动反过账，建议慎重使用反结账功能！
        </div>
      </div>
      <div style="margin-top:10px;background-color:#fff;height:100%;overflow:hidden">
        <group>
          <radio :options="checkoutOptions" v-model="checkoutData"></radio>
        </group>
      </div>
    </div>
    <flexbox :gutter="0">
      <flexbox-item>
        <x-button class="btn-common" type="warn" ref="checkoutTipsRef" @click.native="startFinalCheckout">开始</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead";
import { Flexbox, FlexboxItem, XButton, Group, Radio } from "vux";
export default {
  name: "finalCheckout",
  components: {
    ZingHead,
    Flexbox,
    FlexboxItem,
    XButton,
    Group,
    Radio
  },
  data() {
    return {
      showCheckoutTips: true,
      showCounterCheckoutTips: false,
      checkoutOptions: [
        {
          key: "checkout",
          value: "结账"
        },
        {
          key: "counterCheckout",
          value: "反结账"
        }
      ],
      checkoutData: "checkout"
    };
  },
  computed: {},
  watch: {
    checkoutData(newVal, oldVal) {
      if (newVal === "checkout") {
        this.showCheckoutTips = true;
        this.showCounterCheckoutTips = false;
      } else {
        this.showCounterCheckoutTips = true;
        this.showCheckoutTips = false;
      }
    }
  },
  methods: {
    startFinalCheckout() {
      let params = {
        flag: this.checkoutData === "checkout" ? true : false
      };
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/finalCheckout.action", {
          params
        })
        .then(res => {
          if (res.data.success) {
            if (params.flag) {
              this.$vux.toast.text(
                "已对" +
                  res.data.data.substring(0, 7).replace("-", "年") +
                  "期凭证进行结账"
              );
            } else {
              this.$vux.toast.text(
                "已对" +
                  res.data.data.substring(0, 7).replace("-", "年") +
                  "期凭证进行反结账"
              );
            }
          } else {
            if (res.data.msg === "-1") {
              this.$vux.toast.text("不能对当前月份进行结账");
            } else if (res.data.msg === "-2") {
              this.$vux.toast.text(
                res.data.data.substring(0, 7).replace("-", "年") +
                  "期存在未过账凭证，无法执行过账操作"
              );
            } else if (res.data.msg === "-3") {
              this.$vux.toast.text(
                res.data.data.substring(0, 7).replace("-", "年") +
                  "期存在未过账卡片，无法执行过账操作"
              );
            } else if (res.data.msg === "-4") {
              this.$vux.toast.text("不存在结账期间");
            }
          }
        });
    }
  }
};
</script>

<style scoped lang="stylus">
.finalCheckout {
  height: 100%;

  .tips {
    height: calc(100% - 94px);
    line-height: 20px;
    background-color: #F8F8F8;

    .checkoutTips {
      padding: 0px 13px 13px 13px;
      background-color: #fff;
      line-height: 22px;

      .table {
        display: table;
        width: 100%;

        .table-tr {
          display: table-row;
          height: 30px;
        }

        .table-td {
          padding-top: 13px;
          display: table-cell;
          height: 100%;
          text-align: left;
          vertical-align: middle;
        }

        .table-td-icon {
          width: 20px;
          vertical-align: top;
          padding-right: 5px;

          i {
            font-size: 20px !important;
          }
        }
      }
    }

    .counterCheckoutTips {
      padding: 13px;
      background-color: #fff;
      line-height: 22px;
    }
  }
}
</style>