<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="newAdd" size="small">新建</el-button>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="configValue" label="换房原因"></el-table-column>
                    <el-table-column prop="operate" label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="edit(scope.row)" type="text">修改</el-button>
                            <el-button size="mini" @click="deleteData(scope.row)" type="text">删除</el-button>
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

            <el-dialog :title="title" width="30%" :visible.sync="changeModal" @close="closeDia('form')">
                <el-form :model="formData" label-width="120px" :rules="changeRules" ref="form">
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="formData.serialNo" placeholder="请输入序号" type="number"
                                  min="0" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="换房原因" prop="configValue">
                        <el-input v-model="formData.configValue" placeholder="请输入换房原因"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="changeModal = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submit('form')" size="small">提交</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                value: 30,
                pageNumber: 1,
                pageSize: 30,
                total: null,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                showLoading:true,
                title:"",
                search_text:"",   //搜索关键词
                changeModal:false,
                formData:{},
                tableData:[],
                changeRules: {
                    serialNo: [{ required: true, message: '请输入类型序号', trigger: 'blur' }],
                    configValue: [{ required: true, message: '请输入房间类型描述', trigger: 'blur' }],
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let url = '/zingbiz/hotel/hotelNew/getHotelConfig';
                let query = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    configCode: "123"
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
                        this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
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
            newAdd() {
                this.changeModal = true;
                this.title = "新增换房原因";
                this.formData = {};
            },
            edit(row) {
                this.changeModal = true;
                this.title = "修改换房原因";
                this.formData = Object.assign({}, row);
            },

            closeDia(formName) {
                this.$refs[formName].resetFields();
                this.changeModal = false;
            },

            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/zingbiz/hotel/hotelNew/saveHotelConfig";
                        let params = {
                            configCode:"123",
                            serialNo:this.formData.serialNo,
                            configValue:this.formData.configValue,
                            rowId:this.formData.rowId || ""
                        };
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url,params)
                            .then((res) => {
                                this.loadingInstance.close();
                                if (res.data.success) {
                                    this.changeModal = false;
                                    this.$message({ type: "success", message: "请求成功" });
                                    this.initData();
                                    this.showLoading = true;
                                }
                            })
                            .catch(() => {
                                this.$message({ type: "error", message: "请求失败，请重试！" });
                            })
                    }
                });
            },

            deleteData (row) {
                this.$confirm('是否删除该换房原因?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = '/zingbiz/hotel/hotelNew/delOtherConfig';
                    this.loadingInstance = this.$loading({});
                    let queryParams = {
                        rowId: row.rowId,
                    };
                    this.$httpSilent
                        .get(url, { params: queryParams })
                        .then((res) => {
                            this.loadingInstance.close();
                            if (res.data.success) {
                                this.$message({ type: 'success', message: '删除成功!' });
                                this.tableData = this.tableData.filter((item,index) => {
                                    return item.rowId !== row.rowId
                                })
                            }
                        })
                        .catch(() => {
                            this.showLoading = false;
                            this.$message({ type: "error", message: "删除失败，请刷新重试" });
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>
<style scoped>

</style>
