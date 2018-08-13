<template>
    <div class="native-login">
        <div class="native-login-log">
            <img src="../../assets/img/aboutZing.png" alt="log">
        </div>
        <div class="native-login-panel">
            <div class="native-login-panel-item">
                <input v-model="tel" placeholder="请输入手机号码或者邮箱">
            </div>
            <div class="native-login-panel-item">
                <input :type="passwordType" v-model="password" placeholder="请输入密码">
                <!--<i class="iconfont icon-yanjing-zheng" @click="changeType"></i>-->
                <img :src="src" @click="changeType" alt="log">
                <!--<img v-show="passwordType==='text'" src="../../assets/img/hidepassword.png" @click="changeType" alt="log">-->
            </div>
            <x-button class="native-login-panel-btn" type="primary" @click.native="submit">登录
            </x-button>
        </div>
        <div class="native-login-weixin" v-show="isWxOk" @click="wechatLogin">
            <img src="../../assets/img/weixin1.png" alt="微信登录">
        </div>
    </div>
</template>
<script>
    import { XButton } from "vux"
    import { MH_UserAuth, Z_IsEmpty20,isMhApp } from '../../utils/fn'

    export default {
        name: 'login',
        components: {
            XButton
        },
        data() {
            return {
                tel: "",
                password: '',
                passwordType:'password',
                isWxOk:false,
                showPasswordImg: require("../../assets/img/showpassword.png"),
                hidePasswordImg: require("../../assets/img/hidepassword.png")
            }
        },
        computed: {
          src() {
              return this.passwordType === "password" ? this.showPasswordImg : this.hidePasswordImg
            }
        },
        watch: {
            password(val) {
                !val.length ? this.passwordType = 'password' : null
            }
        },
        mounted() {
            this.isWxOk=false;
            let that =this
            if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.isWxInstall)==='function'){
                MHAppapi.isWxInstall(function (ret) {
                    console.log("isWxInstall ret ",ret)
                    if(ret && ret.isWxOk==='true'){
                        that.isWxOk=true;
                    }
                })
            }
            // console.error(' isMhApp '+isMhApp() + " MHAppapi "+typeof(MHAppapi))
            /*注意 ios jsContext 生成时机*/
//            if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.hideBottomBar)==='function'){
//                MHAppapi.hideBottomBar();
//            }
        },
        methods: {
            changeType() {
                this.passwordType = this.password.length ? (this.passwordType === "text" ? "password" : "text") : "password"
                // if (this.password.length) {
                //     this.passwordType = this.passwordType === "text" ? "password" : "text"
                // } else {
                //     this.passwordType = "password"
                // }
            },
            submit(){
                console.log('native login')
                if (Z_IsEmpty20(this.tel) || Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('用户名或密码为空', 'bottom')
                    return
                }

                let isPhone
                if (this.tel.trim().match(/^1[0-9]{10}$/)) {
                    isPhone = true
                } else {
                    isPhone = false
                }

                var appInfo=null;
                if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.getAppInfo)==='function'){
                    appInfo=MHAppapi.getAppInfo();
                    console.log('app login '+appInfo)
                }

                MH_UserAuth(isPhone ? this.tel : '', isPhone ?  '' : this.tel, this.password,appInfo).then(() => {
                    this.$vux.toast.text('登录成功', 'bottom')
                    if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.showMenuBtn)==='function'){
                        MHAppapi.showMenuBtn('true');
                    }
                    this.$router.push('/')

                }).catch(err => {
                    this.$vux.toast.text('登录失败，请检查用户名和密码', 'bottom')
                    if (PSMU) PSMU.error('登录失败: ' + err.message, err)
                })
            },
            wechatLogin() {
                console.log('wx login')
                if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.wxLogin)==='function'){
                    let ret=MHAppapi.wxLogin();
                    console.log('wx login ret:',ret)
                }

            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .native-login
        width 100%
        height 100%
        background #fff
        &-log
            padding 16% 15%
            width 100%
            img
                width 100%
                height 100%
        &-panel
            padding 0 24px
            &-item
                font-size 0
                border-bottom 1px solid #888888
                margin-top 5%
                display flex
                justify-content space-between
            input
                display inline-block
                height 37px
                line-height 37px
                width 100%
                font-size 18px
                padding: 0 5px
                color: #888888
                outline 0
                margin 10px 0 5px
            img
               margin-top 10px
               width 30px
               height 30px
            &-btn
                height 50px
                margin-top 10%
                border-radius 15px
        &-weixin
            margin-top 25%
            img
                display block
                margin 0 auto
                width 35px
                height 35px
                border-radius 10%
</style>
<!--<style lang="stylus" scoped>-->
<!--@import '~assets/stylus/variable.styl';-->
<!--@import '~assets/stylus/mixin.styl';-->

<!--.login-->
  <!--width: 100%-->
  <!--height: 100%-->
  <!--background-color #fff-->
  <!--.log-->
    <!--height 40%-->
  <!--&-content-->
    <!--flex-center(column, space-between, center)-->
    <!--height 60%-->
    <!--padding 0 20px-->
    <!--input-->
      <!--background:none-->
      <!--outline:none-->
      <!--border:0px-->
      <!--appearance:none-->
    <!--input:-webkit-autofill,-->
    <!--input:-webkit-autofill:hover,-->
    <!--input:-webkit-autofill:focus {-->
    <!--box-shadow:0 0 0 60px #fff inset;-->
    <!-- -webkit-text-fill-color: #878787;-->
    <!--}-->
    <!--.tel-->
      <!--padding-bottom 20px-->
      <!--flex-center(row, start, center)-->
      <!--border-bottom 1px solid #E9E9E9-->
      <!--span-->
        <!--font-weight bold-->
      <!--input-->
        <!--flex 1-->
        <!--margin-left 20px-->
    <!--.password-->
      <!--flex-center(row, start, center)-->
      <!--margin-top 40px-->
      <!--padding-bottom 20px-->
      <!--border-bottom 1px solid #E9E9E9-->
      <!--span-->
        <!--font-weight bold-->
      <!--input-->
        <!--flex 1-->
        <!--margin-left 20px-->
    <!--.submit-->
      <!--flex-center(row, center, center)-->
      <!--margin-top 60px-->
      <!--padding 10px-->
      <!--color #409eff-->
      <!--cursor pointer-->

    <!--.wechat-login-->
      <!--flex-center(row, center, center)-->
      <!--margin-bottom 60px-->
      <!--padding 10px-->
      <!--color #409eff-->
      <!--cursor pointer-->
<!--</style>-->



