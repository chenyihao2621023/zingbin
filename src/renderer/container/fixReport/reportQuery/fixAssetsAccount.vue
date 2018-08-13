<!-- 固定资产明细账-->
<template>
    <div class="assetList">
        <ZingHead title="固定资产明细账" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div class="el-table-crease">
            <div class="el-table-tableTitle">
                会计期间:{{startTime}} - {{endTime}}
            </div>
            <div class="table-deprecat">
            <el-table class="table-tableData" :data="tableData" :span-method="objectSpanMethod" style="width: 100%;" border :max-height="500">
                <el-table-column prop="postingDate" label="日期" fixed width="100">
                </el-table-column>
                <el-table-column prop="pzWord" label="凭证字号">
                </el-table-column>
                <el-table-column prop="summary" label="摘要">
                </el-table-column>
                <el-table-column prop="assetsCoding" label="资产编码">
                </el-table-column>
                <el-table-column prop="assetsName" label="资产名称">
                </el-table-column>
                <el-table-column prop="currencyName" label="币别">
                </el-table-column>
                <el-table-column prop="originalCurrencyAmount" label="原币金额">
                </el-table-column>
                <el-table-column label="原值（综合本位币）">
                    <el-table-column prop="originalValueDebit" label="借方金额">
                    </el-table-column>
                    <el-table-column prop="originalValueCredit" label="贷方金额">
                    </el-table-column>
                    <el-table-column prop="originalValueClosingBalance" label="余额">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="累计折旧（综合本位币）">
                    <el-table-column prop="accumulatedDepreciationDebit" label="借方金额">
                    </el-table-column>
                    <el-table-column prop="accumulatedDepreciationCredit" label="贷方金额">
                    </el-table-column>
                    <el-table-column prop="accumulatedDepreciationClosingBalance" label="余额">
                    </el-table-column>
                </el-table-column>

                <el-table-column label="减值准备（综合本位币）">
                    <el-table-column prop="depreciationPreparationsDebit" label="借方金额">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsCredit" label="贷方金额">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsOpeningBalance" label="余额">
                    </el-table-column>
                </el-table-column>
                 <el-table-column label="净值（综合本位币）" prop="netWorth">
                </el-table-column>
                <el-table-column label="净额（综合本位币）" prop="netAmount">
                </el-table-column>
                <el-table-column label="数量" prop="count">
                </el-table-column>
            </el-table>
            </div>

            <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10]" :page-size="10" layout="sizes, prev, pager, next" :total="400">
            </el-pagination>
        </div>
        <popup position="top" v-model="isPopupAccount" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="popup-increase">
                <div class="initFrom-title">筛选条件</div>
                <group>
                    <datetime v-model="startTime" title="起始期间" format="YYYY-MM"></datetime>
                    <datetime v-model="endTime" title="截止期间" format="YYYY-MM"></datetime>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancleNew">
                            取消
                        </flexbox-item>
                        <flexbox-item class="interspace" @click.native="confirmNew">
                            确认
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
    </div>
</template>
<script>
import Axios from 'axios'
import { Popup, Group, Datetime, Flexbox, FlexboxItem } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
    components: {
        ZingHead,
        Popup,
        Group,
        Datetime,
        Flexbox,
        FlexboxItem
    },
    data() {
        return {
        isPopupAccount: false,
        startTime: "",
        endTime: "",
        currentPage: 1,
        tableData: [],
        tmpData:{},
        currPage:1,
        pageSize:20,
        periodData:[] //期间数据
        };
    },
    methods: {
        close() {
            let vm = this;
            vm.$router.go(-1);
        },
        search() {
            this.isPopupAccount = true;
        },
        cancleNew() {
            this.isPopupAccount = false;
        },
        //根据条件查询数据
        confirmNew() {
            let vm = this;
            if (Z_IsEmpty20(vm.startTime)) {
                vm.$vux.toast.text("请选择起始期间");
            }
            if (Z_IsEmpty20(vm.endTime)) {
                vm.$vux.toast.text("请选择截止期间");
            }
            let params = {
                startPeriod:vm.startTime,
                endPeriod:vm.endTime,
                page :vm.currPage,
                pageSize:vm.pageSize
            }
            vm.tmpData = params
            vm.getDepreciation( params)
            vm.isPopupAccount = false
        },
        // 每页显示数据切换
        handleSizeChange(val) {
            let vm = this
            vm.pageSize = val
        },
        //分页查询
        handleCurrentChange(val) {
            let vm = this
            vm.currPage = val
            let page = val ? { page: val } : {}
            let pageSize = vm.pageSize ? { pageSize: vm.pageSize } : {}
            vm.tmpData = Object.assign ({}, vm.tmpData,page,pageSize)
            vm.getDepreciation( vm.tmpData )
        },
        // 获取固定资产明细账数据
        getDepreciation(params) {
            let vm = this
            let url = "/zingbiz/fixedAssets/report/selectAssetsDetail"
            Axios.get(url,{ 'params': params }).then(res => {
               if (res.data.success) {
                   let returnData = res.data.data
                     vm.tableData = []
                     vm.periodData = []
                     Object.keys(returnData).forEach(item => {
                        if (item === "periodBeginReportAssetsPeriodStatistics") {
                            let periodBegin = {
                                postingDate : '期初余额',
                                originalValueDebit:returnData[item].annualOriginalValueDebitStatistics,
                                originalValueCredit:returnData[item].annualOriginalValueCreditStatistics,
                                originalValueClosingBalance:returnData[item].originalValueClosingBalanceStatistics,
                                accumulatedDepreciationDebit:returnData[item].annualAccumulatedDepreciationDebitStatistics,
                                accumulatedDepreciationCredit:returnData[item].annualAccumulatedDepreciationCreditStatistics,
                                accumulatedDepreciationClosingBalance:returnData[item].annualAccumulatedDepreciationClosingBalanceStatistics,
                                depreciationPreparationsDebit:returnData[item].annualDepreciationPreparationsDebitStatistics,
                                depreciationPreparationsCredit:returnData[item].annualDepreciationPreparationsCreditStatistics,
                                depreciationPreparationsOpeningBalance:returnData[item].depreciationPreparationsClosingBalanceStatistics,
                                netWorth: returnData[item].netWorthStatistics,
                                netAmount: returnData[item].netAmountStatistics,
                                countStatistics:returnData[item].countStatistics,
                            }
                            vm.tableData.unshift(periodBegin)
                        } else if (item === "annualReportAssetsPeriodStatistics") {
                             let annualReport = {
                                postingDate : '本年累计',
                                originalValueDebit:returnData[item].annualOriginalValueDebitStatistics,
                                originalValueCredit:returnData[item].annualOriginalValueCreditStatistics,
                                originalValueClosingBalance:returnData[item].originalValueClosingBalanceStatistics,
                                accumulatedDepreciationDebit:returnData[item].annualAccumulatedDepreciationDebitStatistics,
                                accumulatedDepreciationCredit:returnData[item].annualAccumulatedDepreciationCreditStatistics,
                                accumulatedDepreciationClosingBalance:returnData[item].annualAccumulatedDepreciationClosingBalanceStatistics,
                                depreciationPreparationsDebit:returnData[item].annualDepreciationPreparationsDebitStatistics,
                                depreciationPreparationsCredit:returnData[item].annualDepreciationPreparationsCreditStatistics,
                                depreciationPreparationsOpeningBalance:returnData[item].depreciationPreparationsClosingBalanceStatistics,
                                netWorth: returnData[item].netWorthStatistics,
                                netAmount: returnData[item].netAmountStatistics,
                                countStatistics:returnData[item].countStatistics,
                            }
                            vm.tableData.push(annualReport)
                        } else if (item === "periodStatisticsList") {
                         let arrIndex = []
                          returnData[item].forEach(val => {
                            if (!val) {
                              return false
                            }
                            vm.periodData.push({
                              postingDate : "第" + val.period.split("-")[1].substring(1) + "期合计",
                              originalValueDebit:val.annualOriginalValueDebitStatistics,
                              originalValueCredit:val.annualOriginalValueCreditStatistics,
                              originalValueClosingBalance:val.originalValueClosingBalanceStatistics,
                              accumulatedDepreciationDebit:val.annualAccumulatedDepreciationDebitStatistics,
                              accumulatedDepreciationCredit:val.annualAccumulatedDepreciationCreditStatistics,
                              accumulatedDepreciationClosingBalance:val.annualAccumulatedDepreciationClosingBalanceStatistics,
                              depreciationPreparationsDebit:val.annualDepreciationPreparationsDebitStatistics,
                              depreciationPreparationsCredit:val.annualDepreciationPreparationsCreditStatistics,
                              depreciationPreparationsOpeningBalance:val.depreciationPreparationsClosingBalanceStatistics,
                              netWorth:val.netWorthStatistics,
                              netAmount: val.netAmountStatistics,
                              countStatistics:val.countStatistics,
                              period:val.period
                            })
                            return true
                          })

                          returnData["data"].forEach((item,index) => {
                            if (!isNaN(Date.parse(returnData["data"][index].postingDate))) {
                              let oldVal = returnData["data"][index].postingDate.split("-")[0] + "-" + returnData["data"][index].postingDate.split("-")[1]
                              if (index === returnData["data"].length - 1) {
                                arrIndex.unshift({
                                  index:index + 1,
                                  time:oldVal
                                })
                                return
                              }
                              let newVal = returnData["data"][index + 1].postingDate.split("-")[0] + "-" + returnData["data"][index + 1].postingDate.split("-")[1]
                              if ( oldVal !== newVal) {
                                arrIndex.unshift({
                                  index:index + 1 ,
                                  time:oldVal
                                })
                              }
                            }
                          })
                          arrIndex.forEach((val) => {
                            returnData["data"].splice(val.index,0, vm.periodData.find((item) => {
                              return item.period === val.time
                            }))
                          })
                        } else {
                            returnData[item].forEach(items => {
                                 vm.tableData.push(items)
                            })
                        }
                    })
                    vm.searchFlag = true
               } else {
                    vm.tableData = []
                    vm.$vux.toast.text(res.data.msg);
               }
           })
        }
    }
};
</script>
<style scoped>
.assetList {
  height: 100%;
}
.el-table-crease{
     height: 100%;
}
.table-deprecat{
    height: calc(100% - 120px);
}
.el-table-tableTitle {
  margin-left: 13px;
  height: 34px;
  padding-top: 10px;
  font-size: 14px;
}
.popup-increase {
  height: 100%;
}
.popup-increase .initFrom-title {
  height: 40px;
  line-height: 40px;
  background-color: white;
  font-size: 18px;
  text-align: center;
}
.interspace {
  margin-left: 0px !important;
  text-align: center;
  padding: 5px 0;
}
.interspace:last-child {
  border-left: 1px solid #f5f5f5;
  color: #ff8000;
}
.table-tableData >>>.el-table__empty-text{
    left:13% !important;
    color: #ff8000;
    font-size: 18px;
}
</style>
<style>
.popup-increase .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 83px;
  color: rgba(255, 128, 0, 1) !important;
}

</style>
