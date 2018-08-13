<template>
    <div class="outWrapperMoney">
        <ZingHead :title="title">
            <div slot="header-right">

            </div>
        </ZingHead>
        <scroll :observeDOM="true">
            <div class="basic-content">
                <div>
                    <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                        <grid-item v-for="(item, index) in menuData" :key="index" :label="item.name">
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
                title:"现金流量",
                menuData: [
                    {
                        name: "核算项目",
                        link: "/report/hesuanxiangmu",
                        icon: "hesuankemuleixing1",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "T型账户",
                        link: "/report/txingzhanghu",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "附表项目",
                        link: "/report/fubiaoxiangmu",
                        icon: "leibie",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },
                    {
                        name: "现金流量查询",
                        link: "/report/xianjinliuliangchaxun",
                        icon: "pingjuchaxun",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },{
                        name: "现金流量表",
                        link: "/report/xianjinliuliangbiao",
                        icon: "xianjinliuliangbiao1",
                        color: "#40AFFC",
                        role: ["admin", "editor"]
                    },

                ],
            }
        },
        created() {

        },
        methods:{
            gotoChildPage(val) {
                console.info(val)
                this.$router.push({ path: val });
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
