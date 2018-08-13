<template>
  <div class="voucherListChoise">
    <zing-head v-show="isPop" :isComeBack="false" @doSome="doSome" :title="'凭证选择'"></zing-head>
    <div class="prompt" v-show="prompt">该状态下没有数据</div>
    <div class="scrollContent">
      <GridCard v-for="(item,index) in list" :key="index" @click.native="itemClick(item)">
        <div slot="cardLeft" class="left">
          <avatar shape="square" :src="getImageUrl(item.pzShowImg,'./static/images/userDef_.jpg')"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.pzId}}</p>
            <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
          </div>
        </div>
        <div slot="cardRight" class="right">
          <check-icon :value.sync="item.isChecked" @click.native="itemClick(item)"></check-icon>
        </div>
      </GridCard>
    </div>
    <div>
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button class="btn-save" type="primary" @click.native="cancle">取消</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button class="btn-common" type="warn" @click.native="choose">选择</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  Flexbox,
  FlexboxItem,
  XDialog,
  Confirm,
  XButton,
  CheckIcon
} from "vux";
import Dropdown from "../../../components/dropdown/Dropdown";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import scroll from "@/components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
import { getImageUrl } from "@/utils/fn";
export default {
  components: {
    Flexbox,
    FlexboxItem,
    CheckIcon,
    Dropdown,
    GridCard,
    Avatar,
    Tag,
    XDialog,
    scroll,
    Confirm,
    XButton,
    ZingHead
  },
  props: {
    pzStatus: {
      default: "YSH"
    },
    isPop: {
      default: true
    }
  },
  data() {
    return {
      getImageUrl,
      rowIds: "",
      defaultPzStatus: "YSH",
      prompt: false,
      list: [],
      datas: [
        {
          content: "新建凭证",
          url: "/resourceLibrary/financeWarehouse/voucherAdd"
        }
      ]
    };
  },
  created() {
    //this.loadVoucherInfos();
  },
  methods: {
    cancle() {
      this.$emit("voucherListChoiseCancle", this.isPop);
    },
    choose() {
      this.$emit("voucherListChoiseChoose", this.isPop, this.rowIds.trim());
    },
    doSome() {
      this.$emit("voucherListChoiseBack");
    },
    itemClick(item, e) {
      item.isChecked = !item.isChecked;
      this.rowIds = this.rowIds.replace(item.rowId, "");
      if (item.isChecked) {
        this.rowIds += item.rowId + " ";
      }
      this.rowIds = this.rowIds.split(/\s+/).join(" ");
    },
    loadVoucherInfos(ckId) {
      let params = {
        pzStatus: this.defaultPzStatus,
        ckId,
        voucherType: "CW",
        pageNumber: 0,
        pageSize: 2000
      };
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/queryVoucher", {
          params
        })
        .then(response => {
          if (response.data.total !== 0) {
            let data = response.data.data;
            data.forEach(val => {
              if (!val.accountMethod) {
                if (val.pzWorkId === "") {
                  val.tagText = "凭证未提交";
                } else {
                  val.tagText = "财务凭证";
                }
              } else {
                val.tagText = "其他消费凭证";
              }
              val.isChecked = false;
            });
            this.list = data;
          } else {
            this.prompt = true;
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus" >
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.voucherListChoise {
  height: 100%;

  .prompt {
    text-align: center;
    color: #ff8000;
    margin-top: 20px;
    font-size: 18px;
  }

  .scrollContent {
    height: calc(100% -94px);
  }
}
</style>