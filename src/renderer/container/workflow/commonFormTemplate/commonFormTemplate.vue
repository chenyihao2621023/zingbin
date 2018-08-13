<template>
    <div id="commonFormTemplate" style="width:100%;height:100%;position:relative;">
        <div v-show="isSetting" style="position: absolute;height: 100%;width: 100%;z-index: 1;"></div>
        <!-- 文本 -->
        <div v-if="formItemData.formItemType=='input'" >
            <div v-if="isShowDetail" class="weui-form-preview__item">
                <label class="weui-form-preview__label">{{formItemData.formItemName}}：</label>
                <span class="weui-form-preview__value">{{formItemData.formItemValue}}</span>
            </div>
            <x-input v-else style="padding:0px !important;text-align: left !important;"
                     class="formFontSize"
                     :title="formItemData.isMustRequired=='是'?formItemData.formItemName+'&nbsp;<span style=\'color: red;\'>*</span>：':formItemData.formItemName+'：'"
                     :placeholder="formItemData.formItemHintText"
                     v-model="formItemData.formItemValue"
            ></x-input>
        </div>

        <!-- 多行文本 -->
        <div v-if="formItemData.formItemType=='textarea'" >
            <div v-if="isShowDetail" class="weui-form-preview__item">
                <label class="weui-form-preview__label">{{formItemData.formItemName}}：</label>
                <span class="weui-form-preview__value">{{formItemData.formItemValue}}</span>
            </div>
            <x-textarea v-else style="padding:0px !important;text-align: left !important;"
                        class="formFontSize"
                        :title="formItemData.isMustRequired=='是'?formItemData.formItemName+'&nbsp;<span style=\'color: red;\'>*</span>：':formItemData.formItemName+'：'"
                        :placeholder="formItemData.formItemHintText"
                        v-model="formItemData.formItemValue"
                        :show-counter="false"
                        :rows="3"
            >
              <span slot="label">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
            </x-textarea>
        </div>

        <!-- 选择时间 -->
        <div v-if="formItemData.formItemType=='datetime'" >
            <div v-if="isShowDetail" class="weui-form-preview__item">
                <label class="weui-form-preview__label">{{formItemData.formItemName}}：</label>
                <span class="weui-form-preview__value">{{formItemData.formItemValue}}</span>
            </div>
            <datetime v-else class="formFontSize"
                      v-model="formItemData.formItemValue"
                      value-text-align="right"
            >
              <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
            </datetime>
        </div>

        <!-- 图片 -->
        <div v-if="formItemData.formItemType=='image'" >
            <cell style="padding:0px !important;text-align: left !important;"
            value-align="left">
              <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
            </cell>
            <image-picker style="margin-top: 15px;margin-bottom: 25px !important;"
                          :files="fileArr"
                          multiple
                          :companyId="companyId"
                          @onChange="imgOkCallback"
                          @onImageClick="onImageClick"
                          :selectable="isShowDetail?false:true"
            />
        </div>

        <!-- 附件 -->
        <div v-if="formItemData.formItemType=='annex'" >
            <cell style="padding:0px !important;text-align: left !important;" v-if="isShowDetail" :title="formItemData.formItemName+'：'" value-align="left"></cell>
            <cell v-else style="padding:0px !important;text-align: left !important;padding:10px 0px !important;"
                  is-link
                  @click.native="uploadAnnex"
            >
              <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
              点击选择附件
            </cell>

            <GridCard style="padding: 0px !important;" v-for="(item,index) in annexArr" :key="index">
                <div slot="cardLeft" class="left">
                    <avatar shape="square" :style="{backgroundColor: '#EA3C40'}">
                        <img :src="item.relativePath" style="width: 50px">
                    </avatar>
                    <div class="left-wrapper">
                        <div style="text-align: left;"><p style="font-size: 14px;" class="left-wrapper-title">附件名：{{item.fileName}}</p></div>
                        <div style="text-align: left;" class="left-wrapper-desc">附件大小：{{item.fileSize}}KB</div>
                    </div>
                </div>
                <div slot="cardRight" class="right">

                </div>
            </GridCard>
        </div>

        <!-- 关联任务 -->
        <div v-if="formItemData.formItemType=='task'" >
            <cell style="padding:0px !important;text-align: left !important;">
                <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
                <div v-if="isShowDetail?false:true" @click="addTaskWork()" style="display: inline;padding:10px;"><i class="iconfont icon-tianjia" style="font-size: 30px;"></i></div>
            </cell>
            <div v-if="linkTaskData.length>0" >
                <cell class="otherCell" style="margin-top:0px !important;text-align: left !important;" v-for="(item,index) in linkTaskData" :key="index" :title="item.title" >
                    <i v-if="isShowDetail?false:true" @click="delLinkTask(item)" class="iconfont icon-shanchu3" style="font-size: 20px;padding:10px;margin-right: 5px;"></i>
                </cell>
            </div>

            <!-- 关联任务 -->
            <task-selection :showTaskSelection="showTaskSelection"
                            @confirmTaskSelection="confirmTaskSelection"
                            @cancleTaskSelection="cancleTaskSelection"
            ></task-selection>
        </div>

        <!-- 语音 -->
        <div v-if="formItemData.formItemType=='voice'" >
            <cell style="padding: 0px !important;text-align: left !important;" v-if="isShowDetail" :title="formItemData.formItemName+'：'" value-align="left"></cell>
            <cell v-else style="padding:0px !important;text-align: left !important;" >
                <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
                <div style="border: 1px solid #ccc;padding: 5px;"
                     @click="handleVoice"
                >
                    {{voiceButtonTitle}}
                </div>
            </cell>
            <div class="otherCell" v-show="videoArr!=undefined && videoArr.length>0">
                <div style="width:100%;" v-audio-control>
                    <div v-for="(data,index) in videoArr" :key="index" style="width:50px;height:50px;float:right;margin-right:5px;">
                        <div style="position:absolute;z-index:2;width:50px;height:50px;float:right;background: rgba(255,255,255,0);border-color: #fff;border-radius: 10px;box-shadow: 2px 4px 6px rgba(0,0,0,0.2) !important;" class="audio"
                             :data-src="data">
                        </div>
                        <i style="z-index:1;margin-top: 15px;margin-left: 15px;float:left;" class="chat-voice-ico" ></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 地图，位置 -->
        <div v-if="formItemData.formItemType=='address'" >
            <x-input style="padding:0px !important;text-align: left !important;"
                     class="formFontSize"
                     :title="formItemData.isMustRequired=='是'?formItemData.formItemName+'&nbsp;<span style=\'color: red;\'>*</span>：':formItemData.formItemName+'：'"
                     :placeholder="formItemData.formItemHintText"
                     v-model="formItemData.formItemValue"
            ></x-input>
        </div>

        <div v-if="formItemData.formItemType=='personAndOrg'" >
            <cell style="padding: 0px !important;text-align: left !important;" v-if="isShowDetail" :title="formItemData.formItemName+'：'" value-align="left"></cell>
            <cell v-else style="padding:10px 0px !important;text-align: left !important;"
                  is-link="true"
                  @click.native="selectInputPerson()"
            >
              <span slot="title">{{formItemData.formItemName}}<span v-show="formItemData.isMustRequired=='是'" style='color:red'>*</span>：</span>
              选择人员/组织
            </cell>
            <tag-group v-show="items!=undefined && items.length>0" :items="items" @onChange="tagChanged" style="text-align:right"></tag-group>

            <!-- 选人组件 -->
            <org-member-picker ref="picker"
                               :initialSelected="insertNew"
                               :showPicker="showPersonPicker"
                               @picked="onPicked"
                               @abort="onPickAbort"
            ></org-member-picker>
        </div>

    </div>
</template>

<script>
import ImagePicker from "@/components/imagepicker/ImagePicker";
import {
  getChatVoiceImgParam,
  touchstartUploadVoice,
  touchendUploadVoice,
  touchcancleuploadVoice
} from "@/utils/wx";
import { mapState, mapMutations } from "vuex";
import AudioControl from "@/directives/audiocontrol/audio-control";
import TaskSelection from "@/container/common/task/taskSelection";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import TagGroup from "@/components/taggroup/TagGroup";
import Uploader from "@/utils/upload";
import { isMhApp, Z_IsEmpty20 } from "@/utils/fn";
import Avatar from "@/components/avatar/Avatar";
import GridCard from "@/components/gridcard/GridCard";

import {
  Group,
  XInput,
  XTextarea,
  Datetime,
  Cell,
  TransferDomDirective as TransferDom
} from "vux";
const fileUploader = Uploader.create();
export default {
  name: "commonFormTemplate",
  components: {
    Group,
    XInput,
    XTextarea,
    Datetime,
    Cell,
    ImagePicker,
    TaskSelection,
    OrgMemberPicker,
    TagGroup,
    GridCard,
    Avatar
  },
  directives: {
    AudioControl,
    TransferDom
  },
  data() {
    return {
      fileArr: [], //图片列表
      videoArr: [], //音频路径
      annexArr: [], //附件数据
      videoStr: "",
      voiceButtonTitle: "开始录音",
      voiceButtonState: 0, //0 未进行录音 1正在进行录音
      showTaskSelection: false,
      linkTaskData: [],
      insertNew: [],
      items: [],
      showPersonPicker: false,
      orgRoleUserData: {}
    };
  },
  //钩子加载完触发
  created: function() {
    console.log("formItemData", this.formItemData);
    this.handleFormItemData();
  },
  mounted() {
    this.initPCUploader(this.companyId);
    this.fileUploader(this.companyId);
  },
  watch: {
    formItemData: {
      handler() {
        this.handleFormItemData();
      }
    },
    wxUploadVoiceStatus(status) {
      if (status == "success") {
        let videoPath = "/checkJpg/group/" + this.wxUploadVoice.fileName;
        this.videoArr.push(videoPath);
        this.formItemData.formItemValue = this.videoArr
          .map(item => {
            return item;
          })
          .join(",");
      }
    }
  },
  computed: {
    ...mapState({
      wxUploadVoiceStatus: state => state.wx.wxUploadVoiceStatus,
      wxUploadVoice: state => state.wx.wxUploadVoice,
      playingVoiceElement: state => state.chat.playingVoiceElement
    })
  },
  props: {
    formItemData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    companyId: {
      type: String,
      default: function() {
        return "";
      }
    },
    isSetting: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isShowDetail: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    ...mapMutations({
      setPlayingVoiceElement: "SET_PLAYING_VOICE_ELEMENT"
    }),
    handleFormItemData() {
      let self = this;
      //判断是否有为图片
      if (self.formItemData.formItemType == "image") {
        //判断是否已存在图片数据
        let existImg =
          self.formItemData.formItemValue == undefined
            ? ""
            : self.formItemData.formItemValue;
        if (existImg != "") {
          let imgArrTemp = existImg.split(",");
          imgArrTemp.forEach(item => {
            self.fileArr.push({
              url: item
            });
          });
        }
      }
      //判断是否为选择组织
      if (self.formItemData.formItemType == "personAndOrg") {
        //获取组织机构 人员 角色数据 如果用户子节点选择了组织 需要到数据
        self.initOrgRoleUser();
      }

      //关联任务的处理
      if (self.formItemData.formItemType == "task") {
        if (
          self.formItemData.formItemValue != undefined &&
          self.formItemData.formItemValue != ""
        ) {
          let taskIds = self.formItemData.formItemValue;
          let taskArr = taskIds.split(",");

          taskArr.forEach(item => {
            let dTemp = self.urlParse(item);
            self.linkTaskData.push(dTemp);
          });
        }
      }

      //语音数据的处理
      if (self.formItemData.formItemType == "voice") {
        if (
          self.formItemData.formItemValue != undefined &&
          self.formItemData.formItemValue != ""
        ) {
          let voices = self.formItemData.formItemValue;
          let voiceArr = voices.split(",");

          voiceArr.forEach(item => {
            self.videoArr.push(item);
          });
        }
      }

      //语音数据的处理
      if (self.formItemData.formItemType == "annex") {
        if (
          self.formItemData.formItemValue != undefined &&
          self.formItemData.formItemValue != ""
        ) {
          let annexStr = self.formItemData.formItemValue;
          let annexArr = JSON.parse(annexStr);

          annexArr.forEach(item => {
            self.annexArr.push(item);
          });
        }
      }
    },
    //上传图片组件方法
    imgOkCallback(files, operationType, index) {
      let imgUrlArr = [];

      files.forEach(function(obj) {
        imgUrlArr.push(obj.url);
      });
      this.fileArr = files;
      this.formItemData.formItemValue = imgUrlArr.join(",");
    },
    onImageClick() {},
    handleVoice() {
      if (this.voiceButtonState == 0) {
        this.voiceButtonTitle = "停止录音";
        this.voiceTouchStart();
        this.voiceButtonState = 1;
      } else {
        this.voiceButtonTitle = "开始录音";
        this.voiceTouchEnd();
        this.voiceButtonState = 0;
      }
    },
    voiceTouchStart(e) {
      // 开始录音
      touchstartUploadVoice();
    },
    voiceTouchEnd() {
      // 停止并上传录音
      var params = {
        bType: "hr_kq_audio",
        bId: "id"
      };
      touchendUploadVoice(params);
    },
    addTaskWork() {
      this.showTaskSelection = true;
    },
    confirmTaskSelection(backData) {
      this.linkTaskData = this.linkTaskData.filter(
        item => item.cardId !== backData.cardId
      );
      this.linkTaskData.push(backData);
      this.showTaskSelection = false;

      if (this.linkTaskData != undefined && this.linkTaskData.length > 0) {
        let linkTaskIds = "";
        this.linkTaskData.forEach(item => {
          linkTaskIds +=
            "boardId=" +
            item.boardId +
            "&listId=" +
            item.listId +
            "&cardId=" +
            item.cardId +
            "&title=" +
            item.title +
            ",";
        });
        if (linkTaskIds != undefined && linkTaskIds.length > 0) {
          linkTaskIds = linkTaskIds.substring(0, linkTaskIds.length - 1);
        }
        this.formItemData.formItemValue = linkTaskIds;
      }
    },
    cancleTaskSelection() {
      this.showTaskSelection = false;
    },
    delLinkTask(taskData) {
      this.linkTaskData = this.linkTaskData.filter(
        item => item.cardId !== taskData.cardId
      );

      if (this.linkTaskData != undefined && this.linkTaskData.length > 0) {
        let linkTaskIds = "";
        this.linkTaskData.forEach(item => {
          linkTaskIds +=
            "boardId=" +
            item.boardId +
            "&listId=" +
            item.listId +
            "&cardId=" +
            item.cardId +
            "&title=" +
            item.title +
            ",";
        });
        if (linkTaskIds != undefined && linkTaskIds.length > 0) {
          linkTaskIds = linkTaskIds.substring(0, linkTaskIds.length - 1);
        }
        this.formItemData.formItemValue = linkTaskIds;
      }
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

      if (this.items != undefined && this.items.length > 0) {
        let ids = "";
        this.items.forEach(item => {
          ids += item.value + ",";
        });
        if (ids != undefined && ids.length > 0) {
          ids = ids.substring(0, ids.length - 1);
        }
        this.formItemData.formItemValue = ids;
      }
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    tagChanged(arr) {},
    initOrgRoleUser() {
      if (JSON.stringify(this.orgRoleUserData) != "{}") {
        this.handleOrgAndRole();
        return;
      }
      let url = "/zingbiz/auth/org/getOrgRoleUser";
      let params = {};
      this.$http
        .post(url, params)
        .then(res => {
          if (!res.data.success) {
            console.error("getOrgRoleUser error", res);
            return;
          }

          if (!res.data.data["roleDatas"] || !res.data.data["orgUserDatas"]) {
            console.warn("getOrgRoleUser data error", res);
            return;
          }

          let retData = res.data.data;
          this.orgRoleUserData = retData;
          this.handleOrgAndRole();
          console.log("OrgRoleUser", retData);
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleOrgAndRole() {
      let orgAndRole =
        this.formItemData.formItemValue == undefined ||
        this.formItemData.formItemValue == ""
          ? []
          : this.formItemData.formItemValue.split(",");

      //处理组织 和 用户
      let orgAndUserArr = this.orgRoleUserData.orgUserDatas;
      for (let i in orgAndUserArr) {
        this.recursionOrgAndUser(orgAndUserArr[i], orgAndRole);
      }
      //处理角色
      let roleArr = this.orgRoleUserData.roleDatas;
      for (let i in roleArr) {
        this.recursionRole(roleArr[i], orgAndRole);
      }
    },
    recursionOrgAndUser(orgAndUser, orgAndRole) {
      if (orgAndRole.indexOf(orgAndUser.id) >= 0) {
        this.items.push({
          key: orgAndUser.text,
          value: orgAndUser.id,
          level: "info"
        });
      }
      if (orgAndUser.users != undefined && orgAndUser.users.length >= 0) {
        for (let i in orgAndUser.users) {
          if (orgAndRole.indexOf(orgAndUser.users[i].cardUrl) >= 0) {
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
          this.recursionOrgAndUser(orgAndUser.children[i], orgAndRole);
        }
      }
    },
    recursionRole(role, orgAndRole) {
      if (orgAndRole.indexOf(role.roleInfoId) >= 0) {
        this.items.push({
          key: role.roleInfoName,
          value: role.roleInfoId,
          level: "success"
        });
      }
    },
    urlParse(url) {
      let obj = {}; // 创建一个Object
      let reg = /[?&][^?&]+=[^?&]+/g; // 正则匹配 ?&开始 =拼接  非?&结束  的参数
      let arr = url.match(reg); // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
      if (arr) {
        arr.forEach(item => {
          /**
           * tempArr数组    ['id','12345']和['a','b']
           * 第一个是key，第二个是value
           * */
          let tempArr = item.substring(1).split("=");
          let key = decodeURIComponent(tempArr[0]);
          let val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
        });
      }
      return obj;
    },
    uploadAnnex() {
      fileUploader.prepareUpload.bind(this)();
    },
    initPCUploader(companyId) {
      let _this = this;
      let url = "/zingbiz/common/UploadFile/uploadFile.action";
      if (!Z_IsEmpty20(companyId)) {
        url += "?companyId=" + companyId;
      }
      Uploader.init({
        uploaderServer: url,
        folderPath: "",
        imageOnly: true,
        onUploadStart: function(isError, refs) {},
        onMessage: function(msg, refs) {},
        onServerFailed: function(msg, refs) {},
        onServerSuccess: function(PCdata, refs) {
          if (PCdata.success) {
            _this.annexArr.push(PCdata.data);
            _this.formItemData.formItemValue = JSON.stringify(_this.annexArr);
          }
        }
      });
    },
    fileUploader(companyId) {
      let _this = this;
      let url = "/zingbiz/common/UploadFile/uploadFile.action";
      if (!Z_IsEmpty20(companyId)) {
        url += "?companyId=" + companyId;
      }
      fileUploader.init({
        uploaderServer: url,
        folderPath: "",
        imageOnly: false,
        onUploadStart: function(isError, refs) {},
        onMessage: function(msg, refs) {},
        onServerFailed: function(msg, refs) {},
        onServerSuccess: function(Filedata, refs) {
          if (Filedata.success) {
            _this.annexArr.push(Filedata.data);
            _this.formItemData.formItemValue = JSON.stringify(_this.annexArr);
          }
        }
      });
    }
  }
};
</script>
<style>
  /* 全局样式不知道为什么要定义vux-popup-dialog 影响到此页面正常显示 */
  body .vux-popup-dialog {
    position:fixed !important;
  }
</style>
<style lang="stylus" scoped>
.formFontSize {
  font-size: 16px !important;
}

.otherCell {
  padding: 0px !important;
  margin-top: 10px;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.weui-cell:before {
  border-top: 0px !important;
}

.voice-inner {
  height: 50px;
  width: 98%;
  line-height: 100%;
  border: 1px solid #E0E0E2;
  border-radius: 5px;
  flex-center(, center);
  font-size: 0.875rem;
  margin: 0 auto;
}

.weui-form-preview__item {
  overflow: hidden;
}

.weui-form-preview__label {
  float: left;
  margin-right: 1em;
  min-width: 4em;
  color: #999999;
  text-align: justify;
  text-align-last: justify;
}

.weui-form-preview__value {
  display: block;
  overflow: hidden;
  word-break: normal;
  word-wrap: break-word;
}

.recording-voice {
  .voice-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 110px;
  }

  .voice-icon {
    width: 55px;
    height: 90px;
    background: url('/static/images/recording-bkg.png') no-repeat center center;
    background-size: contain;
  }

  .voice-volume {
    width: 30px;
    height: 55px;
    margin-left: 6px;

    span {
      display: block;
      height: 2px;
      margin-top: 4px;
      float: left;
      clear: both;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-duration: 2000ms;
      background-color: #e4e4e5;

      &:nth-child(1) {
        width: 24px;
        visibility: hidden;
      }

      &:nth-child(2) {
        width: 22px;
      }

      &:nth-child(3) {
        width: 20px;
      }

      &:nth-child(4) {
        width: 18px;
      }

      &:nth-child(5) {
        width: 16px;
      }

      &:nth-child(6) {
        width: 14px;
      }

      &:nth-child(7) {
        width: 12px;
      }

      &:nth-child(8) {
        width: 10px;
      }

      &:nth-child(9) {
        width: 8px;
      }
    }
  }
}

.recording-cancel {
  p {
    border-radius: 6px;
    background-color: #9d383e;
  }

  .cancel-inner {
    width: 110px;
    height: 110px;
    margin: 0 auto;
    background-image: url('/static/images/record-cancel.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
}

.chat-voice-ico {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: 16px 16px;
  vertical-align: middle;
  background-image: url('../../../assets/img/mbvoice.png');

  &.reverse {
    background-image: url('../../../assets/img/mbvoice-reverse.png');
    margin-right: 12px;
    margin-left: 16px;
  }
}

.playing~.chat-voice-ico {
  background-image: url('../../../assets/img/mbvoice.gif');

  &.reverse {
    background-image: url('../../../assets/img/mbvoice-reverse.gif');
  }
}
</style>
