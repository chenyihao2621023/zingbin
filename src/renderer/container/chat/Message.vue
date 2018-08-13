<template>
    <div
        class="message"
        :class="[{'read-mode': readMode }, {'message-self': readMode ? false : isSelf(message)}, {'date': message.contentType === PSMU.contentType.date}, {'change-over': message.contentType === PSMU.contentType.changeOver}]"
        >

        <div class="avatar" v-if="!readMode && message.contentType !== PSMU.contentType.date && message.contentType !== PSMU.contentType.changeOver" @click="avatarClick($event, message)">
            <img
                src="../../../../static/images/userDef_.jpg"
                :data-src="getImageUrl(message.avatar,'./static/images/userDef_.jpg')"
                data-error="./static/images/userDef_.jpg"
                v-lazy-image
            />
        </div>

        <div class="message-body">

            <!-- nick -->
            <div class="nick" v-show="showNick"
                 v-if="!readMode && !isSelf(message) && message.contentType !== PSMU.contentType.date && message.contentType !== PSMU.contentType.changeOver">{{message.nick}}</div>

            <!-- info message -->
            <div
                v-if="message.contentType === PSMU.contentType.date"
                class="date"
            >{{dateStr}}</div>
            <!-- info message -->
            <div
                v-if="message.contentType === PSMU.contentType.changeOver"
                class="change-over"
            >{{message.msg}}</div>
            <!-- text message -->
            <div
                v-if="message.contentType === PSMU.contentType.text"
                class="text message-content message-bubble"
                v-html="text2image(message.msg)"
            ></div>
            <!-- image message -->
            <div
                v-else-if="message.contentType === PSMU.contentType.image"
                class="image message-content"
            >
                <img src="../../../../static/images/image-default.png"
                     :data-src="getThumbUrl(message.msg,1280,276,'./static/images/image-default.png',false)"
                     v-lazy-image
                />
            </div>
            <!-- voice message -->
            <div
                v-else-if="message.contentType === PSMU.contentType.voice"
                class="voice message-content message-bubble"
            >
                <span class="timer" v-if="isSelf(message)">{{ message.time }}</span>
                <span class="toggle">
                    <div class="toggle-mask audio" :data-src="message.msg"></div>
                    <i class="chat-voice-ico" :class="{'reverse': isSelf(message)}"></i>
                </span>
                <span class="timer" v-if="!isSelf(message)">{{ message.time }}</span>
            </div>
            <!-- emoticon message -->
            <div
                v-else-if="message.contentType === PSMU.contentType.emoticon"
                class="emoticon message-content"
            >
                <img :src="'./static/emoticon/' + message.emoticonType + '/' + emoticonData[message.emoticonType][message.msg]">
            </div>
            <!-- location message -->
            <div
                v-else-if="message.contentType === PSMU.contentType.location"
                class="location message-content"
            >
                <span>位置信息</span>
                <img src="../../assets/img/map-stretch.png"/>
            </div>
            <!-- linkCard message -->
            <div
                v-else-if="message.contentType === PSMU.contentType.linkCard"
                class="link-card message-content"
            >
                <h2 class="title">{{message.title}}</h2>
                <div class="content-wrapper">
                    <p class="content">{{message.msg}}</p>
                    <div class="logo-wrapper">
                        <img :src="message.logoUrl" onerror="this.src='./static/images/ysImg.png'">
                    </div>
                </div>
            </div>
            <!-- message mask -->
            <div class="message-mask"
                 @click="messageClick($event, message)"
                 @longpress="messageLongPress($event, message)"
                 v-long-press/>
        </div>
    </div>
</template>
<script>
    import emoticonData from './emoticon-data'
    import { text2image } from './emoji-convertor'
    import { mapState, mapMutations } from 'vuex'
    import LongPress from '../../directives/longpress/long-press'
    import LazyImage from '../../directives/lazyimage/lazy-image'
    import { dateFormat } from '../../utils/date'
    import { getThumbUrl, getImageUrl, Z_IsEmpty, Z_IsEmpty20 } from '../../utils/fn'

    export default {
        name: 'Message',
        directives: {
            LongPress,
            LazyImage
        },
        props: {
            /*self: {
                type: Boolean,
                default: true
            },*/
            message: {
                type: Object,
                default() {
                    return {}
                }
            },
            timeSeed: {
                type: Date,
                default() {
                    return new Date()
                }
            },
            showNick: {
                type: Boolean,
                default: false
            },
            // 非聊天模式
            readMode: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                emoticonData: emoticonData,
                dateStr: ''
            }
        },
        computed: {
            ...mapState({
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        watch: {
            timeSeed: {
                handler() {
                    if (this.message.contentType === PSMU.contentType.date) {
                        this.dateStr = this.formatChatTime(this.message.msg)
//                        console.log('dateStr', this.dateStr, dateFormat(this.message.msg))
                    }
                },
                immediate: true
            }
        },
        methods: {
            ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            avatarClick($event, message) {
//                console.log('avatarClick', $event, message)
                this.$emit('avatarClick', $event, message)
            },
            messageClick($event, message) {
//                console.log('messageClick', $event, message)
                this.$emit('messageClick', $event, message)
            },
            messageLongPress($event, message) {
//                console.log('messageLongPress', $event, message)
                this.$emit('messageLongPress', $event, message)
            },
            isSelf(message) {
                // 历史消息没有nf，通过isMe来判断是否自己
                if (Z_IsEmpty(message['nf']) && !Z_IsEmpty20(message['isMe'])) {
                    return message.isMe === '1'
                }

                return message.nf === PSMU.chatInfo.getSelf();
            },
            formatChatTime(msgTime) {
                let dt = msgTime
                let current = new Date()
                let todayBegin = new Date(current.getTime())
                todayBegin.setHours(0, 0, 0, 1)
                let yestodayBegin = new Date(todayBegin.getTime() - 1000 * 60 * 60 * 24)
                let lastSeventhDayBegin = new Date(todayBegin.getTime() - 1000 * 60 * 60 * 24 * 6)
                if (dt.getTime() >= todayBegin.getTime()) {
                    return dateFormat(dt, 'HH:mm')
                }
                else if (dt.getTime() >= yestodayBegin.getTime()) {
                    return dateFormat(dt, '昨天 HH:mm', dt)
                }
                else if (dt.getTime() >= lastSeventhDayBegin.getTime()) {
                    let d = dt.getDay()
                    if (d === 0) return dateFormat(dt, '星期日 HH:mm')
                    if (d === 1) return dateFormat(dt, '星期一 HH:mm')
                    if (d === 2) return dateFormat(dt, '星期二 HH:mm')
                    if (d === 3) return dateFormat(dt, '星期三 HH:mm')
                    if (d === 4) return dateFormat(dt, '星期四 HH:mm')
                    if (d === 5) return dateFormat(dt, '星期五 HH:mm')
                    if (d === 6) return dateFormat(dt, '星期六 HH:mm')
                }
                else {
                    return dateFormat(dt, 'yyyy年MM月dd日 HH:mm')
                }
            },
            asyncLoadImage($event, src) {
                console.log('asyncLoadImage', $event, src)
            },
            getThumbUrl,
            getImageUrl,
            text2image
        },
        errorCaptured(err, vm, info) {
            PSMU.error(err, info)
            vm.$destroy()
            return false
        }
    }
</script>
<style lang="stylus">

    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"
    .message
        width: 100%
        margin-bottom: 10px
        flex-center(row, start, center)
        padding-left: 10px
        &.message-self
            flex-direction: row-reverse
            padding-right: 12px
            .message-body
                .message-content
                    margin-right: 10px
                .message-bubble
                    &:after
                        border-color: transparent transparent transparent #8DFA69
                        left: auto
                        right: -11.5px
                    &.image:after
                        border-color: transparent transparent transparent #fff
                    &.voice:after
                        border-color: transparent transparent transparent #8DFA69
                .voice
                    .toggle
                        background-color: #8DFA69
                .text
                    background-color: #8DFA69
                    border-radius: 10px
                    border-top-right-radius: 4px
        &.date
            justify-content: center
        &.change-over
            justify-content: center
        .avatar
            align-self: start
            width: 50px
            height: 50px
            overflow: hidden
            img
                width: 50px
                min-height: 50px
                border: solid 1px rgba(255, 255, 255, 0.2)
                transform: translateY(calc(-50%+25px))
                background-color: #c4ccdf
                vertical-align: middle;
        .message-body
            position: relative
            display: block
            .message-mask
                position: absolute
                top: 0
                right: 0
                bottom: 0
                left: 0
            .nick
                padding: 0 0 5px 14px
                color: #9c9c9c
            .message-content
                display: block
                position: relative
                margin-left: 12px
                min-height: 44px
                word-break: break-all
            .message-bubble
                &:after
                    position: absolute
                    display: block
                    border: 6px solid #fff
                    border-color: transparent #fff transparent transparent
                    content: ""
                    top: 10px
                    left: -11.5px
                &.voice:after
                    border-color: transparent #fff transparent transparent
            .text
                max-width: calc(100vw - 100px)
                padding: 14px
                background-color: #fff
                border-radius: 10px
                border-top-left-radius: 4px
                font-size: 1rem
                .emoji
                    display: inline-block
                .emoji-sizer
                    width: 1rem
                    height: 1rem
                    background-size: 1rem 1rem
            .image
                height: 138px
                min-width: 90px
                max-width: calc(100vw - 160px)
                img
                    border: solid 1px rgba(255, 255, 255, 0.2)
                    border-radius: 5px
                    overflow: hidden
                    min-width: 90px
                    max-width: 100%
                    height: 138px
                    background: #fff
            .voice
                line-height: 44px
                > span
                > label
                    display: inline-block
                    vertical-align: top
                    line-height: 44px
                    height: 44px
                .timer
                    margin-left: 10px
                    margin-right: 10px
                    color: #a0a0a0
                .toggle
                    min-width: 60px
                    background-color: #fff
                    border-radius: 6px
                    text-align: center
                    position: relative
                    .toggle-mask
                        position: absolute
                        top: 0
                        right: 0
                        bottom: 0
                        left: 0
                &~.message-mask
                    display: none
            .emoticon
                max-width: calc(55px + 10vw)
                max-height: calc(75px + 10vw)
                overflow: hidden
                img
                    max-width: 100%
                    max-height: 100%
            .location
                background-color: #fff
                span
                    display: block
                    padding: 8px 10px 0 10px
                    font-size: 9px
                    color: #333
                img
                    height: 90px
            .link-card
                width: 170px
                height: 88px
                background-color: #fff
                .title
                    height: 20px
                    display: block
                    padding: 8px 10px 0 10px
                    font-size: 10px
                    font-weight: 600
                    color: #000
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
                .content-wrapper
                    height: 68px
                    padding: 0 10px 8px 10px
                    display: flex
                    flex-direction: row
                    .content
                        flex-grow: 1
                        margin: 5px 5px 5px 0
                        font-size: 12px
                        overflow: hidden
                        text-overflow: ellipsis
                        line-height: 13px
                    .logo-wrapper
                        width: 55px
                        padding-top: 5px
                        flex-shrink: 0
                        overflow: hidden
                        flex-direction: column-reverse
                        img
                            width: 100%
                            flex-shrink: 0

        .date
            color: #9C9C9C
        .change-over
            margin: 0 20px
            padding: 10px
            background-color: #cecece
            border-radius: 6px
            color: #fff
            font-weight: 300
        &.read-mode
            .message-body
                .message-bubble
                    &:after
                        border: none
                .text
                    border-radius: 0

        .chat-voice-ico
            display: inline-block
            width: 16px
            height: 16px
            background-size: 16px 16px
            vertical-align: middle
            background-image: url(../../assets/img/mbvoice.png)
            &.reverse
                background-image: url(../../assets/img/mbvoice-reverse.png)
                margin-right: 12px
                margin-left: 16px
        .playing~.chat-voice-ico
                background-image: url(../../assets/img/mbvoice.gif)
                &.reverse
                    background-image: url(../../assets/img/mbvoice-reverse.gif)

</style>

