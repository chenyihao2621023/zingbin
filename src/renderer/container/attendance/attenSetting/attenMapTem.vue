<template>
    <div class="attenMapTem">
        <popup v-model="showAttenMapPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
               <ZingHead title="选择考勤地点" :isComeBack="false" @doSome="doSome"></ZingHead>
               <iframe id="mapPage" width="100%" height="100%" frameborder=0
                    :src="src">
               </iframe>
        </popup>
    </div>
</template>


<script>
    
    import {Popup} from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead"
    export default {
        components: {
            Popup,ZingHead
        },
        props:{
            showAttenMapPicker: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            coord:""
        },
        data () {
            return {
                //src:"https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp",
                src:"",
                key:"",
                referer:""

            }
        },
        watch: {
            coord(val){
                 this.src = "https://apis.map.qq.com/tools/locpicker?search=1&type=1&key="+this.key+"&referer="+this.referer+"&coord="+val
            }
        },
        created: function () {
            this.key = window.Config.QQ_MAP_SECRETKEY
            this.referer = window.Config.QQ_MAP_REFERER
            this.src = "https://apis.map.qq.com/tools/locpicker?search=1&type=1&key="+this.key+"&referer="+this.referer
            this.eventListener()
        },
        methods: {
           doSome () {
                this.$emit('goAttenSetting')
           },
           eventListener(){
                 let _this = this
                 window.addEventListener('message', function(event) {
                    var loc = event.data;
                    if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                        _this.$emit('selMapClicked',loc)
                    }
                }, false);
           }

        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .attenMapTem{
        height:100%;
    }
      
</style>
