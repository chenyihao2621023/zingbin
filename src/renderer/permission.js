import router from './router'
import store from './store'
import { getToken } from 'utils/auth'

store.dispatch('Login')
const whiteList = ['/login','/nativelogin']

function hasPermission (roles, permissionRoles) {
    if (roles.indexOf('superadmin') >= 0) return true // 最高权限，可以访问任意路由
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

router.beforeEach((to, from, next) => {
    if (getToken()) {
        console.log('已有token')
        if (to.path.toLowerCase() === '/login') {
            next()
        } else {
            store.dispatch('GetUserInfo').then(res => {
                const userRoles = res
                if (hasPermission(userRoles, to.meta.roles)) {
                    next()
                } else {
                    next({path: '/401', replace: true, query: {noGoBack: true}})
                }
            })
        }
    } else {
        if (whiteList.indexOf(to.path.toLowerCase()) !== -1) {
            next()
        } else {
            console.log('进入登录页面')
            next({path: '/login'})
        }
    }

})
