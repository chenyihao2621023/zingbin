<template>
    <div class="front-desk">
        <zing-head :isComeBack="false">
            <div slot="header-left">

                <span style="font-size: 18px">&nbsp&nbsp&nbsp 我</span>

            </div>
            <div slot="header-right">
        <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span>
                <span class="header-jiahao">
          <dropdown :data="moreData" trigger="click" placement="bottomRight" @item-click="handleRightMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
            </div>
        </zing-head>
        <popup v-model="popupModal" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'输入邀请码'" :show-bottom-border="false"
                          @on-click-left="popupModal = false" @on-click-right="addCompany">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="邀请码:"   v-model="inventCode"></x-input>
                </group>
            </div>
        </popup>
        <div class="front-desk-content">
            <scroll :observeDOM="true">
                <!-- <div v-show="showSearch">
                  <search position="absolute" auto-scroll-to-top top="46px"></search>
                </div> -->
                <search
                    ref="search"
                    class="searchStyle"
                    :searchFlag="showSearch"
                    @cancelInput="onCancelSearch"
                    @confirmInput="onSubmitSearch"
                ></search>

                <div id="media-href" class="" @click="cardDetails">
                    <!--<avatar :size="'large'" shape="square" @click="show"-->
                            <!--:src='"/ImgRender?imgpath=/checkJpg/"+cardUrlSub2+"/"+cardUrl+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"'-->
                            <!--style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>-->

                    <div class="media-left" style="display: flex;align-items: center">
                        <img style="width:60px;height:60px" class="previewer-demo-img" v-for="(item,index) in imgList" :key="item" :src="item.src"
                             @click.stop="showImg(index)">
                        <div v-transfer-dom>
                            <previewer :list="imgList" ref="previewer" :options="imgOptions" style="height: 100%;width: 100%;"></previewer>
                        </div>
                        <div class="media-body " style="float:left">
                            <h3 class="black" style="margin-left:13px!important;">
                                <span class="RealName DIVFontCss tabLineCss" style="max-width: 1274px;">{{realName}}</span>
                            </h3>
                        </div>
                    </div>
                    <div class="media-right" style="float: right" @click.stop>
                        <div class="QRCode-right" style="width: 120px;">
                            <div @click="show = true;">
                              <div style="    height: 60px;width: 50px;position: absolute;top: 10px;right: 0px;" @click="cardDetails"></div>
                                <i class="iconfont  icon-erweima QRCodeShow"
                                   style="font-size: 25px;padding: 5px 40px;"></i>
                            </div>
                            <div style="float:right;margin-top: -22px;">
                                <i class="iconC iconfont icon-arrow-right" style="margin-left: -36px;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="front-desk-content-list-item-wrapper">
                    <div class="list-wrapper" v-for="item in listData" :key="item.id" @click="itemClick(item.title)">
                        <GridCard>
                            <div slot="cardLeft" class="left">
                                <i style="font-size: 30px;" v-bind:class="[item.avatar]"></i>
                            </div>
                            <div slot="cardRight" class="right">
                                <div class="right-content">
                                    <h3 class="right-content-title" style="margin-top: 10px;">{{item.title}}</h3>

                                </div>
                                <div class="right-info">
                                    <i class="icon iconfont icon-iconfontjiantou5" style="color:#101010"></i>
                                </div>
                            </div>
                        </GridCard>
                    </div>

                </div>
            </scroll>
        </div>

        <!--<div v-transfer-dom>-->
            <x-dialog v-model="show" class="dialog-demo" style="width: 300px;height: 380px;">
                <!--<div class="img-box">-->
                <img :src='"/checkJpg/"+cardUrl.substring(0,2)+"/"+cardUrl+"QR.jpg?v=1.13180419_1816&amp;zIsCacheImg=true"'
                     style="max-width:100%">
                <!--</div>-->
                <div @click="show=false">
                    <p style="margin-top:0px;font-size: 16px">
                        让你的小伙伴用英商app或者<br>微信的扫一扫就能直接<br>添加你为好友
                    </p>
                    <br>
                    <div style="margin-bottom:10px;font-size:20px">点我返回</div>
                </div>
            </x-dialog>
        <!--</div>-->

        <!--<div v-transfer-dom>-->
            <confirm v-model="showAddCompany"
                     show-input
                     title="请输入邀请码"
                     :input-attrs="{type: 'string'}"
                     @on-confirm="addCompany">
            </confirm>
            <!-- <slot>2018年底将开放英商商号创建，敬请关注。</slot> -->
        <!--</div>-->
    
    </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import Dropdown from "components/dropdown/Dropdown";
import Avatar from "components/avatar/Avatar";
import GridCard from "components/gridcard/GridCard";
import { mapState, mapMutations } from "vuex";
import { createChat } from "../../utils/fn";
import search from "components/search/search";
import {
    Grid,
    Group,
    Popup,
    XInput,
    PopupHeader,
    PopupPicker,
    GridItem,
    GroupTitle,
    XDialog,
    AlertModule,
    Confirm,
    Previewer,
    TransferDom
  //        TransferDomDirective as TransferDom
} from "vux";

export default {
  name: "ME",
  directives: {
    TransferDom
  },
  components: {
    Group,
    AlertModule,
    XInput,
    ZingHead,
    Scroll,Popup,
    PopupHeader,
    PopupPicker,
    Dropdown,
    Avatar,
    GridCard,
    search,
    Grid,
    GridItem,
    GroupTitle,
    XDialog,
    Confirm,
    Previewer
  },
  data() {
    return {
      popupModal:false,
      inventCode:'',
      cardUrl: "",
      cardUrlSub2: "",
      authenCodeTmp: "", // 邀请码
      showAddCompany: false, //添加公司dialog
      show: false, // 个人QC dialog
      userInfo: {},
      moreData: [
        { content: "发起群聊" },
        { content: "添加好友" },
        { content: "添加商号" },
        { content: "创建商号" }
      ],
      showSearch: false,
      listData: [
        {
          avatar: "icon iconfont icon-kefu",
          title: "我的客服",
          id: 0
        },
        {
          avatar: "icon iconfont icon-gouwuche2",
          title: "购物车",
          id: 1
        },
        {
          avatar: "icon iconfont icon-wodedingdan",
          title: "我的订单",
          id: 2
        },
        {
          avatar: "icon iconfont icon-zhangdan1",
          title: "我的账单",
          id: 3
        },
        {
          avatar: "icon iconfont icon-klmshoucang",
          title: "收藏",
          id: 4
        },
        {
          avatar: "icon iconfont icon-dizhiguanli",
          title: "地址管理",
          id: 5
        },
        {
          avatar: "icon iconfont icon-jiaren",
          title: "邀请",
          id: 6
        },
        {
          avatar: "icon iconfont icon-shezhi",
          title: "设置",
          id: 7
        }
      ],
      headImg: "./static/images/userDef_.jpg",
      imgList: [{ src: "./static/images/userDef_.jpg", w: 800}],
      imgOptions: {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[
            index
          ];
          // get window scroll Y
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    };
  },
  computed: {
    // cardUrl() {
    //   return this.$store.state.ui.userInfo.cardUrl;
    // },
    realName() {
      return this.$store.state.ui.userInfo.RealName;
    }
  },
  created() {
    //this.getCardUrl();
    this.getCardUserInfo();
  },
  methods: {
    getCardUserInfo() {
      let url = "/zingbiz/auth/user/getCardUserInfo";
      this.$http.post(url, {}).then(res => {
        let retData = res.data.data;
        if (retData.cardUrl) {
          this.cardUrl = retData.cardUrl;
        }
        if (retData.headimgurl) {
          this.headImg = retData.headimgurl;
          this.imgList = [{ src: retData.headimgurl, w: 800}];
        }
      });
    },
    onCancelSearch() {
      this.showSearch = false;
    },
    onSubmitSearch() {
      this.showSearch = false;
    },
    getCardUrl() {
      let urlCard = "/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action";
      this.$http
        .post(urlCard)
        .then(res => {
          if (res.data.success) {
            this.cardUrl = res.data.data.cardUrl;
            this.cardUrlSub2 = res.data.data.cardUrl.substring(0, 2);
            this.imgList = [
              {
                msrc:
                  "/ImgRender?imgpath=/checkJpg/" +
                  this.cardUrlSub2 +
                  "/" +
                  this.cardUrl +
                  ".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg",
                src:
                  "/ImgRender?imgpath=/checkJpg/" +
                  this.cardUrlSub2 +
                  "/" +
                  this.cardUrl +
                  ".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg",
                w: 800
              }
            ];
          } else {
            console.error("getCardUrl failed", res);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    showImg(index) {
      console.log("showindex", index);
      console.log("0000", this.$refs.previewer);
      this.$refs.previewer.show(index);
    },
    //开通服务号输入邀请码
    addCompany(code) {
      if(_.isEmpty(code)) code = this.inventCode
      let url = "/ZingMH/ZDesk/MENHUWX/Company/checkAuthenCode.action";
      this.$http
        .get(url, { params: { authenCode: code } })
        .then(res => {
          let retcode = res.data["retcode"];
          if (retcode === 0) {
            // alert("sucess");
            this.$router.push({
              path: "creatCompany",
              query: {
                authCode: code
              }
            });
          } else {
            this.$vux.toast.text("邀请码不可用!");
            this.popupModal = false
          }
        })
        .catch(err => {});
    },
    handleLeftMenu(value) {},
    handleRightMenu(value) {
      console.log(value);
      if (value.content === "发起群聊") {
        createChat(this);
      } else if (value.content === "添加好友") {
        this.$router.push({
          path: "searchMHAccount",
          query: {
            url: "/ZingMH/ZDesk/serviceFriend/searchCard.action",
            searchKey: "keyCard"
          }
        });
      } else if (value.content === "添加商号") {
        this.$router.push({
          path: "searchMHAccount",
          query: {
            // url: "/ZingMH/ZDesk/MENHUWX/MHServiceN/getAllServiceNumber.action",
            // searchKey: "keyCard"
          }
        });
      } else if (value.content === "创建商号") {
        // this.showAddCompany = true;
        this.popupModal = true
      }
    },
    search() {
      /*this.showSearch = !this.showSearch;*/
        this.$router.push({
            path: "/globalSearch",
        });
    },
    cardDetails() {
      this.$router.push({
        path: "cardDetails",
        query: {
          cardUrl: this.cardUrl
        }
      });
    },
    itemClick(action) {
      switch (action) {
        case "设置":
          this.$router.push({
            path: "meSetting"
          });
          break;
        case "收藏":
          this.$router.push({
            path: "meCollection"
          });
          break;
        default:
          AlertModule.show({
            title: "提示",
            content: "维护中..."
          });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

#headImg {
    max-height: 50px;
    max-width: 50px;
    min-height: 50px;
    min-width: 50px;
    margin-bottom: -2px;
    margin-left: 8px;
    text-align: center;
    display: block;
    float: left;
    margin-top: 6px;
}

.media-body, .media-left, .media-right {
    display: table-cell;
    vertical-align: top;
}

.media-left, .media > .pull-left {
    padding-right: 10px;
}

#media-href {
    border-bottom: 1px solid #efeff4;
    border-color: #efeff4;
    height: 76px;
    background-color: #fff;
    overflow: hidden;
    border-top: 1px solid #efeff4;
    margin-top: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.front-desk {
    height: 100%;
    width: 100%;

    .triangle-down {
        triangle-down();
    }

    .vux-search-fixed {
        top: 0 !important;
    }

    .list-wrapper .scroll-content {
        width: 100%;
    }

    &-content {
        height: calc(100% - 50px);
        overflow: hidden;

        &-title-img {
            img {
                width: 100%;
                height: 130px; // 临时图片 以后删掉
            }
        }

        &-list-item-wrapper {
            .left {
                width: 50px;
                height: 50px;
                flex: none;
            }

            .right {
                text-align: start;
                padding-left: 20px;
                flex-center(row, space-between, center);
                overflow: hidden;

                &-content {
                    width: 80%;

                    &-title {
                        margin-bottom: 14px;
                    }

                    &-desc {
                        width: 100%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        color: #888;
                    }
                }

                &-info {
                    i {
                        font-size: 24px;
                        color: #0F89C5;
                    }
                }
            }
        }
    }
}
</style>

<style lang="less" scoped>
@import "~vux/src/styles/close";

.grid-card {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 5px 13px;
  border-bottom: 1px solid #eaeefb;
  height: 40px;
}

.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.previewer-demo-img {
  width: 50px;
  height: 50px;
  float: left;
  margin-left: 13px;
  border-radius: 5px;
}
</style>
