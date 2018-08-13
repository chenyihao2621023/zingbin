<template>
    <el-container style="overflow: auto">
        <el-row style="width: 100%">
            <el-col :span="6">
                <el-main>
                    <el-form class="form-clientinfo" labelWidth="70px">
                        <el-form-item label="入住人"><span>{{currentRoom?currentRoom.checkInPersonName:''}}</span></el-form-item>
                        <el-form-item label="客户类型"><span>{{formatCustomerType}}</span></el-form-item>
                        <el-form-item label="客户性质"><span>{{formatCustomerPro}}</span></el-form-item>
                        <el-form-item label="房间类型"><span>{{currentRoom ? currentRoom.roomTypeDesc :''}}</span></el-form-item>
                        <el-form-item label="房间号码"><span>{{currentRoom ? currentRoom.roomNo:""}}</span></el-form-item>
                        <el-form-item label="预订来店"><span>{{formatEnterTime}}</span></el-form-item>
                        <el-form-item label="预订离店"><span>{{formatOuterTime}}</span></el-form-item>
                        <el-form-item label="房价"><span>{{currentRoom ? currentRoom.roomCharge:'' }}</span></el-form-item>
                        <el-form-item label="备注"><span class="word-break">{{currentRoom?currentRoom.remark:'' }}</span></el-form-item>
                        <el-form-item label="状态"><span>{{formatStatus(currentRoom)}}</span></el-form-item>
                    </el-form>
                    <el-table :data="orderRoom" ref="roomList" @row-click="selectRoom" border highlight-current-row>
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-radio class="radio" v-model="radioRoom" :id="formatRoomId(scope.row)" :label="formatRoomId(scope.row)">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="roomNo" label="房号"></el-table-column>
                        <el-table-column prop="checkInPersonName" label="姓名" :formatter="formatName"></el-table-column>
                        <el-table-column prop="amount" label="余额"></el-table-column>
                        <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
                    </el-table>
                    <div style="padding: 5px 0">当前房间号: {{currentRoom?currentRoom.roomNo:''}}</div>
                </el-main>
            </el-col>
            <el-col :span="18">
                <el-main>
                    <p class="main-title ">账务明细</p>
                    <el-button-group>
                        <el-button :disabled="disabled01" size="small" @click="addBillItem">入账</el-button>
                        <el-button :disabled="disabled01" size="small" @click="cashPledge">押金</el-button>
                        <el-button :disabled="disabled01" size="small" @click="smallGoods">小商品</el-button>
                        <el-button :disabled="disabled01" size="small" @click="refund">退款</el-button>
                        <el-button :disabled="disabled02" size="small" @click="transferAccounts">转账</el-button>
                        <el-button :disabled="disabled03" size="small" @click="reverseBillItem">冲账</el-button>
                        <el-button :disabled="disabled03" size="small" @click="partFinish">部分结账</el-button>
                        <el-button :disabled="disabled04" size="small" @click="billLogs">账单日志</el-button>
                        <el-button :disabled="disabled04" size="small" @click="printBill">打印账单</el-button>
                        <el-button :disabled="isCheckoutNoPay" size="small" @click="checkoutNoPay">仅退房</el-button>
                        <el-button :disabled="disabled05" size="small" @click="finishAndCheckout">{{checkOutTitle}}</el-button>
                    </el-button-group>
                    <el-form :model="searchForm" :rules="formRules" ref="searchForm">
                        <el-form-item label="账务类型" prop="settlementState">
                            <el-radio-group v-model="searchForm.settlementState" @change="selectBillState">
                                <el-radio label="">所有账务</el-radio>
                                <el-radio label="0">未结账务</el-radio>
                                <el-radio label="1">已结账务</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="交易类型" prop="tradeTypeId">
                            <el-select v-model="searchForm.tradeTypeId" @change="searchBillItem" placeholder="请选择交易类型" size="small">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="row in filterTradeCode" :key="row.rowId" :label="row.tradeTypeDesc" :value="row.tradeType" :ref="row.tradeType"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="操作时间" style="margin-bottom: 20px">
                            <el-col :span="6">
                                <el-form-item prop="startDate">
                                    <el-date-picker type="date" v-model="searchForm.startDate"
                                                    value-format="yyyy-MM-dd" style="width: 100%;" size="small"
                                                    placeholder="开始时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col style="text-align: center" :span="1">-</el-col>
                            <el-col :span="6">
                                <el-form-item prop="endDate">
                                    <el-date-picker type="date" v-model="searchForm.endDate"
                                                    value-format="yyyy-MM-dd" style="width: 100%;" size="small"
                                                    placeholder="结束时间"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="margin-left: 10px">
                                <el-button type="primary" size="small" @click="searchBillItem">搜索</el-button>
                            </el-col>
                        </el-form-item>

                        <div class="flex">
                            <span>付款合计: <span>{{currentRoom?currentRoom.payment:''}}</span></span>
                            <span>消费合计: <span>{{currentRoom?currentRoom.consumption:''}}</span></span>
                            <span>未结消费: <span>{{currentRoom?currentRoom.unfinishedPay:''}}</span></span>
                            <span>未结付款: <span>{{currentRoom?currentRoom.unfinishedCollect:''}}</span></span>
                            <span>余额: <span>{{currentRoom?currentRoom.amount:''}}</span></span>
                        </div>
                    </el-form>
                    <el-table :data="billItemList" border @selection-change="selectItem" ref="tableBill" max-height="400" :row-key="formatKey">
                        <el-table-column prop="select" reserve-selection type="selection" :selectable="canSelect" align="center"></el-table-column>
                        <el-table-column prop="settlementState" :formatter="formatBillType" label="状态"></el-table-column>
                        <el-table-column prop="genTime" label="操作时间" width="165"></el-table-column>
                        <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                        <el-table-column prop="businessItemDesc" label="交易详情" width="130"></el-table-column>
                        <el-table-column prop="businessCounts" label="数量" width="60"></el-table-column>
                        <el-table-column prop="amount" label="单价"></el-table-column>
                        <el-table-column prop="roomNo" label="房号"></el-table-column>
                        <el-table-column prop="note" label="备注"></el-table-column>
                        <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
                    </el-table>
                    <div style="display: flex;flex-direction: row-reverse">
                        <el-pagination background @current-change="currentPage" :page-size="pageSize" :current-page="pageNumber" layout="prev, pager, next" :total="total"></el-pagination>
                    </div>
                </el-main>
            </el-col>
        </el-row>
        <div class="components">
            <add-bill-item :tradeTypeId="tradeTypeId" :businessType="businessType" :order="orderData" :room="currentRoom"
                           :isPrintBill="isPrintBill" :operatorName="operatorName" :show="addBillItemModal" @cancel="addBillItemModal = false"
                           @confirm="confirmAddItem" @print="printReceipt"></add-bill-item>
            <transfer-bill-item :billItemList="selectedItem" :show="transferBillItemModal" @cancel="transferBillItemModal = false"
                                @confirm="confirmTransferBill"></transfer-bill-item>
            <reverse-bill-item :billItemList="selectedItem" :show="reverseBillItemModal" :room="currentRoom"
                               @cancel="reverseBillItemModal = false" @confirm="confirmReserveBill"></reverse-bill-item>
            <part-finish-of-bill :order="orderData" :operatorName="operatorName" :billItemList="selectedItem" :show="partFinishModal"
                                 :room="currentRoom" @cancel="partFinishModal = false" @confirm="confirmPartFinish" @print="printReceipt">
            </part-finish-of-bill>
            <bill-logs :orderId="orderId" :room="currentRoom" :show="billLogsModal" @cancel="billLogsModal = false"></bill-logs>
            <check-out :show="checkOutModal" :operatorName="operatorName" :room="currentRoom" :order="orderData"
                       @print="printReceipt" @cancel="checkOutModal = false" @confirm="confirmCheckOut"></check-out>
            <print-bill-template :printData="printBillData"></print-bill-template>
            <DepositData :printDepositData="printDepositData"></DepositData>
        </div>
    </el-container>
</template>

<script>
    import addBillItem from "./addBillItem";
    import TransferBillItem from "./TransferBillItem";
    import reverseBillItem from "./reverseBillItem";
    import PartFinishOfBill from "./PartFinishOfBill";
    import BillLogs from "./BillLogs";
    import CheckOut from "./CheckOut";
    import hotelFormatJs from "../../commonJs/formatHotelJs";
    import PrintBillTemplate from "../../printTemplate/PrintBillTemplate";
    import DepositData  from '../../printTemplate/DepositData';

    export default {
        components: {
            addBillItem, TransferBillItem, reverseBillItem, PartFinishOfBill,
            BillLogs, CheckOut,PrintBillTemplate,DepositData,
        },
        data() {
            return {
                loadingInstance: null,
                orderId: "",
                roomId:"",
                firstComeIn:true,      //是否第一次进页面,是,则currentRoom根据roomId判断,否则取第一个或者根据currentRoom的billId
                orderData: {},
                orderRoom:[],
                billItemList: [],
                operatorName:"",        //当前操作员
                nightAuditTime:"",      //夜审时间
                pageNumber:1,
                pageSize:10,
                total:0,
                businessType: "",       //入账类型（入账传参）
                tradeTypeId: "",        //交易类型（入账传参）
                selectedItem: [],       //选择的billItem列表
                currentRoom:{ },        //当前选择的房间

                tradeCodeData:[],       //交易代码
                searchForm: {
                    settlementState:""
                },
                addBillItemModal: false,
                transferBillItemModal: false,
                reverseBillItemModal: false,
                partFinishModal: false,      //结账
                billLogsModal: false,
                checkOutModal: false,
                formRules: {
                    // startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
                    // endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
                },
                isPrintBill:false,      //入账是否打印收据
                printBillData:{},       //打印账单的数据
                printDepositData:{},    //打印票据的参数
            }
        },
        computed:{
            checkOutTitle:function () {
                let str = "结账退房";
                if (this.currentRoom && this.currentRoom.roomId && this.currentRoom.status === "5") {
                    str = "结账";
                }
                return str;
            },
            radioRoom:function() {
                if (this.currentRoom) {
                    if (this.currentRoom.roomId) {
                        return this.currentRoom.roomId
                    }
                    return this.currentRoom.groupId;
                }
            },
            disabled01:function() {
                if (this.orderData.orderStatus === "2") {
                    if (this.currentRoom) {
                        if (this.currentRoom.roomId) {
                            if (this.currentRoom.status === "2") {
                                return false;
                            }
                            return true;
                        } else if (this.currentRoom.groupId) {
                            if (this.currentRoom.orderStatus === "2") {
                                return false;
                            }
                            return true;
                        }
                    }
                }
                return true;
            },
            //只有在店的和退房未结的可用,
            disabled05:function() {
                if (this.orderData.orderStatus === "2" && (this.currentRoom.status === "2" || this.currentRoom.orderStatus === "2")){
                    return false;
                }
                if (this.currentRoom.status === "5" || this.currentRoom.orderStatus === "5") {
                    return false;
                }
                return true;
                // if (this.orderData.orderStatus === "2") {
                //     if (this.currentRoom) {
                //         if (this.currentRoom.roomId) {
                //             if (this.currentRoom.status === "2") {
                //                 return false;
                //             }
                //             return true;
                //         } else if (this.currentRoom.groupId) {
                //             if (this.currentRoom.orderStatus === "2") {
                //                 return false;
                //             }
                //             return true;
                //         }
                //     }
                // } else if (this.currentRoom.status === "5" || this.currentRoom.orderStatus === "5") {
                //     return false;
                // }
                // return true;
            },
            //只有在店的,且不是虚拟账户 可用
            isCheckoutNoPay:function() {
                if ((this.currentRoom.status === "2" || this.currentRoom.orderStatus === "2") && !this.currentRoom.groupId) {
                    return false;
                }
                return true;
                // if (this.currentRoom.groupId || this.currentRoom.status === "0" || this.currentRoom.status === "5" || this.orderData.orderStatus === "5" || this.orderData.orderStatus === "0") {
                //     return true;
                // }
                // return false;
            },
            //选择的账单项目不为0时可用
            disabled02:function() {
                if (this.selectedItem.length > 0) {
                    let flag = false;
                    this.selectedItem.forEach(row => {
                        if (row.businessType !== "0") {
                            flag = true;
                        }
                    });
                    if (flag && this.orderData.orderStatus === "0") {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            disabled03:function() {
                if (this.selectedItem.length > 0 && this.orderData.orderStatus !== "0") {
                    return false;
                }
                return true;
            },
            disabled04:function() {
                if (this.currentRoom) {
                    if (this.currentRoom.roomId || this.currentRoom.groupName) {
                        return false;
                    }
                    return true
                }
                return true;
            },
            formatCustomerPro:function() {
                return hotelFormatJs.formatCustomerProp(this.orderData)
            },
            formatCustomerType:function() {
                return hotelFormatJs.formatCustomerType(this.orderData)
            },
            formatEnterTime:function () {
                if (this.currentRoom) {
                    if (this.currentRoom.enterTime) {
                        return this.currentRoom.enterTime.split(" ")[0]
                    }
                }
            },
            formatOuterTime:function () {
                if (this.currentRoom) {
                    if (this.currentRoom.outerTime) {
                        return this.currentRoom.outerTime.split(" ")[0]
                    }
                }
            },
            filterTradeCode:function () {
                let idArr = [];
                let rowArr = [];
                this.tradeCodeData.forEach(row => {
                    if (!idArr.includes(row.tradeType)) {
                        idArr.push(row.tradeType);
                        rowArr.push(row);
                    }
                });
                return rowArr;
            },
        },
        watch:{
            '$route'(to, from) {
                this.parseUrl();
                this.initBillOrderData();
            },
        },
        created() {
            this.parseUrl();
            this.initTradeCodeData();
            this.initBillOrderData();
            // this.initBillItemData();
        },
        methods: {
            parseUrl() {
                this.orderId = this.$route.query.orderId;
                if (this.$route.query.roomId) {
                    this.roomId = this.$route.query.roomId;
                }
            },
            initBillOrderData() {
                this.loadingInstance = this.$loading();
                let self = this;
                let url = "/zingbiz/hotelNew/hotelBill/getOrderRoomAmount";
                let query = { orderId: this.orderId };
                self.$httpSilent
                    .get(url, { params: query })
                    .then(res => {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            console.log("order",res.data.data);
                            self.orderData = res.data.data.order;
                            self.operatorName = res.data.data.operaterCardUrlName;
                            self.nightAuditTime = res.data.data.nightTime;
                            //1.room排序
                            let arr1 = [];
                            let arr2 = [];
                            res.data.data.room.forEach(row => {
                                if (row.roomId) {
                                    arr2.push(row);
                                } else {
                                    arr1.push(row);
                                }
                            });
                            let sortedTemp = arr1.concat(arr2);
                            //2.设置当前room回显
                            let currentTemp = null;
                            if (self.firstComeIn) {
                                //第一次进页面,是否有参数roomId
                                if (self.roomId) {
                                    sortedTemp.forEach(row => {
                                        if (row.roomId === self.roomId) {
                                            currentTemp = row;
                                        }
                                    })
                                } else {
                                    currentTemp = sortedTemp[0];
                                }
                            } else {
                                //不是第一次进页面,保持当前currentRoom,根据billId较方便
                                sortedTemp.forEach(row => {
                                    if (row.billId === self.currentRoom.billId) {
                                        currentTemp = row;
                                    }
                                })
                            }
                            self.firstComeIn = false;

                            //加上nextTick可以解决加载账单条目不立即渲染的问题
                            self.$nextTick(() => {
                                self.initBillItemData();
                            })

                            /**不知为什么,在给orderRoom重新赋值后,currentRoom就变成null,
                             * 定义currentTemp和sortedTemp临时变量,先后一起赋值,暂时消除了影响
                            */
                            self.currentRoom = currentTemp;
                            self.orderRoom = sortedTemp;
                            console.log("room",sortedTemp);
                        } else {
                            self.$message({ type: "error", message: "请求数据失败" });
                        }
                    })
            },
            initBillItemData() {
                if (!this.currentRoom || !this.currentRoom.billId) {
                    return;
                }
                let self = this;
                this.loadingInstance = this.$loading();
                let url = "/zingbiz/hotelNew/hotelBill/getBillItem";
                let query = {
                    billId:this.currentRoom.billId,
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                }
                let data = Object.assign({},query,this.searchForm);
                self.$httpSilent
                    .get(url, { params: data })
                    .then(res => {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            self.billItemList = [];
                            self.billItemList = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({ type: "error", message: "请求数据失败" });
                        }
                    })
            },
            initTradeCodeData() {
                hotelFormatJs.initTradeCodeData(this,"tradeCodeData");
            },
            //切换房间
            selectRoom(val) {
                this.currentRoom = val;
                this.pageNumber = 1;                    //页码恢复1
                this.$refs.tableBill.clearSelection();  //清空已选billItem,开启翻页记录功能后,切换房间需要清空
                this.initBillItemData();
            },
            //搜索
            selectBillState(val) {
                this.pageNumber = 1;        //页码恢复1
                this.initBillItemData();
            },
            //搜索
            searchBillItem() {
                this.$refs.searchForm.validate((flag) => {
                    if (flag) {
                        this.pageNumber = 1;        //页码恢复1
                        this.initBillItemData();
                    }
                })
            },
            selectItem(selection) {
                this.selectedItem = selection;
            },
            addBillItem() {
                this.tradeTypeId = "";
                this.businessType = "";
                this.isPrintBill = false;
                this.addBillItemModal = true;
            },
            //押金入账
            cashPledge() {
                this.tradeTypeId = "";
                let flag = false;
                this.tradeCodeData.forEach(row => {
                    if (row.accountingType === "1") {
                        if (row.tradeTypeDesc === "押金") {
                            this.tradeTypeId = row.tradeType;
                            flag = true;
                        }
                    }
                });
                if (!flag) {
                    this.$message({ type: "warning", message: '暂未配置"押金"交易类型' });
                    return;
                }

                this.businessType = "1";
                this.isPrintBill = true;
                this.addBillItemModal = true;
            },
            //小商品
            smallGoods() {
                this.tradeTypeId = "";
                let flag = false;
                this.tradeCodeData.forEach(row => {
                    if (row.accountingType === "0") {
                        if (row.tradeTypeDesc === "小商品") {
                            this.tradeTypeId = row.tradeType;
                            flag = true;
                        }
                    }
                });
                if (!flag) {
                    this.$message({ type: "warning", message: '暂未配置"小商品"交易类型' });
                    return;
                }
                this.businessType = "0";
                this.isPrintBill = false;
                this.addBillItemModal = true;
            },
            //退款类型入账
            refund() {
                this.tradeTypeId = "";
                let flag = false;
                this.tradeCodeData.forEach(row => {
                    if (row.accountingType === "1") {
                        if (row.tradeTypeDesc === "退款") {
                            this.tradeTypeId = row.tradeType;
                            flag = true;
                        }
                    }
                });
                if (!flag) {
                    this.$message({ type: "warning", message: '暂未配置"退款"交易类型' });
                    return;
                }
                this.businessType = "1";
                this.isPrintBill = false;
                this.addBillItemModal = true;
            },
            //入账回调
            confirmAddItem(val) {
                this.addBillItemModal = false;
                this.$refs.tableBill.clearSelection();  //清空已选billItem,
                this.$nextTick(() => {
                    this.initBillOrderData();
                })
            },
            transferAccounts() {
                this.transferBillItemModal = true;
            },
            //转账回调
            confirmTransferBill(val) {
                this.transferBillItemModal = false;
                this.$refs.tableBill.clearSelection();  //清空已选billItem,
                this.initBillOrderData();
            },
            reverseBillItem() {
                this.reverseBillItemModal = true;
            },
            //冲账回调
            confirmReserveBill() {
                this.reverseBillItemModal = false;
                this.$refs.tableBill.clearSelection();  //清空已选billItem,
                this.initBillOrderData();
            },
            partFinish() {
                this.partFinishModal = true;
            },
            //部分结账回调
            confirmPartFinish(val) {
                this.partFinishModal = false;
                this.$refs.tableBill.clearSelection();  //清空已选billItem,
                this.initBillOrderData();
            },
            billLogs() {
                this.billLogsModal = true;
            },
            printBill() {
                this.printBillData = Object.assign({},this.currentRoom);
                this.printBillData.orderId = this.orderData.orderId;
                this.printBillData.operatorName = this.operatorName;
                this.printBillData.billItemList = this.billItemList;
                this.$nextTick(() => {
                    hotelFormatJs.printTemplateByDomId("printBillFrame",false);
                })
            },
            checkoutNoPay() {
                let vm = this;
                if (this.currentRoom.groupId) {
                    vm.$message({ type: "error", message: "虚拟账户不能进行退房不结账操作" });
                    return;
                }
                vm.$confirm("确定进行退房不结账操作?", "提示", {
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        orderId:vm.orderData.orderId,
                        checkInType :vm.orderData.checkInType,
                        roomId:vm.currentRoom.roomId,
                        roomNo:vm.currentRoom.roomNo,
                        billId:vm.currentRoom.billId,
                    }
                    vm.$httpSilent
                        .post("/zingbiz/hotelNew/hotelBill/checkOutNoPay", params)
                        .then(res => {
                            vm.loadingInstance.close();
                            if (res.data.success) {
                                console.log("res.data",res.data);
                                vm.initBillOrderData();
                            } else {
                                vm.$message({ type: "error", message: "请求数据失败" });
                            }
                        })
                });
            },
            finishAndCheckout() {
                //如果是虚拟账户,检验团队中其他房间是否存在未结的,
                if (this.currentRoom.groupId) {
                    let flag = false;
                    this.orderRoom.forEach(row => {
                        if (row.roomId && row.status === "2") {
                            flag = true;
                        }
                    })
                    if (flag) {
                        this.$message({ type: "warning", message: '还存在未结房间，不能对虚拟账户结账' });
                        return;
                    }
                    this.checkOutModal = true;
                } else {
                    //入住类型是全天房的,进行夜审校验(即是否产生房费)
                    if (this.orderData.checkInType === "1") {
                        //判断是否已过一次夜审
                        if (this.currentRoom.actualEnterTime && this.nightAuditTime) {
                            let enterTime = this.currentRoom.actualEnterTime.split(" ");
                            let nightTime01 = new Date(enterTime[0] + " " + this.nightAuditTime).getTime();    //入住当天夜审时间毫秒值

                            //如果实际入住时当天夜审已过,判断当前时间是否过第二天的夜审
                            //如果当天夜审未过,判断当前时间是否已过当天夜审
                            if (new Date(this.currentRoom.actualEnterTime).getTime() > nightTime01) {
                                let nightTime02 = nightTime01 + 1000 * 60 * 60 * 24;                                //第二天夜审时间的毫秒值
                                if (new Date().getTime() > nightTime02) {
                                    this.checkOutModal = true;
                                } else {
                                    this.$confirm("该房间还未进行夜审，是否退房?", "提示", {
                                        confirmButtonText: '确定',
                                        type: 'warning'
                                    }).then(() => {
                                        this.checkOutModal = true;
                                    });
                                }
                            } else {
                                if (new Date().getTime() < nightTime01) {
                                    this.$confirm("该房间还未进行夜审，是否退房？", "提示", {
                                        confirmButtonText: '确定',
                                        type: 'warning'
                                    }).then(() => {
                                        this.checkOutModal = true;
                                    });
                                } else {
                                    this.checkOutModal = true;
                                }
                            }
                        } else {
                            this.$message({ type: "warning", message: '缺少参数, 请查看酒店时间是否启用' });
                        }
                    } else {
                        this.checkOutModal = true;
                    }
                }
            },
            //退房回调
            confirmCheckOut() {
                this.checkOutModal = false;
                this.$refs.tableBill.clearSelection();  //清空已选billItem,
                this.initBillOrderData();
            },
            //分页
            currentPage(val) {
                this.pageNumber = val;
                this.initBillItemData();
            },
            canSelect (row, index) {
                // if (row.settlementState === "0" || row.settlementState === "2") {
                //     return true;
                // }
                if (row.settlementState !== "1" & row.settlementState !== "3") {
                    return true;
                }
                return false;
            },
            formatBillType(row, column, cellValue) {
                if (row) {
                    return hotelFormatJs.formatBillItemType(row.settlementState);
                }
            },
            formatName(row, column, cellValue) {
                if (row.roomId) {
                    return row.checkInPersonName;
                } else {
                    return row.groupName;
                }
            },
            formatRoomId(row) {
                if (row.roomId) {
                    return row.roomId;
                } else if (row.groupId) {
                    return row.groupId;
                }
            },
            formatKey(row) {
                if (row) {
                    return row.billItemId
                }
            },
            formatStatus(row) {
                if (row) {
                    return hotelFormatJs.formatStatus(row);
                }
            },
            //子组件打印收据
            printReceipt(printData) {
                this.printDepositData = printData;
                this.$nextTick(() => {
                    hotelFormatJs.printTemplateByDomId("depositBillTemplate",true);
                })
            }
        },
    }
</script>
<style scoped>
    .main-title {
        font-size: 20px;
        margin-bottom: 10px;
    }
    .flex{
        display: flex;
        flex-direction: row;
        padding: 10px 0 10px 0;
        align-items: center;
    }
    .flex span{
        margin-right: 20px;
    }
    .form-title {
        font-size: 20px;
        text-align: center;
    }

    .form-accounted-for {
        width: 60%;
        height: 300px;
        margin: 20px 0;
        border: 1px solid #ddd;
        padding: 20px;
    }

    .form-clientinfo {
        border: 1px solid #ddd;
        padding: 10px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .el-button-group .el-button {
        border: 1px solid #dcdfe6 !important;
    }
    .word-break{
        word-break: break-all;
    }
</style>
