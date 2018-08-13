<template>
    <div>
        <zing-head title="会员卡详情"></zing-head>
        <scroll ref="scroll"
                :scrollbar="true"
                :pullUpLoad="{threshold: 0,txt: {more: 'more', noMore: 'noMore'}}"
                :startY="0">
            <group label-width="75px" label-margin-right="20px" label-align="right">
                <cell value-align="left" title="特权说明">{{freedDes}}</cell>
                <cell value-align="left" title="有效日期">{{effectiveData}}</cell>
                <cell value-align="left" title="可用时段">{{useTimeSlot}}</cell>
                <cell value-align="left" title="电话">{{tel}}</cell>
                <cell value-align="left" title="商户服务">{{merchantService}}</cell>
                <cell value-align="left" title="使用须知">{{useOfKnowledge}}</cell>
            </group>
        </scroll>
        
    </div>
</template>
<script>
    import ZingHead from '../../components/zingHead/ZingHead.vue';
    import Scroll from '../../components/scroll/Scroll.vue';
    import { Cell,Group } from 'vux'
    
    export default {
        components: {
            ZingHead,
            Cell,
            Group,
            Scroll
        },
        data() {
            return {
                freedDes:'回复啦是否哈萨克好的发货黑暗时代恢复良好啊是独立访客哈拉省的付货款啦还是短发来看哈是独立开发哈看来就是',
                effectiveData:'永久有效',
                useTimeSlot:'周一至周五 全天',
                tel:'10086',
                merchantService:'免费wifi 免费茶水',
                useOfKnowledge:'话费卡还是会发生看到回复了啊师傅哈萨克楼的回复卡拉还是发哈萨克的了符合卡洛斯电话发拉萨的广泛交流卡还是老地方'
            }
        },
        computed: {},
        methods: {}
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';

</style>