<template>
    <div v-show="show" class="global-search">
        <zing-head :title="'全局搜索'" class="vue-head" :isComeBack="isComeBack" v-on:doSome="cancelAndComeBack">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="goSearchPage"></i>
                </span>
            </div>
        </zing-head>
        <div class="searchContainer">
            <div class="Top-bar">
                <span class="cancel-icon">
                    <span class="cancelInput" @click="cancelAndComeBack">取消</span>
                </span>
                <span class="inputSpan" id="inputSpan">
                    <form action="" class="">
                        <input class="inputForm" :placeholder="holder" v-model="inputText">
                    </form>
                </span>
                <span class="confirm-icon">
                    <span class="confirmInput" @click="confirmInput">确定</span>
                </span>
            </div>
        </div>
        <div class="content">
            <div class="searchPage" v-show="searchPage">
                <div v-if="getSearchInfo && getSearchInfo.length > 0">
                    <flexbox v-for="(data, index) in getSearchInfo" :key="index" class="content-flexbox" justify="space-around">
                        <flexboxItem :span="23/100">
                            <div :class="selectHandleCls('parent',globalMap.global,data.parentType)" @click="parentFile('global',data.parentType)">
                                {{data.parentName}}
                            </div>
                        </flexboxItem>
                        <flexboxItem :span="77/100">
                            <div v-for="(item, index) in data.childrenData" :key="index" :class="selectHandleCls('children',globalMap[data.parentType], item.childrenType)" @click="childrenFile(data.parentType, item.childrenType)">

                                {{item.childrenName}}
                            </div>
                        </flexboxItem>
                    </flexbox>
                </div>
            </div>
            <!--<div class="searchPage" v-show="searchPage">
                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        &lt;!&ndash;<x-button mini plain class="btn-parent" style="color:#1abbfc" text="文件"></x-button>&ndash;&gt;
                        <div :class="selectHandleCls('parent',globalMap.global,'file')" @click="parentFile('global','file')">
                            文件
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.file,'chat')" @click="childrenFile('file','chat')">
                            聊天
                        </div>
                        <div :class="selectHandleCls('children',globalMap.file,'task')" @click="childrenFile('file','task')">
                            任务
                        </div>
                        <div :class="selectHandleCls('children',globalMap.file,'explorer')" @click="childrenFile('file','explorer')">
                            文件柜
                        </div>
                        <div :class="selectHandleCls('children',globalMap.file,'knowledge')" @click="childrenFile('file','knowledge')">
                            知识库
                        </div>
                    </flexboxItem>
                </flexbox>


                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        &lt;!&ndash;<x-button mini plain class="btn-parent" style="color:#1abbfc" text="聊天聊天"></x-button>&ndash;&gt;
                        <div :class="selectHandleCls('parent',globalMap.global,'voucher')" @click="parentFile('global','voucher')">
                            凭证
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.voucher,'finance')" @click="childrenFile('voucher','finance')">
                            财务库
                        </div>
                        <div :class="selectHandleCls('children',globalMap.voucher,'goods')" @click="childrenFile('voucher','goods')">
                            物品库
                        </div>
                        <div :class="selectHandleCls('children',globalMap.voucher,'importExport')" @click="childrenFile('voucher','importExport')">
                            进销存
                        </div>
                        <div :class="selectHandleCls('children',globalMap.voucher,'cabinet')" @click="childrenFile('voucher','cabinet')">
                            物品柜
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'approval')" @click="parentFile('global','approval')">
                            审批
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.approval,'ordinaryApproval')" @click="childrenFile('approval','ordinaryApproval')">
                            普通审批
                        </div>
                        <div :class="selectHandleCls('children',globalMap.approval,'leave')" @click="childrenFile('approval','leave')">
                            请假
                        </div>
                        <div :class="selectHandleCls('children',globalMap.approval,'voucher')" @click="childrenFile('approval','voucher')">
                            凭证
                        </div>
                        <div :class="selectHandleCls('children',globalMap.approval,'salary')" @click="childrenFile('approval','salary')">
                            薪资调整
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'chat')" @click="parentFile('global','chat')">
                            聊天
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.chat,'singleChat')" @click="childrenFile('chat','singleChat')">
                            单聊
                        </div>
                        <div :class="selectHandleCls('children',globalMap.chat,'groupChat')" @click="childrenFile('chat','groupChat')">
                            群聊
                        </div>
                        <div :class="selectHandleCls('children',globalMap.chat,'customerService')" @click="childrenFile('chat','customerService')">
                            客服
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'firm')" @click="parentFile('global','firm')">
                            商号
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.firm,'firmName')" @click="childrenFile('firm','firmName')">
                            名称
                        </div>
                        <div :class="selectHandleCls('children',globalMap.firm,'phone')" @click="childrenFile('firm','phone')">
                            手机
                        </div>
                        <div :class="selectHandleCls('children',globalMap.firm,'describe')" @click="childrenFile('firm','describe')">
                            简介
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'guest')" @click="parentFile('global','guest')">
                            英客
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.guest,'personnel')" @click="childrenFile('guest','personnel')">
                            人事档案
                        </div>
                        <div :class="selectHandleCls('children',globalMap.guest,'card')" @click="childrenFile('guest','card')">
                            英客名片
                        </div>
                        <div :class="selectHandleCls('children',globalMap.guest,'chat')" @click="childrenFile('guest','chat')">
                            聊天
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'notice')" @click="parentFile('global','notice')">
                            公告
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.notice,'name')" @click="childrenFile('notice','name')">
                            名称
                        </div>
                        <div :class="selectHandleCls('children',globalMap.notice,'content')" @click="childrenFile('notice','content')">
                            内容
                        </div>
                        <div :class="selectHandleCls('children',globalMap.notice,'author')" @click="childrenFile('notice','author')">
                            作者
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'taskManage')" @click="parentFile('global','taskManage')">
                            任务管理
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.taskManage,'taskSet')" @click="childrenFile('taskManage','taskSet')">
                            任务集
                        </div>
                        <div :class="selectHandleCls('children',globalMap.taskManage,'task')" @click="childrenFile('taskManage','task')">
                            任务
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'shop')" @click="parentFile('global','shop')">
                            商城管理
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.shop,'GoodsName')" @click="childrenFile('shop','GoodsName')">
                            物品名称
                        </div>
                        <div :class="selectHandleCls('children',globalMap.shop,'classification')" @click="childrenFile('shop','classification')">
                            物品分类
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'projectManage')" @click="parentFile('global','projectManage')">
                            项目管理
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.projectManage,'project')" @click="childrenFile('projectManage','project')">
                            项目
                        </div>
                        <div :class="selectHandleCls('children',globalMap.projectManage,'projectTask')" @click="childrenFile('projectManage','projectTask')">
                            任务
                        </div>
                    </flexboxItem>
                </flexbox>

                <flexbox class="content-flexbox" justify="space-around">
                    <flexboxItem :span="23/100">
                        <div :class="selectHandleCls('parent',globalMap.global,'assets')" @click="parentFile('global','assets')">
                            固定资产
                        </div>
                    </flexboxItem>
                    <flexboxItem :span="77/100">
                        <div :class="selectHandleCls('children',globalMap.assets,'assetsVoucher')" @click="childrenFile('assets','assetsVoucher')">
                            资产凭证
                        </div>
                        <div :class="selectHandleCls('children',globalMap.assets,'assetsCard')" @click="childrenFile('assets','assetsCard')">
                            资产卡片
                        </div>
                    </flexboxItem>
                </flexbox>
            </div>-->
            <div class="dataPage" v-show="dataPage">
                <div v-if="getDataInfo && getDataInfo.length > 0">
                    <div class="block-data" v-for="(data, index) in getDataInfo" :key="index">
                        <div class="search-data-title">
                            <span>{{data.parentType}}</span>
                            <span>
                                <i class="iconfont icon-youjiantou"></i>
                            </span>
                            <span>{{data.childrenType}}</span>
                        </div>
                        <div v-for="(item, index) in data.searchData" :key="index">
                            <GridCard v-if="index < 3" @click.native="openPath(data,item)">
                                <div slot="cardLeft" class="left">
                                    <!--<avatar shape="square" :src="require('../../assets/img/tou.png')"></avatar>--><!--
                                    <avatar shape="square" :src="item.img"></avatar>-->
                                    <avatar v-if="item.hasOwnProperty('icon')" :icon="item.icon"></avatar>
                                    <avatar v-if="item.hasOwnProperty('img')" :src="imgData(data, item)"></avatar>
                                    <div class="left-wrapper">
                                        <p class="left-wrapper-title">{{item.title}}</p>
                                        <div class="left-wrapper-desc" v-html="includeData(item)"></div>
                                    </div>
                                </div>
                            </GridCard>
                        </div>
                        <div v-if="data.searchData.length > 3" class="morebtn" @click="moreSearchData(data.parentType, data.childrenType, data.searchData)">
                            <span>
                                <i class="iconfont icon-fangdajing"></i>
                            </span>
                            <span>更多相关数据</span>
                        </div>
                    </div>
                </div>
                <div v-else class="prompt">未搜索到相关数据</div>
            </div>
            <div class="morePage" v-show="morePage">
                <div class="block-data">
                    <div class="search-data-title">
                        <span>{{moreData.parentType}}</span>
                        <span>
                            <i class="iconfont icon-youjiantou"></i>
                        </span>
                        <span>{{moreData.childrenType}}</span>
                    </div>
                    <div v-for="(item, index) in moreData.searchData" :key="index">
                        <GridCard @click.native="openPath(moreData,item)">
                            <div slot="cardLeft" class="left">
                                <avatar v-if="item.hasOwnProperty('icon')" :icon="item.icon"></avatar>
                                <avatar v-if="item.hasOwnProperty('img')" :src="imgData(moreData, item)"></avatar>
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">{{item.title}}</p>
                                    <div class="left-wrapper-desc" v-html="includeData(item)"></div>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                </div>
            </div>
        </div>
        <img v-show="false" class="previewer-demo-img" v-for="(item, index) in imagePreviewList" :key="index" :src="item.src"
             width="100" @click="show(index)">
        <previewer :list="imagePreviewList" ref="previewer" :options="previewerOptions"></previewer>
        <popup v-model="showDocx" :popup-style="{'max-width': '100%', width: '100%', height: '100%','z-index':5000}">
            <zing-head :isComeBack="false" @doSome="onDoSome">
            </zing-head>
            <div class="my_iframe_form_data">
                <iframe :src="docxSrc" :height="explorerHeight" :width="explorerWidth" id="my_iframepage" frameborder="0" @load="iFrameHeight"></iframe>
            </div>
        </popup>
    </div>
</template>

<script>
    import { Previewer, XButton,  Flexbox, FlexboxItem , Popup, Group, Cell } from "vux";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import ZingHead from "@/components/zingHead/ZingHead";
    import { getImageUrl,isIos } from "@/utils/fn";
    import Qs from 'qs'

    export default {
        name: 'globalSearch',
        components: {
            Previewer,
            Avatar,
            GridCard,
            ZingHead,
            XButton,
            Flexbox,
            FlexboxItem,
            Popup,
            Group,
            Cell,
        },
        model:{
            prop:"show",
            event:"change",
        },
        props:{
            show:{
                type:Boolean,
                default:true
            }
        },
        data () {
            return {
                inputText: '',
                searchPage: true,
                dataPage: false,
                morePage: false,
                isShowVoucher: false,
                isComeBack: false,

                globalMap: {
                    global : [],
                    file : [],
                    voucher : [],
                    approval : [],
                    chat : [],
                    firm : [],
                    guest : [],
                    notice : [],
                    taskManage : [],
                    shop : [],
                    projectManage : [],
                    assets : [],
                },
                getSearchInfo: [
                    {
                        parentName: "文件",
                        parentType: "file",
                        childrenData: [
                            {
                                childrenName: "聊天",
                                childrenType: "chatFile",
                            },{
                                childrenName: "任务",
                                childrenType: "taskFile",
                            },{
                                childrenName: "文件柜",
                                childrenType: "explorer",
                            },{
                                childrenName: "知识库",
                                childrenType: "knowledge",
                            },
                        ],
                    },{
                        parentName: "凭证",
                        parentType: "voucher",
                        childrenData: [
                            {
                                childrenName: "财务库",
                                childrenType: "finance",
                            },{
                                childrenName: "物品库",
                                childrenType: "goods",
                            },{
                                childrenName: "进销存",
                                childrenType: "importExport",
                            },{
                                childrenName: "物品柜",
                                childrenType: "cabinet",
                            },
                        ],
                    },{
                        parentName: "审批",
                        parentType: "approval",
                        childrenData: [
                            {
                                childrenName: "普通审批",
                                childrenType: "ordinaryApproval",
                            },{
                                childrenName: "请假",
                                childrenType: "leave",
                            },{
                                childrenName: "凭证",
                                childrenType: "voucher",
                            },{
                                childrenName: "薪资调整",
                                childrenType: "salary",
                            },
                        ],
                    },{
                        parentName: "聊天",
                        parentType: "chat",
                        childrenData: [
                            {
                                childrenName: "单聊",
                                childrenType: "singleChat",
                            },{
                                childrenName: "群聊",
                                childrenType: "groupChat",
                            },{
                                childrenName: "客服",
                                childrenType: "customerService",
                            }
                        ],
                    },{
                        parentName: "商号",
                        parentType: "firm",
                        childrenData: [
                            {
                                childrenName: "名称",
                                childrenType: "firmName",
                            },{
                                childrenName: "手机",
                                childrenType: "phone",
                            },{
                                childrenName: "简介",
                                childrenType: "describe",
                            }
                        ],
                    },{
                        parentName: "英客",
                        parentType: "guest",
                        childrenData: [
                            {
                                childrenName: "人事档案",
                                childrenType: "personnel",
                            },{
                                childrenName: "英客名片",
                                childrenType: "card",
                            },{
                                childrenName: "聊天",
                                childrenType: "chat",
                            }
                        ],
                    },{
                        parentName: "公告",
                        parentType: "notice",
                        childrenData: [
                            {
                                childrenName: "名称",
                                childrenType: "name",
                            },{
                                childrenName: "内容",
                                childrenType: "content",
                            },{
                                childrenName: "作者",
                                childrenType: "author",
                            }
                        ],
                    },{
                        parentName: "任务管理",
                        parentType: "taskManage",
                        childrenData: [
                            {
                                childrenName: "任务集",
                                childrenType: "taskSet",
                            },{
                                childrenName: "任务",
                                childrenType: "task",
                            }
                        ],
                    },{
                        parentName: "商城管理",
                        parentType: "shop",
                        childrenData: [
                            {
                                childrenName: "物品名称",
                                childrenType: "GoodsName",
                            },{
                                childrenName: "物品分类",
                                childrenType: "classification",
                            }
                        ],
                    },{
                        parentName: "项目管理",
                        parentType: "projectManage",
                        childrenData: [
                            {
                                childrenName: "项目",
                                childrenType: "project",
                            },{
                                childrenName: "任务",
                                childrenType: "projectTask",
                            }
                        ],
                    },{
                        parentName: "固定资产",
                        parentType: "assets",
                        childrenData: [
                            {
                                childrenName: "资产凭证",
                                childrenType: "assetsVoucher",
                            },{
                                childrenName: "资产卡片",
                                childrenType: "assetsCard",
                            }
                        ],
                    },


                ],
                getDataInfo: [
                    /*{
                        parentType: "文件",
                        childrenType: "聊天",
                        searchData: [
                            {
                                title: "张三",
                                generateime: "2018-03-22",
                            },{
                                title: "张三",
                                generateime: "2018-03-22",
                            },
                        ],
                    },
                    {
                        parentType: "文件",
                        childrenType: "聊天",
                        searchData: [
                            {
                                title: "张三",
                                generateime: "2018-03-22",
                            },{
                                title: "张三",
                                generateime: "2018-03-22",
                            },{
                                title: "张三",
                                generateime: "2018-03-22",
                            },{
                                title: "张三",
                                generateime: "2018-03-22",
                            },
                        ],
                    },*/
                ],
                moreData: {},
                selectBtnList: [],
                postArr: [],



                explorerWidth:0,
                explorerHeight:0,
                imagePreviewList: [],
                docxSrc: '',
                showDocx: false,
                titleDocx: '标题',
                saveDocxSrc:[],
                previewerOptions: {
                    getThumbBoundsFn(index) {
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                        // find thumbnail element
                        // get window scroll Y
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        // optionally get horizontal scroll
                        // get position of element relative to viewport
                        let rect = thumbnail.getBoundingClientRect()
                        // w = width
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                        // Good guide on how to get element coordinates:
                        // http://javascript.info/tutorial/coordinates
                    }
                }
            }
        },
        computed: {
            /*companyDataListMapped() {
                return this.companyDataList.map(data => {
                    let o = {
                        title: data.companyName,
                        desc: data.companyId,
                        source: data
                    }
                    return o
                })
            }*/
        },
        mounted() {
            // load companyData
            /*let urlAllBingdingCompany = "/ZingMH/ZKM/myGroup/loadCompanys.action";
            this.$http.post(urlAllBingdingCompany).then(res => {
                this.companyDataList = res.data.data
            })*/
        },
        methods: {
            backClick() {
                this.$router.go(-1)
            },
            showVoucher() {
                this.isShowVoucher = !this.isShowVoucher;
            },
            goSearchPage() {
                console.log("goSearchPage.........")
                this.inputText = ""
                this.morePage = false
                this.dataPage = false
                this.searchPage = true
            },
            cancelAndComeBack() {
                console.log("cancelAndComeBack.........")
                if (this.searchPage === true) {
                    //todo 关闭搜索弹框
                    this.$router.back(-1)
                    /*this.$emit("change", false);*/
                } else if (this.dataPage === true) {

                    this.getDataInfo = []
                    this.searchPage = true
                    this.dataPage = false
                } else if (this.morePage === true) {
                    this.dataPage = true
                    this.morePage = false
                }

            },
            //确定搜索
            confirmInput() {
                console.log("confirmInput.........")
                if ( !this.searchPage === true) {
                    return;
                }
                if ( this.inputText === "") {
                    this.$vux.toast.show({
                        type: 'text',
                        width:"12em",
                        text: '请输入搜索内容'
                    })
                } else {
                    //进行搜索并关闭search
                    this.searchPage = false
                    this.dataPage = true
                    let approvalData = [];
                    if (this.globalMap.approval.length > 0) {
                        approvalData = ["approval"];
                    }
                    this.selectBtnList = this.globalMap.file.concat(this.globalMap.voucher,approvalData,
                        this.globalMap.chat,this.globalMap.firm,this.globalMap.guest,this.globalMap.notice,
                        this.globalMap.taskManage,this.globalMap.shop,this.globalMap.projectManage,this.globalMap.assets);
                    console.log(this.selectBtnList)
                    if ( this.selectBtnList.length === 0) {
                        /*this.selectBtnList = ["chatFile", "taskFile", "explorer", "knowledge", "finance", "goods",
                            "importExport", "cabinet", "approval", "singleChat", "groupChat", "customerService",
                            "firmName", "phone", "describe", "personnel", "card", "chat", "name", "content",
                            "author", "taskSet", "task", "GoodsName", "classification", "project",
                            "projectTask", "assetsVoucher", "assetsCard"];*/
                        //todo 未全部对接完接口时不能用全部搜索，暂时用下面的，对接一个加一个
                        this.selectBtnList = ["explorer", "knowledge", "approval", "firmName", "phone", "describe",
                            "personnel", "name", "content", "author", "assetsVoucher", "assetsCard"];
                    }
                    let postArr = this.handlePostData(this.selectBtnList)
                    console.log(postArr)
                    this.initData(postArr);
                }
            },
            parentFile(key,val) {
                console.log(val);
                let _this = this;
                let flag = 0;
                let arr = [];
                if ( this.globalMap[key] ) {
                    this.globalMap[key].forEach(item => {
                        if (item === val) {
                            flag = 1;
                        } else {
                            arr.push(item)
                        }
                    })
                }
                if (flag === 0) {
                    arr.push(val);
                    switch (val) {
                        case 'file':
                            _this.globalMap[val] = ["chatFile", "taskFile", "explorer", "knowledge"];
                            break;
                        case 'voucher':
                            _this.globalMap[val] = ["finance", "goods", "importExport", "cabinet"];
                            break;
                        case 'approval':
                            _this.globalMap[val] = ["ordinaryApproval", "leave", "voucher", "salary"];
                            break;
                        case 'chat':
                            _this.globalMap[val] = ["singleChat", "groupChat", "customerService"];
                            break;
                        case 'firm':
                            _this.globalMap[val] = ["firmName", "phone", "describe"];
                            break;
                        case 'guest':
                            _this.globalMap[val] = ["personnel", "card", "chat"];
                            break;
                        case 'notice':
                            _this.globalMap[val] = ["name", "content", "author"];
                            break;
                        case 'taskManage':
                            _this.globalMap[val] = ["taskSet", "task"];
                            break;
                        case 'shop':
                            _this.globalMap[val] = ["GoodsName", "classification"];
                            break;
                        case 'projectManage':
                            _this.globalMap[val] = ["project", "projectTask"];
                            break;
                        case 'assets':
                            _this.globalMap[val] = ["assetsVoucher", "assetsCard"];
                            break;
                    }
                } else {
                    this.globalMap[val] = [];
                }
                this.globalMap[key] = arr;
                console.log(this.globalMap[key]);
            },
            childrenFile(key,val) {
                console.log(val);
                let flag = 0;
                let arr = [];
                if ( this.globalMap[key] ) {
                    this.globalMap[key].forEach(item => {
                        if (item === val) {
                            flag = 1;
                        } else {
                            arr.push(item)
                        }
                    })
                }
                if (flag === 0) {
                    arr.push(val);
                }
                this.globalMap[key] = arr;
                console.log(this.globalMap[key]);
            },
            selectHandleCls(type,array,val) {
                const wrap = `btn-${type}`;
                let flag = false;
                array.forEach(item => {
                    if (item === val) {
                        flag = true;
                    }
                })
                return [
                    wrap,
                    { [`btn-selected`]: flag },
                ];
            },
            handlePostData(array) {
                let that = this;
                let postArray = [];
                array.forEach(item => {
                    if (item === "chatFile") {
                        /*postArray.push(that.getChatFileRes())*/
                    } else if (item === "taskFile") {
                        /*postArray.push(that.getTaskFileRes())*/
                    } else if (item === "explorer") {
                        postArray.push(that.getExplorerRes())
                    } else if (item === "knowledge") {
                        postArray.push(that.getKnowledgeRes())
                    } else if (item === "approval") {
                        postArray.push(that.getApprovalRes())
                    } else if (item === "firmName") {
                        postArray.push(that.getFirmNameRes())
                    } else if (item === "phone") {
                        postArray.push(that.getPhoneRes())
                    } else if (item === "describe") {
                        postArray.push(that.getDescribeRes())
                    } else if (item === "personnel") {
                        postArray.push(that.getPersonnelRes())
                    } else if (item === "name") {
                        postArray.push(that.getNameRes())
                    } else if (item === "content") {
                        postArray.push(that.getContentRes())
                    } else if (item === "author") {
                        postArray.push(that.getAuthorRes())
                    } else if (item === "assetsVoucher") {
                        postArray.push(that.getAssetsVoucherRes())
                    } else if (item === "assetsCard") {
                        postArray.push(that.assetsCard())
                    }
                })
                return postArray;
            },
            handleResultData(array) {
                let that = this;
                let resultMap = {}
                for (let i = 0; i < array.length; i++) {
                    resultMap[that.selectBtnList[i]] = array[i]
                }
                return resultMap;
            },

            moreSearchData(parentType,childrenType,data) {
                console.log("moreSearchData.........")

                this.moreData.parentType = parentType
                this.moreData.childrenType = childrenType
                this.moreData.searchData = data
                this.morePage = true
                this.dataPage = false
            },
            openPath(data,item) {
                console.log("openPath.........")
                if (data.childrenType === "人事档案") {
                    this.$router.push(item.url)
                }
                if (data.childrenType === "知识库") {
                    console.log(item.url)
                    this.$router.push("/" + item.url)
                }
                if (data.childrenType === "文件柜") {
                    let type = item.title.substring(item.title.lastIndexOf('.') + 1)
                    if (type === 'image' || type === 'png') {
                        this.onViewPictures(item)
                    }
                    if (type === 'doc' || type === 'txt' || type === 'pdf' || type === 'docx') {
                        this.onViewDocx(item)
                    }
                }
                if (data.parentType === "商号") {
                    this.$router.push({
                        path:'/webSite',
                        query:{
                            companyId: item.id,
                        }
                    })
                }
                if (data.parentType === "审批") {
                    this.$router.push(item.url)
                }
                if (data.parentType === "公告") {
                    this.$router.push(item.url)
                }
            },
            imgData(data,item) {
                console.log("imgData.........")
                let type = item.title.substring(item.title.lastIndexOf('.') + 1)
                if (data.childrenType === "文件柜" || data.childrenType === "知识库" ) {
                    switch (type) {
                        case 'folder':
                            item.img = require('../../assets/img/explorer/folder.png')
                            break
                        case 'txt':
                            item.img = require('../../assets/img/explorer/txt.png')
                            break
                        case 'pdf':
                            item.img = require('../../assets/img/explorer/pdf.png')
                            break
                        case 'zip':
                            item.img = require('../../assets/img/explorer/zip.png')
                            break
                        case 'rar':
                            item.img = require('../../assets/img/explorer/rar.png')
                            break
                        case 'image':
                        case 'png':
                            item.img = require('../../assets/img/explorer/jpg.png')
                            break
                        case 'audio':
                            item.img = require('../../assets/img/explorer/mp3.png')
                            break
                        case 'video':
                            item.img = require('../../assets/img/explorer/avi.png')
                            break
                        case 'doc':
                            item.img = require('../../assets/img/explorer/doc.png')
                            break
                        case 'xls':
                            item.img = require('../../assets/img/explorer/xls.png')
                            break
                        case 'ppt':
                            item.img = require('../../assets/img/explorer/ppt.png')
                            break
                        default:
                            item.img = require('../../assets/img/explorer/file.png')
                    }
                }

                if (data.parentType === "商号") {
                    let imgPath = item.img;
                    let default_img = "/JsLib/dist/app/images/defaultImgs/companyDef_.jpg";
                    let itemImg = "";
                    if (imgPath != null || imgPath != "") {
                        let heardImgUrl = "";
                        if (imgPath.indexOf("QR") > -1) {
                            let imgSrc = imgPath.substring(imgPath, imgPath.length - 2);
                            heardImgUrl = imgSrc + ".jpg";
                        } else {
                            heardImgUrl = imgPath + ".jpg";
                        }
                        itemImg = getImageUrl(heardImgUrl, default_img);
                    } else {
                        itemImg = default_img;
                    }
                    return itemImg;
                }
                return item.img;
            },
            /*onProcessingFile(item, data) {
                let docxUrl = this.saveDocxSrc.find(docxItem => docxItem[item.id]);
                if (docxUrl) {
                    this.iFrameHeight ();
                    this.docxSrc = docxUrl[item.id].url;
                    return
                }
                switch (item.fileType) {
                    case 'image':
                        this.onViewPictures(data);
                        break;
                    case 'doc':
                        this.onViewDocx(data);
                        break;
                    case 'txt':
                        this.onViewDocx(data);
                        break;
                    case 'pdf':
                        this.onViewDocx(data);
                        break
                }
            },*/
            includeData(item) {
                let searchText = this.inputText;
                let include = item.include;
                let reg = new RegExp(searchText,"g");
                let newinner = "";
                if (typeof include !== "undefined") {
                    newinner = include.replace(reg,'<span style="color:#ff8000;vertical-align: baseline;">' + searchText + '</span>')
                }
                return "包含:" + newinner;
            },
            onViewPictures(data) {
                this.imagePreviewList = [
                    {
                        msrc: data.url,
                        src: data.url,
                    }
                ];
                this.$nextTick(() => {
                    this.$refs.previewer.show(0)
                })
            },
            onViewDocx(data) {
                this.goBackFlag = true;
                let relativePath = data.url;
                let fileName = data.title;
                this.titleDocx = fileName || '标题';
                let url = '/ZingMH/ZDesk/previewFile/getPreviewPath.action';
                let params = {
                    src: relativePath
                };
                this.$http.post(url, Qs.stringify(params)).then(res => {
                    if (res.data.success) {
                        let { url } = res.data.data;
                        console.log(url)
                        this.docxSrc = url;
                        /*this.saveDocxSrc.push({ [this.id]: res.data.data });*/
                        this.iFrameHeight()
                    }
                })
            },
            onDoSome() {
                this.explorerWidth = 0;
                this.explorerHeight = 0;
                this.showDocx = false;
                this.docxSrc = '';
            },
            iFrameHeight () {
                if (!this.docxSrc) return;
                // let t = document.getElementsByClassName('my_iframe_form_data')[0].clientWidth;
                this.$nextTick(() => {
                    let ifr = document.getElementById('my_iframepage');
                    let imgList = ifr.contentWindow.document.getElementsByTagName('img');
                    if (isIos()) {
                        let my_body = ifr.contentWindow.document.body;
                        // my_div.style.overflowY = 'scroll';
                        my_body.style.touchAction = 'pan-y';
                        my_body.style.position = 'static';
                        my_body.style.overflow = 'scroll';
                        my_body.style.webkitOverflowScrolling = 'touch';
                        //-webkitOverflowScrolling: touch

                        /*-webkit-overflow-scrolling: touch*/
                        /*overflow-y: scroll*/
                    }

                    let item , cd , ht , cls;
                    for (let i = 0 , t = imgList.length; i < t; i++) {
                        item = imgList[i];
                        cd = item.clientWidth;
                        ht = item.clientHeight;
                        cls = document.documentElement.clientWidth || document.body.clientWidth;
                        item.style.width = cd * (cls / cd) - 20;
                        item.style.maxWidth = '100%';
                        item.style.height = ht * (cls / cd);
                    }
                    this.showDocx = true;
                })
                // var bHeight = ifr.contentWindow.document.body.scrollHeight;
                // var dHeight = ifr.contentWindow.document.documentElement.scrollHeight;
                // var height = Math.max(bHeight, dHeight);
                // ifr.height = Math.max(height,400);
                // console.log(imgList);
                // let wd = ifr.contentWindow.document.documentElement.scrollWidth;
                // let ht = document.documentElement.clientHeight * 0.9 - 50;
                // if (!t && !wd) return;
                // let x = t / wd;
                // wd = wd < 365 ? 365 : wd;
                // this.explorerWidth = wd;
                // this.explorerHeight = ht;
                // // ifr.style.width = `${wd}px`;
                // // ifr.style.height = `${ht}px`;
                // // ifr.height = `${ht}px`;
                // ifr.style.transform = `scale(${x})`;
                // ifr.style.transformOrigin = '0 0';
                // document.getElementsByClassName('iframe_box')[0].style.height = ht*x + 'px'
            },



            getChatFileRes() {
                //todo
                let url = '/zingbiz/auth/role/loadRoleRes';
                let params = {
                };
                return this.$http.post(url,params);
            },
            getTaskFileRes() {
                //todo
                let url = '/zingbiz/auth/role/loadRes';
                let params = {
                };
                return this.$http.post(url,params)
            },
            getExplorerRes() {
                let url = '/zingbiz/explorer/globalSearchFilesN';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.post(url,params)
            },
            getKnowledgeRes() {
                let url = '/zingbiz/appnote/globalSearchAppnote';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.post(url,params)
            },


            getApprovalRes() {
                let searchType = "";
                this.globalMap.approval.forEach(item => {
                    if (item === "ordinaryApproval") {
                        searchType += "PT,"
                    } else if (item === "leave") {
                        searchType += "QJ,"
                    } else if (item === "voucher") {
                        searchType += "PZ,"
                    } else if (item === "salary") {
                        searchType += "XZTZ,"
                    }
                })
                if ( searchType.length > 0) {
                    searchType = searchType.substr(0, searchType.length - 1);
                } else {
                    //发送这个请求但没有参数时 是全部搜索
                    searchType = "PT,QJ,PZ,XZTZ";
                }
                console.log(this.globalMap.approval)
                console.log(searchType)
                let url = '/zingbiz/workflow/helper/globalSearch';
                let params = {
                    searchText : this.inputText,
                    searchType : searchType
                };
                return this.$http.post(url,params)
            },
            /*getLeaveRes() {
                let url = '/zingbiz/workflow/helper/globalSearch';
                let params = {
                    searchText : this.inputText,
                    searchType : "QJ",
                };
                return this.$http.post(url,params)
            },
            getVoucherRes() {
                let url = '/zingbiz/workflow/helper/globalSearch';
                let params = {
                    searchText : this.inputText,
                    searchType : "PZ",
                };
                return this.$http.post(url,params)
            },
            getSalaryRes() {
                let url = '/zingbiz/workflow/helper/globalSearch';
                let params = {
                    searchText : this.inputText,
                    searchType : "XZTZ",
                };
                return this.$http.post(url,params)
            },
*/

            getFirmNameRes() {
                let url = '/zingbiz/auth/org/getAllServiceNumber';
                let params = {
                    searchText : this.inputText,
                    searchType : "name",
                };
                return this.$http.post(url,params)
            },
            getPhoneRes() {
                let url = '/zingbiz/auth/org/getAllServiceNumber';
                let params = {
                    searchText : this.inputText,
                    searchType : "phone",
                };
                return this.$http.post(url,params)
            },
            getDescribeRes() {
                let url = '/zingbiz/auth/org/getAllServiceNumber';
                let params = {
                    searchText : this.inputText,
                    searchType : "desc",
                };
                return this.$http.post(url,params)
            },
            getPersonnelRes() {
                let url = 'zingbiz/hrManager/PersonnelFile/getUserByNameAndTel';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.post(url,params)
            },
            getNameRes() {
                let url = '/zingbiz/notice/searchNotice';
                let params = {
                    searchText : this.inputText,
                    searchType : "name",
                };
                return this.$http.get(url,{ params:params })
            },
            getContentRes() {
                let url = '/zingbiz/notice/searchNotice';
                let params = {
                    searchText : this.inputText,
                    searchType : "content",
                };
                return this.$http.get(url,{ params:params })
            },
            getAuthorRes() {
                let url = '/zingbiz/notice/searchNotice';
                let params = {
                    searchText : this.inputText,
                    searchType : "author",
                };
                return this.$http.get(url,{ params:params })
            },
            getAssetsVoucherRes() {
                let url = 'zingbiz/fixedAssets/assetsManagement/searchAssetsVoucher';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.get(url,{ params:params })
            },
            assetsCard() {
                let url = 'zingbiz/fixedAssets/assetsManagement/globalSearch';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.get(url,{ params:params })
            },
            /*getAssetsRes() {
                let url = '/zingbiz/fixedAssets/assetsManagement/globalSearch';
                let params = {
                    searchText : this.inputText,
                };
                return this.$http.post(url,params)
            },*/
            initData(postArr) {
                console.log('initData');
                let that = this;
                this.$http.all(postArr).then(this.$http.spread( function() {

                    console.log(arguments);
                    let res = that.handleResultData(arguments);
                    console.log(res);
                    if (res.hasOwnProperty("chatFile")) {
                        console.log(res.chatFile);
                    }
                    if (res.hasOwnProperty("taskFile")) {
                        console.log(res.taskFile);
                    }

                    if (res.hasOwnProperty("explorer")) {
                        console.log(res.explorer);
                        if (res.explorer.data.data.length > 0) {
                            let map = {};
                            map.parentType = "文件";
                            map.childrenType = "文件柜";
                            map.searchData = res.explorer.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("knowledge")) {
                        console.log(res.knowledge);
                        if (res.knowledge.data.data.length > 0) {
                            let map = {};
                            map.parentType = "文件";
                            map.childrenType = "知识库";
                            map.searchData = res.knowledge.data.data;
                            that.getDataInfo.push(map);
                        }
                    }

                    if (res.hasOwnProperty("approval")) {
                        console.log(res.approval);
                        if (res.approval.data.success === true) {
                            let approvalData = res.approval.data.data;
                            if (approvalData.ptData.length > 0) {
                                let map = {};
                                map.parentType = "审批";
                                map.childrenType = "普通审批";
                                map.searchData = approvalData.ptData;
                                that.getDataInfo.push(map);
                            }

                            if (approvalData.qjData.length > 0) {
                                let map = {};
                                map.parentType = "审批";
                                map.childrenType = "请假";
                                map.searchData = approvalData.qjData;
                                that.getDataInfo.push(map);
                            }
                            if (approvalData.pzData.length > 0) {
                                let map = {};
                                map.parentType = "审批";
                                map.childrenType = "凭证";
                                map.searchData = approvalData.pzData;
                                that.getDataInfo.push(map);
                            }
                            if (approvalData.xztzData.length > 0) {
                                let map = {};
                                map.parentType = "审批";
                                map.childrenType = "薪资调整";
                                map.searchData = approvalData.xztzData;
                                that.getDataInfo.push(map);
                            }
                        }
                    }
                    /*if (res.hasOwnProperty("leave")) {
                        console.log(res.leave);
                        if (res.leave.data.data.length > 0) {
                            let map = {};
                            map.parentType = "审批";
                            map.childrenType = "请假";
                            map.searchData = res.leave.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("voucher")) {
                        console.log(res.voucher);
                        if (res.voucher.data.data.length > 0) {
                            let map = {};
                            map.parentType = "审批";
                            map.childrenType = "凭证";
                            map.searchData = res.voucher.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("salary")) {
                        console.log(res.salary);
                        if (res.salary.data.data.length > 0) {
                            let map = {};
                            map.parentType = "审批";
                            map.childrenType = "薪资调整";
                            map.searchData = res.salary.data.data;
                            that.getDataInfo.push(map);
                        }
                    }*/

                    if (res.hasOwnProperty("firmName")) {
                        console.log(res.firmName);
                        if (res.firmName.data.data.length > 0) {
                            let map = {};
                            map.parentType = "商号";
                            map.childrenType = "名称";
                            map.searchData = res.firmName.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("phone")) {
                        console.log(res.phone);
                        if (res.phone.data.data.length > 0) {
                            let map = {};
                            map.parentType = "商号";
                            map.childrenType = "手机";
                            map.searchData = res.phone.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("describe")) {
                        console.log(res.describe);
                        if (res.describe.data.data.length > 0) {
                            let map = {};
                            map.parentType = "商号";
                            map.childrenType = "简介";
                            map.searchData = res.describe.data.data;
                            that.getDataInfo.push(map);
                        }
                    }


                    if (res.hasOwnProperty("personnel")) {
                        console.log(res.personnel);
                        if (res.personnel.data.data.length > 0) {
                            let map = {};
                            map.parentType = "英客";
                            map.childrenType = "人事档案";
                            map.searchData = res.personnel.data.data;
                            that.getDataInfo.push(map);
                        }
                    }


                    if (res.hasOwnProperty("name")) {
                        console.log(res.name);
                        if (res.name.data.data.length > 0) {
                            let map = {};
                            map.parentType = "公告";
                            map.childrenType = "名称";
                            map.searchData = res.name.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("content")) {
                        console.log(res.content);
                        if (res.content.data.data.length > 0) {
                            let map = {};
                            map.parentType = "公告";
                            map.childrenType = "内容";
                            map.searchData = res.content.data.data;
                            that.getDataInfo.push(map);
                        }
                    }
                    if (res.hasOwnProperty("author")) {
                        console.log(res.author);
                        if (res.author.data.data.length > 0) {
                            let map = {};
                            map.parentType = "公告";
                            map.childrenType = "作者";
                            map.searchData = res.author.data.data;
                            that.getDataInfo.push(map);
                        }
                    }

                    if (res.hasOwnProperty("assetsVoucher")) {
                        console.log(res.assetsVoucher);
                        /*if (res.assetsVoucher.data.data.length > 0) {
                            let map = {};
                            map.parentType = "固定资产";
                            map.childrenType = "资产凭证";
                            map.searchData = res.assetsVoucher.data.data;
                            that.getDataInfo.push(map);
                        }*/
                    }
                    if (res.hasOwnProperty("assetsCard")) {
                        console.log(res.assetsCard);
                        /*if (res.assetsCard.data.data.length > 0) {
                            let map = {};
                            map.parentType = "固定资产";
                            map.childrenType = "资产卡片";
                            map.searchData = res.assetsCard.data.data;
                            that.getDataInfo.push(map);
                        }*/
                    }

                }))
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';


    .global-search {
        width 100%
        height 100%
        position: absolute;
        top: 0px;
    }

    .content {
        /*margin-top: 2px;
        margin-left: 2px;*/
    }

    .searchPage {
        padding-top: 20px;
    }
    .dataPage {
        background-color: #f5f5f5;
    }
    .content-flexbox {
        margin-bottom: 8px;
    }
    .btn-parent {
        border: 1px solid #1abbfc;
        border-radius: 5px;
        text-align: center;
        color: #1abbfc;
        padding-top: 3px;
        padding-left: 2px;
        padding-bottom: 3px;
        padding-right: 2px;
        margin-left: 20px;
    }
    .btn-children {
        border: 1px solid #ffffff;
        color: #ff8000;
        display: inline-block;
        padding-top: 3px;
        padding-left: 3px;
        padding-bottom: 3px;
        padding-right: 3px;
    }
    .btn-parent.btn-selected {
        background-color: #ADDDF7;
    }
    .btn-children.btn-selected {
        border: 1px solid #ff8000;
        background-color: #FAD3AF;
    }

    .more .iconfont{
        font-size: 14px;
        display: inline-block;
        padding-bottom: 2px;
    }
    .block-data{
        margin-bottom: 10px;
        padding-top: 10px;
        background-color: #fff;
    }
    .search-data-title{
        border-bottom: 1px solid #eaeefb;
        padding-left: 13px;
    }
    .morebtn{
        padding-left: 13px;
    }
    .search-data-title .iconfont{
        font-size: 14px;
        /*display: inline-block;
        padding-bottom: 2px;*/
    }


    .searchContainer{
        width:100%;
        background-color: #F7F8F9;
        padding: 5px 13px;
        .Top-bar{
            padding-bottom 12px
            position relative
            height 30px
            width 100%
            .goback{
                position absolute
                top: 50%
                transform translateY(-50%)
                i{
                    font-size 20px
                    font-weight bold
                }
            }
            .cancel-icon{
                position absolute
                top: 50%
                transform translateY(-50%)
                font-size: 14px;
                span{
                    color: #BDBDBD;
                }
            }
            .inputSpan{
                position: absolute;
                left: 40px;
                right:90px;
                top 50%
                transform translateY(-50%)
                .inputForm{
                    width:100% ;
                    padding: 4px 20px 4px 28px !important;
                    margin-left: 5px;
                    font-size: 16px !important;
                    background: url(../../../../static/images/search.png) center left no-repeat;
                    background-size: 16px 16px;
                    background-position-x: 7px;
                    background-color: white;
                    border-radius: 8px !important
                }
            }
            .confirm-icon{
                position: absolute;
                top 50%
                transform translateY(-50%)
                right: 5px;
                font-size: 16px;
                .confirmInput{
                    color: #ff8000 ;
                    font-size 14px
                    text-decoration:none;
                }
            }

        }
    }
    input::-webkit-input-placeholder{
        color: #707070 ;
        font-size 14px
        font-family italic
    }
    .inputForm:focus{
        outline none !important
    }
    #inputSpan{
        right 50px
    }
    .my_iframe_form_data{
        width: 100%
        max-width 100%
        height 92%
        font-size 16px!important
        -webkit-overflow-scrolling: touch
        overflow: scroll
    }

    #my_iframepage{
        /*-webkit-overflow-scrolling: touch*/
        /*overflow-y: scroll*/
        height: 100%;
        width: 100%;
    }

    .prompt {
        background: #ffffff;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
        color: #ff8000;
    }

</style>

