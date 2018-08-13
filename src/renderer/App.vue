<template>
    <div id="pc" v-if="isPc">
        <pc-menu :pathData="pathData"></pc-menu>
    </div>
    <div id="app" v-else>
        <div class="app-router-wrapper">
            <router-view/>
        </div>
        <tabbar class="app-bottom-menu" v-if="isMode" ref="tabbar">
            <tabbar-item :selected="selected1" :show-dot="isAlertMenu1" link="/messagelist">
                <i slot="icon" class="iconfont icon-icon--"></i>
                <span slot="label">消息</span>
            </tabbar-item>
            <tabbar-item :selected="selected2" :show-dot="isAlertMenu2" @click.native="goFind">
                <i slot="icon" class="iconfont icon-shoucangbiaoji"></i>
                <span slot="label">发现</span>
            </tabbar-item>
            <tabbar-item :selected="selected3" :show-dot="isAlertMenu3" :icon-class="{color:'#FF8000'}" link="/workbench">
                <i slot="icon" class="iconfont icon-gongzuotai"></i>
                <span slot="label">工作台</span>
            </tabbar-item>
            <tabbar-item :selected="selected4" :show-dot="isAlertMenu4" link="/contact">
                <i slot="icon" class="iconfont icon-tongxunlu"></i>
                <span slot="label">通讯录</span>
            </tabbar-item>
            <tabbar-item :selected="selected5" v-if="activeName === 'me'" :show-dot="isAlertMenu5" link="/me">
                <i slot="icon" class="iconfont icon-wode"></i>
                <span slot="label">我</span>
            </tabbar-item>
            <tabbar-item v-if="activeName === 'back'" @click.native.prevent="goBack">
                <i slot="icon" class="iconfont icon-fanhui"></i>
                <span slot="label">返回</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from "vuex";
    import { XHeader, Tabbar, TabbarItem } from "vux";
    import { generateColors } from "./utils/color";
    import {
        Z_IsEmpty20,
        isMhApp,
        isWeiXin,
        isIos,
        isPc,
        Z_EU,
        isIPhoneX
    } from "./utils/fn";
    import enquire from "enquire.js";
    import "assets/emoji-sprite.css";
    import pcMenu from "components/pcMenu/pcMenu.vue";
    import wx from "./utils/wx";
    import Qs from "qs";

    //    console.log(wx)
    const tabbarWhiteList = ['/messagelist', '/find', '/workbench', '/contact', '/me']
    // 不显示返回按钮的路径, ** 全部小写 **
    const homePathArr = [
        "/demo/testpages",
        "/zingmainPage",
        "/messagelist",
        "/find",
        "/workbench",
        "/contact",
        "/me"
    ];

    // wxapi
    const wxApiList = [
        "checkJsApi",
        "onMenuShareAppMessage",
        "onMenuShareTimeline",
        "startRecord",
        "stopRecord",
        "onVoiceRecordEnd",
        "playVoice",
        "pauseVoice",
        "stopVoice",
        "onVoicePlayEnd",
        "uploadVoice",
        "openLocation",
        "getLocation",
        "chooseImage",
        "uploadImage",
        "previewImage"
    ];

    export default {
        name: "App",
        components: {XHeader, Tabbar, TabbarItem, pcMenu},
        data() {
            return {
                isWeiXin: isWeiXin(),
                isMhApp: isMhApp(),
                isIos: isIos(),
                isPc: isPc(),
                pathData: "",
                activeName: "me",
                colors: {
                    primary: "#fca56a"
                },
                originalStyle: "",
                primaryColor: "#409eff",
                // 底部菜单红点
                isAlertMenu1: false,
                isAlertMenu2: false,
                isAlertMenu3: false,
                isAlertMenu4: false,
                isAlertMenu5: false,
                selected1:false,
                selected2:false,
                selected3:false,
                selected4:false,
                selected5:false,
                userData:{}
            };
        },
        computed: {
            ...mapState({
                isMode: state => state.ui.isMode,
                redPoint: state => state.ui.redPoint,
                bottomToast: state => state.ui.bottomToast
            })
        },
        watch: {
            $route(to, from) {
                // iPhoneX适配
                this.$nextTick(() => {
                    if (to && to.path) {
                        // 确保请求是有token的，否则会影响酒店登录
                        if (to.path.toLowerCase() !== 'login' &&
                            to.path.toLowerCase() !== "/hotellogin" &&
                            to.path.toLowerCase() !== "/dinnerlogin" &&
                            to.path.toLowerCase() !== "/nativelogin") {
                            this.loadUserMsg()
                        }
                    }
                    console.log("========title $route========",document.title)
                    if (isIPhoneX()) {
                        let lift = true

                        console.log('his len', window.history.length)
                        if (isWeiXin() && window.history.length > 1) {
                            lift = false
                        }

                        if (lift && !document.getElementById("app").classList.contains('ipx')) {
                            document.getElementById("app").classList.add("ipx");
                        }
                        else if (!lift && document.getElementById("app").classList.contains('ipx')) {
                            document.getElementById("app").classList.remove("ipx");
                        }
                    }
                });

                if (from !== null && from !== "") {
                    console.log('watch $route', from, to)
                    // 确保请求是有token的，否则会影响酒店登录
                    if (from.path.toLowerCase() === "/login" &&
                        to.path.toLowerCase() !== "/hotellogin" &&
                        to.path.toLowerCase() !== "/dinnerlogin" &&
                        to.path.toLowerCase() !== "/nativelogin") {
                        this.loadPowerList();
                    }
                }

                if (to && to.path) {
                    // 确保请求是有token的，否则会影响酒店登录
                    // 除了登录，其他路由加载红点数据
                    if (to.path.toLowerCase() !== 'login' &&
                        to.path.toLowerCase() !== "/hotellogin" &&
                        to.path.toLowerCase() !== "/dinnerlogin" &&
                        to.path.toLowerCase() !== "/nativelogin") {
                        this.loadRedPoint();
                    }
                }

                if(tabbarWhiteList.indexOf(to.path.toLowerCase()) !== -1) {
                    this.setMode(true)
                }else{
                    this.setMode(false)
                }
                this.pathData = to.path;
                if (homePathArr.indexOf(to.path.toLowerCase()) !== -1) {
                    this.activeName = "me";
                } else {
                    this.activeName = "back";
                }
                switch (to.path.toLowerCase()) {
                    case "/messagelist":
                        this.selected1 = true
                        this.selected2 = this.selected3 =this.selected4 = this.selected5 = false
                        if (this.$refs.tabbar) this.$refs.tabbar.currentIndex = 0;
                        break;
                    case "/find":
                        this.selected2 = true
                        this.selected1 = this.selected3 =this.selected4 = this.selected5 = false
                        if (this.$refs.tabbar) this.$refs.tabbar.currentIndex = 1;
                        break;
                    case "/workbench":
                        this.selected3 = true
                        this.selected2 = this.selected1 =this.selected4 = this.selected5 = false
                        if (this.$refs.tabbar) this.$refs.tabbar.currentIndex = 2;
                        break;
                    case "/contact":
                        this.selected4 = true
                        this.selected2 = this.selected3 =this.selected1 = this.selected5 = false
                        if (this.$refs.tabbar) this.$refs.tabbar.currentIndex = 3;
                        break;
                    case "/me":
                        this.selected5 = true
                        this.selected2 = this.selected3 =this.selected4 = this.selected5 = false
                        if (this.$refs.tabbar) this.$refs.tabbar.currentIndex = 4;
                        break;
                }
            },
            // 底部工具栏红点处理
            redPoint(rpData) {
//               console.log('watch redPoint', rpData)
                if (!rpData) {
                    console.warn("error redPoint data", rpData);
                    return;
                }
                /*
                * 初始化红点 每次初始化红点
                *
                * */
              this.isAlertMenu1 = false;
                let sArr = rpData.split("_ZSP_");
//                console.log(sArr, '====');
                let isMyAlert = false;
              for (let i = 0; i < sArr.length; i++) {
                    if (!Z_IsEmpty20(sArr[i])) {
                        if (
                            sArr[i] === "g" ||
                            sArr[i] === "m" ||
                            sArr[i] === "h" ||
                            sArr[i] === "org"
                        ) {
                            this.isAlertMenu3 = true;
                        } else if (sArr[i].indexOf("f_") !== -1) {
                            let favCount = sArr[i].substring(sArr[i].indexOf("f_") + 2);
                            if (!Z_IsEmpty20(favCount) && favCount !== "0") {
                                this.isAlertMenu4 = true;
                            }
                        } else if (sArr[i].indexOf("fFriend_") !== -1) {
                            let friendList = sArr[i].substring(sArr[i].indexOf("fFriend_") + 8);
                            if (!Z_IsEmpty20(friendList) && friendList !== "0") {
                                this.isAlertMenu4 = true;
                            }
                        } else if (sArr[i] === "c") {
                            if (!isMyAlert) {
                                this.isAlertMenu3 = true;
                            }
                        } else if (sArr[i].indexOf("tw:company") !== -1) {
                            let strArrTmp = sArr[i].split("tw:company");
                            if (!Z_IsEmpty20(strArrTmp[1])) {
                                this.isAlertMenu5 = true;
                            }
                        } else if (sArr[i].indexOf("notice:") !== -1) {
                            // "notice:{"total":0,"NOTICE":[]}"
                            let str = sArr[i].substring(7, sArr[i].length);
                            let notice_json = JSON.parse(str);
                            if (parseInt(notice_json.total) > 0) {
                                this.isAlertMenu1 = true;
                                isMyAlert = true;
                            }
                        } else if (sArr[i].indexOf("discovery") !== -1) {
                            let find_str = sArr[i].substring(10, sArr[i].length);
                            let find_notice_json = JSON.parse(find_str);
                            console.log(find_notice_json);
                            if (parseInt(find_notice_json.total) > 0) {
                                this.isAlertMenu2 = true;
                            }

                        } else if (sArr[i].indexOf("welcomeNotice:") !== -1) {
                            // "notice:{"total":0,"NOTICE":[]}"
                            let w_str = sArr[i].substring(14, sArr[i].length);
                            let w_notice_json = JSON.parse(w_str);
                            if (parseInt(w_notice_json.total) > 0) {
                                isMyAlert = true;
                            }
                        } else if (sArr[i].indexOf("bindFailed:") !== -1) {
                            let bind_failed = sArr[i].substring(11, sArr[i].length);
                            let bindfailed_json = JSON.parse(bind_failed);
                            if (parseInt(bindfailed_json.total) > 0) {
                                this.isAlertMenu5 = true;
                            }
                        } else if (
                            sArr[i] === "qkf" ||
                            sArr[i].indexOf("qkf:company") !== -1
                        ) {
                            this.isAlertMenu5 = true;
                        } else if (sArr[i] === "ca") {
                            this.isAlertMenu5 = true;
                        } else if (sArr[i].indexOf("myMsg") !== -1) {
                            this.isAlertMenu1 = true;
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "bindRequest"
                        ) {
                            let bindRequestStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            let bindRequest = JSON.parse(bindRequestStr);
                            if (bindRequest.total > 0 && !isMyAlert) {
                                this.isAlertMenu3 = true;
                                isMyAlert = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "workFlow"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            let jsonWF = JSON.parse(jsonStr);
                            /*if(jsonWF.total > 0 || jsonWF.myWorkflowTotalForZyk>0){
                             if(!isshenpi) isshenpi = true;
                             }*/
                            if (
                                !isMyAlert &&
                                (jsonWF.total > 0 ||
                                jsonWF.myWorkflowTotalForZyk > 0 ||
                                jsonWF.WF_HAVEDB > 0)
                            ) {
                                isMyAlert = true;
                            }
                        } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "hr") {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                isMyAlert = true;
                            }
                        } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "zingjob") {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (JSON.parse(jsonStr).total > 0) {
                                this.isAlertMenu1 = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "projectJob"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (JSON.parse(jsonStr).total > 0) {
                                this.isAlertMenu1 = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "zingjob4kefu"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (JSON.parse(jsonStr).total > 0) {
                                this.isAlertMenu1 = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "ygshezhi"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                isMyAlert = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "globalWorkFlow"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            /*if(JSON.parse(jsonStr).total > 0){if(!isshenpi) isshenpi = true;}*/
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                isMyAlert = true;
                            }
                        } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "message") {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                isMyAlert = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "jinxiaocunAlert"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                isMyAlert = true;
                                this.isAlertMenu1 = true;
                            }
                        } else if (
                            sArr[i].substring(0, sArr[i].indexOf(":")) === "ziyuankuAlert"
                        ) {
                            let jsonStr = sArr[i].substring(
                                sArr[i].indexOf(":") + 1,
                                sArr[i].length
                            );
                            if (!isMyAlert && JSON.parse(jsonStr).total > 0) {
                                this.isAlertMenu1 = true;
                            }
                        } else if (sArr[i] === "visitor") {
                            //是访客，去掉工作台红点
                            isMyAlert = false;
                        }
                    }
                }

                if (isMyAlert) {
                    this.isAlertMenu3 = true;
                }
            },
            // 显示全局的底部提示，如wx.js中的提示
            bottomToast(msg) {
                let _this = this;
                if (!msg) return;
                this.$vux.toast.show({
                    text: msg,
                    type: "text",
                    position: "bottom",
                    onHide() {
                        _this.setBottomToast("");
                    }
                });
            }
        },
        mounted() {
            if (isMhApp()) {
                this.setMode(false);
            } else {
                this.setMode(true);
            }
            /*enquire.register('only screen and (min-width: 320px) and (max-width: 767px)', {
             match: () => {
             this.setMode(true)
             },
             unmatch: () => {
             this.setMode(false)
             },
             });*/
            this.$http.get("./static/customTheme.css").then(res => {
                this.originalStyle = this.getStyleTemplate(res.data);
                this.colors = Object.assign(
                    {},
                    this.colors,
                    generateColors(this.colors.primary)
                );
                this.writeNewStyle();
            });
            this.loadRedPoint();
            this.loadPowerList();
            //this.loadUserMsg()
            // wx config
            window.addEventListener("load", evt => {
                this.loadUserMsg()
                console.log("========title load========",document.title)
                let count = 0;
                let wxConfig = () => {
                    console.log("check window.Config", window, window.Config);

                    if (window.Config) {
                        if (isWeiXin()) this.wxConfig();
                    } else {
                        if (++count > 10) {
                            console.error("get window.Config failed");
                            return;
                        }
                        window.setTimeout(wxConfig, 200);
                    }
                };

                wxConfig();
            });
        },
        methods: {
            ...mapActions(["loadRedPoint","loadPowerList"]),
            ...mapMutations({
                setMode: "SET_MODE",
                setBottomToast: "SET_BOTTOM_TOAST"
            }),
            loadUserMsg() {
                let url = "/zingbiz/auth/user/getThisUserInfo";
                let that = this;
                this.$http
                    .post(url, {}, { silent: true })
                    .then(res => {
                        that.userData = res.data.data;
                        this.loadServerNumber()
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            loadServerNumber() {
                let url = "/zingbiz/auth/org/loadServerNumber";
                let that=this
                this.$http
                    .get(url, { silent: true })
                    .then(res => {
                        res.data.data.forEach(item => {
                            if (item.id && item.id === that.userData.companyId) {
                                document.title = item.companyName
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            goFind () {
                this.$router.push("/find");
                this.isAlertMenu2 = false
            },
            handleworkbench() {
                console.log(this.$router);
                this.$router.push("/workbench");
            },
            goBack() {
                this.$router.back();
            },
            //            clickMore() {},
            writeNewStyle() {
                let cssText = this.originalStyle;
                Object.keys(this.colors).forEach(key => {
                    cssText = cssText.replace(
                        new RegExp("(:|\\s+)" + key, "g"),
                        "$1" + this.colors[key]
                    );
                });
                const style = document.createElement("style");
                style.innerText = cssText;
                document.head.appendChild(style);
            },
            getStyleTemplate(data) {
                let retData = data;
                const colorMap = {
                    "#3a8ee6": "shade-1",
                    "#409eff": "primary",
                    "#53a8ff": "light-1",
                    "#66b1ff": "light-2",
                    "#79bbff": "light-3",
                    "#8cc5ff": "light-4",
                    "#a0cfff": "light-5",
                    "#b3d8ff": "light-6",
                    "#c6e2ff": "light-7",
                    "#d9ecff": "light-8",
                    "#ecf5ff": "light-9",
                    "#0190fe": "secondary",
                    "#fbfdff": "darkWhite",
                    "#1f2d3d": "baseBlack",
                    "#324157": "lightBlack",
                    "#48576a": "extraLightBlack",
                    "#8391a5": "baseSilver",
                    "#97a8be": "lightSilver",
                    "#bfcbd9": "extraLightSilver",
                    "#d1dbe5": "baseGray",
                    "#e4e8f1": "lightGray",
                    "#eef1f6": "extraLightGray",
                    "#1d90e6": "buttonActive",
                    "#4db3ff": "buttonHover",
                    "#ebeef5": "tableBorder",
                    "#d2ecff": "datepickerInRange",
                    "#afddff": "datepickerInRangeHover",
                    "#1c8de0": "selectOptionSelected",
                    "#edf7ff": "lightBackground",
                    "#09bb07": "vux",
                    "#1AAD19": "weuiPrimay",
                    "#179b16": "weuiButtonActive",
                    "#04BE02": "weuiTabActive"
                };
                Object.keys(colorMap).forEach(key => {
                    const value = colorMap[key];
                    retData = data.replace(new RegExp(key, "ig"), value);
                });
                return retData;
            },
            wxConfig() {
                console.log("wx config");

                let url = "/WXINFO/WXSDK/weixin?ajaxAction=WX_AJAX_JSAPI_SIGN";
                let params = {
                    wid: window.Config.wid,
                    url: Z_EU(location.href.split("#")[0])
                };

                this.$http.post(url, Qs.stringify(params)).then(data => {
                    try {
                        console.log("initJSSDK 0 ", data.data);
                        //                        console.log("initJSSDK 0 " + data.data.nonceStr)

                        if (!Z_IsEmpty20(data.data.nonceStr)) {
                            wx.config({
                                debug: false,
                                appId: window.Config.wxAppId,
                                timestamp: data.data.timestamp,
                                nonceStr: String(data.data.nonceStr),
                                signature: String(data.data.signature),
                                jsApiList: wxApiList
                            });

                            wx.ready(function () {
                                //                                wxServerLog("confJSSDK wx ready "+(typeof(wx))+" "+(typeof(wx.checkJsApi)));
                                //alert("wx.ready ");
                                wx.checkJsApi({
                                    jsApiList: wxApiList,
                                    success: function (res) {
                                        //                                        isJsApiOk = "true";
                                        console.log("js Api OK!");
                                    },
                                    fail: function (res) {
                                        console.error("checkJsApi fail  " + res.errMsg);
                                    }
                                });
                            });

                            /*wx.error(function (res) {
                             console.log("wx.error: " + JSON.stringify(res));
                             wxServerLog("wx.error " + res.errMsg);

                             if (typeof callback != "undefined") {
                             callback();
                             }
                             });*/
                        }
                    } catch (e) {
                        console.error("Exception initJSSDK " + e.message);
                    }
                });
            }
        }
    };
</script>

<style lang="stylus">
    @import './assets/stylus/variable.styl';
    @import './assets/stylus/mixin.styl';
    @import './assets/stylus/unify.styl';

    #app {
        height: 100%;
        flex-center(column, start, start);

        .app-router-wrapper {
            flex: 1;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }

        .app-bottom-menu {
            position: relative;
        }

        .vux-header {
            width: 100%;
        }

        .header-right-slot {
            &-left {
                margin-right: 20px;
            }
        }

        .app-bottom-menu .icon-icon-- {
            font-size: 30px !important;
        }

        .vux-reddot:after, .vux-reddot-border:after, .vux-reddot-s:after {
            right: -10px !important;
            top: 3px !important;
        }

        /* .ziyuanku {
            height  100%
        } */
        .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
            color: #FF8000 !important;
        }
    }

    #app.ipx {
        height: calc(100% - 20px);
    }

    #pc {
        .el-menu {
            .iconfont {
                font-size: 18px !important;
            }
        }

        .el-table__body .el-button {
            border: none !important;
        }

        .el-main {
            padding: 14px;
        }

        .el-row {
            margin-bottom: 14px;
        }

        .el-table td, .el-table th {
            padding: 0 !important;
        }
    }
</style>
