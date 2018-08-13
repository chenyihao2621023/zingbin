<template>
    <div class="outerMost">
        <ZingHead title="我参与的">
            <div slot="header-right">
              <span class="header-search">
                  <i class="iconfont icon-fangdajing" @click="search()"></i>
              </span>
            </div>
        </ZingHead>
        <div class="warning" v-show="flag">
            暂无数据
        </div>
        <div v-show="defalut1" class="scroll-list-wrap">
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
                        <div class="tag-wrapper">
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>
        <workflowSearch
            :popup="popup"
            :textType = "textType"
            :title = "title"
            mType="CY"
            @cancle="cancle"
            @changeConfirm = "changeConfirm"
        >
        </workflowSearch>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import workflowSearch from "./ApprovalTemplate/workflowSearch";
    export default {
        name: "workflow-join",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            ZingHead,
            workflowSearch
        },
        data() {
            return {
                title:"我参与的",
                WorkflowData:[],
                flag:false,
                textType:[
                    { value:"审批标题" ,dataId:"mingcheng" },
                    { value:"审批模版" ,dataId:"moban" },
                    { value:"审批内容" ,dataId:"zhixingneirong" },
                    { value:"流水号" ,dataId:"liushuihao" }
                ],
                popup:false,
                defalut1:true,
                param:{},
                retcode:"",
                workflowType:"",
                companyId:"",
                workflow:"",
                pageNumber:1,
                pageSize:20,
                screen:false,
                success:true,
                screenSuccess:true,
                newValue:{},
                pullUpLoad:{ threshold: 0,txt: { more: '加载更多',noMore: '没有更多数据' }}

            }
        },
        watch:{
            param:function (newValue) {
                let that = this
                that.flag = false
                that.screenSuccess = true
                newValue.pageNumber = 1
                newValue.pageSize = 20
                that.WorkflowData = []
                that.screen = true
                that.newValue = newValue
                that.screenMethod(newValue)
            }
        },
        created() {
            this.workflowType = this.$route.query.workflowType
            this.companyId = this.$route.query.companyId
            // this.companyId = "company59915700000000101"
            this.isInOwnCompany()
            this.getWorkflowData(this.pageNumber)
        },
        methods: {
            getWorkflowData(pageNumber) {
                let that = this
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData",{
                    personStatus:"CY",
                    pageNumber:pageNumber,
                    pageSize:20
                }).then(function (res) {
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
                        this.workflow = item.woow_chat_id
                        this.$router.push({
                            path:"/workflow/showNode",
                            query:{
                                companyId:this.companyId,
                                workflow_id:this.workflow
                            }
                        })
                        //window.location.href = "/SRender?jsLoader=workflowES%2FshowNodeEsLoader&tpl=workflowES%2FshowNodeEs&companyId=" + this.companyId + "&workflow_id=" + this.workflow + "&v=9999.9999";
                    } else {
                        this.$router.push({
                            path:"/workflow/customLaunchWorkflow",
                            query:{
                                id:item.workflow_id,
                                companyId:this.companyId,
                                _t:new Date().getTime()
                            }
                        })
                        //window.location.href = "/SRender?jsLoader=workflowES%2FcreateWorkflowEs_v2Loader&tpl=workflowES%2FcreateWorkEs_v2&id=" + item.workflow_id + "&_t=" + (new Date()).getTime() + "&v=9999.9999&companyId=" + this.companyId;
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
            search() {
                this.defalut1 = false
                this.popup = true
            },
            cancle() {
                this.popup = false
                this.defalut1 = true
            },
            changeConfirm(value) {
                this.param = value
                this.param.gridtab = "CY"
            },
            onPullingUp() {
                if (this.screen) {
                    console.log("筛选")
                    if (this.screenSuccess) {
                        console.log("开始筛选")
                        this.screenMethod(this.newValue)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        console.log("结束筛选")
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
                that.$http.post("/zingbiz/workflow/workFlowQuery/getWorkflowDataByFilter",newValue).then(function (res) {
                    that.total = res.data.data.total
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    } else {
                        console.log("hhhh")
                        // that.$refs.scroll.forceUpdate(true)
                    }
                    if (parseInt(that.total) === 0) {
                        that.flag = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.WorkflowData.push( res.data.data.data[i])
                        }
                        if (that.newValue.pageNumber * that.newValue.pageSize > res.data.data.total) {
                            that.screenSuccess = false
                        }
                        that.newValue.pageNumber = that.newValue.pageNumber + 1
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outerMost{
        height calc(100% - 50px)
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }

    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
</style>
