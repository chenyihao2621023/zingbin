<!--关联任务-->
<template>
    <div v-transfer-dom >
        <popup v-model="showrelation" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="ralationWrap">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>
                <!--内容区-->
                <div class="relaScrollWrap">
                    <Scroll :scrollbar="true" ref="scrollContent">
                        <div class="modalWrap">
                            <!--内容区-->
                            <el-tree
                                class="filter-tree"
                                :data="data2"
                                :props="defaultProps"
                                default-expand-all
                                show-checkbox
                                :filter-node-method="filterNode"
                                ref="tree2">
                            </el-tree>
                        </div>
                    </Scroll>
                </div>
                <!--底部-->
                <div class="relationBottom">
                    <flexbox>
                        <flexbox-item >
                            <x-button type="warn" @click.native="cancelRelation">取消</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="primary">确定</x-button>
                        </flexbox-item>
                    </flexbox>
                </div>
           </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,XButton,Flexbox, FlexboxItem,Search } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
  export default{
      components: { Popup,ZingHead,XButton,Flexbox, FlexboxItem,Search},
      props: {
          showrelation: {
              // 是否显示
              type: Boolean,
              default: function() {
                  return false;
              }
          },
      },
      data() {
          return {
              filterText: '',
              data2: [{
                  id: 1,
                  label: '任务集',
                  children: [{
                      id: 4,
                      label: '子任务',
                      children: [{
                          id: 9,
                          label: '任务一'
                      }, {
                          id: 10,
                          label: '任务二'
                      }]
                  }]
              }, {
                  id: 2,
                  label: '任务集2',
                  children: [{
                      id: 5,
                      label: '子任务21'
                  }, {
                      id: 6,
                      label: '任务22'
                  }]
              }, {
                  id: 3,
                  label: '任务集3',
                  children: [{
                      id: 7,
                      label: '字任务33'
                  }, {
                      id: 8,
                      label: '任务33'
                  }]
              }],
              defaultProps: {
                  children: 'children',
                  label: 'label'
              }
          }
      },
      watch: {
          filterText(val) {
              this.$refs.tree2.filter(val);
          }
      },
      methods: {
          cancelRelation() {
             this.$emit('closeRelation')
          },
          //搜索
          filterNode(value, data) {
              if (!value) return true;
              return data.label.indexOf(value) !== -1;
          }
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../../assets/stylus/variable.styl';
    @import '../../../../assets/stylus/mixin.styl';
   .ralationWrap
       height calc(100%-60px)
       .el-input
          margin 10px
          width 95%
      .relaScrollWrap
          height calc(100%-45px)
      .relationBottom
         .vux-flexbox-item
             margin-right -10px
             .weui-btn_warn
                 background-color #40AFFC
</style>
