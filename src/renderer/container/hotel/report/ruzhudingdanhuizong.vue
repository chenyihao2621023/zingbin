<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">入住订单汇总</div>
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
                     <el-button type="primary" @click="onExplorExcel">导出</el-button>
                </el-form-item>
            </el-form>
            <p style="margin: 8px;color:rgb(115, 115, 115);">营业时间: {{ retDateScope }}</p>

            <el-table
                :data="hotelList"
                show-summary
                style="width: 100%"
                v-loading="showLoading"
                border
                stripe
            >
                <el-table-column
                    prop="dateTime"
                    label="入住时间"
                >
                </el-table-column>
                <el-table-column
                    prop="qrf"
                    label="全日房"
                >
                </el-table-column>
                <el-table-column
                    prop="zdf"
                    label="钟点房"
                >
                </el-table-column>
                <el-table-column
                    prop="zyf"
                    label="自用房"
                >
                </el-table-column>
                <el-table-column
                    prop="mff"
                    label="免费房"
                >
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
    import CheckListDialog from '../../report/report-components/CheckListDialog'
    export default {
        name: "ruzhudingdanhuizong",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Scroll,CheckListDialog
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
                    roomTypeId:"",
                },



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
                let url = "/zingbiz/report/hotel_report/summaryOrderStatistics";
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
                params.explorField = "hotel_ruzhudingdanhuizongbiao";
                params.fileName = "入住订单汇总表";
                params.fieldTitles = "入住时间@全日房@钟点房@自用房@免费房";
                params.fields = "dateTime,qrf,zdf,zyf,mff";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.form.dateVal;
                params.startDate = ds[0];
                params.endDate = ds[1];
                params.checkInType = this.goodIdList;
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
