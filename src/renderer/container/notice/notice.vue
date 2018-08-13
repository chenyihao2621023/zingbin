<template>
  <div class="notice" style="height: 100%">
    <zing-head :title="'公告'">
      <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="hideSearch('icon')"></i>
                </span>
        <dropdown :data="dropDownMenu" :placementXAbs="-22" trigger="click" placement="bottomRight"
                  @item-click="handleMenu">
          <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                        <span class="header-jiahao">
                            <i class="iconfont icon-gengduo"></i>
                        </span>
          </a>
        </dropdown>
      </div>
    </zing-head>
    <div v-show="isShowSearch">
      <search
        class="search"
        @on-cancel="hideSearch"
        @on-change="getResultSearch"
        @on-submit="onSubmitSearch"
        ref="noticeSearch"></search>
    </div>
    <!--<search
       ref="search"
       class="search"
       :searchFlag="isShowSearch"
       @cancelInput ="hideSearch"
       @confirmInput="onSubmitSearch"
    ></search>-->
    <div>
      <tab>
        <tab-item selected @on-item-click="switchTab('1')">未读</tab-item>
        <tab-item @on-item-click="switchTab('0')">已读</tab-item>
      </tab>
    </div>
    <div class="scroll-list-wrap" :style="{ height: 'calc(100% - 95px)',overflow:'auto',background:'#F8F8F8' }">
      <div v-if="noticeList.length > 0 ">
        <swipeout>
          <swipeout-item v-if="item.isShow" :disabled="item.author === userLogin.cardUrl ? false : true"
                         class="gridCard"
                         v-for="(item,index) in noticeList" :key="index" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="delNotice(item)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <GridCard>
                <div slot="cardLeft" class="left" style="width: 80%;" @click="lookNotice(item)">
                  <avatar class="imgLeft" shape="square" size="large" :src="item.coverUrl"></avatar>
                  <div class="left-wrapper">
                    <p class="m5 left-wrapper-title"
                       style="font-weight: 700;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                      {{item.title}}
                    </p>
                    <p class="m5 left-wrapper-desc" style="color:#888888 !important;width:80%;">{{item.releaseTime + " "
                      + item.releasePeople}}</p>
                  </div>
                </div>
              </GridCard>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
      <ul v-else>
        <div class="no-data-style">
          还没公告信息
        </div>
      </ul>
    </div>
    <popup v-model="popupSaveNotice" height="100%" width="100%" position="right">
      <popup-header v-if="noticeData.noticeType === '0'" :left-text="'取消'" :right-text="'发布公告'" :title="'公告'"
                    :show-bottom-border="false"
                    @on-click-left="popupSaveNotice = false" @on-click-right="saveNoticeFun">
      </popup-header>
      <popup-header v-if="noticeData.noticeType === '1'" :left-text="'取消'" :right-text="'保存'" :title="'欢迎公告'"
                    :show-bottom-border="false"
                    @on-click-left="popupSaveNotice = false" @on-click-right="saveNoticeWelcomeFun">
      </popup-header>
      <div style="height: calc(100% - 44px);overflow-y: auto;background: #fff;">
        <group label-width="4.5em">
          <x-input title="公告标题" v-model="noticeData.title"
                   placeholder="请输入标题" class="fontColor"></x-input>
          <x-input title="作者" v-model="noticeAuthorName"
                   :style="noticeData.noticeType === '1'?{borderBottom: '1px solid #d9d9d9'}:{}"
                   placeholder="" vclass="fontColor"></x-input>
          <cell v-if="noticeData.noticeType === '0'" style="border-bottom: 1px solid #f1f1f1;" :value="orgName"
                @click.native="chooseOrg" title="发送范围" is-link></cell>
          <div style="margin-left: 13px;float: left;">封面图片</div>
          <image-picker
            :files="imageList"
            :companyId="userLogin.companyId"
            :selectable="imageList.length<1"
            multiple
            @onChange="fliesChange"
          />
        </group>
        <w-editor :companyId="userLogin.companyId" :editorData="editorData" @getEditorHtml="getEditorHtml"></w-editor>
      </div>
    </popup>
    <org-member-picker :showTab="['colleague']" ref="picker" :initialSelected="insertNew" :showPicker="showPersonPicker"
                       @picked="onPicked" @abort="onPickAbort"></org-member-picker>
  </div>
</template>

<script>
  import {
    Tab,
    Selector,
    TabItem,
    XDialog,
    ButtonTab,
    ButtonTabItem,
    CheckIcon,
    Search,
    Popup,
    PopupHeader,
    Group,
    Cell,
    XInput,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from "vux";
  /*import search from '@/components/search/search';*/
  import GridCard from "@/components/gridcard/GridCard";
  import ZingHead from "@/components/zingHead/ZingHead";
  import Dropdown from '@/components/dropdown/Dropdown';
  import WEditor from '@/components/wangEditor/WEditor';
  import Avatar from "@/components/avatar/Avatar";
  import ImagePicker from 'components/imagepicker/ImagePicker';
  import { isPc, getThumbUrl } from '@/utils/fn'
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";

  export default {
    name: "notice",
    components: {
      GridCard,
      Avatar,
      ZingHead,
      Tab,
      TabItem,
      Selector,
      XDialog,
      Dropdown,
      Group,
      XInput,
      Cell,
      Swipeout,
      SwipeoutItem,
      ButtonTab,
      ButtonTabItem,
      CheckIcon,
      Search,
      Popup,
      PopupHeader,
      ImagePicker,
      OrgMemberPicker,
      SwipeoutButton,
      WEditor
    },
    data: () => ({
      //搜索
      isShowSearch: false,
      showPersonPicker: false,
      searchData: "",
      orgName: "",
      isPc: isPc(),
      dropDownMenu: [{ content: "发布公告" }, { content: "编辑欢迎公告" }],
      noticeList: [],
      insertNew: [],
      popupSaveNotice: false,
      imageList: [],
      userLogin: {},
      noticeAuthorName: "",
      noticeData: {},
      status: "1",//查询条件是否已读
      noticeWelcomeData: {},
      allCompanyArr: [],
      companyName: [],
      editorData:"",
      editorObj:"",
    }),
    watch: {
      searchData: {
        handler(curVal, oldVal) { //
          for (let i = 0; i < this.noticeList.length; i++) {
            if (this.noticeList[i].title.indexOf(curVal) >= 0) {
              this.noticeList[i].isShow = true
            } else {
              this.noticeList[i].isShow = false
            }
          }
        },
        deep: true
      }
    },
    created() {
      this.loadUserMsg()
    },
    methods: {
      switchTab(flag) {
        this.status = flag
        this.initNotice();
      },
      initNotice(pageNumber) { //selecteWelcometNotice
        let self = this;
        let url = "/zingbiz/notice/selectNotice";
        let param = {
          pageNumber: 0,
          pageSize: 5000,
          status: this.userLogin.cardUrl + this.status
        };
        this.$http
          .get(url, { params: param })
          .then(res => {
            if (res.data.success && res.data.data) {
              console.log("=========", res.data.data.data)
              if (res.data.data.data) {
                res.data.data.data.forEach(item => {
                  item.isShow = true
                  item.coverUrl = getThumbUrl(item.coverUrl, 200, 200, "/JsLib/dist/app/images/Notice.png", false)
                })
                self.noticeList = res.data.data.data;
              }
            }
          })
          .catch(error => {
            console.log("error===>", error)
          })
      },
      initWelcometNotice() {
        let self = this;
        let url = "/zingbiz/notice/selecteWelcometNotice";
        let param = {};
        this.$http
          .get(url, { params: param })
          .then(res => {
            if (res.data.success && res.data.data) {
              if (res.data) {
                self.noticeWelcomeData = res.data.data.data.length > 0 ? res.data.data.data[0] : {}
                console.log("======noticeWelcomeData=============", self.noticeWelcomeData)
              }
            }
          })
          .catch(error => {
            console.log("error===>", error)
            //self.$vux.toast.text("加载数据失败，请重试", 'bottom')
          })
      },
      loadServerNumber() {
        let url = "/zingbiz/auth/org/loadServerNumber";
        let that = this
        this.$http
          .get(url)
          .then(res => {
            that.allCompanyArr = res.data.data;
            that.allCompanyArr.forEach(item => {
              if (item.id && item.id === that.userLogin.companyId) {
                that.companyName = item.companyName
              }
            })
          })
          .catch(err => {
            console.log(err);
          });
      },
      loadUserMsg() {
        let url = "/zingbiz/auth/user/getThisUserInfo";
        let that = this;
        this.$http
          .post(url, {})
          .then(res => {
            that.userLogin = res.data.data;
            that.noticeAuthorName = that.userLogin.cardUrlName
            this.initNotice()
            this.initWelcometNotice()
            this.loadServerNumber()
          })
          .catch(err => {
            console.log(err);
          });
      },
      /* 搜索方法 */
      hideSearch(icon) {
        if (icon === "icon") {
          this.isShowSearch = !this.isShowSearch
        } else {
          this.isShowSearch = false
        }
        for (let i = 0; i < this.noticeList.length; i++) {
          this.noticeList[i].isShow = true
        }
      },
      getResultSearch(val) { //搜索输入
        let item = val.replace(/ /g, '')
        this.searchData = item
      },
      onSubmitSearch() { //
      },
      delNotice(item) {
        let that = this
        let url = "/zingbiz/notice/delByIds"
        let param = {
          noticeId: item.noticeId
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
                  that.initNotice();
                  that.$vux.toast.show({
                    text: "删除成功", type: "success", onHide() { //
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
      handleMenu(data) {
        this.popupSaveNotice = true
        this.editorData = ""
        this.orgName = ""
        this.imageList = []
        this.noticeData = {
          title: "",//标题
          coverUrl: "",//封面
          textContent: "",//正文
          notifyPeople: "",//接收人以空格分割
          roleIds: "",//角色id
          releasePeople: "",
        }
        if (data.content === "发布公告") {
          this.noticeData.noticeType = "0"
          this.noticeAuthorName = this.userLogin.cardUrlName
        } else if (data.content === "编辑欢迎公告") {
          this.noticeData.noticeType = "1"
          if (this.noticeWelcomeData && this.noticeWelcomeData.noticeId) {
            this.noticeAuthorName = this.noticeWelcomeData.releasePeople
            this.noticeData.title = this.noticeWelcomeData.title
            this.editorData = this.noticeWelcomeData.textContent
            this.imageList = []
            if (this.noticeWelcomeData.coverUrl && this.noticeWelcomeData.coverUrl !== "/JsLib/dist/app/images/Notice.png") {
              this.imageList.push({
                url: this.noticeWelcomeData.coverUrl
              })
            }
          } else {
            this.noticeData.title = "入职通知"
            this.editorData = "(XXX)欢迎加入" + this.companyName
            this.noticeAuthorName = this.companyName
          }
        }
      },
      chooseOrg() {
        this.showPersonPicker = true;
      },
      onPickAbort() {
        this.showPersonPicker = false;
      },
      getEditorHtml(data) {
        this.editorObj = data
      },
      onPicked(list) {
        console.log("=============list================", list)
        this.showPersonPicker = false;
        let name = []
        let cardUrls = []
        let stateList = []
        let roleIds = []
        cardUrls.push(this.userLogin.cardUrl)
        stateList.push(this.userLogin.cardUrl + "1")
        list.forEach(item => {
          if (item.type && item.type === "user") {
            name.push(item.userName)
            if (cardUrls.join(" ").indexOf(item.cardUrl) < 0) {
              cardUrls.push(item.cardUrl)
              stateList.push(item.cardUrl + "1")
            }
          }
          if (item.recordType && item.recordType === "org") {
            name.push(item.title)
            let userList = item.userList.trim().split(" ")
            userList.forEach(card => {
              if (card.indexOf("#") >= 0) {
                if (cardUrls.join(" ").indexOf(card.split("#")[1]) < 0) {
                  cardUrls.push(card.split("#")[1])
                  stateList.push(card.split("#")[1] + "1")
                }
              }
            })
          }
          if (item.type && item.type === "role") {
            name.push(item.title)
            if (roleIds.join(" ").indexOf(item.id) < 0) {
              roleIds.push(item.id)
            }
          }
        })
        this.noticeData.notifyPeople = cardUrls.join(" ")
        this.noticeData.status = stateList.join(" ")
        this.noticeData.roleIds = roleIds.join(" ")
        this.orgName = name.join(" ")
      },
      fliesChange(files, operationType, index) {
        let images = []
        if (operationType === "add") {
          for (let i = 0; i < files.length; i++) {
            images.push(files[i].url)
            //files[i].url = getThumbUrl(files[i].url, 200, 200, "/ZingVue/static/images/ysImg.png", false);
          }
          this.$nextTick(() => {
            this.imageList = files;
          })
          this.noticeData.coverUrl = images.join(" ")
        }
        if (operationType === "remove") {
          for (let i = 0; i < files.length; i++) {
            images.push(files[i].url)
            //files[i].url = getThumbUrl(files[i].url, 200, 200, "/ZingVue/static/images/ysImg.png", false);
          }
          this.$nextTick(() => {
            this.imageList = files;
          })
          this.noticeData.coverUrl = images.join(" ")
        }
      },
      saveNoticeFun() {
        let that = this
        let textContent = this.editorObj
        if (!this.noticeData.title) {
          this.$vux.toast.text("公告标题不能为空", 'bottom')
          return false
        }
        if (!this.noticeData.notifyPeople && !this.noticeData.roleIds) {
          this.$vux.toast.text("请选择接收人员", 'bottom')
          return false
        }
        if (!this.noticeAuthorName.trim()) {
          this.$vux.toast.text("请填写发布人", 'bottom')
          return false
        }
        if (!this.imageList.length) {
          this.noticeData.coverUrl = "/JsLib/dist/app/images/Notice.png"
        }
        if (!textContent.trim()) {
          this.$vux.toast.text("请填写正文内容", 'bottom')
          return false
        }
        let url = "/zingbiz/notice/addNotice";
        this.noticeData.textContent = textContent
        this.noticeData.releasePeople = this.noticeAuthorName
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要发布公告吗?',
          onCancel() {
            that.$vux.confirm.hide();
          },
          onConfirm() {
            that.$http
              .post(url, that.noticeData)
              .then(res => { //加载一个仓库数据dinner/dinnerManage
                if (res.data.success) {
                  that.popupSaveNotice = false
                  that.loadUserMsg()
                  that.$vux.toast.show({
                    text: "发布成功", type: "success", onHide() { //
                    }
                  })
                } else {
                  that.$vux.toast.show({
                    text: "发布失败", onHide() { //
                    }
                  })
                }
              });
          }
        })
      },
      saveNoticeWelcomeFun() {
        let that = this
        let textContent = this.editorObj
        if (!this.noticeData.title) {
          this.$vux.toast.text("公告标题不能为空", 'bottom')
          return false
        }
        if (!this.noticeAuthorName.trim()) {
          this.$vux.toast.text("请填写发布人", 'bottom')
          return false
        }
        if (!this.imageList.length) {
          this.noticeData.coverUrl = "/JsLib/dist/app/images/Notice.png"
        }
        if (!textContent.trim()) {
          this.$vux.toast.text("请填写正文内容", 'bottom')
          return false
        }
        let url = "/zingbiz/notice/addWelcomeNotice";
        this.noticeData.textContent = textContent
        this.noticeData.releasePeople = this.noticeAuthorName
        this.$http
          .post(url, that.noticeData)
          .then(res => { //加载一个仓库数据dinner/dinnerManage
            if (res.data.success) {
              that.popupSaveNotice = false
              this.initWelcometNotice()
              that.$vux.toast.show({
                text: "保存成功", type: "success", onHide() { //
                }
              })
            } else {
              that.$vux.toast.show({
                text: "保存失败", onHide() { //
                }
              })
            }
          });
      },
      lookNotice(item) {
        console.log(item,'===item');
        this.$router.push({
          path: "/notice/noticeDetails",
          query: { noticeId: item.noticeId,author:item.author }
        })
      },
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .menu {
    min-height: 40px;
    line-height: 40px;
  }

  .search {
    position: relative !important;
    z-index: 100;
  }

  .gridCard {
    //height: 80px;
    background: white;
    margin-bottom: 10px;
    .imgLeft {
      height 60px;
      width: 60px
    }
    .left-wrapper {
      height: 60px;
      width: 50%;
    }
    .m5 {
      margin-bottom 15px;
      padding-top: 5px;
    }

  }

  .vux-button-group > a.vux-button-tab-item {
    background: #fdfdfd;
    color: #999;
    border-right: 1px solid #bbecba;
  }

  .notice {

  }

  .no-data-style {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: #ff8000;
  }
</style>
<style>
  .weui-cell_access .weui-cell__ft {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .w-e-text {
    overflow-y: auto !important;
  }

  .vux-tab {
    background: #F8F8F8
  }

  .weui-search-bar__cancel-btn {
    color: #FF8000 !important;
  }

  .weui-dialog__btn_primary {
    color: #FF8000 !important;
  }

  .vux-popup-header-right {
    color: #FF8000 !important;
  }
</style>
