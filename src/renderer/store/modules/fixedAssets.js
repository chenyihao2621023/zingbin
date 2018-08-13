import * as types from '../mutation-types'
import axios from 'axios'

let state = {
    assetsClassData:[],
    changeWayData:[],
    useStateData:[],
    storePlaceData:[],
    voucherData:[],
    depreciationData:{
        "pingjun-nianxian-a":"平均年限法（基于入账原值和入账预计使用期间）",
        "pingjun-nianxian-b":"平均年限法（基于入账净值和入账剩余使用期间）",
        "nianshu-zhonghe":"年数总和法",
        "shuangbei-yue-a":"双倍余额递减法（按年折旧率和年初净值计提）",
        "shuangbei-yue-b":"双倍余额递减法（按月折旧率和月初净值计提）",
        "dongtai-pingjunnian":"动态平均年限法",
        "dongtai-shuangbeiyu-a":"动态双倍余额递减法（按年折旧率和年初净值计提）",
        "dongtai-shuangbeiyu-b":"动态双倍余额递减法（按月折旧率和月初净值计提）",
        "dongtai-nianshu":"动态年数总和法",
        "gongzuoliang":"工作量法",
    },
    methodData:""
}

//  getters
const getters = {}

//  actions

const actions = {
    //资产类别平级
    assetsClass : ({ commit }) => {
        axios.get('/zingbiz/fixedAssets/configuration/getAllAssetsClassConfigurationFlat')
            .then(function (res) {
                commit(types.GET_ASSETS_CLASS, res.data.data)
            })
            .catch(function (err) {
                console.log(err);
            })
    },
    //变动方式
    changeWay : ({ commit }) => {
        axios.get('/zingbiz/fixedAssets/configuration/getAllChangeModeConfigurationFlat')
            .then(function (res) {
                commit(types.GET_CHANGE_WAY, res.data.data)
            })
            .catch(function (err) {
                console.log(err);
            })
    },
    //存储地点
    storePlace : ({ commit }) => {
        axios.get('/zingbiz/fixedAssets/configuration/getAllStorePlaceConfigurationFlat')
            .then(function (res) {
                commit(types.GET_STORE_PLACE, res.data.data)
            })
            .catch(function (err) {
                console.log(err);
            })
    },
    //使用状态
    useState : ({ commit }) => {
        axios.get('/zingbiz/fixedAssets/configuration/getAllWorkingConditionConfigurationFlat')
            .then(function (res) {
                commit(types.GET_USE_STATE, res.data.data)
            })
            .catch(function (err) {
                console.log(err);
            })
    },
    //获取凭证字号
    searchVoucher: ({ commit }) => {
        axios.post("/zingbiz/finance/voucher/searchVoucher",{})
            .then(res => {
                if (res.data.success) {
                    let data = []
                    res.data.data.data.data.forEach(element => {
                        data.push({
                            key:element.voucherId,
                            value:element.voucherName
                        })
                    });
                    commit(types.GET_VOUCHER_CODE,data)
                }
            })
            .catch(function (err) {
                console.log(err);
            })

    },
    // 获取折旧方法
    depreciationMethod:({ commit ,state } , payload) => {
        commit(types.GET_DEPRECIATION_METHOD,state.depreciationData[payload])
    }
}

//  mutations

const mutations = {
    GET_ASSETS_CLASS: (state, value) => {
        state.assetsClassData = value
    },
    GET_CHANGE_WAY: (state, value) => {
        state.changeWayData = value
    },
    GET_STORE_PLACE: (state, value) => {
        state.storePlaceData = value
    },
    GET_USE_STATE: (state, value) => {
        state.useStateData = value
    },
    GET_VOUCHER_CODE: (state, value) => {
        state.voucherData = value
    },
    GET_DEPRECIATION_METHOD:(state, value) => {
        state.methodData = value
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
