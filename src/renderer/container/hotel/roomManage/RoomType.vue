<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addRoomType" size="small">新建</el-button>
                </span>
                <span>
                    <el-input placeholder="请输入关键字" v-model="searchVal" clearable size="small" style="width: 345px">
                        <el-select v-model="searchType" slot="prepend" style="width: 100px" placeholder="请选择">
                            <el-option label="类型序号" value="serialNo"></el-option>
                            <el-option label="类型描述" value="configValue"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search"
                                   style="width: 45px"></el-button>
                    </el-input>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="类型序号" width="100px"></el-table-column>
                    <el-table-column prop="configValue" label="房间类型描述"></el-table-column>
                    <el-table-column prop="otherValue" label="最大超定" width="100px"></el-table-column>
                    <el-table-column prop="operate" label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editRoomType(scope.row)" type="text">修改</el-button>
                            <el-button size="mini" @click="deleteItem(scope.row)" type="text">删除</el-button>
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
        <el-dialog :title="title" width="30%" :visible.sync="addRoomTypeModal" @close="closeDia('addPrinterForm')">
            <el-form :model="addRoomTypeForm" label-width="120px" :rules="addRoomTypeRules" ref="addPrinterForm">
                <el-form-item label="类型序号" prop="serialNo">
                    <el-input v-model.number="addRoomTypeForm.serialNo" placeholder="请输入类型序号" type="number"
                              min="0" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
                <el-form-item label="房间类型描述" prop="configValue">
                    <el-input v-model="addRoomTypeForm.configValue" placeholder="请输入房间类型描述"></el-input>
                </el-form-item>
                <el-form-item label="最大超定数量" prop="otherValue">
                    <el-input v-model="addRoomTypeForm.otherValue" placeholder="请输入最大超定数量" type="number"
                              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRoomTypeModal = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddRoomType('addPrinterForm')" size="small">提交</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [],
                addRoomTypeModal: false,
                searchType: "",
                searchVal: "",
                addRoomTypeForm: {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                    otherValue: ''
                },
                showLoading: true,
                value: 30,
                pageNumber: 1,
                pageSize: 30,
                total: null,
                title: "",
                pageSizes: [
                    {value: 30, label: '每页显示30条'},
                    {value: 50, label: '每页显示50条'},
                    {value: 100, label: '每页显示100条'},
                ],
                addRoomTypeRules: {
                    serialNo: [{required: true, message: '请输入类型序号', trigger: 'blur'}],
                    configValue: [{required: true, message: '请输入房间类型描述', trigger: 'blur'}],
                    otherValue: [{required: true, message: '请输入最大超定数量', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let url = "/zingbiz/hotel/hotelNew/getHotelConfig";
                let query = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    configCode: "104",
                }
                if (this.searchVal) {
                    query[this.searchType] = this.searchVal;
                }
                this.$httpSilent
                    .get(url, {params: query})
                    .then(res => {
                        this.tableData = res.data.data;
                        this.showLoading = false;
                        this.total = Number(res.data.total);
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "列表数据获取失败，请重试"});
                    })
            },
            search() {
                this.initData();
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
            //添加房间类型
            addRoomType() {
                this.addRoomTypeForm = {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                };
                this.title = "添加房间类型";
                this.addRoomTypeModal = true;
            },
            closeDia(formName) {
                this.$refs[formName].resetFields();
                this.addRoomTypeModal = false;
            },
            //修改房间类型
            editRoomType(row) {
                this.addRoomTypeForm = {
                    serialNo: row.serialNo,
                    configValue: row.configValue,
                    rowId: row.rowId,
                    configCode: row.configCode,
                    otherValue: row.otherValue
                };
                this.title = "修改房间类型";
                this.addRoomTypeModal = true;
            },
            //确认提交房间类型
            submitAddRoomType(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (Number(this.addRoomTypeForm.serialNo) < 0) {
                            this.$message({type: "warning", message: "请输入正数的序号！"});
                            return
                        }
                        let url = "/zingbiz/hotel/hotelNew/saveHotelConfig";
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url, {
                                "configCode": "104",
                                "configValue": this.addRoomTypeForm.configValue,
                                "serialNo": this.addRoomTypeForm.serialNo,
                                "rowId": this.addRoomTypeForm.rowId,
                                "otherValue": this.addRoomTypeForm.otherValue
                            })
                            .then(res => {
                                this.loadingInstance.close();
                                if (res.data.success) {
                                    this.$message({type: "success", message: "保存成功"});
                                    this.addRoomTypeModal = false;
                                    this.showLoading = false;
                                    this.initData();
                                } else {
                                    this.$message({type: "error", message: "保存失败"});
                                }
                            })
                            .catch(() => {
                                this.loadingInstance.close();
                                this.$message({type: "error", message: "保存失败"});
                            });
                    }
                });
            },
            //删除房间类型
            deleteItem(row) {
                this.$confirm('是否删除该房间类型?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = "/zingbiz/hotel/hotelNew/delOtherConfig";
                    this.loadingInstance = this.$loading({});
                    this.$httpSilent
                        .get(url, {
                            params: {
                                rowId: row.rowId
                            }
                        })
                        .then(res => {
                            if (res.data.success) {
                                this.loadingInstance.close();
                                if (res.data.mgs === "-1") {
                                    this.$message({type: 'warning', message: '该房间类型被占用，暂时无法删除!'});
                                } else {
                                    this.tableData = this.tableData.filter(item => {
                                        return item.rowId !== row.rowId;
                                    });
                                    this.$message({type: 'success', message: '删除成功!'});
//                                this.showLoading = true;
//                                this.initData();
                                }
                            }
                        })
                        .catch(() => {
                            this.$message({type: "error", message: "删除失败"});

                        })

                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'});
                });
            },
        },
    }

</script>

<style scoped lang="stylus">

</style>
