<!--子任务配置项-->
<template>
    <div class="subtaskWrap">
        <div class="detailSubtaskWrap" v-for="(tasklist,list) in filterTasklists" :key="list">
            <div class="foldContent">
                <div class="foldLeft">
                    <p class="Subtitle">{{tasklist.title}}</p>
                    <div class="chargeImg">负责人
                        <div class="chengLfetGroup" v-for=" cheng in tasklist.insertNew" :key="cheng">
                            <avatar v-if="cheng.value" :size="'default'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+cheng.value.substring(0,2)+"/"+cheng.value+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                        </div>
                        <div class="chargeRightGroup">
                            <i class="icon iconfont" v-if="isCarUrl" @click="chargeSearch(tasklist)" style="font-size: 30px">&#xe64e;</i>
                        </div>
                    </div>
                    <org-member-picker
                        :showPicker="showPersonPicker"
                        :initialSelected="tasklist.insertNew"
                        :designatedCardUrls="designatedCardUrls"
                        :multiple="multipleForSelPerson"
                        :showTab="showTab"
                        @picked="onPicked"
                        >
                    </org-member-picker>
                </div>
                <div class="foldRight">
                    <!--tasklist.listId === cardListId可以看到“开始”-->
                    <p class="btnWrap" v-show="!showEndBtn && (tasklist.listId === cardListId)">
                        <span class="kaishi" v-show="!tasklist.reserved1" @click="changeStarBtn(tasklist,$event)">开始</span>
                        <span class="zhuanjiao" v-show="tasklist.reserved1" @click="changeEndBtn()">完成并转交</span>
                    </p>
                    <p class="markerWrap">
                        <span class="markerStar" v-show="!tasklist.isMilestone" @click="markerBtn(tasklist)">设置里程碑</span>
                        <span class="markerConsle" v-show="tasklist.isMilestone" @click="markerBtn(tasklist)">设置里程碑</span>
                    </p>
                </div>
            </div>
            <div class="choceTimeContent">
                <div class="choceTimeLeft">
                    <group>
                        <datetime title="预期" placeholder="添加开始时间"
                                  v-model="tasklist.expectedStartTime"
                                  :min-year="2000" :max-year="2036" format="YYYY-MM-DD HH:mm"
                                  @on-change="change"
                                  @on-confirm="onConfirm(choseSetTime,tasklist,'start')"
                                  confirm-text="完成" cancel-text="取消"
                        ></datetime>
                    </group>
                </div>
                <div class="choceTimeRight">
                    <group>
                        <datetime placeholder="添加结束时间"
                                  v-model="tasklist.expectedEndTime"
                                  @on-change="change"
                                  @on-confirm="onConfirm(choseSetTime,tasklist,'end')"
                                  :min-year="2000" :max-year="2036" format="YYYY-MM-DD HH:mm"
                                  confirm-text="完成" cancel-text="取消"></datetime>
                    </group>
                </div>
            </div>
        </div>
        <!--转接遮罩-->
        <x-dialog class="xDialog" v-model="showDialog" hide-on-blur>
            <div class="select-scroll">
                <div class="select-content">
                    <input v-model="objlabel"/>
                    <ul class="selectUl">
                        <li class="selectLi" v-for="item in options" @click="gotoCard(item)">
                           <span v-html="item.value"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </x-dialog>
    </div>

</template>
<script>
    import { Datetime,Group,XDialog,Selector } from 'vux'
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import TagGroup from "components/taggroup/TagGroup";
    import avatar from "@/components/avatar/Avatar";
    import _ from "lodash";

    export default{
    components:{
       Datetime,Group,OrgMemberPicker, TagGroup,XDialog,Selector,avatar
    },
    props:['insertParams','updadeTaskActivits','createCardUrl','fuzerenRangearr','cardListId'],
    data() {
      return {
          taskActivits:[],  //loadAvtity  data數組
          cardContactListArr:[],// loadAvtity子任務配置項數組
          tasklists:[],
          filterTasklists:[],
          finish:true,
          isTaskShow:true,
          newWrite:'',
          companyId:'',
          showDialog: false,//转交弹框
          showEndBtn:false,//开始与完成按钮是否显示
          files: [],//图片资源
          showPersonPicker:false,//人员
          multipleForSelPerson:true,
          showTab:['designatedPersonnel'],
          showPicker: false,
          stewards:[], //初始選中負責人
          stewardsRange:"", //初始負責人範圍？？？？？？？
          items: [],
          SubTextareaNewName:'',
          showNew:true,//编辑
          choseSetTime:'',//时间
          value: '',
          objlabel:'',
          isCarUrl:false,//当页是否是创建者
        }
     },
        computed: {
            cardUrl() {
                return this.$store.state.ui.userInfo.cardUrl;
            },
            realName() {
                return this.$store.state.ui.userInfo.RealName;
            },
            //计算转接的子任务
            options () {
              if (this.tasklists){
                  let list = []
                  for (let i = 0; i < this.tasklists.length; i++) {
                      let obj = {}
                      obj.listId = this.tasklists[i].listId
                      obj.value = this.tasklists[i].title
                      list.push(obj)
                  }
                  if (!this.objlabel.trim()) {
                      return list
                  } else {
                      return list.filter((item) => {
                          return item.value.toLowerCase().indexOf(this.objlabel.toLowerCase()) !== -1;
                      })
                  }
              }
            },
            //初始负责人值
            _getloadBoardEsById() {
                let that = this
                let url = "/ZingMH/ZDesk/board/mater/loadBoardEsById.action"
                let params = {
                    boardId: this.insertParams.boardId,
                    routing: this.insertParams.routing,
                }
                that.$http.get(url,{ params:params })
                    .then(res => {
                        this.stewardsRange = res.data.data.data[0].subscribers
                        console.log('this.cardUrl',this.cardUrl,'this.createCardUrl',this.createCardUrl)
                        if (this.cardUrl === this.createCardUrl) {
                            this.isCarUrl = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            //子任务配置负责人范围
            designatedCardUrls() {
                if (this.fuzerenRangearr) {
                   let a = []
                   for (let i = 0;i < this.fuzerenRangearr.length;i++){
                      if ('' !== this.fuzerenRangearr[i]){
                        a.push(this.fuzerenRangearr[i])
                      }
                   }
                    console.log('打印',a)
                    return a
                }
            },
        },
        chargeSearch(tasklist) {
            debugger
            this.showPersonPicker = true;
        },
        onPicked(listpersen) {
            this.showPersonPicker = false;

        },
        created() {
            this.companyId = this.$store.state.ui.userInfo.companyId
        },
        mounted() {
            // todo 当页是否是创建者，需要修改，不是创建者，而是负责人。。。。。。
            setTimeout(()=>{
                console.log('this.cardUrl',this.cardUrl,'this.createCardUrl',this.createCardUrl)
                if (this.cardUrl === this.createCardUrl) {
                    console.log("mounted this.isCarUrl = true")
                    this.isCarUrl = true
                }
            },2000)
              this._getloadLists()
            //   this._getloadBoardEsById()
        },

        methods: {

            //獲取loadActivit
            _getActivity() {
                let url = "/ZingMH/ZDesk/activity/mater/loadActivit.action"
                let params = {
                    cardId: this.insertParams.cardId,
                    routing:this.companyId,
                }
                this.$http.get(url,{ params:params })
                    .then(res => {
                        this.cardContactListArr = res.data.cardContactListArr
                        this.taskActivits = res.data.data
                        // filterTasklists賦值
                        this.filterTask()
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            filterTask() {
                    //完成
                  let arr1 = []
                  if (this.taskActivits) {
                          arr1 = this.taskActivits.filter((item,index)=>{
                          return item.reserved1 === 'start'
                      })
                  }
                    //获取并展示时间
                    let arr = []
                    let tasklists = this.tasklists
                    let cardContactListArr = this.cardContactListArr
                    if ( cardContactListArr.length > 0) {
                        for (let i in cardContactListArr) {
                            if (!cardContactListArr[i].hasOwnProperty("expectedStartTime")) {
                                cardContactListArr[i].expectedStartTime = ''
                            } else {
                                cardContactListArr[i].expectedStartTime = cardContactListArr[i].expectedStartTime.slice(0,16)
                            }
                            if (!cardContactListArr[i].hasOwnProperty("expectedEndTime")) {
                                cardContactListArr[i].expectedEndTime = ''
                            } else {
                                cardContactListArr[i].expectedEndTime = cardContactListArr[i].expectedEndTime.slice(0,16)
                            }

                            //给cardContactListArr添加insertNew属性
                            cardContactListArr[i].insertNew = []
                            //insertNew初始值
                            if (cardContactListArr[i].stewards) {
                                let arr = cardContactListArr[i].stewards.split(" ")
                                for (let j = 0; j < arr.length; j++) {
                                    cardContactListArr[i].insertNew.push({
                                        value: arr[j],
                                        type: "user"
                                    })
                                }
                            }
                            //判断是否开始
                            for (let j=0;j<arr1.length;j++){
                                if (cardContactListArr[i].listId === arr1[j].listId ) {
                                  //已开始的，添加reserved1属性 = true
                                    cardContactListArr[i].reserved1 = true
                                }
                            }
                            for (let j=0;j<tasklists.length;j++){
                                if (cardContactListArr[i].listId === tasklists[j].listId ) {
                                    //将任务名属性加到集合
                                    cardContactListArr[i].title = tasklists[j].title
                                }
                            }
                            arr.push(cardContactListArr[i])
                        }
                    }
                    this.filterTasklists = arr
                    return arr
                },
            _getloadLists() {
              this.$http.get(
                  "/ZingMH/ZDesk/list/mater/loadLists.action",
                  {
                      params: {
                            boardId:this.insertParams.boardId,
                            routing:this.companyId,
                            status:'start'
                      }
                  }
              ).then(res => {
                  this.tasklists = res.data.data
                  this._getActivity()
              }).catch(err => {
                  console.log(err)
              })
          },
          //更新时间
          change(value) {
              let choseSetTime = value + ":00"
              this.choseSetTime = choseSetTime
          },
          onConfirm(choseSetTime,tasklist,startOrEnd) {
              this.$nextTick((choseSetTime) => {
                  let url = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
                  let params = {}
                  if (startOrEnd === 'start'){
                       params = {
                          expectedStartTime: this.choseSetTime,
                          cardId:tasklist.cardId,
                          listId:tasklist.listId,
                          routing:tasklist.companyId,
                      }
                  } else if (startOrEnd === 'end'){
                       params = {
                          expectedEndTime: this.choseSetTime,
                          cardId:tasklist.cardId,
                          listId:tasklist.listId,
                          routing:tasklist.companyId,
                      }
                  }
                  this.$http.get(url,{params:params})
                      .then(res => {
                           let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                           let params2 = {
                      type:'message',
                      boardId:tasklist.boardId,
                      listId:tasklist.listId,
                      cardId:tasklist.cardId,
                      routing:tasklist.companyId,
//                      alertUserName:刘成                       //??
                      members:this.$store.state.ui.userInfo.cardUrl, // member?
                      subscribers:this.$store.state.ui.userInfo.cardUrl, // subscribers?
                      cardTitle:this.$route.query.title,
                          }
                          this.$http.get(url2, {params: params2})
                              .then(res => {
                                  this.$vux.toast.show({text:"设置成功！",type:"success"})
                                  let cc = true
                                  this.$emit('detailStartTime',cc)
                              })
                              .catch(err => {
                                  console.log(err)
                              })
                      })
                      .catch(err => {
                          console.log(err)
                      });
              })
          },

          //开始并转交
          _sliblings(elm){
              let blings = []
              let p = elm.parentNode.children
              for (let i =0,pl= p.length;i<pl;i++) {
                  if (p[i] !== elm) blings.push(p[i])
              }
              return blings
          },
            //开始
          changeStarBtn(tasklist,event) {
              this._sliblings(event.target)[0].style.display = "inline"
              event.target.style.display = 'none'

              let that = this
              that.insertParams.val = `开始子任务：【${ tasklist.title }】`
              that.insertParams.reserved1 = 'start'
              that.insertParams.listId = tasklist.listId
              that.insertParams.type = 'subTask'
              let url1 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
              that.$http.get(url1, { params: that.insertParams })
                  .then(res => {
                      //通知load
                      let TellDetail = true
                      that.updadeTaskActivits(res.data,TellDetail)
                      that.$vux.toast.show({text:"开始",type:"success"})
                  })
                  .catch(err => {
                      console.log(err)
                  })
              let ur2 = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
              let params = {
                  handlingStatus:'start',
                  cardId:this.$route.query.taskCardId,
                  listId:this.$route.query.taskListId,
                  routing:this.$route.query.companyId,
              }
              this.$http.get(ur2,{params:params})
                  .then(res => {

                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
             //转交
          changeEndBtn(){
              this.showDialog = true
          },
          gotoCard(item) {
            let url = "/ZingMH/ZDesk/card/mater/moveCard.action"
            let listId = item.listId
            let params = {
                listId: listId,
                oldListId:this.$route.query.taskListId,
                cardId:this.$route.query.taskCardId,
                routing:this.$route.query.companyId,
                subTaskHandlingStatus:'solved',
            }
            this.$http.get(url,{params:params})
                .then(res => {
                 this.showEndBtn = true
                 this.showDialog = false
                 this.$vux.toast.show({text:"设置成功！",type:"success"})
                })
                .catch(err => {
                    console.log(err)
                });
          },
         //里程碑
            markerBtn(tasklist) {
                let url = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
                tasklist.isMilestone =!tasklist.isMilestone
                let isMilestone = tasklist.isMilestone
                let params = {
                    cardId:tasklist.cardId,
                    listId:tasklist.listId,
                    isMilestone:isMilestone,
                    routing:tasklist._routing
                }
                this.$http.get(url,{params:params})
                    .then(res => {
                      //insertActivity
                        let that = this
                        if (tasklist.isMilestone){
                            that.insertParams.val = `將子任務：【${ tasklist.title }】設置里程碑`
                        } else {
                            that.insertParams.val = `取消子任務：【${ tasklist.title }】里程碑`
                        }
//                        members: 2YV3emJ3MfiaARbu6jJVji2m
//                        subscribers: 2YV3emJ3MfiaARbu6jJVji2m
//                        that.insertParams.val = insertParamsVal
                        that.insertParams.reserved1 = 'start'
                        that.insertParams.listId = tasklist.listId
                        that.insertParams.type = 'message'
                        let url1 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                        that.$http.get(url1, { params: that.insertParams })
                            .then(res => {
                                //通知load
                                let TellDetail = true
                                that.updadeTaskActivits(res.data,TellDetail)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        this.$vux.toast.show({text:"设置成功",type:"success"})
                    })
                    .catch(err => {
                        console.log(err)
                    });
          },
          onChange (val) {
             console.log(val)
          },
         Changed(arr) {
              this.items = arr;
          },
      },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .detailSubtaskWrap
      width 100%
      .foldContent
         display:flex
         .foldLeft
            width: 50%
            .tag-group
               padding 0
            .chargeImg
               display flex
            .Subtitle
                display block
                width 100px
                word-break keep-all
                white-space nowrap
                overflow  hidden
                text-overflow ellipsis
         .foldRight
            text-align: -webkit-right
            text-indent:1em;
            flex:1
            .btnWrap,.markerWrap
              .kaishi,.zhuanjiao,.markerStar,markerConsle
                 margin 20px
                 padding 3px
                 background-color #35d5ff
                 border-radius 3px
                 color white
              .zhuanjiao
                  background-color #ffa39a
            .markerWrap
              .markerStar
                  background-color #adadad
                  height 20px
                  margin 20px
              .markerConsle
                  background-color #7ad7da
                  height 20px
                  margin 20px
      .choceTimeContent
          display:flex
          font-size 50%
          .choceTimeLeft
              width: 50%
              .weui-cells
                  font-size 14px
                  margin-left -10px
                  margin-right -10px
                  .vux-cell-value
                     margin-left -10px
          .choceTimeRight
              flex:1
              .weui-cells
                 font-size 14px
   .weui-dialog
      width 70%
      .select-scroll
          overflow auto
          .select-content
             height 100%
      input
         border 1px solid #f9d200
         border-radius 3px
         height 30px
         width 95%
         margin 5px 0 0 -10px
        .selectUl
          overflow scroll
          height 150px
          .selectLi
             display flex
             background-color  #74a5fd
             height 30px
             line-height 30px
             border-radius 3px
             margin 5px
             span
               font-size 14px
</style>
