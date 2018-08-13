<template>
    <div id="showNodeAndSelExecutor">
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <div style="padding:10px 13px;">流程信息：</div>
        <div style="padding: 0px 5px 0px 5px;">
            <div v-for="(data,index) in nodeData">
                <div class="vux-form-preview weui-form-preview">
                    <div class="weui-form-preview__hd">
                        <em class="weui-form-preview__value">{{data.serial}}：{{data.stepName}}</em>
                    </div>
                    <div class="weui-form-preview__bd">
                        <div class="weui-form-preview__item">
                            <label class="weui-form-preview__label">任务描述：</label>
                            <span class="weui-form-preview__value">{{data.description}}</span>
                        </div>
                        <div v-if="data.linkNodeNum != '' && data.linkNodeNum != undefined">
                            <div class="weui-form-preview__item">
                                <label class="weui-form-preview__label">&nbsp;&nbsp;&nbsp;&nbsp;办理人：</label>
                                <div v-if="data.linkNodeId!=undefined && data.linkNodeId!=''">
                                    <div v-for="(dataTemp,index2) in nodeData">
                                        <span v-if="data.linkNodeId === dataTemp.nodeId" class="weui-form-preview__value">
                                            由节点顺序号 {{dataTemp.serial}}: {{dataTemp.stepName}} {{dataTemp.executor}} 处理
                                        </span>
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-for="dataTemp in nodeData">
                                        <span v-if="data.linkNodeNum === dataTemp.serial && (data.linkNodeId===undefined || data.linkNodeId==='')" class="weui-form-preview__value">
                                            由节点顺序号 {{dataTemp.serial}}: {{dataTemp.stepName}} {{dataTemp.executor}} 处理
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div v-else>
                            <div class="weui-form-preview__item">
                                <label class="weui-form-preview__label">&nbsp;&nbsp;&nbsp;&nbsp;办理人：</label>
                                <span class="weui-form-preview__value">{{data.executor}}</span>
                            </div>
                            <div class="weui-form-preview__item">
                                <div style="text-align: right;"><x-button @click.native="selectInputPerson(data)" style="border:0px;" :plain="buttonPlain" mini>选择/变更办理人</x-button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
        <div style="padding:10px 13px;">
            <div style="padding:10px 13px;display: inline;width:100px;">参与人：</div>
            <div style="display: inline">
                <span style="margin-left: 10px;" v-for="cyr in canYuRenData">{{cyr.text}}</span>
            </div>
            <div style="text-align: right;"><x-button @click.native="selectInputPerson({},'CYR')" style="border:0px;" :plain="buttonPlain" mini>选择参与人</x-button></div>
        </div>

        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson"
                           :designatedCardUrls="designatedCardUrls"
                           :specifiedOrgIds="specifiedOrgIds"
                           :showTab="showTab"
                           :initialSelectedType="'cardUrl'"
                           :showPicker="showPersonPicker"
                           :multiple="multipleForSelPerson"
                           @picked="onPicked"
                           @abort="onPickAbort"></org-member-picker>
    </div>
</template>

<script>
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';

    import {
        Group,XInput,XTextarea,Datetime,Cell,XButton

    } from 'vux'
    export default {
        name:"showNodeAndSelExecutor",
        components: {
            Group,XInput,XTextarea,Datetime,Cell,XButton,OrgMemberPicker
        },
        data() {
            return {
                multipleForSelPerson:false,
                designatedCardUrls:[],
                specifiedOrgIds:[],
                buttonPlain:true,
                initSelectPerson:[],
                showPersonPicker: false,
                curHandleNode:{},
                showTab:["colleague","designatedPersonnel"],
            };
        },
        //钩子加载完触发
        created: function () {

            //处理节点数据
            this.handleLinkNodeData();


        },
        props: {
            nodeData:{
                type: Array,
                default:function(){
                    return [];
                }
            },
            canYuRenData:{
                type: Array,
                default:function(){
                    return [];
                }
            }
        },
        methods: {
            selectInputPerson(data,selType) {
                if(selType!=undefined && selType=="CYR"){
                    this.multipleForSelPerson = true;
                }else{
                    this.multipleForSelPerson = false;

                    //处理组织的显示
                    let fwForOrgIdStr = data.fwForOrgId;
                    if(fwForOrgIdStr!=undefined && fwForOrgIdStr.length>0){
                        this.specifiedOrgIds = fwForOrgIdStr.split(",");
                    }

                    //处理人员的显示
                    let cardUrlStr = data.ZXRFWForCardUrl;
                    if(cardUrlStr!=undefined && cardUrlStr.length>0){
                        this.designatedCardUrls = cardUrlStr.split(",");
                    }

                }
                this.initSelectPerson.push();
                this.showPersonPicker = true;
                this.curHandleNode = data;
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
                    if(this.multipleForSelPerson){
                        for(let i=0;i<selTemp.length;i++){
                            let dTemp = {
                                id:selTemp[i].value,
                                text:selTemp[i].key
                            };
                            this.canYuRenData.push(dTemp);
                        }
                    }else{
                        for(let i=0;i<this.nodeData.length;i++){
                            if(this.nodeData[i].nodeId == this.curHandleNode.nodeId){
                                this.nodeData[i].cardUrl = selTemp[0].value;
                                this.nodeData[i].executor = selTemp[0].key;
                                this.nodeData[i].executor_name = selTemp[0].key;
                            }
                        }
                        this.handleLinkNodeData();
                    }


                }

            },
            handleLinkNodeData(){
                let nodeDataTemp = this.nodeData;
                for(let i=0 ;i<nodeDataTemp.length;i++){
                    let stepType = nodeDataTemp[i].stepType;
                    let linkNodeNumStr = nodeDataTemp[i].linkNodeNum;
                    let linkNodeIdStr = nodeDataTemp[i].linkNodeId;
                    if(stepType=="YG"){

                        if(linkNodeNumStr!=undefined && linkNodeNumStr!=""){
                            //获取联动节点的数据
                            if(linkNodeIdStr!=undefined && linkNodeIdStr!=""){
                                for(let k=0;k<nodeDataTemp.length;k++){
                                    if(linkNodeIdStr == nodeDataTemp[k].nodeId){
                                        nodeDataTemp[i].cardUrl = nodeDataTemp[k].cardUrl;
                                        nodeDataTemp[i].executor = nodeDataTemp[k].executor;
                                        nodeDataTemp[i].executor_name = nodeDataTemp[k].executor_name;
                                    }
                                }
                            }else{
                                for(let j=0;j<nodeDataTemp.length;j++){
                                    let linkNodeTemp = nodeDataTemp[j].linkNodeId==undefined?"":nodeDataTemp[j].linkNodeId;
                                    if(linkNodeNumStr==nodeDataTemp[j].serial && (linkNodeTemp=="" || linkNodeTemp==undefined)){
                                        //更新当前节点的执行人在缓存变量中的数据
                                        nodeDataTemp[i].cardUrl = nodeDataTemp[j].cardUrl;
                                        nodeDataTemp[i].executor = nodeDataTemp[j].executor;
                                        nodeDataTemp[i].executor_name = nodeDataTemp[j].executor_name;
                                    }
                                }
                            }
                        }
                    }
                }
                this.nodeData = nodeDataTemp;
            }
        }
    };
</script>

<style lang="stylus">
    .formFontSize{
        font-size: 16px !important;
    }

    .vux-form-preview {
        overflow: hidden;
        margin-top: -1px;
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
        border-top: 1px solid #D9D9D9;
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
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .weui-form-preview__hd {
        position: relative;
        padding: 2px 8px;
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
        text-align: left;
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
        left: 8px;
        right:8px;
    }
    .weui-form-preview__bd {
        padding: 10px 8px;
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
        line-height: 50px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
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
</style>
