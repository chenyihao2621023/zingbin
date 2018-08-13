
//发现
const Find = () =>
    import( /* webpackChunkName:'Find' */ '@/container/find/Find.vue')
const FindMain = () =>
    import( /* webpackChunkName:'Find' */ '@/container/find/FindMain.vue')
const FindComment = () =>
    import(/* webpackChunkName:'Find' */'@/container/find/baseSetting/FindComment.vue')
const AllFindRecord = () =>
    import(/* webpackChunkName:'Find' */'@/container/find/baseSetting/AllFindRecord.vue')
/*
  所有发现目录下的路径都配置在此路由children下，避免混乱
 */
let routes = [
    {
        path: '/find',
        component: Find,
        children:[
            {
                path: '',
                name:'findMain',
                component: FindMain,
            },
            {
                path:'findComment',
                name:'findComment',
                component:FindComment
            },
            {
                path:'allFindRecord',
                name:'allFindRecord',
                component:AllFindRecord
            }

        ]
    }
]


export { routes }
