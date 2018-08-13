<template>
  <div class="otherInOrOutVoucher">
    <zing-head v-if="showHead" :title="childTitle"></zing-head>
    <div class="vux-center" :style="computeStyle">
      <div style="min-height:calc(100% - 44px)">
        <group class="group-no-top-border">
          <x-input title="编号" disabled v-model="voucherInfo.pzId" class="fontColor"></x-input>
          <x-input v-show="!isChildVoucher" title="物品库" @click.native="openWareHoseList" disabled required placeholder="请选择物品库" :show-clear="false" autocapitalize="characters" v-model="voucherInfo.ckName" class="fontColor"></x-input>
          <datetime :disabled="!isUncommit" title="日&nbsp;期<i style='color:red'>*</i>" v-model="voucherInfo.inOrOutTime"></datetime>
          <x-input v-show="!isChildVoucher" title="类型" disabled v-model="typeValue" class="fontColor"></x-input>
          <x-input title="批次" disabled v-model="voucherInfo.pzId" class="fontColor"></x-input>
          <x-input v-show="isChildVoucher" title="主入库单" disabled v-model="parentVoucherInfo.pzId" class="fontColor"></x-input>
        </group>
        <!-- 借贷方向 -->
        <group v-show="!isChildVoucher" class="vux-1px-b">
          <div style="float:left;line-height:45px;margin-left:13px;width: 4.5em;">{{bankType}}</div>
          <checker v-model="voucherInfo.storageMethod" :disabled="!isUncommit" radio-required="true" type="radio" style="float:right;margin:5px 0px;"
              default-item-class="examineAspectItem"
              selected-item-class="examineAspectItem-selected"
              >
            <checker-item v-for="(item,index) in storageMethodOptions" :key="index" :value="item.key">{{item.value}}</checker-item>
          </checker>
        </group>
        <!-- 物品相关-->        
        <group class="goodsInformation">
          <div style="float:left;line-height:45px;margin-left:13px;width: 4.5em;">
            物品信息<i style="color:red">*</i>
          </div>
          <flexbox  v-show="isUncommit && voucherInfo.isPd !== 'true'" style="height:45px;background: #fbf9fe;">
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
            <div slot="cardRight" v-show="isUncommit" class="right">
              <i slot="icon" class="iconfont icon-shanchu2" @click="deleteItem(index)"></i>
            </div>
          </GridCard>
          <x-textarea title="备注" :max="200" :show-counter="false" v-model="voucherInfo.pzRemark"></x-textarea>
        </group>
        <!-- 任务核算 -->
        <group style="background-color:#fff">
          <group-title slot="title" v-show="!isChildVoucher" class="taskProject" style="height: 44px;line-height:44px;">
            <span style="font-size:17px;color:#40AFFC">任务核算</span>
            <x-button mini plain style="float: right;padding:0px 14px;margin: 7px 7px 0px 0px;color:#FF8000;border:1px solid #FF8000;" v-show="isUncommit" @click.native="taskAdd()">添加</x-button>
          </group-title>
          <div v-for="(item,index) in taskData" :key="index">
            <flexbox>
              <flexbox-item  @click.native="taskShow(index)">
                <div style="padding-left: 15px;" class="title">{{item.cardName}}</div>
              </flexbox-item>
              <flexbox-item>
                <x-input type="text" :show-clear="false" :disabled="false" v-model="item.taskPrice" placeholder="请输入正确金额" ></x-input>
              </flexbox-item>
              <i v-if="isUncommit" class="iconfont icon-shanchu" style="color: red;font-size: 25px;" @click="delRenwu(item,index)"></i>
            </flexbox>
            <div style="height: 10px;width: 100%;background: #fbf9fe"></div>
          </div>
        </group>
      </div>
      <!-- 底部按钮 -->
      <group>
        <flexbox :gutter="0" v-show="voucherInfo.pzStatus !== 'DSH'">
          <flexbox-item v-show="voucherInfo.pzStatus !== 'YSH'">
            <x-button type="primary" class="btn-save" @click.native="addOtherInData('SAVE')">保存</x-button>
          </flexbox-item>
          <flexbox-item class="twoButten">
            <x-button type="primary" class="btn-common" @click.native="addOtherInData('SUBMIT')">{{pzStatusText}}</x-button>
          </flexbox-item>
        </flexbox>
      </group>
    </div>

    <!-- 弹框模板 -->
    <task-selection :showTaskSelection="taskSelectionShow" @confirmTaskSelection="confirmTaskSelection" @cancleTaskSelection="cancleTaskSelection"></task-selection>
    <!-- 物品列表 -->
    <popup v-model="showGoodsList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-list ref="goodsListRef" :showAddGoods="true" :isComeBack="false" @doSome="doSome" :isReferenced="true" @loadGoods="loadGoods" @addGoods="addGoods" @goodsItemClick="goodsItemClick"></goods-list>
    </popup>
    <!-- 添加物品 -->
    <popup v-model="showGoodsAdd" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-add-or-update ref="goodsAddRef" :routing="voucherInfo.companyId" :isComeBack="false" @goodsAddOrUpdateBack="goodsAddOrUpdateBack" @goodsAddSuccessCall="goodsAddSuccessCall" :isReferenced="true"></goods-add-or-update>
    </popup>
    <!-- 物品出入库库位 -->
    <popup v-model="showGoodsInOrOut" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <goods-in-or-out ref="goodsInOrOutRef" :showAddDetails="showAddDetails" :voucherType="voucherInfo.voucherType" :ckId="voucherInfo.ckId" :ckName="voucherInfo.ckName" :selectedGoods="selectedGoods" @picked="picked" @goodsInOrOutBack="goodsInOrOutBack"></goods-in-or-out>
    </popup>
    <!-- 仓库列表 -->
    <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @warehouseItemClick="warehouseItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
    <!-- 任务选择 -->
    <popup should-rerender-on-show="true" v-model="showTaskDetail" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <task-detail ref="taskDetailRef" :loadingSelf="true" :transboardId="currentBoardId" :transListId="currentListId" :transCardId="currentCardId" :transRouting="voucherInfo.companyId" :defaultBack="false" @taskDetailBack="taskDetailBack"></task-detail>
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
import warehouseList from "./warehouseList";
import Scroll from "../../../components/scroll/Scroll";
import TaskSelection from "../../common/task/taskSelection";
import ZingHead from "../../../components/zingHead/ZingHead";
import GridCard from "../../../components/gridcard/GridCard";
import TaskDetail from "@/container/taskManage/taskDetail";
import { getImageUrl } from "@/utils/fn";
import GoodsList from "./goodsList";
import GoodsAddOrUpdate from "./goodsAddOrUpdate";
import GoodsInOrOut from "./goodsInOrOut";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  name: "otherInOrOutVoucher",
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
    GoodsList,
    GoodsInOrOut,
    GoodsAddOrUpdate
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
    isUncommit() {
      return this.voucherInfo.pzStatus === "WTJ";
    },
    showAddDetails() {
      if (this.currentDetailIndex !== -1) {
        return true;
      } else if (
        this.voucherInfo.storageMethod !== "once" ||
        this.ckOutMethod === "auto"
      ) {
        return false;
      } else {
        return true;
      }
    },
    computeStyle() {
      return {
        height:
          typeof this.voucherInfo.parentId === "string" &&
          this.voucherInfo.parentId.length > 0
            ? "calc(100% - 50px)"
            : "100%"
      };
    },
    isChildVoucher() {
      if (
        typeof this.voucherInfo.parentId === "string" &&
        this.voucherInfo.parentId.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    bankType() {
      if (this.voucherInfo.voucherType === "otherIn") {
        return "入库方式";
      } else {
        return "出库方式";
      }
    },
    storageMethodOptions() {
      if (this.voucherInfo.voucherType === "otherIn") {
        return [
          { key: "once", value: "一次入库" },
          { key: "batch", value: "分批入库" }
        ];
      } else {
        return [
          { key: "once", value: "一次出库" },
          { key: "batch", value: "分批出库" }
        ];
      }
    }
  },
  data() {
    return {
      productId2VoucherItem: {},

      showGoodsList: false,
      showGoodsAdd: false,
      showGoodsInOrOut: false,
      isShowGoodsInOrOutDetail: false, // 是否为查看出入库物品详情
      currentDetailIndex: -1,
      ckOutMethod: "hand",
      selectedGoods: {},

      voucherType: "",
      pzRowId: "",
      screenHeight: 0,
      typeValue: "",
      pzStatusText: "提交审核",
      childTitle: "子入库单",
      showWarehoseList: false,

      showTaskDetail: false,
      currentBoardId: "",
      currentListId: "",
      currentCardId: "",
      taskSelectionShow: false,
      taskData: [],
      deleteCardIdSpaceArr: [],
      boradIdArr: [],
      cardIdArr: [],
      listIdListArr: [],
      pzPriceSpaceArr: [],

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
      voucherInfoItems: [],
      parentVoucherInfo: {}
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
      if (this.voucherInfo.voucherType === "otherIn") {
        this.typeValue = "其他入库单";
        this.voucherInfo.voucherType = "otherIn";
      } else if (this.voucherInfo.voucherType === "otherOut") {
        this.typeValue = "其他出库单";
        this.voucherInfo.voucherType = "otherOut";
      }
      //初始化按钮显示
      if (this.voucherInfo) {
        if (this.voucherInfo.pzStatus === "DSH") {
          this.pzStatusText = "提交审核";
        } else if (this.voucherInfo.pzStatus === "YSH") {
          this.pzStatusText = "反审核";
        }
      }
      if (
        typeof this.voucherInfo.pzCardIdSpace === "string" &&
        this.voucherInfo.pzCardIdSpace.trim().length > 0
      ) {
        this.cardIdArr = this.voucherInfo.pzCardIdSpace.split(" ");
        this.listIdListArr = this.voucherInfo.pzListIdSpace.split(" ");
        this.boradIdArr = this.voucherInfo.pzBoradIdSpace.split(" ");
        this.taskData = [];
        this.voucherInfo.pzPriceSpace
          .trim()
          .split(" ")
          .forEach(item => {
            let arr = item.split("#");
            this.taskData.push({
              cardId: arr[0],
              cardName: arr[1],
              taskPrice: arr[2]
            });
          });
      }
    },
    voucherInfoInPzItemsParam(newVal, oldVal) {
      this.voucherInfoItems = newVal;
    }
  },
  created() {
    this.voucherInfo.companyId = this.$route.query.companyId;
    this.pzRowId = this.$route.query.pzRowId;
    this.voucherType = this.$route.query.voucherType;
    this.voucherInfo.parentId = this.$route.query.parentId;
    if (this.voucherType === "otherIn") {
      this.typeValue = "其他入库单";
      this.voucherInfo.voucherType = "otherIn";
    } else {
      this.typeValue = "其他出库单";
      this.childTitle = "子出库单";
      this.voucherInfo.voucherType = "otherOut";
    }
    //相当于init()当页面初始化结束时调用
    this.screenHeight = document.documentElement.clientHeight - 100;
    if (typeof this.pzRowId !== "string" || this.pzRowId.length < 1) {
      //获取凭证编号
      this.loadVoucherNum();
      //获取当前时间
      this.getNewDate();
    }
    //获取是否需要添加任务核算项
    this.getCKSetting();
    //    任务核算项
    if (this.isChildVoucher) {
      let rowId = this.$route.query.pzRowId;
      if (typeof rowId === "string" && rowId.length > 0) {
        this.loadVoucherDetail();
      }
    }
  },
  methods: {
    openWareHoseList() {
      this.showWarehoseList = true;
    },
    warehouseItemClick(data) {
      this.ckOutMethod = data.ckOutMethod;
      this.voucherInfo.ckId = data.rowId;
      this.voucherInfo.ckName = data.ckName;
      this.voucherInfo.dataType = data.ckType;
      this.voucherInfo.ckProjectId = data.ckProjectId;
      this.showWarehoseList = false;
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    soCodeStorage() {},
    spaceChange() {
      if (this.voucherInfo.ckId !== "") {
        this.findResourceLibraryInfoByRowId(this.voucherInfo.ckId);
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
      //提示添加物品
      if (this.voucherInfoItems.length === 0) {
        this.$vux.toast.text("请先添加物品!");
        return;
      }

      if (
        this.voucherInfo.pzStatus !== "YSH" &&
        this.isNeedTask &&
        this.cardIdArr.length === 0
      ) {
        this.$vux.toast.text("请添加任务核算项");
        return;
      }

      let amountReceivable = 0; // 应收金额
      let amountCollected = 0; // 实收金额
      this.voucherInfoItems.forEach(function(item) {
        amountReceivable += parseFloat(item.pzPrice) * parseFloat(item.pzCount);
        amountCollected += parseFloat(item.pzAccount);
      });
      amountCollected = isNaN(amountCollected) ? 0 : amountCollected;
      this.voucherInfo.cheapPre = parseFloat(
        (amountReceivable - amountCollected) / amountReceivable * 100
      ).toFixed(2);
      this.voucherInfo.cheapPrice = amountReceivable - amountCollected;
      this.voucherInfo.deleteCardIdSpace = this.deleteCardIdSpaceArr.join(" ");
      this.voucherInfo.pzBoradIdSpace = this.boradIdArr.join(" ");
      this.voucherInfo.pzCardIdSpace = this.cardIdArr.join(" ");
      this.voucherInfo.pzListIdSpace = this.listIdListArr.join(" ");
      this.voucherInfo.pzPriceSpace = "";
      let reg1 = /^[+-]?\d*\.?\d{0,2}$/;
      let flag = false;
      let total = 0;
      this.taskData.forEach(item => {
        if (!reg1.test(item.taskPrice)) {
          flag = true;
        } else {
          total += parseFloat(item.taskPrice);
          this.voucherInfo.pzPriceSpace +=
            item.cardId + "#" + item.taskPrice + " ";
        }
      });
      if (this.taskData.length > 0) {
        if (flag) {
          this.$vux.toast.text("请输入任务金额");
          return;
        } else if (total != this.voucherInfo.pzFirstMoney) {
          this.$vux.toast.text("任务金额必须与总金额一致!");
          return;
        }
      }

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
            if (
              typeof this.$route.query.parentId === "string" &&
              this.$route.query.parentId.length > 0
            ) {
              query.parentId = this.$route.query.parentId;
              if (this.voucherInfo.voucherType === "otherIn") {
                query.voucherType = "childOtherIn";
              } else {
                query.voucherType = "childOtherOut";
              }
            }
            //跳转发起审批页面
            this.$router.push({
              path: "/workflow/workflowMain",
              query
            });
          } else {
            this.$router.push({
              path: "/resourceLibrary/goodsWarehouse/otherInOrOutList",
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
    taskAdd() {
      this.taskSelectionShow = true;
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
    confirmTaskSelection(data) {
      //获得任务页面返回数据
      if (
        this.cardIdArr.length > 0 &&
        this.cardIdArr.join(" ").indexOf(data.cardId) >= 0
      ) {
        this.$vux.toast.text("任务已存在，请重新选择");
        return false;
      }
      this.taskData.push({
        cardId: data.cardId,
        cardName: data.title,
        taskPrice: ""
      });
      this.boradIdArr.push(data.boardId);
      this.cardIdArr.push(data.cardId);
      this.listIdListArr.push(data.listId);
      this.taskSelectionShow = false;
    },
    cancleTaskSelection() {
      this.taskSelectionShow = false;
    },
    taskShow(index) {
      //查看crad
      //this.taskSelectionShow = true;
      this.currentBoardId = this.boradIdArr[index];
      this.currentListId = this.listIdListArr[index];
      this.currentCardId = this.cardIdArr[index];

      this.showTaskDetail = true;
      this.$refs.taskDetailRef.loading();
    },
    taskDetailBack() {
      this.showTaskDetail = false;
    },
    delRenwu(item, index) {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.taskData.splice(index, 1);
          _this.cardIdArr.splice(index, 1);
          _this.listIdListArr.splice(index, 1);
          _this.boradIdArr.splice(index, 1);
        }
      });
    },
    //获取是否需要添加任务核算项
    getCKSetting() {
      this.$http
        .get("/zingbiz/resourceLibrary/setting/selectResourceLibrarySetting", {
          params: {
            settingType: "WITHTRELLO",
            ckType: "WP"
          }
        })
        .then(res => {
          if (
            res.data.data.length > 0 &&
            "true" === res.data.data[0]["withTrello"]
          ) {
            this.isNeedTask = true;
          } else {
            this.isNeedTask = false;
          }
        });
    },
    //获取凭证编号
    loadVoucherNum() {
      let params = {
        voucherType: this.voucherType
      };
      if (
        typeof this.$route.query.parentId !== "undefined" &&
        this.$route.query.parentId.length > 0
      ) {
        params.parentId = this.$route.query.parentId;
      }
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/getVoucherNumber", {
          params
        })
        .then(response => {
          if (response.data.success) {
            this.voucherInfo.pzId = response.data.data.pzId;
            if (
              typeof this.voucherInfo.parentId === "string" &&
              this.voucherInfo.parentId.length > 0
            ) {
              this.parentVoucherInfo = response.data.data.voucherInfo;
              this.voucherInfo.ckId = this.parentVoucherInfo.ckId;
              this.voucherInfo.ckName = this.parentVoucherInfo.ckName;

              this.productId2VoucherItemSetting();
            }
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
    },
    //图片路径转化
    getImageUrl,
    goodsListShow() {
      this.loadGoodsList();
      this.showGoodsList = true;
    },
    findResourceLibraryInfoByRowId(rowId) {
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/selectByRowId";
      this.$http
        .get(url, {
          params: {
            rowId
          }
        })
        .then(res => {
          if (res.data.success === true) {
            let data = res.data.data;

            this.ckOutMethod = data.ckOutMethod;
          } else {
            self.$vux.toast.text("数据错误");
          }
        });
    },
    goodsListHide() {
      this.showGoodsList = false;
    },
    loadGoodsList() {
      if (this.isChildVoucher) {
        let items = this.parentVoucherInfo.voucherInfoItems;
        let productIds = "";
        items.forEach(item => {
          productIds += item.productRowId + "#";
        });
        productIds = productIds.substring(0, productIds.length - 1);
        this.$refs.goodsListRef.loadGoods(productIds, data => {
          this.$refs.goodsListRef.resetDropdownPosition();
        });
      } else {
        this.$refs.goodsListRef.loadGoods(null, data => {
          this.$refs.goodsListRef.resetDropdownPosition();
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
      if (this.isChildVoucher) {
        let voucherItem = this.productId2VoucherItem[item.rowId];
        this.selectedGoods.pzPrice = voucherItem.pzPrice;
        this.selectedGoods.cheapPre = voucherItem.cheapPre;
      }
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

      this.showGoodsInOrOut = false;
      this.showGoodsList = false;
      this.currentDetailIndex = -1;
    },
    picked(data) {
      console.info(this.ckOutMethod);
      if (this.ckOutMethod === "auto") {
        // 自动出入库
        if (this.voucherInfo.voucherType === "otherIn") {
          this.addAutoInDetails(data, details => {
            data.voucherInfoItemDetails = details;
            if (this.isChildVoucher) {
              // 子出入库单
              this.checkChildNum(data, () => {
                this.setPickedData(data);
              });
            } else {
              this.setPickedData(data);
            }
          });
        } else {
          this.addAutoOutDetails(data, details => {
            details.forEach(item => {
              item.kwPrice = data.pzPrice;
            });
            data.voucherInfoItemDetails = details;
            if (this.isChildVoucher) {
              // 子出入库单
              this.checkChildNum(data, () => {
                this.setPickedData(data);
              });
            } else {
              this.setPickedData(data);
            }
          });
        }
      }
    },
    checkChildNum(data, fn) {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/loadChildInOrOutItem", {
          params: {
            rowId: this.$route.query.parentId
          }
        })
        .then(response => {
          let productNum = 0;
          response.data.data.forEach(item => {
            if (item.productRowId === data.productRowId) {
              productNum += parseInt(item.pzCount);
            }
          });
          let parentProductCount = this.productId2VoucherItem[data.productRowId]
            .pzCount;
          let num = parseInt(parentProductCount) - productNum;
          if (num < data.pzCount) {
            if (this.voucherInfo.voucherType === "otherIn") {
              this.$vux.toast.text("入库数量不能超过" + num);
            } else {
              this.$vux.toast.text("出库数量不能超过" + num);
            }
          } else {
            fn();
          }
        });
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
    },
    loadVoucherDetail() {
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/selectVoucherInfoById", {
          params: {
            rowId: this.$route.query.pzRowId,
            parentId: this.$route.query.parentId
          }
        })
        .then(response => {
          if (response.data.success) {
            this.voucherInfo = response.data.data;
            this.parentVoucherInfo = this.voucherInfo.parentVoucherInfo;
            let vItems = response.data.data.voucherInfoItems;
            vItems.forEach(element => {
              if (element.pzType === "inPz") {
                this.voucherInfoItems.push(element);
              }
            });
            if (this.voucherInfo) {
              if (this.voucherInfo.pzStatus === "DSH") {
                this.pzStatusText = "提交审核";
              } else if (this.voucherInfo.pzStatus === "YSH") {
                this.pzStatusText = "反审核";
              }
            }
            this.productId2VoucherItemSetting();
          }
        });
    },
    productId2VoucherItemSetting() {
      let items = this.parentVoucherInfo.voucherInfoItems;
      items.forEach(item => {
        this.productId2VoucherItem[item.productRowId] = item;
      });
    }
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/1px.less";
.otherInOrOutVoucher {
  .vux-x-input.disabled .weui-input {
    -webkit-text-fill-color: #000;
  }
}
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