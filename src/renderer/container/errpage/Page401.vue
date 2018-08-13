<template>
  <div class="error401">
    <div class="error401-body-con">
      <div class="error401-body-con-title">
        <div>
          <span>4</span><span class="error401-0-span"></span><span class="error401-key-span"><span class="rotateZ">1</span></span>  
        </div>
        
      </div>
      <p class="error401-body-con-message">您没有权限访问此页面</p>
      <div class="error401-btn-con">
        <flexbox>
          <flexbox-item>
            <x-button type="default" >回到主页</x-button>
          </flexbox-item>
        </flexbox>
        
        
      </div>
   
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from 'vux'
export default {
  name: "Page401",
  components: {Flexbox, XButton, FlexboxItem},
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

@keyframes error401animation {
    0% {
        transform: rotateZ(0deg);
    }
    40% {
        transform: rotateZ(-20deg);
    }
    45% {
        transform: rotateZ(-15deg);
    }
    50% {
        transform: rotateZ(-20deg);
    }
    55% {
        transform: rotateZ(-15deg);
    }
    60% {
        transform: rotateZ(-20deg);
    }
    100% {
        transform: rotateZ(0deg);
    }
}
.error401{
    height: 100%
    flex-center(row, center, start)
    &-body-con{
        width: 70%
        &-title{
            flex-center(row, center, center)
            text-align: center;
            font-size: 80px;
            font-weight: 700;
            color: #2d8cf0;
            // height: 260px;
            // line-height: 260px;
            .error401-0-span{
              display: inline-block;
              position: relative;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: 10px solid #ed3f14;
              color: #ed3f14;
            }
            .error401-key-span{
              display: inline-block;
              position: relative;
              border-radius: 50%;
              margin-right: 10px;
              line-height: 190px;
              span.rotateZ{
                  display: inline-block;
                  font-size: 80px;
                  // position: absolute;
                  // left: 20px;
                  // transform: translate(-50%,-60%);
                  // transform-origin: center bottom;
                  animation: error401animation 2.8s ease 0s infinite;
              }
            }
        }
        &-message{
            display: block;
            text-align: center;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: 4px;
            color: #dddde2;
        }
    }
    &-btn-con{
        text-align: center;
        padding: 20px 0;
        margin-top: 40px;
    }
}
</style>

