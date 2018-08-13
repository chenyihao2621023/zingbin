<template>
    <div class="outwrapper">
        <div class="inner" v-show="inner">
            <ZingHead title="固定资产生成凭证"></ZingHead>
            <div class="fixVoucher">
                <group>
                    <selector title="事件类型" :options="list" v-model="defaultValue"></selector>
                    <datetime
                        title="会计期间"
                        v-model="period"
                        placeholder="请输入会计期间"
                        format="YYYY-MM"
                        class="period"
                    ></datetime>
                    <div class="voucherState">
                        <span class="voucherState-name">凭证状态</span>
                        <span class="voucherState-content">
                        <span class="voucherState-content-all">
                            <span v-bind:style ="{ borderColor:defalueColor }" class="voucherState-content-all-icon" @click="voucherStateAll">
                                <span :class="{radioed: all }"></span>
                            </span>
                            <span>全部</span>
                        </span>
                        <span class="voucherState-content-yes">
                            <span v-bind:style ="{ borderColor:borderColor }" class="voucherState-content-yes-icon" @click="voucherStateYes">
                                <span :class="{radioed: yes }"></span>
                            </span>
                            <span>有凭证</span>
                        </span>
                        <span class="voucherState-content-no">
                            <span v-bind:style ="{ borderColor:otherColor }" class="voucherState-content-no-icon" @click="voucherStateNo">
                                <span :class="{radioed: no }"></span>
                            </span>
                            <span>无凭证</span>
                        </span>
                    </span>
                    </div>
                    <!--<div class="auditState">-->
                        <!--<span class="auditState-name">审核状态</span>-->
                        <!--<span class="auditState-content">-->
                        <!--<span class="auditState-content-all">-->
                            <!--<span v-bind:style ="{ borderColor:auditdefalueColor }" class="auditState-content-all-icon" @click="auditStateAll">-->
                                <!--<span :class="{radioed: StateAll }"></span>-->
                            <!--</span>-->
                            <!--<span>全部</span>-->
                        <!--</span>-->
                        <!--<span class="auditState-content-yes">-->
                            <!--<span v-bind:style ="{ borderColor:auditborderColor }" class="auditState-content-yes-icon" @click="auditStateYes">-->
                                <!--<span :class="{radioed: StateYes }"></span>-->
                            <!--</span>-->
                            <!--<span>已审核</span>-->
                        <!--</span>-->
                        <!--<span class="auditState-content-no">-->
                            <!--<span v-bind:style ="{ borderColor:auditotherColor }" class="auditState-content-no-icon" @click="auditStateNo">-->
                                <!--<span :class="{radioed: StateNo }"></span>-->
                            <!--</span>-->
                            <!--<span>未审核</span>-->
                        <!--</span>-->
                    <!--</span>-->
                    <!--</div>-->
                    <x-input title="资产编码" v-model="assetCode" placeholder="请输入资产编码"></x-input>
                    <x-input title="资产名称" v-model="assetName" placeholder="请输入资产名称"></x-input>
                    <x-input title="变动方式" v-model="changeType" placeholder="请输入变动方式" disabled @click.native="showChange"></x-input>
                </group>
            </div>
            <div>
                <flexbox class="inner">
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-save" @click.native="cancle">取消</x-button>
                    </flexbox-item>
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-common" @click.native="query">查询</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>

        <voucherResult
            v-if="result"
            @doSome="doSome"
            :resultData="resultData"
        ></voucherResult>
        <popupChangeWay :showPopup="WayPopup" @backClick="clickBack" @checkItem="Way"></popupChangeWay>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import voucherResult from "../template/voucherResult";
    // import { Z_IsEmpty20 } from "@/utils/fn";
    import popupChangeWay from "./selectorPopup/popupChangeWay";
    import { Group,XInput,Flexbox,FlexboxItem,XButton,Selector,Datetime  } from 'vux'
    export default {
        name: "voucher",
        components:{
            ZingHead,
            Group,
            XInput,
            Flexbox,
            FlexboxItem,
            XButton,
            Selector,
            voucherResult,
            popupChangeWay,
            Datetime
        },
        data() {
            return {
                list:[
                    "全部",
                    "新增",
                    "清理",
                    "变动"
                ],
                defaultValue:"全部",
                period:"",
                assetCode:"",
                assetName:"",
                changeType:"",
                all:true,
                yes:false,
                no:false,
                defalueColor:"#40affc",
                borderColor:"#c9c9c9",
                otherColor:"#c9c9c9",
                StateAll:true,
                StateYes:false,
                StateNo:false,
                auditdefalueColor:"#40affc",
                auditborderColor:"#c9c9c9",
                auditotherColor:"#c9c9c9",
                inner:true,
                result:false,
                resultData:{},
                WayPopup:false
            }
        },
        methods:{
            voucherStateAll() {
                this.all = true
                this.yes = false
                this.no = false
                this.defalueColor = "#40affc"
                this.borderColor = "#c9c9c9"
                this.otherColor = "#c9c9c9"
            },
            voucherStateYes() {
                this.all = false
                this.yes = true
                this.no = false
                this.defalueColor = "#c9c9c9"
                this.borderColor = "#40affc"
                this.otherColor = "#c9c9c9"
            },
            voucherStateNo() {
                this.all = false
                this.yes = false
                this.no = true
                this.defalueColor = "#c9c9c9"
                this.borderColor = "#c9c9c9"
                this.otherColor = "#40affc"
            },
            auditStateAll() {
                this.StateAll = true
                this.StateYes = false
                this.StateNo = false
                this.auditdefalueColor = "#40affc"
                this.auditborderColor = "#c9c9c9"
                this.auditotherColor = "#c9c9c9"
            },
            auditStateYes() {
                this.StateAll = false
                this.StateYes = true
                this.StateNo = false
                this.auditdefalueColor = "#c9c9c9"
                this.auditborderColor = "#40affc"
                this.auditotherColor = "#c9c9c9"
            },
            auditStateNo () {
                this.StateAll = false
                this.StateYes = false
                this.StateNo = true
                this.auditdefalueColor = "#c9c9c9"
                this.auditborderColor = "#c9c9c9"
                this.auditotherColor = "#40affc"
            },
            cancle() {
                this.$router.go(-1)
            },
            query() {
                if (this.defaultValue === "新增") {
                    this.resultData.type = "add"
                } else if (this.defaultValue === "清理") {
                    this.resultData.type = "clean"
                } else if (this.defaultValue === "变动") {
                    this.resultData.type = "change"
                }
                if (this.period === "") {
                    this.$vux.toast.text("请选择会计期间")
                    return
                } else {
                    this.resultData.period = this.period
                }
                if (this.assetCode) {
                    this.resultData.assetsCoding = this.assetCode
                }
                if (this.assetName) {
                    this.resultData.assetsName = this.assetName
                }
                if (this.changeType) {
                    this.resultData.changeWay = this.changeType
                }
                // voucherStatus
                if (this.yes) {
                    this.resultData.voucherStatus = "yes"
                } else if (this.no) {
                    this.resultData.voucherStatus = "no"
                }

                // if (this.StateYes) {
                //     this.resultData.status = "YSH"
                // } else if (this.StateNo) {
                //     this.resultData.status = "WSH"
                // }
                this.inner = false
                this.result = true
            },
            doSome() {
                this.inner = true
                this.result = false
            },
            showChange() {
                this.WayPopup = true
            },
            clickBack() {
                this.WayPopup = false
            },
            Way(item) {
                this.WayPopup = false
                this.changeType = item.name
            },
        }
    }
</script>
<style>
    .fixVoucher .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .fixVoucher .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 16px !important;
        text-align: left;
        font-family: Arial;
    }
    .fixVoucher .weui-cell__bd,.fixVoucher .weui-select{
        font-family: Arial;
        color: rgba(136, 136, 136, 1) !important;
        font-size: 16px !important;
    }
    /*.el-dropdown{*/
    /*top: 55px !important;*/
    /*right: 10px !important;*/
    /*}*/
    .outwrapper .inner .fixVoucher .period p:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 85px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .inner{
            height 100%
            .fixVoucher{
                height calc(100% - 94px)
            }
        }
    }
    .voucherState,.auditState{
        position relative
        height 44px
        line-height 44px
        border-top 1px solid #f5f5f5
        padding-left 13px
        font-size 16px
        &-content{
            position absolute
            right 13px
            &-all{
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
            &-yes{
                margin 0 5px
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
            &-no{
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
        }
    }
    .radioed{
        box-sizing: border-box;
        content: ''
        display inline-block
        position  absolute
        width 12px
        height 12px
        border-radius 6px
        left 50%
        top 50%
        transform translate(-50%,-50%)
        background-color #40affc
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
</style>
