<template>
    <div class="copyExistTemplate-picker" v-transfer-dom>
        <popup v-model="showCopyExistTemplate"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="copyExistTemplate-picker-popup">
                <zing-head class="copyExistTemplate-picker-head"
                           title="复制现有模板"
                           :isComeBack="false"
                           @doSome="cancleClick">
                </zing-head>
                <div class="copyExistTemplate">
                    <!-- 分类及模板显示 -->
                    <div v-for="(itemData,index) in initData" :key="index">
                        <grid :cols="cols">
                            <grid-item v-for="(tpldata,index) in itemData" :key="index" @on-item-click="onItemClick(tpldata)">
                                <div class="weui-grid__icon">
                                    <i style="color:#ff8000;" :class="['iconfont', `icon-${tpldata.templateIcon}`]"></i>
                                </div>
                                <span class="grid-center">{{tpldata.templateName}}</span>
                            </grid-item>
                        </grid>
                    </div>
                    <div v-show="!isHaveTpl" style="text-align: center;color:#ff8000;font-size: 16px;">
                        <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                        <br/>
                        无数据！
                    </div>


                </div>

            </div>
            <copy-template-form :showPopupTemplateForm="showPopupTemplateForm"
                           :formData="templateFormData"
                           :typeData="typeData"
                           :orgRoleUserData="orgRoleUserData"
                           @reload="reloadTypeAndTemplate"
                           @cancleClick="closePopupForm('template')"
                           @backClick="closePopupForm('template')"
            ></copy-template-form>

        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import copyTemplateForm from "@/container/workflow/typeAndTemplate/copyTemplateForm";

    import { Grid,GridItem,XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,
        Popup,
        Cell,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "copyExistTemplate",
        components: {
            Grid,GridItem,ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell,copyTemplateForm
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                confirmShow:{
                    confirmOne:false
                },
                showPopupTemplateForm:false,
                showLine:false,
                cols:4,
                hidTplDiv:[],
                templateFormData:{

                }
            }
        },
        props:{
            showCopyExistTemplate: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            initData: {
                // 是否显示
                type: Array,
                default: function() {
                    return [];
                }
            },
            isHaveTpl: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            typeData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            orgRoleUserData:{
                type: Object,
                default:function(){
                    return {};
                }
            }
        },
        watch: {

        },
        created() {

        },
        methods: {

            handleHidTplDiv(typeId){
                let temp = this.hidTplDiv.indexOf(typeId);
                if(temp!=-1){
                    this.hidTplDiv.splice(temp, 1);
                }else{
                    this.hidTplDiv.push(typeId);
                }
            },
            cancleClick() {
                this.$emit("cancleClick");
            },
            handleTemplateData(tplData){
                this.templateFormData = {
                    "categoryId":this.typeData.categoryId,
                    "categoryName":this.typeData.categoryName,
                    "isDeleteForType":this.typeData.isDeleteForType,
                    "serialNumberForType":this.typeData.serialNumberForType,
                    "isSq":this.typeData.isSq,
                    "templateName":tplData.templateName,
                    "templateDesc":tplData.templateDesc,
                    "skillType":tplData.skillType,
                    "isDeleteForTemplate":tplData.isDeleteForTemplate,
                    "templateType":tplData.templateType,
                    "moduleType":this.typeData.moduleType,
                    "dataType":tplData.dataType,
                    "roleTags":"",
                    "templateIcon":tplData.templateIcon,
                    "templateTypeForOtherModule":tplData.templateTypeForOtherModule,
                    "isLinkTask":tplData.isLinkTask,
                    "copyTemplateId":tplData.templateId,
                    "copyTemplateCompanyId":"",
                };

                if(this.typeData.moduleType=="TYPE_HR_QJ"){
                    this.templateFormData.skillType="";
                    this.templateFormData.templateTypeForOtherModule="";
                }else if(this.typeData.moduleType=="MODULE_TYPE_ZYK"){
                    this.templateFormData.skillType="";
                }else if(this.typeData.moduleType=="MODULE_TYPE_HR_XZTZ"){
                    this.templateFormData.skillType="";
                    this.templateFormData.templateTypeForOtherModule="";
                }else if(this.typeData.moduleType=="MT_GDZC"){
                    this.templateFormData.skillType="";
                    this.templateFormData.templateTypeForOtherModule="";
                }else{
                    this.templateFormData.skillType="";
                    this.templateFormData.templateTypeForOtherModule="";
                }

            },
            onItemClick(tplData){
                this.handleTemplateData(tplData);
                this.showPopupTemplateForm = true;
            },
            closePopupForm(formId){
                if(formId=="template"){
                    this.showPopupTemplateForm=false;
                }
            },
            reloadTypeAndTemplate(tplData){
                this.showPopupTemplateForm=false;
                this.$emit("reloadAfterForCopyTemplate",tplData);
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .copyExistTemplate-picker {
    .vux-popup-dialog {
        z-index: 600;
    }

    .copyExistTemplate-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .copyExistTemplate {
        height: 100%;
        overflow-y: scroll;
    }

    .iconfont{
        font-size: 30px;
    }
    .weui-grid:before{
        border-right: 0px;
    }
    .weui-grid:after{
        border-bottom: 0px;
    }
    .grid-center {
        display: block;
        text-align: center;
        color: #666;
        margin-top: 10px;
        white-space: normal;
    }
    .weui-grids:before {
        border-top:0px;
    }
</style>

