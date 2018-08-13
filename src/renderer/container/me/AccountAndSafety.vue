<template>
    <div class="account-safety">
        <!--<zing-head class="header" :title="'设置'"></zing-head>
        <div class="content">
            &lt;!&ndash;<div class="wxid">
                您绑定的微信号：{{wxid}}
            </div>&ndash;&gt;
        </div>
        <div class="footer">
            <flexbox>
                <flexbox-item style="margin-left: 0">
                    <x-button :gradients="['#40affc','#40affc']" type="primary" @click.native="changeWxid">更换微信号</x-button>
                </flexbox-item>
                <flexbox-item style="margin-left: 0">
                    <x-button type="primary" @click.native="goRegister" :disabled="username0 === null">注册账号</x-button>
                </flexbox-item>
            </flexbox>
        </div>-->
        <zing-head class="header" :title="'设置用户名密码'"></zing-head>
        <div class="content">
            <group>
                <cell title="更改密码" value="" :disabled="hasRegistered === null" @click.native="showPassEditor=true" is-link></cell>
                <cell title="手机绑定" :value="cellphone0Fmt ? '已绑定 ' + cellphone0Fmt : ''" :disabled="hasRegistered === null" @click.native="showPhoneEditor=true" is-link></cell>
                <cell title="邮箱绑定" :value="email0Fmt ? '已绑定 ' + email0Fmt : ''" :disabled="hasRegistered === null" @click.native="showEmailEditor=true" is-link></cell>
            </group>
        </div>
        <div class="footer">
            <!--<x-button type="primary" @click.native="goRegister" :disabled="cellphone0 === null || email0 == null">编辑</x-button>-->
        </div>

        <popup class="account-register" v-model="showRegister" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <zing-head class="header" :isComeBack="false" :title="'设置用户名密码'" @doSome="$router.go(-1)"></zing-head>
            <div class="content">
                <group>
                    <cell-box style="text-align: center">
                        <img width="116" height="116" src="../../../../static/images/ysImg.png" style="margin: 0 auto">
                    </cell-box>
                    <x-input v-model="cellphone" placeholder="请输入手机号" :readonly="cellphone0 !== ''">
                        <div slot="label">
                            手机号
                            <span style="color: red; padding-left: 5px;">*</span>
                        </div>
                    </x-input>
                    <x-input v-model="email" placeholder="请输入邮箱" :readonly="email0 !== ''">
                        <div slot="label">
                            邮箱
                            <span style="color: red; padding-left: 5px;">*</span>
                        </div>
                    </x-input>
                    <cell-box style="text-align: center">
                        <p style="text-align: left; color: #101010; font-size: 14px">
                            提示：密码由6-25个字母、数字、符号组成
                        </p>
                    </cell-box>
                    <x-input type="password" :title="'设置密码'" v-model="password" placeholder="请输入密码"></x-input>
                    <x-input type="password" :title="'确认密码'" v-model="passwordRepeat" placeholder="请再次输入密码"></x-input>
                </group>
            </div>
            <div class="footer">
                <x-button type="primary" @click.native="doRegister">注册</x-button>
            </div>
        </popup>

        <popup class="account-register" v-model="showPassEditor" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <zing-head class="header" :isComeBack="false" :title="'修改密码'" @doSome="showPassEditor=false"></zing-head>
            <div class="content">
                <group>
                    <cell-box style="text-align: center">
                        <img width="116" height="116" src="../../../../static/images/ysImg.png" style="margin: 0 auto">
                    </cell-box>
                    <cell-box style="text-align: center">
                        <p style="text-align: left; color: #101010; font-size: 14px">
                            提示：密码由6-25个字母、数字、符号组成
                        </p>
                    </cell-box>
                    <x-input type="password" :title="'原始密码'" v-model="passwordOld" placeholder="请输入原始密码"></x-input>
                    <x-input type="password" :title="'设置密码'" v-model="password" placeholder="请输入密码"></x-input>
                    <x-input type="password" :title="'确认密码'" v-model="passwordRepeat" placeholder="请再次输入密码"></x-input>
                </group>
            </div>
            <div class="footer">
                <x-button type="primary" :disabled="hasRegistered === null" @click.native="doUpdatePass">保存</x-button>
            </div>
        </popup>

        <popup class="cellphone-editor" v-model="showPhoneEditor" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <zing-head class="header" :isComeBack="false" :title="'修改手机号'" @doSome="showPhoneEditor=false"></zing-head>
            <div class="content">
                <group>
                    <cell-box style="text-align: center">
                        <img width="116" height="116" src="../../../../static/images/ysImg.png" style="margin: 0 auto">
                    </cell-box>
                    <x-input type="password" :title="'输入密码'" v-model="password" placeholder="请输入密码"></x-input>
                    <x-input :title="'新手机号'" v-model="cellphone" placeholder="请输入新手机号"></x-input>
                    <x-input :title="'再次输入新手机号'" v-model="cellphoneRepeat" placeholder="请再次输入新手机号"></x-input>
                </group>
            </div>
            <div class="footer">
                <x-button type="primary" :disabled="hasRegistered === null" @click.native="doUpdatePhone">保存</x-button>
            </div>
        </popup>

        <popup class="email-editor" v-model="showEmailEditor" position="right" width="100%" height="100%" :popup-style="{'overflow': 'hidden'}">
            <zing-head class="header" :isComeBack="false" :title="'修改邮箱'" @doSome="showEmailEditor=false"></zing-head>
            <div class="content">
                <group>
                    <cell-box style="text-align: center">
                        <img width="116" height="116" src="../../../../static/images/ysImg.png" style="margin: 0 auto">
                    </cell-box>
                    <x-input type="password" :title="'输入密码'" v-model="password" placeholder="请输入密码"></x-input>
                    <x-input :title="'新邮箱'" v-model="email" placeholder="请输入绑定邮箱号"></x-input>
                    <x-input :title="'再次输入新邮箱'" v-model="emailRepeat" placeholder="请再次输入绑定邮箱号"></x-input>
                </group>
            </div>
            <div class="footer">
                <x-button type="primary" :disabled="showEmailEditor === null" @click.native="doUpdateEmail">保存</x-button>
            </div>
        </popup>
    </div>
</template>

<script>
    import { Cell, Flexbox, FlexboxItem, XButton, Group, CellBox, XInput, Popup } from 'vux'
    import ZingHead from '../../components/zingHead/ZingHead'
    import { MH_UserSelfPwd, Z_IsEmpty20 } from '../../utils/fn'

    export default {
        name: "AccountAndSafety",
        components: {
            Cell,
            XInput,
            Popup,
            Flexbox,
            FlexboxItem,
            XButton,
            Group,
            CellBox,
            ZingHead
        },
        data() {
            return {
//                wxid: '12345',
                showRegister: false,
//                showEditor: false,
                cellphone0: null,
                email0: null,
                hasRegistered: null,
                // 注册页面表单内容
                cellphone: '',
                email: '',
                password0: '',
                password: '',
                passwordRepeat: '',
                // 修改页面表单内容
                showPassEditor: false,
                passwordOld: '',
                // 修改手机号
                showPhoneEditor: false,
                cellphoneRepeat: '',
                // 修改邮箱
                showEmailEditor: false,
                emailRepeat: '',
            }
        },
        computed: {
            cellphone0Fmt() {
                return this.cellphone0 ? this.cellphone0.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2') : ''
            },
            email0Fmt() {
                return this.email0 ? this.email0.replace(/^(.{2,4}).{2,}(@.+)$/, '$1****$2') : ''
            }
        },
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例

                // 获取用户名
                let url = '/zingbiz/auth/user/getUsername'
                vm.$http.post(url, {}).then(res => {
                    if (res.data.success) {
                        vm.cellphone0 = res.data.data.Cellphone
                        vm.email0 = res.data.data.Email
                        vm.hasRegistered = res.data.data.hasRegistered
                        if (!vm.hasRegistered) {
                            vm.cellphone = vm.cellphone0
                            vm.email = vm.email0
                            vm.showRegister = true
                        }
                    } else {
                        console.error('getUsername failed', res)
                        vm.$vux.toast.text('请检查网络连接', 'bottom')
                    }
                }).catch(err => {
                    console.error(err)
                    vm.$vux.toast.text('请检查网络连接', 'bottom')
                })
            })
        },
        methods: {
            changeWxid() {
                this.$vux.alert.show({
                    title: '提示',
                    content: '维护中...',
                })
            },
            doRegister() {
                if (this.hasRegistered === null) {
                    this.$vux.toast.text('系统异常，请稍后重试', 'bottom')
                    return
                }

                if (this.hasRegistered) {
                    this.$vux.toast.text('用户已注册', 'bottom')
                    this.showRegister = false
                    return
                }

                if (Z_IsEmpty20(this.cellphone)) {
                    this.$vux.toast.text('手机号码为空', 'bottom')
                    return
                }

                if (!this.cellphone.trim().match(/^1[0-9]{10}$/)) {
                    this.$vux.toast.text('手机号码不合法', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.email)) {
                    this.$vux.toast.text('邮箱为空', 'bottom')
                    return
                }

                if (!this.email.trim().match(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/)) {
                    this.$vux.toast.text('邮箱不合法', 'bottom')
                    return
                }


                /*// 检验是否已经设置过用户名
                if (Z_IsEmpty20(this.username0)) {
                    if (Z_IsEmpty20(this.username)) {
                        this.$vux.toast.text('用户名为空', 'bottom')
                        return
                    }

                    if (!this.username.trim().match(/^[a-zA-Z0-9_]{4,20}$/)) {
                        this.$vux.toast.text('用户名不合法', 'bottom')
                        return
                    }
                } else {
                    if (Z_IsEmpty20(this.password0)) {
                        this.$vux.toast.text('原始密码为空', 'bottom')
                        return
                    }
                }

                if (Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('密码为空', 'bottom')
                    return
                }*/

                if (!this.password.match(/^[a-zA-Z0-9_~!@#$%^&*;:'",.<>?|\-+={}[\]\\()]{6,25}$/)) {
                    this.$vux.toast.text('密码不合法', 'bottom')
                    return
                }

                if (this.password !== this.passwordRepeat) {
                    this.$vux.toast.text('两次输入密码不一致', 'bottom')
                    return
                }

                // 创建用户名
                let url = '/zingbiz/auth/user/registerUsername'
                this.$http.post(url, {
                    cellphone: this.cellphone,
                    email: this.email
                }).then(res => {
                    if (res.data.success) {
                        // 修改密码
                        MH_UserSelfPwd('000000', this.password).then(res => {
                            this.cellphone0 = this.cellphone
                            this.email0 = this.email
                            this.cellphone = ''
                            this.email = ''
                            this.password = ''
                            this.passwordRepeat = ''
                            this.$vux.toast.text('设置用户名密码成功', 'bottom')
                            this.showRegister = false
                        }).catch(() => {
                            this.$vux.toast.text('设置用户名密码失败', 'bottom')
                        })
                    } else {
                        console.error('registerUsername failed', res)
                        this.password = ''
                        this.passwordRepeat = ''
                        this.$vux.toast.text('设置用户名密码失败', 'bottom')
                    }
                }).catch(err => {
                    console.error(err)
                    this.password = ''
                    this.passwordRepeat = ''
                    this.$vux.toast.text('设置用户名密码失败', 'bottom')
                })
            },
            doUpdatePass() {
                if (this.hasRegistered === null) {
                    this.$vux.toast.text('系统异常，请稍后重试', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.passwordOld)) {
                    this.$vux.toast.text('原始密码不能为空', 'bottom')
                    return
                }

                if (!this.password.match(/^[a-zA-Z0-9_~!@#$%^&*;:'",.<>?|\-+={}[\]\\()]{6,25}$/)) {
                    this.$vux.toast.text('密码不合法', 'bottom')
                    return
                }

                if (this.password !== this.passwordRepeat) {
                    this.$vux.toast.text('两次输入密码不一致', 'bottom')
                    return
                }

                // 修改密码
                MH_UserSelfPwd(this.passwordOld, this.password).then(res => {
                    this.passwordOld = ''
                    this.password = ''
                    this.passwordRepeat = ''
                    this.$vux.toast.text('更新密码成功', 'bottom')
                    this.showPassEditor = false
                }).catch(() => {
                    this.passwordOld = ''
                    this.password = ''
                    this.passwordRepeat = ''
                    this.$vux.toast.text('更新密码失败', 'bottom')
                })
            },
            doUpdatePhone() {
                if (this.hasRegistered === null) {
                    this.$vux.toast.text('系统异常，请稍后重试', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('密码不能为空', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.cellphone)) {
                    this.$vux.toast.text('手机号码为空', 'bottom')
                    return
                }

                if (!this.cellphone.trim().match(/^1[0-9]{10}$/)) {
                    this.$vux.toast.text('手机号码不合法', 'bottom')
                    return
                }

                if (this.cellphone !== this.cellphoneRepeat) {
                    this.$vux.toast.text('两次输入手机号不一致', 'bottom')
                    return
                }

                let now = new Date().getTime()
                let postMsg = PSMU.EP({
                    pwd: this.password + "_zsp_" + now,
                    cellphone: this.cellphone + "_zsp_" + now
                })

                PSMU.debug("userSelfCellphone ", postMsg)

                this.$http.post("/zingbiz/auth/user/userSelfCellphone", {
                    msg: postMsg
                }).then(res => {
                    if (res.data.success) {
                        this.cellphone0 = this.cellphone
                        this.password = ''
                        this.cellphoneRepeat = ''
                        this.$vux.toast.text('修改手机号成功', 'bottom')
                        this.showPhoneEditor = false
                    } else {
                        this.password = ''
                        this.cellphoneRepeat = ''
                        this.$vux.toast.text('修改手机号失败：' + res.data.mgs, 'bottom')
                    }
                }).catch((err) => {
                    PSMU.error(err);
                    this.password = ''
                    this.cellphoneRepeat = ''
                    this.$vux.toast.text('修改手机号失败', 'bottom')
                })
            },
            doUpdateEmail() {
                if (this.hasRegistered === null) {
                    this.$vux.toast.text('系统异常，请稍后重试', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.password)) {
                    this.$vux.toast.text('密码不能为空', 'bottom')
                    return
                }

                if (Z_IsEmpty20(this.email)) {
                    this.$vux.toast.text('邮箱为空', 'bottom')
                    return
                }

                if (!this.email.trim().match(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/)) {
                    this.$vux.toast.text('邮箱不合法', 'bottom')
                    return
                }

                if (this.email !== this.emailRepeat) {
                    this.$vux.toast.text('两次输入邮箱不一致', 'bottom')
                    return
                }

                let now = new Date().getTime()
                let postMsg = PSMU.EP({
                    pwd: this.password + "_zsp_" + now,
                    email: this.email + "_zsp_" + now
                })

                PSMU.debug("userSelfEmail ", postMsg)

                this.$http.post("/zingbiz/auth/user/userSelfEmail", {
                    msg: postMsg
                }).then(res => {
                    if (res.data.success) {
                        this.email0 = this.email
                        this.password = ''
                        this.emailRepeat = ''
                        this.$vux.toast.text('修改邮箱成功', 'bottom')
                        this.showEmailEditor = false
                    } else {
                        this.password = ''
                        this.emailRepeat = ''
                        this.$vux.toast.text('修改邮箱失败：' + res.data.mgs, 'bottom')
                    }
                }).catch((err) => {
                    PSMU.error(err);
                    this.password = ''
                    this.emailRepeat = ''
                    this.$vux.toast.text('修改邮箱失败', 'bottom')
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .account-safety, .account-register
        width: 100%
        height: 100%
        background-color #f2f2f2
        flex-center(column, flex-start, flex-start)
        .header, .footer
            width 100%
            flex-shrink 0
        .content
            width 100%
            flex-grow 2
            overflow hidden

    .content
        .wxid
            height 44px
            line-height 44px
            padding 0 13px
            background-color #fff
</style>
