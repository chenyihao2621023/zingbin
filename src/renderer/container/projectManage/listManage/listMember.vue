<!--编辑属性（成员）-->
<template>
    <div v-transfer-dom>
        <popup v-model="showListMember" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div id="insertOrUpdateInfo" class="insertOrUpdateInfo">
                <zing-head :isShowQuery="false" :title="'编辑属性'" :isComeBack="false" @doSome="backlist">
                    <div slot="left"></div>
                </zing-head>
                <div class="contentWrap">
                    <div class="content">
                        <div class="addvariable">
                            <Scroll ref="scroll" :scrollbar="true">
                                <group>
                                    <cell title="添加成员" style="margin-top: 3px" :class="{'changeH':chengH}" placeholder="">
                                        <span slot="title">添加成员<span style="color: red">*</span></span>
                                        <div class="chengLfetGroup" v-for=" cheng in insertNew" :key="cheng">
                                            <avatar :size="'default'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+cheng.value.substring(0,2)+"/"+cheng.value+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                                        </div>
                                        <div class="chengRightGroup">
                                            <i class="icon iconfont" @click="selectInputPerson()" style="font-size: 30px">&#xe64e;</i>
                                        </div>
                                    </cell>
                                    <cell title="添加负责人" :class="{'fuzeH':fuzeH}" placeholder="">
                                        <span slot="title"> {{insertNew.length}}<span style="color: red">*</span></span>
                                        <div class="fuzeLfetGroup" v-for="fuzeren in insertNew2" :key="fuzeren">
                                            <avatar :size="'default'" shape="square" :src='"/ImgRender?imgpath=/checkJpg/"+fuzeren.value.substring(0,2)+"/"+fuzeren.value+".jpg&amp;thumb=80x80&amp;errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&amp;compress=true&amp;time=1.13180419_1816&amp;type=.jpg"' style=" float: left;margin-top: 7px;margin-left: 7px;"></avatar>
                                        </div>
                                        <div class="fuzeRightGroup">
                                            <i class="icon iconfont" @click="selectInputPerson2()" style="font-size: 30px">&#xe64e;</i>
                                        </div>
                                    </cell>
                                </group>
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
                                :showPicker="showPersonPicker2"
                                :initialSelected="insertNew2"
                                :designatedCardUrls="designatedCardUrls2"
                                :multiple="multipleForSelPerson2"
                                :showTab="showTab2"
                                @picked="onPicked2"
                                @abort="onPickAbort2">
                            </org-member-picker>
                        </div>
                    </div>
                    <div class="bottomWrap">
                        <div>
                            <x-button class="subject-picker-button" type="primary" @click.native="addOrEdit()">提交</x-button>
                        </div>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import {
        Cell,
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

    export default {
        components: {
            TagGroup,
            Cell,
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
            avatar
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
                addSet:'',//定时器
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
            this._getloadBoardEsById();  //成员
        },
        methods: {
            //成員初始值
            _getloadBoardEsById() {
                let that = this
                let url = "/ZingMH/ZDesk/board/mater/loadBoardEsById.action";
                let params = {
                    boardId: that.taskboardId,
                    routing: that.taskRouting,
                }
                that.$http.get(url,{ params:params })
                    .then(res => {
                        this.subscribercheng = res.data.data.data[0].subscribers
                        console.log('list中',this.subscribercheng)
                        this.getinsertNew()
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            //人员初始页面赋值
            getinsertNew() {
                this.insertNew = []
                let subscriberchengarr = this.subscribercheng.split(' ')
                for (let i=0;i<subscriberchengarr.length;i++){
                  if (' ' !== subscriberchengarr[i]){
                      this.insertNew.push({
                          value: subscriberchengarr[i],
                          type: "user"
                      })
                      console.log('insertNew中',this.insertNew)
                  }
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
            //添加和编辑任务集 ?????没处理
            addOrEdit() {
                this.showListMember = false
            },
            //添加人员方法  ?????没处理
            selectInputPerson(data) {
                this.showPersonPicker = true;
            },
            selectInputPerson2(){
                this.showPersonPicker2 = true
            },
            onPicked2(list) {
                this.showPersonPicker2 = false;
                this.getinsertNew2()
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            onPickAbort2() {
                this.showPersonPicker2 = false;
            },
            backlist() {
                this.showListMember = false
//                this.$emit("abort")

            },
        },
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .insertOrUpdateInfo
       height 100%
       .contentWrap
           display flex
           flex-flow row wrap
           width 100%
           background-color white
           height calc(100% -50px) !important
           .content
              width 100%
              height: calc(100% -50px);
              align-self flex-start
              overflow: auto;
             .addvariable
                 height 100%
                 .weui-cell
                    height 34px
                    margin 10px 5px
                    .vux-cell-primary
                        height 29px
                        line-height 29px
                        margin-top 10px
                        flex 2
                    .weui-cell__ft
                        flex 5
                        margin-left -30px
                 .changeH
                     height 100%
                     display flex
                     overflow hidden
                     .vux-cell-primary
                        flex 2
                     .weui-cell__ft
                        flex 5
                        margin -10px 0 -10px -30px
                 .fuzeH
                    .vux-cell-primary
                       flex 2
                    .weui-cell__ft
                       flex 3
           .bottomWrap
              width 100%
              height 50px
              align-self flex-end
</style>
