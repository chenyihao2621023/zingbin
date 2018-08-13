<template>
  <el-container>
    <el-main class="flex-column">
      <div class="flex-between">
        <span>
          <el-button type="primary" @click="showOrgSelectModal = true" size="small">新建</el-button>
        </span>
        <span>
          <el-input placeholder="请输入用户姓名" v-model="searchVal" size="small">
            <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
          </el-input>
        </span>
      </div>
      <div style="height: 100%">
        <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
          <el-table-column prop="contactsName" label="姓名"></el-table-column>
          <el-table-column prop="discount" label="订餐打折额度"></el-table-column>
          <el-table-column prop="freeMoney" label="订单免单额度"></el-table-column>
          <el-table-column prop="tempPriceAuth" label="临时房价权限"></el-table-column>
          <el-table-column prop="operate" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button size="mini" @click="editRow(scope.row,'edit')" type="text">编辑</el-button>
              <el-button size="mini" @click="deleteRow(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex-right">
        <el-select v-model="value" placeholder="请选择显示条目" @change="selPageSize" size="mini" clearable>
          <el-option v-for="item in pageSizes" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-pagination background layout="prev, pager, next" @current-change="currentPage"
                       :page-size="pageSize" :total="total">
        </el-pagination>
      </div>

      <el-dialog title="权限设置" :visible.sync="showPowerVisible" width="40%" ref="powerForm" append-to-body
                 @close="closePowerDialog">
        <div class="powerTop">
          <span>姓名：{{personData.userName}}</span>
          <i style="color: red">*</i> <span>授权码：<el-input v-model="powerForm.powerPassword"
                                                          placeholder="请输入6-20位密码，包含数字、字母、下划线" size="small"
                                                          style="width: 250px;"></el-input></span>
          <p>备注：
            <el-input v-model="powerForm.remark" size="small" style="width: 85%"></el-input>
          </p>
        </div>
        <div class="powerBottom">
          <p>
            <el-checkbox v-model="powerSetting.quotaCheck" label="协议单位额度权限"
                         @change="checkPower(powerSetting.quotaCheck,'XYDW','','')"></el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="powerSetting.discountCheck" label="打折权限"
                         @change="checkPower(powerSetting.discountCheck,'DZ',powerForm.discountPerc,discountedItem)"></el-checkbox>
            <span class="setting"><span class="settingSpan">打折额度</span>
              <el-input v-model="powerForm.discountPerc"
                        @change="checkPower(powerSetting.discountCheck,'DZ',powerForm.discountPerc,discountedItem)"
                        type="number" min="0" max="100"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        style="width: 150px;" size="small"></el-input> %</span>
            <span class="setting">
              <span class="settingSpan">打折项目</span>
              <el-select multiple
                @change="checkPower(powerSetting.discountCheck,'DZ',powerForm.discountPerc,discountedItem)"
                size="small" v-model="discountedItem" placeholder="请选择" clearable style="width: 150px">
                <el-option
                  v-for="item in powerForm.discounted"
                  :key="item.rowId"
                  :label="item.descript"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </span>
          </p>
          <p>
            <el-checkbox v-model="powerSetting.freeCheck"
                         @change="checkPower(powerSetting.freeCheck,'MD',radio,powerForm.freeAmount)"
                         label="免单权限"></el-checkbox>
            <el-radio-group v-model="radio"
                            @change="checkPower(powerSetting.freeCheck,'MD',radio,powerForm.freeAmount)">
              <el-radio :label="0">全额免单</el-radio>
              <el-radio :label="1">部分免单</el-radio>
            </el-radio-group>
            <span v-show="showPartFree" class="setting" style="margin-left: 20px"><span class="settingSpan">额度</span><el-input
              v-model="powerForm.freeAmount"
              @change="checkPower(powerSetting.freeCheck,'MD',radio,powerForm.freeAmount)" size="small" type="number"
              min="0" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              style="width: 150px;"></el-input></span>
          </p>
          <p>
            <el-checkbox v-model="powerSetting.interimRoomPriceCheck"
                         @change="checkPower(powerSetting.interimRoomPriceCheck,'LSFJ','','')"
                         label="临时房价权限"></el-checkbox>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
                    <el-button :disabled="passWordVal" size="small" type="primary"
                               @click="savePowerSetting">确 定</el-button>
                    <el-button size="small" @click="showPowerVisible = false">取 消</el-button>
                </span>
      </el-dialog>

      <org-member-picker :showTab="showTab" :initialSelected="[]" :showPicker="showOrgSelectModal"
                         :multiple="false" @picked="okSelectMember"
                         @abort="showOrgSelectModal=false"></org-member-picker>
    </el-main>
  </el-container>
</template>

<script>
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";

  export default {
    components: {
      OrgMemberPicker
    },
    data() {
      return {
        showTab: ["colleague"],   //选人组件tab显示
        showOrgSelectModal: false,  //选人组件
        showPowerVisible: false,  //权限设置
        showLoading: true,
        searchVal: "",
        personData: {},
        radio: "",
        radioVal: "",
        value: 30,
        pageNumber: 1,
        pageSize: 30,
        total: null,
        powerSetting: {
          quotaCheck: false,
          discountCheck: false,
          freeCheck: false,
          interimRoomPriceCheck: false
        },
        discountedItem: [],      //打折项目
        powerForm: {
          powerPassword: "",       //权限密码
          remark: "",              //备注
          discounted: [],          //打折项目
          discountPerc: "",        //打折百分比
          discountedItemId: "",    //打折项目id
          freeAmount: "",          //免单金额
          hotelUserAuthId: "",     //酒店用户关联id
          rowId: "",
        },
        userAuthDetails: [],         //酒店用户权限
        editPersonRowId: "",
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
      }
    },
    computed: {
      showPartFree() {
        if (this.radioVal === 0 || this.radioVal === "") {
          return false
        } else if (this.radioVal === 1) {
          return true
        }
      },
      passWordVal() {
        let patrn = /^(\w){6,20}$/;
        if (patrn.exec(this.powerForm.powerPassword)) {
          return false
        } else {
          return true
        }
      }
    },
    created() {
      this.initData();
    },
    methods: {
      initData() {
        let url = "/zingbiz/hotel/hotelUserAuth/getHotelUserAuthList";
        let params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        };
        if (this.searchVal !== "") {
          params.contactsName = this.searchVal
        }
        this.$httpSilent
          .get(url, { params: params })
          .then((res) => {
            this.showLoading = false;
            if (res.data.success) {
              this.tableData = res.data.data;
              this.total = Number(res.data.total);
            }
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({ type: "error", message: "列表数据获取失败" })
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

      //权限选择和设置
      /*
      * state:对应权限checkbox的选中值
      * authKey:后台接口中每一种权限对应的状态key
      * authValue1:后台接口中authvalue1对应的值
      * authValue2:后台接口中authvalue2对应的值
       */
      checkPower(state, authKey, authValue1, authValue2) {
        if (state) {
          let hasAuthKeyItem = this.userAuthDetails.some(item => item.authKey === authKey);
          if (authKey === "MD") {
            this.radioVal = authValue1;
          }
          if (authKey === "DZ") {
            authValue2 = authValue2.join(",").trim()
          }
          if (hasAuthKeyItem) {
            this.userAuthDetails = this.userAuthDetails.map(item => {
              if (item.authKey === authKey) {
                item.authValue1 = authValue1;
                item.authValue2 = authValue2
              }
              return item
            })
          } else {
            this.userAuthDetails.push({
              authKey,
              authValue1: authValue1,
              authValue2: authValue2
            })
          }
        } else {
          this.userAuthDetails = this.userAuthDetails.filter(item => item.authKey !== authKey)
        }
      },

      // 保存权限设置
      savePowerSetting() {
        let url = "/zingbiz/hotel/hotelUserAuth/saveHotelUserAuth";
        let params = {
          contactsId: this.personData.rowId,
          contactsName: this.personData.userName,
          password: this.powerForm.powerPassword,
          remark: this.powerForm.remark,
          rowId: this.editPersonRowId,
          userAuthDetails: this.userAuthDetails
        };
        if (this.powerSetting.discountCheck) {
          if ((this.powerForm.discountPerc === "" || this.powerForm.discountPerc === undefined) || this.discountedItem.length === 0) {
            this.$message({ type:"warning",message:"请输入打折额度和打折项目" });
            return
          }
        }
        if (this.powerSetting.freeCheck) {
          if (this.radio === "") {
            this.$message({ type:"warning",message:"请选择全额免单或部分免单" });
            return
          }
          if (this.radio === 1) {
            if (this.powerForm.freeAmount === "" || this.powerForm.freeAmount === undefined) {
              this.$message({ type:"warning",message:"请输入部分免单金额" });
              return
            }
          }
        }
        this.loadingInstance = this.$loading({});
        this.$httpSilent
          .post(url, params)
          .then((res) => {
            this.loadingInstance.close();
            if (res.data.data === "-1") {
              this.$message({ type: "error", message: "此授权码已被使用，请重新设置授权码" });
            } else {
              this.$message({ type: "success", message: "权限内容设置成功" });
              this.showPowerVisible = false;
              this.personData = {};
              this.userAuthDetails = [];
              this.showLoading = true;
              this.initData();
            }

          })
          .catch(() => {
            this.$message({ type: "error", message: "权限内容设置失败，请重试！" });
          })
      },

      editRow(data) {
        this.showPowerVisible = true;
        this.personData.userName = data.contactsName;
        this.powerForm = {
          powerPassword: data.password,
          remark: data.remark,
        };
        this.editPersonRowId = data.rowId;
        this.initPersonPower();
      },

      //选择成员回调
      okSelectMember(list) {
        this.personData = list[0];
        this.showOrgSelectModal = false;
        this.showPowerVisible = true;
        this.initPersonPower()
      },
      //初始化成员权限
      initPersonPower() {
        let url = "/zingbiz/hotel/hotelUserAuth/getByHotelUserAuthId";
        let params = {
          hotelUserAuthId: this.editPersonRowId
        };
        this.$httpSilent
          .get(url, { params: params })
          .then((res) => {
            if (res.data.success) {
              this.powerForm.discounted = res.data.data.tradeTypeConfigList;
              this.userAuthDetails = res.data.data.userAuthDetails;
              this.userAuthDetails.forEach((item, index) => {
                if (item.authKey === "XYDW") {
                  this.powerSetting.quotaCheck = true;
                  this.powerForm.hotelUserAuthId = item.hotelUserAuthId;
                  this.powerForm.rowId = item.rowId
                }
                if (item.authKey === "DZ") {
                  this.powerSetting.discountCheck = true;
                  this.powerForm.discountPerc = item.authValue1;
                  this.discountedItem = item.authValue2.split(",");
                  this.powerForm.hotelUserAuthId = item.hotelUserAuthId;
                  this.powerForm.rowId = item.rowId
                }
                if (item.authKey === "MD") {
                  this.powerSetting.freeCheck = true;
                  this.powerForm.hotelUserAuthId = item.hotelUserAuthId;
                  this.powerForm.rowId = item.rowId;
                  this.powerForm.freeAmount = item.authValue2
                  if (item.authValue1 === "0") {
                    this.radioVal = 0;
                    this.radio = 0;
                  } else if (item.authValue1 === "1") {
                    this.radioVal = 1;
                    this.radio = 1;
                  }
                }
                if (item.authKey === "LSFJ") {
                  this.powerSetting.interimRoomPriceCheck = true;
                  this.powerForm.hotelUserAuthId = item.hotelUserAuthId;
                  this.powerForm.rowId = item.rowId
                }
              });
            }
          })
          .catch(() => {
            this.$message({ type: "error", message: "项目数据获取失败" })
          })
      },

      deleteRow(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = "/zingbiz/hotel/hotelUserAuth/delHotelUserAuth";
          let params = {
            hotelUserAuthId: row.rowId
          };
          this.loadingInstance = this.$loading({});
          this.$httpSilent
            .get(url, { params: params })
            .then(() => {
              this.loadingInstance.close();
              this.initData();
              this.$message({ type: "success", message: "删除成功" });
            })
            .catch(() => {
              this.$message({ type: "error", message: "删除失败" })
            })
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除" })
        })
      },

      closePowerDialog() {
        this.showPowerVisible = false;
        this.editPersonRowId = "";
        this.radio = "";
        this.powerSetting = {
          quotaCheck: false,
          discountCheck: false,
          freeCheck: false,
          interimRoomPriceCheck: false
        };
        this.discountedItem = "";  //打折项 目
        this.powerForm = {
          powerPassword: "",       //权限密码
          remark: "",              //备注
          discounted: [],          //打折项目
          discountPerc: "",   //打折百分比
          discountedItemId: "",  //打折项目id
          freeAmount: "",   //免单金额
        };
      },
    }
  }
</script>
<style scoped lang="stylus">
  .powerTop {
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
    span {
      display: inline-block;
      width: 45%
    }
    p {
      margin: 10px 0;
    }
  }

  .powerBottom {
    p {
      padding: 10px 0;
    }
  }

  .setting {
    display: inline-block;
    width: 35%;
    .settingSpan {
      display: inline-block;
      width: 80px;
      text-align: right;
      padding-right: 5px;
    }
  }

  .el-checkbox {
    width: 20%;
  }

  .el-radio + .el-radio {
    margin-left: 57px;
  }
</style>
