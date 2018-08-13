<template>
  <el-container>
    <el-main class="flex-column">
      <div class="flex-between">
        <span>
          <el-button type="primary" @click="newAdd" size="small">新建</el-button>
        </span>
        <span>
          <el-input placeholder="请输入内容" clearable v-model="searchInput" class="input-with-select" size="small">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
              <el-option label="客户姓名" value="1"></el-option>
              <el-option label="客户手机" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchCustomer"></el-button>
          </el-input>
        </span>
      </div>
      <div style="height: 100%">
        <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
          <el-table-column prop="contactsName" label="姓名" width="100px"></el-table-column>
          <el-table-column prop="gender" label="性别" :formatter="formatSex" width="50px"></el-table-column>
          <el-table-column prop="telPhone" label="手机" width="120px"></el-table-column>
          <el-table-column prop="useName" label="会员名称"></el-table-column>
          <el-table-column prop="memberId" label="会员账号"></el-table-column>
          <el-table-column prop="idCardType" label="证件类型" width="140px"></el-table-column>
          <el-table-column prop="idCard" label="证件号" width="180px"></el-table-column>
          <el-table-column prop="nationality" label="国籍" width="120px"></el-table-column>
          <el-table-column prop="hometown" label="籍贯" width="80px"></el-table-column>
          <el-table-column prop="nation" label="民族" width="50px"></el-table-column>
          <el-table-column prop="hobby" label="爱好"></el-table-column>
          <el-table-column prop="specialRequire" label="特殊需求"></el-table-column>
          <el-table-column prop="operate" label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="editVip(scope.row)" type="text">编辑</el-button>
              <el-button v-if="((scope.row.isVip === '0')||(scope.row.isVip === undefined))" size="mini"
                         @click="bindVip(scope.row,0)" type="text">绑定会员
              </el-button>
              <el-button v-else-if="(scope.row.isVip === '1')" size="mini" @click="bindVip(scope.row,1)" type="text">
                修改会员
              </el-button>
              <el-button size="mini" @click="deleteVip(scope.$index,scope.row)" type="text">删除</el-button>
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

      <external-man-add :append="true" :title="externalTitle" :show="externalAddShow"
                        :form="targetPerson" @cancel="externalAddShow=false"
                        @callback="closeExternalAdd"></external-man-add>
      <bind-vip-card :show="bindVipCard" :title="vipTitle" :outreach="outreachInfo" @cancel="bindVipCard = false"
                     @callback="closeBindVipCard" @IsInitData="initData"></bind-vip-card>
    </el-main>
  </el-container>
</template>

<script>
  import ExternalManAdd from '../components/external/ExternalManAdd.vue'
  import BindVipCard from './BindVipCard.vue'

  export default {
    components: {
      ExternalManAdd,
      BindVipCard,
    },
    data() {
      return {
        isVip: 0, //是否绑定会员卡 0未绑定/1绑定
        value: 30,
        pageNumber: 1,
        pageSize: 30,
        total: null,
        pageSizes: [
          { value: 30, label: '每页显示30条' },
          { value: 50, label: '每页显示50条' },
          { value: 100, label: '每页显示100条' },
        ],
        vipTitle: "",
        bindVipCard: false,
        showLoading: true,
        outreachInfo: {},
        tableData: [],
        externalTitle: "",  //"添加/编辑外联人title",
        externalAddShow: false,
        targetPerson: {},  //编辑的目标外联人对象
        searchInput: "",   //搜索框
        select: "1",
        searchParam: {}
      }
    },
    created() {
      this.initData();
    },
    methods: {
      searchCustomer() {
        if (this.select === "1") {
          this.searchParam.contactsName = this.searchInput;
        } else if (this.select === "2") {
          this.searchParam.telPhone = this.searchInput;
        }
        this.initData();
      },
      initData() {
        let url = "/zingbiz/hotel/hotelNew/getContactsList";
        let param = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          contactsName:this.searchParam.contactsName,
          telPhone:this.searchParam.telPhone
        };
        this.showLoading = true;
        this.$httpSilent
          .get(url, { params: param })
          .then((res) => {
            this.tableData = res.data.data.data;
            this.showLoading = false;
            this.tableData.forEach((item) => {
              if ((typeof (item.isVip) === "undefined") || (item.isVip === "0")) {
                item.useName = "";
                item.memberId = ""
              }
              this.total = Number(res.data.data.total)
            });
            this.searchParam = {};
          })
          .catch(() => {
            this.$message({type: "error", message: "列表数据加载失败，请刷新重试！"});
          })
      },
      formatSex(row, column, cellValue) {
        if (row.gender === "1") {
          return "男"
        } else if (row.gender === "2") {
          return "女"
        }
      },
      //当前页数据展示
      currentPage(val) {
        this.pageNumber = val;
        this.showLoading = true;
        this.initData();
      },
      //选择页面条目展示
      selPageSize(val) {
        this.pageSize = val;
        this.showLoading = true;
        this.initData();
      },
      newAdd() {
        this.externalAddShow = true;
        this.externalTitle = "新建外联人"
      },

      editVip(val) {
        this.targetPerson = Object.assign({}, val);  //编辑时启用副本数据
        this.externalTitle = "编辑外联人";
        this.externalAddShow = true;
      },

      //绑定/修改会员
      bindVip(row, index) {
        this.bindVipCard = true;
        this.outreachInfo = row;
        if (index === 0) {
          this.vipTitle = "绑定会员"
        } else if (index === 1) {
          this.vipTitle = "修改绑定"
        }
      },

      deleteVip(index, row) {
        this.$confirm("是否要删除此外联人?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.showLoading = true;
            let url = "/zingbiz/hotel/hotelNew/delContactsById";
            let param = { contactsId: row.contactsId };
            this.$httpSilent
              .get(url, { params: param })
              .then(res => {
                this.showLoading = false;
                if (res.data.success) {
                  this.$message({ type: "success", message: "删除成功!" });
                  this.tableData = this.tableData.filter((item, index) => {
                    return item.contactsId !== row.contactsId
                  })
                } else {
                  this.$message({ type: "info", message: "删除异常，请重试" });
                }
              });
          })
          .catch(() => {
            this.$message({ type: "info", message: "已取消删除" });
          });
      },

      closeExternalAdd() {
        this.externalAddShow = false;
        this.initData();
      },
      closeBindVipCard() {
        this.bindVipCard = false;
        this.initData();
      },
    }
  }
</script>
<style scoped lang="stylus">

</style>
