//任务管理
const projectManage = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/taskManage')
const taskList = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/taskList')
const taskDetail = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/taskDetail')
const addMange = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/collectiveManage/addMange')
const addChildTask = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/collectiveManage/addChildTask')
const tabulation = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/collectiveManage/tabulation')
const detail = () => import(/* webpackChunkName: "dinner" */ '@/container/projectManage/detail')

let routes = [
    {
        path: '/projectManage',
        name: 'projectManage',
        component: projectManage,
    },
    {
        path: '/projectManage/taskList',
        name: 'taskList',
        component: taskList
    },
    {
        path: '/projectManage/taskList/taskDetail',
        name: 'taskDetail',
        component: taskDetail
    },
    {
        path: '/projectManage/collectiveManage/addMange',
        name: 'addMange',
        component: addMange
    },
    {
        path: '/projectManage/collectiveManage/addChildTask',
        name: 'addChildTask',
        component: addChildTask
    },
    {
        path: '/projectManage/collectiveManage/tabulation',
        component: tabulation
    },
    {
        path: '/projectManage/detail',
        component: detail
    },
    // {
    //   path :'/projectManage/redirect', redirect: { path: '/projectManage' }
    // }

]
export { routes }

