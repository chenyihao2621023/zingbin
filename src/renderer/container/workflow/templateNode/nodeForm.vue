<template>
    <div class="nodeForm-picker" v-transfer-dom>
        <popup v-model="showNodeForm"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="nodeForm-picker-popup">
                <zing-head class="nodeForm-picker-head"
                           title=""
                           :isComeBack="false"
                           @doSome="cancleClick">
                </zing-head>
                <div class="nodeForm">
                    <x-input style="font-size: 16px;" class="formFontSize"
                             title="节点名称&nbsp;<span style='color: red;'>*</span>："
                             placeholder="请填写节点名称"
                             v-model="formParams.stepName"></x-input>
                    <selector style="font-size: 16px;" title="节点类型&nbsp;<span style='color: red;'>*</span>: "
                              :options="templateTypeArray"
                              v-model="formParams.stepType" required placeholder=""></selector>
                    <selector style="font-size: 16px;" title="节点审批人&nbsp;<span style='color: red;'>*</span>: "
                              :readonly="formParams.isFaQiNode=='是'?true:false"
                              :options="executorType"
                              v-model="formParams.executorType" required placeholder=""></selector>

                    <cell style="font-size: 16px;" v-show="formParams.executorType=='ZDCY'"
                          title="指定成员: "
                          is-link="true"
                          @click.native="selectInputPerson()"
                    >点击选择指定成员
                    </cell>
                    <tag-group :items="items" @onChange="tagChanged" style="text-align:right"></tag-group>

                    <!-- 如果是请假模板 则 显示是否设置扣薪 -->
                    <x-switch style="font-size: 16px;" v-if="templateData.moduleType=='TYPE_HR_QJ'" title="扣薪按钮："
                              :value-map="['', 'BTN_HR_KQ']"
                              v-model="formParams.attributeCode"
                    ></x-switch>

                    <!-- 如果是凭证模板 则 显示是否设置审核完成 -->
                    <x-switch style="font-size: 16px;" v-if="(templateData.moduleType=='MODULE_TYPE_ZYK' || templateData.moduleType=='MT_GDZC') && isShowSHWC" title="审核完成按钮："
                              :value-map="['', 'BTN_SHWC']"
                              v-model="formParams.attributeCode"
                    ></x-switch>

                    <div v-show="showSetQzjd">
                        <cell style="font-size: 16px;" title="前置节点:"
                              is-link="true"
                              @click.native="openPreNode"
                        >点击选择前置节点</cell>
                        <div style="text-align: right">
                            <tag v-for="(item, index) in selPreNodeName" :key="index">{{item}}</tag>
                        </div>
                    </div>
                    <x-switch style="font-size: 16px;" title="是否为发起节点："
                              :inline-desc="isDisabledForFaQiNode?'注：系统自动控制，只需在其他节点直接设置，此节点会自动取消。':''"
                              :value-map="['否', '是']"
                              :disabled="isDisabledForFaQiNode"
                              v-model="formParams.isFaQiNode"
                              @on-change="isFqNodeChange"
                    ></x-switch>

                </div>
                <flexbox>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button type="primary" class="btn-save" @click.native="cancleClick">取消</x-button>
                    </flexbox-item>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button type="primary" class="btn-common" @click.native="checkSubmit">确定</x-button>
                    </flexbox-item>
                </flexbox>

            </div>
            <pre-node :showPreNode="showPreNode"
                      :preNodeData="preNodeData"
                      :initSel="initSel"
                      @handleSelData="handleSelPreNodeData"
                      @cancleClick="cancleClick('preNode')"
            ></pre-node>
            <!-- 选人组件 -->
            <org-member-picker ref="picker"
                               :initialSelected="insertNew"
                               initialSelectedType="rowId"
                               :multiple="true"
                               :showTab="showTab"
                               :showPicker="showPersonPicker"
                               @picked="onPicked"
                               @abort="onPickAbort"></org-member-picker>
            <confirm v-model="confirmShow.confirmOne" title = "提示" @on-confirm="submit">
                <p style="text-align:left;">是否将此节点设置为发起节点？（将此节点设置为发起节点后，将重置此节点与原发起节点的审批执行人与前置节点，请注意及时修改。且此节点的审批执行人将默认为发起人且无法修改！）</p>
            </confirm>
        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
    import TagGroup from "@/components/taggroup/TagGroup";
    import preNode from "@/container/workflow/templateNode/preNode";
    import Tag from "@/components/tag/Tag";

    import { XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,
        Popup,
        Cell,
        Selector,
        XSwitch,
        Confirm,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "nodeForm",
        components: {
            ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell,OrgMemberPicker,Selector,XSwitch,TagGroup,preNode,Tag,Confirm
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                insertNew: [],
                isShowSHWC:true,
                showSetQzjd:true,
                items: [],
                showPersonPicker:false,
                isDisabledForFaQiNode:false,
                showPreNode:false,
                preNodeData:[],
                selPreNodeName:[],
                selPreNodeId:[],
                notSelPreNode:[],
                initSel:[],
                showTab: ["org","colleague","role"],
                templateTypeArray: [],
                context: [
                    {
                        key: "text",
                        value: "文本"
                    },
                    {
                        key: "language",
                        value: "语音"
                    }
                ],
                formParams:{
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
                },
                executorType:[
                    {
                        key: "ZDCY",
                        value: "指定成员"
                    },
                    {
                        key: "BMLD",
                        value: "部门领导"
                    },
                    {
                        key: "FQR",
                        value: "发起人"
                    }
                ],
                confirmShow:{
                    confirmOne:false
                },
            }
        },
        props:{
            showNodeForm: {
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
            orgRoleUserData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            allNodeData:{
                type: Array,
                default:function(){
                    return [];
                }
            }
        },
        watch: {
            formData:{
                handler:function(){
                    this.initPage();
                }

            },
            items:{
                handler:function(val,oldval){
                    this.$forceUpdate();
                }
            }
        },
        created() {
            this.initPage();
        },
        methods: {
            initPage(){
                let vm  = this;

                vm.isDisabledForFaQiNode=false;

                //渲染表单数据
                for(let key in vm.formData){
                    if(vm.formParams.hasOwnProperty(key)){
                        vm.formParams[key] = vm.formData[key];
                    }
                }
                let templateTypeForOtherModuleTemp = this.templateData.templateTypeForOtherModule==undefined?"":this.templateData.templateTypeForOtherModule;
                if(templateTypeForOtherModuleTemp.indexOf('childOtherIn')>=0
                    || templateTypeForOtherModuleTemp.indexOf('childOtherOut')>=0
                    || templateTypeForOtherModuleTemp.indexOf('DBD')>=0){
                    this.isShowSHWC = false;

                }
                if (vm.formData.nodeId != undefined && vm.formData.nodeId != ""){
                    this.selPreNodeName=[];
                    vm.handlePersonShow();
                    if(vm.formData.isFaQiNode=="是"){
                        vm.isDisabledForFaQiNode = true;
                    }else{
                        vm.isDisabledForFaQiNode = false;
                    }

                    let curNodePreNodeId = this.formData.relationNodes;
                    let curNodePreNodeName = this.formData.relationNodesName;
                    if(curNodePreNodeId!=undefined && curNodePreNodeId!=""){
                        this.selPreNodeId = curNodePreNodeId.split(",");
                    }else{
                        this.selPreNodeId=[];
                    }
                    if(curNodePreNodeName!=undefined && curNodePreNodeName!=""){
                        this.selPreNodeName = curNodePreNodeName.split(",");
                    }else{
                        this.selPreNodeName=[];
                    }
                    this.initSel = this.selPreNodeId;

                }else{
                    this.selPreNodeId=Object.assign([],[]);
                    this.selPreNodeName=Object.assign([],[]);
                    this.initSel = Object.assign([],[]);
                    this.items=Object.assign([],[]);
                }

                if(vm.templateData.templateType === 'YG'){
                    vm.templateTypeArray= [
                        {
                            key: "YG",
                            value: "员工"
                        }
                    ]
                    vm.formParams.stepType="YG";
                } else{
                    vm.templateTypeArray= [
                        {
                            key: "YG",
                            value: "员工"
                        },
                        {
                            key: "KH",
                            value: "客户"
                        }
                    ]
                }
            },
            handlePersonShow(){
                this.items=[];
                let arr = [];
                let userArr = this.formData.cardUrl==undefined || this.formData.cardUrl==""?"":this.formData.cardUrl.split(",");
                let orgArr = this.formData.fwForOrgId==undefined || this.formData.fwForOrgId==""?"":this.formData.fwForOrgId.split(",");
                let roleArr = this.formData.fwForRoleId==undefined || this.formData.fwForRoleId==""?"":this.formData.fwForRoleId.split(",");

                arr = arr.concat(userArr);
                arr = arr.concat(orgArr);
                arr = arr.concat(roleArr);

                //处理组织 和 用户
                let orgAndUserData = this.orgRoleUserData.orgUserDatas;
                for(let i in orgAndUserData){
                    this.recursionOrgAndUser(orgAndUserData[i],arr);
                }
                //处理角色
                let roleData = this.orgRoleUserData.roleDatas;
                for(let i in roleData){
                    this.recursionRole(roleData[i],arr);
                }
            },
            recursionOrgAndUser(orgAndUser,arr){

                if(arr.indexOf(orgAndUser.id)>=0){
                    this.items.push(
                        {
                            key: orgAndUser.text,
                            value: orgAndUser.id,
                            level: "info",
                        }
                    );
                }
                if(orgAndUser.users!=undefined && orgAndUser.users.length>=0){
                    for(let i in orgAndUser.users){
                        if(arr.indexOf(orgAndUser.users[i].cardUrl)>=0){
                            let isExist = false;
                            for(let k in this.items){
                                if(this.items[k].value == orgAndUser.users[i].cardUrl){
                                    isExist = true;
                                    break;
                                }
                            }
                            if(!isExist){
                                this.items.push({
                                    key: orgAndUser.users[i].userName,
                                    value: orgAndUser.users[i].cardUrl,
                                    level: "default",
                                });
                            }
                        }
                    }

                }
                if(orgAndUser.children!=undefined && orgAndUser.children.length>0){
                    for(let i in orgAndUser.children){
                        this.recursionOrgAndUser(orgAndUser.children[i],arr);
                    }
                }
            },
            recursionRole(role,arr){
                if(arr.indexOf(role.roleInfoId)>=0){
                    this.items.push(
                        {
                            key: role.roleInfoName,
                            value: role.roleInfoId,
                            level: "success",
                        }
                    );
                }

            },
            checkSubmit(){
                //如果勾选了设置为发起节点则进行提示
                if(this.formParams.isFaQiNode=="是" && (this.formData.isFaQiNode=="否" || this.formData.isFaQiNode=="")){
                    this.confirmShow.confirmOne = true;
                }else{
                    this.submit();
                }
            },
            submit() {
                let vm = this;
                let url = "";
                let params = {};
                if (vm.formData.nodeId != undefined && vm.formData.nodeId!="") {
                    url = "/zingbiz/workflow/node/updateOneNode";
                    vm.formParams.nodeId = vm.formData.nodeId;
                    if(vm.formData.isFaQiNode == vm.formParams.isFaQiNode){
                        delete vm.formParams.isFaQiNode
                    }
                } else {
                    delete vm.formParams.nodeId;
                    url = "/zingbiz/workflow/node/addOneNode";
                }
                if (vm.formParams.stepName === undefined || vm.formParams.stepName === "") {
                    vm.$vux.toast.text("请输入节点名称",'top');
                    return;
                }
                if (vm.formParams.stepType === undefined || vm.formParams.stepType === "") {
                    vm.$vux.toast.text("请选择节点类型",'top');
                    return;
                }

                if(vm.formParams.executorType==undefined || vm.formParams.executorType==""){
                    vm.$vux.toast.text("请选择节点审批人",'top');
                    return;
                }
                if(vm.formParams.executorType=="ZDCY"){
                    if((vm.formParams.cardUrl==undefined || vm.formParams.cardUrl=="")
                        && (vm.formParams.fwForOrgId==undefined || vm.formParams.fwForOrgId=="")
                        && (vm.formParams.fwForRoleId==undefined || vm.formParams.fwForRoleId=="")
                    ){
                        vm.$vux.toast.text("请选择指定成员",'top');
                        return;
                    }
                }
                vm.formParams.templateId = vm.templateData.templateId;
                if(this.selPreNodeId!=undefined && this.selPreNodeId.length>0){
                    vm.formParams.relationNodes = this.selPreNodeId.join(",");
                    vm.formParams.relationNodesName = this.selPreNodeName.join(",");
                }else{
                    vm.formParams.relationNodes = "";
                    vm.formParams.relationNodesName = "";
                }

                this.$http.post(url, vm.formParams).then(res => {
                    if (res.data.success === 'true') {
                    this.$emit("reload");
                    vm.$vux.toast.text("新建成功！",'top');
                } else {
                    vm.$vux.toast.text(res.data.msg == undefined ? res.data.mgs : res.data.msg,'top');
                }
            });

            },
            cancleClick(type) {
                if(type=="preNode"){
                    this.showPreNode=false;
                }else{
                    this.$emit("cancleClick");
                }

            },
            selectInputPerson() {
                this.insertNew = this.items;
                this.flag = 1;
                this.showPersonPicker = true;
            },
            onPicked(list) {
                this.showPersonPicker = false;
                this.items = list.map(item => {
                    if(item.type=="dept"){
                        this.formParams.fwForOrgId += this.formParams.fwForOrgId==undefined || this.formParams.fwForOrgId==""?""+item.id:","+item.id;
                        this.formParams.fwForOrgName += this.formParams.fwForOrgName==undefined || this.formParams.fwForOrgName==""?""+item.title:","+item.title;
                    }

                    if(item.type=="user"){
                        this.formParams.cardUrl += this.formParams.cardUrl==undefined || this.formParams.cardUrl==""?""+item.id:","+item.id;
                        this.formParams.executor += this.formParams.executor==undefined || this.formParams.executor==""?""+item.title:","+item.title;
                        this.formParams.executor_name += this.formParams.executor_name==undefined || this.formParams.executor_name==""+item.title?"":","+item.title;
                    }

                    if(item.type=="role"){
                        this.formParams.fwForRoleId += this.formParams.fwForRoleId==undefined || this.formParams.fwForRoleId==""?""+item.id:","+item.id;
                        this.formParams.fwForRoleName += this.formParams.fwForRoleName==undefined || this.formParams.fwForRoleName==""?""+item.title:","+item.title;
                    }
                    let map = {
                        key: item.title,
                        value: item.id,
                        level: this.$refs.picker.getLevel(item.type)
                    };
                return map;
            });
                console.log("成员数据",this.formParams)
                /*this.insertNew1 = list.map(item => item.rowId)*/
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            tagChanged(arr) {
                //this.items = arr;
            },
            openPreNode(){

                /**
                 * 整理前置节点数据
                 * 1.添加时任何均可选择
                 * 2.修改时不能选择已经设置自己为前置节点的节点
                 * @type {boolean}
                 */
                let preNodeDataArr = [];
                let allNodeJson = {};
                if (this.formData.nodeId != undefined && this.formData.nodeId!="") {
                    let curNodeId = this.formData.nodeId;

                    //筛选掉已经设置了自己为前置节点的节点数据
                    this.allNodeData.filter(function(item){
                        allNodeJson[item.nodeId] = item;
                        let relationNodesStr = item.relationNodes;
                        if(item.nodeId!=curNodeId && item.isFaQiNode!='是' && item.stepType!="FP"){
                            if(relationNodesStr!=undefined && relationNodesStr!=""){
                                if(relationNodesStr.indexOf(curNodeId)<0){
                                    preNodeDataArr.push({
                                        key: item.nodeId,
                                        value: item.stepName
                                    });
                                }
                            }else{
                                preNodeDataArr.push({
                                    key: item.nodeId,
                                    value: item.stepName
                                });
                            }
                        }

                    });
                    //筛选掉可选节点中是否存在前序节点为当前节点的数据
                    let curEditNodeId = this.formData.nodeId;
                    for(let i in preNodeDataArr){
                        let preNodeId = preNodeDataArr[i].key;
                        this.handlePreNodeData(allNodeJson,curEditNodeId,preNodeId,preNodeId);
                    }
                    let canSelPreNodeData = [];
                    let self = this;
                    if(this.notSelPreNode!=undefined && this.notSelPreNode.length>0){
                        preNodeDataArr.filter(function(item){
                            if(self.notSelPreNode.indexOf(item.key)<0){
                                canSelPreNodeData.push(item);
                            }
                        });
                        this.preNodeData = canSelPreNodeData;
                    }else{
                        this.preNodeData = preNodeDataArr;
                    }

                }else{
                    this.allNodeData.filter(function(item){
                        if(item.isFaQiNode!='是' && item.stepType!="FP"){
                            preNodeDataArr.push({
                                key: item.nodeId,
                                value: item.stepName
                            })
                        }
                    });
                    this.preNodeData = preNodeDataArr;
                }

                this.showPreNode=true;
            },
            handlePreNodeData(allNodeJson,curEditNodeId,curPreNodeId,nodeId){
                //判断是否有前置节点
                let otherNodeData =allNodeJson[nodeId];
                if(otherNodeData!=undefined){
                    let preNode = otherNodeData.relationNodes;
                    if(preNode!=undefined && preNode!=""){
                        if(preNode.indexOf(curEditNodeId)>=0){
                            this.notSelPreNode.push(curPreNodeId);
                        }
                        let preNodeArr = preNode.split(",");
                        for(let i in preNodeArr){
                            this.handlePreNodeData(allNodeJson,curEditNodeId,curPreNodeId,preNodeArr[i]);
                        }
                    }

                }
            },
            handleSelPreNodeData(selData){
                this.selPreNodeName=[];
                //获取节点id对应的节点名称
                if(selData!=undefined && selData.length>0){
                    for(let i=0;i<selData.length;i++){
                        let nodeIdStr = selData[i];
                        for(let j=0;j<this.preNodeData.length;j++){
                            if(nodeIdStr==this.preNodeData[j].key){
                                this.selPreNodeName.push(this.preNodeData[j].value);
                            }
                        }
                    }
                }
                this.selPreNodeId = selData;

                this.cancleClick("preNode");
            },
            isFqNodeChange(value){
                if(value=="是"){
                    this.showSetQzjd = false;
                    this.selPreNodeName=[];
                    this.selPreNodeId=[];
                    this.items=[];
                    this.formParams.executorType="FQR";
                }else{
                    this.showSetQzjd=true;
                }
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .nodeForm-picker {
    .vux-popup-dialog {
        z-index: 800;
    }

    .nodeForm-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .nodeForm {
        height: 85.2%;
        overflow-y: scroll;
    }

    .formFontSize{
        font-size: 16px !important;
    }

</style>

