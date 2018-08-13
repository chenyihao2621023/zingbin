<template>
    <div class="outwrapper">
        <ZingHead title="变动方式" :isComeBack="false" @doSome="cancle()">
            <div slot="header-right" v-show="headerRight">
                <span class="header-jiahao">
                    <dropdown :data="list" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
        </ZingHead>
        <scroll :observeDOM="true" class="list-warp" :style="{ height: heightChange + 'px'}">
            <!--<div class="increaseFirst" @click="increaseFirst()" v-show="levelFirst">-->
                <!--<x-icon type="ios-plus-outline" size="24" class="circle"></x-icon>-->
                <!--<span class="describe">增加一级类别</span>-->
            <!--</div>-->
            <tree :data="theData"
                  :newItem="newItem"
                  :deleteItem="deleteItem"
                  :deleteArray="deleteArray"
                  @addItem="addItem"
                  @editItem="editItem"
                  @deleteItem="deleteItem"
                  @checkIcon="checkIcon"></tree>
        </scroll>
        <x-button type="primary" class="btn-common" v-show="deleteItem" @click.native="deleteTree()">删除</x-button>
        <popup position="top" v-model="popup" @on-hide = "onHide" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="initFrom">
                <div class="initFrom-title">新建</div>
                <group>
                    <!--<div class="initCode">-->
                        <!--<span class="initCode-title">代码</span>-->
                        <!--<span class="initCode-content">-->
                            <!--<span class="initCode-content-default">001</span>-->
                            <!--<input type="text" class="initCode-content-input">-->
                        <!--</span>-->
                    <!--</div>-->
                    <x-input title="代码" class="code" v-model="code" placeholder="请输入代码"></x-input>
                    <x-input title="名称" placeholder="请输入名称" class="name" v-model="name"></x-input>
                    <selector title="凭证字号" :options="accountNum" v-model="account" class="addItemAccount"></selector>
                    <x-textarea title="摘要 " placeholder="请输入摘要信息" :rows="2" v-model="abstract" class="addItemAbstract"></x-textarea>
                    <div class="subject" @click="changeCode()">
                        <span class="subject-code">对方科目代码</span>
                        <span class="subject-choice" >{{ckProjectName}}</span>
                    </div>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancleNew()">
                            取消
                        </flexbox-item>
                        <flexbox-item class="interspace" @click.native="confirmNew()">
                            确认
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
        <!--选择科目代码-->
        <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>

        <!--删除提示 -->
        <confirm v-model="show"
                 title="提示"
                 @on-confirm="onConfirm"
                >
            <p style="text-align:center;">确定删除吗？</p>
        </confirm>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from "@/components/dropdown/Dropdown";
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import Scroll from "@/components/scroll/Scroll";
    import Tree from "../template/Tree.vue";
    import { Z_IsEmpty20 } from '../../../utils/fn'
    import { mapActions,mapState } from 'vuex'
    import { Popup,Group,XInput,XTextarea,Selector,Flexbox,FlexboxItem,XButton,Confirm } from 'vux'
    export default {
        name: "change-style",
        components:{
            ZingHead,
            Dropdown,
            Popup,
            Group,
            XInput,
            XTextarea,
            Selector,
            Flexbox,
            FlexboxItem,
            XButton,
            SubjectPicker,
            Scroll,
            Tree,
            Confirm
        },
        data() {
            return {
                show:false,
                list:[
                    { content:"新建" },
                    { content:"删除" }
                ],
                newItem:false,
                deleteItem:false,
                popup:false,
                accountNum:[],
                account:"",
                code:"",
                name:"",
                abstract:"",
                //科目代码
                showPicker: false,
                ckProjectName:"请选择科目代码",
                ckProjectId:"",
                theData: [

                ],
                headerRight:true,
                deleteData:[],
                flag:true,
                item:"",
                repeat:false,
                deleteArray:[],
                level:false,
                levelFirst:false,
                heightChange:"",
            }
        },
        computed:{
            ...mapState({
                voucherData: state => state.fixedAssets.voucherData,
            })
        },
        watch: {
            voucherData:{
                handler:function (newValue) {
                    this.accountNum = newValue
                },
                deep:true
            }
        },
        created() {
            this.getAllChangeModeConfiguration()
            this.searchVoucher()
        },
        mounted() {
            this.heightChange = document.querySelector(".outwrapper").clientHeight - 50
        },
        methods:{
            ...mapActions([
                'searchVoucher',
            ]),
            handleMenu(data) {
                this.newItem = false
                this.deleteItem = false
                if (data.content === "新建") {
                     this.levelFirst = true
                     this.newItem = true
                     this.headerRight = false
                } else {
                    this.deleteArray = []
                    this.deleteItem = true
                    this.headerRight = false
                    this.heightChange = document.querySelector(".outwrapper").clientHeight - 94
                }
            },
            //科目代码
            changeCode() {
                this.showPicker = true
            },
            subjectAbort() {
                this.showPicker = false;
            },
            //科目代码数据
            getPickedData(pickedData) {
                this.ckProjectId = pickedData.fileId;
                this.ckProjectName = pickedData.filename;
                this.showPicker = false;
            },
            //返回事件
            cancle() {
                if (this.newItem === false && this.deleteItem === false) {
                    this.$router.back(-1)
                } else {
                    this.newItem = false
                    this.deleteItem = false
                    this.headerRight = true
                    this.levelFirst = false
                }
            },
            //添加子集 判断类别是否被使用 类别被使用不允许添加 是否为最后一级 左后一级不予许添加 不可跨级添加
            addItem (item) {
                this.item = item
                this.name = ""
                this.account = ""
                this.abstract = ""
                this.ckProjectName = "请选择科目代码"
                if (item.code.split(".").length >= 5) {
                    this.$vux.toast.text("类别最多为5级")
                    return
                } else {
                    this.checkChangeModeConfigurationUsing(item.id)
                }
                //判断是否被引用
            },
            //取消新建
            cancleNew() {
                this.popup = false
                this.level = false
            },
            //确认新建
            confirmNew() {
                //确认提交
                this.repeat = false
                let params = {}
                if (this.level) {
                    //增加一级类别
                    //判断不可重复添加和格式
                    if (/^(?!0{3})\d{3}$/.test(this.code)) {
                        params.code = this.code
                        if (this.theData.length !== 0 ) {
                            this.theData.forEach((val) => {
                                if (val.code === this.code) {
                                    this.repeat = true
                                }
                            })
                        }
                        if (this.repeat) {
                            this.$vux.toast.text("不可以重复添加")
                            return
                        }
                    } else {
                        this.$vux.toast.text("请输入正确的代码格式")
                        return
                    }

                } else {
                    let idArr = this.item.code.split(".").slice(0,this.item.code.split(".").length)
                    let codeArr = this.code.split(".").slice(0,this.code.split(".").length - 1)
                    let number = this.code.split(".")[this.code.split(".").length - 1]
                    if (this.item.code.split(".").length + 1 === this.code.split(".").length) {
                        //代码范围判断及输入的格式
                        if (/^(?!0{3})\d{3}$/.test(number)) {
                            //父元素判断
                            if (idArr.toString() === codeArr.toString()) {
                                //是否有重复的子元素
                                if (!Z_IsEmpty20(this.item.children)) {
                                    this.item.children.forEach( val => {
                                        if (this.code === val.code) {
                                            this.repeat = true
                                        }
                                    })
                                }
                                if (this.repeat) {
                                    this.$vux.toast.text("不可以重复添加")
                                    return
                                } else {
                                    //代码赋值
                                    params.code = this.code
                                }
                            } else {
                                this.$vux.toast.text("必须以" + this.item.code + ".开始")
                                return
                            }
                        } else {
                            this.$vux.toast.text("子级代码需要在001-999之间")
                            return
                        }
                    } else {
                        this.$vux.toast.text("请正确输入代码")
                        return
                    }
                }
                if (this.name) {
                    params.name = this.name
                } else {
                    this.$vux.toast.text("请输入名称名称")
                    return
                }
                if (Z_IsEmpty20(this.item)) {
                    params.parentId = "0"
                } else {
                    params.parentId = this.item.id
                }
                if (this.account !== "") {
                    params.voucherWord = this.account
                } else {
                    this.$vux.toast.text("请输入凭证字号")
                    return
                }
                if (this.abstract !== "") {
                    params.summary = this.abstract
                } else {
                    this.$vux.toast.text("请输入摘要")
                    return
                }
                if (this.ckProjectName !== "请选择科目代码") {
                    params.subjectCode = this.ckProjectId
                } else {
                    this.$vux.toast.text("请选择科目代码")
                    return
                }
                this.$http.post("/zingbiz/fixedAssets/configuration/addChangeModeConfiguration",params).then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        this.$vux.toast.text("添加成功")
                        this.popup = false
                        this.getAllChangeModeConfiguration()
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //修改数据
            editItem(item) {
                console.log(item)
                if (this.deleteItem || this.newItem) {
                    return
                } else {
                    this.$router.push({
                        path:"/fixMoneyMain/newStyle",
                        query:{
                            id:item.id,
                            code:item.code
                        }
                    })
                }
            },
            checkIcon(item) {
                //将数据保存
                this.deleteData = item
            },
            //处理传来的数据
            deleteTree() {
                //不能为空
                if (JSON.stringify(this.deleteData) === "{}") {
                    this.$vux.toast.text("请选择要删除的方式")
                    return
                }
                if (this.deleteData.code.split(".").length === 1) {
                    this.$vux.toast.text("不能删除一级标题")
                    return
                }
                this.checkChangeModeConfigurationUsing(this.deleteData.id)
            },
            //确认删除的数据
            onConfirm() {
                this.$http.post("/zingbiz/fixedAssets/configuration/deleteChangeModeConfiguration",{
                    id:this.deleteData.id
                }).then((res) => {
                    if (res.data.success) {
                        let that = this
                        window.setTimeout(function () {
                            that.$vux.toast.text(res.data.mgs)
                            that.show = false
                            that.deleteItem = false
                            that.headerRight = true
                            that.getAllChangeModeConfiguration()
                        },1000)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //增加一级标题
            increaseFirst () {
                this.popup = true
                this.level = true
            },
            onHide() {
                this.level = false
            },
            //获取变动方式
            getAllChangeModeConfiguration () {
                this.$http.get("/zingbiz/fixedAssets/configuration/getAllChangeModeConfiguration",{

                }).then((res) => {
                    this.theData = res.data.data
                })
            },
            //判断方式是否被使用
            checkChangeModeConfigurationUsing(id) {
                this.$http.post("/zingbiz/fixedAssets/configuration/checkChangeModeConfigurationUsing",{
                    id:id
                }).then((res) => {
                    if (!res.data.data.hasUsed) {
                        if (this.deleteItem) {
                           this.show = true
                        } else {
                            this.popup = true
                        }
                    } else {
                        this.$vux.toast.text("变动方式被使用")
                    }
                }).catch((error) => {
                    alert(error)
                })
            }
        }
    }
</script>
<style>
    .initFrom .vux-selector{
        height: 44px;
    }
    .initFrom .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;

    }
    .initFrom .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .initFrom .weui-cell__bd{
        font-family: Arial;
        color: rgba(136, 136, 136, 1) !important;
        font-size: 14px !important;
    }
    .initFrom .weui-input::-webkit-input-placeholder,.initFrom .weui-textarea::-webkit-input-placeholder{
        color: rgba(136, 136, 136, 1) !important;
        font-size: 14px;
        font-family: Arial;
    }
    .initFrom .weui-select{
        color: rgba(136, 136, 136, 1) !important;
    }
    .initFrom .name .weui-cell__hd:before,
    .initFrom .code .weui-cell__hd:before,
    .initFrom .addItemAccount .weui-cell__hd:before,
    .initFrom .addItemAbstract .weui-cell__hd:before
    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 50px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .initFrom .addItemAccount .weui-cell__hd:before{
        left: 80px;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
    }
    .inner{
        border-top 1px solid #f5f5f5
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
        padding 5px 0
    }
    .interspace:last-child{
        border-left 1px solid #f5f5f5
        color #ff8000
    }
    .initFrom{
        &-title{
            height 40px
            line-height 40px
            background-color white
            text-align center
        }
        .subject{
            position relative
            height 44px
            line-height 44px
            font-size: 14px !important;
            font-family: Arial;
            padding 0 13px
            border-top 1px solid #f5f5f5
            &-code{
                font-family: Arial;
            }
            &-choice{
                position absolute
                right 13px
                color: rgba(136, 136, 136, 1);
                font-size 14px
            }
        }
    }
    .increaseFirst{
        position relative
        margin-left 13px
        line-height 3
        .circle{
            transform translateY(25%)
        }
    }
    .subject-code:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 100px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .initCode{
        position relative
        height 44px
        line-height 44px
        margin-left 13px
        color: rgba(16, 16, 16, 1)
        font-size: 14px
        text-align: left
        font-family: Arial
        &-title:before{
            content: "*";
            display: inline-block;
            position: absolute;
            left: 35px;
            color: rgba(255, 128, 0, 1) !important;
        }
        &-content {
            position absolute
            right 13px
            &-input{
                height 40px
                width 80px
                background:none;
                outline:none;
                border:0px;
            }
        }
    }
</style>
