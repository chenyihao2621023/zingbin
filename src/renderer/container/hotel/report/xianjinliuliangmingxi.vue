<template>
    <el-container>


        <el-main>
            <div style="font-size:20px;text-align: center;">现金流量明细</div>
            <hr style="border-color: #fff6;"/>
            <el-form ref="form" :inline="true" :model="form" label-width="100px" class="demo-form-inline">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="form.dateVal"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="操作员">
                    <el-input v-model="form.userName" @focus="onFocusEvent" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业项目">
                    <el-input v-model="form.tradeTypeId" @focus="_onShowDialog" clearable></el-input>
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
                    prop="genTime"
                    label="时间"
                >
                </el-table-column>
                <el-table-column
                    prop="operaterCardUrlName"
                    label="操作员"
                >
                </el-table-column>
                <el-table-column
                    prop="checkInPersonName"
                    label="姓名"
                >
                </el-table-column>
                <el-table-column
                    prop="roomNo"
                    label="房号"
                >
                </el-table-column>
                <el-table-column
                    prop="enterTime"
                    label="入住时间"
                >
                </el-table-column>
                <el-table-column
                    prop="outerTime"
                    label="离店时间"
                >
                </el-table-column>
                <el-table-column
                    prop="tradeTypeDesc"
                    label="交易类型"
                >
                </el-table-column>
                <el-table-column
                    prop="descript"
                    label="交易详情"
                >
                </el-table-column>

                <el-table-column
                    prop="money"
                    label="金额"
                >
                </el-table-column>
            </el-table>
        </el-main>
        <!--选人组件-->
        <org-member-picker
            :showTab="showTab"
            :showPicker="showPicker"
            @abort="onPickAbort"
            @picked="onPicked"
            :initialSelectedType="initialSelectedType"
        ></org-member-picker>
        <!--多选列表-->
        <check-list-dialog
            ref="dialog3"
            v-model="showGoodListForm"
            :title="'交易类型'"
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
    import OrgMemberPicker from "../../../components/orgmemberpicker/OrgMemberPicker"
    import CheckListDialog from '../../report/report-components/CheckListDialog'
    export default {
        name: "xianjinliuliangmingxi",
        components: {
ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Scroll,OrgMemberPicker,CheckListDialog
},
        data() {
            return {
                pickerOptions:{
                    disabledDate:'disabledDateFun'
                },
                retDateScope: '',
                hotelList: [],
                showLoading: false,
                showTab:["colleague","role","friends"],
                initialSelected:[],
                initialSelectedType: 'cardUrl',
                showPicker:false,
                output: '',
                form:{
                    dateVal:'',
                    userName:'',
                    tradeTypeId:"",
                },
                goodIdList:[],
                goodNameList:[],
                showGoodListForm:false,
                formAttrs3: [
                    {
                        title: '交易类型',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ],
                objectList:[],
                inputGoodVal:'',
                inputGoodId:'',
                cardUrlList:'',

            }
        },
        created() {
           this.getGoodList();
         },
        methods:{
            disabledDateFun() {
                return true
            },
            onSubmit() {

                let ds = this.form.dateVal;
                console.log("this.initialSelected====",this.initialSelected );

                if (this.initialSelected.length > 0) {
                    this.cardUrlList = this.initialSelected.join(",");
                }
                console.log(" this.inputGoodId====", this.inputGoodId);
                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                this.retDateScope = ds[0] + " 至 " + ds[1];
                this.showLoading = true;
                let url = "/zingbiz/report/hotel_report/cashFlowDetail_Hotel";
                this.$httpSilent
                    .get(url, {
                        params: {
                            startDate: ds[0],
                            endDate: ds[1],
                            cardUrl:this.cardUrlList,
                            panmentType:this.inputGoodId

                        }
                    })
                    .then(res => {
                        console.log("res=>",res)
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
                this.form.userName = list.map(item => item.userName).toString();
                if (this.initialSelectedType === 'rowId') {
                    this.initialSelected = list.map(item => item.rowId)
                } else {
                    console.log('methods onPicked ',list.map(item => item.cardUrl));
                    this.initialSelected = list.map(item => item.cardUrl)
                }

                this.showPicker = false
                this.showSearchForm = true;
            },
            //取消的回调
            onPickAbort () {
                this.showPicker = false
            },
            onFocusEvent(event,Event) {
                this.showPicker = true;
            },
            isShowPicker(item) { //显示选人组件
                this.showPicker = true;
                this.clickCompanyId = item;
            },
           _onShowDialog() {
            //this.getGoodList();
            this.showGoodListForm = true;
            console.log("methods _onShowDialog this.goodIdList", this.goodIdList)
            var inputIdVal  = this.goodIdList;

            this.form.tradeTypeId = inputIdVal;
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
            onCancel() {
                console.log('onCancel')
            },
            getGoodList() {

                let self = this;
                var url = "/zingbiz/report/hotel_report/getJiaoYiTypeList";
                self.$http.get(url, {
                   params:{ }
                   })
                    .then(res => {
                        console.log("res===",res);
                        let dataTemp = res.data.data;
                        if (dataTemp ) {
                            var rd = dataTemp;
                            if (rd.length > 0) {
                                for (var i in rd) {
                                    //tradeType有重复需要加上rowId来解决key的唯一性
                                    rd[i].key = rd[i].rowId;///*+"_"+rd[i].accountingType*/;
                                    rd[i].value = rd[i].descript;
                                }
                            }
                            console.log("rd====",rd);
                            self.objectList = rd;
                        }
                    })
                    .catch((e) => {
                        console.log("error:",e);
                        this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                    });
            },
            onExplorExcel() {

                if (this.form.dateVal === '') {
                    this.$message({ type: "warning", message: "请输入查询时间！" });
                    return
                }
                let params = {};
                params.explorField = "hotel_xianjinliuliangmingxi";
                params.fileName = "现金流量明细";
                params.fieldTitles = "时间@操作员@姓名@房号@入住时间@离店时间@营业项目@营业详情@金额";
                params.fields = "genTime,operaterUserName,checkInPersonName,roomNo,enterTime,outerTime,descript,tradeTypeDesc,amount";
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
            }
        }
    }
</script>

<style scoped>

</style>
