//考勤
const attendanceHome = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceHome')
const attenSettingList = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attenSetting/attenSettingList')
const attenSetting = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attenSetting/attenSetting')
const arrangeCalendar = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/arrangeCalendar')
const attenExamine = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attenExamine/attenExamine')
const attendanceCardList = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceCardList')
const attendanceCard = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceCard')
const fieldAttendance = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/fieldAttendance')

//考勤统计
const tj = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tj')
//打卡明细
const tjDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjDetail')
//考勤统计月状态
const tjMonthStatus = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjMonthStatus')
//考勤统计月明细
const tjMonthDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjMonthDetail')
//考勤统计日明细
const tjDayDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjDayDetail')
//考勤统计日历
const attendanceCalendar = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceCalendar')
//考勤统计报表
const tjReport = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjReport')
//考勤统计日报表
const tjReportDay = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjReportDay')
//考勤统计日报表
const tjReportMonth = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/tjReportMonth')

//考勤详情
const attendanceDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceDetail')
//补卡申请页面
const attendanceRepair = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceRepair')
//补卡详情页面
const attendanceRepairDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attendanceRepairDetail')
//外勤审核页面
const attenExamineDetail = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/attenExamine/attenExamineDetail')
//补卡历史记录
const bkReport = () => import(/* webpackChunkName: "attendance" */ '@/container/attendance/bkReport')
let routes = [
    {
        path: '/attendanceHome',
        component: attendanceHome,
        children: [{
                path: 'attenSettingList',
                name: 'attenSettingList',
                component: attenSettingList
            },{
                path: 'attenSetting',
                name: 'attenSetting',
                component: attenSetting
            },{
                path: 'attendanceCardList',
                name: 'attendanceCardList',
                component: attendanceCardList
            },{
                path: 'attendanceCard',
                name: 'attendanceCard',
                component: attendanceCard
            },{
                path: 'fieldAttendance',
                name: 'fieldAttendance',
                component: fieldAttendance
            },{
                path: 'arrangeCalendar',
                name: 'arrangeCalendar',
                component: arrangeCalendar
            },
            {
                path: 'tj',
                name: 'tj',
                component: tj
            },
            {
                path: 'tjDetail',
                name: 'tjDetail',
                component: tjDetail
            },
            {
                path: 'tjDayDetail',
                name: 'tjDayDetail',
                component: tjDayDetail
            },
            {
                path: 'tjMonthStatus',
                name: 'tjMonthStatus',
                component: tjMonthStatus
            },
            {
                path: 'tjMonthDetail',
                name: 'tjMonthDetail',
                component: tjMonthDetail
            },
            {
                path: 'tjReport',
                name: 'tjReport',
                component: tjReport
            },
            {
                path: 'tjReportDay',
                name: 'tjReportDay',
                component: tjReportDay
            },
            {
                path: 'tjReportMonth',
                name: 'tjReportMonth',
                component: tjReportMonth
            },
            {
                path: 'attendanceCalendar',
                name: 'attendanceCalendar',
                component: attendanceCalendar
            },
            {
                path: 'attenExamine',
                name: 'attenExamine',
                component: attenExamine
            },
            {
                path: 'attendanceDetail',
                name: 'attendanceDetail',
                component: attendanceDetail
            },
            {
                path: 'attendanceRepair',
                name: 'attendanceRepair',
                component: attendanceRepair
            },
            {
                path: 'attendanceRepairDetail',
                name: 'attendanceRepairDetail',
                component: attendanceRepairDetail
            },
            {
                path: 'attenExamineDetail',
                name: 'attenExamineDetail',
                component: attenExamineDetail
            },
            {
                path: 'bkReport',
                name: 'bkReport',
                component: bkReport
            }
        ]
    },
]

export { routes }
