<template>
    <div class="zytzReport">
        <div class="content" v-show="showModel == 'search'">
            <x-header :left-options="{showBack: false}">查询条件</x-header>
            <group  label-margin-right="2em" label-align="left">
               <cell title="职员名称" is-link :value="searchName" @click.native="selectPerson"></cell>
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
            <ZingHead title="职员台账">
                    <div slot="header-right">
                        <span class="header-search salary-search" style="padding:0px;" @click="showSearch">
                            <i class="iconfont icon-fangdajing salary-icon"></i>
                         </span>
                    </div>
            </ZingHead>
            <el-table
                ref="table"
                style="width: 100%;" 
                show-summary
                :summary-method="getSummaries"
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
               searchName:"请选择",
               searchCardUrl:'',
               startDate:"请选择起始时间",
               endDate:"请选择结束时间",

               //选人组件
               showPersonPicker: false,
               attenUserList:[],
               showTab:['colleague'],

               //自定义字段
               customFieldList:[],
               tableData: [],

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
                let url = "/zingbiz/hrManager/userSalaryReport/getStaffLedgerDataByCardUrl"
                let params = {
                      pageNumber:this.currentPage,
                      pageSize:this.pageSize
                }
                if(this.searchCardUrl){
                    params.cardUrl = this.searchCardUrl
                }
                if(this.startDate && this.startDate !== '请选择起始时间'){
                    params.searchStartDate = this.startDate
                }
                if(this.endDate && this.endDate !== '请选择结束时间'){
                    params.searchEndDate = this.endDate
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    
                    //处理表头自定义字段
                    let customFieldList = []
                    if(retData.length > 0){
                        let obj = retData[0]
                        for(let variable in obj){  
                            if(!isNaN(variable)){//自定义字段
                                 let name = obj[variable]
                                 let nameArr = name.split("_")
                                 customFieldList.push({
                                    prop:variable,
                                    label:nameArr[0]
                                 })
                            }
                        }
                    }
                    customFieldList.push({prop:"userSalaryRowSum",label:"合计"})
                    this.customFieldList = customFieldList

                    //处理表格数据
                    retData.forEach(item =>{
                        if(item.monthDate){
                             item.monthDate = "第"+item.monthDate.split("-")[1]+"期"
                        }
                        for(let variable in item){  
                            if(!isNaN(variable)){//自定义字段
                                 let name = item[variable]
                                 let nameArr = name.split("_")
                                 item[variable] = nameArr[1]
                            }
                        }

                    })
                    this.tableData = retData
                })
            },
            onPickAbort() {//选人组件返回按钮
                this.showPersonPicker = false
            },
            onPicked(list) {//选中人员的回调
                let retData = list[0]
                this.searchName = retData.userName
                this.searchCardUrl = retData.cardUrl
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
               this.searchName = "请选择职员"
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
              this.getTableData()
              this.$refs.table.doLayout()
            },
            handleCurrentChange(val) {
              //console.log(`当前页: ${val}`);
              this.currentPage = val
              this.getTableData()
              this.$refs.table.doLayout()
            },
            getSummaries(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                  if (index === 0) {
                    sums[index] = '合计';
                    return;
                  }
                  if (index === 1) {
                    sums[index] = '';
                    return;
                  }
                  const values = data.map(item => Number(item[column.property]));
                  if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                      const value = Number(curr);
                      if (!isNaN(value)) {
                        return prev + curr;
                      } else {
                        return prev;
                      }
                    }, 0);
                    
                  } else {
                    sums[index] = '';
                  }
                });

                return sums;
            }
        }
    }
</script>
<style>
    .zytzReport .vux-header{
        background-color: #f5f5f5 !important;
        color: #303133 !important;
    }
    .zytzReport .vux-header-title{
        color: #353535 !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/unify.styl';
    .zytzReport {
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
