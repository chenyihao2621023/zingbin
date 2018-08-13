<template>
    <div>
        <div class="prompt" v-show="prompt">该状态下没有数据</div>
        <scroll ref="scroll">
            <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index">
                <div slot="cardLeft" class="left">
                    <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="present"></avatar>
                    <div class="left-wrapper">
                        <p class="left-wrapper-title">{{item.pzId}}</p>
                        <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
                    </div>
                </div>
                <div slot="cardRight" class="right">
                    <i class="iconfont icon-gengduo" @click="workflow(item)"></i>
                </div>
            </GridCard>
        </scroll>
        <popup position = "right" v-model="popup" :popup-style="{top: 40 + '%',width:80 + '%',margin: 10 + '%',height:35 + 'px','overflow':'auto'}">
            <div class="setType">查看审批流</div>
        </popup>
    </div>
</template>s

<script>
    import { Popup } from 'vux'
    import Avatar from "@/components/avatar/Avatar";
    import GridCard from "@/components/gridcard/GridCard";
    import scroll from "@/components/scroll/Scroll";
    export default {
        name: "not-audit",
        components:{
            Avatar,
            GridCard,
            scroll,
            Popup
        },
        data() {
            return {
                list:[],
                prompt:false,
                popup:false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData",{
                    pageNumber:1,
                    pageSize :20,
                    personStatus:"CY"
                }).then((res) => {
                    console.log(res)
                    if (parseInt(res.data.total) !== 0) {
                        let data = res.data.data;
                        this.list = data;
                    } else {
                        this.prompt = true;
                    }
                })
            },
            workflow(item) {
               this.popup = true
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .prompt {
        text-align: center;
        color: #ff8000;
        margin-top: 20px;
        font-size: 18px;
    }
    .setType{
        background-color white
        width 100%
        text-align center
        padding 10px 0
    }
</style>
