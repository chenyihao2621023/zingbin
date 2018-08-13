import Axios from 'axios'
import Qs from 'qs'
import { isMhElectron, isWeiXin, Z_EU, Z_IsEmpty, Z_IsEmpty20, Z_IsNotEmtArray } from './fn'
import { wxServerLog } from './logger'
import appChat from '../plugins/jweixinapp-1.2.0'
import store from '../store'
import { SET_WX_UPLOAD_IMAGE_STATUS } from '../store/mutation-types'

const NativeAppHelper = new function () {
    const $this = this;
    this.invokingContext = {};
    this.wx = appChat;
    let initState = false;
    function chooseImageFailed() {
        let ic = $this.invokingContext;
        let mds = ic.$options.methods;
        if (typeof mds.chooseImageFailed === "function") {
            mds.chooseImageFailed.bind(ic)()
        } else {
            console.error("选择文件失败")
        }
    }
    function chooseImageCancel() {
        let ic = $this.invokingContext;
        let mds = ic.$options.methods;
        if (typeof mds.chooseImageCancel === "function") {
            mds.chooseImageCancel.bind(ic)()
        } else {
            console.error("取消文件选择")
        }
    }
    function uploadImageFailed() {
        let ic = $this.invokingContext;
        let mds = ic.$options.methods;
        if (typeof mds.uploadImageFailed === "function") {
            mds.uploadImageFailed.bind(ic)()
        } else {
            console.error("上传图片失败")
        }
    }
    function uploadImageEnd(data) {
        let ic = $this.invokingContext;
        let mds = ic.$options.methods;
        if (typeof mds.uploadImageEnd === "function") {
            mds.uploadImageEnd.bind(ic)(data)
        } else {
            console.error("上传图片失败")
        }
    }
    /*function appUploadCB(data) {
        console.log("nativeAppHelper appUploadCB :" + JSON.stringify(data))
        let isErr = true
        if (!Z_IsEmpty(data) && !Z_IsEmpty(data.retcode) && data.retcode === 0) {
            isErr = false
            let evtParams = {}
            if (!Z_IsEmpty(data.fileName)) {
                evtParams['fileName'] = data.fileName
            }
            // sendWXAlert(data.isAlert);
            // unShowMaskAndToast();

            let ic = $this.invokingContext;
            let mds = ic.$options.methods;
            if (typeof mds.uploadImageEnd === "function") {
                mds.uploadImageEnd.bind(ic)(evtParams)
            } else {
                console.error("上传图片失败")
            }
        }

        if (isErr) {
            console.error("上传图片失败")
            // unShowMaskAndToast();
        }
    }*/
    window.uploadImgwxEnd = uploadImageEnd;
    // window.appUploadCB = appUploadCB;
    this.isInit = function () {
        return initState;
    }
    this.initJSSDK = function (wx, appArr, ic) {
        if (isWeiXin()) {
            $this.wx = wx;
            Axios.post('/WXINFO/WXSDK/weixin', Qs.stringify({
                ajaxAction: 'WX_AJAX_JSAPI_SIGN',
                "wid": window.Config.wid,
                "url": Z_EU(location.href.split('#')[0])//Z_EU()
            }))
                .then(function (response) {
                    var data = response.data;
                    wxServerLog("initJSSDK " + data.nonceStr);
                    if (!Z_IsEmpty20(data.nonceStr)) {
                        confJSSDK(appArr, data);
                        $this.wx.onVoiceRecordEnd({
                            complete: function (res) {
                                // stopuploadVoice();
                                //$(document).triggerHandler(EVENT_UP_LOAD_VOICE_FAILED_OVERTIME, res);
                            }
                        });
                    }
                })
                .catch(function (error) {
                    wxServerLog("Exception initJSSDK " + error.message);
                });
        } else if (isMhElectron()) {

        } else {
            confJSSDK(appArr, {});
        }
        $this.initState = true;
    };
    this.startuploadImg = function (paramImg, count, isAlert) {
        console.log('startuploadImg')
        wxServerLog("startuploadImg begin " + JSON.stringify(paramImg) + " " + count + " " + isAlert);
        try {
            let paramTmp;
            if (Z_IsEmpty(paramImg) || Z_IsEmpty(paramImg.bId)) {
                console.error("bId is empty")
                return;
            } else {
                paramTmp = paramImg;
            }
            paramTmp.isAlert = isAlert;
            /*简化app*/
            paramTmp.wid = window.Config.wid;
            paramTmp.type = 'Z_GROUP_IMG_MSG';

            store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'prepar')

            let chooseCount = count || 1;
            $this.wx.chooseImage({
                count: chooseCount, // 默认9
                bPara: JSON.stringify(paramTmp),
                success: function (res) {
                    wxServerLog("wx.chooseImage:" + JSON.stringify(res));
                    console.log('native 上传成功')
                    let imgLocalIds = res.localIds;
                    if (typeof (imgLocalIds) !== "undefined") {
                        if (Z_IsNotEmtArray(imgLocalIds)) {
                            window.setTimeout(function () {
                                try {
                                    wxServerLog("wx.chooseImage uploadImgwx:");
                                    paramTmp.imgLocalIds = imgLocalIds;
                                    uploadImgwx(paramTmp);
                                } catch (e) {
                                    console.error(e.stack);
                                }
                            }, 1000);
                        } else {
                            chooseImageFailed();
                        }

                    } else {
                        chooseImageFailed();
                    }
                },
                fail: function (res) {
                    console.log('native 上传失败')
                    chooseImageFailed();
                },
                cancel: function () {
                    console.log('native 上传取消')
                    chooseImageCancel();
                }
            });
        } catch (e) {
            console.info(e.stack)
            wxServerLog("Exception startuploadImg " + e.message);
        }
    };
    /*{"code":1,"errMsg":"操作成功","data":{"姓名":"xx","民族":"汉","保留":"","住址":"xxxxx","公民身份号码":"xxxxx","性别":"男","出生":"1901-01-01"},"readOnly":false}*/
    this.readIdCard = function (ip, callback) {
        let origin = ip || "127.0.0.1"
        Axios.get("http://" + origin + ":10127/zingdll/card/readIdCard")
            .then(function (response) {
                PSMU.debug("readIdCard ", response)
                callback(response.data)
            })
            .catch(function (e) {
                PSMU.error("readIdCard err ", e)
            });
    };
    /*{"code":1,"errMsg":"操作成功","data":{"roomNo":"1#2#5678","endDate":"201001011231","cardId":"EBF38B06","cardNo":"00000005"},"readOnly":false}*/
    this.readDoorCard = function (ip, callback) {
        let origin = ip || "127.0.0.1"
        Axios.get("http://" + origin + ":10127/zingdll/card/readDoorCard")
            .then(function (response) {
                PSMU.debug("readDoorCard ", response)
                callback(response.data)
            })
            .catch(function (e) {
                PSMU.error("readDoorCard err ", e)
            });
    };
    /**
     *
     BeginDate：字符型数据，有效日期(年、月、日、时、分)
     12 位的数字字符(YYYYMMDDhhmm)
     EndDate：字符型数据,有效日期(年、月、日、时、分)
     12 位的数字字符(YYYYMMDDhhmm)
     200509011200 代表 2005年9月1日12点00分
     CardNo：字符型数据,返回卡号 8位数字字符(1-16777215)
     BuildNo：数值型数据,楼号 1－99
     FloorNo：数值型数据,层号 1－99
     RoomNo：字符型数据,房间号码,4位数字字符(如0101房)，*如果房间号码为0000,函数会认为是注销卡片,会清除卡片上的数据
     Name：客人姓名
     * @return map
     * cardNo : 卡号
     * result :
     <0 错误
     =0 正确
     */
    this.writeDoorCard = function (ip, params) {
        let origin = ip || "127.0.0.1"
        Axios.post("http://" + origin + ":10127/zingdll/card/writeDoorCard", params).then(function (response) {
            PSMU.debug("writeDoorCard ", response)
        }).catch((err) => {
            PSMU.error(err);
        })
    };
    function confJSSDK(appArr, data) {
        $this.wx.config({
            debug: false,
            appId: window.Config.wxAppId,
            timestamp: data.timestamp,
            nonceStr: String(data.nonceStr),
            signature: String(data.signature),
            jsApiList: appArr
        });

        $this.wx.ready(function () {
            wxServerLog("confJSSDK wx ready " + (typeof ($this.wx)) + " " + (typeof ($this.wx.checkJsApi)));
            $this.wx.checkJsApi({
                jsApiList: appArr,
                success: function (res) {
                    wxServerLog("checkJsApi success  " + res.errMsg);
                },
                fail: function (res) {
                    wxServerLog("checkJsApi fail  " + res.errMsg);
                }
            });
        });

        $this.wx.error(function (res) {
            console.log("wx.error: " + JSON.stringify(res));
            wxServerLog("wx.error " + res.errMsg);
        });
    }
    function uploadImgwx(paramTmp) {
        wxServerLog("uploadImgwx start bId:" + paramTmp["bId"] + " bType:" + paramTmp["bType"]);
        $this.wx.uploadImage({
            localId: paramTmp.imgLocalIds[0],
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                try {
                    let serverId = res.serverId;
                    serverId = Z_EU(serverId);

                    let uparam = {
                        "wid": window.Config.wid,
                        "serverId": serverId,
                        "type": 'Z_GROUP_IMG_MSG',
                        "bId": paramTmp["bId"],
                        "bType": paramTmp["bType"]
                    };

                    if (!Z_IsEmpty20(paramTmp["companyId"])) {
                        uparam["companyId"] = paramTmp["companyId"];
                    }

                    if (!Z_IsEmpty20(paramTmp["UseUniqueFileID"]) && String(paramTmp["UseUniqueFileID"]) === 'true') {
                        uparam["UseUniqueFileID"] = "true";
                    }

                    uparam.ajaxAction = 'WX_AJAX_UPLOAD_MEDIA';
                    Axios.post('/WXINFO/WXSDK/weixin', Qs.stringify(uparam))
                        .then(function (response) {
                            var data = response.data;
                            uploadImageEnd(data);
                        })
                        .catch(function (error) {
                            //wxServerLog(" readyState:" + error.response.readyState + " status:" + error.response.status + " responseText:" + error.response.responseText);
                            console.error(error);
                        });
                } catch (e) {
                    wxServerLog("Exception uploadImgwx " + e.message);
                }
            },
            fail: function (res) {
                uploadImageFailed();
            }
        });
    }
    function addBind() {
        for (let fn in $this) {
            if (typeof ($this[fn]) === "function") {
                $this[fn].bind = function (ic) {
                    $this.invokingContext = ic;
                    return $this[fn];
                }
            }
        }
    }
    addBind()
    return this;
}();

export default NativeAppHelper;
