<template>
    <div class="login">
        <div class="login-box">
            <div class="login-box-inner">
                <tab>
                    <tab-item @on-item-click="changeTab">账号登录</tab-item>
                    <tab-item @on-item-click="changeTab">账号登录(废弃)</tab-item>
                </tab>
                <div class="login-panel" v-show="showTab === 0" @keyup.enter="doLogin">
                    <div class="form-item">
                        <label>账号:</label>
                        <input v-model="username" placeholder="请输入手机号码或者邮箱">
                    </div>
                    <div class="form-item">
                        <label>密码:</label>
                        <input type="password" v-model="password" placeholder="请输入密码">
                    </div>
                    <x-button class="login-btn" type="primary" @click.native="doLogin">登录
                    </x-button>
                </div>
                <div class="login-panel" v-show="showTab === 1" @keyup.enter="doLogin2">
                    <div class="form-item">
                        <label>账号:</label>
                        <input v-model="username" placeholder="请输入手机号码或者邮箱">
                    </div>
                    <div class="form-item">
                        <label>密码:</label>
                        <input type="password" v-model="password" placeholder="请输入密码">
                    </div>
                    <x-button class="login-btn" type="primary" @click.native="doLogin2">登录
                    </x-button>
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
    import { MH_UserAuth, MH_UserAuth2, /*MH_UserSelfPwd, MH_TestUserAuth, */Z_IsEmpty20 } from '../../utils/fn'
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
                showTab: 0,
                // qrImgUrl: 'http://www.qmenhu.com/IPSOUCE144/noSyncImg/login/87403372000000101.jpg?_t=1525595743567',
                qrImgUrl: '',
                qrImgLoading: false,
                username: '',
                password: '',
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
            window.addEventListener("load", evt => {
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
            })


            $(document).on(PSMU.LOGIN_SUCC, (evt, revMsg) => {
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
                        this.$router.push('/')
                    } else {
                        if (PSMU) PSMU.error('mhCheck failed', res)
                        this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
                    }
                }).catch(err => {
                    if (PSMU) PSMU.error('mhCheck failed', err)
                    this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
                })
            });
            $(document).on(PSMU.LOGIN_FAILED, (evt, revMsg) => {
                this.$vux.toast.text('登录失败，请稍后重试', 'bottom')
            });
        },
        destroyed() {
            window.clearInterval(interval)
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            changeTab(index) {
                this.showTab = index
            },
            qrRefresh() {
//                console.log('qrRefresh start')

                this.qrImgLoading = true

                let url = '/ZingMH/ZDesk/MENHUWX/MHUser/loginQR.action'
                let params = { wid: window.Config.wid }

                this.$http.post(url, Qs.stringify(params), { silent: true }).then(res => {

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

                    let chatInfo = new ChatInfo.ChatInfo()
                    chatInfo.talkInfo={servIp:res.data.data.servIp,uid:res.data.data.uid};
                    chatInfo.setDid(res.data.data.sscName)

                    // 服务器端 genLoginQR  把服务器ip发给本地 rMap.put("ipEnd", String.valueOf(ConfInfo.myIPEndNess));  rMap.put("servIp", String.valueOf(ConfInfo.myIP));
                    PSMU.initPSM(chatInfo, PSMU.parseLoginMsg)

                    this.qrImgUrl = res.data.data.imgPath
                    this.qrImgLoading = false

//                    console.log('qrRefresh end')
                }).catch(err => {
                    console.error(err)
                    this.qrImgLoading = false
                })
            },
            doLogin() {
                console.log('点击登录')
                setToken('token')
                if (Z_IsEmpty20(this.username) || Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('用户名或密码为空', 'bottom')
                    return
                }

                let isPhone
                if (this.username.trim().match(/^1[0-9]{10}$/)) {
                    isPhone = true
                } else {
                    isPhone = false
                }

                MH_UserAuth(isPhone ? this.username : '', isPhone ? '' : this.username, this.password).then(() => {
                    this.$vux.toast.text('登录成功', 'bottom')
                    this.$router.push('/')
                }).catch(() => {
                    this.$vux.toast.text('登录失败，请检查用户名和密码', 'bottom')
                })
            },
            doLogin2() {
                console.log('点击登录')
                setToken('token')
                if (Z_IsEmpty20(this.username) || Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('用户名或密码为空', 'bottom')
                    return
                }
                MH_UserAuth2(this.username, this.password).then(() => {
                    this.$vux.toast.text('登录成功', 'bottom')
                    this.$router.push('/')
                }).catch(() => {
                    this.$vux.toast.text('登录失败，请检查用户名和密码', 'bottom')
                })
            }
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

