<template>
    <div>
        <el-dialog title="同来人" :visible.sync="visible">
            <el-table :data="tableData" border style="width: 100%" v-loading="showLoading" max-height="400">
                <!--<el-table-column prop="rowId" label="状态"></el-table-column>-->
                <el-table-column prop="checkInPersonName" label="入住人"></el-table-column>
                <el-table-column prop="telPhone" label="手机号"></el-table-column>
                <el-table-column prop="groupName" label="团队名称"></el-table-column>
                <el-table-column prop="roomTypeDesc" label="房间类型"></el-table-column>
                <el-table-column prop="roomNo" label="房间号码"></el-table-column>
                <el-table-column prop="actualEnterTime" label="来店时间"></el-table-column>
                <el-table-column prop="actualOuterTime" label="离店时间"></el-table-column>
                <el-table-column prop="roomCharge" label="房价"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <!--<div class="">-->
                <!--<el-pagination background @current-change="currentPage" :page-size="pageSize"-->
                               <!--layout="prev, pager, next" :total="total"></el-pagination>-->
            <!--</div>-->
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="">取 消</el-button>-->
                <el-button type="primary" @click="returnBack" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "show-together-man",
        props:{
            show:{
                type:Boolean,
                default:function() {
                    return false;
                }
            },
            orderId:{
                type:String,
                default:function() {
                    return "";
                }
            }
        },
        data() {
            return {
                showLoading:false,
                tableData:[],
                pageSize:6,
                pageNumber:1,
                total:0,
                visible:false,
            }
        },
        watch:{
            show:function (isShow) {
                this.visible = this.show;
                if (isShow) {
                    this.initData();
                }
            },
            visible:function () {
                if (!this.visible) {
                    this.$emit("cancel",false);
                }
            }
        },
        methods:{
            currentPage (val) {
                this.pageNumber = val;
                this.initData();
            },
            //初始化客史信息
            initData () {
                if (!this.orderId) {
                    return;
                }
                this.showLoading = true;
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getGroupInPerson";
                let query = {
                    orderId:this.orderId,
                    pageNumber:1,
                    pageSize:100
                };
                this.$httpSilent
                    .get(url,{ params :query })
                    .then(function (res) {
                        console.log("同来人",res.data);
                        self.showLoading = false;
                        if (res.data.success) {
                            self.tableData = res.data.data.persoMap;
                        } else {
                            self.$message({ type: "error", message: "查询数据失败" });
                        }
                    }).catch(error => {
                    self.showLoading = false;
                    self.$message({ type: "error", message: "查询数据失败" });
                });
            },
            returnBack () {
                this.$emit("confirm",false);
            }
        }
    }
</script>

<style scoped>

</style>
