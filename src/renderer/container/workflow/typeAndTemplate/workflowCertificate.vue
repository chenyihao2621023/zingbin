<!--节点属性页面-->
<template>
    <div class="popupDate-picker" v-transfer-dom>
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <zing-head :title="certificateTitle" :isComeBack="false" @doSome="backClick"></zing-head>
                <div class="selPopup">
                    <checklist required :options="commonList" v-model="checkItem" @on-change="change"></checklist>

                </div>
                <flexbox>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button @click.native="cancle" class="btn-save" type="primary" >取消</x-button>
                    </flexbox-item>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button @click.native="submit" style="color: rgb(255, 255, 255);background-color: #ff8000;">提交</x-button>
                    </flexbox-item>
                </flexbox>
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
        Checklist,
        TransferDomDirective as TransferDom
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "selPopup",
        data() {
            return {
                checkItem: []
            };
        },
        directives: {
            TransferDom
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
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .popupDate-picker {
    .vux-popup-dialog {
        z-index: 850;
    }

    .popupDate-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .selPopup {
        height: 84%;
        overflow-y: scroll;
    }
</style>

