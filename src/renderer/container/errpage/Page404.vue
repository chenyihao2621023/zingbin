<template>
  <div class="error404">
    <div class="error404-body-con">
      <div class="error404-body-con-title">
        <div>
          <span>4</span><span class="error404-0-span"></span><span class="error404-key-span"><span class="rotateZ">4</span></span>  
        </div>
        
      </div>
      <p class="error404-body-con-message">该页面不存在</p>
      <div class="error404-btn-con">
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
console.log(this)
export default {
  name: "Page404",
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


.error404{
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
            .error404-0-span{
              display: inline-block;
              position: relative;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: 10px solid #ed3f14;
              color: #ed3f14;
            }
            .error404-key-span{
              display: inline-block;
              position: relative;
              border-radius: 50%;
              margin-right: 10px;
              line-height: 190px;
              span.rotateZ{
                  display: inline-block;
                  font-size: 80px;
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

