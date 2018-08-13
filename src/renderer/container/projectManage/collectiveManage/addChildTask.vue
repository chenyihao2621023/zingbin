<template>
    <div id="insertOrUpdateInfo" class="insertOrUpdateInfo">
        <zing-head :isShowQuery="false" title="添加任务">
            <div slot="left"></div>
        </zing-head>
        

           <!-- 弹框模板 -->
    <task-selection :showTaskSelection="taskSelectionShow" @confirmTaskSelection="confirmTaskSelection" @cancleTaskSelection="cancleTaskSelection"></task-selection>
    <group label-align="left">
                                <!-- <x-input title="名称" v-model="taskName" class="inputTitle" placeholder="请输入项目名称">
                                    <span slot="title">名称1<span span style="color: red">*</span></span>
                                </x-input> -->
                                 
 
                                
                                <cell  title="添加任务" class="typeClass" :class="{'typeH':typeH}"  placeholder="">
                                    <span class="iconSize2">
                                         
                                        <i class="icon iconfont" style="    font-size: 20px" @click="taskSelectionShow = true">&#xe64e;</i>
                                    </span>
                                </cell>
    </group>                            
        <div class="contentWrap">
            <div class="content">
              <div class="addvariable wrapper-better" ref="wrapper">
                   <div>
                            <!--<group label-width="6em" label-margin-right="2em" label-align="left">-->
                            
                            <AddTaskChild v-for="v in taskChildArr" v-bind:key="v" :transCardId="v.cardId" :transboardId="v.boardId" :transRouting="v.routing" :transListId="v.listId"></AddTaskChild>
                                
                          
                    </div>
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
                   <org-member-picker
                      :showPicker="showPersonPicker2"
                      :initialSelected="insertNew2"
                      :designatedCardUrls="designatedCardUrls2"
                      :multiple="multipleForSelPerson2"
                      :showTab="showTab2"
                      @picked="onPicked2"
                      @abort="onPickAbort2">
                  </org-member-picker>
                    <!-- 选择图标组件 -->
                   <iconPicker
                        :icon-picker-show="dialogIcon"
                        :iconData="['benbanzushengchandingdanguanli', 'canting', 'jiudian', 'shangpu', 'caigou-tianchong', 'xiaoshougendanguanli', 'salesinvoice',
                        'shenpi1', 'tuihuo', '02', 'shichang', 'renzhengziliao', 'baocun-tianchong', 'baobiao-selected', 'renwu', 'xiaolaba', 'caiwu', 'fabubiaoshu', 'cardb', 'weibiaoti4']"
                        :bg-color="'rgb(112, 204, 109)'"
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
                       :showType="showTypePopup"
                       @checkSelectedType="checkSelectedType"
                       @abort="typeAbort"
                    >
                    </choseType>
                   <!--模板组件-->
                   <choseMould
                      :showMould="showMouldPopup"
                      @checkSelectedMould="checkSelectedMould"
                      @abort="mouldAbort"
                    >

                    </choseMould>
              </div>
            </div>
            <div class="bottomWrap">
                <div>
                    <x-button  style="height:50px" class="subject-picker-button" type="primary" @click.native="closeEditModel">关闭</x-button>
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
  XHeader
} from "vux";
import iconPicker from "../../../components/iconpicker/IconPicker";
import ZingHead from "@/components/zingHead/ZingHead";

import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import classSelection from "../../common/classSelection/classSelection";
import choseType from "../collectiveManage/choseType";
import TaskSelection from "../../common/task/taskSelectionMini";
import choseMould from "../collectiveManage/choseMould";
import TagGroup from "components/taggroup/TagGroup";
// import Scroll from "@/components/scroll/Scroll";
import BScroll from "better-scroll";
import AddTaskChild from "../taskDetail";
import { cardUrlToRealName } from "../util";
import _ from "lodash";
import avatar from "@/components/avatar/Avatar";

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
    // Scroll,
    avatar,
    TaskSelection,
    AddTaskChild
  },
  data() {
    return {
      taskChildArr: [],
      taskSelectionShow: false,
      headTitle: "", //标题
      taskName: "", //项目名称
      privateWorkType: "", //个人分类     ??
      superWorkType: "", //全体分类       ??
      selectWorkType: "", //分类
      showChoseType: [], //类型回显
      tasktypeTag: "", // 类型
      showChoseMould: [], //模板回显
      placeholder: "", //提示
      dialogIcon: false, //图标选择组件
      checked: false, //设为模板
      screenHeight: "0px",
      bgColor: "", //图标组件背景
      taskIconBgColor: "",
      taskIcon: "tianjia1",
      showClassSetter: false, //分类组件显示
      title1: "个人分类",
      title2: "全体分类",
      tagType1: "work",
      tagType2: "superWork",
      showTypePopup: false, //是否显示类型
      showMouldPopup: false, //是否显示模板
      //选人组建成员 参数
      insertNew: [], //成员初始显示
      subscribers: "", //初始選中人員
      subscribersRange: "", //初始人員範圍
      showPersonPicker: false, //是否显示选人组件
      multipleForSelPerson: true, //人员是否多选
      //        showTab: ["colleague",'designatedPersonnel'],//自定義顯示選人tab
      showTab: ["colleague"], //自定義顯示選人tab
      subscribersTransform: "",
      chengH: false, //成员动态高度

      //选人组建负责人 参数
      insertNew2: [], //负责人初始值
      stewards: "", //初始選中負責人
      showPersonPicker2: false, //是否显示选人组件
      multipleForSelPerson2: true, //人员是否多选
      //        showTab2: ["colleague", 'designatedPersonnel'],
      showTab2: ["designatedPersonnel"],
      fuzeH: false, //负责人动态高度
      classH: false, //选择分类动态高度
      typeH: false,
      mouldH: false,
      addSet: "", //定时器
      projectIsCreated: false,
      currentChooseTMPID: ""
    };
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
    //負責人範圍
    designatedCardUrls2() {
      let arr = [];
      if (this.subscribers) {
        arr = this.subscribers.trim().split(" ");
      }
      return arr;
    }
  },
  mounted() {
    this.boardId = this.$route.query.boardId;
    this.taskName = this.$route.query.taskName;
    this.workType = this.$route.query.workType;
    if (this.workType == null || _.isUndefined(this.workType)) {
      this.workType = "tianjia1";
    }
    this.privateWorkType = this.$route.query.privateWorkType;
    this.superWorkType = this.$route.query.superWorkType;
    this._beforAddEdit();

    this.getinsertNew(); //成员
    this.getinsertNew2(); //负责人
    if (!_.isEmpty(this.boardId)) {
      this.loadCard();
    }
    // this.scroll = new BScroll(this.$refs.wrapper, {
    //   probeType: this.probeType,
    //   click: true,
    //   scrollX: this.scrollX
    // });
  },
  beforeDestroy() {
    clearTimeout(this.addSet);
  },
  methods: {
    loadCard() {
      let url = "/ZingMH/ZDesk/card/mater/loadCards.action";
      this.$http
        .get(url, {
          params: {
            referenceId: this.boardId,
            routing: this.$store.state.ui.userInfo.companyId,
            status: "start"
          }
        })
        .then(res => {
          this.taskChildArr = res.data.data;
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: this.probeType,
            click: this.click,
            scrollX: this.scrollX
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmTaskSelection(data) {
      console.log("添加子任务");
      this.updateReferenceId(data, res => {
        this.taskChildArr.push({
          boardId: data.boardId,
          routing: data.routing,
          cardId: data.cardId,
          listId: data.listId
        });
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        scrollX: this.scrollX
      });
      this.taskSelectionShow = false;
    },
    updateReferenceId(data, fn) {
      debugger;
      let referenceId = "";
      if (!_.isEmpty(this.$route.query.boardId)) {
        referenceId = data.referenceId + " " + this.$route.query.boardId;
      } else {
        referenceId = data.referenceId + " " + this.boardId;
      }
      this.$http
        .get("/ZingMH/ZDesk/card/mater/updateReferenceId.action", {
          params: {
            referenceId: referenceId,
            routing: this.$store.state.ui.userInfo.companyId,
            cardId: data.cardId
          }
        })
        .then(res => {
          fn(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancleTaskSelection() {
      this.taskSelectionShow = false;
    },
    //初始页面
    _beforAddEdit() {
      if (this.$route.query.taskName) {
        //编辑
        this.headTitle = "编辑项目";
        this.taskName = this.$route.query.taskName;
        this._getloadBoardEsById(); //编辑时初始人员
        this.workType = this.$route.query.workType; //图标
        this.selectWorkType = this.$route.query.selectWorkType; //全体加个人分类
        this.boardProperty = this.$route.query.boardProperty; //类型
        this.classH = true;
      } else {
        //增加
        this.headTitle = "新建项目";
        this.showClass = true;
      }
    },
    //获取人員
    _getloadBoardEsById() {
      let that = this;
      let url = "/ZingMH/ZDesk/projectManageBoard/mater/loadBoardEsById.action";
      let params = {
        boardId: that.boardId,
        routing: that.companyId
      };
      that.$http
        .get(url, { params: params })
        .then(res => {
          if (res.data.data) {
            this.subscribers = res.data.data.data[0].subscribers;
            this.getinsertNew();
            this.stewards = res.data.data.data[0].stewards;
            this.getinsertNew2();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //人员初始显示
    getinsertNew() {
      //人员初始页面赋值
      let arr1 = [];
      let arr2 = this.subscribers.trim().split(" ");
      //清空上次
      this.insertNew = [];
      for (let i = 0; i < arr2.length; i++) {
        this.insertNew.push({
          value: arr2[i],
          key: "",
          type: "user"
        });
        arr1.push(arr2[i]);
      }
      //调用换名方法
      this.getRealName(arr1);
      if (arr2.length > 5) {
        //高度
        this.chengH = true;
      }
    },
    //负责人初始显示
    getinsertNew2() {
      let arr1 = [];
      //清空上次
      this.insertNew2 = [];
      if (this.stewards) {
        let arr = this.stewards.trim().split(" ") || [];
        for (let i = 0; i < arr.length; i++) {
          this.insertNew2.push({
            value: arr[i],
            key: "",
            type: "user"
          });
          arr1.push(arr[i]);
        }
      }
      //调用换名方法
      this.getRealName2(arr1);
      if (arr1.length > 5 && arr1.length < 10) {
        //高度
        this.fuzeH = true;
        //              this.fuzeH = 2*34
      }
    },
    //转换人员
    getRealName(arr) {
      let a = cardUrlToRealName(arr);
      a.then(result => {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.insertNew.length; j++) {
            if (this.insertNew[j].value === arr[i]) {
              if (result[arr[i]]) {
                this.insertNew[j].key = result[arr[i]].RealName;
              }
            }
          }
        }
      });
    },
    getRealName2(arr) {
      let a = cardUrlToRealName(arr);
      a.then(result => {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.insertNew2.length; j++) {
            if (this.insertNew2[j].value === arr[i]) {
              if (result[arr[i]]) {
                this.insertNew2[j].key = result[arr[i]].RealName;
              }
            }
          }
        }
      });
    },

    //添加和编辑项目
    addOrEdit() {
      let self = this;
      let url = "";
      if (this.$route.query.taskName) {
        //编辑项目
        url = "/ZingMH/ZDesk/projectManageBoard/mater/updateBoards.action";
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
            self.boardId = res.data.data.boardId;
            self.taskName = res.data.data.title;
            self.workType = res.data.data.workType;
            self.boardProperty = res.data.data.boardProperty;
            // this.addSet = setTimeout(function() {
            //   self.$router.back(-1);
            // }, 2500);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //新建项目
        url = "/ZingMH/ZDesk/projectManageBoard/mater/insertBoard.action";
        let params = {
          title: self.taskName,
          templateIcon: self.taskIcon,
          companyId: self.companyId,
          subscribers:
            self.subscribers + " " + this.$store.state.ui.userInfo.cardUrl,
          stewards:
            self.subscribers + " " + this.$store.state.ui.userInfo.cardUrl,
          privateWorkType: self.cardUrl + "&&" + self.privateWorkType,
          superWorkType: self.superWorkType,
          inputClassify:
            "共有分类:" +
            self.superWorkType +
            "私有分类:" +
            self.privateWorkType,
          //                    memberSelect:self.subscribers,
          tag: "projectManage"
        };
        if (this.checked) {
          params.PMT_companyId = self.companyId + "_PMT";
        }

        if (_.isEmpty(self.taskName)) {
          self.$vux.toast.text("请输入项目名称");
          return;
        }

        self.$http
          .get(url, { params: params })
          .then(res => {
            this.boardId = res.data.data.primaryId;
            this.projectIsCreated = true;

            // this.$router.push("/projectManage");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    closeEditModel() {
      this.$router.push("/projectManage");
    },
    //添加人员方法
    selectInputPerson(data) {
      this.showPersonPicker = true;
    },
    selectInputPerson2() {
      this.showPersonPicker2 = true;
    },
    onPicked(list) {
      this.showPersonPicker = false;
      let newSubscribers = "";
      for (let i = 0; i < list.length; i++) {
        newSubscribers += list[i].cardUrl + " ";
      }
      this.getinsertNew();
      //高度
      this.chengH = true;
      this.$http
        .get("/ZingMH/ZDesk/projectManageBoard/mater/updateMember.action", {
          params: {
            boardId: this.$route.query.boardId,
            subscribers: newSubscribers,
            oldSubscribers: this.subscribers,
            routing: this.$route.query.routing
          }
        })
        .then(res => {
          //更新newSubscribers
          this.subscribers = newSubscribers;
          this.getinsertNew();
        })
        .catch(err => {
          console.log(err);
        });
    },
    onPicked2(list) {
      this.showPersonPicker2 = false;
      let newSubscribers = "";
      for (let i = 0; i < list.length; i++) {
        newSubscribers += list[i].cardUrl + " ";
      }
      this.getinsertNew2();
      this.$http
        .get("/ZingMH/ZDesk/projectManageBoard/mater/updateMember.action", {
          params: {
            boardId: this.$route.query.boardId,
            subscribers: newSubscribers,
            oldSubscribers: this.subscribers,
            routing: this.$route.query.routing
          }
        })
        .then(res => {
          //更新stewards
          this.stewards = newSubscribers;
          this.getinsertNew2();
          //高度
          this.fuzeH = true;

          this.$nextTick(() => {
            this.$refs.scroll.refresh();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    onPickAbort2() {
      this.showPersonPicker2 = false;
    },
    //分类
    selectClass() {
      this.showClassSetter = true;
    },
    checkSelected(selected, taskUnit) {
      this.showClassSetter = false;
      let superWorkType = selected.superWorkType ? selected.superWorkType : " ";
      let privateWorkType = selected.privateWorkType
        ? selected.privateWorkType
        : " ";
      this.selectWorkType = privateWorkType + " " + superWorkType; //全体加个人分类
      this.privateWorkType = selected.privateWorkType;
      this.superWorkType = selected.superWorkType;
    },
    classAbort() {
      this.showClassSetter = false;
    },
    //类型
    selectType() {
      this.showTypePopup = true;
    },
    checkSelectedType(value) {
      this.showTypePopup = false;
      this.showChoseType = [];
      this.tasktypeTag = "";
      if (value.length > 3) {
        this.typeH = true;
      }
      _.each(value, valueName => {
        this.showChoseType.push(valueName.label);
        this.tasktypeTag += valueName.label + " ";
      });
    },
    typeAbort() {
      this.showTypePopup = false;
    },
    //模版
    selectMould() {
      this.showMouldPopup = true;
    },
    checkSelectedMould(value) {
      this.showMouldPopup = false;
      this.showChoseMould = [];
      if (value.length > 3) {
        this.mouldH = true;
      }
      debugger;
      _.each(value, valueName => {
        this.showChoseMould.push(valueName.label);
        this.currentChooseTMPID = valueName.value;
      });
    },
    mouldAbort() {
      this.showMouldPopup = false;
    },
    selectMouldThis() {},
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
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/unify.styl';

.insertOrUpdateInfo {
  height: 100%;

  .contentWrap {
    display: flex;
    flex-flow: row wrap;
    height: calc(100% - 50px);

    .content {
      width: 100%;
      height: calc(100% - 50px);
      align-self: flex-start;

      .addvariable {
        height: 100%;
      }

      .weui-cell {
        height: 34px;
        margin: 10px 5px;

        .vux-cell-primary {
          height: 29px;
          line-height: 29px;
          margin-top: 10px;
        }
      }

      .inputTitle {
        width: 250px;
        weui-cell__primary;
        flex: 5;
        width: 250px;
      }

      .cheng, .fuze, .changeH, .classH, .selectClass, .typeClass, .mouldClass {
        height: 34px;
        display: flex;

        .vux-cell-primary {
          flex: 1;
        }

        .weui-cell__ft {
          flex: 3;
        }

        .weui-cell__ft > i {
          font-size: 30px !important;
          border-radius: 4px;
          display: inline-block;
          margin-top: 13px;
        }
      }

      .selectClass {
        .weui-cell__ft {
          .iconSize2 {
            margin-top: 1px;
          }
        }
      }

      .fuze {
        .vux-cell-primary {
          flex: 1.2;
        }
      }

      .taskIcon {
        height: 40px;

        .vux-cell-primary {
          flex: 2;
        }
      }

      .iconSize {
        span {
          // margin: 15px 0 0 0 !important;
          width: 30px;
          height: 30px;
        }
      }

      .iconSize2 {
        margin-top: 15px;
      }

      .iconSize2 > i {
        font-size: 30px !important;
        border-radius: 4px;
        display: inline-block;
        margin-top: 13px;
      }

      .changeH, .classH, .fuzeH, .mouldH, .typeH {
        height: 100%;
        line-height: 100%;
      }

      .mouldH {
        margin-bottom: -15px;
      }

      .mould {
        .vux-cell-primary {
          flex: 4;
        }
      }

      .weui-cell:nth-child(7) {
        height: 55px;
        margin: 10px 5px;
      }
    }

    .bottomWrap {
      width: 100%;
      height: 50px;
      align-self: flex-end;
    }

    .taskIconWrap {
      height: 50px;
      line-height: 50px;
      padding-top: 3px;
      margin-right: -10px;
    }

    .taskIcon {
      // text-align: center;
      flex: 2;
      height: 40px;

      .iconfont {
        font-size: 50px;
        border-radius: 4px;
        color: white;
        background-color: #999999;
      }
    }
  }
}
</style>
