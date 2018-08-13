<!--活动详情-->
<template>
     <div class="taskManageActivity">
            <!--only three-->
             <div v-if="isMore">
                <GridCard v-for="(taskActivi,index) in onlyThreeFilterTaskActivits" :key="index">
                    <div slot="cardLeft" class="detailActivityTaskleft" v-if="taskActivi">
                        <!-- 真实头像 -->
                        <avatar v-if="taskActivi.headImg" :size="'default'" shape="square" :src="getImageUrl(taskActivi.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                        <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                    </div>
                    <div slot="cardRight" class="detailActivityRight" v-if="taskActivi">
                            <div class="rightWrapper">
                                <span class="personnel ">{{taskActivi.userName}}</span>
                                <span v-if="taskActivi.prefixMsg == '添加评论' && taskActivi.editTime">（已编辑）</span>
                                <span v-if="taskActivi.prefixMsg !== '添加评论'">{{taskActivi.prefixMsg}}</span>
                                <span class="time">{{taskActivi.genTime}}</span>
                                <!-- 目前只做了图片的区分，具体附件、或引用链接之类的其他需求没做判断 -->
                                <div v-if="taskActivi.type === 'image'"><img :src='taskActivi.reserved1' style="width:50px" @click="fangDa(index)"></div>
                                <div v-else class="ActivitValContent">
                                     <p v-if="!taskActivi.isLinkUrl" v-html="taskActivi.val"></p>
                                     <p v-else @click="goNext(taskActivi.goCardId,taskActivi.goRouting,taskActivi.url)">
                                         {{taskActivi.text}}
                                     </p>
                                </div>
                                <div class="EdiOrDel">
                                    <span @click="editFunc(taskActivi.activitieId,taskActivi.val,taskActivi.routing)" v-if="taskActivi.type === 'comment' && taskActivi.cardUrl === cardUrl"> 编辑 </span>
                                    <span @click="delFunc(taskActivi.activitieId,taskActivi.routing)"
                                          EdiOrDel v-if="(taskActivi.type === 'comment' || taskActivi.type === 'image' || taskActivi.type === 'attachment') && taskActivi.cardUrl === cardUrl"> 删除 </span>
                                </div>
                            </div>
                        </div>
                </GridCard>
                <div class="taskManageClickMore">
                     <span v-if="filterTaskActivits.length > 3" @click = "showMore" class="taskManageClickMore2">点击查看更多</span>
                </div>
             </div>
            <!--all-->
            <div v-if="!isMore">
               <GridCard v-for="(taskActivi,index) in filterTaskActivits" :key="index">
                    <div slot="cardLeft" class="detailActivityTaskleft">
                        <!-- 真实头像 -->
                        <avatar v-if="taskActivi.headImg" :size="'default'" shape="square" :src="getImageUrl(taskActivi.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                        <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                    </div>
                    <div slot="cardRight" class="detailActivityRight">
                         <div class="rightWrapper">
                            <span class="personnel ">{{taskActivi.userName}}</span>
                            <span v-if="taskActivi.prefixMsg == '添加评论' && taskActivi.editTime">（已编辑）</span>
                            <span v-if="taskActivi.prefixMsg !== '添加评论'">{{taskActivi.prefixMsg}}</span>
                            <div v-if="taskActivi.type === 'image'"><img :src='taskActivi.reserved1' style="width:50px;height:50px" @click="fangDa(index)"></div>
                            <div v-else class="ActivitValContent">
                                <p v-if="!taskActivi.isLinkUrl" v-html="taskActivi.val"></p>
                                <p v-else @click="goNext(taskActivi.goCardId,taskActivi.goRouting,taskActivi.url)">
                                    {{taskActivi.text}}
                                </p>
                            </div>
                            <div class="time">{{taskActivi.genTime}}</div>
                            <div class="EdiOrDel">
                                <!-- 编辑和删除需要实现 -->
                                     <span @click="editFunc(taskActivi.activitieId,taskActivi.val,taskActivi.routing)" v-if="taskActivi.type === 'comment' && taskActivi.cardUrl === cardUrl"> 编辑 </span>
                                     <span @click="delFunc(taskActivi.activitieId,taskActivi.routing)"
                                          EdiOrDel v-if="(taskActivi.type === 'comment' || taskActivi.type === 'image' || taskActivi.type === 'attachment') && taskActivi.cardUrl === cardUrl"> 删除 </span>
                            </div>
                         </div>
                    </div>
               </GridCard>
            </div>
        </div>
</template>
<script>
import GridCard from "@/components/gridcard/GridCard";
import Tag from "@/components/tag/Tag";
import avatar from "@/components/avatar/Avatar";
import { deepClone } from "./../util";
import { getImageUrl } from "../../../utils/fn"

export default {
  components: {
    GridCard,
    Tag,
    avatar
  },
  props: ["taskActivits","updadeTaskActivits","editTaskComment","activityShow"],
  data() {
    return {
        isMore:true,
        onlyThreeFilterTaskActivits:[],
        filterTaskActivits:[],
        buildFileUrl:[],//服务号下已建档信息
        getPersonnelFileflag:true,
    };
  },
    computed: {
      cardUrl() {
        return this.$store.state.ui.userInfo.cardUrl;
      }
    },
    watch:{
        taskActivits() {
              if (this.getPersonnelFileflag) {
                this.getPersonnelFile()
              } else {
                this.getFilterTaskActivits()
              }
        },
    },
    mounted() {
      setTimeout(() => {
          this.$emit('scrollRefresh')
      },2000)
    },
    created() {
        this.companyId = this.$store.state.ui.userInfo.companyId
    },
    methods:{
      //放大图片
        fangDa(index) {
          this.activityShow(index)
        },
        goNext(goCardId,goRouting,url) {
//            window.location = url
//            /taskManage/taskList/taskDetail?taskCardId=${cardId}&taskRouting=${routing}
            let urlRouter = url.split("?")[0]
            this.$router.push({
                path: urlRouter,
                query: {
                    taskCardId: goCardId,
                    taskRouting: goRouting,
                }
            });
        },
        getImageUrl,
        //名字
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
                          this.getFilterTaskActivits()
                      })
                  this.getPersonnelFileflag = false
              }
        },
      showMore() {
         this.isMore = false
         this.$emit('scrollRefresh')
      },
        getFilterTaskActivits() {
            this.filterTaskActivits = deepClone(this.taskActivits);
            for (let i = 0; i < this.filterTaskActivits.length; i++) {
                if (this.filterTaskActivits[i].type === "attachment") {
                      let arr = this.filterTaskActivits[i].val.split(";")
                      let arr2 = arr[0].split(".")
                      let attachmentType = arr2[arr2.length-1]
                      if (attachmentType === 'jpg' || attachmentType === 'gif' || attachmentType === 'jpeg' || attachmentType === 'png' || attachmentType === 'svg'){
                          this.filterTaskActivits[i].type = 'image'
                      }
                    this.filterTaskActivits[i].val = arr[0]
                }
                //添加username属性,headImg属性
                this.buildFileUrl.forEach((item, index) => {
                    let buildFileUrl = item
                    if (this.filterTaskActivits[i].createCardUrl === buildFileUrl.cardUrl) {
                        this.filterTaskActivits[i].userName = buildFileUrl.userName
                        this.filterTaskActivits[i].headImg = buildFileUrl.headImg
                    }
                })
                //关联任务
                //判断val是否是链接
                this.filterTaskActivits[i].isLinkUrl = false
                if (this.filterTaskActivits[i] && this.filterTaskActivits[i].val.substr(0, 20) === "/ZingVue/index.html#") {
                    this.filterTaskActivits[i].isLinkUrl = true
                    this.filterTaskActivits[i].val = this.filterTaskActivits[i].val.substr(20)

                    let url = "/ZingMH/ZDesk/urlToTitle/loadByCategoryId_URL.action"
                    let params = {
                        link: this.filterTaskActivits[i].val,
                        routing: this.filterTaskActivits[i].routing
                    }
                    this.$http.get(url,{ params:params })
                        .then(res => {
                            this.filterTaskActivits[i].text = res.data.data[0].text
//                            this.filterTaskActivits[i].url = 'http://localhost/#' + res.data.data[0].url
                            this.filterTaskActivits[i].url = res.data.data[0].url
                            this.filterTaskActivits[i].goCardId = res.data.data[0].dataId
                            this.filterTaskActivits[i].goRouting = res.data.data[0]._routing
                            this.getOnlyThreeFilterTaskActivits()

                        })
                        .catch(err => {
                            console.log(err)
                        });
                }
            }
            this.getOnlyThreeFilterTaskActivits()
        },
        getOnlyThreeFilterTaskActivits() {
            let arr = []
            for (let i=0; i < 3; i++) {
                if (this.filterTaskActivits[i]) {
                    arr.push(this.filterTaskActivits[i])
                }
            }
            this.onlyThreeFilterTaskActivits = arr
            this.$emit('scrollRefresh')
        },
     //编辑
      editFunc(activitieId,val,routing) {
        this.editTaskComment(activitieId,val,routing)
      },
      //删除
      delFunc(activitieId,routing) {
        let _this = this
          this.$vux.confirm.show({
              title: "提示",
              content: "确认删除吗",
              onConfirm(){
                  let url = "/ZingMH/ZDesk/activity/mater/delActivity.action"
                  let params = {
                      activitieId: activitieId,
                      routing:routing
                  }
                  _this.$http.get(url,{ params:params })
                      .then(res => {
                          let TellDetail = true
                          //delete 删除 update 修改
                          let delOrUpdate = 'delete'
                          _this.updadeTaskActivits(activitieId,TellDetail,JSON.stringify({}),delOrUpdate)
                          _this.$vux.toast.show({text:"删除成功",type:"success"})
                      })
                      .catch(err => {
                          console.log(err)
                      });
              },
          })
      }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.taskManageActivity {
      .grid-card {
       border-bottom 0
       padding 13px 13px
       align-items flex-start
      }
        .detailActivityTaskleft {
            max-width: 50px;
            margin-right 13px
        }
        .detailActivityRight {
            flex: 5;
        .rightWrapper {
            position relative
            line-height: 25px;
            .personnel{
                text-indent -1.1em
                display inline-block
            }
            .time{
                position absolute
                top 0
                right 0
                text-indent initial
            }
            .EdiOrDel {
                position absolute
                right 5px
                text-indent -0.1em
                span {
                    margin-right 10px
                    text-decoration underline
                    color #40affc
                }
            }
            .ActivitValContent {
                text-indent -.01em
                border-radius: 5px;
                p{
                    font-size 13px
                    word-wrap break-word;
                    word-break break-all;
                    overflow hidden;
                }
            }
           }
    }
    .taskManageClickMore {
       height 20px
       line-height 20px
       display block
       text-align center
       color #40affc
       .taskManageClickMore2 {
           text-decoration underline
       }
}

}
</style>
