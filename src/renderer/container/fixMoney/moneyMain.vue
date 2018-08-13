<template>
    <div class="outWrapperMoney">
        <ZingHead :title="title">
            <div slot="header-right">
               <span class="help" @click="help()">帮助</span>
            </div>
        </ZingHead>
        <scroll :observeDOM="true">
            <div class="basic-content">
                <div v-show="basic">
                    <!--<div class="title">-->
                        <!--<div>基础设置</div>-->
                    <!--</div>-->
                    <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                        <grid-item v-for="(item, index) in menuData" :key="index" :label="item.name">
                            <avatar :size="'normal'" slot="icon" :icon="item.icon" shape="square" :style="{background: item.color}" @click.native="gotoChildPage(item.link)"></avatar>
                        </grid-item>
                    </grid>
                </div>
                <div v-show="normal">
                    <!--<div class="title">-->
                        <!--<div>日常处理</div>-->
                    <!--</div>-->
                    <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                        <grid-item v-for="(item, index) in menuData1" :key="index" :label="item.name">
                            <avatar :size="'normal'" slot="icon" :icon="item.icon" shape="square" :style="{background: item.color}" @click.native="gotoChildPage(item.link)"></avatar>
                        </grid-item>
                    </grid>
                </div>

            </div>
        </scroll>
    </div>
</template>

<script>
    import { Grid, GridItem } from "vux";
    import Avatar from "components/avatar/Avatar";
    import ZingHead from "components/zingHead/ZingHead.vue";
    import Scroll from "components/scroll/Scroll";
    export default {
        name: "money-main",
        components:{
            Grid,
            GridItem,
            Avatar,
            ZingHead,
            Scroll
        },
        data () {
            return {
                title:"基础设置",
                menuData: [
                    {
                        name: "初始参数",
                        link: "/fixMoneyMain/initParam",
                        icon: "msnui-asset-conf",
                        color: "#D81E06",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "资产类别",
                        link: "/fixMoneyMain/assetType",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "变动方式",
                        link: "/fixMoneyMain/changeStyle",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "使用状态",
                        link: "/fixMoneyMain/useState",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "存放地点",
                        link: "/fixMoneyMain/placeStorage",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "折旧方法",
                        link: "/fixMoneyMain/depreciation",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                ],
                menuData1:[
                    {
                        name: "资产管理",
                        link: "/fixMoneyMain/assetManage?companyId=" + this.$route.query.companyId,
                        icon: "gudingzichan",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "资产生成凭证",
                        link: "/fixMoneyMain/voucher?companyId=" + this.$route.query.companyId,
                        icon: "shengchengpingzheng",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "工作量管理",
                        link: "/fixMoneyMain/workManage",
                        icon: "pandian",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "计提折旧",
                        link: "/fixMoneyMain/depreciat",
                        icon: "zhejiu",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "折旧管理",
                        link: "/fixMoneyMain/discountManage",
                        icon: "pandian",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "工作量查询",
                        link: "/fixMoneyMain/workQuery",
                        icon: "pingjuchaxun",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "自动对账",
                        link: "/fixMoneyMain/autoAccount",
                        icon: "caiwubaobiao",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    // {
                    //     name: "凭证管理",
                    //     link: "/fixMoneyMain/voucherManage",
                    //     icon: "pingzhengguanli",
                    //     color: "#40AFFC",
                    //     role: ["admin", "editor"]
                    // },
                ],
                normal:true,
                basic:true
            }
        },
        created() {
            if (this.$route.query.Type === "basic") {
                this.basic = true
                this.normal = false
                this.title = "基础设置"
            } else if (this.$route.query.Type === "normal") {
                this.basic = false
                this.normal = true
                this.title = "日常处理"
            }
        },
        methods:{
            gotoChildPage(val) {
                this.$router.push({ path: val });
            },
            help() {
                this.$router.push({
                    path:"/fixMoneyMain/helpMe",
                    query:{

                    }
                })
            }
        }
    }
</script>
<style>
    .outWrapperMoney  .weui-grid:before {
        box-sizing: content-box;
    }
    .outWrapperMoney .weui-grid__icon{
        width: 38px !important;
        height: 38px !important;
    }
    .outWrapperMoney .ei-avatar-normal {
        width: 38px !important;
        height: 38px !important;
    }
    .outWrapperMoney .weui-grids .iconfont {
        font-size: 28px !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .help{
        margin-right 13px
    }
    .outWrapperMoney {
        height: calc(100% - 50px);
        .basic-content {
            height: 100%;
            overflow: hidden;
            .title {
                flex-center(row, space-between, center);
                padding: 10px 20px;
            }
        }
        .weui-grid:before {
            border: none;
        }
        .weui-grid:after {
            border: none;
        }
    }

</style>
