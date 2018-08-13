<!--任务集列表-->
<template>
    <div style="height: 100%">
        <!--头部公共-->
        <zing-head :title="taskTitle" :isComeBack="false" @doSome="backManage">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="trello_search"></i>
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
        <!--搜索-->
        <div v-show="isShow">
            <search
                class="search"
                @on-cancel="onCancel"
                @on-change="getResult"
                @on-submit="onSubmit"
                ref="search">
            </search>
        </div>
        <!--内容-->
        <div class="taskListContent">
            <Scroll :direction="'horizontal'" ref="scroll">
                <ul class="taskListGroupWrap" ref="ul">
                    <li class="taskGroupItem" v-for="(tasklist,num) in tasklists" :key="num">
                        <div class="taskListGroupWrapHeader" @click="horizontalScroll(num)" v-show="!showEdit">
                            <div class="taskListGroupWrapHeaderLeft" @click="editName(num,$event)">
                                <span class="taskListName" >{{tasklist.title}}</span>
                            </div>
                            <div class="taskListGroupWrapHeaderRight">
                                <i class="iconfont icon-gengduo" @click="gotoUpdateDelPage(tasklist,num)"></i>
                            </div>
                        </div>
                        <!--编辑名字-->
                        <div class="editTaskListName" v-show="showEdit">
                            <div class="editTaskWrap" >
                                <textarea autoheight="true" class="taskTextareaEdit" v-model="tasklist.title"></textarea>
                                <div class="taskListBtnWrap">
                                    <div class="addNew" @click.stop="EditBtn(true,tasklist,$event)">确认</div>
                                    <div class="cancelNew" @click.stop="EditBtn(false,tasklist,$event)">取消</div>
                                </div>
                            </div>
                        </div>
                        <div class="scroll_V" id='scroll_V_Wrap' ref="scroll_V_Wrap">
                            <Scroll ref="scroll_V">
                                <ul class="taskListUL" ref="listcartsUl" v-if="listCardsFlag">
                                    <li @click = "gotoDetali(listCard)"
                                        v-for="(listCard,num) in listCardsFilter(tasklist.listId)" :key="num">
                                            <p class="taskItem" :class="{'titleThrough':listCard.handlingStatus === 'solved'}">{{listCard.title}}</p>
                                            <p v-show="listCard.isSubscribers==='true'"><i class="icon iconfont icon-yanjing" style="margin: 5px"></i></p>
                                            <span v-for="(tagItem,index) in listCard.tagsArr" :key="index" :style = "'background:' + tagItem.color" class="tagItem">
                                                {{tagItem.content}}
                                            </span>
                                            <badge v-if="cardIdArr.indexOf(listCard.cardId)!==(-1)" style="position: absolute;top:0px;right: 5px;"></badge>
                                    </li>
                                    <textarea autoheight="true" class="litextarea" v-model="newTask" v-show="false"></textarea>
                                </ul>
                            </Scroll>
                        </div>
                        <div class="taskListNewAddWrap">
                            <div class="taskListNewadd" v-show="false">
                                <div class="btn_clear" @click="addTask(tasklist,false,$event)">取消</div>
                                <div class="btn_add" @click="addTask(tasklist,true,$event)">添加</div>
                            </div>
                            <div class="taskeListGroupAdd" @click="addShow(tasklist,num,$event)" v-show="true" >添加任务</div>
                        </div>
                    </li>
                    <!--新增任务列表-->
                    <li class="taskListAddList">
                        <div class="taskListAddListContent">
                            <div class="taskListAddListBtn1" v-if="!showNew">
                                <textarea autoheight="true" class="taskListTextareaNew" v-model="addNewListName"></textarea>
                                <div class="taskListBtnWrap">
                                    <div class="cancelNew" @click="cancelNewBtn">取消</div>
                                    <div class="addNew" @click="addNewBtn">添加</div>
                                </div>
                            </div>
                            <div class="taskListAddListBtn2" @click="addNewList()" v-if="showNew">
                                添加子任务
                            </div>
                        </div>
                    </li>
                </ul>
            </Scroll>
        </div>
        <x-dialog class="xDialog" v-model="showDialog" hide-on-blur :mask-transition="maskTransition">
            <div class="edit1" @click="editMethod(tasklists)">全部关注</div>
            <div class="edit2" @click="filedMethod(tasklists)">归档该子该任务</div>
            <div class="edit3" @click="TransferMethod()">可转交子任务</div>
        </x-dialog>
        <!--人员组件,这里应该去掉的~~~~~~~~~~~~~~~~~-->
        <org-member-picker
            :showPicker="showPersonPicker"
            :initialSelected="insertNew"
            :multiple="multipleForSelPerson"
            @picked="onPicked"
            :showTab="showTab"
            @abort="onPickAbort">
        </org-member-picker>
        <!--归档组件-->
        <listFiled
            :showFlied="showFlied"
            @abort="abortFlied"
            :taskboardId="taskboardId"
            :taskRouting="taskRouting"
           >
        </listFiled>
        <!--可转交子任务组件-->
        <transferSubtask
            :showTransferSubtask="showTransferSubtask"
            @selectedSubtask = "selectedSubtask"
            @abort="abortTransferSubtask"
            :taskboardId="taskboardId"
            :taskRouting="taskRouting"
            :currentListId = "currentListId"
        >
        </transferSubtask>
        <!--选人页面-->
        <listMember
          :showListMember="showListMember"
          :taskboardId="taskboardId"
          :taskRouting="taskRouting"
          @closeListMember="closeListMember"
        >
        </listMember>
    </div>
</template>
<script>
  import Scroll from "@/components/scroll/Scroll";
  import ZingHead from "@/components/zingHead/ZingHead";
  import taskDetail from './taskDetail';
  import { XDialog,Search,Confirm, Badge} from 'vux'
  import Dropdown from '@/components/dropdown/Dropdown';
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
  import listFiled from "@/container/taskManage/listManage/listFiled";
  import listMember from "@/container/taskManage/listManage/listMember";
  import transferSubtask from "@/container/taskManage/listManage/transferSubtask";
  import _ from "lodash";
  import { isPc } from "@/utils/fn";

  export default{
       components: {
          Scroll,
          taskDetail,
          XDialog,
          ZingHead,
          Dropdown,
          Search,
          Confirm,
          OrgMemberPicker,
          listFiled,
          transferSubtask,
          listMember,
           Badge
       },
       data() {
      return {
          isShow: false,
          showDialog: false,
          taskTitle:'',
          taskboardId:'',
          taskRouting:'',
          taskCardId:'',
          currentListId:'',//当前任务列表ID
          detail:{},
          tasklists:[],//所有list列
          cards:[],
          listCards:[],//list获取的数组
          datas: [
              { content: "已归档列表" },
              { content: "成员管理" },
              { content: "报表查询" },
              { content: "自定义报表"},
          ],
          newTask:'', //添加任务名字
          insertList:[],//新增list
          showNew:true,
          addNewListName:'', //添加子任务名字
          showAlert: false,
          showTab: ["colleague"],//自定義顯示選人tab
          showPersonPicker:false,//人员选择

          subscribersRange:'',//人員初始范围
          multipleForSelPerson:true,
          showFlied:false,//已归档
          showTransferSubtask:false,//可转接子任务
          Subtask:'',//可转交子任务
          showListMember:false,//是否显示list选人页面
          showEdit:false,//是否显示编辑title
          oldnum:0,//头部编辑，判断是否第0列
          listCardsFlag:false,//判断请求是否返回listCards

          dshRedPoint:false,
          cardIdArr:[],//未读的cardId
          boardIdArr:[],//未读的boardId
          maskTransition:'vux-fade',//弹窗遮罩动画

          taskListHeight:'',//任务列表的高度
      }
    },
       computed:{
           cardUrl() {
               return this.$store.state.ui.userInfo.cardUrl;
           },
           insertNew() {
              //人员初始页面赋值
              let insertNew = []
              let subscribersRange = this.subscribersRange.split(' ')
              for (let i=0;i<subscribersRange.length;i++){
                  insertNew.push({
                      value: subscribersRange[i],
                      type: "user"
                  })
              }
              return insertNew
          },
      },
       watch:{
          listCards() {
              this.updateUlHeight()
          },
      },
       created() {
          this.taskboardId = this.$route.query.boardId
       },
       mounted() {
        let deviceHeight = document.documentElement.clientHeight
        this.taskListHeight = deviceHeight - 200


        this._ThrouClass()
        this.hongidanlist()
        this._getboardInfo()
      },
       methods: {
           updateUlHeight() {
               this.$nextTick(() => {
                   if (this.$refs.listcartsUl){
                       let Uls = Array.prototype.slice.call(this.$refs.listcartsUl)
                       for (let i = 0;i < Uls.length;i++) {
                           let h = Uls[i].offsetHeight
                           if (h >=  this.taskListHeight && document.querySelectorAll(".scroll_V")) {
                               let scrollVNodes = Array.prototype.slice.call(document.querySelectorAll(".scroll_V"))
                               scrollVNodes[i].style.height = this.taskListHeight + "px"
                               this.$nextTick(() => {
                                   if(this.$refs.scroll_V){
                                       let scroll_Vs = Array.prototype.slice.call(this.$refs.scroll_V)
                                       for (let i=0;i<scroll_Vs.length;i++) {
                                           scroll_Vs[i].refresh()
                                       }
                                   }
                               })
                           }
                       }
                   }

               })
           },
         //获取任务集title
           _getboardInfo(){
               let url = "/ZingMH/ZDesk/board/mater/loadBoardByUser.action";
               let params = {
                   tag: "trello",
                   pageNumber: 1,
                   pageSize: 10
               }
               this.$http
                   .get(url, {params: params})
                   .then(res => {
                       let taskUnits = res.data.data[0].data || [];
                       for (let i=0;i < taskUnits.length;i++){
                           if (taskUnits[i].boardId === this.taskboardId) {
                               this.taskTitle = taskUnits[i].title
                               this.taskRouting = taskUnits[i]._routing
                           }
                       }
                       this._getloadLists()
                       this._getCards()
                   })
                   .catch(err => {
//                         this.$message({message: "请求失败", type: "error"});
                   });
           },
         //红点
           hongidanlist() {
               let param =
                   { bType:'ZINGJOB',alertState:'1isAlert'}
               let url = "/ZingMH/ZDesk/MENHUWX/MHHelper/getMH_DispAlertData.action";
               this.$http.get(url, { params: param })
                   .then(res => {
                       let jobArr = res.data
                       for (let i=0; i<jobArr.length; i++) {
                           let arr = jobArr[i].tarId.split("#")
                           this.cardIdArr.push(arr[1])
                           this.boardIdArr.push(arr[1])
                       }
                   });
           } ,
         //头部任务列表名编辑
           EditBtn(isEdit,tasklist,event){
               if (isEdit){
                   let url = "/ZingMH/ZDesk/list/mater/updateList.action"
                   let params = {
                       routing:this.taskRouting,
                       listId: tasklist.listId,
                       title: tasklist.title

                   }
                   this.$http.get( url,{ params:params })
                       .then(res => {
                           this._getloadLists()
                        })
                       .catch(err => {
                       console.log(err)
                   })
               }
               //编辑隐藏
               let target = event.target
               target.parentNode.parentNode.parentNode.style.display = "none"
               this._sliblings(target.parentNode.parentNode.parentNode)[0].style.display = "block"

           },
           //编辑taskName
           editName(num,event) {
               let target = event.target
               if ( num === 0 ) {
                   event.stopPropagation()
               }
               //是target.parentNode还是target.parentNode.parentNode
               target.parentNode.parentNode.style.display = "none"
               this._sliblings(target.parentNode.parentNode)[0].style.display = "block"
           },
           //结束任务时横线样式
          _ThrouClass() {
              this.titleThrouClass = true
          },
          onCancel () {
              console.log('on cancel')
          },
          onPicked(list) {
              this.showPersonPicker = false;
              let newSubscribers = ''
              for (let i = 0; i < list.length; i++) {
                newSubscribers += list[i].cardUrl + ' '
              }
              this.$http.get(
                  "/ZingMH/ZDesk/board/mater/updateMember.action",
                  {
                      params: {
                          boardId: this.taskboardId,
                          subscribers: newSubscribers,
                          oldSubscribers: this.subscribers,
                          routing: this.taskRouting,
                      }
                  }
              ).then(res => {
                //更新newSubscribers
                  this.subscribersRange = newSubscribers

              }).catch(err => {
                  console.log(err)
              })
          },
          onPickAbort() {
              this.showPersonPicker = false;
          },
          //找到card对应的list
          listCardsFilter(listId) {
              let arr = this.listCards.filter( (item,index) => {
                        // 返回item.listId === listId
                         return item.listId === listId
                        })

              //处理标签
              for (let i=0; i<arr.length;i++) {
                    if (arr[i].tags !==  undefined ) {
                        let arr2 = arr[i].tags.trim().split("&index&")
                        let content = arr2[0].trim().split(' ')
                        if (arr2[0] && arr2[1]){
                            let tagIndex  = arr2[1].trim().split('_')
                        const map = {
                            '1':'rgba(23,194,149,1)',
                            '2':'rgba(77,169,235,1)',
                            '3':'rgba(247,181,94,1)',
                            '4':'rgba(242,114,94,1)',
                            '5':'rgba(209,137,226,1)',
                            '6':'rgba(0,204,204,1)',
                        }
                        let tagsArr = []
                        for (let i=0;i<content.length;i++){
                            let obj = {}
                            obj.content = content[i]
                            obj.color = map[tagIndex[i]]
                            obj.tagIndex = tagIndex[i]
                            tagsArr.push(obj)
                        }
                        arr[i].tagsArr = tagsArr
                     }
                }
              }
              //处理标签结束

              //判断是否请求到listCards
              if (arr.length > 0) {
                  arr.sort((a,b) =>{
                    return a.taskSetOrder > b.taskSetOrder
                  })
              }
               return arr
              },
           //获取lists
          _getloadLists() {
              let url = "/ZingMH/ZDesk/list/mater/loadLists.action"
              let params = {
                      boardId:this.taskboardId,
                      routing:this.taskRouting,
                      status:'start'
              }
              this.$http.get( url,{ params:params })
                  .then(res => {
                  this.tasklists = res.data.data
                                      //list排序cons
                                   if (this.tasklists) {
                                       this.tasklists.sort((a,b) => {
                                             if (!_.isUndefined(a.createAt) && !_.isUndefined(b.createAt)) {
                                                 return a.createAt < b.createAt ? -1 : 1
                                             } else if (!_.isUndefined(a.createAt)) {
                                                 return 1
                                             } else if (!_.isUndefined(b.createAt)) {
                                                 return -1
                                             }
                                       })
                                   }

                  this.setUlWidth()
                  this.$nextTick(() => {
                     this.$refs.scroll.refresh()
                  })
              }).catch(err => {
                  console.log(err)
              })
          },
          //获取cards
          _getCards() {
                  let url = "/ZingMH/ZDesk/card/mater/loadCards.action"
                  let params = {
                      boardId:this.taskboardId,
                      routing:this.taskRouting,
                      status:'start'
                  }
                  this.$http.get(url,{params:params})
                      .then(res => {
                          this.listCards = res.data.data
                          this.listCardsFlag = true
                          //标签显示
//                          this.tags = res.data.data.tags
                          //找到card对应的list
                          this.listCardsFilter()

                          //更新任务列表UL高度
                          this.updateUlHeight()
                      })
                      .catch(err => {
                         console.log(err)
                      });
              },

          //添加或取消
          addTask(list,isAdd,event) {
               let listId = list.listId
               let listIndex = _.indexOf(this.tasklists,list)
               let target = event.target
                if (isAdd) {
                //添加card
                    if (!this.newTask.trim()){
                        this.$vux.toast.show({text: "输入不能为空"});
                        return
                    }
                    let url = "/ZingMH/ZDesk/card/mater/insertCard.action"
                    let params = {
                        boardId:this.taskboardId,
                        routing:this.taskRouting,
                        listId:listId,
                        title:this.newTask,
                    }
                    this.$http.get(url,{ params:params } )
                        .then(res => {
                             //this._getCards()
                            let taskCardId = res.data.data.cardId
                            let taskRouting = res.data.data.routing
                            this.$router.push({
                                name: 'taskDetail',
                                query: {
                                    taskCardId: taskCardId,
                                    taskRouting: taskRouting,
                                }
                            })

                        })
                        .catch(err => {
                            console.log(err)
                        });
                    this.newTask = ''
                  } else {
                    this.$nextTick(() => {
                        let scroll_Vs = Array.prototype.slice.call(this.$refs.scroll_V)
                        let h = event.target.parentNode.parentNode.parentNode.querySelector(".taskListUL").offsetHeight
                        if (h < this.taskListHeight) {
                            event.target.parentNode.parentNode.parentNode.querySelector(".scroll_V").style.height = ""
                        }
                            scroll_Vs[listIndex].refresh()
                            scroll_Vs[listIndex].scrollTo(0,0)
                    })

                }
              target.parentNode.style.display = "none"
              this._sliblings(target.parentNode)[0].style.display = "block"
              target.parentNode.parentNode.parentNode.querySelector(".litextarea").style.display = "none"
           },
          _sliblings(elm) {
              let a = []
              let p = elm.parentNode.children
              for (let i = 0,pl = p.length; i < pl;i++) {
                  if (p[i] !== elm) a.push(p[i])
              }
              return a
          },
          //li下添加任务
          addShow(list,num,event) {
               let listIndex = _.indexOf(this.tasklists,list)
              //点击自动移动
              //如果是PC端就不需要点击移动
              if (!isPc()) {
                  this.horizontalScroll(num)
              }
              if (event.target) {
                  event.target.style.display = "none"
                  this._sliblings(event.target)[0].style.display = "block"
                  event.target.parentNode.parentNode.querySelector(".litextarea").style.display = "block"

             }
              this.$nextTick(() => {

                  let scroll_Vs = Array.prototype.slice.call(this.$refs.scroll_V)
                  let h = event.target.parentNode.parentNode.querySelector(".taskListUL").offsetHeight
                  if (h> this.taskListHeight) {
                      event.target.parentNode.parentNode.querySelector(".scroll_V").style.height =  this.taskListHeight + "px"
                      scroll_Vs[listIndex].scrollTo(0,-(h -  this.taskListHeight))
                  }
                      scroll_Vs[listIndex].refresh()
              })
          },
          trello_search() {
              this.isShow = !this.isShow
          },
          showDetali(tasklist) {
              this.detail = tasklist
              this.isDetailShow = true

          },
           //list中的每个li就是card
          gotoDetali(taskCard) {
              let taskCardId = taskCard.cardId
              let taskRouting = this.taskRouting
              let taskboardId = this.taskboardId
             //标为已读
              if (!this.cardIdArr.indexOf(taskCardId.cardId) !== (-1)) {
                  let that = this
                  let url = "/ZingMH/ZDesk/MENHUWX/MHAlert/updateDisAlertCurrentUser.action"
                  let params = {
                      companyId: this.$route.query.routing,
                      bType: 'ZINGJOB',
                      tarId: taskboardId + '#' + taskCardId
                  }
                  that.$http.get(url, {params: params})
                      .then(res => {
                          console.log('已读')
                      })
                      .catch(err => {
                          console.log(err)
                      });
               }
                  this.$router.push({
                      name: 'taskDetail',
                      query: {
                          taskCardId: taskCardId,
                          taskRouting: taskRouting,
                      }
                  })
          },
          setUlWidth () {
              const ul = this.$refs.ul
              const liWidth = 300
              const space = 20
              let size = 0
              if (this.tasklists){
                  size = this.tasklists.length
              }
              ul.style.width = (liWidth + space) * (size + 1) + 'px'
          },
           //点击自动移动
           horizontalScroll(num) {
                   let scroll_H = this.$refs.scroll
                   //防止当前列是第0列，再次点击点击第0列抖动
                   if (num === 0 && this.oldnum === 0) {
                     // scroll_H.scrollTo(0,0)
                     return
                   }
                   scroll_H.scrollTo(-((num - 1) * (268 + 7.5) + 230),0,50)
                   this.oldnum = num

                   //兄弟列头部编辑状态隐藏
                   let arr = Array.prototype.slice.call(document.querySelectorAll(".taskListGroupWrap>li"))
                   //num不是最后一列（添加列）
                   if (num !== (arr.length - 1)) {
                      for (let i = 0; i < arr.length; i++) {
                            if (i !== (arr.length-1) && i !== num) {
                                arr[i].querySelector(".taskListGroupWrapHeader").style.display = "block"
                                arr[i].querySelector(".editTaskListName").style.display = "none"
                            } else {
                                this.showNew = true
                            }
                      }
                   }
                   //num是最后一列（添加列）
                   else if (num === (arr.length - 1)) {
                      for (let i = 0; i < arr.length - 1; i++) {
                          arr[i].querySelector(".taskListGroupWrapHeader").style.display = "block"
                          arr[i].querySelector(".editTaskListName").style.display = "none"
                      }
                   }
           },
          getResult() {

          },
          onSubmit(val) {
              console.log(val)
          },
          handleMenu(data) {
              if (data.url) this.$router.push(data.url)
              if (data.content === "成员管理") this.showListMember = true
              if (data.content === "已归档列表") this.showFlied = true
              if (data.content === "自定义报表") {
                  window.location = `/SRender?jsLoader=reportModel%2FaddTaskSetModelLoader&tpl=reportModel%2FaddTaskSetModel&boradId=${this.taskboardId}`
              }
          },
          gotoUpdateDelPage(tasklist,num) {
              this.currentListId = tasklist.listId
              this.num = num
              this.showDialog = true

          },
          editMethod(tasklists) {
              this.showDialog = false
              let listId = tasklists[this.num].listId
              let arr = this.listCards.filter( (item,index) => {
                  return item.listId === listId
              })
              let cardSubscribers = ''
              for (let i=0;i<arr.length;i++ ){
                  cardSubscribers += arr[i].cardId +'&&&'+ this.cardUrl + '###'
              }
              let that = this
              let url = "/ZingMH/ZDesk/card/mater/allAttention.action"
              let params = {
                  cardSubscribers:cardSubscribers,
                  routing: this.$route.query.routing,
              }
              that.$http.get(url,{ params:params })
                  .then(res => {
//                      this.showYan = true
                  })
                  .catch(err => {
                      console.log(err)
                  });

          },
           //归档子任务
           filedMethod(tasklists) {
                let arr1 = []
                for (let i in tasklists) {
                  arr1.push(tasklists[i])
                }
                  this.showDialog = false
                  this.showAlert = true
                  let _this = this
                  //完结列表(归档该子任务)
                 this.$vux.confirm.show({
                     title: "提示",
                     content: "是否归档此子任务",
                     onConfirm() {
                          let url = "/ZingMH/ZDesk/list/mater/updateList.action"
                          let params = {
                              listId:arr1[_this.num].listId,
                              routing:arr1[_this.num].routing,
                              status:'end'
                          }
                           _this.$http.get(url,{ params:params })
                              .then(res => {
                                  _this._getloadLists()
                                  _this.$vux.toast.show({text:"已完结",type:"success"})
                              })
                              .catch(err => {
                                  console.log(err)
                              });
                           _this.addNewListName = ''

                           //  _this.showNew = !_this.showNew
                      },
                 })
          },
           abortFlied() {
               this.showFlied = false
               this._getloadLists()
               this._getCards()

           },
           //可转接子任务
           TransferMethod() {
               this.showTransferSubtask = true
               this.showDialog = false
           },
           selectedSubtask(value) {
               this.showTransferSubtask = false
               _.each(value,valueName => {
                   this.Subtask = valueName.label
                   console.log('this.Subtask',this.Subtask)
               })
           },
           abortTransferSubtask() {
               this.showTransferSubtask = false
           },
          //添加新任务列表
          addNewBtn() {
                  if (!this.addNewListName.trim()){
                      this.$message({ message: "输入不能为空", type: "error" })
                      return
                 }
                   //新增list任务列表
                  let url = "/ZingMH/ZDesk/list/mater/insertList.action"
                  let params = {
                      boardId:this.taskboardId,
                      routing:this.taskRouting,
                      title:this.addNewListName,
                  }
                  this.$http.get(url,{ params:params } )
                      .then(res => {
                          this.insertList = res.data
                          //添加后重新获取新的数据
                          this._getloadLists()
                      })
                      .catch(err => {
                          console.log(err)
                      });
                  this.addNewListName = ''
                  this.showNew = !this.showNew
              },
          cancelNewBtn() {
              this.showNew = !this.showNew
          },
          addNewList() {
             //如果是PC端就不需要点击移动
              if (!isPc()) {
                if (this.tasklists){
                    this.horizontalScroll(this.tasklists.length)
                    this.showNew = !this.showNew
                }
              } else {
                  this.showNew = !this.showNew
              }

          },
           //listmember
           closeListMember() {
               this.showListMember = false
           },
          //回退到Manage
          backManage() {
              this.$router.push({ name: 'taskManage' }
                )
          },
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .taskListContent
       height 100%
       .taskListGroupWrap
           overflow: hidden
           border-radius 5px
           &>li
             width: 268px
             margin: 7.5px 4px
             float: left
             background: #e8e8e8
             .scroll_V
                /*max-height: 350px*/
                .taskListUL
                    &>li
                       position relative
                       min-height 69px
                       background white
                       margin 7.5px
                       border-radius 3px
                       .taskItem
                          display inline-block
                          width 240px
                          margin 5px
                       .titleThrough
                          text-decoration line-through
                       .tagItem
                          color white
                          display inline-block
                          margin 5px
                          padding 3px
                    .litextarea
                        width 94.5%
                        height 69px
                        margin 0 7.5px
                        border-radius 3px
                        font-size 16px !important
                        outline none
                        resize none
                        border-color white
             .taskListGroupWrapHeader
                 height: 38px
                 line-height 38px
                 background-color #e8e8e8
                 font-size 16px
                 border-radius 5px
                 .taskListGroupWrapHeaderLeft
                     float: left
                     .taskListName
                         display inline-block
                         font-size 14px
                         margin-left 14px
                         color black
                         width 200px
                         overflow hidden
                         white-space nowrap
                         text-overflow ellipsis
                 .taskListGroupWrapHeaderRight
                     float: right
                     &>i
                         margin-right: 5px
                         font-size 30px
                         color black
             .editTaskListName
                 width 100%
                 padding 8px 7px
                 background-color #e8e8e8
                 .editTaskWrap
                       .taskTextareaEdit
                           width 100%
                           height 69px
                           margin-bottom 4px
                           border-radius 3px
                           font-size 16px !important
                           outline none
                           resize none
                           border-color white
                       .taskListBtnWrap
                           width 100%
                           height 25px
                           .addNew
                               float right
                               width 50%
                               text-align center
                               color #fff
                               height 25px
                               line-height 25px
                               background-color #fd9212
                               border-radius 4px
                           .cancelNew
                               float left
                               width 50%
                               text-align center
                               color #fff
                               height 25px
                               line-height 25px
                               background-color #40affc
                               border-radius 4px
             .taskListNewAddWrap
                 margin 7px
                 .taskeListGroupAdd
                     height: 25px
                     line-height 25px
                     width: 100%
                     text-align: center
                     background-color #e8e8e8
                     border-radius 3px
                     color #A2A2A2
                     font-size 14px
                 .taskListNewadd
                    overflow hidden
                    .btn_add,.btn_clear
                         float right
                         width 50%
                         text-align: center
                         color: #fff
                         height 25px
                         line-height 25px
                         background-color #fd9212
                         border-radius: 3px
                    .btn_clear
                         float left
                         background-color #40affc
           .taskListAddList
               width: 268px
               float: left
               background: #e8e8e8
               .taskListAddListContent
                  width 100%
                  .taskListAddListBtn1
                      width 100%
                      padding 8px 7px
                      background-color #e8e8e8
                      .taskListTextareaNew
                          -webkit-appearance none
                          width 100%
                          height 69px
                          margin-bottom 4px
                          border-radius 3px
                          font-size 16px !important
                          outline none
                          resize none
                          border-color white
                      .taskListBtnWrap
                          width 100%
                          height 25px !important
                          .addNew
                              float right
                              width 50%
                              text-align center
                              color #fff
                              height 25px
                              line-height 25px
                              background-color  #fd9212
                              border-radius 4px
                          .cancelNew
                              float left
                              width 50%
                              text-align center
                              color #fff
                              height 25px
                              line-height 25px
                              background-color  #40affc
                              border-radius 4px
                  .taskListAddListBtn2
                      font-size 14px
                      text-align center
                      height 38px
                      line-height 38px
                      color rgb(136, 136, 136)
       .edit1,.edit2,.edit3
           height 24px;
           text-align center;
           margin-top 13px;
       .edit1,.edit2
          border-bottom 1px solid rgba(58, 77, 118, 0.4)
</style>


