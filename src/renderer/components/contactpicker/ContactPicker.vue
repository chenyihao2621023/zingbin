<template>
    <div>
        <zing-head cancelText="取消" title="通讯录" @doSome="handleClick" :isComeBack="false" style="position:fixed;top:0;width:100%;z-index:1000" @close="onClose" :isToMessage="false">
            <div slot="header-right" style="margin-right:10px">
                    <span class="determine-modify-owner"
                          @click="makeDeal"
                    >{{totalTitle}}</span>
            </div>
        </zing-head>
        <div class="intermediate-content">
            <div v-show="addGroupMembers.length">
                <ul class="chat-dialogue-entry-collect">
                    <li
                        v-for="(addItem,index) in addDataList"
                        :key="index"
                    >
                        <div>
                            <img
                                :src="addItem.headImg"
                                :data-src="getImageUrl(addItem.headImg,'./static/images/userDef_.jpg')"
                                data-error="./static/images/userDef_.jpg"
                                v-lazy-image
                            />
                        </div>
                        <p >{{addItem.userName}}</p>
                    </li>
                </ul>
            </div>
            <group v-if="!currentCompanyMode">
                <cell title="英商好友" class="my-cell-settings" @click.native="isShowPicker('user')">
                    <i slot="icon" class="iconfont icon-wode my-icon-increase"></i>
                </cell>
                <cell title="手机通信录" class="my-cell-settings" @click.native="choosePhoneContact">
                    <i slot="icon" class="iconfont icon-tongxunlu my-icon-increase"></i>
                </cell>
            </group>
            <div class="company-list" v-if="!friendAndPhoneContactMode">
                <div v-for="(item,index) in companyData" :key="index">
                    <cell
                        is-link
                        :border-intent="false"
                        :arrow-direction="clickMark[index] ? 'up' : 'down'"
                        @click.native="collapseMenu(index)" class="my-cell-settings">
                        <h5 slot="title">{{item.companyName}}</h5>
                        <img slot="icon" class="my-img-increase"
                             :src="item.headimgurl" onerror="this.src='./static/images/weicard.jpg'"
                        />
                    </cell>
                    <template v-if="clickMark[index]">
                        <cell class="my-cell-settings" title="同事名录" @click.native="isShowPicker(item.companyId)"
                              is-link>
                            <i slot="icon" class="iconfont icon-zuoxiajiao my-icon-increase-min"></i>
                        </cell>
                    </template>
                </div>
            </div>
            <group v-if="!currentCompanyMode && !friendAndPhoneContactMode">
                <cell title="常用联系人" class="my-cell-settings">
                    <i slot="icon" class="iconfont icon-iconfont-shangyi-copy my-icon-increase"></i>
                </cell>
            </group>
        </div>
        <!--<flexbox class="my-increase-flexbox">-->
            <!--<flexbox-item align="flex-start">-->
                <!--<div class="flex-demo my-flex-demo">{{addPeopleName}}</div>-->
            <!--</flexbox-item>-->
            <!--<flexbox-item align="center">-->
                <!--<div class="flex-demo my-flex-demo">-->
                    <!--<x-button mini class="my-flex-btn" @click.native="makeDeal">确定</x-button>-->
                <!--</div>-->
            <!--</flexbox-item>-->
        <!--</flexbox>-->
        <org-member-picker
            :showTab="showTab"
            :showPicker="showPicker"
            :multiple="multiple"
            @abort="onPickAbort"
            @picked="onPicked"
            :initialSelected="initialData"
            :companyId="currentCompanyMode ? companyId : clickCompanyId"
        ></org-member-picker>
    </div>
</template>
<script>
    import { Toast, Panel, Group, Radio, Popup, Cell, CellBox, XButton, FlexboxItem, Flexbox } from 'vux'
    import OrgMemberPicker from "../../components/orgmemberpicker/OrgMemberPicker"
    import ZingHead from "../../components/zingHead/ZingHead"  //公共头部
    import { getImageUrl } from "../../utils/fn"
    import LazyImage from '../../directives/lazyimage/lazy-image'
    import store from '../../store'

    export default {
        name: 'ContactPicker',
        directives: {
            LazyImage
        },
        components: {
            ZingHead,
            OrgMemberPicker,
            CellBox,
            Cell,
            Panel,
            Group,
            Radio,
            Popup,
            XButton,
            FlexboxItem,
            Flexbox,
            Toast
        },
        props: {
            currentCompanyMode: {
                type: Boolean,
                default :false
            },
            // 当前companyId， currentCompanyMode下需要传
            companyId: {
                type: String
            },
            friendAndPhoneContactMode: {
                type: Boolean,
                default: false
            },
            initialSelected:{
                type:Array,
                default: function() {
                    return [];
                }
            },
            refreshSeed: {
                type: Boolean,
                default: false
            },
            multiple:{
                type: Boolean,
                default: true
            },
            confirmMsg: {
                type: String,
                default: '确定添加%s？'
            }
        },
        data() {
            return {
                dataReady: false,
//                companyDataList: [],
                companyData: [],
                promptType: "success",
                promptMask: true,
                promptText: "",// 弹框内容提示
                clickMark: [],
                showPicker: false, //选人组件
                showTab: ["colleague", "friends"],
                clickCompanyId: "", //点击的商业号, todo，与选人组件对接
                addGroupMembers: [], //增加的数据
                hasFriendSelected: false, // 判断是否点击过好友
                selectedCompanyId: [], // 确定添加人数的商业号
            }
        },
        computed: {
            companyDataList() {
//                console.log('serverNumberList', store.state.ui.serverNumberList)
                return [...store.state.ui.serverNumberList]
            },
            addPeopleName() {
                let addName = "";
                let addCardUrlAry = [];
                this.addGroupMembers.forEach(item => {
                    addName += `${item.userName},`;
//                    this.addCardUrlStr += `${item.cardUrl},`;
                    addCardUrlAry.push({ id: item.cardUrl });
                });
//                this.addCardUrlJson = addCardUrlAry;
                return addName.substring(0, addName.length - 1)
            },
            totalTitle() {
                let leg = this.addGroupMembers.length;
              return leg ? `完成(${leg})` : '完成'
            },
            addDataList() {
                let leg = this.addGroupMembers.length;
                if (leg > 8) {
                    let x = leg - 8;
                    return this.addGroupMembers.slice(x)
                }
                return this.addGroupMembers
            },
            initialData() {
                if (this.addGroupMembers.length) {
                   let o = this.addGroupMembers.map(item => ({ value: item.cardUrl,type:'user' }))
                    return [...o,...this.initialSelected]
                }
                return this.initialSelected
            }
            /*showTab() {
                let showTabAry = [];
                if (this.currentCompanyMode) {
                    showTabAry = ["colleague"];
                } else {
                    showTabAry = ["colleague","friends"];
                }
                return showTabAry
            }*/
        },
        watch: {
            currentCompanyMode: {
                handler() {
                    this.handleCompanyData()
                    this.handleShowTab()
                },
                immediate: true
            },
            showPicker(val) {
                if (!val) {
                    this.handleShowTab()
                }
            },
            refreshSeed () {
                this.loadServerNumber()
            },
            companyDataList() {
//                console.log('watch companyDataList')
                this.handleCompanyData()
            }
        },
        mounted() {
            this.loadServerNumber()
        },
        methods: {
            onClose() {
                this.handleClick();
                this.$router.push('/messagelist')
            },
            loadServerNumber() {
                store.dispatch('loadServerNumber')
            },
            /*initData() {
                // load companyData
                let url = "/ZingMH/ZDesk/MENHUWX/Company/loadServerNumber.action";
                this.$http.post(url).then(res => {
                    if (res.data.retcode !== -1) {
                        this.companyDataList = res.data.data
                        this.handleCompanyData()
                        this.dataReady = true
                    } else {
                        console.warn('error loadServerNumber data', res.data)
                    }
                })
            },
            isDataReady() {
                return this.dataReady
            },*/
            onPicked(prickedAry) {  //prickedAry增加的群成员  type:array
                let prickedData = prickedAry;
                let initSelected = this.initialData;
                if (initSelected.length && prickedData.length) {
                    initSelected.forEach(initItem => {
                        prickedData = prickedData.filter(prickedItem => {
                            return prickedItem.cardUrl !== initItem.value
                        })
                    })
                }
                console.log(this.initialData,'initialData');
                this.addGroupMembers = [...this.addGroupMembers, ...prickedData];
                console.log(this.addGroupMembers,'addGroupMembers');
                this.showPicker = false;
                if (this.clickCompanyId !== "user") {
                    if (!this.selectedCompanyId.includes(this.clickCompanyId)) {
                        this.selectedCompanyId.push(this.clickCompanyId)
                    }
                } else {
                    this.isFriendFlag = false
                }
            },
            onPickAbort() { //隐藏选人组件
                this.showPicker = false
            },
            isShowPicker(item) { //显示选人组件
                if (item === 'user') {
                    this.showTab = ['friends']
                }

                this.showPicker = true;
                this.clickCompanyId = item;
            },
            choosePhoneContact() {
                this.$vux.alert.show({
                    title: '提示',
                    content: '维护中...',
                })
            },
            collapseMenu(i) { //设置折叠菜单
                this.$set(this.clickMark, i, !this.clickMark[i]);
            },
            handleClick() { //返回按钮
                this.$emit("goBack");
                this.clickCompanyId = '';
                this.clickMark = [];
                this.addGroupMembers = [];
                this.hasFriendSelected = false;
                this.selectedCompanyId = []
            },
            deal() { //跳转+清空数据
                this.$emit('picked',[...this.addGroupMembers], String(this.addPeopleName), Boolean(this.hasFriendSelected), [...this.selectedCompanyId]);
                this.clickCompanyId = '';
                this.clickMark = [];
                this.addGroupMembers = [];
                this.hasFriendSelected = false;
                this.selectedCompanyId = []
            },
            makeDeal() { //确定按钮弹框
                const _this = this;
                this.$vux.confirm.show({
                    title: "提示",
                    content: this.addGroupMembers.length > 0 ? this.confirmMsg.replace('%s', this.addPeopleName) : "请选择添加成员",
                    cancelText: this.addGroupMembers.length > 0 ? "取消" : " ",//transferInformation.cancelText,
                    confirmText: this.addGroupMembers.length > 0 ? "确定" : " ",//transferInformation.confirmText,
                    hideOnBlur: this.addGroupMembers.length > 0 ? false : true, //transferInformation.hideOnBlur,
                    maskZIndex:'5000',
                    onConfirm() {
                        _this.deal();
                    }
                });
            },
            handleCompanyData() {
//                console.log('handleCompanyData', this.companyDataList, this.currentCompanyMode)
                if (this.currentCompanyMode) {
                    this.companyData = this.companyDataList.filter(item => item.id === this.companyId);
                    if (this.companyData.length === 0) return;
                    this.companyData[0].headimgurl = this.companyData[0].headimgurl ? getImageUrl(this.companyData[0].headimgurl.indexOf('.jpg') < 0 ? this.companyData[0].headimgurl + '.jpg' : this.companyData[0].headimgurl, '/JsLib/dist/app/images/weicard.jpg') : './static/images/weicard.jpg'
                } else {
                    this.companyData = this.companyDataList;
//                    console.log('handleCompanyData1.5', this.companyData)
                    this.companyData = this.companyData.map(item => {
                        item.headimgurl = item.headimgurl ? getImageUrl(item.headimgurl.indexOf(".jpg") < 0 ? item.headimgurl + '.jpg' : item.headimgurl, '/JsLib/dist/app/images/weicard.jpg') : './static/images/weicard.jpg'
                        return item
                    });
                }
//                console.log('handleCompanyData2', this.companyData)
            },
            handleShowTab() {
                if (this.currentCompanyMode) {
                    this.showTab = ['colleague']
                } else {
                    this.showTab = ['colleague', 'friends']
                }
            },
            getImageUrl
        }
    }
</script>
<style lang="stylus" scoped>
    .company-list
        margin: 10px 0;
        background: #fff;
    .determine-modify-owner
        font-size:15px;
        border:none;
        color:#FF8000;
        margin-right:2px;
    .intermediate-content
        position: relative;
        width: 100%;
        top: 50px;
        margin-bottom: 50px;
    .my-cell-settings
        font-size: 18px;
        color: #2a2a2a;
        height: 60px;
        white-space: nowrap;
        /*border-bottom: 2px solid #e2e2e2;*/
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
    .personner-company-content
        margin-top: 5%;
        background: #fff;
        box-shadow: 1px 1px 1px 1px #d1d1d1;
    .chat-dialogue-entry-collect
        background-color: #fff;
        position: relative;
        padding-top:2px
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        color: #464646;
        font-size: 14px;
        box-shadow: 1px 1px 1px #b7b7b7;
        li
            float: left;
            flex-grow: 1;
            max-width: 12%;
            text-align: center;
            div
                position: relative;
                border-radius: 6px;
                overflow: hidden;
                width: 40px;
                height: 40px;
                margin: 0 auto;
                background-size: cover;
                border: 1px solid #eee;
                img
                    width: 100%;
                    height: 100%;
            p
                margin-bottom: 8px;
                text-overflow : ellipsis;
                white-space : nowrap;
                overflow : hidden;
</style>



