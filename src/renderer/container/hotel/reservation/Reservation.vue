<template>
    <el-container>
        <el-main v-loading="showLoading">
            <div class="p10 line">
                <span class="bold p10 font20">订单信息</span>&nbsp;&nbsp;
                <span>建户:
                    <span>
                        {{allData.operatorName}} &nbsp;&nbsp;
                    </span>
                     <span id="currentTime"></span>
                </span>
            </div>
            <el-form :model="form" :rules="formRules" ref="form" label-width="80px" class="p10">
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="预订人" prop="reserveId">
                            <el-input type="hidden" v-model="form.reserveId"></el-input>
                            <el-tag v-show="form.reserveId" @click.native="addBookingPeople">
                                {{form.reserveName}}
                            </el-tag>
                            <el-button v-show="!form.reserveId" class="button-new-tag" size="small" @click="addBookingPeople">+ 添加预订人</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="预订类型" prop="reserveTypeId">
                            <el-select v-model="form.reserveTypeId" @change="famatReserveType" placeholder="请选择预订类型" size="small">
                                <el-option v-for="row in allData.hotelConfigReserveTypes" :key="row.rowId" :label="row.configValue" :ref="row.rowId"
                                           :value="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="渠道" prop="channelTypeId">
                            <el-select v-model="form.channelTypeId" @change="famatChannelType" placeholder="请选择渠道类型" size="small">
                                <el-option v-for="row in allData.hotelConfigChannels" :key="row.rowId" :label="row.configValue" :ref="row.rowId"
                                           :value="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="入住类型" prop="checkInType">
                            <el-select :disabled="isDisabled" v-model="form.checkInType" @change="famatCheckInType" placeholder="请选择入住类型" size="small">
                                <el-option label="全天房" value="1"></el-option>
                                <el-option label="钟点房" value="2"></el-option>
                                <el-option label="自用房" value="3"></el-option>
                                <el-option label="免费房" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="客户类型" prop="customerType">
                            <el-select v-model="form.customerType" placeholder="请选择客户类型" size="small">
                                <el-option label="普通客户" value="1"></el-option>
                                <el-option label="会员" value="2"></el-option>
                                <el-option label="协议单位" value="4"></el-option>
                                <!--<el-option label="中介" value="3"></el-option>-->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item v-if="form.customerType === '2'" label="会员名称" prop="customerId">
                            <el-select v-model="form.customerId" @change="famatCustomerName" placeholder="请选择会员" size="small">
                                <el-option v-for="(row,index) in customerData" :key="index" :label="row.name" :value="row.rowId" :ref="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.customerType === '4'" label="协议单位" prop="customerId">
                            <el-select v-model="form.customerId" @change="famatCustomerName" clearable filterable remote :remote-method="getUnitCompany" :loading="loadingForUnit" placeholder="请输入单位名称关键词" size="small">
                                <el-option v-for="item in unitCompanyList" :key="item.agreeUnitId" :label="item.agreeUnitName" :value="item.agreeUnitId" :ref="item.agreeUnitId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="客户性质" prop="customerProperty">
                    <el-radio-group v-model="form.customerProperty" size="small">
                        <el-radio label="1">个人</el-radio>
                        <el-radio label="2">团队</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row v-if="form.customerProperty ==='2'">
                    <el-col :span="formItemWidth">
                        <el-form-item label="团队名称" prop="groupName">
                            <el-input v-model="form.groupName" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="公付内容" prop="pubTradeCode">
                            <el-select v-model="form.pubTradeCode" multiple clearable placeholder="请选择公付内容" size="small">
                                <el-option v-for="(row,index) in allData.hotelTradeTypeConfigs" :key="index" :label="row.descript" :value="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--时间选择器-->
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="入住时间" prop="enterTime">
                            <el-date-picker v-model="form.enterTime" value-format="yyyy-MM-dd HH:mm:ss"
                                            :type="dateType" :picker-options="disableTime01" placeholder="选择入住时间" size="small"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="离店时间" prop="outerTime">
                            <el-date-picker v-model="form.outerTime" value-format="yyyy-MM-dd HH:mm:ss"
                                            :type="dateType" :picker-options="disableTime02" placeholder="选择离店时间" size="small"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.checkInType !='2'" :span="formItemWidth">
                        <el-form-item label="天数" prop="dayNumber">
                            <el-input type="number" v-model="dayNumber" min="1" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="选择房间" prop="hotelOrderRoomList">
                    <el-tag v-for="(room,index) in form.hotelOrderRoomList" :key="room.roomId" closable
                            @close="closeTagRoom(room,index)"
                            :type="room.roomTypeDesc">{{room.roomNo?room.roomNo:"未排房"}}
                    </el-tag>
                    <el-button class="button-new-tag" @click="openSelectRoomModal" size="small">+ 添加房间</el-button>
                </el-form-item>
                <el-form-item label="入住信息" v-show="form.hotelOrderRoomList.length >0">
                    <el-table :data="form.hotelOrderRoomList" border align="center" max-height="400">
                        <el-table-column prop="roomNo" label="房号" width="80">
                            <template slot-scope="scope" >
                                <el-button v-if="scope.row.isPlaned==='false' || !scope.row.roomNo" class="button-new-tag" @click="planRoom(scope.row)" size="small">排房</el-button>
                                <div v-else @click="openSelectRoomModal">{{scope.row.roomNo}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="roomTypeDesc" label="房型" width="80"></el-table-column>
                        <el-table-column prop="price" label="房价(平/末)" width="150">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.priceCodeId" clearable @change="selectPriceCode($event,scope.row)"
                                           placeholder="请选择房价" size="small">
                                    <el-option v-for="row in filterPriceCode(scope.row)" :key="row.rowId" :label="row.priceCode" :title="row.title"
                                               :value="row.rowId" :ref="row.rowId"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="入住人">
                            <template slot-scope="scope">
                                <span v-show="scope.row.checkInPeople && scope.row.checkInPeople.length>0">
                                     <el-tag v-for="(obj,index) in scope.row.checkInPeople" :key="index"
                                             v-if="obj.personSign === '0'" @click.native="addCheckInPeople(scope.row)" >
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                                <el-button size="small" v-show="!scope.row.checkInPeople || !scope.row.checkInPeople.length" @click="addCheckInPeople(scope.row)" type="text">添加入住人
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="同住人">
                            <template slot-scope="scope">
                                <span v-show="scope.row.housemate && scope.row.housemate.length>0">
                                    <el-tag v-for="(obj,index) in scope.row.housemate" :key="index" v-if="obj.personSign === '1'">
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                                <el-button size="small" @click="addHousemate(scope.row)" type="text">添加同住人</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="房税结构" width="150">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.taxStructureDesc" clearable style="margin-left: 20px;" placeholder="请选择"
                                           @change="selectTaxStructure($event,scope.row)" collapse-tags size="small">
                                    <el-option v-for="item in allData.hotelTaxStructureConfigs" :key="item.rowId" :label="item.detailDesc" :ref="item.rowId"
                                               :value="item.rowId">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="roomCharge" label="预计房费(元)" width="80">
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button @click="deleteTagRoom(scope.$index,scope.row)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span>
                 <el-button type="primary" @click="confirmSubmit">确 定</el-button>
            </span>

        </el-main>
        <!--引用组件集合-->
        <div class="components">
            <select-room :show="selectRoomModal" :enterTime="form.enterTime" :outerTime="form.outerTime"
                         :tags="transRoomTag" :isReserve="isReserve" :maxSelect="maxRoomNum" :unSelect="unSelectedRoom" @cancel="selectRoomModal=false"
                         @callback="getRoomInfoCallBack"></select-room>
            <external-man :tags="selectedMan" :disabledMan="disabledManTrans" :show="selectManModal" @cancel="selectManModal=false"
                          :multiline="isMultiple" @callback="getExternalMan">
            </external-man>
            <external-man-add :append="true" :title="'添加外联人'" :show="addPersonModal" :showSelectBtn="true"
                              @cancel="addPersonModal=false" @callback="okAddPerson" @usePersonSelect="usePersonSelect">
            </external-man-add>
        </div>
    </el-container>
</template>
<script>
    import SelectRoom from "../components/selectRoom/SelectRoom";
    import ExternalMan from "../components/external/ExternalMan";
    import ExternalManAdd from "../components/external/ExternalManAdd";
    import hotelUtils from "../commonJs/orderHandleJs";
    import { dateFormat } from "../../../utils/date";

    var enterTimebb = "";
    var checkInTypeCopy = "";
    export default {
        name: "Reservation",
        components: {
            SelectRoom, ExternalMan,ExternalManAdd
        },
        data() {
            return {
                //todo 以下有些变量不能轻易改动名称,改动时请注意 orderHandleJs 中的引用情况 后期再优化调整
                showLoading: false,
                currentTime:"",
                formItemWidth: 6,
                reserveMenu: "",            //来源预订菜单类型
                form: {
                    reserveTypeId:'',
                    channelTypeId:'',
                    pubTradeCode:[]
                },
                dayNumber:"",               //天数
                dateType:"date",
                configTime:"12:00:00",      //隔日房时间
                checkOutTime:"12:00:00",    //退房时间
                //禁用日期
                disableTime01: {
                    disabledDate(time) {
                        return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                    },
                },
                disableTime02:{
                    disabledDate(time) {
                        if (!enterTimebb) {
                            return time.getTime() < new Date().getTime();
                        } else {
                            if (checkInTypeCopy === "2") {
                                return time.getTime() < new Date(new Date(enterTimebb).setHours(0,0,0,0)).getTime();
                            } else {
                                return time.getTime() <= new Date(new Date(enterTimebb).setHours(0,0,0,0)).getTime();
                            }
                        }
                    },
                },
                selectRoomModal: false,         //房间选择组件可见性
                isReserve:false,                //是否允许输入数量,
                maxRoomNum:1000,
                unSelectedRoom:[],              //不可选的房间
                getRoomInfoCallBack:function() {},   //通过中间变量动态设置选房的回调方法
                transRoomTag:[],
                setRoomNoTarget:null,    //需要设置房号的目标

                addPersonModal:false,      //外联人添加对话框
                selectManModal: false,
                isMultiple: true,        //单多选标志
                selectedMan: [],         //已选的人,[{},{}]
                disabledManTrans:[],     //不可选的人[str,str]
                selectType: "",          //多处调用选人,用此标志确定执行的回调,"booking":预订人,"checkIn":入住人,"housemate":同住人,可避免多次引用组件
                targetRow: {},           //当前操作房间 ,
                //页面初始化信息  //全部信息
                allData:{
                    hotelConfigReserveTypes:[],     //预订类型
                    hotelConfigChannels:[],         //渠道
                    hotelTaxStructureConfigs:[],    //房税结构
                    hotelTradeTypeConfigs:[],       //公付内容 交易类型
                    hotelPriceCodeConfigs:[],       //房价代码
                },
                // roomPriceCodeConfigs: [],   //房价代码配置信息
                customerData:[],            //会员列表
                unitCompanyList:[],         //协议单位列表
                loadingForUnit:false,      //协议单位远程搜索小遮罩
                formRules: hotelUtils.formValid,
                loadingInstance : null, //loading实例
            }
        },
        computed: {
            isDisabled() {
                if (this.reserveMenu === "3" || this.reserveMenu === "4") {
                    return true;
                }
                return false;
            },
            //通过计算属性做转换,,下面方便监听
            checkInTypeCopy() {
                return this.form.checkInType;
            },
            enterTimeCopy() {
                return this.form.enterTime;
            },
            outerTimeCopy() {
                return this.form.outerTime;
            }
        },
        watch: {
            //监听入住类型变化
            checkInTypeCopy: function () {
                this.dateType = hotelUtils.getDateTimePicker(this.form.checkInType);
                hotelUtils.updateDayNumber(this);
                hotelUtils.resetPriceCode(this.form.hotelOrderRoomList);
                if (this.dateType === "date") {
                    hotelUtils.setEnterTime(this);
                    hotelUtils.setOuterTime(this);
                }
            },
            enterTimeCopy:function () {
                enterTimebb = this.enterTimeCopy;
                hotelUtils.setEnterTime(this);
                hotelUtils.updateDayNumber(this);
                hotelUtils.updateRoomPrice(this.form,this);
            },
            outerTimeCopy:function () {
                hotelUtils.setOuterTime(this);
                hotelUtils.updateDayNumber(this);
                hotelUtils.updateRoomPrice(this.form,this);
            },
            dayNumber:function () {
                hotelUtils.updateOuterTime(this);
            },
            '$route'(to, from) {
                this.initFrom();
            },
        },
        created() {
            hotelUtils.getCurrentTime(this,"currentTime","currentTime");
            this.initPreparedData();
            hotelUtils.initAgreeUnit(this);
            this.initFrom();
        },
        mounted () {
            this.currentTime = dateFormat(new Date())
        },
        methods: {
            initFrom() {
                this.initFormDefault(); //先 重置表单
                this.parseUrl();        //后 根据路由配置表单参数
                this.dayNumber = "";    //清空天数
            },
            initPreparedData() {
                this.showLoading = true;
                let self = this;
                let url = "/zingbiz/hotel/hotelNew/getOrderDetailById";
                this.$httpSilent
                    .get(url, { params: {}})
                    .then(function (res) {
                        self.showLoading = false;
                        if (res.data.success) {
                            self.configTime = res.data.data.configTime;
                            self.checkOutTime = res.data.data.checkOutTime;
                            //酒店配置时间校验
                            hotelUtils.validHotelConfigTime(self);

                            self.allData = res.data.data;
                            hotelUtils.setFormDefaultVal(self.allData,self,{
                                reserveType:true,
                                channelType:true,
                            });
                        } else {
                            self.$message({ type: "error", message: res.data.mgs });
                        }
                    });
            },
            //初始化表单----由于多路由公用一个页面,,表单需要在路由改变时重新初始化
            initFormDefault () {
                if (this.$refs.form) {
                    try {
                        this.$refs.form.resetFields();
                    } catch (error) {
                        console.log(error);
                    }
                }
                this.form = {
                    reserveTypeId:'',
                    channelTypeId:'',
                    checkInType: "1",           //入住类型,默认值:全天房
                    customerType: "1",          //客户类型,默认值:普通
                    customerProperty: "1",      //客户性质,默认值:个人
                    hotelOrderRoomList: [],      //选择的房间
                    enterTime:"",
                    outerTime:"",
                    pubTradeCode:[]
                };
            },
            //通过路由参数,设置表单默认值, 参数type: 散客:1,团体:2,自用房:3,免费房:4
            parseUrl() {
                let query = this.$route.query;
                this.reserveMenu = query.reserveMenu;   //来自预订下
                //客户性质
                if (this.reserveMenu === '1' || this.reserveMenu === '2') {
                    this.form.customerProperty = this.reserveMenu;
                }

                //自用房和免费房
                if (this.reserveMenu === '3' || this.reserveMenu === '4') {
                    this.form.checkInType = this.reserveMenu;
                } else {
                    this.form.checkInType = '1';
                }

                //房态图入住
                if (query.roomState) {
                    if (!query.roomId || !query.roomNo || !query.roomTypeId || !query.roomTypeDesc) {
                        this.$message({message: "缺少参数", type: "warning"});
                    } else {
                        this.form.hotelOrderRoomList = [{
                            roomId: query.roomId,
                            roomNo: query.roomNo,
                            roomTypeId: query.roomTypeId,
                            roomTypeDesc: query.roomTypeDesc,
                            isPlaned: "true",
                        }]
                    }
                }
            },
            getUnitCompany (keyword) {
                hotelUtils.getUnitCompany(keyword,this);
            },
            famatCheckInType (val) {
                checkInTypeCopy = val;
            },
            famatReserveType(val) {
                this.form.reserveTypeId = val;
                this.form.reserveTypeDesc = this.$refs[val][0].label;
            },
            famatChannelType(val) {
                this.form.channelTypeId = val;
                this.form.channelTypeDesc = this.$refs[val][0].label;
            },
            famatCustomerName (val) {
                this.form.customerId = val;
                this.form.customerName = this.$refs[val][0].label;
            },

            //todo 外联人添加组件返回data,直接添加到对应预定人/入住人/同住人列表里
            okAddPerson(data) {
                console.log("add-man",data);
                hotelUtils.addExternalMan(data,this);
                this.addPersonModal = false;
            },
            usePersonSelect(flag) {
                if (flag) {
                    this.addPersonModal = false;
                    this.selectManModal = true;
                }
            },
            //添加预定人
            addBookingPeople() {
                hotelUtils.addBookingPeople(this);
            },
            //添加入住人
            addCheckInPeople(row) {
                hotelUtils.addCheckInPeople(this,row);
            },
            //添加同住人
            addHousemate(row) {
                hotelUtils.addHousemate(this,row);
            },
            //选人的回调: 页面有三处调用选人组件,根据一个flag标志使用不同的回调处理
            getExternalMan(list) {
                hotelUtils.getExternalMan(list,this);
                this.selectManModal = false;
            },
            //房间选择
            openSelectRoomModal() {
                console.log("enter", this.form.enterTime,"outer", this.form.outerTime);
                this.getRoomInfoCallBack = this.getRoomInfo;
                this.transRoomTag = this.form.hotelOrderRoomList;
                this.unSelectedRoom = [];
                this.maxRoomNum = 1000; //此处1000表示可选无上限,因为排房把manNum改成1了,得改回来
                this.isReserve = true;
                if (this.form.enterTime && this.form.outerTime) {
                    this.selectRoomModal = true;
                } else {
                    hotelUtils.ValidFormTime(this.form,this);
                }
            },
            //确定房间选择
            getRoomInfo(obj) {
                hotelUtils.getRoomInfo(obj,this);
                this.selectRoomModal = false;
            },
            //未排房的排房
            planRoom (row) {
                this.getRoomInfoCallBack = this.okPlanRoom;
                this.setRoomNoTarget = row;
                this.transRoomTag = [];
                this.isReserve = false;
                this.maxRoomNum = 1;
                this.unSelectedRoom = this.form.hotelOrderRoomList;
                if (this.form.enterTime && this.form.outerTime) {
                    this.selectRoomModal = true;
                } else {
                    hotelUtils.ValidFormTime(this.form,this);
                }
            },
            okPlanRoom (obj) {
                console.log("room",obj);
                if (obj.planed.length) {
                    this.$set(this.setRoomNoTarget,"roomId",obj.planed[0].roomId);
                    this.$set(this.setRoomNoTarget,"roomNo",obj.planed[0].roomNo);
                    this.$set(this.setRoomNoTarget,"roomTypeId",obj.planed[0].roomTypeId);
                    this.$set(this.setRoomNoTarget,"roomTypeDesc",obj.planed[0].roomTypeDesc);
                    this.$set(this.setRoomNoTarget,"isPlaned","true");
                }
                this.selectRoomModal = false;
            },
            //删除已选的房间
            closeTagRoom(room, index) {
                this.form.hotelOrderRoomList.splice(index, 1);
            },
            deleteTagRoom(index, row) {
                this.form.hotelOrderRoomList.splice(index, 1);
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
            //提交表单----------- todo 待优化-------
            confirmSubmit() {
                console.log("form", this.form);
                let self = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        //校验数据
                        if (!self.form.hotelOrderRoomList.length) {
                            self.$message({ type: "warning", message: "请选择房间" });
                            return;
                        }
                        //重新请求房间, 校验可用性
                        let param = {
                            enterTime: self.form.enterTime,
                            outerTime: self.form.outerTime
                        };
                        let roomListUrl = "/zingbiz/hotel/hotelNew/getHotelRoomSelectInfo";
                        self.$httpSilent
                            .get(roomListUrl, { params:param })
                            .then(res => {
                                if (res.data.success) {
                                    let roomList = res.data.data.roomInfo;
                                    let flag = true;
                                    let unable = [];
                                    self.form.hotelOrderRoomList.forEach(room => {
                                        roomList.forEach(roomType => {
                                            if (room.roomTypeId === roomType.roomTypeId) {
                                                let rooms = roomType.hotelRoomInfos ? roomType.hotelRoomInfos : [];
                                                rooms.forEach(item => {
                                                    if (room.roomId === item.roomId) {
                                                        if (item.roomStatus === "-1") {
                                                            flag = false;
                                                            unable.push(item.roomNo);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    if (!flag) {
                                        self.$message({ type: "warning", message: unable.join(" ") + " 号房间在此时间段不可用" });
                                    } else {
                                       //处理表单数据
                                        hotelUtils.handleFormData(this,this.form);
                                        this.form.orderType = "0";              //预订 标志
                                        if (this.form.pubTradeCode) {
                                            this.form.pubTradeCode = this.form.pubTradeCode.join(" ");  //处理公付内容
                                        }
                                        console.log("form after", this.form);

                                        this.loadingInstance = this.$loading({});
                                        let url = "/zingbiz/hotel/hotelNew/saveOrderInfo";
                                        this.$httpSilent
                                            .post(url, this.form)
                                            .then(function (res) {
                                                self.loadingInstance.close();
                                                if (res.data.success) {
                                                    console.log("提交",res.data);
                                                    self.$message({ type: "success", message: "预订成功" });
                                                    self.initFrom();
                                                } else {
                                                    self.$message({ type: "error", message: "预订失败" });
                                                }
                                            });
                                    }
                                } else {
                                    self.$message({ type: "error", message: "房间校验失败" });
                                }
                            });
                    }
                });
            },
        }
    }
</script>
<style scoped>
    .el-row{
        margin-bottom: 0!important;
    }
    .bold {
        font-weight: bold;
    }
    .font20 {
        font-size: 20px;
    }
    .p10 {
        padding: 6px;
    }
    .line {
        border-bottom: 1px solid darkgrey;
    }
    .el-input {
        width: auto;
    }
    .el-row, .el-form-item {
        margin-bottom: 15px;
    }
</style>
