<template>
    <div class="noticeD" style="height: 100%">
        <zing-head :title="'公告'">
          <div slot="header-right" v-if="author===userLogin.cardUrl">
            <span style="color: #ff8000;margin-right: 20px;font-size: 16px" @click="delNotice">删除</span>
          </div>
        </zing-head>
        <div class="scroll-list-wrap" :style="{ height: 'calc(100% - 50px)',overflowY:'auto',background:'#fff' }">
            <div :style="isPc ? center : {}">
                <div class="titel"><span>{{noticeData.title}}</span></div>
                <div class="context"><span>时间：{{noticeData.releaseTime}}</span> <span>作者：{{noticeData.releasePeople}}</span></div>
                <div v-if="noticeData.noticeType !== 2">
                    <div v-if="userLogin.cardUrl === noticeData.author" class="contextRead" @click="showMan">
                        <span>已读{{isReadMan.length}}人，</span>
                        <span>未读{{noReadMan.length}}人</span>
                    </div>
                    <div v-else class="contextLook">
                        <span>已读{{isReadMan.length}}人，</span>
                        <span>未读{{noReadMan.length}}人</span>
                    </div>
                </div>
                <div class="textContent">
                    <img v-if="noticeData.coverUrl !== '/JsLib/dist/app/images/Notice.png'"
                         :src="noticeData.coverUrl" :style="isPc ? {maxWidth: '700px'} : {maxWidth: '100%'}"/>
                    <div v-html="noticeData.textContent" style="text-align: left;letter-spacing: 1px">{{noticeData.textContent}}</div>
                </div>
            </div>
        </div>
        <popup v-model="manRemark" height="100%" width="100%" style="z-index: 1002;" position="right">
            <popup-header :left-text="'关闭'" :right-text="''" :title="'公告接收人员'" :show-bottom-border="false"
                          @on-click-left="manRemark = false">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <tab>
                    <tab-item selected @on-item-click="switchTab('1')">未读({{noReadMan.length}})</tab-item>
                    <tab-item @on-item-click="switchTab('0')">已读({{isReadMan.length}})</tab-item>
                </tab>

                <div v-for="(item,index) in readMan" :key="index" class="readManRoot">
                    <div v-if="item.headImg"><img class="readImage" :src="item.headImg"/></div>
                    <div class="readMan" v-else><span>{{item.userName}}</span></div>
                    <div><span>{{item.userName}}</span></div>
                </div>
            </div>
        </popup>
        <sidebar
            :showCloudIcon="false"
            :showDownloadIcon="false"
            @shareMessage = "onShareMessage"
            @shareTimeline = "shareTimeline"
            @shareFriend="shareFriend">
        </sidebar>
    </div>
</template>

<script>
    import { Popup,PopupHeader,Group,Cell,XInput,Tab,TabItem } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import Sidebar from "../../components/sidebar/Sidebar.vue"
    import { isIos,isPc,getThumbUrl,shareMessage,isWeiXin,isMhApp } from '@/utils/fn'
    import { setupWeiXinShareInfo,shareFriend,shareTimeline } from '@/utils/wx'
    export default {
        name: "noticeDetails",
        components: {
           Group,XInput,Cell,Popup,PopupHeader,ZingHead,Sidebar,Tab,TabItem
        },
        data: () => ({
            manRemark:false,
            userLogin:{},
            noticeId:"",
            alertStr:"",
            author:"",
            noticeData:{},
            readMan:[],
            isReadMan:[],
            noReadMan:[],
            isPc:isPc(),
            center:{
                position: 'absolute',
                left: 'calc(50% + 100px)',
                transform: 'translate(-50%)'
            }
        }),
        computed:{},
        watch: {},
        created() {
            this.noticeId = this.$route.query.noticeId
            this.alertStr = this.$route.query.type
            this.author = this.$route.query.author
            this.loadUserMsg()
        },
        methods: {
            initNotice() {
                let self = this;
                let url = "/zingbiz/notice/selectOneNotice";
                let param = {
                    noticeId:this.noticeId
                };
                this.$http
                    .get(url, { params: param })
                    .then(res => {
                        if (res.data.success) {
                            if (res.data.data.data && res.data.data.data.length > 0) {
                                self.noticeData = res.data.data.data[0];
                                if (self.noticeData.hrUser) {
                                    this.dealData()
                                }
                                console.log("=======noticeData=======",res.data)
                                //self.noticeData.textContent = self.noticeData.textContent.replace(/\s+/g,"");
                                let stateN= self.userLogin.cardUrl + "1"
                                let stateY = self.userLogin.cardUrl + "0"
                                let status = self.noticeData.status
                                if ((self.noticeData.status.indexOf(stateN) >= 0 && (self.noticeData.noticeType === "0" ||
                                        self.noticeData.noticeType === "2")) || self.alertStr === "alert") {
                                    status = status.replace(stateN,stateY)
                                    this.updateNotice(status,self.noticeData)
                                }
                                if (isWeiXin() || isMhApp()) {
                                    let url = location.origin + `/ZingVue/index.html#/notice/noticeDetails?noticeId=${this.noticeId}&companyId=${this.noticeData.companyId}`
                                    let title = this.noticeData.title
                                    let desc = PSMU.html2txt(this.noticeData.textContent)
                                    let weibodesc = PSMU.html2txt(this.noticeData.textContent)
                                    let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                                    let msgtit = this.noticeData.title
                                    console.log("方法内=======url==============",url)
                                    setupWeiXinShareInfo(url, title, desc, weibodesc, img, msgtit)
                                }
                            } else {
                                self.$vux.confirm.show({
                                    title: '提示',
                                    content: '公告已被删除',
                                    showCancelButton:false,
                                    onConfirm() {
                                        self.$router.go(-1);
                                    }
                                })
                            }
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        console.log("error===>", error)
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    })
            },
            loadUserMsg() {
                let url = "/zingbiz/auth/user/getThisUserInfo";
                let that = this;
                this.$http
                    .post(url, {})
                    .then(res => {
                        that.userLogin = res.data.data;
                      console.log(that.userLogin,'==========处理=========');
                      this.initNotice()
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            delNotice() {
            let that = this
            let url = "/zingbiz/notice/delByIds"
            let param = {
              noticeId: that.noticeId
            }
            this.$vux.confirm.show({
              title: '提示',
              content: '删除公告后其他人将无法查看此公告，确定要删除吗？',
              onCancel() {
                that.$vux.confirm.hide();
              },
              onConfirm() {
                that.$http
                  .get(url, { params: param })
                  .then(res => {
                    if (res.data.success) {
                      that.$vux.toast.show({
                        text: "删除成功", type: "success",
                        onHide() { //
                          that.$router.go(-1);
                        }
                      })
                    } else {
                      that.$vux.toast.show({
                        text: "删除失败", onHide() { //
                        }
                      })
                    }
                  });
              }
            })
          },
            updateNotice(status,noticeData) {
                let self = this;
                let url = "/zingbiz/notice/updateNotice";
                let state = status
                let param = {
                    noticeId:this.noticeId,
                    status:status,
                    companyId:noticeData.companyId,
                    noticeType:noticeData.noticeType
                };
                this.$http
                    .post(url, param)
                    .then(res => {
                        self.alertStr = "isUpdate"  //防止每次加载都会修改
                        this.initNotice()
                    })
                    .catch(error => {
                        console.log("error===>", error)
                    })
            },
            dealData() {
                this.noReadMan = []
                this.isReadMan = []
                let urls = this.noticeData.notifyPeople.split(" ")
                urls.forEach(url => {
                    if (this.noticeData.status.indexOf(url + "1") >= 0 && this.noticeData.hrUser[url]) {
                        this.noReadMan.push(this.noticeData.hrUser[url])
                    } else {
                        if (this.noticeData.hrUser[url]) {
                            this.isReadMan.push(this.noticeData.hrUser[url])
                        }
                    }
                })
            },
            showMan() {
                this.manRemark = true
                this.initNotice()
                this.switchTab("1")
            },
            switchTab(key) {
                this.readMan = this.noReadMan
                if (key === "0") {
                    this.readMan = this.isReadMan
                }
                this.readMan.forEach(item => {
                    if (item.headImg) {
                        item.headImg = getThumbUrl(item.headImg, 200, 200, "/ZingVue/static/images/userDef_.jpg", false)
                    }
                })
            },
            shareTimeline() {
                if (isMhApp()) {
                    try{
                        console.log("--------分享到微信朋友圈--------")
                        let url = location.origin + `/ZingVue/index.html#/notice/noticeDetails?noticeId=${this.noticeId}&companyId=${this.noticeData.companyId}`
                        let title = this.noticeData.title
                        let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                        shareTimeline(title,url,img)
                    }catch (e) {
                        console.log("分享error===>", e)
                    }
                }
            },
            shareFriend() {
                if (isMhApp()) {
                    try{
                        console.log("--------分享到微信朋友--------")
                        let url = location.origin + `/ZingVue/index.html#/notice/noticeDetails?noticeId=${this.noticeId}&companyId=${this.noticeData.companyId}`
                        let title = this.noticeData.title
                        let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                        shareFriend(title,url,img)
                    }catch (e) {
                        console.log("分享error===>", e)
                    }
                }
            },
            onShareMessage() {
                console.log("--------分享到英商--------")
                let link = `/ZingVue/index.html#/notice/noticeDetails?noticeId=${this.noticeId}&companyId=${this.noticeData.companyId}`
                let title = this.noticeData.title
                let content = PSMU.html2txt(this.noticeData.textContent)
                let logoUrl = '/ZingVue/static/images/explorer/txt.png'
                shareMessage(this, link, title, content, logoUrl)
            },
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .noticeD {
        .readManRoot{
            float: left;
            text-align : center;
        }
        .readMan{
            border: 1px solid;
            font-size: 16px;
            border-radius: 50%;
            color: #fff;
            background: #ff8000;
            width: 60px;
            height: 60px;
            padding-top: 20px;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 10px;
        }
        .readImage{
            border: 1px solid;
            font-size: 16px;
            border-radius: 50%;
            color: #fff;
            width: 60px;
            height: 60px;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 10px;
        }
        .titel {
            padding-left: 13px;
            padding-top: 13px;
            padding-right: 13px;
            font-size: 18px;
            font-weight: 600;
        }
        .context {
            padding-left: 13px;
            padding-right: 13px;
            padding-top: 5px;
            padding-bottom :5px;
            color: #888888;
        }
        .contextRead {
            padding-left: 13px;
            padding-right: 13px;
            padding-top: 5px;
            padding-bottom :5px;
            color: #409eff;
        }
        .contextLook {
            padding-left: 13px;
            padding-right: 13px;
            padding-top: 5px;
            padding-bottom :5px;
            color: #888888;
        }
        .textContent {
            padding-left: 13px;
            padding-right: 13px;
            padding-top: 5px;
            border-top:1px solid #f5f5f5;
            line-height: 1.4;
            max-width: 700px;
            text-align: center;
        }
    }
</style>
