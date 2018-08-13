<template>
  <div class="allocationAddOrUpdate">
    <ZingHead :title="title">
    </ZingHead>
    <div class="content">
      <!--头部盘点基本信息-->
      <group>
        <cell title="调拨编号" v-model="voucherInfo.pzId" value-align="right"></cell>
        <cell title="日期" v-model="voucherInfo.inOrOutTime" value-align="right"></cell>
        <cell title="操作人" v-model="voucherInfo.cardUserName" value-align="right"></cell>
        <x-input title="所调物品" readonly  placeholder="请选择调拨的物品" v-model="voucherInfo.productName" placeholder-align="right"></x-input>
        <x-input title="调出物品库" readonly placeholder="请选择物品库" v-model="voucherInfo.ckName" placeholder-align="right"></x-input>
        <x-input title="调入物品库" readonly placeholder="请选择物品库" v-model="voucherInfo.toCkName" placeholder-align="right"></x-input>
      </group>
      <div class="transfer" v-for="(item,index) in transferItems" :key="index">
        <div class="transferWrapper">
          <div style="padding:13px 0px 5px 13px;font-size:15px;color:#999;">调出信息</div>
          <div class="location" v-for="(location, locationIndex) in item.locations" :key="locationIndex">
            <div class="title">
              库位名称：{{location.kwName }}
            </div>
            <group v-for="(detail, detailIndex) in location.details" :key="detailIndex">
              <cell title="批次号" v-model="detail.pzId" value-align="right"></cell>
              <x-input title="调出数量" placeholder="请输入需要调出的数量" v-model="detail.transferCount" placeholder-align="right"></x-input>
            </group>
          </div>
        </div>
        <div class="transferWrapper">
          <div style="padding-left:13px;font-size:15px;color:#999;line-height:30px;">
            调入信息
            <div v-if="transferItems.length > 1" style="float:right;">
              <i class="iconfont icon-shanchu2" style="font-size:30px;"></i>
            </div>
          </div>
          <div style="background-color: #fff;line-height: 20px;font-size: 17px;">
            <group>
              <cell title="调入数量" v-model="item.transferCount" value-align="right"></cell>
              <cell title="调入库位" v-model="item.kwName" value-align="right"></cell>
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
    <!-- <div class="bottom">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="weui-btn btn-save weui-btn_primary" @click.native="allocationAdd('WTJ')">保存</x-button>
        </flexbox-item>
        <flexbox-item class="inventory-btn">
          <x-button type="warn" class="weui-btn btn-common weui-btn_primary" @click.native="allocationAdd('DSH')">提交审核</x-button>
        </flexbox-item>
      </flexbox>
    </div> -->
    <popup v-model="showGoodsList"  style="height:100%;width:100%;background-color:#fff" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-list ref="goodsListRef" :isComeBack="false" :isReferenced="true" @doSome="doSome" @loadGoods="loadGoods" @addGoods="addGoods" @goodsItemClick="goodsItemClick"></goods-list>
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
import GridCard from "../../../components/gridcard/GridCard";
import GoodsList from "./goodsList";
import Avatar from "../../../components/avatar/Avatar";
import Tag from "../../../components/tag/Tag";
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
      title: "调拨详情",
      inOrOut: "",
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
        pzStatus: "",
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
  created() {
    this.voucherInfo.rowId = this.$route.query.rowId;
    this.loadDBDetail();
  },
  methods: {
    doSome() {
      this.showGoodsList = false;
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
          let items = res.data.data.transferItems;

          let group = {};
          let groupIdArr = [];
          let groupIdToIn = {};
          items.forEach(item => {
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
            this.$set(this.transferItems, i, {});
            Object.assign(this.transferItems[i], groupIdToIn[groupIdArr[i]]);
            let locations = [];
            let location2Items = {};
            group[groupIdArr[i]].forEach(item => {
              if (typeof location2Items[item.ckId] !== "object") {
                location2Items[item.ckId] = {
                  ckName: item.ckName,
                  details: []
                };
              }
              location2Items[item.ckId]["details"].push(item);
            });

            for (let key in location2Items) {
              locations.push({
                ckId: key,
                ckName: location2Items[key]["ckName"],
                details: location2Items[key]["details"]
              });
            }
            this.$set(this.transferItems[i], "locations", locations);
            //this.$set(this.transferItems[i].locations, locations);
          }
        });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
@import '../../../assets/stylus/base.styl';

.allocationAddOrUpdate {
  height: 100%;

  .content {
    padding-bottom: 10px;
    background-color: #F5F5FA;
    height: calc(100% -50px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .transfer {
      font-size: 17px;

      .transferWrapper {
        .location {
          background-color: #fff;
          line-height: 20px;
          margin-top: 10px;

          .title {
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            border-bottom: 1px solid #d4dde4;
          }
        }
      }
    }
  }
}
</style>