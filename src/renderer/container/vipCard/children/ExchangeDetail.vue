<template>
    <el-container>
        <el-main>
            <div class="p10">
                <el-form :inline="true" :model="searchParam" class="demo-form-inline">
                    <el-form-item size="small">
                        <el-input v-model="searchParam.keywords" clearable placeholder="关键词"></el-input>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-button type="primary el-button--small" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
             <exchange-detail  ref="table" ></exchange-detail>
             
        </el-main>
    </el-container>
</template>
<script>
import ExchangeDetail from "../componets/ExchangeDetailComponets.vue"
    export default {
        components:{ ExchangeDetail },

        data() {
            return {
                searchParam :{
                    keywords:""
                },
                searchValueTEMP: ''
            }
        },
        created() {
            

        },
        methods: {
             search(){
                 console.log(this.searchValueTEMP)
                this.$refs.table.search(this.searchParam.keywords)

             }
        },
    }
</script>
<style scoped>
    .p10{
        padding:10px;
    }
    .right{
        float: right;
    }
    .active{
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }
</style>
