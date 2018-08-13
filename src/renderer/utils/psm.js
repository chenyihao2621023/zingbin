var DEFAULT_ERROR_FLAG="error";
var IS_JS_SERV_LOG="false";
var PSM_TPL_KEY="_zsp_";
var KL_MSG="MH_MSG_KL";
// import Loki from 'lokijs'
import { isMhApp , logout } from './fn'
import { setToken } from 'utils/auth'
import Axios from 'axios'
// const LokiIndexedAdapter = require('./loki-indexed-adapter')
// const idbAdapter = new LokiIndexedAdapter.LokiIndexedAdapter('finance')
const protobuf = require("protobufjs");
import {RowCache} from './proxy/rowCache'
/*尽量保持业务无关 业务相关放chatinfo.js中*/
if (!window.PSMU){

    var PSMU = {
        /* native cache */
        rowCache:new RowCache({}),
        router:null,
        isAgent:'false',
        /*当前通信端相关信息*/
        chatInfo:null,
        peerMap:{},
        CHAT_STATUS_CLEAN:'CHAT_STATUS_CLEAN',
        CHAT_STATUS_INIT:'CHAT_STATUS_INIT',
        CHAT_STATUS_OK:'CHAT_STATUS_OK',
        c:null,
        logger: null,
        sTime:'false',
        lTime:'false',
        validChars  : /^[\],:{}\s]*$/,
        validEscape : /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        validTokens : /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        validBraces : /(?:^|:|,)(?:\s*\[)+/g,
        htmlRegArr:[],
        defaultUrlPrefixPublisher : "/httppi",
        token:null,
        nowChatStatus:null,
        isNeedReSend:false,
        reSendTimerId:null,
        SERV_LOG_INTERVAL:30*1000,
        servLogId:false,
        servLogMap:{},
        tokenName:'Authorization',
        tuid:'false',
        tuidCounter:0,
        isUptuid:false,
        uptuidDefaultVal:9960,
        maxtuidval:9999,
        // Base64 encoding table
        b64:new Array(64),

        // Base64 decoding table
        s64:new Array(123),

        /*目前全局变量及状态保存到 psm中 组件数据通信频繁的可以放vuex中
         * 尽量不依赖vue 增加额外复杂性 */
        REV_MSG:'REV_MSG',/*接收消息*/
        REV_HIS_MSG:'REV_HIS_MSG',/*接收历史消息*/
        LOAD_HIS_MSG_END:'LOAD_HIS_MSG_END',/*加载历史消息结束*/
        SELF_MSG:'SELF_MSG',/*发出消息*/
        RESEND_MSG:'RESEND_MSG',/*重发消息*/
        CHAT_NET_ERR_MSG:'CHAT_NET_ERR_MSG',/*网络异常消息发送失败*/
        OUT_CHAT_PAGE_MSG:'OUT_CHAT_PAGE_MSG',/*离开聊天页面*/
        IN_CHAT_PAGE_MSG:'IN_CHAT_PAGE_MSG',/*进入聊天页面*/
        LOGIN_SUCC: 'LOGIN_SUCC',/*登录成功*/
        LOGIN_FAILED: 'LOGIN_FAILED',/*登录失败*/

    	CODE_ZU:'ZU',
    	CODE_ZP:'ZP',

        codeType:false,

        servLogUrl: '/IPSPEC/app/wxsdk/JSLOG',
        logLevelType: {
    	    DEBUG: 'debug',
    	    INFO: 'info',
    	    WARN: 'warn',
    	    ERROR: DEFAULT_ERROR_FLAG,
            CONTENT: 'content'
        },

        /*消息类型 */
        contentType:{
            text:'text'
            ,image:'image'
            ,voice:'voice'
            ,emoticon:'emoticon'
            ,location:'location'
            ,linkCard:'linkCard'
            ,date:'date'
            ,changeOver:'changeOver'
        },

        msgType:{
            Z_MSG_TYPE_CHAT:'chat'
            ,Z_MSG_TYPE_INFO:'info'
            ,KL_MSG:'MH_MSG_KL'
        },

        contentTypeOld:{
            Z_GROUP_IMG_MSG:'Z_GROUP_IMG_MSG'
            ,Z_GROUP_EXPLORER_IMG_MSG:'Z_GROUP_EXPLORER_IMG_MSG'
            ,Z_GROUP_VOICE_MSG:'Z_GROUP_VOICE_MSG'
            ,Z_GROUP_EMOTION_MSG:'Z_GROUP_EMOTION_MSG'
            ,Z_GROUP_LOCATION_MSG:'Z_GROUP_LOCATION_MSG'
            ,Z_GROUP_LinkCard:'Z_GROUP_LinkCard'
        },

        infoSpecialType: {
            CANCLE_MSG: 'Z_CHAT_CANCLE_INFO_MSG',
            MEMBER_CHANGE: 'INFO_ADU'
        },

        testLokijs: function () {
            this.rowCache.insert([{id:'77821603000002800',msg:'回个话'},{id:'77821603000002801',msg:'[^:]slightly_smiling_face[^:][^:]slightly_smiling_face[^:]'},{id:'77821603000002802',msg:'正点对时'}],"GroupChatMsg")
            let results = this.rowCache.find('GroupChatMsg',{'id': '77821603000002800'});
            let str=this.rowCache.serializeCollection({collection:'GroupChatMsg'});
            PSMU.debug("testdb "+str)
            this.rowCache.removeCollection('GroupChatMsg')
            this.rowCache.deserializeCollection(str,{collection:'GroupChatMsg'})
            let results2 = this.rowCache.find('GroupChatMsg',{'id': { '$eq' : '77821603000002800' }});
            let results3 = this.rowCache.find('GroupChatMsg',{'msg': '回个话'});
            // str=this.rowCache.serializeCollection({collection:'GroupChatMsg'});
        },

        initPSM: function (pparam={},msgFun,statusFun) {
            if(PSMU.codeType===false){
                PSMU.setup();
            }
            if(PSMU.isInit()){
                return;
            }
            PSMU.init();

            // PSMU.testLokijs();

            PSMU.chatInfo=pparam;

            if(PSMU.isEmtVal(PSMU.chatInfo.getVal('servIp')) || PSMU.isEmtVal(PSMU.chatInfo.getDid())){
                PSMU.error(DEFAULT_ERROR_FLAG+" initPSM null val ",PSMU.chatInfo);
                return;
            }

            PSMU.info("initPSM ",PSMU.chatInfo);

            this.tuid=PSMU.chatInfo.getVal('uid');

            var isSSL=false;

            if(PSMU.c!=null){
                try{
                    PSMU.c.disconnect();
                    PSMU.c=null;
                }catch(e) {
                    PSMU.error("initPSM:" + e.name + ": " + e.message);
                }
            }
            var ipTmp=PSMU.chatInfo.getVal('servIp').replace(/\./g, "_");
            // var hostTmp=PSMU.isEmtVal(uParam.windowHost)?uParam.IMIP:uParam.windowHost;
            PSMU.c = new PStream({
                /*host: servIp,
                 host: "/",
                 port: '80',*/
                host:PSMU.chatInfo.getVal('servIp'),
                modes: PSMU.isWebSocket()?"websocket|longpolling":"longpolling",
                urlPrefixLongpolling:'/httpl'+ipTmp+'/getData',
                urlPrefixPublisher:'/httpp'+ipTmp+'/',
                channelsArgument: 'channels',
                // urlPrefixWebsocket:'/wscon'+ipEnd+"/scon",
                urlPrefixWebsocket:'/wsci'+ipTmp+'/scon',
                channelsByArgument: true,
                messagesControlByArgument:true,
                messagesPublishedAfter: 5,
                useSSL:isSSL
            });

            if(!PSMU.isEmt(msgFun)){
                PSMU.c.onmessage = msgFun;
            }else{
                PSMU.c.onmessage = _procMsg;
            }

            if(!PSMU.isEmt(statusFun)){
                PSMU.c.onstatuschange = statusFun;
            }else{
                PSMU.c.onstatuschange = _statuschanged;
            }

            PSMU.c.removeAllChannels();
            try {
                PSMU.c.addChannel(PSMU.chatInfo.getDid());
                PSMU.c.connect();
                if(!PSMU.isEmtVal(PSMU.chatInfo.getVal('rechl'))){
                    PSMU.c.regRecordChl(PSMU.chatInfo.getDid(),PSMU.chatInfo.getVal('rechl'));
                }
            } catch(e) {
                // PSMU.serverLog("initPSM:" + e.name + ": " + e.message);
                PSMU.error("initPSM:" + e.name + ": " + e.message);
            };
        },

        setToken: function (token,goPage) {
            console.log('setToken token:'+token +" goPage:"+goPage)
            PSMU.token=token;
            setToken(token)


            if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.setToken)==='function'){
                console.log('MHAppapi setToken')
                MHAppapi.setToken(token);
            }

            if(typeof $.ajaxSetup==='function'){
                $.ajaxSetup({
                    beforeSend:function(xhr) {
                        if(!PSMU.isEmtVal(PSMU.token)){
                            xhr.setRequestHeader(PSMU.tokenName,PSMU.token);
                        }
                    }
                });
            }

            if(typeof $.ajaxSettings==='object'){
                $.ajaxSettings = $.extend($.ajaxSettings, {
                    beforeSend:function(xhr) {
                        if(!PSMU.isEmtVal(PSMU.token)){
                            xhr.setRequestHeader(PSMU.tokenName,PSMU.token);
                        }
                    }
                });
            }

            $( document ).ajaxSuccess(function( event, request, settings ) {
                try {
                    var tokenTmp = request.getResponseHeader(PSMU.tokenName);
                    if (!PSMU.isEmtVal(tokenTmp)) {
                        PSMU.token = tokenTmp;
                    }
                    PSMU.debug("ajaxSuccess " + PSMU.token);
                } catch (e) {
                    /*PSMU.debug("ajaxSuccess ",e);*/
                }
            });

            if(!PSMU.isEmtVal(goPage) && !PSMU.isEmt(PSMU.router)){
                console.log('settoken  '+token +" goPage:"+goPage)
                PSMU.router.push(goPage)
                if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.showMenuBtn)==='function'){
                    MHAppapi.showMenuBtn('true');
                }
            }

        },
        setup: function (router) {
            if(!PSMU.isEmt(router)){
                PSMU.router=router
            }

            PStream.LOG_LEVEL = PSMU.logLevelType.DEBUG;
            // PSMU.codeType=PSMU.CODE_ZU;
            PSMU.codeType=PSMU.CODE_ZP;


            // 65..90, 97..122, 48..57, 43, 47
            for (var i = 0; i < 64;)
                PSMU.s64[PSMU.b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;


            PSMU.initHtmlReg();
            PSMU.startServLog();

            document.addEventListener(PSMU.IN_CHAT_PAGE_MSG, function(evt, revMsg) {
                PSMU.debug('psm rev IN_CHAT_PAGE_MSG', revMsg);
            });

            document.addEventListener(PSMU.OUT_CHAT_PAGE_MSG, function(evt, revMsg) {
                PSMU.debug('psm rev OUT_CHAT_PAGE_MSG', revMsg);
            });

            if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.getToken)==='function'){
                let tokenTmp=MHAppapi.getToken();
                if(!PSMU.isEmtVal(tokenTmp)){
                    PSMU.setToken(tokenTmp);
                }
            }
        },

        init : function(){
            PSMU.nowChatStatus=PSMU.CHAT_STATUS_INIT;
        },
        isInit: function () {
            return PSMU.nowChatStatus==PSMU.CHAT_STATUS_INIT;
        },
        isClean: function () {
            return PSMU.nowChatStatus==PSMU.CHAT_STATUS_CLEAN;
        },
        clean: function () {
            // PSMU.chatInfo=null;
            PSMU.chatClose();
            PSMU.isNeedReSend=false;
            if(PSMU.c!=null){
                try{
                    PSMU.c.disconnect();
                    PSMU.c=null;
                }catch(e) {
                    PSMU.error("psm clean:" + e.name + ": " + e.message);
                }
            }
        },

        appLogout: function () {
            logout().then(() => {
                PSMU.error("psm logout ok");
                PSMU.router.push('/nativelogin')
            }).catch(err => {
                PSMU.error("psm logout err");
                PSMU.router.push('/nativelogin')
            })
        },

        chatClose: function () {
            PSMU.nowChatStatus=PSMU.CHAT_STATUS_CLEAN;
        },
        chatInitOk: function () {
            PSMU.nowChatStatus=PSMU.CHAT_STATUS_OK;
        },
        isChatOk: function () {
            return PSMU.nowChatStatus==PSMU.CHAT_STATUS_OK;
        },
        isEmt: function (value, allowBlank) {
            if (PSMU.isNotDef(value)) {
                return true;
            }
            return value === null || value === undefined || /*((PSMU.isArr(value) && !value.length)) ||*/ (!allowBlank ? value === '' : false) || value === "undefined";
        },
        isEmtVal: function (value) {
            if (PSMU.isNotDef(value)) {
                return true;
            }
            return value == null || value == 'null' || (typeof(value) == 'string' && (value === "undefined" || value == '' ||  PSMU.trim(value) == '')) || (typeof(value) == 'boolean' && value == false);
        },
        isNotDef: function (value) {
            return typeof(value) == "undefined";
        },
        isArr: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isString: function (obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },
        isDate: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Date]';
        },
        isNum: function (num) {
            return (typeof(num)==="number")&&(num!==Infinity)&&!isNaN(num);
        },
        isNotEmtArr: function (o) {
            return PSMU.isArr(o) && typeof(o.length) && o.length > 0;
        },
        trim: function (value) {
            return value.replace(/^\s*/, "").replace(/\s*$/, "");
        },
        getIpEnd: function (ip) {
            if(PSMU.isEmtVal(ip) || ip.indexOf('.') < 0){
                PSMU.error(" getIpEnd ip "+ip);
                return '';
            }
            var ipArr =  ip.split(".");
            return PSMU.fixLeng3(ipArr[3]);
        },
        fixLeng3: function (ip) {
            if(PSMU.isEmtVal(ip)){
                PSMU.error(" fixLeng3 ip "+ip);
                return '';
            }
            if(ip.length==2){
                return "0"+ip;
            }else if(ip.length==1){
                return "00"+ip;
            }
            return ip;
        },
        isWebSocket: function () {
            return window.WebSocket || window.MozWebSocket;
        },
        procMsgLNId: function (msgStr) {
            var ret=msgStr;
            if(msgStr.indexOf(PSM_TPL_KEY+"id:")!=-1){
                var ret=msgStr.split(PSM_TPL_KEY+'id:');
            }
            return ret;
        },
        /*base64Decode: function (string, buffer, offset) {
            var start = offset;
            var j = 0, // goto index
                t;     // temporary
            for (var i = 0; i < string.length;) {
                var c = string.charCodeAt(i++);
                if (c === 61 && j > 1)
                    break;
                if ((c = PSMU.s64[c]) === undefined)
                    throw Error("invalid encoding");
                switch (j) {
                    case 0:
                        t = c;
                        j = 1;
                        break;
                    case 1:
                        buffer[offset++] = t << 2 | (c & 48) >> 4;
                        t = c;
                        j = 2;
                        break;
                    case 2:
                        buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                        t = c;
                        j = 3;
                        break;
                    case 3:
                        buffer[offset++] = (t & 3) << 6 | c;
                        j = 0;
                        break;
                }
            }
            if (j === 1)
                throw Error("invalid encoding");
            return offset - start;
        },*/
        setBuffer: function (ret, val) {
            if(PSMU.isEmt(ret[ret.len])){
                ret[ret.len]=protobuf.util.newBuffer(100);
            }

            if(ret.offset+1>=ret.len*100+100){
                ret[++ret.len]=protobuf.util.newBuffer(100);
            }
            var len = parseInt(ret.offset/100);
            var pos = ret.offset%100;

            ret[len][pos]=val;
            return ++ret.offset;
        },
        base64Decode: function (string, /*buffer,*/ offset) {
            var ret={len:0,offset:offset};

            // var start = offset;
            var j = 0, // goto index
                t;     // temporary
            for (var i = 0; i < string.length;) {
                var c = string.charCodeAt(i++);
                if (c === 61 && j > 1)
                    break;
                if ((c = PSMU.s64[c]) === undefined)
                    throw Error("invalid encoding");
                switch (j) {
                    case 0:
                        t = c;
                        j = 1;
                        break;
                    case 1:
                        PSMU.setBuffer(ret,t << 2 | (c & 48) >> 4);
                        // buffer[offset++] = t << 2 | (c & 48) >> 4;
                        t = c;
                        j = 2;
                        break;
                    case 2:
                        PSMU.setBuffer(ret, (t & 15) << 4 | (c & 60) >> 2);
                        // buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                        t = c;
                        j = 3;
                        break;
                    case 3:
                        PSMU.setBuffer(ret, (t & 3) << 6 | c);
                        // buffer[offset++] = (t & 3) << 6 | c;
                        j = 0;
                        break;
                }
            }
            if (j === 1)
                throw Error("invalid encoding");

            if(ret.offset>0){
                var buf=protobuf.util.newBuffer(ret.offset);
                for(var i=0;i<ret.offset;i++){
                    var len = parseInt(i/100);
                    var pos = i%100;
                    buf[i]=ret[len][pos];
                }
                return buf;
            }
            return null;
            // return offset - start;
        },
        base64Encode: function (buffer, start, end) {
            var parts = null,
                chunk = [];
            var i = 0, // output index
                j = 0, // goto index
                t;     // temporary
            while (start < end) {
                var b = buffer[start++];
                switch (j) {
                    case 0:
                        chunk[i++] = PSMU.b64[b >> 2];
                        t = (b & 3) << 4;
                        j = 1;
                        break;
                    case 1:
                        chunk[i++] = PSMU.b64[t | b >> 4];
                        t = (b & 15) << 2;
                        j = 2;
                        break;
                    case 2:
                        chunk[i++] = PSMU.b64[t | b >> 6];
                        chunk[i++] = PSMU.b64[b & 63];
                        j = 0;
                        break;
                }
                if (i > 8191) {
                    (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                    i = 0;
                }
            }
            if (j) {
                chunk[i++] = PSMU.b64[t];
                chunk[i++] = 61;
                if (j === 1)
                    chunk[i++] = 61;
            }
            if (parts) {
                if (i)
                    parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
            }
            return String.fromCharCode.apply(String, chunk.slice(0, i));
        },
        /*TODO*/
        DU: function (str) {

            if(!PSMU.IS_DU(str)){
                return PSMU.DP(str)
            }

            str = str.replace(/(2_3)(\w{4}|\w{2})/gi, function($0,$1,$2){
                return String.fromCharCode(parseInt($2,16));
            });
            return str;
        },
        EU: function (str) {
            return str.replace(/([\u0000-\uFFFF])/g, function($0){
                try{
                    var char16tmp=parseInt($0.charCodeAt().toString(16),16);
                    if(char16tmp>=0x2002 && char16tmp<=0x200d){
                        return "";
                    }
                }catch(e){
                    return "";
                }

                if($0.charCodeAt() <= 16){
                    return '2_3000' + $0.charCodeAt().toString(16);
                }
                else if($0.charCodeAt() < 256) {
                    return '2_300' + $0.charCodeAt().toString(16);
                }
                else {
                    return '2_3' + $0.charCodeAt().toString(16);
                }
            });
        },

        IS_DU: function (str) {
            return str.indexOf('2_3')==0
        },
        EP: function (json) {
            if(PSMU.isEmtVal(json)){
                return "";
            }
            var root = protobuf.Root.fromJSON(protobuf.common.get('google/protobuf/struct.proto'));
            var StructMessage = root.lookupType("google.protobuf.Struct");
            var postDataConverted = PSMU.json2Struct(json);
            var message = StructMessage.fromObject(postDataConverted);
            var buf=StructMessage.encode(message).finish();
            // this.bufLen=buf.length;
            return PSMU.base64Encode(buf,0,buf.length);
        },

        DP: function (str) {
            if(PSMU.isEmtVal(str)){
                return "";
            }

            if(PSMU.IS_DU(str)){
                return PSMU.DU(str);
            }

            // var buf = protobuf.util.newBuffer(protobuf.util.base64.length(str));
            // var buf = protobuf.util.newBuffer(this.bufLen);
            var buf=PSMU.base64Decode(str, /*buf,*/ 0);
            var root = protobuf.Root.fromJSON(protobuf.common.get('google/protobuf/struct.proto'));
            var StructMessage = root.lookupType("google.protobuf.Struct");
            var message2 = StructMessage.decode(buf);
            var struct=StructMessage.toObject(message2, protobuf.util.toJSONOptions);
            return PSMU.struct2Json(struct);
        },
        struct2Json: function (structObj) {
            var jsonObj = {};
            var jsonObjTmp = {};
            if (typeof structObj.fields === 'object') {
                jsonObjTmp = structObj.fields;
            }
            Object.keys(jsonObjTmp).forEach(function(field) {
                var fieldObj = jsonObjTmp[field];
                var fieldType = Object.keys(fieldObj)[0];
                switch (fieldType) {
                    case 'nullValue':
                        // do nothing
                        break;
                    case 'numberValue':
                    case 'stringValue':
                    case 'boolValue':
                        jsonObj[field] = fieldObj[fieldType];
                        break;
                    case 'structValue':
                        jsonObj[field] = PSMU.struct2Json(fieldObj[fieldType]);
                        break;
                    case 'listValue':
                        jsonObj[field] = PSMU.list2Json(fieldObj[fieldType]);
                        break;
                }
            });
            return jsonObj;
        },

        list2Json: function (listObj) {
            var jsonArray = [];
            var jsonArrayTmp = [];
            if(PSMU.isArr(listObj.values)){
                jsonArrayTmp = listObj.values;
            }

            jsonArrayTmp.forEach(function(itemObj) {
                var fieldType = Object.keys(itemObj)[0];
                switch (fieldType) {
                    case 'nullValue':
                        // do nothing
                        break;
                    case 'numberValue':
                    case 'stringValue':
                    case 'boolValue':
                        jsonArray.push(itemObj[fieldType]);
                        break;
                    case 'structValue':
                        jsonArray.push(PSMU.struct2Json(itemObj[fieldType]));
                        break;
                    case 'listValue':
                        jsonArray.push(PSMU.list2Json(itemObj[fieldType]));
                        break;
                }
            });
            return jsonArray;
        },

        json2Struct: function (jsonObj) {
            var structObj = {};
            var structObjTmp = {};
            if (typeof jsonObj === 'object') {
                structObjTmp = jsonObj;
            }

            Object.keys(structObjTmp).forEach(function(field) {
                var value = structObjTmp[field];
                switch (typeof(value)) {
                    case 'number':
                        structObj[field] = { numberValue: value };
                        break;
                    case 'string':
                        structObj[field] = { stringValue: value };
                        break;
                    case 'boolean':
                        structObj[field] = { boolValue: value };
                        break;
                    case 'object':
                        // null
                        if (!value) break;
                        if (value.constructor === Object) {
                            structObj[field] = { structValue: PSMU.json2Struct(value) };
                        } else if (value.constructor === Array) {
                            structObj[field] = { listValue: PSMU.json2List(value) };
                        }
                        break;
                }
            });
            return { fields: structObj };
        },

        json2List: function (jsonArray) {
            var listObj = [];
            var listObjTmp = [];

            if(PSMU.isArr(jsonArray)){
                listObjTmp = jsonArray;
            }

            listObjTmp.forEach(function(jsonObj) {
                switch (typeof(jsonObj)) {
                    case 'number':
                        listObj.push({ numberValue: jsonObj });
                        break;
                    case 'string':
                        listObj.push({ stringValue: jsonObj });
                        break;
                    case 'boolean':
                        listObj.push({ boolValue: jsonObj });
                        break;
                    case 'object':
                        // null
                        if (!jsonObj) break;
                        if (jsonObj.constructor === Object) {
                            listObj.push({ structValue: PSMU.json2Struct(jsonObj) });
                        } else if (jsonObj.constructor === Array) {
                            listObj.push({ listValue: PSMU.json2List(jsonObj) });
                        }
                        break;
                }
            });
            return { values: listObj };
        },
        procTA: function (ta) {
            try {
                if(!PSMU.isEmtVal(ta)){
                    if(ta.indexOf('dm:')==0){
                        var taArr=ta.split(':');
                        if(taArr.length>1){
                            var tarId=taArr[1];
                            /*chatList.delItem(tarId);*/
                            /*if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.exSLT)!='undefined' && !PSMU.isEmtVal(tarId) ){
                             MHAppapi.exSLT("delete from ChatHisMsg where mid='"+tarId+"'");
                             }*/
                        }
                    }else if(ta.indexOf('dgm:')==0){
                        /*if (mhUserVars != 'false' && !PSMU.isEmt(mhUserVars.loadTalkInfo)
                         && !PSMU.isEmt(mhUserVars.loadTalkInfo.murl)) {
                         if(ta.indexOf(mhUserVars.loadTalkInfo.murl)!=-1){
                         window.history.go(-1);
                         }
                         }*/
                    }
                }
            } catch(e) {
                PSMU.error(" procTA "+e.name+" : "+ e.message);
            }
        },
        checkReSendTimer: function () {
            if(PSMU.reSendTimerId!=null){
                window.clearTimeout(PSMU.reSendTimerId);
            }
            PSMU.reSendTimerId=window.setTimeout(PSMU.reSend(), 2100);
        },
        startReSend: function () {
            PSMU.isNeedReSend=true;
            PSMU.checkReSendTimer();
        },
        reSend: function () {
            if(PSMU.isNeedReSend){
                PSMU.isNeedReSend=false;
                /*todo 队列+发送成功失败标志*/
                $(document).triggerHandler(PSMU.RESEND_MSG, {});
                // PSMU.chatInfo.sendBtn();
            }
            if(PSMU.isNeedReSend){
                PSMU.checkReSendTimer();
            }
        },
        servTime: function () {
            var ret = new Date().getTime();
            /*if(is_mhappAndroid() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.getSTime)=='function'){
             ret=MHAppapi.getSTime();
             if(typeof(ret)=='string' && ret.length>0){
             return Number(ret);
             }else{
             ret = new Date().getTime();
             }
             }*/
            try{
                if(PSMU.sTime=='false' || PSMU.lTime=='false'){
                    return ret;
                }
                if (PSMU.lTime >= PSMU.sTime) {
                    ret = ret - (PSMU.lTime - PSMU.sTime);
                } else if (PSMU.sTime > PSMU.lTime) {
                    ret = ret+PSMU.sTime-PSMU.lTime;
                }
            }catch (e) {
            }
            return ret;
        },
        parseJSON : function(data) {
            if (!data || !PSMU.isString(data)) {
                return data;
            }

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = PSMU.trim(data);

            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                try {
                    return window.JSON.parse( data );
                } catch(e) {
                    throw "Invalid JSON: " + data;
                }
            }else if(typeof($.parseJSON)!='undefined'){
                try {
                    return $.parseJSON(data);
                } catch(e) {
                    throw "Invalid $ JSON: " + data;
                }
            }

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (PSMU.validChars.test(data.replace(PSMU.validEscape, "@").replace( PSMU.validTokens, "]").replace( PSMU.validBraces, "")) ) {
                return (new Function("return " + data))();
            }
            throw "Invalid JSON: " + data;
        },

        stringify: function (json) {
            try {
                return JSON.stringify(json);
            } catch(e) {
                throw "Invalid JSON: " + json;
            }
            return '';
        },

        upperJsonKey: function (json) {
            var ret={};
            for (var key in json){
                ret[key.toUpperCase()]=json[key];
            }
            return ret;
        },

        send: function (msg,successCallback, errorCallback,iskipRec) {
            try {
                if(PSMU.c!=null){
                    PSMU.c.send(msg,iskipRec,successCallback, errorCallback);
                }
            } catch(e) {
                PSMU.error("psm send : " + msg+" "+ e.name + ": " + e.message);
                throw "psm send : " + msg+" "+ e.name + ": " + e.message;
            }
        },

        parseMsg: function (msgStr) {
            // console.log('parseMsg', msgStr)

            if (!PSMU.isEmtVal(msgStr)) {

                if(!PSMU.isString(msgStr)){
                    return msgStr;
                }

                try {
                    var msgLNId='false';
                    var msgArr=PSMU.procMsgLNId(msgStr);
                    if(!PSMU.isEmtVal(msgArr) && PSMU.isArr(msgArr) && msgArr.length>1){
                        msgStr=msgArr[0];
                        msgLNId=msgArr[1];
                    }
                    var jsonMsg = null;
                    if(PSMU.codeType===PSMU.CODE_ZU){
                        msgStr=PSMU.DU(msgStr);
                        jsonMsg = PSMU.parseJSON(msgStr);
                    }else if(PSMU.codeType===PSMU.CODE_ZP){
                        jsonMsg=PSMU.DP(msgStr);

                        PSMU.debug("parseMsg dp",jsonMsg);

                    }

                    if (!PSMU.isEmt(jsonMsg) && PSMU.isString(jsonMsg)) {
                        jsonMsg = JSON.parse(jsonMsg)
                    }

                    // mid
                    if(PSMU.isEmtVal(jsonMsg['mid'])) {
                        jsonMsg.mid = 'nomid'
                    }

                    if(msgLNId !== 'false'){
                        jsonMsg.msgLNId = msgLNId;
                    }

                    return jsonMsg;

                    //TODO 校验
                    /*if(!PSMU.isEmtVal(jsonMsg.nf) && !PSMU.isEmtVal(jsonMsg.nt) && !PSMU.isEmtVal(jsonMsg.msg) && isCIDOK(jsonMsg.nt)){

                     if(typeof(jsonMsg.mty)=='undefined'){
                     jsonMsg.mty=ZIM.ALLZMSG.Z_MSG_TYPE_CHAT;
                     }

                     if(PSMU.isEmtVal(jsonMsg.mid)){
                     jsonMsg.mid='nomid';
                     }

                     if(!PSMU.isEmtVal(jsonMsg.ta)){
                     PSMU.procTA(jsonMsg.ta);
                     }

                     var sTimeTmp=PSMU.servTime();
                     jsonMsg.time=(new Date(sTimeTmp)).format("yyyy-MM-dd hh:mm:ss");

                     if(!PSMU.isEmtVal(jsonMsg.msg) && jsonMsg.msg.indexOf(KL_MSG)!=-1){

                     }else{
                     return jsonMsg;
                     // PSMU.debug();
                     }
                     }*/
                } catch(e) {
                    // PSMU.serverLog(" error parseMsg:" + e.name + ": " + e.message + ": " + e.stack);
                    PSMU.error(" error parseMsg:" + e.name + ": " + e.message + ": " + e.stack);
                    throw "error parseMsg: " + e.message;
                }
            }

            return {};
        },

        parseLoginMsg: function (msgStr) {
            if (!PSMU.isEmtVal(msgStr)) {

                if(!PSMU.isString(msgStr)){
                    return msgStr;
                }

                try {
                    var msgArr=PSMU.procMsgLNId(msgStr);
                    if(!PSMU.isEmtVal(msgArr) && PSMU.isArr(msgArr) && msgArr.length>1){
                        msgStr=msgArr[0];
                    }

                    msgStr=PSMU.DU(msgStr);
                    var jsonMsg = PSMU.parseJSON(msgStr);

                    if(jsonMsg.msg.indexOf('Z_SCOK')!=-1 && jsonMsg.nf=='goid'){
                        jsonMsg.msg=jsonMsg.msg.replace("Z_SCOK","");
                        //var msgSend=Z_EU(jsonObjTmp.msg);
                        // window.location="/NCard/IMKFService?ac=mhCheck&cMsg="+jsonMsg.msg;
                        $(document).triggerHandler(PSMU.LOGIN_SUCC, jsonMsg.msg)
                    }else{
                        //newQRCode();
                        $(document).triggerHandler(PSMU.LOGIN_FAILED, jsonMsg.msg)
                    }

                    return jsonMsg;
                } catch(e) {
                    // PSMU.serverLog(" error parseMsg:" + e.name + ": " + e.message);
                    PSMU.error(" error parseMsg:" + e.name + ": " + e.message);
                    throw "error parseMsg: " + e.message;
                }
            }
        },

        /*临时兼容现有guid，应该调整为整形集群唯一id*/
        guid: function () {
            return (PSMU.S4()+PSMU.S4()+PSMU.S4()+PSMU.S4()+PSMU.S4()+PSMU.S4()+PSMU.S4()+PSMU.S4());
        },

        S4: function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        getTuid: function (isReload) {
            let that=this;
            var ret='tuidErr';
            if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.getTuid)=='function'){
                ret=MHAppapi.getTuid();
                if(typeof(ret)=='string' && ret.length>0){
                    return ret;
                }else{
                    var ret='tuidErr';
                }
            }

            try{
                var needReload=false;
                if(this.tuidCounter>=this.maxtuidval){
                    needReload=true;
                }else{
                    if(this.tuidCounter++>this.uptuidDefaultVal){
                        if(!this.isUptuid || (typeof(isReload)!='undefined' && isReload==true)){
                            needReload=true;
                        }
                    }

                    if(this.tuidCounter<10){
                        ret= this.tuid+'0000'+this.tuidCounter;
                    }else if(this.tuidCounter<100){
                        ret= this.tuid+'000'+this.tuidCounter;
                    }else if(this.tuidCounter<1000){
                        ret= this.tuid+'00'+this.tuidCounter;
                    }else if(this.tuidCounter<10000){
                        ret= this.tuid+'0'+this.tuidCounter;
                    }
                    //ret= tuid+(tuidCounter>=10?tuidCounter:'0'+tuidCounter);
                }

                if(needReload){
                    this.isUptuid=true;
                    Axios.get(this.chatInfo.url.tuid)
                        .then(function(res) {
                            if(!PSMU.isEmtVal(data)){
                                that.tuid=data;
                                that.isUptuid=false;
                                that.tuidCounter=0;
                            }else{
                                window.setTimeout('PSMU.getTuid(true);', 2000);
                            }
                        })
                        .catch(function(err) {
                            PSMU.error(" update tuid  ");
                            window.setTimeout('PSMU.getTuid(true);', 2000);
                        });

                }
            }catch(e){
                // PSMU.serverLog("uptuid:" + e.name + ": " + e.message);
                PSMU.error("uptuid:" + e.name + ": " + e.message);
            }

            return ret;

        },

        escapeText: function (text) {
            return (text) ? window.escape(text) : '';
        },

        unescapeText: function (text) {
            return (text) ? window.unescape(text) : '';
        },

        initHtmlReg: function () {
            var legalTagArr = 'p,h1,h2,h3,h4,h5,h6,blockquote,table,ul,ol,pre'.split(',');
            $.each(legalTagArr, function (k, tag) {
                var reg = '\>\\s*\<(' + tag + ')\>';
                PSMU.htmlRegArr.push(new RegExp(reg, 'ig'));
            });
            PSMU.htmlRegArr.push(new RegExp('\>\\s*\<(li)\>', 'ig'));
            PSMU.htmlRegArr.push(new RegExp('\>\\s*\<(tr)\>', 'ig'));
            PSMU.htmlRegArr.push(new RegExp('\>\\s*\<(code)\>', 'ig'));
        },

        html2txt: function (html) {
            if(!html) return false
            var $temp = $('<div>');
            html = html.replace(/\s*</ig, '<');
            $.each(PSMU.htmlRegArr, function (k, reg) {
                if (!reg.test(html)) {
                    return;
                }
                html = html.replace(reg, function (matchStr, tag) {
                    return '>\n<' + tag + '>';
                });
            });
            $temp.html(html);
            return $temp.text();
        },


        getUrlParam:function(name){
            return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
        },

        startServLog: function () {
            // PSMU.debug('startServLog', PSMU.servLogId)
            if(PSMU.servLogId===false){
                PSMU.servLogId = window.setInterval( PSMU.servLog, PSMU.SERV_LOG_INTERVAL );
            }
        },

        stopServLog: function () {
            if(PSMU.servLogId!==false){
                window.clearInterval(PSMU.servLogId);
                PSMU.servLogId=false
            }
        },

        addServLog: function (log,levl) {
            if (!levl) levl = PSMU.logLevelType.CONTENT

            PSMU.startServLog();
            if(PSMU.isEmt(PSMU.servLogMap[levl])){
                PSMU.servLogMap[levl]=[];
            }
            PSMU.servLogMap[levl].push(log);

            if(PSMU.servLogMap[levl].length>10){
                PSMU.servLog();
            }
        },

        servLog:function (){
            // PSMU.debug('servLog')
            if (Object.keys(PSMU.servLogMap).length === 0) return

            var tmp = {}
            Object.keys(PSMU.servLogMap).forEach(levl => {
                switch (levl) {
                    case PSMU.logLevelType.CONTENT:
                        tmp.content = PSMU.servLogMap[levl].join('\n')
                        break;
                    case PSMU.logLevelType.DEBUG:
                        tmp.debug = PSMU.servLogMap[levl].join('\n')
                        break;
                    case PSMU.logLevelType.ERROR:
                        tmp.error = PSMU.servLogMap[levl].join('\n')
                        break;
                    case PSMU.logLevelType.INFO:
                        tmp.info = PSMU.servLogMap[levl].join('\n')
                        break;
                    case PSMU.logLevelType.WARN:
                        tmp.warn = PSMU.servLogMap[levl].join('\n')
                        break;
                    default:
                        console.error('unsupport log level', levl, PSMU.servLogMap[levl])
                }
            })

            // PSMU.servLogMap.time=PSMU.servTime();
            tmp.time=PSMU.servTime();
            $.ajax({
                url:PSMU.servLogUrl,type:'post',dataType:'json',data:JSON.stringify(tmp),contentType : 'application/json;charset=UTF-8',
                success:function(data,status,xhr){
                    PSMU.servLogMap={};
                },
                error:function(){
                }
            });
        },

        debug: function () {
            /*if (IS_JS_SERV_LOG == 'true') {
             var str = '';
             for (var i = 0; i < arguments.length; i++) {
             str += arguments[i] + " ";
             }
             str + "  ";
             serverLogMH(isWebSocket + " " + conType + " PSMU debug: " + str);
             return;
             }*/
            if (PStream.LOG_LEVEL === PSMU.logLevelType.DEBUG) {
                if (!isMhApp()) {
                    PSMU._log.apply(PSMU._log, arguments);
                }
            }
        },
        info: function () {
//        if(IS_JS_SERV_LOG=='true'){
//            var str = '';
//            for (var i = 0; i < arguments.length; i++) {
//                str += arguments[i] + " ";
//            }
//            str +"  ";
//            serverLogMH(isWebSocket+" "+conType+" PSMU info: "+str);
//            return;
//        }

            if ((PStream.LOG_LEVEL === PSMU.logLevelType.INFO) || (PStream.LOG_LEVEL === PSMU.logLevelType.DEBUG)) {
                if (!isMhApp()) {
                    PSMU._log.apply(PSMU._log, arguments);
                }
            }
        },
        error: function () {
            /*if (IS_JS_SERV_LOG == 'true') {
             var str = '';
             for (var i = 0; i < arguments.length; i++) {
             str += arguments[i] + " ";
             }
             str + "  ";
             serverLogMH(isWebSocket + " " + conType + " PSMU info: " + str);
             return;
             }*/
            try {
                arguments[0] = DEFAULT_ERROR_FLAG + " " + arguments[0];
            } catch (e) {
            }
            PSMU._log.apply(PSMU._log, arguments);
            PSMU.serverLog(PSMU.logLevelType.ERROR, arguments);
        },
        serverLog: function (level) {
            if (!level) level = PSMU.logLevelType.CONTENT

            if (level === PSMU.logLevelType.ERROR) {
                try {
                    arguments[0] = DEFAULT_ERROR_FLAG + " " + arguments[0];
                } catch (e) {
                }
                PSMU._log.apply(PSMU._log, arguments);
            }

            var l = Array.prototype.slice.call(arguments).map(i => {
                if (typeof i === 'object') {
                    return JSON.stringify(i)
                }
                return i
            }).join(' ')

            PSMU.addServLog(l, level)
        },
        _log: function () {
            if (!PSMU.logger) {
                var console = window.console;
                if (console && console.log) {
                    if (console.log.apply) {
                        PSMU.logger = console.log;
                    } else if ((typeof console.log === "object") && Function.prototype.bind) {
                        PSMU.logger = Function.prototype.bind.call(console.log, console);
                    } else if ((typeof console.log === "object") && Function.prototype.call) {
                        PSMU.logger = function () {
                            Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
                        };
                    }
                }
            }

            if (PSMU.logger) {
                PSMU.logger.apply(window.console, arguments); // 暂时取消断点
            }

            var logElement = document.getElementById(PStream.LOG_OUTPUT_ELEMENT_ID);
            if (logElement) {
                var str = '';
                for (var i = 0; i < arguments.length; i++) {
                    str += arguments[i] + " ";
                }
                logElement.innerHTML += str + '\n';

                var lines = logElement.innerHTML.split('\n');
                if (lines.length > 100) {
                    logElement.innerHTML = lines.slice(-100).join('\n');
                }
            }
        }
    };

    window.PSMU=PSMU;

}

var psmu=window.PSMU;
export default
{
    psmu
}

var ZIM = {
    ui : {},				// widgets, forms, uiconfigs
    backend : {},	// the backend Adapter with urls, functions and xml parsers
    factory : {},		// factory for generating dialogs
    connected : false,
    roster: null,
    memQ:null,
    myJid:"",
    hud:'',
    mgr:null,
    timer: null,
//	inboundData:null,
    MUCFlag : {},
    MUCItems : {},
    MUCMember : {},
    AcionParams:{},
    ALLZMSG:{},
    MSGText:{},
    AskCallListColine:{},
    AskCallListInline:{},
    JidInfoMap:{},

    init : function(){
    }
};

ZIM.AcionParams = {
    isUseAskCallList : 'true',
    isCallListAutoPop : 'true',
    isAgent : 'true',
    agentCustomerNO : 5,
    isJianTingAlert : 'true',
    isQiangchaAlert : 'true',
    isLanjieAlert : 'true',
    isZhidaoAlert : 'true'
};

ZIM.ALLZMSG = {
    Z_NO_ORDER:'Z_NO_ORDER'
    ,Z_MSG_TYPE_CHAT:'chat'
    ,Z_MSG_TYPE_INFO:'info'
    ,Z_MSG_ASK_VCARD:'ZING_MSG_ASK_VCARD'
    ,Z_NICK_COLOR_SELF:'blue'
    ,Z_NICK_COLOR_PEER:'green'
    ,Z_MSG_ANS:'ZING_MSG_ANSWER'
    ,Z_INBOUND_CLOSE:'ZING_MSG_FAILINBOUND_CLOSE'
    ,Z_INBOUND_CLOSE_A:'ZING_MSG_INBOUND_CLOSE_AGENT'
    ,Z_MSG_CALL:'ZING_MSG_CALL'
    ,Z_MSG_COMING:'ZING_MSG_COMING'
    ,Z_MSG_VCARD:'ZING_MSG_VCARD'
    ,Z_MSG_MYD:'ZING_MSG_MYD'

    ,Z_SCREEN_SHOT:'ZING_MSG_SCREEN_SHOT'
    ,Z_INBOUND:'ZING_MSG_INBOUND'
    ,Z_TRANSFER:'ZING_MSG_TRANSFER'
    ,Z_AUTO_ANS:'ZING_AUTO_ANS'
    ,Z_CALL_STATUS:'ZING_CALL_STATUS'
    ,Z_CALL_WITTING_CO:'ZING_CALL_STATUS_CALL_WITTING_COLINE'
    ,Z_CALL_WITTING_IN:'ZING_CALL_STATUS_CALL_WITTING_INLINE'
    ,Z_CALL_ANS:'ZING_CALL_STATUS_ANSWER'
    ,Z_CALL_HANGUP:'ZING_CALL_STATUS_HANGUP'
    ,Z_AGENT_STATUS:'ZING_AGENT_STATUS'
    ,Z_AGENT_NAME_SYS:'系统'
    ,Z_AGENT_NAME_BOT:'智能客服'
    ,Z_AGENT_NAME_UNANS:'没答案'
    ,Z_AGENT_NAME_MYD:'满意度'
};

/**
 * @class ZIM.backend.url
 * @description stores the backend urls
 */
ZIM.backend.url = {
    baseurl : "/im/",
    isconnected : "/im/adapter/isconnected",
    login : "/im/adapter/login",
    getbuddys : "/im/adapter/getbuddys",
    logout : "/im/adapter/logout",
    sendmessage : "/im/adapter/sendmessage",
    setpresence : "/im/adapter/sendpresence",
    getnotifications : "/im/adapter/notifications",
    addbuddy : "/im/adapter/addbuddy",
    addgroup : "/im/adapter/addgroup",
    deletebuddy : "/im/adapter/deletebuddy",
    deletegroup : "/im/adapter/deletegroup"	,
    renamebuddy :"/im/adapter/renamebuddy",
    renamegroup :"/im/adapter/renamegroup",
    switchusergroup : "/im/adapter/switchusergroup",
    subscribe : "/im/adapter/subscribe"
};


ZIM.MSGText = {
    MSG_TYPE_AT_SSC_MSG:'SSC_AT_MSG'
};

(function (window, document, undefined) {
    //"use strict";

    /* prevent duplicate declaration */
    if (window.PStream) { return; }

    var Utils = {};

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var valueToTwoDigits = function (value) {
        return ((value < 10) ? '0' : '') + value;
    };

    Utils.dateToUTCString = function (date) {
        var time = valueToTwoDigits(date.getUTCHours()) + ':' + valueToTwoDigits(date.getUTCMinutes()) + ':' + valueToTwoDigits(date.getUTCSeconds());
        return days[date.getUTCDay()] + ', ' + valueToTwoDigits(date.getUTCDate()) + ' ' + months[date.getUTCMonth()] + ' ' + date.getUTCFullYear() + ' ' + time + ' GMT';
    };

    var extend = function () {
        var object = arguments[0] || {};
        for (var i = 0; i < arguments.length; i++) {
            var settings = arguments[i];
            for (var attr in settings) {
                if (!settings.hasOwnProperty || settings.hasOwnProperty(attr)) {
                    object[attr] = settings[attr];
                }
            }
        }
        return object;
    };

    var getControlParams = function(pStream) {
        var data = {};
        data[pStream.tagArgument] = "";
        data[pStream.timeArgument] = "";
        data[pStream.eventIdArgument] = "";
        if (pStream.messagesControlByArgument) {
            data[pStream.tagArgument] = Number(pStream._etag);
            if (pStream._lastModified) {
                data[pStream.timeArgument] = pStream._lastModified;
            } else if (pStream._lastEventId) {
                data[pStream.eventIdArgument] = pStream._lastEventId;
            }
        }
        return data;
    };

    var getTime = function() {
        return PSMU.servTime();
        /*return (new Date()).getTime();*/
    };

    var currentTimestampParam = function() {
        return { "_" : getTime() };
    };

    var objectToUrlParams = function(settings) {
        var params = settings;
        if (typeof(settings) === 'object') {
            params = '';
            for (var attr in settings) {
                if (!settings.hasOwnProperty || settings.hasOwnProperty(attr)) {
                    params += '&' + attr + '=' + window.escape(settings[attr]);
//            params += '&' + attr + '=' + PSMU.EU(settings[attr]);
                }
            }
            params = params.substring(1);
        }

        return params || '';
    };

    var addParamsToUrl = function(url, params) {
        return url + ((url.indexOf('?') < 0) ? '?' : '&') + objectToUrlParams(params);
    };


    var Ajax = {
        _getXHRObject : function() {
            var xhr = false;
            try { xhr = new window.XMLHttpRequest(); }
            catch (e1) {
                try { xhr = new window.XDomainRequest(); }
                catch (e2) {
                    try { xhr = new window.ActiveXObject("Msxml2.XMLHTTP"); }
                    catch (e3) {
                        try { xhr = new window.ActiveXObject("Microsoft.XMLHTTP"); }
                        catch (e4) {
                            xhr = false;
                        }
                    }
                }
            }
            return xhr;
        },

        _send : function(settings, post) {
            settings = settings || {};
            settings.timeout = settings.timeout || 30000;
            var xhr = Ajax._getXHRObject();
            if (!xhr||!settings.url) { return; }

            Ajax.clear(settings);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    Ajax.clear(settings);
                    if (settings.afterReceive) { settings.afterReceive(xhr); }
                    if(xhr.status === 200) {
                        if (settings.success) { settings.success(xhr.responseText); }
                    } else {
                        if (settings.error) { settings.error(xhr.status); }
                    }
                }
            };

            if (settings.beforeOpen) { settings.beforeOpen(xhr); }

            var params = {};
            var body = null;
            var method = "GET";
            if (post) {
                body = objectToUrlParams(settings.data);
                method = "POST";
            } else {
                params = settings.data || {};
            }

            xhr.open(method, addParamsToUrl(settings.url, extend({}, params, currentTimestampParam())), true);

            if (settings.beforeSend) { settings.beforeSend(xhr); }

            var onerror = function() {
                try { xhr.abort(); } catch (e) { /* ignore error on closing */ }
                Ajax.clear(settings);
                settings.error(304);
            };

            if (post) {

                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            } else {
                settings.timeoutId = window.setTimeout(onerror, settings.timeout + 2000);
            }
//       alert("send body:"+body);
            xhr.send(body);
            return xhr;
        },

        _clear_script : function(script) {
            // Handling memory leak in IE, removing and dereference the script
            if (script) {
                script.onerror = script.onload = script.onreadystatechange = null;
                if (script.parentNode) { script.parentNode.removeChild(script); }
            }
        },

        _clear_timeout : function(settings) {
            settings.timeoutId = clearTimer(settings.timeoutId);
        },

        clear : function(settings) {
            Ajax._clear_timeout(settings);
            Ajax._clear_script(document.getElementById(settings.scriptId));
        },

        jsonp : function(settings) {
            settings.timeout = settings.timeout || 30000;
            Ajax.clear(settings);

            var head = document.head || document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            var startTime = getTime();

            var onerror = function() {
                Ajax.clear(settings);
                var callbackFunctionName = settings.data.callback;
                if (callbackFunctionName) { window[callbackFunctionName] = function() { window[callbackFunctionName] = null; }; }
                var endTime = getTime();
                settings.error(((endTime - startTime) > settings.timeout/2) ? 304 : 0);
            };

            var onload = function() {
                Ajax.clear(settings);
                settings.load();
            };

            script.onerror = onerror;
            script.onload = script.onreadystatechange = function(eventLoad) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    onload();
                }
            };

            if (settings.beforeOpen) { settings.beforeOpen({}); }
            if (settings.beforeSend) { settings.beforeSend({}); }

            settings.timeoutId = window.setTimeout(onerror, settings.timeout + 2000);
            settings.scriptId = settings.scriptId || getTime();

            var callbackFunctionName = settings.data.callback;
            if (callbackFunctionName) { window[callbackFunctionName] = function() { window[callbackFunctionName] = null; }; }
            settings.data.callback = settings.scriptId + "_onmessage_" + getTime();
            window[settings.data.callback] = settings.success;

            script.setAttribute("src", addParamsToUrl(settings.url, extend({}, settings.data, currentTimestampParam())));
            script.setAttribute("async", "async");
            script.setAttribute("id", settings.scriptId);

            // Use insertBefore instead of appendChild to circumvent an IE6 bug.
            head.insertBefore(script, head.firstChild);
            return settings;
        },

        load : function(settings) {
            return Ajax._send(settings, false);
        },

        post : function(settings) {
            return Ajax._send(settings, true);
        },

        postBak : function(settings) {
            var params = {};
            var body = objectToUrlParams(settings.data);
            var posturl = addParamsToUrl(settings.url, extend({}, params, currentTimestampParam()));
            alert(posturl);
            $.ajax({
                async: true,
                type: "POST",
                url: posturl,
                data: body,
                success: function (data) {

                },
                beforeSend: function () {
                },
                complete: function () {

                },
                error: function (jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        alert('网络异常.\n 请检查网络. '+jqXHR.responseText);
                    } else if (jqXHR.status == 404) {
                        alert('系统异常. [4]');
                    } else if (jqXHR.status == 500) {
                        alert('系统异常. [5]');
                    } else if (exception === 'parsererror') {
                        alert('系统异常. [6]');
                    } else if (exception === 'timeout') {
                        alert('系统异常,请求超时');
                    } else if (exception === 'abort') {
                        alert('系统异常. [7]');
                    } else {
                        alert('系统异常. [8]\n'+jqXHR.responseText);
                    }
                }
            });
        }
    };

    Utils.parseMessage = function(messageText, keys) {
        var msg = messageText;
        if (PSMU.isString(messageText)) {
            msg = PSMU.parseJSON(messageText);
        }

        var message = {
            id     : msg[keys.jsonIdKey],
            channel: msg[keys.jsonChannelKey],
            text   : PSMU.isString(msg[keys.jsonTextKey]) ? PSMU.unescapeText(msg[keys.jsonTextKey]) : msg[keys.jsonTextKey],
            tag    : msg[keys.jsonTagKey],
            time   : msg[keys.jsonTimeKey],
            eventid: msg[keys.jsonEventIdKey] || ""
        };

        return message;
    };

    var getBacktrack = function(options) {
        return (options.backtrack) ? ".b" + Number(options.backtrack) : "";
    };

    var getChannelsPath = function(channels, withBacktrack) {
        var path = '';
        for (var channelName in channels) {
            if (!channels.hasOwnProperty || channels.hasOwnProperty(channelName)) {
                path += "/" + channelName + (withBacktrack ? getBacktrack(channels[channelName]) : "");
            }
        }
        return path;
    };

    var getSubscriberUrl = function(pStream, prefix, extraParams, withBacktrack) {
        var websocket = pStream.wrapper.type === WebSocketWrapper.TYPE;
        var useSSL = pStream.useSSL;
        var url = (websocket) ? ((useSSL) ? "wss://" : "ws://") : ((useSSL) ? "https://" : "http://");
        url += pStream.host;
        url += ((!useSSL && pStream.port === 80) || (useSSL && pStream.port === 443)) ? "" : (":" + pStream.port);
        url += prefix;

        var channels = getChannelsPath(pStream.channels, withBacktrack);
        if (pStream.channelsByArgument) {
            var channelParam = {};
            channelParam[pStream.channelsArgument] = channels.substring(1);
            extraParams = extend({}, extraParams, channelParam);
        } else {
            url += channels;
        }
        return addParamsToUrl(url, extraParams);
    };

    var getPublisherUrl = function(pStream) {
        var channel = "";
        var url = (pStream.useSSL) ? "https://" : "http://";
        url += pStream.host;
        url += ((pStream.port !== 80) && (pStream.port !== 443)) ? (":" + pStream.port) : "";
        url += pStream.urlPrefixPublisher;
        for (var channelName in pStream.channels) {
            if (!pStream.channels.hasOwnProperty || pStream.channels.hasOwnProperty(channelName)) {
                channel = channelName;
                break;
            }
        }
        url += "?id=" + channel;
        return url;
    };

    var getPublisherUrls = function(pStream,chls) {
        var channel = "";
        var url = (pStream.useSSL) ? "https://" : "http://";
        url += pStream.host;
        url += ((pStream.port !== 80) && (pStream.port !== 443)) ? (":" + pStream.port) : "";
        url += pStream.urlPrefixPublisher;
        url += "?id=" ;
        var hasChl='false';
        for (var channelName in chls) {
            if (!pStream.channels.hasOwnProperty || pStream.channels.hasOwnProperty(channelName)) {
                url+=channelName+"/";
                hasChl='true';
            }
        }
        if(hasChl=='false'){
            return "false";
        }
        return url;
    };

    var getPublisherUrlsTest = function(pStream,chls) {
        var channel = "";
        var url = (pStream.useSSL) ? "https://" : "http://";
        url += pStream.host;
        url += ((pStream.port !== 80) && (pStream.port !== 443)) ? (":" + pStream.port) : "";
        url += pStream.urlPrefixPublisher;
        url += "?id=" ;
        var hasChl='false';
        for (var chlTmp in chls) {
//    	if (!pStream.channels.hasOwnProperty || pStream.channels.hasOwnProperty(chlTmp)) {
            url+=chlTmp+"/";
            hasChl='true';
            //  	}
        }

        if(hasChl=='false'){
            return "false";
        }

        return url;
    };

    /**
     *
     * @param  message 已验证
     *
     */
    var getPublisherUrlsJsJac = function(pStream,to,iskipRec) {

        var chls=to;
        /*todo 内外网*/
        var imIp=PSMU.chatInfo.getVal('servIp');
        if(PSMU.isEmtVal(imIp)){
            /*TODO*/
            // ipEnd=pStream.urlPrefixPublisher;
            imIp="";
            PSMU.error("Exception getPublisherUrlsJsJac null imIp "+imIp+" "+to);
        }else{
            imIp=imIp.replace(/\./g, "_");
            imIp=PSMU.defaultUrlPrefixPublisher+imIp+"/";
        }

        var url = (pStream.useSSL) ? "https://" : "http://";
        url += pStream.host;
        url += ((pStream.port !== 80) && (pStream.port !== 443)) ? (":" + pStream.port) : "";
        /*url += pStream.urlPrefixPublisher;*/
        url += imIp;
        url += "?id=" ;

        if(typeof(chls)=='string'){
            url+=chls+"/";
            if(PSMU.isEmtVal(iskipRec) || iskipRec!='true'){
                url+=getChlRecordChl(chls,pStream);
            }
        }else{
            for (var chl in chls) {
                url+=chl+"/";
                if(PSMU.isEmtVal(iskipRec) || iskipRec!='true'){
                    url+=getChlRecordChl(chl,pStream);
                }
            }
        }
        return url;

    };

    var getChlRecordChl = function(chl,pStream) {
        if(!PSMU.isEmtVal(pStream.recordChls[chl])){
            return pStream.recordChls[chl]+"/";
        }
        return "";
    };

    var getStaffIp = function(to) {
        if(!PSMU.isEmt(PSMU.peerMap[to]) && !PSMU.isEmt(PSMU.peerMap[to].imIp)){
            return PSMU.peerMap[to].imIp;
        }
        return "";
    };


    Utils.extract_xss_domain = function(domain) {
        // if domain is an ip address return it, else return ate least the last two parts of it
        if (domain.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
            return domain;
        }

        var domainParts = domain.split('.');
        // if the domain ends with 3 chars or 2 chars preceded by more than 4 chars,
        // we can keep only 2 parts, else we have to keep at least 3 (or all domain name)
        var keepNumber = Math.max(domainParts.length - 1, (domain.match(/(\w{4,}\.\w{2}|\.\w{3,})$/) ? 2 : 3));

        return domainParts.slice(-1 * keepNumber).join('.');
    };

    var linker = function(method, instance) {
        return function() {
            return method.apply(instance, arguments);
        };
    };

    var clearTimer = function(timer) {
        if (timer) {
            window.clearTimeout(timer);
        }
        return null;
    };

    /* common callbacks */
    var onmessageCallback = function(event) {
        PSMU.info("[" + this.type + "] message received", arguments);
        var message = Utils.parseMessage(event.data, this.pStream);
        if (message.tag) { this.pStream._etag = message.tag; }
        if (message.time) { this.pStream._lastModified = message.time; }
        if (message.eventid) { this.pStream._lastEventId = message.eventid; }

        PSMU.info("[onmessageCallback] tag:"+message.tag+" "+message.time+" "+message.eventid );

        this.pStream._onmessage(message.text, message.id, message.channel, message.eventid, true);
    };

    var onopenCallback = function() {
        this.pStream._onopen();
        PSMU.info("[" + this.type + "] connection opened");
    };

    var onerrorCallback = function(event) {
        PSMU.info("[" + this.type + "] error (disconnected by server):", event);
        if ((this.pStream.readyState === PStream.OPEN) &&
            (this.type === EventSourceWrapper.TYPE) &&
            (event.type === 'error') &&
            (this.connection.readyState === EventSource.CONNECTING)) {
            // EventSource already has a reconnection function using the last-event-id header
            return;
        }
        this._closeCurrentConnection();
        this.pStream._onerror({type: ((event && ((event.type === "load") || (event.type === "close"))) || (this.pStream.readyState === PStream.CONNECTING)) ? "load" : "timeout"});
    };

    /* wrappers */

    var WebSocketWrapper = function(pStream) {
        if (!PSMU.isWebSocket()) { throw "WebSocket not supported"; }
        this.type = WebSocketWrapper.TYPE;
        this.pStream = pStream;
        this.connection = null;
    };

    WebSocketWrapper.TYPE = "WebSocket";

    WebSocketWrapper.prototype = {
        connect: function() {
            this._closeCurrentConnection();
            var params = extend({}, this.pStream.extraParams(), currentTimestampParam(), getControlParams(this.pStream));
            var url = getSubscriberUrl(this.pStream, this.pStream.urlPrefixWebsocket, params, !this.pStream._useControlArguments());
            this.connection = (window.WebSocket) ? new window.WebSocket(url) : new window.MozWebSocket(url);
            this.connection.onerror   = linker(onerrorCallback, this);
            this.connection.onclose   = linker(onerrorCallback, this);
            this.connection.onopen    = linker(onopenCallback, this);
            this.connection.onmessage = linker(onmessageCallback, this);
            PSMU.debug("[WebSocket] connecting to:"+ url);
        },

        disconnect: function() {
            if (this.connection) {
                PSMU.debug("[WebSocket] closing connection to:"+ this.connection.URL);
                this.connection.onclose = null;
                this._closeCurrentConnection();
                this.pStream._onclose();
            }
        },

        _closeCurrentConnection: function() {
            if (this.connection) {
                try { this.connection.close(); } catch (e) { /* ignore error on closing */ }
                this.connection = null;
            }
        },

        sendMessage: function(message) {
            if (this.connection) { this.connection.send(message); }
        }
    };

    var EventSourceWrapper = function(pStream) {
        if (!window.EventSource) { throw "EventSource not supported"; }
        this.type = EventSourceWrapper.TYPE;
        this.pStream = pStream;
        this.connection = null;
    };

    EventSourceWrapper.TYPE = "EventSource";

    EventSourceWrapper.prototype = {
        connect: function() {
            this._closeCurrentConnection();
            var params = extend({}, this.pStream.extraParams(), currentTimestampParam(), getControlParams(this.pStream));
            var url = getSubscriberUrl(this.pStream, this.pStream.urlPrefixEventsource, params, !this.pStream._useControlArguments());
            this.connection = new window.EventSource(url);
            this.connection.onerror   = linker(onerrorCallback, this);
            this.connection.onopen    = linker(onopenCallback, this);
            this.connection.onmessage = linker(onmessageCallback, this);
            PSMU.info("[EventSource] connecting to:", url);
        },

        disconnect: function() {
            if (this.connection) {
                PSMU.debug("[EventSource] closing connection to:", this.connection.URL);
                this.connection.onclose = null;
                this._closeCurrentConnection();
                this.pStream._onclose();
            }
        },

        _closeCurrentConnection: function() {
            if (this.connection) {
                try { this.connection.close(); } catch (e) { /* ignore error on closing */ }
                this.connection = null;
            }
        }
    };

    var StreamWrapper = function(pStream) {
        this.type = StreamWrapper.TYPE;
        this.pStream = pStream;
        this.connection = null;
        this.url = null;
        this.frameloadtimer = null;
        this.pingtimer = null;
        this.iframeId = "PStreamManager_" + pStream.id;
    };

    StreamWrapper.TYPE = "Stream";

    StreamWrapper.prototype = {
        connect: function() {
            this._closeCurrentConnection();
            var domain = Utils.extract_xss_domain(this.pStream.host);
            try {
                document.domain = domain;
            } catch(e) {
                PSMU.error("[Stream] (warning) problem setting document.domain = " + domain + " (OBS: IE8 does not support set IP numbers as domain)");
            }
            var params = extend({}, this.pStream.extraParams(), currentTimestampParam(), {"streamid": this.pStream.id}, getControlParams(this.pStream));
            this.url = getSubscriberUrl(this.pStream, this.pStream.urlPrefixStream, params, !this.pStream._useControlArguments());
            PSMU.debug("[Stream] connecting to:", this.url);
            this.loadFrame(this.url);
        },

        disconnect: function() {
            if (this.connection) {
                PSMU.debug("[Stream] closing connection to:", this.url);
                this._closeCurrentConnection();
                this.pStream._onclose();
            }
        },

        _clear_iframe: function() {
            var oldIframe = document.getElementById(this.iframeId);
            if (oldIframe) {
                oldIframe.onload = null;
                oldIframe.src = "about:blank";
                if (oldIframe.parentNode) { oldIframe.parentNode.removeChild(oldIframe); }
            }
        },

        _closeCurrentConnection: function() {
            this._clear_iframe();
            if (this.connection) {
                this.pingtimer = clearTimer(this.pingtimer);
                this.frameloadtimer = clearTimer(this.frameloadtimer);
                this.connection = null;
                this.transferDoc = null;
                if (typeof window.CollectGarbage === 'function') { window.CollectGarbage(); }
            }
        },

        loadFrame: function(url) {
            this._clear_iframe();
            try {
                var transferDoc = new window.ActiveXObject("htmlfile");
                transferDoc.open();
                transferDoc.write("<html><script>document.domain=\""+(document.domain)+"\";</script></html>");
                transferDoc.parentWindow.PStream = PStream;
                transferDoc.close();
                var ifrDiv = transferDoc.createElement("div");
                transferDoc.appendChild(ifrDiv);
                ifrDiv.innerHTML = "<iframe src=\""+url+"\"></iframe>";
                this.connection = ifrDiv.getElementsByTagName("IFRAME")[0];
                this.connection.onload = linker(onerrorCallback, this);
                this.transferDoc = transferDoc;
            } catch (e) {
                var ifr = document.createElement("IFRAME");
                ifr.style.width = "1px";
                ifr.style.height = "1px";
                ifr.style.border = "none";
                ifr.style.position = "absolute";
                ifr.style.top = "-10px";
                ifr.style.marginTop = "-10px";
                ifr.style.zIndex = "-20";
                ifr.PStream = PStream;
                document.body.appendChild(ifr);
                ifr.setAttribute("src", url);
                ifr.onload = linker(onerrorCallback, this);
                this.connection = ifr;
            }
            this.connection.setAttribute("id", this.iframeId);
            this.frameloadtimer = window.setTimeout(linker(onerrorCallback, this), this.pStream.timeout);
        },

        register: function(iframeWindow) {
            this.frameloadtimer = clearTimer(this.frameloadtimer);
            iframeWindow.p = linker(this.process, this);
            this.connection.onload = linker(this._onframeloaded, this);
            this.pStream._onopen();
            this.setPingTimer();
            PSMU.info("[Stream] frame registered");
        },

        process: function(id, channel, text, eventid, time, tag) {
            this.pingtimer = clearTimer(this.pingtimer);
            PSMU.info("[Stream] message received", arguments);
            if (id !== -1) {
                if (tag) { this.pStream._etag = tag; }
                if (time) { this.pStream._lastModified = time; }
                if (eventid) { this.pStream._lastEventId = eventid; }
            }
            this.pStream._onmessage(PSMU.unescapeText(text), id, channel, eventid || "", true);
            this.setPingTimer();
        },

        _onframeloaded: function() {
            PSMU.info("[Stream] frame loaded (disconnected by server)");
            this.connection.onload = null;
            this.disconnect();
        },

        setPingTimer: function() {
            if (this.pingtimer) { clearTimer(this.pingtimer); }
            this.pingtimer = window.setTimeout(linker(onerrorCallback, this), this.pStream.pingtimeout);
        }
    };

    var LongPollingWrapper = function(pStream) {
        this.type = LongPollingWrapper.TYPE;
        this.pStream = pStream;
        this.connection = null;
        this.opentimer = null;
        this.messagesQueue = [];
        this._linkedInternalListen = linker(this._internalListen, this);
        this.xhrSettings = {
            timeout: this.pStream.timeout,
            data: {},
            url: null,
            success: linker(this.onmessage, this),
            error: linker(this.onerror, this),
            load: linker(this.onload, this),
            beforeSend: linker(this.beforeSend, this),
            afterReceive: linker(this.afterReceive, this)
        };
    };

    LongPollingWrapper.TYPE = "LongPolling";

    LongPollingWrapper.prototype = {
        connect: function() {
            this.messagesQueue = [];
            this._closeCurrentConnection();
            this.urlWithBacktrack = getSubscriberUrl(this.pStream, this.pStream.urlPrefixLongpolling, {}, true);
            this.urlWithoutBacktrack = getSubscriberUrl(this.pStream, this.pStream.urlPrefixLongpolling, {}, false);
            this.xhrSettings.url = this.urlWithBacktrack;
            var domain = Utils.extract_xss_domain(this.pStream.host);
            var currentDomain = Utils.extract_xss_domain(window.location.hostname);
            var port = this.pStream.port;
            var currentPort = window.location.port ? Number(window.location.port) : (this.pStream.useSSL ? 443 : 80);
            this.useJSONP = (domain !== currentDomain) || (port !== currentPort) || this.pStream.useJSONP;
            this.xhrSettings.scriptId = "PStreamManager_" + this.pStream.id;
            if (this.useJSONP) {
                this.pStream.messagesControlByArgument = true;
            }
            this._internalListen();
            this.opentimer = window.setTimeout(linker(onopenCallback, this), 100);
            PSMU.debug("[LongPolling] connecting to:"+this.xhrSettings.url);
        },

        _listen: function() {
            if (this._internalListenTimeout) { clearTimer(this._internalListenTimeout); }
            this._internalListenTimeout = window.setTimeout(this._linkedInternalListen, 100);
        },

        _internalListen: function() {
            if (this.pStream._keepConnected) {
                this.xhrSettings.url = this.pStream._useControlArguments() ? this.urlWithoutBacktrack : this.urlWithBacktrack;
                this.xhrSettings.data = extend({}, this.pStream.extraParams(), this.xhrSettings.data, getControlParams(this.pStream));
                if (this.useJSONP) {
                    this.connection = Ajax.jsonp(this.xhrSettings);
                } else if (!this.connection) {
                    this.connection = Ajax.load(this.xhrSettings);
                }
            }
        },

        disconnect: function() {
            if (this.connection) {
                PSMU.debug("[LongPolling] closing connection to:"+this.xhrSettings.url);
                this._closeCurrentConnection();
                this.pStream._onclose();
            }
        },

        _closeCurrentConnection: function() {
            this.opentimer = clearTimer(this.opentimer);
            if (this.connection) {
                try { this.connection.abort(); } catch (e) {
                    try { Ajax.clear(this.connection); } catch (e) { /* ignore error on closing */ }
                }
                this.connection = null;
                this.xhrSettings.url = null;
            }
        },

        beforeSend: function(xhr) {
            if (!this.pStream.messagesControlByArgument) {
                xhr.setRequestHeader("If-None-Match", this.pStream._etag);
                xhr.setRequestHeader("If-Modified-Since", this.pStream._lastModified);
            }
        },

        afterReceive: function(xhr) {
            if (!this.pStream.messagesControlByArgument) {
                this.pStream._etag = xhr.getResponseHeader('Etag');
                this.pStream._lastModified = xhr.getResponseHeader('Last-Modified');
            }
            this.connection = null;
        },

        onerror: function(status) {
            if (this.pStream._keepConnected) { /* abort(), called by disconnect(), call this callback, but should be ignored */
                if (status === 304) {
                    this._listen();
                } else {
                    PSMU.debug("[LongPolling] error (disconnected by server):"+ status);
                    this._closeCurrentConnection();
                    this.pStream._onerror({type: ((status === 403) || (this.pStream.readyState === PStream.CONNECTING)) ? "load" : "timeout"});
                }
            }
        },

        onload: function() {
            this._listen();
        },

        onmessage: function(responseText) {
            if (this._internalListenTimeout) { clearTimer(this._internalListenTimeout); }
            // PSMU.info("[LongPolling] message received", PSMU.DU(responseText));
            var lastMessage = null;
            var messages = PSMU.isArr(responseText) ? responseText : responseText.replace(/\}\{/g, "}\r\n{").split("\r\n");
            for (var i = 0; i < messages.length; i++) {
                try{
                    if (messages[i]) {
                        lastMessage = Utils.parseMessage(messages[i], this.pStream);
                        this.messagesQueue.push(lastMessage);
                        if (this.pStream.messagesControlByArgument && lastMessage.time) {
                            this.pStream._etag = lastMessage.tag;
                            this.pStream._lastModified = lastMessage.time;
                        }
                    }
                }catch (e){}
            }

            this._listen();

            while (this.messagesQueue.length > 0) {
                var message = this.messagesQueue.shift();
                this.pStream._onmessage(message.text, message.id, message.channel, message.eventid, (this.messagesQueue.length === 0));
            }
        }
    };

    /* mains */

    var PStreamManager = [];

    var PStream = function(settings) {
        settings = settings || {};

        this.id = PStreamManager.push(this) - 1;

        this.useSSL = settings.useSSL || false;
        this.host = settings.host || window.location.hostname;
        this.port = Number(settings.port || (this.useSSL ? 443 : 80));

        this.timeout = settings.timeout || 30000;
        this.pingtimeout = settings.pingtimeout || 30000;
        this.reconnectOnTimeoutInterval = settings.reconnectOnTimeoutInterval || 3000;
        this.reconnectOnChannelUnavailableInterval = settings.reconnectOnChannelUnavailableInterval || 60000;

        this.lastEventId = settings.lastEventId || null;
        this.messagesPublishedAfter = settings.messagesPublishedAfter;
        this.messagesControlByArgument = settings.messagesControlByArgument || false;
        this.tagArgument   = settings.tagArgument  || 'tag';
        this.timeArgument  = settings.timeArgument || 'time';
        this.eventIdArgument  = settings.eventIdArgument || 'eventid';
        this.useJSONP      = settings.useJSONP     || false;

        this._reconnecttimer = null;
        this._etag = 0;
        this._lastModified = null;
        this._lastEventId = null;

        this.urlPrefixPublisher   = settings.urlPrefixPublisher   || '/pub';
        this.urlPrefixStream      = settings.urlPrefixStream      || '/sub';
        this.urlPrefixEventsource = settings.urlPrefixEventsource || '/ev';
        this.urlPrefixLongpolling = settings.urlPrefixLongpolling || '/pArgs';
        this.urlPrefixWebsocket   = settings.urlPrefixWebsocket   || '/wst';

        this.jsonIdKey      = settings.jsonIdKey      || 'id';
        this.jsonChannelKey = settings.jsonChannelKey || 'channel';
        this.jsonTextKey    = settings.jsonTextKey    || 'text';
        this.jsonTagKey     = settings.jsonTagKey     || 'tag';
        this.jsonTimeKey    = settings.jsonTimeKey    || 'time';
        this.jsonEventIdKey = settings.jsonEventIdKey || 'eventid';

        this.modes = (settings.modes || 'eventsource|websocket|stream|longpolling').split('|');
        this.wrappers = [];
        this.wrapper = null;

        this.onchanneldeleted = settings.onchanneldeleted || null;
        this.onmessage = settings.onmessage || null;
        this.onerror = settings.onerror || null;
        this.onstatuschange = settings.onstatuschange || null;
        this.extraParams    = settings.extraParams    || function() { return {}; };

        this.channels = {};
        this.channelsCount = 0;
        this.channelsByArgument   = settings.channelsByArgument   || false;
        this.channelsArgument     = settings.channelsArgument     || 'channels';

        this.recordChls = {};

        for (var i = 0; i < this.modes.length; i++) {
            try {
                var wrapper = null;
                switch (this.modes[i]) {
                    case "websocket"  : wrapper = new WebSocketWrapper(this);   break;
                    case "eventsource": wrapper = new EventSourceWrapper(this); break;
                    case "longpolling": wrapper = new LongPollingWrapper(this); break;
                    case "stream"     : wrapper = new StreamWrapper(this);      break;
                }
                this.wrappers[this.wrappers.length] = wrapper;
            } catch(e) { PSMU.error(e); }
        }

        this.readyState = 0;
    };

    /* constants */
    PStream.LOG_LEVEL = PSMU.logLevelType.DEBUG; /* debug, info, error */
    PStream.LOG_OUTPUT_ELEMENT_ID = 'PSMLog';

    /* status codes */
    PStream.CLOSED        = 0;
    PStream.CONNECTING    = 1;
    PStream.OPEN          = 2;

    /* main */
    PStream.prototype = {

        addChannel: function (channel, options) {
            if (PSMU.escapeText(channel) !== channel) {
                throw "Invalid channel name! Channel has to be a set of [a-zA-Z0-9]";
            }
            PSMU.debug("entering addChannel");
            if (typeof(this.channels[channel]) !== "undefined") {
                throw "Cannot add channel " + channel + ": already subscribed";
            }
            options = options || {};
            PSMU.info("adding channel", channel, options);
            this.channels[channel] = options;
            this.channelsCount++;
            if (this.readyState !== PStream.CLOSED) {
                this.connect();
            }
            PSMU.debug("leaving addChannel");
        },

        removeChannel: function (channel) {
            if (this.channels[channel]) {
                PSMU.info("removing channel", channel);
                delete this.channels[channel];
                this.channelsCount--;
            }
        },

        removeAllChannels: function () {
            PSMU.info("removing all channels");
            this.channels = {};
            this.channelsCount = 0;
        },

        /**
         * for send msg only no sub
         */
        regRecordChl: function (chl, recChl) {
            PSMU.info("reg record chl " + chl+" recChl:"+recChl);
            this.recordChls[chl]=recChl;
        },

        _setState: function(state) {
            if (this.readyState !== state) {
                PSMU.info("status changed", state);
                this.readyState = state;
                if (this.onstatuschange) {
                    this.onstatuschange(this.readyState);
                }
            }
        },

        connect: function() {
            PSMU.debug("entering connect");
            if (!this.host)                 { throw "PStream host not specified"; }
            if (isNaN(this.port))           { throw "PStream port not specified"; }
            if (!this.channelsCount)        { throw "No channels specified"; }
            if (this.wrappers.length === 0) { throw "No available support for this browser"; }

            this._keepConnected = true;
            this._lastUsedMode = 0;
            this._connect();

            PSMU.debug("leaving connect");
        },

        disconnect: function() {
            PSMU.debug("entering disconnect");
            this._keepConnected = false;
            this._disconnect();
            this._setState(PStream.CLOSED);
            PSMU.info("disconnected");
            PSMU.debug("leaving disconnect");
        },

        _useControlArguments :function() {
            return this.messagesControlByArgument && ((this._lastModified !== null) || (this._lastEventId !== null));
        },

        _connect: function() {
            if (this._lastEventId === null) {
                this._lastEventId = this.lastEventId;
            }
            if (this._lastModified === null) {
                var date = this.messagesPublishedAfter;
                if (!PSMU.isDate(date)) {
                    var messagesPublishedAfter = Number(this.messagesPublishedAfter);
                    if (messagesPublishedAfter > 0) {
                        date = new Date();
                        date.setTime(date.getTime() - (messagesPublishedAfter * 1000));
                    } else if (messagesPublishedAfter < 0) {
                        date = new Date(0);
                    }
                }

                if (PSMU.isDate(date)) {
                    this._lastModified = Utils.dateToUTCString(date);
                }
            }

            this._disconnect();
            this._setState(PStream.CONNECTING);
            this.wrapper = this.wrappers[this._lastUsedMode++ % this.wrappers.length];

            try {
                this.wrapper.connect();
            } catch (e) {
                //each wrapper has a cleanup routine at disconnect method
                if (this.wrapper) {
                    this.wrapper.disconnect();
                }
            }
        },

        _disconnect: function() {
            this._reconnecttimer = clearTimer(this._reconnecttimer);
            if (this.wrapper) {
                this.wrapper.disconnect();
            }
        },

        _onopen: function() {
            this._reconnecttimer = clearTimer(this._reconnecttimer);
            this._setState(PStream.OPEN);
            if (this._lastUsedMode > 0) {
                this._lastUsedMode--; //use same mode on next connection
            }
        },

        _onclose: function() {
            this._reconnecttimer = clearTimer(this._reconnecttimer);
            this._setState(PStream.CLOSED);
            this._reconnect(this.reconnectOnTimeoutInterval);
        },

        _onmessage: function(text, id, channel, eventid, isLastMessageFromBatch) {
            /*PSMU.debug("message id "+id+" "+channel+" "+eventid+" "+isLastMessageFromBatch);*/
            if (id === -2) {
                if (this.onchanneldeleted) { this.onchanneldeleted(channel); }
            } else if (id > 0) {
                if (this.onmessage) { this.onmessage(text, id, channel, eventid, isLastMessageFromBatch); }
            }
        },

        _onerror: function(error) {
            this._setState(PStream.CLOSED);
            this._reconnect((error.type === "timeout") ? this.reconnectOnTimeoutInterval : this.reconnectOnChannelUnavailableInterval);
            if (this.onerror) { this.onerror(error); }
        },

        _reconnect: function(timeout) {
            if (this._keepConnected && !this._reconnecttimer && (this.readyState !== PStream.CONNECTING)) {
                PSMU.info("trying to reconnect in", timeout);
                this._reconnecttimer = window.setTimeout(linker(this._connect, this), timeout);
            }
        },

        sendMessage: function(message, successCallback, errorCallback) {
            message = PSMU.escapeText(message);
            if (this.wrapper.type === WebSocketWrapper.TYPE) {
                this.wrapper.sendMessage(message);
                if (successCallback) { successCallback(); }
            } else {
                Ajax.post({url: getPublisherUrl(this), data: message, success: successCallback, error: errorCallback});
            }
        },

        sendMessages: function(message,chls, successCallback, errorCallback) {
            message=escape(message);
            Ajax.post({url: getPublisherUrls(this,chls), data: message, success: successCallback, error: errorCallback});
        },
        sendMessagesTest: function(message,chls, successCallback, errorCallback) {
            message=escape(message);
            Ajax.post({url: getPublisherUrlsTest(this,chls), data: message, success: successCallback, error: errorCallback});
        },
        send: function(sendMsg,iskipRec,successCallback, errorCallback) {

            if(!PSMU.isEmtVal(sendMsg) && !PSMU.isEmtVal(sendMsg.nt) && !PSMU.isEmtVal(sendMsg.msg)){

                PSMU.debug("send document ",$(document));
                var mid=PSMU.getTuid(false);
                if(mid=='tuidErr'){
                    PSMU.error("Exception getTuid ",PSMU.chatInfo);
                    PSMU.addServLog(" tuidErr "+PSMU.stringify(PSMU.chatInfo));
                    $(document).triggerHandler(PSMU.CHAT_NET_ERR_MSG, sendMsg);
                    return;
                }

                sendMsg.mid=mid;

                var msgEncode=null;
                if(PSMU.codeType===PSMU.CODE_ZU){
                    msgEncode=PSMU.EU(PSMU.stringify(sendMsg));
                }else if(PSMU.codeType===PSMU.CODE_ZP){
                    msgEncode=PSMU.EP(sendMsg);
                }

                if(this.wrapper.type !==EventSourceWrapper.TYPE || !PSMU.isEmt(sendMsg.nt)){
                    var url=getPublisherUrlsJsJac(this,sendMsg.nt,iskipRec);
                    if(!PSMU.isEmtVal(url) && !PSMU.isEmtVal(sendMsg.nt)){
                        Ajax.post({url: url, data: msgEncode, success: successCallback, error: errorCallback});
                    }
                }else if(this.wrapper.type === WebSocketWrapper.TYPE){
                    this.wrapper.sendMessage(msgEncode);
                    if (successCallback) { successCallback(sendMsg); }
                }
            }
        } ,
        _process:  function(message,successCallback, errorCallback) {},
        connected: function() {
            return this.readyState==PStream.OPEN;
        },
        /**
         *
         * 需要获取发送的消息原文
         */
        atSucessCallback: function(retMsg) {
            PSMU.debug("atSucessCallback "+ retMsg);
            if(!PSMU.isEmtVal(retMsg) && retMsg.indexOf("rev ok")!=-1){

            }
        },

        atErrorCallback: function(retStatus) {
            PSMU.debug("atErrorCallback "+ retStatus);
        }
    };

    PStream.sendMessage = function(url, message, successCallback, errorCallback) {
        Ajax.post({url: url, data: PSMU.escapeText(message), success: successCallback, error: errorCallback});
    };

    // to make server header template more clear, it calls register and
    // by a url parameter we find the stream wrapper instance
    PStream.register = function(iframe) {
        var matcher = iframe.window.location.href.match(/streamid=([0-9]*)&?/);
        if (matcher[1] && PStreamManager[matcher[1]]) {
            PStreamManager[matcher[1]].wrapper.register(iframe);
        }
    };

    PStream.unload = function() {
        for (var i = 0; i < PStreamManager.length; i++) {
            try { PStreamManager[i].disconnect(); } catch(e){}
        }
    };

    /* make class public */
    window.PStream = PStream;
    window.PStreamManager = PStreamManager;

    if (window.attachEvent) { window.attachEvent("onunload", PStream.unload); }
    if (window.addEventListener) { window.addEventListener.call(window, "unload", PStream.unload, false); }

})(window, document);


function _procMsg(msgStr,id) {

    if (!PSMU.isEmtVal(msgStr)) {
        try {

        } catch(e) {
            // PSMU.serverLog('error', "_manageEvent:" + e.name + ": " + e.message);
            PSMU.error("_manageEvent:" + e.name + ": " + e.message);
        }
    }
};


var reconnectTimes=0;
function _statuschanged(state) {
    PSMU.debug(PSMU.isWebSocket()+" "+/*conType+*/" _statuschanged "+state+" "+reconnectTimes);
    if (state == PStream.OPEN) {
        if(typeof(pageSendMsg)!='undefined'){
            pageSendMsg(KL_MSG);
        }
        if(typeof(initPresend)!='undefined'){
            /*TODO 再测试一下直接在邀请删除页面发消息，不通过sessionStorage，sessionStorage不是好方式*/
            window.setTimeout("initPresend()", 500);
        }
    } else if(state == PStream.CONNECTING){

    } else {

    }
};

