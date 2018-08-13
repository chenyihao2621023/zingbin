<template>
    <div>
        <zing-head title="卡券包">
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
            </div>
        </zing-head>
    
        <div v-show="showSearch">
            <search position="absolute" auto-scroll-to-top top="46px"></search>
        </div>
        
        <div class="myCard">
            <div class="cardTop">
                <span>我的会员卡</span>
                <span @click="lookAll">查看全部（X）</span>
            </div>
            <card :bgImg="bgImg" :cardImg="cardImg" :cardName="cardName" :cardType="cardType" :cardNum="cardNum" :QRCode="QRCode" @click.native="toCard"></card>
        </div>
        
    </div>
</template>
<script>
    import ZingHead from 'components/zingHead/ZingHead.vue';
    import Card from 'components/card/Card.vue';
    import { Search } from 'vux';
    
    export default {
        components: {
            ZingHead,
            Search,
            Card
        },
        data() {
            return {
                showSearch: false,
                results: [],
                value: '',
                cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                cardName:'英立讯科技',
                cardType:'白金会员卡',
                cardNum:'9571 7163 9143 62894',
                QRCode:'http://img0.imgtn.bdimg.com/it/u=3972758019,3651716749&fm=27&gp=0.jpg',
                bgImg:'http://img0.imgtn.bdimg.com/it/u=2129473072,572477714&fm=200&gp=0.jpg'
            }
        },
        computed: {},
        methods: {
            search() {
                this.showSearch = !this.showSearch;
            },
            lookAll() {
                this.$router.push({
                    path:'/cardList',
                })
            },
            toCard() {
                this.$router.push({
                    path:'/memberCard',
                })
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';
    
    .myCard{
        width: 100%;
        padding:10px;
        .cardTop{
            display:flex;
            justify-content:space-between;
            width: 100%;
            height: 50px;
            line-height:50px;
            span:first-child{
                color:#000;
            }
            span:last-child{
                color:#0000ff;
            }
        }
    }

</style>