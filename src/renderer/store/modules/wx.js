import * as types from '../mutation-types'
/*
 * wx.js中以Status结尾的状态表示请求或者操作过程中的状态，详见utils/wx.js
 */
let state = {
    wxLocationStatus: '',               // 定位状态，preper-准备，success-成功，failed-失败
    wxLocation: {},                     // 定位结果
    wxUploadVoiceStatus: '',            // 上传语音状态， preper-准备，success-成功，failed-失败，complete-结束（vuex watch不到瞬间切换的状态，暂时不提交此状态）
    wxUploadVoice: {},                     // 定位结果
    wxUploadImageStatus: '',            // 上传图片状态， preper-准备，loading-加载中，success-成功，failed-失败，canceled-取消
    wxUploadImage: {},                  // 上传的图片信息
}

//  getters
const getters = {}

//  actions

const actions = {

}

//  mutations

const mutations = {
    [types.SET_WX_LOCATION_STATUS](state, st) {
        state.wxLocationStatus = st
    },
    [types.SET_WX_LOCATION](state, loc) {
        state.wxLocation = loc
    },
    [types.SET_WX_UPLOAD_VOICE_STATUS](state, st) {
        state.wxUploadVoiceStatus = st
    },
    [types.SET_WX_UPLOAD_VOICE](state, voice) {
        state.wxUploadVoice = voice
    },
    [types.SET_WX_UPLOAD_IMAGE_STATUS](state, st) {
        state.wxUploadImageStatus = st
    },
    [types.SET_WX_UPLOAD_IMAGE](state, image) {
        state.wxUploadImage = image
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
