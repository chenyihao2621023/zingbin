import Qs from 'qs'
import axios from 'axios'
import { Z_IsEmpty } from '../../utils/fn'

/**
 * Created by trto1987 on 2018/7/5.
 */
class ChatDataHandler {

    /**
     * 是否初始化
     * @type {boolean}
     */
    hasInit = false

    /**
     * 额外数据是否初始化
     * @type {boolean}
     */
    hasExtraInit = false

    /**
     * 消息提醒开关
     * @type {string} 'true', 'false', 'add'(代表需要新增); 'true'及'add'都代表需要提醒
     */
    alertState = 'true'

    /**
     * 昵称数据字典，key为cardUrl
     * @type {Object}
     */
    nickDataDict = {}

    /**
     * 我的昵称设置
     * @type {Object}
     */
    myNickData = {}

    /**
     * 内部群用户数据字典, key为cardUrl
     * @type {{}}
     */
    orgUserDataDict = {}

    /**
     * 聊天成员信息
     * @type {Array}
     */
    chatUsers = []

    /**
     * 初始化数据
     * @param did
     * @param type
     * @returns {Promise.<void>}
     */
    async init (did, type, cardUrl, companyId) {
        try {
            console.log('<== data-handler init start ==>')
            this.did = did
            this.type = type
            this.cardUrl = cardUrl
            this.companyId = companyId

            // 重置数据
            if (this.hasInit) {
                this.hasInit = false
                this.hasExtraInit = false
                this.alertState = 'true'
                this.nickDataDict = {}
                this.myNickData = {}
                this.orgUserDataDict = {}
                this.chatUsers = []
            }

            let requests = []

            // 昵称设置
            if (this.type === 'ORG' || this.type.toUpperCase() === 'GROUP') {
                requests.push(this._getMyNickData())
                requests.push(this._getNickData())
            }

            // 内部成员数据
            if (this.type === 'ORG') {
                requests.push(this._getOrgUserData())
            }

            // 消息提醒设置
            requests.push(this._getAlertState())

            if (requests.length > 0) {
                await Promise.all(requests)
            }

            this.hasInit = true
            console.log('<== data-handler init end ==>')
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * 销毁方法
     */
    destroy () {
        this.hasInit = false
        this.hasExtraInit = false
        this.alertState = 'true'
        this.nickDataDict = {}
        this.myNickData = {}
        this.orgUserDataDict = {}
        this.chatUsers = []
    }

    /**
     * 初始化额外的数据
     * @returns {Promise.<void>}
     */
    async initExtra () {
        try {
            console.log('<== data-handler initExtra start ==>')
            // 获取聊天成员数据
            switch (this.type) {
                case "CHAT":
                case 'chat':
                    await this._getSingleChatUsers()
                    break;
                case "ORG":
                    await this._getOrgChatUsers()
                    break;
                case "GROUP":
                case "group":
                    await this._getGroupChatUsers()
                    break;
                case "IM":
                    await this._getIMChatUsers()
                    break;
            }

            this.hasExtraInit = true
            console.log('<== data-handler initExtra end ==>')
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * 刷新组织成员数据
     * @returns {Promise.<void>}
     */
    async refreshOrgUserData() {
        if (this.type === 'ORG') {
            await this._getOrgUserData()
        }
    }

    /**
     * 获取卡片信息
     * @param cardUrl
     * @returns {Promise}
     */
    getCardInfo(cardUrl) {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/MENHUWX/MHUser/showCard.action'
            let params = { cardUrl: cardUrl }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                let cardObj = res.data
                if (!Z_IsEmpty(cardObj.Items) && cardObj.Items.length > 0) {
                    let cardInfo = cardObj.Items[0];
                    console.log('== getCardInfo ==', cardInfo)
                    resolve(cardInfo)
                } else {
                    reject(new Error('showCard error'))
                    if (PSMU) PSMU.error('showCard error: ' + JSON.stringify(res))
                }
            }).catch(error => {
                reject(error)
                PSMU.error(error)
            })
        })
    }

    /**
     * 获取昵称设置
     * @returns {Promise}
     * @private
     */
    _getNickData() {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/myCustom/getChatNickname.action'
            let params = {
                chatId: this.did
            }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data.success) {
                    this.nickDataDict = res.data.data.data.reduce((dict, data) => {
                        dict[data.cardUrl] = data
                        return dict
                    }, {})
                    console.log('== getNickData ==', this.nickDataDict)
                    resolve()
                } else {
                    reject(new Error('getNickData error'))
                    if (PSMU) PSMU.error('getChatNickname error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                PSMU.error(err)
            })
        })
    }

    /**
     * 获取我的昵称设置
     * @returns {Promise}
     * @private
     */
    _getMyNickData() {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/myCustom/getMyChatNickname.action'
            let params = { chatId: this.did }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data.success) {
                    if (res.data.data.data.length > 0) {
                        this.myNickData = res.data.data.data[0]
                        console.log('== getMyNickData ==', this.myNickData)
                    }
                    resolve()
                } else {
                    reject(new Error('getMyNickData error'))
                    if (PSMU) PSMU.error('getMyChatNickname error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                PSMU.error(err)
            })
        })
    }

    /**
     * 获取消息提醒设置
     * @returns {Promise}
     */
    _getAlertState() {
        return new Promise((resolve, reject) => {
            let paramsMess = { tarId: this.did };
            let urlMessageFree = `/ZingMH/ZDesk/Message/free/getMessageFree.action`;
            axios.post(urlMessageFree, Qs.stringify(paramsMess), { silent: true }).then(res => {
                if (res.data.success) {
                    if (res.data.data && res.data.data.length > 0) {
                        let { alertState } = res.data.data[0];
                        console.log('== getAlertState ==', alertState)
                        this.alertState = alertState
                    } else {
                        this.alertState = 'add'
                    }
                    resolve()
                } else {
                    reject(new Error('getAlertState error'))
                    if (PSMU) PSMU.error('getMessageFree error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                PSMU.error(err)
            })
        })
    }

    /**
     * 获取组织成员数据
     * @returns {Promise}
     * @private
     */
    _getOrgUserData () {
        return new Promise((resolve, reject) => {
            if (this._isOrgUserDataLoading) return
            this._isOrgUserDataLoading = true

            let url = '/ZingMH/ZDesk/MENHUWX/MHHelper/getProcessedOrgRoleUser.action'
            var params = { 'type': 'user' }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                this._isOrgUserDataLoading = false
                if (res.data && res.data.success && !Z_IsEmpty(res.data.data) && !Z_IsEmpty(res.data.data.users)) {
                    this.orgUserDataDict = res.data.data.users
                    console.log('== getOrgUserData ==', this.orgUserDataDict)
                    resolve()
                } else {
                    reject(new Error('getOrgUserData error'))
                    if (PSMU) PSMU.error('getProcessedOrgRoleUser error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                this._isOrgUserDataLoading = false
                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }

    /**
     * 获取单聊成员数据
     * @returns {Promise}
     * @private
     */
    _getSingleChatUsers () {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/MENHUWX/MHChat/loadPersonChatUsers.action'
            let params = { did: this.did }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data && res.data.success && !Z_IsEmpty(res.data.data.data)) {
                    this.chatUsers = res.data.data.data
                    console.log('== getSingleChatUsers ==', this.chatUsers)
                    resolve()
                } else {
                    reject(new Error('getSingleChatUsers error'))
                    if (PSMU) PSMU.error('loadPersonChatUsers error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }

    /**
     * 获取单聊成员数据
     * @returns {Promise}
     * @private
     */
    _getIMChatUsers () {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/MENHUWX/MHChat/loadIMKeFuUsers.action'
            let params = { did: this.did }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data && res.data.success && !Z_IsEmpty(res.data.data.data)) {
                    this.chatUsers = res.data.data.users
                    console.log('== getIMChatUsers ==', this.chatUsers)
                    resolve()
                } else {
                    reject(new Error('getIMChatUsers error'))
                    if (PSMU) PSMU.error('loadIMKeFuUsers error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }

    /**
     * 获取内部群成员数据
     * @returns {Promise}
     * @private
     */
    _getOrgChatUsers () {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/MENHUWX/MHChat/loadOrgChatUser.action'
            let params = {
                pageNumber: 1,
                pageSize: 2000,
                orgId: this.did,
                hrRealName: 'hrRealName',
                idbid: this.companyId
            }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data && res.data.success && !Z_IsEmpty(res.data.data.data)) {
                    this.chatUsers = res.data.data.data
                    console.log('== loadOrgChatUser ==', this.chatUsers)
                    resolve()
                } else {
                    reject(new Error('loadOrgChatUser error'))
                    if (PSMU) PSMU.error('loadOrgChatUser error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }

    /**
     * 获取内部群成员数据
     * @returns {Promise}
     * @private
     */
    _getGroupChatUsers () {
        return new Promise((resolve, reject) => {
            let url = '/ZingMH/ZDesk/MENHUWX/MHChat/loadGroupChatUser.action'
            let params = {
                pageNumber: 1,
                pageSize: 2000,
                did: this.did,
            }
            axios.post(url, Qs.stringify(params), { silent: true }).then(res => {
                if (res.data && res.data.success && !Z_IsEmpty(res.data.data.data)) {
                    this.chatUsers = res.data.data.data
                    console.log('== getGroupChatUsers ==', this.chatUsers)
                    resolve()
                } else {
                    reject(new Error('getGroupChatUsers error'))
                    if (PSMU) PSMU.error('loadOrgChatUser error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }


    /**
     * 组织用户数据是否加载中
     * @type {boolean}
     */
    _isOrgUserDataLoading = false

}

export default new ChatDataHandler()
