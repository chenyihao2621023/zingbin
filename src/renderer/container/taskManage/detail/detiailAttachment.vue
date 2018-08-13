<!--附件-->
<template>
    <div>
        <div class="detailAttachmentWrap" v-for="(Attachment,index) in Attachments" :key="index">
            <div class="AttachmentAvatar" v-if="Attachment.fileTypeFlag === 'img'">
                <img :src="Attachment.reserved1" @click="fangDa(index)"/>
            </div>
            <div class="AttachmentAvatar" v-else-if="Attachment.fileTypeFlag === 'pdf'">
                <i class="icon iconfont icon-pdf"></i>
            </div>
            <div class="AttachmentAvatar" v-else-if="Attachment.fileTypeFlag === 'ppt'">
                <i class="icon iconfont icon-ppt"></i>
            </div>
            <div class="AttachmentAvatar" v-else-if="Attachment.fileTypeFlag === 'xls'">
                <i class="icon iconfont icon-excel"></i>
            </div>
            <div class="AttachmentAvatar" v-else-if="Attachment.fileTypeFlag === 'txt'">
                <i class="icon iconfont icon-txt"></i>
            </div>
            <div class="AttachmentAvatar" v-else-if="Attachment.fileTypeFlag === 'other'">
                <i class="icon iconfont icon-745bianjiqi_tupianshangchuan"></i>
            </div>
            <div class="AttachmePntMasage">
                <p class="publicAttachment personnel ">附件名 : {{Attachment.val}}</p>
                <p class="publicAttachment attacmentSize">大小 : {{Attachment.fileSize}}</p>
                <p class="publicAttachment">添加时间 : {{Attachment.genTime.split(' ')[0]}}</p>
            </div>
            <div class="AttachmentDel">
                <i class="icon iconfont icon-shanchu1" @click="delAttachment(Attachment)"></i>
            </div>
            <div class="AttachmentDownload" @click="downFile(Attachment)">
                <i class="icon iconfont icon-yulanxiazai"></i>
            </div>
        </div>
    </div>
</template>
<script>
import avatar from "@/components/avatar/Avatar";
import PubSub from "pubsub-js";
import { isWeiXin } from "../../../utils/fn";
export default {
  components: {
    avatar
  },
  props: ["firterAttachment", "Filedata", "insertParams", "updadeTaskActivits","attachShow"],
  data() {
    return {

    };
  },
  computed: {
    companyId() {
      return this.$store.state.ui.userInfo.companyId;
    },
    Attachments() {
       for (let i=0;i<this.firterAttachment.length;i++) {
           let arr = this.firterAttachment[i].val.split(";")
           let arr2 = arr[0].split(".")
           let fileType = arr2[arr2.length - 1]
           let fileTypeFlag = ''
           switch (fileType) {
               case 'gif':
               case 'svg':
               case 'png':
               case 'jpeg':
               case 'jpg':
                   fileTypeFlag = 'img'
                   break;
               case 'pdf':
                   fileTypeFlag = 'pdf'
                   break;
               case 'txt':
                   fileTypeFlag = 'txt'
                   break;
               case 'pptx':
               case 'ppt':
                   fileTypeFlag = 'ppt'
                   break;
               case 'xlsx':
               case 'xls':
                   fileTypeFlag = 'xls'
                   break;
               default:
                   fileTypeFlag = 'other'
           }
           this.firterAttachment[i].fileTypeFlag = fileTypeFlag
           this.firterAttachment[i].val = arr[0]
           this.firterAttachment[i].fileSize = (arr[1]/1024).toFixed(2) + "KB"
       }

       return this.firterAttachment;
    }
  },
  mounted() {
    this.$on("ifFile", Filedata => {
      this._getAttachments(Filedata);
    });
  },
  methods: {
    //删除
    delAttachment(Attachment) {
      let _this = this
      let url = "/ZingMH/ZDesk/activity/mater/delActivity.action"
      let params = {
        activitieId: Attachment.activitieId,
        routing:Attachment.routing
      }
      _this.$http.get(url,{ params:params })
        .then(res => {
          let TellDetail = true
          //delete 删除 update 修改
          let delOrUpdate = 'delete'
          //更新页面
          _this.updadeTaskActivits(Attachment.activitieId,TellDetail,JSON.stringify({}),delOrUpdate)
          _this.$vux.toast.show({text:"删除成功",type:"success"})
        })
        .catch(err => {
          console.log(err)
        });
    },
    //放大图片
    fangDa(index){
      this.attachShow(index)
    },
    _getAttachments(Filedata) {
      if (Filedata) {
        // this.Attachments.push(Filedata)
        let that = this;
        let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action";
        if (Filedata.data) {
          // that.insertParams.val = Filedata.data.fileName;
          that.insertParams.val =
              Filedata.data.fileName +
              ";" +
              Filedata.data.fileSize +
              ";" +
              Filedata.data.relativePath;
          that.insertParams.prefixMsg = "添加附件";
          that.insertParams.dataId = Filedata.data._id;
          that.insertParams.type = "attachment";
          that.insertParams.reserved1 = Filedata.data.relativePath;
        }
        that.$http
          .get(url, { params: that.insertParams })
          .then(res => {

            //通知load  给detail组件准备参数
            let TellDetail = 2;
            let TellVal = {
              imgVal: {
                fileName: "",
                fileSize: "",
                relativePath: ""
              },
              filedVal: {
                fileName: Filedata.data.fileName
              },
              commentVal: {}
            };
            //更新页面
            let TellValJSON = JSON.stringify(TellVal);
            that.updadeTaskActivits(res.data.data, TellDetail, TellValJSON);

            that.$vux.toast.show({ text: "添加成功", type: "success" });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    downFile() {
      /**@augments vendar
       * todo 目前问题：上传组件没有返回ID 如何下载？
       */
      if (isWeiXin()) {
        window.location =
          "/ZingMH/zh_cn/fileManage/download.htm?id=" +
          fileId +
          "&companyId=" +
          routing +
          "&t=" +
          new Date().getTime();
      } else {
        window.location =
          "/ZingMH/ZDesk//UploadFile/downloadFile.action?id=" +
          fileId +
          "&companyId=" +
          routing;
      }
      event.stopPropagation();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.detailAttachmentWrap {
    display: flex;
    width: 100%;
    padding: 5px 10px;

    &>img {
        width: 50px;
        height: 50px;
    }

    .AttachmentAvatar {
        max-width 80px
        flex 1
        img {
            width: 50px;
            height: 50px;
        }
        i{
            font-size 50px
        }
    }

    .AttachmePntMasage {
        width 100%;
        margin-right 13px
        padding 5px 0;
        .publicAttachment{
            word-wrap break-word;
            word-break break-all;
            overflow hidden;
        }
        .attacmentSize {
          word-break: break-all;
          word-wrap: break-word;
        }
    }

    .AttachmentDel, .AttachmentDownload {
        justify-content: flex-end;
        flex 0.4
    }
}
</style>

