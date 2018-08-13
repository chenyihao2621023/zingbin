<template>
    <div class="outer">
        <popup position="right" height="100%" v-model="popup">
            <ZingHead title="选择标签" :isComeBack="false" @doSome="cancle()"></ZingHead>
            <div class="selectTag">
                <div class="contactsType">
                    <div class="contactsTypeTitle">
                        <div class="contactsLabel">
                            <div class="fa fa-circle btn-sm type">&nbsp;&nbsp;类型</div>
                        </div>
                    </div>
                    <div class="contactsInfo">
                        <div class="contactsLabel" v-for="(value,index) in Type" :key="index" @click="contactsType(value)">
                            <div class="tag  btn-sm" :class="{activeT:value.active}">{{value.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="contactsState">
                    <div class="contactsStateTitle">
                        <div class="contactsLabel">
                            <div class="fa fa-circle btn-sm state">&nbsp;&nbsp;状态</div>
                        </div>
                    </div>
                    <div class="contactsInfo">
                        <div class="contactsLabel" v-for="(val,index) in State" :key="index" @click="contactsState(val)">
                            <div class="tag  btn-sm" :class="{activeS:val.active}">{{val.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="contactsLevel">
                    <div class="contactsLevelTitle">
                        <div class="contactsLabel">
                            <div class="fa fa-circle btn-sm grade">&nbsp;&nbsp;级别</div>
                        </div>
                    </div>
                    <div class="contactsInfo">
                        <div class="contactsLabel" v-for="(item,index) in Level" :key="index" @click="contactsLevel(item)">
                            <div class="tag  btn-sm" :class="{activel:item.active}">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="confirm" @click="confirm()">确定</div>
            </div>
        </popup>
    </div>
</template>
<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Popup } from 'vux'
    export default {
        name: "label-type",
        components:{
            ZingHead,
            Popup
        },
        props:{
            popup:{
                type:Boolean,
                defalut:false
            }
        },
        data() {
            return {
                typeText:"",
                stateText:"",
                levelText:"",
                Type:[
                    { name:"普通客户", active:false },
                    { name:"酒店客户", active:false },
                    { name:"商城客户", active:false },
                    { name:"合作伙伴", active:false },
                    { name:"渠道商", active:false },
                    { name:"供应商", active:false },
                    { name:"其他类型", active:false },
                ],
                State:[
                    { name:"潜在", active:false },
                    { name:"意向", active:false },
                    { name:"洽谈", active:false },
                    { name:"成交", active:false },
                    { name:"流失", active:false },
                ],
                Level:[
                    { name:"一般", active:false },
                    { name:"重要", active:false },
                    { name:"核心", active:false },
                ],
                externalContactsData:{}

            }
        },
        methods:{
            //返回按钮
            cancle() {
                this.$emit("cancle")
            },
            //点击类型
            contactsType(val) {
                let that = this
                that.Type.filter(function (item) {
                    if (!item) {
                        return false
                    }
                    item.active = false
                    return true
                 })
                if (that.typeText === val.name) {
                    val.active = false
                    that.typeText = ""
                } else {
                    that.typeText = val.name
                    val.active = true
                }
            },
            //点击状态
            contactsState(val) {
                let that = this
                that.State.filter(function (value) {
                    if (!value) {
                        return false
                    }
                    value.active = false
                    return true
                })

                if (that.stateText === val.name) {
                    val.active = false
                    that.stateText = ""
                } else {
                    val.active = true
                    that.stateText = val.name
                }
            },
            //点击级别
            contactsLevel(val) {
                let that = this
                that.Level.filter(function (item) {
                    if (!item) {
                        return false
                    }
                    item.active = false
                    return true
                })
                if (that.levelText === val.name) {
                    val.active = false
                    that.levelText = ""
                } else {
                    that.levelText = val.name
                    val.active = true
                }

            },
            //提交数据
            confirm() {
               let externalContactsData = {
                    contactsState:this.stateText,
                    contactsType: this.typeText,
                    contactsLevel:this.levelText
               }
                this.$emit("confirm",externalContactsData)
                this.cancle()
            }
        }
    }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
    .selectTag{
        height calc(100%-50px)
        padding-top 10px
        background-color: #ffffff;
        .contactsType {
            .contactsTypeTitle{
                color:#f7b55e;
                .btn-sm{
                    font-size: 16px;
                }
            }
        }
        .contactsState {
            padding-top 10px
            padding-bottom 10px
            .contactsStateTitle{
                color:#17c295;
                .btn-sm{
                    font-size: 16px;
                }
            }
        }
        .contactsLevel {
            .contactsLevelTitle{
                color:#4da9eb;
                .btn-sm{
                    font-size: 16px;
                }
            }
        }
        .contactsInfo {
            width: 100%;
            font-size: 0;
            .contactsLabel {
                width: 33%;
                display: inline-block;
                padding:5px 13px;
                line-height: 100%;
                .tag{
                    background-color:#f4f4f4;
                    color: #55585a;
                    text-align:center;
                    width: 100%;
                    height: 28px;
                    line-height: 28px;
                    :after {
                        border-width: 14px 5px !important;
                        border-color: #f4f4f4 transparent #f4f4f4 #f4f4f4 !important;
                    }
                }
                .btn-sm{
                    font-size: 14px;
                }
            }
        }
        .confirm {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 40px;
            line-height 40px
            border-radius: 5px;
            background-color: rgba(255, 128, 0, 1);
            color: rgba(245, 245, 245, 1);
            font-size: 18px;
            text-align: center;
            font-family: Microsoft Yahei;
        }
    }
    .type:before{
        display inline-block
        content ""
        height 15px
        width 15px
        border-radius 7.5px
        background-color : rgba(255, 128, 0, 1)
        margin-left 13px
    }
    .state:before{
        display inline-block
        content ""
        height 15px
        width 15px
        border-radius 7.5px
        background-color : rgba(23, 194, 149, 1)
        margin-left 13px
    }
    .grade:before{
        display inline-block
        content ""
        height 15px
        width 15px
        border-radius 7.5px
        background-color :rgba(77, 169, 235, 1)
        margin-left 13px
    }
    .activeT{
        background-color #FCA56A !important
    }
    .activeS{
        background-color #DCF6EF !important
    }
    .activel{
        background-color #E4F2FC !important
    }
</style>
