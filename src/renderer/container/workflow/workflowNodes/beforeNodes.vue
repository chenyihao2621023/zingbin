<!--前序节点页面-->
<template>
    <div class="popupDate-picker" style="height:100%">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head :title="'前序节点'" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="scolley-div" style="overflow-y:scroll;">
                        <group label-width="8em" class="main-from">
                            <!--<x-textarea title="节点描述: "  placeholder="">
                            </x-textarea>-->
                            <div style="height:500px;overflow-y: auto;overflow-x: hidden;padding-right:10px;" v-if="showbefore">
                                <div style="color: #ff8000;font-size:16px;text-align:left;padding:15px">无可选节点！<br>注：
                                    <br>1.不可设置当前顺序号之后的节点
                                    <br>2.如看到审批流分配者节点，为系统内置，不可设为前序节点。</div>
                            </div>
                            <div class="scroll-list-wrap" v-else>
                                <!-- {{beforeData}} -->
                                <group label-width="8em" class="main-from">
                                    <!-- <check-icon :value.sync="isLinkTask"> {{attributeName}}</check-icon> -->
                                    <checklist required :options="beforeData" v-model="checkItem"   @on-change="change"></checklist>
                                </group>
                                <!-- <div v-for="(item,index) in beforeData" :key="index">
                                    <GridCard>
                                        <div slot="cardLeft" class="left">
                                            <div class="left-wrapper">
                                                <p class="left-wrapper-title">{{index + 1}}:{{item.stepName}}</p>
                                            </div>
                                        </div>
                                    </GridCard>
                                </div> -->
                            </div>

                        </group>
                        <group>
                            <flexbox :gutter="0" class="main-footer">
                                <flexbox-item>
                                    <x-button class="btn-save" type="primary" @click.native="submit">提交</x-button>
                                </flexbox-item>
                                <flexbox-item>
                                    <x-button @click.native="cancle"  style="color: rgb(255, 255, 255);background-color: #ff8000;">取消</x-button>
                                </flexbox-item>
                            </flexbox>
                        </group>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import { Z_IsEmpty20 } from "@/utils/fn";
    import {
        XTextarea,
        Popup,
        XInput,
        Group,
        XButton,
        Checklist,
        Flexbox,
        FlexboxItem,
        Selector
    } from "vux";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        data() {
            return {
                screenHeight: 0,
                checkItem:[]
            };
        },
        components: {
            Selector,
            Checklist,
            Group,
            XTextarea,
            XInput,
            XButton,
            Flexbox,
            GridCard,
            FlexboxItem,
            ZingHead,
            Popup
        },
        watch:{
            initSel () {
                if(!Z_IsEmpty20(this.initSel)){
                    this.checkItem = this.initSel;
                }
            }
        },
        created() {},
        props: {
            showPopupDate: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            beforeData: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            showbefore: {
                type: Boolean,
                default: function() {
                    return "";
                }
            },
            initSel:{
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        methods: {
            submit(data) {
                data.curSelRelationNode = this.checkItem;
                this.$emit("submitClick", data);
            },
            cancle(data) {
                this.$emit("cancleclick");
            },
            backClick() {
                this.$emit("backClick");
            },
            change(val, label) {
                console.log("change", val, label);
                this.$emit("change", val, label);
            },

        }
    };
</script>
<style lang= 'less' scoped>
    .root-div {
    /deep/ .main-from {
        min-height: 450px;
        height: auto !important;
    }
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    /*background: #fbf9fe;*/
    z-index: 999;
    }
    .main-footer {
        padding: 15px;
    }
</style>

