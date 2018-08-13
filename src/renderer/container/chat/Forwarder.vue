<template>
    <div class="message-forward">
        <chat-head class="message-forward-head" @goBack="goBack" :title="'选择'" :hasDetail="false">
            <div slot="right">
                <x-button :disabled="isClick" class="head-btn" :type="'primary'" :mini="true" @click.native="switchMultipleAndDeal">{{ isMultiple ? '确定' : '多选' }} </x-button>
            </div>
        </chat-head>
        <search
            :ref = "searchForward"
            v-model="recentChatValue"
            @on-change="forwardSearch"
            class="message-forward-search"
            :auto-fixed="false"
           >
        </search>
        <div class="message-forward-nav">
            <panel :list="navList" :type="'2'" @on-click-item="navClick"></panel>
        </div>
        <div class="message-forward-list">
            <div class="message-forward-list-scroll">
                <div class="message-forward-list-content">
                    <check-panel v-model="recentChatCheckList" :list="recentChatList" :disabled="!isMultiple" :type="'6'" @on-click-item="chooseChat" :label-position="'left'"></check-panel>
                </div>
            </div>
        </div>
        <popup v-model="showCreateChat" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto'}">
            <create-chat :forwardChat="false" @canceled="onCreateCanceled" @created="onCreated"></create-chat>
        </popup>
        <popup v-model="showMyGroups" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto'}">
            <my-groups
                @onMyGroupDetermine="onMyGroupDetermine"
                @onMyGroupsCanceled="onMyGroupsCanceled">
            </my-groups>
        </popup>
        <div class="dialog-popup-mask" v-show="showForwardDialog" style="z-index:600" @click="hideForwardDialog"></div>
        <div class="dialog-popup" v-show="showForwardDialog">
            <popup v-model="showForwardDialog" :show-mask="true" position="top" style="text-align:left;position:relative;background-color:#eee;width:80%;height:auto;margin:40% auto;padding-top:10px;overflow:hidden;z-index:601">
                <h1 class="forward-dialog-title">发送给：</h1>
                <div class="forward-dialog-chat">
                    <div class="chat-item" v-for="(chat, index) in choosenChatList" :key="index">
                        <div class="image-wrapper">
                            <img :src="getImageUrl(chat.img,'./static/images/userDef_.jpg')"
                                 data-error="./static/images/userDef_.jpg"
                                 v-lazy-image/>
                        </div>
                        <div class="title">{{chat.peerRealName}}</div>
                    </div>
                </div>
                <div class="forward-dialog-message">
                    <message v-if="message" :message="message" :readMode="true"></message>
                </div>
                <div class="forward-dialog-input">
                    <input ref="input" v-model="forwardComment" class="border-top-1px" placeholder="给朋友留言"/>
                </div>
                <div class="forward-dialog-control">
                    <x-button :mini="true" @click.native="hideForwardDialog">取消</x-button>
                    <x-button :type="'primary'" :mini="true" @click.native="doForward">发送</x-button>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
    import ChatHead from './ChatHead'
    import { XButton, Search, Panel, Popup } from 'vux'
    import { mapMutations } from 'vuex'
    import CreateChat from './CreateChat'
    import CheckPanel from "../../components/checkpanel/CheckPanel"
    import MyGroups from "./MyGroups.vue"
    import Qs from 'qs'
    import InputBox from "./InputBox"
    import Message from "./Message"
    import LazyImage from '../../directives/lazyimage/lazy-image'
    import { getImageUrl } from '../../utils/fn'
    import { callCancel } from "./chatDetails/chat-details"
//    const ChatInfo = require('../../utils/chatInfo')
    import ChatInfo from '../../utils/chatInfo'

    export default {
        name: "Forwarder",
        directives: {
            LazyImage
        },
        components: {
            InputBox,
            Message,
            Popup,
            Panel,
            CheckPanel,
            XButton,
            Search,
            ChatHead,
            CreateChat,
            MyGroups
        },
        props: {
            message: {
                type: Object,
                default: null
            },
        },
        data() {
            return {
                recentChatValue:"",
                // isStandalone: false,
                isMultiple: false,
                navList: [
                    {
                        value: 'create',
                        title: '创建新聊天',
                    }, {
                        value: 'choose',
                        title: '选择已有群组',
                    }
                ],
                showMyGroups:false,
                showCreateChat: false,
                recentChatCheckList: [],
                storageRecentChatList: [],
                recentChatList: [],
                // 转发对话框
                choosenChatList: [],
                showForwardDialog: false,
                forwardComment: '',
            }
        },
        computed: {
            searchForward() {
                let random = Math.floor(Math.random() * 11);
                return `searchForward${random}`
            },
            recentChatKeyDict() {
                let map = {}
                this.recentChatList.forEach(item => {
                    map[item.key] = item.source
                })
                return map
            },
            isClick() {
                 if (!this.isMultiple || this.recentChatCheckList.length > 0) {
                    return false
                } else {
                     return true
                 }
            }
        },
        watch: {
            recentChatCheckList (list) {
                // console.log('recentChatCheckList checkChange', list, list.map(key => this.recentChatKeyDict[key]))
            }
        },
        mounted() {
            this.loadChatAlert();
        },
        /*beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            if (to.name === 'forward') {
                console.log('forward hide bottom menu')
                next(vm => {
                    // 通过 `vm` 访问组件实例
                    vm.isStandalone = true
                    vm.setMode(false)
                })
            } else {
                next()
            }
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            if (from.name === 'forward') {
                console.log('forward show bottom menu')
                this.setMode(true)
                next()
            } else {
                next()
            }
        },*/
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            getImageUrl: getImageUrl,
            goBack() {
                // 退出多选模式
                if (this.isMultiple) {
                    this.isMultiple = false
                    return
                }
                /*// 返回
                if (this.isStandalone) {
                    this.$router.go(-1)
                } else {*/

                this.recentChatValue = "";
                this.recentChatList = this.storageRecentChatList
                this.recentChatCheckList = [];
                callCancel(this.$refs[this.searchForward].$el)
                this.$emit('hideForwarder')
                /*}*/
            },
            switchMultipleAndDeal() {
                if (!this.isMultiple) {
                    this.isMultiple = true;
                } else {
                    // 选中
                    let choosenChat = this.recentChatCheckList.map(key => {
                        let chat = this.recentChatKeyDict[key]
                        return {
                            did: chat.tarId,
                            type: chat.bType,
                            companyId: chat.companyId,
                            img: chat.dispImg
                        }
                    })
                    console.log('chooseChat multiple mode', choosenChat)
                    this.choosenChatList = choosenChat
                    this.showForwardDialog = true
                }
            },
            navClick(item) {
                console.log('navClick', item.value)
                if (item.value === 'create') {
                    console.log("创建群组");
                    this.showCreateChat = true
                }
                if (item.value === 'choose') {
                    console.log("我的群组");
                    this.showMyGroups = true
                }
            },
            onCreateCanceled() {
                this.showCreateChat = false
            },
            onMyGroupsCanceled() {
                this.showMyGroups = false
            },
            onMyGroupDetermine(selectedGroups) {
//                console.log(selectedGroups)
                this.showMyGroups = false
                this.choosenChatList = selectedGroups
                this.showForwardDialog = true
            },
            onCreated(did, companyId, type, headAvatar) {
                this.showCreateChat = false;
                this.choosenChatList = [{
                    did: did,
                    type: type,
                    companyId: companyId,
                    dispImg: headAvatar
                }]
                this.showForwardDialog = true
            },
            loadChatAlert() {
                var url = "/ZingMH/ZDesk/MENHUWX/MHHelper/loadUserAlert.action"
                /*可以根据需要加keyAlert*/
                var params = { loadType: 'chatAlert', pageSize: '20' }

                this.$http.post(url, Qs.stringify(params)).then(res => {
                    if (res.data.success) {
                        console.log('loadChatAlert', res)
                        let rData = res.data.data.data;
                        let endData = rData.filter(message => {
                            if (message.bType === 'GROUP' || message.bType === 'ORG' || message.bType === 'chat') {
                                return true
                            } else {
                                return false
                            }
                        }).map(message => {
                            return {
                                key: message.tarId,
                                title: message.peerRealName,
                                src: message.dispImg,
                                source: message
                            }
                        });
                        this.recentChatList = endData;
                        this.storageRecentChatList = endData;
                    }
                }).catch(err => {
                    console.error(err)
                })
            },
            chooseChat(chatItem) {
                if (!this.multiple) {
                    let chat = chatItem.source
                    this.choosenChatList = [{
                        did: chat.tarId,
                        type: chat.bType,
                        companyId: chat.companyId,
                        img: chat.dispImg
                    }]
                    this.showForwardDialog = true
                }
            },
            hideForwardDialog() {
                this.showForwardDialog = false
            },
            forwardSearch (val) {
                let list = [];
                if (val.length > 0) {
                    list = this.storageRecentChatList.filter(recentChat => recentChat.title.includes(val));
                    this.recentChatList = list.length > 0 ? list : this.recentChatList;
                } else {
                    this.recentChatList = this.storageRecentChatList;
                }
            },
            doForward() {
                let that = this
                // 转发消息
                let chatInfo
                if (PSMU.chatInfo) {
                    chatInfo = PSMU.chatInfo
                } else {
                    chatInfo = new ChatInfo.ChatInfo()
                }
                chatInfo.msg2Group(this.choosenChatList, this.message, this.forwardComment).then(() => {
                    console.log('forward success');
                    this.showForwardDialog = false;
                    this.$vux.toast.show({
                        text: '转发成功',
                        type: 'text',
                        position: 'bottom'
                    });
                    callCancel(this.$refs[this.searchForward].$el)
                    this.isMultiple = false;
                    this.recentChatValue = "";
                    this.recentChatCheckList = [];
                    this.recentChatList = this.storageRecentChatList
                    that.$emit('hideForwarder')

                    this.recentChatCheckList = []
                    this.choosenChatList = []
                    this.forwardComment = ''
                }).catch(err => {
                    console.error('forward failed', err)
                    this.$vux.toast.show({
                        text: '转发失败',
                        type: 'text',
                        position: 'bottom'
                    })
                })

                /*// test
                let msg = chatInfo.initInfoMessage('测试INFO消息')
                chatInfo.msg2Group(this.choosenChatList, msg)*/
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"
    .head-btn
        height: 30px
        line-height: 30px
        margin-right: 1rem
    .message-forward
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%
        .message-forward-head, .message-forward-search, .message-forward-nav
            flex-shrink: 0
        .message-forward-list
            flex-grow: 2
            overflow-y: auto
            /*position: relative
            .message-forward-list-scroll
                width: calc(100% + 20px)
                height: 100%
                overflow-y: scroll
                .message-forward-list-content
                    width: calc(100% - 20px)*/
    .dialog-popup
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        text-align: center
        .forward-dialog-title
            margin: 5px 30px;
            font-size: 18px;
            font-weight: 500;
        .forward-dialog-chat
            margin: 20px 30px
            width: calc(100% - 60px)
            overflow-x: auto;
            flex-center(row, flex-start, flex-start)
            .chat-item
                margin-right: 10px;
                .image-wrapper
                    width: 60px
                    height: 60px
                    overflow: hidden
                    img
                        display: block
                        width: 60px
                        min-height: 60px
                        border: solid 1px rgba(255, 255, 255, 0.2)
                        transform: translateY(calc(-50%+25px))
                        background-color: #c4ccdf
                .title
                    width: 60px
                    margin-top: 2px;
                    overflow: hidden
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: center;
        .forward-dialog-message
            background: #fff
            margin: 10px 30px
        .forward-dialog-input
            margin: 5px 30px
            overflow: hidden
            input
                width: calc(100% + 10px)
                padding: 5px 10px 5px 0
                border: none
                border-bottom: 1px #fe8c19 solid
                background-color: transparent !important
                max-height: 84px
                font-size: 16px
                resize: none
                overflow-y: auto
                &:focus
                    outline: none
        .forward-dialog-control
            margin: 20px 30px;
            flex-center(row, flex-end, flex-start)
            button
                width: 80px
                flex-shrink: 0
                flex-grow: 0
                margin: 0 15px
                &+button
                    margin-top: 0
                    margin-right: 0
    .dialog-popup-mask
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(0,0,0,.5);
</style>
