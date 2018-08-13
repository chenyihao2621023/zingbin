<!--模板-->
<template>
    <div v-transfer-dom>
        <popup v-model="showMould" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
          <div class="typeWrap">
            <zing-head :isShowQuery="false" title="选择模板" :isComeBack="false" @doSome="backToAddManage">
                <!--<div slot="left"></div>-->
            </zing-head>
            <div class="content">
                <div class="variable">
                    <checklist ref="checklist" :max="1" :label-position="labelPosition" :options="commonList" v-model="checklistMould" @on-change="change"></checklist>
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
            showMould: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            selectedItem: {
                // 是否显示
                type: Array,
                default: function() {
                    return [];
                }
            },
        },
        watch: {
            selectedItem(){
                this.getChecklist001()
            }
        },
        data() {
          return {
             labelPosition: "right",
             commonList: [
                 { key:'1',value:'新员工管理' },
                 { key:'2',value:'用户反馈' } ,
                 { key:'3',value:'文案策划' },
                 { key:'4',value:'活动策划' } ,
                 { key:'5',value:'人事招聘' }],
             fullValues:[],
              checklistMould:[] //选中
         }
        },
        methods: {
            getChecklist001(){
                for (let i=0;i<this.commonList.length;i++) {
                    for (let j=0;j<this.selectedItem.length;j++) {
                        if (this.commonList[i].value === this.selectedItem[j]) {
                            this.checklist001.push(this.commonList[i].key)
                        }
                    }
                }
            },
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            checkSelected() {
                this.fullValues = this.$refs.checklist.getFullValue()
                this.$emit("checkSelectedMould", this.fullValues);
            },
            backToAddManage() {
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
