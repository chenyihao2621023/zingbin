<template>
    <div id="noBindingList" class="noBindingList">
        <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
        <zing-head :isShowQuery="true" :title="'待绑定员工'"></zing-head>
        <div class="content-div">
            <!--<scroll ref="scroll" :data="items" :scrollbar="true"
                    :pullUpLoad="{threshold: 0, txt: { noMore: 'noMore'} }" :startY="0"
                    @pullingUp="onPullingUp">-->
            <scroll ref="scroll" :data="items" :scrollbar="true" :startY="0">
                <div v-if="getDataInfo && getDataInfo.length > 0">
                    <GridCard v-for="(data, index) in getDataInfo" :key="index">
                        <div slot="cardLeft" class="left" @click="gotoPage(data)">
                            <avatar shape="square" :src="data.headImg"></avatar>
                            <div class="left-wrapper">
                                <p class="left-wrapper-title">{{data.bindName}}</p>
                            </div>
                        </div>
                    </GridCard>
                </div>
                <div v-else class="prompt" :style="{ height: screenHeight + 'px'}">暂无待绑定员工</div>
            </scroll>
        </div>
        <org-member-picker :initialSelected="orgMemberSelected" :showPicker="showMemberPicker" :multiple="multiple" :initialSelectedType="'cardUrl'"
                           @picked="getMemberPickedData"
                           @abort="onMemberPickAbort"></org-member-picker>
    </div>
</template>


<script>
    import { XButton,XInput,Group } from 'vux'
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";

    export default {
        name: "noBindingList",
        components: {
            OrgMemberPicker,XButton,XInput,Group,Scroll, GridCard, Avatar, Tag, ZingHead
        },
        directives: {
            //自定义标签属性
        },
        data() {
            return {
                headTitle: "档案列表",
                multiple: false,
                showMemberPicker:false,
                orgMemberSelected:[],
                screenHeight: "0px",
                getDataInfo: [
                    /*{
                        bindName: "张三",
                        generate_time: "2018-03-22 18:28:32",
                        cardUrl:"测试",
                        companyId:"测试",
                    }*/
                ],
                items: [],
            }
        },
        //钩子加载完触发
        created() {
            this.getData();
            this.screenHeight = document.documentElement.clientHeight - 101;
        },
        methods: {
            getData() {
                console.log("getData .......");
                let self = this;
                let url = "/zingbiz/hrManager/BindingAuditRest/loadAskBindUsers";
                //todo companyId     company52589551100001 是测试环境 最后要去掉
                let params = {
                    /*companyId : "company52589551100001",*/
                    status : "0",
                    pageNumber : "1",
                    pageSize : "50",
                };
                self.$http.post(url, params).then(res => {
                    console.log(res);
                    if (res.data.success === true) {
                        let resData = res.data.data.data;
                        self.getDataInfo = resData.map(item => {
                            item.headImg = "/checkJpg/" + item.cardUrl.substr(0,2) + "/" + item.cardUrl + item.companyId + "Bind.jpg";
                            return item
                        })
                    }
                });
            },
            openDialog() {
                this.showMemberPicker = true;
            },
            selectManDialog(rowId) {
                /*this.orgMemberSelected = [];
                if (rowId) {
                    this.orgMemberSelected.push(rowId);
                }*/
                this.showMemberPicker = true;
            },
            getMemberPickedData(data) {
                /*this.upleader = data[0];*/
                this.showMemberPicker = false;
            },
            onMemberPickAbort() {
                this.showMemberPicker = false;
            },
            onPullingDown() {
                // 模拟更新数据
                console.log("pulling down and load data");
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 2000);
            },
            onPullingUp() {
                // 更新数据
                console.log("pulling up and load data");
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            gotoPage(data) {
                console.log(data);
                this.$router.push({
                    path: "/backstageManage/bindingApply",
                    query:{
                        cardUrl:data.cardUrl,
                        bindName:data.bindName,
                        companyId:data.companyId,
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .content-div {
        height: 100%;
        background: #fbf9fe;
    }
    .prompt {
        background: #fbf9fe;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
        color: #ff8000;
    }
</style>
