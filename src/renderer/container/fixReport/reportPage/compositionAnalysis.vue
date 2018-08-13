<template>
    <div class="outwrapper">
        <ZingHead title="固定资产构成分析表">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div v-show="defaultPage" class="el-table-model">
            <div class="el-table-tableTitle">
                会计期间:{{period}}
            </div>
            <div class="table-deprecat">
                <el-table :data="tableData" :span-method="objectSpanMethod" show-summary max-height="500" style="width: 100%" border>
                    <el-table-column fixed prop="projectName" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="assetsCoding" label="资产编码" >
                    </el-table-column>
                    <el-table-column prop="assetsName" label="资产名称">
                    </el-table-column>
                    <el-table-column prop="originalCurrencyAmount" label="期末原值" width="120px">
                    </el-table-column>
                    <el-table-column prop="OriginalRatioBig" label="占该使用状态%" width="120px">
                    </el-table-column>
                    <el-table-column prop="OriginalRatioSmall" label="占固定资产%" width="120px">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <popup position="top" v-model="popupIncrease" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="popup-increase">
                <div class="initFrom-title">筛选条件</div>
                <group>
                    <datetime v-model="searchData" format="YYYY-MM" title="会计期间" @on-cancel="log('cancel')" @on-confirm="onConfirm"></datetime>
                    <selector title="汇总项目" :options="['资产类别', '使用状态','变动方式','存放地点','经济用途']" v-model="project" class="project"></selector>
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
    import {
        Popup,
        Datetime,
        Flexbox,
        FlexboxItem,
        Group,
        Selector
    } from "vux";
    import ZingHead from "components/zingHead/ZingHead.vue";
    import { Z_IsEmpty20 } from "@/utils/fn";
    export default {
        name: "composition-analysis",
        components: {
            ZingHead,
            Popup,
            Datetime,
            Flexbox,
            FlexboxItem,
            Group,
            Selector
        },
        data() {
            return {
                prompt:true,
                defaultPage: false,
                popupIncrease: false,
                searchFlag:true,
                period:"",
                project:"资产类别",
                searchData:"",
                tableData: [],
                initData:[]
            }
        },
        methods: {
            search() {
                this.popupIncrease = true;
            },
            //合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
            cancleNew() {
                this.popupIncrease = false;
                if (this.tableData.length === 0) {
                    this.prompt = true
                    this.defaultPage = false
                } else {
                    this.prompt = false
                    this.defaultPage = true
                }
            },
            confirmNew() {
                let params = {}
                if (Z_IsEmpty20(this.searchData)) {
                    this.$vux.toast.text("请选择会计期间")
                    return
                } else {
                    params.period = this.searchData
                    this.period = this.searchData
                }
                if (this.project === "资产类别") {
                    params.summaryProject = "assetsClass"
                } else if (this.project === "存放地点") {
                    params.summaryProject = "storePlace"
                } else if (this.project === "变动方式") {
                    params.summaryProject = "changeWay"
                } else if (this.project === "使用状态") {
                    params.summaryProject = "workingCondition"
                } else if (this.project === "经济用途") {
                    params.summaryProject = "economicUse"
                }
                this.$http.get("/zingbiz/fixedAssets/report/selectAssetsCompositionAnalysis",{
                    params:params
                }).then(res => {
                    if (res.data.success) {
                        this.tableData = []
                        this.popupIncrease = false;
                        //处理数据
                        this.initData = res.data.data
                        res.data.data.forEach(val => {
                            val.data.forEach((item, index) => {
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
                            if (this.tableData.length === 0) {
                                this.prompt = true
                                this.defaultPage = false
                            } else {
                                this.prompt = false
                                this.defaultPage = true
                            }
                        })
                    } else {
                        this.popupIncrease = false;
                        this.$vux.toast.text(res.data.msg)
                        if (this.tableData.length === 0) {
                            this.prompt = true
                            this.defaultPage = false
                        } else {
                            this.prompt = false
                            this.defaultPage = true
                        }
                    }
                    console.log(res)
                }).catch(error => {
                    console.log(error)
                })
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .popup-increase{
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
    .el-table-tableTitle {
        margin-left: 13px;
        height: 34px;
        padding-top: 10px;
        font-size: 14px;
    }
    .project:after {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 83px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .prompt {
        text-align: center
        color #ff8000
        margin-top 20px
        font-size 18px;
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
