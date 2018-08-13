<template>
  <div>
    <ZingHead :title="title">
      <div slot="header-right">
        <span class="header-jiahao">
          <i class="iconfont icon-gengduo" @click="handleMenu"></i>
        </span>
      </div>
    </ZingHead>
    <div class="scroll-list-wrap" style="overflow-y:scroll;height: 450px;">
      <GridCard v-for="(item,index) in skillGroupData" :key="index">
        <div slot="cardLeft" class="left">
          <div class="left-wrapper">
            <p class="left-wrapper-title">名称:{{item.skName}}</p>
            <div class="left-wrapper-title">类别：{{item.skType}}</div>
            <div class="left-wrapper-title">标识：{{item.skId}}</div>
          </div>
        </div>
        <div slot="cardRight" class="right">
          <a class="iconfont icon-gengduo" @click="selItem(item)"></a>
        </div>
      </GridCard>
    </div>
    <actionsheet v-model="showDialog" :menus="menuNodes" theme="android" @on-click-menu="click">
    </actionsheet>
    <skillGroupEdit :modelTitle="modelTitle" :showPopupDate="isShow" :getSkillData="getSkillData" @backClick="clickBack" @submitClick="submit" @cancleclick="cancle"></skillGroupEdit>
    <confirm v-model="showConfirm" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm">
      <p style="text-align:center;">是否确认执行此操作？</p>
    </confirm>
  </div>
</template>
<script>
import {
  Confirm,
  Actionsheet,
  Group,
  XButton,
  Flexbox,
  FlexboxItem,
  XInput,
  Selector
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
import skillGroupEdit from "@/container/customerService/skillGroupEdit";
export default {
  components: {
    GridCard,
    skillGroupEdit,
    ZingHead,
    Confirm,
    XInput,
    Selector,
    Flexbox,
    FlexboxItem,
    Actionsheet,
    Group,
    XButton
  },
  data() {
    return {
      getSkillData: {},
      isShow: false,
      modelTitle: "",
      showDialog: false, //三个点标识
      title: "技能组管理",
      temp:'',
      showToast: false, // 属性修改窗口
      showConfirm: false, // 禁止分类窗口
      curItem: {},
      menuNodes: [
        {
          label: "修改",
          value: "update"
        },
         {
          label: "删除",
          value: "delete"
        },
        {
          label: "禁用",
          value: "forbid"
        }
      ],
      skillGroupData: [
        // {
        //   skId:"zxyx",
        //   skName:"咨询一下",
        //   skType:"DEFAULT"
        // },
        // {
        //   skId:"qqbz",
        //   skName:"请求帮助",
        //   skType:"DEFAULT"
        // }
      ]
    }
  },
  created() {
    let vm = this;
    vm.getDatas();
  },
  methods: {
    // 获取技能组数据
    getDatas() {
      let vm = this;
      let url = "/zingbiz/skillGroupInfo/skillGroupInfoRest/loadAllSkillGroupInfo";
      let params = {
        pageSize: 20,
        pageNumber: 1
      };
      this.$http.post(url, params).then(res => {
        console.log(res.data);
        if (res.data.data.total > 0) {
          vm.skillGroupData = res.data.data.data;
        } else {
          vm.$vux.toast.text("没有搜索到结果");
        }
      });
    },
    getAddData() {
      let vm = this;
      let url = "";
      let params = {};
      console.info(vm.getSkillData);
      if (vm.getSkillData.type === "add") {
        url = "/zingbiz/skillGroupInfo/skillGroupInfoRest/addOneSkillGroupInfo";
      } else {
        url = "/zingbiz/skillGroupInfo/skillGroupInfoRest/updateOneSkillGroupInfo";
      }
      if (vm.getSkillData.skName === undefined) {
        vm.$vux.toast.text("请输入技能组标识");
        return;
      }
      if (vm.getSkillData.skId === undefined) {
        vm.$vux.toast.text("请输入技能组名称");
        return;
      }
      if (vm.getSkillData.skType === undefined) {
        vm.$vux.toast.text("请选择技能组类别");
        return;
      }
      params = {
        skName: vm.getSkillData.skName,
        skId: vm.getSkillData.skId,
        skType: vm.getSkillData.skType,
        mustSkill: vm.getSkillData.mustSkill
      };
      let rowId = vm.curItem.rowId
        ? { rowId: vm.curItem.rowId }
        : {};
      params = Object.assign({}, params, rowId,);
      vm.$http.post(url, params).then(res => {
        console.info(res.data)
        if (res.data.success === "true") {
          vm.$vux.toast.text(res.data.mgs);
          this.isShow = false
          location.reload()
        } else {
          vm.$vux.toast.text(res.data.mgs);
        }
      });
    },
    submit() {
      this.getAddData();
    },
    cancle() {
      this.isShow = false;
    },
    clickBack() {
      this.isShow = false;
    },
    onCancel() {
      console.log("on cancel");
    },
    onConfirm() {
      let vm = this;
      let url = "";
      if(vm.temp === 'delete'){
        url = '/zingbiz/skillGroupInfo/skillGroupInfoRest/delOneSkillGroupInfo'
      } else{
        url = '/zingbiz/skillGroupInfo/skillGroupInfoRest/disableOrEnableOneSkillGroupInfo'
      }
      let params = {
        rowId:vm.curItem.rowId,
        skId: vm.curItem.skId
      }
      let mustSkill = vm.curItem.mustSkill
        ? { mustSkill: vm.curItem.mustSkill }
        : {};
      params = Object.assign({}, params, mustSkill);
      console.info(params);
      vm.$http.post(url, params).then(res => {
        console.info(res.data);
        if (res.data.data.success === false) {
          vm.$vux.toast.text(res.data.data.mgs);
        } else {
          vm.$vux.toast.text(res.data.data.mgs);
        }
      });
    },
    handleMenu(data) {
      //下拉菜单
      this.modelTitle = "添加技能组数据";
      this.isShow = true;
      this.getSkillData.type = "add";
    },
    click(key, item) {
      let vm = this;
      console.info(item)
      if(vm.curItem.mustSkill==='1'){
        if (key === "update") {
          vm.$vux.toast.text('默认技能组，不可修改!')
        } if(key === "delete"){
           vm.$vux.toast.text('默认技能组，不可删除!')
        } else {
           vm.$vux.toast.text('默认技能组，不可禁用!')
        }
      } else{
          if (key === "update") {
            vm.isShow = true;
            vm.modelTitle = "修改技能组";
            vm.getSkillData = vm.curItem;
            vm.getSkillData.type = "update";
            vm.getSkillData.skType = vm.curItem.skType;
          } if(key === "delete"){
            vm.showConfirm = true;
            vm.temp = "delete";
          } else if(key === "forbid"){
            vm.temp = "forbid";
            vm.showConfirm = true;
          }
      }
    },
    selItem(item) {
      //显示三个点弹框
      let vm = this;
      this.showDialog = true;
      vm.curItem = item;
       if (item.skillStatus === "启用") {
        vm.menuNodes[2].label = "禁用";
      } else {
        vm.menuNodes[2].label = "启用";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.modal-header {
  background-color: #f0ad4e;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
}
.dialog-demo {
  /deep/ .modal-body {
    position: relative;
    padding: 5px;
    height: 320px;
  }
}
</style>
