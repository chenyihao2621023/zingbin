<template>
    <div>
        <el-dialog title="客史信息" width="80%" :visible.sync="visible">
            <div class="table-area" v-loading="showLoading">
                <el-table :data="tableData" border style="width: 100%" max-height="450">
                    <el-table-column prop="state" label="状态" :formatter="formatStatus" width="75" align="center"></el-table-column>
                    <el-table-column prop="checkInPersonName" label="入住人" align="center"></el-table-column>
                    <el-table-column prop="customerType" label="客户类型" :formatter="formatCustomerType" align="center"></el-table-column>
                    <el-table-column prop="customerProperty" label="客户性质" :formatter="formatCustomerProp" align="center"></el-table-column>
                    <el-table-column prop="roomTypeDesc" label="房间类型" align="center"></el-table-column>
                    <el-table-column prop="roomNo" label="房间号码" align="center"></el-table-column>
                    <el-table-column prop="actualEnterTime" label="来店时间" align="center" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="actualOuterTime" label="离店时间" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="roomCharge" label="房价" align="center"></el-table-column>
                    <el-table-column prop="remainingSum" label="余额" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column type="expand" fixed="right">
                        <template slot-scope="props">
                            <el-form labelPosition="left" inline class="table-expand" labelWidth="70px">
                                <el-form-item label="订单号">
                                    <span>{{ props.row.orderId }}</span>
                                </el-form-item>
                                <el-form-item label="建户时间">
                                    <span>{{ props.row.createTime }}</span>
                                </el-form-item>
                                <el-form-item label="建户人">
                                    <span>{{ props.row.createCardUrl }}</span>
                                </el-form-item>
                                <el-form-item label="开房时间">
                                    <span>{{ props.row.checkTime }}</span>
                                </el-form-item>
                                <el-form-item label="开房人">
                                    <span>{{ props.row.checkInPersonName }}</span>
                                </el-form-item>
                                <el-form-item label="状态">
                                    <span>{{ formatStatus(props.row)}}</span>
                                </el-form-item>
                                <el-form-item label="预定人">
                                    <span>{{ props.row.reserveName }}</span>
                                </el-form-item>
                                <el-form-item label="预定时间">
                                    <span>{{ props.row.reserveTime }}</span>
                                </el-form-item>
                                <el-form-item label="预定类型">
                                    <span>{{ props.row.reserveTypeDesc }}</span>
                                </el-form-item>
                                <el-form-item label="渠道">
                                    <span>{{ props.row.channelTypeDesc}}</span>
                                </el-form-item>
                                <el-form-item label="客户类型">
                                    <span>{{ formatCustomerType(props.row) }}</span>
                                </el-form-item>
                                <el-form-item label="会员名称">
                                    <span>{{ props.row.customerName }}</span>
                                </el-form-item>
                                <el-form-item label="协议单位">
                                    <span>{{ props.row.customerName }}</span>
                                </el-form-item>
                                <el-form-item label="中介">
                                    <span></span>
                                </el-form-item>
                                <el-form-item label="佣金结构">
                                    <span></span>
                                </el-form-item>
                                <el-form-item label="客户性质">
                                    <span>{{ formatCustomerProp(props.row) }}</span>
                                </el-form-item>
                                <el-form-item label="团号">
                                    <span>{{ props.row.groupId }}</span>
                                </el-form-item>
                                <el-form-item label="名称">
                                    <span>{{ props.row.groupName }}</span>
                                </el-form-item>
                                <el-form-item label="公付内容">
                                    <span>{{ props.row.pubTradeCode }}</span>
                                </el-form-item>
                                <el-form-item label="销售员">
                                    <span>{{ props.row.salePerson }}</span>
                                </el-form-item>
                                <el-form-item label="入住类型">
                                    <span>{{ formatCheckInType(props.row) }}</span>
                                </el-form-item>
                                <el-form-item label="来店时间">
                                    <span>{{ props.row.actualEnterTime }}</span>
                                </el-form-item>
                                <el-form-item label="离店时间">
                                    <span>{{ props.row.actualOuterTime }}</span>
                                </el-form-item>
                                <el-form-item label="房间类型">
                                    <span>{{ props.row.reserveTypeDesc }}</span>
                                </el-form-item>
                                <el-form-item label="房间号码">
                                    <span>{{ props.row.roomNo }}</span>
                                </el-form-item>
                                <el-form-item label="房价代码">
                                    <span>{{ props.row.priceCode }}</span>
                                </el-form-item>
                                <el-form-item label="房价">
                                    <span>{{ props.row.roomCharge}}</span>
                                </el-form-item>
                                <el-form-item label="入住人">
                                    <span>{{ props.row.checkInPersonName }}</span>
                                </el-form-item>
                                <el-form-item label="同住人">
                                    <span>{{ formatTogetherMan(props.row) }}</span>
                                </el-form-item>
                                <el-form-item label="房税结构">
                                    <span>{{ props.row.taxStructureDesc }}</span>
                                </el-form-item>
                                <el-form-item label="备注">
                                    <span>{{ props.row.remark }}</span>
                                </el-form-item>
                                <el-form-item label="余额">
                                    <span>{{ props.row.remainingSum }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="returnBack" size="small">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import hotelFormatJs from "../commonJs/formatHotelJs";
    export default {
        name: "guest-history-order",
        props:{
            show:{
                type:Boolean,
                default:function() {
                    return false;
                }
            },
            checkInMan:{
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
                visible:false,
                pageNumber:1,
                pageSize:100,
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
            //初始化客史信息
            initData () {
                if (!this.checkInMan) {
                    return;
                }

                this.showLoading = true;
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getRoomState";
                let query = {
                    pageNumber: self.pageNumber,
                    pageSize: self.pageSize,
                    checkInPersonName:this.checkInMan
                };
                this.$httpSilent
                    .get(url, { params: query })
                    .then(function (res) {
                        self.showLoading = false;
                        if (res.data.success) {
                            console.log("history", res.data);
                            self.tableData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请重试" });
                        }
                    }).catch(error => {
                        self.showLoading = false;
                        self.$message({ type: "error", message: "请求数据失败，请重试" });
                });
            },
            returnBack () {
                this.$emit("confirm",false);
            },
            //格式化订单状态
            formatStatus(row) {
                return hotelFormatJs.formatStatus(row);
            },
            formatCustomerType(row) {
                return hotelFormatJs.formatCustomerType(row);
            },
            formatCustomerProp(row) {
                return hotelFormatJs.formatCustomerProp(row);
            },
            formatCheckInType(row) {
                return hotelFormatJs.formatCheckInType(row);
            },
            formatTogetherMan(row) {
                return hotelFormatJs.formatTogetherMan(row);
            }
        }
    }
</script>

<style scoped>

</style>
