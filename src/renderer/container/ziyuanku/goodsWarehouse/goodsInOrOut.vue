<template>
  <div class="goodsInOrOut">
    <div class="otherin-popup">
      <zing-head class="popup-head" :title="headTitle" :isComeBack="false" @doSome="doSome"></zing-head>
      <div class="popup-form">
        <group>
          <image-picker :files="files" :selectable="false" :removable="false" multiple>
          </image-picker>
          <cell title="物品编码" v-model="voucherInfoItem.wpCode" class="cell-first"></cell>

          <cell title="业务描述">
            <span class="select" @click="togglePicker">
              <!--
              <pre v-if="!voucherInfoItem.pzServiceDesc && !voucherInfoItem.pzServiceDesc">请选择业务描述</pre>
              <pre v-else-if="voucherInfoItem.pzServiceDesc">{{voucherInfoItem.pzServiceDesc}}</pre>
              -->
              <pre>{{voucherInfoItem.pzServiceDesc}}</pre>
            </span>
          </cell>

          <cell title="科目代码">
            <span class="select" @click="togglePicker">
              <pre v-if="!voucherInfoItem.projectId">请选择科目代码</pre>
              <pre v-else-if="voucherInfoItem.projectId">{{voucherInfoItem.projectId}}</pre>
            </span>
          </cell>

          <cell title="科目名称">
            <span class="select" @click="togglePicker">
              <pre v-if="!voucherInfoItem.projectName">请选择科目名称</pre>
              <pre v-else-if="voucherInfoItem.projectName">{{voucherInfoItem.projectName}}</pre>
            </span>
          </cell>

          <x-input type="text" v-model="voucherInfoItem.pzCount"  title="总数量<i style='color:red'>*</i>" placeholder="请输入总数量" @on-change="calcPreAccount('pzCount')"></x-input>

          <x-input type="text" :disabled="pzPriceDisabled" v-model="voucherInfoItem.pzPrice" title="单价(元)<i style='color:red'>*</i>" placeholder="请输入单价" @on-change="calcPreAccount('pzPrice')"></x-input>

          <x-input type="text" v-model="voucherInfoItem.pzUnit" disabled title="计量单位" placeholder="计量单位"></x-input>

          <x-input type="text" :disabled="cheapPreDisabled" v-model="voucherInfoItem.cheapPre" title="折扣率（%）" placeholder="折扣率" @on-change="calcPreAccount('cheapPre')"></x-input>

          <x-input type="text" v-model="voucherInfoItem.cheapAccount" title="折扣金额（元）" disabled placeholder="折扣金额（元）"></x-input>

          <x-input type="text" v-model="voucherInfoItem.pzAccount" title="总金额" disabled placeholder="总金额"></x-input>
        </group>

        <group v-if="showAddDetails" v-for="(voucherInfoItemDetail, index) in voucherInfoItemDetails" :key="index">
          <group-title slot="title" style="height: 15px;">
            <i v-if="voucherInfoItemDetails.length > 1" class="iconfont icon-shanchu2" v-on:click="delEntry(index)" style="float: right;font-size: 30px;margin-top: -11px;margin-right: -10px;"></i>
          </group-title>
          <cell v-if="isVoucherOut" class="vux-1px-b">
            <span slot="title">批次
              <i style="color:red">*</i>
            </span>
            <span class="select" @click="togglePopup(index)">
              <pre v-if="!voucherInfoItemDetail.fromPzId">请选择批次</pre>
              <pre v-else>{{voucherInfoItemDetail.fromPzId}}</pre>
            </span>
          </cell>
          <cell v-if="isVoucherOut" class="vux-1px-b">
            <span slot="title">物品库
              <i style="color:red">*</i>
            </span>
            <span class="select" @click="togglePopup(index)">
              <pre v-if="!voucherInfoItemDetail.ckName">选择批次后自动填入</pre>
              <pre v-else>{{voucherInfoItemDetail.ckName}}</pre>
            </span>
          </cell>
          <cell class="vux-1px-b">
            <span slot="title">库位
              <i style="color:red">*</i>
            </span>
            <span class="select" @click="togglePopup(index)">
              <pre v-if="!voucherInfoItemDetail.kwName">请选择库位</pre>
              <pre v-else>{{voucherInfoItemDetail.kwName}}</pre>
            </span>
          </cell>

          <x-input v-model="voucherInfoItemDetail.productCount" type="text" title="数量<i style='color:red'>*</i>" placeholder="数量"></x-input>
        </group>
        <flexbox gutter="0" style="margin-top:20px;margin-bottom:15px;">
          <flexbox-item v-if="showAddDetails">
            <x-button @click.native="addLocat" type="primary" class="btn-common">增加库位</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="save" class="btn-save" type="primary">保存</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <subject-picker :showPicker="showPicker" @picked="onPicked" @abort="onPickAbort"></subject-picker>
    <popup style="background:#fff" v-model="showLocationList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <location-list ref="locationListRef" :isReferenced="true" :isComeBack="false" @locationItemClick="locationItemClick" @locationListBack="locationListBack"></location-list>
    </popup>
    <popup style="background:#fff" v-model="showBatchList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <batch-list ref="batchListRef" @batchListBack="batchListBack" @itemClick="batchListItemClick"></batch-list>
    </popup>
  </div>
</template>

<script>
import {
  Popup,
  XDialog,
  XInput,
  XButton,
  Group,
  GroupTitle,
  Cell,
  Selector,
  Flexbox,
  FlexboxItem,
  XTextarea
} from "vux";
import ZingHead from "components/zingHead/ZingHead";
import Scroll from "components/scroll/Scroll";
import ImagePicker from "components/imagepicker/ImagePicker.vue";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import LocationList from "./locationList";
import BatchList from "./batchList";
import { WSAEPROTONOSUPPORT } from "constants";
import { Z_IsEmpty } from "@/utils/fn";
export default {
  name: "goodsInOrOut",
  components: {
    Flexbox,
    FlexboxItem,
    Popup,
    XDialog,
    XInput,
    XButton,
    Group,
    GroupTitle,
    Cell,
    Selector,
    XTextarea,
    ZingHead,
    ImagePicker,
    SubjectPicker,
    LocationList,
    BatchList
  },
  props: {
    selectedGoods: {
      type: Object,
      default: function() {
        return {};
      }
    },
    ckId: {
      type: String
    },
    ckName: {
      type: String
    },
    voucherType: {
      type: String
    },
    showAddDetails: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPicker: false,
      showLocationList: false,
      showBatchList: false,
      currentIndex: 0,

      voucherInfoItem: {
        wpCode: "",
        pzServiceDesc: "",
        projectId: "",
        projectName: "",
        pzCount: "",
        pzAccount: "",
        pzUnit: "",
        cheapPre: "",
        cheapAccount: "",
        pzPrice: ""
      },

      voucherInfoItemDetails: [
        {
          kwName: "",
          productCount: ""
        }
      ]
    };
  },
  watch: {
    selectedGoods: {
      handler(newVal, oldVal) {
        this.recoveryData();

        this.$set(this.voucherInfoItem, "pzImgs", newVal.productImgs);
        this.$set(this.voucherInfoItem, "projectId", newVal.productProjectCode);
        this.$set(
          this.voucherInfoItem,
          "projectName",
          newVal.productProjectName
        );
        this.$set(
          this.voucherInfoItem,
          "pzServiceDesc",
          newVal.productProjectDesc
        );
        this.$set(this.voucherInfoItem, "wpCode", newVal.productCode);
        this.$set(this.voucherInfoItem, "dataType", "WP");
        this.$set(this.voucherInfoItem, "productRowId", newVal.rowId);
        this.$set(this.voucherInfoItem, "pzType", "inPz");
        this.$set(this.voucherInfoItem, "voucherType", newVal.voucherType);
        this.$set(this.voucherInfoItem, "productName", newVal.productName);
        this.$set(this.voucherInfoItem, "pzUnit", newVal.productUnit);
        let inArr = ["saleOut","saleBack"];
        if (inArr.indexOf(this.voucherType) >= 0) {
          this.$set(this.voucherInfoItem, "pzPrice", newVal.xsPrice);
        } else {
          this.$set(this.voucherInfoItem, "pzPrice", newVal.productAvgPrice);
        }
        this.$set(this.voucherInfoItem, "cheapPre", "");
        this.$set(this.voucherInfoItem, "ckId", this.ckId);
        this.$set(this.voucherInfoItem, "ckName", this.ckName);
      },
      deep: false
    }
  },
  computed: {
    files() {
      if (
        typeof this.voucherInfoItem.pzImgs === "string" &&
        this.voucherInfoItem.pzImgs.trim().length > 0
      ) {
        return [{ url: this.voucherInfoItem.pzImgs.split(" ")[0] }];
      } else {
        return [];
      }
    },
    headTitle() {
      let inArr = ["otherIn", "buyIn", "saleBack"];
      if (inArr.indexOf(this.voucherType) >= 0) {
        return "物品入库";
      } else {
        return "物品出库";
      }
    },
    isVoucherOut() {
      let inArr = ["otherIn", "buyIn", "saleBack"];
      if (inArr.indexOf(this.voucherType) >= 0) {
        return false;
      } else {
        return true;
      }
    },
    pzPriceDisabled() {
      let inArr = ["saleOut","otherOut","buyBack"];
      if (inArr.indexOf(this.voucherType) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    cheapPreDisabled() {
      let inArr = ["otherOut","buyBack"];
      if (inArr.indexOf(this.voucherType) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    initData(item) {
      this.recoveryData();
      //Object.assign(this.$refs.goodsInOrOutRef.files
      if (Z_IsEmpty(item.cheapPre)) {
        item.cheapPre = "";
      }
      Object.assign(this.voucherInfoItem, item);
      delete this.voucherInfoItem.pzImgs;
      this.$set(this.voucherInfoItem, "pzImgs", item.pzImgs);

      let itemDetails = item.voucherInfoItemDetails;
      if (
        typeof itemDetails !== "undefined" &&
        itemDetails !== null &&
        itemDetails.length > 0
      ) {
        Object.assign(this.voucherInfoItemDetails, itemDetails);
      }
    },
    batchListBack() {
      this.showBatchList = false;
    },
    batchListItemClick(val) {
      let flag = false;
      this.voucherInfoItemDetails.forEach(item => {
        if (item.fromPzRowId === val.rowId) {
          flag = true;
        }
      });
      if (flag) {
        this.$vux.toast.text("库位已添加，请选择其他库位");
        return;
      }

      Object.assign(this.voucherInfoItemDetails[this.currentIndex], val, {
        status: "",
        fromPzItemId: val.pzItemId,
        fromPzRowId: val.rowId,
        pzItemId: "",
        fromPzId: val.pzId,
        pzId: "",
        productCount: ""
      });
      this.showBatchList = false;
    },
    calcPreAccount(type) {
      // 验证价格
      let result = true;
      let reg1 = /^[+-]?\d*\.?\d{0,2}$/;
      let reg2 = /^\d{1,8}\.{0,1}(\d{1,2})?$/;

      if (type === "pzPrice") {
        if (!reg1.test(this.voucherInfoItem.pzPrice)) {
          this.voucherInfoItem.pzPrice = "";
          result = false;
        }
      }
      if (type === "cheapPre") {
        if (!reg1.test(this.voucherInfoItem.cheapPre)) {
          this.voucherInfoItem.cheapPre = "";
          result = false;
        }
      }
      if (type === "pzCount") {
        if (!reg2.test(this.voucherInfoItem.pzCount)) {
          this.voucherInfoItem.pzCount = "";
          result = false;
        }
      }
      if (!result) return;

      let price = this.voucherInfoItem.pzPrice;
      let count = this.voucherInfoItem.pzCount;
      if (price && !isNaN(price) && count && !isNaN(count)) {
        let total = parseFloat(price).toFixed(2) * parseFloat(count).toFixed(2);

        if (
          this.voucherInfoItem.cheapPre &&
          !isNaN(this.voucherInfoItem.cheapPre)
        ) {
          let preTotal =
            parseFloat(price).toFixed(2) *
            (parseFloat(this.voucherInfoItem.cheapPre).toFixed(2) / 100) *
            parseFloat(count).toFixed(2);

          total =
            parseFloat(total).toFixed(2) - parseFloat(preTotal).toFixed(2);
          this.voucherInfoItem.cheapAccount = parseFloat(preTotal).toFixed(2);
        } else {
          this.voucherInfoItem.cheapAccount = "0.00";
        }
        this.voucherInfoItem.pzAccount = parseFloat(total).toFixed(2);
      } else {
        this.voucherInfoItem.pzAccount = "0.00";
      }
    },
    locationListBack() {
      this.showLocationList = false;
    },
    locationItemClick(data) {
      let flag = false;
      this.voucherInfoItemDetails.forEach(item => {
        if (item.kwId === data.rowId) {
          flag = true;
        }
      });
      if (flag) {
        this.$vux.toast.text("库位已添加，请选择其他库位");
        return;
      }

      this.voucherInfoItemDetails[this.currentIndex].ckId = this.ckId;
      this.voucherInfoItemDetails[this.currentIndex].ckName = this.ckName;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].productUnit = this.selectedGoods.productUnit;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].productId = this.selectedGoods.rowId;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].productImg = this.selectedGoods.productImgs;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].productName = this.selectedGoods.productName;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].productCode = this.selectedGoods.productCode;

      this.voucherInfoItemDetails[
        this.currentIndex
      ].kwPrice = this.voucherInfoItem.pzAccount;

      this.voucherInfoItemDetails[this.currentIndex].kwId = data.rowId;

      this.voucherInfoItemDetails[this.currentIndex].kwName =
        data.ckLocationName;

      this.showLocationList = false;
    },
    doSome() {
      this.$emit("goodsInOrOutBack");
    },
    togglePicker() {
      this.showPicker = true;
    },
    onPicked(item) {
      this.showPicker = false;
      this.voucherInfoItem.pzServiceDesc = item.description;
      this.voucherInfoItem.projectId = item.fileId;
      this.voucherInfoItem.projectName = item.filename;
    },
    onPickAbort() {
      this.showPicker = false;
    },
    delEntry(index) {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.voucherInfoItemDetails.splice(index, 1);
        }
      });
    },
    togglePopup(index) {
      this.currentIndex = index;
      let inArr = ["otherIn", "buyIn", "saleBack"];
      if (inArr.indexOf(this.voucherType) >= 0) {
        const params = {
          ckId: this.ckId,
          pageNumber: "0",
          pageSize: "10"
        };
        this.$refs.locationListRef.loadLiactions(params);
        this.showLocationList = true;
      } else {
        let batchQueryParam = {
          ckId: this.ckId,
          productId: this.selectedGoods.rowId,
          status: "YSH"
        };
        this.$refs.batchListRef.loadVoucherItemDetails(batchQueryParam);
        this.showBatchList = true;
      }
    },
    addLocat() {
      this.voucherInfoItemDetails.push({
        kwName: "",
        productCount: ""
      });
    },
    isNull(val) {
      return typeof val === "undefined" || val === null || val.trim() === "";
    },
    check() {
      if (this.isNull(this.voucherInfoItem.pzCount)) {
        this.$vux.toast.text("请填写物品总数量");
        return false;
      }

      if (this.isNull(this.voucherInfoItem.pzPrice)) {
        this.$vux.toast.text("请填写物品单价");
        return false;
      }

      if (this.showAddDetails) {
        let total = 0;
        for (let i = 0; i < this.voucherInfoItemDetails.length; i++) {
          let item = this.voucherInfoItemDetails[i];
          let kwId = item.kwId;
          let productCount = item.productCount;
          if (
            typeof kwId === "undefined" ||
            kwId === null ||
            kwId.trim() === ""
          ) {
            this.$vux.toast.text("请选择库位");
            return false;
          }

          if (
            typeof productCount === "undefined" ||
            productCount === null ||
            productCount === ""
          ) {
            this.$vux.toast.text("请填写库位对应物品数量");
            return false;
          }

          total += parseInt(productCount);
        }

        if (parseInt(this.voucherInfoItem.pzCount) !== total) {
          this.$vux.toast.text("所选库位物品数量不等物品总数");
          return false;
        }
      }

      return true;
    },
    save() {
      if (this.check()) {
        let data = JSON.parse(JSON.stringify(this.voucherInfoItem));
        if (this.showAddDetails) {
          data.voucherInfoItemDetails = JSON.parse(
            JSON.stringify(this.voucherInfoItemDetails)
          );
        }

        this.$emit("picked", data);
      }
    },
    recoveryData() {
      this.voucherInfoItem = {
        wpCode: "",
        pzServiceDesc: "",
        projectId: "",
        projectName: "",
        pzCount: "",
        pzPrice: "",
        pzUnit: "",
        cheapPre: "",
        cheapAccount: "",
        pzAccount: ""
      };
      this.voucherInfoItemDetails = [
        {
          kwName: "",
          productCount: ""
        }
      ];
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.goodsInOrOut {
  position: relative;
  height: 100%;

  .vux-flex-row {
    margin-bottom: 0 !important;
  }

  .otherin-popup {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .popup-head {
      flex-shrink: 0;
    }

    .popup-form {
      height: 100%;
      flex-grow: 1;
      overflow-y: auto;
      background: #fbf9fe;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
