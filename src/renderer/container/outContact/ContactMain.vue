<template>
    <div class="outwrapper">
        <ZingHead
            :popupPickerData="list1"
            :popupTitle="popupTitle"
            :isComeBack="true"
            columns="1"
            @popup-change="handleMenuType"
        >
            <!--<div slot="header-left">-->
                <!--<dropdown :data="list1" trigger="click" placement="bottomLeft" @item-click="handleMenuType">-->
                    <!--<div>-->
                        <!--<span>{{whole}}</span>-->
                        <!--<i class="iconfont icon-xiajiantou"></i>-->
                    <!--</div>-->
                <!--</dropdown>-->
            <!--</div>-->
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search()"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="list2" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </ZingHead>
        <div v-show="searchFlag" class="searchContainer">
            <div class="Top-bar">
                <span class="cancel-icon">
                    <span class="cancelInput" @click="cancelInput">取消</span>
                </span>
                <span class="inputSpan" id="inputSpan">
                    <form action="" class="">
                        <input class="inputForm" :placeholder="holder" v-model="inputText">
                    </form>
                </span>
                <span class="confirm-icon">
                    <span class="confirmInput" @click="confirmInput">确定</span>
                </span>
            </div>
        </div>
        <div class="nobody" v-show="nobody">没有需要负责的外联人</div>
        <div class="scroll-list-wrap">
            <scroll
                ref="scrollbar"
                :data="bodyList"
                :pullUpLoad="pullUpLoad"
                @pullingUp="onPullingUp"
            >
                <GridCard class="list" v-for="(item,index) in bodyList" :key="index"
                          @touchstart.native="start(item)"
                          @touchend.native="end(item)"
                          @click.native="contactDetail(item)"
                >
                    <div class="list-left" slot="cardLeft">
                        <div class="list-left-name">{{item.contactsName}}</div>
                        <div class="list-left-companyName" :class="{isMargincompany:item.isMargincompany}">{{item.newcompanyName}}</div>
                        <div :class="{isMargin:item.isMargin}">
                            <span class="list-left-type" v-show="item.flag">{{item.contactsType}}</span>
                            <span class="list-left-level" v-show="item.flag1">{{item.contactsLevel}}</span>
                            <span class="list-left-state" v-show="item.flag2">{{item.contactsState}}</span>
                        </div>
                    </div>
                    <div class="list-right" slot="cardRight">
                        <div class="list-right-name">
                            {{item.text}}
                        </div>
                    </div>
                </GridCard>
            </scroll>
        </div>
        <popup position="top" v-model="popup" :popup-style="{top: 40 + '%',width:80 + '%',margin: 10 + '%'}">
            <div class="setType" @click="set">设置分类</div>
        </popup>
        <popup position="top" v-model="popup1" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%'}">
            <div class="setType">
                <div class="choiceType">选择分类</div>
                <ul>
                    <li v-for="(item, index) in typeList" :key="index">
                        <span class="name">{{item.content}}</span>
                        <span class="choice" @click="choiceType(item)">{{item.cancelText}}</span>
                    </li>
                </ul>
                <div class="close" @click="closeType()">关闭</div>
            </div>
        </popup>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import { Popup ,Group,XInput,GroupTitle,XButton } from 'vux'
    import { Z_IsEmpty20 } from '../../utils/fn'
    import { mapActions } from 'vuex'
    export default {
        name: "contact-main",
        components: {
            ZingHead,
            Dropdown,
            GridCard,
            scroll,
            Avatar,
            Popup,
            Group,
            XInput,
            GroupTitle,
            XButton
        },
        data () {
            return {
                popupTitle:"客户",
                pullUpLoad:false,
                companyId:"",
                cardId:"",
                listId:"",
                boardId:"",
                reslibrary:"",
                whole:"全部",
                //头部分类标签
                list1:[
                    "客户"
                ],
                list2:[],
                bodyList:[],
                flag:true,
                time:"",
                searchFlag:false,
                inputText:"",
                holder:"搜索",
                popup:false,
                popup1:false,
                nobody:false,
                type:"",
                typeList:[],
                item:"",
                isExternalContactsAdmin:false,
            }
        },
        computed:{

        },
        watch: {

        },
        created() {
            //进行参数判断
            this.companyId = this.$route.query.companyId
            this.reslibrary = this.$route.query.reslibrary
            this.cardId = this.$route.query.cardId
            this.boardId = this.$route.query.boardId
            this.listId = this.$route.query.listId
            if (Z_IsEmpty20(this.listId)) {
                this.listId = "nowork"
            }
            if (Z_IsEmpty20(this.cardId)) {
                this.cardId = "nowork"
            }
            if (Z_IsEmpty20(this.boardId)) {
                this.boardId = "nowork"
            }
            if (Z_IsEmpty20(this.reslibrary)) {
                this.reslibrary = "noReslibrary"
            }
            this.getHeadList()
            this.geBodyList("responsibleAndShare")
            this.getAllType()
            this.getThisUserInfo({

            })
        },
        methods:{
            ...mapActions(['getThisUserInfo']),
            //获取头部列表
            getHeadList() {
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsAdmin",{
                }).then(function (res) {
                    that.isExternalContactsAdmin = res.data.data.isExternalContactsAdmin
                    if (that.cardId === "nowork" && that.listId === "nowork" && that.boardId === "nowork") {
                        that.eUrl = "/outContactMain/addContact?externalContactsId=1&companyId=" + that.companyId
                    } else {
                        that.eUrl = '/outContactMain/addContact?externalContactsId=1&companyId=' + that.companyId + '&cardId=' + that.cardId + '&listId=' + that.listId + '&boardId=' + that.boardId
                    }
                    let url = "/classmain?classType=externalContacts&isCompanyId=true&companyId=" + that.companyId
                   if (res.data.data.isExternalContactsAdmin) {
                       that.list2.push( { content:"手动添加输入",url:that.eUrl, index:0 })
                       that.list2.push( { content:"我负责的",index:1 })
                       that.list2.push( { content:"共享给我的",index:2 })
                       that.list2.push( { content:"全商号的",index:3 })
                       that.list2.push( { content:"无人负责的",index:4 })
                       that.list2.push( { content:"自定义分类",url:url,index:5 })
                   } else {
                       that.list2.push( { content:"手动添加输入",url:that.eUrl,index:0 })
                       that.list2.push( { content:"我负责的",index:1 })
                       that.list2.push( { content:"共享给我的",index:2 })
                       that.list2.push( { content:"自定义分类",url:url,index:3 })

                   }
                })
            },
            //获取列表数据
            geBodyList(type,contactsName) {
                this.bodyList = []
                this.nobody = false
                let param = {
                    type:type,
                    pageNumber: 1,
                    pageSize: 1000
                }
                this.type = type
                if (!Z_IsEmpty20(contactsName)) {
                    param.contactsName = contactsName
                }
                //暂时默认显示
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsList" ,param).then(function (res) {
                    if (res.data.data.total === "0") {
                        that.nobody = true
                    } else {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            that.bodyList.push( res.data.data.data[i])
                        }
                        // that.bodyList = res.data.data.data
                        that.handBodyList()
                    }
                })
            },
            //处理列表数据
            handBodyList() {
                let that = this
                that.bodyList.filter(function (val) {
                    if (!val) {
                        return false
                    }
                    if (val.responsiblePerson === "wholeCompany") {
                        val.text = "全员负责"
                    } else {
                        val.text = val.responsiblePersonName + "  负责"
                    }
                    if (!Z_IsEmpty20(val.contactsType)) {
                        val.flag = true
                    } else {
                        val.flag = false
                    }
                    if (!Z_IsEmpty20(val.contactsLevel)) {
                        val.flag1 = true
                    } else {
                        val.flag1 = false
                    }
                    if (!Z_IsEmpty20(val.contactsState)) {
                        val.flag2 = true
                    } else {
                        val.flag2 = false
                    }
                    if (!Z_IsEmpty20(val.companyName)) {
                        if (val.companyName.length > 20) {
                            val.newcompanyName = val.companyName.substring(0,19) + "..."
                        } else {
                            val.newcompanyName = val.companyName
                        }
                    }
                    if (!Z_IsEmpty20(val.companyName) && Z_IsEmpty20(val.contactsLevel) && Z_IsEmpty20(val.contactsState) && Z_IsEmpty20(val.contactsType)) {
                         val.isMargincompany = true
                        val.isMargin = false
                    } else if (Z_IsEmpty20(val.companyName) && (!Z_IsEmpty20(val.contactsLevel) || !Z_IsEmpty20(val.contactsState) || !Z_IsEmpty20(val.contactsType))) {
                        val.isMargin = true
                        val.isMargincompany = false
                    } else {
                        val.isMargin = false
                        val.isMargincompany = false
                    }
                    return true
                })
            },
            //列表点击
            handleMenu(data) {
                if (data.url) {
                    this.$router.push(data.url)
                } else {
                    // 更新数据发送请求
                    if (data.content === "我负责的") {
                        this.geBodyList("responsible")
                    } else if (data.content === "共享给我的") {
                        this.geBodyList("sharedScope")
                    } else if (data.content === "全商号的") {
                        this.geBodyList("all")
                    } else if (data.content === "无人负责的") {
                        this.geBodyList("nobody")
                    }
                }
            },
            //下拉刷新
            onPullingUp() {
                console.log("hhhh")
            },
            //长按事件
            start(item) {
                let that = this
                that.flag = true
                that.time = window.setTimeout(function () {
                    that.flag = false
                    that.item = item
                    that.popup = true
                    //进行长按事件的处理
                    that.getExternalContacts(item.contactsId)
                },800)
            },
            end(item) {
                if (this.flag) {
                    window.clearTimeout(this.time)
                    // this.contactDetail()
                } else {
                    // this.item = item
                    // this.popup = true
                    // //进行长按事件的处理
                    // this.getExternalContacts(item.contactsId)
                }
            },
            contactDetail(item) {
                if (this.flag) {
                    if (this.cardId === "nowork" && this.listId === "nowork" && this.boardId === "nowork" && this.reslibrary === "noReslibrary") {
                        this.$router.push({
                            path:"/outContactMain/ContactDetail",
                            query:{
                                externalContactsId:item.contactsId,
                                companyId:this.companyId
                            }
                        })
                    }
                } else {
                    return
                }
            },
            //获取头部分类
            getAllType() {
                let that = this
                that.$http.get("/zingbiz/common/serviceModule/getAllTags.action?tagType=externalContacts&companyId=" + that.companyId,{
                    // tagType:"externalContacts",
                    // companyId:that.companyId
                }).then(function (res) {
                    if (res.data.data.data.length !== 0 ) {
                        res.data.data.data.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.list1.push(item.tags)
                            that.typeList.push({ content:item.tags,isCancel:false,cancelText:"选择" })
                            return true
                        })
                    }
                })
            },
            //选择不同分类标签加载数据
            handleMenuType(data) {
                this.popupTitle = data[0]
                this.whole = data[0]
                this.bodyList = []
                if ( data[0] === "客户") {
                    this.geBodyList("responsibleAndShare")
                } else {
                    let that = this
                    that.nobody = false
                    that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsClassifyCustomList",{
                        myCustomType:data[0],
                        companyId:that.companyId
                    }).then(function (res) {
                        if (res.data.data.total === 0) {
                            that.nobody = true
                        } else {
                            that.bodyList = res.data.data.data
                            that.handBodyList()
                        }
                    })
                }
            },
            //搜索
            search() {
                this.inputText = ""
                this.searchFlag = !this.searchFlag
            },
            //搜索取消
            cancelInput() {
                this.searchFlag = false
                this.inputText = ""
            },
            //确定搜索
            confirmInput() {
                 if ( this.inputText === "") {
                     this.$vux.toast.show({
                         type: 'text',
                         width:"12em",
                         text: '请输入搜索内容'

                     })
                 } else {
                     //进行搜索并关闭search
                     let contactsName =  this.inputText
                     if (this.isExternalContactsAdmin) {
                         this.geBodyList("all",contactsName)
                     } else {
                         this.geBodyList("responsibleAndShare",contactsName)
                     }
                     this.searchFlag = false
                 }
            },
            //设置分类
            set() {
                this.popup = false
                if (this.typeList.length === 0) {
                    this.$vux.toast.show({
                        type: 'text',
                        width:"12em",
                        text: '无分类'
                    })
                } else {
                    this.popup1 = true
                }
            },
            //关闭类型选择
            closeType() {
                this.popup1 = false
            },
            //选择类型
            choiceType (val) {
                this.$http.post("/zingbiz/auth/user/custom/updateExternalContactsClassifyCustom",{
                    myCustomType:val.content,
                    externalContactsId:this.item.contactsId,
                    companyId:this.companyId,
                    isCancel:val.isCancel
                }).then((res) => {
                    if (res.data.success) {
                        this.popup1 = false
                    } else {
                        this.$vux.toast.show({
                            type: 'text',
                            width:"12em",
                            text: '操作失败'
                        })
                    }
                })
            },
            //获取外联人分类列表
            getExternalContacts(externalContactsId) {
                this.$http.post("/zingbiz/auth/user/custom/getExternalContactsClassifyCustom",{
                    companyId:this.companyId,
                    externalContactsId:externalContactsId
                }).then((res) => {
                    console.log(res.data.data.total)
                    res.data.data.data.filter((item) => {
                        if (!item) {
                            return false
                        }
                        for (let i = 0; i < this.typeList.length; i++) {
                            if (item.tagName.replace(/(^\s*)|(\s*$)/g, "") === this.typeList[i].content.replace(/(^\s*)|(\s*$)/g, "")) {
                                this.typeList[i].cancelText = "取消选择"
                                this.typeList[i].isCancel = true
                            }
                        }
                        return true
                    })
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height calc(100% - 50px)
    }
    .nobody{
        color: rgba(255, 128, 0, 1);
        font-size: 16px;
        text-align: center;
        font-family: Arial;
        margin-top 15px
    }
    .scroll-list-wrap{
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }

    .list{
        height 70px
        &-left{
            display inline-block
            &-name{
                font-size 17px
                color: rgba(16, 16, 16, 1);
                font-size: 17px;
                font-family: Arial;
            }
            &-companyName{
                font-size 13px
                padding 2px 0
            }
            &-type{
                display inline-block
                width 57px
                text-align center
                height 23px
                line-height 23px
                border-radius: 5px;
                background-color: rgba(252, 165, 106, 1);
                color: rgba(255, 128, 0, 1);
                font-size: 14px;
                font-family: Arial;
                margin-right 10px
            }
            &-level{
                display inline-block
                width: 29px;
                height: 23px;
                line-height: 23px;
                border-radius: 5px;
                background-color: rgba(228, 242, 252, 1);
                color: rgba(77, 169, 235, 1);
                font-size: 14px;
                text-align: center;
                font-family: Arial;
                margin-right 10px
            }
            &-state{
                display inline-block
                width: 29px;
                height: 23px;
                line-height: 23px;
                border-radius: 5px;
                background-color: rgba(220, 246, 239, 1);
                color: rgba(23, 194, 149, 1);
                font-size: 14px;
                text-align: center;
                font-family: Arial;
            }
        }
        &-right{
            height 100%
            position:relative
            right 0
            margin-top 15px
            &-name{
                font-size 14px
                color: rgba(16, 16, 16, 1);
                font-family: Arial;
            }
        }
    }

    .searchContainer{
        width:100%;
        background-color: #F7F8F9;
        padding: 5px 13px;
        .Top-bar{
            padding-bottom 12px
            position relative
            height 30px
            width 100%
            .goback{
                position absolute
                top: 50%
                transform translateY(-50%)
                i{
                    font-size 20px
                    font-weight bold
                }
            }
            .cancel-icon{
                position absolute
                top: 50%
                transform translateY(-50%)
                font-size: 14px;
                span{
                    color: #BDBDBD;
                }
            }
            .inputSpan{
                position: absolute;
                left: 40px;
                right:90px;
                top 50%
                transform translateY(-50%)
                .inputForm{
                    width:100% ;
                    padding: 4px 20px 4px 28px !important;
                    margin-left: 5px;
                    font-size: 16px !important;
                    background: url(../../../../static/images/search.png) center left no-repeat;
                    background-size: 16px 16px;
                    background-position-x: 7px;
                    background-color: white;
                    border-radius: 8px !important
                }
            }
            .confirm-icon{
                position: absolute;
                top 50%
                transform translateY(-50%)
                right: 5px;
                font-size: 16px;
                .confirmInput{
                    color: #ff8000 ;
                    font-size 14px
                    text-decoration:none;
                }
            }

        }
    }
    input::-webkit-input-placeholder{
        color: #707070 ;
        font-size 14px
        font-family italic
    }
    .inputForm:focus{
        outline none !important
    }
    #inputSpan{
        right 50px
    }
    .setType{
        background-color white
        width 100%
        text-align center
        padding 10px 0
        .choiceType{
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
            font-family: Arial;
            padding-bottom  10px
            border-bottom 1px solid #BEBEBE
        }
        li{
            position relative
            height 50px
            line-height 50px
            border-bottom 1px solid #BEBEBE
            font-size 15px
            .name{
                position absolute
                left 20px
            }
            .choice{
                margin-top 10px
                position absolute
                right  20px
                padding-left 10px
                padding-right 10px
                height: 30px;
                line-height 30px
                border-radius: 5px;
                background-color: rgba(255, 128, 0, 1);
                color: rgba(255, 255, 255, 1);
                text-align: center;
                font-family: Microsoft Yahei;
            }
        }
        .close{
            background-color: rgba(255, 255, 255, 1);
            color: rgba(255, 128, 0, 1);
            font-size: 18px;
            font-family: Microsoft Yahei;
            padding-top 10px
        }
    }
    .isMargin{
        margin-top 4px
    }
    .isMargincompany{

        margin-top 8px
    }
</style>


