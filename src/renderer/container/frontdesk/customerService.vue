<template>
  <div class="customer-service">
    <zing-head :title="headTitle"></zing-head>
    <div class="customer-service-content">
      <div class="customer-service-content-title-img">
        <img src="../../assets/img/myChat1.jpg" alt="">
      </div>
      <grid :show-lr-borders="false" class="customer-service-content-kefu" :show-vertical-dividers="false">
        <grid-item @click.native="onlineService">
          <span slot="icon" class="iconfont icon-icon--"></span>
          <span slot="label">在线客服</span>
        </grid-item>
        <grid-item @click.native="showPhoneNum">
          <span slot="icon" class="iconfont icon-dianhua"></span>
          <span slot="label">电话客服</span>
        </grid-item>
      </grid>
      <div class="customer-service-content-list">
        <div class="title vux-1px-b">更多服务</div>
        <div class="customer-service-content-list-item-wrapper">
          <GridCard>
            <div slot="cardLeft" class="left" @click="toWorkOrder" style="width: 80%;">
              <div class="left-img-wrapper">
                <i class="iconfont icon-daishenhe" style="font-size: 35px;color: #333"></i>
              </div>
              <div class="left-content">
                <div class="left-info">
                  需求反馈工单
                </div>
              </div>
            </div>
            <div slot="cardRight" class="right" @click="toWorkFlowAdd">
              <div class="right-content-icon">
                <i class="iconfont icon-order-add"></i>
              </div>
              <div class="right-content-desc">新建</div>
            </div>
          </GridCard>
          <GridCard>
            <div slot="cardLeft" class="left" @click="toWorkflowJoin" style="width:100%">
              <div class="left-img-wrapper">
                <i class="iconfont icon-daishenhe" style="font-size: 35px;color: #333"></i>
              </div>
              <div class="left-content">
                <div class="left-info">
                  我参与商号内的审批流
                </div>
              </div>
            </div>
          </GridCard>
          <GridCard>
            <div slot="cardLeft" class="left" style="width:100%">
              <div class="left-img-wrapper">
                <i class="iconfont icon-chakan" style="font-size: 35px;color: #333"></i>
              </div>
              <div class="left-content">
                <div class="left-info">
                  任务（查看任务消息）
                </div>
              </div>
            </div>
          </GridCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import GridCard from "components/gridcard/GridCard";
import { Grid, GridItem, Group } from "vux";
export default {
  name: "customerService",
  components: {
    ZingHead,
    Grid,
    GridItem,
    GridCard,
    Group
  },
  props: {},
  data() {
    return {
      headTitle: "我的客服",
      phoneDatas: []
    };
  },
  methods: {
    toWorkOrder() {
      this.$router.push({
        path: "/workflow/workOrder",
        query: {
          companyId: this.$route.query.companyId
        }
      });
    },
    toWorkFlowAdd() {
      this.$router.push({
        path: "/workflow/workflowMain",
        query: {
          companyId: this.$route.query.companyId,
          wfType: "KH"
        }
      });
    },
    toWorkflowJoin() {
      this.$router.push({
        path: "/workflow/workflowJoinService",
        query: {
          companyId: this.$route.query.companyId
        }
      });
    },
    loadPhoneInfo() {
      let url =
        "/ZingMH/ZDesk/MENHUWX/MHPhoneInfo/getPhoneInfoByCompanyId.action";
      this.$http
        .get(url, {
          params: {
            companyId: this.$route.query.companyId
          }
        })
        .then(res => {
          //this.listData = res.data.data.data;
          this.phoneDatas = res.data.data;
        });
    },
    onlineService() {
      this.$vux.alert.show({
        title: "提示",
        content: "维护中，尽请期待！",
        onShow() {},
        onHide() {}
      });
    },
    showPhoneNum() {
      let content = "";
      if (typeof this.phoneDatas && this.phoneDatas.length > 0) {
        this.phoneDatas.forEach(item => {
          content +=
            "<div>客服电话：<a href='tel:" +
            item.phoneNumber +
            "'>" +
            item.phoneNumber +
            "</a></div>";
        });
      } else {
        content = "<div>暂时没有客服电话，给您带来的不便敬请谅解</div>";
      }
      this.$vux.alert.show({
        title: "电话客服",
        content,
        onShow() {},
        onHide() {}
      });
    }
  },
  created() {
    this.loadPhoneInfo();
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.customer-service {
  height: 100%;
  overflow: auto;

  &-content {
    &-title-img {
      img {
        width: 100%;
        height: 160px; // 临时图片 以后删掉
      }
    }

    &-kefu {
      .iconfont {
        font-size: 30px;
        color: #6cb6ff;
      }
    }

    &-list {
      height: calc(100% - 130px);
      overflow: auto;
      background: #fbf9fe;

      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        color: #888;
      }

      &-item-wrapper {
        background: #ffffff;

        .left {
          height: 70px;
          text-align: start;
          flex-center(row, space-between, center);
          flex: none;

          &-img-wrapper {
            flex: none;

            .iconfont {
              font-size: 40px;
            }
          }

          &-content {
            padding-left: 10px;
            width: calc(100% - 50px);

            &-info {
              line-height: 60px;
            }
          }
        }

        .right {
          height: 70px;
          padding-top: 15px;
          color: #fea853;

          &-content-icon {
            .iconfont {
              font-size: 30px;
            }
          }

          &-content-desc {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
