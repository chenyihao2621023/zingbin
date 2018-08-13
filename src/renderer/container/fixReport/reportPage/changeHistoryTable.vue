<template>
    <div class="outwrapper">
        <ZingHead title="变动历史记录表" :isComeBack="false" @doSome="doSome">
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
                :data="Data"
                style="width: 100%"
                border
                max-height="500"
                show-summary
            >
                <el-table-column
                    fixed
                    prop="generateTime"
                    label="变动日期"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="变动原因"
                >
                </el-table-column>
                <el-table-column
                    prop="voucherWord"
                    label="凭证字号"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsCoding"
                    label="资产编码"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsName"
                    label="资产名称"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsClassName"
                    label="类别"
                >
                </el-table-column>
                <el-table-column
                    prop="changeWayName"
                    label="变动方式"
                >
                </el-table-column>
                <el-table-column
                    prop="manufacturer"
                    label="制造商"
                >
                </el-table-column>
                <el-table-column
                    prop="productionPlace"
                    label="产地"
                >
                </el-table-column>
                <el-table-column
                    prop="supplier"
                    label="供应商"
                >
                </el-table-column>
                <el-table-column
                    prop="startDate"
                    label="使用日期"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="workingConditionIdName"
                    label="使用情况"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="departmentName"
                    label="使用部门"
                    width="150px"
                >
                </el-table-column>

                <el-table-column
                    prop="economicUse"
                    label="经济用途"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationMethod"
                    label="折旧方法"
                    width="150px"
                >
                </el-table-column>
                <el-table-column
                    prop="storePlaceIdName"
                    label="存放地点"
                >
                </el-table-column>
                <el-table-column
                    prop="originalCurrencyAmount"
                    label="原值"
                >
                </el-table-column>

                <el-table-column
                    prop="originalValueChange"
                    label="原值变动"
                >
                </el-table-column>
                <el-table-column
                    prop="accumulatedDepreciationAmount"
                    label="累计折旧"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationAmount"
                    label="折旧调整"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="netWorth"
                    label="净值"
                >
                </el-table-column>
                <el-table-column
                    prop="impairmentPreparation"
                    label="减值准备"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationChange"
                    label="减值准备变动"
                    width="120px"
                >
                </el-table-column>
                <el-table-column
                    prop="netAmount"
                    label="净额"
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
            </el-table>
            <el-pagination
                v-show="pagination"
                small
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange"
                :page-size="10"
                :page-sizes="[10]"
                layout="sizes, prev, pager, next"
                :total="1000"
            >
            </el-pagination>
        </div>
        <searchList
            :searchPage="searchPage"
            :checkList="checkList"
            :accountEnd="accountEnd"
            :accountStart="accountStart"
            :accountDuring="accountDuring"
            :projectFlag="projectFlag"
            @search="searchChangingHistory"
        ></searchList>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import searchList from "../reportTemplate/searchList.vue";
    import { mapActions } from 'vuex'
    export default {
        name: "change-history-table",
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
                projectFlag:false,
                tableData: [],
                Data:[],
                prompt:true,
                pagination:true,
                currentPage:1,
                startNumber:0,
                endNumber:10,
            }
        },
        methods:{
            //获取折旧方法
            ...mapActions([
                'depreciationMethod',
            ]),
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
            //获取初始数据
            selectAssetsChangingHistory(params) {
                this.$http.get("/zingbiz/fixedAssets/report/selectAssetsChangingHistory",{
                    params:params
                }).then((res) => {
                    this.searchPage = false
                    this.searchFlag = true
                    if (res.data.success) {
                        if (parseInt(res.data.total) === 0) {
                            this.prompt = true
                            this.defaultPage = false
                            this.pagination = false
                        } else {
                            this.tableData = res.data.data
                            this.prompt = false
                            this.defaultPage = true
                            this.pagination = true
                            this.tableData.forEach(val => {
                                this.depreciationMethod(val.depreciationMethod)
                                val.generateTime = val.generateTime.split(" ")[0]
                                val.depreciationMethod = this.$store.state.fixedAssets.methodData
                            })
                            if (res.data.total <= 10) {
                                this.pagination = false
                                this.Data = this.tableData
                            } else {
                                this.pagination = true
                                this.Data = this.tableData.slice(this.startNumber,this.endNumber)
                            }
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //根据查询条件获取数据
            searchChangingHistory (returnData) {
                this.period = returnData.startTime + "- -" + returnData.endTime
                this.selectAssetsChangingHistory(returnData)
            },
            //分页查询
            handleCurrentChange(pageSize) {
                this.startNumber = 10 * (pageSize - 1)
                this.endNumber = 10 * pageSize
                this.Data = this.tableData.slice(this.startNumber,this.endNumber)
            }
        }
    }
</script>
<style>
   .fixReport .outwrapper .el-table th,.fixReport .outwrapper .el-table td{
        padding: 0.4rem 0 !important;
    }
    /*分页的大小*/
   .fixReport .outwrapper .el-pagination .el-select .el-input{
        width: 6rem !important;
    }
   .fixReport .outwrapper .el-pagination__sizes{
        margin-right: 0 !important;
    }
   .fixReport .outwrapper .el-pager li{
        padding: 0 0.1rem !important;
    }
   .fixReport .outwrapper .el-pagination .btn-prev{
        padding-right: 0.5rem;
    }
   .fixReport .outwrapper .el-pagination .btn-next{
        padding-left: 0.5rem;
    }
</style>
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
