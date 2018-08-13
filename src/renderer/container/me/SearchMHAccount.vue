<template>
  <div class="globle-search">
    
    <search
      @result-click="resultClick"
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>

    <div class="search-content-list-item-wrapper" style="margin-top:50px">
          <div class="list-wrapper" v-for="item in results" :key="item" @click="cardDetail(item)">
            <GridCard>
              <div slot="cardLeft" class="left">
                <avatar :size="'large'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+item.cardUrl.substring(0,2)+"/"+item.cardUrl+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"'></avatar>
              </div>
              <div slot="cardRight" class="right">
                <div class="right-content">
                  <div class="right-content-title">{{item.RealName}}</div>
                  <div class="right-content-desc">
                    {{item.WorkTitle}}
                  </div>
                </div>
              </div>
            </GridCard>
          </div>

        </div> 
  </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import GridCard from "components/gridcard/GridCard";
import Avatar from "components/avatar/Avatar";
import { Search, Group, Cell, XButton } from "vux";

export default {
  components: {
    ZingHead,
    Scroll,
    Search,
    Group,
    Cell,
    XButton,
    GridCard,
    Avatar
  },
  methods: {
    setFocus() {
      this.$refs.search.setFocus();
    },
    resultClick(item) {
      window.alert("you click the result item: " + JSON.stringify(item));
    },

    onSubmit(value) {
      console.log(value);
      let url = this.$route.query.url;
      let searchKey = this.$route.query.searchKey;
      let param = { params: {} };
      param.params[searchKey] = value;
      debugger;
      this.$http
        .get(url, param)
        .then(res => {
          console.log(res);
          debugger;
          this.results = res.data;
        })
        .catch(err => {});
    },
    onFocus() {
      console.log("on focus");
    },
    onCancel() {
      console.log("on cancel");
    },
    cardDetail(item) {
      this.$router.push({
        path: "cardDetails",
        query: {
          cardUrl: item.cardUrl
        }
      });
    }
  },
  data() {
    return {
      results: [],
      value: ""
    };
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.fgloble-search {
  height: 100%;
  width: 100%;

  .triangle-down {
    triangle-down();
  }

  .vux-search-fixed {
    top: 0 !important;
  }

  .list-wrapper .scroll-content {
    width: 100%;
  }

  &-content {
    height: calc(100% - 50px);
    overflow: hidden;

    &-title-img {
      img {
        width: 100%;
        height: 130px; // 临时图片 以后删掉
      }
    }

    &-list-item-wrapper {
      .left {
        width: 50px;
        height: 50px;
        flex: none;
      }

      .right {
        text-align: start;
        padding-left: 20px;
        flex-center(row, space-between, center);
        overflow: hidden;

        &-content {
          width: 80%;

          &-title {
            margin-bottom: 14px;
          }

          &-desc {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #888;
          }
        }

        &-info {
          i {
            font-size: 24px;
            color: #0F89C5;
          }
        }
      }
    }
  }
}
</style>