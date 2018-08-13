<!--节点属性页面-->
<template>
    <div class="popupDate-picker" style="height:100%">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head :title="'节点附加属性'" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="scolley-div" style="overflow-y:scroll;">
                        <group label-width="8em" class="main-from">
                            <!-- <check-icon :value.sync="isLinkTask"> {{attributeName}}</check-icon> -->
                            <checklist required :options="attrbuteData" v-model="curCheckAttrbute" ></checklist>
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
        Flexbox,
        FlexboxItem,
        Selector,
        Checklist
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        data() {
            return {
                isLinkTask: false,
                curCheckAttrbute:[],
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
        watch:{
            initSelAttribute () {
                if(!Z_IsEmpty20(this.initSelAttribute)){
                    this.curCheckAttrbute = this.initSelAttribute;
                }
            }
        },
        created() {

        },
        props: {
            showPopupDate: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            attrbuteData:{
                type: Array,
                default: function() {
                    return [];
                }
            },
            initSelAttribute:{
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        methods: {
            submit(data) {
                let selAttrbuteArr = [];
                //获取当前已经选择的属性
                let curSel = this.curCheckAttrbute;
                if(!Z_IsEmpty20(curSel)){
                    for(let i=0;i<curSel.length;i++){
                        let code = curSel[i];
                        for(let k=0;k<this.attrbuteData.length;k++){
                            if(code==this.attrbuteData[k].key){
                                selAttrbuteArr.push(this.attrbuteData[k]);
                            }
                        }
                    }
                }
                data.selAttrbuteArr = selAttrbuteArr;
                this.$emit("submitClick", data);
            },
            cancle(data) {
                this.$emit("cancleclick");
            },
            backClick() {
                this.$emit("backClick");
            }
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

