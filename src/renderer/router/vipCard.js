//酒店管理
const vipCard = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/vipCard')

//支付页面
const exchange = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/children/ExchangeDetail')

//等级设置
const hierarchy = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/children/Hierarchy.vue')

//客户管理
const customer = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/children/CustomerAdminis.vue')

const VipCardManage = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/children/VipCardManage')

const tagManage = () => import(/* webpackChunkName: "vipCard" */ '@/container/vipCard/children/TagManage')

const addMember = () =>
    import( /* webpackChunkName:"vipCard" */ '@/container/cardPackage/newMember.vue')


/*
  所有酒店管理目录下的路径都配置在此路由children下，避免混乱
 */
let routes = [
    {
        path: '/vipCard',
        component: vipCard,
        children: [
            {
                path: '',
                redirect: 'exchange'
            },
            {
                path: 'exchange',
                name: 'exchange',
                component: exchange
            },
            {
                path: 'cardManage',
                name: 'CardManage',
                component: VipCardManage
            },
            {
                path: 'tagManage',
                name: 'tagManage',
                component: tagManage
            },
            {
                path:'hierarchy',
                name:'hierarchy',
                component:hierarchy
            },
            {
                path:'customer',
                name:'customer',
                component:customer
            },
            {
                path:'addMember',
                component:addMember
            }
        ]
    },
]

export { routes }
