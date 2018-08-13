<template>
  <div>
      <popup v-model="showSortBoard" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto'}">
          <zing-head cancelText="分类管理" @doSome="goBack" :isComeBack="false">
              <div slot="header-right">
                  <span @click="onShowDialog" slot="header-right" style="margin-right:20px;">添加</span>
              </div>
          </zing-head>
          <grid-card class="sort-list-item" v-for="(item ,index) in allSortData " :key="index">
              <div slot="cardLeft" class="left">
                  <div class="left-wrapper">
                      <p class="left-wrapper-title">{{item.tags}}</p>
                  </div>
              </div>
              <div slot="cardRight" class="right">
                  <button class="sort-list-item-btn" @click="upShowDialog(item)">属性</button>
                  <button class="sort-list-item-btn" @click="delShowItem(item)">删除</button>
              </div>
          </grid-card>
          <sort-dialog
              :operateType="operateType"
              :showDialog="showDialog"
              @addSort="onAddSort"
              :sortItemData="sortItemData"
              @dialogCancel="dialogCancel"
              @dialogSubmit="dialogSubmit"
          >
          </sort-dialog>
      </popup>
  </div>
</template>
<script>
    import ZingHead from "../../components/zingHead/ZingHead.vue"
    import { Popup } from "vux"
    import GridCard from "../../components/gridcard/GridCard.vue"
    import SortDialog from "./SortDialog.vue"
    import Qs from 'qs'
  export default {
    name: 'SortBoard',
    components: {
        ZingHead,Popup,GridCard,SortDialog
    },

    props: {
        showSortBoard: {
            type: Boolean,
            default:false
        },
        allSortData: {
            type:Array,
            default() {
                return []
            }
        }
    },
    data() {
      return {
          rowId:'',
          operateType:'add',
          myFriendList: [],
          showDialog: false,
          sortItemData:[
              {
                  title:'',
                  text:'请输入分类名称',
                  showPrompt:false,
                  prompt:'分类名称不能为空'
              },
              {
                  title:'',
                  text:'请输入显示顺序',
                  showPrompt:false,
                  prompt:'显示顺序不能为空'
              }
          ]
      }
    },
    computed: {},
    methods: {
        goBack() {
            this.$emit('hideSortBoard')
        },
        dialogCancel() {
            this.showDialog = false;
            this.sortItemData[0].showPrompt = false;
            this.sortItemData[1].showPrompt = false;
        },
        onShowDialog() {
            this.sortItemData[0].title = '';
            this.sortItemData[1].title = '';
            this.operateType = 'add';
            this.showDialog = true
        },
        upShowDialog(item) {
            this.sortItemData[0].title = item.tags;
            this.sortItemData[1].title = item.sordId;
            this.rowId = item.rowId;
            this.operateType = 'upda';
            this.showDialog = true;
        },
        delShowItem(item) {
            const that = this;
            item && this.$vux.confirm.show({
                // 组件除show外的属性
                title:'提示',
                content:`确定删除${item.tags}分类么?`,
                onConfirm () {
                    that.rowId = item.rowId;
                    that.onDelSort();
                }
            })
        },
        dialogSubmit(type) {
            let textList = [];
             this.sortItemData.forEach(item => {
                 if (item.title) {
                     textList.push(item.title);
                     item.showPrompt = false;
                 } else {
                     item.showPrompt = true
                 }
            });
           if (textList.length === 2) {
               switch (type) {
                   case 'add':
                       this.onAddSort(textList);
                       break;
                   case 'upda':
                       this.onUpSort(textList);
                       break;
               }
           }
        },
        onAddSort(textList) {
            let url = '/ZingMH/ZDesk/MENHUWX/MHServiceN/addNewType.action';
            let params = {
                tags: textList[0],
                sordId: textList[1],
                tagType: 'myFriend',
                companyId:'',
                isCompanyId:''
            };
            this.$http.post(url,Qs.stringify(params)).then(res => {
                if (res.data.success) {
                    this.bottomToast('添加分类成功');
                    this.showDialog = false;
//                    this.$emit('addSortData',res.data.ret);
                    this.$emit('addSortData');
                } else {
                    this.bottomToast('添加分类失败');
                }
            }).catch(err => {
                console.error(err)
                this.bottomToast("添加分类失败")
            })
        },
        onUpSort(textList) {
            console.log('updateNewType');
            let url = '/ZingMH/ZDesk/MENHUWX/MHServiceN/updateNewType.action';
            let params = {
                tags: textList[0],
                sordId: textList[1],
                tagType: 'myFriend',
                companyId:'',
                isCompanyId:'',
                 rowId: this.rowId
            };
            this.$http.post(url,Qs.stringify(params)).then(res => {
               if (res.data.success) {
                   this.bottomToast("更新成功");
                   this.showDialog = false;
                   this.$emit('updaSortData',res.data.ret)
               } else {
                   this.bottomToast("更新失败")
               }
            }).catch(err => {
                console.error(err)
                this.bottomToast("更新失败")
            })
        },
        onDelSort() {
            let url = 'ZingMH/ZDesk/MENHUWX/MHServiceN/delNewType.action';
            let params = {
                rowId: this.rowId
            };
            this.$http.post(url,Qs.stringify(params)).then(res => {
                if (res.data.retcode === 0) {
                    this.bottomToast('删除成功');
                    this.$emit('delSortData',this.rowId)
                } else {
                    this.bottomToast('删除失败');
                }
            }).catch(err => {
                console.error(err)
                this.bottomToast("删除失败")
            })
        },
        bottomToast (msg) {
            let _this = this
            if (!msg) return
            this.$vux.toast.show({
                text: msg,
                type: 'text',
                position: 'bottom',
                onHide() {
                    _this.bottomToast('')
                }
            })
        },
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .sort-list-item
      background-color:#fff
      height:50px
      box-shadow:1px 1px 1px #d6cfcf
      margin-top:1px
      .sort-list-item-btn
        background-color:#428bca!important
        border:none
        display:inline-block
        height:26px
        border-radius:5px
        color:#fff
        margin-right:4px
        outline:none
        letter-spacing:1px;
</style>
