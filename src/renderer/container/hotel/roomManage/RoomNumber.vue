<template>
  <el-container>
    <el-main class="flex-column">
      <div class="flex-between">
        <span><el-button type="primary" @click="addBtn" size="small">新建</el-button></span>
        <span>
          <el-input placeholder="请输入关键字" v-model="searchVal" class="input-with-select" clearable size="small" :style="{width:'345px'}">
            <el-select v-model="selectType" slot="prepend" style="width: 100px" placeholder="请选择">
              <el-option label="房间号码" value="roomNo"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search" style="width:45px"></el-button>
          </el-input>
          <el-button type="primary" @click="superSearchModal = true" size="small">高级搜索</el-button>
        </span>
      </div>
      <div style="height: 100%">
        <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%"
                  :row-style="{padding:0}">
          <el-table-column prop="roomNo" label="房间号码"></el-table-column>
          <el-table-column prop="floorArea" label="楼区"></el-table-column>
          <el-table-column prop="floorBlock" label="楼座"></el-table-column>
          <el-table-column prop="roomAttr" label="房间属性"></el-table-column>
          <el-table-column prop="roomTypeDesc" label="房间类型"></el-table-column>
          <el-table-column prop="isRoomBar" label="客房酒吧" :formatter="formatBar"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modify(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="delCur(scope.row)">删除</el-button>
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
    </el-main>

    <div>
      <el-dialog title="高级搜索" :visible.sync="superSearchModal" width="30%">
        <el-form ref="superSearchForm" :model="superSearchForm" label-width="20%">
          <el-form-item label="房间号码">
            <el-input v-model="superSearchForm.roomNo"></el-input>
          </el-form-item>
          <el-form-item label="楼区">
            <el-select v-model="superSearchForm.floorArea" placeholder="请选择楼区">
              <el-option v-for="item in AreaProperty" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼座">
            <el-select v-model="superSearchForm.floorBlock" placeholder="请选择楼座">
              <el-option v-for="item in configuration" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间属性">
            <el-select v-model="superSearchForm.roomAttrId" placeholder="请选择房间属性" multiple>
              <el-option v-for="item in roomAttrList" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间类型">
            <el-select v-model="superSearchForm.roomTypeDesc" placeholder="请选择房间类型">
              <el-option v-for="item in roomTypeList" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客房酒吧">
            <el-radio-group v-model="superSearchForm.isRoomBar">
              <el-radio label="1">有</el-radio>
              <el-radio label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="superSearch">确定</el-button>
            <el-button @click="superSearchModal=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :title="DiaTitle" :visible.sync="newAdd" width="40%" @close="closeDia('addData')">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="22%">
          <el-form-item label="号码类型">
            <el-radio-group v-model="numType" @change="changeType">
              <el-radio label="1">单个房间</el-radio>
              <el-radio v-show="!isEdit" label="2">连续房间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房间号码" prop="roomNo">
            <el-input v-model="addData.roomNo" type="number" min="0" :disabled="numType ==='2'"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="起始-终止房号" prop="roomNoStart">
            <el-input v-model="addData.roomNoStart" type="number" min="0" maxlength="300px" :disabled="numType ==='1'"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            -
            <el-input v-model="addData.roomNoEnd" type="number" min="0" maxlength="300px" :disabled="numType ==='1'"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>
          <el-form-item label="楼区" prop="floorArea">
            <el-select v-model="addData.floorArea" @change="SelFloorArea" placeholder="请选择楼区">
              <el-option v-for="item in AreaProperty" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId" :ref="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼座" prop="floorBlock">
            <el-select v-model="addData.floorBlock" @change="SelConfiguration" placeholder="请选择楼座">
              <el-option v-for="item in configuration" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId" :ref="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间属性" prop="roomAttrId">
            <el-select v-model="addData.roomAttrId" placeholder="请选择房间属性" multiple @change="SelRoomAttr">
              <el-option v-for="item in roomAttrList" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId" :ref="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeDesc">
            <el-select v-model="addData.roomTypeDesc" @change="SelRoomType" placeholder="请选择房间类型">
              <el-option v-for="item in roomTypeList" :key="item.rowId" :label="item.configValue"
                         :value="item.rowId" :ref="item.rowId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="addData.isRoomBar">客房酒吧</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sureAdd('addData')" size="small">确 定</el-button>
                    <el-button @click="newAdd = false" size="small">取 消</el-button>
                </span>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        newAdd: false,
        selectType: "",              //基础搜索
        searchVal: "",
        superSearchModal: false,    //高级搜搜modal
        superSearchForm: {},         //高级搜索form表单
        showLoading: true,
        tableData: [],
        isEdit: false,       //用于控制连续号码是否显示
        DiaTitle: '添加房间',
        addData: {
          roomAttrId: [],
          isRoomBar: ""
        },
        AreaProperty: [],
        configuration: [],
        roomAttrList: [],
        roomTypeList: [],
        pageNumber: 1,
        pageSize: 30,
        total: 0,
        value: 30,
        pageSizes: [
          { value: 30, label: '每页显示30条' },
          { value: 50, label: '每页显示50条' },
          { value: 100, label: '每页显示100条' },
        ],
        numType: "1",
        rules: {
          floorArea: [{ required: true, message: '请选择楼区', trigger: 'change' }],
          floorBlock: [{ required: true, message: '请选择楼座', trigger: 'change' }],
          roomAttrId: [{ required: true, message: '请选择房间属性', trigger: 'change' }],
          roomTypeDesc: [{ required: true, message: '请选择房间类型', trigger: 'change' }]
        }
      }
    },
    created() {
      this.initData();
      this.initAreaProperty();
      this.initConfiguration();
      this.initRoomAttr();
      this.initRoomType();
    },
    methods: {
      //初始化页面房间号码列表
      initData() {
        this.showLoading = true;
        let url = '/zingbiz/hotel/hotelNew/getHotelRoomList';
        let queryParams = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            this.showLoading = false;
            if (res.data.success) {
              this.tableData = res.data.data;
              this.total = Number(res.data.total);
            } else {
              this.$message({ type: "error", message: "请求数据失败" });
            }
          })
      },
      //高级搜索(组织参数)
      superSearch() {
        this.superSearchModal = false;
        this.superSearchForm.pageNumber = this.pageNumber;
        this.superSearchForm.pageSize = this.pageSize;
        this.searchGo(this.superSearchForm);
      },
      //搜索(组织参数)
      search() {
        let query = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        if (this.searchVal) {
          query[this.selectType] = this.searchVal
        }
        this.searchGo(query);
      },
      //搜索请求(接受参数)
      searchGo(params) {
        this.showLoading = true;
        let url = '/zingbiz/hotel/hotelNew/getHotelRoomList';
        this.$httpSilent
          .get(url, { params: params })
          .then((res) => {
            this.showLoading = false;
            if (res.data.success) {
              this.tableData = res.data.data;
              this.total = Number(res.data.total);
            } else {
              this.$message({ type: "error", message: "搜索失败" });
            }
          })
      },
      //初始化楼区属性
      initAreaProperty() {
        let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
        let queryParams = {
          pageNumber: 1,
          pageSize: 999,
          configCode: "100"
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            if (res.data.success) {
              this.AreaProperty = res.data.data;
            } else {
              this.$message({ type: "error", message: "数据初始化失败" });
            }
          })
      },
      //初始化楼座属性
      initConfiguration() {
        let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
        let queryParams = {
          pageNumber: 1,
          pageSize: 999,
          configCode: "102"
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            if (res.data.success) {
              this.configuration = res.data.data
            } else {
              this.$message({ type: "error", message: "数据初始化失败" });
            }
          })
      },
      //初始化房间属性
      initRoomAttr() {
        let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
        let queryParams = {
          pageNumber: 1,
          pageSize: 999,
          configCode: "103"
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            if (res.data.success) {
              this.roomAttrList = res.data.data
            } else {
              this.$message({ type: "error", message: "数据初始化失败" });
            }
          })
      },
      //初始化房间类型
      initRoomType() {
        let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
        let queryParams = {
          pageNumber: 1,
          pageSize: 999,
          configCode: "104"
        };
        this.$httpSilent
          .get(url, { params: queryParams })
          .then((res) => {
            if (res.data.success) {
              this.roomTypeList = res.data.data;
            } else {
              this.$message({ type: "error", message: "数据初始化失败" });
            }
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
      addBtn() {
        this.newAdd = true;
        this.isEdit = false;
        this.DiaTitle = '添加房间';
        this.addData = {
          roomAttrId: [],
          isRoomBar: ""
        };
      },
      modify(row) {
        this.newAdd = true;
        this.isEdit = true;
        this.DiaTitle = '修改房间';
        this.addData = Object.assign({}, row);       //复制数据
        if (this.addData.roomAttrId) {
          this.addData.roomAttrId = this.addData.roomAttrId.split(",");
        }
        if (this.addData.isRoomBar === "1") {
          this.addData.isRoomBar = true;
        } else {
          this.addData.isRoomBar = false;
        }
      },

      //新建或修改房间号码
      sureAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addData.roomNo === "" && (this.addData.roomNoStart === "" && this.addData.roomNoEnd === "")) {
              this.$message({ type: "warning", message: "请填写对应的房间号码!" });
              return
            }
            if ((this.addData.roomNoEnd - this.addData.roomNoStart) >= 100) {
              this.$message({ type: "warning", message: "单次创建房间最多只能建100个" });
              return
            }
            let url = '/zingbiz/hotel/hotelNew/saveRoomInfo';
            this.loadingInstance = this.$loading({});
            //格式化房间属性,多选

            if (this.addData.roomAttrId) {
              this.addData.roomAttrId = this.addData.roomAttrId.join(",");
            }
            if (this.addData.isRoomBar) {
              this.addData.isRoomBar = "1";
            } else {
              this.addData.isRoomBar = "0";
            }
            delete this.addData['roomAttr'];
            this.$httpSilent
              .post(url, this.addData)
              .then(res => {
                this.loadingInstance.close();
                if (res.data.success) {
                  if (res.data.data === "-1") {
                    this.$message({ type: "error", message: "该房间已经存在，请重新填写房号" });
                  } else {
                    this.$message({ type: "success", message: "保存成功" });
                    this.newAdd = false;
                    this.initData()
                  }
                } else {
                  this.newAdd = false;
                  this.$message({ type: "error", message: "保存失败" });
                }
              })
          }
        });
      },
      //删除房间号码
      delCur(row) {
        this.$confirm('是否删除该房间号码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/zingbiz/hotel/hotelNew/delHotelRoom';
          this.loadingInstance = this.$loading({});
          let query = { roomId: row.roomId };
          this.$httpSilent
            .get(url, { params: query })
            .then((res) => {
              if (res.data.success) {
                this.loadingInstance.close();
                this.$message({ type: 'success', message: '删除成功' });
                this.tableData = this.tableData.filter((item) => {
                  return item.roomId !== row.roomId
                });
              }
            })

        });
      },
      SelFloorArea(val) {
        this.addData.floorAreaId = val;
        this.addData.floorArea = this.$refs[val][0].label;
      },
      SelConfiguration(val) {
        this.addData.floorBlockId = val;
        this.addData.floorBlock = this.$refs[val][0].label;
      },
      SelRoomType(val) {
        this.addData.roomTypeId = val;
        this.addData.roomTypeDesc = this.$refs[val][0].label;
      },
      changeType(val) {
        if (val === "1") {
          this.addData.roomNoStart = "";
          this.addData.roomNoEnd = "";
        } else {
          this.addData.roomNo = "";
        }
      },
      formatBar(row, col, key) {
        if (row.isRoomBar === "1") {
          return "有";
        } else if (row.isRoomBar === "0") {
          return "无"
        }
      },
      closeDia(formName) {
        this.addData = {
          roomAttrId: [],
          isRoomBar: ""
        };
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped lang="stylus">
  .el-input {
    width: auto;
  }
</style>
