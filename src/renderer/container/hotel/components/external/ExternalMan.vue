<template>
    <el-dialog :title="title" :visible.sync="visible" width="50%" :append-to-body="append">
        <div class="main">
            <el-row>
                <el-col :span="7">
                    <el-input clearable v-model="search_text" @keyup.enter.native="loadExternalMan" placeholder="查询: 姓名,电话" size="small" suffix-icon="el-icon-search"></el-input>
                </el-col>
                <el-col :span="3">
                    &nbsp;<el-button type="primary" size="small" @click="loadExternalMan">搜索</el-button>
                </el-col>
                <el-col :span="3" :offset="11">
                    <el-button type="primary" size="small" @click="openAddMan">添加</el-button>
                </el-col>
            </el-row>
            <div class="selected-man">已选：
                <el-tag v-for="(tag,index) in selectedData" :key="index" closable @close="closeTag(tag,index)">{{tag.contactsName}}
                </el-tag>
            </div>

            <!--1.多选 目前单多选使用两个列表分开了,避免事件冲突  -->
            <el-table v-show="isMultiple" ref="multiTable" v-loading="loading" :data="externalData" style="width: 100%">
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-checkbox :disabled="isDisabled(scope.row)" :checked="formatChecked(scope.row)" @change="changeSelectBox($event,scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <!--<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>-->

                <el-table-column label="姓名" prop="contactsName"></el-table-column>
                <el-table-column label="联系方式" prop="telPhone"></el-table-column>
                <el-table-column label="证件类型" prop="idCardType"></el-table-column>
                <el-table-column label="证件号" prop="idCard"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="openEditMan(scope.row)" size="mini" type="text">编辑</el-button>
                        <el-button @click="removeMan(scope.$index,scope.row)" size="mini" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="isMultiple" class="p10 right">
                <el-pagination background @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" layout="prev, pager, next" :total="total"></el-pagination>
            </div>

            <!--2.单选-->
            <el-table v-show="!isMultiple" ref="unMultiTable" v-loading="loading" :data="externalData" style="width: 100%">
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio class="radio" :disabled="isDisabled(scope.row)" @change="radioSelect($event,scope.row)" v-model="radio" :id="scope.row.contactsId" :label="scope.row.contactsId">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="contactsName"></el-table-column>
                <el-table-column label="联系方式" prop="telPhone"></el-table-column>
                <el-table-column label="证件类型" prop="idCardType"></el-table-column>
                <el-table-column label="证件号" prop="idCard"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="openEditMan(scope.row)" size="mini" type="text">编辑</el-button>
                        <el-button @click="removeMan(scope.$index,scope.row)" size="mini" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!isMultiple" class="p10 right">
                <el-pagination background @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" layout="prev, pager, next" :total="total"></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer p10">
                <el-button @click="cancelSelect">取 消</el-button>
                <el-button type="primary" @click="confirmSelect">确 定</el-button>
            </div>
        </div>
        <!--引用组件集合-->
        <div class="components">
            <external-man-add :append="true" :title="externalTitle" :show="externalAddShow"
                              :form="targetPerson" @cancel="externalAddShow=false" @callback="closeExterlAdd">
            </external-man-add>
        </div>
    </el-dialog>
</template>
<script>
    import ExternalManAdd from "./ExternalManAdd";
    export default {
        name: "ExternalMan",
        components: {
            ExternalManAdd
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            append: {
                type: Boolean,
                default: true
            },
            multiline: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: "选择外联人"
            },
            tags: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            //不可选择的人的id集合
            disabledMan:{
                type: Array,
                default: function () {
                    return [];
                }
            },
        },
        data() {
            return {
                externalData: [],       //init数据列表
                pageNumber: 1,
                pageSize: 15,
                total: 0,
                loading: false,
                search_text: "",        //搜索关键词
                isMultiple: true,       //是否多选
                visible:false,          //组件可见性
                selectedData: [],       //组件内已选择的外联人数组
                radio:'',               //单选的target
                externalAddShow: false,
                targetPerson: {},       //编辑的目标外联人对象
                externalTitle: "",      //"添加/编辑外联人title",
                firstPageData:[],       //保存第一页数据
            };
        },
        watch: {
            //监听组件可见性,当点击"X"关闭组件时,触发cancelSelect()方法,重置组件数据
            visible: function () {
                if (!this.visible) {
                    this.resetComponent();
                    this.cancelSelect();
                }
            },
            //监听外部变量的变化,控制可见性
            show:function (isShow) {
                this.visible = isShow;
                this.isMultiple = this.multiline;
                //打开时初始化tag已选数据  //关闭时重置
                if (isShow) {
                    if (this.firstPageData.length) {
                        this.externalData = this.firstPageData.concat();
                        this.loadExternalMan();
                    } else {
                        this.loadExternalMan();
                    }
                    this.initTag();
                } else {
                    this.resetComponent();
                }
            },
        },
        created() {
            this.loadExternalMan();
        },
        methods: {
            //打开时初始化tag标签
            initTag() {
                this.selectedData = this.tags.concat();     //组件内使用传进数据的副本
                if (this.selectedData.length) {
                    //初始化勾选----如是单选,把id赋给radio即可,多选使用formatChecked方法设置
                    if (!this.isMultiple) {
                        this.radio = this.selectedData[0].contactsId;
                    }
                }
            },
            //关闭时重置,置空内部数据,恢复第一页
            resetComponent() {
                this.externalData = [];
                this.radio = "";
                this.search_text = "";
                this.pageNumber = 1;
                this.selectedData = [];
            },
            //多选时的数据的格式化checked
            formatChecked(row) {
                let flag = false;
                this.selectedData.forEach((val,index) => {
                    if (val.contactsId === row.contactsId) {
                        flag = true;
                    }
                });
                return flag;
            },
            //是否可选 过滤
            isDisabled(row) {
                if (this.disabledMan.indexOf(row.contactsId) === -1) {
                    return false;
                }
                return true;
            },
            //加载外联人数据
            loadExternalMan() {
                let self = this;
                let param = {
                    pageNumber: self.pageNumber,
                    pageSize: self.pageSize,
                };
                //条件查询
                if (self.search_text) {
                    if (!Number.isNaN(Number(self.search_text))) {
                        param['telPhone'] = self.search_text;
                    } else {
                        param['contactsName'] = self.search_text
                    }
                }
                this.loading = true;
                let externalUrl = "/zingbiz/hotel/hotelNew/getContactsList";
                self.$httpSilent
                    .get(externalUrl, { params :param })
                    .then(res => {
                        self.loading = false;
                        if (res.data.success) {
                            self.externalData = res.data.data.data;
                            self.total = parseInt(res.data.data.total);
                            if (self.pageNumber === 1) {
                                self.firstPageData = res.data.data.data;
                            }
                        } else {
                            self.$message({ type: "error", message: "请求数据失败,请刷新重试" });
                        }
                });
            },
            //行点击事件,---todo 由于没找到设置勾选checkbox的方法,暂时不用
            rowClick(row, event, column) {
                let tag = false;    //判断是否已存在
                let num = 0;        //所在的索引
                this.selectedData.forEach((val,index) => {
                    if (val.contactsId === row.contactsId) {
                        tag = true;
                        num = index;
                    }
                });
                if (!tag) {
                    this.selectedData.push(row);
                }
                if (tag) {
                    this.selectedData.splice(num,1);
                }
            },
            changeSelectBox(flag,item) {
                let tag = false;    //判断是否已存在
                let num = 0;        //所在的索引
                this.selectedData.forEach((val,index) => {
                    if (val.contactsId === item.contactsId) {
                        tag = true;
                        num = index;
                    }
                });
                if (flag) {
                    if (!tag) this.selectedData.push(item);
                } else {
                    if (tag) this.selectedData.splice(num,1);
                }
            },
            //单选
            radioSelect(cur,row) {
                //改成row-click时
                this.radio = cur;
                this.selectedData = [row];

                //多选时,点击下一页有时会触发单选事件,先return
                // if (this.isMultiple) return;
                // if (cur) {
                //     this.selectedData = [cur];
                //     this.radio = cur.contactsId;     //点击行时设置radio选中,只需把contactsId赋值给radio即可实现,
                // }
            },
            //关闭添加外联人窗口
            closeExterlAdd() {
                this.externalAddShow = false;
                this.loadExternalMan();
            },
            //删除标签方法
            closeTag(tag, index) {
                this.selectedData.splice(index, 1);
                this.radio = "";
            },
            //取消按钮
            cancelSelect() {
                this.$emit("cancel");
            },
            confirmSelect() {
                this.$emit("callback", this.selectedData.concat());
            },
            //分页
            handleCurrentChange(val) {
                console.log(val,"1111111")
                this.externalData = [];     //todo 目前换页时清空table数据,可以让列表重新渲染,以便初始checkbox勾选,还没找到好的勾选方式
                this.pageNumber = val;
                this.loadExternalMan();
            },
            //打开编辑外联人页面
            openEditMan(row) {
                this.targetPerson = Object.assign({}, row);  //编辑时启用副本数据
                this.externalTitle = "编辑外联人";
                this.externalAddShow = true;
            },
            //打开添加外联人
            openAddMan() {
                this.targetPerson = {};
                this.externalTitle = "添加外联人";
                this.externalAddShow = true;
            },
            //删除外联人
            removeMan(index, row) {
                let self = this;
                this.$confirm("是否要删除此外联人?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.loading = true;
                        let url = "/zingbiz/hotel/hotelNew/delContactsById";
                        let param = { contactsId: row.contactsId };
                        self.$httpSilent
                            .get(url, { params :param })
                            .then(res => {
                                this.loading = false;
                                if (res.data.success) {
                                    self.$message({ type: "success", message: "删除成功!" });
                                    self.loadExternalMan();
                                } else {
                                    self.$message({ type: "info", message: "删除异常，请重试" });
                                }
                        });
                    })
                    .catch(e => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
        }
    };
</script>
<style scoped>
    .p10{
        padding: 10px;
    }
    .right{
        float: right;
    }
</style>


