<template>
    <div v-show="searchPage" class="searchPage">
        <div v-show="defaultPage" class="defaultPage">
            <group class="default-content">
                <datetime title="会计期间" v-model="during" placeholder="请选择会计期间" format="YYYY-MM" v-show="accountDuring"></datetime>
                <datetime title="起始日期" v-model="start" placeholder="请选择开始日期" v-show="accountStart"></datetime>
                <datetime title="截止日期" v-model="end" placeholder="请选择结束日期" v-show="accountEnd"></datetime>
                <x-input title="资产编码" placeholder="请输入资产编码" v-model="moneyCode"></x-input>
                <x-input title="资产名称" placeholder="请输入资产名称" v-model="moneyName"></x-input>
                <cell title="资产类别" :value="assetType" @click.native="switchAsset" disabled></cell>
                <cell title="变动方式" :value="changeType" @click.native="switchChange" disabled></cell>
                <cell title="使用状态" :value="useState" @click.native="switchState" disabled></cell>
                <cell title="存放地点" :value="location" @click.native="switchLocation" disabled></cell>
                <selector title="经济用途" :options="['全部', '经营用','非经营用']" v-model="use"></selector>
                <selector title="汇总项目" :options="['资产类别', '使用状态','变动方式','存放地点','经济用途']" v-model="project" v-show="projectFlag"></selector>
                <checklist :options="commonList" v-model="list" @on-change="change" v-show="checkList"></checklist>
            </group>

            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="resetPage()">重置</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="search()">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>

        <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="Asset"></popupAssetType>
        <popupStorage :showPopup="locationPopup" @backClick="clickBack" @checkItem="locationClick"></popupStorage>
        <popupUseStatu :showPopup="StatePopup" @backClick="clickBack" @checkItem="State"></popupUseStatu>
        <popupChangeWay :showPopup="WayPopup" @backClick="clickBack" @checkItem="Way"></popupChangeWay>
    </div>
</template>

<script>
    import popupAssetType from "../../fixMoney/dailyTreatment/selectorPopup/popupAssetType.vue";
    import popupStorage from "../../fixMoney/dailyTreatment/selectorPopup/popupStorage";
    import popupUseStatu from "../../fixMoney/dailyTreatment/selectorPopup/popupUseStatu";
    import popupChangeWay from "../../fixMoney/dailyTreatment/selectorPopup/popupChangeWay";
    import { Group,XInput,Datetime,Selector,Checklist,Flexbox,FlexboxItem,XButton,Cell } from 'vux'
    export default {
        name: "depreciation-sum-table",
        components:{
            Group,
            XInput,
            Datetime,
            Selector,
            Checklist,
            Flexbox,
            FlexboxItem,
            XButton,
            popupAssetType,
            popupStorage,
            popupUseStatu,
            popupChangeWay,
            Cell
        },
        props:{
            searchPage:{
                type:Boolean,
                default:false
            },
            accountDuring:{
                type:Boolean,
                default:true
            },
            accountStart:{
                type:Boolean,
                default:false
            },
            accountEnd:{
                type:Boolean,
                default:false
            },
            checkList:{
                type:Boolean,
                default:true
            },
            projectFlag: {
                type:Boolean,
                default:true
            }
        },
        data() {
            return {
                during:"",
                start:"",
                end:"",
                moneyCode:"",
                moneyName:"",
                assetType:"请选择资产类别",
                assetTypeCode:"",
                changeType:"请选择变动方式",
                changeTypeCode:"",
                useState:"请选择使用状态",
                useStateCode:"",
                location:"请选择存放地点",
                locationCode:"",
                use:"全部",
                project:"资产类别",
                commonList:[
                    "包含本期折旧为零的固定资产",
                    "包含所有已清理的固定资产"
                ],
                list:[],
                defaultPage:true,
                assetPopup:false,
                locationPopup:false,
                StatePopup:false,
                WayPopup:false,
                returnParam:{

                }
            }
        },
        methods:{
            //资产类别
            switchAsset() {
                this.defaultPage = false
                this.assetPopup = true
            },
            Asset(item) {
                this.assetType = item.name
                this.assetTypeCode = item.code
                this.defaultPage = true
                this.assetPopup = false
            },
            //改变方式
            switchChange() {
                this.defaultPage = false
                this.WayPopup = true
            },
            Way(item) {
                this.changeType = item.name
                this.changeTypeCode = item.code
                this.defaultPage = true
                this.WayPopup = false
            },
            //使用状态
            switchState() {
                this.defaultPage = false
                this.StatePopup = true
            },
            State(item) {
                this.useState = item.name
                this.useStateCode = item.code
                this.defaultPage = true
                this.StatePopup = false
            },
            //存放地点
            switchLocation() {
                this.defaultPage = false
                this.locationPopup = true
            },
            locationClick(item) {
                this.location = item.name
                this.locationCode = item.code
                this.defaultPage = true
                this.locationPopup = false
            },
            clickBack() {
                this.defaultPage = true
                this.assetPopup = false
                this.WayPopup = false
                this.StatePopup = false
                this.locationPopup = false
            },
            //重置
            resetPage() {
                this.returnParam = {}
                this.during = ""
                this.start = ""
                this.end = ""
                this.moneyCode = ""
                this.moneyName = ""
                this.assetType = "请选择资产类别"
                this.changeType = "请选择变动方式"
                this.useState = "请选择使用状态"
                this.location = "请选择存放地点"
                this.locationCode = ""
                this.useStateCode = ""
                this.assetTypeCode = ""
                this.changeTypeCode = ""
                this.project = "资产类别"
                this.use = "全部"
                this.list = []
            },
            //查询
            search() {
                if (this.accountDuring) {
                    if (this.during === "") {
                        this.$vux.toast.text("请选择会计期间！");
                        return
                    } else {
                        this.returnParam.period = this.during
                    }
                }
                if (this.accountStart) {
                    if (this.start === "") {
                        this.$vux.toast.text("请选择开始日期")
                        return
                    } else {
                        this.returnParam.startTime = this.start
                    }
                }
                if (this.accountEnd) {
                    if (this.end === "") {
                        this.$vux.toast.text("请选择结束日期")
                        return
                    } else {
                        this.returnParam.endTime = this.end
                    }
                }
                if (this.moneyCode) {
                    this.returnParam.assetsCoding = this.moneyCode
                }
                if (this.moneyName) {
                    this.returnParam.assetsName = this.moneyName
                }
                if (this.assetType !== "请选择资产类别") {
                    this.returnParam.assetsClass = this.assetTypeCode
                }
                if (this.changeType !== "请选择变动方式") {
                    this.returnParam.changeWay = this.changeTypeCode
                }
                if (this.useState !== "请选择使用状态") {
                    this.returnParam.workingConditionId = this.useStateCode
                }
                if (this.location !== "请选择存放地点") {
                    this.returnParam.storePlaceId = this.locationCode
                }
                //汇总项目
                if (this.projectFlag) {
                    if (this.project === "资产类别") {
                        this.returnParam.summaryProject = "assetsClass"
                    } else if (this.project === "存放地点") {
                        this.returnParam.summaryProject = "storePlace"
                    } else if (this.project === "变动方式") {
                        this.returnParam.summaryProject = "changeWay"
                    } else if (this.project === "使用状态") {
                        this.returnParam.summaryProject = "workingCondition"
                    } else if (this.project === "经济用途") {
                        this.returnParam.summaryProject = "economicUse"
                    }
                }
                //
                if (this.checkList) {
                    if (this.list.length !== 0) {
                        this.list.forEach(val => {
                            if (val === "包含本期折旧为零的固定资产") {
                                this.returnParam.isIncludeNoDepreciation = true
                            }
                            if (val === "包含所有已清理的固定资产" ) {
                                this.returnParam.isIncludeCleaned = true
                            }
                        })
                    }
                }
                //经济用途
                if (this.use !== "全部") {
                    this.returnParam.economicUse = this.use
                }
                //传方法跳数据
                this.$emit("search",this.returnParam)
            }
        }
    }
</script>
<style>
    .fixReport .searchPage .defaultPage .default-content .vux-cell-disabled .vux-label,
    .fixReport .searchPage .defaultPage .default-content .weui-cell__hd .weui-label,
    .fixReport .searchPage .defaultPage .default-content .vux-datetime p{
        font-size: 16px !important;
        color: #101010 !important;
    }
    .fixReport .searchPage .defaultPage .default-content .weui-input,
    .fixReport .searchPage .defaultPage .default-content .weui-cell__ft,
    .fixReport .searchPage .defaultPage .default-content .weui-select,
    .fixReport .searchPage .defaultPage .default-content .vux-cell-value,
    .fixReport .searchPage .defaultPage .default-content .vux-cell-placeholder{
        font-size: 14px !important;
        color: #888 !important;
        font-family: Microsoft Yahei;
    }
    .fixReport .searchPage .defaultPage .default-content input::-webkit-input-placeholder {
        font-size: 14px !important;
        color: #888 !important;
        font-family: Microsoft Yahei;
        font-weight: 400;
    }
    .fixReport .searchPage .defaultPage .default-content .vux-datetime p:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 80px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .searchPage{
        height 100%
        .defaultPage{
            height 100%
            .default-content{
                height calc(100% - 94px)
            }
        }
    }
    .interspace{
        margin-left 0 !important
    }
</style>
