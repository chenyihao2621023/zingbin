<template>
  <div class="lg-tree-wrapper">
    <node
      v-for="(item,index) in data"
      :key="index"
      :data="item"
      :isShow="isShow"
      :iconfont="icon"
      :visible="visible"

    ></node>
  </div>
  </template>
<script>
import { EventBus } from './evenbus.js';
  import Node from './node.vue'
  export default {
    components: {
      Node
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      visible: {
        type: Boolean,
        default: true
      },
       isShow: {
        type: Boolean,
        default: false
      },
      icon: {
        type: Array,
        default: function () {
          return ['tianjia1']
        }
      }
    },
    created () {
     EventBus.$on('on-toggle-expand', (status, node, parent) => {
        this.$emit('toggle-expand', status, node, parent)
      })
      EventBus.$on('on-click-node', (node, parent) => {
        this.$emit('click-node', node, parent)
      })
       EventBus.$on('toJumpPage',node => {
        this.$emit('JumpPage',node)
      })
    },
    method:{
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  li{
    list-style: none;
  }
</style>
