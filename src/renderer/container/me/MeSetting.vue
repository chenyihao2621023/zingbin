<template>
  <div  >
     <zing-head  >
       
       
    </zing-head>
     <group>
      <cell title="账号与安全" link="/account" ></cell>
      <cell title="新消息通知" is-link  @click.native="feature" ></cell>
      <cell title="勿扰模式" @click.native="feature" ></cell>
      <cell title="通用" @click.native="feature" ></cell>
      <cell title="关于英商" value="版本号:1.0 " ></cell>
    </group>
 
  </div>
</template>

<script>
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "components/scroll/Scroll";
import Avatar from "components/avatar/Avatar";
import { mapState, mapMutations } from "vuex";
import { createChat } from "../../utils/fn";
import {
  Search,
  Grid,
  GridItem,
  GroupTitle,
  XDialog,
  AlertModule,
  Confirm,
  Group,
  Cell,
  CellBox,
  CellFormPreview,
  TransferDomDirective as TransferDom
} from "vux";
export default {
  name: "ME",
  directives: {
    TransferDom
  },
  components: {
    AlertModule,
    ZingHead,
    Scroll,
    Avatar,
    Search,
    Grid,
    GridItem,
    GroupTitle,
    XDialog,
    Confirm,
    Group,
    Cell,
    CellBox,
    CellFormPreview
  },
  data() {
    return {};
  },
  methods: {
    feature() {
      this.$vux.alert.show({
        title: "提示",
        content: "维护中..."
      });
    }
  },
  computed: {
    cardUrl() {
      return this.$store.state.ui.userInfo.cardUrl;
    },
    realName() {
      return this.$store.state.ui.userInfo.RealName;
    }
  },
  created() {}
};
</script>
 
 <style scoped>
body {
  background-color: #f5f5f5;
}
</style>
 