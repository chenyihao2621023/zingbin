<template>
  <div class="document-cabinet">
      <explorer-component
          myTitle="知识库"
          :multipleMode="true"
          :companyIdAndRecordType="companyIdAndRecordType"
          :noteMode = "true"
          @backClick="backClick">
      </explorer-component>
  </div>
</template>
<script>
    import ExplorerComponent from "../../components/explorer/Explorer.vue"
    import { mapMutations } from 'vuex';
  export default {
    name: 'DocumentCabinet',
    components: {
        ExplorerComponent
    },
    data() {
      return {}
    },
    computed: {
        companyIdAndRecordType() {
            if (this.$route.query.companyId) {
              return `${this.$route.query.companyId} appnote`
            }
        },
    },
      beforeRouteEnter(to, from, next) {
          // 在渲染该组件的对应路由被 confirm 前调用
          // 不！能！获取组件实例 `this`
          // 因为当守卫执行前，组件实例还没被创建
          next(vm => {
              // 通过 `vm` 访问组件实例
              vm.setMode(false)
          })
      },
      beforeRouteLeave(to, from, next) {
          // 导航离开该组件的对应路由时调用
          // 可以访问组件实例
          this.setMode(true);
          next();
      },
    methods: {
        ...mapMutations({
            setMode: 'SET_MODE'
        }),
        backClick() {
            this.$router.go(-1)
        },
    },
  }
</script>
<style lang="stylus" scoped>
    /*.document-cabinet*/
       /*width 100%*/
      /*height 100%*/
</style>
