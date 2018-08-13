<template>
    <div class="find_demo">
        <a class="find_rukou" @click="goFind">发现入口<badge v-show="showRed"></badge></a>
        <a @click="goFindRecord">商号发现记录</a>
    </div>
</template>

<script>
    import { Badge } from 'vux'
    export default {
        name: "findDemon",
        components: {
            Badge
        },
        data () {
          return {
              showRed: false
          }
        },
        created () {
          this.getRed()
        },
        methods: {
            goFind () {
                this.$router.push({
                    path:'/find'
                })
            },
            goFindRecord () {
                this.$router.push({
                    path:'/find/allFindRecord'
                })
            },
            getRed () {
                const _this = this;
                let url = '/zingbiz/discovery/discoveryinfo/getRed';
                _this.$http.post(url,{}).then(res => {
                    if (res.data.success) {
                        _this.showRed = res.data.data
                    } else {

                    }
                },err => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .find_demo
      margin 10px 0 0 10px
      a
       display inline-block
       width 90px
       text-align center
       line-height 20px
       border 1px solid #6a6a6a

</style>
