<template>
  <el-container>
    <el-main class="flex-column">
      <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addBtn" size="small">新建</el-button>
                </span>
        <span>
                    <span style="display: inline-block">
                        <el-input placeholder="请输入关键字" v-model="searchVal" class="input-with-select" clearable
                                  size="small">
                        <el-select v-model="selectType" slot="prepend" style="width:120px" placeholder="请选择">
                            <el-option label="序号" value="serialNo"></el-option>
                            <el-option label="描述" value="descript"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                    </span>
                    <span>
                        <el-button type="primary" @click="seniorBtn" size="small">高级搜索</el-button>
                    </span>
                </span>
      </div>
      <div style="height: 100%">
        <el-table :data="tableData" border style="width: 100%" height="100%" @row-click="RowClick"
                  v-loading="showLoading">
          <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
          <el-table-column prop="priceCode" label="描述"></el-table-column>
          <el-table-column prop="priceTypeDesc" label="房价类型"></el-table-column>
          <el-table-column prop="checkInType" label="入住类型" :formatter="formatCheckInType"></el-table-column>
          <el-table-column prop="checkInLong" label="时长"></el-table-column>
          <el-table-column label="房间类型" :cell-style="{padding:0}">
            <template slot-scope="scope">
              <div class="itemArr" v-for="(item,index) in scope.row.hotelRoomTypePriceConfigList"
                   :key="index">{{item.roomTypeName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="平日价">
            <template slot-scope="scope">
              <div class="itemArr" v-for="(item,index) in scope.row.hotelRoomTypePriceConfigList"
                   :key="index">{{item.weekdayPrice}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="weekendPrice" label="周末价">
            <template slot-scope="scope">
              <div class="itemArr" v-for="(item,index) in scope.row.hotelRoomTypePriceConfigList"
                   :key="index">{{item.weekendPrice}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modify(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="delCur(scope.row)"
                         :disabled="(scope.row.isDefaultConfig)==='1'">删除
              </el-button>
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
                       :page-size="pageSize"
                       :total="total"></el-pagination>
      </div>
    </el-main>
    <div>
      <el-dialog title="高级搜索" :visible.sync="superSearchModal" width="30%" @close="closeSenior">
        <el-form ref="superSearchForm" :model="superSearchForm" label-width="20%">
          <el-form-item label="序号">
            <el-input v-model="superSearchForm.serialNo" min="0" type="number"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="superSearchForm.descript"></el-input>
          </el-form-item>
          <el-form-item label="房价类型">
            <el-select v-model="superSearchForm.priceTypeDesc" placeholder="请选择房价类型">
              <el-option v-for="item in priceTypes" :key="item.rowId" :label="item.descript"
                         :value="item.descript"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住类型">
            <el-radio-group v-model="superSearchForm.checkInType">
              <el-radio label="1">全天房</el-radio>
              <el-radio label="0">钟点房</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="superSearch" size="small">确定</el-button>
            <el-button size="small" @click="superSearchModal=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="DiaTitle" :visible.sync="newAddModal" width="30%">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="20%" class="demo-ruleForm">
          <el-form-item label="序号" prop="serialNo">
            <el-input v-model="addData.serialNo" type="number" min="0"
                      :disabled="addData.isDefaultConfig==='1'"
                      placeholder="请输入序号"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="priceCode">
            <el-input v-model="addData.priceCode" :disabled="addData.isDefaultConfig==='1'"
                      placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="价格类型" prop="priceTypeDesc">
            <el-select v-model="addData.priceTypeDesc" @change="changePriceTypeSelVal"
                       placeholder="请选择价格类型">
              <el-option v-for="item in priceTypes" :key="item.rowId" :label="item.descript" :ref="item.rowId"
                         :value="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住类型" prop="checkInType">
            <el-radio-group v-model="addData.checkInType">
              <el-radio label="1" :disabled="addData.isDefaultConfig==='1'">全天房</el-radio>
              <el-radio label="2" :disabled="addData.isDefaultConfig==='1'">钟点房</el-radio>
              <el-radio label="3" :disabled="addData.isDefaultConfig==='1'">自用房</el-radio>
              <el-radio label="4" :disabled="addData.isDefaultConfig==='1'">免费房</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="addData.checkInType === '2'" label="入住时长">
            <el-input v-model="addData.checkInLong"></el-input>
          </el-form-item>

          <div v-for="(addTypeItem,index) in addData.hotelRoomTypePriceConfigList" :key="index"
               style="margin-top: 30px">
            <el-form-item label="房间类型" :prop="'hotelRoomTypePriceConfigList.'+index+'.roomTypeId'"
                          :rules="{required: true, message: '请选择房间类型', trigger: 'change'}">
              <el-select v-model="addTypeItem.roomTypeId" placeholder="请选择房间类型" style="width: 70%"
                         @visible-change="visChange($event)" @change="selectRoomType($event,index)">
                <el-option v-for="item in HouseTypes" :key="item.rowId" :label="item.configValue" :ref="item.rowId"
                           :value="item.rowId" :disabled="item.isSelected"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平日价" :prop="'hotelRoomTypePriceConfigList.'+index+'.weekdayPrice'"
                          :rules="{required: true, message: '请填写价格类型!', trigger: 'blur'}">
              <el-input v-model="addTypeItem.weekdayPrice" style="width: 70%" type="number" min="0"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
              <el-button v-if="index!=0" @click.prevent="removeDomain(index)">删除</el-button>
            </el-form-item>
            <el-form-item label="周末价" :prop="'hotelRoomTypePriceConfigList.'+index+'.weekendPrice'">
              <el-input v-model="addTypeItem.weekendPrice" style="width: 70%" type="number" min="0"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="AddType" size="small">新增类型</el-button>
                    <el-button type="primary" @click="sureAdd('addData')" size="small">确 定</el-button>
                    <el-button @click="newAddModal = false" size="small">取 消</el-button>
                </span>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
  import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main";
  import {deepCopy} from "@/utils/fn";

  export default {
    components: {ElContainer},
    data() {
      return {
        selRoomType: [],
        selectType: "",
        searchVal: "",
        superSearchModal: false,
        superSearchForm: {},
        tableData: [],
        newAddModal: false,
        addData: {
          hotelRoomTypePriceConfigList: [{
            roomTypeId: '',
            weekdayPrice: '',
            weekendPrice: '',
          }],
        },
        showLoading: true,
        showCheckInLong: false,
        priceTypes: [],
        HouseTypes: [],
        roomTypePrices: [],
        DiaTitle: '新建',
        pageNumber: 1,
        pageSize: 30,
        total: null,
        value: 30,
        roomType: [],
        pageSizes: [
          { value: 30, label: '每页显示30条' },
          { value: 50, label: '每页显示50条' },
          { value: 100, label: '每页显示100条' },
        ],
        rules: {
          serialNo: [{ required: true, message: '请填写序号!', trigger: 'blur' }],
          priceCode: [{ required: true, message: '请填写描述!', trigger: 'blur' }],
          priceTypeDesc: [{ required: true, message: '请填写价格类型!', trigger: 'blur' }],
          checkInType: [{ required: true, message: '请选择入住类型', trigger: 'change' }],
        },
      }
    },
    watch: {
      superSearchModal: function (isShow) {
        if (!isShow) {
          this.$refs.superSearchForm.resetFields();
        }
      },
      newAddModal: function (isShow) {
        if (!isShow) {
          this.$refs.addData.resetFields();
        }
      },
    },
    created() {
      this.initData();
      this.initHouseType();
      this.initPriceType()
    },
    methods: {
      initData() {
        this.showLoading = true;
        let url = '/zingbiz/hotel/hotelNew/getPriceCodeConfig';
        let queryParams = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            this.showLoading = false;
            this.tableData = res.data.data;
            this.total = Number(res.data.total);
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({type: "error", message: "请求数据失败，请刷新重试"});
          })
      },
      seniorBtn() {
        this.superSearchModal = true;
      },
      //高级搜索 (组织参数)
      superSearch() {
        this.superSearchModal = false;
        this.superSearchForm.pageNumber = this.pageNumber;
        this.superSearchForm.pageSize = this.pageSize;
        this.searchBegin(this.superSearchForm);
      },
      //搜索 (组织参数)
      search() {
        let query = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        };
        if (this.searchVal) {
          query[this.selectType] = this.searchVal;
        }
        this.searchBegin(query);
      },
      //搜索请求 (接受参数)
      searchBegin(params) {
        this.showLoading = true;
        let url = '/zingbiz/hotel/hotelNew/getPriceCodeConfig';
        this.$httpSilent
          .get(url, {params: params})
          .then((res) => {
            this.showLoading = false;
            this.tableData = res.data.data;
            this.total = Number(res.data.total);
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({type: "error", message: "请求数据失败，请刷新重试"});
          })
      },

      //初始化房间类型配置
      initHouseType() {
        let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
        let queryParams = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          configCode: "104",
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            res.data.data.forEach(item => {
              item.isSelected = false;
            });
            this.HouseTypes = res.data.data;
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
          })
      },
      //初始化价格类型配置
      initPriceType() {
        let url = '/zingbiz/hotel/hotelNew/getPriceTypeConfig';
        let queryParams = {
          pageNumber: 1,
          pageSize: 999,
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            this.showLoading = false;
            if (res.data.success) {
              this.priceTypes = res.data.data;
            } else {
              this.$message({ type: "error", message: "初始化数据失败" });
            }
          })
          .catch(() => {
            this.showLoading = false;
            this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
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
        this.tableData = [];
        this.initData();
      },
      changePriceTypeSelVal(val) {
        this.addData.priceTypeId = val;
        this.addData.priceTypeDesc = this.$refs[val][0].label;
      },
      selectRoomType(val, index) {
        this.addData.hotelRoomTypePriceConfigList[index].roomTypeId = val;
        this.addData.hotelRoomTypePriceConfigList[index].roomTypeName = this.$refs[val][0].label;
      },
      visChange(event) {
        if (!event) {
          this.selRoomType = [];
          this.HouseTypes.forEach(item => {
            item.isSelected = false;
          });
        } else {
          this.addData.hotelRoomTypePriceConfigList.forEach((item, index) => {
            if (item.roomTypeId) {
              this.selRoomType.push(item.roomTypeId);
            }
          });
          this.HouseTypes.forEach(item => {
            this.selRoomType.forEach(sel => {
              if (item.rowId === sel) {
                item.isSelected = true
              }
            })
          });
        }
      },
      modify(row) {
        this.addData = deepCopy(row);
        this.newAddModal = true;
        this.DiaTitle = '修改';
      },
      addBtn() {
        this.newAddModal = true;
        this.DiaTitle = '新建';
        this.addData = {
          hotelRoomTypePriceConfigList: [{
            roomTypeId: '',
            roomTypeName: '',
            weekdayPrice: '',
            weekendPrice: '',
          }],
        };
      },
      //新增或修改价格代码
      sureAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = '/zingbiz/hotel/hotelNew/savePriceCodeConfig';
            if (!this.addData.hotelRoomTypePriceConfigList.length) {
              this.$message({ type: "error", message: "请添加类型" });
              return;
            }
            this.loadingInstance = this.$loading({});
            this.$httpSilent
              .post(url, this.addData)
              .then((res) => {
                this.loadingInstance.close();
                if (res.data.success) {
                  this.$message({ type: "success", message: "保存成功" });
                  this.newAddModal = false;
                  this.initData();
                } else {
                  this.newAddModal = false;
                  this.$message({ type: "error", message: "保存失败" });
                }
              })
              .catch(() => {
                this.$message({ type: "error", message: "保存失败" });
              })
          }
        });
      },
      delCur(row) {
        this.$confirm('是否删除该房价?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/zingbiz/hotel/hotelNew/delPriceCodeConfig';
          this.loadingInstance = this.$loading({});
          this.$httpSilent
            .get(url, { params: { rowId: row.rowId }})
            .then((res) => {
              if (res.data.success) {
                this.loadingInstance.close();
                if (res.data.mgs === "-1") {
                  this.$message({ type: 'warning', message: '该房价已被使用，无法删除!' });
                } else {
                  this.$message({ type: 'success', message: '删除成功!' });
                  this.tableData = this.tableData.filter(item => item.rowId !== row.rowId)
                }
              }
            })
            .catch(() => {
              this.showLoading = false;
              this.$message({ type: "error", message: "删除失败，请刷新重试" });
            })
        })
      },
      removeDomain(index) {
        this.addData.hotelRoomTypePriceConfigList.splice(index, 1)
      },
      AddType() {
        this.addData.hotelRoomTypePriceConfigList.push({
          roomTypeId: '',
          roomTypeName: '',
          weekdayPrice: '',
          weekendPrice: '',
        })
      },
      formatCheckInType(row, col, cel) {
        if (row.checkInType === "1") {
          return "全天房"
        } else if (row.checkInType === "2") {
          return "钟点房"
        } else if (row.checkInType === "3") {
          return "自用房"
        } else if (row.checkInType === "4") {
          return "免费房"
        }
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../../assets/stylus/variable.styl';
  @import '../../../assets/stylus/mixin.styl';
  .itemArr {
    border-bottom: 1px solid #ddd;
  }

  .itemArr:last-child {
    border: none;
  }

  .el-table .cell {
    padding: 0 !important;
  }
</style>
