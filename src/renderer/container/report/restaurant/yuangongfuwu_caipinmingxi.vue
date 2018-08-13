<template>
    <div class="yuangongfuwuqingkuangfenxi">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="详细信息">

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
        <!-- tab页 -->

        <!-- tab内容 -->
        <div class="tab-content">
            <br/>
            <p style="margin: 8px;color:rgb(115, 115, 115);">营业流水号: {{ dinnerOrderNo }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;台号:{{deskNo}}</p>
            <hr style="border-color: #fff6;"/>

            <el-table
                :data="restaurantList"
                style="width: 100%"
                height="calc(79%)"
                border
                stripe
            >
                <el-table-column
                    prop="genTime"
                    label="操作时间"
                    width="160"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    label="服务方式"
                    prop="dinnerStateName"
                >
                </el-table-column>
                <el-table-column
                    prop="cardUrlName"
                    label="服务员"
                >
                </el-table-column>
                <el-table-column
                    prop="dinnerName"
                    label="菜品名称"
                    width="210"

                >
                </el-table-column>
                <el-table-column
                    prop="dinnerUnit"
                    width="160"
                    label="规格"
                >
                </el-table-column>
                <el-table-column
                    prop="dinnerCounts"
                    label="数量"
                >
                </el-table-column>
                <el-table-column
                    prop="dinnerPrice"
                    label="单价"
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
    import OrgMemberPicker from "../../../components/orgmemberpicker/OrgMemberPicker"
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
    export default {
        name: "yuangongfuwuqingkuangfenxi",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,OrgMemberPicker,Dropdown
        },
        data() {
            return {
                deskList:[],
                loading: false,
                output: '',
                deskId:'',
                serviceId:'',
                restaurantList:[],
                orderId:'',
                companyId:'',
                dinnerStateName:'',
                genTime:'',
                deskNo:'',
                userName:'',
                dinnerId:'',
                dinnerOrderNo:'',
                rightMenu: [
                    {
                        content: "导出"
                    },
                ],
                isPc:false,
            }
        }, computed: {

        }, created() {
            this.orderId = this.$route.query.orderId;
            this.companyId = this.$route.query.companyId;
            this.dinnerStateName = this.$route.query.dinnerStateName;
            this.genTime = this.$route.query.genTime;
            this.deskNo = this.$route.query.deskNo;
            this.userName = this.$route.query.userName;
            this.dinnerId = this.$route.query.dinnerId;
            this.dinnerOrderNo = this.$route.query.dinnerOrderNo;
            this.getDataListByIndex();
        },
        methods: {
            getDataListByIndex() {
                let self = this;
                var url = "/zingbiz/report/restaurant_report/userServCaipinDetail";
                var pat = {};

                pat.orderId = this.orderId;
                pat.companyId = this.companyId;
                pat.dinnerStateName = this.dinnerStateName;
                pat.dinnerId = this.dinnerId;
                console.log("pat=",pat);
                self.$http.get(url, {params:pat}).then(res => {
                    console.log("res=",res);
                    let dataTemp = res.data;
                    if (dataTemp && dataTemp.data) {
                        var rd = dataTemp.data;
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
                params.orderId = this.orderId;
                params.companyId = this.companyId;
                params.dinnerStateName = this.dinnerStateName;
                params.dinnerId = this.dinnerId;
                params.explorField = "restaurant_yuangongfuwumingxi";
                params.fileName = "员工服务明细统计";
                params.fieldTitles = "操作时间@服务方式@服务员@菜品名称@规格@数量@单价";
                params.fields = "genTime,dinnerStateName,cardUrlName,dinnerName,dinnerUnit,dinnerCounts,dinnerPrice";
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



