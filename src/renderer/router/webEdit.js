//后端页面
const webEditMain = () => import(/* webpackChunkName: "webEdit" */ '@/container/webEdit/backstage/webEditMain');
const GraphicList = () => import(/* webpackChunkName: "webEdit" */ '@/container/webEdit/backstage/GraphicList');
const addGraphic = () => import(/* webpackChunkName: "webEdit" */ '@/container/webEdit/backstage/addGraphic');

const FrontWebEdit = () => import('@/container/webEdit/front/FrontWebEdit');
const ArticleHistory = () => import('@/container/webEdit/front/ArticleHistory');
const Article = () => import('@/container/webEdit/Article');
const webEditInvoice = () => import(/* webpackChunkName: "webEdit" */ '@/container/webEdit/webEditInvoice')

const BusinessIntroduction = () => import('@/container/webEdit/BusinessIntroduction')
let routes = [{
        path: "/webEdit",
        component: webEditMain,
        children: []
    },
    {
        path:"/webSite",
        component:FrontWebEdit,
    },
    {
        path:"/webEdit/articleHistory",
        component:ArticleHistory,
    },
    {
        path:"/graphicList",
        component:GraphicList,
    },
    {
        path:"/addGraphic",
        component:addGraphic,
    },
    {
        path:"/webEditInvoice",
        component:webEditInvoice,
    },
    {
        path: "/webEdit/article",
        component: Article,
    },
    {
        path:"/businessIntroduction",
        component:BusinessIntroduction,
    },
    {
        path:"/businessIntroduction",
        component:BusinessIntroduction,
    }
];
export { routes }

