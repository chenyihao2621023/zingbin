<template>
    <div class="subNodeForm-picker" v-transfer-dom>
        <popup v-model="showSubNodeForm"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="subNodeForm-picker-popup">
                <zing-head class="subNodeForm-picker-head"
                           title=""
                           :isComeBack="false"
                           @doSome="cancleClick">
                </zing-head>
                <div class="subNodeForm">
                    <x-input style="font-size: 16px;" class="formFontSize"
                             title="子节点名称&nbsp;<span style='color: red;'>*</span>："
                             placeholder="请填写子节点名称"
                             v-model="formParams.formItemName"></x-input>
                    <selector style="font-size: 16px;" title="子节点类型&nbsp;<span style='color: red;'>*</span>: "
                              :options="templateTypeArray"
                              v-model="formParams.formItemType"
                              required placeholder="请选择子节点类型"></selector>
                    <x-input style="font-size: 16px;" class="formFontSize"
                             title="提示文字&nbsp;<span style='color: red;'>*</span>："
                             placeholder="请填写提示文字"
                             v-model="formParams.formItemHintText"></x-input>
                    <x-switch style="font-size: 16px;" title="必填项："
                              :value-map="['否', '是']"
                              v-model="formParams.isMustRequired"
                    ></x-switch>
                    <div style="display: flex;position: absolute;z-index: 500;bottom: 0px;width: 100%;background-color: #f7f7fa;">
                        <flexbox>
                            <flexbox-item style="margin-left: 0px !important;">
                                <x-button type="primary" class="btn-save" @click.native="cancleClick">取消</x-button>
                            </flexbox-item>
                            <flexbox-item style="margin-left: 0px !important;">
                                <x-button type="primary" class="btn-common" @click.native="submit">确定</x-button>
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

    import { XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,
        Popup,
        Cell,
        Selector,
        XSwitch,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "subNodeForm",
        components: {
            ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell,Selector,XSwitch,
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                templateTypeArray: [
                    {
                        key: "input",
                        value: "文本"
                    },
                    {
                        key: "textarea",
                        value: "多行文本"
                    },
                    {
                        key: "voice",
                        value: "语音"
                    },
                    {
                        key: "image",
                        value: "图片"
                    },
                    {
                        key: "annex",
                        value: "附件"
                    },
                    {
                        key: "task",
                        value: "任务"
                    },
                    {
                        key: "personAndOrg",
                        value: "人员/组织"
                    }
//                    ,
//                    {
//                        key: "address",
//                        value: "地点"
//                    },
//                    {
//                        key: "voucher",
//                        value: "凭证"
//                    },
//                    {
//                        key: "outerChain",
//                        value: "外联人"
//                    }
                ],
                formParams:{
                    formItemName:'',
                    formItemType:'',
                    formItemHintText:'',
                    isMustRequired:"",

                }
            }
        },
        props:{
            showSubNodeForm: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            formData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            templateData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            nodeData:{
                type: Object,
                default:function(){
                    return {};
                }
            }
        },
        watch: {
            formData(){
                let self = this;
                self.initPage();
            }
        },
        created() {
            let self  = this;

            self.initPage();

        },
        methods: {
            initPage(){
                let self  = this;

                //渲染表单数据
                for(let key in self.formData){
                    if(self.formParams.hasOwnProperty(key)){
                        self.formParams[key] = self.formData[key];
                    }
                }
            },
            submit() {
                let self = this;
                let url = "";
                if (self.formData.formItemId != undefined && self.formData.formItemId!="") {
                    url = "/zingbiz/workflow/node/updateOneSubNode";
                    self.formParams.formItemId = self.formData.formItemId;
                    self.formParams.rowId = self.formData.rowId;
                } else {
                    delete self.formParams.formItemId;
                    delete self.formParams.rowId;
                    url = "/zingbiz/workflow/node/addOneSubNode";
                }
                if (self.formParams.formItemName === undefined || self.formParams.formItemName === "") {
                    self.$vux.toast.text("请输入子节点名称",'top');
                    return;
                }
                if (self.formParams.formItemType === undefined || self.formParams.formItemType === "") {
                    self.$vux.toast.text("请选择子节点类型",'top');
                    return;
                }
                if(self.formParams.formItemHintText==undefined || self.formParams.formItemHintText==""){
                    self.$vux.toast.text("请输入提示文字",'top');
                    return;
                }
                self.formParams.workflowNodeId = self.nodeData.nodeId;
                self.formParams.workflowTemplateId = self.templateData.templateId;
                self.formParams.dataType = "setting";

                this.$http.post(url, self.formParams).then(res => {
                    if (res.data.success === 'true') {
                    this.$emit("reload");
                    self.$vux.toast.text("操作成功！",'top');
                } else {
                    self.$vux.toast.text(res.data.msg == undefined ? res.data.mgs : res.data.msg,'top');
                }
            });
            },
            cancleClick() {
                this.$emit("cancleClick");
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .subNodeForm-picker {
    .vux-popup-dialog {
        z-index: 800;
    }

    .subNodeForm-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .subNodeForm {
        height: 85.5%;
        overflow-y: scroll;
    }

    .formFontSize{
        font-size: 16px !important;
    }

</style>

