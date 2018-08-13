//订餐
const Dinner = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/dinner')
const dinnerMain = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/dinnerMain')
/*const DeskManager = () => import(/!* webpackChunkName: "dinner" *!/ '@/container/dinner/desk/deskManager')*/
const DeskManager = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/deskNew/deskManagerNew')
const DinnerManage = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/dinnerManage/dinnerManage')
const TagManager = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/tag/tagManager')
/*const PrinterManager = () => import(/!* webpackChunkName: "dinner" *!/ '@/container/dinner/printer/printerManager')*/
const PrinterManager = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/printerNew/printerManagerNew')
/*const DeskList = () => import(/!* webpackChunkName: "dinner" *!/ '@/container/dinner/orderDinner/deskList')*/
const DeskList = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/orderDinner/deskListNew')
const OrderDetails = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/orderDinner/orderDetails')
const OrderList = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/orderDinner/orderList')
const DinnerClazz = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/dinnerManage/dinnerClazz')
const dinnerFinanceManager = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/dinnerFinance/dinnerFinanceManager')
const shop = () => import(/* webpackChunkName: "dinner" */ '@/container/dinner/orderDinner/shop')

let routes = [
    {
        path: '/dinner',
        component: Dinner,
        children: [{
                path: '',
                component: dinnerMain
            },{
                path: 'dinnerManage',
                component: DinnerManage
            },
            {
                path: 'deskManager',
                component: DeskManager
            },
            {
                path: 'tagManager',
                component: TagManager
            },
            {
                path: 'dinnerFinanceManager',
                component: dinnerFinanceManager
            },
            {
                path: 'printerManager',
                component: PrinterManager
            },
            {
                path: 'deskList',
                component: DeskList
            },{
                path: 'orderList',
                component: OrderList
            },{
                path: 'orderDetails',
                component: OrderDetails
            },{
                path: 'dinnerClazz',
                component: DinnerClazz
            },
            {
                path: 'shop',
                component: shop
            }]
    }
]

export { routes }
