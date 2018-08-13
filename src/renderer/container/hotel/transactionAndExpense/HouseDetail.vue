<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addBtn" size="small">新建</el-button>
                </span>
                <span>
                    <el-input placeholder="请输入关键字" v-model="searchVal" clearable style="width: 345px" size="small">
                        <el-select v-model="searchType" slot="prepend" style="width: 100px" placeholder="请选择">
                            <el-option label="房税序号" value="serialNo"></el-option>
                            <el-option label="房税描述" value="descript"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search" style="width: 45px"></el-button>
                    </el-input>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="tableData" border style="width: 100%" height="100%" v-loading="showLoading" :cell-style="tableCellStyle">
                    <el-table-column prop="serialNo" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="descript" label="描述"></el-table-column>
                    <el-table-column prop="taxType" label="当前类型" :formatter="formatType"></el-table-column>
                    <el-table-column prop="amount" label="金额"></el-table-column>
                    <el-table-column prop="percents" label="百分比"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="modify(scope.row)">修改
                            </el-button>
                            <el-button type="text" size="small" @click="delCur(scope.row)"
                                       :disabled="(scope.row.isDefaultConfig)==='1'">删除
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
                               :total="total"></el-pagination>
            </div>
        </el-main>
        <div>
            <el-dialog :title="DiaTitle" :visible.sync="newAddModal" width="30%">
                <el-form :model="addData" :rules="rules" ref="addData" label-width="20%" class="demo-ruleForm">
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="addData.serialNo" type="number" min="0" :disabled="addData.isDefaultConfig==='1'"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="descript">
                        <el-input v-model="addData.descript" :disabled="addData.isDefaultConfig==='1'"></el-input>
                    </el-form-item>
                    <el-form-item label="费用类型" prop="taxType">
                        <el-radio-group v-model="addData.taxType" @change="changeType">
                            <el-radio label="1">金额</el-radio>
                            <el-radio label="2">百分比</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="金额">
                        <el-input v-model="addData.amount" type="number" :disabled="addData.taxType ==='2'" min="0"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="百分比">
                        <el-input v-model="addData.percents" type="number" :disabled="addData.taxType ==='1'" min="0"
                                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="newAddModal = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="sureAdd('addData')" size="small">确 定</el-button>
                </span>
            </el-dialog>
            <subject-picker :showPicker="showPicker" @picked="onPicked"
                            @abort="showPicker = false"></subject-picker>
        </div>
    </el-container>
</template>
<script>
    import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main";
    import SubjectPicker from "../../../components/subjectpicker/SubjectPicker.vue";

    export default {
        components: {
            ElContainer,
            SubjectPicker,
        },
        data() {
            return {
                moneyLog: false,
                percentageLog: false,
                searchType: "",
                searchVal: "",
                tableData: [],
                newAddModal: false,
                showLoading: true,
                DiaTitle: '新建',
                showPicker: false,
                total: null,
                pageNumber: 1,
                pageSize: 30,
                value: 30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                addData: {
                    taxType:"1"
                },
                rules: {
                    serialNo: [{ required: true, message: '请填写序号', trigger: 'blur' },],
                    descript: [{ required: true, message: '请填写描述', trigger: 'blur' },],
                    taxType: [{ required: true, message: '请选择类型', trigger: 'blur' },],
                }
            }
        },
        watch:{
            newAddModal:function(isShow) {
                if (!isShow) {
                    this.$refs.addData.resetFields();
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.showLoading = false;
                let url = '/zingbiz/hotel/hotelNew/getTaxStructureDetailConfig';
                let queryParam = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
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
                        this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                    })
            },
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
                this.initData();
            },
            addBtn() {
                this.newAddModal = true;
                this.DiaTitle = '新建';
                this.addData = {
                    taxType:"1"
                };
            },
            modify(row) {
                console.log("row",row);
                if (!row.taxType) {
                    row.taxType = "1"
                }
                this.addData = Object.assign({},row);
                this.newAddModal = true;
                this.DiaTitle = '修改';
            },
            sureAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/zingbiz/hotel/hotelNew/saveTaxStructureDetailConfig';
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url, this.addData)
                            .then((res) => {
                                if (res.data.success) {
                                    this.loadingInstance.close();
                                    this.newAddModal = false;
                                    this.$message({ type: "success", message: "保存成功" });
                                    this.initData();
                                }
                            })
                            .catch(() => {
                                this.$message({ type: "error", message: "新建失败，请刷新重试" });
                            })
                    }
                });
            },
            //删除数据
            delCur(row) {
                this.$confirm('是否删除该房税明细?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = '/zingbiz/hotel/hotelNew/delTaxStructureConfigDetail';
                    this.loadingInstance = this.$loading({});
                    let queryParams = {
                        rowId:row.rowId,
                    };
                    this.$httpSilent
                        .get(url, { params: queryParams })
                        .then((res) => {
                            if (res.data.success) {
                                this.loadingInstance.close();
                                this.$message({ type: 'success', message: '删除成功' });
                                this.initData();
                            }
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
            changeType(val) {
                if (val === "1") {
                    this.addData.percents = "";
                } else {
                    this.addData.amount = "";
                }
            },
            formatType(row,coll,key){
                if (row.taxType === "1") {
                    return "金额";
                } else if (row.taxType === "2") {
                    return "百分比"
                }

            },
            tableCellStyle({row, column, rowIndex, columnIndex}){
                if ((row.taxType === "1"&&columnIndex===4)||(row.taxType === "2"&&columnIndex===3)) {
                    return {background:'#c3c3c3'};
                }
            }
        }
    }
</script>
<style scoped lang="stylus">

</style>
