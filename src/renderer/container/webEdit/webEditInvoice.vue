<template>
  <div class="web-invoice">
    <zing-head title="发票信息">
      <span slot="header-right" class="head-jiahao"></span>
    </zing-head>
    <group>
      <x-input v-for="(leftItem,index) in leftMenu" :key="index" :title="leftItem.value"
               v-model="leftItem.type"></x-input>
    </group>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";
  import { XInput } from 'vux';

  const defaultLeftMenu = [
    { value: '抬头', type: '' },
    { value: '类型', type: '' },
    { value: '税号', type: '' },
    { value: '单位地址', type: '' },
    { value: '单位电话', type: '' },
    { value: '开户银行', type: '' },
    { value: '银行账号', type: '' }
  ];
  export default {
    name: "webEditInvoice",
    components: {
      ZingHead, XInput
    },
    data() {
      return {
        leftMenu: defaultLeftMenu,
      }
    },
    methods: {},
  }
</script>
<style scoped>

</style>
<style lang="stylus" scoped>

</style>
