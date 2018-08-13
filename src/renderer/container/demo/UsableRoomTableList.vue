<template>
    <el-main class="all-border gantt-main" style="height:1000px;overflow:auto;background-color:#ddd">
        <div style="background-color:#E0E0E0;" class="all-border">
            <div style="background-color:#fff; width:200px; float:left;">
                <div style="background-color:#fff; height:50px " class="bottom-border">
                    <div style="display: flex; justify-content: center; align-items: center; height: 50px;"> <i class="el-icon-arrow-left"></i>&nbsp; 2018-04-16 &nbsp; <i class="el-icon-arrow-right" @click="goToNextMonth"></i></div>
                    <div  class="all-border scrollSync" ref="scrollTree" v-on:scroll.passive="onScrollTree" style="height:500px; overflow-y:auto ; background-color:#fff">
                        <div class="el-tree-node__content" style="padding-left: 0px;" v-for="roomType in roomTypeList" v-bind:key="roomType"> <span class="el-tree-node__label " style="padding-left:35px">  {{roomType}} </span></div>
                    </div>
                </div>
            </div>
           
            
            <div style="background-color:#fff; width:804px;float:left;position: relative;">
                <div ref="scrollDate" style="background-color:#fff;height:50px;color:#888;width:100%;overflow-x: auto;">
                    <div style="height:24px;padding: 5px;position: absolute">
                        {{currentYear}}年{{currentMonth + 1 }}月
                    </div>
                    <div style="height:24px;width:100%;position: relative;top:20px">
                        <div class="text-center no-border" v-bind:style="{ 'left':index*38+'px'}" v-for="(item,index) in testDate1" v-bind:key="item" style="width:38px;height:24px;position:absolute ">{{ getDateDay(item) }}</div>
                    </div>
                </div>
                <div style=" width: 800px;height: 500px;overflow-y:auto;position: relative" v-if="roomTypeList.length > 0" ref="scrollGantt"  v-on:scroll.passive="onScrollGantt" >
                    <div class=" top-border right-border"  v-bind:style="{ 'left':index*38+'px',height:(roomTypeList.length) * 50 + 'px'}" v-for="(date,index) in testDate1"
                        v-bind:key="date" style="width:38px; border-top:1px solid #ddd;position:absolute ;top: 0px;"  >
                            <div v-for="(type,index) in roomTypeList"  v-bind:key="type" style="border-top: 1px solid rgb(221, 221, 221);height:50px">
                            <div style="top: 22px;position: relative;left: 10px;" v-if="index%2!=0">  {{getTypeInfo(type,date).reservation}} </div>
                            <div style="top: 22px;position: relative;left: 10px;" v-else>  {{getTypeInfo(type,date).all-getTypeInfo(type,date).reservation}} </div>
                            </div>
                    </div>
                   
                </div>
                 <div style=" width: 800px;height: 500px;overflow-y:auto;position: relative" class="top-border scrollSync" v-else> 没有房间类型 </div>
            </div>


        </div>
    </el-main>
</template>

<script>
import _ from "lodash";
import { debug } from "util";
var getYear = require("date-fns/get_year");
var getMonth = require("date-fns/get_month");
var getDateDay = require("date-fns/get_date");
var isLastDayOfMonth = require("date-fns/is_last_day_of_month");
var eachDay = require("date-fns/each_day");
var format = require("date-fns/format");

var isSaturday = require("date-fns/is_saturday");
var isSunday = require("date-fns/is_sunday");

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
      leftScroll: {},
      scrollTop: 0,
      clickTreeNodeInfo: {},
      testDate1: everyDay,
      testDate2: _.range(12),
      testCount3: [],
      startDate: "2018-03-01",
      endDate: "2018-03-22",
      roomTypeList: [],
      usableRoomList: {},
      currentYear: 0,
      currentMonth: 0
    };
  },
  created() {
    this.loadOrigin();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      let clickTreeNodeInfo;
      clickTreeNodeInfo = this.clickTreeNodeInfo = data;
      let treeNodeIdArr = [];
      if (!_.isNaN(clickTreeNodeInfo.children)) {
        _.each(clickTreeNodeInfo.children, function(v, k) {
          treeNodeIdArr.push(v.$treeNodeId);
        });
        _.each(this.testCount3, (v, k) => {
          _.each(treeNodeIdArr, treeNodeId => {
            if (treeNodeId - 1 == v.index) {
              if (v.isShow == false) {
                this.$set(this.testCount3, k, { index: k, isShow: true });
                v.isShow = true;
              } else {
                this.$set(this.testCount3, k, { index: k, isShow: false });
                v.isShow = false;
              }
            }
          });
        });
      }
      console.log(testCount3);
    },
    loadOrigin(params) {
      this.currentYear = currentYear;
      this.currentMonth = currentMonth;
      if (_.isUndefined(params)) {
        params = {};
        params.startYear = this.currentYear;
        params.startMonth = this.currentMonth;
        params.startDay = currentDay;
        params.endMonth = nextMonth();
        params.endYear = nextYear;
        params.endDay = nextDay();
      }
      debugger;
      this.$http
        .post("/zingbiz/hotel/hotelNew/getUsableRoomList", params)
        .then(res => {
          console.log("-------可用房LIST--------");
          console.log(res);
          this.usableRoomList = res.data.data;
          this.roomTypeList = [];
          _.each(res.data.data, v => {
            _.each(v, json => {
              this.roomTypeList.push(json.roomType + "(可售数)");
              this.roomTypeList.push(json.roomType + "(预定数)");
            });
            return false;
          });
        });
    },
    onScrollTree(scroll) {
      console.log(scroll.srcElement.scrollTop);
      this.$refs.scrollGantt.scrollTo(0, scroll.srcElement.scrollTop);
    },
    onScrollGantt(scroll) {
      console.log(scroll.srcElement);
      this.$refs.scrollTree.scrollTo(0, scroll.srcElement.scrollTop);

      this.$refs.scrollDate.scrollTo(scroll.srcElement.scrollLeft, 0);
    },
    getDateDay(date) {
      return getDateDay(date);
    },
    getTypeInfo(type, date) {
      var result = {};
      let stringDate = format(date, "YYYY-MM-DD");
      let type2 = type.substring(0, type.indexOf("("));

      console.log(type2);
      _.each(this.usableRoomList, (usableRoom, localdate) => {
        if (stringDate === localdate) {
          _.each(usableRoom, value => {
            if (value.roomType === type2) {
              result = value;
              return false;
            }
          });
          return false;
        }
      });
      return result;
    },
    goToNextMonth() {
      if (currentMonth == 11) {
        currentMonth = 1;
        currentYear++;
        this.currentYear = currentYear;
      } else {
        currentMonth++;
        this.currentMonth = currentMonth;
      }

      if (isLastDayOfMonth(currentDay)) {
        currentDay--;
      }
      debugger;
      // let nextMonth = nextMonth();
      // let nextDay = nextDay()();
      this.testDate1 = eachDay(
        new Date(currentYear, currentMonth, currentDay),
        new Date(nextYear, nextMonth(), nextDay())
      );
      let params = {};
      params.startYear = currentYear;
      params.startMonth = currentMonth;
      params.startDay = currentDay;
      params.endMonth = nextMonth();
      params.endYear = nextYear;
      params.endDay = nextDay();
      this.loadOrigin(params);
      console.log(this.testDate1);
    }
  },
  computed: {
    dateArray: {
      get() {
        let start = new Date(this.startDate);
        let end = new Date(this.endDate);
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
        for (i in _.range(12)) {
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
  }
};
</script>


<style scoped>
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
