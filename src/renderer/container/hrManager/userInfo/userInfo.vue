<template>
    <div class="userInfo">
        <zing-head class="employee-head" title="我的档案"></zing-head>
        <div class="vue-tab">
            <tab class="" :line-width="2">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab"
                          @click="defTab = item" :key="index">{{item}}
                </tab-item>
            </tab>
        </div>
        <div class="tab-content">
            <div class="tabDiv" v-show="basicShow">
                <basic-info></basic-info>
            </div>
            <div class="tabDiv" v-show="workShow">
                <work-info></work-info>
            </div>
        </div>
    </div>
</template>

<script>
    import {Tab, TabItem, XButton} from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead";
    import BasicInfo from '@/container/hrManager/userInfo/basicInfo';
    import WorkInfo from '@/container/hrManager/userInfo/workInfo';

    export default {
        components: {
            XButton,
            Tab,
            TabItem,
            ZingHead,
            BasicInfo,
            WorkInfo,
        },
        data() {
            return {
                tabTitle: ["基本信息", "工作信息"],
                defTab: "基本信息",
                basicShow: true,
                workShow: false,
                screenHeight: "0px",
            }
        },
        //钩子加载完触发
        created: function () {
          
        },
        methods: {
            chengeTab(index) {
                if (index === 0) {
                    this.basicShow = true;
                    this.workShow = false;
                } else if (index === 1) {
                    this.basicShow = false;
                    this.workShow = true;
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .userInfo
        display flex
        flex-direction column
        width 100%
        height 100%
        .employee-head
        .vue-tab
            flex-shrink 0
        .tab-content
            flex-grow 1
            overflow-y auto
</style>
