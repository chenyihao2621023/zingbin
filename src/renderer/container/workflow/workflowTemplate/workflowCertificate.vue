<!--节点属性页面-->
<template>
    <div class="popupDate-picker" style="height:100%">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head :title="certificateTitle" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="scolley-div" style="overflow-y:scroll;">
                        <group label-width="8em" class="main-from" style="overflow-y: scroll;">
                            <checklist required :options="commonList" v-model="checkItem" @on-change="change"></checklist>
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
    import {
        XTextarea,
        Popup,
        XInput,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        Selector,
        Checklist
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        data() {
            return {
                checkItem: []
            };
        },
        components: {
            Selector,
            Group,
            XTextarea,
            XInput,
            XButton,
            Flexbox,
            FlexboxItem,
            ZingHead,
            Popup,
            Checklist
        },
        created() {},
        props: {
            showPopupDate: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            checkItem:{
                type: Array,
                default:function(){
                    return [];
                }
            },
            commonList: {
                type: Array,
                default: function() {
                    return false;
                }
            },
            certificateTitle: {
                type: String,
                default: function() {
                    return "";
                }
            }
        },
        methods: {
            submit(data) {
                this.$emit("submitClick", data);
            },
            cancle(data) {
                console.info("xujiadnsbf");
                this.$emit("cancleClick");
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
        height: 450px;
        /* height: auto !important; */
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

