import axios from 'axios'
import * as types from '../mutation-types'
import _ from 'lodash'
let state = {
    isMode: false,
    dropDownFlag: false,
    hotelList: [],
    redPoint: '',
    bottomToast: '',
    powerList: [],
    userInfo: [],
    /**
     * 服务号列表
     */
    serverNumberList: [],
    /**
     * 当前cardUrl
     */
    currentCardUrl: '',
    /**
     * 登录token变化更新此标志
     */
    tokenSeed: 1,
}

let isNeesSeet = [];
let isSuccess = false;
let isNeedSetting = false;

//  getters
const getters = {
    isHasPower: (state) => (value, _this) => {
        let isPower =  (powerList) => {
            let  assceObject = {};
            if (typeof _this[value] === 'boolean') {
                for (let i = 0; i < powerList.length; i++) {
                    if (powerList[i].resInfoVal === value) {
                        _this[value] = true
                        break
                    }
                }
            } else if (typeof _this[value] === 'object') {
                let list = Object.keys(_this[value])
                list.forEach(item => {
                    var localPower = _.find(powerList,power => {
                        return power.resInfoVal === item
                    });
                    if (!_.isEmpty(localPower)) {
                        assceObject[item] = true
                    } else {
                        assceObject[item] = false
                    }

                    _this[value] = assceObject
                });

            }
        }
        if (isSuccess) {
            isPower(state.powerList)
        } else {
            isNeedSetting = true;
            isNeesSeet.push({ value,_this })
        }
    },
    getCurrentCardUrl: (state) => {
        return state.currentCardUrl;
    }
}

//  actions
let _loadServerNumberLock = false
let _getCurrentCardUrlLock = false

const actions = {
    loadRedPoint: ({ commit }, payload) => {
        let url = '/ZingMH/ZDesk/MENHUWX/MHUser/loadCard.action'
        axios.post(url, { payload }, { silent: true })
            .then(res => {
                // console.log(res.data.status)
                commit(types.SET_REDPOINT, res.data.status + '_ZSP_version:' + new Date().getTime())
                if (res.data.Items.length > 0) {
                    /**
                     * 存储当前用户基本信息，headImg currentCompanyId cardUrl等 todo:user.js 减少请求写在这里
                     */
                    commit(types.SET_USERINFO, res.data.Items[0])
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    loadPowerList: ({ commit }, payload) => {
        let  assceObject = {};
        let url = '/zingbiz/auth/role/loadMyRole'
        axios.post(url, { payload }, { silent: true }).then(res => {
            console.log(res)
            commit(types.SET_POWER_LIST, res.data.data)
            isSuccess = true;
            if (isNeedSetting) {
                let powerList = res.data.data;
                let powerMap = {};
                for (let j = 0; j < powerList.length; j++) {
                    powerMap[powerList[j].resInfoVal] = powerList[j];
                }
                for (let i = 0; i < isNeesSeet.length; i++) {
                    if (typeof isNeesSeet[i]._this[isNeesSeet[i].value] === 'boolean') {
                        if (typeof powerMap[isNeesSeet[i].value] !== 'undefined') {

                            isNeesSeet[i]._this[isNeesSeet[i].value] = true
                        }
                    } else if (typeof isNeesSeet[i]._this[isNeesSeet[i].value] === 'object') {
                        let list = Object.keys(isNeesSeet[i]._this[isNeesSeet[i].value] )
                        list.forEach(item => {
                            if (typeof powerMap[item] !== 'undefined') {
                                // isNeesSeet[i]._this[isNeesSeet[i].value][item] = true
                                assceObject[item] = true;
                            }else{
                                assceObject[item] = false;
                            }
                        });
                        isNeesSeet[i]._this[isNeesSeet[i].value] = assceObject
                    }
                }
            }
        }).catch(err => {
            if (PSMU) PSMU.error(err)
        })
    },
    /**
     * 获取服务号列表
     * @param commit
     * @param payload
     */
    loadServerNumber: ({ commit }, payload) => {
        if (state.serverNumberList && state.serverNumberList.length > 0) return

        // 判断是否有请求锁
        if (_loadServerNumberLock) return
        _loadServerNumberLock = true

        let url = '/zingbiz/auth/org/loadServerNumber'
        axios.get(url, { silent: true }).then(res => {
            // 解除请求锁
            _loadServerNumberLock = false

            if (res.data.retcode !== -1) {
                console.log('[ui] - loadServerNumber', res.data.data)
                commit(types.SET_SERVICE_NUMBER_LIST, res.data.data)
            } else {
                console.error('error loadServerNumber data', res.data)
                if (PSMU) PSMU.error('error loadServerNumber data: ' + JSON.stringify(res))
            }
        }).catch(err => {
            // 解除请求锁
            _loadServerNumberLock = false

            if (PSMU) PSMU.error(err)
        })
    },
    /**
     * 获取用户cardUrl
     * @param commit
     * @param payload
     */
    loadCurrentCardUrl: ({commit}, payload) => {
        if (state.currentCardUrl) return

        // 判断是否有请求锁
        if (_getCurrentCardUrlLock) return
        _getCurrentCardUrlLock = true

        let url = '/zingbiz/auth/user/getThisUserInfo'
        axios.post(url, {}, { silent: true }).then(res => {
            // 解除请求锁
            _getCurrentCardUrlLock = false

            if (res.data.success) {
                console.log('[ui] - getCurrentCardUrl', res.data.data.cardUrl)
                commit(types.SET_CURRENT_CARDURL, res.data.data.cardUrl)
            } else {
                console.error('error getCurrentCardUrl data', res.data)
                if (PSMU) PSMU.error('error getCurrentCardUrl data: ' + JSON.stringify(res))
            }
        }).catch(err => {
            // 解除请求锁
            _getCurrentCardUrlLock = false

            if (PSMU) PSMU.error(err)
        })
    },
    updateTokenSeed: ({commit}, payload) => {
        commit(types.UP_TOKEN_SEED, 1)
    },
}

//  mutations
const mutations = {
    [types.SET_MODE](state, bool) {
        state.isMode = bool
    },
    [types.RESET_DROPDOWN](state) {
        state.dropDownFlag = !state.dropDownFlag
    },
    [types.SET_HOTEL_LIST]: (state, value) => {
        state.hotelList = value
    },
    [types.SET_REDPOINT](state, value) {
        state.redPoint = value
    },
    [types.SET_USERINFO](state, value) {
        state.userInfo = value
    },
    [types.SET_BOTTOM_TOAST](state, msg) {
        state.bottomToast = msg
    },
    [types.SET_POWER_LIST]: (state, value) => {
        state.powerList = value
    },
    [types.SET_SERVICE_NUMBER_LIST]: (state, value) => {
        state.serverNumberList = value
    },
    [types.SET_CURRENT_CARDURL]: (state, value) => {
        state.currentCardUrl = value
    },
    [types.UP_TOKEN_SEED]: (state, value) => {
        state.tokenSeed += value
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
