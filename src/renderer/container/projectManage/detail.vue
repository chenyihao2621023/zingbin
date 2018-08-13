<!--任务详情-->
<template>
    <div class="detailWrap">
            <!--头部-->
        <zing-head :title="title" :isComeBack="true"   >
             
        </zing-head>
         <tab>
          <tab-item selected @on-item-click="onItemClick(1)">甘特图</tab-item>
          <tab-item @on-item-click="onItemClick(2)">统计</tab-item>
          <tab-item @on-item-click="onItemClick(3)">活动 </tab-item>
         </tab>
          <div id="gantt" v-show="currentIndex === 1">
            <div class="gantt-text" v-if="!isPc()"> <b>请在PC端查看甘特图</b></div>  
            <div v-else> <Gantt></Gantt> </div>  
          </div>  
          <div   v-show="currentIndex === 2"></div>  
          <div   v-show="currentIndex === 3" v-bind:style="heightStyle">

          <el-collapse v-model="activeNames" @change="handleChange">
            
            <el-collapse-item title="成员" name="2"  >
                            <template slot="title">
                                <span style="float:left;font-size: 16px">负责人</span>
                                <span class="avatarWrap" v-for="(fuze,index) in leaderTwo" :key="index">
                                    <span v-if="fuze.headImg" class="avatarWrap2" >
                                         <avatar :size="'default'" shape="square"
                                                 :src="getImageUrl(fuze.headImg,'./static/images/userDef_.jpg')"
                                                 style=" float: left;margin-left:20px;margin-right: 10px;margin-top:5px">
                                         </avatar>
                                    </span>
                                    <span v-else>
                                         <avatar :size="'default'" shape="square"
                                                 src="../../assets/img/userDef_.jpg"
                                                 style=" float: left;margin-top: 7px;margin-left: 7px;">
                                          </avatar>
                                    </span>
                                </span>
                            </template>
                            <template v-if="(transboardId !== '')||(transCardId !== undefined)">
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
            <split  ></split>
            <cell class="ActivityCell">
                            <div class="ActivityCell2" >
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
             
          </el-collapse>
          <!-- <div style="height:50px">1</div>
          <div style="height:50px">2</div> -->
                <!--detail-->
                <taskDetail
                :loadingSelf = "true"
                    :showTaskDetail="false"
                    :showTaskDetailHead="false"
                    :transCardId="transboardId"
                    :transRouting= "transRouting"
                    :transtitle="transtitle"
                    :transboardId="transboardId"
                    :transListId="transListId"
                    @taskDetailChang="taskDetailChang"
                    :clickEmojiOrClickMore="true"
                    :style="chartHeight"
                    >   
                <!-- <taskDetail
                     :showTaskDetail="false"
                :transCardId="transCardId"
                :transRouting= "transRouting"
                @taskDetailChang="taskDetailChang"
                :showTaskDetailHead="false"
                    >  图片1、附件2、评论3 -->

                    
                </taskDetail>
            
        </div>  
    </div>
  </template>
  <script>
import {
  Group,
  XDialog,
  Selector,
  Confirm,
  Checker,
  CheckerItem,
  XButton,
  Flexbox,
  FlexboxItem,
  XSwitch,
  Tab,
  TabItem
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import Gantt from "@/container/demo/gantt/GanttDemo";
import Scroll from "@/components/scroll/Scroll";
import Dropdown from "@/components/dropdown/Dropdown";
import split from "@/container/taskManage/split/split";
import taskDetail from "../taskManage/taskDetail";
import { Z_IsEmpty20, isPc } from "../../utils/fn";
import _ from "lodash";
import { mapMutations } from "vuex";
import avatar from "@/components/avatar/Avatar";
import OrgMemberDetail from "@/components/orgmemberpicker/OrgMemberDetail";
import BScroll from "better-scroll";
import AddTaskChild from "./taskDetail";
import detailMember from "./detail/detailMember";
import { getImageUrl } from "../../utils/fn";
export default {
  components: {
    taskDetail,
    ZingHead,
    Group,
    Scroll,
    XDialog,
    Selector,
    Dropdown,
    split,
    XSwitch,
    Confirm,
    Checker,
    CheckerItem,
    XButton,
    Flexbox,
    FlexboxItem,
    Gantt,
    avatar,
    OrgMemberDetail,
    Tab,
    TabItem,
    AddTaskChild,
    BScroll,
    detailMember
  },
  props: {},
  data() {
    return {
      heightStyle: " height: " + window.innerHeight + "px ",
      title: this.$route.query.title,
      currentIndex: 1,
      transCardId: " ",
      transRouting: this.$route.query.routing,
      transtitle: this.$route.query.title,
      transboardId: this.$route.query.boardId,
      transListId: " ",
      activeNames: ["0"],
      chartHeight: { height: "440px" },
      taskChildArr: [],
      isRemind: false,
      buildFileUrl: [],
      taskLeader: [],
      taskTwo: [],
      taskLeaderValue: "",
      insertParams: {
        boardId: this.$route.query.boardId,
        listId: this.transListId,
        cardId: this.transCardId,
        routing: this.$route.query.routing,
        cardTitle: this.transtitle,
        val: "",
        members: "",
        prefixMsg: "",
        alertUserName: "",
        type: ""
      }
    };
  },
  computed: {},
  created() {
    //todo 这里还可以怎样获取index
    this.cardNum = this.$route.query.cardNum;
  },
  mounted() {
    this.loadCard();
    this.getPersonnelFile();
  },
  methods: {
    getImageUrl,
    changeStatus() {
      this.isRemind = !this.isRemind;
    },
    onItemClick(index) {
      this.currentIndex = index;
    },
    isPc() {
      return isPc();
    },
    getTaskMembers(arrchengrange) {
      this.uniqueMember = arrchengrange.trim().split(" ");
    },
    getMembers(arrcheng) {
      this.Members = arrcheng.trim().split(" ");
    },
    subtaskFuzerenRange(fuzeRange) {
      this.fuzerenRangearr = fuzeRange;
    },
    taskDetailChang() {},
    handleChange(val) {
      console.log(val);
    },
    getPersonnelFile() {
      let url = "/zingbiz/auth/user/getHrUserMapByCardUrlList";
      this.$http.get(url).then(res => {
        let buildFileUrls = res.data.data; //对象
        let values = [];
        Object.keys(buildFileUrls).forEach(key => {
          values.push(buildFileUrls[key]);
        });
        this.buildFileUrl = values;
        this.buildFileUrl.forEach((item, index) => {
          let buildFileUrl = item;
          if (this.cardUrl === buildFileUrl.cardUrl) {
            this.alertUserName = buildFileUrl.userName;
          }
        });
      });
    },
    //负责人前两个
    getLeaders(arr) {
      this.taskLeader = [];
      this.leaderTwo = [];
      for (let i = 0; i < arr.length; i++) {
        if (i < 2) {
          this.buildFileUrl.forEach((item, index) => {
            let buildFileUrl = item;
            if (arr[i] === buildFileUrl.cardUrl) {
              arr[i].headImg += buildFileUrl.headImg;
            }
          });
          //                   this.leaderTwo.push(arr[i].headImg)

          this.leaderTwo.push({
            value: arr[i].value,
            headImg: arr[i].headImg
          });
        }
        //赋值获取detail中负责人
        this.taskLeader.push({
          value: arr[i].value,
          headImg: arr[i].headImg
        });
        for (let i = 0; i < this.taskLeader.length; i++) {
          this.taskLeaderValue += this.taskLeader[i].value;
        }
      }
    },
    loadCard() {
      let url = "/ZingMH/ZDesk/card/mater/loadCards.action";
      this.$http
        .get(url, {
          params: {
            referenceId: this.$route.query.boardId,
            routing: this.$store.state.ui.userInfo.companyId,
            status: "start"
          }
        })
        .then(res => {
          this.taskChildArr = res.data.data;
          // this.scroll = new BScroll(this.$refs.wrapper, {
          //   probeType: this.probeType,
          //   click: this.click,
          //   scrollX: this.scrollX
          // });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.gantt-text {
  margin-left: 120px;
  margin-top: 50px;
  font-size: 15px;
  color: #efac18;
}

.el-collapse {
  .el-collapse-item {
    >>> .el-collapse-item__header {
      padding-left: 15px;
      font-size: 15px;
    }

    >>> .el-collapse-item__content {
      padding-left: 15px;

      .avatarWrap {
        display: inline-block;
        margin: 0 0 0px -40px;
      }

      .avatarWrap2 {
        display: inline-block;
        margin: 0 0 0px -40px;
      }
    }
  }
}

.ActivityCell {
  height: 48px;

  .ActivityCell2 {
    margin: 10px 0 10px 0;
    display: flex;
    padding-left: 15px;
    padding-right: 15px;

    span {
      display: inline-block;
      flex: 5;
      font-size: 16px;

      .ActivityR {
        margin-right: 10px;
      }
    }
  }
}

.detailSubtaskWrap {
  width: 100%;
  border-bottom: 1px solid gray;

  .foldContent {
    display: flex;
    marginar: 0 -15px 0 0;
  }

  .foldLeft {
    width: 50%;
  }

  .tag-group {
    padding: 0;
  }

  .chargeImg {
    display: flex;
    font-size: 14px;
    line-height: 53px;
  }

  .Subtitle {
    font-size: 15px;
    display: block;
    width: 100px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .foldRight {
    position: relative;
    overflow: hidden;
    text-align: -webkit-right;
    text-indent: 1em;
    flex: 1;

    .btnWrap, .markerWrap {
      .kaishi, .zhuanjiao, .markerStar, markerConsle {
        margin: 20px;
        width: 60px;
        height: 35px;
        font-size: 14px;
        padding: 3px;
        background-color: #35d5ff;
        border-radius: 4px;
        color: white;
      }

      .zhuanjiao {
        background-color: #ffa39a;
      }
    }

    .markerWrap {
      position: absolute;
      top: 26px;
      right: 0;
      height: 53px;
      line-height: 53px;

      .markerStar {
        background-color: #adadad;
        height: 20px;
        margin: 20px;
      }

      .markerConsle {
        background-color: #7ad7da;
        height: 20px;
        margin: 20px;
        padding: 3px;
        color: white;
      }
    }
  }

  .choceTimeContent {
    display: flex;
    margin: -10px 0;
    font-size: 14px;

    .choceTimeLeft {
      width: 50%;
      flex: 1;
      margin-left: -13px;

      .vux-datetime {
        div {
          p {
            margin-top: 10px;
          }
        }
      }

      .chosetimeTitle {
        white-space: nowrap;
        font-size: 14px;
      }

      .weui-cells {
        font-size: 14px;
        margin-left: -10px;
        margin-right: -10px;

        .weui-cell__ft {
          font-size: 14px;
          text-align: left;
          white-space: nowrap;
          padding-right: 0;
          position: relative;
        }

        .vux-cell-value {
          margin-left: -10px;
        }
      }
    }

    .choceTimeRight {
      flex: 1;
      font-size: 14px;

      .weui-cells {
        font-size: 14px;
      }
    }
  }
}

.TransferWrap {
  width: 70%;

  .select-scroll {
    overflow: auto;

    .select-content {
      height: 100%;
    }
  }

  input {
    border-radius: 3px;
    height: 30px;
    width: 95%;
    margin: 5px 0 0 -10px;
  }

  .selectUl {
    overflow: scroll;
    height: 150px;

    .selectLi {
      display: flex;
      background-color: #74a5fd;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      margin: 5px;

      span {
        font-size: 14px;
      }
    }
  }
}
</style>

 
               
              