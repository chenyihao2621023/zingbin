<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span><el-button type="primary" size="small" @click="addNew">新建</el-button></span>
                <span>
                    <el-form label-width="80px" :inline="true" label-position="right" size="small">
                        <el-form-item>
                            <el-input placeholder="请输入内容" clearable v-model="searchText">
                                <el-select v-model="searchType" size="small" slot="prepend" placeholder="请选择" style="width: 80px">
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
            <div style="height: 100%;">
                <el-table :data="tableData" border style="width: 100%" Height="200px" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column prop="memberCardCount" label="会员卡累计" :formatter="formatMCC"></el-table-column>
                    <!--<el-table-column prop="subjectCode" label="科目代码"></el-table-column>-->
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editOne(scope.index,scope.row)">修改</el-button>
                            <el-button type="text" size="small" :disabled="isDisable(scope.row)" @click="deleteOne(scope.index,scope.row)">删除</el-button>
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
        <el-dialog :title="editTitle" :visible.sync="editModel" center>
            <el-form :model="addDataForm" :rules="rules" ref="addDataForm" label-width="110px"
                     class="demo-ruleForm">
                <el-form-item label="序号" prop="serialNo">
                    <el-input v-model="addDataForm.serialNo" min="0" type="number"
                              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-input v-model="addDataForm.descript"></el-input>
                </el-form-item>
                <el-form-item label="会员卡累计" prop="memberCardCount">
                    <el-radio-group v-model="addDataForm.memberCardCount">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="科目代码" prop="subjectCode">
                    <el-button @click="selectSubject" size="small">选择科目</el-button>
                    <span style="display: inline-block">
                        <el-input disabled v-model="addDataForm.subjectCode"></el-input>
                    </span>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editModel = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submitAdd('addDataForm')" size="small">确 定</el-button>
                </span>
        </el-dialog>
        <subject-picker :showPicker="showPicker" @picked="onPicked"
                        @abort="onPickAbort"></subject-picker>
    </el-container>
</template>
<script>
    import SubjectPicker from "../../../components/subjectpicker/SubjectPicker.vue";

    export default {
        name: "ConsumeType",
        components: {
            SubjectPicker
        },
        data() {
            return {
                searchType: "descript",
                searchText: '',
                tableData: [],
                pageSize: 30,
                value:30,
                pageNumber: 1,
                total: 10,
                editModel: false,
                showLoading: true,
                showPicker: false,
                editTitle: '',
                addDataForm: {},
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                rules: {
                    serialNo: [{required: true, message: '请填写序号!', trigger: 'blur'},],
                    descript: [{required: true, message: '请填写描述!', trigger: 'blur'},],
//                    subjectCode: [{required: true, message: '请填写科目代码!', trigger: 'blur'},],
                    memberCardCount: [{required: true, message: '请填写会员卡累计', trigger: 'blur'},]
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
                let self = this;
                let queryParam = {
                    pageNumber: self.pageNumber,
                    pageSize: self.pageSize,
                };
                if (this.searchText) {
                    queryParam[this.searchType] = this.searchText;
                }
                let url = '/zingbiz/hotel/hotelNew/getTradeTypeConfig';
                this.showLoading = true;
                this.$httpSilent
                    .get(url, {params: queryParam})
                    .then((res) => {
                        self.showLoading = false;
                        if (res.data.success) {
                            self.tableData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({type: "error", message: "请求数据失败，请刷新重试"});
                        }
                    })
                    .catch(() => {
                        self.showLoading = false;
                        self.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
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
            selectSubject() {
                this.showPicker = true;
            },
            onPicked(val) {
                this.showPicker = false;
                this.addDataForm.subjectCode = val.text;
            },
            onPickAbort() {
                this.showPicker = false;
            },
            deleteOne(index, row) {
                let self = this;
                this.$confirm("确定删除此消费分类吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteUrl = "/zingbiz/hotel/hotelNew/delTradeTypeConfig";
                    self.loadingInstance = self.$loading({});
                    self.$httpSilent
                        .get(deleteUrl, { params: { rowId: row.rowId }})
                        .then(res => {
                            self.loadingInstance.close();
                            if (res.data.success) {
                                self.$message({ type: "success", message: "删除成功!" });
                                this.tableData = this.tableData.filter(item => {
                                    return item.rowId !== row.rowId;
                                });
                            } else {
                                self.$message({ type: "warning", message: "删除失败!" });
                            }
                        }).catch(() => {
                        self.loadingInstance.close();
                        self.$message({type: "warning", message: "删除失败!"});
                    });
                });
            },
            submitAdd(ref) {
                let self = this;
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotel/hotelNew/saveTradeTypeConfig";
                        self.$httpSilent
                            .post(url, this.addDataForm)
                            .then(res => {
                                this.loadingInstance.close();
                                self.editModel = false;
                                if (res.data.success) {
                                    self.$message({ type: "success", message: "保存成功" });
                                    self.initData();
                                } else {
                                    self.$message({ type: "error", message: "保存失败，请重试" });
                                }
                            }).catch(error => {
                            self.loadingInstance.close();
                            self.$message({ type: "error", message: "保存失败，请重试" });
                        });
                    }
                });
            },
            search() {
                this.initData();
            },
            changePageNumber(val) {
                this.pageNumber = val;
                this.initData();
            },
            formatMCC(row, column, cellValue) {
                if (row.memberCardCount === "1") {
                    return "是";
                }
                return "否";
            },
            isDisable(row) {
                if (Number(row.configCode) > 0){
                    return true;
                }
                return false;
            }
        }
    }
</script>
<style scoped lang="stylus">
</style>
