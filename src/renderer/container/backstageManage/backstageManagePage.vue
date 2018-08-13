<template>
    <div id="backstageManagePage" class="backstageManagePage">
        <zing-head :title="'后台管理'"></zing-head>
        <GridCard>
            <div slot="cardLeft" class="left" @click="gotoOrgPower">
                <div class="left-wrapper">
                    <p class="left-wrapper-title">权限管理</p>
                    <div class="left-wrapper-desc"></div>
                </div>
            </div>
        </GridCard>
    </div>
</template>

<script>
    import { Selector, Search, Group, XDialog } from "vux";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";

    export default {
        name: "backstageManagePage",
        components: {
            GridCard, ZingHead, Selector, Search, Group, XDialog
        },
        data: () => ({}),
        created() {

        },
        methods: {
            gotoOrgPower() {
                this.$router.push({ path: "/backstageManage/orgPower" });
            },
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

</style>

