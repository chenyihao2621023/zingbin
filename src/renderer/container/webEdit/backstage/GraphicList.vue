<template>
  <div class="main">
    <div>
      <ZingHead :title="title"></ZingHead>
    </div>
    <graphic-list-comp :menuId="menuId" :showEditIcon="true" :jumpToWhere="'edit'"></graphic-list-comp>
    <x-button type="primary" @click.native="addArticle()">新建图文消息</x-button>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";
  import GraphicListComp from "../components/GraphicListComp"
  import { XButton } from 'vux'

  export default {
    name: 'GraphicList',
    components: { ZingHead, XButton, GraphicListComp },
    data() {
      return {
        title: "图文消息",
        menuId: "",
      }
    },
    created() {
      this.menuId = this.$route.query.menuId;
    },
    methods: {
      addArticle() {
        this.$router.push({
          path: "/addGraphic",
          query: {
            menuId: this.menuId,
            type: "0",
          }
        })
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import '../../../assets/stylus/mixin.styl';
  .main {
    flex-column(column)
    overflow: hidden;
    justify-content space-between;
  }
</style>
