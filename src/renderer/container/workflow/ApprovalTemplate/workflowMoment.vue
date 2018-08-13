<template>
    <div id="innerwapper">
        <div class="warning" v-show="flag">
            暂无数据
        </div>
        <div class="scroll-list-wrap">
            <scroll
                ref="scrollbar"
                :data="WorkflowData"
                :pullUpLoad="pullUpLoad"
                @pullingUp="onPullingUp"
            >
                <GridCard v-for="(item,index) in WorkflowData" :key="index">
                    <div slot="cardLeft" class="left" @click="jumpFlowMoment(item)">
                        <avatar shape="square" :style="{background:'#fff'}">
                            <i v-if="item.templateIcon!=undefined && item.templateIcon.indexOf('zingIcon')>=0" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-shenpi1`]"></i>
                            <i v-else="" style="color:#ff8000;font-size: 50px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                        </avatar>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.workflow_name}}</p>
                            <div class="left-wrapper-desc">{{item.genTime}}</div>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <div class="tag-wrapper">
                            <x-button class="btn-save btn-default" @click.native="showConfirm(item)">删除</x-button>
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>
        <confirm v-model="show" title = "提示" @on-confirm="onConfirm">
            <p style="text-align:center;">是否确定删除此暂存数据</p>
        </confirm>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import { XButton,Confirm } from 'vux'
    export default {
        name: "workflow-moment",
        components:{
            Avatar,
            Tag,
            GridCard,
            scroll,
            XButton,
            Confirm
        },
        props: {
            param: {
                type: Object,
            },
            showFlag:{
                type:Boolean
            }
        },
        data() {
            return {
                WorkflowData:[],
                flag:false,
                show:false,
                item:"",
                companyId:"",
                tplId:"",
                cType:"",
                pageNumber:1,
                pageSize:20,
                screen:false,
                success:true,
                screenSuccess:true,
                newValue:{},
                pullUpLoad:{ threshold: 0,txt: { more: '加载更多',noMore: '没有更多数据' }}
            }
        },
        watch:{
            param:{
                handler(newValue, oldValue) {
                    delete newValue.gridtab
                    if (JSON.stringify(newValue) !== "{}") {
                        let that = this
                        that.screenSuccess = true
                        that.flag = false
                        newValue.pageSize = 20
                        newValue.pageNumber = 1
                        that.newValue = newValue
                        that.screen = true
                        that.WorkflowData = []
                        that.screenMethod(newValue)
                    }
                },
                deep: true
            },
            showFlag:{
                handler(newValue) {
                    if (newValue) {
                        this.$refs.scrollbar.enable()
                        this.$refs.scrollbar.refresh()
                    } else {
                        this.$refs.scrollbar.disable()
                    }
                },
                deep:true
            }
        },
        created() {
            // console.log(this.param1)
            // this.companyId = "company59915700000000101"
            this.companyId = this.$route.query.companyId
            this.getWorkflowData(this.pageNumber)
        },
        methods: {
            getWorkflowData(pageNumber) {
                let that = this
                that.$http.post("/zingbiz/workflow/temporaryWorkflow/getWorkflowDataForMyTemporary", {
                    pageNumber:pageNumber,
                    pageSize:20
                }).then(function (res) {
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    if ( parseInt(res.data.data.total) === 0) {
                        that.flag = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.WorkflowData.push( res.data.data.data[i])
                        }
                        that.$refs.scrollbar.refresh();
                        if (that.pageNumber * that.pageSize > res.data.data.total) {
                            that.success = false
                        }
                        that.pageNumber = that.pageNumber + 1
                    }
                })
            },
            urlParse(url){
                let obj = {};// 创建一个Object
                let reg = /[?&][^?&]+=[^?&]+/g;// 正则匹配 ?&开始 =拼接  非?&结束  的参数
                let arr = url.match(reg);// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
                if (arr) {
                    arr.forEach((item) => {
                        /**
                         * tempArr数组    ['id','12345']和['a','b']
                         * 第一个是key，第二个是value
                         * */
                        let tempArr = item.substring(1).split('=');
                        let key = decodeURIComponent(tempArr[0]);
                        let val = decodeURIComponent(tempArr[1]);
                        obj[key] = val;
                    });
                }
                return obj;
            },
            jumpFlowMoment(item) {
                let that = this;
                let queryParams = that.urlParse(item.urlParams);
                queryParams.WF_ZCID = item.workflow_id;


                that.$router.push({
                    path:"/workflow/customLaunchWorkflow",
                    query:queryParams
                })
            },
            onConfirm() {
                let that = this
                that.$http.post("/zingbiz/workflow/temporaryWorkflow/delDataUseTimeoutForZCById",{
                    WFZCID : that.item.workflow_id,
                }).then(function (res) {
                    if (res.data.data.success) {
                        that.pageNumber = 1
                        that.success = true
                        that.WorkflowData = []
                        that.getWorkflowData(that.pageNumber)
                    }
                })
            },
            showConfirm(item) {
                this.show = true
                this.item = item
            },
            onPullingUp() {
                if (this.screen) {
                    if (this.screenSuccess) {
                        this.screenMethod(this.newValue)
                        this.$refs.scrollbar.forceUpdate(true)
                    } else {
                        this.$refs.scrollbar.forceUpdate(false);
                    }
                } else {
                    if (this.success) {
                        this.getWorkflowData(this.pageNumber)
                        this.$refs.scrollbar.forceUpdate(true)
                    } else {
                        this.$refs.scrollbar.forceUpdate(false);
                    }
                }
            },
            screenMethod(newValue) {
                let that = this
                that.$http.post("/zingbiz/workflow/temporaryWorkflow/getWorkflowDataForMyTemporary", newValue).then(function (res) {
                    if (res.data.data.total < 20) {
                        that.pullUpLoad = false
                    }
                    if ( parseInt(res.data.data.total) === 0) {
                        that.flag = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.WorkflowData.push( res.data.data.data[i])
                        }
                        if (that.newValue.pageNumber * that.newValue.pageSize > res.data.data.total) {
                            that.screenSuccess = false
                        }
                        that.newValue.pageNumber = that.newValue.pageNumber + 1
                    }
                })
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #innerwapper{
        height 100%
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
    .btn-default{
        width 60px
        height 20x
        color white
        font-size 14px
        margin-right 10px
    }
</style>
