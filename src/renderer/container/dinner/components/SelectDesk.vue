<template>
    <div v-transfer-dom>
        <popup v-model="showSelectDesk" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                          @on-click-left="cancelSelect" @on-click-right="confirmSelected"></popup-header>
            <div :style="{ height:screenHeight+'px',overflow:'auto' }">
                <ul v-if="deskData.length > 0">
                    <group>
                        <radio title="title" :options="options" v-model="check" @on-change="change"></radio>
                    </group>
                </ul>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,PopupHeader,Group,Radio,XSwitch,TransferDomDirective as TransferDom } from 'vux'
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";

    export default {
        name :"SelectDesk",
        components: {
            Popup,PopupHeader,XSwitch,Scroll,GridCard,Group,Radio
        },
        directives: {
            TransferDom
        },
        props: {
            showSelectDesk:{
                type: Boolean,
                default:function () {
                    return false
                }
            },
            deskData :{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data() {
            return {
                selected :{},
                editTitle:"选择桌位",
                check:"0",
                target:{},
                screenHeight:0,
            }
        },
        computed:{
            options : function () {
                let arr = [];
                this.deskData.forEach(item => {
                    arr.push({
                        key:item.deskId,
                        value:item.deskType + "--" + item.deskNum
                    })
                });
                return arr;
            }
        },
        created() {
            this.screenHeight = document.documentElement.clientHeight - 45;
        },
        methods :{
            confirmSelected() {
                this.$emit('selected',this.target);
            },
            cancelSelect() {
                this.$emit('cancel', false);
            },
            change(k,v) {
                this.target.deskName = v;
                this.target.deskId = k;
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    .vux-popup-dialog{
        overflow : hidden;
    }
</style>
