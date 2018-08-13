<template>
    <div class="attendanceHome">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'attendanceHome',
        data() {
            return {

            };
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .attendanceHome {
        font-size: 16px;
        height: 100%;
    }
</style>
