<template>
  <div class="editing-Text">
    <div>
      <ZingHead :title="title" :isComeBack="true"></ZingHead>
    </div>
    <div class="main">
      <group>
        <x-input title="标题" required name="username" placeholder="请输入标题" v-model="formData.title"></x-input>
        <x-input title="作者" required name="username" placeholder="请输入作者" v-model="formData.author"></x-input>
        <x-input title="摘要" name="username" placeholder="请输入摘要" v-model="formData.abstracts"></x-input>
        <div class="thumb-img weui-cell">
          <span>添加封面</span>
          <span>
            <image-picker :files="imageList" :selectable="imageList.length<1" :multiple="false"
                          :companyId="companyId" @onChange="imageChange" :removable="false"/>
          </span>
        </div>
      </group>
      <w-editor :companyId="companyId" :editorData="editorData" @getEditorHtml="getEditorHtml"></w-editor>
    </div>
    <div class="btns">
      <x-button style="background-color: #40AFFC;" type="primary" @click.native="save('0',1)">保存</x-button>
      <x-button class="save-Publish" type="primary" @click.native.stop="save('1',1)">保存并发布</x-button>
    </div>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";
  import ImagePicker from '@/components/imagepicker/ImagePicker';
  import WEditor from '@/components/wangEditor/WEditor';
  import { XInput, XButton, XDialog, Group, } from 'vux'
  export default {
    name: "addGraphic",
    components: {
      ZingHead, XInput, XButton, ImagePicker, XDialog, Group,WEditor
    },
    data() {
      return {
        title: "图文消息",
        imageList: [],
        formData: {},
        companyId: "",
        parentId: '',       //父id
        detailsId: "",       //文章id
        menuId: "",
        type: "",         //0:图文 1:通知
        from: "",        //页面来源
        editorObj:"",    //文本编辑器的回传参数
        editorData:"",   //文本编辑器回显参数
      }
    },
    watch: {
      imageList: function () {
        this.coverUrl = this.imageList[0].url
      },
    },
    beforeRouteEnter(to, from, next) {
      console.log("from", from);
      next(vm => {
        vm.from = from.fullPath;
      })
    },
    created() {
      this.loadUserMsg();
      this.parseUrl();
      this.initData();        //需要先解析路由参数
    },
    methods: {
      parseUrl() {
        this.detailsId = this.$route.query.detailsId;
        this.parentId = this.$route.query.parentId;
        this.menuId = this.$route.query.menuId;
        this.type = this.$route.query.type;
        if (this.type === "0") {
          this.title = "图文消息"
        } else if (this.type === "1") {
          this.title = "发现通知"
        }
      },
      loadUserMsg() {
        let url = "/zingbiz/auth/user/getThisUserInfo";
        let vm = this;
        this.$http
          .post(url, {})
          .then(res => {
            vm.companyId = res.data.data.companyId;
          })
          .catch(err => {
            console.log(err);
          });
      },
      initData() {
        if (!this.detailsId) {
          return;
        }
        let vm = this;
        let url = "/zingbiz/tuwen/tuwenManage/getMenuDetailsById";
        vm.$http
          .get(url, { params: { detailsId: this.detailsId, companyId: "" }})
          .then(res => {
            if (res.data.success) {
              vm.editorData = res.data.data.textContent;
              vm.formData = res.data.data;
              vm.imageList = [{ url: res.data.data.coverUrl.replace(new RegExp("//"), "/") }]
            } else {
              console.log(res.data);
            }
          }).catch(error => {
          console.log(error);
        })
      },
      save(isRelease, text) {
        let vm = this;
        if (!this.formData.title) {
          vm.$vux.toast.text("请填写标题");
          return;
        }
        if (!this.formData.author) {
          vm.$vux.toast.text("请填写作者");
          return
        }
        if (!this.coverUrl) {
          vm.$vux.toast.text("请上传一张封面图片");
          return
        }
        if (!this.formData.abstracts) {
          this.formData.abstracts = "  "
        }
        let alertTitle = "";
        if (isRelease === "0") {
          alertTitle = "确定保存"
        } else {
          alertTitle = "确定保存并发布"
        }
        this.$vux.confirm.show({
          title: '提示',
          content: alertTitle,
          onConfirm() {
            vm.formData.isRelease = isRelease;
            vm.formData.coverUrl = vm.coverUrl;
            vm.formData.coverToTextContent = text;      //封面是否显示到正文
            if (vm.type) {
              vm.formData.noticeType = vm.type;         //类型
            }
            vm.formData.textContent = vm.editorObj;
            if (vm.parentId) {
              vm.formData.parentId = vm.parentId;
            }
            if (vm.menuId) {
              vm.formData.menuId = vm.menuId;
            }
            let url = '/zingbiz/tuwen/tuwenManage/saveMenuDetails';
            vm.$http
              .post(url, vm.formData)
              .then(res => {
                if (res.data.success) {
                  vm.$vux.toast.text("保存成功");
                  vm.jumpTo();
                } else {
                  vm.$vux.toast.text("保存失败");
                }
              }).catch(error => {
              console.log(error);
            })
          }
        })
      },
      imageChange(files, operationType, index) {
        this.imageList = files.length > 1 ? files.slice(1) : files;
      },
      jumpTo() {
        this.$router.push({
          path: this.from,
        })
      },
      getEditorHtml(data) {
        this.editorObj = data
      },
    }
  }
</script>
<style scoped lang="stylus">
  .editing-Text {
    display: flex;
    flex-direction: column;
    height: 100%;
    .main{
      height :100%;
      overflow-y :auto;
    }
    .thumb-img {
      display: block
    }
    .btns {
      height :50px;
      button {
        width: 50%;
        float :left;
        margin-top: 0;
      }
    }
  }
</style>
