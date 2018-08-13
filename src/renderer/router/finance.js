//财务
const finance = () => import(/* webpackChunkName: "finance" */ '@/container/finance/finance')
 
//科目设置
const subjectSetting = () => import(/* webpackChunkName: "finance" */ '@/container/finance/children/subjectSetting') 

//计量单位设置
const measureUnit = () => import(/* webpackChunkName: "finance" */ '@/container/finance/children/measureUnit.vue')

//会计期间设置
const accountingPeriod = () => import(/* webpackChunkName: "finance" */ '@/container/finance/children/accountingPeriod.vue')

//币别设置
const CurrencySetting = () => import(/* webpackChunkName: "finance" */ '@/container/finance/children/CurrencySetting') 
 
//凭证字设置
const VoucherSetting = () => import(/* webpackChunkName: "finance" */ '@/container/finance/children/VoucherSetting') 
 
/*
  所有财务目录下的路径都配置在此路由children下，避免混乱
 */
let routes = [
    {
        path: '/finance',
        component: finance,
        children: [
            {
                path: '',
                redirect: 'subjectSetting'
            },
            {
                path: 'subjectSetting',
                name: 'subjectSetting',
                component: subjectSetting
            },
            {
                path:'measureUnit',
                name:'measureUnit',
                component:measureUnit
            },
            {
                path:'accountingPeriod',
                name:'accountingPeriod',
                component:accountingPeriod,
            },{
                path: 'CurrencySetting',
                name: 'CurrencySetting',
                component: CurrencySetting
            },{
                path: 'VoucherSetting',
                name: 'VoucherSetting',
                component: VoucherSetting
            } 
        ]
    },
]

export { routes }
