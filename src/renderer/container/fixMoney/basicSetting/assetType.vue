<template>
    <div class="assetType">
        <ZingHead :title="assetTitle" :isComeBack="false" @doSome="close()">
            <div slot="header-right" v-show="showRightTag">
                <span class="header-jiahao">
                    <dropdown :data="rightMenu" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </ZingHead>
        <scroll :observeDOM="true" class="list-warp">
            <div class="increaseFirst" v-show="levelFirst" @click="addFirst">
                <x-icon type="ios-plus-outline" size="24" class="circle"></x-icon>
                <span class="describe">增加一级类别</span>
            </div>
            <tree :data="menu" :newItem="newItem" :deleteItem="deleteIcon" @addItem="addItem" @editItem="editItem" @deleteItem="deleteItem" @checkIcon="checkIcon"></tree>
        </scroll>
        <x-button type="primary" class="btn-common" v-show="deleteIcon" @click.native="deleteAsset">删除</x-button>
    </div>
</template>
<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Dropdown from "@/components/dropdown/Dropdown";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
import { XButton } from "vux";
export default {
  components: {
    ZingHead,
    Dropdown,
    Tree,
    XButton,
    Scroll
  },
  data() {
    return {
      menu: [],
      assetTitle: "资产类别",
      newItem: false,
      deleteIcon: false,
      showRightTag: true,
      deleteData: [],
      rightMenu: [{ content: "新建" }, { content: "删除" }],
      levelFirst: false,
      level: false
    };
  },
  created() {
    this.getAllAssetsClassConfiguration();
  },
  methods: {
    //添加子集 判断类别是否被使用 类别被使用不允许添加 是否为最后一级 左后一级不予许添加 不可跨级添加
    addItem(item) {
      console.info(item);
      let assetLength = item.code.split(".").length;
      if (assetLength >= 5) {
        this.$vux.toast.text("类别最多增加5级（含一级）");
        return;
      } else {
        this.$router.push({
          path: "addAssettype",
          query: {
            type: "add",
            id: item.id,
            code: item.code,
            parentId: item.parentId
          }
        });
      }
    },
    checkIcon(item) {
      //将数据保存
      this.deleteData = item;
    },
    // 添加一级类别 addFirst
    addFirst() {
      if (this.newItem) {
        this.$router.push({
            path: "addAssettype",
            query: {
                type: "add",
                leave: this.levelFirst
            }
        });
      }
    },
    //跳转到编辑界面
    editItem(item) {
      if (this.deleteIcon || this.newItem) {
        return;
      } else {
        this.$router.push({
            path: "addAssettype",
            query: {
                type: "update",
                id: item.id,
                code: item.code
            }
        });
      }
    },
    // 点击右侧下拉框菜单选项
    handleMenu(data) {
      if (data.content === "新建") {
        this.levelFirst = true;
        this.newItem = true;
        this.showRightTag = false;
      } else {
        this.deleteIcon = true;
        this.showRightTag = false;
      }
    },
    // 删除 （ 删除时，验证使用状态是否已经被使用，如被使用，
    // 则不允许删除，并给予提示。否则可以删除，并提示删除成功。）
    // 父级下存在子级时，若子集状态被使用不能删除，反之可删除
    deleteAsset() {
      let vm = this;
      if (vm.deleteData.length === 0) {
        vm.$vux.toast.text("请选择要删除的选项");
        return;
      }
      vm.$vux.confirm.show({
        title: "提示",
        content: "确定删除？",
        // 组件除show外的属性
        onConfirm() {
          // 针对数据的状态进行判断处理，被使用，则不允许删除
          vm.$http.post(
              "/zingbiz/fixedAssets/configuration/checkAssetsClassConfigurationUsing",
              { id: vm.deleteData.id })
            .then(res => {
              if (res.data.success) {
                let deletaItem = res.data.data;
                if (!deletaItem.hasUsed) {
                  vm.$http.post( "/zingbiz/fixedAssets/configuration/deleteAssetsClassConfiguration",
                      {
                        id: vm.deleteData.id
                      }).then(res => {
                      if (res.data.success) {
                        setTimeout(function() {
                          vm.getAllAssetsClassConfiguration();
                          vm.$vux.toast.text(res.data.mgs);
                          vm.deleteIcon = false;
                          vm.showRightTag = true
                        }, 2000);
                      } else {
                            vm.$vux.toast.text(res.data.mgs);
                        }
                    });
                } else {
                     vm.$vux.toast.text("资产类别被使用，则不允许删除");
                }
              }
            });
        }
      });
    },
    //导航栏返回事件
    close() {
      if (this.newItem === false && this.deleteIcon === false) {
        this.$router.back(-1);
      } else {
        this.levelFirst = false;
        this.newItem = false;
        this.deleteIcon = false;
        this.showRightTag = true;
      }
    },
    //获取资产类别
    getAllAssetsClassConfiguration() {
      let vm = this;
      vm.$http.get(
          "/zingbiz/fixedAssets/configuration/getAllAssetsClassConfiguration",
          {}).then(res => {
          vm.menu = [...res.data.data];
        });
    }
  }
};
</script>

<style scoped>
.left-wrapper-title {
  margin-top: 6px;
}
.assetType {
  height: 100%;
}
.assetType .list-warp {
  height: calc(100%-95px);
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.increaseFirst {
    position: relative;
    margin-left: 13px;
    line-height: 3;

    .circle {
        transform: translateY(25%);
    }
}
</style>

