<template>
  <div class="goodsList">
    <ZingHead title="物品列表" :isComeBack="isComeBack" ref="zingHeadRef" @doSome="doSome">
      <div slot="header-right">
        <span class="header-search" @click="showSearch">
          <i class="iconfont icon-fangdajing"></i>
        </span>
        <span v-if="isShowAddGoods" class="header-jiahao">
          <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu" ref="dropDownRef">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
              <i class="iconfont icon-gengduo"></i>
            </a>
          </dropdown>
        </span>
      </div>
    </ZingHead>
    <search class="searchStyle" :searchFlag="isShow" @cancelInput="onCancel" @confirmInput="onSubmit"></search>
    <div v-if="allGoods&&allGoods.length!=0" class="content">
      <GridCard v-for="(item,index) in allGoods" :key="index">
        <div slot="cardLeft" class="left" @click="itemClick(item)">
          <avatar :src="getImageUrl(item.productImg ? item.productImg:item.productImgs,'./static/images/userDef_.jpg')"></avatar>
          <div class="left-wrapper">
            <p class="left-wrapper-title">{{item.productName}}</p>
            <div class="left-wrapper-desc">库存数量：{{isNull(item.productCount)? 0 : item.productCount}}</div>
          </div>
        </div>
      </GridCard>
    </div>
    <div v-else class="prompt">暂无物品</div>
    <!--三个点的菜单-->
  </div>
</template>
<script>
import GridCard from "../../../components/gridcard/GridCard.vue";
import Avatar from "../../../components/avatar/Avatar.vue";
import Scroll from "@/components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import search from "@/components/search/search";
import { getImageUrl } from "@/utils/fn";

export default {
  name: "GoodsList2",
  components: {
    Dropdown,
    ZingHead,
    search,
    GridCard,
    Avatar,
    Scroll
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
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
      datas: [
        {
          content: "新建物品",
          url: "/resourceLibrary/goodsWarehouse/goodsAddOrUpdate?pageStatus=A"
        }
      ],
      showDialog: false,
      allGoods: [],
      rowId: "",
      isShow: false
    };
  },
  computed: {
    isShowAddGoods() {
      if (this.isReferenced) {
        return this.showAddGoods;
      } else {
        let showAddGoods = this.$route.query.showAddGoods;
        if (showAddGoods && "false" === showAddGoods) {
          return false;
        } else {
          return true;
        }
      }
    }
  },
  created() {
    if (!this.isReferenced) {
      this.loadGoods();
    }
  },
  mounted() {
    if (this.isReferenced) {
      this.$emit("loadGoods");
    }
  },
  methods: {
    getImageUrl,
    resetDropdownPosition() {
      this.$refs.dropDownRef.setPosition();
    },
    itemClick(val) {
      if (!this.isReferenced) {
        this.$router.push({
          path: "/resourceLibrary/goodsWarehouse/goodsDetail",
          query: {
            rowId: val.rowId,
            companyId: this.$route.query.companyId
          }
        });
      } else {
        this.$emit("goodsItemClick", val);
      }
    },
    loadGoods(productIds, fn) {
      let params = {
        productType: "WP",
        pageSize: 10,
        pageNumber: 0,
        productIds
      };

      let url = "/zingbiz/resourceLibrary/product/getProduct";

      this.$http
        .get(url, { params: params })
        .then(res => {
          this.allGoods = res.data.data;
          if (typeof fn === "function") {
            fn(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setAllGoods(goods) {
      this.allGoods = goods;
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
      if (this.isReferenced) {
        this.$emit("addGoods", this.allGoods);
      } else {
        if (data.url)
          this.$router.push(
            data.url + "&companyId=" + this.$route.query.companyId
          );
      }
    },
    doSome() {
      if (!this.isComeBack) {
        this.$emit("doSome");
      }
    },
    isNull(val) {
      return (
        typeof val === "undefined" || val === null || val.trim().length === 0
      );
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.goodsList {
  height: 100%;

  .search {
    position: relative !important;
  }

  .content {
    height: calc(100% - 50px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
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