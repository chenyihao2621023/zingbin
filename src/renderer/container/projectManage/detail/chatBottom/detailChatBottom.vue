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
                    @moreItemClick="moreItemClick"
                    @emoticonSelected="emoticonSelected"
                />
            </div>
        </transition>
        <!--标签组件-->
        <chooseLable
                :showChoseLable="showChoseLable"
                @selectLable="selectLable"
                @abort="abortChoseLable"
                :routing="insertParams.routing"
                :cardId="insertParams.cardId"
                :tagCells="tags"
                :updatetags="updatetags"
        >
        </chooseLable>
        <!--关联-->
        <relationtask
        :showrelation="showrelation">
        </relationtask>
    </div>
</template>
<script>
    import detailchatInputBox from './detailchatInputBox'
    import FullPageSlide from './detaliFullPageSlide'
    import { isMhApp,Z_IsEmpty20 } from '../../../../utils/fn'
    import Uploader from "../../../../utils/upload"
    import emoticonData from '../../../chat/emoticon-data'
    import chooseLable from "../chatBottom/chooseLable";
    import relationtask from "../chatBottom/relationtask";

     const fileUploader = Uploader.create()
     export default{
         components: {detailchatInputBox, FullPageSlide,isMhApp,chooseLable,relationtask },
         props:[
             'insertParams',
             'loadParams',
             'updadeTaskActivits',
             'activitieId',
             'activitieVal',
             'activitieRouting',
             'tags',
             "updatetags"

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
                 showrelation:false//关联
             }
         },
         watch: {
             fooderShow() {
                 window.localStorage.setItem('fooderShow', JSON.stringify(this.fooderShow))
             }
         },
         mounted() {
               this.initPCUploader()
               this.fileUploader()
         },
         methods: {
             selectLable() {

             },
             abortChoseLable(){
               this.showChoseLable = false
               this.showrelation = false
             },
             initPCUploader(companyId) {
                 let _this = this
                 let url = "/zingbiz/common/UploadFile/uploadFile.action";
                 if (!Z_IsEmpty20(companyId)) {
                     url += "?companyId=" + companyId;
                 }
                 Uploader.init({
//                    uploaderSwfPath:
//                        "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
                     uploaderServer: url,
                     folderPath: "",
                     imageOnly: true,
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
             moreItemClick(type) {
                 console.log('moreItemClick', type)
                 switch (type) {
                     case 'image':
                         Uploader.prepareUpload.bind(this)()
                         break
                     case 'filebox':
                         fileUploader.prepareUpload.bind(this)()
                         break
                     case 'label':
                         this.showChoseLable = true
                         this.showrelation = false
                         break
                     case 'relation':
                         this.showrelation = true
                         this.showChoseLable = false
                         break
                     default:
                         console.log('not support more item', type)
                 }
             },
             //大表情
             emoticonSelected(type, name) {
                 console.log('emoticonSelected', type, name)   //detailFullpagesilde

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
                         that.updadeTaskActivits(res.data,TellDetail,TellValJSON)
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
                 this.$emit('clickMore')
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
             },
             inputFocus() {
                 this.fooderShow = false
                 this.fooderContent = 'keyborad'
                 this.computeScroll = !this.computeScroll
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
