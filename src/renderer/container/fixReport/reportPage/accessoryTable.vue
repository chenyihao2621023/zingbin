<template>
    <div class="outwrapper">
        <ZingHead title="附属设备明细表" :isComeBack="false" @doSome="doSome">
            <div slot="header-right">
                <span class="header-search" v-show="searchFlag">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="list2" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
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
                show-summary
            >
                <el-table-column
                    fixed
                    prop="assetsName"
                    label="资产名称"
                >
                </el-table-column>
                <el-table-column
                    prop="assetsCoding"
                    label="资产编码"
                >
                </el-table-column>
                <el-table-column
                    prop="equipmentNumber"
                    label="设备编码"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="设备名称"
                >
                </el-table-column>
                <el-table-column
                    prop="placeStorageIdName"
                    label="存放地点"
                >
                </el-table-column>
                <el-table-column
                    prop="registerDate"
                    label="日期"
                >
                </el-table-column>
                <el-table-column
                    prop="specificationModel"
                    label="型号"
                >
                </el-table-column>
                <el-table-column
                    prop="measurementUnit"
                    label="单位"
                >
                </el-table-column>
                <el-table-column
                    prop="count"
                    label="数量"
                >
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="金额"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
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
            :projectFlag="projectFlag"
            @search="searchAccessoryEquipment"
        ></searchList>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import searchList from "../reportTemplate/searchList.vue";
    import Dropdown from "@/components/dropdown/Dropdown";
    export default {
        name: "accessory-table",
        components:{
            ZingHead,
            searchList,
            Dropdown
        },
        data() {
            return {
                defaultPage:false,
                searchPage:false,
                searchFlag:true,
                checkList:false,
                projectFlag:false,
                period:"2018年5期",
                tableData: [],
                prompt:true,
                pagination:true,
                currentPage:1,
                list2:[{ content:"导出" }]
            }
        },
        methods:{
            handleMenu(data) {
                console.log(data)
            },
            search() {
                this.prompt = false
                this.searchFlag = false
                this.defaultPage = false
                this.searchPage = true
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
            //数据初始化
            selectAccessoryEquipment (params) {
                this.$http.get("/zingbiz/fixedAssets/report/selectAccessoryEquipment",{
                    params:params
                }).then((res) => {
                    if (res.data.success) {
                        this.searchPage = false
                        this.searchFlag = true
                        if (parseInt(res.data.total) === 0) {
                            this.prompt = true
                            this.defaultPage = false
                            this.pagination = false
                        } else {
                            this.prompt = false
                            this.defaultPage = true
                            this.pagination = true
                            res.data.data.forEach(val => {
                                val.accessoryEquipment.forEach((item,index) => {
                                    item.assetsName = val.assetsName
                                    item.assetsCoding = val.assetsCoding
                                    if (val.accessoryEquipment.length > 1) {
                                        if (index === 0) {
                                            item["pos"] = val.accessoryEquipment.length
                                        } else {
                                            item["pos"] = 0
                                        }
                                    } else {
                                        item["pos"] = 1
                                    }
                                })
                                this.tableData = this.tableData.concat(val.accessoryEquipment)
                            })
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //根据查询数据请求
            searchAccessoryEquipment(returnData) {
                this.period = returnData.period
                this.selectAccessoryEquipment(returnData)
            },
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
                if (columnIndex === 1) {
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
            //分页查询
            handleCurrentChange(pageSize) {
                console.log(pageSize)
            }
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
