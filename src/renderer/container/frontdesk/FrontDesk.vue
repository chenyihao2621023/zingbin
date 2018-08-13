<template>
  <!-- 服务台 -->
  <div class="front-desk">
    <zing-head :popupPickerData="filterClazzList" :popupTitle="popupTitle" @popup-change="changeClazz">
      <!--<div slot="header-left">
        <dropdown :data="datas" class="downClazz" trigger="click" placement="bottomLeft" @item-click="handleLeftMenu">
          <div>
            <span>{{chooseClazz}}</span>
            <i class="triangle-down"></i>
          </div>
        </dropdown>
      </div>-->
      <div slot="header-right">
        <!-- <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span> -->
        <span class="header-jiahao">
          <dropdown :data="moreData" trigger="click" placement="bottomRight" @item-click="handleRightMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <div class="front-desk-content">
      <div v-show="showSearch">
        <search position="absolute" auto-scroll-to-top top="46px"></search>
      </div>
      <div class="front-desk-content-list-item-wrapper">
        <div class="front-desk-content-title-img">
          <img src="../../assets/img/workbench.jpg" alt="">
        </div>
        <div class="item-wrapper" v-for="item in listData" :key="item.id">
          <GridCard style="height:60px">
            <div slot="cardLeft" @click="toServiceNumberHomepage(item)" class="left">
              <div class="left-img-wrapper">
                <avatar :size="'large'" shape="square" :src="getCompanyImageUrl(item.headimgurl)"></avatar>
              </div>
              <div class="left-content">
                <div class="left-content-title" style="font-size: 17px">{{item.companyName}}</div>
                <div class="left-content-desc">
                  {{item.companyDesc}}
                </div>
              </div>
            </div>
            <div slot="cardRight" class="right">
              <div class="right-info" @click="toCustomerServicePage(item)">
                <i class="iconfont icon-kefu" style="font-size: 35px"></i>
              </div>
            </div>
          </GridCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Dropdown from "components/dropdown/Dropdown";
import Avatar from "components/avatar/Avatar";
import GridCard from "components/gridcard/GridCard";
import { Search } from "vux";
import { getImageUrl, createChat } from "../../utils/fn";
export default {
  name: "FrontDesk",
  components: {
    ZingHead,
    Dropdown,
    Avatar,
    GridCard,
    Search
  },
  data() {
    return {
      tagType: "ServiceDesk",
      popupTitle:'全部分类',
      clazzDataList:[],
      moreData: [
        { content: "发起群聊" },
        { content: "添加好友" },
        { content: "添加商号" },
        { content: "自定义分类" },
        { content: "创建商号" }
      ],
      showSearch: false,
      listData: [],
      companyIdAgent: {}
    };
  },
    computed:{
        filterClazzList() {
            let filterArr = [{ value: "0", name: "所有分类",parent: 0 }];
            this.clazzDataList.forEach(item => {
                let dat = {};
                dat.value = item.rowId;
                dat.name = item.tags;
                dat.parent = 0;
                filterArr.push(dat);
            });
            return filterArr;
        }
    },
    created() {
        this.loadServiceNumber();
        this.loadTags();
    },
  methods: {
    toServiceNumberHomepage(item) {
        // var url =
      //   "/SRender?jsLoader=tuWenGuanLi%2FfoundListLoader&tpl=tuWenGuanLi%2FfoundList&companyId=" +
      //   item.id +
      //   "&showFoot=show&mhMenuKey_=03";
      // window.location = url;
        this.$router.push({
            path:'/webSite',
            query:{
                headimgurl: item.headimgurl,
                companyId:item.id,
            }
        })
    },
    toCustomerServicePage(item) {
      let isHaveAgent = typeof this.companyIdAgent[item.id] === "object";
      this.$router.push({
        path: "/customerService",
        query: {
          companyId: item.id,
          companyName: item.companyName,
          isHaveAgent
        }
      });
    },
    getCompanyImageUrl(imgPath) {
      let default_img = "/JsLib/dist/app/images/defaultImgs/companyDef_.jpg";
      let itemImg = "";
      if (imgPath != null || imgPath != "") {
        let heardImgUrl = "";
        if (imgPath.indexOf("QR") > -1) {
          var imgSrc = imgPath.substring(imgPath, imgPath.length - 2);
          heardImgUrl = imgSrc + ".jpg";
        } else {
          heardImgUrl = imgPath + ".jpg";
        }
        itemImg = getImageUrl(heardImgUrl, default_img);
      } else {
        itemImg = default_img;
      }
      return itemImg;
    },
    /*handleLeftMenu(value) {
      this.chooseClazz = value.content;
      this.loadServiceNumber(value.content);
    },*/
    handleRightMenu(value) {
      switch (value.content) {
        case "发起群聊":
          createChat(this);
          break;
        case "添加好友":
          this.$router.push({ path: "", query: {} });
          break;
        case "添加商号":
          this.$router.push({ path: "", query: {} });
          break;
        case "自定义分类":
          this.$router.push({
            path: "/classmain",
            query: { classType: this.tagType }
          });
          break;
        case "创建商号":
          this.$router.push({ path: "", query: {} });
          break;
      }
    },
    search() {
      this.showSearch = !this.showSearch;
    },
      changeClazz(key) {
          if (key[0] === 0 || key[0] === "0") {
              this.popupTitle = "全部分类"
              /*this.clazzIdForSearch = "";*/
          } else {
              this.clazzDataList.forEach(item => {
                  if (item.rowId === key[0]) {
                      this.popupTitle = item.tags;
                  }
              });
              /*this.clazzIdForSearch = key[0]*/
          }
          /*this.pageNumber = 0*/
          /*this.initAllDinner();*/
          this.loadServiceNumber(this.popupTitle);
      },
    loadServiceNumber(tagName) {
      if (typeof tagName === "undefined" || tagName === "全部分类") {
        tagName = "全部";
      }
      // let url = "/zingbiz/auth/org/loadServerNumber";
      let url = "/ZingMH/ZKM/MENHUWX/MHServiceN/loadServiceNumber.action";
      this.$http
        .get(url, {
          params: {
            tagName,
            pageNumber: 0,
            pageSize: 1000
          }
        })
        .then(res => {
          this.listData = res.data.data.data;
          res.data.data.agentList.forEach(item => {
            this.companyIdAgent[item.companyId] = item;
          });
        });
    },
    loadTags() {
      let url = "/zingbiz/common/serviceModule/getAllTags.action";
      this.$http
        .get(url, {
          params: {
            tagType: this.tagType
          }
        })
        .then(res => {
          //this.listData = res.data.data.data;
          let tagArr = res.data.data.ServiceDesk;
          if (typeof tagArr !== "undefined" && tagArr.length > 0) {
              this.clazzDataList = tagArr
          }
        });
    } /* ,
    loadUserCompanys() {
      let url = "/ZingMH/ZDesk/MENHUWX/Company/loadServerNumber.action";
      this.$http.get(url, {}).then(res => {
        //this.listData = res.data.data.data;
        console.info(res.data);
      });
    } */
  },

};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.front-desk {
  height: 100%;
  width: 100%;

  .triangle-down {
    triangle-down();
  }

  .vux-search-fixed {
    top: 0 !important;
  }

  .item-wrapper {
    width: 100%;
    height: 60px;
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
      height: calc(100%);
      overflow: auto;

      .left {
        width: 80%;
        text-align: start;
        flex-center(row, space-between, center);
        flex: none;

        &-img-wrapper {
          width: 50px;
          height: 50px;
          flex: none;
        }

        &-content {
          padding-left: 10px;
          width: calc(100% - 50px);

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
      }

      .right {
        &-info {
          line-height: 50px;

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
