import Axios from 'axios'
import Qs from 'qs'
import store from '../store'

const THUMB_DEFAULT_SIZE = 200
const THUMB_LARGE_SIZE = 1280

// 返回当前页面相对于窗口显示区左上角的 X ，Y 的位置
export function getScroll(top) {
    let ret = window[`page${top ? 'Y' : 'X'}Offset`]
    const method = `scroll${top ? 'Top' : 'Left'}`
    if (typeof ret !== 'number') {
        const d = window.document
        // ie6,7,8 standard mode
        ret = d.documentElement[method]
        if (typeof ret !== 'number') {
            // quirks mode
            ret = d.body[method]
        }
    }
    return ret
}

// 获取元素top,left,right,bottom的绝对位置
export function getOffset(element, container = document.body) {
    const elRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const clientTop = element.clientTop || container.clientTop || 0
    const clientLeft = element.clientLeft || container.clientLeft || 0
    let top
    let left

    if (container === document.body) {
        top = getScroll(true)
        left = getScroll()

    } else {
        top = container.scrollTop - containerRect.top
        left = container.scrollLeft - containerRect.left
    }

    return {
        top: elRect.top + top - clientTop,
        left: elRect.left + left - clientLeft,
        right: elRect.right + left - clientLeft,
        bottom: elRect.bottom + top - clientTop,
    }
}

function find(list, f) {
    return list.filter(f)[0]
}

export function deepCopy(obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
}

export function forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

export function isPromise(val) {
    return val && typeof val.then === 'function'
}

export function assert(condition, msg) {
    if (!condition) throw new Error(`[vuex] ${msg}`)
}

export function recursiveFilter(forest, search) {
    return forest.filter(leaf => {
        if (leaf['title'].indexOf(search) > -1 || !search.trim()) {
            return true
        } else {
            if (leaf.children) {
                const children = recursiveFilter(leaf.children, search)
                if (children.length > 0) {
                    leaf.children = children
                    return true
                } else {
                    return false
                }
            } else {
                // todo
                return false
            }

        }
    })
}

export function toTreeData(data, parentId) {
    let tree = []
    let temp
    for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
            let obj = data[i]
            temp = toTreeData(data, data[i].fileId)
            if (temp.length > 0) {
                obj.children = temp
            }
            tree.push(obj)
        }
    }

    return tree
}

export function sortBy(list, itemKey) {
    if (!list) return []

    let tmp = deepCopy(list)
    tmp.sort((a, b) => {
        if (a[itemKey] === b[itemKey]) {
            return 0
        }
        if (!a[itemKey]) {
            return -1
        }
        if (!b[itemKey]) {
            return 1
        }
        return a[itemKey] > b[itemKey] ? 1 : -1
    })
    return tmp
}

export function objExtend(objT, objS) {
    Object.keys(objS).forEach(k => {
        objT[k] = objS[k]
    })
}
export function isMhApp() {
    return isMhAndroid() || isMhAppIos()
}

export function isMhElectron() {
    let ua = navigator.userAgent.toLowerCase()
    let r = ua.match(/electroncloud/i)
    if (r && r.length > 0 && r[0] === 'electroncloud') {
        return true
    } else {
        return false
    }
}

export function isMhAndroid() {
    let ua = navigator.userAgent.toLowerCase()
    let r = ua.match(/androidzcloud/i)
    if (r && r.length > 0 && r[0] === 'androidzcloud') {
        return true
    } else {
        return false
    }
}

export function isMhAppIos() {
    let ua = navigator.userAgent.toLowerCase()
    let r = ua.match(/ioszcloud/i)
    if (r && r.length > 0 && r[0] === 'ioszcloud') {
        return true
    } else {
        return false
    }
}

/** 判断是否是Andriod设备 */
export function isAndroid() {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('android') !== -1) {
        return true
    } else {
        return false
    }
}

/** 判断是否是ios设备 */
export function isIos() {
    let ua = navigator.userAgent.toLowerCase()
    let r = ua.match(/iPhone/i)
    if (r && r.length > 0 && r[0] === 'iphone') {
        return true
    }
    let r2 = ua.match(/iPad/i)
    if (r2 && r2.length > 0 && r2[0] === 'ipad') {
        return true
    }
    return false
}

/*判断是否微信*/
export function isWeiXin() {
    let ua = navigator.userAgent.toLowerCase()
    if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
        return true
    } else {
        return false
    }
}

/** 判断是否是pc端 */
export function isPc() {
    if (isIos() || isWeiXin() || isAndroid()) { return false } else { return true }
}

/** 判断是否是iPhoneX */
export function isIPhoneX() {
    return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
}

export function Z_EU(str) {
    return str.replace(/([\u0000-\uFFFF])/g, function ($0) {
        try {
            let char16tmp = parseInt($0.charCodeAt().toString(16), 16)
            if (char16tmp >= 0x2002 && char16tmp <= 0x200d) {
                return ''
            }
        } catch (e) {
            return ''
        }

        if ($0.charCodeAt() <= 16) {
            return '2_3000' + $0.charCodeAt().toString(16)
        }
        else if ($0.charCodeAt() < 256) {
            return '2_300' + $0.charCodeAt().toString(16)
        }
        else {
            return '2_3' + $0.charCodeAt().toString(16)
        }
    })
}
export function Z_DU(str) {
    let duVal = str.replace(/(2_3)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
        return String.fromCharCode(parseInt($2, 16))
    })
    return duVal
}
export function Z_IsEmpty(value) {
    return typeof (value) === 'undefined' || value === null || value === 'undefined'
}
export function Z_IsEmpty20(value) {
    return typeof (value) === 'undefined' || value === null || (typeof (value) === 'string' && (value === 'undefined' || value === '')) || (typeof (value) === 'boolean' && value === false)
}
export function Z_IsNotEmtArray(o) {
    return Z_IsArray(o) && typeof (o.length) && o.length > 0
}

export function Z_IsArray(o) {
    return o && (o instanceof Array) || o.constructor === Array
}

export function createId() {
    return Math.random().toString(36).substring(3, 8)
}

/**
 * 创建群聊
 * @param vueThis vue的this
 */
export function createChat(vueThis) {
    vueThis.$zingp.createChat.show()
}

/**
 * 分享消息到聊天
 * @param vueThis vue实例, this
 * @param link 分享跳转地址
 * @param title 标题
 * @param content 内容
 * @param logoUrl 分享显示图标
 * @param sourceType 分享类型，目前只有'default'和'explorer'
 * @param fileId 文件id，分享文件柜文件需要(sourceType为'explorer')
 */

export function shareMessage(vueThis, link, title, content = '', logoUrl = '/ZingVue/static/images/ysImg.png', sourceType = 'default', fileId = null) {
    vueThis.$zingp.shareMessage.show({
        link: link,
        title: title,
        content: content,
        logoUrl: logoUrl,
        sourceType: sourceType,
        fileId: fileId,
    })
}

/**
 * 转到聊天
 * @param did
 * @param companyId
 * @param chatType
 * @param router
 * @param replaceMode
 */
export function goChat(did, companyId, chatType, router, replaceMode = false) {
    if (!replaceMode) {
        console.log('goChat', did, companyId, chatType)
        router.push({
            path: '/chat',
            query: {
                did: did,
                companyId: companyId,
                chatType: chatType,
                flag: 'goChat'
            }
        })
    } else {
        console.log('replaceChat', did, companyId, chatType)
        router.replace({
            path: '/chat',
            query: {
                did: did,
                companyId: companyId,
                chatType: chatType,
                flag: 'goChat'
            }
        })
    }
}

/**
 * 发起单聊
 * @param cardUrlPeer
 * @param forwardChat 是否跳转到聊天页面
 * @returns {Promise} resolve参数聊天的did
 */
export function doOneChat(cardUrlPeer, forwardChat = true, router = null, replace = false) {
    return new Promise((resolve, reject) => {
        let url = `/NCard/NCardService?ac=initChatInfoV2&cardUrlPeer=${cardUrlPeer}&zIsCacheDirect=true&v=1.13180319_1317`
        Axios.post(url, {}, { silent: true }).then(res => {

            if (res.data.code === 511) {
                let { chatId, type } = res.data.data

                if (forwardChat) {
                    if (!replace) {
                        router.push({
                            path: '/chat',
                            query: {
                                did: chatId,
                                chatType: type,
                                flag: 'doOneChat'
                            }
                        })
                    } else {
                        let did = chatId
                        router.replace({
                            name: 'middleLayer',
                            query: {
                                did,
                                type
                            }
                        })
                    }
                }

                resolve(chatId)
            } else {
                reject(new Error('跳转聊天失败'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export function addTypeCache(cType, url) {
    let retUrl = url
    if (!Z_IsEmpty20(cType) && !Z_IsEmpty20(url)) {
        if (cType === 'zIsCacheOnly') {
            if (url.indexOf('?') !== -1) {
                retUrl += '&zIsCacheOnly=true'
            } else {
                retUrl += '?zIsCacheOnly=true'
            }
        } else if (cType === 'zIsCacheDirect') {
            if (url.indexOf('?') !== -1) {
                retUrl += '&zIsCacheDirect=true'
            } else {
                retUrl += '?zIsCacheDirect=true'
            }
        }
    }
    return retUrl
}

export function mappingChatType(msg) {

    if (PSMU.isEmtVal(msg)) {
        return PSMU.contentType.text
    }

    if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_IMG_MSG) !== -1) {
        return PSMU.contentType.image
    } else if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_EXPLORER_IMG_MSG) !== -1) {
        return PSMU.contentType.image
    } else if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_VOICE_MSG) !== -1) {
        return PSMU.contentType.voice
    } else if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_EMOTION_MSG) !== -1) {
        return PSMU.contentType.emoticon
    } else if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_LOCATION_MSG) !== -1) {
        return PSMU.contentType.location
    } else if (msg.indexOf(PSMU.contentTypeOld.Z_GROUP_LinkCard) !== -1) {
        return PSMU.contentType.linkCard
    } else {
        return PSMU.contentType.text
    }

}

export function getThumbUrl(url, width, height, errPath, compress) { //获取缩略图地址
    if (Z_IsEmpty20(url)) {
        // console.warn('getThumbUrl url empty', url)
        return ''
    }

    if (url.indexOf('ImgRender') !== -1) {
        return url
    }

    if (url.indexOf('checkJpg') === -1 && url.indexOf('checkFile') === -1) {
        console.warn('getThumbUrl url error', url)
        return url
    }

    let retUrl = url
    if (url.indexOf('?') !== -1) {
        retUrl = url.substring(0, url.indexOf('?'))
    }
    let suffix = retUrl.substring(retUrl.lastIndexOf('.'))
    if (suffix !== '.jpg' && suffix !== '.png' && suffix !== '.jpeg' && suffix !== '.bmp') {
        console.warn('getThumbUrl 格式不支持', suffix)
        return url
    }

    if (!width && !height) {
        return '/ImgRender?imgpath=' + retUrl + '&errpath=' + errPath + '&compress=' + compress + '&time=9999.9999&type=' + suffix
    }
    return '/ImgRender?imgpath=' + retUrl + '&thumb=' + width + 'x' + height + '&errpath=' + errPath + '&compress=' + compress + '&time=9999.9999&type=' + suffix

}

export function getImageUrl(url, errorUrl) {  //获取头像地址
    // try{
    //     throw Error()
    // }catch(e){
    //    console.log("getImageUrl stack ",e)
    // }

    if (Z_IsEmpty20(url)) {
        // console.warn('getThumbUrl url empty', url)
        return ''
    }

    if (url.indexOf('ImgRender') !== -1) {
        return url
    }

    if (url.indexOf('checkJpg') === -1 && url.indexOf('checkFile') === -1) {
        console.warn('getThumbUrl url error', url)
        return url
    }

    let retUrl = url
    if (url.indexOf('?') !== -1) {
        retUrl = url.substring(0, url.indexOf('?'))
    }
    let suffix = retUrl.substring(retUrl.lastIndexOf('.'))
    if (suffix !== '.jpg' && suffix !== '.png' && suffix !== '.jpeg' && suffix !== '.bmp') {
        console.warn('getThumbUrl 格式不支持', suffix)
        return url
    }

    return '/ImgRender?imgpath=' + retUrl + '&thumb=' + THUMB_DEFAULT_SIZE + 'x' + THUMB_DEFAULT_SIZE + '&errpath=' + errorUrl + '&time=9999.9999&type=' + suffix
}

export function getOriginUrl(thumbUrl) {   //根据缩略图获取原图地址
    let url = thumbUrl.substring(thumbUrl.indexOf('imgpath='), thumbUrl.indexOf('&'))
    return url.substring(url.indexOf('/'))
}

/**
 * 切换服务号
 * @param companyId
 * @returns {Promise}
 * @constructor
 */
export function MH_changeUserCompany(companyId) {
    return new Promise((resolve, reject) => {
        if (Z_IsEmpty20(companyId)) {
            reject(new Error('companyId为空'))
            return
        }

        console.log('开始切换商号');

        let url = '/zingbiz/auth/user/updateCompany'
        let params = {
            companyId: companyId,
            mustCompanyUser: 1
        }
        Axios.post(url, params).then(res => {
            console.log('切换商号成功');
            resolve()
        }).catch(err => {
            alert("操作失败")
            reject(err)
        })
    })
}

export function Z_DecodeU2(str) {
    let str1 = str.replace(/(2_3)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
        return String.fromCharCode(parseInt($2, 16));
    });
    return str1;
}
export function Z_EncodeU2(str) {
    return str.replace(/([\u0000-\uFFFF])/g, function ($0) {
        try {
            let char16tmp = parseInt($0.charCodeAt().toString(16), 16);
            if (char16tmp >= 0x2002 && char16tmp <= 0x200d) {
                return "";
            }
        } catch (e) {
            return "";
        }

        if ($0.charCodeAt() <= 16) {
            return '2_3000' + $0.charCodeAt().toString(16);
        }
        else if ($0.charCodeAt() < 256) {
            return '2_300' + $0.charCodeAt().toString(16);
        }
        else {
            return '2_3' + $0.charCodeAt().toString(16);
        }
    });
}

export function MH_UserSelfPwd(oPwd, nPwd) {
    return new Promise((resolve, reject) => {
        let now = new Date().getTime();
        let postMsg = PSMU.EP({
            oldPwd: oPwd + "_zsp_" + now
            , pwd: nPwd + "_zsp_" + now
        });
        PSMU.debug("MH_UserSelfPwd ", postMsg)
        Axios.post("/zingbiz/auth/user/userSelfPwd", {
            msg: postMsg
        }).then(res => {
            if (res.data.code === 202) {
                resolve()
            } else {
                reject(new Error("密码设置失败"))
            }
        }).catch((err) => {
            PSMU.error(err);
            reject(err)
        })
    })
}

/*Axios 不支持同步*/
export function MH_UserAuth(phone, email, pwd,appInfo) {
    console.log('MH_UserAuth', phone, email)
    return new Promise((resolve, reject) => {
        let now = new Date().getTime();
        var authInfo={
            phone: phone + "_zsp_" + now
            , email: email + "_zsp_" + now
            , pwd: pwd + "_zsp_" + now
        }

        if(!PSMU.isEmtVal(appInfo)){
            authInfo.appInfo=appInfo
        }
        let postMsg = PSMU.EP(authInfo);
        PSMU.debug("MH_UserAuth ", postMsg)
        $.ajax({
            url: '/zingbiz/auth/user/usePhoneEmail',
            type: 'POST',
            async: false,
            data: PSMU.stringify({
                msg: postMsg
            }),
            timeout: 5000,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
            },
            success: function (data, textStatus, jqXHR) {
                PSMU.debug("MH_UserAuth success ", data)
                if (data.token) {
                    PSMU.setToken(data.token)
                    store.dispatch('updateTokenSeed')
                    resolve()
                } else {
                    reject(new Error('登录失败'))
                }
            },
            error: function (xhr, textStatus) {
                reject(new Error('登录失败'))
            },
            complete: function () {
            }
        })
    })


    /*Axios.post("/zingbiz/auth/user/usePhoneEmail",{
        msg:postMsg
    }).then(res => {


    }).catch((err) => {
        PSMU.error(err);
    })*/
}

export function MH_UserAuth2(username, pwd) {
    return new Promise((resolve, reject) => {
        let now = new Date().getTime();
        let postMsg = PSMU.EP({
            username: username + "_zsp_" + now
            , pwd: pwd + "_zsp_" + now
        });
        PSMU.debug("MH_UserAuth ", postMsg)
        $.ajax({
            url: '/zingbiz/auth/user/useUsername',
            type: 'POST',
            async: false,
            data: PSMU.stringify({
                msg: postMsg
            }),
            timeout: 5000,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
            },
            success: function (data, textStatus, jqXHR) {
                PSMU.debug("MH_UserAuth success ", data)
                if (data.token) {
                    PSMU.setToken(data.token)
                    store.dispatch('updateTokenSeed')
                    resolve()
                } else {
                    reject(new Error('登录失败'))
                }
            },
            error: function (xhr, textStatus) {
                reject(new Error('登录失败'))
            },
            complete: function () {
            }
        })
    })
}


export function logout() {
    return new Promise((resolve, reject) => {
        let now = new Date().getTime();
        Axios.post("/zingbiz/auth/user/logout", {
            time: String(now)
        }).then(res => {
            if (res.data.code === 1) {
                PSMU.setToken("")
                resolve()
            }else{
                reject(new Error('登出失败'))
            }
        }).catch((err) => {
            PSMU.error(err);
            reject(new Error('登出失败'))
        })
    })
}


export function MH_TestUserAuth() {
    Axios.post("/zingbiz/auth/user/testAuthOrWithCompanyParam", {
        nowCompanyId: 'company73570940000000101'
    }).then(res => {


    }).catch((err) => {
        PSMU.error(err);
    })
}

export function MH_Browser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    } //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1 && !isOpera) {
        return "IE";
    } //判断是否IE浏览器
}

function decimalAdjust(type, svalue, sexp) {
    // If the exp is undefined or zero...
    if (typeof sexp === 'undefined' || Number(sexp) === 0) {
        return Math[type](svalue);
    }

    let value = Number(svalue);
    let exp = Number(sexp);
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](Number((value[0] + 'e' + (value[1] ? (Number(value[1]) - exp) : -exp))));
    // Shift back
    value = value.toString().split('e');
    return Number((value[0] + 'e' + (value[1] ? (Number(value[1]) + exp) : exp)));
}

// Decimal round
export function round10(value, exp) {
    return decimalAdjust('round', value, exp);
}

// Decimal floor
export function floor10(value, exp) {
    return decimalAdjust('floor', value, exp);
}

// Decimal ceil
export function ceil10(value, exp) {
    return decimalAdjust('ceil', value, exp);
}

export function formatFileSize(sizeOrigin) {
    let sizeStr
    let size = sizeOrigin
    if (sizeOrigin < 0) {
        console.warn('formatFileSize: incorrect fileSize ', sizeOrigin)
        size = 0;
    }
    if (size < 1024) {
        sizeStr = size + 'B'
    }
    else if (size < 1024 * 1024) {
        let temp = round10(size / 1024, -2)
        sizeStr = temp + 'KB'
    }
    else if (size < 1024 * 1024 * 1024) {
        let temp = round10(size / (1024 * 1024), -2)
        sizeStr = temp + 'MB'
    }
    else {
        let temp = round10(size / (1024 * 1024 * 1024), -2)
        sizeStr = temp + 'GB'
    }
    return sizeStr
}

export function getAppName() {
    return PSMU.isEmtVal(window.Config.zingname)?'英商':window.Config.zingname
}

export function getInfoUrl() {
    return PSMU.isEmtVal(window.Config.infoUrl)?location.origin + '/ZingVue/index.html#/Login':window.Config.infoUrl
}
