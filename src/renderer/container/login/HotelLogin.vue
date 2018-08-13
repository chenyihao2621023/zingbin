<template>
    <!--<div class="login-demo">
        <div style="margin: 10px; overflow: hidden;">
            <masker style="border-radius: 2px; text-align: center; padding: 10px" :color="'126,124,127'" :opacity=".5">
                <div style="padding-bottom: 205px;">
                    <img src="http://www.qmenhu.com/zx/css/logo.png" style="width: 300px; margin: 0 auto"/>
                </div>
                <div slot="content" style="margin-top: 125px;">
                    <group label-width="9.5em" label-margin-right="2em" label-align="right">
                        <x-input title="用户名(手机/邮箱)" v-model="username"></x-input>
                        <x-input title="密码" type="password" v-model="password"></x-input>
                    </group>
                    <x-button type="default" style="margin-top: 25px; border: 0; border-radius: 0"
                              @click.native="doLogin">登录
                    </x-button>
                </div>
            </masker>
        </div>
    </div>-->
    <div class="login">
        <div class="login-box">
            <div class="login-box-inner">
                <tab>
                    <tab-item @on-item-click="changeTab" selected>酒店登录</tab-item>
                </tab>
                <div class="ercode-panel">
                    <div class="ercode-inner">
                        <img height="230px" width="230px" :src="qrImgUrl">
                        <div class="ercode-mask" v-show="qrImgLoading"></div>
                    </div>
                    <div class="ercode-info" v-show="!qrImgLoading">请使用微信或英商APP扫描二维码登录</div>
                    <div class="ercode-info" v-show="qrImgLoading">二维码失效，等待刷新</div>
                </div>
                <div class="login-link">
                    <div>
                        <x-button class="link-btn" type="default" @click.native="$router.replace('/login')">平台登录</x-button>
                    </div>
                    <div>
                        <x-button class="link-btn" type="warn" @click.native="$router.replace('/dinnerLogin')">点餐登录</x-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { setToken } from 'utils/auth'
    // import { Masker, Group, XInput, XButton, Toast } from 'vux'
    import { Tab, TabItem, XButton } from 'vux'
    import { MH_UserAuth2, /*MH_UserSelfPwd, MH_TestUserAuth, */Z_IsEmpty20 } from '../../utils/fn'
    import Qs from 'qs'
    import ChatInfo from '../../utils/chatInfo'
    import docCookie from '../../utils/cookies'

    let interval
    let ciToken

    export default {
        name: 'LoginDemo',
        components: {
            /*Masker,
            Group,
            XInput,
            XButton,
            Toast*/
            Tab,
            TabItem,
            XButton
        },
        data() {
            return {
                // qrImgUrl: 'http://www.qmenhu.com/IPSOUCE144/noSyncImg/login/87403372000000101.jpg?_t=1525595743567',
                qrImgUrl: '',
                qrImgLoading: false
            }
        },
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.setMode(false)

                if (window.Config) vm.qrRefresh()
            })
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`

            // 断开连接
            if (PSMU) PSMU.clean()

            this.setMode(true)
            next()
        },
        mounted() {
            // qrRefresh with lazy wid
            window.addEventListener("load", this.handleLoad)
            $(document).on(PSMU.LOGIN_SUCC, this.onLoginSucc);
            $(document).on(PSMU.LOGIN_FAILED, this.onLoginFailed);
        },
        destroyed() {
            if (interval) window.clearInterval(interval)
            window.removeEventListener('load', this.handleLoad)
            $(document).off(PSMU.LOGIN_SUCC)
            $(document).off(PSMU.LOGIN_FAILED)
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            changeTab(index) {
                if (index === 0) {
                    this.showTab1 = true
                } else {
                    this.showTab1 = false
                }
            },
            handleLoad(evt) {
                let count = 0
                let doQrRefresh = () => {
                    if (window.Config) {
                        this.qrRefresh()

                        interval = window.setInterval(() => {
                            this.qrRefresh()
                        }, 300000)
                    } else {
                        if (++count > 10) {
                            console.error('get window.Config failed')
                            return
                        }
                        window.setTimeout(doQrRefresh, 200)
                    }
                }

                doQrRefresh()
            },
            qrRefresh() {
                this.qrImgLoading = true

                let url = '/IPSPEC/sk/loginQR'
                let params = { wid: window.Config.wid }

                this.$http.post(url, params, { silent: true }).then(res => {

                    // 简单校验一下数据 另外切换路由时要关连接
                    if (!res.data.success || Z_IsEmpty20(res.data.data.servIp) || Z_IsEmpty20(res.data.data.uid)) {
                        console.error('loginQR servIp or uid null', res)
                        this.qrImgLoading = false
                        return
                    }

                    // 设置ci cookie
//                    document.cookie = 'ci=' + res.data.data.ci + ';max-age=600000000;path=/'
                    let r1 = docCookie.removeItem('ci', '/')
                    console.log('remove ci cookie - r: ', r1)
                    let r2 = docCookie.setItem('ci', res.data.data.ci, 600000000, '/')
                    console.log('add ci cookie - r: ', r2, res.data.data.ci)
                    ciToken = res.data.data.ci

                    if (PSMU) PSMU.serverLog(PSMU.logLevelType.DEBUG, 'add ci cookie', ciToken, res.data)

                    let chatInfo = new ChatInfo.ChatInfo()
                    chatInfo.talkInfo={servIp:res.data.data.servIp,uid:res.data.data.uid};
                    chatInfo.setDid(res.data.data.sscName)

                    // 先断开连接，再重建立
                    if (PSMU) PSMU.clean()
                    // 服务器端 genLoginQR  把服务器ip发给本地 rMap.put("ipEnd", String.valueOf(ConfInfo.myIPEndNess));  rMap.put("servIp", String.valueOf(ConfInfo.myIP));
                    PSMU.initPSM(chatInfo, PSMU.parseLoginMsg)

                    this.qrImgUrl = res.data.data.imgPath
                    this.qrImgLoading = false
                }).catch(err => {
//                    console.error(err)
                    this.qrImgLoading = false

//                    if (PSMU) PSMU.serverLog(PSMU.logLevelType.ERROR, err.message, err)
                    if (PSMU) PSMU.error(err.message, err)
                })
            },
            onLoginSucc(evt, revMsg) {
                let cookieUrl = '/IPSPEC/wx/wxsdk/mhCheck?cMsg=' + revMsg
                let config = { silent: true }

                if (ciToken) {
                    config.headers = { 'ci': ciToken }
                }

//                console.log('config', config)

                this.$http.get(cookieUrl, config).then(res => {
                    // console.log(res)
                    if (res.status === 200 && res.data.code === 201) {
                        this.$vux.toast.text('登录成功', 'bottom')
                        this.$router.push('/hotel')
                    } else {
                        if (PSMU) PSMU.error('mhCheck failed', res)
                        this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
                    }
                }).catch(err => {
                    if (PSMU) PSMU.error('mhCheck failed', err)
                    this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
                })
            },
            onLoginFailed(evt, revMsg) {
                this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    /*.login-demo
        height 100%
        padding 10px*/

    .login
        width 100%
        height 100%
        background url("../../../../static/images/meteorshower2.jpg")
        flex-center(column, center, flex-start)
        text-align center
        .login-box
            width 450px
            height 550px
            margin 0 auto
            padding 5px
            background-color #394557
            .login-box-inner
                width 100%
                height 100%
                background-color #f2f2f2
                .ercode-panel, .login-panel
                    width 100%
                    height calc(100% - 144px)
    .ercode-panel
        position relative
        width 100%
        height 100%
        text-align center
        flex-center(column, center, flex-start)
        .ercode-inner
            position relative
            width 233px
            height 233px
            margin 0 auto 10px auto
            background-color #fff
            img
                border 0
            .ercode-mask
                position absolute
                top 0
                right 0
                bottom 0
                left 0
                background-color rgba(255, 255, 255, 0.8)
        .ercode-info
            position absolute
            bottom: 30px
            left: 0
            right: 0
    .login-panel
        .form-item
            height 60px
            padding 20px 10px
            line-height 60px
            font-size 0
            margin-top 20px
            margin-bottom 20px
            label, input
                display inline-block
                height 40px
                line-height 40px
            label
                width 80px
                font-size 22px
            input
                width 340px
                font-size 20px
                padding: 0 5px
                color: #888888
                border #bbbbbb
                outline 0
        .login-btn
            margin-top 90px
            width 80%
    .login-link
        width: 250px
        margin 0 auto
        flex-center(row, space-between, flex-start)
</style>

