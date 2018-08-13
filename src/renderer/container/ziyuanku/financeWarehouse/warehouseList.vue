<template>
  <div class="warehouseList">
    <zing-head @popup-change="onChange" :popupPickerData="classificationList" :popupTitle="classification" :isComeBack="isComeBack" @doSome="doSome">
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
    <search :searchFlag="isShowSearch" @cancelInput="cancelInput" @confirmInput="confirmInput"></search>
    <div v-if="gridCardData.length > 0" class="scroll-list-wrap">
      <scroll ref="scroll" :data="items" :scrollbar="true" :startY="0" @pullingUp="onPullingUp">
        <GridCard v-for="(item,index) in gridCardData" :key="index">
          <div slot="cardLeft" class="left" @click="itemClick(item)">
            <avatar shape="square" size="large" :style="{backgroundColor: '#F5EB2B'}" :icon="item.ckImg"></avatar>
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
    <div v-else class="prompt">未添加财务库</div>
    <class-selection :showPicker="showClassSetter" title2="全体分类" title1="个人分类" tagType2="superFinance" tagType1="finance" @checkSelected="checkSelected" @abort="closeClassSelection">
    </class-selection>
  </div>
</template>

<script>
import { Selector, Group, Actionsheet } from "vux";
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import ClassSelection from "../../common/classSelection/classSelection";
import Search from "@/components/search/search.vue";
export default {
  name: "warehouseList",
  components: {
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
    }
  },
  data: () => ({
    clickData: {},
    showDialog: false, //三个点方法
    dialogMenus: ["编辑属性", "删除", "分类管理"],
    showClassSetter: false,
    selectId: "",
    items: [],
    gridCardData: [],
    datas: [],
    currentUser: "",
    privateClassification: "",
    publicClassification: "",
    qureyAll: "",
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
        return "财务库";
      }
    }
  },
  created() {
    this.datas.push(
      {
        content: "新建仓库",
        url:
          "/resourceLibrary/financeWarehouse/warehouseAddOrUpdate?pageStatus=A&companyId=" +
          this.$route.query.companyId
      },
      {
        content: "个人分类",
        url: "/classmain?classType=finance&headTitle=个人分类"
      },
      {
        content: "全体分类",
        url: "/classmain?classType=superFinance&headTitle=全体分类"
      }
    );
    this.selCkInfo();
    this.loadTags();
  },
  methods: {
    selCkInfo() {
      let params = {
        pageNumber: 0,
        pageSize: 10,
        ckTypeStrs: "CW",
        privateClassification: this.privateClassification,
        publicClassification: this.publicClassification,
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
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    },
    onCancel() {
      this.isShowSearch = false;
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
        path: "/resourceLibrary/financeWarehouse/warehouseAddOrUpdate",
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
                self.selCkInfo();
              } else if (res.data.retcode === -2) {
                self.$vux.toast.text(
                  self.clickData.ckName +
                    "下存在凭证，删除凭证后才可以删除财务库"
                );
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
      this.qureyAll = "";
    },
    confirmInput(text) {
      // this.
      this.qureyAll = text;
      this.selCkInfo();
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
        this.$emit("financeItemClick", data);
      } else {
        //根据type跳转
        this.$router.push({
          path: "/resourceLibrary/financeWarehouse/voucherList",
          query: {
            ckId: data.rowId,
            companyId: data.companyId,
            ckName: data.ckName
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
      this.selCkInfo();
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
            tagType: "finance,superFinance"
          }
        })
        .then(res => {
          let data = res.data.data;
          let privateClassification = data.finance;
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

          let publicClassification = data.superFinance;
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
<style lang="stylus" rel="stylesheet/stylus">
.warehouseList {
  height: 100%;
  background-color: #fff;

  .search {
    position: relative !important;
  }

  .scroll-list-wrap {
    .left {
      .iconfont {
        font-size: 42px;
      }
    }
  }

  .prompt {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #ff8000;
  }
}
</style>