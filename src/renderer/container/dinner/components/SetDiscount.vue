<template>
    <div v-transfer-dom>
        <popup v-model="showDiscount" position="right" style="width: 100%;z-index: 511">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'设置折扣'" :show-bottom-border="false"
                          @on-click-left="cancelDiscount" @on-click-right="confirmDiscount">
            </popup-header>
            <div gutter="0">
                <group class="d-item">
                    <span class="itemTitle left">
                        <input type="radio" class="right rSize radio" @click="clickRadio('1',$event)" name="radio">
                    </span>
                    <span class="block">
                        <x-input class="pLeft" type="number" v-model="quotaVal" title="定额折扣:" :placeholder="'最大定额折扣为：'+totalMoney" ></x-input>
                    </span>
                </group>
                <group class="d-item">
                    <span class="itemTitle left">
                        <input type="radio" class="right rSize radio" @click="clickRadio('2',$event)" name="radio">
                    </span>
                    <span class="block">
                        <x-input class="pLeft" type="number" v-model="percentVal" title="比例折扣:" placeholder="输入折扣比例" >
                             <span slot="right">%</span>
                        </x-input>
                    </span>
                </group>
                <group class="d-item">
                    <span class="itemTitle left">
                        <input type="radio" class="right rSize radio clazzRadio" @click="clickRadio('3',$event)" name="radio">
                    </span>
                    <span class="block" style="line-height: 44px">
                        分类打折 <span class="left-wrapper-desc">以下分类参与打折</span>
                    </span>
                </group>
                <div v-if="discountType==='3' " class="m10" style="max-height: 280px;overflow: auto">
                    <group v-if="discountClazzIdStrs.indexOf(item.dinnerClazzId) >= 0 && dinnerClazzIdStrs.indexOf(item.dinnerClazzId) >= 0"
                           class="d-item" v-for="(item,index) in clazzList" :key="index" style="height: 44px">
                        <div class="flex">
                           <span class="itemTitle">
                                 <input class="clazzCheckbox rSize" type="checkbox">
                            </span>
                            <span class="clazzTitle">{{item.dinnerClazzName}}</span>
                            <span class="right line44">
                                <input class="inputVal clazzInput" type="number" :id="item.dinnerClazzId" min="0" max="100" placeholder="如:90">
                                %
                            </span>
                        </div>
                    </group>
                </div>
                <group class="d-item">
                    <span class="itemTitle left">
                        <input type="radio" class="right rSize radio" @click="clickRadio('4',$event)" name="radio">
                    </span>
                    <span class="block" style="line-height: 44px">
                        菜品打折 <span class="left-wrapper-desc">已点菜品列表</span>
                    </span>
                </group>
                <div v-if="discountType==='4' " class="m10" style="max-height: 280px;overflow: auto">
                    <group v-if="discountClazzIdStrs.indexOf(item.dinnerClazzId) >= 0 &&
                        dinnerClazzIdStrs.indexOf(item.dinnerClazzId) >= 0" class="d-item"
                           v-for="(item,index) in returnableCopy" :key="index" style="height: 44px">
                        <div class="flex">
                             <span class="itemTitle">
                                 <input class="dinnerCheckbox rSize" type="checkbox">
                            </span>
                            <span class="clazzTitle">{{item.dinnerName}}{{item.modelName ? "(" + item.modelName + ")" : ""}}</span>
                            <span class="right line44">
                                <input class="inputVal dinnerInput" :id="item.modelId" type="number" min="0" max="100" placeholder="如:90">
                                %
                            </span>
                        </div>
                    </group>
                </div>
                <div class="right" style="padding: 10px">
                    <x-button mini type="primary" @click.native="clearDiscount">清空优惠</x-button>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
    import { XInput,XButton,Group,PopupHeader,Popup,Cell,XSwitch,CellBox,TransferDomDirective as TransferDom } from "vux"
    export default {
        name :"SetDiscount",
        directives: {
            TransferDom
        },
        components:{
            XInput,Group,PopupHeader,Popup,Cell,XSwitch,CellBox,XButton
        },
        props:{
            showDiscount:{
                type: Boolean,
                default: function () {
                    return false
                }
            },
            returnable:{
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                clazzList:[],
                copyClazzList:[],
                discountType:0, //0 不打，1 定额，2 比例，3 分类，4 菜品
                percentVal:"",
                quotaVal:"",
                returnableCopy:[],
                totalMoney:0,
                dinnerClazzIdStrs:"",
                discountClazzIdStrs:"",
            }
        },
        watch:{
            //监听组件显示状态，重置数据
            showDiscount:function(isShow) {
                if (!isShow) {
                    this.showContent = false;
                }
            },
            returnable:function() {
                let ids = []
                this.returnableCopy = this.returnable.concat();
                this.totalMoney = 0
                for (let i = 0; i < this.returnable.length; i++) {
                    if (ids.join(" ").indexOf(this.returnable[i].dinnerClazzId) < 0) {
                        ids.push(this.returnable[i].dinnerClazzId)
                    }
                    this.totalMoney = parseFloat(this.returnable[i].orderAccounts) + this.totalMoney
                }
                this.dinnerClazzIdStrs = ids.join(" ")
            },
            quotaVal:function() {
                if (this.quotaVal > this.totalMoney) {
                    this.quotaVal = ""
                }
            },
        },
        beforeMount() {
            this.initData();
        },
        methods:{
            initData() {
                let self = this;
                let url = '/zingbiz/dinner/getDinnerClazzList';
                let param = {
                    isDiscount: "1",
                    pageNumber:"0",
                    pageSize:"1000"
                };
                this.$http
                    .get(url, { params: param})
                    .then(res => {
                        if (res.data.success) {
                            self.clazzList = res.data.data.data;
                            let isDiscountIds = []
                            for (let i = 0; i < self.clazzList.length; i++) {
                                if (self.clazzList[i].isDiscount === "1") {
                                    isDiscountIds.push(self.clazzList[i].dinnerClazzId)
                                }
                            }
                            self.discountClazzIdStrs = isDiscountIds.join(" ")
                        } else {
                            self.$vux.toast.text("分类加载失败，请重试", 'bottom')
                        }
                    })
                    .catch(error => {
                        self.$vux.toast.text("请求失败，请重试", 'bottom')
                    });
            },
            //点击redio 选择打折类型,同时清空原打折数据
            clickRadio(flag,event) {
                this.discountType = flag;
                this.clearInput();
            },
            /** 取消打折 */
            cancelDiscount() {
                this.$emit('cancel', false);
            },
            /** 确定打折 */
            confirmDiscount() {
                // if (!this.discountType) {
                //     this.$vux.toast.text("请选择打折类型", 'bottom');
                //     return;
                // }
                //清空原打折数据
                this.clearClazzDiscount();
                this.clearDinnerDiscount();

                //------新设置打折------
                if (this.discountType === "1") {
                    console.log("定额");
                }
                //1.比例打折: 给每个分类加上打折比
                else if (this.discountType === "2") {
                    this.formatPercent(this.percentVal);
                }
                //2.分类打折
                else if (this.discountType === "3") {
                   let boxList = document.getElementsByClassName("clazzCheckbox");
                   let checkedArr = [];
                    for (let i = 0; i < boxList.length; i++) {
                        if (boxList[i].checked) {
                            checkedArr.push(boxList[i]);
                        }
                    }
                    checkedArr.forEach(item => {
                        let p = item.parentNode.parentNode;
                        let input = p.querySelector("input.clazzInput");
                        let v = input.value;
                        let id = input.id;
                        this.clazzList.forEach(item => {
                            if (item.dinnerClazzId === id) {
                                item.dinnerDiscount = v;
                            }
                        })
                    })
                }
                //3.菜品打折
                else if (this.discountType === "4") {
                    let boxList = document.getElementsByClassName("dinnerCheckbox");
                    let checkedArr = [];
                    for (let i = 0; i < boxList.length; i++) {
                        if (boxList[i].checked) {
                            checkedArr.push(boxList[i]);
                        }
                    }
                    checkedArr.forEach(item => {
                        let p = item.parentNode.parentNode;
                        let input = p.querySelector("input.dinnerInput");
                        let v = input.value;
                        let id = input.id;
                        this.returnableCopy.forEach(item => {
                            if (item.modelId === id) {
                                item.dinnerDiscount = v;
                            }
                        })
                    })
                }

                let oo = {
                    1 : this.quotaVal,
                    2 : this.clazzList,  //*this.percentVal
                    3 : this.clazzList,
                    4 : this.returnableCopy,
                };
                let obj = {
                    discountType : this.discountType,
                    value:oo[this.discountType]
                };
                this.$emit('confirm',obj);
            },
            formatPercent (percent) {
                if (!percent) {
                    percent = 100;
                }
                this.clazzList.forEach(item => {
                    item.dinnerDiscount = percent;
                });
            },
            clearDiscount() {
                let radiolist = document.getElementsByClassName("radio");
                for (let i = 0; i < radiolist.length; i++) {
                    let one = radiolist[i];
                    one.checked = false;
                }
                this.discountType = "0";
                this.clearInput();
                this.clearClazzDiscount();
                this.clearDinnerDiscount()
            },
            //清空所有输入框
            clearInput() {
                this.quotaVal = "";
                this.percentVal = "";

                let list = document.getElementsByClassName("inputVal");
                for (let i = 0; i < list.length; i++) {
                    let one = list[i];
                    one.value = "";
                }
            },
            //清空所有分类打折
            clearClazzDiscount() {
                this.clazzList.forEach(item => {
                    item.dinnerDiscount = "";
                });
            },
            //清空所有菜品打折
            clearDinnerDiscount(){
                this.returnableCopy.forEach(item => {
                    item.dinnerDiscount = "";
                })
            },
        }
    }
</script>
<style scoped>
    .d-item .itemTitle{
        width: 50px;
        height: 44px;
        line-height: 44px;
        text-align: center;
    }
    .line44{
        line-height: 44px;
    }
    .pLeft{
        padding-left: 0;
    }
    .block{
        display: block;
    }
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .rSize{
        width: 20px;
        height: 20px;
        margin-top: 10px;
    }
    .m10{
        margin: 0 10px 0px;
        border-radius: 5px;
    }
    .flex{
        display: flex;
    }
    .clazzTitle{
        line-height: 44px;
        display: inline-block;
        max-width: 60%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .inputVal{
        width: 50px;
        height: 40px;
        font-size: 14px;
        text-align: right;
    }
</style>
