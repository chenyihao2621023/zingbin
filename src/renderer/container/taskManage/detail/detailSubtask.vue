<!--子任务配置项-->
<template>
    <div class="subtaskWrap">
        <div class="detailSubtaskWrap" v-for="(tasklist,list) in filterTasklists" :key="list">
            <div class="foldContent">
                <div class="foldLeft">
                    <span class="Subtitle">{{tasklist.title}}</span>
                    <div class="chargeImg">
                        <span class="chargeMan">负责人</span>
                      <div>
                        <div class="chengLfetGroup" v-for=" cheng in tasklist.insertNew" :key="cheng">
                          <avatar v-if="cheng.headImg" :size="'default'" shape="square" :src="getImageUrl(cheng.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin:5px;"></avatar>
                          <avatar v-else :size="'default'" shape="square" src="../../assets/img/userDef_.jpg" style=" float: left;margin:5px;"></avatar>
                        </div>
                      </div>

                        <div class="chargeRightGroup" v-if="taskLeaderValue">
                            <i class="icon iconfont icon-jiahao-kongxin-fangxing" v-if="(taskLeaderValue.indexOf(cardUrl)!==(-1))" @click="chargeSearch(tasklist.listId)"></i>
                        </div>
                    </div>
                    <org-member-picker
                        :title="'选择负责人'"
                        :showPicker="tasklist.listId === subtaskListId"
                        :initialSelected="tasklist.insertNew"
                        :designatedCardUrls="designatedCardUrls"
                        :multiple="multipleForSelPerson"
                        :showTab="showTab"
                        @picked="onPicked"
                        @abort="onPickAbort"
                    >
                    </org-member-picker>
                </div>
                <div class="foldRight">
                    <!--tasklist.listId === cardListId可以看到“开始”-->
                    <div class="btnPowerWrap" v-if="tasklist.stewards">
                        <p class="btnWrap" v-show="!showEndBtn && (tasklist.listId === cardListId) && (tasklist.stewards.trim().split(' ').indexOf(cardUrl)!==(-1))">
                            <span class="kaishi" v-show="tasklist.handlingStatus === 'notBegin'" @click="changeStarBtn(tasklist,$event)">开始</span>
                            <span class="zhuanjiao" v-show="tasklist.handlingStatus === 'start'" @click="changeEndBtn(tasklist)">完成并转交</span>
                        </p>
                    </div>
                    <p class="markerWrap">
                        <span class="markerConsle" v-if="tasklist.isSetmilestoneMark" @click="markerBtn(tasklist)">里程碑</span>
                        <span class="markerStar" v-else @click="markerBtn(tasklist)">里程碑</span>
                    </p>
                </div>
            </div>
            <div class="choceTimeContent">
                <div class="choceTimeLeft">
                        <datetime class="chosetimeTitle" title="预期" placeholder="添加开始时间"
                                  v-model="tasklist.expectedStartTime"
                                  :min-year="2000" :max-year="2036" format="YYYY-MM-DD HH:mm"
                                  @on-change="change"
                                  @on-confirm="onConfirm(tasklist,'start')"
                                  confirm-text="完成" cancel-text="取消"
                        >
                        </datetime>

                </div>
                <div class="choceTimeRight">
                        <datetime placeholder="添加结束时间"
                                  v-model="tasklist.expectedEndTime"
                                  @on-change="change"
                                  @on-confirm="onConfirm(tasklist,'end')"
                                  :min-year="2000" :max-year="2036" format="YYYY-MM-DD HH:mm"
                                  confirm-text="完成" cancel-text="取消">
                        </datetime>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import { Datetime,Group,XDialog,Selector } from 'vux'
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import TagGroup from "components/taggroup/TagGroup";
    import avatar from "@/components/avatar/Avatar";
    import _ from "lodash";
    import { getImageUrl } from "../../../utils/fn";

    export default{
    components:{
       Datetime,Group,OrgMemberPicker, TagGroup,XDialog,Selector,avatar
    },
    props:['insertParams','updadeTaskActivits','fuzerenRangearr','cardListId','tasklists','buildFileUrl','taskLeaderValue'],
    data() {
      return {
          taskActivits:[],  //loadAvtity  data數組
          cardContactListArr:[],// loadAvtity子任務配置項數組
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
          stewards:'', //初始页面子配负责人
          items: [],
          SubTextareaNewName:'',
          showNew:true,//
          startTime:'',//开始时间
          endTime:'',//结束时间
          timeFlag:true,
          objlabel:'',
          subtaskListId: "",//保存点击的子任务配置项ListId
          subtaskListId2:'',
        }
     },
        computed: {
            cardUrl() {
                return this.$store.state.ui.userInfo.cardUrl;
            },
            realName() {
                return this.$store.state.ui.userInfo.RealName;
            },
            //子任务配置负责人范围
            designatedCardUrls() {
                let a = []
                if (this.fuzerenRangearr) {
                    for (let i=0;i<this.fuzerenRangearr.length;i++) {
                        a.push(this.fuzerenRangearr[i].value)
                    }
                }
                return a
            },
        },
        watch: {
            tasklists () {
                this.tasklists = this.tasklists
                this._getActivity()
            }
        },
        created() {
            this.companyId = this.$store.state.ui.userInfo.companyId
        },

        methods: {
            getImageUrl,
            //修改里程碑颜色
            changeMilestoneMark(markertext,tasklist){
                tasklist.milestoneMark = markertext
                tasklist.isSetmilestoneMark = true
                for (let i=0;i<this.filterTasklists.length;i++) {
                    if (this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                        this.$set(this.filterTasklists,i,tasklist)
                    }
                }
            },
            //获取loadActivit
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
            chargeSearch(listId) {
                //保存点击的listid,用于控制选人组件是否显示
                this.subtaskListId = listId
                //保存点击的listid,用于onPicked发送updatecardContact请求的参数
                this.subtaskListId2 = listId
            },
            arrayUnique (arr){
                let newArr = []
                for (let i=0 ; i<arr.length ; i++) {
                    if (newArr.indexOf(arr[i]) === (-1)) {
                        newArr.push(arr[i])
                    }
                }
                return newArr
            },
            onPicked(list) {
                let newStewards = ''
                for (let i = 0; i < list.length; i++) {
                    newStewards += list[i].cardUrl + ' '
                }
                let params = {
                    stewards: newStewards,
                    listId: this.subtaskListId2,
                    cardId: this.insertParams.cardId,
                    routing: this.insertParams.routing,
                }
                let url = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
                this.$http.get(url, { params: params })
                    .then(res => {
                        //更新初始值
                        let subtaskName = ''
                        let insertNew = []
                        for (let i=0 ; i< this.filterTasklists.length;i++) {
                            if (this.filterTasklists[i].listId === this.subtaskListId2) {
                                if (newStewards) {
                                    let arr = newStewards.trim().split(" ")
                                    let arr2 = this.arrayUnique(arr)   //去重
                                    for (let j = 0; j < arr2.length; j++) {
                                        this.buildFileUrl.forEach((item, index) => {
                                            let buildFileUrl = item
                                            if (arr2[j] && arr2[j] === buildFileUrl.cardUrl) {
                                                insertNew.push({
                                                    value: arr2[j],
                                                    type: "user",
                                                    headImg: buildFileUrl.headImg
                                                })
                                            }
                                        })
                                    }
                                }
                                this.filterTasklists[i].insertNew = insertNew
                                this.$set(this.filterTasklists,i,this.filterTasklists[i])
                                //关闭页面
                                // this.showPersonPicker = false;
                                this.subtaskListId = ''
                                subtaskName = this.filterTasklists[i].title
                            }
                        }

                        let str = ''
                        for (let i=0;i<list.length;i++) {
                            for (let j=0;j<this.buildFileUrl.length;j++) {
                                if (this.buildFileUrl[j].cardUrl === list[i].cardUrl) {
                                    str += this.buildFileUrl[j].userName + ' '
                                }
                            }
                        }
                        this.insertParams.val = `将${str}设置为【${subtaskName}】的负责人`
                        this.insertParams.type = 'message'
                        let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                        this.$http.get(url2, { params: this.insertParams})
                            .then(res => {
                                this.$vux.toast.show({ text: "设置负责人成功", type: "success" })
                                //通知load
                                let TellDetail = true
                                this.updadeTaskActivits(res.data.data, TellDetail)
                            })
                            .catch( err => {
                                this.$vux.toast.show({ text: "设置负责人失败", type: "false" })
                            });
                    })
                    .catch(err => {
                        this.$vux.toast.show({text: "修改成功", type: "false"})
                    });
            },
            onPickAbort() {
                this.subtaskListId = ''
            },
            //filterTasklists等赋值
            filterTask() {
                    //获取并展示时间
                    let tasklists = this.tasklists
                    let cardContactListArr = this.cardContactListArr
                    this.startOrEndTime = []//保存时间
                    this.filterTasklists = []
                    if ( cardContactListArr.length > 0) {
                        for (let i in cardContactListArr) {
                          //开始与转交
                            if (cardContactListArr[i].milestoneMark){
                                cardContactListArr[i].isSetmilestoneMark = true
                            } else {
                                cardContactListArr[i].isSetmilestoneMark = false
                            }

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
                            //给cardContactListArr添加insertNew成员初始值
                            if (cardContactListArr[i].stewards) {
                                let arr = cardContactListArr[i].stewards.trim().split(" ")
                                for (let j = 0; j < arr.length; j++) {
                                    this.buildFileUrl.forEach((item, index) => {
                                        let buildFileUrl = item
                                        if (arr[j] && arr[j] === buildFileUrl.cardUrl) {
                                            cardContactListArr[i].insertNew.push({
                                                value: arr[j],
                                                type: "user",
                                                headImg: buildFileUrl.headImg
                                            })
                                        }
                                    })
                                }
                            }
                            for (let j=0;j < tasklists.length;j++){
                                if (cardContactListArr[i].listId === tasklists[j].listId ) {
                                    //给cardContactListArr添加任务名属性
                                    cardContactListArr[i].title = tasklists[j].title
                                }
                            }
                            this.filterTasklists.push(cardContactListArr[i])
                        }
                    }
                    //保存旧的时间
                    for (let i = 0; i< this.filterTasklists.length;i++ ) {
                      let obj = {}
                        obj.expectedStartTime = this.filterTasklists[i].expectedStartTime
                        obj.expectedEndTime = this.filterTasklists[i].expectedEndTime
                        this.startOrEndTime.push(obj)
                    }
                },
          //更新时间
            change(value){
                this.choseSetTime = value + ":00"
            },
            onConfirm(tasklist,startOrEnd) {
              /*
                   if (startOrEnd === 'start') {
                        if (tasklist.expectedEndTime !== '' && tasklist.expectedEndTime !== undefined ){
                             if (this.choseSetTime >= tasklist.expectedEndTime) {
                                  this.timeFlag = false

                             } else {
                                   this.timeFlag = true
                                   //保存旧的时间
                             }
                        } else {
                             this.timeFlag = true
                             //保存旧的时间
                        }
                   }else if (startOrEnd === 'end') {
                       ......
                   }
               */
              if (startOrEnd === 'start') {
                        if (tasklist.expectedEndTime !== '' && tasklist.expectedEndTime !== undefined ){
                                if (this.choseSetTime >= tasklist.expectedEndTime) {
                                        for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                           if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {

                                               if (this.startOrEndTime[i].expectedStartTime === ''){
                                                   //待解释
                                                   this.$set(this.filterTasklists,i,this.filterTasklists[i])
                                                   this._getActivity()
                                               } else {
                                                   this.filterTasklists[i].expectedStartTime = this.startOrEndTime[i].expectedStartTime
                                                   this.$set(this.filterTasklists,i,this.filterTasklists[i])
                                               }
                                           }
                                        }
                                        this.timeFlag = false
                                        this.$vux.toast.text("开始时间不能晚于结束时间");
                                } else {
                                    this.timeFlag = true
                                    for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                        if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                                            this.startOrEndTime[i].expectedStartTime = this.filterTasklists[i].expectedStartTime
                                        }
                                    }
                                }
                        } else {
                                this.timeFlag = true
                                for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                    if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                                        this.startOrEndTime[i].expectedStartTime = this.filterTasklists[i].expectedStartTime
                                    }
                                }
                        }
              } else if (startOrEnd === 'end') {
                            if (tasklist.expectedStartTime !== ''&& tasklist.expectedStartTime !== undefined){
                                if (this.choseSetTime <= tasklist.expectedStartTime) {
                                    for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                        if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                                        if (this.startOrEndTime[i].expectedEndTime === '') {
                                            //待解释
                                            this.$set(this.filterTasklists,i,this.filterTasklists[i])
                                            this._getActivity()
                                        } else {
                                            this.filterTasklists[i].expectedEndTime = this.startOrEndTime[i].expectedEndTime
                                            this.$set(this.filterTasklists,i,this.filterTasklists[i])
                                        }
                                        }
                                    }
                                    this.timeFlag = false
                                    this.$vux.toast.text("开始时间不能晚于结束时间");
                                } else {
                                    this.timeFlag = true
                                    for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                        if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                                            this.startOrEndTime[i].expectedEndTime = this.filterTasklists[i].expectedEndTime
                                        }
                                    }
                                }
                    } else {
                            this.timeFlag = true
                            for (let i = 0 ;i<this.filterTasklists.length; i++) {
                                if ( this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                                    this.startOrEndTime[i].expectedEndTime = this.filterTasklists[i].expectedEndTime
                                }
                            }
                    }
              }

              if (this.timeFlag) {

                  this.$nextTick((choseSetTime) => {
                      let url = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
                      let params = {}
                      if (startOrEnd === 'start') {
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
                              let val = ``
                              if (startOrEnd === 'start'){
                                  val = `将${tasklist.title}的预期开始时间设置为:${this.choseSetTime}`
                              } else if (startOrEnd === 'end'){
                                  val = `将${tasklist.title}的预期结束时间设置为:${this.choseSetTime}`
                              }
                              let params2 = {
                                  type:'message',
                                  boardId:tasklist.boardId,
                                  listId:tasklist.listId,
                                  cardId:tasklist.cardId,
                                  routing:tasklist.companyId,
                                  //                      alertUserName:刘成                       //??
                                  members:this.$store.state.ui.userInfo.cardUrl, // member todo?
                                  subscribers:this.$store.state.ui.userInfo.cardUrl, // subscribers todo?
                                  cardTitle:tasklist.title,
                                  val:val
                              }
                              this.$http.get(url2, {params: params2})
                                  .then(res => {
                                      this.$vux.toast.show({text:"设置成功",type:"success"})
                                      let cc = true
                                      this.$emit('detailStartTime',cc)
                                      let TellDetail = true
                                      this.updadeTaskActivits(res.data.data,TellDetail)
                                  })
                                  .catch(err => {
                                      console.log(err)
                                  })
                          })
                          .catch(err => {
                              console.log(err)
                          });
                  })
              }

          },
            //开始
          changeStarBtn(tasklist,event) {
              let that = this
              let ur2 = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
              let params = {
                  handlingStatus:'start',
                  cardId:tasklist.cardId,
                  listId:tasklist.listId,
                  routing:tasklist._routing,
              }
              this.$http.get(ur2,{params:params})
                  .then(res => {
                      tasklist.handlingStatus = 'start'
                      for (let i=0;i<this.filterTasklists.length;i++) {
                         if (this.filterTasklists[i].cardContactId === tasklist.cardContactId) {
                             this.$set(this.filterTasklists,i,tasklist)
                         }
                      }
                      that.insertParams.val = `开始子任务：【${ tasklist.title }】`
                      that.insertParams.reserved1 = 'start'
                      that.insertParams.listId = tasklist.listId
                      that.insertParams.type = 'subTask'
                      let url1 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      that.$http.get(url1, { params: that.insertParams })
                          .then(res => {
                              //通知load
                              let TellDetail = true
                              that.updadeTaskActivits(res.data.data,TellDetail)
                          })
                          .catch(err => {
                              console.log(err)
                          })
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
           //转交,在父组件
            changeEndBtn(tasklist) {
                this.$emit('changeTransfer',tasklist)
            },
         //里程碑  (tasklist就是cardContactListArr中的)
            markerBtn(tasklist) {
               this.$emit('changemarker',tasklist)
          },

      },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .detailSubtaskWrap
      width 100%
      border-bottom 1px solid gray
      .foldContent
         display:flex
         marginar 0 -15px 0 0
        .foldLeft
            width: 70%
           .tag-group
               padding 0
           .chargeImg
               display flex
               font-size 14px
               line-height: 53px
               .chargeMan
                  min-width 60px
             .iconfont
                font-size 30px
                color #736e6e85
            .Subtitle
                font-size 15px
                display block
                width 100px
                word-break keep-all
                white-space nowrap
                overflow  hidden
                text-overflow ellipsis
         .foldRight
            position relative
            overflow hidden
            text-align: -webkit-right
            text-indent:1em;
            flex:1
            .btnWrap,.markerWrap
                 .kaishi,.zhuanjiao,.markerStar,markerConsle
                     margin 20px
                     width 60px
                     height 35px
                     font-size 14px
                     padding 3px
                     background-color #35d5ff
                     border-radius 4px
                     color white
                 .zhuanjiao
                     background-color #ffa39a
             .markerWrap
                 position absolute
                 top 26px
                 right 0
                 height 53px
                 line-height 53px
                 .markerStar
                     background-color #adadad
                     height 20px
                     margin 20px
                 .markerConsle
                     background-color #7ad7da
                     height 20px
                     margin 20px
                     padding 3px
                     color white
      .choceTimeContent
          display:flex
          margin -10px 0
          font-size 14px
          .choceTimeLeft
              width: 50%
              flex 1
              margin-left -13px
              .chosetimeTitle
                  white-space: nowrap
                  font-size 14px
              .weui-cells
                  font-size 14px
                  margin-left -10px
                  margin-right -10px
                  .weui-cell__ft
                       font-size 14px
                       text-align: left;
                       white-space: nowrap;
                       padding-right: 0;
                       position: relative;
                  .vux-cell-value
                      margin-left -10px
          .choceTimeRight
              flex:1
              font-size 14px
              .weui-cells
                 font-size 14px
   .TransferWrap
      width 70%
      .select-scroll
          overflow auto
          .select-content
             height 100%
</style>
