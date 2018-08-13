const skillgroupHome = () =>
    import ('@/container/customerService/skillGroupHome')

const skillGroupManage = () =>
    import ('@/container/customerService/skillGroupManage')
let routes = [{
    path: '/skillgroup',
    component: skillgroupHome,
    children: [{
            path: '',
            name: 'skillgroupHome',
            component: skillgroupHome
        },
        {
            path: 'skillGroupManage',
            name: 'skillGroupManage',
            component: skillGroupManage
        }
    ]
}]
export { routes }