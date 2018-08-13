<template>
    <div class="task">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="任务报表"></zing-head>
        <group>
            <cell title="任务凭证统计" is-link link="/report/task_rwpz"> </cell>
            <cell title="任务成本统计" is-link link="/report/task_rwcb"> </cell>
            <cell title="成员任务统计月报" is-link link="/report/task_cyrwyb"> </cell>
        </group>
    </div>
</template>

<script>
    import { Group, Cell } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    export default {
        name: "task",
        components: { ZingHead,Group, Cell }
    }
</script>

<style scoped>

</style>
