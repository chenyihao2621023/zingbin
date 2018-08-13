<template>
  <div class="my-friend">
      <!-- allSortList数据结构 需要修改 需满足vux中PopupPicker的数据结构要求 -->
      <contact-head
      :menuData="menuData"
      :allSortList="allSortList"
      @onHandleMenu="handleMenu"
      @onHandleSort="handleSort"
      @onSearch="onSearch"
      :showSearchIcon="true"
      :showDropDown="true"
      :leftTitle="leftTitle"
      title="英商好友"
      :isComeBack="false"
      ></contact-head>
      <div class="my-friend-list">
          <scroll
            :observeDOM="true" ref="scroll"
            :data="myFriendList" :scrollbar="true" :pullUpLoad="{threshold: 0 }"
                  :startY="0" @pullingUp="onPullingUp">
              <div class="link-content-list">
                     <contact-list class="link-content"
                         :conTactType="1"
                         @goChat="onGoChat"
                         @clickItem="onFriendItem"
                         :showRightIcon="true"
                         :list="myFriendList"
                          :showRight="true"
                          @getTags="onGetTags"
                           promptTitle="暂无好友"
                     >
                     </contact-list>
              </div>
            </scroll>
      </div>
          <classify-dialog
              :showDialog="showDialog"
              :menusList="allSortData"
              @settingType="onSettingType"
              @closeClassifyDig="onCloseClassifyDig"
          >
          </classify-dialog>
  </div>
</template>
<script>
    import Qs from "qs"
    import { Z_DU,Z_IsEmpty20,createChat,doOneChat } from "../../utils/fn"
    import { Popup,Actionsheet } from "vux"
    import ContactHead from './ContactHead.vue'
    import ContactList from "./ContactList.vue"
    import ClassifyDialog from "./ClassifyDialog.vue"
    import Scroll from "@/components/scroll/Scroll";
    export default {
    name: 'BritishFriends',
    components: {
        ContactHead,ContactList,Popup,Scroll,ClassifyDialog,Actionsheet
    },
    data() {
      return {
          menuData:[
              {
                  content: "发起聊天",
                  value: 'initiateChat'
              },
              {
                  content: "添加好友",
                  value: 'addFriend'
              },
              {
                  content: "添加商号",
                  value: 'addBusiness'
              },
              {
                  content: "自定义分类",
                  value: 'customType'
              }
          ],
          myFriendList:[],
          leftTitle:'全部分类',
          allSortData:[],
          saveData:[],
          pageNumber:1,
          hasMore:true,
          total:0,
          saveAllSortData:[],
          showDialog:false,
          cardUrlPeer:''
      }
    },
    computed: {
        allSortList() {
            let o = this.allSortData.map(item => item.tags);
            o.unshift('全部');
            return [o]
        }
    },
    created() {
       this.init()
    },
    methods: {
        onCloseClassifyDig() {
            this.showDialog = false
        },
        handleMenu(data) {
            switch (data.value) {
                case 'initiateChat':
                    this.onInitiateChat();
                    break;
                case 'addFriend':
                    this.onAddFriend();
                    break;
                case 'addBusiness':
                    this.onAddBusiness()
                    break;
                case 'customType':
                    this.onCustomType();
                    break
           }
        },
        handleSort(data) {
            this.pageNumber = 1;
            this.hasMore = true;
            this.showDialog = false;
            this.getFriendList(data[0]).then(res => {
                if (res.data.success) {
                    this.leftTitle = data.content;
                    if (!res.data.data.data.length) {
                        this.myFriendList = [];
                        return;
                    }
                    this.dataProcessing(res.data.data.data,res.data.data.total);
                }
            });
        },
        handleData() {
            let title = this.leftTitle === '全部分类' ? '全部' : this.leftTitle;
            this.getFriendList(title).then(res => {
                if (res.data.success) {
                    this.dataProcessing(res.data.data.data,res.data.data.total);
                }
            });
        },
        onPullingUp() {
         setTimeout(() => {
             if (this.hasMore) {
                 this.handleData();
                 this.$refs.scroll.forceUpdate()
             } else {
                 this.$refs.scroll.forceUpdate(false)
             }
         },500)
        },
        onInitiateChat() {
//            this.$zingp.createChat.show()
            createChat(this);
        },
        dataProcessing(data,total) {
            if (!data.length) {
                // this.myFriendList = [];
                return;
            }
            this.hasMore = total > (data.length + this.myFriendList.length) === 'false' ? false : true;
            let o = data.map(item => {
                if (item.headimgurl) {
                    item.src = Z_DU(item.headimgurl)
                } else {
                    item.src = !Z_IsEmpty20(item.cardUrl) && item.cardUrl.length > 2 && '/checkJpg/' + item.cardUrl.substring(0, 2) + '/' + item.cardUrl + '.jpg'
                }
                item.title = item.RealName;
                item.desc = `电话: ${item.Cellphone}`;
//                item.src = getImageUrl(item.src,'./static/images/userDef_.jpg');
                return item
            });
            if (this.pageNumber === 1) {
                this.myFriendList = o;
            } else {
                this.myFriendList = [...this.myFriendList,...o];
            }
            this.pageNumber += 1;
            this.saveData = JSON.parse(JSON.stringify(this.myFriendList));
        },
        sortProcessing(data) {
            this.allSortData = data;
            this.saveAllSortData = JSON.parse(JSON.stringify(this.allSortData))
        },
        onAddFriend() {
            this.$router.push({
                path: "searchMHAccount",
                query: {
                    url: "/ZingMH/ZDesk/serviceFriend/searchCard.action",
                    searchKey: "keyCard"
                }
            })
        },
        onAddBusiness() {
            this.$router.push({
                path: "searchMHAccount",
                query: {
                     url: '/ZingMH/ZDesk/MENHUWX/MHServiceN/getAllServiceNumber.action',
                     searchKey: "keyCard"
                }
            });
        },
        onCustomType() {
            this.$router.push({
                path: "/classmain",
                query: {
                    classType: 'myFriend'
                }
            });
        },
        onSettingType(item) {
            if (!item) return;
            let { isCancel,tags } = item;
            let url = ' /zingbiz/auth/user/serviceFriend/updateTheClass';
            let params = {
                tagName: tags,
                cardUrlPeer: this.cardUrlPeer,
                isCancel: isCancel,
            };
            this.$http.post(url,params).then(res => {
                if (res.data.success) {
                    if (this.leftTitle !== '全部' && this.leftTitle !== '全部分类') {
                        this.myFriendList = this.myFriendList.filter(item => item.cardUrl !== this.cardUrlPeer);
                    }
                    this.showDialog = false;
                    let msg = '设置分类成功';
                  isCancel ? msg = '移除分类成功' : null;
                    this.bottomToast(msg,'success');
                } else {
                    this.bottomToast('设置分类失败','warn');
                }
            },err => {
                this.bottomToast('设置分类失败','warn');
            })
        },
        onGetTags(item) {
            const _this = this;
            this.$vux.actionsheet.show({
                menus: ["设置分类"],
                onMenuClick(text, key) {
                    switch (key) {
                        case 0:
                            _this.settingClassify(item);
                            break;
                    }
                    this.show = false;
                }
            });
        },
        settingClassify(item) {
            if (!item) return;
            this.showDialog = false;
            this.cardUrlPeer = item.cardUrl;
            let url = '/zingbiz/auth/user/serviceFriend/getFriendTypeBycardUrlPeer';
            let params = {
                cardUrlPeer: this.cardUrlPeer
            };
            this.$http.post(url,params).then(res => {
                let { data,success } = res.data;
                if (success ) {
                    if (Object.keys(data).length) {
                        let { tagName } = data;
                        this.allSortData = this.allSortData.map(item => {
                            item.isCancel = item.tags === tagName;
                            return item
                        });
                    } else {
                        this.allSortData = this.saveAllSortData
                    }
                    this.showDialog = true;
                }
            },err => {
                console.log(err);
            })
        },
        onFriendItem(item) {
            this.cleanRedDot(item.cardUrl);
            item && this.$router.push({
                name:'cardDetails',
                query:{
                    cardUrl:item.cardUrl
                }
            })
        },
        cleanRedDot(peerCardUrl) {
            if (!peerCardUrl) return;
            let url = `/zingbiz/auth/user/serviceFriend/updateIreadCardStatusES`;
            let params = {
                readCard: true,
                peerCardUrl
            };
            this.$http.get(url,{ params }).then(res => {
                //等测试
              
            },error => {
                console.log(error);
            });
        },
        onSearch(val) {
            this.myFriendList = this.saveData.filter(item => item.title.includes(val));
        },
        onGoChat(item) {
            this.cleanRedDot(item.cardUrl);
            doOneChat(item.cardUrl, true, this.$router).catch(err => {
                console.error(err)
            })
        },
        getFriendList(tagName) {
            if (!this.hasMore) return;
            let tag = tagName || '';
            let url = '/zingbiz/auth/user/serviceFriend/getFriendNumListES?zIsCacheDirect=true&DirectCacheKey=get_friend_num_list_es_param';
            let params = {
                companyId: false,
                type:'',
                tagName:tag,
                pageNumber: this.pageNumber,
                pageSize: 10
            };
           return this.$http.post(url,params);
        },
        getSortList() {
            let urlType = '/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl';
            let paramsType = {
                tagType: 'myFriend',
                companyId:'',
                isCompanyId:'',
                pageNumber: 1,
                pageSize: 20
            };
          return this.$http.post(urlType,paramsType)
        },
        bottomToast (msg,type) {
            let _this = this
            if (!msg) return
            this.$vux.toast.show({
                text: msg,
                type,
                position: 'middle',
                width:'8em',
                onHide() {
                    _this.bottomToast('')
                }
            })
        },
        init() {
            this.$http.all([this.getFriendList(), this.getSortList()]).then(this.$http.spread((friendList,sortList) => {
                console.log(friendList);
                if (friendList.data.success) {
                    this.dataProcessing(friendList.data.data.data,friendList.data.data.total);
                }
                if (sortList.data.success) {
                    this.sortProcessing(sortList.data.data.data);
                }
            }))
        }
    }
  }
//  /ZingMH/ZDesk/serviceFriend/gtFriendTypeBycardUrlPeer.actione
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

    .my-friend
        width: 100%
        height: 100%
        & > div
            width: 100%
        .my-friend-list
            height calc(100% - 50px)
            overflow hidden
           .link-content-list
              position: relative
              flex-center(row, start, center)
              .link-content
                width:100%
</style>
