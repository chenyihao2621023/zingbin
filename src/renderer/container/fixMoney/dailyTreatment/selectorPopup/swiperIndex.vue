<template>
    <div style="height:100%">
        <div class="assetTypeData" style="overflow-y:scroll;">
            <group label-width="6em" label-margin-right="2em" v-model="modelType">
                <x-input title="流水号" v-model="asset.serialNumber" placeholder="自动生成" readonly></x-input>
                <x-input title="资产类别" class="assetType" v-model="asset.assetsClassName " placeholder="请选择资产类别" :readonly="TabreadOnly" disabled @click.native="onClickAssetType"></x-input>
                <x-input v-model="asset.assetsClass" style="display:none"></x-input>
                <x-input title="资产编码" class="assetCode" v-model="asset.assetsCoding" :readonly="TabreadOnly" placeholder="请输入资产编码" @on-blur="assetsCodeBlur()" :disabled="disabledCode"></x-input>
                <x-input title="资产名称 " placeholder="请输入资产名称" class="assetName" :readonly="TabreadOnly" v-model="asset.assetsName ">
                </x-input>
                <x-input title="计量单位" v-model="asset.measureUnitIdName" placeholder="请选择计量单位" :readonly="TabreadOnly" disabled @click.native="onClickunit"></x-input>
                <x-input v-model="asset.measureUnitId" style="display:none"></x-input>
                <x-input title="数量" v-model="asset.count " placeholder="请输入数量" :readonly="TabreadOnly" :is-type="validateCount"></x-input>
                <datetime v-model="asset.postingDate " class="inData" @on-change="change" :title="'入账日期'" :readonly="datereadOnly"></datetime>
                <x-input title="存放地点" class="palce" v-model="asset.storePlaceIdName " placeholder="请选择存放地点" :readonly="TabreadOnly" disabled @click.native="onClickstorgy"></x-input>
                <x-input v-model="asset.storePlaceId" style="display:none"></x-input>
                <x-input title="使用状况" class="useStatu" placeholder="请选择使用状况" v-model="asset.workingConditionIdName " :readonly="TabreadOnly" disabled @click.native="onClickuseStatu"></x-input>
                <x-input v-model="asset.workingConditionId " style="display:none"></x-input>
                <x-input title="变动方式" class="changeWay" placeholder="请选择变动方式" v-model="asset.changeWayName" :readonly="TabreadOnly" disabled @click.native="onClickchangeWay"></x-input>
                <x-input v-model="asset.changeWay" style="display:none"></x-input>
                <selector placeholder="请选择" v-model="asset.economicUse" title="经济用途" :readonly="TabreadOnly" direction="rtl" class="operatList" :options="['经营用','非经营用']"></selector>
                <!-- <x-input title="供应商 " placeholder="请选择供应商" class="broker" :readonly="TabreadOnly" v-model="asset.supplier " @click.native="onClickbroker">
                </x-input> -->
                <x-input title="供应商 " placeholder="请选择供应商" class="broker" :readonly="TabreadOnly" v-model="asset.supplier ">
                </x-input>
                <x-input title="制造商 " placeholder="请输入制造商" class="produce" :readonly="TabreadOnly" v-model="asset.manufacturer ">
                </x-input>
                <x-input title="备注" placeholder="备注信息" v-model="asset.remark" :readonly="TabreadOnly">
                </x-input>
                <br>
                <div style="margin-bottom:5px">
                    <div class="card-left">
                        <x-button mini class="review" type="default" @click.native="reviewEquip" :readonly="TabreadOnly">附属设备</x-button>
                    </div>
                    <div class="card-right">
                        <span style="text-align:center">{{equipment}}</span>
                    </div>
                </div>
            </group>
              <group>
                 <x-input v-model="asset.equipment" style="display:none"></x-input>
            </group>
        </div>
        <popupAssetType :showPopup="assetPopup" @backClick="clickBack" @checkItem="checkAssetType"></popupAssetType>
        <popupUnit :showPopup="unitPopup" @backClick="clickBack" @changeCheck="changeCheck"></popupUnit>
        <popupStorage :showPopup="storagePopup" @backClick="clickBack" @checkItem="checkStorage"></popupStorage>
        <popupUseStatu :showPopup="useStatuPopup" @backClick="clickBack" @checkItem="checkUseStatu"></popupUseStatu>
        <popupChangeWay :showPopup="changeWayPopup" @backClick="clickBack" @checkItem="checkChangeWay"></popupChangeWay>
        <!-- <externalContactPicker :popup="popup" @cancle="cancle" @contactDetail="contactDetail">
        </externalContactPicker> -->
        <equipmentMain :showPopup="showPopup" @submitEquipment="submitEquipment" @comeback="clickBack"></equipmentMain>
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
// import externalContactPicker from "@/container/outContact/template/externalContactPicker";
import popupUnit from "./popupUnit";
import popupAssetType from "./popupAssetType";
import popupStorage from "./popupStorage";
import popupUseStatu from "./popupUseStatu";
import popupChangeWay from "./popupChangeWay";
import equipmentMain from "../equipment/equipmentMain"
// import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Selector,
    Datetime,
    popupUnit,
    popupAssetType,
    popupStorage,
    popupUseStatu,
    popupChangeWay,
    equipmentMain
    // externalContactPicker
  },
  props: {
    asset: {
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
    }
  },
  data() {
    return {
      asset: {},
      popup: false,
      assetPopup: false, //固定资产类型选择
      unitPopup: false, //计量单位
      storagePopup: false, //存放地点
      useStatuPopup: false, // 使用状况
      changeWayPopup: false, //变动方式
      showPopup:false,// 附属设备
      disabledCode:false,
      datereadOnly:false,
      validateCount: function(value) {
        return {
          valid: /^[1-9]\d*$/.test(value),
          msg: "请输入数字"
        };
      },
    };
  },
  created() {
        this.routerType = this.$route.query.flag
        let originId = this.$route.query.originId
         this.getEquipment(originId)
    if (this.routerType !== "add") {
          this.disabledCode = true
    }
    if (this.routerType === "watch") {
      this.datereadOnly = "read"
    } else {
      this.datereadOnly = false
    }
  },
  methods: {
      //针对选择经济商调至外联人页面处理
    // contactDetail(item) {
    //   console.info(item);
    // },
    //关闭资产类别Popup框
    clickBack() {
        let vm = this;
        vm.assetPopup = false;
        vm.unitPopup = false;
        vm.storagePopup = false;
        vm.useStatuPopup = false;
        vm.changeWayPopup = false;
        vm.showPopup = false
    },
    //固定资产选择
    checkAssetType(item) {
        let vm = this;
        vm.asset.assetsClassName = item.name;
        vm.asset.assetsClass = item.code;
        vm.assetPopup = false;
    },
    //计量单位
    changeCheck(val, label) {
        let vm = this;
        vm.asset.measureUnitIdName = label.toString();
        vm.asset.measureUnitId = val[0]
        vm.unitPopup = false;
    },
    // 存放地点
    checkStorage(item) {
        let vm = this;
        vm.storagePopup = false;
        vm.asset.storePlaceIdName = item.name;
        vm.asset.storePlaceId = item.code;
    },
    //使用状况
    checkUseStatu(item) {
        let vm = this;
        vm.useStatuPopup = false;
        vm.asset.workingConditionIdName = item.name;
        vm.asset.workingConditionId = item.code;
    },
    //变动方式
    checkChangeWay(item) {
        let vm = this;
        vm.changeWayPopup = false;
        vm.asset.changeWayName = item.name;
        vm.asset.changeWay = item.code;
    },
    //选择资产类型popup
    onClickAssetType() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.assetPopup = true;
      }
    },
    // 选择计量单位popup显示
    onClickunit() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.unitPopup = true;
      }
    },
    // 存放地点popup显示
    onClickstorgy() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.storagePopup = true;
      }
    },
    // 使用状态popup显示
    onClickuseStatu() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.useStatuPopup = true;
      }
    },
    //变动方式popup显示
    onClickchangeWay() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.changeWayPopup = true;
      }
    },
    // 选择经济商调至外联人页面
    onClickbroker() {
      //   this.popup = true;
      //   this.$router.push({
      //     path: "/outContactMain/bindContactUser",
      //     query: {
      //     //   cardUrl: cardUrl
      //     }
      //   });
    },
     //查询附属设备
    submitEquipment(params) {
        let vm = this
        vm.showPopup = false
        if (params.length === 0) {
             vm.equipment = "没有附属设备卡片";
        } else {
            let sum  = 0.00

            params.forEach(element => {
                sum += parseFloat(element.money)
            });
             vm.equipment = "共有" + params.length + "张卡片，金额为" + sum;
        }
        vm.asset.equipment = params
    },
    getEquipment(id) {
      let vm = this;
      let url = "/zingbiz/fixedAssets/accessoryEquipment/select?id=" + id;
      vm.$http.get(url).then(res => {
        let sum = 0.00
        if (res.data.success) {
            if (res.data.total < 1) {
                vm.equipment = "没有附属设备卡片";
            } else {
                res.data.data.forEach(element => {
                    sum += parseFloat(element.money)
                });
                vm.asset.equipment = res.data.data
                vm.equipment = "共有" + res.data.total + "张卡片，金额为" + sum;
            }
        }
      });
    },
    reviewEquip() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.showPopup = true
      }
    },
    //资产编码验证
    assetsCodeBlur() {
      if (this.$route.query.flag === "add") {
        if (/^[A-Za-z]*$/g.test(this.asset.assetsCoding)) {
          if (/^[a-zA-Z]{0,10}$/g.test(this.asset.assetsCoding)) {
            return
          } else {
            this.asset.assetsCoding = ""
            this.$vux.toast.text("不可超过10个字符")
          }
          return
        } else {
          this.asset.assetsCoding = ""
          this.$vux.toast.text("请输入英文字母")
        }
      }
    }
  }
};
</script>
<style scoped>
.assetTypeData .vux-datetime {
  position: relative;
}
.assetTypeData {
  padding-left: 10px;
  height: 100%;
}
.assetTypeData .card-left {
  float: left;
  height: 40px;
  padding-left: 10px;
}
.card-right {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
  color: rgb(169, 169, 169);
  text-align: right;
  height: 40px;
  padding-top: 12px;
  padding-right: 10px;
}
.review {
  color: #ea7e26;
  border: 1px solid #ea7e26;
  padding-left: 10px;
  margin-top: 10px;
}
.card-left .weui-btn_default {
  color: #ea7e26;
}
.card-left .weui-btn:after {
  border: 1px solid #ea7e26;
}
.assetTypeData .weui-cell {
  font-family: Arial;
  color: #101010;
  font-size: 16px !important;
}
</style>
<style>
.assetTypeData .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}

.assetTypeData .assetType .weui-cell__hd:before,
.assetTypeData .assetName .weui-cell__hd:before,
.assetTypeData .assetCode .weui-cell__hd:before,
.assetTypeData .palce .weui-cell__hd:before,
.assetTypeData .useStatu .weui-cell__hd:before,
.assetTypeData .changeWay .weui-cell__hd:before,
.assetTypeData .charges .weui-cell__hd:before,
.assetTypeData .currAmount .weui-cell__hd:before,
.assetTypeData .depreciatment .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>


