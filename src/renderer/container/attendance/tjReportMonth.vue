 <template>
    <div class="tjReportMonth">
         <ZingHead title="月统计报表"></ZingHead>
        <el-table max-height="500" border style="width: 100%" :data="tableData">
            <el-table-column fixed prop="userName" label="姓名" width="100"></el-table-column>
            <el-table-column prop="groupName" label="考勤组" width="100"></el-table-column>
            <el-table-column prop="fillCardNum" label="补卡次数" width="100"></el-table-column>
            <el-table-column prop="fillCardDetail" label="补卡详情" width="100"></el-table-column>
            <el-table-column prop="lateNum" label="迟到次数" width="100"></el-table-column>
            <el-table-column prop="lateDetail" label="迟到详情" width="100"></el-table-column>
            <el-table-column prop="leaveEarlyNum" label="早退次数" width="100"></el-table-column>
            <el-table-column prop="leaveEarlyDetail" label="早退详情" width="100"></el-table-column>
            <el-table-column prop="outWorkNum" label="范围外次数" width="100"></el-table-column>
            <el-table-column prop="outWorkDetail" label="范围外详情" width="100"></el-table-column>
            <el-table-column prop="qkNum" label="缺卡次数" width="100"></el-table-column>
            <el-table-column prop="qkDetail" label="缺卡详情" width="100"></el-table-column>
            <el-table-column prop="kgNum" label="旷工次数" width="100"></el-table-column>
            <el-table-column prop="kgDetail" label="旷工详情" width="100"></el-table-column>
            <el-table-column prop="wqNum" label="外勤次数" width="100"></el-table-column>
            <el-table-column prop="wqDetail" label="外勤详情" width="100"></el-table-column>
        </el-table>
        <el-pagination background style="overflow-y:scroll;"  layout="sizes, prev, pager, next"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 30, 40, 50 ,100]"
                  :page-size="pageSize"
                  :total="1000">
        </el-pagination>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
   
    export default {
        name: "tjReportMonth",
        components: {
            ZingHead
        },
        directives: {
            //自定义标签属性

        },
        data() {
            return {
               tableData:[],
               initTableData:[],
               //分页
               currentPage:1,
               pageSize:10

            }
        },
        created: function () {
            this.getTableData()
        },
        methods: {
           getTableData(){
                let url = "/zingbiz/attendance/attendancereport/getAttenMonthReport"
                let params = {
                    startDate:this.$route.query.startDate,
                    endDate:this.$route.query.endDate,
                    orgStr:this.$route.query.orgStr,
                    userStr:this.$route.query.userStr,
                    roleStr:this.$route.query.roleStr
                }
                this.$http.post(url,params).then(res => {
                    this.initTableData = res.data.data
                    this.goPage(this.currentPage,this.pageSize);
                })
           },
           handleSizeChange(val){
              this.pageSize = val
              this.goPage(this.currentPage,val)
           },
           handleCurrentChange(val){
              this.currentPage = val
              this.goPage(val,this.pageSize)
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
<style type="text/css">
    
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .tjReportDay{
        height: 100%;
    }
    .content{
        height 100%;
    }
</style>
