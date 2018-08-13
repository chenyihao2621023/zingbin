import axios from 'axios'
import Qs from 'qs'
import store from '../../store'

/**
 * Created by trto1987 on 2018/7/5.
 */
export class RequestLockedError extends Error {
    constructor(msg, id) {
        super(msg, id)
        this.name = 'RequestLockedError'
    }
}

class OrgDataHandler {

    /**
     * 获取组织数据
     * @returns {Promise}
     * @private
     */
    getOrgRoleUser(companyId = null) {
      return new Promise((resolve, reject) => {
            // 已有缓存数据，返回缓存数据
        if (this._tokenSeed[companyId] && (store.state.ui.tokenSeed === this._tokenSeed[companyId].tokenSeed)) {
          // if (companyId ) {
            if (this._orgRoleUserCompanyDict[companyId]) {
              let orgRoleUserData = this._orgRoleUserCompanyDict[companyId]
              resolve(JSON.parse(JSON.stringify(orgRoleUserData)))
              return;
            }
          // }
        }
        
        // 请求加锁，阻拦相同请求
            if (this._requestCompanyLock[companyId]) {
                reject(new RequestLockedError('此公司组织数据的请求正在进行中'))
                return;
            }
            this._requestCompanyLock[companyId] = true

            // 没有缓存数据，则请求新数据
            let url = '/zingbiz/auth/org/getOrgRoleUser';
            let params = {};
            if (companyId) {
                params.companyId = companyId;
            }
            axios.post(url, params).then(res => {
                // 解除请求锁
                this._requestCompanyLock[companyId] = false

                if (res.data.success && res.data.data['roleDatas'] && res.data.data['orgUserDatas']) {
                    let orgRoleUserData = res.data.data
                    // 加入数据到缓存
                    this._orgRoleUserCompanyDict[companyId] = orgRoleUserData;
                    //每次获取数据更新当前公司 tokenSeed
                    // 当前公司的话更新tokenSeed
                    this._tokenSeed[companyId] = { tokenSeed: store.state.ui.tokenSeed };
                    // if (!companyId) {
                    //     this._tokenSeed['null'] = store.state.ui.tokenSeed
                    // } else {
                    //   this._tokenSeed[companyId] = { tokenSeed: store.state.ui.tokenSeed };
                    // }

                    resolve(JSON.parse(JSON.stringify(orgRoleUserData)))
                } else {
                    reject(new Error('getOrgRoleUser error'))
                    if (PSMU) PSMU.error('getOrgRoleUser error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                // 解除请求锁
                this._requestCompanyLock[companyId] = false

                reject(err)
                if (PSMU) PSMU.error(err)
            })
        })
    }


    getFriends() {
        return new Promise((resolve, reject) => {
            // 有缓存数据则返回缓存数据
            if (this._friendsList.length > 0) {
                let friendsList = this._friendsList
                resolve(JSON.parse(JSON.stringify(friendsList)))
                return;
            }

            if (this._requestFriendsLock) {
                reject(new RequestLockedError('好友数据的请求正在进行中'))
                return;
            }
            this._requestFriendsLock = true

            let url = '/zingbiz/auth/user/serviceFriend/getFriendNumListES?zIsCacheDirect=true&DirectCacheKey=get_friend_num_list_es_param';
            let params = {
                companyId: false,
                type: '',
                tagName: '',
                pageNumber: 1,
                pageSize: 2000
            };
            axios.post(url, params).then(res => {
                this._requestFriendsLock = false

                if (res.data.success) {
                    let friendsList = res.data.data.data || [];
                    this._friendsList = friendsList;
                    resolve(JSON.parse(JSON.stringify(friendsList)))
                } else {
                    reject(new Error('getFriends error'))
                    if (PSMU) PSMU.error('getFriendNumListES error: ' + JSON.stringify(res))
                }
            }).catch(err => {
                this._requestFriendsLock = false

                reject(err)
                if (PSMU) PSMU.error(err)
            });
        })
    }

    /**
     * 好友数据
     * @type {Array}
     * @private
     */
    _friendsList = []
    _requestFriendsLock = false

    /**
     * 组织数据字典，key为公司id
     * @type {Object}
     */
    _orgRoleUserCompanyDict = {}
    _requestCompanyLock = {}

    /**
     * 请求当前公司时候的tokenSeed
     * @type {Object}
     * @private
     */
    _tokenSeed = {}

}

export default new OrgDataHandler()
