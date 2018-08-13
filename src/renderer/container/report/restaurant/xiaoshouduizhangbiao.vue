<template>
    <div class="xiaoshouduizhangbiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="销售对账表">
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
                        border
                        stripe
                    >
                        <el-table-column
                            prop="dinnerName"
                            label="菜品名称"
                            fixed

                        >
                        </el-table-column>
                        <el-table-column
                            prop="dinnerUnit"
                            label="型号"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="dinnerClazzName"
                            label="分类"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="orderCount"
                            label="累计数量"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="ljje"
                            label="累计金额"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="zhje"
                            label="折后累计"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="bcjy"
                            label="百次交易"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="qybl"
                            label="千元比率"
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
        <!--条件弹框-->
        <form-dialog
            ref="dialog2"
            v-model="showFormDialog"
            :title="'筛选条件'"
            :showForm="true"
            :formAttrs="formAttrs2"
            @on-cancel="onCancel"
            @on-confirm="onConfirm_Form"
            @on-show="onShow"
            @on-hide="onHide"
            @on-focus="_onShowDialog">
        </form-dialog>
        <check-list-dialog
            ref="dialog3"
            v-model="showPicker"
            :title="'选择类型'"
            :showForm="true"
            :formAttrs="formAttrs3"
            :objectList="clazzList"
            @on-cancel="onCancel"
            @on-confirm="onGoodList_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="change"
            style="min-height:200">
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
        name: "xiaoshouduizhangbiao",
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
                formAttrs2: [
                    {
                        title: '分类',
                        type: 'text',
                        placeholder: '请选择类别名称',
                        isShowTitle: 'true'
                    }
                ],
                formAttrs3: [
                    {
                        title: '菜品类型',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ],
                restaurantList: [],
                retDateScope: '',
                retMoneySum: {},
                curDate: '',
                startDate: '',
                endDate: '',
                showDateDialog: false,
                showFormDialog:false,
                dinnerClazzId:'',
                clazzList:[],
                showPicker:false,
                goodIdList: [],
                goodNameList: [],
                inputGoodVal:'',
                inputGoodId:'',
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
        },
        methods: {
            onConfirm_Form(msg) {
                console.log('onConfirm_Form', msg);
                //this.showDateDialog = false;
                if (this.tabIndex !== 5) {
                    this.changeTab(this.tabIndex);
                } else {
                    this.getDataListByIndex('zdy');
                }


            },
            searchForm() {
                this.showFormDialog = true
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
            changeTab(index) {
                if (index === 0) {
                    this.tabIndex = 0
                    //alert("当天");
                    this.getDataListByIndex('dt');
                } else if (index === 1) {
                    this.tabIndex = 1
                    //alert("本周");
                    this.getDataListByIndex('bz');
                } else if (index === 2) {
                    this.tabIndex = 2
                    //alert("本月");
                    this.getDataListByIndex('by');
                } else if (index === 3) {
                    this.tabIndex = 3
                    //alert("本季");
                    this.getDataListByIndex('bj');
                } else if (index === 4) {
                    this.tabIndex = 4
                    //alert("本年");
                    this.getDataListByIndex('bn');
                } else if (index === 5) {
                    this.tabIndex = 5
                    this.selectDateForm();
                    //alert("自定义");

                }

            },
            getDataListByIndex(type) {

                let self = this;
                var url = "/zingbiz/report/restaurant_report/salesReconciliation";
                var pat = {};
                if (type != undefined) {
                    if (type != 'zdy') {
                        pat.dateType = type;
                        pat.is_ZDY = 'false';

                    } else {
                        pat.is_ZDY = 'true';
                        pat.startDate = self.startDate;
                        pat.endDate = self.endDate;
                    }
                }
                pat.dinnerClazzId = this.inputGoodId;
                self.$http.get(url,{ params:pat }).then(res => {
                    let dataTemp = res.data.data;
                    if (dataTemp && dataTemp.data) {
                        var rd = dataTemp.data;
                        self.restaurantList = rd;
                    }
                    console.log("res.data.data:",res.data.data);
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
                    this.$vux.toast.text("请选择开始时间!", 'bottom')
                    return false
                }
                if (this.endDate === '') {
                    this.$vux.toast.text("请选择结束时间!", 'bottom')
                    return false
                }
                this.getDataListByIndex('zdy');
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            getDinnerClazz() {
                let self = this;
                var url = "/zingbiz/dinner/getDinnerClazzList";
                let param = {
                    pageNumber:0,
                    pageSize:5000
                }

                self.$http.get(url, { params:param })
                    .then(res => {
                        console.log("res===",res);
                        let dataTemp = res.data.data;
                        if (dataTemp && dataTemp.data) {
                            let rd = dataTemp.data;
                            console.log("rd===",rd);
                            if (rd.length > 0) {
                                for (var i in rd) {
                                    rd[i].key = rd[i].dinnerClazzId;
                                    rd[i].value = rd[i].dinnerClazzName;
                                }
                            }
                            self.clazzList = rd;
                        }
                    })
                    .catch((e) => {
                        console.log("error:",e);
                        this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                    });
            },
            _onShowDialog() {
                this.getDinnerClazz();
                this.showPicker = true
                this.showDateDialog = false;
                this.showFormDialog = false;
                console.log("methods _onShowDialog this.goodIdList", this.goodIdList)
                var inputIdVal  = this.goodIdList;

                this.$refs.dialog2.objectListValue = inputIdVal;
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
                this.$refs.dialog2.setFormValues(dataArr);
                this.showPicker = false
                this.showDateDialog = false;
                this.showFormDialog = true;


            },
            change(val, label) {
                console.log('change', val, label)
                this.goodIdList = val;
                this.goodNameList = label;

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
                params.dinnerClazzId = this.inputGoodId;
                params.explorField = "restaurant_xiaoshouduizhang";
                params.fileName = "销售对账表";
                params.fieldTitles = "菜品名称@型号@分类@累计金额@折后累计@百次交易@千元比率";
                params.fields = "dinnerName,dinnerUnit,dinnerClazzName,orderCount,ljje,zhje,bcjy,qybl";
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

    .xiaoshouduizhangbiao {
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


