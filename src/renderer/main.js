// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import polyfill from 'babel-polyfill'
import App from './App'
// import 'lib-flexible/flexible.js'
import store from './store'
import FastClick from 'fastclick'

import filters from './filters' //将全部过滤器放在 filters/index.js 中便于管理
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { AlertPlugin, ConfirmPlugin, DatetimePlugin, ToastPlugin, WechatPlugin } from 'vux'
import ActionsheetPlugin from './utils/actionsheetPlugin'
import psm from './utils/psm'
import { axiosGlobal, axiosSilent } from './request'
import docCookie from 'utils/cookies'
import jsBridge from './utils/MHAppJSBridge'
import CreateChatPlugin from './plugins/createchat/create-chat'
import ShareMessagePlugin from './plugins/sharemessage/share-message'
import 'assets/stylus/index.styl'
import 'assets/font/iconfont.css'
import F2 from '@antv/f2'
// 关闭 F2 的体验改进计划打点请求
F2.track(false)

if (process.env.NODE_ENV === 'development') Vue.config.devtools = true

filters(Vue)

Vue.use(ActionsheetPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(DatetimePlugin)
Vue.use(polyfill)

Vue.use(ElementUI)

Vue.prototype.PSMU = psm.psmu
/*临时用户密码登陆 此操作要在拦截器前*/
PSMU.setup(router)

Vue.prototype.$http = axiosGlobal(Vue, router)
Vue.prototype.$httpSilent = axiosSilent(Vue)
Vue.use(CreateChatPlugin)
Vue.use(ShareMessagePlugin)
// 微信登录等cookie设置

if (docCookie.getItem('reqtoken')) {
    PSMU.setToken(docCookie.getItem('reqtoken'))
    docCookie.removeItem('reqtoken')
}

if (!PSMU['token'] && docCookie.getItem('Authorization')) {
    PSMU.setToken(docCookie.getItem('Authorization'))
}

// vue全局异常
Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // console.error('vue golbal error', err, vm, info)
    PSMU.error('vue golbal error', err, vm, info)
}

// MH_TestUserAuth ();
// MH_UserSelfPwd('000000','zinglabs');

Vue.prototype.MHAppJSBridge = jsBridge

router.beforeEach((to, from, next) => {
    if (PSMU) PSMU.clean()
    next()
})


Vue.config.productionTip = false
FastClick.attach(document.body)

var _this = new Vue({
    el: '#app',
    store,
    router,
    components: {
        App
    },
    template: '<App/>'
})

/*
 NativeAppHelper.writeDoorCard({
 beginDate:'201703201230',
 endDate:'201703221230',
 name:'张xx',
 roomNo:'105',
 buildNo:'1',
 floorNo:'1'
 });
 /!*这里注意 是异步的 读取不到刚写入的信息*!/
 NativeAppHelper.readDoorCard();

 NativeAppHelper.readIdCard();*/
