<!-- 币别及金额 -->
<template>
    <div style="height:100%">
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <ZingHead :title="title" :isComeBack="false" @doSome="doSome()">
                <div slot="header-right">
                    <span class="header-jiahao">
                        <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                <i class="iconfont icon-gengduo"></i>
                            </a>
                        </dropdown>
                    </span>
                </div>
            </ZingHead>
            <div style="height:100%;">
                <div class="table-deptment" style="overflow-y:scroll;">
                    <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                        <thead>
                            <tr>
                                <th></th>
                                <th>币别</th>
                                <th>汇率</th>
                                <th>原币金额</th>
                                <th>本币金额</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="dollarTypeData.length > 0">
                            <tr v-for="(item,index) in dollarTypeData" :key="index">
                                <td>{{item.currencyId}}</td>
                                <td>{{item.currencyName}}</td>
                                <td>{{item.exchange}}</td>
                                <td>{{item.originalCurrencyAmount}}</td>
                                <td>{{item.localCurrencyAmount}}</td>
                                <td>
                                    <span @click="selItem(item)" style="color:#ea7e26;font-size：12px;"> 详细 ></span>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4">
                                    <span style="color:#ea7e26;font-size：12px;"> 没有币别及金额数据</span>
                                </td>
                            </tr>
                        </tbody>
                    </x-table>
                </div>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item>
                        <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="deleteItem">清空</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color: #40affc;" @click.native="submit">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </popup>
        <popup v-model="isUpdate" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <ZingHead :title="updateTitle" :isComeBack="false" @doSome="cancleDollar()">
            </ZingHead>
            <div class="table-deptment">
                <group label-width="8em" label-margin-right="2em" class="deptment-list" :data="dollar">
                    <selector placeholder="" v-model="dollar.currencyName" title="币别" direction="rtl"
                     class="dollarType" :options="currencyList" @on-change="onChangeRate"></selector>
                    <x-input title="币率" v-model="dollar.exchange" class="dollarType" placeholder="1"></x-input>
                    <x-input title="原币金额" v-model="dollar.originalCurrencyAmount" placeholder="0.00"
                     @on-blur="changeCurrencyAmount" :is-type="validateimpairment"></x-input>
                    <x-input title="本币金额" placeholder="0.00" v-model="dollar.localCurrencyAmount" readonly>
                    </x-input>
                </group>
            </div>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item v-if="cancleType">
                        <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="cancleDollar">取消</x-button>
                    </flexbox-item>
                    <flexbox-item v-else>
                        <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="deleteItem">删除</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color: #40affc;" @click.native="updateSubmit">确定</x-button>
                    </flexbox-item>
                </flexbox>
        </popup>

    </div>
</template>
<script>
import {
  XTable,
  Flexbox,
  FlexboxItem,
  XButton,
  Group,
  XInput,
  Cell,
  Popup,
  Selector
} from "vux";
import { Z_IsEmpty20 } from "@/utils/fn";
import Dropdown from "@/components/dropdown/Dropdown";
import ZingHead from "components/zingHead/ZingHead.vue";
export default {
  components: {
    XTable,
    Dropdown,
    ZingHead,
    Flexbox,
    FlexboxItem,
    XButton,
    Group,
    XInput,
    Popup,
    Selector,
    Cell,
    // SubjectPicker
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      title: "币别及金额",
      DollarType:"",
      dollarTypeData: [],
      datas: [
        {
          content: "新增"
        }
      ],
      deptment: {},
      isUpdate: false,
      dollar: {},
      updateTitle: "",
      cancleType: false,
      currencyList: [],
      updateItem:[],
      validateimpairment: function(value) {
        return {
          valid: /^\d+(\.{0,1}\d+){0,1}$/.test(value),
          msg: "请输入数字"
        };
      },
    };
  },
  created() {
    let vm = this
    vm.getCurrencyData();
  },
  methods: {
    //添加图标点击事件
    handleMenu() {
      this.isUpdate = true;
      this.showPopup = false;
      this.updateTitle = "添加"
    },
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
    selItem(item) {
        let vm = this
        vm.isUpdate = true;
        vm.showPopup = false
        vm.updateTitle = "编辑"
        vm.updateItem = item
        vm.dollar.currencyName = item.currencyName
        vm.dollar.exchange = item.exchange
        vm.dollar.originalCurrencyAmount = item.originalCurrencyAmount
        vm.dollar.localCurrencyAmount = item.localCurrencyAmount
    },
    doSome() {
      this.showPopup = false;
    },
    deleteItem() {
      this.$vux.confirm.show({
        title: "提示",
        content: "确定删除？",
        // 组件除show外的属性
        onCancel() {
          console.log(this); // 非当前 vm
        },
        onConfirm() {
          console.log(this); // 非当前 vm
        }
      });
    },
    submit() {
      this.$emit("submitDollar", this.dollarTypeData);
    },
        //币别查询
    getCurrencyData() {
      let vm = this;
      let url = "/zingbiz/finance/currency/searchCurrency";
      vm.$http.post(url, { status: "1" }).then(res => {
        if (res.data.msg) {
          let currencyData = res.data.data.data;
          currencyData.forEach(element => {
            vm.currencyList.push({
              key: element.currencyId + "-" + element.rate + "-" + element.convertWay ,
              value: element.currencyName
            });
          });
        }
      });
    },
    changeCurrencyAmount(val) {
        let vm = this
        vm.dollar.localCurrencyAmount = "0.00"
        vm.dollar.originalCurrencyAmount = vm.toDecimal(val)
        let fixRate = vm.DollarType.split("-")[1]
        let convertWay = vm.DollarType.split('-')[2]
        let currItem = "0.00"
        if (convertWay === "addition") {
           currItem = val / fixRate
        } else {
            currItem = val * fixRate
        }
         vm.dollar.localCurrencyAmount = vm.toDecimal(currItem)
    },
     onChangeRate(val) {
        let vm = this
        console.info(val)
        vm.DollarType = val
        vm.dollar.currencyId = val.split("-")[0]
        let fixRate = val.split("-")[1]
        vm.dollar.exchange = fixRate
    },
       // 数组指定参数删除
    findIndexOf(ary,val) {
        for (let i = 0; i < ary.length; i++) {
                if (ary[i].departmentId === val) {
                    return i;
                } else {
                    return -1;
                }
        }
    },
     //保存事件
    updateSubmit() {
        let vm = this;
        if (Z_IsEmpty20(vm.dollar.exchange)) {
            vm.$vux.toast.text("请选择币率");
            return;
        }
        if (Z_IsEmpty20(vm.dollar.currencyName)) {
            vm.$vux.toast.text("请输入币别");
            return;
        }
        let dollarItem = "";
        vm.currencyList.forEach(item => {
            if (item.key === vm.DollarType) {
                dollarItem = item.value;
            }
        });
       console.info(vm.updateItem)
      if (vm.UpdateTitle === "编辑") {
        let deptIndex = vm.findIndexOf(
          vm.dollarTypeData,
          vm.updateItem.currencyName
        );
        vm.subjectData.splice(deptIndex, 1);
      }
     vm.dollarTypeData.push( {
       currencyName: dollarItem,
       exchange:vm.dollar.exchange,
       originalCurrencyAmount:vm.dollar.originalCurrencyAmount,
       localCurrencyAmount:vm.dollar.localCurrencyAmount
     })
    vm.isUpdate = false;
    vm.showPopup = true;
      console.info( vm.dollarTypeData)
    },
    cancleDollar() {
         this.isUpdate = false;
         this.showPopup = true;
    }
  }
};
</script>
<style>
.table-deptment .dollarType .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>
<style scoped>
.table-deptment {
  height: calc(100%-100px);
}
.deptment .initFrom-title {
  height: 40px;
  line-height: 40px;
  background-color: white;
  font-size: 18px;
  text-align: center;
}
.interspace {
  margin-left: 0px !important;
  text-align: center;
  padding: 5px 0;
  height: 40px;
}
.interspace:last-child {
  border-left: 1px solid #f5f5f5;
  color: #ff8000;
}
.deptment .weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.deptment .initFrom-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px !important;
}
</style>



