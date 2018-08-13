
<template>
  <div class="test-pages">
    <zing-head :isComeBack="false">
      <div slot="header-left">
        <dropdown :data="datas" trigger="click" placement="bottomLeft" @item-click="handleMenu">
          <div>
            <span>英立讯科技</span>
            <i class="triangle-down"></i>
          </div>
        </dropdown>
      </div>
      <div slot="header-right">
        <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span>
      </div>
    </zing-head>
    <div class="test-pages-content">
      <!--<scroll :observeDOM="true">-->
      <div v-show="showSearch">
        <search position="absolute" auto-scroll-to-top top="46px"></search>
      </div>
      <div class="title">
        <div>通用应用</div>
        <div class="pc-login" @click="pcLogin">电脑登录</div>
      </div>
      <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
        <grid-item v-if="companyId !== ''" v-for="(item, index) in menuData" :key="index" :label="item.name">
          <avatar :size="'normal'" @click.native="gotoChildPage(item.link)" slot="icon" :icon="item.icon" shape="square" :style="{background: item.color}"></avatar>
        </grid-item>
      </grid>
      <div class="title">
        <div>专业应用</div>
      </div>
      <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
        <grid-item v-for="(item, index) in menuData2" :key="index" :label="item.name">
          <avatar :size="'normal'" slot="icon" @click.native="gotoChildPage(item.link)" :icon="item.icon" shape="square" :style="{background: item.color}"></avatar>
        </grid-item>
        <grid-item label="添加">
          <avatar :size="'normal'" slot="icon" :icon="'jiahao1'" shape="square"></avatar>
        </grid-item>
      </grid>
        <!-- for test -->
        <div class="title">
            <div>测试入口</div>
        </div>
        <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item :label="'测试入口'">
                <avatar :size="'normal'" slot="icon" @click.native="gotoChildPage('/demo/testpages')" :icon="'shenpi1'" shape="square" :style="{background: 'F59324'}"></avatar>
            </grid-item>
        </grid>
        <!-- for test -->
      <!--</scroll>-->
    </div>
  </div>
</template>

<script>
import { Grid, GridItem, Search } from "vux";
import Avatar from "components/avatar/Avatar";
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import Dropdown from "components/dropdown/Dropdown";

export default {
  name: "zingMainPage",
  components: {
    Grid,
    GridItem,
    Search,
    Avatar,
    ZingHead,
    Scroll,
    Dropdown
  },
  data() {
    return {
      companyId: "",
      datas: [
        { content: "私有分类" },
        {
          content: "父级",
          children: [
            {
              content: "子级"
            }
          ]
        }
      ],
      showSearch: false,
      menuData2: [
        {
          name: "点菜管理",
          link: "/zingMainChild?childItem=dinner",
          icon: "bianji1",
          color: "#40AFFC",
          role: ["admin", "editor"]
        },
        {
          name: "订房管理",
          link: "/hotel/roomState",
          icon: "shenpi1",
          color: "#F59324",
          role: ["admin", "editor"]
        }
      ]
    };
  },
  created() {
    this.loadUserMsg();
  },
  computed: {
    menuData() {
      return [
        {
          name: "任务管理",
          link: "/taskManage",
          icon: "bianji1",
          color: "#40AFFC",
          role: ["admin", "editor"]
        },
        {
          name: "审批",
          link: "/workflow/workflowMain",
          icon: "shenpi1",
          color: "#F59324",
          role: ["admin", "editor"]
        },
        {
          name: "人力资源",
          link: "/zingMainChild?childItem=resources",
          icon: "shenpi1",
          color: "#985DAE",
          role: ["admin", "editor"]
        },
        {
          name: "签到签退",
          link: "/attendanceHome/attendanceCardList",
          icon: "shenpi1",
          color: "#985DAE",
          role: ["admin", "editor"]
        },
        {
          name: "项目管理",
          link: "/projectManage",
          icon: "02",
          color: "18C34D",
          role: ["admin", "editor"]
        },
        {
          name: "商城管理",
          link: "/zingMainChild?childItem=shop",
          icon: "shenpi1",
          color: "#D91E06",
          role: ["admin", "editor"]
        },
        {
          name: "知识库",
          icon: "zhishicangku",
          link: "/knowledgebase?companyId=" + this.companyId,
          color: "#40AFFC",
          role: ["admin", "editor"]
        },
        {
          name: "工作日历",
          icon: "shenpi1",
          link: "/hrManager/workCalendar",
          color: "#F78D11",
          role: ["admin", "editor"]
        },
        {
          name: "公告",
          icon: "shenpi1",
          link: "",
          color: "#EB3C44",
          role: ["admin", "editor"]
        },
        {
          name: "生产核算",
          icon: "shenpi1",
          link: "",
          color: "#0FBE1C",
          role: ["admin", "editor"]
        },
        {
          name: "报表",
          link: "/zingMainChild?childItem=reportForms",
          icon: "baobiao-selected",
          color: "#E7BB35",
          role: ["admin", "editor"]
        },
        {
          name: "后台管理",
          link: "/zingMainChild?childItem=management",
          icon: "shenpi1",
          color: "#D71600",
          role: ["admin", "editor"]
        },
        {
          name: "财务库",
          icon: "caiwu",
          link: "/ziyuanku",
          color: "#F5EB2B",
          role: ["admin", "editor"]
        },
        {
          name: "物品库",
          link:
            "/zingMainChild?childItem=goodsWarehouse&companyId=" +
            this.companyId,
          icon: "shenpi1",
          color: "#9659AE",
          role: ["admin", "editor"]
        },
        {
          name: "进销存",
          link: "",
          icon: "shenpi1",
          color: "#40B1FD",
          role: ["admin", "editor"]
        },
        {
          name: "物品柜",
          link: "/ziyuanku",
          icon: "shenpi1",
          color: "23C32F",
          role: ["admin", "editor"]
        }
      ];
    }
  },
  methods: {
    loadUserMsg() {
      let url = "/zingbiz/auth/user/getThisUserInfo";
      let that = this;
      this.$http
        .post(url, {})
        .then(res => {
          that.companyId = res.data.data.companyId;
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.showSearch = !this.showSearch;
    },
    gotoChildPage(val) {
      this.$router.push({ path: val });
    },
    pcLogin() {},
    handleMenu() {}
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

.test-pages {
    height: 100%;
    width:100%;

    .triangle-down {
        display: inline-block;
        border-right: 2px solid;
        border-bottom: 2px solid;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        vertical-align: middle;
    }

    .test-pages-content {
        height: calc(100% - 50px);
        overflow: hidden;

        .title {
            flex-center(row, space-between, center);
            padding: 10px 20px;

            .pc-login {
                color: #0094FF;
            }
        }

        .iconfont {
            font-size: 22px;
        }
    }

    .weui-grid {
        .weui-grid__icon {
            flex-center(row, center, center);
            width: auto;
            height: auto;
        }
    }

    .weui-grid:before {
        border: none;
    }

    .weui-grid:after {
        border: none;
    }

    .vux-search-fixed {
        top: 0 !important;
    }
}
</style>
