const report = () => import( '@/container/report/report')
const restaurant = () => import( '@/container/report/restaurant/restaurant')
const finance = () => import( '@/container/report/finance/finance')
const task = () => import( '@/container/report/task/task')
/**
 * 餐饮报表
 */
//整体销售情况统计
const zhengtixiaoshouqingkuangtongji = () => import( '@/container/report/restaurant/zhengtixiaoshouqingkuangtongji')
//菜品销售情况统计
const caipinxiaoshouqingkuangtongji = () => import( '@/container/report/restaurant/caipinxiaoshouqingkuangtongji')
//员工销售情况统计
const yuangongxiaoshouqingkuangtongji = () => import( '@/container/report/restaurant/yuangongxiaoshouqingkuangtongji')
//日服务整体情况统计
const rifuwuzhengtiqingkuangtongji = () => import( '@/container/report/restaurant/rifuwuzhengtiqingkuangtongji')
//员工服务情况分析
const yuangongfuwuqingkuangfenxi = () => import( '@/container/report/restaurant/yuangongfuwuqingkuangfenxi')
//销售对账表
const xiaoshouduizhangbiao = () => import( '@/container/report/restaurant/xiaoshouduizhangbiao')
//日销售情况统计
const rixiaoshouqingkuangtongji = () => import( '@/container/report/restaurant/rixiaoshouqingkuangtongji')
//点菜营业日报表
const diancaiyingyeribaobiao = () => import( '@/container/report/restaurant/diancaiyingyeribaobiao')
//员工服务菜品详情报表
const yuangongfuwu_caipinmingxi = () => import( '@/container/report/restaurant/yuangongfuwu_caipinmingxi')
//前台结班表
const qiantaijiebanbiao = () => import( '@/container/report/restaurant/qiantaijiebanbiao')
//前台结班表明细
const qiantaijiebanbiaomingxi = () => import( '@/container/report/restaurant/qiantaijiebanmingxi')
/**
 * 酒店报表
 */
/*//房间类型销售额统计
const fangjianleixingxiaoshouetongji = () => import( '@/container/report/hotel/fangjianleixingxiaoshouetongji')

//整体销售情况统计
const hotel_zhengtixiaoshouqingkuangtongji = () => import( '@/container/report/hotel/zhengtixiaoshouqingkuangtongji')*/
/**
 *  任务报表
 */
//任务凭证统计
const task_renwupingzhengtongji = () => import( '@/container/report/task/renwupingzhengtongji')
//任务凭证表单
const task_renwupingzhengform = () => import( '@/container/report/task/taskForm/renwupingzhengForm')
//任务成本统计
const task_renwuchengbentongji = () => import( '@/container/report/task/renwuchengbentongji')
//成员任务统计月报
const task_chengyuanrenwuyuebao = () => import( '@/container/report/task/chengyuanrenwuyuebao')

/**
 *财务报表
 */
//明细分类账
const mingxifenleizhang = () => import('@/container/report/finance/mingxifenleizhang')
//总分类账
const zongfenleizhang = () => import('@/container/report/finance/zongfenleizhang')
//数量金额明细账
const shuliangjinemingxizhang = () => import('@/container/report/finance/shuliangjinemingxizhang')
//数量金额总账
const shuliangjinezongzhang  = () => import('@/container/report/finance/shuliangjinezongzhang')
//科目余额表
const kemuyuebiao  = () => import('@/container/report/finance/kemuyuebiao')
//试算平衡表
const shisuanpinghengbiao  = () => import('@/container/report/finance/shisuanpinghengbiao')
//凭证汇总表
const pingzhenghuizongbiao  = () => import('@/container/report/finance/pingzhenghuizongbiao')
//资产负债表
const zichanfuzhaibiao  = () => import('@/container/report/finance/zichanfuzhaibiao')
//利润表
const lirunbiao  = () => import('@/container/report/finance/lirunbiao')

/**
 * 现金流量
 */
//现金流量模块页
const castFlowMain  = () => import('@/container/report/castflow/castFlowMain')
//T型账户
const txingzhanghu  = () => import('@/container/report/castflow/txingzhanghu')
//核算项目
const hesuanxiangmu  = () => import('@/container/report/castflow/hesuanxiangmu')
//附表项目
const fubiaoxiangmu  = () => import('@/container/report/castflow/fubiaoxiangmu')
//现金流量查询
const xianjinliuliangchaxun  = () => import('@/container/report/castflow/xianjinliuliangchaxun')
//现金流量表
const xianjinliuliangbiao  = () => import('@/container/report/castflow/xianjinliuliangbiao')
//现金流量表修改表
const castFlowEditer  = () => import('@/container/report/castflow/castFlowEditer')
//显示凭证
const revealVoucherInfo = () => import('@/container/report/castflow/revealVoucherInfo')
//指定现金流量明细页面
const appointVoucher = () => import('@/container/report/castflow/appointVoucher')
//指定现金流量附表项目明细页面
const appointAppendVoucher = () => import('@/container/report/castflow/appointAppendVoucher')
let routes = [
    {
        path: '/report',
        component: report,
        children: [
            {
                path:'restaurant',
                name:'restaurant',
                component:restaurant
            },{
                path:'task',
                name:'task',
                component:task
            },  {
                path:'finance',
                name:'finance',
                component:finance
            },{
                path: 'restaurant_ztxsqk',
                name: 'zhengtixiaoshouqingkuangtongji',
                component: zhengtixiaoshouqingkuangtongji,
            },
            {
                path: 'restaurant_cpxsqk',
                name: 'caipinxiaoshouqingkuangtongji',
                component: caipinxiaoshouqingkuangtongji,
            },
            {
                path: 'restaurant_ygxsqk',
                name: 'yuangongxiaoshouqingkuangtongji',
                component: yuangongxiaoshouqingkuangtongji,
            },
            {
                path: 'restaurant_rfwztqk',
                name: 'rifuwuzhengtiqingkuangtongji',
                component: rifuwuzhengtiqingkuangtongji,
            },
            {
                path: 'restaurant_ygfwqkfx',
                name: 'yuangongfuwuqingkuangfenxi',
                component: yuangongfuwuqingkuangfenxi,
            },
            {
                path:'restaurant_xsdzb',
                name:'xiaoshouduizhangbiao',
                component:xiaoshouduizhangbiao
            },{
                path:'restaurant_rxsqktj',
                name:'rixiaoshouqingkuangtongji',
                component:rixiaoshouqingkuangtongji
            },{
                path:'restaurant_dcyyrbb',
                name:'diancaiyingyeribaobiao',
                component:diancaiyingyeribaobiao
            },{
                path:'restaurant_ygfucpmx',
                name:'yuangongfuwu_caipinmingxi',
                component:yuangongfuwu_caipinmingxi
            },{
                path:'restaurant_qtjbb',
                name:'qiantaijiebanbiao',
                component:qiantaijiebanbiao
            },{
                path:'restaurant_qtjbbmx',
                name:'qiantaijiebanbiaomingxi',
                component:qiantaijiebanbiaomingxi
            },
            //任务报表
            {
                path: 'task_rwpz',
                name: 'renwupingzhengtongji',
                component: task_renwupingzhengtongji,
            },{
                path: 'task_rwcb',
                name: 'renwuchengbentongji',
                component: task_renwuchengbentongji,
            },
            {
                path: 'renwupingzhengForm',
                name: 'task_renwupingzhengform',
                component: task_renwupingzhengform,
            },{

                path: 'task_cyrwyb',
                name: 'chengyuanrenwuyuebao',
                component: task_chengyuanrenwuyuebao,
            },
            //财务报表
            {
                path: 'mingxifenleizhang',
                name: 'mingxifenleizhang',
                component: mingxifenleizhang,
            },{
                path: 'zongfenleizhang',
                name: 'zongfenleizhang',
                component: zongfenleizhang,
            },{
                path: 'shuliangjinemingxizhang',
                name: 'shuliangjinemingxizhang',
                component: shuliangjinemingxizhang,
            },{
                path: 'shuliangjinezongzhang',
                name: 'shuliangjinezongzhang',
                component: shuliangjinezongzhang,
            },{
                path: 'kemuyuebiao',
                name: 'kemuyuebiao',
                component: kemuyuebiao,
            },{
                path: 'shisuanpinghengbiao',
                name: 'shisuanpinghengbiao',
                component: shisuanpinghengbiao,
            },{
                path: 'pingzhenghuizongbiao',
                name: 'pingzhenghuizongbiao',
                component: pingzhenghuizongbiao,
            },{
                path: 'zichanfuzhaibiao',
                name: 'zichanfuzhaibiao',
                component: zichanfuzhaibiao,
            },{
                path: 'lirunbiao',
                name: 'lirunbiao',
                component: lirunbiao,
            },
            //现金流量
            {
                path:'txingzhanghu',
                name:'txingzhanghu',
                component:txingzhanghu
            },{
               path:'castFlowMain',
               name:'castFlowMain',
               component:castFlowMain
            },{
                path:'hesuanxiangmu',
                name:'hesuanxiangmu',
                component:hesuanxiangmu
            },{
                path:'fubiaoxiangmu',
                name:'fubiaoxiangmu',
                component:fubiaoxiangmu
            },{
                path:'xianjinliuliangchaxun',
                name:'xianjinliuliangchaxun',
                component:xianjinliuliangchaxun
            },{
                path:'xianjinliuliangbiao',
                name:'xianjinliuliangbiao',
                component:xianjinliuliangbiao

            },{
                path:'castFlowEditer',
                name:'castFlowEditer',
                component:castFlowEditer

            },{
                path:'revealVoucherInfo',
                name:'revealVoucherInfo',
                component:revealVoucherInfo
            },{
                path:'appointVoucher',
                name:'appointVoucher',
                component:appointVoucher
            },{
                path:'appointAppendVoucher',
                name:'appointAppendVoucher',
                component:appointAppendVoucher
            }



        ]
    }
]
export { routes }

