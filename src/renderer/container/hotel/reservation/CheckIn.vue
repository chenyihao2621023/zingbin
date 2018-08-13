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
                        <el-form-item label="渠道" prop="channelTypeId">
                            <el-select v-model="form.channelTypeId" @change="famatChannelType" placeholder="请选择渠道类型" size="small">
                                <el-option v-for="row in allData.hotelConfigChannels" :key="row.rowId" :label="row.configValue"
                                           :ref="row.rowId"
                                           :value="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="入住类型" prop="checkInType">
                            <el-select :disabled="isDisabled" v-model="form.checkInType" @change="famatCheckInType"  placeholder="请选择入住类型" size="small">
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
                                <el-option v-for="(row,index) in customerData" :key="index" :label="row.name"
                                           :value="row.rowId" :ref="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.customerType === '4'" label="协议单位" prop="customerId">
                            <!--<el-select v-model="form.customerId" @change="famatCustomerName" placeholder="请选择协议单位" size="small">-->
                                <!--<el-option v-for="(row,index) in agreeUnitData" :key="index" :label="row.agreeUnitName"-->
                                           <!--:value="row.agreeUnitId" :ref="row.agreeUnitId"></el-option>-->
                            <!--</el-select>-->
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
                                <el-option v-for="(row,index) in allData.hotelTradeTypeConfigs" :key="index"
                                           :label="row.descript" :value="row.rowId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--时间选择器-->
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="入住时间" prop="enterTime">
                            <el-date-picker v-model="form.enterTime" disabled value-format="yyyy-MM-dd HH:mm:ss"
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
                            :type="room.roomTypeDesc">{{room.roomNo}}
                    </el-tag>
                    <el-button class="button-new-tag" @click="openSelectRoomModal" size="small">+ 添加房间</el-button>
                </el-form-item>
                <el-form-item label="入住信息" v-show="form.hotelOrderRoomList.length >0">
                    <el-table :data="form.hotelOrderRoomList" border align="center">
                        <el-table-column prop="roomNo" label="房号" width="80">

                        </el-table-column>
                        <el-table-column prop="roomTypeDesc" label="房型" width="80"></el-table-column>
                        <el-table-column prop="price" label="房价(平/末)" width="150">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.priceCodeId" clearable
                                           @change="selectPriceCode($event,scope.row)"
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
                                             v-if="obj.personSign === '0'" @click.native="addCheckInPeople(scope.row)">
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                                <el-button v-show="!scope.row.checkInPeople || !scope.row.checkInPeople.length" @click="addCheckInPeople(scope.row)" size="small" type="text">添加入住人
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="同住人">
                            <template slot-scope="scope">
                                <span v-show="scope.row.housemate && scope.row.housemate.length>0">
                                    <el-tag v-for="(obj,index) in scope.row.housemate" :key="index"
                                            v-if="obj.personSign === '1'">
                                        {{obj.contactsName}}
                                    </el-tag>
                                </span>
                                <el-button size="small" @click="addHousemate(scope.row)" type="text">添加同住人</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="房税结构" width="150">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.taxStructureDesc" clearable style="margin-left: 20px;" size="small"
                                           placeholder="请选择" @change="selectTaxStructure($event,scope.row)" collapse-tags>
                                    <el-option v-for="item in allData.hotelTaxStructureConfigs" :key="item.rowId"
                                               :label="item.detailDesc" :ref="item.rowId" :value="item.rowId">
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
                <div class="expenseDetail">
                    <div class="p10 line">
                        <span class="bold p10 font20">押金信息</span>
                    </div>
                    <el-form-item label="收取押金">
                        <el-radio-group v-model="form.depositPayType" @change="payTypeChange" size="small">
                            <el-radio label="0">现付</el-radio>
                            <el-radio label="1">信用卡预授权</el-radio>
                            <el-radio label="2">无押金</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row v-if="form.depositPayType ==='0'">
                        <el-col :span="formItemWidth">
                            <el-form-item label="收取方式" prop="businessItem" key="businessItem">
                                <el-select v-model="form.businessItem" @change="selectPaytype" placeholder="请选择收款方式" clearable size="small">
                                    <el-option v-for="row in allData.hotelTradeCodeConfigs" :key="row.rowId" :label="row.descript" :value="row.rowId" :ref="row.rowId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="收款金额" prop="deposit" key="deposit">
                                <el-input :disabled="!form.businessItem" v-model="form.deposit" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.depositPayType ==='1'">
                        <el-col :span="formItemWidth">
                            <el-form-item label="银行卡号" key="bankCardNo">
                                <el-input v-model="form.bankCardNo" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="预授权号" key="licenseNo">
                                <el-input v-model="form.licenseNo" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="授权金额" key="licenseAmount">
                                <el-input v-model="form.licenseAmount" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="入账房间" prop="depositBelongTo" v-if="form.depositPayType != '2'">
                        <el-select v-model="form.depositBelongTo" placeholder="请选择房间" size="small">
                            <el-option v-if="form.hotelOrderRoomList.length > 1 || form.customerProperty === '2'" label="虚拟账户" value="0"></el-option>
                            <el-option v-for="(room,index) in form.hotelOrderRoomList" :key="room.roomId" :label="room.roomNo" :value="room.roomId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="isDepositReceipt" v-if="form.depositPayType != '2'">
                        <el-checkbox v-model="form.isDepositReceipt">打印收据</el-checkbox>
                    </el-form-item>
                    <el-form-item label="销售员">
                        <el-button v-show="!form.salePersonId" class="button-new-tag" size="small" @click="addSalePeople">+ 添加销售员</el-button>
                        <el-tag v-show="form.salePersonId" closable @close="delSalepeople" @click.native="addSalePeople">
                            {{form.salePerson}}
                        </el-tag>
                        <input hidden v-model="form.salePersonId"></input>
                    </el-form-item>
                </div>
            </el-form>
            <span>
                <el-button type="primary" @click="confirmSubmit">确 定</el-button>
            </span>
        </el-main>
        <!--引用组件集合-->
        <div class="components">
            <select-room :show="selectRoomModal" :enterTime="form.enterTime" :outerTime="form.outerTime"
                         :tags="form.hotelOrderRoomList" @cancel="selectRoomModal=false"
                         @callback="getRoomInfo"></select-room>
            <external-man :tags="selectedMan" :disabledMan="disabledManTrans" :show="selectManModal"
                          @cancel="selectManModal=false"
                          :multiline="isMultiple" @callback="getExternalMan">
            </external-man>
            <external-man-add :append="true" :title="'添加外联人'" :show="addPersonModal" :showSelectBtn="true"
                              @cancel="addPersonModal=false" @callback="okAddPerson" @usePersonSelect="usePersonSelect">
            </external-man-add>
            <DepositData :printDepositData="printDepositData"></DepositData>
            <org-member-picker :showTab="showTab" :initialSelected="[]" :showPicker="showOrgSelectModal"
                               :multiple="false" @picked="okSelectMember" @abort="showOrgSelectModal=false">
            </org-member-picker>
        </div>
    </el-container>
</template>
<script>

    import DepositData  from '../printTemplate/DepositData';
    import Registration from '../printTemplate/Registration';
    import SelectRoom from "../components/selectRoom/SelectRoom";
    import ExternalMan from "../components/external/ExternalMan";
    import ExternalManAdd from "../components/external/ExternalManAdd";
    import hotelUtils from "../commonJs/orderHandleJs";
    import formatHotelJs from "../commonJs/formatHotelJs";
    import { dateFormat } from "../../../utils/date";
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    var enterTimebb = "";
    var checkInTypeCopy = "";
    export default {
        name: "CheckIn",
        components: {
            SelectRoom, ExternalMan,  DepositData,Registration,OrgMemberPicker,ExternalManAdd
        },
        data() {
            return {
                //todo 以下有些变量不能轻易改动名称,改动时请注意 orderHandleJs 中的引用情况 后期再优化调整
                showLoading: false,
                currentTime:"",

                formItemWidth: 6,
                checkInMenu: "",            //来自入住菜单类型
                form: {
                    pubTradeCode:[],
                    depositPayType:"0"
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
                        if (checkInTypeCopy === "2") {
                            return time.getTime() < new Date(new Date(enterTimebb).setHours(0,0,0,0)).getTime();
                        } else {
                            return time.getTime() <= new Date(new Date(enterTimebb).setHours(0,0,0,0)).getTime();
                        }
                    },
                },
                selectRoomModal: false,  //房间选择组件可见性
                addPersonModal:false,      //外联人添加对话框
                selectManModal: false,      //外联人选择对话框
                isMultiple: true,        //单多选标志
                selectedMan: [],         //已选的人,[{},{}]
                disabledManTrans: [],     //不可选的人[str,str]
                selectType: "",          //多处调用选人,用此标志确定执行的回调,"booking":预订人,"checkIn":入住人,"housemate":同住人,salePeople:销售员,....可避免多次引用组件
                targetRow: {},           //当前操作房间 ,
                //页面初始化信息    //全部信息
                allData:{
                    hotelConfigReserveTypes:[],     //预订类型
                    hotelConfigChannels:[],         //渠道
                    hotelPriceCodeConfigs:[],       //房价代码
                    hotelTaxStructureConfigs:[],    //房税结构
                    hotelTradeTypeConfigs:[],       //交易类型,即公付内容
                    hotelTradeCodeConfigs:[],       //交易押金支付类型
                },
                customerData: [],                   //会员列表
                unitCompanyList:[],                 //协议单位列表
                loadingForUnit:false,               //协议单位远程搜索小遮罩
                printDepositData:"",                //押金打印单参数
                formRules: hotelUtils.formValid,    //表单校验规则
                loadingInstance: null,              //loading实例
                showTab:["colleague"],              //选人组件tab显示
                showOrgSelectModal:false,
            }
        },
        computed: {
            isDisabled() {
                if (this.checkInMenu === "3" || this.checkInMenu === "4") {
                    return true;
                }
                return false;
            },
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
            checkInTypeCopy: function () {
                this.dateType = hotelUtils.getDateTimePicker(this.form.checkInType);
                hotelUtils.updateDayNumber(this);
                hotelUtils.resetPriceCode(this.form.hotelOrderRoomList);
            },
            enterTimeCopy:function () {
                enterTimebb = this.enterTimeCopy;
                hotelUtils.setCheckInEnterTime(this);
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
            configTime:function () {
                this.setDefaultEnterTime();
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
            },
            initPreparedData() {
                let self = this;
                this.showLoading = true;
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
                            hotelUtils.setFormDefaultVal(self.allData,self,{    //设置默认值,下拉第一个
                                reserveType:false,
                                channelType:true,
                            });
                        } else {
                            self.$message({ type: "error", message: res.data.mgs });
                        }
                    });
            },
            //初始化表单----由于多路由公用一个页面,,表单需要在路由改变时重新初始化
            initFormDefault() {
                if (this.$refs.form) {
                    try {
                        this.$refs.form.resetFields();
                    } catch (error) {
                        console.log("error",error);
                    }
                }
                 this.form = {
                     channelTypeId:'',
                     checkInType: "1",           //入住类型,默认值:全天房
                     customerType: "1",          //客户类型,默认值:普通
                     customerProperty: "1",      //客户性质,默认值:个人
                     hotelOrderRoomList: [],      //选择的房间
                     enterTime: "",
                     outerTime: "",
                     pubTradeCode:[],            //需要先定义数组
                     depositPayType:"0",
                     isDepositReceipt:false,
                };
                this.setDefaultEnterTime();
            },
            //根据当前时间判断入住日期选择
            setDefaultEnterTime () {
                let configArr = this.configTime.split(":");
                //如果当前时间点小于夜审时间点,入住日期取前一天日期
                if (new Date().getTime() > new Date().setHours(configArr[0],configArr[1],configArr[2],0)) {
                    this.form.enterTime = dateFormat(new Date());
                } else {
                    this.form.enterTime = dateFormat(new Date(new Date().getTime() - 3600 * 1000 * 24));
                }
            },
            //通过路由参数,设置表单默认值, 参数type: 散客:1,团体:2,自用房:3,免费房:4
            parseUrl() {
                let query = this.$route.query;
                this.checkInMenu = query.checkInMenu;   //来自入住下
                //客户性质
                if (this.checkInMenu === '1' || this.checkInMenu === '2') {
                    this.form.customerProperty = this.checkInMenu;
                }
                //自用房和免费房
                if (this.checkInMenu === '3' || this.checkInMenu === '4') {
                    this.form.checkInType = this.checkInMenu;
                } else {
                    this.form.checkInType = '1';
                }
                //重新入住
                if (query.copyCheckIn) {
                    let order = query.order;
                    this.form = Object.assign({},this.form,JSON.parse(order));
                }
                //房态图入住
                else if (query.roomState) {
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
                //续住
                else if (this.$route.query.room) {
                    //房态图 续住
                    let params = this.$route.query.room;
                    //todo  待完成
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
            famatCustomerName(val) {
                this.form.customerId = val;
                this.form.customerName = this.$refs[val][0].label;
            },
            //添加销售员
            addSalePeople() {
                this.showOrgSelectModal = true;
            },
            //销售人员回调
            okSelectMember(list) {
                hotelUtils.getSalePerson(this.form,list);
                this.showOrgSelectModal = false;
            },
            delSalepeople() {
                this.form.salePersonId = "";
                this.form.salePerson = "";
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
                console.log("enter", this.form.enterTime);
                console.log("outer", this.form.outerTime);
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
            //选择押金付款方式
            selectPaytype (val) {
                this.form.businessItem = val;
                this.form.businessItemDesc = this.$refs[val][0].label;
            },
            payTypeChange(val) {
                if ("0" === val) {
                    this.form.bankCardNo = this.form.licenseNo = this.form.licenseAmount = "";
                } else if ("1" === val) {
                    this.form.businessItem = this.form.businessItemDesc = this.form.deposit = "";
                } else if (val === "2") {
                    this.form.businessItem = this.form.businessItemDesc = this.form.deposit = "";
                    this.form.bankCardNo = this.form.licenseNo = this.form.licenseAmount = "";
                    this.form.isDepositReceipt = false;
                }
            },
            //提交表单----------- todo 待优化-------
            confirmSubmit() {
                console.log("form", this.form);
                let self = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        //校验数据
                        if (!self.form.hotelOrderRoomList.length) {
                            self.$message({type: "warning", message: "请选择房间"});
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
                                        self.$message({type: "warning", message: unable.join(" ") + " 号房间在此时间段不可用"});
                                    }
                                    else {
                                        //校验完成,处理表单数据
                                        let boolean = hotelUtils.handleFormDataForCheckIn(this,this.form);
                                        if (!boolean) {
                                            return;
                                        }

                                        if (this.form.pubTradeCode) {
                                            this.form.pubTradeCode = this.form.pubTradeCode.join(" ");  //处理公付内容
                                        }
                                        this.form.orderType = "1";          //直接入住标志
                                        console.log("form after", this.form);
                                        this.loadingInstance = this.$loading({});
                                        let url = "/zingbiz/hotel/hotelNew/saveOrderInfo";
                                        this.$httpSilent
                                            .post(url, this.form)
                                            .then(function (res) {
                                                self.loadingInstance.close();
                                                if (res.data.success) {
                                                    console.log("提交", res.data);
                                                    self.$message({type: "success", message: "保存成功"});
                                                    //判断是否打印押金凭证
                                                    if (self.form.isDepositReceipt) {
                                                        let depositData = {
                                                            operatorName:self.allData.operatorName,
                                                            orderId:res.data.data.orderId,
                                                            deposit: self.getDeposit(),
                                                        }
                                                        if (self.form.depositBelongTo === "0") {
                                                            depositData.roomNo = "";
                                                            depositData.guestName = res.data.data.groupName;
                                                        } else {
                                                            let roomObj = self.getPersonByRoomId(self.form.depositBelongTo);
                                                            depositData.roomNo = roomObj.roomNo;
                                                            depositData.guestName = roomObj.checkInPersonName;
                                                            depositData.note = roomObj.remark;
                                                        }
                                                        self.printDeposit(depositData);
                                                    }
                                                    self.initFrom();
                                                } else {
                                                    self.$message({type: "error", message: "保存失败"});
                                                }
                                            });
                                    }
                                }
                            })
                    }
                });
            },
            getPersonByRoomId(roomId) {
                let length = this.form.hotelOrderRoomList.length;
                for (let i = 0; i < length; i++) {
                    let room =  this.form.hotelOrderRoomList[i];
                    if (room.roomId === roomId) {
                        return room;
                    }
                }
            },
            getDeposit() {
                if (this.form.depositPayType === "0") {
                    return this.form.deposit;
                } else if (this.form.depositPayType === "1") {
                    return this.form.licenseAmount;
                }
            },
            printDeposit(depositData) {
                this.printDepositData = depositData;
                //打印模版渲染完成调取打印
                this.$nextTick(() => {
                    formatHotelJs.printTemplateByDomId("depositBillTemplate",true);
                })
            }
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
