<template>
  <div class="test-pages">
    <zing-head :title="title"></zing-head>
    <div class="test-pages-content">
      <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
        <grid-item v-for="(item, index) in childData[childItem].data" :key="index" :label="item.name">
          <avatar :size="'normal'" slot="icon" :icon="item.icon" @click.native="gotoPage(item.link)" shape="square" :style="{background: item.color}"></avatar>
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
import { Grid, GridItem } from "vux";
import Avatar from "components/avatar/Avatar";
import ZingHead from "components/zingHead/ZingHead.vue";

export default {
  name: "WorkbenchChildThree",
  components: {
    Grid,
    GridItem,
    Avatar,
    ZingHead
  },
  data() {
    return {
      childItem: "isnull",
      title: "",
      companyId: "",
      childData: {
        isnull: [],
        workflowSetting: {
          title: "审批设置",
          data: [
            {
              name: "模板管理",
              link: "/workflow/typeAndTemplate",
              icon: "bianji1",
              color: "#F59324"
            }
//            ,
//            {
//              name: "模板管理",
//              link: "/workflow/workflowIndex",
//              icon: "bianji1",
//              color: "#F59324"
//            },
//            {
//              name: "模板授权",
//              link: "/workflow/workflowAuthorized",
//              icon: "shenpi1",
//              color: "#F59324"
//            }
          ]
        }
      }
    };
  },
  created() {
    let citem = this.$route.query.childItem;
    this.childItem = this.childData[citem] ? citem : "isnull";
    this.title = this.childData[citem].title;
    this.companyId = this.$route.query.companyId;
  },
  methods: {
    gotoPage(val) {
      let url = val;
      if (typeof this.companyId !== "undefined" && this.companyId !== "") {
        if (val.indexOf("?") < 0) {
          url += "?";
        } else {
          url += "&";
        }
        url += "companyId=" + this.companyId;
      }
      this.$router.push({ path: url });
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

.test-pages {
  height: 100%;

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
