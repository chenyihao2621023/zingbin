<template>
    <div v-loading="showLoading">
        <el-dialog title="结账退房" :visible.sync="show" :before-close="handleClose" width="65%">
            <el-row>
                入住人: <span>{{room.checkInPersonName}}</span>&nbsp;&nbsp;&nbsp;
                房间号: <span>{{formatRoomNo}}</span>
            </el-row>
            <el-form :model="form" :rules="formRules" ref="form">
                <el-table :data="form.billItemList" border max-height="400">
                    <el-table-column type="index" :index="1"></el-table-column>
                    <el-table-column prop="settlementState" :formatter="formatBillType" width="70" label="状态"></el-table-column>
                    <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                    <el-table-column prop="businessItemDesc" label="交易详情"></el-table-column>
                    <el-table-column prop="businessCounts" label="数量" width="60"></el-table-column>
                    <el-table-column prop="amount" label="单价"></el-table-column>
                    <el-table-column prop="roomNo" label="房号"></el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                </el-table>
                <el-row>
                    消费合计: <span>{{resultData.consumption}}</span>&nbsp;&nbsp;
                    付款合计: <span>{{resultData.payment}}</span>&nbsp;&nbsp;
                    未结消费: <span>{{resultData.unfinishedPay}}</span>&nbsp;&nbsp;
                    未结付款: <span>{{resultData.unfinishedCollect}}</span>
                </el-row>
                <el-row>
                    <div v-if="!showWhat" class="green bold">
                        应收: <span>{{diffMoney}}</span>
                    </div>
                    <div v-if="showWhat" class="red bold">
                        应退: <span>{{diffMoney}}</span>
                    </div>
                </el-row>
                <el-form-item v-if="diffMoney>0" label="支付信息" prop="businessItem" label-width="80px">
                    <el-select clearable v-model="businessItem" @change="selectBusinessItem" size="small">
                        <el-option v-for="row in filterBusinessItem" :key="row.rowId" :label="row.descript" :value="row.rowId" :ref="row.rowId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="note" label-width="80px" >
                    <span style="display: inline-block">
                        <el-input v-model="form.note" size="small"/>
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-if="!showWhat" v-model="form.invoice">打印收据</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small">取 消</el-button>
                <el-button type="primary" @click="submit" size="small">确定</el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script>
    import hotelFormatJs from "../../commonJs/formatHotelJs";
    export default {
        name: "check-out",
        components:{

        },
        props:{
            show:{
                type:Boolean,
                default:false
            },
            room:{
                type:Object,
                default:{}
            },
            order:{
                type:Object,
                default:{}
            },
            operatorName:{
                type:String,
                default:"",
            }
        },
        data() {
            return {
                visible:false,
                showLoading:false,
                resultData:{},
                form:{
                    billItemList:[],
                    invoice:false,  //是否开发票
                },
                businessItem:"",
                formRules:{
                    businessItem:[{ required: true, message: '请选择支付信息', trigger: 'blur' }]
                },
                pay:0,
                consume:0,
                tradeCodeData:[],   //交易代码
                payCodeData:[],     //付款类型的交易代码
            }
        },
        computed:{
            filterBusinessItem:function () {
                let arr = [];
                this.payCodeData.forEach(row => {
                    if (this.showWhat) {
                        if (row.tradeTypeDesc === "退款") {
                            arr.push(row);
                        }
                    } else {
                        if (row.tradeTypeDesc === "收款") {
                            arr.push(row);
                        }
                    }
                });
                return arr;
            },
            diffMoney:function () {
                return Math.abs(Number(this.resultData.amount));
            },
            showWhat:function () {
                return Number(Number(this.resultData.payment) - Number(this.resultData.consumption)).toFixed(2) > 0 ? true : false;
            },
            //格式化人名显示
            formatRoomNo:function () {
                if (this.room.roomId) {
                    return this.room.roomNo;
                } else if (this.room.groupId) {
                    return this.room.groupName;
                }
            },
        },
        watch:{
            show:function(isShow) {
                this.visible = isShow;
                if (isShow) {
                    this.getBillItem();
                } else {
                    this.form.billItemList = [];
                    this.$refs.form.resetFields();
                    this.businessItem = "";
                }
            },
            tradeCodeData:function () {
                let arr1 = [];
                this.tradeCodeData.forEach(row => {
                    if (row.accountingType === "1") {
                        arr1.push(row);
                    }
                });
                this.payCodeData = arr1;
            }
        },
        created() {
            this.initTradeCodeData();
        },
        methods:{
            getBillItem() {
                this.showLoading = true;
                let self = this;
                let queryParam = {
                    billId:this.room.billId,
                    pageSize:10000,
                    pageNumber:1,
                };
                let url = "/zingbiz/hotelNew/hotelBill/getBillItemCheck";
                self.$httpSilent
                    .get(url, { params:queryParam })
                    .then(res => {
                        self.showLoading = false;
                        console.log("billItem",res.data.data);
                        if (res.data.success) {
                            self.resultData = res.data.data;
                            self.form.billItemList = res.data.data.billItemList;
                        } else {
                            self.$message({ type: "error", message: "获取账单数据失败" });
                        }
                    })
            },
            initTradeCodeData() {
                hotelFormatJs.initTradeCodeData(this,"tradeCodeData");
            },
            submit() {
                this.$refs.form.validate((valide) => {
                    if (valide) {
                        let self = this;
                        this.loadingInstance = this.$loading();

                        let params = Object.assign({},this.form);
                        delete params["billItemList"];

                        params.orderId = this.order.orderId;
                        params.billId = this.room.billId;
                        params.amount = this.diffMoney;
                        if (this.order.groupId) {
                            params.groupId = this.order.groupId;
                        }
                        //为插入条目准备数据,如果差额为0,不携带参数
                        if (Number(this.diffMoney) !== 0) {
                            params.businessCounts = "1";                //数量为1即可
                            params.checkInType = this.order.checkInType; //入住类型
                            params.settlementState = "1";                //已结状态
                            params.businessCounts = "1";                 //数量
                            if (this.room.roomId) {
                                params.roomId = this.room.roomId;
                                params.roomNo = this.room.roomNo;
                                params.roomTypeId = this.room.roomTypeId;
                            }
                            params.businessType = "1";           //入账类型为付款
                            //交易类型根据(应收/应退)确定
                            if (this.showWhat) {
                                params.tradeTypeDesc = "退款";
                                params.tradeTypeId = this.getTradeCode("退款");
                                params.amount = "-" + this.diffMoney;
                            } else {
                                params.tradeTypeDesc = "收款";
                                params.tradeTypeId = this.getTradeCode("收款");
                                params.amount = this.diffMoney;
                            }
                        }
                        console.log("params",params);

                        let url = "/zingbiz/hotelNew/hotelBill/checkOut";
                        this.$httpSilent
                            .post(url,params)
                            .then(function(res) {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.$message({ type: "success", message: "结账完成" });
                                    self.$emit("confirm",true);

                                    //是否打印票据
                                    if (self.form.invoice && !self.showWhat) {
                                        let printData = {
                                            operatorName:self.operatorName,
                                            orderId:self.order.orderId,
                                            deposit: self.diffMoney,
                                            note: self.form.note,
                                        }
                                        if (self.room.roomId) {
                                            printData.roomNo = self.room.roomNo;
                                            printData.guestName = self.room.checkInPersonName;
                                        } else {
                                            printData.roomNo = "";
                                            printData.guestName = self.order.groupName;
                                        }
                                        //把数据传递给父组件打印,,(父组件统一引用打印模版,可以保证模版的Id页面唯一)
                                        self.$emit("print",printData);
                                    }
                                } else {
                                    self.$message({ type: "error", message: "结账失败" });
                                    self.$emit("confirm",false);
                                }
                            })
                    }
                })
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
            formatBillType(row,key,val) {
                return hotelFormatJs.formatBillItemType(row.settlementState)
            },
            selectBusinessItem(val) {
                this.form.businessItem = val;
                this.form.businessItemDesc = this.$refs[val][0].label;
            },
            getTradeCode(str) {
                for (let i = 0; i < this.payCodeData.length; i++) {
                    let row = this.payCodeData[i];
                    if (row.tradeTypeDesc === str) {
                        console.log(str + "id",row);
                        return row.tradeType;
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    .bold{
        font-size: 16px;
        font-weight: 600;
    }
</style>
