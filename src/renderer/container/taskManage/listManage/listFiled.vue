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
                <!--任务-->
                <div v-show="currentTab === 'showTask'">
                    <div class="warning" v-if="filedCards.length<=0">暂无数据</div>
                    <scroll ref="scroll" :scrollbar="true" :listenScroll="true">
                       <GridCard class="list"
                              v-for="(cards,index) in filedCards" :key="index"
                              style="background-color: white;">
                        <div class="list-left" slot="cardLeft">
                            <div class="list-left- name">{{cards.title}}</div>
                        </div>
                        <div class="list-right" slot="cardRight">
                            <div class="list-right-name">
                                <x-button mini :text="submit001"
                                          @click.native="processButton001(cards)"
                                          type="primary" style="background-color: #3a8ee6;margin-right: 5px">
                                </x-button>
                                <x-button mini :text="submit002"
                                          @click.native="processButton002(cards)"
                                          type="primary">
                                </x-button>
                            </div>
                        </div>
                    </GridCard>
                    </scroll>
                </div>
                <!--子任务-->
                <div v-show="currentTab === 'showListtask'">
                    <div class="warning" v-if="filedlist.length<=0">暂无数据</div>
                    <scroll ref="scroll" :scrollbar="true" :listenScroll="true">
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
                                          type="primary" style="background-color: #3a8ee6;margin-right: 5px">
                                </x-button>
                                <x-button mini :text="submit002"
                                          @click.native="processButton004"
                                          type="primary">
                                </x-button>
                            </div>
                        </div>
                    </GridCard>
                    </scroll>
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
                            this.filedlist = res.data.data
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
                            this.filedCards = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            //按钮
            processButton001 (cards) {
               let _vm = this
                this.$vux.confirm.show({
                    title: "提示",
                    content: "是否取消归档此任务",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
                        _vm.$http.get(url,{ params:{ cardId:cards.cardId,routing:cards.routing,status:'start' }})
                            .then(res => {
                              setTimeout(() => {
                                  _vm._getCards()
                              },2000)
                                _vm.$vux.toast.show({text: "取消归档成功", type: "success"});
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
                    title: "提示?",
                    content: "是否删除此任务",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/deleteCard.action"
                        vm.$http.get(url,{ params:{cardId:cards.cardId,routing:cards.routing } })
                            .then(res => {
                                setTimeout(() => {
                                    vm._getCards()
                                },2000)
                                vm.$vux.toast.show({text: "删除成功", type: "success"});
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
                    title: "提示",
                    content: "是否取消归档该子任务",
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
                               that.$vux.toast.show({text: "取消归档成功", type: "success"});
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
            },
            processButton004() {
                this.$vux.confirm.show({
                    title: "提示",
                    content: "是否删除此子任务",
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
//                        this.$vux.toast.show({text: "删除成功", type: "success"});
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
            .list {
                display: flex;
                height: 50px
                line-height 50px
                flex-flow: row wrap;
                width: 100%;
                background-color: white;
                .list-left {
                   width 50%
                   .name,.list-left-name {
                       width 100%
                       overflow hidden
                       white-space nowrap
                       text-overflow ellipsis
                   }
                }
                .list-right {
                   width 45%
                }
            }
        }
        .warning{
            text-align: center;
            font-size: 16px;
            color: #ff8000;
            padding-top: 15px;
        }
    }
</style>
