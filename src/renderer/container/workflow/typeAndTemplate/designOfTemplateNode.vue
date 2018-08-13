<template>
    <div class="designOfTemplateNode-picker" v-transfer-dom>
        <popup v-model="showDesignOfTemplateNode"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="designOfTemplateNode-picker-popup">
                <zing-head class="designOfTemplateNode-picker-head"
                           title="模板设计"
                           :isComeBack="false"
                           @doSome="cancleClick">
                    <div slot="header-right">
                        <i @click="openTplForm" class="iconfont icon-gengduo" style="font-size: 45px;"></i>
                    </div>
                </zing-head>
                <div id="designOfTemplateNode" class="designOfTemplateNode">

                    <div v-for="(data,index) in initData.nodeData" :key="index">
                        <div :id="data.rowId" v-if="data.stepType!='FP'" style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                        <div v-if="data.stepType!='FP'" style="">
                            <flexbox style="border-bottom: 1px solid #EFEFF4;padding: 5px 13px 10px 13px;">
                                <flexbox-item :span="6">
                                    <div>

                                        <div v-if="data.isFaQiNode=='是'" class="tag-wrapper">
                                            <span>{{data.stepName}}</span><tag>发起节点</tag>
                                        </div>
                                        <span v-else>{{data.stepName}}</span>

                                    </div>
                                </flexbox-item>
                                <flexbox-item style="text-align: right;">
                                    <i v-show="data.isFaQiNode!='是'" @click="moveUp(data,index,'node')" style="font-size: 20px;padding: 6px;" class="iconfont icon-shangyi"></i>
                                    <i v-show="data.isFaQiNode!='是'" @click="moveDown(data,index,'node')" style="font-size: 20px;padding: 6px;" class="iconfont icon-xiayi"></i>
                                    <i @click="editNode(data)" style="font-size: 20px;padding: 6px;" class="iconfont icon-bianji1"></i>
                                    <i @click="deleteNode(data)" style="font-size: 20px;padding: 6px;" class="iconfont icon-shanchu1"></i>
                                </flexbox-item>
                            </flexbox>
                            <flexbox v-if="data.isFaQiNode=='是'" style="border-bottom:1px solid #EFEFF4;" >
                                <flexbox-item>
                                    <!-- 基础表单项 -->
                                    <base-form v-if="formTemplate.baseForm" ref="baseForm"
                                               :isDisabled="true"
                                    ></base-form>
                                    <!-- 薪资调整表单项 -->
                                    <xztz-form v-if="formTemplate.xztzForm" ref="xztzForm"
                                    ></xztz-form>
                                    <!-- 请假表单项 -->
                                    <qj-form v-if="formTemplate.qjForm" ref="qjForm"
                                    ></qj-form>
                                    <!-- 凭证表单项 -->
                                    <pz-form v-if="formTemplate.pzForm" ref="pzForm"
                                    ></pz-form>
                                </flexbox-item>
                            </flexbox>
                            <flexbox :id="subNodeData.rowId" style="border-bottom:1px solid #EFEFF4;padding: 10px 15px;" v-for="(subNodeData,subIndex) in initData.subNodeData[data.nodeId]" :key="subIndex">
                                <flexbox-item style="text-align: center" :span="1">
                                    <i @click="delSubNode(subNodeData)" style="font-size: 20px;padding: 6px;color: #ff0000;" class="iconfont icon-shanchu"></i>
                                </flexbox-item>
                                <flexbox-item @click.native="openSubNodeForm(subNodeData)" :span="7.5">
                                    <common-form-template :ref="subNodeData.formItemId"
                                                          :formItemData="subNodeData"
                                                          :isSetting="true"
                                    ></common-form-template>
                                </flexbox-item>
                                <flexbox-item style="text-align: right">
                                    <i @click="moveUp(subNodeData,index,'subNode',subIndex)" style="font-size: 20px;padding: 6px;" class="iconfont icon-shangyi"></i>
                                    <i @click="moveDown(subNodeData,index,'subNode',subIndex)" style="font-size: 20px;padding: 6px;" class="iconfont icon-xiayi"></i>
                                </flexbox-item>
                            </flexbox>
                            <flexbox style="margin-top: 10px;padding:10px;">
                                <flexbox-item :span="12" style="text-align: center;">
                                    <i @click="addSubNode(data)" style="color:#ff8000;" class="iconfont icon-tianjia1">&nbsp;新建子节点</i>
                                </flexbox-item>
                            </flexbox>
                        </div>
                    </div>
                    <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                    <div style="">
                        <flexbox style="margin-top: 10px;padding:10px;">
                            <flexbox-item :span="12" style="text-align: center;">
                                <i @click="addNode" style="color:#ff8000;" class="iconfont icon-tianjia1">&nbsp;新建节点</i>
                            </flexbox-item>
                        </flexbox>
                    </div>

                    <!--<div style="display: flex;position: absolute;z-index: 500;bottom: 5px;width: 100%;background-color: #f7f7fa;">-->

                    <!--<flexbox>-->
                    <!--<flexbox-item>-->
                    <!--<x-button type="primary" class="btn-common" @click.native="cancleClick">取消</x-button>-->
                    <!--</flexbox-item>-->
                    <!--<flexbox-item>-->
                    <!--<x-button type="primary" class="btn-save" @click.native="submit">确定</x-button>-->
                    <!--</flexbox-item>-->
                    <!--</flexbox>-->
                    <!--</div>-->
                </div>

            </div>
            <!-- 模板表单 -->
            <template-form :showPopupTemplateForm="showPopupTemplateForm"
                           :formData="templateData"
                           :typeData="typeData"
                           :orgRoleUserData="orgRoleUserData"
                           @cancleClick="closePopupForm('template')"
                           @backClick="closePopupForm('template')"
                           @reload="reloadTemplateData"
            ></template-form>

            <!-- 节点表单 -->
            <node-form :showNodeForm="showNodeForm"
                       :formData="curNodeData"
                       :templateData="templateData"
                       :orgRoleUserData="orgRoleUserData"
                       :allNodeData="initData.nodeData"
                       @cancleClick="cancleClick('nodeForm')"
                       @reload="reloadNodeData"
            ></node-form>

            <!-- 子节点表单 -->
            <sub-node-form :showSubNodeForm="showSubNodeForm"
                           :nodeData="curNodeData"
                           :templateData="templateData"
                           @cancleClick="cancleClick('subNodeForm')"
                           :formData="curSubNodeData"
                           @reload="reloadNodeData"
            ></sub-node-form>
            <confirm v-model="showConfirm" :title="'提示'" @on-confirm="onConfirm">
                <p style="text-align:center;">是否确认删除此节点？</p>
            </confirm>

            <confirm v-model="showConfirm2" :title="'提示'" @on-confirm="onConfirm2">
                <p style="text-align:center;">当前模板未添加节点或设置发起节点，将不可使用该模板发起审批，是否放弃设置发起节点？</p>
            </confirm>

            <!-- 通用表单模板 -->

        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import templateForm from "@/container/workflow/typeAndTemplate/templateForm";
    import nodeForm from "@/container/workflow/templateNode/nodeForm";
    import subNodeForm from "@/container/workflow/templateNode/subNodeForm";
    import commonFormTemplate from "@/container/workflow/commonFormTemplate/commonFormTemplate";
    import baseForm from "@/container/workflow/formTemplate/base";
    import pzForm from "@/container/workflow/formTemplate/pz";
    import qjForm from "@/container/workflow/formTemplate/qj";
    import xztzForm from "@/container/workflow/formTemplate/xztz";
    import Tag from "@/components/tag/Tag";

    import { Grid,GridItem,XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,
        Popup,
        Cell,Confirm,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "designOfTemplateNode",
        components: {
            Grid,GridItem,ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell,templateForm,nodeForm,subNodeForm,Confirm,commonFormTemplate,baseForm,
            qjForm,xztzForm,pzForm,Tag
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                showPopupTemplateForm:false,
                showSubNodeForm:false,
                showNodeForm:false,
                curNodeData:{},
                curSubNodeData:{},
                curDelNodeData:{},
                curDelSubNodeData:{},
                showConfirm: false, // 禁止分类窗口
                showConfirm2: false, // 禁止分类窗口
                confirmType:"",
                formTemplate: {
                    //基础表单项
                    baseForm: false,
                    //薪资调整表单项
                    xztzForm: false,
                    //请假表单项
                    qjForm: false,
                    //资源库凭证
                    pzForm: false,
                    //关联任务
                    linkTaskWorkForm: false
                }
            }
        },
        props:{
            showDesignOfTemplateNode: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            initData: {
                // 是否显示
                type: Object,
                default: function() {
                    return {};
                }
            },
            templateData: {
                type: Object,
                default: function() {
                    return {};
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
            templateData:{
                handler:function(){
                    this.handleFormShow();
                }
            },
            initData:{
                handler:function(value,oldvalue){
                    this.$forceUpdate();
                }
            }
        },
        created() {

        },
        methods: {
            openSubNodeForm(subNodeData){
                this.curSubNodeData=subNodeData;
                this.showSubNodeForm=true;
            },
            delSubNode(subNodeData){
                this.showConfirm=true;
                this.curDelSubNodeData=subNodeData;
                this.confirmType = "delSubNode";
            },
            deleteNode(nodeData) {
                this.confirmType = "deleteNode";
                this.showConfirm=true;
                this.curDelNodeData = nodeData;
                console.log("on cancel");
            },
            onConfirm(msg) {
                let vm = this;
                let url = "";
                let params = {};
                if(this.confirmType=="deleteNode"){
                    params = {
                        nodeId: vm.curDelNodeData.nodeId,
                        templateId: vm.curDelNodeData.templateId
                    };
                    url = "/zingbiz/workflow/node/delOneNode";
                }else if(this.confirmType=="delSubNode"){
                    url = "/zingbiz/workflow/node/delOneSubNode";
                    params = {
                        formItemId: vm.curDelSubNodeData.formItemId,
                        rowId:vm.curDelSubNodeData.rowId
                    };
                }

                vm.$http.post(url, params).then(res => {
                    this.showConfirm=false;
                if (res.data.success === "true") {
                    vm.getNodeByTemplateId();
                    vm.$vux.toast.text("操作成功！",'top');
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            onConfirm2(){
                this.$emit("cancleClick");
            },
            openTplForm(){
                this.showPopupTemplateForm=true;
            },
            cancleClick(_t) {
                if(_t=="nodeForm"){
                    this.showNodeForm=false;
                }else if(_t=="subNodeForm"){
                    this.showSubNodeForm=false;
                }else{
                    //判断当前模板中是否设置了发起节点
                    let allNodeTemp = this.initData.nodeData;
                    let isSelFaQi = false;
                    for(let i in allNodeTemp){
                        if(allNodeTemp[i].isFaQiNode=="是"){
                            isSelFaQi = true;
                            break;
                        }
                    }
                    if(!isSelFaQi){
                        this.showConfirm2 = true;
                    }else{
                        this.$emit("cancleClick");
                    }
                }
            },
            closePopupForm(formId){
                if(formId=="template"){
                    this.showPopupTemplateForm=false;
                }
            },
            editNode(nodeData){
                this.curNodeData=nodeData;
                this.showNodeForm=true;
            },
            addNode(){
                let reset = {
                    stepType:'',
                    stepName:'',
                    executor_name:"",
                    cardUrl:"",
                    executor:"",
                    executorType:"",
                    isFaQiNode:"",
                    fwForOrgId:"",
                    fwForOrgName:"",
                    fwForRoleId:"",
                    fwForRoleName:"",
                    attributeCode:"",
                    attributeName:"",
                };
                this.curNodeData=Object.assign({},reset);
                this.showNodeForm=true;
            },
            addSubNode(nodeData){
                let reset = {
                    formItemName:'',
                    formItemType:'',
                    formItemHintText:'',
                    isMustRequired:"",
                };
                this.curSubNodeData=Object.assign({},reset);
                this.curNodeData=nodeData;
                this.showSubNodeForm=true;
            },
            reloadNodeData(){
                let self = this;
                setTimeout(function(){
                    self.getNodeByTemplateId();
                    self.showNodeForm=false;
                },1000);
            },
            reloadSubNodeData(){
                let self = this;
                setTimeout(function(){
                    self.getNodeByTemplateId();
                    self.showSubNodeForm=false;
                },1000);
            },
            getNodeByTemplateId(){
                let self = this;
                self.systemTplData=[];
                let url = "/zingbiz/workflow/node/loadAllNodeByTemplateId";
                self.$http.post(url,self.templateData).then(res => {
                    this.showNodeForm = false;
                this.showSubNodeForm = false;
                if(res.data.success){
                    self.initData = res.data.data;
                }else{
                    self.$vux.toast.text(res.data.mgs==undefined?res.data.msg:res.data.mgs,'top');
                }
            })
            .catch(err => {
                    this.$vux.toast.text("异常，请稍后重试！",'top');
            });
            },
            moveUp(curData,curIndex,dataType,subIndex){
                let url = "";
                if(dataType=="node"){
                    let previousData = this.initData.nodeData[curIndex-1];

                    if(previousData==undefined){
                        this.$vux.toast.text("无位置可移动了！",'top');
                        return false;
                    }

                    if(previousData.isFaQiNode=="是"){
                        this.$vux.toast.text("不可上移到发起节点前！",'top');
                        return false;
                    }

                    let curN = curData.serial;
                    let preN = previousData.serial;

                    let postParams = {
                        curData:{
                            nodeId : curData.nodeId,
                            rowId : curData.rowId,
                            serial : preN
                        },
                        otherData:{
                            nodeId : previousData.nodeId,
                            rowId : previousData.rowId,
                            serial : curN
                        },
                        templateId : this.templateData.templateId
                    };
                    url = "/zingbiz/workflow/node/updateNodeOrder";
                    this.updateDataOrder(url,postParams,"up");

                }else if(dataType=="subNode"){
                    let nodeId = this.initData.nodeData[curIndex].nodeId;
                    let previousData = this.initData.subNodeData[nodeId][subIndex-1];
                    if(previousData==undefined){
                        this.$vux.toast.text("无位置可移动了！",'top');
                        return false;
                    }

                    let curN = curData.formItemOrder;
                    let preN = previousData.formItemOrder;

                    let postParams = {
                        curData:{
                            formItemId : curData.formItemId,
                            rowId : curData.rowId,
                            formItemOrder : preN
                        },
                        otherData:{
                            formItemId : previousData.formItemId,
                            rowId : previousData.rowId,
                            formItemOrder : curN
                        },
                        templateId : this.templateData.templateId
                    };
                    url = "/zingbiz/workflow/node/updateSubNodeOrder";
                    this.updateDataOrder(url,postParams,"up");
                }
            },
            moveDown(curData,curIndex,dataType,subIndex){
                console.log("curData",curData)
                console.log("curIndex",curIndex)
                let url = "";
                if(dataType=="node"){
                    let nextData = this.initData.nodeData[curIndex+1];
                    if(nextData==undefined){
                        this.$vux.toast.text("无位置可移动了！",'top');
                        return false;
                    }
                    let curN = curData.serial;
                    let nextN = nextData.serial;

                    let postParams = {
                        curData:{
                            nodeId : curData.nodeId,
                            rowId : curData.rowId,
                            serial : nextN
                        },
                        otherData:{
                            nodeId : nextData.nodeId,
                            rowId : nextData.rowId,
                            serial : curN
                        },
                        templateId : this.templateData.templateId
                    };
                    url = "/zingbiz/workflow/node/updateNodeOrder";
                    this.updateDataOrder(url,postParams,"down");

                }else if(dataType=="subNode"){
                    let nodeId = this.initData.nodeData[curIndex].nodeId;
                    let nextData = this.initData.subNodeData[nodeId][subIndex+1];
                    if(nextData==undefined){
                        this.$vux.toast.text("无位置可移动了！",'top');
                        return false;
                    }
                    let curN = curData.formItemOrder;
                    let nextN = nextData.formItemOrder;

                    let postParams = {
                        curData:{
                            formItemId : curData.formItemId,
                            rowId : curData.rowId,
                            formItemOrder : nextN
                        },
                        otherData:{
                            formItemId : nextData.formItemId,
                            rowId : nextData.rowId,
                            formItemOrder : curN
                        },
                        templateId : this.templateData.templateId
                    };
                    url = "/zingbiz/workflow/node/updateSubNodeOrder";
                    this.updateDataOrder(url,postParams,"down");
                }
            },
            updateDataOrder(url,postParams,upOrDown){
                let self = this;
                self.$http.post(url, postParams).then(res => {
                    if (res.data.success) {
                    self.initData={};
                    self.$set(self.initData,"nodeData",res.data.data.nodeData);
                    self.$set(self.initData,"subNodeData",res.data.data.subNodeData);

                    let dom = document.getElementById("designOfTemplateNode");
                    if(upOrDown=="up"){
                        let otherDataPosition = document.getElementById(postParams.otherData.rowId).offsetTop;
                        dom.scrollTo(dom.scrollLeft, otherDataPosition-50);

                    }else{
                        let scrollPosition = document.getElementById(postParams.curData.rowId).offsetTop;
                        dom.scrollTo(dom.scrollLeft, scrollPosition-50);
                    }
                } else {
                    self.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            handleFormShow() {
                this.formTemplate = {
                    //基础表单项
                    baseForm: false,
                    //薪资调整表单项
                    xztzForm: false,
                    //请假表单项
                    qjForm: false,
                    //资源库凭证
                    pzForm: false,
                    //关联任务
                    linkTaskWorkForm: false
                };
                let cTypeTemp = this.templateData.moduleType;
                if (cTypeTemp != undefined && cTypeTemp === "TYPE_HR_QJ") {
                    this.formTemplate.qjForm = true;
                } else if (cTypeTemp != undefined && (cTypeTemp === "MODULE_TYPE_ZYK" || cTypeTemp === "MT_GDZC")) {
                    this.formTemplate.pzForm = true;
                } else if (
                    cTypeTemp != undefined &&
                    cTypeTemp === "MODULE_TYPE_HR_XZTZ"
                ) {
                    this.formTemplate.xztzForm = true;
                } else {
                    this.formTemplate.baseForm = true;
                }
            },
            reloadTemplateData(){
                this.$emit("reloadTplData");
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .designOfTemplateNode-picker {
    .vux-popup-dialog {
        z-index: 600;
    }

    .designOfTemplateNode-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .designOfTemplateNode {
        height: 100%;
        overflow-y: scroll;
    }

</style>

