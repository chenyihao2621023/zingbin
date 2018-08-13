<!--编辑属性（成员）-->
<template>
    <div v-transfer-dom>
        <popup v-model="showListMember" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div id="insertOrUpdateInfo" class="insertOrUpdateInfo">
                <zing-head :isShowQuery="false" :title="'成员管理'" :isComeBack="false" @doSome="backlist">
                    <div slot="left"></div>
                </zing-head>
                <div class="listMemberContentWrap">
                    <div class="listMemberContent">
                            <Scroll ref="scroll" :scrollbar="true">
                                <!--成员-->
                                <div class="listMemberCommonPart jiaChengyuan">
                                    <div class="listMemberCommonPartLeft chenLeft">
                                        <span>成员<span style="color: red">*</span></span>
                                    </div>
                                    <div class="listMemberCommonPartRight chenRight" :class="{chengHrightClass:chengHright}">
                                        <div class="chengyuan" v-for="(cheng,index) in insertNew" :key="index" v-if="cheng.value" @click="chengyuanXQ(index)">
                                            <avatar v-if="cheng.headImg" :size="'default'" shape="square" :src="getImageUrl(cheng.headImg,'./static/images/userDef_.jpg')" style=" float: left;margin:5px;"></avatar>
                                            <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style=" float: left;margin:5px;"></avatar>
                                        </div>
                                    </div>
                                    <div class="listMemberCommonPartJiahao chengJiahao" :class="{chengHclass:chengH}">
                                        <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectInputPerson()"></i>
                                    </div>
                                </div>
                                <!--负责人-->
                                <div class="listMemberCommonPart jiaFuzeren">
                                    <div class="listMemberCommonPartLeft chenLeft">
                                        <span>负责人<span style="color: red">*</span></span>
                                    </div>
                                    <div class="listMemberCommonPartRight fuzerenRight" :class="{chengHrightClass:chengHright}">
                                           <div class="chengyuan" v-for="(fuzeren,index) in insertNew2" :key="index" v-if="fuzeren.value" @click="fuzerenXQ(index)">
                                              <avatar v-if="fuzeren.headImg" :size="'default'" shape="square" :src="getImageUrl(fuzeren.headImg,'./static/images/userDef_.jpg')" style="float: left;margin:5px;" ></avatar>
                                              <avatar v-else :size="'default'" shape="square" src="../../../assets/img/userDef_.jpg" style="float: left;margin:5px;"></avatar>
                                           </div>
                                    </div>
                                    <div class="listMemberCommonPartJiahao fuzerenJiahao" :class="{chengHclass:chengH}">
                                        <i class="icon iconfont icon-jiahao-kongxin-fangxing" @click="selectInputPerson2()"></i>
                                    </div>
                                </div>
                            </Scroll>
                            <!-- 成员选人组件 -->
                            <org-member-picker
                                :showPicker="showPersonPicker"
                                :initialSelected="insertNew"
                                :multiple="multipleForSelPerson"
                                :showTab="showTab"
                                @picked="onPicked"
                                @abort="onPickAbort"
                            >
                            </org-member-picker>
                            <org-member-picker
                                :title="'选择负责人'"
                                :showPicker="showPersonPicker2"
                                :initialSelected="insertNew2"
                                :designatedCardUrls="designatedCardUrls2"
                                :multiple="multipleForSelPerson2"
                                :showTab="showTab2"
                                @picked="onPicked2"
                                @abort="onPickAbort2">
                            </org-member-picker>
                    </div>
                    <div class="bottomWrap">
                        <div>
                            <x-button class="subject-picker-button" type="primary" @click.native="addOrEdit()">提交</x-button>
                        </div>
                    </div>
                </div>
            </div>
            <!--成员详情-->
            <org-member-detail
                :memberCardUrl="orgMemberCardUrl"
                :showDetail="showOrgMemberDetail"
                :companyId = "this.companyId"
                :replaceChat="true"
                @hideDetail="hideOrgMemberDetail"
            ></org-member-detail>
            <!--负责人详情-->
            <org-member-detail
                :memberCardUrl="orgMemberCardUrl2"
                :showDetail="showOrgMemberDetail2"
                :companyId = "this.companyId"
                :replaceChat="true"
                @hideDetail="hideOrgMemberDetail2"
            ></org-member-detail>
        </popup>
    </div>
</template>

<script>
    import {
        ConfirmPlugin,
        CheckIcon,
        XTextarea,
        XInput,
        Group,
        XButton,
        Selector,
        XHeader,
        Popup,
    } from "vux";
    import iconPicker from "../../../components/iconpicker/IconPicker";
    import ZingHead from "@/components/zingHead/ZingHead";
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import classSelection from "../../common/classSelection/classSelection";
    import choseType from "../collectiveManage/choseType";
    import choseMould from "../collectiveManage/choseMould";
    import TagGroup from "components/taggroup/TagGroup";
    import Scroll from "@/components/scroll/Scroll";
    import _ from "lodash";
    import avatar from "@/components/avatar/Avatar";
    import OrgMemberDetail from "@/components/orgmemberpicker/OrgMemberDetail"
    import { getImageUrl } from "../../../utils/fn"

    export default {
        components: {
            TagGroup,
            OrgMemberPicker,
            ZingHead,
            iconPicker,
            ConfirmPlugin,
            CheckIcon,
            XTextarea,
            Group,
            XInput,
            Selector,
            XHeader,
            XButton,
            classSelection,
            choseType,
            choseMould,
            Scroll,
            Popup,
            avatar,
            OrgMemberDetail,
            getImageUrl
        },
        props: {
            showListMember: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            taskboardId:String,
            taskRouting:String,
        },
        data() {
            return {
                taskName: "", //任务集名称
                //选人组建成员 参数
                insertNew: [],//成员初始显示
                subscribers: '', //初始選中人員
                subscribercheng: "", //人員初始值
                showPersonPicker: false, //是否显示选人组件
                multipleForSelPerson: true, //人员是否多选
                showTab: ['colleague'],//自定義顯示選人tab
                subscribersTransform: '',
                chengH:false, //成员动态高度

                //选人组建负责人 参数
                insertNew2: [],//负责人初始值
                stewards: '', //初始選中負責人
                showPersonPicker2: false,//是否显示选人组件
                multipleForSelPerson2: true,//人员是否多选
                showTab2: ['designatedPersonnel'],
                fuzeH:false,//负责人动态高度
                orgMemberCardUrl: '',//成员详情
                orgMemberCardUrl2: '',//负责人详情
                showOrgMemberDetail: false,
                showOrgMemberDetail2: false,
            }
        },

        computed: {
            cardUrl() {
                return this.$store.state.ui.userInfo.cardUrl;
            },
            realName() {
                return this.$store.state.ui.userInfo.RealName;
            },
            companyId() {
                return this.$store.state.ui.userInfo.companyId;
            },
            //负责人的范围，从成员中选
            designatedCardUrls2() {
                let arr = []
                if (this.subscribercheng) {
                    arr = this.subscribercheng.trim().split(' ')
                }
                return arr
            }
        },
        mounted() {
            this.getPersonnelFile()
        },
        methods: {
            getImageUrl,
            //名字
            getPersonnelFile() {
                let url = "/zingbiz/auth/user/getHrUserMapByCardUrlList";
                this.$http.get(url)
                    .then(res => {
                        let buildFileUrls = res.data.data //对象
                        let values = [];
                        Object.keys(buildFileUrls).forEach((key) => {
                            values.push(buildFileUrls[key]);
                        })
                        this.buildFileUrl = values
                        this._getloadBoardEsById();  //成员
                    })
             },
            //去重方法
            arrayUnique (arr){
                let newArr = []
                for (let i = 0; i < arr.length; i++) {
                    if (newArr.indexOf(arr[i]) === (-1)) {
                        newArr.push(arr[i])
                    }
                }
                return newArr
            },
            //成員初始值
            _getloadBoardEsById() {
                let that = this
                let url = "/ZingMH/ZDesk/board/mater/loadBoardEsById.action";
                let params = {
                    boardId: that.taskboardId,
                    routing: that.taskRouting,
                }
                that.$http.get(url, {params: params})
                    .then(res => {
                        this.subscribercheng = res.data.data.data[0].subscribers  //为啥这里没写负责人,因为没有这个字段
                        this.getinsertNew()
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            //人员初始页面赋值
            getinsertNew() {
                this.insertNew = []
                let subarr = this.subscribercheng.trim().split(' ')
                let subscriberchengarr = this.arrayUnique(subarr)
                for (let i = 0; i < subscriberchengarr.length; i++) {
                    //添加,headImg属性
                    this.buildFileUrl.forEach((item, index) => {
                        let buildFileUrl = item
                        if (subscriberchengarr[i] && subscriberchengarr[i] === buildFileUrl.cardUrl) {
                            this.insertNew.push({
                                value: subscriberchengarr[i],
                                type: "user",
                                headImg:buildFileUrl.headImg
                            })
                        }
                    })
                }
                if (subscriberchengarr.length > 3) {
                    //高度
                    this.chengH = true
                }
            },
            onPicked(list) {
                this.showPersonPicker = false;
                let newSubscribers = ''
                for (let i = 0; i < list.length; i++) {
                    newSubscribers += list[i].cardUrl + ' '
                }
                this.$http.get(
                    "/ZingMH/ZDesk/board/mater/updateMember.action",
                    {
                        params: {
                            boardId: this.taskboardId,
                            subscribers: newSubscribers,
                            oldSubscribers: this.subscribers,
                            routing: this.taskRouting,
                        }
                    }
                ).then(res => {
                    //更新newSubscribers
                    this.subscribercheng = newSubscribers
                    //初始显示
                    this.getinsertNew()
                    this.$nextTick(() => {
                        this.$refs.scroll.refresh()
                    })

                }).catch(err => {
                    console.log(err)
                })
            },
            //成员详情页面
            chengyuanXQ(index) {
                let cardUrl =  this.insertNew[index].value
                this.orgMemberCardUrl = cardUrl
                this.showOrgMemberDetail = true
            },
            //负责人初始页面赋值
            getinsertNew2() {
            },
            hideOrgMemberDetail(){
                this.showOrgMemberDetail = false
            },
            fuzerenXQ(index){
                let cardUrl =  this.insertNew2[index].value
                this.orgMemberCardUrl2 = cardUrl
                this.showOrgMemberDetail2 = true
            },
            hideOrgMemberDetail2(){
                this.showOrgMemberDetail2 = false
            },
            //添加和编辑任务集
            addOrEdit() {
                this.$emit("closeListMember")
            },
            //添加人员方法
            selectInputPerson(data) {
                this.showPersonPicker = true;
            },
            selectInputPerson2(){
                this.showPersonPicker2 = true
            },
            onPicked2(list) {
                this.showPersonPicker2 = false;
                this.insertNew2 =[]
                for (let i = 0; i < list.length; i++) {
                    //添加,headImg属性
                    this.buildFileUrl.forEach((item, index) => {
                        let buildFileUrl = item
                        if (list[i].cardUrl && list[i].cardUrl === buildFileUrl.cardUrl) {
                            this.insertNew2.push({
                                value: list[i],
                                type: "user",
                                headImg:buildFileUrl.headImg
                            })
                        }
                    })

                }
//          this.$http
//              .get("/ZingMH/ZDesk/board/mater/updateMember.action", {
//                  params: {
//                      boardId: this.boardId,
//                      subscribers: newSubscribers,
//                      oldSubscribers: this.subscribers,
//                      routing: this.routing
//                  }
//              })
//              .then(res => {
//                  //更新stewards
//                  this.stewards = newSubscribers;
//                  this.getinsertNew2()
//                  //高度
//                  this.fuzeH = true
//
//                  this.$nextTick(() => {
//                      this.$refs.scroll.refresh()
//                  })
//              })
//              .catch(err => {
//                  console.log(err);
//              })
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            onPickAbort2() {
                this.showPersonPicker2 = false;
            },
            backlist() {
                this.$emit("closeListMember")
            },
        },
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .insertOrUpdateInfo
       height 100%
       .listMemberContentWrap
           display flex
           flex-flow row wrap
           width 100%
           background-color white
           height calc(100% -50px) !important
           .listMemberContent
              width 100%
              height: calc(100% -50px);
              align-self flex-start
              overflow: auto;
              .listMemberCommonPart
                   display:-webkit-box;
                   display: -moz-box;
                   display: -ms-flexbox;
                   display: -webkit-flex;
                   display: flex;
                   padding 0 13px
                   border-bottom: 1px solid #eaeefb
                   font-size 16px
                   .listMemberCommonPartLeft,.listMemberCommonPartJiahao
                       display flex;
                       display:-webkit-box;
                       display: -moz-box;
                       display: -ms-flexbox;
                       display: -webkit-flex;
                       justify-content center
                       align-items center
                       margin-bottom 3px
                       margin-top 3px
                   .chenRight
                       margin-left 15px
                   .listMemberCommonPartRight
                       flex 4
                       justify-content flex-start
                   .listMemberCommonPartJiahao
                      .iconfont
                         font-size 30px
                         color #736e6e85
           .bottomWrap
              width 100%
              height 50px
              align-self flex-end
</style>
