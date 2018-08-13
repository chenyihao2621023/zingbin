//任务管理
const taskManage = () => import(/* webpackChunkName: "dinner" */ '@/container/taskManage/taskManage')
const taskList = () => import(/* webpackChunkName: "dinner" */ '@/container/taskManage/taskList')
const taskDetail = () => import(/* webpackChunkName: "dinner" */ '@/container/taskManage/taskDetail')
const addMange = () => import(/* webpackChunkName: "dinner" */ '@/container/taskManage/collectiveManage/addMange')

let routes = [
    {
        path: '/taskManage',
        name: 'taskManage',
        component: taskManage,
    },
    {
        path: '/taskManage/taskList',
        name: 'taskList',
        component: taskList
    },
    {
        path: '/taskManage/taskList/taskDetail',
        name: 'taskDetail',
        component: taskDetail
    },
    {
        path: '/taskManage/collectiveManage/addMange',
        name:'addMange',
        component: addMange
    },
    ]
export { routes }

