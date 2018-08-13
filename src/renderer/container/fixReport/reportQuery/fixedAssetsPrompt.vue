<!-- 固定资产到期提示表 -->
<template>
    <div class="assetList">
         <ZingHead title="固定资产到期提示表" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div class="el-table-model" v-show="defaultPage">
            <div class="el-table-tableTitle">
                会计期间:{{searchData}}
            </div>
            <div class="table-deprecat">
                <el-table class="table-tableData" :data="tableData" style="width: 100%;" border :span-method="objectSpanMethod" show-summary>
                    <el-table-column fixed prop="assetsName" label="资产名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="assetsCoding" label="资产编码" width="100px">
                    </el-table-column>
                    <el-table-column prop="assetsClassName" label="类别" width="100px">
                    </el-table-column>
                    <!-- <el-table-column prop="model" label="型号" width="100px"></el-table-column> -->
                    <el-table-column prop="postingDate" label="入账日期">
                    </el-table-column>
                    <el-table-column prop="period" label="到期年期">
                    </el-table-column>
                    <el-table-column prop="startDate" label="使用日期">
                    </el-table-column>
                    <el-table-column prop="workingConditionIdName" label="使用情况">
                    </el-table-column>
                    <el-table-column prop="departmentName" label="使用部门">
                    </el-table-column>
                     <el-table-column prop="depreciationMethod" label="折旧方法">
                    </el-table-column>
                    <el-table-column prop="count" label="数量">
                    </el-table-column>
                    <el-table-column prop="originalCurrencyAmount" label="原值" width="120px">
                    </el-table-column>
                       <el-table-column prop="accumulatedDepreciationAmount" label="累计折旧" width="120px">
                    </el-table-column>
                         <el-table-column prop="netWorth" label="净值">
                    </el-table-column>
                     <el-table-column prop="impairmentPreparation" label="减值准备">
                    </el-table-column>
                       <el-table-column prop="netAmount" label="净额">
                    </el-table-column>
                    <el-table-column prop="depreciationAmount" label="预计净残值">
                    </el-table-column>
                     <el-table-column prop="originalDepreciation" label="本期折旧额">
                    </el-table-column>
                    <el-table-column prop="usedPeriod" label="使用寿命">
                    </el-table-column>
                    <el-table-column prop="remainingPeriod" label="剩余寿命">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <popup position="top" v-model="isPopup" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="popup-increase">
                <div class="initFrom-title">筛选条件</div>
                <group>
                    <datetime v-model="searchData" title="会计期间" format="YYYY-MM"></datetime>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancleNew">
                            取消
                        </flexbox-item>
                        <flexbox-item class="interspace" @click.native="confirmNew">
                            确认
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
    </div>
</template>
<script>
import Axios from 'axios'
import { Cell, Popup, Group, Datetime, Flexbox, FlexboxItem } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
import { mapActions } from 'vuex'
export default {
    components: {
        ZingHead,
        Cell,
        Popup,
        Group,
        Datetime,
        Flexbox,
        FlexboxItem
    },
    data() {
        return {
          prompt:true,
          defaultPage:false,
          isPopup: false,
          tableData: [],
          currentPage: 1,
          searchData: ""
        };
    },
    methods: {
        //获取折旧方法
        ...mapActions([
                'depreciationMethod',
        ]),
        close() {
            this.$router.go(-1);
        },
        search() {
             this.isPopup = true;
        },
        cancleNew() {
            this.isPopup = false;
          if (this.tableData.length === 0) {
            this.prompt = true
            this.defaultPage = false
          } else {
            this.prompt = false
            this.defaultPage = true
          }
        },
        confirmNew() {
            let vm = this
            if (Z_IsEmpty20(vm.searchData)) {
                vm.$vux.toast.text("请选择会计期间");
            }
            let params = {
                period: vm.searchData
            }
            vm.getAssetPromptData(params)
            this.isPopup = false;
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
            if (row.span > 1) {
            return {
                rowspan: row.span,
                colspan: 1
            };
            } else if (row.span === 0) {
            return {
                rowspan: 0,
                colspan: 0
            };
            } else {
            return {
                rowspan: 1,
                colspan: 1
            };
            }
        }
        },
        getAssetPromptData(params) {
            let vm = this;
            let url = "/zingbiz/fixedAssets/report/selectAssetsExpirationTips";
            Axios.get(url, { 'params': params }).then(res => {
                if (res.data.success) {
                    vm.tableData = res.data.data;
                  if (res.data.data.length === 0) {
                    this.prompt = true
                    this.defaultPage = false
                  } else {
                    this.prompt = false
                    this.defaultPage = true
                  }
                  vm.tableData.forEach(val => {
                      vm.depreciationMethod(val.depreciationMethod)
                      val.depreciationMethod = vm.$store.state.fixedAssets.methodData
                  })
                }
            });
        }
    }
};
</script>
<style scoped>
.assetList {
  height: 100%;
}
.el-table-model{
    height: 100%;
}
.table-deprecat{
    height: calc(100%-120px);
}
.el-table-tableTitle {
  margin-left: 13px;
  height: 34px;
  padding-top: 10px;
  font-size: 14px;
}
.popup-increase{
    height: 100%;
}
.popup-increase .initFrom-title {
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
}
.interspace:last-child {
  border-left: 1px solid #f5f5f5;
  color: #ff8000;
}
.table-tableData >>>.el-table__empty-text{
    left:13% !important;
    color: #ff8000;
    font-size: 18px;
}
.prompt {
  text-align: center;
  color: #ff8000;
  margin-top: 20px;
  font-size :18px;
}
</style>
<style>
.popup-increase .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 83px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>



