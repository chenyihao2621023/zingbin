<template>
    <div class="approval">
        <ZingHead title="我审批的">
            <div slot="header-right">
              <span class="header-search">
                  <i class="iconfont icon-fangdajing" @click="search()"></i>
              </span>
            </div>
        </ZingHead>
        <div v-show="defalut1" class="defalut1">
            <tab>
                <tab-item :selected = "flag">
                    <router-link to="/workflow/workflowMyApproval/MyApproval" replace>待我审批</router-link>
                    <i v-show="isHaveDB" class="red-Point"></i>
                </tab-item>
                <tab-item :selected = "flag1">
                    <router-link to="/workflow/workflowMyApproval/lastApproval" replace>暂存审批</router-link>
                    <i v-show="isHaveYH" class="red-Point"></i>
                </tab-item>
                <tab-item :selected = "flag2">
                    <router-link to="/workflow/workflowMyApproval/Approvaled" replace>我已审批</router-link>
                </tab-item>
            </tab>
            <router-view @jumpFlow="jumpFlow"
                         :param = "param"
                         class="sb"
                         :gridTab = "gridTab"
                         @changeRedPointForDB = "changeRedPointForDB"
            ></router-view>
        </div>
        <workflowSearch
            :popup="popup"
            :textType = "textType"
            :title="title"
            mType="SP"
            @cancle="cancle"
            @changeConfirm = "changeConfirm"
        >

        </workflowSearch>
    </div>
</template>

<script>
    import { Tab, TabItem } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    import workflowSearch from "./ApprovalTemplate/workflowSearch";
    import { Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "workflow-my-approval",
        components: {
            Tab,
            TabItem,
            ZingHead,
            workflowSearch
        },
        data() {
            return {
                title:"我审批的",
                flag:false,
                flag1:false,
                flag2:false,
                workflowType:"",
                workflow:"",
                defalut1:true,
                popup:false,
                textType:[
                    { value:"审批标题" ,dataId:"mingcheng" },
                    { value:"审批模版" ,dataId:"moban" },
                    { value:"审批内容" ,dataId:"zhixingneirong" },
                    { value:"流水号" ,dataId:"liushuihao" }
                ],
                param:{},
                retcode:"",
                companyId:"",
                gridTab:"",
                isHaveDB:false,
                isHaveYH:false,
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.fullPath === "/workflow/workflowMyApproval/MyApproval") {
                    this.flag = true
                    this.flag1 = false
                    this.flag2 = false
                    this.gridTab = "DB"
                } else if (to.fullPath === "/workflow/workflowMyApproval/lastApproval") {
                    this.flag = false
                    this.flag1 = true
                    this.flag2 = false
                    this.gridTab = "YH"
                } else if (to.fullPath === "/workflow/workflowMyApproval/Approvaled") {
                    this.flag = false
                    this.flag1 = false
                    this.flag2 = true
                    this.gridTab = "YB"
                }
            }
        },
        created() {
            this.workflowType = this.$route.query.wfType
            this.companyId = this.$route.query.companyId
            if (Z_IsEmpty20(this.companyId)) {
                this.companyId = localStorage.getItem("companyId")
            } else {
                localStorage.setItem("companyId" , this.companyId)
            }

            let path = this.$route.path
            if (path === "/workflow/workflowMyApproval/MyApproval") {
                this.flag = true
                this.flag1 = false
                this.flag2 = false
                this.gridTab = "DB"
            } else if (path === "/workflow/workflowMyApproval/lastApproval") {
                this.flag = false
                this.flag1 = true
                this.flag2 = false
                this.gridTab = "YH"
            } else if (path === "/workflow/workflowMyApproval/Approvaled") {
                this.flag = false
                this.flag1 = false
                this.flag2 = true
                this.gridTab = "YB"
            }
            this.isInOwnCompany()
            this.redPonintData()
        },
        methods: {
            //红点信息
            redPonintData:function () {
                let that = this
                that.$http.post("/ZingMH/ZKM/MENHUWX/MHHelper/getRedPointData.action",{

                }).then(function (res) {

                }).catch(function (error) {
                    console.log(error)
                })
            },
            //dom点击
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
                if (item.workflowType === "YG" || item.workflowType === "MODULE_TYPE_ZYK" || item.workflowType === "TYPE_HR_QJ" || item.workflowType === "MODULE_TYPE_HR_XZTZ" || item.workflowType === "MT_GDZC") {
                    this.workflow = item.woow_chat_id
                    this.$router.push({
                        path:"/workflow/showNode",
                        query:{
                            companyId:this.companyId,
                            workflow_id:this.workflow
                        }
                    })

                } else if(item.workflowType === "KH") {
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
                this.param.gridtab = this.gridTab
            },
            changeRedPointForDB(ret){
                this.isHaveDB = ret;
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
    .approval{
    height 100%
    .defalut1{
    height calc(100% - 50px)
    .sb{
        height calc(100% - 40px)
    }
    }

    }
    .red-Point{
        position: absolute;
        top: 10px;
        width: 10px;
        height: 10px;
        z-index: 2;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        background-color: #f43531;
        font-size: 0;
    }
</style>
