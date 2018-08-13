<template>
    <div class="outerMost">
        <ZingHead title="我发起的">
            <div slot="header-right">
              <span class="header-search">
                  <i class="iconfont icon-fangdajing" @click="search()"></i>
              </span>
            </div>
        </ZingHead>
        <div v-show="defalut1" class="defalut1">
            <div class="vue-tab">
                <tab class="" :line-width="2">
                    <tab-item :selected="defaultTab === item" v-for="(item, index) in tabTitle" :key="index" @on-item-click="changeTab">{{item}}</tab-item>
                </tab>
            </div>

            <div class="tab-content">
                <div class="tabDiv" v-show="show1">
                    <workflowMyStart :param="param1" :showFlag="show1"></workflowMyStart>
                </div>
                <div class="tabDiv" v-show="show2">
                    <workflowMoment :param="param2" :showFlag="show2"></workflowMoment>
                </div>
            </div>
        </div>


        <workflowSearch
            :popup="popup"
            :textType = "textType"
            :title="title"
            mType="FQ"
            @cancle="cancle"
            @changeConfirm = "changeConfirm"
        >
        </workflowSearch>
    </div>
</template>

<script>
    import { Tab, TabItem } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    import workflowMoment from '../workflow/ApprovalTemplate/workflowMoment';
    import workflowMyStart from '../workflow/ApprovalTemplate/workflowMyStart';
    import workflowSearch from "./ApprovalTemplate/workflowSearch";
    export default {
        name: "workflow-myself",
        components:{
            Tab,
            TabItem,
            ZingHead,
            workflowMoment,
            workflowMyStart,
            workflowSearch
        },
        data() {
            return {
                title:"我发起的",
                tabTitle: ["我发起的", "暂存"],
                defaultTab:"我发起的",
                show1:true,
                show2:false,
                popup:false,
                textType:[
                    { value:"审批标题" ,dataId:"mingcheng" },
                    { value:"审批模版" ,dataId:"moban" },
                    { value:"审批内容" ,dataId:"zhixingneirong" },
                    { value:"流水号" ,dataId:"liushuihao" }
                ],
                param1:{},
                param2:{},
                defalut1:true
            }
        },
        methods: {
            changeTab(index) {
                if (index === 0) {
                    this.show1 = true
                    this.show2 = false
                } else if (index === 1) {
                    this.show1 = false
                    this.show2 = true

                }
            },
            search() {
                this.defalut1 = false
                this.popup = true
            },
            cancle() {
                this.popup = false
                this.defalut1 = true
            },
            changeConfirm(value) {
                this.param1 = {}
                this.param2 = {}
                if (this.show1) {
                    this.param1 = value
                    delete this.param1.gridTab
                } else if (this.show2) {
                    this.param2 = value
                    delete this.param2.gridTab
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outerMost{
        height 100%
        .defalut1{
            height 100%
            .tab-content{
                height 100%
                .tabDiv{
                    height calc(100% - 97px);
                }
            }
        }

    }
</style>
