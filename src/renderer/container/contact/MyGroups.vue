<template>
    <div class="my-friend">
        <contact-head
            :menuData="menuData"
            :allSortList="allSortList"
            @onHandleMenu="handleMenu"
            @onHandleSort="handleSort"
            @onSearch="onSearch"
            :showSearchIcon="true"
            :showDropDown="true"
            title="我的群组"
            :isComeBack="false"
        ></contact-head>
        <div class="content-scroll">
            <div class="intermediate-content">
                <contact-list
                    @clickItem="onGroupItem"
                    :showRightIcon="false"
                    :list="myGroupList"
                    :conTactType="conTactType"
                    :usedList="usedList"
                    :showRight="true"
                    :unUsedList="unUsedList"
                    @getTags="onGetTags"
                    promptTitle="暂无群组"
                >
                </contact-list>
            </div>
        </div>
        <classify-dialog
        :showDialog="showDialog"
        :menusList="allSortData"
        @settingType="onSettingType"
        @closeClassifyDig="onCloseClassifyDig"
        >
        </classify-dialog>
    </div>
</template>
<script>
    import { goChat,createChat,MH_changeUserCompany } from "../../utils/fn"
    import { Popup,Actionsheet } from "vux"
    import ContactHead from './ContactHead.vue'
    import ContactList from "./ContactList.vue"
    import ClassifyDialog from "./ClassifyDialog.vue"
    export default {
        name: 'BritishFriends',
        components: {
            ContactHead,ContactList,Popup,ClassifyDialog,Actionsheet
        },
        data() {
            return {
                menuData:[
                    {
                        content: "发起聊天",
                        value: 'initiateChat'
                    },
                    {
                        content: "我创建的",
                        value: 'myCreate'
                    },
                    {
                        content: "我加入的",
                        value: 'myJoin'
                    },
                    {
                        content: "自定义分类",
                        value: 'customType'
                    }
                ],
                usedList:[],
                unUsedList:[],
                conTactType:1,
                myGroupList:[],
                allSortData:[],
                saveData:[],
                myOwnUsualGroupChat:[],//我创建的常用
                myOwnUnusualGroupChat:[],//不常用
                myUsualGroupChat:[], //加入的常用
                myUnusualGroupChat:[], //加入的不常用
                saveMyUsual:[],
                saveMyUnusual:[],
                saveMyOwnUsual:[],
                saveMyOwnUnusual:[],
                showDialog:false,
                myGroupId:''
            }
        },
        computed: {
            allSortList() {
                let o = this.allSortData.map(item => item.tags);
                o.unshift('全部');
                return [o]
            }
        },
        created() {
            this.init()
        },
        methods: {
            onCloseClassifyDig() {
                this.showDialog = false
            },
            handleMenu(data) {
                switch (data.value) {
                    case 'initiateChat':
                        this.onInitiateChat();
                        break;
                    case 'myCreate':
                        this.getmyCreate();
                        break;
                    case 'myJoin':
                        this.getMyJoin()
                        break;
                    case 'customType':
                        this.onCustomType();
                        break
                }
            },
            handleSort(data) {
                this.showDialog = false;
                this.conTactType = 1;
               if (data[0] === '全部') {
//                   this.conTactType = 1;
                   this.myGroupList = this.saveData;
                   this.leftTitle = data[0];
                   return;
               }
                let url = '/zingbiz/auth/user/custom/getMyGroupCustomList';
                let params = {
                    myCustomType:data[0]
                };
                this.$http.post(url,params).then(res => {
                    if (res.data.success) {
                        this.leftTitle = data[0];
                       this.dataProcess(res.data.data.data);
                    }
                })
            },
            dataProcess(data) {
                if (data.length) {
                    let o = [];
                    data.forEach(item => {
                        this.saveData.forEach(items => {
                            if (items.myGroupId === item.myGroupId) {
                                o.push(items)
                            }
                        })
                    });
                   this.myGroupList = o;
                } else {
                    this.myGroupList = []
                }
            },
            onInitiateChat() {
                this.$zingp.createChat.show()
                createChat(this);
            },
            getmyCreate() {
               this.conTactType = 2;
                this.showDialog = false;
               this.type = 'getmyCreate'
               this.usedList = this.myOwnUsualGroupChat;
               this.unUsedList = this.myOwnUnusualGroupChat;
            },
            getMyJoin() {
                this.showDialog = false;
                this.conTactType = 2;
                this.type = 'getMyJoin'
                this.usedList = this.myUsualGroupChat;
                this.unUsedList = this.myUnusualGroupChat;
            },
            onCustomType() {
                this.$router.push({
                    path: "/classmain",
                    query: {
                        classType: 'myGroup'
                    }
                });
            },
            onGroupItem(item) {
                if (!item) return;
                let { chatId,Alias3,chatType,id,groupType } = item.source
                Alias3 = Alias3 || null;
                chatId = chatId || id;
                let companyId = Alias3 || chatId;
                chatType = chatType || groupType;
                if (chatType.toUpperCase() === 'ORG') {
                    MH_changeUserCompany(companyId).then(() => {
                        goChat(chatId,Alias3,chatType,this.$router);
                    })
                } else {
                    goChat(chatId,chatId,chatType.toUpperCase(),this.$router);
                }
            },
            onSearch(val) {
                if (this.conTactType === 1) {
                    this.myGroupList = this.saveData.filter(item => item.title.includes(val));
                } else if ( this.conTactType === 2 ) {
                    this.searchProcessing(val);
                }
            },
            searchProcessing(val) {
               switch (this.type) {
                   case 'getMyJoin':
                       this.usedList = this.saveMyUsual.filter(item => item.title.includes(val));
                       this.unUsedList = this.saveMyUnusual.filter(item => item.title.includes(val));
                       break;
                   case 'getmyCreate':
                       this.usedList = this.saveMyOwnUsual.filter(item => item.title.includes(val));
                       this.unUsedList = this.saveMyOwnUnusual.filter(item => item.title.includes(val));
                       break;
               }
            },
            dataProcessing(data) {
                if (!data) return [];
                let messageObj = {};
                let endData = data.map(item => {
                    if (item.groupType === "org") {
                        messageObj = {
                            title: item.Alias1,
                            source: item,
                            desc:`${item.userCount}人`,
                            text:'内部',
                            c: '#4da9eb',
                            bc:'#e4f2fc',
                            companyId:item.Alias3,
                            myGroupId: item.chatId
                        }
                        if (item.chatId.includes('zspallusers')) {
                            messageObj.text = '全体群'
                            messageObj.c = '#f7b55e'
                            messageObj.bc = '#fef4e7'
                            messageObj.title = item.companyName
                        }
                    } else {
                        messageObj = {
                            title: item.groupTitle,
                            source: item,
                            desc:`${item.memberCount}人`,
                            myGroupId: item.id,
                            companyId:item.companyId
                        }
                    }
                  messageObj.src = require("../../../../static/images/qunliao.png");
                  return messageObj
                });
                return endData
            },
            sortProcessing(data) {
                this.allSortData = data;
                this.saveAllSortData = JSON.parse(JSON.stringify(this.allSortData));
            },
            onGetTags(item) {
                const _this = this;
                this.$vux.actionsheet.show({
                    menus: ["设置分类"],
                    onMenuClick(text, key) {

                        switch (key) {
                            case 0:
                                _this.settingClassify(item);
                                break;
                        }
                        this.show = false;
                    }
                });
            },
            settingClassify(item) {
                this.showDialog = false;
                this.myGroupId = item.myGroupId;
                let url = '/zingbiz/auth/user/custom/getMyGroupCustom';
                let params = {
                    myGroupId: this.myGroupId
                };
                this.$http.post(url,params).then(res => {
                    let { data,success } = res.data;
                    if (success) {
                        if ( parseFloat(data.total) > 0) {
                            let { tagName } = data.data[0];
                            this.allSortData = this.allSortData.map(item => {
                                item.isCancel = item.tags === tagName;
                                return item
                            });
                        } else {
                            this.allSortData = this.saveAllSortData;
                        }
                        this.showDialog = true;
                    }
                });
            },
            onSettingType(item) {
                let { tags,isCancel } = item;
                let url = '/zingbiz/auth/user/custom/addMyGroupCustom';
                let params = {
                    myCustomType: tags,
                    myGroupId: this.myGroupId,
                    isCancel: isCancel
                };
                this.$http.post(url,params).then(res => {
                    this.showDialog = false;
                    if (res.data.success) {
                        if (this.leftTitle !== '全部') {
                            this.myGroupList = this.myGroupList.filter(item => item.myGroupId !== this.myGroupId);
                        }
                        this.showDialog = false;
                        let msg = '设置分类成功';
                        if (isCancel) {
                            msg = '移除分类成功'
                        }
                        this.bottomToast(msg,'success');
                    } else {
                        this.bottomToast('设置分类失败','warn');
                    }
                },err => {
                    this.bottomToast('设置分类失败',"warn");
                })
            },
            getGroupList() {
                // let url = '/ZingMH/ZDesk/myGroup/loadMyAllGroupChat.action';
                let url = '/zingbiz/mhChat/MyGroupRest/loadMyAllGroupChat';
                return this.$http.post(url,{});
            },
            getSortList() {
                let urlType = '/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl';
                let paramsType = {
                    tagType: 'myGroup',
                    companyId:'',
                    isCompanyId:'',
                    pageNumber: 1,
                    pageSize: 20
                };
                return this.$http.post(urlType,paramsType)
            },
            //我创建的常用群聊
            getMyOwnUsualGroupChat() {
                // let url = '/ZingMH/ZDesk/myGroup/loadMyOwnUsualGroupChat.action';
                let url = '/zingbiz/mhChat/MyGroupRest/loadMyOwnUsualGroupChat';
                return this.$http.post(url,{});
            },
            //我创建的不常用群聊
            getMyOwnUnusualGroupChat() {
                // let url = '/ZingMH/ZDesk/myGroup/loadMyOwnUnusualGroupChat.action';
                let url = '/zingbiz/mhChat/MyGroupRest/loadMyOwnUnusualGroupChat';
                return this.$http.post(url,{});
            },
            //我加入的常用群聊
            getMyUsualGroupChat() {
                // let url = '/ZingMH/ZDesk/myGroup/loadMyUsualGroupChat.action';
                let url = '/zingbiz/mhChat/MyGroupRest/loadMyUsualGroupChat';
                return this.$http.post(url,{});
            },
            //我加入的不常用群聊
            getMyUnusualGroupChat() {
                // let url = '/ZingMH/ZDesk/myGroup/loadMyUnusualGroupChat.action';
                let url = '/zingbiz/mhChat/MyGroupRest/loadMyUnusualGroupChat';
                return this.$http.post(url,{});
            },
            bottomToast (msg,type) {
                let _this = this
                if (!msg) return
                this.$vux.toast.show({
                    text: msg,
                    type,
                    position: 'middle',
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            //获取数据
            init() {
                this.$http.all([this.getGroupList(), this.getSortList(),this.getMyOwnUsualGroupChat(),this.getMyOwnUnusualGroupChat(),this.getMyUsualGroupChat(),this.getMyUnusualGroupChat()]).then(this.$http.spread((groupList,sortList,myOwnUsualGroupChat,myOwnUnusualGroupChat,myUsualGroupChat,myUnusualGroupChat) => {
                    if (groupList.data.success) {
                        this.myGroupList = this.dataProcessing(groupList.data.data);
                       this.saveData = JSON.parse(JSON.stringify(this.myGroupList));
                    }
                    if (myOwnUsualGroupChat.data.success) {
                        this.myOwnUsualGroupChat = this.dataProcessing(myOwnUsualGroupChat.data.data);
                        this.saveMyOwnUsual = JSON.parse(JSON.stringify(this.myOwnUsualGroupChat));
                    }
                    if (myOwnUnusualGroupChat.data.success) {
                        this.myOwnUnusualGroupChat = this.dataProcessing(myOwnUnusualGroupChat.data.data);
                        this.saveMyOwnUnusual = JSON.parse(JSON.stringify(this.myOwnUnusualGroupChat));
                    }
                    if (myUsualGroupChat.data.success) {
                        this.myUsualGroupChat = this.dataProcessing(myUsualGroupChat.data.data);
                        this.saveMyUsual = JSON.parse(JSON.stringify(this.myUsualGroupChat));
                    }
                    if (myUnusualGroupChat.data.success) {
                        this.myUnusualGroupChat = this.dataProcessing(myUnusualGroupChat.data.data);
                        this.saveMyUnusual = JSON.parse(JSON.stringify(this.myUnusualGroupChat));
                    }
                    if (sortList.data.success) {
                        this.sortProcessing(sortList.data.data.data);
                    }
                }))
            }
        }
    }
</script>
<style>
    .weui-toast.weui-toast_forbidden {
        color: #e5e5e5
    }
    .weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before{
        color: #e5e5e5
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .my-friend
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%
        .content-scroll
            flex-grow 2
            overflow auto
            .intermediate-content
              min-width: 100%
              height: 100%
</style>
