<template>
  <div class="cascader-demon" ref="row">
    <cascader ref="cascader" :data="options" @change="change" ></cascader>
  </div>
</template>

<script>
import Cascader from './cascader'
import { toTreeData } from '../../utils/fn'

export default {
  name: "CascaderDemon",
  components: {
    Cascader
  },
  data() {
    return {
      options: []
    };
  },
  methods: {
    change() {

    }
  },
  created() {

  },
  mounted() {
    let url = 'https://easy-mock.com/mock/5a6840b43d63972d717dc5b4/webapp/subject/tree/queryall'
    this.$http.post(url,{}).then( res => {
      let data = res.data.data.data.data
      let treeData = toTreeData(data,'kemushezhi')
      this.options = treeData
    })
  }
  
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

</style>

