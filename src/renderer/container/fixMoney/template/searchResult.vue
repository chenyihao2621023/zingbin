<template>
    <div class="outwrapper">
        <ZingHead title="折旧管理" :isComeBack="isComeBack" v-on:doSome="doSome">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search()"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div class="innerwrapper searchResultDiscount" v-show="defaultPage">
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
                    prop="depreciationAmount"
                    label="本期折旧额"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.depreciationAmount" @blur="onBlur(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="depreciationMustProvided"
                    label="本期应提折旧额"
                    width="120px"
                >
                </el-table-column>
                <el-table-column
                    prop="depreciation"
                    label="未提折旧额"
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
                    <x-button type="primary" class="btn-save" @click.native="cancle">重置</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="query">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "search-result",
        components:{
            ZingHead,
            Flexbox,
            FlexboxItem,
            XButton
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
                initData:[],
                tableData: [],
                Data:[],
                currentPage2: 1,
                total:0,
                isComeBack:false,
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
            this.selectDepreciationManagement()
        },
        methods:{
            //查询数据
            selectDepreciationManagement () {
                this.$http.post("/zingbiz/fixedAssets/assetsManagement/selectDepreciationManagement",this.params)
                    .then((res) => {
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
                                if (val.depreciationAmount === null) {
                                    val.depreciationAmount = 0
                                }
                            })
                            this.prompt = false
                            this.defaultPage = true
                            this.bottom = true
                        }
                })
            },
            //查询
            search() {
                this.$emit("doSome")
            },
            //返回
            doSome() {
                this.$emit("doSome")
            },
            //保存
            query() {
                if (this.saveWork.length === 0) {
                    return
                }
                this.$http.post("/zingbiz/fixedAssets/assetsManagement/saveDepreciationManagement",this.saveWork)
                    .then((res) => {
                        if (res.data.success) {
                            this.$vux.toast.text("设置成功")
                        } else {
                            this.$vux.toast.text(res.data.msg)
                        }
                })
            },
            //重置
            cancle() {
                // this.tableData = this.initData
                // this.startNumber = 5 * (this.pageNumber - 1)
                // this.endNumber = 5 * this.pageNumber
                // this.Data = this.tableData.slice(this.startNumber,this.endNumber)
                // this.initData = JSON.parse(JSON.stringify(this.initData));
                // this.tableData.forEach((val) => {
                //     if (val.depreciationAmount === null) {
                //         val.depreciationAmount = 0
                //     }
                // })
                this.selectDepreciationManagement()
                this.saveWork = []
            },
            //分页
            handleCurrentChange(val) {
                this.pageNumber = val
                this.startNumber = 8 * (val - 1)
                this.endNumber = 8 * val
                this.Data = this.tableData.slice(this.startNumber,this.endNumber)
            },
            //输入验证
            onBlur(row) {
                if (parseInt(row.depreciationAmount) > parseInt(row.depreciation)) {
                    row.depreciationAmount = 0
                    this.$vux.toast.text("不能大于未提折旧额")
                    return
                } else if (row.depreciationAmount < 0) {
                    row.depreciationAmount = 0
                    this.$vux.toast.text("本期折旧额不能小于0")
                    return
                } else {
                    let saveFlag = true
                    this.saveWork.forEach((val) => {
                        if (val.id === row.id) {
                            val.depreciationAmount = row.depreciationAmount
                            saveFlag = false
                        }
                    })
                    if (saveFlag) {
                        this.saveWork.push({
                            id:row.id,
                            depreciationAmount:row.depreciationAmount
                        })
                    }
                }
            }
        }
    }
</script>
<style>
    .searchResultDiscount .el-table td{
        padding: 0 !important;
    }
    .searchResultDiscount .el-input__inner{
        border: none !important;
        padding: 0 !important;
        text-align: center;
    }
    .searchResultDiscount .cell{
        padding: 0 !important;
        text-align: center;
    }
    .searchResultDiscount .el-table__body tr.hover-row>td{
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
