<template>
  <div class="CabinetAddOrUpdate">
    <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
    <zing-head :isShowQuery="false" :title="headTitle">
      <div slot="left">
      </div>
    </zing-head>
    <div class="content">
      <group label-width="5.5em" style="width:100%">
        <x-input title="物品柜名称" v-model="ckName" placeholder="请输入物品柜名称"></x-input>

        <x-textarea title="物品柜描述" v-model="ckDesc" placeholder="请输入物品柜描述"></x-textarea>

        <x-input title="物品柜类型" v-model="ckTypeName" readonly></x-input>

        <cell value-align="right" title="参与者" @click.native="selectInputPerson()" placeholder="点击添加参与者，只有参与者能借出此柜中物品。">
          <div>
            <tag-group :items="items" @onChange="tagChanged"></tag-group>
          </div>
        </cell>

        <x-input title="物品柜地址" v-model="address" placeholder="请输入物品柜地址"></x-input>

        <cell value-align="right" title="物品柜图标" v-model="zykIcon">
          <div class="zykIcon">
            <i :class="['iconfont', `icon-${zykIcon}`]" @click="selectIocn()" :style="{ 'background-color': zykIconBgColor}"></i>
          </div>
        </cell>
      </group>
      <!-- 选择图标组件 -->
      <iconPicker :icon-picker-show="dialogIcon" :iconData="['benbanzushengchandingdanguanli', 'canting', 'jiudian', 'shangpu', 'caigou-tianchong', 'xiaoshougendanguanli', 'salesinvoice',
                    'shenpi1', 'tuihuo', '02', 'shichang', 'renzhengziliao', 'baocun-tianchong', 'baobiao-selected', 'renwu', 'xiaolaba', 'caiwu', 'fabubiaoshu', 'cardb', 'weibiaoti4']" :bg-color="'#18c34c'" :mask-z-index="8000" :dialog-z-index="10000"
        @cancel="iconPickerCancel" @close="iconPickerClose" @confirm="iconPickerConfirm" />
      <!-- 选人组件 :initialSelected=""-->
      <org-member-picker ref="picker" :initialSelected="insertNew" :initialSelectedType="'cardUrl'" :showPicker="showPicker" @picked="onPicked" @abort="onPickAbort"></org-member-picker>

      <x-button type="primary" action-type="button" @click.native="addOrUpdate()">确认提交</x-button>
    </div>
  </div>
</template>

<script>
import {
  Cell,
  XTextarea,
  XInput,
  Group,
  XButton,
  Selector,
  XHeader
} from "vux";
import iconPicker from "components/iconpicker/IconPicker";
import ZingHead from "@/components/zingHead/ZingHead";
import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
import TagGroup from "components/taggroup/TagGroup";

export default {
  name: "CabinetAddOrUpdate",
  components: {
    TagGroup,
    Cell,
    OrgMemberPicker,
    ZingHead,
    iconPicker,
    XTextarea,
    Group,
    XInput,
    Selector,
    XHeader,
    XButton
  },
  data() {
    return {
      headTitle: "新建物品柜",
      items: [],
      insertNew: [],
      dialogIcon: false,
      showPicker: false,
      zykIconBgColor: "rgb(24, 195, 76)",

      ckName: "",
      ckDesc: "",
      ckTypeName: "物品柜",
      address: "",
      zykIcon: "tianjia1"
    };
  },
  created: function() {
    if (this.$route.query.pageStatus === "U") {
      this.selectOneCkInfo();
      this.headTitle = "修改物品柜";
      console.log(this.$route.query.pageStatus);
    }
    /*this.selectOneCkInfo();*/
  },
  methods: {
    addOrUpdate() {
      let self = this;
      if (self.ckName === "") {
        /*self.$message({ type: "error", message: "物品柜名称不能为空" });*/
        self.$vux.toast.text("物品柜名称不能为空!");
        return;
      }
      if (self.ckImg === "") {
        self.$vux.toast.text("请选择物品柜图标!");
        return;
      }
      let params = {
        ckImg: self.zykIcon,
        ckDesc: self.ckDesc,
        address: self.address,
        ckType: "WPG",
        participantId_Name: self.items
          .map(item => {
            return (
              item.value +
              "-" +
              item.key +
              "-" +
              self.$refs.picker.getType(item.level)
            );
          })
          .join(" "),
        participantId: self.items
          .map(item => {
            return item.value;
          })
          .join(" ")
      };

      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/insert";
      let pageStatus = self.$route.query.pageStatus;
      if (pageStatus === "U") {
        params.check = "true";
        if (self.oldCkName !== self.ckName) {
          params.ckName = self.ckName;
        }
        params.rowId = self.$route.query.rowId;
        url = "/zingbiz/resourceLibrary/resourceLibraryInfo/update";
      } else {
        params.ckName = self.ckName;
      }
      this.$http.post(url, params).then(res => {
        if (res.data.success === true) {
          self.$vux.toast.text("保存成功!");
          self.$router.back(-1);
        } else {
          if (res.data.msg === "-2") {
            self.$vux.toast.text("物品柜名称已存在");
          } else {
            self.$vux.toast.text("保存失败!");
          }
        }
      });
    },
    selectOneCkInfo() {
      let self = this;
      let url = "/zingbiz/resourceLibrary/resourceLibraryInfo/selectByRowId";
      let params = { rowId: self.$route.query.rowId };
      this.$http
        .get(url, {
          params: {
            rowId: self.$route.query.rowId
          }
        })
        .then(res => {
          if (res.data.success === true) {
            let ckInfoData = res.data.data;
            self.ckName = ckInfoData.ckName;
            self.oldCkName = ckInfoData.ckName;
            self.ckDesc = ckInfoData.ckDesc;
            self.address = ckInfoData.address ? ckInfoData.address : "";
            self.zykIcon = ckInfoData.ckImg;
            if (typeof ckInfoData.participantId_Name === "string") {
              self.items = ckInfoData.participantId_Name
                .split(" ")
                .map(function(item) {
                  let map = {};
                  let userMsg = item.split("-");
                  if (userMsg.length > 1) {
                    map.level = self.$refs.picker.getLevel(
                      userMsg[userMsg.length - 1]
                    );
                    map.key = userMsg.slice(1, userMsg.length - 1).join("-");
                    map.value = userMsg[0];
                    map.type = userMsg[userMsg.length - 1];
                  }
                  return map;
                });
            }
          } else {
            self.$vux.toast.text("数据错误!");
          }
        });
    },
    selectInputPerson() {
      this.insertNew = this.items;
      this.flag = 1;
      this.showPicker = true;
    },
    onPicked(list) {
      this.showPicker = false;
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
      this.showPicker = false;
    },
    selectIocn() {
      this.dialogIcon = true;
    },
    iconPickerConfirm(data) {
      this.dialogIcon = false;
      this.zykIcon = data;
      this.zykIconBgColor = "#18c34c";
    },
    iconPickerClose() {
      this.dialogIcon = false;
    },
    tagChanged(arr) {},
    iconPickerCancel() {
      this.dialogIcon = false;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/unify.styl';
@import '~assets/stylus/mixin.styl';

.CabinetAddOrUpdate {
  height: 100%;

  .content {
    overflow-y: auto;
    height: calc(100% - 50px);
    flex-center(column, space-between, start);

    .zykIcon {
      text-align: center;

      .iconfont {
        font-size: 50px;
        border-radius: 4px;
        color: white;
      }
    }

    .weui-cells {
      .vux-x-input {
        .weui-cell__ft {
          padding: 0px;
        }
      }
    }
  }
}
</style>