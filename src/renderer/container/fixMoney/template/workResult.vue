<template>
    <div class="outwrapper">
        <ZingHead title="工作量管理" :isComeBack="isComeBack" v-on:doSome="doSome">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search()"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div class="innerwrapper searchResultWork" v-show="defaultPage">
            <el-table
                :data="Data"
                style="width: 100%"
                border
                show-summary
            >
                <el-table-column
                    fixed
                    prop="assetsCoding"
                    label="资产编码"

                >
                </el-table-column>
                <el-table-column
                    prop="assetsName"
                    label="资产名称"
                >
                </el-table-column>

                <el-table-column
                    prop="measureUnitIdName"
                    label="单位"
                >
                </el-table-column>
                <el-table-column
                    prop="currentWorkload"
                    label="本期工作量"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.currentWorkload" @blur="onBlur(scope.row)"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="expectedDurationOfUse"
                    label="工作总量"
                >
                </el-table-column>
                <el-table-column
                    prop="usedPeriod"
                    label="累计工作总量"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="remainingPeriod"
                    label="剩余工作量"
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
                :total="1000">
                >
            </el-pagination>
        </div>
        <div v-show="bottom">
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="reset">重置</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="save">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>

    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "work-result",
        components:{
            ZingHead,
            Flexbox,
            FlexboxItem,
            XButton,

        },
        props:{
            queryFlag:{
                default:false
            },
            params:{
                default:function () {
                    return {}
                }
            }
        },
        data() {
            return {
                Data:[],
                initData:[],
                isComeBack:false,
                tableData: [],
                currentPage2: 1,
                total:0,
                prompt:false,
                defaultPage:false,
                pagination:false,
                bottom:false,
                saveWork:[],
                startNumber:0,
                endNumber:8,
                pageNumber:1
            }
        },
        created() {
            this.title = this.$route.query.title
            this.selectWorkManage()
        },
        methods:{
            //数据查询
            selectWorkManage() {
                this.$http.post("/zingbiz/fixedAssets/assetsManagement/selectWorkManage",this.params).then((res) => {
                    if (res.data.data.length === 0) {
                        this.defaultPage = false
                        this.pagination = false
                        this.bottom = false
                        this.prompt = true
                    } else {
                        this.initData = JSON.parse(JSON.stringify(res.data.data));
                        this.tableData = res.data.data
                        if (res.data.total <= 8) {
                            this.pagination = false
                            this.Data = res.data.data
                        } else {
                            this.pagination = true
                            this.Data = this.tableData.slice(this.startNumber,this.endNumber)
                        }
                        this.tableData.forEach((val) => {
                            if (val.currentWorkload === null) {
                                val.currentWorkload = 0
                            }
                        })
                        this.prompt = false
                        this.defaultPage = true
                        this.bottom = true
                    }
                })
            },
            search() {
                this.$emit("doSome")
            },
            //重置
            reset() {
                // this.tableData = this.initData
                // this.initData = JSON.parse(JSON.stringify(this.initData));
                // this.tableData.forEach((val) => {
                //     if (val.currentWorkload === null) {
                //         val.currentWorkload = 0
                //     }
                // })
                this.selectWorkManage()
                this.saveWork = []
            },
            //保存
            save() {
                if (this.saveWork.length === 0) {
                    return
                }
               this.$http.post("/zingbiz/fixedAssets/assetsManagement/saveWorkManage",this.saveWork).then((res) => {
                    if (res.data.success) {
                        this.$vux.toast.text("设置成功")
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
               })
            },
            doSome() {
                this.$emit("doSome")
            },
            //分页处理
            handleCurrentChange(val) {
                this.pageNumber = val
                if (val === 1) {
                    this.Data = this.tableData.slice(0,8)
                } else {
                    this.startNumber = 8 * (val - 1)
                    this.endNumber = 8 * val
                    this.Data = this.tableData.slice(this.startNumber,this.endNumber)
                }
            },
            //修改失去焦点
            onBlur (row) {
                if (row.currentWorkload > row.remainingPeriod) {
                    row.currentWorkload = 0
                    this.$vux.toast.text("不能大于剩余工作量")
                    return
                } else if (row.currentWorkload < 0) {
                    row.currentWorkload = 0
                    this.$vux.toast.text("本期工作量不能为负")
                    return
                } else {
                    let saveFlag = true
                    this.saveWork.forEach((val) => {
                        if (val.id === row.id) {
                            val.currentWorkload = row.currentWorkload
                            saveFlag = false
                        }
                    })
                    if (saveFlag) {
                        this.saveWork.push({
                            id:row.id,
                            currentWorkload:row.currentWorkload
                        })
                    }
                    console.log(this.saveWork)
                }
            },
        }
    }
</script>
<style>
    .searchResultWork .el-table td{
        padding: 0 !important;
    }
    .searchResultWork .el-input__inner{
        border: none !important;
        padding: 0 !important;
        text-align: center;
    }
    .searchResultWork .cell{
        padding: 0 !important;
        text-align: center;
    }
    .searchResultWork .el-table__body tr.hover-row>td{
        background-color: white !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
    .outwrapper{
        height 100%
        .innerwrapper{
            height calc(100% - 94px)
        }
    }
    .prompt{
        text-align: center
        color #ff8000
        margin-top 20px
        font-size 18px;
    }

</style>
