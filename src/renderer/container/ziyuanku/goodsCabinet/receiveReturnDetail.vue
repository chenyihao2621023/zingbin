<template>
  <div class="refundable">
    <ZingHead :title="pageTitle">
    </ZingHead>
    <div v-if="pageType === '1'" style="height:100%">
      <group label-width="4.5em" class="page_content" label-margin-right="2em">
        <x-input title="编号" v-model="formData.receiveRefundCode" readonly></x-input>
        <x-input title="物品名称" v-model="formData.productName" readonly></x-input>
        <x-input title="持有人" v-model="holderUser" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <x-input title="申请人" v-model="formData.receiveRefundUser" readonly></x-input>
        <datetime title="日期" v-model="formData.receiveRefundDate" readonly></datetime>
        <x-textarea title="备注" :max="200" name="description" v-model="formData.remake"></x-textarea>
      </group>
      <div v-if="btnType == 'ownLQ'">
          <flexbox>
            <flexbox-item>
              <x-button class="btn-common" type="warn" @click.native="qxshBtn">取消申请</x-button>
            </flexbox-item>
          </flexbox>
        </div>
        <div v-if="btnType == 'noOwnLQ'">
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary btn-save" @click.native="tyshBtn">同意申请</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="warn btn-common" @click.native="jjshBtn">拒绝申请</x-button>
            </flexbox-item>
          </flexbox>
        </div>
    </div>
    <div v-if="pageType == 2" style="height:100%">
      <group label-width="4.5em" class="page_content" label-margin-right="2em">
        <x-input title="编号" v-model="formData.receiveRefundCode" readonly></x-input>
        <x-input title="物品名称" v-model="formData.productName" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <x-input title="退还者" v-model="formData.receiveRefundUser" readonly></x-input>
        <x-input title="被退还者" v-model="ownerUser" readonly></x-input>
        <datetime title="退还日期" v-model="formData.receiveRefundDate" readonly></datetime>
        <x-textarea title="备注" :max="200" name="description" v-model="formData.remake" readonly></x-textarea>
      </group>
      <div v-if="btnType == 'ownHT'">
          <flexbox>
            <flexbox-item>
              <x-button class="btn-common" type="warn" @click.native="qxthBtn">取消退还</x-button>
            </flexbox-item>
          </flexbox>
        </div>
        <div v-if="btnType == 'noOwnTH'">
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary btn-save" @click.native="tythBtn">同意退还</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="warn btn-common" @click.native="jjthBtn">拒绝退还</x-button>
            </flexbox-item>
          </flexbox>
        </div>
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
      pageType: "", //1 - 申请页面, 2  - 退还页面
      pageTitle: "",
      btnType: "", //ownLQ - 取消申请, noOwnLQ - 同意申请，拒绝申请
      //ownTH - 取消退还, noOwnTH - 同意退还，拒绝退还
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
        remake: "",
        rowId: ""
      },
      holderUser: "",
      ownerUser: "",
      goodsRowId: "",
      cardUrl: "", //当前用户的cardUrl,
      receiveRefundRowId: "" //订单的id
    };
  },
  created: function() {
    let _this = this;
    this.goodsRowId = this.$route.query.goodsRowId;
    this.pageType = this.$route.query.pageType;
    this.receiveRefundRowId = this.$route.query.receiveRefundRowId;
    if (this.pageType === "1") {
      this.pageTitle = "领取物品";
    } else {
      this.pageTitle = "退还物品";
    }

    let url1 =
      "/zingbiz/resourceLibrary/receiveRefund/getOneReceiveRefundByRowId";
    let url2 =
      "/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl";

    this.$http
      .all([
        this.$http.get(url1, { params: { rowId: this.receiveRefundRowId } }),
        this.$http.post(url2, {})
      ])
      .then(
        this.$http.spread(function(ret1, ret2) {
          //处理数据
          _this.initData(ret1.data.data, ret2.data.data);
          _this.initBtn(
            ret1.data.data.cardUrl,
            ret2.data.data.cardUrl,
            _this.pageType,
            ret1.data.data.dataStatus
          );
        })
      );
  },
  methods: {
    initData(data1, data2) {
      this.formData.receiveRefundCode = data1.receiveRefundCode;
      this.formData.receiveRefundUser = data1.receiveRefundUser;
      this.formData.productName = data1.productName;
      this.formData.holderUser = data1.holderUser;
      this.formData.ownerUser = data1.ownerUser;
      this.formData.remark = data1.productRemark;
      this.formData.cardUrl = data1.cardUrl;
      this.formData.rowId = data1.rowId;
      //                let strDate = this.getNowFormatDate()
      this.formData.receiveRefundDate = this.getNowFormatDate();

      this.holderUser = data1.holderUser.split("-")[1];
      this.ownerUser = data1.ownerUser.split("-")[1];

      this.cardUrl = data1.cardUrl;
    },
    initBtn(cardUrl1, cardUrl2, pageType, dataStatus) {
      if (pageType === "1") {
        if (
          dataStatus === "QXSQ" ||
          dataStatus === "JJSQ" ||
          dataStatus === "TYSQ"
        ) {
          //取消申请
          this.btnType = "noBtn";
        } else {
          if (cardUrl1 === cardUrl2) {
            this.btnType = "ownLQ";
          } else {
            this.btnType = "noOwnLQ";
          }
        }
      } else if (pageType === "2") {
        if (
          dataStatus === "QRTH" ||
          dataStatus === "JJTH" ||
          dataStatus === "QXTH"
        ) {
          this.btnType = "noOwnLQ";
        } else {
          if (cardUrl1 === cardUrl2) {
            this.btnType = "ownHT";
          } else {
            this.btnType = "noOwnTH";
          }
        }
      }
    },
    qxshBtn() {
      //取消申请
      this.formData.dataStatus = "QXSQ";
      this.formData.dataType = "LQ";
      this.formData.productRowId = this.goodsRowId;
      this.formData.cardUrl = this.cardUrl;
      this.formData.rowId = this.receiveRefundRowId;
      this.sendMain(this.formData);
    },
    tyshBtn() {
      //同意申请
      this.formData.dataStatus = "TYSQ";
      this.formData.dataType = "LQ";
      this.formData.productRowId = this.goodsRowId;
      this.sendMain(this.formData);
    },
    jjshBtn() {
      //拒绝申请
      let postParmas = {
        cardUrl: this.formData.cardUrl,
        dataStatus: "JJSQ",
        dataType: "LQ",
        holderUser: this.formData.holderUser,
        ownerUser: this.formData.ownerUser,
        productName: this.formData.productName,
        productRowId: this.goodsRowId,
        receiveRefundCode: this.formData.receiveRefundCode,
        receiveRefundDate: this.formData.receiveRefundDate,
        receiveRefundUser: this.formData.receiveRefundUser,
        remake: this.formData.remake,
        rowId: this.receiveRefundRowId
      };
      console.log("拒绝申请数据", postParmas);
      this.sendMain(postParmas);
    },
    qxthBtn() {
      //取消退还
      let postParmas = {
        dataStatus: "QXTH",
        dataType: "TH",
        holderUser: this.formData.ownerUser,
        oldCardUrl: this.formData.cardUrl,
        ownerUser: this.formData.ownerUser,
        productName: this.formData.productName,
        productRowId: this.goodsRowId,
        receiveRefundCode: this.formData.receiveRefundCode,
        receiveRefundDate: this.formData.receiveRefundDate,
        receiveRefundUser: this.formData.receiveRefundUser,
        remake: this.formData.remake,
        rowId: this.receiveRefundRowId
      };
      console.log("取消退还数据", postParmas);
      this.sendMain(postParmas);
    },
    jjthBtn() {
      //拒绝退还
      let postParmas = {
        dataStatus: "JJTH",
        dataType: "TH",
        holderUser: this.formData.holderUser,
        oldCardUrl: this.formData.cardUrl,
        ownerUser: this.formData.ownerUser,
        productName: this.formData.productName,
        productRowId: this.goodsRowId,
        receiveRefundCode: this.formData.receiveRefundCode,
        receiveRefundDate: this.formData.receiveRefundDate,
        receiveRefundUser: this.formData.receiveRefundUser,
        remake: this.formData.remake,
        rowId: this.receiveRefundRowId
      };
      console.log("拒绝退还数据", postParmas);
      this.sendMain(postParmas);
    },
    tythBtn() {
      //同意退还
      let postParmas = {
        dataStatus: "QRTH",
        dataType: "TH",
        holderUser: this.formData.holderUser,
        oldCardUrl: this.formData.cardUrl,
        ownerUser: this.formData.ownerUser,
        productName: this.formData.productName,
        productRowId: this.goodsRowId,
        receiveRefundCode: this.formData.receiveRefundCode,
        receiveRefundDate: this.formData.receiveRefundDate,
        receiveRefundUser: this.formData.receiveRefundUser,
        remake: this.formData.remake,
        rowId: this.receiveRefundRowId
      };
      console.log("同意退还数据", postParmas);
      this.sendMain(postParmas);
    },
    sendMain(data) {
      let _this = this;
      let url = "/zingbiz/resourceLibrary/receiveRefund/update";
      this.$http.post(url, data).then(res => {
        if (res.data.success) {
          this.$vux.toast.show({
            text: "操作成功",
            type: "success",
            onHide() {
              _this.$router.back(-1);
            }
          });
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
@import '../../../assets/stylus/unify.styl';

.refundable {
  height: 100%;

  .page_content {
    height: calc(100% - 94px);
  }
}
</style>