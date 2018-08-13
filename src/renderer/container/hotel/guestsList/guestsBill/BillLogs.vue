<template>
    <div>
        <el-dialog title="账单日志" :visible.sync="show" :before-close="handleClose" width="70%">
            <el-table :data="tableData" border v-loading="showLoading" max-height="400">
                <el-table-column type="index" index="1"></el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="operateType" label="交易类型" :formatter="formatType"></el-table-column>
                <el-table-column prop="logsDesc" label="交易详情"></el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
                <el-table-column prop="money" label="单价"></el-table-column>
                <el-table-column prop="roomNo" label="房号"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose" size="small">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "bill-logs",
        props:{
            show:{
                type:Boolean,
                default:false
            },
            room:{
                type:Object,
                default:{}
            },
            orderId:{
                type:String,
                default:""
            }
        },
        data() {
            return {
                visible:false,
                tableData:[],
                showLoading:false,
            }
        },
        watch:{
            show:function(isShow) {
                this.visible = isShow;
                if (isShow) {
                    this.initLogs();
                }
            }
        },
        methods:{
            initLogs() {
                let self = this;
                this.showLoading = true;
                let url = "/zingbiz/hotelNew/hotelBill/selectBillLogs";
                let query = {
                    orderId:this.orderId,
                    billId:this.room.billId
                }
                console.log("logquery",query);
                this.$httpSilent
                    .get(url,{ params :query })
                    .then(function(res) {
                        self.showLoading = false;
                        if (res.data.success) {
                            console.log("log",res.data.data.data);
                            self.tableData = res.data.data.data;
                        } else {
                            self.$message({ type: "error", message: "查询失败" });
                        }
                    })
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
            formatType(row) {
                let type = row.operateType;
                switch (type) {
                    case "1":
                        return "转入";
                    case "2":
                        return "转出";
                    case "3":
                        return "付款";
                    case "4":
                        return "消费";
                    case "5":
                        return "夜审";
                    case "6":
                        return "冲账";
                }
            }
        }
    }
</script>

<style scoped>

</style>
