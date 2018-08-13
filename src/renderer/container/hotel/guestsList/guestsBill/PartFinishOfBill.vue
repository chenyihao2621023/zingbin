<template>
    <div>
        <el-dialog title="部分结账" :visible.sync="show" :before-close="handleClose" width="65%">
            <el-row>
                入住人: <span>{{room.checkInPersonName}}</span>&nbsp;&nbsp;&nbsp;
                房间号: <span>{{formatRoomNo}}</span>
            </el-row>
            <el-form :model="form" :rules="formRules" ref="form">
                <el-table :data="form.billItemList" border max-height="400">
                    <el-table-column prop="settlementState" :formatter="formatBillType" width="70" label="状态"></el-table-column>
                    <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                    <el-table-column prop="businessItemDesc" label="交易详情"></el-table-column>
                    <el-table-column prop="businessCounts" label="数量" width="60"></el-table-column>
                    <el-table-column prop="amount" label="金额"></el-table-column>
                    <el-table-column prop="roomNo" label="房号"></el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="deleteTheRow(scope.$index,scope.row)" type="text" size="small">删除此项</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    消费: <span>{{consume}}</span>&nbsp;&nbsp;
                    付款: <span>{{pay}}</span>&nbsp;&nbsp;
                    合计: <span>{{total}}</span>
                </el-row>
                <el-row>
                    <div v-if="!showWhat" class="green bold">
                        应收: <span>{{diffMoney}}</span>
                    </div>
                    <div v-if="showWhat" class="red bold">
                        应退: <span>{{diffMoney}}</span>
                    </div>
                </el-row>
                <el-form-item label="支付信息" prop="businessItem" label-width="80px">
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
        name: "part-finish-of-bill",
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
            billItemList:{
                type:Array,
                default:[]
            },
            operatorName:{
                type:String,
                default:"",
            },
        },
        data() {
            return {
                visible:false,
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
                let pay = 0;
                let consume = 0;
                this.form.billItemList.forEach(row => {
                    if (row.businessType === "0") {
                        consume += Number(row.amount) * Number(row.businessCounts);
                    } else if (row.businessType === "1") {
                        pay += Number(row.amount) * Number(row.businessCounts);
                    }
                });
                this.pay = Number(pay).toFixed(2);
                this.consume = Number(consume).toFixed(2);
                return Math.abs(Number(Number(Number(this.pay) - Number(this.consume)).toFixed(2)));
            },
            total:function() {
                return Number(Number(this.pay) + Number(this.consume)).toFixed(2)
            },
            showWhat:function () {
                return Number(Number(this.pay) - Number(this.consume)).toFixed(2) > 0 ? true : false;
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
                    this.form.billItemList = this.billItemList.concat();
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
            initTradeCodeData() {
                hotelFormatJs.initTradeCodeData(this,"tradeCodeData");
            },
            submit() {
                this.$refs.form.validate((valide) => {
                    if (valide) {
                        if (this.form.billItemList.length < 1) {
                            this.$message({ type: "warning", message: "没有要结账的项目" });
                            return;
                        }
                        let self = this;
                        this.loadingInstance = this.$loading();

                        let params = Object.assign({},this.form);
                        params.billItemList = this.form.billItemList;
                        //为插入条目准备数据
                        params.businessCounts = "1";
                        params.orderId = this.order.orderId;
                        params.billId = this.room.billId;
                        params.checkInType = this.order.checkInType; //入住类型
                        params.settlementState = "1";                //已结状态
                        params.businessCounts = "1";                 //数量
                        if (this.room.roomId) {
                            params.roomId = this.room.roomId;
                            params.roomNo = this.room.roomNo;
                            params.roomTypeId = this.room.roomTypeId;
                        }
                        if (this.order.groupId) {
                            params.groupId = this.order.groupId;
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
                        console.log("params",params);

                        let url = "/zingbiz/hotelNew/hotelBill/payBillItem";
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
            deleteTheRow(index,row) {
                this.form.billItemList.splice(index,1);
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
            }
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
