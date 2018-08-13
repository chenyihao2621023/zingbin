<template>
    <div class="outerMost1">
        <div class="warning" v-show="show1">
            暂无数据
        </div>
        <div class="scroll-list-wrap">
            <scroll
                ref="scroll"
                :data="Data"
                :pullUpLoad="pullUpLoad"
                @pullingUp="onPullingUp"
            >
                <GridCard v-for="(item,index) in Data" :key="index" >
                    <div slot="cardLeft" class="left" @click="jumpFlow(item)">
                        <avatar shape="square" :style="{background:'#fff'}">
                            <i v-if="item.templateIcon!=undefined && item.templateIcon.indexOf('zingIcon')>=0" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-shenpi1`]"></i>
                            <i v-else="" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                        </avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.workflow_name}}</p>
                            <div class="left-wrapper-desc">{{item.genTime}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right" @click="move(item)">
                        <div class="tag-wrapper">
                            <tag type ="success">{{item.workflow_state}}</tag>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    export default {
        name: "approvaled",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
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
                Data:[],
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
                    that.screen = true
                    that.screenSuccess = true
                    newValue.pageNumber = 1
                    newValue.pageSize = 20
                    that.newValue = newValue
                    that.Data = []
                    that.screenMethod(newValue)
                },
                deep: true
            }
        },
        created() {
            this.getDataForYB(this.pageNumber)
        },
        methods:{
            //获取已办数据
            getDataForYB(pageNumber) {
                let that = this
                that.$http.post("/zingbiz/workflow/myWorkflowRest/getMyApprovalData",{
                    personStatus:"YB",
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
                            that.Data.push( res.data.data.data[i])
                        }
                        that.$refs.scroll.refresh();
                        if (that.pageNumber * that.pageSize > res.data.data.total) {
                            that.success = false
                        }
                        that.pageNumber = that.pageNumber + 1
                    }
                })
            },
            //dom点击跳转
            jumpFlow(item) {
                this.$emit("jumpFlow",item)
            },
            //下拉分页
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
                        this.getDataForYB(this.pageNumber)
                        this.$refs.scroll.forceUpdate(true)
                    } else {
                        this.$refs.scroll.forceUpdate(false);
                    }
                }
            },
            //筛选方法
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
                            that.Data.push( res.data.data.data[i])
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
    .outerMost1{
        height 100%;
    }
    .warning{
        text-align center
        margin-top 20px
        font-size 18px
        color orangered
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }
</style>
