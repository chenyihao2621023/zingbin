<template>
    <div>
        <el-dialog title="制卡" :visible.sync="makeCardDialog" class="guestMakeCard" center :before-close="handleClose">
            <div class="cardContent">
                <br>
                <div style="height:130px;margin-top:15px;margin-left:25px;border: 1px solid #aaa;">
                            <div style="">
                                <div style="font-size:18px;">门卡号 : {{hotelDoorCard1.cardNo}}</div>
                                <div style="font-size:15px;">楼区号 : {{hotelDoorCard1.buildNo}}</div>
                                <div style="font-size:15px;">楼座号 : {{hotelDoorCard1.floorNo}}</div>
                                <div style="font-size:15px;">房间号 : {{hotelDoorCard1.roomNo}}</div>
                                <div style="font-size:15px;">结束日期 : {{hotelDoorCard1.endDate}}</div>
                            </div>
                </div>
                <!-- :model="form" -->
                <el-form ref="form" :model="hotelDoorCard" label-width="120px">

                    <!-- <el-form-item label="楼区号:">
                        <el-input style="width:200px" v-model="hotelDoorCard.buildNo"></el-input>
                    </el-form-item>
                    <el-form-item label="楼座号:">
                        <el-input style="width:200px" v-model="hotelDoorCard.floorNo"></el-input>
                    </el-form-item> -->
                    <el-form-item label="房间号:">
                        <el-input style="width:200px" v-model="hotelDoorCard.roomNo"></el-input>
                    </el-form-item>

                    <el-form-item label="结束日期:">
                       <!-- <el-date-picker v-model="hotelDoorCard.endDate" :picker-options="disableTime" type="date" value-format="yyyyMMdd" placeholder="选择日期">
                        </el-date-picker> -->

                        <el-date-picker  v-model="endDate" type="datetime" placeholder="选择日期时间" value-format="yyyyMMddHHmmss"> </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="readCard">读卡</el-button>
                        <el-button type="primary" @click="makeDoorCard">制卡</el-button>
                        <el-button type="primary" @click="clearCard">清卡</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
import NatAppHelper from "@/utils/nativeAppHelper";
var getYear = require("date-fns/get_year");
var getMonth = require("date-fns/get_month");
var getDateDay = require("date-fns/get_date");
var format = require("date-fns/format");

export default {
  props: {
    //传入列表的数据，必传
    makeCardDialog: {
      type: Boolean,
      default: false
    },
    hotelDoorCard: {
      type: Object,
      default: function() {
        return {
          cardNo: "",
          buildNo: "1",
          floorNo: "1",
          roomNo: "",
          startDate: "",
          endDate: ""
        };
      }
    }
  },
  data() {
    return {
      hotelDoorCard1: {
        cardNo: "",
        buildNo: "",
        floorNo: "",
        roomNo: "",
        startDate: "",
        endDate: ""
      },
      endDate: new Date()
    };
  },
  mounted() {
    let year = getYear(new Date());
    let mounth = getMonth(new Date());
    let day = getDateDay(new Date());
    this.endDate = new Date(year, mounth, day, 12);
  },
  methods: {
    readCard() {
      NatAppHelper.readDoorCard("192.168.1.101", cardInfo => {
        if (cardInfo.code === 1) {
          let info = cardInfo.data;
          let buildFloorRoomArr = info.roomNo.split("#");
          if (!_.isUndefined(info.endDate) && info.endDate != "") {
            var year = info.endDate.substring(0, 4);
            var month = info.endDate.substring(4, 6);
            var day = info.endDate.substring(6, 8);
            var hour = info.endDate.substring(8, 10);
            var minutes = info.endDate.substring(10, 12);
            info.endDate =
              year + "-" + month + "-" + day + " " + hour + ":" + minutes;
          }
          this.hotelDoorCard1 = info;
          this.hotelDoorCard1.buildNo = buildFloorRoomArr[0];
          this.hotelDoorCard1.floorNo = buildFloorRoomArr[1];
          this.hotelDoorCard1.roomNo = buildFloorRoomArr[2];
        } else {
          console.error("读卡失败");
        }

        console.log(cardInfo);
      });
    },
    makeDoorCard() {
      let endDate = "";
      if (_.isDate(this.endDate)) {
        endDate = format(this.endDate, "YYYYMMDDHHmm");
      } else {
        endDate = this.endDate.substring(0, 12);
      }
      this.hotelDoorCard.floorNo = "2";
      this.hotelDoorCard.buildNo = "1";
      if (
        _.isUndefined(this.hotelDoorCard.buildNo) ||
        this.hotelDoorCard.buildNo == ""
      ) {
        this.$message.error("请填写楼区");
      } else if (
        _.isUndefined(this.hotelDoorCard.floorNo) ||
        this.hotelDoorCard.floorNo == ""
      ) {
        this.$message.error("请填写楼座");
      } else if (
        _.isUndefined(this.hotelDoorCard.roomNo) ||
        this.hotelDoorCard.roomNo == ""
      ) {
        this.$message.error("请填写房间号");
      } else if (_.isUndefined(endDate) || endDate.indexOf("00000000") > -1) {
        this.$message.error("请填写结束时间");
        endDate = "";
      }
      this.hotelDoorCard.floorNo = this.hotelDoorCard.roomNo[0];
      var copy = Object.assign({}, this.hotelDoorCard);
      copy.endDate = endDate;
      NatAppHelper.writeDoorCard("192.168.1.101", copy);
    },
    clearCard() {
      let param = {
        buildNo: "0",
        floorNo: "0",
        roomNo: "0",
        startDate: "",
        endDate: "200001010000"
      };

      NatAppHelper.writeDoorCard("192.168.1.101", param);
      this.hotelDoorCard1 = {
        cardNo: "",
        buildNo: "",
        floorNo: "",
        roomNo: "",
        startDate: "",
        endDate: ""
      };
    },
    handleClose(done) {
      this.$emit("cancel", false);
    }
  }
};
</script>

