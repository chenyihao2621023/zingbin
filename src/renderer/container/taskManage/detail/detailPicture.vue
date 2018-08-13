<template>
    <div>
        <div class="detailPictureWrap" v-for="(picture,index) in pictures" :key="index">
            <div class="pictureAvatar">
                <img :src='picture[2]' style="width:50px" @click="fangDa(index)">
            </div>
            <div class="pictureMasage">
                <p class="picture pictureName">图片名称:{{picture[0]}}</p>
                <p class="picture pictureSize">大小：{{(picture[1]/1024).toFixed(2) + 'kb'}}</p>
                <p class="picture pictureTime">添加时间：{{picture[3]}}</p>
            </div>
            <div class="pictureDel">
                <i class="icon iconfont icon-shanchu1" @click="delPicture(picture)"></i>
            </div>
            <div class="picturedownload">
                <i class="icon iconfont icon-yulanxiazai" @click="downFile(picture[0],picture[2])"></i>
            </div>
        </div>
    </div>
</template>
<script>
import avatar from "@/components/avatar/Avatar"
export default {
  components: {
    avatar,
  },
  props: ["fiterPicture", "PCdata", "insertParams", "updadeTaskActivits",'show'],
  data(){
    return {

    };
  },
  computed: {
    pictures() {
      let arr1 = [];
      let fiterPicture = this.fiterPicture;
      for (let i = 0; i < fiterPicture.length; i++) {
        let val = fiterPicture[i].val;
 //        let obj = {}
//        let arr2 = val.split(";");
//        obj.picArr = arr2
//        obj.gentime = fiterPicture[i].genTime.split(' ')[0]
//        obj.activitieId = fiterPicture[i].activitieId
//        obj.routing = fiterPicture[i].routing
//           arr1.push(obj);

        let arr2 = val.split(";");
        arr2.push(fiterPicture[i].genTime.split(' ')[0])
        arr2.push(fiterPicture[i].activitieId)
        arr2.push(fiterPicture[i].routing)
        arr1.push(arr2);
      }
      return arr1;
    }
  },
  mounted() {
    this.$on("ifPicture", PCdata => {
      this._getpictures(PCdata);
    });
  },
  methods: {
    delPicture(picture) {
      let _this = this
      let url = "/ZingMH/ZDesk/activity/mater/delActivity.action"
      let params = {
        activitieId: picture[4],
        routing:picture[5]
      }
      _this.$http.get(url,{ params:params })
        .then(res => {
          let TellDetail = true
          //delete 删除 update 修改
          let delOrUpdate = 'delete'
          //更新页面
          _this.updadeTaskActivits(picture[4],TellDetail,JSON.stringify({}),delOrUpdate)
          _this.$vux.toast.show({text:"删除成功",type:"success"})
        })
        .catch(err => {
          console.log(err)
        });
    },
    fangDa(index){
       this.show(index)
    },
    //下载
    downFile(fileName, src) {
      let a = document.createElement("a")
      let defaultType = {
        type: "application/json"
      };
      a.href = src;
      a.download = fileName;
      a.click(
        console.log('下载中')
      );
      window.URL.revokeObjectURL(defaultType);
    },
    _getpictures(PCdata) {
      if (PCdata) {
        this.pictures.push(PCdata);
      }
      let that = this;
      let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action";
      if (PCdata.data) {
        that.insertParams.val =
          PCdata.data.fileName +
          ";" +
          PCdata.data.fileSize +
          ";" +
          PCdata.data.relativePath;
        that.insertParams.prefixMsg = "添加图片";
        that.insertParams.type = "image";
        that.insertParams.reserved1 = PCdata.data.relativePath;
      }
      that.$http
        .get(url, { params: that.insertParams })
        .then(res => {
          //通知load
          let TellDetail = 1;
          let TellVal = {
            imgVal: {
              fileName: PCdata.data.fileName,
              fileSize: PCdata.data.fileSize,
              relativePath: PCdata.data.relativePath
            },
            filedVal: {
              fileName: ""
            },
            commentVal: {}
          };
          let TellValJSON = JSON.stringify(TellVal);
          that.updadeTaskActivits(res.data.data, TellDetail, TellValJSON);

          that.$vux.toast.show({ text: "添加成功", type: "success" });
        })
        .catch(err => {
          that.$vux.toast.show({ text: "添加失败", type: "false" });
          console.log(err);
        });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.detailPictureWrap {
    display: flex;
    width: 100%;
    padding: 5px 10px;

    &>img {
        width: 50px;
        height: 50px;
    }

    .pictureAvatar {
        flex: 1;
        max-width 80px
    }

    .pictureMasage {
            width 100%;
            margin-right 13px
            padding 5px 0;
            .picture {
                word-wrap break-word;
                word-break break-all;
                overflow hidden;
            }
            .pictureSize {
                word-break: break-all;
                word-wrap: break-word;
            }
    }

    .pictureDel, .picturedownload {
        justify-content: flex-end;
        flex: 0.4;
    }
}
</style>
