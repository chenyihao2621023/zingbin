<template>
    <div>
        <el-dialog :visible.sync="show" width="65%" title="修改订单" :before-close="handleClose" append-to-body>
            <div v-loading="showLoading">
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
                    <el-row v-if="orderData.orderType ==='0'">
                        <el-col :span="formItemWidth">
                            <el-form-item label="预订人" prop="reserveId">
                                <el-input type="hidden" v-model="form.reserveId"></el-input>
                                <el-tag v-show="form.reserveId">{{form.reserveName}}</el-tag>
                                <el-button :disabled="isDisabled01" class="button-new-tag" size="small" @click="addBookingPeople">+ 添加预订人</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="预订类型" prop="reserveTypeId">
                                <el-select :disabled="isDisabled01" v-model="form.reserveTypeId" @change="famatReserveType" placeholder="请选择预订类型" size="small">
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
                                <el-select v-model="form.checkInType" @change="famatCheckInType" placeholder="请选择入住类型" size="small">
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
                                <el-select :disabled="isDisabled01" clearable v-model="form.customerId" @change="famatCustomerName" placeholder="请选择会员" size="small">
                                    <el-option v-for="(row,index) in customerData" :key="index" :label="row.name" :value="row.rowId" :ref="row.rowId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :disabled="isDisabled01" v-if="form.customerType === '4'" label="协议单位" prop="customerId">
                                <el-select v-model="form.customerId" @change="famatCustomerName" clearable filterable remote :remote-method="getUnitCompany" :loading="loadingForUnit" placeholder="请输入单位名称关键词" size="small">
                                    <el-option v-for="item in unitCompanyList" :key="item.agreeUnitId" :label="item.agreeUnitName" :value="item.agreeUnitId" :ref="item.agreeUnitId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="客户性质" prop="customerProperty">
                        <el-radio-group v-model="form.customerProperty" :disabled="isDisabled01" size="small">
                            <el-radio label="1">个人</el-radio>
                            <el-radio label="2">团队</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row v-if="form.customerProperty ==='2'">
                        <el-col :span="formItemWidth">
                            <el-form-item label="团队名称" prop="groupName">
                                <el-input :disabled="isDisabled02" v-model="form.groupName" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="公付内容" prop="pubTradeCode">
                                <el-select :disabled="isDisabled01" multiple clearable v-model="form.pubTradeCode" placeholder="请选择公付内容" size="small">
                                    <el-option v-for="(row,index) in allData.hotelTradeTypeConfigs" :key="index" :label="row.descript" :value="row.rowId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!--时间选择器-->
                    <el-row>
                        <el-col :span="formItemWidth">
                            <el-form-item label="入住时间" prop="enterTime">
                                <el-date-picker :disabled="isDisabled01" v-model="form.enterTime" value-format="yyyy-MM-dd HH:mm:ss"
                                                :type="dateType" :picker-options="disableTime01" placeholder="选择日期时间" size="small"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="formItemWidth">
                            <el-form-item label="离店时间" prop="outerTime">
                                <el-date-picker v-model="form.outerTime" :picker-options="disableTime02" value-format="yyyy-MM-dd HH:mm:ss" size="small"
                                                :type="dateType" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form.checkInType !='2'" :span="formItemWidth">
                            <el-form-item label="天数" prop="dayNumber">
                                <el-input type="number" v-model="dayNumber" min="1" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="选择房间" prop="hotelOrderRoomList">
                        <el-tag v-for="(room,index) in form.hotelOrderRoomList" :key="room.roomId"
                                @close="closeTagRoom(room,index)"
                                :type="room.roomTypeDesc">{{room.roomNo?room.roomNo:"未排房"}}
                        </el-tag>
                        <el-button class="button-new-tag" @click="openSelectRoomModal" size="small">+ 添加房间</el-button>
                    </el-form-item>
                    <el-form-item label="入住信息" v-show="form.hotelOrderRoomList && form.hotelOrderRoomList.length >0">
                        <el-table :data="form.hotelOrderRoomList" border align="center" max-height="400">
                            <el-table-column prop="roomNo" label="房号" width="80">
                                <template slot-scope="scope" >
                                    <el-button v-if="scope.row.isPlaned==='false'" class="button-new-tag" @click="planRoom(scope.row)" size="small">排房</el-button>
                                    <span v-else>{{scope.row.roomNo}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="roomTypeDesc" label="房型"></el-table-column>
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
                                             v-if="obj.personSign === '0'" @click.native="addCheckInPeople(scope.row)">
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
                                    <el-select v-model="scope.row.taxStructureDesc" style="margin-left: 20px;" clearable placeholder="请选择"
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
                            <el-table-column label="操作" width="80" fixed="right">
                                <template slot-scope="scope">
                                    <el-button @click="closeTagRoom(scope.row,scope.$index)" :disabled="scope.row.status==='2'" type="text" size="small">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <!--<div v-if="orderData.orderType==='1' && orderData.orderStatus !='2'" class="expenseDetail">-->
                        <!--<div class="p10 line">-->
                            <!--<span class="bold p10 font20">押金信息</span>-->
                        <!--</div>-->
                        <!--<el-form-item label="收取押金">-->
                            <!--<el-radio-group v-model="form.depositPayType" @change="payTypeChange" size="small">-->
                                <!--<el-radio label="0">现付</el-radio>-->
                                <!--<el-radio label="1">信用卡预授权</el-radio>-->
                                <!--<el-radio label="2">无押金</el-radio>-->
                            <!--</el-radio-group>-->
                        <!--</el-form-item>-->
                        <!--<el-row v-if="form.depositPayType ==='0'">-->
                            <!--<el-col :span="formItemWidth">-->
                                <!--<el-form-item label="收取方式" prop="businessItem" key="businessItem">-->
                                    <!--<el-select v-model="form.businessItem" @change="selectPaytype" placeholder="请选择收款方式" clearable size="small">-->
                                        <!--<el-option v-for="row in allData.hotelTradeCodeConfigs" :key="row.rowId" :label="row.descript" :value="row.rowId" :ref="row.rowId"></el-option>-->
                                    <!--</el-select>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="formItemWidth">-->
                                <!--<el-form-item label="收款金额" prop="deposit" key="deposit">-->
                                    <!--<el-input :disabled="!form.businessItem" v-model="form.deposit" size="small"></el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row v-if="form.depositPayType ==='1'">-->
                            <!--<el-col :span="formItemWidth">-->
                                <!--<el-form-item label="银行卡号" key="bankCardNo">-->
                                    <!--<el-input v-model="form.bankCardNo" size="small"></el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="formItemWidth">-->
                                <!--<el-form-item label="预授权号" key="licenseNo">-->
                                    <!--<el-input v-model="form.licenseNo" size="small"></el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="formItemWidth">-->
                                <!--<el-form-item label="授权金额" key="licenseAmount">-->
                                    <!--<el-input v-model="form.licenseAmount" size="small"></el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-form-item label="入账房间" prop="depositBelongTo" v-if="form.depositPayType != '2'">-->
                            <!--<el-select v-model="form.depositBelongTo" placeholder="请选择房间" size="small">-->
                                <!--<el-option v-if="form.hotelOrderRoomList.length > 1 || form.customerProperty === '2'" label="虚拟账户" value="0"></el-option>-->
                                <!--<el-option v-for="(room,index) in form.hotelOrderRoomList" :key="room.roomId" :label="room.roomNo" :value="room.roomId"></el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item prop="isDepositReceipt" v-if="form.depositPayType != '2'">-->
                            <!--<el-checkbox v-model="form.isDepositReceipt">打印收据</el-checkbox>-->
                        <!--</el-form-item>-->
                        <!--&lt;!&ndash;<el-form-item label="销售员">&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-button v-show="!form.salePersonId" class="button-new-tag" size="small" @click="addSalePeople">+ 添加销售员</el-button>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-tag v-show="form.salePersonId" closable @close="delSalepeople" @click.native="addSalePeople">&ndash;&gt;-->
                                <!--&lt;!&ndash;{{form.salePerson}}&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-tag>&ndash;&gt;-->
                            <!--&lt;!&ndash;<input hidden v-model="form.salePersonId"></input>&ndash;&gt;-->
                        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                    <!--</div>-->
                </el-form>
                <div slot="footer" class="dialog-footer flex-right">
                    <el-button @click="handleClose" size="small">取 消</el-button>
                    <el-button type="primary" @click="confirmSubmit" size="small">确 定</el-button>
                </div>
            </div>
        </el-dialog>

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
    </div>
</template>
<script>
    /**-----该组件用于处理订单的修改----*/
    import SelectRoom from "../components/selectRoom/SelectRoom";
    import ExternalMan from "../components/external/ExternalMan";
    import ExternalManAdd from "../components/external/ExternalManAdd";
    import hotelUtils from "../commonJs/orderHandleJs";
    import { deepCopy } from '../../../utils/fn'
    var enterTimebb = "";
    var checkInTypeCopy = "";
    export default {
        name: "edit-order",
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
                    return null;
                }
            },
            rowId:{
                type:String,
                default:""
            }
        },
        data() {
            return {
                //todo 以下有些变量不能轻易改动名称,改动时请注意 orderHandleJs 中的引用情况 后期再优化调整
                showLoading:false,
                currentTime:"",

                formItemWidth: 10,
                form: {
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
                        if (checkInTypeCopy) {
                            return time.getTime() < new Date(new Date(enterTimebb).setHours(0,0,0,0)).getTime();
                        }
                        return time.getTime() < new Date(enterTimebb).getTime();
                    },
                },
                selectRoomModal: false,     //房间选择组件可见性
                isReserve:false,             //是否允许输入数量,
                maxRoomNum:1000,
                unSelectedRoom:[],          //不可选的房间
                getRoomInfoCallBack:function() {},   //通过中间变量动态设置选房的回调方法
                transRoomTag:[],
                setRoomNoTarget:null,           //需要设置房号的目标

                selectManModal: false,      //选人组件可见性开关
                addPersonModal:false,      //外联人添加对话框
                isMultiple: true,           //单多选标志
                selectedMan: [],         //已选的人,[{},{}]
                disabledManTrans:[],     //不可选的人[str,str]
                selectType: "",             //多处调用选人,用此标志区分回调,"booking":预订人,"checkIn":入住人,"housemate":同住人,可避免多次引用组件
                targetRow: {},               //当前操作房间 ,


                orderData:{},
                //页面初始化信息   //全部信息
                allData:{
                    hotelConfigReserveTypes:[],     //预订类型
                    hotelConfigChannels:[],         //渠道
                    hotelPriceCodeConfigs:[],       //房价代码
                    hotelTaxStructureConfigs:[],    //房税结构
                    hotelTradeTypeConfigs:[],       //交易类型,公付内容
                    hotelTradeCodeConfigs:[],       //交易押金支付类型
                },
                customerData:[],
                unitCompanyList:[],         //协议单位列表
                loadingForUnit:false,      //协议单位远程搜索小遮罩
                formRules:hotelUtils.formValid,
                loadingInstance : null, //loading实例

                formReady:false,        //form表单是否准备好,入住类型的变动会重置房价,因此,form表单首次渲染时利用此flag,不重置
            }
        },
        computed: {
            isDisabled02() {
                let list = this.orderData.hotelOrderRoomList;
                let flag = false;
                list.forEach(row => {
                    if (row.roomNo) {
                        flag = true;
                    }
                });
                if ((this.orderData.orderType === "0" && this.orderData.customerProperty === "2" && !flag) || this.orderData.orderStatus === "2") {
                    return true;
                }
                return false;
            },
            isDisabled01 () {
                if (this.orderData.orderStatus === "2" || (this.orderData.groupName && this.orderData.groupName.charAt(0) === "联")) {
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
            show:function (isShow) {
                if (isShow) {
                    hotelUtils.getCurrentTime(this,"currentTime","currentTime");
                    this.initPreparedData();
                } else {
                    this.form = {
                        reserveId: "",
                        reserveTypeId: "",
                        channelTypeId: "",
                        checkInType: "",
                        customerType: "",
                        customerProperty: "",
                        enterTime:"",
                        outerTime:"",
                        hotelOrderRoomList: [],
                        pubTradeCode:[]
                    };
                }
            },
            //监听入住类型变化
            checkInTypeCopy: function () {
                this.dateType = hotelUtils.getDateTimePicker(this.form.checkInType);
                if (this.formReady) {
                    hotelUtils.resetPriceCode(this.form.hotelOrderRoomList);
                }
                hotelUtils.updateDayNumber(this);
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
        },
        created() {
            // this.initPreparedData();
            hotelUtils.initAgreeUnit(this);
        },
        methods: {
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
                            self.configTime = res.data.data.configTime;
                            self.checkOutTime = res.data.data.checkOutTime;
                            //酒店配置时间校验
                            hotelUtils.validHotelConfigTime(self);
                            self.allData = res.data.data;
                            self.orderData = res.data.data.hotelOrders;

                            //form表单渲染完之前防止入住类型变化,造成价格代码被重置
                            self.formReady = false;
                            self.$nextTick(() => {
                                self.formReady = true;
                            })
                            self.form = hotelUtils.handleOrderData(deepCopy(res.data.data.hotelOrders));
                        } else {
                            self.$message({ type: "error",message: res.data.mgs });
                        }
                    });
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
            //未排房的进行排房
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
                //如果房间在店,不可删除
                for (let i = 0; i < this.orderData.hotelOrderRoomList.length; i++) {
                    let roomObj = this.orderData.hotelOrderRoomList[i];
                    if (roomObj.roomId === room.roomId) {
                        if (roomObj.status === "2") {
                            this.$message({ type: "warning", message: "在店的房间不允许删除" });
                            return;
                        }
                    }
                }
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
            //提交表单
            confirmSubmit() {
                let self = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        //校验数据
                        if (!self.form.hotelOrderRoomList.length) {
                            self.$message({ type: "warning", message: "请选择房间" });
                            return;
                        }

                        //处理表单数据
                        hotelUtils.handleFormData(this,this.form);
                        if (this.form.pubTradeCode) {
                            this.form.pubTradeCode = this.form.pubTradeCode.join(" ");  //处理公付内容
                        }
                        let params = {
                            hotelOrders : this.form,
                            oldRoomsData:this.orderData.hotelOrderRoomList,
                            newRoomsData:this.form.hotelOrderRoomList,
                            orderId:this.orderData.orderId,
                        }
                        console.log("form after", params);
                        //修改订单
                        this.loadingInstance = this.$loading({});
                        let url = "/zingbiz/hotelNew/hotelOrder/updateOrders";
                        this.$httpSilent
                            .post(url, params)
                            .then(function (res) {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    if (res.data.data.length > 0 ) {
                                        self.$message({ type: "success", message: res.data.data.join(",") + "在此时间段不可用" });
                                    } else {
                                        self.$message({ type: "success", message: "保存成功" });
                                        self.$emit("confirm",true);
                                    }
                                } else {
                                    self.$message({ type: "error", message: "保存失败" });
                                    self.$emit("confirm",false);
                                }
                            }).catch(error => {
                                self.$emit("cancel",false);
                        });
                    }
                });
            },
            handleClose(done) {
                this.$emit("cancel",false);
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
