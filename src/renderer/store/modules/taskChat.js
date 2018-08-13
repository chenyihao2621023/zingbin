import * as types from '../mutation-types'

let state = {
    insertTexts: [],
    playingVoiceElement: null
}

//  getters
const getters = {}

//  actions

const actions = {

}

//  mutations

const mutations = {
    [types.INSERT_TEXT](state, text) {
        state.insertTexts = text
    },
    [types.SET_PLAYING_VOICE_ELEMENT](state, el) {
        state.playingVoiceElement = el
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
