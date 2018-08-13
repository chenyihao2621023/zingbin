<template>
    <div class="popupDate-picker" v-transfer-dom>
        <popup v-model="showPopupTemplateForm"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <zing-head class="popupDate-picker-head"
                           title=""
                           :isComeBack="false"
                           @doSome="cancle">
                </zing-head>
                <div class="templateForm">
                    <selector style="font-size: 16px !important;" title="模板类型&nbsp;<span style='color: red;'>*</span>: " :options="templateTypeArray" placeholder="请选择模板类型"
                              v-model="formParams.templateType" >
                    </selector>
                    <x-input style="font-size: 16px !important;" v-if="formParams.templateType=='KH'" title="技能组类型&nbsp;<span style='color: red;'>*</span>: " v-model="formParams.skillType"
                             @click.native="selSkillGroup" :disabled="readOnly" placeholder="请选择技能组">
                    </x-input>
                    <x-input style="font-size: 16px !important;" title="审批流模板名称&nbsp;<span style='color: red;'>*</span>: "
                             placeholder="请输入模板名称"
                             v-model="formParams.templateName" >
                    </x-input>
                    <x-textarea style="font-size: 16px !important;" title="审批流模板描述: "
                                placeholder="请输入模板描述"
                                v-model="formParams.templateDesc" >
                                <span slot="label">审批流模板描述<span style='color: red;'>*</span>: </span>
                    </x-textarea>

                    <cell style="font-size: 16px !important;" v-if="typeData.moduleType=='MODULE_TYPE_ZYK'" title="凭证类型："
                          is-link="true"
                          @click.native="onFocus()"
                    >
                        点击选择凭证类型
                    </cell>
                    <tag-group :items="pzTypeItems" @onChange="tagChanged" style="text-align:right"></tag-group>

                    <cell style="text-align: left !important;font-size: 16px !important;" title="设置模板图标" class="taskIcon" v-model="formParams.templateIcon">
                        <i :class="['iconfont', `icon-${formParams.templateIcon}`, taskIconBgColor]" @click="selectIocn()"
                           :style="{ 'background-color': taskIconBgColor,'color':'#ff8000'}"></i>
                    </cell>
                    <iconPicker :icon-picker-show="dialogIcon"
                                :iconData="iconData"
                                :bg-color="bgColor" :mask-z-index="8000"
                                :dialog-z-index="10000" @cancel="iconPickerCancel"
                                @close="iconPickerClose"
                                @confirm="iconPickerConfirm" />

                    <x-switch style="font-size: 16px !important;" title="是否关联任务："
                              :value-map="['否', '是']"
                              v-model="formParams.isLinkTask"
                    ></x-switch>
                    <cell style="font-size: 16px !important;"
                          is-link="true"
                          @click.native="selectInputPerson()"
                    >
                      <span slot="title">可见范围<span style='color:red'>*</span>：</span>
                        点击添加可见范围
                    </cell>
                    <tag-group :items="items" @onChange="tagChanged" style="text-align:right"></tag-group>

                    <x-switch style="font-size: 16px !important;" title="启用/禁用："
                              :value-map="['禁用', '启用']"
                              v-model="formParams.isDeleteForTemplate"
                    ></x-switch>


                </div>
                <flexbox>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button :disabled="isButtonDisabled" class="btn-save" @click.native="cancle">取消</x-button>
                    </flexbox-item>
                    <flexbox-item style="margin-left: 0px !important;">
                        <x-button :disabled="isButtonDisabled" style="color: rgb(255, 255, 255);background-color: #ff8000;" @click.native="submit">确定</x-button>
                    </flexbox-item>
                </flexbox>

            </div>
            <workflow-Certificate :showPopupDate="certifShow"
                                  :certificateTitle="certifiTitle"
                                  :commonList="certifiData"
                                  :checkItem="checkCurType"
                                  @backClick="clickBack1"
                                  @submitClick="submitCertif"
                                  @cancleClick="cancleCertif"
                                  @change="SelectClick"></workflow-Certificate>
            <!-- 选人组件 -->
            <org-member-picker ref="picker"
                               :initialSelected="insertNew"
                               :showPicker="showPersonPicker"
                               @picked="onPicked"
                               @abort="onPickAbort"
            ></org-member-picker>

        </popup>
    </div>
</template>

<script>
import workflowCertificate from "@/container/workflow/typeAndTemplate/workflowCertificate";
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
import IconPicker from "components/iconpicker/IconPicker";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import TagGroup from "@/components/taggroup/TagGroup";

import {
  Group,
  XButton,
  Flexbox,
  CheckIcon,
  FlexboxItem,
  XInput,
  Cell,
  Selector,
  XTextarea,
  XSwitch,
  Popup,
  TransferDomDirective as TransferDom
} from "vux";

export default {
  name: "templateForm",
  components: {
    XTextarea,
    Popup,
    GridCard,
    CheckIcon,
    Cell,
    workflowCertificate,
    ZingHead,
    XInput,
    IconPicker,
    Selector,
    Flexbox,
    FlexboxItem,
    XSwitch,
    Group,
    XButton,
    OrgMemberPicker,
    TagGroup
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      insertNew: [],
      items: [],
      pzTypeItems: [],
      showPersonPicker: false,
      isButtonDisabled: false,
      dialogIcon: false,
      bgColor: "#ff8000",
      certifShow: false,
      certifiData: [],
      taskIcon: "tianjia1",
      readOnly: false,
      certifiTitle: "",
      taskIconBgColor: "",
      certifChooseData: [],
      templateTypeArray: [],
      headImgSrc: [], // 图片文件
      jnzData: [],
      checkCurType: [],
      iconData: [
        "benbanzushengchandingdanguanli",
        "canting",
        "jiudian",
        "shangpu",
        "caigou-tianchong",
        "xiaoshougendanguanli",
        "salesinvoice",
        "shenpi1",
        "tuihuo",
        "02",
        "shichang",
        "renzhengziliao",
        "baocun-tianchong",
        "baobiao-selected",
        "renwu",
        "xiaolaba",
        "caiwu",
        "fabubiaoshu",
        "cardb",
        "weibiaoti4"
      ],
      formParams: {
        templateType: "",
        skillType: "",
        templateName: "",
        templateDesc: "",
        serialNumberForTemplate: "",
        templateIcon: "",
        isLinkTask: "",
        templateTypeForOtherModule: "",
        isDeleteForTemplate: "启用"
      },
      templateTypeModel: []
    };
  },
  props: {
    showPopupTemplateForm: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    },
    modelTitle: {
      type: String,
      default: function() {
        return "";
      }
    },
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    typeData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    orgRoleUserData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    formData: {
      handler: function() {
        this.initPageData();
      }
    },
    items: {
      handler: function(val, oldval) {
        this.$forceUpdate();
      }
    }
  },
  created() {
    this.initPageData();
  },
  methods: {
    initPageData() {
      let vm = this;
      vm.items = [];
      vm.pzTypeItems = [];
      vm.isButtonDisabled = false;
      //渲染表单数据
      for (let key in vm.formData) {
        if (vm.formParams.hasOwnProperty(key)) {
          vm.formParams[key] = vm.formData[key];
        }
      }

      if (vm.formData.templateId != undefined && vm.formData.templateId != "") {
        if (vm.iconData.indexOf(vm.formParams.templateIcon) == -1) {
          vm.formParams.templateIcon = "tianjia1";
        }
        vm.handleKJFW();
      } else {
        vm.formParams.templateIcon = "tianjia1";
      }
      vm.certifChooseData = [];
      if (
        vm.typeData.moduleType == undefined ||
        vm.typeData.moduleType === "typeForPuTongShenPi" ||
        vm.typeData.moduleType === ""
      ) {
        vm.templateTypeArray = [
          {
            key: "YG",
            value: "内部审批"
          },
          {
            key: "KH",
            value: "客户审批"
          }
        ];
        vm.getJNZData();
      } else {
        if (vm.typeData.moduleType === "MODULE_TYPE_ZYK") {
          vm.getVoucherType();
        }
        vm.templateTypeArray = [
          {
            key: "YG",
            value: "内部审批"
          }
        ];
        if (
          vm.formParams.templateType == undefined ||
          vm.formParams.templateType == ""
        ) {
          vm.formParams.templateType = "YG";
        }
      }
    },
    handleKJFW() {
      let kjfwArr =
        this.formData.roleTags == undefined || this.formData.roleTags == ""
          ? []
          : this.formData.roleTags.split(" ");

      //处理组织 和 用户
      let orgAndUserArr = this.orgRoleUserData.orgUserDatas;
      for (let i in orgAndUserArr) {
        this.recursionOrgAndUser(orgAndUserArr[i], kjfwArr);
      }
      //处理角色
      let roleArr = this.orgRoleUserData.roleDatas;
      for (let i in roleArr) {
        this.recursionRole(roleArr[i], kjfwArr);
      }
    },
    recursionOrgAndUser(orgAndUser, kjfwArr) {
      if (kjfwArr.indexOf(orgAndUser.id) >= 0) {
        this.items.push({
          key: orgAndUser.text,
          value: orgAndUser.id,
          level: "info"
        });
      }
      if (orgAndUser.users != undefined && orgAndUser.users.length >= 0) {
        for (let i in orgAndUser.users) {
          if (kjfwArr.indexOf(orgAndUser.users[i].cardUrl) >= 0) {
            let isExist = false;
            for (let k in this.items) {
              if (this.items[k].value == orgAndUser.users[i].cardUrl) {
                isExist = true;
                break;
              }
            }
            if (!isExist) {
              this.items.push({
                key: orgAndUser.users[i].userName,
                value: orgAndUser.users[i].cardUrl,
                level: "default"
              });
            }
          }
        }
      }
      if (orgAndUser.children != undefined && orgAndUser.children.length > 0) {
        for (let i in orgAndUser.children) {
          this.recursionOrgAndUser(orgAndUser.children[i], kjfwArr);
        }
      }
    },
    recursionRole(role, kjfwArr) {
      if (kjfwArr.indexOf(role.roleInfoId) >= 0) {
        this.items.push({
          key: role.roleInfoName,
          value: role.roleInfoId,
          level: "success"
        });
      }
    },
    submit() {
      let vm = this;
      let url = "";
      let isChangeForTemplateName = false;
      let isChangeForTemplateType = false;
      let params = "";
      if (vm.formData.templateId != undefined && vm.formData.templateId != "") {
        url = "/zingbiz/workflow/typeAndTemplate/updateOneTemplate";
        if (vm.formData.templateType === vm.formParams.templateType) {
          vm.formParams.isChangeForTemplateType = false;
        } else {
          vm.formParams.isChangeForTemplateType = true;
        }
        if (vm.formData.templateName === vm.formParams.templateName) {
          vm.formParams.isChangeForTemplateName = false;
        } else {
          vm.formParams.isChangeForTemplateName = true;
        }
        vm.formParams.templateId = vm.formData.templateId;
      } else {
        url = "/zingbiz/workflow/typeAndTemplate/addOneTemplate";
        delete vm.formParams.templateId;
      }
      if (
        vm.formParams.templateType === undefined ||
        vm.formParams.templateType === ""
      ) {
        vm.$vux.toast.text("请选择模板类型", "top");
        return;
      }
      if (
        vm.formParams.templateName === undefined ||
        vm.formParams.templateName === ""
      ) {
        vm.$vux.toast.text("请输入模板名称", "top");
        return;
      }
      if (
        vm.formParams.templateDesc === undefined ||
        vm.formParams.templateDesc === ""
      ) {
        vm.$vux.toast.text("请输入模板描述", "top");
        return;
      }
      if (vm.typeData.templateType === "KH") {
        if (
          vm.formParams.skillType == undefined ||
          vm.formParams.skillType == ""
        ) {
          vm.$vux.toast.text("请选择技能组", "top");
          return;
        }
      }
      vm.formParams.typeId = vm.typeData.categoryId;
      if (vm.typeData.moduleType === "MODULE_TYPE_ZYK") {
        vm.formParams.templateTypeForOtherModule = vm.pzTypeItems
          .map(item => {
            return item.value;
          })
          .join(",");

        delete vm.formParams.temTypeModel;
        delete vm.formParams.temTypeModelName;
      }
      //处理可见范围数据
      vm.formParams.roleTags = vm.items
        .map(item => {
          return item.value;
        })
        .join(" ");

      vm.isButtonDisabled = true;
      vm.$http.post(url, vm.formParams).then(res => {
        if (res.data.success === "true") {
          vm.$emit("reload");
          vm.$emit("cancleClick");
          vm.$vux.toast.text("操作成功！", "top");
        } else {
          vm.isButtonDisabled = false;
          vm.$vux.toast.text(res.data.mgs, "top");
        }
      });
    },
    cancle() {
      this.$emit("cancleClick");
    },
    SelectClick(value, label) {
      let vm = this;
      vm.certifChooseData = value;
    },
    submitCertif() {
      let vm = this;
      let temp = "";
      let Temp = "";
      let tempType = "";
      if (vm.typeData.moduleType === "MODULE_TYPE_ZYK") {
        /**
         * 需求，调拨单 子入库的单 子出库单不可同其他类型一同设置
         */
        if (
          vm.certifChooseData != undefined &&
          vm.certifChooseData.length > 0
        ) {
          let tArr = [];
          let typeStr = vm.certifChooseData.join(",");
          vm.certifChooseData.forEach(item => {
            if (
              item != "DBD" &&
              item != "childOtherOut" &&
              item != "childOtherIn"
            ) {
              tArr.push(item);
            }
          });

          if (
            tArr != undefined &&
            tArr.length > 0 &&
            (typeStr.indexOf("DBD") >= 0 ||
              typeStr.indexOf("childOtherOut") >= 0 ||
              typeStr.indexOf("childOtherIn") >= 0)
          ) {
            vm.$vux.toast.text(
              "调拨单、子入库单、子出库单、不能与其他类型同时设置。",
              "top"
            );
            return false;
          }
        }

        vm.pzTypeItems = [];
        vm.formParams.templateTypeForOtherModule = vm.certifChooseData.join(
          ","
        );
        vm.certifChooseData.forEach(item => {
          let titleStr = "";
          vm.templateTypeModel.forEach(vt => {
            if (vt.key == item) {
              titleStr = vt.value;
            }
          });
          vm.pzTypeItems.push({
            key: titleStr,
            value: item,
            level: "default"
          });
        });
      } else {
        vm.certifChooseData.forEach(function(item) {
          temp += item + ",";
          tempType = temp;
        });
        if (tempType != undefined && tempType != "") {
          tempType = tempType.substring(0, tempType.length - 1);
        }
        vm.formParams.skillType = tempType;
      }
      vm.certifShow = false;
    },
    cancleCertif() {
      this.certifShow = false;
    },
    selSkillGroup(val, $event) {
      let vm = this;
      vm.certifShow = true;
      let skillGroupTemp = vm.formParams.skillType;
      if (skillGroupTemp != undefined && skillGroupTemp != "") {
        vm.checkCurType = skillGroupTemp.split(",");
      } else {
        vm.checkCurType = [];
      }
      vm.certifiTitle = "技能组类型选择";
      vm.certifiData = vm.jnzData;
    },
    getJNZData() {
      let self = this;
      //如果已经获取一次技能组数据后 则不再次进行获取 避免多次请求服务器
      if (self.jnzData != undefined && self.jnzData.length != 0) {
        return;
      }

      let sendUrl = "/zingbiz/skillGroupInfo/skillGroupInfoRest/getAllSkType";
      let params = {};
      self.$http.post(sendUrl, params).then(res => {
        try {
          if (res.data.success) {
            let retData = res.data.data;
            retData.forEach(item => {
              if (self.jnzData.indexOf(item.skType) === -1) {
                self.jnzData.push(item.skType);
              }
            });
          }
        } catch (e) {}
      });
    },
    getVoucherType() {
      let self = this;
      //如果已经获取一次凭证类型数据后 则不再次进行获取 避免多次请求服务器
      if (
        self.templateTypeModel != undefined &&
        self.templateTypeModel.length != 0
      ) {
        return;
      }

      let sendUrl = "/zingbiz/resourceLibrary/voucher/getVoucherType";
      let params = {};
      self.$http.get(sendUrl, params).then(res => {
        try {
          if (res.data.success) {
            let retData = res.data.data;
            for (let key in retData) {
              self.templateTypeModel.push({
                key: key,
                value: retData[key]
              });
            }
            let pzType =
              self.formParams.templateTypeForOtherModule == undefined
                ? ""
                : self.formParams.templateTypeForOtherModule;
            if (pzType != "") {
              let pzTypeArr = pzType.split(",");
              pzTypeArr.forEach(item => {
                let titleStr = "";
                self.templateTypeModel.forEach(vt => {
                  if (vt.key == item) {
                    titleStr = vt.value;
                  }
                });
                self.pzTypeItems.push({
                  key: titleStr,
                  value: item,
                  level: "default"
                });
              });
            }
          }
        } catch (e) {}
      });
    },
    selectIocn() {
      this.dialogIcon = true;
    },
    iconPickerConfirm(data) {
      this.dialogIcon = false;
      this.formParams.templateIcon = data;
      this.taskIconBgColor = "wp";
    },
    iconPickerClose() {
      this.dialogIcon = false;
    },
    iconPickerCancel() {
      this.dialogIcon = false;
    },
    onFocus() {
      let vm = this;
      vm.certifiTitle = "凭证类型选择";
      vm.certifiData = vm.templateTypeModel;
      let templateTypeModelTemp = vm.formParams.templateTypeForOtherModule;
      if (templateTypeModelTemp != undefined && templateTypeModelTemp != "") {
        vm.checkCurType = templateTypeModelTemp.split(",");
      } else {
        vm.checkCurType = [];
      }
      vm.certifShow = true;
    },
    backClick() {
      this.$emit("backClick");
    },
    clickBack1() {
      this.certifShow = false;
    },
    selectInputPerson() {
      this.insertNew = this.items;
      this.flag = 1;
      this.showPersonPicker = true;
    },
    onPicked(list) {
      this.showPersonPicker = false;
      this.items = list.map(item => {
        let map = {
          key: item.title,
          value: item.id,
          level: this.$refs.picker.getLevel(item.type)
        };
        return map;
      });
      /*this.insertNew1 = list.map(item => item.rowId)*/
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    tagChanged(arr) {
      //this.items = arr;
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.popupDate-picker {
  .vux-popup-dialog {
    z-index: 800;
  }

  .popupDate-picker-popup {
    display: flex;
    flex-direction: column;
    background-color: $component-background;
    width: 100%;
    height: 100%;
  }
}

.templateForm {
  height: 85.2%;
  overflow-y: scroll;
}

.taskIcon {
  text-align: center;

  .iconfont {
    font-size: 35px;
  }
}

.weui-cell:before {
  left: 0px !important;
}
</style>

