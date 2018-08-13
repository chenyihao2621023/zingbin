<template>
    <div class="share-demo"></div>
</template>

<script>
    import { setupWeiXinShareInfo } from '../../../utils/wx'

    export default {
        name: "shareDemo",
        data () {
            return {}
        },
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建

            PSMU.debug("chat vue beforeRouteEnter")

            next(vm => {
                // 设置分享
                console.log('setupWeiXinShareInfo')
                setupWeiXinShareInfo(
                    'www.qmenhu.com',
                    '英商分享测试',
                    '12345,上山打老虎'
                )
            })
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .share-demo
        height 100%
        padding 50px 20px
</style>
