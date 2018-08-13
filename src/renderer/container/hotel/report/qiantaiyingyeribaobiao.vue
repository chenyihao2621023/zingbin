<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">前台营业日报表</div>
            <hr style="border-color: #fff6;"/>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="dateVal"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onExplorExcel">导出</el-button>
                </el-form-item>
            </el-form>
            <p style="margin: 8px;color:rgb(115, 115, 115);">营业时间: {{ retDateScope }}</p>



        <el-table
            :data="hotelList"
            style="width: 100%"
            v-loading="showLoading"
            border
            stripe
        >
            <el-table-column
                prop="typeName"
                label="项目名称"
            >
            </el-table-column>
            <el-table-column
                prop="dr"
                label="当日收入"
            >
            </el-table-column>
            <el-table-column
                prop="dy"
                label="当月累计"
            >
            </el-table-column>
            <el-table-column
                prop="sy"
                label="上月同期"
            >
            </el-table-column>
            <el-table-column
                prop="qn"
                label="去年同期"
            >
            </el-table-column>
        </el-table>
        </el-main>
    </el-container>

</template>

<script>
    export default {
        name: "qiantaiyingyeribaobiao",
        data() {
            return {
                dateVal:'',
                pickerOptions:{
                    disabledDate:'disabledDateFun'
                },
                retDateScope: '',
                hotelList: [],
                showLoading: false
            }
        },
        methods:{
            disabledDateFun() {
                return true
            },
            onSubmit() {

                var ds = this.dateVal;
                console.log("ds===",ds);
                if (this.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                this.retDateScope = ds ;
                this.showLoading = true;
                let url = "/zingbiz/report/hotel_report/retBusDayReTab";
                this.$httpSilent
                    .get(url, {
                        params: {
                            dateTime: ds
                        }
                    })
                    .then(res => {
                        console.log("res==",res)
                        this.hotelList = res.data.data;
                        this.showLoading = false;

                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "数据获取失败，请重试" });
                    })
            },
            onExplorExcel() {

                if (this.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                let params = {};
                params.explorField = "hotel_yinyeribaobiao";
                params.fileName = "前台营业日报表";
                params.fieldTitles = "项目名称@当日收入@当月累计@上月同期@去年同期";
                params.fields = "typeName,dr,dy,sy,qn";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.dateVal;
                params.dateTime = ds;
                this.$httpSilent
                    .post(url, params)
                    .then(res => {
                        console.log("res==",res)
                        window.location = "/zingbiz/report/hotel_report/dowLoadExcelFile.action?fileName=" + params.fileName;
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "导出数据失败，请重试" });
                    })
            }
        }
    }

</script>

<style scoped>

</style>
