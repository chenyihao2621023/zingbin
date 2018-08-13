<template>
    <div class="chat-page-wrapper">
        <div class="chat-page">
            <chat-head @goBack="goBack" @goDetail="onGoDetail"
                       :title="title" :titleExt="titleExt" :titleExtIco="titleExtIco"
                       :chatType="urlParams.chatType"></chat-head>
            <chat-panel ref="msgPanel" :computeScroll="computeScroll"
                        :isTalkInfoInit="isTalkInfoInit"
                        :chatType="urlParams.chatType" :orgUserData="orgUserData"
                        :nickDataDict="nickDataDict" :showNick="showNick"
                        @avatarClick="onAvatarClick"
                        @forward="onForward"
                        @revert="onRevert"
                        @refreshOrgUserData="onRefreshOrgUserData"
                        @groupNameChange="onGroupNameChange"
                        @click.native="panelClick"/>
            <input-box
                ref="inputBox"
                v-show="hasWriteRight"
                @emojiClick="emojiClick"
                @moreClick="moreClick"
                @voiceIconClick="voiceIconClick"
                @keyboardClick="keyboardClick"
                @rightKeyboardClick="rightKeyboardClick"
                @voiceTouchStart="voiceTouchStart"
                @voiceTouchMove="voiceTouchMove"
                @voiceTouchEnd="voiceTouchEnd"
                @inputFocus="inputFocus"
                :inputShow="inputShow"
                :fooderContent="fooderContent"
                @inputResize="onInputResize"
            >
            </input-box>
            <transition name="fade">
                <div class="chat-footer" v-if="fooderShow">
                    <full-page-slide
                        :fooderContent="fooderContent"
                        @moreItemClick="moreItemClick"
                        @emoticonSelected="emoticonSelected"
                    />
                </div>
            </transition>
            <mask-out v-if="maskOutShow">
                <div class="recording-cancel" v-if="cancelVoice">
                    <div class="cancel-inner"></div>
                    <p>松开手指,取消发送</p>
                </div>
                <div class="recording-voice" v-else>
                    <div class="voice-inner">
                        <div class="voice-icon"></div>
                        <!--<div class="voice-volume">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>-->
                    </div>
                    <p>手指上划,取消发送</p>
                </div>
            </mask-out>
        </div>
        <popup v-model="showChatDetail" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <chat-detail ref="chatDetail" :urlParams="urlParams" :dataReady="detailDataReady"
                         :title="detailTitle" :titleExt="titleExt" :titleExtIco="titleExtIco"
                         :orgUserData="orgUserData"
                         @backChat="showChatDetail = false" @onAvatarClick="onAvatarClick2"
                         @onChangeTitleExt="onChangeTitleExt"
                         @showNick="onShowNickChange" @alertStateChange="onAlertStateChange"
            ></chat-detail>
        </popup>
        <org-member-detail
            :memberCardUrl="orgMemberCardUrl"
            :showDetail="showOrgMemberDetail"
            :ownCardUrl="selfCardUrl"
            :replaceChat="true"
            @hideDetail="showOrgMemberDetail = false"
        ></org-member-detail>
        <popup v-model="showForwarder" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <forwarder :message="forwardMessage" @hideForwarder="showForwarder = false"></forwarder>
        </popup>
        <explorer-picker :showCabinets="showExplorerPicker" :companyId="companyId" @picked="onFilePicked" @goBack="showExplorerPicker = false"></explorer-picker>
    </div>
</template>
<script>
    import { Popup } from 'vux'
    import ChatHead from './ChatHead'
    import ChatPanel from './ChatPanel'
    import InputBox from './InputBox'
    import FullPageSlide from './FullPageSlide'
    import MaskOut from './MaskOut'
    import ChatDetail from './chatDetails/ChatDetails'
    import Forwarder from './Forwarder'
    import OrgMemberDetail from "../../components/orgmemberpicker/OrgMemberDetail"
    import ExplorerPicker from '../../components/explorer/ExplorerPicker'
    import { mapState, mapMutations } from 'vuex'
    import { isWeiXin, isMhApp, Z_IsEmpty20, Z_IsEmpty, formatFileSize } from '../../utils/fn'
    import Qs from 'qs'
    import {
        getWXLocationHX,
        getQMapLocation,
        getChatVoiceImgParam,
        touchstartUploadVoice,
        touchendUploadVoice,
        touchcancleuploadVoice,
        startuploadImg
    } from '../../utils/wx'
    import Uploader from '../../utils/upload'
    import dataHandler from './data-handler'
    import ChatInfo from '../../utils/chatInfo'

    const preventContextMenu = function (event) {
        var s2 = document.querySelector('#chat_message2');
        if (s2 && s2.contains(event.target)) {
            return;
        }
        event.preventDefault();
    }

    export default {
        name: 'Chat',
        components: {
            Popup,
            ChatHead,
            ChatPanel,
            InputBox,
            FullPageSlide,
            MaskOut,
            ChatDetail,
            Forwarder,
            OrgMemberDetail,
            ExplorerPicker
        },
        data() {
            return {
                isTalkInfoInit: false,
                // 标题相关
                title: '',
                detailTitle: '',
                titleExt: '',
                titleExtIco: '',
                // 聊天相关
                urlParams: {},
                hasReadRight: false,
                hasWriteRight: false,
                // 键盘相关
                fooderShow: false,
                computeScroll: false,
                fooderContent: '',
                inputContent: '',
                inputLeft: '',
                inputShow: true,
                emojiIconShow: true,
                maskOutShow: false,
                cancelVoice: false,
                clienY: 0,
                // 相关数据
                orgUserData: {},
//                isOrgUserDataLoading: false,
                // 详细页面
                showChatDetail: false,
                selfCardUrl: PSMU ? PSMU['chatInfo'] ? PSMU.chatInfo.getSelf() : '' : '',
                // 用户详细
                detailDataReady: false,
                orgMemberCardUrl: '',
                personalDetails: {},
                showOrgMemberDetail: false,
                // 转发页面
                showForwarder: false,
                forwardMessage: null,
                // 服务号
                companyInfoList: [],
                // 用户设定
                nickDataDict: {},
                showNick: false,
                // 文件选择
                showExplorerPicker: false
            }
        },
        computed: {
            ...mapState({
                wxLocationStatus: state => state.wx.wxLocationStatus,
                wxLocation: state => state.wx.wxLocation,
                wxUploadVoiceStatus: state => state.wx.wxUploadVoiceStatus,
                wxUploadVoice: state => state.wx.wxUploadVoice,
                wxUploadImageStatus: state => state.wx.wxUploadImageStatus,
                wxUploadImage: state => state.wx.wxUploadImage
            })
        },
        watch: {
            wxLocationStatus(st) {
                console.log('watch wxLocationStatus status', st)
                switch (st) {
                    case 'prepar':
//                        this.disableKeyboard()
                        break
                    case 'success':
                        console.log('get location success', this.wxLocation)
                        if (!Z_IsEmpty20(this.wxLocation) && this.wxLocation.latitude && this.wxLocation.longitude) {
                            PSMU.chatInfo.sendLocation(this.wxLocation.latitude, this.wxLocation.longitude, this.wxLocation.addr || null)
                        }
                        break
                    case 'failed':
                        // this.enableKeyboard()
                        break
                }
            },
            wxUploadVoiceStatus(st) {
                console.log('watch wxUploadVoiceStatus status', st)
                switch (st) {
                    case 'prepar':
//                        this.disableKeyboard()
                        break
                    case 'success':
                        // todo sth
                        console.log('upload voice success', this.wxUploadVoice)
                        // this.enableKeyboard()
                        break
                    case 'failed':
                        // this.enableKeyboard()
                        break
                    case 'complete':
                        // sth other
                        break
                }
            },
            wxUploadImageStatus(st) {
                console.log('watch wxUploadImageStatus status', st)
                switch (st) {
                    case 'prepar':
//                        this.disableKeyboard()
                        break
                    case 'loading':
//                        this.disableKeyboard()
                        break
                    case 'success':
                        console.log('upload image success', this.wxUploadImage)
                        // this.enableKeyboard()
                        break
                    case 'failed':
                        // this.enableKeyboard()
                        break
                    case 'canceled':
                        // this.enableKeyboard()
                        break
                }
            }
        },
        mounted() {
            this.getParams()
            this.initChat()

            // 聊天详情标题
            if (this.urlParams.chatType === "ORG" || this.urlParams.chatType.toUpperCase() === "GROUP") {
                this.detailTitle = '群聊信息'
            } else {
                this.detailTitle = this.title
            }

            /*// 内部群获取组织成员数据
            if (this.urlParams.chatType === 'ORG') {
                this.getProcessedOrgRoleUser()
            }*/
        },
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建

            PSMU.debug("chat vue beforeRouteEnter")

            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.setMode(false)

                // 禁用右键菜单
                document.addEventListener('contextmenu', preventContextMenu, false);
            })
        },
        beforeRouteUpdate (to, from, next) {
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
            // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
            PSMU.debug("chat vue beforeRouteUpdate")
            next()
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            PSMU.debug("chat vue beforeRouteLeave")
            this.setMode(true)
            PSMU.clean();

            // 恢复右键菜单
            document.removeEventListener('contextmenu', preventContextMenu);

            // 销毁dataHandler
            dataHandler.destroy()

            next()
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            // 聊天功能
            initChat() {
                let chatInfo = new ChatInfo.ChatInfo()
                // 初始化聊天信息
                chatInfo.init(this.urlParams).then(() => {
                    this.isTalkInfoInit = true

                    let talkInfo = chatInfo.getTalkInfo()
                    let did = this.urlParams.did
                    let chatType = chatInfo.getChatType()
                    let cardUrl = chatInfo.getSelf()
                    let companyId = chatInfo.getCompanyId()

                    this.selfCardUrl = cardUrl

                    // 初始化数据
                    dataHandler.init(did, chatType, cardUrl, companyId).then(() => {
                        // 群聊昵称显示
                        if (chatType === 'ORG' || chatType.toUpperCase() === 'GROUP') {
                            this.nickDataDict = dataHandler.nickDataDict

                            if (dataHandler.myNickData && dataHandler.myNickData['isShow'] === 'true') {
                                this.showNick = true
                            } else {
                                this.showNick = false
                            }
                        }

                        // 内部群数据
                        if (chatType === 'ORG') {
                            this.orgUserData = dataHandler.orgUserDataDict
                        }

                        // 免打扰标识
                        this.titleExtIco = dataHandler.alertState === "false" ? 'icon-iconfontbell1' : '';

                        // 加载额外数据
                        dataHandler.initExtra().then(() => {
                            this.detailDataReady = true
                        }).catch(() => {
                            console.error('dataHandler initExtra error')
                            this.bottomToast('网络不稳定')
                        })
                    }).catch(() => {
                        console.error('dataHandler init error')
                        this.bottomToast('网络不稳定')
                    })

                    // 标题
                    if (chatType === 'chat' || chatType === 'IM') {
                        let otherCardUrl = talkInfo.murl === talkInfo.cardUrl ? talkInfo.cardUrlPeer : talkInfo.cardUrl
                        dataHandler.getCardInfo(otherCardUrl).then(cardInfo => {
//                            console.log('get title CardInfo', cardInfo, cardInfo.RealName)
                            this.title = cardInfo.RealName
                        }).catch(() => {
                            console.error('getCardInfo error')
                            this.bottomToast('网络不稳定')
                        })
                    } else if (chatType.toUpperCase() === 'GROUP' || chatType === 'ORG') {
                        this.title = talkInfo.oTitle
//                        this.title = '群聊信息'
//                        _this.titleExt = '(' + talkInfo.userCount + ')'
                    }

                    // 读写权限
                    if (chatType === 'chat' || chatType === 'IM') {
                        this.hasReadRight = true
                        if (!(chatType === 'IM' && this.isTalkDismiss(talkInfo))) {
                            this.hasWriteRight = true
                        }
                    } else if (chatType.toUpperCase() === 'GROUP' || chatType === 'ORG') {
                        if (talkInfo.inChat === 'true') {
                            this.hasReadRight = true
                            this.hasWriteRight = true
                        } else {
                            this.bottomToast('你已被移除出群')
                        }
                    }
                    // isHis模式 todo

                    // 初始pc上传组件
                    if (!isWeiXin() && !isMhApp()) {
                        this.initPCUploader()
                    }

                    // 加载初始消息
                    this.$nextTick(() => {
                        this.$refs.msgPanel.onPullingDown()
                    })
                }).catch(err => {
                    this.$router.go(-1)
                    this.bottomToast('进入聊天失败，请稍后重试')
                    console.error('chatinfo init error', err)
                    PSMU.error(err)
                })
            },
            onChangeTitleExt(val) {
                this.titleExt = `(${val})`;
            },
            onShowNickChange(showNick) {
                console.log('onNickChange', showNick)
                this.showNick = showNick
            },
            onAlertStateChange(alertState) {
                console.log('alertStateChange', alertState)
                this.titleExtIco = alertState ? '' : 'icon-iconfontbell1'
            },
            onGroupNameChange(groupName) {
                // 修改群昵称显示
                this.title = groupName
            },
            onRefreshOrgUserData() {
                if (dataHandler.hasInit) {
                    dataHandler.refreshOrgUserData().then(() => {
                        this.orgUserData = dataHandler.orgUserDataDict
                    }).catch(() => {
                        this.bottomToast('网络异常')
                    })
                }
            },
            onAvatarClick($event, message) {
                // 跳转用户详情
                console.log('onAvatarClick', message)
                let cardUrl = message.sender
                this.goUserDetail(cardUrl)
            },
            onAvatarClick2($event, cardUrl) {
                console.log('onAvatarClick2', cardUrl)
                this.goUserDetail(cardUrl)
            },
            onGoDetail() { // 跳转聊天菜单
                if (!this.detailDataReady) {
                    this.bottomToast('网络不稳定')
                    return;
                }
                this.showChatDetail = true
            },
            goUserDetail(itemCardUrl) {
                if (this.urlParams.chatType === "ORG") {
                    let personalDetails = this.orgUserData[itemCardUrl];
                    if (personalDetails) {
                        this.orgMemberCardUrl = itemCardUrl
                        this.personalDetails = personalDetails
                        this.showOrgMemberDetail = true
                    }
                } else {
                    this.$router.push({
                        name: "cardDetails",
                        query: { cardUrl: itemCardUrl }
                    })
                }
            },
            onForward(message) {
                this.forwardMessage = message
                this.showForwarder = true
            },
            onRevert(message) {
                let infoStr = 'Z_CHAT_CANCLE_INFO_MSG' + PSMU.chatInfo.getSelf() + '|' + PSMU.chatInfo.getVal('nick') + '|撤回了一条消息'
                let pData = { mid: message.mid, infoStr: infoStr, did: PSMU.chatInfo.getDid(), type: PSMU.chatInfo.getChatType() }
                let companyId = PSMU.chatInfo.getCompanyId()
                if (companyId !== null && companyId !== 'false') {
                    pData['companyId'] = companyId
                }

                let url = '/NCard/NCardService?ac=cancelMsg'
                this.$httpSilent.post(url, Qs.stringify(pData)).catch(err => {
                    console.error(err)
                })
            },
            goBack() {
                window.stop ? window.stop() : document.execCommand("Stop");
                this.$router.go(-1)
            },
            // 键盘处理
            inputFocus() {
               this.fooderShow = false
               this.fooderContent = 'keyborad'
               this.computeScroll = !this.computeScroll
            },
            panelClick() {
                if (this.fooderShow) {
                    this.fooderShow = false
                    this.fooderContent = ''
                    this.computeScroll = !this.computeScroll
                }
            },
            emojiClick() {
                !this.fooderShow && (this.computeScroll = !this.computeScroll)
                this.fooderShow = true
                this.fooderContent = 'emoji'
                this.inputShow = true
            },
            emoticonSelected(type, name) {
                console.log('emoticonSelected', type, name)
                // 大表情发送
                if (!Z_IsEmpty20(type) && !Z_IsEmpty20(name)) {
                    PSMU.chatInfo.sendEmoticon(type, name)
                }
            },
            moreClick() {
                !this.fooderShow && (this.computeScroll = !this.computeScroll)
                this.inputShow = true
                if (this.fooderContent !== 'more') {
                    this.fooderShow = true
                    this.fooderContent = 'more'
                } else {
                    this.fooderShow = false
                    this.fooderContent = ''
                }
                !this.fooderShow && (this.computeScroll = !this.computeScroll)
            },
            moreItemClick(type) {
                console.log('moreItemClick', type)
                switch (type) {
                    case 'location':
                        if (isWeiXin() || isMhApp()) {
                            getWXLocationHX()
                        } else {
                            getQMapLocation()
                        }
                        break
                    case 'image':
                        if (isWeiXin() || isMhApp()) {
                            startuploadImg(getChatVoiceImgParam(
                                PSMU.chatInfo.getDid(), PSMU.chatInfo.getChatType(), PSMU.chatInfo.getCompanyId()), 9)
                        } else {
                            Uploader.prepareUpload.bind(this)()
                        }
                        break
                    case 'filebox':
                        this.showExplorerPicker = true
                        break
                    default:
                        console.log('not support more item', type)
                }
            },
            onFilePicked(fileList) {
                // 选中文件柜文件
                if (!fileList || fileList.length === 0) {
                    this.bottomToast('文件发送失败')
                    return
                }
                console.log('onFilePicked', fileList)

                this.showExplorerPicker = false

                fileList.forEach(file => {
                    let fileType = file.fileType
                    if (fileType === 'image') {
                        // 图片转图片消息
                        let filePath = file.source.filePath
                        if (!Z_IsEmpty20(filePath)) {
                            PSMU.chatInfo.sendImage(filePath)
                        }
                    } else {
                        // 其他文件发链接消息
                        let fileTypeImg
                        switch (fileType) {
                            case 'doc':
                                fileTypeImg = "/ZingVue/static/images/explorer/word.png";
                                break
                            case 'pdf':
                                fileTypeImg = "/ZingVue/static/images/explorer/pdf.png";
                                break
                            case 'ppt':
                                fileTypeImg = "/ZingVue/static/images/explorer/ppt.png";
                                break
                            case 'xls':
                                fileTypeImg = "/ZingVue/static/images/explorer/excel.png";
                                break
                            case 'txt':
                                fileTypeImg = "/ZingVue/static/images/explorer/txt.png";
                                break
                            default:
                                fileTypeImg = "/ZingVue/static/images/explorer/other.png";
                        }
                        let filePath = file.source.filePath
                        let title = file.source.title
                        let content = formatFileSize(file.source.fileSize)
                        let fileId = file.source.fileId
                        let sourceType = 'explorer'
                        PSMU.chatInfo.sendLinkCard(filePath, title, content, fileTypeImg, sourceType, fileId)
                    }
                })
            },
            voiceIconClick() {
                this.fooderShow && (this.computeScroll = !this.computeScroll)
                this.fooderShow = false
                this.inputShow = false
                this.fooderContent = 'keyborad'
            },
            keyboardClick() {
                !this.fooderShow && (this.computeScroll = !this.computeScroll)
                this.inputShow = true
            },
            rightKeyboardClick() {
                this.fooderShow = false
                this.fooderContent = ''
                this.inputShow = true
                this.computeScroll = !this.computeScroll
            },
            voiceTouchStart(e) {
                if (isWeiXin() || isMhApp()) {
                    this.maskOutShow = true
                    this.clientY = e.touches[0].clientY

                    // 开始录音
                    touchstartUploadVoice()
                } else {
                    this.bottomToast('pc端暂不支持录音')
                }
            },
            voiceTouchMove(e) {
                if (isWeiXin() || isMhApp()) {
                    if (e.touches[0].clientY - this.clientY < -50) {
                        this.cancelVoice = true
                    } else {
                        this.cancelVoice = false
                    }
                }
            },
            voiceTouchEnd() {
                if (isWeiXin() || isMhApp()) {
                    if (this.cancelVoice) {
                        // 取消录音
                        touchcancleuploadVoice()
                    } else {
                        // 停止并上传录音
                        touchendUploadVoice(getChatVoiceImgParam(
                            PSMU.chatInfo.getDid(), PSMU.chatInfo.getChatType(), PSMU.chatInfo.getCompanyId()))
                    }

                    this.cancelVoice = false
                    this.maskOutShow = false
                }
            },
            onInputResize() {
                this.computeScroll = !this.computeScroll
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
            // 文件上传
            initPCUploader() {
                let _this = this
                let url = '/zingbiz/common/UploadFile/uploadChatFile'
                if (!Z_IsEmpty20(PSMU.chatInfo.getCompanyId())) {
                    url += '?companyId=' + PSMU.chatInfo.getCompanyId()
                }
                Uploader.init({
//                    uploaderSwfPath:
//                        "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
                    uploaderServer: url,
                    folderPath: "",
                    imageOnly: true,
                    onUploadStart: function(isError, refs) {
                        /*if (isError === true) {
                        } else {
                            //showBottomPrompt("正在上传请稍后")
                        }*/
                    },
                    onMessage: function(msg, refs) {
                        console.log(msg);
                        // _this.bottomToast(msg)
                    },
                    onServerFailed: function(msg, refs) {
                        //hideBottomPrompt();
                        console.error(msg);
                        _this.bottomToast(msg)
                    },
                    onServerSuccess: function(data, refs) {
                        let relativePath = data.data.relativePath
                        console.log('upload image success', relativePath)
                        // pc 发送图片消息
                        if (!Z_IsEmpty20(relativePath)) {
                            PSMU.chatInfo.sendImage(relativePath)
                        }
                    }
                })
            },
            // 工具方法
            isTalkDismiss (talkInfo) {
                return Z_IsEmpty(talkInfo) || Z_IsEmpty(talkInfo.servIp) || Z_IsEmpty(talkInfo.servIp) ||
                    talkInfo.servIp === 'null' || (!Z_IsEmpty(talkInfo.isTalkDismiss) && talkInfo.isTalkDismiss === 'true')
            },
            getParams() {
                this.urlParams = this.$route.query

                /*正式使用后启用*/
                /*if (!this.urlParams.hasOwnProperty("flag") || this.urlParams.flag !== 'goChat' ) {
                 this.$router.push({
                 path: '/'
                 })
                 }*/
            },
            // 即将删除的
            /*getCardInfo(cardUrl) {
             return new Promise((resolve, reject) => {
             let url = '/ZingMH/ZDesk/MENHUWX/MHUser/showCard.action'
             let params = { cardUrl: cardUrl }
             this.$httpSilent.post(url, Qs.stringify(params)).then(res => {
             let cardObj = res.data
             if (!Z_IsEmpty(cardObj.Items) && cardObj.Items.length > 0) {
             let cardInfo = cardObj.Items[0];
             resolve(cardInfo)
             }
             }).catch(error => {
             console.error(error)
             reject(error)
             })
             })

             },*/
            /*getProcessedOrgRoleUser () {
                if (this.isOrgUserDataLoading) return
                this.isOrgUserDataLoading = true
                let url = '/ZingMH/ZDesk/MENHUWX/MHHelper/getProcessedOrgRoleUser.action'
                var params = { 'type': 'user' }
                this.$httpSilent.post(url, Qs.stringify(params)).then(res => {
                    if (res.data && res.data.success && !Z_IsEmpty(res.data.data) && !Z_IsEmpty(res.data.data.users)) {
                        this.orgUserData = res.data.data.users
                    } else {
                        console.error('getProcessedOrgRoleUser error', res)
                    }
                    this.isOrgUserDataLoading = false
                }).catch(err => {
                    console.error(err)
                    this.isOrgUserDataLoading = false
                })
            },*/
            /*loadCompanys () {
                let url = '/ZingMH/ZDesk/myGroup/loadCompanys.action'
                this.$httpSilent.post(url, {}).then(res => {
                    this.companyInfoList = res.data
                })
            },
            getChatNicknameSetting () {
                let url = '/ZingMH/ZDesk/myCustom/getChatNickname.action'
                let params = {
                    chatId: PSMU.chatInfo.getDid()
                }
                this.$httpSilent.post(url, Qs.stringify(params)).then(res => {
                    this.nickDataDict = res.data.data.data.reduce((dict, data) => {
                        dict[data.cardUrl] = data
                        return dict
                    }, {})
                    console.log('getChatNickname', this.nickDataDict, PSMU.chatInfo.getSelf(), this.nickDataDict[PSMU.chatInfo.getSelf()])
                    if (this.nickDataDict[PSMU.chatInfo.getSelf()]) {
                        this.showNick = this.nickDataDict[PSMU.chatInfo.getSelf()].isShow === 'true'
                    } else {
                        this.showNick = false
                    }
                })
            },*/
            /*// 获取消息提示设置
            getMessageFree() {
                let paramsMess = { tarId: PSMU.chatInfo.getDid() };
                let urlMessageFree = `/ZingMH/ZDesk/Message/free/getMessageFree.action`;
                this.$httpSilent.post(urlMessageFree, Qs.stringify(paramsMess)).then(res => {
                    if (res.data.success && res.data.data && res.data.data.length > 0) {
                        let { alertState } = res.data.data[0];
                        console.log('getMessageFree', alertState)
                        this.titleExtIco = alertState === "false" ? 'icon-iconfontbell1' : '';
                    }
                })
            },*/
            /*detailInit(flag) {
             if (!flag) this.bottomToast('网络异常')
             },*/
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .chat-page-wrapper
        position relative
        width: 100%
        height: 100%
        user-select: none
    .chat-page
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%
        background: #eee;
        z-index: 501;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        flex-center(column, flex-start, flex-start)
        .recording-voice
            p
                position relative
                margin-bottom 8px
                padding 5px 3px
                z-index 9999
            .voice-inner
                display flex
                justify-content center
                align-items center
                height 110px
            .voice-icon
                width 90px
                height 90px
                background url(../../../../static/images/recording-voice.gif) no-repeat center center
                background-size contain
            .voice-volume
                width 30px
                height 55px
                margin-left: 6px
                span
                    display block
                    height 2px
                    margin-top 4px

                    float left
                    clear both
                    animation-iteration-count infinite
                    animation-timing-function linear
                    animation-duration 2000ms
                    background-color #e4e4e5
                    &:nth-child(1)
                        width 24px
                        visibility hidden
                    &:nth-child(2)
                        width 22px
                    &:nth-child(3)
                        width 20px
                    &:nth-child(4)
                        width 18px
                    &:nth-child(5)
                        width 16px
                    &:nth-child(6)
                        width 14px
                    &:nth-child(7)
                        width 12px
                    &:nth-child(8)
                        width 10px
                    &:nth-child(9)
                        width 8px
        .recording-cancel
            p
                position relative
                margin-bottom 8px
                padding 5px 3px
                border-radius 3px
                background-color #a13536
                z-index 9999
            .cancel-inner
                width 110px
                height 110px
                margin 0 auto
                background-image url(../../../../static/images/record-cancel.png)
                background-repeat no-repeat
                background-position center center
                background-size contain
        .chat-footer
            position: relative
            height: 34%
            width: 100%
            overflow: hidden
            transition: all .3s
            &.fade-enter-active, &.fade-leave-active
                transition: height .3s
            &.fade-enter, &.fade-leave-to
                height: 0

    .router-show-enter-active, .router-show-leave-active
        transition: all .3s

    .router-show-enter, .router-show-leave-active
        transform: translateX(100%)

    .btn
        border: 1px solid red
</style>
