<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">入住分析表</div>
            <hr style="border-color: #fff6;"/>
            <el-form ref="form" :inline="true" :model="form" label-width="100px" class="demo-form-inline">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="form.dateVal"
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
                show-summary
                style="width: 100%"
                v-loading="showLoading"
                border
                stripe
            >
                <el-table-column
                    prop="configValue"
                    label="房型"
                >
                </el-table-column>
                <el-table-column
                    prop="drzongfang"
                    label="当天总房数"
                >
                </el-table-column>
                <el-table-column
                    prop="dyzongfang"
                    label="当月总房数"
                >
                </el-table-column>
                <el-table-column label="当天统计数">
                    <el-table-column
                        prop="ruzhushu_dt"
                        label="入住数"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="chuzhulv_dt"
                        label="出租率"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="money"
                        label="总收入"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="pingjufj_dt"
                        label="平均房价"
                    >
                    </el-table-column>
                </el-table-column>

                <el-table-column label="当月统计数" style="text-align: center;" >
                    <el-table-column
                        prop="ruzhushu_dy"
                        label="入住数"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="chuzhulv_dy"
                        label="出租率"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="money_dy"
                        label="总收入"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="pingjufj_dy"
                        label="平均房价"
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
    import FormDialog from '@/components/formdialog/FormDialog'


    export default {
        name: "ruzhufenxibiao",
        components:{
            Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog
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
                console.log(ds);
                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                this.retDateScope = ds;
                this.showLoading = true;
                let url = "/zingbiz/report/hotel_report/occupancyAnalysis";
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
            },    //确定的回调
            onPicked (list) {
                console.log('onPicked', list);
                this.output = list;
                console.log('methods onPicked ',list.map(item => item.userName).toString());
                this.$refs.dialog2.setFormValues([list.map(item => item.userName).toString()])
                if (this.initialSelectedType === 'rowId') {
                    this.initialSelected = list.map(item => item.rowId)
                } else {
                    console.log('methods onPicked ',list.map(item => item.cardUrl));
                    this.initialSelected = list.map(item => item.cardUrl)
                }

                this.showPicker = false
                this.showSearchForm = true;
            },
            onExplorExcel() {

                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                let params = {};
                params.explorField = "hotel_ruzhufenxibiao";
                params.fileName = "入住分析表";
                params.fieldTitles = "房型@当天总房数@当月总房数@入住数@出租率@总收入@平均房价@入住数@出租率@总收入@平均房价";
                params.fields = "configValue,drzongfang,dyzongfang,ruzhushu_dt,chuzhulv_dt,money,pingjufj_dt,ruzhushu_dy,chuzhulv_dy,money_dy,pingjufj_dy";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.form.dateVal;
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
<style>
    .el-table th > .cell {
        text-align:center !important;
    }
</style>
