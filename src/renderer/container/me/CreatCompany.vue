<template>
  <div  >
     <zing-head  >
       
       
    </zing-head>
     <group>
      <x-input title="商号名称" required placeholder="请输入商号名称" v-model="companyInfo.companyName"  ></x-input>
      <x-input title="联系电话" placeholder="请输入联系电话" v-model="companyInfo.phone" ></x-input>
      <x-textarea title="简介" placeholder="请输入公司简介" :show-counter="false" :rows="3" v-model="companyInfo.companyDesc"></x-textarea>
    </group>
    <divider> </divider>
      <check-icon :value.sync="testSwitch1"> 我已阅读并接受  </check-icon> <a style="color:#4cbdefde" href="/ZingMH/zh_cn/login/userAgreement.html" >用户协议</a>
       <divider> </divider>
      <check-icon :value.sync="whetherShowSN"> 商号可被搜索  </check-icon>  
      <divider> </divider>
    <flexbox style="position: absolute;bottom: 0px;">
        <flexbox-item>
          <x-button   @click.native="cleanForm" style="background-color: #40affc; color:#fff">重置</x-button>
        </flexbox-item>
        <flexbox-item style="margin-left:0px">
          <x-button   @click.native="registerCompanyName" style="background-color: #ff8000;color:#fff"> 注册</x-button>
        </flexbox-item>
    </flexbox>

    <toast v-model="propSwitch" type="text">{{errorMsg}}</toast>
  </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import Avatar from "components/avatar/Avatar";
import { mapState, mapMutations } from "vuex";
var format = require("date-fns/format");
import { createChat } from "../../utils/fn";
import { config } from "../../utils/configDev";
import _ from "lodash";
import {
  Search,
  Grid,
  GridItem,
  GroupTitle,
  XDialog,
  AlertModule,
  Confirm,
  Group,
  XInput,
  Divider,
  XSwitch,
  Cell,
  XTextarea,
  Flexbox,
  FlexboxItem,
  XButton,
  CellBox,
  Toast,
  CheckIcon,
  CellFormPreview,
  TransferDomDirective as TransferDom
} from "vux";
export default {
  name: "ME",
  directives: {
    TransferDom
  },
  components: {
    AlertModule,
    ZingHead,
    Scroll,
    Avatar,
    Search,
    Divider,
    Flexbox,
    XButton,
    FlexboxItem,
    Grid,
    GridItem,
    GroupTitle,
    XDialog,
    Confirm,
    XInput,
    XTextarea,
    XSwitch,
    CheckIcon,
    Group,
    Toast,
    Cell,
    CellBox,
    CellFormPreview
  },
  data() {
    return {
      propSwitch: false,
      companyInfo: {
        companyName: "",
        companyDesc: "",
        phone: ""
      },
      testSwitch1: false,
      whetherShowSN: true,
      isRegCusSucc: false, // 是否创建成功服务号
      isExist: false
    };
  },
  methods: {
    cleanForm() {
      this.companyInfo.companyDesc = "";
      this.companyInfo.companyName = "";
      this.companyInfo.phone = "";
      this.testSwitch1 = false;
      this.whetherShowSN = true;
    },
    registerCompanyName() {
      if (
        this.companyInfo.companyName == "" ||
        _.isUndefined(this.companyInfo.companyName)
      ) {
        this.propSwitch = true;
        this.errorMsg = "请输入公司名称";
        return;
      }
      if (
        this.companyInfo.phone == "" ||
        _.isUndefined(this.companyInfo.phone)
      ) {
        this.propSwitch = true;
        this.errorMsg = "请输入手机号";
        return;
      }
      if (this.testSwitch1 == false) {
        this.propSwitch = true;
        this.errorMsg = "请接收用户协议";
        return;
      }
      this.$http
        .get("/ZingMH/ZDesk/MENHUWX/Company/checkRegCompany.action", {
          params: {
            companyName: this.companyInfo.companyName,
            companyDesc: this.companyInfo.companyDesc
          }
        })
        .then(res => {
          debugger;
          let retcode = res.data.retcode;
          if (retcode === -5) {
            this.$vux.toast.text("此商号名称已存在，请重新输入！");
            // showBottomPrompt("该服务名称已存在，请重新输入!", 2000);
          } else if (retcode === -4) {
            this.$vux.toast.text("商号名称不可用，请重新输入");
            // showBottomPrompt("服务名称不可用，请重新输入!", 2000);
          } else if (retcode === -2) {
            this.$vux.toast.text("简介不可用，请重新输入!");
            // showBottomPrompt("简介不可用，请重新输入!", 2000);
          } else if (retcode === 0) {
            // showBottomPrompt("正在创建商号，请耐心等待...");

            this.creatCompanyId();
            // let link =
            //   "/SRender?jsLoader=login%2FregCusRedirectLoader&tpl=login%2FregCompanyRedirect&wid=gh_7cbc11428683&companyName=zinglabs2&companyDesc=牛逼的公司不需要解释&phone=82893030&whetherShowSN=true&appflag=app";
          }
        })
        .catch(err => {});
    },
    initDateAction(companyId) {
      var currentDate = new Date();
      let stringDate = format(currentDate, "MMDDHHmm");
      this.$http
        .get("/zingbiz/hotel/hotelNew/initDefaultConfig", {
          params: {
            statement: "V4_1_createHotelDefaultConfig_anfei_2018" + stringDate,
            companyId: companyId
          }
        })
        .then(res => {
          debugger;
          if (this.isRegCusSucc) {
            this.$router.push({
              name: "Workbench"
            });
          }
        })
        .catch(err => {});
    },
    createORGzspallusers(companyId) {
      console.log("創建group：" + companyId);
      this.$http
        .get("/NCard/NCardService?ac=loadTalkInfo", {
          params: {
            companyId: companyId,
            did: "ORGzspallusers" + companyId,
            type: "ORG"
          }
        })
        .then(res => {
          console.log("創建群組成功");
        })
        .catch(err => {});
    },
    createNotice(companyId, companyName) {
      console.log("創建Notice：" + companyId);
      this.$http
        .get("/zingbiz/notice/initWelcomeNotice", {
          params: {
            companyId: companyId,
            companyName: companyName
          }
        })
        .then(res => {
          console.log("創建Notice成功");
        })
        .catch(err => {});
    },
    creatCompanyId() {
      let authCode = this.$route.query.authCode;

      let param = {
        companyName: this.companyInfo.companyName,
        companyDesc: this.companyInfo.companyDesc,
        wid: "gh_7cbc11428683",
        phone: this.companyInfo.phone,
        authCode: authCode
      };
      if (this.whetherShowSN) {
        param.whetherShowSN = true;
      }
      this.$http
        .get("/ZingMH/ZDesk/MENHUWX/Company/regCus.action", {
          params: param
        })
        .then(res => {
          let retCode = res.data.retcode;
          let companyId = res.data.companyId;

          let companyName = this.companyInfo.companyName || "";

          switch (retCode) {
            case "-4000":
            case "-1":
            case "-1100":
            case "-3001":
            case "-2005":
              break;
            case "0":
            case "3001":
              this.isRegCusSucc = true;
              break;
            case "-3002":
              this.isExist = true;
              break;
            default:
              this.$vux.loading.show({
                text: "Loading",
                delay: 1e3
              });
              setTimeout(() => {
                this.$vux.loading.hide();
              }, 5000);
              this.isRegCusSucc = true;
              this.initDateAction(companyId);
              this.createORGzspallusers(companyId);
              this.createNotice(companyId, companyName);
              if (this.isRegCusSucc) {
                this.$router.push({
                  name: "Workbench?reload=true"
                });
              }
          }
          if (this.isRegCusSucc) {
            this.$router.push({
              name: "Workbench"
            });
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    cardUrl() {
      return this.$store.state.ui.userInfo.cardUrl;
    },
    realName() {
      return this.$store.state.ui.userInfo.RealName;
    }
  },
  created() {}
};
</script>
 
 <style scoped>
body {
  background-color: #f5f5f5;
}
</style>
 