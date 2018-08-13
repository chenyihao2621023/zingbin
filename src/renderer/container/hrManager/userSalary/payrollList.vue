<template>
  <div class="payrollList">
    <zing-head  :title="'工资管理'">
      <div slot="header-right">
          <span class="header-jiahao">
                  <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                      <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                          <i class="iconfont icon-gengduo"></i>
                      </a>
                  </dropdown>
          </span>
      </div>
    </zing-head>
    <div v-show="isShow" style="position: absolute;top: 50px;left:0px;width: 100%;">
      <search @on-change="getResultSearch" @on-submit="onSubmitSearch" position="absolute" auto-scroll-to-top top="0px" ref="search"></search>
    </div>
    <div class="scroll-list-wrap">
      <scroll ref="scroll" :scrollbar="true" :pullUpLoad="{
          threshold: 0,
          txt: {more: 'more', noMore: 'noMore'}
        }" :startY="0" @pullingUp="onPullingUp">
        <ul v-if="payrollData.length > 0">
          <li v-for="(data,index) in payrollData" :key="index">
            <GridCard @click.native="gotoGZD(data.rowId)">
              <div slot="cardLeft" class="left">
                <!--<avatar shape="square"></avatar>-->
                <div class="left-wrapper">
                  <p class="left-wrapper-title">{{data.pzId}}</p>
                  <div class="left-wrapper-desc">{{data.pzId}}</div>
                </div>
              </div>
            </GridCard>
          </li>
        </ul>
        <ul v-else>
          <div class="no-data-style">
            暂无工资记录
          </div>
        </ul>
      </scroll>
    </div>
  </div>

</template>

<script>
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import Tag from "@/components/tag/Tag";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import { Search } from "vux";

export default {
  name: "payrollManager",
  components: {
    GridCard,
    Avatar,
    Scroll,
    Tag,
    ZingHead,
    Search,
    Dropdown
  },
  data() {
    return {
      items: [],
      isShow: false,
      datas: [{ content: "工资变动记录", url: "/hrManager/salaryChangeList" }],
      payrollData: []
    };
  },
  created() {
    let companyId = this.$route.query.companyId;
    let cardUrl = this.$route.query.cardUrl;
    let url = "/zingbiz/resourceLibrary/salary/selectSalary";
    let params = {};
    if (typeof cardUrl === "string" && cardUrl.length > 0) {
      params.cardUrl = cardUrl;
    }
    this.$http
      .get(url, {
        params
      })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.payrollData = res.data.data;
        } else {
          this.$message({ type: "error", message: "加载失败，请重试" });
        }
      });
  },
  methods: {
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    },
    gotoGZD(data) {
      console.info(this.$route.query.cardUrl);
      //跳转工资单页面
      this.$router.push({
        path: "/hrManager/payroll",
        query: {
          pzRowId: data,
          companyId: this.$route.query.companyId,
          cardUrl: this.$route.query.cardUrl
        }
      });
    },
    onPullingUp() {
      // 更新数据
      console.log("pulling up and load data");
      setTimeout(() => {
        if (this._isDestroyed) {
          return;
        }
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.$refs.scroll.forceUpdate();
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate();
        }
      }, 1500);
    },
    //搜索中的方法
    showSearch() {
      this.isShow = !this.isShow;
      this.$refs.search.setFocus();
    },
    getResultSearch(val) {
      console.log("getResultSearch", val);
    },
    onSubmitSearch(val) {
      console.log("onSubmitSearch", val);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.payrollList {
  height: 100%;

  .scroll-list-wrap {
    position: relative;
    height: 100%;
    border-radius: 4px;
    transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
    overflow: hidden;

    .left {
      height: 50px;
      flex: 1;
      flex-center(row, start, center);

      &-wrapper {
        margin-left: 10px;
        flex: 1;

        &-title {
          font-size: $font-size-base + 2px;
          margin-bottom: 6px;
          cursor: pointer;
        }

        &-desc {
          width: 160px;
          color: #ddd;
          cursor: pointer;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    .right {
      flex: 1;
      text-align: right;

      .tag-wrapper {
        margin-top: 10px;

        &.tag+.tag {
          margin-left: 10px;
        }
      }
    }

    .classifi-left {
      &-name {
        margin-bottom: 10px;
      }

      &-tag-wrapper {
        &.tag+.tag {
          margin-left: 10px;
        }
      }
    }

    .classifi-right {
      align-self: flex-start;
    }

    .no-data-style {
      color: #ff8000;
      font-size: 18px;
      padding-top: 15px;
      min-height: 100px;
      text-align: center;
    }
  }
}
</style>