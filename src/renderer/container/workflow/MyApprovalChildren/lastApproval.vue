<template>
    <div class="outerMost">
        <div class="warning" v-show="show1">
            暂无数据
        </div>
        <div class="scroll-list-wrap">
            <scroll
                ref="scroll"
                :data = "lastData"
                :pullUpLoad="pullUpLoad"
                @pullingUp="onPullingUp"
            >
                <GridCard v-for="(item,index) in lastData" :key="index" >
                    <div slot="cardLeft" class="left" @click="jumpFlow(item)">
                        <avatar shape="square" :style="{background:'#fff'}">
                            <i v-if="item.templateIcon!=undefined && item.templateIcon.indexOf('zingIcon')>=0" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-shenpi1`]"></i>
                            <i v-else="" style="color:#337ab7;font-size: 50px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                        </avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.workflow_name}}</p>
                            <div class="left-wrapper-desc">{{item.genTime}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right" @click="move(item)">
                        <i class="iconfont icon-zuojiantou"></i>
                        <div class="tag-wrapper">
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>

        <confirm v-model="show" title = "提示" @on-confirm="onConfirm">
            <p style="text-align:center;">移动到待我审批吗？</p>
        </confirm>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import { Confirm } from 'vux'
    export default {
        name: "last-approval",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            Confirm,
        },
        props: {
            param: {
                type: Object,
            },
            gridTab:{
                type:String
            }
        },
        data() {
            return {
                show1:false,
                show:false,
                lastData:[],
                total:0,
                pageNumber:1,
                pageSize:20,
                screen:false,
                success:true,
                screenSuccess:true,
                newValue:{},
                pullUpLoad:{ threshold: 0,txt: { more: '加载更多',noMore: '没有更多数据' }}
            }
        },
        watch: {
            //监听筛选数据
            param:{
                handler(newValue, oldValue) {
                    let that = this
                    that.show1 = false
                    that.lastData = []
                    that.screenSuccess = true
                    newValue.pageNumber = 1
                    newValue.pageSize = 20
                    that.screen = true
                    that.newValue = newValue
                    that.screenMethod(newValue)
                },
                deep: true
            }
        },
        created() {
            console.log(this.gridTab)
            this.getDataForYH(this.pageNumber)
        },
        methods:{
            //获取数据
            getDataForYH(pageNumber) {
                let that = this
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData",{
                    personStatus:"YH",
                    pageNumber:pageNumber,
                    pageSize:20
                }).then(function (res) {
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    that.total = res.data.data.total
                    if (parseInt(that.total) === 0) {
                        that.show1 = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.lastData.push( res.data.data.data[i])
                        }
                        that.$refs.scroll.refresh();
                        if (that.pageNumber * that.pageSize > res.data.data.total) {
                            that.success = false
                        }
                        that.pageNumber = that.pageNumber + 1
                    }
                })
            },
            //提示
            move(item) {
                this.show = true
                this.item = item
            },
            //确定将数据转移
            onConfirm() {
                let that = this
                console.log(that.item)
                that.$http.post("/zingbiz/workflow/myWorkflowRest/executeYHorWorkFlow",{
                    workflowId: that.item.workflow_id ,
                    type:"cancelYH"
                }).then(function (res) {
                    if (res.data.success) {
                        that.$vux.toast.show({ type:'text',text:"操作成功" })
                        //重新请求数据
                        that.pageNumber = 1
                        that.success = true
                        that.lastData = []
                        that.getDataForYH(that.pageNumber)
                    }
                })
            },
            //跳页
            jumpFlow(item) {
                this.$emit("jumpFlow",item)
            },
            //分页
            onPullingUp() {
                if (this.screen) {
                    if (this.screenSuccess) {
                        this.screenMethod(this.newValue)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        this.$refs.scroll.forceUpdate(false);
                    }
                } else {
                    if (this.success) {
                        this.getDataForYH(this.pageNumber)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        this.$refs.scroll.forceUpdate(false);
                    }
                }
            },
            //筛选接口
            screenMethod(newValue) {
                let that = this
                that.$http.post("/zingbiz/workflow/workFlowQuery/getWorkflowDataByFilter",newValue).then(function (res) {
                    that.total = res.data.data.total
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    if (parseInt(that.total) === 0) {
                        that.show1 = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.lastData.push( res.data.data.data[i])
                        }
                        if (that.newValue.pageNumber * that.newValue.pageSize > res.data.data.total) {
                            that.screenSuccess = false
                        }
                        that.newValue.pageNumber = that.newValue.pageNumber + 1
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
    .outerMost {
        height 100%;
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow hidden
    }
</style>
