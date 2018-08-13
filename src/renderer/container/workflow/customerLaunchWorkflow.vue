<template>
    <div class="launchCustomerWorkflow">
        <zing-head :title="'创建审批流'"></zing-head>

        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <x-input class="formFontSize" title="标题：" placeholder="请填写标题" v-model="formParams.workflow_name"></x-input>
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <x-textarea class="formFontSize" title="描述：" placeholder="请填写描述" v-model="formParams.workflow_describe" :show-counter="false" :rows="3"></x-textarea>
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <selector class="formFontSize" title="技能组：" :options="jnzData" v-model="formParams.skId"></selector>

        <div v-for="(subNodeData,index) in faQiSubNodeData" :key="index">
            <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
            <div style="padding: 10px 15px;">
                <common-form-template :ref="subNodeData.formItemId"
                                      :formItemData="subNodeData"
                ></common-form-template>
            </div>
        </div>

        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <cell title="图片信息：" value-align="left"></cell>
        <image-picker
            :files="files"
            :companyId="queryParams.companyId"
            selectable
            multiple
            @onChange="imgOkCallback"
            @onImageClick="onImageClick"
        />
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <div style="margin-top: 20px;">
            <flexbox>
                <flexbox-item>
                    <x-button style="font-size: 16px;" type="primary" class="btn-common" @click.native="doSubmit()">提 交</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <br/>


    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import ImagePicker from '@/components/imagepicker/ImagePicker';
    import { Z_IsEmpty20 } from "@/utils/fn";
    import commonFormTemplate from "@/container/workflow/commonFormTemplate/commonFormTemplate";

    import {
        Group,Cell,XInput,XTextarea,Datetime,Flexbox, FlexboxItem,XButton,XSwitch,Selector

    } from 'vux'
    export default {
        name: 'launchCustomerWorkflow',
        components: {
            Group,Cell,XInput,ZingHead,XTextarea,Datetime,
            Flexbox, FlexboxItem,XButton,XSwitch,ImagePicker,Selector,commonFormTemplate
        },
        data() {
            return {
                files:[],//图片列表
                imgStr:"",
                jnzData:[],
                skillInfos:[],
                queryParams:{
                    tplId:"",
                    cType:"",
                    typeId:"",
                    companyId:""
                },
                formParams:{
                    skId:"",
                    workflow_name:'',
                    workflow_describe:'',
                    companyId:"",
                    skType:"",
                    skcode:"",
                    skName:"",
                },
                faQiSubNodeData:[],//发起节点的子节点数据
            };
        },
        //钩子加载完触发
        created: function () {
            //处理url参数值
            this.handleQueryParams();

            this.getAllNeedData();

        },
        methods: {
            getAllNeedData(){
                let self = this;
                let postData = self.queryParams;
                let url = "/zingbiz/workflow/createWorkFlow/getBeforCreateCustomerFlowData"
                self.$http.post(url,postData).then(res => {
                    console.info(res.data);

                let tplData = res.data.data.templateData;
                if(!Z_IsEmpty20(tplData)){
                    console.log("模板数据：",tplData);
                    self.formParams.workflow_classify_id = tplData.categoryId;
                    self.formParams.workflow_classify=tplData.categoryName;
                    self.formParams.workflow_sort_id=tplData.templateId;
                    self.formParams.workflow_sort=tplData.templateName;
                    self.formParams.workflow_sort_describe=tplData.templateDesc;

                }


                let jnzData = res.data.data.skillGroupData;
                if(!Z_IsEmpty20(jnzData) && jnzData.length>0){
                    self.skillInfos = jnzData;
                    console.log("技能组数据：",self.skillInfos);
                    let jnzDataTemp = [];
                    for(let k in jnzData){
                        let jnzTemp = {
                            key:jnzData[k].skId,
                            value:jnzData[k].skName
                        };
                        jnzDataTemp.push(jnzTemp);
                    }
                    self.jnzData = jnzDataTemp;
                }else{
                    this.$vux.toast.text('当前商号未设置技能组，请联系商号或稍后重试！','top');
                }

                self.faQiSubNodeData = res.data.data.faQiSubNodeData==undefined?[]:res.data.data.faQiSubNodeData;


            });
            },
            getSikllInfo(skId){
                let self=this;
                if(Z_IsEmpty20(skId)){
                    return "";
                }
                for(var i=0;i<self.skillInfos.length;i++){
                    var temp=self.skillInfos[i];
                    if(skId===temp.skId){
                        return temp;
                    }
                }
                return "";
            },
            handleQueryParams(){
                this.queryParams.tplId=this.$route.query.tplId;
                this.queryParams.cType=this.$route.query.cType;
                this.queryParams.typeId=this.$route.query.typeId;
                this.queryParams.companyId=this.$route.query.companyId;
            },
            doSubmit(){
                let self = this;
                var params=self.formParams;
                var bool= self.vForm(params);
                if(!bool){
                    return ;
                }
                //技能组信息
                var skillInfo=self.getSikllInfo(params.skId);
                params.skType=skillInfo.skType;
                params.skcode=skillInfo.skId;
                params.skName=skillInfo.skName;

                params.fjForImg = self.imgStr;
                params.companyId = self.queryParams.companyId;

                //处理发起节点中的子节点数据
                if(self.faQiSubNodeData!=undefined){
                    let postSubNodeData = {
                        subNodeData : self.faQiSubNodeData
                    };
                    params.subNodeData = JSON.stringify(postSubNodeData);
                }

                let url = "/zingbiz/workflow/CustomerWorkflow/createCustomerWorkflow";
                self.$http.post(url,params).then(res => {
                    console.log(res.data);
                let data = res.data;
                if(data.success){
                    var woowId = data.data.woowId;

                    setTimeout(function(){
                        self.$router.push({
                            path: "showNode",
                            query: {
                                workflow_id: woowId,
                                companyId: self.queryParams.companyId
                            }
                        });
                    },600);
                }else{
                    this.$vux.toast.text("所选择技能组暂无客服人员，请选择其他技能组！",'top');
                }


            });

            },
            //上传图片组件方法
            imgOkCallback(files, operationType, index) {
                this.files = files;
                let imgArr = []
                files.forEach(function (obj) {
                    imgArr.push(obj.url)
                });
                this.imgStr = imgArr.join(",")
            },
            onImageClick(){

            },
            vForm(params){
                let self = this;
                if(self.flowData==null || self.flowData=="null"){

                    if(!self.formParams.workflow_name){
                        this.$vux.toast.text("请填写审批流标题！",'top');
                        return false;
                    }
                    if(!self.formParams.workflow_describe){
                        this.$vux.toast.text("请填写审批流描述！",'top');
                        return false;
                    }
                    if(self.formParams.workflow_name.length>100){
                        this.$vux.toast.text("审批流名称不能超过100个字！",'top');
                        return false;
                    }
                    if(!self.formParams.workflow_describe.length>1000){
                        this.$vux.toast.text("审批流描述不能超过1000个字！",'top');
                        return false;
                    }
                    if(!self.formParams.skId){
                        this.$vux.toast.text("请选择技能组！",'top');
                        return false;
                    }
                }

                //验证发起节点子节点的必填项
                if(this.faQiSubNodeData!=undefined && this.faQiSubNodeData.length>0){
                    let isOk = true;
                    let alertMsg = "";
                    for(let i in this.faQiSubNodeData){
                        let formItemValue = this.faQiSubNodeData[i].formItemValue;
                        let isMustRequired = this.faQiSubNodeData[i].isMustRequired;
                        if(isMustRequired=="是"){
                            if(!formItemValue){
                                isOk = false;
                                alertMsg = this.faQiSubNodeData[i].formItemHintText;
                                break;
                            }
                        }
                    }
                    if(!isOk){
                        self.$vux.toast.text(alertMsg, "top");
                        return false;
                    }
                }

                return true;
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';
    .launchCustomerWorkflow {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .formFontSize{
        font-size: 16px !important;
    }
</style>
