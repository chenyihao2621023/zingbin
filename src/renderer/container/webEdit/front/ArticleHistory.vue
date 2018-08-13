<template>
  <div class="main">
    <div>
      <ZingHead :title="title"></ZingHead>
    </div>
    <graphic-list-comp :menuId="menuId"></graphic-list-comp>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";
  import GraphicListComp from "../components/GraphicListComp"

  export default {
    name: 'article-history',
    components: { ZingHead, GraphicListComp },
    data() {
      return {
        title: "",
        menuId: "",
        articleList: [],
      }
    },
    created() {
      this.menuId = this.$route.query.menuId;
      this.title = this.$route.query.title;
      this.getDataByMenuId();
    },
    methods: {
      getDataByMenuId() {
        let vm = this;
        let params = { menuId: this.menuId };
        vm.$http
          .get('/zingbiz/tuwen/tuwenManage/getMenuDetailsByMenuId', params)
          .then(res => {
            console.log('list', res.data);
            if (res.data.success) {
              vm.articleList = res.data.data;
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
  }
</style>
