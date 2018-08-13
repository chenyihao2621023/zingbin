 <template>
    <div class="map">
        <zing-head title="查询考勤报表"></zing-head>
        <iframe id="mapPage" width="100%" height="100%" frameborder=0
            src="https://apis.map.qq.com/tools/locpicker?search=0&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&coord=40.05307,116.306243">
        </iframe>
    </div>
</template>

<script>
    window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc);
        }
    }, false);
    import ZingHead from "@/components/zingHead/ZingHead";
   
    export default {
        name: "map",
        components: {
            ZingHead
        },
        directives: {
            //自定义标签属性

        },
        data() {
            return {
                
            }
        },
        created: function () {

        },
        methods: {
        }
    }
</script>
<style type="text/css">
  
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .map{
        height: 100%;
    }
  
</style>
