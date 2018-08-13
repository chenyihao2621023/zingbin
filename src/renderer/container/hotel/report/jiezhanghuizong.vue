<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">结账汇总表</div>
            <hr style="border-color: #fff6;"/>
            <el-form ref="form" :inline="true" :model="form" label-width="100px" class="demo-form-inline">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="form.dateVal"
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
                    <el-button type="primary" @click="onExploreExcel">导出</el-button>
                </el-form-item>
            </el-form>
            <p style="margin: 8px;color:rgb(115, 115, 115);">营业时间: {{ retDateScope }}</p>

            <el-table
                :data="hotelList"
                show-summary
                :summary-method="getSummaries"
                style="width: 100%"
                v-loading="showLoading"
                border
                stripe
            >
                <el-table-column label="借方（订房收入）" align="center">
                    <el-table-column
                        prop="roomName"
                        label="项目类别"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="roomNumber"
                        label="数量"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="roomMoney"
                        label="金额"
                    >
                    </el-table-column>
                </el-table-column>
                <el-table-column label="贷方（客户支付）" align="center">
                    <el-table-column
                        prop="tradeCodeDesc"
                        label="营业项目"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="zfnum"
                        label="数量"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="zfmoney"
                        label="金额"
                    >
                    </el-table-column>
                </el-table-column>



            </el-table>
        </el-main>


    </el-container>

</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton
    } from 'vux'
    import Scroll from '@/components/scroll/Scroll'
    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    export default {
        name: "jiezhanghuizong",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Scroll
        },
        data() {
            return {
                pickerOptions:{
                    disabledDate:'disabledDateFun'
                },
                retDateScope: '',
                hotelList: [],
                showLoading: false,
                form:{
                    dateVal:'',
                    userName:'',
                    tradeTypeId:"",
                }

            }
        },
        methods:{
            disabledDateFun() {
                return true
            },
            onSubmit() {

                var ds = this.form.dateVal;
                console.log(ds[0] );
                console.log(ds[1]);
                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                this.retDateScope = ds[0] + " 至 " + ds[1];
                this.showLoading = true;
                let url = "/zingbiz/report/hotel_report/checkoutSummary";
                this.$httpSilent
                    .get(url, {
                        params: {
                            startDate: ds[0],
                            endDate: ds[1],
                        }
                    })
                    .then(res => {
                        this.hotelList = res.data.data;
                        this.showLoading = false;

                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "数据获取失败，请重试" });
                    })
            },
            onExplorExcel() {

                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                let params = {};
                params.explorField = "hotel_jiezhanghuizongbiao";
                params.fileName = "结账汇总表";
                params.fieldTitles = "项目类别@数量@金额@营业项目@数量@金额";
                params.fields = "roomName,roomNumber,roomMoney,configValue,zfnum,zfmoney";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.form.dateVal;
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
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (index !== 3) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' ';
                    } else {
                        sums[index] = ' ';
                    }
                });

                return sums;
            }
        }
    }
</script>

<style scoped>

</style>
