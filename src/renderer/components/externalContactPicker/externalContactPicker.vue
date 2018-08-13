<template>
    <div>
        <popup position="right" width="100%" v-model="popup" >
            <ZingHead title="选择外联人" :isComeBack="false" @doSome="cancle()">
                <div slot="header-right">
                    <span class="header-search" @click="searchData()">
                        <i class="iconfont icon-fangdajing"></i>
                    </span>
                    <span class="header-jiahao" @click="add()">
                        <i class="iconfont icon-gengduo" ></i>
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
            <div class="scroll-list-wrap">
                <scroll
                    ref="scrollbar"
                    :data="bodyList"
                >
                    <GridCard class="list" v-for="(item,index) in bodyList" :key="index"
                              @click.native="contactDetail(item)"
                    >
                        <div class="list-left" slot="cardLeft">
                            <div class="list-left-name">{{item.contactsName}}</div>
                            <div class="list-left-companyName">{{item.newcompanyName}}</div>
                            <div>
                                <span class="list-left-type" v-show="item.flag">{{item.contactsType}}</span>
                                <span class="list-left-level" v-show="item.flag1">{{item.contactsLevel}}</span>
                                <span class="list-left-state" v-show="item.flag2">{{item.contactsState}}</span>
                            </div>
                        </div>
                        <div class="list-right" slot="cardRight">
                            <div class="list-right-name">
                                {{item.text}}
                            </div>
                            <div class="list-right-tag">
                                <tag type="success" @click.native.stop="changeContact(item)">修改</tag>
                                <tag type="success" @click.native.stop="deleteContact(item)">删除</tag>
                            </div>
                        </div>
                    </GridCard>
                </scroll>
            </div>
        </popup>

        <popup position="right" width="100%" v-model="popup1">
            <ZingHead title="添加外联人" :isComeBack="false" @doSome="close()"></ZingHead>
        </popup>
        <confirm
            v-model="show"
            mask-z-index="5000"
            hide-on-blur="true"
            @on-confirm="onConfirm"
        >
            <p style="text-align:center;">提示</p>
            <p style="text-align:center;">确定要刪除吗？</p>
        </confirm>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import Tag from "@/components/tag/Tag";
    import { Popup,Confirm  } from 'vux'
    import { Z_IsEmpty20 } from '../../../utils/fn'
    export default {
        name: "external-contact-picker",
        components:{
            ZingHead,
            Popup,
            Dropdown,
            GridCard,
            scroll,
            Tag,
            Confirm
        },
        props: {
            popup:{
                type:Boolean,
            }
        },
        data() {
            return {
                popup1:false,
                flag:true,
                bodyList:[],
                time:"",
                isExternalContactsAdmin:"",
                show:false,
                item:"",
                searchFlag:false,
                inputText:""

            }
        },
        created() {
            this.geBodyList("responsibleAndShare")
            this.limitAdmin()
        },
        methods:{
            cancle() {
                this.$emit("cancle")
            },
            add() {
                this.$router.push({
                    path:"addContact",
                    query:{
                        bind:true
                    }
                })
            },
            close() {
                this.popup1 = false
            },
            //用户权限判断
            limitAdmin() {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsAdmin",{
                }).then((res) => {
                    this.isExternalContactsAdmin = res.data.data.isExternalContactsAdmin
                })
            },
            //获取列表数据
            geBodyList(type,contactsName) {
                this.bodyList = []
                this.nobody = false
                let param = {
                    type:type,
                    pageNumber: 1,
                    pageSize: 10
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
                        that.bodyList = res.data.data.data
                        that.handBodyList()
                    }
                })
            },
            //对列表数据进行处理
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
                    return true
                })
            },
            //点击传递数据
            contactDetail(item) {
               this.$emit("contactDetail",item)
            },
            //删除外联人
            deleteContact(item) {
                this.show = true
                this.item = item
            },
            onConfirm() {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/deleteExternalContact",{
                    contactsId:this.item.contactsId,
                }).then((res) => {
                    if (res.data.success) {
                        this.geBodyList("responsibleAndShare")
                    }
                })
            },
            //修改外联人
            changeContact(item) {
                this.$router.push({
                    path:"addContact",
                    query:{
                        externalContactsId:item.contactsId,
                        bind:true
                    }
                })
            },
            //搜索框取消
            cancelInput() {
                this.searchFlag = false
            },
            //搜索框确定
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
            //搜索数据
            searchData() {
                this.searchFlag = true
            }

        }

    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .scroll-list-wrap{
        background-color white
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
            &-tag{
                margin-top 10px
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
                    background: url(../../../../../static/images/search.png) center left no-repeat;
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
                    color: #40AFFC ;
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
</style>
