<template>
  <el-container>
    <el-main class="flex-column">
      <div class="flex-between">
        <span>
          <el-button type="primary" @click="addUnitCompany" class="add" size="small">添加</el-button>
        </span>
        <span>
          <el-input placeholder="请输入内容" clearable v-model="searchUnitKeyword" size="small" class="input-with-select">
            <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width: 120px" size="small">
              <el-option label="单位名称" value="agreeUnitName"></el-option>
              <el-option label="联系人名称" value="linkman"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchUnit" size="small" style="width: 45px"></el-button>
          </el-input>
        </span>
      </div>
      <div style="height: 100%">
        <el-table :data="agreeUnitList" border style="width: 100%" height="100%" v-loading="showLoading">
          <el-table-column prop="hotelAgreeUnit.agreeState" label="状态" :formatter="formatState"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.agreeUnitName" label="单位名称" width="160"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.linkman" label="联系人"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.telephone" label="联系人电话"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.contractNumber" label="合同号"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.startTime" label="合同开始日期"></el-table-column>
          <el-table-column prop="hotelAgreeUnit.endTime" label="合同结束日期"></el-table-column>
          <el-table-column label="挂账总额度">
            <template slot-scope="scope">
              <span>{{scope.row.accountTotal}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已使用额度">
            <template slot-scope="scope">
              <span>{{scope.row.accountAlready}}</span>
            </template>
          </el-table-column>
          <el-table-column label="房费折扣">
            <template slot-scope="scope">
              <span>{{scope.row.discount}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="detailUnit(scope.row)" type="text" size="small">详情</el-button>
              <el-button @click="deleteUnit(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex-right">
        <el-select v-model="value" placeholder="请选择显示条目" @change="selPageSize" size="mini">
          <el-option v-for="item in pageSizes" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-pagination background layout="prev, pager, next" @current-change="currentPage"
                       :page-size="pageSize" :total="total">
        </el-pagination>
      </div>

      <!-- 组件引用集合 -->
      <div>
        <add-agreement-unit :show="showAddAgreementUnit" @confirm="addUnit"
                            @cancel="showAddAgreementUnit = false"></add-agreement-unit>
        <agreement-unit-info :show="showUnitInfo" :data="detailRowInfo" @confirm="addInit"
                             @cancel="showUnitInfo = false"></agreement-unit-info>
      </div>

    </el-main>
  </el-container>
</template>

<script>
  import AddAgreementUnit from './AddAgreementUnit.vue';
  import AgreementUnitInfo from './AgreementUnitInfo.vue';

  export default {
    components: {
      AddAgreementUnit,
      AgreementUnitInfo
    },
    data() {
      return {
        searchUnitKeyword: "",   //搜索关键字
        searchType: "agreeUnitName",  //搜索默认选择项
        showAddAgreementUnit: false,   //添加协议单位
        showUnitInfo: false,  //协议单位信息
        showLoading: true,
        value: 30,
        pageNumber: 1,
        pageSize: 30,
        total: null,
        agreeUnitList: [],
        pageSizes: [
          {
            value: 30,
            label: '每页显示30条'
          },
          {
            value: 50,
            label: '每页显示50条'
          },
          {
            value: 100,
            label: '每页显示100条'
          },
        ],
        detailRowInfo: {},
        searchParam:{},
      }
    },
    created() {
      this.initData();
    },
    methods: {
      formatState(row, column, cellValue) {
        if (row.hotelAgreeUnit.agreeState === "0") {
          return "启用"
        } else if (row.hotelAgreeUnit.agreeState === "1" || row.hotelAgreeUnit.agreeState === null) {
          return "停用"
        }
      },
      addUnit() {
        this.showAddAgreementUnit = false;
        this.initData();
      },
      addInit() {
        this.showUnitInfo = false;
        this.initData();
      },
      searchUnit() {
        if (this.searchType === "agreeUnitName") {
          this.searchParam.agreeUnitName = this.searchUnitKeyword;
        } else if (this.searchType === "linkman") {
          this.searchParam.linkman = this.searchUnitKeyword;
        }
        this.initData();
      },
      initData() {
        let url = "/zingbiz/hotel/hotelAgreeUnitService/getHotelAgreeUnit";
        let params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          agreeUnitName:this.searchParam.agreeUnitName,
          linkman:this.searchParam.linkman
        };
        this.$httpSilent
          .get(url, { params: params })
          .then((res) => {
            this.showLoading = false;
            this.agreeUnitList = res.data.data;
            this.total = Number(res.data.total);
            this.searchParam = {};
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({ type: "error", message: "数据获取失败，请重试！" })
          })
      },
      currentPage(val) {
        this.pageNumber = val;
        this.showLoading = true;
        this.initData();
      },
      selPageSize(val) {
        this.pageSize = val;
        this.showLoading = true;
        this.initData();
      },
      addUnitCompany() {
        this.showAddAgreementUnit = true;
      },
      //协议单位详情
      detailUnit(row) {
        this.detailRowInfo = row;
        this.showUnitInfo = true;

      },
      deleteUnit(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = "/zingbiz/hotel/hotelAgreeUnitService/delAgreeUnit";
          let params = {
            agreeUnitId: row.hotelAgreeUnit.agreeUnitId
          };
          this.showLoading = true;
          this.$httpSilent
            .post(url, params)
            .then((res) => {
              this.showLoading = false;
              this.agreeUnitList = this.agreeUnitList.filter(item => item.hotelAgreeUnit.agreeUnitId !== row.hotelAgreeUnit.agreeUnitId);
              this.$message({ type: "success", message: "删除成功！" })
            })
            .catch(() => {
              this.showLoading = false;
              this.$message({ type: "error", message: "删除失败，请重试！"})
            })
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除" })
        })
      }
    }
  }
</script>
<style scoped>

</style>
