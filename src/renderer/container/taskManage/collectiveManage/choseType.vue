<!--类型-->
<template>
    <div v-transfer-dom>
        <popup v-model="showType" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
          <div class="typeWrap">
            <zing-head :isShowQuery="false" title="选择类型" :isComeBack="false" @doSome="backAddManage">
            </zing-head>
            <div class="content">
                <div class="variable">
                    <checklist ref="checklist" :max="1" :label-position="labelPosition" :options="commonList" v-model="checklist001" @on-change="change"></checklist>
                </div>
                <div class="bottom">
                    <div>
                        <x-button class="subject-picker-button" type="primary" @click.native="checkSelected">选择</x-button>
                    </div>
                </div>
            </div>
          </div>
        </popup>
    </div>
</template>
<script>
    import {
        Checklist,
        XButton,
        Popup,
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import _ from "lodash"
    import { mapMutations } from 'vuex'
    export default{
        components: {
          ZingHead,Checklist,XButton,Popup
        },
        props: {
            showType: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            selectedItem: {
                // 是否显示选中
                type: Array,
                default: function() {
                    return [];
                }
            },
        },
        data() {
          return {
             labelPosition: "right",
             commonList: [{ key:'1',value:'市场管理' }, { key:'2',value:'销售管理' } ,
                 { key:'3',value:'交付管理' },{ key:'4',value:'合同管理' }],
             fullValues:[],
             checklist001:[] //选中
         }
        },
        watch: {
            selectedItem(){
                this.getChecklist001()
            }
        },
        methods: {
            getChecklist001(){
              for (let i=0;i<this.commonList.length;i++) {
                let list = this.commonList[i]
                for (let j=0;j<this.selectedItem.length;j++) {
                  let item = this.selectedItem[j]
                  if (list.value.trim() === item.boardProperty.trim()) {
                    this.checklist001.push(list.key)
                  }
                }
              }
            },
            checkSelected() {
                this.fullValues = this.$refs.checklist.getFullValue()
                this.$emit("checkSelectedType",this.fullValues );
            },
            backAddManage() {
                this.$emit("abort")
            },
        }
    }


</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
 .typeWrap
   height 100%
   .content
      display flex
      flex-flow row wrap
      width 100%
      background-color white
      height calc(100% -50px) !important
     .variable
        width 100%
        height: calc(100% -50px);
        align-self flex-start
        overflow: auto;
     .bottom
        width 100%
        height 50px
        align-self flex-end
</style>
