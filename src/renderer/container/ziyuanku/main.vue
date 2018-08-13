<template>
    <div id="resourceMain" class="resourceMain">
        <router-view style="height:100%"/>
    </div>
</template>

<script>
export default {
  name: "resourceMain",
  data() {
    return {};
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.resourceMain {
    height: 100%;
    width: 100%;
}
</style>
