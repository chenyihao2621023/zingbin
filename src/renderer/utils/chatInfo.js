import Axios from 'axios'
import Qs from 'qs'
import wrapper from './proxy/httpProxy'
import filterXSS from 'xss'
import { addTypeCache, Z_IsEmpty20, mappingChatType } from './fn'
import emoticonData from '../container/chat/emoticon-data'
import { emoji2text, text2imageOld } from '../container/chat/emoji-convertor'

var rootWrapper = {};
/*业务相关与会话对应*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory()
    } else if (root) {
        // Browser globals (root is window)
        rootWrapper.ChatInfo = factory()

    } else {
        rootWrapper.ChatInfo = factory()
    }
}(this, function () {
    return (function () {
        function ChatInfo () {
            this.did = null
            this.chatType = null
            this.companyId = null
            this.talkInfo = null
            this.selfJid = null
            this.hisMsgId = -1
            this.nowMsgTime = 'false'

            this.axiosProxy = null
            this.sendNum = 0//累计发送数量
            this.basePath = '/zingbiz'
            this.url = {
                init: '/NCard/NCardService?ac=loadTalkInfo'
                , history: '/NCard/NCardService'
                , tuid: '/NCard/NCardService?ac=uptuid'
                // , servLog: '/NCard/NCardService?ac=JSLOG'
            }

            this.CHAT_TYPE = {
                GROUP: 'GROUP'
                , chat: 'chat'
                , IM: 'IM'
                , ORG: 'ORG'
            }
        }

        ChatInfo.prototype.getAxios = function () {
            if (this.axiosProxy == null) {
                this.axiosProxy = wrapper(Axios, {})
            }
            return this.axiosProxy
        }
        ChatInfo.prototype.init = function (urlParams = {}) {
            let that = this
            // this.did = urlParams.hasOwnProperty('did') ? urlParams.did : null
            this.chatType = urlParams.hasOwnProperty('chatType') ? urlParams.chatType : null
            this.did = this.initTalkId(this.chatType, urlParams.hasOwnProperty('did') ? urlParams.did : null)
            this.companyId = urlParams.hasOwnProperty('companyId') ? urlParams.companyId : null

            // console.log('init chat info ...', urlParams, this)

            return new Promise((resolve, reject) => {
                if (that.getDid() == null || that.getChatType() == null) {
                    reject(new Error('did or chatType is null'))
                }

                that.getAxios().get(that.url.init, {
                // Axios.get(that.url.init, {
                        isCache: true,
                        params: {did: that.did, type: that.chatType, companyId: that.companyId}
                    }).then(res => {
                        that.talkInfo = res.data
                        that.selfJid = that.getVal('murl')
                        PSMU.tuid = that.getVal('uid')

                        if (PSMU.isEmtVal(that.getVal('servIp')) || PSMU.isEmtVal(that.getDid())) {
                            PSMU.error("initPSM null val ", PSMU.chatInfo);
                            reject(new Error("initPSM null val"))
                        }

                        PSMU.initPSM(that, function (msgStr, id) {
                            // console.log('chatinfo onmessage', msgStr)
                            var jsonMsg = PSMU.parseMsg(msgStr)
                            that.analysisMessage(jsonMsg)
                        }, function (state) {
                            if (state == PStream.OPEN) {
                                PSMU.chatInitOk()
                                // this.sendMsg({operateType:1});
                            } else if (state == PStream.CONNECTING) {

                            } else if (state == PStream.CLOSED) {
                                PSMU.chatClose()
                            }
                        })
                        PSMU.debug('init chat info ', that)
                        resolve()
                    }).catch(err => {
                    reject(new Error("init error"))
                })

                // Axios.get(that.url.init,{ params: {did:that.did,type:that.chatType,companyId:that.companyId}})
                //     .then(function(res) {
                //         that.talkInfo=res.data;
                //         that.selfJid=that.getVal('murl');
                //         PSMU.tuid=that.getVal('uid');
                //         PSMU.initPSM(that, function (msgStr, id) {
                //             var jsonMsg = PSMU.parseMsg(msgStr);
                //             that.analysisMessage(jsonMsg);
                //         }, function (state) {
                //             if (state == PStream.OPEN) {
                //                 PSMU.chatInitOk();
                //                 // this.sendMsg({operateType:1});
                //             } else if (state == PStream.CONNECTING) {
                //
                //             } else if(state == PStream.CLOSED){
                //                 PSMU.chatClose();
                //             }
                //         });
                //
                //         PSMU.debug("init chat info ", that)
                //         resolve()
                //     })
                //     .catch(function(err) {
                //         PSMU.error(" init chat info ",err,urlParams);
                //         reject(new Error('init chat info ' + JSON.stringify(err) + ' ' + JSON.stringify(urlParams)))
                //     });

                // if (urlParams.hasOwnProperty(PSMU.tokenName)) {
                //     PSMU.token = urlParams[PSMU.tokenName]
                // }
                // PSMU.debug("init chat info " ,this)
            })
        }

        ChatInfo.prototype.initTalkId = function (talkType,did) {
            if(talkType===this.CHAT_TYPE.chat){
                did=this.CHAT_TYPE.chat+did;
            }else if(talkType===this.CHAT_TYPE.IM){
                if(did.indexOf(this.CHAT_TYPE.IM)!=0){
                    did=this.CHAT_TYPE.IM+did;
                }
            }else if(talkType===this.CHAT_TYPE.ORG){
                if(did.indexOf(this.CHAT_TYPE.ORG)!=0){
                    did=TYPE_ORG+did;
                }
            }else if(talkType===this.CHAT_TYPE.GROUP){
                did=did;
            }
            return did;
        }

        ChatInfo.prototype.parseNewMsg = function (msgPkg) {
            // info 消息处理
            if (msgPkg.contentType === PSMU.contentType.changeOver) {
                let msgTmp = msgPkg.msg
                if (msgTmp.indexOf(PSMU.infoSpecialType.CANCLE_MSG) !== -1) {
                    let cancleInfo = msgTmp.substring(msgTmp.indexOf(PSMU.infoSpecialType.CANCLE_MSG) + 22)
                    let infoCard = cancleInfo.substring(0, cancleInfo.indexOf('|'))
                    cancleInfo = cancleInfo.substring(cancleInfo.indexOf('|') + 1)
                    let infoNick = cancleInfo.substring(0, cancleInfo.indexOf('|'))
                    let infoStr = cancleInfo.substring(cancleInfo.indexOf('|') + 1)
                    if (infoCard === PSMU.chatInfo.getSelf()) {
                        infoStr = '你' + infoStr
                    } else {
                        infoStr = '"' + infoNick + '"' + infoStr
                    }
                    msgPkg.msg = infoStr
                } else if (msgTmp.indexOf(PSMU.infoSpecialType.MEMBER_CHANGE) !== -1) {
                    let aInfoStr = msgTmp.substring(msgTmp.indexOf(PSMU.infoSpecialType.MEMBER_CHANGE) + 8)
                    aInfoStr = aInfoStr.replace(new RegExp('7z', 'gm'), '"')
                    msgPkg.msg = aInfoStr
                } else {
                    msgPkg.msg = msgTmp
                }
            }
            // 大表情兼容旧格式
            else if (msgPkg.contentType === PSMU.contentType.emoticon && PSMU.isEmt(msgPkg['emoticonType'])) {
                let reg = /^\/JsLib\/dist\/app\/images\/(\w+)\/(\w+)\.(png|gif)$/
                let oldUrl = msgPkg.msg
                let mt = oldUrl.match(reg)
                let emoticonType = 'smiley'
                let msg = 'smiley001'
                // console.log('emoticon reg', oldUrl.match(reg), oldUrl)
                if (mt && mt.length >= 3) {
                    emoticonType = mt[1]
                    msg = mt[2]
                }
                msgPkg.emoticonType = emoticonType
                msgPkg.msg = msg
            }
            // 链接消息兼容旧格式
            else if (msgPkg.contentType === PSMU.contentType.linkCard && PSMU.isEmt(msgPkg['link'])) {
                let msgText = msgPkg.msg
                let strs = msgText.split('$Z_separator')
                let msgParam = {}
                for (let i = 0; i < strs.length; i++) {
                    try {
                        let strsss = strs[i].split('=')
                        msgParam[strsss[0]] = strsss[1]
                    } catch (e) {
                        console.error('talk linkCard old message error :', msgText)
                    }
                }
                let link = msgParam['$linkcard_Link'] || ''
                msgPkg.link = link ? decodeURIComponent(link) : link
                let title = msgParam['$linkcard_Title'] || ''
                msgPkg.title = title ? decodeURIComponent(title) : title
                msgPkg.logoUrl = msgParam['$linkCard_Imgurl'] || ''
                let msg = msgParam['$linkcard_Content'] || ''
                msgPkg.msg = msg ? decodeURIComponent(msg) : msg
                if (msgParam['$linkcard_SourceType'] === 'explorer') {
                    msgPkg.sourceType = msgParam['$linkcard_SourceType'] || ''
                    msgPkg.fileId = msgParam['$linkcard_fileId'] || ''
                } else {
                    msgPkg.sourceType = 'default'
                }
            }
            // 文本消息处理
            else if (msgPkg.contentType === PSMU.contentType.text) {
                msgPkg.msgOrigin = msgPkg.msg

                let msgTextFmt = text2imageOld(msgPkg.msg.replace(/\[\^:]/g, ':'))[0]
                // console.log(msgTextFmt)
                msgTextFmt = msgTextFmt.replace(/\[\^br]/g, '<br>')
                    .replace(/\[\^bs]/g, '\\')
                    .replace(/\[\^dq]/g, '"')
                    .replace(/[ ]{2,}/g, function (match) {
                        return '&nbsp;'.repeat(match.length)
                    })
                msgPkg.msg = msgTextFmt
            }

            return msgPkg
        }

        ChatInfo.prototype.parseOldMsg = function (msgPkg) {
            // console.log('parseOldMsg', msgPkg)
            if (msgPkg.msg.indexOf(' : ') !== -1) {
                let msgTmp = msgPkg.msg
                let nick = msgTmp.substring(0, msgTmp.indexOf(' : '))
                if (nick.length > 7 && nick !== '&nbsp;&nbsp;') {
                    nick = nick.substring(0, 7) + '...'
                }
                msgPkg.nick = nick

                msgTmp = msgTmp.substring(msgTmp.indexOf(' : ') + 3)
                msgPkg.contentType = mappingChatType(msgTmp)

                if (msgPkg.mType === PSMU.msgType.Z_MSG_TYPE_INFO || msgPkg.mty === PSMU.msgType.Z_MSG_TYPE_INFO) {
                    msgPkg.contentType = PSMU.contentType.changeOver
                    if (msgTmp.indexOf(PSMU.infoSpecialType.CANCLE_MSG) !== -1) {
                        let cancleInfo = msgTmp.substring(msgTmp.indexOf(PSMU.infoSpecialType.CANCLE_MSG) + 22)
                        let infoCard = cancleInfo.substring(0, cancleInfo.indexOf('|'))
                        cancleInfo = cancleInfo.substring(cancleInfo.indexOf('|') + 1)
                        let infoNick = cancleInfo.substring(0, cancleInfo.indexOf('|'))
                        let infoStr = cancleInfo.substring(cancleInfo.indexOf('|') + 1)
                        if (infoCard === PSMU.chatInfo.getSelf()) {
                            infoStr = '你' + infoStr
                        } else {
                            infoStr = '"' + infoNick + '"' + infoStr
                        }
                        msgPkg.msg = infoStr
                    } else if (msgTmp.indexOf(PSMU.infoSpecialType.MEMBER_CHANGE) !== -1) {
                        let aInfoStr = msgTmp.substring(msgTmp.indexOf(PSMU.infoSpecialType.MEMBER_CHANGE) + 8)
                        aInfoStr = aInfoStr.replace(new RegExp('7z', 'gm'), '"')
                        msgPkg.msg = aInfoStr
                    } else {
                        msgPkg.msg = msgTmp
                    }
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_IMG_MSG) !== -1) {
                    msgPkg.contentType = PSMU.contentType.image
                    let msgImageOrigin = '/checkJpg/group/' + msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_IMG_MSG) + 15)
                    msgPkg.msg = addTypeCache('zIsCacheOnly', msgImageOrigin)
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_EXPLORER_IMG_MSG) !== -1) {
                    msgPkg.contentType = PSMU.contentType.image
                    let msgImageOrigin = '/checkJpg/group/' + msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_EXPLORER_IMG_MSG) + 24)
                    msgPkg.msg = addTypeCache('zIsCacheOnly', msgImageOrigin)
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_VOICE_MSG) !== -1) {
                    let pt = msgPkg.pt
                    if (Z_IsEmpty20(msgPkg.pt)) {
                        pt = 'group/'
                    }

                    msgPkg.contentType = PSMU.contentType.voice
                    let msgVoiceOrigin = '/checkJpg/' + pt + msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_VOICE_MSG) + 17)
                    msgPkg.msg = addTypeCache('zIsCacheOnly', msgVoiceOrigin)
                    // todo 录音时间
                    msgPkg.msgVoiceTime = ''
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_EMOTION_MSG) !== -1) {
                    msgPkg.contentType = PSMU.contentType.emoticon
                    // Z_GROUP_EMOTION_MSG/JsLib/dist/app/images/xiong/xiong004.png
                    let oldUrl = msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_EMOTION_MSG) + 19)
                    let reg = /^\/JsLib\/dist\/app\/images\/(\w+)\/(\w+)\.(png|gif)$/
                    let mt = oldUrl.match(reg)
                    let emoticonType = 'smiley'
                    let msg = 'smiley001'
                    // console.log('emoticon reg', oldUrl.match(reg), oldUrl)
                    if (mt && mt.length >= 3) {
                        emoticonType = mt[1]
                        msg = mt[2]
                    }
                    msgPkg.emoticonType = emoticonType
                    msgPkg.msg = msg
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_LOCATION_MSG) !== -1) {
                    msgPkg.contentType = PSMU.contentType.location
                    msgPkg.locationName = msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_LOCATION_MSG) + 20)
                    try {
                        let posArr = msgPkg.locationName.split('_')
                        msgPkg.lat = parseFloat(posArr[0])
                        msgPkg.lng = parseFloat(posArr[1])
                    } catch (err) {
                        console.error(err + ' ' + err.stack)
                    }
                    msgPkg.msg = '位置信息'
                } else if (msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_LinkCard) !== -1) {
                    msgPkg.contentType = PSMU.contentType.linkCard
                    let msgText = msgTmp.substring(msgTmp.indexOf(PSMU.contentTypeOld.Z_GROUP_LinkCard) + 16)
                    let strs = msgText.split('$Z_separator')
                    let msgParam = {}
                    for (let i = 0; i < strs.length; i++) {
                        try {
                            let strsss = strs[i].split('=')
                            msgParam[strsss[0]] = strsss[1]
                        } catch (e) {
                            console.error('talk linkCard old message error :', msgText)
                        }
                    }
                    let link = msgParam['$linkcard_Link'] || ''
                    msgPkg.link = link ? decodeURIComponent(link) : link
                    let title = msgParam['$linkcard_Title'] || ''
                    msgPkg.title = title ? decodeURIComponent(title) : title
                    msgPkg.logoUrl = msgParam['$linkCard_Imgurl'] || ''
                    let msg = msgParam['$linkcard_Content'] || ''
                    msgPkg.msg = msg ? decodeURIComponent(msg) : msg
                    if (msgParam['$linkcard_SourceType'] === 'explorer') {
                        msgPkg.sourceType = msgParam['$linkcard_SourceType'] || ''
                        msgPkg.fileId = msgParam['$linkcard_fileId'] || ''
                    } else {
                        msgPkg.sourceType = 'default'
                    }
                } else {
                    msgPkg.contentType = PSMU.contentType.text
                    msgPkg.msgOrigin = msgTmp

                    let msgTextFmt = text2imageOld(msgTmp.replace(/\[\^:]/g, ':'))[0]
                    // console.log(msgTextFmt)
                    msgTextFmt = msgTextFmt.replace(/\[\^br]/g, '<br>')
                        .replace(/\[\^bs]/g, '\\')
                        .replace(/\[\^dq]/g, '"')
                        .replace(/[ ]{2,}/g, function (match) {
                            return '&nbsp;'.repeat(match.length)
                        })
                    msgPkg.msg = msgTextFmt
                }
            }
            return msgPkg
        }

        /*todo*/
        ChatInfo.prototype.loadHisMsg = function (chatPanel) {

            let that = this
            let loadHisUrl = false
            var params
            let didTmp

            if (this.getChatType() === this.CHAT_TYPE.GROUP) {
                loadHisUrl = '/NCard/NCardService?ac=loadHisMsg'
                params = {'id': this.hisMsgId, 'time': this.nowMsgTime, 'groupId': this.getDid()}
            } else if (this.getChatType() === this.CHAT_TYPE.chat) {
                loadHisUrl = '/NCard/NCardService?ac=loadChatHisMsg'
                params = {'id': this.hisMsgId, 'time': this.nowMsgTime, 'chatId': this.getDid()}
                if (this.getDid().indexOf('chat') == 0) {
                    didTmp = this.getDid().substring(4)
                }
            } else if (this.getChatType() === this.CHAT_TYPE.IM) {
                loadHisUrl = '/NCard/IMKFService?ac=loadIMHisMsg'
                params = {
                    'id': this.hisMsgId,
                    'time': this.nowMsgTime,
                    'IMId': this.getDid(),
                    'companyId': this.getCompanyId()
                }
                if (this.getDid().indexOf('IM') == 0) {
                    didTmp = this.getDid().substring(2)
                }
            } else if (this.getChatType() === this.CHAT_TYPE.ORG) {
                loadHisUrl = '/NCard/IMKFService?ac=loadWoowHisMsg'
                params = {
                    'id': this.hisMsgId,
                    'time': this.nowMsgTime,
                    'woowId': this.getDid(),
                    'companyId': this.getCompanyId()
                }
            }

            that.getAxios().get(loadHisUrl, {
            // Axios.get(loadHisUrl, {
                isCache: true,
                params: params
            }).then(function (res) {

                if (res.data.retcode !== 0) {
                    PSMU.error(' load his error ', loadHisUrl, params, res)
                    return
                }

                if (!PSMU.isEmt(res.data.time)) {
                    that.nowMsgTime = res.data.time
                }
                if (res.data.Items.length !== 0) {
                    let hisItems = res.data.Items
                    for (var i = hisItems.length - 1; i >= 0; i--) {
                        var idTmp = parseInt(hisItems[i].id)
                        if (that.hisMsgId == -1 || idTmp < that.hisMsgId) {
                            that.hisMsgId = idTmp
                        } else {
                        }

                        // console.log('his msg', hisItems[i])
                        let jsonMsg = PSMU.parseMsg(hisItems[i])
                        that.analysisMessage(jsonMsg, {isHistory: true})

                        /*if (!Z_IsEmpty20(hisItems[i].msg)) {
                         var msgBody = hisItems[i].msg;
                         var msgTime=hisItems[i].msgTime;
                         var isMe=hisItems[i].isMe;
                         var roleCodeMsg=hisItems[i].roleCode;
                         var color=hisItems[i].color;
                         var ta=hisItems[i].ta;

                         var from=hisItems[i].sender;
                         var mid=!Z_IsEmpty20(hisItems[i].mid)?hisItems[i].mid:'';
                         var mType=!Z_IsEmpty20(hisItems[i].mType)?hisItems[i].mType:PSMU.msgType.Z_MSG_TYPE_CHAT;

                         var userName='';
                         if(msgBody.indexOf(' : ')!=-1){
                         userName=msgBody.substring(0,msgBody.indexOf(' : '));
                         msgBody=msgBody.substring(msgBody.indexOf(' : ')+3);
                         //todo
                         // userName=Z_GetRoleName(roleCodeMsg)+userName;
                         }

                         var msgMap={};
                         msgMap["nf"]=from;
                         msgMap["isMe"]=isMe;
                         msgMap["msg"]=msgBody;
                         msgMap["time"]=msgTime;
                         msgMap["userName"]=userName;
                         msgMap["pt"]='group/';
                         msgMap["roleCode"]=roleCodeMsg;
                         msgMap["color"]=color;
                         msgMap["mid"]=mid;
                         msgMap["type"]=mType;
                         msgMap["contentType"]=mappingChatType(msgBody);
                         //todo
                         // procTA(ta);

                         chatPanel.receiveMsg=msgMap;
                         }*/
                    }

                    // 触发一个加载结束的事件
                    $(document).triggerHandler(PSMU.LOAD_HIS_MSG_END)
                }
            })
                .catch(function (err) {
                    PSMU.error(' load his info ', loadHisUrl, params, err)
                })

        }

        ChatInfo.prototype.fixMsg = function (msg) {
            // emoji转义
            msg = emoji2text(msg)
            //换行占位符[^br], 空格
            msg = msg.replace(/[\n]/g, '[^br]')
            //'\', '"'等特殊字符
            msg = msg.replace(/\\/g, '[^bs]').replace(/"/g, '[^dq]')
            // xss filter
//        console.log(filterXSS(msg));
            msg = filterXSS(msg)
//        msg = $('<span/>').text(msg).html();
            msg = PSMU.html2txt(msg)

            return msg
        }

        ChatInfo.prototype.sendMsg = function (msg, callback) {
            // let that = this

            // if(PSMU.isClean()){
            //     this.init();
            //     PSMU.startReSend();
            //     return;
            // }

            /*todo 调整为 消息如队 保存到本地 并检查重发线程*/
            if (!PSMU.isChatOk()) {
                PSMU.startReSend()
                return
            }

            this.sendNum++
            PSMU.send(msg, callback)
            PSMU.debug('sendMsg end ', msg)
        }

        // 初始化info信息
        ChatInfo.prototype.initInfoMessage = function (infoStr) {
            if (PSMU.isEmtVal(infoStr)) {
                return null
            }
            let formatText = this.fixMsg(infoStr) // 格式化后的纯文本
            // if(content.indexOf("？")!=null) content=content.replace(/？/g,"");
            if (PSMU.isEmtVal(formatText) && PSMU.isEmtVal(infoStr)) {
                return null
            }

            let msg = this.initMessage({mty: PSMU.msgType.Z_MSG_TYPE_INFO, contentType: PSMU.contentType.changeOver})
            msg.msg = formatText
            return msg
        }

        // 初始化文本消息
        ChatInfo.prototype.initTextMessage = function (msgStr) {
            if (PSMU.isEmtVal(msgStr)) {
                return null
            }
            let formatText = this.fixMsg(msgStr)//格式化后的纯文本
            // if(content.indexOf("？")!=null) content=content.replace(/？/g,"");
            if (PSMU.isEmtVal(formatText) && PSMU.isEmtVal(msgStr)) {
                return null
            }

            let msg = this.initMessage({contentType: PSMU.contentType.text})
            msg.msg = formatText
            // msg.formatMsg=formatText;
            return msg
        }

        // 发送文本消息
        ChatInfo.prototype.sendBtn = function (msgStr, callback) {
            //let that = this;
            let msg = this.initTextMessage(msgStr)
            if (msg) {
                this.sendMsg(msg, callback)
                PSMU.debug('sendBtn end ', msg)
            }
        }

        // 初始化位置消息
        ChatInfo.prototype.initLocationMessage = function (lat, lng, addr) {

            if (PSMU.isEmtVal(lat) || PSMU.isEmtVal(lng)) {
                return null
            }

            let msg = this.initMessage({contentType: PSMU.contentType.location})
            msg.lat = lat
            msg.lng = lng
            msg.msg = addr || '位置信息'
            return msg
        }

        // 发送位置消息
        ChatInfo.prototype.sendLocation = function (lat, lng, addr, callback) {
            // console.log("sendLocation", lat, lng, addr);
            let msg = this.initLocationMessage(lat, lng, addr)
            if (msg) {
                PSMU.send(msg, callback)
                PSMU.debug('sendLocation end ', msg)
            }
        }

        // 初始化图片消息
        ChatInfo.prototype.initImageMessage = function (relativePath) {
            if (PSMU.isEmtVal(relativePath)) {
                return null
            }

            let msg = this.initMessage({contentType: PSMU.contentType.image})
            msg.msg = relativePath
            return msg
        }

        // 发送图片消息
        ChatInfo.prototype.sendImage = function (relativePath, callback) {
            let msg = this.initImageMessage(relativePath)
            if (msg) {
                PSMU.send(msg, callback)
                PSMU.debug('sendImage end ', msg)
            }
        }

        // 初始化大表情消息
        ChatInfo.prototype.initEmoticonMessage = function (emoticonType, emoticon) {
            if (PSMU.isEmtVal(emoticonType) || PSMU.isEmtVal(emoticon)) {
                return null
            }

            let msg = this.initMessage({contentType: PSMU.contentType.emoticon})
            msg.emoticonType = emoticonType
            msg.msg = emoticon
            return msg
        }

        // 发送大表情消息
        ChatInfo.prototype.sendEmoticon = function (emoticonType, emoticon, callback) {
            let msg = this.initEmoticonMessage(emoticonType, emoticon)

            if (msg) {
                PSMU.send(msg, callback)
                PSMU.debug('sendEmoticon end ', msg)
            }
        }

        // 初始化链接消息
        ChatInfo.prototype.initLinkCardMessage = function (link, title, content = '', logoUrl = '/ZingVue/static/images/ysImg.png', sourceType = 'default', fileId = null) {

            if (PSMU.isEmtVal(link) || PSMU.isEmtVal(title)) {
                return null
            }

            if (sourceType === 'explorer' && PSMU.isEmtVal(fileId)) {
                return null
            }

            let msg = this.initMessage({contentType: PSMU.contentType.linkCard})
            msg.link = link
            msg.title = title
            msg.logoUrl = logoUrl
            msg.msg = content
            msg.sourceType = sourceType
            if (sourceType === 'explorer') {
                msg.fileId = fileId
            }
            return msg
        }

        // 发送链接消息
        ChatInfo.prototype.sendLinkCard = function (link, title, fileId, content, logoUrl, sourceType, callback) {
            let msg = this.initLinkCardMessage(link, title, fileId, content, logoUrl, sourceType, callback)

            if (msg) {
                PSMU.send(msg, callback)
                PSMU.debug('sendLinkCard end ', msg)
            }
        }

      ChatInfo.prototype.initMessage = function (msg) {
        msg = PSMU.isEmt(msg) ? {} : msg

        msg.nf = this.getSelf()

        /*单聊提醒记录对端标识*/
        if (this.getChatType() === this.CHAT_TYPE.chat && !PSMU.isEmtVal(this.getVal('cardUrlPeer'))) {
          msg.cardUrlPeer = this.getVal('cardUrlPeer')
        }

        msg.nt = PSMU.isEmtVal(this.getDid()) ? '' : this.getDid()


        msg.rc = PSMU.isEmtVal(this.getVal('roleCode')) ? '' : this.getVal('roleCode')
        if (!PSMU.isEmtVal(this.getChatType())) {
          msg.ct = this.getChatType()
        }

        if (!PSMU.isEmtVal(this.getCompanyId())) {
          msg.companyId = this.getCompanyId()
        }
        if (!PSMU.isEmt(msg.mty) && msg.mty === PSMU.msgType.Z_MSG_TYPE_INFO) {
          msg.mty = PSMU.msgType.Z_MSG_TYPE_INFO
        } else {
          msg.mty = PSMU.msgType.Z_MSG_TYPE_CHAT
        }
        if (!PSMU.isEmtVal(this.getVal('nick'))) {
          msg.nick = this.getVal('nick')
        }

        if (PSMU.isEmtVal(msg.contentType)) {
          msg.contentType = PSMU.contentType.text
        }

        return msg
      }

        /**
         * 消息转发
         * @param chatList 聊天列表 [{did, type, companyId}]
         * @param msg 消息，如新建消息使用initInfoMessage和initTextMessage
         * @param comment 留言的内容，可选
         * @returns {Promise}
         */
        ChatInfo.prototype.msg2Group = function (chatList, msg, comment) {
            return new Promise((resolve, reject) => {
                // 检查消息
                if (PSMU.isEmt(msg) || (PSMU.isEmtVal(msg.mty) && PSMU.isEmtVal(msg.mType)) || PSMU.isEmtVal(msg.contentType) || PSMU.isEmtVal(msg.msg)) {
                    reject(new Error('转发失败(1):不是有效的msg' + JSON.stringify(msg)))
                    return
                }

                if (msg.mty !== PSMU.msgType.Z_MSG_TYPE_INFO && msg.mty !== PSMU.msgType.Z_MSG_TYPE_CHAT &&
                    msg.mType !== PSMU.msgType.Z_MSG_TYPE_INFO && msg.mType !== PSMU.msgType.Z_MSG_TYPE_CHAT) {
                    reject(new Error('转发失败(2):不是有效的msg' + JSON.stringify(msg)))
                    return
                }

                let msgType
                if (msg.mty === PSMU.msgType.Z_MSG_TYPE_INFO || msg.mType === PSMU.msgType.Z_MSG_TYPE_INFO) {
                    msgType = PSMU.msgType.Z_MSG_TYPE_INFO
                } else {
                    msgType = PSMU.msgType.Z_MSG_TYPE_CHAT
                }

                if (msgType === PSMU.msgType.Z_MSG_TYPE_CHAT && Object.values(PSMU.contentType).indexOf(msg.contentType) === -1) {
                    reject(new Error('转发失败(3):不是有效的msg' + JSON.stringify(msg)))
                    return
                }

                // 检查聊天信息
                if (chatList instanceof Array) {
                    let allChatRight = chatList.reduce((preRet, chat) => {
                        if (PSMU.isEmt(chat) || PSMU.isEmtVal(chat.did) || PSMU.isEmtVal(chat.type)) {
                            return false
                        }
                        if (chat.type === 'ORG') {
                            return preRet && !PSMU.isEmtVal(chat.companyId)
                        }
                        return preRet
                    }, true)
                    if (!allChatRight) {
                        reject(new Error('转发失败(4):聊天信息有误' + JSON.stringify(chatList)))
                        return
                    }
                } else {
                    reject(new Error('转发失败(5):聊天信息有误' + JSON.stringify(chatList)))
                    return
                }

                let msgStr
                let commentStr
                if (msgType !== PSMU.msgType.Z_MSG_TYPE_INFO) {
                    switch (msg.contentType) {
                        case PSMU.contentType.image:
                            msgStr = 'Z_GROUP_IMG_MSG' + msg.msg
                            break
                        case PSMU.contentType.voice:
                            msgStr = 'Z_GROUP_VOICE_MSG' + msg.msg
                            break
                        case PSMU.contentType.emoticon:
                            msgStr = 'Z_GROUP_EMOTION_MSG/JsLib/dist/app/images/' + msg.emoticonType + '/' + emoticonData[msg.emoticonType][msg.msg]
                            break
                        case PSMU.contentType.location:
                            msgStr = 'Z_GROUP_LOCATION_MSG' + msg.lat + '_' + msg.lng
                            break
                        case PSMU.contentType.linkCard:
                            msgStr = `Z_GROUP_LinkCard$linkcard_Link=${encodeURIComponent(msg.link)}$Z_separator$linkcard_Title=${msg.title}$Z_separator$linkcard_Content=${encodeURIComponent(msg.msg)}$Z_separator$linkCard_Imgurl=${encodeURIComponent(msg.logoUrl)}$Z_separator$linkcard_SourceType=${msg.sourceType}$Z_separator$linkcard_fileId=${msg.fileId}`
                            break
                        case PSMU.contentType.text:
                            msgStr = msg.msg
                            break
                    }
                } else {
                    msgStr = msg.msg
                }

                if (msg.contentType === PSMU.contentType.text) {
                    msgStr = this.fixMsg(msgStr) //格式化后的纯文本
                }
                if (!PSMU.isEmtVal(comment)) {
                    commentStr = this.fixMsg(comment)
                }
                // console.log('msg2Group: ' + msgData);

                // if(content.indexOf("？")!=null) content=content.replace(/？/g,"");
                if (PSMU.isEmtVal(msgStr)) {
                    reject(new Error('转发失败:消息内容有误' + JSON.stringify(msg)))
                    return
                }
                if (!PSMU.isEmtVal(comment) && PSMU.isEmtVal(commentStr)) {
                    reject(new Error('转发失败:评论内容有误' + comment))
                    return
                }

                // 转发消息
                let url = '/NCard/NCardService?ac=msg2Groups'
                let groupArr = chatList.map(chat => {
                    let group = {tarId: chat.did, bType: chat.type}
                    if (!PSMU.isEmtVal(chat.companyId)) {
                        group.companyId = chat.companyId
                    }
                    return group
                })
                let pData = {msg: msgStr, groups: JSON.stringify(groupArr), mType: msgType}

                /*if (!PSMU.isEmtVal(companyId)) {
                 pData.companyId = companyId
                 }*/

                if (!PSMU.isEmtVal(commentStr)) {
                    pData.mDesc = commentStr
                }

                let sendMsg = () => {
                    Axios.post(url, Qs.stringify(pData), {silent: true}).then(res => {
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                }

                sendMsg()
            })
        }

        ChatInfo.prototype.showReceiveMsg = function (msg, isHistory) {
            if (PSMU.isEmt(msg)) {
                PSMU.error('showReceiveMsg emt msg ')
                return
            }

            if (!isHistory) {
                $(document).triggerHandler(PSMU.REV_MSG, msg)
            } else {
                $(document).triggerHandler(PSMU.REV_HIS_MSG, msg)
            }
        }

        ChatInfo.prototype.analysisMessage = function (msgPkg, {isHistory = false} = {}) {
            if (!PSMU.isEmt(msgPkg) && PSMU.isString(msgPkg)) {
                msgPkg = JSON.parse(msgPkg)
            }

            if (!PSMU.isEmtVal(msgPkg.msg)) {

                // console msg
                if (msgPkg.msg.indexOf(PSMU.msgType.KL_MSG) === -1) {
                    console.log('analysisMessage', msgPkg)
                }

                /*新版本消息*/
                if (!PSMU.isEmt(msgPkg.contentType)) {
                    msgPkg = this.parseNewMsg(msgPkg)
                } else {/*旧版本消息*/
                    msgPkg = this.parseOldMsg(msgPkg)
                }
            } else {
                PSMU.error('Exception analysisMessage err ', msgPkg)
            }

            if (msgPkg.msg.indexOf(PSMU.msgType.KL_MSG) === -1) {
                this.showReceiveMsg(msgPkg, isHistory)
            } else {

            }

        }

        function sendMasFun (pData, userAlert) {

        }

        ChatInfo.prototype.getSelf = function () {
            return this.selfJid
        }

        ChatInfo.prototype.setSelf = function (selfJid) {
            this.selfJid = selfJid
        }

        ChatInfo.prototype.getDid = function () {
            return this.did
        }

        ChatInfo.prototype.setDid = function (did) {
            this.did = did
        }

        ChatInfo.prototype.getTalkInfo = function () {
            return this.talkInfo
        }

        ChatInfo.prototype.getVal = function (name) {
            if (!PSMU.isEmt(this.talkInfo) && !PSMU.isEmtVal(this.talkInfo)) {
                return this.talkInfo.hasOwnProperty(name) ? this.talkInfo[name] : null
            }
            return null
        }

        ChatInfo.prototype.setVal = function (name, value) {
            this[name] = value
        }

        ChatInfo.prototype.getChatType = function () {
            return this.chatType
        }

        ChatInfo.prototype.setChatType = function (chatType) {
            this.chatType = chatType
        }

        ChatInfo.prototype.getCompanyId = function () {
            return this.companyId
        }

        ChatInfo.prototype.setCompnayId = function (companyId) {
            this.companyId = companyId
        }

        return ChatInfo
    }())
}))
export default rootWrapper


