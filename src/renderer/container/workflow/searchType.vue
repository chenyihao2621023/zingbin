<template>
    <div class="outerMost">
        <ZingHead title="搜索">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search()"></i>
                </span>
            </div>
        </ZingHead>
        <div class="prompt" v-show="prompt">没有搜索到内容</div>
        <div v-show="defalut1" class="scroll-list-wrap">
            <scroll ref="scroll" :data="data">
                <div v-for="(val,index) in data" :key="index" class="search">
                    <div class="search-title">{{val.title}}</div>
                    <div v-for="(item,index) in val.content" :key="index" class="search-content" @click="jumpTo(val,item)">
                        <div class="search-content-inner">
                            <div class="search-content-inner-name">{{item.workflow_name}}</div>
                            <div class="search-content-inner-content">
                                <span class="search-content-inner-sort">{{item.workflow_sort}}</span>
                                <span class="search-content-inner-state">{{item.workflow_state}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="more" @click="more(val)">
                        <span>{{val.text}}</span>
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
            </scroll>
        </div>
        <workflowSearch
            :textType = "textType"
            :title="title"
            :popup0="popup0"
            @cancle="cancle"
            @changeConfirm = "changeConfirm"
        >
        </workflowSearch>
    </div>
</template>
<script>
    import { Z_DecodeU2,Z_IsEmpty20 } from '../../utils/fn'
    import workflowSearch from "./ApprovalTemplate/workflowSearch";
    import ZingHead from "@/components/zingHead/ZingHead";
    import scroll from '@/components/scroll/Scroll'
    export default {
        name: "search-type",
        components: {
            ZingHead,
            workflowSearch,
            scroll
        },
        data() {
            return {
                prompt:false,
                keyWords:"",
                mType:"",
                searchType:"",
                searchParams:{},
                searchParam:{},
                defalut1:true,
                popup:false,
                textType:[],
                title:"搜索",
                popup0:false,
                data:[],
                pageNumber1: 1,
                pageNumber2: 1,
                pageNumber3: 1,
                pageNumber4: 1,
                pageNumber5: 1,
            }
        },
        watch: {
            '$route' (to, from) {
                // 对路由变化作出响应...
                console.log("改变了吗")
                window.location.reload()
            }
        },
        created() {
            this.keyWords = Z_DecodeU2(this.$route.query.key)
            if (this.$route.query.mType === undefined ) {
                this.mType = ""
                this.textType = [
                    { value:"审批标题" ,dataId:"mingcheng" },
                    { value:"审批模版" ,dataId:"moban" },
                    { value:"审批内容" ,dataId:"zhixingneirong" },
                    { value:"流水号" ,dataId:"liushuihao" },
                    { value:"流水号" ,dataId:"liushuihao" },
                ]
            } else {
                this.mType = this.$route.query.mType
                this.textType = [
                    { value:"审批标题" ,dataId:"mingcheng" },
                    { value:"审批模版" ,dataId:"moban" },
                    { value:"审批内容" ,dataId:"zhixingneirong" },
                    { value:"流水号" ,dataId:"allPeopleForWorkflow" },
                ]
            }
            this.searchType = this.$route.query.type
            this.getRearchData()
        },
        methods:{
            //初始化数据
            getRearchData() {
                let that = this
                //查询全部内容
                if (that.searchType === "all") {
                    if (that.mType === "FQ" || that.mType === "CY" || that.mType === "SP") {
                        that.searchParams.workflowName = that.keyWords;
                        that.searchParams.workflowId = that.keyWords;
                        that.searchParams.executeContent = that.keyWords;
                        that.searchParams.workflowSort = that.keyWords;
                    } else {
                        that.searchParams.workflowName = that.keyWords;
                        that.searchParams.workflowId = that.keyWords;
                        that.searchParams.participantsName = that.keyWords;
                        that.searchParams.executeContent = that.keyWords;
                        that.searchParams.workflowSort = that.keyWords;
                    }
                    that.searchParams.pageNumber = "1";
                    that.searchParams.pageSize = "3";
                } else {
                    if (that.searchType === 'mingcheng') {
                        that.searchParams.workflowName = that.keyWords;
                        that.searchParams.pageNumber = "1";
                        that.searchParams.pageSize = "3";
                    } else if (that.searchType === 'moban') {
                        that.searchParams.workflowSort = that.keyWords;
                        that.searchParams.pageNumber = "1";
                        that.searchParams.pageSize = "3";
                    } else if (that.searchType === 'zhixingneirong') {
                        that.searchParams.executeContent = that.keyWords;
                        that.searchParams.pageNumber = "1";
                        that.searchParams.pageSize = "3";
                    } else if (that.searchType === 'liushuihao') {
                        that.searchParams.workflowId = that.keyWords;
                        that.searchParams.pageNumber = "1";
                        that.searchParams.pageSize = "3";
                    } else if (that.searchType === 'allPeopleForWorkflow') {
                        that.searchParams.participantsName = that.keyWords;
                        that.searchParams.pageNumber = "1";
                        that.searchParams.pageSize = "3";
                    }
                }
                that.searchParams.personStatus = that.mType;
                //发请求(非查看审批流)
                that.$http.post("/zingbiz/workflow/workFlowQuery/getWorkflowDataForModuleByType",that.searchParams).then(function (res) {
                    if (!Z_IsEmpty20(res.data.data.workflowNameRetMap)) {
                        if (res.data.data.workflowNameRetMap.data.length <= 2) {
                            that.data.push({ title:"审批标题",text:"已经没有更多数据了",content:res.data.data.workflowNameRetMap.data })
                        } else {
                            that.data.push({ title:"审批标题",text:"更多",content:res.data.data.workflowNameRetMap.data })
                        }
                    }
                    if (!Z_IsEmpty20(res.data.data.workflowIdRetMap)) {
                        that.data.push({ title:"流水号", text:"更多",content:res.data.data.workflowIdRetMap.data })
                    }
                    if (!Z_IsEmpty20(res.data.data.workflowSortRetMap)) {
                        that.data.push({ title:"模板名称",text:"更多",content:res.data.data.workflowSortRetMap.data })
                    }
                    if (!Z_IsEmpty20(res.data.data.executeContentRetMap)) {
                        that.data.push({ title:"执行内容",text:"更多",content:res.data.data.executeContentRetMap.data })
                    }
                    if (!Z_IsEmpty20(res.data.data.participantsNameRetMap )) {
                        that.data.push({ title:"参与人",text:"更多",content:res.data.data.participantsNameRetMap.data })
                    }
                    if (that.data.length === 0) {
                        that.prompt = true
                    }
                })
            },
            //处理数据
            handleData() {
                this.workflowName = this.data.workflowName
                this.workflowId = this.data.workflowId
                this.workflowSort = this.data.workflowSort
                this.executeContent = this.data.executeContent
            },
            search() {
                this.defalut1 = false
                this.popup0 = true
            },
            cancle() {
                this.popup0 = false
                this.defalut1 = true
            },
            changeConfirm(value) {
                this.param = value
            },
            jumpTo(val,item) {
                let that = this
                //携带参数
                that.$router.push({
                    path:"/workflow/showNode",
                    query:{
                        companyId:item.companyId,
                        workflow_id:item.woow_chat_id
                    }
                })
            },
            more(val) {
                //判断val的title 判断text
                if (val.text === "已经没有更多数据了") {
                    return
                }
                let that = this
                that.searchParam = {}
                if (val.title === "审批标题") {
                    that.searchParam.workflowName = that.keyWords;
                    that.searchParam.pageNumber = (that.pageNumber1 + 1).toString()
                    that.searchParam.pageSize = "3";
                    that.pageNumber1 += 1
                } else if (val.title === '模板名称') {
                    that.searchParam.workflowSort = that.keyWords;
                    that.searchParam.pageNumber = (that.pageNumber2 + 1).toString()
                    that.searchParam.pageSize = "3";
                    that.pageNumber2 += 1
                } else if (val.title === '执行内容') {
                    that.searchParam.executeContent = that.keyWords;
                    that.searchParam.pageNumber = (that.pageNumber3 + 1).toString()
                    that.searchParam.pageSize = "3";
                    that.pageNumber3 += 1
                } else if (val.title === '流水号') {
                    that.searchParam.workflowId = that.keyWords;
                    that.searchParam.pageNumber = (that.pageNumber4 + 1).toString()
                    that.searchParam.pageSize = "3";
                    that.pageNumber4 += 1
                } else if (val.title === '参与人') {
                    that.searchParam.participantsName = that.keyWords;
                    that.searchParam.pageNumber = (that.pageNumber5 + 1).toString()
                    that.searchParam.pageSize = "3";
                    that.pageNumber5 += 1
                }
                that.searchParam.personStatus = that.mType;
                //发请求,判断是否显示没有更多
                that.$http.post("/zingbiz/workflow/workFlowQuery/getWorkflowDataForModuleByType",that.searchParam).then(function (res) {
                    if (!Z_IsEmpty20(res.data.data.workflowNameRetMap)) {
                        if (res.data.data.workflowNameRetMap.data.length <= 2) {
                            val.text = "已经没有更多数据了"
                        }
                        val.content.push.apply(val.content, res.data.data.workflowNameRetMap.data);
                    }
                    if (!Z_IsEmpty20(res.data.data.workflowIdRetMap)) {
                        if (res.data.data.workflowIdRetMap.data.length <= 2) {
                            val.text = "已经没有更多数据了"
                        }
                        val.content.push.apply(val.content, res.data.data.workflowIdRetMap.data );
                    }
                    if (!Z_IsEmpty20(res.data.data.workflowSortRetMap)) {
                        if (res.data.data.workflowSortRetMap.data.length <= 2) {
                            val.text = "已经没有更多数据了"
                        }
                        val.content.push.apply(val.content, res.data.data.workflowSortRetMap.data );
                    }
                    if (!Z_IsEmpty20(res.data.data.executeContentRetMap)) {
                        if (res.data.data.executeContentRetMap.data.length <= 2) {
                            val.text = "已经没有更多数据了"
                        }
                        val.content.push.apply(val.content, res.data.data.executeContentRetMap.data );
                    }
                    if (!Z_IsEmpty20(res.data.data.participantsNameRetMap )) {
                        if (res.data.data.participantsNameRetMap.data.length <= 2) {
                            val.text = "已经没有更多数据了"
                        }
                        val.content.push.apply(val.content, res.data.data.participantsNameRetMap.data);
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outerMost{
        height calc(100% - 50px)
        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;
            .search{
                width 100%
                margin-bottom 20px
                &-title{
                    width 100%
                    padding 10px
                    background-color #337AB7
                    color white
                }
                &-content{
                    width 100%
                    &-inner{
                        width 100%
                        padding 10px
                        border-bottom 1px solid gray
                        &-name{
                            margin-bottom 5px
                            color #7C7C7C
                        }
                        &-content{
                            color #b3b3b3
                        }
                    }
                }
            }
        }
    }

    .more{
        width 100%
        padding 10px
        color #7C7C7C
    }
    .prompt{
        margin-top 20px
        width 100%
        text-align center
    }
</style>
