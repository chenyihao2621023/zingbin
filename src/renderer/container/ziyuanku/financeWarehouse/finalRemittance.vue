<template>
  <div class="finalRemittance">
    <zing-head title="期末调汇"></zing-head>
    <div v-show="exchangeRateShow" class="exchangeRate" >
      <div class="title">当前外币汇率</div>
      <x-table style="height:100%">
        <thead>
          <tr>
            <th>币别</th>
            <th>名称</th>
            <th>当前汇率</th>
            <th>调整汇率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data,index) in currencyArr" :key="index">
            <td>{{data.currencyCode}}</td>
            <td>{{data.currencyName}}</td>
            <td>{{data.oldRate}}</td>
            <td><input type="number" step="0.01" v-model="data.rate"></td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div class="voucherInfo" v-show="voucherInfoShow">
      <group label-width="7em">
        <x-input title="汇兑损益科目&nbsp;<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="voucherInfoItem.projectName" :disabled="true" @click.native="selectPickedDialog(index)" class="fontColor"></x-input>
        <selector title="凭证字&nbsp;<span style='color: red;'>*</span>" placeholder="请选择" :options="wordData" v-model="voucherInfo.pzWord"></selector>
        <x-input title="财务库&nbsp;<span style='color: red;'>*</span>" :show-clear="false" v-model="voucherInfo.ckName" :disabled="true" @click.native="openWareHoseList" placeholder="请选择财务库" class="fontColor"></x-input>
        <x-textarea title="凭证摘要&nbsp;<span style='color: red;'>*</span>" :max="2000" placeholder="请输入凭证摘要" v-model="voucherInfo.pzSummary"></x-textarea>
      </group>

      <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
    </div>
    <flexbox :gutter="0">
      <flexbox-item v-show="exchangeRateShow">
        <x-button class="btn-common" type="warn" @click.native="next">下一步</x-button>
      </flexbox-item>
      <flexbox-item v-show="voucherInfoShow">
        <x-button class="btn-common" type="warn" @click.native="prev">上一步</x-button>
      </flexbox-item>
      <flexbox-item v-show="voucherInfoShow">
        <x-button class="btn-save" type="primary" @click.native="startRemittance">开始</x-button>
      </flexbox-item>
    </flexbox>
    <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @financeItemClick="financeItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
  </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import WarehouseList from "@/container/ziyuanku/financeWarehouse/warehouseList";
import { Z_IsEmpty20 } from "@/utils/fn";
import {
  XTable,
  Flexbox,
  FlexboxItem,
  XButton,
  Group,
  XInput,
  Selector,
  XTextarea,
  Popup
} from "vux";
export default {
  name: "finalRemittance",
  components: {
    ZingHead,
    SubjectPicker,
    XTable,
    Flexbox,
    FlexboxItem,
    XButton,
    Group,
    XInput,
    Selector,
    XTextarea,
    Popup,
    WarehouseList
  },
  data() {
    return {
      exchangeRateShow: true,
      voucherInfoShow: false,

      showWarehoseList: false,

      voucherInfo: {
        pzWord: "",
        pzSummary: ""
      },
      voucherInfoItem: {
        projectName: ""
      },
      wordData: [], //凭证字
      showPicker: false,
      currencyArr: []
    };
  },
  created() {
    this.loadWordData();
    this.loadCurrenties();
  },
  methods: {
    next() {
      this.exchangeRateShow = false;
      this.voucherInfoShow = true;
    },
    prev() {
      this.voucherInfoShow = false;
      this.exchangeRateShow = true;
    },
    loadWordData() {
      let url = "/zingbiz/finance/voucher/searchVoucher";
      this.$http.post(url, { status: "1" }).then(res => {
        if (res.data.success) {
          this.wordData = [];
          for (let i = 0; i < res.data.data.data.data.length; i++) {
            this.wordData.push({
              key: res.data.data.data.data[i].voucherId,
              value: res.data.data.data.data[i].voucherName
            });
          }
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    },
    loadCurrenties() {
      this.$http
        .get("/ZingMH/ZDesk/currenty/mater/searchCurrenty.action", {
          params: {
            status: "1"
          }
        })
        .then(res => {
          let data = res.data.data.data;
          let currencyArr = data.data;
          currencyArr.forEach(element => {
            element.oldRate = element.rate;
          });
          this.currencyArr = currencyArr;
        });
    },
    selectPickedDialog(index) {
      //显示科目页面
      this.showPicker = true;
    },
    getPickedData(pickedData) {
      //获取科目代码数据
      this.voucherInfoItem.projectId = pickedData.fileId;
      this.voucherInfoItem.projectName = pickedData.filename;
      this.voucherInfoItem.projectPath = pickedData.modleId;
      this.voucherInfoItem.pzServiceDesc = pickedData.description;
      this.showPicker = false;
    },
    subjectAbort() {
      this.showPicker = false;
    },
    openWareHoseList() {
      this.showWarehoseList = true;
    },
    financeItemClick(data) {
      this.showWarehoseList = false;
      this.voucherInfo.ckId = data.rowId;
      this.voucherInfo.ckName = data.ckName;
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    startRemittance() {
      let url = "/zingbiz/resourceLibrary/voucher/finalRemittance";

      let isChange = false;
      this.currencyArr.forEach(item => {
        if (item.oldRate !== item.rate) {
          isChange = true;
        }
      });
      if (!isChange) {
        this.$vux.toast.text("汇率未发生变化");
        return;
      }

      if (Z_IsEmpty20(this.voucherInfoItem.projectId)) {
        this.$vux.toast.text("请选择汇兑损益科目");
        return;
      }
      if (Z_IsEmpty20(this.voucherInfo.pzWord)) {
        this.$vux.toast.text("请选择凭证字");
        return;
      }
      if (Z_IsEmpty20(this.voucherInfo.ckId)) {
        this.$vux.toast.text("请选择财务库");
        return;
      }
      if (Z_IsEmpty20(this.voucherInfo.pzSummary)) {
        this.$vux.toast.text("请输入凭证摘要");
        return;
      }

      let params = {
        rateList: JSON.stringify(this.currencyArr),
        subjectCode: this.voucherInfoItem.projectId,
        pzWord: this.voucherInfo.pzWord,
        ckId: this.voucherInfo.ckId,
        ckName: this.voucherInfo.ckName,
        pzSummary: this.voucherInfo.pzSummary
      };

      this.$http.post(url, params).then(res => {
        if (res.data.success) {
          if (res.data.msg === "1") {
            this.$vux.toast.text("调汇成功，已生成凭证");
          } else if (res.data.msg === "2") {
            this.$vux.toast.text("调汇成功，原币金额为0，未生成凭证");
          }
          this.currencyArr.forEach(item => {
            item.oldRate = item.rate;
          });
          this.voucherInfoShow = false;
          this.exchangeRateShow = true;
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.finalRemittance {
  height: 100%;

  .exchangeRate {
    height: calc(100% - 94px);

    .title {
      height: 40px;
      line-height: 40px;
      padding-left: 13px;
    }

    table {
      thead {
        display: table;
        width: 100%;
        table-layout: fixed;
      }

      tbody {
        display: block;
        width: 100%;
        display: block;
        height: calc(100% - 94px);
        overflow: auto;

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;

          td {
            input {
              height: 30px;
              width: 100%;
              font-size: 14px;
              text-align: center;
              color: #888888;
            }
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  .voucherInfo {
    height: calc(100% - 94px);
  }
}
</style>