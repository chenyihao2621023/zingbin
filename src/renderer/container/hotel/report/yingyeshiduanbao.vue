<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">营业时段表</div>
            <hr style="border-color: #fff6;"/>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="dateVal"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        picker-options="pickerOptions"
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
                    prop="title"
                    label="项目"
                >
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="时段发生"
                >
                </el-table-column>
                <el-table-column
                    prop="money_last"
                    label="去年同期"
                >
                </el-table-column>
            </el-table>

        </el-main>

    </el-container>

</template>

<script>
    export default {
        name: "yingyeshiduanbao",
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
                console.log(ds[0]);
                console.log(ds[1]);
                if (this.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                this.retDateScope = ds[0] + " 至 " + ds[1];
                this.showLoading = true;
                let url = "/zingbiz/report/hotel_report/businessHoursRe";
                this.$httpSilent
                    .get(url, {
                        params: {
                            startDate: ds[0],
                            endDate: ds[1],
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
                params.explorField = "hotel_yinyeshiduanbao";
                params.fileName = "营业时段表";
                params.fieldTitles = "项目@当日发生@去年同期";
                params.fields = "title,money,money_last";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.dateVal;
                params.startDate = ds[0];
                params.endDate = ds[1];
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
