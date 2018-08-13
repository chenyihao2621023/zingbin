<template>
    <div id="cabinet" class="financeSetting">
        <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
        <zing-head :isShowQuery="false" :title="headTitle">
            <div slot="left">
            </div>
        </zing-head>
        <!--<group title="所有凭证是否必须关联任务">-->
        <checklist class="content" title="所有财务凭证是否必须关联任务" :options="['是', '否']" v-model="withTrello"
                    :max="1"></checklist>
        <!--</group>-->
        <x-button class="btn-common" type="warn" action-type="button" @click.native="submitSetting()">提交</x-button>
    </div>
</template>

<script>
import { Checklist, Group, XButton, XHeader } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";

export default {
  name: "InsertOrUpdateCKInfo",
  components: {
    ZingHead,
    Checklist,
    Group,
    XHeader,
    XButton
  },
  data() {
    return {
      headTitle: "凭证设置",
      rowId: "",
      withTrello: [""]
    };
  },
  created: function() {
    this.getCKSetting();
  },
  methods: {
    getCKSetting() {
      let self = this;
      let url = "/zingbiz/resourceLibrary/setting/selectResourceLibrarySetting";
      let params = {
        settingType: "WITHTRELLO",
        ckType: "CW",
        companyId: this.$route.query.companyId
      };
      self.$http.get(url, { params: params }).then(res => {
        if (res.data.success && res.data.total > 0) {
          let infoData = res.data.data;
          self.rowId = infoData[0].rowId;
          if (infoData[0].withTrello === "true") {
            self.withTrello = ["是"];
          } else {
            self.withTrello = ["否"];
          }
        }
      });
    },
    submitSetting() {
      let self = this;
      let withTrello = "";
      if (self.withTrello[0] === "是") {
        withTrello = "true";
      } else if (self.withTrello[0] === "否") {
        withTrello = "false";
      }
      let params = {
        settingType: "WITHTRELLO",
        withTrello: withTrello,
        ckType: "CW",
        companyId: this.$route.query.companyId
      };
      let url = "/zingbiz/resourceLibrary/setting/insertResourceLibrarySetting";
      if (self.rowId != "") {
        url = "/zingbiz/resourceLibrary/setting/updateResourceLibrarySetting";
        params.rowId = self.rowId;
      }
      self.$http.post(url, params).then(res => {
        if (res.data.success === true) {
          self.$vux.toast.text("设置成功");
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/unify.styl';

.financeSetting {
  height: 100%;

  // background-color: #F8F8F8;
  .content {
    height: calc(100% - 94px);
  }

  .contentTitle .weui-cells__title {
    color: black;
    font-size: 16px;
  }
}
</style>
