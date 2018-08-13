<template>
    <div class="popupDate-picker">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <ZingHead :title="modelTitle" :isComeBack="false" @doSome="backClick">
                    </ZingHead>
                    <div class="scolley-div" style="overflow-y:scroll;" :data="getFormData">
                        <group label-align="left" label-width="7.5em" class="main-from" label="16px">
                            <x-input title="分类名称: " v-model="getFormData.categoryName" placeholder="" required>
                            </x-input>
                            <x-input title="顺序号(1~999):"
                                     v-model="getFormData.serialNumberForType"
                                     :min="1" :max="999" type="number"
                                     keyboard="number" required placeholder="请输入数字"></x-input>
                            <selector title="所属功能模块: " :options="moduleType" v-model="getFormData.moduleType" required placeholder="">
                            </selector>
                        </group>
                        <group>
                            <flexbox :gutter="0" class="main-footer">
                                <flexbox-item>
                                    <x-button class="btn-save" type="primary" @click.native="submit(getFormData)">提交</x-button>
                                </flexbox-item>
                                <flexbox-item>
                                    <x-button  @click.native="cancle" style="color: rgb(255, 255, 255);background-color: #ff8000;">取消</x-button>
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
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        XInput,
        Selector,
        Popup,
        TransferDomDirective as TransferDom
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    export default {
        components: {
            GridCard,
            Popup,
            ZingHead,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            Group,
            XButton
        },
        data() {
            return {
                screenHeight: 0,
                moduleType: [
                    {
                        key: "",
                        value: "请选择"
                    },
                    {
                        key: "typeForPuTongShenPi",
                        value: "普通审批"
                    },
                    {
                        key: "TYPE_HR_QJ",
                        value: "请假"
                    },
                    {
                        key: "MODULE_TYPE_ZYK",
                        value: "凭证"
                    },
                    {
                        key: "MODULE_TYPE_HR_XZTZ",
                        value: "薪资调整"
                    },
                    {
                        key: "MT_GDZC",
                        value: "固定资产"
                    }
                ]
            };
        },
        props: {
            showPopupDate: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            modelTitle: {
                type: String,
                default: function() {
                    return "";
                }
            },
            getFormData: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        methods: {
            submit(data) {
                this.$emit("submitClick", data);
            },
            cancle(data) {
                this.$emit("cancleclick");
            },
            backClick() {
                this.$emit("backClick");
            }
        },
        created() {
            // this.initSelData = "TYPE_HR_QJ"
        }
    };
</script>
<style lang= 'less' scoped>
    .main-from {
        height: 450px;
        /*height:auto!important; */
    }
    .weui-cell {
    /deep/ label {
        font-size: 16px;
    }
    }
    .main-footer {
        padding: 15px;
    }
    .main-footer {
    /deep/ .weui-btn_default {
        color: #ff8000;
    }
    }
</style>
