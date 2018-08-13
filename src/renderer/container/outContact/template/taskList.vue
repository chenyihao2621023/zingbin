<!--查看参与任务页面-->
<template>
    <div class="popupDate-picker">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden','backgroundColor':'white'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head title="客服工单" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="nobody" v-show="nobody">暂无客服工单</div>
                    <div class="scolley-div">
                        <scroll
                            ref="scroll"
                            :data="getTaskData"
                            :pullUpLoad="pullUpLoad"
                            @pullingUp="onPullingUp"
                        >
                            <GridCard v-for="(item,index) in getTaskData" :key="index" @click.native="workDetail(item)">
                                <div slot="cardLeft" class="left">
                                    <div class="left-wrapper">
                                        <p class="left-wrapper-title">{{item.record}}</p>
                                        <p>{{item.sheetTime}}</p>
                                    </div>
                                </div>
                                <div slot="cardRight">
                                    <tag >{{item.sheetName}}</tag>
                                </div>
                            </GridCard>
                        </scroll>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";
    import scroll from '@/components/scroll/Scroll'
    import { Popup } from "vux";
    export default {
        components: {
            ZingHead,
            GridCard,
            Avatar,
            Popup,
            Tag,
            scroll
        },
        props: {
            showPopupDate: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
        },
        data() {
            return {
                nobody:false,
                getTaskData:[],
                pullUpLoad:{ threshold: 0,txt: { more: '加载更多',noMore: '没有更多数据' }},
                success:true,
                pageNumber:1,
                pageSize:20,
            };
        },
        created() {
            this.tastList(this.pageNumber)
        },
        methods: {
            backClick() {
                this.$emit("backClick");
            },
            // toNextPage() {
            //     this.$emit('toNextPage')
            // },
            //获取工单列表
            tastList(pageNumber) {
                this.$http.get("/zingbiz/hotel/hotelWorkSheet/selSheet",{
                    params:{
                        companyId:this.$route.query.companyId,
                        customerId:this.$route.query.externalContactsId,
                        pageNumber:pageNumber,
                        pageSize:20
                    }
                }).then((res) => {

                    if (res.data.total < 20) {
                        this.pullUpLoad = false
                    }
                    if (res.data.data.length === 0) {
                        this.nobody = true
                    } else {
                        for (let i = 0; i < res.data.data.length; i++) {
                            this.getTaskData.push( res.data.data[i])
                            if (res.data.data[i].sheetType === "1") {
                                res.data.data[i].sheetName = "已完成"
                            } else if (res.data.data[i].sheetType === "0") {
                                res.data.data[i].sheetName = "处理中"
                            }
                        }
                        this.$refs.scroll.refresh();
                        if (this.pageNumber * this.pageSize > res.data.total) {
                            this.success = false
                        }
                        this.pageNumber = this.pageNumber + 1
                    }
                })
            },
            //分页效果
            onPullingUp () {
                if (this.success) {
                    this.tastList(this.pageNumber)
                    this.$refs.scroll.forceUpdate(true)
                } else {
                    this.$refs.scroll.forceUpdate(false);
                }
            },
            //跳转工单详情
            workDetail (item) {
                this.$router.push({
                    path: "taskListDetail",
                    query: {
                        rowId:item.rowId
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .left-wrapper-title{
        margin-top: 2px;
    }
    .nobody{
        margin-top: 15px;
        font-size: 16px;
        text-align: center;
        color: #ff8000;
    }
    .popupDate-picker {
        height:100%;
    }
    .popupDate-picker-popup{
        height: 100%;
    }
    .scolley-div{
        height: calc(100% - 50px);
    }
    .root-div{
        height: 100%;
    }
</style>


