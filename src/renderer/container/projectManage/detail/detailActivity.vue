<!--活动详情-->
<template>
    <div>
        <div class="activityAitema">
            <!--only three-->
            <template v-if="isMore">
                <GridCard v-for="(taskActivi,index) in onlyThreeFilterTaskActivits" :key="index">
                        <div slot="cardLeft" class="taskleft" v-if="taskActivi">
                            <!-- 真实头像 -->
                            <avatar :size="'large'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+taskActivi.createCardUrl.substring(0,2)+"/"+taskActivi.createCardUrl+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                        </div>
                        <div slot="cardRight" class="taskright" v-if="taskActivi">
                            <ul class="rightWrapper">
                                <li>
                                    <span class="personnel ">{{taskActivi.alertUserName}}</span>
                                    <span>{{taskActivi.prefixMsg}}</span>
                                    <!-- 目前只做了图片的区分，具体附件、或引用链接之类的其他需求没做判断 -->
                                    <div v-if="taskActivi.type === 'image'"><img :src="taskActivi.val" style="width:50px"></div>
                                    <div v-else class="ActivitValContent" v-html="taskActivi.val"></div>
                                    <div class="time">
                                        {{taskActivi.genTime}}
                                        <!--{{taskActivi.timeMsg}}-->
                                    </div>
                                </li>
                                <li>
                                    <div class="EdiOrDel">
                                        <!-- 编辑和删除需要实现 -->
                                        <span @click="editFunc(taskActivi.activitieId,taskActivi.val,taskActivi._routing)" v-if="taskActivi.type === 'comment'"> 编辑 </span>
                                        <span @click="delFunc(taskActivi.activitieId,taskActivi._routing)"
                                              v-if="taskActivi.type === 'comment' || taskActivi.type === 'image'"> 删除 </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                </GridCard>
                <div v-if="onlyThreeFilterTaskActivits" @click = "showMore" class="clickMore">点击查看更多</div>
             </template>
            <!--all-->
            <template v-if="!isMore">
                <GridCard v-for="(taskActivi,index) in filterTaskActivits" :key="index">
                <div slot="cardLeft" class="taskleft">
                    <!-- 真实头像 -->
                      <avatar :size="'large'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+taskActivi.createCardUrl.substring(0,2)+"/"+taskActivi.createCardUrl+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                </div>
               <div slot="cardRight" class="taskright">
                <ul class="rightWrapper">
                    <li>
                        <span class="personnel ">{{taskActivi.alertUserName}}</span>
                        <span>{{taskActivi.prefixMsg}}</span>
                        <!-- 目前只做了图片的区分，具体附件、或引用链接之类的其他需求没做判断 -->
                        <div v-if="taskActivi.type === 'image'"><img :src="taskActivi.val" style="width:50px"></div>
                        <div v-else class="ActivitValContent" v-html="taskActivi.val"></div>
                        <div class="time">
                            {{taskActivi.genTime}}
                            <!--{{taskActivi.timeMsg}}-->
                        </div>
                    </li>
                    <li>
                        <div class="EdiOrDel">
                            <!-- 编辑和删除需要实现 -->
                            <span @click="editFunc(taskActivi.activitieId,taskActivi.val,taskActivi._routing)" v-if="taskActivi.type === 'comment'"> 编辑 </span>
                            <span @click="delFunc(taskActivi.activitieId,taskActivi._routing)"
                                  v-if="taskActivi.type === 'comment' || taskActivi.type === 'image'"> 删除 </span>
                        </div>
                    </li>
                </ul>
              </div>
             </GridCard>
            </template>
        </div>
    </div>
</template>
<script>
import GridCard from "@/components/gridcard/GridCard";
import Tag from "@/components/tag/Tag";
import avatar from "@/components/avatar/Avatar";
import { deepClone } from "./../util";

export default {
  components: {
    GridCard,
    Tag,
    avatar
  },
  props: ["taskActivits", "updadeTaskActivits", "editTaskComment"],
  data() {
    return {
      isMore: true
    };
  },
  computed: {
    filterTaskActivits() {
      let taskActivits = deepClone(this.taskActivits);
      for (let i = 0; i < taskActivits.length; i++) {
        if (taskActivits[i].type === "image") {
          taskActivits[i].val = taskActivits[i].val.split(",")[2];
        }
      }
      return taskActivits;
    },
    onlyThreeFilterTaskActivits() {
      let arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(this.filterTaskActivits[i]);
      }
      return arr;
    }
  },
  watch: {},
  methods: {
    showMore() {
      this.isMore = false;
    },
    //编辑
    editFunc(activitieId, val, routing) {
      this.editTaskComment(activitieId, val, routing);
    },
    //删除
    delFunc(activitieId, routing) {
      let _this = this;
      this.$vux.confirm.show({
        title: "你确定要删除吗?",
        onConfirm() {
          let url = "/ZingMH/ZDesk/activity/mater/delActivity.action";
          let params = {
            activitieId: activitieId,
            routing: routing
          };
          _this.$http
            .get(url, { params: params })
            .then(res => {
              let TellDetail = true;
              _this.updadeTaskActivits(res.data, TellDetail);
              _this.$vux.toast.show({ text: "删除成功！", type: "success" });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.activityAitema {
    margin-right: 5px;

    .taskright {
        flex: 5;

        .rightWrapper>li {
            line-height: 25px;

            .ActivitValContent {
                word-wrap: break-word;
                word-break: break-all;
                background-color: whitesmoke;
                border-radius: 5px;
            }
        }
    }

    .clickMore {
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        background-color: #adadad;
        margin: 0 25px;
        height: 20px;
        line-height: 20px;
    }
}
</style>
