<template>
  <div class="infoDialog">
    <el-dialog title="协议单位信息" :visible.sync="showAgreementInfo" :before-close="handleClose" width="60%" append-to-body>
      <el-form :model="hotelAgreeUnit" :rules="rules" ref="hotelAgreeUnit" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="12" prop="agreeUnitName">
                <el-form-item label="单位名称">
                  <el-input v-model="hotelAgreeUnit.agreeUnitName" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同号" prop="contractNumber">
                  <el-input v-model="hotelAgreeUnit.contractNumber" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="传真" prop="unitFAX">
                  <el-input v-model="hotelAgreeUnit.unitFAX" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮编" prop="unitPC">
                  <el-input v-model="hotelAgreeUnit.unitPC" type="number" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="地址" prop="unitADD">
              <el-input v-model="hotelAgreeUnit.unitADD" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comments">
              <el-input type="textarea" v-model="hotelAgreeUnit.comments" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人" prop="linkman">
                  <el-input v-model="hotelAgreeUnit.linkman" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="telephone">
                  <el-input v-model="hotelAgreeUnit.telephone" type="number" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="生效日期">
              <el-col :span="10">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" size="small" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"
                                  v-model="hotelAgreeUnit.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="12">
                <el-form-item prop="endTime">
                  <el-date-picker type="date" size="small" :picker-options="disableTime"
                                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" v-model="hotelAgreeUnit.endTime"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="银行帐号" prop="bankAccount">
                  <el-input v-model="hotelAgreeUnit.bankAccount" type="number" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="科目" prop="explorerName">
                  <el-input placeholder="请选择科目" @focus="showSubject = true" size="small"
                            v-model="hotelAgreeUnit.explorerName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="销售员" prop="soler">
                  <el-input placeholder="请选择销售员" @focus="showOrgSelectModal = true" size="small"
                            v-model="hotelAgreeUnit.soler"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-checkbox v-model="isAgreementUnit" label="是否启用" @change="isEnable"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <h4 class="el-dialog__title el-dialog__header">权益内容</h4>
      <div class="powerContent">
        <div class="isAccount">
          <el-checkbox v-model="setPower.isGZ" @change="checkPower(setPower.isGZ,'GZ','','')"
                       label="是否允许挂账"></el-checkbox>
          <span class="account"><el-button size="small" @click="amountChange = true">变更挂账额度</el-button></span>
          <span class="account">总额度：{{agreeUnitData.accountTotal}}</span>
          <span class="account">已使用额度：{{agreeUnitData.accountAlready}}</span>
          <span class="account">剩余额度：{{agreeUnitData.accountRemove}}</span>
          <a class="account" @click="AmountChangeHistory">变更历史</a>
        </div>

        <div class="agreementHousePrice">
          <el-row>
            <el-col :span="4">
              <el-checkbox v-model="setPower.isXYFJ"
                           @change="checkPower(setPower.isXYFJ,'XYFJ',agreeUnitData.authValue1,agreeUnitData.authValue2)"
                           label="是否启用协议房价"></el-checkbox>
            </el-col>
            <el-col :span="20">
              <span class="agreementPrice" v-for="(addAgreementItem,index) in addAgreementPrice" :key="index">
                <span>房间类型
                  <el-select v-model="addAgreementItem.authValue1"
                             @change="checkPower(setPower.isXYFJ,'XYFJ',addAgreementItem.authValue1,addAgreementItem.authValue2)"
                             size="small" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in houseType"
                      :key="item.rowId"
                      :label="item.configValue"
                      :value="item.rowId">
                    </el-option>
                  </el-select>
                </span>
                <span>协议价格 <el-input v-model="addAgreementItem.authValue2" type="number" min="0"
                                    @change="checkPower(setPower.isXYFJ,'XYFJ',addAgreementItem.authValue1,addAgreementItem.authValue2)"
                                    size="small" style="width: 200px"></el-input>
                </span>
                <el-button size="small" @click.prevent="removeAgreementBtn(index)">删除</el-button>
              </span>
              <el-button @click="addAgreementBtn" size="small">新增协议房价</el-button>
            </el-col>
          </el-row>
        </div>

        <div class="isDiscount">
          <el-checkbox v-model="setPower.isDZ"
                       @change="checkPower(setPower.isDZ,'DZ',agreeUnitData.DZQuota,DZProject)"
                       label="是否允许打折"></el-checkbox>
          <span class="discount">打折额度 <el-input v-model="agreeUnitData.DZQuota" type="number" min="0" max="100"
                                                @change="checkPower(setPower.isDZ,'DZ',agreeUnitData.DZQuota,DZProject)"
                                                size="small" style="width: 100px"></el-input> %</span>
          <span class="discount">打折项目
                        <el-select size="small" v-model="DZProject" multiple
                                   @change="checkPower(setPower.isDZ,'DZ',agreeUnitData.DZQuota,DZProject)"
                                   placeholder="请选择" clearable>
                            <el-option
                              v-for="item in getDiscountItemList"
                              :key="item.rowId"
                              :label="item.descript"
                              :value="item.rowId">
                            </el-option>
                        </el-select>
                    </span>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm('hotelAgreeUnit')" size="small">确定</el-button>
        <el-button @click="handleClose" size="small">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="挂账额度变更" :visible.sync="amountChange" :before-close="amountChangeClose" width="25%"
               close-on-click-modal append-to-body>
      <div class="amountChange">
        <div>总额度：{{agreeUnitData.accountTotal}}</div>
        <div class="amountDiv2">
          <span>已使用额度：{{agreeUnitData.accountAlready}}</span>
          <span>剩余额度：{{agreeUnitData.accountRemove}}</span>
        </div>
        <div>
          变更额度
          <el-radio-group v-model="changeAmount.radioValue" @change="changeAmountRadio(changeAmount.radioValue,changeAmount.amountMoney)">
            <el-radio label="0">增加</el-radio>
            <el-radio label="1">减少</el-radio>
          </el-radio-group>
          <el-input v-model="changeAmount.amountMoney" @change="changeAmountRadio(changeAmount.radioValue,changeAmount.amountMoney)" size="small" style="width: 100px;"></el-input>￥
        </div>
        <div>
          授权码 <el-input v-model="changeAmount.password" size="small" style="width: 200px"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="changeAgreeUnitAccontMoney">确定</el-button>
        <el-button size="small" @click="amountChangeClose">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="变更历史" :visible.sync="changeHistory" width="50%" append-to-body>
      <el-table :data="AmountHistoryList" border style="width: 100%">
        <el-table-column prop="createTime" label="变更时间"></el-table-column>
        <el-table-column prop="changeDirection" label="变更方向"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="optName" label="操作人"></el-table-column>
        <el-table-column prop="licensePeople" label="授权人"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small" @click="changeHistory = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 组件引用集 -->
    <div>
      <subject-picker :showPicker="showSubject" @picked="getSubjectData" @abort="showSubject = false"></subject-picker>
      <org-member-picker :showTab="showTab" :initialSelected="[]" :showPicker="showOrgSelectModal"
                         :multiple="false" @picked="okSelectMember"
                         @abort="showOrgSelectModal=false"></org-member-picker>
    </div>
  </div>
</template>

<script>
  import SubjectPicker from '@/components/subjectpicker/SubjectPicker';
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
  import { deepCopy } from '../../../utils/fn'

  export default {
    components: {
      SubjectPicker,
      OrgMemberPicker,
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        showAgreementInfo: false,
        amountChange: false,  //额度变更
        changeHistory: false,  //变更历史
        showSubject: false,  //选择科目组件
        showOrgSelectModal: false,  //选人组件
        showTab: ["colleague"],  //选人组件tab显示
        setPower: {
          isGZ: false,
          isDZ: false,
          isXYFJ: false
        },
        agreeUnitData: {
          isAccount: false,
        },
        DZProject:[],  //打折项目
        isAgreementUnit: false,  //是否启用协议单位
        AmountHistoryList: [],   //变更历史表单
        changeAmount: {},  //变更挂账额度
        discountItemList: [],
        discountItem: [],   //打折项目
        houseType: [],   //房间类型
        hotelAgreeUnit: {},
        userAuthDetails: [],
        options: [],
        amountMoney:"",
        addAgreementPrice:[{
          agreeUnitId:"",
          authKey:"",
          authValue1:"",
          authValue2:"",
          authValue3:"",
          rowId:""
        }]
      }
    },
    computed: {
      getDiscountItemList() {
        if (this.setPower.isXYFJ) {
          this.discountItem = this.discountItemList.filter(item => item.configCode !== "1000")
        } else {
          this.discountItem = this.discountItemList;
        }
        return this.discountItem
      }
    },
    watch: {
      show: function (isShow) {
        this.showAgreementInfo = isShow;
        if (isShow) {
          this.agreeUnitData = Object.assign({}, this.data);
          this.hotelAgreeUnit = deepCopy(this.data.hotelAgreeUnit);
          this.userAuthDetails = this.userAuthDetails.concat(deepCopy(this.data.discountList)).concat(deepCopy(this.data.xyfj_List));

          if (this.hotelAgreeUnit.agreeState === "0") {
            this.isAgreementUnit = true
          }
          if (this.hotelAgreeUnit.isAccount === "0") {
            this.setPower.isGZ = true;
          }
          if (this.hotelAgreeUnit.isDiscount === "0") {
            this.setPower.isDZ = true;
            this.agreeUnitData.DZQuota = this.agreeUnitData.discountList[0].authValue1;
            this.DZProject = this.agreeUnitData.discountList[0].authValue2.split(",");
          }
          if (this.hotelAgreeUnit.isStartAgreeRoomPrice === "0") {
            this.setPower.isXYFJ = true;
            this.addAgreementPrice = this.agreeUnitData.xyfj_List
          }
        } else {
          this.$refs.hotelAgreeUnit.resetFields();
        }
      },
    },
    created() {
      this.initSelectedData();
    },
    methods: {
      addAgreementBtn() {
        this.addAgreementPrice.push({
          agreeUnitId:"",
          authKey:"",
          authValue1:"",
          authValue2:"",
          authValue3:"",
          rowId:""
        })
      },
      removeAgreementBtn(index) {
        this.userAuthDetails = this.addAgreementPrice.splice(index,1);
      },
      initSelectedData() {
        this.$http.all([this.$http.get("/zingbiz/hotel/hotelNew/getTradeTypeConfig?pageNumber=1&pageSize=999"), this.$http.get("/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=999&configCode=104")])
          .then(this.$http.spread((res1, res2) => {
            this.discountItemList = res1.data.data;
            this.houseType = res2.data.data;
          }))
          .catch(() => {
            this.$message({ type: "error", message: "选择内容获取失败" })
          })
      },
      isEnable(state) {
        if (state) {
          this.hotelAgreeUnit.agreeState = "0";
        } else {
          this.hotelAgreeUnit.agreeState = "1";
        }
      },
      //权限选择和设置
      /*
      * state:对应权限checkbox的选中值
      * authKey:后台接口中每一种权限对应的状态key
      * authValue1:后台接口中authvalue1对应的值
      * authValue2:后台接口中authvalue2对应的值
       */
      checkPower(state, authKey, authValue1, authValue2) {
        if (state) {
          let hasAuthKeyItem = this.userAuthDetails.some(item => item.authKey === authKey);
          if (authKey === "DZ") {
            authValue2 = authValue2.join(",").trim();
          }
          if (hasAuthKeyItem) {
            if (authKey === "XYFJ" && (authValue1 !== "" && authValue1 !== undefined && authValue1 !== null) && (authValue2 !== "" && authValue2 !== undefined && authValue2 !== null)) {
              this.userAuthDetails.push({
                authKey,
                authValue1: authValue1,
                authValue2: authValue2
              })
            } else {
              this.userAuthDetails = this.userAuthDetails.map(item => {
                if (item.authKey === authKey) {
                  item.authValue1 = authValue1;
                  item.authValue2 = authValue2
                }
                return item
              })
            }

          } else {
            this.userAuthDetails.push({
              authKey,
              authValue1: authValue1,
              authValue2: authValue2
            })
          }
        } else {
          this.userAuthDetails = this.userAuthDetails.filter(item => item.authKey !== authKey)
        }
      },

      submitAddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.setPower.isDZ) {
              if ((this.agreeUnitData.DZQuota === "" || this.agreeUnitData.DZQuota === undefined) || (this.DZProject.length === 0)) {
                this.$message({ type: "warning", message: "请输入打折额度或打折项目" });
                return
              }
            }

            if (this.setPower.isGZ) {
              this.hotelAgreeUnit.isAccount = "0"
            } else {
              this.hotelAgreeUnit.isAccount = "1"
            }
            if (this.setPower.isDZ) {
              this.hotelAgreeUnit.isDiscount = "0"
            } else {
              this.hotelAgreeUnit.isDiscount = "1"
            }
            if (this.setPower.isXYFJ) {
              this.hotelAgreeUnit.isStartAgreeRoomPrice = "0"
            } else {
              this.hotelAgreeUnit.isStartAgreeRoomPrice = "1"
            }

            let url = "/zingbiz/hotel/hotelAgreeUnitService/saveAgreeUnitAuth";
            let params = {
              hotelAgreeUnit: this.hotelAgreeUnit,   //协议单位内容
              auths: this.userAuthDetails    //协议单位权限内容
            };

            this.loadingInstance = this.$loading({});
            this.$httpSilent
              .post(url, params)
              .then(() => {
                this.loadingInstance.close();
                this.$emit("confirm", false);
                this.userAuthDetails = [];
                this.$message({ type: "success", message: "保存成功！" })
              })
              .catch(() => {
                this.$message({ type: "error", message: "保存失败，请重试！" })
              })
          }
        })
      },

      changeAmountRadio(val,money) {
        if (typeof money !== "undefined") {
          if (val === "0") {
            this.amountMoney = this.changeAmount.amountMoney
          } else if (val === "1") {
            this.amountMoney = `-${this.changeAmount.amountMoney}`
          }
        }
      },

      //变更挂账额度
      changeAgreeUnitAccontMoney() {
        let url = "/zingbiz/hotel/hotelAgreeUnitService/changeAgreeUnitAccountMoney";
        let params = {
          auth: {
            agreeUnitId: this.hotelAgreeUnit.agreeUnitId,
            authValue3: this.amountMoney
          },
          password: this.changeAmount.password,
        };
        this.loadingInstance = this.$loading({});
        this.$httpSilent
          .post(url, params)
          .then((res) => {
            if (res.data.success) {
              this.loadingInstance.close();
              if (res.data.data === "-1") {
                this.$message({ type: "error", message: "授权码不存在或此授权码下未启用协议单位,请查看权限配置" })
              } else {
                this.amountChange = false;
                this.$emit("confirm");
                this.changeAmount = {};
                this.amountMoney = "";
                this.$message({ type: "success", message: "变更挂账额度成功！" });
              }
            }
          })
          .catch(() => {
            this.$message({ type: "error", message: "变更挂账额度失败，请重试！" })
          })
      },
      handleClose() {
        this.setPower = {
          isGZ: false,
          isDZ: false,
          isXYFJ: false
        };
        this.DZProject = [];
        this.agreeUnitData = {
          isAccount: false,
        };
        this.userAuthDetails = [];
        this.hotelAgreeUnit = {};
        this.$emit("cancel", false);
      },
      amountChangeClose() {
        this.changeAmount = {};
        this.amountChange = false;
      },
      getSubjectData(pickedData) {
        this.hotelAgreeUnit.explorerName = pickedData.text;
        this.showSubject = false;
      },
      okSelectMember(list) {
        this.hotelAgreeUnit.soler = list[0].userName;
        this.showOrgSelectModal = false;
      },
      AmountChangeHistory() {
        this.changeHistory = true;
        let url = "/zingbiz/hotel/hotelAgreeUnitService/getHotelAgreeUnitHistory";
        let params = {
          pageNumber: "1",
          pageSize: "999",
          agreeUnitId: this.hotelAgreeUnit.agreeUnitId
        };
        this.$httpSilent
          .get(url, { params: params })
          .then((res) => {
            if (res.data.success) {
              this.AmountHistoryList = res.data.data
            }
          })
          .catch(() => {
            this.$message({ type: "error", message: "变更历史表单获取失败，请刷新重试！" });
          })
      }
    }
  }
</script>
<style scoped lang="stylus">
  .powerContent {
    div {
      padding: 10px 0;
    }
    .isAccount {
      display: flex;
      .account {
        flex: 1;
        text-align center
      }
    }
    .isDiscount {
      span {
        display: inline-block;
        width: 30%;
        text-align: center;
      }
    }
    .agreementHousePrice {
      .agreementPrice {
        display: inline-block;
        width: 100%;
        span {
          display: inline-block;
          width: 35%;
        }
      }
    }
  }

  .amountChange {
    > div {
      padding: 10px 0;
    }
    .amountDiv2 {
      display: flex;
      span {
        flex: 1;
      }
    }
  }
</style>
