<template>
    <div class="queryResult">
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <ZingHead :title="title" :isComeBack="false" @doSome="doSome()">
                        <div slot="header-right">
                            <span class="header-search" @click="search">
                                <i class="iconfont icon-fangdajing"></i>
                            </span>
                        </div>
                    </ZingHead>
                    <el-table :data="tableData" border style="width: 100%" show-summary>
                        <el-table-column fixed prop="period" label="期间">
                        </el-table-column>
                        <el-table-column prop="assetsCoding" label="资产编号">
                        </el-table-column>
                        <el-table-column prop="assetsName" label="资产名称">
                        </el-table-column>
                        <el-table-column prop="measureUnitIdName" label="单位" width="50px">
                        </el-table-column>
                        <el-table-column prop="currentWorkload" label="本期工作量" >
                        </el-table-column>
                        <el-table-column prop="remainingPeriod" label="剩余工作量">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
import { Popup } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
export default {
  components: {
    ZingHead,
    Popup
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    tableData: {
        type: Array,
        default: function() {
            return [];
        }
    }
  },
  data() {
    return {
      title: "工作量查询",
    //    tableData: [{
    //       date: '2010.11',
    //       code: 'JQ008',
    //       name: '测试demo',
    //       unit: '台',
    //       WorkCount: 25.0000,
    //       lessWorkCount: 50.0000
    //     }, {
    //      date: '2010.10',
    //       code: 'JQ008',
    //       name: '笔记本·',
    //       unit: '',
    //       WorkCount: 0.0000,
    //       lessWorkCount: 72.0000
    //     }]
    };
  },
  methods: {
    search() {
      this.$emit("search");
    },
    //header 返回事件
    doSome() {
      this.$emit("backClick");
    }
  }
};
</script>

