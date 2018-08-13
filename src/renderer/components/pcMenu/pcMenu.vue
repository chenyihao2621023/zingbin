<template>
    <div style="position: relative;overflow: hidden;height: 100%">
        <pcMenuAgent v-if="bower('IE')"></pcMenuAgent>
        <el-container :style="{ height:bower('IE')? (screenHeight - 62)+'px' : screenHeight +'px'}" style="border: 1px solid #eee">
            <el-aside v-show="asideIsShow" width="200px">
                <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"
                         :collapse="isCollapse" unique-opened :router="false">
                    <zi-menu-item @leftMenuShow="leftMenuShow" :resObj="resObj" :routes="menuData"></zi-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <router-view/>
            </el-container>
        </el-container>
    </div>
</template>


<script>
import ZiMenuItem from "components/pcMenu/pcMenuItem";
import pcMenuAgent from "./pcMenuAgent";
import { MH_Browser } from "../../utils/fn.js";
export default {
  components: { ZiMenuItem, pcMenuAgent },
  props: {
    pathData: {
      default: ""
    }
  },
  data() {
    return {
      screenHeight: 0,
      isCollapse: false,
      userLogin: {},
      asideIsShow: false,
      asideLength: 0,
      roleList: [],
      resObj: {} //权限集合
    };
  },
  computed: {
    onRoutes() {
      let path = this.$route.path;
      let arr = path.split("/");
      return arr.pop();
    },
    menuData() {
      let md = [
        {
          name: "messagelist",
          url: "/messagelist",
          title: "消息",
          isShow: true,
          icon: "iconfont icon-icon--"
        },
        {
          name: "find",
          url: "/find",
          title: "发现",
          isShow: true,
          icon: "iconfont icon-shoucangbiaoji"
        },
        {
          //name:'/contact',
          name: "3",
          title: "通讯录",
          isShow: true,
          icon: "iconfont icon-lianxiren",
          children: [
            {
              name: "3-1",
              isShow: true,
              url:
                "/SRender?jsLoader=Favorite%2FcollecterLoader&tpl=Favorite%2Fcollecter.html&v=1.13161216_1319",
              title: "新的好友"
            },
            {
              name: "friends",
              url: "/friends",
              isShow: true,
              title: "英商好友"
            },
            {
              name: "TISHI",
              url: "TISHI",
              isShow: true,
              title: "手机通信录"
            },
            {
              name: "orgList",
              url: "/orgList?companyId=" + this.userLogin.companyId,
              isShow: true,
              title: "同事名录"
            },
            {
              name: "myGroups",
              url: "/myGroups",
              isShow: true,
              title: "我的群组"
            }
          ]
        },
        {
          name: "4",
          //url:'/workbench',
          title: "后台管理",
          icon: "iconfont icon-chanpinguanli",
          isShow: true,
          children: [
            {
              name: "orgPower",
              url: "/backstageManage/orgPower",
              isShow: true,
              title: "组织管理"
            },
            {
              name: "4-2",
              isShow: true,
              url:
                "/webEdit",
              title: "网站编辑"
            },
            {
              name: "workflowIndex",
              url: "/workflow/typeAndTemplate",
              isShow: true,
              title: "模板管理"
            },
            {
              name: "attenSettingList",
              url: "/attendanceHome/attenSettingList",
              isShow: true,
              title: "考勤设置"
            },
            {
              name: "4-9",
              isShow: true,
              url:
                "/SRender?jsLoader=reportModel%2FtaskSetModelLoader&tpl=reportModel%2FtaskSetModel&v=1.13180509_1141&menuRoleKey=20-60&menuRoleCode=&mhMenuKey_=10-80",
              title: "任务报表设置"
            }
          ]
        },
        {
          name: "5",
          url: "TISHI",
          title: "商城管理",
          isShow: true,
          icon: "iconfont icon-shangpu"
        },
        {
          name: "6",
          title: "点菜管理",
          icon: "iconfont icon-canting",
          isShow: false,
          children: [
            {
              name: "deskList",
              url: "/dinner/deskList",
              title: "点菜及账单",
              isShow: false
            },
            {
              name: "dinnerManage",
              url: "/dinner/dinnerManage",
              title: "菜品管理",
              isShow: false
            },
            {
              name: "printerManager",
              url: "/dinner/printerManager",
              title: "打印机管理",
              isShow: false
            },
            {
              name: "tagManager",
              url: "/dinner/tagManager",
              title: "标签设置",
              isShow: false
            },
            {
              name: "deskManager",
              url: "/dinner/deskManager",
              title: "桌位管理",
              isShow: false
            },
            {
              name: "dinnerClazz",
              url: "/dinner/dinnerClazz",
              title: "分类管理",
              isShow: false
            }
            /*{
                    name: "dinnerFinance",
                    url: "/dinner/dinnerFinanceManager",
                    title: "财务设置"
                  }*/
          ]
        },
        {
          name: "7",
          title: "订房管理",
          icon: "iconfont icon-jiudian",
          isShow: false,
          children: [
            {
              name: "hotel",
              url: "/hotel/roomState",
              isShow: true,
              title: "订房管理"
            }
          ]
        },
        {
          name: "8",
          title: "报表",
          icon: "iconfont icon-baobiao-selected",
          isShow: true,
          children: [
            {
              name: "8-1",
              url: "/report/task",
              isShow: true,
              title: "任务报表"
            },
            {
              name: "8-2",
              url: "/report/finance",
              isShow: true,
              title: "财务报表"
            },
            {
              name: "8-3",
              url: "/report/restaurant",
              isShow: true,
              title: "点菜报表"
            },
            {
              name: "8-5",
              isShow: true,
              url:
                "/SRender?jsLoader=report%2FreportCashFlowLoader&tpl=report%2FcashFlow%2FcashFlowProject&v=1.13180509_1141&mhMenuKey_=60-10",
              title: "现金流量项目"
            },
            {
              name: "8-6",
              isShow: true,
              url:
                "/SRender?jsLoader=report%2FreportCashFlowLoader&tpl=report%2FcashFlow%2Ft_TypeAccount&v=1.13180509_1141&mhMenuKey_=60-20",
              title: "T型账户"
            },
            {
              name: "8-7",
              isShow: true,
              url:
                "/SRender?jsLoader=report%2FreportCashFlowLoader&tpl=report%2FcashFlow%2FattachFormProject&v=1.13180509_1141&mhMenuKey_=60-30",
              title: "附表项目"
            },
            {
              name: "8-8",
              isShow: true,
              url:
                "/SRender?jsLoader=report%2FreportCashFlowLoader&tpl=report%2FcashFlow%2FcashFlowForm&v=1.13180509_1141&mhMenuKey_=60-40",
              title: "现金流量表"
            }
          ]
        },
        {
          name: "workflowMain",
          url: "/workflow/workflowMain",
          title: "审批",
          isShow: true,
          icon: "iconfont icon-shenpi1"
        },
        {
          name: "10",
          title: "客服",
          icon: "iconfont icon-kefu",
          isShow: true,
          children: [
            {
              name: "skillGroupManage",
              url: "/skillgroup/skillGroupManage",
              title: "技能组管理"
            }
          ]
        },
        {
          name: "11",
          title: "人力资源",
          isShow: true,
          icon: "iconfont icon-renyuanguanli",
          children: [
            {
              name: "userInfo",
              url: "/hrManager/userInfo",
              isShow: true,
              title: "我的档案"
            },
            {
              name: "hrManagerList",
              url: "/hrManager/hrManagerList",
              isShow: true,
              title: "档案管理"
            },
            {
              name: "tj",
              url: "/attendanceHome/tj",
              isShow: true,
              title: "考勤统计"
            },
            {
              name: "attenExamine",
              url: "/attendanceHome/attenExamine",
              isShow: true,
              title: "外勤审核"
            },
            {
              name: "employeeTurnoverList",
              url: "/hrManager/employeeTurnoverList",
              isShow: true,
              title: "待交接工作"
            },
            {
              name: "userSalaryList",
              url: "/hrManager/userSalaryList",
              isShow: true,
              title: "薪酬管理"
            },
            {
              name: "askForLeaveCalendar",
              url: "/hrManager/askForLeaveCalendar",
              isShow: true,
              title: "请假统计"
            }
          ]
        },
        {
          name: "taskManage",
          url: "/taskManage",
          title: "任务管理",
          isShow: true,
          icon: "iconfont icon-bianji1"
        },
        {
          name: "projectManage",
          url: "/projectManage",
          title: "项目管理",
          isShow: true,
          icon: "iconfont icon-02"
        },
        {
          name: "financeWarehouse",
          title: "财务",
          isShow: true,
          icon: "iconfont icon-fq_kucunfeiyong",
          children: [
            {
              name: "financeWarehouseList",
              url:
                "/resourceLibrary/financeWarehouse/warehouseList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "财务库"
            },
            {
              name: "financevoucherList",
              url: "/resourceLibrary/financeWarehouse/voucherList",
              isShow: true,
              title: "凭证"
            },
            {
              name: "financeVoucherCollectionList",
              url: "/resourceLibrary/financeWarehouse/collectionList",
              isShow: true,
              title: "凭证汇总"
            },
            {
              name: "financeVoucherList",
              title: "财务库全景",
              isShow: true,
              url: "/resourceLibrary/financeWarehouse/voucherList"
            },
            {
              name: "TISHI",
              title: "固定资产",
              isShow: true,
              url: "TISHI"
            },
            {
              name: "financeSetting",
              url: "/resourceLibrary/financeWarehouse/setting",
              isShow: true,
              title: "财务库设置"
            }
          ]
        },
        {
          name: "goodsWarehouse",
          isShow: true,
          title: "物品库",
          icon: "iconfont icon-list_kucunchaxun",
          children: [
            {
              name: "goodsWarehouseList",
              url:
                "/resourceLibrary/goodsWarehouse/warehouseList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "仓库管理"
            },
            {
              name: "goodsWarehouseGoodsList",
              url:
                "/resourceLibrary/goodsWarehouse/goodsList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "物品"
            },
            {
              name: "goodsWarehouseInventoryList",
              url:
                "/resourceLibrary/goodsWarehouse/inventoryList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "盘点"
            },
            {
              name: "goodsWarehouseAllocationList",
              url:
                "/resourceLibrary/goodsWarehouse/allocationList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "调拨"
            },
            {
              name: "goodsWarehouseOtherInList",
              url:
                "/resourceLibrary/goodsWarehouse/otherInOrOutList?voucherType=otherIn&companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "其他入库单"
            },
            {
              name: "goodsWarehouseOtherOutList",
              url:
                "/resourceLibrary/goodsWarehouse/otherInOrOutList?voucherType=otherOut&companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "其他出库单"
            },
            {
              name: "goodOtherInOrOutAllList",
              url:
                "/resourceLibrary/goodsWarehouse/otherInOrOutAllList?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "物品库全景"
            },
            {
              name: "goodsWarehouseSetting",
              url:
                "/resourceLibrary/goodsWarehouse/setting?companyId=" +
                this.userLogin.companyId,
              isShow: true,
              title: "物品库设置"
            }
          ]
        },
        {
          name: "CabinetList",
          url:
            "/resourceLibrary/goodsCabinet/CabinetList?companyId=" +
            this.userLogin.companyId,
          title: "物品柜",
          isShow: true,
          icon: "iconfont icon-caiwuguanli"
        },
        {
          name: "knowledgebase",
          url: "/knowledgebase?companyId=" + this.userLogin.companyId,
          title: "知识库",
          isShow: true,
          icon: "iconfont icon-weibiaoti4"
        },
        {
          name: "18",
          title: "财务设置",
          icon: "iconfont icon-caiwuguanli",
          isShow: true,
          children: [
            {
              name: "18-1",
              url: "/finance/subjectSetting",
              isShow: true,
              title: "科目设置"
            },
            {
              name: "18-2",
              url: "/finance/CurrencySetting",
              isShow: true,
              title: "币别设置"
            },
            {
              name: "18-3",
              url: "/finance/measureUnit",
              isShow: true,
              title: "计量单位设置"
            },
            {
              name: "18-4",
              url: "/finance/accountingPeriod",
              isShow: true,
              title: "会计期间设置"
            },
            {
              name: "18-5",
              url: "/finance/VoucherSetting",
              isShow: true,
              title: "凭证字设置"
            }
          ]
        },
        {
          name: "TISHI",
          url: "TISHI",
          title: "生产核算",
          isShow: true,
          icon: "iconfont icon-danjuchaxun"
        },
        {
          name: "20",
          title: "进销存",
          isShow: true,
          icon: "iconfont icon-drxx48",
          children: [
            {
              name: "20-1",
              url: "/resourceLibrary/invoicing/invoicingAllList",
              title: "单据查询",
              isShow: true
            },
            {
              name: "20-2",
              title: "库存查询",
              url:
                "/resourceLibrary/goodsWarehouse/goodsList?showAddGoods=false&companyId=" +
                this.userLogin.companyId,
              isShow: true
            },
            {
              name: "20-3",
              title: "采购入库单",
              url: "/resourceLibrary/invoicing/invoicingList?voucherType=buyIn",
              isShow: true
            },
            {
              name: "20-4",
              title: "采购退货单",
              url:
                "/resourceLibrary/invoicing/invoicingList?voucherType=buyBack",
              isShow: true
            },
            {
              name: "20-5",
              title: "销售订单",
              url:
                "/resourceLibrary/invoicing/invoicingList?voucherType=saleOut",
              isShow: true
            },
            {
              name: "20-6",
              title: "销售退货单",
              url:
                "/resourceLibrary/invoicing/invoicingList?voucherType=saleBack",
              isShow: true
            },
            {
              name: "20-7",
              title: "销售发货单",
              url:
                "/resourceLibrary/invoicing/invoicingList?voucherType=saleSend",
              isShow: true
            },
            {
              name: "20-8",
              title: "订房订单",
              url: "/resourceLibrary/invoicing/housingOrderList",
              isShow: true
            }
          ]
        },
        {
          name: "21",
          url: "/notice/noticeList",
          title: "公告",
          isShow: true,
          icon: "iconfont icon-xiaolaba"
        }
      ];
      return md;
    }
  },
  watch: {
    $route(to, from) {
      if (from !== null && from !== "") {
        if (
          from.path.toLowerCase() === "/login" &&
          to.fullPath.toLowerCase() !== "/hotellogin" &&
          to.fullPath.toLowerCase() !== "/dinnerlogin" &&
          to.fullPath.toLowerCase() !== "/nativelogin"
        ) {
          this.loadMyRole();
        }
      }
    },
    pathData(to, from) {
      let loadPath = to.toUpperCase();
      if (
        loadPath.indexOf("/HOTEL/") >= 0 ||
        loadPath.indexOf("/HOTELLOGIN") >= 0 ||
        loadPath.indexOf("/DINNERLOGIN") >= 0 ||
        loadPath.indexOf("/LOGIN") >= 0 ||
        loadPath.indexOf("/VIPCARD/") >= 0
      ) {
        this.asideIsShow = false;
      } else {
        this.asideIsShow = true;
      }
    }
  },
  created() {
    this.screenHeight = document.documentElement.clientHeight;
    this.loadMyRole();
  },
  methods: {
    bower(type) {
      if (MH_Browser() === type) {
        return true;
      }
      return false;
    },
    loadMyRole() {
      let that = this;
      let url = "/zingbiz/auth/role/loadMyRole";
      this.$http
        .post(url, {})
        .then(res => {
          if (res.data.success) {
            that.roleList = res.data.data;
            that.roleList.forEach(item => {
              if (item.resInfoVal) {
                this.resObj[item.resInfoVal] = true;
              }
            });
            this.loadCompany();
          }
        })
        .catch(error => {
            console.log("========error=======",error)
            if (PSMU) PSMU.error(err)
        });
    },

    loadCompany() {
      let url = "/zingbiz/auth/user/getThisUserInfo";
      let that = this;
      this.$http
        .post(url, {})
        .then(res => {
          that.userLogin = res.data.data;
        })
        .catch(err => {
            console.log("getThisUserInfo ==== ", err);
            if (PSMU) PSMU.error(err)
        });
    },
    leftMenuShow(val) {
      let that = this;
      if (val.indexOf("/hotel/") >= 0 || val.indexOf("/vipCard/") >= 0) {
        this.$nextTick(() => {
          that.asideIsShow = false;
        });
      } else {
        this.$nextTick(() => {
          that.asideIsShow = true;
        });
      }
    }
  }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-header {
  line-height: 47px;
}

.el-aside {
  color: #333;
  height: calc(100%);
}

/* col */
.el-row {
  margin-bottom: 20px;

  & :last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/* 左侧菜单高 todo:自适应 */
.el-menu.el-menu-vertical-demo {
  height: calc(100%);
}
.el-container > :first-child {
  width: 100%;
}
</style>
