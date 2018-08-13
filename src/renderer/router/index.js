import Vue from 'vue'
import Router from 'vue-router'
// demo routes
import { routes as demoRoutes } from './demo'
// 资源库路由
import { routes as ziyuankuRoutes } from './ziyuanku'
// 酒店管理页面
import { routes as hotelRoutes } from './hotel'
// 订餐管理页面
import { routes as dinnerRoutes } from './dinner'
// 会员卡
import { routes as vipCardRoutes } from './vipCard'
// 财务
import { routes as finances } from './finance'
// 人力资源
import { routes as hrManagerRoutes } from './hrManager'
// 后台管理
import { routes as backstageManageRoutes } from './backstageManage'
// 考勤
import { routes as attendance } from './attendance'
//外联人
import { routes as outContactMain } from './outContactMain'
//固定资产
import { routes as fixMoney } from './fixMoney'
// 审批流
import { routes as workflow } from './workflow'
// 技能组
import { routes as skillgroup } from './skillgroup'
//任务管理
import { routes as taskManageRoutes } from './taskManage'
//项目管理
import { routes as projectManageRoutes } from './projectManage'
//报表
import { routes as reportRoutes } from './report'
//网站编辑
import { routes as webEdit } from './webEdit'
//公告
import { routes as noticeRoutes } from './notice'
//发现
import { routes as find } from './find'
//固定资产报表

import { routes as fixTableSearch } from './fixTableSearch'

// native app login
const NativeLogin = () => import(/* webpackChunkName: "NativeLogin" */ '@/container/nativelogin/NativeLogin' )
//分类管理
const ClassMain = () =>
    import( /* webpackChunkName: "common" */ '@/container/common/classifymanage/classmain')
const addClass = () =>
    import( /* webpackChunkName: "common" */ '@/container/common/classifymanage/addClass')

//卡包
const cardMain = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/CardMain.vue')
const cardList = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/CardList.vue')
const memberCard = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/MemberCard.vue')
const memberPower = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/MemberPower.vue')
const gradeExplain = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/GradeExplain.vue')
const cardDetail = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/CardDetail.vue')
const newMember = () =>
    import( /* webpackChunkName:"cardMain" */ '@/container/cardPackage/newMember.vue')

// 聊天
const Chat = () =>
    import( /* webpackChunkName:"chat" */ '@/container/chat/Chat')

// 名片页面
const CardDetails = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/CardDetails.vue') //用户名片

// 我的页面搜索账号相关
const SearchMHAccount = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/SearchMHAccount.vue') //用户名片

// 错误页面
const Page401 = () =>
    import( /* webpackChunkName:"page401" */ '@/container/errpage/Page401')
const Page404 = () =>
    import( /* webpackChunkName:"page404" */ '@/container/errpage/Page404')
const MiddleLayer = () =>
    import( /* webpackChunkName:"chat" */ '@/container/chat/MiddleLayer.vue') //跳转
const Login = () =>
    import( /* webpackChunkName:"login" */ '@/container/login/Login')
const HotelLogin = () =>
    import( /* webpackChunkName:"login" */ '@/container/login/HotelLogin')
const DinnerLogin = () =>
    import( /* webpackChunkName:"login" */ '@/container/login/DinnerLogin')
//DropOut 退出
const DropOut = () =>
    import( /* webpackChunkName:"DropOut" */ '@/container/dropOut/DropOut.vue')
const FeaturesService = () =>
    import( /* webpackChunkName:"DropOut" */ '@/container/dropOut/FeaturesService.vue')


const Workbench = () =>
    import( /* webpackChunkName:"workbench" */ '@/container/workbench/Workbench')
//二级三级菜单
const WorkbenchChild = () =>
    import( /* webpackChunkName: "Workbench" */ '@/container/workbench/WorkbenchChild')
const WorkbenchChildThree = () =>
    import( /* webpackChunkName: "Workbench" */ '@/container/workbench/WorkbenchChildThree')
const FrontDesk = () =>
    import( /* webpackChunkName:"fontDest" */ '@/container/frontdesk/FrontDesk')
const CustomerService = () =>
    import( /* webpackChunkName:"fontDest"*/ '@/container/frontdesk/customerService')

const MessageList = () =>
    import( /* webpackChunkName:"messageList" */ '@/container/messagelist/MessageList')
const Me = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/Me')
const MeSetting = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/MeSetting')
const MeCollection = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/MeCollection')
const CreatCompany = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/CreatCompany')
const AccountAndSafety = () =>
    import( /* webpackChunkName:"me" */ '@/container/me/AccountAndSafety')
const Contact = () =>
    import( /* webpackChunkName:"contact" */ '@/container/contact/Contact')

//知识库

const DocumentCabinet = () => import(/* webpackChunkName:"appnote" */ '@/container/appnote/DocumentCabinet.vue')
const ViewText = () => import(/* webpackChunkName:"appnote" */ '@/container/appnote/ViewText.vue')

//文件柜
const Explorer = () => import(/* webpackChunkName:"explorer" */ '@/container/explorer/Explorer.vue')//跳转

//英商好友
const Friends = () => import(/* webpackChunkName:"contact" */ '@/container/contact/Friends.vue')

//我的群组
const MyGroups = () => import(/* webpackChunkName:"contact" */ '@/container/contact/MyGroups.vue')

//新的好友
const NewFriends = () => import(/* webpackChunkName:"contact" */ '@/container/contact/NewFriends.vue')

//同事名录
const OrgList = () =>
    import( /* webpackChunkName:"orgList" */ '@/container/orgList/orgList.vue')

//全局搜索
const GlobalSearch = () =>
    import( /* webpackChunkName:"contact" */ '@/container/globalSearch/globalSearch.vue')

const OtherSettingList = () =>
    import(/* webpackChunkName: "dinner" */ '@/container/otherMenu/otherSettingList')
const OtherSettingEdit = () =>
    import(/* webpackChunkName: "dinner" */ '@/container/otherMenu/otherSettingEdit')
Vue.use(Router)

let route = [
    { path: '/404', component: Page404 },
    { path: '/401', component: Page401 },
    {
        path: '/',
        redirect: '/Workbench'
    },
    {
        path: '/nativelogin',
        name: 'NativeLogin',
        component: NativeLogin
    },
    {
        path: '/Workbench',
        name: 'Workbench',
        component: Workbench,
    },
    {
        path: '/WorkbenchChild',
        name: 'WorkbenchChild',
        component: WorkbenchChild,
    },
    {
        path: '/WorkbenchChildThree',
        name: 'WorkbenchChildThree',
        component: WorkbenchChildThree,
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/dropOut',
        name: 'DropOut',
        component: DropOut
    },
    {
        path: '/featuresService',
        name: 'FeaturesService',
        component: FeaturesService
    },
    {
        path: '/hotelLogin',
        component: HotelLogin
    },
    {
        path: '/dinnerLogin',
        component: DinnerLogin
    },
    {
        path: '/contact',
        component: Contact
    },
    {
        path: '/me',
        component: Me
    },
    {
        path: '/meSetting',
        component: MeSetting
    },
    {
        path: '/meCollection',
        component: MeCollection
    },
    {
        path: '/creatCompany',
        component: CreatCompany
    },
    {
        path: '/account',
        component: AccountAndSafety
    },
    {
        path: '/messagelist',
        component: MessageList
    },
    {
        path: '/frontdesk',
        component: FrontDesk
    },
    {
        path: '/customerService',
        component: CustomerService
    },
    {
        path: '/classmain',
        name: '',
        component: ClassMain
    }, {
        path: '/addClass',
        name: 'addClass',
        component: addClass
    },
    {
        path: '/cardMain',
        name: 'cardMain',
        component: cardMain
    },
    {
        path: '/cardList',
        name: 'cardList',
        component: cardList
    },
    {
        path: '/memberCard',
        name: 'memberCard',
        component: memberCard,
    },
    {
        path: '/memberPower',
        name: 'memberPower',
        component: memberPower,
    },
    {
        path: '/gradeExplain',
        name: 'gradeExplain',
        component: gradeExplain,
    },
    {
        path: '/cardDetail',
        name: 'cardDetail',
        component: cardDetail,
    },
    {
        path: '/newMember',
        name: 'newMember',
        component: newMember,
    },
    {
        path: '/chat',
        name: 'chat',
        component: Chat,
    },
    /*// 转发
     {
     path: '/forward',
     name: 'forward',
     component: Forwarder,
     },*/
    {
        path: '/cardDetails',
        name: 'cardDetails',
        component: CardDetails,
    },
    {
        path: '/searchMHAccount',
        name: 'searchMHAccount',
        component: SearchMHAccount,
    },
    {
        path: '/middleLayer',
        name: 'middleLayer',
        component: MiddleLayer,
    },
    {
        path: '/knowledgebase',
        name: 'documentCabinet',
        component: DocumentCabinet,
    },
    {
        path: '/explorer',
        name: 'explorer',
        component: Explorer,
    },
    {
        path: '/viewText',
        name: 'viewText',
        component: ViewText,
    },

    {
        path: '/orgList',
        name: 'orgList',
        component: OrgList,
    },
    {
        path: '/globalSearch',
        name: 'globalSearch',
        component: GlobalSearch,
    },
    {
        path: '/otherSettingList',
        name: 'otherSettingList',
        component: OtherSettingList,
    },
    {
        path: '/otherSettingEdit',
        name: 'otherSettingEdit',
        component: OtherSettingEdit,
    },
    {
        path: '/friends',
        name: 'friends',
        component: Friends,
    },
    {
        path: '/myGroups',
        name: 'myGroups',
        component: MyGroups,
    },
    {
        path: '/newFriends',
        name: 'newFriends',
        component: NewFriends,
    }
]

//酒店里加入会员卡模块
hotelRoutes[0].children = hotelRoutes[0].children.concat(vipCardRoutes[0].children);

// 加载路由模块
route = route.concat(demoRoutes)
route = route.concat(ziyuankuRoutes)
route = route.concat(hotelRoutes)
route = route.concat(dinnerRoutes)
route = route.concat(vipCardRoutes)
route = route.concat(finances)
route = route.concat(hrManagerRoutes)
route = route.concat(backstageManageRoutes)
route = route.concat(attendance)
route = route.concat(workflow)
route = route.concat(skillgroup)
route = route.concat(taskManageRoutes)
route = route.concat(projectManageRoutes)
route = route.concat(reportRoutes)
route = route.concat(webEdit)
route = route.concat(noticeRoutes)
route = route.concat(outContactMain)
route = route.concat(fixMoney)
route = route.concat(fixTableSearch)
route = route.concat(find)
route = route.concat({ path: '*', redirect: '/404' })
export default new Router({
    routes: route,
    linkActiveClass: 'active'
})
