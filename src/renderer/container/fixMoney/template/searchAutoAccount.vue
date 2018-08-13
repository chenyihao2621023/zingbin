<template>
    <div class="searchAuto">
        <ZingHead title="自动对账" :isComeBack="isComeBack" v-on:doSome="doSome">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search()"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div v-show="defaultPage">
            <el-table
                :data="tableData3"
                style="width: 100%">
                <el-table-column
                    prop="systemName"
                    label="系统名称"
                    fixed
                    width="120">
                </el-table-column>
                <el-table-column label="固定资产原值" align="center"
                >
                    <el-table-column
                        prop="originalInitialBalance"
                        label="期初余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="originalDebit"
                        label="本期借方"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="originalLenders"
                        label="本期贷方"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="originalFinalBalance"
                        label="期末余额"
                        width="300">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="累计折旧" align="center">
                    <el-table-column
                        prop="accumulatedInitialBalance"
                        label="期初余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="accumulatedDebit"
                        label="借方余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="accumulatedLenders"
                        label="贷方余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="accumulatedFinalBalance"
                        label="期末余额"
                        width="120">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="减值准备" align="center">
                    <el-table-column
                        prop="devaluationInitialBalance"
                        label="期初余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="devaluationDebit"
                        label="借方余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="devaluationLenders"
                        label="贷方余额"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="devaluationFinalBalance"
                        label="期末余额"
                        width="120">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    export default {
        name: "search-auto-account",
        components:{
            ZingHead
        },
        props:{
            params:{
                default:function () {
                    return {}
                }
            }
        },
        data() {
            return {
                tableData3: [],
                isComeBack:false,
                prompt:false,
                defaultPage:false,
            }
        },
        watch: {

        },
        created() {
            this.getResult()
        },
        methods:{
            search() {
                this.$emit("doSome")
            },
            doSome() {
                this.$emit("doSome")
            },
            //查询数据
            getResult() {
                this.$http.post("/zingbiz/fixedAssets/assetsManagement/selectAutomaticReconciliation",this.params)
                    .then((res) => {
                        if (res.data.success) {
                            if (res.data.data.length === 0) {
                                this.defaultPage = false
                                this.prompt = true
                            } else {
                                this.tableData = res.data.data
                                this.prompt = false
                                this.defaultPage = true
                                //总账系统
                                let obj = { systemName:"总账系统" }
                                let obj2 = { systemName:"固定资产系统" }
                                let obj3 = { systemName:"差异" }
                                Object.keys(res.data.data["original"]["whole"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj.originalInitialBalance = res.data.data["original"]["whole"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj.originalFinalBalance = res.data.data["original"]["whole"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj.originalDebit = res.data.data["original"]["whole"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj.originalLenders = res.data.data["original"]["whole"][val]
                                    }
                                })
                                Object.keys(res.data.data["accumulated"]["whole"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj.accumulatedInitialBalance = res.data.data["accumulated"]["whole"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj.accumulatedFinalBalance = res.data.data["accumulated"]["whole"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj.accumulatedDebit = res.data.data["accumulated"]["whole"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj.accumulatedLenders = res.data.data["accumulated"]["whole"][val]
                                    }
                                })
                                Object.keys(res.data.data["devaluation"]["whole"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj.devaluationInitialBalance = res.data.data["devaluation"]["whole"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj.devaluationFinalBalance = res.data.data["devaluation"]["whole"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj.devaluationDebit = res.data.data["devaluation"]["whole"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj.devaluationLenders = res.data.data["accumulated"]["whole"][val]
                                    }
                                })
                                //固定资产系统
                                Object.keys(res.data.data["original"]["fixed"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj2.originalInitialBalance = res.data.data["original"]["fixed"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj2.originalFinalBalance = res.data.data["original"]["fixed"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj2.originalDebit = res.data.data["original"]["fixed"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj2.originalLenders = res.data.data["original"]["fixed"][val]
                                    }
                                })
                                Object.keys(res.data.data["accumulated"]["fixed"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj2.accumulatedInitialBalance = res.data.data["accumulated"]["fixed"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj2.accumulatedFinalBalance = res.data.data["accumulated"]["fixed"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj2.accumulatedDebit = res.data.data["accumulated"]["fixed"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj2.accumulatedLenders = res.data.data["accumulated"]["fixed"][val]
                                    }
                                })
                                Object.keys(res.data.data["devaluation"]["fixed"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj2.devaluationInitialBalance = res.data.data["devaluation"]["fixed"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj2.devaluationFinalBalance = res.data.data["devaluation"]["fixed"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj2.devaluationDebit = res.data.data["devaluation"]["fixed"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj2.devaluationLenders = res.data.data["accumulated"]["fixed"][val]
                                    }
                                })
                                //差异
                                Object.keys(res.data.data["original"]["difference"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj3.originalInitialBalance = res.data.data["original"]["difference"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj3.originalFinalBalance = res.data.data["original"]["difference"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj3.originalDebit = res.data.data["original"]["difference"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj3.originalLenders = res.data.data["original"]["difference"][val]
                                    }
                                })
                                Object.keys(res.data.data["accumulated"]["difference"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj3.accumulatedInitialBalance = res.data.data["accumulated"]["difference"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj3.accumulatedFinalBalance = res.data.data["accumulated"]["difference"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj3.accumulatedDebit = res.data.data["accumulated"]["difference"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj3.accumulatedLenders = res.data.data["accumulated"]["difference"][val]
                                    }
                                })
                                Object.keys(res.data.data["devaluation"]["difference"]).forEach((val) => {
                                    //期初余额
                                    if (val === "initialBalance") {
                                        obj3.devaluationInitialBalance = res.data.data["devaluation"]["difference"][val]
                                    }
                                    //期末余额
                                    if (val === "finalBalance") {
                                        obj3.devaluationFinalBalance = res.data.data["devaluation"]["difference"][val]
                                    }
                                    //借方
                                    if (val === "debit") {
                                        obj3.devaluationDebit = res.data.data["devaluation"]["difference"][val]
                                    }
                                    //贷方
                                    if (val === "lenders") {
                                        obj3.devaluationLenders = res.data.data["accumulated"]["difference"][val]
                                    }
                                })
                                this.tableData3.push(obj)
                                this.tableData3.push(obj2)
                                this.tableData3.push(obj3)
                            }
                        } else {
                            this.$vux.toast.text(res.data.msg)
                        }

                })
            }
        }
    }
</script>
<style>
    .searchAuto .el-table thead.is-group th{
        background-color: white !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
