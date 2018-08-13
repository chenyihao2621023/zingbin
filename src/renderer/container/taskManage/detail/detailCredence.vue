<!--凭证-->
<template>
    <div>
        <div class="detailcredenceWrap">
            <div class="credenceAvatar">
                <img :src="require('../../../assets/img/tou.png')">
            </div>
            <div class="credenceMasage">
                <p class="personnel ">附件名</p>
                <p class="">大小  添加时间</p>
            </div>
            <div class="credenceDel">
                <i class="icon iconfont icon-shanchu1"></i>
            </div>
            <div class="credencedownload">
                <i class="icon iconfont icon-yulanxiazai"></i>
            </div>
        </div>
    </div>
</template>
<script>
    import avatar from "@/components/avatar/Avatar";
    export default{
        components:{
            avatar
        },
        props:['card'],
        data () {
            return {
            }
        },
        watch:{

        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .detailcredenceWrap
        display flex
        width 100%
        padding 5px 10px
        &>img
            width 50px
            height 50px
        .credenceAvatar
            flex 1
        .credenceMasage
            flex  2
        .pictureDel,.picturedownload
            justify-content flex-end
</style>
