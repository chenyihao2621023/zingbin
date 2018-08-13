<template>
    <div class="outWarpper">
        <ZingHead title="业务往来"></ZingHead>
        <div class="contact">
            <scroll
                ref="scrollbar"
            >
                <div class="contact-nav">
                    <span class="contact-nav-img">
                        <span class="tupian">{{contactsName}}</span>
                    </span>
                    <div class="contact-nav-info">
                        <div class="contact-nav-info-name" >
                            {{contactHead.contactsName}}{{contactHead.newcompanyName}}
                        </div>
                        <div>
                            <span class="contact-nav-info-type" v-show="flag">{{contactHead.contactsType}}</span>
                            <span class="contact-nav-info-level" v-show="flag1">{{contactHead.contactsLevel}}</span>
                            <span class="contact-nav-info-state" v-show="flag2">{{contactHead.contactsState}}</span>
                        </div>
                    </div>
                </div>
                <div class="contact-add" @click="addVisit()">
                    <span class="contact-add-icon">
                        <i class="iconfont icon-jiahao1" ></i>
                    </span>
                    <span class="contact-add-text">添加拜访记录</span>
                </div>
                <div>
                    <ul>
                        <li v-show="show" v-for="(item , index) in text" :key="index" class="change">
                           <div class="miaoshu">
                               <span class="change-data">{{item.data}}</span>
                               <span class="change-icon"></span>
                               <span class="change-time">{{item.time}}</span>
                           </div>
                            <span class="change-describe">
                                <span class="CreateName">{{item.activityCreateName}}</span><!--
                                -->{{item.activityAction}}了<!--
                                --><span class="ContactsName">{{item.contactsName}}</span><!--
                                -->的{{item.activityObjectName}}:{{item.activityObjectAttribute}}
                            </span>
                        </li>
                        <li v-show="Information" v-for="item in hotelContactsInfo" :key="item.id" class="change">
                            <div class="miaoshu">
                                <span class="change-data">{{item.data}}</span>
                                <span class="change-icon"></span>
                                <span class="change-time">{{item.time}}</span>
                            </div>
                            <span class="change-describe">
                                <span class="CreateName">{{item.activityCreateName}}</span>将<!--
                                --><span class="ContactsName">{{item.contactsName}}</span><!--
                                -->{{item.activityAction}}为客户
                            </span>
                        </li>
                        <li v-show="VisitRecord" v-for="item in externalContactsVisitRecord" :key="item.activityObjectName" class="change" @click="goVisitRecord(item)">
                            <div class="miaoshu">
                                <span class="change-data">{{item.data}}</span>
                                <span class="govisit" v-if="item.isEditable">
                                    <i class="iconfont icon-bianji1"></i>
                                </span>
                                <span class="change-icon" v-else></span>
                                <span class="change-time">{{item.time}}</span>
                            </div>
                            <span class="change-describe">
                                <span class="CreateName">{{item.activityCreateName}}</span><!--
                                -->{{item.activityAction}}了对<!--
                                --><span class="ContactsName">{{item.contactsName}}</span>的拜访记录
                            </span>
                            <span class="visit">
                                <i class="iconfont icon-arrow-right"></i>
                            </span>
                        </li>
                    </ul>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import scroll from '@/components/scroll/Scroll'
    import { Z_IsEmpty20 } from '../../utils/fn'
    export default {
        components:{
            ZingHead,
            scroll
        },
        data() {
            return {
                companyId:"",
                externalContactsId:"",
                contactHead:{},
                getChangeData:[],
                text:[],
                hotelContactsInfo:[],
                externalContactsVisitRecord:[],
                show:false,
                Information:false,
                VisitRecord:false,
                flag:false,
                flag1:false,
                flag2:false,
                contactsName:""
            }
        },
        mounted() {
            window.setTimeout(() => {
                this.$refs.scrollbar.refresh();
            }, 1000);
        },
        created() {
            this.externalContactsId = this.$route.query.externalContactsId
            this.companyId = this.$route.query.companyId
            this.getExternalContactsById()
            this.getBusinessActivities()
        },
        methods:{
            //获取头部数据
            getExternalContactsById:function () {
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById",{
                    contactsId:that.externalContactsId
                }).then(function (res) {
                    if (res.data.data.contactsName.length > 2) {
                        that.contactsName = res.data.data.contactsName.slice(0,2)
                    } else {
                        that.contactsName = res.data.data.contactsName
                    }
                    that.contactHead = res.data.data

                    if (!Z_IsEmpty20(that.contactHead.companyName)) {
                        if (that.contactHead.companyName.length > 20) {
                            that.contactHead.newcompanyName = "(" + that.contactHead.companyName.substring(0,15) + "...)"
                        } else {
                            that.contactHead.newcompanyName = "(" + that.contactHead.companyName + ")"
                        }
                    }
                    if (!Z_IsEmpty20(that.contactHead.contactsType)) {
                        that.flag = true
                    } else {
                        that.flag = false
                    }
                    if (!Z_IsEmpty20(that.contactHead.contactsLevel)) {
                        that.flag1 = true
                    } else {
                        that.flag1 = false
                    }
                    if (!Z_IsEmpty20(that.contactHead.contactsState)) {
                        that.flag2 = true
                    } else {
                        that.flag2 = false
                    }
                })
            },
            //获取详细数据改动
            getBusinessActivities:function () {
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsActivityRest/getBusinessActivities",{
                    companyId:that.companyId,
                    contactsId:that.externalContactsId
                }).then(function (res) {
                    that.getChangeData = res.data.data
                    that.getChangeData.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        // if (!Z_IsEmpty20(val.generateTime)) {
                        //
                        // }
                        let arr = val.generateTime.split(" ")
                        let arr1 = arr[0].split("-")
                        let arr2 = arr[1].split(":")
                        val.data = arr1[1] + "/" + arr1[2]
                        val.time = arr2[0] + ":" + arr2[1]
                        if (val.activityObjectType === "text") {
                            that.show = true
                            that.text.push(val)
                        } else if (val.activityObjectType === "hotelContactsInfo") {
                            that.Information = true
                            that.hotelContactsInfo.push(val)
                        } else if (val.activityObjectType === "externalContactsVisitRecord") {
                            that.VisitRecord = true
                            that.externalContactsVisitRecord.push(val)
                        }
                        return true
                    })
                })
            },
            //跳转拜访记录
            addVisit:function () {
                this.$router.push({
                    path:"/outContactMain/visitRecord",
                    query:{
                        externalContactsId:this.externalContactsId,
                        companyId:this.companyId,
                        type:"add"
                    }
                })
            },
            goVisitRecord:function (item) {
                this.$router.push({
                    path:"/outContactMain/visitRecord",
                    query:{
                        externalContactsId:this.externalContactsId,
                        companyId:this.companyId,
                        visitRecordId:item.activityObjectValue.visitRecordId,
                        type:"update"
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .contact{
        height 100%
        margin 10px 13px
        &-nav{
            &-img{
                position relative
                display inline-block
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background-color #E5E5E5
                margin-right 14px
                .tupian{
                    font-size 12px
                    position absolute
                    top: 50%
                    left 50%
                    transform translate(-50%,-50%)
                }
            }
            &-info{
                display inline-block
                width calc(100% - 70px)
                &-name{
                    color: rgba(16, 16, 16, 1);
                    font-family: Arial;
                    margin-bottom 5px
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
        }
        &-add{
            margin-left 12.5px
            margin-top 10px
            padding-bottom 10px
            border-bottom 2px solid #fafafa
            &-icon{
                position relative
                display inline-block
                width: 25px;
                height: 25px;
                border-radius 12.5px
                background-color: #ff8000;
                .icon-jiahao1{
                    color white
                    position absolute
                    top: 50%
                    left 50%
                    transform translate(-50%,-50%)
                }

            }
            &-text{
                color: #ff8000;
                font-size: 17px;
                text-align: center;
                font-family: Arial;
                margin-left 10px
            }
        }
    }
    .change{
        position relative
        border-bottom  2px solid #FAFAFA
        margin 10px
        padding 10px 0
        &-icon{
            display inline-block
            width: 6px;
            height: 6px;
            border-radius 3px
            margin 0 6px
            background-color: rgba(255, 128, 0, 1);
        }
        &-describe{
            display: inline-block
            width 60%
        }
    }
    .miaoshu{
        display inline-block
    }
    .CreateName,.ContactsName{
        font-weight bold
    }
    .outWarpper{
        height calc(100% - 50px)
    }
    .scroll-list-wrap{
        height 100%
    }
    .govisit{
        display inline-block
        position relative
        width: 18px;
        height: 18px;
        border-radius 9px
        background-color: #459FE7;
    }
    .govisit .icon-bianji1{
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        font-size 12px !important
        color white
    }
    .visit{
        position absolute
        right 0
        top 50%
        transform translateY(-50%)
    }
</style>
