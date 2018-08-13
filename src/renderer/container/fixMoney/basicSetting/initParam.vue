<template>
    <div class="initParamWrapper">
        <ZingHead title="固定资产参数"></ZingHead>
        <div class="inner">
            <group class="initParam">
                <x-input title="会计年度起始日期" v-model="startTime" disabled></x-input>
                <x-input title="会计年度期间个数" value="12" disabled></x-input>
                <datetime
                    class="check-date"
                    title="套账启用会计期间"
                    v-model="enableTime"
                    format="YYYY-MM"
                    placeholder="请选择启用会计期间"
                    @on-confirm="onConfirm"
                    :display-format="formatValueFunction"
                    :readonly="readonly"
                ></datetime>
                <x-input title="套账当前会计期间" v-model="currentTime" disabled></x-input>
                <checklist :options="commonList" v-model="checked" :disabled="disabled"></checklist>
                <div class="count">
                    <selector title="折旧率小位数" :options="discountList" v-model="discount" :readonly="readonly"></selector>
                    <selector title="数量小位数" :options="countList" v-model="count" class="countList" :readonly="readonly"></selector>
                </div>
            </group>
            <x-button type="primary" class="btn-common common" @click.native="submit" v-show="checkedSubmit">提交</x-button>
        </div>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import { Checklist,Group,XInput,XButton,Selector,Datetime } from 'vux'
    export default {
        name: "init-param",
        components:{
            ZingHead,
            XInput,
            Group,
            Checklist,
            XButton,
            Selector,
            Datetime
        },
        data () {
            return {
                startTime:"",
                enableTime:"",
                readonly:false,
                disabled:false,
                currentTime:"",
                commonList:[
                    '新建、变动、清理资产卡片需要审核',
                    '不折旧（对于整个系统）',
                    '变动使用部门时，当期折旧按原部门进行归集'
                    ],
                discount:"2",
                count:"0",
                discountList:[
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8"
                ],
                countList:[
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                checked:[],
                checkedSubmit:true,
            }
        },
        watch: {

        },
        created () {
            this.checkSetupConfiguration()
        },
        methods:{
            //是否设置初始化参数
            checkSetupConfiguration() {
               this.$http.get("/zingbiz/fixedAssets/configuration/checkSetupConfiguration")
                   .then(res => {
                       if (res.data.success) {
                           this.startTime = res.data.data.data.accountYearBeginDate
                           this.enableTime = res.data.data.data.enabledAccountingPeriod
                           this.currentTime = res.data.data.data.currentAccountingPeriod
                           this.discount = res.data.data.data.depreciationRateDecimalDigits
                           this.count = res.data.data.data.numberDecimalDigits
                           if (res.data.data.data.disableDepreciation) {
                               this.checked.push("不折旧（对于整个系统）")
                           }
                           if (res.data.data.data.oldDeptDepreciation) {
                               this.checked.push("变动使用部门时，当期折旧按原部门进行归集")
                           }
                           if (res.data.data.data.auditNeededBeforeAddDelUpdate) {
                               this.checked.push("新建、变动、清理资产卡片需要审核")
                           }
                           if (res.data.data.data.enabledAccounting) {
                               this.readonly = true
                               this.disabled = true
                               this.checkedSubmit = false
                           }
                       }
                   })
            },
            check(value) {
                return {
                    valid: /^(19|20)\d{2}$/.test(value.substring(0,4))
                            && value.substring(4,5) === "年"
                            && /^[0-9]*$/.test(value.substring(5,(value.length - 1)))
                            && value.substring((value.length - 1),value.length) === "期",
                    msg: '请输入正确的日期格式'
                }
            },
            //格式化日期
            formatValueFunction(val) {
                if (val.split("-").length === 1) {
                    return val
                } else {
                    return val.split("-")[0] + "年" + parseInt(val.split("-")[1]) + "期"
                }
            },
            // 确认日期
            onConfirm() {
                let value = this.enableTime
                this.startTime = value.substring(0,4) + "-01-01"
                this.currentTime = value.split("-")[0] + "年" + parseInt(value.split("-")[1]) + "期"
            },
            //提交参数
            submit() {
                if (this.enableTime === "") {
                    this.$vux.toast.text("请选择启用会计期间")
                    return
                }
                let params = {}
                params.enabledAccountingPeriod = this.enableTime.split("-")[0] + "年" + parseInt(this.enableTime.split("-")[1]) + "期"
                if (this.checked.length !== 0) {
                    this.checked.forEach(val => {
                        if (val === "不折旧（对于整个系统）") {
                            params.disableDepreciation = true
                        } else {
                            params.disableDepreciation = false
                        }
                        if (val === "变动使用部门时，当期折旧按原部门进行归集") {
                            params.oldDeptDepreciation = true
                        } else {
                            params.oldDeptDepreciation = false
                        }
                        if (val === "新建、变动、清理资产卡片需要审核") {
                            params.auditNeededBeforeAddDelUpdate = true
                        } else {
                            params.auditNeededBeforeAddDelUpdate = false
                        }
                    })
                }
                params.depreciationRateDecimalDigits = parseInt(this.discount)
                params.numberDecimalDigits = parseInt(this.count)

                console.log(params)
                this.$http.post("/zingbiz/fixedAssets/configuration/setupConfiguration",params)
                    .then((res) => {
                        if (res.data.mgs === "设置成功") {
                            this.$vux.toast.text("设置成功")
                            this.$router.go("-1")
                        } else {
                            this.$vux.toast.text("设置失败")
                        }
                    })
            }

        }
    }
</script>
<style>
    .initParam .vux-selector{
        width: 50% !important;
    }
    .initParam .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;

    }
    .initParam .check-date p:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 130px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .initParam .weui-cell__bd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .initParam .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;

    }
    .initParam .check-date p,
    .initParam .check-date .vux-cell-placeholder,
    .initParam .check-date .vux-cell-value
    {
        color:rgb(16,16,16);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .initParam .check-date .vux-cell-value,
    .initParam .check-date .vux-cell-placeholder
    {
        color: #888;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .initParamWrapper{
        height 100%
        .inner{
            height 100%
            .initParam{
                height: calc(100% - 105px);
            }
        }
    }
    .count{
        position relative
    }
    .countList{
        position absolute
        right 0
        top:0
    }
    .common{
        margin-top 10px
    }
</style>
