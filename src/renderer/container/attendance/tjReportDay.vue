 <template>
    <div class="tjReportDay">
         <ZingHead title="日统计"></ZingHead>
        <el-table max-height="500" border style="width: 100%" :data="tableData">
            <el-table-column fixed prop="realName" label="姓名" width="100"></el-table-column>
            <el-table-column prop="atten_day" label="日期" width="100"></el-table-column>
            <el-table-column prop="shiftName" label="班次" width="100"></el-table-column>
            <el-table-column prop="oneDate" label="上班时间" width="100"></el-table-column>
            <el-table-column prop="oneStatus" label="上班状态" width="100"></el-table-column>
            <el-table-column prop="twoDate" label="下班时间" width="100"></el-table-column>
            <el-table-column prop="twoStatus" label="下班状态" width="100"></el-table-column>
            <el-table-column prop="threeDate" label="上班时间" width="100"></el-table-column>
            <el-table-column prop="threeStatus" label="上班状态" width="100"></el-table-column>
            <el-table-column prop="fourDate" label="下班时间" width="100"></el-table-column>
            <el-table-column prop="fourStatus" label="下班状态" width="100"></el-table-column>
            <el-table-column prop="fiveDate" label="上班时间" width="100"></el-table-column>
            <el-table-column prop="fiveStatus" label="上班状态" width="100"></el-table-column>
            <el-table-column prop="sixDate" label="下班时间" width="100"></el-table-column>
            <el-table-column prop="sixStatus" label="下班状态" width="100"></el-table-column>
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
        name: "tjReportDay",
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
                let url = "/zingbiz/attendance/attendancereport/getAttenDayReport"
                let params = {
                    startDate:this.$route.query.startDate,
                    endDate:this.$route.query.endDate,
                    orgStr:this.$route.query.orgStr,
                    userStr:this.$route.query.userStr,
                    roleStr:this.$route.query.roleStr
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    retData.forEach(item => {
                        if(item.oneStatus){
                            item.oneStatus = this.getStatusName(item.oneStatus)
                        }
                        if(item.twoStatus){
                            item.twoStatus = this.getStatusName(item.twoStatus)
                        }
                        if(item.threeStatus){
                            item.threeStatus = this.getStatusName(item.threeStatus)
                        }
                        if(item.fourStatus){
                            item.fourStatus = this.getStatusName(item.fourStatus)
                        }
                        if(item.fiveStatus){
                            item.fiveStatus = this.getStatusName(item.fiveStatus)
                        }
                        if(item.sixStatus){
                            item.sixStatus = this.getStatusName(item.sixStatus)
                        }
                    })
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
            },
            getStatusName(key){
              let obj = {
                  "0":"正常",
                  "1":"迟到",
                  "2":"早退",
                  "3":"缺卡",
                  "4":"范围外",
                  "5":"补卡",
                  "6":"休息",
                  "7":"旷工",
                  "500":"异常",
              }
              return obj[key];
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
