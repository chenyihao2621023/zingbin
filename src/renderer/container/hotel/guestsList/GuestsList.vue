<template>
    <div style="width: 100%">
        <el-container id="test" style="height: 100%">
            <el-main class="flex-column">
                <el-form class="searchArea" :inline="true">
                    <el-form-item label="筛选">
                        <el-checkbox-group v-model="filtrateList" @change="filterSearch">
                            <el-checkbox label="">全部</el-checkbox>
                            <el-checkbox label="-2">取消</el-checkbox>
                            <el-checkbox label="3">NoShow</el-checkbox>
                            <el-checkbox label="1">预订</el-checkbox>
                            <el-checkbox label="2">在店</el-checkbox>
                            <el-checkbox label="5">已退待结</el-checkbox>
                            <el-checkbox label="0">已结</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="searchText" clearable size="small">
                            <el-select slot="prepend" v-model="searchType" size="small" style="width: 100px">
                                <el-option label="房号" value="roomNo"></el-option>
                                <el-option label="姓名" value="checkInPersonName"></el-option>
                                <el-option label="手机号" value="telPhone"></el-option>
                                <el-option label="团队名称" value="groupName"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search" size="small">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="superSearchModal = true" size="small">高级搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-row>操作:
                    <el-button-group>
                        <el-button :disabled="isDisableEdit" size="mini" @click="editTheOrder">修改</el-button>
                        <el-button :disabled="isReserve" size="mini" @click="handleChickIn">入住</el-button>
                        <el-button v-show="hotelBillManagePower" :disabled="isLookBill" size="mini" @click="toGuestBill">查看账单</el-button>
                        <el-button :disabled="isChangeTeam" size="mini" @click="changeTeam">切换团队</el-button>
                        <el-button :disabled="isChangeTeam" size="mini" @click="changeRoom">切换联房</el-button>
                        <el-button :disabled="selectedRow.length !== 1" size="mini" @click="copyReserve">复制预定</el-button>
                        <el-button :disabled="selectedRow.length !== 1" size="mini" @click="reCheckIn">重新入住</el-button>
                        <el-button :disabled="selectedRow.length !== 1" size="mini" @click="GuestCard">宾客制卡</el-button>
                        <el-button :disabled="isChangeRoom" size="mini" @click="roomChange">换房</el-button>
                        <el-button :disabled="selectedRow.length !== 1" size="mini" @click="showTogetherMan">显示同来人</el-button>
                        <el-button :disabled="isCheckOut" size="mini" @click="showCheckOutModal">结账退房</el-button>
                        <el-button :disabled="isLookBill" @click="printBill" size="mini">打印账单</el-button>
                        <el-button :disabled="isOnline" @click="printReceipt" size="mini">打印入住单</el-button>
                        <el-button :disabled="selectedRow.length !== 1" size="mini" @click="guestHistoryInfo">客史信息</el-button>
                        <el-button v-show="hotelBillManagePower" :disabled="isTransfer" size="mini" @click="transferMoney">转账</el-button>
                        <el-button :disabled="isCancel" size="mini" @click="cancelOrder">取消</el-button>
                    </el-button-group>
                </el-row>
                <div class="table">
                    <el-table :data="tableData" @selection-change="selectRow" stripe border v-loading="showLoading" height="100%">
                        <el-table-column prop="select" type="selection" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" :formatter="formatStatus"
                                         align="center" width="80"></el-table-column>
                        <el-table-column prop="checkInPersonName" label="入住人" align="center"></el-table-column>
                        <el-table-column prop="customerType" label="客户类型" :formatter="formatCustomerType"
                                         align="center" width="80"></el-table-column>
                        <el-table-column prop="customerProperty" label="客户性质" :formatter="formatCustomerProp"
                                         align="center" width="80"></el-table-column>
                        <el-table-column prop="groupName" label="团队名称" width="180" align="center"></el-table-column>
                        <el-table-column prop="roomTypeDesc" label="房间类型" align="center"></el-table-column>
                        <el-table-column prop="roomNo" label="房间号码" align="center"></el-table-column>
                        <el-table-column prop="enterTime" label="预计来店" width="150" align="center" :formatter="formatEnterTime"></el-table-column>
                        <el-table-column prop="outerTime" label="预计离店" width="150" align="center" :formatter="formatOuterTime"></el-table-column>
                        <el-table-column prop="roomPrice" label="房间单价" align="center"></el-table-column>
                        <el-table-column prop="amount" label="余额" align="center"></el-table-column>
                        <el-table-column prop="roomRemark" label="备注" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column type="expand" fixed="right">
                            <template slot-scope="props">
                                <el-form labelPosition="left" inline class="table-expand subForm" style="padding: 10px 20px ">
                                    <el-form-item class="sub-row" label="订单号:">{{ props.row.orderId }}</el-form-item>
                                    <el-form-item label="建户时间:">{{ props.row.createTime }}</el-form-item>
                                    <el-form-item label="建户人:">{{ props.row.createCardUrl}}</el-form-item>
                                    <el-form-item label="开房时间:">{{ props.row.actualEnterTime }}</el-form-item>
                                    <el-form-item label="开房人:">{{ props.row.getRoomCardUrl}}</el-form-item>
                                    <el-form-item label="状态:">{{ formatStatus(props.row)}}</el-form-item>
                                    <el-form-item label="预定人:">{{ props.row.reserveName }}</el-form-item>
                                    <el-form-item label="预定时间:">{{ props.row.reserveTime }}</el-form-item>
                                    <el-form-item label="预定类型:">{{ props.row.reserveTypeDesc }}</el-form-item>
                                    <el-form-item label="渠道:">{{ props.row.channelTypeDesc}}</el-form-item>
                                    <el-form-item label="客户类型:">{{ formatCustomerType(props.row) }}</el-form-item>
                                    <el-form-item label="会员名称:"><span
                                        v-show="props.row.customerType ==='2'">{{props.row.customerName}}</span>
                                    </el-form-item>
                                    <el-form-item label="协议单位:"><span
                                        v-show="props.row.customerType ==='3'">{{props.row.customerName}}</span>
                                    </el-form-item>
                                    <el-form-item label="中介:"></el-form-item>
                                    <el-form-item label="佣金结构:"></el-form-item>
                                    <el-form-item label="客户性质:">{{ formatCustomerProp(props.row)}}</el-form-item>
                                    <el-form-item label="虚拟账号:">{{ props.row.groupId }}</el-form-item>
                                    <el-form-item label="团队名称:">{{ props.row.groupName }}</el-form-item>
                                    <el-form-item label="公付内容:" class="word-break">{{ props.row.pubTradeCode }}</el-form-item>
                                    <el-form-item label="销售员:">{{ props.row.salePerson }}</el-form-item>
                                    <el-form-item label="入住类型:">{{ formatCheckInType(props.row)}}</el-form-item>
                                    <el-form-item label="实际来店时间:">{{ props.row.actualEnterTime }}</el-form-item>
                                    <el-form-item label="实际离店时间:">{{ props.row.actualOuterTime }}</el-form-item>
                                    <el-form-item label="房间类型:">{{ props.row.roomTypeDesc }}</el-form-item>
                                    <el-form-item label="房间号码:">{{ props.row.roomNo }}</el-form-item>
                                    <el-form-item label="房价代码:">{{ props.row.priceCode }}</el-form-item>
                                    <el-form-item label="房间单价:">{{ props.row.roomPrice}}</el-form-item>
                                    <el-form-item label="总房价:">{{ props.row.roomCharge}}</el-form-item>
                                    <el-form-item label="入住人:">{{ props.row.checkInPersonName}}</el-form-item>
                                    <el-form-item label="手机号:">{{ props.row.telPhone}}</el-form-item>
                                    <el-form-item label="同住人:" class="word-break">{{ formatTogetherMan(props.row) }}</el-form-item>
                                    <el-form-item label="房税结构:">{{ props.row.taxStructureDesc}}</el-form-item>
                                    <el-form-item label="备注:" class="word-break">{{ props.row.roomRemark }}</el-form-item>
                                    <el-form-item label="余额:">{{props.row.amount}}</el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="flex-right">
                    <el-select v-model="currentSize" placeholder="请选择显示条目" @change="selPageSize" size="mini">
                        <el-option v-for="item in pageSizes" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-pagination background @current-change="currentPage" :page-size="pageSize"
                                   layout="prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </el-main>

        </el-container>
        <div class="dialog">
            <!--切换团队或者联房-->
            <el-dialog v-if="showTeamNameOrRoomName" :title="TeamNameOrRoomName" :visible.sync="dialogChangeTeamOrRoom" width="60%" append-to-body
                       @close="closeChangeTeam">
                <change-team :personDatas="[]" :addPeopleData="everyTeamData" :isShowBtn="'yes'"
                             :isRelationRoom="RelationRoom" guestOrTeam="guest"
                             :teamInfo="{}" :public="[]" @IsInitData="initTableData"></change-team>
            </el-dialog>

            <el-dialog title="高级搜索" :visible.sync="superSearchModal">
                <el-form :model="superSearchForm" ref="superSearchForm" label-width="80px" label-position="right">
                    <el-row :span="12">
                        <el-col :span="12">
                            <el-form-item label="订单号" prop="orderId">
                                <el-input clearable v-model="superSearchForm.orderId" style="width: 150px" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="status">
                                <el-select clearable v-model="superSearchForm.status" size="small" style="width: 150px">
                                    <el-option label="预订" value="1"></el-option>
                                    <el-option label="在店" value="2"></el-option>
                                    <el-option label="已结" value="0"></el-option>
                                    <el-option label="取消" value="-2"></el-option>
                                    <el-option label="NoShow" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :span="12">
                        <el-col :span="12">
                            <el-form-item label="房间类型" prop="roomTypeId">
                                <el-select v-model="superSearchForm.roomTypeId" clearable style="width: 150px" size="small">
                                    <el-option v-for="row in roomTypeData" :key="row.rowId" :label="row.configValue" :value="row.rowId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户类型" prop="customerType">
                                <el-select clearable v-model="superSearchForm.customerType" size="small" style="width: 150px">
                                    <el-option label="普通客户" value="1"></el-option>
                                    <el-option label="会员" value="2"></el-option>
                                    <el-option label="协议单位" value="3"></el-option>
                                    <el-option label="中介" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="12">
                        <el-col :span="12">
                            <el-form-item label="客户性质" prop="customerProperty">
                                <el-select clearable v-model="superSearchForm.customerProperty" size="small" style="width: 150px">
                                    <el-option label="个人" value="1"></el-option>
                                    <el-option label="团队" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="团号" prop="groupId">
                                <el-input clearable v-model="superSearchForm.groupId" style="width: 150px" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="12">
                        <el-col :span="12">
                            <el-form-item label="团队名称" prop="groupName">
                                <el-input clearable v-model="superSearchForm.groupName" style="width: 150px" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="来店日期" prop="actualEnterTime">
                                <el-date-picker clearable v-model="superSearchForm.actualEnterTime" size="small" type="date" placeholder="选择日期"
                                                value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="12">
                        <el-col :span="12">
                            <el-form-item label="离店日期" prop="actualOuterTime">
                                <el-date-picker clearable v-model="superSearchForm.actualOuterTime" size="small" type="date" placeholder="选择日期"
                                                value-format="yyyy-MM-dd" style="width: 150px"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">

                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="superSearchModal = false">取 消</el-button>
                    <el-button type="primary" @click="submitSuperSearch()">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="门锁接口" :visible.sync="makeCard" class="guestMakeCard" center>
                <div class="cardTop">
                    <span>房间共N间</span>
                    <span>本次已制卡房间数：N</span>
                    <span>本次已清卡房间数：N</span>
                </div>
                <div class="cardContent">
                    <p>门卡号：88888888</p>
                    <p>房间号：888</p>
                    <p>有效日期：2017-12-18 10:09:10  --- 2017-12-19 14:00:00</p>
                </div>
                <div class="cardBottom">
                    <p>当前房号：301</p>
                    <p>开始时间：2017-12-18 10:09:10</p>
                    <p>结束时间：2017-12-19 14:00:00</p>
                    <span class="bottomBtn">
                            <el-button type="warning" size="mini">上一间</el-button>
                            <el-button type="warning" size="mini">下一间</el-button>
                        </span>
                </div>
                <span slot="footer" class="dialog-footer">
                        <el-button type="primary">读卡</el-button>
                        <el-button type="primary">制卡</el-button>
                        <el-button type="primary">清卡</el-button>
                    </span>
            </el-dialog>

            <!--引用组件-->
            <div class="components">
                <edit-order :show="showEditModal" :orderId="orderId" :rowId="rowId"
                                    @confirm="confirmEditOrder" @cancel="showEditModal = false"></edit-order>
                <change-room :show="roomChangeModal" @cancel="roomChangeModal = false" @confirm="okChangeRoom"
                             :orderId="orderId" :roomId="roomId"></change-room>
                <guest-history-order :show="guestHistoryInfoModal" :checkInMan="checkInMan"
                                     @confirm="guestHistoryInfoModal = false"
                                     @cancel="guestHistoryInfoModal = false"></guest-history-order>
                <show-together-man :show="showTogetherManModal" :orderId="orderId"
                                   @confirm="showTogetherManModal = false"
                                   @cancel="showTogetherManModal = false"></show-together-man>
                <handle-check-in :show="showHandleCheckIn" :orderId="orderId" :rowId="rowId"
                                 @confirm="confirmCheckIn" @cancel="showHandleCheckIn = false"></handle-check-in>
                <copy-reserve :show="showCopyReserve" :orderId="orderId" @confirm="okCopyReserve"
                              @cancel="showCopyReserve = false"></copy-reserve>
                <check-out :show="checkOutModal" :room="currentRoom" :order="currentOrder" @cancel="checkOutModal = false" @confirm="confirmCheckOut"></check-out>

                <door-card :makeCardDialog="doorCardModal" :hotelDoorCard="selectedRow[0]" @cancel="doorCardModal = false"></door-card>
                <registration :printGuestData="printGuestData"></registration>
                <print-bill-template :printData="printBillData"></print-bill-template>
            </div>
        </div>
    </div>
</template>
<script>
    import EditOrder from "./EditOrder";
    import HandleCheckIn from "./HandleCheckIn";
    import ChangeRoom from "./ChangeRoom";
    import GuestHistoryOrder from "./guestHistoryOrder";
    import showTogetherMan from "./showTogetherMan";
    import ChangeTeam from "../components/ChangeTeam.vue";
    import CopyReserve from "./CopyReserve.vue";
    import CheckOut from "./guestsBill/CheckOut.vue";
    import hotelFormatJs from "../commonJs/formatHotelJs";
    import DoorCard from "../components/DoorCard";
    import Registration from "../printTemplate/Registration";
    import PrintBillTemplate from "../printTemplate/PrintBillTemplate";
    import store from "../../../store";

    export default {
        components: {
            EditOrder, ChangeRoom, GuestHistoryOrder, showTogetherMan,
            ChangeTeam, HandleCheckIn, CopyReserve,CheckOut,DoorCard,Registration,PrintBillTemplate,
        },
        data() {
            return {
                showTeamNameOrRoomName: false,
                showLoading: false,
                tableData: [],
                pageSize: 30,
                currentSize:30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                pageNumber: 1,
                total: 0,
                guestHistoryInfoModal: false,   //客史信息显示开关
                checkInMan: "",
                showTogetherManModal: false,    //同来人显示开关
                showEditModal: false,           //编辑订单开关
                showHandleCheckIn: false,       //办理入住开关
                roomChangeModal: false,         //换房开关
                checkOutModal: false,           //退房开关
                currentRoom: {},                //退房的room
                currentOrder:{},                //退房的room的order

                showCopyReserve: false,        //复制预订
                doorCardModal:false,           //宾客制卡
                //搜索筛选
                filtrateList: [""],
                searchType: "roomNo",          //搜索类型
                searchText: "",
                //高级搜索
                superSearchModal: false,
                superSearchForm: {},
                roomTypeData:[],

                selectedRow: [],         //选中行的元素数组
                orderId: "",             //单选对象的orderId
                roomId: "",
                rowId:"",
                TeamNameOrRoomName: "",
                dialogChangeTeamOrRoom: false,
                everyTeamData: [],
                RelationRoom: "",
                loadingInstance:null,
                printGuestData:{},      //打印入住单参数
                printBillData:{},       //打印账单,
                power:{},               //权限
                hotelBillManagePower:true,
            }
        },
        computed: {
            isDisableEdit: function () {
                if (this.selectedRow.length === 1 && (this.selectedRow[0].status === "1" || this.selectedRow[0].status === "2")) {
                    return false;
                }
                return true;
            },
            isReserve: function () {
                if (this.selectedRow.length === 1 && this.selectedRow[0].status === "1") {
                    return false;
                }
                return true;
            },
            isLookBill() {
                //入住的,已结的,已结未付的,可用
                if (this.selectedRow.length === 1 && (this.selectedRow[0].status === "2" || this.selectedRow[0].status === "0" || this.selectedRow[0].status === "5")) {
                    return false;
                }
                return true;
            },
            isOnline() {
                if (this.selectedRow.length === 1 && this.selectedRow[0].status === "2") {
                    return false;
                }
                return true;
            },
            isChangeTeam: function () {
                //在店 - 散客 - 没团队 - 没联房,才能切换团队,或者联房,有一条不满足就禁用
                let flag = true;
                this.selectedRow.forEach((row) => {
                    if (row.status !== "2" || row.customerProperty !== "1" || row.groupName) {
                        flag = false;
                    }
                });
                if (this.selectedRow.length >= 1 && flag) {
                    return false;
                }
                return true;
            },
            isCheckOut() {
                return this.isCheckInOne();
            },
            isChangeRoom() {
                return this.isCheckInOne();
            },
            isTransfer() {
                return this.isCheckInOne();
            },
            isCancel() {
                if (this.selectedRow.length === 1 && this.selectedRow[0].status === "1") {
                    return false;
                }
                return true;
            }
        },
        watch:{
            superSearchModal:function () {
                if (!this.superSearchModal) {
                    this.$refs.superSearchForm.resetFields();
                }
            }
        },
        created() {
            this.initTableData();
            this.initRoomTypeData();
        },
        mounted() {
            this.$store.getters.isHasPower("hotelBillManagePower",this)
        },
        methods: {
            initTableData() {
                this.showLoading = true;
                let self = this;
                let query = {
                    pageNumber: self.pageNumber,
                    pageSize: self.pageSize,
                };
                query.status = this.filtrateList.join(" ");
                if (this.searchText) {
                    query[this.searchType] = this.searchText;
                }
                let url = "/zingbiz/hotel/hotelNew/getRoomState";
                if (this.searchType === "groupName" && this.searchText) {
                    url = "/zingbiz/hotel/hotelNew/getRoomStatebyAllCondition";
                }
                this.$httpSilent
                    .get(url, { params: query })
                    .then(function (res) {
                        self.showLoading = false;
                        if (res.data.success) {
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
            //筛选搜索
            filterSearch(val) {
                this.pageNumber = 1;
                this.initTableData();
            },
            //初始化房间类型数据
            initRoomTypeData() {
                let url = "/zingbiz/hotel/hotelNew/getHotelConfig";
                this.$httpSilent
                    .get(url, {
                        params: {
                            pageNumber: 1,
                            pageSize: 1000,
                            configCode: "104",
                        }
                    })
                    .then(res => {
                        if (res.data.success) {
                            this.roomTypeData = res.data.data;
                        } else {
                            this.$message({ type: "error", message: "初始化数据失败" });
                        }
                    })
                    .catch(() => {
                        this.$message({ type: "error", message: "初始化数据失败" });
                    })
            },
            //搜索
            search() {
                this.initTableData();
            },
            //高级搜索
            submitSuperSearch() {
                this.showLoading = true;
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getRoomStatebyAllCondition";
                this.superSearchForm.pageNumber = this.pageNumber;
                this.superSearchForm.pageSize = this.pageSize;
                this.$httpSilent
                    .get(url, { params:this.superSearchForm })
                    .then(function (res) {
                        self.showLoading = false;
                        self.superSearchModal = false;
                        if (res.data.success) {
                            self.tableData = res.data.data;
                            self.total = Number(res.data.total);
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请重试" });
                        }
                    }).catch(error => {
                    self.showLoading = false;
                    self.$message({ type: "error", message: "数据请求失败" });
                });
            },
            isCheckInOne() {
                //当选中一个,,并且是入住的,返回false,
                if (this.selectedRow.length === 1 && this.selectedRow[0].status === "2") {
                    return false;
                }
                return true;
            },
            //宾客制卡
            GuestCard() {
                this.doorCardModal = true;
            },
            //换房
            roomChange() {
                this.orderId = this.selectedRow[0].orderId;
                this.roomId = this.selectedRow[0].roomId;
                this.roomChangeModal = true;
            },
            okChangeRoom(flag) {
                this.roomChangeModal = false;
                this.initTableData();
            },
            //重新入住
            reCheckIn() {
                let order = this.selectedRow[0];
                let data = {
                    channelTypeId:order.channelTypeId,
                    checkInType:order.checkInType,
                    customerProperty: "1"
                }
                if (order.customerType === "2") {
                    data.customerId = order.customerId;
                    data.customerName = order.customerName
                }
                if (order.customerProperty === "2") {
                    data.customerProperty = "2";
                    data.groupId = order.groupId;
                    data.groupName = order.groupName;
                }
                this.$router.push({
                    path: "/hotel/singleCheckIn",
                    query: {
                        copyCheckIn: true,
                        order:JSON.stringify(data),
                    }
                });
            },
            currentPage(val) {
                this.pageNumber = val;
                this.initTableData();
            },
            //分页条目选择
            selPageSize(val) {
                this.pageSize = val;
                this.initTableData();
            },
            selectRow(allSelected, row) {
                this.selectedRow = allSelected;
            },
            //切换团队
            changeTeam() {
                this.showTeamNameOrRoomName = true;
                this.TeamNameOrRoomName = "切换团队";
                this.everyTeamData = this.selectedRow;
                this.dialogChangeTeamOrRoom = true;
                this.RelationRoom = "0"
            },
            //切换联房
            changeRoom() {
                this.showTeamNameOrRoomName = true;
                this.TeamNameOrRoomName = "切换联房";
                this.everyTeamData = this.selectedRow;
                this.dialogChangeTeamOrRoom = true;
                this.RelationRoom = "1";
            },
            closeChangeTeam() {
                this.showTeamNameOrRoomName = false
                this.everyTeamData = [];
            },
            //修改订单
            editTheOrder() {

                this.rowId = this.selectedRow[0].rowId;
                this.orderId = this.selectedRow[0].orderId;
                this.showEditModal = true;
            },
            confirmEditOrder(val) {
                this.showEditModal = false;
                this.initTableData();
            },
            //办理入住
            handleChickIn() {
                //和编辑差不多,订单orderType不同
                this.orderId = this.selectedRow[0].orderId;
                this.rowId = this.selectedRow[0].rowId;
                this.showHandleCheckIn = true;
            },
            confirmCheckIn(val) {
                this.showHandleCheckIn = false;
                this.initTableData();
            },
            //复制预订
            copyReserve() {
                this.orderId = this.selectedRow[0].orderId;
                this.showCopyReserve = true;
            },
            okCopyReserve(val) {
                this.showCopyReserve = false;
                this.initTableData();
            },
            //查看账单
            toGuestBill() {
                if (!this.selectedRow[0].orderId) {
                    this.$message({ type: "error", message: "缺少参数" });
                    return;
                }
                this.$router.push({
                    path: "/hotel/guestsBill",
                    query:{
                        orderId:this.selectedRow[0].orderId,
                        roomId:this.selectedRow[0].roomId,
                    }
                });
            },
            printBill () {
                let self = this;
                let room = this.selectedRow[0];
                if (!room.billId) {
                    this.$message({ type: "error", message: "请求账单异常" });
                    return;
                }
                this.loadingInstance = this.$loading();
                let url = "/zingbiz/hotelNew/hotelBill/getBillItemByBillId";
                let query = {
                    billId:room.billId,
                    pageNumber: 1,
                    pageSize: 9999,
                }
                self.$httpSilent
                    .get(url, { params: query })
                    .then(res => {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            let printBillData = {
                                billItemList: res.data.data.billItemList,
                                operatorName: res.data.data.operatorName,
                                payment:res.data.data.payment,
                                consumption:res.data.data.consumption,
                                orderId:room.orderId,
                                roomNo:room.roomNo,
                                checkInPersonName:room.checkInPersonName,
                                actualEnterTime:room.actualEnterTime,
                                actualOuterTime:room.actualOuterTime,
                            }
                            self.printBillData = printBillData;
                            self.$nextTick(() => {
                                hotelFormatJs.printTemplateByDomId("printBillFrame",false);
                            })
                        } else {
                            self.$message({ type: "error", message: "请求数据失败" });
                        }
                    })
            },
            printReceipt() {
                //请求打印人员数据
                let row = this.selectedRow[0];
                console.log("row",row);
                let self = this;
                this.loadingInstance = this.$loading();
                let url = "/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById";
                let query = {
                    contactsId:row.checkInPersonId
                };
                this.$httpSilent
                    .post(url, query)
                    .then(function (res) {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            //打印参数
                            let printGuestData = res.data.data;
                            printGuestData.roomNo = row.roomNo;
                            printGuestData.enterTime = row.actualEnterTime;
                            printGuestData.outerTime = row.actualOuterTime;
                            printGuestData.roomPrice = row.roomPrice;
                            printGuestData.note = row.roomRemark;
                            printGuestData.operatorName = row.operaterCardUrlName;
                            self.printGuestData = printGuestData;
                            if (row.status === "2") {
                                printGuestData.outerTime = row.outerTime;
                            }
                            //打印模版渲染完成调取打印
                            self.$nextTick(() => {
                                hotelFormatJs.printTemplateByDomId("guestsListTemplate",true);
                            })
                        } else {
                            self.$message({ type: "error", message: "请求数据失败，请重试" });
                        }
                    })
            },
            //查看客史信息
            guestHistoryInfo() {
                this.checkInMan = this.selectedRow[0].checkInPersonName;
                this.guestHistoryInfoModal = true;
            },
            //查看同来人
            showTogetherMan() {
                this.orderId = this.selectedRow[0].orderId;
                this.showTogetherManModal = true;
            },
            //转账
            transferMoney() {
                this.$router.push({
                    path: "/hotel/guestsBill",
                    query:{
                        orderId:this.selectedRow[0].orderId,
                    }
                });
            },
            //取消订单
            cancelOrder() {
                this.$confirm('是否取消该订单', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loadingInstance = this.$loading();
                    let self = this;
                    let url = "/zingbiz/hotel/hotelNew/cancelReserve";
                    let params = {
                        rowId:this.selectedRow[0].rowId
                    }
                    this.$httpSilent
                        .post(url, params)
                        .then(function (res) {
                            self.loadingInstance.close();
                            if (res.data.success) {
                                self.$message({ type: "success", message: "取消订单成功" });
                                self.initTableData();
                            } else {
                                self.$message({ type: "error", message: "请求数据失败，请重试" });
                            }
                        })
                });
            },
            //退房modal
            showCheckOutModal() {
                let room = this.selectedRow[0];
                //退房参数
                this.currentOrder = {
                    orderId:room.orderId,
                    groupId:room.groupId ? room.groupId : "",
                    checkInType:room.checkInType,
                }
                this.currentRoom = {
                    checkInPersonName : room.checkInPersonName,
                    roomId:room.roomId,
                    roomNo:room.roomNo,
                    billId:room.billId,
                    roomTypeId:room.roomTypeId,
                }
                this.checkOutModal = true;
            },
            //退房
            confirmCheckOut() {
                this.checkOutModal = false;
                this.initTableData();
            },
            //格式化订单房间状态
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
            },
            formatEnterTime(row) {
                if (row.orderType === "1") {
                    return "";
                } else {
                    return hotelFormatJs.formatEnterTime(row);
                }
            },
            formatOuterTime(row) {
                return hotelFormatJs.formatOuterTime(row);
            }
        },
    }
</script>
<style>
    .subForm .el-form-item__label{
        line-height: 25px;
        color: #99a9bf;
    }
    .subForm .el-form-item__content{
        line-height: 25px;
    }
</style>
<style scoped lang="stylus">
    .table-expand {
        font-size: 0;
        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 20%;
        }
        .word-break{
            word-break: break-all;
        }
    }
    #test .el-input__inner {
        line-height: 0;
    }
    .guestMakeCard{
        .cardTop{
            margin-bottom :10px;
            display: flex;
            span{
                flex:1;
            }
        }
        .cardContent{
            border:1px solid #aaa;
        }
        .cardBottom{
            position :relative;
            .bottomBtn{
                position :absolute;
                right:0px;
                top: 10px;
            }
        }
        .cardBtn{
            justify-content:center;
        }
        p{
            padding: 8px
        }
    }
    .table{
        height :100%
    }

</style>
