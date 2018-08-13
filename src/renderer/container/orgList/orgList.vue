<template>
    <div class="orgList">
        <zing-head :title="'同事名录'" class="vue-head">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-icon_folder" @click="explorerCompany"></i>
                </span>
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="showSearch"></i>
                </span>
                <span class="header-jiahao" v-show="isShowJiaHao">
                    <dropdown :data="datas"  :placementXAbs="placementXAbs" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </zing-head>
        <!--<div v-show="isShowSearch" style="position: absolute;top: 50px;left:0px;width: 100%;z-index: 100;">
            <search
                class="search"
                @on-cancel="onCancel"
                @on-change="onChange"
                @on-submit="onSubmit"
                position="absolute"
                ref="search"></search>
        </div>-->
        <search
            class="searchStyle"
            :searchFlag="isShowSearch"
            @cancelInput ="onCancel"
            @confirmInput="onChange"
        ></search>
        <div id="orgContent" class="org-content" :dataScroll="top" v-scroll-top>
            <zi-tree
                class="org-tree"
                ref="roleTree"
                :props="defaultProps"
                :data="orgUserData"
                :chatBtn="chatBtn"
                :explorerBtn="explorerBtn"
                @chat="chat"
                :cardUrl="cardUrl"
                @explorer="explorer"
                @select="select"
                :checkable="falseType"
                :deleteBtn="falseType"
                :show-line="falseType"
                :defaultExpandAll="defaultExpandAll"
                :moreBtn="falseType"
                editBtn
                addBtn
            />
            <group label-width="7em" label-margin-right="1em">
                <cell title="当前商号" value-align="left">
                    <div>
                      <span>{{companyName}}</span>
                      <span style="color: #40affc;float: right;">{{ "共" + userTotal + "人"}}</span>
                    </div>
                </cell>
            </group>
            <!--<group label-width="7em" label-margin-right="1em">
                <cell title="当前商号" value-align="left">
                    {{companyName}}
                </cell>
                <cell title="商号认证码" value-align="left">
                    <div>
                        <span>{{authenticationCode}}</span>
                        &lt;!&ndash; Trigger &ndash;&gt;
                        <button class="btn" style="color: deepskyblue" data-clipboard-action="copy" data-clipboard-target="#bar">
                            复制
                        </button>
                    </div>
                </cell>
                <cell title="认证码有效时间" value-align="left">
                    {{currentDate}}
                </cell>
                <div class="clipboard-wrapper">
                    &lt;!&ndash; Target &ndash;&gt;
                    <textarea id="bar">{{ authenticationCode }}</textarea>
                    &lt;!&ndash; Trigger &ndash;&gt;
                    &lt;!&ndash;<button class="btn" data-clipboard-action="copy" data-clipboard-target="#bar">
                        Cut to clipboard
                    </button>&ndash;&gt;
                </div>
            </group>-->
            <img v-show="returnTopImg" style="width: 50px;vertical-align: baseline;position: fixed;bottom: 90px;right: 10px;z-index: 10;"
                 @click="gotoTop" src="../../assets/img/ReturnTop.png"/>

        </div>
        <org-member-detail
            :memberCardUrl="orgMemberCardUrl"
            :ownCardUrl="cardUrl"
            :companyId="companyId"
            :personalDetails="personalDetails"
            :showDetail="showOrgMemberDetail"
            @hideDetail="hideOrgMemberDetail"
        ></org-member-detail>
    </div>
</template>

<script>
    import {
        Cell, Group, Confirm, Tab, TabItem, XButton, TransferDomDirective as TransferDom
    } from 'vux';
    import OrgMemberDetail from "../../components/orgmemberpicker/OrgMemberDetail"
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import Search from "@/components/search/search";
    import ZiTree from '@/components/zitree/ZiTree';
    import { deepCopy, createChat,getThumbUrl } from "../../utils/fn";
    import ClipboardJS from 'clipboard'
    import { doOneChat } from "@/utils/fn";

    // 剪贴板
    let clipboard
    let observer
    export default {
        name: "orgList",
        components: {
            Cell,
            Group,
            OrgMemberDetail,
            ZiTree,
            Confirm,
            Search,
            XButton,
            Tab,
            TabItem,
            ZingHead,
            Dropdown,
        },
        directives: {
            //自定义标签属性
            TransferDom,
            ScrollTop: {
                bind: function (el) {
                    // 监听el子节点变化
                    // Options for the observer (which mutations to observe)
                    // At the very least, childList, attributes, or characterData must be set to true.
                    // Otherwise, "An invalid or illegal string was specified" error is thrown.
                    let config = { childList: true, attributes: true, characterData: true }
                    // Callback function to execute when mutations are observed
                    let callback = mutationsList => {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'attributes') {
                                el.scrollTop = '0px'
                            }
                        }
                    }
                    // Create an observer instance linked to the callback function
                    observer = new MutationObserver(callback)
                    // Start observing the target node for configured mutations
                    observer.observe(el, config)
                },
                unbind() {
                    if (observer) observer.disconnect()
                }
            }
        },
        data() {
            return {
                tabTitle: ["组织编辑", "员工设置", "已离职员工"],
                defTab: "组织编辑",
                falseType: false,
                defaultExpandAll: true,
                isShowSearch: false,
                isShowJiaHao: true,
                chatBtn: true,
                explorerBtn: true,
                screenHeight: "0px",
                placementXAbs: -7,
                top: 0,
                cardUrl: "",
                companyId: "",
                userTotal: "",
                companyName: "",
                authenticationCode: "11111",
                currentDate: "",
                sourceData: {},
                userDict: {},
                userCardDict: {},
                sourceOrgUserData:[],
                // 用户详细
                orgMemberCardUrl: '',
                personalDetails: {},
                showOrgMemberDetail: false,
                // 剪贴板内容
                clipText: '',
                returnTopImg: false,
                datas: [
                    { content: "发起群聊" },
                    { content: "添加好友" },
                    { content: "添加商号" },
                ],
                defaultProps: {
                    title: "title",
                    children: "children",
                    src: "src",
                    auth: "auth"
                },
                orgUserData: [
                    /*{
                        title: "客服部",
                        children: [
                            {
                                title: "客服1部",
                                checked: false
                            }
                        ]
                    },
                    {
                        title: "产品部",
                        children: [
                            {
                                title: "庄文达",
                                checked: true
                            },
                            {
                                title: "阎现军",
                            },
                            {
                                title: "刘广峰"
                            }
                        ]
                    },
                    {
                        title: "研发部",
                        children: [
                            {
                                title: "庄文达",
                                checked: true
                            },
                            {
                                title: "阎现军",
                            },
                            {
                                title: "刘广峰"
                            }
                        ]
                    }*/
                ]

            }
        },
        //钩子加载完触发
        created: function () {
            let that = this
            this.screenHeight = document.documentElement.clientHeight - 145;
            this.getOrgRoleUser();
            this.loadUserCurrentCompanyInfo();
            window.addEventListener('scroll', that.handleScroll, true);
        },
        mounted() {
            this.$nextTick(() => {
                // 初始化剪贴板
                clipboard = new ClipboardJS('.btn');
                clipboard.on('success', function(e) {
                    console.info('clipboard coped Text:', e.text)
                    e.clearSelection()
                })
                clipboard.on('error', function(e) {
                    console.error('clipboard error')
                    console.error('Action:', e.action)
                    console.error('Trigger:', e.trigger)
                })
            })
        },
        methods: {
            getOrgRoleUser() {
                console.log("getOrgRoleUser .......");
                let url = "/zingbiz/auth/org/getOrgRoleUser";
                let params = {};
                    params.companyId = this.$route.query.companyId;
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (!res.data.success) {
                            console.error("getOrgRoleUser error", res);
                            return;
                        }
                        let retData = res.data.data;
                        console.log(retData);
                        this.sourceData = JSON.parse(JSON.stringify(retData));
                        this.companyId = retData.companyId;
                        this.cardUrl = retData.cardUrl;
                        // 组织用户
                        this.orgUserData = this.handleOrgUserData(
                            retData.orgUserDatas,
                            this.userDict,
                            this.userCardDict,
                            this
                        );
                        this.sourceOrgUserData = this.orgUserData;
                        this.userTotal = Object.keys(this.userCardDict).length;


                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            loadUserCurrentCompanyInfo() {
                console.log("loadUserCurrentCompanyInfo .......");
                let that = this;
                let url = "/zingbiz/auth/user/loadUserCurrentCompanyInfo";
                let params = {};
                params.companyId = this.$route.query.companyId;
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            console.log(res);
                            let retData = res.data.data;
                            this.companyName = retData.companyName;
                            /*this.authenticationCode = retData.authenticationCode;*/
                            /*this.currentDate = retData.currentDate;
                            let systemTime = 1524823049262;*/
                            /*let systemTime = retData.currentDate;
                            //认证码倒计时，距离23:59:59的倒计时
                            window.setInterval(function () {
                                var nowDate = new Date(systemTime);
                                systemTime = systemTime + 1000;
                                var year = nowDate.getFullYear();
                                var month = nowDate.getMonth() + 1;
                                var day = nowDate.getDate();

                                var endTime = new Date(year,month,day,23,59,59);
                                var tt = endTime.getTime() - nowDate.getTime();

                                var hh = Math.floor(tt / 1000 / 60 / 60 % 24);
                                var mm = Math.floor(tt / 1000 / 60 % 60);
                                var ss = Math.floor(tt / 1000 % 60);

                                var hh = hh < 10 ? "0" + hh : hh;
                                var mm = mm < 10 ? "0" + mm : mm;
                                var ss = ss < 10 ? "0" + ss : ss;

                                var showTime = hh + ":" + mm + ":" + ss;
                                that.currentDate = showTime;
                            }, 1000);*/
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            handleOrgItem(treeOrgData, orgData, userDict, userCardDict, _this, searchType, searchVal) {
                treeOrgData.title = orgData["text"];
                treeOrgData.type = "dept";
                treeOrgData.auth = true;
                // 原始数据
                treeOrgData.source = deepCopy(orgData);

                let children = [];
                treeOrgData.children = children;
                // 处理成员
                let users = orgData["users"];
                if (!users) users = [];
                users.forEach(user => {
                    let treeUserData = {};
                    treeUserData.id = user["rowId"];
                    // 姓名取'userName'
                    treeUserData.title = user["userName"];
                    //压缩图片
                    // treeUserData.src = user["headImg"];
                    treeUserData.src = getThumbUrl(user["headImg"], 200, 200, "/ZingVue/static/images/userDef_.jpg", false);
                    treeUserData.type = "user";
                    treeUserData.auth = user["file_status"] === "通过" ? true : false;
                    treeUserData.source = user;
                    if (searchType === "search") {
                        if (treeUserData.title.indexOf(searchVal) >= 0) {
                            children.push(treeUserData);
                        }
                    } else {
                        children.push(treeUserData);
                    }
                    if (!userDict.hasOwnProperty(user["rowId"])) {
                        userDict[user["rowId"]] = treeUserData;
                    }
                    if (!userCardDict.hasOwnProperty(user["cardUrl"])) {
                        userCardDict[user["cardUrl"]] = treeUserData;
                    }
                });

                // 处理子部门
                if (orgData["children"]) {
                    orgData["children"].forEach(childOrgData => {
                        let treeChildOrgData = {};
                        children.push(treeChildOrgData);
                        // 尾递归处理数据
                        _this.handleOrgItem(
                            treeChildOrgData,
                            childOrgData,
                            userDict,
                            userCardDict,
                            _this,
                            searchType,
                            searchVal
                        );
                    });
                }
            },
            handleOrgUserData(orgUserDatas, userDict, userCardDict, _this) {
                let tmpTreeData = orgUserDatas.map(orgData => {
                    let treeOrgData = {};
                    _this.handleOrgItem(treeOrgData, orgData, userDict, userCardDict, _this, "", "");
                    return treeOrgData;
                });
                return tmpTreeData;
            },
            handleMenu(data) {
                console.log(data);
                let self = this;
                if (data.content === "发起群聊") {
                    createChat(self);
                } else if (data.content === "添加好友") {
                    self.$vux.toast.show({
                        text: "待全局搜索重构后对接",
                        type: 'text',
                        position: 'default',
                    })
                } else if (data.content === "添加商号") {
                    self.$vux.toast.show({
                        text: "待全局搜索重构后对接",
                        type: 'text',
                        position: 'default',
                    })
                }
            },
            showSearch() {
                this.isShowSearch = !this.isShowSearch;
                // this.$refs.search.setFocus();
            },
            onChange(val) {
                console.log(val);
                let _this = this;
                let tmpTreeData = this.sourceData.orgUserDatas.map(orgData => {
                    let treeOrgData = {};
                    _this.handleOrgItem(treeOrgData, orgData, [], [], _this, "search", val);
                    return treeOrgData;
                });
                this.orgUserData = tmpTreeData
            },
            onSubmit(val) {
                console.log(val);
            },
            onCancel(val) {
                this.isShowSearch = false;
                this.orgUserData = this.sourceOrgUserData;
            },
            select(data) {
                console.log("select............");
                console.log(data);
                let dataNode = data.node;
                if (dataNode.isLeaf) {
                    let selected = data.node.source;
                    this.orgMemberCardUrl = selected.cardUrl
                    this.showOrgMemberDetail = true
                }
            },
            explorerCompany() {
                console.log("explorerCompany............");
                this.$router.push({
                    name:"explorer",
                    query:{
                        recordType:"company",
                        companyId:this.companyId,
                        currentCompanyId:this.companyId,
                    }
                });
            },
            explorer(data) {
                console.log("explorer............");
                console.log(data.origin.source.id);
                this.$router.push({
                    name:"explorer",
                    query:{
                        currentCompanyId:this.companyId,
                        recordType:"department",
                        companyId:data.origin.source.id
                    }
                });
            },
            chat(data) {
                console.log("chat............");
                console.log(data);
                doOneChat(data.origin.source.cardUrl,true,this.$router)
            },
            hideOrgMemberDetail() {
                this.showOrgMemberDetail = false
            },
            copy(data) {
                console.log("copy............");
                console.log(data);
            },
            gotoTop() {
                this.top += 1;
            },
            handleScroll(e) {
                var scrollTop =  document.getElementById("orgContent").scrollTop;
                if (scrollTop > 420) {
                    this.returnTopImg = true;
                } else if (scrollTop < 420) {
                    this.returnTopImg = false;
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" >
    .zi-tree-li .iconfont.icon-icon--{
        color: #ff8000;
        font-size: 30px;
    }
    .iconfont.icon-icon_folder{
        color: #ff8000;
        font-size: 20px;
    }
    .zi-tree .span-wrapper-right {
        padding-right: 0px;
    }
    .zi-tree .span-wrapper-right span + span {
        margin-right: 4px;
    }
    body .el-dropdown-menu.el-dropdown-menu-vertical {
        background-color: #e8e8e8;
    }
    .el-dropdown.el-dropdown-placement-bottomRight {
        background-color: #e8e8e8;
    }
</style>
<style lang="stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    .orgList
        display flex
        flex-direction column
        width 100%
        height 100%

        .vue-head
            flex-shrink 0
        .org-content
            flex-grow 1
            overflow-y auto

            .clipboard-wrapper
                width: 1px
                height: 1px
                position: absolute
                left: -1000px
                top: -1000px
</style>
