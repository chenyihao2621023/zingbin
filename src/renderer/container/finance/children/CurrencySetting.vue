<template>
    <el-container v-loading.fullscreen.lock="fullscreenLoading">
        <el-main style="overflow-x:auto">
            <div>

                <el-row :gutter="20">

                    <el-col :span="24" style="overflow-y: auto;height: 800px;">
                        <header class="el-header padding" style="height: 60px;"><span id="headerName">币别设置</span>
                            <button type="button" class="el-button el-button--info" style="float: right;" @click="refresh"><span>刷新</span>
                            </button>
                            <button type="button" class="el-button el-button--info" v-show="closeUnDisablePageBtn" style="float: right;margin-right: 10px;" @click="closeUnDisablePage">
                                <span>关闭</span></button>
                        </header>
                        <el-table :data="tableData" border v-loading="showLoading" @row-click="rowClick" highlight-current-row>
                            <el-table-column prop="currencyName" label="名称"></el-table-column>
                            <el-table-column prop="currencyCode" label="代码"></el-table-column>
                            <el-table-column prop="rate" label="汇率"></el-table-column>
                            <el-table-column prop="floatNumber" label="小数"></el-table-column>
                            <el-table-column prop="fixedRate" label="汇率类型"></el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="currentPage"
                            :current-page="currentPage4"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                            class = "pagingClass">
                        </el-pagination>
                        <!--<el-pagination background @current-change="currentPage" :page-size="pageSize"
                                       layout="total, prev, pager, next" :total="total" style="float:right"></el-pagination>-->

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
                            <el-form :inline="true" label-position="left" :model="formInline" v-show="showEditDiv" :rules="rules" ref="formInline" class="padding">
                                <!-- row start -->
                                <div>
                                    <el-col :span="8">
                                        <el-form-item label="币别代码" prop="currencyCode">
                                            <el-input v-model="formInline.currencyCode" placeholder="代码" :disabled="disabled"></el-input>
                                        </el-form-item>
                                        <el-form-item label="折算方式">
                                            <el-radio label="原币 * 汇率 = 本位币" v-model="formInline.convertWay" :disabled="disabled">原币*汇率=本位币</el-radio>
                                            <el-radio label="原币 ÷ 汇率 = 本位币" v-model="formInline.convertWay" :disabled="disabled">原币÷汇率=本位币</el-radio>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="币别名称" prop="currencyName">
                                            <el-input v-model="formInline.currencyName" placeholder="名称" :disabled="disabled"></el-input>
                                        </el-form-item>
                                        <el-form-item label="汇率类型">
                                            <el-radio label="固定汇率" v-model="formInline.fixedRate" :disabled="disabled">固定汇率</el-radio>
                                            <el-radio label="浮动汇率" v-model="formInline.fixedRate" :disabled="disabled">浮动汇率</el-radio>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="记账汇率" prop="rate">
                                            <el-input v-model="formInline.rate" placeholder="汇率" :disabled="disabled"></el-input>
                                        </el-form-item>
                                        <el-form-item label="金额小数位数">
                                            <el-select v-model="formInline.floatNumber" placeholder="金额小数位数" style="width: 100px;" :disabled="disabled">
                                                <el-option
                                                    v-for="item in test"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </div>
                            </el-form>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>


<script>
    import FinanceTree from '../componets/FinanceTree.vue'
    import _ from 'lodash'

    export default {
        components: {
            FinanceTree
        },
        data() {
            return {
                value: '',
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
                closeUnDisablePageBtn: false, //关闭按钮
                disabled: true,          //form表单是否可编辑
                fullscreenLoading: false,
                pageStatus: '1',         //记录当前页面是在反禁用页面还是首页，0处于反禁用页面
                headerName: '币别设置',          //头部名称
                test: _.range(10),
                pageSize: 10,
                currentPage4: 1,
                total: 0,
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
                rules: {                //验证
                    currencyCode: [
                        { required: true, message: '请填写代码', trigger: 'blur' },
                    ],
                    currencyName: [
                        { required: true, message: '请填写币别名称', trigger: 'blur' },
                    ],
                    rate: [
                        { required: true, message: '请填写汇率', trigger: 'blur' },
                    ]
                },
                tableData: [],
                tableDataChange: [],
                showLoading: true,
                showEditDiv: false,
                formInline: {
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
                this.buttonAction('','formInline')
                console.log(row)
                console.log(event)
                console.log(column)
            },
            init(status) {
                let axios = this.$http
                let statusType = status || '1'
                let urls = ['/ZingMH/ZDesk/currenty/mater/searchCurrenty.action?offset=0&rows=10&parentId=bibieshezhi&status=' + statusType];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        let pdata = acct.data.data.data.data
                        let arr = Object.keys(pdata)
                        arr.filter(function (val) {
                            if (!val) {
                                return false
                            }
                            if (pdata[val].convertWay === 'multiplication') {
                                pdata[val].convertWay = '原币 * 汇率 = 本位币';
                            } else if (pdata[val].convertWay === 'addition') {
                                pdata[val].convertWay = '原币 ÷ 汇率 = 本位币';
                            }
                            if (pdata[val].fixedRate === '0') {
                                pdata[val].fixedRate = '固定汇率';
                            } else if (pdata[val].fixedRate === '1') {
                                pdata[val].fixedRate = '浮动汇率';
                            }
                            return true
                        })
                        this.total = pdata.length
                        this.tableDataChange = pdata
                        this.tableData = pdata.slice(0,this.pageSize)
                        this.buttonAction('init','formInline')
                        this.showEditDiv = false
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询币别名称是否存在 type判断是否是新建的请求
            currencyNameOrExits(status,type) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/currenty/mater/searchCurrenty.action?parentId=bibieshezhi&status=1&currencyName=' + this.formInline.currencyName];
                console.log(this.formInline.currencyName)
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        let pdata = acct.data.data.data
                        console.log(pdata)
                        if (pdata.total <= 0 && type === 'add') {
                            this.insertCurrenty()
                        } else if (pdata.total <= 0 || pdata.data[0].currencyId === this.formInline.currencyId) {
                            this.updateCurrenty(status)
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //新建币别
            insertCurrenty() {
                let axios = this.$http
                let urls;
                if (this.formInline.convertWay === '原币 * 汇率 = 本位币') {
                    this.formInline.convertWay = 'multiplication';
                } else if (this.formInline.convertWay === '原币 ÷ 汇率 = 本位币') {
                    this.formInline.convertWay = 'addition';
                }
                if (this.formInline.fixedRate === '固定汇率') {
                    this.formInline.fixedRate = '0';
                } else if (this.formInline.fixedRate === '浮动汇率') {
                    this.formInline.fixedRate = '1';
                }
                this.formInline.parentId = 'bibieshezhi'
                this.formInline.status = '1'
                let str = this.pinChuan(this.formInline)
                urls = ['/ZingMH/ZDesk/currenty/mater/insertCurrenty.action?' + str];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        this.openFullScreen2()
                        window.setTimeout(() => {
                            this.$message({ type: 'success', message: '添加成功！' });
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
            //修改币别
            updateCurrenty(status) {
                let axios = this.$http
                let urls;
                this.formInline.status = status || '1'
                if (this.formInline.convertWay === '原币 * 汇率 = 本位币') {
                    this.formInline.convertWay = 'multiplication';
                } else if (this.formInline.convertWay === '原币 ÷ 汇率 = 本位币') {
                    this.formInline.convertWay = 'addition';
                }
                if (this.formInline.fixedRate === '固定汇率') {
                    this.formInline.fixedRate = '0';
                } else if (this.formInline.fixedRate === '浮动汇率') {
                    this.formInline.fixedRate = '1';
                }
                //由于接口原因将map拼串
                let str = this.pinChuan(this.formInline)
                urls = ['/ZingMH/ZDesk/currenty/mater/updateCurrenty.action?' + str];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        this.openFullScreen2()
                        //---------真实数据--------
                        console.log(acct)
                        if (acct.data.data.data === "pzExits") {
                            this.disabled = true
                            this.$message({ type: 'warning', message: '已有业务发生或已被使用，不能编辑！' });
                        } else {
                            if (this.formInline.status === '1') {
                                window.setTimeout(() => {
                                    this.disabled = true
                                    this.$message({ type: 'success', message: '修改成功！' });
                                    this.init()
                                }, 3000)
                            } else {
                                window.setTimeout(() => {
                                    this.$message({ type: 'success', message: '禁用成功！' });
                                    this.init()
                                }, 3000)
                            }
                        }
                        this.init()
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
              console.log()
            },
            //新建
            openAdd() {
                this.buttonAction('add','formInline')
            },
            //修改
            modify(formInline) {
                this.modifyBtn = false
                this.submitBtn = true
                this.disabled = false
            },
            //删除
            del() {
                let axios = this.$http
                let urls;
                /*if (this.formInline.convertWay === '原币 * 汇率 = 本位币') {
                    this.formInline.convertWay = 'multiplication';
                } else if (this.formInline.convertWay === '原币 ÷ 汇率 = 本位币') {
                    this.formInline.convertWay = 'addition';
                }
                if (this.formInline.fixedRate === '固定汇率') {
                    this.formInline.fixedRate = '0';
                } else if (this.formInline.fixedRate === '浮动汇率') {
                    this.formInline.fixedRate = '1';
                }
                let str = this.pinChuan(this.formInline)
                console.log(str)*/
                urls = ['/ZingMH/ZDesk/currenty/mater/deleteCurrenty.action?currencyId=' + this.formInline.currencyId];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        this.openFullScreen2()
                        //---------真实数据--------
                        let pdata = acct.data
                        console.log(pdata)
                        if (pdata.data === "pzExits") {
                            this.$message({ type: 'warning', message: '已有业务发生或已被使用，不能删除！' });
                        } else {
                            window.setTimeout(() => {
                                this.$message({ type: 'success', message: '删除成功！' });
                                this.init()
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
            //修改禁用反禁用提交
            submit(formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.currencyNameOrExits()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新建提交
            submitAdd(formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.currencyNameOrExits('1','add')
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            openFullScreen2() {
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载......',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                }, 3000);
            },
            //禁用
            disable() {
                this.currencyNameOrExits('0')
                console.log()
            },
            //取消禁用
            cancelDisable() {
                this.currencyNameOrExits()
                console.log()
            },
            //反禁用
            unDisable() {
                let status = '0'
                document.getElementById("headerName").innerText = "币别设置---反禁用"
                this.pageStatus = '0'
                this.closeUnDisablePageBtn = true
                this.init(status)
                console.log()
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
            buttonAction(type,formInline) {
                if (type === 'init') {
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.submitBtnAdd = false
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    if (this.pageStatus === '0') {
                        this.unDisableBtn = false
                        this.openAddBtn = false
                    } else {
                        this.openAddBtn = true
                        this.unDisableBtn = true
                    }
                } else if (type === 'add') {
                    this.showEditDiv = true
                    this.disabled = false
                    this.submitBtn = false
                    this.submitBtnAdd = true
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    this.delBtn = false
                    this.modifyBtn = false
                    this.formInline = {
                        convertWay : '原币 * 汇率 = 本位币',
                        fixedRate: '固定汇率',
                        floatNumber: '1'
                    }
                } else {
                    if (this.formInline.status === '0') {
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
                    this.disabled = true
                }


                /*this.$refs[formInline].resetFields();*/
            },
            //拼串
            pinChuan(data) {
                console.log(data)
                let str = ""
                for (let key in data) {
                    str += key + "=" + data[key] + "&";
                }
                return str
            },
            //打印
            print() {
                console.log()
            },
            //预览
            preview() {
                console.log()
            },
            //翻页
            currentPage(val) {
                this.showLoading = false;
                let num = (val - 1) * 10
                this.tableData = this.tableDataChange.slice(num,num + this.pageSize)
                // this.initData();
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
    .pagingClass {
        float: right;
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    .showNum {
        display: flex;
        justify-content: space-between;
    }
</style>
