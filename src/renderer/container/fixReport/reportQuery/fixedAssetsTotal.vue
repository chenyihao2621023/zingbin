<!-- 固定资产数量统计表 -->
<template>
    <div class="assetList">
        <ZingHead title="固定资产数量统计表" :isComeBack="false" @doSome="close()">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">该报表暂无数据</div>
        <div class="el-table-model" v-show="defaultPage">
            <div class="el-table-tableTitle">
                会计期间:{{period}}
            </div>
            <div class="table-deprecat">
                <el-table :data="tableList" class="table-tableData" style="width: 100%;" border :span-method="objectSpanMethod" show-summary max-height="500">
                    <el-table-column fixed prop="projectName" label="项目名称" align="center">
                    </el-table-column>
                    <el-table-column prop="measureUnitIdName" label="计量单位" align="center">
                    </el-table-column>
                    <el-table-column prop="count" label="数量" align="center">
                    </el-table-column>
                    <el-table-column prop="originalCurrencyAmount" label="原值" align="center">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <popup position="top" v-model="isPopup" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="popup-increase">
                <div class="initFrom-title">筛选条件</div>
                <group>
                    <datetime v-model="period" title="会计期间" format="YYYY-MM"></datetime>
                    <selector title="汇总项目" placeholder="" v-model="summaryProject" direction="rtl" class="operatList" :options="projectList"></selector>

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
import {
  Cell,
  Popup,
  Group,
  Datetime,
  Flexbox,
  FlexboxItem,
  Selector
} from "vux";
import Axios from 'axios'
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
    components: {
        ZingHead,
        Cell,
        Popup,
        Group,
        Datetime,
        Flexbox,
        FlexboxItem,
        Selector
    },
    data() {
        return {
        prompt:true,
        defaultPage:false,
        isPopup: false,
        tableData: [],
        currentPage: 1,
        period: "",
        searchData: "",
        project: "",
        rowSpan:0,
        projectList: [
            { key: "assetsClass", value: "资产类别" },
            { key: "workingCondition", value: "使用状态" },
            { key: "changeWay", value: "变动方式" },
            { key: "economicUse", value: "经营用途" },
            { key: "storePlace", value: "存放地点" },
            // { key: "Department", value: "使用部门" }
        ]
        };
    },
    computed: {
        tableList() {
            let vm = this
            let tmpData = []
            vm.tableData.forEach((item,index) => {
                let tempName = item.projectName
                vm.rowSpan = item.total
                item.data.forEach( (row,index) => {
                        row.projectName = tempName
                        if (vm.rowSpan > 1) {
                            if (index === 0) {
                            row["span"] = vm.rowSpan
                            } else {
                            row["span"] = 0
                            }
                        } else {
                            row["span"] = 1
                        }
                        tmpData.push(row)
                })
            })
            return tmpData
        }
    },
    methods: {
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
            let vm = this;
            if (Z_IsEmpty20(vm.period)) {
                vm.$vux.toast.text("请选择会计期间");
            }
            let summaryProject = vm.summaryProject
                ? { summaryProject: vm.summaryProject }
                : {};
            let params = {
                period: vm.period
            };
            let param = Object.assign(
                {},params,summaryProject)
            vm.getAssetTotal(param)
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
        getAssetTotal(params) {
            let vm = this;
            let url = "/zingbiz/fixedAssets/report/selectAssetsQuantitativeStatistics";
            Axios.get(url, { 'params': params }).then(res => {
                if (res.data.success) {
                  if (res.data.data.length === 0) {
                    this.prompt = true
                    this.defaultPage = false
                  } else {
                    this.prompt = false
                    this.defaultPage = true
                  }
                    vm.tableData = res.data.data;
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
.el-table-model {
  height: 100%;
}
.table-deprecat {
  height: calc(100% - 120px);
}
.el-table-tableTitle {
  margin-left: 13px;
  height: 34px;
  padding-top: 10px;
  font-size: 14px;
}
.popup-increase {
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
.popup-increase .operatList .weui-cell__hd :before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 83px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>
