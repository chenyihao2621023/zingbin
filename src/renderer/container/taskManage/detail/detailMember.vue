<template>
        <div class="modalThree">
            <div class="chengWrap">
                <div class="chengImg">
                    <div class="chengImg2"><span class="chengText">成员</span></div>
                    <div class="chengAvatar">
                        <div v-for=" (cheng,index) in insertNew" :key="index" @click="chengyuanXQ(index)">
                            <avatar v-if="cheng.headImg" :size="'default'" shape="square" :src="getImageUrl(cheng.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                            <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                        </div>
                        <div class="chengRightGroup">
                             <i class="icon iconfont" @click="selectInputPerson()" v-show="ifShowIcon" style="font-size: 30px">&#xe64e;</i>
                        </div>
                    </div>
                </div>
                <org-member-picker
                    :showPicker="showPersonPicker"
                    :initialSelected="insertNew"
                    :designatedCardUrls="designatedCardUrls"
                    :multiple="multipleForSelPerson"
                    :showTab="showTab"
                    @picked="onPicked"
                    @abort="onPickAbort"
                    >
                </org-member-picker>
            </div>
            <div class="fuzeWrap">
                <div class="fuzeImg">
                    <div class="fuzeImg2"><span class="fuzeText" :class="{'fuclass':vertical}">负责人</span></div>
                    <div class="fuzeAvatar">
                       <div v-for="(fuzeren,index) in insertNew2" :key="index" @click="fuzerenXQ(index)">
                            <avatar v-if="fuzeren.headImg" :size="'default'" shape="square" :src="getImageUrl(fuzeren.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin5px"></avatar>
                            <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin:5px;"></avatar>
                       </div>
                       <div class="fuzeRightGroup">
                            <i class="icon iconfont" @click="selectInputPerson2()" v-show="ifShowIcon" style="font-size: 30px">&#xe64e;</i>
                       </div>
                    </div>
                </div>
                <org-member-picker
                    :title="'选择负责人'"
                    :showPicker="showPersonPicker2"
                    :initialSelected="insertNew2"
                    :designatedCardUrls="designatedCardUrls2"
                    :multiple="multipleForSelPerson2"
                    :showTab="showTab2"
                    @picked="onPicked2"
                    @abort="onPickAbort2">
                </org-member-picker>
            </div>
        </div>
</template>
<script>
  import ImagePicker from "@/components/imagepicker/ImagePicker";
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
  import OrgMemberDetail from "@/components/orgmemberpicker/OrgMemberDetail"
  import TagGroup from "components/taggroup/TagGroup";
  import { Grid, GridItem , Cell,Group, } from 'vux'
  import avatar from "@/components/avatar/Avatar";
  import { getImageUrl } from "../../../utils/fn"

  export default{
      components: {
          ImagePicker, Grid, GridItem, OrgMemberPicker,OrgMemberDetail, Cell, Group, TagGroup,avatar
      },
      props: ['insertParams', 'updadeTaskActivits','getLeaders','getMembers','getTaskMembers','subtaskFuzerenRange','buildFileUrl'],

      data () {
          return {
              vertical: false,//fuzeren样式
              companyId: "",
              files: [],//图片资源
              //选人组建成员 参数
              insertNew: [],//成员初始显示
              subscribers: '', //人员初始值
              subscribersRange: "", //人员初始范围
              showPersonPicker: false, //是否显示选人组件
              multipleForSelPerson: true, //人员是否多选
              showTab: ['designatedPersonnel'],//自定義顯示選人tab
              subscribersTransform: '',
              //选人组建负责人 参数
              insertNew2: [],//负责人初始显示
              stewards: '', //负责人初始值
              showPersonPicker2: false,//是否显示选人组件
              multipleForSelPerson2: true,//人员是否多选
              showTab2: ['designatedPersonnel'],
              ifShowIcon:false,//是否展示添加按钮
              createCardUrl:'',//创建者
          }
      },
      computed: {
          cardUrl() {
              return this.$store.state.ui.userInfo.cardUrl;
          },
          realName() {
              return this.$store.state.ui.userInfo.RealName;
          },
          //选人组件人员初始范围
          designatedCardUrls() {
              let subscribersRangeArr = this.subscribersRange.trim().split(' ')  //人员初始范围
              let chengfanwei = this.arrayUnique(subscribersRangeArr)           //去重
              return chengfanwei
          },
          //选人组件负责人初始范围
          designatedCardUrls2() {
              let arr = []
              if (this.insertNew) {
                  for (let i=0;i<this.insertNew.length;i++) {
                      arr.push(this.insertNew[i].value)
                  }
              }
              return arr
          },
      },
      created() {
          this.companyId = this.$store.state.ui.userInfo.companyId
      },
      mounted() {
          this._getloadBoardEsById()
      },
      methods: {
          getImageUrl,
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
          //成员初始显示
          getinsertNew () {
              //清空上次
              this.insertNew = []
              let subarr = []
              let subscribersRangeArr = []
              if (this.subscribers) {
                  subarr = this.subscribers.trim().split(' ')    //人员初始值
                  let arr2 = this.arrayUnique(subarr)
                  if (this.subscribersRange) {
                      subscribersRangeArr = this.subscribersRange.trim().split(' ')  //人员初始范围
                      let arr3 = this.arrayUnique(subscribersRangeArr)
                      //编辑后的成员范围同步去掉初始显示成员
                      for (let i = 0; i < arr2.length; i++) {
                          for (let j = 0;j < arr3.length;j++) {
                              if (arr3[j] === arr2[i]) {
                                  //添加,headImg属性
                                  this.buildFileUrl.forEach((item, index) => {
                                      let buildFileUrl = item
                                      if (arr2[i] && arr2[i] === buildFileUrl.cardUrl) {
                                          this.insertNew.push({
                                              value: arr2[i],
                                              type: "user",
                                              headImg: buildFileUrl.headImg
                                          })
                                      }
                                  })
                              }
                          }
                      }
                  }
              }
              // 传给父组件，再给detailSubtask组件，用于子任务负责人
              this.subtaskFuzerenRange(this.insertNew)
          },
          //负责人初始显示
          getinsertNew2 () {
              //清空上次
              this.insertNew2 = []
              if (this.stewards) {
                  let subsetarr = this.stewards.trim().split(' ')  //负责人初始值
                  let arr = this.arrayUnique(subsetarr)
                  for (let i = 0; i < arr.length; i++) {
                      //添加,headImg属性
                      this.buildFileUrl.forEach((item, index) => {
                          let buildFileUrl = item
                          if (arr[i] && arr[i] === buildFileUrl.cardUrl) {
                              this.insertNew2.push({
                                  value: arr[i],
                                  type: "user",
                                  headImg: buildFileUrl.headImg
                              })
                          }
                      })
                  }
                  //传负责人到父组件,展示两个负责人
                  this.getLeaders(this.insertNew2)
              }
          },
          //人员初始范围（即任务集成员）
          _getloadBoardEsById(){
              let that = this
              let url = "/ZingMH/ZDesk/board/mater/loadBoardEsById.action"
              let params = {
                  boardId: this.insertParams.boardId,
                  routing: this.insertParams.routing,
              }
              that.$http.get(url,{params: params})
                  .then(res => {
                      this.subscribersRange = res.data.data.data[0].subscribers  //字符串
                      //传成员范围到父组件，确定任务集人员
                      this.getTaskMembers(this.subscribersRange)

                      this._getloadCardByCardId()
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
          //人员初始值，负责人初始值
          _getloadCardByCardId() {
              let that = this
              let param1 = {
                  cardId: this.insertParams.cardId,
                  routing: this.insertParams.routing,
                  pageNumber: 1
              }
              let url1 = "/ZingMH/ZDesk/card/mater/loadCardByCardId.action"
              that.$http.get(url1, {params: param1})
                  .then(res => {
                      this.subscribers = res.data.data.data[0].members
                      //传成员范围到父组件，对比成员是否在该任务
                      this.getMembers(this.subscribers)
                      this.getinsertNew()
                      this.stewards = res.data.data.data[0].stewards
                      //判断是否能看到编辑加号
                      let stewardArr = this.stewards.trim().split(' ')
                      for (let i = 0; i < stewardArr.length; i++){
                          if (stewardArr[i] === this.cardUrl) {
                           this.ifShowIcon = true
                        }
                      }
                      this.getinsertNew2()
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
          selectInputPerson() {
              this.showPersonPicker = true
          },
          selectInputPerson2(){
              this.showPersonPicker2 = true
          },
          //成员详情
          chengyuanXQ(index) {
              let cardUrl = this.insertNew[index].value
              this.$emit('chengyuanXQ',cardUrl)
          },
          //负责人详情
          fuzerenXQ(index) {
              let cardUrl = this.insertNew2[index].value
              this.$emit('fuzerenXQ',cardUrl)
          },
          //成員選擇
          onPicked(list) {
              this.showPersonPicker = false;
              let newSubscribers = ''
              for (let i = 0; i < list.length; i++) {
                  newSubscribers += list[i].cardUrl + ' '
              }
              //判断是否删除了负责人们stewards
              let oldArr = this.subscribers.trim().split(' ')
              let newArr = newSubscribers.trim().split(' ')
              let delArr = []
              let isDelFuzeren = false
              //找到删掉的成员
              for (let i=0 ; i<oldArr.length ; i++) {
                 if (newArr.indexOf(oldArr[i]) === (-1)){
                     delArr.push(oldArr[i])
                 }
              }
              //判断是否删掉负责人
              for (let i = 0;i< delArr.length;i++) {
                  let stewardArr = this.stewards.trim().split(' ')
                  for (let j = 0; j < stewardArr.length; j++) {
                      if (delArr[i] === stewardArr[j]) {
                          isDelFuzeren = true
                      }
                  }
              }
              if (isDelFuzeren) {
                  this.$vux.toast.text("不能删除负责人")
                  return
              }
              let params2 = {
                  cardId: this.insertParams.cardId,
                  members: newSubscribers,
                  routing: this.insertParams.routing,
              }
              let url2 = "/ZingMH/ZDesk/card/mater/updateCard.action"
              this.$http.get(url2, { params: params2 })
                  .then(res => {
                      //更新subscribers初始值
//                      let oldSubscribers = this.subscribers
                      this.subscribers = newSubscribers
                      this.getinsertNew()
//                       insertActivity请求
                      let arr = newSubscribers.trim().split(' ')
                      let arr2 = arr.filter((item, index) => {
                          return item !== this.cardUrl
                      })
                          let str = ''
                          for (let i=0;i<arr2.length;i++) {
                              for (let j=0;j<this.buildFileUrl.length;j++) {
                                  if (this.buildFileUrl[j].cardUrl === arr2[i]) {
                                      str += this.buildFileUrl[j].userName + ' '
                                  }
                                  //XX将XXX添加至
                                  if (this.cardUrl === this.buildFileUrl[j].cardUrl ){
                                    let man = this.buildFileUrl[j].userName
                                    this.insertParams.val = `${man}将${str}添加至此任务`
                                  }
                              }
                          }

                          this.insertParams.members = this.cardUrl
                          this.insertParams.subscribers = this.cardUrl
                          this.insertParams.type = 'message'
                          let url3 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                          this.$http.get(url3, { params: this.insertParams})
                              .then(res => {
                                  this.$vux.toast.show({ text: "添加人员成功", type: "success" })
                                  //通知load
                                  let TellDetail = true
                                  this.updadeTaskActivits(res.data.data, TellDetail)
                              })
                              .catch( err => {
                                  this.$vux.toast.text( "添加人员失败")
                              });
                  })
                  .catch(err => {
                      this.$vux.toast.show({text: "updateCard", type: "false"})
                  });
//               addMseReminder请求
//              let params3 = {
//              boardId: this.insertParams.boardId,
//              listId: this.insertParams.listId,
//              cardId: this.insertParams.cardId,
//              cardTitle: this.insertParams.cardTitle,
//              // boardImgCss: zingIcon-zingJob-10
//              val: `你被加入任务`,
//              members: members,
//              routing: this.insertParams.routing
//          }
//          let url3 = "ZingMH/ZDesk/activity/mater/addMseReminder.action"
//          this.$http.get(url3,{ params: params3 })
//          .then(res => {
//
//              this.$vux.toast.show({ text:"addMseReminder成功",type:"success" })
//          })
//          .catch(err => {
//              this.$vux.toast.show({ text:"addMseReminder",type:"false" })
//          });
          },
          //選中負責人
          onPicked2(list) {
              this.showPersonPicker2 = false;
              let newSubscribers = ''

              for (let i = 0; i < list.length; i++) {
                  newSubscribers += list[i].cardUrl + ' '
              }
              let params2 = {
                  cardId: this.insertParams.cardId,
                  stewards: newSubscribers,
                  routing: this.insertParams.routing,
              }
              let url2 = "/ZingMH/ZDesk/card/mater/updateCard.action"
              this.$http.get(url2, {params: params2})
                  .then(res => {
                      //更新stewards初始值
                      this.stewards = newSubscribers
                      this.getinsertNew2()
                      // insertActivity请求
                      let arr = newSubscribers.trim().split(' ')
                      let arr2 = arr.filter((item, index) => {
                          return item !== this.cardUrl
                      })
                      let str = ''
                      for (let i=0;i<arr2.length;i++) {
                          for (let j=0;j<this.buildFileUrl.length;j++) {
                              if (this.buildFileUrl[j].cardUrl === arr2[i]) {
                                  str += this.buildFileUrl[j].userName + ' '
                              }
                            //XX将XXX设置为负责人
                            if (this.cardUrl === this.buildFileUrl[j].cardUrl ){
                              let men = this.buildFileUrl[j].userName
                              this.insertParams.val = `${men}将${str}设置为此任务负责人`
                            }
                          }
                      }
                      this.insertParams.members = this.cardUrl
                      this.insertParams.subscribers = this.cardUrl
//                      this.insertParams.val = `将${str}设置为此任务负责人`
                      this.insertParams.type = 'message'
                      let url3 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      this.$http.get(url3, {params: this.insertParams})
                          .then(res => {
                              this.$vux.toast.show({text: "添加人员成功", type: "success"})
                              //通知load
                              let TellDetail = true
                              this.updadeTaskActivits(res.data.data, TellDetail)
                          })
                          .catch(err => {
                              this.$vux.toast.show({text: "添加人员失败", type: "false"})
                          });
                  })
                  .catch(err => {
                      this.$vux.toast.show({text: "updateCard", type: "false"})
                  });
          },
          onPickAbort() {
              this.showPersonPicker = false
          },
          onPickAbort2() {
              this.showPersonPicker2 = false
          },
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../../assets/stylus/variable.styl"
    @import "../../../assets/stylus/mixin.styl"
        .chengWrap,.fuzeWrap
           display flex
           margin-right 10px
           border-top 1px solid #f5f5f5
           .chengImg,.fuzeImg
              display flex
              width 100%
              .chengImg2,.fuzeImg2
                  height 53px
                  line-height 53px
              .chengText,.fuzeText
                  font-size 14px
                  margin-right 20px
              .chengText
                   max-width 55px
              .fuzeText
                   margin-right 8px
                   max-width 75px
                   min-width: 60px
              .chengAvatar
                  flex 6
              .fuzeAvatar
                  flex 11
                  margin-left -5px
              .fuclass
                  writing-mode lr
              .iconfont
                 margin-right 10px
                 .tag-group
                    text-align left
</style>
