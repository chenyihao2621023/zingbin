<template>
    <el-container v-loading.fullscreen.lock="fullscreenLoading">
        <el-main style="overflow-x:auto">
            <div>

                <el-row :gutter="20">

                    <el-col :span="6">
                        <finance-tree :treeState="false" :treeOpenKey="treeOpenKey" :treeData="testTreeData" @handleNodeClick="handleNodeClick"
                                      @editCallback="editCallback" @addCallback="addCallback" @delCallback="delCallback"
                                      ref="tree"></finance-tree>
                    </el-col>
                    <el-col :span="18" style="overflow-y: auto;height: 100%;">
                        <header class="el-header padding" style="height: 60px;"><span id="headerName">科目设置</span>
                            <button type="button" class="el-button el-button--info" style="float: right;" @click="refresh">
                                <span>刷新</span></button>
                            <button type="button" class="el-button el-button--info" v-show="closeUnDisablePageBtn" style="float: right;margin-right: 10px;" @click="closeUnDisablePage">
                                <span>关闭</span></button>
                        </header>
                        <!--<div class="padding">
                            每页显示
                            <el-select v-model="value" placeholder="请选择" style="width: 100px;">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            条
                        </div>-->
                        <el-table :data="tableData" height="500" border v-loading="showLoading" @row-click="rowClick" highlight-current-row>
                            <el-table-column prop="subjectCode" label="科目代码"></el-table-column>
                            <el-table-column prop="subjectName" label="科目名称"></el-table-column>
                            <el-table-column prop="description" label="业务描述"></el-table-column>
                            <el-table-column prop="initBalance" label="期初余额"></el-table-column>
                            <el-table-column prop="mnemonicCode" label="助记码"></el-table-column>
                            <el-table-column prop="subjectCategory" label="科目类别"></el-table-column>
                            <el-table-column prop="balanceDirection" label="余额方向"></el-table-column>
                            <el-table-column prop="foreignCurrencyHeSuan" label="外币核算"></el-table-column>
                            <el-table-column prop="allName" label="全名"></el-table-column>
                            <el-table-column prop="numSumAuxiliaryHeSuan" label="数量金额辅助核算" width="150">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.numSumAuxiliaryHeSuan === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="businessHeSuan" label="来往业务核算" width="110">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.businessHeSuan === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="qimoTiaoHui" label="期末调汇">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.qimoTiaoHui === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="meteringUnit_Group" label="单位组">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.meteringUnit_Group === '无' || scope.row.meteringUnit_Group == null ? '不计量' : scope.row.meteringUnit_Group}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="meteringUnit" label="计量单位">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.meteringUnit === '无' || scope.row.meteringUnit == null || scope.row.meteringUnit == '' ? '不计量' : scope.row.meteringUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cashSubject" label="现金科目">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.cashSubject === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bankSubject" label="银行科目">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.bankSubject === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="chuRiTally" label="出日记账">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.chuRiTally === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cashEquivalent" label="现金等价物" width="100">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.cashEquivalent === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="itemAuxiliary" label="项目辅助">
                                <template slot-scope="scope">
                                   <span
                                       disable-transitions>{{scope.row.itemAuxiliary === '0' ? '否' : '是'}}</span>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                            class = "pagingClass">
                        </el-pagination>
                        <!--<el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :total="total"
                            :page-size="10"
                            style="float:right;margin-bottom: 15px">
                        </el-pagination>-->

                        <div style="width:100%; float:right" class="demo-form-inline">
                            <div>
                                <el-button type="info" v-show="openAddBtn" @click="openAdd">新建</el-button>
                                <el-button type="info" v-show="modifyBtn" @click="modify(formInline)">修改</el-button>
                                <el-button type="info" v-show="delBtn" @click="delConfirm">删除</el-button>
                                <el-button type="info" v-show="submitBtn" @click="submit('formInline')">提交</el-button>
                                <el-button type="info" v-show="addSubmitBtn" @click="addSubmit('formInline')">提交</el-button>
                                <el-button type="info" v-show="printBtn" @click="print">打印</el-button>
                                <el-button type="info" v-show="previewBtn" @click="preview">预览</el-button>
                                <el-button type="info" v-show="disableBtn" @click="disable">禁用</el-button>
                                <el-button type="info" v-show="cancelDisableBtn" @click="cancelDisable">取消禁用</el-button>
                                <el-button type="info" v-show="unDisableBtn" @click="unDisable">反禁用</el-button>
                            </div>
                            <el-form :inline="true" :label-position="labelPosition" :model="formInline" v-show="showEditDiv" :rules="rules" ref="formInline" label-width="80px">
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="科目代码" prop="subjectCode">
                                            <el-input v-model="formInline.subjectCode" placeholder="科目代码" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="科目名称" prop="subjectName">
                                            <el-input v-model="formInline.subjectName" placeholder="科目名称" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="业务描述" prop="description">
                                            <el-input v-model="formInline.description" placeholder="业务描述" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-col>
                                <!-- row end -->
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="助 记 码">
                                            <el-input v-model="formInline.mnemonicCode" placeholder="助记码" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="余额方向">
                                            <el-select v-model="formInline.balanceDirection" placeholder="余额方向" :disabled="disabled">
                                                <el-option
                                                    v-for="item in balanceDirectionOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label=" 全  名 ">
                                        <el-input v-model="formInline.allName" placeholder="全名" :disabled="disabled"></el-input>
                                    </el-form-item>
                                    </el-col>

                                </el-col>
                                <!-- row end -->
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="期初余额" prop="initBalance">
                                            <el-input v-model.number="formInline.initBalance" placeholder="期初余额" :disabled="disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="计量单位组">
                                            <el-select v-model="formInline.meteringUnit_Group" placeholder="计量单位组" :disabled="specialDisabled">
                                                <el-option
                                                    v-for="item in company_Group"
                                                    :key="item.fileId"
                                                    :label="item.text"
                                                    :value="item.text"
                                                    @click.native="searchMeasureUnit(item.fileId)"
                                                >
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="计量单位">
                                            <el-select v-model="formInline.meteringUnit" placeholder="计量单位" :disabled="specialDisabled">
                                                <el-option
                                                    v-for="item in meteringUnit_Group"
                                                    :key="item.measureUnitId"
                                                    :label="item.measureUnitName"
                                                    :value="item.measureUnitName">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-col>
                                <!-- row end -->
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="外币核算">
                                            <el-select v-model="formInline.foreignCurrencyHeSuan" placeholder="外币核算" :disabled="disabled">
                                                <el-option
                                                    v-for="item in cureenty"
                                                    :key="item.currencyId"
                                                    :label="item.currencyName"
                                                    :value="item.currencyId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-col>
                                <!-- row end -->
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.qimoTiaoHui" true-label="1" :disabled="disabled">期末调汇</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.businessHeSuan" true-label="1" :disabled="disabled">业务来往核算</el-checkbox>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.numSumAuxiliaryHeSuan" true-label="1" :disabled="disabled" @change="isChecked">数量金额辅助核算</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                </el-col>
                                <!-- row end -->
                                <!-- row start -->
                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.cashEquivalent" true-label="1" :disabled="disabled">现金等价物</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.cashSubject" true-label="1" :disabled="disabled">现金科目</el-checkbox>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.bankSubject" true-label="1" :disabled="disabled">银行科目</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                </el-col>

                                <el-col :span="24">
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.chuRiTally" true-label="1" :disabled="disabled">出日记账</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-checkbox v-model="formInline.itemAuxiliary" true-label="1" :disabled="disabled">项目辅助核算</el-checkbox>
                                        </el-form-item>
                                    </el-col>
                                </el-col>


                                <!-- row end -->

                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-main>
        <el-dialog
            title="提示"
            :visible.sync="delSure"
            width="30%"
            center>
            <span style="text-align: center">确认要删除此项？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDels">取 消</el-button>
                <el-button type="primary" @click="del">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="confirmSure"
            width="30%"
            center>
            <span style="text-align: center">上级科目是明细科目,并已有业务发生,不能直接新建子科目!是否直接将上级科目业务转到新建立的科目上？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDel">取 消</el-button>
                <el-button type="primary" @click="otherAddRow">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>

</template>


<script>
    import FinanceTree from '../componets/FinanceTree.vue'

    export default {
        components: {
            FinanceTree
        },
        data() {
            let checkSubjectCode = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error('科目代码不能为空'));
                } else {
                    if (value.indexOf(".") === -1 && value != null) {
                        let r
                        let re
                        re = /\d*/i;
                        r = value.match(re);
                        if (r != null && r[0] !== value) {
                            callback(new Error('请输入数字和点'));
                        }
                    } else {
                        let array = value.split(".");
                        for (let i = 0; i < array.length; i++) {
                            let re = /^[0-9]*[1-9][0-9]*$/;
                            if (!re.test(array[i])) callback(new Error('请输入数字和点'));
                        }
                    }
                    callback();
                }
            };
            let checkInitBalance = (rule, value, callback) => {
                if (value === "") {
                    callback();
                } else {
                    let reg = /(^[0-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                    if (!reg.test(value)) {
                        return callback(new Error('请填写数字,最多2位小数'))
                    } else {
                        callback()
                    }
                }
            };
            return {
                openAddBtn: true,        //控制新建按钮是否显示
                modifyBtn: false,        //控制修改按钮是否显示
                delBtn: false,           //控制删除按钮是否显示
                submitBtn: false,        //控制提交按钮是否显示
                addSubmitBtn: false,     //控制新建提交按钮是否显示
                printBtn: true,          //控制打印按钮是否显示
                previewBtn: true,        //控制预览按钮是否显示
                disableBtn: false,       //控制禁用按钮是否显示
                cancelDisableBtn: false, //控制取消禁用按钮是否显示
                unDisableBtn: true,      //控制反禁用按钮是否显示
                closeUnDisablePageBtn: false, //关闭按钮
                company_Group: [],       //存储单位组数据
                meteringUnit_Group: [],  //存储计量单位数据
                cureenty: [],            //存储外币核算项数据
                disabled: true,          //控制表单是否只读
                specialDisabled: true,   //单位组和计量单位特殊控制
                allTreeId: '',           //点击的树节点及其父级树的节点id
                clickTreeId: '',         //当前点击的树节点id
                clickSubjectName: '',    //当前点击树节点的名称
                allId: '',               //当前点击树节点的id及其父级id
                classify: '',            //当前点击树节点上级节点名称
                treeData: '',            //树数据
                oldPzData: '',           //科目下存在凭证保存下来的数据
                pageStatus: '1',         //记录当前页面是在反禁用页面还是首页，0处于反禁用页面
                headerName: '科目设置',          //头部名称
                initialCode: '',         //新建，修改前的科目代码
                fullscreenLoading: false,
                currentPage4: 1,
                addRowData:{},
                delSure: false,
                confirmSure: false,
                treeOpenKey: [],        //需要展开的树节点数组
                labelPosition: 'left',   //改变表单域标签的位置
                rules: {                //验证
                    subjectCode: [
                        /*{ required: true, message: '科目代码不能为空', trigger: 'blur' },*/
                        { validator: checkSubjectCode, trigger: 'blur' }
                    ],
                    subjectName: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '请填写业务描述', trigger: 'blur' },
                    ],
                    initBalance: [
                        { validator: checkInitBalance, trigger: 'blur' },
                    ]
                },
                value:'',
                pageSize: 10,
                total: 0,
                balanceDirectionOptions: [
                    {
                        value: '借',
                        label: '借'
                    }, {
                        value: '贷',
                        label: '贷'
                    }
                ],
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
                tableData: [],
                tableDataChange: [],
                showLoading: true,
                showEditDiv: false,
                formInline: {
                    subjectCode: '',            //科目代码
                    subjectName: '',            //科目名称
                    description: '',            //业务描述
                    mnemonicCode: '',           //助记码
                    balanceDirection: '贷',      //余额方向
                    allName: '',                //全名
                    initBalance: '0.00',            //期初余额
                    meteringUnit_Group: '不计量',      //单位组
                    meteringUnit: '不计量',           //计量单位
                    foreignCurrencyHeSuan: '不核算',  //外币核算
                    qimoTiaoHui: '0',            //期末调汇
                    businessHeSuan: '0',         //业务来往核算
                    numSumAuxiliaryHeSuan: '0',  //数量金额辅助核算
                    cashEquivalent: '0',         //现金等价物
                    cashSubject: '0',            //现金科目
                    bankSubject: '0',            //银行科目
                    chuRiTally: '0',             //出日记账
                    itemAuxiliary: '0',          //项目辅助核算
                },
                testTreeData: [],
                zero: {
                    "id": "kemushezhi",
                    "parentId": "0000",
                    "text": "科目设置",
                    "leaf": "",
                    "companyId": "company41860418100001",
                    "checkable": "false",
                    "modleId": "kemushezhi",
                    "recordType": "subject",
                    "isdel": "",
                    "fileId": "kemushezhi"
                }
            }
        },
        beforeCreate() {
            console.log()
        },
        created() {
            this.init(1)
            this.searchMeasureUnitTree()
            this.searchCureenty()
        },
        methods: {
            //点击行回调
            rowClick(row, event, column) {
                this.initialState()
                /*setTimeout(() => {*/
                    this.showEditDiv = true //打开编辑页
                    this.formInline = row
                    this.initialCode = this.formInline.subjectCode
                    if (this.formInline.forbidden === '1') {
                        this.disableBtn = true
                    } else {
                        this.disableBtn = false
                        this.cancelDisableBtn = true
                    }
                if (this.pageStatus === '0') {
                    this.modifyBtn = false
                    this.delBtn = false
                } else {
                    this.modifyBtn = true
                    this.delBtn = true
                }
                    console.log(row)
                    console.log(event)
                    console.log(column)
                /*}, 1000);*/

            },
            init(forbidden) {
                this.initialState('init')
                let axios = this.$http
                let urls;
                //由于老接口无法传参数，暂时这样判断
                if (this.clickTreeId === '') {
                    urls = ['/ZingMH/ZDesk/subject/mater/selectSubject.action?forbidden=' + forbidden + '&offset=0&rows=10', '/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=subject&textKeys=1&forbidden=' + forbidden];
                } else {
                    urls = ['/ZingMH/ZDesk/subject/mater/selectSubject.action?forbidden=' + forbidden + '&offset=0&rows=10&parentId=' + this.clickTreeId, '/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=subject&textKeys=1&forbidden=' + forbidden];
                }
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct, perms) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        this.total = acct.data.data.data.length
                        this.tableDataChange = acct.data.data.data
                        this.tableData = acct.data.data.data.slice(0,this.pageSize)
                       /* if (this.clickTreeId === '') {*/
                            this.treeOpenKey = [this.clickTreeId]
                            console.log(this.treeOpenKey)
                            perms.data.data.data.data.push(this.zero)
                            this.arrayToTreeJsonFuc('parentId', 'fileId', 'children',perms.data.data.data.data)
                        /*}*/
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //改变每页显示条数
            handleSizeChange(val) {
                this.pageSize = val
                this.handleCurrentChange(1)
            },
            //查询单位组
            searchMeasureUnitTree() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=measureUnit'];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        this.company_Group = acct.data.data.data.data
                        /*let parentTreeIds = acct.data.data.data.data
                        for (let i = 0; i < parentTreeIds.length; i++) {
                            this.searchMeasureUnit(parentTreeIds[i].fileId)
                        }*/
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询计量单位
            searchMeasureUnit(parentTreeId) {
                this.meteringUnit_Group = []
                this.formInline.meteringUnit = ""
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/searchMeasureUnit.action?status=1&parentTreeId=' + parentTreeId];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        if (acct.data.data.data.total !== '0') {
                            for (let i = 0; i < acct.data.data.data.total; i++) {
                                if (acct.data.data.data.data[i].classesIsDefaut === "是") {
                                    this.formInline.meteringUnit = acct.data.data.data.data[i].measureUnitName
                                }
                                this.meteringUnit_Group.push(acct.data.data.data.data[i])
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
            //查询核算项
            searchCureenty() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/currenty/mater/searchCurrenty.action?status=1&parentId=bibieshezhi'];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        this.cureenty = acct.data.data.data.data
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询科目代码下是否存在凭证 type = 0 修改 type = 1 删除 type = 2 新建
            searchVoucher(subjectCode, type) {
                let axios = this.$http
                let urls
                urls = ['/ZingMH/ZDesk/subject/mater/selectPZBySubjectCode.action?subjectCode=' + subjectCode];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        this.showLoading = false;
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        if (acct.data.data.data === "0" && type === '0') {
                            this.disabled = false
                            this.isChecked()
                            this.modifyBtn = false
                            this.submitBtn = true
                            this.addSubmitBtn = false
                        } else if (acct.data.data.data === "0" && type === '1') {
                            this.deleteSubject()
                        } else if (acct.data.data.data === "0" && type === '2') {
                            this.addRow()
                        } else if (acct.data.data.data !== "0" && type === '2') {
                            this.openOtherAddRow(acct.data.data.data)
                        } else {
                            this.$message({ type: 'warning', message: '该科目代码下存在凭证，无法修改！' });
                            this.initialState()
                        }

                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询树节点是否存在
            searchTreeNode(fileId, data) {
                let axios = this.$http
                let urls;
                    urls = ['/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=subject&fileId=' + fileId];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        if (acct.data.data.data.total === '0') {
                            this.addTreeNde(data)
                        } else {
                            this.$message({ type: 'warning', message: '编码已存在！' });
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //查询科目代码是否存在
            treeNodeOrExits(forbidden, status) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/selectNodeOrExits.action?fileId=' + this.formInline.subjectCode];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        if (acct.data.data.total === "0") {
                            this.formInline.description = this.formInline.description.replace(/\s/g, "")
                            this.formInline.subjectName = this.formInline.subjectName.replace(/\s/g, "")
                            this.updateSubject(forbidden)
                        } else {
                            if (acct.data.data.data[0].subjectId === this.formInline.subjectId) {
                                this.updateSubject(forbidden)
                            } else {
                                this.$message({ type: 'warning', message: '科目代码已存在！' });
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
            //更新数据
            updateSubject(forbidden) {
                let url = "/zingbiz/finance/subject/update";
                this.formInline.forbidden = forbidden || '1'
                let subjectCodeScope = this.pointTranslation(this.formInline.subjectCodeScope)
                let initBalance = (this.formInline.initBalance * 1).toFixed(2)
                let params = {
                    allName: this.formInline.allName,
                    balanceDirection: this.formInline.balanceDirection,
                    companyId: this.formInline.companyId,
                    currenId: this.formInline.currenId,
                    description: this.formInline.description,
                    forbidden: this.formInline.forbidden,
                    foreignCurrencyHeSuan: this.formInline.foreignCurrencyHeSuan,
                    initBalance: initBalance,
                    measureId: this.formInline.measureId,
                    meteringUnit: this.formInline.meteringUnit,
                    meteringUnit_Group: this.formInline.meteringUnit_Group,
                    mnemonicCode: this.formInline.mnemonicCode,
                    subjectCategory: this.formInline.subjectCategory,
                    subjectCode: this.formInline.subjectCode,
                    subjectName: this.formInline.subjectName,
                    subjectId: this.formInline.subjectId,
                    subjectCodeScope: subjectCodeScope
                };
                //由于接口问题，调用拼串方法
                /*this.formInline.sortField = this.formInline.subjectId*/
                this.$http.post(url, params).then(data => {
                    try {
                        console.log(data)
                        if (data.data.success === false) {
                            this.$message({ type: 'warning', message: data.data.msg });
                            this.refresh()
                            return
                        }
                        if (data.forbidden === '0') {
                            this.openFullScreen2()
                            this.$message({ type: 'success', message: '禁用成功！' });
                            window.setTimeout(() => {
                                this.init(1)
                            }, 3000)
                        } else {
                            this.openFullScreen2()
                            this.$message({ type: 'success', message: '修改成功！' });
                            window.setTimeout(() => {
                                this.refresh()
                            }, 3000)
                        }
                    } catch (e) {
                        console.error("Exception initJSSDK " + e.message);
                    }
                });
            },
            //更新树节点数据
            /*updateTreeNodeBySubjectId(data) {
                let axios = this.$http
                let urls;
                //由于接口问题，调用拼串方法
                urls = ['/ZingMH/ZDesk/subject/mater/updateTreeNodeBySubjectId.action?subjectId=' + data.subjectId + "&text=" + data.subjectCode +
                "(" + data.subjectName + ")&filename=" + data.subjectName + "&fileId=" + data.subjectCode + "&modleId=" + data.subjectCode +
                "&description=" + data.description + "&description=" + data.description];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        if (data.forbidden === '0') {
                            this.$message({ type: 'success', message: '禁用成功！' });
                            window.setTimeout(() => {
                                this.init(1)
                            }, 3000)
                        } else {
                            this.$message({ type: 'success', message: '修改成功！' });
                            window.setTimeout(() => {
                                this.init(1)
                            }, 3000)
                        }

                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },*/
            //删除数据
            deleteSubject() {
                /*let axios = this.$http*/
                let url = "/zingbiz/finance/subject/delSubject.action";
                let params = {
                    subjectId: this.formInline.subjectId
                };
                //由于接口问题，调用拼串方法
                /*this.formInline.sortField = this.formInline.subjectId*/
                this.$http.post(url, params).then(data => {
                    try {
                        if (data.data.success === false) {
                            this.$message({ type: 'warning', message: data.data.msg });
                            this.cancelDels()
                            return
                        }
                        this.openFullScreen2()
                        this.$message({ type: 'success', message: '删除成功！' });
                        window.setTimeout(() => {
                            this.delSure = false;
                            this.init(1)
                            this.initialState()
                            this.delBtn = false
                            this.disableBtn = false
                            this.modifyBtn = false
                        }, 3000)
                    } catch (e) {
                        console.error("Exception initJSSDK " + e.message);
                    }
                });
                /*let str = this.pinChuan(this.formInline)*/
                /*urls = ['/zingbiz/finance/subject/delSubject.action?subjectId' + this.formInline.subjectId];
                let requests = urls.map(makeRequest);*/
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                /*function makeRequest(url) {
                    return axios.get(url);
                }*/
                /*axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        this.$message({ type: 'success', message: '删除成功！' });
                        window.setTimeout(() => {
                            this.delSure = false;
                            this.init(1)
                            this.initialState()
                            this.delBtn = false
                            this.disableBtn = false
                            this.modifyBtn = false
                        }, 3000)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });*/
            },
            //删除树节点数据
            /*deleteTreeNodeBySubjectId(subjectId) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/deleteTreeNodeBySubjectId.action?sortField=' + subjectId];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        this.$message({ type: 'success', message: '删除成功！' });
                        this.delSure = false;
                        this.init(1)
                        this.initialState()
                        this.delBtn = false
                        this.disableBtn = false
                        this.modifyBtn = false
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },*/
            //翻页操作
            handleCurrentChange(val) {
                this.initialState()
                let num = (val - 1) * 10
                this.tableData = this.tableDataChange.slice(num,num + this.pageSize)
            },
            isChecked() {
                if (this.formInline.numSumAuxiliaryHeSuan === "1") {
                    this.specialDisabled = false
                } else {
                    this.specialDisabled = true
                }
            },
            //反禁用
            unDisable() {
                let forbidden = 0
                document.getElementById("headerName").innerText = "科目设置---反禁用"
                this.unDisableBtn = false
                this.pageStatus = '0'
                this.closeUnDisablePageBtn = true
                this.init(forbidden)
            },
            //刷新
            refresh() {
                this.init(this.pageStatus)
                if (this.treeData === "" || this.treeData.indeterminate.level <= 2) {
                    this.openAddBtn = false
                    this.submitBtn = false
                    this.addSubmitBtn = false
                } else {
                    this.openAddBtn = true
                }
            },
            //关闭反禁用页面
            closeUnDisablePage() {
                document.getElementById("headerName").innerText = this.headerName
                this.pageStatus = '1'
                this.closeUnDisablePageBtn = false
                this.unDisableBtn = true
                this.init(1)
                if (this.treeData === "" || this.treeData.indeterminate.level <= 2) {
                    this.openAddBtn = false
                    this.submitBtn = false
                    this.addSubmitBtn = false
                } else {
                    this.openAddBtn = true
                }
            },
            //新建
            openAdd() {
                this.initialState('add')
                console.log()
            },
            //修改
            modify(formInline) {
                let subjectCode = formInline.subjectCode
                this.searchVoucher(subjectCode,'0')
            },
            //删除
            del() {
                this.searchVoucher(this.formInline.subjectCode,'1')

              console.log()
            },
            //删除弹框
            delConfirm() {
                this.delSure = true;
            },
            //提交
            submit(formInline) {
                for (let val in this.cureenty) {
                    if (this.formInline.foreignCurrencyHeSuan === this.cureenty[val].currencyId) {
                        this.formInline.currenId = this.formInline.foreignCurrencyHeSuan
                        this.formInline.foreignCurrencyHeSuan = this.cureenty[val].currencyName
                    }
                }
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.treeNodeOrExits()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新建提交
            addSubmit(formInline) {
                this.$refs[formInline].validate((valid) => {
                    if (valid) {
                        this.formInline.subjectName = this.formInline.subjectName.replace(/\s/g, "")
                        this.formInline.description = this.formInline.description.replace(/\s/g, "")
                        if (this.formInline.numSumAuxiliaryHeSuan === '1') {
                            if (this.formInline.meteringUnit_Group === "无") {
                                this.$message({ type: 'warning', message: '请选择单位组！' });
                                return false;
                            }
                            if (this.formInline.meteringUnit === "无") {
                                this.$message({ type: 'warning', message: '请选择缺省计量单位！' });
                                return false;
                            }
                        }
                        let subjectCode = this.treeData.data.sortField
                        this.searchVoucher(subjectCode, '2')
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //添加数据
            addRow() {
                let axios = this.$http
                let urls;
                let subject = this.addForm(this.formInline)
                console.log(subject)
                let treeNode = this.treeNode(this.formInline)
                this.addRowData = {
                    "subject": subject,
                    "treeNode": treeNode
                };
                let addRowData_Temp = JSON.stringify(this.addRowData);
                console.log(addRowData_Temp)
                urls = ['/ZingMH/ZDesk/subject/mater/addRow.action?data=' + addRowData_Temp];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据-------
                        if (acct.data.mgs === "dataExits") {
                            this.openFullScreen2()
                            this.$message({ type: 'warning', message: '科目代码已存在！' });
                            return false;
                        } else {
                            this.openFullScreen2()
                            this.$message({ type: 'success', message: '添加成功！' });
                            window.setTimeout(() => {
                                this.init(1)
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
            openOtherAddRow(data) {
                this.oldPzData = data
                this.confirmSure = true;
            },
            //新建数据的另一种情况
            otherAddRow() {
                this.addRowData.pzData = this.updatePZForm(this.oldPzData, this.formInline);
                let addRowData_Temp = JSON.stringify(this.addRowData);
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/addRow.action?data=' + addRowData_Temp];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据-------
                        if (acct.data.mgs === "dataExits") {
                            this.$message({ type: 'warning', message: '科目代码已存在！' });
                            return false;
                        } else {
                            this.openFullScreen2()
                            this.$message({ type: 'success', message: '添加成功！' });
                            setTimeout (this.init(1),3000)
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            addForm(data) {
                let formData = data;
                let str = '';
                let db = this.treeData.indeterminate;
                let classify = ''
                for (;;) {
                    if (db.parent === null) {
                        break;
                    } else {
                        str = str + ' ' + db.data.fileId;
                        classify = classify + ' ' + db.data.text;
                    }
                    db = db.parent;
                }
                str = String.trim(str);// 去掉多余的空格
                let allId = str
                let classifyTemporary = String.trim(classify).split(" ") //临时存储classify
                classify = classifyTemporary[classifyTemporary.length - 2]
                formData.subjectCategory = classifyTemporary[classifyTemporary.length - 3]
                formData.financeLevel = this.treeData.indeterminate.level - 3 + ""
                if (isNaN(formData.initBalance)) {
                    formData.initBalance = 0.00
                }
                formData.initBalance = (Number(formData.initBalance) * 1).toFixed(2);
                formData.subjectCodeScope = this.pointTranslation(data.subjectCode);
                formData.parentId = allId;
                formData.forbidden = "1";
                formData.financeClassify = classify.trim(classify);
                return formData;
            },
            treeNode(data) {
                let treeNodeData = {
                    text: data.subjectCode + "(" + data.subjectName + ")",
                    modleId: data.subjectCode,
                    leaf: "",
                    recordType: "subject",
                    checkable: "false",
                    isdel: '',
                    parentId: this.treeData.data.fileId,
                    fileId: data.subjectCode,
                    level: this.treeData.indeterminate.level - 3 + "",
                    filename: data.subjectName,
                    description: data.description
                };
                return treeNodeData;
            },
            updatePZForm(data, newData) {
                let updatePZForm = {};
                for (let prop in data) {
                    if (!data.hasOwnProperty(prop)) continue;
                    switch (prop) {
                        case "pzitem":
                            let temp = [];
                            for (let i = 0; i < data['pzitem'].length; i++) {
                                let tempObject = {
                                    rowId: data["pzitem"][i].rowId,
                                    projectPath: data["pzitem"][i].projectPath + "/" + this.treeData.data.text,
                                    projectName: newData.subjectName,
                                    projectId: newData.subjectCode,
                                    pzServiceDesc: newData.description
                                };
                                temp.push(tempObject);
                            }
                            updatePZForm.pzitem = temp;
                            break;
                        case "pzitemfb":
                            let temp1 = [];
                            for (let i = 0; i < data['pzitemfb'].length; i++) {

                                let tempObject = {
                                    rowId: data["pzitemfb"][i].rowId,
                                    projectPath: data["pzitemfb"][i].projectPath + "/" + this.treeData.data.text,
                                    projectName: newData.subjectName,
                                    projectId: newData.subjectCode,
                                    pzServiceDesc: newData.description
                                };
                                temp1.push(tempObject);
                            }
                            updatePZForm.pzitemfb = temp1;
                            break;
                        case "pzinfo":
                            let temp2 = [];
                            for (let i = 0; i < data['pzinfo'].length; i++) {
                                let tempObject = {
                                    rowId: data["pzinfo"][i].rowId,
                                    ckProjectId: newData.subjectCode,
                                    ckProjectName: newData.subjectName
                                };

                                temp2.push(tempObject);
                            }
                            updatePZForm.pzinfo = temp2;
                            break;
                        case "pzinfofb":
                            let temp3 = [];
                            for (let i = 0; i < data['pzinfofb'].length; i++) {
                                let tempObject = {
                                    rowId: data["pzinfofb"][i].rowId,
                                    ckProjectId: newData.subjectCode,
                                    ckProjectName: newData.subjectName,
                                    reSubmitTime: this.time()
                                };
                                temp3.push(tempObject);
                            }
                            updatePZForm.pzinfofb = temp3;
                            console.log(updatePZForm)
                            break;
                        case "info":
                            let temp4 = [];
                            for (let i = 0; i < data['info'].length; i++) {
                                let tempObject = {
                                    rowId: data["info"][i].rowId,
                                    ckProjectId: newData.subjectCode,
                                    ckProjectName: newData.subjectName,
                                    ckProjectPath: data["info"][i].ckProjectPath + "/" + this.treeData.data.text
                                };
                                temp4.push(tempObject);
                            }
                            updatePZForm.info = temp4;
                            break;
                        case "product":
                            let temp5 = [];
                            for (let i = 0; i < data['product'].length; i++) {
                                let tempObject = {
                                    'rowId': data["product"][i].rowId,
                                    'productProjectCode': newData.subjectCode,
                                    'productProjectName': newData.subjectName,
                                    'productProjectPath': data["product"][i].productProjectPath + "/" + this.treeData.data.text,
                                    'productProjectDesc': newData.description
                                };

                                temp5.push(tempObject);
                            }

                            updatePZForm.product = temp5;
                            break;
                    }
                }
                return updatePZForm;
            },
            //subjectCode去除第一位以外的小数点
            pointTranslation(data) {
                let temp = data.split('.');
                let temp1 = '';
                if (data.indexOf(".") === -1) {
                    temp1 = data;
                }
                else {
                    for (let i = 0; i < temp.length; i++) {
                        if (i === 0) {
                            temp[0] = temp[0] + '.';
                        }
                        temp1 += temp[i];
                    }
                }
                return temp1;
            },
            time() {
                var time = ""
                var mydata =  new Date()
                var mouth = (mydata.getMonth() + 1) >= 10 ? (mydata.getMonth() + 1) : ('0' + (mydata.getMonth() + 1));
                var day = mydata.getDate() >= 10 ? mydata.getDate() : ('0' + mydata.getDate());
                var h = mydata.getHours() < 10 ? ('0' + mydata.getHours()) : mydata.getHours();
                var minute = mydata.getMinutes() < 10 ? ('0' + mydata.getMinutes()) : mydata.getMinutes();
                var second = mydata.getSeconds() < 10 ? ('0' + mydata.getSeconds()) : mydata.getSeconds();
                time += mydata.getFullYear() + '-' + mouth + "-" + day + ' ' + h + ':' + minute + ':' + second
                return time; // 返回日期。
            },
            //添加关闭弹窗
            cancelDel() {
                this.confirmSure = false;
                this.$message({ type: 'success', message: '创建失败！' });
            },
            //关闭删除弹框
            cancelDels() {
                this.delSure = false;
            },
            //打印
            print() {
                console.log()
            },
            //预览
            preview() {
                console.log()
            },
            //禁用
            disable() {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/selectSubject.action?forbidden=1&parentId=' + this.formInline.subjectCode];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        console.log(acct.data.data.total)
                        if (acct.data.data.total !== "0") {
                            this.$message({ type: 'warning', message: '科目下设有明细科目！' });
                        } else {
                            this.treeNodeOrExits("0")
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //取消禁用
            cancelDisable() {
                let axios = this.$http
                let urls;
                let parentStatus;
                urls = ['/ZingMH/ZDesk/subject/mater/searchParentStatus.action?subjectId=' + encodeURIComponent(this.formInline.subjectId)];
                let requests = urls.map(makeRequest);

                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }

                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        //this.tableData = acct.data.data
                        //acct.data.data.total === "0" ? parentStatus = "1" : parentStatus = acct.data.data[0].forbidden;
                        if (acct.data.data.total === "0") {
                            parentStatus = '1'
                        } else {
                            parentStatus = acct.data.data.data[0].forbidden
                            //this.treeNodeOrExits("0")
                        }
                        if (parentStatus !== "1") {
                            this.$message({ type: 'warning', message: '还请将上级科目取消禁用后，再取消禁用该科目！' });
                        } else {
                            this.treeNodeOrExits('1')
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            handleNodeClick(data) { // 点击树节点回调)
                console.log(data)
                this.pageStatus = '1'
                this.closeUnDisablePageBtn = false
                this.unDisableBtn = true
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
                this.treeData = data
                this.clickTreeId = data.data.fileId
                this.clickSubjectName = data.data.text
                this.init(1)
                if (data.indeterminate.level <= 2) {
                    this.openAddBtn = false
                    this.submitBtn = false
                    this.addSubmitBtn = false
                } else {
                    this.openAddBtn = true
                }
            },
            //添加树节点
            addTreeNde(data) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/addTreeNode.action?text=' + data.name + '&modleId=' + data.code + '&fileId='
                + data.code + '&leaf=&recordType=subject&isdel=true&parentId=' + this.clickTreeId];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        console.log(acct)
                        window.setTimeout(() => {
                            this.$refs.tree.add()  //服务端返回success 调用edit
                        }, 500)
                        /*this.$message({ type: 'success', message: '添加分类成功！' });*/
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            editCallback(data) { // 此处调用服务端各个模块update接口
                console.log(this.clickTreeId)
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/updateTreeNode.action?text=' + data.name + '&id=' + this.clickTreeId];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        console.log(acct)
                        window.setTimeout(() => {
                            this.$refs.tree.edit()  //服务端返回success 调用edit
                        }, 500)
                        /*this.$message({ type: 'success', message: '添加分类成功！' });*/
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            addCallback(data) { // 此处调用服务端各个模块update接口
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/selectNodeOrExits.action?fileId=' + data.code];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        if (acct.data.data.total === '0') {
                            this.searchTreeNode(data.code, data)
                        } else {
                            this.$message({ type: 'warning', message: '编码已存在！' });
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            delCallback(data) { // 此处调用服务端各个模块update接口
                console.log(data.fileId)
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/subject/mater/selectSubject.action?parentId=' + data.fileId];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        if (acct.data.data.total === '0') {
                            this.delTreeNode(data)
                        } else {
                            this.$message({ type: 'warning', message: '该节点下存在数据，无法删除！' });
                        }
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            //删除树节点
            delTreeNode(data) {
                let axios = this.$http
                let urls;
                urls = ['/ZingMH/ZDesk/measureUnit/mater/delTreeNode.action?treeId=' + data.fileId];
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    return axios.get(url);
                }
                axios.all(requests)
                    .then(axios.spread((acct) => {
                        //---------真实数据--------
                        window.setTimeout(() => {
                            this.$refs.tree.delete()  //服务端返回success 调用edit
                        }, 500)
                    })).catch(error => {
                    this.showLoading = false;
                    this.$message({
                        type: "error",
                        message: "请求数据失败，请刷新重试"
                    });
                });
            },
            currentPage(val) {
                console.log(val);
                this.pageNumber = val;
                this.showLoading = true;
                this.initData();
            },
            //拼串
            pinChuan(data) {
                let str = ""
                for (let key in data) {
                    str += key + "=" + encodeURIComponent(data[key]) + "&";
                }
                return str
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
            //初始化状态
            initialState(type) {
                /*this.company_Group = []
                this.meteringUnit_Group = []
                this.cureenty = []*/
                this.formInline = {
                    subjectCode: '',            //科目代码
                    subjectName: '',            //科目名称
                    description: '',            //业务描述
                    mnemonicCode: '',           //助记码
                    balanceDirection: '贷',      //余额方向
                    allName: '',                //全名
                    initBalance: '0.00',            //期初余额
                    meteringUnit_Group: '无',      //单位组
                    meteringUnit: '无',           //计量单位
                    foreignCurrencyHeSuan: '不核算',  //外币核算
                    qimoTiaoHui: '0',            //期末调汇
                    businessHeSuan: '0',         //业务来往核算
                    numSumAuxiliaryHeSuan: '0',  //数量金额辅助核算
                    cashEquivalent: '0',         //现金等价物
                    cashSubject: '0',            //现金科目
                    bankSubject: '0',            //银行科目
                    chuRiTally: '0',             //出日记账
                    itemAuxiliary: '0',          //项目辅助核算
                }
                if (type === 'add') {
                    let db = this.treeData.indeterminate;
                    console.log(this.treeData)
                    let str = ''
                    for (;;) {
                        if (db.parent === null) {
                            break;
                        } else {
                            str = str + ' ' + db.data.fileId;
                        }
                        db = db.parent;
                    }
                    str = str.split(" ")[str.split(" ").length - 2]
                    if (str === 'zichan' || str === "chengben" || str === "sunyi" || str === "gongtong" || str === "biaowai") {
                        this.formInline.balanceDirection = "借"
                    } else {
                        this.formInline.balanceDirection = "贷"
                    }
                    if (this.treeData.data.level != null) {
                        this.formInline.subjectCode = this.treeData.data.fileId + '.'
                    }
                    this.showEditDiv = false
                    this.submitBtn = false
                    this.showEditDiv = true
                    this.disabled = false
                    this.addSubmitBtn = true
                } else if (type === 'init') {
                    this.tableData = []
                    this.openAddBtn = false
                    this.modifyBtn = false
                    this.delBtn = false
                    this.submitBtn = false
                    this.addSubmitBtn = false
                    this.disableBtn = false
                    this.cancelDisableBtn = false
                    this.showEditDiv = false
                    if (this.pageStatus === '0') {
                        this.unDisableBtn = false
                    } else {
                        this.unDisableBtn = true
                    }
                } else {
                    this.disabled = true
                    this.showEditDiv = false
                    this.submitBtn = false
                    this.addSubmitBtn = false
                }

            },
            //由于后台返回数据非树结构所需格式，此方法为格式转换
            arrayToTreeJsonFuc(prIndex, index, home, db) {
                let allPrIndexData = {}; // 所有集合+上级索引, key = prIndex / value = [db[n],db[x].........]
                let tree = []; // 树
                let j = 0;
                for (let i = 0; i < db.length; i++) { // 第一次生成zo数据
                    //db[i].label = db[i].text;
                    let t = db[i]; // 一个数据单位
                    let prValue = db[i][prIndex];
                    if (prValue === '0000') { // 我是顶级节点
                        tree.push(t);
                    } else {
                        let ts = allPrIndexData[prValue]; // 上级的孩子们
                        if (ts == null) {
                            ts = [];
                            allPrIndexData[prValue] = ts; // 上级没孩子 给孩子创建临时居所
                        }
                        ts.push(t);// 孩子会和
                    }
                }
                for (let i = 0; i < db.length; i++) { // 第二次组装数据
                    let t = db[i]; // 一个数据单位
                    let value = db[i][index]; // index （key）
                    if (isNaN(value) && (value === 'zichan' || value === 'fuzhai' || value === 'gongtong' || value === 'quanyi'
                            || value === 'chengben' || value === 'sunyi' || value === 'biaowai')) {
                        t.addAuto = 'true'
                    } else {
                        if (db[i].level == null && value !== 'kemushezhi') {
                            t.editAuto = 'true'
                        }
                    }
                    j++;
                    let ts = allPrIndexData[value]; // 我的孩子
                    if (ts != null) {
                        t[home] = ts; //回家
                    }
                }
                this.testTreeData = tree;
            }
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
