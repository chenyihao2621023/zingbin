<!--任务详情-->
<template>
    <div class="detailWrap">
            <!--头部-->
         
        <div class="detailScrollWrap" id="detailScrollWrapb">
            <Scroll :scrollbar="true" ref="scrollContent">
                <div class="modalWrap">

                     
                     
                    <split v-if="showTaskDetail"></split>
                    <!--内容区-->
                    <el-collapse v-model="activeNames" @change="handleChange" >
                           <el-collapse-item  name="1" v-if="showTaskDetail">
                             <template slot="title">
                                任务标题   <el-button @click.native="delChildTask" size="mini" type="primary" style="float: right;margin-top: 10px">删除</el-button>
                            </template>
                            <div class="cardTitle" id="content" :class="{'titleThrough':isSolved}">
                                {{cardTitle}} 
                            </div>
                        </el-collapse-item>
                        <split v-if="showTaskDetail"></split>
                        <el-collapse-item title="成员" name="2" v-if="showTaskDetail" @change="xxx">
                            <template slot="title">
                                <span style="margin-right: 25px">负责人</span>
                                <span class="avatarWrap">
                                    <span class="avatarWrap2" v-for="(fuze,index) in leaderTwo" :key="index">
                                       <avatar :size="'default'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+fuze.substring(0,2)+"/"+fuze+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                                    </span>
                                </span>
                            </template>
                            <div>
                                <!--成员和负责人-->
                                <detailMember
                                    :insertParams="insertParams"
                                    :updadeTaskActivits ="updadeTaskActivits"

                                    :getLeaders="getLeaders"
                                    :getMembers="getMembers"
                                    :fuzerenRange="fuzerenRange"
                                />

                            </div>
                        </el-collapse-item>
                        <split v-if="showTaskDetail"></split>
                        <el-collapse-item title="子任务配置项" name="3" v-if="showTaskDetail">
                            <div>
                                <!--子任务配置-->
                                <detailSubtask :insertParams="insertParams"
                                               :updadeTaskActivits ="updadeTaskActivits"

                                               :createCardUrl = "createCardUrl"
                                                ref="child"
                                               :cardListId = "cardListId"
                                               :fuzerenRangearr="fuzerenRangearr"
                                                />
                            </div>
                        </el-collapse-item>
                          
                        <split></split>
                             
                    </el-collapse>
                </div>
            </Scroll>
        </div>
          
  </div>
  </template>
  <script>
  import { Group,XDialog,Selector,Confirm,Checker, CheckerItem ,XButton,Flexbox, FlexboxItem } from 'vux'
  import ZingHead from "@/components/zingHead/ZingHead";
  import taskActivity from './detail/detailActivity';
  import detailSubtask from './detail/detailSubtask';
  import detailMember from './detail/detailMember';
  import detailPicture from './detail/detailPicture';
  import detiailAttachment from './detail/detiailAttachment';
  import detailCredence from './detail/detailCredence';
  import detailChatBottom from './detail/chatBottom/detailChatBottom';
  import Scroll from "@/components/scroll/Scroll";
  import Dropdown from '@/components/dropdown/Dropdown';
  import split from "@/container/taskManage/split/split"
  import _ from "lodash"
  import { mapMutations } from 'vuex'
  import avatar from "@/components/avatar/Avatar";

  export default{
      components:{
          ZingHead,Group,taskActivity,
          Scroll,detailSubtask,detailMember,
          XDialog,Selector,Dropdown,split,
          detailPicture,detiailAttachment,
          detailCredence,
          detailChatBottom,
          Confirm,Checker,CheckerItem,
          XButton,Flexbox, FlexboxItem,avatar
      },
      props:{
          transCardId:{
              type:String
          },
          transRouting:{
              type:String
          },
          transtitle:{
              type:String
          },
          transboardId: {
              type:String
          },
          transListId:{
              type:String
          },
          showTaskDetail: {
              // 是否显示
              type: Boolean,
              default: function() {
                  return true;
              }
          },
          defaultBack: {
              // 是否使用默认后退
              type: Boolean,
              default: function() {
                  return false;
              }
          },
          loadingSelf: {
              // 是否自己加载数据
              type: Boolean,
              default: function() {
                  return false;
              }
          },
          showTaskDetailHead: {
              // 是否显示
              type: Boolean,
              default: function() {
                  return true;
              }
          },
      },
      data() {
        return {
            cardListId:'',//cardListId
            isSolved:false,//任务结束
            isRemind:false, //消息免打扰
            titleThrouClass:false,//任务标题
            attachmentNum:'',//附件的数量
            picNum:'',//图片数量
            taskActivits:[],
            activeNames: ['1'],
            isSee:false,
            finish:true,
            showDialog: false,
            clickMoreflag:true,
            showLabel:false,//是否显示移动
            cardTitle:"",
            taskSetOrder:'',//置顶移动
            leaderTwo:[],//前两个负责人
            tags:[],//标签属性
            lableTwo:[],//标签前两个
            OrderFilterCards:[],//排序后的card数组
            createCardUrl:'',//创建者 第三屏loadCardByCardId

            firstTaskOrder:{},
            lastTaskOrder:{},
            subscribersRange:[],//成员范围
            Members:[],//成员
            uniqueMember:[],//任务集所有成员
            filterMember:[],//未选择成员
            fuzerenRangearr:[],//子任务配置项负责人范围
            referenceId:''
       }
    },
     computed:{
         cardUrl() {
             return this.$store.state.ui.userInfo.cardUrl;
         },
         datas(){
            let fildatas = []
            if (this.filterMember.indexOf(this.cardUrl) === (-1)){
                fildatas = [
                    { content: "任务结束" },
                    { content: "归档" },
                    { content: "删除" },
                    { content: "移动" },
                    { content: "仅显示凭证" },
                    { content: "仅显示外联人" },
                    { content: "仅显示外勤考勤" },
                ]
            } else {
                fildatas = [
                    { content: "任务结束" },
                    { content: "归档" },
                    { content: "删除" },
                    { content: "移动" },
                    { content: "关注" },
                    { content: "仅显示凭证" },
                    { content: "仅显示外联人" },
                    { content: "仅显示外勤考勤" },
                ]
            }
            return fildatas
         },
        //过滤load数据里有关图片添加的数据data
        fiterPicture() {
            return this.taskActivits.filter((item, index, array) => {
                return item.type === 'image';
            })
        },
         //过滤load数据中有关附件添加的data
        firterAttachment() {
            return this.taskActivits.filter((item, index, array) => {
                return item.type === "attachment"
            })
        },
        //detail组件
         headTitle() {
             return   this.transtitle
         },
         taskCardId() {
             return   this.transCardId
         },
         taskboardId() {
             return   this.transboardId
         },
         taskRouting() {
             return   this.transRouting
         },
         taskListId() {
             return   this.transListId
         },
         insertParams() {
             let insertParams = {
                 boardId:this.taskboardId,
                 listId:this.taskListId,
                 cardId:this.taskCardId,
                 routing:this.taskRouting,
                 members:'',
//                 subscribers:'',
                 cardTitle:this.cardTitle,
                 val: "",
                 prefixMsg:'',
                 alertUserName:this.$store.state.ui.userInfo.RealName,
                 type:''
             }
          return insertParams
         },
         loadParams() {
           let loadParams = {
               cardId: this.taskCardId,
               routing: this.taskRouting,
           }
           return loadParams
         },
         Subtask(){
             return ''
         }
     },
      created(){
        this.cardNum = this.$route.query.cardNum
      },
     mounted() {
         if (!this.loadingSelf) {
             this.loading();
         }
         //标签前两个
         this.getLableTwo();
     },
     beforeRouteEnter (to, from, next) {
         PSMU.debug("chat vue beforeRouteEnter")
//                if (T_ismhapp()) MHAppapi.hideBottomBar();
         next(vm => {
             // 通过 `vm` 访问组件实例
             vm.setMode(false)
         })
     },
     beforeRouteUpdate (to, from, next) {
         PSMU.debug("chat vue beforeRouteUpdate")
         next()
     },
     beforeRouteLeave (to, from, next) {
         this.setMode(true)
         next()
     },
     methods:{
         delChildTask(){
             console.log(this.transCardId)
             console.log(this.$route.query.boardId)
             console.log(this.referenceId)
             let newRefrenceId = this.referenceId.replace(this.$route.query.boardId,"")
             console.log(newRefrenceId)
             let _this = this   
             this.$vux.confirm.show({
                        title:'提示' ,
                        content:'你确定要删除吗?',
                        onCancel () {},
                        onConfirm() {
                            _this.updateReferenceId(newRefrenceId)
                        }
          })
             
         },
         updateReferenceId(newRefrenceId){
             this.$http
                .get("/ZingMH/ZDesk/card/mater/updateReferenceId.action", {
                params: {
                    referenceId: newRefrenceId,
                    routing: this.$store.state.ui.userInfo.companyId,
                    cardId: this.transCardId
                }
                })
                .then(res => {
                    this.showTaskDetail = false
                })
                .catch(err => {
                console.log(err);
                });
         },
        //去重方法
        arrayUnique (arr){
           let newArr = []
           for (let i=0 ; i<arr.length ; i++) {
               if (newArr.indexOf(arr[i]) === (-1)) {
                   newArr.push(arr[i])
               }
            }
           return newArr
        },
        //获取任务集所有成员
         _getboardInfo() {
             let url = "/ZingMH/ZDesk/board/mater/loadBoardByUser.action";
             let params = {
                 tag: "trello",
                 pageNumber: 1,
                 pageSize: 10
             };
             this.$http.get(url,{params:params})
                 .then(res => {
                     let boardarr = res.data.data[0].data
                     let output = []
                     let str = ''
                     for (let i = 0; i < boardarr.length; ++i) {
                         str += boardarr[i].subscribers + ' '
                     }
                     output = str.split(' ')
                     //去重
                     this.uniqueMember = this.arrayUnique(output)
                      //范围
                     this.filterDowndatas()
                 })
                 .catch(err => {
                     console.log(err)
                 });

         },
        //范围是任务集中所有的成员
         filterDowndatas() {
             this.filterMember = this.uniqueMember.filter((element) => {
                  return this.Members.indexOf(element) === (-1)
              })
            },
         //任务中选定的成员
         getMembers(arrcheng) {
             this.Members = arrcheng.trim().split(' ')
         },
         listCardsFilter() {
             let arr = this.listCards.filter( (item,index) => {
                 // 返回item.listId === listId
                 return item.listId === this.taskListId
             })
             //判断是否请求到listCards
             if (arr.length > 0) {
                 arr.sort((a,b) =>{
                     return a.taskSetOrder > b.taskSetOrder
                 })
             }
             this.firstTaskOrder = arr[0]
             this.lastTaskOrder = arr[arr.length - 1]
             this.OrderFilterCards = arr
         },
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
                     //找到card对应的list
                     this.listCardsFilter()
                 })
                 .catch(err => {
                     console.log(err)
                 });
         },
        updatetags(label) {
            if (label) {
              this._getloadCardByCardId()
           }
        },
        //负责人前两个
        getLeaders(arr) {
           for (let i=0;i<arr.length;i++){
               if (i < 2) {
                   this.leaderTwo.push(arr[i].value)
               }
           }
        },
         //来着detailMember，需传给detailSubtask
         fuzerenRange(fuzeRange) {
             this.fuzerenRangearr = fuzeRange.trim().split(' ')
         },
         //标签前两个
         getLableTwo() {
           for (let i = 0;i < this.tags.length;i++) {
             if (i < 2 ) {
                 this.lableTwo.push(this.tags)
             }
           }
         },
         ...mapMutations({
             setMode: 'SET_MODE'
         }),

         doShowToast1 (isfirst) {
             let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
             let newTaskOrder = ''
             if (isfirst) {
                 //置顶
                 newTaskOrder = this.firstTaskOrder.taskSetOrder - 1
             } else {
                 //置底 90360797000001100
                 //front  前面 behind 后面
                 let frontOrder = this.lastTaskOrder.taskSetOrder.substr(0,14)
                 let behindOrder = this.lastTaskOrder.taskSetOrder.substr(14)

                 let addOne = String(Number(behindOrder) + 1 )
                 newTaskOrder = frontOrder + addOne
             }
             let Params = {
                     taskSetOrder: newTaskOrder,
                     cardId: this.taskCardId,
                     routing: this.taskRouting,
             }
             this.$http.get(url,{ params:Params })
                 .then(res => {
                    this.showLabel = false
                   if (isfirst) {
                         this.$vux.toast.show({
                             text: '置顶'
                         })
                     } else {
                         this.$vux.toast.show({
                             text: '置底'
                         })
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 });
         },
         //上移下移
         doShowToast2 (ifup) {
             let url = "/ZingMH/ZDesk/card/mater/changeTaskSetOrder.action"
             let Params = {}
                // cardId1: 90360797000000101
                // taskSetOrder1: 90360797000001100
                // cardId2: 90360759000000101
                // taskSetOrder2: 90360797000001101
                // routing: company73570929000000101
             if (ifup) {
                 //上移
                 console.log("this.cardNum",this.cardNum," this.cardNum - 1",this.cardNum - 1)
                 Params = {
                     //cardId1 需要操作的元素的cardId
                     cardId1: this.taskCardId,
                     //它前面的元素taskSetOrder
                     taskSetOrder1: this.OrderFilterCards[(this.cardNum - 1)].taskSetOrder,
                     //cardId2 前面的元素的cardId
                     cardId2: this.OrderFilterCards[(this.cardNum - 1)].cardId,
                     //需要操作的元素的taskSetOrder
                     taskSetOrder2: this.OrderFilterCards[this.cardNum].taskSetOrder,
                     routing: this.taskRouting,
                 }
             } else {
                 //下移
                 //cardId2 需要操作的元素
                 //cardId1 它后面的元素
                 Params = {
                     //cardId1 需要操作的元素的cardId
                     cardId1: this.taskCardId,
                     //它后面的元素taskSetOrder
                     taskSetOrder1: this.OrderFilterCards[(this.cardNum + 1)].taskSetOrder,
                     //cardId2 后面的元素的cardId
                     cardId2: this.OrderFilterCards[(this.cardNum + 1)].cardId,
                     //需要操作的元素的taskSetOrder
                     taskSetOrder2: this.OrderFilterCards[this.cardNum].taskSetOrder,
                     routing: this.taskRouting,
                 }
             }

             this.$http.get(url,{ params:Params })
                 .then(res => {
                     this.showLabel = false
                     if (ifup) {
                         this.$vux.toast.show({
                             text: '上移'
                         })
                     } else {
                         this.$vux.toast.show({
                             text: '下移'
                         })
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 });
             this.$vux.toast.show({
                 text: '上移'
             })
         },
         loading() {
             this._getActivity()
             this._getloadCardByCardId()
             this._getCards()
             this._getboardInfo()
         },
         //图片数量
         _pictureNum() {
             this.picNum = this.fiterPicture.length
         },
         //附件数量
         _AttachmentNum() {
            this.attachmentNum = this.firterAttachment.length
          },
          //
          onConfirm (value) {
              this.$refs.confirm5.setInputValue('')
          },
          onCancel () {
              console.log('on cancel')
          },
          //底部文件detailChatBottom
          bottomfile(Filedata) {
              this.$refs['File'].$emit('ifFile',Filedata)    //附件组件
          },
           //底部图片detailChatBottom
          bottomPicture(PCdata) {
             this.$refs['Picture'].$emit('ifPicture',PCdata)  //图片组件
             this.PCdata = PCdata
          },

           //更新taskActivits并通知引用的detail组件
           updadeTaskActivits(taskActivits, TellDetail,TellValJSON) {
               //load
               if (TellDetail) {
                   this._getActivity()
                   //通知引用的detail组件
                   if (TellDetail === 1 || TellDetail === 2 || TellDetail === 3) {
                       this.$emit('taskDetailChang',TellDetail,TellValJSON)
                   }

               }
           },
           //接收编辑评论参数
            editTaskComment (activitieId,activitieVal,activitieRouting) {
               this.activitieId = activitieId
               this.activitieVal = activitieVal
               this.activitieRouting = activitieRouting
            },

           //获取
          _getActivity(data) {
                let url = "/ZingMH/ZDesk/activity/mater/loadActivit.action"
                let loadParams = this.loadParams
                this.$http.get(url,{ params:loadParams })
                    .then(res => {
                        this.taskActivits = res.data.data
                        //图片数量
                        this._pictureNum()
                        //附件数量
                        this._AttachmentNum()
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
         _getloadCardByCardId() {
             let that = this
             let param1 = {
                 cardId: this.taskCardId,
                 routing: this.taskRouting,
                 pageNumber:1
             }
             let url1 = "/ZingMH/ZDesk/card/mater/loadCardByCardId.action"
             that.$http.get(url1, { params: param1 })
                 .then(res => {
                     this.referenceId = res.data.data.data[0].referenceId
                     this.handlingStatus = res.data.data.data[0].handlingStatus
                     this.taskTitle = res.data.data.data[0].boardTitle
                     this.cardTitle = res.data.data.data[0].title
                     this.taskSetOrder = res.data.data.data[0].taskSetOrder
                     this.createCardUrl = res.data.data.data[0].createCardUrl
                     this.cardListId = res.data.data.data[0].listId
                     //处理标签
                     let arr = res.data.data.data[0].tags.trim().split("&index&")
                     let content = arr[0].trim().split(' ')
                     let tagIndex = arr[1].trim().split('_')
                     const map = {
                         '1':'rgba(23,194,149,1)',
                         '2':'rgba(77,169,235,1)',
                         '3':'rgba(247,181,94,1)',
                         '4':'rgba(242,114,94,1)',
                         '5':'rgba(209,137,226,1)',
                         '6':'rgba(0,204,204,1)',
                     }
                     this.tags = []
                     for (let i=0;i<content.length;i++){
                         let obj = {}
                         obj.content = content[i]
                         obj.tagIndex = map[tagIndex[i]]
                         obj.colorIndex = tagIndex[i]
                         this.tags.push(obj)
                     }
                     if (this.handlingStatus === 'solved') {
                         this.isSolved = true
                         this.datas[2].content = '任务激活'
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 });
         },
          //消息免打扰
          changeStatus(aa) {
              let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
              this.isRemind = !this.isRemind
              let isRemind = this.isRemind
              let params = {
                  cardId:this.taskCardId,
                  routing:this.taskRouting,
                  boardId: this.taskboardId,
                  isRemind: isRemind,
//                  notDisturb: 2YV3emJ3MfiaARbu6jJVji2m,  ?
//                  operatingUser: 2YV3emJ3MfiaARbu6jJVji2m,  ?
              }
              this.$http.get(url,{ params:params })
                  .then(res => {
                       this.switchValue = !this.switchValue
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
           //底部输入
            clickEmoji() {
                    document.getElementById('detailScrollWrapb').style.height = 250 + 'px'
            },
            clickboard() {
                    document.getElementById('detailScrollWrapb').style.height = ''
            },
            clickMore() {
                if (this.clickMoreflag) {
                    document.getElementById('detailScrollWrapb').style.height = 470 + 'px'
              } else {
                    document.getElementById('detailScrollWrapb').style.height = ''
              }
              this.clickMoreflag = !this.clickMoreflag
            },
            handleChange(val) {
                setTimeout(() => {
                    this.$refs.scrollContent.refresh()
                },500)
            },
            handleMenu(data) {
                if (data.content === "删除") {
                    this.delCard()
                }
                if (data.content === "归档") {
                    this.pigeonholeCard()
                }
                if (data.content === "移动") {
                    this.showLabel = true
//                    this.moveCard()
                }
                if (data.content === "任务结束") {
                    this.taskEnd()
                } else if (data.content === "任务激活") {
                    this.taskActive()
                }
            },
            delCard() {
                let url = "/ZingMH/ZDesk/card/mater/deleteCard.action"
                this.$http.get(url,{ params:{cardId:this.$route.query.taskCardId,routing:this.$route.query.taskRouting } })
                  .then(res => {
                    this.$router.push({
                        name: "taskList",
                        query: {
                        title: this.taskTitle,
                        boardId: this.$route.query.taskboardId,
                        routing: this.$route.query.taskRouting,
                        }
                    });
                  })
                  .catch(err => {
                      console.log(err)
                  });
            },
           //移动
            moveCard() {

            },
           //归档
            pigeonholeCard(){
                let _that = this;
                this.$vux.confirm.show({
                    title: "你确定要归档吗?",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
                        _that.$http.get(url,{ params:{ cardId:_that.$route.query.taskCardId,routing:_that.$route.query.taskRouting,status:'end' }})
                            .then(res => {
                                _that.$router.push({
                                    name: "taskList",
                                    query: {
                                        title: _that.taskTitle,
                                        boardId: _that.$route.query.taskboardId,
                                        routing: _that.$route.query.taskRouting,
                                    }
                                });
                                _that.$vux.toast.show({text: "归档成功！", type: "success"});
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    }
                })
            },
            taskEnd(){
                let url = "/ZingMH/ZDesk/card/mater/updateCardManage.action"
                this.$http.get(url,{ params:{cardId:this.$route.query.taskCardId,routing:this.$route.query.taskRouting,listId:this.$route.query.taskListId,handlingStatus:'solved'} })
                  .then(res => {
                      this.isSolved = true
                      this.datas[2].content='任务激活'
                      this.$vux.toast.show({text:"设置成功",type:"success"})
                      //insert请求
                      let that = this
                      let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                          that.insertParams.val = '结束此任务'
                          that.insertParams.type = 'subTask'
                      that.$http.get(url2, { params: that.insertParams })
                          .then(res => {
                              //通知load
                              let TellDetail = true
                              that.updadeTaskActivits(res.data,TellDetail)
                              that.$vux.toast.show({text:"添加成功",type:"success"})
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"添加失败",type:"false"})
                              console.log(err)
                          })
                  })
                  .catch(err => {
                      console.log(err)
                  });
            },
            taskActive(){
                 let url = "/ZingMH/ZDesk/card/mater/updateCardManage.action"
                 this.$http.get(url,{ params:{cardId:this.$route.query.taskCardId,routing:this.$route.query.taskRouting,listId:this.$route.query.taskListId,handlingStatus:'activation'} })
                  .then(res => {
                     this.isSolved = false
                     this.datas[2].content='任务结束'
                     this.$vux.toast.show({text:"设置成功",type:"success"})

                      let that = this
                      let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      that.insertParams.val = '激活此任务'
                      that.insertParams.type = 'subTask'
                      that.$http.get(url2, { params: that.insertParams })
                          .then(res => {
                              //通知load
                              let TellDetail = true
                              that.updadeTaskActivits(res.data,TellDetail)
                              that.$vux.toast.show({text:"添加成功",type:"success"})
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"添加失败",type:"false"})
                              console.log(err)
                          })
                   })
                   .catch(err => {
                     console.log(err)
                   });
          },
            scrollRefresh(cb) {
                if (cb) {
                    this.$nextTick(() => {
                        this.$refs.scrollContent.refresh()
                      })
                }
            },

            onChange (val) {
               console.log(val)
            },
           //回退问题
            backList() {
                if (!this.defaultBack) {
                    this.$router.push(
                        {
                            name: 'taskList',
                            query: {
                                title: this.taskTitle,
                                boardId: this.$route.query.taskboardId,
                                routing: this.$route.query.taskRouting,
                            }
                        }
                    )
                } else {
                    this.$emit("taskDetailBack");
                }
            }
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    .detailWrap
        height 100%
        position relative
        .main-header
            width 100%
        .detailScrollWrap
            height calc(100%-90px)
            .modalWrap
                width 100%
                .el-collapse
                    text-indent:1em
                  .el-collapse-item__content
                        padding-bottom 0
                        .titleThrough
                           text-decoration line-through
                       .avatarWrap
                           display inline-block
                           margin 0  0 0px -40px
                          .avatarWrap2
                             display inline-block
                             margin-bottom 10px
                          .lableSpan
                             margin-right 15px
                             display inline-block
                             width 45%
                             text-align center
                             color white
                    .ActivityCell
                       display flex
                       height 48px
                       .ActivityCell2
                          margin-top 20px

    .moveWrap
            .moveText
               font-size 16px
               display flex
               .vux-close
                  flex 15
                  margin 20px 0 0  45px
               .vux-close1
                  flex 1
                  margin 20px 5px 0  10px
            .moveTab
              margin 10px
              .vux-flex-row
                  height 30px
                  line-height 30px
                  margin-bottom 10px
                  .vux-flexbox-item
                     height 100%
                    .weui-btn_default
                        height 30px
                        line-height 30px
                        width 125px
                        background-color #40affc
                        color white
                        font-size 14px!important


</style>

