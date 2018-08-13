<template>
    <div class="outwrapper">
        <ZingHead title="核算项目" :isComeBack="false" @doSome="cancle()">
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
        <scroll :observeDOM="true" class="list-warp">

            <cast-flow-tree :data="theData"
                  :newItem="newItem"
                  :deleteItem="deleteItem"
                  :deleteArray="deleteArray"
                  @addItem="addItem"
                  @editItem="editItem"
                  @deleteItem="deleteItem"
                  @checkIcon="checkIcon"></cast-flow-tree>
        </scroll>
        <x-button type="primary" class="btn-common" v-show="deleteItem" @click.native="deleteTree()">删除</x-button>
        <popup position="top" v-model="popup" @on-hide = "onHide" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <div class="initFrom">
                <div class="initFrom-title">新建</div>
                <group>
                    <x-input title="代码" class="fileId" v-model="fileId"></x-input>
                    <x-input title="名称" placeholder="请输入名称" class="text" v-model="text"></x-input>
                    <x-input title="助记码" placeholder="请输入助记码" class="mnemonicCode" v-model="mnemonicCode"></x-input>

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
    import Tree from "../../fixMoney/template/Tree";
    import { Z_IsEmpty20 } from '../../../utils/fn'
    import { Popup,Group,XInput,XTextarea,Selector,Flexbox,FlexboxItem,XButton,Confirm } from 'vux'
    import CastFlowTree from "../report-components/castFlow-tree";
    export default {
        name: "hesuanxiangmu",
        components:{
            CastFlowTree,
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
                mnemonicCode:"",
                fileId:"CI1",
                text:"",
                abstract:"",
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
            }
        },
        watch: {

        },
        created() {
            this.getCashFlowProject()
        },
        methods:{
            handleMenu(data) {
                this.newItem = false
                this.deleteItem = false
                if (data.content === "新建") {
                    this.newItem = true
                    this.headerRight = false
                } else {
                    this.deleteArray = []
                    this.deleteItem = true
                    this.headerRight = false
                }
            },
            //返回事件
            cancle() {
                if (this.newItem === false && this.deleteItem === false) {
                    this.$router.back(-1)
                } else {
                    this.newItem = false
                    this.deleteItem = false
                    this.headerRight = true
                }
            },
            //添加子集 判断类别是否被使用 类别被使用不允许添加 是否为最后一级 左后一级不予许添加 不可跨级添加
            addItem (item) {
                this.item = item
                this.fileId = item.fileId
                this.text = "";
                this.mnemonicCode = "";
                if (item.fileId.split(".").length >= 5) {
                    this.$vux.toast.text("类别最多为5级")
                    return
                } /*else {
                    this.checkCastFlowProjectUsing(item.rowId)
                }*/
              if (this.deleteItem) {
                this.show = true
              } else {
                this.popup = true
              }
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

                let idArr = this.item.fileId.split(".").slice(0,this.item.fileId.split(".").length)
                let codeArr = this.fileId.split(".").slice(0,this.fileId.split(".").length - 1)
                let number = this.fileId.split(".")[this.fileId.split(".").length - 1]
                if (this.item.fileId.split(".").length + 1 === this.fileId.split(".").length) {
                    //代码范围判断及输入的格式
                    if (/^(?!0{3})\d{3}$/.test(number)) {
                        //父元素判断
                        if (idArr.toString() === codeArr.toString()) {
                            //是否有重复的子元素
                            if (!Z_IsEmpty20(this.item.children)) {
                                this.item.children.forEach( val => {
                                    if (this.fileId === val.fileId) {
                                        this.repeat = true
                                    }
                                })
                            }
                            if (this.repeat) {
                                this.$vux.toast.text("不可以重复添加")
                                return
                            } else {
                                //代码赋值
                                params.fileId = this.fileId
                            }
                        } else {
                            this.$vux.toast.text("父级必须为" + this.item.fileId)
                            return
                        }
                    } else {
                        this.$vux.toast.text("请输入正确的代码格式")
                        return
                    }
                } else {
                    this.$vux.toast.text("请正确输入代码")
                    return
                }


                if (Z_IsEmpty20(this.item)) {
                    params.parentId = "0"
                } else {
                    params.parentId = this.item.rowId
                }
                if (this.text) {
                    params.text = this.text
                } else {
                    this.$vux.toast.text("请输入名称")
                    return
                }
                if (this.mnemonicCode) {
                    params.mnemonicCode = this.mnemonicCode
                }

                this.$http.post("/zingbiz/report/finance_report/insertCashFlowProject",params).then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        this.$vux.toast.text("添加成功")
                        this.popup = false
                        this.getCashFlowProject()
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
                } else if (item.isdel === 'false') {
                    this.$vux.toast.text("不允许修改");
                } else {
                    this.$router.push({
                        path:"castFlowEditer",
                        query:{
                            id:item.rowId,
                            fileId:item.fileId
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
                if (this.deleteData.children) {
                    this.$vux.toast.text("项目下有子集，无法删除！")
                    return
                }
                if (this.deleteData.length === 0) {
                    this.$vux.toast.text("请选择现金流量代码！");
                    return;
                }
                this.checkCastFlowProjectUsing(this.deleteData);
            },
            //确认删除的数据
            onConfirm() {

                this.$http.post("/zingbiz/report/finance_report/deleteCashFlowProject",{
                    rowId:this.deleteData.rowId
                }).then((res) => {
                    if (res.data.success) {
                        let that = this
                        window.setTimeout(function () {
                            that.$vux.toast.text(res.data.mgs)
                            that.show = false;
                            that.deleteData = [];
                            that.getCashFlowProject()
                        },1000)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            onHide() {
                this.level = false
            },
            //获取现金流量
            getCashFlowProject () {
                this.$http.post("/zingbiz/report/finance_report/getCashFlowProject",{

                }).then((res) => {
                    this.theData = res.data.data
                })
            },
            //判断现金流量项目是否被使用
            checkCastFlowProjectUsing(data) {
              let param = {};
              if (data.recordType === 'cashflow') {
                param.cash_RowId = data.rowId;
              } else if (data.recordType === 'attachForm') {
                param.attForm_RowId = data.rowId;
              }
                this.$http.post("/zingbiz/report/finance_report/getCashFlowProjectStreamByTrem",param).then((res) => {
                    if (res.data.data.length === 0) {
                        if (this.deleteItem) {
                            this.show = true
                        } else {
                            this.popup = true
                        }
                    } else {
                        this.$vux.toast.text("项目已被使用，无法删除！")
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
    .initFrom  .weui-cell__hd:before,
    .initFrom  .weui-cell__hd:before
    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 50px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .initFrom  .weui-cell__hd:before{
        left: 80px;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .list-warp{
            height calc(100%-100px)
        }
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

</style>
