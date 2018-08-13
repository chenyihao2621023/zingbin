<template>
    <div class="outwrapper">
        <ZingHead title="固定资产折旧汇总表" :isComeBack="false" @doSome="doSome">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div v-show="defaultPage" class="defaultPage">
            <div class="titleDate">
                会计期间：{{period}}
            </div>
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                show-summary
                max-height = "500"
            >
                <el-table-column
                    fixed
                    prop="projectName"
                    label="项目名称"
                >
                </el-table-column>
                <el-table-column
                    prop="originalValueOpeningBalance"
                    label="期初原值"
                >
                </el-table-column>
                <el-table-column
                    prop="accumulatedDepreciationOpeningBalance"
                    label="期初累计折旧"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="openingNetWorth"
                    label="期初净值"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationPreparationsOpeningBalance"
                    label="期初减值准备"
                    width="110px"
                >
                </el-table-column>

                <el-table-column
                    prop="openingNetAmount"
                    label="期初净额"
                >
                </el-table-column>
                <el-table-column
                    prop="originalValueIncrease"
                    label="原值增加"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="originalValueReduced"
                    label="原值减少"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="accumulatedDepreciationIncreases"
                    label="折旧调增"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationPreparationsIncrease"
                    label="减值准备调增"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="decreaseAllowances"
                    label="减值准备调减"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationAmount"
                    label="本期折旧额"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="annualAccumulatedDepreciationAmount"
                    label="本年折旧额"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="annualExpectedDepreciationAmount"
                    label="本年实际计提折旧额"
                    width="150px"
                >
                </el-table-column>
                <el-table-column
                    prop="originalValueClosingBalance"
                    label="期末原值"
                >
                </el-table-column>
                <el-table-column
                    prop="accumulatedDepreciationClosingBalance"
                    label="期末累计折旧"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="closingNetWorth"
                    label="期末净值"
                    width="100px"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciationPreparationsClosingBalance"
                    label="期末减值准备"
                    width="110px"
                >
                </el-table-column>

                <el-table-column
                    prop="closingNetAmount"
                    label="期末净额"
                    width="100px"
                >
                </el-table-column>
            </el-table>
        </div>
        <searchList
            :searchPage="searchPage"
            @search="searchDepreciationSummary"
        >
        </searchList>

    </div>
</template>

<script>

    import ZingHead from "components/zingHead/ZingHead.vue";
    import searchList from "../reportTemplate/searchList.vue";
    export default {
        name: "depreciation-sum-table",
        components:{
            ZingHead,
            searchList
        },
        data() {
            return {
                period:"",
                tableData: [],
                defaultPage:false,
                searchPage:false,
                searchFlag:true,
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
            //获取数据  将 table 和 分页 显示设置为false
            selectAssetsDepreciationSummary(params) {
                this.$http.get("/zingbiz/fixedAssets/report/selectAssetsDepreciationSummary",{
                    params:params
                }).then((res) => {
                    if (res.data.success) {
                        this.tableData = []
                        this.searchPage = false
                        this.searchFlag = true
                        if (res.data.data.length === 0) {
                            this.prompt = true
                            this.defaultPage = false
                        } else {
                            this.prompt = false
                            this.defaultPage = true
                            res.data.data.forEach(val => {
                                val.data.projectName = val.name
                                this.tableData.push(val.data)
                            })
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //返回数据重新查询
            searchDepreciationSummary(returnData) {
                this.period = returnData.period
                this.selectAssetsDepreciationSummary(returnData)
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .defaultPage{
            height calc(100% - 50px)
        }
    }
    .titleDate{
        padding  13px
    }
    .prompt {
        text-align: center
        color #ff8000
        margin-top 20px
        font-size 18px;
    }
</style>
