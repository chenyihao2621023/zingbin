<template>
    <el-container>
        <el-main>
            <div class="padding">
                <el-form :inline="true" :model="searchParam" class="demo-form-inline">
                    <el-form-item size="small">
                        <el-input v-model="searchParam.useName" clearable placeholder="请输入会员姓名(选填)"></el-input>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-input v-model="searchParam.useTel" clearable placeholder="请输入会员手机号(选填)"></el-input>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-button type="primary el-button--small" @click="search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="padding">
                <el-button size="small" @click="setLabelFun">打标签</el-button>
                <el-button size="small" @click="setIntegral">修改积分</el-button>
                <el-button size="small" @click="setGrade">设置等级</el-button>
            </div>
            <div class="padding">
                <el-table tooltip-effect="dark" :data="balanceData" border maxHeight="400" style="width: 100%"
                          v-loading="showLoading" @row-click="rowClick" @select="selectOne" @select-all="selectAll">
                    <el-table-column fixed type="selection" :selectable='checkboxInit' width="35"></el-table-column>
                    <el-table-column fixed prop="useName" label="会员姓名" min-width="80"></el-table-column>
                    <el-table-column prop="memberName" label="会员卡级别" min-width="110"></el-table-column>
                    <el-table-column prop="amount" label="可用余额" min-width="80"></el-table-column>
                    <el-table-column prop="point" label="可用积分" min-width="80"></el-table-column>
                    <el-table-column prop="addAmount" label="累计交易金额" sortable min-width="130"></el-table-column>
                    <el-table-column prop="tradeNumber" label="交易次数" sortable min-width="110"></el-table-column>
                    <el-table-column prop="genTimes" label="上次交易时间" min-width="110">
                        <template slot-scope="scope">
                            {{Number(scope.row.tradeNumber) === 0 ? "" : scope.row.genTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="labelName" label="标签" min-width="100"></el-table-column>
                    <el-table-column prop="operation" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="detailDialog(scope.row)">详情</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="setGrade(scope.row)">等级</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="setIntegral(scope.row)">积分</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="toRecharge(scope.row)">充值</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="toCost(scope.row)">消费</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="frozen(scope.row)">冻结</el-button>
                            <el-button v-show="scope.row.memberType && scope.row.memberType === '1'"
                                       class="operation" type="text" size="small" @click="frozen(scope.row)">解除冻结</el-button>
                            <el-button v-show="!scope.row.memberType || scope.row.memberType === '0'"
                                       class="operation" type="text" size="small" @click="setLabelFun(scope.row)">编辑标签</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right padding">
                <el-pagination background @current-change="currentPage" :page-size="pageSize" layout="prev, pager, next"
                               :total="total"></el-pagination>
            </div>

            <el-dialog class="detail" title="会员详情" :visible.sync="detail" width="65%">
                <div class="detailTop padding">
                    <el-col :span="2">
                        <avatar class="headImg"></avatar>
                    </el-col>
                    <el-col :span="22" style="padding: 10px;padding-top: 0px">
                        <div class="customerName">
                            <div>{{clickRowItem && clickRowItem.useName}}（ {{clickRowItem.memberLevel}}--{{nowLevel}} ）</div>
                            <div class="balance" style="padding-top: 5px">
                                <span>余额：{{clickRowItem.amount}}</span>
                                <span>积分：{{clickRowItem.point}}</span>
                                <span>成长值：{{clickRowItem.growthUp ? clickRowItem.growthUp : 0}}</span>
                                <span>成为会员时间：{{clickRowItem.createTime}}</span>
                            </div>
                            <div style="padding-top: 5px">
                                <span>标签：{{clickRowItem.labelName}}</span>
                            </div>
                            <div style="padding-top: 5px">
                                <span>会员卡号：{{clickRowItem.memberId}}</span>
                            </div>
                        </div>
                    </el-col>
                </div>
                <div class="setBtn padding">
                    <el-button type="warning" size="small" @click="toRecharge(clickRowItem)">充值</el-button>
                    <el-button type="warning" size="small" @click="toCost(clickRowItem)">消费</el-button>
                    <el-button type="warning" size="small" @click="toRefund">退款</el-button>
                    <el-button type="warning" size="small" @click="setIntegral(clickRowItem)">修改积分</el-button>
                    <el-button type="warning" size="small" @click="setGrade(clickRowItem)">修改等级</el-button>
                </div>
                <div class="detailBasic padding">
                    <div>基本信息</div>
                    <el-table tooltip-effect="dark" :data="detailData" border style="width: 100%"
                              v-loading="showLoading">
                        <el-table-column prop="useName" label="姓名"></el-table-column>
                        <el-table-column prop="useAddress" label="地址"></el-table-column>
                        <el-table-column prop="useTel" label="手机号"></el-table-column>
                        <el-table-column prop="useSex" label="性别"></el-table-column>
                        <el-table-column prop="useBirthday" label="生日"></el-table-column>
                        <el-table-column prop="useMail" label="邮箱"></el-table-column>
                        <el-table-column prop="useEducation" label="学历"></el-table-column>
                        <el-table-column prop="useIndustry" label="行业"></el-table-column>
                        <el-table-column prop="useIncome" label="收入"></el-table-column>
                        <el-table-column prop="useIobby" label="爱好"></el-table-column>
                    </el-table>
                </div>
                <div class="detailTransaction padding">
                    <div>交易信息</div>
                    <el-table tooltip-effect="dark" :data="detailData" border style="width: 100%"
                              v-loading="showLoading">
                        <el-table-column prop="addAmount" label="累计交易金额"></el-table-column>
                        <el-table-column prop="averageAmount" label="平均交易金额"></el-table-column>
                        <el-table-column prop="addPoint" label="累计积分"></el-table-column>
                        <el-table-column prop="tradeNumber" label="交易次数"></el-table-column>
                        <el-table-column prop="genTime" label="上次交易时间"></el-table-column>
                    </el-table>
                </div>
                <div class="detailBottom padding">
                    <ExchangeDetailComponets :searchValue="clickRowItem"></ExchangeDetailComponets>
                </div>
            </el-dialog>

            <el-dialog center class="setGrade" title="设置等级" :visible.sync="grade" width="30%">
                <el-form label-width="25%">
                    <el-form-item label="当前会员">
                        <span>{{clickRowItem.memberName}}</span>
                    </el-form-item>
                    <el-form-item label="等级调整至">
                        <el-select v-model="value" placeholder="请选择" :value-key="valueKey" @change="changeSelect">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span style="color:#ccc">成长值会自动调整至该等级成长值范围起始值</span>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="grade = false">取 消</el-button>
                    <el-button type="primary" @click="sureSetGrade">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog center class="setIntegral" title="修改积分" :visible.sync="integral" width="32%">
                <el-form label-width="20%">
                    <el-form-item label="当前积分">
                        <span>{{clickRowItem.point}}</span>
                    </el-form-item>
                    <el-form-item label="修改积分">
                        <el-input type="number" v-model="reviseIntegral"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span style="color:#ccc">输入100，表示增加100；输入-100，表示减少100</span>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="pay.rechargeRemark" placeholder="最多100字" :maxlength="100"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="integral = false">取 消</el-button>
                    <el-button type="primary" @click="sureReviseIntegral">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog center class="recharge" title="充值" :visible.sync="recharge" width="30%">
                <el-form label-width="20%">
                    <el-form-item label="当前余额">
                        <span>{{clickRowItem.amount}}</span>
                    </el-form-item>
                    <el-form-item label="充值金额" prop="payAmount">
                        <el-input v-model="pay.payAmount" type="number" min="0"></el-input>
                    </el-form-item>
                    <el-form-item prop="rechargeId" label="充值密码">
                        <el-input v-model="pay.rechargeId" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" placeholder="最多100字" :maxlength="100"
                                  v-model="pay.rechargeRemark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="recharge = false">取 消</el-button>
                    <el-button type="primary" @click="sureRecharge">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog center class="recharge" title="退款" :visible.sync="refund" width="30%">
                <el-form label-width="20%">
                    <el-form-item label="当前余额">
                        <span>{{clickRowItem.amount}}</span>
                    </el-form-item>
                    <el-form-item label="退款金额" prop="payAmount">
                        <el-input v-model="pay.payAmount" type="number" min="0"></el-input>
                    </el-form-item>
                    <el-form-item prop="rechargeId" label="密码">
                        <el-input v-model="spendId" placeholder="请输入密码" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="pay.rechargeRemark" placeholder="最多100字" :maxlength="100"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="refund = false">取 消</el-button>
                    <el-button type="primary" @click="sureRecharge">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog center class="cost" title="消费" :visible.sync="cost" width="40%">
                <div class="costDetail" style="padding-bottom: 20px">
                    <span>当前余额</span>
                    <span>{{clickRowItem.amount}}</span>
                    <span>当前积分</span>
                    <span>{{clickRowItem.point ? clickRowItem.point : 0}}</span>
                </div>
                <el-form label-width="20%">
                    <el-form-item label="消费金额">
                        <el-input v-model="monetary" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="消费密码">
                        <el-input v-model="spendId" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式">
                        <el-checkbox class="pay" name="type" v-model="balanceCheck">
                            余额支付
                            <el-input size="mini" v-model="balancePay" type="number" min="0"></el-input>
                            元
                        </el-checkbox>
                        <br/>
                        <el-checkbox class="pay" name="type" v-model="isDeductiblePoint">
                            积分支付
                            <el-input class="pay" size="mini" v-model="integralPay" type="number" min="0"></el-input>
                            分 =
                            <el-input :disabled="true" class="pay" size="mini" v-model="integralPayRevise"></el-input>
                            元
                        </el-checkbox>
                        <br/>
                        <div v-for="(payWayItem,index) in payWays" :key="index">
                            <el-checkbox class="pay" name="type" v-model="payWayItem.addPaymentCheck">
                                <el-select v-model="payWayItem.value" placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in payment"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input size="mini" v-model="payWayItem.addPayment" type="number" min="0"></el-input>
                                元
                            </el-checkbox>
                            <br/>
                        </div>

                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click="addPayWay">增加支付方式</el-button>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="pay.rechargeRemark" placeholder="最多100字" :maxlength="100"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cost = false">取 消</el-button>
                    <el-button type="primary" @click="sureRecharge">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog center class="cost" title="设置标签" :visible.sync="setLabel" width="40%">
                <el-checkbox-group v-model="checkTagList">
                    <el-checkbox v-for="tag in allTab"
                                 :key="tag.labelId"
                                 :label="tag.labelId"
                                 :value="tag.labelName"
                                 style="margin-left: 0px;margin-right: 10px"
                    >{{tag.labelName}}
                    </el-checkbox>
                </el-checkbox-group>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="setLabel = false">取 消</el-button>
                    <el-button type="primary" @click="setTab">确 定</el-button>
                </span>
            </el-dialog>

        </el-main>
    </el-container>
</template>
<script>
    import Avatar from '../../../components/avatar/Avatar.vue';
    import Tag from '../../../components/tag/Tag.vue';
    import ExchangeDetailComponets from '../componets/ExchangeDetailComponets.vue';
    export default {
        components: {
            Avatar,
            Tag,
            ExchangeDetailComponets
        },
        data() {
            return {
                searchParam: {
                    useName: "",
                    useTel: ""
                },
                value: '',
                options: [],
                payment: [{
                    value: '现金',
                    label: '现金',
                }, {
                    value: '微信',
                    label: '微信',
                }, {
                    value: '支付宝',
                    label: '支付宝',
                }, {
                    value: '信用卡',
                    label: '信用卡',
                }],
                showLoading: true,
                balanceData: [],
                detailBasic: [],
                detailData: [],
                detailTransaction: [],
                pageNumber: 1,
                pageSize: 5,
                total: 0,
                type: [],
                multipleSelection: [],
                detail: false,
                grade: false,
                integral: false,
                recharge: false,
                cost: false,
                refund: false,
                setLabel: false,
                centerDialogVisible: false,
                customerDetail: [],
                clickRowItem: {},
                balancePay: 0,
                integralPay: 0,
                pay: {
                    payType: '',
                    payAmount: 0,
                    rechargeId: '',
                    rechargeRemark: '',
                },
                spendId: '',
                payWays: [{
                    value: '',
                    addPayment: '',
                    addPaymentCheck: false,
                }],
                reviseIntegral: '',
                valueKey: '',
                balanceCheck: false,
                isDeductiblePoint: false,
                selected: [],
                spendPointRatio: '',//每消费多少送多少积分
                pointRatio:'',//积分抵扣钱数
                allTab: [],
                checkTagList:[],
                searchData: [],
                selectLevel: '',
                monetary:0,//消费金额
                ratioCondition:0,//满多少钱可用积分折扣
                memberRatio:100,//折扣额度
                nowLevel:"",
                grades:[],
            }
        },
        computed: {
            integralPayRevise() {
                return Number(this.integralPay) * (Number(this.pointRatio) || 0)
            }
        },
        watch:{
            integralPay (isShow) {
                this.$nextTick(()=>{
                    this.integralPay = Number(this.clickRowItem.point) >= Number(this.integralPay) ? this.integralPay : Number(this.clickRowItem.point)
                })
            },
            options() {

            }
        },
        created() {
            this.init();
            this.initData();
        },
        methods: {
            currentPage(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.init();
            },
            init(flesh) {
                let that = this
                let url = '/zingbiz/member/memberService/loadMemberCard';
                let param =  {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                }
                if (this.searchParam.useName !== "") {
                    param.useName = this.searchParam.useName
                }
                if (this.searchParam.useTel !== "") {
                    param.useTel = this.searchParam.useTel
                }
                this.$http
                    .post(url, param)
                    .then((res) => {
                        if (res.data.success) {
                            res.data.data.data.forEach(item => {
                                item.point = parseInt(item.point)
                                if (item.labelName) {
                                    item.labelName = item.labelName.trim().split(" ").join(" ; ")
                                }
                                if (flesh && flesh === "flesh" && item.memberId === that.clickRowItem.memberId) {
                                    that.detailData = []
                                    that.clickRowItem = item
                                    that.detailData.push(item);
                                }
                            })
                            that.searchData = this.balanceData = res.data.data.data;
                            console.log("================",this.balanceData)
                            that.total = res.data.data.total;
                            //获取所有会员卡标签
                            let url = '/zingbiz/member/memberService/loadMemberlabelbylabelId';
                            that.$http
                                .post(url, {})
                                .then((res) => {
                                    that.allTab = res.data.data.data;
                                })
                                .catch((error) => {
                                    that.showLoading = false;
                                    that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                                })
                        }
                    })
                    .catch()
            },
            initData() {
                let that = this;
                let urls = ['/zingbiz/member/memberService/loadMemberTypebyMemberTypeId', '/zingbiz/member/memberService/loadMouldbyMouldId'];

                let axios = that.$http;
                let requests = urls.map(makeRequest);
                // 把指定的 url 转变成 axios 请求，返回的是 Promise 对象
                function makeRequest(url) {
                    //这里两个请求的参数是一样的
                    let params = {
//                        memberTypeId: ''   //会员卡ID

                    };
                    return axios.post(url, params);
                }

                axios.all(requests)
                    .then(axios.spread((grades, mould) => {
                        that.showLoading = false;
                        if (grades.data.success) {
                            that.grades = grades.data.data.data
                            grades.data.data.data.forEach((item, index) => {
                                that.options.push({
                                    value: item.memberTypeId,
                                    label: item.memberName,
                                });
                            })
                        }
                        if (mould.data.success) {
                            mould.data.data.data.forEach((item, index) => {
                                that.spendPointRatio = item.spendPointRatio
                                that.pointRatio = item.pointRatio
                                that.ratioCondition = item.ratioCondition
                                that.memberRatio = item.memberRatio
                            })
                        }
                    }))
                    .catch((error) => {
                        that.showLoading = false;
                        that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    });
            },
            detailDialog(val) {
                if (val && val.memberId) {
                    this.clickRowItem = val
                }
                this.grades.forEach((item, index) => {
                    if (val.memberLevel === item.memberLevel) {
                        this.nowLevel = item.memberName
                    }
                })
                this.detail = true
            },

            //搜索查询
            search() {
                this.init();
            },

            checkboxInit(row,index) { //冻结用户不可被选中
                if (row.memberType && row.memberType === '1')
                    return 0;//不可勾选
                else
                    return 1;//可勾选
            },

            //获取当前选中的点击行的各种信息
            rowClick(row, event, column) {
                this.clickRowItem = row;
                if (this.detailData.length === 0) {
                    this.detailData.push(this.clickRowItem);
                }
            },
            //设置标签
            setTab() {
                if (this.checkTagList.length <= 0) {
                    this.$vux.toast.text("请选择标签", 'bottom')
                    return false
                }/*
                if ((this.selected.length === 0) && (Object.keys(this.clickRowItem).length === 0)) {
                    this.$vux.toast.text("请选择会员", 'bottom')
                    return
                }*/
                let that = this;
                let url = '/zingbiz/member/memberService/addMemberLabelCards';
                let setAllTab = [];
                let labelIdItem = this.checkTagList.join(' ');
                if (that.selected.length > 0) {
                    that.selected.forEach((item, index) => {
                        setAllTab.push({
                            "memberId": item.memberId,
                            "labelIdItem": labelIdItem,
                        })
                    });
                } else {
                    setAllTab = [{
                        "memberId": this.clickRowItem.memberId,
                        "labelIdItem": labelIdItem,
                    }]
                }
                this.$http
                    .post(url, setAllTab)
                    .then((res) => {
                        if (res.data.success) {
                            that.setLabel = false;
                            this.init();
                            that.$message({type: "success", message: "标签设置成功"});
                        }
                    })
                    .catch((error) => {
                        that.showLoading = false;
                        that.setLabel = false;
                        that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
            },

            setGrade(val) {
                if (val && val.memberId) {
                    this.clickRowItem = val
                } else {
                    if (this.selected.length === 0) {
                        this.$message({type: "warning", message: "请选择会员"});
                        return
                    }
                    if (this.selected.length > 1) {
                        this.$message({type: "warning", message: "修改等级时只能选择一个会员"});
                        return
                    }
                    this.clickRowItem = this.selected[0]
                }
                this.grade = true
            },

            setLabelFun(val) {
                this.checkTagList = []
                if (val && val.memberId) {
                    this.clickRowItem = val
                    this.checkTagList.push(val.labelIdItem)
                } else {
                    if (this.selected.length === 0) {
                        this.$message({type: "warning", message: "请选择会员"});
                        return
                    }
                    this.selected.forEach(item => {
                        this.checkTagList.push(item.labelIdItem)
                    })
                }
                this.setLabel = true
            },

            //修改等级
            changeSelect(val) {
                this.selectLevel = val;
            },
            sureSetGrade() {
                let that = this;
                let setGradeParams = [];
                let url = '/zingbiz/member/memberService/addMemberCardLv';

                if (this.selected.length > 0) {
                    this.selected.forEach((item, index) => {
                        setGradeParams.push({
                            "memberId": item.memberId,
                            "memberTypeId": this.selectLevel,
                        });
                    });
                } else {
                    setGradeParams = [{
                        "memberId": this.clickRowItem.memberId,
                        "memberTypeId": this.selectLevel,
                    }]
                }

                if ((that.selected.length === 0) && (Object.keys(that.clickRowItem).length === 0)) {
                    that.$message({type: "warning", message: "请选择会员"});
                    return
                }

                this.$http
                    .post(url, setGradeParams)
                    .then((res) => {
                        if (res.data.success) {
                            that.$message({type: "success", message: "等级修改成功"});
                            this.init();
                            that.grade = false;
                        }
                    })
                    .catch((error) => {
                        that.showLoading = false;
                        that.grade = false;
                        that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
            },

            //修改积分
            setIntegral(val) {
                this.reviseIntegral = "";
                this.pay = {
                    payType: '',
                    payAmount: 0,
                    rechargeId: '',
                    rechargeRemark: ''
                };
                if (val && val.memberId) {
                    this.clickRowItem = val
                } else {
                    if (this.selected.length === 0) {
                        this.$message({type: "warning", message: "请选择会员"});
                        return
                    }
                    if (this.selected.length === 0) {
                        this.$message({type: "warning", message: "只能选择一个会员"});
                        return
                    }
                    this.clickRowItem = this.selected[0]
                }
                this.integral = true
            },
            sureReviseIntegral() {
                let that = this;
                let addOrSubType = '';
                let reviseIngral = [];
                let url = '/zingbiz/member/memberService/udateMemberAmount';
                if (Number(this.reviseIntegral) > 0) {
                    addOrSubType = '+';
                } else if (Number(this.reviseIntegral) === 0) {
                    return
                } else if (Number(this.reviseIntegral) < 0) {
                    addOrSubType = '-'
                }

                if (this.selected.length > 0) {
                    this.selected.forEach((item, index) => {
                        reviseIngral.push({
                            memberId: item.memberId,  //会员卡ID
                            type: addOrSubType,  //增加/减少
                            point: this.reviseIntegral,  //积分
                            useName: item.operater,
                            settlementWayPoint: '手动修改',
                            tradeTypePoint: '手动修改',
                            note: that.pay.rechargeRemark,  //备注
                        });
                    });
                } else {
                    reviseIngral = [{
                        memberId: this.clickRowItem.memberId,  //会员卡ID
                        type: addOrSubType,  //增加/减少
                        point: this.reviseIntegral,  //积分
                        useName: this.clickRowItem.operater,
                        settlementWayPoint: '手动修改',
                        tradeTypePoint: '手动修改',
                        note: that.pay.rechargeRemark,  //备注
                    }]
                }

                if ((that.selected.length === 0) && (Object.keys(that.clickRowItem).length === 0)) {
                    that.$message({type: "warning", message: "请选择会员"});
                    return
                }

                if (that.reviseIntegral == "") {
                    that.$message({type: "warning", message: "请添加修改积分字段"});
                    return
                }

                that.$http
                    .post(url, reviseIngral)
                    .then((res) => {
                        if (res.data.success) {
                            that.$message({type: "success", message: "积分修改成功"});
                            that.showLoading = false;
                            that.integral = false;
                            this.init();
                        }
                    })
                    .catch((error) => {
                        that.integral = false;
                        that.showLoading = false;
                        that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
            },

            //消费类型
            toCost(val) {
                if (val && val.memberId) {
                    this.clickRowItem = val
                }
                this.payWays = [{
                    value: '',
                    addPayment: '',
                    addPaymentCheck: false,
                }]
                this.pay = {
                    payType: '',
                    payAmount: 0,
                    rechargeId: '',
                    rechargeRemark: ''
                };
                this.cost = true;
                this.spendId = ''
                this.monetary = ''
                this.balancePay = ''
                this.integralPay = ''
                this.pay.payType = 0;
            },

            //充值类型
            toRecharge(val) {
                if (val && val.memberId) {
                    this.clickRowItem = val
                }
                this.pay = {
                    payType: '',
                    payAmount: 0,
                    rechargeId: '',
                    rechargeRemark: ''
                };
                this.recharge = true;
                this.pay.payType = 1;
            },
            //退款类型
            toRefund() {
                if (!this.clickRowItem.amount || Number(this.clickRowItem.amount) === 0) {
                    this.$vux.toast.text("账户余额为0,不可以退款", 'bottom')
                    return false
                }
                this.pay = {
                    payType: '',
                    payAmount: 0,
                    rechargeId: '',
                    rechargeRemark: ''
                };
                this.spendId = ''
                this.refund = true;
                this.pay.payType = 2;
            },

            //充值/消费/退款 请求后台
            sureRecharge() {
                let that = this;
                let payWayNum = null;
                let addIntegralWay = '';
                let addPayWay = '';
                let exchangeType = '';
                let exchangeTypeArray = [];
                let isIntegral = '';
                let electronicPay = 0;
                let settlementWay = '';
                let actualAmount = 0;
                let am = 0
                let url = '/zingbiz/member/memberService/spendMember';
                if (Number(that.pay.payType) === 0) {
                    payWayNum = '0'
                } else if (Number(that.pay.payType) === 1) {
                    payWayNum = '1'
                } else if (Number(that.pay.payType) === 2) {
                    payWayNum = '2'
                }
                let elePay = false
                if (Number(payWayNum) === 0) {
                    that.pay.payAmount = 0
                    addIntegralWay = addPayWay = "消费";
                    that.payWays.forEach((item, index) => {
                        if (item.addPaymentCheck&&item.value) {
                            exchangeTypeArray.push(item.value)
                            elePay = true
                            electronicPay += Number(item.addPayment)
                        }
                    });
                    // (这里暂时写死，等待会员卡后续使用对接真实数据)
                    settlementWay = "消费";
                    if (!elePay && !this.balanceCheck && !this.isDeductiblePoint) {
                        this.$vux.toast.text("请选择支付方式", 'bottom')
                        return false
                    }
                    if (this.balanceCheck) {
                        exchangeTypeArray.push("余额")
                    }
                    if (this.isDeductiblePoint) {
                        exchangeTypeArray.push("积分")
                    }
                    exchangeType = exchangeTypeArray.join(",")
                    if (elePay) {
                        that.pay.payAmount = Number(that.pay.payAmount) + Number(electronicPay)
                        actualAmount = actualAmount + Number(electronicPay)
                    }
                    if (this.balanceCheck) {
                        if (Number(that.balancePay) > Number(that.clickRowItem.amount)) {
                            this.$vux.toast.text("余额不足", 'bottom')
                            return false
                        }
                        that.pay.payAmount = Number(that.pay.payAmount) + Number(that.balancePay)
                        actualAmount = Number(actualAmount) + Number(that.balancePay)
                    }
                    if (this.isDeductiblePoint) {
                        if (Number(this.monetary) <= Number(this.ratioCondition)) {
                            this.$vux.toast.text("消费金额满" + this.ratioCondition + "元时才可用积分支付", 'bottom')
                            return false
                        }
                        if (!that.clickRowItem.point || Number(that.integralPay) > Number(that.clickRowItem.point)) {
                            this.$vux.toast.text("积分不足", 'bottom')
                            return false
                        }
                        that.pay.payAmount = Number(that.pay.payAmount) + Number(that.integralPayRevise)
                    }
                    //that.pay.payAmount = Number(that.balancePay) + Number(that.integralPayRevise) + Number(electronicPay);
                    if (Number(this.monetary) === 0) {
                        this.$vux.toast.text("消费金额不能为0", 'bottom')
                        return false
                    }
                    if (Number(this.monetary) > Number(that.pay.payAmount) || Number(this.monetary) < Number(that.pay.payAmount)) {
                        this.$vux.toast.text("支付金额不正确", 'bottom')
                        return false
                    }
                    am = this.balancePay ? this.balancePay : 0 //金额
                } else if (Number(payWayNum) === 1) {
                    exchangeType = addIntegralWay = addPayWay = "充值";
                    settlementWay = '充值';
                    am = that.pay.payAmount ? that.pay.payAmount : 0
                } else if (Number(payWayNum) === 2) {
                    exchangeType = addPayWay = "退款";
                    settlementWay = '退款';
                    am = that.pay.payAmount ? that.pay.payAmount : 0
                }

                if (that.isDeductiblePoint) {
                    isIntegral = 0;
                } else {
                    isIntegral = 1
                }
                let params = {
                    memberMouldId:that.clickRowItem.memberMouldId,  //模板id
                    memberId: that.clickRowItem.memberId,  //会员卡ID
                    actualAmount:actualAmount,
                    payway: payWayNum,  //消费类型： payway 0消费/1充值/2退款
                    spendId: that.spendId, //消费密码、退款密码
                    rechargeId: that.pay.rechargeId,  //充值密码
                    amount: am,  //金额
                    note: that.pay.rechargeRemark,  //备注
                    deductibleAmount: that.integralPayRevise || 0,  //积分抵扣
                    deductiblePoint: that.integralPay || 0,  //积分抵扣
                    point: that.clickRowItem.addPoint,   //积分
                    growthUp: that.clickRowItem.growthUp ? that.clickRowItem.growthUp : "0",  //成长值
                    tradeNumber: that.clickRowItem.tradeNumber,  //交易次数，默认0
                    useName: that.clickRowItem.useName,  //用户姓名
                    tradeType: exchangeType,  //交易类型
                    settlementWay: settlementWay,  //消费支付方式
                    settlementWayPoint: addIntegralWay,  //增加积分的方式(充值,消费)
                    settlementWayAmount: addPayWay,  //增加余额的方式(退款,消费)
                    isDeductiblePoint: isIntegral,  //是否用抵扣积分0用/1不用
                    settlementWayDeductible: that.integralPay,  //去除积分的交易方式(积分抵扣)
                    tradeTypePoint:"手动添加",
                    tradeTypeAmount:"手动添加",
                    payAmount:that.pay.payAmount ? that.pay.payAmount : 0
                }
                console.log("===========params===========",params)
                that.$http
                    .post(url, params)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.success) {
                            that.showLoading = false
                            if (Number(that.pay.payType) === 0) {
                                this.init("flesh");
                                that.$message({type: "success", message: "消费成功"});
                                that.cost = false;
                            } else if (Number(that.pay.payType) === 1) {
                                this.init("flesh");
                                that.$message({type: "success", message: "充值成功"});
                                that.recharge = false;
                            } else if (Number(that.pay.payType) === 2) {
                                this.init("flesh");
                                that.$message({type: "success", message: "退款成功"});
                                that.refund = false;
                            }
                        } else if (res.data.mgs.indexOf("密码错误") >= 0) {
                            that.showLoading = false;
                            if (Number(that.pay.payType) === 0) {
                                that.$message({type: "error", message: "密码错误，请重试！"});
                                //that.cost = false;
                            } else if (Number(that.pay.payType) === 1) {
                                that.$message({type: "error", message: "密码错误，请重试！"});
                                //that.recharge = false;
                            } else if (Number(that.pay.payType) === 2) {
                                that.$message({type: "error", message: "密码错误，请重试！"});
                                //that.refund = false;
                            }
                        } else {
                            if (Number(that.pay.payType) === 0) {
                                that.$message({type: "error", message: res.data.mgs ? res.data.mgs : "消费失败"});
                                //that.cost = false;
                            } else if (Number(that.pay.payType) === 1) {
                                that.$message({type: "error", message: res.data.mgs ? res.data.mgs : "充值失败"});
                                //that.recharge = false;
                            } else if (Number(that.pay.payType) === 2) {
                                that.$message({type: "error", message: res.data.mgs ? res.data.mgs : "退款失败"});
                                //that.refund = false;
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("error===>",error)
                        that.showLoding = false;
                        if (that.pay.payType === 0) {
                            that.$message({type: "error", message: "消费失败，请重试！"});
                            //that.cost = false;
                        } else if (that.pay.payType === 1) {
                            that.$message({type: "error", message: "充值失败，请重试！"});
                            //that.recharge = false;
                        } else if (that.pay.payType === 2) {
                            that.$message({type: "error", message: "退款失败，请重试！"});
                            //that.refund = false;
                        }
                    })
            },

            //消费中增加支付方式
            addPayWay() {
                this.payWays.push({
                    value: '',
                    addPayment: '',
                    addPaymentCheck: false,
                })
            },

            //冻结账户
            frozen(val) {
                if (val && val.memberId) {
                    this.clickRowItem = val
                }
                let that = this;
                let url = '/zingbiz/member/memberService/uodateCardType';
                let params = {
                    memberId: that.clickRowItem.memberId,
                    memberType: that.clickRowItem.memberType ? that.clickRowItem.memberType === "0" ? "1" : "0" : "1",
                    operater: that.clickRowItem.operater ? that.clickRowItem.operater : ""
                }
                console.log(params)
                let mas = that.clickRowItem.memberType ? that.clickRowItem.memberType === "0" ? "冻结" : "解除冻结" : "冻结"
                that.$confirm('确认'+mas+'吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        that.$http
                            .post(url, params)
                            .then((res) => {
                                if (res.data.success) {
                                    this.$message({
                                        type: 'success',
                                        message: mas + '成功!'
                                    });
                                    that.init();
                                }
                            })
                            .catch((error) => {
                                that.$message({type: "error", message: mas + "失败"});
                            })
                    })
                    .catch(() => {
                        /*this.$message({
                            type: 'info',
                            message: '已取消冻结'
                        });*/
                    })
            },

            //选择单个用户
            selectOne(selection, row) {
                this.selected = selection;
            },

            //选择所有用户
            selectAll(selection) {
                this.selected = selection;
            },
        }
    }
</script>
<style scoped lang="stylus">

    .padding {
        padding: 10px;
    }

    .right {
        float: right;
    }

    .operation {
        margin: 5px;
    }

    .detail {
        .detailTop {
            .headImg {
                width: 70px;
                height: 70px;
            }
            .customerName {
                padding-left: 10px;
                .balance {
                    display: flex;
                    justify-content: space-between;

                }
            }
        }
        .setBtn {
            margin-left: 80px;
        }
        .detailBasic, .detailTransaction {
            > div:first-child {
                font-size: 20px;
                padding-bottom: 10px;
            }
        }
    }

    .setGrade {
        div {
            span:first-child {
                width: 30%;
            }
            span:last-child {
                width: 70%;
            }
        }
    }

    .costDetail {
        display: flex;
        span {
            flex: 1;
            text-align: center;
        }
    }

    .pay {
        width: 110px;
    }
</style>
