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
                            <el-option label="房税序号" value="serialNo"></el-option>
                            <el-option label="房税描述" value="descript"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search" style="width: 45px"></el-button>
                    </el-input>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" height="100%">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column prop="detailDesc" label="房税明细"></el-table-column>
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
                               :page-size="pageSize"
                               :total="total"></el-pagination>

            </div>
        </el-main>
        <div>
            <el-dialog :title="DiaTitle" :visible.sync="newAdd" width="30%">
                <el-form :model="addData" :rules="rules" ref="addData" label-width="20%" class="demo-ruleForm">
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="addData.serialNo" type="number" min="0"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="descript">
                        <el-input v-model="addData.descript"></el-input>
                    </el-form-item>
                    <el-form-item label="房税明细" prop="detailId">
                        <el-select v-model="addData.detailId" multiple placeholder="请选择房税明细">
                            <el-option v-for="item in options" :key="item.rowId" :label="item.descript"
                                       :value="item.rowId"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="科目代码" prop="subjectCode">
                         <el-button type="default" size="small" @click="togglePicker">选择科目</el-button>
                         <span style="display: inline-block"><el-input disabled v-model="addData.subjectCode" size="small"></el-input></span>
                     </el-form-item>-->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="newAdd = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="sureAdd('addData')" size="small">确 定</el-button>
                </span>
            </el-dialog>

            <subject-picker style="z-index: 2005" :showPicker="showPicker" @picked="onPicked"
                            @abort="showPicker = false"></subject-picker>
        </div>
    </el-container>
</template>
<script>
    import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main";
    import SubjectPicker from '../../../components/subjectpicker/SubjectPicker.vue';
    import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";

    export default {
        components: {
            ElButton, ElContainer, SubjectPicker
        },
        data() {
            return {
                detailId: [],
                searchType: "",
                searchVal: "",
                tableData: [],
                newAdd: false,
                showLoading: true,
                showPicker: false,
                DiaTitle: '新建',
                total: null,
                pageSize: 30,
                pageNumber: 1,
                value: 30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                options: [],
                addData: {},
                rules: {
                    serialNo: [{ required: true, message: '请填写序号!', trigger: 'blur' },],
                    descript: [{ required: true, message: '请填写描述!', trigger: 'blur' },],
                    detailId: [{ required: true, message: '请选择房税明细!', trigger: 'change' },],
                    subjectCode: [{ required:true, message: '请选择科目代码！', trigger: 'change' }]
                },
            }
        },
        watch:{
            newAdd:function(isShow) {
                if (!isShow) {
                    this.$refs.addData.resetFields();
                }
            }
        },
        created() {
            this.initData();
            this.initHouseDetail();
        },
        methods: {
            initData() {
                this.showLoading = true;
                let url = '/zingbiz/hotel/hotelNew/getTaxStructureConfig';
                let queryParam = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                };
                if (this.searchVal) {
                    queryParam[this.searchType] = this.searchVal;
                }
                this.$httpSilent
                    .get(url, { params: queryParam })
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
            search() {
                this.initData();
            },
            initHouseDetail() {
                let url = '/zingbiz/hotel/hotelNew/getTaxStructureDetailConfig';
                let queryParams = {
                    pageNumber: 1,
                    pageSize: 999,
                };
                this.$httpSilent
                    .get(url, { params: queryParams })
                    .then((res) => {
                        if (res.data.success) {
                            this.options = res.data.data;
                        } else {
                            this.$message({type: "error", message: "请求数据失败，请刷新重试"});
                        }
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "请求数据失败，请刷新重试"});
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
                this.DiaTitle = '新建';
                this.addData = {
                    detailId:[]
                };
            },
            modify(row) {
                this.DiaTitle = '修改';
                this.addData = Object.assign({},row);
                if (row.detailId) {
                    this.addData.detailId = row.detailId.split(",");
                }
                this.newAdd = true;
            },
            //新建或修改
            sureAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/zingbiz/hotel/hotelNew/saveTaxStructureConfig';
                        this.loadingInstance = this.$loading({});
                        this.addData.detailId = this.addData.detailId.join(",");
                        delete this.addData['detailDesc'];
                        console.log("addData,",this.addData);
                        this.$httpSilent
                            .post(url, this.addData)
                            .then((res) => {
                                if (res.data.success) {
                                    this.loadingInstance.close();
                                    this.$message({ type: "success", message: "保存成功" });
                                    this.newAdd = false;
                                    this.initData();
                                }
                            })
                            .catch(() => {
                                this.showLoading = false;
                                this.$message({type: "error", message: "新建失败，请刷新重试"});
                                this.newAdd = false;
                            })
                    }
                });
            },
            delCur(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loadingInstance = this.$loading({});
                    let url = '/zingbiz/hotel/hotelNew/delTaxStructureConfig';
                    let queryParams = {
                        rowId: row.rowId
                    };
                    this.$httpSilent
                        .get(url, { params: queryParams })
                        .then((res) => {
                            if (res.data.success) {
                                this.loadingInstance.close();
                                this.$message({ type: 'success', message: '删除成功' });
                                this.tableData = this.tableData.filter(item => item.rowId !== row.rowId)
                            }
                        })
                        .catch(() => {
                            this.showLoading = false;
                            this.$message({ type: "error", message: "删除失败，请刷新重试" });
                        })
                });
            },
            togglePicker() {
                this.showPicker = true;
            },
            onPicked(val) {
                this.showPicker = false;
                this.addData.subjectCode = val.filename;
            },
        }
    }
</script>
<style scoped lang="stylus">

</style>
