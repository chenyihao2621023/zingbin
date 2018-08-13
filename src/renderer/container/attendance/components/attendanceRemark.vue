<template>
    <div class="attendanceRemark-picker">
        <popup v-model="showAttendanceRemark"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="attendanceRemark-picker-popup">
                <zing-head class="attendanceRemark-picker-head" 
                    title="考勤打卡" 
                    :isComeBack="false"
                    @doSome="backClick">
                </zing-head>
                <div class="attendanceRemark">
                    <div style="text-align:center;margin-bottom: 10px;margin-top: 10px;">
                        <tag size="large" >
                            <p>{{resultCodeName}}</p>
                        </tag>
                    </div>
                    <cell  title="备注" value-align="left"></cell>
                    <x-textarea :max="200"  v-model="remark"></x-textarea>
                    <cell  title="图片信息" value-align="left"></cell>
                    <div v-if="imgList.length == 0"></div>
                    <div v-if="imgList.length > 0"></div>
                    <div class="imgDiv" v-for="(item, index) in imgList"  >
                       <img class="previewer-demo-img attenImg"  :src="item.src" @click="showPreview(index)"> 
                       <i class="iconfont icon-shanchu2 delImg"   @click="delImg(item.src)"></i>
                    </div>
                   
                    <div v-transfer-dom>
                        <previewer  :list="imgList" ref="previewer" :options="options" ></previewer>
                    </div>
                   <image-picker
                       :files="files"
                       :companyId="companyId"
                       :selectable="selectable"
                       :multiple="multiple"
                       :bId = "bId"
                       :bType = "bType"
                       @onChange="imgOkCallback"
                   />
                    <cell  title="音频信息" value-align="left" style="margin-top:20px;"></cell>
                    <div v-audio-control>
                        <div v-for="data in videoArr" class="divVideo">
                            <i class="iconfont icon-shanchu2" @click="delVideo(data)" style="float: right;"></i>
                            <div class="audio divAudio"
                                 :data-src="data">
                            </div>
                            <i  class="chat-voice-ico videoIcon" ></i>
                        </div>
                    </div>
                </div>
                <div style="display: flex;position: absolute;z-index: 500;bottom: 65px;width: 100%;background-color: #f7f7fa;text-align:center;">
                    <i class="iconfont icon-luyin" style="margin:0 auto;font-size: 50px;" @touchstart="voiceTouchStart"
                         @touchmove="voiceTouchMove"
                         @touchend="voiceTouchEnd"> <p style="font-size: 16px;">按住说话</p></i>
                  
                </div>

                <div style="display: flex;position: absolute;z-index: 500;bottom: 0px;width: 100%;background-color: #f7f7fa;">
                    <flexbox  :gutter="0">
                        <flexbox-item>
                            <x-button type="primary" class="btn-common" @click.native="cancel">取消考勤</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="primary" class="btn-save" @click.native="submit">提交</x-button>
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
    import Tag from "@/components/tag/Tag"
    import ImagePicker from '@/components/imagepicker/ImagePicker';
    import { XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,Popup, Cell,Previewer, TransferDom} from 'vux'
    

    import {getChatVoiceImgParam,touchstartUploadVoice,touchendUploadVoice,touchcancleuploadVoice} from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import MaskOut from '@/container/chat/MaskOut'
    import AudioControl from '@/directives/audiocontrol/audio-control'

    export default {
        name: "attendanceRemark",
        components: {
            ZingHead,ImagePicker, XTextarea, Group, XButton, Flexbox, FlexboxItem,
            Tag, Popup, Cell, MaskOut,Previewer
        },
        directives: {
            AudioControl,
            TransferDom
        },
        data() {
            return {
                companyId:"",//公司id
                selectable:true,//添加按钮
                multiple:false,//是否多选
                bId:"id",
                bType:"hr_kq_img",
                
                videoArr:[],//音频路径
                resultCodeName:"",//状态值
                remark:"",
                maskOutShow: false,
                cancelVoice: false,
                submitBtnStatus: true,//没点击过
                imgList: [],//预览图片
                imgArr:[],//存储图片
                files:[]
            }
        },
        props:{
            showAttendanceRemark: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            paramesData:{
                type: Object,
                default:function(){
                    return {};
                }
            }

        },
        watch: {
            paramesData(data){
                this.companyId = data.companyId
                this.resultCodeName = this.getResultCodeName(data.resultCode)
                this.remark = ""
            },
            showAttendanceRemark(){
                this.submitBtnStatus = true
                this.remark = ""
                this.files = []
                this.videoArr = []
                this.imgList = []
                this.imgArr = []
            },
            wxUploadVoiceStatus(status){
                if(status == "success"){
                     let videoPath = "/checkJpg/group/" + this.wxUploadVoice.fileName
                     this.videoArr.push(videoPath)
                }
            }
        },
        computed: {
            ...mapState({
                wxUploadVoiceStatus: state => state.wx.wxUploadVoiceStatus,
                wxUploadVoice: state => state.wx.wxUploadVoice,
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        created() {
            //测试图片  音频数据
           // let img = "/checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg"
           // let imgArr = img.split(" ")
           // imgArr.forEach( imgUrl => {
           //     this.imgList.push({src:imgUrl})
           // })
           // console.log("imgList=========",this.imgList)
           // let video = "http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' 'http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true"
           // let videoArr =  video.split(" ")
           // videoArr.forEach(videoUrl => {
           //         this.videoArr.push(videoUrl)
           // })
           // console.log("videoArr=========",this.videoArr)
        },
        methods: {
            ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            showPreview(index){
                this.$refs.previewer.show(index)
            },
            delImg(src){
                this.imgList = this.imgList.filter(obj => {
                    return src !== obj.src
                })
                this.imgArr = this.imgArr.filter(newSrc =>{
                    return src !== newSrc
                })
            },
            delVideo(delUrl){
                this.videoArr =  this.videoArr.filter(url => {
                        return delUrl !== url
                })
            },
            submit(){
                if(this.submitBtnStatus){
                    let imgStr = ""
                    if(this.imgArr){
                        imgStr = this.imgArr.join(" ")
                    }
                    this.paramesData.attenImgPath = imgStr
                    let videoStr = ""
                    if(this.videoArr){
                        videoStr = this.videoArr.join(" ")
                    }
                    this.paramesData.attenVideoPath = videoStr
                    this.paramesData.remark = this.remark
                    this.$emit("submit",this.paramesData)
                    this.submitBtnStatus = false
                }
                
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
                        "bId":"id",
                        "companyId":this.companyId
                        
                    }
                    touchendUploadVoice(params)
                }

                this.cancelVoice = false
                this.maskOutShow = false
            },
            //上传图片组件方法
            imgOkCallback(files, operationType, index) {
                let _this = this
                files.forEach(obj => {
                    if(obj.url.indexOf("/checkFile/") < 0){
                        obj.url = "/checkJpg/"+obj.url 
                    }
                    _this.imgArr.push(obj.url)
                    _this.imgList.push({src:obj.url})
                });
                this.files = []
            },
            backClick() {
                this.$emit("backClick");
            },
            getResultCodeName(resultCode){
                    if(resultCode == "1"){
                        return "迟到"
                    }else if(resultCode == "2"){
                        return "早退"
                    }else if(resultCode == "4"){
                        return "范围外"
                    }else if(resultCode == "6"){
                        return "休息"
                    }
            }
        }
    };
</script>
<style>
    .weui-cell__bd textarea {
        text-align: left !important;
    }
    .weui-textarea{
        background-color: #fff!important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .attendanceRemark-picker {
    .vux-popup-dialog {
        z-index: 2048;
    }

    .attendanceRemark-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .attendanceRemark {
        height calc(100% - 170px);
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
            width: 30px
            height: 30px
            background-size: 30px 30px
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
   
    .attendanceRemark-picker .vux-popup-dialog[data-v-71c6d87a] {
        z-index: 1000;
    }
    .imgDiv {
        display: inline;
        position:relative;
    }
    .attenImg{
        margin-top: 20px;
        margin-left: 20px;
        width: 70px;
        height: 70px;
    }
    .delImg{
        position: absolute;
        margin-top: 10px;
        margin-left: -15px;
    }
    .iconfont{
        font-size: 20px;
    }
    .ei-image-picker{
        display: inline-block;
        margin-top: 30px;
    }
    .divVideo{
        width:60px;
        height:60px;
        float:left;
        margin-left: 10px;
    }
    .divAudio{
         position:absolute;
         z-index:2;
         width:50px;
         height:50px;
         float:left;
         background: rgba(255,255,255,0);
         border-color: #fff;
         border-radius: 3px;
         box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
    }
    .videoIcon{
        z-index:1;
        margin-top: 10px;
        margin-left: 10px;
    }
    
</style>

