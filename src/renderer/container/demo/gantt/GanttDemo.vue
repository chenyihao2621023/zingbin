<template>
    <el-main class="all-border gantt-main" style="height:1000px;overflow:auto;background-color:#ddd">
        <div style="background-color:#E0E0E0;" class="all-border">
            <div style="background-color:#fff; width:200px; float:left;">
                <div style="background-color:#fff; height:50px " class="bottom-border">
                    <div style="display: flex; justify-content: center; align-items: center; height: 50px;">{{title}}</div>
                    <div  class="all-border scrollSync" ref="scrollTree" v-on:scroll.passive="onScrollTree" :style="'height:'+LineHeight + ' overflow-y:auto ; background-color:#fff '">
                     
                        <el-tree :data="ganttOldData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all style=""></el-tree>
                    </div>
                </div>
            </div>


            <div :style="' background-color:#fff; width:'+ganttWidth()+'px;float:left;position: relative;'">
                <div ref="scrollDate" style="background-color:#fff;height:50px;color:#888;width:100%;overflow-x: auto;">
                    <div style="height:24px;padding: 5px;position: absolute;">
                        {{getYear(startDate)}}年{{getMonth(startDate)+1}}月
                    </div>
                    <div style="height:24px;width:100%;position: relative;top:20px">
                        <div class="text-center no-border" v-bind:style="{ 'left':index*38+'px'}" v-for="(item,index) in ganttDate" v-bind:key="item" style="width:38px;height:24px;position:absolute ">{{getDate(item)}}</div>
                    </div>
                </div>
                <!--   position: relative ?????? -->
                <div :style=" ' width:'+ganttWidth()+'px;'+'height:'+LineHeight+'overflow-y:auto;position: relative;overflow-x:auto '" ref="scrollGantt"  v-on:scroll.passive="onScrollGantt" class="top-border scrollSync">
                    <!-- <div style="position: relative;    height: 22px"></div> -->

                    <div v-for="(row) in ganttTaskArr" v-show="row.isShow"  v-bind:style="{width:ganttDate.length*38+'px'}" v-bind:key="row" style="height:50px">
                        <div class="gantt-task-background planGantt"   v-bind:style="{ 'left':getTaskPlan(row).beginSize*38+'px','width':getTaskPlan(row).size*38+'px'}"  ></div>

                        <div class="gantt-task-background trueGantt" v-bind:style="{ 'left':getTruePlan(row).beginSize*38+'px','width':getTruePlan(row).size*38+'px'}" ></div>
                    </div>
                    <span v-if="ganttTaskArr.length == 0" class="el-tree__empty-text">暂无数据</span>
                    <div class="ganttTaskDateLine">
                    <!-- <div v-for="(row) in testDate2" v-bind:key="row" >   -->
                      {{item}}
                    <div v-if="!isSameDay(currentDate,item)" ref="taskLine" :class=" getDay(item) >4  ? 'gantt-time-no-work':'' "  class="taskLine top-border right-border" v-bind:style="{ 'left':index*38 +'px',height:LineHeight}" v-for="(item,index) in ganttDate"
                        v-bind:key="item" style="width:38px; border-top:1px solid #ddd;position:absolute;top: 0px;">
                    </div>
                    <div v-else ref="taskLine" :class="getDay(item) >4  ? 'gantt-time-no-work gantt-foreground-col-current-date':'gantt-foreground-col-current-date' "  class="taskLine top-border right-border" v-bind:style="{ 'left':index*38 +'px',height:LineHeight}" v-for="(item,index) in ganttDate"
                        v-bind:key="item" style="width:38px;border-top:1px solid #ddd;position:absolute;top: 0px;">
                    </div>
                    </div>
                    <!-- </div> -->
                </div>
            </div>


        </div>
    </el-main>
</template>

<script>
import _ from "lodash";
import { debug, debuglog } from "util";
var getYear = require("date-fns/get_year");
var getMonth = require("date-fns/get_month");
var getDateDay = require("date-fns/get_date");
var isLastDayOfMonth = require("date-fns/is_last_day_of_month");
var eachDay = require("date-fns/each_day");
var format = require("date-fns/format");

var isSaturday = require("date-fns/is_saturday");
var isSunday = require("date-fns/is_sunday");

var getDay = require("date-fns/get_day");
var isDate = require("date-fns/is_date");
var isAfter = require("date-fns/is_after");
var isBefore = require("date-fns/is_before");
var isSameDay = require("date-fns/is_same_day");

var currentDate = new Date();
var currentYear = getYear(currentDate);
var currentMonth = getMonth(currentDate);
var currentDay = getDateDay(currentDate);
var nextYear = currentYear;

var nextMonth = function() {
  var nextMonth;
  if (currentMonth === 12) {
    nextYear = currentYear + 1;
    nextMonth = 1;
  } else {
    nextMonth = currentMonth + 1;
  }
  return nextMonth;
};
var nextDay = function() {
  var nextDay;
  isLastDayOfMonth(currentDay)
    ? (nextDay = currentDay - 1)
    : (nextDay = currentDay);
  return nextDay;
};

var everyDay = eachDay(
  new Date(currentYear, currentMonth, currentDay),
  new Date(nextYear, nextMonth(), nextDay())
);

export default {
  data() {
    return {
      title: this.$route.query.title || "无标题",
      allCardData: {}, //全部card数据
      ganttOldData: [],
      ganttTaskArr: [],
      LineHeight: "",
      leftScroll: {},
      scrollTop: 0,
      scrollLeft: 0,
      clickTreeNodeInfo: {},
      ganttDate: [],
      currentDate: new Date(),
      testDate2: _.range(32),
      testCount3: [],
      startDate: new Date(),
      endDate: new Date("2016-01-01"), // todo + 1 mounth

      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.loadTrelloData();
    this.initOriginOldDate();
    // this.vueGanttFormar();
  },
  methods: {
    ganttWidth() {
      let innerWidth = window.innerWidth * 0.7;
      return innerWidth > 500 ? window.innerWidth - 444 : innerWidth;
    },
    ganttHeight() {
      // let innerWidth = window.innerWidth * 0.7;
      // return innerWidth > 500 ? window.innerWidth - 444 : innerWidth;
      return "height:" + (window.innerHeight - 180) + "px;";
    },
    // loadTrelloData() {
    //   //
    //   let url =
    //     "https://easy-mock.com/mock/5ae04c76e684aa4fdeb4d0d2/gantt/gantt";
    //   this.$http
    //     .get(url, {})
    //     .then(res => {
    //       let data = res.data.data;
    //       console.log(res.data.data);
    //       _.each(data.contactListData, function(v) {
    //         if (v.startTime == undefined) v.startTime = "0000-00-00";
    //         if (v.endTime == undefined) v.endTime = "0000-00-00";
    //       });
    //       this.allCardData = data;
    //       this.ganttDataFormat(data);
    //       this.vueGanttFormar();
    //     })
    //     .catch(err => {});
    // },
    loadTrelloData() {
      // //
      let url = "/ZingMH/ZDesk/card/mater/loadAllContact.action";
      this.$http
        .get(url, {
          params: {
            routing: this.$route.query.routing,
            listRouting: this.$route.query.routing,
            referenceId: this.$route.query.boardId
          }
        })
        .then(res => {
          let data = res.data;

          _.each(data.contactListData, function(v) {
            if (v.startTime == undefined) v.startTime = "0000-00-00";
            if (v.endTime == undefined) v.endTime = "0000-00-00";
          });
          this.allCardData = data;
          this.ganttDataFormat(data);
          this.vueGanttFormar();
          console.log(this.ganttOldData);
        })
        .catch(err => {});
    },
    vueGanttFormar() {
      let $treeNodeId = 0;
      _.each(this.ganttOldData, v => {
        v.label = v.name;
        v.isShow = true;
        if (!_.isUndefined(v.series)) {
          v.children = [];
          _.each(v.series, vv => {
            if (vv.name !== "总览") {
              v.children.push(vv);
            }
          });

          _.each(v.series, vv => {
            vv.$treeNodeId = $treeNodeId;
            $treeNodeId++;
            if (!_.isUndefined(vv.plan.start)) {
              vv.plan.start = new Date(vv.plan.start);

              if (isBefore(vv.plan.start, this.startDate)) {
                this.startDate = vv.plan.start;
              }
            }
            if (!_.isUndefined(vv.true.start)) {
              vv.true.start = new Date(vv.true.start);
              if (isBefore(vv.true.start, this.startDate)) {
                this.startDate = vv.true.start;
              }
            }
            if (!_.isUndefined(vv.plan.end)) {
              vv.plan.end = new Date(vv.plan.end);
              if (isAfter(vv.plan.end, this.endDate)) {
                this.endDate = vv.plan.end;
              }
            }
            if (!_.isUndefined(vv.true.end)) {
              vv.true.end = new Date(vv.true.end);
              if (isAfter(vv.true.end, this.endDate)) {
                this.endDate = vv.true.end;
              }
            }
            this.ganttTaskArr.push(vv);
            vv.label = vv.name;
            vv.isShow = true;
          });
        }
        this.LineHeight = this.ganttTaskArr.length * 50 + "px";
        // this.LineHeightMax = this.ganttTaskArr.length * 50 + "px";
      });
      if (
        isBefore(this.endDate, this.startDate) ||
        this.getDayBetweenDay(this.startDate, this.endDate).length < 30
      ) {
        this.endDate = new Date(
          getYear(this.startDate),
          getMonth(this.startDate) + 1,
          getDateDay(this.startDate)
        );
      }
      (this.ganttDate = this.getDayBetweenDay(this.startDate, this.endDate)),
        console.log(
          ` this.startDate` + this.startDate + ` this.endDate` + this.endDate
        );
      // debugger;
      console.log(this.ganttTaskArr);
    },
    ganttDataFormat(data) {
      try {
        var ganttDataGod = [];
        var ganttData = [];
        _.each(data.contactListData, function(v, k) {
          var expectedStartTime = v.expectedStartTime || "";
          var expectedEndTime = v.expectedEndTime || "";
          var startTime = v.startTime || "";
          var endTime = v.endTime || "";
          var tempJSON = {};
          tempJSON.id = v.listId;
          tempJSON.cardId = v.cardId;
          tempJSON.listId = v.listId;
          tempJSON.order = v.order || 0;
          tempJSON.plan = [];
          tempJSON.plan.start = new Date(
            expectedStartTime.substr(0, expectedStartTime.indexOf(" "))
          );
          tempJSON.plan.end =
            new Date(expectedEndTime.substr(0, expectedEndTime.indexOf(" "))) ||
            "";
          tempJSON.true = [];
          tempJSON.true.start =
            new Date(startTime.substr(0, startTime.indexOf(" "))) || "";
          tempJSON.true.end =
            new Date(endTime.substr(0, endTime.indexOf(" "))) || "";
          tempJSON.handlingStatus = true; //组件内部数据 默认 true
          tempJSON.isMilestone = v.isMilestone || "false"; //组件内部数据 默认 true
          /**
           * 添加激活逻辑
           * 没有激活:不画甘特图
           */
          if (
            typeof v.handlingStatus == "string" &&
            v.handlingStatus == "noBegin"
          ) {
            //未激活
            tempJSON.handlingStatus = false;
            if (tempJSON.true.start != "Invalid Date") {
              tempJSON.true.start == new Date("0000-00-00");
            }
            if (tempJSON.true.end != "Invalid Date") {
              tempJSON.true.end == new Date("0000-00-00");
            }
          } else if (
            typeof v.handlingStatus == "string" &&
            v.handlingStatus == "noBegin"
          ) {
            //已激活
            if (tempJSON.true.end == "Invalid Date") {
              tempJSON.true.end == new Date(); //已激活,但是未给出实际结束时间默认为当前:'客户端'系统系统时间
            }
          }

          ganttData.push(tempJSON);
        });
        _.each(data.listData, (v, k) => {
          _.each(ganttData, (vv, kk) => {
            if (vv.id == v.listId) {
              vv.name = v.title;
            }
          });
        });
        return this.sortDataByCardId(ganttData);
      } catch (error) {
        console.error(error);
      }
    },
    sortDataByCardId(data) {
      try {
        var sortByCardIdJson = {};
        var sortByCardIdArr = [];
        _.each(data, (v, k) => {
          if (typeof sortByCardIdJson[v.cardId] === "undefined") {
            sortByCardIdJson[v.cardId] = {};
            sortByCardIdJson[v.cardId].name = this.searchNameById(v.cardId);
            sortByCardIdJson[v.cardId].id = Math.random();
            sortByCardIdJson[v.cardId].cardId = v.cardId;
            sortByCardIdJson[v.cardId].listId = v.listId;
            sortByCardIdJson[v.cardId].order = v.order || 0;
            sortByCardIdJson[v.cardId].boardId = this.searchBoardIdByCardId(
              v.cardId
            );
            sortByCardIdJson[v.cardId].isMilestone = v.isMilestone;
            sortByCardIdJson[v.cardId].link =
              "/SRender?jsLoader=trello%2FcardListLoader&tpl=trello%2FcardList&boardId=" +
              sortByCardIdJson[v.cardId].boardId +
              "&cardId=" +
              sortByCardIdJson[v.cardId].cardId +
              "&routing=" +
              "testCompanyId" +
              "&mhMenuKey_=09--";
            sortByCardIdJson[v.cardId].series = [];
            sortByCardIdJson[v.cardId].series.push(v);
          } else {
            sortByCardIdJson[v.cardId].series.push(v);
          }
        });

        _.each(sortByCardIdJson, (v, k) => {
          v.series = this.getMaxAndMinDate(
            v.series,
            sortByCardIdJson[v.cardId]
          );
          v.series = _.sortBy(v.series, d => {
            return d.order;
          });

          sortByCardIdArr.push(v);
        });
        console.log("==============");
        console.log(sortByCardIdArr);
        this.ganttOldData = sortByCardIdArr;
        return sortByCardIdArr;
      } catch (error) {
        console.error(error);
      }
    },
    searchNameById(id) {
      var name = "未识别";
      _.each(this.allCardData.cardData, (v, k) => {
        if (v.cardId == id) {
          name = v.title;
        }
      });
      return name;
    },
    searchBoardIdByCardId(id) {
      var boardId = "";
      _.each(this.allCardData.cardData, (v, k) => {
        if (v.cardId == id) {
          boardId = v.boardId;
        }
      });
      return boardId;
    },
    getMaxAndMinDate(ganttData, sortByCardIdJson) {
      try {
        var newDate = new Date();
        var planDate = { start: newDate, end: newDate };
        var trueDate = { start: new Date("0000-00-00"), end: newDate };
        var newGanttData = _.extend([], ganttData);
        _.each(newGanttData, (v, k) => {
          if (k == 0) {
            planDate.start = v.plan.start;
            planDate.end = v.plan.end;
            if (v.handlingStatus) {
              if (v.true.end != "Invalid Date") trueDate.start = v.true.start;
              trueDate.end = v.true.end;
            }
          } else {
            if (v.plan.start != "Invalid Date") {
              if (planDate.start == "Invalid Date") {
                planDate.start = v.plan.start;
              } else if (isBefore(v.plan.start, planDate.start)) {
                planDate.start = v.plan.start;
              }
            }
            if (v.plan.end != "Invalid Date") {
              if (planDate.end == "Invalid Date") {
                planDate.end = v.plan.end;
              } else if (isAfter(v.plan.end, planDate.end)) {
                planDate.end = v.plan.end;
              }
            }
            if (
              v.true.start != "Invalid Date" &&
              v.handlingStatus &&
              v.true.end != "Invalid Date"
            ) {
              if (trueDate.start == "Invalid Date") {
                trueDate.start = v.true.start;
              } else if (isBefore(v.true.start, trueDate.start)) {
                trueDate.start = v.true.start;
              }
            }
            if (v.true.end != "Invalid Date" && v.handlingStatus) {
              if (trueDate.end == "Invalid Date") {
                trueDate.end = v.true.end;
              } else if (isAfter(v.true.end, trueDate.end)) {
                trueDate.end = v.true.end;
              }
            }
          }
        });
        // sortByCardIdJson.plan = planDate;
        // sortByCardIdJson.true = trueDate;
        // sortByCardIdJson.order = -1;

        newGanttData.unshift({
          cardId: Math.random() + "",
          id: Math.random() + "",
          name: "总览",
          plan: planDate,
          true: trueDate,
          order: -1
        });

        return newGanttData;
      } catch (error) {
        console.error(error);
      }
    },

    handleNodeClick(data) {
      console.log(data);
      let clickTreeNodeInfo;
      clickTreeNodeInfo = this.clickTreeNodeInfo = data;
      let treeNodeIdArr = [];
      if (!_.isNaN(clickTreeNodeInfo.children)) {
        _.each(clickTreeNodeInfo.children, function(v, k) {
          treeNodeIdArr.push(v.$treeNodeId);
        });
        _.each(this.ganttTaskArr, (v, k) => {
          _.each(treeNodeIdArr, treeNodeId => {
            if (treeNodeId == v.$treeNodeId) {
              if (v.isShow == false) {
                this.$set(
                  this.ganttTaskArr,
                  k,
                  _.extend(v, { index: k, isShow: true })
                );
                v.isShow = true;
              } else {
                this.$set(
                  this.ganttTaskArr,
                  k,
                  _.extend(v, { index: k, isShow: false })
                );
                v.isShow = false;
              }
            }
          });
        });
      }
      // console.log(this.ganttTaskArr);
    },
    onScrollTree(scroll) {
      console.log(scroll.srcElement.scrollTop);
      this.$refs.scrollGantt.scrollTo(
        this.scrollLeft,
        scroll.srcElement.scrollTop
      );
    },
    onScrollGantt(scroll) {
      this.scrollLeft = scroll.srcElement.scrollLeft;
      this.$refs.scrollGantt.scrollTo(
        this.scrollLeft,
        scroll.srcElement.scrollTop
      );
      this.$refs.scrollTree.scrollTo(0, scroll.srcElement.scrollTop);
      this.$refs.scrollDate.scrollTo(this.scrollLeft, 0);
    },
    getTaskPlan(row) {
      // debugger;
      if (!_.isUndefined(row.plan.start) && !_.isUndefined(row.plan.end)) {
        let size = this.getDayBetweenDay(row.plan.start, row.plan.end).length;
        console.log(size);
        let beginSize = this.getDayBetweenDay(this.startDate, row.plan.start)
          .length;
        return { beginSize: beginSize - 1, size: size };
      } else {
        return { beginSize: 0, size: 0 };
      }
    },
    getTruePlan(row) {
      if (!_.isUndefined(row.true.start) && !_.isUndefined(row.true.end)) {
        let size = this.getDayBetweenDay(row.true.start, row.true.end).length;
        let beginSize = this.getDayBetweenDay(this.startDate, row.true.start)
          .length;
        return { beginSize: beginSize - 1, size: size };
      } else {
        return { beginSize: 0, size: 0 };
      }
    },
    isSameDay(date1, date2) {
      return isSameDay(date1, date2);
    },
    getDay(date) {
      return getDay(date);
    },
    getDate(date) {
      return getDateDay(date);
    },
    getDayBetweenDay(start, end) {
      return eachDay(start, end);
    },
    getYear(date) {
      return getYear(date);
    },
    getMonth(date) {
      return getMonth(date);
    },
    initOriginOldDate() {
      // this.ganttOldData = [];
    }
  },
  computed: {
    dateArray: {
      get() {
        let start = this.startDate;
        let end = this.endDate;
        var date_difference_days = (end - start) / (3600 * 24 * 1000);
      }
    },
    xxx: {
      get(key) {
        alert(key);
        return "gantt-time-no-work";
      }
    },
    testCount: {
      get() {
        let arr = [];
        let i;
        for (i in _.range(32)) {
          let map = {};
          map.index = ~~i;
          map.isShow = true;
          arr.push(map);
        }
        this.testCount3 = arr;
        return arr;
      },
      set(index, val) {}
    }
  },
  mounted() {
    // this.leftScroll = this.$refs.scrollLeft;
    // console.log(this.leftScroll);
    // this.leftScroll.addEventListener(
    //   "scroll",
    //   () => {
    //     console.log("scroll" + this.$refs.leftScroll.scrollTop);
    //   },
    //   false
    // );
  },
  watch: {
    ganttTaskArr(newArr, oldArr) {
      let count = 0;
      _.each(newArr, v => {
        if (v.isShow) {
          count++;
        }
      });
      if (count < 10) count = 10;
      // this.LineHeight = count * 50 + "px";
    }
  }
};
</script>


<style scoped>
.gantt-foreground-col-current-date {
  background-color: #fff;
}
.gantt-tast-hover {
  background-color: #f5f7fa;
}
.planGantt {
  background-color: #63acf7;
  height: 1em;
  position: relative;
  top: 8px;
  z-index: 10;
}
.trueGantt {
  background-color: rgb(34, 215, 187);
  height: 1em;
  position: relative;
  left: 38px;
  top: 12px;
  z-index: 10;
}
.taskLine {
}
.el-progress-bar__outer {
  color: #fff;
}

.gantt-main {
  font-family: "Helvetica Neue", "Hiragino Sans GB", stheiti, "Microsoft Yahei",
    "微软雅黑", tahoma, sans-serif;
}

.all-border {
  border: 1px solid #ddd;
}

.top-border {
  border-bottom: 1px solid #ddd;
}

.right-border {
  border-right: 1px solid #ddd;
}

.no-border {
  border-right: 0px solid #ddd;
}

.gantt-time-no-work {
  opacity: 1;
  background: url(https://zinglas.worktile.com/image/app/gantt/gantt-rest-bg.png);
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
.el-progress-bar__outer {
  color: #fff;
}

.el-tree-node__content {
  height: 50px;
}
</style>


<style>
</style>
