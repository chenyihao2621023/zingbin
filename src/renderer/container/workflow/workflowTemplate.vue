<template>
    <div style="height: 100%;">
        <ZingHead :title="title">
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo" @click="handleMenu"></i>
                </span>
            </div>
        </ZingHead>

        <div class="haha">
            <search position="relative" ref="search" class="search" @on-cancel="CancelSearch" @on-submit="onSubmit" v-model="templateName" v-show="searchFlag">
            </search>
        </div>
        <div class="scroll-list-wrap" :style="{ height: screenHeight  + 'px',overflow:'auto' }">
            <scroll ref="scroll" :data="templateData" :scrollbar="true" :startY="0"
                    :pullUpLoad="{threshold: 0, txt:  {more: 'more', noMore: 'noMore'}}"
                    @pullingUp="onPullingUp">
                <GridCard v-for="(item ,index) in templateData" :key="index">
                    <div slot="cardLeft" class="left" @click="toNewPpage(item)">
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.serialNumberForTemplate}}:{{item.templateName}}</p>
                            <div class="left-wrapper-desc">所属分类：{{item.categoryName}}</div>
                            <tag v-if="item.isDeleteForTemplate=='禁用'" color="#20a0ff"
                                 size="large"
                            >
                                已禁用
                            </tag>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <a class="iconfont icon-gengduo" @click="selItem(item)"></a>
                    </div>
                </GridCard>
            </scroll>
        </div>

        <actionsheet v-model="showDialog" :menus="menuNodes" theme="android" @on-click-menu="click">
        </actionsheet>
        <confirm v-model="showConfirm" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm">
            <p style="text-align:center;">是否确认执行此操作？</p>
        </confirm>
        <org-member-picker :initialSelected="initialSelected" :showTab="['role']" :showPicker="showPersonPicker" :multiple="true" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
        <!-- 选人组件 -->
        <workform-template ref="templateForm"
                           :templateTypeModel="templateTypeModel"
                           :modelTitle="modelTitle"
                           :showPopupDate="isShow"
                           :readOnly="showToast"
                           :dataTemplate="dataTemplates" @backClick="clickBack" @submitClick="submitTemplate" @cancleClick="cancleTemplate"></workform-template>


    </div>

</template>

<script>
    import {
        Confirm,
        Search,
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
    import GridCard from "@/components/gridcard/GridCard";
    import workformTemplate from "@/container/workflow/workflowTemplate/workflowTempEdit";
    import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
    import Tag from '@/components/tag/Tag.vue'
    export default {
        components: {
            Search,
            Scroll,
            XTextarea,
            OrgMemberPicker,
            GridCard,
            CheckIcon,
            ZingHead,
            Confirm,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            workformTemplate,
            Actionsheet,
            Group,
            XButton,Tag
        },
        data() {
            return {
                screenHeight: 0,
                certifShow: false,
                certifiData: [],
                certifChooseData: [], // 技能组选中数据
                dataTemplates: {},
                isShow: false,
                showDialog: false, //三个点标识
                title: "审批流模板",
                connection: false,
                modelTitle: "",
                headImgSrc: [], // 图片文件
                roleData: [],
                showConfirm: false, // 禁止分类窗口
                initialSelected: [],
                showPersonPicker: false,
                curItem: {},
                paramsData: {},
                templateName: "",
                searchFlag: false,
                menuNodes: [
                    {
                        label: "属性修改",
                        value: "update"
                    },
                    {
                        label: "禁用模板",
                        value: "forbid"
                    },
                    {
                        label: "节点编辑",
                        value: "edit"
                    },
                    {
                        label: "模板授权",
                        value: "authorize"
                    }
                ],
                templateData: [],
                type:'',
                pageNumber:1,
                pageSize:20,
                templateTypeModel: []
            };
        },
        created() {
            let vm = this;
            vm.showToast = true
            vm.paramsData = vm.$route.query;
            vm.dataTemplates.taskIcon = "tianjia1"
            vm.getDatas();
            this.screenHeight = document.documentElement.clientHeight - 100;
            if(vm.paramsData.moduleType ==='MODULE_TYPE_ZYK'){
                vm.getVoucherType();
            }
        },
        methods: {

            onPullingUp() {
                let self = this;
                setTimeout(() => {
                    self.getDatas();
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
            // 获取全部审批流模板数据
            getDatas() {
                let vm = this;
                let url = "/zingbiz/workflow/typeAndTemplate/loadAllTemplateByType";
                let params = {
                    categoryId: vm.paramsData.categoryId,
                    pageSize: vm.pageSize,
                    pageNumber: vm.pageNumber
                };
                if(vm.templateName!=undefined && vm.templateName!=""){
                    params.templateName=vm.templateName;
                }
                vm.$http.post(url, params).then(res => {
                    if (res.data.data.total > 0) {
                    console.log(res.data.data);
                    let _data = res.data.data.data;
                    _data.forEach(item => {
                        if(item!=undefined){
                        vm.templateData.push(item);
                    }
                });
                    vm.handlePaging(_data);
                } else {
//                    vm.$vux.toast.text("没有搜索到结果","top");
                }
            });
            },
            // 根据ID 获取审批流模板数据
            getInitData() {
                let vm = this;
                let url = "/zingbiz/workflow/typeAndTemplate/getTplDataById";
                let param = {
                    tplId: vm.curItem.templateId
                };
                this.$http.post(url, param).then(res => {
                    if (res.data.data.total > 0) {
                    vm.dataTemplates = res.data.data.data;
                } else {
//                    vm.$vux.toast.text("没有搜索到结果","top");
                }
            });
            },
            // 添加/编辑审批流模板数据
            getUpdata(taskIcon) {
                let vm = this;
                let url = "";
                let isChangeForTemplateName = false;
                let isChangeForTemplateType = false;
                let params = "";
                console.info(vm.dataTemplates.type);
                if (vm.dataTemplates.type === "update") {
                    url = "/zingbiz/workflow/typeAndTemplate/updateOneTemplate";
                    if (vm.curItem.templateType === vm.dataTemplates.templateType) {
                        isChangeForTemplateType = false;
                    } else {
                        isChangeForTemplateType = true;
                    }
                    if (vm.curItem.templateName === vm.dataTemplates.templateName) {
                        isChangeForTemplateName = false;
                    } else {
                        isChangeForTemplateName = true;
                    }
                } else {
                    url = "/zingbiz/workflow/typeAndTemplate/addOneTemplate";
                }
                if (
                    vm.dataTemplates.templateType === undefined ||
                    vm.dataTemplates.templateType === ""
                ) {
                    vm.$vux.toast.text("请选择模板类型","top");
                    return;
                }
                if (
                    vm.dataTemplates.templateName === undefined ||
                    vm.dataTemplates.templateName === ""
                ) {
                    vm.$vux.toast.text("请输入模板名称","top");
                    return;
                }
                if (
                    vm.dataTemplates.templateDesc === undefined ||
                    vm.dataTemplates.templateDesc === ""
                ) {
                    vm.$vux.toast.text("请输入模板描述","top");
                    return;
                }
                if (
                    vm.dataTemplates.serialNumberForTemplate === undefined ||
                    vm.dataTemplates.serialNumberForTemplate === ""
                ) {
                    vm.$vux.toast.text("请输入顺序号","top");
                    return;
                }
                if (vm.dataTemplates.serialNumberForTemplate <1 || vm.dataTemplates.serialNumberForTemplate >999) {
                    vm.$vux.toast.text("顺序号范围1~999",'top');
                    return;
                }
                params = {
                    skillType: vm.dataTemplates.skillType,
                    templateDesc: vm.dataTemplates.templateDesc,
                    templateName: vm.dataTemplates.templateName,
                    typeId:vm.paramsData.categoryId,
                    templateId:vm.dataTemplates.templateId,
                    templateIcon: vm.dataTemplates.taskIcon,
                    templateType: vm.dataTemplates.templateType,
                    serialNumberForTemplate: vm.dataTemplates.serialNumberForTemplate,
                    templateTypeForOtherModule:vm.dataTemplates.temTypeModel
                };
                let isLinkTask = "";
                if (vm.dataTemplates.isLinkTask === true) {
                    isLinkTask = "是";
                } else {
                    isLinkTask = "否";
                }
                isLinkTask = isLinkTask ? { isLinkTask: isLinkTask } : {};
                isChangeForTemplateName = isChangeForTemplateName
                    ? { isChangeForTemplateName: isChangeForTemplateName }
                    : {};
                isChangeForTemplateType = isChangeForTemplateType
                    ? { isChangeForTemplateType: isChangeForTemplateType }
                    : {};
                params = Object.assign(
                    {},
                    params,
                    isLinkTask,
                    isChangeForTemplateName,
                    isChangeForTemplateType
                );
                this.$http.post(url, params).then(res => {
                    if (res.data.success === "true") {
                        vm.reloadData();
                    vm.$vux.toast.text("操作成功！","top");
                    vm.isShow = false;

                } else {
                    vm.$vux.toast.text(res.data.mgs,'top');
                }
            });
            },
            CancelSearch: function() {
                this.searchFlag = false;
                this.$refs.search.setFocus();
            },
            search: function() {
                if (this.searchFlag) {
                    this.$refs.search.setFocus();
                }
                // this.$refs.search.setFocus()
                this.searchFlag = !this.searchFlag;
            },
            onSubmit() {
                this.reloadData();
            },
            //跳转至节点页面
            toNewPpage(item) {
                let vm = this;
                this.$router.push({
                    path: "workflowNodes",
                    query: {
                        templateId: item.templateId,
                        moduleType: item.moduleType,
                        categoryId: item.categoryId,
                        templateType: item.templateType,
                        serialNumberForTemplate: item.serialNumberForTemplate
                    }
                });
            },
            onCancel() {
                console.log("on cancel");
            },
            onConfirm(msg) {
                let vm = this;
                let type = "";
                let url = "/zingbiz/workflow/typeAndTemplate/disableOrEnableOneTemplate";
                if (vm.menuNodes[1].label === "禁用模板") {
                    type = "禁用";
                } else {
                    type = "启用";
                }
                let params = {
                    isDeleteForTemplate: type,
                    templateId: vm.curItem.templateId
                };
                vm.$http.post(url, params).then(res => {
                    if (res.data.success === "true") {
                        vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                    this.isShow = false;
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            // 添加/编辑审批流模板
            submitTemplate() {
                // console.info(taskIcon)
                this.getUpdata();
            },
            cancleTemplate() {
                this.isShow = false;
            },
            //添加菜单
            handleMenu(data) {
                let vm = this;
                vm.isShow = true;
                vm.modelTitle = "添加模板";
                vm.dataTemplates.type = "add";
                vm.dataTemplates.moduleType = vm.paramsData.moduleType;
                vm.showToast = false;
                vm.dataTemplates = {
                    skillType: "",
                    templateDesc: "",
                    templateName: "",
                    templateType: "",
                    taskIcon:'tianjia1',
                    serialNumberForTemplate: "",
                    temTypeModel: '',
                    isLinkTask: false
                };
            },
            click(key, item) {
                let vm = this;
                let isLink = false
                if(vm.curItem.isLinkTask === '否'){
                    isLink = false
                } else {
                    if(vm.curItem.isLinkTask === '是'){
                        isLink = true
                    }
                }
                let icons= ''
                if (key === "update") {
                    console.info(vm.curItem.templateIcon)
                    if(vm.curItem.templateIcon === undefined){
                        icons = 'tianjia1'
                    }else {
                        icons = vm.curItem.templateIcon
                    }
                    vm.dataTemplates = {
                        skillType: vm.curItem.skillType,
                        templateDesc: vm.curItem.templateDesc,
                        templateName: vm.curItem.templateName,
                        templateType: vm.curItem.templateType,
                        taskIcon: icons,
                        temTypeModel:vm.curItem.templateTypeForOtherModule,
                        serialNumberForTemplate: vm.curItem.serialNumberForTemplate,
                        isLinkTask: isLink,
                        templateId:vm.curItem.templateId
                    };
                    let temTypeModelArr = [];
                    let temTypeModelTemp = vm.dataTemplates.temTypeModel;
                    if(temTypeModelTemp!=undefined && temTypeModelTemp!=""){
                        temTypeModelArr = temTypeModelTemp.split(",");
                        let VoucherType = vm.templateTypeModel;
                        VoucherType.forEach(item => {
                            if(temTypeModelTemp.indexOf(item.key)!=-1){
                                vm.dataTemplates.temTypeModelName = vm.dataTemplates.temTypeModelName==undefined?item.value:vm.dataTemplates.temTypeModelName+","+item.value;
                            }
                        })
                    }
                    vm.dataTemplates.type = "update";
                    vm.isShow = true;
                    vm.modelTitle = "属性修改";
                    vm.showToast = true;
                } else if (key === "edit") {
                    vm.$router.push({
                        path: "workflowNodes",
                        query: {
                            templateId:  vm.curItem.templateId,
                            moduleType:  vm.curItem.moduleType,
                            categoryId:  vm.curItem.categoryId,
                            templateType:  vm.curItem.templateType,
                            serialNumberForTemplate:  vm.curItem.serialNumberForTemplate
                        }
                    });
                } else if (key === "authorize") {
                    vm.showPersonPicker = true;
                    let initRole = [];
                    let roleTagsStr = vm.curItem.roleTags;
                    if(roleTagsStr!=undefined && roleTagsStr.length>0){
                        initRole = vm.curItem.roleTags.split(" ");
                    }
                    vm.initialSelected = initRole;
                } else {
                    vm.showConfirm = true;
                }
            },
            selItem(item) {
                //显示三个点弹框
                let vm = this;
                vm.showDialog = true;
                vm.curItem = item;
                if (item.moduleType === "MODULE_TYPE_ZYK" || item.moduleType === "MT_GDZC") {
                    vm.menuNodes = [
                        {
                            label: "属性修改",
                            value: "update"
                        },
                        {
                            label: "禁用模板",
                            value: "forbid"
                        },
                        {
                            label: "节点编辑",
                            value: "edit"
                        }
                    ];
                }
                if (item.isDeleteForTemplate === "启用") {
                    vm.menuNodes[1].label = "禁用模板";
                } else {
                    vm.menuNodes[1].label = "启用模板";
                }
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            clickBack() {
                this.isShow = false;
            },
            onPicked(list) {
                console.info(list);
                let vm = this;
                this.showPersonPicker = false;
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
                let params = {
                    templateId: vm.curItem.templateId,
                    serialNumberForTemplate: vm.curItem.serialNumberForTemplate,
                    roleTags: roleTags.trim()
                };
                this.$http.post(url, params).then(res => {
                    if (res.data.success === "true") {
                    vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            reloadData(){
                let self = this;
                self.pageNumber = 1;
                self.templateData = [];
                self.getDatas();
            },
            getVoucherType(){
                let self = this;
                let sendUrl = "/zingbiz/resourceLibrary/voucher/getVoucherType";
                let params = {};
                self.$http.get(sendUrl,params).then(res => {
                    try{
                        if(res.data.success){
                            let retData = res.data.data;
                            for(let key in retData){
                                self.templateTypeModel.push({
                                    key:key,
                                    value:retData[key]
                                });
                            }
                        }
                    } catch(e){

                    }
                });
            },
        }
    };
</script>
<style lang="less" scoped>
    // .weui-icon-circle{
    //   padding-left:5px;
    // }
    .label-style {
        float: left;
        padding-top: 8px;
        padding-left: 5px;
    }
    .imagePicker {
        margin: auto;
        vertical-align: middle;
        padding: 8px;
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
    .vux-confirm {
    /deep/ .weui-dialog__btn_primary {
        background-color: #ff8000;
    }
    }
    .left-wrapper-desc {
        color: #191414;
    }
    .vux-check-icon {
        float: left;
        padding-left: 5px;
    }
    .weui-icon-circle {
        font-size: 14px;
    }
    .vux-check-icon > span {
        font-size: 96%;
    }
</style>
