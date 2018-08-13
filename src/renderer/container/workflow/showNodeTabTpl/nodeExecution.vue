<template>
    <div class="nodeExecution-picker" v-transfer-dom>
        <popup v-model="showNodeExecution"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="nodeExecution-picker-popup">
                <zing-head class="nodeExecution-picker-head"
                    title="节点执行"
                    :isComeBack="false"
                    @doSome="backClick">
                </zing-head>
                <div class="nodeExecution">
                    <cell style="font-size: 16px;" title="描述：" value-align="left"></cell>
                    <x-textarea style="font-size: 16px;" :max="1000"
                                :rows="6"
                                v-model="formData.staff_state_describe"
                                placeholder="请输入描述..."
                    ></x-textarea>
                    <div v-if="otherModuleFormShow.isShowKq">
                        <cell  title="扣钱金额：" value-align="left"></cell>
                        <x-input style="font-size: 16px;" v-model="formData.deductMoneyNum"
                                    placeholder="扣钱金额，不填默认为0。"
                        ></x-input>
                    </div>

                    <div v-if="nodeData.executeType=='voice'">
                        <!--<cell  title="音频信息：" value-align="left"></cell>-->
                        <div v-audio-control>
                            <div v-for="data in videoArr" style="width:50px;height:50px;float:left;margin-right:5px;">
                                <div style="position:absolute;z-index:2;width:50px;height:50px;float:left;background: rgba(255,255,255,0);border-color: #fff;border-radius: 3px;box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;" class="audio"
                                     :data-src="data">
                                </div>
                                <i style="z-index:1;margin-top: 15px;margin-left: 15px;" class="chat-voice-ico" ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="nodeData.executeType=='voice'" style="height:88px;display: flex;position: absolute;z-index: 500;bottom: 65px;width: 100%;background-color: #f7f7fa;">
                    <div style="bottom:10px;" class="voice-inner"
                         @touchstart="voiceTouchStart"
                         @touchmove="voiceTouchMove"
                         @touchend="voiceTouchEnd"
                    >
                        按住 说话
                    </div>
                    <div style="color:#FF0000;position: absolute;width: 100%;text-align: center;bottom:0px;">注：请读出今天的准确日期！<br/>今天日期：{{curDate}}</div>
                </div>
                <div style="display: flex;position: absolute;z-index: 500;bottom: 0px;width: 100%;background-color: #fff;">

                    <flexbox style="margin-top: 15px;">
                        <flexbox-item style="margin-left: 0px !important;">
                            <x-button type="primary" class="btn-save" @click.native="cancel">取消</x-button>
                        </flexbox-item>
                        <flexbox-item style="margin-left: 0px !important;">
                            <x-button type="primary" class="btn-common" @click.native="submit">确定</x-button>
                        </flexbox-item>
                    </flexbox>
                </div>
            </div>
            <mask-out v-if="maskOutShow">
                <div class="recording-cancel" v-if="cancelVoice">
                    <div class="cancel-inner"></div>
                    <p>松开手指,取消发送</p>
                </div>
                <div class="recording-voice" v-else>
                    <div class="voice-inner">
                        <div class="voice-icon"></div>
                        <div class="voice-volume">
                        </div>
                    </div>
                    <p>手指上划,取消发送</p>
                </div>
            </mask-out>
        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import {
        getChatVoiceImgParam,
        touchstartUploadVoice,
        touchendUploadVoice,
        touchcancleuploadVoice
    } from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import MaskOut from '@/container/chat/MaskOut'
    import AudioControl from '@/directives/audiocontrol/audio-control'
    import {dateFormat} from '@/utils/date'

    import { XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,
        Popup,
        Cell,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "nodeExecution",
        components: {
            ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell, MaskOut
        },
        directives: {
            AudioControl,
            TransferDom
        },
        data() {
            return {
                videoArr:[],//音频路径
                videoStr:"",
                companyId:"",//公司id
                maskOutShow: false,
                cancelVoice: false,
                formData:{
                    staff_state_describe:"",

                },
                curDate:"",
            }
        },
        props:{
            showNodeExecution: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            nodeData:{
                // 是否显示
                type: Object,
                default: function() {
                    return {};
                }
            },
            workflowData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            otherModuleFormShow:{
                type: Object,
                default:function(){
                    return {};
                }
            }
        },
        watch: {
            wxUploadVoiceStatus(status){
                if(status == "success"){
                     let videoPath = "/checkJpg/group/" + this.wxUploadVoice.fileName
                     this.videoArr.push(videoPath )
                }
            },
        },
        computed: {
            ...mapState({
                wxUploadVoiceStatus: state => state.wx.wxUploadVoiceStatus,
                wxUploadVoice: state => state.wx.wxUploadVoice,
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        created() {
            this.curDate = dateFormat(new Date(),"yyyy-MM-dd");

        },
        methods: {
            ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            submit(){
                this.formData.videoPath = this.videoStr
                this.$emit("submit",this.formData)
            },
            cancel(){
                this.$emit("cancel");
            },
            voiceTouchStart(e) {

                this.maskOutShow = true
                this.clientY = e.touches[0].clientY

                // 开始录音
                touchstartUploadVoice()
                e.preventDefault();
            },
            voiceTouchMove(e) {

                if (e.touches[0].clientY - this.clientY < -50) {
                    this.cancelVoice = true
                } else {
                    this.cancelVoice = false
                }
            },
            voiceTouchEnd() {

                if (this.cancelVoice) {
                    // 取消录音
                    touchcancleuploadVoice()
                } else {
                    // 停止并上传录音
                    var params={
                        "bType":"hr_kq_audio",
                        "bId":"id"
                    }
                    touchendUploadVoice(params)
                }

                this.cancelVoice = false
                this.maskOutShow = false
            },
            backClick() {
                this.$emit("backClick");
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .nodeExecution-picker {
    .vux-popup-dialog {
        z-index: 2048;
    }

    .nodeExecution-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .nodeExecution {
        height: 75%;
        background-color: #fff !important;
        overflow-y: scroll;
    }
    .divForAttendanceCard{
        margin:0 auto;
        width:93px;
        margin-top:30px;
    }
    .yellowBtn {
        background-color: #f1b752;
    }
    .yellowBtn {
        background-color: #f1b752;
    }
    .weui-icon_msgText {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        text-align: center;
    }
    .weui-icon-text:before {
        content: attr(data-text);
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        font-size: 13px;
        color: white;
    }
    .voice-inner{
        height: 50px;
        width: 98%;
        line-height: 100%;
        border: 1px solid #E0E0E2;
        border-radius: 5px;
    flex-center(,center);
        font-size: .875rem;
        margin:0 auto;
    }

    .recording-voice
            .voice-inner
                display flex
                justify-content center
                align-items center
                height 110px
            .voice-icon
                width 55px
                height 90px
                background url(/static/images/recording-bkg.png) no-repeat center center
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
                border-radius 6px
                background-color #9d383e
            .cancel-inner
                width 110px
                height 110px
                margin 0 auto
                background-image url(/static/images/record-cancel.png)
                background-repeat no-repeat
                background-position center center
                background-size contain
    .chat-voice-ico
            display: inline-block
            width: 16px
            height: 16px
            background-size: 16px 16px
            vertical-align: middle
            background-image: url(../../../assets/img/mbvoice.png)
            &.reverse
                background-image: url(../../../assets/img/mbvoice-reverse.png)
                margin-right: 12px
                margin-left: 16px
        .playing~.chat-voice-ico
                background-image: url(../../../assets/img/mbvoice.gif)
                &.reverse
                    background-image: url(../../../assets/img/mbvoice-reverse.gif)
</style>

