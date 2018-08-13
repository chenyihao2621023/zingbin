<template>
    <div class="employeeInfoDetails">
        <!-- 头部信息 -->
        <zing-head class="employee-head" title="人员档案">
            <div slot="header-right">
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
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
                <employee-basic-info 
                    :formData = "formData"
                    :cookieUser = "cookieUser">
                </employee-basic-info>
            </div>
            <div class="tabDiv" v-show="workShow">
                <!-- 工作信息组件 -->
                <employee-work-info 
                    ref="employeeWorkInfo"
                    :formData = "formData"
                    :workInfo = "workInfo"
                    :cookieUser = "cookieUser"
                    @editBtn = showJobsHistroy>
                </employee-work-info>
            </div>
            <div class="tabDiv" v-show="otherShow">
                 <!--惩戒记录组件 -->
                 <incentiveContent
                    ref="incentiveContent"
                    :incentiveInfo = "incentiveInfo"
                    :formData = "formData"
                    :cookieUser = "cookieUser"
                    @showIncenTive = onShowIncenTive>
                </incentiveContent>
            </div>
        </div>
        <!-- 阶段性评价组件 -->
        <form-dialog
            ref="jobsHistroyDialog"
            v-model="jobsHistroyformShow"
            :title="jobsHistroyTitle"
            :showForm="true"
            :formAttrs="jobsHistroyForm"
            @on-confirm="jobsHistroyOnConfirm"
          >
        </form-dialog>
        <!-- 惩戒记录组件 -->
        <form-dialog
            ref="incentiveHistoryDialog"
            v-model="incentiveHistoryformShow"
            :title="incentiveHistoryTitle"
            :showForm="true"
            :formAttrs="incentiveHistoryForm"
            @on-confirm="incentiveHistoryOnConfirm"
          >
        </form-dialog>
    </div>
</template>

<script>
    import {
        Datetime, XTextarea, Group, PopupHeader, Popup, Tab, TabItem, XButton, TransferDomDirective as TransferDom
    } from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead";
    import EmployeeBasicInfo from '@/container/hrManager/hrManagerList/employeeBasicInfo';
    import EmployeeWorkInfo from '@/container/hrManager/hrManagerList/employeeWorkInfo';
    import incentiveContent from '@/container/hrManager/hrManagerList/incentiveContent';
    import Dropdown from '@/components/dropdown/Dropdown';
    import FormDialog from '@/components/formdialog/FormDialog';
    const  jobsHistroyForm = [{
                        title: '起始时间',
                        type: 'datetime',
                        placeholder: "年/月/日"
                    },{
                        title: '结束时间',
                        type: 'datetime',
                        placeholder: "年/月/日"
                    },{
                        title: '阶段性评价',
                        type: 'text',
                        placeholder: "记录阶段性评价"
                    }];
     const incentiveHistoryForm = [{
                        title: '类型',
                        type: 'select',
                        placeholder: "请选择类型",
                        options: ['积极认真工作','早退','项目事故','其他']
                    },{
                        title: '奖惩方式',
                        type: 'select',
                        placeholder: "请选择类型",
                        options: ['工资','物品']
                    },{
                        title: '金额',
                        type: 'text',
                        placeholder: "金额"
                    },{
                        title: '奖惩说明',
                        type: 'text',
                        placeholder: "奖惩说明"
                    }];
    export default {
        components: {
            Datetime,XTextarea,Group,PopupHeader,Popup, XButton,Tab,
            TabItem,ZingHead, EmployeeBasicInfo,EmployeeWorkInfo,Dropdown,
            incentiveContent,FormDialog
        },
        directives: {
            //自定义标签属性
            TransferDom
        },
        data() {
            return {
                basicShow: true,
                workShow: false,
                otherShow: false,
                datas: [
                    { content: "离职办理"},
                    { content: "添加阶段性评价"}
                ],

                formData:{},
                workInfo:{},//工作列表上追加的数据
                incentiveInfo:{},//惩戒列表追加的数据
                cookieUser:{},
                
                //工作记录
                jobsHistroyformShow:false,
                jobsHistroyTitle:"工作历程",
                jobsHistroyForm:jobsHistroyForm,
                jobsHistroyType:"add",
                jobsHistroyCurItem:{},

                //奖惩记录
                incentiveHistoryformShow:false,
                incentiveHistoryTitle:"奖惩记录",
                incentiveHistoryForm:incentiveHistoryForm,
                incentiveHistoryType:"add",
                incentiveHistoryCurItem:{},
            }
        },
        //钩子加载完触发
        created: function () {
            this.getPersonnelFile()
            this.getUserByCookie()
        },
        methods: {
            getUserByCookie() {
                let url = "/zingbiz/hrManager/PersonnelFile/getUserByCookie"
                this.$http.post(url,{}).then(res => {
                    this.cookieUser = res.data.data
                })
            },
            getPersonnelFile() {
                let cardUrl = this.$route.query.cardUrl
                let params = {cardUrl:cardUrl}
                let url = "/zingbiz/hrManager/PersonnelFile/getPersonnelFile"
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData && retData.upleader){
                        let upleaderArr = retData.upleader.split("#")
                        retData.upleaderName = upleaderArr[0]
                    }
                    this.formData = res.data.data
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
            handleMenu(data) {
                if(data.content == "离职办理"){
                    let _this = this
                    this.$vux.confirm.show({
                        title:'提示' ,
                        content:'你确定要给该用户办理离职?',
                        onCancel () {},
                        onConfirm() {
                            _this.turnover()
                        }
                    })
                    //this.turnover()
                    //this.recoveryBackupData()
                }else if(data.content == "添加阶段性评价"){
                    this.jobsHistroyformShow = true
                    this.jobsHistroyType = 'add'
                }else if(data.content == "工资信息"){
                    this.$router.push({
                        path:'/resourceLibrary/financeWarehouse/payrollList',
                        query:{
                            companyId:this.formData.companyId,
                            cardUrl:this.formData.cardUrl
                        }
                    });
                }
            },
            turnover(){
                let curCardUrl = this.cookieUser.cardUrl
                let turnoverCardUrl = this.$route.query.cardUrl
                if(curCardUrl == turnoverCardUrl){
                    this.$vux.toast.text("用户不能给自己离职！", 'bottom')
                    return false
                }
                let url = "/zingbiz/hrManager/EmployeeTurnover/turnover"
                let params = {
                    cardUrl:turnoverCardUrl
                }
                this.$http.post(url,params).then(res => {})
                let _this = this
                setTimeout(() => {
                    this.$vux.toast.show({text:"离职成功！",type:"success",onHide () {
                        _this.$router.go(-1)
                    }})
                },5000)

            },
            recoveryBackupData(){//测试用
                let url = "/zingbiz/hrManager/EmployeeTurnover/reinstatement"
                let params = {
                    cardUrl:"iyy2y22aeyau7Zzq2qIr6bYf",
                    companyId:"company52589677100001",
                    roleCode:"52589689100001",
                    orgIds:"company525896771000011",
                }
                this.$http.post(url,params).then(res => {})
                let _this = this
                setTimeout(() => {
                    this.$vux.toast.show({text:"复职成功！",type:"success",onHide () {
                        alert("复职成功")
                    }})
                },5000)
            },
            jobsHistroyOnConfirm(valList){
                if(valList[0] == undefined || valList[0] == ""){
                    this.$vux.toast.text("起始时间不能为空!", 'bottom')
                    return
                }
                if(valList[1] == undefined || valList[1] == ""){
                    this.$vux.toast.text("结束时间不能为空!", 'bottom')
                    return
                }
                if(valList[2] == undefined || valList[2] == ""){
                    this.$vux.toast.text("阶段性评价不能为空!", 'bottom')
                    return
                }
                let startDate = valList[0]
                let endDate = valList[1]
                let remark = valList[2]
                let status = this.compareDate(startDate,endDate)
                if(status){
                    this.$vux.toast.text("开始时间不能大于结束时间！", 'bottom')
                    return
                }
                let params = {
                    startDate:startDate,
                    endDate:endDate,
                    remark:remark,
                    cardUrl:this.$route.query.cardUrl
                }
                if(this.jobsHistroyType == "add"){
                        this.addJobsHistroy(params)
                }else if(this.jobsHistroyType == "edit"){
                        this.updateJobsHistroy(params)
                }
            },
            addJobsHistroy(params){
                let url = "/zingbiz/hrManager/EmployeeJobsHistory/addEmployeeJobsHistroy"
                this.$http.post(url,params).then(res => {
                       this.$refs.employeeWorkInfo.getEmployeeJobsHistroyList()
                })
            },
            showJobsHistroy(data){
                this.jobsHistroyType = 'edit'
                this.jobsHistroyCurItem = data
                this.$nextTick(() => {
                    this.$refs.jobsHistroyDialog.setFormValues([data.startDate,data.endDate,data.remark])
                    this.jobsHistroyformShow = true
                })
            },
            updateJobsHistroy(params){
                params.rowId = this.jobsHistroyCurItem.rowId
                let  url = "/zingbiz/hrManager/EmployeeJobsHistory/updateEmployeeJobsHistroy"
                this.$http.post(url,params).then(res => {
                       this.$refs.employeeWorkInfo.getEmployeeJobsHistroyList()
                })
            },
            onShowIncenTive(data){
                if(data){//编辑
                    this.incentiveHistoryType = "edit"
                    this.incentiveHistoryCurItem = data
                    this.$nextTick(() => {
                        this.$refs.incentiveHistoryDialog.setFormValues([data.type,data.method,data.amount,data.remark])
                        this.incentiveHistoryformShow = true
                    })

                }else{//添加
                    this.incentiveHistoryformShow = true
                    this.incentiveHistoryType = "add"
                }
                
            },
            incentiveHistoryOnConfirm(valList){
                if(valList[0] == undefined || valList[0] == ""){
                    this.$vux.toast.text("类型不能为空!", 'bottom')
                    return
                }
                if(valList[1] == undefined || valList[1] == ""){
                    this.$vux.toast.text("惩戒方式不能为空!", 'bottom')
                    return
                }
                if(valList[2] == undefined || valList[2] == ""){
                    this.$vux.toast.text("金额不能为空!", 'bottom')
                    return
                }
                if(valList[3] == undefined || valList[3] == ""){
                    this.$vux.toast.text("惩戒说明不能为空!", 'bottom')
                    return
                }
                let type = valList[0]
                let method = valList[1]
                let amount = valList[2]
                let remark = valList[3]
                let params = {
                    type:type,
                    method:method,
                    amount:amount,
                    remark:remark,
                    cardUrl:this.$route.query.cardUrl

                }
                if(this.incentiveHistoryType == "add"){
                        this.addIncentiveHistory(params)
                }else if(this.incentiveHistoryType == "edit"){
                        this.updateIncentiveHistory(params)
                }
            },
            addIncentiveHistory(params){
                let _this = this
                let url = "/zingbiz/hrManager/IncentiveHistory/addIncentiveHistory"
                this.$http.post(url,params).then(res => {
                    setTimeout(function(){
                        _this.$refs.incentiveContent.getIncentiveHistoryList()
                    },2000)
                })
            },
            updateIncentiveHistory(params){
                params.rowId = this.incentiveHistoryCurItem.rowId
                let url = "/zingbiz/hrManager/IncentiveHistory/updateIncentiveHistory"
                this.$http.post(url,params).then(res => {
                    this.$refs.incentiveContent.getIncentiveHistoryList()
                })

            },
            compareDate(d1,d2){
                return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))))
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .vux-x-dialog-absolute .weui-dialog {
        animation:unset !important ;
    }
    .employeeInfoDetails
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

    
</style>
