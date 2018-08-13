<template>
   <div class="new-friend">
       <contact-head
           :showSearchIcon="false"
           :showDropDown="false"
           titleI="好友申请"
           :menuData="menuData"
           @onHandleMenu="handleMenu"
           :isComeBack="true"
       >
       </contact-head>
       <contact-list class="link-content"
       :conTactType="1"
       :showRightIcon="false"
       :showRight="false"
       :list="newFriendList"
       @getTags="onGetTags"
       @onRemoveRequest="removeRequest"
       @clickItem="onFriendItem"
       promptTitle="暂无好友请求"
       @onAcceptRequest="acceptRequest"
       >
       </contact-list>
       <!--<div class="new-friend-list" v-show="newFriendList.length">-->
           <!--<scroll :observeDOM="true" ref="scroll" :data="newFriendList" :scrollbar="true" :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }"-->
                   <!--:startY="0" @pullingUp="onPullingUp">-->
               <!--<div class="link-content-list">-->
                   <!--<contact-list class="link-content"-->
                                 <!--:conTactType="1"-->
                                 <!--@goChat="onGoChat"-->
                                 <!--@clickItem="onFriendItem"-->
                                 <!--:showRightIcon="true"-->
                                 <!--:list="newFriendList"-->
                                 <!--@getTags="onGetTags"-->
                   <!--&gt;-->
                   <!--</contact-list>-->
               <!--</div>-->
           <!--</scroll>-->
       <!--</div>-->
       <!--<p v-show="!myFriendList.length">暂无内容</p>-->
   </div>
</template>

<script>
    import ContactHead from './ContactHead'
    import ContactList from "./ContactList.vue"
    import Scroll from "components/scroll/Scroll";
    import { Z_IsEmpty20 } from '../../utils/fn'
    import Qs from 'qs'
    export default {
        name: "NewFriends",
        components: {
            ContactHead,
            ContactList,
            Scroll
        },
        data() {
            return {
                menuData:[
                    {
                        content: "添加好友",
                        value: 'addFriends'
                    }
              ],
                newFriendList:[]
            }
        },
        created() {
          this.initData();
        },
        methods:{
            handleMenu(data) {
                switch (data.value) {
                    case 'addFriends':
                        this.onAddFriend();
                        break;
                }
            },
            acceptRequest(item) {
                let that = this;
                that.$vux.confirm.show({
                    title: '提示',
                    content: `确认添加为好友?`,
                    onConfirm () {
                        let url = `/zingbiz/auth/user/serviceFriend/addFriendES?cardUrlPeer=${item.cardUrl}`;
                        that.$http.get(url,{}).then(res => {
                            if (res.data.success) {
                                that.bottomToast('接受成功','success')
                                that.newFriendList = that.newFriendList.filter(itemData => itemData.cardUrl !== item.cardUrl);
                            } else {
                                that.bottomToast('接受失败','warn')
                            }

                        })
                    }
                })
            },
            removeRequest(item) {
                let that = this
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确认删除此记录么?',
                    onConfirm () {
                        that.delete(item)
                    }
                })
            },
            delete(item) {
                // let url = 'ZingMH/ZDesk/serviceFriend/delFriendApply.action';
                let url = '/zingbiz/auth/user/serviceFriend/delFriendApply';
                let params = {
                    type: item.type,
                    peerCardUrl: item.cardUrl
                };
                this.$http.post(url,params).then(res => {
                    if (res.data.success) {
                        this.newFriendList = this.newFriendList.filter(itemData => itemData.cardUrl !== item.cardUrl);
                        this.bottomToast('删除成功','success')
                    } else {
                        this.bottomToast('删除失败','warn')
                    }
                },err => {
                    console.log(err);
                    this.bottomToast('删除失败','warn');
                })
            },
            onFriendItem(item) {
                item && this.$router.push({
                    name:'cardDetails',
                    query:{
                        cardUrl:item.cardUrl
                    }
                })
            },
            onAddFriend() {
                this.$router.push({
                    path: "searchMHAccount",
                    query: {
                        url: "/zingbiz/auth/user/serviceFriend/searchCard",
                        searchKey: "keyCard"
                    }
                })
            },
            bottomToast (msg,type) {
                let _this = this
                if (!msg) return
                this.$vux.toast.show({
                    text: msg,
                    type,
                    position: 'middle',
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            // '"/ZingMH/ZDesk/serviceFriend/addFriendES.action"'
            onProcessData(dataList) {
                if (!dataList.length) return;
                let o = dataList.map(item => {
                    item.title = item.cardurlRealName || item.peerRealName;
                    item.src = !Z_IsEmpty20(item.cardUrlPeer) && item.cardUrlPeer.length > 2 && '/checkJpg/' + item.cardUrlPeer.substring(0, 2) + '/' + item.cardUrlPeer + '.jpg';
                    item.cardUrl = item.cardUrlPeer;
                    return item;
                });
                this.newFriendList = o;
            },
            initData() {
              // let url = '/ZingMH/ZDesk/searchCollector/getCollectorNumListES.action';
              let url = '/zingbiz/auth/user/serviceFriend/getCollectorListES';
              let params = {
                  pageNumber: 1,
                  pageSize: 10
              };
              this.$http.post(url,params).then(res => {
                  if (res.data.success) {
                      let { data,total } = res.data.data;
                      if (total) {
                          this.onProcessData(data)
                      }
                  }
              })
            }
        }
    }
</script>
<style>
    .weui-toast.weui-toast_forbidden {
        color: #e5e5e5
    }
    .weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before{
        color: #e5e5e5
    }
</style>
<style scoped lang="stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .new-friend
        width: 100%
        height: 100%
        & > div
            width: 100%
        .new-friend-list
            height calc(100% - 50px)
            overflow hidden
        .link-content-list
            position: relative
            flex-center(row, start, center)
            .link-content
                width:100%
</style>
