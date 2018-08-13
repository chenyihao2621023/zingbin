<template>
    <el-container>
        <el-main class="flex-column">
            <div class="addAndSearch">
                <span>
                    <el-form label-width="80px" :inline="true" size="small">
                        <el-form-item> 筛选：</el-form-item>
                        <el-form-item class="float-right">
                            <el-checkbox-group v-model="checkData" @change="searchCheck">
                                <el-checkbox :style="{marginLeft:'10px'}"
                                             v-for="(checkItem,index) in checkList" :checked="checkItem.isCheck"
                                             :label="checkItem.key" :key="index">{{checkItem.value}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </span>
                <span>
                    <el-form label-width="80px" :inline="true" size="small">
                        <el-form-item class="float-right">
                            <el-input placeholder="请输入内容" v-model="searchForm.name" class="input-with-select" clearable>
                                <el-select @change="selSearchValOne" v-model="selectData" slot="prepend"
                                           :style="{width:'100px'}" size="small"
                                           placeholder="请选择">
                                    <el-option v-for="item in optionsList" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-button size="small" slot="append" icon="el-icon-search" @click="searchTeam"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="float-right">
                            <el-button @click="searchDialogShow = true" type="primary" size="small">高级搜索</el-button>
                        </el-form-item>
                    </el-form>
                </span>
            </div>
            <div class="table">
                <el-table :data="deskData" v-loading="showLoading" style="width: 100%" border height="100%"
                          highlight-current-row align="center">
                    <el-table-column prop="status" :formatter="formatState" label="状态" width="80"></el-table-column>
                    <el-table-column prop="virtualBillId" label="虚拟账号" width="155"></el-table-column>
                    <el-table-column prop="groupName" label="团队名称" width="180"></el-table-column>
                    <el-table-column prop="enterTime" label="最早来期" width="160"></el-table-column>
                    <el-table-column prop="outerTime" label="最晚离期" width="160"></el-table-column>
                    <el-table-column prop="agreeUnitName" label="协议单位"></el-table-column>
                    <el-table-column prop="roomNum" label="房间总数" width="80"></el-table-column>
                    <el-table-column prop="salePerson" label="销售员"></el-table-column>
                    <el-table-column prop="channelTypeName" label="渠道"></el-table-column>
                    <el-table-column prop="totalAmount" label="总消费"></el-table-column>
                    <el-table-column label="操作" width="300" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="lookDetail(scope.row)" size="small" type="text"
                                       :disabled="(scope.row.status ==='5'||scope.row.status ==='-2')">详情
                            </el-button>
                            <el-button @click="cancelReserve(scope.row)" size="small" type="text"
                                       :disabled="scope.row.status !=='1'">取消
                            </el-button>
                            <el-button v-show="hotelBillManagePower" @click="checkOut(scope.row)" size="small" type="text"
                                       :disabled="(scope.row.status !='4' && scope.row.status !='2')">查看账单
                            </el-button>
                            <el-button @click="publicPay(scope.row,1)" size="small" type="text"
                                       :disabled="(scope.row.status ==='5'||scope.row.status ==='-2'||scope.row.isRelationRoom==='1'||scope.row.status==='4')">
                                公付
                            </el-button>
                            <el-button @click="fastCheckOut(scope.row)" size="small" type="text"
                                       :disabled="(scope.row.status !=='2')">
                                快速结账
                            </el-button>
                            <el-button @click="TeamLog(scope.row)" size="small" type="text">日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex-right">
                <el-select v-model="value" placeholder="请选择显示条目" @change="selPageSize" size="mini">
                    <el-option v-for="item in pageSizes" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-pagination background layout="prev, pager, next"
                               @current-change="pageChange" :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
            <el-dialog title="高级搜索" :visible.sync="searchDialogShow" width="30%" @close="closeHeightSearch">
                <el-form :model="searchForm" ref="searchForm" label-width="30%">
                    <el-form-item label="状态">
                        <el-select @change="seniorStatus" v-model="searchForm.advancedSearch" size="small"
                                   placeholder="请选择">
                            <el-option v-for="item in checkList" :key="item.key" :label="item.value"
                                       :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="虚拟账号">
                        <el-input v-model="searchForm.virtualBillId" :style="{width:'220px'}" clearable size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="团队名称">
                        <el-input v-model="searchForm.groupName" :style="{width:'220px'}" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="来店时间">
                        <el-date-picker v-model="searchForm.enterTime" type="date" size="small" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离店时间">
                        <el-date-picker v-model="searchForm.outerTime" type="date" size="small" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="searchDialogShow = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="searchTeam" size="small">搜索</el-button>
                </div>
            </el-dialog>

            <el-dialog title="团队详情" :visible.sync="dialogVisible" width="90%" @close="closeVisible">
                <div>
                    <div class="detailTop">
                        <ul class="publickPayTop">
                            <li>团队名称：{{showTeamData.groupName}}</li>
                            <li>虚拟账号：{{showTeamData.virtualBillId}}</li>
                            <li>协议单位：{{showTeamData.agreeUnitName}}</li>
                            <li></li>
                        </ul>
                        <ul class="publickPayTop">
                            <li>房数：{{showTeamData.roomNum}}</li>
                            <li>人数：{{showTeamData.totalPersonNum}}</li>
                            <li>销售员：{{showTeamData.salePerson}}</li>
                            <li></li>
                        </ul>
                    </div>
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="detailAdd"
                                   :disabled="(showTeamData.status ==='1'|| showTeamData.status ==='4' || showTeamData.status ==='0')">
                            添加
                        </el-button>
                        <el-button :type="addOrRemovePerson" size="small" @click="detailRemove"
                                   :disabled="(showTeamData.status ==='4' || showTeamData.status ==='0')">移除
                        </el-button>
                        <el-button v-show="hotelBillManagePower" :type="lookBill" size="small" @click="detailCheckOut">查看账单</el-button>
                    </div>
                </div>
                <el-table :data="showTeamData && showTeamData.hotelGroupInfoDetailList" style="width: 100%" border
                          highlight-current-row @selection-change="detailSelChange">
                    <el-table-column type="selection" maxWidth="45"></el-table-column>
                    <el-table-column prop="status" :formatter="formatState" label="状态"></el-table-column>
                    <el-table-column prop="orderNo" label="订单号"></el-table-column>
                    <el-table-column prop="checkInPersonName" label="入住人"></el-table-column>
                    <el-table-column prop="telPhone" label="手机号"></el-table-column>
                    <el-table-column prop="groupInPersonName" label="同住人"></el-table-column>
                    <el-table-column prop="roomNo" label="房号"></el-table-column>
                    <el-table-column prop="roomTypeDesc" label="房型"></el-table-column>
                    <el-table-column prop="priceCode" label="房价代码"></el-table-column>
                    <el-table-column prop="taxStructureDesc" label="房税结构"></el-table-column>
                    <el-table-column prop="actualEnterTime" label="来店时间"></el-table-column>
                    <el-table-column prop="actualOuterTime" label="离店时间"></el-table-column>
                    <el-table-column prop="amount" label="余额"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
                <div class="dialogBottom">
                    <span>建户人：{{showTeamData.createName}}</span>
                    <span>
                        <el-button type="primary" size="small" @click="disbandageTeam"
                                   :disabled="(showTeamData.status ==='4')">解散团队</el-button>
                        <el-button size="small" @click="dialogVisible=false">取消</el-button>
                    </span>
                </div>
            </el-dialog>

            <el-dialog title="切换团队" :visible.sync="dialogChangeTeam" width="60%" append-to-body>
                <change-team :personDatas="everyTeamData" :addPeopleData="[]" :isShowBtn="'no'" :teamInfo="rowClickItem"
                             :public="publicPayForm.checkedType" :isRelationRoom="'0'" guestOrTeam="team"
                             @IsInitData="loadList"></change-team>
            </el-dialog>

            <el-dialog title="选择公付" :visible.sync="dialogPublicPay" width="40%" v-loading="showLoading">
                <ul class="publickPayTop">
                    <li>团队账号：{{rowClickItem.virtualBillId}}</li>
                    <li>团队名称：{{rowClickItem.groupName}}</li>
                </ul>
                <ul class="publickPayTop">
                    <li>房间总数：{{rowClickItem.roomNum}}</li>
                    <li>人数：{{rowClickItem.totalPersonNum}}</li>
                </ul>
                <el-form ref="form" :model="publicPayForm" v-loading="showLoading" class="publicPayItem">
                    <el-form-item label="公付项目:">
                        <el-checkbox-group @change="publicCheckedType" v-model="publicPayForm.checkedType">
                            <el-checkbox v-for="(ItemType,index) in publicPayForm.payType"
                                         :label="ItemType"
                                         :key="index" name="type" style="width: 20%"
                            >{{ItemType.descript}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogPublicPay = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="sureSelpublicPay">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="快速结账" :visible.sync="dialogFastCheckOut" width="40%" v-loading="showLoading">
                <ul class="publickPayTop">
                    <li>团队账号：{{rowClickItem.virtualBillId}}</li>
                    <li>团队名称：{{rowClickItem.groupName}}</li>
                </ul>
                <ul class="publickPayTop">
                    <li>房间总数：{{rowClickItem.roomNum}}</li>
                    <li>人数：{{rowClickItem.totalPersonNum}}</li>
                </ul>
                <el-form ref="form" :model="publicPayForm">
                    <el-form-item label="公付项目：">
                        <span v-for="(item,index) in publicPayForm.checkedType" :key="index"
                              style="display:inline-block;width:20%">{{item.descript}}</span>
                    </el-form-item>
                </el-form>
                <ul class="publickPayTop">
                    <li>消费：{{rowClickItem.tradeFee}}</li>
                    <li>付款：{{rowClickItem.incomeFee}}</li>
                    <!--<li>合计：{{Number(rowClickItem.incomeFee) - Number(rowClickItem.tradeFee)}}</li>-->
                </ul>
                <el-form ref="form" :model="publicPayForm">
                    <el-form-item label="备注">
                        <el-input v-model="publicPayForm.note" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                                  style="width:85%"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogFastCheckOut = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="sureFastCheckOut">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="团队日志" :visible.sync="dialogLog" width="60%">
                <ul class="publickPayTop" style="margin-bottom: 20px">
                    <li>团队名称：{{rowClickItem.groupName}}</li>
                    <li>团队账号：{{rowClickItem.virtualBillId}}</li>
                    <li>协议单位：{{rowClickItem.agreeUnitName}}</li>
                </ul>
                <ul class="publickPayTop">
                    <li>创建时间：{{rowClickItem.createTime}}</li>
                    <li>解散时间：{{rowClickItem.disbandTime}}</li>
                </ul>
                <el-table :data="actionsLog" style="width: 100%" border v-loading="logLoading">
                    <el-table-column prop="createTime" label="操作时间"></el-table-column>
                    <el-table-column prop="optDesc" label="操作"></el-table-column>
                    <el-table-column prop="roomNo" label="房号"></el-table-column>
                    <el-table-column prop="optName" label="操作人"></el-table-column>
                </el-table>
                <div style="margin-top: 20px">建户人：{{rowClickItem.createName}}</div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import ChangeTeam from '../components/ChangeTeam.vue';
    import store from "../../../store";
    const checkLists = [
        { key: '', value: '全部', isCheck: true },
        { key: '-2', value: "取消", isCheck: false },
        { key: '3', value: "NoShow", isCheck: false },
        { key: '1', value: "预定", isCheck: false },
        { key: '2', value: "在店", isCheck: false },
        { key: '4', value: "已结未付", isCheck: false },
        { key: '0', value: "已结", isCheck: false },
        { key: '5', value: "解散", isCheck: false }
    ];

    export default {
        name: "teamList",
        components: {
            ChangeTeam
        },
        data() {
            return {
                showGroupId: '',
                checkList: checkLists,
                optionsList: [
                    { value: '1', label: '虚拟账号' },
                    { value: '2', label: '团队名称' },
                ],
                pageNumber: 1,
                pageSize: 30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                value: 30,
                total: 0,
                searchDialogShow: false,
                checkData: [],//复选框选中的值
                selectData: "",//选择框选择的值
                searchForm: { //搜索参数
                    name: "",
                    virtualBillId: "",
                    groupName: "",
                    advancedSearch: "",
                    enterTime: "",
                    outerTime: ""
                },
                showLoading: true,
                deskData: [],
                everyTeamData: [],
                actionsLog: [],
                currentRow: null,
                dialogVisible: false,
                dialogPublicPay: false,
                dialogLog: false,
                dialogFastCheckOut: false,
                dialogChangeTeam: false,
                publicPayForm: {
                    checkedType: [],
                    checkedTypeId: [],
                    payType: [],
                    note: '',
                },
                rowClickItem: {},
                detailRows: [],
                detailRowsLength: 0,
                disabled: false,
                logLoading: false,
                searchCheckedVal: [],
                selSearchVal: "",
                btnStatus: 'info',
                power:{},       //权限
                hotelBillManagePower:true
            };
        },
        computed: {
            addOrRemovePerson: function () {
                if (this.detailRowsLength >= 1) {
                    return 'primary'
                }
            },
            lookBill: function () {
                if (this.detailRowsLength === 1) {
                    return 'primary'
                }
            },
            showTeamData: function () {
                let data = this.deskData.find(teamData => teamData.groupId === this.showGroupId);
                return data || {}
            }
        },
        created() {
            this.loadList();
        },
        mounted() {
             this.$store.getters.isHasPower("hotelBillManagePower",this)
        },
        methods: {
            //初始化团队列表页面数据
            loadList() {
                let param = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                };
                let deskListUrl = "/zingbiz/hotel/hotelNew/getHotelGroupInfo";
                this.$httpSilent
                    .get(deskListUrl, { params: param })
                    .then(res => {
                        this.showLoading = false;
                        this.deskData = res.data.data;
                        this.total = Number(res.data.total);
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "列表数据加载失败，请刷新重试" });
                    });
            },
            //状态回显
            formatState(row, column, cellValue) {
                if (row.status === '0') {
                    return '已结';
                } else if (row.status === '1') {
                    return '预定';
                } else if (row.status === '2') {
                    return '在店';
                } else if (row.status === '3') {
                    return 'NoShow';
                } else if (row.status === '4') {
                    return '已结未付';
                } else if (row.status === '5') {
                    return '已解散';
                } else if (row.status === '-2') {
                    return '已取消';
                }
            },
            //搜索选择项
            searchCheck(val) {
                this.searchCheckedVal = [];
                this.searchCheckedVal = val;
                this.searchTeam();
            },
            selSearchValOne(val) {
                if (Number(val) === 1) {
                    this.selSearchVal = 1
                } else if (Number(val) === 2) {
                    this.selSearchVal = 2
                }
            },
            //高级搜索状态选择
            seniorStatus(val) {
                this.searchCheckedVal = [];
                this.searchCheckedVal.push(val);
            },
            closeHeightSearch() {
                this.searchForm = { //搜索参数
                    name: "",
                    virtualBillId: "",
                    groupName: "",
                    advancedSearch: "",
                    enterTime: "",
                    outerTime: ""
                };
            },
            //搜索
            searchTeam() {
                if (this.selSearchVal === 1) {
                    this.searchForm.virtualBillId = this.searchForm.name;
                } else if (this.selSearchVal === 2) {
                    this.searchForm.groupName = this.searchForm.name;
                }
                this.searchDialogShow = false;
                this.showLoading = true;
                let url = '/zingbiz/hotel/hotelNew/getHotelGroupInfo';
                this.$httpSilent
                    .get(url, {
                        params: {
                            pageNumber: this.pageNumber,
                            pageSize: this.pageSize,
                            status: this.searchCheckedVal.join(' ').trim(),
                            virtualBillId: this.searchForm.virtualBillId,
                            groupName: this.searchForm.groupName,
                            enterTime: this.searchForm.enterTime,
                            outerTime: this.searchForm.outerTime
                        }
                    })
                    .then(res => {
                        this.showLoading = false;
                        this.deskData = res.data.data;
                        this.total = Number(res.data.total);
                        this.searchForm = { //搜索参数
                            name: "",
                            virtualBillId: "",
                            groupName: "",
                            advancedSearch: "",
                            enterTime: "",
                            outerTime: ""
                        };
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "搜索查询失败，请刷新重试"});
                    })
            },
            //分页
            pageChange(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.loadList();
            },
            //分页条目选择
            selPageSize(val) {
                this.pageSize = val;
                this.showLoading = true;
                this.tableData = [];
                this.loadList();
            },

            //点击当前行获取当前团队信息
            rowClick(row, event, column) {
                this.showGroupId = row.groupId
            },

            //查看详情
            lookDetail(val) {
                this.dialogVisible = true;
                this.rowClickItem = val;
                this.showGroupId = val.groupId;
                this.everyTeamData = val.hotelGroupInfoDetailList;
                this.publicPay(val);
            },
            //取消预定团队
            cancelReserve(val) {
                this.$confirm('此操作将永久取消该预定团队, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = "/zingbiz/hotel/hotelNew/cancelGroupOrder";
                    this.$httpSilent
                        .get(url, {
                            params: {
                                groupId: val.groupId,
                            }
                        })
                        .then(res => {
                            if (res.data.success) {
                                this.dialogVisible = false;
                                this.$message({ type: 'success', message: '取消成功!' });
//                                this.showLoading = true;
//                                this.loadList();
                                this.rowClickItem.status = '-2';
                            }
                        })
                        .catch(() => {
                            this.$message({ type: 'error', message: '取消失败' });
                        })
                }).catch(() => {
                    this.$message({ type: 'info', message: '操作已取消' });
                });
            },
            //解散团队
            disbandageTeam() {
                let url = '/zingbiz/hotel/hotelNew/groupToGuest';
                this.loadingInstance = this.$loading({});
                let RowIds = [];
                this.everyTeamData.forEach(item => {
                    RowIds.push(item.rowId)
                });
                this.$confirm('此操作将永久解散此团队, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$httpSilent
                        .post(url, {
                            groupId: this.rowClickItem.groupId,
                            num: this.everyTeamData.length,
                            rowIds: RowIds.join(" ").trim(),
                            allNum: this.everyTeamData.length
                        })
                        .then(res => {
                            if (res.data.success) {
                                this.loadingInstance.close();
                                this.dialogVisible = false;
                                this.$message({ type: 'success', message: '解散成功!' });
//                                this.showLoading = true;
//                                this.loadList();
                                this.rowClickItem.status = '5';
                            }
                        })
                        .catch(() => {
                            this.$message({ type: 'error', message: '解散失败' });
                        })
                }).catch(() => {
                    this.$message({ type: 'info', message: '已取消解散操作' });
                });
            },

            //详情里边个人结账
            detailCheckOut() {
                if (this.detailRowsLength === 0) {
                    this.$message({ type: 'warning', message: '请选择需要结账的某个人' });
                } else if (this.detailRowsLength > 1) {
                    this.$message({ type: 'warning', message: '个人结账只能选取一个人，请确定具体要结账的人' });
                } else if (this.detailRowsLength === 1) {
                    if (this.detailRows[0].roomId === "" || this.rowClickItem.orderId === "") {
                        this.$message({ type: 'error', message: '参数错误' });
                        return;
                    }
                    this.$router.push({
                        path: 'guestsBill',
                        query: {
                            roomId: this.detailRows[0].roomId,
                            orderId: this.rowClickItem.orderId,
                        }
                    })
                }
            },
            //团队详情里边获取选择的人员
            detailSelChange(rows) {
                this.detailRows = rows;
                this.detailRowsLength = rows.length;
            },
            closeVisible() {
                this.dialogVisible = false;
                this.dialogChangeTeam = false;
            },
            //详情里边团队添加成员
            detailAdd() {
                this.dialogChangeTeam = true;
            },

            //详情里边移除团队成员
            detailRemove() {
                if (this.detailRowsLength <= 0) {
                    this.$message({ type: 'warning', message: '请选择需要移除的人' });
                } else {
                    let url = '/zingbiz/hotel/hotelNew/groupToGuest';
                    let checkInPersonId = [];
                    let checkInIds = [];
                    let RowIds = [];
                    this.detailRows.forEach((item) => {
                        checkInPersonId.push(item.checkInPersonId, item.groupInPersonId);
                        checkInIds.push(item.checkInPersonId);
                        RowIds.push(item.rowId)
                    });
                    this.$confirm('此操作将永久将所选择的人从团队中移除, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .post(url, {
                                groupId: this.rowClickItem.groupId,
                                num: this.detailRowsLength,
                                rowIds: RowIds.join(" ").trim(),
                                allNum: this.everyTeamData.length
                            })
                            .then(res => {
                                this.loadingInstance.close();
                                if (res.data.success) {
                                    this.everyTeamData = this.everyTeamData.filter(item => !checkInIds.some(cur => cur === item.checkInPersonId));
                                    if (this.everyTeamData.length === 0) {
                                        this.dialogVisible = false;
                                    }
                                    this.loadList();
                                    this.$message({ type: 'success', message: '移除成功!' });
                                }
                            })
                            .catch(() => {
                                this.$message({ type: 'error', message: '移除失败' });
                            })
                    }).catch(() => {
                        this.$message({ type: 'info', message: '已取消移除' });
                    });
                }
            },

            //团队结账
            checkOut(val) {
                console.log('orderIdorderIdorderId',val.orderId);
                /*if (val.orderId === "") {
                    this.$message({ type: 'error', message: '参数错误' });
                    return;
                }*/
                this.$router.push({
                    path: 'guestsBill',
                    query: {
                        orderId: val.orderId
                    }
                })
            },

            //获取团队公付项目
            publicPay(val, index) {
                this.rowClickItem = val;
                this.publicPayForm.payType = [];
                if (index === 1) {
                    this.dialogPublicPay = true;
                }

                let queryParams = {
                    groupId: val.groupId
                };
                let url = "/zingbiz/hotel/hotelNew/getTradeTypeWithStatus";
                this.$httpSilent
                    .get(url, { params: queryParams })
                    .then(res => {
                        res.data.data.forEach((item) => {
                            this.publicPayForm.payType.push(item);
                            if (Number(item.isSelect) === 1) {
                                this.publicPayForm.checkedType.push(item);
                            }
                        });
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "公付项目获取失败，请刷新重试" });
                    })
            },

            //获取当前勾选上的公付项目
            publicCheckedType(val) {
                this.publicPayForm.checkedTypeId = [];
                val.forEach((item) => {
                    this.publicPayForm.checkedTypeId.push(item.rowId);
                })
            },

            //确认修改/设置公付
            sureSelpublicPay() {
                let url = '/zingbiz/hotel/hotelNew/setPubTradeCode';
                this.showLoading = true;
                this.$httpSilent
                    .post(url, {
                        groupId: this.rowClickItem.groupId,
                        virtualBillId: this.rowClickItem.virtualBillId,
                        pubTradeCode: this.publicPayForm.checkedTypeId.join(' ').trim(),
                    })
                    .then(res => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.$message({ type: 'success', message: '公付内容设置成功' });
                            this.dialogPublicPay = false;
                        }
                    })
                    .catch(() => {
                        this.$message({ type: 'error', message: '公付内容设置失败，请选择重试' });
                    })
            },
            //快速结账
            fastCheckOut(val) {
                this.publicPay(val, 0);
                this.publicPayForm.checkedType = [];
                this.dialogFastCheckOut = true;
                this.publicPayForm.note = '';
                this.rowClickItem = val;
            },

            //确认快速结账
            sureFastCheckOut() {
                let url = '/zingbiz/hotel/hotelNew/fastAccounts';
                this.showLoading = true;
                this.$httpSilent
                    .post(url, {
                        groupId: this.rowClickItem.groupId,
                        virtualBillId: this.rowClickItem.virtualBillId,
                        totalFee: Number(this.rowClickItem.incomeFee - this.rowClickItem.tradeFee),
                        incomeFee: this.rowClickItem.incomeFee,
                        tradeFee: this.rowClickItem.tradeFee,
                        note: this.publicPayForm.note,
                    })
                    .then(res => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.$message({ type: 'success', message: '快速结账成功' });
                            this.dialogFastCheckOut = false;
//                            this.showLoading=true;
//                            this.loadList();
                            this.rowClickItem.status = '4';
                        }
                    })
                    .catch(() => {
                        this.$message({ type: 'error', message: '快速结账失败，请刷新重试' });
                    })
            },
            //日志
            TeamLog(row) {
                this.rowClickItem = row;
                this.dialogLog = true;
                this.logLoading = true;
                let url = '/zingbiz/hotel/hotelNew/getGroupOptLogs';
                let queryParams = {
                    groupId: row.groupId
                };
                this.$httpSilent
                    .get(url, {params: queryParams})
                    .then(res => {
                        this.actionsLog = res.data.data;
                        this.logLoading = false;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "团队日志获取失败，请刷新重试"});
                    })
            },

        }
    };
</script>

<style scoped lang="stylus">
    .float-right {
        margin-right: 0px;
    }
    .dialogBottom {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .publickPayTop {
        margin-bottom:10px;
        display: flex;
        li {
            flex: 1;
        }
    }

    .detailTop {
        display: inline-block;
        width: 70%;
        margin-bottom: 20px
    }

    .addAndSearch {
        display: flex;
        justify-content: space-between;
        margin-bottom: 14px;
    }
    .table{
        height :100%
    }
    .publicPayItem{
        .el-checkbox+.el-checkbox{
            margin-left:72px!important;
        }
    }

</style>

