<template>
    <div  class="transferOfWorkList">
        <zing-head  title="待交接工作">
           <div slot="header-right">
              <span style="margin-right: 15px;color: #40affc;" @click="openDialog">
                   指派 >
              </span>
            </div>
        </zing-head>
        <div class="ziTree">
             <zi-tree ref="djjTree"
                :props="defaultProps"
                :data="treeData"
                :checkable = "false"
                :defaultExpandAll = "true"
             />
        </div>
         <!-- 选人组件 -->
        <org-member-picker ref="picker" 
                :showPicker="showPersonPicker" 
                :showTab ="showTab"
                :multiple="false"
                @picked="onPicked"
                @abort="onPickAbort">
        </org-member-picker>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Group,Tab, TabItem, XButton} from 'vux';
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import ZingHead from "@/components/zingHead/ZingHead";
    import ZiTree from '@/components/zitree/ZiTree';
    
    export default {
        components: {
            Group,XButton,Tab,TabItem, ZingHead,ZiTree, OrgMemberPicker,
        },
        data() {
            return {
                showPersonPicker:false,//选人组件的标识
                defaultProps: {
                    title: "leaf",
                    children: "children2",
                    src: "src",            
                    auth: "auth"  
                },
                treeData: [],
                showTab:["colleague"]
            }
        },
        //钩子加载完触发
        created: function () {
            this.getQuitUserWorkData();
        },
        methods: {
            getQuitUserWorkData() {
                let url = "/zingbiz/hrManager/EmployeeTurnover/getQuitUserWorkData"
                let params = this.$route.query
                this.$http.post(url, params).then(res => {
                    let retData = res.data.data
                    console.log("返回的数据",retData)
                    let ckInfoArr = []
                    let trelloCardArr = []
                    let workFlowArr = []
                    if(retData.ckInfo && retData.ckInfo.length > 0){
                            retData.ckInfo.forEach(item =>{
                                let obj = {}
                                obj.leaf = item.title
                                obj.auth = "noShowAuth"
                                ckInfoArr.push(obj)
                            })
                    }
                    if(retData.trelloCard && retData.trelloCard.length > 0){
                            retData.trelloCard.forEach(item =>{
                                let obj = {}
                                obj.leaf = item.title
                                obj.auth = "noShowAuth"
                                obj.icon = "iconfont icon-bianji1"
                                obj.style = {backgroundColor: '#409eff'}
                                trelloCardArr.push(obj)
                            })
                    }
                    if(retData.workFlow && retData.workFlow.length > 0){
                           retData.workFlow.forEach(item =>{
                                let obj = {}
                                obj.leaf = item.workflow_name
                                obj.icon = "iconfont icon-shenpi1"
                                obj.style = {backgroundColor: 'rgb(245, 147, 36)'}
                                obj.auth = "noShowAuth"
                                workFlowArr.push(obj)
                            })
                    }
                    this.treeData = [{
                        leaf: "资源库",
                        children2: ckInfoArr
                    },{
                        leaf: "审批",
                        children2: workFlowArr
                    },{
                        leaf: "任务",
                        children2: trelloCardArr
                    }]
                });

            },
            openDialog() {
                this.showPersonPicker = true
            },
            onPicked(data) {
                let _this = this
                this.showPersonPicker = false
                Vue.$vux.loading.show({text: '执行中,请稍后'})
                
                let url = "/zingbiz/hrManager/EmployeeTurnover/updateQuitUserWorkData"
                let params = {
                    cardUrl:this.$route.query.cardUrl,
                    companyId:this.$route.query.companyId,
                    toCardUrl:data[0].cardUrl,
                    rowId:this.$route.query.rowId

                }
                this.$httpSilent.post(url, params).then(res => {
                    Vue.$vux.loading.hide()
                    this.$vux.toast.show({
                           text: "操作成功！",
                           type: "success",
                           onHide () {
                                _this.$router.go(-1)
                           }
                    })
                })

            },
            onPickAbort() {
                this.showPersonPicker = false;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    .transferOfWorkList{
         height calc(100% - 50px);
    }
    .ziTree{
        flex-grow: 1;
        overflow-y: auto;
        width: 100%;
        height: 100%;
    }
</style>
