<template>
    <div class="outWrapper">
        <ZingHead title="方案设置" :isComeBack="isComeBack" v-on:doSome="comeback"></ZingHead>
        <div class="planManage">
            <x-input
                class="changeProject"
                title="残值收入对应科目"
                 placeholder="请选择科目"
                 v-model="changeProject.ProjectName"
                 @click.native="changeSubject()"
                 disabled
            ></x-input>
            <x-input
                class="clearProject"
                title="清理费用对应科目"
                placeholder="请选择科目"
                v-model="clearProject.ProjectName"
                @click.native="clearSubject()"
                disabled
            ></x-input>
            <x-input
                class="downProject"
                title="减值准备对方科目"
                placeholder="请选择科目"
                v-model="downProject.ProjectName"
                @click.native="downSubject()"
                disabled
            ></x-input>
            <x-input
                class="financial"
                title="财务库"
                placeholder="请选择财务库"
                @click.native="chooseFinancial()"
                v-model="voucherInfoItems.ckName"
                disabled
            ></x-input>

            <selector
                class="voucherId"
                title="凭证字"
                placeholder="请选择凭证字号"
                v-model="voucherId"
                :options="voucherData"
            ></selector>
        </div>
        <div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="cancel()">取消</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="submit()">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <!--选择科目代码-->
        <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
        <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <warehouse-list
                :isReferenced="true"
                @financeItemClick="financeItemClick"
                @warehoseListBack="warehoseListBack"
            ></warehouse-list>
        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import { Group,XInput,Flexbox,FlexboxItem,XButton,Popup,Selector } from 'vux'
    //选择财务库模板
    import WarehouseList from "../../ziyuanku/financeWarehouse/warehouseList";
    export default {
        name: "plan-manage",
        components:{
            ZingHead,
            SubjectPicker,
            Group,
            XInput,
            Flexbox,
            FlexboxItem,
            XButton,
            WarehouseList,
            Popup,
            Selector
        },
        data() {
            return {
                isComeBack:false,
                showPicker:false,
                change:false,
                clear:false,
                down:false,
                changeProject:{
                    ProjectId:"",
                    ProjectName:""
                },
                clearProject:{
                    ProjectId:"",
                    ProjectName:""
                },
                downProject:{
                    ProjectId:"",
                    ProjectName:""
                },
                //财务库
                showWarehoseList:false,
                voucherInfoItems:{
                    ckId:"",
                    ckName:""
                },
                voucherData:[],
                voucherId:""
            }
        },
        created() {
            this.select()
            this.searchVoucher()
        },
        methods:{
            getPickedData(pickedData) {
                if (this.change) {
                    this.changeProject.ProjectId = pickedData.fileId;
                    this.changeProject.ProjectName = pickedData.filename;
                }
                if (this.clear) {
                    this.clearProject.ProjectId = pickedData.fileId;
                    this.clearProject.ProjectName = pickedData.filename;
                }
                if (this.down) {
                    this.downProject.ProjectId = pickedData.fileId;
                    this.downProject.ProjectName = pickedData.filename;
                }
                this.showPicker = false;
            },
            subjectAbort() {
                this.showPicker = false;
            },
            changeSubject() {
                this.showPicker = true
                this.change = true
                this.clear = false
                this.down = false
            },
            clearSubject() {
                this.showPicker = true
                this.change = false
                this.clear = true
                this.down = false
            },
            downSubject() {
                this.showPicker = true
                this.change = false
                this.clear = false
                this.down = true
            },
            cancel() {
                this.$emit("comeback")
            },
            submit() {
                //提交改变,保存成功之后
                let params = {}
                if (this.clearProject.ProjectId === "") {
                    this.$vux.toast.text("请选择清理费用科目")
                    return
                } else {
                    params.cleaningCostsCode = this.clearProject.ProjectId
                }
                if (this.downProject.ProjectId === "") {
                    this.$vux.toast.text("请选择减值准备科目")
                    return
                } else {
                    params.impairmentPreparationCode = this.downProject.ProjectId
                }
                if (this.changeProject.ProjectId === "") {
                    this.$vux.toast.text("请选择残值收入科目")
                    return
                } else {
                    params.residualIncomeCode = this.changeProject.ProjectId
                }
                if (this.voucherInfoItems.ckId === "") {
                    this.$vux.toast.text("请选择财务库")
                    return
                } else {
                    params.ckId = this.voucherInfoItems.ckId
                }
                if (this.voucherId === "") {
                    this.$vux.toast.text("请选择凭证号")
                    return
                } else {
                    params.voucherId = this.voucherId
                }
                params.type = "voucher"
                this.$http.post("/zingbiz/fixedAssets/schemeSetting/insert",params).then((res) => {
                    if (res.data.success) {
                        this.$emit("comeback")
                    }
                })
            },
            comeback() {
                this.$emit("comeback")
            },
            //方案设置查询(初始化)
            select() {
                this.$http.get("/zingbiz/fixedAssets/schemeSetting/select",{
                    params:{
                        type:"voucher"
                    }
                }).then((res) => {
                    if (res.data.success) {
                        if (res.data.data.length !== 0) {
                            this.clearProject.ProjectName = res.data.data[0].cleaningCostsCodeName
                            this.clearProject.ProjectId = res.data.data[0].cleaningCostsCode
                            this.changeProject.ProjectName = res.data.data[0].residualIncomeCodeName
                            this.changeProject.ProjectId = res.data.data[0].residualIncomeCode
                            this.downProject.ProjectName = res.data.data[0].impairmentPreparationCodeName
                            this.downProject.ProjectId = res.data.data[0].impairmentPreparationCode
                            this.voucherInfoItems.ckId = res.data.data[0].ckId
                            this.voucherInfoItems.ckName = res.data.data[0].ckName
                            this.voucherId = res.data.data[0].voucherId
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }

                })
            },
            //选择财务库
            chooseFinancial() {
                this.showWarehoseList = true
            },
            financeItemClick(data) {
                console.log(data)
                this.voucherInfoItems.ckId = data.rowId;
                this.voucherInfoItems.ckName = data.ckName;
                this.showWarehoseList = false;
            },
            warehoseListBack() {
                this.showWarehoseList = false;
            },
            //获取凭证字号
            searchVoucher() {
                this.$http.post("/zingbiz/finance/voucher/searchVoucher",{}).then(res => {
                    if (res.data.success) {
                        let Voucher = res.data.data.data.data
                        Voucher.forEach(element => {
                            this.voucherData.push({
                                key:element.voucherId,
                                value:element.voucherName
                            })
                        });
                        console.log(this.voucherData)
                    }
                })

            }
        }
    }
</script>
<style>
    .planManage .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .planManage .changeProject .weui-cell__hd:before,
    .planManage .clearProject .weui-cell__hd:before,
    .planManage .downProject .weui-cell__hd:before,
    .planManage .financial .weui-cell__hd:before,
    .planManage .voucherId .weui-cell__hd:before

    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 130px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .planManage .financial .weui-cell__hd:before,
    .planManage .voucherId .weui-cell__hd:before
    {
        left: 60px;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outWrapper{
        height 100%
        .planManage{
            border-bottom 1px solid #f5f5f5
            height calc(100% - 94px)
        }
    }

    .interspace{
        margin-left: 0px !important;
        text-align center
    }
</style>
