<template>
    <div class="previewer">
        <ul class="previewer-box">
            <li class="previewer-box-item" :class="previewerImgClass" v-for="(item, index) in imageList" :key="index" @click="show(index)">
                <img class="previewer-box-img" :src="item.src">
            </li>
        </ul>
        <div v-transfer-dom>
            <previewer :list="imageList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
    </div>
</template>

<script>
    import { Previewer, TransferDom } from 'vux'
    import { getImageUrl } from '../../../utils/fn'
    import LazyImage from '../../../directives/lazyimage/lazy-image'
    export default {
        directives: {
            TransferDom,
            LazyImage
        },
        components: {
            Previewer,
        },
        props: {
          imageList: {
              type: Array,
              default() {
                  return []
              }
          }
        },
        data () {
            return {
                options: {
                    getThumbBoundsFn (index) {
                        // console.log(document.querySelectorAll('.previewer-box-img')[index]);
                        let thumbnail = document.querySelectorAll('.previewer-box-img')[index]
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        let rect = thumbnail.getBoundingClientRect()
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                    }
                }
            }
        },
        computed : {
            previewerImgClass () {
                let img_leg = this.imageList.length;
                let c = '';
                if (img_leg === 2) {
                   c = 'previewer_tow'
                }
                if (img_leg === 3) {
                   c = 'previewer_tr'
                }
                if (img_leg === 4) {
                    c = 'previewer_fou'
                }
                if (img_leg > 4) {
                    c += ' previewer_f'
                }
                return c
            }
        },
        methods: {
            logIndexChange (arg) {
                // console.log(arg)
            },
            show (index) {
                this.$refs.previewer.show(index)
            },
            getImageUrl
        },
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .previewer-box
      display flex
      flex-wrap wrap
      .previewer-box-item
        max-height:100px;
        overflow:hidden;
        width 250px
        height 130px
        padding 2px
        box-sizing border-box
        .previewer-box-img
           max-height:300px
           max-width:200px
      .previewer_tow
          max-width 50%
      .previewer_f
          max-height 70px !important
          max-width 33.3% !important
      .previewer_tr
          max-width 33.3%
          max-height 85px
      .previewer_fou
          max-width 50%
          max-height 100px
</style>
