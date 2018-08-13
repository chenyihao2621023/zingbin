<template>
    <div class="cardList">
        <zing-head title="卡片列表"></zing-head>
        <scroll ref="scroll"
                :data="items"
                :scrollbar="true"
                :pullDownRefresh="{threshold: 90,stop: 40}"
                :pullUpLoad="{threshold: 0,txt: {more: 'more', noMore: 'noMore'}}"
                :startY="0"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
            <div v-if="list.length!=0">
                <card v-for="(item,index) in list" :key="index" :bg="item.bg" :cardImg="item.cardImg" :cardName="item.cardName" :cardType="item.cardType" :cardNum="item.cardNum" :QRCode="item.QRCode" @click.native="listJump"></card>
            </div>
        </scroll>
        
    </div>
</template>
<script>
    import ZingHead from '../../components/zingHead/ZingHead.vue';
    import Card from '../../components/card/Card.vue';
    import Scroll from '../../components/scroll/Scroll.vue';
    export default {
        components: {
            ZingHead,
            Card,
            Scroll,
        },
        data() {
            return {
                items:[],
                list:[
                    {
                        cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                        cardName:'英立讯科技',
                        cardType:'普通会员',
                        cardNum:'9571 7163 9143 62894',
                        QRCode:'http://img1.imgtn.bdimg.com/it/u=1038454161,233723092&fm=27&gp=0.jpg',
                        bg:'http://img5.imgtn.bdimg.com/it/u=1109917053,4211270766&fm=27&gp=0.jpg'
                    },
                    {
                        cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                        cardName:'英立讯科技',
                        cardType:'白金会员卡',
                        cardNum:'9571 7163 9143 62894',
                        QRCode:'http://img1.imgtn.bdimg.com/it/u=1038454161,233723092&fm=27&gp=0.jpg',
                        bg:'http://img0.imgtn.bdimg.com/it/u=2129473072,572477714&fm=200&gp=0.jpg'
                    },
                    {
                        cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                        cardName:'英立讯科技',
                        cardType:'黄金会员卡',
                        cardNum:'9571 7163 9143 62894',
                        QRCode:'http://img1.imgtn.bdimg.com/it/u=1038454161,233723092&fm=27&gp=0.jpg',
                        bg:'http://img0.imgtn.bdimg.com/it/u=2129473072,572477714&fm=200&gp=0.jpg'
                    },
                    {
                        cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                        cardName:'英立讯科技',
                        cardType:'黑卡',
                        cardNum:'9571 7163 9143 62894',
                        QRCode:'http://img1.imgtn.bdimg.com/it/u=1038454161,233723092&fm=27&gp=0.jpg',
                        bg:'http://img0.imgtn.bdimg.com/it/u=2129473072,572477714&fm=200&gp=0.jpg'
                    },
                    {
                        cardImg:'http://f12.baidu.com/it/u=2754208607,630952272&fm=72',
                        cardName:'英立讯科技',
                        cardType:'白金会员卡',
                        cardNum:'9571 7163 9143 62894',
                        QRCode:'http://img1.imgtn.bdimg.com/it/u=1038454161,233723092&fm=27&gp=0.jpg',
                        bg:'#ccc'
                    },
                ]
            }
        },
        computed: {},
        methods: {
            onPullingDown() {
                // 模拟更新数据
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 2000);
            },
            onPullingUp() {
                // 更新数据
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            listJump() {
                this.$router.push({
                    path:'/memberCard'
                })
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';
    .cardList {
        height: 100%;
    }
</style>