<template>

      <!--头部-->
      
     <!-- <scroll ref="scroll" :scrollbar="true"> -->
    <div style="height: 100% ;overflow:auto">
       <zing-head title="房态图" :isComeBack="true"> </zing-head>
         <div>
                <el-select v-model="selectArea" placeholder="请选择"
                           @change="(value) => searchEvent(value, 'floorBlock')" style="width:110px">
                    <el-option label="全部楼座" value=""></el-option>
                    <el-option v-for="item in hotelArea" :label="item.configValue" :key="item.rowId"
                               :value="item.configValue"></el-option>
                </el-select>
                &nbsp; 
                <el-select v-model="selectBlock" placeholder="请选择"
                           @change="(value) => searchEvent(value, 'floorArea') " style="width:110px">
                    <el-option label="全部楼区" value=""></el-option>
                    <el-option v-for="item in hotelBlock" :label="item.configValue" :key="item.rowId"
                               :value="item.configValue"></el-option>
                </el-select>
                &nbsp; 
                <!-- roomCountStatu: {
                  all: 0,
                  checkInClean: 0,
                  checkInDirty: 0,
                  nocheckInDirty: 0,
                  noCHeckInClean: 0,
                  isReservation: 0,
                  lock: 0,
                  repair: 0
                }, -->
                <el-select v-model="currentRoomStatu" placeholder="请选择"
                           @change="(value) => filterRoomStatus(value) " style="width:110px">
                    <el-option v-for="item in roomCountStatu2" :label="item.key+ item.value" :key="item.rowId"
                               :value="item.key "></el-option>
                </el-select>
                 
            </div>
       <flexbox :gutter="0" wrap="wrap"> 
        <flexbox-item :span="1/4" class="roomItem"  v-for="(hotelRow) in _hotelList" v-bind:key="hotelRow" @click.native="popoverClick(hotelRow)" >
          <div class="flex-demo" v-if="hotelRow.isCheck == 1 && isClean(hotelRow)" v-bind:style="styleObject.checkInClean">         <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-if="hotelRow.isCheck == 1 && !isClean(hotelRow)"  v-bind:style="styleObject.checkInDirty">       <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-else-if="  hotelRow.isLock == 1" v-bind:style="styleObject.lock" >                               <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-else-if="  hotelRow.isRepair == 1" v-bind:style="styleObject.repair" >                           <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-else-if="hotelRow.isCheck != 1 && isClean(hotelRow)" v-bind:style="styleObject.noCHeckInClean">  <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-else-if="hotelRow.isCheck != 1 && !isClean(hotelRow)"  v-bind:style="styleObject.nocheckInDirty"><div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div> </div>
          <div class="flex-demo" v-else-if="(hotelRow.isRepair != 1 && hotelRow.isCheck != 1 ) "   v-bind:style="styleObject.init"> <div class="hotel-text">{{hotelRow.roomNo}} <div v-if="hotelRow.isReservation == 1" class="triangleTag"></div></div>  </div>
        </flexbox-item>

         <div v-transfer-dom>
          <popup v-model="reasonVisible" position="bottom" max-height="50%"> 
              <group :title="reasonTitle + '原因'">
               <radio  :options="hotelReasonConfig" @on-change="change"  ></radio>
              <!-- <cell v-for="i in 20" :key="i" :title="i"></cell> -->
              </group>
              
            
            <div style="padding: 15px;">
              <x-button @click.native="reasonOK(reasonTitle)" plain type="primary"> 确定 </x-button>
            </div>
          </popup>
        </div>

        <el-dialog title="房间日志" :visible.sync="roomLogDialog">
                <el-table :data="roomLogList">
                    <el-table-column property="action" label="动作"></el-table-column>
                    <el-table-column property="originalStatus" label="原状态"></el-table-column>
                    <el-table-column property="newStatus" label="新状态"></el-table-column>
                    <el-table-column property="createTime" label="操作时间"></el-table-column>
                    <el-table-column property="optName" label="操作人"></el-table-column>
                </el-table>
                <el-pagination
                    @current-change="roomLogAction"
                    background
                    layout="prev, pager, next"
                    :total="roomLogTotal">
                </el-pagination>
            </el-dialog>
        
      </flexbox>
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
  XButton
} from "vux";
import Scroll from "@/components/scroll/Scroll";
export default {
  components: {
    Flexbox,
    Radio,
    FlexboxItem,
    Scroll,
    ZingHead,
    TransferDom,
    Popup,
    Group,
    Cell,
    XButton
  },
  data: () => ({
    dialogMenus: ["房间日志", "打扫", "维修", "锁房"],
    hotelDoorCard: {},
    roomLogList: [],
    roomLogDialog: false,
    makeCardDialog: false,
    roomLogTotal: 0,
    roomCountStatu: {
      all: 0,
      checkInClean: 0,
      checkInDirty: 0,
      nocheckInDirty: 0,
      noCHeckInClean: 0,
      isReservation: 0,
      lock: 0,
      repair: 0
    },
    roomInfomation: {},
    hotelList: _.range(6),
    styleObject: {
      repair: "background-color:#d81e06",
      noCHeckInClean: "background-color:#ffffff",
      checkInClean: "background-color:#40affc",
      checkInDirty: "background-color:rgb(153, 102, 0)",
      nocheckInDirty: "background-color:#C9C9C9",
      lock: "background-color:#88147f",
      init: "background-color:#FFFFFF",
      isReservation: "background-color:#18c34d"
    },
    roomCountStatu2: [],
    elColButton: false,
    lastElColButtonIndex: 0,
    setting: { rowSize: 12 },
    dialogFormVisible: false,
    currentRoomObject: {},
    form: {},
    formLabelWidth: null,

    inputSearch: "", //头部搜索
    selectArea: "",
    selectBlock: "",
    currentRoomStatu: "",
    hotelBlock: [],
    hotelArea: [],
    hotelRepairConfig: [],
    hotelLockConfig: [],
    hotelReasonId: "", // reson关联ID
    hotelReasonConfig: [], // put hotelLockConfig and hotelRepairConfig's data temp array
    reasonVisible: false, //configReason dialog swich
    reasonTitle: "",
    roomChangeModal: false // 换房visible
  }),
  created() {
    // var currentDate = new Date();
    // let stringDate = format(currentDate, "MMDDHHmm");
    // console.log(stringDate);
    this.loadConfig();
    this.init();
  },
  methods: {
    ...mapMutations({
      SET_HOTEL_LIST: "SET_HOTEL_LIST"
    }),
    addReservation() {},
    dialog_open() {},
    loadConfig() {
      /**
                 *       115:空净房"+
                 "        116:空脏房"+
                 "        117:住脏房"+
                 "        118:住客房"+
                 "        119:预定房"+
                 "        120:维修房"+
                 "        121:锁房房"
                 * */
      let url = "/zingbiz/hotel/hotelNew/getRoomStateConfigList";
      let self = this;
      this.$httpSilent
        .get(url)
        .then(res => {
          if (res.data.length > 0) {
            _.each(res.data, value => {
              if (value.configCode == "115")
                self.styleObject.noCHeckInClean =
                  "background-color:" + value.configValue;
              if (value.configCode == "117")
                self.styleObject.nocheckInDirty =
                  "background-color:" + value.configValue;
              if (value.configCode == "116")
                self.styleObject.checkInDirty =
                  "background-color:" + value.configValue;
              if (value.configCode == "118")
                self.styleObject.checkInClean =
                  "background-color:" + value.configValue;
              if (value.configCode == "119")
                self.styleObject.isReservation =
                  "background-color:" + value.configValue;
              if (value.configCode == "120")
                self.styleObject.repair =
                  "background-color:" + value.configValue;
              if (value.configCode == "121")
                self.styleObject.lock = "background-color:" + value.configValue;
            });
          }
        })
        .catch(error => {
          self.$message({ type: "error", message: "请求数据失败，请重试" });
        });
    },
    change(value, label) {
      console.log("change:", value, label);
      this.hotelReasonId = value;
    },
    init(params) {
      /** load hotelConfig block area infomation */

      this.$http
        .all([
          this.$httpSilent.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=999&configCode=100"
          ),
          this.$httpSilent.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=999&configCode=102"
          )
        ])
        .then(
          this.$http.spread((acct, perms) => {
            this.hotelBlock = acct.data.data;
            this.hotelArea = perms.data.data;
          })
        );

      /** init房间 */
      this.$httpSilent
        .get(
          // "/zingbiz/hotel/hotelOrders/getRoomList",
          "/zingbiz/hotel/hotelNew/getRoomInfoList",
          // "/zingbiz/hotel/hotelOrders/getRoomsWithRoomType",
          { params: params || {} }
        )
        .then(res => {
          let roomList = res.data.data;
          roomList = _.sortBy(roomList, room => {
            return ~~room.roomNo;
          });
          this.SET_HOTEL_LIST(roomList);
          this.setRoomCountByStatu(res.data.data);
          //所有一切加载完  懒加载下维修原因  锁房原因
          this.loadReasonConfig();
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadReasonConfig() {
      this.$http
        .all([
          this.$http.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=10&configCode=106"
          ),
          this.$http.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=10&configCode=105"
          )
        ])
        .then(
          this.$http.spread((acct, perms) => {
            // this.hotelRepairConfig = acct.data.data;
            _.each(acct.data.data, config => {
              this.hotelRepairConfig.push({
                key: config.rowId,
                value: config.configValue,
                icon: "http://dn-placeholder.qbox.me/110x110/FF2D55/000"
              });
            });

            // this.hotelLockConfig = perms.data.data;
            _.each(perms.data.data, config => {
              this.hotelLockConfig.push({
                key: config.rowId,
                value: config.configValue,
                icon: "http://dn-placeholder.qbox.me/110x110/FF2D55/000"
              });
            });
          })
        );
    },
    clearRoomStatus() {
      this.roomCountStatu = {
        all: 0,
        checkInClean: 0,
        checkInDirty: 0,
        nocheckInDirty: 0,
        noCHeckInClean: 0,
        isReservation: 0,
        lock: 0,
        repair: 0
      };
    },
    searchEvent(value, type) {
      this.clearRoomStatus();
      console.log("selectChange key : " + value);
      console.log(value);
      let param = {};
      if (type === "floorBlock") {
        param.floorBlock = value;
      }
      if (type === "floorArea") {
        param.floorArea = value;
      }
      //   debugger;
      this.init(param);
    },
    filterRoomStatus(value) {
      console.log(value);
      console.log(this._hotelList);
      var aaa = _.filter(this._hotelList, function(json) {
        return json.isLock === "1";
      });
      console.log(aaa);
    },

    inputSearchEvent() {
      this.init({ roomNo: this.inputSearch });
    },
    popoverShow(roomObject) {
      let infomation = this.roomInfomation;
      this.$set(infomation, "roomNo", roomObject.roomNo); //房间号
      this.$set(infomation, "orderId", roomObject.roomOrderInfo.orderId);
      this.$set(
        infomation,
        "deposit",
        roomObject.roomOrderInfo.deposit || "押金"
      ); // 押金
      this.$set(
        infomation,
        "groupName",
        roomObject.roomOrderInfo.groupName || "团体名称"
      ); // 团体名称
      this.$set(
        infomation,
        "actualEnterTime",
        roomObject.roomOrderInfo.actualEnterTime || "入住时间"
      ); // 入住时间
      this.$set(
        infomation,
        "actualOuterTime",
        roomObject.roomOrderInfo.actualOuterTime || "离店名称"
      ); // 离店名称
      this.$set(
        infomation,
        "groupPersonNum",
        roomObject.roomOrderInfo.groupPersonNum || "同住人数"
      ); // 同住人数
      this.$set(
        infomation,
        "reserveName",
        roomObject.roomOrderInfo.reserveName || "预订人姓名"
      ); // 预订人姓名
      this.$set(
        infomation,
        "orderMoney",
        roomObject.roomOrderInfo.orderMoney || "订单金额"
      ); // 预订人姓名
      this.$set(
        infomation,
        "amountPayable",
        roomObject.roomOrderInfo.amountPayable || "0.00"
      ); // 预订人姓名
    },
    popoverClick(value, row, item) {
      let self = this;
      this.popMenuListChange(value);
      this.$vux.actionsheet.show({
        menus: this.dialogMenus,
        onMenuClick(text, key) {
          console.log(text, key);
          self.buttonAction(text, this.currentRoomObject);
          this.show = false;
        }
      });
      //鼠标点击酒店房
      this.currentRoomObject = value;
    },
    popMenuListChange(hotelRow) {
      this.dialogMenus = [];
      this.dialogMenus.push("房间日志");
      if (hotelRow.isLock == 1) {
        this.dialogMenus.push("取消锁房");
      } else if (hotelRow.isRepair == 1) {
        this.dialogMenus.push("维修完成");
      } else {
        if (this.isClean(hotelRow)) {
          this.dialogMenus.push("打扫");
        } else {
          this.dialogMenus.push("打扫完成");
        }

        this.dialogMenus.push("维修");
        this.dialogMenus.push("锁房");
      }
    },
    dropDownAction(action) {
      this.buttonAction(null, action);
    },
    buttonAction(action, infomation) {
      this.currentRoomObject.action = action;
      if (!_.isUndefined(infomation)) {
        this.currentRoomObject = this._hotelList[infomation[0]][infomation[1]];
      }
      if (this.currentRoomObject.isCheck === 1) {
        this.currentRoomObject.originalStatus = "住";
      } else {
        this.currentRoomObject.originalStatus = "空";
      }

      if (this.currentRoomObject.isClean === 2) {
        this.currentRoomObject.originalStatus += "净、";
      } else {
        this.currentRoomObject.originalStatus += "脏、";
      }

      if (action === "备注") {
        this.openDialog(infomation);
      } else if (action === "预定") {
        this.$router.push({
          path: "singleReserve?reserveMenu=1",
          query: {
            roomState: true,
            roomId: this.currentRoomObject.roomId,
            roomNo: this.currentRoomObject.roomNo,
            roomTypeId: this.currentRoomObject.roomTypeId,
            roomTypeDesc: this.currentRoomObject.roomTypeDesc
          }
        });
      } else if (action === "维修") {
        this.reasonTitle = "维修";
        this.openConfigDialog("维修");
      } else if (action === "维修完成") {
        this.currentRoomObject.originalStatus += "修、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "修、",
          "修完"
        );
        this.currentRoomObject.isRepair = 0;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "锁房") {
        this.currentRoomObject.originalStatus += "未锁、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "未锁、",
          "锁、"
        );
        this.reasonTitle = "锁房";
        this.openConfigDialog("锁房");
      } else if (action === "取消锁房") {
        this.currentRoomObject.originalStatus += "锁、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "锁、",
          "未锁、"
        );
        this.currentRoomObject.isLock = 0;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "打扫") {
        this.currentRoomObject.isClean = 1;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "打扫完成") {
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "脏、",
          "净、"
        );
        this.currentRoomObject.isClean = 2;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "入住") {
        // let orderId = this.currentRoomObject.orderInfo.orderId;
        this.$router.push({
          path: "singleCheckIn?checkInMenu=1",
          query: {
            roomState: true,
            roomId: this.currentRoomObject.roomId,
            roomNo: this.currentRoomObject.roomNo,
            roomTypeId: this.currentRoomObject.roomTypeId,
            roomTypeDesc: this.currentRoomObject.roomTypeDesc
          }
        });
      } else if (action === "续住") {
        this.$router.push({
          path: "/hotel/singleCheckIn",
          query: { room: this.currentRoomObject }
        });
      } else if (action === "换房") {
        this.roomChangeModal = true;
      } else if (action === "账单") {
        // this.$router.push({
        //     path: "hotelBill",
        //     query: {
        //         orderId: this.currentRoomObject.orderInfo.orderId,
        //         hotelUniqueId: this.currentRoomObject.hotelUniqueId
        //     }
        // });
      } else if (action === "房间日志") {
        this.$router.push({
          path: "hotelLog",
          query: {
            roomId: this.currentRoomObject.roomId
          }
        });
      } else if (action === "制卡") {
        this.makeCardDialog = true;
      }
      let self = this;
      setTimeout(function() {
        self.reloadRoomStatus();
      }, 2500);
      // this.init();
      // even.cancelBubble = true; //冒泡
    },
    reloadRoomStatus() {
      this.clearRoomStatus();
      /** init房间 */
      this.$httpSilent
        .get("/zingbiz/hotel/hotelNew/getRoomInfoList", { params: {} })
        .then(res => {
          this.setRoomCountByStatu(res.data.data);
          //所有一切加载完  懒加载下维修原因  锁房原因
        })
        .catch(err => {
          console.log(err);
        });
    },
    roomLogAction(pageNumber) {
      this.roomLogDialog = true;
      let param = {};
      param.roomId = this.currentRoomObject.roomId;
      param.pageNumber = pageNumber || 1;
      param.pageSize = "10";
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
    },
    openDialog(infomation) {
      // 打开备注 todo:to cliseDialog 合并
      // alert(infomation)
      // this.currentRoomObject.hotelNote = ''
      this.dialogFormVisible = true;
    },
    openConfigDialog(action) {
      this.reasonVisible = true;
      if (action === "维修") {
        this.hotelReasonConfig = this.hotelRepairConfig;

        // this.updateRoom(this.currentRoomObject) }
      }
      if (action === "锁房") {
        this.hotelReasonConfig = this.hotelLockConfig;

        // this.updateRoom(this.currentRoomObject) }
        // this.updateRoom(this.currentRoomObject) }
      }
    },
    okChangeRoom(status) {
      if (status) {
        this.roomChangeModal = false;
      }
    },
    reasonOK(action) {
      if (action === "维修") {
        this.currentRoomObject.isRepair = 1;
        this.currentRoomObject.isCheck = 0;
        this.currentRoomObject.repaiReasonId = this.hotelReasonId;
      }

      if (action === "锁房") {
        this.currentRoomObject.isLock = 1;
        this.currentRoomObject.lockReasonId = this.hotelReasonId;
      }

      this.updateRoom(this.currentRoomObject);
      this.reasonVisible = false;
    },
    closeDialog() {
      // 填写备注后确认
      var self = this;
      this.updateRoom(this.currentRoomObject, () => {
        self.dialogFormVisible = false;
      });
    },
    updateRoom(data, fn) {
      // 保存房间动作
      let url = "/zingbiz/hotel/hotelNew/saveHotelRoom";
      let param = data;
      this.$httpSilent
        .post(url, param)
        .then(res => {
          // fn()  message success !
        })
        .catch(err => {
          console.log(err);
        });
    },
    ddReservation(data) {
      this.$httpSilent
        .post("/zingbiz/hotel/hotelOrders/reserveRoom", data)
        .then(res => {
          // this.loading = false;
          // console.log("res:" + JSON.stringify(res.data));
          if (res.data.success) {
            this.isAddReserveShowplanRoom = false;
            this.init();
          } else {
            this.$message({ type: "error", message: "添加失败，请重试" });
          }
        });
      console.log(data);
    },
    planRoom(room) {
      // 房间选择回调
      console.log(room);
    },
    readCard() {
      NatAppHelper.readDoorCard("192.168.1.101", cardInfo => {
        if (cardInfo.code === 1) {
          let info = cardInfo.data;
          let buildFloorRoomArr = info.roomNo.split("#");
          this.hotelDoorCard = info;
          this.hotelDoorCard.buildNo = buildFloorRoomArr[0];
          this.hotelDoorCard.floorNo = buildFloorRoomArr[1];
          this.hotelDoorCard.roomNo = buildFloorRoomArr[2];
        } else {
          console.error("读卡失败");
        }

        console.log(cardInfo);
      });
    },
    makeDoorCard() {
      NatAppHelper.writeDoorCard("192.168.1.101", this.hotelDoorCard);
    },
    isClean(json) {
      if (
        json.isClean === 2 ||
        json.isClean === null ||
        json.isClean === 0 ||
        json.isClean === "0" ||
        json.isClean === "2"
      ) {
        return true;
      } else {
        return false;
      }
    },
    roomHover(obj) {
      // console.log(obj)
      this.currentRoomObject = obj;
    },
    setRoomCountByStatu(origin) {
      let roomCountStatu = this.roomCountStatu;

      function isClean(json) {
        if (
          json.isClean === 2 ||
          json.isClean === null ||
          json.isClean === 0 ||
          json.isClean === "0" ||
          json.isClean === "2"
        ) {
          return true;
        } else {
          return false;
        }
      }

      _.each(origin, function(v) {
        roomCountStatu.all++;
        if (v.isCheck == 1) {
          //住
          if (isClean(v)) {
            // 净
            roomCountStatu.checkInClean++;
          } else {
            roomCountStatu.checkInDirty++;
          }
        } else {
          // 空
          if (isClean(v)) {
            // 净
            roomCountStatu.noCHeckInClean++;
          } else {
            //脏
            roomCountStatu.nocheckInDirty++;
          }
        }
        if (v.isLock == "1") {
          roomCountStatu.lock++;
        }
        if (v.isRepair == "1") {
          roomCountStatu.repair++;
        }
        if (v.isReservation == "1") {
          roomCountStatu.isReservation++;
        }
      });
      this.roomCountStatu2 = [];
      this.roomCountStatu2.push({ key: "全部房间", value: roomCountStatu.all });
      this.roomCountStatu2.push({ key: "锁房", value: roomCountStatu.lock });
      this.roomCountStatu2.push({ key: "维修", value: roomCountStatu.repair });
      this.roomCountStatu2.push({
        key: "住脏",
        value: roomCountStatu.checkInDirty
      });
      this.roomCountStatu2.push({
        key: "住净",
        value: roomCountStatu.checkInClean
      });
      this.roomCountStatu2.push({
        key: "空脏",
        value: roomCountStatu.nocheckInDirty
      });
      this.roomCountStatu2.push({
        key: "空净",
        value: roomCountStatu.noCHeckInClean
      });
    }
  },
  computed: {
    ...mapState({
      _hotelList: state => {
        let hotelList = state.hotel.hotelList;
        hotelList = _.sortBy(hotelList, function(object) {
          // 手动改变underscore的字符串排序逻辑，系统内不会出现真正的字符串，只会是字符串类型的数字，强转即可
          if (!_.isNaN(object.serialNumber)) {
            object.serialNumber = ~~object.serialNumber;
            return object.serialNumber; //serialNumber为节点房间排序字段！
          }
        });
        return hotelList;
      }
    })
  }
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

 