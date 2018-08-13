<template>
    <div id="daiZhiXing">
        <br/>
        <div v-for="nd in initData" class="vux-timeline">
            <ul v-if="nd.stepType!='FP'">
                <li class="vux-timeline-item">
                    <div style="position: absolute;margin-left: -4px;z-index: 1;padding-top: 10px;">
                        <img style="width:42px;height:42px;"
                             alt="50x50"
                             src="../../../assets/img/userDef_.jpg"
                             :data-src="getImageUrl(nd.headImg,'../../../assets/img/userDef_.jpg')"
                             data-error="../../../assets/img/userDef_.jpg"
                        >
                        <span style="text-align: center;margin-left: -7px;margin-top: 5px;background-color:#3a87ad;display:block;width:56px;padding: 2px 2px 3px 2px;color: #fff;">
                            {{nd.user_name}}
                        </span>
                        <span v-if="nd.staff_state==='已完成'" class="state-icon" style="background-color: green !important;margin-left: 2px;text-align: center;margin-top: 5px;display:block;width:36px;">
                            <i class="iconfont icon-xuanze2" style="color:#fff;font-size: 35px;margin-left: -2px;"></i>
                        </span>
                        <span v-else-if="nd.staff_state==='驳回'" class="state-icon" style="background-color: red !important;margin-left: 2px;text-align: center;margin-top: 5px;display:block;width:36px;">
                            <i class="iconfont icon-guanbi" style="color:#fff;font-size: 20px;"></i>
                        </span>
                        <span v-else class="state-icon" style="margin-left: 2px;text-align: center;margin-top: 5px;display:block;width:36px;">
                            <i class="iconfont icon-jianhao1" style="color:#fff;font-size: 20px;"></i>
                        </span>
                    </div>
                    <div class="vux-timeline-item-tail" style="display: block;"></div>
                    <div class="vux-timeline-item-content">
                        <div style="margin-left: 30px;padding: 10px 0px 10px 0px;">
                            <div style="border:1px solid #eaeefb;border-bottom: 3px solid #dae1e5;border-right: 3px solid #dae1e5;border-radius: 3px;">
                                <div class="vux-form-preview weui-form-preview">
                                    <div class="weui-form-preview__hd">
                                        <em style="text-align: left" class="weui-form-preview__value">{{nd.stepName}}</em>
                                    </div>
                                    <div class="weui-form-preview__bd">
                                        <div v-for="(subNodeData,index) in workflowData.subNodeData[nd.stepId]" >
                                            <common-form-template :ref="subNodeData.formItemId"
                                                                  :formItemData="subNodeData"
                                                                  :companyId="companyId"
                                            ></common-form-template>
                                        </div>
                                        <div v-show="nd.isFaQiNode!='是'" class="weui-form-preview__item">
                                            <label class="weui-form-preview__label">执行内容：</label>
                                            <span class="weui-form-preview__value">{{nd.staff_state_describe}}</span>
                                            <div v-if="nd.voiceData != undefined" v-audio-control>
                                                <div v-for="data in nd.voiceData" style="width:50px;height:50px;float:left;margin-right:5px;">
                                                    <div style="position:absolute;z-index:2;width:50px;height:50px;float:left;background: rgba(255,255,255,0);border-color: #fff;border-radius: 3px;box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;" class="audio"
                                                         :data-src="data">
                                                    </div>
                                                    <i style="float:left;z-index:1;margin-top: 15px;margin-left: 15px;" class="chat-voice-ico" ></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-show="nd.isFaQiNode!='是'" class="weui-form-preview__item">
                                            <label class="weui-form-preview__label">执行次数：</label>
                                            <span class="weui-form-preview__value">{{nd.executeCount}}</span>
                                        </div>
                                        <div v-show="nd.isFaQiNode!='是'" class="weui-form-preview__item">
                                            <label class="weui-form-preview__label">依赖节点：</label>
                                            <span class="weui-form-preview__value">
                                                <div v-for="tempData in nd.relationNodesData">
                                                    <div v-if="tempData.isOk" style="white-space: normal !important;text-align: left !important;" class="badge badge-success">
                                                        {{tempData.nodeName}}-{{tempData.zxr}}
                                                        <i class="iconfont icon-xuanze2"></i>
                                                    </div>
                                                    <div v-else style="white-space: normal !important;text-align: left !important;" class="badge badge-danger">
                                                        {{tempData.nodeName}}-{{tempData.zxr}}
                                                        <i class="iconfont icon-shanchu3"></i>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>

                                        <div v-if="workflowData.moduleType==='MODULE_TYPE_ZYK'" class="weui-form-preview__item">
                                            <span style="text-align: right;" class="weui-form-preview__value">
                                                <a href="javascript:void(0);" @click="openPz">查看凭证</a>
                                            </span>
                                        </div>
                                    </div>
                                    <div v-if="workflowData.workflow_state!='驳回'" class="weui-form-preview__ft">
                                        <a v-if="nd.attributeCode!=undefined && nd.attributeCode!='' && nd.attributeCode.indexOf('BTN_SHWC')>=0 && otherModuleData.dataStatus=='YSH'" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKSHWC()" class="weui-form-preview__btn weui-form-preview__btn_default">审核完成</a>
                                        <a v-if="nd.attributeCode!=undefined && nd.attributeCode!='' && nd.attributeCode.indexOf('BTN_SHWC')>=0 && otherModuleData.dataStatus!='YSH'" style="background-color: #40affc;color: #fff;" href="javascript:" @click="btnClick('SHWC',nd,nd.buttonType)" class="weui-form-preview__btn weui-form-preview__btn_default">审核完成</a>
                                        <a v-if="nd.isCanZx && nd.attributeCode!=undefined && nd.attributeCode!='' && nd.attributeCode.indexOf('BTN_HR_KQ')>=0" style="background-color: #40affc;color: #fff;" href="javascript:" @click="btnClick('KQ',nd,nd.buttonType)" class="weui-form-preview__btn weui-form-preview__btn_default">扣钱</a>
                                        <a v-if="!nd.isCanZx && nd.attributeCode!=undefined && nd.attributeCode!='' && nd.attributeCode.indexOf('BTN_HR_KQ')>=0" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">扣钱</a>

                                        <a v-if="nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='ZX'" style="background-color: #ff8000;color: #fff;" href="javascript:" @click="btnClick('ZX',nd,'ZX')" class="weui-form-preview__btn weui-form-preview__btn_default">执行</a>
                                        <a v-else-if="nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='YYZX'" style="background-color: #ff8000;color: #fff;" href="javascript:" @click="btnClick('ZX',nd,'YYZX')" class="weui-form-preview__btn weui-form-preview__btn_default">语音执行</a>
                                        <a v-else-if="nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='TJ'" style="background-color: #ff8000;color: #fff;" href="javascript:" @click="btnClick('ZX',nd,'TJ')" class="weui-form-preview__btn weui-form-preview__btn_default">保存</a>
                                        <a v-else-if="nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='YYTJ'" style="background-color: #ff8000;color: #fff;" href="javascript:" @click="btnClick('ZX',nd,'YYTJ')" class="weui-form-preview__btn weui-form-preview__btn_default">语音保存</a>

                                        <a v-else-if="!nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='ZX'" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">执行</a>
                                        <a v-else-if="!nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='YYZX'" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">语音执行</a>
                                        <a v-else-if="!nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='TJ'" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">保存</a>
                                        <a v-else-if="!nd.isCanZx && nd.buttonType!=undefined && nd.buttonType!='' && nd.buttonType=='YYTJ'" style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">语音保存</a>


                                        <a v-if="nd.isCanZx" style="background-color: #40affc;color: #fff;" href="javascript:" @click="btnClick('BH',nd,'BH')" class="weui-form-preview__btn weui-form-preview__btn_default">驳回</a>
                                        <a v-else style="background-color: #abbac3;color: #fff;" href="javascript:" @click="BKCZ()" class="weui-form-preview__btn weui-form-preview__btn_default">驳回</a>
                                        <a style="background-color: #ff8000;color: #fff;" href="javascript:" @click="selectInputPerson(nd)" class="weui-form-preview__btn weui-form-preview__btn_default">委托</a>
                                    </div>
                                    <div v-else class="weui-form-preview__ft">
                                        <div style="width: 100%;text-align:center;color:#FF0000">当前审批被驳回，暂不可操作！</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </li>

            </ul>
        </div>

        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson"
                           :initialSelectedType="'cardUrl'"
                           :showTab="showTab"
                           :showPicker="showPersonPicker"
                           :multiple="false"
                           @picked="onPicked"
                           @abort="onPickAbort"></org-member-picker>

    </div>
</template>

<script>
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import { Z_IsEmpty20,getImageUrl } from "@/utils/fn";
    import AudioControl from '@/directives/audiocontrol/audio-control'
    import commonFormTemplate from "@/container/workflow/commonFormTemplate/commonFormTemplate";

    import {
        Group,XInput,XTextarea,Datetime,Cell

    } from 'vux'
    export default {
        name:"daiZhiXing",
        components: {
            Group,XInput,XTextarea,Datetime,Cell,
            OrgMemberPicker,commonFormTemplate,getImageUrl
        },
        directives: {
            AudioControl,
        },
        data() {
            return {
                initSelectPerson:[],
                showPersonPicker: false,
                curNodeData:{},
                showTab:["colleague"],
            };
        },
        //钩子加载完触发
        created: function () {

        },
        props: {
            initData:{
                type: Array,
                default:function(){
                    return [];
                }
            },
            workflowData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            otherModuleData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            companyId:{
                type: String,
                default:function(){
                    return "";
                }
            }

        },
        methods: {

            getImageUrl,
            selectInputPerson(nodeData) {
                this.curNodeData = nodeData;
                this.initSelectPerson.push();
                this.showPersonPicker = true;
            },
            onPickAbort() {
                this.showPersonPicker = false
            },
            onPicked(list) {
                this.showPersonPicker = false;
                let selTemp = list.map(item => {
                    let map = {}
                    map.key = item.userName
                map.value = item.cardUrl
                return map;
            });
                if (selTemp !== undefined && selTemp.length >= 1) {
                    let selCardUrl = selTemp[0].value;
                    if(this.curNodeData.cardUrl === selCardUrl){
                        this.$vux.toast.text("选择的委托人已是当前节点执行人！",'top');
                        return false;
                    }
                    let params = {
                        "selCardUrl":selCardUrl,
                        "nodeData":this.curNodeData
                    };
                    this.$emit("weiTuo",params);

                }

            },
            btnClick(btnType,nodeData,requestType){
                //校验节点子节点必填项是否合法
                //所有子节点数据
                let allSubNodeData = this.workflowData.subNodeData;
                //当前执行的节点id
                let curExecuteNodeId = nodeData.stepId;
                //获取当前节点的子节点数据
                let subNodeParams = allSubNodeData[curExecuteNodeId];
                if(subNodeParams!=undefined && subNodeParams.length>0){
                    let isOk = true;
                    let alertMsg = "";
                    //需求：节点执行时，如果是驳回执行，则不进行验证节点子节点中必填项是否填写
                    if(btnType!="BH"){
                        for(let i in subNodeParams){
                            let formItemValue = subNodeParams[i].formItemValue;
                            let isMustRequired = subNodeParams[i].isMustRequired;
                            if(isMustRequired=="是"){
                                if(!formItemValue){
                                    isOk = false;
                                    alertMsg = subNodeParams[i].formItemHintText;
                                    break;
                                }
                            }
                        }
                    }
                    if(!isOk){
                        this.$vux.toast.text(alertMsg, "top");
                        return false;
                    }
                }

                let params = {
                    "btnType":btnType,
                    "requestType":requestType,
                    "nodeData":nodeData
                };
                this.$emit("nodeExecution",params);
            },
            BKCZ(){
                this.$vux.toast.text("依赖节点未执行，暂不可进行操作！",'top');
            },
            openPz(){
                this.$emit("openPz");
            },
            BKSHWC(){
                this.$vux.toast.text("凭证已审核完成，不可再次进行操作！",'top');
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .vux-timeline {
        padding: 0 0.5rem 0 1rem;
    }
    .vux-timeline > ul > li {
        list-style: none;
    }

    .vux-timeline-item {
        position: relative;
    }

    .vux-timeline-item img {
        border: 1px solid #AAA;
        padding: 2px;
        background-color: #FFF;
        border-radius: 100%;
        max-width: 42px;
        vertical-align: middle;
    }
    .vux-timeline-item-tail {
        position: absolute;
        content: '';
        height: 100%;
        width: 3px;
        left: 15px;
        top: -3px;
        background-color: #FF9900;
    }
    .vux-timeline-item-content {
        padding: 0 0 0 1.2rem;
    }
    .state-icon{
        opacity: 1;
        border-radius: 100%;
        display: inline-block;
        font-size: 16px;
        height: 36px;
        line-height: 30px;
        width: 36px;
        text-align: center;
        text-shadow: none!important;
        padding: 0;
        cursor: default;
        border: 3px solid #FFF!important;
        background-color: #abbac3!important;
    }

    .vux-form-preview {
        overflow: hidden;
    }
    .weui-form-preview {
        position: relative;
        background-color: #FFFFFF;
    }
    .weui-form-preview:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 0px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .weui-form-preview:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 0px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .weui-form-preview__hd {
        position: relative;
        padding: 0px 6px;
        text-align: right;
        line-height: 2.5em;
    }
    .weui-form-preview__label {
        float: left;
        margin-right: 1em;
        min-width: 4em;
        color: #999999;
        text-align: justify;
        text-align-last: justify;
    }
    .weui-form-preview__hd .weui-form-preview__value {
        font-style: normal;
        font-size: 1em !important;
    }
    .weui-form-preview__value {
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
    }
    .weui-form-preview__hd:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        left: 0px;
    }
    .weui-form-preview__bd {
        padding: 6px 6px;
        font-size: .9em;
        text-align: right;
        color: #999999;
        line-height: 2;
    }
    .weui-form-preview__item {
        overflow: hidden;
    }
    .weui-form-preview__ft {
        position: relative;
        line-height: 35px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
    }
    .weui-form-preview__ft a{
        border-radius: 3px;
    }
    .weui-form-preview__ft:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #D5D5D6;
        color: #D5D5D6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .weui-form-preview__btn {
        position: relative;
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: #3CC51F;
        text-align: center;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .weui-form-preview__btn_default {
        color: #999999;
    }
    .divForContent{
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        box-shadow: #666 0px 2px;
    }

    .badge {
        display: inline-block;
        min-width: 10px;
        padding: 3px 7px;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        background-color: #777;
        border-radius: 10px;
    }

    .badge-success, .badge.badge-success, .label-success, .label.label-success {
        background-color: #82af6f;
    }
    .badge-danger, .badge-important, .badge.badge-danger, .badge.badge-important, .label-danger, .label-important, .label.label-danger, .label.label-important {
        background-color: #d15b47;
    }

    .chat-voice-ico
            display: inline-block
            width: 16px
            height: 16px
            background-size: 16px 16px
            vertical-align: middle
            background-image: url(../../../assets/img/mbvoice.png)
            &.reverse
                background-image: url(../../../assets/img/mbvoice-reverse.png)
                margin-right: 12px
                margin-left: 16px
        .playing~.chat-voice-ico
                background-image: url(../../../assets/img/mbvoice.gif)
                &.reverse
                    background-image: url(../../../assets/img/mbvoice-reverse.gif)
</style>
