<template>
  <div class="resource">
    
    <zing-head  
      :isComeBack="!isReferenced"
      @doSome="doSome" 
      @popup-change="onChange"
      :popupPickerData="classificationList" 
      :popupTitle="classification">
      <div slot="header-right">
        <span class="header-search">
          <i class="iconfont icon-fangdajing" @click="showSearch"></i>
        </span>
        <span v-if="!isReferenced" class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <search :searchFlag="isShowSearch" @cancelInput ="cancelInput" @confirmInput="confirmInput"></search>
    <div class="scroll-list-wrap">
      <scroll ref="scroll" :scrollbar="true" :startY="0" @pullingUp="onPullingUp">
        <GridCard v-for="(item,index) in gridCardData" :key="index">
          <div slot="cardLeft" class="left" @click="itemClick(item)">
            <avatar shape="square" size="large" :style="{backgroundColor: '#9659AE'}" :icon="item.ckImg"></avatar>
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{item.ckName}}</p>
              <div class="left-wrapper-desc">{{item.ckDesc}}</div>
            </div>
          </div>
          <div v-if="!isReferenced" slot="cardRight" class="right">
            <i class="iconfont icon-gengduo" @click="gotoUpdateDelPage(item)"></i>
            <div class="tag-wrapper">
              <tag v-if="item.createUser === currentUser" type="success">我创建的</tag>
              <tag v-else type="warning">我参与的</tag>
            </div>
          </div>
        </GridCard>
        <!--三个点的菜单-->

      </scroll>
    </div>
    <class-selection
        :showPicker="showClassSetter"
        title2="全体分类"
        title1="个人分类"
        tagType2="superWarehouse"
        tagType1="warehouse"
        @checkSelected="checkSelected"
        @abort="closeClassSelection"
          >
    </class-selection>
  </div>
</template>

<script>
import { Selector, PopupPicker, Group, Actionsheet } from "vux";
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import Search from "@/components/search/search";
import ClassSelection from "../../common/classSelection/classSelection";
export default {
  name: "warehouseList2",
  components: {
    PopupPicker,
    Scroll,
    GridCard,
    Avatar,
    Tag,
    ZingHead,
    Selector,
    Search,
    Group,
    Dropdown,
    Actionsheet,
    ClassSelection
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isComeBack: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    loadOnCreated: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  data: () => ({
    showPopupPicker: false,
    clickData: {},
    showDialog: false, //三个点方法
    dialogMenus: ["编辑属性", "删除", "分类管理"],
    showClassSetter: false,
    selectId: "",
    gridCardData: [],
    datas: [],
    currentUser: "",
    isShowSearch: false,
    classification: "全部分类",
    classificationList: [
      {
        name: "全部分类",
        value: "all",
        parent: 0
      },
      {
        name: "全部分类",
        value: "allClassification",
        parent: "all"
      }
    ]
  }),
  computed: {
    headTitle() {
      if (this.isReferenced) {
        return "";
      } else {
        return "仓库列表";
      }
    }
  },
  created() {
    this.datas.push(
      {
        content: "新建仓库",
        url:
          "/resourceLibrary/goodsWarehouse/warehouseAddOrUpdate?pageStatus=A&companyId=" +
          this.$route.query.companyId
      },
      {
        content: "个人分类",
        url: "/classmain?classType=warehouse&headTitle=个人分类"
      },
      {
        content: "全体分类",
        url: "/classmain?classType=superWarehouse&headTitle=全体分类"
      }
    );
    if (this.loadOnCreated) {
      this.loadCkInfo();
    }
    if (!this.isReferenced) {
      this.loadTags();
    }
  },
  methods: {
    loadCkInfo(ckProp) {
      let params = {
        pageNumber: 0,
        pageSize: 2000,
        ckTypeStrs: "WP",
        privateClassification: this.privateClassification,
        publicClassification: this.publicClassification,
        ckProp,
        qureyAll: this.qureyAll
      };
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/select";
      this.$http
        .get(url, {
          params
        })
        .then(res => {
          if (res.data.success) {
            this.gridCardData = res.data.data.data;
            this.currentUser = res.data.mgs;
          } else {
            this.$message({ type: "error", message: "加载失败，请重试" });
          }
        });
    },
    gotoUpdateDelPage(item) {
      //显示三个点弹框
      var _this = this;
      this.$vux.actionsheet.show({
        menus: this.dialogMenus,
        onMenuClick(text, key) {
          _this.dialogMenuClick(key);
          this.show = false;
        }
      });
      this.clickData = item;
    },
    warehouseEdit() {
      this.$router.push({
        path: "/resourceLibrary/goodsWarehouse/warehouseAddOrUpdate",
        query: {
          rowId: this.clickData.rowId,
          companyId: this.clickData.companyId,
          pageStatus: "U"
        }
      });
    },
    delWarehouse() {
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
                self.loadCkInfo();
              } else if (res.data.retcode === -2) {
                self.$vux.toast.text("物品库中存在物品，无法删除");
              } else {
                self.$vux.toast.text("删除失败，请重试。");
              }
            });
        }
      });
    },
    classificationSetting() {
      this.selectId = this.clickData.rowId;
      this.showClassSetter = true;
    },
    classAbort() {
      this.showClassSetter = false;
    },
    doSome() {
      //防止下拉跳转
      if (this.isReferenced) {
        this.$emit("warehoseListBack");
      }
    },
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    },
    showSearch() {
      this.isShowSearch = !this.isShowSearch;
      // this.$refs.search.setFocus();
    },
    cancelInput() {
      this.isShowSearch = false;
    },
    confirmInput(val) {
      // this.
      this.qureyAll = val;
      this.loadCkInfo();
      this.qureyAll = "";
    },
    onPullingUp() {
      // 更新数据
      console.log("pulling up and load data");
      setTimeout(() => {
        if (this._isDestroyed) {
          return;
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
    itemClick(data) {
      if (this.isReferenced) {
        this.$emit("warehouseItemClick", data);
      } else {
        //根据type跳转
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/locationList",
          query: {
            ckId: data.rowId,
            companyId: data.companyId,
            ckOutMethod: data.ckOutMethod
          }
        });
      }
    },
    onChange(value, refInstance) {
      this.classification = refInstance.getNameValues().split(" ")[1];
      this.privateClassification = "";
      this.publicClassification = "";
      if (value[0] == "public") {
        this.publicClassification = value[1];
      } else if (value[0] == "private") {
        this.privateClassification = value[1];
      }
      this.loadCkInfo();
    },
    dialogMenuClick(index) {
      switch (index) {
        case 0:
          this.warehouseEdit();
          break;
        case 1:
          this.delWarehouse();
          break;
        default:
          this.classificationSetting();
      }
    },
    loadTags() {
      let url = "/zingbiz/common/serviceModule/getAllTags";
      this.$http
        .get(url, {
          params: {
            tagType: "warehouse,superWarehouse"
          }
        })
        .then(res => {
          let data = res.data.data;
          let privateClassification = data.warehouse;
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

          let publicClassification = data.superWarehouse;
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