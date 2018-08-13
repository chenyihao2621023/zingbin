<template>
    <el-container>
        <el-main>
            <div class="button-group">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-button type="primary" @click="addNew" size="small">新建</el-button>
                    </el-col>
                    <el-col :span="8" :offset="14">
                        <el-input placeholder="请输入关键字" v-model="searchVal" class="input-with-select" size="small" clearable>
                            <el-select v-model="select" slot="prepend" :style="{width:'120px'}" placeholder="请选择"
                                       @change="searchChange">
                                <el-option label="序号" value="1"></el-option>
                                <el-option label="打印机IP" value="2"></el-option>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="configList" border style="width: 100%" v-loading="showLoading">
                <el-table-column prop="printerNID" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="printerName" label="打印标题" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="printerIP" label="打印机IP" align="center">
                </el-table-column>
                <el-table-column prop="printerNumbers" label="打印份数" align="center">
                </el-table-column>
                <el-table-column prop="msg" label="打印备注" align="center">
                </el-table-column>
                <el-table-column prop="printOperate" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editPrinter(scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog title="添加打印机" width="30%" center :visible.sync="addPrinterModal">
            <el-form :model="addPrinterForm" label-width="80px" :rules="addPrinterRules" ref="addPrinterForm"
                     >
                <el-form-item label="序号" prop="printerNID">
                    <el-input v-model="addPrinterForm.printerNID" type="number" min="0"></el-input>
                </el-form-item>
                <el-form-item label="打印标题" prop="printerName">
                    <el-input v-model="addPrinterForm.printerName"></el-input>
                </el-form-item>

                <el-form-item label="打印机IP" prop="printerIP">
                    <el-input v-model="addPrinterForm.printerIP"></el-input>
                </el-form-item>

                <el-form-item label="打印备注" prop="note">
                    <el-input v-model="addPrinterForm.msg"></el-input>
                </el-form-item>
                <el-form-item label="打印份数" prop="numberOfCopies">
                    <el-select v-model="addPrinterForm.printerNumbers">
                        <el-option value="1" label="1"></el-option>
                        <el-option value="2" label="2"></el-option>
                        <el-option value="3" label="3"></el-option>
                        <el-option value="4" label="4"></el-option>
                        <el-option value="5" label="5"></el-option>
                        <el-option value="6" label="6"></el-option>
                        <el-option value="7" label="7"></el-option>
                        <el-option value="8" label="8"></el-option>
                        <el-option value="9" label="9"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPrinterModal = false">取 消</el-button>
                <el-button type="primary" @click="submitAddPrinter('addPrinterForm',addOrEditIndex)">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import _ from "lodash";

    export default {
        data() {
            return {
                select: "",
                selectVal: "",
                searchVal: "",
                configList: [],
                addPrinterModal: false,
                pageNumber: 1,
                pageSize: 10,
                total: null,
                showLoading: true,
                addOrEditIndex: null,
                addPrinterForm: {
                    printerType:"20",
                    printerNID: null,
                    printerName: "",
                    printerIP: "",
                    msg: "",
                    printerNumbers: "",
                    rowId: ""
                },
                printTypeItemList: [],
                addPrinterRules: {
                    printerNID: [
                        {required: true, message: "请输入序号", trigger: "blur"}
                    ],
                    printerName: [
                        {required: true, message: "请输入打印标题", trigger: "blur"}
                    ],
                    printerIP: [
                        {required: true, message: "请输入打印机IP", trigger: "blur"}
                    ]
                }
            };
        },
        watch: {
            showLoadingFlag01: function () {
                if (this.showLoadingFlag01 === 2) {
                    this.showLoading = false;
                }
            }
        },
        created: function () {
            this.loadPrinterList(); //init打印机列表
            this.loadAddPrintItemList(); //加载新增打印机选项列表
        },
        methods: {
            //初始化打印配置列表
            loadPrinterList() {
                let param = {
                    pageNumber: 1,
                    pageSize: 999,
                    printerType: "20"
                };
                let url = "/zingbiz/printerManager/search"; //加载打印机配置信息接口，
                this.$httpSilent
                    .post(url, param)
                    .then(res => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.configList = res.data.data.data;
                        } else {
                            this.$message({type: "error", message: "请求数据失败，请重试"});
                        }
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "请求数据失败，请重试"});
                    });
            },
            //初始化打印类型
            loadAddPrintItemList() {
                let url = "/zingbiz/hotel/hotelNew/getHotelConfig";
                this.$httpSilent
                    .get(url, {
                        params: {
                            pageNumber: this.pageNumber,
                            pageSize: this.pageSize,
                            configCode: "100"
                        }
                    })
                    .then(res => {
                        console.log(res);
                        this.showLoading = false;
                        this.printTypeItemList = res.data.data;
                        this.total = Number(res.data.total);
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({type: "error", message: "配置信息获取失败，请重试"});
                    })
            },
            //搜索下拉的选择项
            searchChange(val) {
                this.selectVal = val;
            },
            //搜索
            search() {
                this.showLoading = true;
                if (Number(this.selectVal) === 1) {
                    this.addPrinterForm.printerNID = this.searchVal;
                } else if (Number(this.selectVal) === 2) {
                    this.addPrinterForm.printerIP = this.searchVal;
                }
                let param = {
                    pageNumber: 1,
                    pageSize: 999,
                    printerType:"20",
                    printerNID: this.addPrinterForm.printerNID,
                    printerIP: this.addPrinterForm.printerIP
                };
                let url = "/zingbiz/printerManager/search"; //加载打印机配置信息接口，
                this.$httpSilent
                    .post(url, param)
                    .then(res => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.configList = res.data.data.data;
                            this.addPrinterForm = {
                                printerNID: "",
                                printerIP: ""
                            }
                        } else {
                            this.$message({type: "error", message: "请求数据失败，请重试"});
                        }
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "请求数据失败，请重试"});
                    });
            },
            addNew() {
                this.addPrinterForm = {
                    printerType:"20",
                    printerNID: null,
                    printerName: "",
                    printerIP: "",
                    msg: "",
                    printerNumbers: "",
                    rowId: ""
                };
                this.addPrinterTitle = "新建";
                this.addDataForm = {};
                this.addPrinterModal = true;
                this.addOrEditIndex = 0;
            },
            editPrinter(row) {
                this.addPrinterTitle = "添加打印机";
                this.addDataForm = Object.assign({}, row);
                this.addPrinterModal = true;
                this.addOrEditIndex = 1;
                this.addPrinterForm = {
//                    printerType:"20",
                    printerNID: row.printerNID,
                    printerName: row.printerName,
                    printerType: row.printerType,
                    printerIP: row.printerIP,
                    msg: row.msg,
                    printerNumbers: row.printerNumbers,
                    rowId: row.rowId
                };
            },
            //新增打印机设置
            submitAddPrinter(formName, index) {
                console.log(formName, index);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (index === 0) {
                            let url = "/zingbiz/printerManager/insert"; //接口
                            this.$httpSilent
                                .post(url, this.addPrinterForm)
                                .then(res => {
                                    if (res.data.success) {
                                        this.$message({type: "success", message: "保存成功"});
                                        this.showLoading = true;
                                        this.loadPrinterList();
                                    } else {
                                        this.$message({type: "error", message: "保存失败"});
                                    }
                                })
                                .catch(() => {
                                    this.loadingInstance.close();
                                    this.$message({type: "error", message: "保存失败"});
                                });
                            this.addPrinterModal = false;
                        } else if (index === 1) {
                            let url = "/zingbiz/printerManager/update";
                            this.$httpSilent
                                .post(url, this.addPrinterForm)
                                .then(res => {
                                    if (res.data.success) {
                                        this.$message({type: "success", message: "修改成功！"});
                                        this.showLoading = true;
                                        this.loadPrinterList();
                                    }
                                })
                                .catch(() => {
                                    this.loadingInstance.close();
                                    this.$message({type: "error", message: "修改失败！"});
                                });
                            this.addPrinterModal = false;
                        }
                    }
                });
            },

            //删除打印机配置
            deleteItem(row) {
                let url = "/zingbiz/printerManager/delete"; //打印机配置删除信息接口，
                this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$httpSilent
                            .post(url, row)
                            .then(res => {
                                if (res.data.success) {
                                    this.$message({type: "success", message: "删除成功"});
                                    this.loadPrinterList();
                                } else {
                                    this.$message({type: "error", message: "删除失败"});
                                }
                            })
                            .catch(() => {
                                this.loadingInstance.close();
                                this.$message({type: "error", message: "删除失败"});
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            }
        },
    };
</script>

<style scoped>
    .main-title {
        font-size: 20px;
    }

    .button-group {
        margin: 20px 0;
    }
</style>
