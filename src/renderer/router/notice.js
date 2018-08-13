//公告
const notice = () =>
    import(/* webpackChunkName: "notice" */ '@/container/notice/noticeUrl')
const NoticeList = () =>
    import(/* webpackChunkName: "notice" */ '@/container/notice/notice')
const NoticeDetails = () =>
    import(/* webpackChunkName: "notice" */ '@/container/notice/noticeDetails')

let routes = [
    {
        path: '/notice',
        component: notice,
        children: [
            {
                path: 'noticeList',
                component: NoticeList
            },{
                path: 'noticeDetails',
                component: NoticeDetails
            }
        ]
    }
]

export { routes }
