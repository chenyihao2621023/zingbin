<template>
    <div class="outWarpper">

        <ZingHead :title="title">
            <div slot="header-right">
              <span class="header-search">
                  <i class="iconfont icon-fangdajing" @click="search()"></i>
              </span>
            </div>
        </ZingHead>
        <div class="warning" v-show="flag">
            暂无数据
        </div>
        <div v-show="show">
            <group label-width="5.5em" label-margin-right="2em" label-align="right" class="groupStyle">
                <x-input title="审批流名称" v-model="value1"></x-input>
                <x-input title="流水号" v-model="value2"></x-input>
                <selector title="审批流模板" :options="list" :value="value3" @on-change="onChange"></selector>
                <selector title="审批流状态" :options="['工作流状态', '待处理','处理中','已完成','驳回']" v-model="value4"></selector>
                <x-button class="btn-save btn-defalut" @click.native="changeConfirm()">搜索</x-button>
            </group >
        </div>
        <div class="scroll-list-wrap">
            <scroll ref="scroll" :data="data">
                <GridCard v-for="(item,index) in data" :key="index">
                    <div slot="cardLeft" class="left" @click="jumpToflow(item)">
                        <avatar shape="square" :style="{background:'#fff'}">
                            <i v-if="item.templateIcon!=undefined && item.templateIcon.indexOf('zingIcon')>=0" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-shenpi1`]"></i>
                            <i v-else="" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                        </avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.workflow_name}}<p>
                            <div class="left-wrapper-desc">{{item.genTime}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <i v-if="item.threeCircle" class="iconfont icon-gengduo" @click="threeCircle(item)"></i>
                        <div class="tag-wrapper">
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>

        <popup v-model="show1" class="again" @click.native="again()">
            <div class="again-text">
                重新审批
            </div>
        </popup>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Group,XInput,Selector,XButton,Popup } from 'vux'
    export default {
        name: "work-order",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            ZingHead,
            Group,
            XInput,
            Selector,
            XButton,
            Popup
        },
        data() {
            return {
                title:"我的工单",
                data:[],
                value1:"",
                value2:"",
                value3:"mr",
                workflowId:"",
                value4:"工作流状态",
                list:[{ key:"mr",value:'工作流模板' }],
                show:false,
                show1:false,
                flag:false,
                item:"",
                templateData:"",
                params:{},
                isZYK:false
            }
        },
        created() {
            //判断标题
            if (this.$route.query.selType === "MORE") {
                this.title = "客服工单"
            }
            this.getDataForWorkOrder()
            this.getTemplateDataForWorkOrder()
        },
        methods:{
            //得到列表数据
            getDataForWorkOrder:function () {
                let that = this
                that.$http.post("/zingbiz/workflow/CustomerWorkflow/getDataForWorkOrder",{
                    workflowType: "KH",
                     companyId:that.$route.query.companyId
                }).then(function (res) {
                    that.data = res.data.data.data
                    if ( res.data.data.total === 0) {
                        that.flag = true
                    } else {
                        that.data.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.isZYK = false
                            //判断是不是资源库
                            if (item.workflowType === "MODULE_TYPE_ZYK") {
                                that.isZYK = true
                            }
                            if (item.workflow_state === "驳回" && !that.isZYK) {
                                item.threeCircle = true
                            } else {
                                item.threeCircle = false
                            }
                            return true
                        })
                    }

                })
            },
            //获取审批模板数据
            getTemplateDataForWorkOrder:function () {
                let that = this
                that.$http.post("/zingbiz/workflow/CustomerWorkflow/getTemplateDataForWorkOrder",{
                     companyId:that.$route.query.companyId
                }).then(function (res) {
                    that.templateData = res.data.data
                    that.templateData.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        that.list.push({ value:val.templateName,key:val.templateId })
                        return true
                    })
                })
            },
            //头部搜索
            search:function () {
                this.show = !this.show
            },
            //显示重新审批
            threeCircle(item) {
                this.item = item
                this.show1 = true
            },
            //重新审批
            again() {
                //重新审批发送请求，刷新当前页面
                let that = this
                that.$http.post("/zingbiz/workflow/helper/wfForCXSP" ,{
                    wfId:that.item.workflow_id,
                     companyId:that.$route.query.companyId
                }).then(function (res) {
                    if (res.data.success) {
                        that.show1 = false
                        that.getDataForWorkOrder()
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //筛选
            changeConfirm () {
                if (this.value1 !== "" ) {
                    this.params.workflow_name = this.value1
                }
                if (this.value2 !== "" ) {
                    this.params.workflow_id = this.value2
                }
                if (this.workflowId !== "") {
                    this.params.workflow_sort_id = this.workflowId
                }
                if (this.value4 !== "" && this.value4 !== "工作流状态") {
                    this.params.workflow_state = this.value4
                }
                this.params.companyId = this.$route.query.companyId
                this.params.workflowType = "KH"
                this.params.gridtab = "FQ"
                console.log(this.params)
                let that = this
                that.$http.post("/zingbiz/workflow/workFlowQuery/getWorkflowDataByFilter",that.params).then(function (res) {
                    that.data = res.data.data.data
                    if ( res.data.data.total === 0) {
                        that.flag = true
                    } else {
                        that.show = false
                        that.data.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.isZYK = false
                            //判断是不是资源库
                            if (item.workflowType === "MODULE_TYPE_ZYK") {
                                that.isZYK = true
                            }
                            if (item.workflow_state === "驳回" && !that.isZYK) {
                                item.threeCircle = true
                            } else {
                                item.threeCircle = false
                            }
                            return true
                        })
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //选择改变的时候
            onChange(val) {
                if (val === "mr") {
                    this.workflowId = ""
                } else {
                    this.workflowId = val
                }
            },
            // 页面跳转
            jumpToflow(item) {
                console.log("跳转")
                let woowId = item.woow_chat_id;
                this.$router.push({ path:"/workflow/showNode",query:{ companyId:this.$route.query.companyId,workflow_id:woowId }})
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .groupStyle{
        padding 0 3rem
        padding-bottom 20px
        .weui-cells{
            .vux-selector{
                font-size 14px !important
            }
            .vux-x-input{
                font-size 14px !important
            }
        }
    }
    .outWarpper{
        height calc(100%-50px)
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }
    .again{
        bottom 50%
        transform translateY(-50%)
        width 80%
        margin-left 10%
        text-align center
        padding 15px
    }
    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
</style>
