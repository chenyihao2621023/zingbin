<template>
    <div class="typeForm-picker" v-transfer-dom>
        <popup v-model="showPopupTypeForm"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="typeForm-picker-popup">
                <zing-head class="typeForm-picker-head"
                           title=""
                           :isComeBack="false"
                           @doSome="backClick">
                </zing-head>
                <div class="typeForm">

                    <group label-align="left" label-width="7.5em" class="main-from" label="16px">
                        <x-input title="分类名称：" v-model="formParams.categoryName" placeholder="" placeholder="请输入分类名称">
                        </x-input>
                        <selector title="所属功能模块：" :options="moduleType" v-model="formParams.moduleType" placeholder="">
                        </selector>
                        <x-switch title="启用/禁用："
                                  :value-map="['禁用', '启用']"
                                  v-model="formParams.isDeleteForType"
                        ></x-switch>

                    </group>

                    <div style="display: flex;position: absolute;z-index: 500;bottom: 0px;width: 100%;background-color: #f7f7fa;">

                        <flexbox :gutter="0" class="main-footer">
                            <flexbox-item>
                                <x-button @click.native="cancle" class="btn-save">取消</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button style="color: rgb(255, 255, 255);background-color: #ff8000;" type="primary" @click.native="submit(formParams)">提交</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </div>

            </div>

        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import GridCard from "@/components/gridcard/GridCard";

    import {
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        XInput,
        Selector,
        XSwitch,
        Popup,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "typeForm",
        components: {
            GridCard,
            Popup,
            ZingHead,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            Group,
            XButton,
            XSwitch
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                screenHeight: 0,
                moduleType: [
                    {
                        key: "qxz",
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
                ],
                formParams:{
                    categoryName:'',
                    serialNumberForType:'',
                    moduleType:'',
                    isDeleteForType:"启用",
                }
            }
        },
        props:{
            showPopupTypeForm: {
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
            formData:{
                type: Object,
                default:function(){
                    return {};
                }
            }
        },
        watch: {
            formData(){
                //渲染表单数据
                for(let key in this.formData){
                    if(this.formParams.hasOwnProperty(key)){
                        this.formParams[key] = this.formData[key];
                    }
                }
            }
        },
        created() {
            //渲染表单数据
            for(let key in this.formData){
                if(this.formParams.hasOwnProperty(key)){
                    this.formParams[key] = this.formData[key];
                }
            }
        },
        methods: {
            submit(data) {
                //验证表单内容
                let vm = this;
                let url = "";
                let params = {};
                //根据是否传入表单数据中分类id判断你是更新还是提交
                if (vm.formData.categoryId != undefined && vm.formData.categoryId != "") {
                    vm.formParams.categoryId =vm.formData.categoryId;
                    url = "/zingbiz/workflow/typeAndTemplate/updateOneType";
                } else {
                    //处理分类顺序
                    url = "/zingbiz/workflow/typeAndTemplate/addOneType";
                    delete vm.formParams.categoryId;
                }
                if (vm.formParams.categoryName === undefined || vm.formParams.categoryName === "") {
                    vm.$vux.toast.text("请输入审批流分类名称",'top');
                    return;
                }
                if (vm.formParams.moduleType === undefined || vm.formParams.moduleType === "" || vm.formParams.moduleType === "qxz") {
                    vm.$vux.toast.text("请选择所属功能模块",'top');
                    return;
                }

                vm.$http.post(url, vm.formParams).then(res => {
                    if (res.data.success === "true") {
                    this.$emit("reload");
                    vm.$vux.toast.text("操作成功！",'top');

                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });

            },
            cancle() {
                this.$emit("cancleclick");
            },
            backClick() {
                this.$emit("backClick");
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .weui-btn_default {
        color:#fff !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .typeForm-picker {
    .vux-popup-dialog {
        z-index: 600;
    }

    .typeForm-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .typeForm {
        height: 84%;
        overflow-y: scroll;
    }

</style>

