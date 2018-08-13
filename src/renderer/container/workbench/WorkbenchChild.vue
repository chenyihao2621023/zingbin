<template>
  <div class="workbenchChild">
    <zing-head :title="title" v-on:doSome="doSome" :isComeBack="false"></zing-head>
    <div class="workbenchChild-content" :style="{'background-color': isArray ? '#fff' : '#F8F8F8'}">
      <div v-if="isArray">
        <grid  :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
          <grid-item v-if="item.isShow"  v-for="(item, index) in childData[childItem].data" :key="index" :label="item.name">

                <avatar :size="'normal'" slot="icon" :icon="item.icon" @click.native="gotoPage(item)" shape="square" :style="{background: item.color}"></avatar>

                <badge slot="icon" v-if="item.redPoint"></badge>
          </grid-item>
        </grid>
      </div>
      <div style=" background-color: #F8F8F8;" v-else>
        <div v-for="(val, key) in childData[childItem].data" :key="key">
          <group-title>{{val.name}}</group-title>
          <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item v-for="(item, index) in val.childrean" :key="index" :label="item.name">
              <avatar :size="'normal'" slot="icon" :icon="item.icon" @click.native="gotoPage(item)" shape="square" :style="{background: item.color}"></avatar>
            </grid-item>
          </grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Grid, GridItem, GroupTitle, Badge } from "vux";
import { Z_IsEmpty20 } from "utils/fn";
import Avatar from "components/avatar/Avatar";
import ZingHead from "components/zingHead/ZingHead.vue";

export default {
  name: "WorkbenchChild",
  components: {
    GroupTitle,
    Grid,
    GridItem,
    Avatar,
    ZingHead,
    Badge,
    Z_IsEmpty20
  },
  data() {
    return {
      childItem: "isnull",
      title: "",
      companyId: "",
      childData: {
        isnull: [],
        resources: {
          title: "人力资源",
          data: [
            //人力资源
            {
              name: "我的档案",
              link: "/hrManager/userInfo",
              icon: "gaiicon-",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "考勤统计",
              link: "/attendanceHome/tj?type=me",
              icon: "kaoqintongji",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "档案管理",
              link: "/hrManager/hrManagerList",
              icon: "dangan2",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "待交接工作",
              link: "/hrManager/employeeTurnoverList",
              icon: "drxx48",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "考勤审核",
              link: "/attendanceHome/attenExamine",
              icon: "shenheguanli",
              color: "#985DAE",
              role: ["admin", "editor"],
              edPoint: false,
              isShow: false
            },
            {
              name: "薪酬管理",
              link: "/hrManager/userSalaryList",
              icon: "gongzi",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "请假统计",
              link: "/hrManager/askForLeaveCalendar",
              icon: "qingjia",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            }
          ]
        },
        shop: {
          title: "商城管理",
          data: [
            //商城管理
            {
              name: "商品管理",
              link: "",
              icon: "bianji1",
              color: "#40AFFC",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "店铺管理",
              link: "",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "订单管理",
              link: "",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "收款方式",
              link: "",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "店铺展示",
              link: "",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            }
          ]
        },
        reportForms: {
          title: "报表",
          data: [
            //报表
            {
              name: "任务报表",
              link: "/report/task",
              icon: "bianji1",
              color: "#40AFFC",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            } /*,
            {
              name: "财务报表",
              link: "/report/finance",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"]
            }*/,
            {
              name: "点菜报表",
              link: "/report/restaurant",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            }
          ]
        },
        management: {
          title: "后台管理",
          data: [
            //后台管理
            {
              name: "组织管理",
              link: "/backstageManage/orgPower",
              icon: "drxx95",
              color: "#88147f",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "网站编辑",
              link: "/webEdit",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "审批模板设置",
              link: "/workflow/typeAndTemplate",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            },
            {
              name: "考勤设置",
              link: "/attendanceHome/attenSettingList",
              icon: "leasingcloud_kaoqinpeizhi",
              color: "#985DAE",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "任务报表设置",
              link: "",
              icon: "shenpi1",
              color: "#F59324",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: true
            }
          ]
        },
        dinner: {
          title: "餐饮",
          data: [
            //餐饮
            {
              name: "点菜及账单",
              link: "/dinner/deskList",
              icon: "xiewrite18",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "菜品管理",
              link: "/dinner/dinnerManage",
              icon: "daocha",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "打印机管理",
              link: "/dinner/printerManager",
              icon: "renzhengziliao",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "标签设置",
              link: "/dinner/tagManager",
              icon: "entrust",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "桌位管理",
              link: "/dinner/deskManager",
              icon: "guojijiudiandingdan",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            },
            {
              name: "分类管理",
              link: "/dinner/dinnerClazz",
              icon: "leibie",
              color: "#FF8000",
              role: ["admin", "editor"],
              redPoint: false,
              isShow: false
            }
          ]
        },
        financeWarehouse: {
          title: "财务",
          data: {
            voucher: {
              name: "财务凭证",
              childrean: [
                {
                  link: "/resourceLibrary/financeWarehouse/voucherList",
                  icon: "iconfont icon-pingzhengguanli",
                  name: "凭证录入",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/warehouseList",
                  icon: "iconfont icon-fq_kucunfeiyong",
                  name: "财务库",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/voucherListAll",
                  icon: "iconfont icon-caiwubaobiao",
                  name: "凭证管理",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/collectionList",
                  icon: "iconfont icon-navicon-hzsp",
                  name: "凭证汇总",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/voucherPost",
                  icon: "iconfont icon-icon-test",
                  name: "凭证过账",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/setting",
                  icon: "iconfont icon-shezhi",
                  name: "凭证设置",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            fixedAssets: {
              name: "固定资产",
              childrean: [
                {
                  link: "/fixMoneyMain?Type=basic",
                  icon: "iconfont icon-fq_kucunfeiyong",
                  name: "基础设置",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/fixMoneyMain?Type=normal",
                  icon: "iconfont icon-pingzhengguanli",
                  name: "日常处理",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/fixReport",
                  icon: "iconfont icon-navicon-hzsp",
                  name: "报表查询",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            finalSettlement: {
              name: "期末处理",
              childrean: [
                {
                  link: "/resourceLibrary/financeWarehouse/finalRemittance",
                  icon: "iconfont icon-fq_kucunfeiyong",
                  name: "期末调汇",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link:
                    "/resourceLibrary/financeWarehouse/accountProfitAndLoss",
                  icon: "iconfont icon-pingzhengguanli",
                  name: "结转损益",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/financeWarehouse/finalCheckout",
                  icon: "iconfont icon-navicon-hzsp",
                  name: "期末结账",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            reportAnalysis: {
              name: "报表分析",
              childrean: [
                {
                  link: "/report/castFlowMain",
                  icon: "iconfont icon-fq_kucunfeiyong",
                  name: "现金流量",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/report/finance",
                  icon: "iconfont icon-pingzhengguanli",
                  name: "财务报表",
                  color: "#E7BB35",
                  redPoint: false,
                  isShow: true
                }
              ]
            }
          }
        },

        goodsWarehouse: {
          title: "物品库",
          data: [
            {
              link: "/resourceLibrary/goodsWarehouse/warehouseList",
              icon: "iconfont icon-zhishicangku",
              name: "仓库管理",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link: "/resourceLibrary/goodsWarehouse/goodsList",
              icon: "iconfont icon-chanpinguanli",
              name: "物品",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link: "/resourceLibrary/goodsWarehouse/inventoryList",
              icon: "iconfont icon-pandian",
              name: "盘点",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link: "/resourceLibrary/goodsWarehouse/allocationList",
              icon: "iconfont icon-icon-transfer",
              name: "调拨",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link:
                "/resourceLibrary/goodsWarehouse/otherInOrOutList?voucherType=otherIn",
              icon: "iconfont icon-navicon-qtrkd",
              name: "其他入库单",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link:
                "/resourceLibrary/goodsWarehouse/otherInOrOutList?voucherType=otherOut",
              icon: "iconfont icon-navicon-qtckd",
              name: "其他出库单",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link: "/resourceLibrary/goodsWarehouse/otherInOrOutAllList",
              icon: "iconfont icon-quanbudingdan",
              name: "物品库全景",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            },
            {
              link: "/resourceLibrary/goodsWarehouse/setting",
              icon: "iconfont icon-setting",
              name: "物品库设置",
              color: "#9659AE",
              redPoint: false,
              isShow: true
            }
          ]
        },
        inventoryManagement: {
          title: "进销存",
          data: {
            query: {
              name: "查询",
              childrean: [
                {
                  link: "/resourceLibrary/invoicing/invoicingAllList",
                  icon: "iconfont icon-danjuchaxun",
                  name: "单据查询",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                },
                {
                  link: "/resourceLibrary/goodsWarehouse/goodsList?showAddGoods=false",
                  icon: "iconfont icon-list_kucunchaxun",
                  name: "库存查询",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            purchase: {
              name: "采购",
              childrean: [
                {
                  link:
                    "/resourceLibrary/invoicing/invoicingList?voucherType=buyIn",
                  icon: "iconfont icon-purchaseorder",
                  name: "采购入库单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                },
                {
                  link:
                    "/resourceLibrary/invoicing/invoicingList?voucherType=buyBack",
                  icon: "iconfont icon-purchasereturn",
                  name: "采购退货单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            sales: {
              name: "销售",
              childrean: [
                {
                  link:
                    "/resourceLibrary/invoicing/invoicingList?voucherType=saleOut",
                  icon: "iconfont icon-salesorder",
                  name: "销售订单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                },
                {
                  link:
                    "/resourceLibrary/invoicing/invoicingList?voucherType=saleBack",
                  icon: "iconfont icon-salesreturn",
                  name: "销售退货单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                },
                {
                  link:
                    "/resourceLibrary/invoicing/invoicingList?voucherType=saleSend",
                  icon: "iconfont icon-xiaoshougendanguanli",
                  name: "销售发货单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                }
              ]
            },
            others: {
              name: "其他",
              childrean: [
                {
                  link: "/resourceLibrary/invoicing/housingOrderList",
                  icon: "iconfont icon-guoneijiudiandingdan1",
                  name: "订房订单",
                  color: "#40AFFC",
                  redPoint: false,
                  isShow: true
                } /*,
                {
                  link: "/report/finance",
                  icon: "iconfont icon-guojijiudiandingdan",
                  name: "点菜订单",
                  color: "#40AFFC"
                }*/
              ]
            }
          }
        }
      }
    };
  },
  computed: {
    ...mapState({
      redPoint: state => state.ui.redPoint
    }),
    isArray() {
      return this.childData[this.childItem].data instanceof Array;
    }
  },
  watch: {
    redPoint(rpData) {
      if (!rpData) {
        //console.warn("error redPoint data", rpData);
        return;
      }
      let sArr = rpData.split("_ZSP_");
      for (let i = 0; i < sArr.length; i++) {
        if (!Z_IsEmpty20(sArr[i])) {
          if (sArr[i].substring(0, sArr[i].indexOf(":")) === "hr") {
            //hr红点
            let jsonStr = sArr[i].substring(
              sArr[i].indexOf(":") + 1,
              sArr[i].length
            );
            let hrObj = JSON.parse(jsonStr);

            this.childData["resources"].data.forEach(item => {
              if (item.name === "我的档案") {
                if (hrObj["HR_GR"].length > 0) {
                  this.$set(item, "redPoint", true);
                }
              } else if (item.name === "考勤统计") {
              } else if (item.name === "我的档案") {
              } else if (item.name === "档案管理") {
                if (hrObj["HR_SH"].length > 0) {
                  this.$set(item, "redPoint", true);
                }
              } else if (item.name === "待交接工作") {
              } else if (item.name === "考勤审核") {
                if (hrObj["HR_WQSH"].length > 0) {
                  this.$set(item, "redPoint", true);
                }
              } else if (item.name === "薪酬管理") {
              } else if (item.name === "考勤统计") {
              }
            });
          } else if (
            sArr[i].substring(0, sArr[i].indexOf(":")) === "bindRequest"
          ) {
            let bindRequestStr = sArr[i].substring(
              sArr[i].indexOf(":") + 1,
              sArr[i].length
            );
            let bindRequest = JSON.parse(bindRequestStr);
            this.childData["management"].data.forEach(item => {
              if (item.name === "组织管理") {
                if (bindRequest.total > 0) {
                  this.$set(item, "redPoint", true);
                }
              }
            });
          }
        }
      }
    }
  },
  created() {
    let citem = this.$route.query.childItem;
    this.childItem = this.childData[citem] ? citem : "isnull";
    this.title = this.childData[citem].title;
    this.companyId = this.$route.query.companyId;

    //权限数据
    this.loadResource();
  },
  methods: {
    loadResource() {
      let _this = this;
      let resObj = {};
      let url = "/zingbiz/auth/role/loadMyRole";
      this.$http.post(url, {}).then(res => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          let retData = res.data.data;
          retData.forEach(item => {
            if (item.resInfoVal) {
              resObj[item.resInfoVal] = true;
            }
          });
          //console.log("权限数据",resObj)

          let childItem = this.$route.query.childItem;
          if (childItem) {
            if (childItem === "resources") {
              //人力资源
              _this.childData["resources"].data.forEach(item => {
                if (item.name === "考勤统计") {
                  if (resObj["40-50"]) {
                    //_this.$set(item, "isShow", true);
                    _this.$set(item, "link", "/attendanceHome/tj?type=all");
                  }
                } else if (item.name === "档案管理") {
                  if (resObj["fileManagementPower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "待交接工作") {
                  if (resObj["40-60"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "考勤审核") {
                  if (resObj["40-80"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "薪酬管理") {
                  if (resObj["paySettingPower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "请假统计") {
                  if (resObj["leaveCountPower"]) {
                    _this.$set(item, "isShow", true);
                  }
                }
              });
            } else if (childItem === "management") {
              //后台管理
              _this.childData["management"].data.forEach(item => {
                if (item.name === "组织管理") {
                  if (resObj["organizationManagePower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "网站编辑") {
                  if (resObj["00-10"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "公告编辑") {
                  if (resObj["80-10"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "审批设置") {
                } else if (item.name === "考勤设置") {
                  if (resObj["40-70"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "任务报表") {
                }
              });
            } else if (childItem === "dinner") {
              //后台管理
              _this.childData["dinner"].data.forEach(item => {
                if (item.name === "点菜及账单") {
                  if (resObj["orderAndBillPower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "菜品管理") {
                  if (resObj["foodManagePower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "打印机管理") {
                  if (resObj["printerManagePower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "标签设置") {
                  if (resObj["labelSettingPower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "桌位管理") {
                  if (resObj["tableManagePower"]) {
                    _this.$set(item, "isShow", true);
                  }
                } else if (item.name === "分类管理") {
                  if (resObj["classifyManagePower"]) {
                    _this.$set(item, "isShow", true);
                  }
                }
              });
            }
          }
        }
      });
    },
    doSome() {
      this.$router.push("/workbench");
    },
    gotoPage(item) {
      let url = item.link;
      if (typeof url !== "undefined") {
        if (typeof this.companyId !== "undefined" && this.companyId !== "") {
          if (url.indexOf("?") < 0) {
            url += "?";
          } else {
            url += "&";
          }
          url += "companyId=" + this.companyId;
        }
        this.$router.push({ path: url });
      } else {
        this.$vux.toast.text(item.text, "middle");
      }
    }
  }
};
</script>

<style>
.weui-grid:before {
  box-sizing: content-box;
}

/* li {
        list-style: initial;
    }
    li > a {
        color: #3a8ee6;
    } */
</style>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.workbenchChild {
  height: 100%;

  /* 红点位置 */
  .weui-grid__icon {
    position: relative;
    width: 45px !important;
    height: 45px !important;
  }

  .vux-badge.vux-badge-dot {
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .triangle-down {
    display: inline-block;
    border-right: 2px solid;
    border-bottom: 2px solid;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    vertical-align: middle;
  }

  .workbenchChild-content {
    height: calc(100% - 50px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .weui-cells__title {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #40affc;
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .weui-grids {
      background-color: #FFF;

      .weui-grid {
        width: 25%;

        &:before {
          border: none;
        }

        &:after {
          border: none;
        }

        .weui-grid__icon {
          flex-center(row, center, center);
          width: auto;
          height: auto;
        }

        .iconfont {
          font-size: 22px;
        }
      }
    }
  }
}
</style>
