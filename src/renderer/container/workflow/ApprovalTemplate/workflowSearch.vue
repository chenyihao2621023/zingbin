<template>
   <div>
       <popup position="top" height="100%" v-model="popup">
            <ZingHead :title="title" :isComeBack="false" @doSome="cancle()">
                <div slot="header-right">
                    <span class="header-search">
                        <i class="iconfont icon-fangdajing"></i>
                    </span>
                </div>
            </ZingHead>
            <div class="searchContainer">
                <div class="Top-bar">
                    <span v-show="show3" class="goback" @click="goback">
                        <i class="iconfont icon-zuojiantou"></i>
                    </span>
                    <span class="cancel-icon" id="concel-search" v-show="show4">
                        <span class="cancelInput" @click="cancle">取消</span>
                    </span>
                    <span class="inputSpan">
                        <form action="" class="">
                            <input class="inputForm" id="basic-search" dataId="all" :placeholder="holder" v-model="val">
                            <span class="clearInput" v-show="show1" @click="clearInput()"></span>
                        </form>
                    </span>
                    <span class="confirm-icon " id="confirm-search">
                        <span class="confirmInput" @click="readyGo()" v-bind:style="{right:right}">确定</span>
                    </span>
                    <span class="confirm-icon " id="confirm-search1">
                        <span class="confirmInput" @click="screen()" v-show="shaixuanShow">筛选</span>
                    </span>

                </div>
                <div class="search-prompt">
                    <span id="promptMag" class="promptMag">{{msg}}</span>
                </div>
                <div class="search-mhGroups search-group-list" v-show="show2">
                   <ul class="secondItem-list woow-list">
                       <li class="li1 searchItem" v-for="(item,index) in textType" :key="index" @click="searchType1(item)">
                           <span class="link link2">{{item.value}}</span>
                       </li>
                   </ul>
                </div>
           </div>
       </popup>

       <popup position="top" height="100%" v-model="show">
           <ZingHead :title="title" :isComeBack="false" @doSome="cancleChange()">
               <div slot="header-right">
                 <span class="header-search">
                      <i class="iconfont icon-fangdajing"></i>
                 </span>
               </div>
           </ZingHead>
           <div class="searchContainer">
               <div class="Top-bar">
                    <span class="cancel-icon" id="concel-search1">
                         <span class="cancelInput" @click="cancle">取消</span>
                    </span>
                    <span class="inputSpan">
                         <form action="" class="">
                            <input class="inputForm" id="basic-search1" dataId="all" placeholder="搜索" v-model="val1">
                             <span class="clearInput" v-show="show1" @click="clearInput()"></span>
                         </form>
                    </span>
                    <span class="confirm-icon " id="confirm-search2">
                         <span class="confirmInput" @click="cancleChange()">取消筛选</span>
                    </span>

               </div>
               <group label-width="5.5em" label-margin-right="2em" label-align="right" class="groupStyle">
                   <datetime title="发起日期" value-text-align="right" v-model="startTime" :placeholder="placeholder1"></datetime>
                   <datetime title="至" value-text-align="right" v-model="endTime" :placeholder="placeholder2"></datetime>
                   <selector title="审批流模板" :options="list" v-model="value1" @on-change="onChange"></selector>
                   <selector title="审批流状态" :options="['工作流状态', '待处理','处理中','已完成','驳回']" v-model="value2"></selector>
                   <selector title="审批流类型" :options="['请选择审批流类型', '普通审批','客服','资源库','薪资调整','固定资产']" v-model="value3"></selector>
               </group >
               <div class="deleteAll" @click="deleteAll()">清空筛选内容</div>
               <x-button class="btn-save btn-defalut" @click.native="changeConfirm()">确认</x-button>
           </div>
       </popup>

       <popup position="top" height="100%" v-model="popup0">
           <div class="searchContainer" id="searchContainer">
               <div class="Top-bar">
                    <span v-show="show3" class="goback" @click="goback">
                        <i class="iconfont icon-zuojiantou"></i>
                    </span>
                   <span class="cancel-icon" v-show="show4">
                        <span class="cancelInput" @click="cancle">取消</span>
                    </span>
                   <span class="inputSpan" id="inputSpan">
                        <form action="" class="">
                            <input class="inputForm" dataId="all" :placeholder="holder" v-model="val">
                            <span class="clearInput" v-show="show1" @click="clearInput()"></span>
                        </form>
                    </span>
                   <span class="confirm-icon ">
                        <span class="confirmInput" @click="readyGo()" v-bind:style="{right:right}">确定</span>
                    </span>
               </div>
               <div class="search-prompt">
                   <span class="promptMag">{{msg}}</span>
               </div>
               <div class="search-mhGroups search-group-list" v-show="show2">
                   <ul class="secondItem-list woow-list">
                       <li class="li1 searchItem" v-for="(item,index) in textType" :key="index" @click="searchType1(item)">
                           <span class="link link2">{{item.value}}</span>
                       </li>
                   </ul>
               </div>
           </div>
       </popup>
   </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Popup,Group,Datetime,Selector,XButton } from 'vux'
    import { Z_EncodeU2,Z_IsEmpty20 } from '../../../utils/fn'
    export default {
        name: "workflow-search",
        components: {
            Popup,
            ZingHead,
            Group,
            Datetime,
            Selector,
            XButton
        },
        props: {
            popup: {
                type: Boolean,
                default: false
            },
            popup0: {
                type: Boolean,
                default: false
            },
            textType: {
                type: Array,
            },
            title:{
                type: String,
            },
            mType: {
                type: String,
                default: ""
            },
        },
        data() {
            return {
                show:false,
                show1:false,
                show2:true,
                show3:false,
                show4:true,
                val:"",
                val1:"",
                msg:"点击搜索指定内容",
                holder:"搜索",
                list:[{ key:"mr",value:'工作流模板' }],
                placeholder1:"开始日期",
                placeholder2:"结束日期",
                value1:"mr",
                value2:"工作流状态",
                value3:"请选择审批流类型",
                retcode:"",
                Term:"",
                startTime:"",
                endTime:"",
                workflowId:"",
                item:"",
                searchType:"",
                right:"",
                shaixuanShow:true
            }
        },
        watch:{
            val:function (value) {
                if (value === "") {
                    this.show1 = false
                } else {
                    this.show1 = true
                }
            },
            val1:function (text) {
                if (text === "") {
                    this.show1 = false
                } else {
                    this.show1 = true
                }
            }
        },
        created() {
            this.isInOwnCompany()
            this.searchTerm()
        },
        methods: {
            //筛选
            screen() {
                this.val = ""
                this.show1 = false
                this.show = true
            },
            cancle() {
                this.show = false
                this.$emit("cancle");
            },
            readyGo() {
                if (this.val === "") {
                    this.$vux.toast.show({ type: 'text',text: "请输入搜索内容!", width:'150px' });
                    return
                }
                if (this.item === "") {
                    this.searchType = "all"
                } else {
                    this.searchType = this.item.dataId
                }
                if (this.mType === "" && Z_IsEmpty20(this.$route.query.mType)) {
                    this.$router.push({ path:"/workflow/searchType", query: { type:this.searchType,key:Z_EncodeU2(this.val) }})
                } else if (this.popup0 === true) {
                    this.$router.push({ path:"/workflow/searchType", query: { type:this.searchType,key:Z_EncodeU2(this.val), mType:this.$route.query.mType }})
                    this.cancle()
                } else {
                    this.$router.push({ path:"/workflow/searchType", query: { type:this.searchType,key:Z_EncodeU2(this.val), mType:this.mType }})
                }
            },
            searchType1(item) {
                //通过类型进行查询
                this.val = ""
                this.val1 = ""
                this.item = item
                this.msg = "搜索" + item.value
                this.show2 = false
                this.holder = "搜索" + item.value
                this.show3 = true
                this.show4 = false
            },
            clearInput() {
                this.val = ""
                this.val1 = ""
            },
            goback() {
                this.val = ""
                this.val1 = ""
                this.msg = "点击搜索指定内容"
                this.show2 = true
                this.holder = "搜索"
                this.show3 = false
                this.show4 = true
            },
            //取消筛选
            cancleChange() {
                this.val1 = ""
                this.show1 = false
                this.show = false
            },
            isInOwnCompany:function () {
                let that = this
                that.$http.post("/ZingMH/ZKM/MENHUWX/MHHelper/isInOwnCompany.action",{

                }).then(function (res) {
                    that.retcode = res.data.retcode
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //不在自己绑定商号中搜索项中的模板
            searchTerm() {
                let that = this
                that.$http.post("/zingbiz/workflow/helper/getDataForAllTemplate",{
                }).then(function (res) {
                    that.Term = res.data.data.data
                    that.termData()
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //Term 数据处理
            termData() {
                let that = this
                if (that.retcode === 0) {
                    that.Term.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        if (val.templateType === "YG") {
                            that.list.push({ value:val.templateName,key:val.templateId })
                        }
                        return true
                    })
                } else {
                    that.Term.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        if (val.templateType === "YG") {
                            that.list.push({ value:val.templateName,key:val.templateId })
                        }
                        return true
                    })
                }

           },
            //清空筛选内容
            deleteAll() {
                this.value1 = "mr"
                this.value2 = "工作流状态"
                this.value3 = "请选择审批流类型"
                this.placeholder1 = "开始日期"
                this.placeholder2 = "结束日期"
                this.startTime = ""
                this.endTime = ""
            },
            //筛选界面确认功能
            changeConfirm() {
                //发送请求返回当前的界面
                let param = {}
                param.workflow_sort_id = this.workflowId
                if (this.startTime !== "") {
                    param.startTime = this.startTime + " 00:00:00"
                } else {
                    param.startTime = this.startTime
                }
                if (this.endTime !== "") {
                    param.endTime = this.endTime + " 23:59:59"
                } else {
                    param.endTime = this.endTime
                }

                if (this.value2 === "工作流状态") {
                    param.workflow_state = ""
                } else {
                    param.workflow_state = this.value2
                }
                if (this.value3 === "请选择审批流类型") {
                    param.workflowType = ""
                } else if (this.value3 === "普通审批") {
                    param.workflowType = "YG"
                } else if (this.value3 === "客服") {
                    param.workflowType = "KH"
                } else if (this.value3 === "资源库") {
                    param.workflowType = "MODULE_TYPE_ZYK"
                } else if (this.value3 === "薪资调整") {
                    param.workflowType = "MODULE_TYPE_HR_XZTZ"
                } else if (this.value3 === "固定资产") {
                    param.workflowType = "MT_GDZC"
                }
                param.gridtab = this.$route.query.gridTab
                this.$emit("changeConfirm",param);
                this.cancle()
            },
            onChange (val) {
                console.log(val)
                if (val === "mr") {
                    this.workflowId = ""
                } else {
                    this.workflowId = val
                }
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .searchContainer{
        position: absolute;
        top:50px;
        left:0;
        width:100%;
        right:0;
        bottom:0;
        z-index:1001;
        background-color: #F7F8F9;
        padding: 0 15px;
        .Top-bar{
            margin-top 16px
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
        .search-prompt{
            width: 100%;
            color: rgba(168, 165, 168, 1);
            font-size: 13px;
            text-align: center;
            font-family: Arial;
            margin-top 14px
            margin-bottom 12px
        }
    }
    input::-webkit-input-placeholder{
        color: #707070 ;
        font-size 14px
        font-family italic
    }
    #confirm-search{
        right 40px
    }

    #confirm-search2{
        width: 70px;

    }
    .inputForm:focus{
        outline none !important
    }

    .li1 span{
        color: rgba(255, 152, 0, 1);
        font-size: 14px;
        font-family: Arial;
    }

    /*二级菜单*/
    .search-group-list{
        margin-top: 12px;
    }
    .secondItem-list>li{
        float: left;
    }
    .woow-list{
        width: 90%;
        height: 50px;
        margin: 0 auto !important;
        text-align: center;
    }

    .woow-list>li{
        width: 25% ;
        margin-bottom 20px
    }

    .special-2{
        width: 50% !important;
    }

    .groupStyle{
        padding 1.8rem
        .weui-cells{
            .vux-selector{
                font-size 14px !important
            }
            .vux-datetime{
                font-size 14px !important
            }
        }
    }

    .deleteAll{
        text-align: center;
        width: 100%;
        color: #ff8000;
    }
    .btn-defalut{
        margin-bottom: 10px;
        position: absolute;
        width: 90%;
        bottom: 0;
    }


    .clearInput{
        position: absolute;
        width: 22px;
        height: 22px;
        right: 3px;
        top: 4px;
        background: url(../../../../../static/images/close21.png) center no-repeat;
        background-size: 22px 22px;
    }
    #searchContainer{
        top:0
    }
    #inputSpan{
        right 50px
    }
</style>
