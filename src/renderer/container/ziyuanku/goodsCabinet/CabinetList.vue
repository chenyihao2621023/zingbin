<template>
  <div class="CabinetList">
    <zing-head  

      @popup-change="onChange"
      :popupPickerData="classificationList" 
      :popupTitle="classification"
      >
      <!-- <div slot="header-left">
        <popup-picker :title="classification" :data="classificationList" :columns="2" ref="picker3" @on-change="onChange"></popup-picker>
      </div> -->
      <div slot="header-right">
        <span class="header-search">
          <i class="iconfont icon-fangdajing" @click="showSearch"></i>
        </span>
        <span class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <!-- <div v-show="isShow">
      <search class="search" @on-cancel="onCancel" @on-change="getResult" @on-submit="onSubmit" ref="search"></search>
    </div> -->
    <search
      ref="search"
      class="search"
      :searchFlag="isShow"
      @cancelInput ="onCancel"
      @confirmInput="onSubmit"
    ></search>
    <div class="scroll-list-wrap">
      <scroll ref="scroll" :data="items" :scrollbar="true" :startY="0">
        <GridCard v-for="(item,index) in gridCardData" :key="index">
          <div slot="cardLeft" class="left" @click="itemClick(item)">
            <avatar shape="square" size="large" :style="{backgroundColor: '#23C32F'}" :icon="item.ckImg"></avatar>
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.ckName}}</p>
              <div class="left-wrapper-desc">{{item.ckDesc}}</div>
            </div>
          </div>
          <div slot="cardRight" class="right">
            <i class="iconfont icon-gengduo" @click="moreOptions(item)"></i>
          </div>
        </GridCard>
        <!--三个点的菜单-->

      </scroll>
    </div>
    <class-selection
        :showPicker="showClassSetter"
        title1="全体分类"
        title2="个人分类"
        tagType1="superCabinet"
        tagType2="Cabinet"
        @checkSelected="checkSelected"
        @abort="closeClassSelection"
          >
    </class-selection>
  </div>
</template>

<script>
import { Selector, PopupPicker, Group, Actionsheet } from "vux";
import search from "@/components/search/search";
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import ClassSelection from "../../common/classSelection/classSelection";

export default {
  name: "CabinetList",
  components: {
    PopupPicker,
    Scroll,
    GridCard,
    Avatar,
    Tag,
    ZingHead,
    Selector,
    search,
    Group,
    Dropdown,
    Actionsheet,
    ClassSelection
  },
  props: {
    isComeBack: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  data: () => ({
    headTitle: "物品柜",
    clickData: {},
    showDialog: false, //三个点方法
    showClassSetter: false,
    selectId: "",
    items: [],
    gridCardData: [],
    datas: [],
    isShow: false,
    classification: "所有分类",
    classificationList: [
      {
        name: "所有分类",
        value: "all",
        parent: 0
      },
      {
        name: "所有分类",
        value: "allClassification",
        parent: "all"
      }
    ]
  }),
  computed: {},
  created() {
    this.datas.push(
      {
        content: "新建物品柜",
        url:
          "/resourceLibrary/goodsCabinet/CabinetAddOrUpdate?pageStatus=A&companyId=" +
          this.$route.query.companyId
      },
      { content: "个人分类", url: "/classmain?classType=Cabinet" },
      { content: "全体分类", url: "/classmain?classType=superCabinet" }
    );
    this.selCkInfo();
    this.loadTags();
  },
  methods: {
    onChange(value) {
      this.classification = this.$refs.picker3.getNameValues().split(" ")[1];
      if (value[0] == "public") {
        this.selCkInfo(undefined, value[1]);
      } else if (value[0] == "private") {
        this.selCkInfo(value[1]);
      } else {
        this.selCkInfo();
      }
    },
    selCkInfo(privateClassification, publicClassification) {
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/select";
      let params = {
        pageNumber: 0,
        pageSize: 10,
        ckTypeStrs: "WPG",
        privateClassification,
        publicClassification
      };
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          if (res.data.success) {
            this.gridCardData = res.data.data.data;
          } else {
            this.$message({ type: "error", message: "加载失败，请重试" });
          }
        });
    },
    onCancel() {
      this.isShow = false;
    },
    moreOptions(item) {
      //显示三个点弹框
      var _this = this;
      this.$vux.actionsheet.show({
        menus: ["编辑属性", "删除", "分类管理"],
        onMenuClick(text, key) {
          switch (key) {
            case 0:
              _this.editCabinet();
              break;
            case 1:
              _this.delCabinet();
              break;
            default:
              _this.classificationSelection();
          }
          this.show = false;
        }
      });
      this.clickData = item;
    },
    editCabinet() {
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/CabinetAddOrUpdate",
        query: {
          rowId: this.clickData.rowId,
          companyId: this.clickData.companyId,
          pageStatus: "U"
        }
      });
    },
    delCabinet() {
      let self = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/delByRowId";
          self.$http
            .get(url, {
              params: {
                rowId: self.clickData.rowId,
                type: self.clickData.ckType
              }
            })
            .then(res => {
              this.showDialog = false;
              if (res.data.retcode === 0) {
                self.$vux.toast.text("删除成功!");
                self.selCkInfo();
              } else if (res.data.retcode === -2) {
                self.$vux.toast.text("请先删除物品柜中的物品!");
              } else {
                self.$vux.toast.text("删除失败，请重试。");
              }
            });
        }
      });
    },
    classificationSelection() {
      this.selectId = this.clickData.rowId;
      this.showClassSetter = true;
    },
    classAbort() {
      this.showClassSetter = false;
    },
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    },
    showSearch() {
      this.isShow = !this.isShow;
      // this.$refs.search.setFocus();
    },
    getResult(val) {
      console.log(val);
    },
    onSubmit(val) {
      console.log(val);
    },
    itemClick(data) {
      //根据type跳转
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/goodsList",
        query: {
          ckId: data.rowId,
          companyId: data.companyId
        }
      });
    },
    onHide(type) {
      if (type) {
        this.title3 = this.$refs.picker3.getNameValues().split(" ")[1];
        //console.info(this.$refs.picker3.tempValue[1]);
        //this.title3 =
      }
    },
    loadTags() {
      let url = "/zingbiz/common/serviceModule/getAllTags.action";
      this.$http
        .get(url, {
          params: {
            tagType: "Cabinet,superCabinet"
          }
        })
        .then(res => {
          let data = res.data.data;
          let privateClassification = data.Cabinet;
          if (
            typeof privateClassification === "object" &&
            privateClassification.length > 0
          ) {
            this.classificationList.push({
              name: "个人分类",
              value: "private",
              parent: 0
            });

            privateClassification.forEach(item => {
              this.classificationList.push({
                name: item.tags,
                value: item.rowId,
                parent: "private"
              });
            });
          }

          let publicClassification = data.superCabinet;
          if (
            typeof publicClassification === "object" &&
            publicClassification.length > 0
          ) {
            this.classificationList.push({
              name: "全体分类",
              value: "public",
              parent: 0
            });

            publicClassification.forEach(item => {
              this.classificationList.push({
                name: item.tags,
                value: item.rowId,
                parent: "public"
              });
            });
          }
        });
    },
    checkSelected(selected) {
      let params = {
        rowId: this.selectId,
        publicClassification: selected.superTypeIds.join(" "),
        privateClassification: selected.privateTypeIds.join(" ")
      };
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/update";
      this.$http.post(url, params).then(res => {
        if (res.data.success === true) {
          this.$vux.toast.text("分类设置成功！");
          this.showClassSetter = false;
        }
      });
    },
    closeClassSelection() {
      this.showClassSetter = false;
    }
  }
};
</script>
<style  lang="stylus" rel="stylesheet/stylus">
.search {
  position: relative !important;
}

.resource {
  .scroll-list-wrap {
    .left {
      .iconfont {
        font-size: 42px;
      }
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.search {
  position: relative !important;
}

.resource {
  .scroll-list-wrap {
    .left {
      .iconfont {
        font-size: 42px;
      }
    }
  }
}
</style>