import store from '../store'
import {SET_BOTTOM_TOAST, SET_WX_UPLOAD_IMAGE, SET_WX_UPLOAD_IMAGE_STATUS} from "../store/mutation-types";
import {Z_IsEmpty} from "./fn";


/*【注意】只用于app回调相关交互*/
if (!window.MHAppJSBridge){
    window.MHAppJSBridge={

        EVENT_MEDIA_PLAY_COMPLETED : "EVENT_MEDIA_PLAY_COMPLETED",
        callBackCache:{},
        mediaPlayCompleted : function(mediaId) {
            $(document).triggerHandler(MHAppJSBridge.EVENT_MEDIA_PLAY_COMPLETED, {mediaId: mediaId});
        },
        // 条码扫描返回
        onBarcodeScanResult : function(barcode) {
            console.log('onBarcodeScanResult should be override, barcode: ' + barcode);
        },
        /*app http请求回调*/
        onAxiosCB: function (resHeader,body,key) {
            if(typeof MHAppJSBridge.callBackCache[key] ==='function'){
                let callback=MHAppJSBridge.callBackCache[key];
                callback(resHeader,body);
            }
            MHAppJSBridge.unRegAxiosCB(key);
        },
        regAxiosCB: function (key,callback) {
            MHAppJSBridge.callBackCache[key]=callback;
        },
        unRegAxiosCB: function (key) {
            delete MHAppJSBridge.callBackCache[key];
        },

        /*图片上传成功原生回调*/
        appUploadCB:function(data) {
            console.log("uploadImgAppCB :" + JSON.stringify(data))
            let isErr = true
            if (!Z_IsEmpty(data) && !Z_IsEmpty(data.retcode) && data.retcode === 0) {
                isErr = false
                let evtParams = {}
                if (!Z_IsEmpty(data.fileName)) {
                    evtParams['fileName'] = data.fileName
                }
                // sendWXAlert(data.isAlert);
                // unShowMaskAndToast();
                store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'success')
                store.commit(SET_WX_UPLOAD_IMAGE, evtParams)
            }

            if (isErr) {
                store.commit(SET_BOTTOM_TOAST, '上传失败，请稍后重试')
                store.commit(SET_WX_UPLOAD_IMAGE_STATUS, 'failed')
                // unShowMaskAndToast();
            }
        }

    };
}

export default
{
    MHAppJSBridge
}
