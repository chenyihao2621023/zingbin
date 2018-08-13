<template>
    <el-dialog title="会员" :visible.sync="visible" width="60%" append-to-body>
        <div class="vipHeader">
            <span class="checkBox">筛选:
                <el-checkbox class="checkSelect" v-model="checkAll" :indeterminate="isIndeterminate" @change="selectedAllGrade">全部</el-checkbox>
                <el-checkbox-group class="checkSelect" v-model="checkVal" @change="selectedGrade" style="display: inline-block;margin-left: 10px">
                    <el-checkbox v-for="(item,index) in vipGrade" :label="item" :key="index">lv {{item}}</el-checkbox>
                </el-checkbox-group>
            </span>
            <span>
                <el-input placeholder="请输入内容" v-model="selectVal" clearable class="input-with-select" size="small">
                    <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px">
                        <el-option label="会员名称" value="1"></el-option>
                        <el-option label="会员手机" value="2"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="searchVip"></el-button>
                </el-input>
            </span>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column width="50">
                <template slot-scope="scope">
                    <el-radio class="radio" @change="radioSelect($event,scope.row)" v-model="radio" :id="scope.row.contactsId" :label="scope.row.contactsId">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="useName" label="会员名称" width="180"></el-table-column>
            <el-table-column prop="memberId" label="会员卡ID" width="180"></el-table-column>
            <el-table-column prop="memberName" label="会员等级"></el-table-column>
            <el-table-column prop="useTel" label="手机号"></el-table-column>
            <el-table-column prop="amount" label="可用余额"></el-table-column>
            <el-table-column prop="point" label="可用积分"></el-table-column>
            <el-table-column prop="labelName" label="标签"></el-table-column>
        </el-table>
        <div class="right padding">
            <el-pagination small background layout="prev, pager, next" @current-change="currentPage"
                           :page-size="pageSize" :total="total">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="sureBindVip" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        components: {},
        props:{
            show: {
                type: Boolean,
                default: false
            },
//            //不可选择的人的id集合
//            disabledMan:{
//                type: Array,
//                default: function () {
//                    return [];
//                }
//            },
        },
        data() {
            return {
                visible:false,
                tableData:[],
                pageNumber: 1,
                pageSize: 10,
                total:0,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                radio:'',//单选的target
                vipGrade:[],
                checkVal:[],  //会员筛选值
                isIndeterminate:true,   //checkbox 的不确定状态,
                checkAll:false,   //会员全选
                selectVal:"",  //会员搜索选择条件
                select:"",
                searchParam:{}
            }
        },
        watch: {
            show: function () {
                if (this.show) {
                    this.visible = true;
                } else {
                    this.visible = false;
                }
            },
            visible: function () {
                if (!this.visible) {
                    this.cancel();
                }
            },
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let url = '/zingbiz/member/memberService/loadMemberCard';
                let param =  {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                };
                if (this.searchParam.useName !== "") {
                    param.useName = this.searchParam.useName
                }
                if (this.searchParam.useTel !== "") {
                    param.useTel = this.searchParam.useTel
                }
                this.$http
                    .post(url, param)
                    .then((res) => {
                        if (res.data.success) {
                            this.tableData = res.data.data.data;
                            this.total = Number(res.data.data.total);
                            let vipName = Math.max.apply(Math, this.tableData.map((item,index) => {
                                return Number(item.memberName)
                            }));
                            this.vipGrade = [];
                            for (let i = 0; i < vipName; i++) {
                                this.vipGrade.push(i + 1)
                            }
                            this.searchParam = {};
                        }
                    })
                    .catch(() => {
                        this.$message({ type: "error",info:"会员列表加载失败，请刷新重试！" })
                    })
            },
            currentPage(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.initData();
            },
            cancel() {
                this.$emit("cancel");
            },
//            isDisabled(row) {
//                if (this.disabledMan.indexOf(row.contactsId) === -1) {
//                    return false;
//                }
//                return true;
//            },
            //单选
            radioSelect(cur,row) {
                this.radio = cur;
                this.selectedData = row;
            },
            sureBindVip() {
                this.$emit('callback',this.selectedData)
            },

            //会员等级筛选
            selectedAllGrade (val) {
                this.checkVal = val ? this.vipGrade : [];
                this.isIndeterminate = false;
            },
            selectedGrade(val) {
                let checkedCount = val.length;
                this.checkAll = checkedCount === this.vipGrade.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.vipGrade.length;
                this.initData();
            },

            searchVip() {
                if (this.select === "1") {
                    this.searchParam.useName = this.selectVal;
                } else if (this.select === "2") {
                    this.searchParam.useTel = this.selectVal;
                }
                this.initData();
            },
        }
    }
</script>
<style scoped lang="stylus">
    .right {
        position: right;
    }
    .padding {
        padding: 10px;
    }
    .checkSelect {

    }

    .vipHeader {
        display:flex;
        justify-content:space-between;
        margin-bottom: 13px;
    }
</style>
