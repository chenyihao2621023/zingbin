<template>
    <div>
        <div class="p10">
            <el-button v-bind:class="{active : modalFlag === '0'}" size="small" @click="searchBalance('0')">余额</el-button>
            <el-button v-bind:class="{active : modalFlag === '1'}" size="small" @click="searchBalance('1')">消费</el-button>
            <el-button v-bind:class="{active : modalFlag === '2'}" size="small" @click="searchBalance('2')">积分</el-button>
        </div>
        <div class="p10">
            <el-table v-show="modalFlag ==='0'" :data="balanceData" border style="width: 100%" v-loading="0">
                <el-table-column prop="createTime" label="交易时间"></el-table-column>
                <el-table-column prop="useName" label="客户姓名"></el-table-column>
                <el-table-column prop="settlementWay" label="交易类型"></el-table-column>
                <el-table-column prop="tradeAmount" label="交易金额"></el-table-column>
                <el-table-column prop="tradeType" label="交易方式"></el-table-column>
                <el-table-column prop="amount" label="当前余额"></el-table-column>
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
                <el-table-column prop="memberItemId" label="交易流水号"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
            </el-table>
            <el-table v-show="modalFlag ==='1'" :data="balanceData" border style="width: 100%" v-loading="0">
                <el-table-column prop="createTime" label="交易时间"></el-table-column>
                <el-table-column prop="useName" label="客户姓名"></el-table-column>
                <el-table-column prop="settlementWay" label="交易类型"></el-table-column>
                <el-table-column prop="tradeAmount" label="交易金额"></el-table-column>
                <el-table-column prop="tradeType" label="付款方式"></el-table-column>
                <!-- <el-table-column prop="settlementWay" label="交易方式"></el-table-column> -->
                <!--<el-table-column prop="amount" label="当前余额"></el-table-column>-->
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
                <el-table-column prop="memberItemId" label="交易流水号"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
            </el-table>
            <el-table v-show="modalFlag ==='2'" :data="balanceData" border style="width: 100%" v-loading="0">
                <el-table-column prop="createTime" label="交易时间"></el-table-column>
                <el-table-column prop="useName" label="客户姓名"></el-table-column>
                <el-table-column prop="settlementWay" label="交易类型"></el-table-column>
                <el-table-column prop="tradeAmount" label="积分"></el-table-column>
                <el-table-column prop="tradeType" label="交易方式"></el-table-column>
                <el-table-column prop="amount" label="当前积分"></el-table-column>
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
                <el-table-column prop="memberItemId" label="交易流水号"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
            </el-table>
        </div>
        <div class="right p10">
            <el-pagination background @current-change="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
    // 使用方法  <exchange-detail :searchValue="test" ></exchange-detail> searchValue为卡号或姓名为查询提供
    export default {
        name: "ExchangeDetailComponets",
        props: {
            searchValue: {}
        },
        data() {
            return {
                // searchValue: null,
                title: "交易明细",
                showLoading: true,
                modalFlag: "0",
                pageNumber: 1,
                pageSize: 4,
                total: 0,
                balanceData: [],
                consumeData: [],
                integralData: [],
                currentBlance: null
            }
        },
        watch:{
            searchValue (isShow) {
                this.initData();
            },
        },
        created() {
            this.initData();
        },
        methods: {
            initData(type) {
                let that = this
                let queryParam = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    memberItemType: type || this.currentBlance || 0
                }
                if (this.searchValue && this.searchValue.memberId && this.searchValue.memberId !== null) {
                    queryParam.memberId = this.searchValue.memberId
                }
                let url = "/zingbiz/member/memberService/loadMemberBillItembyMemberId";
                this.$vux.loading.show({
                    text: ''
                })
                this.$http
                    .post(url, queryParam)
                        .then(res => {
                            console.log(res.data.data.data)
                            res.data.data.data.forEach(item => {
                                item.tradeAmount = Math.abs(Number(item.tradeAmount))
                            })
                            that.showLoading = false
                            that.balanceData = res.data.data.data
                            that.total = parseInt(res.data.data.total)
                            this.$vux.loading.hide()
                        }).catch(error => {
                            that.showLoading = false
                            this.$vux.loading.hide()
                            that.$message({
                                type: "error",
                                message: "请求数据失败，请刷新重试"
                            });
                        })

                    },
                    search(keyWorld) {
                        this.searchValue.memberId = keyWorld
                        this.initData()
                    },
                    searchBalance(key) {
                        this.currentBlance = key
                        this.modalFlag = key
                        this.initData(key)
                    },
                    currentPage(val) {
                        this.pageNumber = val;
                        this.showLoading = true;
                        this.initData();
                    }
            }
        }

</script>
<style scoped>
    .p10 {
        padding: 10px;
    }

    .right {
        float: right;
    }

    .active {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }

</style>
