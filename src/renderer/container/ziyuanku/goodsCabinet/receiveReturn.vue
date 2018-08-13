<template>
  <div class="receiveReturn">
    <ZingHead :title="pageTitle">
    </ZingHead>
    <div v-if="pageType == 1" class="page_content" :style="{ height: screenHeight + 'px'}">
      <group label-width="4.5em" label-margin-right="2em" style="width:100%">
        <x-input title="编号" v-model="formData.receiveRefundCode" readonly></x-input>
        <x-input title="物品名称" v-model="formData.productName" readonly></x-input>
        <x-input title="持有人" v-model="holderUser" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <x-input title="申请人" v-model="formData.receiveRefundUser" readonly></x-input>
        <datetime title="日期" v-model="formData.receiveRefundDate" readonly></datetime>
        <x-textarea title="备注" :max="200" name="description" v-model="formData.remark"></x-textarea>
        
      </group>
      <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="qrsqBtn">确认申请</x-button>
          </flexbox-item>
        </flexbox>
    </div>
    <div v-if="pageType == 2" class="page_content" :style="{ height: screenHeight + 'px'}">
      <group label-width="4.5em" label-margin-right="2em" style="width:100%">
        <x-input title="编号" v-model="formData.receiveRefundCode" readonly></x-input>
        <x-input title="物品名称" v-model="formData.productName" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <x-input title="退还者" v-model="formData.receiveRefundUser" readonly></x-input>
        <x-input title="被退还者" v-model="ownerUser" readonly></x-input>
        <datetime title="退还日期" v-model="formData.receiveRefundDate" readonly></datetime>
        <x-textarea title="备注" :max="200" name="description" v-model="formData.productRemark" readonly></x-textarea>
      </group>
       <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="thBtn">退还</x-button>
          </flexbox-item>
        </flexbox>
    </div>
  </div>
</template>


<script>
import {
  XHeader,
  XInput,
  XTextarea,
  Group,
  XButton,
  Cell,
  Flexbox,
  FlexboxItem,
  Datetime
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
export default {
  components: {
    XHeader,
    XInput,
    XTextarea,
    XButton,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    Datetime,
    ZingHead
  },
  data() {
    return {
      screenHeight: "0px",
      pageType: "", //1 - 申请页面, 2  - 退还页面
      pageTitle: "",
      formData: {
        cardUrl: "",
        dataStatus: "",
        dataType: "",
        holderUser: "",
        ownerUser: "",
        productName: "",
        productRowId: "",
        receiveRefundCode: "",
        receiveRefundUser: "",
        receiveRefundDate: "",
        remark: "",
        rowId: ""
      },
      holderUser: "",
      ownerUser: "",
      goodsRowId: ""
    };
  },
  created: function() {
    let _this = this;
    this.screenHeight = document.documentElement.clientHeight - 54;
    this.goodsRowId = this.$route.query.goodsRowId;
    this.pageType = this.$route.query.pageType;
    if (this.pageType === "1") {
      // bug
      this.pageTitle = "领取物品";
    } else {
      this.pageTitle = "退还物品";
    }

    let url1 = "/zingbiz/resourceLibrary/product/getOneProductByRowId";
    let url2 = "/zingbiz/resourceLibrary/receiveRefund/getReceiveRefundCode";

    this.$http
      .all([
        this.$http.get(url1, { params: { rowId: this.goodsRowId } }),
        this.$http.get(url2, {
          params: {
            productRowId: this.goodsRowId,
            dataType: "LQ"
          }
        })
      ])
      .then(
        this.$http.spread(function(ret1, ret2) {
          console.log("getProductByRowId", ret1.data);
          //console.log("getReceiveRefundCode", ret2.data.data.data);
          //处理数据
          _this.initData(ret1.data.data, ret2.data.data);
        })
      );
  },
  methods: {
    initData(data1, data2) {
      this.formData.receiveRefundCode = data2.receiveRefundCode;
      this.formData.receiveRefundUser = data2.receiveRefundUser;
      this.formData.productName = data1.productName;
      this.formData.holderUser = data1.holderUser;
      this.formData.ownerUser = data1.ownerUser;
      this.formData.remark = data1.productRemark;
      //                let strDate = this.getNowFormatDate()
      this.formData.receiveRefundDate = this.getNowFormatDate();

      this.holderUser = data1.holderUser.split("-")[1];
      this.ownerUser = data1.ownerUser.split("-")[1];
    },
    qrsqBtn() {
      //确认申请
      this.formData.dataStatus = "QRSQ";
      this.formData.dataType = "LQ";
      this.formData.productRowId = this.goodsRowId;
      console.log("确认申请数据", this.formData);
      this.sendMain(this.formData);
    },
    thBtn() {
      //退还
      let postParam = {
        dataStatus: "SQTH",
        dataType: "TH",
        holderUser: this.formData.ownerUser,
        oldCardUrl: this.formData.holderUser.split("-")[0],
        ownerUser: this.formData.ownerUser,
        productName: this.formData.productName,
        productRowId: this.goodsRowId,
        receiveRefundCode: this.formData.receiveRefundCode,
        receiveRefundDate: this.formData.receiveRefundDate,
        receiveRefundUser: this.formData.receiveRefundUser,
        remake: "",
        rowId: ""
      };
      this.sendMain(postParam);
    },
    sendMain(data) {
      let _this = this;
      let url = "/zingbiz/resourceLibrary/receiveRefund/insert";
      this.$http.post(url, data).then(res => {
        if (res.data.success) {
          switch (res.data.msg) {
            case "hasStartReceived":
              this.$vux.toast.text("已发起过申领");
              break;
            case "hasStartReturned":
              this.$vux.toast.text("已发起过退还");
              break;
            case "success":
              this.$vux.toast.show({
                text: "操作成功",
                type: "success",
                onHide() {
                  _this.$router.back(-1);
                }
              });
              break;
          }
        } else {
          _this.$vux.toast.show({
            text: "数据异常",
            type: "cancel",
            onHide() {
              _this.$router.back(-1);
            }
          });
        }
      });
    },
    getNowFormatDate() {
      //获取当前时间
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/unify.styl';
@import '~assets/stylus/mixin.styl';

.receiveReturn {
  height: 100%;
  width: 100%;

  .page_content {
    overflow-y: auto;
    flex-center(column, space-between, start);
  }
}
</style>