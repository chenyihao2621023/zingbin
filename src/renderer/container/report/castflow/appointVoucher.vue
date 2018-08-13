<template>
    <div class="appointVoucher">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="指定现金流量">
            <div slot="header-right">

            </div>
        </zing-head>

        <!-- tab内容 -->
        <div class="tab-content">
            <br/>

            <el-table
                :data="restaurantList"
                style="width: 100%"
                stripe
                border
                height="calc(30%)"
                highlight-current-row
                @current-change="handleCurrentChange"
                ref="sigelTable"
            >

                <el-table-column
                    prop="subjectName"
                    label="现金流量科目"
                    width="110"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    prop="currenId"
                    label="币别"
                >
                </el-table-column>
                <el-table-column
                    prop="pzOriginalAccount"
                    label="原币金额"
                >
                </el-table-column>
                <el-table-column
                    prop="pzAccount"
                    label="本币金额"
                >
                </el-table-column>
            </el-table>
            <el-table
                :data="otherSubList"
                style="width: 100%"
                stripe
                border
                height="calc(40%)"
            >
                <el-table-column
                    prop="title"
                    label="对方科目"
                    width="110"
                    fixed
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="fileId"
                    label="主表项目"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.fileId" @click.native="onfileIdClick(scope.row)" disabled></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="attForm_Name"
                    label="附表项目"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.attForm_Name" disabled></el-input><!--@click.native="onattFormClick(scope.row)"-->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pzOriginalAccount"
                    label="原币金额"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pzOriginalAccount" @blur="onpzOriginalAccountBlur(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pzAccount"
                    label="本币金额"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pzAccount" @blur="onpzAccountBlur(scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding:20px 15px;">
                <flexbox>
                    <flexbox-item>
                        <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="cancelProject">取消</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button type="primary" @click.native="resetProject">重置</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="saveVoucherInfo">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
        <cast-flow-change :showPopup="showMain" :recordType="recordType" @backClick="clickBack" @checkItem="Way"></cast-flow-change>
    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,Radio,
        FlexboxItem, XButton,PopupHeader,Selector,Grid,GridItem,XInput,Checklist
    } from 'vux'
    import Scroll from '@/components/scroll/Scroll'
    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import SubjectPicker from 'components/subjectpicker/SubjectPicker'
    import CastFlowChange from "../report-components/castFlowChange";
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp } from "@/utils/fn";
    export default {
        name: "appointVoucher",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,Radio,CastFlowChange,
            Flexbox, FlexboxItem, XButton, FormDialog,PopupHeader,Selector,Grid,GridItem,SubjectPicker,XInput,Checklist,Dropdown
        },
        data() {
            return {
                restaurantList: [],
                otherSubList:[],
                form:{
                },
                pzRowId:'',
                saveWork:[],
                showMain:false,
                fileId:'',
                otherRow:[],
                attOtherRow:[],
                cashVoucher:[],
                recordType:'',
            }
        }, created() {
            this.pzRowId = this.$route.query.pzRowId;
            this.getDataList();
        },
        methods: {
            resetProject() {
                this.$refs.sigelTable.setCurrentRow();
                this.otherSubList = [];
            },
            cancelProject() {
                this.$router.back();
            },
            getDataList() {
                //获取当前行所在的现金科目凭证集合
                let pz = this.pzRowId;
                var url = "/zingbiz/report/finance_report/getCashVoucherItem";
                this.$http.post(url, { pzRowId : pz } ).then(res => {
                    let dataTemp = res.data.data;
                    this.restaurantList = dataTemp;
                });
            },
            handleCurrentChange(row) {
                console.log("val=",row)
                this.currentRow = row;
                this.otherSubList = this.currentRow.otherSubList;
                let saveFlag = true
                this.cashVoucher.forEach((val) => {
                    if (val.rowId === row.rowId) {

                        saveFlag = false
                    }
                })
                if (saveFlag) {
                    this.cashVoucher.push(row);
                }
            },
            //修改失去焦点
            onpzOriginalAccountBlur (row) {
                    let saveFlag = true
                    this.saveWork.forEach((val) => {
                        if (val.rowId === row.rowId) {
                            val.pzOriginalAccount = row.pzOriginalAccount
                            saveFlag = false
                        }
                    })
                    if (saveFlag) {
                        this.saveWork.push({
                            rowId:row.rowId,
                            pzOriginalAccount:row.pzOriginalAccount
                        })
                    }
                    console.log(this.saveWork)
            },
            onpzAccountBlur(row) {
                let saveFlag = true
                this.saveWork.forEach((val) => {
                    if (val.rowId === row.rowId) {
                        val.pzAccount = row.pzAccount
                        saveFlag = false
                    }
                })
                if (saveFlag) {
                    this.saveWork.push({
                        rowId:row.rowId,
                        pzAccount:row.pzAccount
                    })
                }
                console.log(this.saveWork)

            },
            onfileIdClick(row) { //主表项目
              this.recordType = 'cashflow';
              this.showMain = true;
              this.otherRow = row;
            },
            Way(item) {
                this.showMain = false
                this.$set(this.otherRow , "fileId" , item.fileId)
                this.$set(this.otherRow , "cash_RowId" , item.rowId)
                console.log(this.otherSubList)

            },
            clickBack() {
                this.showMain = false
            },
            saveVoucherInfo() {
                let that = this;
                let flag = true;
                console.log("this.cashVoucher",this.cashVoucher);

                this.cashVoucher.forEach(val => {
                    if (val.otherSubList) {
                        let account = 0;
                        val.otherSubList.forEach(other => {
                            if (other.cash_RowId !== undefined) {

                                account += parseFloat(other.pzAccount);
                            }
                            val.otherSubList.forEach(next => {
                               if (other.rowId !== next.rowId) {
                                   if (other.cash_RowId === next.cash_RowId) {
                                       that.$vux.toast.text("现金项目不允许重复!", 'bottom');
                                       flag = false;
                                       return;
                                   }
                               }

                            })
                        })
                        if (parseFloat(val.pzAccount) !== account) {
                            that.$vux.toast.text("与现金科目发生金额不一致!", 'bottom');
                            flag = false;
                            return;
                        }
                    }
                });
                //params:this.cashVoucher[0] }
                if (flag) {
                    let url = "/zingbiz/report/finance_report/appointPzItemToCashProject";
                    let config = { params: JSON.stringify(that.cashVoucher) }
                    this.$http.post(url, config ).then(res => {

                    });

                }


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
    .appointVoucher {
        height 100%;
    }

</style>



