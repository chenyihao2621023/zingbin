<template>
  <div class="goodsDetail">
    <div class="content">
      <image-picker :files="files" :companyId="companyId" selectable multiple @onChange="imgOkCallback" @onImageClick="onImageClick" />
      <group label-width="4.5em" label-margin-right="2em" style="width:100%">
        <x-input title="编号" v-model="goodsDetailFrom.productCode" readonly></x-input>
        <x-input title="名称" v-model="goodsDetailFrom.productName"></x-input>
        <x-input title="持有人" v-model="holderUser" readonly></x-input>
        <x-input title="拥有人" v-model="ownerUser" readonly></x-input>
        <datetime title="创建日期" v-model="goodsDetailFrom.createDate" @on-change="changeCreateDate"></datetime>
        <datetime title="有效日期" v-model="goodsDetailFrom.validDate" @on-change="changeValidDate"></datetime>
        <x-textarea title="备注" :max="200" name="description" v-model="goodsDetailFrom.productRemark"></x-textarea>
      </group>
    </div>
    <!--  <group title="附件">
                     <image-picker
                      :files = "files"
                      selectable
                      multiple
                      @onChange="imgOkCallback"
                    />

            </group> -->
    <group label-width="4.5em" label-margin-right="2em" style="width:100%">
      <div v-if="btnType == 1">
        <flexbox :gutter="0">
          <flexbox-item>
            <x-button type="primary btn-save" @click.native="submitBtn">编辑</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn btn-common" @click.native="delBtn">删除</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div v-else-if="btnType == 2">
        <flexbox>
          <flexbox-item>
            <x-button type="primary " @click.native="submitBtn">编辑</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div v-else-if="btnType == 3">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="toLQ" type="primary ">申请领用</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div v-else-if="btnType == 4">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="toTH" type="primary ">申请退还</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </group>
    <br>

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
  Datetime
} from "vux";
import Avatar from "@/components/avatar/Avatar";
import ImagePicker from "@/components/imagepicker/ImagePicker";

export default {
  name: "goodsDetail1",
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
    Avatar,
    ImagePicker
  },
  props: ["goodsRowId"],
  data() {
    return {
      screenHeight: "0px",
      //                files: [],
      goodsDetailFrom: {
        ckId: "",
        createDate: "",
        holderUser: "",
        isPass: "", //保存-false,提交-true
        ownerUser: "",
        productCode: "",
        productFile: "",
        roductImgs: "",
        productName: "",
        productRemark: "",
        productType: "WPG",
        rowId: "",
        validDate: ""
      },
      curCardUrl: "",
      companyId: "",
      holderUser: "",
      ownerUser: "",
      btnType: 0,
      //1  用户（持有人，拥有者 ）  保存 删除
      //2  用户（拥有者 ）  编辑
      //3  用户（）  申请领用
      //4  用户（持有人）  退还
      files: []
    };
  },
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 150;

    let self = this;
    let url1 = "/zingbiz/resourceLibrary/product/getOneProductByRowId";
    let url2 =
      "/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl";
    this.$http
      .all([
        this.$http.get(url1, { params: { rowId: this.goodsRowId } }),
        this.$http.post(url2, {})
      ])
      .then(
        this.$http.spread(function(ret1, ret2) {
          //处理数据
          self.dealData(ret1.data.data, ret2.data.data);
          //处理显示按钮
          self.initBtn(ret1.data.data, ret2.data.data);
        })
      );
  },
  methods: {
    changeCreateDate(value) {
      this.goodsDetailFrom.createDate = value;
    },
    changeValidDate(value) {
      this.goodsDetailFrom.validDate = value;
    },
    imgOkCallback(files, operationType, index) {
      this.files = files;
      let imgArr = [];
      files.forEach(function(obj) {
        imgArr.push(obj.url);
      });
      this.goodsDetailFrom.productImgs = imgArr.join(" ");
    },
    onImageClick(index, files) {},
    dealData(data1, data2) {
      this.goodsDetailFrom.productCode = data1.productCode;
      this.goodsDetailFrom.productName = data1.productName;
      this.goodsDetailFrom.holderUser = data1.holderUser;
      this.goodsDetailFrom.ownerUser = data1.ownerUser;
      this.goodsDetailFrom.createDate = data1.createDate;
      this.goodsDetailFrom.validDate = data1.validDate;
      this.goodsDetailFrom.productRemark = data1.productRemark;
      this.goodsDetailFrom.ckId = data1.ckId;
      this.goodsDetailFrom.rowId = data1.rowId;
      this.holderUser = data1.holderUser.split("-")[1];
      this.ownerUser = data1.ownerUser.split("-")[1];

      //处理图片数据
      let productImgsArr = data1.productImgs.split(" ");
      let _this = this;
      productImgsArr.forEach(function(url) {
        let obj = {};
        obj.url = url;
        _this.files.push(obj);
      });
      this.curCardUrl = data2.cardUrl;
      this.companyId = data2.companyId;
    },
    initBtn(data1, data2) {
      let holderUser = data1.holderUser;
      let ownerUser = data1.ownerUser;
      let curCardUrl = data2.cardUrl;
      if (holderUser.indexOf(curCardUrl) >= 0) {
        this.btnType = 4;
      } else {
        this.btnType = 3;
      }
      if (
        holderUser.indexOf(curCardUrl) >= 0 &&
        ownerUser.indexOf(curCardUrl) >= 0
      ) {
        this.btnType = 1;
      } else if (ownerUser.indexOf(curCardUrl) >= 0) {
        this.btnType = 2;
      }
    },
    submitBtn() {
      this.goodsDetailFrom.isPass = "true";
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/goodsAddOrUpdate",
        query: {
          rowId: this.$route.query.rowId,
          companyId: this.$route.query.companyId,
          pageStatus: "U"
        }
      });
    },
    delBtn() {
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "你确定要删除吗?",
        onCancel() {
          _this.$vux.confirm.hide();
        },
        onConfirm() {
          let url = "/zingbiz/resourceLibrary/product/delProduct";
          _this.$http
            .get(url, { params: { id: _this.goodsDetailFrom.rowId } })
            .then(res => {
              _this.$vux.toast.show({
                text: "删除成功！",
                type: "success",
                onHide() {
                  _this.$router.back(-1);
                }
              });
            });
        }
      });
    },
    toLQ() {
      //申请领用
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/receiveReturn",
        query: { goodsRowId: this.goodsRowId, pageType: "1" }
      });
    },
    toTH() {
      //退换
      this.$router.push({
        path: "/resourceLibrary/goodsCabinet/receiveReturn",
        query: { goodsRowId: this.goodsRowId, pageType: "2" }
      });
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/unify.styl';

.goodsDetail {
  height: 100%;
  width: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .content {
    height: calc(100% -60px);
    width: 100%;

    .weui-cells {
      margin-top: 0px;
    }
  }
}
</style>