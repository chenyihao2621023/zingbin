<template>
    <div class="resourceDinnerM" style="height: 100%">
        <zing-head :popupPickerData="filterClazzList" :popupTitle="popupTitle" @popup-change="changeClazz">
            <!--<div slot="header-left" class="dmHead">
                <selector :options="filterClazzList"
                          v-model="defaultClazz" @on-change="changeClazz"></selector>
            </div>-->
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="hideSearch('icon')"></i>
                </span>
                <dropdown :data="dropDownMenu" trigger="click" placement="bottomRight" @item-click="handleMenu">
                    <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                        <span class="header-jiahao">
                            <i class="iconfont icon-gengduo"></i>
                        </span>
                    </a>
                </dropdown>
            </div>
        </zing-head>
         <div v-show="isShowSearch">
            <search
                class="search"
                @on-cancel="hideSearch"
                @on-change="getResultSearch"
                @on-submit="onSubmitSearch"
                ref="dinnerSearch"></search>
        </div>
         <!--<search
            ref="search"
            class="search"
            :searchFlag="isShowSearch"
            @cancelInput ="hideSearch"
            @confirmInput="onSubmitSearch"
         ></search>-->
        <div>
            <tab>
                <tab-item selected @on-item-click="switchTab('1')">出售中</tab-item>
                <tab-item @on-item-click="switchTab('0')">已下架</tab-item>
            </tab>
        </div>
        <div class="scroll-list-wrap" :style="{ height: 'calc(100% - 95px)',overflow:'auto' }">
            <!--<scroll ref="scroll" :data="[]" :scrollbar="true" :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }"
                    :startY="0" @pullingUp="onPullingUp">-->
                <div v-if="dinnerList.length > 0 ">
                    <div v-for="(clazzItem,clazzIndex) in clazzDataList" :key="clazzIndex">
                        <div v-if="clazzItem.hasDinner && !isShowSearch" @click="clazzSelect(clazzItem,showBatchMenu,clazzIndex,$event)">
                            <h1 class="title">{{clazzItem.dinnerClazzName}}</h1>
                            <div v-if="showBatchMenu" style="text-align: right;margin-top: -27px;padding-right: 13px;">
                                <check-icon class="checkIcon" :value.sync="clazzItem.checkIconf"></check-icon>
                            </div>
                        </div>
                        <GridCard v-if="clazzItem.dinnerClazzId === item.dinnerClazzId && item.isShow" class="gridCard" v-for="(item,index) in dinnerList" :key="index"
                                  @click.native="batchSelect(item,index,showBatchMenu,$event)">
                            <div slot="cardLeft" class="left" style="width: 80%;">
                                <avatar class="imgLeft" shape="square" size="large" :src="item.dinnerImg"></avatar>
                                <div class="left-wrapper">
                                    <p class="m5 left-wrapper-title" style="cursor: pointer;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                        {{item.dinnerName}}
                                    </p>
                                    <p class="m5 left-wrapper-desc" style="color:#888888 !important;">描述：{{item.dinnerDescribe}}</p>
                                    <p class="m5 left-wrapper-desc" style="color:#888888 !important;">价格：{{item.dinnerPriceMin}}</p>
                                    <!--<p class="m5 left-wrapper-desc">库存：暂无</p>-->
                                </div>
                            </div>
                            <div slot="cardRight" class="right" style="width: 20%;">
                                <i v-show="!showBatchMenu" class="iconfont icon-gengduo" @click="showMoreModal(item)"></i>
                                <div v-if="showBatchMenu">
                                    <!--<input type="checkbox" name="checkbox1" @click="batchSelect(item,$event)">-->
                                    <check-icon class="checkIcon" :value.sync="item.checkIconf"></check-icon>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                </div>
                <ul v-else>
                    <div class="no-data-style">
                        还没菜品信息
                    </div>
                </ul>
            <!--</scroll>-->
        </div>
        <x-dialog v-model="menuDialog" hide-on-blur>
            <div class="menu" @click="editTheObj">编辑菜品</div>
            <div class="menu" v-show="targetDinner.dinnerStatus == '0'" @click="deleteTheObj">删除菜品</div>
            <div v-show="targetDinner.dinnerStatus == '0'" @click="setOnOffSale('1')" class="menu">上架</div>
            <div v-show="targetDinner.dinnerStatus == '1'" @click="setOnOffSale('0')" class="menu">下架</div>
        </x-dialog>
        <div v-show="showBatchMenu" class="batchFootMenu" :style="isPc?{padding:'0px'}:{}">
            <button-tab>
                <button-tab-item class="borderTB" @on-item-click="selectClazz">分类至</button-tab-item>
                <button-tab-item class="borderTB" v-show="switchTabFlag ==='0'" @on-item-click="batchDelete">删除</button-tab-item>
                <button-tab-item class="borderTB" v-show="switchTabFlag ==='0'" @on-item-click="batchSetOnOff('1')">上架</button-tab-item>
                <button-tab-item class="borderAll" v-show="switchTabFlag ==='1'" @on-item-click="batchSetOnOff('0')">下架</button-tab-item>
                <button-tab-item class="borderAll" @on-item-click="cancelFun">取消</button-tab-item>
            </button-tab>
        </div>
        <!--引用组件集-->
        <div class="components dinnerAdd">
            <dinner-add-edit v-show="showEditModal" @closeMethod="showEditModal = false;pageNumber = 0;initAllDinner()" :dinnerItem="transObj"></dinner-add-edit>
            <select-clazz :showSelectClazz="showSelectClazzModal" :clazzData="clazzDataList" @selected="confirmSelectClazz" @cancel="cancelSelectClazz"></select-clazz>
        </div>
    </div>
</template>

<script>
    import { Tab, Selector, TabItem,XDialog,ButtonTab, ButtonTabItem,CheckIcon,Search   } from "vux";
    /*import search from '@/components/search/search';*/
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";
    import Dropdown from '@/components/dropdown/Dropdown';
    import Avatar from "@/components/avatar/Avatar";
    import dinnerAddEdit from "@/container/dinner/dinnerManage/dinnerAddEdit";
    import SelectClazz from "@/container/dinner/components/SelectClazz";
    import { isPc,getThumbUrl } from '@/utils/fn'

    export default {
        name: "dinnerManage",
        components: {
            Scroll, GridCard, Avatar, ZingHead, Tab, TabItem, Selector,XDialog,Dropdown,
            ButtonTab, ButtonTabItem,dinnerAddEdit,SelectClazz,CheckIcon,Search
        },
        data: () => ({
            //搜索
            isShowSearch:false,
            searchData:"",
            isPc:isPc(),
            popupTitle:'全部分类',
            dinnerTotal:0,
            screenHeight:0,
            dropDownMenu: [{ content: "添加菜品", url: "" }, { content: "批量管理" }],
            defaultClazz: "0",
            clazzDataList:[],
            clazzIdForSearch:"",
            dinnerList: [],
            switchTabFlag:"1",
            targetDinner: {},
            menuDialog: false,
            showBatchMenu : false,
            showSelectClazzModal:false,
            batchSelectedObj:{},
            showEditModal:false,
            pageNumber:0,
            transObj:{
                clazzData : [],
                type:"add",
            },
        }),
        computed:{
            filterClazzList() {
                let filterArr = [{ value: "0", name: "所有分类",parent: 0 }];
                this.clazzDataList.forEach(item => {
                    let dat = {};
                    dat.value = item.dinnerClazzId;
                    dat.name = item.dinnerClazzName;
                    dat.parent = 0;
                    filterArr.push(dat);
                });
                return filterArr;
            }
        },
        watch: {
            searchData:{
                handler(curVal,oldVal) { //
                    let curValList = curVal.toUpperCase().split("")
                    for (let i = 0; i < this.dinnerList.length; i++) {
                        this.dinnerList[i].isShow = true
                        if (this.dinnerList[i].dinnerName.indexOf(curVal) < 0) {
                            let notes = false
                            let dinnerInitialList = this.dinnerList[i].dinnerInitial.split(" ")
                            let dinnerInitialStr = dinnerInitialList.join("")
                            if (dinnerInitialList.length >= curValList.length) {
                                for (let j = 0; j < curValList.length; j++) {
                                    let index = dinnerInitialStr.indexOf(curValList[j])
                                    if (curValList.length >= 2 && j <= (curValList.length - 2)) {
                                        let indexB = dinnerInitialStr.indexOf(curValList[j+1])
                                        if (index < 0 || indexB < 0 || index !== (indexB - 1)) {
                                            notes = true
                                            break
                                        }
                                    } else if (index < 0) {
                                        notes = true
                                        break
                                    }
                                }
                                if (notes) {
                                    this.dinnerList[i].isShow = false
                                    this.$set(this.dinnerList,i,this.dinnerList[i])
                                }
                            } else {
                                this.dinnerList[i].isShow = false
                                this.$set(this.dinnerList,i,this.dinnerList[i])
                            }
                        }
                    }
                },
                deep:true
            },
        },
        created() {
            this.screenHeight = document.documentElement.clientHeight - 145;
            this.pageNumber = 0
            this.initClazz();
        },
        methods: {
            initClazz() {
                let self = this;
                let url = "/zingbiz/dinner/getDinnerClazzList";
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                this.$http
                    .get(url, { params: param })
                    .then(res => {
                        if (res.data.success) {
                            if(res.data.data.data) {
                                self.clazzDataList = res.data.data.data;
                                this.initAllDinner();
                            }
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            switchTab(flag) {
                this.showBatchMenu = false; //切换tab时退出批量管理
                this.switchTabFlag = flag;
                this.pageNumber = 0
                this.initAllDinner();
            },
            initAllDinner(pageNumber) {
                let self = this;
                let url = "/zingbiz/dinner/getDinnerList";
                let param = {
                    //分页
                    /*pageNumber:pageNumber ? pageNumber : 0,
                    pageSize:10,*/
                    pageNumber:0,
                    pageSize:5000,
                    dinnerStatus:this.switchTabFlag,
                    dinnerClazzId :this.clazzIdForSearch
                };
                self.$vux.loading.show({
                    text: '正在加载...'
                })
                this.$http
                    .get(url, { params:param })
                    .then(res => {
                        self.$vux.loading.hide()
                        if (res.data.success) {
                            if (res.data.data.data) {
                                self.dinnerTotal = res.data.data.total
                                let clazzIds = []
                                res.data.data.data.forEach(item => {
                                    item.dinnerImg = getThumbUrl(item.dinnerImg, 100, 100, "/ZingVue/static/images/ysImg.png", false)
                                    item.isShow = true
                                    item.checkIconf = false
                                    item.dinnerPriceMin = parseFloat(item.dinnerPriceMin).toFixed(2)
                                    if (clazzIds.join(" ").indexOf(item.dinnerClazzId) < 0) {
                                        clazzIds.push(item.dinnerClazzId)
                                    }
                                })
                                self.clazzDataList.forEach(clazz => {
                                    clazz.hasDinner = false
                                    if (clazzIds.join(" ").indexOf(clazz.dinnerClazzId) >= 0) {
                                        clazz.hasDinner = true
                                        clazz.checkIconf = false
                                    }
                                })
                                self.dinnerList = res.data.data.data;
                            }
                            /*if (pageNumber) { //分页暂不使用
                                res.data.data.data.forEach(item => {
                                    self.dinnerList.push(item)
                                })
                            } else {
                                self.dinnerList = res.data.data.data;
                            }*/
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        console.log("error===>",error)
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                    })
            },
            /* 搜索方法 */
            hideSearch(icon) {
                if (icon === "icon") {
                    this.isShowSearch = !this.isShowSearch
                } else {
                    this.isShowSearch = false
                }
                for (let i = 0; i < this.dinnerList.length; i++) {
                    this.dinnerList[i].isShow = true
                }
            },
            getResultSearch(val) { //搜索输入
                let item = val.replace(/ /g,'')
                this.searchData = item
            },
            onSubmitSearch() {  //搜索提交

            },

            cancelFun() {
                this.showBatchMenu = false
                this.dinnerList.forEach(item => {
                    item.checkIconf = false
                })
                this.clazzDataList.forEach(item => {
                    item.checkIconf = false
                })
            },

            handleMenu(data) {
                if (data.content === "批量管理") {
                    this.showBatchMenu = true;
                    this.dinnerList.forEach(item => {
                        item.checkIconf = false
                    })
                    this.clazzDataList.forEach(item => {
                        item.checkIconf = false
                    })
                    this.batchSelectedObj = {};     //清空批量选择过的内容
                } else if (data.content === "添加菜品") {
                    this.addDinner();
                }
            },
            addDinner() {
                this.$set(this.transObj,"type","add")
                this.$set(this.transObj,"clazzData",this.clazzDataList)
                this.$set(this.transObj,"dinnerData",{})
                this.showEditModal = true;
            },
            changeClazz(key) {
                if (key[0] === 0 || key[0] === "0") {
                    this.popupTitle = "全部分类"
                    this.clazzIdForSearch = "";
                } else {
                    this.clazzDataList.forEach(item => {
                        if(item.dinnerClazzId === key[0]) {
                            this.popupTitle = item.dinnerClazzName;
                        }
                    });
                    this.clazzIdForSearch = key[0]
                }
                this.pageNumber = 0
                this.initAllDinner();
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    //分页逻辑，暂时去掉
                    /*let pageN = parseInt(this.dinnerList.length/10)
                    if (pageN > this.pageNumber) {
                        this.pageNumber = pageN
                        this.initAllDinner(pageN)
                    }*/
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            showMoreModal(item) {
                this.targetDinner = Object.assign({},item);
                this.menuDialog = true;
            },
            //单个删除
            deleteTheObj() {
                let self = this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定删除此菜品吗?',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/delDinner";
                        let param = {
                            dinnerIds : self.targetDinner.dinnerId,
                        };
                        self.$vux.loading.show({
                            text: ''
                        })
                        self.$http
                            .get(url, { params : param })
                            .then(res => {
                                self.$vux.loading.hide()
                                if (res.data.success) {
                                    self.$vux.toast.show({ text:"删除成功", type:"success" });
                                    this.pageNumber = 0
                                    self.initAllDinner();
                                } else {
                                    self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                                }
                            })
                            .catch(error => {
                                self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                            })
                    }
                });
                this.menuDialog = false;
            },
            //单个编辑
            editTheObj() {
                let item = this.targetDinner;
                this.$set(this.transObj,"type","edit")
                this.$set(this.transObj,"clazzData",this.clazzDataList)
                this.$set(this.transObj,"dinnerData",item)

                this.showEditModal = true;
                this.menuDialog = false;
            },
            //单个上下架
            setOnOffSale(flag) {
                let self = this;
                let mas = "上架"
                if (flag === "0") {
                    mas = "下架"
                }
                let param = {
                    dinnerIds : this.targetDinner.dinnerId,
                    dinnerStatus :flag
                };
                let url = "/zingbiz/dinner/upOrDownDinner";
                this.$http
                    .get(url, { params : param })
                    .then(res => {
                        if (res.data.success) {
                            self.$vux.toast.show({ text:mas + "成功", type:"success" });
                            this.pageNumber = 0
                            self.initAllDinner();
                        } else {
                            self.$vux.toast.show({ text:mas + "失败", type:"cancel" })
                        }
                    }).catch(error => {
                        self.$vux.toast.show({ text:mas + "失败", type:"cancel" })
                });
                this.menuDialog = false;
            },
            /**批量选择*/
            batchSelect(item,index,showBatchMenu,e) {
                if (!showBatchMenu) {
                    return false
                }
                item.checkIconf = e.target.className.indexOf("weui-icon") >= 0 ? item.checkIconf : !(item.checkIconf)
                this.$set(this.dinnerList,index,item)
                let flag = item.checkIconf;
                if (flag) {
                    this.batchSelectedObj[item.dinnerId] = item;
                } else {
                    delete this.batchSelectedObj[item.dinnerId];
                }
            },
            clazzSelect(clazz,showBatchMenu,index,event) {
                if (!showBatchMenu) {
                    return false
                }
                clazz.checkIconf = event.target.className.indexOf("weui-icon") >= 0 ? clazz.checkIconf : !(clazz.checkIconf)
                this.$set(this.clazzDataList,index,clazz)
                let flag = clazz.checkIconf;
                this.dinnerList.forEach(dinner => {
                    if (flag) {
                        if (dinner.dinnerClazzId === clazz.dinnerClazzId) {
                            dinner.checkIconf = true
                            this.batchSelectedObj[dinner.dinnerId] = dinner;
                        }
                    } else {
                        if (dinner.dinnerClazzId === clazz.dinnerClazzId) {
                            dinner.checkIconf = false
                            delete this.batchSelectedObj[dinner.dinnerId];
                        }
                    }
                })
            },
            /**批量分类至 start*/
            selectClazz() {
                let self = this;
                if (!self.filterSelectObj()) {
                    self.$vux.toast.text("请至少选择一个菜品", 'bottom');
                    return;
                }
                this.showSelectClazzModal = true;
            },
            //确定移动分类至
            confirmSelectClazz(obj) {
                this.showSelectClazzModal = false;
                //this.showBatchMenu = false;

                let self = this;
                let param = {
                    dinnerIds : this.filterSelectObj(),
                    dinnerClazzId :obj.dinnerClazzId,
                };
                let url = "/zingbiz/dinner/moveToAnotherClazz";
                self.$vux.loading.show({
                    text: ''
                })
                this.$http
                    .get(url, { params : param })
                    .then(res => {
                        self.$vux.loading.hide()
                        if (res.data.success) {
                            self.$vux.toast.show({ text:"移动成功", type:"success" });
                            this.pageNumber = 0
                            self.batchSelectedObj = {}
                            self.initAllDinner();
                        } else {
                            self.$vux.toast.show({ text:"移动失败", type:"cancel" })
                        }
                    }).catch(error => {
                        self.$vux.toast.show({ text:"移动失败", type:"cancel" })
                });

            },
            cancelSelectClazz(obj) {
                this.showSelectClazzModal = false;
                //this.showBatchMenu = false;
            },
            /**批量分类至 end*/
            /**批量删除*/
            batchDelete() {
                let self = this;
                if (!self.filterSelectObj()) {
                    self.$vux.toast.text("请至少选择一个菜品", 'bottom');
                    return;
                }
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定删除选中的菜品吗?',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/delDinner";
                        let param = {
                            dinnerIds : self.filterSelectObj(),
                        };
                        self.$vux.loading.show({
                            text: ''
                        })
                        self.$http
                            .get(url, { params : param })
                            .then(res => {
                                self.$vux.loading.hide()
                                if (res.data.success) {
                                    self.$vux.toast.show({ text:"删除成功", type:"success" });
                                    this.pageNumber = 0
                                    self.showBatchMenu = false;
                                    self.initAllDinner();
                                } else {
                                    self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                                }
                            })
                            .catch(error => {
                                self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                            })
                    }
                });
            },
            /**批量上下架*/
            batchSetOnOff(flag) {
                let self = this;
                let title = "";
                if (flag === "1") {
                    title = "上架";
                } else if (flag === "0") {
                    title = "下架";
                }
                if (!self.filterSelectObj()) {
                    self.$vux.toast.text("请至少选择一个菜品", 'bottom');
                    return;
                }
                this.$vux.confirm.show({
                    title: '提示',
                    content: "确定" + title + "选中的菜品吗?",
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/upOrDownDinner";
                        let param = {
                            dinnerIds : self.filterSelectObj(),
                            dinnerStatus:flag
                        };
                        self.$vux.loading.show({
                            text: ''
                        })
                        self.$http
                            .get(url, { params :param })
                            .then(res => {
                                self.$vux.loading.hide()
                                if (res.data.success) {
                                    self.$vux.toast.show({ text: title + "成功", type:"success" });
                                    self.pageNumber = 0
                                    self.showBatchMenu = false;
                                    self.batchSelectedObj = {}
                                    self.initAllDinner();
                                } else {
                                    self.$vux.toast.show({ text:title + "失败", type:"cancel" })
                                }
                            })
                            .catch(error => {
                                self.$vux.toast.show({ text:title + "失败", type:"cancel" })
                            })
                    }
                });
            },
            /**转换批量选中的商品id，空格分开*/
            filterSelectObj() {
                let selected = this.batchSelectedObj;
                let ids = [];
                Object.keys(selected).forEach(id => {
                    ids.push(id);
                });
                if (ids.length) {
                    return ids.join(" ");
                }
               return false;
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .menu {
        min-height: 40px;
        line-height: 40px;
    }
    .search{
        position: relative !important
    }
    .gridCard {
        height: 100px;

        .imgLeft {
            height 80px;
            width: 80px
        }
        .left-wrapper {
            height: 80px;
            width: 50%;
        }
        .m5 {
            margin-bottom 15px;
        }

    }
    .batchFootMenu{
        position absolute;
        width 100%;
        bottom:51px;
        padding: 5px;
        height:50px;
    }
    .vux-button-group > a.vux-button-tab-item{
        background: #fdfdfd;
        color: #999;
        border-right: 1px solid #bbecba;
    }
    .resourceDinnerM {
        height: 100%;
        .title {
            font-size: 16px;
            background: #EEEEEE;
            height: 30px;
            padding-top: 5px;
            padding-left: 15px;
        }
        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;
            .left {
                flex: 1;
                flex-center(row, start, center);
                .iconfont{
                    font-size 36px
                }
                &-wrapper {
                    margin-left: 10px;
                    flex: 1;
                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }
                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
            .right {
                flex: 1;
                text-align: right;

                .tag-wrapper {
                    margin-top: 10px;

                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-left {
                &-name {
                    margin-bottom: 10px;
                }
                &-tag-wrapper {
                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-right {
                align-self: flex-start;
            }
            .edit {
                min-height: 40px;
                line-height: 40px;
            }
        }
    }

    .vux-button-group>a.vux-button-tab-item-first:after {
        border: 1px solid #04be02 !important;
    }
    .vux-button-group>a.vux-button-tab-item-middle:after {
        border-top: 1px solid #04be02 !important;
        border-bottom: 1px solid #04be02 !important;
     }
    .vux-button-group>a.vux-button-tab-item-last:after {
        border: 1px solid #04be02 !important;
    }
    .no-data-style {
        margin-top: 20px;
        text-align: center;
        font-size: 18px;
        color: #ff8000;
    }
</style>
<style>
        .weui-search-bar__cancel-btn {
            color: #FF8000 !important;
        }
        .weui-dialog__btn_primary {
            color: #FF8000 !important;
        }
        .vux-popup-header-right {
            color: #FF8000 !important;
        }
</style>
