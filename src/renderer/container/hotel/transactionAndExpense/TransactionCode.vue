<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button size="small" type="primary" @click="addNew">新建</el-button>
                </span>
                <span>
                    <el-form label-width="80px" :inline="true" label-position="right" size="small">
                        <el-form-item>
                            <el-input placeholder="请输入内容" clearable v-model="searchText">
                                <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width: 80px">
                                    <el-option label="描述" value="descript"></el-option>
                                    <el-option label="序号" value="serialNo"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item size="small">
                            <el-button size="small" type="primary" @click="search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column prop="accountingType" label="入账类型" :formatter="formatAccountType"></el-table-column>
                    <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                    <el-table-column prop="subjectCodeInv" label="科目代码（开发票）"></el-table-column>
                    <el-table-column prop="subjectCode" label="科目代码（不开发票）"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button @click="editTheOne(scope.row)" type="text" size="small">修改</el-button>
                            <el-button @click="deleteTheOne(scope.row)" type="text" size="small" :disabled="isDisable(scope.row)">删除
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
            <el-dialog :title="title" :visible.sync="addModal" width="30%">
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="35%">
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="addForm.serialNo" min="0" type="number" :style="{width:'80%'}"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :disabled="isDisableEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="descript">
                        <el-input v-model="addForm.descript" :style="{width:'80%'}" :disabled="isDisableEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="入账类型" prop="accountingType">
                        <el-radio-group v-model="addForm.accountingType" @change="changeType" :disabled="isDisableEdit">
                            <el-radio label="0">消费</el-radio>
                            <el-radio label="1">付款</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="交易类型" prop="tradeType">
                        <el-select v-model="tradeType" clearable @change="selectTradeType" :disabled="isDisableEdit">
                            <el-option v-for="item in tradeTypeList" :key="item.rowId"
                                       :label="item.descript" :value="item.rowId" :ref="item.rowId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="科目代码（开发票）" prop="subjectCodeInv">
                        <el-button @click="selectSubject(1)" size="small">选择科目</el-button>
                        <span style="display: inline-block">
                            <el-input disabled v-model="addForm.subjectCodeInv"></el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label="科目代码（不开发票）" prop="subjectCode">
                        <el-button @click="selectSubject(2)" size="small">选择科目</el-button>
                        <span style="display: inline-block">
                            <el-input disabled v-model="addForm.subjectCode"></el-input>
                        </span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('addForm')" size="small">提交</el-button>
                    <el-button @click="addModal = false" size="small">取 消</el-button>
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
        name: "TransactionCode",
        components: {
            SubjectPicker
        },
        data() {
            return {
                isDisableEdit:false,
                searchType: "descript",
                searchText: "",
                pageSize: 30,
                value:30,
                pageNumber: 1,
                total: 10,
                showLoading: false,
                showPicker: false,
                tableData: [],
                payTypeData: [],
                consumeTypeData: [],
                title: "",
                tradeType: "",
                addForm: {},
                addModal:false,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                rules:{
                    serialNo:[{ required: true, message: '请输入序号', trigger: 'blur' }],
                    accountingType:[{ required: true, message: '请选择入账类型', trigger: 'blur' }],
                    tradeType:[{ required: true, message: '请选择交易类型', trigger: 'blur' }],
                    subjectCodeInv:[{ required: true, message: '请选择科目代码', trigger: 'blur' }],
                    subjectCode:[{ required: true, message: '请选择科目代码', trigger: 'blur' }],
                    descript:[{ required: true, message: '请输入描述信息', trigger: 'blur' }],
                },
                queryMap: {
                    pageNumber: 1,
                    pageSize: 1000,
                },
                loadingInstance: null, //loading实例
                subjectFlag:NaN,
            }
        },
        computed: {
            tradeTypeList: function () {
                if (this.addForm.accountingType) {
                    if (this.addForm.accountingType === "0") {
                        return this.consumeTypeData;
                    } else if (this.addForm.accountingType === "1") {
                        return this.payTypeData;
                    }
                }
            },
        },
        watch: {
            addModal: function (flag) {
                if (!flag) {
                    this.$refs.addForm.resetFields();
                    this.tradeType = "";
                }
            }
        },
        created() {
            this.initData();
            this.initConsumeType();
            this.initPayTypeData();
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
                let url = "/zingbiz/hotel/hotelNew/getTradeCodeConfig";
                this.showLoading = true;
                self.$httpSilent
                    .get(url, { params: queryParam })
                    .then(res => {
                        self.showLoading = false;
                        if (res.data.success) {
                            self.tableData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                        }
                    }).catch(error => {
                    self.showLoading = false;
                    self.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                });
            },
            //初始化消费分类
            initConsumeType() {
                let self = this;
                let url = '/zingbiz/hotel/hotelNew/getTradeTypeConfig';
                this.$httpSilent
                    .get(url, { params: this.queryMap })
                    .then((res) => {
                        if (res.data.success) {
                            self.consumeTypeData = res.data.data;
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                        }
                    })
            },
            //初始化付款分类
            initPayTypeData() {
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getAccoutingTypeConfig";
                self.$httpSilent
                    .get(url, { params: this.queryMap })
                    .then(res => {
                        if (res.data.success) {
                            self.payTypeData = res.data.data;
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                        }
                    })
            },
            addNew() {
                this.title = "新建";
                this.isDisableEdit = false;
                this.addModal = true;
                this.addForm = {};
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
            changeType() {
                this.tradeType = "";
            },
            selectTradeType(val) {
                this.addForm.tradeType = val;
            },
            editTheOne(row) {
                this.title = "编辑";
                this.tradeType = row.tradeType;
                this.addForm = Object.assign({}, row);
                this.addModal = true;
                if (Number(row.configCode) > 0) {
                    this.isDisableEdit = true;
                } else {
                    this.isDisableEdit = false;
                }
            },
            selectSubject(flagIndex) {
                this.showPicker = true;
                this.subjectFlag = flagIndex;
            },
            onPicked(val) {
                this.showPicker = false;
                if (Number(this.subjectFlag) === 1) {
                    this.addForm.subjectCodeInv = val.text;
                } else if (Number(this.subjectFlag) === 2) {
                    this.addForm.subjectCode = val.text;
                }
            },
            onPickAbort() {
                this.showPicker = false;
            },
            submitForm(ref) {
                let self = this;
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        self.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotel/hotelNew/saveTradeCodeConfig";
                        self.$httpSilent
                            .post(url, this.addForm)
                            .then(res => {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.addModal = false;
                                    self.$message({ type: "success", message: "保存成功" });
                                    self.initData();
                                } else {
                                    self.$message({ type: "error", message: "保存失败，请重试" });
                                }
                            })
                            .catch(() => {
                                self.loadingInstance.close();
                                self.$message({ type: "error", message: "保存失败，请重试" });
                            });
                    }
                });
            },
            deleteTheOne(row) {
                let self = this;
                this.$confirm("确定删除吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteUrl = "/zingbiz/hotel/hotelNew/delTradeCodeConfig";
                    self.loadingInstance = self.$loading({});
                    self.$httpSilent
                        .get(deleteUrl, { params: { rowId: row.rowId }})
                        .then(res => {
                            self.loadingInstance.close();
                            if (res.data.success) {
                                self.$message({ type: "success", message: "删除成功!" });
                                self.initData();
                            } else {
                                self.$message({ type: "warning", message: "删除失败!" });
                            }
                        }).catch(() => {
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
            formatAccountType(row, val, key) {
                if (row.accountingType === "0") {
                    return "消费";
                } else {
                    return "付款";
                }
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
