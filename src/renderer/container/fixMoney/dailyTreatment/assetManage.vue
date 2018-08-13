<!-- 资产管理 -->
<template>
    <div style="height:100%">
        <ZingHead :title="title" :isComeBack="false" @doSome="doSome()">
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </ZingHead>
        <div>
            <div class="tab-manage" style="height:100%;">
                <tab class="tab-list">
                    <tab-item :selected="index === 0" v-for="(item, index) in tabList" :key="index" @on-item-click="onItemClick">{{item}}</tab-item>
                </tab>
                <swiper :show-dots="false" height="100px">
                    <swiper-item class="swiper-tab" v-show="index">
                        <div class="swiper-table" :style="{ height: screenHeight + 'px'}">
                            <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;" >
                                <thead>
                                    <tr>
                                        <th>入账/变动时间</th>
                                        <th>编码</th>
                                        <th>名称</th>
                                        <th>类别</th>
                                        <th width="12%"></th>
                                    </tr>
                                </thead>
                                <tbody style="overflow-x:hidden;overflow-y:auto">
                                    <tr v-for="(item,index) in checkData" :key="index">
                                        <td>{{item.postingDate}}</td>
                                        <td>{{item.assetsCoding}}</td>
                                        <td>{{item.assetsName}}</td>
                                        <td>{{item.assetsClassName}}</td>
                                        <td>
                                            <a style="width:40px;height: 40px; font-size:25px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </x-table>
                         </div>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="audited">
                        <div class="swiper-table" :style="{ height: screenHeight + 'px'}">
                            <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                                <thead>
                                    <tr>
                                        <th>入账/变动时间</th>
                                        <th>编码</th>
                                        <th>名称</th>
                                        <th>类别</th>
                                        <th width="12%"></th>
                                    </tr>
                                </thead>
                                <tbody class="tablescoll">
                                    <tr v-for="(item,index) in auditedData" :key="index">
                                        <td>{{item.postingDate}}</td>
                                        <td>{{item.assetsCoding}}</td>
                                        <td>{{item.assetsName}}</td>
                                        <td>{{item.assetsClassName}}</td>
                                        <td>
                                            <a style="width:40px;height: 40px; font-size:25px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </div>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="unaudited">
                        <div class="swiper-table" :style="{ height: screenHeight + 'px'}">
                            <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                                <thead>
                                    <tr>
                                        <th>入账/变动时间</th>
                                        <th>编码</th>
                                        <th>名称</th>
                                        <th>类别</th>
                                        <th width="12%"></th>
                                    </tr>
                                </thead>
                                <tbody style="overflow-x:hidden;overflow-y:auto">
                                    <tr v-for="(item,index) in unauditedData" :key="index">
                                        <td>{{item.postingDate}}</td>
                                        <td>{{item.assetsCoding}}</td>
                                        <td>{{item.assetsName}}</td>
                                        <td>{{item.assetsClassName}}</td>
                                        <td>
                                            <a style="width:40px;height: 40px; font-size:25px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </div>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="unsubmitted">
                         <div class="swiper-table" :style="{ height: screenHeight + 'px'}">
                                <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                                    <thead>
                                        <tr>
                                            <th>入账/变动时间</th>
                                            <th>编码</th>
                                            <th>名称</th>
                                            <th>类别</th>
                                            <th width="12%"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in unsubmittedData" :key="index">
                                            <td>{{item.postingDate}}</td>
                                            <td>{{item.assetsCoding}}</td>
                                            <td>{{item.assetsName}}</td>
                                            <td>{{item.assetsClassName}}</td>
                                            <td>
                                                <a style="width:40px;height: 40px; font-size:25px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </x-table>
                         </div>
                    </swiper-item>
                    <swiper-item class="swiper-tab" v-show="dismissed">
                         <div class="swiper-table" :style="{ height: screenHeight + 'px'}">
                                <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                                    <thead>
                                        <tr>
                                            <th>入账/变动时间</th>
                                            <th>编码</th>
                                            <th>名称</th>
                                            <th>类别</th>
                                            <th width="12%"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in dismissedData" :key="index">
                                            <td>{{item.postingDate}}</td>
                                            <td>{{item.assetsCoding}}</td>
                                            <td>{{item.assetsName}}</td>
                                            <td>{{item.assetsClassName}}</td>
                                            <td>
                                                <a style="width:40px;height: 40px; font-size:25px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </x-table>
                         </div>
                    </swiper-item>
                </swiper>
            </div>
            <actionsheet v-model="showSheet" :menus="menuData" theme="android" @on-click-menu="clickMenuItem">
            </actionsheet>
        </div>
        <!-- <popup-change-record :showPopup="changeRecord" @backClick="backClick" @cancle="cancle"></popup-change-record> -->
        <searchAssetManage :searchShowPopup="searchPopup" @submitBasicInfo="searchAsset"></searchAssetManage>
    </div>
</template>
<script>
import { XTable, Actionsheet, Tab, TabItem } from "vux";
import Dropdown from "@/components/dropdown/Dropdown";
import ZingHead from "@/components/zingHead/ZingHead.vue";
// import PopupChangeRecord from "./selectorPopup/popupChangeRecord.vue";
import searchAssetManage from "./searchAssetManage";
export default {
  components: {
    XTable,
    ZingHead,
    Dropdown,
    Actionsheet,
    // PopupChangeRecord,
    Tab,
    TabItem,
    searchAssetManage
  },
  data() {
    return {
      title: "固定资产管理",
      changeRecord: false,
      showSheet: false,
      datas: [
        {
          content: "新建"
        }
      ],
      tempData: [],
      checkData: [],
      auditedData: [],
      unauditedData: [],
      unsubmittedData: [],
      dismissedData: [],
      menuData: [],
      menuItem: {},
      tabList: ["已结账", "已审核", "未审核", "未提交", "被驳回"],
      index: true,
      audited: false,
      unaudited: false,
      unsubmitted: false,
      dismissed: false,
      searchPopup: false,
      tabIndex: 0,
      screenHeight:0,
      companyId:"",
      type:"YJZ"
    };
  },
  created() {
    this.companyId = this.$route.query.companyId
    this.screenHeight = document.documentElement.clientHeight - 100;
    this.menuData = [];
    this.$http
      .post("/zingbiz/fixedAssets/assetsManagement/select", { status: "YJZ" })
      .then(res => {
        if (res.data.success) {
          this.checkData = res.data.data;
        }
      });
    this.menuData.push({ label: "查看", value: "watch" });
    this.menuData.push({ label: "变动", value: "change" });
    this.menuData.push({ label: "变动记录", value: "changeRecord" });
    this.menuData.push({ label: "清理", value: "remove" });
    this.menuData.push({ label: "清理情况", value: "removeRecord" });
  },
  methods: {
    // 搜索资产类别数据
    searchAsset(param) {
      let params = "";
      let url = "/zingbiz/fixedAssets/assetsManagement/select";
      if (this.tabIndex === 0) {
        params = Object.assign(param, { status: "YJZ" });
        this.$http.post(url, params).then(res => {
          if (res.data.success) {
            this.checkData = res.data.data;
            this.index = true;
            this.audited = false;
            this.unaudited = false;
            this.unsubmitted = false;
            this.dismissed = false;
          }
        });
      } else if (this.tabIndex === 1) {
        params = Object.assign(param, { status: "YSH" });
        this.$http.post(url, params).then(res => {
          if (res.data.success) {
            this.auditedData = res.data.data;
            this.index = false;
            this.audited = true;
            this.unaudited = false;
            this.unsubmitted = false;
            this.dismissed = false;
          }
        });
      } else if (this.tabIndex === 2) {
        params = Object.assign(param, { status: "DSH" });
        this.$http.post(url, params).then(res => {
          if (res.data.success) {
            this.unauditedData = res.data.data;
            this.index = false;
            this.audited = false;
            this.unaudited = true;
            this.unsubmitted = false;
            this.dismissed = false;
          }
        });
      } else if (this.tabIndex === 3) {
        params = Object.assign(param, { status: "WTJ" });
        this.$http.post(url, params).then(res => {
          if (res.data.success) {
            this.unsubmittedData = res.data.data;
            this.index = false;
            this.audited = false;
            this.unaudited = false;
            this.unsubmitted = true;
            this.dismissed = false;
          }
        });
      } else {
        params = Object.assign(param, { status: "FQ" });
        this.$http.post(url, params).then(res => {
          if (res.data.success) {
            this.dismissedData = res.data.data;
            this.index = false;
            this.audited = false;
            this.unaudited = false;
            this.unsubmitted = false;
            this.dismissed = true;
          }
        });
      }
      this.searchPopup = false;
      //   let url = "/zingbiz/fixedAssets/assetsManagement/select";
      //   vm.$http.post(url, param).then(res => {
      //     if (res.data.success) {
      //       vm.checkData = res.data.data;
      //       vm.searchPopup = false;
      //     }
      //   });
    },
    //查询资产管理数据
    getAssetInitData(statusTemp) {
      let url = "/zingbiz/fixedAssets/assetsManagement/select";
      let param = {
        status: statusTemp
      };
      return this.$http.post(url, param);
    },
    //Tab切换事件
    onItemClick(index) {
      this.tabIndex = index;
      if (index === 1) {
        this.menuData = [];
        this.audited = true;
        this.index = false;
        this.unaudited = false;
        this.unsubmitted = false;
        this.dismissed = false;
        this.type = "YSH"
        this.getAssetInitData("YSH").then(res => {
          if (res.data.success) {
            this.auditedData = res.data.data;
          }
        });
        this.menuData.push({ label: "查看", value: "watch" });
        this.menuData.push({ label: "变动", value: "change" });
        this.menuData.push({ label: "变动记录", value: "changeRecord" });
        this.menuData.push({ label: "清理", value: "remove" });
        this.menuData.push({ label: "清理情况", value: "removeRecord" });
      } else if (index === 2) {
        this.menuData = [];
        this.type = "DSH"
        this.audited = false;
        this.index = false;
        this.unsubmitted = false;
        this.dismissed = false;
        this.unaudited = true;
        this.getAssetInitData("DSH").then(res => {
          if (res.data.success) {
            this.unauditedData = res.data.data;
          }
        });
        this.menuData.push({ label: "查看", value: "watch" });
      } else if (index === 3) {
        this.menuData = [];
        this.type = "WTJ"
        this.index = false;
        this.unsubmitted = true;
        this.audited = false;
        this.unaudited = false;
        this.dismissed = false;
        this.getAssetInitData("WTJ").then(res => {
          if (res.data.success) {
            this.unsubmittedData = res.data.data;
          }
        });
        this.menuData.push({ label: "查看", value: "watch" });
        this.menuData.push({ label: "编辑", value: "update" });
        this.menuData.push({ label: "删除", value: "delete" });
      } else if (index === 4) {
        this.type = "FQ"
        this.menuData = [];
        this.index = false;
        this.unsubmitted = false;
        this.audited = false;
        this.unaudited = false;
        this.dismissed = true;
        this.getAssetInitData("FQ").then(res => {
          if (res.data.success) {
            this.dismissedData = res.data.data;
          }
        });
        this.menuData.push({ label: "查看", value: "watch" });
        this.menuData.push({ label: "编辑", value: "update" });
        this.menuData.push({ label: "删除", value: "delete" });
      } else if (index === 0) {
        this.type = "YJZ"
        this.menuData = [];
        this.index = true;
        this.unsubmitted = false;
        this.audited = false;
        this.unaudited = false;
        this.dismissed = false;
        this.getAssetInitData("YJZ").then(res => {
          if (res.data.success) {
            this.checkData = res.data.data;
          }
        });
        this.menuData.push({ label: "查看", value: "watch" });
        this.menuData.push({ label: "变动", value: "change" });
        this.menuData.push({ label: "变动记录", value: "changeRecord" });
        this.menuData.push({ label: "清理", value: "remove" });
        this.menuData.push({ label: "清理情况", value: "removeRecord" });
      }
    },
    //header 返回事件
    doSome() {
      this.$router.go(-1);
    },
    //新增固定资产
    handleMenu() {
      this.$router.push({
        path: "seeAssetManage",
        query: {
          flag: "add",
          companyId: this.companyId
        }
      });
    },
    //查询数据
    search() {
      this.searchPopup = true;
    },
    // 右侧三个点点击事件
    selItem(item) {
      this.showSheet = true;
      this.menuItem = item;
    },
    //页面跳转
    clickMenuItem(item) {
      let labelNode = "";
      if (item === "watch") {
        labelNode = "watch";
      } else if (item === "update") {
        labelNode = "update";
      } else if (item === "change") {
        labelNode = "change";
      }
      if (item === "watch" || item === "update" || item === "change") {
        this.$router.push({
          path: "seeAssetManage",
          query: {
            type:this.type ,
            flag: labelNode,
            originId: this.menuItem.id,
            companyId: this.companyId
          }
        });
      } else if (item === "changeRecord") {
        this.$router.push({
          path: "changeRecord",
          query: {
            type:this.type,
            id: this.menuItem.id
          }
        });
      } else if (item === "remove") {
        this.$router.push({
          path: "assetClean",
          query: {
            flag: "add",
            originId: this.menuItem.id,
            type: this.menuItem.type,
            item: {
              assetsName: this.menuItem.assetsName,
              originId: this.menuItem.originId,
              count: this.menuItem.count
            }
          }
        });
      } else if (item === "removeRecord") {
        this.$router.push({
          path: "assetClean",
          query: {
            type:this.type,
            flag: "update",
            originId: this.menuItem.id,
            item: {
              assetsName: this.menuItem.assetsName
            }
          }
        });
      } else {
        let that = this
        that.$vux.confirm.show({
          title: "提示",
          content: "确定删除？",
          // 组件除show外的属性
          onConfirm() {
            that.deleteAsset(that.menuItem.id);
          }
        });
      }
    },
    // 删除资产管理
    deleteAsset(itemId) {
      let vm = this;
      let url = "/zingbiz/fixedAssets/assetsManagement/deleteById/" + itemId;
      vm.$http.get(url).then(res => {
        if (res.data.success) {
        //   window.location.reload();
          if (vm.tabIndex === 3) {
                setTimeout(function() {
                    vm.getAssetInitData("WTJ").then(res => {
                        if (res.data.success) {
                            vm.index = false;
                            vm.unsubmitted = true;
                            vm.audited = false;
                            vm.unaudited = false;
                            vm.dismissed = false;
                            vm.unsubmittedData = [...res.data.data];
                         }
                    })
                }, 2000);
          } else if (vm.tabIndex === 4) {
              setTimeout(function() {
                    vm.getAssetInitData("FQ").then(res => {
                        if (res.data.success) {
                            vm.index = false;
                            vm.unsubmitted = false;
                            vm.audited = false;
                            vm.unaudited = false;
                            vm.dismissed = true;
                            vm.dismissedData = [...res.data.data];
                            }
                    })
                }, 2000);
          }
          vm.$vux.toast.text(res.data.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.scrollable .vux-tab-item {
  flex: 0 0 20%;
}
.swiper-tab{
    height: 100%;
}
.swiper-table{
    overflow-x:hidden;
    overflow-y:auto
}
 .scrollable{
  overflow-x:hidden;
  overflow-y:auto
}
</style>





