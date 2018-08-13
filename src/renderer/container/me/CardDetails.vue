<template>
    <div class="chat-user-info-bg">
        <zing-head :title="!editAuto ? '我的名片' : '编辑名片'" :isComeBack="true"></zing-head>

        <div class="chat-user-info-scroll wrapper-better"  ref="wrapper">
            <div class="chat-user-info">
                <i v-if="!editAuto" class="icon iconfont icon-share custom-icon" style="bottom: 190px;"
                   @click="share(personalDetails.cardUrl)"></i>
                <i v-show="isEmptyCardUrl()" class="icon iconfont icon-guanlian custom-icon" style="bottom: 160px;"
                   @click="outContact(personalDetails.cardUrl)"></i>
                <i v-show="!isMineFriend && isEmptyCardUrl()" class="icon iconfont icon-jiaren custom-icon"
                   style=" bottom: 130px; " @click="addFriend(personalDetails.cardUrl)"></i>
                <i v-show="isMineFriend && isEmptyCardUrl()" class="icon iconfont icon-character-cancel custom-icon"
                   style=" bottom: 130px; " @click="delFriend(personalDetails.cardUrl)"></i>
                <i v-show="isEmptyCardUrl()" class="icon iconfont icon-tongxunlu custom-icon" style=" bottom: 100px; "
                   @click=" show = true "></i>
                <i v-show=" isEmptyCardUrl()" class="icon iconfont icon-pinglun custom-icon" style=" bottom: 70px; "
                   @click="chart(personalDetails.cardUrl)"></i>
                <i v-if=" !isEmptyCardUrl() && !editAuto" class="icon iconfont icon-plus-edit custom-icon"
                   style="bottom: 150px;" @click="editAuto = true"></i>
                <div class="chat-user-info-header" v-show="!editAuto">
                    <flexbox>
                        <!--<flexbox-item :span="4">-->
                            <div class="chat-user-info-header-right">
                                <img :src='headimgurl'
                                    style="max-width:100%;border-radius:5px;">
                                <div v-transfer-dom>
                                    <previewer  :list="list" ref="previewer" :options="options"
                                               @on-index-change="logIndexChange"></previewer>
                                </div>
                            </div>
                        <!--</flexbox-item>-->
                        <flexbox-item :span="6" justify="center">
                            <div class="chat-user-info-header-div">
                                  

                                <h3>{{personalDetails.RealName}}</h3>
                                 <popover placement="bottom" >
                                <div slot="content" class="popover-demo-content">
                                   部门: {{personalDetails.departmentAndName}} 职务: {{personalDetails.WorkTitle}}
                                </div>
                                <p class="btn btn-default">{{personalDetails.departmentAndName}} {{personalDetails.WorkTitle}}</p>
                                </popover>
                                
                                <popover placement="bottom" >
                                <div slot="content" class="popover-demo-content">
                                   公司: {{personalDetails.Company}}
                                </div>
                                <p class="btn btn-default">{{personalDetails.Company}}</p>
                                </popover>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div class="chat-user-info-header" v-show="editAuto">
                    <image-picker
                        :files="files"
                        :bId = "bId"
                        :bType = "bType"
                        :companyId="companyId"
                        :multiple="false"
                        :selectable="files.length < 1"
                        @onChange="imgOkCallback"
                        :imageNum="1"
                        style="padding-bottom: 30px;argin-top:25px;margin-left:-60px;margin-top:20px"
                    /> 
                </div>

                <group :title="title('必填项')" label-align="left">
                    <x-input class="fontSize" title="姓名" placeholder="请输入姓名" v-show="editAuto" v-model="personalDetails2.RealName">
                        <span slot="label">姓名<span class="span_title">*</span></span>
                    </x-input>
                </group>

                <group :title="title('选填项')" style="height:500px" label-align="left"  >
                    <div>
                        <div v-show="!editAuto" class="weui-cell">
                            <div class="weui-cell__hd"></div>
                            <div class="vux-cell-bd vux-cell-primary">
                                <p><label class="vux-label" style="text-align: right;">手机</label></p>
                                <span class="vux-label-desc"></span>
                            </div>
                            <div class="weui-cell__ft">
                                <a class="fontSize" style="color:#4DA9EB" :href=" 'tel://'+personalDetails.Cellphone ">{{personalDetails.Cellphone}}</a>
                            </div>
                        </div>
                        
                        <cell title="邮箱" v-show="!editAuto" :value="personalDetails.Email"></cell>
                        <!--<group>-->
                            <selector placeholder="地域" v-if="!editAuto" readonly ref="defaultValueRef" title="地域"
                                      direction="rtl" :options="focusArea" @on-change="focusAreaChange"
                                      v-model="personalDetails.focusArea"></selector>
                            <selector class="fontSize" placeholder="地域" v-else ref="defaultValueRef" title="地域" direction="rtl"
                                      :options="focusArea" @on-change="focusAreaChange"
                                      v-model="personalDetails2.focusArea"></selector>
                        <!--</group>-->
                        <!--<group>-->
                            <selector placeholder="行业" v-if="!editAuto" readonly ref="defaultValueRef2" title="行业"
                                      direction="rtl" :options="IndustryID" @on-change="IndustryIDChange"
                                      v-model="personalDetails.IndustryID"></selector>
                            <selector class="fontSize" placeholder="行业" v-else ref="defaultValueRef2" title="行业" direction="rtl"
                                      :options="IndustryID" @on-change="IndustryIDChange"
                                      v-model="personalDetails2.IndustryID"></selector>
                        <!--</group>-->
                        <cell title="单位" v-show="!editAuto" :value="personalDetails.Company"></cell>
                        <x-input class="fontSize" placeholder="请输入所属单位" title="单位" v-show="editAuto" v-model="personalDetails2.Company"></x-input>
                        <cell title="部门" v-show="!editAuto" :value="personalDetails.departmentAndName"></cell>
                        <x-input class="fontSize" placeholder="请输入所属部门" title="部门" v-show="editAuto"
                                 v-model="personalDetails2.departmentAndName"></x-input>
                        <cell title="职务" v-show="!editAuto" :value="personalDetails.WorkTitle"></cell>
                        <x-input class="fontSize" placeholder="请输入所属职务" title="职务" v-show="editAuto" v-model="personalDetails2.WorkTitle"></x-input>
                        <cell primary="content" title="地址" v-show="!editAuto" :value="personalDetails.Address"></cell>
                        <x-input class="fontSize" placeholder="请输入所属地址" title="地址" v-show="editAuto" v-model="personalDetails2.Address"></x-input>
                        <cell title="座机" v-show="!editAuto" :value="personalDetails.teleNumber"></cell>
                        <x-input class="fontSize" placeholder="请输入所属座机" title="座机" v-show="editAuto"
                                 v-model="personalDetails2.teleNumber"></x-input>
                        <cell primary="content" v-show="!editAuto" title="个人介绍"
                              :value="personalDetails.personIntroduce"></cell>
                        <x-textarea class="fontSize" title="个人介绍" v-show="editAuto" placeholder="请填写详细信息"
                                    v-model="personalDetails2.personIntroduce"
                                    :show-counter="false" :rows="3"></x-textarea>
                        <!-- isYanZheng -->
                        <check-icon v-show="editAuto" :value.sync="isYanZheng"> 加我为朋友时需要验证  </check-icon>
                        <br>
                        <flexbox v-show="editAuto" style="margin-top:4px">
                            <flexbox-item style="margin-left: 0px">
                                <x-button @click.native="cancle" style="background-color: #40affc;color:#fff">取消
                                </x-button>
                            </flexbox-item>
                            <flexbox-item style="margin-left: 0px">
                                <x-button @click.native="edit(personalDetails.cardUrl)"
                                          style="background-color: #ff8000;color:#fff;"> 保存修改
                                </x-button>
                            </flexbox-item>
                        </flexbox>
                        <br>

                    </div>
                </group>

                
                <div class="chat-user-info-footer">

                    <div class="chat-user-info-footer-bottom" v-show="!editAuto">
                        <h4 class="chat-user-info-footer-title">所在商号</h4>
                        <ul class="chat-user-info-footer-business">
                            <li v-for="(item,index) in companyData" :key="index" >
                                <!-- <div> --><div style="position: absolute;height:60px;width:85%" ></div>
                                    <img 
                                     src="../../../../static/images/weicard.jpg"
                                    :data-src="companyData[index].headimgurl"
                                     data-error="../../../../static/images/weicard.jpg" v-lazy-image
                                >
                                <div>
                                    <div  @click="foundOrMain(item.id)" style="float:left;width:150px;position: relative;left: 10px">{{companyData[index].companyName}}</div>
                                    <!-- <div style=" position: relative;left: 100px;width:160px">{{item.companyName}}</div> -->
                                </div>
                                <!-- </div> -->
                                <!-- <span style="width:60px;height:50px">
                                <img 
                                @click="foundOrMain(item.id)"
                                class="business-icon"
                                    src="../../../../static/images/userDef_.jpg"
                                    :data-src="companyData[index].headimgurl"
                                    data-error="./static/images/userDef_.jpg"
                                    v-lazy-image></span> -->
                            </li>
                            <div style="height:20px"></div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <org-member-detail
            :memberCardUrl="orgMemberCardUrl"
            :showDetail="showOrgMemberDetail"
            :ownCardUrl="cardUrl"
            :replaceChat="true"
            @hideDetail="showOrgMemberDetail = false"
        ></org-member-detail>
        <div v-transfer-dom>
            <x-dialog v-model="show" class="dialog-demo">
                <div class="img-box">

                    <img :src='"/checkJpg/"+getQueryKey("cardUrl").substring(0,2)+"/"+getQueryKey("cardUrl")+"QR.jpg?v=1.13180419_1816&amp;zIsCacheImg=true"' style="max-width:100%">
                </div>
                <div @click="show=false">
                    <h5 style="margin-top:0px;">
                        长按识别二维码添加到通讯录
                    </h5>
                    <br>
                    点我返回
                </div>
            </x-dialog>
        </div>


    </div>
</template>
<script>
    import {
        Flexbox,
        FlexboxItem,
        Cell,
        Group,
        XButton,
        Previewer,
        XDialog,
        CheckIcon,
        XInput,
        Selector,
        XTextarea,
        Popover,
        AlertModule,
        TransferDomDirective as TransferDom
    } from "vux";
    import Avatar from "components/avatar/Avatar";
    import { isWeiXin, isMhApp,Z_IsEmpty20, Z_DU, getImageUrl, addTypeCache } from "../../utils/fn";
    import Qs from "qs";
    import _ from "lodash";
    import { shareMessage, doOneChat } from "../../utils/fn";
    import LazyImage from "../../directives/lazyimage/lazy-image";
    import ZingHead from "@/components/zingHead/ZingHead";
    import BScroll from "better-scroll";
    import ImagePicker from "@/components/imagepicker/ImagePicker";
    import OrgMemberDetail from "components/orgmemberpicker/OrgMemberDetail"
    export default {
        name: "CardDetails",
        directives: {
            LazyImage
        },
        components: {
            Flexbox,
            FlexboxItem,
            Previewer,
            Cell,
            XButton,
            XInput,
            Selector,
            ZingHead,
            XTextarea,
            Group,
            Avatar,
            CheckIcon,
            ImagePicker,
            XDialog,
            Popover,
            OrgMemberDetail,
            BScroll
        },
        data() {
            return {
                showOrgMemberDetail:false,
                orgMemberCardUrl:'',
                bId:"headid",
                bType:"head",
                companyId: this.$store.state.ui.userInfo.companyId,
                cardUrl: "",
                UserInfoData: [],
                isYanZheng: false,
                editAuto: false,
                currentFocusArea: {},
                list: [
                    {
                        msrc:
                        "/ImgRender?imgpath=/checkJpg/" +
                        this.getQueryKey("cardUrl").substring(0, 2) +
                        "/" +
                        this.getQueryKey("cardUrl") +
                        ".jpg&thumb=80x80&errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&compress=true&time=1.13180419_1816&type=.jpg",
                        mrc:
                        "/ImgRender?imgpath=/checkJpg/" +
                        this.getQueryKey("cardUrl").substring(0, 2) +
                        "/" +
                        this.getQueryKey("cardUrl") +
                        ".jpg&thumb=80x80&errpath=/JsLib/dist/app/images/defaultImgs/userDef_.jpg&compress=true&time=1.13180419_1816&type=.jpg",
                        w: 800 
                    }
                ],
                options: {
                    getThumbBoundsFn(index) {
                        // find thumbnail element
                        let thumbnail = document.querySelectorAll(".previewer-demo-img")[
                            index
                            ];
                        // get window scroll Y
                        let pageYScroll =
                            window.pageYOffset || document.documentElement.scrollTop;
                        // optionally get horizontal scroll
                        // get position of element relative to viewport
                        let rect = thumbnail.getBoundingClientRect();
                        // w = width
                        return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                        // Good guide on how to get element coordinates:
                        // http://javascript.info/tutorial/coordinates
                    }
                },
                focusArea: [
                    { key: "888", value: "地域" },
                    { key: "1", value: "北京" },
                    { key: "5", value: "天津" },
                    { key: "13", value: "上海" },
                    { key: "4", value: "重庆" },
                    { key: "6", value: "黑龙江" },
                    { key: "7", value: "辽宁" },
                    { key: "8", value: "吉林" },
                    { key: "9", value: "河北" },
                    { key: "10", value: "山西" },
                    { key: "11", value: "山东" },
                    { key: "12", value: "江苏" },
                    { key: "14", value: "河南" },
                    { key: "15", value: "湖北" },
                    { key: "16", value: "浙江" },
                    { key: "17", value: "福建" },
                    { key: "18", value: "广东" },
                    { key: "19", value: "江西" },
                    { key: "20", value: "湖南" },
                    { key: "21", value: "贵州" },
                    { key: "22", value: "广西" },
                    { key: "23", value: "云南" },
                    { key: "24", value: "四川" },
                    { key: "25", value: "陕西" },
                    { key: "26", value: "甘肃" },
                    { key: "27", value: "宁夏" },
                    { key: "28", value: "新疆" },
                    { key: "29", value: "西藏" },
                    { key: "31", value: "内蒙古" },
                    { key: "37", value: "青海" },
                    { key: "33", value: "海南" },
                    { key: "34", value: "台湾" },
                    { key: "35", value: "香港" },
                    { key: "36", value: "澳门" },
                    { key: "32", value: "安徽" },
                    { key: "30", value: "海外" }
                ] ,
                IndustryID: [
                    { key: "888", value: "行业" },
                    { key: "1", value: "IT·互联网·游戏" },
                    { key: "5", value: "通信（设备·运营·增值服务）" },
                    { key: "13", value: "金融业（投资·保险·证券·基金）" },
                    { key: "4", value: "电子·微电子" },
                    { key: "6", value: "广告·会展·公关" },
                    { key: "7", value: "房地产开发·建筑与工程" },
                    { key: "8", value: "物业管理·商业中心" },
                    { key: "9", value: "家居·室内设计·装潢" },
                    { key: "10", value: "中介服务" },
                    { key: "11", value: "专业服务（咨询·财会·法律等）" },
                    { key: "12", value: "检验·检测·认证" },
                    { key: "14", value: "贸易·进出口" },
                    { key: "15", value: "媒体·出版·文化传播" },
                    { key: "16", value: "印刷·包装·造纸" },
                    { key: "17", value: "快速消费品（食品·饮料·日化·烟酒等）" },
                    { key: "18", value: "耐用消费品（服饰·纺织·皮革·家具）" },
                    { key: "19", value: "玩具·工艺品·收藏品·奢侈品" },
                    { key: "20", value: "家电业" },
                    { key: "21", value: "办公设备·用品" },
                    { key: "22", value: "旅游·酒店·餐饮服务" },
                    { key: "23", value: "批发·零售" },
                    { key: "24", value: "交通·运输·物流" },
                    { key: "25", value: "娱乐·运动·休闲" },
                    { key: "26", value: "制药·生物工程" },
                    { key: "27", value: "医疗·保健·美容·卫生服务" },
                    { key: "28", value: "医疗设备·器械" },
                    { key: "29", value: "环保行业" },
                    { key: "30", value: "石油·化工·矿产·采掘·冶炼·原材料" },
                    { key: "31", value: "能源（电力·石油）·水利" },
                    { key: "32", value: "仪器·仪表·工业自动化·电气" },
                    { key: "33", value: "汽车·摩托车（制造·维护·配件·销售·服务）" },
                    { key: "34", value: "机械制造·机电·重工" },
                    {
                        key: "35",
                        value: "原材料及加工（金属·木材·橡胶·塑料·玻璃·陶瓷·建材"
                    },
                    { key: "36", value: "农·林·牧·渔" },
                    { key: "37", value: "航空·航天研究与制造" },
                    { key: "38", value: "船舶制造" },
                    { key: "39", value: "教育·培训·科研·院校" },
                    { key: "40", value: "政府·非营利机构" },
                    { key: "0", value: "其他行业" }
                ],

                show: false, // 二维码dialog开关
                personalDetails: {}, //个人信息
                personalDetails2: {}, //个人信息
                companyData: [], //商号
                hrdata: [], //自己在商号的设置
                isMineFriend: false,
                headimgurl:"./static/images/userDef_.jpg",
                files: [{url:'./static/images/userDef_.jpg'}]
            };
        },
        computed: {
            cardUrl() {
                return this.$store.state.ui.userInfo.cardUrl;
            }
        },
        created() {
            this.getCardUrl();
            this.initData();
            this.initRole();
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: true,
                scrollX: this.scrollX
            });
            this.taskSelectionShow = false;
        },
        methods: {
            showCardDetail(item,event){
                let info = this.getUserName(item)
                let cardUrl = info.cardUrl
                this.orgMemberCardUrl = cardUrl
                this.showOrgMemberDetail = true
                event.cancelBubble = true
            },
            getCardUrl() {
                let urlCard = "/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action";
                this.$http
                    .post(urlCard)
                    .then(res => {
                        if (res.data.success) {
                            this.cardUrl = res.data.data.cardUrl;
                            // this.cardUrlSub2 = res.data.data.cardUrl.substring(0, 2);
                        } else {
                            console.error("getCardUrl failed", res);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            title(val) {
                if (this.editAuto) {
                    return val;
                } else {
                    return null;
                }
            },
            showCard() {
                console.log(this.$route.query);
                let urlUserDetails = `/ZingMH/ZDesk/MENHUWX/MHUser/showCard.action`;
                let paramsUserDetails = {cardUrl: this.$route.query.cardUrl};
                return this.$http.post(urlUserDetails, Qs.stringify(paramsUserDetails));
            },
            getQueryKey(key) {
                return _.isEmpty(this.$route.query[key]) ? "" : this.$route.query[key];
            },
            isEmptyCardUrl() {
                if (!_.isEmpty(this.$route.query.cardUrl)) {
                    if (this.cardUrl === this.$route.query.cardUrl) {
                        return false;
                    }
                    return true;
                }
                return false;
            },
            showImg() {
                this.$refs.previewer.show(0);
            },
            logIndexChange(arg) {
                console.log(arg);
            },
            initRole(isSetTimeOut) {
                let self = this;
                if (isSetTimeOut) {
                    setTimeout(function () {
                        loadRole();
                    }, 3500);
                } else {
                    loadRole();
                }

                function loadRole() {
                    let url = "/ZingMH/ZDesk/MENHUWX/MHUser/showCard.action";
                    self.$http
                        .get(url, { params: { cardUrl: self.$route.query.cardUrl }})
                        .then(res => {
                            if (res.data.isFav && res.data.isRelation) {
                                self.isMineFriend = true;
                            } else {
                                self.isMineFriend = false;
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
            },
            addFriend(cardUrl) {
                let self = this;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "确认要添加好友吗？",
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/serviceFriend/insertFriendsEs.action";
                        self.$http
                            .get(url, {
                                params: { cardUrlPeer: self.$route.query.cardUrl, isKeFu: false }
                            })
                            .then(() => {
                                self.$vux.toast.text("添加成功");
                                self.initRole(true);
                            })
                            .catch((err) => {
                                self.$vux.toast.text("添加失败");
                                console.log(err)
                            });
                    }
                });
            },
            focusAreaChange(val) {
                this.currentFocusArea = val;
                this.personalDetails2.focusArea = val;
                console.log(this.currentFocusArea);
            },
            IndustryIDChange(val) {
                this.personalDetails2.IndustryID = val;
            },
            foundOrMain(companyId) {
                window.location.href =
                    "/SRender?jsLoader=showTips%2FshowTipsLoader&tpl=showTips%2Fwarn&isGoBack=isGoBack&show=show&companyId=" +
                    companyId;
            },
            getUserName(item) {
                let user =  _.find(this.UserInfoData, user => {
                    return user.companyId === item.id;
                });
                if(_.isEmpty(user)){
                    return {headImg:'',uuserNmae:''}
                } 
                return user
                 
            },
            delFriend(cardUrl) {
                let self = this;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "确认要删除吗？",
                    onConfirm() {
                        let url = "/ZingMH/ZDesk/serviceFriend/delFriendES.action";
                        self.$http
                            .get(url, { params: { cardUrlPeer: self.$route.query.cardUrl }})
                            .then(() => {
                                self.$vux.toast.text("删除成功");
                                self.initRole(true);
                            })
                            .catch(err => {
                                self.$vux.toast.text("失败");
                                console.log(err)
                            });
                    }
                });
            },
            cancle() {
                this.editAuto = false;
            },
            edit(cardUrl) {
                if (this.personalDetails2.RealName === "" || this.personalDetails2.RealName === undefined) {
                    this.$vux.toast.text("姓名不能为空!", 'bottom');
                    return false
                }
                this.editAuto = true;
                if (this.isYanZheng) {
                    this.personalDetails2.isYanZheng = "1";
                }
                // /ZingMH/ZDesk/MENHUWX/MHUser/updateInformation.action
                this.$http
                    .get("/ZingMH/ZDesk/MENHUWX/MHUser/updateInformation.action", {
                        params: this.personalDetails2
                    })
                    .then(res => {
                        let self = this;
                        if (res.data.success) {
                            this.editAuto = false;
//                            setTimeout(function () {
                                self.initData();
//                            }, 2500);
                        } else {
                            console.error("getCardUrl failed", res);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            imgOkCallback(files, operationType, index) {
                if(isWeiXin() || isMhApp()){
                    if(files[0].url == undefined){
                        files[0].url = "/checkJpg/" + this.cardUrl.substring(0, 2) + "/" + this.cardUrl + ".jpg?v="+new Date().getTime()
                    }
                }
                this.files = files
                this.personalDetails2.headimgurl = files[0].url
            },
            outContact(cardUrl) {
                this.$router.push({
                    name: "outContactMain/bindContactUser",
                    query: {
                        cardUrl: cardUrl
                    }
                });
            },

            chart(cardUrl) {
                console.log("去聊天" + cardUrl);
                doOneChat("2YV3emJ3MfiaARbu6jJVji2m", true, this.$router);
            },
            getAllBingdingCompany() {
                //点击用户的所有商号信息
                let urlAllBingdingCompany = `/ZingMH/ZDesk/MENHUWX/Company/getAllBingdingCompany.action`;
                let paramsAllBingdingCompany = {
                    cardUrl: this.$route.query.cardUrl,
                    selHrInfo: true
                };
                return this.$http.post(
                    urlAllBingdingCompany,
                    Qs.stringify(paramsAllBingdingCompany)
                );
            },
            share(cardUrl) {
                // this.showEditor = false;
                let link = `/ZingVue/index.html#/cardDetails?cardUrl=${cardUrl}`;
                let title = "分享";
                let content = "分享我的名片";
                let logoUrl = "/ZingVue/static/images/explorer/txt.png";
                shareMessage(this, link, title, content, logoUrl);
            },
            initData() {
                this.$http.all([this.showCard(), this.getAllBingdingCompany()]).then(
                    this.$http.spread((showCard, allBingdingCompany) => {
                        console.log(showCard);
                        console.log(showCard, "当前用户信息");
                        this.personalDetails = showCard.data.Items[0];
                        let personalCopy = JSON.parse(
                            JSON.stringify(this.personalDetails)
                        );
                        if(_.isEmpty(personalCopy.focusArea) || personalCopy.focusArea === ""){
                            personalCopy.focusArea = "888"
                        }
                        if(_.isEmpty(personalCopy.IndustryID) || personalCopy.IndustryID === ""){
                            personalCopy.IndustryID = "888"
                        }
                        this.personalDetails2 = personalCopy
                        if (
                            !_.isUndefined(this.personalDetails.isYanZheng) &&
                            this.personalDetails.isYanZheng === "1"
                        ) {
                            this.isYanZheng = true;
                        } else {
                            this.isYanZheng = false;
                        }
                        if (this.personalDetails.headimgurl.length > 0) {
                            /*this.personalDetails.headimgurl = Z_DU(
                                this.personalDetails.headimgurl
                            );*/
                            this.headimgurl = this.personalDetails.headimgurl
                            this.files[0].url = this.personalDetails.headimgurl
                        } else {
                            let cardUrl = this.personalDetails.cardUrl;
                            this.headimgurl = "/checkJpg/" + cardUrl.substring(0, 2) + "/" + cardUrl + ".jpg"
                            this.files[0].url = "/checkJpg/" + cardUrl.substring(0, 2) + "/" + cardUrl + ".jpg"
                            /*let newCardUrl = this.personalDetails.cardUrl;
                            let userHead =
                                !Z_IsEmpty20(newCardUrl) &&
                                newCardUrl.length > 2 &&
                                "/checkJpg/" +
                                newCardUrl.substring(0, 2) +
                                "/" +
                                newCardUrl +
                                ".jpg";
                            userHead = addTypeCache("zIsCacheDirect", userHead);
                            userHead = getImageUrl(userHead, "./static/images/userDef_.jpg");
                            this.personalDetails.headimgurl = userHead;*/
                        }
                        console.log(this.personalDetails.headimgurl);
                        let companyData = allBingdingCompany.data.data.companyData;
                        console.log(allBingdingCompany, "所有数据");
                        this.companyData = companyData;
                        this.UserInfoData = allBingdingCompany.data.data.hrdata;
                        this.companyData = companyData.map(item => {
                            item.headimgurl =  item.headimgurl + `.jpg`;
                            return item;
                        });
                        //                this.hrdata=hrdata;
                    })
                );
            },
            getImageUrl
        },
    };
</script>
 
<style lang="stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .custom-icon {
        font-size: 25px;
        z-index: 1000;
        position: fixed;
        right: 10px;
        color: #ff8000;
    }

    .chat-user-info-bg {
        background: #e1e1e1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;

        .chat-user-info-scroll {
            width: calc(100% + 20px);
            height: calc(100% - 30px);
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;

            .chat-user-info {
                background-color: #f7f5f5;
                width: calc(100% - 20px);
                 
                box-sizing: border-box;

                .chat-user-info-header {
                    padding-left: 10px;
                    border-bottom: 1px solid #f5f5f5;
                    background-color: #fff;
                    padding-bottom: 15px;
                    padding-top: 15px;
                    flex-center(row, center, center)

                    .chat-user-info-header-right {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img {
                            width: 60px;
                            height: 60px;

                            .chat-user-info-header-div {
                                /*margin-left: 25px;*/

                                h6 {
                                    color: #0086b3;
                                    font-size: 18px;
                                    font-weight: bold;
                                }

                                p {
                                    font-weight: bold;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;

                                    &:nth-child(2) {
                                        margin: 14% 0 5%;
                                    }
                                }
                            }
                        }
                    }
                }

                .chat-user-info-content {
                    margin-top: 6%;
                    box-sizing: border-box;

                    .chat-user-info-item {
                        padding: 0 5%;
                        border-bottom: 1px dashed #7998dd;
                        font-size: 13px;
                        line-height: 40px;

                        .chat-user-info-item-title {
                            color: #0086b3;
                            margin-right: 5%;
                        }

                        .chat-user-info-item-text {
                            font-size: 14px;
                            color: #515151;
                        }
                    }
                }

                .chat-user-info-footer {
                    .chat-user-info-footer-title {
                        padding-top: 25px;
                        padding-left: 10px;
                        font-size: 18px;
                        font-weight: normal;
                        color: 101010;
                        margin: 2% 0;
                    }

                    .chat-user-info-footer-text {
                        width: 100%;
                        min-height: 120px;
                        background: #9fdbef;
                    }

                    .chat-user-info-footer-business {
                        li {
                            background-color: #fff;
                            border-top: 1px solid #F5F5F5;
                            padding: 5px;
                            display: flex;
                            align-items: center;
                            width: 100%;
                            position: relative;
                            left: 0;
                            top: 0;

                            &:last-child {
                                border-bottom: 1px solid #F5F5F5;
                            }

                            img {
                                display: inline-block;
                                width: 50px;
                                height: 50px;

                                &.business-icon {
                                    position: absolute;
                                    right: 0;
                                }
                            }

                            span {
                                margin-left: 10px;
                                font-size: 15px;
                                color: #0086b3;
                            }
                        }
                    }

                    .chat-user-info-footer-span {
                        font-size: 15px;
                        display: inline-block;
                    }
                }
            }
        }
    }
    .weui-label {
        display: block;
        width: 105px;
        word-wrap: break-word;
        word-break: break-all;
        /*margin-left: 13px;*/
        /*text-align: left !important;*/
    }

    .dialog-demo {
        .weui-dialog {
            border-radius: 8px;
            padding-bottom: 8px;
        }
        .dialog-title {
            line-height: 30px;
            color: #666;
        }
        .img-box {
            height: 350px;
            overflow: hidden;
        }
        .vux-close {
            margin-top: 8px;
            margin-bottom: 8px;
        }
        .custom-icon {
            font-size: 25px;
            z-index: 1000;
            position: absolute;
            right: 10px;
        }
    }

    .weui-cell {
        padding-left: 13px!important;
        .weui-cell__ft {
            color: #4da9eb;
        }
    }

    .weui-cell:before{
        left: 13px;
        right: 13px;
    }

    .weui-cells:before{
        border-top:none!important;
    }

    .weui-cells:after {
        left: 13px;
        right: 13px;
        border-bottom:none!important;
    }

    .span_title {
        color: #D81E06;
    }

    .fontSize {
        font-size: 14px;
    } 
    .weui-cells {
      .weui-cell {
        font-size:16px;
      }
    }

    .chat-user-info-bg {
        .chat-user-info {
            .weui-cell {
                .weui-cell__ft {
                    font-size 14px
                }
            }
            .chat-user-info-header {
                .ei-image-picker .flex-item {
                    width 50px
                    height 50px
                    margin-left 0
                }
                .ei-image-picker .ei-image-picker-upload-btn {
                        position  absolute
                        top 50%
                        -webkit-transform translateY(-50%)
                        transform translateY(-50%)
                        margin-left -30px
                        margin-top 10px
                }
                >>> .ei-image-picker .ei-image-picker-item-content {
                        border-radius 3px
                        round-size cover
                        height 50px
                        width 50px
                }
            }
        }
        .weui-cells:before {
            left: 15px
        }
    }
    .popover-demo-content {
        padding: 10px 10px;
        background-color: #f4f4f4;
        color : black
    }
</style>

 