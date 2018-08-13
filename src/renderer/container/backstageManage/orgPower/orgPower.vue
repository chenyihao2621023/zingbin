<template>
    <div class="orgPower">
        <zing-head :title="'组织管理'" class="vue-head">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="showSearch"></i>
                </span>
                <span class="header-jiahao" v-show="isShowJiaHao">
                    <badge v-if="bdshRedPoint" style="position: absolute;top:20px;left: 80%"></badge>
                    <dropdown :data="datas" :placementXAbs="placementXAbs" trigger="click" placement="bottomRight" @item-click="handleMenu">
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
        <div class="vue-tab">
            <tab class="" :line-width="3">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab"
                          @click="defTab = item" :key="index">{{item}}
                </tab-item>
            </tab>
        </div>

        <div class="tab-content">
            <div class="tabDiv" v-show="orgEditShow" >
                <!--<other-in-vocational :pzData="pzDatasForVS" :postParams="postParams" :ckInfo="ckInfo"></other-in-vocational>-->
                <org-edit ref="orgEdit"
                          :cardUrl="cardUrl"
                          :orgUserData="orgUserData"
                          :roleOrgData="roleOrgData"
                          @on-updateOneOrg="updateOneOrg"
                          @on-addDepartment="addDepartment"
                          @on-getQuitEmployeeData="getQuitEmployeeData"
                          @on-deleteDepartment="deleteDepartment"
                ></org-edit>
            </div>
            <div class="tabDiv" v-show="companyUserSettingShow">
                <!--<other-in-shen-he :pzData="pzDatasForVS" :postParams="postParams" :ckInfo="ckInfo"></other-in-shen-he>-->
                <company-user-setting
                    :companyId="companyId"
                    ref="companyUserSetting"
                    :roleUserData="roleUserData"
                    :roleOrgData="roleOrgData"
                    @on-removeItemRole="removeItemRole"
                    @on-addItemRole="addItemRole"
                    @on-upDateItemRole="upDateItemRole"
                    @on-updateCardUserById="updateCardUserById"
                ></company-user-setting>
            </div>
            <div class="tabDiv" v-show="quitEmployeeShow">
                <!--<other-in-shen-he :pzData="pzDatasForVS" :postParams="postParams" :ckInfo="ckInfo"></other-in-shen-he>-->
                <quit-employee ref="quitEmployee" @on-reinstatement="reinstatement"></quit-employee>
            </div>
        </div>
        <!--<div v-transfer-dom>-->
            <!--<confirm v-model="showConfirm"
                     show-input
                     :title="'添加部门'"
                     @on-confirm="onConfirm">
            </confirm>-->
        <!--</div>-->
    </div>
</template>

<script>
    import {
        Badge, Confirm, Tab, TabItem, XButton, TransferDomDirective as TransferDom
    } from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import Search from "@/components/search/search";
    import OrgEdit from './orgEdit';
    import CompanyUserSetting from './companyUserSetting';
    import QuitEmployee from './quitEmployee';
    import { deepCopy,Z_IsEmpty20 } from "../../../utils/fn";
    import store from '../../../store'
    import { mapState} from "vuex";

    export default {
        name: "orgPower",
        components: {
            Badge,
            Confirm,
            Search,
            XButton,
            Tab,
            TabItem,
            ZingHead,
            Dropdown,
            OrgEdit,
            CompanyUserSetting,
            QuitEmployee,
        },
        directives: {
            //自定义标签属性
            TransferDom
        },
        data() {
            return {
                tabTitle: ["组织编辑", "员工设置", "已离职员工"],
                defTab: "组织编辑",
                isShowSearch: false,
                isShowJiaHao: true,
                showConfirm: false,
                orgEditShow: true,
                companyUserSettingShow: false,
                quitEmployeeShow: false,
                bdshRedPoint:false,
                screenHeight: "0px",
                placementXAbs: -7,
                headImgSrc: "/JsLib/dist/app/images/defaultImgs/userDef_.jpg",
                tabIndex: 0 ,
                companyId: "",
                cardUrl: "",
                sourceData: {},
                userDict: {},
                userCardDict: {},
                roleOrgData: {},
                orgUserData:[],
                sourceOrgUserData:[],
                roleUserData:[],
                sourceRoleUserData:[],
                datas: [
                    { content: "新建部门" },
                    { content: "入职扫码绑定" },
                    { content: "绑定审核" },
                    { content: "同组商号" },
                ],
            }
        },
        computed: {
            ...mapState({
                redPoint: state => state.ui.redPoint,
            })
        },
        watch: {
            redPoint(rpData) {
                if (!rpData) {
                    //console.warn("error redPoint data", rpData);
                    return;
                }
                let sArr = rpData.split("_ZSP_");
                for (let i = 0; i < sArr.length; i++) {
                    if (!Z_IsEmpty20(sArr[i])) {
                        if (sArr[i].substring(0, sArr[i].indexOf(":")) === "bindRequest") {
                            let bindRequestStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            let bindRequest = JSON.parse(bindRequestStr);
                            if (bindRequest.total > 0) {
                                this.bdshRedPoint = true
                            }
                        }
                    }
                }
            }
        },
        //钩子加载完触发
        created: function () {
            let that = this
            this.screenHeight = document.documentElement.clientHeight - 145;
            this.getOrgRoleUser();
            /*let r = store.getters.isHasPower("externalContactsAdmin")
            console.log(r)*/
            if (this.$route.query.tab != null && this.$route.query.tab != "" ) {
                this.chengeTab(this.$route.query.tab);
                if (this.$route.query.tab === 1) {
                    this.defTab = "员工设置";
                }
            }
        },
        methods: {
            getOrgRoleUser() {
                console.log("getOrgRoleUser .......");
                let url = "/zingbiz/auth/org/getOrgRoleUser";
                let params = {};
                params.type = "orgAndUser";
                /*if (this.companyId) {
                    params.companyId = this.companyId;
                }*/
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (!res.data.success) {
                            console.error("getOrgRoleUser error", res);
                            return;
                        }
                        console.log(res);
                        let retData = res.data.data;
                        let retData_copy = JSON.parse(JSON.stringify(retData));
                        this.sourceData = res.data.data;
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
                        // 角色用户
                        this.roleUserData = this.handleRoleData(retData.roleUserDatas, this);
                        this.sourceRoleUserData = this.roleUserData;
                        // 角色组织
                        this.roleOrgData = this.handleRoleOrg(retData_copy);
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
                    treeUserData.url = user["headImg"];
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
            handleRoleData(roleDatas, _this) {
                for (let i = 0; i < roleDatas.length; i++) {
                    let roleData = roleDatas[i];
                    roleData.id = roleData["roleInfoId"];
                    roleData.title = roleData["roleInfoName"];
                    roleData.type = "role";
                    roleData.auth = true;

                    let children = [];
                    roleData.children = children;
                    // 处理成员
                    let users = roleData["users"];

                    if (!users) users = [];
                    users.forEach( user => {
                        let treeUserData = {};
                        treeUserData.id = user["rowId"];
                        // 姓名取'userName'
                        treeUserData.title = user["userName"];
                        treeUserData.cardUrl = user["cardUrl"];
                        treeUserData.roleInfoId = user["roleInfoId"];
                        treeUserData.url = user["headImg"];
                        treeUserData.type = "user";
                        treeUserData.auth = user["file_status"] === "通过" ? true : false;

                        children.push(treeUserData);
                    });
                }
                return roleDatas;
            },
            handleRoleOrg(retData, _this) {
                let roleOrg = {};
                let orgDatas = retData.orgUserDatas;
                let roleDatas = retData.roleDatas;
                for (let i = 0; i < orgDatas.length; i++) {
                    let roleData = orgDatas[i];
                    let role = {};
                    role.key = roleData["id"];
                    role.value = roleData["text"];
                    orgDatas[i] = role;
                }
                roleOrg.org = orgDatas;

                for (let i = 0; i < roleDatas.length; i++) {
                    let roleData = roleDatas[i];
                    let role = {};
                    role.key = roleData["roleInfoId"];
                    role.value = roleData["roleInfoName"];
                    roleDatas[i] = role;
                }
                roleOrg.role = roleDatas;
                return roleOrg;
            },
            chengeTab(index) {
                if (index === 0) {
                    this.tabIndex = 0;
                    this.orgEditShow = true;
                    this.companyUserSettingShow = false;
                    this.quitEmployeeShow = false;
                    this.isShowJiaHao = true;
                    this.datas = [
                        { content: "新建部门" },
                        { content: "入职扫码绑定" },
                        { content: "绑定审核" },
                        { content: "同组商号" },
                    ]
                } else if (index === 1) {
                    this.tabIndex = 1;
                    this.orgEditShow = false;
                    this.companyUserSettingShow = true;
                    this.quitEmployeeShow = false;
                    this.isShowJiaHao = true;
                    this.datas = [
                        { content: "新建角色" },
                    ]
                } else if (index === 2) {
                    this.tabIndex = 2;
                    this.orgEditShow = false;
                    this.companyUserSettingShow = false;
                    this.quitEmployeeShow = true;
                    this.isShowJiaHao = false;
                }
            },
            handleMenu(data) {
                console.log(data);
                let self = this;
                if (data.content === "新建部门") {
                    this.$refs.orgEdit.addDepartment(this.companyId)
                } else if (data.content === "入职扫码绑定") {
                    /*this.$vux.alert.show({
                        content:"<img class=\'headImg\' src=\'../../../../static/images/userDef_.jpg\'>",
                        buttonText: '点我返回',
                        onShow () {
                            console.log('Plugin: I\'m showing')
                        },
                        onHide () {
                            console.log('Plugin: I\'m hiding')
                        }
                    })*/
                    //todo
                    self.$vux.toast.show({
                        text: "待服务号重写后对接",
                        type: 'text',
                        position: 'default',
                    })

                } else if (data.content === "绑定审核") {
                    self.$router.push({
                        path: "/backstageManage/noBindingList",
                        query: {
                            cardUrl:self.$route.query.cardUrl,
                            /*companyId:data.companyId,
                            attestation:this.$route.query.attestation */
                        }
                    });
                } else if (data.content === "同组商号") {
                    self.$vux.toast.show({
                        text: "暂缓",
                        type: 'text',
                        position: 'default',
                    })
                    /*self.$router.push({
                        path: "/backstageManage/noBindingList",
                        query: {
                            cardUrl:self.$route.query.cardUrl,
                            /!*companyId:data.companyId,
                            attestation:this.$route.query.attestation *!/
                        }
                    });*/
                } else if (data.content === "新建角色") {
                    this.$refs.companyUserSetting.addRole()
                }
            },
            showSearch() {
                this.isShowSearch = !this.isShowSearch;
                // this.$refs.search.setFocus();
            },
            onChange(val) {
                console.log(val);
                let _this = this;
                if (this.tabIndex === 0) {
                    let tmpTreeData = this.sourceData.orgUserDatas.map(orgData => {
                        let treeOrgData = {};
                        _this.handleOrgItem(treeOrgData, orgData, [], [], _this, "search", val);
                        return treeOrgData;
                    });
                    this.orgUserData = tmpTreeData
                } else if (this.tabIndex === 1) {
                    let searchArr = []
                    let searchData = []
                    searchData = this.roleUserData;
                    console.log(searchData);
                    searchData.forEach(item => {
                        let children = [];
                        let flag = 0;
                        item.children = children;
                        let users = item["users"];
                        if (!users) users = [];
                        users.forEach( user => {
                            let treeUserData = {};
                            treeUserData.id = user["rowId"];
                            // 姓名取'userName'
                            treeUserData.title = user["userName"];
                            treeUserData.cardUrl = user["cardUrl"];
                            treeUserData.roleInfoId = user["roleInfoId"];
                            treeUserData.url = user["headImg"];
                            treeUserData.type = "user";
                            treeUserData.auth = true;
                            console.error(val);
                            if (treeUserData.title.indexOf(val) >= 0) {
                                flag = 1;
                                children.push(treeUserData);
                            }
                        });
                        if ( flag === 1) {
                            searchArr.push(item)
                        }
                    })
                    this.roleUserData = searchArr
                } else if (this.tabIndex === 2) {
                    this.$refs.quitEmployee.searchQuitEmployee(val,"search");
                }
            },
            /*onSubmit(val) {
                console.log(val);
            },*/
            onCancel(val) {
                this.isShowSearch = false;
                if (this.tabIndex === 0) {
                    this.orgUserData = this.sourceOrgUserData;
                } else if (this.tabIndex === 1) {
                    this.roleUserData = this.sourceRoleUserData;
                } else if (this.tabIndex === 2) {
                    this.$refs.quitEmployee.searchQuitEmployee(val,"noSearch");
                }
            },
            removeItemRole(itemId) {
                console.log(this.roleUserData);
                this.roleUserData = this.roleUserData.filter(item => item.id !== itemId)
                this.getOrgRoleUser();
            },
            addItemRole(itemRole) {
                if ( itemRole ) {
                    let role = itemRole;
                    role.id = role["roleInfoId"];
                    role.title = role["roleInfoName"];
                    role.type = "role";
                    role.auth = true;
                    role.children = [];
                    this.roleUserData.push(role)
                }
                this.getOrgRoleUser();
                console.log(this.roleUserData);
            },
            upDateItemRole(oneRole) {
                if ( oneRole ) {
                    let role = oneRole;
                    this.roleUserData.forEach((item , index, arr ) => {
                        if ( item.roleInfoId === role.roleInfoId ) {
                            item.roleInfoName = role.roleInfoName;
                            item.title = role.roleInfoName;
                            item.roleInfoDesc = role.roleInfoDesc;
                            this.$set(arr, index, item)
                        }
                    })
                }
                this.getOrgRoleUser();
            },

            updateOneOrg(updateOneOrg) {
                /*if (updateOneOrg) {
                  let itemOrg =  updateOneOrg;
                    this.orgUserData.forEach(item => {
                        if (item.source.id === itemOrg.id ) {
                            item.title = itemOrg.text;
                            item.source.text = itemOrg.text;
                        }
                    })
                }*/
                this.getOrgRoleUser();
            },
            addDepartment() {
                this.getOrgRoleUser();
            },
            getQuitEmployeeData() {
                this.$refs.quitEmployee.getData();
            },
            deleteDepartment(id) {
                let flag;
                if (id) {
                    flag = this.orgUserData.some(item => item.source.id === id);
                }
                if (flag) {
                let itemId = id;
                this.orgUserData = this.orgUserData.filter(item => item.source.id !== itemId)
                   } else {
                this.getOrgRoleUser();
               }
            },
            updateCardUserById(val) {
                this.getOrgRoleUser();
            },
            reinstatement() {
                this.getOrgRoleUser();
            },
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" >
    .icon-gengduo{
        font-size: 25px!important;
        color: #000!important;
    }
    /*.zi-tree .span-wrapper-right {
        padding-right: 7px;
    }*/
</style>
<style lang="stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/unify.styl';

    .orgPower
        display flex
        flex-direction column
        width 100%
        height 100%

        .vue-tab
        .vue-head
            flex-shrink 0
        .tab-content
            flex-grow 1
            overflow-y hidden
            display flex
            flex-direction column
            .tabDiv
                height 100%
                overflow-y auto


    .headImgDiv {
        text-align:center;
    }
    .headImg {
        border: 1px solid #CCC;
        background-color: #FFF;
        padding: 4px;
        display: inline-block;
        width: 200px;
        height: 200px;
    }
</style>
