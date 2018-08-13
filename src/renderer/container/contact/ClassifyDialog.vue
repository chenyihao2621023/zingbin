<template>
  <div>

      <x-dialog
          v-model="showDialog" hide-on-blur mask-z-index="5000"
          >
          <h3 class="classify-dialog-title">选择分类</h3>
          <grid-card class="sort-list-item" v-for="(item ,index) in menusList" :key="index">
              <div slot="cardLeft" class="left">
                  <div class="left-wrapper">
                      <p class="left-wrapper-title">{{item.tags}}</p>
                  </div>
              </div>
              <div slot="cardRight" class="right">
                  <button v-if="item.isCancel" class="sort-list-item-btn" @click="clickItemMenu(item)">移除</button>
                  <button v-else class="sort-list-item-btn" @click="clickItemMenu(item)">选择</button>
              </div>
          </grid-card>
          <p class="classify-dialog-close" @click="closeDialog">关闭</p>
      </x-dialog>
  </div>
</template>
<script>
    import { XDialog } from "vux"
    import GridCard from "../../components/gridcard/GridCard.vue"
    export default {
    name: 'ClassifyDialog',
    components: {
        XDialog,GridCard
    },
    props:{
        menusList: {
            type:Array,
            default() {
                return []
            }
        },
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
      return {}
    },
    computed: {},
    methods: {
        clickItemMenu(item) {
            this.$emit('settingType',item);
            this.showDialog = false;
        },
        closeDialog() {
            this.$emit('closeClassifyDig')
        }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .classify-dialog-title
        border-bottom: 1px solid #eaeefb
        height:30px
        line-height:30px
    .classify-dialog-close
        height:30px
        line-height:30px
        color: #FF8000
    .sort-list-item-btn
        background: #ff8000
        font-size : 13px
        border-radius :5px
        color : #fff
        border : none
</style>
