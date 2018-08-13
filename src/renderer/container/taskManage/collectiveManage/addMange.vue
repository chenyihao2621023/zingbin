<template>
    <div class="addManageWrap">
        <zing-head :isShowQuery="false" :title="headTitle">
            <div slot="left"></div>
        </zing-head>
        <div class="contentWrap">
            <div class="content">
                   <Scroll ref="scroll" :scrollbar="true">
                               <GridCard>
                                    <x-input title="名称<span style='color:red;display: -webkit-inline-box'>*</span>" v-model="taskName" type="text" placeholder="请输入任务集名称" style="font-size: 16px;border-bottom:1px solid #eaeefb"></x-input>
                               </GridCard>
                               <div class="commonPart jiaChengyuan">
                                    <div class="commonPartLeft chenLeft">
                                        <span>成员<span style="color: red">*</span></span>
                                    </div>
                                    <div class="commonPartRight chenRight" :class="{chengHrightClass:chengHright}">
                                        <div class="chengyuan" v-for="(cyr,index) in insertNew" :key="index" v-if="cyr.value" @click="cyrXQ(index)">
                                            <avatar v-if="cyr.headImg" :size="'default'" shape="square" :src="getImageUrl(cyr.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin:5px"></avatar>
                                            <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin:5px"></avatar>
                                        </div>
                                    </div>
                                    <div class="commonPartJiahao chengJiahao" :class="{chengHclass:chengH}">
                                        <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectInputPerson()"></i>
                                    </div>
                               </div>
                               <div class="commonPart jiafuzeren">
                                   <div class="commonPartLeft fuzeLfet">
                                       <span >负责人<span style="color: red">*</span></span>
                                   </div>
                                   <div class="commonPartRight fuzeRight" :class="{chengHrightClass:chengHright}">
                                       <div class="iconSize" v-for="(fuze,index) in insertNew2" :key="index" v-if="fuze.value" @click="fuzeXQ(index)">
                                            <avatar v-if="fuze.headImg" :size="'default'" shape="square" :src="getImageUrl(fuze.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin: 3px"></avatar>
                                            <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin:3px;"></avatar>
                                       </div>
                                   </div>
                                   <div class="commonPartJiahao fuzejiahao" :class="{chengHclass:fuzeH}">
                                       <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectInputPerson2()"></i>
                                   </div>
                               </div>
                               <!--分类-->
                               <div class="commonPart selectClass">
                                  <div class="commonPartLeft selectClassLfet">
                                      <span>选择分类</span>
                                  </div>
                                  <div class="commonPartRight2 selectClassRight">
                                      <span class="selectClassSpan">
                                          <p v-if="this.privateWorkType && this.privateWorkType !=='undefined'" style="margin: 5px 0">个人分类:{{privateWorkType}}</p>
                                          <p v-if="this.superWorkType" style="margin: 5px 0">全体分类:{{superWorkType}}</p>
                                      </span>
                                  </div>
                                   <div class="commonPartJiahao selectjiahao">
                                       <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectClass()"></i>
                                   </div>
                               </div>
                                <!--类型-->
                               <div class="commonPart typeClass">
                                   <div class="commonPartLeft typeClassLfet">
                                       <span>选择类型</span>
                                   </div>
                                   <div class="commonPartRight2 typeClassRight">
                                       <span>{{tasktypeTag}}</span>
                                   </div>
                                   <div class="commonPartJiahao typetjiahao">
                                       <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectType()"></i>
                                   </div>
                               </div>
                               <!--模板-->
                               <div class="commonPart mouldClass">
                                   <div class="commonPartLeft mouldClassLfet">
                                       <span>选择模板</span>
                                   </div>
                                 <cell v-model="showChoseMould">

                                 </cell>
                                   <div class="commonPartRight2 mouldClassRight" v-model="showChoseMould" >
                                       <span>{{mouldTag}}</span>
                                   </div>
                                   <div class="commonPartJiahao mouldClassjiahao">
                                       <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectMould()"></i>
                                   </div>
                               </div>
                               <!--任务集图标-->
                               <div class="commonPart taskIcon">
                                   <div class="commonPartLeft taskIconLfet">
                                       <span>选择图标</span>
                                   </div>
                                   <div class="commonPartRight taskIconRight"></div>
                                   <div class="commonPartJiahao taskIconjiahao" v-model="taskIcon">
                                       <span class="taskIconWrap">
                                          <i :class="['iconfont', `icon-${taskIcon}`]" @click="selectIocn()" :style="{ 'background-color': taskIconBgColor}"></i>
                                      </span>
                                   </div>
                               </div>
                              <!--添加到模板-->
                               <div class="commonPart addTaskMould">
                                   <div class="commonPartLeft addTaskMouldLfet">
                                       <span>将此任务集添加到模板</span>
                                   </div>
                                   <div class="commonPartRight addTaskMouldRight"></div>
                                   <div class="commonPartJiahao addTaskMouldjiahao">
                                       <span @click.native="selectMouldThis()" placeholder="">
                                         <check-icon :value.sync="checked" type="plain"></check-icon>
                                       </span>
                                   </div>
                               </div>
                    </Scroll>
                   <!-- 成员选人组件 -->
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
                  <!--成员详情-->
                  <org-member-detail
                      :memberCardUrl="orgMemberCardUrl"
                      :showDetail="showOrgMemberDetail"
                      :ownCardUrl="this.cardUrl"
                      :companyId = "this.companyId"
                      @hideDetail="hideOrgMemberDetail"
                  ></org-member-detail>
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
                  <!--负责人详情-->
                  <org-member-detail
                      :memberCardUrl="orgMemberCardUrl2"
                      :showDetail="showOrgMemberDetail2"
                      :ownCardUrl="this.cardUrl"
                      :companyId = "this.companyId"
                      @hideDetail="hideOrgMemberDetail2"
                  ></org-member-detail>
                  <!-- 选择图标组件 -->
                  <iconPicker
                      :icon-picker-show="dialogIcon"
                      :iconData="['xiaoshougendanguanli', 'benbanzushengchandingdanguanli', 'renzhengziliao','fabubiaoshu',
                      'baocun-tianchong', 'renwu','caiwu','cardb','jiudian','shangpu','shichang','canting','baobiao-selected',
                      'weibiaoti4','caigou-tianchong','tuihuo']"
                      :bg-color="'#40AFFC'"
                      :mask-z-index="300"
                      :dialog-z-index="5000"
                      @cancel="iconPickerCancel" @close="iconPickerClose" @confirm="iconPickerConfirm"/>
                   <!--选择分类组件-->
                   <classSelection
                        :showPicker="showClassSetter"
                        :title1="title1"
                        :title2="title2"
                        :tagType1="tagType1"
                        :tagType2="tagType2"
                        @abort="classAbort"
                        @checkSelected="checkSelected"
                    >
                    </classSelection>
                   <!--类型组件-->
                   <choseType
                       :selectedItem="showChoseType"
                       :showType="showTypePopup"
                       @checkSelectedType="checkSelectedType"
                       @abort="typeAbort"
                    >
                    </choseType>
                   <!--模板组件-->
                   <choseMould
                      :selectedItem="showchoseMould"
                      :showMould="showMouldPopup"
                      @checkSelectedMould="checkSelectedMould"
                      @abort="mouldAbort"
                    >
                    </choseMould>
            </div>
            <div class="bottomWrap">
                <div>
                    <x-button class="subject-picker-button" type="primary" @click.native="addOrEdit()">提交</x-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
  Cell,
  ConfirmPlugin,
  CheckIcon,
  XTextarea,
  XInput,
  Group,
  XButton,
  Selector,
  XHeader,
} from "vux";
import iconPicker from "../../../components/iconpicker/IconPicker";
import ZingHead from "@/components/zingHead/ZingHead";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import classSelection from "../../common/classSelection/classSelection";
import choseType from "../collectiveManage/choseType";
import choseMould from "../collectiveManage/choseMould";
import TagGroup from "components/taggroup/TagGroup";
import Scroll from "@/components/scroll/Scroll";
import _ from "lodash";
import avatar from "@/components/avatar/Avatar";
import OrgMemberDetail from "@/components/orgmemberpicker/OrgMemberDetail"
import { getImageUrl } from "../../../utils/fn"
import GridCard from "@/components/gridcard/GridCard";

export default {
  components: {
    TagGroup,
    Cell,
    OrgMemberPicker,
    ZingHead,
    iconPicker,
    ConfirmPlugin,
    CheckIcon,
    XTextarea,
    Group,
    XInput,
    Selector,
    XHeader,
    XButton,
    classSelection,
    choseType,
    choseMould,
    Scroll,
    avatar,
    OrgMemberDetail
  },
  data() {
    return {
      headTitle: "", //标题
      taskName: "", //任务集名称
      privateWorkType: "", //个人分类
      superWorkType: "",   //全体分类
      showChoseType:[],//类型组件对勾回显
      showchoseMould:[],//模板回显对勾组件 ，暂无接口
      tasktypeTag:'',// 类型展示
      mouldTag:'',//模板展示
      placeholder: "", //提示
      dialogIcon:false, //图标选择组件
      checked:false,//设为模板
      screenHeight: "0px",
      bgColor: "",//图标组件背景
      taskIconBgColor: "#40AFFC",
      taskIcon: "tianjia1",
      showClassSetter: false, //分类组件显示
      title1: "个人分类",
      title2: "全体分类",
      tagType1: "work",
      tagType2: "superWork",
      showTypePopup:false,//是否显示类型
      showMouldPopup:false,//是否显示模板
        //选人组建成员 参数
        buildFileUrl:[],//档案同事信息
        FriendNumListes:[],//好友信息
        insertNew: [],//成员初始显示
        subscribers: '', //初始選中人員
        subscribersRange: "", //初始人員範圍
        showPersonPicker: false, //是否显示选人组件
        multipleForSelPerson: true, //人员是否多选
        showTab: ["colleague","friends"],//自定義顯示選人tab
        subscribersTransform: '',
        chengH:false, //成员动态高度
        chengHright:false,//成员图片高度
        //选人组建负责人 参数
        insertNew2: [],//负责人初始值
        stewards: '', //初始選中負責人
        showPersonPicker2: false,//是否显示选人组件
        multipleForSelPerson2: true,//人员是否多选
        showTab2: ['designatedPersonnel'],
        fuzeH:false,//负责人动态高度
        classH:false,
    }
  },
  computed: {
    cardUrl() {
      return this.$store.state.ui.userInfo.cardUrl;
    },
    realName() {
      return this.$store.state.ui.userInfo.RealName;
    },
    companyId() {
      return this.$store.state.ui.userInfo.companyId;
    },
      //负责人范围
      designatedCardUrls2() {
          let arr = []
          if (this.subscribers) {
              arr = this.subscribers.trim().split(' ')
          }
          return arr
      },
  },
  mounted() {
    this.boardId = this.$route.query.boardId
    this.routing = this.$route.query.routing
    this.getPersonnelFile()   //同事
    this.getFriendNumListES() //好友
  },
  beforeDestroy() {
      clearTimeout(this.addSet)
  },
  methods: {
      getImageUrl,
      //获取服务号下所有建档信息
      getPersonnelFile() {
          let url = "/zingbiz/auth/user/getHrUserMapByCardUrlList";
          this.$http.get(url)
              .then(res => {
                  let buildFileUrls = res.data.data //对象
                  let values = [];
                  Object.keys(buildFileUrls).forEach((key)=>{
                      values.push(buildFileUrls[key]);
                  })
                  this.buildFileUrl = values

                  this._beforAddEdit();
              })
      },
      //朋友啊朋友
      getFriendNumListES() {
        let url = '/zingbiz/auth/user/serviceFriend/getFriendNumListES?zIsCacheDirect=true&DirectCacheKey=get_friend_num_list_es_param';
        let params = {
          companyId: false,
          type: '',
          tagName: '',
          pageNumber: 1,
          pageSize: 2000
        };
        this.$http.post(url,params)
          .then(res => {
              this.FriendNumListes = res.data.data.data   //数组
          })
      },
      //初始页面
      _beforAddEdit() {
          if (this.boardId) {
                //编辑
                this.headTitle = "编辑任务集";
                this._getloadBoardEsById();
                this.classH = true
          } else {
                //增加
                this.headTitle = "新建任务集";
                this.showClass = true;
          }
    },
      //编辑任务集获取数据
      _getloadBoardEsById() {
              let that = this;
              let url = "/ZingMH/ZDesk/board/mater/loadBoardEsById.action";
              let params = {
                    boardId: that.boardId,
                    routing: that.companyId
              };
              that.$http
                .get(url, { params: params })
                .then(res => {
                      if (res.data.data) {
                          this.taskName = res.data.data.data[0].title
                          if (res.data.data.data[0].workType && res.data.data.data[0].workType.substring(0, 16) !== "zingIcon-zingJob") {
                              this.taskIcon = res.data.data.data[0].workType         //图标
                          } else {
                              this.taskIcon = "xiaoshougendanguanli"
                          }
                          this.boardProperty = res.data.data.data[0].boardProperty   //类型
                          this.tasktypeTag = this.boardProperty  //类型展示
                          this.showChoseType.push(res.data.data.data[0])//类型组件对勾回显
                          this.subscribers = res.data.data.data[0].subscribers; //人员
                          this.superWorkType = res.data.data.data[0].superWorkType                    //全体分类
                          if (res.data.data.data[0].privateWorkType){
                              this.privateWorkType = res.data.data.data[0].privateWorkType.split("&&")[1]  //个人分类
                          }
                          this.getinsertNew()
                          // this.stewards = res.data.data.data[0].stewards  //负责人 暂时没有接口
                          //this.getinsertNew2()
                        }
                })
                .catch(err => {
                  console.log(err);
                });
       },
      //去重方法
      arrayUnique (arr) {
          let newArr = []
          if (arr) {
              for (let i = 0; i < arr.length; i++) {
                  if (newArr.indexOf(arr[i]) === (-1)) {
                      newArr.push(arr[i])
                  }
              }
              return newArr
          }
      },
      //人员初值始显示
      getinsertNew() {
          //人员初始页面赋值
          let arr = this.subscribers.trim().split(' ')  //这里包含同事和好友
          let arr2 = this.arrayUnique (arr)
          //清空上次
          this.insertNew = []
          if (arr2) {
               this.chengH = true
               this.chengHright = true
               this.arrUrl(arr,this.buildFileUrl,this.FriendNumListes)
          }
      },
          arrUrl(arr1,arr2,arr3) {
              this.insertNew = []
              let arr = [...arr2,...arr3];
              let hash = {};
              arr = arr.reduce(function(item, next) {
                hash [next.cardUrl] ? '' : hash[next.cardUrl] = true && item.push(next);
                return item
              }, [])
              arr.map((item) => {
                if (arr1.includes(item.cardUrl)) this.insertNew.push({
                     value: item.cardUrl,
                     type: "user",
                     headImg:item.headimgurl?item.headimgurl:item.headImg
                })
              });
              console.log(this.insertNew);
      },
      //成员详情
      cyrXQ(index){
          let cardUrl =  this.insertNew[index].value
          this.orgMemberCardUrl = cardUrl
          this.showOrgMemberDetail = true
      },
      hideOrgMemberDetail(){
          this.showOrgMemberDetail = false
      },
      //负责人详情
      fuzeXQ(index){
          let cardUrl =  this.insertNew2[index].value
          this.orgMemberCardUrl2 = cardUrl
          this.showOrgMemberDetail2 = true
      },
      hideOrgMemberDetail2(){
          this.showOrgMemberDetail2 = false
      },
      //负责人初始显示  暂无接口
      getinsertNew2 () {
//          //清空上次
          this.insertNew2 = []
//          if (this.stewards) {
//              let arr = this.stewards.trim().split(' ') || []
//              if (arr) {
//                  for (let i = 0; i < arr.length; i++) {
//                      //添加,headImg属性
//                      this.buildFileUrl.forEach((item, index) => {
//                          let buildFileUrl = item
//                          if (arr[i] && arr[i] === buildFileUrl.cardUrl) {
//                              this.insertNew2.push({
//                                  value: arr[i],
//                                  type: "user",
//                                  headImg:buildFileUrl.headImg
//                              })
//                          }
//                      })
//                  }
//              }
//          }
      },
      //添加人员方法
      selectInputPerson(data) {
          this.showPersonPicker = true;
      },
      selectInputPerson2(){
          this.showPersonPicker2 = true
      },
      onPicked(list) {
          this.showPersonPicker = false;
          let newSubscribers = "";
          if (list){
              for (let i = 0; i < list.length; i++) {
                  newSubscribers += list[i].cardUrl + " ";
              }
          }
          this.chengH = true
          this.chengHright = true
          this.$http
              .get("/ZingMH/ZDesk/board/mater/updateMember.action", {
                  params: {
                      boardId: this.boardId,
                      subscribers: newSubscribers,
                      oldSubscribers: this.subscribers,
                      routing: this.routing
                  }
              })
              .then(res => {
                  //更新newSubscribers
                  this.subscribers = newSubscribers;
                  this.getinsertNew()
                  this.fuzeH = true
                  this.$nextTick(() => {
                      this.$refs.scroll.refresh()
                  })
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onPicked2(list) {
          this.fuzeH = true
          this.chengHright = true
          this.showPersonPicker2 = false;
          this.insertNew2 =[]
              for (let i = 0; i < list.length; i++) {
                  //添加,headImg属性
                  this.buildFileUrl.forEach((item, index) => {
                      let buildFileUrl = item
                      if (list[i].cardUrl && list[i].cardUrl === buildFileUrl.cardUrl) {
                          this.insertNew2.push({
                              value: list[i],
                              type: "user",
                              headImg:buildFileUrl.headImg
                          })
                      }
                  })

              }
//          this.$http
//              .get("/ZingMH/ZDesk/board/mater/updateMember.action", {
//                  params: {
//                      boardId: this.boardId,
//                      subscribers: newSubscribers,
//                      oldSubscribers: this.subscribers,
//                      routing: this.routing
//                  }
//              })
//              .then(res => {
//                  //更新stewards
//                  this.stewards = newSubscribers;
//                  this.getinsertNew2()
//                  //高度
//                  this.fuzeH = true
//
//                  this.$nextTick(() => {
//                      this.$refs.scroll.refresh()
//                  })
//              })
//              .catch(err => {
//                  console.log(err);
//              })
      },
      onPickAbort() {
          this.showPersonPicker = false;
      },
      onPickAbort2() {
          this.showPersonPicker2 = false;
      },
      //提交
      addOrEdit() {
      let self = this;
      let url = "";
      if (this.boardId) {
        //编辑任务集
        url = "/ZingMH/ZDesk/board/mater/updataEsBoard.action";
        let params = {
          boardId: self.boardId,
          routing: self.companyId,
          title: self.taskName,
          workType: self.taskIcon,
          property: "nostar"
          //          memberSelect: self.selectedMember.join(" "),
        };
        self.$http
          .get(url, { params: params })
          .then(res => {
              this.addSet = setTimeout(function () {
                  self.$router.back(-1);
              },2500)
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //新建任务集
        url = "/ZingMH/ZDesk/board/mater/insertBoard.action";
        let params = {
          title: self.taskName,
          templateIcon: self.taskIcon,
          companyId: self.companyId,
          subscribers: self.subscribers + " " + this.$store.state.ui.userInfo.cardUrl,//新建时候默认加上创建者
          backgroundColor: "darkBlue",
          privateWorkType: self.cardUrl + "&&" + self.privateWorkType, //个人分类
          superWorkType: self.superWorkType,                           //全体分类
          inputClassify:"全体分类:" + self.superWorkType + "个人分类:" + self.privateWorkType,
          // memberSelect:self.subscribers,
          tag: "trello",
          boardProperty:self.tasktypeTag ,//类型
        };
        if (self.taskName === "") {
          self.$vux.toast.text("请输入任务集名称");
          return;
        }
        if (self.subscribers === "") {
           self.$vux.toast.text("请选择成员");
            return;
        }
        self.$http
          .get(url, { params: params })
          .then(res => {
              self.$router.push({
                  name: "taskList",
                  query: {
                      boardId:res.data.data.boardId
                  }
              });
          })
          .catch(err => {
              console.log(err);
          });
      }
    },
    //分类
    selectClass() {
      this.showClassSetter = true;
    },
    checkSelected(selected) {
      this.showClassSetter = false;
      this.privateWorkType = selected.privateWorkType;  //个人分类
      this.superWorkType = selected.superWorkType;   //全体分类
    },
    classAbort() {
      this.showClassSetter = false;
    },
     //类型
    selectType() {
      this.showTypePopup = true
    },
    checkSelectedType(value) {
          this.showTypePopup = false
          this.showChoseType = []
          this.tasktypeTag = ''
          _.each(value,valueName => {
                 this.showChoseType.push(valueName.label)
                 this.tasktypeTag += valueName.label + ' '
          })
     },
    typeAbort() {
        this.showTypePopup = false
    },
    //模版
    selectMould() {
      this.showMouldPopup = true
    },
    checkSelectedMould(value) {
      this.showMouldPopup = false
      this.showChoseMould = []
      _.each(value,valueName => {
        this.showChoseMould.push(valueName.label)
        this.mouldTag += valueName.label + ' '
      })
    },
    mouldAbort() {
       this.showMouldPopup = false
    },
      selectMouldThis() {

      },
    //图标
    selectIocn() {
      this.dialogIcon = true;
    },
    iconPickerConfirm(data) {

      this.dialogIcon = false;
      this.taskIcon = data;
    },
    iconPickerClose() {
      this.dialogIcon = false;
    },
    iconPickerCancel() {
      this.dialogIcon = false;
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';
   .addManageWrap
       height 100%
       .contentWrap
           height calc(100% - 48px)
           .content
               width 100%
               height calc(100% - 48px)
               align-self flex-start
               .taskIcon
                   height 54px !important
               .addTaskMould
                   height 34px !important
               .commonPart
                   display:-webkit-box;
                   display: -moz-box;
                   display: -ms-flexbox;
                   display: -webkit-flex;
                   display: flex;
                   padding 0 13px
                   border-bottom: 1px solid #eaeefb
                   font-size 16px
                   .commonPartLeft,.commonPartRight2,.commonPartJiahao
                       display flex;
                       display:-webkit-box;
                       display: -moz-box;
                       display: -ms-flexbox;
                       display: -webkit-flex;
                       justify-content center
                       align-items center
                       margin-bottom 3px
                       margin-top 3px
                   .chenRight
                       margin-left 15px
                   .commonPartRight
                       flex 4
                   .commonPartRight2
                       flex 4
                       justify-content: flex-end
                       margin-right: 10px
                       .selectClassSpan
                           text-align left
                   .selectClassRight,.typeClassRight,.mouldClassRight
                       text-align center
                   .chengHrightClass
                       margin-bottom 0
                   .chengHclass
                       margin-top 6px !important
                   .commonPartJiahao
                      i
                       font-size 30px
                       color #736e6e85
                   .taskIconWrap
                      .iconfont
                         font-size 30px !important
                         border-radius 4px
                         padding 10px
                         color white
                         background-color #999999
</style>
