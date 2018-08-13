<template>
    <el-container>
        <el-main>
            <div class="teamName">
                <span
                    v-if="isRelationRoom==='0'">团队名称：
                    <span
                        v-if="!setTeam">{{Object.keys(teamInfo).length > 0 ? teamInfo.groupName : selectTeamName}}</span>
                    <el-input v-show="setTeam" placeholder="请输入内容" v-model="setTeamInp" clearable
                              style="width: 80%" size="small"></el-input>
                </span>
                <span
                    v-if="isRelationRoom==='1'">联房名称：{{Object.keys(teamInfo).length > 0 ? teamInfo.groupName : selectTeamName}}
                    <el-input v-show="setTeam" placeholder="请输入内容" v-model="setTeamInp" clearable
                              style="width: 80%" size="small"></el-input>
                </span>
                <span v-if="isRelationRoom==='0'">公付内容：
                    <span v-for="(publicItem,index) in checkedTypeList" :key="index">
                        {{Number(publicItem.isSelect) === 1 ? publicItem.descript : ''}}
                    </span>
                </span>
            </div>
            <el-table :data="showPersonDatas" maxHeight="250" border style="width: 100%">
                <el-table-column prop="roomNo" label="房号"></el-table-column>
                <el-table-column prop="roomTypeDesc" label="房型"></el-table-column>
                <el-table-column prop="checkInPersonName" label="入住人"></el-table-column>
                <el-table-column prop="actualEnterTime" label="来店时间"></el-table-column>
                <el-table-column prop="status" :formatter="formatState" label="状态"></el-table-column>
            </el-table>
            <div class="right">
                <el-button v-if="(isShowBtn === 'yes'&&isRelationRoom === '0')" @click="setTeamBtn" type="primary"
                           size="small" :disabled="showTeamBtn">创建团队
                </el-button>
                <el-button @click="selectPeople" type="primary" size="mini">选择成员</el-button>
                <el-button v-if="(isShowBtn == 'yes'&&isRelationRoom=='0')" @click="selectPublicPay" type="primary"
                           size="small">选择公付
                </el-button>
                <el-button v-if="(isShowBtn == 'yes'&&isRelationRoom=='0')" @click="selectTeamBth" type="primary"
                           size="small" :disabled="showTeamBtn">选团加入
                </el-button>
                <el-button v-if="(isShowBtn == 'yes'&&isRelationRoom=='1')" @click="selectTeamBth" type="primary"
                           size="small" :disabled="showTeamBtn">选联加入
                </el-button>
            </div>
            <el-table :data="showAddPeoples" maxHeight="250" border style="width: 100%">
                <el-table-column prop="roomNo" label="房号"></el-table-column>
                <el-table-column prop="roomTypeDesc" label="房型"></el-table-column>
                <el-table-column prop="checkInPersonName" label="入住人"></el-table-column>
                <el-table-column prop="actualEnterTime" label="来店时间"></el-table-column>
                <el-table-column prop="status" :formatter="formatState" label="状态"></el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="delSelected(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="right">
                <el-button @click="sureAddTeam" type="primary" size="small" :disabled="addDisabled">添加</el-button>
            </div>

            <el-dialog :title="selTitle" :visible.sync="teamList" width="60%" append-to-body>
                <el-table :data="teamListData" maxHeight="250" border style="width: 100%"
                          highlight-current-row v-loading="showLoading" @row-click="RowClick">
                    <el-table-column width="50">
                        <template slot-scope="scope">
                            <el-radio class="radio" @change="radioSelect($event,scope.row)" v-model="radio" :id="scope.row.virtualBillId" :label="scope.row.virtualBillId">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="groupName" label="团队名称"></el-table-column>
                    <el-table-column prop="virtualBillId" label="团队账号"></el-table-column>
                    <el-table-column prop="roomNum" label="房间数"></el-table-column>
                    <el-table-column prop="enterTime" label="最早来期"></el-table-column>
                    <el-table-column prop="status" :formatter="formatState" label="状态"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="teamList = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="sureInjoyTeam" size="small">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="选择成员" :visible.sync="personList" width="60%" append-to-body>
                <el-table :data="personListData" maxHeight="250" border style="width: 100%"
                          @selection-change="handleSelectionChange" v-loading="showLoading">
                    <el-table-column type="selection" width="45"></el-table-column>
                    <el-table-column prop="roomNo" label="房号" width="180"></el-table-column>
                    <el-table-column prop="roomTypeDesc" label="房型" width="180"></el-table-column>
                    <el-table-column prop="checkInPersonName" label="入住人"></el-table-column>
                    <el-table-column prop="actualEnterTime" label="来店时间"></el-table-column>
                    <el-table-column prop="status" :formatter="formatState" label="状态"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="personList = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="addSelectPeoples" size="small">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="选择公付" :visible.sync="publicPayList" width="40%" append-to-body v-loading="showLoading">
                <el-form ref="form" :model="publicPayForm" v-loading="showLoading">
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
                    <el-button @click="publicPayList = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="setPublicPayList" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main.vue";
    import {deepCopy} from '@/utils/fn.js'

    export default {
        components: {ElContainer},
        props: {
            personDatas: {  //传入列表的数据，必传
                type: Array,
            },
            addPeopleData: {  //需要去添加的数据
                type: Array
            },
            isShowBtn: {  //是否显示某些按钮（yes/no）
                type: String,
                default: 'no'
            },
            teamInfo: {},  //团队信息，没有可以不传
            public: {   //已有团队的公付项目，没有可以不传
                type: Array,
            },
            isRelationRoom: {   //切换团队或者切换联房（0团队 1联房）
                type: String
            },
            guestOrTeam: {
                type: String
            }
        },
        data() {
            return {
                data: [],
                setTeamInp: "",
                showTeamBtn: false,
                setTeam: false,
                dialogVisible: false,
                teamList: false,
                teamListData: [],
                personList: false,
                personListData: [],
                publicPayList: false,
                publicPayForm: {
                    checkedType: [],
                    payType: this.public || [],
                    checkedTypeId: [],
                    checkedTypeName: [],
                    checkedPayType: []
                },
                publicPayType: [],
                showLoading: true,
                selectChangePeoples: [],
                selectChangeTeam: {},
                selectTeamName: "",
                selectGroupId: "",
                peoplesRowId: [],
                selTitle: "",
                addPeoples: this.addPeopleData,
                personData: this.personDatas,
                radio:'',   //单选的target
            }
        },
        computed: {
            showAddPeoples: function () {
                return this.addPeoples
            },
            showPersonDatas: function () {
                return this.personData
            },
            checkedTypeList: function () {
                if (this.public.length > 0) {
                    return this.public
                }
            },
            addDisabled: function () {
                if (this.guestOrTeam === "guest" && this.selectTeamName === '' && this.setTeamInp === '') {
                    return true
                } else if (this.guestOrTeam === "team" && this.teamInfo.groupName === '') {
                    return true
                }
            }
        },
        created() {
            if (this.isShowBtn === 'yes') {
                this.initPublicData();
            }
        },
        methods: {
            //状态回显
            formatState(row, column, cellValue) {
                if (row.status === '0') {
                    return '已结';
                } else if (row.status === '1') {
                    return '预定';
                } else if (row.status === '2') {
                    return '在店';
                } else if (row.status === '3') {
                    return '未到';
                } else if (row.status === '4') {
                    return '已结未付';
                } else if (row.status === '5') {
                    return '已解散';
                } else if (row.status === '-2') {
                    return '已取消';
                }
            },
            //初始化公付项目数据
            initPublicData() {
                let url = '/zingbiz/hotel/hotelNew/getTradeTypeConfig';
                let queryParams = {
                    pageNumber: '1',
                    pageSize: '999'
                };
                this.$httpSilent
                    .get(url, {params: queryParams})
                    .then(res => {
                        this.publicPayType = res.data.data;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "公付项目获取失败，请刷新重试"});
                    })

            },
            //选择成员列表初始化
            selectPeople() {
                this.personListData = [];
                this.personList = true;
                this.showLoading = true;
                if (this.addPeoples.length > 0) {
                    this.addPeoples.forEach(item => {
                        this.peoplesRowId.push(item.rowId)
                    })
                }
                let url = "/zingbiz/hotel/hotelNew/getGroupPersonSelectInfo";
                this.$httpSilent
                    .get(url, {params: {}})
                    .then(res => {
                        this.personListData = res.data.data;
                        this.personListData = this.personListData.filter(item => !this.addPeoples.some(rowIdItem => rowIdItem.rowId === item.rowId))
                        this.showLoading = false;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "团队数据获取失败，请刷新重试"});
                    })
            },
            //选择成员里边勾选的人
            handleSelectionChange(val) {
                this.selectChangePeoples = val;
            },
            addSelectPeoples() {
                this.addPeoples = this.addPeoples.concat(this.selectChangePeoples);
                this.personList = false;
            },
            //删除选中人员
            delSelected(row) {
                this.$confirm('是否确定移除该成员?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addPeoples = this.addPeoples.filter(item => {
                        return item.rowId !== row.rowId;
                    });
                    this.$message({type: 'success', message: '移除成功!'});
                }).catch(() => {
                    this.$message({type: 'info', message: '操作已取消'});
                });
            },

            //创建团队
            setTeamBtn() {
                this.selectTeamName = "";
                this.setTeam = true;
            },

            //选团加入初始化团队 或 选联加入联房
            selectTeamBth() {
                this.setTeam = false;
                this.teamListData = [];
                this.teamList = true;
                if (this.isRelationRoom === '0') {
                    this.selTitle = "选团加入"
                } else if (this.isRelationRoom === '1') {
                    this.selTitle = "选联加入"
                }
                this.showLoading = true;
                let url = "/zingbiz/hotel/hotelNew/getGroupSelectInfo";
                this.$httpSilent
                    .get(url, {
                        params: {
                            isRelationRoom: this.isRelationRoom  //0团队  1联房
                        }
                    })
                    .then(res => {
                        this.showLoading = false;
                        this.teamListData = res.data.data;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "团队数据获取失败，请刷新重试"});
                    })
            },
//            RowClick(row, event, column) {
//                this.selectChangeTeam = row;
//            },
            sureInjoyTeam() {
                this.selectTeamName = this.selectChangeTeam.groupName;
                this.selectGroupId = this.selectChangeTeam.groupId;
                this.teamList = false;
            },
            //选择公付内容
            selectPublicPay() {
                this.publicPayForm.payType = [];
                this.publicPayList = true;
                let url = "/zingbiz/hotel/hotelNew/getTradeTypeConfig";
                this.$httpSilent
                    .get(url, {
                        params: {
                            pageNumber: '1',
                            pageSize: '999'
                        }
                    })
                    .then(res => {
                        this.showLoading = false;
                        res.data.data.forEach((item) => {
                            this.publicPayForm.payType.push(item);
                        });
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "公付内容获取失败，请刷新重试"});
                    })
            },

            //选择公付类型项
            publicCheckedType(items) {
                let selectedIDs = items.map(item => item.rowId)
                items.forEach(item => {
                    if (selectedIDs.includes(item.rowId)) {
                        item.isSelect = 1
                    } else {
                        item.isSelect = NaN
                    }
                })
            },

            setPublicPayList() {
                this.publicPayList = false;
                this.public = deepCopy(this.publicPayForm.payType);
            },


            //确定成员加入团队、选择某团队加入
            sureAddTeam() {
                let url = "/zingbiz/hotel/hotelNew/guestToGroup";
                this.loadingInstance = this.$loading({});
                let selRowIds = [];
                let selOrderIds = [];
                let enterTime = [];
                let roomNos = [];
                this.addPeoples.forEach((item) => {
                    selRowIds.push(item.rowId);
                    enterTime.push(item.actualEnterTime);
                    selOrderIds.push(item.orderId);
                    roomNos.push(item.roomNo)
                });
                if (this.isRelationRoom === '0') {
                    if (this.teamInfo.groupName === "" && this.setTeamInp === "" && this.selectTeamName === "") {
                        this.$message({type: "warning", message: "请创建团队名称或选择团队"});
                        return
                    }
                } else if (this.isRelationRoom === '1') {
                    if (this.teamInfo.groupName === "" && this.setTeamInp === "" && this.selectTeamName === "") {
                        this.$message({type: "warning", message: "请选择联房"});
                        return
                    }
                }
                this.$httpSilent
                    .post(url, {
                        groupId: this.teamInfo.groupId || this.selectGroupId || "",   //团队ID（创建新团队的时候不需要）
                        groupName: this.teamInfo.groupName || this.setTeamInp || this.selectTeamName,   //团队名称
                        rowIds: selRowIds.join(" ").trim(),   //rowId（空格分割）
                        pubTradeCode: this.publicPayForm.checkedTypeId.join(" ").trim(),    //公付Id(空格分割)
                        orderIds: selOrderIds.join(" ").trim(),   //订单Id(空格分割)
                        roomNo: roomNos.join(" ").trim()
                    })
                    .then(() => {
                        this.loadingInstance.close();
                        this.personData = this.personDatas.concat(this.addPeoples);
                        this.addPeoples = [];
                        this.$message({type: "success", message: "操作成功！"});
                        this.$emit('IsInitData');
                        this.showTeamBtn = true;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "操作失败！"});
                    })
            },
            //单选
            radioSelect(cur,row) {
                console.log('单选',cur,row);
                this.radio = cur;
                this.selectChangeTeam = row;
            },
        }
    }
</script>
<style scoped lang="stylus">
    .teamName {
        display: flex;
        margin-bottom: 10px;
        span {
            flex: 1;
        }
    }

    .right {
        float: right;
        margin: 10px 0;
    }
    .el-dialog .el-dialog__body{
        padding:0 10px!important;
    }
</style>
