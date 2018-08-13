<!-- 折旧费用分配表  -->
<template>
    <div v-show="searchPage" class="searchPage">
        <div v-show="defaultPage" class="defaultPage">
            <group class="default-content">
                <datetime title="起始期间" v-model="allocation.startPeriod" format="YYYY-MM" placeholder="请选择起始期间"></datetime>
                <datetime title="截止期间" v-model="allocation.endPeriod" format="YYYY-MM" placeholder="请选择截止期间"></datetime>
                <selector title="汇总项目" placeholder="" v-model="allocation.summaryProject" direction="rtl" class="operatList" :options="projectList"></selector>
            </group>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="resetPage">重置</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="submitDepreAllocat">查询</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>
<script>
import { Z_IsEmpty20 } from "@/utils/fn";
import {
  Group,
  XInput,
  Datetime,
  Flexbox,
  FlexboxItem,
  XButton,
  Selector
} from "vux";
export default {
  components: {
    Group,
    XInput,
    Datetime,
    Flexbox,
    FlexboxItem,
    XButton,
    Selector
  },
  props: {
    searchPage: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      allocation: {},
      defaultPage: true,
      //汇总项目
      projectList: [
        //   "资产类别" ,"使用状态", "变动方式","经营用途","存放地点","使用部门"
        { key: "assetsClass", value: "资产类别" },
        { key: "workingCondition", value: "使用状态" },
        { key: "changeWay", value: "变动方式" },
        { key: "economicUse", value: "经营用途" },
        { key: "storePlace", value: "存放地点" }
        // { key: "useDept", value: "使用部门" }
      ]
    };
  },
  methods: {
    //取消
    resetPage() {
         this.allocation = {};
    },
    //查询
    submitDepreAllocat() {
        let vm = this;
        if (Z_IsEmpty20(vm.allocation.startPeriod)) {
            vm.$vux.toast.text("请选择起始期间");
            return;
        }
        if (Z_IsEmpty20(vm.allocation.endPeriod)) {
            vm.$vux.toast.text("请选择截止期间");
            return;
        }
        vm.$emit("submitAllocat", vm.allocation);
    }
  }
};
</script>
<style >
.searchPage {
  height: 100%;
}
.defaultPage {
  height: 100%;
}
.default-content {
  height: calc(100% - 94px);
}
.defaultPage .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 83px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>


