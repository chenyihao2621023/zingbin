<template>
    <div id="userSalaryReport" class="userSalaryReport">
            <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "userSalaryReport",
        data() {
            return {

            };
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .userSalaryReport
        width 100%
        height 100%
</style>

