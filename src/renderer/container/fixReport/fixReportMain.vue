<template>
    <div class="outwrapper">
        <ZingHead title="报表查询"></ZingHead>
        <scroll :observeDOM="true" class="list-wrap">
            <group>
                <cell title="固定资产清单" is-link link="/fixReport/fixedAssetsList"> </cell>
                <cell title="固定资产变动情况表" is-link link="/fixReport/fixedAssetsChange"> </cell>
                <cell title="固定资产增减表" is-link link="/fixReport/fixedAssetsIndecrease"> </cell>
                <cell title="折旧费用分配表" is-link link="/fixReport/depreAllocatTable"> </cell>
                <cell title="固定资产明细账" is-link link="/fixReport/fixAssetsAccount"> </cell>
                <cell title="固定资产折旧明细表" is-link link="/fixReport/fixAssetsDepreciation"> </cell>
                <cell title="固定资产折旧汇总表" is-link link="/fixReport/depreciationSumTable"> </cell>
                <cell title="固定资产数量统计表" is-link link="/fixReport/fixedAssetsTotal"> </cell>
                <cell title="变动历史记录表" is-link link="/fixReport/changeHistory"> </cell>
                <cell title="固定资产到期提示表" is-link link="/fixReport/fixedAssetsPrompt"> </cell>
                <cell title="固定资产处理情况表" is-link link="/fixReport/disposeTable"> </cell>
                <cell title="固定资产构成分析表" is-link link="/fixReport/compositionAnalysis"> </cell>
                <cell title="附属设备明细表" is-link link="/fixReport/accessoryTable"> </cell>
            </group>
        </scroll>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import scroll from "@/components/scroll/Scroll";
    import { Group, Cell } from 'vux'
    export default {
        name: "fix-report-main",
        components:{
            ZingHead,
            scroll,
            Group,
            Cell
        },
        data() {
            return {
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .list-wrap{
            height calc(100% - 50px)
        }
    }
</style>
