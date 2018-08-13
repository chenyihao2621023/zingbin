<template>
    <div class="new-text-html">
        <popMenu :show="showPopMenu" @cancel="onCancel" :contentMenu="[]" @on-hide="onCancel" @click-menu-item="handleMenuItem">

        </popMenu>
        <zing-head class="new-text-head"></zing-head>
        <div class="new-text-content">
            <div class="new-text-content-item" style="padding: 7px 10px">
                <a @click="goBack">返回目录</a>
                <a @click="clickEdit">{{editText}}</a>
                <a v-show="showSave" @click="clickSave">保存</a>
            </div>

            <div class="new-text-content-item">

                <group>
                    <x-input placeholder="请输入标题" type="text" v-model="textTitle" @on-blur="titleBlur" :show-clear="false" :disabled="!showSave"></x-input>
                </group>
            </div>
            <div class="new-text-content-item" style="border-bottom: 1px solid #d9d9d9">
                <group>
                  <div style="padding: 2px 0">
                      <b>标签</b>
                      <span v-for="(item,index) in addLabelsList" :key="index">
                  {{item}}
                  <i @click="removeLabels(index)" v-show="showSave" class="icon iconfont icon-guanbi"></i>
              </span>
                      <x-input v-show="showSave" class="add-labels" placeholder="+标签" type="text" v-model="addLabelsText" @on-blur="labelsBlur" :show-clear="false"></x-input>
                  </div>
                </group>

            </div>
        </div>
        <div class="new-text-editor">
            <div v-show="showSave" class="toolbar"></div>
            <div class="text"></div>
        </div>
        <sidebar
            @previewDownload="onPreviewDownload"
            @uploadFileCabinets="onUploadFileCabinets"
            @shareMessage = "onShareMessage"
            @shareFriend="shareFriend"
            @shareTimeline = "shareTimeline"
            v-show="!showSave&&showSidebar">

        </sidebar>
        <explorer-picker :showUploadFile="true" @goBack="onChangeShowCabinets" :showCabinets="showCabinets" @uploadFile="onUploadFile"
        >
        </explorer-picker>
    </div>
</template>
<script>
    import ZingHead from "../../components/zingHead/ZingHead.vue"  //公共头部
    import Sidebar from "../../components/sidebar/Sidebar.vue"
    import ExplorerPicker from "../../components/explorer/ExplorerPicker.vue"
    import PopMenu from "components/popmenu/PopMenu";
    import { XButton,XInput,Group } from "vux"
    import { mapMutations,mapState } from 'vuex';
    import { shareMessage,isMhApp,isWeiXin } from '@/utils/fn'
    import { setupWeiXinShareInfo,shareFriend,shareTimeline } from '@/utils/wx'
    import WangEditor from '../../assets/js/wangEditor'
    import NatAppHelper from "@/utils/nativeAppHelper";

    let editor

    export default {
        name: 'NewText',
        components: {
            ZingHead,
            XButton,
            Sidebar,
            ExplorerPicker,
            XInput,
            Group,
            PopMenu
        },
        data() {
            return {
                nativeAppHelper: NatAppHelper,
                isComeBack: false,
                showSave: false,
                textTitle: '',
                storingAddLabels: [],//存储的添加数据
                addLabelsList: [],//所有标签
                addLabelsText: '',//添加的标签
                fileContent: '', // 内容
                saveTitle: '',
                saveContent: '',
                cardUrl: '',
                type: 'file',
                // showEditor:false,
                showCabinets:false,
                timer:null,
                showFooterTab:false,
                showPopMenu:false,
                showSidebar:true
            }
        },
        computed: {
            editText() {
                if (!this.showSave) {
                    this.addLabelsText = ''
                }
                return this.showSave ? '只读' : '编辑'
            },
            id() {
                return this.$route.query.id || ''
            },
            companyId() {
                return this.$route.query.companyId || ''
            },
          ...mapState({
            wxUploadImageStatus: state => state.wx.wxUploadImageStatus,
            wxUploadImage: state => state.wx.wxUploadImage
          })
        },
        watch: {
            showSave(v) {
                if (v) {
                    if (editor) editor.$textElem.attr('contenteditable', true)
                } else {
                    if (editor) editor.$textElem.attr('contenteditable', false)
                }
            },
          wxUploadImageStatus(st) {
            console.log('watch wxUploadImageStatus status', st)
            switch (st) {
              case 'prepar':
//                        this.disableKeyboard()
                break
              case 'success':
                console.log('upload image success', this.wxUploadImage)
                this.uploadImageEnd(this.wxUploadImage)
                break
              case 'failed':
                // this.enableKeyboard()
                break
              case 'canceled':
                // this.enableKeyboard()
                break
            }
          }
        },
        created() {
             this.initData();
             this.nativeAppHelper = NatAppHelper
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.setMode(false)
            })
        },
        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例
            this.setMode(true);
            next();
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
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
          uploadImageEnd(data) {
            data.relativePath = data.fileName
            editor.uploadImg.uploadImgZing(data)
          },
          initWangEditor() {
            this.$nextTick(() => {
              editor = new WangEditor('.new-text-html .new-text-editor .toolbar', '.new-text-html .new-text-editor .text');
              editor.customConfig.menus = [
                'bold',  // 粗体
                'head',
                'italic',  // 斜体
                'link',  // 插入链接
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'justify',  // 对齐方式
                'image',  // 插入图片
                'undo',  // 撤销
                'quote',  // 引用
                'redo'  // 重复
              ]
              // editor.customConfig.showLinkImg = false;
              // editor.customConfig.uploadImgShowBase64 = true;
              editor.customConfig.uploadImgServer = `/zingbiz/common/UploadFile/uploadFile.action`;
              editor.customConfig.withCredentials = true
              editor.customConfig.uploadImgParamsWithUrl = true;
              editor.customConfig.companyId = this.companyId
              editor.customConfig._that = this
              editor.customConfig.uploadFileName = 'file'
              if (!PSMU.isEmtVal(PSMU.token)) {
                editor.customConfig.uploadImgHeaders = {
                  [PSMU.tokenName]: PSMU.token
                }
              }
              editor.customConfig.uploadImgParams = {
                folderPath:'',
                maxSize:20971520
              }
              editor.customConfig.customAlert = function (info) {
                // info 是需要提示的内容
                alert('自定义提示：' + info)
              }
              editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
              editor.customConfig.uploadImgMaxLength = 10;
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
                  console.log(xhr, editor,'报错');
                  // 图片上传出错时触发
                  // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                },

                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                  // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                  // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                  // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                  let url = `${location.protocol}//${location.hostname}${result.data.relativePath}`;
                  console.log(url);
                  insertImg(url)

                  // result 必须是一个 JSON 格式字符串！！！否则报错
                }
              };
              editor.customConfig.zIndex = 1000;
              editor.create(this);
              if (!this.showSave) {
                if (editor) editor.$textElem.attr('contenteditable', false);
                editor.isFocus = false;
                console.log(editor);
              }
            })
          },
            goBack() {
                this.showSave = false;
                this.$router.go(-1)
            },
            onChangeShowCabinets() {
                this.showCabinets = false;
                this.initStatus()
            },
            onCancel () {
                this.showSidebar = true;
                this.showPopMenu = false;
            },
            handleMenuItem(val) {
                if (!val) return;
                let link,title,content,logoUrl;
                switch (val) {
                    case "分享到英商":
                      link = `/ZingVue/index.html#/viewText?id=${this.id}&companyId=${this.companyId}`
                      title = this.saveTitle
                      content = PSMU.html2txt(this.fileContent)
                      logoUrl = '/ZingVue/static/images/explorer/txt.png'
                      shareMessage(this, link, title, content, logoUrl)
                       break;
                    case "分享到微信":
                        console.log('分享到微信');
                        break;
                    default:
                        console.log(val);
                }
            },
            onShareMessage() {
                // this.showEditor = false;
                this.showSidebar = false;
                this.showPopMenu = true;
            },
            onUploadFileCabinets() {
                this.showCabinets = true;
                // this.showEditor = false;
            },
            shareTimeline() {
                if (isMhApp()) {
                    try{
                        let url = location.origin + `/ZingVue/index.html#/viewText?id=${this.id}&companyId=${this.companyId}`
                        let title = this.saveTitle
                        let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                        shareTimeline(title,url,img)
                    }catch (e) {
                        console.log("分享error===>", e)
                    }
                }
            },
            shareFriend() {
                //好友
                if (isMhApp()) {
                    try {
                        let url = location.origin + `/ZingVue/index.html#/viewText?id=${this.id}&companyId=${this.companyId}`
                        let title = this.saveTitle
                        let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                        shareFriend(title,url,img)
                    } catch (e) {
                        console.log("分享error===>", e)
                    }
                }
            },
            onUploadFile(recordType,parentId,cb) {
            // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/saveNoteToExplorerN.action';
            let url = '/zingbiz/explorer/saveNoteToExplorerN';
              let params = {
                  noteId: this.id,
                  title: this.saveTitle,
                  parentId,
                  recordType,
                  companyId: this.companyId
              };
                // this.$http.post(url,Qs.stringify(params)).then(res => {
                this.$http.post(url,params).then(res => {
                  if (res.data.success) {
                   this.bottomToast ("上传文件柜成功！");
                  if (this.timer) {
                      clearTimeout(this.timer);
                  }
                   this.timer = setTimeout(() => {
                       cb();
                       this.onChangeShowCabinets();
                   },1000)
                  } else {
                      this.bottomToast ("上传失败,没有权限!",'warn')
                  }
              })
            },
            onPreviewDownload() {
                //预览下载
               // location.href = `/ZingMH/ZDesk/Appnote/downloadAppnote.action?id=${this.id}&filename=${this.saveTitle}&companyId=${this.companyId}`;
               //  location.href = `/zingbiz/appnote/downloadAppnote?id=${this.id}&filename=${this.saveTitle}&companyId=${this.companyId}`;
                location.href = `/zingbiz/appnote/downloadAppnoteA?id=${this.id}&filename=${this.saveTitle}&companyId=${this.companyId}`;
                // event.stopPropagation();
            },
            initStatus() {
                this.showSave = false;
                // this.showEditor = true;
                // this.showSidebar = true;
            },
            clickSave() {
                this.saveContent = editor ? editor.txt.html() : ''
                if (this.storingAddLabels && (this.tagsList.length === this.addLabelsList.length) &&
                    (this.saveTitle === this.textTitle) && (this.fileContent === this.saveContent)) {
                    this.showSave = false
                } else {
                    // let url = '/ZingMH/ZDesk/Appnote/saveAppnote.action';
                   let url = '/zingbiz/appnote/saveAppnote';
                    let tags = this.addLabelsList.join(",");
                    let params = {
                        cardUrl: this.cardUrl,
                        companyId: this.companyId,
                        routing: this.companyId,
                        id: this.id,
                        tags: tags,
                        title: this.textTitle,
                        fileContent: this.saveContent,
                        fileContentNoFormat: `${this.textTitle} ${editor.txt.text()}`
                    };
                    const _this = this;
                    // this.$http.post(url, Qs.stringify(params)).then(res => {
                        this.$http.post(url, params).then(res => {
                        if (res.data.success) {
                            _this.bottomToast ("保存文本成功！");
                            _this.saveTitle = JSON.parse(JSON.stringify(_this.textTitle));
                            _this.tagsList = JSON.parse(JSON.stringify(_this.addLabelsList));
                            _this.fileContent = JSON.parse(JSON.stringify(_this.saveContent));
                            _this.storingAddLabels = [];
                            _this.showSave = false;
                            _this.onSetupWeiXin();
                        } else {
                            this.bottomToast ("保存文本失败！",'warn')
                        }
                    }, err => {
                        console.log(err);
                        this.bottomToast ("保存文本失败！",'warn')
                    });
                }
            },
            onSetupWeiXin() {
                if (isWeiXin() || isMhApp()) {
                    let url = location.origin + `/ZingVue/index.html#/viewText?id=${this.id}&companyId=${this.companyId}`
                    let title = this.saveTitle;
                    let desc = PSMU.html2txt(this.saveContent)
                    let weibodesc = PSMU.html2txt(this.saveContent)
                    let img = location.origin + '/ZingVue/static/images/explorer/txt.png'
                    let msgtit = this.saveTitle
                    setupWeiXinShareInfo(url, title, desc, weibodesc, img, msgtit)
                }
            },
            clickEdit() {
                if (this.showSave) {
                    this.showSidebar = true;
                    if (editor) editor.txt.html(this.saveContent);
                    this.textTitle = this.saveTitle;
                    this.addLabelsList = this.tagsList;
                }
                this.showSave = !this.showSave
            },
            titleBlur() {
                this.textTitle = this.textTitle.length > 0 ? this.textTitle : this.saveTitle;
                // this.onBlur()
            },

            labelsBlur() {
                if (this.addLabelsText.length > 0 && !this.addLabelsList.includes(this.addLabelsText)) {
                    this.storingAddLabels.push(this.addLabelsText);
                    this.addLabelsList.push(this.addLabelsText);
                }
                this.addLabelsText = '';
                // this.onBlur()
            },
            removeLabels(i) {
                this.addLabelsList = this.addLabelsList.filter((item, index) => index !== i)
            },
            getCardUrl() {
                // let url = '/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action';
                let url = '/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl';
                this.$http.post(url,{}).then(res => {
                   if (res.data.success) {
                       this.cardUrl = res.data.data.cardUrl;
                       this.initWangEditor();
                       this.getAppnote();
                   }
                });
            },

            getAppnote() {
                // let url = '/ZingMH/ZDesk/Appnote/getAppnote.action';
               let url = '/zingbiz/appnote/getAppnote';
                let params = {
                    moduleType: "TYPE_NootBook_all",
                    companyId: this.companyId,
                    id: this.id
                };
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                    this.$http.post(url, params).then(res => {
                      if (res.data.success) {
                        this.initStatus();
                        let { tags, title, fileContent } = res.data.data;
                        this.textTitle = title;
                        this.addLabelsList = tags ? tags.split(",") : [];
                        this.saveTitle = JSON.parse(JSON.stringify(this.textTitle));
                        this.tagsList = JSON.parse(JSON.stringify(this.addLabelsList));
                        this.fileContent = fileContent
                        this.saveContent = this.fileContent
                        if (editor) editor.txt.html(this.fileContent)
                        this.onSetupWeiXin()
                    } else {
                        this.saveTitle = JSON.parse(JSON.stringify(this.textTitle));
                        this.tagsList = JSON.parse(JSON.stringify(this.addLabelsList));
                    }
                }, err => {
                    console.log(err);
                })
            },
            bottomToast (msg,type) {
                let _this = this
                if (!msg) return
                let tp = type ? type : 'success';
                this.$vux.toast.show({
                    text: msg,
                    type: tp,
                    position: 'middle',
                    width: '12em',
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            initData() {
                this.getCardUrl();
            }
        },
    }
</script>
<style>
    .new-text-html .weui-cell__bd input {
        text-align: left !important;
    }
    .new-text-html .vux-x-input.disabled {
        color: #000;
    }
    .new-text-html .weui-cell:before{
        border: none !important;
    }
    .new-text-html .weui-cells:after{
         border: none !important;
     }
    .new-text-html a{
        color: #4DA9EB!important;
    }
    .new-text-html .text .w-e-text p img{
        width: 100%!important;
        max-width:100% !important;
    }
    .w-e-text-container {
        position: static;
        z-index: 10!important;
    }
</style>
<style lang="stylus" scoped>
    .new-text-content-item
        color: rgba(136, 136, 136, 1)
        font-size: 14px
        a
            margin-right: 10px
            display: inline-block
            background-color: #ff8000
            color: #fff!important
            border-radius: 5px
            height: 22px
            line-height: 22px
            text-align: center
            font-size: 13px
            font-family: Arial
        b
            display inline-block
            padding 10px 0 0 10px
        .title-input
            color: rgba(136, 136, 136, 1)
            height: 20px
        span
          display: inline-block
          border: 1px solid #cccccc
          padding: 0 5px
          height: 22px
          line-height: 22px
          margin-left: 8px
          margin-top: 5px
        .add-labels
            color: rgba(136, 136, 136, 1)
            border-bottom: 1px solid #ffb85f
            width: 80px
            height 35px
            display inline-block
            vertical-align middle
    .new-text-html
        width: 100%;
        height: 100%;
        position relative
      .new-text-editor
         touch-action: none
         width:100%
         z-index 1000
         margin-top 2px
        .toolbar
            padding:4px 0
            border-bottom 1px solid #d9d9d9
        .text
            position absolute
            top: 216px;
            left: 0;
            bottom 0
            right: 0
            font-size 16px !important
</style>
