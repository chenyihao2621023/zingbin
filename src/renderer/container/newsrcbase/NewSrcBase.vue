<template>
  <div class="new-src-base">
    <div class="new-src-base-header border-1px">新建仓库</div>
    <group label-width="5em" label-margin-right="2em" label-align="left">
      <x-input title="资源库名称" v-model="sourceForm.name" placeholder="房管局" novalidate></x-input>
      <x-textarea title="资源库描述" v-model="sourceForm.desc"></x-textarea>
      <selector placeholder="请选择资源库类型" title="省份" :options="list" v-model="sourceForm.type"></selector>
      <Cell primary="content" title="参与者" align-items="start" value-align="left">
        <div class="role-tag">
          <tag type="success" v-for="(item, index) in tagData" :key="index">{{item.title}}</tag>
          <x-button mini type="primary" @click.native="addPartner">添加</x-button>
        </div>
      </Cell>
    </group>
    <div v-transfer-dom>
      <x-dialog v-model="dialogShow" class="src-base-dialog">
        <div class="src-base-dialog-wrapper">
          <div class="wrapper-header">
            <div class="header-close">
              <i class="iconfont icon-fangkeduanguanbi"
              @click="handleClose">
              </i>
            </div>
          </div>
          <search
            @on-submit="onSubmit"
            @on-change="getResult"
            v-model="roleValue"
            position="absolute"
            auto-scroll-to-top top="46px"
            ref="search">
          </search>
          <tag type="success" v-for="(item, index) in tagData" :key="index" @click.native="tagClick(item,index)">
            {{item.title}}
          </tag>

          <tab>
            <tab-item selected @on-item-click="onItemClick($event, 'partner')">同事</tab-item>
            <tab-item @on-item-click="onItemClick($event, 'role')">角色</tab-item>
          </tab>
          <div class="src-partner" v-show="activeName === 'partner'" @touchstart="redrawRole" @mousedown="redrawRole">
            <scroll ref="scrollRole" :freeScroll="true">
              <zi-tree
                ref="roleTree"
                checkable
                :props="defaultProps"
                @delete="deleteNode"
                @edit="editNode"
                @add="addNode"
                @check="checkFn($event,'roleTree')"
                @select="select"
                @click-menu="clickMenu"
                :data="treeData"
                :menuData="menuData"
                defaultExpandAll
                moreBtn
                editBtn
                deleteBtn
                addBtn
                show-line
              />

              <!-- fix: dropdown 被隐藏的问题 -->
              <div class="height-hack"></div>
            </scroll>
          </div>
          <div class="src-role" v-show="activeName === 'role'"  @touchstart="redrawPart" @mousedown="redrawPart">
            <scroll ref="scrollPart" :freeScroll="true">
              <div>
                <zi-tree
                  ref="partTree"
                  :props="defaultProps"
                  @delete="deleteNode"
                  @edit="editNode"
                  @add="addNode"
                  @check="checkFn($event, 'partTree')"
                  @select="select"
                  @click-menu="clickMenu"
                  :data="treeData2"
                  :menuData="menuData"
                  checkable
                  defaultExpandAll
                  moreBtn
                  editBtn
                  deleteBtn
                  addBtn
                  show-line
                />

              </div>

            </scroll>
          </div>
          <div class="wrapper-footer">
            <flexbox>
              <flexbox-item>
                <x-button type="default" @click.native="cancel">取消</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary" @click.native="confirm">确定</x-button>
              </flexbox-item>
            </flexbox>
          </div>

        </div>
      </x-dialog>

    </div>
  </div>
</template>

<script>
import {
  Group,
  XInput,
  XTextarea,
  Selector,
  Cell,
  XButton,
  XDialog,
  TransferDomDirective as TransferDom,
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  Search
} from "vux";
import ZiTree from "components/zitree/ZiTree"
import Scroll from "components/scroll/Scroll"
import Tag from "components/tag/Tag"
import IconPicker from 'components/iconpicker/IconPicker'
import { recursiveFilter } from '../../utils/fn'
import _ from "lodash";
export default {
  name: "NewSrcBase",
  directives: {
    TransferDom
  },
  components: {
    Group,
    XInput,
    XTextarea,
    Selector,
    Cell,
    XButton,
    XDialog,
    ZiTree,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    Scroll,
    Tag,
    Search,
    IconPicker
  },
  data() {
    return {
      list: [{ key: "gd", value: "广东" }, { key: "gx", value: "广西" }],
      roleValue: '',
      sourceForm: {
        name: "",
        desc: "",
        type: ""
      },
      dialogShow: false,
      testShow: false,
      activeName: 'partner',
      defaultProps: {
        title: "title",
        children: "children",
        src: "url",
        auth: "yanzheng"
      },
      treeInitData: [
        {
          title: "客服部",
          children: [
            {

              title: "客服1部",
              children: [
                {
                  id: 0,
                  title: "陈亦好id0",
                  yanzheng: true,
                  checked: true
                },
                {
                  id: 1,
                  title: "陈亦好id1",
                  yanzheng: true
                }
              ]
            }
          ]
        },
        {
          title: "研发部",
          checked: false,
          children: [
            {
              title: "庄文达"
            },
            {
              title: "阎现军",
              edit: true,
              checked: false
            },
            {
              title: "刘广峰",
              checked: false,
              children: []
            },
            {
              title: "李扬",
              checked: false,
              children: [
              {
                id: 0,
                title: "阿黄id0"

              },
              {
                id: 1,
                title: "阿花id1",
                checked: false,
              },
              {
                id: 3,
                title: "阿红id3",
                checked: false,
              },
              ]
            },
          ]
        }
      ],
      menuData: [
        {content: '新建'},
        {content: '删除', disabled: true},
        {content: '更改'},
        {content: '发起会话'}
      ],
      treeData: [],
      treeData2: [
        {
          title: "客服部",
          children: [
            {
              title: "客服1部",
              children: [
                {
                  id: 10,
                  title: "陈亦好",
                  yanzheng: true
                }
              ]
            }
          ]
        },
        {
          title: "研发部",
          checked: false,
          children: [
            {
              id: 0,
              title: "庄文达id0"
            },
            {
              id: 1,
              title: "阎现军id1",
              edit: true,
              checked: false
            },
            {
              title: "刘广峰",
              checked: false,
              children: []
            },
            {
              title: "李扬",
              checked: false,
              children: [
              {
                id: 3,
                title: "阿黄id3"

              },
              {
                id: 0,
                title: "阿花",
                checked: false,
              },
              {
                title: "阿红",
                checked: false,
              },
              ]
            },
          ]
        }
      ],
      checkedDate: [],
      tagData: []
    };
  },
  methods: {
    cancel() {
      this.$refs.roleTree.setCheckedNodes({leaf: "阿花"})
    },
    clickMenu(item) {

    },
    editNode(item) {
      this.$refs.roleTree.editNode(item.origin.clue, { title: '123' })
    },
    deleteNode(item) {
      this.$refs.roleTree.delNode(item.origin.clue)
    },
    addNode(item) {
      this.$refs.roleTree.addNode(item.origin.clue,{title: 'addNode'})
    },
    onSubmit() {
      this.filter(this.roleValue)
    },
    getResult(value) {
      if(!value) {
        this.filter('')
      }
    },

    confirm() {
      this.tagData = []
      this.checkedDate.forEach( item => {
        if(item.isLeaf) {
          this.tagData.push(item)
        }
      })
      this.dialogShow = false
    },
    tagClick(item, index) {
      let roleData = this.$refs.roleTree.getNodeById('id', item.id)[0]
      let partData = this.$refs.partTree.getNodeById('id', item.id)[0]
      this.$set(roleData, 'checked', false)
      this.$set(partData, 'checked', false)
      this.tagData.splice(index, 1)
    },
    select(data) {
      let selected, arr
      arr = data.selectedNodes
      if(data.node.selected) {
        this.$refs.roleTree.filterSelect(arr, 'id')
      }else {
        this.$refs.roleTree.clearSelect()
      }
    },
    checkFn(e,flag) {
      let checked,arr,canPush, delIndex, target
      switch (flag) {
        case 'roleTree':
          checked = e.currentNode.checked
          arr = this.$refs.roleTree
            .getNodes([e.currentNode], checked ? { checked: checked, isLeaf:true, childrenCheckedStatus: 2 } : {checked: checked, isLeaf:true})

          this.$refs.roleTree.filterCheck(arr, e.currentNode.checked,'id')
          this.$refs.partTree.filterCheck(arr, e.currentNode.checked,'id')
          arr.forEach( item => {

            if(checked) {
              canPush = !this.tagData.find( tag => {
                return tag.id === item.id
              })

              canPush && this.tagData.push(item)


            }else {
              delIndex = this.tagData.findIndex( tag => {
                return tag.id === item.id
              })
              this.tagData.splice(delIndex, 1)
            }
            // target = this.$refs.partTree.getNodeById('id', item.id)[0]
            // this.$set(target, 'checked', checked)
          })
          break;
        case 'partTree':
          checked = e.currentNode.checked
          arr = this.$refs.partTree
            .getNodes([e.currentNode], checked ? { checked: checked, isLeaf:true, childrenCheckedStatus: 2 } : {checked: checked, isLeaf:true})
          arr.forEach( item => {
            if(checked) {
              canPush = !this.tagData.find( tag => {
                return tag.id === item.id
              })

              canPush && this.tagData.push(item)


            }else {
              delIndex = this.tagData.findIndex( tag => {
                return tag.id === item.id
              })
              this.tagData.splice(delIndex, 1)
            }
            target =  this.$refs.roleTree.getNodeById('id', item.id)[0]
            target && this.$set(target, 'checked', checked)
          })
          break;
        default:
          break;
      }

    },

    addPartner() {
      this.dialogShow = true
    },

    filter(value) {
      this.treeData = recursiveFilter(this.treeInitData, value);
    },
    onItemClick(e, name) {
      this.activeName = name
    },
    handleClose() {
      this.dialogShow = false
    },
    redrawRole() {
      this.$refs.scrollRole.refresh()
    },
    redrawPart() {
      this.$refs.scrollPart.refresh()
    }
  },
  mounted() {
    this.treeData = _.clone(this.treeInitData)

  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable.styl';
@import '../../assets/stylus/mixin.styl';


.mock-wrapper
  height: 200px
  background: #fff

.new-src-base {
  &-header {
    padding: 20px 10px;
    font-weight: bold;
    border-1px($border-color-base);
  }
  .role-tag {
    .tag + .tag {
      margin-left: 10px;
    }
  }

  .weui-search-bar__label {
    top: 6px;
  }
}

.src-base-dialog {
  .weui-dialog {
    text-align: left;
    .tag {
      margin-left: 10px;
    }
  }
  &-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .wrapper-header {
      padding: 20px;
      background-color: $background-dialog
      flex-center(row-reverse, start, center)
    }
    .src-partner {
      padding: 10px 0 0 20px;
      height: 300px;
      overflow: hidden;
      position: relative;
      .height-hack {
        height: 120px;
      }
    }
    .src-role {
      padding: 10px 0 0 20px;
      height: 300px;
      overflow: hidden;
      position: relative;
    }
    .wrapper-footer {
      padding: 10px 20px
    }
  }
}
.scroll-partner {
  height: 300px
}


</style>

