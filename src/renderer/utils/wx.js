/**
 * 处理weixin和app依赖及相关业务逻辑的模块
 */
import wxLib from '../plugins/jweixin-1.2.0'
import wxApp from '../plugins/jweixinapp-1.2.0'

import axios from 'axios'

import Qs from 'qs'

import store from '../store'
import {
  SET_BOTTOM_TOAST,
  SET_WX_LOCATION,
  SET_WX_LOCATION_STATUS,
  SET_WX_UPLOAD_IMAGE,
  SET_WX_UPLOAD_IMAGE_STATUS,
  SET_WX_UPLOAD_VOICE,
  SET_WX_UPLOAD_VOICE_STATUS
} from '../store/mutation-types'

import { isMhApp, isWeiXin, Z_EU, Z_IsEmpty, Z_IsEmpty20, Z_IsNotEmtArray } from './fn'
import { wxServerLog } from './logger'

/*
 * 动态加载jweixin和jweixinapp，使用import wx from 'utils/wx'导入
 */
let wx

// console.log(isWeiXin())
// console.log(isMhApp())

if (isWeiXin()) {
  console.log('wx.js load jweixin-1.2.0')
  wx = wxLib
}
else if (isMhApp()) {
  console.log('wx.js load jweixinapp-1.2.0')
  wx = wxApp
}

// console.log('wx.js loaded', wx)
export default wx

/*
 * 微信和app上使用的工具函数，使用import { getWXLocationHX } from 'utils/wx'方式导入
 */
if (wx) {
  wx.error(function (res) {
    console.error('wx.error', res)
  })

  wx.onVoiceRecordEnd({
    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
    complete: function (res) {
      store.commit(SET_BOTTOM_TOAST, '录音失败：声音长度超过1分钟')
      // isUpdateRecord="true";
      // var localId = res.localId;
      stopuploadVoice()
      // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, res);
      // alert(localId);
    }
  })
}

// console.log(store)
// console.log(SET_WX_LOCATION_STATUS)
// console.log(SET_WX_LOCATION)

let wid
let QQ_MAP_SECRETKEY
let QQ_MAP_REFERER
window.addEventListener('load', evt => {
  let count = 0
  let wxParamsInit = () => {

    if (window.Config) {
      wid = window.Config && window.Config.wid
      QQ_MAP_SECRETKEY = window.Config && window.Config.QQ_MAP_SECRETKEY || 'DLRBZ-R5O3P-QU4D7-LGCBI-KP6EJ-3MBSP'
      QQ_MAP_REFERER = window.Config && window.Config.QQ_MAP_REFERER || '英立讯科技测试'
    } else {
      if (++count > 10) {
        store.commit(SET_BOTTOM_TOAST, '网络连接失败，请稍后重试')

        console.error('wxParamsInit error')
        wxServerLog('wxParamsInit error after page load 1000 sec')
        return
      }
      window.setTimeout(wxParamsInit, 100)
    }
  }

  wxParamsInit()
})
/**
 * 获取当前位置
 */
function getWXLocationHX () {
  console.log('getWXLocationHX')
  store.commit(SET_WX_LOCATION_STATUS, 'preper')
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      try {
        let latitude = res.latitude
        let longitude = res.longitude
        let speed = res.speed
        let accuracy = res.accuracy
        console.log('getLocation success', latitude, longitude, speed, accuracy, res)

        // pageSendMsg(nick + " : Z_GROUP_LOCATION_MSG" + latitude + "_" + longitude);
        // sendWXAlert(isAlert);

        store.commit(SET_WX_LOCATION_STATUS, 'success')
        store.commit(SET_WX_LOCATION, {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
          addr: ''
        })
      } catch (err) {
        store.commit(SET_WX_LOCATION_STATUS, 'failed')

        console.error(err.message + ' ' + err.stack)
        wxServerLog('{getWXLocationHX} ' + JSON.stringify(err.message) + ' ' + JSON.stringify(err.stack))
      }
    },
    fail: function (res) {
      store.commit(SET_WX_LOCATION_STATUS, 'failed')

      console.log('getLocation fail', res)
      wxServerLog('{getWXLocationHX} getLocation fail' + JSON.stringify(res))
    }
  })
}

/**
 * 显示位置
 * @param pos
 */
function dispWXLocationHX (pos) {
  //latitude_longitude
  if (!Z_IsEmpty20(pos) && pos.indexOf('_') !== -1) {
    let posArr = pos.split('_')
    let latitudeTmp = parseFloat(posArr[0])
    let longitudeTmp = parseFloat(posArr[1])
    // wxServerLog("dispWXLocationHX float " + latitudeTmp + " " + longitudeTmp);
    wx.openLocation({
      latitude: latitudeTmp,
      longitude: longitudeTmp,
      name: '所在位置',
      address: '所在地址',
      scale: 13,
      infoUrl: ''
    })
  }
}

/**
 * 调用腾讯地图获取地理位置信息，返回格式如下：
 {
    "module":"geolocation",
    "nation": "中国",
    "province": "广州省",
    "city":"深圳市",
    "district":"南山区",
    "adcode":"440305", //行政区ID，六位数字, 前两位是省，中间是市，后面两位是区，比如深圳市ID为440300
    "addr":"深圳大学杜鹃山(白石路北250米)",
    "lat":22.530001, //火星坐标(gcj02)，腾讯、Google、高德通用
    "lng":113.935364,
    "accuracy":13 //误差范围，以米为单位
}
 * @param timeout 超时时间（毫秒）,不传默认6s
 * @param success 成功回调函数
 * @param fail 失败回调函数
 */
function getQMapLocation () {
  console.log('QQ_MAP_SECRETKEY   ', QQ_MAP_SECRETKEY)
  console.log('QQ_MAP_REFERER   ', QQ_MAP_REFERER)
  if (QQ_MAP_SECRETKEY == undefined || QQ_MAP_REFERER == undefined) {
    QQ_MAP_SECRETKEY = 'DLRBZ-R5O3P-QU4D7-LGCBI-KP6EJ-3MBSP'
    QQ_MAP_REFERER = '英立讯科技测试'
  }
  let geolocation = new qq.maps.Geolocation(QQ_MAP_SECRETKEY, QQ_MAP_REFERER)

  store.commit(SET_WX_LOCATION_STATUS, 'preper')

  geolocation.getLocation(position => {
    // 定位成功
    store.commit(SET_WX_LOCATION_STATUS, 'success')
    store.commit(SET_WX_LOCATION, {
      latitude: position.lat,
      longitude: position.lng,
      accuracy: position.accuracy,
      addr: position.addr
    })
  }, () => {
    // 定位失败
    store.commit(SET_WX_LOCATION_STATUS, 'failed')
  }, 6000)
}

/**
 * 腾讯地图获取显示当期位置的src
 * 前端若要显示地图，需配合iframe组件显示
 * @param title  位置标题，默认为“我的位置”
 * @param position 位置信息，须包括经纬度及地址描述
 */
function getQMapLocationSrc (position, title) {
  let baseUrl = 'https://apis.map.qq.com/tools/poimarker'
  let positionTitle = title || '我的位置'
  let markUrl = `?marker=coord:${position.lat},${position.lng};title:${positionTitle}`
  if (position.addr || position.city) {
    markUrl += `;addr:${(position.addr || position.city)}`
  }
  var keyurl = `&key=${QQ_MAP_SECRETKEY}&referer=${QQ_MAP_REFERER}`
  return baseUrl + markUrl + keyurl
}

let startRecordTimeout
let recordTime
let isUpdateRecord = false

/**
 * 获取聊天微信上传图片或语音的参数工具方法
 * @param did 聊天id
 * @param dtype 聊天类型 group, chat, im, WOOW, KH_ORDER, ORG, help
 * @returns {{}}
 */
function getChatVoiceImgParam (did, dtype, companyId) {
  let paramTmp = {}
  paramTmp.bId = 'false'
  paramTmp.bType = 'false'

  switch (dtype) {
    case 'group':
    case 'GROUP':
    case 'chat':
    case 'im':
    case 'IM':
    case 'WOOW':
    case 'KH_ORDER':
    case 'ORG':
    case 'help':
      paramTmp.bId = did
      paramTmp.bType = dtype
      paramTmp.companyId = companyId
      break
  }

  // wxServerLog("getVoiceImgParam " + paramTmp.bId + " " + paramTmp.bType);
  return paramTmp
}

// 上传结束后才改变录音状态
function stopuploadVoice () {
  isUpdateRecord = false
  recordTime = 0
  // vuex watch不到瞬间切换的状态，暂时不提交此状态
  // store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'complete')
  // unShowMaskAndToast();
}

function wxUploadVoice (paramTmp, wxRes) {
  let localId = wxRes.localId
  wx.uploadVoice({
    localId: localId,
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: function (res) {
      let serverId = res.serverId
      serverId = Z_EU(serverId)

      var uparam = {
        'wid': wid,
        'serverId': serverId,
        'type': 'Z_GROUP_VOICE_MSG',
        'bId': paramTmp['bId'],
        'bType': paramTmp['bType'],
      }

      if (paramTmp['companyId']) {
        uparam['companyId'] = paramTmp['companyId']
      }

      let url = '/WXINFO/WXSDK/weixin?ajaxAction=WX_AJAX_UPLOAD_MEDIA'
      let postParam = {
        wid: uparam.wid,
        serverId: uparam.serverId,
        type: uparam.type,
        bId: uparam.bId,
        bType: uparam.bType
      }
      if (uparam['companyId']) postParam['companyId'] = uparam.companyId
      //
      // url += '&wid=' + uparam.wid
      // url += '&serverId=' + uparam.serverId
      // url += '&type=' + uparam.type
      // url += '&bId=' + uparam.bId
      // url += '&bType=' + uparam.bType
      // if (uparam['companyId']) url += '&companyId=' + uparam.companyId
      axios.post(url, Qs.stringify(postParam), {silent: true}).then(data => {
        // 不加上传成功提示，会在页面中看到
        let voice = data.data
        if (!Z_IsEmpty(voice) && !Z_IsEmpty(voice.retcode) && voice.retcode === 0) {
          //返回本地因ID用于试听
          voice.localId = localId
          voice.recordTime = recordTime
          console.log('upload voice success', voice)
          store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'success')
          store.commit(SET_WX_UPLOAD_VOICE, voice)
          // unShowMaskAndToast();
          // sendWXAlert(paramTmp.isAlert);
        } else {
          console.log('upload voice failed', data)
          wxServerLog('{wxUploadVoice} upload voice failed ' + JSON.stringify(data))
          store.commit(SET_BOTTOM_TOAST, '上传失败，请稍后重试')
          store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'failed')
          // unShowMaskAndToast();
        }

        stopuploadVoice()
      }).catch(err => {
        stopuploadVoice()
        store.commit(SET_BOTTOM_TOAST, '网络连接失败，请稍后重试')
        store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'failed')

        console.log(err)
        wxServerLog('{wxUploadVoice} upload voice failed ' + JSON.stringify(err.message) + ' ' + JSON.stringify(err.stack))
        // unShowMaskAndToast();
      })
    },
    fail: function (res) {
      store.commit(SET_BOTTOM_TOAST, '录音失败请稍后重试')
      stopuploadVoice()

      console.error('uploadVoice fail', res)
    },
    appComplete: function () {
      // console.log('appComplete');
      stopuploadVoice()
    }
  })
}

/**
 * 开始或停止录音
 * @param params 录音相关参数，聊天请使用getChatVoiceImgParam生成
 */
function startUploadVoice (params) {
  if (!params) {
    alert('startUploadVoice params为空')
  }

  let paramTmp = params

  paramTmp.isAlert = false
  paramTmp.wid = wid
  paramTmp.type = 'Z_GROUP_VOICE_MSG'

  if (paramTmp.bId === 'false') {
    alert('touchendUploadVoice param.bId为空')
    return
  }

  if (recordTime === 0) {
    // $(".startRecord").html('停止录音');
    // 通过短暂的延迟避免'开始录音有一小段时间不能停止的'问题
    startRecordTimeout = setTimeout(() => {
      startRecordTimeout = null
      // console.log("touchstartUploadVoice0000");
      recordTime = (new Date()).getTime()
      wx.startRecord()
    }, 90)
  } else {
    if (!isUpdateRecord) {
      // 如果还没开始真正录音，则取消
      if (startRecordTimeout) clearTimeout(startRecordTimeout)
      store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'preper')
      setTimeout(() => {
        // console.log("touchendUploadVoice1111");
        wx.stopRecord({
          bPara: JSON.stringify(paramTmp),
          success: function (res) {
            recordTime = (new Date()).getTime() - recordTime
            if (recordTime < 1200 + 250) {
              // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_TOOSHORT, res);
              stopuploadVoice()
              store.commit(SET_BOTTOM_TOAST, '录音时间过短')
              return
            }
            if (Z_IsEmpty(res) || Z_IsEmpty(res['isApp']) || res['isApp'] === 'true') {
              isUpdateRecord = true
              // showMaskAndToast();
              wxUploadVoice(paramTmp, res)
            }
          },
          fail: function (res) {
//                            alert(res.errMsg);
            if ((new Date()).getTime() - recordTime < 1200 + 250) {
              // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_TOOSHORT, res);
              store.commit(SET_BOTTOM_TOAST, '录音时间过短')
            }
            else if ((new Date()).getTime() - recordTime >= 60 * 1000 + 250) {
              // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, res);
              store.commit(SET_BOTTOM_TOAST, '录音失败:声音长度超过1分钟')
            }
            else {
              store.commit(SET_BOTTOM_TOAST, '录音失败')

              wxServerLog('{startUploadVoice} stopRecord failed ' + JSON.stringify(res))
            }
            stopuploadVoice()
          }
        })
      }, 120)
    } else if ((new Date()).getTime() - recordTime >= 60 * 1000) {
      stopuploadVoice()
      // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, pramas);
      store.commit(SET_BOTTOM_TOAST, '录音失败:声音长度超过1分钟')
    } else {
      setTimeout(() => {
        // console.log("touchendUploadVoice1111");
        wx.stopRecord({
          bPara: JSON.stringify(paramTmp),
          success: function (res) {
            stopuploadVoice()
          },
          fail: function (res) {
            stopuploadVoice()

            wxServerLog('{startUploadVoice} stopRecord2 failed ' + JSON.stringify(res))
          }
        })
      }, 120)
      store.commit(SET_BOTTOM_TOAST, '正在上传录音请稍后...')
    }
  }
}

/**
 * 开始录音
 */
function touchstartUploadVoice () {
  // 通过短暂的延迟避免'开始录音有一小段时间不能停止的'问题
  startRecordTimeout = setTimeout(() => {
    startRecordTimeout = null
    // console.log("touchstartUploadVoice0000");
    recordTime = (new Date()).getTime()
    wx.startRecord()
  }, 90)
  // console.log("touchstartUploadVoice1111");
}

/**
 * 停止录音并上传
 */
function touchendUploadVoice (params) {
  // console.log("touchendUploadVoice0000");
  // 如果还没开始真正录音，则取消
  // 调整长按录音时的快速点击 有可能会把页面卡住 ios闪屏显示遮罩并提示正在上传的问题 调整快速点击则下面不进行处理  如果有功能点存在影响则把return去掉
  if (startRecordTimeout) {
    clearTimeout(startRecordTimeout)
    return
  }

  if (!params) {
    alert('touchendUploadVoice params为空')
  }

  let paramTmp = params

  paramTmp.isAlert = false
  paramTmp.wid = wid
  paramTmp.type = 'Z_GROUP_VOICE_MSG'

  if (paramTmp.bId === 'false') {
    alert('touchendUploadVoice param.bId为空')
    return
  }

  // console.log("isUpdateRecord: " + isUpdateRecord);
  store.commit(SET_WX_UPLOAD_VOICE_STATUS, 'preper')
  if (!isUpdateRecord) {
    let tmot = () => {
      wx.stopRecord({
        bPara: JSON.stringify(paramTmp),
        success: function (res) {
          console.log('wx.stopRecord', res)
          recordTime = (new Date()).getTime() - recordTime
          if (recordTime < 1200 + 250) {
            // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_TOOSHORT, res);
            stopuploadVoice()
            store.commit(SET_BOTTOM_TOAST, '录音时间过短')
            return
          }
          // console.log('stopRecord success: ' + JSON.stringify(res));
          if (Z_IsEmpty(res) || Z_IsEmpty(res['isApp']) || res['isApp'] === 'true') {
            isUpdateRecord = true
            // showMaskAndToast();
            wxUploadVoice(paramTmp, res)
          }
        },
        fail: function (res) {
          // alert(res.errMsg);
          // console.log('stopRecord fail: ' + JSON.stringify(res));
          // console.log('stopRecord recordTime: ' + recordTime);
          // console.log('stopRecord during: ' + ((new Date()).getTime() - recordTime));
          if ((new Date()).getTime() - recordTime < 1200 + 250) {
            // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_TOOSHORT, res)
            store.commit(SET_BOTTOM_TOAST, '录音时间过短')
          }
          else if ((new Date()).getTime() - recordTime >= 60 * 1000 + 250) {
            // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, res);
            store.commit(SET_BOTTOM_TOAST, '录音失败：声音长度超过1分钟')
          }
          else {
            store.commit(SET_BOTTOM_TOAST, '录音失败')

            wxServerLog('{touchendUploadVoice} stopRecord failed ' + JSON.stringify(res))
          }
          stopuploadVoice()
        }
      })
    }
    setTimeout(tmot, 120)
  } else if ((new Date()).getTime() - recordTime >= 60 * 1000) {
    stopuploadVoice()
    // $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, pramas);
    store.commit(SET_BOTTOM_TOAST, '录音失败:声音长度超过1分钟')
  } else {
    setTimeout(() => {
      // console.log("touchendUploadVoice1111");
      wx.stopRecord({
        bPara: JSON.stringify(paramTmp),
        success: function (res) {
          stopuploadVoice()
        },
        fail: function (res) {
          stopuploadVoice()

          wxServerLog('{touchendUploadVoice} stopRecord2 failed ' + JSON.stringify(res))
        }
      })
    }, 120)
    store.commit(SET_BOTTOM_TOAST, '正在上传录音请稍后...')
  }
}

/**
 * 取消录音
 */
function touchcancleuploadVoice () {
  // $(".startRecord").html('点击  录音');
  isUpdateRecord = false
  recordTime = 0

  // 如果还没开始真正录音，则取消
  if (startRecordTimeout) clearTimeout(startRecordTimeout)
  setTimeout(function () {
    // console.log("touchendUploadVoice1111");
    wx.stopRecord({
      success: function (res) {
        stopuploadVoice()
      },
      fail: function (res) {
        stopuploadVoice()

        wxServerLog('{touchcancleuploadVoice} stopRecord failed ' + JSON.stringify(res))
      }
    })
  }, 120)
}

let isUploadingImg = false
let imgLocalIds = null

function stopUploadImg () {
  isUploadingImg = false
  imgLocalIds = null
}

function uploadImgwxEnd (data) {
  console.log('uploadImgwxEnd :' + JSON.stringify(data))

  // 多张图片的情况
  if (data instanceof Array) {
    let evtParamsList = []

    let isErr = false
    data.forEach(dt => {
      if (!Z_IsEmpty(dt) && !Z_IsEmpty(dt.retcode) && dt.retcode === 0) {
        let evtParams = {}
        if (!Z_IsEmpty(dt.fileName)) {
          evtParams['fileName'] = dt.fileName
          evtParamsList.push(evtParams)
        }
      } else {
        isErr = true;
      }
    })

    if (!isErr) {
      // sendWXAlert(data.isAlert);
      store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'success')
      store.commit(SET_WX_UPLOAD_IMAGE, evtParamsList)
    } else {
      store.commit(SET_BOTTOM_TOAST, '上传失败，请稍后重试')
      store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
    }
  }
  // 单张图片
  else {
    let isErr = true
    if (!Z_IsEmpty(data) && !Z_IsEmpty(data.retcode) && data.retcode === 0) {
      isErr = false
      let evtParams = {}
      if (!Z_IsEmpty(data.fileName)) {
        evtParams['fileName'] = data.fileName
      }
      // sendWXAlert(data.isAlert);
      store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'success')
      store.commit(SET_WX_UPLOAD_IMAGE, evtParams)
    }

    if (isErr) {
      store.commit(SET_BOTTOM_TOAST, '上传失败，请稍后重试')
      store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
    }
  }

}

/*function uploadImgwxCancle() {
 // unShowMaskAndToast();
 store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'canceled')
 }*/

function handleUploadImgwx(paramTmp, localId, imageList) {
  console.log('handleUploadImgwx localId: ' + localId)
  return new Promise((resolve, reject) => {
    console.log('handleUploadImgwx promise localId: ' + localId)
    wx.uploadImage({
      localId: localId,
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: function (res) {
        try {
//            alert("sucess "+res.errMsg);
          let serverId = res.serverId
          serverId = Z_EU(serverId)

          let uparam = {
            wid: wid,
            serverId: serverId,
            type: 'Z_GROUP_IMG_MSG',
            bId: paramTmp['bId'],
            bType: paramTmp['bType']
          }

          if (!Z_IsEmpty20(paramTmp['companyId']) && paramTmp['companyId'] !== 'false') {
            uparam['companyId'] = paramTmp['companyId']
          }

          if (!Z_IsEmpty20(paramTmp['UseUniqueFileID']) && paramTmp['UseUniqueFileID'] === 'true') {
            uparam['UseUniqueFileID'] = 'true'
          }

          // 上传速度很快，不加状态防护。需要时按声音逻辑调整。
          let url = '/WXINFO/WXSDK/weixin?ajaxAction=WX_AJAX_UPLOAD_MEDIA'
          axios.post(url, Qs.stringify(uparam), {silent: true}).then(data => {
            // 不加上传成功提示，会在页面中看到
            let image = data.data
            // stopUploadImg()
            // uploadImgwxEnd(image)
            imageList.push(image)

            console.log('handleUploadImgwx resolve - localId: ' + localId)
            resolve()
          }).catch(err => {
            // stopUploadImg()
            // store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
            console.error('handleUploadImgwx err - localId: ' + localId, err)
            reject(err)
            store.commit(SET_BOTTOM_TOAST, '网络连接失败，请稍后重试')

            wxServerLog('{uploadImgwx} upload img failed ' + JSON.stringify(err.message) + ' ' + JSON.stringify(err.stack))
          })

          // stopUploadImg()
        } catch (e) {
          // store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
          console.error('handleUploadImgwx err - localId: ' + localId, e)
          reject(e)
          wxServerLog('{uploadImgwx} upload img2 failed ' + JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack))
        }
      },
      fail: function (res) {
        // stopUploadImg()
        // store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
        console.error('handleUploadImgwx fail - localId: ' + localId, res.errMsg)
        reject(new Error('上传图片失败' + res.errMsg))
        store.commit(SET_BOTTOM_TOAST, '上传图片失败' + res.errMsg)

        wxServerLog('{uploadImgwx} uploadImage failed ' + JSON.stringify(res))
      }
    })
  })
}

async function doUploadImgwx(paramTmp, imgLocalIds, imageList) {
  for (let i = 0; i < imgLocalIds.length; i++) {
    let localId = imgLocalIds[i]

    // wx.uploadImage wx的api不能并行执行，并行执行会被忽略，所以需要顺序等待
    await handleUploadImgwx(paramTmp, localId, imageList)
  }
}

function uploadImgwx (paramTmp) {
  console.log('uploadImgwx start bId:' + paramTmp['bId'] + ' bType:' + paramTmp['bType'])
  isUploadingImg = true

  if (imgLocalIds && imgLocalIds.length > 0) {
    let imageList = []

    doUploadImgwx(paramTmp, imgLocalIds, imageList).then(() => {
      stopUploadImg()
      uploadImgwxEnd(imageList)
    }).catch(err => {
      stopUploadImg()
      store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
    })
  } else {
    console.error('uploadImgwx fail imgLocalIds empty', imgLocalIds)
  }
}

function startuploadImg (paramImg, count) {
  console.log('startuploadImg begin ' + JSON.stringify(paramImg) + ' ' + count)
  try {
    if (!paramImg) {
      alert('startuploadImg params为空')
    }

    let paramTmp = paramImg
    paramTmp.isAlert = false
    /*简化app*/
    paramTmp.wid = wid
    paramTmp.type = 'Z_GROUP_IMG_MSG'

    store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'prepar')
    // showMaskAndToast();
    let chooseCount = count || 1
    wx.chooseImage({
      count: chooseCount, // 默认9
      bPara: JSON.stringify(paramTmp),
      success: function (res) {
        console.log('wx.chooseImage:' + JSON.stringify(res))
        imgLocalIds = res.localIds
//            alert(localIds[0]);
        if (typeof imgLocalIds !== 'undefined') {
          if (Z_IsNotEmtArray(imgLocalIds)) {
            window.setTimeout(function () {
              try {
                console.log('wx.chooseImage uploadImgwx')
                store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'loading')
                uploadImgwx(paramTmp)
              } catch (e) {
                store.commit(SET_BOTTOM_TOAST, '上传失败，请稍后重试.')
                stopUploadImg()
                store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
                // unShowMaskAndToast();

                wxServerLog('{startuploadImg} chooseImage failed ' + JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack))
              }
            }, 1000)
          } else {
            store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
            // unShowMaskAndToast();

            wxServerLog('{startuploadImg} chooseImage failed2: imgLocalIds null ' + JSON.stringify(res))
          }

        } else {
          store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
          // unShowMaskAndToast();
          wxServerLog('{startuploadImg} chooseImage failed3: imgLocalIds null ' + JSON.stringify(res))
        }
      },
      fail: function (res) {
        stopUploadImg()
        store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
        // unShowMaskAndToast();
        store.commit(SET_BOTTOM_TOAST, '选择图片失败')

        wxServerLog('{startuploadImg} chooseImage failed4: imgLocalIds null ' + JSON.stringify(res))
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'canceled')
        // unShowMaskAndToast();
      }
    })

  } catch (e) {
    console.log('Exception startuploadImg ' + e.message)

    wxServerLog('{startuploadImg} chooseImage failed5 ' + JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack))
  }

  if (isUploadingImg) {
    store.commit(SET_BOTTOM_TOAST, '正在上传图片请稍后...')
  }

}

function setupWeiXinShareInfo (url, title, desc, weibodesc, img, msgtit) {
  let dataForWeixin = {
    MsgImg: window.Config.basUrl + '/ZingVue/static/images/ysImg.png',
    TLImg: '',
    url: '',
    title: '',
    MstTitle: '',
    desc: '',
    fakeid: '',
    weibodesc: '',
  }

  let originTitle

  dataForWeixin.url = url || document.location.href
  dataForWeixin.title = title || document.title
  dataForWeixin.desc = desc || document.title
  dataForWeixin.weibodesc = weibodesc || document.title
  dataForWeixin.MstTitle = msgtit || document.title

  if (img && img.length > 0) {
    dataForWeixin.MsgImg = img
  }

  //alert(isJsApiOk+" "+url+" "+title+" "+desc );

  wxServerLog(`SetupWeiXinShareInfo begin ${title} ${url} ${desc}`)

  let shareUrl
  let shareImg // 增加图片的处理方式

  if (dataForWeixin.url.indexOf('http:') === 0 || dataForWeixin.url.indexOf('https:') === 0) {
    shareUrl = dataForWeixin.url
  } else {
    shareUrl = window.Config.basUrl + dataForWeixin.url.indexOf('/') === 0 ? dataForWeixin.url : '/' + dataForWeixin.url
  }

  if (dataForWeixin.MsgImg.indexOf('http:') === 0 || dataForWeixin.MsgImg.indexOf('https:') === 0) {
    shareImg = dataForWeixin.MsgImg
  } else {
    shareImg = window.Config.basUrl + dataForWeixin.MsgImg.indexOf('/') === 0 ? dataForWeixin.MsgImg : '/' + dataForWeixin.MsgImg
  }

  wx.onMenuShareAppMessage({
    title: title,
    desc: desc,
    link: shareUrl,
    //imgUrl: basUrl + dataForWeixin.MsgImg,
    imgUrl: shareImg,
    trigger: function (res) {
//                alert('用户点击发送给朋友');
      originTitle = document.title
      document.title = title

      wxServerLog('wx.onMenuShareTimeline: trigger: ' + JSON.stringify(res))
    },
    success: function (res) {
//                alert('已分享');
      store.commit(SET_BOTTOM_TOAST, '分享成功')
      document.title = originTitle

      wxServerLog('wx.onMenuShareAppMessage: success: title: ' + title + ' desc: ' + desc + ' shareUrl: ' + shareUrl + ' result: ' + JSON.stringify(res))
    },
    cancel: function (res) {
//                alert('已取消');
      document.title = originTitle
    },
    fail: function (res) {
//                alert(JSON.stringify(res));
      store.commit(SET_BOTTOM_TOAST, '分享失败')
      document.title = originTitle

      wxServerLog('wx.onMenuShareAppMessage: fail: ' + JSON.stringify(res))
    }
  })
  wx.onMenuShareTimeline({
    title: title,
    // link: basUrl + dataForWeixin.url,
    link: shareUrl,
    //imgUrl: basUrl + dataForWeixin.MsgImg,
    imgUrl: shareImg,
    trigger: function (res) {
//                alert('用户点击分享到朋友圈');
      originTitle = document.title
      document.title = title

      wxServerLog('wx.onMenuShareTimeline: trigger: ' + JSON.stringify(res))
    },
    success: function (res) {
//                alert('已分享');
      store.commit(SET_BOTTOM_TOAST, '分享成功')
      document.title = originTitle

      wxServerLog('wx.onMenuShareTimeline: success: ' + JSON.stringify(res))
    },
    cancel: function (res) {
//                alert('已取消');
      document.title = originTitle
    },
    fail: function (res) {
      store.commit(SET_BOTTOM_TOAST, '分享失败')
      document.title = originTitle

      wxServerLog('wx.onMenuShareTimeline: fail: ' + JSON.stringify(res))
    }
  })
}

/**
 * app分享到微信
 * @param title
 * @param link
 * @param imgUrl
 */
function shareFriend (title, link, imgUrl) {
  if (isMhApp) {
    window.MHAppapi.shareFriend(title, link, imgUrl)
  }
}

/**
 * app分享到朋友圈
 * @param title
 * @param link
 * @param imgUrl
 */
function shareTimeline (title, link, imgUrl) {
  if (isMhApp) {
    window.MHAppapi.shareTimeline(title, link, imgUrl)
  }
}

export {
  getWXLocationHX,
  getQMapLocation,
  dispWXLocationHX,
  getQMapLocationSrc,
  getChatVoiceImgParam,
  startUploadVoice,
  touchstartUploadVoice,
  touchendUploadVoice,
  touchcancleuploadVoice,
  startuploadImg,
  setupWeiXinShareInfo,
  shareFriend,
  shareTimeline
}
