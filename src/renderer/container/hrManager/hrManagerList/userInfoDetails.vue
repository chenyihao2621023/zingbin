<template>
    <div class="userInfoDetails">
        <!-- 头部信息 -->
        <zing-head class="employee-head" title="人员档案">
        </zing-head>
        <!-- tab页 -->
        <div class="vue-tab">
            <tab >
                <tab-item selected @on-item-click="chengeTab(0)">基本信息</tab-item>
                <tab-item @on-item-click="chengeTab(1)">工作信息</tab-item>
                <tab-item @on-item-click="chengeTab(2)">其他信息</tab-item>
            </tab>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">
            <div class="tabDiv" v-show="basicShow">
                <group label-width="5em" label-margin-right="2em" label-align="left">
                    <div class="headImgDiv">
                        <img class="previewer-demo-img headImg" v-for="(item, index) in list" :src="item.src" @click="showPreview(index)">
                        <div v-transfer-dom>
                            <previewer  :list="list" ref="previewer" :options="options" ></previewer>
                        </div>
                        <img v-show="authIsShow" src="../../../assets/img/auth.png" style="position: absolute;right: 70px;top: -10px;display: none;width: 100px;">
                        <img v-show="noAuthIsShow" src="../../../assets/img/noAuth.png" style="position: absolute;right: 70px;top: -10px;display: none;width: 100px;">
                    </div>
                    <cell title="基本信息" class="hr_title"></cell>
                    <cell title="姓名" :value="formData.userName"></cell>
                    <cell title="性别" :value="formData.sex"></cell>
                    <cell title="民族" :value="formData.nation"></cell>
                    <cell title="学历" :value="formData.education"></cell>
                    <cell title="籍贯" :value="formData.placeOfOrigin"></cell>
                    <cell title="证件类型" :value="formData.IDNumberType"></cell>
                    <cell title="证件号码" :value="formData.IDNumber"></cell>
                    <cell title="毕业院校" :value="formData.graduateInstitutions"></cell>
                    <cell title="入职时间" :value="formData.joinThisUnitTime"></cell>
                    <cell title="婚姻状况" :value="formData.maritalStatus"></cell>
                    <cell title="政治面貌" :value="formData.politicalOutlook"></cell>
                    <cell title="户口所在地" :value="formData.accountLocation"></cell>
                    <cell title="联系方式" class="hr_title"></cell>
                    <cell title="手机" :value="formData.telPhone"></cell>
                    <cell title="邮箱" :value="formData.email"></cell>
                    <cell title="QQ" :value="formData.qqNumber"></cell>
                    <cell title="微信" :value="formData.weChatNumber"></cell>
                    <cell title="家庭信息" class="hr_title"></cell>
                    <cell title="家庭电话" :value="formData.homePhone"></cell>
                    <cell title="家庭邮编" :value="formData.homeZipCode"></cell>
                    <cell title="家庭住址" :value="formData.homeAddress"></cell>
                </group>
            </div>
            <div class="tabDiv" v-show="workShow">
                <group label-width="6em" label-margin-right="2em" label-align="left">
                    <cell title="工作信息" class="hr_title"></cell>
                    <cell title="职务" :value="formData.post"></cell>
                    <cell title="部门领导" :value="orgLeader"></cell>
                    <cell title="用工状态" :value="formData.jobInorNot"></cell>
                    <cell title="合同起始日期" :value="formData.contractPeriodStart"></cell>
                    <cell title="合同结束日期" :value="formData.contractPeriodEnd"></cell>
                    <cell title="工作历程" class="hr_title"></cell>
                </group>
                <div v-if="workData.length > 0">
                    <div v-for="(data, index) in workData" :key="index">
                       <group label-width="5em" label-margin-right="2em" label-align="left">
                           <cell title="开始时间" :value="data.startDate "></cell>
                           <cell title="结束时间" :value="data.endDate"></cell>
                           <cell title="职务" :value="data.roleCode"></cell>
                           <cell title="部门" :value="data.orgName "></cell>
                           <cell title="阶段性评价" :value="data.remark"></cell>
                       </group>
                    </div>
                </div>
                <div v-else>
                    <p class="noData">暂无工作历程信息</p>
                </div>
            </div>
            <div class="tabDiv" v-show="otherShow">
                <group label-width="5em" label-margin-right="2em" label-align="left">
                        <cell title="奖惩记录" class="hr_title"></cell>
                </group>
                <div v-if="rewardData.length > 0">
                    <div v-for="(data, index) in rewardData" :key="index">
                        <group label-width="5em" label-margin-right="2em" label-align="left">
                            <cell title="时间" :value="data.createDate "></cell>
                            <cell title="奖惩类型" :value="data.type"></cell>
                            <cell title="奖惩金额" :value="data.amount"></cell>
                            <cell title="奖惩说明" :value="data.remark"></cell>
                        </group>
                    </div>
                </div>
                <div v-else>
                    <p class="noData">暂无奖惩记录信息</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Group,Cell,Tab,TabItem} from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead";
   
    export default {
        components: {
            Group,Cell,Tab,TabItem,
            ZingHead
        },
        directives: {
           
        },
        data() {
            return {
                basicShow: true,
                workShow: false,
                otherShow: false,
                authIsShow:false,
                noAuthIsShow:false,
                list: [{src:"./static/images/userDef_.jpg"}],

                formData:{},
                workData:[],
                rewardData:[],
                orgLeader:""
            }
        },
        //钩子加载完触发
        created: function () {
            this.getTurnover()
            this.getOrgLeader()
            this.getEmployeeJobsHistroyList()
            this.getIncentiveHistoryList()
        },
        methods: {
            getOrgLeader(){
                let cardUrl  = this.$route.query.cardUrl
                let url = "/zingbiz/hrManager/PersonnelFile/getOrgLeader"
                let params = {
                    cardUrl:cardUrl
                }
                this.$http.post(url,params).then(res => {
                    let str = ""
                    let retData = res.data.data
                    retData.forEach(item =>{
                        if(item.orgLeader){
                            str += item.orgLeader.split("#")[1] + ","
                        }
                    })
                    this.orgLeader = str.substring(0,str.length-1)
                })
            },
            getTurnover() {
                let cardUrl = this.$route.query.cardUrl
                let params = {cardUrl:cardUrl}
                let url = "/zingbiz/hrManager/EmployeeTurnover/getTurnoverByCardUrl"
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData){
                        this.formData = retData
                        if(retData.headImg){
                            this.list[0].src = retData.headImg
                        }
                        //特殊处理的数据
                        if(retData.file_status == "待审核"){
                                this.noAuthIsShow = true
                        }else if(retData.file_status == "通过"){
                                this.authIsShow = true
                        }else if(retData.file_status == "未建档"){
                                this.noAuthIsShow = true
                        }
                    }
                })
            },
            getEmployeeJobsHistroyList(){
                let cardUrl  = this.$route.query.cardUrl
                let url = "/zingbiz/hrManager/EmployeeJobsHistory/getEmployeeJobsHistroyList"
                let params = {cardUrl:cardUrl}
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData){
                        this.workData  = retData
                    }
                })
           },
            getIncentiveHistoryList(){
                let cardUrl  = this.$route.query.cardUrl
                let url = "/zingbiz/hrManager/IncentiveHistory/getIncentiveHistory"
                let params = {cardUrl:cardUrl}
                this.$http.post(url,params).then(res => {
                   let retData = res.data.data
                   if(retData){
                        this.rewardData = retData
                   }
                })
            },
            chengeTab(index) {
                if(index === 0) {
                    this.basicShow = true
                    this.workShow = false
                    this.otherShow = false
                }else if (index === 1) {
                    this.basicShow = false
                    this.workShow = true
                    this.otherShow = false
                }else if (index === 2) {
                    this.basicShow = false
                    this.workShow = false
                    this.otherShow = true
                }
            },
          
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .userInfoDetails
        display flex
        flex-direction column
        width 100%
        height 100%
        .employee-head
        .vue-tab
            flex-shrink 0
        .tab-content
            flex-grow 1
            overflow-y auto
    .headImgDiv {
        margin-top: 20px;
        margin-bottom: 10px
        text-align:center;
    }
    .headImg {
        border: 1px solid #CCC;
        background-color: #FFF;
        padding: 4px;
        display: inline-block;
        width: 200px;
        height: 200px;
    }
    .hr_title{
        color: #FF8000;
        font-weight: bold;
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
</style>
