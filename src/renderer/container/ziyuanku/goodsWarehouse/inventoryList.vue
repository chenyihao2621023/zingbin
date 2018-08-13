<template>
  <div class="outerMost">
    <ZingHead :title="title">
      <div slot="header-right">
        <span class="header-search" @click="search">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </ZingHead>

    <!-- <div v-show="searchFlag" class="haha">
      <search position="relative" ref="search" class="search" @on-cancel="onCancel" @on-blur="onBlur" v-model="searchData">
      </search>
    </div> -->
    <search
      ref="search"
      class="searchStyle"
      :searchFlag="searchFlag"
      @cancelInput ="onCancel"
      @confirmInput="onBlur"
    ></search>
    <div class="scroll-list-wrap">
      <Scroll ref="scroll">
        <GridCard v-for="(item,index) in list" :key="index" @click.native="jumpSwitch(item)">
          <div slot="cardLeft" class="pdleft">
            <div class="status">
              <span class="pdId">{{item.genTime}}</span>
            </div>
            <div class="ckName">物品库：{{item.ckName}}</div>
          </div>
          <div slot="cardRight" class="right">
            <span class="cardUserName">{{item.cardUserName}}</span>
            <div>
              <tag class="pdStatus" type="green">{{item.pdStatus === "save" ? "未提交" : "已完成"}}</tag>
            </div>
          </div>
        </GridCard>
      </Scroll>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import GridCard from "../../../components/gridcard/GridCard";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import Scroll from "@/components/scroll/Scroll";
import Tag from "@/components/tag/Tag";
import search from "@/components/search/search";
export default {
  components: {
    GridCard,
    ZingHead,
    search,
    Dropdown,
    Scroll,
    Tag
  },
  data() {
    return {
      title: "盘点列表",
      searchFlag: false,
      searchData: "",
      datas: [
        {
          content: "新建盘点",
          url: "/resourceLibrary/goodsWarehouse/inventoryAddOrUpdate"
        }
      ],
      list: []
    };
  },
  created() {
    let that = this;
    //页面初始化
    that.$http
      .get("/zingbiz/resourceLibrary/inventory/selectInventory", {})
      .then(function(response) {
        that.list = response.data.data;
      });
  },
  methods: {
    onCancel: function() {
      this.searchFlag = false;
    },
    search: function() {
      this.searchFlag = !this.searchFlag;
      if (this.searchFlag) {
        this.$refs.search.setFocus();
      }
    },
    jumpSwitch(item) {
      if (item.pdStatus === "save") {
        //携带参数用于界面发送请求
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/inventoryAddOrUpdate",
          query: { pdId: item.rowId, companyId: this.$route.query.companyId }
        });
      } else {
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/inventoryDetail",
          query: { pdId: item.rowId, companyId: this.$route.query.companyId }
        });
      }
    },
    onBlur(value) {
      let that = this;
      that.$http
        .post("/zingbiz/pingzheng/Inventory/getInventoryDetailByCkId", {
          ckId: this.$route.query.ckId,
          keyWords: value,
          pageNumber: 1,
          pageSize: 10
        })
        .then(function(response) {
          console.log(response);
          // that.list = response.data.data.data
        });
    },
    //点击新增盘点
    handleMenu(data) {
      this.$router.push({
        path: data.url,
        query: {
          companyId: this.$route.query.companyId
        }
      });
    }
  }
};
</script>
<style>
.search {
  position: relative !important;
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/unify.styl';

$background-color = #F5F5F5;

center() {
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.weui-cells {
  margin-top: 0 !important;
}

.main-header {
  position: relative;
  padding: 0 10px;
  background-color: $background-color;
  width: 100%;

  .inventory-list {
    center();
  }

  .header-icon {
    float: right;

    .ios-search {
      center();
      right: 15%;
    }
  }

  .add {
    position: absolute;
    right: 0;
    bottom: -40px;
    padding: 10px 20px;
    background-color: $background-color;
    border: 1px solid #DFDFDF;
    z-index: 99;

    &:after {
      display: block;
      content: '';
      position: absolute;
      top: -10px;
      right: 20px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #DFDFDF;
    }
  }
}

.clearfix {
  &:after {
    content: '';
    display: block;
    clear: both;
  }
}

.primary, .empty {
  margin-top: 10px;
  width: 80%;
}

.outerMost {
  height: calc(100% - 53px);
}

.scroll-list-wrap {
  position: relative;
  height: 100%;
  border-radius: 4px;
  transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
  overflow: hidden;

  .pdleft {
    height: 50px;
  }

  .status, .ckName {
    margin-bottom: 10px;
  }

  .right {
    .pdStatus {
      margin-top: 15px;
    }
  }
}
</style>