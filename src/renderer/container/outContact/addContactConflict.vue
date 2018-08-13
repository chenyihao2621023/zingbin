<template>
    <div>
        <ZingHead title="添加外联人"></ZingHead>
        <div>
            <div class="describe">您添加的外部联系人记录可能与已存在的{{total}}条外联人记录重复，重复外联人如下：</div>
            <div>
                <GridCard class="list" v-for="(item,index) in List" :key="index" @click.native="goDetails(item)">
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
                    </div>
                </GridCard>
            </div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="confirmOk()">重复保存</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="cancelConfirm()">取消保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>


<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from '@/components/gridcard/GridCard'
    import { Flexbox,FlexboxItem,XButton } from 'vux'
    import { Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "add-contact-conflict",
        components: {
            ZingHead,
            GridCard,
            Flexbox,
            FlexboxItem,
            XButton
        },
        data () {
            return {
                total : "",
                List:[],
                param:{},
                isExternalContactsAdmin:"",
                currentCardUrl:{}
            }
        },
        created() {
            this.param = this.$route.query.originalParams
            this.getExternalContactConflict()
            this.getExternalContactsAdmin()
            this.getCurrentCardUrl()
        },
        methods:{
            //重复数据获取
            getExternalContactConflict:function () {
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactConflict",{
                    contactsName:this.param.contactsName,
                    telPhone:this.param.telPhone
                }).then(function (res) {
                    that.List = res.data.data.data
                    that.total = res.data.data.total
                    that.handBodyList()
                })
            },
            // 数据处理
            handBodyList() {
                let that = this
                that.List.filter(function (val) {
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
            //确认提交
            confirmOk() {
                let that = this
                that.param.isRepetition = true
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/addExternalContacts",that.param).then(function (res) {
                    that.$router.go(-2)
                })
            },
            //取消保存
            cancelConfirm() {
                this.$router.go(-2)
            },
            //判断是否为管理员
            getExternalContactsAdmin:function () {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsAdmin",{

                }).then((res) => {
                    this.isExternalContactsAdmin = res.data.data.isExternalContactsAdmin
                })
            },
            //从cookie获取当前用户cardUrl
            getCurrentCardUrl:function () {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl",{

                }).then((res) => {
                    this.currentCardUrl = res.data.data
                })
            },
            //点击跳转界面
            goDetails:function (item) {
                console.log(item)
                if (this.isExternalContactsAdmin) {
                    this.$router.push({
                        path:"ContactDetail",
                        query:{
                            externalContactsId:item.contactsId,
                            companyId:item.companyId
                        }
                    })
                    return
                }
                if (!Z_IsEmpty20(this.currentCardUrl) && !Z_IsEmpty20(this.currentCardUrl.cardUrl)) {
                    if (!Z_IsEmpty20(item.responsiblePerson) && item.responsiblePerson.indexOf(this.currentCardUrl.cardUrl) >= 0) {
                        this.$router.push({
                            path:"ContactDetail",
                            query:{
                                externalContactsId:item.contactsId,
                                companyId:item.companyId
                            }
                        })
                        return
                    } else if (!Z_IsEmpty20(item.sharedScope) && item.sharedScope.indexOf(this.currentCardUrl.cardUrl) >= 0) {
                        this.$router.push({
                            path:"ContactDetail",
                            query:{
                                externalContactsId:item.contactsId,
                                companyId:item.companyId
                            }
                        })
                        return
                    }

                }
                this.$vux.toast.show({
                    type: 'text',
                    width:"12em",
                    text: '没有查看权限'
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .describe{
        padding 10px 13px
        font-size 16px
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
            &-name{
                font-size 14px
                color: rgba(16, 16, 16, 1);
                font-family: Arial;
            }
        }
    }

    .interspace{
        margin-left: 0px !important;
    }
    .inner{
        margin-top: 20px;
    }
</style>
