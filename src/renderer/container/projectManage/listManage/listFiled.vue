<!--list已归档任务列表-->
<template>
    <div class="class-setter" v-transfer-dom>
        <popup v-model="showFlied" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="subject-picker-popup">
                <zing-head class="subject-picker-head" :title="'归档列表'" :isComeBack="false" @doSome="backClick">
                    <div slot="header-right">
                        <span class="header-search">
                           <i class="iconfont icon-fangdajing" @click="task_search"></i>
                        </span>
                    </div>
                </zing-head>
                <!--搜索-->
                <!--<div v-show="isShow">-->
                    <!--<search-->
                        <!--class="search"-->
                        <!--@on-cancel="onCancel"-->
                        <!--@on-change="getResult"-->
                        <!--@on-submit="onSubmit"-->
                        <!--ref="search">-->
                    <!--</search>-->
                <!--</div>-->
                <tab v-model="index" class="vue-tab" active-color="#ff8000" height="300px" :show-dots="false">
                    <tab-item class="vux-center" @on-item-click="onTabClick">任务</tab-item>
                    <tab-item class="vux-center" @on-item-click="onTabClick">子任务</tab-item>
                </tab>
                <div class="warning" v-show="flag">
                    暂无数据
                </div>
                <div v-show="currentTab === 'showTask'">
                    <GridCard class="list"
                              v-for="(cards,index) in filedCards" :key="index"
                              style="background-color: white">
                        <div class="list-left" slot="cardLeft">
                            <div class="list-left- name">{{cards.title}}</div>
                        </div>
                        <div class="list-right" slot="cardRight">
                            <div class="list-right-name">
                                <x-button mini :text="submit001"
                                          @click.native="processButton001(cards)"
                                          type="primary" style="background-color: #3a8ee6">
                                </x-button>
                                <x-button mini :text="submit002"
                                          @click.native="processButton002(cards)"
                                          type="primary">
                                </x-button>
                            </div>
                        </div>
                    </GridCard>
                </div>
                <div v-show="currentTab === 'showListtask'">
                    <GridCard class="list"
                              v-for="(list,index) in filedlist" :key="index"
                              style="background-color: white">
                        <div class="list-left" slot="cardLeft">
                            <div class="list-left-name">{{list.title}}</div>
                        </div>
                        <div class="list-right" slot="cardRight">
                            <div class="list-right-name">
                                <x-button mini :text="submit001"
                                          @click.native="processButton003(list)"
                                          type="primary" style="background-color: #3a8ee6">
                                </x-button>
                                <x-button mini :text="submit002"
                                          @click.native="processButton004"
                                          type="primary">
                                </x-button>
                            </div>
                        </div>
                    </GridCard>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import {
        Flexbox,
        FlexboxItem,
        Checklist,
        Tab,
        TabItem,
        Popup,
        TransferDomDirective as TransferDom,
        XButton
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import Scroll from "@/components/scroll/Scroll";

    import _ from "lodash";
    export default {
        name: "manageClassSetter",
        components: {
            Flexbox,
            FlexboxItem,
            Checklist,
            Scroll,
            GridCard,
            Tab,
            TabItem,
            Popup,
            XButton,
            ZingHead,
        },
        directives: {
            TransferDom
        },
        props: {
            showFlied: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            //fu
            taskboardId:{ type: String },
            taskRouting:{ type: String },
         },
        data() {
            return {
                index: 0,
                currentTab: "showTask",
                showEdit:false,
                submit001: '取消归档',
                submit002:'删除',
                showTask:[],//任务
                showListtask:[],//子任务列表
                filedlist:[],//已归档子任务列表
                filedCards:[],//已归档任务列表
                flag:false,//暂无数据
            };
        },
        watch: {
            showFlied(isShown) {
               if (isShown){
                   this._getloadLists()
                   this._getCards()
               }
            }
        },
        methods: {
            //_getloadLists请求
             _getloadLists() {
                let url = "/ZingMH/ZDesk/list/mater/loadLists.action"
                let params = {
                    boardId:this.taskboardId,
                    routing:this.taskRouting,
                    status:'end'
                }
                this.$http.get( url,{ params:params })
                    .then(res => {
                        if ( res.data.total === '0') {
                            this.flag = true
                        } else {
                            this.filedlist = res.data.data
                            this.flag = false
                        }
                    })
                    .catch(err => {
                    console.log(err)
                })
            },
            // _getCards()
            _getCards() {
                let url = "/ZingMH/ZDesk/card/mater/loadCards.action"
                let params = {
                    boardId:this.taskboardId,
                    routing:this.taskRouting,
                    status:'end'
                }
                this.$http.get(url,{ params:params })
                    .then(res => {
                        if ( res.data.total === '0') {
                            this.flag = true
                        } else {
                            this.filedCards = res.data.data
                            this.flag = false
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            //按钮
            processButton001 (cards) {
               let _vm = this
                this.$vux.confirm.show({
                    title: "你确定要取消归档吗?",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
                        _vm.$http.get(url,{ params:{ cardId:cards.cardId,routing:cards.routing,status:'start' }})
                            .then(res => {
                              setTimeout(() => {
                                  _vm._getCards()
                              },2000)
                                _vm.$vux.toast.show({text: "取消归档成功！", type: "success"});
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    }
                })
            },
            processButton002(cards) {
               let vm = this
                this.$vux.confirm.show({
                    title: "你确定要删除吗?",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/deleteCard.action"
                        vm.$http.get(url,{ params:{cardId:cards.cardId,routing:cards.routing } })
                            .then(res => {
                                setTimeout(() => {
                                    vm._getCards()
                                },2000)
                                vm.$vux.toast.show({text: "删除成功！", type: "success"});
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    },
                })
            },
            processButton003 (list) {
                let that = this;
                this.$vux.confirm.show({
                    title: "你确定要取消归档吗?",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/list/mater/updateList.action"
                        let params = {
                        listId: list.listId,
                        status:'start',
                        routing:list.routing,
                        }
                        that.$http.get(url,{ params:params })
                            .then(res => {
                               that._getloadLists()
                               that.$vux.toast.show({text: "取消归档成功！", type: "success"});
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
            },
            processButton004() {
                this.$vux.confirm.show({
                    title: "你确定要删除吗?",
                    onCancel() {
                    },
                    onConfirm() {
//                        let url = " /ZingMH/ZDesk/list/mater/updateList.action"
//                        let params = {
//                            boardId:this.taskboardId,
//                            routing:this.taskRouting,
//                            status:'start'
//                        }
//                        this.$http.get( url,{ params:params })
//                            .then(res => {
////                       console.log()
//                            })
//                            .catch(err => {
//                                console.log(err)
//                            })
//                        this.$vux.toast.show({text: "删除成功！", type: "success"});
                    }
                })
            },

            //头部搜索
            task_search() {
                this.isShow = !this.isShow;
            },
            //tab切换
            onTabClick(index) {
                if (index === 0) {
                    this.currentTab = "showTask";
                } else if (index === 1) {
                    this.currentTab = "showListtask";
                }
            },
            checkFiled() {
                let filed = {

                };
                this.$emit("checkFiled", filed);
            },
            backClick() {
                this.$emit("abort");
            },
        }
    };
</script>

<style lang="stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .class-setter {
        .subject-picker-popup {
            height: 100%;
            background-color white
            .content {
                display: flex;
                height: calc(100% - 95px);
                flex-flow: row wrap;
                width: 100%;
                background-color: white;
                .variable {
                    width: 100%;
                    height: calc(100% -50px);
                    align-self: flex-start;
                    overflow: auto;
                }

                .bottom {
                    width: 100%;
                    height: 50px;
                    align-self: flex-end;
                }
            }
        }

        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;
        }
        .warning{
            text-align: center;
            font-size: 16px;
            color: #ff8000;
            padding-top: 15px;
        }
    }
</style>
