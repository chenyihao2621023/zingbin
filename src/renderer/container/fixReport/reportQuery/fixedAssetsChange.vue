<!-- 固定资产变动情况表 -->
<template>
    <div class="assetList">
        <ZingHead title="固定资产变动情况表" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div v-show="defaultPage" class="el-table-model">
            <div class="table-deprecat">
                <el-table class="table-tableData" :data="tableList" :span-method="objectSpanMethod" style="width: 100%">
                    <el-table-column fixed prop="name" label="汇总项目">
                    </el-table-column>
                    <el-table-column label="资产编码" prop="assetsCoding">
                    </el-table-column>
                    <el-table-column prop="assetsName" label="资产名称">
                    </el-table-column>
                    <!-- <el-table-column label="规格" prop="specification">
                    </el-table-column> -->
                    <el-table-column prop="originalValueOpeningBalance" label="原值期初余额" width="120px">
                    </el-table-column>
                    <el-table-column prop="originalValueDebit" label="原值借方" width="120px">
                    </el-table-column>
                    <el-table-column prop="originalValueCredit" label="原值贷方" width="120px">
                    </el-table-column>
                    <el-table-column prop="originalValueClosingBalance" label="原值期末余额" width="120px">
                    </el-table-column>
                    <el-table-column label="累计折旧期初余额" prop="accumulatedDepreciationOpeningBalance" width="120px">
                    </el-table-column>
                    <el-table-column prop="accumulatedDepreciationDebit" label="累计折旧借方" width="120px">
                    </el-table-column>
                    <el-table-column label="累计折旧贷方" prop="accumulatedDepreciationCredit" width="120px">
                    </el-table-column>
                    <el-table-column prop="accumulatedDepreciationClosingBalance" label="累计折旧期末余额" width="120px">
                    </el-table-column>
                    <el-table-column prop="openingNetWorth" label="期初净值" width="120px">
                    </el-table-column>
                    <el-table-column prop="closingNetWorth" label="期末净值" width="120px">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsOpeningBalance" label="减值准备期初余额" width="120px">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsDebit" label="减值准备借方" width="120px">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsCredit" label="减值准备贷方">
                    </el-table-column>
                    <el-table-column prop="depreciationPreparationsClosingBalance" label="减值准备期末余额">
                    </el-table-column>
                    <el-table-column prop="openingNetAmount" label="期初净额">
                    </el-table-column>
                    <el-table-column prop="closingNetAmount" label="期末净额">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <search-assets-change :searchPage="searchPage" @submitAssetChange="submitAssetChange"></search-assets-change>
    </div>
</template>
<script>
import Axios from "axios";
import ZingHead from "components/zingHead/ZingHead.vue";
import searchAssetsChange from "../searchPopup/searchAssetsChange";
export default {
  components: {
    ZingHead,
    searchAssetsChange
  },
  data() {
    return {
      defaultPage: true,
      searchPage: false,
      searchFlag: true,
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
        //查询固定资产变动情况表数据
        submitAssetChange(param) {
            let vm = this;
            vm.getAssetChange(param);
            vm.searchPage = false;
            vm.defaultPage = true
        },
        //获取固定资产变动情况表数据
        getAssetChange(params) {
        let vm = this;
        let url = "/zingbiz/fixedAssets/report/selectAssetsChange";
        Axios.get(url, { params: params }).then(res => {
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
.el-table-change {
  height: 100%;
}
.table-deprecat {
  height: calc(100%-80px);
}
.table-tableData >>>.el-table__empty-text{
    left:10% !important;
    color: #ff8000;
    font-size: 18px;
}
</style>
