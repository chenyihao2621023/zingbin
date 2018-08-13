<template>
    <el-main>
         <el-button @click="read">doorCard</el-button>
         <el-button @click="readIdCard">idCard</el-button>
         <el-button @click="writeDoorCard">writeDoorCard</el-button>
        <!--detail-->
        <taskDetail
            :loadingSelf = "true"
            :showTaskDetail="false"
            :showTaskDetailHead="false"
            :transCardId="transCardId"
            :transRouting= "transRouting"
            :transtitle="transtitle"
            :transboardId="transboardId"
            :transListId="transListId"

            :scrollContentHeight="taskContentHeight"
            :clickEmojiOrClickMore="true"
            @taskDetailChang="taskDetailChang">  <!--图片1、附件2、评论3 -->
        </taskDetail>
    </el-main>
</template>

<script>
import _ from "lodash";
import NatAppHelper from "@/utils/nativeAppHelper";
import taskDetail from "../taskManage/taskDetail";

export default {
  components: {
    taskDetail
  },
  data() {
    return {
      transCardId: "92339256000000101", // 92示例
//        transCardId: "88175730000001101",  //111示例
//      transCardId: "",
      transRouting: "company73570929000000101", //92示例
//        transRouting: "company59915700000000101", //111示例
//      transRouting: "",
        transtitle: "哈哈哈",
        transboardId:"",
        transListId: "",
        taskContentHeight:"0"
    };
  },
  created() {},
   mounted() {
        //获取当前窗口高度
        let a = document.body.clientHeight;
        //获取人员内容区域高度
        let b = document.getElementById("wfContent").offsetHeight;
        this.taskContentHeight = a-(b+224);
    },
  methods: {
    taskDetailChang(a, b) {
      console.log("aaaaa", a, b);
    },
    read() {
      NatAppHelper.readDoorCard("192.168.18.15");
    },
    readIdCard() {
      NatAppHelper.readIdCard("192.168.18.15", idCardInfo => {
        console.log(idCardInfo);
      });
    },
    /**@augments
     * BeginDate：字符型数据，有效日期(年、月、日、时、分)
      12 位的数字字符(YYYYMMDDhhmm)
      EndDate：字符型数据,有效日期(年、月、日、时、分)
      12 位的数字字符(YYYYMMDDhhmm)
      200509011200 代表 2005年9月1日12点00分
      CardNo：字符型数据,返回卡号 8位数字字符(1-16777215)
      BuildNo：数值型数据,楼号 1－99
      FloorNo：数值型数据,层号 1－99
      RoomNo：字符型数据,房间号码,4位数字字符(如0101房)，*如果房间号码为0000,函数会认为是注销卡片,会清除卡片上的数据
      Name：客人姓名
     */

    /**taskDetail组件
     :loadingSelf = "true" 是否自己加载数据，引用组件需要传true
     :showTaskDetail="true" 是否展示全部taskdetail组件
     :showTaskDetailHead="false" 是否展示taskedetail组件头部
     @taskDetailChang="taskDetailChang">  <!--图片1、附件2、评论3 -->
     */
    writeDoorCard() {
      NatAppHelper.writeDoorCard("192.168.18.15", {
        beginDate: "201809011200",
        endDate: "201809011200",
        buildNo: "123",
        name: "zwd",
        roomNo: "0101",
        floorNo: "12",
        buildNo: "12",
        cardNo: "00000009",
        cardId: "787#787"
      });
    }
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
    /*.demo{*/
        /*position: relative*/
   /*}*/
        /*.detailWrap {*/
           /*.detailChatWrap {*/
               /*height: 50px;*/
               /*position: fixed;*/
               /*bottom: 0;*/
               /*left: 0;*/
               /*right: 0;*/
          /*}*/
        /*}*/
</style>
