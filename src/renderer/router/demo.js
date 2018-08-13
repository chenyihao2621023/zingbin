const Demo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/Demo')
const LoginDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/LoginDemo')
const TestPages = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/TestPages')
const DemoList = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/DemoList')
const NewSrcBase = () =>
    import( /* webpackChunkName: "demo" */ '@/container/newsrcbase/NewSrcBase')
const SubjectPickerDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/subjectpicker/SubjectPickerDemo')
const OrgMemberPickerDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/orgmemberpicker/OrgMemberPickerDemo')
const CascaderDemon = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/CascaderDemon')
const TagGroupDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/taggroup/TagGroupDemo')
const GanttDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/gantt/GanttDemo')
const UsableRoomTableList = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/UsableRoomTableList')
const tableRenderDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/tableRenderDemo')
const ChatList = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/chat/ChatList')
const ExplorerDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/explorer/ExplorerDemo')
const FormDialogDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/formdialog/FormDialogDemo')
const orgListDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/orgList/orgListDemo')
const globalSearchDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/globalSearch/globalSearchDemo')
const readCard = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/ReadCardDemo')
const Agent = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/Agent')
const AxiosDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/AxiosDemo')
const HotelMobile = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/hotelMobile')
const HotelMobileTable = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/hotelMobileTable')
const findDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/findDemo')
/*const Notice = () =>
    import(/!* webpackChunkName: "demo" *!/ '@/container/notice/notice')
const NoticeDetails = () =>
    import(/!* webpackChunkName: "demo" *!/ '@/container/notice/noticeDetails')*/
// const ReceiptDetails = () =>
//     import('@/container/demo/DepositDemo/ReceiptDetails')
const ShareDemo = () =>
    import( /* webpackChunkName: "demo" */ '@/container/demo/wx/ShareDemo')

/*
 所有container/demo目录下的路径都配置在此路由children下，避免混乱
 */
let routes = [
    {
        path: '/demo',
        name: 'demo',
        component: Demo,
        children: [
            {
                path: 'logindemo',
                component: LoginDemo
            },
            {
                path: 'testpages',
                component: TestPages,
                meta: { roles: ['admin'] }
            },
            {
                path: 'demolist',
                component: DemoList
            },
            {
                path: 'axiosDemo',
                component: AxiosDemo
            },
            {
                path: '/newSrcBase',
                name: 'NewSrcBase',
                component: NewSrcBase
            },
            {
                path: 'subjectpicker',
                component: SubjectPickerDemo
            },
            {
                path: 'orgmemberpicker',
                component: OrgMemberPickerDemo
            },
            {
                path: 'cascaderdemon',
                component: CascaderDemon
            },
            {
                path: 'taggroupdemo',
                component: TagGroupDemo
            },
            {
                path: 'ganttdemo',
                component: GanttDemo
            },
            {
                path: 'hotel',
                component: HotelMobile
            },
            {
                path: 'hotelLog',
                component: HotelMobileTable
            },
            {
                path: 'tableRenderDemo',
                component: tableRenderDemo
            },
            {
                path: 'chatList',
                component: ChatList
            },
            {
                path: 'explorerdemo',
                component: ExplorerDemo
            },
            {
                path: 'globalSearchDemo',
                component: globalSearchDemo
            },
            {
                path: 'usableRoomTableList',
                component: UsableRoomTableList
            },
            {
                path: 'formdialog',
                component: FormDialogDemo
            },
            {
                path: 'readCard',
                component: readCard
            },
            {
                path: 'agent',
                component: Agent
            },
            {
                path: 'orgListDemo',
                component: orgListDemo
            },
            {
                path: 'findDemo',
                component: findDemo
            },
            /*{
                path: 'notice',
                component: Notice
            },
            {
                path: 'noticeDetails',
                component: NoticeDetails
            },*/
            {
                path: 'sharedemo',
                component: ShareDemo
            },]
    }]

export { routes }
