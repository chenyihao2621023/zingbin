<template>
  <div class="accountProfitAndLoss">
    <zing-head title="结转损益">
      <div v-if="tipsShow" slot="header-right">
        <span class="header-jiahao" @click="showSetting">
          <i class="iconfont icon-gengduo"></i>
        </span>
      </div>
    </zing-head>
    <div v-show="tipsShow" class="tips">
      <div style="padding:13px;background-color:#fff">
        期末时，应将以前年度损益调整科目的余额转入&lt;利润分配&gt;科目，其他各损益类科目的余额转入&lt;本年利润&gt;科目，以反映企业在一个会计期间内实现的利润或亏损总额。本指南将帮助你自动完成对损益类科目的结转，并生成一张或多张自动转账凭证。
      </div>
      <div style="padding:13px;margin-top:10px;background-color:#fff;height:100%;overflow:hidden">
        建议在执行转结时，先进行设置方案，否则无法正常进行转结操作
      </div>
    </div>
    <div v-show="exchangeRateShow" class="exchangeRate">
      <div class="title">除&lt;以前年度损益调整&gt;科目对应利润分配表科目外，其他损益类科目对应&lt;本年利润&gt;科目</div>
      <div class="tableWrapper">
        <x-table style="height:100%">
          <thead>
            <tr>
              <th>代码</th>
              <th>名称</th>
              <th>结转科目</th>
              <th>结转科目名称</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data,index) in financeArr" :key="index">
              <td>{{data.subjectCode}}</td>
              <td style="text-align:left;padding-left:5px;">{{data.subjectCategory}}</td>
              <td>{{data.carryOverSubjectCode = data.subjectCode === '6901' ? projectDictionary.beforeSubject.val : projectDictionary.otherSubject.val}}</td>
              <td>{{data.subjectCode === '6901' ? projectDictionary.beforeSubject.valAlias : projectDictionary.otherSubject.valAlias}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <div class="voucherInfo" v-show="voucherInfoShow">
      <group label-width="7em">
        <datetime title="凭证日期<i style='color:red'>*</i>" v-model="voucherInfo.inOrOutTime"></datetime>
        <selector title="凭证字&nbsp;<span style='color: red;'>*</span>" placeholder="请选择" :options="wordData" v-model="voucherInfo.pzWord"></selector>
        <x-input title="财务库&nbsp;<span style='color: red;'>*</span>" :show-clear="false" v-model="voucherInfo.ckName" :disabled="true" @click.native="openWareHoseList" placeholder="请选择财务库" class="fontColor"></x-input>
        <x-textarea title="凭证摘要&nbsp;<span style='color: red;'>*</span>" :max="2000" placeholder="请输入凭证摘要" v-model="voucherInfo.pzSummary"></x-textarea>
      </group>
    </div>
    <flexbox :gutter="0">
      <flexbox-item v-show="voucherInfoShow || exchangeRateShow">
        <x-button class="btn-save" type="primary" @click.native="prev">上一步</x-button>
      </flexbox-item>
      <flexbox-item v-show="exchangeRateShow || tipsShow">
        <x-button class="btn-common" type="warn" @click.native="next">下一步</x-button>
      </flexbox-item>
      <flexbox-item v-show="voucherInfoShow">
        <x-button class="btn-common" type="warn" @click.native="startAccountProfitAndLoss">开始</x-button>
      </flexbox-item>
    </flexbox>
    <popup v-model="isShowSettingPop" style="background-color:#fff" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <zing-head title="结转设置" :isComeBack="false" @doSome="doSome">
        <div slot="header-right" @click="settingConfirm">
          <span style="margin-right:15px;color:#ff8000">确定</span>
        </div>
      </zing-head>
      <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
        <group label-width="11em">
          <x-input title="以前年度损益对方科目&nbsp;<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="projectDictionary.beforeSubject.valAlias" :disabled="true" @click.native="selectPickedDialog('before')" class="fontColor"></x-input>
          <x-input title="其他损益对方科目&nbsp;<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="projectDictionary.otherSubject.valAlias" :disabled="true" @click.native="selectPickedDialog('other')" class="fontColor"></x-input>
        </group>
      </div>
    </popup>
    <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
    <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @financeItemClick="financeItemClick" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>
  </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import { Z_IsEmpty20 } from "@/utils/fn";
import WarehouseList from "@/container/ziyuanku/financeWarehouse/warehouseList";
import {
  XTable,
  Flexbox,
  FlexboxItem,
  XButton,
  Group,
  XInput,
  Selector,
  XTextarea,
  Datetime,
  Popup,
  PopupHeader
} from "vux";
export default {
  name: "accountProfitAndLoss",
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
    Datetime,
    Popup,
    PopupHeader,
    WarehouseList
  },
  data() {
    return {
      tipsShow: true,
      exchangeRateShow: false,
      voucherInfoShow: false,
      isShowSettingPop: false,
      voucherInfo: {
        pzWord: "",
        pzSummary: ""
      },
      voucherInfoItems: [],

      showWarehoseList: false,

      currentType: "",
      showPicker: false,

      wordData: [], //凭证字

      projectDictionary: {
        beforeSubject: {
          key: "beforeSubject",
          val: "",
          valAlias: "",
          type: "carryOverSubject"
        },
        otherSubject: {
          key: "otherSubject",
          val: "",
          valAlias: "",
          type: "carryOverSubject"
        }
      }
    };
  },
  created() {
    this.getNewDate();
    this.loadWordData();
    this.loadFinance();
    this.loadcarryOverSubject();
  },
  methods: {
    doSome() {
      this.isShowSettingPop = false;
    },
    showSetting() {
      this.isShowSettingPop = true;
    },
    getNewDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let date = new Date().getDate();
      date = date > 9 ? date : "0" + date;
      this.voucherInfo.inOrOutTime = year + "-" + month + "-" + date;
    },
    loadFinance() {
      this.$http
        .get("/zingbiz/finance/subject/select", {
          params: {
            parentId: "sunyi"
          }
        })
        .then(res => {
          let financeArr = res.data.data;
          this.financeArr = financeArr;
        });
    },
    // 结转科目设置
    settingConfirm() {
      let url = "/zingbiz/resourceLibrary/dictionary/saveDictionaries";
      if (!Z_IsEmpty20(this.projectDictionary.beforeSubject.rowId)) {
        url = "/zingbiz/resourceLibrary/dictionary/updateDictionaries";
      }

      if (Z_IsEmpty20(this.projectDictionary.beforeSubject.val)) {
        this.$vux.toast.text("请选择以前年度损益对方科目");
        return;
      }
      if (Z_IsEmpty20(this.projectDictionary.otherSubject.val)) {
        this.$vux.toast.text("请选择其他损益对方科目");
        return;
      }

      let arr = [];
      arr.push(this.projectDictionary.beforeSubject);
      arr.push(this.projectDictionary.otherSubject);
      this.$http.post(url, arr).then(res => {
        if (Z_IsEmpty20(this.projectDictionary.beforeSubject.rowId)) {
          res.data.data.forEach(ele => {
            this.projectDictionary[ele.key] = ele;
          });
        }
        this.$vux.toast.text("设置成功");
        this.isShowSettingPop = false;
      });
    },
    // 结转科目查询
    loadcarryOverSubject() {
      this.$http
        .get("/zingbiz/resourceLibrary/dictionary/findByKeyAndType", {
          params: {
            type: "carryOverSubject"
          }
        })
        .then(res => {
          res.data.data.forEach(ele => {
            this.projectDictionary[ele.key] = ele;
          });
        });
    },
    next() {
      if (this.tipsShow) {
        if (Z_IsEmpty20(this.projectDictionary.beforeSubject.rowId)) {
          this.$vux.toast.text("请先设置转结对方科目");
          return;
        }
        this.tipsShow = false;
        this.exchangeRateShow = true;
      } else {
        this.exchangeRateShow = false;
        this.voucherInfoShow = true;
      }
    },
    prev() {
      if (this.voucherInfoShow) {
        this.voucherInfoShow = false;
        this.exchangeRateShow = true;
      } else {
        this.tipsShow = true;
        this.exchangeRateShow = false;
      }
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
    selectPickedDialog(type) {
      //显示科目页面
      this.currentType = type;
      this.showPicker = true;
    },
    getPickedData(pickedData) {
      //获取科目代码数据
      if (this.currentType === "other") {
        this.projectDictionary.otherSubject.val = pickedData.fileId;
        this.projectDictionary.otherSubject.valAlias = pickedData.filename;
      } else {
        this.projectDictionary.beforeSubject.val = pickedData.fileId;
        this.projectDictionary.beforeSubject.valAlias = pickedData.filename;
      }
      this.showPicker = false;
    },
    subjectAbort() {
      this.showPicker = false;
    },
    openWareHoseList(index) {
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
    startAccountProfitAndLoss() {
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

      let url = "/zingbiz/resourceLibrary/voucher/accountProfitAndLoss";

      let params = {
        subjectArr: JSON.stringify(this.financeArr),
        pzWord: this.voucherInfo.pzWord,
        ckId: this.voucherInfo.ckId,
        ckName: this.voucherInfo.ckName,
        inOrOutTime: this.voucherInfo.inOrOutTime,
        pzSummary: this.voucherInfo.pzSummary
      };
      this.$http.post(url, params).then(res => {
        if (res.data.success) {
          if (res.data.msg === "1") {
            this.$vux.toast.text("结转损益完成，已生成凭证");
          } else if (res.data.msg === "2") {
            this.$vux.toast.text("所有科目金额都为0，未能生成凭证");
          }
          this.tipsShow = true;
          this.exchangeRateShow = false;
          this.voucherInfoShow = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.accountProfitAndLoss {
  height: 100%;

  .tips {
    height: calc(100% - 94px);
    line-height: 20px;
    background-color: #F8F8F8;
  }

  .exchangeRate {
    height: calc(100% - 94px);

    .title {
      line-height: 20px;
      padding: 10px 13px;
    }

    .tableWrapper {
      width: 100%;
      overflow-x: auto;
      height: calc(100% - 64px);

      &::-webkit-scrollbar {
        display: none;
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
          height: calc(100% - 40px);
          overflow: auto;

          tr {
            display: table;
            width: 100%;
            table-layout: fixed;

            td {
              width: 130px;
            }
          }

          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }

  .voucherInfo {
    height: calc(100% - 94px);
  }
}
</style>