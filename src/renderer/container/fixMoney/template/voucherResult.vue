<template>
    <div class="outwrapper">
        <div v-show="inner" class="inner innerHeight">
            <ZingHead title="固定资产生成凭证" :isComeBack="false" @doSome="doSome">
                <div slot="header-right" v-show="show">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
                    <span class="header-jiahao">
                    <dropdown :data="list" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
                </div>
            </ZingHead>
            <div class="prompt" v-show="prompt">该状态下没有数据</div>
            <div class="innerwrapper searchResultVoucher" :style="{ height: heightChange + 'px'}" v-show="searchResultVoucher">
                <div v-show="hint" class="hint">
                    请选择要{{hintText}}
                </div>
                <el-table
                    :data="Data"
                    style="width: 100%"
                    border
                    highlight-current-row
                    @row-click="handleRowClick"
                    @selection-change="handleSelectionChange"
                    @select ="select"
                    @select-all = "selectAll"
                    ref="multipleTable"
                >
                    <el-table-column
                        type="selection"
                        width="50"
                        v-if="checked"
                    >
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="postingDate"
                        label="日期"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="assetsName"
                        label="资产名称"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="typeFlag"
                        label="事物类型"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="changeWay"
                        label="变动方式"
                        width="100px"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="originalValueIncrease"
                        label="原值增加"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="originalValueReduced"
                        label="原值减少"
                        width="110px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="accumulatedDepreciationIncreases"
                        label="累计折旧增加"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="accumulatedDepreciationDecreases"
                        label="累计折旧减少"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="depreciationPreparationsIncrease"
                        label="减值准备增加"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="decreaseAllowances"
                        label="减值准备减少"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="residualIncome"
                        label="残值收入"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="cleaningCosts"
                        label="清理费用"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="卡片审核"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="VoucherCode"
                        label="凭证字号"
                        width="100px"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="voucherStatus"
                        label="凭证审核"
                        width="100px"
                    >
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="pagination"
                    small
                    :current-page.sync="currentPage2"
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    :page-sizes="[10]"
                    layout="sizes, prev, pager, next"
                    :total="1000"
                >
                    >
                </el-pagination>
            </div>
            <div v-show="createVoucher">
                <flexbox class="inner">
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-save" @click.native="pre()">上一步</x-button>
                    </flexbox-item>
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-common" @click.native="startCreate()">开始生成</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
            <div v-show="lookVoucher">
                <flexbox class="inner">
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-common" @click.native="affirmLook()">查看</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
            <div v-show="deleteVoucher">
                <flexbox class="inner">
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-common" @click.native="affirmDelete()">删除</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
            <confirm v-model="showRepeat"
                     title="提示"
                     @on-confirm="onConfirm">
                <p style="text-align:center;">包含已有对应的凭证，是否重新生成</p>
            </confirm>
            <confirm v-model="success"
                     title="提示"
                     cancel-text="查看报告"
                     confirm-text="关闭"
                     @on-cancel="lookReport"
                     @on-confirm="successCancle">
                <p style="text-align:center;">执行成功</p>
            </confirm>
        </div>
        <createVoucher
            v-if="create"
            @back="back"
            @next="next"
        ></createVoucher>
        <planManage
            v-if="planManage"
            :rowData="rowData"
            @comeback="comeback"
        > </planManage>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import planManage from "../template/planManage";
    import createVoucher from "../template/createVoucher";
    import { Flexbox,FlexboxItem,XButton,Confirm } from 'vux'
    import { Z_IsEmpty20 } from "@/utils/fn";

    export default {
        name: "voucher-result",
        components:{
            ZingHead,
            Dropdown,
            Flexbox,
            FlexboxItem,
            XButton,
            Confirm,
            createVoucher,
            planManage
        },
        props:{
            resultData:{
                default:function () {
                    return {}
                }
            }
        },
        data() {
            return {
                inner:true,
                show:true,
                checked:false,
                list:[
                    { content:"方案设置" },
                    { content:"生成凭证",url:"createVoucher" },
                    { content:"查看凭证" },
                    { content:"删除凭证" },
                ],
                tableData: [
                ],
                Data:[],
                currentPage2: 1,
                createVoucher:false,
                lookVoucher:false,
                deleteVoucher:false,
                hint:false,
                hintText:"",
                //单选
                rowData:[],
                //多选
                rowsData:[],
                showRepeat:false,
                success:false,
                selected:[],

                create:false,
                planManage:false,
                checkedVal:0,
                heightChange:"",
                searchResultVoucher:false,
                prompt:false,
                pagination:true,
                voucherIdFlag:false,
                //删除或者查看的数据
                lookOrDelete:{},
                lookFlag:false,
                deleteFlag:false,
                reportData:"",
                startNumber:0,
                endNumber:10,
            }
        },
        created() {
            //判断显示按钮
            if (this.$route.query.createVoucher) {
                this.createVoucher = true
                this.lookVoucher = false
                this.deleteVoucher = false
                this.hint = false
                this.show = false
                this.checked = true
            }
            //判断单选还是多选
            this.selectFixedAssets(0)
        },
        mounted() {
            this.heightChange = document.querySelector(".innerHeight").clientHeight - 50
        },
        methods:{
            //返回事件
            doSome() {
                if ((!this.createVoucher && !this.lookVoucher && !this.deleteVoucher) && (!this.lookFlag && !this.deleteFlag)) {
                    this.$emit("doSome")
                } else {
                    this.show = true
                    this.createVoucher = false
                    this.lookVoucher = false
                    this.deleteVoucher = false
                    this.deleteFlag = false
                    this.lookFlag = false
                    this.hint = false
                    this.hintText = ""
                    this.checked = false
                    this.tableData = []
                    this.selectFixedAssets(0)
                }
            },
            //标签跳转
            handleMenu(data) {
                if (data.content === "查看凭证") {
                    this.lookVoucher = true
                    this.deleteVoucher = false
                    this.createVoucher = false
                    this.hint = true
                    this.hintText = "查看"
                    this.show = false
                    this.checked = false
                    this.lookFlag = true
                    this.deleteFlag = false
                    this.tableData = []
                    this.selectFixedAssetsVoucher("lookVoucher")
                    this.heightChange = document.querySelector(".innerHeight").clientHeight - 96
                } else if (data.content === "删除凭证") {
                    this.lookFlag = false
                    this.lookVoucher = false
                    this.deleteVoucher = true
                    this.createVoucher = false
                    this.hint = true
                    this.hintText = "删除"
                    this.show = false
                    this.checked = false
                    this.tableData = []
                    this.deleteFlag = true
                    this.selectFixedAssetsVoucher("deleteVoucher")
                    this.heightChange = document.querySelector(".innerHeight").clientHeight - 96
                } else if (data.content === "方案设置") {
                    this.inner = false
                    this.planManage = true

                } else {
                    this.inner = false
                    this.create = true
                    this.heightChange = document.querySelector(".innerHeight").clientHeight - 96
                }
            },
            //查询
            search() {
                this.$emit("doSome")
            },
            //勾选checkedbox
            select(selection,row) {
                this.selected = selection;
                // 单选
                if (this.checkedVal === 0) {
                    this.rowData = []
                    this.rowData.push(row)
                    this.$refs.multipleTable.clearSelection();
                    if (row) {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    }
                } else {
                    this.rowsData = []
                    this.rowsData = this.selected
                }
            },
            selectAll(selection) {
                if (this.checkedVal === 0) {
                    this.$refs.multipleTable.clearSelection();
                    this.rowData = []
                }
            },
            //将删除或查看的数据保存
            handleRowClick(rows, event, column) {
                this.lookOrDelete = rows
            },
            //生成凭证的数据
            // handleSelectionChange(rows) {
            // },
            //上一步
            pre() {
                this.inner = false
                this.create = true
            },
            //凭证生成判断
            startCreate() {
                this.voucherIdFlag = false
                if (this.rowsData.length === 0 && this.rowData.length === 0) {
                    this.$vux.toast.text("请选择卡片")
                    return
                } else {
                    //单选
                    console.log(this.rowData)
                    if (this.checkedVal === 0) {
                        //需要判断是否包含生成凭证 （是否有字段）
                        if (this.rowData[0].voucherId === "no") {
                            let ids = []
                            ids.push(this.rowData[0].id)
                            this.$http.post("/zingbiz/fixedAssets/assetsManagement/fixedAssetsGenerationVoucher",{
                                ids:ids,
                                genType:"once"
                            }).then((res) => {
                                if (res.data.success) {
                                    this.success = true
                                    this.reportData = res.data.data
                                } else {
                                    this.$vux.toast.text(res.data.msg)
                                }
                            })
                        } else {
                            this.showRepeat = true
                        }
                    } else {  //多选
                        console.log(this.rowsData)
                        let idArr = []
                        let params = {}
                        this.voucherIdFlag = false
                        this.rowsData.forEach((val) => {
                            if (val.voucherId === "no") {
                                this.voucherIdFlag = true
                            }
                            idArr.push(val.id)
                        })
                        if (this.voucherIdFlag) {
                            this.showRepeat = true
                            return
                        }
                        params.ids = idArr
                        params.genType = "list"
                        params.summary = this.checkedVal.summary
                        this.$http.post("/zingbiz/fixedAssets/assetsManagement/fixedAssetsGenerationVoucher",params).then((res) => {
                            if (res.data.success) {
                                this.success = true
                                this.reportData = res.data.data
                            } else {
                                this.$vux.toast.text(res.data.msg)
                            }
                        })
                    }
                }
            },
            //确定生成报告 (包含已有凭证的卡片)
            onConfirm() {
                if (this.checkedVal === 0) {
                    let ids = []
                    ids.push(this.rowData[0].id)
                    this.$http.post("/zingbiz/fixedAssets/assetsManagement/fixedAssetsGenerationVoucher",{
                        ids:ids,
                        genType:"once"
                    }).then((res) => {
                        if (res.data.success) {
                            this.showRepeat = false
                            this.success = true
                            //获取生成报告的数据
                            this.reportData = res.data.data
                        } else {
                            this.$vux.toast.text(res.data.msg)
                        }

                    })
                } else {  //多选
                    let idArr = []
                    let params = {}
                    this.rowsData.forEach((val) => {
                        idArr.push(val.id)
                    })
                    params.ids = idArr
                    params.genType = "list"
                    params.summary = this.checkedVal.summary
                    this.$http.post("/zingbiz/fixedAssets/assetsManagement/fixedAssetsGenerationVoucher",params).then((res) => {
                        if (res.data.success) {
                            this.showRepeat = false
                            this.success = true
                            //获取生成报告的数据
                            this.reportData = res.data.data
                        } else {
                            this.$vux.toast.text(res.data.msg)
                        }
                    })
                }

            },
            //查看报告
            lookReport() {
                this.$router.push({
                    path:"voucherReport",
                    query:{
                        reportData:this.reportData
                    }
                })
            },
            //查看
            affirmLook() {
                if (JSON.stringify(this.lookOrDelete) !== "{}") {
                    console.log(this.lookOrDelete)
                    this.$router.push({
                        path: "/resourceLibrary/financeWarehouse/voucherAdd",
                        query:{
                            pzRowId: this.lookOrDelete.voucherId,
                            companyId: this.$route.query.companyId
                        }
                    });

                } else {
                    this.$vux.toast.text("请选择要查看的数据")
                }
            },
            //删除
            affirmDelete() {
                if (JSON.stringify(this.lookOrDelete) !== "{}") {
                    if (this.lookOrDelete.voucherStatus === "YJZ") {
                        this.$vux.toast.text("已结账不能删除")
                        return
                    }
                    if (this.lookOrDelete.voucherStatus === "YGZ") {
                        this.$vux.toast.text("已过账不能删除")
                        return
                    }
                    console.log(this.lookOrDelete)
                    this.$http.get("/zingbiz/fixedAssets/assetsManagement/delVoucher",{
                        params:{
                            id:this.lookOrDelete.id
                        }
                    }).then((res) => {
                       if (res.data.success) {
                           this.$vux.toast.text(res.data.msg)
                           //删除成功后重新请求数据 显示最新的数据
                           this.tableData = []
                           this.selectFixedAssetsVoucher("deleteVoucher")

                       }
                    })
                } else {
                    this.$vux.toast.text("请选择要删除的数据")
                }
            },
            comeback() {
                this.inner = true
                this.planManage = false
            },
            back () {
                this.inner = true
                this.create = false
                this.checked = false
                this.createVoucher = false
                this.show = true
            },
            next(val) {
                this.rowData = []
                this.rowsData = []
                this.$refs.multipleTable.clearSelection();
                this.inner = true
                this.create = false
                this.checkedVal = val
                this.lookVoucher = false
                this.deleteVoucher = false
                this.createVoucher = true
                this.hint = false
                this.hintText = ""
                this.show = false
                this.checked = true
            },
            handleCurrentChange(val) {
                this.startNumber = 10 * (val - 1)
                this.endNumber = 10 * val
                this.Data = this.tableData.slice(this.startNumber,this.endNumber)
            },
            //获取数据
            selectFixedAssets (pageNumber) {
                this.resultData.pageSize = 10
                this.resultData.pageNumber = pageNumber
                this.$http.get("/zingbiz/fixedAssets/assetsManagement/selectFixedAssets",{
                    params:this.resultData
                }).then((res) => {
                    if (res.data.success) {
                        if (res.data.data.length === 0) {
                            this.prompt = true
                            this.show = false
                        } else {
                            this.searchResultVoucher = true
                            this.prompt = false
                            this.show = true
                            res.data.data.forEach((val) => {
                                if (val.type === "add") {
                                    val.typeFlag = "新增"
                                } else if (val.type === "clean") {
                                    val.typeFlag = "清理"
                                } else if (val.type === "change") {
                                    val.typeFlag = "变动"
                                } else {
                                    val.typeFlag = ""
                                }
                                this.tableData.push(val)
                            })
                            //判断分页total
                            if ((res.data.total <= 10)) {
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
            //获取已有凭证的卡片
            selectFixedAssetsVoucher(flag) {
                this.$http.get("/zingbiz/fixedAssets/assetsManagement/selectFixedAssets",{
                    params:{
                        period:this.resultData.period,
                        voucherStatus:"yes",
                        pageSize:10,
                        pageNumber:0
                    }
                }).then((res) => {
                    if (res.data.success) {
                        if (res.data.data.length === 0) {
                            this.prompt = true
                            this.searchResultVoucher = false
                            this.hint = false

                            if (flag === "lookVoucher") {
                                this.lookVoucher = false
                            } else if (flag === "deleteVoucher") {
                                this.deleteVoucher = false
                            }
                        } else {
                            this.searchResultVoucher = true
                            this.prompt = false
                            this.hint = true
                            res.data.data.forEach((val) => {
                                if (val.type === "add") {
                                    val.typeFlag = "新增"
                                } else if (val.type === "clean") {
                                    val.typeFlag = "清理"
                                } else if (val.type === "change") {
                                    val.typeFlag = "变动"
                                } else {
                                    val.typeFlag = ""
                                }
                                this.tableData.push(val)
                            })
                            //判断分页total
                            if ((res.data.total <= 10)) {
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
            }
        }
    }
</script>

<style>
    .searchResultVoucher .el-table td{
        padding: 0 !important;
    }
    .searchResultVoucher .el-input__inner{
        border: none !important;
        padding: 0 !important;
        text-align: center;
    }
    .searchResultVoucher .cell{
        padding: 0 !important;
        text-align: center;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
    .outwrapper{
        height 100%
        .inner {
            height 100%
            .innerwrapper{
                height calc(100% - 44px)
            }
        }

    }
    .hint{
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        font-family: Arial;
        padding 5px 13px
    }
    .prompt {
        text-align: center
        color #ff8000
        margin-top 20px
        font-size 18px;
    }
</style>
