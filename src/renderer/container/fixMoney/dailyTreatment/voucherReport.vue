<template>
    <div class="outwrapper">
        <ZingHead title="凭证生成报告"></ZingHead>
        <scroll class="wrap">
            <GridCard v-for="(item,index) in list" :key="index">
                <div slot="cardLeft" class="left">
                    <div class="left-wrapper">
                        <p class="left-wrapper-desc description">{{item}}</p>
                    </div>
                </div>
            </GridCard>
        </scroll>
        <flexbox class="inner">
            <flexbox-item class="interspace">
                <x-button type="primary" class="btn-common" @click.native="close()">关闭</x-button>
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import scroll from "@/components/scroll/Scroll";
    import { Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "voucher-report",
        components:{
            ZingHead,
            GridCard,
            scroll,
            Flexbox,
            FlexboxItem,
            XButton
        },
        data() {
            return {
                list:[]
            }
        },
        created() {
          this.list = this.$route.query.reportData
        },
        methods:{
            close () {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .wrap{
            height calc(100% - 100px)
        }
    }
    .description{
        color #101010
        padding 10px 0
    }
</style>
