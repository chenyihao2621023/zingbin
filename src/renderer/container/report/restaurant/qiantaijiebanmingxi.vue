<template>
    <div class="qiantaijiebanmingxi">
        <!-- 头部 -->
        <zing-head :isShowQuery="false" title="结班明细">
            <div slot="header-right">
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

            <el-table
                :data="restaurantList"
                style="width: 100%"
                height="calc(83%)"
                border
                stripe
            >
                <el-table-column
                    prop="title"
                    label=""
                >
                </el-table-column>
                <el-table-column
                    prop="money"
                    label=""
                >
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton
    } from 'vux'

    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        name: "qiantaijiebanmingxi",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,Dropdown
        },
        data() {
            return {
                restaurantList: [],
                startDate:'',
                endDate:'',
                companyId:'',
                cardUrl:'',
                rightMenu: [
                    {
                        content: "导出"
                    },
                ],
                isPc:false,
            }
        }, created() {
            // this.tabWidth = document.documentElement.offsetWidth || document.body.offsetWidth
            this.companyId = this.$route.query.companyId;
            this.startDate = this.$route.query.startDate;
            this.endDate = this.$route.query.endDate;
            this.cardUrl = this.$route.query.cardUrl;
            this.getDataListByIndex();
        },
        methods: {

            getDataListByIndex() {
                let self = this;
                var url = "/zingbiz/report/restaurant_report/getWorkPeriodDetailStream";
                var pat = {};

                pat.companyId = this.companyId;
                pat.startDate = this.startDate;
                pat.endDate = this.endDate;
                pat.cardUrl = this.cardUrl;

                self.$http.get(url, { params:pat }).then(res => {
                    let dataTemp = res.data;
                    if (dataTemp && dataTemp.data) {
                        let rd = dataTemp.data;
                        self.restaurantList = rd;
                    }
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

                params.companyId = this.companyId;
                params.startDate = this.startDate;
                params.endDate = this.endDate;
                params.cardUrl = this.cardUrl;
                params.explorField = "restaurant_qiantaijieban";
                params.fileName = "结班明细";
                params.fieldTitles = "项目名称@当日收入";
                params.fields = "title,money";
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

    .qiantaijiebanmingxi {
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


</style>


