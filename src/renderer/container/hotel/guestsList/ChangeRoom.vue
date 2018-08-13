<template>
    <el-dialog title="换房" :visible.sync="show" width="60%" :before-close="handleClose">
        <el-row>
            <el-tag v-for="(room,index) in form.hotelOrderRoomList" :key="room.roomId"
                    :type="room.roomTypeDesc">{{room.roomNo}}
            </el-tag>
        </el-row>
        <el-table :data="form.hotelOrderRoomList" border align="center" max-height="400" v-loading="showLoading">
            <el-table-column prop="roomNo" label="房号" width="80">
                <template slot-scope="scope" >
                    <div style="display: flex;justify-content: space-between;align-items: center">
                        <span>{{scope.row.roomNo}} </span>
                        <el-button class="button-new-tag" type="text" @click="changeRoom(scope.row)" size="mini">换房</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="roomTypeDesc" label="房型" width="80"></el-table-column>
            <el-table-column prop="price" label="房价(平/末)" width="150">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.priceCodeId" size="small" clearable @change="selectPriceCode($event,scope.row)"
                               placeholder="请选择房价">
                        <el-option v-for="row in filterPriceCode(scope.row)" :key="row.rowId" :label="row.priceCode"
                                   :value="row.rowId" :ref="row.rowId"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="入住人">
                <template slot-scope="scope">
                                <span v-show="scope.row.checkInPeople && scope.row.checkInPeople.length>0">
                                     <el-tag v-for="(obj,index) in scope.row.checkInPeople" :key="index" v-if="obj.personSign === '0'">
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                    <!--<el-button size="small" @click="addCheckInPeople(scope.row)" type="text">添加入住人</el-button>-->
                </template>
            </el-table-column>
            <el-table-column label="同住人">
                <template slot-scope="scope">
                                <span v-show="scope.row.housemate && scope.row.housemate.length>0">
                                    <el-tag v-for="(obj,index) in scope.row.housemate" :key="index" v-if="obj.personSign === '1'">
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                    <!--<el-button size="small" @click="addHousemate(scope.row)" type="text">添加同住人</el-button>-->
                </template>
            </el-table-column>
            <el-table-column label="房税结构" width="150">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.taxStructureDesc" size="small" style="margin-left: 20px;" clearable placeholder="请选择"
                               @change="selectTaxStructure($event,scope.row)" collapse-tags>
                        <el-option v-for="item in taxStructureConfigs" :key="item.rowId" :label="item.detailDesc" :ref="item.rowId"
                                   :value="item.rowId">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.remark"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="roomCharge" label="预计房费(元)" width="80"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="" @click="handleClose" size="small">取消</el-button>
            <el-button type="primary" @click="confirmSubmit" size="small">确 定</el-button>
        </div>
        <div class="components">
            <select-room :show="selectRoomModal" :enterTime="form.enterTime" :outerTime="form.outerTime"
                         :tags="transRoomTag" :maxSelect="maxRoomNum" @cancel="selectRoomModal=false"
                         @callback="getRoomInfo"></select-room>
            <external-man :tags="selectedMan" :disabledMan="disabledManTrans" :show="selectManModal" @cancel="selectManModal=false"
                          :multiline="isMultiple" @callback="getExternalMan">
            </external-man>
            <external-man-add :append="true" :title="'添加外联人'" :show="addPersonModal" :showSelectBtn="true"
                              @cancel="addPersonModal=false" @callback="okAddPerson" @usePersonSelect="usePersonSelect">
            </external-man-add>
        </div>
    </el-dialog>
</template>
<script>
    import SelectRoom from "../components/selectRoom/SelectRoom";
    import ExternalMan from "../components/external/ExternalMan";
    import ExternalManAdd from "../components/external/ExternalManAdd";
    import hotelUtils from "../commonJs/orderHandleJs";

    export default {
        name: "change-room",
        components: {
            SelectRoom, ExternalMan,ExternalManAdd
        },
        props:{
            show:{
                type:Boolean,
                default:function () {
                    return false;
                }
            },
            orderId:{
                type:String,
                default:function () {
                    return "";
                }
            },
            roomId:{
                type:String,
                default:"",
            }
        },
        data() {
            return {
                //todo 以下有些变量不能轻易改动名称,改动时请注意 orderHandleJs 中的引用情况 后期再优化调整
                showLoading : false,
                selectRoomModal:false,
                selectManModal:false,       //外联人选择对话框
                addPersonModal:false,      //外联人添加对话框
                form:{},
                //选人的参数配置
                selectedMan:[],         //已选人员
                disabledManTrans:[],    //不可选人员
                isMultiple:false,       //单选/多选
                //换房参数
                targetRow: {},           //当前操作房间 ,
                setRoomTarget:{},
                maxRoomNum:1,
                transRoomTag:[],

                //页面初始化信息
                allData:{},
                roomPriceCodeConfigs : [],
                taxStructureConfigs : [],
            }
        },
        watch:{
            show:function (isShow) {
                if (isShow) {
                    this.initPreparedData();
                }
            },
        },
        methods:{
            initPreparedData() {
                this.showLoading = true;
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getOrderDetailById";
                let query = {};
                if (this.orderId) {
                    query.orderId = this.orderId;
                }
                this.$httpSilent
                    .get(url, { params: query })
                    .then(function (res) {
                        self.showLoading = false;
                        if (res.data.success) {
                            console.log("order",res.data);
                            self.roomPriceCodeConfigs = res.data.data.hotelPriceCodeConfigs;
                            self.taxStructureConfigs = res.data.data.hotelTaxStructureConfigs;
                            self.channelConfigs = res.data.data.hotelConfigChannels;
                            self.reserveTypeConfigs = res.data.data.hotelConfigReserveTypes;
                            self.hotelTradeTypeConfigs = res.data.data.hotelTradeTypeConfigs;
                            self.allData = res.data.data;
                            let handled = hotelUtils.handleOrderData(res.data.data.hotelOrders);
                            handled.hotelOrderRoomList = handled.hotelOrderRoomList.filter(row => {
                                return (row.roomId === self.roomId ? true : false);
                            })
                            self.form = handled;
                        } else {
                            self.$message({ type: "error", message: res.data.mgs });
                        }
                    });
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
            openSelectRoomModal () {
                if (this.enterTime && this.outerTime) {
                    this.selectRoomModal = true;
                    console.log("111");
                } else {
                    this.$message({ message: "请选择入住时间", type: "warning" });
                }
            },
            //确定房间选择
            getRoomInfo(obj) {
                if (obj.planed.length) {
                    let room = obj.planed[0]
                    this.setRoomTarget.roomId = room.roomId;
                    this.setRoomTarget.roomNo = room.roomNo;
                    this.setRoomTarget.roomTypeDesc = room.roomTypeDesc;
                    this.setRoomTarget.roomTypeId = room.roomTypeId;
                    //换房后房价代码重新选择
                    this.setRoomTarget.priceCode = "";
                    this.setRoomTarget.priceCodeId = "";
                }
                this.selectRoomModal = false;
            },
            changeRoom (row) {
                this.setRoomTarget = row;
                this.transRoomTag = [];
                this.maxRoomNum = 1;
                this.selectRoomModal = true;
            },
            //房价代码需要根据入住类型 + 当前房型 进行过滤
            filterPriceCode(room) {
                return hotelUtils.filterPriceCode(this,room);
            },
            //选择房价代码
            selectPriceCode(code, item) {
                hotelUtils.selectPriceCode(code, item,this);
            },
            //选择房税结构
            selectTaxStructure(code, row) {
                row.taxStructureId = code;
                row.taxStructureDesc = this.$refs[code][0].label;
            },
            //添加入住人
            addCheckInPeople(row) {
                this.targetRow = row;
                this.selectedMan = this.targetRow.checkInPeople;
                this.disabledManTrans = hotelUtils.filterDisableMan(this.targetRow.checkInPeople,this.form.hotelOrderRoomList);
                this.selectType = "checkIn";
                this.isMultiple = false;
                this.selectManModal = true;
            },
            //添加同住人
            addHousemate(row) {
                this.targetRow = row;
                this.selectedMan = this.targetRow.housemate;
                this.disabledManTrans = hotelUtils.filterDisableMan(this.targetRow.housemate,this.form.hotelOrderRoomList);
                this.selectType = "housemate";
                this.isMultiple = true;
                this.selectManModal = true;
            },
            //选人回调
            getExternalMan(list) {
                console.log(list);
                if (this.selectType === "checkIn") {
                    list.forEach(row => {
                        row.personSign = "0";
                    });
                    this.targetRow['checkInPeople'] = list;
                } else if (this.selectType === "housemate") {
                    list.forEach(row => {
                        row.personSign = "1";
                    });
                    this.targetRow['housemate'] = list;
                }
                this.form.hotelOrderRoomList = this.form.hotelOrderRoomList.concat();
                this.selectManModal = false;
            },
            confirmSubmit() {
                let self = this;
                for (let i = 0; i < self.form.hotelOrderRoomList.length; i++) {
                    let row = self.form.hotelOrderRoomList[i];
                    if (row.isPlaned === "false") {
                        self.$message({ type: "warning", message: "你还有未排房的预订,请先排房" });
                        return;
                    }
                    if (!row.checkInPeople || !row.checkInPeople.length) {
                        self.$message({ type: "warning", message: "请选择入住人" });
                        return;
                    }
                    if (!row.priceCodeId) {
                        self.$message({ type: "warning", message: "请选择房价" });
                        return;
                    }
                    if (!row.taxStructureId) {
                        self.$message({ type: "warning", message: "请选择房税结构" });
                        return;
                    }
                    //处理入住人员数据
                    let checkin = [];
                    row.checkInPeople.forEach(item => {
                        let obj = {
                            enterTime:self.form.enterTime,
                            outerTime:self.form.outerTime,
                            checkInPersonId:item.contactsId,
                            checkInPersonName:item.contactsName,
                            personSign:"0",
                        };
                        checkin.push(obj);
                    });
                    //处理同住人
                    let together = [];
                    if (row.housemate && row.housemate.length) {
                        row.housemate.forEach(item => {
                            let obj = {
                                enterTime:self.form.enterTime,
                                outerTime:self.form.outerTime,
                                checkInPersonId:item.contactsId,
                                checkInPersonName:item.contactsName,
                                personSign:"1",
                            };
                            together.push(obj);
                        });
                    }
                    //合并
                    row.hotelRoomPersonList = checkin.concat(together);
                    row.roomPersonNum = row.hotelRoomPersonList.length;
                }

                //删除其他数据,防止提交
                for (let i = 0; i < self.form.hotelOrderRoomList.length; i++) {
                    let row = self.form.hotelOrderRoomList[i];
                    delete row['housemate'];
                    delete row['checkInPeople'];
                }
                console.log("form after", this.form);

                this.loadingInstance = this.$loading({});

                //办理入住 修改订单状态
                let url = "/zingbiz/hotel/hotelNew/updateOrderRoom/";
                this.$httpSilent
                    .post(url, this.form.hotelOrderRoomList[0])
                    .then(function (res) {
                        self.loadingInstance.close();
                        if (res.data.success) {
                            self.$message({ type: "success", message: "换房成功" });
                            self.$emit("confirm",true);
                        } else {
                            self.$message({ type: "error", message: "换房失败" });
                            self.$emit("confirm",false);
                        }
                    }).catch(error => {
                    self.$emit("cancel",false);
                });
            },
        }
    }
</script>

<style scoped>

</style>
