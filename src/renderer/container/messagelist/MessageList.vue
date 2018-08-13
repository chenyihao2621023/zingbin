<template>
    <!-- 消息页面 -->
    <div class="message-list">
        <img v-show="isShowTop"
             style="width: 50px;vertical-align: baseline;position: fixed;bottom: 90px;right: 10px;z-index: 10;"
             @click="gotoTop" src="~assets/img/ReturnTop.png"/>
        <zing-head :isComeBack="false">
            <div slot="header-left">
                <div style="height: 50px;width: 50px;float: left;padding-left: 13px;padding-top: 3px;" @click="redOrder">
                    <img v-show="!isOrder && redDot[type]"
                         style="width: 11px;vertical-align: baseline;margin-top: 10px;"
                         src="~assets/img/haveRedDot.png"/>
                    <img v-show="!isOrder && !redDot[type]"
                         style="width: 11px;vertical-align: baseline;margin-top: 10px;" src="~assets/img/noRedDot.png"/>
                    <img v-show="isOrder" style="width: 11px;vertical-align: baseline;margin-top: 10px;"
                         src="~assets/img/searchRedDot.png"/>
                </div>
                <dropdown :data="datas" :placementXAbs="-22" trigger="click" placement="bottomLeft" @item-click="handleMenuType">
                    <div>
                        <span>{{searchParam}}</span>
                        <i class="triangle-down"></i>
                    </div>
                </dropdown>
            </div>
            <div slot="header-right">
        <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span>
                <dropdown :data="dropDownMenu" :placementXAbs="-33" trigger="click" placement="bottomRight"
                          @item-click="handleMenu">
                    <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                        <span class="header-jiahao">
                            <i class="iconfont icon-gengduo"></i>
                        </span>
                    </a>
                </dropdown>
            </div>
        </zing-head>
        <!--<div v-show="showSearch">
            <search style="position:static;top:46px;" auto-scroll-to-top></search>
        </div>-->
        <search-comp :searchFlag="showSearch" @cancelInput="cancelInput" @confirmInput="confirmInput"></search-comp>
        <div class="message-list-content">
            <scroll :observeDOM="true" ref="scroll" :data="[]" :scrollbar="true"
                    :pullUpLoad="{threshold: 0 }"
                    :startY="startY" @pullingUp="onPullingUp" :listenScroll="true" @scroll="scroll"
                    @scrollTo="scrollToTop">
                <div v-for="(linkman,index) in listData.data" :key="index" class="linkman-wrapper">
                    <GridCard>
                        <div slot="cardLeft" class="left">
                            <!--如果是私聊，只显示一个头像； 如果是群聊，则显示多个头像，flex 控制样式-->
                            <!--<div class="group-grid" :class="calcCols(linkman)">
                              <div class="group-grid-item" :class="calcCols(linkman)" v-for="user in linkman.user" :key="user.uid">
                                <avatar :size="'normal'" shape="square" :src="user.avatar"></avatar>
                              </div>
                            </div>-->
                            <!--:size="'normal'" -->
                            <avatar v-if="linkman.dispImg.indexOf('.')>=0&&linkman.dispImg.indexOf('/')>=0"
                                    shape="square" :src="linkman.dispImg"></avatar>
                            <avatar v-else-if="linkman.dispImg.indexOf('.')<0&&linkman.dispImg.indexOf('/')>=0"
                                    shape="square" :src="linkman.dispImg+'.jpg'"></avatar>
                            <avatar v-else-if="linkman.dispImg.indexOf('zingIcon-wf')>=0"
                                    shape="square" icon="daishenhe" :style="{background: '#F59324'}"></avatar>
                            <avatar v-else-if="linkman.dispImg.indexOf('zingIcon-zingJob')>=0"
                                    shape="square" :icon="linkman.dispImg?linkman.dispImg:'pandian'" :style="{background: '#40AFFC'}"></avatar>
                            <avatar v-else-if="linkman.dispImg.indexOf('zingIcon-zingProjectManage')>=0"
                                    shape="square" icon="setting" :style="{background: '#0FBE1C'}"></avatar>
                            <avatar v-else-if="linkman.bType&&linkman.bType==='exContact'"
                                    shape="square" icon="xiewrite18" :style="{background: '#5aa2ef'}"></avatar>
                            <avatar v-else-if="linkman.bType && linkman.bType==='HR_WQSH_MSG'"
                                    shape="square" icon="iconfont icon-shenheguanli" :style="{background: '#985DAE'}"></avatar>
                            <avatar v-else-if="linkman.bType && linkman.bType==='HR_BK_WTG'"
                                    shape="square" icon="iconfont icon-shenheguanli" :style="{background: '#985DAE'}"></avatar>
                            <avatar v-else-if="linkman.bType && linkman.bType==='HR_BK_YTG'"
                                    shape="square" icon="iconfont icon-shenheguanli" :style="{background: '#985DAE'}"></avatar>
                            <avatar v-else-if="linkman.bType && linkman.bType==='HR_BK_SH'"
                                    shape="square" icon="iconfont icon-shenheguanli" :style="{background: '#985DAE'}"></avatar>
                          <avatar v-else-if="linkman.bType && linkman.bType==='ZINGJOB'"
                                  shape="square" :icon="linkman.dispImg" :style="{background: '#40AFFC'}"></avatar>

                          <avatar v-else shape="square" :icon="linkman.dispImg" :style="{background: '#F59324'}"></avatar>
                            <!--未读并且未屏蔽 才显示新信息数量-->
                            <!--<i class="new-msg-count" v-show="!linkman.read&&!linkman.quiet">{{linkman.msg.length}}</i>-->
                            <!--未读并且屏蔽 只显示小红点-->
                            <i class="new-msg-dot" v-show="linkman.alertState === '1isAlert'"></i>
                        </div>
                        <div slot="cardRight" class="right">
                            <div class="right-content">
                                <div class="right-content-title overflowHid">{{linkman.peerRealName}}</div>
                                <div class="right-content-lastword" style="height: 18px;padding-top:2px;">{{linkman.dispMsgNew}}</div>
                            </div>
                            <div class="right-info">
                                <div class="right-info-date">{{linkman.timeMsg}}</div>
                                <div v-show="linkman.isDisturb !== '0'" class="right-info-mute">
                                    <i class="iconfont icon-iconfontbell1" style="font-size: 16px !important;"></i>
                                </div>
                            </div>
                        </div>
                    </GridCard>
                    <div @click="itemClickFun($event,linkman)"
                         @longpress="itemLongPress($event,linkman)"
                         v-long-press
                         style="position: absolute;top: 0;right: 0; bottom: 0;left: 0;z-index: 3;"
                    />
                </div>
            </scroll>
            <x-dialog v-model="menuDialog" hide-on-blur>
                <div v-if="itemData.alertState === '1isAlert'" class="menu" @click="toggleMsgRead('noAlert')">标为已读</div>
                <div v-else class="menu" @click="toggleMsgRead('isAlert')">标为未读</div>
                <div class="menu" @click="delToggleMsg">删除此消息</div>
                <div class="menu" v-if="!itemData.isTop || itemData.isTop === '0'" @click="topToggleMsg('1')">置顶</div>
                <div v-else class="menu" @click="topToggleMsg('0')">取消置顶</div>
            </x-dialog>
        </div>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import SearchComp from "components/search/search.vue";
    import Scroll from "components/scroll/Scroll";
    import Dropdown from "components/dropdown/Dropdown";
    import Avatar from "components/avatar/Avatar";
    import GridCard from "components/gridcard/GridCard"
    import LongPress from '../../directives/longpress/long-press'
    import Qs from "qs"
    import { mapActions } from "vuex";
    import { goChat, Z_IsEmpty20, createChat, MH_changeUserCompany,getThumbUrl } from "@/utils/fn";
    import { Search, XDialog } from 'vux'

    export default {
        name: "MessageList",
        components: {
            ZingHead, Scroll, Dropdown, Avatar, GridCard, Search, XDialog, LongPress, SearchComp, Qs,
        },
        directives: {
            LongPress
        },
        data() {
            return {
                searchParam: "全部消息",
                menuDialog: false,
                startData: 0,
                datas: [
                    {content: "全部消息", type: "all", isRed: false},
                    {content: "聊天", type: "liaotian", isRed: false},
                    {content: "公告", type: "gonggao", isRed: false},
                    {content: "审批", type: "shenpi", isRed: false},
                    {content: "任务", type: "renwu", isRed: false},
                    {content: "资源库", type: "ziyuanku", isRed: false},
                    {content: "客户", type: "wailianren", isRed: false},
                    {content: "项目", type: "xiangmu", isRed: false}
                ],
                redDot: {
                    all: false,
                    liaotian: false,
                    gonggao: false,
                    shenpi: false,
                    renwu: false,
                    ziyuanku: false,
                    wailianren: false,
                    xiangmu: false,
                },
                dropDownMenu: [
                    {content: "发起群聊"},
                    {content: "添加好友"},
                ],
                showSearch: false,
                listData: {},
                itemData: {},
                pageNumber: 1,
                type: "all",
                isOrder: false,
                isShowTop: false,
                allCompanyArr:[],
            };
        },
        created() {
            this.pageNumber = 1
            this.isOrder = false
            this.loadServerNumber();
        },
        methods: {
            ...mapActions(["loadRedPoint","loadPowerList"]),
            loadServerNumber() {
                let url = "/zingbiz/auth/org/loadServerNumber";
                let that=this
                this.$http
                    .get(url)
                    .then(res => {
                        that.allCompanyArr = res.data.data;
                        this.initAlert();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            initAlert(type, pageNumber) {
              let self = this;
                let url = "/zingbiz/common/mhAlert/loadUserAlert";
                let param = {
                    pageNumber: pageNumber ? pageNumber : 1,
                    pageSize: 20
                };
                if (type) {
                    param.Types = type
                }
                if (this.isOrder) {
                    param.isOrder = this.isOrder
                }

                this.$http
                    //.post(url, Qs.stringify(param))
                    .post(url, param)
                    .then(res => {
                        if (res.data.success) {
                            this.loadRedPoint();
                            this.handleData(res.data.data, pageNumber)
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        console.log("=======",error)
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    })
            },
            handleData(data, pageNumber) {
                console.log("messageList================",data)
                let now = new Date()
                let nowTime = now.getTime()
                let today = now.getDate()
                data.data.forEach(item => {
                    let generateTime = item.generateTime.replace(/\-/g, "/")
                    let oldDate = new Date(generateTime)
                    let date = oldDate.getTime()
                    let day = oldDate.getDate()
                    let timeCha = nowTime - date
                    let offset = Math.abs(today - day)
                    if (offset / 86400000 < 3 && offset < 3) {
                        if (offset === 0) {
                            if (timeCha < 1000) {
                                item.timeMsg = "刚刚"
                            } else if (timeCha < 60000) {
                                item.timeMsg = parseInt((timeCha / 1000)) + "秒前"
                            } else if (timeCha < 3600000) {
                                item.timeMsg = parseInt((timeCha / 60000)) + "分前"
                            } else {
                                item.timeMsg = parseInt((timeCha / 3600000)) + "小时前"
                            }
                        } else if (offset === 1) {
                            item.timeMsg = "昨天"
                        } else if (offset === 2) {
                            item.timeMsg = "前天"
                        }
                    } else {
                        item.timeMsg = (oldDate.getMonth() + 1) + "月" + day + "日"
                    }
                    if (item.bType === "ORG" || item.bType === "GROUP" || item.bType === "group") {
                        item.dispImg = "/JsLib/dist/app/images/qunliao.png"
                        if (item.tarId.indexOf("zspalluser") >= 0) {
                            this.allCompanyArr.forEach(company => {
                                if (company.id && item.companyId && company.id === item.companyId) {
                                    item.peerRealName = company.companyName
                                }
                            })
                        }
                    }
                    if (item.bType === "chat") {
                        let pbVal = ""
                        if(item.pbVal) {
                            //data.pbVal = data.pbVal.replace(/\r\n/g,"")//正常换行符转换
                            item.pbVal = item.pbVal.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g,"")//正常换行符转换
                            pbVal = PSMU.DP(item.pbVal)
                        }
                        console.log("========pbVal=========",pbVal)
                        let msgUserHead = !Z_IsEmpty20(pbVal.cardUrlPeer) && pbVal.cardUrlPeer.length > 2 && '/checkJpg/' + pbVal.cardUrlPeer.substring(0, 2) + '/' + pbVal.cardUrlPeer + '.jpg'
                        item.dispImg = msgUserHead ? getThumbUrl(msgUserHead, 200, 200, "/ZingVue/static/images/userDef_.jpg", false) : "/ZingVue/static/images/userDef_.jpg"
                    }
                    if (item.bType === "NOTICE") {
                        item.dispImg = item.dispImg ? getThumbUrl(item.dispImg, 200, 200, "/JsLib/dist/app/images/Notice.png", false) : "/JsLib/dist/app/images/Notice.png"
                    }
                    if (item.bType === "ZINGJOB") {
                      item.dispImg = item.dispImg === 'tianjia1' ? 'xiaoshougendanguanli' : item.dispImg;
                    }
                    let mas = this.handleMsg(item);

                  item.dispMsgNew = mas.replace(/\\/g, '')
                })
                //分页
                if (pageNumber) {
                    data.data.forEach(item => {
                        this.listData.data.push(item)
                    })
                } else {
                    this.listData = data;
                }
                this.handleRedSpot(data.status)
            },
            handleMsg(data) {
                let pbVal = ""
                if(data.pbVal) {
                    //data.pbVal = data.pbVal.replace(/\r\n/g,"")//正常换行符转换
                    data.pbVal = data.pbVal.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f|\u007F/g,"")//正常换行符转换
                    pbVal = PSMU.DP(data.pbVal)
                }
                let msgBodyTmp = data.dispMsg ? data.dispMsg : "新消息"
                let msgFromName = ''
                if (msgBodyTmp.indexOf(' : ') != -1) {
                    msgFromName = msgBodyTmp.substring(0, data.dispMsg.indexOf(' : ')) + ' : ';
                }
                if (data.bType == "ZINGJOB" || data.bType == "PROJECTJOB") {
                    msgBodyTmp = msgBodyTmp.split("&*&*")[0];
                    return msgBodyTmp
                }
                if (msgBodyTmp.indexOf('_VOICE_MSG') != -1 || (data.contentType && data.contentType === PSMU.contentType.voice)) {
                    msgBodyTmp = msgFromName + "语音消息";
                } else if (msgBodyTmp.indexOf('_IMG_MSG') != -1 || (data.contentType && data.contentType === PSMU.contentType.image)) {
                    msgBodyTmp = msgFromName + "图片消息";
                } else if (msgBodyTmp.indexOf('_EMOTION_MSG') != -1 || (data.contentType && data.contentType === PSMU.contentType.emoticon)) {
                    msgBodyTmp = msgFromName + "表情消息";
                } else if (msgBodyTmp.indexOf('_LOCATION_MSG') != -1 || (data.contentType && data.contentType === PSMU.contentType.location)) {
                    msgBodyTmp = msgFromName + "位置消息";
                } else if (data.contentType && data.contentType === PSMU.contentType.text) {
                    msgBodyTmp = data.dispMsg;
                } else if (msgBodyTmp.indexOf('WF_EXEC') != -1) {
                    msgBodyTmp = "审批流执行";
                } else if (msgBodyTmp.indexOf('WF_MY') != -1) {
                    msgBodyTmp = "审批流待办";
                } else if (msgBodyTmp.indexOf('WF_ZYK_DB') != -1) {
                    msgBodyTmp = "资源库凭证审批流待办";
                } else if (msgBodyTmp.indexOf('IM_START_QUEUE') != -1) {
                    msgBodyTmp = "新客户消息";
                } else if (msgBodyTmp.indexOf('WF_KH') != -1) {
                    msgBodyTmp = "客户工单待办";
                } else if (msgBodyTmp.indexOf('WF_CY') != -1) {
                    msgBodyTmp = "审批流参与";
                } else if (msgBodyTmp.indexOf('WF_FQ') != -1) {
                    msgBodyTmp = "审批流发起";
                } else if (msgBodyTmp.indexOf('WF_HDXX') != -1) {
                    msgBodyTmp = msgBodyTmp.replace("WF_HDXX", "");
                } else if (msgBodyTmp.indexOf('WF_KH_NO_ANS') != -1) {
                    msgBodyTmp = "客户工单待办";
                } else if (msgBodyTmp.indexOf('BING_FAILED') != -1) {
                    msgBodyTmp = "绑定失败";
                } else if (msgBodyTmp.indexOf('Z_CHAT_CANCLE_INFO_MSG') != -1) {
                    msgBodyTmp = "一条消息被撤回了";
                } else if (msgBodyTmp.indexOf('INFO_ADU') != -1) {
                    msgBodyTmp = msgBodyTmp.substring(data.dispMsg.indexOf('INFO_ADU') + 8);
                    msgBodyTmp = msgBodyTmp.replace(new RegExp("7z", "gm"), "\"");
                } else if (msgBodyTmp.indexOf('Z_GROUP_LinkCard') != -1) {
                    msgBodyTmp = msgFromName + "分享了一个链接";
                } else if (data.contentType && data.contentType === PSMU.contentType.linkCard) {
                    let fileName = pbVal.title ? pbVal.title : ""
                    msgBodyTmp = '[链接] '+ fileName
                } else {
                    //文本处理
                    /*if (typeof emoji !== 'undefined') {
                     if (typeof emoji.rx_colons === 'undefined') emoji.init_colons();
                     var rx_colons = new RegExp(emoji.rx_colons.source.replace(new RegExp('\:', 'g'), '\\[\\^:]'), 'g');
                     // console.log(rx_colons);
                     msgBodyTmp = msgBodyTmp.replace(rx_colons, function(m){
                     // console.log(m);
                     var idx = m.substring(4, m.length-4);
                     var val = emoji.map.colons[idx];
                     return val ? m.replace(/\[\^:]/g, ':') : m;
                     });
                     if (msgBodyTmp.indexOf('[^:]') !== -1) msgBodyTmp = msgBodyTmp.substring(0, msgBodyTmp.indexOf('[^:]'));

                     // console.log(msgBodyTmp);

                     emoji.replace_mode = 'unified';
                     emoji.allow_native = false;
                     emoji.colons_mode = false;

                     msgBodyTmp = emoji.replace_colons(msgBodyTmp);
                     }*/
                }
                msgBodyTmp = msgBodyTmp.indexOf("[^br]") >= 0 ? data.dispMsg.split("[^br]").join("") : msgBodyTmp
                return msgBodyTmp
            },
          //处理红点
            handleRedSpot(status) {
                this.redDot = {
                    all: false, liaotian: false, gonggao: false, shenpi: false, renwu: false,
                    ziyuanku: false, wailianren: false, xiangmu: false,
                }
                this.datas = [
                {content: "全部消息", type: "all", isRed: false},
                {content: "聊天", type: "liaotian", isRed: false},
                {content: "公告", type: "gonggao", isRed: false},
                {content: "审批", type: "shenpi", isRed: false},
                {content: "任务", type: "renwu", isRed: false},
                {content: "资源库", type: "ziyuanku", isRed: false},
                {content: "客户", type: "wailianren", isRed: false},
                {content: "项目", type: "xiangmu", isRed: false}
              ]
              let sArr = status.split('_ZSP_');
              for (let i = 0; i < sArr.length; i++) {
                    if (sArr[i].substring(0, sArr[i].indexOf(":")) === "liaotian") { //聊天
                        let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
                        if (parseInt(jsonStr) > 0) {
                            this.datas[0].isRed = true
                            this.datas[1].isRed = true
                            this.redDot.all = true
                            this.redDot.liaotian = true
                        }
                    } else if (sArr[i].indexOf("notice:") !== -1) { // 公告
                        let str = sArr[i].substring(7, sArr[i].length);
                        let notice_json = JSON.parse(str);
                        if (parseInt(notice_json.total) > 0) {
                            this.datas[0].isRed = true
                            this.datas[2].isRed = true
                            this.redDot.all = true
                            this.redDot.gonggao = true
                        }
                    } else if (sArr[i].indexOf("welcomeNotice:") !== -1) { // 公告
                        let str = sArr[i].substring(14, sArr[i].length);
                        let notice_json = JSON.parse(str);
                        if (parseInt(notice_json.total) > 0) {
                            this.datas[0].isRed = true
                            this.datas[2].isRed = true
                            this.redDot.all = true
                            this.redDot.gonggao = true
                        }
                    } else if (sArr[i].substring(0, sArr[i].indexOf(":")) == "shenpi") { //审批
                        var jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
                        if (JSON.parse(jsonStr) > 0) {
                            this.datas[0].isRed = true
                            this.datas[3].isRed = true
                            this.redDot.all = true
                            this.redDot.shenpi = true
                        }
                    } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "zingjob") { //任务
                        let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
                        if (JSON.parse(jsonStr).total > 0) {
                            this.datas[0].isRed = true
                            this.datas[4].isRed = true
                            this.redDot.all = true
                            this.redDot.renwu = true
                        }
                    } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "jinxiaocunAlert" ||
                        sArr[i].substring(0, sArr[i].indexOf(":")) === "ziyuankuAlert") { //资源库
                        let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
                        if (JSON.parse(jsonStr).total > 0) {
                            this.datas[0].isRed = true
                            this.datas[5].isRed = true
                            this.redDot.all = true
                            this.redDot.ziyuanku = true
                        }
                    } else if (sArr[i].indexOf("exContact:") != -1) { // 外联人
                        let exstr = sArr[i].substring(10, sArr[i].length);
                        let ex_json = JSON.parse(exstr);
                        if (parseInt(ex_json.total) > 0) {
                            this.datas[0].isRed = true
                            this.datas[6].isRed = true
                            this.redDot.all = true
                            this.redDot.wailianren = true
                        }
                    } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "projectJob") { //项目
                        let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
                        if (JSON.parse(jsonStr).total > 0) {
                            this.datas[0].isRed = true
                            this.datas[7].isRed = true
                            this.redDot.all = true
                            this.redDot.xiangmu = true
                        }
                    }
                }
            },
            redOrder() {
                if (this.redDot[this.type]) {
                    this.isOrder = true
                    this.initAlert(this.type)
                }
            },
            itemLongPress(event, item) {
                this.itemData = item
                this.menuDialog = true
            },
            itemClickFun(event, item) {
                this.itemData = item
                console.log("=======item========",item)
                if (item.bType.toUpperCase() === "ORG" || item.bType.toUpperCase() === "GROUP" || item.bType.toUpperCase() === "CHAT" || item.bType.toUpperCase() === 'IM') {
                    //聊天
                    if (item.bType.toUpperCase() === "ORG") {
                        MH_changeUserCompany(item.companyId).then(() => {
                            this.allCompanyArr.forEach(company => {
                                if (company.id && company.id === item.companyId) {
                                    document.title = company.companyName
                                }
                            })
                            goChat(item.tarId, item.companyId, item.bType, this.$router)
                        }).catch(err => {
                            if (PSMU) PSMU.error(err)
                        })
                    } else {
                        goChat(item.tarId, item.companyId, item.bType, this.$router)
                    }
                    return
                }
                if (item.dispMsg && item.dispMsg.indexOf('WF_KH_NO_ANS') >= 0) {

                    MH_changeUserCompany(item.companyId).then(() => {
                        this.allCompanyArr.forEach(company => {
                            if (company.id && company.id === item.companyId) {
                                document.title = company.companyName
                            }
                        })
                        let url = "/workflow/customLaunchWorkflow";
                        let tarIdStr = item.tarId.indexOf("WOOW")>=0?item.tarId.substring(4):item.tarId.substring(8);
                        this.$router.push({
                            path: url,
                            query:{
                                id:tarIdStr,
                                companyId:item.companyId
                            }
                        });
                    }).catch(err => {
                        if (PSMU) PSMU.error(err)
                    })
                    return
                }
                switch (item.bType) {
                    case 'NOTICE':
                        //公告
                        MH_changeUserCompany(item.companyId).then(() => {
                            this.allCompanyArr.forEach(company => {
                                if (company.id && company.id === item.companyId) {
                                    document.title = company.companyName
                                }
                            })
                            let noticeStatus = item.alertState === "1isAlert" ? "1" : '0';
                            //location.href = '/SRender?jsLoader=tuWenGuanLi%2FarticleDetailsLoader&tpl=tuWenGuanLi%2FarticleDetails&v=1.13180419_1054&companyId=' + item.companyId + '&id=' + item.tarId + '&noticeStatus=' + noticeStatus
                            let url = '/notice/noticeDetails?noticeId=' + item.tarId + "&type=alert"
                            this.$router.push({path: url});
                        }).catch(err => {
                            if (PSMU) PSMU.error(err)
                        })
                        break;
                    case 'ZINGJOB':
                        //工作
                        this.toggleMsgRead('noAlert')
                        let jobMsgs = item.dispMsg.split("&*&*");
                        //location.href = "/SRender?jsLoader=trello%2FcardListLoader&tpl=trello%2FcardList&boardId=" + jobMsgs[2] + "&routing=" + jobMsgs[1] + "&cardId=" + jobMsgs[3]
                        let url = '/taskManage/taskList/taskDetail?taskCardId=' + jobMsgs[3] + '&taskRouting=' + jobMsgs[1]
                        this.$router.push({path: url});
                        break;
                    case 'PROJECTJOB':
                        //项目
                        this.toggleMsgRead('noAlert')
                        let projectMsgs = item.dispMsg.split("&*&*")
                        let urlProject = '/projectManage/detail?boardId=' + projectMsgs[2] + '&routing=' + projectMsgs[1]
                        this.$router.push({ path: urlProject })
                        break;
                    case 'ZYK':
                        //资源库
                        this.toggleMsgRead('noAlert')
                        var ids = item.tarId.split("_");
                        if (ids[3] == "LQ") {
                            location.href = "/SRender?jsLoader=zingCK%2FgoodsReceiptLoader&tpl=zingCK%2FgoodsReceipt&companyId=" + item.companyId + "&ckId=" + ids[0] + "&rowId=" + ids[2] + "&receiveRefundRowId=" + ids[1] + "&tarId=" + item.tarId;
                        } else {
                            location.href = "/SRender?jsLoader=zingCK%2FgoodsReturnedLoader&tpl=zingCK%2FgoodsReturned&companyId=" + item.companyId + "&ckId=" + ids[0] + "&rowId=" + ids[2] + "&receiveRefundRowId=" + ids[1] + "&tarId=" + item.tarId;
                        }
                        break;
                    case 'exContact':
                        //外联人
                      MH_changeUserCompany(item.companyId).then(() => {
                        this.allCompanyArr.forEach(company => {
                          if (company.id && company.id === item.companyId) {
                            document.title = company.companyName
                          }
                        })
                        this.itemData = item
                        this.toggleMsgRead('noAlert');
                        let ids = item.tarId.split(",");
                        let visitRecordId = ids[0];
                        let externalContactsId = ids[1];
                        this.$router.push({
                          path:"/outContactMain/visitRecord",
                          query:{
                            externalContactsId:externalContactsId,
                            companyId:item.companyId,
                            visitRecordId:visitRecordId,
                            type:"update",
                            isReadOnly:true
                          }
                        })
                      }).catch(err => {
                        if (PSMU) PSMU.error(err)
                      })




                        //location.href = "/SRender?jsLoader=externalContacts%2FvisitRecordLoader&tpl=externalContacts%2FvisitRecord&externalContactsId=" + externalContactsId + "&visitRecordId=" + visitRecordId + "&isReadOnly=true&companyId=" + item.companyId;
                        break;
                    case 'HR_WQSH_MSG':
                        //外勤审核
                        this.toggleMsgRead('noAlert')
                        this.$router.push({
                            path:"/attendanceHome/attenExamineDetail",
                            query:{
                                rowId:item.tarId,
                                companyId:item.companyId,
                                bType:item.bType,
                                tarId:item.tarId
                            }
                        })
                        break;
                    case 'HR_BK_WTG':
                        //补卡未通过
                        this.toggleMsgRead('noAlert')
                        this.$router.push({
                            path:"/attendanceHome/attendanceRepairDetail",
                            query:{
                                rowId:item.tarId.split("#")[0],
                                cardUrl:item.tarId.split("#")[1],
                                pageType:"punch",
                                bType:item.bType,
                                tarId:item.tarId
                            }
                        })
                        break;
                    case 'HR_BK_YTG':
                        //补卡已通过
                        this.toggleMsgRead('noAlert')
                        this.$router.push({
                            path:"/attendanceHome/attendanceRepairDetail",
                            query:{
                                rowId:item.tarId.split("#")[0],
                                cardUrl:item.tarId.split("#")[1],
                                pageType:"exmine",
                                bType:item.bType,
                                tarId:item.tarId
                            }
                        })
                        break;
                    case 'HR_BK_SH':
                        //补卡审核中
                        this.toggleMsgRead('noAlert')
                        this.$router.push({
                            path:"/attendanceHome/attendanceRepairDetail",
                            query:{
                                rowId:item.tarId.split("#")[0],
                                cardUrl:item.tarId.split("#")[1],
                                pageType:"exmine",
                                bType:item.bType,
                                tarId:item.tarId
                            }
                        })
                        break;
                    case 'WOOW':case 'KH_ORDER':
                        //审批
                        this.toggleMsgRead('noAlert')
                        MH_changeUserCompany(item.companyId).then(() => {
                            this.allCompanyArr.forEach(company => {
                                if (company.id && company.id === item.companyId) {
                                    document.title = item.companyName
                                }
                            })
                            let url = "/workflow/showNode";
                            this.$router.push({
                                path: url,
                                query:{
                                    workflow_id:item.tarId,
                                    companyId:item.companyId
                                }
                            });
                        }).catch(err => {
                            if (PSMU) PSMU.error(err)
                        })
                        break;
                    default:
                        console.warn('not supported page type', item.bType)
                }
            },
            gotoTop() {
                this.startData.scrollTo(0, 0, 300)
            },
            scrollToTop(val) {
                this.startData = val
            },
            scroll(val) {
                let y = Math.abs(Math.round(val.y))
                this.isShowTop = y > 425 ? true : false
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    //分页逻辑，暂时去掉
                    let pageN = parseInt(this.listData.data.length / 20) + 1
                    if (pageN > this.pageNumber) {
                        this.pageNumber = pageN
                        this.initAlert(this.type, pageN);
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            toggleMsgRead(val) {
                let self = this
                let params = {};
                params.cardUrl = this.itemData.cardUrl;
                params.companyId = this.itemData.companyId;
                params.bType = this.itemData.bType;
                params.tarId = this.itemData.tarId;

              let url = val !== 'isAlert' ? "/zingbiz/common/mhAlert/updateDisAlert"
                    : "/zingbiz/common/mhAlert/updateDisAlertTo1isAlert"
                this.$http
                    //.post(url, Qs.stringify(params))
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            self.pageNumber = 1
                            self.isOrder = false
                            this.initAlert();
                            self.menuDialog = false
                        } else {
                            self.$vux.toast.text("修改失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("修改失败，请重试", 'bottom')
                    })
            },
            delToggleMsg() {
              let self = this
                let params = {};
                params.cardUrl = this.itemData.cardUrl;
                params.companyId = this.itemData.companyId;
                params.bType = this.itemData.bType;
                params.tarId = this.itemData.tarId;
              let url = "/zingbiz/common/mhAlert/deleteDisAlertNews";
                this.$http
                    //.post(url, Qs.stringify(params))
                    .post(url,params)
                    .then(res => {
                        console.log("===========data==========",res.data)
                        if (res.data.success) {
                            self.pageNumber = 1
                            self.isOrder = false
                            this.initAlert(this.type);
                            self.menuDialog = false
                        } else {
                            self.$vux.toast.text("删除失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        console.log("==========error===========",error)
                        self.$vux.toast.text("删除失败，请重试", 'bottom')
                    })
            },
            topToggleMsg(isTop) {
                let self = this
                let msg = ""
                let params = {};
                params.cardUrl = this.itemData.cardUrl;
                params.companyId = this.itemData.companyId;
                params.bType = this.itemData.bType;
                params.tarId = this.itemData.tarId;
                params.isTop = isTop;
                let url = "/zingbiz/common/mhAlert/setTopOrCancelTopAlert";
                if (isTop === '0') {
                     msg = "取消置顶"
                } else {
                    msg = "置顶"
                }
                this.$http
                    //.post(url, Qs.stringify(params))
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            this.pageNumber = 1
                            this.isOrder = false
                            self.initAlert();
                            this.menuDialog = false
                        } else {
                            self.$vux.toast.text(msg + "失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text(msg + "失败，请重试", 'bottom')
                    })
            },
            calcCols(linkman) {
                if (linkman.type === 'friend') {
                    return ['cols1']
                } else if (linkman.user.length > 4) {
                    return ['cols3']
                } else {
                    return ['cols2']
                }
            },
            handleMenuType(data) {
                this.pageNumber = 1
                this.isOrder = false
                this.type = data.type
                this.initAlert(data.type)
                this.searchParam = data.content
            },
            handleMenu(data) {
                switch (data.content) {
                    case "发起群聊":
                        createChat(this)
                        break;
                    case "添加好友":
                        this.$router.push({path: "", query: {}});
                        break;
                }
            },
            search() {
                /*this.showSearch = !this.showSearch;*/
                this.$router.push({
                    path: "/globalSearch",
                });
            },
            cancelInput() {
                this.showSearch = !this.showSearch;
            },
            confirmInput() {

            }
        },
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">

    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .message-list
        width: 100%
        height: 100%
        .triangle-down
            triangle-down()
        .vux-search-fixed
            top: 0 !important
        .list-wrapper .scroll-content
            width 100%
        .message-list-content
            height calc(100% - 50px)
            overflow hidden
            .iconfont{
                font-size: 36px !important;
            }
            .linkman-wrapper
                position: relative
                flex-center(row, start, center)
                .grid-card
                    width: 100%
                    background-color: #fff
                    position relative
                    z-index 2
                    .right-info-mute
                        float: right;
                        margin-right: 13px;
                    .left
                        flex: none /*width 50px
          height 50px*/
                        background-color #dddbdb
                        border-radius: 4px
                        position relative
                        .new-msg-count
                            position: absolute
                            font-style: normal
                            font-family: PingFang SC, Hiragino Sans GB, Arial, Microsoft YaHei, Helvetica
                            right: -9px
                            top: -5px
                            z-index: 2
                            padding: 0 4px
                            width: auto;
                            min-width: 18px
                            height: 18px
                            line-height: 18px
                            border-radius: 9px
                            color: #fff
                            text-align: center
                            font-size: 14px
                            background-color: #f43531
                        .new-msg-dot
                            position: absolute
                            right: -4px
                            top: -3px
                            width: 10px
                            height: 10px
                            z-index: 2
                            border-radius: 50%
                            color: #ffffff
                            text-align: center
                            background-color: #f43531
                            font-size: 0
                        .group-grid
                            width: 100%
                            height: 100%
                            flex-center(start, center, center)
                            flex-wrap: wrap
                            padding: 2px
                            overflow hidden
                            &.cols1
                                padding: 0
                            .group-grid-item
                                padding: 1px
                                &.cols1
                                    width: 100%
                                    padding: 0px
                                &.cols2
                                    width: 50%
                                &.cols3
                                    width: 33.3333333333333333333%
                                .ei-avatar
                                    width 100%
                                    height auto
                                    line-height 1
                                    &:before
                                        display inline-block
                                        content: ""
                                        padding-bottom 100%
                                        width: .1px
                                        vertical-align: middle
                                    .iconfont
                                        font-size: 100%
                                    .ei-avatar > *
                                        line-height: auto
                                        img
                                            width 100%
                    .right
                        text-align: left
                        padding-left: 20px
                        flex-center(row, space-between, center)
                        overflow: hidden
                        &-content
                            width: 80%
                            &-title
                                margin-bottom: 14px
                            &-lastword
                                color: #888
                                width: 100%
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow hidden
                        &-info
                            &-date
                                margin-bottom: 14px
                                color: #b8b8b8
                            &-mute
                                color: #b8b8b8
                .operate-box
                    height: 100%
                    position absolute
                    z-index: 1
                    top: 0
                    right: 0
                    flex-center(row, start, center)
                    .operate-readtoggle
                        height: 100%
                        padding: 0 12px
                        font-size: 18px
                        color: #fff
                        background-color: #c7c7cc
                        flex-center(row, center, center)
                    .operate-del
                        height: 100%
                        background-color #ff3b30
                        flex-center(row, center, center)
                        font-size: 18px
                        padding: 0 12px
                        color: #fff
        .overflowHid
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
        .menu {
            min-height: 40px;
            line-height: 40px;
        }
        /*.icon-daishenhe {
            font-size: 36px !important;
        }
        .icon-pandian {
            font-size: 36px !important;
        }
        .icon-setting {
            font-size: 36px !important;
        }
        .icon-shenheguanli{
            font-size: 36px !important;
        }*/
</style>
<style>
    .el-dropdown-menu {
        background-color: #e5e5e5 !important;
        border: 1px solid #e5e5e5 !important;
    }
</style>
