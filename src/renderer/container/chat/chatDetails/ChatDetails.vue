<template>
    <div class="chat-details-html">
        <chat-head class="chat-details-header" @goBack="goBack" :hasDetail="false" :title="title" :titleExt="titleExt"
                   :titleExtIco="titleExtIco" :chatType="urlParams.chatType"></chat-head>
        <div class="chat-details-content-wrapper">
            <div class="chat-details-content-scroll">
                <div class="chat-details-content">
                    <ul class="chat-dialogue-entry-collect">
                        <li
                            v-for="(item,index) in allUserData"
                            :key="index"
                            @click="changeUserDetails($event, item.cardUrl)"
                        >
                            <div>
                                <img
                                    :src="'./static/images/userDef_.jpg'"
                                    :data-src="getImageUrl(item.avatar,'./static/images/userDef_.jpg')"
                                    data-error="./static/images/userDef_.jpg"
                                    v-lazy-image
                                />
                            </div>
                            <p v-if="cardUrl===item.cardUrl&&isNickName">{{nickName || item.RealName}}</p>
                            <p v-else>
                                {{item.nickName || item.RealName}}
                            </p>
                        </li>
                        <li v-if="!isAllGroup" @click="increasePersonnel">
                            <div>
                                <i class="my-icon iconfont icon-jiahao1"></i>
                            </div>
                        </li>
                        <!--<li v-if="chatType!='CHAT'&&isGroupLord " @click="changeOwner(2,$event)">-->
                        <li v-if="chatType.toUpperCase()!=='CHAT'&&isGroupLord " @click="removeCrewMember">
                            <div>
                                <i class="my-icon iconfont icon-jianhao1"></i>
                            </div>
                        </li>
                        <li v-show="showMoreUser" class="last-li" @click="moreUser">查看全部群成员</li>
                    </ul>
                </div>
                <br/>
                <template v-if="chatType!='CHAT'">
                    <div>
                        <group>
                            <cell class="group-content-settings"
                                  @click.native="!isAllGroup?setGroupChat(1,$event):showPlugin('全体群不能修改群名',true)">
                                <h4 slot="title">群聊名称</h4>
                                <div class="chat-dialogue-group-announcement">
                                    <span>{{groupName}}</span>
                                </div>
                            </cell>
                            <cell class="group-content-settings" @click.native="setGroupChat(2,$event)">
                                <h4 slot="title">我在本群的昵称</h4>
                                <div class="chat-dialogue-group-announcement">
                                    <span>{{nickName}}</span>
                                </div>
                            </cell>
                            <cell class="group-content-settings"
                                  @click.native="isGroupLord?setGroupChat(3,$event):showPlugin('只有群主才有权限',true)">
                                <h4 slot="title">群公告</h4>
                                <div class="chat-dialogue-group-announcement" v-if="!groupAnnouncement">
                                    <span>未设置</span>
                                </div>
                            </cell>
                            <p class="chat-dialogue-group-announcement"
                               @click="isGroupLord?setGroupChat(3,$event):showPlugin('只有群主才有权限',true)"
                               v-if="groupAnnouncement">
                                {{groupAnnouncement}}</p>
                        </group>
                        <br/>
                        <group>
                            <x-switch :disabled="flagNickName" @on-click="updaChatNickName"
                                      class="group-content-settings"
                                      title="显示群成员昵称" v-model="isNickName" prevent-default></x-switch>
                            <x-switch :disabled="flagMessageFree" @on-click="updaMessageFree"
                                      class="group-content-settings"
                                      title="消息免打扰" v-model="isNotification" prevent-default></x-switch>
                            <p class="chat-dialogue-group-announcement" v-if="isNotification">你不会收到本群的消息提醒</p>
                        </group>
                        <br/>
                        <template v-if="isGroupLord && !isAllGroup">
                            <group>
                                <cell class="group-content-settings" @click.native="transferLoad">
                                    <h4 slot="title">转让群主</h4>
                                </cell>
                                <cell class="group-content-settings" @click.native="showPlugin('确定解散该群?')">
                                    <h4 slot="title">解散群组</h4>
                                </cell>
                            </group>
                        </template>
                        <div v-if="!isAllGroup" class="quit-button">
                            <x-button :plain="isF" class="chat-dialogue-leave-group-chat"
                                      @click.native="showPlugin('确定退出该群?')">
                                删除并退出
                            </x-button>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <group>
                        <x-switch class="group-content-settings" @on-click="updaMessageFree" title="消息免打扰"
                                  v-model="isNotification" prevent-default></x-switch>
                    </group>
                </template>
            </div>
        </div>
        <chat-settings
            :revisePlaceholder="revisePlaceholder"
            :companyId="companyId"
            :mySelfName="mySelfName"
            :groupAnnouncement="groupAnnouncement"
            :did="did"
            :chatType="chatType"
            :reviseFlag="reviseFlag"
            :reviseTitle="reviseTitle"
            :reviseText="reviseText"
            :reviseLimit="reviseLimit"
            :reviseNumber="reviseNumber"
            @reviseClick="reviseClick"
        ></chat-settings>
        <transfer-load
            :did="did"
            :chatType="chatType"
            :cardUrl="cardUrl"
            :companyId="companyId"
            :showTransferLoad="showTransferLoad"
            :transferCrewList="chatDet"
            @transferSuccess="transferSuccess"
            @onHideTransferLoad="hideTransferLoad"
        ></transfer-load>
        <remove-member
            :did="did"
            :chatType="chatType"
            :companyId="companyId"
            :cardUrl="cardUrl"
            :removeCrewList="chatDet"
            @onHideRemoveMember="hideRemoveMember"
            :showRemoveMember="showRemoveMember"
            @removeSuccess="removeSuccess"
        >
        </remove-member>
        <popup v-model="showCreateChat" height="100%" width="100%" position="right"
               :popup-style="{'overflow-y': 'auto'}">
            <create-chat
                :mySelfName="mySelfName"
                :initialCardUrl="initialCardUrl"
                :initialName="initialName"
                :forwardChat="true"
                @canceled="hideCanceled"
                :chatType="chatType">
            </create-chat>
        </popup>
        <add-group-user
            :mySelfName="mySelfName"
            @successAddUsers="successAddUsers"
            @hideAddUsers="hideAddUsers"
            :did="did"
            :companyId="companyId"
            :chatType="chatType"
            :companyData="companyData"
            :showIncreasePersonnel="showIncreasePersonnel"
            :initialSelected="initialSelected"
        ></add-group-user>
        <toast width="120px" :type="promptType" :is-show-mask="promptMask" v-model="promptFlag"
               :text="promptText"></toast>
    </div>
</template>
<script>
    import ChatHead from '../ChatHead'
    import ChatSettings from "./ChatSettings.vue"  //设置群信息
    import TransferLoad from "./TransferLoad.vue" //转让群主
    import RemoveMember from "./RemoveMember.vue" //移除成员
    import AddGroupUser from "./AddGroupUser.vue"  //添加成员
    import CreateChat from "../CreateChat.vue"  //创建群聊
    import { Z_IsEmpty20, getImageUrl, addTypeCache } from "../../../utils/fn"
//    import { mapMutations } from 'vuex';
    import LazyImage from '../../../directives/lazyimage/lazy-image'
    import Qs from "qs"
    import {
        Toast,
        XSwitch,
        Group,
        Cell,
        InlineLoading,
        XButton,
        Flexbox,
        FlexboxItem,
        TransferDomDirective as TransferDom,
        XDialog,
        Popup
    } from 'vux'
    import dataHandler from '../data-handler'

    export default {
        name: 'ChatDetail',
        directives: {
            TransferDom,
            LazyImage
        },
        components: {
            Popup,
            ChatHead,
            InlineLoading,
            CreateChat,//创建群聊
            AddGroupUser,//添加成员
            ChatSettings, //设置群信息
            TransferLoad, //转让群主
            RemoveMember, //移除成员
            XDialog,//弹框
            XSwitch,//左右切换
            Group,//组
            Cell,//item
            XButton,//按钮
            Flexbox,//组
            FlexboxItem,//item
            Toast
        },
        props: {
            orgUserData: {
                type: Object,
                default() {
                    return {}
                }
            },
            title: {
                type: String
            },
            titleExt: {
                type: String,
                default: ''
            },
            titleExtIco: {
                type: String,
                default: ''
            },
            urlParams: {
                type: Object
            },
            dataReady: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isReady: false,
                isDataLock: false,

                allUserData: [],
                showMoreUser: false,
                isF: true,
                isUpdaPromptNick: false,
                isUpdaPrompt: false,
                mySelfName: "",
                showCreateChat: false,
                promptType: "success",
                promptMask: true,
                promptFlag: false,
                promptText: "",
                groupLord: "",  //当前群组ID
                userInfoAry: [],// 数组
                isSend: "",//没有消息提示添加消息提示
                outGroupMark: false,//退出标识
                initialCardUrl: "",//创建群聊用的
                initialName: "",//创建群聊用的
                companyData: [],//商号
                itemCardUrl: "",//点击每一个成员的url
                personalDetails: {},//群成员信息
                isGroupLord: true, //是否是群主
                flagMessageFree: false,//提示信息不能多次点击
                flagNickName: false, //更改昵称不能点击多次
                //添加成员页面标识
                showIncreasePersonnel: false,

                //删除群成员
                showRemoveMember: false,
                //转让群主
                showTransferLoad: false,

                reviseFlag: false, // 判断 ChatDetails页面标识
                reviseText: "", //ChatDetails中的内容
                reviseTitle: "",//reviseTitle中的标题
                reviseLimit: 9999,
                reviseNumber: 0,// 标记  用来判断群设置  1->群聊  2->昵称  3->群公告
                chatDet: [],
                isNickName: false,   //是否显示昵称
                isNotification: false, //消息免打扰
                groupName: "群名称",
                groupAnnouncement: "", //群公告,
                revisePlaceholder: '',
                nickName: "",
                biDid: "",
                cardUrl: "",
            }
        },
        computed: {
            did() {
                return this.$route.query.did
            },
            chatType() {
                return this.$route.query.chatType.toUpperCase()
            },
            companyId() {
                return this.$route.query.companyId || '';
            },
            urlDissolutionGroup() {
                return this.chatType === "ORG" ? "orgDissolutionGroup" : "dissolutionGroup";
            },
            isAllGroup() {
                return /zspallusers/.test(this.did)
            },
            initialSelected() {
                if (this.chatDet.length > 0) {
                    if (this.chatType.toUpperCase() === 'CHAT') {
                        let list = this.chatDet.map(item => ({ value: item.cardUrl, type: 'user' }));
                        list.push({ value: this.cardUrl, type: 'user' })
                        return list
                    }
                    return this.chatDet.map(item => ({ value: item.cardUrl, type: 'user' }))
                } else {
                    return []
                }
            },
            total() {
                return this.chatDet.length
            }
        },
        watch: {
            dataReady: {
                handler(v) {
                    if (v && !this.isReady) {
                        this.handleData();
                    }
                },
                immediate: true
            },
//            $router() {
//                this.initData();
//            },
            chatDet: {
                handler() {
                    if (this.chatDet.length > 8) {
                        this.showMoreUser = true;
                        this.allUserData = this.chatDet.slice(0, 8);
                    } else {
                        this.showMoreUser = false;
                        this.allUserData = this.chatDet
                    }
                    console.log('watch chatDet', this.allUserData)
                },
                deep: true,
                immediate: true
            },
            orgUserData: {
                handler() {
                    let orgUserData = this.orgUserData;
                    this.chatDet = this.chatDet.map(itemUser => { //全体成员昵称和头像等处理
                        if (this.chatType === "ORG") {
                            Object.keys(this.orgUserData).forEach(orgUser => {
                                if (orgUser === itemUser.cardUrl) {
//                                        console.log(orgUserData[orgUser],"一项");
                                    itemUser.nickName = orgUserData[orgUser].RealName.length > 0 ? orgUserData[orgUser].RealName : itemUser.RealName;
                                    itemUser.avatar = orgUserData[orgUser].headImg;
                                }
                            })
                        } else {
                            let userHead = !Z_IsEmpty20(itemUser.cardUrl) && itemUser.cardUrl.length > 2 && '/checkJpg/' + itemUser.cardUrl.substring(0, 2) + '/' + itemUser.cardUrl + '.jpg';
                            userHead = addTypeCache('zIsCacheDirect', userHead);
                            itemUser.avatar = userHead
                        }
                        return itemUser
                    });
                },
                immediate: true
            }
        },
        /*created() {
            this.initData();
        },*/
        methods: {
           /* ...mapMutations({
                setMode: 'SET_MODE'
            }),//下面的样式问题*/
            goBack () {
                this.$emit('backChat')
            },
            //隐藏创建单聊
            hideCanceled() {
                this.showCreateChat = false;
            },
            //用户详情页面
            changeUserDetails($event, itemCardUrl) {
                this.$emit('onAvatarClick', $event, itemCardUrl)
            },
            //添加群成员 todo 添加成员emit此事件：refreshOrgUserData
            increasePersonnel() {
                if (this.chatType === "CHAT") {
                    this.showCreateChat = true;
                } else {
                    this.showIncreasePersonnel = true;
                }
            },
            //隐藏添加页面
            hideAddUsers() {
                this.showIncreasePersonnel = false;
            },
            //成功添加人员
            successAddUsers(data) {
                data.forEach(item => {
                    item.avatar = item.headImg;
                    item.RealName = item.userName;
                });
                this.userInfoAry = [...this.userInfoAry, ...data];
                this.chatDet = [...this.chatDet, ...data];
                this.showIncreasePersonnel = false;
                this.$emit("onChangeTitleExt", this.total)
            },
            //修改ChatSettings组件
            setGroupChat(num, e) {    //点击按钮->reviseFlag->ChatSettings
                this.reviseFlag = true;
                switch (num) {
                    case 1:
                        this.reviseTitle = "群聊名称";
                        this.reviseText = this.groupName;
                        this.revisePlaceholder = '请输入群名';
                        this.reviseNumber = 1;
                        this.reviseLimit = 16;
                        break;
                    case 2:
                        this.reviseTitle = "我的昵称";
                        this.reviseText = this.nickName;
                        this.revisePlaceholder = '请输入昵称';
                        this.reviseNumber = 2;
                        this.reviseLimit = 9999;
                        break;
                    case 3:
                        this.reviseTitle = "群公告";
                        this.reviseText = this.groupAnnouncement ? this.groupAnnouncement : "";
                        this.revisePlaceholder = '请输入群公告';
                        this.reviseNumber = 3;
                        this.reviseLimit = 9999;
                        break;
                }
            },
            //修改群信息
            reviseClick(type, val) {
                this.reviseFlag = false;
                if (type) {
                    switch (type) {
                        case 1:
                            this.groupName = val ? val : '';
                            // 显示标题修改
//                            this.title = this.groupName
//                            this.$emit('groupNameChange', this.groupName)
                            break;
                        case 2:
                            this.nickName = val ? val : '';
                            break;
                        case 3:
                            this.groupAnnouncement = val;
                            break;
                    }
                }
            },
            //删除群成员
            removeCrewMember() {
                this.showRemoveMember = true;
            },
            hideRemoveMember() {
                this.showRemoveMember = false;
            },
            removeSuccess(removelist) {
                this.showRemoveMember = false;
                this.chatDet = this.chatDet.filter(item => !removelist.includes(item.cardUrl));
                this.$emit("onChangeTitleExt", this.total);
            },
            //转让群主
            transferLoad() {
                this.showTransferLoad = true;
            },
            hideTransferLoad() {
                this.showTransferLoad = false;
            },
            transferSuccess(transferCardUrl) {
                this.showTransferLoad = false;
//                 console.log(this.outGroupMark,'判断');
                this.outGroupMark && this.outGroup();
                if (transferCardUrl) {
                    let index = this.chatDet.findIndex(item => item.cardUrl === transferCardUrl);
                    if (index >= 0) {
                        [this.chatDet[0], this.chatDet[index]] = [this.chatDet[index], this.chatDet[0]]
                    }
                    this.isGroupLord = false;
                }
            },
            //退出群组
            outGroup() {
                let paramsOutGroup = {
                    groupId: this.did,
                    type: this.chatType,
                    companyId: this.companyId,
                    exitMode: "exit",
                    cardUrlPeer: this.cardUrl
                };
                let urlOutGroup = `/ZingMH/ZDesk/MENHUWX/MHChat/deleteGroupMember.action`;
                this.$http.post(urlOutGroup, Qs.stringify(paramsOutGroup)).then(res => {
                    this.outGroupMark = false;
                    if (res.data && res.data.success) {
                        this.promptFlag = true;
                        this.promptText = "退群成功";
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.$router.go(-1)
                        }, 2000)
                    }
                })
            },
            //解散群弹框 //退出群组
            showPlugin(val, flag) {
                const _this = this;
                if (flag) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: val,
                        confirmText: "确定",
                        hideOnBlur: true,
                    })
                    return;
                }
                this.$vux.confirm.show({
                    title: '提示',
                    content: val,
                    confirmText: flag ? " " : "确定",
                    cancelText: flag ? " " : "取消",
                    hideOnBlur: true,
                    onConfirm() {
                        if (val === "确定解散该群?") {
                            let paramDissolutionGroup = {
                                groupId: _this.did
                            };
                            let urlDissolutionGroup = `/ZingMH/ZDesk/MENHUWX/MHChat/${_this.urlDissolutionGroup}.action`;
                            _this.$http.post(urlDissolutionGroup, Qs.stringify(paramDissolutionGroup)).then(res => {
                                if (res.data.retcode === 0) {
                                    _this.promptFlag = true;
                                    _this.promptText = "成功解散该群！";
                                    clearTimeout(_this.timer);
                                    _this.timer = setTimeout(() => {
                                        _this.$router.go(-1)
                                    }, 2000)
                                }
                            });
                        } else {
                            if (_this.isGroupLord && _this.total > 1) {
                                _this.outGroupMark = true;
                                _this.transferLoad()
                            } else {
                                _this.outGroup()//退出群组
                            }
                        }
//    groupId:"当前的群组",type:"群主的类型",companyId:"公司的ID",exitMode:"exit",cardUrlPeer: cardUrl
                    }
                })
            },
            getImageUrl,
            //获取当前的 cardUrl 和 companyId
            getCardUrl() {
                let urlCard = "/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action";
                return this.$http.post(urlCard)
            },
            /*//消息提示
            getMessageFree() {
                let paramsMess = { tarId: this.did.replace(/chat/g, "") };
                let urlMessageFree = `/ZingMH/ZDesk/Message/free/getMessageFree.action`;
                return this.$http.post(urlMessageFree, Qs.stringify(paramsMess));
            },*/
            //更新消息提示
            updaMessageFree(newVal, oldVal) {
//                console.log('updaMessageFree', newVal, oldVal);
//                console.log('isUpdaPrompt', this.isUpdaPrompt);
                if (this.isUpdaPrompt) {
                    this.isNotification = newVal
                    // 锁定
                    this.isUpdaPrompt = false;

                    this.flagMessageFree = true;
                    let isDisturb = this.isNotification ? 1 : 0;
                    this.biDid = this.did.replace(/chat/, "");
                    let paramsMessage = {
                        bType: this.chatType,
                        tarId: this.biDid,
                        companyId: this.companyId,
                        isDisturb: isDisturb,
                        alertState: !this.isNotification,
                        isSend: this.isSend
                    };
                    let urlMessageFree = `/ZingMH/ZDesk/Message/free/updateMessageFreeAlertState.action`;
                    let urlUpdateWXALertListStatus = `/ZingMH/ZDesk/MENHUWX/MHHelper/updateWXALertListStatus.action`;
                    let paramsUpdateWXALertListStatus = {
                        companyId: this.companyId,
                        pageType: this.chatType,
                        status: "sync",
                        tId: this.total,
                        tarId: this.biDid
                    };
                    this.$http.post(urlMessageFree, Qs.stringify(paramsMessage)).then(res => {
                        if (res.data && res.data.success === true) {
                            this.$http.post(urlUpdateWXALertListStatus, Qs.stringify(paramsUpdateWXALertListStatus)).then(scuess => {
                                // 解锁
                                this.isUpdaPrompt = true;

                                this.promptFlag = true;
                                this.promptText = this.isNotification ? "开启消息免打扰" : "关闭消息免打扰";
                                this.flagMessageFree = false;
                                this.titleExtIco = this.isNotification ? 'icon-iconfontbell1' : ''
                                // 通知聊天页面名打扰状态变化
                                this.$emit('alertStateChange', !this.isNotification)
                            }).catch(err => {
                                this.isNotification = oldVal
                                // 解锁
                                this.isUpdaPrompt = true;
                                console.error("设置失败");
                            })
                        } else {
                            this.isNotification = oldVal
                            // 解锁
                            this.isUpdaPrompt = true;
                            console.error("设置失败");
                        }
                    }).catch(err => {
                        this.isNotification = oldVal
                        // 解锁
                        this.isUpdaPrompt = true;
                        console.error("设置失败", err);
                    });
                }
            },
            /*//获取全体成员昵称
            getChatNickname() {
                let paramsChatNickName = { chatId: this.did };
                let urlAllNickName = `/ZingMH/ZKM/myCustom/getChatNickname.action`;
                return this.$http.post(urlAllNickName, Qs.stringify(paramsChatNickName))
            },*/
            //更新显示昵称
            updaChatNickName(newVal, oldVal) {
                if (this.isUpdaPromptNick) {
                    // 锁定
                    this.isUpdaPromptNick = false
                    this.isNickName = newVal
                    //isShow true 显示 false 不显示
                    this.flagNickName = true;
                    let paramsUpdaName = {
                        isShow: newVal,
                        chatId: this.did
                    };
                    let urlUpdaNickName = `/ZingMH/ZDesk/myCustom/updateMyChatNickname.action`;
                    this.$http.post(urlUpdaNickName, Qs.stringify(paramsUpdaName)).then(res => {
                        // 解锁
                        this.isUpdaPromptNick = true;

                        this.promptFlag = true;
                        this.promptText = newVal ? "显示群昵称" : "隐藏群昵称";
                        this.flagNickName = false;
                        // 通知聊天页面显示昵称设置变化
                        this.$emit('showNick', this.isNickName)
                    }).catch(err => {
                        this.isNickName = oldVal
                        // 解锁
                        this.isUpdaPromptNick = true;
                        console.error(err)
                    })
                }
            },
            /*//获取我的昵称
            getMyChatNickname() {
                let paramsNickName = { chatId: this.did };
                let urlMyNickName = `/ZingMH/ZDesk/myCustom/getMyChatNickname.action`;
                return this.$http.post(urlMyNickName, Qs.stringify(paramsNickName))
            },
            //获取群成员信息 (内置 , 普通 , 全体 , 私聊  , 客服)
            getLoadChatUser() {
                let urlChatUser;
                let paramsChatUrl = { pageNumber: 1, pageSize: 5000 };
                switch (this.chatType) {
                    case "CHAT":
                    case 'chat':
                        paramsChatUrl.did = this.did;
                        urlChatUser = `/ZingMH/ZDesk/MENHUWX/MHChat/loadPersonChatUsers.action`;
                        break;
                    case "ORG":
                        paramsChatUrl.orgId = this.did;
                        paramsChatUrl.hrRealName = "hrRealName";
                        paramsChatUrl.idbid = this.companyId;
                        urlChatUser = `/ZingMH/ZDesk/MENHUWX/MHChat/loadOrgChatUser.action`;
                        break;
                    case "GROUP":
                    case "group":
                        urlChatUser = `/ZingMH/ZDesk/MENHUWX/MHChat/loadGroupChatUser.action`;
                        paramsChatUrl.did = this.did;
                        break;
                    case "IM":
                        paramsChatUrl.did = this.did.substr(2);
                        urlChatUser = `/ZingMH/ZDesk/MENHUWX/MHChat/loadIMKeFuUsers.action`;
                        break;
                }
                return this.$http.post(urlChatUser, Qs.stringify(paramsChatUrl))
            },*/
            /*//获取群信息
            //loadOrgChatInfo
            getGroupInfo() {
                let paramsGroupInfo = { ac: "loadTalkInfo", type: this.chatType, did: this.did };
                let urlGroupInfo = `/NCard/NCardService`;
                return this.$http.post(urlGroupInfo, Qs.stringify(paramsGroupInfo))
            },*/
            //获取数据初始化数据
            /*initData() {
                if (this.chatType.toUpperCase() === "CHAT") {
                    this.$http.all([
                        this.getCardUrl(),
                        this.getLoadChatUser(),
                        this.getMessageFree()
                    ]).then(this.$http.spread((getCardUrl, loadChatUser, messageFree) => {
                        // 加载完数据即解锁
                        this.isUpdaPrompt = true

                        let { cardUrl } = getCardUrl.data.data;
                        this.cardUrl = cardUrl;
                        this.chatDet = loadChatUser.data.data.data.filter(item => {
                            if (item.cardUrl === this.cardUrl) {
                                this.mySelfName = item.RealName
                            }
                            return item.cardUrl !== this.cardUrl
                        }).map(item => {
                            let avatar = !Z_IsEmpty20(item.cardUrl) && item.cardUrl.length > 2 && '/checkJpg/' + item.cardUrl.substring(0, 2) + '/' + item.cardUrl + '.jpg';
                            avatar = addTypeCache('zIsCacheDirect', avatar);
                            item.avatar = avatar;
                            return item
                        });
                        this.initialCardUrl = this.chatDet.reduce((str, member) => {
                            if (member.cardUrl === this.cardUrl) {
                                return str
                            }
                            if (str) {
                                return str + ',' + member.cardUrl
                            } else {
                                return member.cardUrl
                            }
                        }, '');
                        this.initialName = this.chatDet.reduce((str, member) => {
                            if (member.cardUrl === this.cardUrl) {
                                return str
                            }
                            if (str) {
                                return str + ',' + member.RealName
                            } else {
                                return member.RealName
                            }
                        }, '');
                        if (messageFree.data.data.length > 0) {
                            let { alertState } = messageFree.data.data[0];
                            this.isNotification = alertState === "true" ? false : true;
                            this.isSend = this.isNotification;
                            this.titleExtIco = this.isNotification ? '' : 'icon-iconfontbell1'
                        } else {
                            this.isSend = "add";
                        }
                        //是否正在加载
//                        console.log(getCardUrl, loadChatUser, messageFree);

                        // emit初始化事件
                        this.$emit('init', true);
                    })).catch(err => {
                        console.error(err);

                        // emit初始化事件
                        this.$emit('init', false);
                    })
                } else {
//                    console.log("群聊");
                    this.$http.all([
                        this.getCardUrl(),
                        this.getMessageFree(),
                        this.getChatNickname(),
                        this.getMyChatNickname(),
                        this.getLoadChatUser(),
                        this.getGroupInfo()
                    ]).then(this.$http.spread((getCardUrl, messageFree, chatNickname,
                                               myChatNickname, loadOrgChatUser, groupInfo) => {
                        // 加载完数据即解锁
                        this.isUpdaPrompt = true;
                        this.isUpdaPromptNick = true;

                        let { cardUrl } = getCardUrl.data.data;
                        this.cardUrl = cardUrl;
                        if (messageFree.data.data.length > 0) {
                            let { alertState } = messageFree.data.data[0];
                            this.isNotification = alertState === "true" ? false : true;
                            this.isSend = this.isNotification;
                            this.titleExtIco = this.isNotification ? '' : 'icon-iconfontbell1'
                        } else {
                            this.isSend = "add";
                        }
                        if (myChatNickname.data.data.data.length > 0) {
                            let { nickname, isShow } = myChatNickname.data.data.data[0];
                            this.nickName = nickname; //我的昵称
                            this.isNickName = isShow === "true" ? true : false; //是否显示昵称
                        }
                        //当前群信息
                        let { murl, oTitle, masterId, oDesc, gRole } = groupInfo.data;
                        //当前用户的cardUrl
                        this.cardUrl = murl;
                        //获取群名称
                        this.groupName = oTitle;
                        //群主的cardUrl
                        this.groupLord = masterId || gRole;
                        //获取群公告
                        this.groupAnnouncement = oDesc === "null" ? false : oDesc;
                        //是否是群主？
                        this.isGroupLord = this.cardUrl === this.groupLord ? true : false;
                        //群成员信息 内置
                        let chatDet = loadOrgChatUser.data.data.data;
                        let userHead;
                        console.log("全体内部成员数据", this.orgUserData);
                        let orgUserData = this.orgUserData;
                        this.chatDet = chatDet.map(itemUser => { //全体成员昵称和头像等处理
                            if (this.chatType === "ORG") {
                                Object.keys(this.orgUserData).forEach(orgUser => {
                                    if (orgUser === itemUser.cardUrl) {
//                                        console.log(orgUserData[orgUser],"一项");
                                        itemUser.nickName = orgUserData[orgUser].RealName.length > 0 ? orgUserData[orgUser].RealName : itemUser.RealName;
                                        itemUser.avatar = orgUserData[orgUser].headImg;
                                    }
                                })
                            } else {
                                userHead = !Z_IsEmpty20(itemUser.cardUrl) && itemUser.cardUrl.length > 2 && '/checkJpg/' + itemUser.cardUrl.substring(0, 2) + '/' + itemUser.cardUrl + '.jpg';
                                userHead = addTypeCache('zIsCacheDirect', userHead);
                                itemUser.avatar = userHead;
                                if (chatNickname.data.data.data.length > 0) {
                                    chatNickname.data.data.data.forEach(itemNickname => {
                                        itemUser.nickName = itemNickname.cardUrl === itemUser.cardUrl ? itemNickname.nickname : null
                                    })
                                }
                            }
                            if (this.cardUrl === itemUser.cardUrl) {
                                this.mySelfName = itemUser.RealName
                            }
                            return itemUser
                        });
                        //处理数据
                        let index = this.chatDet.findIndex(item => item.cardUrl === this.groupLord);
                        // this.userInfoAry = loadOrgChatUser.data.data.data; //存储数据
                        if (index >= 0) {
                            [this.chatDet[0], this.chatDet[index]] = [this.chatDet[index], this.chatDet[0]]
                        }
                        this.userInfoAry = JSON.parse(JSON.stringify(this.chatDet));
                        this.$emit("onChangeTitleExt", this.total)

                        // emit初始化事件
                        this.$emit('init', true);
                    })).catch(err => {
                        console.error(err);

                        // emit初始化事件
                        this.$emit('init', false);
                    });
                }
            },*/
            // 处理初始数据
            handleData() {
                if (this.isDataLock) return;
                this.isDataLock = true;

                if (!dataHandler.hasExtraInit) {
                    this.isDataLock = false;
                    this.bottomToast('网络不稳定')
                    return
                }

                // 单聊，客服
                if (this.chatType.toUpperCase() === 'CHAT' || this.chatType === 'IM') {
                    // 加载完数据即解锁
                    this.isUpdaPrompt = true

                    this.cardUrl = dataHandler.cardUrl;
                    this.chatDet = dataHandler.chatUsers.filter(item => {
                        if (item.cardUrl === this.cardUrl) {
                            this.mySelfName = item.RealName
                        }
                        return item.cardUrl !== this.cardUrl
                    }).map(item => {
                        let avatar = !Z_IsEmpty20(item.cardUrl) && item.cardUrl.length > 2 && '/checkJpg/' + item.cardUrl.substring(0, 2) + '/' + item.cardUrl + '.jpg';
                        avatar = addTypeCache('zIsCacheDirect', avatar);
                        item.avatar = avatar;
                        return item
                    });
                    this.initialCardUrl = this.chatDet.reduce((str, member) => {
                        if (member.cardUrl === this.cardUrl) {
                            return str
                        }
                        if (str) {
                            return str + ',' + member.cardUrl
                        } else {
                            return member.cardUrl
                        }
                    }, '');
                    this.initialName = this.chatDet.reduce((str, member) => {
                        if (member.cardUrl === this.cardUrl) {
                            return str
                        }
                        if (str) {
                            return str + ',' + member.RealName
                        } else {
                            return member.RealName
                        }
                    }, '');

                    // 消息提醒设置
                    this.isNotification = dataHandler.alertState === 'true' ? false : true;
                    this.isSend = dataHandler.alertState === 'add' ? 'add' : this.isNotification;
                    this.titleExtIco = this.isNotification ? '' : 'icon-iconfontbell1'
                }
                // 群聊
                else {
                    // 加载完数据即解锁
                    this.isUpdaPrompt = true;
                    this.isUpdaPromptNick = true;

                    this.cardUrl = dataHandler.cardUrl;

                    // 消息提醒设置
                    this.isNotification = dataHandler.alertState === 'true' ? false : true;
                    this.isSend = dataHandler.alertState === 'add' ? 'add' : this.isNotification;
                    this.titleExtIco = this.isNotification ? '' : 'icon-iconfontbell1'

                    // 昵称显示
                    let { nickname, isShow } = dataHandler.myNickData
                    this.nickName = nickname;
                    this.isNickName = isShow === "true" ? true : false;

                    // 群信息
                    let { murl, oTitle, masterId, oDesc, gRole } = PSMU.chatInfo.getTalkInfo()
                    this.cardUrl = murl; // 当前用户的cardUrl
                    this.groupName = oTitle; // 获取群名称
                    this.groupLord = masterId || gRole; // 群主的cardUrl
                    this.groupAnnouncement = oDesc === "null" ? false : oDesc; // 获取群公告
                    this.isGroupLord = this.cardUrl === this.groupLord ? true : false; // 是否是群主？

                    // 群成员信息
                    let chatDet = dataHandler.chatUsers;
                    let userHead;
                    let orgUserData = this.orgUserData;
                    this.chatDet = chatDet.map(itemUser => { //全体成员昵称和头像等处理
                        if (this.chatType === "ORG") {
                            Object.keys(this.orgUserData).forEach(orgUser => {
                                if (orgUser === itemUser.cardUrl) {
                                    // 头像
                                    itemUser.avatar = orgUserData[orgUser].headImg;
                                    // 昵称
                                    itemUser.nickName = orgUserData[orgUser].RealName.length > 0 ? orgUserData[orgUser].RealName : itemUser.RealName;
                                }
                            })
                        } else {
                            // 头像
                            userHead = !Z_IsEmpty20(itemUser.cardUrl) && itemUser.cardUrl.length > 2 && '/checkJpg/' + itemUser.cardUrl.substring(0, 2) + '/' + itemUser.cardUrl + '.jpg';
                            userHead = addTypeCache('zIsCacheDirect', userHead);
                            itemUser.avatar = userHead;
                            // 昵称
                            let nickData = dataHandler.nickDataDict[itemUser.cardUrl]
                            itemUser.nickName = nickData ? nickData.nickName : null
                        }
                        if (this.cardUrl === itemUser.cardUrl) {
                            this.mySelfName = itemUser.RealName
                        }
                        return itemUser
                    });

                    // 群主排序
                    let index = this.chatDet.findIndex(item => item.cardUrl === this.groupLord);
                    if (index >= 0) {
                        [this.chatDet[0], this.chatDet[index]] = [this.chatDet[index], this.chatDet[0]]
                    }
                    this.userInfoAry = JSON.parse(JSON.stringify(this.chatDet));
                    this.$emit("onChangeTitleExt", this.total)
                }

                this.isDataLock = false;
            },
            moreUser() {
                this.allUserData = this.chatDet;
                this.showMoreUser = false;
            },
            // 提示
            bottomToast (msg) {
                let _this = this
                if (!msg) return
                this.$vux.toast.show({
                    text: msg,
                    type: 'text',
                    position: 'bottom',
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../../assets/stylus/variable.styl"
    @import "../../../assets/stylus/mixin.styl"

    .chat-details-html
        background: #f5f5f5;
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex-center(column, flex-start, flex-start)
        .chat-details-header
            flex-shrink: 0
        .chat-details-content-wrapper
            flex-grow: 2
            width: calc(100% + 5px)
            overflow-y: auto
            .chat-details-content-scroll
                display: block
                position: relative
        .chat-dialogue-entry-collect
            background-color: #fff;
            position: relative;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            color: #464646;
            font-size: 14px;
            box-shadow: 1px 1px 1px #b7b7b7;
            .last-li
                max-width: 100%
                margin: 18px 0 -3px
                color: #9c9c9c
                font-size: 16px
            li
                float: left;
                flex-grow: 1;
                flex-basis: 20%;
                max-width: 20%;
                text-align: center;
                div
                    position: relative;
                    border-radius: 6px;
                    overflow: hidden;
                    width: 55px;
                    height: 55px;
                    margin: 0 auto;
                    background-size: cover;
                    border: 1px solid #eee;
                    img
                        width: 100%;
                        height: 100%;
                p
                    margin-bottom: 8px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                .my-icon
                    font-size: 23px;
                    color: #bbb;
                    line-height: 55px
        .chat-details-content
            border-top: 1px solid #d1d1d1;
        .chat-dialogue-group-announcement
            padding: 5px 15px 10px;
            font-size: 13px;
            color: #a0a0a0;
        .chat-dialogue-leave-group-chat
            height: 40px
            font-size: 18px
            color: #fff
            background-color: #ff8000
            flex-shrink: 0;
            width: calc(100%);
            margin: 15px 0;
            border: none
        .group-content-settings
            color: #2a2a2a;
            height: 50px;
            font-size: 15px;
        .quit-button
            padding-left 13px;
            padding-right 13px;
</style>


