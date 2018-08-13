<template>
    <div style="height:100%">
        <ZingHead title="客户">
        </ZingHead>
        <group class="contact">
            <cell :title="'备注'" is-link @click.native="clickRemark"></cell>
            <x-switch :title="'特别关注'" prevent-default v-model="isCheck" @on-click="onClick"></x-switch>
            <cell :title="'编辑客户'" is-link @click.native="updateContact"></cell>
            <cell :title="'设置联系人'" is-link @click.native="contactReset"></cell>
        </group>
        <popup v-model="showRemark" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupRemork">
                <group>
                    <ZingHead title="备注" class="remark">
                        <div slot="header-right">
                            <span class="header-more" @click="submitRemark">
                                完成
                            </span>
                        </div>
                    </ZingHead>
                    <x-textarea placeholder ="20字以内" v-model="remarks" :show-counter="false" :rows="2" autosize></x-textarea>
                </group>
            </div>
        </popup>
        <contact-picker-popup

            :multiple="multiple"
            :companyId="companyId"
            :showContactPicker="showContactPicker"
            :friendAndPhoneContactMode="friendAndPhoneContactMode"
            @hideContackPicker="hideContackPicker"
            @picked="picked">

        </contact-picker-popup>
    </div>

</template>
<script>
import ContactPickerPopup from "@/components/contactpicker/ContactPickerPopup";
import { Group, XTextarea, Cell, XSwitch, Popup } from "vux";
import { Z_IsEmpty20 } from "@/utils/fn";
import ZingHead from "@/components/zingHead/ZingHead";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
export default {
 components: {
    XTextarea,
    Group,
    OrgMemberPicker,
    Cell,
    ZingHead,
    XSwitch,
    Popup,
    ContactPickerPopup
  },
  data() {
    return {
      remarks: "",
      isCheck: false,
      showRemark: false,
      initCardurl: [],
      cardUrl:'',
      initialSelected: [],
      queryData: {},
      checkTemp: "",
      friendAndPhoneContactMode: true,
      showContactPicker: false,
      defaultMain: true,
      basicInfo:[],
        multiple:false
    };
  },
  created() {
    let vm = this;
    vm.queryData = vm.$route.query;
    //   console.info(vm.queryData.specialFocus)
    vm.isCheck = vm.queryData.specialFocus;
    vm.getContact();
  },
  methods: {
    // 获取联系人
    getContact() {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById";
      let params = {
        contactsId: vm.queryData.externalContactsId
      };
      vm.$http
        .post(url, params)
        .then(result => {
          if (result.data.success === true) {
              vm.basicInfo = result.data.data
            vm.initCardurl.cardUrl = result.data.data.cardUrl;
          } else {
            vm.$vux.toast.text(result.data.mgs);
          }
        })
    },
    //通讯返回
    hideContackPicker() {
      this.showContactPicker = false;
      this.defaultMain = true;
    },
    //通讯录返回数据
    picked(val) {
      if (!Z_IsEmpty20(val)) {
        if (val.length === 1) {
          this.cardUrl = val[0].cardUrl;
        } else {
          let contactUrl = "";
          val.forEach(element => {
            contactUrl = element.cardUrl;
            this.cardUrl += contactUrl + ",";
          });
        }
      }
      this.ModutyContact();
      this.hideContackPicker();
    },
    // 点击备注按钮
    clickRemark() {
      this.showRemark = true;
      this.getRemark();
    },
    // 更新备注接口
    updateRemark() {
        let vm = this;
        if (vm.remarks === "") {
            this.showRemark = false;
            return
        }
      let url = "/zingbiz/auth/user/custom/updateExternalContactRemarkName";
      let params = {
        externalContactsId: vm.queryData.externalContactsId,
        remarkName: vm.remarks
      };
      vm.$http
        .post(url, params)
        .then(result => {
          if (result.data.success === true) {
            vm.remarks = result.data.data;
            vm.$vux.toast.text(result.data.mgs);
            this.showRemark = false;
          } else {
            vm.$vux.toast.text(result.data.mgs);
          }
        })
    },
    // 初始化备注数据
    getRemark() {
      let vm = this;
      let url = "/zingbiz/auth/user/custom/getExternalContactRemarkName";
      let params = {
        externalContactsId: vm.queryData.externalContactsId
      };
      vm.$http
        .post(url, params)
        .then(result => {
          if (result.data.success === true) {
              let remark = result.data.data.data
              if (remark.length !== 0) {
                  vm.remarks = remark[0].remarkName;
              }
          }
        })
    },
    //编辑外联人页面跳转
    updateContact() {
      this.$router.push({
        path: "addContact",
        query: {
          externalContactsId: this.$route.query.externalContactsId,
          companyId: this.$route.query.companyId
        }
      });
    },

    //设置外联人
    contactReset() {
      this.showContactPicker = true;
      this.defaultMain = false;
      this.initialSelected.push({
          value: this.initCardurl.cardUrl,
          type:"user"
      })
    },
    // 修改外联人
    ModutyContact() {
      let vm = this;
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts";
      let params = {
        contactsId: vm.queryData.externalContactsId,
        contactsCardUrl: this.cardUrl
      };
    //    if(vm.basicInfo.typeText === '酒店客户'){
    //        idCard = vm.basicInfo.idCard
    //       ? { idCard: vm.basicInfo.idCard }
    //       : {};
    //   }
     params = Object.assign({}, params);
      vm.$http
        .post(url, params)
        .then(result => {
          if (result.data.success === true) {
            vm.$vux.toast.text(result.data.mgs);
            this.showContactPicker = false;
          } else {
            vm.$vux.toast.text(result.data.mgs);
          }
        })
    },
    //特别关注
    onClick(newVal, oldVal) {
      let vm = this;
      if (newVal === true) {
        vm.checkTemp = "0";
      } else {
        vm.checkTemp = "1";
      }
      let url =
        "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts";
      let params = {
        contactsId: vm.queryData.externalContactsId,
        specialFocus: vm.checkTemp
      };
    //   if(vm.basicInfo.typeText === '酒店客户'){
    //        idCard = vm.basicInfo.idCard
    //       ? { idCard: vm.basicInfo.idCard }
    //       : {};
    //   }
     params = Object.assign({}, params);
      vm.$http
        .post(url, params)
        .then(result => {
          if (result.data.success === true) {
            vm.isCheck = newVal;
            vm.$vux.toast.text(result.data.mgs);
          } else {
            vm.$vux.toast.text(result.data.mgs);
          }
        })
    },
    //完成按钮（备注数据提交）
    submitRemark() {
      this.updateRemark();
    }
  }
};
</script>

<style>
    .popupRemork .header-more{
        color: #ff8000;
        margin-right: 13px !important;
    }
</style>
<style scoped>

.popupRemork .contact {
  font-size: 15px;
}
</style>



