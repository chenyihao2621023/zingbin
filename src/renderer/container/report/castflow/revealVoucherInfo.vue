<template>
    <div class="revealVoucherInfo">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="凭证信息">
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
                height="calc(80%)"
                highlight-current-row
                @current-change="handleCurrentChange"
            >

                <el-table-column
                    prop="dateTime"
                    label="日期"
                    width="100"
                    fixed
                >
                </el-table-column>
                <el-table-column
                    prop="periodTime"
                    label="期间"
                >
                </el-table-column>
                <el-table-column
                    prop="pzWordNo"
                    label="凭证字号"
                >
                </el-table-column>
                <el-table-column
                    prop="pzSummary"
                    label="摘要"
                >
                </el-table-column>
                <el-table-column
                    prop="projectId"
                    label="科目代码"
                >
                </el-table-column>
                <el-table-column
                    prop="projectName"
                    label="科目名称"
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
                    prop="jie"
                    label="借方"
                >
                </el-table-column>
                <el-table-column
                    prop="dai"
                    label="贷方"
                >
                </el-table-column>
                <el-table-column
                    prop="flowMoney"
                    label="流量金额"
                >
                </el-table-column>
                <el-table-column
                    prop="mainpro"
                    label="主表项目"
                >
                </el-table-column>
                <el-table-column
                    prop="assistpro"
                    label="附表项目"
                >
                </el-table-column>
            </el-table>
            <div style="padding:20px 15px;" >
                <flexbox>
                    <flexbox-item>
                        <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="appointCastFlow">指定现金流量</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>


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

    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp } from "@/utils/fn";
    export default {
        name: "revealVoucherInfo",
        components: {
            Scroll, ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,Radio,
            Flexbox, FlexboxItem, XButton, FormDialog,PopupHeader,Selector,Grid,GridItem,SubjectPicker,XInput,Checklist,Dropdown
        },
        data() {
            return {
                restaurantList: [],
                form:{
                },
                pzId:'',
                appointType:'',

            }
        }, created() {
            this.pzId = this.$route.query.pzId;
            this.appointType = this.$route.query.appointType;
            this.getDataList();
        },
        methods: {
            getDataList() {
                let pz = this.pzId;
                pz = pz.substr(0,pz.indexOf("#"));
                var url = "/zingbiz/report/finance_report/castFlow_TAccaout_Detail";
                 this.$http.post(url, { pzId : pz } ).then(res => {
                    let dataTemp = res.data.data;
                    this.restaurantList = dataTemp;
                });
            },
            appointCastFlow() {
                let that = this
                if (that.currentRow === undefined) {
                    that.$vux.toast.text("请选择数据!", 'bottom')
                    return;
                }
                //获取当前行所在的现金科目凭证集合
              if (this.appointType === 'main') {
                this.$router.push({
                  path: "appointVoucher",
                  query: {
                    pzRowId:that.currentRow.pzRowId
                  }
                });
              } else if (this.appointType === 'append') {
                this.$router.push({
                  path: "appointAppendVoucher",
                  query: {
                    pzRowId:that.currentRow.pzRowId
                  }
                });
              }

            },
            handleCurrentChange(val) {
                console.log("val=",val)
                this.currentRow = val;
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
    .revealVoucherInfo {
        height 100%;
    }

</style>



