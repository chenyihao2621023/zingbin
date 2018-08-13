<template>
  <div class="locationAddOrUpdate">
    <zing-head v-if="storehouse=='add'" title="新建库位"></zing-head>
    <zing-head v-else-if="storehouse=='edit'" title="修改库位"></zing-head>
    <div class="content">
      <group>
        <image-picker :files="files" :companyId="companyId" selectable multiple @onChange="fliesChange"></image-picker>
        <cell v-if="storehouse=='add'" title="库位编码" value="不可填写，提交时自动生成"></cell>
        <cell v-else-if="storehouse=='edit'" title="库位编码" :value="subParams.ckLocationCode"></cell>

        <cell v-if="storehouse=='add'" title="库位条码" value="提交时会生成对应条码"></cell>
        <cell v-else-if="storehouse=='edit'" title="库位条码">
          <img :src="subParams.ckLocationBarCode" alt="">
        </cell>

        <x-input class="libraryName" required title="库位名称<i style='color:red'>*<i>" placeholder="请输入库位名称" v-model="subParams.ckLocationName"></x-input>

        <x-textarea v-model="subParams.ckLocationDesc" title="库位描述" placeholder="请输入库位描述" :show-counter="false" :rows="3"></x-textarea>
      </group>
    </div>
    <x-button class="btn-common" type="primary" @click.native="sub">提交</x-button>
  </div>
</template>
<script>
import { XButton, Alert, Group, Cell, XInput, XTextarea } from "vux";
import ImagePicker from "components/imagepicker/ImagePicker.vue";
import ZingHead from "components/zingHead/ZingHead.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    XButton,
    ImagePicker,
    Alert,
    ZingHead,
    Group,
    Cell,
    XInput,
    XTextarea
  },
  data() {
    return {
      files: [],
      libraryName: "",
      companyId: this.$route.query.companyId,
      rowId: this.$route.query.rowId,
      subParams: {
        ckLocationCode: "",
        ckLocationName: "",
        ckLocationDesc: "",
        ckLocationBarCode: "",
        rowId: this.$route.query.rowId,
        ckLocationImg: "",
        ckId: this.$route.query.ckId,
        condition: ""
      }
    };
  },
  computed: {
    storehouse() {
      return this.$route.query.storehouse;
    }
  },
  created() {
    /*const ckParams = {
                  rowId: this.$route.query.rowId,
              };*/
    if (this.storehouse === "edit") {
      //                debugger
      //如果是编辑进来的,去请求后台接口初始化数据
      const ckParams = {
        rowId: this.$route.query.rowId
      };
      let url = "/zingbiz/resourceLibrary/location/selectByRowId";
      this.$http
        .get(url, {
          params: ckParams
        })
        .then(res => {
          this.subParams.ckLocationCode = res.data.data.ckLocationCode;
          this.subParams.ckLocationName = res.data.data.ckLocationName;
          this.subParams.ckLocationDesc = res.data.data.ckLocationDesc;
          this.subParams.ckLocationBarCode = res.data.data.ckLocationBarCode;
          if (res.data.data.ckLocationImg) {
            res.data.data.ckLocationImg.split(" ").forEach(element => {
              this.files.push({ url: element });
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    sub() {
      if (this.subParams.ckLocationName === "") {
        this.$vux.toast.text("物品名称不能为空!");
        return;
      }
      this.files = this.files.map(item => item.url);

      this.subParams.ckLocationImg = this.files.join(" ");

      let params = this.subParams;
      if (this.storehouse === "edit") {
        params.rowId = this.$route.query.rowId;
        this.updataCKLocation(params);
      } else {
        this.addCKLocation(params);
      }
    },
    addCKLocation: function(params) {
      let _this = this;
      // 添加或者编辑库位
      let url = "/zingbiz/resourceLibrary/location/insertLocation";
      this.$http
        .post(url, params)
        .then(res => {
          this.$router.back(-1);
        })
        .catch(err => {
          console.log(err);
        });
    },
    updataCKLocation: function(params) {
      let _this = this;
      // 添加或者编辑库位
      let url = "/zingbiz/resourceLibrary/location/updateLocation";
      this.$http
        .post(url, params)
        .then(res => {
          this.$router.back(-1);
        })
        .catch(err => {
          console.log(err);
        });
    },
    fliesChange(files, operationType, index) {
      if (operationType === "add") {
        this.files = files;
      }
      if (operationType === "remove") {
        this.files = this.files.filter((item, i) => i !== index);
      }
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';
@import '~assets/stylus/unify.styl';

.locationAddOrUpdate {
  height: 100%;

  .content {
    height: calc(100% - 94px);

    .weui-cells {
      margin-top: 0px;
    }
  }
}
</style>