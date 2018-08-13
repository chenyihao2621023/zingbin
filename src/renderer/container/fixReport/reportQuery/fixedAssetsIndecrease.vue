<!-- 固定资产增减表 -->
<template>
    <div class="assetList">
        <ZingHead title="固定资产增减表" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
            </div>
        </ZingHead>
        <div class="el-table-crease">
            <div class="el-table-tableTitle">
                会计期间:{{period}}
            </div>
            <div class="table-deprecat">
                <el-table class="table-tableData" :data="tableData" :span-method="objectSpanMethod"
                          style="width: 100%;" border>
                    <el-table-column label="项目" prop="key1" align="center"></el-table-column>
                    <el-table-column prop="key2" align="center"></el-table-column>
                    <el-table-column label="金额" prop="value" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
        <popup position="top" v-model="popupIncrease"
               :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="popup-increase">
                <div class="initFrom-title">筛选条件</div>
                <group>
                    <datetime v-model="period" title="会计期间" format="YYYY-MM"></datetime>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancleNew">取消</flexbox-item>
                        <flexbox-item class="interspace" @click.native="confirmNew">确认</flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
    </div>
</template>
<script>
    import {
        Cell,
        Popup,
        Group,
        Datetime,
        Flexbox,
        FlexboxItem
    } from "vux";
    import Axios from 'axios'
    import ZingHead from "components/zingHead/ZingHead.vue";
    import { Z_IsEmpty20 } from "@/utils/fn";
    export default {
        components: {
            ZingHead,
            Cell,
            Popup,
            Group,
            Datetime,
            Flexbox,
            FlexboxItem
        },
        data() {
            return {
                period: "",
                popupIncrease: false,
                tableData: [],
                countKey:{},   //统计每个行含有的子级的个数
            };
        },
        methods: {
            close() {
                this.$router.go(-1);
            },
            search() {
                this.popupIncrease = true;
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                 if (row.span === 1) {
                     if (columnIndex === 0) {
                     return [1, 2];
                    } else if (columnIndex === 1) {
                        return [0, 0];
                    }
                 } else {
                     if (columnIndex === 0) {
                        let num = this.countKey[row["key1"]];
                        if (rowIndex === num["index"]) {
                            return { rowspan: num.length, colspan: 1 };
                        }
                        else {
                            return { rowspan: 0, colspan: 0 };
                        }
                    }
                 }
            },
            cancleNew() {
                this.popupIncrease = false;
            },
            confirmNew() {
                let vm = this
                if (Z_IsEmpty20(vm.period)) {
                    vm.$vux.toast.text("请选择会计期间");
                }
                let params = {
                    period: vm.period
                };
                vm.getIndecrease(params)
                vm.popupIncrease = false
            },
            // 获取固定资产增减表数据
            getIndecrease(params) {
                let vm = this;
                let url = "/zingbiz/fixedAssets/report/selectAssetsAddAndSub"
                Axios.get(url, { 'params': params }).then(res => {
                    if (res.data.success) {
                        vm.tableData = res.data.data;
                        vm.tableData = vm.handleData(res.data.data);
                        vm.countKey = vm.getCount(vm.tableData);
                        vm.searchFlag = true
                    } else {
                        vm.$vux.toast.text(res.data.mgs);
                    }
                })
            },
            handleData(data) {
                let handledData = [];
                handledData.push({
                    key1:"一.固定资产年初原值",
                    key2:"",
                    value:data["annualBeginOriginalValue"],
                })
                //todo 可以只取出这两个特殊的进行处理即可
                Object.keys(data).forEach(item => {
                    //把这两个特殊的(含有子项的),转化成表格数组元素
                    //把固定资产原值增加数的子项,转化成table表格项
                    if (item === "annualOriginalValueIncreaseStatisticsEntryNames") {
                        if (data[item] !== null) {
                            let namesArr = data[item].split(",");
                            let sum = 0.00
                            let valueArr = data["annualOriginalValueIncreaseStatisticsEntryValues"].split(",");
                            for (let i = 0; i < namesArr.length; i++) {
                                handledData.push({
                                    key1:"二.固定资产原值增加数",
                                    key2:namesArr[i],
                                    value:valueArr[i],
                                })
                                sum += parseFloat(valueArr[i])
                            }
                            handledData.push({
                                key1:"二.固定资产原值增加数",
                                key2:"小计",
                                value:sum,
                            })
                        } else {
                              handledData.push({
                                key1:"二.固定资产原值增加数",
                                key2:"",
                                value:"",
                            })
                        }
                    }
                    //把固定资产原值减少数的子项,转化成table表格项
                    if (item === "annualOriginalValueReduceStatisticsEntryNames") {
                        if (data[item] !== null ) {
                            let namesArr = data[item].split(",");
                             let sum = 0.00
                            let valueArr = data["annualOriginalValueReduceStatisticsEntryValues"].split(",");
                            for (let i = 0; i < namesArr.length; i++) {
                                handledData.push({
                                    key1:"三.固定资产原值减少数",
                                    key2:namesArr[i],
                                    value:valueArr[i],
                                })
                                sum += parseFloat(valueArr[i])
                            }
                            handledData.push({
                                key1:"三.固定资产原值减少数",
                                key2:"小计",
                                value: sum,
                            })
                        } else {
                             handledData.push({
                                key1:"三.固定资产原值减少数",
                                key2:"",
                                value:"",
                            })
                        }
                    }
                })

                handledData.push({
                    key1:"四.本年累计折旧额",
                    key2:"",
                    value:data["annualAccumulatedDepreciationAmountStatistics"],
                })
                handledData.push({
                    key1:"五.固定资产原值期末数",
                    key2:"",
                    value:data['originalValueClosingBalanceStatistics'],
                })
                handledData.push({
                    key1:"六.累计折旧总额",
                    key2:"",
                    value:data['accumulatedDepreciationAmountStatistics'],
                })
                handledData.push({
                    key1:"七.固定资产净值",
                    key2:"",
                    value:data['netWorthStatistics'],
                })
                handledData.push({
                    key1:"八.减值准备总额",
                    key2:"",
                    value:data['accumulatedImpairmentPreparationStatistics'],
                })
                handledData.push({
                    key1:"九.固定资产净额",
                    key2:"",
                    value:data['netAmountStatistics'],
                })
                return handledData;
            },
            //统计每个项目含有的子项目的个数
            getCount(data) {
                this.countKey = {};
                data.forEach((row,i) => {
                    let keyId = row["key1"];
                    if (this.countKey[keyId]) {
                        this.countKey[keyId].push(row)
                    } else {
                        this.countKey[keyId] = [row]
                        this.$set(this.countKey[keyId],"index",i)
                    }
                })
                Object.keys(this.countKey).forEach(item => {
                   this.countKey[item][0].span = this.countKey[item].length
                })
                return this.countKey
            },
        }
    };
</script>
<style scoped>
    .assetList {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .el-table-crease{
        height: 100%;
        overflow-y: auto;
    }

    .table-deprecat {
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

    .table-tableData >>> .el-table__empty-text {
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

