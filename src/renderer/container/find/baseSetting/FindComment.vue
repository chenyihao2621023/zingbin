<template>
   <div class="find-comment">
       <zing-head title="评论">
           <!--<div slot="header-right">-->
                  <!--<span class="find-commont-btn" @click="onClickRightTitle">-->
                      <!--评论-->
                  <!--</span>-->
           <!--</div>-->
       </zing-head>
       <all-publish :cacheFlag="true" warningText="暂无评论" :postLoad="postLoad" @onPullingUp="onPullingUp" @onPullingDown="onPullingDown" :showBottom="false" :dataList="commentList" :showRemove="false"></all-publish>
       <!--<div class="my_comment_dialog">-->
               <!--<div class="my_comment_textarea">-->
                   <!--<div class="comment_fontColor needsclick" ref="commentText" @click="clearPlaceholder" contenteditable="true">{{placeholder}}</div>-->
               <!--</div>-->
               <!--<div class="my_comment_anniu">-->
                   <!--<div class="my_comment_btn" @click="onConfirm">发送</div>-->
               <!--</div>-->
       <!--</div>-->
       <div class="find-input-box border-top-1px">
           <div class="find-input-text">
               <div class="input-scroll-find">
                      <textarea
                          ref="input"
                          @blur="onBlur"
                          @focus="onFocus"
                          v-model="commentText"
                          rows="1"
                          placeholder="请输入评论..."
                          v-adjust-and-scroll
                      />
               </div>
           </div>
           <div class="input-box-right">
               <div
                   class="send-btn"
                   @click="onConfirm">
                   发送
               </div>
           </div>
       </div>
   </div>
</template>
<!--<x-textarea placeholder="请输入评论内容" ref="commentTextarea"-->
<!--v-model="commentTitle" class="comment_fontColor"-->
<!--:autosize="autosize" rows="1" cols="20"-->
<!--@on-change="onChange"-->
<!--&gt;-->
<!--</x-textarea>-->
<!--<textarea placeholder="请输入评论内容" ref="commentTextarea"-->
<!--v-model="commentTitle" class="comment_fontColor"-->
<!--rows="1" cols="20"-->
<!--@on-change="onChange"-->
<!--:autoHeight="true"-->
<!--&gt;-->

<!--</textarea>-->
<script>
    import ZingHead from '@/components/zingHead/ZingHead.vue';
    import AllPublish from './AllPublish'
    import { XDialog,XTextarea,Group } from 'vux'
    import { mapMutations } from 'vuex';
    import { getNewDate } from './findUilt'
    import AdjustAndScroll from "../../chat/adjust-and-scroll";
    import detailchatInputBox from '../../taskManage/detail/chatBottom/detailchatInputBox';
    import { Z_IsEmpty20,addTypeCache,getImageUrl } from "../../../utils/fn"
    export default {
        name: "FindComment",
        directives: {
            AdjustAndScroll
        },
        components: {
            AllPublish,
            XDialog,
            XTextarea,
            Group,
            ZingHead,
            detailchatInputBox
        },
        data () {
            return {
                commentList: [],
                // showCommentDialog: false,
                commentTitle:'',
                hasMore:true,
                pageNumber:1,
                postLoad:false,
                clickInputFlag:true,
                commentText:'',
                loading_com:true,
                // flagAutoHe:false
            }
        },
        computed: {
             rowId () {
                return this.$route.query.rowId
             },
        },
        watch: {
          $route () {
              this.getCommentInfoByDiscoveryId()
          }
        },
        created () {
           this.initData();
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
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
        methods: {
          ...mapMutations({
             setMode: 'SET_MODE'
          }),
           // onChange() {
           //     this.$nextTick(() => {
           //        this.autosize = document.querySelector(".comment_fontColor").clientHeight < 101;
           //         document.querySelector(".comment_fontColor").scrollHeight.log
           //        if (document.querySelector(".comment_fontColor").clientHeight < 101) {
           //            this.autosize = true
           //        } else {
           //            this.autosize = false
           //        }
           //    })
           // },
           //  clearPlaceholder() {
           //      if (this.$refs.commentText.innerText !== this.placeholder) return;
           //      this.$nextTick(() => {
           //          this.$refs.commentText.innerText = '';
           //          this.clickInputFlag = false
           //     })
           //  },
           // onCancel () {
           //     this.showCommentDialog = false;
           //     this.$nextTick(() => {
           //         this.$refs.commentText.innerText = ''
           //     })
           // },
           //
          onBlur() {

            },
          onFocus() {

            },
          onPullingUp (cb) {
               const _this = this;
               setTimeout(() => {
                   if (_this.hasMore) {
                       _this.pageNumber += 1;
                       _this.getCommentInfoByDiscoveryId(_this.pageNumber);
                       cb()
                   } else {
                       cb(false)
                   }
               },1000)
           },
           onPullingDown (cb) {
               let _this = this;
               setTimeout(() => {
                   _this.pageNumber = 1;
                   _this.getCommentInfoByDiscoveryId(_this.pageNumber);
                   setTimeout(() => {
                       cb()
                   },2000)

               },1000)
           },
           bottomToast (msg, type,wh) {
               let _this = this
               if (!msg) return
               let tp = type ? type : 'success';
               let width = wh ? wh : '8em';
               this.$vux.toast.show({
                   text: msg,
                   type: tp,
                   position: 'middle',
                   width,
                   onHide() {
                       _this.bottomToast('')
                   }
               })
           },
           onConfirm () {
                  if (!this.loading_com) return;
                  const _this = this;
                  if (!_this.commentText.length) {
                      _this.bottomToast('请输入评论内容','warn','10em');
                      return
                  }
                  _this.loading_com = false;
                  let url = `/zingbiz/discovery/commentinfo/insertCommentInfo`;
                  let params = {
                      discoveryId: _this.rowId,
                      commentContent: _this.commentText
                  };
                  _this.$http.post(url,params).then(res => {
                      _this.loading_com = true;
                      if (res.data.success) {
                          _this.bottomToast('发表评论成功');
                          _this.pageNumber = 1;
                          _this.commentText = "";
                          _this.$refs.input.style.height = "30px";
                          _this.getCommentInfoByDiscoveryId();
                      }
                  },err => {
                      console.log(err);
                      _this.bottomToast('发表评论失败','warn')
                  })
           },
           processData (comment) {
               let { total,data } = comment;
               if (!data.length) return;
               let o = data.map(item => {
                   let commenter = {};
                   let userHead;
                   commenter.source = item;
                   commenter.name = item.commenterName;
                   userHead = !Z_IsEmpty20(item.commentCardUrl) && item.commentCardUrl.length > 2 && '/checkJpg/' + item.commentCardUrl.substring(0, 2) + '/' + item.commentCardUrl + '.jpg';
                   userHead = addTypeCache('zIsCacheDirect', userHead);
                   commenter.src = userHead;
                   commenter.showInput = false;
                   commenter.text = item.commentContent;
                   let leg = item.commentContent.match(/[\n]/g);
                   commenter.hideText = (leg && leg.length > 4) || item.commentContent.length > 153;
                   commenter.showText = false;
                   commenter.rowId = item.commentId;
                   commenter.time = getNewDate(item.createTime);
                   return commenter
               });
               if (this.pageNumber === 1) {
                   this.commentList = o;
               } else {
                   this.commentList = [...this.commentList,...o]
               }
               console.log(this.commentList);
               this.hasMore = total > this.commentList.length;
           },
           getCommentInfoByDiscoveryId (num) {
               const _this = this;
               let pageNumber = num || 1;
               let url = '/zingbiz/discovery/commentinfo/getCommentInfoByDiscoveryId';
               let params = {
                   "discoveryId": _this.rowId,pageNumber,"pageSize":8
               }
               _this.$http.post(url,params).then(res => {
                   if (res.data.success) {
                       _this.processData(res.data.data);
                       _this.postLoad = true
                   }
               })
           },
           getImageUrl,
           initData () {
             this.getCommentInfoByDiscoveryId();
           }
       }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';
    .find-comment
        height 100%
    .find-input-box
        position: absolute
        bottom 0
        left 0
        z-index 1000
        padding: 6px 10px;
        background-color: #f2f2f2;
        width: 100%;
        border-top: 1px solid #d9d9d9;
        flex-center(space-between, center);
        .find-input-text
            flex: 1;
            padding: 0 10px;
            .input-scroll-find
              width: 100%;
              overflow: hidden;
              textarea
                width: calc(100% + 10px);
                padding: 5px 10px 5px 0;
                border: none;
                border-bottom: 1px #d0d0d0 solid;
                background-color: transparent !important;
                max-height: 84px;
                font-size: 16px;
                resize: none;
                &:focus
                    outline: none
        .input-box-right
            flex-center(row, center, center);
            & > .send-btn
                display: inline-block;
                width: 44px;
                height: 30px;
                font-size: 16px;
                line-height: 32px;
                text-align: center;
                background-color: #ff8000;
                color: #fff;
                border-radius: 3px;
                user-select: none
</style>
