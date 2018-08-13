<template>
    <div>
        <div class="detailPictureWrap" v-for="(picture,index) in pictures" :key="index">
            <div class="pictureAvatar">
                <img :src='picture[2]' style="width: 100px">
            </div>
            <div class="pictureMasage">
                <div class="pictureNamewrap">
                    <span class="pictureName ">图片名称:</span>
                    <span class="pictureName2">{{picture[0]}}</span>
                </div>
                <span class="pictureSize">{{picture[1]}}</span>
                <span class="pictureSize">添加时间{{pictureGenTime}}</span>
            </div>
            <div class="pictureDel">
                <i class="icon iconfont icon-shanchu1"></i>
            </div>
            <div class="picturedownload">
                <i class="icon iconfont icon-wode1"></i>
            </div>
        </div>
    </div>
</template>
<script>
    import avatar from "@/components/avatar/Avatar";
    export default{
        components: {
            avatar
        },
        props: ['fiterPicture', 'PCdata', 'insertParams', 'updadeTaskActivits'],
        data () {
            return {
                pictureGenTime:'',//图片添加时间
            }
        },
        computed:{
            pictures() {
                let arr1 = []
                let fiterPicture = this.fiterPicture
                for (let i=0;i<fiterPicture.length;i++) {
                    let val = fiterPicture[i].val
                    let arr2 = val.split(';')
                    arr1.push(arr2)
                }
                return arr1
            }
        },
        mounted() {
            this.$on('ifPicture',(PCdata) => {
                this._getpictures(PCdata)
            })
        },
        methods: {
            _getpictures(PCdata) {
              if (PCdata) {
                  this.pictures.push(PCdata)
              }
                let that = this
                let url = "/ZingMH/ZDesk/activity/mater/insertActivity.action"
                if (PCdata.data){
                    that.insertParams.val = PCdata.data.fileName + ';' + PCdata.data.fileSize + ';' + PCdata.data.relativePath
                    that.insertParams.prefixMsg = '添加图片'
                    that.insertParams.type = 'image'
              }
                that.$http.get(url, { params: that.insertParams })
                    .then(res => {
                      let str = res.data.data.genTime
//                        2018-06-05 11:59:43
//                      this.pictureGenTime = str.Substring(4,9)
//                      console.log('pictureGenTime', this.pictureGenTime)
                        //通知load
                        let TellDetail = 1
                        let TellVal = {
                                imgVal:{
                                     fileName:PCdata.data.fileName,
                                     fileSize: PCdata.data.fileSize,
                                     relativePath:PCdata.data.relativePath
                                },
                                filedVal:{
                                    fileName:''
                                },
                                commentVal:{}
                          }
                        let TellValJSON = JSON.stringify(TellVal)
                        that.updadeTaskActivits(res.data,TellDetail,TellValJSON)

                        that.$vux.toast.show({text:"添加成功",type:"success"})
                    })
                    .catch(err => {
                        that.$vux.toast.show({text:"添加失败",type:"false"})
                        console.log(err)
                    })

            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
     .detailPictureWrap
        display flex
        width 100%
        padding 5px 10px
        &>img
           width 50px
           height 50px
        .pictureAvatar
           flex 1
        .pictureMasage
           flex  2
           .pictureNamewrap
              width 100%
              padding 5px 10px
              .pictureName
                 margin-left -15px
              .pictureName2
                  word-break:break-all
                  word-wrap:break-word
              .pictureSize
                  margin-left 8px
        .pictureDel,.picturedownload
           justify-content flex-end
</style>
