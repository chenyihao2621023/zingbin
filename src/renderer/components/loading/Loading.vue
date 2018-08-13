<template>
  <div class="mf-loading-container">
    <img src="../../assets/img/loading.gif">
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'

  export default {
    name: COMPONENT_NAME
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .mf-loading-container
    img
      width: 20px; /* px */
      height: 20px; /* px */
      display: block
</style>
