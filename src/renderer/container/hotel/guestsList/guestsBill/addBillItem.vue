<template>
    <div>
        <el-dialog title="入账" :visible.sync="visible" :before-close="handleClose">
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="入账类型" prop="businessType">
                    <el-radio-group v-model="form.businessType" @change="changeType" size="small">
                        <el-radio v-if="businessType != '1'" label="0">消费</el-radio>
                        <el-radio v-if="businessType != '0'" label="1">付款</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="交易类型" prop="tradeTypeId">
                    <el-select v-model="form.tradeTypeId" clearable @change="formatTradeType" size="small">
                        <el-option v-for="item in filterTradeType" :key="item.rowId"
                        :label="item.tradeTypeDesc" :value="item.tradeType" :ref="item.tradeType"></el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="交易详情" prop="businessItem">
                            <el-select v-model="businessItem" clearable @change="selectBusinessItem" size="small">
                                <el-option v-for="item in businessItemList" :key="item.rowId"
                                           :label="item.descript" :value="item.rowId" :ref="item.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="数量" prop="businessCounts">
                            <el-input clearable v-model="form.businessCounts" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="单价" prop="amount">
                            <el-input type="number" clearable v-model="form.amount" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="备注" prop="note">
                           <el-input clearable v-model="form.note" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="isPrintBill">
                    <el-checkbox v-model="isPrintInvoice">打印收据</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small">取 消</el-button>
                <el-button type="primary" @click="submit()" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import hotelFormatJs from "../../commonJs/formatHotelJs";
    export default {
        name: "add-bill-item",
        components:{ },
        props:{
            show:{
                type:Boolean,
                default:false
            },
            //交易类型
            tradeTypeId:{
                type:String,
                default:""
            },
            //入账类型:收款/消费
            businessType:{
                type:String,
                default:"",
            },
            //当前room对象
            room:{
                type:Object,
                default:{}
            },
            order:{
                type:Object,
                default:{}
            },
            //是否打印收据
            isPrintBill:{
                type:Boolean,
                default:false,
            },
            //操作员
            operatorName:{
                type:String,
                default:"",
            }
        },
        data() {
            return {
                visible:false,
                businessItem:"",
                isPrintInvoice:false,       //打印票据显示
                form:{
                    businessType:"",
                    tradeTypeId:"",
                    businessCounts:"1"
                },
                loadingInstance:null,

                tradeCodeData:[],
                consumeTypeData:[],
                payTypeData:[],

                queryMap:{
                    pageNumber: 1,
                    pageSize : 1000,
                },
                formRules:{
                    businessType:[{ required: true, message: '请选择入账类型', trigger: 'blur' }],
                    tradeTypeId:[{ required: true, message: '请选择交易类型', trigger: 'blur' }],
                    amount:[{ required: true, message: '请输入交易金额', trigger: 'blur' }],
                    businessCounts:[{ required: true, message: '请输入数量', trigger: 'blur' }],
                    businessItem:[{ required: true, message: '请选择交易详情', trigger: 'blur' }],
                },
            }
        },
        computed:{
            filterTradeType:function() {
                let arrId = [];
                let arrRow = [];
                this.tradeCodeData.forEach(row => {
                    if (row.accountingType === this.form.businessType) {
                        if (!arrId.includes(row.tradeType)) {
                            arrId.push(row.tradeType);
                            arrRow.push(row);
                        }
                    }
                });
                return arrRow;
            },
            businessItemList:function() {
                let arrRow = [];
                this.tradeCodeData.forEach(row => {
                    if (row.tradeType === this.form.tradeTypeId) {
                            arrRow.push(row);
                    }
                });
                return arrRow;
            }
        },
        watch:{
            show:function(isShow) {
                this.visible = isShow;
                if (isShow) {
                    if (this.tradeTypeId) {
                        this.form.tradeTypeId = this.tradeTypeId;
                        this.form.tradeTypeDesc = this.getTradeTypeDesc();
                    }
                    if (this.businessType) {
                        this.form.businessType = this.businessType;
                    }
                } else {
                    this.$refs.form.resetFields();
                    this.form.tradeTypeId = "";
                    this.form.businessType = "";
                    this.businessItem = "";
                }
            },
        },
        created() {
            this.initTradeCodeData();
        },
        methods:{
            initTradeCodeData() {
                hotelFormatJs.initTradeCodeData(this,"tradeCodeData");
            },
            getTradeTypeDesc() {
                for (let i = 0; i < this.tradeCodeData.length; i++) {
                    if (this.tradeCodeData[i].tradeType === this.tradeTypeId) {
                        return this.tradeCodeData[i].tradeTypeDesc;
                    }
                }
            },
            submit() {
                let self = this;
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if (!this.room.billId) {
                            self.$message({ type: "warning", message: "缺少参数" });
                            return;
                        }
                        if (this.form.amount.length > 8) {
                            self.$confirm("金额数值过大,是否提交", "提示", {
                                confirmButtonText: '确定',
                                type: 'warning'
                            }).then(() => {
                                self.gosubmit();
                            });
                        } else {
                            self.gosubmit();
                        }
                    }
                });
            },
            gosubmit() {
                let self = this;
                if (this.form.tradeTypeDesc === '退款') {
                    if (Number(this.room.amount) < Math.abs(Number(this.form.amount)) * Number(this.form.businessCounts)) {
                        this.$message({ type: "warning", message: "余额不足,不能进行退款" });
                        return;
                    }
                }
                this.loadingInstance = this.$loading({});
                let url = "/zingbiz/hotelNew/hotelBill/insertBillItem";
                this.form.orderId = this.order.orderId;
                this.form.roomId = this.room.roomId;
                this.form.roomNo = this.room.roomNo;
                this.form.roomTypeId = this.room.roomTypeId;
                this.form.billId = this.room.billId;
                this.form.checkInType = this.order.checkInType;   //入住类型
                if (this.order.groupId) {
                    this.form.groupId = this.order.groupId;
                }
                if (this.room.roomId) {             //账单条目类型(0个人，1团队)
                    this.form.billItemType = "0";
                } else {
                    this.form.billItemType = "1";
                }
                console.log("addbill",this.form);
                self.$httpSilent
                    .post(url, this.form)
                    .then(res => {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            self.$message({ type: "success", message: "保存成功" });
                            self.$emit("confirm",true);
                            //判断是否打印凭据
                            if (self.isPrintBill && self.isPrintInvoice) {
                                let printData = {
                                    operatorName:self.operatorName,
                                    orderId:self.order.orderId,
                                    deposit: Number(self.form.businessCounts) * Number(self.form.amount).toFixed(2),
                                    note: self.form.note,
                                }
                                if (self.room.roomId) {
                                    printData.roomNo = self.room.roomNo;
                                    printData.guestName = self.room.checkInPersonName;
                                } else {
                                    printData.roomNo = "";
                                    printData.guestName = self.order.groupName;
                                }
                                this.$emit("print",printData);
                            }
                        } else {
                            self.$message({ type: "error", message: "保存失败，请重试" });
                            self.$emit("confirm",false);
                        }
                    })
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
            changeType() {
                this.form.tradeTypeId = "";
            },
            formatTradeType(val) {
                this.businessItem = this.form.businessItem = "";    //置空交易详情
                if (val) {
                    this.form.tradeTypeId = val;
                    this.form.tradeTypeDesc = this.$refs[val][0].label;
                }
            },
            selectBusinessItem(val) {
                this.form.businessItem = val;
                this.form.businessItemDesc = this.$refs[val][0].label;
            },
        }
    }
</script>

<style scoped>

</style>
