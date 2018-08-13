//后台管理
const backstageManage = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/backstageManage')
const backstageManagePage = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/backstageManagePage')
const orgPower = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/orgPower/orgPower')
const noBindingList = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/orgPower/noBindingList')
const bindingApply = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/orgPower/bindingApply')
const powerChoose = () => import(/* webpackChunkName: "dinner" */ '@/container/backstageManage/orgPower/powerChoose')

let routes = [
    {
        path: '/backstageManage',
        component: backstageManage,
        children: [
            {
                path: '',
                redirect: '/backstageManage/backstageManagePage'
            },
            {
                path: 'backstageManagePage',
                name: 'backstageManagePage',
                component: backstageManagePage
            },
            {
                path: 'orgPower',
                name: 'orgPower',
                component: orgPower
            },
            {
                path: 'noBindingList',
                name: 'noBindingList',
                component: noBindingList
            },
            {
                path: 'bindingApply',
                name: 'bindingApply',
                component: bindingApply
            },
            {
                path: 'powerChoose',
                name: 'powerChoose',
                component: powerChoose
            }]
    }
]

export { routes }
