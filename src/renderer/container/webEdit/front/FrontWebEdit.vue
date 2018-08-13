<template>
  <div class="web-edit-show">
    <div @click="clickMask" v-show="showMask"
         style="position: fixed;top: 90px;left: 0;right: 0;bottom: 0;z-index:99;background: rgba(0,0,0,0);"></div>
    <div>
      <zing-head title="网站编辑">
        <span slot="header-right" class="head-jiahao">
            <i class="iconfont icon-gengduo" @click="rightPopup(true)"></i>
        </span>
      </zing-head>
    </div>
    <div v-if="menuList.length" class="tab">
      <ul class="tab-list">
        <li class="li li2" v-for="(row,index) in menuList" :key="index" @click="navClick(row,$event)">
          <span class="text">{{row.content}}</span>
          <div class="dropdownWrapper" v-show="row.active">
            <div class="triangleIcon"></div>
            <ul class="dropdown" v-if="row.menuList && row.menuList.length">
              <li v-for="(item, index) in row.menuList" :key="index" @click="subMenuClick(item,$event)">
                {{item.content}}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <graphic-list-comp :isRelease="'1'" v-show="!isUrlModal" :type="'1'" :companyId="companyId"
                       :jumpToWhere="detail"></graphic-list-comp>
    <div class="popupDialog">
      <popup v-model="rightPopupModal" position="right"
             :popup-style="{'max-width': '80%', width: '75%', height: '100%','z-index':5000,backgroundColor:'#fff'}">
        <div class="left-menu">
          <i class="iconfont icon-guanbi" @click="rightPopup(false)"></i>
          <div class="left-menu-item head-img" @click="imageUpload">
            <img class="left-menu-item-img" :src="bindingData.data[0].headimgurl" alt="">
            <!--<image-picker :files="imageList" :selectable="imageList.length<1" :multiple="false" :companyId="companyId"-->
            <!--@onChange="imageChange" :removable="false"/>-->
            <i class="iconfont icon-youjiantou"></i>
          </div>
          <div class="left-menu-item" @click="getCompanyTag">分类</div>
          <div v-if="bindingData.isBind ==='false'" class="left-menu-item" @click="isBing()">申请绑定</div>
          <div v-if="bindingData.isBind ==='true'" class="left-menu-item" @click="applyForBing()">入职扫码绑定</div>

          <div class="left-menu-item" @click="goCompanyDetail()">商号介绍</div>
          <div class="left-menu-item" @click="goInvoicePage()">发票信息</div>
          <div class="left-menu-item" @click="showQRCode()">二维码名片</div>
          <div v-if="bindingData.isAttention ===true" class="left-menu-item" @click="cancelFocus()">不在关注</div>
          <div v-if="bindingData.isAttention ===false" class="left-menu-item" @click="confirmFocus()">添加关注</div>
          <div class="left-menu-item" @click="shareClick">发送给朋友</div>
        </div>
      </popup>
      <x-dialog v-model="QRModal" :dialog-style="{'max-width': '90%', width: '90%'}" mask-z-index="5000"
                hide-on-blur="true">
        <img style="width: 290px; height: 300px;" :src="qrUrl" alt="">
        <p>让你的小伙伴用微信扫一扫 <br>
          就能直接关注了。快来试试吧</p>
        <p style="height: 30px;line-height: 30px; font-size: 20px" @click="QRModal = false;">点我返回</p>
      </x-dialog>
      <web-edit-class :selected="tagName" :show="selectClazzModal" @cancel="selectClazzModal=false" @confirm="confirmClazz">
      </web-edit-class>

      <popup v-model="isUrlModal" position="right" :popup-style="{width: '100%', height: '100%',}">
        <div class="popup-iframe">
          <zing-head :isComeBack="false" @doSome="isUrlModal = false"></zing-head>
          <div class="iframe">
            <iframe class="iframe" :src="jumpUrl" frameborder="0"></iframe>
          </div>
        </div>
      </popup>

      <popup v-model="getHistoryModal" position="right" :popup-style="{width: '100%', height: '100%',}">
      </popup>

      <div class="share">
        <popup v-model="popupTop" position="top" @on-hide="popupTop = false">
          <div class="position-vertical-demo">
            <img width="100%" src="/ZingVue/static/images/follow1.png"/>
          </div>
        </popup>
        <popup v-model="showShare" @on-hide="showShare = false" style="z-index: 1002">
          <div class="popupShare" style="text-align: center;">
            <img height="80px" width="80px" src="/ZingVue/static/images/ysImg.png" @click="onShareMessage"/>
            <img v-if="!isPc" height="80px" width="80px" src="/ZingVue/static/images/wxImg.png" @click="shareFriend"/>
            <img v-if="!isPc" height="80px" width="80px" src="/ZingVue/static/images/pengyouquan.png" @click="shareTimeline"/>
          </div>
        </popup>
      </div>
    </div>
  </div>
</template>
<script>
  import ImagePicker from '@/components/imagepicker/ImagePicker';

  import Sidebar from "../../../components/sidebar/Sidebar.vue";
  import { shareMessage,isMhApp,isPc,isWeiXin, } from '@/utils/fn';
  import { shareFriend,shareTimeline } from '@/utils/wx';

  // import Uploader from "@/utils/upload";
  // const fileUploader = Uploader.create();

  import ZingHead from "@/components/zingHead/ZingHead"
  import Dropdown from '@/components/dropdown/Dropdown'
  import GraphicListComp from "../components/GraphicListComp"
  import webEditClass from "./webEditClass"
  import { Tab, TabItem, Popup, XDialog, PopupHeader } from 'vux';

  export default {
    name: "FrontWebEdit",
    components: {
      ZingHead, Tab, TabItem, Dropdown, Popup, XDialog, GraphicListComp, webEditClass, ImagePicker, PopupHeader,Sidebar
    },
    data() {
      return {
        companyId: "",
        rightPopupModal: false,  //右侧破婆婆控制器
        headimgurl:"",
        QRModal: false,          //二维码显示控制器
        qrUrl: '',               //二维码url
        menuList: [],           //导航菜单
        showMask: false,         //遮罩
        //分类
        selectClazzModal: false,
        tagName:"",

        tuwenList: [],           //图文列表-----暂未用----,引用了graphicListComp组件,
        bindingData: {          //绑定相关的数据
          data:[{
            headimgurl:""
          }],
        },

        //自定义链接跳转参数
        jumpUrl: "",
        isUrlModal: false,

        //根据menuId获取图文参数
        getHistoryModal: false,
        menuIdForMore: "",
        //分享
        showShare:false,
        isPc:isPc(),
        popupTop:false,

        imageList: [],
      }
    },
    created() {
      this.companyId = this.$route.query.companyId;
      this.initMenuAndArticle();
      this.getIsBindData();
    },
    mounted() {
      // this.initPCUploader(this.companyId);
    },
    methods: {
      initMenuAndArticle() {
        let url = "/zingbiz/tuwen/tuwenManage/getWebShowPage";
        this.$http
          .get(url, { params: { companyId: this.companyId }})
          .then(res => {
            if (res.data.success) {
              this.menuList = this.onProcessingData(res.data.data.tuwenMenuList);
              this.tuwenList = res.data.data.tuwenMenuDetailsList;    //暂未使用
            } else {
              this.$vux.toast.text("数据加载失败");
            }
          }).catch(err => {
          console.log(err);
        })
      },
      onProcessingData(data) {
        if (!data || !data.length) {
          return [];
        }
        let o = [];
        data.forEach((item, index) => {
          if (item.isStart === '1') {
            let obj = Object.assign({}, item);
            obj.content = item.menuName;
            obj.active = false;                 //是否激活下拉菜单
            if (item.childMenuList && item.childMenuList.length) {
              obj.menuList = this.onProcessingData(item.childMenuList)
            }
            o.push(obj)
          }
        });
        return o
      },
      //获取绑定状态
      getIsBindData() {
        let url = "/ZingMH/ZKM/ImgContent/GraphicShowAction/getInitData.action";
        this.$http
          .get(url, { params: { companyId: this.companyId }})
          .then(res => {
            if (res.data.success) {
              this.bindingData = res.data;
              this.headimgurl = res.data.data[0].headimgurl;
            } else {
              this.$vux.toast.text("数据加载失败");
            }
          }).catch(err => {
          console.log(err);
        })
      },
      rightPopup(flag) {
        this.rightPopupModal = flag;
        //todo 点击顶部按钮时,手动隐藏下拉按钮和遮罩(非全屏遮罩)      ---目前手动控制,待优化,
        if (this.showMask) {
          this.clickMask();
        }
      },
      clickMask() {
        //todo 点击遮罩层时,隐藏遮罩层,隐藏下拉菜单
        this.showMask = false;
        this.menuList.forEach(row => {
          this.$set(row, "active", false);
        })
      },
      //一级导航click
      navClick(item, e) {
        if (item.childMenuList && item.childMenuList.length) {
          if (!item.active) {
            this.menuList.forEach(row => {
              if (row.menuId !== item.menuId) {
                this.$set(row, "active", false);
              }
            })
          }
          this.$set(item, "active", !item.active);
          this.showMask = item.active;
        } else {
          //自定义链接
          if (item.linkType === "1") {
            this.jumpUrl = item.httpPrefix + item.url;
            this.isUrlModal = true;
          }
          //图文类型
          if (item.linkType === "0") {
            this.$router.push({
              path: "/webEdit/articleHistory",
              query: {
                menuId: item.menuId,
                title: item.menuName,
              }
            });
          }
        }
      },
      subMenuClick(row, e) {
        e.stopPropagation();
        if (this.showMask) {
          this.clickMask();
        }
        if (row.linkType === "1") {
          this.jumpUrl = row.httpPrefix + row.url;
          this.isUrlModal = true;
        } else if (row.linkType === "0") {
          this.$router.push({
            path: "/webEdit/articleHistory",
            query: {
              menuId: row.menuId,
              title: row.menuName,
            }
          });
        } else {
          this.$vux.toast.text("没有配置导航类型");
        }
      },
      isBing() {
        window.location = "/SRender?jsLoader=login%2FaskBindLoader&tpl=login%2FaskBind&v=1.13180621_1823&companyId=" + this.companyId;
      },
      applyForBing() {
        this.qrUrl = `${this.headimgurl}askBind.jpg`;
        this.rightPopupModal = false;
        this.QRModal = true;
      },
      goCompanyDetail() {
        this.$router.push({
          path: "businessIntroduction",
          query: {
            companyId: this.companyId
          },
        });
      },
      goInvoicePage() {
        this.$router.push({
          path: "/webEditInvoice",
        });
      },
      showQRCode() {
        this.qrUrl = `${this.headimgurl}QR.jpg`;
        this.rightPopupModal = false;
        this.QRModal = true;
      },
      cancelFocus() {
        let vm = this;
        this.rightPopupModal = false;
        this.$vux.confirm.show({
          title: '提示',
          content: '确定取消关注吗？',
          onConfirm() {
            let url = "/ZingMH/ZDesk/MENHUWX/Company/delAttentionCompany.action";
            vm.$http
              .get(url, { params: { companyId: vm.companyId }})
              .then(res => {
                console.log("取消关注", res.data);
                if (res.data && res.data.retcode === 0) {
                  vm.bindingData.isAttention = false;
                  vm.$vux.toast.text("取消关注成功");
                } else {
                  vm.$vux.toast.text("取消关注失败");
                }
              })
          }
        })
      },
      //添加关注
      confirmFocus() {
        let params = {
          companyId: this.companyId,
          companyName: this.bindingData.data[0].companyName,
        };
        var url = "/ZingMH/ZDesk/MENHUWX/Company/attentionCompany.action";
        this.$http
          .get(url, { params: params })
          .then(res => {
            if (res.data.retcode === 0) {
              this.$vux.toast.text("关注成功");
              this.bindingData.isAttention = true;
            } else {
              this.$vux.toast.text("关注失败");
            }
          })
      },
      //分类查询
      getCompanyTag() {
        let vm = this;
        this.$http
          .get("/ZingMH/ZDesk/MENHUWX/Company/getAttentionServNumByCompanyId.action", { params: { companyId:this.companyId }})
          .then(res => {
            if (res.data.success) {
              console.log("分类查询",res.data);
              vm.tagName = [res.data.data._id];
              vm.selectClazzModal = true;
            } else {
              this.$vux.toast.text("数据请求失败");
            }
          })
      },
      //分类提交
      confirmClazz(obj) {
        this.selectClazzModal = false;
        let data = {
          companyTag: obj.name,
          companyId: this.companyId,
          companyName: this.bindingData.data[0].companyName,
          isCancel : false,
        }
        // if (obj.id) {
        //   data.isCancel = true;
        // } else {
        //   data.isCancel = false;
        // }
        this.$http
          .get("/ZingMH/ZDesk/MENHUWX/Company/setCompanyType.action", { params: data })
          .then(res => {
            if (res.data.retcode === 0) {
              console.log("分类提交",res);
              this.$vux.toast.text("保存成功");
            } else {

            }
          })
      },
      //分享
      shareClick() {
        this.rightPopupModal = false;
        this.showShare = true;
      },
      shareTimeline() {
        console.log("分享到朋友圈");
        if (isWeiXin()) {
          this.showShare = false;
          this.popupTop = true;
        } else {
          if (isMhApp()) {
            try {
              let url = location.origin + `/ZingVue/index.html#/webSite/?&companyId=${this.companyId}`;
              let title = "";
              let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
              shareTimeline(title,url,img);
            } catch (e) {
              console.log("error", e);
            }
          }
        }
      },
      shareFriend() {
        if (isWeiXin()) {
          this.showShare = false;
          this.popupTop = true;
        }
        if (isMhApp()) {
          try{
            console.log("分享到微信好友");
            let url = location.origin + `/ZingVue/index.html#/webSite/?&companyId=${this.companyId}`;
            let title = "";
            let img = location.origin + '/ZingVue/static/images/explorer/txt.png';
            shareFriend(title,url,img);
          } catch (e) {
            console.log("分享error", e);
          }
        }
      },
      onShareMessage() {
        console.log("分享到英商");
        let link = `/ZingVue/index.html#/webSite/?&companyId=${this.companyId}`;
        let title = "";
        let content = PSMU.html2txt("111");
        let logoUrl = '/ZingVue/static/images/explorer/txt.png'
        shareMessage(this, link, title, content, logoUrl)
      },

      imageUpload() {
        // fileUploader.prepareUpload.bind(this)();
      },
      // initPCUploader(companyId) {
      //     let vm = this;
      //     let url = "/zingbiz/common/UploadFile/uploadFile.action";
      //     if (!Z_IsEmpty20(companyId)) {
      //         url += "?companyId=" + companyId;
      //     }
      //     Uploader.init({
      //         uploaderServer: url,
      //         folderPath: "",
      //         imageOnly: true,
      //         onUploadStart: function(isError, refs) {
      //
      //         },
      //         onMessage: function(msg, refs) {
      //
      //         },
      //         onServerFailed: function(msg, refs) {
      //
      //         },
      //         onServerSuccess: function(PCdata, refs) {
      //             if (PCdata.success) {
      //                 vm.annexArr.push(PCdata.data);
      //                 vm.formItemData.formItemValue = JSON.stringify(vm.annexArr);
      //             }
      //         }
      //     })
      // },
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/stylus/mixin.styl";
  .web-edit-show, .popup-iframe {
    flex-column(column);
    width: 100%;
    background-color: #f8f8f8;
    .tab-list {
      min-width: 100%;
      height: 40px;
      background: #f9f9f9;
      display: flex;
      text-align: center;
      .li {
        border-right: 1px solid #bcbcbc;
        position: relative;
        width: 100%;
        .text {
          line-height: 40px;
        }
        .dropdownWrapper {
          position: absolute;
          flex-center(column, center, center)
          margin-top: 5px;
          .triangleIcon {
            position: relative;
            width: 0;
            height: 0;
            border-width: 0 5px 5px;
            border-style: solid;
            border-color: transparent transparent #f9f9f9; /*透明 透明  灰*/
            z-index: 100;
          }
          ul {
            max-width: 180px;
            background-color: #f9f9f9;
            z-index: 100;
            border-radius: 5px;
          }
          li {
            padding: 10px 0;
            margin: 5px 10px;
            border-bottom: 1px solid #d2d2d2;
            text-ellipsis(nowrap, ellipsis)
          }
        }
      }
      li:last-child {
        border: none !important
      }
      li:last-child .dropdownWrapper {
        right: 0;
      }
      li:first-child .dropdownWrapper {
        left: 0;
      }
    }
    .iframe {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
    }
    .popupDialog {
      .icon-guanbi {
        position: absolute
        right: 15px
        top: 15px
        font-size: 18px;
      }
      .icon-youjiantou {
        margin-left: 5px
      }
      .left-menu {
        padding 18px 0 0;
        .head-img {
          height: 111px;
          display: flex;
          align-items: center;
          img {
            height: 80px;
            width: 80px;
          }
        }
        .left-menu-item {
          padding: 15px;
          border-bottom: 1px solid #eaeaea
        }
      }
    }
    .icon-gengduo {
      margin-right 14px;
      font-size: 25px;
    }
  }
  #BindCodeImg{
    width 300px
    height 260px
  }
  .popupShare img{
    padding:10px;
    border-radius :20px;
  }
</style>
