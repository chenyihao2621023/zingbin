<template>
    <div id="innerwapper">
        <div class="warning" v-show="flag">
            暂无数据
        </div>
        <div class="scroll-list-wrap">
            <scroll
                ref="scroll"
                :data="WorkflowData"
                :pullUpLoad="pullUpLoad"
                @pullingUp="onPullingUp"
            >
                <GridCard v-for="(item,index) in WorkflowData" :key="index">
                    <div slot="cardLeft" class="left" @click="jumpFlow(item)">
                        <avatar shape="square" :style="{background:'#fff'}">
                            <i v-if="item.templateIcon!=undefined && item.templateIcon.indexOf('zingIcon')>=0" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-shenpi1`]"></i>
                            <i v-else="" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                        </avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.workflow_name}}</p>
                            <div class="left-wrapper-desc">{{item.genTime}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <i v-if="item.threeCircle" class="iconfont icon-gengduo" @click="threeCircle(item)"></i>
                        <div class="tag-wrapper">
                            <tag type ="success" v-if="item.KH">客服</tag>
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>

        <popup v-model="show" class="again" @click.native="again()">
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
    import { Confirm,Popup  } from 'vux'
    export default {
        name: "wrkflow-my-start",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            Confirm,
            Popup
        },
        props: {
            param: {
                type: Object,
            },
            showFlag:{
                type:Boolean
            }
        },
        data() {
            return {
                WorkflowData:[],
                flag:false,
                isZYK:false,
                item:"",
                show:false,
                retcode:"",
                companyId:"",
                workflowType:"",
                workflow:"",
                pageNumber:1,
                pageSize:20,
                total:"",
                screen:false,
                success:true,
                screenSuccess:true,
                newValue:{},
                pullUpLoad:{ threshold: 0,txt: { more: '加载更多',noMore: '没有更多数据' }}
            }
        },
        watch:{
            param:{
                handler(newValue, oldValue) {
                    let that = this
                    if (JSON.stringify(newValue) !== "{}") {
                        delete newValue.gridtab
                        newValue.pageSize = 20
                        newValue.pageNumber = 1
                        that.screenSuccess = true
                        that.newValue = newValue
                        that.WorkflowData = []
                        that.flag = false
                        that.screen = true
                        that.screenMethod(newValue)
                    }
                },
                deep: true
            },
            showFlag:{
                handler(newValue) {
                    if (newValue) {
                        this.$refs.scroll.enable()
                        this.$refs.scroll.refresh()
                    } else {
                        this.$refs.scroll.disable()
                    }
                },
                deep:true
            }
        },
        created() {
            // this.companyId = "company59915700000000101"
            this.workflowType = this.$route.query.workflowType
            this.companyId = this.$route.query.companyId
            this.isInOwnCompany()
            this.getWorkflowData(this.pageNumber)
        },
        methods: {
            getWorkflowData(pageNumber) {
                let that = this
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData",{
                    personStatus: "FQ",
                    pageNumber:pageNumber,
                    pageSize:20
                }).then(function (res) {
                    that.success = res.data.success
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    if ( parseInt(res.data.data.total) === 0) {
                        that.flag = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.WorkflowData.push( res.data.data.data[i])
                        }
                        that.$refs.scroll.refresh();
                        that.WorkflowData.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.isZYK = false
                            //判断是不是资源库
                            if (item.workflowType === "MODULE_TYPE_ZYK") {
                                that.isZYK = true
                            }
                            if (item.workflow_state === "驳回" && !that.isZYK && item["workflowType"] !== "KH") {
                                 item.threeCircle = true
                            } else {
                                item.threeCircle = false
                            }
                            if (item.workflowType === "KH") {
                                item.KH = true
                            } else {
                                item.KH = false
                            }
                            return true
                        })
                        if (that.pageNumber * that.pageSize > res.data.data.total) {
                             that.success = false
                        }
                        that.pageNumber = that.pageNumber + 1
                    }
                })
            },
            isInOwnCompany:function () {
                let that = this
                that.$http.post("/ZingMH/ZKM/MENHUWX/MHHelper/isInOwnCompany.action",{
                }).then(function (res) {
                    that.retcode = res.data.retcode
                }).catch(function (error) {
                    console.log(error)
                })
            },
            jumpFlow(item) {
                if (this.retcode === 0 && (this.workflowType === "YG" || this.workflowType === "MODULE_TYPE_ZYK")) {
                    if (item.workflow_state !== null && item.workflow_state !== "" && item.workflow_state !== "待处理") {
                        this.workflow = item.woow_chat_id
                        this.$router.push({
                            path:"/workflow/showNode",
                            query:{
                                companyId:this.companyId,
                                workflow_id:this.workflow
                            }
                        })
                    } else {
                        this.$router.push({
                            path:"/workflow/customLaunchWorkflow",
                            query:{
                                id:item.workflow_id,
                                companyId:this.companyId,
                                _t:new Date().getTime()
                            }
                        })
                    }
                } else {
                    this.workflow = item.woow_chat_id
                    this.$router.push({
                        path:"/workflow/showNode",
                        query:{
                            companyId:this.companyId,
                            workflow_id:this.workflow
                        }
                    })
                    // window.location.href = "/SRender?jsLoader=workflowES%2FshowNodeEsLoader&tpl=workflowES%2FshowNodeEs&companyId=" + this.companyId + "&workflow_id=" + this.workflow + "&v=1.13180319_1317";
                }
            },
            //显示重新审批样式
            threeCircle(item) {
                this.item = item
                this.show = true
            },
            // 重新审批
            again() {
               //发送请求 刷新当前界面
                let that = this
                that.$http.post("/zingbiz/workflow/helper/wfForCXSP",{
                   wfId: that.item.workflow_id,
                   companyId:that.companyId
                }).then(function (res) {
                    if (res.data.success) {
                        that.show = false
                        that.getWorkflowData()
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            onPullingUp() {
                if (this.screen) {
                    if (this.screenSuccess) {
                        this.screenMethod(this.newValue)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        this.$refs.scroll.forceUpdate(false);
                    }
                } else {
                    if (this.success) {
                        this.getWorkflowData(this.pageNumber)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        this.$refs.scroll.forceUpdate(false);
                    }
                }
            },
            screenMethod(newValue) {
                let that = this
                console.log(newValue)
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getWorkflowDataForMyCreate",newValue).then(function (res) {
                    that.total = res.data.data.total
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    if ( parseInt(res.data.data.total) === 0) {
                        that.flag = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.WorkflowData.push( res.data.data.data[i])
                        }
                        that.WorkflowData.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.isZYK = false
                            //判断是不是资源库
                            if (item.workflowType === "MODULE_TYPE_ZYK") {
                                that.isZYK = true
                            }
                            if (item.workflow_state === "驳回" && !that.isZYK && item["workflowType"] !== "KH") {
                                item.threeCircle = true
                            } else {
                                item.threeCircle = false
                            }
                            if (item.workflowType === "KH") {
                                item.KH = true
                            } else {
                                item.KH = false
                            }
                            return true
                        })
                        if (that.newValue.pageNumber * that.newValue.pageSize > res.data.data.total) {
                            that.screenSuccess = false
                        }
                        that.newValue.pageNumber = that.newValue.pageNumber + 1
                    }
                })
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #innerwapper{
        height 100%
    }
    .warning{
          text-align center
          margin-top 20px
          font-size 18px
          color orangered
    }
    .again{
        bottom 50%
        transform translateY(-50%)
        width 80%
        margin-left 10%
        text-align center
        padding 15px
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }
</style>
