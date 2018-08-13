<template>
    <div class="resource" style="height: 100%">
        <zing-head slot="dialogTitle" :title="'财务配置'"></zing-head>
        <div style="height: calc(100% - 50px);overflow: auto">
            <group label-align="right" gutter="10px" v-for="(item,index) in payType" :key="index">
                <x-input title="餐饮订单" v-if="item.isInvoice" v-model="isIvo" :show-clear="false" :disabled="true" placeholder=""></x-input>
                <x-input title="餐饮订单" v-else v-model="isNoIvo" :show-clear="false" :disabled="true" placeholder=""></x-input>
                <x-input title="支付方式" v-model="item.value" :show-clear="false" :disabled="true" placeholder=""></x-input>
                <x-input title="业务方" v-model="item.filenameY" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index,'Y')" placeholder="选择科目"></x-input>
                <x-input title="审核方" v-model="item.filenameS" :show-clear="false" :disabled="true" @click.native="selectPickedDialog(index,'S')" placeholder="选择科目"></x-input>
                <div style="height: 20px;width: 100%;background: #e5e5e5"></div>
            </group>
            <group>
                <flexbox :gutter="0">
                    <flexbox-item>
                        <x-button class="btn-save" type="warn" @click.native="">保存</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button class="btn-common" type="primary" @click.native="">提交</x-button>
                    </flexbox-item>
                </flexbox>
            </group>
        </div>
        <!-- 科目 -->
        <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import {
        XInput, Group, Flexbox, FlexboxItem, XButton
    } from "vux";
    export default {
        name: "dinnerFinance",
        components: {
            ZingHead, SubjectPicker, XInput, Group, Flexbox, FlexboxItem, XButton
        },
        data() {
            return {
                isIvo:"开具发票",
                isNoIvo:"不开具发票",
                showPicker : false,
                clickIndex:0,
                clickType:"",
                payType:[
                    { value:"现金",payCode:1,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"现金",payCode:1,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"银行卡",payCode:2,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"银行卡",payCode:2,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"支付宝",payCode:3,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"支付宝",payCode:3,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"微信支付",payCode:4,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"微信支付",payCode:4,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"支票",payCode:5,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"支票",payCode:5,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"会员卡",payCode:6,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"会员卡",payCode:6,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"预付款",payCode:7,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"预付款",payCode:7,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"其他",payCode:8,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"其他",payCode:8,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"卡券",payCode:9,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"卡券",payCode:9,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"宴请",payCode:11,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"宴请",payCode:11,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:true },
                    { value:"挂账",payCode:10,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                    { value:"跑单",payCode:12,fileIdY:"",filenameY:"",fileIdS:"",filenameS:"",isInvoice:false },
                ],
            };
        },
        created() {
            this.loadList();
        },
        methods: {
            loadList() {
                let that = this;
            },
            selectPickedDialog(index,type) {
                this.clickIndex = index
                this.clickType = type
                this.showPicker = true;
            },
            getPickedData(pickedData) {
                console.log(pickedData);
                if (this.clickType === "Y") {
                    this.payType[this.clickIndex].fileIdY = pickedData.fileId;
                    this.payType[this.clickIndex].filenameY = pickedData.filename;
                } else {
                    this.payType[this.clickIndex].fileIdS = pickedData.fileId;
                    this.payType[this.clickIndex].filenameS = pickedData.filename;
                }
                this.showPicker = false;
            },
            subjectAbort() {
                this.showPicker = false;
            },
        },
    };
</script>

<style>
    .search-area {
        margin: 30px;
    }

    .table-area {
        margin-left: 30px;
        margin-right: 30px;
    }

    .zing-pagination {
        margin-top: 10px;
        float: right;
    }
    .el-loading-mask {  //修改加载遮罩样式不可删除
        position: fixed;
        z-index: 2000;
        background-color: hsla(0,0%,100%,.9);
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-transition: opacity .3s;
         transition: opacity .3s;
    }
</style>

