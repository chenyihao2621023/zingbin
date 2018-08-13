<template>
    <div class="userSalaryReportList">
        <ZingHead title="薪资统计报表">
        </ZingHead>
        <div class="content">
            <group  label-margin-right="2em" label-align="left">

                <cell title="职员台账" is-link link="/userSalaryReport/zytzReport" ></cell>
                <cell title="职员台账汇总表" is-link link="/userSalaryReport/zytzhzReport"></cell>
                <cell title="工资结构分析表" is-link @click.native="wait"></cell>
                <cell title="工资发放表" is-link link="/userSalaryReport/gzReport"></cell>
                <cell title="工资汇总表" is-link link="/userSalaryReport/gzhzReport"></cell>
                <cell title="工资统计表" is-link link="/userSalaryReport/gztjReport"></cell>
                <cell title="个人所得税报表" is-link @click.native="wait"></cell>
                <cell title="工资费用分配表" is-link @click.native="wait"></cell>
                <cell title="计件工资汇总表" is-link @click.native="wait"></cell>
                <cell title="计件工资明细表" is-link @click.native="wait"></cell>
            </group>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import {Group,Cell} from 'vux'
    export default {
        name: "userSalaryReportList",
        components: {
            ZingHead,
            Group,Cell
        },
        data() {
            return {
               
            }
        },
        created() {
           
        },
        methods:{
           wait(){
                this.$vux.toast.text("维护中！")
           }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/unify.styl';
    .userSalaryReportList {
        height 100%;
    }
    .content{
        height calc(100% - 50px);
    }
</style>
