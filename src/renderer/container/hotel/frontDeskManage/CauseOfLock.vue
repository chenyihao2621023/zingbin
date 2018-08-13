<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addBtn" size="small">新建</el-button>
                </span>
                <span>
                    <el-input placeholder="请输入关键字" v-model="searchVal" clearable size="small" style="width: 345px">
                        <el-select v-model="searchType" slot="prepend" style="width: 100px" placeholder="请选择">
                            <el-option label="锁定序号" value="serialNo"></el-option>
                            <el-option label="锁定描述" value="configValue"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search" style="width: 45px"></el-button>
                    </el-input>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" v-loading="showLoading" border style="width: 100%" @row-click="RowClick" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="configValue" label="描述"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="modify">修改</el-button>
                            <el-button type="text" size="small" @click="delCur">删除</el-button>
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
        <el-dialog :title="DiaTitle" :visible.sync="newAdd" width="30%" @close="closeDia('addData')">
            <el-form :model="addData" :rules="rules" ref="addData" label-width="20%" class="demo-ruleForm">
                <el-form-item label="序号" prop="serialNo">
                    <el-input v-model="addData.serialNo" type="number" min="0"
                              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                </el-form-item>
                <el-form-item label="锁定原因" prop="configValue">
                    <el-input v-model="addData.configValue"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sureAdd('addData')" size="small">确 定</el-button>
                    <el-button @click="newAdd = false" size="small">取 消</el-button>
                </span>
        </el-dialog>
    </el-container>
</template>
<script>
    import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main";

    export default {
        components: {ElContainer},
        data() {
            return {
                tableData: [],
                pageNumber: 1,
                pageSize: 30,
                total: null,
                newAdd: false,
                showLoading: true,
                DiaTitle: '添加锁定原因',
                searchType: "",
                searchVal: "",
                value: 30,
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
                addData: {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                },
                rules: {
                    serialNo: [
                        {required: true, message: '请填写序号!', trigger: 'blur'},
                    ],
                    configValue: [
                        {required: true, message: '请填写锁定原因!', trigger: 'blur'},
                    ]
                },
            }
        },
        created() {
            this.initData()
        },
        methods: {
            //初始化当前锁定原因列表
            initData() {
                let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
                let query = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    configCode: "105"
                };
                if (this.searchVal) {
                    query[this.searchType] = this.searchVal;
                }
                this.$httpSilent
                    .get(url, { params: query })
                    .then((res) => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.tableData = res.data.data;
                            this.total = Number(res.data.total);
                        }
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
            },
            //搜索
            search() {
                this.initData();
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
                this.DiaTitle = '添加锁定原因';
                this.addData = {
                    serialNo: '',
                    configValue: '',
                    rowId: '',
                    configCode: '',
                };
            },
            closeDia(formName) {
                this.$refs[formName].resetFields();
                this.newAdd = false;
            },
            //获取当前点击行的具体信息
            RowClick(row, event, column) {
                this.addData.serialNo = row.serialNo;
                this.addData.configValue = row.configValue;
                this.addData.rowId = row.rowId;
                this.addData.serialNo = row.serialNo;
            },

            //新增或者修改锁定原因
            sureAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (Number(this.addData.serialNo) < 0) {
                            this.$message({type: "warning", message: "请输入正数序号！"});
                            return;
                        }
                        let url = '/zingbiz/hotel/hotelNew/saveHotelConfig';
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url, {
                                "configCode": "105",
                                "configValue": this.addData.configValue,
                                "rowId": this.addData.rowId,
                                "serialNo": this.addData.serialNo
                            })
                            .then(() => {
                                this.loadingInstance.close();
                                this.newAdd = false;
                                this.$message({type: "success", message: "保存成功"});
                                this.showLoading = true;
                                this.initData();
                            })
                            .catch(() => {
                                this.showLoading = false;
                                this.$message({type: "error", message: "请求数据失败，请刷新重试"});
                                this.newAdd = false;
                            })
                    }
                });
            },

            modify() {
                this.newAdd = true;
                this.DiaTitle = '修改锁定原因';
            },

            //删除列表中锁定房
            delCur() {
                this.$confirm('是否删除该锁定原因?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = '/zingbiz/hotel/hotelNew/delOtherConfig';
                    this.loadingInstance = this.$loading({});
                    let queryParams = {
                        rowId: this.addData.rowId,
                    };
                    this.$httpSilent
                        .get(url, {params: queryParams})
                        .then((res) => {
                            if (res.data.success) {
                                this.loadingInstance.close();
                                this.tableData = this.tableData.filter((item, index) => {
                                    return item.rowId !== this.addData.rowId;
                                });
                                this.$message({type: 'success', message: '删除成功!'});
//                                this.showLoading = true;
//                                this.initData();
                            }
                        })
                        .catch(() => {
                            this.showLoading = false;
                            this.$message({type: "error", message: "删除失败，请刷新重试"});
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        }
    }
</script>
<style scoped lang="stylus">
</style>
