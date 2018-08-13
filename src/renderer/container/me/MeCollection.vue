<template>
    <div class="my-collection">
        <zing-head title="我的收藏">
            <div slot="header-right">
               <span class="header-search">
                  <i class="iconfont icon icon-ai-home" style="font-size: 25px"></i>
                </span>
            </div>
        </zing-head>
        <div class="vue-tab">
            <tab class="" :line-width="3">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="changeTab"
                          @click="defTab = item" :key="index">{{item}}
                </tab-item>
            </tab>
        </div>
        <div class="tab-content">
            <div class="tabDiv" v-show="showCommodity">
                商品
            </div>
            <div class="tabDiv" v-show="showStores">
                店铺
            </div>
            <div class="tabDiv" v-show="showBusiness">
                商号
            </div>
        </div>
    </div>
</template>
<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import { Tab, TabItem,AlertModule } from 'vux';
    export default {
        name: "MeCollection",
        components: {
            ZingHead,Tab,TabItem,AlertModule
        },
        data() {
            return {
                tabTitle: ["商品", "店铺",'商号'],
                defTab:"商品",
                showBusiness: false,
                showStores: false,
                showCommodity: false,
            }
        },
        methods: {
            changeTab(index) {
                switch (index) {
                    // case 0:
                    //   console.log('商品');
                    //   break;
                    // case 1:
                    //   console.log('店铺');
                    //   break;
                    case 2:
                      this.$router
                          .push({
                              path:'/frontdesk'
                          })
                        break;
                    default:
                        AlertModule.show({
                            title: "提示",
                            content: "维护中..."
                        })
                }
            }
        }
    }
</script>
<style>
    .my-collection .vue-tab .vux-tab-item{
        background: #F5F5F5;
        border: 1px solid #E8ECED !important;
    }
</style>
<style lang="stylus" scoped>
    .tab-content
       overflow: auto
</style>
