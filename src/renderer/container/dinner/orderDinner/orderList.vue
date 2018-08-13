<template>
    <div class="resource">
        <zing-head :title="title"></zing-head>
        <tab v-model="index">
            <tab-item class="vux-center" v-for="(item, index) in tabList" :key="index"
                      @on-item-click="switchTab(item)">{{item}}
            </tab-item>
        </tab>
        <div class="scroll-list-wrap" :style="{ height: screenHeight  + 'px',overflow:'auto' }">
            <!--<scroll ref="scroll" :scrollbar="true" :data="[]" :startY="0" :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }">-->
                <ul v-if="historyList.length > 0">
                    <li v-if="item.orderStatus !== '1'"  v-for="(item,index) in historyList" :key="index" @click="clickTheOrder(item)">
                        <GridCard>
                            <div slot="cardLeft" class="left">
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">订单号：{{item.dinnerOrderNo}}</p>
                                    <div class="left-wrapper-desc" style="color: red">￥{{item.orderAccounts}}</div>
                                </div>
                            </div>
                        </GridCard>
                    </li>
                </ul>
            <!--</scroll>-->
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { Tab, TabItem, Swiper, SwiperItem } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "orderList",
        components: {
            Scroll, GridCard, ZingHead, Tab, TabItem, Swiper, SwiperItem
        },
        data() {
            return {
                index: 0,
                title: "桌位名称",
                tabList: ["历史订单"],
                deskId:"",
                currentList: [],
                historyList: [],
                activeList: [],
                personNumModal: false,
                currentTab: "",
                screenHeight:0
            };
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.setMode(false)
            })
        },
        beforeRouteLeave (to, from, next) {
            this.setMode(true)
            next()
        },
        created() {
            this.screenHeight = document.documentElement.clientHeight - 144;
            this.parseUrl();
            this.initData();
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            parseUrl() {
                this.deskId = this.$route.query.deskId;
            },
            switchTab(item) {
                if (item === "及时订单") {
                    this.activeList = this.currentList;
                } else {
                    this.activeList = this.historyList;
                }
            },
            initData() {
                let that = this;
                let param = {
                    pageNumber:0,
                    pageSize:1000,
                    deskId:this.deskId,
                };
                let orderListUrl = "/zingbiz/dinner/getDinnerOrderList";
                this.$http
                    .get(orderListUrl, { params :param })
                    .then(res => {
                        if (res.data.success) {
                            console.log(res.data)
                            that.historyList = res.data.data.data;
                            // that.historyList = res.data.data.history;
                            // that.currentList = res.data.data.current;
                            // that.activeList = that.currentList;
                        } else {
                            that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        that.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    });
            },
            clickTheOrder(item) {
                this.$router.push({
                    path: "/dinner/orderDetails",
                    query:{
                        dinnerOrderId:item.dinnerOrderId
                    }

                });

                // if (item.isOnUse) {
                //     this.$router.push({ path: "/dinner/tagManager" });
                // } else {
                //     this.personNumModal = true;
                // }
            },
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
                .iconfont{
                    font-size 36px
                }
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
        }
    }
</style>

