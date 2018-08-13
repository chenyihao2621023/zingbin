<template>
    <div class="outwrapper">
        <ZingHead title="使用状态" :isComeBack="false" @doSome="cancle()">
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
            <div class="increaseFirst" @click="increaseFirst()" v-show="levelFirst">
                <x-icon type="ios-plus-outline" size="24" class="circle"></x-icon>
                <span class="describe">增加一级类别</span>
            </div>
            <tree :data="theData"
                  :newItem="newItem"
                  :deleteItem="deleteItem"
                  @addItem="addItem"
                  @editItem="editItem"
                  @checkIcon="checkIcon"
            >
            </tree>
        </scroll>
        <x-button type="primary" class="btn-common" v-show="deleteItem" @click.native="deleteTree()">删除</x-button>
        <popup position="top" v-model="popup" @on-hide = "onHide" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="editstate">
                <div class="title">新建</div>
                <group>
                    <x-input title="代码" class="code star" v-model="code" placeholder="请输入代码"></x-input>
                    <x-input title="名称" class="name star" v-model="name" placeholder="请输入名称"></x-input>
                    <div class="discount">
                        <span class="discount-title">是否计提折旧</span>
                            <span class="discount-content">
                                <span class="discount-changeY">
                                    <span class="discount-changeY-icon" v-bind:style ="{ borderColor:defalueColor }" @click="DiscountY()">
                                        <span :class="{radioed: discountYes }"></span>
                                    </span>
                                    <span class="discount-changeY-name">计提折旧</span>
                                </span>
                                <span class="discount-changeN">
                                    <span class="discount-changeN-icon" v-bind:style ="{ borderColor:borderColor }" @click="DiscountN()">
                                        <span :class="{radioed: discountNo }"></span>
                                    </span>
                                    <span class="discount-changeN-name">不提折旧</span>
                                </span>
                        </span>
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
    import Scroll from "@/components/scroll/Scroll";
    import Tree from "../template/Tree.vue";
    import { Z_IsEmpty20 } from '../../../utils/fn'
    import { Group,XInput,Popup,Flexbox,FlexboxItem,XButton,Confirm } from 'vux'
    export default {
        name: "use-state",
        components:{
            ZingHead,
            Dropdown,
            Scroll,
            Tree,
            Group,
            XInput,
            Popup,
            Flexbox,
            FlexboxItem,
            XButton,
            Confirm
        },
        data() {
            return {
                list:[
                    { content:"新建" },
                    { content:"删除" }
                ],
                theData: [

                ],
                newItem:false,
                deleteItem:false,
                headerRight:true,
                popup:false,
                discountYes:true,
                discountNo:false,
                borderColor:"#c9c9c9",
                defalueColor:"#40affc",
                code:"",

                name:"",
                deleteData:{},
                show:false,
                flag:false,
                item:"",
                repeat:false,
                levelFirst:false,
                level:false,
                heightChange:""
            }
        },
        created() {
           this.getAllWorkingConditionConfiguration()
        },
        mounted() {
            this.heightChange = document.querySelector(".outwrapper").clientHeight - 50
        },
        methods:{
            cancle() {
                if (this.newItem === false && this.deleteItem === false) {
                    this.$router.back(-1)
                } else {
                    this.levelFirst = false
                    this.newItem = false
                    this.deleteItem = false
                    this.headerRight = true
                }
            },
            handleMenu(data) {
                this.newItem = false
                this.deleteItem = false
                if (data.content === "新建") {
                    this.levelFirst = true
                    this.newItem = true
                    this.headerRight = false
                } else {
                    this.deleteItem = true
                    this.headerRight = false
                    this.heightChange = document.querySelector(".outwrapper").clientHeight - 94
                }
            },
            //添加数据
            addItem(item) {
                this.item = item
                this.name = ""
                this.discountYes = true
                this.discountNo = false
                if (item.code.split(".").length >= 5) {
                    this.$vux.toast.text("类别最多为5级")
                    return
                } else {
                    this.checkWorkingConditionConfigurationUsing(item.id)
                }
            },
            //取消新建
            cancleNew() {
                this.level = false
                this.popup = false
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
                                if (this.item.children) {
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
                if (this.discountYes) {
                    params.enableDepreciation = true
                } else {
                    params.enableDepreciation = false
                }
                if (Z_IsEmpty20(this.item)) {
                    params.parentId = "0"
                } else {
                    params.parentId = this.item.id
                }
                this.$http.post("/zingbiz/fixedAssets/configuration/addWorkingConditionConfiguration",params).then((res) => {
                    if (res.data.success) {
                        this.$vux.toast.text("添加成功")
                        this.popup = false
                        this.getAllWorkingConditionConfiguration()
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //修改数据
            editItem(item) {
                if (this.deleteItem || this.newItem) {
                    return
                } else {
                    this.$router.push({
                        path:"/fixMoneyMain/editUseState",
                        query:{
                            id:item.id,
                            code:item.code
                        }
                    })
                }
            },
            checkIcon(item) {
                //将数据保存
                if (item.check === false) {
                    this.deleteData = {}
                } else {
                    this.deleteData = item
                }
            },
            //处理数据
            deleteTree() {
                //处理传来的数据
                if (JSON.stringify(this.deleteData) === "{}") {
                    this.$vux.toast.text("请选择要删除的方式")
                    return
                }
                //被引用的不能删除
                this.checkWorkingConditionConfigurationUsing(this.deleteData.id)
            },
            //确定删除
            onConfirm() {
                this.$http.post("/zingbiz/fixedAssets/configuration/deleteWorkingConditionConfiguration",{
                    id:this.deleteData.id
                }).then((res) => {
                    if (res.data.success) {
                        let that = this
                        window.setTimeout(function () {
                            that.$vux.toast.text(res.data.mgs)
                            that.show = false
                            that.getAllWorkingConditionConfiguration()
                        },1000)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            DiscountY() {
                this.discountYes = true
                this.discountNo = false
                this.borderColor = "#c9c9c9"
                this.defalueColor = "#40affc"
            },
            DiscountN() {
                this.discountYes = false
                this.discountNo = true
                this.borderColor = "#40affc"
                this.defalueColor = "#c9c9c9"
            },
            increaseFirst () {
                this.popup = true
                this.level = true
            },
            onHide() {
                this.level = false
            },
            //获取使用状态
            getAllWorkingConditionConfiguration () {
                this.$http.get("/zingbiz/fixedAssets/configuration/getAllWorkingConditionConfiguration",{

                }).then((res) => {
                    this.theData = res.data.data
                })
            },
            //判断使用状态是否被使用
            checkWorkingConditionConfigurationUsing(id) {
                this.$http.post("/zingbiz/fixedAssets/configuration/checkWorkingConditionConfigurationUsing",{
                    id:id
                }).then((res) => {
                    if (!res.data.data.hasUsed) {
                        if (this.deleteItem) {
                           this.show = true
                        } else {
                            this.popup = true
                        }
                    } else {
                        this.$vux.toast.text("使用状态被使用")
                    }
                })
            }
        }
    }
</script>
<style>
    .editstate .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .editstate .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .editstate .weui-cell__bd{
        font-family: Arial;
        color: rgba(136, 136, 136, 1) !important;
        font-size: 14px !important;
    }
    .editstate .star .weui-cell__hd:before
    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 50px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .discount {
            &-title{
                font-size 14px
            }
            font-size 14px
            position relative
            height 44px
            line-height 44px
            padding-left 13px
            border-top 1px solid #f5f5f5
            &-content{
                position absolute
                right 13px
            }
            &-changeY{
                margin-right 10px
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
            &-changeN{
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
        }
        .radioed{
            box-sizing: border-box;
            content: ''
            display inline-block
            position  absolute
            width 12px
            height 12px
            border-radius 6px
            left 50%
            top 50%
            transform translate(-50%,-50%)
            background-color #40affc
        }
    }
    .title{
        height 40px
        line-height 40px
        text-align center
        background-color white
        font-size 16px
    }
    .inner{
        font-size 16px
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
    .increaseFirst{
        position relative
        margin-left 13px
        line-height 3
        .circle{
            transform translateY(25%)
        }
    }
</style>
