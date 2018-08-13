<template>
    <div class="autoAccount">
        <div class="inner" v-show="inner">
            <ZingHead title="自动对账">
                <div slot="header-right">
                <span class="header-jiahao">
                    <dropdown :data="list" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
                </div>
            </ZingHead>
            <div class="autoAccount-content">
                <div class="subject-name">科目方案名称</div>
                <scroll
                    class="subject-inner"
                    :data="autoData"
                >
                    <GridCard v-for="(item,index) in autoData" :key="index">
                        <div slot="cardLeft" class="left">
                        <span class="circle" @click="circleSolid(item,index)">
                            <span :class ="{circleSolid:item.solid}"></span>
                        </span>
                            <div class="left-wrapper">
                                <p class="left-wrapper-title">{{item.name}}</p>
                            </div>
                        </div>
                        <div slot="cardRight" class="right">
                            <i class="iconfont icon-gengduo" @click="more(item)"></i>
                        </div>
                    </GridCard>

                    <group class="check">
                        <checklist :options="commonList" v-model="value"></checklist>
                        <datetime
                            class="check-date"
                            title="会计期间"
                            v-model="dataTime"
                            format="YYYY-MM"
                            placeholder="请输入会计期间"
                            @on-change="change"
                            :display-format="formatValueFunction"
                        ></datetime>
                    </group>
                </scroll>
            </div>
            <div>
                <flexbox class="inner">
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-save" @click.native="cancle()">取消</x-button>
                    </flexbox-item>
                    <flexbox-item class="interspace">
                        <x-button type="primary" class="btn-common" @click.native="search()">查询</x-button>
                    </flexbox-item>
                </flexbox>
            </div>

        </div>

        <!--删除和编辑页面-->
        <popup v-model="show" position="top" :popup-style="{top: 40 + '%',width:80 + '%',margin: 10 + '%','overflow-y': 'auto'}">
            <ul class="choose">
                <li @click="edit()">编辑</li>
                <li @click="deleteItem()">删除</li>
            </ul>
        </popup>

        <!--确认删除弹窗-->
        <confirm v-model="show1"
                 title="提示"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm"
                >
            <p>确定删除</p>
        </confirm>

        <searchAutoAccount
            v-if="searchAuto"
            @doSome="doSome"
            :params="params"
        ></searchAutoAccount>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import Dropdown from "@/components/dropdown/Dropdown";
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import searchAutoAccount from "../template/searchAutoAccount";
    import { Group,XInput,Flexbox,FlexboxItem,XButton,Checklist,Datetime,Popup,Confirm } from 'vux'
    export default {
        name: "auto-account",
        components:{
            ZingHead,
            Dropdown,
            GridCard,
            scroll,
            Group,
            XInput,
            Flexbox,
            FlexboxItem,
            XButton,
            Checklist,
            Datetime,
            Popup,
            Confirm,
            searchAutoAccount
        },
        data() {
            return {
                list:[
                    {
                        content:"新建方案",url:"newCase"
                    }
                ],
                autoData:[],
                commonList:["包括未过账凭证"],
                dataTime:"",
                show:false,
                show1:false,
                searchAuto:false,
                inner:true,
                params:{},
                value:"",
                item:{}
            }
        },
        created() {
            this.selectName()
        },
        methods:{
            //获取方案名称
            selectName() {
                this.$http.get("/zingbiz/fixedAssets/schemeSetting/selectName",{

                }).then((res) => {
                    if (res.data.success) {
                        this.autoData = []
                        res.data.data.forEach((val,index) => {
                            if (index === 0) {
                                this.autoData.push(
                                    Object.assign( {}, val, {
                                        solid : true
                                    })
                                )

                            } else {
                                this.autoData.push(
                                    Object.assign( {}, val, {
                                        solid : false
                                    })
                                )
                            }
                        })
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //实现单选
            circleSolid(item) {
                this.autoData.forEach((val) => {
                    this.$set(val, "solid", false);
                })
                this.$set(item, "solid", !item.solid);
            },
            //格式化日期
            formatValueFunction(val) {
                return val.split("-")[0] + "年" + parseInt(val.split("-")[1]) + "期"
            },
            //新建方案
            handleMenu(data) {
                if (data.url) {
                    this.$router.push({
                        path:data.url,
                        query:{
                            handle:"add",
                            type:"reconciliation"
                        }
                    })
                }
            },
            //编辑和删除
            more(item) {
                this.autoData.forEach((val) => {
                    this.$set(val, "solid", false);
                })
                this.$set(item, "solid", !item.solid);
                this.item = item
                this.show = true
            },
            //编辑进入详情
            edit() {
                this.$router.push({
                    path:"newCase",
                    query:{
                        handle:"update",
                        id:this.item.id,
                        type:"reconciliation"
                    }
                })
            },
            //删除
            deleteItem() {
                this.show = false
                this.show1 = true
            },
            //确认删除
            onConfirm() {
                this.show1 = false
                this.delete()
            },
            delete() {
                this.$http.get("/zingbiz/fixedAssets/schemeSetting/delete/" + this.item.id,{
                }).then((res) => {
                    if (res.data.success) {
                        let that = this
                      window.setTimeout(function () {
                          that.$vux.toast.text("删除成功")
                          that.selectName()
                      },2000)
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }
                })
            },
            //取消
            cancle () {
                this.$router.go(-1)
            },
            //查询
            search() {
                if (this.autoData.length === 0) {
                    this.$vux.toast.text("请新建方案")
                    return
                }
                if (this.dataTime === "") {
                    this.$vux.toast.text("请输入会计期间")
                    return
                } else {
                    this.params.period = this.dataTime
                }

                this.autoData.forEach((val) => {
                    if (val.solid) {
                        this.params.name = val.id
                    }
                })
                if (this.value.length !== 0) {
                    this.params.isGZ = true
                }
                this.inner = false
                this.searchAuto = true
                //请求数据将请求回来的数据给他
                // this.$router.push({
                //     path:"searchAutoAccount",
                //     query:{
                //
                //     }
                // })
            },
            doSome() {
                this.inner = true
                this.searchAuto = false
            }
        }
    }
</script>
<style>
    .check .vux-datetime p:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 85px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .autoAccount{
        height 100%
        .inner{
            height 100%
            .autoAccount-content{
                height calc(100% - 94px)
            }
        }

    }
    .subject-inner{
        height calc(100% -50px)
        overflow auto
    }
    .circle{
        position relative
        display inline-block
        width: 24px;
        height: 24px;
        border-radius 12px
        border 1px solid
    }
    .circleSolid{
        position absolute
        top: 50%
        left 50%
        transform translate(-50%,-50%)
        height 12px
        width 12px
        border-radius 6px
        background-color black
    }
    .subject-name{
        padding 12px 13px
        border 1px solid #f5f5f5
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        font-family: Arial;
    }
    .subject-name:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 115px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
    .check{
        position relative
        border-top 18px solid #f5f5f5
    }
    .choose{
        background-color white
        text-align center
        li{
            height 35px
            line-height 35px

        }
    }
    .choose li:first-child{
        border-bottom 1px solid #f5f5f5

    }

</style>
