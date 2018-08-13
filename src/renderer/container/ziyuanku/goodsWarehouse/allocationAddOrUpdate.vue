<template>
  <div class="allocationAddOrUpdate">
    <ZingHead :title="title">
    </ZingHead>
    <div class="content">
      <!--头部盘点基本信息-->
      <group class="group-no-top-border">
        <cell title="调拨编号" v-model="voucherInfo.pzId" value-align="right"></cell>
        <cell title="日期" v-model="voucherInfo.inOrOutTime" value-align="right"></cell>
        <cell title="操作人" v-model="voucherInfo.cardUserName" value-align="right"></cell>
        <x-input title="所调物品" readonly @click.native="chooseGoods" placeholder="请选择调拨的物品" v-model="voucherInfo.productName" placeholder-align="right"></x-input>
        <x-input title="调出物品库" readonly @click.native="chooseWarehouse('out')" placeholder="请选择物品库" v-model="voucherInfo.ckName" placeholder-align="right"></x-input>
        <x-input title="调入物品库" readonly @click.native="chooseWarehouse('in')" placeholder="请选择物品库" v-model="voucherInfo.toCkName" placeholder-align="right"></x-input>
      </group>
      <div class="transfer" v-for="(item,index) in transferItems" :key="index">
        <div class="transferWrapper">
          <div style="padding: 13px 0px 15px 13px; font-size: 16px; color: rgb(0, 0, 0);">调出信息</div>
          <div class="location" v-for="(location, locationIndex) in locations" :key="locationIndex">
            <group v-for="(detail, detailIndex) in location.details" :key="detailIndex">
              <cell title="库位名称" v-model="location.kwName" value-align="right"></cell>
              <cell title="批次号" v-model="detail.pzId" value-align="right"></cell>
              <cell title="数量" v-model="detail.productCount" value-align="right"></cell>
              <x-input title="调出数量" placeholder="请输入需要调出的数量" @on-change="calculateCount(index)" v-model="item['detailRowIdoutCount'][detail.rowId].transferCount" placeholder-align="right"></x-input>
            </group>
          </div>
        </div>
        <div class="transferWrapper">
          <div style="padding:13px 0px 15px 13px;font-size:16px;color:#000;">
            调入信息
            <div v-if="transferItems.length > 1" style="float:right;">
              <i class="iconfont icon-shanchu2" style="font-size:30px;"></i>
            </div>
          </div>
          <div style="background-color: #fff;line-height: 20px;font-size: 17px;">
            <group>
              <cell title="调入数量" v-model="item.transferCount" value-align="right"></cell>
              <cell title="调入库位" v-model="item.kwName" @click.native="chooseLocation(index)" value-align="right"></cell>
            </group>
          </div>
        </div>
      </div>
      <!-- <div>
        <div style="padding:5px 0px 5px 13px;font-size:15px;color:#999;line-height:30px;">
          调拨操作
          <div style="float:right;">
            <x-button mini plain style="float: right;" @click.native="allocationAddMove()">添加</x-button>
          </div>
        </div>
      </div> -->
    </div>
    <!--底部按钮-->
    <div class="bottom">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="weui-btn btn-save weui-btn_primary" @click.native="allocationAdd('WTJ')">保存</x-button>
        </flexbox-item>
        <flexbox-item class="inventory-btn">
          <x-button type="warn" class="weui-btn btn-common weui-btn_primary" @click.native="allocationAdd('DSH')">提交审核</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <popup v-model="showGoodsList"  style="height:100%;width:100%;background-color:#fff" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-list ref="goodsListRef" :isComeBack="false" :isReferenced="true" @doSome="doSome" @loadGoods="loadGoods" @goodsItemClick="goodsItemClick"></goods-list>
    </popup>
    <popup v-model="showWarehoseList" style="height:100%;width:100%;background-color:#fff" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @warehouseItemClick="warehouseItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
    <popup v-model="showLocationList" style="height:100%;width:100%;background-color:#fff" position="right" :popup-style="{'overflow': 'hidden'}">
      <location-list ref="locationListRef" :isReferenced="true" :isComeBack="false" @locationItemClick="locationItemClick" @locationListBack="locationListBack"></location-list>
    </popup>
  </div>
</template>
<script type="text/ecmascript-6">
import { XButton, Flexbox, FlexboxItem, XInput, Group, Cell, Popup } from "vux";
import GridCard from "components/gridcard/GridCard";
import GoodsList from "./goodsList";
import Avatar from "components/avatar/Avatar";
import Tag from "components/tag/Tag";
import LocationList from "./locationList";
import warehouseList from "./warehouseList";
import ZingHead from "@/components/zingHead/ZingHead";
export default {
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    XInput,
    Group,
    GridCard,
    Avatar,
    Tag,
    Cell,
    ZingHead,
    warehouseList,
    Popup,
    GoodsList,
    LocationList
  },
  data() {
    return {
      title: "调拨",
      inOrOut: "",
      loadSuccessCount: 0,
      voucherInfo: {
        // 凭证数据
        voucherType: "DBD",
        storageMethod: "once",
        ckId: "",
        dataType: "WP",
        pzId: "",
        ckName: "",
        toCkId: "",
        toCkName: "",
        pzFirstMoney: 0,
        productCount: 0,
        pzStatus: "WTJ",
        withTrello: false
      },
      currentIndex: 0,
      transferItems: [],
      locations: [],
      rowId2Detail: {},
      showLocationList: false,
      showGoodsList: false,
      showWarehoseList: false
    };
  },
  computed: {},
  watch: {
    loadSuccessCount(curVal, oldVal) {
      if (curVal === 2) {
        let group = {};
        let groupIdArr = [];
        let groupIdToIn = {};
        this.voucherInfo.transferItems.forEach(item => {
          if (typeof group[item.groupId] !== "object") {
            group[item.groupId] = [];
            groupIdArr.push(item.groupId);
          }
          if (item.transferDirection === "out") {
            group[item.groupId].push(item);
          } else {
            groupIdToIn[item.groupId] = item;
          }
        });

        groupIdArr.sort();

        for (let i = 0; i < groupIdArr.length; i++) {
          Object.assign(this.transferItems[i], groupIdToIn[groupIdArr[i]]);
          group[groupIdArr[i]].forEach(item => {
            Object.assign(
              this.transferItems[i]["detailRowIdoutCount"][item.detailRowId],
              item
            );
          });
        }
      }
    }
  },
  created() {
    this.voucherInfo.rowId = this.$route.query.rowId;
    if (
      typeof this.voucherInfo.rowId !== "undefined" &&
      this.voucherInfo.rowId.length > 0
    ) {
      this.voucherInfo.ckId = this.$route.query.ckId;
      this.voucherInfo.productId = this.$route.query.productId;
      this.loadItemDetails();
      this.loadDBDetail();
    } else {
      this.loadDbdNum();
      this.getNewDate();
    }
  },
  methods: {
    getNewDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let date = new Date().getDate();
      date = date > 9 ? date : "0" + date;
      this.voucherInfo.inOrOutTime = year + "-" + month + "-" + date;
    },
    chooseWarehouse(operator) {
      this.inOrOut = operator;
      this.showWarehoseList = true;
    },
    warehouseItemClick(data) {
      if (this.inOrOut === "out") {
        this.voucherInfo.ckName = data.ckName;
        this.voucherInfo.ckId = data.rowId;
        this.loadItemDetails();
      } else {
        this.voucherInfo.toCkId = data.rowId;
        this.voucherInfo.toCkName = data.ckName;
        this.$refs.locationListRef.loadLiactions({
          condition: "",
          ckId: this.voucherInfo.toCkId,
          pageNumber: "0",
          pageSize: "2000"
        });
      }
      this.showWarehoseList = false;
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    doSome() {
      this.showGoodsList = false;
    },
    chooseGoods() {
      this.showGoodsList = true;
    },
    loadGoods() {
      this.$refs.goodsListRef.loadGoods();
    },
    goodsItemClick(item) {
      this.voucherInfo.productRowIds = item.rowId;
      this.voucherInfo.productId = item.rowId;
      this.voucherInfo.productName = item.productName;
      this.showGoodsList = false;
    },
    addGoods() {},
    chooseLocation(index) {
      if (
        typeof this.voucherInfo.toCkId === "undefined" ||
        this.voucherInfo.toCkId.length === 0
      ) {
        this.$vux.toast.text("请选择需要调入的仓库");
      } else {
        this.currentIndex = index;
        this.showLocationList = true;
      }
    },
    locationListBack() {
      this.showLocationList = false;
    },
    locationItemClick(data) {
      this.transferItems[this.currentIndex].kwId = data.rowId;
      this.transferItems[this.currentIndex].kwName = data.ckLocationName;
      this.showLocationList = false;
    },
    calculateCount(index) {
      let data = this.transferItems[index].detailRowIdoutCount;
      let total = 0;
      for (let p in data) {
        //遍历json数组时，这么写p为索引，0,1
        total +=
          typeof data[p]["transferCount"] === "string" &&
          data[p]["transferCount"].length > 0
            ? parseInt(data[p]["transferCount"])
            : 0;
      }
      this.transferItems[index].transferCount = isNaN(total) ? 0 : total;
    },
    loadDbdNum() {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/getVoucherNumber", {
          params: {
            voucherType: "DBD"
          }
        })
        .then(res => {
          this.voucherInfo.cardUserName = res.data.data.cardUserName;
          this.voucherInfo.pzId = res.data.data.pzId;
        });
    },
    loadDBDetail() {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/selectDBDetail", {
          params: {
            dbId: this.voucherInfo.rowId
          }
        })
        .then(res => {
          Object.assign(this.voucherInfo, res.data.data);
          this.loadSuccessCount++;
        });
    },
    loadItemDetails() {
      this.$http
        .get("/zingbiz/resourceLibrary/voucherInfoDetail/selectDetailById", {
          params: {
            ckId: this.voucherInfo.ckId,
            productId: this.voucherInfo.productId,
            status: "YSH"
          }
        })
        .then(res => {
          let details = res.data.data;
          let kwId2Location = {};

          let transferItem = { detailRowIdoutCount: {} };
          details.forEach(item => {
            if (typeof kwId2Location[item.kwId] !== "object") {
              kwId2Location[item.kwId] = {
                kwId: item.kwId,
                kwName: item.kwName,
                transferDirection: "in"
              };
              kwId2Location[item.kwId]["details"] = [];
              this.locations.push(kwId2Location[item.kwId]);
            }
            kwId2Location[item.kwId]["details"].push(item);

            this.rowId2Detail[item.rowId] = item;

            transferItem.detailRowIdoutCount[item.rowId] = {};
            transferItem.transferCount = 0;
          });
          this.transferItems.splice(0, this.transferItems.length);
          this.transferItems.push(transferItem);

          this.loadSuccessCount++;
        });
    },
    allocationAdd(status) {
      let param = JSON.parse(JSON.stringify(this.transferItems));
      let validation = true;
      let msg = "";
      param.forEach(item => {
        if (typeof item.kwId === "undefined" || item.kwId.length === 0) {
          validation = false;
          msg = "请选择库位";
          return;
        }
        item.out = [];
        let data = item.detailRowIdoutCount;
        for (let k in data) {
          let detail = this.rowId2Detail[k];

          item.ckId = this.voucherInfo.ckId;
          item.ckName = this.voucherInfo.ckName;
          item.productId = this.voucherInfo.productId;
          item.productName = this.voucherInfo.productName;
          item.transferDirection = "in";

          let reg = /^\+?[1-9][0-9]*$/;
          if (
            typeof data[k]["transferCount"] === "undefined" ||
            data[k]["transferCount"].length === 0
          ) {
            continue;
          } else if (!reg.test(data[k]["transferCount"])) {
            validation = false;
            msg = "调拨数量只能是数字";
            return;
          } else {
            if (
              parseInt(data[k]["transferCount"]) > parseInt(detail.productCount)
            ) {
              validation = false;
              msg = "调出数量不能大于批次剩余数量";
              return;
            }
            if (detail.kwId === item.kwId) {
              validation = false;
              msg = "调出库位不能和调入库位相同";
              return;
            }
            item.out.push({
              ckId: this.voucherInfo.ckId,
              ckName: this.voucherInfo.ckName,
              productId: this.voucherInfo.productId,
              productName: this.voucherInfo.productName,
              kwId: item.kwId,
              kwName: item.kwName,
              transferDirection: "out",
              detailRowId: detail.rowId,
              pzId: detail.pzId,
              transferCount: data[k]["transferCount"]
            });
          }
          delete item.detailRowIdoutCount;
        }
        if (item.out.length === 0) {
          validation = false;
          msg = "请填写调出数量";
          return;
        }
      });
      if (!validation) {
        this.$vux.toast.text(msg);
      } else {
        let url = "/zingbiz/resourceLibrary/voucher/insertDB";
        if (
          typeof this.voucherInfo.rowId !== "undefined" &&
          this.voucherInfo.rowId.length > 0
        ) {
          url = "/zingbiz/resourceLibrary/voucher/updateDB";
        }
        this.voucherInfo.pzStatus = status;
        this.voucherInfo.transferItems = param;
        this.$http.post(url, this.voucherInfo).then(res => {
          if (this.voucherInfo.pzStatus === "DSH") {
            this.$router.push({
              path: "/workflow/workflowMain",
              query: {
                pzRowId: res.data.data.rowId,
                voucherType: this.voucherInfo.voucherType,
                companyId: this.companyId,
                wfType: "MODULE_TYPE_ZYK"
              }
            });
          } else {
            this.$router.push({
              path: "/resourceLibrary/goodsWarehouse/allocationList",
              query: {
                companyId: this.$route.query.companyId
              }
            });
          }
        });
      }
    },
    allocationAddMove() {}
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
.allocationAddOrUpdate {
  height: 100%;

  .content {
    height: calc(100% - 95px);
    overflow: auto;
    background-color: #f5f5f5;
  }

  .inventory-btn {
    margin-left: 0 !important;
  }
}
</style>
