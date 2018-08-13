<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" size="small" @click="addPayClass">新建</el-button>
                </span>
                <span>
                    <el-form label-width="80px" :inline="true" label-position="right" size="small">
                        <el-form-item>
                            <el-input placeholder="请输入内容" clearable v-model="searchText">
                                <el-select v-model="searchType" slot="prepend" placeholder="请选择" size="small" style="width: 80px">
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
                <el-table :data="payClassData" border style="width: 100%" v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button @click="editTheOne(scope.index,scope.row)" :disabled="isDisable(scope.row)" type="text" size="small">修改</el-button>
                            <el-button @click="deleteTheOne(scope.$index,scope.row)" :disabled="isDisable(scope.row)" type="text" size="small">删除
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
                               :total="total">
                </el-pagination>
            </div>
        </el-main>
        <div class="dialog">
            <el-dialog :title="title" :visible.sync="addPayClassModal">
                <el-form :model="addPayClassForm" ref="addPayClassForm" :rules="rules" label-width="100px">
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="addPayClassForm.serialNo" min="0" type="number"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="descript">
                        <el-input v-model="addPayClassForm.descript"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('addPayClassForm')" size="small">提交</el-button>
                    <el-button @click="addPayClassModal = false" size="small">取 消</el-button>
                </div>
            </el-dialog>
            <subject-picker :showPicker="showPicker" @picked="onPicked"
                            @abort="onPickAbort"></subject-picker>
        </div>
    </el-container>
</template>
<script>
    import SubjectPicker from "../../../components/subjectpicker/SubjectPicker.vue";

    export default {
        name: "PayClass",
        components: { SubjectPicker },
        data() {
            return {
                searchType: "descript",
                searchText: "",
                showPicker: false,
                pageSize: 30,
                pageNumber: 1,
                value:30,
                total: 10,
                showLoading: false,
                payClassData: [],
                title: "新建",
                addPayClassForm: {},
                addPayClassModal: false,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                rules: {
                    serialNo: [{ required: true, message: '请输入序号', trigger: 'blur' }],
                    descript: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
//                    subjectCode: [{ required: true, message: '请输入科目代码', trigger: 'blur' }],
                },
                loadingInstance: null, //loading实例
            }
        },
        watch: {
            addPayClassModal: function (flag) {
                if (flag) {
                    this.$refs.addPayClassForm.resetFields();
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let self = this;
                let queryParam = {
                    pageNumber: self.pageNumber,
                    pageSize: self.pageSize,
                };
                if (this.searchText) {
                    queryParam[this.searchType] = this.searchText;
                }
                let url = "/zingbiz/hotel/hotelNew/getAccoutingTypeConfig";
                this.showLoading = true;
                self.$httpSilent
                    .get(url, {params: queryParam})
                    .then(res => {
                        self.showLoading = false;
                        if (res.data.success) {
                            self.payClassData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({type: "error", message: "请求数据失败，请刷新重试"});
                        }
                    }).catch(error => {
                    self.showLoading = false;
                    self.$message({type: "error", message: "请求数据失败，请刷新重试"});
                });
            },
            currentPage(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.initData();
            },
            selPageSize(val) {
                this.pageSize = val;
                this.initData();
            },
            addPayClass() {
                this.title = "新建";
                this.addPayClassForm = {};
                this.addPayClassModal = true;
            },
            editTheOne(index, row) {
                this.title = "编辑";
                this.addPayClassForm = Object.assign({}, row);
                this.addPayClassModal = true;
            },
            selectSubject() {
                this.showPicker = true;
            },
            onPicked(val) {
                console.log(val);
                this.showPicker = false;
                this.addPayClassForm.subjectCode = val.text;
            },
            onPickAbort() {
                this.showPicker = false;
            },
            submitForm(ref) {
                let self = this;
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotel/hotelNew/saveAccoutingTypeConfig";
                        self.$httpSilent
                            .post(url, this.addPayClassForm)
                            .then(res => {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.addPayClassModal = false;
                                    self.$message({type: "success", message: "保存成功"});
                                    self.initData();
                                } else {
                                    self.$message({type: "error", message: "保存失败，请重试"});
                                }
                            }).catch(error => {
                            self.loadingInstance.close();
                            self.$message({type: "error", message: "保存失败，请重试"});
                        });
                    }
                });
            },
            deleteTheOne(index, row) {
                let self = this;
                this.$confirm("确定删除吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteUrl = "/zingbiz/hotel/hotelNew/delAccoutingTypeConfig";
                    self.loadingInstance = self.$loading({});
                    self.$httpSilent
                        .get(deleteUrl, {params: {rowId: row.rowId}})
                        .then(res => {
                            self.loadingInstance.close();
                            if (res.data.success) {
                                self.$message({type: "success", message: "删除成功!"});
                                self.initData();
                            } else {
                                self.$message({type: "warning", message: "删除失败!"});
                            }
                        }).catch(error => {
                        self.loadingInstance.close();
                        self.$message({type: "warning", message: "删除失败!"});
                    });
                });
            },
            search() {
                this.initData();
            },
            changePageNumber(val) {
                this.pageNumber = val;
                this.initData();
            },
            isDisable(row) {
                if (Number(row.configCode) > 0) {
                    return true;
                }
                return false;
            }
        }
    }
</script>
<style scoped lang="stylus">

</style>
