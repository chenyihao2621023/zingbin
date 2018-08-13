<template>
    <div class="printer">
        <el-container>
            <el-main>
                <div class="search-area">
                    <el-form label-width="80px" :inline="true" size="small">
                        <el-form-item>
                            <el-button @click="addShow" type="primary">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-area">
                    <el-table :data="printerData" border v-loading="0" style="width: 100%">
                        <el-table-column prop="printerNID" label="编号" width="50"></el-table-column>
                        <el-table-column prop="machineStatus" label="状态" width="130"></el-table-column>
                        <el-table-column prop="goodsClazzNamePrint" label="品项类别" width="180"></el-table-column>
                        <el-table-column prop="printerName" label="打印标题" width="130"></el-table-column>
                        <el-table-column prop="printerIP" label="打印机ip" width="130"></el-table-column>
                        <el-table-column prop="printerNumbers" label="打印份数" width="80"></el-table-column>
                        <el-table-column prop="msg" label="备注"></el-table-column>
                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button @click="editMethod(scope.row)" type="text" size="mini">编辑</el-button>
                                <el-button @click="delMethod(scope.row)" type="text" size="mini">删除</el-button>
                                <el-button @click="testMethod(scope.row)" type="text" size="mini">测试</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="zing-pagination">
                        <el-pagination background :page-size="pageSize" @current-change="pageChange"
                                       layout="prev, pager, next" :total="total"></el-pagination>
                    </div>
                </div>
                <div>
                    <el-dialog title="添加" :visible.sync="dialogPrinter">
                        <el-form :model="addPrinterData" ref="addPrinterData" :rules="editRules"
                                 label-width="120px">
                            <el-form-item label="编号" :label-width="dialogLabelWidth">
                                <el-input v-model="addPrinterData.printerNID"></el-input>
                            </el-form-item>
                            <el-form-item label="打印方式" :label-width="dialogLabelWidth" prop="printerType">
                                <el-select v-model="addPrinterData.printerType" size="100%" @change="typeChenge" placeholder="请选择">
                                    <el-option label="收款单" value="0"></el-option>
                                    <el-option label="品相类别" value="1"></el-option>
                                    <el-option label="厨单" value="2"></el-option>
                                    <el-option label="催单" value="5"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-show="typeShow" label="品项类别" :label-width="dialogLabelWidth">
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox v-for="item in goodsClazzList"
                                                 :key="item.dinnerClazzId"
                                                 :label="item.dinnerClazzId"
                                                 :value="item.dinnerClazzName"
                                    >{{item.dinnerClazzName}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item v-show="typeShow" label="打印切纸" :label-width="dialogLabelWidth">
                                <el-select v-model="addPrinterData.cutpaperOfType" size="100%" placeholder="请选择">
                                    <el-option label="一整单" value="0"></el-option>
                                    <el-option label="一个菜品一张单" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="打印标题" placeholder="主单\客单\xxx公司"
                                          :label-width="dialogLabelWidth">
                                <el-input v-model="addPrinterData.printerName"></el-input>
                            </el-form-item>
                            <el-form-item label="打印机ip" :label-width="dialogLabelWidth" prop="printerIP">
                                <el-input v-model="addPrinterData.printerIP"></el-input>
                            </el-form-item>
                            <el-form-item label="打印份数" :label-width="dialogLabelWidth"
                                          prop="printerNumbers">
                                <el-input v-model="addPrinterData.printerNumbers"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" :label-width="dialogLabelWidth">
                                <el-input type="textarea" :rows="2" v-model="addPrinterData.msg"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogPrinter = false">取 消</el-button>
                            <el-button type="primary" @click="fromPrinter">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "printerManager",
        data: () => ({
            AORU: "",
            dialogPrinter: false,//弹框隐藏显示
            typeShow: true,//品项类别隐藏显示
            dialogLabelWidth: '80px',
            screenHeight: 0,//页面高度
            ckickData: {},//商品分类id列表
            showDialog: false,//三个点方法
            goodsClazzList: [],//商品分类列表
            checkList: [],//分类id列表
            pageNumber: 1,
            pageSize: 8,
            total: 0,
            loading: false,
            editRules: {
                printerType: [{required: true, message: "请选择打印方式", trigger: "blur"}],
                printerIP: [{required: true, message: "请输入打印机IP", trigger: "blur"}],
                printerNumbers: [{required: true, message: "请输入打印份数", trigger: "blur"}]
            },
            addPrinterData: {
                printerNID: "",
                printerType: "1",
                cutpaperOfType: "",
                printerName: "",
                printerIP: "",
                printerNumbers: "1",
                msg: ""
            },
            printerData: [],//打印机列表
        }),
        created() {
            this.screenHeight = document.documentElement.clientHeight - 100;
            this.initClazz()
        },

        methods: {
            initPrinter() {
                let that = this
                let param = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                };
                let urlPrinter = "/zingbiz/printerManager/search"
                this.loading = true;
                this.$http.post(urlPrinter, param).then(res => { //加载商品分类
                    try {
                        if (res.data) {
                            that.loading = false;
                            for (let i = 0; i < res.data.data.data.length; i++) {
                                let cpName = []
                                that.goodsClazzList.forEach(item => {
                                    if (res.data.data.data[i].goodsClazzIdPrint.indexOf(item.dinnerClazzId) >= 0) {
                                        cpName.push(item.dinnerClazzName)
                                    }
                                })
                                res.data.data.data[i].goodsClazzNamePrint = cpName.join(" ")
                            }
                            that.printerData = res.data.data.data
                            console.log("========",that.printerData)
                            that.total = Number(res.data.data.total);
                        }
                    } catch (ex) {
                        that.loading = false;
                        console.log(ex.name,ex.message)
                        that.$vux.toast.show({
                            text: "查询失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            initClazz() {
                let that = this
                let urlClazz = "/zingbiz/dinner/getDinnerClazzList"
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                this.$http.get(urlClazz, { params: param }).then(res => { //加载商品分类
                    try {
                        if (res.data) {
                            that.goodsClazzList = res.data.data.data;
                            that.initPrinter()
                        }
                    } catch (ex) {
                        that.$vux.toast.show({
                            text: "查询失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            //分页
            pageChange(val) {
                this.pageNumber = val;
                this.loading = true;
                this.initPrinter();
            },
            gotoUpdateDelPage(item) { //显示三个点弹框
                this.showDialog = true
                this.ckickData = item
            },
            typeChenge(val) { //品项类别选择
                this.typeShow = val === "0" || val === "5" ? false : true
            },
            editMethod(item) { //修改方法
                this.addPrinterData = item
                if (this.addPrinterData.printerType === "0" || this.addPrinterData.printerType === "5") {
                    this.typeShow = false
                }
                this.checkList = item.goodsClazzIdPrint.split(" ")
                this.AORU = "U"
                this.dialogPrinter = true
            },
            testMethod(item) { //测试连接
                let that = this
                let param = {} ;
                param.tid = "test" ;
                param.printerIP = item.printerIP ;
                let url = "/zingbiz/printerManager/testPrinterButton.action"
                that.$http.post(url,param).then(res => { //加载一个仓库数据
                    try {
                        if (res.data.data.state !== "error") {
                            that.$vux.toast.show({
                                text: "测试页已发送",
                                type: "success",
                                onHide() {
                                }
                            })
                        } else {
                            that.$vux.toast.show({
                                text: "测试页发送超时",
                                type: "cancel",
                                onHide() {
                                }
                            })
                        }
                    } catch (ex) {
                        that.$vux.toast.show({
                            text: "测试页发送失败 failed " + ex.name + ": " + ex.message,
                            type: "cancel",
                            onHide() {
                            }
                        })
                    }
                });
            },
            delMethod(item) { //刪除方法
                let that = this
                this.$confirm("此操作将永久删除该打印机数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.loading = true;
                    this.$http
                        .post("/zingbiz/printerManager/delete", {rowId: item.rowId})
                        .then(res => {
                            that.loading = false;
                            if (res.data.success) {
                                that.$message({type: "success", message: "删除成功"});
                                that.initPrinter()
                            } else {
                                that.$message({type: "error", message: "删除失败，请重试"});
                            }
                        }).catch(error => {
                        that.loading = false;
                        that.$message({type: "error", message: "删除失败，请重试"});
                    });
                }).catch(() => {});
            },
            addShow() {
                this.dialogPrinter = true
                this.typeShow = true
                this.checkList = []
                this.addPrinterData = {
                    printerNID: "",
                    printerType: "1",
                    cutpaperOfType: "",
                    printerName: "",
                    printerIP: "",
                    printerNumbers: "1",
                    msg: ""
                }
            },
            fromPrinter() { //添加方法
                let that = this
                this.$refs["addPrinterData"].validate(valid => {
                    if (valid) {
                        if (that.addPrinterData.printerType !== "0" && that.addPrinterData.printerType !== "5") {
                            if (that.checkList.length === 0) {
                                that.$vux.toast.text("请选择品项类别!", 'bottom')
                                return false
                            }
                            if (!that.addPrinterData.cutpaperOfType) {
                                that.$vux.toast.text("请填写打印切纸", 'bottom')
                                return false
                            }
                            that.addPrinterData.goodsClazzIdPrint = that.checkList.join(" ")
                            let goodsClazzNamePrint = []
                            for (let i = 0; i < this.goodsClazzList.length; i++) {
                                if (that.addPrinterData.goodsClazzIdPrint.indexOf(that.goodsClazzList[i].dinnerClazzId) >= 0) {
                                    goodsClazzNamePrint.push(that.goodsClazzList[i].dinnerClazzName)
                                }
                            }
                            that.addPrinterData.goodsClazzNamePrint = goodsClazzNamePrint.join(" ")
                        } else {
                            that.addPrinterData.goodsClazzIdPrint = that.addPrinterData.printerType === "5" ? "CD123456" : ""
                            that.addPrinterData.goodsClazzNamePrint = ""
                            that.addPrinterData.cutpaperOfType = ""
                        }
                        let url = this.AORU === "U" ? "/zingbiz/printerManager/update"
                            : "/zingbiz/printerManager/insert"
                        let message = that.AORU === "U" ? "修改" : "添加"
                        that.loading = true;
                        that.$http.post(url, that.addPrinterData).then(res => { //加载一个仓库数据
                            try {
                                if (res.data.success) {
                                    that.loading = false;
                                    this.initPrinter()
                                    that.$vux.toast.show({
                                        text: message + '成功',
                                        type: "success",
                                        onHide() {
                                        }
                                    })
                                    that.dialogPrinter = false
                                } else {
                                    that.loading = false;
                                    that.$vux.toast.show({
                                        text: message + "失败，请重试",
                                        type: "cancel",
                                        onHide() {
                                        }
                                    })
                                }
                            } catch (ex) {
                                that.loading = false;
                                that.$vux.toast.show({
                                    text: message + "失败 failed " + ex.name + ": " + ex.message,
                                    type: "cancel",
                                    onHide() {
                                    }
                                })
                            }
                        });
                    }
                })
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
</style>

