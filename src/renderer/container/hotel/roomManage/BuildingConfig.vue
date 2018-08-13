<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addBuildingConfig" size="small">新建</el-button>
                </span>
                <span>
                    <el-input placeholder="请输入关键字" v-model="searchVal" clearable size="small" :style="{width:'345px'}">
                        <el-select v-model="searchType" slot="prepend" style="width: 100px" placeholder="请选择">
                            <el-option label="楼座序号" value="serialNo"></el-option>
                            <el-option label="楼座描述" value="configValue"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search" :style="{width:'45px'}"></el-button>
                    </el-input>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="楼座序号" width="100px">
                    </el-table-column>
                    <el-table-column prop="configValue" label="楼座描述">
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editBuildingConfig(scope.row)" type="text">修改</el-button>
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
                               :page-size="pageSize"
                               :total="total"></el-pagination>
            </div>
        </el-main>
        <el-dialog :title="title" width="40%" :visible.sync="addBuildingModal" @close="closeDia('addPrinterForm')">
            <el-form :model="addBuildingForm" label-width="80px" :rules="addBuildingRules" ref="addPrinterForm">
                <el-form-item label="楼座序号" prop="serialNo">
                    <el-input v-model="addBuildingForm.serialNo" placeholder="请输入楼座序号" type="number" min="0"
                              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
                <el-form-item label="楼座描述" prop="configValue">
                    <el-input v-model="addBuildingForm.configValue" placeholder="请输入楼座描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBuildingModal = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddBuilding('addPrinterForm')" size="small">提交</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [],
                searchType: "",
                searchVal: "",
                value: 30,
                pageNumber: 1,
                pageSize: 30,
                total: null,
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
                showLoading: true,
                addBuildingModal: false,
                title: '',
                addBuildingForm: {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                },
                addBuildingRules: {
                    serialNo: [{required: true, message: '请输入楼座序号', trigger: 'blur'}],
                    configValue: [{required: true, message: '请输入楼座描述', trigger: 'blur'}],
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            //初始化楼座配置列表数据
            initData() {
                let url = "/zingbiz/hotel/hotelNew/getHotelConfig";
                let query = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    configCode: "102",
                }
                if (this.searchVal) {
                    query[this.searchType] = this.searchVal;
                }
                this.$httpSilent
                    .get(url, { params: query })
                    .then(res => {
                        this.showLoading = false;
                        this.tableData = res.data.data;
                        this.total = Number(res.data.total);
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "列表数据获取失败，请重试"});
                    })
            },
            //搜索
            search() {
               this.initData();
            },
            //添加楼座
            addBuildingConfig() {
                this.addBuildingForm = {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                };
                this.title = "添加楼座";
                this.addBuildingModal = true;
            },
            closeDia(formName) {
                this.$refs[formName].resetFields();
                this.addBuildingModal = false;
            },
            //编辑楼座
            editBuildingConfig(row) {
                this.addBuildingForm = {
                    serialNo: row.serialNo,
                    configValue: row.configValue,
                    rowId: row.rowId,
                    configCode: row.configCode,
                };
                this.title = '修改楼座';
                this.addBuildingModal = true;
            },
            //获取当前页数据
            currentPage(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.initData();
            },
            //选择显示条目
            selPageSize(val) {
                this.pageSize = val;
                this.showLoading = true;
                this.initData();
            },
            //确认提交楼座配置项
            submitAddBuilding(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (Number(this.addBuildingForm.serialNo) < 0) {
                            this.$message({type: "warning", message: "请输入正数的序号！"});
                            return
                        }
                        let url = "/zingbiz/hotel/hotelNew/saveHotelConfig";
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url, {
                                "configCode": "102",
                                "configValue": this.addBuildingForm.configValue,
                                "serialNo": this.addBuildingForm.serialNo,
                                "rowId": this.addBuildingForm.rowId,
                            })
                            .then(res => {
                                if (res.data.success) {
                                    this.loadingInstance.close();
                                    this.$message({type: "success", message: "保存成功"});
                                    this.addBuildingModal = false;
                                    this.showLoading = true;
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
            //删除当前楼座配置项
            deleteItem(row) {
                this.$confirm('是否删除该楼座?', '提示', {
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
                                    this.$message({type: 'warning', message: '该楼座被占用，暂时无法删除!'});
                                } else {
                                    this.tableData = this.tableData.filter(item => {
                                        return row.rowId !== item.rowId;
                                    });
                                    this.$message({type: 'success', message: '删除成功!'});
//                                this.showLoading = true;
//                                this.initData();
                                }
                            }
                        })
                        .catch(() => {
                            this.$message({type: "error", message: "删除失败，请重试"});
                        });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'});
                });
            },
        },
    }

</script>

<style scoped lang="stylus">

</style>
