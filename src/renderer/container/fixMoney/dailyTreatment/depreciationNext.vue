<!-- 计提折旧 -->
<template>
    <div style="height:100%">
        <ZingHead title="计提折旧" :isComeBack="false" @doSome="close()">
        </ZingHead>
        <div class="workquery" v-show="isDepreciation">
            <group class="list-warp">
                <cell title="要生成凭证，请输入一下内容"></cell>
                 <x-input class="financial"
                title="财务库" placeholder="请选择财务库"
                @click.native="chooseFinancial()"
                v-model="voucherInfoItems.ckName" disabled></x-input>
                <x-input v-model="voucherInfoItems.ckId" style="display:none"></x-input>
                <selector placeholder="请选择" v-model="pzWord" title="凭证字" direction="rtl" class="district" :options="paylist"></selector>
                <x-textarea title="凭证摘要" placeholder="请输入凭证摘要" v-model="remark" :rows="1" autosize>
                </x-textarea>
            </group>
            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color:#40affc;" type="primary" @click.native="cancle">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="toBefore">上一步</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="toNext">下一步</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="workquery" v-show="isSubDepreciation">
            <div class="list-warp">
                <p style="padding:10px; font-size:14px;">点击'计提折旧'按钮开始计提本期折旧费用</p>
                <group v-show="showCard">
                    <div class="cardInfo" :data="cardData">
                        <p>
                            共有
                            <span style="color:red">{{cardData.acount}} </span>张卡片计提折旧！
                        </p>
                        <p>
                            生成一张凭证字号为"
                            <span style="color:red">{{cardData.certificate}}</span> "字第
                            <span style="color:red">{{cardData.number}}</span>号的转账凭证！
                        </p>
                        <p>
                            折旧总耗时
                            <span style="color:red">{{cardData.time}}分钟</span>！
                        </p>
                    </div>

                </group>
            </div>
            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color:#40affc;" type="primary" @click.native="cancleDepreciat">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="toBeforeDepreciat">上一步</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="toDepreciattion" :disabled="isDisabled">计提折旧</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <confirm v-model="show" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm">
            <p style="text-align:center;">是否要重新计算折旧</p>
        </confirm>
        <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <warehouse-list
                :isReferenced="true"
                @financeItemClick="financeItemClick"
                @warehoseListBack="warehoseListBack"
            ></warehouse-list>
        </popup>
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  XTextarea,
  Cell,
  Selector,
  Confirm,
  Popup
} from "vux";
import { Z_IsEmpty20 } from "@/utils/fn";
import ZingHead from "components/zingHead/ZingHead.vue";
    //选择财务库模板
import WarehouseList from "../../ziyuanku/financeWarehouse/warehouseList";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Cell,
    XTextarea,
    Selector,
    Confirm,
    WarehouseList,
    Popup
  },
  data() {
    return {
        pzWord: "",
        remark: "",
        voucherInfoItems:{},
        isDepreciation: true,
        isSubDepreciation: false,
        show: false,
        showCard: false,
        isDisabled: false,
        cardData: {},
        paramTemp: {},
        //财务库
        showWarehoseList:false,
        paylist: []
    };
  },
  created() {
      this.getDepreciation()
  },
  methods: {
    //取消
    close() {
      this.$router.go(-1);
    },
    cancle() {
      this.$router.push({
        path: "/fixMoneyMain",
        query: {}
      });
    },
   cancleDepreciat() {
      this.$router.push({
        path: "/fixMoneyMain",
        query: {}
      });
    },
    //计提折旧
    toDepreciattion() {
      if (this.showCard === true) {
        this.show = true;
      } else {
        this.show = false;
      }
      this.depreciation()
    },
    //计提折旧接口调用
    depreciation() {
        this.$http.post("/zingbiz/fixedAssets/assetsManagement/generateDepreciation",{
            pzWord: this.pzWord,
            remark: this.remark,
            ckId: this.voucherInfoItems.ckId
        }).then(res => {
            if (res.data.success) {
                //  this.$vux.toast.text(res.data.msg)
                this.cardData = res.data.data
            } else {
                this.$vux.toast.text(res.data.msg)
            }
        })
    },
    onConfirm() {
      this.depreciation()
    },
    toBeforeDepreciat() {
        this.isSubDepreciation = false
        this.isDepreciation = true
    },
    //下一步
    toNext() {
     let vm = this;
      if (Z_IsEmpty20(vm.voucherInfoItems.ckName)) {
        vm.$vux.toast.text("请选择财务库");
        return;
      }
      if (Z_IsEmpty20(vm.pzWord)) {
        vm.$vux.toast.text("请选择凭证字");
        return;
      }
        vm.isSubDepreciation = true
        vm.isDepreciation = false
    },
    //上一步
    toBefore() {
      this.$router.push({
        path: "depreciat",
        query: {}
      });
    },
    // 获取凭证字号
    getDepreciation() {
        this.$http.post("/zingbiz/finance/voucher/searchVoucher",{}).then(res => {
            if (res.data.success) {
                let pzWorlds = res.data.data.data.data
                pzWorlds.forEach(element => {
                     this.paylist.push({
                         key:element.voucherId,
                         value:element.voucherName
                     })
                });
            }
        })
    },
    //选择财务库
    chooseFinancial() {
        this.showWarehoseList = true
    },
    financeItemClick(data) {
        this.voucherInfoItems.ckId = data.rowId;
        this.voucherInfoItems.ckName = data.ckName;
        this.showWarehoseList = false;
    },
    warehoseListBack() {
        this.showWarehoseList = false;
    }
  }
};
</script>
<style scoped>
.workquery {
  height: 100%;
}
.list-warp {
  height: calc(100%-94px);
}
.cell-left {
  width: 1em;
  float: left;
  padding-left: 10px;
  padding-top: 5%;
}
.workquery .weui-cell {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
</style>
<style>
.workquery .district .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 70px;
  color: rgba(255, 128, 0, 1) !important;
}
.workquery .financial .weui-cell__hd:before{
    content: "*";
    display: inline-block;
    position: absolute;
    left: 70px;
    color: rgba(255, 128, 0, 1) !important;
}

</style>
