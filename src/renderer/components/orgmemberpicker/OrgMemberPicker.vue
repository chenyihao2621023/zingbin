<template>
    <div class="org-member-picker" v-transfer-dom>
        <popup v-model="showPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="org-member-picker-popup">
                <zing-head class="org-member-picker-head" :title="title" :isComeBack="false"
                           @doSome="backClick" :showClose="false"></zing-head>
                <div class="org-member-picker-detail-head">
                    <tag-group :items="tagData" @onChange="tagChanged"></tag-group>
                    <tab v-model="currentTabIndex">
                        <tab-item v-if="showTab.indexOf('org') != -1" @on-item-click="onTabClick('org')">组织</tab-item>
                        <tab-item v-if="showTab.indexOf('colleague') != -1" @on-item-click="onTabClick('colleague')">
                            同事
                        </tab-item>
                        <tab-item v-if="showTab.indexOf('role') != -1" @on-item-click="onTabClick('role')">角色</tab-item>
                        <tab-item v-if="showTab.indexOf('friends') != -1" @on-item-click="onTabClick('friends')">好友
                        </tab-item>
                        <tab-item v-if="showTab.indexOf('designatedPersonnel') != -1"
                                  @on-item-click="onTabClick('designatedPersonnel')">用户
                        </tab-item>
                    </tab>
                </div>
                <div class="org-member-picker-detail-body" ref="treeBox">
                    <zi-tree v-if="showTab.indexOf('org') != -1" ref="orgTree" v-show="currentTab === 'org'"
                             :data="orgData" :checkable="true" :radio="true" :multiple="multiple"
                             :defaultExpandAll="true" @check="onTreeChecked($event, 'orgTree')"
                             @select="onTreeSelected($event, 'orgTree')"
                    />
                    <div v-if="showTab.indexOf('colleague') != -1">
                        <zi-tree ref="colleagueTree" v-show="currentTab === 'colleague'" :data="orgUserData"
                                 :checkable="true" :radio="!multiple" :defaultExpandAll="true"
                                 @check="onTreeChecked($event, 'colleagueTree')"
                                 @select="onTreeSelected($event, 'colleagueTree')"/>
                    </div>
                    <zi-tree v-if="showTab.indexOf('role') != -1" ref="roleTree" v-show="currentTab === 'role'"
                             :pc="true" :data="roleData" :checkable="true" :radio="!multiple" :defaultExpandAll="true"
                             @check="onTreeChecked($event, 'roleTree')" @select="onTreeSelected($event, 'roleTree')"
                    />
                    <div v-if="showTab.indexOf('friends') != -1">
                        <zi-tree ref="friendsTree" v-show="currentTab === 'friends'" :data="friendsData"
                                 :checkable="true" :radio="!multiple" :defaultExpandAll="true"
                                 @check="onTreeChecked($event, 'friendsTree')"
                                 @select="onTreeSelected($event, 'friendsTree')"
                        />
                    </div>
                    <zi-tree v-if="showTab.indexOf('designatedPersonnel') != -1" ref="designatedPersonnelTree"
                             v-show="currentTab === 'designatedPersonnel'" :pc="true" :data="designatedPersonnelData"
                             :checkable="true" :radio="!multiple" :defaultExpandAll="true"
                             @check="onTreeChecked($event, 'designatedPersonnelTree')"
                             @select="onTreeSelected($event, 'designatedPersonnelTree')"/>
                </div>
                <x-button class="org-member-picker-button" type="primary" :disabled="currentSelected.length === 0"
                          @click.native="confirmSelected">选择
                </x-button>
            </div>
        </popup>
    </div>
</template>

<script>
    import {
        Popup,
        XButton,
        Tab,
        TabItem,
        TransferDomDirective as TransferDom
    } from "vux";
    import ZingHead from "../zingHead/ZingHead";
    import TagGroup from "../taggroup/TagGroup";
    import ZiTree from "../zitree/ZiTree";
    import { deepCopy, Z_DU, Z_IsEmpty20,getThumbUrl } from "../../utils/fn";
    import Qs from 'qs'
    import orgDataHandler from './orgDataHandler'
    // import { mapActions } from 'vuex'
    import store from '../../store'
    export default {
        name: "OrgMemberPicker",
        components: { Popup, XButton, ZingHead, TagGroup, ZiTree, Tab, TabItem },
        directives: {
            TransferDom
        },
        props: {
            //tab显示控制器,用于控制tab的显示,默认显示3个:["org","colleague",]
            //如果传此参数,则只显示传进来的
            showTab: {
                type: Array,
                default: function () {
                    return ["org", "colleague", "role"];
                }
            },
            designatedCardUrls: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            specifiedOrgIds: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            specifiedRoleIds: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            showPicker: {
                // 是否显示
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            initialSelected: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            initialSelectedType: {
                type: String,
                default: function () {
                    return "rowId";
                }
            },
            multiple: {
                // 是否多选
                type: Boolean,
                default: function () {
                    return true;
                }
            },
            companyId: {
                type: String,
                default: function () {
                    return null;
                }
            },
            title: {
                type: String,
                default: "选择成员"
            },
            // oneDepartmentId: {
            //     type: String,
            //     default: function() {
            //         return null
            //     }
            // }
        },
        data() {
            return {
                dataReady: false,
                orgData: [],
                orgUserData: [],
                roleData: [],
                friendsData: [],
                designatedPersonnelData: [],
                userDict: {},
                userCardDict: {},
                currentTabIndex: 0,
                saveFriend: [],
                currentTab: "org",
                currentSelected: []
            };
        },
        computed: {
            tagData() {
                return this.currentSelected.map(item => {
                    if (item.type === "user") {
                        return {
                            key: item.source.userName,
                            value: item.source.rowId || item.source['_id'],
                            level: this.getUserLevel()
                        };
                    } else if (item.type === "role") {
                        return {
                            key: item.roleInfoName,
                            value: item.roleInfoId,
                            level: this.getRoleLevel()
                        };
                    } else {
                        return {key: item.title, value: item.id, level: this.getOrgLevel()};
                    }
                });
            }
        },
        watch: {
            showPicker(val) {
              // 重新获取数据的情况
              if (!this.dataReady) {
                this.initOrgRoleUser();
              }
              // 每次显示重置
              this.resetView();
            },
            companyId: {
                handler() {
                    this.initOrgRoleUser();
                },
                immediate: true
            },
          $route(to, from) {
            store.dispatch('updateTokenSeed')
            // this.updateTokenSeed()
          }
        },
        // beforeMount() {
        //     this.initOrgRoleUser();
        //
        // },
        methods: {
           // ...mapActions(['updateTokenSeed']),
            resetView() {
              if (this.dataReady) {
                    // 指定用户
                    if (this.designatedCardUrls.length) {
                        this.designatedPersonnelData = handleDesignatedPersonnelData(
                            this.designatedCardUrls,
                            this.userCardDict
                        );
                    }
                    this.initialSelect();
                }
                this.initCurrentTab();
            },
            initCurrentTab() {
                this.currentTab = this.showTab[0];
            },
            /*初始化请求组织数据:含组织,角色,同事*/
            initOrgRoleUser() {
                //如果只用好友 companyId=>user
                if (this.companyId === "user") {
                    this.initFriends();
                    return;
                }
                orgDataHandler.getOrgRoleUser(this.companyId).then(retData => {
                    let snapOrgData = deepCopy(retData.orgUserDatas);
                    handleOrgData(snapOrgData, this);
                    // 仅组织
                    this.orgData = snapOrgData;
                    // 组织用户
                    this.orgUserData = handleOrgUserData(
                        retData.orgUserDatas,
                        this.userDict,
                        this.userCardDict,
                        this
                    );
                    // 仅角色
                    this.roleData = handleRoleData(retData.roleDatas, this);
                    this.initFriends();
                    this.dataReady = true;
                    this.initialSelect();
                    this.resetView();
                    // this.saveFriend.length && this.setFriend()
                }).catch(err => {
                    // 重复请求处理
                    if (err.name === 'RequestLockedError') {
                        // do nothing
                        return;
                    }

                    console.error("orgmemberpicker error", err);
                })
            },
            /*//请求好友数据
            initFriends() {
                let url = "/ZingMH/ZDesk/serviceFriend/getFriendNumListES.action";
                let params = {
                    companyId: false,
                    type: '',
                    tagName: '',
                    pageNumber: 1,
                    pageSize: 500
                };
                this.$http
                    .post(url, Qs.stringify(params))
                    .then(res => {
                        if (res.data.success) {
                            let friendsList = res.data.data.data || [];
                            this.saveFriend = friendsList;
                            this.setFriend()
                        } else {
                            console.error("load friends error", res);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },*/
            //请求好友数据
            initFriends() {
                orgDataHandler.getFriends().then(friendsList => {
                    this.saveFriend = friendsList;
                    this.setFriend()
                }).catch(err => {
                    // 重复请求处理
                    if (err.name === 'RequestLockedError') {
                        // do nothing
                        return;
                    }

                    console.error("orgmemberpicker error", err);
                })
            },
            setFriend () {
                let ary = [];
                Object.keys(this.userCardDict).forEach(cardUrl => {
                    this.saveFriend = this.saveFriend.filter(item => {
                        if (item.cardUrl === cardUrl) {
                            this.userCardDict[cardUrl].isAll = true;
                            ary.push(this.userCardDict[cardUrl])
                        }
                        return item.cardUrl !== cardUrl
                    })
                });

                let friendsList = [];
                let o;
                this.saveFriend.forEach(item => {
                    o = {};
                    o.title = item.RealName;
                    o.id = item.cardUrl;
                    o.type = "user";
                    o.auth = true;
                    o.isFriend = true;
                    if (item.headimgurl) {
                        o.src = Z_DU(item.headimgurl)
                    } else {
                        o.src = !Z_IsEmpty20(item.cardUrl) && item.cardUrl.length > 2 && '/checkJpg/' + item.cardUrl.substring(0, 2) + '/' + item.cardUrl + '.jpg'
                    }
                    o.src = getThumbUrl(o.src, 200, 200, "/ZingVue/static/images/userDef_.jpg", false);
                    o.source = {
                        cardUrl: item.cardUrl,
                        userName: item.RealName,
                        rowId: item.cardUrl
                    };
                    this.userCardDict[item.cardUrl] = o;
                    friendsList.push(o)
                });
                ary = [...friendsList, ...ary]
                let friendObj = [{
                    title: "好友",
                    type: "dept",
                    children: ary
                }];
                this.friendsData = friendObj;
                this.dataReady = true;
                this.initialSelect();
                this.resetView();
            },
            getRoleLevel() {
                return "success";
            },
            getOrgLevel() {
                return "info";
            },
            getUserLevel() {
                return "default";
            },
            getLevel(type) {
                let level = this.getUserLevel();
                switch (type) {
                    case "dept":
                        level = this.getOrgLevel();
                        break;
                    case "role":
                        level = this.getRoleLevel();
                        break;
                    default:
                        level = this.getUserLevel();
                }
                return level;
            },
            getType(level) {
                let type = "user";
                switch (level) {
                    case this.getOrgLevel():
                        type = "dept";
                        break;
                    case this.getRoleLevel():
                        type = "role";
                        break;
                    default:
                        type = "user";
                }
                return type;
            },
            getUserByCardUrl(cardUrl) {
                return this.userCardDict[cardUrl];
            },
            //返回按钮 监听 abort
            backClick() {
                this.$emit("abort");
            },
            //点击checkbox选择时
            onTreeChecked(e, flag) {
                console.log(e, flag);
                if (!this.multiple) return;
                let checked = e.currentNode.checked;
                let arr = [];
                let canPush;
                let delIndex;
//      let target;
                if (flag === "colleagueTree" || flag === "designatedPersonnelTree" || flag === 'friendsTree') {
                    if (flag === "colleagueTree") {
                        arr = this.$refs.colleagueTree.getNodes(
                            [e.currentNode],
                            checked
                                ? {checked: checked, isLeaf: true, childrenCheckedStatus: 2}
                                : {checked: checked, isLeaf: true}
                        );
                    }
                    if (flag === 'friendsTree') {
                        arr = this.$refs.friendsTree.getNodes(
                            [e.currentNode],
                            checked
                                ? {checked: checked, isLeaf: true, childrenCheckedStatus: 2}
                                : {checked: checked, isLeaf: true}
                        );
                    }
                    if (flag === 'designatedPersonnelTree') {
                        arr = this.$refs.designatedPersonnelTree.getNodes(
                            [e.currentNode],
                            checked
                                ? {checked: checked, isLeaf: true, childrenCheckedStatus: 2}
                                : {checked: checked, isLeaf: true}
                        );
                    }
                    arr.forEach(item => {
                        if (checked) {
                            canPush = !this.currentSelected.find(selItem => {
                                return selItem.id === item.id;
                            });
                            canPush && this.currentSelected.push(item);
                        } else {
                            delIndex = this.currentSelected.findIndex(selItem => {
                                return selItem.id === item.id;
                            });
                            this.currentSelected.splice(delIndex, 1);
                        }
                        let targets;
                        if (flag === "colleagueTree") {
                            let colleagueTree = this.$refs.colleagueTree;
                            if (targets) {
                                targets = targets.concat(colleagueTree.getNodeById("id", item.id));
                            } else {
                                targets = colleagueTree.getNodeById("id", item.id);
                            }
                        }
                        if (flag === 'friendsTree') {
                            let friends = this.$refs.friendsTree;
                            if (targets) {
                                targets = targets.concat(friends.getNodeById("id", item.id));
                            } else {
                                targets = friends.getNodeById("id", item.id);
                            }
                        }
                        if (targets) {
                            let dptree = this.$refs.designatedPersonnelTree;
                            if (dptree) {
                                targets = targets.concat(dptree.getNodeById("id", item.id));
                            }

                            targets.forEach(target => {
                                this.$set(target, "checked", checked);
                            });
                        }

                        // let targets = this.$refs.colleagueTree.getNodeById("id", item.id);
                        // console.log(targets);
                        // if (targets) {
                        //     let dptree = this.$refs.designatedPersonnelTree;
                        //     if (dptree) {
                        //         targets = targets.concat(dptree.getNodeById("id", item.id));
                        //     }
                        //
                        //     targets.forEach(target => {
                        //         this.$set(target, "checked", checked);
                        //     });
                        // }

                    });
                } else if (flag === "roleTree") {
                    arr = this.$refs.roleTree.getNodes(
                        [e.currentNode],
                        checked
                            ? {checked: checked, isLeaf: true, childrenCheckedStatus: 2}
                            : {checked: checked, isLeaf: true}
                    );

                    arr.forEach(item => {
                        if (checked) {
                            canPush = !this.currentSelected.find(selItem => {
                                return selItem.id === item.id;
                            });
                            canPush && this.currentSelected.push(item);
                        } else {
                            delIndex = this.currentSelected.findIndex(selItem => {
                                return selItem.id === item.id;
                            });
                            this.currentSelected.splice(delIndex, 1);
                        }
                        /* target = this.$refs.colleagueTree.getNodeById('roleInfoId', item.roleInfoId)[0]
                         this.$set(target, 'checked', checked) */
                    });
                }
            },
            //点击树选择时
            onTreeSelected (e, flag) {
                console.log(flag);
                let selected = e.node.selected;
                let arr;
                let targets;
                if (flag === "orgTree") {
                    let node = e.node;
                    if (selected) {
                        let canPush = !this.currentSelected.find(selItem => {
                            return selItem.id === node.id;
                        });
                        if (canPush) {
                            if (this.multiple) {
                                this.currentSelected.push(node);
                            } else {
                                this.currentSelected = [node];
                            }
                        }
                    } else {
                        let delIndex = this.currentSelected.findIndex(selItem => {
                            return selItem.id === node.id;
                        });
                        this.currentSelected.splice(delIndex, 1);
                    }
                }

                if (this.multiple) return;

                if (flag === "colleagueTree") {
                    arr = this.$refs.colleagueTree.getNodes(
                        [e.node],
                        selected
                            ? {selected: selected, isLeaf: true, childrenCheckedStatus: 2}
                            : {selected: selected, isLeaf: true}
                    );
                    if (arr && arr.length > 0) {
                        if (selected) {
                            this.currentSelected = [arr[0]];
                        } else {
                            this.currentSelected = [];
                        }
                    }
                    arr.forEach(item => {
                        targets = this.$refs.colleagueTree.getNodeById("id", item.id);
                        if (targets) {
                            let dptree = this.$refs.designatedPersonnelTree;
                            if (dptree) {
                                targets = targets.concat(dptree.getNodeById("id", item.id));
                            }
                            targets.forEach(target => {
                                this.$set(target, "selected", selected);
                            });
                        }
                    });
                } else if (flag === "friendsTree") {
                    arr = this.$refs.friendsTree.getNodes(
                        [e.node],
                        selected
                            ? {selected: selected, isLeaf: true, childrenCheckedStatus: 2}
                            : {selected: selected, isLeaf: true}
                    );
                    if (arr && arr.length > 0) {
                        if (selected) {
                            this.currentSelected = [arr[0]];
                        } else {
                            this.currentSelected = [];
                        }
                    }
                    arr.forEach(item => {
                        targets = this.$refs.friendsTree.getNodeById("id", item.id);
                        if (targets) {
                            let dptree = this.$refs.designatedPersonnelTree;
                            if (dptree) {
                                targets = targets.concat(dptree.getNodeById("id", item.id));
                            }
                            targets.forEach(target => {
                                this.$set(target, "selected", selected);
                            });
                        }
                    });
                } else if (flag === "roleTree") {
                    arr = this.$refs.roleTree.getNodes(
                        [e.node],
                        selected
                            ? {selected: selected, isLeaf: true, childrenCheckedStatus: 2}
                            : {selected: selected, isLeaf: true}
                    );
                    if (arr && arr.length > 0) {
                        if (selected) {
                            this.currentSelected = [arr[0]];
                        } else {
                            this.currentSelected = [];
                        }
                    }
                    arr.forEach(item => {
                        targets = this.$refs.roleTree.getNodeById("id", item.id);
                        targets.forEach(target => {
                            this.$set(target, "selected", selected);
                        });
                    });
                }

                if (flag === "designatedPersonnelTree") {
                    arr = this.$refs.designatedPersonnelTree.getNodes(
                        [e.node],
                        selected
                            ? {selected: selected, isLeaf: true, childrenCheckedStatus: 2}
                            : {selected: selected, isLeaf: true}
                    );

                    if (arr && arr.length > 0) {
                        if (selected) {
                            this.currentSelected = [arr[0]];
                        } else {
                            this.currentSelected = [];
                        }
                    }
                    arr.forEach(item => {
                        targets = this.$refs.designatedPersonnelTree.getNodeById(
                            "id",
                            item.id
                        );
                        targets.forEach(target => {
                            this.$set(target, "selected", selected);
                        });
                    });
                }
            },
            //确定选择
            confirmSelected() {
                if (this.currentSelected.length === 0) return;
                let retArr = this.currentSelected.map(item => {
                    if (item.type === "user") {
                        item.source.type = "user";
                        item.source.id = item.source.cardUrl;
                        item.source.title = item.source.userName;
                        return item.source;
                    } else {
                        return item;
                    }
                });

                this.$emit("picked", JSON.parse(JSON.stringify(retArr)));
            },
            initialSelect() {
                // 取消树节点勾选
                this.currentSelected.forEach(item => {
                    let delId = item.id;
                    let targets = null;
                    switch (item.type) {
                        case "user":
                            if (this.$refs.colleagueTree) {
                                targets = this.$refs.colleagueTree.getNodeById("id", delId);
                            }
                            if (this.$refs.friendsTree) {
                                targets = this.$refs.friendsTree.getNodeById("id", delId);
                            }
                            if (this.$refs.designatedPersonnelTree) {
                                targets = this.$refs.designatedPersonnelTree.getNodeById(
                                    "id",
                                    delId
                                );
                            }
                            break;
                        case "role":
                            targets = this.$refs.roleTree.getNodeById("id", delId);
                            break;
                        default:
                            targets = this.$refs.orgTree.getNodeById("id", delId);
                            break;
                    }
                    targets.forEach(target => {
                        this.$set(target, "selected", false);
                        this.$set(target, "checked", false);
                    });
                });
                this.currentSelected = [];
                this.currentTabIndex = 0;
                this.currentTab = "org";
                let initialSelected = this.initialSelected;
                var self = this;
                initialSelected.forEach(item => {
                    let itemId = item.value;
                    if (typeof itemId === "string" && itemId.trim() !== "") {
                        let targets = null;
                        let itemSelected = {};
                        if (typeof item.type !== "undefined") {
                            item.level = this.getLevel(item.type);
                        }
                        switch (item.level) {
                            case this.getUserLevel():
                                itemSelected = this.userCardDict[item.value];
                                if (!itemSelected) return;
                                itemId = itemSelected["id"] || item.value;
                                if (this.$refs.colleagueTree && !itemSelected.isFriend) {
                                    targets = this.$refs.colleagueTree.getNodeById("id", itemId);
                                }
                                if (this.$refs.friendsTree && (itemSelected.isFriend || itemSelected.isAll)) {
                                    targets = this.$refs.friendsTree.getNodeById("id", itemId);
                                }
                                if (this.$refs.designatedPersonnelTree) {
                                    targets = this.$refs.designatedPersonnelTree.getNodeById("id", itemId);
                                }
                                break;
                            case this.getRoleLevel():
                                targets = this.$refs.roleTree.getNodeById("id", itemId);
                                itemSelected = targets[0];
                                break;
                            default:
                                targets = this.$refs.orgTree.getNodeById("id", itemId);
                                itemSelected = targets[0];
                                break;
                        }
                        if (targets) {
                            targets.forEach(target => {
                                this.$set(
                                    target,
                                    item.level === self.getOrgLevel() ? "selected" : "checked",
                                    true
                                );
                            });
                            if (this.designatedCardUrls.length) {
                                this.designatedPersonnelData = this.designatedPersonnelData.map(designatedPersonnelItem => {
                                    if (designatedPersonnelItem.source.cardUrl === item.value ) {
                                        designatedPersonnelItem.checked = true;
                                        designatedPersonnelItem.auth = true;
                                    }
                                    return designatedPersonnelItem
                                })
                            }
                        }
                        /**
                         * itemSelected为undefined时，后面逻辑会抛异常，添加不为undefined判断
                         * edit by chunyu.zhao 2018-07-26
                         */
                        if(itemSelected!=undefined){
                            this.currentSelected.push(itemSelected);
                        }
                    }
                });
                this.$refs.treeBox.scrollTop = 0;
            },
            //tab切换
            onTabClick(type) {
                this.currentTab = type;
                this.$refs.treeBox.scrollTop = 0;

                // if (index === 0) {
                //     this.currentTab = "org";
                // } else if (index === 1) {
                //     this.currentTab = "colleague";
                // } else if (index === 2) {
                //     this.currentTab = "role";
                // } else if (index === 3) {
                //     this.currentTab = "friends";
                // }
            },
            //点击标签
            tagChanged(arr, delId) {
                if (!delId) return;
                let delIndex = this.currentSelected.findIndex(selItem => {
                    return selItem.id === delId;
                });
                var dataType = this.currentSelected[delIndex].type;
                var isFriend = this.currentSelected[delIndex].isFriend;
                var isAll = this.currentSelected[delIndex].isAll;
                let targets = [];
                if (dataType === "user") {
                    if (this.$refs.colleagueTree && !isFriend) {
                        targets = this.$refs.colleagueTree.getNodeById("id", delId);
                    }
                    if (this.$refs.friendsTree && (isAll || isFriend)) {
                        targets = this.$refs.friendsTree.getNodeById("id", delId);
                    }
                    let dptree = this.$refs.designatedPersonnelTree;
                    if (dptree) {
                        targets = targets.concat(dptree.getNodeById("id", delId));
                    }
                } else if (dataType === "role") {
                    targets = this.$refs.roleTree.getNodeById("id", delId);
                } else {
                    targets = this.$refs.orgTree.getNodeById("id", delId);
                }
                targets.forEach(target => {
                    this.$set(target, "checked", false);
                    this.$set(target, "selected", false);
                });
                this.currentSelected.splice(delIndex, 1);
            }
        }
    };

    function handleOrgItem (treeOrgData, orgData, userDict, userCardDict, _this) {
        if (
            _this.specifiedOrgIds.length > 0 &&
            _this.specifiedOrgIds.indexOf(orgData.id) < 0
        ) {
            return;
        }
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
            treeUserData.id = user["rowId"] || user['_id'];
            // 姓名取'userName'
            treeUserData.title = user["userName"];
            treeUserData.src = getThumbUrl(user["headImg"], 200, 200, "/ZingVue/static/images/userDef_.jpg", false);
            treeUserData.type = "user";
            treeUserData.auth = true;
            treeUserData.source = user;

            children.push(treeUserData);
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
                handleOrgItem(
                    treeChildOrgData,
                    childOrgData,
                    userDict,
                    userCardDict,
                    _this
                );
            });
        }
    }

    function handleOrgUserData (orgUserDatas, userDict, userCardDict, _this) {
        let tmpTreeData = orgUserDatas.map(orgData => {
            let treeOrgData = {};
            handleOrgItem(treeOrgData, orgData, userDict, userCardDict, _this);
            return treeOrgData;
        });
        return tmpTreeData;
    }

    function handleOrgData (orgUserDatas, _this) {
        if (
            orgUserDatas &&
            typeof orgUserDatas !== "undefined" &&
            orgUserDatas.constructor === Array
        ) {
            for (let i = 0; i < orgUserDatas.length; i++) {
                let orgUserData = orgUserDatas[i];

                if (
                    _this.specifiedOrgIds.length > 0 &&
                    _this.specifiedOrgIds.indexOf(orgUserData.id) < 0
                ) {
                    orgUserDatas.splice(i, 1);
                    --i;
                    continue;
                }

                delete orgUserData.users;
                orgUserData.title = orgUserData["text"];
                orgUserData.type = "dept";
                orgUserData.auth = true;
                // 尾递归处理数据
                handleOrgData(orgUserData["children"], _this);
            }
        }
    }

    function handleRoleData (roleDatas, _this) {
        for (let i = 0; i < roleDatas.length; i++) {
            let roleData = roleDatas[i];

            if (
                _this.specifiedRoleIds.length > 0 &&
                _this.specifiedRoleIds.indexOf(roleData.roleInfoId) < 0
            ) {
                //delete roleData;
                roleDatas.splice(i, 1);
                --i;
                continue;
            }
            roleData.id = roleData["roleInfoId"];
            roleData.title = roleData["roleInfoName"];
            roleData.type = "role";
            roleData.auth = true;
        }
        return roleDatas;
    }

    function handleDesignatedPersonnelData (designatedCardUrls, userCardDict) {
        console.log(designatedCardUrls, userCardDict);
        let arr = [];
        designatedCardUrls.forEach(cardUrl => {
            if (userCardDict[cardUrl]) {
                let userData = JSON.parse(JSON.stringify(userCardDict[cardUrl]));
                arr.push(userData);
            }
        });
        return arr;
    }
</script>

<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .org-member-picker {
        .vux-popup-dialog {
            z-index: 10000;
        }

        .org-member-picker-popup {
            display: flex;
            flex-direction: column;
            background-color: $component-background;
            width: 100%;
            height: 100%;

            .org-member-picker-head {
                flex-shrink: 0;
                margin-bottom: $line-height-computed * 0.5;
            }

            .org-member-picker-head-left {
                flex-center(row, space-between, left);

                .org-member-picker-back {
                    font-size: 25px !important;
                    color: #000000 !important;
                    padding-right: 3px;
                }
            }

            .org-member-picker-title {
                font-weight: 400;
                font-size: 18px;
            }

            .org-member-picker-detail-head {
                flex-shrink: 0;
            }

            .org-member-picker-detail-body {
                flex-grow: 1;
                overflow-y: auto;
            }

            .org-member-picker-button {
                flex-shrink: 0;
                width: calc(100% - 6px);
                margin-top: 3px;
                margin-bottom: 3px;
            }
        }
    }
</style>
