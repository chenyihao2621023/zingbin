<template>
    <div  class="employeeWorkInfo">
        <!-- 工作信息 -->
        
            <group label-width="6em" label-margin-right="2em" label-align="left">
                <cell title="工作信息" class="hr_title">
                    <x-button sort="right" mini type="primary btn-common" @click.native="saveBtn()">保存</x-button>
                </cell>
                <x-input title="职务" placeholder="选填" v-model="formData.post"></x-input>
                <cell title="部门领导" :value="orgLeader"></cell>
                <selector title="用工状态" v-model="formData.jobInorNot" :options="['试用期', '正式工', '退休', '离职', '未授权']"  placeholder="请选择用工状态"></selector>
                <datetime title="合同起始日期"  :min-year="1900" v-model="formData.contractPeriodStart" @on-change="startChange"></datetime>
                <datetime title="合同结束日期"  :min-year="1900" v-model="formData.contractPeriodEnd" @on-change="endChange"></datetime>
                <cell title="工作历程" class="hr_title"></cell>
            </group>
             <!-- 工作历程 -->
            <div v-for="(data, index) in getDataInfo" :key="index">
                <group label-width="6em" label-margin-right="2em" label-align="left">
                    <cell title="开始时间" :value="data.startDate "></cell>
                    <cell title="结束时间" :value="data.endDate"></cell>
                    <cell title="职务" :value="data.roleCode"></cell>
                    <cell title="部门" :value="data.orgName "></cell>
                    <cell title="阶段性评价" :value="data.remark"></cell>
                    <cell>
                         <x-button sort="right" mini type="primary btn-save" @click.native="delBtn(data)">删除</x-button>
                         <x-button sort="right" mini type="primary btn-common" @click.native="editBtn(data)">编辑</x-button>
                    </cell>
                </group>
            </div>
            <div class="chatIcon" @click="chatFun" v-if="cookieUser.cardUrl != formData.cardUrl"> 
                <i class="iconfont icon-icon--" style="color: #ff8000;"></i>
            </div>
    </div>
</template>


<script>
    import {Selector, Datetime,  XInput, Group, XButton, Cell,XTextarea,Flexbox, FlexboxItem } from 'vux'
    import GridCard from "@/components/gridcard/GridCard";
    import { doOneChat } from "@/utils/fn";
    export default {
        name: "employeeWorkInfo",
        components: {
            Selector, Datetime,  XInput, Group, XButton, Cell,GridCard,XTextarea,
            XButton,Flexbox, FlexboxItem
        },
        props:{
            formData: {},
            workInfo: {},
            cookieUser: {}
        },
        data() {
            return {
                showJobsHistroyPicker:false,//显示阶段性评价的标识
                getDataInfo:[],//列表的数据
                jobsHistroyData:{},//回显的数据
                addWorkData:{
                    startDate:"",
                    endDate:"",
                    remark:"",
                    roleCode:"",
                    orgName:""
               },
               orgLeader:""
            }
        },
        watch:{
           workInfo(data){
                if(data.type == "edit"){
                    this.getDataInfo.forEach(item =>{
                        if(data.rowId == item.rowId){
                            item.startDate = data.startDate
                            item.remark = data.remark
                            item.endDate = data.endDate
                        }
                    })
                }else if(data.type == "add"){
                    this.getDataInfo.push(data)
                }
           }
        },
        created: function () {
            this.getEmployeeJobsHistroyList()
            this.getOrgLeader()
        },
        methods: {
           saveBtn(){
                if(this.formData.jobInorNot == "" || this.formData.jobInorNot == undefined){
                    this.$vux.toast.text("用工状态不能为空!", 'bottom')
                    return
                }
                if(this.formData.contractPeriodStart == "" || this.formData.contractPeriodStart == undefined){
                    this.$vux.toast.text("合同起始日期不能为空!", 'bottom')
                    return
                }
                if(this.formData.contractPeriodEnd == "" || this.formData.contractPeriodEnd == undefined){
                    this.$vux.toast.text("合同结束日期不能为空!", 'bottom')
                    return
                }
                let params = {
                    rowId:this.formData.rowId,
                    companyId:this.formData.companyId,
                    cardUrl:this.formData.cardUrl,
                    post:this.formData.post,
                    jobInorNot:this.formData.jobInorNot,
                    contractPeriodStart:this.formData.contractPeriodStart,
                    contractPeriodEnd:this.formData.contractPeriodEnd
                }
                let status = this.compareDate(params.contractPeriodStart,params.contractPeriodEnd)
                if(status){
                    this.$vux.toast.text("合同起始时间不能大于合同结束时间！", 'bottom')
                }else{
                    let url = "/zingbiz/hrManager/PersonnelFile/updatePersonnelFile"
                    this.$http.post(url,params).then(res => {
                       this.$vux.toast.show({
                                text: "操作成功！",
                                type: "success"
                        })
                    })
                }
           },
           startChange(val){
                this.formData.contractPeriodStart = val
           },
           endChange(val){
                this.formData.contractPeriodEnd = val
           },
           getEmployeeJobsHistroyList(){
                let cardUrl  = this.$route.query.cardUrl
                let url = "/zingbiz/hrManager/EmployeeJobsHistory/getEmployeeJobsHistroyList"
                let params = {
                    cardUrl:cardUrl
                }
                this.$http.post(url,params).then(res => {
                   this.getDataInfo = res.data.data
                })
           },
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
           editBtn(data){
                this.$emit('editBtn',data)
           },
           delBtn(data){
                let _this = this
                this.$vux.confirm.show({
                    title: '提示',
                    content: '你确定要删除吗?',
                    onCancel () {},
                    onConfirm() {
                        _this.getDataInfo = _this.getDataInfo.filter(item => {
                            return data.rowId !== item.rowId
                        })
                        let url = "/zingbiz/hrManager/EmployeeJobsHistory/delEmployeeJobsHistroy"
                        _this.$http.post(url,data).then(res => {
                           _this.$vux.toast.show({text:"删除成功！",type:"success"})
                        })
                    }
                })
           },
           chatFun(){
                let cardUrl = this.formData.cardUrl
                doOneChat(cardUrl,true,this.$router)
           },
           compareDate(d1,d2){
                return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))))
           }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .hr_title{
        color: #FF8000;
        font-weight: bold;
    }
    .chatIcon{
        position: fixed;
        bottom: 80px;
        right: 0px;
        height: 50px !important;
        width:50px;
    }
    .iconfont {
        font-size: 25px;
        position: relative;
        float: right;
        top: 20%;
    }
</style>
