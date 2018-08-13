const fixMoneyMain = () =>
    import ('@/container/fixMoney/fixMoneyMain')
const moneyMain = () =>
    import ('@/container/fixMoney/moneyMain')
const helpMe = () =>
    import ('@/container/fixMoney/helpMe')
    //初始参数
const initParam = () =>
    import ('@/container/fixMoney/basicSetting/initParam')
    //折旧方法
const depreciation = () =>
    import ('@/container/fixMoney/basicSetting/depreciation')
    //变动方式
const changeStyle = () =>
    import ('@/container/fixMoney/basicSetting/changeStyle')
const newStyle = () =>
    import ('@/container/fixMoney/basicSetting/newStyle')
    //使用状态
const useState = () =>
    import ('@/container/fixMoney/basicSetting/useState')
const editUseState = () =>
    import ('@/container/fixMoney/basicSetting/editUseState')
    //工作量管理
const workManage = () =>
    import ('@/container/fixMoney/dailyTreatment/workManage')
    //固定资产生成凭证
const voucher = () =>
    import ('@/container/fixMoney/dailyTreatment/voucher')

const voucherReport = () =>
    import ('@/container/fixMoney/dailyTreatment/voucherReport')
    //折旧管理
const discountManage = () =>
    import ('@/container/fixMoney/dailyTreatment/discountManage')
    //自动对账
const autoAccount = () =>
    import ('@/container/fixMoney/dailyTreatment/autoAccount')
const newCase = () =>
    import ('@/container/fixMoney/dailyTreatment/newCase')

//凭证管理
const voucherManage = () =>
    import ('@/container/fixMoney/dailyTreatment/voucherManage')

const assetType = () =>
    import ('@/container/fixMoney/basicSetting/assetType')
const addAssettype = () =>
    import ('@/container/fixMoney/basicSetting/addAssettype')
const placeStorage = () =>
    import ('@/container/fixMoney/basicSetting/placeStorage')
const addPlaceStorage = () =>
    import ('@/container/fixMoney/basicSetting/addPlaceStorage')
const workQuery = () =>
    import ('@/container/fixMoney/dailyTreatment/workQuery')
const assetManage = () =>
    import ('@/container/fixMoney/dailyTreatment/assetManage')
const seeAssetManage = () =>
    import ('@/container/fixMoney/dailyTreatment/seeAssetManage')
const depreciat = () =>
    import ('@/container/fixMoney/dailyTreatment/depreciat')
const depreciationNext = () =>
    import ('@/container/fixMoney/dailyTreatment/depreciationNext')

const equipment = () =>
    import ('@/container/fixMoney/dailyTreatment/equipment/equipmentMain')
    // 部门分配情况
const deptmentInfo = () =>
    import ('@/container/fixMoney/dailyTreatment/depement/deptmentInfo')
    // 固定资产筛选条件
const searchAssetManage = () =>
    import ('@/container/fixMoney/dailyTreatment/searchAssetManage')
    // 部门科目分配情况
const multiSubjectDept = () =>
    import ('@/container/fixMoney/dailyTreatment/depement/multiSubjectDept')
    // 多币别设置
const dollarTypesMain = () =>
    import ('@/container/fixMoney/dailyTreatment/dollarTypes/dollarTypesMain')
    // 变动历史记录
const changeRecord = () =>
    import ('@/container/fixMoney/dailyTreatment/changeRecord')
    // 固定资产筛选条件
const assetClean = () =>
    import ('@/container/fixMoney/dailyTreatment/assetClean')
let routes = [{
    path: '/fixMoneyMain',
    component: fixMoneyMain,
    children: [{
            path: '',
            name: 'moneyMain',
            component: moneyMain
        },
        {
            path: 'helpMe',
            name: 'helpMe',
            component: helpMe
        },
        {
            path: 'initParam',
            name: 'initParam',
            component: initParam
        },
        {
            path: 'depreciation',
            name: 'depreciation',
            component: depreciation
        },
        {
            path: 'changeStyle',
            name: 'changeStyle',
            component: changeStyle
        },
        {
            path: 'newStyle',
            name: 'newStyle',
            component: newStyle
        },
        {
            path: 'assetType',
            name: 'assetType',
            component: assetType
        },
        {
            path: 'addAssettype',
            name: 'addAssettype',
            component: addAssettype
        },
        {
            path: 'placeStorage',
            name: 'placeStorage',
            component: placeStorage
        },
        {
            path: 'addPlaceStorage',
            name: 'addPlaceStorage',
            component: addPlaceStorage
        },
        //工作量查询
        {
            path: 'workQuery',
            name: 'workQuery',
            component: workQuery
        },
        //资产管理
        {
            path: 'assetManage',
            name: 'assetManage',
            component: assetManage
        },
        //资产管理
        {
            path: 'seeAssetManage',
            name: 'seeAssetManage',
            component: seeAssetManage
        },
        //变动记录
        {
            path: 'changeRecord',
            name: 'changeRecord',
            component: changeRecord
        },
        // 计提折旧提示页面
        {
            path: 'depreciat',
            name: 'depreciat',
            component: depreciat
        },
        {
            path: 'editUseState',
            name: 'editUseState',
            component: editUseState
        },
        // 计提折旧
        {
            path: 'depreciationNext',
            name: 'depreciationNext',
            component: depreciationNext
        },
        {
            path: 'useState',
            name: 'useState',
            component: useState
        },
        {
            path: 'workManage',
            name: 'workManage',
            component: workManage
        },
        {
            path: 'discountManage',
            name: 'discountManage',
            component: discountManage
        },
        {
            path: 'voucher',
            name: 'voucher',
            component: voucher
        },
        {
            path: 'equipment',
            name: 'equipment',
            component: equipment
        },
        // {
        //     path: 'modifyEquipment',
        //     name: 'modifyEquipment',
        //     component: modifyEquipment
        // },
        {
            path: 'autoAccount',
            name: 'autoAccount',
            component: autoAccount
        },
        {
            path: 'deptmentInfo',
            name: 'deptmentInfo',
            component: deptmentInfo
        },
        {
            path: 'newCase',
            name: 'newCase',
            component: newCase
        },
        {
            path: 'voucherManage',
            name: 'voucherManage',
            component: voucherManage
        },
        {
            path: 'multiSubjectDept',
            name: 'multiSubjectDept',
            component: multiSubjectDept
        },
        {
            path: 'searchAssetManage',
            name: 'searchAssetManage',
            component: searchAssetManage
        }, {
            path: 'dollarTypesMain',
            name: 'dollarTypesMain',
            component: dollarTypesMain
        },
        {
            path: 'assetClean',
            name: 'assetClean',
            component: assetClean
        },
        {
            path: 'voucherReport',
            name: 'voucherReport',
            component: voucherReport
        },
    ]
}]

export { routes }