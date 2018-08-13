<template>
    <div class="drop-out">
        <zing-head>
            <div slot="header-left">
                <div class="zuojiantou-wrapper" @click="comeback">
                    <i class="iconfont icon-zuojiantou" ></i>
                    <span>返回</span>
                </div>
            </div>
        </zing-head>
        <div class="drop-out-main">
            <div class="drop-out-main-header">
                <img src="../../assets/img/aboutZing.png" alt="">
                <p>{{versionNumber}}</p>
            </div>
            <div class="drop-out-main-text">
                <p>{{text}}</p>
                <h4>英商使命：让管理像聊天一样简单！</h4>
            </div>
            <group class="drop-out-main-group">
                <cell @click.native="clickItem(itemType.type)" v-for="(itemType,index) in functionType" :key="index" :title="itemType.title" is-link></cell>
            </group>
        </div>
        <div class="drop-out-footer" @click="clickDropOut">
            <img src="../../assets/img/dropouot.png" alt="">
            关闭英商APP
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Cell,Group } from "vux"
    import { isMhApp } from '../../utils/fn'
    import docCookie from '../../utils/cookies'
    export default {
        name: "DropOut",
        components: {
            ZingHead,Cell,Group
        },
        data() {
          return {
              functionType:[
                  {
                      type: 'features',
                      title: "功能介绍"
                  },
                  {
                      type: 'service',
                      title: "服务协议"
                  }
              ],
              // 以后动态获取
              versionNumber:isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.getVersion)==='function'?MHAppapi.getVersion():"",
              text:"  英商是基于SAAS的一站式企业互联网应用软件平台，其通过移动端和电脑端为企业员工和客户提供全方位的IM、OA、客服、CRM、ERP（含财务）、电商等功能，帮助企业轻松实现高效率移动办公。"
          }
        },
        methods: {
            comeback() {
                this.$router.go(-1)
            },
            clickItem(type) {
                switch (type) {
                    case "features":
                        this.$router.push({
                            path:"/featuresService",
                            query: {
                                title:"功能介绍"
                            }
                        })
                       // window.location = "/SRender?jsLoader=home%2FfunctionIntroducedLoader&tpl=home%2FfunctionIntroduced"
                        break;
                    case "service":
                        this.$router.push({
                            path:"/featuresService",
                            query: {
                                title:"服务协议"
                            }
                        })
                        //window.location = "/SRender?jsLoader=home%2FserviceAgreementLoader&tpl=home%2FserviceAgreement"
                        break;
                    default:
                        console.log(type);
                }
            },
            clickDropOut() {
                console.log('dropOut');
                if(isMhApp() && typeof(MHAppapi)!='undefined' && typeof(MHAppapi.logout)==='function'){
                    MHAppapi.logout(true);
                }

                if (docCookie.getItem('reqtoken')) {
                    docCookie.removeItem('reqtoken')
                }

                if (docCookie.getItem('Authorization')) {
                    docCookie.removeItem('Authorization')
                }

            }
        }
    }
</script>
<style>
    .drop-out-main-group .weui-cell_access .weui-cell__ft:after {
        width: 13px !important;
        height: 13px !important;
    }
    .weui-cell:before {
        left: 0 !important;
    }
    /*body .drop-out-main-group .weui-cell_access:active {*/
        /*background-color: #fff !important;*/
    /*}*/
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .drop-out
      width 100%
      height 100%
      background #F2F2F2
      &-main
        width 100%
        &-header
           padding 10px 59px
           img
            width 100%
            max-height 80px
           p
            text-align center
            font-size 14px
            padding-top 11px
        &-text
           background #fff
           padding 11px 9px
           font-size 16px
           text-indent 16px
           color #101010
           p
            line-height 22px
           h4
            margin-top 10px
        &-group
            margin-top 7%
      &-footer
         position absolute
         bottom 0
         left 0
         width 100%
         text-align center
         padding 11px 0
         background #fff
         font-size 16px
         color  #101010
         img
           width 24px
           height 24px
</style>
