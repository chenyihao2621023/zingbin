<template>
    <div>
        <ZingHead title="电话客服工单">
        </ZingHead>
        <group>
            <x-input title="工单编号" v-model="number" disabled></x-input>
            <x-input title="工单时间" v-model="date" disabled></x-input>
            <x-input title="坐席编号" v-model="code" disabled></x-input>
            <x-input title="客户名称" v-model="name" disabled></x-input>
            <div class="voice">
                <span class="voice-title">语音记录</span>
                <!--<span class="voice-icon">-->
                    <!--<i class="chat-voice-ico videoIcon" :class="[audioClass]"></i>-->
                    <!--<audio id="openAudio" controls-->
                           <!--name="MessageFromaudio"-->
                           <!--style="display: none; width: 0px; height: 0px;"-->
                    <!--&gt;-->
                         <!--<source :src="audioData" type="audio/mp3"/>-->
                    <!--</audio>-->
                <!--</span>-->
                <div v-audio-control class="divVideo" >
                    <div v-for="(data,index) in audioData"
                         :key="index" class="audio divAudio"
                         :data-src="data"
                    >
                    </div>
                    <i class="chat-voice-ico videoIcon"></i>
                </div>
            </div>
            <x-textarea title="工单记录" v-model="record" readonly></x-textarea>
            <x-textarea title="处理结果" v-model="results" readonly></x-textarea>
        </group>
    </div>
</template>

<script>
    import {
        Group,
        XInput,
        XTextarea,
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Z_IsEmpty20 } from "@/utils/fn";

    /*音频*/
    import { mapState, mapMutations } from 'vuex'
    import AudioControl from '@/directives/audiocontrol/audio-control'
    export default {
        name: "task-list-detail",
        components:{
            Group,
            XInput,
            XTextarea,
            ZingHead
        },
        directives: {
            AudioControl,
        },
        data() {
            return {
                number:"",
                date:"",
                code:"",
                name:"",
                audioData:[],
                record:"",
                results:"",
                TastDetail:{},
                playFlag:false,
                audioClass:""
            }
        },
        computed: {
            ...mapState({
                playingVoiceElement: state => state.chat.playingVoiceElement
            })
        },
        created() {
            this.getTastDetail()

        },
        methods:{
            ...mapMutations({
                setPlayingVoiceElement: 'SET_PLAYING_VOICE_ELEMENT'
            }),
            getTastDetail() {
                this.$http.get("/zingbiz/hotel/hotelWorkSheet/selSheet",{
                    params:{
                        rowId:this.$route.query.rowId,
                        pageNumber:1,
                        pageSize:20
                    }
                }).then((res) => {
                    this.TastDetail = res.data.data[0]
                    this.date = res.data.data[0].sheetTime
                    this.number = res.data.data[0].rowId
                    this.code = res.data.data[0].seatNumber
                    this.name = res.data.data[0].customerName
                    this.record = res.data.data[0].record
                    if (res.data.data[0].sheetType === "1") {
                        this.results = "已完成"
                    } else if (res.data.data[0].sheetType === "0") {
                        this.results = "处理中"
                    }
                    if (!Z_IsEmpty20(this.TastDetail.fileName)) {
                        this.audioData.push("http://192.168.0.6/record_data" + this.TastDetail.fileName)
                        // this.audioData = "http://192.168.0.6/record_data" + this.TastDetail.fileName
                    }
                    // let obj = document.getElementById('openAudio');
                    // obj.load()
                })
            },
            //播放录音
            // playTape() {
            //     let obj = document.getElementById('openAudio');
            //     if (this.audioData === "") {
            //         this.$vux.toast.text("暂无录音")
            //     } else {
            //         if (obj.paused) {
            //             try {
            //                 obj.play()
            //                 this.audioClass = "playing"
            //             } catch (e) {
            //                 console.error(e.message, e.stack)
            //             }
            //         } else {
            //             this.audioClass = ""
            //             obj.pause();
            //             obj.currentTime = 0
            //         }
            //     }
            //
            // }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .voice{
        position relative
        height 44px
        border-top 1px solid #ECECEC
        margin-left 13px
        line-height 44px
    }
    .divVideo{
        position:absolute;
        top: 0
        right 0
        width:44px;
        height:44px;
    }
    .divAudio{
        position:absolute;
        width:44px;
        height:44px;
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
</style>
