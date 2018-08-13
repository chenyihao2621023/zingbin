<template>
    <div  class="workInfo">
        <div v-for="(data, index) in getDataInfo" :key="index">
                <group label-width="5em" label-margin-right="2em" label-align="left">
                    <cell title="开始时间" :value="data.startDate "></cell>
                    <cell title="结束时间" :value="data.endDate"></cell>
                    <cell title="职务" :value="data.roleCode"></cell>
                    <cell title="部门" :value="data.orgName "></cell>
                    <cell title="阶段性评价" :value="data.remark"></cell>
                    <cell ></cell>
                </group>
        </div>
        <div v-if="getDataInfo.length == 0">
            <p class="noData">暂无工作信息</p>
        </div>
    </div>
</template>
<script>
    import { Group, Cell } from 'vux'
    export default {
        components: {
            Group,  Cell
        },
        data() {
            return {
                 getDataInfo:[],//列表的数据
            }
        },
        created: function () {
            let that = this;
            this.getEmployeeJobsHistroy();
        },
        methods: {
            getEmployeeJobsHistroy() {
                let url = "/zingbiz/hrManager/EmployeeJobsHistory/getEmployeeJobsHistroyList"
                this.$http.post(url,{}).then(res => {
                   this.getDataInfo = res.data.data
                })
            }
        }
    }
</script>
<style scoped>
    .edit {
        min-height: 40px;
        line-height: 40px;
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
</style>
