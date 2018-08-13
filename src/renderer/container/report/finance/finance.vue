<template>
    <div class="finance">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="财务报表"></zing-head>
        <group>
            <cell title="明细分类账" is-link link="/report/mingxifenleizhang"> </cell>
            <cell title="总分类账" is-link link="/report/zongfenleizhang"> </cell>
            <cell title="数量金额明细账" is-link link="/report/shuliangjinemingxizhang"> </cell>
            <cell title="数量金额总账" is-link link="/report/shuliangjinezongzhang"> </cell>
            <cell title="科目余额表" is-link link="/report/kemuyuebiao"> </cell>
            <cell title="试算平衡表" is-link link="/report/shisuanpinghengbiao"> </cell>
            <cell title="凭证汇总表" is-link link="/report/pingzhenghuizongbiao"> </cell>
            <cell title="资产负债表" is-link link="/report/zichanfuzhaibiao"> </cell>
            <cell title="利润表" is-link link="/report/lirunbiao"> </cell>
        </group>
    </div>
</template>

<script>
    import { Group, Cell } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "finance",
        components: { ZingHead,Group, Cell }
    }
</script>

<style scoped>

</style>
