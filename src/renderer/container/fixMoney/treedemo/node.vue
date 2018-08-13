<template>
    <div class="scroll-list-wrap">
                    <ul class="lg-tree" v-show="visible">
                        <li class="lg-tree-item">
                            <GridCard>
                                 <div slot="cardLeft" class="left">
                                      <div class="left-wrapper">
                                        <div class="lg-tree-content">
                                        <span class="lg-tree-icon" v-show="isShow" @click="toJumpPage" >
                                            <i class="iconfont" :class="`icon-${icon}`"></i>
                                        </span>
                                            <tree-render v-if="data.render" :render="data.render"
                                                :node="data" :parentNode="parentNode"
                                                @click="clickNode(data, parentNode)"></tree-render>
                                            <span @click="clickNode(data, parentNode)">
                                                {{ data.title }}-{{ data.Name }}
                                            </span>
                                        <div slot="cardRight" class="right" v-if="data.children && data.children.length > 0" @click="handleExpand">
                                            <a style="width:40px;height: 40px;" class="iconfont icon-xiajiantou"></a>
                                        </div>
                                    </div>
                                      </div>
                                 </div>

                            </GridCard>
                            <tree-node class="lg-tree-node" v-for="(item,index)
                            in data.children" :key="index" :isShow="isShow"
                            :visible="data.expand" :data="item"
                            :parentNode="data" :iconfont="iconfont"></tree-node>
                        </li>
                    </ul>
                </div>
</template>

<script>
import {
Cell,
Group
} from "vux";
import GridCard from "@/components/gridcard/GridCard";
import render from "./render.js";
import { EventBus } from './evenbus.js';
export default {
  name: "TreeNode",
  components: {
    "tree-render": render,
    GridCard,
    Cell,
    Group
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    parentNode: {
      type: Object,
      default: function() {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
      iconfont: {
        type: Array,
        default: function () {
          return ['tianjia1']
        }
      }
  },
  data() {
    return {
          menu: [
          {
            title: '002',
            children: [
              {
                title: '002.001'
              }
            ]
          },
          {
            title: '003'
          },
          {
            title: '004'
          },
          {
            title: '004”'
          }
        ]
    };
  },
computed: {
      icon: function () {
        return this.iconfont[0]
      }
    },
  methods: {
    handleExpand: function() {
      this.$set(this.data, "expand", !this.data.expand);
      EventBus.$emit(
        "on-toggle-expand",
        this.data.expand,
        this.data,
        this.parentNode
      );
    },
      clickNode: function (node, parentNode) {
        EventBus.$emit('on-click-node', node, parentNode)
      },
        toJumpPage: function () {
            this.$set(this.data);
             EventBus.$emit('toJumpPage',this.data)
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lg-tree-scroll-list-wrap .lg-tree-nodenode{
    padding-left: -15px;
}
.lg-tree {
  margin-bottom: 0;
  margin-top: 6px;
  /* margin-bottom: -6px; */
  padding-left: 0;
}
.lg-tree ul {
  padding-left: 19px;
}
.lg-tree li {
  list-style: none;
}
.lg-tree .lg-tree-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.lg-tree .lg-tree-icon {
  width: 16px;
  display: inline-block;
  vertical-align: center;
  margin-right: 3px;
  cursor: pointer;
}
.lg-tree .lg-tree-right {
  width: 16px;
  /* display: inline-block; */
  vertical-align: center;
  float: right;
  margin-right: 3px;
  cursor: pointer;
}
</style>
