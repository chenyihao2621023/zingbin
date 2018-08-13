<template>
    <div class="ei-image-picker">
        <div class="ei-image-picker-list" role="group">
            <div v-for="(group, index) in flexEl" :key="`flex-${index}`" class="flex">
                <div v-for="(item, i) in group" :key="`item-${i}`" v-if="!item.type" class="flex-item">
                    <div :key="i" class="ei-image-picker-item">
                        <div
                            class="ei-image-picker-item-remove"
                            role="button"
                            aria-label="Click and Remove this image"
                            v-show="removable"
                            @click="removeImage(index*imageNumber + i)"
                        >
                            <i class="iconfont icon-shanchu2"></i>
                        </div>
                        <div
                            class="ei-image-picker-item-content post-previewer-box-img"
                            role="button"
                            aria-label="Image can be clicked"
                            @click="addImage(1,index,i)"
                            :style="{
                backgroundImage: `url(${getImageUrl(item.url,'./static/images/userDef_.jpg')})`,
                transform: `rotate(${getRotation(item.orientation)}deg)`}"
                        >
                        </div>
                    </div>
                </div>
                <div v-else-if="item.type == 'select'" key="select" class="flex-item">
                    <div
                        class="ei-image-picker-upload-btn iconfont icon-tianjiatupian1"
                        role="button"
                        aria-label="Choose and add image"
                        @click="addImage"
                    >
                    </div>
                </div>
                <div v-else class="flex-item" :key="`blank-${i}`"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Flexbox, FlexboxItem } from "vux";
import NatAppHelper from "@/utils/nativeAppHelper";
import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
import Uploader from "@/utils/upload";
import { getImageUrl } from "@/utils/fn";
import { mapState } from 'vuex'

export default {
  name: "ImagePicker",
  components: {
    Flexbox,
    FlexboxItem
  },
  props: {
    nativeAppHelper: {
      type: Object,
      default: () => NatAppHelper
    },
    companyId: {
      type: String,
      default: ""
    },
    bId: {
      type: String,
      default: "id"
    },
    bType: {
      type: String,
      default: "imgContent"
    },
    files: {
      type: Array
    },
    selectable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    removable: {
      type: Boolean,
      default: true
    },
    imageNum: {
      type: Number,
      default: 4
    },
    enlargeFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUploader: {},
      fillBlankEl: [],
      flexEl: []
    };
  },
  computed: {
    ...mapState({
        wxUploadImageStatus: state => state.wx.wxUploadImageStatus,
        wxUploadImage: state => state.wx.wxUploadImage
    }),
    imageNumber() {
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (width < 768) {
        return this.imageNum;
      } else if (width >= 768 && width < 992) {
        return 2 * this.imageNum;
      } else {
        return 2 * this.imageNum + 2;
      }
    }
  },
  watch: {
    files: {
      handler(val) {
        this.flexEl = [];
        this.fillBlankEl = [];
        const imgItemList = [];
        val.forEach((item, index) => {
          imgItemList.push(item);
        });
        const selectEl = {
          type: "select"
        };
        let allEl = this.selectable
          ? imgItemList.concat([selectEl])
          : imgItemList;
        const length = allEl.length;
        if (length !== 0 && length % this.imageNumber !== 0) {
          const blankCount = this.imageNumber - length % this.imageNumber;

          for (let i = 0; i < blankCount; i++) {
            this.fillBlankEl.push({ type: "blank" });
          }
          allEl = allEl.concat(this.fillBlankEl);
        }
        for (let i = 0; i < allEl.length / this.imageNumber; i++) {
          const rowEl = allEl.slice(
            i * this.imageNumber,
            i * this.imageNumber + this.imageNumber
          );
          this.flexEl.push(rowEl);
        }
        //this.flexEl = [];
      },
      immediate: true
    },
    companyId: {
      handler(val) {
        if (!Z_IsEmpty20(val) && !isWeiXin() && !isMhApp()) {
          this.initPCUploader(val);
        }
      },
      immediate: true
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
    getImageUrl,
    initPCUploader(companyId) {
      let url = "/zingbiz/common/UploadFile/uploadFile.action";
      if (!Z_IsEmpty20(companyId)) {
        url += "?companyId=" + companyId;
      }

      this.imageUploader = Uploader.create();
      this.imageUploader.init({
        uploaderSwfPath:
          "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
        uploaderServer: url,
        folderPath: "",
        imageOnly: true,
        onUploadStart: function(isError, $this) {
          if (!isError) {
            //showBottomPrompt("正在上传请稍后");
          }
        },
        onMessage: function(msg, $this) {
          //console.log(msg);
        },
        onServerFailed: function(msg, $this) {
          //hideBottomPrompt();
        },
        onServerSuccess: function(data, $this) {
          //hideBottomPrompt();
          //showBottomPrompt(data.mgs, 2000);
          //fn([data.data], true);
          console.info(data);
          $this.uploadImageEnd({ fileName: data.data.relativePath });
        }
      });
    },
    uploadImageEnd(data) {
        console.log('uploadImageEnd', data);
      if (!this.multiple) {
        this.files.pop();
      }
      this.files.push({ url: data.fileName });

      this.$emit("onChange", this.files, "add");
    },
    getRotation(orientation = 1) {
      let imgRotation = 0;

      switch (orientation) {
        case 3:
          imgRotation = 180;
          break;
        case 6:
          imgRotation = 90;
          break;
        case 8:
          imgRotation = 270;
          break;
        default:
      }
      return imgRotation;
    },
    removeImage(index) {
      const newImages = [];
      this.files.forEach((image, idx) => {
        if (index !== idx) {
          newImages.push(image);
        }
      });
      this.files.splice(index, 1);
      this.$emit("onChange", newImages, "remove", index);
    },
    addImage(type, index, i) {
      if (type === 1 && this.enlargeFlag) {
        this.$emit("viewEnlarge", index, i);
        return;
      }
      if (this.files.length >= 1 && type && this.multiple && !this.enlargeFlag)
        return;
      if (isWeiXin() || isMhApp()) {
        this.nativeAppHelper.startuploadImg.bind(this)({
          companyId: this.companyId,
          bId: this.bId,
          bType: this.bType
        });
      } else {
        if (
          typeof this.imageUploader.isInit === "function" &&
          this.imageUploader.isInit()
        ) {
          this.imageUploader.prepareUpload.bind(this)();
        } else {
          this.initPCUploader();
        }
      }
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/stylus/variable.styl';
@import '../../assets/stylus/mixin.styl';

.ei-image-picker {
  .flex {
    text-align: left;
    overflow: visible; // 宽度不够会遮挡问题
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .flex-item {
    position: relative;
    margin-right: 5px;
    margin-left: 0;
    box-sizing: border-box;
    flex: 1 1 auto;
    margin-left: 8px;
    min-width: 10px;

    &:after {
      display: block;
      content: ' ';
      padding-bottom: 100%;
    }
  }

  &-list {
    padding: 9px 8px 0;
    margin-bottom: 15px;

    .ei-flexbox {
      margin-bottom: 6px;

      .ei-flexbox-item {
        position: relative;
        margin-right: 5px;
        margin-left: 0;

        &:after {
          display: block;
          content: ' ';
          padding-bottom: 100%;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }

    .ei-image-picker-item {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 100%;

      .ei-image-picker-item-remove {
        width: 25px;
        height: 25px;
        flex-center(row, center, center);
        position: absolute;
        right: -8px;
        top: -8px;
        text-align: center;
        vertical-align: top;
        z-index: 2;
        border-radius: 50%;
        background-size: 15px auto;
        background-color: rgba(0, 0, 0, 0.4);
        transform: scale(0.9);

        & > i {
          font-size: 45px;
          text-size-adjust: none;
          transform: scale(0.6);
          color: red;
          font-weight: 100;
        }
      }

      .ei-image-picker-item-content {
        height: 100%;
        width: 100%;
        border-radius: 3px;
        background-size: cover;
      }

      img {
        width: 100%;
      }
    }

    .ei-image-picker-upload-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .icon-tianjiatupian1 {
      vertical-align: middle;

      @media (max-width: 767px) {
        font-size: 18vw;
      }

      @media (min-width: 768px) {
        font-size: 9vw;
      }

      @media (min-width: 992px) {
        font-size: 4vw;
      }
    }
  }
}
</style>

