<template>
    <div class="contact">
        <PopMenu
           :show="showPopMenu"
           @on-hide="hideMenu"
           :menuData="popMenuData"
           @cancel="hideMenu"
           @click-menu-item="handleMenuItem"
        />
        <zing-head class="contact-head" :title="'通讯录'">
            <div slot="header-right">
                <!--<span class="header-search" @click="search">
                    <i class="iconfont icon-fangdajing"></i>
                </span>-->
                <span class="header-jiahao" style="width: 37.5px; margin-right: 7.5px; padding-left: 5px; padding-right: 5px;">
                    <!-- <dropdown :data="menuData" trigger="click" placement="bottomRight" @item-click="handleMenu"> -->
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger" @click="handleMenu">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    <!-- </dropdown> -->
                </span>
            </div>
        </zing-head>
        <div class="content-fixed">
            <group>
                <cell title="新的好友" class="my-cell-settings" @click.native="goToPage('newFriends')">
                    <i slot="inline-desc" v-show="isAlertMenuNew" class="my-dot-contact">
                    </i>
                    <i slot="icon" class="iconfont icon-jiaren my-icon-increase"></i>
                </cell>
                <cell title="英商好友" class="my-cell-settings" @click.native="goToPage('friends')">
                    <i slot="inline-desc" v-show="isAlertMenuOld" class="my-dot-contact"></i>
                    <i slot="icon" class="iconfont icon-wode my-icon-increase"></i>
                </cell>
                <cell title="手机通信录" class="my-cell-settings" @click.native="goToPage('phoneContact')">
                    <i slot="icon" class="iconfont icon-tongxunlu my-icon-increase"></i>
                </cell>
                <cell title="我的群组" class="my-cell-settings" @click.native="goToPage('myGroup')">
                    <i slot="icon" class="iconfont icon-qunzu my-icon-increase"></i>
                </cell>
            </group>
        </div>
        <div class="content-scroll">
            <div class="intermediate-content">
                <div class="company-list">
                    <div v-for="(item,index) in companyData" :key="index">
                        <contact-co-item :data="item" @itemClick="itemClick"></contact-co-item>
                    </div>
                </div>
            </div>
        </div>
        <confirm v-model="showAddCompany"
                 show-input
                 title="请输入邀请码"
                 :input-attrs="{type: 'string'}"
                 @on-confirm="addCompany">
        </confirm>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import { Z_IsEmpty20, MH_changeUserCompany, createChat } from "../../utils/fn";
    import { Group, Cell, /*TransferDom, */Confirm , Tabbar , TabbarItem } from 'vux'
    import Dropdown from 'components/dropdown/Dropdown'
    import ZingHead from 'components/zingHead/ZingHead.vue'
    import ContactCoItem from 'components/contactpicker/ContactCoItem.vue'
    import PopMenu from "components/popmenu/PopMenu";

    export default {
        name: "Contact",
        /*directives: {
            TransferDom
        },*/
        components: {
            Group,
            Cell,
            ContactCoItem,
            ZingHead,
            Dropdown,
            Confirm,
            PopMenu,
            Tabbar,
            TabbarItem
        },
        data() {
            return {
                showPopMenu: false,
                popMenuData: [{
                    text: "添加商号",
                    value: 'joinCompany',
                    icon: 'shoucang1'
                },
                {
                    text: "创建商号",
                    value: 'createCompany',
                    icon: 'shoucang1',
                }],
                showContactPicker: true,
                menuData: [
                    {
                        content: "发起群聊",
                        value: 'createChat'
                    },
                    {
                        content: "添加好友",
                        value: 'addFriend'
                    },
                    {
                        content: "添加商号",
                        value: 'joinCompany'
                    },
                    {
                        content: "创建商号",
                        value: 'createCompany'
                    }
                ],
                isAlertMenuNew:false,
                isAlertMenuOld:false,
                companyDataList: [],
                companyData: [],
                clickMark: [],
                showAddCompany: false, //添加公司dialog
            };
        },
        computed: {
            ...mapState({
                isMode: state => state.ui.isMode,
                redPoint: state => state.ui.redPoint,
                bottomToast: state => state.ui.bottomToast
            })
        },
        watch: {
            redPoint (rpData) {
                if (!rpData) {
                    console.warn("error redPoint data", rpData);
                    return;
                }
                // _ZSP_f_" + favMeCount + "_ZSP_fFriend_" + favMeFriend
                let sArr = rpData.split("_ZSP_");
                for (let i = 0; i < sArr.length; i++) {
                    if (!Z_IsEmpty20(sArr[i])) {
                        if (sArr[i].indexOf("f_") !== -1) {
                            let favCount = sArr[i].substring(sArr[i].indexOf("f_") + 2);
                            if (!Z_IsEmpty20(favCount) && favCount !== "0") {
                                this.isAlertMenuNew = true;
                            }
                        } else if (sArr[i].indexOf("fFriend_") !== -1) {
                            let friendList = sArr[i].substring(sArr[i].indexOf("fFriend_") + 8);
                            if (!Z_IsEmpty20(friendList) && friendList !== "0") {
                                this.isAlertMenuOld = true;
                            }
                        }
                    }
                }
            },
        },
        mounted() {
            // load companyData
            let urlAllBingdingCompany = "/zingbiz/auth/user/getMyCompanys";
            this.$http.post(urlAllBingdingCompany, {}).then(res => {
                if (res.data.data && res.data.data instanceof Array) {
                    this.companyDataList = res.data.data
                    this.handleCompanyData()
                } else {
                    console.warn('error getMyCompany', res)
                }
            })
        },
        methods: {
            hideMenu() {
                this.showPopMenu = false
            },
            handleMenuItem(val) {
                this.showPopMenu = false
                switch (val.value) {
                    // folder menu
                    case 'createChat':
                        console.log('createChat')
                        createChat(this)
                        break
                    case 'addFriend':
                    console.log('searchMHAccount')
                        this.$router.push({
                            path: "searchMHAccount",
                            query: {
                                url: "/ZingMH/ZDesk/serviceFriend/searchCard.action",
                                searchKey: "keyCard"
                            }
                        });
                        break
                    case 'joinCompany':
                        this.$router.push({
                            path: "searchMHAccount",
                            query: {
                                // url: "/ZingMH/ZDesk/MENHUWX/MHServiceN/getAllServiceNumber.action",
                                // searchKey: "keyCard"
                            }
                        });
                        break
                    case 'createCompany':
                        this.showAddCompany = true;
                        break
                    default:
                        console.warn('unsolved menu', val)
                }
            },
            collapseMenu(i) { //设置折叠菜单
                this.$set(this.clickMark, i, !this.clickMark[i]);
            },
            handleMenu() {
                // console.log('handleMenu', data)
                this.showPopMenu = true

            },
            //开通服务号输入邀请码
            addCompany(code) {
                let url = "/ZingMH/ZDesk/MENHUWX/Company/checkAuthenCode.action";
                this.$http
                    .get(url, { params: { authenCode: code }})
                    .then(res => {
                        let retcode = res.data["retcode"];
                        if (retcode === 0) {
                            // alert("sucess");
                            this.$router.push({
                                path: "creatCompany",
                                query: {
                                    authCode: code
                                }
                            });
                        } else {
                            this.$vux.toast.text("邀请码不可用!");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            handleCompanyData() {
                this.companyData = this.companyDataList.map(item => {
//                    item.headimgurl = item.headimgurl ? getImageUrl(item.headimgurl + '.jpg', '/JsLib/dist/app/images/weicard.jpg') : './static/images/weicard.jpg'
                    return item
                });
            },
            goToPage(pageType) {
                switch (pageType) {
                    case 'newFriends':
                        // location.href = '/SRender?jsLoader=Favorite%2FcollecterLoader&tpl=Favorite%2Fcollecter.html&v=1.13161216_1319'
                        this.$router.push({
                            path: "newFriends"
                        });
                        break;
                    case 'friends':
                        this.$router.push({
                            path: "friends"
                        });
//                        location.href = '/SRender?jsLoader=Favorite%2FmyFriendLoader&tpl=Favorite%2FmyFriendNew&zIsCacheDirect=true&v=1.13161216_1319'
                        break;
                    case 'phoneContact':
                        this.$vux.alert.show({
                            title: '提示',
                            content: '维护中...',
                        })
                        break;
                    case 'myGroup':
                        this.$router.push({
                            path:'/myGroups'
                        })
                        break;
                    default:
                        console.warn('not supported page type', pageType)
                }
            },
            itemClick(type, data) {
                MH_changeUserCompany(data.id).then(() => {
                    switch (type) {
                        case 'colleague':
                            this.$router.push({
                                path: 'orgList',
                                query: {
                                    companyId: data.id
                                }
                            })
                            break;
                        case 'externalContact':
                            this.$router.push({
                                path: 'outContactMain',
                                query: {
                                    companyId: data.id
                                }
                            })
                            break;
                    }
                })
            }
        },

    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .contact
        width: 100%;
        height: 100%;
        background-color: #F0EFF5
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%;
        .contact-head, .contact-fixed
            flex-shrink 0
        .content-scroll
            margin-top: 15px
            flex-grow 2
            overflow auto
            .intermediate-content
                min-width: 100%
                height: 100%
                .company-list
                    background: #fff;
    .my-cell-settings
        font-size: 18px;
        color: #2a2a2a;
        height: 60px;
        white-space: nowrap;
        /*border-bottom: 1px solid #e2e2e2;*/
        h5
            font-size: 18px;
            font-weight: normal
        .my-icon-increase, .my-img-increase, .my-icon-increase-min
            font-size: 40px !important;
            text-align: center;
            width: 50px;
            height: 45px;
            display: block;
            margin-right: 20px;
            color: #ff8000;
            line-height: 45px;
        .my-icon-increase-min
            position: relative
            right: 0
            top: 0
            font-size: 15px !important;
        .my-dot-contact
            display: inline-block
            width: 8px
            height: 8px
            background: red
            border-radius: 50%
            position absolute
            top:7px
            left 57px
</style>

