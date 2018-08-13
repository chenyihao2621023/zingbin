<template>
    <div ref="wrapper" class="list-wrapper">
        <div class="scroll-content">
            <div ref="listWrapper">
                <slot>
                    <!-- <ul class="list-content">
                      <li @click="clickItem($event,item)" class="list-item" v-for="(item, index) in data" :key="index">{{item}}</li>
                    </ul> -->
                </slot>
            </div>
            <slot name="pullup"
                  :pullUpLoad="pullUpLoad"
                  :isPullUpLoad="isPullUpLoad"
            >
                <div class="pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        <span>{{pullUpTxt}}</span>
                    </div>
                    <div class="after-trigger" v-else>
                        <loading></loading>
                    </div>
                </div>
            </slot>
        </div>
        <slot name="pulldown"
              :pullDownRefresh="pullDownRefresh"
              :pullDownStyle="pullDownStyle"
              :beforePullDown="beforePullDown"
              :isPullingDown="isPullingDown"
              :bubbleY="bubbleY"
        >
            <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
                <div class="before-trigger" v-if="beforePullDown">
                    <bubble :y="bubbleY"></bubble>
                </div>
                <div class="after-trigger" v-else>
                    <div v-if="isPullingDown" class="loading">
                        <loading></loading>
                    </div>
                    <div v-else><span>{{refreshTxt}}</span></div>
                </div>
            </div>
        </slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from "better-scroll";
    import { mapState } from "vuex";
    import Loading from "../loading/Loading";
    import Bubble from "../bubble/Bubble";
    import { getRect } from "../../utils/dom.js";

    const COMPONENT_NAME = "scroll";
    const DIRECTION_H = "horizontal";
    const DIRECTION_V = "vertical";

    export default {
        name: COMPONENT_NAME,
        components: {
            Loading,
            Bubble
        },
        props: {
            computeScroll: {
                type: Boolean,
                default: false
            },
            data: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            scrollEnd: {
                type: Boolean,
                default: false
            },
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            listenBeforeScroll: {
                type: Boolean,
                default: false
            },
            direction: {
                type: String,
                default: DIRECTION_V
            },
            scrollbar: {
                type: null,
                default: false
            },
            observeDOM: {
                type: Boolean,
                default: false
            },
            pullDownRefresh: {
                type: null,
                default: false
            },
            pullUpLoad: {
                type: null,
                default: false
            },
            startY: {
                type: Number,
                default: 0
            },
            startX: {
                type: Number,
                default: 0
            },
            refreshDelay: {
                type: Number,
                default: 20
            },
            freeScroll: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                beforePullDown: true,
                isRebounding: false,
                isPullingDown: false,
                isPullUpLoad: false,
                pullUpDirty: true,
                pullDownStyle: "",
                bubbleY: 0,
                time: null,
                preMaxScrollY: 0
            };
        },
        computed: {
            ...mapState({
                isMode: state => state.ui.isMode
            }),
            pullUpTxt() {
                const moreTxt =
                    this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more;

                const noMoreTxt =
                    this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore;

                return this.pullUpDirty ? moreTxt : noMoreTxt;
            },
            refreshTxt() {
                return this.pullDownRefresh && this.pullDownRefresh.txt;
            }
        },
        watch: {
            data: {
                handler() {
                    window.setTimeout(() => {
                        this.forceUpdate(true);
                    }, this.refreshDelay > 100 ? 20 : this.refreshDelay);
                    if (this.scrollEnd) {
                        this.scroll && (this.preMaxScrollY = this.scroll.maxScrollY);
                        clearInterval(this.time);
                        this.time = setInterval(() => {
                            if (this.scroll && this.scroll.maxScrollY !== this.preMaxScrollY) {
                                this.scroll.scrollTo(0, this.scroll.maxScrollY, 0);
                                clearInterval(this.time);
                            }
                        }, 10);
                    }
                },
                immediate: true,
                deep: true
            },
            computeScroll: {
                handler(newval, oldval) {
                    if (typeof oldval === 'undefined' && this.scrollEnd) {
                        window.setTimeout(() => {
                            let elArr = document.querySelectorAll(".list-wrapper .message");
                            this.scrollToElement(elArr[elArr.length - 1]);
                        }, 100);
                    } else if (this.scrollEnd) {
                        let num = 0;
                        clearInterval(this.time);
                        this.time = setInterval(() => {
                            //                            console.log(888)
                            num++;
                            if (num < 31) {
                                this.forceUpdate(true);
                                this.scroll && this.scroll.scrollTo(0, this.scroll.maxScrollY, 0);
                            } else {
                                clearInterval(this.time);
                            }
                        }, 10);
                    }
                },
                immediate: true
            }
        },
        created() {
            this.pullDownInitTop = -50;
        },
        mounted() {
            window.setTimeout(() => {
                this.initScroll();
            }, this.refreshDelay);
            if (this.scrollEnd) {
                // let elArr = document.querySelectorAll('.list-wrapper .message')
                // setTimeout(() => {
                //     // this.scrollToElement(elArr[elArr.length - 1])
                //     this.scroll.scrollTo(0,this.scroll.maxScrollY,0)
                // }, 300)
            }

            this.pullDownStyle = `top:${this.pullDownInitTop}px`;
        },
        methods: {
            initScroll() {
                if (!this.$refs.wrapper) {
                    return;
                }
                if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
                    this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper)
                        .height + 1}px`;
                }
                let options = {
                    probeType: this.probeType,
                    click: this.click,
                    scrollY: this.freeScroll || this.direction === DIRECTION_V,
                    scrollX: this.freeScroll || this.direction === DIRECTION_H,
                    scrollbar: this.scrollbar,
                    pullDownRefresh: this.pullDownRefresh,
                    pullUpLoad: this.pullUpLoad,
                    startY: this.startY,
                    startX: this.startX,
                    freeScroll: this.freeScroll,
                    observeDOM: this.observeDOM
                };

                // 多次初始化，销毁旧实例
                if (this.scroll) this.scroll.destroy()

                this.scroll = new BScroll(this.$refs.wrapper, options);
                if (this.listenScroll) {
                    this.scroll.on("scroll", pos => {
                        this.$emit("scroll", pos);
                    });
                }
                if (this.listenScroll) { //scrollTo(0, 500)
                    this.$emit("scrollTo", this.scroll);
                }
                if (this.listenBeforeScroll) {
                    this.scroll.on("beforeScrollStart", () => {
                        this.$emit("beforeScrollStart");
                    });
                }

                if (this.pullDownRefresh) {
                    this._initPullDownRefresh();
                }

                if (this.pullUpLoad) {
                    this._initPullUpLoad();
                }
            },
            disable() {
                this.scroll && this.scroll.disable();
            },
            enable() {
                this.scroll && this.scroll.enable();
            },
            refresh() {
                this.scroll && this.scroll.refresh();
            },
            scrollTo() {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
            },
            scrollToElement() {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
            },
            clickItem(e, item) {
                this.$emit("click", item);
            },
            destroy() {
                this.scroll.destroy();
            },
            forceUpdate(dirty) {
                if (this.pullDownRefresh && this.isPullingDown) {
                    this.isPullingDown = false;
                    this._reboundPullDown().then(() => {
                        this._afterPullDown();
                    });
                } else if (this.pullUpLoad && this.isPullUpLoad) {
                    this.isPullUpLoad = false;
                    this.scroll.finishPullUp();
                    this.pullUpDirty = dirty;
                    this.refresh();
                } else {
                    this.refresh();
                }
            },
            _initPullDownRefresh() {
                this.scroll.on("pullingDown", () => {
                    this.beforePullDown = false;
                    this.isPullingDown = true;
                    this.$emit("pullingDown");
                });

                this.scroll.on("scroll", pos => {
                    if (this.beforePullDown) {
                        this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
                        this.pullDownStyle = `top:${Math.min(
                            pos.y + this.pullDownInitTop,
                            10
                        )}px`;
                    } else {
                        this.bubbleY = 0;
                    }

                    if (this.isRebounding) {
                        this.pullDownStyle = `top:${10 -
                        (this.pullDownRefresh.stop - pos.y)}px`;
                    }
                });
            },
            _initPullUpLoad() {
                this.scroll.on("pullingUp", () => {
                    this.isPullUpLoad = true;
                    this.$emit("pullingUp");
                });
            },
            _reboundPullDown() {
                const {stopTime = 600} = this.pullDownRefresh;
                return new Promise(resolve => {
                    window.setTimeout(() => {
                        this.isRebounding = true;
                        this.scroll.finishPullDown();
                        resolve();
                    }, stopTime);
                });
            },
            _afterPullDown() {
                window.setTimeout(() => {
                    this.pullDownStyle = `top:${this.pullDownInitTop}px`;
                    this.beforePullDown = true;
                    this.isRebounding = false;
                    this.refresh();
                }, this.scroll.options.bounceTime);
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .list-wrapper {
        position: relative;
        height: 100%;
        /* position: absolute */
        /* left: 0 */
        /* top: 0 */
        /* right: 0 */
        /* bottom: 0 */
        width: 100%;
        overflow: hidden;

        /* * 背景色在各自页面实现 * */
        /* background: #fff */
        .bscroll-vertical-scrollbar {
            .bscroll-indicator {
                background-color: #b0b0b0 !important;
                border: none !important;
            }
        }

        .scroll-content {
            position: relative;
            display: inline-block;
            min-width: 100%;
            /* height : 100% */
            z-index: 1;
        }

        .list-content {
            position: relative;
            z-index: 10;
            background: #fff;

            .list-item {
                height: 60px;
                line-height: 60px;
                font-size: 18px;
                padding-left: 20px;
                border-bottom: 1px solid #e5e5e5;
            }
        }
    }

    .pulldown-wrapper {
        position: absolute;
        width: 100%;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all;

        .after-trigger {
            margin-top: 10px;
        }
    }

    .pullup-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
    }
</style>
