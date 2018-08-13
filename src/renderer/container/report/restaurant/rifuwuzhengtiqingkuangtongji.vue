<template>
    <div class="rifuwuzhengtiqingkuangtongji">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="日服务整体情况统计">
            <div slot="header-right">
                <span class="header-search" @click="searchForm">
                  <i class="iconfont icon-fangdajing"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="rightMenu" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </zing-head>
        <!-- tab页 -->
        <div class="vue-tab" :style="{ marginTop: tabMarginTop + 'px'}">
            <tab class="tab-main" :line-width="1">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="changeTab"
                          @click="defTab = item" :key="index" class="report-tab">{{item}}
                </tab-item>
            </tab>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">
            <br/>
            <p style="margin: 8px;color:rgb(115, 115, 115);">日期: {{ retDateScope }}</p>
            <hr style="border-color: #fff6;"/>
            <el-table
                        :data="restaurantList"
                        style="width: 100%"
                        height="calc(79%)"
                        v-loading="showLoading"
                        border
                        stripe
                    >
                        <el-table-column
                            prop="dinnerOrderNo"
                            label="营业流水"
                            min-width="100"
                            fixed
                        >
                        </el-table-column>
                        <el-table-column
                            prop="deskNum"
                            label="台位号"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="deskName"
                            label="台位名称"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="payDesc"
                            label="结算方式"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="genTime"
                            label="开始时间"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="payTime"
                            label="结束时间"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="dinnerPersonCounts"
                            label="人数"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="receivables"
                            label="应收金额"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="paidInAccounts"
                            label="实收金额"
                        >
                        </el-table-column>
                    </el-table>
        </div>
        <!--日期弹框-->
        <form-dialog
            ref="dialog1"
            v-model="showDateDialog"
            :title="'统计日期'"
            :showForm="true"
            :formAttrs="formAttrs1"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <form-dialog
            ref="dialog2"
            v-model="showSearchForm"
            :title="'筛选条件'"
            :showForm="true"
            :formAttrs="formAttrs2"
            @on-cancel="onCancel"
            @on-confirm="onGoodType_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-focus="_onShowDialog">
        </form-dialog>
        <check-list-dialog
            ref="dialog3"
            v-model="showDeskListForm"
            :title="'台位号'"
            :showForm="true"
            :formAttrs="formAttrs3"
            :objectList="deskList"
            @on-cancel="onCancel"
            @on-confirm="onDeskList_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="deskChange"
            style="min-height:200px">
        </check-list-dialog>
        <check-list-dialog
            ref="dialog4"
            v-model="showPayRecordListForm"
            :title="'结算方式'"
            :showForm="true"
            :formAttrs="formAttrs4"
            :objectList="payRecordList"
            @on-cancel="onCancel"
            @on-confirm="onPayRecord_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="payRecordChange"
            style="min-height:200px">
        </check-list-dialog>
    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton
    } from 'vux'

    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import CheckListDialog from '../../report/report-components/CheckListDialog'
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
    export default {
        name: "rifuwuzhengtiqingkuangtongji",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,CheckListDialog,Dropdown
        },
        data() {
            return {
                tabTitle: ['当天', '本周', '本月', '本季', '本年', '自定义'],
                tabMarginTop: 0,
                defTab: "当天",
                tabIndex: 0,
                formAttrs1: [
                    {
                        title: '开始时间',
                        type: 'datetime',
                        placeholder: '输入开始时间',

                    },
                    {
                        title: '结束时间',
                        type: 'datetime',
                        placeholder: '输入结束时间',

                    }
                ],
                restaurantList: [],
                retDateScope: '',
                retMoneySum: {},
                curDate: '',
                startDate: '',
                endDate: '',
                showDateDialog: false,
                currentPage2: 1,
                totalSize:null,
                showLoading:false,
                showSearchForm:false,
                showDeskListForm:false,
                showPayRecordListForm:false,
                formAttrs2: [
                    {
                        title: '台位号',
                        type: 'text',
                        placeholder: '请选择台位号',
                        isShowTitle: 'true'

                    },
                    {
                        title: '结算方式',
                        type: 'text',
                        placeholder: '请选择结算方式',
                        isShowTitle: 'true'

                    }
                ],
                formAttrs3: [
                    {
                        title: '台位号',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ], formAttrs4: [
                    {
                        title: '支付类型',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ],
                deskList:[],
                payRecordList: [],
                payRecordId:'',
                payRecordName:'',
                payRecordIdList:[],
                payRecordNameList:[],
                deskId:'',
                deskName:'',
                deskIdList:[],
                deskNameList:[],
                rightMenu: [
                    {
                        content: "导出"
                    },
                ],
                isPc:false,
            }
        }, created() {
            // this.tabWidth = document.documentElement.offsetWidth || document.body.offsetWidth
            this.curDate = this.getCurDate().nyr
            this.getDataListByIndex('dt');
            this.getDeskList();
            this.getTradeTypeList();
        },
        methods: {
            changeTab(index) {
                this.tabIndex = index;
                if (index !== 5) {
                    let type = this.retTypeByIndex(index);
                    this.getDataListByIndex(type);
                } else {
                    this.selectDateForm();
                }

            },
            retTypeByIndex(index) {
                if (index === 0) {
                    this.tabIndex = 0
                    return 'dt'
                } else if (index === 1) {
                    this.tabIndex = 1
                    //alert("本周");
                    return 'bz'
                } else if (index === 2) {
                    this.tabIndex = 2
                    //alert("本月");
                    return 'by'
                } else if (index === 3) {
                    this.tabIndex = 3
                    //alert("本季");
                    return 'bj'
                } else if (index === 4) {
                    this.tabIndex = 4
                    //alert("本年");
                    return 'bn'
                } else if (index === 5) {
                    this.tabIndex = 5
                    //alert("自定义");
                    return 'zdy'
                }
            },
            getDataListByIndex(type) {
                let self = this;
                var url = "/zingbiz/report/restaurant_report/dayServiceDishesSale";
                var pat = {};
                if (type !== undefined) {
                    if (type !== 'zdy') {
                        pat.dateType = type;
                        pat.is_ZDY = 'false';

                    } else {
                        pat.is_ZDY = 'true';
                        pat.startDate = self.startDate;
                        pat.endDate = self.endDate;
                    }
                }
                pat.deskId = this.deskId;
                pat.payRecordId = this.payRecordId;
                self.$http.get(url,{ params:pat } ).then(res => {
                    let dataTemp = res.data.data;
                    if (dataTemp && dataTemp.data) {
                        var rd = dataTemp.data;
                        self.restaurantList = rd;
                        self.totalSize = self.restaurantList.length;
                    }
                    let dateMap = res.data.data.dateTime[0];
                    this.retDateScope = dateMap.startDate + '-' + dateMap.endDate;
                });
            },
            getCurDate() {
                let dateObj = new Date(); //表示当前系统时间的Date对象
                let year = dateObj.getFullYear(); //当前系统时间的完整年份值
                let month = dateObj.getMonth() + 1; //当前系统时间的月份值
                let date = dateObj.getDate(); //当前系统时间的月份中的日
                let day = dateObj.getDay(); //当前系统时间中的星期值
                let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                let week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
                let hour = dateObj.getHours(); //当前系统时间的小时值
                let minute = dateObj.getMinutes(); //当前系统时间的分钟值
                let second = dateObj.getSeconds(); //当前系统时间的秒钟值
                //如果月、日、小时、分、秒的值小于10，在前面补0
                if (month < 10) {
                    month = "0" + month;
                }
                if (date < 10) {
                    date = "0" + date;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                return {
                    nyr: year + "-" + month + "-" + date,
                    sfm: hour + ":" + minute + ":" + second,
                    week: week
                }
            },
            selectDateForm() {

                this.showDateDialog = true;
            },
            doSome() {
                this.showDateDialog = false;
            },
            startChange(val) {
                this.startDate = val
            },
            endChange(val) {
                this.endDate = val
            },
            onCancel() {
                console.log('onCancel')
            },
            onConfirm(msg) {
                console.log('onConfirm', msg)
                this.startDate = msg[0];
                this.endDate = msg[1];
                if (this.startDate === '') {
                    this.$refs.dialog1.showValue = true;
                    this.$vux.toast.text("请选择开始时间!", 'bottom')

                }
                if (this.endDate === '') {
                    this.$refs.dialog1.showValue = true;
                    this.$vux.toast.text("请选择结束时间!", 'bottom')

                }
                  this.getDataListByIndex('zdy');
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            _onShowDialog(msg) {
                console.log("methods _onShowDialog ", document.activeElement.getAttribute("placeholder"));
                let plname = document.activeElement.getAttribute("placeholder");
                if (plname === '请选择台位号') {

                    this.showDeskListForm = true;
                    console.log("methods _onShowDialog this.deskIdList", this.deskIdList)
                    let inputIdVal  = this.deskIdList;
                    this.$refs.dialog3.objectListValue = inputIdVal;
                } else {
                    this.showPayRecordListForm = true;
                    console.log("methods _onShowDialog this.payRecordIdList", this.payRecordIdList)
                    let inputIdVal  = this.payRecordIdList;
                    this.$refs.dialog4.objectListValue = inputIdVal;
                }
            },
            onGoodType_Confirm(msg) {
                let type = this.retTypeByIndex(this.tabIndex);
                console.log("type==============",type)
                this.getDataListByIndex(type);
            },
            onDeskList_Confirm(msg) {
                console.log('onDeskList_Confirm', this.deskIdList, this.deskNameList);
                console.log('onDeskList_Confirm', this.payRecordIdList, this.payRecordNameList);
                this.deskName = this.deskNameList.join(",");
                this.deskId = this.deskIdList.join(",");
                var dataArr = [];
                dataArr.push(this.deskName);
                dataArr.push(this.payRecordName)
                this.$refs.dialog2.setFormValues(dataArr);
            },
            onPayRecord_Confirm (msg) {
                console.log('onPayRecord_Confirm', this.deskIdList, this.deskNameList);
                console.log('onPayRecord_Confirm', this.payRecordIdList, this.payRecordNameList);
                this.payRecordName = this.payRecordNameList.join(",");
                this.payRecordId = this.payRecordIdList.join(",");
                var dataArr = [];
                dataArr.push(this.deskName);
                dataArr.push(this.payRecordName)
                this.$refs.dialog2.setFormValues(dataArr);
            },
            searchForm() {
                this.showSearchForm = true;
                 var inputArr = [];
                inputArr.push(this.deskName);
                inputArr.push(this.payRecordName);
                this.$refs.dialog2.setFormValues(inputArr);
            },
            deskChange(val, label) {
                console.log('deskChange', val, label)
                this.deskIdList = val;
                this.deskNameList = label;
            },
            payRecordChange(val, label) {
                console.log('payRecordChange', val, label)
                this.payRecordIdList = val;
                this.payRecordNameList = label;
            },
            getDeskList() {
                let that = this;
                let param = {
                    pageNumber: "1",
                    pageSize: "5000"
                }
                let deskListUrl = "/zingbiz/dinner/getDeskList";
                this.$http
                    .get(deskListUrl, { params :param })
                    .then(res => {

                        if (res.data.success) {

                            let retdata = res.data.data.data;
                            retdata.forEach(item => {
                                let obj = {
                                    key:item.deskId,
                                    value:item.deskNum
                                }
                                that.deskList.push(obj);
                            });
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {

                    that.$message({ type: "error", message: "加载失败，请重试" });
                });
            },
            getTradeTypeList() {
                let that = this;
                let param = {}
                let deskListUrl = "/zingbiz/report/restaurant_report/getTradeTypeList";
                this.$http
                    .get(deskListUrl, { params :param })
                    .then(res => {
                        if (res.data.success) {
                            console.log("res=============================",res);
                            let retdata = res.data.data;
                            console.log("res=============================",res);
                            retdata.forEach(item => {
                                let obj = {
                                    key:item.rowId,
                                    value:item.descript
                                }
                                that.payRecordList.push(obj);
                            });
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {

                    that.$message({ type: "error", message: "加载失败，请重试" });
                });
            }, // 点击右侧下拉框菜单选项
            handleMenu(data) {
                if (data.content === "导出") {
                    if (isWeiXin() || isMhApp()) {
                        this.$vux.toast.show({
                            type: 'text',
                            width: '9.5em',
                            text: '请在PC端导出！'
                        });
                        this.isPc = false
                    } else {
                        this.isPc = true;
                        this.onExplorExcel();
                    }
                }
            },
            onExplorExcel() {
                let params = {};
                if (this.tabIndex === 5) {
                    if (this.startDate === '') {
                        this.$refs.dialog1.showValue = true;
                        this.$vux.toast.text("请选择开始时间!", 'bottom')

                    }
                    if (this.endDate === '') {
                        this.$refs.dialog1.showValue = true;
                        this.$vux.toast.text("请选择结束时间!", 'bottom')

                    }
                    params.is_ZDY = 'true';
                    params.startDate = this.startDate;
                    params.endDate = this.endDate;
                } else {
                    params.is_ZDY = 'false';
                    params.dateType = this.retTypeByIndex(this.tabIndex);
                }
                params.deskId = this.deskId;
                params.payRecordId = this.payRecordId;
                params.explorField = "restaurant_rifuwuzhengti";
                params.fileName = "日服务整体情况统计";
                params.fieldTitles = "营业流水@台位号@台位名称@结算方式@开始时间@结束时间@人数@应收金额@实收金额";
                params.fields = "dinnerOrderNo,deskNum,deskName,payDesc,genTime,payTime,dinnerPersonCounts,receivables,paidInAccounts";
                let url = "/zingbiz/report/restaurant_report/exportExcel";
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .tab-content {
        height 100%;
    }

    .rifuwuzhengtiqingkuangtongji {
        height 100%;

        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;

            .left {
                flex: 1;
                flex-center(row, start, center);

                .iconfont {
                    font-size: 36px;
                }

                &-wrapper {
                    margin-left: 10px;
                    flex: 1;

                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }

                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }

    }
</style>
<style type="text/css">

    .vux-tab {
        padding-bottom: 10px !important;
        height: 52px !important;
        background-color: #efefef !important;
    }

    .scrollable .vux-tab-ink-bar {
        bottom: 10px !important;
    }

    .report-tab {

        max-width: calc(100% / 6) !important;
    }
    .weui-dialog__ft {
        /*line-height: 38px !important;*/
    }
</style>


