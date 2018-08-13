<template>
  <div style="height: 100%;">
    <ZingHead :title="title">
    </ZingHead>
    <div class="scroll-list-wrap" :style="{ height: screenHeight  + 'px',overflow:'auto' }">
      <scroll ref="scroll" :data="workflowData" :scrollbar="true" :startY="0" :pullUpLoad="{threshold: 0, txt: {more: 'more', noMore: 'noMore'}}" @pullingDown="onPullingDown" @pullingUp="onPullingUp">
        <GridCard v-for="(item,index) in workflowData" :key="index">
          <div slot="cardLeft" class="left" @click="chooseAuth(item)">
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{index + 1}}:{{item.roleInfoName}}</p>
              <div class="left-wrapper-title">{{item.roleInfoDesc}}</div>
            </div>
          </div>
          <div slot="cardRight" class="right" @click="chooseAuth(item)">
            <cell value="设置模板" is-link></cell>
          </div>
        </GridCard>
      </scroll>
    </div>
    <!-- <popupAuthorized :showPopupDate="certifShow" :roleCode="roleCode" :certificateTitle="certifiTitle" :commonList="certifiData"
     @submitClick="submitCertif" @cancleClick="cancleCertif " @change="SelectClick"></popupAuthorized> -->
  </div>

</template>

<script>
import { Cell, Popup } from "vux";
import Scroll from "../../components/scroll/Scroll";
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
// import popupAuthorized from "@/container/workflow/workflowAuthorized/popupAuthorized";
export default {
  components: {
    Cell,
    Popup,
    ZingHead,
    GridCard,
    Scroll
    // popupAuthorized
  },
  data() {
    return {
      title: "模板授权",
      getData: [],
      screenHeight: 0,
      curItem: {},
      workflowData: [
        // {
        //   roleCode: 62471963100001,
        //   roleInfoDesc: "管理员",
        //   roleInfoName: "管理员"
        // },
        // {
        //   roleCode: 59915713000000102,
        //   roleInfoDesc: "业务专家",
        //   roleInfoName: "业务专家"
        // },
        // {
        //   roleCode: 59915713000000103,
        //   roleInfoDesc: "客服",
        //   roleInfoName: "客服"
        // },
        // {
        //   roleCode: 59915713000000104,
        //   roleInfoDesc: "员工",
        //   roleInfoName: "员工"
        // }
      ]
    };
  },
  created() {
    let vm = this;
    vm.getAllAuthoridData();
    this.screenHeight = document.documentElement.clientHeight - 100;
  },
  methods: {
    onPullingDown() {
      // 模拟更新数据
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
      }, 2000);
    },
    onPullingUp() {
      // 更新数据
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
    chooseAuth(item) {
      let vm = this;
      vm.certifShow = true;
      vm.curItem = item;
      this.$router.push({
        path: "popupAuthorized",
        query: {
          roleCode: item.roleInfoId
        }
      });
      // vm.getcategoryRole(item.roleCode);
    },
    // 查询角色的模板
    getAllAuthoridData() {
      let vm = this;
      let url = "/zingbiz/auth/org/getOrgRoleUser";
      let params = {};
      vm.$http.post(url, params).then(res => {
        console.info(res.data.data);
        if ((res.data.data.success = true)) {
          vm.workflowData = res.data.data.roleDatas;
          // vm.workflowData.forEach(function(item) {
          //   vm.certifiData.push({
          //     key: item.roleInfoId,
          //     value: item.roleInfoName
          //   });
          // });
          // console.info(vm.certifiData);
        } else {
          vm.$vux.toast.text("没有模板数据",'top');
        }
      });
    }
  }
};
</script>

<style lang="stylus">
</style>
