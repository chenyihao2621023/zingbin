import Vue from 'vue'
import router from './router'
import axios from 'axios'
import { isMhApp } from './utils/fn'
import {
    LoadingPlugin
} from 'vux'
import store from './store'

let BASE_API = ''

/*if (process.env.NODE_ENV === 'development') {
 BASE_API = ""
 } else {
 BASE_API = ""
 }*/

let isShowLoading = false

// axios其他地方也有引用的，需要在里面设置token
// service.defaults.baseURL = BASE_API
axios.defaults.baseURL = ''

Vue.use(LoadingPlugin)

axios.interceptors.request.use(config => {

    if (PSMU.isEmtVal(config.silent) || !config.silent) {
        Vue.$vux.loading.show({
            text: '加载中'
        })
        isShowLoading = true
        window.setTimeout(() => {
                if (isShowLoading) {
                    isShowLoading = false
                    Vue.$vux.loading.hide()
                }
            },
            5000)
    }

    if (!PSMU.isEmtVal(PSMU.token)) {
        config.headers[PSMU.tokenName] = PSMU.token
    }

    return config
}, error => {
    // console.error('axios request error', error)
    if (isShowLoading) {
        isShowLoading = false
        Vue.$vux.loading.hide()
    }

    PSMU.error('axios request error', error)
    return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
    if (isShowLoading) {
        isShowLoading = false
        Vue.$vux.loading.hide()
    }

    if (!PSMU.isEmt(data.data['code']) && (data.data.code === 297 || data.data.code === 299)) {

        if (!router.currentRoute.name || router.currentRoute.name.toLowerCase() !== 'login') {
            if (router.currentRoute.name !== 'login') {
                if (!isMhApp()) {
                    router.push('/login')
                } else {
                    router.push('/nativelogin')
                }
            }
        }

        return Promise.reject(new Error('auth failed'))
    }

    if (data.data['token'] && !PSMU.isEmtVal(data.data.token)) {
        PSMU.setToken(data.data.token)
        store.dispatch('updateTokenSeed')
    }

    if (data.headers && !PSMU.isEmtVal(data.headers['authorization'])) {
        PSMU.setToken(data.headers['authorization'])
        store.dispatch('updateTokenSeed')
    }

    // console.log('axios res', data)

    return data
}, error => {
    // console.error('axios response error', error)
    if (isShowLoading) {
        isShowLoading = false
        Vue.$vux.loading.hide()
    }

    PSMU.error('axios response error', error)
    return Promise.reject(error)
})

export function axiosGlobal (Vue, router) {
    /*
     Vue.use(LoadingPlugin)

     const service = axios.create({
     baseURL: ""
     })

     service.interceptors.request.use(config => {

     if (PSMU.isEmtVal(config.silent) || !config.silent) {
     Vue.$vux.loading.show({
     text: '加载中'
     })
     isShowLoading = true
     window.setTimeout(() => {
     if (isShowLoading) {
     isShowLoading = false
     Vue.$vux.loading.hide()
     }
     },
     5000)
     }

     if (!PSMU.isEmtVal(PSMU.token)) {
     config.headers[PSMU.tokenName] = PSMU.token
     }

     return config
     }, error => {
     // console.error('axios request error', error)
     if (isShowLoading) {
     isShowLoading = false
     Vue.$vux.loading.hide()
     }

     PSMU.error('axios request error', error)
     return Promise.reject(error)
     })
     // http响应拦截器
     service.interceptors.response.use(data => { // 响应成功关闭loading
     if (isShowLoading) {
     isShowLoading = false
     Vue.$vux.loading.hide()
     }

     if (!PSMU.isEmt(data.data['code']) && (data.data.code === 297 || data.data.code === 299)) {

     if (router.currentRoute.name !== 'login') {
     router.push('Login')
     }

     return Promise.reject(new Error('auth failed'));
     }

     if (data.data['token'] && !PSMU.isEmtVal(data.data.token)) {
     PSMU.setToken(data.data.token)
     }

     if (data.headers && !PSMU.isEmtVal(data.headers['authorization'])) {
     PSMU.setToken(data.headers['authorization'])
     }

     // console.log('axios res', data)

     return data
     }, error => {
     // console.error('axios response error', error)
     if (isShowLoading) {
     isShowLoading = false
     Vue.$vux.loading.hide()
     }

     PSMU.error('axios response error', error)
     return Promise.reject(error)
     })
     return service*/

    // 复用axios对象，create出来的少一些方法
    return axios
}

export function axiosSilent (Vue, router) {
    // 另一个axios实例
    const axiosSilent = axios.create({
        baseURL: BASE_API
    })
    axiosSilent.interceptors.request.use(config => {
        if (!PSMU.isEmtVal(PSMU.token)) {
            config.headers[PSMU.tokenName] = PSMU.token
        }
        return config
    }, error => {
        PSMU.error('axios request error', error)
        return Promise.reject(error)
    })
    axiosSilent.interceptors.response.use(data => { // 响应成功关闭loading
        if (!PSMU.isEmt(data.data['code']) && (data.data.code === 297 || data.data.code === 299)) {

            if (router.currentRoute.name !== 'login') {
                if (!isMhApp()) {
                    router.push('/login')
                } else {
                    router.push('/nativelogin')
                }
            }

            return Promise.reject(new Error('auth failed'))
        }

        if (data.data['token'] && !PSMU.isEmtVal(data.data.token)) {
            PSMU.setToken(data.data.token)
            store.dispatch('updateTokenSeed')
        }

        if (data.headers && !PSMU.isEmtVal(data.headers['authorization'])) {
            PSMU.setToken(data.headers['authorization'])
            store.dispatch('updateTokenSeed')
        }

        if (data.headers && !PSMU.isEmtVal(data.headers['Authorization'])) {
            PSMU.setToken(data.headers['Authorization'])
            store.dispatch('updateTokenSeed')
        }

        return data
    }, error => {
        PSMU.error('axios response error', error)
        return Promise.reject(error)
    })
    return axiosSilent
}
