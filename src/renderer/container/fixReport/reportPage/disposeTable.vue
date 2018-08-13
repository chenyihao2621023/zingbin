<template>
    <div class="outwrapper">
        <ZingHead title="固定资产处理表" :isComeBack="false" @doSome="doSome">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div v-show="defaultPage">
            <div class="titleDate">
                会计期间：{{period}}
            </div>
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                :span-method="mergeColumn"
                max-height="500"
                show-summary
            >
                <el-table-column
                    fixed
                    prop="projectName"
                    label="项目名称"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsCoding"
                    label="资产编码"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsName"
                    label="名称"
                >
                </el-table-column>
                <el-table-column
                    prop="startDate"
                    label="使用日期"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="originalQuantity"
                    label="处理前数量"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="cleanCount"
                    label="处理数量"
                >
                </el-table-column>
                <el-table-column
                    prop="originalCurrencyAmount"
                    label="原值"
                >
                </el-table-column>
                <el-table-column
                    prop="accumulatedDepreciationAmount"
                    label="累计折旧"
                >
                </el-table-column>
                <el-table-column
                    prop="cleanCost"
                    label="处理费用"
                >
                </el-table-column>
                <el-table-column
                    prop="residualIncome"
                    label="残值收入"
                >
                </el-table-column>
                <el-table-column
                    prop="usedPeriod"
                    label="使用寿命"
                >
                </el-table-column>
                <el-table-column
                    prop="remainingPeriod"
                    label="剩余寿命"
                >
                </el-table-column>
                <el-table-column
                    prop="cleanDate"
                    label="处理日期"
                >
                </el-table-column>
                <el-table-column
                    prop="cleanRemark"
                    label="处理原因"
                >
                </el-table-column>

            </el-table>

        </div>
        <searchList
            :searchPage="searchPage"
            :checkList="checkList"
            :accountEnd="accountEnd"
            :accountStart="accountStart"
            :accountDuring="accountDuring"
            @search="searchTreatmentSituation"
        ></searchList>
    </div>
</template>


<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import searchList from "../reportTemplate/searchList.vue";
    export default {
        name: "dispose-table",
        components:{
            ZingHead,
            searchList
        },
        data() {
            return {
                period:"",
                defaultPage:false,
                searchPage:false,
                searchFlag:true,
                checkList:false,
                accountEnd:true,
                accountStart:true,
                accountDuring:false,
                tableData: [],
                initData:[],
                // mergeLength:[1,3,2],
                currentPage:1,
                prompt:true,
            }
        },
        methods:{
            search() {
                this.searchFlag = false
                this.defaultPage = false
                this.searchPage = true
                this.prompt = false
            },
            doSome() {
                if (!this.searchPage) {
                    this.$router.go(-1)
                } else {
                    this.searchFlag = true
                    this.searchPage = false
                    if (this.tableData.length === 0) {
                        this.prompt = true
                        this.defaultPage = false
                    } else {
                        this.prompt = false
                        this.defaultPage = true
                    }
                }
            },
            //合并
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
            },
            //请求数据
            selectAssetsTreatmentSituation (params) {
                this.$http.get("/zingbiz/fixedAssets/report/selectAssetsTreatmentSituation",{
                    params:params
                }).then((res) => {
                    if (res.data.success) {
                        this.searchPage = false
                        this.searchFlag = true
                        if (res.data.data.length === 0) {
                            this.defaultPage = false
                            this.prompt = true
                        } else {
                            this.prompt = false
                            this.defaultPage = true
                            //对数据进行处理
                            this.initData = res.data.data
                            res.data.data.forEach(val => {
                                val.data.forEach((item,index) => {
                                    item.projectName = val.projectName
                                    if (val.total > 1) {
                                        if (index === 0) {
                                            item["pos"] = val.total
                                        } else {
                                            item["pos"] = 0
                                        }
                                    } else {
                                        item["pos"] = 1
                                    }
                                })
                                this.tableData = this.tableData.concat(val.data)
                            })
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //根据查询条件 请求参数
            searchTreatmentSituation(returnData) {
                this.period = returnData.startTime + "--" + returnData.endTime
                this.selectAssetsTreatmentSituation(returnData)
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
    }
    .titleDate{
        margin 13px
    }
    .prompt {
        text-align: center
        color #ff8000
        margin-top 20px
        font-size 18px;
    }
</style>
