<!-- 折旧费用分配表  -->
<template>
    <div class="assetList">
            <ZingHead title="折旧费用分配表" :isComeBack="false" @doSome="close()">
                <div slot="header-right">
                    <span class="header-search" v-show="searchFlag">
                        <i class="iconfont icon-fangdajing" @click="search"></i>
                    </span>
                </div>
            </ZingHead>
        <div v-show="defaultPage" class="el-table-model">
            <div class="el-table-tableTitle">
                会计期间:{{period}}
            </div>
            <div class="table-deprecat">
               <el-table class="table-tableData" :data="tableData" style="width: 100%;" border :span-method="mergeColumn" max-height="500">
                <el-table-column fixed prop="projectName" label="项目名称" align="center">
                </el-table-column>
                <el-table-column prop="subjectCode" label="科目代码" align="center">
                </el-table-column>
                <el-table-column prop="subjectName" label="科目名称" align="center">
                </el-table-column>
                <el-table-column prop="sumAccount" label="金额" align="center">
                </el-table-column>
            </el-table>
            </div>
            <!-- <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 30, 40,50,100]" :page-size="10" layout="sizes, prev, pager, next" :total="400">
            </el-pagination> -->
        </div>
        <searchdepre-allocat :searchPage="searchPage" @submitAllocat="submitAllocat"></searchdepre-allocat>
    </div>
</template>
<script>
import Axios from 'axios'
import ZingHead from "components/zingHead/ZingHead.vue";
import searchdepreAllocat from "../searchPopup/searchdepreAllocat";
export default {
    components: {
        ZingHead,
        searchdepreAllocat
    },
    data() {
        return {
            defaultPage: true,
            searchPage: false,
            searchFlag: true,
            currentPage: 1,
            period: "",
            tableData: []
        };
    },
    methods: {
        search() {
            this.searchPage = true;
            this.defaultPage = false;
            this.searchFlag = false;
        },
        close() {
            if (!this.searchPage) {
                this.$router.go(-1);
            } else {
                this.searchPage = false;
                this.defaultPage = true;
                this.searchFlag = true;
            }
        },
        //获取折旧费用分配表数据
        submitAllocat(param) {
            let vm = this;
            let params = {
              startPeriod: param.startPeriod,
              endPeriod: param.endPeriod
            };
            vm.period = param.startPeriod + '-' + param.endPeriod
            let summaryProject = param.summaryProject
            ? { summaryProject: param.summaryProject } : {};
            params = Object.assign({},params,summaryProject );
            vm.getDepreciation(params)
            vm.searchPage = false
            vm.defaultPage = true
        },
        // 获取折旧费用分配表数据
        getDepreciation(params,page,pageSize) {
            let vm = this
            let url = "/zingbiz/fixedAssets/report/selectDepreciationExpenseAllocation"
            Axios.get(url, { 'params': params }).then(res => {  // 分页 'page': page,'pageSize': pageSize
                if (res.data.success) {
                    res.data.data.forEach(val => {
                      val.data.forEach((item,index) => {
                        item.projectName = val.name
                        if (val.data.length > 1) {
                          if (index === 0) {
                            item["pos"] = val.data.length
                          } else {
                            item["pos"] = 0
                          }
                        } else {
                          item["pos"] = 1
                        }
                      })
                      vm.tableData = vm.tableData.concat(val.data)
                    })
                    vm.searchFlag = true
                } else {
                      vm.tableData = []
                      vm.$vux.toast.text(res.data.msg);
                }
             })
         },
       //合并单元格
        mergeColumn({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            if (row.pos > 1) {
              return {
                rowspan: row.pos,
                colspan: 1
              };
            } else if (row.pos === 0) {
              return {
                rowspan: 0,
                colspan: 0
              };
            } else {
              return {
                rowspan: 1,
                colspan: 1
              };
            }
          }
        }
    }
};
</script>
<style scoped>
.assetList {
  height: 100%;
}
.table-deprecat{
    height: calc(100%-120px);
}
.el-table-model{
    height: 100%;
}
.el-table-tableTitle {
  margin-left: 13px;
  height: 34px;
  padding-top: 10px;
  font-size: 14px;
}
.table-tableData >>>.el-table__empty-text{
    /* left:10% !important; */
    color: #ff8000;
    font-size: 18px;
}
</style>
