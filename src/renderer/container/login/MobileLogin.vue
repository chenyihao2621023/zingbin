<template>
    <div class="mobile-login">
        <div class="mobile-login-log">
            <img src="../../assets/img/aboutZing.png" alt="">
        </div>
        <div class="mobile-login-panel">
            <div class="mobile-login-panel-item">
                <input v-model="username" placeholder="请输入手机号码或者邮箱">
            </div>
            <div class="mobile-login-panel-item">
                <input type="password" v-model="password" placeholder="请输入密码">
            </div>
            <x-button class="mobile-login-panel-btn" type="primary" @click.native="doLogin">登录
            </x-button>
        </div>
        <div class="mobile-login-weixin" @click="wxLogin">
            <img src="../../assets/img/weixin.png" alt="微信登录">
        </div>
    </div>
</template>

<script>
    import { XButton } from "vux"
    import { MH_UserAuth, Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "MobileLogin",

        components: {
            XButton
        },

        data() {
          return {
              username:'',
              password:''
          }
        },

        methods: {
            doLogin() {
                console.log('点击登录')
//                setToken('token')
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

                MH_UserAuth(isPhone ? this.username : '', isPhone ?  '' : this.username, this.password).then(() => {
                    this.$vux.toast.text('登录成功', 'bottom')
                    this.$router.push('/')
                }).catch(err => {
                    this.$vux.toast.text('登录失败，请检查用户名和密码', 'bottom')
                    if (PSMU) PSMU.error('登录失败: ' + err.message, err)
                })
            },
            wxLogin() {
                console.log('微信登录');
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .mobile-login
       width 100%
       height 100%
       background #fff
       &-log
        padding 60px 34px
        width 100%
        img
          width 100%
          height 100%
       &-panel
         padding 0 24px
         &-item
               font-size 0
               border-bottom 1px solid #888888
               margin-top 20px
              input
                   display inline-block
                   height 37px
                   line-height 37px
                   width 340px
                   font-size 18px
                   padding: 0 5px
                   color: #888888
                   outline 0
                   margin 10px 0
         &-btn
           height 40px
           margin-top 50px
           border-radius 15px
       &-weixin
         margin-top 100px
         img
           display block
           margin 0 auto
           width 35px
           height 35px
</style>
