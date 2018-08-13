<template>
    <div class="qiantaijiebanbiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="前台结班表">

            <div slot="header-right">
                <span class="header-search" @click="searchForm">
                  <i class="iconfont icon-fangdajing"></i>
                </span>
            </div>
        </zing-head>

        <!-- tab内容 -->
        <div class="tab-content">

            <el-table
                :data="restaurantList"
                style="width: 100%"
                height="calc(83%)"
                @row-click="tabRowClick"
                border
                stripe
            >
                <el-table-column
                    prop="date"
                    label="日期"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="操作员"
                >
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    label="上班时间"
                >
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    label="下班时间"
                >
                </el-table-column>

            </el-table>

        </div>

        <!--日期弹框-->
        <form-dialog
            ref="dialog2"
            v-model="showDateDialog"
            :title="'统计日期'"
            :showForm="true"
            :formAttrs="formAttrs1"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>

    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton
    } from 'vux'

    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'

    export default {
        name: "qiantaijiebanbiao",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog
        },
        data() {
            return {
                curDate: '',
                startDate: '',
                endDate: '',
                showDateDialog: false,
                deskList:[],
                loading: false,
                showPicker:false,
                formAttrs1: [
                    {
                        title: '日期',
                        type: 'datetime',
                        placeholder: '输入选择日期',
                        isShowTitle:'true',

                    }
                ],
                restaurantList:[],

            }
        }, computed: {
        }, created() {
            // this.tabWidth = document.documentElement.offsetWidth || document.body.offsetWidth
            this.curDate = this.getCurDate().nyr
        },
        methods: {
            searchForm() {
                console.log('searchForm')
                this.showDateDialog = true
            },
            getDataListByIndex() {
                let self = this;
                var url = "/zingbiz/report/restaurant_report/getJieBanList";
                var pat = {};
                pat.startDate = self.startDate;
                pat.endDate = self.endDate;

                console.log("pat=",pat);
                self.$http.get(url, { params:pat }).then(res => {
                    console.log("res=",res);
                    let dataTemp = res.data;
                    if (dataTemp && dataTemp.data) {
                        let rd = dataTemp.data;
                        self.restaurantList = rd;
                    }

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
                this.endDate = msg[0];
                if (this.startDate === '') {
                    this.$vux.toast.text("请选择日期!", 'bottom')
                    return false
                }
                this.getDataListByIndex();
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            tabRowClick(row, event, column) {
                console.log("row",row);
                console.log("event",event);
                console.log("column",column);
                this.$router.push({
                    path: "restaurant_qtjbbmx",
                    query: {
                        companyId:row.companyId,
                        startDate:row.goWorkTime,
                        endDate:row.outWorkTime,
                        cardUrl:row.cardUrl,

                    }
                });
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

    .yuangongfuwuqingkuangfenxi {
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



