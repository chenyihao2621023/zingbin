<template>
  <div style="height:100%;">
    <div class="articlePage">
      <div class="head">
        <zing-head title="文章详情">
          <span slot="header-right" class="head-jiahao">
              <!--<i class="iconfont icon-gengduo"></i>-->
          </span>
        </zing-head>
      </div>
      <div class="detail">
        <div class="title">{{articleData.title}}</div>
        <div class="time">
          <span>{{articleData.dataTime}}</span>
          <span>{{articleData.author}}</span>
        </div>
        <div class="content" v-html="articleData.textContent">
          {{articleData.textContent}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";

  export default {
    name: "article",
    components: {
      ZingHead,
    },
    data() {
      return {
        detailsId: "",
        articleData: {},
      }
    },
    created() {
      this.detailsId = this.$route.query.detailsId;
      this.companyId = this.$route.query.companyId;
      this.initData();
    },
    methods: {
      initData() {
        let vm = this;
        vm.$http
          .get("/zingbiz/tuwen/tuwenManage/getMenuDetailsById", {
            params: {
              detailsId: this.detailsId,
              companyId: this.companyId
            }
          })
          .then(res => {
            if (res.data.success) {
              vm.articleData = res.data.data;
            } else {
              vm.$vux.toast.text("数据获取失败");
            }
          }).catch(error => {
          console.log(error);
        })
      }
    }
  }
</script>
<style>
  .articlePage .content img {
    width: 100% !important;
  }
</style>
<style lang="stylus" scoped>
  @import "../../assets/stylus/mixin.styl";
  .articlePage, .detail {
    flex-column(column);
    width :100%;
  }
  .detail {
    height: 100%;
    width :100%;
    overflow: auto;
    padding: 10px;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .title, .time {
      padding: 5px 0;
    }
  }

  .icon-gengduo {
    margin-right: 14px;
    font-size: 20px;
  }
</style>
