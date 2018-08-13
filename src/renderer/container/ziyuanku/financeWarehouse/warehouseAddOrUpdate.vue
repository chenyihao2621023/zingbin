<template>
  <div id="financeWarehouseAddOrUpdate" class="financeWarehouseAddOrUpdate">
    <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
    <zing-head :isShowQuery="false" :title="headTitle">
      <div slot="left">
      </div>
    </zing-head>
    <div class="content" :style="{ height: screenHeight + 'px'}">
      <group label-width="8em">
        <x-input title="财务库名称" v-model="ckName" placeholder="请输入财务库名称"></x-input>

        <x-textarea title="财务库描述" v-model="ckDesc" placeholder="请输入财务库描述"></x-textarea>

        <x-input title="财务库类型" :disabled="true" value="财务库" placeholder="请输入财务库名称"></x-input>

        <cell title="参与者" @click.native="selectInputPerson()" placeholder="点击添加参与者">
          <div>
            <tag-group :items="items" @onChange="tagChanged" style="text-align:right"></tag-group>
          </div>
        </cell>
        
        <x-switch title="是否绑定唯一科目" v-model="isOnlyProject"></x-switch>
        <!-- <check-icon :value.sync="isOnlyProject" v-model="isOnlyProject" class="projectClass" :style="{ padding: '10px 15px'}">绑定唯一科目</check-icon> -->

        <x-input title="科目代码" v-model="ckProjectId" @click.native="selectPickedDialog()" readonly placeholder="请选择科目代码"></x-input>

        <x-input title="科目名称" v-model="ckProjectName" @click.native="selectPickedDialog()" readonly placeholder="请选择科目名称"></x-input>

        <x-input title="财务库地址" v-model="address" placeholder="请选择财务库地址"></x-input>

        <cell title="财务库图标" v-model="zykIcon">
          <div class="zykIcon">
            <i :class="['iconfont', `icon-${zykIcon}`, zykIconBgColor]" @click="selectIocn()" :style="{ 'background-color': zykIconBgColor}"></i>
          </div>
        </cell>
        <!--<template v-if="ckType === 'WP' || ckType === 'CW'">
                    <group title="财务库图标">
                        <div class="zykIcon" v-model="zykIcon">
                            <i :class="['iconfont', `icon-${zykIcon}`, zykIconBgColor]" @click="selectIocn()"></i>
                        </div>
                    </group>
                </template>-->
      </group>
      <!-- 选择图标组件 -->
      <iconPicker :icon-picker-show="dialogIcon" :iconData="['benbanzushengchandingdanguanli', 'canting', 'jiudian', 'shangpu', 'caigou-tianchong', 'xiaoshougendanguanli', 'salesinvoice',
                    'shenpi1', 'tuihuo', '02', 'shichang', 'renzhengziliao', 'baocun-tianchong', 'baobiao-selected', 'renwu', 'xiaolaba', 'caiwu', 'fabubiaoshu', 'cardb', 'weibiaoti4']" :bg-color="bgColor" :mask-z-index="8000" :dialog-z-index="10000"
        @cancel="iconPickerCancel" @close="iconPickerClose" @confirm="iconPickerConfirm" />

      <!-- 科目 -->
      <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>

      <!-- 选人组件 -->
      <org-member-picker ref="picker" :initialSelected="insertNew" :showPicker="showPersonPicker" @picked="onPicked" @abort="onPickAbort"></org-member-picker>

    </div>
    <x-button class="btn-common" type="primary"  action-type="button" @click.native="addOrUpdate()">确认提交</x-button>
  </div>
</template>

<script>
import {
  Cell,
  ConfirmPlugin,
  XTextarea,
  XInput,
  Group,
  XButton,
  Selector,
  XHeader,
  XSwitch
} from "vux";
import iconPicker from "@/components/iconpicker/IconPicker";
import ZingHead from "@/components/zingHead/ZingHead";
import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import TagGroup from "@/components/taggroup/TagGroup";

export default {
  name: "financeWarehouseAddOrUpdate",
  components: {
    TagGroup,
    Cell,
    OrgMemberPicker,
    SubjectPicker,
    ZingHead,
    iconPicker,
    ConfirmPlugin,
    XTextarea,
    Group,
    XInput,
    Selector,
    XHeader,
    XButton,
    XSwitch
  },
  data() {
    return {
      headTitle: "新建财务库",
      screenHeight: "0px",
      dialogIcon: false,
      bgColor: "",
      zykIconBgColor: "",
      showPicker: false,
      showPersonPicker: false,
      ckOutMethodlist: [
        { key: "hand", value: "手动出库" },
        { key: "auto", value: "自动出库" }
      ],
      /*items: [{ key: '澹个澹', value: '77457459000000101' }],*/
      items: [],
      insertNew: [],
      oldCkName: "",
      createTime: "",

      ckName: "",
      ckDesc: "",
      ckType: "",
      ckProp: "",
      ckOutMethod: "",
      ckProjectId: "",
      ckProjectName: "",
      address: "",
      isOnlyProject: false,
      zykIcon: "tianjia1"
    };
  },
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 96;
    if (this.$route.query.pageStatus === "U") {
      this.selectOneCkInfo();
      this.headTitle = "修改仓库";
    }
  },
  methods: {
    addOrUpdate() {
      let self = this;
      /*let url = "/zingbiz/pingzheng/ckInfo/insertCkInfo";*/
      let params = {
        ckImg: self.zykIcon,
        ckDesc: self.ckDesc,
        ckType: self.ckType,
        address: self.address,
        isOnlyProject: self.isOnlyProject,
        ckOutMethod: self.ckOutMethod,
        ckProjectId: self.ckProjectId,
        ckProjectName: self.ckProjectName,
        participantId_Name: self.items
          .map(function(item) {
            let ret = item.value + "-" + item.key;
            ret += "-" + self.$refs.picker.getType(item.level);
            return ret;
          })
          .join(" "),
        participantId: self.items
          .map(function(item) {
            return item.value;
          })
          .join(" ")
      };
      if (self.ckName === "") {
        /*self.$message({ type: "error", message: "财务库名称不能为空" });*/
        self.$vux.toast.text("财务库名称不能为空!");
        return;
      }

      if (self.ckDesc !== "" && params.ckDesc.length > 300) {
        self.$vux.toast.text("描述过长，请控制在300字以内!");
        return;
      }

      //兼容旧数据
      params.ckType = "CW";
      params.ckProp = self.ckProp;
      params.ckOutMethod = self.ckOutMethod;

      if (self.ckProjectId === "") {
        self.$vux.toast.text("请选择科目代码");
        return;
      }

      if (self.ckImg === "") {
        self.$vux.toast.text("请选择财务库图标");
        return;
      }

      let pageStatus = self.$route.query.pageStatus;

      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/insert";
      if (pageStatus === "U") {
        if (self.oldCkName !== self.ckName) {
          params.ckName = self.ckName;
        }
        params.rowId = self.$route.query.rowId;
        /*params.rowId = "78085145000000101";*/
        params.createTime = self.createTime;
        url = "/zingbiz/resourceLibrary/resourceLibraryInfo/update";
      } else {
        params.ckName = self.ckName;
      }
      this.$http.post(url, params).then(res => {
        self.$vux.toast.text(res.data.msg);
        if (res.data.success === true) {
          this.$router.back(-1);
        } else {
          if (res.data.msg === "-2") {
            self.$vux.toast.text("财务库名称已存在");
          } else {
            self.$vux.toast.text("保存失败!");
          }
        }
      });
    },
    selectOneCkInfo() {
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/selectByRowId";
      this.$http
        .get(url, {
          params: {
            rowId: this.$route.query.rowId
          }
        })
        .then(res => {
          if (res.data.success === true) {
            let ckInfoData = res.data.data;
            this.ckName = ckInfoData.ckName;
            this.oldCkName = ckInfoData.ckName;
            this.ckDesc = ckInfoData.ckDesc;
            this.ckType = ckInfoData.ckType;
            this.ckProp = ckInfoData.ckProp;
            this.ckOutMethod = ckInfoData.ckOutMethod;
            if (typeof ckInfoData.participantId_Name === "string") {
              this.items = ckInfoData.participantId_Name
                .split(" ")
                .map(item => {
                  let map = {};
                  let userMsg = item.split("-");
                  if (userMsg.length > 1) {
                    map.level = this.$refs.picker.getLevel(
                      userMsg[userMsg.length - 1]
                    );
                    map.key = userMsg.slice(1, userMsg.length - 1).join("-");
                    map.value = userMsg[0];
                    map.type = userMsg[userMsg.length - 1];
                  }
                  return map;
                });
            }

            this.ckProjectId = ckInfoData.ckProjectId;
            this.ckProjectName = ckInfoData.ckProjectName;
            this.address = ckInfoData.address;
            this.zykIcon = ckInfoData.ckImg;
            this.createTime = ckInfoData.createTime;
            if (ckInfoData.isOnlyProject === "true") {
              this.isOnlyProject = true;
            }
          } else {
            this.$vux.toast.text("数据错误");
          }
        });
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
    },
    onPickAbort() {
      this.showPersonPicker = false;
    },
    selectPickedDialog() {
      this.showPicker = true;
    },
    getPickedData(pickedData) {
      this.ckProjectId = pickedData.fileId;
      this.ckProjectName = pickedData.filename;
      this.showPicker = false;
    },
    subjectAbort() {
      this.showPicker = false;
    },
    selectIocn() {
      this.bgColor = "#F5EB2B";
      this.dialogIcon = true;
    },
    iconPickerConfirm(data) {
      this.dialogIcon = false;
      this.zykIcon = data;
      this.zykIconBgColor = "wp";
    },
    iconPickerClose() {
      this.dialogIcon = false;
    },
    iconPickerCancel() {
      this.dialogIcon = false;
    },
    tagChanged(arr) {
      //this.items = arr;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/unify.styl';

.financeWarehouseAddOrUpdate {
  .content {
    overflow-y: auto;
    height: calc(100% - 95px);

    .zykIcon {
      text-align: center;

      .iconfont {
        font-size: 50px;
        border-radius: 4px;
        color: white;
        background-color: #F5EB2B;
      }

      .iconfont.wp {
        background-color: #F5EB2B;
      }

      .iconfont.cw {
        background-color: yellow;
      }
    }
  }

  .projectClass:before {
    content: ' ';
    position: absolute;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(217, 217, 217);
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }

  .projectClass {
    position: relative;
    width: 100%;
  }
}
</style>