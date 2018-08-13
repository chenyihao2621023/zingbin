<template>
    <div class="pingzhenghuizongbiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="凭证汇总表">
            <div slot="header-right">
                <span class="header-search" @click="selectDateForm('1')">
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
            <p style="margin: 8px;color:rgb(115, 115, 115);"> {{ retDateScope }}</p>

            <el-table
                :data="restaurantList"
                style="width: 100%"
                stripe
                border
                height="calc(65%)"
            >
                <el-table-column
                    prop="subjectCode"
                    label="科目代码"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    prop="subjectName"
                    label="科目名称"
                >
                </el-table-column>

                <el-table-column
                    prop="bq_j"
                    label="借方金额"
                >
                </el-table-column>
                <el-table-column
                    prop="bq_d"
                    label="贷方金额"
                >
                </el-table-column>

            </el-table>
            <div class="block right p10">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="form.pageNumber"
                    :page-sizes="[10, 50, 100, 200]"
                    :page-size="form.pageSize"
                    layout="sizes, prev, pager, next"
                    :total="totalPage"
                    pager-count="4">
                </el-pagination>
            </div>
        </div>

        <div v-transfer-dom>


            <popup v-model="showDateDialog" height="100%" is-transparent>

                <div style="width: 100%;background-color:#fff;height:100%;margin:3px auto;border-radius:5px;padding-top:3px;">
                    <popup-header title="查询条件"></popup-header>
                    <group style="height:70%;">
                        <div style="height:100%;">

                            <div class="dateTime" >
                                <datetime
                                    v-model="form.startDate"
                                    @on-change="change"
                                    title="起始时间"
                                    @on-cancel="log('cancel')"
                                    @on-confirm="onConfirm"
                                    @on-hide="log('hide', $event)"
                                    placeholder="请输入起始时间"></datetime>
                                <datetime
                                    v-model="form.endDate"
                                    @on-change="change"
                                    title="结束时间"
                                    @on-cancel="log('cancel')"
                                    @on-confirm="onConfirm"
                                    @on-hide="log('hide', $event)"
                                    placeholder="请输入结束时间"></datetime>
                            </div>

                            <flexbox>

                                <div style="margin-left: 13px;">
                                    科目级别
                                </div>

                                <flexbox-item>
                                    <selector v-model="form.startLevel" :options="levelList" placeholder="请选择">

                                    </selector>
                                </flexbox-item>
                                <div style="width:40px;text-align: center;">
                                    至
                                </div>
                                <flexbox-item>
                                    <selector v-model="form.endLevel" :options="levelList" placeholder="请选择"></selector>
                                </flexbox-item>
                            </flexbox>

                            <selector title="币别" v-model="form.currency" :options="currencyList" ></selector>
                            <x-input title="凭证字范围" v-model="form.voucherName" placeholder="请选择凭证字范围" :show-clear="true" @on-focus="showGoodListForm = true"></x-input>

                            <div style="height:200px;">
                                <checklist :options="commonList" v-model="commonKey" @on-change="changeList"></checklist>
                            </div>
                        </div>
                    </group>

                    <div style="padding:20px 15px;" id="cancelBtn1">
                        <flexbox>
                            <flexbox-item>
                                <x-button type="primary" @click.native="showDateDialog = false">取消</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="reset">重置</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button type="primary" @click.native="getDataList">查询</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </div>
            </popup>
            <check-list-dialog
                ref="dialog3"
                v-model="showGoodListForm"
                :title="'凭证字类型'"
                :showForm="true"
                :formAttrs="formAttrs3"
                :objectList="voucherList"
                @on-cancel="onCancel"
                @on-confirm="onGoodList_Confirm"
                @on-show="onShow"
                @on-hide="onHide"
                @on-change="changeVoucher"
                style="min-height:200">
            </check-list-dialog>
        </div>
    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton,PopupHeader,Selector,Grid,GridItem,XInput,Checklist
    } from 'vux'
    import Scroll from '@/components/scroll/Scroll'
    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import SubjectPicker from 'components/subjectpicker/SubjectPicker'
    import CheckListDialog from '../../report/report-components/CheckListDialog'
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp } from "@/utils/fn";
    export default {
        name: "pingzhenghuizongbiao",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,PopupHeader,Selector,Grid,GridItem,SubjectPicker,XInput,Checklist,CheckListDialog,Dropdown
        },
        data() {
            return {
                list: [{ key: 'sj', value: '按时间查询' }, { key: 'qj', value: '按期间查询' }],
                levelList:['1','2','3','4','5','6','7','8','9'],
                restaurantList: [],
                restaurantListAll:[],
                retDateScope: '[1000]库存现金 -- [1002]银行存款',
                dateTime: '',
                showDateDialog: false,
                form:{
                    startDate:'',
                    endDate:'',
                    startLevel:'',
                    endLevel:'',
                    commonValue:'',
                    pageNumber:1,
                    pageSize:10,
                    currency:'0',
                    voucherId:'',
                    voucherName:'',
                },
                voucherIdList:[],
                voucherNameList:[],
                showGoodListForm:false,
                currencyList:[{ key:'0',value:'综合本位币' }],
                voucherList:[],
                commonList:[{ key:'0',value:'包括未过账凭证' },{ key:'1',value:'显示禁用科目' },{ key:'2',value:'无发生额不显示' }],
                formAttrs3: [
                {
                    title: '凭证字类型',
                    type: 'checklist',
                    isShowTitle: 'true'
                },

            ],
                totalPage:0,
                commonKey:'',
                rightMenu: [
                    {
                        content: "导出"
                    },
                ],
                isPc:false,
            }
        }, created() {
            this.getCurrencyList();
            this.getVoucherList();
            this.selectDateForm('0');
        },
        methods: {
            changeVoucher(val, label) {
                console.log('changeVoucher', val, label)
                this.voucherIdList = val;
                this.voucherNameList = label;
            },
            reset() {
                this.commonKey = '';
                this.form = {};
            },
            handleSizeChange(val) {
                this.form.pageSize = val;
                this.form.pageNumber = 1;
                console.log(`每页 ${val} 条`);
                this.getDataList();
            },
            handleCurrentChange(val) {
                this.form.pageNumer = val;
                console.log(`当前页: ${val}`);
                // this.getDataList();

                this.restaurantList = this.restaurantListAll.slice((val - 1) * this.form.pageSize,(val) * this.form.pageSize);
            },
            getCurrencyList() {
                let self = this;
                var url = "/zingbiz/finance/currency/searchCurrency";
                let param = {
                    pageNumber:0,
                    pageSize:5000,
                    status:1
                }

                self.$http.post(url, param)
                    .then(res => {
                        console.log("res===",res);
                        let dataTemp = res.data.data;
                        if (dataTemp && dataTemp.data) {
                            let rd = dataTemp.data;
                            console.log("rd===",rd);
                            if (rd.length > 0) {
                                for (let i in rd) {
                                    rd[i].key = rd[i].currencyId;
                                    rd[i].value = rd[i].currencyName;
                                    self.currencyList.push(rd[i]);
                                }
                            }
                        }
                    })
                    .catch((e) => {
                        console.log("error:",e);
                        this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                    });
            },
            getVoucherList() {
                let self = this;
                var url = "/zingbiz/finance/voucher/searchVoucher";
                let param = {
                    pageNumber:0,
                    pageSize:5000,
                    status:1
                }
                self.$http.post(url, param)
                    .then(res => {
                        console.log("res searchVoucher===",res);
                        let dataTemp = res.data.data.data;
                        if (dataTemp && dataTemp.data) {
                            let rd = dataTemp.data;
                            console.log("rd searchVoucher===",rd);
                            if (rd.length > 0) {
                                for (let i in rd) {
                                    rd[i].key = rd[i].voucherId;
                                    rd[i].value = rd[i].voucherName;
                                    self.voucherList.push(rd[i]);
                                }
                            }
                        }
                    })
                    .catch((e) => {
                        console.log("error:",e);
                        this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                    });
            },
            change() {
                console.log("this.form",this.form);
            },
            log (str1, str2 = '') {
                console.log(str1, str2)
            },
            getDataList() {

                 if (this.form.startDate === '' || this.form.endDate === '') {
                        this.$vux.toast.text("请选择时间!", 'bottom')
                        return
                    }
                this.retDateScope = this.form.startDate + " 至 " + this.form.endDate;
                let self = this;
                if (this.commonKey.length > 0) {
                    this.form.commonValue = this.commonKey.join(",");
                } else {
                    this.form.commonValue = '';
                }
                var url = "/zingbiz/report/finance_report/report_KeMuYuE";
                self.$http.post(url, this.form ).then(res => {
                    let dataTemp = res.data.data;
                    self.restaurantListAll = dataTemp;
                    this.restaurantList = this.restaurantListAll.slice(0, this.form.pageSize);

                    this.totalPage = dataTemp.length;

                });
                this.showDateDialog = false;
                console.log("this.form",this.form);
            },
            selectDateForm(type) {

                this.showDateDialog = true;
            },
            doSome() {
                this.showDateDialog = false;
            },
            onCancel() {
                console.log('onCancel')
            },
            onConfirm(msg) {
                console.log('onConfirm msg', msg)
                console.log("form",this.form);


            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            changeList (val, label) {
                console.log('change', val, label);
                this.commonKey = val;
                console.log('form', this.form);
            },onGoodList_Confirm(msg) {
                this.form.voucherId = this.voucherIdList.join(",");
                this.form.voucherName = this.voucherNameList.join(",");
                console.log('onGoodList_Confirm', this.form.voucherId, this.form.voucherName);
                console.log('onGoodList_Confirm msg', msg);
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

                if (this.form.startDate === '' || this.form.endDate === '') {
                    this.$vux.toast.text("请选择时间!", 'bottom')
                    return
                }
                this.form.explorField = "finance_kmueb";
                this.form.fileName = "凭证汇总表";
                this.form.fieldTitles = "科目代码@科目名称@借方金额@贷方金额";
                this.form.fields = "subjectCode,subjectName,bq_j,bq_d";
                let url = "/zingbiz/report/finance_report/exportExcel";

                this.$httpSilent
                    .post(url, this.form)
                    .then(res => {
                        console.log("res==",res)
                        window.location = "/zingbiz/report/hotel_report/dowLoadExcelFile.action?fileName=" + this.form.fileName;
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

    .pingzhenghuizongbiao {
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



</style>


