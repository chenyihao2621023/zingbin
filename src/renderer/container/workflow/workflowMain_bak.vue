<template>
    <div class="workflowMain">
        <zing-head :title="'审批流'"></zing-head>
        <grid v-show="queryParams.wfType!='KH' && queryParams.wfType!='MODULE_TYPE_ZYK'">
            <grid-item @on-item-click="menuClick('SP')">
                <div class="weui-grid__icon">
                    <i class="iconfont icon-danjuchaxun"></i>
                </div>
                <span class="grid-center">我审批的</span>
                <i v-show="isHaveDB" class="red-Point"></i>
            </grid-item>
            <grid-item @on-item-click="menuClick('FQ')">
                <div class="weui-grid__icon">
                    <i class="iconfont icon-danjuchaxun"></i>
                </div>
                <span class="grid-center">我发起的</span>
            </grid-item>
            <grid-item @on-item-click="menuClick('CY')">
                <div class="weui-grid__icon">
                    <i class="iconfont icon-danjuchaxun"></i>
                </div>
                <span class="grid-center">我参与的</span>
            </grid-item>
            <grid-item @on-item-click="menuClick('CX')">
                <div class="weui-grid__icon">
                    <i class="iconfont icon-danjuchaxun"></i>
                </div>
                <span class="grid-center">查询审批流</span>
            </grid-item>
        </grid>
        <div v-for="(value,key,index) in tplData">
            <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
            <div style="padding:8px;border-bottom:1px solid #EFEFF4;">
                {{key}}
            </div>
            <grid :cols="cols" v-for="(itemData,index) in value" :key="index">
                <grid-item v-for="(tpldata,index) in itemData" :key="index" @on-item-click="onItemClick(tpldata)">
                    <div class="weui-grid__icon">
                        <i :class="['iconfont', `icon-${tpldata.templateIcon}`]"></i>
                    </div>
                    <span class="grid-center">{{tpldata.templateName}}</span>
                </grid-item>
            </grid>
        </div>
        <div v-show="!isHaveTpl" style="text-align: center;color:#ff8000;font-size: 16px;">
            <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
            <br/>
            暂无授权模板！
        </div>

        <confirm v-model="confirmShow.confirmOne" title = "提示"
                 @on-confirm="goToZc"
                 @on-cancel="delZcData"
        >
            <p style="text-align:left;">
                当前凭证之前已进行审批暂存。<br/>1.点击确定进入加载暂存数据。<br/>2.点击取消会自动删除之前暂存数据，可以重新选择模板进行发起。
            </p>
        </confirm>

    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";

    import { Grid,
        GridItem,
        Cell,
        Confirm
    } from 'vux'
    export default {
        name: 'workflowMain',
        components: {
            Grid,
            GridItem,
            Cell,
            ZingHead,
            Confirm
        },
        data() {
            return {
                confirmShow:{
                    confirmOne:false
                },
                showLine:false,
                cols:4,
                tplData:{},//模板数据
                queryParams:{
                    wfType:"",
                    pzRowId:"",
                    toNewPage:"",
                    voucherType:"",
                    companyId:"",
                    companyName:"",
                    tplType:"",
                },
                isHaveDB:false,
                isHaveTpl:true,
                zcData:{},

            };
        },
        //钩子加载完触发
        created: function () {
            let self = this;
            //处理url参数值
            self.handleQueryParams();

            //资源库凭证之前如有暂存审批 则进行提示
            if(self.queryParams.pzRowId!=undefined && self.queryParams.pzRowId!=""){
                self.forwardForHaveTemporaryData(self.queryParams.pzRowId);
            }
            self.checkHaveDB();

            self.initTemplate();

        },
        methods: {
            checkHaveDB(){
                let url = "/zingbiz/workflow/helper/isHaveWrokflowDB";
                this.$http.post(url,{})
                    .then(res => {
                        console.log("dddd",res.data);
                    if(res.data.data.isHaveDB){
                        this.isHaveDB = true;
                    }
            });
            },
            handleQueryParams(){
                this.queryParams.cType=this.$route.query.cType;
                this.queryParams.wfType=this.$route.query.wfType;
                this.queryParams.pzRowId=this.$route.query.pzRowId;
                this.queryParams.toNewPage=this.$route.query.toNewPage;
                this.queryParams.voucherType=this.$route.query.voucherType;

                this.queryParams.companyName=this.$route.query.companyName;
                if(this.$route.query.companyId!=undefined && this.$route.query.companyId!=""){
                    this.queryParams.companyId=this.$route.query.companyId;
                }else{
                    this.queryParams.companyId="";
                }

                this.queryParams.tplType=this.$route.query.voucherType;

            },
            menuClick(mType){
                if(mType==='SP'){
                    this.$router.push({
                        path:"workflowMyApproval",
                        query:{
                            companyId:this.queryParams.companyId,
                            wfType:"YG"
                        }
                    });
                }else if(mType==='FQ'){
                    this.$router.push({
                        path:"workflowMyself",
                        query:{
                            companyId:this.queryParams.companyId,
                        }
                    });
                }else if(mType==='CY'){
                    this.$router.push({
                        path:"workflowJoin",
                        query:{
                            companyId:this.queryParams.companyId,
                            workflowType:"YG"
                        }
                    });
                }else if(mType==='CX'){
                    this.$router.push({
                        path:"workflowQuery",
                        query:{
                            companyId:this.queryParams.companyId,
                        }
                    });
                }
            },
            initTemplate(){
                let self = this;
                let retData = false;
                let postdata={};
                let curCompanyId = self.queryParams.companyId;
                let paramCompanyId = self.queryParams.companyId;
                if(paramCompanyId){
                    postdata.companyId=paramCompanyId;
                }else{
                    postdata.companyId=curCompanyId;
                }
                postdata.id="";
                if(self.queryParams.wfType!=undefined && self.queryParams.wfType!=""){
                    postdata.wfType = self.queryParams.wfType;
                }
                let url = "/zingbiz/workflow/createWorkFlow/getBeforCreateFlowData.action";
                this.$http.post(url,postdata)
                    .then(res => {
                    console.log("模板数据：",res);
                let retData = res.data.data.categoryNameTpl;
                if(res.data.success){
                    if(retData!=undefined){
                        //处理模板的集合数据
                        if(self.queryParams.wfType=="MODULE_TYPE_ZYK"){
                            retData = self.handleData(retData);
                        }
                        if(self.$route.query.companyId!=undefined && self.$route.query.companyId!=""){
                            self.queryParams.companyId = self.$route.query.companyId;
                        }else{
                            self.queryParams.companyId = res.data.data.companyIdForServer;
                        }
                        self.handleTemplate(retData);
//                        self.tplData = retData;
                    }
                }else{
                    self.$vux.toast.text(res.data.mgs,'top');
                }
                if(self.tplData==undefined || JSON.stringify(self.tplData)=="{}"){
                    self.isHaveTpl = false;
                }
            })
            .catch(err => {
                    this.$vux.toast.text("异常，请稍后重试！",'top');
            });

            },
            handleTemplate(tpl){
                let newAllTplData = {};
                if(tpl!=undefined){
                    for(let key in tpl){
                        //获取当前分类下的模板数据
                        let tplDataForCurType = tpl[key];
                        let newTplData = [];
                        let templateArr = [];
                        if(tplDataForCurType!=undefined && tplDataForCurType.length>0){
                            //分批处理模板数据 4个模板为一批 方便显示
                            let n = 0;
                            for(let i=0;i<tplDataForCurType.length;i++){
                                n++;
                                newTplData.push(tplDataForCurType[i]);
                                if(n==this.cols){
                                    templateArr.push(newTplData);
                                    n = 0;
                                    newTplData = [];
                                }
                            }
                            if(newTplData!=undefined && newTplData.length>0){
                                templateArr.push(newTplData);
                            }
                        }
                        newAllTplData[key] = templateArr;
                    }
                }
                this.tplData = newAllTplData;
            },
            handleData(data){
                let self = this;
                let retFileterData={};
                if(self.queryParams.wfType=="MODULE_TYPE_ZYK"){
                    for(let d in data){
                        let arrTemp=[];
                        for(let i=0 ; i < data[d].length ; i++){
                            if(self.queryParams.tplType!=undefined && self.queryParams.tplType!=""){
                                let curTpl = data[d][i];
                                let curTplType = curTpl.templateTypeForOtherModule==undefined?"":curTpl.templateTypeForOtherModule;

                                let tplForSystem = curTpl.tplForSystem==undefined?"":curTpl.tplForSystem;
                                //优先系统默认模板
                                if(tplForSystem=="YES"){
                                    data[d][i].pzRowId = self.queryParams.pzRowId;
                                    data[d][i].voucherType = self.queryParams.voucherType;
                                    data[d][i].toNewPage = self.queryParams.toNewPage;

                                    arrTemp.push(data[d][i]);
                                    continue;
                                }

                                if(curTplType.indexOf(self.queryParams.tplType)>=0){
                                    data[d][i].pzRowId = self.queryParams.pzRowId;
                                    data[d][i].voucherType = self.queryParams.voucherType;
                                    data[d][i].toNewPage = self.queryParams.toNewPage;

                                    arrTemp.push(data[d][i]);
                                }

                            }else{
                                data[d][i].pzRowId = self.queryParams.pzRowId;
                                data[d][i].voucherType = self.queryParams.voucherType;
                                data[d][i].toNewPage = self.queryParams.toNewPage;

                                arrTemp.push(data[d][i]);
                            }

                        }
                        if(arrTemp!=undefined && arrTemp.length>0){
                            retFileterData[d]=arrTemp;
                        }
                    }
                }
                return retFileterData;
            },
            forwardForHaveTemporaryData(){
                let self = this;
                let url = "/zingbiz/workflow/temporaryWorkflow/getTemporarDatayByOtherModulDataId";
                let postdata = {};
                postdata.otherModuleDataId = self.queryParams.pzRowId;
                let companyIdStr = self.queryParams.companyId;
                if(companyIdStr!=undefined && companyIdStr!=""){
                    postdata.companyId = companyIdStr;
                }

                this.$http.post(url,postdata)
                    .then(res => {
                    if(res.data && res.data.success){
                    if(res.data.data!=undefined){
                        if(res.data.data.workflow_id!=undefined && res.data.data.workflow_id!=""){
                            self.zcData = res.data.data;
                            this.confirmShow.confirmOne = true;
                        }

                    }
                }else{
                    this.$vux.toast.text(data.mgs,'top');
                }
            })
            .catch(err => {
                    this.$vux.toast.text("操作异常，请稍后重试！",'top');
            });

            },
            onItemClick (tplData) {
                console.log(tplData);
                let tplId = tplData.templateId==undefined?"":tplData.templateId;
                let templateModuleType = tplData.moduleType==undefined?"":tplData.moduleType;
                let typeId = tplData.categoryId==undefined?"":tplData.categoryId;
                let templateType = tplData.templateType==undefined?"":tplData.templateType;

                let queryParams = {};

                //资源库链接参数
                let pzRowId = tplData.pzRowId==undefined?"":tplData.pzRowId;
                let ckId = tplData.ckId==undefined?"":tplData.ckId;
                let boardId = tplData.boardId==undefined?"":tplData.boardId;
                let cardId = tplData.cardId==undefined?"":tplData.cardId;
                let ckType = tplData.ckType==undefined?"":tplData.ckType;
                let voucherType = tplData.voucherType == undefined ? "" :tplData.voucherType;
                let toNewPage = tplData.toNewPage==undefined?"":tplData.toNewPage;

                if(templateModuleType=="MODULE_TYPE_ZYK"){
                    queryParams = {};
                    queryParams.companyId=tplData.companyId==undefined?"":tplData.companyId;
                    queryParams.tplId =tplId;
                    queryParams.cType=templateModuleType;
                    queryParams.pzRowId=pzRowId;
                    queryParams.ckId=ckId;
                    queryParams.boardId=boardId;
                    queryParams.cardId=cardId;
                    queryParams.ckType=ckType;
                    queryParams.voucherType=voucherType;
                    queryParams.toNewPage=toNewPage;
                    this.checkForward(queryParams);
                }else{
                    if(templateType!=undefined && templateType!="" && templateType=="KH"){
                        queryParams = {};
                        queryParams.companyId=tplData.companyId==undefined?"":tplData.companyId;
                        queryParams.tplId =tplId;
                        queryParams.cType=templateModuleType;
                        queryParams.typeId=typeId;
                        queryParams.templateId=tplId;

                        this.checkForward(queryParams);
                    }else{
                        queryParams = {};
                        queryParams.companyId=tplData.companyId==undefined?"":tplData.companyId;
                        queryParams.tplId =tplId;
                        queryParams.cType=templateModuleType;
                        this.checkForward(queryParams);
                    }
                }


            },
            //抽离控制菜单点击后的跳转 资源库需要判断该模板下的节点是否设置了审核完成按钮 未创建不可使用该模板
            checkForward(queryParams){
                let self = this;
                //判断当前当前点击的模板是否有设置审核完成按钮
                if(self.queryParams.wfType=="MODULE_TYPE_ZYK"){
                    let url = "/zingbiz/workflow/node/checkTemplateForCanUse";
                    let params = {};
                    params.templateId = queryParams.tplId==null || queryParams.tplId==undefined?"":queryParams.tplId;
                    params.companyId = queryParams.companyId;

                    self.$http.post(url,params)
                        .then(res => {
                        let data = res.data;
                        if(data){
                        let isSet = data==undefined?false:data.isSet==undefined?false:data.isSet;
                        if(isSet){
                            let parentId = this.$route.query.parentId;
                            if(typeof parentId === 'string' && parentId.length > 0){
                                queryParams.parentId = parentId
                            }
                            self.$router.push({
                                path:"customLaunchWorkflow",
                                query:queryParams
                            });
                        }else if(self.queryParams.voucherType=="DBD"){
                            self.$router.push({
                                path:"customLaunchWorkflow",
                                query:queryParams
                            });
                        }else{
                            self.$vux.toast.text("此模板未在任何节点上设置凭证审核完成，暂不可使用，请通知管理员进行设置！",'top');
                        }
                    }else{
                        self.$vux.toast.text(data.mgs,'top');
                    }
                })
                .catch(err => {
                        self.$vux.toast.text("操作异常，请稍后重试！",'top');
                });

                }else{
                    if(this.queryParams.wfType==='KH'){
                        self.$router.push({
                            path:"customerLaunchWorkflow",
                            query:queryParams
                        });
                    }else{
                        self.$router.push({
                            path:"customLaunchWorkflow",
                            query:queryParams
                        });
                    }

                }
            },
            goToZc(){
                let params = this.urlParse(this.zcData.urlParams);
                params.WF_ZCID=this.zcData.workflow_id;
                this.$router.push({
                    path:"customLaunchWorkflow",
                    query:params
                });
            },
            delZcData(){
                let self = this;
                let params = {};
                let companyIdStr = self.queryParams.companyId;
                if(companyIdStr!=undefined && companyIdStr!=""){
                    params.companyId = companyIdStr;
                }

                params.WFZCID = self.zcData.workflow_id;;
                let url = "/zingbiz/workflow/temporaryWorkflow/delDataForZCById";
                self.$http.post(url,params)
                        .then(res => {

                });
                this.confirmShow.confirmOne = false;
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
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .workflowMain {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .iconfont{
        font-size: 30px;
        color: #337ab7;
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
