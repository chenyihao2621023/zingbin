<template>
    <div>
        <other-in-or-out v-if="otherInOrOutShow"></other-in-or-out>
        <voucher-add v-if="voucherAddShow"></voucher-add>
        <other-in-or-out-voucher v-if="childOtherInOrOutShow"></other-in-or-out-voucher>
        <invoicing-add-or-update v-if="invoicingShow"></invoicing-add-or-update>
    </div>
</template>

<script>
import OtherInOrOut from "./goodsWarehouse/otherInOrOut";
import OtherInOrOutVoucher from "./goodsWarehouse/otherInOrOutVoucher";
import VoucherAdd from "./financeWarehouse/voucherAdd";
import InvoicingAddOrUpdate from "./invoicing/addOrUpdate";
export default {
  name: "accountingDistribute",
  data() {
    return {
      otherInOrOutShow: false,
      childOtherInOrOutShow: false,
      voucherAddShow: false,
      invoicingShow: false
    };
  },
  components: {
    OtherInOrOut,
    VoucherAdd,
    OtherInOrOutVoucher,
    InvoicingAddOrUpdate
  },
  created() {
    let voucherType = this.$route.query.voucherType;
    let parentId = this.$route.query.parentId;
    if (voucherType === "otherIn" || voucherType === "otherOut") {
      if (typeof parentId === "string" && parentId.length > 0) {
        this.childOtherInOrOutShow = true;
      } else {
        this.otherInOrOutShow = true;
      }
    } else if (voucherType === "CW") {
      this.voucherAddShow = true;
    } else {
      this.invoicingShow = true;
    }
  }
};
</script>

<style scoped>
</style>