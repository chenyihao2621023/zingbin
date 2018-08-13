<template>
    <div class="shisuanpinghengbiao">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="试算平衡表">
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
            <p style="margin: 8px;color:rgb(115, 115, 115);">期间： {{ retPeriodScope }}</p>
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
                    label="期初余额" align="center"
                >
                    <el-table-column
                        prop="qc_j"
                        label="借方"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="qc_d"
                        label="贷方"
                    >
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    label="本期发生" align="center"
                >

                    <el-table-column
                        prop="bq_j"
                        label="借方"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="bq_d"
                        label="贷方"
                    >
                    </el-table-column>
                </el-table-column>

                <el-table-column
                    label="期末余额" align="center"
                >

                    <el-table-column
                        prop="qm_j"
                        label="借方"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="qm_d"
                        label="贷方"
                    >
                    </el-table-column>
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
                            <div style="height:200px;">
                                <checklist :options="commonList" v-model="commonKey" @on-change="changeList"></checklist>
                            </div>
                        </div>
                    </group>
                    <div style="padding:20px 15px;" id="cancelBtn0">
                        <flexbox>
                            <flexbox-item>
                                <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="reset">重置</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button type="primary" @click.native="getDataList">查询</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                    <div style="padding:20px 15px;display:none;" id="cancelBtn1">
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
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp } from "@/utils/fn";

    export default {
        name: "shisuanpinghengbiao",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,PopupHeader,Selector,Grid,GridItem,XInput,Checklist,Dropdown
        },
        data() {
            return {
                levelList:['1','2','3','4','5','6','7','8','9'],
                restaurantList: [],
                restaurantListAll:[],
                retPeriodScope:'',
                dateTime: '',
                showDateDialog: false,
                commonKey:'',
                form:{
                    startPeriod:'',
                    endPeriod:'',
                    startLevel:'',
                    endLevel:'',
                    commonValue:'',
                    pageNumber:1,
                    pageSize:10,
                    currency:'0',
                },
                showPicker:false,
                tag:1,
                currencyList:[{ key:'0',value:'综合本位币' }],
                commonList:[{ key:'0',value:'包括未过账凭证' },{ key:'1',value:'显示禁用科目' },{ key:'2',value:'无发生额不显示' },{ key:'3',value:'余额为零且无发生额不显示' }],
                startSubMap:{},
                endSubMap:{},
                totalPage:0,
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
            onFocus(type) {
                if (type === 'startSubject') {
                    this.tag = 1;
                } else if (type === 'endSubject') {
                    this.tag = 2;
                }
                this.showPicker = true;
            } ,
            change() {
                console.log("this.form",this.form);
            },
            log (str1, str2 = '') {
                console.log(str1, str2)
            },
            getDataList() {
                this.retPeriodScope = this.form.startPeriod;
                if (this.form.startPeriod === '' ) {
                    this.$vux.toast.text("请选择期间!", 'bottom')
                    return
                }

                let self = this;
                if (this.commonKey.length > 0) {
                    this.form.commonValue = this.commonKey.join(",");
                } else {
                    this.form.commonValue = '';
                }
                this.form.endPeriod = this.form.startPeriod;
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

                if (this.form.startDate === '' || this.form.endDate === '') {
                    this.$vux.toast.text("请选择时间!", 'bottom')
                    return
                }
                this.form.explorField = "finance_kmueb";
                this.form.fileName = "试算平衡表";
                this.form.fieldTitles = "科目代码@科目名称@期初借方@期初贷方@本期借方@本期贷方@期末借方@期末贷方";
                this.form.fields = "subjectCode,subjectName,qc_j,qc_d,bq_j,bq_d,qm_j,qm_d";
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

    .shisuanpinghengbiao {
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


