<template>
    <el-container>
        <el-main class="flex-column">
            <div class="flex-between">
                <span>
                    <el-button type="primary" @click="addPayClass" size="small">新建</el-button>
                </span>
                <span>
                    <el-form label-width="80px" :inline="true" label-position="right" size="small">
                        <el-form-item>
                            <el-input v-model="searchText" clearable placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item size="small">
                            <el-button type="primary el-button--small" @click="search" size="small">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </span>
            </div>
            <div style="height: 100%">
                <el-table :data="channelData" border style="width: 100%" height="100%" v-loading="showLoading">
                    <el-table-column prop="serialNo" label="序号" width="100"></el-table-column>
                    <el-table-column prop="configValue" label="描述"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="editTheOne(scope.index,scope.row)" type="text" size="small">修改</el-button>
                            <el-button @click="deleteTheOne(scope.$index,scope.row)" type="text" size="small">删除
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
                               :total="total">
                </el-pagination>
            </div>
        </el-main>
        <div class="dialog">
            <el-dialog :title="title" :visible.sync="addConfigModal" >
                <el-form :model="channelConfigForm" :rules="rules" ref="channelConfigForm" label-width="100px">
                    <el-input type="hidden" v-model="channelConfigForm.configCode"></el-input>
                    <el-form-item label="序号" prop="serialNo">
                        <el-input v-model="channelConfigForm.serialNo" min="0" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="configValue">
                        <el-input v-model="channelConfigForm.configValue"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('channelConfigForm')">提交</el-button>
                    <el-button @click="addConfigModal = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </el-container>
</template>
<script>
    export default {
        name: "ChannelConfig",
        components:{ },
        data() {
            return {
                searchText:"",
                pageNumber:1,
                total:null,
                showLoading:false,
                channelData:[],
                pageSize: 30,
                value: 30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                title:"新建",
                channelConfigForm:{
                    configCode:"107",   //渠道的配置代码(固定)
                },
                addConfigModal:false,
                rules:{
                    serialNo:[{ required: true, message: '请输入序号', trigger: 'blur' }],
                    configValue:[{ required: true, message: '请输入描述信息', trigger: 'blur' }],
                },
                loadingInstance : null, //loading实例
            }
        },
        created() {
            this.initData();
        },
        methods:{
            initData() {
                let self = this;
                let queryParam = {
                    configCode:"107",
                    pageNumber: self.pageNumber,
                    pageSize : self.pageSize,
                };
                if (this.searchText) {
                    queryParam.keyword = this.searchText;
                }
                let url = "/zingbiz/hotel/hotelNew/getHotelConfig";
                this.showLoading = true;
                self.$httpSilent
                    .get(url, { params:queryParam })
                    .then(res => {
                        self.showLoading = false;
                        if (res.data.success) {
                            self.channelData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                        }
                    }).catch(error => {
                    self.showLoading = false;
                    this.$message({ type: "error", message: "请求数据失败，请刷新重试" });
                });
            },
            addPayClass() {
                this.title = "新建";
                this.channelConfigForm = {
                    configCode:"107",   //渠道的配置代码(固定)
                };
                this.addConfigModal = true;
            },
            editTheOne(index,row) {
                this.title = "编辑";
                this.channelConfigForm = Object.assign({},row);
                this.addConfigModal = true;
            },
            submitForm(ref) {
                let self = this;
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotel/hotelNew/saveHotelConfig";
                        let params = this.channelConfigForm;

                        self.$httpSilent
                            .post(url, params)
                            .then(res => {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.addConfigModal = false;
                                    self.$message({ type: "success", message: "保存成功" });
                                    self.initData();
                                } else {
                                    self.$message({ type: "error", message: "保存失败，请重试" });
                                }
                            }).catch(error => {
                            self.loadingInstance.close();
                            self.$message({ type: "error", message: "保存失败，请重试" });
                        });
                    }
                });
            },
            deleteTheOne(index,row) {
                let self = this;
                this.$confirm("确定删除吗？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteUrl = "/zingbiz/hotel/hotelNew/delOtherConfig";
                    self.loadingInstance = self.$loading({});
                    self.$httpSilent
                        .get(deleteUrl, { params : { rowId:row.rowId }})
                        .then(res => {
                            self.loadingInstance.close();
                            if (res.data.success) {
                                self.$message({ type: "success", message: "删除成功!" });
                                self.initData();
                            } else {
                                self.$message({ type: "warning", message: "删除失败!" });
                            }
                        }).catch(error => {
                        self.loadingInstance.close();
                        self.$message({ type: "warning", message: "删除失败!" });
                    });
                });
            },
            search() {
                this.initData();
            },
            changePageNumber(val) {
                this.pageNumber = val;
                this.initData();
            }
        }
    }
</script>
<style scoped lang="stylus">

</style>
