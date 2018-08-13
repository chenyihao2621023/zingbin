import * as types from '../mutation-types'
import axios from 'axios'

//state
let state = {
    addGradeList: {
        rankNum: '',
        rankName: '',
        startGrowUp: 0,
        EndGrowUp: '',
        growthRange: '',
        subtractQuantity: ''
    }
};

//  getters
const getters = {};

//  actions
const actions = {
    addGradeSet: ({ commit }, payload) => {
        console.log(payload);
        commit(types.VIP_CARD_ADD_GRADE, payload)
    }
};

//  mutations
const mutations = {
    [types.VIP_CARD_ADD_GRADE](state, value) {
        state.addGradeList = value
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}