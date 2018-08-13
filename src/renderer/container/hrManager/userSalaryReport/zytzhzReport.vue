<template>
    <div class="zytzhzReport">
        <div class="content" v-show="showModel == 'search'">
            <x-header :left-options="{showBack: false}">查询条件</x-header>
            <group  label-margin-right="2em" label-align="left">
               <cell title="部门名称" is-link :value="searchName" @click.native="selectPerson"></cell>
               <datetime   :min-year="1900" format = "YYYY-MM" v-model="startDate" @on-change="startChange">
                   <span slot="title">起始时间<span class="span_title">*</span></span>
               </datetime>
               <datetime   :min-year="1900" format = "YYYY-MM" v-model="endDate" @on-change="endChange">
                   <span slot="title">结束时间<span class="span_title">*</span></span>
               </datetime>
               <flexbox :gutter="0">
                   <flexbox-item>
                       <x-button type="warn btn-common" @click.native="showList">取消</x-button>
                   </flexbox-item>
                   <flexbox-item>
                       <x-button type="primary btn-save" @click.native="restBtn">重置</x-button>
                   </flexbox-item>
                   <flexbox-item>
                       <x-button type="warn btn-common" @click.native="searchBtn">查询</x-button>
                   </flexbox-item>
               </flexbox>
           </group>
        </div>
        <div class="content" v-show="showModel == 'list'">
            <ZingHead title="职员台账汇总表">
                    <div slot="header-right">
                        <span class="header-search salary-search" style="padding:0px;" @click="showSearch">
                            <i class="iconfont icon-fangdajing salary-icon"></i>
                         </span>
                    </div>
            </ZingHead>
            <el-table
                ref="table"
                style="width: 100%;" 
                :data="tableData"
                max-height="500"
                >
                <el-table-column
                  fixed
                  prop="userName"
                  label="姓名"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="orgCode"
                  label="部门"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="yearDate"
                  label="年度"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="monthDate"
                  label="期间"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="basicSalary"
                  label="基本工资"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="housingProvidentFund"
                  label="住房公积金"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="endowmentInsurance"
                  label="养老保险"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="medicalExpenses"
                  label="大病医疗费"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="unemploymentFund"
                  label="失业保险金"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="injuryInsurance"
                  label="工商保险金"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="maternityInsurance"
                  label="生育保险金"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="individualIncomeTax"
                  label="个人所得税"
                  width="100">
                </el-table-column>
                <el-table-column v-for="(item,index) in customFieldList" :key="index"
                  :prop=item.prop
                  :label=item.label
                  width="100">
                </el-table-column>
            </el-table>
            <el-pagination
                  background
                  style="overflow-y:scroll;"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 30, 40, 50 ,100]"
                  :page-size="pageSize"
                  layout="sizes, prev, pager, next"
                  :total="1000">
            </el-pagination>
        </div>
        <!-- 选人组件 -->
        <org-member-picker
                   :showPicker="showPersonPicker"
                   :multiple="false"
                   :showTab=showTab
                   @picked="onPicked"
                   @abort="onPickAbort">
        </org-member-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import {Group,Cell,XButton,Flexbox,FlexboxItem,Datetime,XHeader} from 'vux'
    export default {
        name: "zytzReport",
        components: {
            ZingHead,OrgMemberPicker,
            Group,Cell,XButton,Flexbox,FlexboxItem,Datetime,XHeader
        },
        data() {
            return {
               showModel:"list",//显示的标识  search   list

               //搜索
               searchName:"请选择部门",
               startDate:"请选择起始时间",
               endDate:"请选择结束时间",

               //选人组件
               showPersonPicker: false,
               attenUserList:[],
               showTab:['org'],

               //自定义字段
               customFieldList:[],
               tableData: [],
               initTableData: [],

               //分页
               currentPage:1,
               pageSize:10

            }
        },
        created() {
           this.getTableData()
        },
        methods:{
            getTableData(){
                let url = "/zingbiz/hrManager/userSalaryReport/getStaffSummaryListByCompanyId"
                let params = {
                      pageNumber:1,
                      pageSize:9999
                }
                if(this.searchName && this.searchName !== "请选择部门"){
                    params.orgCode = this.searchName
                }
                if(this.startDate && this.startDate !== '请选择起始时间'){
                    params.searchStartDate = this.startDate
                }
                if(this.endDate && this.endDate !== '请选择结束时间'){
                    params.searchEndDate = this.endDate
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    
                    //处理表格数据
                    let tableData = []
                    //处理表头自定义字段
                    let customFieldList = []
                    let i = 1
                    for(let variable in retData){
                        if(retData[variable] != null && retData[variable].length > 0){
                              
                              let userList = retData[variable]
                              if(i == 1){
                                  if(userList[0]){
                                      for(let variable in userList[0]){  
                                          if(!isNaN(variable)){//自定义字段
                                               let name = userList[0][variable]
                                               let nameArr = name.split("_")
                                               customFieldList.push({
                                                  prop:variable,
                                                  label:nameArr[0]
                                               })
                                          }
                                      } 
                                  }
                                  i++
                                  customFieldList.push({prop:"userSalaryRowSum",label:"合计"})
                              }
                              
                              userList.forEach(item =>{
                                    if(item.monthDate.indexOf("-") > 0){
                                        item.monthDate = "第"+item.monthDate.split("-")[1]+"期"
                                        for(let variable in item){  
                                        if(!isNaN(variable)){//自定义字段
                                                 let name = item[variable]
                                                 let nameArr = name.split("_")
                                                 item[variable] = nameArr[1]
                                            }
                                        }
                                    }
                                    tableData.push(item)
                              })
                        }
                    }
                    this.initTableData = tableData
                    this.customFieldList = customFieldList
                    this.goPage(this.currentPage,this.pageSize);
                })
            },
            onPickAbort() {//选人组件返回按钮
                this.showPersonPicker = false
            },
            onPicked(list) {//选中人员的回调
                let retData = list[0]
                this.searchName = retData.title
                this.showPersonPicker = false
                
            },
            selectPerson(){
                this.showPersonPicker = true
            },
            startChange(val){
                this.startDate = val
            },
            endChange(val){
                this.endDate = val
            },
            restBtn(){
               this.searchName = "请选择"
               this.searchCardUrl = ""
               this.startDate = "请选择起始时间"
               this.endDate = "请选择结束时间"
               this.getTableData()
            },
            searchBtn(){
                this.showModel = "list"
                this.getTableData()
            },
            showSearch(){
                this.showModel = "search"
            },
            showList(){
                this.showModel = "list"
                this.restBtn()
            },
            handleSizeChange(val) {
              //console.log(`每页 ${val} 条`);
              this.pageSize = val
              this.goPage(this.currentPage,val)
              //this.$refs.table.doLayout()
            },
            handleCurrentChange(val) {
              //console.log(`当前页: ${val}`);
              this.currentPage = val
              this.goPage(val,this.pageSize)
              //this.$refs.table.doLayout()
            },
            goPage(pageNumber,pageSize){
                let tableData = []
                let startIndex = (pageNumber -1) * pageSize;
                let endIndex = pageNumber * pageSize;
                for(let i = startIndex; i < endIndex; i++){
                    if(this.initTableData[i]){
                        tableData.push(this.initTableData[i])
                    }
                }
                this.tableData = tableData
            }
        }
    }
</script>
<style>
    .zytzhzReport .vux-header{
        background-color: #f5f5f5 !important;
        color: #303133 !important;
    }
    .zytzhzReport .vux-header-title{
        color: #353535 !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/unify.styl';
    .zytzhzReport {
        height 100%;
    }
    .content{
        height 100%;
    }
    .span_title{
        color: #D81E06;
    }
    .salary-search{
        line-height: 50px;
        width: 50px;
        text-align: center;
        height: 50px;
    }
   
</style>
