import { serverLogMH, wxServerLog } from '../utils/logger'
import { isMhApp, Z_IsEmpty,isMhAppIos } from '../utils/fn'
/**app模拟微信接口，减少适配工作量
 * 这里有两个方案：
 * 1、app注入js
 * 2、nodejs根据不同环境引用不同js组件
 *
 * 目前先使用简单的方案，遇到问题再做调整
 *
 * */
/* TODO 编译去掉注释*/

const isAppLogFile = true;

/* const ERROR_STATUS_IS_RECORDING = -15110;
const ERROR_STATUS_TOO_SHORT = -15120;
const ERROR_STATUS_PAGE_CHANGE = -15130;
const ERROR_STATUS_TOO_LONG = -15140; */


function appServLog(msg) {
  if (!isAppLogFile) {
    serverLogMH(msg, "app_" + isMhApp());
  } else {
    if (typeof (window.MHAppapi) !== 'undefined' && typeof (window.MHAppapi.appLogDebug) !== 'undefined') {
      window.MHAppapi.appLogDebug(msg);
    }
  }
}
let appChat = {};
(function () {
  let wx = {};
  /* 通过config接口注入权限验证配置 */
  wx.config = function () {
    /* 暂时不需要单独处理. */
    appServLog("app config begin 1 " + isMhApp());
  }
  /* 通过ready接口处理成功验证 */
  wx.ready = function (callback) {
    appServLog("app ready begin 1 " + isMhApp());
    if (typeof callback === "function") {
      callback();
    }
  }
  /* 通过error接口处理失败验证 */
  wx.error = function () {
    appServLog("app error begin 1 " + isMhApp());
    /* 暂不需要处理. */
  }
  try {
    /* 基础接口 */
    /* 判断当前客户端版本是否支持指定JS接口 */
    wx.checkJsApi = function checkJsApi(params) {
      /* 自动获取函数自身的名字. */
      const selfFuncName = 'checkJsApi';

      /* 回调函数的封装.
        注意: 无论成功或者失败,都会执行 complete 方法.
      */
      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }
      function fail(message) {
        let msg = message || {};

        if (params && typeof params.fail === "function") {
          params.fail(msg);
        }

        complete(msg);
      }

      function success(msg) {
        var message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(msg);
        }
        complete(message);
      }
      try {
        appServLog("app checkJsApi begin");
        /* 公共函数和变量. */
        /* 自动获取函数自身的名字. */
        // ------------------------------------------
        /* 支持的API. */
        let jsApiListSupport = ["onMenuShareTimeline", "onMenuShareAppMessage",
          "onMenuShareQQ", "onMenuShareWeibo", "startRecord", "stopRecord",
          "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd",
          "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage",
          "downloadImage", "translateVoice", "getNetworkType", "openLocation", "getLocation", "appGo",
          "hideOptionMenu", "showOptionMenu", "hideMenuItems", "showMenuItems",
          "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow", "scanQRCode"];

        /* 是否时有效的调用? */
        if (!(params && params.jsApiList)) { // 说明调用失败.
          fail({ "errMsg": "jsApiList参数必须存在!" });

          return;
        }

        /* 是否支持指定的api? */
        let checkResult = {};

        for (let idx in params.jsApiList) {
          if (params.hasOwnProperty(idx)) {
            let apiName = params.jsApiList[idx];
            let support = false;

            for (let idxIn in jsApiListSupport) {
              if (apiName === jsApiListSupport[idxIn]) {
                support = true;
                break;
              }
            }
            checkResult[apiName] = support;
          }
        }

        success({
          checkResult: checkResult
        });
      } catch (e) {
        alert("3 " + e.message);
        wxServerLog("Exception checkJsApi " + e.message);
      }

    }
    /* 分享接口 */
    /* 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口 */

    wx.onMenuShareTimeline = function onMenuShareTimeline(params) {
      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */
      /* app不再提供设置接口
      if (!Z_IsEmpty(params)) {
        window.MHAppapi.shareTimeline(params.title, params.link, params.imgUrl);
      }*/

    }

    /* 获取“分享给朋友”按钮点击状态及自定义分享内容接口 */

    wx.onMenuShareAppMessage = function onMenuShareAppMessage(params) {
      /* 公共函数和变量. */

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */
      /* app不再提供设置接口
      if (!Z_IsEmpty(params)) {
        wxServerLog("shareFriend begin " + params.title + " " + params.imgUrl);
        window.MHAppapi.shareFriend(params.title, params.desc, params.link, params.imgUrl);
      }*/
    }

    /* 获取“分享到QQ”按钮点击状态及自定义分享内容接口 */

    wx.onMenuShareQQ = function onMenuShareQQ(params) {
      /*/!* 分享到 qq. *!/
      let qq = window.api.require('qq');
      /!* 登陆. *!/
      qq.login(
        function (ret, err) {
          if (!ret.status) {
            fail({ errMsg: err.msg });
            return;
          }

          /!* 先下载图片资源到本地以形成缩略图. *!/
          let url = params.imgUrl;
          window.api.download({
            savePath: "fs://qqIcon" + Math.floor(Math.random() * 1000000)
              + Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + ".png",
            cache: false,
            url: url
          }, function (ret, err) {
            if (!ret) {
              fail({ errMsg: err.msg });

              return;
            }

            qq.shareNews({
              url: params.link,
              title: params.title,
              description: params.desc,
              imgUrl: ret.savePath
            });

            success();
          });
        }
      );*/
    }

    /* 获取“分享到微博”按钮点击状态及自定义分享内容接口 */

    wx.onMenuShareWeibo = function onMenuShareWeibo(params) {
      /*/!* 微博分享. *!/
      let weiBo = window.api.require('sinaWeiBo');
      /!* 注册应用. *!/
      weiBo.auth(
        function (ret, err) {
          if (!ret.status) {
            if (err.code === "1" || err.code === "4") {
              cancel();
              return;
            }

            let errMsg = "未知错误";

            if (err.code === "2") {
              errMsg = "发送失败";
            }

            if (err.code === "3") {
              errMsg = "授权失败";
            }

            if (err.code === "5") {
              errMsg = "不支持";
            }

            fail({ errMsg: errMsg });

            return;
          }


          /!* 先下载图片资源到本地以形成缩略图. *!/
          let url = params.imgUrl;
          window.api.download({
            savePath: "fs://weChatIcon" + Math.floor(Math.random() * 1000000)
              + Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + ".png",
            cache: false,
            url: url
          }, function (ret, err) {
            if (!ret) {
              fail({ errMsg: err.msg });

              return;
            }

            /!* 分享内容 *!/
            weiBo.sendRequest({
              contentType: "web_page",
              media: {
                title: params.title,
                description: params.desc,
                thumbUrl: ret.savePath,
                webpageUrl: params.link
              }
            }, function (ret, err) {
              if (!ret.status) {
                if (err.code === "1" || err.code === "4") {
                  cancel();
                  return;
                }

                let errMsg = "未知错误";

                if (err.code === "2") {
                  errMsg = "发送失败";
                }

                if (err.code === "3") {
                  errMsg = "授权失败";
                }

                if (err.code === "5") {
                  errMsg = "不支持";
                }

                fail({ errMsg: errMsg });

                return;
              }

              success();
            });
          });
        }
      );*/
    }

    /*// ------开始分享-----
    wx.beginShare = function beginShare(params) {
      /!* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       *!/

      window.MHAppapi.beginShare();
    };*/

    // -------------------------------------

    /* 图像接口 */

    /* 拍照或从手机相册中选图接口 */

    wx.chooseImage = function chooseImage(params) {
      window.MHAppapi.cameraImg(params.bPara);
    }

    /* 预览图片接口 */

    wx.previewImage = function previewImage(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */

      let currentUrl = params.current;

      let urls = params.urls;

      let activeIndex = 0;

      for (let idx in urls) {
        if (currentUrl === urls[idx]) {
          activeIndex = idx;

          break;
        }
      }

      const imageBrowser = window.api.require("imageBrowser");
      imageBrowser.openImages({
        imageUrls: urls,
        showList: false,
        activeIndex: activeIndex
      });
    }

    /* 上传图片接口 */

    wx.uploadImage = function uploadImage(params) {
      /* 公共函数和变量. */

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */
      // -----------------------------------------------
      /* 生成密钥. */
      if (typeof params.isShowProgressTips === 'undefined') {
        params.isShowProgressTips = 1;
      }
    }

    /* 下载图片接口 */

    wx.downloadImage = function downloadImage(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'downloadImage';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }
        complete(msg);
      }

      function fail(msg) {
        const message = msg || {};

        if (params && typeof params.fail === "function") {
          params.fail(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      // -----------------------------------------------

      if (typeof params.isShowProgressTips === 'undefined') {
        params.isShowProgressTips = 1;
      }

      let url = params.serverId;
      window.api.download({
        savePath: "fs://weChatLocalId" + Math.floor(Math.random() * 1000000)
          + Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + ".png",
        cache: false,
        url: url
      }, function (ret, err) {
        if (!ret) {
          fail({ errMsg: err.msg });

          return;
        }
        success({ localId: ret.savePath });
      });
    }

    // -----------------------------

    /* 音频接口 */

    /* 开始录音接口 */

    wx.startRecord = function startRecord(params) {
      /* 公共函数和变量. */

      window.MHAppapi.startRecord('zRecord');
    }

    /* 停止录音回调*/
    wx.stopRecordEnd = function stopRecordEnd(data, sec) {
      /* try {
        wxServerLog("stopRecordEnd begin "+sec);
        var isErr = true;
        var isNeedStop=true;
        if (!Z_IsEmpty(data)) {
          if(!Z_IsEmpty(data.retcode)){
            if (data.retcode == 0) {
              isErr = false;
              sendWXAlert(data.isAlert);
              $(document).triggerHandler(EVENT_UP_LOAD_VOICE_OK, data);
            }else if(data.retcode == ERROR_STATUS_IS_RECORDING){
              isErr = false;
              isNeedStop=false;
              // alert("正在上传录音请稍后");
                showBottomPrompt('正在上传录音请稍后', 2000);
            }else if(data.retcode == ERROR_STATUS_TOO_SHORT){
              // alert("录音时间过短");
                showBottomPrompt('录音时间过短', 2000);
            }else if(data.retcode == ERROR_STATUS_PAGE_CHANGE){

            }else if(data.retcode == ERROR_STATUS_TOO_LONG){
              // alert("录音失败:声音长度超过1分钟");
                showBottomPrompt('录音失败:声音长度超过1分钟', 2000);
            }else{
              // alert("录音失败");
                showBottomPrompt('录音失败', 2000);
            }
          }
        }

        if(isNeedStop){
          stopuploadVoice();
        }

        if (isErr) {
          //alert("上传失败，请稍后重试");
          $(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED, data);
        }
      } catch (e) {
        wxServerLog("stopRecordEnd Exception : " + e.name + " " + e.message);
      } */
    }

    /* 停止录音接口 */


    wx.stopRecord = function stopRecord(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      const selfFuncName = 'stopRecord';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";
        msg["isApp"] = "true";
        if (params && typeof params.success === "function") {
          params.success(message);
        }

        //complete(msg);
      }



      // -----------------------------------------------

      window.MHAppapi.stopRecord(params.bPara);
      /*不是真正的调用成功，只是异步返回*/
      success();

    }

    /* 监听录音自动停止接口 */

    wx.onVoiceRecordEnd = function onVoiceRecordEnd(params) {
      /* 不需要限制录音一分钟自动结束. */
    }

    /* 播放语音接口 */

    wx.playVoice = function playVoice(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      window.api.startPlay({
        path: params.localId
      });
    }

    /* 暂停播放接口 */

    wx.pauseVoice = function pauseVoice(params) {
      /* 公共函数和变量. */

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */
      // -----------------------------------------------
      window.api.stopPlay({
        path: params.localId
      });
    }

    /* 停止播放接口 */

    wx.stopVoice = function stopVoice(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      window.api.stopPlay();
    }

    /* 监听语音播放完毕接口 */

    wx.onVoicePlayEnd = function onVoicePlayEnd(params) {
      /* 暂不需要处理此事件. */
    }

    /* 上传语音接口 */

    wx.uploadVoice = function uploadVoice(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'uploadVoice';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function appComplete(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":cancel";

        if (params && typeof params.appComplete === "function") {
          params.appComplete(message);
        }
      }

      if (typeof params.isShowProgressTips === 'undefined') {
        params.isShowProgressTips = 1;
      }

      appComplete();
    }

    /* 下载语音接口 */

    wx.downloadVoice = function downloadVoice(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'downloadVoice';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function fail(msg) {
        const message = msg || {};

        if (params && typeof params.fail === "function") {
          params.fail(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      if (typeof params.isShowProgressTips === "undefined") {
        params.isShowProgressTips = 1;
      }

      const url = params.serverId;
      window.api.download({
        savePath: "fs://weChatLocalId" + Math.floor(Math.random() * 1000000)
          + Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000) + ".amr",
        cache: false,
        url: url
      }, function (ret, err) {
        if (!ret) {
          fail({ errMsg: err.msg });
          return;
        }
        success({ localId: ret.savePath });
      });
    }

    // ---------------------------

    /* 智能接口 */

    /* 识别音频并返回识别结果接口 */

    wx.translateVoice = function translateVoice(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'translateVoice';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }


      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }
      /* 直接进行语音识别. */

      window.api.toast({
        msg: "语音识别开始,请说话",
        duration: 3000,
        location: "top"
      });

      /* 语音识别. */
      let speechRecognizer = window.api.require("speechRecognizer");
      speechRecognizer.record({
      }, function (ret, err) {
        if (ret.wordStr) {
          success({ translateResult: ret.wordStr })
        }
      });
    }

    // ----------------------------

    /* 设备信息 */

    /* 获取网络状态接口 */

    wx.getNetworkType = function getNetworkType(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'getNetworkType';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }
      success({ networkType: window.api.connectionType });
    }

    // ----------------------------

    /* 地理位置 */

    /* 使用微信内置地图查看位置接口 */
    wx.openLocation = function openLocation(params) {
      if (typeof window.getPositionSrc === "function") {
        params.lat = params.latitude;
        params.lng = params.longitude;
        params.title = params.name;
        params.addr = params.address;
        console.log('openLocation: ' + JSON.stringify(params));
        window.location = window.getPositionSrc(params);
      }
    }

    /* 获取地理位置接口 */

    wx.getLocation = function getLocation(params) {

      // alert("地图接口未完成对接");

      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'getLocation';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {

        console.log('app getLocation: ' , msg);

        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }
        complete(message);
      }

      function fail(msg) {
        const message = msg || {};

        if (params && typeof params.fail === "function") {
          params.fail(message);
        }

        complete(message);
      }

      function complete(msg) {
        let message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

        function procIos(ret) {
            if (ret && ret.isSuccess) {
                success(ret.location);
            } else {
                fail(ret);
            }
        }

      setTimeout(function () {
        // console.log('111');

        if(isMhAppIos()){
            window.MHAppapi.getLocation(procIos);
        }else{
            let ret = window.MHAppapi.getLocation();
            console.log('wx.getLocation: ' + ret);
            ret = JSON.parse(ret);
            if (ret.isSuccess) {
                success(ret.location);
            } else {
                fail(ret);
            }
        }


      }, 0);
    }

    // ----------------------------

    /* 界面操作 */

    /* 隐藏右上角菜单接口 */

    wx.hideOptionMenu = function hideOptionMenu(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'hideOptionMenu';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      // -----------------------------------------------
      success();
    }

    /* 显示右上角菜单接口 */

    wx.showOptionMenu = function showOptionMenu(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'showOptionMenu';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      success();
    }

    /* 关闭当前网页窗口接口 */

    wx.closeWindow = function closeWindow(params) {
      window.api.closeWin();
    }

    /* 批量隐藏功能按钮接口 */

    wx.hideMenuItems = function hideMenuItems(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'hideMenuItems';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      success();
    }

    /* 批量显示功能按钮接口 */

    wx.showMenuItems = function showMenuItems(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'showMenuItems';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }
      success();
    }

    /* 隐藏所有非基础按钮接口 */

    wx.hideAllNonBaseMenuItem = function hideAllNonBaseMenuItem(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'hideAllNonBaseMenuItem';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      success();
    }

    /* 显示所有功能按钮接口 */

    wx.showAllNonBaseMenuItem = function showAllNonBaseMenuItem(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'showAllNonBaseMenuItem';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      success();
    }

    // -----------------------------

    /* 微信扫一扫 */

    /* 调起微信扫一扫接口 */

    wx.scanQRCode = function scanQRCode(params) {
      /* 公共函数和变量. */

      /* 自动获取函数自身的名字. */
      let selfFuncName = 'scanQRCode';

      // ------------------------------------------

      /* 回调函数的封装.
       注意: 无论成功或者失败,都会执行 complete 方法.
       */

      function success(msg) {
        const message = msg || {};

        msg["errMsg"] = selfFuncName + ":ok";

        if (params && typeof params.success === "function") {
          params.success(message);
        }

        complete(message);
      }

      function complete(msg) {
        const message = msg || {};

        if (params && typeof params.complete === "function") {
          params.complete(message);
        }
      }

      // -----------------------------------------------

      let scanner = window.api.require("scanner");
      scanner.open({
      }, function (ret, err) {
        let result = ret.msg;

        if (params.needResult) {
          success({ needResult: result });

          return;
        }

        window.api.openWin({
          name: "result",
          url: result,
          bounces: false,
          showProgress: true
        });

      });

    }

  } catch (e) {
    appServLog("app api error:" + e.message);
  }
  /* window.wx = wx;
  window.jWeixin = wx; */
  /* if (typeof (window.MHAppapi) !== 'undefined' && typeof (window.MHAppapi.initAppApi) !== 'undefined') {
    //alert(ret);
  } else {
    alert("MHAppapi " + (typeof (MHAppapi)))
  } */
  appChat = wx;
  /* 引入hash加密算法库 */
  /* sha1 加密 */
})();
export default appChat
/* (function () {
  window.MHAppJSBridge = {};

  window.MHAppJSBridge.mediaPlayCompleted = function (mediaId) {
    $(document).triggerHandler(EVENT_MEDIA_PLAY_COMPLETED, { mediaId: mediaId });
  };
  // 条码扫描返回
  MHAppJSBridge.onBarcodeScanResult = function (barcode) {
    console.log('onBarcodeScanResult should be override, barcode: ' + barcode);
  };
})(); */
