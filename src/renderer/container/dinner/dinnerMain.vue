<template>
    <div class="resource">
        <zing-head :title="'餐饮管理'"></zing-head>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoDesk">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">桌位管理</p>
                </div>
            </div>
        </GridCard>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoPrinter">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">打印机管理</p>
                </div>
            </div>
        </GridCard>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoClazzManage">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">分类管理</p>
                </div>
            </div>
        </GridCard>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoVegetable">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">菜品管理</p>
                </div>
            </div>
        </GridCard>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoTag">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">标签管理</p>
                </div>
            </div>
        </GridCard>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoOrder">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">点菜及账单</p>
                </div>
            </div>
        </GridCard>
    </div>
</template>

<script>
    import { Selector, Search, Group, XDialog } from "vux";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";

    export default {
        name: "dinner",
        components: {
            GridCard, ZingHead, Selector, Search, Group, XDialog
        },
        data: () => ({}),
        created() { //

        },
        methods: {
            gotoDesk() { //桌位管理
                this.$router.push({ path: "/dinner/deskManager" });
            },
            gotoPrinter() { //打印机管理
                this.$router.push({ path: "/dinner/printerManager" });
            },
            gotoTag() { //标签管理
                this.$router.push({ path: "/dinner/tagManager" });
            },
            gotoVegetable() { //菜品管理
                this.$router.push({ path: "/dinner/dinnerManage" });
            },
            gotoOrder() { //点菜及订单
                this.$router.push({ path: "/dinner/deskList" });
            },
            gotoClazzManage() {
                this.$router.push({ path: "/dinner/dinnerClazz" });
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .resource {
        height: 100%;

        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;

            .left {
                flex: 1;
                flex-center(row, start, center);

                &-wrapper {
                    margin-left: 10px;
                    flex: 1;

                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }

                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }

            .right {
                flex: 1;
                text-align: right;

                .tag-wrapper {
                    margin-top: 10px;

                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }

            .classifi-left {
                &-name {
                    margin-bottom: 10px;
                }

                &-tag-wrapper {
                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }

            .classifi-right {
                align-self: flex-start;
            }
            .edit {
                min-height: 40px;
                line-height: 40px;
            }
            .no-data-style {
                color: #ff8000;
                font-size: 18px;
                padding-top: 15px;
                min-height: 100px;
                text-align: center
            }
        }
    }
</style>

