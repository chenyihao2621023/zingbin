<template>
  <div class="goodsList">
    <ZingHead title="物品列表">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu" ref="dropDownRef">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </ZingHead>
    <div v-show="isShow">
      <search class="search" @on-cancel="onCancel" @on-change="getResult" @on-submit="onSubmit" ref="search"></search>
    </div>
    <div v-if="allGoods&&allGoods.length!=0">
      <GridCard v-for="(item,index) in allGoods" :key="index">
        <div slot="cardLeft" class="left" @click="itemClick(item)">
          <avatar :src="item.productImgs.split(' ')[0]"></avatar>
          <div class="left-wrapper">
              <p class="left-wrapper-title">物品名称：{{ item.productName }} </p>
              <div class="left-wrapper-desc">持有人：{{ item.holderUser.split("-")[1] }} </div>
          </div>
        </div>
      </GridCard>
    </div>
    <div v-if="isShowTip" class="prompt">暂无物品</div>

    <!--三个点的菜单-->
  </div>
</template>
<script>
import GridCard from "../../../components/gridcard/GridCard.vue";
import Avatar from "../../../components/avatar/Avatar.vue";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import { Search } from "vux";

export default {
  components: {
    Dropdown,
    ZingHead,
    Search,
    GridCard,
    Avatar
  },
  props: {
    showAddGoods: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isComeBack: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  data() {
    return {
      showDialog: false,
      allGoods: [],
      rowId: "",
      isShow: false,
      isShowTip: false
    };
  },
  computed: {
    datas() {
      let companyId = this.$route.query.companyId;
      let ckId = this.$route.query.ckId;
      let url =
        "/resourceLibrary/goodsCabinet/goodsAddOrUpdate?pageStatus=A&companyId=" +
        companyId +
        "&ckId=" +
        ckId;
      return [
        {
          content: "新建物品",
          url
        }
      ];
    }
  },
  created() {
    this.loadGoods();
  },
  mounted() {},
  methods: {
    itemClick(val) {
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/goods",
        query: {
          rowId: val.rowId,
          type: "WP"
        }
      });
    },
    loadGoods() {
      let _this = this;
      let params = {
        productType: "WPG",
        pageSize: 10,
        ckId: this.$route.query.ckId,
        pageNumber: 0
      };
      let url = "/zingbiz/resourceLibrary/product/getProduct";

      this.$http
        .get(url, { params: params })
        .then(res => {
          this.allGoods = res.data.data;
          if (this.allGoods.length === 0) {
            this.isShowTip = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showSearch() {
      this.isShow = !this.isShow;
      // this.$refs.search.setFocus();
    },
    onCancel() {
      this.isShow = false;
    },
    getResult(val) {
      console.log(val);
    },
    onSubmit(val) {
      console.log(val);
    },
    handleMenu(data) {
      if (data.url) this.$router.push(data.url);
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.goodsList {
  .search {
    position: relative !important;
  }

  .iconfont {
    font-size: 30px;
  }

  .prompt {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #ff8000;
  }
}
</style>