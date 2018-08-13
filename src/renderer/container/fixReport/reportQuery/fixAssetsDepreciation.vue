<!-- 固定资产折旧明细表 -->
<template>
    <div class="assetList">
        <ZingHead title="固定资产折旧明细表" :isComeBack="false" @doSome="close()">
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
                <el-table class="table-tableData" :data="tableList" style="width: 100%;" border :span-method="objectSpanMethod">
                    <el-table-column fixed prop="name" label="项目名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="assetsName" label="资产名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="assetsCoding" label="资产编码" width="100px">
                    </el-table-column>
                    <el-table-column prop="usedPeriod" label="使用寿命">
                    </el-table-column>
                    <el-table-column prop="remainingPeriod" label="已使用寿命">
                    </el-table-column>
                    <el-table-column prop="beginValue" label="期初原值" width="120px">
                    </el-table-column>
                    <el-table-column prop="beginTotal" label="期初累计折旧" width="120px">
                    </el-table-column>
                    <el-table-column prop="openingNetWorth" label="期初净值">
                    </el-table-column>
                    <el-table-column prop="beginNetValueReady" label="期初减值准备">
                    </el-table-column>
                    <el-table-column prop="openingNetAmount" label="期初净额">
                    </el-table-column>
                    <el-table-column prop="originalValueIncrease" label="原值增加">
                    </el-table-column>
                    <el-table-column prop="originalValueReduced" label="原值减少">
                    </el-table-column>
                    <el-table-column prop="depreciationDown" label="折旧调减">
                    </el-table-column>
                    <el-table-column prop="depreciation" label="折旧调整">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsIncrease" label="减值准备调增">
                    </el-table-column>
                    <el-table-column prop="decreaseAllowances" label="减值准备调减">
                    </el-table-column>
                    <el-table-column prop="originalDepreciation" label="本期折旧额">
                    </el-table-column>
                    <el-table-column prop="yearDepreciation" label="本年折旧额">
                    </el-table-column>
                    <el-table-column prop="yearActualDepreciation" label="本年实际计提折旧额" width="150px">
                    </el-table-column>
                    <el-table-column prop="endValue" label="期末原值">
                    </el-table-column>
                    <el-table-column prop="endTotal" label="期末累计折旧">
                    </el-table-column>
                    <el-table-column prop="closingNetWorth" label="期末净值">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsClosingBalance" label="期末减值准备">
                    </el-table-column>

                    <el-table-column prop="closingNetAmount" label="期末净额">
                    </el-table-column>
                </el-table>
            </div>
            <!-- <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 30, 40,50,100]" :page-size="10" layout="sizes, prev, pager, next" :total="400">
            </el-pagination> -->
        </div>
        <searchList :searchPage="searchPage" @search="submitDepreciation">
        </searchList>
    </div>
</template>
<script>
import Axios from 'axios'
import ZingHead from "components/zingHead/ZingHead.vue";
import searchList from "../reportTemplate/searchList.vue";
export default {
    components: {
        ZingHead,
        searchList
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
    computed: {
        tableList() {
            let vm = this;
            let tmpData = [];
            vm.tableData.forEach(item => {
                let tempName = item.name;
                vm.rowSpan = item.total;
                item.data.forEach((row, index) => {
                    row.name = tempName;
                    if (vm.rowSpan > 1) {
                        if (index === 0) {
                        row["span"] = vm.rowSpan;
                        } else {
                        row["span"] = 0;
                        }
                    } else {
                        row["span"] = 1;
                    }
                    tmpData.push(row);
                });
            });
            console.info(tmpData)
            return tmpData;
        }
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
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (row.span > 1) {
                    return {
                        rowspan: row.span,
                        colspan: 1
                    };
                } else if (row.span === 0) {
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
        submitDepreciation(param) {
            let vm = this;
            vm.period = param.period
            let params = {
                period: param.period
            };
            vm.getAssetData(params)
            vm.searchPage = false;
            vm.defaultPage = true
        },
        getAssetData(params) {
            let vm = this;
            let url = "/zingbiz/fixedAssets/report/selectAssetsDepreciation";
            Axios.get(url, { 'params': params }).then(res => {
                if (res.data.success) {
                    vm.tableData = res.data.data;
                    vm.searchFlag = true
                } else {
                    vm.tableData = []
                    vm.$vux.toast.text(res.data.mgs);
                }
            });
        }
    }
};
</script>
<style scoped>
.assetList {
  height: 100%;
}
.el-table-model {
  height: 100%;
}
.table-deprecat {
  height: calc(100%-120px);
}
.el-table-tableTitle {
  margin-left: 13px;
  height: 34px;
  padding-top: 10px;
  font-size: 14px;
}
.table-tableData >>>.el-table__empty-text{
    left:8% !important;
    color: #ff8000;
    font-size: 18px;
}
</style>
