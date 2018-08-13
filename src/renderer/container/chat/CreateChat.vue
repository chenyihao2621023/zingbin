<template>
    <contact-picker
        :initialSelected="initialSelected"
        :currentCompanyMode="false"
        :refreshSeed="refreshSeed"
        @goBack="onCanceled"
        @picked="onContactPicked">
    </contact-picker>
</template>

<script>
    import { Popup } from 'vux'
    import ContactPicker from '../../components/contactpicker/ContactPicker'
    import Qs from 'qs'
    import { addTypeCache, Z_IsEmpty20, getImageUrl } from "../../utils/fn"
    import { forwardingMeg } from "./chatDetails/chat-details"
//    const ChatInfo = require('../../utils/chatInfo')
    import ChatInfo from '../../utils/chatInfo'
    import store from '../../store'

    export default {
        name: "CreateChat",
        components: {
            Popup,
            ContactPicker
        },
        props: {
            mySelfName:{
              type:String,
              default:"我"
            },
            initialSelected:{
              type : Array,
              default: function() {
                    return [];
              }
            },
            forwardChat: {
                type: Boolean,
                default: false
            },
            forwardChatMode: {
                type: String,
                default: 'replace'
            },
            initialCardUrl: {
                type: String,
                default: ''
            },
            initialName: {
                type: String,
                default: ''
            },
            refreshSeed: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                params: {}
            }
        },
        computed: {
            cardUrl() {
                return store.state.ui.currentCardUrl
            },
        },
        watch: {
            refreshSeed() {
                this.getCardUrl()
            },
            /*cardUrl: {
                handler(v) {
                    console.log('cardUrl change', `'${v}'`, `'${store.state.ui.currentCardUrl}'`, `'${store.getters.getCurrentCardUrl}'`)
                },
                immediate: true
            }*/
        },
        mounted() {
            this.getCardUrl()
        },
        methods: {
            /*getCardUrl() {
                if (this.cardUrl) return

                let urlCard = "/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action";
                this.$http.post(urlCard).then(res => {
                    console.log('getCardUrl', res)
                    if (res.data.success) {
                        this.cardUrl = res.data.data.cardUrl
                    } else {
                        console.error('getCardUrl failed', res)
                    }
                }).catch(err => {
                    console.error(err)
                })
            },*/
            getCardUrl() {
                store.dispatch('loadCurrentCardUrl')
            },
            onCanceled() {
                this.$emit('canceled')
            },
            forwarding(addPeopleName) {
                console.log('forwarding', this.$router)

                let chatInfo
                if (PSMU && PSMU.chatInfo) {
                    chatInfo = PSMU.chatInfo
                } else {
                    chatInfo = new ChatInfo.ChatInfo()
                    chatInfo.setSelf(this.cardUrl)
                    chatInfo.setVal('nick', this.mySelfName)
                }
                let message = chatInfo.initInfoMessage(`'${this.mySelfName}'创建群聊并邀请'${addPeopleName}'加入群聊`);
                let addGroupList = [];
                addGroupList.push(this.params);
                forwardingMeg(addGroupList,message,this.forwardSuccess,this.$vux.toast.show,chatInfo);
            },
            forwardSuccess() {
                if (this.forwardChatMode === 'replace') {
                    this.$router.replace({
                        name:"middleLayer",
                        query:this.params
                    })
                } else {
                    this.$router.push({
                        name:"middleLayer",
                        query:this.params
                    })
                }
            },
            onContactPicked(addGroupMembersT,addPeopleName,hasFriendSelected, selectedCompanyId) {
                console.log('onContackPicked', addGroupMembersT,addPeopleName,hasFriendSelected, selectedCompanyId)
                console.log('onContackPicked', this.cardUrl)

                // 过滤掉自己
                let addGroupMembers = addGroupMembersT.filter(member => {
                    if (this.cardUrl.indexOf(member.cardUrl) > -1) return false;
                    return true;
                })
                let createGroupUrl = "";
                let addCardUrlStr = addGroupMembers.reduce((str, member, idx) => {
                    if (str.indexOf(member.cardUrl) > -1) {
                        return str
                    }
                    return str + `${member.cardUrl},`
                }, '');
                if (addCardUrlStr.lastIndexOf(',') === addCardUrlStr.length - 1) {
                    addCardUrlStr = addCardUrlStr.substring(0, addCardUrlStr.length - 1)
                }
                console.log('addGroupMembers', addGroupMembers)
                if (this.cardUrl && (addGroupMembers.length > 1 || this.initialCardUrl.length > 0)) {
                    console.log('创建群聊')

                    let addInfoNames = addPeopleName
                    //创建群聊
                    // addCardUrlStr += ',' + this.cardUrl + ',' + this.initialCardUrl;
                    if (this.initialCardUrl.length > 0) {
                        let initCardUrls = this.initialCardUrl;
                        /*if (this.initialCardUrl.indexOf(this.cardUrl) === 0) {
                            initCardUrls = this.initialCardUrl.substring(this.cardUrl.length)
                        }
                        else if (this.initialCardUrl.indexOf(this.cardUrl) > 0
                            && this.initialCardUrl.indexOf(',' + this.cardUrl) > 0) {
                            let ix = this.initialCardUrl.indexOf(',' + this.cardUrl);
                            initCardUrls = this.initialCardUrl.substring(0, ix) +
                                this.initialCardUrl.substring(ix + this.cardUrl.length + 1)
                        }*/
                        addCardUrlStr += ',' + initCardUrls;
                    }

                    if (this.initialName.length > 0) {
                        addInfoNames = addPeopleName + ',' + this.initialName
                    }

                    console.log('create chat', addCardUrlStr, addInfoNames);

                    let paramsCreateGroup = {
                        descp: "群公告",
                        title: "群聊",
                        isOnlyUser: false,
                        chatUsers: addCardUrlStr
                    };
                    let type;
                    if (!hasFriendSelected && selectedCompanyId.length === 1) {
                        //创建的内部群
                        paramsCreateGroup.ac = "CompanyGroupChat";
                        createGroupUrl = `/NCard/IMKFService`;
                        type = "ORG";

                        // 内部群cardUrl需要将自己的cardUrl传入
                        if (!this.cardUrl) {
                            this.$vux.toast.show({
                                text: "网络异常",
                                type: 'text',
                                position: 'bottom',
                                onHide() {
                                    _this.$emit('canceled')
                                }
                            })
                            return
                        }
                        addCardUrlStr = this.cardUrl + ',' + addCardUrlStr
                        paramsCreateGroup.chatUsers = addCardUrlStr

                        this.$http.post(createGroupUrl, Qs.stringify(paramsCreateGroup)).then(res => {
                            console.log(res);
                            if (Object.keys(res.data).length > 0 && (res.data.msg === "sucess" || res.data.error === 3001)) {
                                let { companyId,did,chatId } = res.data;
                                companyId = companyId ? companyId : null;
                                did = did ? did : chatId;
                                this.params = { did,type,companyId };

                                this.forwarding(addInfoNames);
                                /*if (this.forwardChat) {
                                    this.$vux.toast.show({
                                        text: "创建群成功，正在转发！",
                                        type: 'text',
                                        position: 'bottom',
                                        onHide() {
                                            _this.$emit('created', did, companyId, type,"./static/images/userDef_.jpg")
                                        }
                                    })
                                }*/
                                this.$emit('created', did, companyId, type,"./static/images/userDef_.jpg")
                            }
                        },err => {
                            console.log(err);
                            const _this = this;
                            this.$vux.toast.show({
                                text: "创建失败！" + err.message,
                                type: 'text',
                                position: 'bottom',
                                onHide() {
                                    _this.$emit('canceled')
                                }
                            })
                        });
                    } else {
                        paramsCreateGroup.ac = "createGroup";
                        paramsCreateGroup.sType = "friend";
                        createGroupUrl = `/NCard/NCardService`;
                        type = "GROUP";

                        this.$http.post(createGroupUrl, Qs.stringify(paramsCreateGroup)).then(res => {
                            console.log(res);
                            const _this = this;

                            let { did, msg } = res.data;

                            if (msg === 'sucess') {
                                this.params = { did, type };

                                if (this.forwardChat) {
                                    /*this.$vux.toast.show({
                                        text: "创建群成功，正在转发！",
                                        type: 'text',
                                        position: 'bottom',
                                    })*/
                                    this.forwarding(addPeopleName);
                                }
                                this.$emit('created', did, null, type,"./static/images/userDef_.jpg")
                            } else {
                                this.$vux.toast.show({
                                    text: "创建失败！",
                                    type: 'text',
                                    position: 'bottom',
                                    onHide() {
                                        _this.$emit('canceled')
                                    }
                                })
                            }
                        },err => {
                            let _this = this
                            console.log(err);
                            this.$vux.toast.show({
                                text: "创建失败！" + err.message,
                                type: 'text',
                                position: 'bottom',
                                onHide() {
                                    _this.$emit('canceled')
                                }
                            })
                        });
                    }
                } else {  //创建单聊
                    console.log("这是创建单聊");
                    let msgUserHead = !Z_IsEmpty20(addCardUrlStr) && addCardUrlStr.length > 2 && '/checkJpg/' + addCardUrlStr.substring(0, 2) + '/' + addCardUrlStr + '.jpg';
                    msgUserHead = addTypeCache('zIsCacheDirect', msgUserHead);
                    msgUserHead = getImageUrl(msgUserHead,'./static/images/userDef_.jpg');
//                    addCardUrlStr += ',' + this.cardUrl;
                    let urlChat = "/NCard/NCardService";
                    let paramsChat = {
                        ac:"initChatInfoV2",
                        cardUrlPeer:addCardUrlStr,
                        zIsCacheDirect:true,
                        v:"9999.9999"
                    };
                    this.$http.post(urlChat,Qs.stringify(paramsChat)).then(res => {
                        if (res.data && res.status === 200 && res.data.code === 511) {
                            let { chatId, type } = res.data.data
                            let did = chatId
                            let companyId = ''
                            this.params = { did, type, companyId };
                            console.log('this.params', this.params)
                            this.forwardSuccess()
                            this.$emit('created', chatId, null, type, msgUserHead)
                        } else {
                            this.$vux.toast.text("创建聊天失败", 'bottom')
                        }
                    }).catch(err => {
                        this.$vux.toast.text("创建聊天失败" + err.message, 'bottom')
                    });
                }
            }
        }
    }
</script>
