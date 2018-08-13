<template>
    <div class="userSalaryList">
        <div v-show="modelType == 'userSalaryList'" class="content">
            <ZingHead title="薪酬管理" :isComeBack="false" @doSome="doSome">
                <div slot="header-right">
                    <span class="header-search" @click="hrSearch">
                        <i class="iconfont icon-fangdajing"></i>
                     </span>
                    <span class="header-jiahao">
                        <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                <i class="iconfont icon-gengduo"></i>
                            </a>
                        </dropdown>
                    </span>
                </div>
            </ZingHead>
            <search-com 
                    :searchFlag="showSearch" 
                    @cancelInput="cancelInput" 
                    @confirmInput="confirmInput">
            </search-com>
            <div class="scroll-list-wrap" >
                <Scroll 
                    ref="scroll"
                    :observeDOM="true"
                    :data="employeeListData" 
                    :scrollbar="true"
                    :startY="0"
                    :listenScroll="true"
                    :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }"
                    @scroll="scroll"
                    @pullingUp="onPullingUp">
                    <GridCard v-for="(item,index) in employeeListData" :key="index" >
                        <div slot="cardLeft" class="left" @click="toDetail(item)">
                            <div class="good-photo">
                                <img :src = "item.headImg" :onerror="defaultImg">
                            </div>
                            <div class="left-wrapper">
                                <p class="left-wrapper-title userName" >{{item.userName}}</p>
                                <div class="left-wrapper-desc phone">手机号{{item.telPhone}}</div>
                            </div>
                        </div>
                        <div slot="cardRight">
                                <x-button mini type="primary btn-common" @click.native="salaryJump(item)">设置</x-button>
                        </div>
                    </GridCard>
                </Scroll>
            </div>
             <img v-show="isShowTop"
             style="width: 50px;vertical-align: baseline;position: fixed;bottom: 90px;right: 10px;z-index: 10;"
             @click="gotoTop" src="~assets/img/ReturnTop.png"/>
        </div>
        <div v-show="modelType == 'userSalaryDetail'" class="content">
            <ZingHead title="薪资详情" :isComeBack="false" @doSome="doSome">
            </ZingHead> 
            <group label-width="5em" label-margin-right="2em" label-align="left">
                    <x-input title="基本工资" type="text" v-model="formData.basicSalary"   placeholder="请输入基本工资"></x-input>
                    <x-input title="住房公积金" type="text" v-model="formData.housingProvidentFund"  placeholder="请输入住房公积金"></x-input>
                    <x-input title="养老保险金" type="text" v-model="formData.endowmentInsurance"     placeholder="请输入养老保险金"></x-input>
                    <x-input title="大病医疗费" type="text" v-model="formData.medicalExpenses"     placeholder="请输入大病医疗费"></x-input>
                    <x-input title="失业保险金" type="text" v-model="formData.unemploymentFund"   placeholder="请输入失业保险金"></x-input>
                    <x-input title="工伤保险金" type="text" v-model="formData.injuryInsurance"    placeholder="请输入工伤保险金"></x-input>
                    <x-input title="生育保险金" type="text" v-model="formData.maternityInsurance"   placeholder="请输入生育保险金"></x-input>
                    <x-input title="个人所得税" type="text" v-model="formData.individualIncomeTax"  placeholder="请输入个人所得税"></x-input>
                    <div v-for="(item , index) in customFieldData" :key="index">
                        <x-input :title="item.fieldName"  type="text" v-model="formData[item.rowId]"  :placeholder="item.placeholder"></x-input>
                    </div>
                    <x-button type="primary btn-common" @click.native="saveBtn()">保存</x-button>
            </group>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import Scroll from "@/components/scroll/Scroll";
    import Dropdown from "@/components/dropdown/Dropdown";
    import SearchCom from "components/search/search.vue";
    import {Group,XInput,XButton } from 'vux'
    export default {
        name: "user-salary-list",
        components: {
            ZingHead,GridCard,Scroll,Dropdown,SearchCom,
            Group,XInput,XButton 
        },
        data() {
            return {
                cardUrl:"",
                companyId:"",
                rowId:"",
                datas: [
                    { content: "考勤制度", url: "/hrManager/attendanceSystem" },
                    { content: "工资项管理", url: "/hrManager/customField" },
                    { content: "报表", url: "/userSalaryReport/userSalaryReportList" }
                ],
               
                salaryDetail:[],
                customData:[],
                show:false,
                customFlag:false,
                defaultImg:'this.src="' + require('../../../assets/img/userDef_.jpg') + '"',

                modelType:'userSalaryList',//显示模块的标识
                formData:{},//详情表单数据
                customFieldData:[],//自定义字段数据
                idCustomFieldData:{},
                //搜索
                showSearch:false,
                isShowTop:false,
                searchVal:"",
                pageNumber: 1,
                pageSize:10,

                employeeListData:[],
                initData:[],
                searchData:[]
            }
        },
        created() {
            this.getCustomFieldList()
            this.getSalaryList()
        },
        methods:{
            getUserCustomFieldList(data){
                let url = "/zingbiz/hrManager/customField/getUserCustomFieldList"
                let params = {
                    cardUrl:data.cardUrl,
                    companyId:data.companyId
                }
                this.$http.post(url,params).then(res => {
                    let userCustomField = res.data.data
                    if(userCustomField && userCustomField.length > 0){
                        userCustomField.forEach(item =>{
                           data[item.fieldId] = item.fieldNum
                        })
                        this.formData = data
                    }else{
                        this.formData = data
                    }
                })
            },
            getCustomFieldList(){
                let url = "/zingbiz/hrManager/customField/getCustomFieldList"
                let params = {fieldStatus:"1"}
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data

                    let idCustomFieldData = {}
                    retData.forEach(item => {
                       item.placeholder = "请输入"+item.fieldName
                       idCustomFieldData[item.rowId] = item
                    })
                    this.customFieldData = retData
                    this.idCustomFieldData = idCustomFieldData
                })
            },
            saveBtn(){
                let status = this.validate(this.formData)
                if(status){
                    let url = "/zingbiz/hrManager/customField/updateUserSalaryDetail"
                    this.$http.post(url,this.formData).then(res => {
                        let _this = this
                        this.$vux.toast.show({text:"操作成功！",type:"success",onHide () {
                            _this.modelType = 'userSalaryList' 
                        }})
                    })
                }
                
            },
            getSalaryList(){
                let url = "/zingbiz/hrManager/salaryAdjustment/getSalaryList"
                this.$http.post(url,{}).then(res => {
                    if(res.data.data){
                        this.initData = res.data.data
                        this.goPage(this.pageNumber,this.pageSize)
                    }
                })
            },
            goPage(pageNumber,pageSize,val){
                let startIndex = (pageNumber -1) * pageSize;
                let endIndex = pageNumber * pageSize;
                if(val && val != ''){
                    for(let i = startIndex; i < endIndex; i++){
                        if(this.searchData[i]){
                            this.employeeListData.push(this.searchData[i])
                        }
                    }
                }else{
                    for(let i = startIndex; i < endIndex; i++){
                        if(this.initData[i]){
                            this.employeeListData.push(this.initData[i])
                        }
                    }
                }
              
            },
            searchDataMain(val){
                if(this.initData && this.initData.length > 0){
                    this.searchData = this.initData.filter(item => {
                       if(item.userName.indexOf(val) >= 0){
                            return item;
                       }
                    })
                }
            },
            doSome(){
                if(this.modelType == 'userSalaryList'){
                    this.$router.go(-1)
                }else if(this.modelType == 'userSalaryDetail'){
                    this.modelType = 'userSalaryList'
                }
            },
            salaryJump(item) {
               this.modelType = 'userSalaryDetail'
               this.getUserCustomFieldList(item)
            },
            setEmpty(){
                this.formData.basicSalary = ""
                this.formData.housingProvidentFund = ""
                this.formData.endowmentInsurance = ""
                this.formData.medicalExpenses = ""
                this.formData.unemploymentFund = ""
                this.formData.injuryInsurance = ""
                this.formData.maternityInsurance = ""
                this.formData.individualIncomeTax = ""
                this.formData.projectPersonnelCost = ""
                this.customFieldData.forEach(obj =>{
                this.formData[obj.rowId] = ""
                })
            },
            handleMenu(data) {
                if (data.url) this.$router.push(data.url)
            },
            toDetail(item){
                this.$router.push({
                    path:'/hrManager/payrollList',
                    query:{
                        companyId:item.companyId,
                        cardUrl:item.cardUrl
                    }
                });
            },
            validate(data){
                let status = false
                if((data.basicSalary != undefined && isNaN(data.basicSalary))
                    || (data.basicSalary != undefined && isNaN(data.basicSalary))
                    || (data.housingProvidentFund != undefined && isNaN(data.housingProvidentFund))
                    || (data.endowmentInsurance != undefined && isNaN(data.endowmentInsurance))
                    || (data.medicalExpenses != undefined && isNaN(data.medicalExpenses))
                    || (data.unemploymentFund != undefined && isNaN(data.unemploymentFund))
                    || (data.injuryInsurance != undefined && isNaN(data.injuryInsurance))
                    || (data.maternityInsurance != undefined && isNaN(data.maternityInsurance))
                    || (data.individualIncomeTax != undefined && isNaN(data.individualIncomeTax))) {
                    status = true
                }
                this.customFieldData.forEach(item =>{
                    let num = data[item.rowId]
                    if(num != undefined && isNaN(num)){
                        status = true
                    }
                })
                if(status){
                    this.$vux.toast.text("请输入数字!", 'bottom')
                    return false
                }
                return true
            },
            
            hrSearch() {
                this.showSearch = !this.showSearch;
            },
            cancelInput(val){
                val = ""
                this.searchVal = val
                this.hrSearch()
                this.pageNumber = 1
                this.employeeListData = []
                this.goPage(this.pageNumber,this.pageSize)
            },
            confirmInput(val){
                this.searchVal = val
                this.pageNumber = 1
                this.searchDataMain(val)
                this.employeeListData = []
                this.goPage(this.pageNumber,this.pageSize,val)
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    
                    let pageN = parseInt(this.employeeListData.length / 10) + 1
                    if (pageN > this.pageNumber) {
                        this.pageNumber = pageN
                        if(this.searchVal){
                            this.goPage(this.pageNumber,this.pageSize,val)
                        }else{
                            this.goPage(this.pageNumber,this.pageSize)
                        }
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            scroll(val) {
                let y = Math.abs(Math.round(val.y))
                this.isShowTop = y > 425 ? true : false
            },
            gotoTop(){
                this.$refs.scroll.scrollTo(0, 0, 300)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/unify.styl';
    .userSalaryList {
        height 100%;
    }
    .content{
        height calc(100% - 50px);
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow hidden
    }
    .good-photo img {
          float: left;
          height: 50px;
          width: 50px;
          margin-right: 12px;
      }
    .save{
        margin 20px 0
    }
    .userName{
        color #101010
        font-size 14px
    }
    .phone{
        color #101010
        font-size 12px
    }
    .left{
        min-width: 200px !important;
    }
</style>
