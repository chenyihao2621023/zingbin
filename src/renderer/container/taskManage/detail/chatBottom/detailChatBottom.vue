<template>
    <div class="detailChatWrap">
        <detailchat-InputBox
            ref="detailchatInputBox"
            v-show="hasWriteRight"
            @emojiClick="emojiClick"
            @moreClick="moreClick"
            @keyboardClick="keyboardClick"
            @rightKeyboardClick="rightKeyboardClick"
            @inputFocus="inputFocus"
            :inputShow="inputShow"
            :fooderContent="fooderContent"

            :insertParams="insertParams"
            :loadParams="loadParams"
            :updadeTaskActivits="updadeTaskActivits"

            :activitieId="activitieId"
            :activitieVal="activitieVal"
            :activitieRouting="activitieRouting"
        >
        </detailchat-InputBox>
        <transition name="fade">
            <div class="chat-footer" v-if="fooderShow">
                <full-page-slide
                    :fooderContent="fooderContent"
                    :inputContent="inputContent"
                    :inputLeft="inputLeft"
                    :emojiIconShow="emojiIconShow"
                    @taskMoreItemClick="taskMoreItemClick"
                    @emoticonSelected="emoticonSelected"

                    :taskLeaderValue="taskLeaderValue"

                    :clickEmojiOrClickMore="clickEmojiOrClickMore"
                    :DetailWrapH="DetailWrapH"
                />
            </div>
        </transition>
        <!--标签组件-->
        <chooseLable
                :selectedItem="showChoseLableItem"
                :showChoseLable="showChoseLable"
                @selectLable="selectLable"
                @abort="abortChoseLable"
                :tagCells="tags"
                :updatetags="updatetags"
                :insertParams="insertParams"
                :subscribers="subscribers"
                :members="members"
                :updadeTaskActivits = "updadeTaskActivits"
        >
        </chooseLable>
        <!--关联新页面-->
        <!--<relationtask-->
        <!--:showrelation="showrelation"-->
        <!--@closeRelation="closeRelation">-->
        <!--</relationtask>-->
    </div>
</template>
<script>
    import detailchatInputBox from './detailchatInputBox'
    import FullPageSlide from './detaliFullPageSlide'
    import { isWeiXin,isMhApp,Z_IsEmpty20,isIos} from '../../../../utils/fn'
    import NatAppHelper from "@/utils/nativeAppHelper";
    import Qs from 'qs'
    import Uploader from "../../../../utils/upload"
    import { startuploadImg } from "../../../../utils/wx.js"
    import emoticonData from '../../../chat/emoticon-data'
    import chooseLable from "../chatBottom/chooseLable";
    import relationtask from "../chatBottom/relationtask";
    import ImagePicker from "components/imagepicker/ImagePicker";
    import { mapState } from 'vuex'

     const fileUploader = Uploader.create()

     export default{
         components: { detailchatInputBox, FullPageSlide,chooseLable,relationtask,ImagePicker,NatAppHelper,Qs},
         props:[
             'insertParams',
             'loadParams',
             'updadeTaskActivits',
             'activitieId',
             'activitieVal',
             'activitieRouting',
             'tags',
             "updatetags",
             'members',
             'subscribers',
             'taskLeaderValue',
             'changeSroll',
             'DetailWrapH',
             "clickEmojiOrClickMore",
          ],
         data() {
             return {
                 hasWriteRight: true,
                 hasReadRight: false,
                 fooderShow: false,
                 computeScroll: false,
                 inputShow: true,
                 fooderContent: '',
                 inputContent: '',
                 inputLeft: '',
                 emojiIconShow: false,
                 isTalkInfoInit: false,
                 showBImg:false,//大表情
                 showChoseLable:false,//标签
                 showChoseLableItem:[],//标签组件对勾回显
               //showrelation:false//关联新页面
             }
         },
         computed:{
             companyId() {
                 return this.$store.state.ui.userInfo.companyId;
             },
             ...mapState({
                 wxUploadImageStatus: state => state.wx.wxUploadImageStatus,
                 wxUploadImage: state => state.wx.wxUploadImage
             })
         },
         watch: {
             fooderShow() {
                 window.localStorage.setItem('fooderShow', JSON.stringify(this.fooderShow))
             },
             //xinjia
             computeScroll() {
                 this.$emit('changeSroll',this.computeScroll)
             },
             //微信图片
             wxUploadImageStatus(st) {
                 console.log('watch wxUploadImageStatus状态', st)
                 switch (st) {
                   case 'success':
                         console.log('upload image success', this.wxUploadImage)
                         let taskwxUploadImage = {
                           data:{}
                         }
                         taskwxUploadImage.data.relativePath = this.wxUploadImage.fileName
                         console.log('taskwxUploadImage啦拉',taskwxUploadImage)
                         this.$emit('bottomPicture',taskwxUploadImage)  //taskdetail
                         break
                     case 'failed':
                         // this.enableKeyboard()
                         break
                 }
             }
         },
         mounted() {
           console.log()
               this.fileUploader()
         },
         methods: {
             isIos() {
                 return isIos();
             },
             nativeAppHelper(){
               return NatAppHelper
             },
             selectLable() {
                 this.showChoseLable = false
             },
             abortChoseLable(){
               this.showChoseLable = false
             },
             initPCUploader(companyId) {
                 let _this = this
                 let url = "/zingbiz/common/UploadFile/uploadFile.action";
                 if (!Z_IsEmpty20(companyId)) {
                     url += "?companyId=" + companyId;
                 }
                 Uploader.init({
                     uploaderSwfPath:
                        "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
                     uploaderServer: url,
                     folderPath: "",
                     imageOnly: false,

                     pickDom: document.querySelector('.taskMore'),

                     onUploadStart: function(isError, refs) {
                         /*if (isError === true) {
                          } else {
                          //showBottomPrompt("正在上传请稍后")
                          }*/
                     },
                     onMessage: function(msg, refs) {
                         console.log(msg);
                         // _this.bottomToast(msg)
                     },
                     onServerFailed: function(msg, refs) {
                         //hideBottomPrompt();
                         _this.bottomToast(msg)
                     },
                     onServerSuccess: function(PCdata, refs) {
                         _this.$emit('bottomPicture',PCdata)  //taskdetail

                     }
                 })

             },
             fileUploader(companyId) {
                 let _this = this
                 let url = "/zingbiz/common/UploadFile/uploadFile.action";
                 if (!Z_IsEmpty20(companyId)) {
                     url += "?companyId=" + companyId;
                 }
                 fileUploader.init({
//                    uploaderSwfPath:
//                        "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
                     uploaderServer: url,
                     folderPath: "",
                     imageOnly: false,
                     onUploadStart: function(isError, refs) {
                         /*if (isError === true) {
                          } else {
                          //showBottomPrompt("正在上传请稍后")
                          }*/
                     },
                     onMessage: function(msg, refs) {
                         console.log(msg);
                         // _this.bottomToast(msg)
                     },
                     onServerFailed: function(msg, refs) {
                         //hideBottomPrompt();
                         console.error(msg);
                         _this.bottomToast(msg)
                     },
                     onServerSuccess: function(Filedata, refs) {
                         let relativePath = Filedata.data.relativePath
                         _this.$emit('bottomfile',Filedata)    //taskdetail
                     }
                 })
             },
             addImage() {
                 if (isWeiXin() || isMhApp()) {
                     console.log('addImage打印2222222222')
                     //换微信wx.js
                     let count = 9
                     startuploadImg({
                         companyId: this.companyId,
                         bId: 'id',
                         bType: 'imgContent'
                     },count)
                 } else {
                     if (typeof Uploader.isInit === "function" && !Uploader.isInit()) {
                         console.log('addImage打印33333')
                         this.initPCUploader();
                     }
                     console.log('addImage打印4444')
                     Uploader.prepareUpload.bind(this)();
                 }
             },
             taskMoreItemClick(type) {
                 console.log('taskMoreItemClick', type)
                 switch (type) {
                     case 'image':
                         this.addImage()
                         break
                     case 'filebox':
                         if (this.isIos) {
                             fileUploader.prepareUpload.bind(this)()
                             fileUploader.prepareUpload.bind(this)()
                         }
                         break
                     case 'label':
                           this.showChoseLable = true
                         break
                     case 'relation':
//                         this.showrelation = true //关联任务新页面
                           this.$emit('showRelation')//关联任务旧版
                         break
                     default:
                         console.log('not support more item', type)
                 }
             },
             //大表情
             emoticonSelected(type, name) {
                 let that = this
                 let src = './static/emoticon/' + type + '/' + emoticonData[type][name]
                 let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                 that.insertParams.val = '<img style="width: 50px" src= ' + src + '>'
                 that.insertParams.prefixMsg = '添加评论'
                 that.insertParams.type = 'comment'
                 that.$http.get(url, { params: that.insertParams })
                     .then(res => {
                         //通知load
                         let TellDetail = 3
                         let TellVal = {
                             imgVal:{
                                 fileName:'',
                                 fileSize: '',
                                 relativePath:''
                             },
                             filedVal:{
                                 fileName:''
                             },
                             commentVal:{
                                 val:that.insertParams.val
                             }
                         }
                         let TellValJSON = JSON.stringify(TellVal)
                         that.updadeTaskActivits(res.data.data,TellDetail,TellValJSON)
                     })
                     .catch(err => {
                         console.log(err)
                     })

             },
             emojiClick() {
                 !this.fooderShow && (this.computeScroll = !this.computeScroll)
                 this.fooderShow = true
                 this.fooderContent = 'emoji'
                 this.inputShow = true
                 this.$emit('clickEmoji')
                 // 点表情刷新滚动条
                this.$emit('scrollRefresh')
             },
             moreClick() {
                 !this.fooderShow && (this.computeScroll = !this.computeScroll)
                 this.inputShow = true
                 if (this.fooderContent !== 'more') {
                     this.fooderShow = true
                     this.fooderContent = 'more'
                 } else {
                     this.fooderShow = false
                     this.fooderContent = ''
                 }
                 !this.fooderShow && (this.computeScroll = !this.computeScroll)
                 this.$emit('clickMore',this.fooderContent)
//                 点加号刷新滚动条
                 this.$emit('scrollRefresh')
             },
             keyboardClick() {
                 !this.fooderShow && (this.computeScroll = !this.computeScroll)
                 this.inputShow = true
             },
             rightKeyboardClick() {
                 this.fooderShow = false
                 this.fooderContent = ''
                 this.inputShow = true
                 this.computeScroll = !this.computeScroll
                 this.$emit('clickboard')

                 //  点键盘刷新滚动条
                 this.$emit('scrollRefresh')
             },
             inputFocus() {
                 this.fooderShow = false
                 // this.fooderContent = 'keyborad'
                 this.fooderContent = ''
                 this.computeScroll = !this.computeScroll

                 this.$emit('textareaFoucus')
             },
         }
     }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import "../../../../assets/stylus/variable.styl"
    @import "../../../../assets/stylus/mixin.styl"

    .detailChatWrap
      height 50px
      .input-box border-top-1px
        display block
        .chat-footer
            position: relative
            height: 100%
            width: 100%
            overflow: hidden
            transition: all .3s
            &.fade-enter-active, &.fade-leave-active
                transition: height .3s
            &.fade-enter, &.fade-leave-to
                height: 0
</style>
