<template>
  <div class="new-text-editor">
    <div v-show="showSave" class="toolbar"></div>
    <div class="wEditorP text" @click="clickEditor"></div>
  </div>
</template>

<script>
  //import {} from "vux";
  import WangEditor from '../../assets/js/wangEditor'
  import ImagePicker from 'components/imagepicker/ImagePicker';
  import { isPc, isWeiXin, isMhApp } from '@/utils/fn'
  import { mapState } from 'vuex'
  import NatAppHelper from "@/utils/nativeAppHelper";

  let editor

  export default {
    name: "WEditor",
    components: {
      WangEditor,
      ImagePicker,
    },
    props: {
      companyId: { //必须传，否则APP端图片回显有问题
        type: String,
        default: ""
      },
      editorData: { //编辑器默认值
        type: String,
        default: ""
      }
    },
    data: () => ({
      //搜索
      nativeAppHelper: NatAppHelper,
      isPc: isPc(),
      showSave: true,
    }),
    computed: {
      ...mapState({
        wxUploadImageStatus: state => state.wx.wxUploadImageStatus,
        wxUploadImage: state => state.wx.wxUploadImage
      }),
    },
    watch: {
      companyId() {
        this.initWangEditor()
      },
      editorData: {
        handler(curVal, oldVal) { //
          editor.txt.html(this.editorData ? this.editorData : "")
        },
        deep: true,

      },
      wxUploadImageStatus(st) {
        console.log('watch wxUploadImageStatus status', st)
        switch (st) {
          case 'prepar':
            //this.disableKeyboard()
            break
          case 'success':
            console.log('upload image success', this.wxUploadImage)
            this.uploadImageEnd(this.wxUploadImage)
            break
          case 'failed':
            //this.enableKeyboard()
            break
          case 'canceled':
            //this.enableKeyboard()
            break
        }
      }
    },
    created() {
      this.nativeAppHelper = NatAppHelper
    },
    mounted() {
      if (isWeiXin() || isMhApp()) {
        if (!this.nativeAppHelper.isInit()) {
          this.nativeAppHelper.initJSSDK(this.$wechat, [
            "checkJsApi",
            "chooseImage",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "uploadImage",
            "startRecord",
            "stopRecord",
            "onVoiceRecordEnd",
            "playVoice",
            "pauseVoice",
            "stopVoice",
            "onVoicePlayEnd",
            "uploadVoice",
            "openLocation",
            "getLocation"
          ]);
        }
      }
    },
    methods: {
      uploadImageEnd(data) {
        console.log('uploadImageEnd========================', data);
        data.relativePath = data.fileName
        editor.uploadImg.uploadImgZing(data)
      },
      initWangEditor() {
        let that = this
        if (!this.companyId) {
          return false
        }
        this.$nextTick(() => {
          editor = new WangEditor('.new-text-editor .toolbar', '.new-text-editor .text');
          editor.customConfig.menus = [
            'bold',  // 粗体
            'fontSize',  // 字号
            'italic',  // 斜体
            'underline',  // 下划线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'list',  // 列表
            'justify',  // 对齐方式
            'image',  // 插入图片
          ]
          // editor.customConfig.showLinkImg = false;
          // editor.customConfig.uploadImgShowBase64 = true;
          editor.customConfig.uploadImgServer = `/zingbiz/common/UploadFile/uploadFile.action`;
          editor.customConfig.withCredentials = true
          editor.customConfig.companyId = this.companyId
          editor.customConfig._that = this
          editor.customConfig.uploadImgParamsWithUrl = true;
          editor.customConfig.uploadFileName = 'file'
          editor.customConfig.onchangeTimeout = 1 // 单位 ms
          editor.customConfig.showLinkImg = false // 隐藏“网络图片”tab
          editor.customConfig.uploadImgParams = {
            folderPath: '',
            maxSize: 20971520
          }
          editor.customConfig.customAlert = function (info) {
            // info 是需要提示的内容
            alert('自定义提示：' + info)
          }
          editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
          editor.customConfig.uploadImgMaxLength = 1;
          editor.customConfig.onchange = function (html) {
            // html 即变化之后的内容
            that.$emit("getEditorHtml", html);
          }
          editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {

              // 图片上传之前触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

              // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
              // return {
              //     prevent: true,
              //     msg: '放弃上传'
              // }
            },
            success: function (xhr, editor, result) {
              // 图片上传并返回结果，图片插入成功之后触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function (xhr, editor, result) {
              // 图片上传并返回结果，但图片插入错误时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            error: function (xhr, editor) {
              console.log(xhr, editor, '报错');
              // 图片上传出错时触发   // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            },

            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert: function (insertImg, result, editor) {
              // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
              // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
              // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
              //let url = `${location.protocol}//${location.hostname}${result.data.relativePath}`;
              let url = `${result.data.relativePath}`;
              console.log(url);
              insertImg(url)

              // result 必须是一个 JSON 格式字符串！！！否则报错
            }
          };
          editor.customConfig.zIndex = 1000;
          editor.create();
        })
      },
      clickEditor(event) {
        if (this.showSave) {
          //手机端没有mouseleave事件，所以绑定点击事件
          let doms = document.getElementsByClassName("w-e-menu")
          for (let i = 0; i < doms.length; i++) {
            if (doms[i].childNodes.length > 1 && doms[i].childNodes[1].style.display && doms[i].childNodes[1].style.display !== "none") {
              doms[i].childNodes[1].style.display = "none"
            }
          }
          //手机端点击时获取焦点
          editor.selection.restoreSelection();
          event.preventDefault();
        }
      },
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .new-text-editor {
    touch-action: none
    overflow hidden
    min-height calc(320px)
    position relative
    top: 0
    left: 0
    width: 100%
    z-index 1000
    margin-top 2px
    border-top 1px solid #d9d9d9
    .toolbar {
      padding: 4px 0
      border-bottom 1px solid #d9d9d9
      background #d9d9d9
    }
    .text {
      position absolute
      top: 35px;
      left: 0;
      bottom 0
      right: 0
      border: 1px solid #d9d9d9;
      margin: 0px 5px;
    }
  }
</style>
