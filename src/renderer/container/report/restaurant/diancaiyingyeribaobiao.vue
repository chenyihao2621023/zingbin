<template>
    <div class="diancaiyingyeribaobiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="点菜营业日报表">
            <div slot="header-right">
                <span class="header-search" @click="selectDateForm">
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

        <!-- tab内容 -->
        <div class="tab-content">
            <br/>
            <p style="margin: 8px;color:rgb(115, 115, 115);">日期: {{ retDateScope }}</p>
            <hr style="border-color: #fff6;"/>
            <el-table
                :data="restaurantList"
                style="width: 100%"
                height="calc(85%)"
                stripe
                border
            >
                <el-table-column
                    prop="title"
                    label="项目名称"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    prop="dt"
                    label="当日收入"
                >
                </el-table-column>
                <el-table-column
                    prop="dy"
                    label="当月累计"
                >
                </el-table-column>
                <el-table-column
                    prop="sy"
                    label="上月同期"
                >
                </el-table-column>
                <el-table-column
                    prop="qn"
                    label="去年同期"
                >
                </el-table-column>
                <el-table-column
                    prop="mlv"
                    label="毛利率"
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
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        name: "diancaiyingyeribaobiao",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Dropdown
        },
        data() {
            return {
                formAttrs1: [
                    {
                        title: '时间',
                        type: 'datetime',
                        placeholder: '输入筛选时间',
                        isShowTitle:'true'
                    }
                ],
                restaurantList: [],
                retDateScope: '',
                curDate: '',
                dateTime: '',
                showDateDialog: false,
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
        },
        methods: {

            getDataListByIndex() {
                this.retDateScope = this.dateTime;
                let self = this;
                var url = "/zingbiz/report/restaurant_report/retRestaurantDayCal";
                var pat = {};
                pat.dateTime = self.dateTime;
                self.$http.get(url, { params:pat } ).then(res => {
                    let dataTemp = res.data.data;
                        self.restaurantList = dataTemp;
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
            onCancel() {
                console.log('onCancel')
            },
            onConfirm(msg) {
                console.log('onConfirm', msg)
                this.dateTime = msg[0];
                if (this.dateTime === '') {
                    this.$refs.dialog1.showValue = true;
                    this.$vux.toast.text("请选择筛选时间!", 'bottom')
                }
                this.getDataListByIndex();
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
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

                params.dateTime = this.dateTime;
                params.explorField = "restaurant_diancaiyingye";
                params.fileName = "点菜营业日报表";
                params.fieldTitles = "项目名称@当日收入@当月累计@上月同期@去年同期@毛利率";
                params.fields = "title,dt,dy,sy,qn,mlv";
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

    .diancaiyingyeribaobiao {
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






    body .weui-cells {
        max-height: calc(100vh-300px);
        overflow-y: scroll;
    }
</style>


