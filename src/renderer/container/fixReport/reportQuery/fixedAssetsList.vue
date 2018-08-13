<!-- 固定资产清单 -->
<template>
    <div class="assetList">
        <ZingHead title="固定资产清单" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div v-show="defaultPage" class="el-table-model">
            <div class="table-deprecat">
                <el-table class="table-tableData" :data="tableData" style="width: 100%" show-summary @row-click="rowClick">
                    <el-table-column prop="assetsName" label="资产名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="assetsCoding" label="资产编码" width="90px">
                    </el-table-column>
                    <el-table-column prop="assetsClassName" label="类别">
                    </el-table-column>
                    <!-- <el-table-column prop="model" label="型号">
                    </el-table-column> -->
                    <el-table-column prop="measurementUnits" label="单位">
                    </el-table-column>
                    <el-table-column prop="changeWayName" label="变动方式">
                    </el-table-column>
                    <el-table-column prop="postingDate" label="入账日期">
                    </el-table-column>
                    <el-table-column prop="startDate" label="使用日期">
                    </el-table-column>
                    <el-table-column prop="workingConditionName" label="使用情况">
                    </el-table-column>
                    <el-table-column prop="allocationDepartmentNames" label="使用部门">
                    </el-table-column>
                    <el-table-column prop="economicUse" label="经济用途">
                    </el-table-column>
                    <el-table-column prop="storePlaceName" label="存放地点">
                    </el-table-column>
                    <el-table-column prop="count" label="数量">
                    </el-table-column>
                    <el-table-column prop="currencyName" label="币别">
                    </el-table-column>
                    <el-table-column prop="exchangeRate" label="汇率">
                    </el-table-column>
                    <el-table-column prop="originalCurrencyAmount" label="原值原币">
                    </el-table-column>
                    <el-table-column prop="localCurrencyAmount" label="原值本币">
                    </el-table-column>
                    <el-table-column prop="accumulatedDepreciationAmount" label="累计折旧" width="120px">
                    </el-table-column>
                    <el-table-column prop="netWorth" label="净值">
                    </el-table-column>
                    <el-table-column prop="impairmentPreparation" label="减值准备">
                    </el-table-column>
                    <el-table-column prop="endNetAmount" label="净额">
                    </el-table-column>
                    <el-table-column prop="estimatedResidualValue" label="预计净残值">
                    </el-table-column>
                    <el-table-column prop="depreciationAmount" label="本期折旧额">
                    </el-table-column>
                    <el-table-column prop="usedPeriod" label="使用寿命">
                    </el-table-column>
                    <el-table-column prop="remainingPeriod" label="剩余寿命">
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 30, 40,50,100]" :page-size="20" layout="sizes, prev, pager, next" :total="400">
            </el-pagination>
        </div>
        <searchAssetsList :searchPage="searchPage"
         @submitAssetList="submitAssetList"></searchAssetsList>
    </div>
</template>
<script>
import Axios from 'axios'
import ZingHead from "components/zingHead/ZingHead.vue";
import searchAssetsList from "../searchPopup/searchAssetsList";
export default {
    components: {
        ZingHead,
        searchAssetsList
    },
    data() {
        return {
            currentPage: 1,
            defaultPage: true,
            searchPage: false,
            searchFlag: true,
            tableData: [],
            tmpData:{},
            searchPopup: false,
            currPage: 1,
            pageSize: 10
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
        //根据条件查询数据
        submitAssetList(param) {
            let vm = this;
            vm.tmpData = param
            param['page'] = 1
            param['pageSize'] = 20
            vm.getAssetData(param)
            vm.defaultPage = true
            vm.searchPage = false
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
            vm.getAssetData(vm.tmpData)
        },
        // 行点击事件跳转页面
        rowClick() {
            this.$router.push({
                path: "/fixMoneyMain/seeAssetManage",
                query: {
                flag: "watch"
                }
            });
        },
        // 获取固定资产清单 接口方法
        getAssetData(params) {
            let vm = this;
            let url = "/zingbiz/fixedAssets/report/selectAssets";
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
  height: calc(100%-85px);
}
.table-tableData >>>.el-table__empty-text{
    left:10% !important;
    color: #ff8000;
    font-size: 18px;
}
</style>



