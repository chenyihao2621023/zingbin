import axios from 'axios'
import * as types from '../mutation-types'
import { getToken, setToken, removeToken } from '@/utils/auth'

let state = {
    token: getToken(),
    roles: []
}

//  getters
const getters = {}

//  actions

const actions = {
    Login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('SET_TOKEN', 'admin')
                setToken('admin')
                resolve()
            })
        })
    },
    LogOut({commit, state}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resolve()
            }, 0)
        })
    },
    GetUserInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('SET_ROLES', ['admin'])
            }, 0)
            resolve(['admin'])
        })
    }
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}
