<template>
  <div class="otherInOrOutVoucher">
    <div class="vux-center" style="height:100%">
      <div style="min-height:calc(100% - 44px)">
        <group label-width="7em">
          <x-input title="编号" disabled v-model="voucherInfo.pzId" class="fontColor"></x-input>
          <x-input title="物品库<i style='color:red'>*</i>" @click.native="openWareHoseList" disabled required placeholder="请选择物品库" :show-clear="false" autocapitalize="characters" v-model="voucherInfo.ckName" class="fontColor"></x-input>
          <datetime title="单据日期<i style='color:red'>*</i>" v-model="voucherInfo.inOrOutTime"></datetime>
          <datetime title="交货日期<i style='color:red'>*</i>" v-model="voucherInfo.endDate"></datetime>
          <x-input title="联系人<i style='color:red'>*</i>" @click.native="openContact" placeholder="请选择联系人" disabled v-model="voucherInfo.contactName" class="fontColor"></x-input>
          <x-input :title="cardUserNameText" disabled v-model="voucherInfo.cardUserName" class="fontColor"></x-input>
          <x-input v-show="isAssociatedPzId" @click.native="openInvoicingList" placeholder="请选择关联订单编号" title="关联订单编号<i style='color:red'>*</i>" disabled v-model="voucherInfo.relationPzId" class="fontColor"></x-input>
          <x-input v-show="showLogisticsNo" title="物流信息" v-model="voucherInfo.logisticsNo" placeholder="请填写物流信息" class="fontColor"></x-input>
        </group>
        <group class="goodsInformation" label-width="7em">
          <div style="float:left;line-height:45px;margin-left:13px;width: 7em;">
            物品信息
            <i style="color:red">*</i>
          </div>
          <flexbox v-show="voucherInfo.pzStatus === 'WTJ' && voucherInfo.voucherType !=='saleSend'" style="height:45px;background: #fbf9fe;">
            <flexbox-item style="text-align: center;">
              <div style="height:100%;color:#40AFFC" @click="soCodeStorage()">扫码添加</div>
            </flexbox-item>
            <flexbox-item style="text-align: center;margin-left:1px;">
              <div style="height:100%;color:#FF8000" @click="spaceChange()">手动添加</div>
            </flexbox-item>
          </flexbox>
          <flexbox class='vux-1px-t' style="padding:5px;">
            <flexbox-item style="text-align: center;">
              <div class="vux-1px-r">
                <div style="color:#FF8000;line-height:44px;">{{voucherInfo.productCount}}</div>
                <div>数量</div>
              </div>

            </flexbox-item>
            <flexbox-item style="text-align: center;margin-left:1px;">
              <div style="color:#FF8000;line-height:44px;">{{voucherInfo.pzFirstMoney}}</div>
              <div>金额</div>
            </flexbox-item>
          </flexbox>
          <GridCard class='vux-1px-t' v-for="(item ,index) in voucherInfoItems" :key="index">
            <div slot="cardLeft" @click="showGoodsInOrOutDetail(index)" class="left">
              <div class="googImg">
                <img :src="getImageUrl(item.pzImgs)">
              </div>
              <div>
                <div class="goodName">
                  {{item.productName}}
                </div>
                <div class="good-information">
                  <span>{{item.pzPrice}} x</span>
                  <span>{{item.pzCount}}{{item.pzUnit}}</span>
                </div>
              </div>
            </div>
            <div slot="cardRight" v-show="voucherInfo.pzStatus === 'WTJ'" class="right">
              <i slot="icon" class="iconfont icon-shanchu2" @click="deleteItem(index)"></i>
            </div>
          </GridCard>
          <x-textarea title="备注" :max="200" placeholder="请填写备注" :show-counter="false" v-model="voucherInfo.pzRemark"></x-textarea>
          <x-input title="优惠率" disabled placeholder="选择物品后自动带出" v-model="voucherInfo.cheapPre" class="fontColor"></x-input>
          <x-input title="优惠金额" disabled placeholder="选择物品后自动带出" v-model="voucherInfo.cheapPrice" class="fontColor"></x-input>
        </group>
      </div>
      <flexbox :gutter="0" style="margin-top: 10px" v-show="voucherInfo.pzStatus !== 'DSH'">
        <flexbox-item v-show="voucherInfo.pzStatus !== 'YSH'">
          <x-button type="primary" class="btn-save" @click.native="addOtherInData('SAVE')">保存</x-button>
        </flexbox-item>
        <flexbox-item class="twoButten">
          <x-button type="primary" class="btn-common" @click.native="addOtherInData('SUBMIT')">{{pzStatusText}}</x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <!-- 弹框模板 -->
    <task-selection :showTaskSelection="taskSelectionShow" @confirmTaskSelection="confirmTaskSelection" @cancleTaskSelection="cancleTaskSelection"></task-selection>
    <!-- 物品列表 -->
    <popup v-model="showGoodsList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-list ref="goodsListRef" :showAddGoods="true" :isComeBack="false" @doSome="doSome" :isReferenced="true" @loadGoods="loadGoods" @addGoods="addGoods" @goodsItemClick="goodsItemClick"></goods-list>
    </popup>
    <!-- 添加物品 -->
    <popup v-model="showGoodsAdd" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-add-or-update :routing="voucherInfo.companyId" ref="goodsAddRef" :isComeBack="false" @goodsAddOrUpdateBack="goodsAddOrUpdateBack" @goodsAddSuccessCall="goodsAddSuccessCall" :isReferenced="true"></goods-add-or-update>
    </popup>
    <!-- 物品出入库库位 -->
    <popup v-model="showGoodsInOrOut" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-in-or-out ref="goodsInOrOutRef" :showAddDetails="showAddDetails" :voucherType="voucherInfo.voucherType" :ckId="voucherInfo.ckId" :ckName="voucherInfo.ckName" :selectedGoods="selectedGoods" @picked="picked" @goodsInOrOutBack="goodsInOrOutBack"></goods-in-or-out>
    </popup>
    <!-- 仓库列表 -->
    <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :loadOnCreated="false" ref="warehouseListRef" :isReferenced="true" @warehouseItemClick="warehouseItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
    <!-- 外联人 -->
    <externalContactPicker :popup="externalContact" @cancle="cancle" @contactDetail="contactDetail">
    </externalContactPicker>
    <!-- 关联订单 -->
    <popup v-model="showInvoicingList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <invoicing-list :isReferenced="true" @invoicingItemClick="invoicingItemClick" :ckIdParam="ckIdParam" :voucherTypeParam="voucherTypeParam" @invoicingListBack="invoicingListBack"></invoicing-list>
    </popup>
  </div>
</template>

<script>
import {
  TabItem,
  XInput,
  Group,
  Flexbox,
  FlexboxItem,
  XButton,
  Datetime,
  XTextarea,
  Selector,
  Checker,
  CheckerItem,
  Radio,
  Popup
} from "vux";
import warehouseList from "../goodsWarehouse/warehouseList";
import Scroll from "../../../components/scroll/Scroll";
import TaskSelection from "../../common/task/taskSelection";
import ZingHead from "../../../components/zingHead/ZingHead";
import GridCard from "../../../components/gridcard/GridCard";
import ExternalContactPicker from "@/container/outContact/template/externalContactPicker";
import TaskDetail from "@/container/taskManage/taskDetail";
import { getImageUrl, Z_IsEmpty20 } from "@/utils/fn";
import InvoicingList from "./invoicingList";
import GoodsList from "../goodsWarehouse/goodsList";
import GoodsAddOrUpdate from "../goodsWarehouse/goodsAddOrUpdate";
import GoodsInOrOut from "../goodsWarehouse/goodsInOrOut";
export default {
  name: "invoicingVoucher",
  components: {
    ZingHead,
    Scroll,
    TabItem,
    XInput,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    Datetime,
    XTextarea,
    Selector,
    TaskSelection,
    GridCard,
    warehouseList,
    Checker,
    CheckerItem,
    Radio,
    Popup,
    TaskDetail,
    InvoicingList,
    GoodsList,
    GoodsInOrOut,
    GoodsAddOrUpdate,
    ExternalContactPicker
  },
  props: {
    showHead: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    voucherInfoParam: {
      type: Object,
      default: function() {
        return {};
      }
    },
    voucherInfoInPzItemsParam: {
      type: Object,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    showAddDetails() {
      if (this.currentDetailIndex !== -1) {
        return true;
      } else if (this.ckOutMethod === "auto") {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      showInvoicingList: false,
      voucherTypeParam: "",
      ckIdParam: "",

      cardUserNameText: "采购人员<i style='color:red'>*</i>",
      isAssociatedPzId: false,

      externalContact: false,

      productId2VoucherItem: {},

      showGoodsList: false,
      showGoodsAdd: false,
      showGoodsInOrOut: false,
      isShowGoodsInOrOutDetail: false, // 是否为查看出入库物品详情
      currentDetailIndex: -1,
      ckOutMethod: "hand",
      selectedGoods: {},

      pzRowId: "",
      screenHeight: 0,
      pzStatusText: "提交审核",
      showWarehoseList: false,

      voucherInfo: {
        // 凭证数据
        storageMethod: "once",
        ckId: "",
        dataType: "WP",
        pzId: "",
        ckName: "",
        pzFirstMoney: 0,
        productCount: 0,
        pzStatus: "WTJ",
        withTrello: false
      },
      voucherInfoItems: []
    };
  },
  watch: {
    voucherInfoItems(newVal, oldVal) {
      let productCount = 0;
      let pzFirstMoney = 0;
      newVal.forEach(item => {
        if (typeof item === "object") {
          productCount += parseInt(item.pzCount);
          pzFirstMoney += parseFloat(item.pzAccount);
        }
      });
      this.voucherInfo.productCount = productCount;
      this.voucherInfo.pzFirstMoney = pzFirstMoney.toFixed(2);
    },
    voucherInfoParam(newVal, oldVal) {
      this.voucherInfo = newVal;
      if (
        typeof this.voucherInfo.endDate === "string" &&
        this.voucherInfo.endDate.length > 10
      ) {
        this.voucherInfo.endDate = this.voucherInfo.endDate.substring(0, 10);
      }
      //初始化按钮显示
      if (this.voucherInfo) {
        if (this.voucherInfo.pzStatus === "DSH") {
          this.pzStatusText = "提交审核";
        } else if (this.voucherInfo.pzStatus === "YSH") {
          this.pzStatusText = "反审核";
        }
      }
    },
    voucherInfoInPzItemsParam(newVal, oldVal) {
      this.voucherInfoItems = newVal;
    }
  },
  created() {
    this.voucherInfo.companyId = this.$route.query.companyId;
    this.pzRowId = this.$route.query.pzRowId;
    this.voucherInfo.voucherType = this.$route.query.voucherType;
    this.initByVouchetType();
    //相当于init()当页面初始化结束时调用
    this.screenHeight = document.documentElement.clientHeight - 100;
    if (typeof this.pzRowId !== "string" || this.pzRowId.length < 1) {
      //获取凭证编号
      this.getTodayNumber();
      //获取当前时间
      this.getNewDate();
    }
  },
  methods: {
    initByVouchetType() {
      let sealText = "销售人员<i style='color:red'>*</i>";
      let buyText = "采购人员<i style='color:red'>*</i>";
      switch (this.voucherInfo.voucherType) {
        case "buyIn":
          this.cardUserNameText = buyText;
          this.isAssociatedPzId = false;
          break;
        case "buyBack":
          this.cardUserNameText = buyText;
          this.isAssociatedPzId = true;
          this.voucherTypeParam = "buyIn";
          break;
        case "saleOut":
          this.cardUserNameText = sealText;
          this.isAssociatedPzId = false;
          break;
        case "saleBack":
          this.cardUserNameText = sealText;
          this.isAssociatedPzId = true;
          this.voucherTypeParam = "saleOut";
          break;
        default:
          this.cardUserNameText = sealText;
          this.isAssociatedPzId = true;
          this.voucherTypeParam = "saleOut";
          this.showLogisticsNo = true;
      }
    },
    openInvoicingList() {
      if (this.ckIdParam !== "") {
        this.showInvoicingList = true;
      } else {
        this.$vux.toast.show({
          text: "请先选择物品库",
          type: "warn"
        });
      }
    },
    invoicingListBack() {
      this.showInvoicingList = false;
    },
    invoicingItemClick(item) {
      this.voucherInfo.relationPzId = item.pzId;
      this.showInvoicingList = false;
    },
    openContact() {
      this.externalContact = true;
    },
    contactDetail(data) {
      this.voucherInfo.contactId = data.contactsId;
      this.voucherInfo.contactName = data.contactsName;
      this.externalContact = false;
    },
    cancle() {
      this.externalContact = false;
    },
    openWareHoseList() {
      this.showWarehoseList = true;
      switch (this.$route.query.voucherType) {
        case "saleOut":
        case "saleBack":
          this.$refs.warehouseListRef.loadCkInfo("成品");
          break;
        default:
          this.$refs.warehouseListRef.loadCkInfo();
      }
    },
    warehouseItemClick(data) {
      this.ckOutMethod = data.ckOutMethod;
      this.voucherInfo.ckId = data.rowId;
      this.voucherInfo.ckName = data.ckName;
      this.voucherInfo.dataType = data.ckType;
      this.voucherInfo.ckProjectId = data.ckProjectId;

      this.ckIdParam = data.rowId;

      this.showWarehoseList = false;
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    soCodeStorage() {},
    spaceChange() {
      if (this.voucherInfo.ckId !== "") {
        this.goodsListShow();
      } else {
        this.$vux.toast.show({
          text: "请先选择物品库",
          type: "warn"
        });
      }
    },
    addOtherInData(operate) {
      let isToFlow = false;

      if (operate === "SUBMIT" && this.voucherInfo.pzStatus !== "YSH") {
        isToFlow = true;
      }
      if (Z_IsEmpty20(this.voucherInfo.endDate)) {
        this.$vux.toast.text("请选择交货日期");
        return;
      }

      if (Z_IsEmpty20(this.voucherInfo.cardUserName)) {
        this.$vux.toast.text("请选择" + this.cardUserNameText);
        return;
      }

      if (Z_IsEmpty20(this.voucherInfo.contactName)) {
        this.$vux.toast.text("请选择联系人");
        return;
      }

      //提示添加物品
      if (this.voucherInfoItems.length === 0) {
        this.$vux.toast.text("请先添加物品!");
        return;
      }

      let reg1 = /^[+-]?\d*\.?\d{0,2}$/;
      let flag = false;
      let total = 0;

      //获取第一个图片为展示图片
      this.voucherInfo.pzShowImg = this.voucherInfoItems[0].pzImgs;
      //获取物品信息
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;
      this.voucherInfo.operate = operate;

      if (operate === "SUBMIT" && !isToFlow) {
        let _this = this;
        this.$vux.confirm.show({
          title: "提示",
          content: "确认进行反审核操作吗？",
          // 组件除show外的属性
          onConfirm() {
            _this.voucherInfo.pzStatus = "WTJ";
            _this.saveData(isToFlow);
          }
        });
      } else {
        this.voucherInfo.pzStatus = "WTJ";
        this.saveData(isToFlow);
      }
    },
    saveData(isToFlow) {
      let url = "/zingbiz/resourceLibrary/voucher/insertVoucherProduct";
      let rowId = this.$route.query.pzRowId;
      if (typeof rowId !== "undefined") {
        url = "/zingbiz/resourceLibrary/voucher/updateVoucher";
      }

      this.$http.post(url, this.voucherInfo).then(response => {
        let voucherType = this.voucherInfo.voucherType;
        if (response.data.success) {
          if (isToFlow) {
            let query = {
              pzRowId: response.data.data.rowId,
              voucherType,
              companyId: this.voucherInfo.companyId,
              wfType: "MODULE_TYPE_ZYK"
            };
            //跳转发起审批页面
            this.$router.push({
              path: "/workflow/workflowMain",
              query
            });
          } else {
            this.$router.push({
              path: "/resourceLibrary/invoicing/invoicingList",
              query: {
                voucherType: this.voucherInfo.voucherType,
                companyId: this.voucherInfo.companyId
              }
            });
          }
        } else {
          if (response.data.msg === "1") {
            this.$vux.toast.text("物品已出库，无法反审核");
          } else {
            this.$vux.toast.text("凭证已提交审核");
          }
        }
      });
    },
    deleteItem(index) {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.voucherInfoItems.splice(index, 1);
        }
      });
    },
    cancleTaskSelection() {
      this.taskSelectionShow = false;
    },
    //获取凭证编号
    getTodayNumber() {
      let params = {
        voucherType: this.voucherInfo.voucherType
      };
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/getVoucherNumber", {
          params
        })
        .then(response => {
          if (response.data.success) {
            this.voucherInfo.pzId = response.data.data.pzId;
            this.voucherInfo.cardUserName = response.data.data.cardUserName;
          }
        });
    },
    //获取当前时间
    getNewDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let date = new Date().getDate();
      date = date > 9 ? date : "0" + date;
      this.voucherInfo.inOrOutTime = year + "-" + month + "-" + date;
      this.voucherInfo.endDate = year + "-" + month + "-" + date;
    },
    //图片路径转化
    getImageUrl,
    goodsListShow() {
      this.loadGoodsList();
      this.showGoodsList = true;
    },
    goodsListHide() {
      this.showGoodsList = false;
    },
    loadGoodsList() {
      if (Z_IsEmpty20(this.voucherInfo.relationPzId)) {
        this.$refs.goodsListRef.loadGoods();
      } else {
        let params = {
          pzId: this.voucherInfo.relationPzId
        };
        let url = "/zingbiz/resourceLibrary/product/findByPzId";

        this.$http
          .get(url, { params: params })
          .then(res => {
            this.$refs.goodsListRef.setAllGoods(res.data.data);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    goodsAddOrUpdateBack() {
      this.showGoodsAdd = false;
    },
    addGoods() {
      this.showGoodsAdd = true;
    },
    goodsAddSuccessCall() {
      this.loadGoodsList();
      this.showGoodsAdd = false;
    },
    doSome() {
      this.goodsListHide();
    },
    goodsItemClick(item) {
      let flag = false;
      this.voucherInfoItems.forEach(ele => {
        if (item.rowId === ele.productRowId) {
          flag = true;
        }
      });
      if (flag) {
        this.$vux.toast.text("物品已添加，请选择其它物品");
        return;
      }

      this.selectedGoods = {};
      Object.assign(this.selectedGoods, item);
      this.showGoodsInOrOut = true;
    },
    goodsInOrOutBack() {
      this.currentDetailIndex = -1;
      this.showGoodsInOrOut = false;
      this.showGoodsList = false;
    },
    setPickedData(data) {
      if (this.currentDetailIndex !== -1) {
        this.voucherInfoItems[this.currentDetailIndex] = data;
      } else {
        this.voucherInfoItems.push(data);
      }

      let amountReceivable = 0; // 应收金额
      let amountCollected = 0; // 实收金额
      this.voucherInfoItems.forEach(function(item) {
        amountReceivable += parseFloat(item.pzPrice) * parseFloat(item.pzCount);
        amountCollected += parseFloat(item.pzAccount);
      });
      let cheapPre = parseFloat(
        (amountReceivable - amountCollected) / amountReceivable * 100
      ).toFixed(2);
      this.voucherInfo.cheapPre = isNaN(cheapPre) ? 0 : cheapPre;
      let cheapPrice = amountReceivable - amountCollected;
      this.voucherInfo.cheapPrice = isNaN(cheapPrice) ? 0 : cheapPrice.toFixed(2);

      this.showGoodsInOrOut = false;
      this.showGoodsList = false;
      this.currentDetailIndex = -1;
    },
    picked(data) {
      // 主出入库单
      if (this.ckOutMethod === "auto") {
        // 自动出入库
        let inArr = ["otherIn", "buyIn", "saleBack"];
        if (inArr.indexOf(this.voucherInfo.voucherType) >= 0) {
          this.addAutoInDetails(data, details => {
            data.voucherInfoItemDetails = details;
            this.setPickedData(data);
          });
        } else {
          this.addAutoOutDetails(data, details => {
            details.forEach(item => {
              item.kwPrice = data.pzPrice;
            });
            data.voucherInfoItemDetails = details;
            this.setPickedData(data);
          });
        }
      } else {
        // 手动出入库
        this.setPickedData(data);
      }
    },
    addAutoInDetails(data, fn) {
      let detail = {
        ckName: this.voucherInfo.ckName,
        ckId: this.voucherInfo.ckId,
        productUnit: this.selectedGoods.productUnit,
        productId: this.selectedGoods.rowId,
        productImg: this.selectedGoods.productImgs,
        productName: this.selectedGoods.productName,
        productCode: this.selectedGoods.productCode,
        productCount: data.pzCount,
        kwPrice: data.pzPrice
      };
      this.$http
        .get("/zingbiz/resourceLibrary/location/selectAllLocationByCKId", {
          params: {
            pageNumber: 0,
            pageSize: 1,
            ckId: this.voucherInfo.ckId
          }
        })
        .then(response => {
          let kwDatas = response.data.data;
          if (kwDatas.length === 0) {
            this.$vux.toast.text("请先新建库位!");
          } else {
            let kwData = kwDatas[0];
            detail.kwId = kwData.rowId;
            detail.kwName = kwData.ckLocationName;
            fn([detail]);
          }
        });
    },
    addAutoOutDetails(data, fn) {
      this.$http
        .get("/zingbiz/resourceLibrary/voucherInfoDetail/selectAutoDetails", {
          params: {
            productNum: data.pzCount,
            ckId: this.voucherInfo.ckId,
            productId: data.productRowId
          }
        })
        .then(response => {
          let details = response.data.data;
          if (response.data.success) {
            fn(details);
          } else {
            if ("1" === response.data.msg) {
              this.$vux.toast.text("库存不足");
            }
          }
        });
    },
    showGoodsInOrOutDetail(index) {
      this.currentDetailIndex = index;
      let item = this.voucherInfoItems[index];
      this.$refs.goodsInOrOutRef.initData(item);
      this.showGoodsInOrOut = true;
    }
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/1px.less";
</style>
<style scoped lang="stylus">
@import '/../../../assets/stylus/unify.styl';

.otherInOrOutVoucher {
  & *, :after, :before {
    box-sizing: content-box;
  }

  height: 100%;
  overflow: auto;
  background: #fbf9fe; // transform: translate(0px, 0px) translateZ(0px);

  &::-webkit-scrollbar {
    display: none;
  }

  .vux-popup-dialog {
    background: #fff;
  }

  .vux-center {
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .weui-btn {
      margin-right: 0px;
      padding: 0px;
    }

    .examineAspectItem {
      width: 100px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #ccc;
      background-color: #fff;
      margin-right: 13px;
    }

    .examineAspectItem-selected {
      background: #ffffff bottom;
      border-color: #ff8000;
    }

    .goodsInformation {
      margin-bottom: 5px;

      .grid-card {
        .googImg {
          img {
            width: 50px;
            height: 50px;
            margin-right: 20px;
          }
        }

        .goodName {
          margin-bottom: 1px;
        }

        .right {
          .icon-shanchu2 {
            font-size: 25px;
          }
        }
      }
    }

    .twoButten {
      margin: 0px !important;
    }

    .addGood, .taskProject {
      font-size: 15px;
      padding-left: 15px;
      color: #999;

      .itemInformation {
        line-height: 30px;
        display: inline;
      }
    }

    .title {
      font-size: 14px;
    }

    .deleteVal {
      padding: 0 10px;
    }
  }
}
</style>