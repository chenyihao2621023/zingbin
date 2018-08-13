<template>
    <div style="height:100%">
        <div class="originalData" style="overflow-y:scroll;">
            <group label-width="6em" label-margin-right="2em" v-model="modelType">
                <selector placeholder="" v-model="originalData.currencyId" :readonly="TabreadOnly" title="币别" direction="rtl" class="dollarType" :options="currencyList" @on-change="onChangeRate"></selector>
                <x-input title="汇率" v-model="originalData.exchangeRate" readonly placeholder="1" class="exchange"></x-input>
                <x-input title="原币金额" v-model="originalData.originalCurrencyAmount" :readonly="TabreadOnly" class="currAmount" placeholder="0.00" @on-blur="onBlurValid" :is-type="validateimpairment"></x-input>
                <x-input title="本币金额 " placeholder="0.00" v-model="originalData.localCurrencyAmount" readonly></x-input>
                <x-input title="购进原值" placeholder="0.00" v-model="originalData.purchaseOriginalValue" readonly></x-input>
                <x-input title="购进累计折旧 " placeholder="0.00" v-model="originalData.accumulatedDepreciationOfPurchases" :readonly="TabreadOnly" @on-blur="onBlurValidPurchases" :is-type="validateimpairment"></x-input>
                <x-input title="原币调整" placeholder="0.00" v-model="originalData.originalCurrencyAdjustment" :readonly="TabreadOnly" @on-blur="onBlurValidAdjustment" :is-type="validateimpairment"></x-input>
            </group>
            <group>
                <datetime title="开始使用时间" v-model="originalData.startDate" @on-change="changeData" :readonly="datereadOnly"></datetime>
                <div v-if="workLoad">
                    <x-input title="预计工作总量 " placeholder="0.00" class="estimatedData" v-model="originalData.expectedDurationOfUse" :readonly="TabreadOnly"></x-input>
                    <x-input title="已使用工作量" placeholder="0.00" class="useData" v-model="originalData.usedPeriod" :readonly="TabreadOnly"></x-input>
                </div>
                <div v-else>
                    <x-input title="预计使用期间数 " placeholder="0" class="estimatedData" :is-type="validateDate" v-model="originalData.expectedDurationOfUse" :readonly="TabreadOnly"></x-input>
                    <x-input title="已使用期间数" placeholder="0" class="useData" :is-type="validateDate" v-model="originalData.usedPeriod" :readonly="TabreadOnly"></x-input>
                </div>
                <x-input title="累计折旧 " placeholder="0.00" v-model="originalData.accumulatedDepreciationAmount" :readonly="TabreadOnly" @on-blur="changeAmount" :is-type="validateimpairment" :disabled="disabled"></x-input>
                <x-input v-if="modelType === 'change'" title="累计折旧调整 " placeholder="0.00" v-model="originalData.accumulativeDepreciationAdjustment" :readonly="TabreadOnly" @on-blur="changeAdjustment" :is-type="validateimpairment"></x-input>
                <x-input title="预计净残值" placeholder="0.00" v-model="originalData.estimatedResidualValue" :readonly="TabreadOnly" :is-type="validateimpairment" @on-blur="onBlurEstimate"></x-input>
                <x-input title="减值准备" placeholder="0.00" v-model="originalData.impairmentPreparation" :readonly="TabreadOnly" :is-type="validateimpairment" @on-blur="changePreparation"></x-input>
                <x-input title="净值 " placeholder="0.00" v-model="originalData.netWorth" readonly></x-input>
                <x-input title="净额" placeholder="0.00" v-model="originalData.netAmount" readonly></x-input>
                <selector placeholder="" v-model="originalData.depreciationMethod" title="折旧方法" :readonly="TabreadOnly" direction="rtl" class="depreciatment" :options="depreciatmentList" @on-change="onChangePepreciat"></selector>
                <x-input title="工作量计量单位" placeholder="请输入计量单位" :readonly="TabreadOnly" v-model="originalData.workMeasureUnit" v-show="workLoad"></x-input>
            </group>
            <!-- <div style="margin-bottom:5px">
                <div class="card-left">
                    <x-button mini class="review" type="default" @click.native="review" :readonly="TabreadOnly">折旧方法</x-button>
                </div>
                <div class="card-right">
                    <span style="text-align:center"> </span>
                </div>
            </div> -->
        </div>
        <!-- <dollarTypesMain :showPopup="isDollarType" @submitDollar="submitDollar"></dollarTypesMain> -->
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Selector,
  Datetime
} from "vux";
// import dollarTypesMain from "../dollarTypes/dollarTypesMain.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Selector,
    Datetime,
    // dollarTypesMain
  },
  props: {
    originalData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    TabreadOnly: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    modelType: {
      type: String,
      default: function() {
        return "";
      }
    },
    convertWay:""
  },
  data() {
    return {
    //   isDollarType: false,
    //   TabreadOnlys: true, // 在变动时，如果为单币别可以修改，如果是多币别不允许输入修改
      currencyList: [],
      depreciatmentList: [
        {
          key: "pingjun-nianxian-a",
          value: "平均年限法（基于入账原值和入账预计使用期间）"
        },
        {
          key: "pingjun-nianxian-b",
          value: "平均年限法（基于入账净值和入账剩余使用期间）"
        },
        { key: "nianshu-zhonghe", value: "年数总和法" },
        {
          key: "shuangbei-yue-a",
          value: "双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "shuangbei-yue-b",
          value: "双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-pingjunnian", value: "动态平均年限法" },
        {
          key: "dongtai-shuangbeiyu-a",
          value: "动态双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "dongtai-shuangbeiyu-b",
          value: "动态双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-nianshu", value: "动态年数总和法" },
        { key: "gongzuoliang", value: "工作量法" }
      ],
      originalList: [
        { key: "single", value: "单币别" },
        { key: "multiple", value: "多币别" }
      ],
    //   singleShow: true,
      validateDate: function(value) {
        return {
          valid: /^[0-9]\d*$/.test(value),
          msg: "请输入数字"
        };
      },
      validateimpairment: function(value) {
        return {
          valid: /^\d+(\.{0,1}\d+){0,1}$/.test(value),
          msg: "请输入数字"
        };
      },
      DollarType: "",
      convertMethod:"",// 币别类型（乘法、除法）
      currencyData:[], // 币别
      disabled:false,
      datereadOnly:false
    };
  },
  created() {
    if (this.$route.query.flag === "watch") {
      this.datereadOnly = "read"
    } else {
      this.datereadOnly = false
    }
  },
    mounted() {
      this.getCurrencyData();
      if (this.$route.query.flag === "change") {
          this.disabled = true
      }

  },

  methods: {
    //制保留2位小数，如：2，会在2后面补上00.即2.00
    toDecimal(x) {
      let f = parseFloat(x);
      if (isNaN(f)) {
        return 0.00;
      }
      let fn = Math.round(x * 100) / 100;
      let s = fn.toString();
      let rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
      //购进累计折旧失去焦点
    onBlurValidPurchases(val) {
        this.originalData.accumulatedDepreciationOfPurchases = this.toDecimal(val);
    },
    onBlurValidAdjustment(val) {
      this.originalData.originalCurrencyAdjustment = this.toDecimal(val);
    },
    // //多币别设置
    // submitDollar(data) {
    //   let vm = this;
    //   let money = "";
    //   if (data.length === 1) {
    //     vm.originalData.currencyId = data[0].currencyId;
    //     vm.originalData.currencyName =
    //       data[0].currencyName + ":" + data[0].localCurrencyAmount;
    //   } else {
    //     Object.keys(data).forEach((key, value) => {
    //       money = data[key].currencyName + ":" + data[key].localCurrencyAmount;
    //       vm.originalData.currencyName += money;
    //     });
    //   }
    //   this.isDollarType = false;
    // },
    // 折旧方法selector选中事件
    onChangePepreciat(val) {
      if (val === "gongzuoliang") {
        this.workLoad = true;
      } else {
        this.workLoad = false;
      }
    },
    //原币金额失去焦点
    onBlurValid(val) {
        let vm = this;
        vm.originalData.originalCurrencyAmount = vm.toDecimal(val);
        let fixRate = vm.DollarType.split("-")[1];
        let convertWay = vm.convertMethod
        if (convertWay === "addition") {
            let local = val / fixRate;
            vm.originalData.localCurrencyAmount = vm.toDecimal(local);
        } else {
            let localCur = val * fixRate;
            vm.originalData.localCurrencyAmount = vm.toDecimal(localCur);
        }
        let purchase = vm.originalData.localCurrencyAmount;
        vm.originalData.purchaseOriginalValue = vm.toDecimal(purchase);
        if (Z_IsEmpty20(vm.originalData.accumulatedDepreciationAmount)) {
            vm.originalData.netWorth = vm.toDecimal(vm.originalData.localCurrencyAmount)
            if (Z_IsEmpty20(vm.originalData.Z_IsEmpty20)) {
                vm.originalData.netAmount = vm.toDecimal(vm.originalData.localCurrencyAmount)
            } else {
                vm.originalData.netAmount = vm.toDecimal(parseFloat(vm.originalData.localCurrencyAmount) -
                    parseFloat(this.originalData.impairmentPreparation))
            }
        } else {
            vm.originalData.netWorth = vm.toDecimal(parseFloat(vm.originalData.localCurrencyAmount) -
                parseFloat(this.originalData.accumulatedDepreciationAmount))
            if (Z_IsEmpty20(vm.originalData.Z_IsEmpty20)) {
                vm.originalData.netAmount = vm.toDecimal(vm.originalData.netWorth)
            } else {
                vm.originalData.netAmount = vm.toDecimal(parseFloat(vm.originalData.netWorth) -
                    parseFloat(this.originalData.impairmentPreparation))
            }
        }


    },
    // //设置币别及金额
    // onClickOriginal() {
    //   this.isDollarType = true;
    // },
    // 折旧方法
    review() {
      console.info("计提折旧");
    },
    // //货币原值类别change事件
    // onChangeoriginal(val) {
    //   if (this.modelType === "change") {
    //     if (val === "single") {
    //       this.singleShow = true;
    //       this.TabreadOnlys = true;
    //     } else {
    //       this.singleShow = false;
    //     }
    //   } else {
    //     this.TabreadOnlys = false;
    //     if (val === "single") {
    //       this.singleShow = true;
    //     } else {
    //       this.singleShow = false;
    //     }
    //   }
    // },
    onChangeRate(val) {
        let vm = this
        vm.DollarType = val;
        let currencyId = val.split("-")[0]
        vm.currencyData.forEach(item => {
            if (currencyId === item.currencyId ) {
                vm.convertMethod = item.convertWay
            }
        })
        let fixRate = val.split("-")[1];
        if (vm.modelType !== "watch") {
             vm.originalData.exchangeRate = fixRate;
        }
    },
    //净值 (netWorth)  本币金额 - 累计折旧
    //    originalData.localCurrencyAmount - originalData.accumulatedDepreciationAmount
    //净额 (netAmount)  本币金额 - 累计折旧 - 减值准备 (impairmentPreparation)
    // 累计折旧失去焦点
    changeAmount(val) {
        let netValue = "";
        let netAmount = ""
        this.originalData.netWorth = "0.00";
        this.originalData.netAmount = "0.00";
        this.originalData.accumulatedDepreciationAmount = this.toDecimal(val);
        netValue = parseFloat(this.originalData.localCurrencyAmount) - val;
        if (Z_IsEmpty20(this.originalData.impairmentPreparation)) {
            netAmount = parseFloat(this.originalData.localCurrencyAmount) - val
        } else {
            netAmount = parseFloat(this.originalData.localCurrencyAmount) - val -
                parseFloat(this.originalData.impairmentPreparation);
        }
        this.originalData.netWorth = this.toDecimal(netValue);
        this.originalData.netAmount = this.toDecimal(netAmount);
    },
    onBlurEstimate(val) {
        this.originalData.estimatedResidualValue = this.toDecimal(val);
    },
    //减值准备失去焦点 （只对净额产生影响）
    changePreparation(val) {
        let amout = ""
        this.originalData.netAmount = "0.00";
        this.originalData.impairmentPreparation = this.toDecimal(val);
        if (Z_IsEmpty20(this.originalData.accumulatedDepreciationAmount) && Z_IsEmpty20(this.originalData.accumulativeDepreciationAdjustment)) {
            amout = parseFloat(this.originalData.localCurrencyAmount) - val;
        } else {
          if (this.disabled) {
            amout = parseFloat(this.originalData.localCurrencyAmount) -
              parseFloat(this.originalData.accumulativeDepreciationAdjustment) - val;
          } else {
            amout = parseFloat(this.originalData.localCurrencyAmount) -
              parseFloat(this.originalData.accumulatedDepreciationAmount) - val;
          }
        }
        this.originalData.netAmount = this.toDecimal(amout);
    },
    //累计折旧调整失去焦点 accumulativeDepreciationAdjustment
    changeAdjustment(val) {
      let netValue = "";
      let netAmount = ""
      this.originalData.netWorth = "0.00";
      this.originalData.netAmount = "0.00";
      this.originalData.accumulativeDepreciationAdjustment = this.toDecimal(val);
      netValue = parseFloat(this.originalData.localCurrencyAmount) - val;
      if (Z_IsEmpty20(this.originalData.impairmentPreparation)) {
        netAmount = parseFloat(this.originalData.localCurrencyAmount) - val
      } else {
        netAmount = parseFloat(this.originalData.localCurrencyAmount) - val -
          parseFloat(this.originalData.impairmentPreparation);
      }
      this.originalData.netWorth = this.toDecimal(netValue);
      this.originalData.netAmount = this.toDecimal(netAmount);
    },
    //币别查询
    getCurrencyData() {
      let vm = this;
      let url = "/zingbiz/finance/currency/searchCurrency";
      vm.$http.post(url, { status: "1" }).then(res => {
        if (res.data.msg) {
          vm.currencyData = res.data.data.data;
          vm.currencyData.forEach(element => {
            vm.currencyList.push({
              key: element.currencyId
                 + "-" +
                element.rate,
                // "-" +
                // element.convertWay,
              value: element.currencyName
            });
          });
        }
      });
    }
  }
};
</script>
<style>
.originalData {
  padding-left: 10px;
  height: 100%;
}
.review {
  color: #ea7e26;
  border: 1px solid #ea7e26;
  padding-left: 10px;
  margin-top: 10px;
}
/* depreciatment  currAmount */
.originalData .depreciatment .weui-cell__hd:before,
.originalData .currAmount .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
.originalData .useData .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 110px;
  color: rgba(255, 128, 0, 1) !important;
}
.originalData .estimatedData .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 125px;
  color: rgba(255, 128, 0, 1) !important;
}
.originalData .originalValue .weui-cell__hd:before,
.originalData .dollarType .weui-cell__hd:before,
.originalData .exchange .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
.originalData .weui-cell {
  font-family: Arial;
  color: #101010;
  font-size: 16px !important;
}
</style>


