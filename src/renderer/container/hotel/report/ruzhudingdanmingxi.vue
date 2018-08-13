<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">入住订单明细</div>
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
                <el-form-item label="入住类型">
                    <el-input v-model="form.tradeTypeId" @focus="_onShowDialog"></el-input>
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
                    prop="actualEnterTime"
                    label="入住时间"
                >
                </el-table-column>
                <el-table-column
                    prop="actualOuterTime"
                    label="离店时间"
                >
                </el-table-column>
                <el-table-column
                    prop="roomTypeName"
                    label="入住类型"
                >
                </el-table-column>
                <el-table-column
                    prop="roomNo"
                    label="房间号"
                >
                </el-table-column>
                <el-table-column
                    prop="checkInPersonName"
                    label="姓名"
                >
                </el-table-column>
                <el-table-column
                    prop="customerName"
                    label="客户"
                >
                </el-table-column>
                <el-table-column
                    prop="fangfei"
                    label="房价(平日/周末)"
                >
                </el-table-column>
                <el-table-column
                    prop="xiaofeimoney"
                    label="总消费"
                >
                </el-table-column>
                <el-table-column
                    prop="checkInType"
                    label="在住状态"
                >
                </el-table-column>
                <el-table-column
                    prop="checkInStatus"
                    label="结账状态"
                >
                </el-table-column>
            </el-table>
        </el-main>

        <!--多选列表-->
        <check-list-dialog
            ref="dialog3"
            v-model="showGoodListForm"
            :title="'营业项目'"
            :showForm="true"
            :formAttrs="formAttrs3"
            :objectList="objectList"
            @on-cancel="onCancel"
            @on-confirm="onGoodList_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="change">
        </check-list-dialog>
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
        name: "ruzhudingdanmingxi",
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
                showGoodListForm:false,
                formAttrs3: [
                    {
                        title: '入住类型',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ],
                objectList:[{ key:"1",value:"全日房" },{ key:"2",value:"钟点房" },{ key:"3",value:"自用房" },{ key:"4",value:"免费房" }],
                inputGoodVal:'',
                inputGoodId:'',
                goodIdList:'0',
                goodNameList:'',
                checkInType:'',


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
                if (this.goodIdList.length > 0) {
                    this.checkInType = this.goodIdList.join(",");
                }
                console.log("this.checkInType=====",this.checkInType);
                let url = "/zingbiz/report/hotel_report/detailsOrderStatistics";
                this.$httpSilent
                    .get(url, {
                        params: {
                            startDate: ds[0],
                            endDate: ds[1],
                            checkInType:this.checkInType
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
            },    //确定的回调
            onCancel() {
                console.log('onCancel')
            },
            onGoodList_Confirm(msg) {
            console.log('onGoodList_Confirm', this.goodIdList, this.goodNameList);
            var dataArr = [];
            var datalist = '';
            var dataidlist = '';
            if (this.goodNameList.length > 0) {
                var list = this.goodNameList;
                var idlist = this.goodIdList;
                var len = this.goodNameList.length;
                for (var i = 0; i < len; i++) {
                    if (len - 1 === i) {
                        datalist += list[i];
                        dataidlist += idlist[i];
                    } else {
                        datalist += list[i] + ","
                        dataidlist += idlist[i] + ","
                    }
                }
            }
            this.inputGoodVal = datalist;
            this.inputGoodId = dataidlist;
            dataArr.push(datalist)
            this.form.tradeTypeId = datalist;
        },
        onShow() {
            console.log('onShow')
        },
        onHide() {
            console.log('onHide')

        },
        change(val, label) {
            console.log('change', val, label)
            this.goodIdList = val;
            this.goodNameList = label;

        },
        _onShowDialog() {
            this.showGoodListForm = true;
            console.log("methods _onShowDialog this.goodIdList", this.goodIdList)
            var inputIdVal  = this.goodNameList;

            this.form.tradeTypeId = inputIdVal;
        },
            onExplorExcel() {

                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                let params = {};
                params.explorField = "hotel_ruzhudingdanmingxibiao";
                params.fileName = "入住订单明细表";
                params.fieldTitles = "入住时间@离店时间@入住类型@房号@姓名@客户@房价@总消费@在住状态@结账状态";
                params.fields = "actualEnterTime,actualOuterTime,roomTypeName,roomNo,checkInPersonName,customerName,roomCharge,xiaofeimoney,checkInType,checkInStatus";
                let url = "/zingbiz/report/hotel_report/exportExcel";
                var ds = this.form.dateVal;
                params.startDate = ds[0];
                params.endDate = ds[1];
                params.checkInType = this.checkInType;
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
