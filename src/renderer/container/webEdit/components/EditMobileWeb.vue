<template>
  <div class="editMobileWeb" style="height: 100%">
    <div class="main">
      <div class="nav-continer">
        <div class="nav-list" v-for="(items,index) in NavListData" :key="index">
          <group>
            <div class="level-head" @click="collapseMenu(index)">
              <cell class="level-title" is-link :border-intent="false"
                    :arrow-direction="saveList[index] ? 'down' : 'left'">
                <h5 slot="title">{{items.name}}</h5>
              </cell>
              <span class="right-icon" v-if="flagTow && saveList[index] && NavListData.length > 1"
                    @click="delLevelOne(index,$event)">
                  <icon type="cancel"></icon>
              </span>
            </div>
            <div class="level-content" v-for="(row,i) in items.list" :key="i">
              <div class="title text">
                <x-input ref="titleInput" required :max="flagTow ? 4 : 8" v-model="row.menuName" @on-change="inputChange"
                         placeholder="请输入标题"></x-input>
                <x-button class="btn right-btn" @click.native="setEnable(index,i)" type="primary">
                  {{row.isStart === '1' ? '停用':'启用'}}
                </x-button>
              </div>
              <div v-show="saveList[index]">
                <div class="nav-type">
                  <span class="selector" @click="selectLinkType(index,i,items)">
                      <cell class="title text" is-link :border-intent="false"
                            :disabled="hasChildren(items)"
                            :arrow-direction="'left'">
                            <span slot="title">{{formatType(row)}}</span>
                      </cell>
                  </span>
                  <span>
                     <p class="text" v-show="!hasChildren(items) && row.linkType === '0'">
                       <span v-show="hasSaved" style="color: #ff8000"
                             @click="goGraphic(index,row)">点击进入图文消息</span>
                       <span v-show="!hasSaved">待保存后新建图文消息</span>
                     </p>
                    <p class="text" v-show="hasChildren(items)">使用二级导航后主链接失效</p>
                  </span>
                  <span class="right-icon" v-if="!flagTow && saveList[index]" @click="delSublevel(index,i)">
                      <icon type="cancel"></icon>
                  </span>
                </div>
                <!--自定义链接-->
                <div class="custom-type" v-show="!hasChildren(items) && row.linkType === '1'">
                  <span class="head">
                   <popup-radio :options="['http://','https://']" v-model="row.httpPrefix"
                                @on-hide="httpPrefixChange"></popup-radio>
                  </span>
                  <x-input ref="urlInput" required show-clear @on-change="inputChange" :placeholder="'www.xxx.com'" v-model="row.url"></x-input>
                </div>
                <!--显示几个图文标题-->
                <div v-if="!hasChildren(items)">
                  <div class="thumb-t" v-for="(arc,num) in row.menuDetailsList" v-if="num<3" @click="goEdit(arc)"
                       :key="num">
                    {{arc.title}}
                  </div>
                  <div class="thumb-t" style="color: #3d7da6;"
                       v-if="row.menuDetailsList && row.menuDetailsList.length>3" @click="goGraphic(index,row)">
                    查看更多图文消息...
                  </div>
                </div>
                <editMobileWeb v-if="items.flag" :hasSaved="hasSaved" @hasChange="hasChange"
                               :flagTow="false" :NavListData="items.childMenuList" :dataAlready="dataAlready">
                </editMobileWeb>
                <x-button class="add-second-btn" @click.native="newSecondary(index,row)" v-if="flagTow"
                          v-show="NavListData[index].childMenuList[0].list.length<12">
                  + 新建二级导航
                </x-button>
              </div>
            </div>
          </group>
        </div>
      </div>
      <x-button class="btn save-btn" :class="{saveBefore:hasSaved}" @click.native="saveData()" type="primary">保存
      </x-button>
    </div>
    <div hidden>
      <div v-transfer-dom>
        <popup v-model="switchTypeModal">
          <popup-header
            :left-text="'取消'"
            :right-text="'确定'"
            :title="'请选择'"
            :show-bottom-border="false"
            @on-click-left="switchTypeModal = false"
            @on-click-right="okLinkType"></popup-header>
          <group gutter="0">
            <radio v-model="selectedTypeKey" :options="typeOption"></radio>
          </group>
        </popup>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    Cell,
    XInput,
    Group,
    XButton,
    Toast,
    Confirm,
    Icon,
    TransferDom,
    Radio,
    Popup,
    PopupHeader,
    PopupPicker,
    PopupRadio
  } from 'vux'

  export default {
    name: 'EditMobileWeb',
    directives: {
      TransferDom
    },
    components: {
      Cell,
      XInput,
      Group,
      XButton,
      Toast,
      Confirm,
      Icon,
      Radio,
      Popup,
      PopupHeader,
      PopupPicker,
      PopupRadio
    },
    props: {
      //该组件存在递归自调用,绑定的值是递归时传入的
      NavListData: [],
      //右侧菜单是否显示,递归第2层开始不显示,,并用于标题输入设置控制
      flagTow: {
        type: Boolean,
        default: false
      },
      //原始menuId集合
      oldRowIdList: {
        type: Array,
        default: []
      },
      //导航数据是否已保存变动, 该组件属于递归调用,统一使用一个值
      hasSaved: {
        type: Boolean,
        default: function () {
          return true;
        }
      },
      //请求的数据是否已准备完成,用于文本框的变动监听,初始渲染时不监听
      dataAlready: {
        type: Boolean,
      }
    },
    data() {
      return {
        typeOption: [
          {key: '0', value: '图文类型',},
          {key: '1', value: '自定义链接',},
        ],
        switchTypeModal: false,     //选择连接类型modal
        selectedTypeKey: "",        //选择后绑定的值
        levelOneIndex: '',          //一级导航索引
        levelTwoIndex: '',          //二级导航的子项索引
        saveList: [],               //展开折叠控制器

        menuNameArr: [],            //保存导航名称,进行校验
        menuTypeUrl: [],             //保存导航自定义链接,进行校验
        menuTypeArr: [],             //导航类型校验

        inputAlready: false,     //input数据是否渲染完成,否的话不监听变化
      }
    },
    watch: {
      dataAlready: {
        handler: function (flag) {
          if (flag) {
            //当数据准备完成之后,再监听输入框变动,
            this.$nextTick(() => {
              this.inputAlready = true;
            })
          }
        },
        immediate: true,
      },
    },
    methods: {
      hasChange(flag) {
        this.$emit("hasChange", flag);
      },
      formatType(item) {
        let type = item.linkType;
        if (type === "0") {
          return "图文类型"
        } else if (type === "1") {
          return "自定义链接"
        } else {
          return "请选择链接类型"
        }
      },
      //检验是否存在二级菜单
      hasChildren(items) {
        if (items.childMenuList && items.childMenuList.length && items.childMenuList[0].list.length > 0) {
          this.$set(items, "linkType", "");
          return true;
        }
        return false;
      },
      inputChange(v) {
        if (!this.inputAlready) {
          return;
        }
        this.$emit("hasChange", false);
      },
      httpPrefixChange() {
        this.$emit("hasChange", false);
      },
      //选择连接类型
      selectLinkType(index, i, items) {
        if (this.hasChildren(items)) {      //有二级导航时,选择不可用
          return;
        }
        this.levelOneIndex = index;
        this.levelTwoIndex = i;
        this.switchTypeModal = true;
      },
      //确定类型选择
      okLinkType() {
        if (!this.selectedTypeKey) return;
        if (this.levelOneIndex === '' || this.levelTwoIndex === '') {
          return;
        }
        this.switchTypeModal = false;
        let vm = this;
        if (!vm.NavListData[vm.levelOneIndex].list[vm.levelTwoIndex].linkType) {
          switchType();
        } else {
          this.$vux.confirm.show({
            title: '提示',
            content: '切换链接类型需要删除原有内容,确定切换吗？',
            onConfirm() {
              switchType();
            }
          })
        }

        function switchType() {
          vm.$emit("hasChange", false);
          switch (vm.selectedTypeKey) {
            case '1':
              vm.$set(vm.NavListData[vm.levelOneIndex].list[vm.levelTwoIndex], 'linkType', '1');
              vm.$set(vm.NavListData[vm.levelOneIndex].list[vm.levelTwoIndex], 'httpPrefix', 'https://');
              break;
            case '0':
              vm.$set(vm.NavListData[vm.levelOneIndex].list[vm.levelTwoIndex], 'linkType', '0');
              break;
            default:
              vm.$set(vm.NavListData[vm.levelOneIndex].list[vm.levelTwoIndex], 'linkType', '');
          }
        }
      },
      //新增菜单
      insertMenu() {
        let insertUrl = "/zingbiz/tuwen/tuwenManage/insertMenu";
        let o = this.NavListData.filter(item => !item.id);          //对没有id的进行插入
        if (!o.length) {
          return;
        }
        let insertData = o.map(item => this.organizeData(item)[0]);

        let flag = this.menuNameArr.every(item => item);
        if (!flag) {
          this.$vux.toast.text("请输入标题", 'bottom');
          return
        }

        flag = this.menuTypeArr.every(row => {
          return row === "0" || row === "1";
        });
        if (!flag) {
          this.$vux.toast.text("请选择导航类型", 'bottom');
          return
        }

        flag = this.menuTypeUrl.every(url => url);
        if (!flag) {
          this.$vux.toast.text("请输入自定义连接", 'bottom');
          return
        }
        return this.$http.post(insertUrl, insertData)
      },
      //修改菜单
      updateMenu() {
        let updateUrl = '/zingbiz/tuwen/tuwenManage/updateMenu';
        let o = this.NavListData.filter(item => item.id);        //对有id的进行更新
        if (!o.length && !this.oldRowIdList.length) {
          return;
        }
        let updateData = o.map(item => {
          return this.organizeData(item)[0]
        });
        //标题校验
        let flag = this.menuNameArr.every(item => item);
        if (!flag) {
          this.$vux.toast.text("请输入标题", 'bottom');
          return
        }
        //类型校验
        flag = this.menuTypeArr.every(row => {
          return row === "0" || row === "1";
        });
        if (!flag) {
          this.$vux.toast.text("请选择导航类型", 'bottom');
          return
        }
        //自定义url校验
        flag = this.menuTypeUrl.every(url => url);
        if (!flag) {
          this.$vux.toast.text("请输入自定义连接", 'bottom');
          return
        }
        let params = {
          menuList: updateData,
          oldRowIds: this.oldRowIdList,
        };
        return this.$http.post(updateUrl, params)
      },
      //处理保存按钮数据
      organizeData(data) {
        let a = data.list.map(item => {
          //保存校验title
          this.menuNameArr.push(item.menuName);
          //保存校验自定义url
          if (item.linkType === "1") {
            this.menuTypeUrl.push(item.url);
          }
          //保存校验类型,有子级,本级不校验
          if (!data.childMenuList || !data.childMenuList.length || !data.childMenuList[0].list.length) {
            this.menuTypeArr.push(item.linkType);
          }

          let obj = {
            isStart: item.isStart,
            linkType: item.linkType,
            menuName: item.menuName || '',
            url: item.url || '',
            httpPrefix: item.httpPrefix,
          };
          if (item.menuId) {
            obj.menuId = item.menuId;
          }
          if (item.parentId) {
            obj.parentId = item.parentId
          }
          if (data.childMenuList) {
            obj.childMenuList = this.organizeData(data.childMenuList[0]);
          }
          return obj
        });
        return a;
      },
      //合并处理接口
      saveData() {
        if (this.hasSaved) {
          return;
        }
        //手动blur输入框显示校验信息
        this.$refs.urlInput.forEach(row => {
          row.onBlur();
        });
        this.$refs.titleInput.forEach(row => {
          row.onBlur();
        });
        this.menuNameArr = [];    //每次保存前,清空保存的标题缓存校验
        this.menuTypeUrl = [];    //每次保存前,清空保存的导航自定义校验
        this.menuTypeArr = [];
        let vm = this;
        vm.$http.all([
          vm.insertMenu(),
          vm.updateMenu(),
        ]).then(vm.$http.spread((insertMenu, updateMenu) => {
          if (!insertMenu && !updateMenu) {
            return;
          }
          if ((insertMenu && insertMenu.data.success) || (updateMenu && updateMenu.data.success)) {
            vm.$vux.toast.text("保存成功", 'bottom');
            vm.$emit("hasChange", true);
            vm.menuNameArr = [];
            vm.menuTypeUrl = [];
            vm.menuTypeArr = [];
            vm.oldRowIdList = [];
          } else {
            vm.$vux.toast.text("保存失败", 'bottom');
          }
        })).catch(err => {
          console.error(err);
          vm.$vux.toast.text("保存失败", 'bottom');
          vm.oldRowIdList = [];
        });
      },
      //判断是否启用导航
      setEnable(index, i) {
        let vm = this;
        let isFlag = this.NavListData[index].list[i].isStart === '1' ? '0' : '1';
        let content = isFlag === '1' ? '确认要启用该导航吗？' : '确认要停用该导航吗';
        this.$vux.confirm.show({
          title: '提示', content,
          onConfirm() {
            vm.$set(vm.NavListData[index].list[i], 'isStart', isFlag);
            vm.$emit("hasChange", false);
          },
        })
      },
      //添加二级,置空上级的url和linkType
      newSecondary(index, item) {
        if (this.NavListData[index].childMenuList[0].list && this.NavListData[index].childMenuList[0].list.length >= 10) {
          this.$vux.toast.text("二级菜单最多添加10个", 'bottom');
          return;
        }
        this.$emit("hasChange", false);
        item.url = '';
        item.linkType = '-1';
        this.NavListData[index].childMenuList[0].list.push({
          isStart: '1',
          linkType: ''
        })
      },
      delLevelOne(i, e) {
        e.stopPropagation();
        this.$emit("changeList", i);
      },
      delSublevel(index1, index2) {
        this.$emit("hasChange", false);
        this.NavListData[index1].list = this.NavListData[index1].list.filter((item, i) => i !== index2);
      },
      //设置折叠菜单
      collapseMenu(i) {
        this.$set(this.saveList, i, !this.saveList[i]);
      },
      goEdit(arc) {
        this.$router.push({
          path: "/addGraphic",
          query: {
            detailsId: arc.detailsId,
          },
        })
      },
      goGraphic(index, row) {
        console.log("图文", index, row);
        if (!row.menuId) {
          this.$vux.toast.text("缺少参数,请保存后刷新页面", 'bottom');
          return;
        }
        this.$router.push({
          path: "/graphicList",
          query: {
            // index: index,
            menuId: row.menuId,
            // parentId:row.parentId
          }
        })
      },
    },
  }
</script>
<style>
  .editMobileWeb .nav-list .weui-cell__bd input {
    text-align: left !important;
    display: flex;
  }

  .editMobileWeb .weui-btn:after,
  .editMobileWeb .weui-cells:before {
    border: none !important;
  }

  .editMobileWeb .weui-cell:before {
    border: none !important;
  }
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../../assets/stylus/mixin.styl';
  .main {
    flex-column(column)
    .nav-continer {
      height: 100%;
      overflow: auto;
      .nav-list {
        margin: 10px;
        .thumb-t {
          padding: 10px;
          font-size: 13px;
          border-bottom: 1px solid #dedede;
          text-ellipsis(nowrap, ellipsis)
        }
      }
      .level-head {
        display flex;
        justify-content: space-between
        width 100%;
        border-bottom: 1px solid #dedede;
        .level-title h5 {
          width 100%
          font-size 16px;
          font-weight: 700;
        }
      }
      .level-content {
        width 100%;
        .title {
          display: flex;
          width: 100%;
          border-bottom: 1px solid #dedede;
          align-items: center;
        }
        .text {
          color: grey;
          font-size: 13px;
        }
        .nav-type {
          flex-center(row, space-between, center)
          width: 100%;
          font-size: 14px;
          border-bottom: 1px solid #dedede;
          .weui-cell {
            border: none;
          }
        }
        .custom-type {
          flex-center(row, space-between, center)
          border-bottom: 1px solid #dedede;
          .head {
            width: 100px;
          }
        }
        .selector {
          display: inline-block;
          white-space: nowrap;
        }
        .nav-list {
          margin-top: 0;
          margin-right: 0;
        }
        .right-btn {
          margin-right: 10px;
        }
        .save-btn {
          display: none;
        }

      }
      .right-icon {
        display: flex;
        align-items: center;
        margin-right: 20px;
      }
      .btn {
        width: 50px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        font-size: 14px
      }
    }
    .saveBefore {
      background-color: #8b8b8b;
    }
    .add-second-btn {
      width: 250px;
      margin: 15px auto;
      height: 40px;
      border: 1px dashed grey;
      font-size: 16px;
      background-color: white;
    }
  }
</style>
