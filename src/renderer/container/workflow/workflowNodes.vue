<template>
    <div style="height: 100%;">
        <ZingHead :title="title">
            <div slot="header-right">
        <span @click="authorized">
          <i style="font-style: normal;" v-show="isAuthorized">模板授权</i>
        </span>
                <span class="header-jiahao">
          <i class="iconfont icon-gengduo" @click="handleMenu"></i>
        </span>
            </div>
        </ZingHead>
        <div class="scroll-list-wrap" :style="{ height: screenHeight  + 'px',overflow:'auto' }">
            <scroll ref="scroll" :data="templateNodes" :scrollbar="true" :startY="0"
                    :pullUpLoad="{threshold: 0, txt: {more: 'more', noMore: 'noMore'}}"
                    @pullingUp="onPullingUp">
                <GridCard v-for="(item ,index) in templateNodes" :key="index">
                    <div slot="cardLeft" class="left">
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.serial}}:{{item.stepName}}</p>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <i class="iconfont icon-gengduo" @click="selItem(item)"></i>
                    </div>
                </GridCard>
            </scroll>
            <confirm v-model="showConfirm" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm">
                <p style="text-align:center;">是否确认执行此操作？</p>
            </confirm>
            <actionsheet v-model="showDialog" :menus="menuNodes" theme="android" @on-click-menu="click">
            </actionsheet>
        </div>
        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
        <workform-nodes :modelTitle="modelTitle"
                        :showPopupDate="isShow"
                        :getTempNodes="dataNodes"
                        :templateNodeOthor="initData"
                        @backClick="clickBack"
                        @submitClick="submit"
                        @cancleclick="cancle"></workform-nodes>
        <before-Nodes :showPopupDate="showPopupbefore"
                      :showbefore="ShowBefore"
                      :beforeData="beforeData"
                      :initSel="initSelRelationNode"
                      @change="changeBefore"
                      @backClick="clickBack1"
                      @submitClick="submitItem"
                      @cancleclick="cancleItem"></before-Nodes>
        <node-Attribute :showPopupDate="showPopupAtt"
                        :attrbuteData="attrbuteData"
                        :initSelAttribute="attributeName"
                        @backClick="clickBack2"
                        @submitClick="submitNode"
                        @cancleclick="cancleNode"></node-Attribute>
    </div>
</template>
<script>
    import {
        Confirm,
        Actionsheet,
        Group,
        XButton,
        Flexbox,
        CheckIcon,
        FlexboxItem,
        XInput,
        Selector,
        XTextarea
    } from "vux";
    import Scroll from "../../components/scroll/Scroll";
    import ZingHead from "@/components/zingHead/ZingHead";
    import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
    import GridCard from "@/components/gridcard/GridCard";
    import workformNodes from "@/container/workflow/workflowNodes/workflowNodeEdit";
    import beforeNodes from "@/container/workflow/workflowNodes/beforeNodes";
    import nodeAttribute from "@/container/workflow/workflowNodes/nodeAttribute";
    import ImagePicker from "components/imagepicker/ImagePicker";
    import { Z_IsEmpty20 } from "@/utils/fn";
    export default {
        components: {
            XTextarea,
            Scroll,
            beforeNodes,
            nodeAttribute,
            OrgMemberPicker,
            workformNodes,
            GridCard,
            CheckIcon,
            ImagePicker,
            ZingHead,
            Confirm,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            Actionsheet,
            Group,
            XButton
        },
        data() {
            return {
                showDialog: false, //三个点标识
                title: "审批流模板节点",
                paramsData: "",
                isAuthorized: false,
                isShow: false,
                showPopupAtt: false,
                beforeData: [],
                showPopupbefore: false,
                ShowBefore: false,
                attributeName: [],
                attrbuteData:[],
                initSelRelationNode:[],
                more: true,
                screenHeight: 0,
                dataNodes: {},
                connection: false,
                worknodes: "",
                modelTitle: "",
                headImgSrc: [], // 图片文件
                showToast: false, // 属性修改窗口
                showConfirm: false, // 禁止分类窗口
                initSelectPerson: [],
                isAuthRole: [],
                beforeChooseData:'',
                showPersonPicker: false,
                curItem: {},
                updateorAdd:"",
                menuNodes: [
                    {
                        label: "属性修改",
                        value: "update"
                    },
                    {
                        label: "删除",
                        value: "delete"
                    },
                    {
                        label: "节点附加属性",
                        value: "nodesAttr"
                    },
                    {
                        label: "前序节点",
                        value: "beforenodes"
                    }
                ],
                initData: [],
                templateNodes: [],
                pageNumber:1,
                pageSize:20,
            };
        },
        created() {
            let vm = this;
            vm.paramsData = vm.$route.query;
            if (vm.paramsData.moduleType === "" || vm.paramsData.moduleType === "typeForPuTongShenPi") {
                vm.isAuthorized = true;
                vm.isAuthRole = ["role"];
            }
            vm.getData();
            vm.beforeTemp();
            this.screenHeight = document.documentElement.clientHeight - 100;
        },
        methods: {

            onPullingUp() {
                let self = this;
                setTimeout(() => {
                    self.getData();
            }, 1000);
            },
            handlePaging(_data){
                let self = this;
                //默认都有下一页数据
                self.pageNumber++;
                if(_data!=undefined && _data.length<self.pageSize){
                    this.$refs.scroll.forceUpdate(false);
                }else{
                    this.$refs.scroll.forceUpdate(true);
                }

            },
            //节点模板授权
            authorized() {
                this.showPersonPicker = true;
            },
            getUpdate() {
                let vm = this;
                let url = "";
                let params = {};
                if (vm.updateorAdd === "update") {
                    url = "/zingbiz/workflow/node/updateOneNode";
                } else {
                    url = "/zingbiz/workflow/node/addOneNode";
                }
                if (vm.dataNodes.stepType === undefined || vm.dataNodes.stepType === "") {
                    vm.$vux.toast.text("请选择节点类型",'top');
                    return;
                }
                if (vm.dataNodes.serial === undefined || vm.dataNodes.serial === "") {
                    vm.$vux.toast.text("请输入顺序号(1~999)",'top');
                    return;
                }
                if (vm.dataNodes.serial <1 || vm.dataNodes.serial >999) {
                    vm.$vux.toast.text("顺序号范围1~999",'top');
                    return;
                }
                if (vm.dataNodes.stepName === undefined || vm.dataNodes.stepName === "") {
                    vm.$vux.toast.text("请输入节点名称",'top');
                    return;
                }
                if (
                    vm.dataNodes.description === undefined ||
                    vm.dataNodes.description === ""
                ) {
                    vm.$vux.toast.text("请输入节点描述",'top');
                    return;
                }
                if (
                    vm.dataNodes.defaultContentForExecute === undefined ||
                    vm.dataNodes.defaultContentForExecute === ""
                ) {
                    vm.$vux.toast.text("请输入默认执行内容",'top');
                    return;
                }
                let isDefCreator = "";
                if (vm.dataNodes.isDefCreator === true) {
                    isDefCreator = "是";
                } else {
                    isDefCreator = "否";
                }
                if (vm.curItem.isDefCreator === "是") {
                    vm.dataNodes.connection === true;
                } else {
                    vm.dataNodes.connection === false;
                }
                params = {
                    stepType: vm.dataNodes.stepType,
                    serial: vm.dataNodes.serial,
                    stepName: vm.dataNodes.stepName,
                    description: vm.dataNodes.description,
                    defaultContentForExecute: vm.dataNodes.defaultContentForExecute,
                    executeType: vm.dataNodes.executeType,
                    fwForOrgId: vm.dataNodes.fwForOrgId,
                    fwForOrgName: vm.dataNodes.fwForOrgName,
                    fwForRoleId: vm.dataNodes.fwForRoleId,
                    fwForRoleName: vm.dataNodes.fwForRoleName,
                    executor_name: vm.dataNodes.executor_name,
                    executor: vm.dataNodes.executor,
                    cardUrl:vm.dataNodes.cardUrl,
                    linkNodeNum:vm.dataNodes.linkNodeNum,
                    isDefCreator: isDefCreator,
                    templateId: vm.paramsData.templateId
                };
                let nodeId = vm.curItem.nodeId ? { nodeId: vm.curItem.nodeId } : {};
                params = Object.assign({}, params, nodeId);
                this.$http.post(url, params).then(res => {
                    if (res.data.success === 'true') {
                    vm.isShow = false;
                    vm.reloadData();
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            clickBack() {
                this.isShow = false;
            },
            // 编辑/添加数据提交
            submit() {
                this.getUpdate();
            },
            cancle() {
                this.isShow = false;
            },
            submitItem(data) {
                let vm = this;
                let url = "/zingbiz/workflow/node/addRelationNode";
                let relationNodesStr = "";
                let relationNodesNameStr = "";
                let selData = data.curSelRelationNode;
                if(!Z_IsEmpty20(selData) && selData.length>0){
                    for(let i=0 ;i<selData.length;i++){
                        let nodeId = selData[i];
                        if(!Z_IsEmpty20(nodeId)){
                            relationNodesStr+=""+nodeId+",";
                            //获取节点id对应的节点名称
                            for(let j=0;j<vm.beforeData.length;j++){
                                if(nodeId==vm.beforeData[j].key){
                                    relationNodesNameStr+=""+vm.beforeData[j].value+",";
                                }
                            }
                        }
                    }
                    if(relationNodesStr.length!=0 && relationNodesStr!=undefined){
                        relationNodesStr=relationNodesStr.substring(0,relationNodesStr.length-1);
                    }
                    if(relationNodesNameStr.length!=0 && relationNodesNameStr!=undefined){
                        relationNodesNameStr=relationNodesNameStr.substring(0,relationNodesNameStr.length-1);
                    }
                }else if(vm.curItem.relationNodes==undefined || vm.curItem.relationNodes==""){
                    vm.$vux.toast.text("请先进行选择！",'top');
                    return false;
                }
                let params = {};
                params.nodeId = vm.curItem.nodeId;
                params.relationNodes=relationNodesStr;
                params.relationNodesName=relationNodesNameStr;
                this.$http.post(url, params).then(res => {
                    console.info(res.data);
                vm.showPopupbefore = false;
                if (res.data.success == "true") {
                    vm.reloadData();
//                    vm.$vux.toast.text("变更前序节点成功。",'top');
                } else {
                    vm.$vux.toast.text("变更前序节点异常。",'top');
                }
            });

            },
            cancleItem() {
                this.showPopupbefore = false;
            },
            clickBack1() {
                this.showPopupbefore = false;
            },
            submitNode(data) {
                let vm = this;
                let url = "/zingbiz/workflow/node/updateOneNode";
                let nodeAttributeCodeStr = "";
                let nodeAttributeNameStr = "";

                let selData = data.selAttrbuteArr;
                if(!Z_IsEmpty20(selData) && selData.length>0){
                    for(let i=0 ;i<selData.length;i++){
                        nodeAttributeCodeStr += selData[i].key+",";
                        nodeAttributeNameStr += selData[i].value+",";
                    }
                    if(nodeAttributeCodeStr.length!=0 && nodeAttributeCodeStr!=undefined){
                        nodeAttributeCodeStr=nodeAttributeCodeStr.substring(0,nodeAttributeCodeStr.length-1);
                    }
                    if(nodeAttributeNameStr.length!=0 && nodeAttributeNameStr!=undefined){
                        nodeAttributeNameStr=nodeAttributeNameStr.substring(0,nodeAttributeNameStr.length-1);
                    }
                }else if(vm.curItem.attributeCode==undefined || vm.curItem.attributeCode==""){
                    vm.$vux.toast.text("请先进行选择！",'top');
                    return false;
                }


                let nodeId = vm.curItem.nodeId;
                let params = {};
                params.nodeId = nodeId;
                params.attributeCode=nodeAttributeCodeStr;
                params.attributeName=nodeAttributeNameStr;

                this.$http.post(url, params).then(res => {
                    if (res.data.success === 'true') {
                    vm.showPopupAtt = false;
                    vm.reloadData();
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });

            },
            cancleNode() {
                this.showPopupAtt = false;
            },
            clickBack2() {
                this.showPopupAtt = false;
            },
            // 获取节点列表数据
            getData() {
                let vm = this;
                let url = "/zingbiz/workflow/node/loadAllNodeByTemplate";
                let params = {
                    templateId: vm.paramsData.templateId,
                    pageSize: vm.pageSize,
                    pageNumber: vm.pageNumber
                };
                this.$http.post(url, params).then(res => {
                    console.info(res.data.data);
                if (res.data.data.total > 0) {
                    let _data = res.data.data.data;
                    _data.forEach(item => {
                        if(item!=undefined){
                        vm.templateNodes.push(item);
                    }
                });
                    vm.handlePaging(_data);
                } else {
//                    vm.$vux.toast.text("没有搜索到结果",'top');
                }
            });
            },
            onCancel() {
                console.log("on cancel");
            },
            onConfirm(msg) {
                let vm = this;
                vm.deleteNodes();
            },
            beforeTemp() {
                let vm = this;
                vm.initData = [
                    {
                        key: "",
                        value: "请选择"
                    }
                ];
                console.info("before");
                if (vm.templateNodes.length > 0) {
                    console.info(vm.paramsData.serial);
                    vm.templateNodes.forEach(item => {
                        if(item.stepType!="FP"){
                            if(vm.curItem.nodeId!=undefined && vm.curItem.nodeId!=""){
                                if(item.nodeId != vm.curItem.nodeId && (item.linkNodeNum == "" || item.linkNodeNum==undefined)){
                                    vm.initData.push({
                                        key: item.serial,
                                        value: item.serial + "-" + item.stepName
                                    });
                                }
                            }else if(item.linkNodeNum==undefined || item.linkNodeNum == ""){
                                vm.initData.push({
                                    key: item.serial,
                                    value: item.serial + "-" + item.stepName
                                });
                            }
                        }

                    });
                }
            },
            changeBefore(value, label) {
                let vm = this;
                console.info(label)
                vm.beforeChooseData = label;
            },
            handleMenu(data) {
                let vm = this;
                vm.updateorAdd = "add";
                vm.dataNodes.type = "add";
                vm.modelTitle = "添加";
                vm.isShow = true;
                vm.dataNodes = {
                    stepType: "",
                    serial: "",
                    description: "",
                    defaultContentForExecute: "",
                    executeType: "",
                    fwForOrgName: "",
                    executor_name: "",
                    executor: "",
                    linkNodeNum:"",
                    isDefCreator: false
                };
                vm.initData = [];
                vm.curItem = {};
                vm.beforeTemp();
            },
            click(key, item) {
                let vm = this;
                if (key === "update") {
                    vm.dataNodes.type = "update";
                    vm.updateorAdd = "update";
                    vm.modelTitle = "属性修改";
                    vm.isShow = true;
                    vm.initData = [];
                    vm.beforeTemp();
                    vm.dataNodes = {
                        stepType: vm.curItem.stepType,
                        serial: vm.curItem.serial,
                        stepName: vm.curItem.stepName,
                        description: vm.curItem.description,
                        defaultContentForExecute: vm.curItem.defaultContentForExecute,
                        executeType: vm.curItem.executeType,
                        fwForOrgId: vm.curItem.fwForOrgId,
                        fwForOrgName: vm.curItem.fwForOrgName,
                        fwForRoleId: vm.curItem.fwForRoleId,
                        fwForRoleName: vm.curItem.fwForRoleName,
                        executor: vm.curItem.executor,
                        executor_name: vm.curItem.executor_name,
                        cardUrl:vm.curItem.cardUrl,
                        linkNodeNum:vm.curItem.linkNodeNum,
                        isDefCreator:vm.curItem.isDefCreator=="是"?true:false,
                        connection: vm.curItem.connection
                    };
                } else if (key === "delete") {
                    vm.showConfirm = true;
//                    vm.deleteNodes();
                } else if (key === "nodesAttr") {
                    vm.showPopupAtt = true;
                    let attributeName = vm.curItem.attributeCode;
                    if(!Z_IsEmpty20(attributeName)){
                        let attributeNameArr = attributeName.split(",");
                        if(!Z_IsEmpty20(attributeNameArr)){
                            vm.attributeName = attributeNameArr;
                        }
                    }
                    if (vm.paramsData.moduleType == "MODULE_TYPE_ZYK" || vm.paramsData.moduleType == "MT_GDZC") {
                        vm.attrbuteData = [
                            {
                                key: "BTN_SHWC",
                                value: "按钮-审核完成"
                            }
                        ];
                    } else if (vm.paramsData.moduleType == "TYPE_HR_QJ") {
                        vm.attrbuteData = [
                            {
                                key: "BTN_HR_KQ",
                                value: "按钮-扣薪"
                            }
                        ];
                    }else{
                        vm.$vux.toast.text("该节点没有对应的附加属性",'top');
                    }

                } else {
                    vm.showPopupbefore = true;
                    let mockDack = []
                    vm.templateNodes.filter(function(item) {
                        if (item.serial < vm.curItem.serial) {
                            mockDack.push({
                                key: item.nodeId,
                                value: item.stepName
                            })
                        }
                    });

                    //判断当前节点是否设置了前序节点
                    let relationNodeTemp = vm.curItem.relationNodes;
                    if(!Z_IsEmpty20(relationNodeTemp)){
                        vm.initSelRelationNode = relationNodeTemp.split(",");
                    }
                    if (vm.curItem.stepType != "FP" && !Z_IsEmpty20(mockDack)) {
                        vm.beforeData = mockDack;
                    }else{
                        vm.ShowBefore = true;
                    }

                    vm.ShowBefore = false;
                }
            },
            deleteNodes() {
                let vm = this;
                let url = "/zingbiz/workflow/node/delOneNode";
                let params = {
                    nodeId: vm.curItem.nodeId,
                    templateId: vm.curItem.templateId
                };
                vm.$http.post(url, params).then(res => {
                    console.info(res.data.data);
                if (res.data.success === "true") {
                    vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            selItem(item) {
                //显示三个点弹框
                let vm = this;
                vm.showDialog = true;
                vm.curItem = item;
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            onPicked(list) {
                console.info("list");
                console.info(list);
                this.showPersonPicker = false;
                let vm = this;
                let roleTags = "";
                if (list != undefined && list.length >= 1) {
                    if (list.length === 1) {
                        roleTags = list[0].roleInfoId;
                    } else {
                        list.forEach(function(item) {
                            roleTags += item.roleInfoId + " ";
                        });
                    }
                }
                let url = "/zingbiz/workflow/typeAndTemplate/updateOneTemplate";
                let param = {
                    templateId: vm.paramsData.templateId,
                    serialNumberForTemplate: vm.paramsData.serialNumberForTemplate,
                    roleTags: roleTags.trim()
                };
                console.info(param);
                vm.$http.post(url, param).then(res => {
                    console.log(res.data);
                if (res.data.success === "true") {
                    vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                } else {
                    vm.$vux.toast.text("没有搜索到结果",'top');
                }
            });
            },
            reloadData(){
                let self = this;
                self.pageNumber = 1;
                self.templateNodes = [];
                self.getData();
            }
        }
    };
</script>
<style lang="less" scoped>
    .label-style {
        float: left;
        padding: 5px;
    }
    .imagePicker {
        margin: auto;
        padding: 5px;
    }
    .modal-header {
        background-color: #f0ad4e;
        padding: 15px;
        border-bottom: 1px solid #e5e5e5;
    }
    .dialog-demo {
    /deep/ .modal-body {
        position: relative;
        padding: 5px;
        height: 350px;
    }
    }
    .left-wrapper-desc {
        color: #191414;
    }
    .vux-check-icon {
        float: left;
    }
</style>
