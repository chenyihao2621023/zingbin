<template>
    <div class="manage" style="height:100%;">
        <ZingHead :title="title">
            <!-- <div slot="header-right" v-show="paramtemp.flag==='watch'">
                <span class="header-jiahao">
                    <dropdown :data="menuData" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div> -->
        </ZingHead>
        <div class="inner">
            <div class="tab-manage" :style="{ height: heightChange + 'px'}">
                <tab class="tab-list">
                    <tab-item :selected="index === 0" v-for="(item, index) in tabList" :key="index" @on-item-click="onItemClick">{{item}}</tab-item>
                </tab>
                <swiper :show-dots="false">
                    <swiper-item class="swiper-tab" v-show="index">
                        <swiper-index :asset="asset" :TabreadOnly="TabreadOnly" :modelType="tabItem"></swiper-index>
                    </swiper-item>

                    <swiper-item class="swiper-tab" v-show="indexdept">
                        <swiper-deptment :deptment="deptment" :TabreadOnly="TabreadOnly"
                                          :single="single" :multipleDepart="multipleDepart" :multipleSub="multipleSub" :singleSub="singleSub"
                                         :modelType="tabItem"
                                          @singSub="useDeptType"
                                          @updatecheckSingle="updatecheckSingle"
                                         @updatecheckMulit="updatecheckMulit"
                                         @updatecheckItem="updatecheckItem"
                                         @updatecheckSub="updatecheckSub"
                                         @clickSub="useSubType"></swiper-deptment>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="indexasset">
                        <swiper-original-value :originalData="originalData" :TabreadOnly="TabreadOnly" :modelType="tabItem"></swiper-original-value>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="indexadd">
                        <swiper-period-data :periodData="periodData" :TabreadOnly="TabreadOnly"></swiper-period-data>
                    </swiper-item>
                </swiper>
                <flexbox class="inner" v-if="isTabShow">
                    <flexbox-item>
                        <x-button class="review" @click.native="checkout">反审核</x-button>
                    </flexbox-item>
                </flexbox>
                <flexbox :gutter="0" class="main-footer" v-if="yesOrNo">
                    <flexbox-item>
                        <x-button style="background-color:#40affc" type="primary" @click.native="cancleinfo">取消</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color: #ea7e26;" type="primary" @click.native="submitBasicInfo">提交</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
        <subject-picker :showPicker="showPicker" :multipleMode="multiMode" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker>
    </div>
</template>
<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import SubjectPicker from "components/subjectpicker/SubjectPicker.vue";
import {
  Tab,
  TabItem,
  Swipeout,
  SwipeoutItem,
  Group,
  XInput,
  Flexbox,
  CheckIcon,
  Checklist,
  FlexboxItem,
  XButton,
  Cell,
} from "vux";
// import Dropdown from "@/components/dropdown/Dropdown";
import swiperIndex from "./selectorPopup/swiperIndex";
import swiperDeptment from "./selectorPopup/swiperDeptment";
import swiperOriginalValue from "./selectorPopup/swiperOriginalValue";
import swiperPeriodData from "./selectorPopup/swiperPeriodData";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    ZingHead,
    Swipeout,
    SwipeoutItem,
    Tab,
    TabItem,
    Group,
    XInput,
    Flexbox,
    CheckIcon,
    Checklist,
    FlexboxItem,
    XButton,
    Cell,
    SubjectPicker,
    swiperIndex,
    swiperDeptment,
    swiperOriginalValue,
    swiperPeriodData
  },
  data() {
    return {
      title: "固定资产",
      tabList: ["基本信息", "部门及其他", "原值与折旧"],
      paramtemp: {},
      menuData: [],
      asset: {}, // 基本信息
      deptment: {}, // 部门及其他
      originalData: {}, //原值与折旧
      periodData: {}, // 期间数据
      radioValue: ["1"],
      tabItem: "",
      index: true,
      indexdept: false,
      indexasset: false,
      indexadd: false,
      TabreadOnly: false,
      yesOrNo:true,
      isTabShow: false,
      updateId: "",
      deptType: "",
      deptId: "",
      subType: "",
      single: true,
      multipleDepart: false,
      multipleSub: false,
      singleSub: true,
      changeId: "",
      changeType:"",
      assetItem :{},
      heightChange:""
    };
  },
  mounted() {
      this.heightChange = document.querySelector(".manage").clientHeight - 140
      this.paramtemp = this.$route.query;
      this.tabItem = this.paramtemp.flag;
      this.updateId = this.paramtemp.originId;
      if (this.tabItem === "watch") {
          this.title = "固定资产查看";
          this.TabreadOnly = true;
          this.yesOrNo = false
          if (this.$route.query.type === "YSH") {
              this.isTabShow = true;
          } else {
              this.heightChange = document.querySelector(".manage").clientHeight - 100
          }
          this.tabList.push("期间数据");
      } else if (this.tabItem === "add") {
          this.title = "固定资产新建";
          this.TabreadOnly = false;
      } else if (this.tabItem === "update") {
          this.title = "固定资产编辑";
          this.TabreadOnly = false;
      } else {
          this.title = "固定资产";
          this.TabreadOnly = false;
      }
      if (this.tabItem === "watch" || this.tabItem === "update" || this.tabItem === "change") {
          this.getDataById();
          // this.deptType = ""
          // this.subType = ""
      }
  },
  methods: {
    updatecheckSingle(val) {
      this.single = val
      this.multipleDepart = false
    },
    updatecheckMulit(val) {
      this.single = false
      this.multipleDepart = val
    },
    updatecheckSub(val) {
      this.multipleSub = false;
      this.singleSub = val;
    },
    updatecheckItem(val) {
      this.multipleSub = val;
      this.singleSub = false;
    },
    // 根据id查询每条数据
    getDataById() {
      let vm = this;
      let url = "/zingbiz/fixedAssets/assetsManagement/select";
      let param = {
        id: vm.updateId
      };
      let tempData = {};
      vm.$http.post(url, param).then(res => {
        if (res.data.success) {
            vm.assetItem = res.data.data[0]
            tempData = res.data.data[0];
            if (tempData.type === "change" || tempData.type === "clean") {
                vm.changeId = tempData.originalId
                }
            vm.changeType = tempData.type
           //基础数据
            vm.asset = {}
            if (!Z_IsEmpty20(tempData.serialNumber)) {
                vm.$set(vm.asset,"serialNumber",tempData.serialNumber)
            }
            if (!Z_IsEmpty20(tempData.assetsClass)) {
                vm.$set(vm.asset,"assetsClass",tempData.assetsClass)
            }
            if (!Z_IsEmpty20(tempData.assetsClassName)) {
                vm.$set(vm.asset,"assetsClassName",tempData.assetsClassName)
            }
            if (!Z_IsEmpty20(tempData.assetsCoding)) {
                vm.$set(vm.asset,"assetsCoding",tempData.assetsCoding)
            }
            if (!Z_IsEmpty20(tempData.assetsName)) {
                vm.$set(vm.asset,"assetsName",tempData.assetsName)
            }
            if (!Z_IsEmpty20(tempData.postingDate)) {
                vm.$set(vm.asset,"postingDate",tempData.postingDate)
            }
            if (!Z_IsEmpty20(tempData.measureUnitId)) {
                vm.$set(vm.asset,"measureUnitId",tempData.measureUnitId)
            }
            if (!Z_IsEmpty20(tempData.count)) {
                vm.$set(vm.asset,"count",tempData.count)
            }
            if (!Z_IsEmpty20(tempData.workingCondition)) {
                vm.$set(vm.asset,"workingCondition",tempData.workingCondition)
            }
            if (!Z_IsEmpty20(tempData.changeWay)) {
                vm.$set(vm.asset,"changeWay",tempData.changeWay)
            }
            if (!Z_IsEmpty20(tempData.changeWayName)) {
                vm.$set(vm.asset,"changeWayName",tempData.changeWayName)
            }
            if (!Z_IsEmpty20(tempData.workingConditionIdName)) {
                vm.$set(vm.asset,"workingConditionIdName",tempData.workingConditionIdName)
            }
            if (!Z_IsEmpty20(tempData.workingConditionId)) {
                vm.$set(vm.asset,"workingConditionId",tempData.workingConditionId)
            }
            if (!Z_IsEmpty20(tempData.storePlaceIdName)) {
                vm.$set(vm.asset,"storePlaceIdName",tempData.storePlaceIdName)
            }
            if (!Z_IsEmpty20(tempData.economicUse)) {
                vm.$set(vm.asset,"economicUse",tempData.economicUse)
            }
            if (!Z_IsEmpty20(tempData.supplier)) {
                vm.$set(vm.asset,"supplier",tempData.supplier)
            }
            if (!Z_IsEmpty20(tempData.manufacturer)) {
                vm.$set(vm.asset,"manufacturer",tempData.manufacturer)
            }
            if (!Z_IsEmpty20(tempData.remark)) {
                vm.$set(vm.asset,"remark",tempData.remark)
            }
            //部门数据
            vm.deptment = {}
            if (tempData.departmentSelection === "single" ) {
                vm.single = true
                vm.multipleDepart = false
                if (!Z_IsEmpty20(tempData.department)) {
                    vm.$set(vm.deptment,"department",tempData.department)
                }
                if (!Z_IsEmpty20(tempData.departmentName)) {
                    vm.$set(vm.deptment,"departmentName",tempData.departmentName)
                }
            } else {
                vm.multipleDepart = true
                vm.single = false
                if (!Z_IsEmpty20(tempData.department)) {
                    vm.$set(vm.deptment,"Mulitdepartment",tempData.department)
                }
                if (!Z_IsEmpty20(tempData.departmentName)) {
                    vm.$set(vm.deptment,"MulitdepartmentName",tempData.departmentName)
                }
            }
            if (tempData.subjectSelection === "single" ) {
                vm.singleSub = true
                vm.multipleSub = false
                if (!Z_IsEmpty20(tempData.subjectId)) {
                    vm.$set(vm.deptment,"subjectId",tempData.subjectId)
                }
                if (!Z_IsEmpty20(tempData.subjectIdName)) {
                    vm.$set(vm.deptment,"subjectIdName",tempData.subjectIdName)
                }
            } else {
                vm.multipleSub = true
                vm.singleSub = false
                if (!Z_IsEmpty20(tempData.subjectId)) {
                    vm.$set(vm.deptment,"MuiltsubjectId",tempData.subjectId)
                }
                if (!Z_IsEmpty20(tempData.subjectIdName)) {
                    vm.$set(vm.deptment,"MulitsubjectIdName",tempData.subjectIdName)
                }
            }
            if (!Z_IsEmpty20(tempData.depreciationSubjectIdName)) {
                vm.$set(vm.deptment,"depreciationSubjectIdName",tempData.depreciationSubjectIdName)
            }
            if (!Z_IsEmpty20(tempData.depreciationSubjectId)) {
                vm.$set(vm.deptment,"depreciationSubjectId",tempData.depreciationSubjectId)
            }
            if (!Z_IsEmpty20(tempData.fixedAssetsSubjectIdName)) {
                vm.$set(vm.deptment,"fixedAssetsSubjectIdName",tempData.fixedAssetsSubjectIdName)
            }
            if (!Z_IsEmpty20(tempData.fixedAssetsSubjectId)) {
                vm.$set(vm.deptment,"fixedAssetsSubjectId",tempData.fixedAssetsSubjectId)
            }

            //原值数据
            vm.originalData = {}
            if (!Z_IsEmpty20(tempData.exchangeRate)) {
                vm.$set(vm.originalData,"exchangeRate",tempData.exchangeRate)
            }
            if (!Z_IsEmpty20(tempData.currencyId) && !Z_IsEmpty20(tempData.exchangeRate)) {
                vm.$set(vm.originalData,"currencyId", tempData.currencyId + '-' + tempData.exchangeRate)
            }
            if (!Z_IsEmpty20(tempData.depreciationMethod)) {
                vm.$set(vm.originalData,"depreciationMethod",tempData.depreciationMethod)
            }
            if (!Z_IsEmpty20(tempData.expectedDurationOfUse)) {
                vm.$set(vm.originalData,"expectedDurationOfUse",tempData.expectedDurationOfUse)
            }
            if (!Z_IsEmpty20(tempData.originalCurrencyAmount)) {
                vm.$set(vm.originalData,"originalCurrencyAmount",tempData.originalCurrencyAmount)
            }
            if (!Z_IsEmpty20(tempData.localCurrencyAmount)) {
                vm.$set(vm.originalData,"localCurrencyAmount",tempData.localCurrencyAmount)
            }
            if (!Z_IsEmpty20(tempData.purchaseOriginalValue)) {
                vm.$set(vm.originalData,"purchaseOriginalValue",tempData.purchaseOriginalValue)
            }
            if (!Z_IsEmpty20(tempData.accumulatedDepreciationOfPurchases)) {
                vm.$set(vm.originalData,"accumulatedDepreciationOfPurchases",tempData.accumulatedDepreciationOfPurchases)
            }
            if (!Z_IsEmpty20(tempData.accumulativeDepreciationAdjustment)) {
                vm.$set(vm.originalData,"accumulativeDepreciationAdjustment",tempData.accumulativeDepreciationAdjustment)
            }
            if (!Z_IsEmpty20(tempData.originalCurrencyAdjustment)) {
                vm.$set(vm.originalData,"originalCurrencyAdjustment",tempData.originalCurrencyAdjustment)
            }
            if (!Z_IsEmpty20(tempData.startDate)) {
                vm.$set(vm.originalData,"startDate",tempData.startDate)
            }
            if (!Z_IsEmpty20(tempData.usedPeriod)) {
                vm.$set(vm.originalData,"usedPeriod",tempData.usedPeriod)
            }
            if (!Z_IsEmpty20(tempData.accumulatedDepreciationAmount)) {
                vm.$set(vm.originalData,"accumulatedDepreciationAmount",tempData.accumulatedDepreciationAmount)
            }
            if (!Z_IsEmpty20(tempData.estimatedResidualValue)) {
                vm.$set(vm.originalData,"estimatedResidualValue",tempData.estimatedResidualValue)
            }
            if (!Z_IsEmpty20(tempData.impairmentPreparation)) {
                vm.$set(vm.originalData,"impairmentPreparation",tempData.impairmentPreparation)
            }
            if (!Z_IsEmpty20(tempData.netWorth)) {
                vm.$set(vm.originalData,"netWorth",tempData.netWorth)
            }
            if (!Z_IsEmpty20(tempData.netAmount)) {
                vm.$set(vm.originalData,"netAmount",tempData.netAmount)
            }
            if (!Z_IsEmpty20(tempData.workMeasureUnit)) {
                vm.$set(vm.originalData,"workMeasureUnit",tempData.workMeasureUnit)
            }
            //期间数据
            vm.periodData = {}
            if (!Z_IsEmpty20(tempData.period)) {
                vm.$set(vm.periodData,"searchData",tempData.period)
            }
            if (!Z_IsEmpty20(tempData.usedPeriod)) {
                vm.$set(vm.periodData,"usedPeriod",tempData.usedPeriod)
            }
            if (!Z_IsEmpty20(tempData.originalCurrencyAmount)) {
                vm.$set(vm.periodData,"currentValue",tempData.originalCurrencyAmount)
            }
            if (!Z_IsEmpty20(tempData.accumulatedDepreciationAmount)) {
                vm.$set(vm.periodData,"depretciaCount",tempData.accumulatedDepreciationAmount)
            }
            if (!Z_IsEmpty20(tempData.netWorth)) {
                vm.$set(vm.periodData,"countNumber",tempData.netWorth)
            }

        }
      });
    },
    useDeptType(params) {
      this.deptType = params;
    },
    useSubType(params) {
      this.subType = params;
    },
    // 折旧方法
    review() {
      console.info("计提折旧");
    },
    cancleinfo() {
      this.$router.go(-1);
    },
    //Tab切换事件
    onItemClick(index) {
      if (index === 1) {
        this.indexdept = true;
        this.index = false;
        this.indexasset = false;
        this.indexadd = false;
      } else if (index === 2) {
        this.indexdept = false;
        this.index = false;
        this.indexadd = false;
        this.indexasset = true;
      } else if (index === 3) {
        this.index = false;
        this.indexadd = true;
        this.indexdept = false;
        this.indexasset = false;
      } else if (index === 0) {
        this.index = true;
        this.indexadd = false;
        this.indexdept = false;
        this.indexasset = false;
      }
    },
    // header部分下拉框事件
    handleMenu(data) {
      let labelNode = "";
      this.$router.push({
        path: "seeAssetManage",
        query: {
          flag: labelNode,
          companyId: this.paramtemp.companyId
        }
      });
    },
    // 反审核
    checkout() {
      let vm = this;
      let id =  vm.updateId
      let url = "/zingbiz/fixedAssets/assetsManagement/antiAudit/" + id
      vm.$http.get(url).then(res => {
        if (res.data.success) {
             location.reload();
            vm.$router.push({
                path: "seeAssetManage",
                query: {
                    flag: "update",
                    originId: id,
                    companyId: vm.paramtemp.companyId
                }
            });
        } else {
             vm.$vux.toast.text(res.date.msg);
             return;
        }
      });
    },
    //数据提交事件及表单必填项校验
    submitBasicInfo() {
      let vm = this;
      if (Z_IsEmpty20(vm.asset.assetsClassName)) {
        vm.$vux.toast.text("请选择资产类别");
        return;
      }
      if (Z_IsEmpty20(vm.asset.assetsCoding)) {
        vm.$vux.toast.text("请输入资产编码");
        return;
      }
      if (Z_IsEmpty20(vm.asset.assetsName)) {
        vm.$vux.toast.text("请输入资产名称");
        return;
      }
      if (Z_IsEmpty20(vm.asset.postingDate)) {
        vm.$vux.toast.text("请选择入账日期");
        return;
      }
      if (Z_IsEmpty20(vm.asset.storePlaceIdName)) {
        vm.$vux.toast.text("请选择存放地点");
        return;
      }
      if (Z_IsEmpty20(vm.asset.workingConditionIdName)) {
        vm.$vux.toast.text("请选择使用状况");
        return;
      }
      if (Z_IsEmpty20(vm.asset.changeWayName)) {
        vm.$vux.toast.text("请选择变动方式");
        return;
      }
      if (Z_IsEmpty20(vm.deptment.fixedAssetsSubjectIdName)) {
        vm.$vux.toast.text("请选择固定资产科目");
        return;
      }
      if (Z_IsEmpty20(vm.deptment.depreciationSubjectIdName)) {
        vm.$vux.toast.text("请选择累计折旧科目");
        return;
      }
      if (vm.deptType) {
        if (Z_IsEmpty20(vm.deptment.departmentName)) {
          vm.$vux.toast.text("请选择部门");
          return;
        }
      } else if (vm.multipleDepart) {
        if (Z_IsEmpty20(vm.deptment.MulitdepartmentName)) {
            vm.$vux.toast.text("请选择部门");
            return;
            }
      }
      if (vm.subType) {
        if (Z_IsEmpty20(vm.deptment.subjectIdName)) {
          vm.$vux.toast.text("请选择科目");
          return;
        }
      } else if (vm.multipleSub) {
        if (Z_IsEmpty20(vm.deptment.MulitsubjectIdName)) {
          vm.$vux.toast.text("请选择科目");
          return;
        }
      }

      if (Z_IsEmpty20(vm.originalData.currencyId)) {
        vm.$vux.toast.text("请设置币别");
        return;
      }
      if (Z_IsEmpty20(vm.originalData.exchangeRate)) {
        vm.$vux.toast.text("请输入汇率");
        return;
      }
      if (Z_IsEmpty20(vm.originalData.originalCurrencyAmount)) {
        vm.$vux.toast.text("请输入原币金额");
        return;
      }
      if (Z_IsEmpty20(vm.originalData.expectedDurationOfUse)) {
        vm.$vux.toast.text("请选择预计使用期间数");
        return;
      }
      if (Z_IsEmpty20(vm.originalData.usedPeriod)) {
        vm.$vux.toast.text("请选择已使用期间数");
        return;
      }
      let amount = vm.originalData.expectedDurationOfUse - vm.originalData.usedPeriod
      if (amount < 0) {
            vm.$vux.toast.text("请正确输入已使用期间数");
            return;
      }
      if (Z_IsEmpty20(vm.originalData.depreciationMethod)) {
        vm.$vux.toast.text("请选择折旧方法");
        return;
      }
      let url1 = "/zingbiz/fixedAssets/configuration/checkSetupConfiguration";
      vm.$http.get(url1).then(res => {
           if (res.data.success) {
              if (res.data.data.isSetup) {
                    if (res.data.data.data.auditNeededBeforeAddDelUpdate) {
                        vm.basicInfo("WTJ").then(res => {
                            if (res.data.success) {
                            vm.$vux.toast.text(res.data.msg);
                                vm.$router.push({
                                    path: "/workflow/workflowMain",
                                    query: {
                                        gdzcId: vm.updateId,//固定资产的唯一id标识
                                        wfType: "MT_GDZC",
                                        companyId:vm.paramtemp.companyId
                                    }
                                });
                            } else {
                            vm.$vux.toast.text(res.data.msg);
                            }
                        });
                    } else {
                        vm.basicInfo("YSH").then(res => {
                            if (res.data.success) {
                            vm.$vux.toast.text(res.data.msg);
                            this.$router.push({
                                path: "assetManage",
                                query: {}
                            });
                            } else {
                            vm.$vux.toast.text(res.data.msg);
                            }
                    });
                  }
              } else {
                   vm.$vux.toast.text('请设置初始化参数');
              }
          } else {
               vm.$vux.toast.text(res.data.mgs);
          }
      })
    },

    //获取接口参数
    basicInfo(statusItem) {
        let vm = this;
        let depart = "";
        let departmentId = "";
        let subjectId = "";
        let subType = "";
        if (vm.deptType) {
            depart = "single";
            vm.deptment.departAction = []
            departmentId = vm.deptment.department;
        } else {
            depart = "multiple";
            departmentId = vm.deptment.MulitdepartmentName;
        }
        if (vm.subType) {
            subType = "single";
            vm.deptment.subjectAction = []
            subjectId = vm.deptment.subjectId;
        } else {
            subType = "multiple";
            subjectId = vm.deptment.MulitsubjectIdName;
        }
        let subjectInfos = vm.subType ? [] : vm.deptment.subjectAction
        let departmentAllocations = vm.deptType ? [] : vm.deptment.departAction
        let params = {
            assetsClass: vm.asset.assetsClass, //资产类别
            assetsName: vm.asset.assetsName, //资产名称
            postingDate: vm.asset.postingDate, // 入账日期
            changeWay: vm.asset.changeWay, // 变动方式
            workingConditionId: vm.asset.workingConditionId, //使用状况
            storePlaceId: vm.asset.storePlaceId, //存放地点
            currencyId: vm.originalData.currencyId.split("-")[0], //币别
            departmentSelection: depart, // 选择单一或多个部门(单一:single,多个:multiple) ,
            department: departmentId, // 存储部门的id(以空格分隔)
            depreciationMethod: vm.originalData.depreciationMethod, // 折旧方法
            depreciationSubjectId: vm.deptment.depreciationSubjectId, //累计折旧科目
            exchangeRate: vm.originalData.exchangeRate, //汇率
            expectedDurationOfUse: vm.originalData.expectedDurationOfUse, // 预计使用期间数
            fixedAssetsSubjectId: vm.deptment.fixedAssetsSubjectId, // 固定资产科目
            originalCurrencyAmount: vm.originalData.originalCurrencyAmount, //原币金额
            // originalValue: vm.originalData.originalValue, //原值(单一: single, 多个:multiple) ,
            status: statusItem, //状态[YSH, YJZ, WTJ, DSH]
            subjectId: subjectId, // 存储的科目id(以空格分隔)
            subjectSelection: subType, //折旧费用科目选择(单一:single,多个:multiple)
            usedPeriod: vm.originalData.usedPeriod, //已使用期间数
            subjectInfos:subjectInfos
        };
        let assetsCoding = vm.asset.assetsCoding ? { assetsCoding: vm.asset.assetsCoding } : {}; //资产编码
        let measureUnitId = vm.asset.measureUnitId ? { measureUnitId : vm.asset.measureUnitId } : {}; //计量单位
        let count = vm.asset.count ? { count: vm.asset.count } : {}; //数量
        let economicUse = vm.asset.economicUse
            ? { economicUse: vm.asset.economicUse }
            : {}; //经济用途
        let supplier = vm.asset.supplier ? { supplier: vm.asset.supplier } : {}; // 供应商
        let manufacturer = vm.asset.manufacturer
            ? { manufacturer: vm.asset.manufacturer }
            : {}; //制造商
        let remark = vm.asset.remark ? { remark: vm.asset.remark } : {}; //
        let genTime = {}; //
        let accessoryEquipments = []; // 附属设别id
        accessoryEquipments = vm.asset.equipment ? { accessoryEquipments:vm.asset.equipment } : {};
        let accumulatedDepreciationAmount = vm.originalData
            .accumulatedDepreciationAmount
            ? {
                accumulatedDepreciationAmount:
                vm.originalData.accumulatedDepreciationAmount
            }
            : {}; //累计折旧金额
        let accumulatedDepreciationOfPurchases = vm.originalData
            .accumulatedDepreciationOfPurchases
            ? {
                accumulatedDepreciationOfPurchases:
                vm.originalData.accumulatedDepreciationOfPurchases
            }
            : {}; //购进累计折旧
        let estimatedResidualValue = vm.originalData.estimatedResidualValue
            ? { estimatedResidualValue: vm.originalData.estimatedResidualValue }
            : {}; // 累计残净值
        let impairmentPreparation = vm.originalData.impairmentPreparation
            ? { impairmentPreparation: vm.originalData.impairmentPreparation }
            : {}; //减值准备
        let netAmount = vm.originalData.netAmount
            ? { netAmount: vm.originalData.netAmount }
            : {}; //净额
        let netWorth = vm.originalData.netWorth
            ? { netWorth: vm.originalData.netWorth }
            : {}; // 净值
        let originalCurrencyAdjustment = vm.originalData
            .originalCurrencyAdjustment
            ? {
                originalCurrencyAdjustment:
                vm.originalData.originalCurrencyAdjustment
            }
            : {}; //原币调整
        let localCurrencyAmount = vm.originalData.localCurrencyAmount
            ? { localCurrencyAmount: vm.originalData.localCurrencyAmount }
            : {}; //本币金额
        let purchaseOriginalValue = vm.originalData.purchaseOriginalValue
            ? { purchaseOriginalValue: vm.originalData.purchaseOriginalValue }
            : {}; //购进原值
        let startDate = vm.originalData.startDate ? { startDate : vm.originalData.startDate }
            : {}; //开始使用日期
        let workMeasureUnit = vm.originalData.workMeasureUnit
            ? { workMeasureUnit: vm.originalData.workMeasureUnit }
            : {}; //工作计量单位
        let originalId = ""
        let id = ""
        let url = "";
        let typeitem = "";
        let accumulativeDepreciationAdjustment = ""
        if (vm.tabItem === "add") {
            url = "/zingbiz/fixedAssets/assetsManagement/insert";
            typeitem = "add";
        } else if (vm.tabItem === "change") {
            url = "/zingbiz/fixedAssets/assetsManagement/change";
            typeitem = "change";
            if (vm.assetItem.type === 'add') {
                originalId = vm.updateId ? { originalId: vm.updateId } : {}
            } else if (vm.assetItem.type === 'clean' || vm.assetItem.type === 'change') {
                originalId = vm.changeId ? { originalId: vm.changeId } : {};
            }
            accumulativeDepreciationAdjustment = vm.originalData.accumulativeDepreciationAdjustment ? { accumulativeDepreciationAdjustment: vm.originalData.accumulativeDepreciationAdjustment } : {}
        } else if (vm.tabItem === "update") {
            url = "/zingbiz/fixedAssets/assetsManagement/update";
            if (vm.changeType === "change" || vm.changeType === "clean") {
            originalId = vm.changeId ? { originalId: vm.changeId } : {};
            }
            id = vm.updateId ? { id: vm.updateId } : {};
        }
        let type = typeitem ? { type: typeitem } : {};
        params = Object.assign(
            {},
            params,
            assetsCoding,
            id,
            originalId,
            count,
            economicUse,
            supplier,
            manufacturer,
            remark,
            genTime,
            measureUnitId,
            accessoryEquipments,
            accumulatedDepreciationAmount,
            accumulatedDepreciationOfPurchases,
            estimatedResidualValue,
            impairmentPreparation,
            netAmount,
            netWorth,
            originalCurrencyAdjustment,
            localCurrencyAmount,
            purchaseOriginalValue,
            startDate,
            workMeasureUnit,
            departmentAllocations,
            accumulativeDepreciationAdjustment,
            type
        );
        return vm.$http.post(url, params);
    }
  }
};
</script>
<style scoped>
  .inner{
    height: calc(100% - 50px);
  }
.tab-list .vux-tab {
  background-color: #efefef !important;
}
.review {
  color: #ea7e26;
  border: 1px solid #ea7e26;
  padding-left: 10px;
  margin-top: 0px;
}

</style>


