<template>
    <div class="outWarpper">
        <ZingHead title="我参与服务号内的审批流"></ZingHead>
        <div class="warning" v-show="flag">
            暂无数据
        </div>
        <div class="scroll-list-wrap">
            <scroll ref="scroll" :data="Data">
                <GridCard v-for="(item,index) in Data" :key="index" @click.native="jumpToflow(item)">
                    <div slot="cardLeft" class="left">
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
                        <div class="tag-wrapper">
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "workflow-join-service",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            ZingHead
        },
        data() {
            return {
                Data:[],
                total:"",
                flag:false,
                retcode:"",
                workflowType:""

            }
        },
        created() {
            this.workflowType = this.$route.query.workflowType
            this.isInOwnCompany()
            this.getData()
        },
        methods:{
            //数据获取
            getData() {
                let that = this
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData ",{
                    personStatus:"CY",
                    companyId: that.$route.query.companyId,
                }).then(function (res) {
                    if ( res.data.data.total === 0) {
                        that.flag = true
                    } else {
                        that.Data = res.data.data.data
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
            // 页面跳转
            jumpToflow(item) {
                if (this.retcode === 0 && (this.workflowType === "YG" || this.workflowType === "MODULE_TYPE_ZYK")) {
                    if (!Z_IsEmpty20(item.workflow_state) && !Z_IsEmpty20(item.workflow_state) && item.workflow_state !== "待处理") {
                        let woowId = item.woow_chat_id;
                        this.$router.push({ path:"/workflow/showNode", query:{ workflow_id:woowId,companyId:this.$route.query.companyId }})
                    } else {
                        this.$router.push({ path:"/workflow/customLaunchWorkflow", query:{ id:item.workflow_id,companyId:this.$route.query.companyId,_t:new Date().getTime() }})
                    }
                } else {
                    let woowId = item.woow_chat_id;
                    this.$router.push({ path:"/workflow/showNode", query:{ workflow_id:woowId,companyId:this.$route.query.companyId,jump:"CYL" }})
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
</style>
