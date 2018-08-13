<template>
    <div class="test-pages">
        <grid>
            <grid-item link="/demo/demolist">
                <span class="grid-center">demo列表</span>
            </grid-item>
            <grid-item link="/demo/logindemo">
                <span class="grid-center">登录demo</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/ziyuanku">
                <span class="grid-center">资源库</span>
            </grid-item>
            <grid-item link="/hotel/roomState">
                <span class="grid-center">酒店</span>
            </grid-item>
            <grid-item link="/dinner">
                <span class="grid-center">点餐</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/backstageManage">
                <span class="grid-center">组织权限</span>
            </grid-item>
            <grid-item link="/demo/globalSearchDemo">
                <span class="grid-center">全局搜索</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/demo/chatList">
                <span class="grid-center">测试聊天列表</span>
            </grid-item>
            <!--<grid-item link="/forward">
                <span class="grid-center">转发</span>
            </grid-item>-->
        </grid>
        <grid>
            <grid-item link="/attendanceHome/attenSettingList">
                <span class="grid-center">考勤设置</span>
            </grid-item>
            <grid-item link="/attendanceHome/attendanceCardList">
                <span class="grid-center">考勤打卡</span>
            </grid-item>
            <grid-item link="/attendanceHome/attenExamine">
                <span class="grid-center">外勤审核</span>
            </grid-item>
             <grid-item link="/attendanceHome/tj">
                <span class="grid-center">考勤统计</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/hrManager/userInfo">
                <span class="grid-center">我的档案</span>
            </grid-item>
            <grid-item link="/hrManager/hrManagerList">
                <span class="grid-center">档案管理</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/hrManager/employeeTurnoverList">
                <span class="grid-center">待交接工作</span>
            </grid-item>
            <grid-item link="/hrManager/askForLeaveCalendar">
                <span class="grid-center">请假统计</span>
            </grid-item>
            <grid-item link="/hrManager/userSalaryList">
                <span class="grid-center">薪酬管理</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/taskManage">
                <span class="grid-center">任务管理</span>
            </grid-item>
        </grid>

        <grid>
            <grid-item link="/workflow/workflowMain">
                <span class="grid-center">审批</span>
            </grid-item>
        </grid>
           <grid>
            <grid-item link="/demo/ganttdemo">
                <span class="grid-center">甘特图</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/demo/readCard">
                <span class="grid-center">读卡</span>
            </grid-item>
        </grid>
        <grid>
            <grid-item link="/demo/notice">
                <span class="grid-center">公告</span>
            </grid-item>
        </grid>



         <!--<zing-head :isComeBack="false">
            <div slot="header-left">
                <dropdown :data="datas" trigger="click" placement="bottomLeft" @item-click="handleMenu">
                    <div>
                        <span>英立讯科技</span>
                        <i class="triangle-down"></i>
                    </div>
                </dropdown>
            </div>
            <div slot="header-right">
                <span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>
            </div>
        </zing-head>
        <div class="test-pages-content">
            <scroll :observeDOM="true">
                <div v-show="showSearch">
                    <search position="absolute" auto-scroll-to-top top="46px"></search>
                </div>
                <div class="title">
                    <div>通用应用</div>
                    <div class="pc-login" @click="pcLogin">电脑登录</div>
                </div>
                <grid :cols="4" show-lr-borders="false" :show-vertical-dividers="false">
                    <grid-item v-for="(item, index) in menuData" :key="index" :label="item.name">
                        <avatar :size="'normal'" slot="icon" :icon="item.icon" shape="square" :style="{background: item.color}"></avatar>
                    </grid-item>
                </grid>
                <div class="title">
                    <div>专业应用</div>
                </div>
                <grid :cols="4" show-lr-borders="false" :show-vertical-dividers="false">
                    <grid-item v-for="(item, index) in menuData2" :key="index" :label="item.name">
                        <avatar :size="'normal'" slot="icon" :icon="item.icon" shape="square" :style="{background: item.color}"></avatar>
                    </grid-item>
                    <grid-item label="添加">
                        <avatar :size="'normal'" slot="icon" :icon="'jiahao1'" shape="square"></avatar>
                    </grid-item>
                </grid>
            </scroll>
        </div>-->
    </div>
</template>

<script>
    import { Grid, GridItem, Search} from 'vux'
    import Avatar from 'components/avatar/Avatar'
    import ZingHead from 'components/zingHead/ZingHead.vue'
    import Scroll from "components/scroll/Scroll"
    import Dropdown from "components/dropdown/Dropdown"

    export default {
        name: 'TestPages',
        components: {
            Grid,
            GridItem,
            Search,
            Avatar,
            ZingHead,
            Scroll,
            Dropdown
        },
        data() {
            return {
                datas: [
                    { content: "私有分类" },
                    {
                      content: "父级",
                      children: [
                        {
                            content: "子级"
                        }
                      ]
                    }
                ],
                showSearch: false,
                menuData: [
                    {
                        name: '任务管理',
                        link: '',
                        icon: 'bianji1',
                        color: '#40AFFC',
                        role: ['admin', 'editor']
                    },{
                        name: '审批',
                        link: '',
                        icon: 'shenpi1',
                        color: '#F59324',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '人力资源',
                        link: '',
                        icon: 'shenpi1',
                        color: '#985DAE',
                        role: ['admin', 'editor']
                    },{
                        name: '签到签退',
                        link: '',
                        icon: 'shenpi1',
                        color: '#985DAE',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '项目管理',
                        link: '',
                        icon: '02',
                        color: '18C34D',
                        role: ['admin', 'editor']
                    },{
                        name: '商城管理',
                        link: '',
                        icon: 'shenpi1',
                        color: '#D91E06',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '知识库',
                        icon: 'zhishicangku',
                        link: '',
                        color: '#40AFFC',
                        role: ['admin', 'editor']
                    },{
                        name: '工作日历',
                        icon: 'shenpi1',
                        link: '',
                        color: '#F78D11',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '公告',
                        icon: 'shenpi1',
                        link: '',
                        color: '#EB3C44',
                        role: ['admin', 'editor']
                    },{
                        name: '生产核算',
                        icon: 'shenpi1',
                        link: '',
                        color: '#0FBE1C',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '报表',
                        link: '',
                        icon: 'baobiao-selected',
                        color: '#E7BB35',
                        role: ['admin', 'editor']
                    },{
                        name: '后台管理',
                        link: '',
                        icon: 'shenpi1',
                        color: '#D71600',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '财务库',
                        icon: 'caiwu',
                        link: '',
                        color: '#F5EB2B',
                        role: ['admin', 'editor']
                    },{
                        name: '物品库',
                        link: '',
                        icon: 'shenpi1',
                        color: '#9659AE',
                        role: ['admin', 'editor']
                    },
                    {
                        name: '进销存',
                        link: '',
                        icon: 'shenpi1',
                        color: '#40B1FD',
                        role: ['admin', 'editor']
                    },{
                        name: '物品柜',
                        link: '',
                        icon: 'shenpi1',
                        color: '23C32F',
                        role: ['admin', 'editor']
                    },

                ],
                menuData2: [
                    {
                        name: '点菜管理',
                        link: '',
                        icon: 'bianji1',
                        color: '#40AFFC',
                        role: ['admin', 'editor']
                    },{
                        name: '订房管理',
                        link: '',
                        icon: 'shenpi1',
                        color: '#F59324',
                        role: ['admin', 'editor']
                    },
                ]
            }
        },
        methods: {
            search() {
                this.showSearch = !this.showSearch;
            },
            pcLogin() {

            },
            handleMenu() {

            }
        }
    }
</script>

<style>
    .weui-grid:before {
         box-sizing: content-box;
    }
    /* li {
        list-style: initial;
    }
    li > a {
        color: #3a8ee6;
    } */
</style>
<style lang="stylus" rel="stylesheet/stylus">
@import '~assets/stylus/variable.styl';
@import '~assets/stylus/mixin.styl';

.test-pages
    height: 100%
    .triangle-down
        display: inline-block
        border-right: 2px solid
        border-bottom: 2px solid
        width: 8px
        height: 8px
        transform: rotate(45deg)
        vertical-align: middle
    .test-pages-content
        height: calc(100% - 50px)
        overflow: hidden
        .title
            flex-center(row, space-between, center)
            padding: 10px 20px
            .pc-login
                color: #0094FF
        .iconfont
            font-size: 22px
    .weui-grid
        .weui-grid__icon
            flex-center(row, center, center)
            width: auto
            height: auto
    .weui-grid:before
        border: none
    .weui-grid:after
        border: none
    .vux-search-fixed
        top: 0 !important
</style>

