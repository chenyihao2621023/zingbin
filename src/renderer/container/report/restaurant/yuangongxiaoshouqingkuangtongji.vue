<template>
    <div class="yuangongxiaoshouqingkuangtongji">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="员工销售情况统计">
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
                            prop="userName"
                            label="员工姓名"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="money"
                            label="销售总额"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="count"
                            label="桌数"
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
        <!--选人组件-->

        <org-member-picker
            :showTab="showTab"
            :showPicker="showPicker"
            @abort="onPickAbort"
            @picked="onPicked"
            :initialSelectedType="initialSelectedType"
        ></org-member-picker>
    </div>
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
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
    export default {
        name: "yuangongxiaoshouqingkuangtongji",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Scroll,OrgMemberPicker,Dropdown
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
                ], formAttrs2: [
                    {
                        title: '员工姓名',
                        type: 'text',
                        placeholder: '请选择员工',
                        isShowTitle:'true'

                    }
                ],
                restaurantList: [],
                retDateScope: '',
                retMoneySum: {},
                curDate: '',
                startDate: '',
                endDate: '',
                showDateDialog: false,
                showSearchForm: false,
                showPicker:false,
                showTab:["colleague","role","friends"],
                initialSelected:[],
                initialSelectedType: 'cardUrl',
                output: '',
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
        } ,
        methods: {
            changeTab(index) {
                if (index !== 5) {
                    let type = this.retTypeByIndex(index);
                    this.getDataListByIndex(type);
                } else {
                    this.tabIndex = index;
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
                var url = "/zingbiz/report/restaurant_report/personnelDishesSale";
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

                    if (this.initialSelected.length > 0) {
                        for (let i in this.initialSelected) {
                            pat.userName = this.initialSelected.join(",");
                        }
                    } else {
                        pat.userName = '';
                    }
                    console.log("pat=====",pat);
                }
                self.$http.get(url, { params:pat }).then(res => {
                    let dataTemp = res.data.data;
                    if (dataTemp && dataTemp.data) {
                        var rd = dataTemp.data;
                        self.restaurantList = rd;
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
            onGoodType_Confirm(msg) {
                console.log('onGoodType_Confirm this.goodIdList, this.goodNameList', this.goodIdList, this.goodNameList);
                var type = this.retTypeByIndex(this.tabIndex);
                this.getDataListByIndex(type);
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
            searchForm() {
                this.showSearchForm = true;
            },
            _onShowDialog() {
                this.showPicker = true
                this.showSearchForm = false;
                console.log('methods _onShowDialog initialSelected',this.initialSelected);
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
            //取消的回调
            onPickAbort () {
                this.showPicker = false
            },
            isShowPicker(item) { //显示选人组件
                this.showPicker = true;
                this.clickCompanyId = item;
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
                if (this.initialSelected.length > 0) {
                    for (let i in this.initialSelected) {
                        params.userName = this.initialSelected.join(",");
                    }
                } else {
                    params.userName = '';
                }
                params.explorField = "restaurant_yuangongxiaoshou";
                params.fileName = "员工销售情况统计";
                params.fieldTitles = "员工姓名@销售总额@桌数";
                params.fields = "userName,money,count";
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

    .yuangongxiaoshouqingkuangtongji {
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
        max-width: calc(100vh / 6) !important;
    }

    .weui-dialog__ft {
        /*line-height: 38px !important;*/
    }
</style>


