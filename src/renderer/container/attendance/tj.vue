 <template>
    <div class="tj">
        <zing-head title="考勤统计" v-on:doSome="doSome" :isComeBack="false" >
                <div slot="header-right">
                    <span class="header-jiahao">
                        <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                <i class="iconfont icon-gengduo"></i>
                            </a>
                        </dropdown>
                    </span>
                </div>
        </zing-head>
        <div class="vue-tab" v-if="type === 'all'">
            <tab class="" :line-width="2">
                <tab-item :selected="defTab === item"
                          v-for="(item, index) in tabTitle"
                          @on-item-click="chengeTab"
                          @click="defTab = item"
                          :key="index">{{item}}
                </tab-item>
            </tab>
        </div>
        <div class="tab-content" v-if="type === 'all'">
            <div class="tabDiv" v-show="dayShow" :style="{ height: screenHeight + 'px'}">
                <tjDay></tjDay>
            </div>
            <div class="tabDiv" v-show="MonthShow" :style="{ height: screenHeight + 'px'}">
                <tjMonth></tjMonth>
            </div>
            <div class="tabDiv" v-show="meShow" :style="{ height: screenHeight + 'px'}">
                <tjMe></tjMe>
            </div>
        </div>
        <div class="tab-content" v-if="type === 'me'">
             <div class="tabDiv" :style="{ height: screenHeight + 'px'}">
                <tjMe></tjMe>
            </div>
        </div>
    </div>
</template>

<script>
    import {Tab, TabItem, XButton} from 'vux';
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import tjDay from './tjDay';
    import tjMonth from './tjMonth';
    import tjMe from './tjMe';


    export default {
        name: "tj",
        components: {
            XButton,Tab,TabItem,
            ZingHead,Dropdown,tjDay,tjMonth,tjMe
        },
        directives: {
            //自定义标签属性

        },
        data() {
            return {
                tabTitle: ["日统计", "月统计","我"],
                defTab: "日统计",
                dayShow: true,
                MonthShow: false,
                meShow: false,
                screenHeight: "0px",
                type:"me",//页面类型    me---我   all --- 所有
                datas: [
                    { content: "报表", url: "/attendanceHome/tjReport" }
                ],
            }
        },
        created: function () {
            let that = this
            this.type = this.$route.query.type
            if(this.type === 'all'){
                this.screenHeight = document.documentElement.clientHeight - 100;
            }else if(this.type === 'me'){
                this.screenHeight = document.documentElement.clientHeight - 40;
            }
            if (isWeiXin() || isMhApp()) {
               this.datas = [
                    { content: "报表", url: "/attendanceHome/tjReport" }
                ]
            }else{
               this.datas = [
                    { content: "报表", url: "/attendanceHome/tjReport" },
                    { content: "导出", url: "/attendanceHome/tjReport" }
                ]
            }
        },
        methods: {
            chengeTab(index) {
                if (index === 0) {
                    this.dayShow = true;
                    this.MonthShow = false;
                    this.meShow = false;
                } else if (index === 1) {
                    this.dayShow = false;
                    this.MonthShow = true;
                    this.meShow = false;
                } else if (index === 2) {
                    this.dayShow = false;
                    this.MonthShow = false;
                    this.meShow = true;
                }
            },
            doSome(){
                this.$router.push("/WorkbenchChild?childItem=resources")
            },
            handleMenu(data) {
                if (data.url) this.$router.push(data.url)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import '../../assets/stylus/variable.styl';

    .tj{
        display flex
        flex-direction column
        width 100%
        height 100%
    }
    .vue-tab{
        flex-shrink 0
    }
    .tab-content{
        flex-grow 1
    }
    .tabDiv{
        overflow-y auto
    }
</style>
