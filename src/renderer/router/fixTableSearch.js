const fixReport = () =>
    import ('@/container/fixReport/fixReport')
const fixReportMain = () =>
    import ('@/container/fixReport/fixReportMain')
    // 固定资产清单
const fixedAssetsList = () =>
    import ('@/container/fixReport/reportQuery/fixedAssetsList')
    //固定资产变动情况表
const fixedAssetsChange = () =>
    import ('@/container/fixReport/reportQuery/fixedAssetsChange')
    //固定增减表
const fixedAssetsIndecrease = () =>
    import ('@/container/fixReport/reportQuery/fixedAssetsIndecrease')
    //折旧费用分配表
const depreAllocatTable = () =>
    import ('@/container/fixReport/reportQuery/depreAllocatTable')
    //固定资产明细账
const fixAssetsAccount = () =>
    import ('@/container/fixReport/reportQuery/fixAssetsAccount')
    //固定资产折旧明细表
const fixAssetsDepreciation = () =>
    import ('@/container/fixReport/reportQuery/fixAssetsDepreciation')
    //固定资产折旧汇总表
const depreciationSumTable = () =>
    import ('@/container/fixReport/reportPage/depreciationSumTable')
    //变更历史记录表
const changeHistoryTable = () =>
    import ('@/container/fixReport/reportPage/changeHistoryTable')
    //固定资产处理表
const disposeTable = () =>
    import ('@/container/fixReport/reportPage/disposeTable')
    //附属设备明细表
const accessoryTable = () =>
    import ('@/container/fixReport/reportPage/accessoryTable')
    //固定资产到期提示表
const fixedAssetsPrompt = () =>
    import ('@/container/fixReport/reportQuery/fixedAssetsPrompt')
    //固定资产数量统计表
const fixedAssetsTotal = () =>
    import ('@/container/fixReport/reportQuery/fixedAssetsTotal')
    //固定资产构成分析表
const compositionAnalysis = () =>
    import ('@/container/fixReport/reportPage/compositionAnalysis')
let routes = [{
    path: '/fixReport',
    component: fixReport,
    children: [{
            path: '',
            name: 'fixReportMain',
            component: fixReportMain
        },
        {
            path: 'fixedAssetsList',
            name: 'fixedAssetsList',
            component: fixedAssetsList
        },
        {
            path: 'fixedAssetsChange',
            name: 'fixedAssetsChange',
            component: fixedAssetsChange
        },
        {
            path: 'fixedAssetsIndecrease',
            name: 'fixedAssetsIndecrease',
            component: fixedAssetsIndecrease
        },
        {
            path: 'depreAllocatTable',
            name: 'depreAllocatTable',
            component: depreAllocatTable
        },
        {
            path: 'fixAssetsAccount',
            name: 'fixAssetsAccount',
            component: fixAssetsAccount
        },
        {
            path: 'fixAssetsDepreciation',
            name: 'fixAssetsDepreciation',
            component: fixAssetsDepreciation
        },
        {
            path: 'depreciationSumTable',
            name: 'depreciationSumTable',
            component: depreciationSumTable
        },
        {
            path: 'changeHistory',
            name: 'changeHistoryTable',
            component: changeHistoryTable
        },
        {
            path: 'disposeTable',
            name: 'disposeTable',
            component: disposeTable
        },
        {
            path: 'accessoryTable',
            name: 'accessoryTable',
            component: accessoryTable
        },
        {
            path: 'fixedAssetsPrompt',
            name: 'fixedAssetsPrompt',
            component: fixedAssetsPrompt
        },
        {
            path: 'fixedAssetsTotal',
            name: 'fixedAssetsTotal',
            component: fixedAssetsTotal
        },
        {
            path: 'compositionAnalysis',
            name: 'compositionAnalysis',
            component: compositionAnalysis
        }
    ]
}]

export { routes }
