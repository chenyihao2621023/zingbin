import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import ui from './modules/ui'
import user from './modules/user'
import wx from './modules/wx'
import chat from './modules/chat'
import hotel from './modules/hotel'
import createLogger from '../utils/logger'
import vipCard from './modules/vipCard'
import taskChat from './modules/taskChat'
import fixedAssets from './modules/fixedAssets'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    ui,
    user,
    wx, //微信相关的状态
    chat, //聊天
    hotel, // 酒店管理
    vipCard, //会员卡
    taskChat, //任务
    fixedAssets,  //固定资产
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
