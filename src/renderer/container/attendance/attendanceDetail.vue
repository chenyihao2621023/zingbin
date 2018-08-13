<template>
    <div class="attendanceDetail">
            <zing-head  title="打卡详情"></zing-head>
            <div class="content">
                <div style="text-align:center;margin-bottom: 10px;margin-top: 10px;">
                    <tag size="large" >
                        <p>{{formData.resultCodeName}}</p>
                    </tag>
                </div>
                <cell  title="备注" value-align="left"></cell>
                <div class="divTextarea">{{formData.remark}}</div>
               <!--  <x-textarea readonly :max="200" v-model="formData.remark"></x-textarea> -->
                <cell  title="图片信息" value-align="left"></cell>
                <div class="headImgDiv" >
                    <img class="previewer-demo-img headImg"  v-for="(item, index) in imglist" :src="item.src" @click="showPreview(index)"> 
                </div>
                <div v-transfer-dom>
                    <previewer  :list="imglist" ref="previewer" :options="options" ></previewer>
                </div>
                <cell   title="音频信息" value-align="left"></cell>
                <div  v-audio-control style="position:relative">
                    <div v-for="data in videoList" class="divVideo">
                        <div class="audio divAudio"
                             :data-src="data">
                        </div>
                        <i  class="chat-voice-ico videoIcon"></i>
                    </div>
                </div>
            </div> 
    </div>
</template>

<script>
  
    import ZingHead from "@/components/zingHead/ZingHead"
    import Tag from "@/components/tag/Tag"
    import {XTextarea, Cell,Previewer, TransferDom} from 'vux'
    /*音频*/
    import { mapState, mapMutations } from 'vuex'
    import AudioControl from '@/directives/audiocontrol/audio-control'
    export default {
        name: "attendanceDetail",
        components: {
            ZingHead,Tag,XTextarea,Cell,Previewer
        },
        directives: {
            AudioControl,
            TransferDom
        },
        data() {
            return {
                formData:{},
                videoList:[],//音频路径
                imglist: [],//预览图片
               
            }
        },
        computed: {
            ...mapState({
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        created() {
            this.getAttendanceDetail()
        },
        methods: {
             ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            getAttendanceDetail(){
                let url = '/zingbiz/attendance/attenPunch/getAttendanceDetailById'
                let params = this.$route.query
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData.resultCode && retData.resultCode == "1"){
                        retData.resultCodeName = "迟到"
                    }else if(retData.resultCode && retData.resultCode == "2"){
                        retData.resultCodeName = "早退"
                    }else if(retData.resultCode && retData.resultCode == "4"){
                        if(retData.isWQ && retData.isWQ == 'true'){
                            retData.resultCodeName = "外勤"
                        }else{
                            retData.resultCodeName = "范围外"
                        }
                    }else{
                        retData.resultCodeName = "打卡异常"
                    }

                    this.formData = retData
                    //retData.attenImgPath = " /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg /checkFile/company/company52589574100001/2018/4/22/86194637000000101.jpg"
                    if(retData.attenImgPath && retData.attenImgPath != ""){
                            let imgArr = retData.attenImgPath.split(" ")
                            imgArr.forEach(imgUrl => {
                                this.imglist.push({src:imgUrl})
                            })
                    }
                    //retData.attenVideoPath = "http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true' 'http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true"
                    if(retData.attenVideoPath && retData.attenVideoPath != ""){
                            let videoArr = retData.attenVideoPath.split(" ")
                            videoArr.forEach(videoUrl => {
                                this.videoList.push(videoUrl)
                            })
                    }
                })
            },
            showPreview(index){
                this.$refs.previewer.show(index)
            },
        }
    };
</script>
<style>
    .weui-textarea{
        background-color: #fff!important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .attendanceDetail{
        height:100%;
    }
    .content{
        overflow-y: scroll;
        height calc(100% - 50px);
    }
    .headImgDiv {
        margin-left: 20px;
    }
    .headImg {
        background-color: #FFF;
        margin-left: 10px;
        margin-bottom: 10px;
        display: inline-block;
        width: 80px;
        height: 80px;
        position: relative;
    }
    .videoIcon{
        z-index:1;
        margin-top: 15px;
        margin-left: 15px;
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
    .divTextarea{
            line-height: 30px;
            text-indent: 2em;
            padding: 10px 13px;
    }
</style>

