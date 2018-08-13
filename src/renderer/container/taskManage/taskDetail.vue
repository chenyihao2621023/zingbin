<!--任务详情-->
<template>
    <div class="detailWrap" id ='detailWrapId'>
            <!--头部-->
        <zing-head title="" :isComeBack="false" @doSome="backList" v-if="showTaskDetailHead">
            <div slot="header-right">
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                           <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </zing-head>
        <div class="detailScrollWrap" id="detailScrollWrapb" @click="freshBottom">
            <Scroll :scrollbar="true"
                    ref="scrollContent"
                    :scrollEnd="scrollEnd"
                    :computeScroll="computeScrollInner"
                    @scroll="onScroll">
                <div class="modalWrap">
                    <!--内容区-->
                    <el-collapse v-model="activeNames" @change="handleChange" accordion>
                        <el-collapse-item title="任务标题" name="1" v-if="showTaskDetail">
                            <div class="cardTitle" id="content" :class="{'titleThrough':isSolved}" @click="changeCardTitle" >
                                {{cardTitle}}
                            </div>
                        </el-collapse-item>
                        <split v-if="showTaskDetail"></split>
                        <el-collapse-item title="成员" name="2" v-if="showTaskDetail">
                            <template slot="title">
                               <span style="margin-right: 25px;font-size: 16px">负责人</span>
                               <div style="display: inline-block;margin-left: -40px">
                                  <span class="avatarWrap" v-for="(fuze,index) in leaderTwo" :key="index">
                                         <avatar v-if="fuze.headImg" class="avatarWrap2" :size="'default'" shape="square" :src="getImageUrl(fuze.headImg,'./static/images/userDef_.jpg')" style=" margin:0 5px"></avatar>
                                         <avatar v-else :size="'default'" shape="square" src="../../assets/img/userDef_.jpg" style=" float: left;margin:0 5px"></avatar>
                                  </span>
                               </div>
                            </template>
                            <template v-if="(getboardid !== '')||(transCardId !== undefined)">
                                <!--成员和负责人-->
                                <detailMember
                                    :insertParams="insertParams"
                                    :updadeTaskActivits ="updadeTaskActivits"
                                    :getLeaders="getLeaders"
                                    :getMembers="getMembers"
                                    :subtaskFuzerenRange="subtaskFuzerenRange"
                                    :getTaskMembers="getTaskMembers"

                                    @chengyuanXQ="chengyuanXQ"
                                    @fuzerenXQ="fuzerenXQ"
                                    :buildFileUrl="buildFileUrl"
                                />
                            </template>
                        </el-collapse-item>
                        <split v-if="showTaskDetail"></split>
                        <el-collapse-item title="子任务配置项" name="3" v-if="showTaskDetail">
                            <template v-if="getboardid !== '' || transCardId !== undefined">
                                <!--子任务配置-->
                                <detailSubtask :insertParams="insertParams"
                                               :updadeTaskActivits ="updadeTaskActivits"

                                                ref="subtaskChild"
                                               :cardListId = "cardListId"
                                               :fuzerenRangearr="fuzerenRangearr"
                                               :tasklists="tasklists"
                                               :buildFileUrl ="buildFileUrl"

                                               :taskLeaderValue="taskLeaderValue"

                                               @changemarker="changemarker"
                                               @changeTransfer="changeTransfer"
                                                ></detailSubtask>
                            </template>
                        </el-collapse-item>
                        <split v-if="showTaskDetail && attachmentNum"></split>
                        <el-collapse-item title="附件" name="4" v-show="attachmentNum">
                            <template slot="title">
                                <span style="margin-right: 25px">附件&nbsp;&nbsp;({{attachmentNum}})</span>
                            </template>
                            <template v-if="getboardid !== '' || transCardId !== undefined">
                                <detiailAttachment
                                    :firterAttachment="firterAttachment"
                                    :Filedata ="Filedata"
                                    :insertParams="insertParams"
                                    :updadeTaskActivits ="updadeTaskActivits"
                                    :attachShow = "attachShow"
                                    ref="File"
                                />
                            </template>
                        </el-collapse-item>
                        <split v-if="attachmentNum"></split>
                        <el-collapse-item title="图片" name="5" v-show="picNum">
                            <template slot="title">
                                  <span style="margin-right: 25px">图片&nbsp;&nbsp;({{picNum}})</span>
                            </template>
                            <template v-if="getboardid !== '' || transCardId !== undefined">
                                <detailPicture :fiterPicture="fiterPicture"
                                               :PCdata ="PCdata"
                                               :insertParams="insertParams"
                                               :updadeTaskActivits ="updadeTaskActivits"
                                               :show = "show"
                                                ref="Picture"
                                />
                            </template>
                        </el-collapse-item>
                        <split v-if="showTaskDetail"></split>
                        <!--暂时注掉，等待对接-->
                        <!--<el-collapse-item title="凭证" name="6" v-if="showTaskDetail">-->
                            <!--<div>-->
                                <!--<detailCredence/>-->
                            <!--</div>-->
                        <!--</el-collapse-item>-->
                      <!--  <split v-if="showTaskDetail"></split>-->
                        <el-collapse-item title="标签" name="7" v-if="showTaskDetail" v-show="tagsNum" style="position: relative">
                            <template slot="title">
                                <span>标签&nbsp;&nbsp;({{tagsNum}})</span>
                                <!--显示两个标签-->
                                <div class="detailTags" style="position: absolute;top: 0;right: 0;width: 80%">
                                   <span v-for="(labletag,index) in lableTwo" :key="index">
                                     <span :style="'background-color:' + labletag.tagIndex" class="lableSpanTwo">{{labletag.content}}</span>
                                   </span>
                                </div>
                            </template>
                            <div class="lableSpanWrap">
                                    <template v-for="(tag,index) in tags">
                                        <span :style="'background-color:' + tag.tagIndex" class="lableSpan">{{tag.content}}</span>
                                    </template>
                            </div>
                        </el-collapse-item>
                        <split v-if="showTaskDetail && tagsNum"></split>
                        <cell class="ActivityCell">
                            <div class="ActivityCell2" v-if="showTaskDetail">
                                <span>活动</span>
                                <div class="ActivityR">
                                    <span>免打扰</span>
                                    <el-switch
                                        v-model="isRemind"
                                        @click.native="changeStatus"
                                        active-color="#ff8000"
                                        inactive-color="#A9A9A9"
                                        disabled>
                                    </el-switch>
                                </div>
                            </div>
                        </cell>
                        <split></split>
                            <div >
                                <!--活动详情组件-->
                                <taskActivity
                                    :editTaskComment="editTaskComment"
                                    :taskActivits="taskActivits"
                                    :updadeTaskActivits ="updadeTaskActivits"
                                    @scrollRefresh="scrollRefresh"
                                    :activityShow = "activityShow"
                                />
                            </div>
                    </el-collapse>
                </div>
            </Scroll>
        </div>
        <!--底部文本输入-->
        <template v-if="getboardid !== '' || transCardId !== undefined || showTaskDetail" class="chatBottomClass">
            <detailChatBottom @clickEmoji="clickEmoji"
                              @clickboard="clickboard"
                              @clickMore="clickMore"
                              @textareaFoucus="textareaFoucus"

                              :insertParams="insertParams"
                              :loadParams="loadParams"
                              :updadeTaskActivits ="updadeTaskActivits"
                              @bottomPicture = "bottomPicture"
                              @bottomfile = "bottomfile"

                              :activitieId="activitieId"
                              :activitieVal="activitieVal"
                              :activitieRouting="activitieRouting"

                              :tags="tags"
                              :updatetags ="updatetags"

                              :members="members"
                              :subscribers="subscribers"
                              :taskLeaderValue="taskLeaderValue"

                              @scrollRefresh="scrollRefresh"
                              @changeSroll="changeSroll"

                              @showRelation ="showRelation"

                              :DetailWrapH = "DetailWrapH"
                              :clickEmojiOrClickMore ="clickEmojiOrClickMore"
            />
        </template>
        <!--移动任务弹出框-->
        <div v-transfer-dom class="moveWrap">
            <x-dialog v-model="showLabel" class="dialog-demo" :mask-transition="maskTransition">
                <div @click="showLabel=false" class="moveText">
                    <div class="vux-close">移动任务</div>
                    <div class="vux-close1">X</div>
                </div>
                <div style="padding:15px;" class="moveTab">
                    <flexbox>
                        <flexbox-item><x-button @click.native="doShowToast1(true)">置顶</x-button></flexbox-item>
                        <flexbox-item><x-button @click.native="doShowToast1(false)">置底</x-button></flexbox-item>
                    </flexbox>
                    <flexbox>
                        <flexbox-item><x-button @click.native="doShowToast2(true)">上移</x-button></flexbox-item>
                        <flexbox-item><x-button @click.native="doShowToast2(false)">下移</x-button></flexbox-item>
                    </flexbox>
                </div>
            </x-dialog>
        </div>
        <!--编辑任务标题-->
        <div v-transfer-dom class="cardTitleWrap">
            <x-dialog v-model="showCardTitle" :mask-transition="maskTransition">
                <div class="CardTitleText">
                    <div class="vux-close">标题</div>
                </div>
                <!--可编辑,任务负责人-->
                <div>
                    <div class="CardTitleTextarea">
                        <textarea autoheight="true" v-model="changeTiltle"></textarea>
                    </div>
                    <div class="CardTitleBottom">
                        <div class="cancelCardTitle" @click.stop="EditCardTitleBtn(false)">取消</div>
                        <div class="editCardTitle" @click.stop="EditCardTitleBtn(true,changeTiltle)">保存</div>
                    </div>
                </div>
            </x-dialog>

        </div>
        <!--subdetail里程碑-->
        <div v-transfer-dom class="markerWrap">
           <x-dialog v-model="showMarker" :mask-transition="maskTransition">
               <!--可编辑,任务负责人-->
               <div v-if="this.taskLeaderValue.indexOf(this.cardUrl) !== (-1)">
                 <div class="markerText">
                   <div class="vux-close" style="font-size:16px;margin-top: 15px">里程碑</div>
                 </div>
                   <div class="markerTextarea2">
                       <textarea autoheight="true" v-model="markertext"></textarea>
                   </div>
                   <div class="markerBottom2">
                       <div class="cancelNew" @click.stop="EditBtn(false)">取消</div>
                       <div class="addNew" @click.stop="EditBtn(true,true,markertext)">保存</div>
                   </div>
               </div>
               <!--可查看-->
               <div v-else>
                   <div class="markerTextarea" :class="{changemarkerH:changemarkerH}" v-if="markertext">{{markertext}}</div>
                   <div v-else style="margin:15px 0;font-size: 16px">还未设置里程碑</div>
                   <div class="markerBottom">
                       <span @click="showMarker=false" class="vux-close-marker">关闭</span>
                   </div>
               </div>
           </x-dialog>
        </div>
        <!--放大图片-->
        <previewer :list="list"  ref="previewer" ></previewer>
        <!--放大附件图片-->
        <previewer :list="listAttach"  ref="previewerAttach" ></previewer>
        <!--放大活动中图片-->
        <previewer :list="listActivity"  ref="previewerActivity" ></previewer>
        <!--转交遮罩-->
        <div v-transfer-dom class="TransferWrap">
            <x-dialog class="xDialog" v-model="showTransfer" hide-on-blur :mask-transition="maskTransition">
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
        <!--旧版关联任务弹出框-->
        <div v-transfer-dom class="relationTask">
            <x-dialog v-model="showRelationTask" :mask-transition="maskTransition">
                <div class="relation-select-scroll">
                    <div class="relation-select-title">
                        <div class="vux-close">添加任务</div>
                        <span @click="showRelationTask = false" class="closeRelation">X</span>
                    </div>
                    <div class="relation-select-content">
                        <input v-model="relationInput" @input="onFocus"/>
                        <ul class="relation-selectUl">
                            <li class="relation-selectLi" v-for="item in relationContents" @click="choseRelation(item.cardId,item._routing,item.boardId,item.cardTitle)">
                                <p v-html="item.cardTitle"></p>
                                <p v-html="item.boardTitle"></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </x-dialog>
        </div>
        <!--成员用户详情-->
        <org-member-detail
            :memberCardUrl="orgMemberCardUrl"
            :showDetail="showOrgMemberDetail"
            :ownCardUrl ="this.cardUrl"
            @hideDetail="hideOrgMemberDetail"
        ></org-member-detail>
        <!--负责人用户详情-->
        <org-member-detail
            :memberCardUrl="orgMemberCardUrl2"
            :showDetail="showOrgMemberDetail2"
            :ownCardUrl ="this.cardUrl"
            @hideDetail="hideOrgMemberDetail2"
        ></org-member-detail>
    </div>
  </template>
  <script>

  import { Group,XDialog,Selector,Confirm,Checker, CheckerItem ,XButton,Flexbox, FlexboxItem ,XSwitch,Previewer } from 'vux'
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
  import OrgMemberDetail from "@/components/orgmemberpicker/OrgMemberDetail"
  import { getImageUrl } from "../../utils/fn"

  export default{
      components:{
          ZingHead,Group,taskActivity,
          Scroll,detailSubtask,detailMember,
          XDialog,Selector,Dropdown,split,
          detailPicture,detiailAttachment,
          detailCredence,XSwitch,
          detailChatBottom,
          Confirm,Checker,CheckerItem,
          XButton,Flexbox, FlexboxItem,avatar,
          OrgMemberDetail,Previewer,
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
          //暂时不用
          scrollContentHeight:{
              type:String,
              default: function() {
                  return "0";
              }
          },
          //引用部分detail组件
          clickEmojiOrClickMore:{
              type: Boolean,
              default: function() {
                  return false;
              }
          },
          style:{
              type:String,
              default: function() {
                  return "0";
              }
          },
      },
      data() {
        return {
          list: [],//放大图片
          listAttach:[],//放大附件图片
          listActivity:[],//放大活动图片
          //xinjia
            scrollEnd: true,
            computeScrollInner: false,

            datas:[],
            cardListId:'',//cardListId
            tasklists:[],//loadLists请求
            isSolved:false,//任务结束,将isSolved变为true；任务激活,将isSolved变为false；
            isRemind:false, //消息免打扰
            notDisturb:'',//免打扰
            showMarker:false,//里程碑
            markertext:'',//编辑里程碑
            changemarkerH:false,//里程碑动态高度
            isClickEdit:true,//里程碑编辑与保存
            subtasklist:{},//里程碑子组件中的数据
            showTransfer: false,//转交弹框
            objlabel:'',
            titleThrouClass:false,//任务标题
            attachmentNum:'',//附件的数量
            picNum:'',//图片数量
            tagsNum:'',//标签数量
            taskActivits:[],
            alertUserName:'',
            activeNames: ['1'],
            isSee:false,
            finish:true,
            showLabel:false,//是否显示移动
            cardTitle:"",
            taskSetOrder:'',//置顶移动
            taskLeader:[],//detail负责人
            taskLeaderValue:'',//detail负责人字符串
            leaderTwo:[],//前两个负责人
            tags:[],//标签属性
            lableTwo:[],//标签前两个
            OrderFilterCards:[],//排序后的card数组

            firstTaskOrder:{},
            lastTaskOrder:{},
            subscribers:'',
            subscribersRange:[],//成员范围
            Members:[],//任务成员
            uniqueMember:[],//任务集所有成员
            filterMember:[],//任务集成员 - 任务成员
            fuzerenRangearr:[],//子任务配置项负责人范围

            orgMemberCardUrl: '',//成员详情
            orgMemberCardUrl2: '',//负责人详情
            showOrgMemberDetail: false,
            showOrgMemberDetail2: false,
            insertParams:{},
            getboardid :'', //boardid，listid 过渡变量
            getlistid:'', //boardid，listid 过渡变量
            createCardUrl:'',//创建者'
            activitieId : "",//编辑评论
            activitieVal : "",//编辑评论
            activitieRouting : "",//编辑评论
            subtaskListId: '', //临时保存点击的子任务配置项listId
            showRelationTask:false,//旧版关联任务
            relationInput:'',
            relationContents:[],
            buildFileUrl:[],  //服务号下档案信息
            FriendNumListes:[], //好友信息
            getPersonnelFileflag:true,
            maskTransition:'vux-fade',//弹窗遮罩动画
            showCardTitle:false,//编辑任务标题
            changeTiltle: "",//修改任务标题
            fiterPicture: [],//图片
            firterAttachment:[],//附件
            tasklist:"",//子任务“完成并转交”前的tasklist
            DetailWrapH:"",//配合引用部分detail组件
       }
    },
      computed:{
         cardUrl() {
             return this.$store.state.ui.userInfo.cardUrl;
         },
        realName() {
          return this.$store.state.ui.userInfo.RealName;
        },
        companyId() {
          return this.$store.state.ui.userInfo.companyId;
       },
        //计算转接的子任务
        options () {
              if (this.tasklists) {
                  let list = []
                  for (let i = 0; i < this.tasklists.length; i++) {
                        if (this.tasklists[i].listId !== this.subtaskListId){
                                let obj = {}
                                obj.listId = this.tasklists[i].listId
                                obj.value = this.tasklists[i].title
                                list.push(obj)
                        }
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
        //detail组件
         taskCardId() {
             return this.$route.query.taskCardId || this.transCardId
         },
         taskRouting() {
             return this.$route.query.taskRouting || this.transRouting
         },
          taskboardId() {
              return this.getboardid || this.transboardId
          },
         taskListId() {
             return this.getlistid || this.transListId
         },
         loadParams() {
           let loadParams = {
               cardId: this.taskCardId,
               routing: this.taskRouting,
           }
           return loadParams
         },
         Subtask() {
             return ''
         }
     },
      watch:{
          '$route'(to,from) {
              this.getPersonnelFile()
              this._getActivity()
              this._getloadCardByCardId()
          },
      },
      mounted() {
          //配合引用部分detail组件  chunyu
          setTimeout(()=>{
              this.bufenzujian()
          },2000)

          this.getFriendNumListES()       //好友
          this.getPersonnelFile()   //同事
          this._getActivity()
         if (!this.loadingSelf) {
             this.loading();
         } else {
             this._getCards()
             this._getloadLists()
             this.cardTitle = this.transtitle
             this.insertParams = {
                 boardId:this.taskboardId,
                 listId:this.taskListId,
                 cardId:this.taskCardId,
                 routing:this.taskRouting,
                 cardTitle:this.transtitle,
                 val: "",
                 members:'',
                 prefixMsg:'',
                 alertUserName:'',
                 type:''
             }
         }
     },
      methods:{
        //放大图片
        getBigPicList() {
            this.list = []
            for (let i=0;i< this.fiterPicture.length;i++) {
                let obj ={}
                obj.src = this.fiterPicture[i].reserved1
                this.list.push(obj)
            }
        },
        //放大图片组件里的图片
        show (index) {
          this.$refs.previewer.show(index)
        },
        //放大附件图片
        getBigAttachPicList() {
            this.listAttach = []
            for (let i=0;i< this.firterAttachment.length;i++) {
              let obj ={}
              obj.src = this.firterAttachment[i].reserved1
              this.listAttach.push(obj)
            }
        },
        attachShow (index) {
          this.$refs.previewerAttach.show(index)
        },
        //放大活动图片
        getBigActityPicList(){
            this.listActivity = []
            for (let i=0;i<this.taskActivits.length;i++) {
                let obj ={}
                obj.src = this.taskActivits[i].reserved1
                this.listActivity.push(obj)
            }
        },
        activityShow(index) {
          this.$refs.previewerActivity.show(index)
        },
        //detail组件底部问题
          bufenzujian(){
                  //配合引用部分detail组件
                  this.DetailWrapH = document.getElementById("detailWrapId").clientHeight
                  if (this.DetailWrapH === 0 || this.DetailWrapH === '0') {
                      this.DetailWrapH = document.getElementById("detailWrapId").style.height.split('px')[0]
                  }
                  if (this.clickEmojiOrClickMore) {
                      document.getElementById('detailScrollWrapb').style.height = (this.DetailWrapH - 42) + "px"
                  }
          },
          getImageUrl,
          //过滤load数据中有关附件添加的data
          _getFirterAttachment() {
              this.firterAttachment = this.taskActivits.filter((item, index, array) => {
                  return item.type === "attachment"
              })
              this._AttachmentNum()
              this.getBigAttachPicList()

          },
          //过滤load数据里有关图片添加的数据data
          _getFiterPicture() {
              this.fiterPicture = this.taskActivits.filter((item, index, array) => {
                  return item.type === 'image';
              })
              //图片数量
              this._pictureNum()
              //图片放大的list赋值
              this.getBigPicList()
          },
          //同事名字
          getPersonnelFile() {
              if (this.getPersonnelFileflag){
                  let url = "/zingbiz/auth/user/getHrUserMapByCardUrlList";
                  this.$http.get(url)
                      .then(res => {
                          let buildFileUrls = res.data.data //对象
                          let values = [];
                          Object.keys(buildFileUrls).forEach((key)=>{
                              values.push(buildFileUrls[key]);
                          })
                          this.buildFileUrl = values
                          this.buildFileUrl.forEach((item, index) => {
                              let buildFileUrl = item
                              if (this.cardUrl === buildFileUrl.cardUrl) {
                                  this.alertUserName = buildFileUrl.userName
                              }
                          })
                      })
                  this.getPersonnelFileflag = false
              }
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
              let FriendNumListes = res.data.data.data   //数组
            })
        },
         //旧版关联任务
          showRelation(){
              this.showRelationTask = true
          },
          onFocus(){
              let oldLength = this.relationInput.length
              setTimeout(() => {
                      let newLength = this.relationInput.length
                      if (oldLength === newLength) {
                          this._relationTask()
                      }
              },2000)
          },
          _relationTask(){
              this.$http.get(
                  "/ZingMH/ZDesk/card/mater/loadRelativeCard.action",
                  {
                      params: {
                          keywords:this.relationInput,
                          routing:this.taskRouting,
                      }
                  }
              ).then(res => {
                this.relationContents = res.data.data
              }).catch(err => {
                  console.log(err)
              })
          },
          choseRelation(cardId,routing,boardId,cardTitle){
              this.showRelationTask = false
              let that = this
              //发送saveUrlAndText请求
              let url1 = "/ZingMH/ZDesk/urlToTitle/saveUrlAndText.action"
              let urlping = `/taskManage/taskList/taskDetail?taskCardId=${cardId}&taskRouting=${routing}`
              let params1 = {
                  dataId: cardId,//dataId是cardId
                  categoryId: boardId,//categoryId是boardId
                  url: urlping,
                  text: cardTitle,
                  routing: routing,
              }
              that.$http.get(url1, { params: params1 })
                  .then(res => {
                      //发送insertActivity请求
                      let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      that.insertParams.val = `/ZingVue/index.html#/taskManage/taskList/taskDetail?taskCardId=${cardId}&taskRouting=${routing}`
                      that.insertParams.prefixMsg = '添加了评论'
                      that.insertParams.type = 'comment'
                      // subscribers: 2YV3emJ3MfiaARbu6jJVji2m
                      that.$http.get(url, { params: that.insertParams })
                          .then(res => {
                              that.updadeTaskActivits(res.data.data,true)
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"添加失败",type:"false"})
                              console.log(err)
                          })
                  })
                  .catch(err => {
//                      that.$vux.toast.show({text:"添加失败",type:"false"})
                      console.log(err)
                  })
          },
          //底部滑动问题
          changeSroll(val) {
              this.computeScrollInner = val
          },
          onScroll(pos) {
              if (pos.y === this.$refs.scroll.scroll.maxScrollY) {
                  this.scrollEnd = true
              } else {
                  this.scrollEnd = false
              }
          },
          //获取insertParams
          getInsertParams() {
                 this.insertParams = {
                     boardId:this.taskboardId,
                     listId:this.taskListId,
                     cardId:this.taskCardId,
                     routing:this.taskRouting,
                     cardTitle:this.cardTitle,
                     val: "",
                     members:this.Members,
                     prefixMsg:'',
                     alertUserName:this.alertUserName,
                     type:''
                 }
             },
          //获取list
          _getloadLists() {
                  this.$http.get(
                      "/ZingMH/ZDesk/list/mater/loadLists.action",
                      {
                          params: {
                              boardId:this.taskboardId,
                              routing:this.taskRouting,
                              status:'start'
                          }
                      }
                  ).then(res => {
                      this.tasklists = res.data.data
    //                  this._getActivity()

                    //排序
                    this.tasklists.sort((a,b) => {
                      if (!_.isUndefined(a.createAt) && !_.isUndefined(b.createAt)) {
                        return a.createAt < b.createAt ? -1 : 1
                      } else if (!_.isUndefined(a.createAt)) {
                        return 1
                      } else if (!_.isUndefined(b.createAt)) {
                        return -1
                      }
                    })

                  }).catch(err => {
                      console.log(err)
                  })
              },
          //头部加号
          _getDatas () {
    //            1 头部加号显示：
    //            if(不是任务负责人){
        //            if(任务成员){
        //                    {"任务结束"，"移动"}
        //            }else (任务集成员){
        //                    {"关注"}
        //            }
    //            }else(是任务负责人) {
    //               {"任务结束"，"移动"，"关注","归档"，"删除"，"关联任务"}
    //            }
    //             2 除头部外其他权限：
    //             任务集成员{"关注","置顶","图片","附件",}
    //             任务成员{"关注","置顶","图片","附件","关联任务"}
    //             子任务负责人{"关注","置顶","图片","附件","关联任务"，"里程碑","标签","开始转交"}
    //             任务负责人{"关注","置顶","图片","附件","关联任务""里程碑","标签","开始转交","选取子任负责人"，"选成员"}
    //

                //不是负责人
                if (this.taskLeaderValue.indexOf(this.cardUrl) === (-1)) {
                    //Members任务成员
                    // uniqueMember任务集成员
                    if (this.Members.indexOf(this.cardUrl) !== (-1)) {
                        this.datas = [
                            { content: "任务结束" },
                            { content: "移动" },
                        ]
                        if (this.isSolved === true) {
                            this.datas[0].content = '任务激活'
                        }
                    } else if(this.uniqueMember.indexOf(this.cardUrl) !== (-1)){
                        this.datas = [
                            { content: "关注" },
                        ]
                    }
                } else {
                   //负责人
                        this.datas = [
                            { content: "任务结束" },
                            { content: "归档" },
                            { content: "删除" },
                            { content: "移动" },
                            { content: "关注" },
                        ]
                        if (this.isSolved === true){
                            this.datas[0].content = '任务激活'
                        }
                        //如果是创建者，看到取消关注
                        if (this.createCardUrl === this.cardUrl){
                            this.datas[4].content = '取消关注'
                        }
                }
            },
          //编辑任务名字
          changeCardTitle() {
                if (this.taskLeaderValue.indexOf(this.cardUrl) !== (-1)) {
                    this.changeTiltle = this.cardTitle
                    this.showCardTitle = true
                } else {
                    this.$vux.toast.show({text: "您没有权限编辑任务标题", type: "success"});
                }
            },
          EditCardTitleBtn(isEdit,title) {
           if (isEdit) {
               this.showCardTitle = false
               let url2 = "/ZingMH/ZDesk/card/mater/updateCard.action"
               let params = {
                   title: title,
                   cardId: this.taskCardId,
                   routing: this.taskRouting,
               }
               this.$http.get(url2, { params: params })
                   .then(res => {
                        this.cardTitle = this.changeTiltle
                   })
                   .catch(err => {
                       this.$vux.toast.show({text:"任务标题修改失败",type:"false"})
                       console.log(err)
                   })
           } else {
               this.showCardTitle = false
           }
       },
          //里程碑
          changemarker(tasklist) {
            this.markertext = ''
            this.subtasklist = tasklist

            //里程碑编辑前显示内容
            let markertexts  = this.cardContactListArr
            for ( let i = 0;i < markertexts.length; i++) {
                if (markertexts[i].milestoneMark && markertexts[i].listId === this.subtasklist.listId) {
                    this.markertext = markertexts[i].milestoneMark
                }
            }
            this.showMarker = true
        },
          //编辑里程碑
          EditBtn(isEdit,isKeep,markertext) {
            if (isEdit) {
              this.isClickEdit = !this.isClickEdit
              if (isKeep) {
                  //编辑点保存时候
                let url = "/ZingMH/ZDesk/contactList/mater/updatecardContact.action"
                let params = {
                    cardId:this.taskCardId,
                    listId:this.subtasklist.listId,
//                    isMilestone:true,
                    milestoneMark:this.markertext,
                    routing:this.taskRouting,
                }
                this.$http.get(url,{params:params})
                    .then(res => {
                      //通知subtask更新颜色
                        this.$refs.subtaskChild.changeMilestoneMark(this.markertext,this.subtasklist)
                        //更新cardContactListArr，下次编辑时显示
                        for (let i=0;i<this.cardContactListArr.length;i++) {
                           if (this.cardContactListArr[i].cardContactId === this.subtasklist.cardContactId) {
                               this.cardContactListArr[i].milestoneMark = this.markertext
                           }
                        }
                      //insertActivity
                        let that = this
                        that.insertParams.val = `将子任务：【${ this.subtasklist.title }】设置里程碑为：${this.markertext}`
                        that.insertParams.reserved1 = 'start'
                        that.insertParams.type = 'message'
//                        subscribers: UBN7ZjAfiINzqaaaaazYNV3q
//                        notDisturb: UBN7ZjAfiINzqaaaaazYNV3q
                        let url1 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                        that.$http.get(url1, { params: that.insertParams })
                            .then(res => {
                                this.showMarker = false
                                // this._getActivity()
                                that.updadeTaskActivits(res.data.data,true)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        this.$vux.toast.show({text:"设置成功",type:"success"})
                    })
                    .catch(err => {
                        console.log(err)
                    });
              }
            } else {
            this.showMarker = false
            }
          },
          //完成并转交
          changeTransfer(tasklist) {
          this.subtaskListId = tasklist.listId
          this.tasklist = tasklist
          this.showTransfer = true
        },
          //转交
          gotoCard(item) {
              this.showTransfer = false
              let url = "/ZingMH/ZDesk/card/mater/moveCard.action"
              let listId = item.listId
              let params = {
                  listId: listId,
                  oldListId:this.taskListId,
                  cardId:this.taskCardId,
                  routing:this.companyId,
                  subTaskHandlingStatus:'solved',
              }
              this.$http.get(url,{params:params})
                  .then(res => {
                      this.showEndBtn = true
                      this.showDialog = false

                      //调用子组件的_getActivity()刷新
                      this.$refs.subtaskChild._getActivity()

                      //moveCard以后cardContactId改变，要拿到之前的cardContactId
                      //  this.$refs.subtaskChild._solvedZhuanjiao(res.data.cardContact,this.tasklist)
                      this.$vux.toast.show({text:"转交成功",type:"success"})

                      let oldTitle = ''
                      let newTitle = ""
                      for (let i=0; i<this.tasklists.length;i++){
                          if (this.tasklists[i].listId === this.taskListId){
                               oldTitle = this.tasklists[i].title
                          }
                          if (this.tasklists[i].listId === listId){
                              newTitle = this.tasklists[i].title
                          }
                      }
                      let that = this
                      let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      that.insertParams.val = `完成子任务：【${oldTitle}】，并将任务转交至【${newTitle}】`
                      that.insertParams.type = 'subTask'
                      that.insertParams.reserved1 = 'end'
                      that.$http.get(url2, { params: that.insertParams })
                          .then(res => {
                              //loadActivity
                              // this._getActivity()
                              //刷新底部评论
                              that.updadeTaskActivits(res.data.data,true)
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"转交任务失败",type:"false"})
                              console.log(err)
                          })
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
          //成员用户详情
          chengyuanXQ(cardUrl){
              this.orgMemberCardUrl = cardUrl
              this.showOrgMemberDetail = true
          },
          hideOrgMemberDetail(){
              this.showOrgMemberDetail = false
          },
          //负责人详情
          fuzerenXQ(cardUrl) {
              this.orgMemberCardUrl2 = cardUrl
              this.showOrgMemberDetail2 = true
          },
          hideOrgMemberDetail2(){
              this.showOrgMemberDetail2 = false
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
          //任务集成员
          getTaskMembers(arrchengrange){
             this.uniqueMember = arrchengrange.trim().split(' ')
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
             //找到上下移当前任务的位置
             for (let i=0;i<arr.length;i++){
               console.log('this.taskCardId',this.taskCardId," arr[i].cardId ",arr[i].cardId)
                if (arr[i].cardId === this.taskCardId){
                    this.cardNum = i
                }
             }
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

        //负责人前两个
        getLeaders(arr) {
            this.taskLeader = []
            this.leaderTwo = []
            for (let i=0;i<arr.length;i++){
                if (i < 2) {
                   this.buildFileUrl.forEach((item, index) => {
                       let buildFileUrl = item
                       if (arr[i] === buildFileUrl.cardUrl) {
                           arr[i].headImg += buildFileUrl.headImg
                       }
                   })
                    this.leaderTwo.push({
                        value: arr[i].value,
                        headImg: arr[i].headImg
                    })

               }
               //赋值获取detail中负责人
                this.taskLeader.push({
                    value: arr[i].value,
                    headImg: arr[i].headImg
                })
                for (let i = 0;i < this.taskLeader.length; i++){
                    this.taskLeaderValue += this.taskLeader[i].value
                }
           }
             this._getDatas ()
        },
        //来着detailMember，需传给detailSubtask
          subtaskFuzerenRange(fuzeRange) {
             this.fuzerenRangearr = fuzeRange
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
             if (ifup) {
                 //上移
                 if (this.cardNum <= 0){
                   this.$vux.toast.show({text: '已经置顶'})
                   return
                 }
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
               if (this.cardNum+1 >= this.OrderFilterCards.length){
                 this.$vux.toast.show({text: '已经置底'})
                 return
               }
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
                   //更新当前任务的cardNum值
                     this.listCardsFilter()
                     this.showLabel = false
                     if (ifup) {
                         this.$vux.toast.show({text: '上移'})
                     } else {
                         this.$vux.toast.show({text: '下移'})
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 });
//             this.$vux.toast.show({
//                 text: '上移'
//             })
         },
         loading() {
             this._getloadCardByCardId()
         },
         //图片数量
         _pictureNum() {
             this.picNum = this.fiterPicture.length
         },
         //附件数量
         _AttachmentNum() {
            this.attachmentNum = this.firterAttachment.length
          },
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
          //delOrUpdate   delete 删除 update 修改
           updadeTaskActivits(data,TellDetail,TellValJSON,delOrUpdate) {
               //load
               if (TellDetail) {
                   // this._getActivity()
                   //底部评论更新
                   if (data.type) {
                       //添加
                       this.taskActivits.unshift(data)
                   } else if (delOrUpdate === 'update') {
                       //修改
                       for (let i=0;i<this.taskActivits.length;i++) {
                           if (this.taskActivits[i].activitieId === data.activitieId) {
                               this.taskActivits[i].val = data.val
                              //不严谨，评论编辑，editTime有值就代表编辑过
                               this.taskActivits[i].editTime = new Date()
                               this.$set(this.taskActivits,i,this.taskActivits[i])
                           }
                       }
                   } else if (delOrUpdate === 'delete') {
                       for (let i=0;i<this.taskActivits.length;i++) {
                           if (this.taskActivits[i].activitieId === data) {
                               this.taskActivits.splice(i,1)
                           }
                       }
                       this._getFiterPicture()
                       this._getFirterAttachment()
                   }
                   //图片组件更新
                   if (data.type === 'image') {
                      this._getFiterPicture()
                   }
                   //附件组件更新
                   if (data.type === 'attachment') {
                       this._getFirterAttachment()
                   }
                   //放大活动图片更新
                   this.getBigActityPicList()

                   //通知引用的detail组件
                   if (TellDetail === 1 || TellDetail === 2 || TellDetail === 3) {
                       this.$emit('taskDetailChang',TellDetail,TellValJSON)
                   }

               }
           },
           // 更新标签
           updatetags(label,tags) {
              if (label) {
                  let arr = tags.trim().split("&index&")
                  if (arr[0] && arr[1]){
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
                          this.tagsNum = content.length
                          this.tags.push(obj)
                      }
                      if (this.tags.length >= 2) {
                          this.lableTwo = this.tags.slice(0,2);
                      } else if (this.tags.length < 2) {
                          this.lableTwo = this.tags
                      }
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

                        this._getFiterPicture()
                        this._getFirterAttachment()
                        //初始化活动放大图片
                        this.getBigActityPicList()
                         //里程碑编辑
                         this.cardContactListArr = res.data.cardContactListArr
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
                     this.scrollRefresh()

                     this.taskTitle = res.data.data.data[0].boardTitle
                     this.getboardid = res.data.data.data[0].boardId
                     this.getlistid = res.data.data.data[0].listId
                     this.cardTitle = res.data.data.data[0].title
                     this.createCardUrl = res.data.data.data[0].createCardUrl
                     this.getInsertParams()//用boarid
                     this._getCards()//用boarid
                     this._getloadLists()//用boarid
                     this.handlingStatus = res.data.data.data[0].handlingStatus
                     this.taskSetOrder = res.data.data.data[0].taskSetOrder
                     this.cardListId = res.data.data.data[0].listId

                     this.members = res.data.data.data[0].members
                     this.subscribers = res.data.data.data[0].subscribers
                     if(res.data.data.data[0].notDisturb){
                         this.notDisturb = res.data.data.data[0].notDisturb
                     }

                     console.log('this.notDisturb.indexOf(this.cardUrl)>-1',this.notDisturb.indexOf(this.cardUrl)>-1)
                     if (this.notDisturb.indexOf(this.cardUrl)>-1){
                           this.isRemind = true
                     } else {
                           this.isRemind = false
                     }
                     //处理标签
                     if (res.data.data.data[0].tags){
                         let arr = res.data.data.data[0].tags.trim().split("&index&")
                         if (arr[0] && arr[1]){
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
                                 this.tagsNum = content.length
                                 this.tags.push(obj)
                             }
                             if (this.tags.length >= 2) {
                                 this.lableTwo = this.tags.slice(0,2);
                             } else if (this.tags.length < 2) {
                                 this.lableTwo = this.tags
                             }
                         }
                     }

                     //激活任务
                     if (this.handlingStatus === 'solved') {
                         this.isSolved = true
                     } else if (this.handlingStatus === 'activation') {
                         this.isSolved = false
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 });
         },
          //消息免打扰
          changeStatus() {
              let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
              this.isRemind = !this.isRemind
              let isRemind = this.isRemind
              let notDisturb = ""
                if (this.isRemind){
                    notDisturb = this.cardUrl
                } else {
                    notDisturb = ""
                }
              let params = {
                  cardId:this.taskCardId,
                  routing:this.taskRouting,
                  boardId: this.taskboardId,
                  isRemind: isRemind,
                  notDisturb: notDisturb,
                  operatingUser: this.cardUrl,
              }
              this.$http.get(url,{ params:params })
                  .then(res => {
                       this.switchValue = !this.switchValue
                  })
                  .catch(err => {
                      console.log(err)
                  });
          },
          //点击除底部外的区域底部回去
            freshBottom(){
                if (!this.clickEmojiOrClickMore){
                    document.getElementById('detailScrollWrapb').style.height = ''
                } else {
                    document.querySelector(".detailScrollWrap").style.height = (this.DetailWrapH - 42) + "px"
                }
                this.scrollRefresh()
            },
           //底部输入
            textareaFoucus() {
                if (!this.clickEmojiOrClickMore){
                    document.getElementById('detailScrollWrapb').style.height = ''
                } else {
                    document.querySelector(".detailScrollWrap").style.height = (this.DetailWrapH - 42) + "px"
                }
              },
            clickEmoji() {
              //如果是detail组件传过来的就不执行
               if (!this.clickEmojiOrClickMore){
                   let deviceHeight = document.documentElement.clientHeight
                   let a = deviceHeight * 0.45
                   document.getElementById('detailScrollWrapb').style.height = a + 'px'
               } else {
                   let deviceHeight = this.DetailWrapH
                   let a = deviceHeight * 0.29
                   document.getElementById('detailScrollWrapb').style.height = a + 'px'
               }
            },
            clickboard() {
                // document.getElementById('detailScrollWrapb').style.height = ''
                if (!this.clickEmojiOrClickMore){
                    document.getElementById('detailScrollWrapb').style.height = ''
                } else {
                    document.querySelector(".detailScrollWrap").style.height = (this.DetailWrapH - 42) + "px"
                }
            },
            clickMore(isMore) {
                //如果是detail组件传过来的就不执行
               if (!this.clickEmojiOrClickMore){
                       let deviceHeight = document.documentElement.clientHeight
                       let a = deviceHeight * 0.47
                       if (isMore) {
                            document.getElementById('detailScrollWrapb').style.height = a + 'px'
                       } else {
                            document.getElementById('detailScrollWrapb').style.height = ''
                       }
               } else {
                   if (isMore) {
                       let a = this.DetailWrapH * 0.29
                       document.getElementById('detailScrollWrapb').style.height = a + 'px'
                   } else {
//                       document.getElementById('detailScrollWrapb').style.height = ''
                         document.querySelector(".detailScrollWrap").style.height = (this.DetailWrapH - 42) + "px"

                   }
               }
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
                if (data.content === "关注") {
                    this.subscribe(true)
                } else if (data.content === "取消关注") {
                    this.subscribe(false)
                }
            },
            delCard() {
                this.$vux.confirm.show({
                    title: "提示",
                    content: "是否删除",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/deleteCard.action"
                        this.$http.get(url,{ params:{cardId:this.taskCardId,routing:this.taskRouting } })
                       .then(res => {
                            this.$router.push({
                                name: "taskList",
                                query: {
                                title: this.taskTitle,
                                boardId: this.taskboardId,
                                routing: this.taskRouting,
                                }
                        });
                      })
                      .catch(err => {
                          console.log(err)
                      });
                    }
                })
            },
           //移动
            moveCard() {

            },
           //归档
            pigeonholeCard(){
                let _that = this;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "是否确认归档",
                    onCancel() {
                    },
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/card/mater/updateCard.action"
                        _that.$http.get(url,{ params:{ cardId:_that.taskCardId,routing:_that.taskRouting,status:'end' }})
                            .then(res => {
                                _that.$router.push({
                                    name: "taskList",
                                    query: {
                                        title: _that.taskTitle,
                                        boardId: _that.taskboardId,
                                        routing: _that.taskRouting,
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
          //结束任务
            taskEnd(){
                let url = "/ZingMH/ZDesk/card/mater/updateCardManage.action"
                this.$http.get(url,{ params:{cardId:this.taskCardId,routing:this.taskRouting,listId:this.taskListId,handlingStatus:'solved'} })
                  .then(res => {
                      this.isSolved = true
                      this.datas[0].content='任务激活'
                      //insert请求
                      let that = this
                      let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                          that.insertParams.val = '结束此任务'
                          that.insertParams.type = 'subTask'
                      that.$http.get(url2, { params: that.insertParams })
                          .then(res => {
                              //通知load
                              let TellDetail = true
                              that.updadeTaskActivits(res.data.data,TellDetail)
                              this.$vux.toast.show({text:"已结束",type:"success"})
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"结束任务失败",type:"false"})
                              console.log(err)
                          })
                  })
                  .catch(err => {
                      console.log(err)
                  });
            },
            taskActive(){
                 let url = "/ZingMH/ZDesk/card/mater/updateCardManage.action"
                 this.$http.get(url,{ params:{cardId:this.taskCardId,routing:this.taskRouting,listId:this.taskListId,handlingStatus:'activation'} })
                  .then(res => {
                     this.isSolved = false
                     this.datas[0].content='任务结束'
                      let that = this
                      let url2 = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                      that.insertParams.val = '激活此任务'
                      that.insertParams.type = 'subTask'
                      that.$http.get(url2, { params: that.insertParams })
                          .then(res => {
                              //通知load
                              let TellDetail = true
                              that.updadeTaskActivits(res.data.data,TellDetail)
                              that.$vux.toast.show({text:"已激活",type:"success"})
                          })
                          .catch(err => {
                              that.$vux.toast.show({text:"激活失败",type:"false"})
                              console.log(err)
                          })
                   })
                   .catch(err => {
                     console.log(err)
                   });
          },
          //关注和取消关注
           subscribe(isSubscribe) {
              if (isSubscribe){
                  let url = "/ZingMH/ZDesk/card/mater/triggerSubscribe.action"
                  this.$http.get(url,{ params:{cardId:this.taskCardId,routing:this.taskRouting,subscribers:this.cardUrl,isSubscribers:'true'} })
                      .then(res => {
                          let datas = this.datas
                          let index = 0
                          for(let i=0;i<datas.length;i++){
                              if (datas[i].content === "关注"){
                                index = i
                              }
                          }
                          this.datas[index].content = "取消关注"
                          this._getloadCardByCardId()
                          this.$vux.toast.show({text:"设置成功",type:"success"})
                      })
                      .catch(err => {
                          console.log(err)
                      })
              } else {
                  let url = "/ZingMH/ZDesk/card/mater/triggerSubscribe.action"
                  let subscribers =  this.subscribers
                  this.$http.get(url,{ params:{cardId:this.$route.query.taskCardId,routing:this.$route.query.taskRouting,subscribers:subscribers,isSubscribers:'false'} })
                      .then(res => {
                          let datas = this.datas
                          let index = 0
                          for (let i=0;i<datas.length;i++){
                              if (datas[i].content === "取消关注"){
                                  index = i
                              }
                          }
                          this.datas[index].content = "关注"
                          this.$vux.toast.show({text:"设置成功",type:"success"})
                      })
                      .catch(err => {
                          console.log(err)
                      });
              }
          },
            scrollRefresh() {
                    this.$nextTick(() => {
                        this.$refs.scrollContent.refresh()
                      })
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
                                boardId: this.taskboardId,
                                routing: this.taskRouting,
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
            height calc(100%-100px)
            .lableSpanWrap
                padding 5px 13px
                overflow hidden
                .lableSpan
                    height 30px
                    line-height 30px
                    border-radius 3px
                    margin-bottom: 3px
                    display inline-block
                    width 49%
                    white-space pre-wrap
                    text-align center
                    color white
                .lableSpan:nth-of-type(odd)
                    float left
                .lableSpan:nth-of-type(even)
                    float right
            .lableSpanTwo
                overflow hidden
                white-space pre-wrap
                margin 5px
                padding-right 10px
                display inline-block
                border-radius 3px
                width 40%
                height 30px
                line-height 30px
                text-align center
                color white
            .modalWrap
                width 100%
                .el-collapse
                    text-indent:1em
                    border-bottom 0
                 >>>.el-collapse-item__content
                        padding-bottom 0
                        .cardTitle
                           font-size 15px
                           margin 10px 0
                           height 30px
                        .titleThrough
                           text-decoration line-through
                 >>>.el-collapse-item__header
                       font-size 16px
                       .avatarWrap
                          .avatarWrap2
                              display inline-block
                    .el-collapse-item__header
                       font-size 14px
                    .ActivityCell
                       height 48px
                       .ActivityCell2
                          margin 10px 0 10px 0
                          display flex
                          span
                             display inline-block
                             flex 5
                             font-size 16px
                          .ActivityR
                             margin-right 10px

    .moveWrap
        .weui-dialog
            width 100% !important
            .moveText
               font-size 16px
               display flex
               margin-top -10px
               .vux-close
                  flex 15
                  margin 20px 0 0  45px
               .vux-close1
                  flex 1
                  margin 20px 5px 0  10px
            .moveTab
                padding 20px 0 10px 0
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
    .markerWrap,.cardTitleWrap
        .markerText,.CardTitleText
           margin-top 10px
           .vux-close
              font-size 18px
        .markerTextarea
           height 80px
           text-align left
           text-indent 2em
        .changemarkerH
           height 100%
        .markerTextarea2,.CardTitleTextarea
           padding-top 10px
           textarea
              width 90%
              height 80px
              text-align left
              resize none
              outline none
              border 1px solid gray
              border-radius 3px
              font-size 16px
        .markerBottom2,.markerBottom,.CardTitleBottom
           display flex
           height 40px
           .addNew,.cancelNew,.vux-close-marker,.cancelCardTitle,.editCardTitle
              flex 1
              height 40px
              line-height 40px
              font-size 18px
              color #FF8000
           .cancelNew,.cancelCardTitle
               color black
    .relationTask
        width 70%
        .relation-select-scroll
            overflow auto
            .relation-select-content
                height 100%
            .relation-select-title
                display flex
                margin-top 10px
                .vux-close
                    flex 2
                    margin-right -20px
                .closeRelation
                    margin-right 20px
        input
            border 1px solid #adadad
            border-radius 3px
            height 30px
            width 95%
            margin 5px 0 0 -10px
        .selectUl
           .selectLi
              border-bottom 1px solid gray
        .relation-selectUl
            overflow scroll
            height 150px
            .relation-selectLi
                display flex
                background-color  #74a5fd
                height 30px
                line-height 30px
                border-radius 3px
                margin 5px
                p
                    font-size 14px

</style>

