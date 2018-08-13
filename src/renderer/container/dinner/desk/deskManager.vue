<template>
    <div class="resource">
        <el-container>
            <el-main>
                <div class="search-area">
                    <el-form label-width="80px" :model="searchForm" :inline="true" size="small">
                        <el-form-item>
                            <el-button @click="openAddDesk" type="primary">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-area">
                    <el-table :data="deskData" style="width: 100%" border v-loading="0">
                        <el-table-column prop="deskNum" label="台号"></el-table-column>
                        <el-table-column prop="deskName" label="台位名称"></el-table-column>
                        <el-table-column prop="deskType" label="台位类型"></el-table-column>
                        <el-table-column prop="deskArea" label="所属区域"></el-table-column>
                        <el-table-column prop="seatNumber" label="座位数"></el-table-column>
                        <el-table-column prop="deskStatus" label="是否启用" :formatter="formatStatus"></el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button @click="openEditDesk(scope.row)" type="text" size="mini">编辑</el-button>
                                <el-button @click="delDesk(scope.row)" type="text" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="zing-pagination">
                        <el-pagination background :page-size="pageSize" @current-change="pageChange" layout="prev, pager, next" :total="total"></el-pagination>
                    </div>
                </div>
                <el-dialog :title="dialogTitle" :visible.sync="DeskDialogShow" width="50%">
                    <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="120px">
                        <el-form-item label="台号" prop="deskNum">
                            <el-input v-model="editForm.deskNum" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="台名称">
                            <el-input v-model="editForm.deskName" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="台位类型" prop="deskType">
                            <el-input v-model="editForm.deskType" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="所属区域" prop="deskArea">
                            <el-input v-model="editForm.deskArea" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="座位数" prop="seatNumber">
                            <el-input v-model="editForm.seatNumber" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="deskStatus">
                            <el-select v-model="editForm.deskStatus" size="100%">
                                <el-option v-for="(obj,index) in enableTypes" :key="index" :label="obj.label" :value="obj.deskStatus"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示顺序" prop="showOrder">
                            <el-input v-model="editForm.showOrder" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="DeskDialogShow = false;autofocus=true">取 消</el-button>
                        <el-button type="primary" @click="editDesk">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "deskManger",
        components: {
            ZingHead
        },
        data() {
            return {
                deskData: [],
                searchForm: {
                    name: ""
                },
                editForm: {
                    isServiceFee: "启用"
                },
                pageNumber:1,
                pageSize: 8,
                total: 0,
                editRules: {
                    deskNum: [{ required: true, message: "请输入台号", trigger: "blur" }],
                    deskType: [{ required: true, message: "请输入台位类型", trigger: "blur" }],
                    deskArea: [{ required: true, message: "请输入所属区域", trigger: "blur" }],
                    seatNumber: [{ required: true, message: "请输入座位数", trigger: "blur" }],
                    deskStatus: [{ required: true, message: "请选择是否启用", trigger: "blur" }]
                },
                loading: false,
                DeskDialogShow: false,
                enableTypes: [{ label: "启用", deskStatus: "1" }, { label: "禁用", deskStatus: "0" }],
                dialogTitle: "修改桌位",
                deskNumStr:"",
            };
        },
        created() {
            this.loadList();
        },
        methods: {
            loadList(isLoding) {
                let that = this;
                let param = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                };
                if (isLoding === "false") {
                    this.loading = false;
                } else {
                    this.loading = true;
                }
                let deskListUrl = "/zingbiz/dinner/getDeskList";
                this.$http
                    .get(deskListUrl, { params :param })
                    .then(res => {
                        that.loading = false;
                        if (res.data.success) {
                            that.deskData = res.data.data.data;
                            that.total = Number(res.data.data.total);
                            let deskNumList = []
                            that.deskData.forEach(item => {
                                deskNumList.push(item.deskNum + "#")
                            })
                            if (isLoding === "page") {
                                this.deskNumStr = this.deskNumStr + deskNumList.join("")
                            } else {
                                this.deskNumStr = deskNumList.join("")
                            }
                        } else {
                            that.$message({ type: "error", message: "加载失败，请重试" });
                        }
                    }).catch(error => {
                        that.loading = false;
                        that.$message({ type: "error", message: "加载失败，请重试" });
                });
            },
            // 打开添加桌位
            openAddDesk() {
                this.editForm = {};
                this.dialogTitle = "添加桌位";
                this.DeskDialogShow = true;
            },
            // 打开编辑桌位
            openEditDesk(row) {
                if (row.isOnUse === "true") {
                    this.$vux.toast.text("该桌位正在使用，请稍后重试", 'bottom')
                    return false
                }
                this.dialogTitle = "编辑桌位";
                this.editForm = row;
                this.DeskDialogShow = true;
            },
            //分页
            pageChange(val) {
                this.pageNumber = val;
                this.loading = true;
                this.loadList("page");
            },
            editDesk() {
                let that = this;
                this.$refs["editForm"].validate(valid => {
                    if (valid) {
                        let mas = "添加"
                        let url = "/zingbiz/dinner/addDesk";
                        if (that.editForm.deskId) {
                            mas = "修改"
                            url = "/zingbiz/dinner/updateDesk"
                        }
                        if (!that.editForm.deskId && that.deskNumStr.indexOf((that.editForm.deskNum+"#")) >= 0) {
                            this.$vux.toast.text("桌号已经存在", 'bottom')
                            return false
                        }
                        let params = {
                            deskArea:that.editForm.deskArea,
                            deskId:that.editForm.deskId ? that.editForm.deskId : "",
                            deskName:that.editForm.deskName,
                            deskNum:that.editForm.deskNum,
                            deskStatus:that.editForm.deskStatus,
                            deskType:that.editForm.deskType,
                            dinnerOrderId:that.editForm.dinnerOrderId ? that.editForm.dinnerOrderId : "",
                            genTime:that.editForm.genTime ? that.editForm.genTime : "",
                            isOnUse:that.editForm.isOnUse ? that.editForm.isOnUse : "false",
                            seatNumber:that.editForm.seatNumber,
                            showOrder:that.editForm.showOrder
                        }
                        that.DeskDialogShow = false;
                        that.loading = true;
                        that.$http
                            .post(url, params)
                            .then(res => {
                                that.loading = false;
                                if (res.data.success) {
                                    that.$message({ type: "success", message: mas + "成功" });
                                    that.loadList("false");
                                } else {
                                    that.$message({ type: "error", message: mas + "失败" });
                                }
                            })
                            .catch(error => {
                                that.loading = false;
                                that.$message({ type: "error", message: mas + "失败" });
                            });
                    }
                });
            },
            //删除桌位
            delDesk(row) {
                if (row.isOnUse === "true") {
                    this.$vux.toast.text("该桌位正在使用，请稍后重试", 'bottom')
                    return false
                }
                let that = this;
                this.$confirm("是否要删除该桌位?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                        let param = {
                            params: { deskId: row.deskId }
                        };
                        this.loading = true;
                        this.$http
                            .get("/zingbiz/dinner/delDesk", param)
                            .then(res => {
                                that.loading = false;
                                if (res.data.success) {
                                    that.$message({ type: "success", message: "删除成功" });
                                    that.loadList();
                                } else {
                                    that.$message({ type: "error", message: "删除失败，请重试" });
                                }
                            }).catch(error => {
                                that.loading = false;
                                that.$message({ type: "error", message: "删除失败，请重试" });
                            });
                    })
                    .catch(() => {});
            },
            formatStatus(row, column, cellValue) {
                if (cellValue === "1") {
                    return "是";
                } else if (cellValue === "0") {
                    return "否";
                }
            }
        }
    };
</script>

<style>
    .search-area {
        margin: 30px;
    }

    .table-area {
        margin-left: 30px;
        margin-right: 30px;
    }

    .zing-pagination {
        margin-top: 10px;
        float: right;
    }
    .el-loading-mask {  //修改加载遮罩样式不可删除
        position: fixed;
        z-index: 2000;
        background-color: hsla(0,0%,100%,.9);
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-transition: opacity .3s;
         transition: opacity .3s;
    }
</style>

