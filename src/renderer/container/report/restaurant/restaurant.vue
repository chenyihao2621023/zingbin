<template>
    <div class="restaurant">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="点菜报表"></zing-head>
        <group>
            <!--<cell title="整体销售情况统计" is-link link="/report/restaurant_ztxsqk"> </cell>-->
            <cell title="菜品销售情况统计" is-link link="/report/restaurant_cpxsqk"> </cell>
            <cell title="员工销售情况统计" is-link link="/report/restaurant_ygxsqk"> </cell>
            <cell title="日服务整体情况" is-link link="/report/restaurant_rfwztqk"> </cell>
            <cell title="员工服务情况分析" is-link link="/report/restaurant_ygfwqkfx"> </cell>
            <cell title="销售对账表" is-link link="/report/restaurant_xsdzb"> </cell>
            <cell title="日销售情况统计" is-link link="/report/restaurant_rxsqktj"> </cell>
            <cell title="点菜营业日报表" is-link link="/report/restaurant_dcyyrbb"> </cell>
            <cell title="前台结班表" is-link link="/report/restaurant_qtjbb"> </cell>
        </group>
    </div>
</template>

<script>
    import { Group, Cell } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "restaurant",
        components: { ZingHead,Group, Cell }
    }
</script>

<style scoped>

</style>
