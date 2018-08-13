<template>
    <el-container v-loading.fullscreen.lock="fullscreenLoading">
        <el-aside style="width: 200px">
            <finance-tree :treeState="true" :treeData="testTreeData" @handleNodeClick="handleNodeClick" @editCallback="editCallback"
                          @addCallback="addCallback" @delCallback="delCallback" ref="tree"></finance-tree>
        </el-aside>
        <el-container>
            <el-main>
                <el-header class="padding"><span id="headerName">计量单位</span>
                    <el-button type="info" style="float: right" @click="refresh">刷新</el-button>
                    <button type="button" class="el-button el-button--info" v-show="closeUnDisablePageBtn" style="float: right;margin-right: 10px;" @click="closeUnDisablePage">
                        <span>关闭</span></button>
                </el-header>
                <el-table :data="unitList" border v-loading="showLoading" max-height="250"
                          style="width: 100%" @row-click="selListItem" highlight-current-row>
                    <el-table-column prop="measureUnitCode" label="代码" width="180"></el-table-column>
                    <el-table-column prop="measureUnitName" label="名称" width="180"></el-table-column>
                    <el-table-column prop="measureUnitConvertRate" label="换算率"></el-table-column>
                    <el-table-column prop="measureClasses" label="类别">
                        <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.measureClasses === "undefined" ? '' : scope.row.measureClasses}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="classesIsDefaut" label="是否默认"></el-table-column>
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
                <el-col :span="24" class="padding bottomTable">
                    <div>
                        <el-button type="info" v-show="openAddBtn" @click="openAdd">新建</el-button>
                        <el-button type="info" v-show="modifyBtn" @click="modify">修改</el-button>
                        <el-button type="info" v-show="delBtn" @click="del">删除</el-button>
                        <el-button type="info" v-show="submitBtn" @click="submit('formInline')">提交</el-button>
                        <el-button type="info" v-show="submitAddBtn" @click="submitAdd('formInline')">提交</el-button>
                        <el-button type="info" v-show="printBtn" @click="print">打印</el-button>
                        <el-button type="info" v-show="previewBtn" @click="preview">预览</el-button>
                        <el-button type="info" v-show="disableBtn" @click="disable">禁用</el-button>
                        <el-button type="info" v-show="cancelDisableBtn" @click="cancelDisable">取消禁用</el-button>
                        <el-button type="info" v-show="unDisableBtn" @click="unDisable">反禁用</el-button>
                    </div>
                    <!--<el-row class="padding" v-show="showEditDiv">-->
                    <el-form :label-position="labelPosition" class="padding" :rules="rules" v-show="showEditDiv" :model="formInline" ref="formInline" :inline="true">
                        <el-col :span="24">
                            <el-col :span="8">
                                <el-form-item label="代码" prop="measureUnitCode">
                                    <el-input v-model="formInline.measureUnitCode" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="名称" prop="measureUnitName">
                                    <el-input v-model="formInline.measureUnitName" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="换算率" prop="measureUnitConvertRate">
                                    <el-input v-model="formInline.measureUnitConvertRate" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="8">
                                <el-form-item label="类别" prop="category">
                                    <el-input v-model="formInline.measureClasses" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="是否默认" prop="classesIsDefaut">
                                    <el-select :disabled="disabled" v-model="formInline.classesIsDefaut" placeholder="请选择"
                                                   style="width: 100px;">
                                        <el-option
                                                v-for="item in classesIsDefaut"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-form>
                </el-col>`
            </el-main>
        </el-container>

        <el-dialog
            title="提示"
            :visible.sync="delSure"
            width="30%"
            center>
            <span style="text-align: center">确认要删除此项？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDel">取 消</el-button>
                <el-button type="primary" @click="sureDel">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加" :visible.sync="dialogFormAdd" >
            <el-form :inline="true" :model="form" >

                <el-col :span="24">
                    <el-col :span="15">
                        <el-form-item label="计量单位组名称">
                            <el-input v-model="form.text" placeholder="计量单位组名称"></el-input>
                        </el-form-item>
                    </el-col>

                </el-col>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAdd = false">取 消</el-button>
                <el-button type="primary" @click="dialogFromSubmit" v-show="dialogFromAddBtn">确 定</el-button>
                <el-button type="primary" @click="dialogFromUp" v-show="dialogFromUpBtn">确 定</el-button>
            </div>
        </el-dialog>


    </el-container>
</template>
<script>
    import FinanceTree from '../componets/FinanceTree.vue'

    export default {
        components: {
            FinanceTree,
        },
        data() {
            return {
                testTreeData: [],
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
                unitList: [],
                total: 0,
                pageSize: 10,
                showLoading: true,
                classesIsDefaut: [{
                    value: '是',
                    label: '是',
                }, {
                    value: '否',
                    label: '否',
                }],
                disabled: true,
                formInline: {},
                firstArticle: 0,
                lastArticle: 0,
                totalArticle: 0,
                openAddBtn: true,          //新建
                modifyBtn: false,          //修改
                delBtn: false,             //删除
                submitBtn: false,          //提交
                submitAddBtn: false,       //新建提交
                printBtn: true,            //打印
                previewBtn: true,          //预览
                disableBtn: false,         //禁用
                cancelDisableBtn: false,   //取消禁用
                unDisableBtn: true,        //反禁用
                showEditDiv: false,        //表单
                clickTreeId: '',            //当前点击的树节点id
                clickTreeName: '',          //当前点击的树的节点名称
                dialogFormAdd: false,      //树添加弹窗
                dialogFromUpBtn: false,    //修改树节点确定按钮
                dialogFromAddBtn: true,    //添加树节点确定按钮
                closeUnDisablePageBtn: false, //关闭按钮
                pageStatus: '1',         //记录当前页面是在反禁用页面还是首页，0处于反禁用页面
                headerName: '计量单位设置',          //头部名称
                labelPosition: 'left',
                currentPage4: 1,
                fullscreenLoading: false,
                form: {                    //添加树的名称
                    text:''
                },
                rules: {
                    measureUnitConvertRate: [
                        { required: true, message: '请填写换算率', trigger: 'blur' },
                    ],
                    measureUnitCode: [
                        { required: true, message: '请填写代码', trigger: 'blur' },
                    ],
                    measureUnitName: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                    ],
                    classesIsDefaut: [
                        { required: true, message: '请选择是否默认', trigger: 'change' }
                    ]
                },
                delSure: false,
                tableDataChange: [],
                zero: {
                    "id": "jiliangdanwei",
                    "parentId": "0000",
                    "text": "计量单位",
                    "leaf": "false",
                    "companyId": "company41860418100001",
                    "recordType": "measureUnit",
                    "isdel": "false",
                    "checkable": "true",
                    "fileId": "jiliangdanwei"
                }
            }
        },
        computed: {},
        created() {
            this.init();
            this.initTree();
        },
        methods: {
            //table单击回调方法
            selListItem(row, event, column) {
                this.showEditDiv = true;
                this.formInline = row;
                this.buttonAction()
                console.log(row)
                console.log(event)
                console.log(column)
            },
            init(status) {
                let axios = this.$http
                let statusType = status || '1'
                let urls;
                if (this.clickTreeId === '') {
                    urls = ['/ZingMH/ZDesk/measureUnit/mater/searchMeasureUnit.action?status=' + statusType];
                } else {
                    urls = ['/ZingMH/ZDesk/measureUnit/mater/searchMeasureUnit.action?status=' + statusType + '&parentTreeId=' + this.clickTreeId];
                }
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.total = parseInt(acct.data.data.data.total)
                        this.tableDataChange = acct.data.data.data.data
                        this.unitList = acct.data.data.data.data.slice(0,this.pageSize)
                        this.buttonAction('init')
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            initTree() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=measureUnit'];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((perms) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                            perms.data.data.data.data.push(this.zero)
                            this.arrayToTreeJsonFuc('parentId', 'fileId', 'children',perms.data.data.data.data)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //同组内查询是否存在相同名称
            searchNameOrSame(status,type) {
                let axios = this.$http
                let parentTreeId = this.clickTreeId || 'jiliangdanwei'
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/searchMeasureUnit.action?classesIsDefaut=是&status=1&measureUnitName=' + this.formInline.measureUnitName + '&parentTreeId=' + parentTreeId];
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
                        console.log(data)
                        if (data.total !== '0' && data.data[0].measureUnitId !== this.formInline.measureUnitId) {
                            this.$message({ type: 'warning', message: '同组内已存在相同的名称！' });
                        } else {
                            if (this.formInline.classesIsDefaut === '是') {
                                this.selectDefault(status,type)
                            } else {
                                if (type === 'add') {
                                    this.insertMeasureUnit()
                                } else {
                                    this.updateMeasureUnit(status)
                                }
                                console.log()
                            }
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询同组内是否存在相同的
            selectDefault (status,type) {
                let axios = this.$http
                let parentTreeId = this.clickTreeId || 'jiliangdanwei'
                console.log(parentTreeId)
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/selectDefaut.action?classesIsDefaut=是&status=1&measureUnitName=' + this.formInline.measureUnitName + '&parentTreeId= ' + parentTreeId];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        console.log(acct.data.data.data)
                        let data = acct.data.data.data
                        if (type === 'add') {
                           if (data.total === '0') {
                               this.insertMeasureUnit()
                           } else {
                               this.$message({ type: 'warning', message: '默认选项已存在！' });
                           }
                        } else {
                            if ((data.data[0].measureUnitId !== '' && data.data[0].measureUnitId === this.formInline.measureUnitId) || data.data[0].measureUnitId === '') {
                                this.updateMeasureUnit(status)
                            } else {
                                this.$message({ type: 'warning', message: '默认选项已存在！' });
                            }
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //修改数据
            updateMeasureUnit (status) {
                let axios = this.$http
                let urls;
                this.formInline.status = status || '1'
                let measureClasses = this.formInline.measureClasses
                if (measureClasses == null || measureClasses === 'undefined') {
                    measureClasses = ""
                }
                urls = ['/ZingMH/ZDesk/measureUnit/mater/updateMeasureUnit.action?measureUnitId=' + this.formInline.measureUnitId
                + '&companyId=' + this.formInline.companyId + '&measureUnitCode=' + this.formInline.measureUnitCode + '&measureUnitName=' + this.formInline.measureUnitName
                + '&measureUnitConvertRate=' + this.formInline.measureUnitConvertRate + '&measureClasses=' + measureClasses + '&classesIsDefaut=否&status='
                + this.formInline.status];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        console.log(acct)
                        if (acct.data.data.data === 'pzExits') {
                            this.$message({ type: 'warning', message: '已有业务发生或已被使用，不能编辑！' });
                        } else {
                            if (this.formInline.status === '1') {
                                this.openFullScreen2()
                                this.$message({ type: 'success', message: '修改成功！' });
                                window.setTimeout(() => {
                                    if (status === '1') {
                                        this.init('0')
                                    } else {
                                        this.init()
                                    }
                                }, 3000)
                            } else {
                                this.openFullScreen2()
                                this.$message({ type: 'success', message: '禁用成功！' });
                                window.setTimeout(() => {
                                        this.init()
                                }, 3000)
                            }
                        }

                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
               /* let axios = this.$httpa
                let urls;
                this.formInline.status = status || '1'
                /!*let str = this.pinChuan(this.formInline)
                console.log(str)*!/
                urls = ['/ZingMH/ZDesk/measureUnit/mater/updateMeasureUnit.action?measureUnitId=' + this.formInline.measureUnitId
                + '&companyId=' + this.formInline.companyId + '&measureUnitCode=' + this.formInline.measureUnitCode + '&measureUnitName=' + this.formInline.measureUnitName
                + '&measureUnitConvertRate=' + this.formInline.measureUnitConvertRate + '&measureClasses=' + this.formInline.measureClasses + '&classesIsDefaut=否&status='
                + this.formInline.status];
                console.log(urls)
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        console.log(acct)
                        if (acct.data.data.data === 'pzExits') {
                            this.$message({ type: 'warning', message: '已有业务发生或已被使用，不能编辑！' });
                        } else {
                          if (this.formInline.status === '1') {
                              this.$message({ type: 'success', message: '修改成功！' });
                              if (status === '1') {
                                  this.init('0')
                              } else {
                                  this.init()
                              }
                          } else {
                              this.$message({ type: 'success', message: '禁用成功！' });
                              this.init()
                          }
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });*/
            },
            //插入数据
            insertMeasureUnit() {
                let axios = this.$http
                let urls;
                this.formInline.status = '1'
                this.formInline.parentTreeId = this.clickTreeId + ' jiliangdanwei'
                this.formInline.measureUnitFullName = this.clickTreeName + '组' + this.formInline.measureUnitName
                let str = this.pinChuan(this.formInline)
                urls = ['/ZingMH/ZDesk/measureUnit/mater/insertMeasureUnit.action?' + str];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.openFullScreen2()
                        this.$message({ type: 'success', message: '添加成功！' });
                        setTimeout(() => {
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
            // 点击树节点回调
            handleNodeClick(data) {
                this.clickTreeId = data.data.fileId
                this.clickTreeName = data.data.text
                this.closeUnDisablePageBtn = false
                let db = data.indeterminate;
                this.headerName = ""
                for (;;) {
                    if (db.parent === null) {
                        break;
                    } else {
                        this.headerName = db.data.text + "->" + this.headerName;
                    }
                    db = db.parent;
                }
                this.headerName = this.headerName.slice(0,this.headerName.length - 2);
                document.getElementById("headerName").innerText = this.headerName
                this.pageStatus = '1'
                this.init()
                // this.init()
            },
            //点击新建
            openAdd() {
                if (this.clickTreeId === '' || this.clickTreeId === 'jiliangdanwei') {
                this.$message({ type: 'warning', message: '请选择计量单位组！' });
                } else {
                this.buttonAction('openadd')
              }
            },
            //修改
            modify() {
                this.modifyBtn = false
                this.submitBtn = true
                this.disabled = false
            },
            //点击删除调出弹窗
            del() {
                this.delSure = true;
            },
            //取消删除关闭弹窗
            cancelDel() {
                this.delSure = false;
            },
            //确认删除
            sureDel() {
                let axios = this.$http
                let urls;
                let str = this.pinChuan(this.formInline)
                urls = ['/ZingMH/ZDesk/measureUnit/mater/deleteMeasureUnit.action?' + str];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.openFullScreen2()
                        this.$message({ type: 'success', message: '删除成功！' });
                        window.setTimeout(() => {
                            this.cancelDel()
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
            //提交
            submit(formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.searchNameOrSame()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新建提交
            submitAdd (formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.searchNameOrSame('','add')
                        console.log()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //禁用
            disable() {
                this.searchNameOrSame('0')
            },
            //取消禁用
            cancelDisable() {
                this.searchNameOrSame('1')
            },
            //反禁用
            unDisable() {
                this.clickTreeId = this.clickTreeId || 'jiliangdanwei'
                document.getElementById("headerName").innerText = "计量单位设置---反禁用"
                this.pageStatus = '0'
                this.closeUnDisablePageBtn = true
                let status = '0'
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
            //翻页
            currentPage(val) {
                //this.initialState()
                let num = (val - 1) * 10
                this.unitList = this.tableDataChange.slice(num,num + this.pageSize)
                console.log(this.unitList)
                //this.initData();
            },
            //改变每页显示条数
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage(1)
            },
            //修改按钮显示
            buttonAction (type) {
                if (type === 'openadd') {
                    this.disabled = false;
                    this.openAddBtn = true;
                    this.modifyBtn = false;
                    this.delBtn = false;
                    this.submitBtn = false;
                    this.submitAddBtn = true;
                    this.printBtn = true;
                    this.previewBtn = true;
                    this.disableBtn = false;
                    this.unDisableBtn = true;
                    this.formInline = {
                        classesIsDefaut: '是'
                    };
                    this.showEditDiv = true;
                } else if (type === 'init') {
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    this.showEditDiv = false
                    this.submitAddBtn = false;
                    this.formInline = {};
                    if (this.pageStatus === '0') {
                        this.unDisableBtn = false
                        this.openAddBtn = false
                    } else {
                        this.openAddBtn = true
                        this.unDisableBtn = true
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
                    this.submitAddBtn = false
                }
            },
            editCallback(data) { // 此处调用服务端各个模块update接口
                /*setTimeout(() => {
                    this.$refs.tree.edit()  //服务端返回success 调用edit
                }, 500)*/
                event.stopPropagation()
                this.dialogFromUpBtn = true
                this.dialogFromAddBtn = false
                this.form = {
                    text : data.text,
                    id: data.id
                }
                this.dialogFormAdd = true
            },
            addCallback() { //
                event.stopPropagation()
                this.form = {
                    text : ''
                }
                this.dialogFromUpBtn = false
                this.dialogFromAddBtn = true
                this.dialogFormAdd = true
            },
            delCallback(data) { // 此处调用服务端各个模块update接口
                console.log(data)
                this.form = {
                    id: data.id
                }
                this.dialogFromUp('del')
                /*setTimeout(() => {
                    this.$refs.tree.delete()  //服务端返回success 调用edit
                }, 500)*/
            },
            //添加树节点
            dialogFromSubmit() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/addTreeNode.action?recordType=measureUnit&recordType=measureUnit&' +
                'leaf=&isdel=trur&text=' + this.form.text + '&parentId=jiliangdanwei'];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        window.setTimeout(() => {
                            this.initTree()
                            this.dialogFormAdd = false
                        }, 3000)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询节点下是否有数据
            dialogFromUp(type) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/searchMeasureUnit.action?status=1&parentTreeId=' + this.form.id];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        if (acct.data.data.data.total === '0') {
                            if (type === 'del') {
                                this.delTreeNode()
                            } else {
                                this.updateTreeNode()
                            }
                        } else {
                            if (type === 'del') {
                                this.$message({ type: 'warning', message: '该节点下存在数据，无法删除！' });
                            } else {
                                this.$message({ type: 'warning', message: '该节点下存在数据，无法修改！' });
                            }
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //修改树节点
            updateTreeNode() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/updateTreeNode.action?id=' + this.form.id + '&text=' + this.form.text];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        this.$message({ type: 'success', message: '修改成功！' });
                        setTimeout(() => {
                            this.initTree()
                            this.dialogFormAdd = false
                        }, 3000)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //删除树节点
            delTreeNode() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/delTreeNode.action?treeId=' + this.form.id];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------老接口数据--------
                        setTimeout(() => {
                            this.initTree()
                            this.$message({ type: 'success', message: '删除成功！' });
                        }, 500)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //遮罩
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
            //拼串
            pinChuan(data) {
                console.log(data)
                let str = ""
                for (let key in data) {
                    str += key + "=" + encodeURIComponent(data[key]) + "&";
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
            //由于后台返回数据非树结构所需格式，此方法为格式转换
            arrayToTreeJsonFuc(prIndex, index, home, db) {
                let allPrIndexData = {}; // 所有集合+上级索引, key = prIndex / value = [db[n],db[x].........]
                let tree = []; // 树
                for (let i = 0; i < db.length; i++) { // 第一次生成数据
                    //db[i].label = db[i].text;
                    let t = db[i]; // 一个数据单位
                    let prValue = db[i][prIndex];
                    if (prValue === '0000') { //
                        t.addAuto = 'true'
                        tree.push(t);
                    } else {
                        let ts = allPrIndexData[prValue]; // 上级的孩子们
                        if (ts == null) {
                            ts = [];
                            allPrIndexData[prValue] = ts; // 上级没孩子 给孩子创建临时居所
                        }
                        t.editAuto = 'true'
                        ts.push(t);// 孩子会和
                    }
                }
                for (let i = 0; i < db.length; i++) { // 第二次组装数据
                    let t = db[i]; // 一个数据单位
                    let value = db[i][index]; // index （key）
                    let ts = allPrIndexData[value]; // 我的孩子
                    if (ts != null) {
                        t[home] = ts; //回家
                    }
                }
                this.testTreeData = tree;
            }
        }
    }
</script>
<style scoped lang="stylus">
    .padding {
        padding: 10px;
    }

    .showNum {
        display: flex;
        justify-content: space-between;
    }

    .bottomTable {
        border: 1px solid #000;
    }
    .pagingClass {
        float: right;
    }

    .red {
        color: red;
    }

    .lineHeight {
        line-height: 40px;
    }
</style>
