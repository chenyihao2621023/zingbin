<template>
  <div class="webEdit">
    <div>
      <zing-head title="网站编辑">
            <span slot="header-right" class="head-jiahao">
                <i v-show="(navListData.length < 4 ) && !editInfoModal" class="iconfont icon-jiahao1"
                   @click="addLevelOneNav"></i>
            </span>
      </zing-head>
    </div>
    <div class="vue-tab">
      <tab class="" :line-width="2">
        <tab-item selected @on-item-click="changeTab('0')">编辑移动网站</tab-item>
        <tab-item @on-item-click="changeTab('1')">编辑发现通知</tab-item>
      </tab>
    </div>
    <div class="tab-content">
      <edit-mobile-web v-show="editMobileWebModal" :NavListData="navListData" :oldRowIdList="oldRowIdList"
                       @changeList="onChangeList" :hasSaved="hasSaved" @hasChange="hasChange" :flagTow="true"
                       :dataAlready="dataAlready">
      </edit-mobile-web>
      <div :show="editInfoModal" class="article-list">
        <graphic-list-comp :showEditIcon="true" :type="1" :jumpToWhere="'edit'"></graphic-list-comp>
        <x-button @click.native="addNotice()" type="primary">新建通知</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem, XButton } from 'vux';
  import ZingHead from "@/components/zingHead/ZingHead";
  import EditMobileWeb from '../components/EditMobileWeb';
  import GraphicListComp from "../components/GraphicListComp"

  export default {
    name: "webEditMain",
    components: { Tab, TabItem, XButton, ZingHead, EditMobileWeb, GraphicListComp },
    data() {
      return {
        editMobileWebModal: true,
        editInfoModal: false,
        oldRowIdList: [],
        ary: [],
        hasSaved: true,  //导航数据是否有变动
        navListData: [],
        defaultData: [{
          menuId: '',
          name: '一级导航',
          parentId: '',
          releaseTime: '',
          flag: true,
          list: [{ isStart: '1', linkType: '0', menuName: '', url: '', }],
          childMenuList: [{ name: '二级导航', parentId: '', flag: false, menuName: '', list: [], }]
        }],
        dataAlready: false,
      }
    },
    created() {
      this.requestAllData();
    },
    methods: {
      requestAllData() {
        let vm = this;
        let url = "/zingbiz/tuwen/tuwenManage/getAllMenuList";
        vm.$http
          .get(url)
          .then(res => {
            if (res.data.success) {
              if (res.data.data.length > 0) {
                vm.navListData = vm.onProcessingData(res.data.data);
                vm.dataAlready = true;
                vm.hasSaved = true;
              } else {
                vm.navListData = vm.defaultData;
                vm.hasSaved = false;
              }
            } else {
              console.log(res.data);
            }
          }).catch(error => {
          console.log(error);
        })
      },
      onProcessingData(data) {
        if (!data || !data.length) {
          return [];
        }
        let handledData = data.map(item => {
          let obj = {
            isStart: item.isStart,
            linkType: item.linkType,
            menuId: item.menuId,
            url: item.url,
            menuName: item.menuName,
            parentId: item.parentId,
            menuDetailsList: item.menuDetailsList,
            httpPrefix: item.httpPrefix,
          };
          let c = {
            flag: true,
            name: '一级导航',
            id: item.menuId,
            list: [obj],
            childMenuList: [{
              name: '二级导航',
              flag: false,
              menuDetailsList: item.menuDetailsList,
              list: item.childMenuList || [],
            }],
          };
          if (item.childMenuList) {
            this.ary = [...this.ary, ...item.childMenuList]
          }
          //留存原始menuId (一级)
          this.oldRowIdList.push(item.menuId);
          return c
        });
        //留存原始menuId (二级)
        this.ary.forEach(subItem => {
          this.oldRowIdList.push(subItem.menuId);
        });
        console.log("after", handledData);
        return handledData;
      },
      //删除一级导航
      onChangeList(index) {
        let vm = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '是否刪除该导航',
          onConfirm() {
            vm.navListData = vm.navListData.filter((item, i) => i !== index);
            vm.hasSaved = false;
          }
        })
      },
      changeTab(index) {
        if (index === "0") {
          this.editMobileWebModal = true;
          this.editInfoModal = false;
        } else if (index === "1") {
          this.editMobileWebModal = false;
          this.editInfoModal = true;
        }
      },
      addLevelOneNav() {
        let item = {
          menuId: '',
          name: '一级导航',
          parentId: '',
          flag: true,
          list: [{ isStart: '1', linkType: '', menuName: '', url: '', }],
          childMenuList: [{ name: '二级导航', parentId: '', flag: false, menuName: '', list: [], }]
        };
        this.navListData = [...this.navListData, item];
        this.hasSaved = false;
      },
      hasChange(flag) {
        this.hasSaved = flag;
        //为true时,即为保存,重新获取数据id
        if (flag) {
          this.requestAllData();
        }
      },
      addNotice() {
        this.$router.push({
          path: "/addGraphic",
          query: {
            type: "1"
          }
        })
      },
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/stylus/mixin.styl";
  .webEdit {
    width: 100%;
    flex-column(column);
  }

  .tab-content {
    overflow: hidden;
    height 100%;
    width: 100%;
    background-color: #eaeaea;
  }

  .icon-jiahao1 {
    margin-right: 14px;
    font-size: 20px;
  }

  .article-list {
    flex-column(column)
    overflow: hidden;
  }
</style>
