<template>
    <div class="placeStorage">
        <ZingHead :title="placeStorageTitle" :isComeBack="false" @doSome="close()">
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
            <div class="increaseFirst" @click="increaseFirst()" v-show="levelFirst">
                <x-icon type="ios-plus-outline" size="24" class="circle"></x-icon>
                <span class="describe">增加一级类别</span>
            </div>
            <tree :data="menu" :deleteItem="deleteItem" :newItem="newItem" @addItem="addItem" @editItem="editItem" @deleteItem="deleteItem" @checkIcon="checkIcon"></tree>
        </scroll>
        <x-button type="primary" class="btn-common" v-show="deleteItem" @click.native="deleteCount">删除</x-button>
        <popup position="top" v-model="popup" @on-hide="onHide" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="placeStorage">
                <div class="initFrom-title">新建</div>
                <group>
                    <x-input title="代码" v-model="PlaceStorage.assetCode" class="code" placeholder="请输入代码"></x-input>
                    <x-input title="名称 " placeholder="请输入名称" class="assetName" v-model="PlaceStorage.assetName">
                    </x-input>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancleNew()">
                            取消
                        </flexbox-item>
                        <flexbox-item class="interspace" @click.native="confirmNew()">
                            确认
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
    </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Dropdown from "@/components/dropdown/Dropdown";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
import { Z_IsEmpty20 } from "@/utils/fn";
import {
  Popup,
  Group,
  XInput,
  XTextarea,
  Selector,
  Flexbox,
  FlexboxItem,
  XButton
} from "vux";
export default {
  components: {
    ZingHead,
    Dropdown,
    Tree,
    Popup,
    Group,
    XInput,
    XTextarea,
    Selector,
    Flexbox,
    FlexboxItem,
    XButton,
    Scroll
  },
  data() {
    return {
      placeStorageTitle: "存放地点",
      PlaceStorage: {},
      newItem: false,
      deleteItem: false,
      popup: false,
      showRightTag: true,
      rightMenu: [
        {
          content: "新建"
        },
        {
          content: "删除"
        }
      ],
      menu: [
      ],
      deleteData: [],
      tempItem: {},
      level: false,
      levelFirst: false
    };
  },
  created() {
    this.getPlaceData();
  },
  methods: {
    //添加子集 判断类别是否被使用 类别被使用不允许添加 是否为最后一级 左后一级不予许添加 不可跨级添加
    addItem(item) {
      let vm = this;
      vm.tempItem = item;
      let assetLength = item.code.split(".").length;
      if (assetLength >= 5) {
        this.$vux.toast.text("类别最多增加5级（含一级）");
        return;
      } else {
        this.popup = true;
        vm.PlaceStorage.assetCode = item.code;
      }
    },
    // 获取存放点数据
    getPlaceData() {
      this.$http.get("/zingbiz/fixedAssets/configuration/getAllStorePlaceConfiguration", {}).then(res => {
        // this.menu = res.data.data;
        this.menu = [...res.data.data]
      });
    },
    // 新增接口
    updatePlaceData(url) {
        let vm = this
      this.$http
        .get("", {
          code: vm.PlaceStorage.assetCode,
          name: vm.PlaceStorage.assetName
        })
        .then(res => {
          this.menu = res.data.data;
        });
    },
    checkIcon(item) {
      this.deleteData = item;
    },
    // 批量删除 （ 删除时，验证 使用状态 是否已经被使用，如被使用，则不允许删除，并给予提示。否则可以删除，并提示删除成功。）
    deleteCount() {
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
          vm.$http
            .post("/zingbiz/fixedAssets/configuration/checkStorePlaceConfigurationUsing", {
              id: vm.deleteData.id
            })
            .then(res => {
              if (res.data.success) {
                let deletaItem = res.data.data;
                if (!deletaItem.hasUsed) {
                  vm.$http
                    .post("/zingbiz/fixedAssets/configuration/deleteStorePlaceConfiguration", {
                      id: vm.deleteData.id
                    })
                    .then(res => {
                      if (res.data.success) {
                          setTimeout( function() {
                            vm.getPlaceData();
                            vm.$vux.toast.text(res.data.mgs);
                            vm.deleteItem = false;
                             vm.showRightTag = true
                        },3000)
                      } else {
                            vm.$vux.toast.text(res.data.mgs);
                        }
                    });
                } else {
                     vm.$vux.toast.text("该存放地点被使用，则不允许删除");
                }
              }
            });
        }
      });
    },
    //跳转到编辑界面 001 和 002 不可添加跳转
    editItem(item) {
      if (this.deleteItem || this.newItem) {
        return;
      } else {
        this.$router.push({
          path: "addPlaceStorage",
          query: {
            type: "update",
           item: item
          }
        });
      }
    },
    //取消新建
    cancleNew() {
      this.popup = false;
      this.level = false;
    },
    //确认新建
    confirmNew() {
      //确认提交
      let vm = this;
      if (this.level) {
        //增加一级类别
        //判断不可重复添加和格式
        if (/^(?!0{2})\d{2}$/.test(vm.PlaceStorage.assetCode)) {
            console.info(vm.PlaceStorage.assetCode)
        } else {
          this.$vux.toast.text("请输入正确的代码格式");
          return;
        }
      } else {
        // 代码验证（①子集范围001-999；②输入代码与父级代码一致；③ 验证重复输入）
        let currParaLength = vm.PlaceStorage.assetCode.split(".").length;
        let paraLenght = vm.tempItem.code.split(".").length;
        //获取父级id数组
        let idCode = vm.tempItem.code.split(".").slice(0, paraLenght);
        //获取输入的父级id数组
        let addCode = vm.PlaceStorage.assetCode
          .split(".")
          .slice(0, currParaLength - 1);
        // 获取输入的子集编码
        let childCode = vm.PlaceStorage.assetCode.split(".")[
          currParaLength - 1
        ];
        // 判断输入的父级是否与数据父级是否一致
        if (paraLenght + 1 === currParaLength) {
          // 进行子集范围01-99验证
          if (/^(?!0{2})\d{2}$/.test(childCode)) {
            //针对输入的父级
            if (idCode.toString() === addCode.toString()) {
              let childData = vm.tempItem;
              if (!Z_IsEmpty20(childData.children)) {
                childData.children.forEach(item => {
                  if (vm.PlaceStorage.assetCode === item.code) {
                    this.$vux.toast.text("不可以重复添加");
                     return;
                  } else {
                   console.info(vm.PlaceStorage.assetCode)
                  }
                });
              }
            } else {
              vm.$vux.toast.text("父级编码必须以" + vm.tempItem.code);
              return;
            }
          } else {
            vm.$vux.toast.text("子集编码需在01-99之间");
            return;
          }
        } else {
          vm.$vux.toast.text("代码格式不正确");
           return;
        }
      }
      if (Z_IsEmpty20(vm.PlaceStorage.assetName)) {
        vm.$vux.toast.text("请输入资产类别名称");
      }
      let parentId = vm.tempItem.id ? { parentId: vm.tempItem.id } : { parentId: "0" };
        let url = "/zingbiz/fixedAssets/configuration/addStorePlaceConfiguration";
        let param = {
            code: vm.PlaceStorage.assetCode,
            name: vm.PlaceStorage.assetName
        }
        param = Object.assign( {}, param, parentId)
        this.$http.post(url, param).then(res => {
        if (res.data.success) {
             vm.$vux.toast.text(res.data.mgs);
             vm.popup = false
             vm.getPlaceData();
        } else {
          vm.$vux.toast.text(res.data.mgs);
        }
      });
    },
    // 点击右侧下拉框菜单选项
    handleMenu(data) {
      if (data.content === "新建") {
        this.levelFirst = true;
        this.newItem = true;
        this.showRightTag = false;
      } else {
        this.deleteItem = true;
        this.showRightTag = false;
      }
    },
    //导航栏返回时间
    close() {
      if (this.newItem === false && this.deleteItem === false) {
        this.$router.back(-1);
      } else {
        this.levelFirst = false;
        this.newItem = false;
        this.deleteItem = false;
        this.showRightTag = true;
      }
    },
    //添加一级
    increaseFirst() {
      this.popup = true;
      this.level = true;
    },
    onHide() {
      this.level = false;
    }
  }
};
</script>

<style>
.left-wrapper-title {
  margin-top: 6px;
}
.placeStorage {
  height: 100%;
}
.placeStorage .list-warp {
  height: calc(100%-95px);
}
.placeStorage .assetName .weui-cell__hd:before,
.placeStorage .code .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}

.placeStorage .initFrom-title {
  height: 40px;
  line-height: 40px;
  background-color: white;
  font-size: 18px;
  text-align: center;
}
.interspace {
  margin-left: 0px !important;
  text-align: center;
  padding: 5px 0;
}
.interspace:last-child {
  border-left: 1px solid #f5f5f5;
  color: #ff8000;
}
.placeStorage .weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.placeStorage .initFrom-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px !important;
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
