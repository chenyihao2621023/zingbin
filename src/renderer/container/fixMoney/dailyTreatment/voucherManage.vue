<template>
    <div class="voucher">
        <ZingHead title="凭证管理">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click = "search"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </ZingHead>
        <div class="searchContainer" v-show="searchBar">
            <div class="Top-bar">
                <span class="cancel-icon" id="concel-search">
                    <span class="cancelInput" @click="cancleSearch">取消</span>
                </span>
                <span class="inputSpan">
                    <form action="" class="">
                        <input class="inputForm" id="basic-search" dataId="all" :placeholder="holder" v-model="val">
                    </form>
                </span>
                <span class="confirm-icon " id="confirm-search">
                    <span class="confirmInput">确定</span>
                </span>
                <span class="confirm-icon " id="confirm-search1">
                    <span class="confirmInput screen" @click="screen">筛选</span>
                </span>
            </div>
        </div>
        <div class="content">
            <div class="vue-tab">
                <tab class="" :line-width="2">
                    <tab-item :selected="defaultTab === item" v-for="(item, index) in tabTitle" :key="index" @on-item-click="changeTab">{{item}}</tab-item>
                </tab>
            </div>
            <div class="tab-content">
                <div class="tabDiv" v-show="show1">
                    <audited></audited>
                </div>
                <div class="tabDiv" v-show="show2">
                    <notAudit></notAudit>
                </div>
                <div class="tabDiv" v-show="show3">
                    <invoicing></invoicing>
                </div>
            </div>
        </div>


        <confirm
            class="editconfirm"
            v-model="show"
            title="筛选条件"
            @on-confirm="onConfirm"
            :close-on-confirm="false"
        >
            <div>
                <datetime title="开始时间" placeholder="请选择开始时间" v-model="startTime"></datetime>
                <datetime title="结束时间" placeholder="请选择结束时间" v-model="endTime"></datetime>
            </div>
        </confirm>

        <confirm v-model="posting"
                 title="提示"
                 @on-confirm="confirmPosting"
               >
            <p style="text-align:center;">确定将所有凭证反过账吗？</p>
        </confirm>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import audited from "../template/audited";
    import notAudit from "../template/notAudit";
    import invoicing from "../template/invoicing";
    import { Tab, TabItem ,Confirm,Datetime } from 'vux'
    export default {
        name: "voucher-manage",
        components:{
            ZingHead,
            Dropdown,
            TabItem,
            Tab,
            audited,
            notAudit,
            Confirm,
            Datetime,
            invoicing
        },
        data() {
            return {
                show:false,
                datas:[
                    { content: "全部过账" }
                ],
                tabTitle:["已结账","已过账", "未过账"],
                defaultTab:"已结账",
                show1:true,
                show2:false,
                show3:false,
                holder:"搜索",
                val:"",
                searchBar:false,
                posting:false,
                startTime:"",
                endTime:""
            }
        },
        methods:{
            changeTab(index) {
                if (index === 0) {
                    this.show1 = true
                    this.show2 = false
                    this.show3 = false
                } else if (index === 1) {
                    this.show1 = false
                    this.show2 = true
                    this.show3 = false
                } else if (index === 2) {
                    this.show1 = false
                    this.show2 = false
                    this.show3 = true
                }
            },
            //点击搜索
            search() {
                this.searchBar = !this.searchBar
            },
            //筛选
            screen() {
                this.show = true
            },
            //筛选确认
            onConfirm() {
                if (this.endTime === "" || this.startTime === "") {
                    this.$vux.toast.text("请选择时间段")
                    return
                } else {
                    this.show = false
                }
                console.log("确认筛选时间，发送请求")
            },
            //取消搜索
            cancleSearch() {
                this.searchBar = false
            },
            //反过账
            handleMenu () {
                this.posting = true
            },
            //确认过账
            confirmPosting() {
                console.log("确认反过账")
            }
        }
    }
</script>
<style>
    .voucher .editconfirm .vux-tab{
        background-color: rgb(245,245,245) !important;
    }
    .voucher .editconfirm .weui-dialog__bd{
        padding: 0;
    }
    .voucher .editconfirm .weui-dialog__bd .vux-datetime p{
        color: black;
        font-size: 14px;
    }
    .voucher .editconfirm .weui-dialog__title{
        font-size: 16px;
    }
    .voucher .editconfirm .vux-cell-placeholder{
        font-size: 14px;
    }
    .voucher .editconfirm .weui-dialog__btn{
        font-size: 16px;
    }
    .voucher .editconfirm .vux-datetime p:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 75px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .voucher{
        height calc(100% - 50px)
    }
    .searchContainer{
        background-color: #F7F8F9;
        padding: 10px 15px;
        .Top-bar{
            position relative
            height 30px
            width 100%
            .goback{
                position absolute
                top: 50%
                transform translateY(-50%)
                i{
                    font-size 20px
                    font-weight bold
                }
            }
            .cancel-icon{
                position absolute
                top: 50%
                transform translateY(-50%)
                font-size: 14px;
                span{
                    color: #BDBDBD;
                }
            }
            .inputSpan{
                position: absolute;
                left: 40px;
                right:90px;
                top 50%
                transform translateY(-50%)
                .inputForm{
                    width:100% ;
                    padding: 4px 20px 4px 28px !important;
                    margin-left: 5px;
                    font-size: 16px !important;
                    background: url(../../../../../static/images/search.png) center left no-repeat;
                    background-size: 16px 16px;
                    background-position-x: 7px;
                    background-color: white;
                    border-radius: 8px !important
                }
            }
            .confirm-icon{
                position: absolute;
                top 50%
                transform translateY(-50%)
                right: 5px;
                font-size: 16px;
                .confirmInput{
                    color #40affc
                    font-size 14px
                    text-decoration:none;
                }
            }
        }
    }
    input::-webkit-input-placeholder{
        color: #707070 ;
        font-size 14px
        font-family italic
    }
    #confirm-search{
        right 40px
    }
    .inputForm:focus{
        outline none !important
    }
    .screen{
        color: #ff8000 !important ;
    }

</style>

