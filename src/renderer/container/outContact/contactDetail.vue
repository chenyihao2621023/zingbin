<!--外联人详情页面-->
<template>
    <div class="outwrapper">
        <ZingHead title="客户详情">
            <div slot="header-right">
                <span class="header-more" @click="MoreClick">
                    更多
                </span>
            </div>
        </ZingHead>
        <div class="scroll-list-wrap" style="overflow-y:scroll;">
            <group label-width="5em" label-margin-right="2em" label-align="left">
                <div class="basic-title">
                    <Avatar shape="circle" :src="imgfile" style="left:25%"></Avatar>
                    <div>
                        <span>{{basicInfo.Name}} ({{basicInfo.bindUser}})</span>
                        <i class="star-five" v-show="isFoucs"></i>
                    </div>

                </div>
                <grid :show-lr-borders="false" :show-vertical-dividers="false">
                    <grid-item @click.native="linkToPeople">
                        <Avatar shape="circle" class="imgicon" icon="iconfont icon-tongxunlu"></Avatar>
                        <span class="img-font">联系人</span>
                    </grid-item>
                    <grid-item @click.native="linkRecord">
                        <Avatar shape="circle" class="imgicon" icon="iconfont icon-xiewrite18"></Avatar>
                        <span class="img-font">拜访记录</span>
                    </grid-item>
                </grid>
            </group>
            <group label-width="6em" label-margin-right="2em" :title="companyName" class="basicInfor basicInforTitle">
                <GridCard @click.native="lookBussin">
                    <div slot="cardLeft" class="left">
                        <avatar shape="circle" class="imgicon" icon="iconfont icon-wangfandijia"></avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">业务来往</p>
                            <div class="left-wrapper-info" id="bussinessInfo">{{message}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <div class="label-edit">
                            <span>查看</span>
                            <i class="iconfont icon-youjiantou"></i>
                        </div>
                    </div>
                </GridCard>
                <GridCard @click.native="lookTask">
                    <div slot="cardLeft" class="left">
                        <avatar shape="circle" class="imgicon" icon="iconfont icon-wangfandijia"></avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">客服工单</p>
                            <div class="left-wrapper-info">客服工单：{{taskTotal}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <div class="label-edit">
                            <span>查看</span>
                            <i class="iconfont icon-youjiantou"></i>
                        </div>
                    </div>
                </GridCard>

            </group>

            <div :date="basicInfo">
                <group label-width="6em" label-margin-right="2em" class="basicInfor">
                    <div class="label" @click="labelType()">
                        <div class="lable-wapper">
                            <div class="label-title">标签</div>
                            <div class="label-content">
                                <!--<span class="label-content-no" v-show="no">点击查看标签</span>-->
                                <span class="label-content-type" v-show="type">{{basicInfo.typeText}}</span>
                                <span class="label-content-level" v-show="level">{{basicInfo.levelText}}</span>
                                <span class="label-content-state" v-show="state">{{basicInfo.stateText}}</span>
                            </div>
                        </div>
                        <div class="label-edit">
                            <span>编辑</span>
                            <i class="iconfont icon-youjiantou"></i>
                        </div>
                    </div>
                    <x-input title="姓名" v-model="basicInfo.contactsName" class="name" readonly></x-input>
                    <x-input title="手机号" v-model="basicInfo.telPhone" readonly></x-input>
                    <cell :value="basicInfo.type"><span slot="title">类型</span></cell>
                </group>
                <group label-width="6em" label-margin-right="2em" title="权限" :date="basicInfo" class="basicInforLimit">
                    <div class="limit" @click="showMark()">
                        <div class="limit-responsible">
                            <span>负责人:{{basicInfo.responsiblePersonName}}</span>
                        </div>
                        <div class="limit-share">
                            <span>共享人:</span>
                            <span>{{basicInfo.sharedScopeName}}</span>
                        </div>
                        <div class="label-edit">
                            <span>编辑</span>
                            <i class="iconfont icon-youjiantou"></i>
                        </div>
                    </div>
                    <!--<x-input title="负责人" v-model="basicInfo.responsiblePersonName" placeholder="替换负责人"-->
                    <!--@click.native="updateChargepeople()"></x-input>-->
                    <!--<x-textarea title="共享人" v-model="basicInfo.sharedScopeName" placeholder="编辑共享同事" @click.native="updateSharePeople()" :show-counter="false" :rows="1" autosize></x-textarea>-->
                </group>
                <group label-width="6em" label-margin-right="2em" title="个人信息" class="basicInfor changeTitle">
                    <cell :value="basicInfo.gender"><span slot="title">性别</span></cell>
                    <cell :value="basicInfo.idCardType"><span slot="title">证件类型</span></cell>
                    <cell :value="basicInfo.idCard"><span slot="title">证件号码</span></cell>
                    <cell :value="basicInfo.birthday"><span slot="title">生日</span></cell>
                    <cell :value="basicInfo.landLine"><span slot="title">电话</span></cell>
                    <cell :value="basicInfo.faxNo"><span slot="title">邮箱</span></cell>
                    <cell :value="basicInfo.email"><span slot="title">微信</span></cell>
                    <cell :value="basicInfo.qq"><span slot="title">QQ</span></cell>
                    <!--<x-input title="性别" v-model="basicInfo.gender" readonly></x-input>-->
                    <!--<x-input title="证件类型" v-model="basicInfo.idCardType" readonly></x-input>-->
                    <!--<x-input title="证件号码" v-model="basicInfo.idCard" readonly></x-input>-->
                    <!--<x-input title="生日" v-model="basicInfo.birthday" readonly></x-input>-->
                    <!--<x-input title="电话" v-model="basicInfo.landLine" readonly></x-input>-->
                    <!--<x-input title="传真" v-model="basicInfo.faxNo" readonly></x-input>-->
                    <!--<x-input title="邮箱" readonly v-model="basicInfo.email"></x-input>-->
                    <!--<x-input title="微信" readonly v-model="basicInfo.weChat"></x-input>-->
                    <!--<x-input title="QQ" readonly v-model="basicInfo.qq"></x-input>-->
                </group>
                <group label-width="6em" label-margin-right="2em" title="其他信息" class="basicInfor changeTitle">
                    <cell :value="basicInfo.nationality"><span slot="title">国籍</span></cell>
                    <cell :value="basicInfo.hometown"><span slot="title">籍贯</span></cell>
                    <cell :value="basicInfo.nation"><span slot="title">民族</span></cell>
                    <cell :value="basicInfo.companyName"><span slot="title">公司</span></cell>
                    <cell :value="basicInfo.workTitle"><span slot="title">职位</span></cell>
                    <cell :value="basicInfo.address"><span slot="title">联系地址</span></cell>
                    <cell :value="basicInfo.hobby"><span slot="title">爱好</span></cell>
                    <cell :value="basicInfo.plateNumber"><span slot="title">车牌</span></cell>
                    <cell :value="basicInfo.remark" class="basicInfo-lastchild"><span slot="title">备注</span></cell>
                    <!--<x-input title="籍贯" readonly v-model="basicInfo.hometown"></x-input>-->
                    <!--<x-input title="民族" readonly v-model="basicInfo.nation"></x-input>-->
                    <!--<x-input title="公司" readonly v-model="basicInfo.companyName"></x-input>-->
                    <!--<x-input title="职位" readonly v-model="basicInfo.workTitle"></x-input>-->
                    <!--<x-input title="联系地址" readonly v-model="basicInfo.address"></x-input>-->
                    <!--<x-input title="爱好" readonly v-model="basicInfo.hobby"></x-input>-->
                    <!--<x-input title="车牌" readonly v-model="basicInfo.plateNumber"></x-input>-->
                    <!--<x-input title="备注" readonly v-model="basicInfo.remark" class="basicInfo-lastchild"></x-input>-->
                </group>
            </div>
        </div>
        <!-- 选人组件 -->
        <org-member-picker :title="title" :showTab="['colleague']" :initialSelectedType="'cardUrl'" :initialSelected="initialSelected" :showPicker="showPersonPicker" :multiple="true" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
        <labelType :popup="popup" @cancle="cancle" @confirm="combackData">
        </labelType>
        <tasklist
            :showPopupDate="showPopTask"
            :getTaskData="getTaskData"
            @backClick="backClick"
        ></tasklist>

        <popup position="top" v-model="editFlag" :popup-style="{top: 40 + '%',width:80 + '%',margin: 30 + 'px','overflow-y': 'auto'}" class="mark">
            <div class="mark-replace" @click="updateChargepeople()">替换负责人</div>
            <div class="mark-edit" @click="updateSharePeople()">编辑共享同事</div>
        </popup>
    </div>
</template>
<script>
import {
  Group,
  Cell,
  Grid,
  GridItem,
  XInput,
  Datetime,
  Selector,
  XTextarea,
  Popup
} from "vux";
import labelType from "./template/labelType";
import tasklist from "./template/taskList";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import ZingHead from "@/components/zingHead/ZingHead";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import { doOneChat, Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    OrgMemberPicker,
    tasklist,
    ZingHead,
    Group,
    Cell,
    labelType,
    Datetime,
    Selector,
    Grid,
    XInput,
    Avatar,
    GridCard,
    GridItem,
    XTextarea,
    Popup
  },
  data() {
    return {
      imgfile: require("../../../../static/images/userDef_.jpg"),
      label: "",
      basicInfo: {},
      no: true,
      type: false,
      level: false,
      state: false,
      title: "",
      popup: false,
      isFoucs: false,
      defaultMain: true,
      initialSelected: [],
      showPersonPicker: false,
      getTaskData: [],
      queryData: "",
      setAuthroid: "",
      taskTotal: 0, //参与任务数目
      message: "",
      showPopTask: false,
      cardUrl: "",
      editFlag: false,
      styles: 50,
      companyID: "",
      companyName: "客户"
    }
  },
  created() {
    let vm = this;
    vm.queryData = vm.$route.query;
    vm.getContactData();
    vm.getTaskList();
    vm.businessContacts();
    vm.getCompanyId();
    vm.companyInfo();
  },
  methods: {
    //根据contactId获取外联人详情
    getContactData() {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById";
      let paramContact = {
        contactsId: vm.queryData.externalContactsId
      };
      vm.$http.post(url, paramContact).then(result => {
          console.log(result.data)
        if (result.data.success === true) {
          this.no = false;
          let getDatas = result.data.data;
          vm.basicInfo = getDatas;
          vm.cardUrl = getDatas.contactsCardUrl;
          if (getDatas.responsiblePerson === "wholeCompany") {
            vm.basicInfo.responsiblePersonName = "全员";
          }
          if (getDatas.gender === "1") {
            vm.basicInfo.gender = "男";
          } else if (getDatas.gender === "2") {
            vm.basicInfo.gender = "女";
          }
          if (!Z_IsEmpty20(getDatas.bindUser)) {
            vm.basicInfo.bindUser = "已绑定";
          } else {
            vm.basicInfo.bindUser = "未绑定";
          }
          if (!Z_IsEmpty20(getDatas.remarkAlias)) {
            vm.basicInfo.Name = getDatas.remarkAlias;
          } else {
            vm.basicInfo.Name = getDatas.contactsName;
          }
          if (getDatas.specialFocus === "0") {
            vm.isFoucs = true;
          } else {
            vm.isFoucs = false;
          }
          if (
            getDatas.contactsLevel !== "" ||
            getDatas.contactsState !== "" ||
            getDatas.contactsType !== ""
          ) {
            vm.no = false;
            vm.basicInfo.typeText = getDatas.contactsType;
            vm.basicInfo.levelText = getDatas.contactsLevel;
            vm.basicInfo.stateText = getDatas.contactsState;
            if (!Z_IsEmpty20(vm.basicInfo.typeText)) {
              vm.type = true;
            }
            if (!Z_IsEmpty20(vm.basicInfo.levelText)) {
              vm.level = true;
            }
            if (!Z_IsEmpty20(vm.basicInfo.stateText)) {
              vm.state = true;
            }
          } else {
            vm.no = true;
          }
        }
      });
    },
    //参与的任务
    getTaskList() {
        this.$http.get("/zingbiz/hotel/hotelWorkSheet/selSheet",{
            params:{
                companyId:this.$route.query.companyId,
                customerId:this.$route.query.externalContactsId,
                pageNumber:1,
                pageSize:20
            }
        }).then((res) => {
            this.taskTotal = res.data.total
        })
    },
    //业务数据
    businessContacts() {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsVisitRecordRest/businessContacts";
      // "/zingbiz/ExternalContacts/ExternalContactsActivityRest/getBusinessActivities";
      let paramBussiness = {
        externalContactsId: this.queryData.externalContactsId
      };
      vm.$http.post(url, paramBussiness).then(result => {
        var ect = 0;
        if (result.data.success === true) {
          ect = result.data.data.ecTotal;
          let ecd = result.data.data.ecDay;
          let ecvrTotal = result.data.data.ecvrTotal;
          if (ecd < 1) {
            if (ecvrTotal) {
              vm.message = ect + "条记录，今天已跟进";
            } else {
              vm.message = ect + "条记录，尚未开始跟进";
            }
          } else if (ecd >= 1) {
            vm.message = ect + "条记录，" + ecd + "天未跟进";
          }
        }
      });
    },
    //根据contactsId获取外联人的 companyId
    getCompanyId() {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/getExByExternalContactsId";
      let paramBussiness = {
        contactsId: this.queryData.externalContactsId
      };
      vm.$http.post(url, paramBussiness).then(result => {
        vm.companyID = result.data.data;
      });
    },
    //加载用户当前商号信息
    companyInfo() {
      let vm = this;
      let url = "/zingbiz/auth/user/loadUserCurrentCompanyInfo";
      let paramBussiness = {
        companyId: vm.companyID
      };
      vm.$http.post(url, paramBussiness).then(result => {
        vm.companyName = "客户（" + result.data.data.companyName + ")";
      });
    },
    //点击更多
    MoreClick() {
      this.$router.push({
        path: "moreInfo",
        query: {
          externalContactsId: this.$route.query.externalContactsId,
          companyId: this.$route.query.companyId,
          specialFocus: this.isFoucs
        }
      });
    },
    //业务查看
    lookBussin() {
      this.$router.push({
        path: "businessView",
        query: {
          externalContactsId: this.$route.query.externalContactsId,
          companyId: this.$route.query.companyId
        }
      });
    },
    // 查看参与任务
    lookTask() {
      this.showPopTask = true;
    },
    //关闭参与任务
    backClick() {
      this.showPopTask = false;
    },
    //查看标签类型
    labelType() {
      this.popup = true;
      this.defaultMain = false;
    },
    //标签页返回的数据
    combackData(param) {
      let vm = this;
      vm.level = false;
      vm.state = false;
      vm.type = false;
      if (
        param.contactsLevel !== "" ||
        param.contactsState !== "" ||
        param.contactsType !== ""
      ) {
        vm.no = false;
        vm.basicInfo.typeText = param.contactsType;
        vm.basicInfo.levelText = param.contactsLevel;
        vm.basicInfo.stateText = param.contactsState;
        if (vm.basicInfo.typeText !== "") {
          vm.type = true;
        }
        if (vm.basicInfo.levelText !== "") {
          vm.level = true;
        }
        if (vm.basicInfo.stateText !== "") {
          vm.state = true;
        }
      } else {
        vm.no = true;
      }
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts";
      let params = {
        contactsId: vm.queryData.externalContactsId,
        contactsType: vm.basicInfo.typeText,
        contactsLevel: vm.basicInfo.levelText,
        contactsState: vm.basicInfo.stateText
      };
      vm.$http.post(url, params).then(result => {
        if (result.data.success === true) {
          vm.$vux.toast.text(result.data.mgs);
          this.getContactData();
        } else {
          vm.$vux.toast.text(result.data.mgs);
        }
      });
    },
    //联系人
    linkToPeople() {
      let vm = this;
      if (!Z_IsEmpty20(vm.cardUrl)) {
        doOneChat(vm.cardUrl, true, vm.$router).catch(err => {
          console.error(err);
        });
      } else {
        vm.$vux.toast.show({
            type:"text",
            text:"暂无联系人请点击‘更多’进行设置",
            width:"240px"
        });
      }
    },
    //随访记录
    linkRecord() {
      this.$router.push({
        path: "visitRecord",
        query: {
          externalContactsId: this.queryData.externalContactsId,
          companyId: this.queryData.companyId,
          contactsName: this.basicInfo.contactsName,
          type: "add"
        }
      });
    },
    //点击参与的任务跳至详情页
    // toNextTask() {
    //   this.$router.push({
    //     path: "#",
    //     query: {}
    //   });
    // },
    //替换负责人
    updateChargepeople() {
      this.editFlag = false;
      this.showPersonPicker = true;
      this.setAuthroid = "update";
      this.title = "负责人";
      this.initialSelected = [];
        if (this.basicInfo.sharedScope !== "wholeCompany") {
            let responsibleArr = this.basicInfo.responsiblePerson.split(",");
            responsibleArr.forEach(item => {
                this.initialSelected.push({
                    value: item,
                    type: "user"
                });
            });
        }

    },
    //编辑负责人、修改共享人接口方法
    changePeople(changeParams, responsibleCardUrl, shareCardUrl) {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts";
      let temp = "";
      let tempUrl = "";
      //   let idCard = "";
      let params = {
        contactsId: vm.queryData.externalContactsId,
        contactsType: vm.basicInfo.typeText,
        contactsLevel: vm.basicInfo.levelText,
        contactsState: vm.basicInfo.stateText
      };
      if (changeParams === "update") {
        temp = vm.basicInfo.responsiblePersonName
          ? { responsiblePersonName: vm.basicInfo.responsiblePersonName }
          : {};
        tempUrl = responsibleCardUrl
          ? { responsiblePerson: responsibleCardUrl }
          : {};
      } else {
        temp = vm.basicInfo.sharedScopeName
          ? { sharedScopeName: vm.basicInfo.sharedScopeName }
          : {};
        tempUrl = shareCardUrl ? { sharedScope: shareCardUrl } : {};
      }
      //   if(vm.basicInfo.typeText === '酒店客户'){
      //        idCard = vm.basicInfo.idCard
      //       ? { idCard: vm.basicInfo.idCard }
      //       : {};
      //   }
      params = Object.assign({}, params, temp, tempUrl);
      vm.$http.post(url, params).then(result => {
        if (result.data.success === true) {
          vm.$vux.toast.text(result.data.mgs);
          this.getContactData();
        } else {
          vm.$vux.toast.text(result.data.mgs);
        }
      });
    },
    //编辑共享同事
    updateSharePeople() {
      this.editFlag = false;
      this.showPersonPicker = true;
      this.setAuthroid = "share";
      this.title = "共享范围";
      this.initialSelected = [];
      let sharaInitArr = [];
      if (!Z_IsEmpty20(this.basicInfo.sharedScope) && this.basicInfo.sharedScope !== "wholeCompany") {
        sharaInitArr = this.basicInfo.sharedScope.split(",");
        sharaInitArr.forEach(item => {
          this.initialSelected.push({
            value: item,
            type: "user"
          });
        });
      }
    },
    //关闭标签页
    cancle() {
      this.popup = false;
      this.defaultMain = true;
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    onPicked(list) {
      let vm = this;
      this.showPersonPicker = false;
      let userName = "";
      let userId = "";
      let cardUrl = "";
      let responsiblePersonName = "";
      let responsibleCardUrl = "";
      let sharedName = "";
      let shareCardUrl = "";
      if (!Z_IsEmpty20(list)) {
        if (list.length === 1) {
          vm.basicInfo.cardUrl = list[0].id;
          if (vm.setAuthroid === "update") {
            responsiblePersonName = list[0].userName;
            responsibleCardUrl = list[0].cardUrl;
          } else {
            sharedName = list[0].userName;
            shareCardUrl = list[0].cardUrl;
          }
        } else {
          list.forEach(element => {
            userName += element.userName + ",";
            cardUrl += element.cardUrl + ",";
            userId += element.id + ",";
          });
          if (userName.length !== 0 && !Z_IsEmpty20(userName)) {
            userName = userName.substring(0, userName.length - 1);
          }
          if (userId.length !== 0 && !Z_IsEmpty20(userId)) {
            userId = userId.substring(0, userId.length - 1);
          }
          vm.basicInfo.cardUrl = userId;
          if (vm.setAuthroid === "update") {
            responsiblePersonName = userName;
            responsibleCardUrl = cardUrl;
          } else {
            sharedName = userName;
            shareCardUrl = cardUrl;
          }
        }
      }
      if (responsiblePersonName !== "") {
        vm.basicInfo.responsiblePersonName = responsiblePersonName;
      }
      if (sharedName !== "") {
        vm.basicInfo.sharedScopeName = sharedName;
      }
      this.changePeople(this.setAuthroid, responsibleCardUrl, shareCardUrl);
    },
    //显示编辑共享人弹窗
    showMark() {
      this.editFlag = true;
    }
  }
};
</script>
<style>
    .basicInforLimit .weui-cells__title ,.changeTitle .weui-cells__title,.basicInforTitle .weui-cells__title {
        height: 25px;
        line-height: 25px;
        background-color: #e5e5e5;
        font-size: 14px;
        font-family: Arial;
        color: rgba(16, 16, 16, 1) !important;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .basicInforTitle .weui-cells__title{
        padding-left: 0px;
    }
</style>
<style scoped>
.outwrapper {
  height: calc(100% - 50px);
}

.star-five {
  width: 0;
  height: 0;
  color: #e2dc1b;
  margin: 10px 0;
  position: relative;
  display: inline-flex;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 7px solid #e2dc1b;
  -moz-transfrom: rotate(35deg);
  -webkit-transform: rotate(35deg);
  -ms-transform: rotate(35deg);
  -o-transform: rotate(35deg);
}

.star-five:before {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid #e2dc1b;
  position: absolute;
  top: -7px;
  left: -8px;
  color: white;
  display: block;
  content: "";
  -moz-transform: rotate(-35deg);
  -webkit-transform: rotate(-35deg);
  -ms-transform: rotate(-35deg);
  -o-transform: rotate(-35deg);
}
.star-five:after {
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  color: #e2dc1b;
  top: 0px;
  left: -13px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 7px solid #e2dc1b;
  content: "";
  -moz-transform: rotate(-70deg);
  -webkit-transform: rotate(-70deg);
  -ms-transform: rotate(-70deg);
  -o-transform: rotate(-70deg);
}

.basicInfor .weui-cell {
  font-size: 15px;
  font-family: Arial;
}
.imgicon {
  width: 30px !important;
  height: 30px !important;
  float: left;
  background-color: #5aa2ef !important;
}
.left-wrapper-info {
  color: #5aa2ef;
  width: 160px;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 13px;
}
.img-font {
  float: left;
  position: initial;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 5px;
  padding-top: 5px;
}
/* .basicInfo-lastchild {
  margin-bottom: 45px;
} */
.header-more {
  margin-right: 10px;
}
.img {
  background-color: "#40aeff";
  vertical-align: middle;
  text-align: center;
  left: 25%;
}
.basic-Info {
  /* text-align: center; */
  width: 120px;
  /* vertical-align: middle; */
}
.basic-title {
  margin: 0px auto;
  vertical-align: middle;
  text-align: center;
  width: 150px;
  margin-top: 15px;
}
.basicInfor .weui-cell__ft {
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
  text-align: center;
  font-family: Arial;
}
.basicInfor .right {
  position: relative;
}

.basicInforTitle .weui-cells__title {
  color: rgba(112, 112, 112, 1) !important;
  font-size: 14px !important;
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.label, .range {
    position: relative;
    box-sizing: border-box;
    height: 50px;
    margin-left: 13px;
    padding-right: 13px;
    border-top: 1px solid #d9d9d9;

    &-title {
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        font-family: Arial;
    }

    &-content {
        &-mame {
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            font-family: Microsoft Yahei;
        }

        &-type {
            height: 20px;
            line-height: 10px;
            padding: 5px;
            border-radius: 2px;
            display: inline-block;
            background-color: rgba(252, 165, 106, 1);
            color: rgba(255, 128, 0, 1);
            font-size: 14px;
            font-family: Arial;
        }

        &-state {
            height: 20px;
            line-height: 10px;
            padding: 5px;
            border-radius: 2px;
            display: inline-block;
            background-color: rgba(220, 246, 239, 1);
            color: rgba(23, 194, 149, 1);
            font-size: 14px;
            font-family: Arial;
        }

        &-level {
            height: 20px;
            padding: 5px;
            line-height: 10px;
            border-radius: 2px;
            display: inline-block;
            background-color: rgba(228, 242, 252, 1);
            color: rgba(77, 169, 235, 1);
            font-size: 14px;
            font-family: Arial;
        }
    }

    &-edit {
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        font-family: Arial;
    }
}

.right .label-edit {
    right: 0 !important;
}

.label-edit .icon-youjiantou {
    font-size: 12px;
}

.limit {
    position: relative;
    padding: 5px 13px;

    &-responsible {
        font-size: 17px;
    }

    &-share {
        width: 60%;
        font-size: 17px;
    }
}

.mark {
    text-align: center;
    font-size 16px
    &-replace {
        border-bottom: 1px solid #f5f5f5;
        height 35px
        line-height 35px
        background-color white
    }

    &-edit {
        height 35px
        line-height 35px
        background-color white
    }
}

.lable-wapper {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
</style>
