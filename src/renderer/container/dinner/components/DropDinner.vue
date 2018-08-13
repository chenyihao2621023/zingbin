<template>
    <div class="select-desk" v-transfer-dom>
        <popup v-model="showDropDinner" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden',zIndex: 511}">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                          @on-click-left="cancelDrop" @on-click-right="showDropRFun">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;">
                <!--:title="item.dinnerName" -->
                <group v-for="(item,index) in dropDinnerCopy" :key="item.dinnerId">
                    <div class="dorpName">{{item.dinnerName}}{{item.modelName ? "(" + item.modelName + ")" : ""}}</div>
                    <x-number style="width: 45%" :fillable="true" v-model="countVal[index]" :min="0" :max="item.dinnerCounts" @on-change="changeCounts($event,item,index)"></x-number>
                </group>
            </div>
        </popup>
        <popup v-model="showDropR" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden',zIndex: 511}">
            <popup-header v-if="butNable"  :left-text="'取消'" :right-text="'确定'" :title="'退菜备注'" :show-bottom-border="false"
                          @on-click-left="showDropR = false" @on-click-right="confirmDrop">
            </popup-header>
            <popup-header v-else :left-text="'取消'" :right-text="'确定'" :title="'退菜备注'" :show-bottom-border="false">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="备注" v-model="maskValue"></x-input>
                </group>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,PopupHeader,Group,XNumber,XInput,TransferDomDirective as TransferDom } from 'vux'
    export default {
        name :"DropDinner",
        components: {
            Popup,PopupHeader,Group,XNumber,XInput
        },
        directives: {
            TransferDom
        },
        props: {
            showDropDinner:{
                type: Boolean,
                default:function () {
                    return false
                }
            },
            returnable:{
                type: Array,
                default: function () {
                    return [];
                }
            },
            otherData:{},
        },
        data() {
            return {
                selected :{},
                countVal:{},
                editTitle:"退菜",
                dropedData:{},
                butNable:true,
                showDropR:false,
                maskValue:""
            }
        },
        computed:{
            dropDinnerCopy:function () {
                return this.returnable.concat();
            }
        },
        watch:{
            /*dinnerItem : {
                handler(curVal,oldVal) { //

                },
                deep:true
            },*/
        },
        methods :{
            confirmDrop() {
                this.butNable = false
                let self = this;
                let url = "/zingbiz/dinner/returnDinner";
                let params = {
                    returnDishesDatas :JSON.stringify(this.formatData()),
                    dinnerOrderId:this.otherData.orderId,
                    deskNum:this.otherData.deskInfo.deskNum,
                    deskName:this.otherData.deskInfo.deskName,
                    deskArea:this.otherData.deskInfo.deskArea,
                    userName:this.otherData.userName,
                    remarks:this.maskValue,
                };
                this.$http
                    .post(url, params)
                    .then(res => {
                        this.butNable = true
                        self.showDropR = false
                        if (res.data.success) {
                            self.countVal = {}
                            self.$vux.toast.text("退菜完成", 'bottom');
                        } else {
                            self.$vux.toast.text("退菜失败，请刷新重试", 'bottom');
                        }
                        self.$emit('confirm',res.data);
                    })
                    .catch(error => {
                        self.$vux.toast.text("退菜失败,请刷新重试", 'bottom')
                        self.showDropR = false
                        self.$emit('confirm',false);
                    });
            },
            showDropRFun() {
                let dorpNum = 0
                Object.keys(this.countVal).forEach(key => {
                    dorpNum = dorpNum + Number(this.countVal[key])
                });
                if(dorpNum === 0) {
                    this.$vux.toast.text("请选择菜品", 'bottom')
                    return false
                }
                this.maskValue = ""
                this.showDropR = true
            },
            cancelDrop() {
                Object.keys(this.countVal).forEach(key => {
                    this.countVal[key] = 0
                });
                this.butNable = true
                this.$emit('cancel', false);
            },
            changeCounts(val,item,index) {
                let copyItem = JSON.parse(JSON.stringify(item))  //拷贝一份，防止数据改变引起页面错误，
                copyItem.dinnerCounts = val;
                this.countVal[index] = val
                if (val === 0) {
                    delete this.dropedData[copyItem.dinnerOrderDetailsId];
                } else {
                    if (this.dropedData.hasOwnProperty(copyItem.dinnerOrderDetailsId)) {
                        this.dropedData[copyItem.dinnerOrderDetailsId].dinnerCounts = val;
                    } else {
                        this.dropedData[copyItem.dinnerOrderDetailsId] = copyItem
                    }
                }
            },
            formatData() {
                let arr = [];
                Object.keys(this.dropedData).forEach(id => {
                    arr.push({
                        dinnerOrderDetailsId:id,
                        dinnerCounts:this.dropedData[id].dinnerCounts,
                        remarks:this.maskValue,
                    })
                });
                return arr;
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .vux-popup-header-right {
        color: #ff8000 !important;
    }
    .vux-number-selector svg {
        fill: #ff8000 !important;
    }
    .vux-number-selector.vux-number-disabled svg {
        fill: #ccc !important;
    }
    .vux-number-input {
        height 35px !important;
    }
    .vux-number-selector-sub {
        padding: 7px 8px 2px !important;
    }
    .vux-number-selector {
        height: 35px !important;
        width: 35px !important;
        color: #ff8000 !important;
    }
    .vux-number-selector-plus svg {
        fill: #ff8000 !important;
        margin-top: 3px;
    }
    .dorpName {
        float: left;
        width: 55%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-left: 13px;
        padding-top: 15px;
    }
</style>
