<!--变动记录 -->
<template>
    <div style="height:100%">
        <ZingHead :title="title" :isComeBack="false" @doSome="backClick()">
        </ZingHead>
        <div class="table-record">
            <el-row :gutter="20">
                <el-col :span="12">
                    <cell title="资产编码：" :value="assetCode"></cell>
                </el-col>
                <el-col :span="12">
                    <cell title="资产名称：" :value="assetName"></cell>
                </el-col>
            </el-row>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <!-- <el-table-column prop="year" label="年度">
                            </el-table-column> -->
                <el-table-column prop="period" label="期间">
                </el-table-column>
                <el-table-column prop="postingDate" label="入账日期或变动日期" width="100">
                </el-table-column>
                <el-table-column prop="summary" label="摘要">
                </el-table-column>
                <el-table-column prop="assetsCoding" label="编码" width="100">
                </el-table-column>
                <el-table-column prop="assetsName" label="名称">
                </el-table-column>
                <!-- <el-table-column prop="model" label="型号">
                            </el-table-column> -->
                <el-table-column prop="assetsClass" label="类别">
                </el-table-column>
                <el-table-column prop="changeWay" label="变动方式">
                </el-table-column>
                <el-table-column prop="workingConditionId" label="使用状态">
                </el-table-column>
                <el-table-column prop="accessoryEquipmentId" label="附属设备">
                </el-table-column>
                <el-table-column prop="department" label="部门">
                </el-table-column>
                <el-table-column prop="workMeasureUnit" label="单位">
                </el-table-column>
                <el-table-column prop="count" label="数量">
                </el-table-column>
                <el-table-column prop="currencyId" label="币别">
                </el-table-column>
                <el-table-column prop="exchangeRate" label="原值原币汇率">
                </el-table-column>
                <el-table-column prop="originalCurrencyAmount" label="原值原币">
                </el-table-column>
                <el-table-column prop="localCurrencyAmount" label="原值本币">
                </el-table-column>
                <el-table-column prop="purchaseOriginalValue" label="购进原值">
                </el-table-column>
                <el-table-column prop="estimatedResidualValue" label="原值预计净残值">
                </el-table-column>
                <el-table-column prop="expectedDurationOfUse" label="预计使用期间数或者预计使用工作量">
                </el-table-column>
                <el-table-column prop="usedPeriod" label="已使用期间数或已使用工作量">
                </el-table-column>
                <el-table-column prop="impairmentPreparation" label="减值准备">
                </el-table-column>
                <el-table-column prop="depreciationMethod " label="折旧方法">
                </el-table-column>
                <el-table-column prop="accumulatedDepreciationOfPurchases" label="购进累计折旧">
                </el-table-column>
                <el-table-column prop="accumulativeDepreciationAdjustment" label="累计折旧调整">
                </el-table-column>
                <!-- <el-table-column prop="expense" label="折旧费用项目">
                            </el-table-column> -->
                <el-table-column prop="workMeasureUnit" label="工作量单位">
                </el-table-column>
                <el-table-column prop="economicUse" label="经济用途">
                </el-table-column>
                <el-table-column prop="storePlaceId" label="存放地点">
                </el-table-column>
                <!-- <el-table-column prop="startDate" label="开始使用日期">
                            </el-table-column> -->
                <el-table-column prop="manufacturer" label="制造商">
                </el-table-column>
                <!-- <el-table-column prop="origin" label="产地">
                            </el-table-column> -->
                <el-table-column prop="supplier" label="供应商">
                </el-table-column>
                <!-- <el-table-column prop="prepared" label="制单人">
                            </el-table-column> -->
            </el-table>
        </div>
        <flexbox class="inner">
            <flexbox-item>
                <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="cancle">关闭</x-button>
            </flexbox-item>
        </flexbox>
    </div>
</template>
<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import { Flexbox, FlexboxItem, XButton, Cell, Popup } from "vux";
export default {
  components: {
    ZingHead,
    Cell,
    Flexbox,
    FlexboxItem,
    XButton,
    Popup
  },
  //   props: {
  //     showPopup: {
  //       type: Boolean,
  //       default: function() {
  //         return false;
  //       }
  //     }
  //   },
  data() {
    return {
      title: "固定资产变动记录",
      tableData: [
        // {
        //   year: "2014",
        //   period: "2014-06",
        //   changeData: "2014-03-12",
        //   startDate: "201-01-01",
        //   expense: "cnsdja",
        //   workunit: "台",
        //   economicUse: "经营",
        //   storage: "办公室",
        //   manufacturer: "英立讯",
        //   origin: "北京海淀区",
        //   supplier: "英立讯",
        //   prepared: "城西"
        // }
      ],
      assetCode: "",
      assetName: "",
      updateId: ""
    };
  },
  created() {
    let vm = this;
    vm.updateId = vm.$route.query.id;
    vm.getChangeRecord();
  },
  methods: {
    backClick() {
      this.$router.go(-1);
      //   this.$emit("backClick");
    },
    cancle() {
      this.$router.go(-1);
      //   this.$emit("cancle");
    },
    //变动记录
    getChangeRecord() {
      let params = {
        id: this.updateId,
        type: "change"
      };
      this.$http
        .post("/zingbiz/fixedAssets/assetsManagement/select", params)
        .then(res => {
          if (res.data.success) {
            let getData = res.data.data;
               if (getData.length > 0) {
                    this.assetCode = getData[0].assetsCoding;
                    this.assetName = getData[0].assetsName;
               }
                this.tableData = getData;
          }
        });
    }
  }
};
</script>
<style scoped>
.table-record {
  height: calc(100%-94px);
}
.popupDate-picker-popup {
  height: 100%;
}
</style>




