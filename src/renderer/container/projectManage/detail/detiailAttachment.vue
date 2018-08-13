<!--附件-->
<template>
    <div>
        <div class="detailAttachmentWrap" v-for="(Attachment,index) in Attachments" :key="index">
            <div class="AttachmentAvatar">
                <img :src="Attachment.reserved1">
            </div>
            <div class="AttachmePntMasage">
                <p class="personnel ">附件名 : {{Attachment.val}}</p>
                <p class="">大小 : {{Attachment.fileSize}}   添加时间 : {{Attachment.genTime}}</p>
            </div>
            <div class="AttachmentDel">
                <i class="icon iconfont icon-shanchu1"></i>
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
  props: ["firterAttachment", "Filedata", "insertParams", "updadeTaskActivits"],
  data() {
    return {};
  },
  computed: {
    Attachments() {
      return this.firterAttachment;
    }
  },
  mounted() {
    console.log('firterAttachment',this.firterAttachment)
    console.log('Attachments',this.Attachments)
    this.$on("ifFile", Filedata => {
      this._getAttachments(Filedata);
    });
  },
  methods: {
    _getAttachments(Filedata) {
      if (Filedata) {
        //                  this.Attachments.push(Filedata)
        let that = this;
        let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action";
        if (Filedata.data) {
          that.insertParams.val = Filedata.data.fileName;
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
            let TellValJSON = JSON.stringify(TellVal);
            that.updadeTaskActivits(res.data, TellDetail, TellValJSON);

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
          ileId +
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
        flex: 1;
    }

    .AttachmentMasage {
        flex: 2;
    }

    .pictureDel, .picturedownload {
        justify-content: flex-end;
    }
}
</style>

