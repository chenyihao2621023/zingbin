<template>
  <div class="business-introduction">
    <zing-head class="business-introduction-head" title="商号介绍"></zing-head>
    <div class="business-introduction-main">
      <div class="business-introduction-main-header">
        <div class="business-introduction-main-header-bj">
          <x-button @click.native="unrelated" text="不再关注" type="primary" mini></x-button>
          <span @click="updateServiceDesc">{{bjBtn}}</span>
        </div>
        <img :src="imgSrc" alt="商号头像">
      </div>
      <div class="business-introduction-main-cont">
        <flexbox orient="vertical">
          <flexbox-item>
            <h5>商号名称</h5>
            <x-input v-model="companyName" :disabled="disabled"></x-input>
          </flexbox-item>
          <flexbox-item>
            <h5>账户主体</h5>
            <x-input v-model="companyCertificate" :disabled="disabled"></x-input>
          </flexbox-item>
          <flexbox-item>
            <h5>商号介绍</h5>
            <x-textarea :autosize="true" v-model="companyDesc" :disabled="disabled"></x-textarea>
          </flexbox-item>
          <flexbox-item>
            <h5 style="display: flex;justify-content: space-between">
              <span>联系电话</span>
              <span style="color: #40b7d4" @click="addTelModal = true">添加</span>
            </h5>
            <x-input title="客服电话" v-for="(phoneItem,index) in phoneList" :key="index" v-model="phoneItem.phoneNumber"
                     :disabled="disabled"></x-input>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div>
      <sidebar
        :showFind="true"
        :showDownloadIcon="false"
        :showCloudIcon="false"
        @goFind="goAllFind"
        @shareMessage="onShareMessage"
        @shareTimeline="shareTimeline"
        @shareFriend="shareFriend">
      </sidebar>
      <div v-transfer-dom>
        <confirm v-model="addTelModal" show-input :title="'添加联系方式'"
                 @on-cancel="addTelModal = false">
        </confirm>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from "@/components/sidebar/Sidebar.vue"
  import ZingHead from "@/components/zingHead/ZingHead";
  import Qs from "qs"
  import { shareMessage } from "../../utils/fn"
  import {
    XButton,
    Group,
    Flexbox,
    FlexboxItem,
    XInput,
    XTextarea,
    Confirm,
    TransferDomDirective as TransferDom
  } from "vux"

  export default {
    name: "BusinessIntroduction",
    directives: {
      TransferDom
    },
    components: {
      ZingHead, XButton, Group, Flexbox, FlexboxItem, Sidebar, XInput, XTextarea, Confirm
    },
    data() {
      return {
        bjBtn: '编辑',
        imgSrc: "/ImgRender?imgpath=/checkJpg/company/10003/company52589645100001.jpg&thumb=200x200&errpath=/JsLib/dist/app/images/weicard.jpg&time=9999.9999&type=.jpg",
        disabled: true,
        phoneList: [],
        companyId: "",
        companyName: "英商",
        saveCompanyName: "",
        companyDesc: "",
        saveCompanyDesc: "",
        companyCertificate: "",
        saveCompanyCertificate: "",
        addTelModal: false,
      }
    },
    created() {
      this.companyId = this.$route.query.companyId || "company59915700000000101";
      this.init()
    },
    methods: {
      unrelated() {
        let that = this;
        this.$vux.confirm.show({
          title: '取消关注',
          content: '是否确认取消关注的商号?',
          onConfirm() {
            let url = "/ZingMH/ZDesk/MENHUWX/Company/delAttentionCompany.action";
            let params = {
              companyId: this.companyId
            };
            that.$http.post(url, Qs.stringify(params)).then(res => {
              console.log(res);
            })
          }
        })
      },
      //  新页面保存改为走一个接口(手机号不能添加只能修改)   老的走多个
      //更新
      updateServiceDesc() {
        if (this.bjBtn === "保存") {
          if (!this.companyCertificate.length || !this.companyDesc.length || !this.companyName.length) {
            this.$vux.toast.show("修改内容不能为空");
            return
          }
          if ((this.saveCompanyName === this.companyName) && (this.companyDesc === this.saveCompanyDesc) && (this.companyCertificate === this.saveCompanyCertificate)) {
            this.disabled = true;
            this.bjBtn = "编辑";
            return;
          }
          console.log(this.phoneList);
          let url = "/ZingMH/ZDesk/MENHUWX/Company/updateServiceDescByCompanyId.action";
          let params = {
            companyId: this.companyId,
            companyCertificate: this.companyCertificate,
            companyDesc: this.companyDesc,
            companyName: this.companyName
          };
          this.$http
            .post(url, params)
            .then(res => {
              console.log(res);
              this.bjBtn = "编辑";
              this.disabled = true;
              this.$vux.toast.show("修改成功");
            })
        } else {
          this.disabled = false;
          this.bjBtn = "保存";
        }
      },
      onShareMessage() {
        let link = `/ZingVue/index.html#/businessIntroduction?companyId=${this.companyId}`
        let title = this.saveCompanyName;
        let content = PSMU.html2txt(this.saveCompanyDesc)
        let logoUrl = '/ZingVue/static/images/explorer/txt.png'
        shareMessage(this, link, title, content, logoUrl)
      },
      shareTimeline() {

      },
      shareFriend() {

      },
      goAllFind() {
        this.$router.push({
          path: '/find/allFindRecord',
          query: {
            companyId: this.companyId
          }
        })
      },
      //获取数据
      getCompanyDataByCompanyId() {
        let url = "/ZingMH/ZKM/MENHUWX/Company/getCompanyDataByCompanyId.action";
        return this.$http.post(url, Qs.stringify({
          companyId: this.companyId
        }))
      },
      getPhoneInfoByCompanyId() {
        let url = "/ZingMH/ZKM/MENHUWX/MHPhoneInfo/getPhoneInfoByCompanyId.action";
        return this.$http.post(url, Qs.stringify({
          companyId: this.companyId
        }))
      },
      init() {
        this.$http.all([
          this.getCompanyDataByCompanyId(),
          this.getPhoneInfoByCompanyId()
        ]).then(this.$http.spread((getCompanyDataByCompanyId, getPhoneInfoByCompanyId) => {
          if (getCompanyDataByCompanyId.data.success) {
            let companyData = getCompanyDataByCompanyId.data.data[0];
            this.imgSrc = `/ImgRender?imgpath=${this.headimgurl}.jpg&thumb=200x200&errpath=/JsLib/dist/app/images/weicard.jpg&time=9999.9999&type=.jpg`;
            this.companyName = companyData.companyName;
            this.saveCompanyName = JSON.parse(JSON.stringify(this.companyName));
            this.companyCertificate = companyData.companyCertificate;
            this.saveCompanyCertificate = JSON.parse(JSON.stringify(this.companyCertificate));
            this.companyDesc = companyData.companyDesc;
            this.saveCompanyDesc = JSON.parse(JSON.stringify(this.companyDesc));
          }
          if (getPhoneInfoByCompanyId.data.success) {
            this.phoneList = getPhoneInfoByCompanyId.data.data;
          }
        })).catch(error => {
          console.log(error);
        })
      }
    }
  }
</script>
<style>
  .business-introduction-main-header-bj .weui-btn {
    margin: 0 !important;
  }

  .business-introduction .weui-cell__bd input {
    text-align: left !important;
  }

  .business-introduction .weui-cell__bd textarea {
    text-align: left !important;
  }

  .business-introduction-main-cont .weui-cell {
    padding: 10px 2px !important;
  }

  .business-introduction .vux-flexbox-item {
    margin-top: 0 !important;
  }

  body .weui-dialog__hd {
    border-bottom: none;
  }
</style>
<style scoped lang="stylus">
  @import '../../assets/stylus/variable.styl';
  .business-introduction
    display flex
    flex-direction column
    width 100%
    height 100%
    &-head
      flex-shrink 0
    &-main
      padding 3% 13px 10%
      flex-grow 1
      overflow-y auto
      &-header
        &-bj
          display flex
          justify-content space-between
          span
            line-height 30px
            color #40b7d4
            font-size 16px
        img
          display block
          margin 5% auto
          border-radius 50%
      &-cont
        h5, p
          font-size 14px
          padding 5px
          line-height 20px
        h5
          background #f5f5f5
</style>
