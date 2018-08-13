<template>
    <div class="typeAdnTemplate">
        <div :style="headClass">

            <zing-head :title="'审批模板'">
                <div slot="header-right">
                    <span class="header-search">
                        <i :style="{color:'#000'}" @click="openSearch" class="iconfont icon-fangdajing"></i>
                    </span>
                    <span class="header-jiahao">
                        <dropdown :data="dropDownMenu" trigger="click" placement="bottomRight" @item-click="handleDropDownMenu">
                            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                <i class="iconfont icon-gengduo"></i>
                            </a>
                        </dropdown>
                    </span>
                </div>
            </zing-head>
            <!--搜索-->
            <search
                class="searchStyle"
                :searchFlag="showSearch"
                @cancelInput ="cancelSearch"
                @confirmInput="submitSearch"
            ></search>
        </div>


        <!-- 分类及模板显示 -->
        <div style="margin-top: 51px;">
            <div v-for="(value,key,index) in tplData" :key="key">
                <div v-show="index!=0" style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                <div style="padding:8px;border-bottom:1px solid #EFEFF4;">
                    <flexbox>
                        <flexbox-item :span="11"><div @click="updateType(value.typeData)">
                            <p v-if="value.typeData.isDeleteForType=='启用'" >{{key}}</p>
                            <p v-else style="text-decoration:line-through;color:#ccc;">{{key}}</p>
                        </div></flexbox-item>
                        <flexbox-item>
                            <i v-show="hidTplDiv.indexOf(key)!=-1" @click="handleHidTplDiv(key)" style="color: #ccc;font-size: 20px;" class="iconfont icon-xiala"></i>
                            <i v-show="hidTplDiv.indexOf(key)==-1" @click="handleHidTplDiv(key)" style="color: #ccc;font-size: 20px;" class="iconfont icon-shouqi"></i>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div v-show="hidTplDiv.indexOf(key)==-1">
                    <grid :cols="cols" v-for="(itemData,index) in value.tplData" :key="index">
                        <grid-item v-for="(tpldata,index) in itemData" :key="index" @on-item-click="onItemClick(tpldata,value.typeData)">
                            <div class="weui-grid__icon">
                                <i v-if="tpldata.isDeleteForTemplate=='启用'" style="color: #fff;background: #ff8000;padding: 5px;border-radius: 5px;margin-left: -6px;" :class="['iconfont', `icon-${tpldata.templateIcon}`]"></i>
                                <i v-else style="color: #fff;background: #ccc;padding: 5px;border-radius: 5px;margin-left: -6px;" :class="['iconfont', `icon-${tpldata.templateIcon}`]"></i>
                            </div>
                            <span class="grid-center">{{tpldata.templateName}}</span>
                        </grid-item>
                        <grid-item v-if="itemData.length!=cols" @on-item-click="openMenu(value.typeData)">
                            <div class="weui-grid__icon">
                                <i style="color:#ccc;" class="iconfont icon-jiahao1"></i>
                            </div>
                            <span class="grid-center">&nbsp;</span>

                        </grid-item>
                        <grid-item v-if="itemData.length==4 && index==value.tplData.length-1 && value.tplData.length!=1" @on-item-click="openMenu(value.typeData)">
                            <div class="weui-grid__icon">
                                <i style="color:#ccc;" class="iconfont icon-jiahao1"></i>
                            </div>
                            <span class="grid-center">&nbsp;</span>

                        </grid-item>
                    </grid>
                    <grid :cols="cols" v-if="value.tplData.length==1 && value.tplData[0].length==4">
                        <grid-item @on-item-click="openMenu(value.typeData)">
                            <div class="weui-grid__icon">
                                <i style="color:#ccc;" class="iconfont icon-jiahao1"></i>
                            </div>
                            <span class="grid-center">&nbsp;</span>

                        </grid-item>
                    </grid>
                    <grid :cols="cols" v-if="value.tplData.length==0 || value.tplData==undefined">
                        <grid-item @on-item-click="openMenu(value.typeData)">
                            <div class="weui-grid__icon">
                                <i style="color:#ccc;" class="iconfont icon-jiahao1"></i>
                            </div>
                            <span class="grid-center">&nbsp;</span>

                        </grid-item>
                    </grid>
                </div>
            </div>
            <div v-show="!isHaveTpl" style="text-align: center;color:#ff8000;font-size: 16px;">
                <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                <br/>
                暂无数据！
            </div>
        </div>

        <!-- 弹出菜单项 -->
        <actionsheet v-model="showMenu"
                     :menus="menuNodes"
                     theme="android"
                     @on-click-menu="menuItemClick"
        >
        </actionsheet>

        <!-- 分类表单 -->
        <type-form :showPopupTypeForm="showPopupTypeForm"
                   :formData="typeFormData"
                   @reload="reloadTypeData"
                   @cancleclick="closePopupForm('type')"
                   @backClick="closePopupForm('type')"

        >
        </type-form>

        <!-- 模板表单 -->
        <template-form :showPopupTemplateForm="showPopupTemplateForm"
                       :dataTemplate="templateFormData"
                       :formData="templateFormData"
                       :typeData="curTypeData"
                       :orgRoleUserData="orgRoleUserData"
                       @reload="reloadTemplateData"
                       @cancleClick="closePopupForm('template')"
                       @backClick="closePopupForm('template')"
        >
        </template-form>

        <!-- 分类以及模板排序 -->
        <sort-type-and-template :showSortTypeAndTemplate="showSortTypeAndTemplate"
                                :initData="sortTplData"
                                :isHaveTpl="isHaveTpl"
                                :allTypeData="allTypeData"
                                @reload="reloadTemplateData"
                                @cancleClick="closePopupForm('sortTypeAndTemplate')"
        ></sort-type-and-template>

        <!-- 复制现有模板 -->
        <copy-exist-template :showCopyExistTemplate="showCopyExistTemplate"
                             :initData="allTplData"
                             :isHaveTpl="isHaveTpl"
                             :typeData="curTypeData"
                             :orgRoleUserData="orgRoleUserData"
                             @reloadAfterForCopyTemplate="reloadAfterForCopyTemplate"
                             @cancleClick="closePopupForm('copyExistTemplate')"
        ></copy-exist-template>

        <!-- 使用系统模板 -->
        <system-template :showSystemTemplate="showSystemTemplate"
                         :initData="systemTplData"
                         :isHaveTpl="isHaveSystemTpl"
                         :typeData="curTypeData"
                         :orgRoleUserData="orgRoleUserData"
                         @reloadAfterForCopyTemplate="reloadAfterForCopyTemplate"
                         @cancleClick="closePopupForm('systemTemplate')"
        ></system-template>

        <!-- 模板节点设计 -->
        <design-of-template-node :showDesignOfTemplateNode="showDesignOfTemplateNode"
                                 :initData="nodeDataForTpl"
                                 :templateData="curTplData"
                                 :typeData="curTypeData"
                                 :orgRoleUserData="orgRoleUserData"
                                 @cancleClick="closePopupForm('designOfTemplateNode')"
                                 @reloadTplData="reloadTemplateData"
        ></design-of-template-node>

        <confirm v-model="confirmShow.confirmOne"
                 title = "提示"
        >
            <p style="text-align:left;">

            </p>
        </confirm>

    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import typeForm from "@/container/workflow/typeAndTemplate/typeForm";
    import templateForm from "@/container/workflow/typeAndTemplate/templateForm";
    import sortTypeAndTemplate from "@/container/workflow/typeAndTemplate/sortTypeAndTemplate";
    import copyExistTemplate from "@/container/workflow/typeAndTemplate/copyExistTemplate";
    import systemTemplate from "@/container/workflow/typeAndTemplate/systemTemplate";
    import designOfTemplateNode from "@/container/workflow/typeAndTemplate/designOfTemplateNode";
    import { isPc } from "@/utils/fn";
    import search from "@/components/search/search";

    import { Grid,
        GridItem,
        Cell,
        Confirm,
        Actionsheet,
        Flexbox,
        FlexboxItem
    } from 'vux'
    export default {
        name: 'typeAdnTemplate',
        components: {
            Grid,
            GridItem,
            Cell,
            ZingHead,
            Confirm,
            Actionsheet,
            Dropdown,
            typeForm,
            templateForm,
            Flexbox,
            FlexboxItem,
            sortTypeAndTemplate,
            copyExistTemplate,
            systemTemplate,
            designOfTemplateNode,
            search
        },
        data() {
            return {
                headClass:{
                    "position":"absolute",
                    "z-index":"500",
                    "width":"100%",
                    "background-color":"#f7f7fa"
                },
                showMenu:false,
                showSearch:false,
                isSearch:false,//记录当前数据是否是搜索出来的数据 如果是则控制不显示分类下没有模板的数据
                showPopupTypeForm:false,
                showPopupTemplateForm:false,
                showSortTypeAndTemplate:false,
                showCopyExistTemplate:false,
                showSystemTemplate:false,
                showDesignOfTemplateNode:false,
                confirmShow:{
                    confirmOne:false
                },
                showLine:false,
                cols:4,
                tplData:{},//模板数据
                allTplData:[],//纯模板数据
                allTemplateData:[],//纯模板 未重组
                systemTplData:[],//系统模板数据
                nodeDataForTpl:[],//模板的节点数据
                curTplData:{},//当前点击的模板数据
                sortTplData:[],//为排序页面提供的数据
                allTypeData:[],//所有分类数据
                queryParams:{},
                isHaveTpl:true,
                isHaveSystemTpl:true,
                dropDownMenu:[
                    {
                        content: "添加分类",
                        itemKey: "addType",
                    },
                    {
                        content: "页面排序",
                        itemKey: "pageSort",
                    }
                ],
                menuNodes: [
                    {
                        label: "复制现有模板",
                        value: "copyExistTemplate"
                    },
                    {
                        label: "使用系统模板",
                        value: "useSystemTemplate"
                    },
                    {
                        label: "创建模板",
                        value: "createNewTemplate"
                    }
                ],
                typeFormData:{
                    categoryName:'',
                    serialNumberForType:'',
                    moduleType:'',
                },
                templateFormData:{

                },
                curTypeData:{},
                hidTplDiv:[],
                orgRoleUserData:{},
            };
        },
        //钩子加载完触发
        created: function () {
            let self = this;
            if(isPc()){
                self.headClass.width = (document.body.clientWidth-200)+"px";
            }
            //处理url参数值
            self.handleQueryParams();

            //获取当前商号的组织 角色 人员数据
            self.initOrgRoleUser();

            self.initTemplate();

        },
        methods: {
            initOrgRoleUser(){
                let url = "/zingbiz/auth/org/getOrgRoleUser";
                let params = {};
                this.$http
                    .post(url, params)
                    .then(res => {
                    if (!res.data.success) {
                    console.error("getOrgRoleUser error", res);
                    return;
                }

                if (!res.data.data["roleDatas"] || !res.data.data["orgUserDatas"]) {
                    console.warn("getOrgRoleUser data error", res);
                    return;
                }

                let retData = res.data.data;
                    this.orgRoleUserData = retData;
                    console.log("OrgRoleUser",retData);

            })
            .catch(err => {
                    console.error(err);
            });

            },
            openMenu(typeData){
                this.curTypeData = typeData;
                this.showMenu=true;
            },
            openSearch() {
                this.showSearch = !this.showSearch;
            },
            cancelSearch(){
                this.showSearch = !this.showSearch;
            },
            submitSearch(val){
                if(val!=undefined && val!=""){
                    this.isSearch=true;
                }else{
                    this.isSearch=false;
                }
                this.cancelSearch();
                this.initTemplate(val);
            },
            menuItemClick(key, item){
                if(key === "copyExistTemplate"){
                    if(this.curTypeData!=undefined){
                        let moduleType = this.curTypeData.moduleType;
                        //筛选模板数据
                        let tplDataTemp = [];
                        this.allTemplateData.forEach(item =>{
                            if(moduleType!="" && moduleType!="typeForPuTongShenPi"){
                                if(moduleType==item.moduleType){
                                    tplDataTemp.push(item);
                                }
                            }else{
                                if(item.moduleType=="" || item.moduleType=="typeForPuTongShenPi"){
                                    tplDataTemp.push(item);
                                }
                            }

                        })

                        this.allTplData = tplDataTemp;
                        this.regroupTpl();
                    }

                    this.showCopyExistTemplate=true;
                }else if(key === "useSystemTemplate"){
                    this.getSystemTemplate();
                }else if(key === "createNewTemplate"){
                    this.templateFormData={
                        templateType:'',
                        skillType:'',
                        templateName:'',
                        templateDesc:"",
                        serialNumberForTemplate:"",
                        templateIcon:"",
                        isLinkTask:"",
                        templateTypeForOtherModule:"",
                        isDeleteForTemplate:"启用",
                    };
                    this.showPopupTemplateForm = true;
                }
            },
            getSystemTemplate(){
                let self = this;
                self.systemTplData=[];
                let postdata={
                    companyId:"company62471948100001"
                };
                let url = "/zingbiz/workflow/typeAndTemplate/loadAllTemplateByCompanyId";
                self.$http.post(url,postdata).then(res => {

                    if(res.data.success){
                        let systemTplData = res.data.data;
                        let moduleType = this.curTypeData.moduleType;
                        //筛选模板数据
                        let tplDataTemp = [];
                        systemTplData.forEach(item =>{
                            if(moduleType!="" && moduleType!="typeForPuTongShenPi"){
                                if(moduleType==item.moduleType){
                                    tplDataTemp.push(item);
                                }
                            }else{
                                if(item.moduleType=="" || item.moduleType=="typeForPuTongShenPi"){
                                    tplDataTemp.push(item);
                                }
                            }

                        })
                    systemTplData = tplDataTemp;
                    if(systemTplData!=undefined){
                        //由于vux的grid组件对文字自适应有问题 所以分批存储模板数据4个模板为一行
                        if(systemTplData!=undefined && systemTplData.length>0){
                            let allTplDataTemp=[];
                            let dataTemp=[];
                            let n=0;
                            for(let i=0;i<systemTplData.length;i++){
                                n++;
                                let tplIcon = systemTplData[i].templateIcon;
                                if(tplIcon==undefined || tplIcon.indexOf("zingIcon")!=-1 || tplIcon==""){
                                    systemTplData[i].templateIcon="shenpi1";
                                }
                                dataTemp.push(systemTplData[i]);
                                if(n==4){
                                    allTplDataTemp.push(dataTemp);
                                    n=0;
                                    dataTemp=[];
                                }
                            }
                            if(dataTemp!=undefined && dataTemp.length>0){
                                allTplDataTemp.push(dataTemp);
                            }
                            self.systemTplData = allTplDataTemp;
                        }
                        this.showSystemTemplate=true;
                    }
                }else{
                    self.$vux.toast.text(res.data.mgs==undefined?res.data.msg:res.data.mgs,'top');
                }
                if(self.systemTplData==undefined || JSON.stringify(self.systemTplData)=="[]"){
                    self.isHaveSystemTpl = false;
                }
            })
            .catch(err => {
                    this.$vux.toast.text("异常，请稍后重试！",'top');
            });
            },
            getNodeByTemplateId(tplData){
                let self = this;
                self.systemTplData=[];
                let url = "/zingbiz/workflow/node/loadAllNodeByTemplateId";
                self.$http.post(url,tplData).then(res => {
                    if(res.data.success){
                    self.nodeDataForTpl = res.data.data;
                    this.showDesignOfTemplateNode=true;
                }else{
                    self.$vux.toast.text(res.data.mgs==undefined?res.data.msg:res.data.mgs,'top');
                }
            })
            .catch(err => {
                    this.$vux.toast.text("异常，请稍后重试！",'top');
            });
            },
            handleDropDownMenu (data) {
                if(data.itemKey=="addType"){
                    let reset = {
                        categoryName:'',
                        serialNumberForType:'',
                        moduleType:'qxz',
                        isDeleteForType:"启用",
                    };
                    this.typeFormData=Object.assign({},reset);
                    this.showPopupTypeForm = true;
                }else if(data.itemKey=="pageSort"){
                    this.showSortTypeAndTemplate=true;
                }
            },
            reloadTypeData(){
                let self = this;
                setTimeout(function(){
                    self.initTemplate();
                    self.showPopupTypeForm=false;
                },1000);

            },
            reloadTemplateData(){
                let self = this;
                setTimeout(function(){
                    self.initTemplate();
                    self.showPopupTemplateForm=false;
                },1000);

            },
            handleQueryParams(){

            },
            initTemplate(searchVal){
                let self = this;
                let retData = false;
                let postdata={};
                if(searchVal!=undefined && searchVal!=""){
                    postdata.templateName = searchVal;
                }
                let url = "/zingbiz/workflow/typeAndTemplate/loadAllTemplate";
                this.$http.post(url,postdata).then(res => {
                    let retData = res.data.data.categoryNameTpl;
                if(res.data.success){
                    self.allTypeData = [];
                    self.allTypeData = res.data.data.allTypeData==undefined?{}:res.data.data.allTypeData;
                    if(retData!=undefined){
                        self.handleTemplate(this.allTypeData,retData);
                    }
                }else{
                    self.$vux.toast.text(res.data.mgs==undefined?res.data.msg:res.data.mgs,'top');
                }
                if(self.tplData==undefined || JSON.stringify(self.tplData)=="{}" || self.allTypeData==undefined || JSON.stringify(self.allTypeData)=="{}"){
                    self.isHaveTpl = false;
                }
            })
            .catch(err => {
                    this.$vux.toast.text("异常，请稍后重试！",'top');
            });

            },
            handleTemplate(allTypeData,tpl){
                let newAllTplData = {};
                let sortTplDataTemp = [];
                if(allTypeData!=undefined){
                    this.allTplData = [];
                    for(let key in allTypeData){
                        //获取当前分类下的模板数据
                        let tplDataForCurType = tpl[allTypeData[key].categoryId];
                        let newTplData = [];
                        let templateArr = [];
                        if(tplDataForCurType!=undefined && tplDataForCurType.length>0){
                            //分批处理模板数据 4个模板为一批 方便显示
                            let n = 0;
                            for(let i=0;i<tplDataForCurType.length;i++){
                                n++;
                                let tplIcon = tplDataForCurType[i].templateIcon;
                                if(tplIcon==undefined || tplIcon.indexOf("zingIcon")!=-1 || tplIcon==""){
                                    tplDataForCurType[i].templateIcon="shenpi1";
                                }
                                newTplData.push(tplDataForCurType[i]);
                                this.allTplData.push(tplDataForCurType[i]);
                                if(n==this.cols){
                                    templateArr.push(newTplData);
                                    n = 0;
                                    newTplData = [];
                                }
                            }
                            if(newTplData!=undefined && newTplData.length>0){
                                templateArr.push(newTplData);
                            }
                        }else{
                            if(this.isSearch){
                                continue;
                            }
                        }
                        newAllTplData[allTypeData[key].categoryName] = {
                            tplData:templateArr,
                            typeData:allTypeData[key]
                        };

                        sortTplDataTemp.push({
                            tplData:tplDataForCurType,
                            typeData:allTypeData[key],
                            curTypeIndex:key,
                        });
                    }
                    this.sortTplData = sortTplDataTemp;
                }
                this.tplData = newAllTplData;

                this.allTemplateData = this.allTplData;

                this.regroupTpl();

            },
            regroupTpl(){
                //由于vux的grid组件对文字自适应有问题 所以分批存储模板数据4个模板为一行
                if(this.allTplData!=undefined && this.allTplData.length>0){
                    let allTplDataTemp=[];
                    let dataTemp=[];
                    let n=0;
                    for(let i=0;i<this.allTplData.length;i++){
                        n++;
                        dataTemp.push(this.allTplData[i]);
                        if(n==4){
                            allTplDataTemp.push(dataTemp);
                            n=0;
                            dataTemp=[];
                        }
                    }
                    if(dataTemp!=undefined && dataTemp.length>0){
                        allTplDataTemp.push(dataTemp);
                    }
                    this.allTplData = allTplDataTemp;
                }
            },
            onItemClick (tplData,typeData) {
                console.log(tplData);
                let tplId = tplData.templateId==undefined?"":tplData.templateId;
                let templateModuleType = tplData.moduleType==undefined?"":tplData.moduleType;
                let typeId = tplData.categoryId==undefined?"":tplData.categoryId;
                let templateType = tplData.templateType==undefined?"":tplData.templateType;

                let queryParams = {};
                queryParams.companyId=tplData.companyId==undefined?"":tplData.companyId;

                this.curTypeData=typeData;
                this.curTplData=tplData;
                //获取节点数据
                this.getNodeByTemplateId(tplData);

            },
            urlParse(url){
                let obj = {};// 创建一个Object
                let reg = /[?&][^?&]+=[^?&]+/g;// 正则匹配 ?&开始 =拼接  非?&结束  的参数
                let arr = url.match(reg);// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
                if (arr) {
                    arr.forEach((item) => {
                        /**
                         * tempArr数组    ['id','12345']和['a','b']
                         * 第一个是key，第二个是value
                         * */
                        let tempArr = item.substring(1).split('=');
                    let key = decodeURIComponent(tempArr[0]);
                    let val = decodeURIComponent(tempArr[1]);
                    obj[key] = val;
                });
                }
                return obj;
            },
            closePopupForm(formId){
                if(formId=="type"){
                    this.showPopupTypeForm=false;
                }else if(formId=="template"){
                    this.showPopupTemplateForm=false;
                }else if(formId=="sortTypeAndTemplate"){
                    this.showSortTypeAndTemplate=false;
                }else if(formId=="copyExistTemplate"){
                    this.showCopyExistTemplate=false;
                }else if(formId=="systemTemplate"){
                    this.showSystemTemplate=false;
                }else if(formId=="designOfTemplateNode"){
                    this.showDesignOfTemplateNode=false;
                }
            },
            updateType(typeData){
                this.typeFormData = typeData;
                this.showPopupTypeForm=true;
            },
            handleHidTplDiv(typeId){
                let temp = this.hidTplDiv.indexOf(typeId);
                if(temp!=-1){
                    this.hidTplDiv.splice(temp, 1);
                }else{
                    this.hidTplDiv.push(typeId);
                }
            },
            reloadAfterForCopyTemplate(tplData){
                this.reloadTemplateData();
                this.onItemClick(tplData);
                this.showCopyExistTemplate=false;
                setTimeout(function (args) {
                    this.showDesignOfTemplateNode=true;
                },500);
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .typeAdnTemplate {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .iconfont{
        font-size: 30px;
    }
    .weui-cells__title{
        color: #669fc7;
        min-height: 25px;
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
    .red-Point{
        position: absolute;
        right: 10px;
        top: 10px;
        width: 10px;
        height: 10px;
        z-index: 2;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        background-color: #f43531;
        font-size: 0;
    }
    .weui-grids:before {
        border-top:0px;
    }
</style>
