<template>
    <div class="test-pages">
        <PopMenu
          :show="showPopMenu"
          @on-hide="hideMenu"
          :menuData="popMenuData"
          @cancel="hideMenu"
          @click-menu-item="handleMenuItem"
        />

        <!-- 工作台 -->
        <zing-head :isComeBack="false" @click.native="bonusTesting">
            <div slot="header-left">
                <popup-picker
                  :show.sync="showPopupPicker"
                  :data="datas"
                  :columns="2"
                  v-model="defaultData"
                  ref="picker"
                  :show-cell="false"
                  @on-change="handleMenu"
                >
                </popup-picker>
                <div class="popupTitle" @click="showPopupPicker = true">
                  <span>{{currentCompany.companyName}}</span>
                  <i class="iconfont icon-youjiantou" style="font-size: 10px;"></i>
                </div>
            </div>
            <div slot="header-right">
              <span class="header-search" @click="search">
                <i class="iconfont icon-fangdajing"></i>
              </span>
              <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger" @click="handleMenuRigth">
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo"></i>
                </span>
              </a>

            </div>
        </zing-head>

        <search-comp :searchFlag="showSearch" @cancelInput="cancelInput" @confirmInput="confirmInput"></search-comp>
        <div class="test-pages-content">
            <!--userLogin && userLogin.companyId-->
            <scroll v-if="!isFangKe" :observeDOM="true">
                <div class="title">
                    <div>通用应用</div>
                    <div class="pc-login" @click="pcLoginPopup = true">电脑登录</div>
                </div>
                <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                    <grid-item v-if="userLogin.companyId !== '' && (!roleData[item.role] || roleData[item.role] === 'true')" v-for="(item, index) in menuData" :key="index"
                               :label="item.name">
                        <avatar :size="'normal'" @click.native="gotoChildPage(item.link)" slot="icon" :icon="item.icon"
                                shape="square" :style="{background: item.color}"></avatar>
                        <badge slot="icon" v-if="item.redPoint"></badge>
                    </grid-item>
                </grid>
                <div class="title" style="border-top: 1px solid #f1f1f1;">
                    <div>专业应用</div>
                </div>
                <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                    <grid-item v-if="!roleData || roleData[item.role] === 'true'|| !roleData[item.role]" v-for="(item, index) in menuData2" :key="index" :label="item.name">
                        <avatar :size="'normal'" slot="icon" @click.native="gotoChildPage(item.link)" :icon="item.icon"
                                shape="square" :style="{background: item.color}"></avatar>
                    </grid-item>
                    <grid-item label="添加">
                        <avatar :size="'normal'" slot="icon" :icon="'jiahao1'" shape="square"
                                @click.native="addWorkBench"></avatar>
                    </grid-item>
                </grid>
            </scroll>
            <div v-if="isFangKe">
                <img width="100%" src="/ZingVue/static/images/notCard.jpg"/>
            </div>
        </div>
        <popup v-model="pcLoginPopup" height="100%" width="100%" style="z-index: 511;" position="right">
            <popup-header :right-text="'知道了'" :title="'欢迎您使用英商电脑端'" :show-bottom-border="false"
                          @on-click-right="pcLoginPopup = false">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;padding: 13px;line-height: 1.5;">
                <div><span>请在浏览器地址栏输入<a style="color:#2e78da">www.zingbiz.com</a>或<a style="color:#2e78da">www.英商.cn</a>,进入英商官方网站</span></div>
                <div><img width="100%" src="/ZingVue/static/images/pcLogin/pc-login-website.png"/></div>
                <div><span>点击网站右上方登录，使用微信或英商APP扫描二维码登录电脑端</span></div>
                <div><img width="100%" src="/ZingVue/static/images/pcLogin/pc-login.png"/></div>
                <div><span>浏览器支持信息：</span></div>
                <div>
                    <flexbox>
                        <flexbox-item><div class="flex-demo">
                            <div style="text-align: center"><img height="80px" width="80px" src="/ZingVue/static/images/pcLogin/pc-login-chrome.jpg"/></div>
                            <div style="text-align: center"><span>谷歌浏览器</span></div>
                        </div></flexbox-item>
                        <flexbox-item><div class="flex-demo">
                            <div style="text-align: center"><img height="80px" width="80px" src="/ZingVue/static/images/pcLogin/pc-login-ie.jpg"/></div>
                            <div style="text-align: center"><span>IE9或更高版本</span></div>
                        </div></flexbox-item>
                        <flexbox-item><div class="flex-demo">
                            <div style="text-align: center"><img height="80px" width="80px" src="/ZingVue/static/images/pcLogin/pc-login-safari.jpg"/></div>
                            <div style="text-align: center"><span>Safari</span></div>
                        </div></flexbox-item>
                    </flexbox>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
//import { mapState } from "vuex";
import { Z_IsEmpty20, isPc ,isMhApp, getAppName,getInfoUrl,isWeiXin} from "utils/fn";
import { setupWeiXinShareInfo,shareFriend,shareTimeline } from '@/utils/wx'
import { Grid, GridItem, Badge,PopupPicker,Popup,PopupHeader,Flexbox, FlexboxItem } from "vux";
import Avatar from "components/avatar/Avatar";
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import SearchComp from "components/search/search.vue";
import PopMenu from "components/popmenu/PopMenu";
import _ from "lodash";
import store from '../../store/index.js'

let timeout;
let bonus = 0;

export default {
  name: "Workbench",
  components: {
    Grid,
    GridItem,
    Avatar,
    ZingHead,
    Scroll,
    SearchComp,
    Badge,
    PopupPicker,
    PopMenu,
    Popup,
    PopupHeader,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      factCompanyId : "",
      pcLoginPopup:false,
      showPopMenu: false,
      showPopupPicker:false,
      isFangKe:false,
      userLogin: {},
      currentCompany: {},
      allCompanyArr: [],
      datas: [],
      defaultDatas:[],
      defaultData:[],
      showSearch: false,
      roleList:[],
      rpData:"",
      menuData: [
        {
          name: "任务管理",
          link: "/taskManage",
          icon: "bianji1",
          color: "#40AFFC",
          role: "renwuguanli",
          redPoint: false
        },
        {
          name: "审批",
          link: "/workflow/workflowMain",
          icon: "shenpi1",
          color: "#F59324",
          redPoint: false,
          role: "shenpin"
        },
        {
          name: "人力资源",
          link: "/WorkbenchChild?childItem=resources",
          icon: "renyuanguanli",
          color: "#985DAE",
          role: "renliziyuan",
          redPoint: false
        },
        {
          name: "签到签退",
          link: "/attendanceHome/attendanceCard",
          icon: "dingdan",
          color: "#985DAE",
          redPoint: false,
          role: "qiandaoqiantui"
        },
        {
          name: "项目管理",
          link:
            "/projectManage",
          icon: "02",
          color: "#0FBE1C",
          redPoint: false,
          role: "xiangmuguanli"
        },
        {
          name: "商城管理",
          link: "/WorkbenchChild?childItem=shop",
          icon: "shangpu",
          color: "#D91E06",
          redPoint: false,
          role: "shangchengguanli"
        },
        {
          name: "知识库",
          icon: "weibiaoti4",
          //link: "/knowledgebase?companyId=" + userLogin.companyId + "&v=1.13180409_1357",
          link: "",
          color: "#40AFFC",
          redPoint: false,
          role: "zhishiku"
        },
        {
          name: "工作日历",
          icon: "purchaseorder",
          link: "/hrManager/workCalendar",
          color: "#F78D11",
          redPoint: false,
          role: "gongzuorili"
        },
        {
          name: "公告",
          icon: "xiaolaba",
          link:"/notice/noticeList",
          color: "#EB3C44",
          redPoint: false,
          role: "gonggao"
        },
        {
          name: "生产核算",
          icon: "benbanzushengchandingdanguanli",
          link: "tishi",
          color: "#0FBE1C",
          redPoint: false,
          role: "shengchanhesuan"
        },
        {
          name: "报表",
          link: "/WorkbenchChild?childItem=reportForms",
          icon: "baobiao-selected",
          color: "#E7BB35",
          redPoint: false,
          role: "baobiao"
        },
        {
          name: "后台管理",
          link: "/WorkbenchChild?childItem=management",
          icon: "chanpinguanli",
          color: "#D71600",
          redPoint: false,
          role: "houtaiguanli"
        },
        {
          name: "财务",
          icon: "caiwu",
          //link: "/WorkbenchChild?childItem=financeWarehouse&companyId=" +userLogin.companyId,
          link: "",
          color: "#E7BB35",
          redPoint: false,
          role: "caiwuku"
        },
        {
          name: "物品库",
          //link: "/WorkbenchChild?childItem=goodsWarehouse&companyId=" + userLogin.companyId,
          link: "",
          icon: "list_kucunchaxun",
          color: "#9659AE",
          redPoint: false,
          role: "wupinku"
        },
        {
          name: "进销存",
          link: "",
          icon: "drxx48",
          color: "#40B1FD",
          redPoint: false,
          role: "jinxiaocun"
        },
        {
          name: "物品柜",
          //link: "/resourceLibrary/goodsCabinet/CabinetList?companyId=" +userLogin.companyId,
          link: "",
          icon: "caiwuguanli",
          color: "#23C32F",
          redPoint: false,
          role: "wupingui"
        }
      ],
      menuData2: [
          {
              name: "订房管理",
              link: "/hotel/roomState",
              icon: "jiudian",
              color: "#F59324",
              redPoint: false,
              role: "dingfangguanli"
          },
          {
              name: "点菜管理",
              link: "/WorkbenchChild?childItem=dinner",
              icon: "canting",
              color: "#40AFFC",
              redPoint: false,
              role: "diancaiguanli"
          }
      ]
    };
  },
    mounted() {
      //app直接调用sdk分享接口 微信调用微信js分享接口
      if(isWeiXin()){
          let url = getInfoUrl()
          let title = getAppName()
          let img = window.Config.basUrl+'/ZingVue/static/images/explorer/txt.png'
          SetupWeiXinShareInfo(url, title, title, null, img, null);
      }
    },
  created() {
    this.loadUserMsg();
    this.loadServerNumber(); // 获取服务号
    this.loadMyRole();
    this.getAllCompanyLink();
    if(isPc()){
        this.menuData = this.menuData.filter(item =>{
            return item.name !== "签到签退"
        })
    }
    if(this.$route.query.reload+'' === 'true'){
      this.handleMenu()
    }


  },
  computed: {
    /*...mapState({
      isMode: state => state.ui.isMode,
      redPoint: state => state.ui.redPoint
    }),*/
    roleData() {
        let rd = {
            "dingfangguanli" : "false",
            "diancaiguanli" : "false",
        }
        console.log('---------')
        console.log(this.verifyHotelPower())
        this.roleList.forEach(item => {
            if (item.resInfoVal === "hotelManagePower"  || this.verifyHotelPower()) {

                rd["dingfangguanli"] = "true"
                if (!isPc()) {
                    this.menuData2[0].link = "/demo/hotel";
                }
            }
            if (item.resInfoVal === "orderManagePower") {
                rd["diancaiguanli"] = "true"
            }
        })
        return rd
    },
  },
  watch: {
    userLogin() { //解决切换服务号companyId不变，很重要
        this.loadRedPoint()
        this.isFangKe = this.userLogin.companyId ? false : true
        this.menuData.forEach(item => {
            if (item.name === "知识库") {
                //暂时链接这样处理,后期companyId 可以从后台获取,这里面可以处理红点
                let link =
                    "/knowledgebase?companyId=" +
                    this.userLogin.companyId +
                    "&v=1.13180409_1357";
                this.$set(item, "link", link);
            } else if (item.name === "财务") {
                let link =
                    "/WorkbenchChild?childItem=financeWarehouse&companyId=" +
                    this.userLogin.companyId;
                this.$set(item, "link", link);
            } else if (item.name === "物品库") {
                let link =
                    "/WorkbenchChild?childItem=goodsWarehouse&companyId=" +
                    this.userLogin.companyId;
                this.$set(item, "link", link);
            } else if (item.name === "物品柜") {
                let link =
                    "/resourceLibrary/goodsCabinet/CabinetList?companyId=" +
                    this.userLogin.companyId;
                this.$set(item, "link", link);
            } else if (item.name === "进销存") {
                let link =
                    "/WorkbenchChild?childItem=inventoryManagement&companyId=" +
                    this.userLogin.companyId;
                this.$set(item, "link", link);
            }
        });
    },
      rpData() {
      if (!this.rpData) {
        //console.warn("error redPoint data", rpData);
        return;
      }
      let sArr = this.rpData.split("_ZSP_");
      let hrRedPoint,gonggaoPoint,shenpiPoint,zingjobPoint,projectJobPoint = false; //红点标识
      for (let i = 0; i < sArr.length; i++) {
        if (!Z_IsEmpty20(sArr[i])) {
          if (sArr[i].substring(0, sArr[i].indexOf(":")) === "hr") {
            //hr红点
            let jsonStr = sArr[i].substring(
              sArr[i].indexOf(":") + 1,
              sArr[i].length
            );
            let hrObj = JSON.parse(jsonStr);
            if (hrObj.total > 0) {
              hrRedPoint = true;
            }
          } else if (sArr[i].indexOf("notice:") !== -1) { // 公告
              let str = sArr[i].substring(7, sArr[i].length);
              let notice_json = JSON.parse(str);
              if (parseInt(notice_json.total) > 0) {
                  gonggaoPoint = true
              }
          } else if (sArr[i].indexOf("welcomeNotice:") !== -1) { // 公告
              let str = sArr[i].substring(14, sArr[i].length);
              let notice_json = JSON.parse(str);
              if (parseInt(notice_json.total) > 0) {
                  gonggaoPoint = true
              }
          } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "shenpi") { //审批
              let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
              if (JSON.parse(jsonStr) > 0) {
                  shenpiPoint = true
              }
          } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "zingjob") { //任务
              let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
              if (JSON.parse(jsonStr).total > 0) {
                  zingjobPoint = true
              }
          } else if (sArr[i].substring(0, sArr[i].indexOf(":")) === "projectJob") { //项目
              let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1, sArr[i].length);
              if (JSON.parse(jsonStr).total > 0) {
                  projectJobPoint = true
              }
          }
        }
      }
      this.menuData.forEach(item => {
        if (item.name === "人力资源") {
          this.$set(item, "redPoint", hrRedPoint);
        } else if (item.name === "公告") {
            this.$set(item, "redPoint", gonggaoPoint);
        } else if (item.name === "审批") {
            this.$set(item, "redPoint", shenpiPoint);
        } else if (item.name === "任务管理") {
            this.$set(item, "redPoint", zingjobPoint);
        } else if (item.name === "项目管理") {
            this.$set(item, "redPoint", projectJobPoint);
        }
      });
    }
  },
  methods: {
    verifyHotelPower(){
      let hasPower = false;
      let hotelChildPower = ["hotelReservationManagePower","hotelCheckInManagePower","hotelGuestManagePower","hotelBillManagePower","hotelStatusManagePower","hotelRoomSettingManagePower","hotelReceptionManagePower","hotelBargainingUnitManagePower", "hotelSystemSettingManagePower", "hotelReportManagePower","hotelRoomStatusManagePower","hotelMobileManagePower","hotelDealSettingManagePower"]
      hotelChildPower.forEach(power => {
        _.find(this.roleList,role => {
          if(role.resInfoVal === power){
            hasPower = true
          }
        })
      })
      return hasPower
   },
      handleMenuItem(val) {
          switch (val) {
              case "shareTimeline":
                  PSMU.debug("work bench shareTimeline")
                  this.shareWxTimeline()
                  break;
              case "shareFriend":
                  PSMU.debug("work bench shareFriend")
                  this.shareWxFriend()
                  break;
              case "发起群聊":
                  // createChat(this);
                  break;
              case "添加好友":
                  this.$router.push({ path: "", query: {} });
                  break;
          }
          this.showPopMenu = false
      },
      shareWxTimeline() {
          if (isMhApp()) {
              try{
                  let url = getInfoUrl()
                  let title = getAppName()
                  let img = window.Config.basUrl + '/ZingVue/static/images/explorer/txt.png'
                console.log(" "+title+" img:"+img+" url:"+url );
                  shareTimeline(title,url,img)
              }catch (e) {
                  console.log("shareTimeline error ", e)
              }
          }else{
              //    todo 微信显示分享指示图片
              this.$vux.toast.text('显示微信分享引导图片');
          }
      },
      shareWxFriend() {
          if (isMhApp()) {
              try{
                  let url = getInfoUrl()
                  let title = getAppName()
                  let img = window.Config.basUrl + '/ZingVue/static/images/explorer/txt.png'
                console.log(" "+title+" img:"+img+" url:"+url );
                  shareFriend(title,url,img)
              }catch (e) {
                  console.log("shareFriend error ", e)
              }
          }else{
              //    todo 微信显示分享指示图片
              this.$vux.toast.text('显示微信分享引导图片');
          }
      },
    hideMenu() {
      this.showPopMenu = false
    },
    loadRedPoint() {
      let url = '/ZingMH/ZDesk/MENHUWX/MHUser/loadCard.action'
        this.$http.post(url, {})
          .then(res => {
            if (res.data.status) {
                this.rpData = res.data.status
            }
          })
        .catch(err => {
          console.log(err)
      })
    },
    loadMyRole() {
      let that = this;
      let url = "/zingbiz/auth/role/loadMyRole";
      this.$http
        .post(url, {})
        .then(res => {
          if (res.data.success) {
            that.roleList = res.data.data
          }
        })
        .catch(error => {
            console.log(err);
        });
    },
    loadUserMsg() {
      let url = "/zingbiz/auth/user/getThisUserInfo";
      let that = this;
      this.$http
        .post(url, {})
        .then(res => {
          if (that.factCompanyId && res.data.data.companyId !== that.factCompanyId) {
              res.data.data.companyId = that.factCompanyId
          }
          that.userLogin = res.data.data;
          console.log("-----userLogin-----",that.userLogin)
          that.isFangKe = that.userLogin.companyId ? false : true
        })
        .catch(err => {
          that.isFangKe = true
          console.log(err);
        });
    },
    getAllCompanyLink() {
      let url = "/ZingMH/ZDesk/company/companyLink/getAllCompanyLink.action";
      let that = this;
      this.$http
        .post(url, {})
        .then(res => {
          console.log("-----getAllCompanyLink-----",res)
          let resData = res.data.data.data;
          let linkData = resData.map(item => {
            item.name = item.menuName;
            item.link = item.menuUrl;
            item.icon = item.iconUrl;
            item.color = "#40AFFC";
            item.role = "true";
            return item
          })
          this.menuData2 = [{
              name: "订房管理",
              link: "/hotel/roomState",
              icon: "jiudian",
              color: "#F59324",
              redPoint: false,
              role: "dingfangguanli"
            },
            {
              name: "点菜管理",
              link: "/WorkbenchChild?childItem=dinner",
              icon: "canting",
              color: "#40AFFC",
              redPoint: false,
              role: "diancaiguanli"
            }]
          Array.prototype.push.apply(this.menuData2, linkData);
        })
        .catch(err => {
          console.log(err);
        });
    },
      loadServerNumber() {
          let url = "/zingbiz/auth/org/loadServerNumber";
          let that=this
          this.$http
              .get(url)
              .then(res => {
                  that.allCompanyArr = res.data.data;
                  console.log(res);
                  this.getDatasAndGetCurrentCompany(); // 获取dropDown所需数据+当前服务号
                  var companyToolbarName=getAppName()
                  if(!PSMU.isEmt(that.defaultDatas)  && that.defaultDatas.length>0){
                      companyToolbarName=that.defaultDatas.pop()
                  }
                  document.title = companyToolbarName
                  console.log("companyToolbarName:",companyToolbarName);

                  if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.setCompanyName)==='function'){
                      MHAppapi.setCompanyName(companyToolbarName);
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
    getDatasAndGetCurrentCompany() {
      this.datas = [];
      _.each(this.allCompanyArr, v => {
        if (!_.isEmpty(v.companyName)) {
          this.datas.push({ value: v.companyName, name: v.companyName,parent: 0 });
        }
        if (v.companyId === v.myCompanyId) {
          this.defaultDatas = []
          this.defaultData = []
          this.currentCompany = v;
          this.defaultDatas.push(v.companyName)
          this.defaultData.push(v.companyName)

        }
      });
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
    confirmInput() {},
    addWorkBench() {
      /*location.href =
        "/SRender?jsLoader=otherMenu%2FotherSettingLoader&tpl=otherMenu%2FotherSetting&menuRoleKey=&menuRoleCode=&mhMenuKey_=90";*/
      this.$router.push({
        path: "/otherSettingList",
      });
    },
    gotoChildPage(val) {
      if (val.indexOf("SRender?jsLoader") >= 0) {
        //引用老项目暂时这样
        location.href = val;
      } else if (val === "tishi") {
        this.$vux.toast.text("维护中...", "bottom");
      } else if (val.indexOf("http") >= 0) {
        location.href = val;
      } else {
        this.$router.push({ path: val });
      }
    },
    handleMenuRigth(data) {
      this.showPopMenu = true

    },
    handleMenu(value) {
      let clickCompanyName = value[0] || "";
      let companyId = _.find(this.allCompanyArr, function(company) {
        return company.companyName === clickCompanyName;
      }).companyId;
      this.factCompanyId = companyId
      this.$http
        .post("/zingbiz/auth/user/updateCompany", {
          companyId: companyId || this.$store.state.ui.userInfo.companyId
        })
        .then(res => {
          this.loadServerNumber();
          this.loadMyRole()
          this.loadUserMsg()
          this.getAllCompanyLink();
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    bonusTesting() {
      if (!timeout) {
        timeout = window.setTimeout(() => {
          if (timeout) window.clearTimeout(timeout);
          bonus = 0;
          timeout = null;
        }, 2000);
      } else {
        bonus += 1;
        //                    console.log('bonus', bonus)

        if (bonus > 10) {
          console.log("bonus!");
          this.gotoChildPage("/demo/testpages");
        }
      }
    }
  }
};
</script>

<style>
.weui-grid:before {
  box-sizing: content-box;
}

/* li {
            list-style: initial;
        }
        li > a {
            color: #3a8ee6;
        } */
</style>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.test-pages {
    height: 100%;
    width:100%;
    .popupTitle {
        margin-left: 13px;
    }
    .vux-popup-header-title {
        padding-left: 44px !important;
    }
    /* 红点位置 */
    .weui-grid__icon {
        position: relative;
        width: 45px!important;
        height: 45px!important;
    }
    .vux-badge.vux-badge-dot {
        position: absolute;
        right: 0px;
        top: 0px;
    }

    .triangle-down {
        triangle-down();
    }

    .test-pages-content {
        height: calc(100% - 50px);
        overflow: hidden;

        .title {
            flex-center(row, space-between, center);
            padding: 10px 20px;

            .pc-login {
                color: #0094FF;
            }
        }

        .iconfont {
            font-size: 28px;
        }
    }

    .weui-grid {
        .weui-grid__icon {
            flex-center(row, center, center);
            width: auto;
            height: auto;
        }
    }

    .weui-grid:before {
        border: none;
    }

    .weui-grid:after {
        border: none;
    }

    .vux-search-fixed {
        top: 0 !important;
    }

    .ei-avatar-normal {
        width: 38px !important;
        height: 38px !important;
    }
}
</style>

