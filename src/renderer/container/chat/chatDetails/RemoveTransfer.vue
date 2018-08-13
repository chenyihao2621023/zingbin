<template>
    <div class="transfer-owner-contact">
        <chat-header cancelText="取消" :title="operationCrewTitle" @doSome="goBack" :isComeBack="isComeBack">
            <div slot="header-right" style="margin-right:10px;line-height:50px;">
                <button class="determine-modify-owner" @click="showPlugin">{{operationCrewBtn}}</button>
                <i class="iconfont icon-fangdajing fangdajing" @click="changeIsShow"></i>
            </div>
        </chat-header>
        <search
            :ref="removeTransSearch"
            :searchFlag="showSearch"
            @confirmInput="getResult"
            @cancelInput="cancelInput"
            placeholder="查找人姓名"
        >
        </search>
        <div class="message-my-group-list">
            <div class="message-my-group-list-scroll">
                <div class="message-my-group-list-content">
                    <check-panel v-model="selectedList" :max="max" :list="groupMemberList" :disabled="isMultiple"
                                 :type="'6'" :label-position="'left'"></check-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { /*Search, */Cell, Group, Radio, XButton, Popup, XDialog, Toast } from "vux";
    import ChatHeader  from "../../../components/zingHead/ZingHead.vue"  //公共头部
    import Search from "components/search/search.vue";
    import { getImageUrl } from '../../../utils/fn'
    import CheckPanel from "../../../components/checkpanel/CheckPanel"
    import LazyImage from '../../../directives/lazyimage/lazy-image'
    import { callCancel } from "./chat-details.js"
    export default {
        name: 'RemoveTransfer',
        directives: {
            LazyImage
        },
        components: {
            ChatHeader, CheckPanel, Popup, Cell, Group, Radio, XButton, XDialog, Search, Toast
        },
        props: {
            isMultiple: {
                type: Boolean,
                default: false
            },
            showSelect: {
                type: Boolean,
                default: false
            },
            operationCrewBtn: {  //头部的按钮属性
                type: String,
                default: '确定'
            },
            operationCrewTitle: {  //头部标题
                type: String,
                default: '标题'
            },
            operationCrewList: { //群成员列表
                type: Array,
                default() {
                    return []
                }
            },
            operationCrewPrompt: {
                type: String,
                default: '请选择群员'
            },
            showMark: {
                type: Boolean,
                default: false
            },
            cardUrl: {
                type: String,
                default: ''
            },
            max: Number
        },
        data() {
            return {
                nameMessage: "",
                isComeBack: false,
                flagPrompt: false,
                transferCheckMark: false, //判断群主转让给谁
                selectedList: [],
                groupMemberList: [],
                showSearch: false,
                removePrompt: '转让成功,正在转发',//删除提示
                inputBoxValue: '',//搜索框的值
                isRemoveUser: false
            }
        },
        computed: {
            removeTransSearch() {
                let random = Math.floor(Math.random() * 11);
                return `removeTransSearch${random}`
            },
            nameMeg() { //选中组员的名字
                if (this.isRemoveUser) {
                    let removeMemberStr = "";
                    this.groupMemberList.forEach(item => {
                        this.selectedList.forEach(items => {
                            if (item.cardUrl === items) {
                                removeMemberStr += `${item.nickName || item.RealName},`
                            }
                        })
                    });
                    return removeMemberStr.substring(0, removeMemberStr.length - 1)
                }
            },
            inforMation() {
                if (this.selectedList.length > 0) {
                    return this.max === 1 ? `确定把群主转让给${this.nameMeg}?` : `确定把${this.nameMeg}移除?`
                } else {
                    return this.operationCrewPrompt
                }
            },
        },
        watch: {
            showMark () { //计算出来的群成员数据
                this.groupMemberList = this.operationCrewList.filter(item => {
                    item.key = item.cardUrl;
                    item.title = item.nickName || item.RealName
                    item.src = item.avatar;
                    return item.cardUrl !== this.cardUrl
                });
                this.storageList = JSON.parse(JSON.stringify(this.groupMemberList));
            },
        },
        methods: {
            goBack() {
                this.returnInitData();
                this.$emit('onOperationCrew');
            },
            returnInitData() {
                this.isRemoveUser = false;
                this.inputBoxValue = '';
                this.showSearch = false;
                this.selectedList = [];
                callCancel(this.$refs[this.removeTransSearch].$el);
            },
            getResult(val) { //搜索框输入
                if (val.length > 0) {
//                    console.log('0', val, this.groupMemberList, this.groupMemberList[3].RealName, this.groupMemberList[3].RealName.indexOf(val) > 0)
                    this.groupMemberList = this.groupMemberList.filter(item => {
                        return item.nickName ? item.nickName.indexOf(val) > -1 : item.RealName.indexOf(val) > -1
                    });
//                    console.log('1', this.groupMemberList)
                    this.groupMemberList = this.groupMemberList.length > 0 ? this.groupMemberList : this.storageList;
                } else {
                    this.groupMemberList = JSON.parse(JSON.stringify(this.storageList));
                }
            },
            //搜索框的隐藏显示
            changeIsShow() {
                !this.showSearch ? this.inputBoxValue = '' : null;
                this.showSearch = !this.showSearch;
            },
            cancelInput() {
                this.showSearch = !this.showSearch;
            },
            //弹框a
            showPlugin () {
                if (this.selectedList.length > 0) {
                    this.isRemoveUser = true;
                }
                const _this = this;

                if (this.isRemoveUser) {
                    this.$vux.confirm.show({
                        title: '提示',
                        content: this.inforMation,
                        cancelText: '取消',
                        confirmText: '确定',
                        hideOnBlur: false,
                        maskZIndex: 4000,
                        onConfirm () {
                            _this.$emit('clickConfirm', _this.returnInitData, _this.nameMeg, _this.selectedList);
                        }
                    });
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: this.inforMation,
                        confirmText: '确定',
                        hideOnBlur: true,
                        maskZIndex: 4000
                    });
                }
            },
            getImageUrl
        }
    }
</script>
<style lang="stylus" scoped>
    .message-my-group-list
        position: relative
        left: 0
        top: 44px
        overflow-y: auto

    .transfer-owner-contact
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%
        .chat-details-header
            position: fixed
            left: 0
            top: 0
            z-index: 99
            flex-shrink: 0
        .message-my-group-list
            width: 100%
            height: 100%
            position: relative
            left: 0
            top: 0
            overflow-y: auto
            .my-weui-content
                margin-top: 0;
                border-top: 1px solid #d1d1d1;
                img
                    width: 40px;
                    height: 40px;
                    display: block;
                    margin: 0 15px 0 5px;

    .determine-modify-owner
        display: inline-block;
        vertical-align: middle;
        font-size: 15px;
        border: none;
        width: 60px;
        color: #fff;
        height: 30px;
        letter-spacing: 1px;
        background-color: #ff8000;
        border-radius: 6px;
        margin-right: 2px;
        outline: none;

    .fangdajing
        display: inline-block;
        margin-left: 5px;
        font-size: 25px !important;
        vertical-align: middle;
        color: #000;
        font-weight: normal;

</style>
