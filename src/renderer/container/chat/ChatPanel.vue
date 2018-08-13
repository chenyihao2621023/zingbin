<template>
    <div class="chat-panel">
        <div class="message-list">
            <scroll
                ref="scroll"
                :refreshDelay="2000"
                :scrollbar="true"
                :scrollEnd="scrollEnd"
                :isPullingDown="true"
                :data="messageData"
                :computeScroll="computeScrollInner"
                :pullDownRefresh="{ threshold: 90, stop: 40 }"
                :listenScroll="true"
                @pullingDown="onPullingDown"
                @scroll="onScroll"
            >
                <div class="message-temp"></div>
                <message v-for="(message, index) in messageData" :key="message.id"
                         :message="message" :timeSeed="timeSeed"
                         :showNick="showNick"
                         @avatarClick="onAvatarClick"
                         @messageClick="onMessageClick" @messageLongPress="onMessageLongPress" v-audio-control/>
            </scroll>
        </div>
        <previewer :list="imagePreviewList" ref="previewer" ></previewer>
        <popup v-model="showPositionPopup" position="right" width="100%" :popup-style="{'overflow': 'hidden'}">
            <loc-head title="位置信息" @goBack="hidePositionPopup" :has-detail="false"
                      style="position: absolute; top: 0; z-index: 10000;"></loc-head>
            <iframe width="100%" height="100%" frameborder="0" scrolling="no" :src="positionSrc"></iframe>
        </popup>
        <actionsheet v-model="showMessageActionSheet" :menus="messageMenuData" theme="android"
                     @on-click-menu="messageMenuAction"></actionsheet>
        <div class="clipboard-wrapper">
            <textarea class="clit-text">{{clipText}}</textarea>
            <button class="clip-btn" data-clipboard-target=".chat-panel .clit-text"></button>
        </div>
    </div>
</template>

<script>
    import { Previewer, Popup, Actionsheet  } from 'vux'
    import Message from './Message'
    import Scroll from 'components/scroll/Scroll'
    import AudioControl from '../../directives/audiocontrol/audio-control'
    import { getQMapLocationSrc } from '../../utils/wx'
    import ChatHead from './ChatHead'
    import { dateFormat, Z_BuildDate } from '../../utils/date'
    import { addTypeCache, Z_IsEmpty20, createId, getImageUrl } from '../../utils/fn'
    import ClipboardJS from 'clipboard'

    // 时间信息会动态更新，目前暂定为300s更新一次
    const initialTime = new Date()
//    console.log('initial timeSeed', dateFormat(initialTime))

    const seedDelay = 300 * 1000
    let intervalFunc
    // 撤回消息的限制时间
    const cancelTimeInterval = 2 * 60 * 1000
    // 时间信息显示间隙时间
    const messageTimeInterval = 2 * 60 * 1000
    // 剪贴板
    let clipboard
    // 长按菜单
    const messageMenu = [
        {
            value: 'copy',
            label: '复制',
            isDisable: function (message) {
                if (!ClipboardJS.isSupported()) return true
                return message.contentType !== PSMU.contentType.text
            }
        },
        {
            value: 'forward',
            label: '转发',
          isDisable: function (message) {
            return (message.contentType === PSMU.contentType.voice || message.contentType === PSMU.contentType.location)
          }
        },
        {
            value: 'revert',
            label: '撤回',
            isDisable: function (message) {
                let self = message.sender === PSMU.chatInfo.getSelf() || message.nf === PSMU.chatInfo.getSelf()
                console.log('isDisable', !self, message)
                return !self
            }
        }
    ]

    import orgDataHandler from '../../components/orgmemberpicker/orgDataHandler'

    export default {
        name: 'ChatPanel',
        components: {
            Previewer,
            Popup,
            Actionsheet,
            'loc-head': ChatHead,
            Scroll,
            Message
        },
        directives: {
            AudioControl
        },
        props: {
            computeScroll: {
                type: Boolean
            },
            chatType: {
                type: String
            },
            orgUserData: {
                type: Object
            },
            showNick: {
                type: Boolean
            },
            nickDataDict: {
                type: Object,
                default() {
                    return {}
                }
            },
            isTalkInfoInit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 滚动条
                scrollEnd: true,
                lastMaxScroll: NaN,
                lastElement: null,

                messageInitial: true,
                messageData: [],
                computeScrollInner: false,
//                receiveMsg: {},
                previewerOptions: {
                    getThumbBoundsFn (index) {
                        // find thumbnail element
                        let thumbnail = document.querySelectorAll('.message .image > img')[index]
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
                },
                showPositionPopup: false,
                positionSrc: '',
                messageMenuData: {},
                menuMessage: null,  // 当前菜单对应的消息
                showMessageActionSheet: false,
                // 时间处理
                timeSeed: initialTime,
                earliestMessageTime: dateFormat(initialTime),
                latestMessageTime: dateFormat(initialTime),
                earliestMessage: null,
                // 剪贴板内容
                clipText: '',
                // 长按操作消息
                handelMessage: {},
                // 公司数据
                orgRoleUserDict: {}
            }
        },
        computed: {
            imagePreviewList() {
                return this.messageData.filter(message => message.contentType === PSMU.contentType.image).map(message => {
                    return { src: message.msg, id: message.id }
                })
            }
        },
        watch: {
            computeScroll (val) {
                this.computeScrollInner = val
            },
            orgUserData: {
                handler(userData) {
                    console.log('orgUserData has update', this.orgUserData)
                    this.messageData.forEach((message, idx) => {
                        if (!message.avatar && message.contentType !== PSMU.contentType.date && message.contentType !== PSMU.contentType.changeOver) {
                            if (this.orgUserData[message.sender] || this.orgUserData[message.nf]) {
//                                console.log('update message head', message, idx)
                                this.fillUserHead(message)
                                this.$set(this.messageData, idx, JSON.parse(JSON.stringify(message)))
                            } else {
                                // 没有找到用户信息，填充card头像
                                this.fillUserHeadWithCardHead(message)
                                this.$set(this.messageData, idx, JSON.parse(JSON.stringify(message)))
                            }
                        }
                    })
                },
                deep: true
            },
            showNick(v) {
                if (v) {
                    // 检查并填补用户自设昵称
                    this.messageData.forEach((message, idx) => {
                        if (message.contentType !== PSMU.contentType.date && message.contentType !== PSMU.contentType.changeOver) {
                            let nickData = this.nickDataDict[message.sender]
                            if (nickData && message.nick !== nickData.nickname) {
                                message.nick = nickData.nickname
                                this.$set(this.messageData, idx, JSON.parse(JSON.stringify(message)))
                            } else if (this.chatType === 'ORG' && this.orgUserData[message.sender]) {
                                // message.nick = this.orgUserData[message.sender].userName
                                message.nick = this.orgUserData[message.sender].RealName
                                this.$set(this.messageData, idx, JSON.parse(JSON.stringify(message)))
                            }/* else if (this.chatType === 'ORG' && PSMU.chatInfo.getDid().indexOf('zspallusers') !== -1) {

                            }*/
                        }
                    })
                }
            },
            isTalkInfoInit(v) {
                /*if (v && this.chatType === 'ORG' && PSMU.chatInfo.getDid().indexOf('zspallusers') !== -1) {
                    orgDataHandler.getOrgRoleUser(PSMU.chatInfo.getCompanyId()).then(orgRoleUser => {

                    })
                }*/
            }
            /* watch不到大量的瞬时变动
            receiveMsg: {
                handler(val) {
                    console.log('receiveMsg', val)

                },
                deep: true
            },*/
        },
        mounted() {
            let that = this
            $(document).on(PSMU.REV_MSG, (evt, revMsg) => {
//                PSMU.debug("ChatPanel rev msg", revMsg)
//                that.receiveMsg = revMsg

                // 过滤不正常的消息
                if (revMsg.contentType !== PSMU.contentType.changeOver &&
                    revMsg.contentType !== PSMU.contentType.emoticon &&
                    revMsg.contentType !== PSMU.contentType.image &&
                    revMsg.contentType !== PSMU.contentType.linkCard &&
                    revMsg.contentType !== PSMU.contentType.location &&
                    revMsg.contentType !== PSMU.contentType.text &&
                    revMsg.contentType !== PSMU.contentType.voice) {

                    PSMU.error("error contentType", revMsg)
                    return
                }

                // 特殊消息处理
                if (revMsg.contentType === PSMU.contentType.changeOver) {
                    // 监听群聊名称修改
                    if (revMsg.msg.match(/^.+把群名改为'(.+)'$/)) {
                        let mt = revMsg.msg.match(/^.+把群名改为'(.+)'$/)
                        console.log('revMsg title change', mt[1])
                        let newTitle = mt[1]
                        this.$emit('groupNameChange', newTitle)
                    }

                    // 自己发的撤回忽略，处理撤回时显示了，仅非历史消息
                    if (revMsg.msg === '你撤回了一条消息' && revMsg.nf === PSMU.chatInfo.getSelf()) {
                        return
                    }
                }

                if (revMsg.msg) {
                    this.fillUserHead(revMsg)
                    this.fillNick(revMsg)
                    // console.log('moreThanChatTimeXmin', that.latestMessageTime, that.moreThanChatTimeXmin(that.latestMessageTime, revMsg.msgTime, messageTimeInterval))
                    if (that.moreThanChatTimeXmin(that.latestMessageTime, revMsg.msgTime, messageTimeInterval)) {
                        that.latestMessageTime = revMsg.msgTime
                        let infoMsg = {
                            id: 'time' + createId(),
                            contentType: PSMU.contentType.date,
                            msg: Z_BuildDate(revMsg.msgTime)
                        }
                        that.messageData.push(infoMsg)
                    }
                    that.messageData.push(revMsg)
                }
            });
            $(document).on(PSMU.REV_HIS_MSG, (evt, revMsg) => {
//                PSMU.debug("ChatPanel rev his msg", revMsg)
//                that.receiveMsg = revMsg

                // 过滤不正常的消息
                if (revMsg.contentType !== PSMU.contentType.changeOver &&
                    revMsg.contentType !== PSMU.contentType.emoticon &&
                    revMsg.contentType !== PSMU.contentType.image &&
                    revMsg.contentType !== PSMU.contentType.linkCard &&
                    revMsg.contentType !== PSMU.contentType.location &&
                    revMsg.contentType !== PSMU.contentType.text &&
                    revMsg.contentType !== PSMU.contentType.voice) {

                    PSMU.error("error contentType", revMsg)
                    return
                }

                if (revMsg.msg) {
                    this.earliestMessage = revMsg
                    this.fillUserHead(revMsg)
                    this.fillNick(revMsg)

                    let revMsgArr = [revMsg]
//                     console.log('moreThanChatTimeXmin', that.earliestMessageTime, revMsg.msgTime, that.moreThanChatTimeXmin(that.earliestMessageTime, revMsg.msgTime, messageTimeInterval))
                    if (that.moreThanChatTimeXmin(that.earliestMessageTime, revMsg.msgTime, messageTimeInterval)) {
                        that.earliestMessageTime = revMsg.msgTime
                        let infoMsg = {
                            id: 'time' + createId(),
                            contentType: PSMU.contentType.date,
                            msg: Z_BuildDate(revMsg.msgTime)
                        }
//                        console.log('infoMsg', dateFormat(infoMsg.msg))
                        revMsgArr = [infoMsg, revMsg]
                    }
                    if (that.latestMessageTime === dateFormat(initialTime)) {
                        that.latestMessageTime = revMsg.msgTime
                    }
                    that.messageData = [...revMsgArr, ...that.messageData]

                    // that.$refs.scroll.forceUpdate()
                }
            });
            // 顶部消息上方插入时间提示
            $(document).on(PSMU.LOAD_HIS_MSG_END, evt => {
//                PSMU.debug("ChatPanel load his msg end")
                if (that.earliestMessage && that.messageData.length > 0 && that.messageData[0].contentType !== PSMU.contentType.date) {
                    let infoMsg = {
                        id: 'time' + createId(),
                        contentType: PSMU.contentType.date,
                        msg: Z_BuildDate(that.earliestMessage.msgTime)
                    }
                    that.messageData = [infoMsg, ...that.messageData]
                }
                that.earliestMessage = null

                that.$nextTick(() => {
                    if (that.messageInitial) {
                        // that.computeScrollInner = !that.computeScrollInner
                        that.messageInitial = false
                    }

                    // 下拉加载后恢复位置
                    if (that.lastElement) {
                        console.log('scroll to lastElement', that.lastElement)
                        that.$refs.scroll.scroll.scrollToElement(that.lastElement, 0, 0, -500)
                        that.lastElement = null
                    }
                })

                // 恢复记忆位置
                /*if (that.lastMaxScroll) {
                    that.$refs.scroll.scroll.once('refresh', () => {
                        let y = that.$refs.scroll.scroll.maxScrollY - that.lastMaxScroll
                        console.log('revert last scroll', y)
                        setTimeout(() => {
                            that.$refs.scroll.scroll.scrollTo(0, y, 0)
                        }, 2000)
                        that.lastScrollY = NaN
                    })
                }*/

                /*if (that.lastElement) {
                    that.$refs.scroll.scroll.once('refresh', () => {
                        that.$refs.scroll.scroll.scrollToElement(that.lastElement, 0, true, true)
                        that.lastElement = null
                    })
                }*/
            });
            /*document.addEventListener(PSMU.REV_MSG, (evt, revMsg) => {
                console.log('chat panel rev msg', revMsg)
                PSMU.debug('chat panel rev msg', evt, revMsg)
                this.msg = revMsg
            })*/
            // 更新显示时间
            intervalFunc = setInterval(() => {
                that.timeSeed = new Date()
//                console.log('timeSeed update', dateFormat(that.timeSeed))
            }, seedDelay)
            //
            this.$nextTick(() => {
                // 初始化剪贴板
                clipboard = new ClipboardJS('.chat-panel .clip-btn')
                clipboard.on('success', function(e) {
                    // console.info('Action:', e.action)
                    console.info('clipboard coped Text:', e.text)
                    // console.info('Trigger:', e.trigger)
                    e.clearSelection()
                })
                clipboard.on('error', function(e) {
                    console.error('clipboard error')
                    console.error('Action:', e.action)
                    console.error('Trigger:', e.trigger)
                })

                // 反复计算高度
                let computeScroll = () => {
                    this.$refs.scroll.initScroll()
                    this.$nextTick(() => {
                        this.computeScrollInner = !this.computeScrollInner
                    })
                }
//                window.setTimeout(computeScroll, 1000)
                window.setTimeout(computeScroll, 2000)
            })
        },
        destroyed() {
            clearInterval(intervalFunc)
        },
        methods: {
            onScroll(pos) {
//                console.log('onScroll', pos.y, this.$refs.scroll.scroll.maxScrollY)
                if (pos.y === this.$refs.scroll.scroll.maxScrollY) {
                    this.scrollEnd = true
                } else {
                    this.scrollEnd = false
                }
//                console.log('onScroll scrollEnd', this.scrollEnd)
            },
            onPullingDown() {
                if (this._isDestroyed) {
                    return;
                }
                //记忆位置
                // this.lastMaxScroll = this.$refs.scroll.scroll.maxScrollY
                // console.log('remember lastMaxScroll', this.lastMaxScroll)
                let elems = document.querySelectorAll('.message-list .message')
                this.lastElement = elems.length > 1 ? elems[1] : elems.length > 0 ? elems[0] : null
                console.log('remember lastElement', this.lastElement)

                PSMU.chatInfo.loadHisMsg(this);

                /*if (Math.random() > 0.5) {
                    // 如果有新数据
                } else {
                    // 如果没有新数据
                    this.$refs.scroll.forceUpdate();
                }*/
            },
            // 图片查看
            previewImageMessage(message) {
                let id = message.id
                let index = 0
                for (let i = 0; i < this.imagePreviewList.length; i++) {
                    let image = this.imagePreviewList[i]
                    if (image.id === id) {
                        index = i
                        break
                    }
                }
                this.$refs.previewer.show(index)
            },
            // 点击头像
            onAvatarClick($event, message) {
                this.$emit('avatarClick', $event, message)
            },
            // 点击事件
            onMessageClick($event, message) {
                console.log('onMessageClick', message)
                let positionSrc
                switch (message.contentType) {
                    case PSMU.contentType.image:
                        this.previewImageMessage(message)
                        break
                    case PSMU.contentType.location:
                        positionSrc = getQMapLocationSrc({
                            lat: message.lat,
                            lng: message.lng
                        }, '位置信息')
                        console.log('positionSrc', positionSrc)
                        this.positionSrc = positionSrc
                        this.showPositionPopup = true
                        break
                    case PSMU.contentType.linkCard:
                        location.href = message.link
                        break
                }
            },
            // 长按事件
            onMessageLongPress($event, message) {
                console.log('onMessageLongPress', message)
                if ([PSMU.contentType.text,
                        PSMU.contentType.image,
                        PSMU.contentType.emoticon,
                        PSMU.contentType.linkCard
                    ].indexOf(message.contentType) !== -1) {
                    this.menuMessage = message
                    this.messageMenuData = messageMenu.filter(item => {
                        if (typeof item.isDisable === 'function' && item.isDisable(message)) {
                            return false
                        }
                        return true
                    }).reduce((ret, item) => {
                        ret[item.value] = item.label
                        return ret
                    }, {})
                    this.clipText = message.msg
                    this.handelMessage = message
                    // console.log('messageMenuData', this.messageMenuData)
                    this.showMessageActionSheet = true
                } else if (message.contentType === PSMU.contentType.location || message.contentType === PSMU.contentType.voice) {
                    // 位置语音消息
                  this.menuMessage = message
                  this.messageMenuData = messageMenu.filter(item => {
                    if (typeof item.isDisable === 'function' && item.isDisable(message)) {
                      return false
                    }
                    return true
                  }).reduce((ret, item) => {
                    ret[item.value] = item.label
                    return ret
                  }, {})

                  this.handelMessage = message
                  this.showMessageActionSheet = true
                }
            },
            hidePositionPopup() {
                this.showPositionPopup = false
            },
            // 长按菜单
            messageMenuAction(key, item) {
                console.log('messageMenuAction', key, item)
                let clipBtn
                let clickEvt
                switch (key) {
                    case 'copy':
                        // 触发复制按钮点击事件
                        clipBtn = document.querySelector('.chat-panel .clip-btn')
                        // console.log('copy', clipBtn)
                        clickEvt = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        })
                        clipBtn.dispatchEvent(clickEvt)
                        break
                    case 'forward':
                        this.$emit('forward', this.handelMessage)
                        break
                    case 'revert':
                        if (this.moreThanChatTimeXmin(this.latestMessageTime, dateFormat(new Date()), cancelTimeInterval)) {
                            this.$vux.toast.show({
                                text: '超过的2分钟的消息不能撤回',
                                type: 'text',
                                position: 'bottom'
                            })
                            return
                        }
                        let message = PSMU.chatInfo.initInfoMessage('你撤回了一条消息')
                        let idx = this.messageData.indexOf(this.handelMessage)
                        console.log('revert message', idx, this.handelMessage, message)
                        this.$set(this.messageData, idx, message)
                        this.$emit('revert', this.handelMessage)
                        break
                    default:
                        console.warn('unsupport message menu', key, item, this.menuMessage)
                }
            },
            moreThanChatTimeXmin(srcTime, destTime, interval) {
                let ds = Z_BuildDate(srcTime)
                let dd = Z_BuildDate(destTime)
                // console.log('ds: ' + ds + ', dd: ' + dd + ' => ' + (Math.abs(dd.getTime() - ds.getTime()) > 1000 * 60 * 5));
                return Math.abs(dd.getTime() - ds.getTime()) > interval
            },
            /*calcTimeSeedOffset(srcTime) {
                let ds = Z_BuildDate(srcTime)
                // console.log('ds: ' + ds + ', dd: ' + dd + ' => ' + (Math.abs(dd.getTime() - ds.getTime()) > 1000 * 60 * 5));
                return this.timeSeed.getTime() - ds.getTime()
            },*/
            fillUserHead(revMsg) {
                let cardUrl = revMsg['sender'] || revMsg.nf
                // 内部群用户头像从组织数据中获取
                if (this.chatType === 'ORG') {
                    // 用户数据还未准备好，准备好后会扫描所有消息
                    if (!this.orgUserData) return
                    if (this.orgUserData[cardUrl]) {
                        let uInfo = this.orgUserData[cardUrl]
                        let msgUserHead = addTypeCache('zIsCacheDirect', uInfo.headImg)
//                        revMsg.avatar = getImageUrl(msgUserHead,'./static/images/userDef_.jpg')
                        revMsg.assign = msgUserHead
                    } else {
                        // 需要更新组织数据 todo
                        PSMU.debug("ChatPanel fillUserHead cardUrl not found", cardUrl, this.orgUserData)
                        this.$emit('refreshOrgUserData')
                    }
                } else {
                    let msgUserHead = !Z_IsEmpty20(cardUrl) && cardUrl.length > 2 && '/checkJpg/' + cardUrl.substring(0, 2) + '/' + cardUrl + '.jpg'
                    msgUserHead = addTypeCache('zIsCacheDirect', msgUserHead)
//                    msgUserHead = getImageUrl(msgUserHead,'./static/images/userDef_.jpg')
                    revMsg.avatar = msgUserHead
                }
//                PSMU.debug("ChatPanel fillUserHead", revMsg)
            },
            fillUserHeadWithCardHead(revMsg) {
                let cardUrl = revMsg.sender
                // 内部群用户头像从组织数据中获取
                let msgUserHead = !Z_IsEmpty20(cardUrl) && cardUrl.length > 2 && '/checkJpg/' + cardUrl.substring(0, 2) + '/' + cardUrl + '.jpg'
                msgUserHead = addTypeCache('zIsCacheDirect', msgUserHead)
                msgUserHead = getImageUrl(msgUserHead,'./static/images/userDef_.jpg')
                if (msgUserHead) {
                    revMsg.avatar = msgUserHead
                }

                PSMU.debug("ChatPanel org user not found, fill with card head", cardUrl)
            },
            fillNick(message) {
                let cardUrl = message.sender || message.nf
                let nickData = this.nickDataDict[cardUrl]
                if (nickData && nickData.nickname) {
                    message.nick = nickData.nickname
                }
            }
        }
    }
</script>
<style lang="stylus">
    .chat-panel
        width: 100%
        // flex: 1
        // overflow: hidden
        flex: auto
        overflow: auto
        position relative
        background-color: #ebebeb
        .message-temp
            height: 10px
        .message-list
            height: 100%
            width: 100%
            overflow: hidden;
            position: relative;
            position: absolute
            left: 0
            top: 0
        .clipboard-wrapper
            width: 1px
            height: 1px
            position: absolute
            left: -1000px
            top: -1000px
</style>

