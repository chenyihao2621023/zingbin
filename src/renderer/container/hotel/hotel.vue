<template>
    <div style="height: 100%;position: relative">
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-aside width="200px" :style="{backgroundColor:'rgb(238, 241, 246)'}">

                <el-menu :default-active="onRoutes" :collapse="isCollapse" unique-opened :router="true">
                    <zi-menu-item :routes="menuData"></zi-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <router-view/>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import store from "../../store";
import _ from "lodash";
import Row from "./children/roomState.vue";
import hotelHeader from "./children/Hotel_header.vue";
import ZiMenuItem from "components/zimenuitem/ZiMenuItem";
import { mapState, mapMutations } from "vuex";

export default {
  components: { Row, hotelHeader, ZiMenuItem },
  data() {
    return {
      powerObject: {
        hotelReservationManagePower: true,
        hotelCheckInManagePower: true,
        hotelGuestManagePower: true,
        hotelStatusManagePower: true,
        hotelDealSettingManagePower: true,
        hotelReceptionManagePower: true,
        hotelBargainingUnitManagePower: true,
        hotelSystemSettingManagePower: true,
        hotelReportManagePower: true,
        // hotelSystemSettingManagePower:false,
        hotelRoomStatusManagePower: true,

        hotelRoomSettingManagePower: true
      },
      hotelRoomStatusManagePower: true,
      list: [],
      isCollapse: false,
      menuCopy: [],
      menuData: [
        {
          name: "1",
          title: "预定",
          icon: "el-icon-location",
          children: [
            {
              name: "singleReserve",
              title: "散客",
              query: { reserveMenu: "1" }
            },
            {
              name: "groupReserve",
              title: "团体",
              query: { reserveMenu: "2" }
            },
            {
              name: "selfUseReserve",
              title: "自用房",
              query: { reserveMenu: "3" }
            },
            {
              name: "freeReserve",
              title: "免费房",
              query: { reserveMenu: "4" }
            }
          ]
        },
        {
          name: "2",
          title: "入住",
          icon: "el-icon-location",
          children: [
            {
              name: "singleCheckIn",
              title: "散客",
              query: { checkInMenu: "1" }
            },
            {
              name: "groupCheckIn",
              title: "团体",
              query: { checkInMenu: "2" }
            },
            {
              name: "selfUseCheckIn",
              title: "自用房",
              query: { checkInMenu: "3" }
            },
            {
              name: "freeCheckIn",
              title: "免费房",
              query: { checkInMenu: "4" }
            }
          ]
        },
        {
          name: "guestsList",
          title: "宾客列表",
          icon: "el-icon-setting"
        },
        {
          name: "teamList",
          title: "团队列表",
          icon: "el-icon-setting"
        },
        {
          name: "roomState",
          title: "房态图",
          icon: "el-icon-setting"
        },
        {
          name: "customerManage",
          title: "客户管理",
          icon: "el-icon-setting"
        },
        {
          name: "3",
          title: "实时状态",
          icon: "el-icon-location",
          children: [
            {
              name: "usableRoomTableList",
              title: "可用房列表"
            },
            {
              name: "HotelCurStatus",
              title: "当前状态"
            },
            {
              name: "liveInGuest",
              title: "在住宾客"
            }
          ]
        },
        {
          name: "roomManage",
          title: "客房管理配置",
          icon: "el-icon-location",
          children: [
            {
              name: "BlocksConfig",
              title: "楼区配置"
            },
            {
              name: "BuildingConfig",
              title: "楼座配置"
            },
            {
              name: "RoomProperty",
              title: "房间属性"
            },
            {
              name: "RoomType",
              title: "房间类型"
            },
            {
              name: "RoomNumber",
              title: "房间号码"
            }
          ]
        },
        {
          name: "5",
          title: "交易及费用配置",
          icon: "el-icon-location",
          children: [
            {
              name: "PayClass",
              title: "付款分类"
            },
            {
              name: "ConsumeType",
              title: "消费分类"
            },
            {
              name: "TransactionCode",
              title: "交易明细"
            },
            {
              name: "HouseDetail",
              title: "房税明细"
            },
            {
              name: "HouseStructure",
              title: "房税结构"
            },
            {
              name: "PriceClass",
              title: "房价分类"
            },
            {
              name: "PriceCode",
              title: "房价设置"
            }
          ]
        },
        {
          name: "6",
          title: "前台管理配置",
          icon: "el-icon-location",
          children: [
            {
              name: "reserveTypeConfig",
              title: "预定类型"
            },
            {
              name: "channelConfig",
              title: "渠道"
            },
            {
              name: "CauseOfLock",
              title: "锁定原因"
            },
            {
              name: "CauseOfMaintenance",
              title: "维修原因"
            },
            {
              name: "changeRoom",
              title: "换房原因"
            }
          ]
        },
        {
          name: "agreement",
          title: "协议单位管理",
          icon: "el-icon-location",
          children:[
            {
              name:"agreementUnit",
              title:"协议单位"
            },
          ]
        },
        {
          name: "systemConfigInfo",
          title: "系统信息配置",
          icon: "el-icon-location",
          children: [
            {
              name: "printerConfig",
              title: "打印机配置"
            },
            {
              name: "hotelConfig",
              title: "酒店配置"
            },
            {
              name: "roomRackConfig",
              title: "房态图配置"
            },
            {
              name:"PowerManage",
              title:"权限管理"
            }
          ]
        },
        // {
        //   name: "9",
        //   title: "财务配置",
        //   icon: "el-icon-setting"
        // },
        {
          name: "report",
          title: "报表",
          icon: "el-icon-location",
          children: [
            {
              name: "yingyeshiduanbao",
              title: "营业时段表"
            },
            {
              name: "xianjinliuliangmingxi",
              title: "现金流量明细"
            },
            {
              name: "ruzhufenxibiao",
              title: "入住分析表"
            },
            {
              name: "chongdiao",
              title: "冲调报表"
            },
            {
              name: "jiezhanghuizong",
              title: "结账汇总表"
            },
            {
              name: "ruzhudingdanmingxi",
              title: "入住订单明细"
            },
            {
              name: "ruzhudingdanhuizong",
              title: "入住订单汇总"
            },
            {
              name: "qiantaiyingyeribaobiao",
              title: "前台营业日报表"
            }
          ]
        }
      ]
    };
  },

  computed: {
    onRoutes() {
      let path = this.$route.path;
      let arr = path.split("/");
      return arr.pop();
    }
  },
  watch: {
    powerObject(newObject) {
      // debugger;
      //酒店预定管理
      //store.getters.isHasPower("powerObject", this);
      this.reloadPower();
    }
  },
  mounted() {
    this.menuCopy = JSON.parse(JSON.stringify(this.menuData));
    this.$store.getters.isHasPower("powerObject", this);
    this.reloadPower();
  },

  created() {
    this.setMode(false);
  },
  methods: {
    ...mapMutations({
      setMode: "SET_MODE"
    }),
    reloadPower() {
      this.menuData = JSON.parse(JSON.stringify(this.menuCopy));
      // debugger;
      if (!this.powerObject.hotelReservationManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "预定";
        });
      } else {
      }
      if (!this.powerObject.hotelCheckInManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "入住";
        });
      }
      if (!this.powerObject.hotelGuestManagePower) {
        this.menuData = _.chain(this.menuData)
          .filter(v => {
            return v.title !== "宾客列表";
          })
          .filter(v => {
            return v.title !== "团队列表";
          })
          .filter(v => {
            return v.title !== "客户管理";
          })
          .value();
      }
      if (!this.powerObject.hotelStatusManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "实时状态";
        });
      }
      if (!this.powerObject.hotelDealSettingManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "交易及费用配置";
        });
      }
      if (!this.powerObject.hotelReceptionManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "前台管理配置";
        });
      }
      if (!this.powerObject.hotelBargainingUnitManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "公司及协议单位";
        });
      }
      if (!this.powerObject.hotelSystemSettingManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "系统信息配置";
        });
      }
      if (!this.powerObject.hotelReportManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "报表";
        });
      }
      if (
        !this.powerObject.hotelRoomStatusManagePower &&
        !this.powerObject.hotelReservationManagePower &&
        !this.powerObject.hotelCheckInManagePower
      ) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "房态图";
        });
      }
      if (!this.powerObject.hotelRoomSettingManagePower) {
        this.menuData = this.menuData.filter(v => {
          return v.title !== "客房管理配置";
        });
      }
    }
  }
};
</script>
<style lang="stylus">
.el-table td, .el-table th {
  padding: 0 !important;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
  border-right: 1px solid #e6e6e6;

  .el-menu {
    border-right: none;
  }
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

.el-container .el-aside {
  background-color: #fff !important;
}

/* 页面flex弹性布局 上下结构 */
.flex-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 靠右布局 */
.flex-right {
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
}

/* 左右两端布局 */
.flex-between {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

/* 去除table表格里按钮的边框 */
table .el-button {
  border: none !important;
}
</style>
