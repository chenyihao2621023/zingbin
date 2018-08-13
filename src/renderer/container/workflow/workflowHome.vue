<template>
    <div class="workflowHome">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'workflowHome',
        data() {
            return {

            };
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .workflowHome {
        height: 100%;
        background-color: #fff !important;
    }
</style>
