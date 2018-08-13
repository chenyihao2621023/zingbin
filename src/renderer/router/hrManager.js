//人力资源
const hrManager = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/hrManager')
//我的档案
const userInfo = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/userInfo/userInfo')
//档案列表
const hrManagerList = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/hrManagerList/hrManagerList')
//档案详情
const employeeInfoDetails = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/hrManagerList/employeeInfoDetails')
//离职员工详情
const userInfoDetails = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/hrManagerList/userInfoDetails')

//离职列表
const employeeTurnoverList = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/turnover/employeeTurnoverList')
//带交接数据
const transferOfWorkList = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/turnover/transferOfWorkList')

//请假统计
const askForLeaveCalendar = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/askForLeaveCalendar')

//工作日历
const workCalendar = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/workCalendar')

//===薪酬管理
//薪酬管理列表
const userSalaryList = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/userSalaryList')
//考勤制度
const attendanceSystem = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/attendanceSystem')
//工资项管理
const customField = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/customField')
//工资单管理
const payrollList = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/payrollList')
//工资单
const payroll = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/payroll')
//工资变动记录
const salaryChangeList = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalary/salaryChangeList')

const userSalaryReport = () => import(/* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport')
//薪资统计报表
const userSalaryReportList = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/userSalaryReportList')
//职员台账
const zytzReport = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/zytzReport.vue')
//职员台账汇总表
const zytzhzReport = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/zytzhzReport.vue')
//工资发放表
const gzReport = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/gzReport.vue')
//工资汇总表
const gzhzReport = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/gzhzReport.vue')
//工资统计表
const gztjReport = () => import ( /* webpackChunkName: "hr" */ '@/container/hrManager/userSalaryReport/gztjReport.vue')
let routes = [
    {
        path: '/hrManager',
        component: hrManager,
        children: [
            {
                path: 'userInfo',
                component: userInfo
            },
            {
                path: 'hrManagerList',
                component: hrManagerList
            },
            {
                path: 'employeeInfoDetails',
                component: employeeInfoDetails
            },
            {
                path: 'userInfoDetails',
                component: userInfoDetails
            },
            {
                path: 'employeeTurnoverList',
                component: employeeTurnoverList
            },
            {
                path: 'transferOfWorkList',
                component: transferOfWorkList
            },
            {
                path: 'userSalaryList',
                component: userSalaryList
            },
            {
                path: 'attendanceSystem',
                component: attendanceSystem
            },
            {
                path: 'customField',
                component: customField
            },
            {
                path: 'payrollList',
                component: payrollList
            },
            {
                path: 'payroll',
                component: payroll
            },
            {
                path: 'salaryChangeList',
                component: salaryChangeList
            },
            {
                path: 'askForLeaveCalendar',
                component: askForLeaveCalendar
            },
            {
                path: 'workCalendar',
                component: workCalendar
            }
        ]
    },
    {
        path: '/userSalaryReport',
        component: userSalaryReport,
        children: [
            {
                path: 'userSalaryReportList',
                component: userSalaryReportList
            },
            {
                path: 'zytzReport',
                component: zytzReport
            },
            {
                path: 'zytzhzReport',
                component: zytzhzReport
            },
            {
                path: 'gzReport',
                component: gzReport
            },
            {
                path: 'gzhzReport',
                component: gzhzReport
            },
            {
                path: 'gztjReport',
                component: gztjReport
            }
        ] 
    }
]

export { routes }
