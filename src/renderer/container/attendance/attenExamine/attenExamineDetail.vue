<template>
    <div class="attenExamineDetail">
        <ZingHead title="考勤详情" ></ZingHead>
        <div class="content" >
            <group>
                <cell title="打卡时间" :value="attenData.generate_time"></cell>
                <cell title="考勤结果" :value="attenData.resultName"></cell>
                <cell title="打卡位置" value="辉煌国际海鲜酒楼"></cell>
                <cell title="备注" :value="attenData.remark"></cell>
            </group>
            <group>
                <cell title="图片"></cell>
                <div v-if="imgList.length == 0"></div>
                <div v-if="imgList.length > 0"></div>
                <div class="imgDiv" v-for="(item, index) in imgList"  >
                       <img class="previewer-demo-img attenImg"  :src="item.src" @click="showPreview(index)"> 
                </div>
                <div v-transfer-dom>
                        <previewer  :list="imgList" ref="previewer" :options="options" ></previewer>
                </div>
                <cell  title="音频信息" value-align="left"></cell>
                <div v-audio-control style="position:relative">
                    <div v-for="data in videoList" class="divVideo">
                        <div class="audio divAudio"
                             :data-src="data">
                        </div>
                        <i  class="chat-voice-ico videoIcon"></i>
                    </div>
                </div>
            </group>
            <div v-if="attenData.isReview == '0'">
                <group>
                    <flexbox :gutter="0">
                        <flexbox-item>
                            <x-button type="primary btn-save" @click.native="saveBtn()">正常</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="warn btn-common" @click.native="showModelBtn('1')">迟到</x-button>
                        </flexbox-item>
                    </flexbox>
                    <br/>
                     <flexbox :gutter="0">
                        <flexbox-item>
                            <x-button type="warn btn-common" @click.native="showModelBtn('2')">早退</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="primary btn-save" @click.native="showModelBtn('4')">范围外</x-button>
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </div>
        <div class="vux-confirm" v-show="modelStatus">
            <div class="vux-x-dialog">
                <div class="weui-mask" ></div> 
                <div class="weui-dialog" >
                    <div class="weui-dialog__hd">
                        <strong class="weui-dialog__title">惩戒金额</strong>
                    </div> 
                    <div class="vux-prompt">
                        <input placeholder="请输入惩戒金额" type="text" v-model="value" class="vux-prompt-msgbox">
                    </div>
                    <div class="weui-dialog__ft">
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="cancelModel">取消</a> 
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="confirmModel">确定</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import {Flexbox, FlexboxItem,Group ,XButton, Cell,XInput,Confirm,Previewer,TransferDom } from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead"
    

    import { mapState, mapMutations } from 'vuex'
    import AudioControl from '@/directives/audiocontrol/audio-control'
    export default {
        components: {
            Group ,XButton,ZingHead,Cell,XInput,
            Flexbox, FlexboxItem,Confirm ,AudioControl,Previewer
        },
        directives: {
            AudioControl,
            TransferDom
        },
        data () {
            return {
                resultCode:"0",//默认正常
                imgList:[],//图片地址
                videoList:[],//音频地址 'http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' 'http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true',
                modelStatus:false,

                rowId:"",
                companyId:"",
                attenData:{}


            }
        },
        created: function () {
           /*let img = "/checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg"
           let imgArr = img.split(" ")
           imgArr.forEach( imgUrl => {
                this.imgList.push({src:imgUrl})
           })
            let video = "http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' 'http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true"
           let videoList =  video.split(" ")
           videoList.forEach(videoUrl => {
                    this.videoList.push(videoUrl)
           })*/
           this.rowId = this.$route.query.rowId
           this.companyId = this.$route.query.companyId
           let bType = this.$route.query.bType
           let tarId = this.$route.query.tarId
            if(bType && tarId){
                this.clerAlert(bType,tarId)
            }
           this.getAttendanceDetail()
        },
        computed: {
            ...mapState({
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        methods: {
            ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            clerAlert(bType,tarId){
                let url = "/zingbiz/attendance/attenPunch/updateDisAlert"
                let params = {
                    bType:bType,
                    tarId:tarId
                }
                this.$http.post(url,params).then(res => {})
            },
            getAttendanceDetail(){
                let url = "/zingbiz/attendance/attenPunch/getAttendanceDetailById"
                this.$http.post(url,{
                    rowId:this.rowId,
                    companyId:this.companyId
                }).then(res => {
                    let retData = res.data.data
                    retData.resultName = this.getResultName(retData.resultCode)
                    this.attenData = retData
                    if(retData.attenImgPath){
                        let imgArr = retData.attenImgPath.split(" ")
                        imgArr.forEach( imgUrl => {
                             this.imgList.push({src:imgUrl})
                        })
                    }
                    if(retData.attenVideoPath){
                        this.videoList = retData.attenVideoPath.split(" ")
                    }   

                })
            },
            saveBtn() {
                let url = "/zingbiz/attendance/attenPunch/updateAttenStauts"
                this.$http.post(url,{
                    rowId:this.rowId,
                    resultCode:this.resultCode
                }).then(res => {
                    this.$router.go(-1)
                })
            },
            showPreview(index){
                this.$refs.previewer.show(index)
            },
            showModelBtn(resultCode){
               this.resultCode = resultCode
               this.modelStatus = true
            },
            cancelModel(){
               this.modelStatus = false
            },
            confirmModel(){
               this.modelStatus = false
               this.saveBtn()
            },
            getResultName(result) {
                if(result == "0"){
                    return "正常"
                }else if(result == "1"){
                    return "迟到"
                }else if(result == "2"){
                    return "早退"
                }else if(result == "4"){
                    return "待审核";
                }else if(result == "5"){
                    return "待审核";
                }else if(result == "6"){
                    return "休息";
                }else if(result == "500"){
                    return "未签到";
                }else if(result == "501"){
                    return "管理员没有设置考勤时间";
                }else{
                    return "错误";
                }
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    @import '../../../assets/stylus/unify.styl';
    .attenExamineDetail{
         height:100%;
    }
    .content {
        overflow-y: scroll;
        height calc(100% - 50px);
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
    .divVideo{
        width:60px;
        height:60px;
        float:left;
        margin-left: 10px
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
        margin-top: 15px;
        margin-left: 15px;
    }
</style>
