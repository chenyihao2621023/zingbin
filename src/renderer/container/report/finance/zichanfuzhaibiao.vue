<template>
    <div class="zichanfuzhaibiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="资产负债表">
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
            <p style="margin: 8px;color:rgb(115, 115, 115);">单位名称： {{ retCompanyId }}</p>
            <el-table
                :data="restaurantList"
                style="width: 100%"
                stripe
                border
                height="calc(65%)"
            >
                <el-table-column
                    prop="balance_one"
                    label="资产"
                    width="180px"
                >
                </el-table-column>
                <el-table-column
                    prop="balance_formula_qm_money"
                    label="期末余额"
                >
                </el-table-column>
                <el-table-column
                    prop="balance_formula_nc_money"
                    label="年初余额"
                >
                </el-table-column>
                <el-table-column
                    prop="balance_two"
                    label="负债或所有者权益（或股东权益）"
                    width="180px"
                >
                </el-table-column>
                <el-table-column
                    prop="balance_two_formula_qm_money"
                    label="期末余额"
                >
                </el-table-column>
                <el-table-column
                    prop="balance_two_formula_nc_money"
                    label="年初余额"
                >
                </el-table-column>
            </el-table>

        </div>

        <div v-transfer-dom>


            <popup v-model="showDateDialog" height="100%" is-transparent>

                <div style="width: 100%;background-color:#fff;height:100%;margin:3px auto;border-radius:5px;padding-top:3px;">
                    <popup-header title="查询条件"></popup-header>
                    <group style="height:70%;">
                        <div style="height:100%;">
                            <div class="periodDate">
                                <datetime
                                    v-model="form.startPeriod"
                                    @on-change="change"
                                    title="起始期间"
                                    @on-cancel="log('cancel')"
                                    @on-confirm="onConfirm"
                                    @on-hide="log('hide', $event)"
                                    format="YYYY-MM"
                                    placeholder="请输入起始期间"></datetime>
                                <datetime
                                    v-model="form.endPeriod"
                                    @on-change="change"
                                    title="结束期间"
                                    @on-cancel="log('cancel')"
                                    @on-confirm="onConfirm"
                                    @on-hide="log('hide', $event)"
                                    format="YYYY-MM"
                                    placeholder="请输入结束期间"></datetime>
                            </div>


                            <selector title="币别" v-model="form.currency" :options="currencyList" ></selector>
                            <div style="height:200px;">
                                <checklist :options="commonList" v-model="form.commonValue" @on-change="changeList"></checklist>
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
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp } from "@/utils/fn";

    export default {
        name: "zichanfuzhaibiao",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,PopupHeader,Selector,Grid,GridItem,SubjectPicker,XInput,Checklist,Dropdown
        },
        data() {
            return {
                levelList:['1','2','3','4','5','6','7','8','9'],
                restaurantList: [],
                retCompanyId:'',
                dateTime: '',
                showDateDialog: false,
                form:{
                    startPeriod:'',
                    endPeriod:'',
                    commonValue:'',
                    currency:'0',
                },
                currencyList:[{ key:'0',value:'综合本位币' }],
                commonList:[{ key:'0',value:'包括未过账凭证' }],
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
            this.selectDateForm('0');
        },
        methods: {

            reset() {
                this.commonKey = '';
                this.form = {};
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
            change() {
                console.log("this.form",this.form);
            },
            log (str1, str2 = '') {
                console.log(str1, str2)
            },
            getDataList() {


                if (this.form.startPeriod === '' || this.form.endPeriod === '') {
                    this.$vux.toast.text("请选择期间!", 'bottom')
                    return
                }
                 let self = this;
                if (this.commonKey.length > 0) {
                    this.form.commonValue = this.commonKey.join(",");
                } else {
                    this.form.commonValue = '';
                }
                var url = "/zingbiz/report/finance_report/report_zichanfuzhai";
                self.$http.post(url, this.form ).then(res => {
                    let dataTemp = res.data.data;
                    console.log("this.dataTemp",dataTemp);
                    self.restaurantList = dataTemp.data;
                    self.retCompanyId = dataTemp.companyName[0].companyName;
                });
                this.showDateDialog = false;
                console.log("this.form",this.form);
            },
            selectDateForm(type) {

                this.showDateDialog = true;
            },
            onConfirm(msg) {
                console.log('onConfirm msg', msg)
                console.log("form",this.form);
            } ,
            changeList (val, label) {
                console.log('change', val, label);
                this.commonKey = val;
                console.log('form', this.form);
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
                if (this.form.startPeriod === '' || this.form.endPeriod === '') {
                    this.$vux.toast.text("请选择期间!", 'bottom')
                    return
                }
                this.form.explorField = "finance_zcfzb";
                this.form.fileName = "资产负债表";
                this.form.fieldTitles = "资产@期末余额@年初余额@负债或所有者权益（或股东权益）@期末余额@年初余额";
                this.form.fields = "balance_one,balance_formula_qm_money,balance_formula_nc_money,balance_two,balance_two_formula_qm_money,balance_two_formula_nc_money";
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

    .zichanfuzhaibiao {
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


