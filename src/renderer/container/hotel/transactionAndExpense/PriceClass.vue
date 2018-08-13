<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addNew" size="small">新建</el-button>
                </span>
                <span>
                    <el-form label-width="80px" :inline="true" label-position="right" size="small">
                        <el-form-item>
                            <el-input placeholder="请输入内容" clearable v-model="searchText" size="small">
                                <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width: 80px">
                                    <el-option label="描述" value="descript"></el-option>
                                    <el-option label="序号" value="serialNo"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item size="small">
                            <el-button type="primary" size="small" @click="search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" Height="200px" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column prop="status" label="是否启用" :formatter="formatStatus"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editOne(scope.index,scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="deleteOne(scope.index,scope.row)">删除</el-button>
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
        <el-dialog :title="editTitle" :visible.sync="editModel" center>
            <el-form :model="addDataForm" :rules="rules" ref="addDataForm" label-width="20%" class="demo-ruleForm">
                <el-form-item label="序号" prop="serialNo">
                    <el-input v-model="addDataForm.serialNo" min="0" type="number"
                              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-input v-model="addDataForm.descript"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addDataForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="价格状态" prop="status">
                    <el-radio-group v-model="addDataForm.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editModel = false">取 消</el-button>
                    <el-button type="primary" @click="submitAdd('addDataForm')">确 定</el-button>
                </span>
        </el-dialog>
    </el-container>
</template>
<script>
    export default {
        name: "ConsumeType",
        data() {
            return {
                searchType: "descript",
                searchText: '',
                tableData: [],
                pageSize: 30,
                value:30,
                pageNumber: 1,
                total: null,
                editModel: false,
                showLoading: true,
                editTitle: '',
                addDataForm: {},
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                rules: {
                    serialNo: [{ required: true, message: '请填写序号', trigger: 'blur' },],
                    descript: [{ required: true, message: '请填写描述', trigger: 'blur' },],
                    status: [{ required: true, message: '请选择价格状态', trigger: 'blur' },]
                },
                loadingInstance: null,
            }
        },
        watch: {
            editModel: function (flag) {
                if (flag) {
                    this.$refs.addDataForm.resetFields();
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let queryParam = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                };
                if (this.searchText) {
                    queryParam[this.searchType] = this.searchText;
                }
                let url = '/zingbiz/hotel/hotelNew/getPriceTypeConfig';
                this.showLoading = true;
                this.$httpSilent
                    .get(url, { params: queryParam })
                    .then((res) => {
                        this.showLoading = false;
                        if (res.data.success) {
                            this.tableData = res.data.data;
                            this.total = Number(res.data.total);
                        } else {
                            this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                        }
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
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
            addNew() {
                this.editTitle = "新建";
                this.addDataForm = {};
                this.editModel = true;
            },
            editOne(index, row) {
                this.editTitle = "编辑";
                this.addDataForm = Object.assign({}, row);
                this.editModel = true;
            },
            deleteOne(index, row) {
                this.$confirm("确定删除吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteUrl = "/zingbiz/hotel/hotelNew/delPriceTypeConfig";
                    this.loadingInstance = this.$loading({});
                    this.$httpSilent
                        .get(deleteUrl, {params: {rowId: row.rowId}})
                        .then(res => {
                            this.loadingInstance.close();
                            if (res.data.success) {
                                this.$message({type: "success", message: "删除成功!"});
                                this.initData();
                            } else {
                                this.$message({type: "warning", message: "删除失败!"});
                            }
                        }).catch(error => {
                        this.loadingInstance.close();
                        this.$message({type: "warning", message: "删除失败!"});
                    });
                });
            },
            submitAdd(ref) {
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotel/hotelNew/savePriceTypeConfig";
                        this.$httpSilent
                            .post(url, this.addDataForm)
                            .then(res => {
                                this.loadingInstance.close();
                                if (res.data.success) {
                                    this.editModel = false;
                                    this.$message({type: "success", message: "保存成功"});
                                    this.initData();
                                } else {
                                    this.$message({type: "error", message: "保存失败，请重试"});
                                }
                            }).catch(error => {
                            this.loadingInstance.close();
                            this.$message({type: "error", message: "保存失败，请重试"});
                        });
                    }
                });
            },
            search() {
                this.initData();
            },
            formatStatus(row, column, cellValue) {
                return cellValue === "1" ? "是" : "否";
            }
        }
    }
</script>
<style scoped lang="stylus">

</style>
