<template>
    <el-container v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-main style="overflow-x:auto">
            <div>

                <el-row :gutter="20">

                    <el-col :span="24" style="overflow-y: auto;height: 800px;">
                        <header class="el-header padding" style="height: 60px;"><span id="headerName">凭证字设置</span>
                            <button type="button" class="el-button el-button--info" style="float: right;" @click="refresh"><span>刷新</span>
                            </button>
                            <button type="button" class="el-button el-button--info" v-show="closeUnDisablePageBtn" style="float: right;margin-right: 10px;" @click="closeUnDisablePage">
                                <span>关闭</span></button>
                        </header>
                        <el-table :data="tableData" border v-loading="showLoading" @row-click="rowClick" highlight-current-row>
                            <el-table-column prop="voucherName" label="凭证名称"></el-table-column>
                        </el-table>

                        <div class="padding showNum pagingClass">

                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="currentPage"
                                :current-page="currentPage4"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                            </el-pagination>
                        </div>
                        <el-col :span="24" class="demo-form-inline">
                            <div>
                                <el-button type="info" v-show="openAddBtn" @click="openAdd">新建</el-button>
                                <el-button type="info" v-show="modifyBtn" @click="modify(formInline)">修改</el-button>
                                <el-button type="info" v-show="delBtn" @click="del">删除</el-button>
                                <el-button type="info" v-show="submitBtn" @click="submit('formInline')">提交</el-button>
                                <el-button type="info" v-show="submitBtnAdd" @click="submitAdd('formInline')">提交</el-button>
                                <el-button type="info" v-show="printBtn" @click="print">打印</el-button>
                                <el-button type="info" v-show="previewBtn" @click="preview">预览</el-button>
                                <el-button type="info" v-show="disableBtn" @click="disable">禁用</el-button>
                                <el-button type="info" v-show="cancelDisableBtn" @click="cancelDisable">取消禁用</el-button>
                                <el-button type="info" v-show="unDisableBtn" @click="unDisable">反禁用</el-button>
                            </div>

                            <el-form :inline="true" :model="formInline" v-show="showEditDiv" :rules="rules" ref="formInline" class="padding">
                                <!-- row start -->
                                <div>
                                    <el-col :span="8">
                                        <el-form-item label="凭证名称" prop="voucherName">
                                            <el-input v-model="formInline.voucherName" placeholder="凭证名称" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </div>
                                <!-- row end -->

                            </el-form>
                        </el-col>
                    </el-col>
                </el-row>

            </div>
        </el-main>
    </el-container>
</template>


<script>
    export default {
        data() {
            return {
                openAddBtn: true,        //控制新建按钮是否显示
                modifyBtn: false,        //控制修改按钮是否显示
                delBtn: false,           //控制删除按钮是否显示
                submitBtn: false,        //控制提交按钮是否显示
                submitBtnAdd: false,     //新建的提交按钮
                printBtn: true,          //控制打印按钮是否显示
                previewBtn: true,        //控制预览按钮是否显示
                disableBtn: false,       //控制禁用按钮是否显示
                cancelDisableBtn: false, //控制取消禁用按钮是否显示
                unDisableBtn: true,      //控制反禁用按钮是否显示
                disabled: true,          //控制表单是否只读
                closeUnDisablePageBtn: false, //关闭按钮
                pageStatus: '1',         //记录当前页面是在反禁用页面还是首页，0处于反禁用页面
                headerName: '凭证字设置',          //头部名称
                currentPage4: 1,
                loading: false,
                rules: {                 //验证
                    voucherName: [
                        { required: true, message: '请填写凭证名称', trigger: 'blur' },
                    ]
                },
                pageSize: 10,
                options: [{
                    value: '选项1',
                    label: '10'
                }, {
                    value: '选项2',
                    label: '25'
                }, {
                    value: '选项3',
                    label: '50'
                }, {
                    value: '选项4',
                    label: '100'
                }],
                value: '',
                total: 0,
                tableData: [],
                tableDataChange: [],
                showLoading: true,
                showEditDiv: false,
                formInline: {
                    user: '',
                    region: ''
                }
            }
        },
        beforeCreate() {
            console.log();
        },
        created() {
            this.init()
        },
        methods: {
            rowClick(row, event, column) { //点击行回调
                this.showEditDiv = true //打开编辑页
                this.formInline = row
                this.buttonAction()
                console.log(row)
                console.log(event)
                console.log(column)
            },
            init(status) {
                let axios = this.$http
                let statusType = status || '1'
                let urls = ['/ZingMH/ZDesk/voucher/mater/searchVoucher.action?status=' + statusType];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.total = acct.data.data.data.data.length
                        this.tableDataChange = acct.data.data.data.data
                        this.tableData = acct.data.data.data.data.slice(0,this.pageSize)
                        this.buttonAction("init")
                        this.loading = false
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询节点是否存在
            searchNameOrSame (status,type) {
                let axios = this.$http
                let statusType = status || '1'
                let urls = ['/ZingMH/ZDesk/voucher/mater/searchVoucher.action?voucherName=' + this.formInline.voucherName + '&status=' + statusType];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        let data = acct.data.data.data
                        if (data.total === '0' && type === 'add') {
                            this.insertVoucher()
                        } else if (data.total === '0') {
                            this.updateVoucher(status)
                        } else {
                            if (data.data[0].voucherId === this.formInline.voucherId) {
                                this.updateVoucher(status)
                            } else {
                                this.loading = false
                                this.$message({ type: 'warning', message: '已存在同名的名称！' });
                            }
                            console.log()
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            updateVoucher (status) {
                let axios = this.$http
                let statusType = status || '1'
                let urls = ['/ZingMH/ZDesk/voucher/mater/updateVoucher.action?voucherName=' + this.formInline.voucherName + '&status=' + statusType + '&companyId=' + this.formInline.companyId + '&voucherId=' + this.formInline.voucherId];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        if (statusType === '1') {
                            this.$message({ type: 'success', message: '修改成功！' });
                            window.setTimeout(() => {
                                /*this.loading = false*/
                                this.modifyBtn = true
                                this.submitBtn = false
                                this.disabled = true
                                if (this.formInline.status === '0') {
                                    this.init('0')
                                } else {
                                    this.init()
                                }
                            }, 3000)
                        } else {
                            this.$message({ type: 'success', message: '禁用成功！' });
                            window.setTimeout(() => {
                                this.buttonAction('disable')
                                this.init()
                                /*this.loading = false*/
                            }, 3000)
                        }

                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //插入数据
            insertVoucher() {
                let axios = this.$http
                let statusType = '1'
                let urls = ['/ZingMH/ZDesk/voucher/mater/insertVoucher.action?voucherName=' + this.formInline.voucherName + '&status=' + statusType];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.$message({ type: 'success', message: '添加成功！' });
                        window.setTimeout(() => {
                            this.init()
                        }, 3000)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //新建
            openAdd () {
                this.buttonAction('add')
            },
            //修改
            modify () {
                this.modifyBtn = false
                this.submitBtn = true
                this.disabled = false
            },
            //删除
            del () {
                this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(this.formInline)
                    //由于接口问题，调用拼串方法
                    /*this.formInline.sortField = this.formInline.subjectId*/
                    this.$http.post("/zingbiz/finance/voucher/delById", {
                        id: this.formInline.voucherId
                    }).then(data => {
                        try {
                            window.setTimeout(() => {
                                console.log(data)
                                if (data.data.success === false) {
                                    this.$message({ type: 'warning', message: data.data.msg });
                                } else {
                                    this.$message({ type: 'success', message: '删除成功！' });
                                    window.setTimeout(() => {
                                        this.refresh()
                                    }, 2000)
                                }
                                this.$refs.tree.add()  //服务端返回success 调用edit
                            }, 500)
                        } catch (e) {
                            console.error("Exception initJSSDK " + e.message);
                        }
                    });
                })
            },
            //提交
            submit (formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.searchNameOrSame()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新建的提交
            submitAdd (formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.searchNameOrSame('','add')
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //禁用
            disable () {
                this.loading = true
                let status = '0'
                this.searchNameOrSame(status)
            },
            //取消禁用
            cancelDisable () {
                this.loading = true
                let status = '1'
                this.searchNameOrSame(status)
            },
            //反禁用
            unDisable () {
                let status = '0'
                document.getElementById("headerName").innerText = "凭证字设置---反禁用"
                this.pageStatus = '0'
                this.closeUnDisablePageBtn = true
                this.init(status)
            },
            //刷新
            refresh() {
                this.init(this.pageStatus)
            },
            //关闭反禁用页面
            closeUnDisablePage() {
                document.getElementById("headerName").innerText = this.headerName
                this.pageStatus = '1'
                this.closeUnDisablePageBtn = false
                this.init(1)
            },
            //修改按钮显示
            buttonAction (type) {
                if (type === 'add') {
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    this.disabled = false
                    this.submitBtnAdd = true
                    this.showEditDiv = true
                    this.formInline = {}
                } else if (type === 'init') {
                    this.disabled = true
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.submitBtnAdd = false
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    this.showEditDiv = false
                    if (this.pageStatus === '0') {
                        this.unDisableBtn = false
                        this.openAddBtn = false
                    } else {
                        this.openAddBtn = true
                        this.unDisableBtn = true
                    }

                } else if (type === 'disable') {
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.submitBtnAdd = false
                    this.disableBtn = false
                    this.showEditDiv = false
                } else {
                    if (this.formInline.status === "0") {
                        this.disableBtn = false
                        this.cancelDisableBtn = true
                    } else {
                        this.cancelDisableBtn = false
                        this.disableBtn = true
                    }
                    if (this.pageStatus === '0') {
                        this.modifyBtn = false
                        this.delBtn = false
                    } else {
                        this.modifyBtn = true
                        this.delBtn = true
                    }

                }
            },
            //打印
            print () {
                console.log()
            },
            //预览
            preview () {
                console.log()
            },
            //翻页
            currentPage(val) {
                // this.showLoading = true;
                let num = (val - 1) * 10
                this.tableData = this.tableDataChange.slice(num,num + this.pageSize)
            },
            //改变每页显示条数
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage(1)
            },
        },
    }

</script>
<style scoped>
    .demo-form-inline {
        padding-top: 10px;
        border: 1px solid #8E8E8E;

    }

    .padding {
        padding: 10px;
    }

    .showNum {
        display: flex;
        justify-content: space-between;
    }
</style>
