<template>
    <div>
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <ZingHead :title="'存放地点'" :isComeBack="false" @doSome="backClick">
                    </ZingHead>
                    <scroll :observeDOM="true" class="list-warp">
                        <tree :data="menu" :deleteItem="deleteItem" @checkIcon="checkIcon" :searchType="searchType"></tree>
                    </scroll>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
import { Popup } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
export default {
  components: {
    Popup,
    Scroll,
    Tree,
    ZingHead
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      searchType: false,
      deleteItem: false,
      menu: []
    };
  },
  watch: {
    showPopup: {
      handler(item) {
        if (item) {
          this.deleteItem = true;
        } else {
          this.deleteItem = false;
        }
      },
      deep: true
    }
  },
  created() {
    this.getPlacestorage();
  },
  methods: {
    checkIcon(item) {
      //将数据保存
      this.$emit("checkItem", item);
    },
    backClick() {
      this.$emit("backClick");
    },
    //获取存放地点
    getPlacestorage() {
      this.$http
        .get(
          "/zingbiz/fixedAssets/configuration/getAllStorePlaceConfiguration",
          {}
        )
        .then(res => {
          this.menu = res.data.data;
        });
    }
  }
};
</script>

