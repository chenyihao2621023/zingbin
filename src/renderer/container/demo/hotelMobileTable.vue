<template>

      <!--头部-->
      
     <!-- <scroll ref="scroll" :scrollbar="true"> -->
    <div style="height: 100% ;overflow:auto">
       <zing-head title="房间日志" :isComeBack="true"> </zing-head>
         <div>
             <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
          <tr>
            <th>动作</th>
            <th>原状态</th>
            <th>新状态</th>
            <th>操作时间</th>
            <th>操作人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log) in roomLogList" :key="log">
            <th>{{log.action}}</th>
            <th>{{log.originalStatus}}</th>
            <th>{{log.newStatus}}</th>
            <th>{{log.createTime}}</th>
            <th>{{log.optName}}</th>
          </tr>
        </tbody>
      </x-table>
         </div>
              
    </div>
     <!-- </scroll> -->
</template>

<script>
import _ from "lodash";
var format = require("date-fns/format");
import { mapState, mapMutations } from "vuex";
import ZingHead from "@/components/zingHead/ZingHead";
import {
  Flexbox,
  FlexboxItem,
  TransferDom,
  Popup,
  Radio,
  Group,
  Cell,
  XTable,
  LoadMore,
  XButton
} from "vux";
import Scroll from "@/components/scroll/Scroll";
export default {
  components: {
    Scroll,
    ZingHead,
    XTable,
    LoadMore,
    XButton
  },
  data: () => ({
    roomLogList: []
  }),
  created() {
    this.roomLogAction();
  },
  methods: {
    ...mapMutations({
      SET_HOTEL_LIST: "SET_HOTEL_LIST"
    }),

    roomLogAction(pageNumber) {
      debugger;
      let param = {};
      param.roomId = this.$route.query.roomId;
      param.pageNumber = pageNumber || 1;
      param.pageSize = "200";
      this.$httpSilent("/zingbiz/hotel/roomLog/getRoomLog", { params: param })
        .then(res => {
          this.roomLogList = res.data.data;
          this.roomLogTotal = ~~res.data.total;
          console.log(res);
          // this.roomLogDialog = false;
        })
        .catch(res => {
          console.error(res);
        });
    }
  },
  computed: {}
};
</script>


<style scoped>
.flex-demo {
  color: black;
  background-color: #20b907;
  border-radius: 4px;
  background-clip: padding-box;
  height: 94px;
  border: 1px solid #c5c3c3;
  position: relative;
}
.hotel-text {
  margin-left: 5px;
  margin-top: 5px;
}
.roomItem {
  padding: 3px;
}

.edit {
  height: 25px;
  text-align: center;
  margin-top: 15px;
  border-bottom: 1px solid rgba(58, 77, 118, 0.4);
}

.triangleTag {
  width: 0;
  height: 0;
  border-width: 30px;
  border-style: solid;
  border-top-right-radius: 5px;
  opacity: 0.8;
  border-color: #18c34d #18c34d transparent transparent;
  position: absolute;
  z-index: 10;
  right: 0;
  top: 0;
}
</style>

 