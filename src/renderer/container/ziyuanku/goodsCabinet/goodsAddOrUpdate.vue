<template>
  <div class="goodsAddOrUpdate">
    <ZingHead title="新建物品">
    </ZingHead>
    <div class="content">
      <group label-width="4.5em" style="width:100%">
        <image-picker :files="files" :companyId="companyId" selectable multiple @onChange="imgOkCallback" @onImageClick="onImageClick" />
        <x-input title="编号" v-model="goodsFrom.productCode" readonly></x-input>
        <x-input title="名称" type="text" v-model="goodsFrom.productName" placeholder="请输入物品名称"></x-input>
        <x-input title="持有人" v-model="holderUser" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <datetime title="创建日期" v-model="goodsFrom.createDate" readonly></datetime>
        <datetime title="有效日期" v-model="goodsFrom.validDate" :start-date="startDate" placeholder="请选择日期"></datetime>
        <x-textarea title="备注" :max="200" v-model="goodsFrom.productRemark"></x-textarea>
      </group>
    
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button type="primary btn-save" @click.native="saveBtn">保存</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn btn-common" @click.native="submitBtn">提交</x-button>
        </flexbox-item>
      </flexbox> 
    </div>
  </div>
</template>


<script>
import {
  XHeader,
  XInput,
  XTextarea,
  Group,
  XButton,
  Cell,
  Flexbox,
  FlexboxItem,
  Datetime,
  Alert
} from "vux";
import ImagePicker from "@/components/imagepicker/ImagePicker";
import ZingHead from "@/components/zingHead/ZingHead";
import { dateFormat, Z_BuildDate } from "@/utils/date";

export default {
  name: "goodsAddOrUpdate2",
  components: {
    XHeader,
    XInput,
    XTextarea,
    XButton,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    Datetime,
    ImagePicker,
    ZingHead,
    Alert
  },
  data() {
    return {
      holderUser: "", //持有人
      ownerUser: "", //拥有人
      files: [], //图片资源
      multiple: true, //多选
      startDate: "",
      goodsFrom: {
        ckId: "",
        createDate: "",
        holderUser: "",
        isPass: "", //保存-false,提交-true
        ownerUser: "",
        productCode: "",
        productFile: "",
        productImgs: "",
        productName: "",
        productRemark: "",
        productType: "WPG",
        validDate: ""
      }
    };
  },
  computed: {
    companyId() {
      return this.$route.query.companyId;
    },
    pageStatus() {
      return this.$route.query.pageStatus;
    }
  },
  created: function() {
    console.log("addGoods    添加物品请求开始");
    this.goodsFrom.ckId = this.$route.query.ckId;
    if ("A" !== this.pageStatus) {
      this.loadGoodsData();
    } else {
      this.getCodeData(); //获取物品编码
    }
  },
  methods: {
    dateFormat,
    Z_BuildDate,
    imgUpLoad() {
      alert("上传图片");
    },
    saveBtn() {
      this.goodsFrom.isPass = "false";
      this.saveFormData("保存");
    },
    submitBtn() {
      this.goodsFrom.isPass = "true";
      this.saveFormData("提交");
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
          this.goodsFrom = res.data.data;
          this.holderUser = _this.goodsFrom.holderUser.split("-")[1];
          this.ownerUser = _this.goodsFrom.ownerUser.split("-")[1];
          this.files = [{ url: _this.goodsFrom.productImgs }];

          this.startDate =
            this.goodsFrom.createDate.length === 8
              ? dateFormat(
                  Z_BuildDate(this.goodsFrom.createDate, "yyyyMMdd"),
                  "yyyy-MM-dd"
                )
              : this.goodsFrom.createDate;
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveFormData(mess) {
      let _this = this;
      if (this.goodsFrom.productImgs === "") {
        this.$vux.toast.show({ text: "请上传图片!", type: "warn" });
        return;
      } else if (this.goodsFrom.productName === "") {
        this.$vux.toast.text("物品名称不能为空!");
        return;
      } else if (this.goodsFrom.validDate === "") {
        this.$vux.toast.text("有效日期不能为空!");
        return;
      }
      let url = "/zingbiz/resourceLibrary/product/insert";
      if (this.pageStatus === "U") {
        url = "/zingbiz/resourceLibrary/product/update";
      }
      this.$http
        .post(url, this.goodsFrom)
        .then(res => {
          this.$vux.toast.show({
            text: mess + "成功！",
            type: "success",
            onHide() {
              _this.$router.back(-1);
            }
          });
        })
        .catch(err => {
          this.$vux.toast.show({ text: "请上传图片!", type: "cancel" });
          console.error(err);
        });
    },
    enclosureUpload() {
      alert("上传附件");
    },
    imgOkCallback(files, operationType, index) {
      this.files = files;
      let imgArr = [];
      files.forEach(function(obj) {
        imgArr.push(obj.url);
      });
      this.goodsFrom.productImgs = imgArr.join(" ");
    },
    onImageClick(index, files) {},
    getCodeData() {
      let url = "/zingbiz/resourceLibrary/product/getProductCode";
      this.$http
        .get(url, {
          params: {
            ckId: this.goodsFrom.ckId,
            productType: "WPG"
          }
        })
        .then(res => {
          if (!res.data.success) {
            console.error("getAllProduct error", res);
            return;
          }

          let retDate = res.data.data;
          this.goodsFrom.createDate = retDate.date;
          this.goodsFrom.productCode = retDate.productCode;
          this.goodsFrom.holderUser = retDate.user;
          this.goodsFrom.ownerUser = retDate.user;
          this.holderUser = retDate.user.split("-")[1];
          this.ownerUser = retDate.user.split("-")[1];

          console.info(this.goodsFrom.createDate.length === 8);
          this.startDate =
            this.goodsFrom.createDate.length === 8
              ? dateFormat(
                  Z_BuildDate(this.goodsFrom.createDate, "yyyyMMdd"),
                  "yyyy-MM-dd"
                )
              : this.goodsFrom.createDate;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';
@import '~assets/stylus/unify.styl';

.goodsAddOrUpdate {
  height: 100%;

  .content {
    flex-center(column, space-between, center);
    height: calc(100% - 50px);
    overflow: auto;
    background: #fbf9fe;

    &::-webkit-scrollbar {
      display: none;
    }

    .weui-cells {
      margin-top: 0px;
    }
  }
}
</style>