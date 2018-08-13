<template>
  <div class="goodsAddOrUpdate">
    <zing-head class="popup-head" :title="headTitle" :isComeBack="isComeBack" @doSome="goodsAddOrUpdateBack"></zing-head>

    <group class="form">
      <image-picker 
        :files="files" 
        :companyId="companyId" 
        :multiple="false"
        :selectable="files.length < 1"
        @onChange="fliesChange">
      </image-picker>
      <cell title="物品编码" v-model="subParams.productCode" class="cell-first"></cell>
      <cell title="业务描述">
        <span class="select" @click="togglePicker">
          <pre v-if="!subParams.productProjectDesc">请选择业务描述</pre>
          <pre v-else-if="subParams.productProjectDesc">{{subParams.productProjectDesc}}</pre>
        </span>
      </cell>

      <cell title="科目代码">
        <span class="select" @click="togglePicker">
          <pre v-if="!subParams.productProjectCode">请选择科目代码</pre>
          <pre v-else-if="subParams.productProjectCode">{{subParams.productProjectCode}}</pre>
        </span>
      </cell>

      <cell title="科目名称">
        <span class="select" @click="togglePicker">
          <pre v-if="!subParams.productProjectName">请选择科目名称</pre>
          <pre v-else-if="subParams.productProjectName">{{subParams.productProjectName}}</pre>
        </span>
      </cell>

      <x-input v-model="subParams.productName" title="物品名称<i style='color:red'>*</i>" placeholder="请输入物品名称"></x-input>

      <x-input v-model="subParams.productUnit" ref="productUnit" title="计量单位<i style='color:red'>*</i>" placeholder="请输入计量单位"></x-input>
      <x-input title="销售单价" placeholder="请输入销售单价" v-model="subParams.xsPrice"></x-input>
      <x-input title="品牌" placeholder="请输入品牌" v-model="subParams.productBrand"></x-input>
      <x-input title="规格" placeholder="请输入规格" v-model="subParams.productProp"></x-input>
      <x-input title="产地" placeholder="请输入产地" v-model="subParams.productArea"></x-input>
      <x-textarea title="备注" placeholder="请填写备注信息" :show-counter="false" :rows="2" v-model="subParams.productRemark"></x-textarea>

      <x-button @click.native="save" style="margin-bottom:15px" type="primary" class="btn-common">保存</x-button>
    </group>

    <subject-picker :showPicker="showPicker" @picked="onPicked" @abort="onPickAbort"></subject-picker>
  </div>
</template>

<script>
import {
  Popup,
  //        TransferDomDirective as TransferDom,
  XDialog,
  XInput,
  XButton,
  Group,
  GroupTitle,
  Cell,
  Selector,
  XTextarea
} from "vux";
import GridCard from "components/gridcard/GridCard";
import ZingHead from "components/zingHead/ZingHead";
import Scroll from "components/scroll/Scroll";
import ImagePicker from "components/imagepicker/ImagePicker.vue";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
//    import { mapState, mapActions/*, mapMutations*/ } from 'vuex'

export default {
  name: "goodsAddOrUpdate1",
  components: {
    XDialog,
    XInput,
    XButton,
    Group,
    GroupTitle,
    Cell,
    Selector,
    XTextarea,
    ZingHead,
    Scroll,
    ImagePicker,
    SubjectPicker
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isComeBack: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    routing: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      files: [],
      output1: "",
      output2: "",
      output3: "",
      showPicker: false,
      pageStatus: "A",
      subParams: {
        rowId: "",
        productProjectPath: "",
        productCode: "",
        productProjectDesc: "",
        productProjectCode: "",
        productProjectName: "",
        productName: "",
        productAvgPrice: "",
        xsPrice: "",
        productUnit: "",
        productBrand: "",
        productProp: "",
        productArea: "",
        productRemark: "",
        productImgs: ""
      }
    };
  },
  computed: {
    headTitle() {
      if ("A" === this.pageStatus) {
        return "新建物品";
      } else {
        return "修改物品";
      }
    },
    companyId() {
      if (this.routing !== "") {
        return this.routing;
      } else {
        return this.$route.query.companyId;
      }
    }
  },
  created() {
    if (!this.isReferenced) {
      this.pageStatus = this.$route.query.pageStatus;
    }
    if ("A" !== this.pageStatus) {
      this.loadGoodsData();
    }
  },
  methods: {
    goodsAddOrUpdateBack() {
      this.$emit("goodsAddOrUpdateBack");
    },
    onPicked(item) {
      console.log(item);
      this.showPicker = false;
      this.subParams.productProjectDesc = item.description;
      this.subParams.productProjectCode = item.fileId;
      this.subParams.productProjectName = item.filename;
    },
    fliesChange(files, operationType, index) {
      console.log("filesChange", files);
      if (operationType === "add") {
        this.files = files;
        // todo 目前是一张图片
        this.subParams.productImgs = this.files[0].url;
      }
      if (operationType === "remove") {
        this.files = this.files.filter((item, i) => i !== index);
        //如果是原图片，请求后台删除
      }
    },
    popupBackClick() {
      this.saveOrAbortClearup();
    },
    saveOrAbortClearup() {
      this.subParams.rowId = "";
      this.subParams.productProjectPath = "";
      this.subParams.productCode = "";
      this.subParams.productProjectDesc = "";
      this.subParams.productProjectCode = "";
      this.subParams.productProjectName = "";
      this.subParams.productName = "";
      this.subParams.productAvgPrice = "";
      this.subParams.xsPrice = "";
      this.subParams.productUnit = "";
      this.subParams.productBrand = "";
      this.subParams.productProp = "";
      this.subParams.productArea = "";
      this.subParams.productRemark = "";
      this.subParams.productImgs = "";

      this.files = [];
    },
    togglePicker() {
      this.showPicker = true;
      this.flag = 1;
    },
    save() {
      if (this.subParams.productImgs === "") {
        this.$vux.toast.text("请上传图片!");
        return;
      } else if (this.subParams.productProjectCode === "") {
        this.$vux.toast.text("请选择科目");
        return;
      } else if (this.subParams.productName === "") {
        this.$vux.toast.text("物品名称不能为空!");
        return;
      } else if (this.subParams.productUnit === "") {
        this.$vux.toast.text("计量单位不能为空!");
        return;
      }
      let params = this.subParams;
      params.productType = "WP";

      let url = "/zingbiz/resourceLibrary/product/insert";
      if ("A" !== this.pageStatus) {
        url = "/zingbiz/resourceLibrary/product/update";
      }

      this.$http.post(url, this.subParams).then(response => {
        if (response.data.success) {
          if (this.isReferenced) {
            this.$vux.toast.show({ text: "提交成功!" });
            this.$emit("goodsAddSuccessCall");
            this.saveOrAbortClearup();
          } else {
            this.$router.back(-1);
          }
        }
      });
    },
    loadGoodsData() {
      console.info("loadGoodsData");
      let _this = this;
      let params = {
        rowId: this.$route.query.rowId
      };
      let url = "/zingbiz/resourceLibrary/product/getOneProductByRowId";

      this.$http
        .get(url, { params: params })
        .then(res => {
          _this.subParams = res.data.data;
          _this.files = [{ url: _this.subParams.productImgs }];
        })
        .catch(err => {
          console.log(err);
        });
    },
    onPickAbort() {
      this.showPicker = false;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '/../../../assets/stylus/unify.styl';

.goodsAddOrUpdate {
  height: 100%;
  
  .form {
    height: calc(100% - 50px);
    overflow: auto;
    .btn-common {
      margin-bottom: 0 !important;
    }
  }
}
</style>