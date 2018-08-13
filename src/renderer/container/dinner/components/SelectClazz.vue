<template>
    <div class="select-desk" v-transfer-dom>
        <popup v-model="showSelectClazz" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                          @on-click-left="cancelSelect" @on-click-right="confirmSelected"></popup-header>
            <div class="scroll-list-wrap" :style="{height : screenHeight + 'px', overflow : 'auto'}">
                <!--<scroll ref="scroll" :data="[]" :scrollbar="true" :startY="0" :pullUpLoad="{threshold: 0 }">-->
                    <ul v-if="clazzData.length > 0">
                        <group>
                            <radio title="title" :options="options" v-model="check" @on-change="change"></radio>
                        </group>
                    </ul>
                <!--</scroll>-->
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,PopupHeader,Group,Radio,TransferDomDirective as TransferDom } from 'vux'
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";

    export default {
        name :"SelectClazz",
        components: {
            Popup,PopupHeader,Scroll,GridCard,Group,Radio
        },
        directives: {
            TransferDom
        },
        props: {
            showSelectClazz:{
                type: Boolean,
                default:function () {
                    return false
                }
            },
            clazzData :{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data() {
            return {
                selected :{},
                editTitle:"选择分类",
                target:{},
                check:"0",
                screenHeight:0
            }
        },
        computed:{
            options : function () {
                let arr = [];
                this.clazzData.forEach(item => {
                    arr.push({
                        key:item.dinnerClazzId,
                        value:item.dinnerClazzName,
                    })
                });
                console.log("options",arr);
                return arr;
            }
        },
        watch: {
            showSelectClazz (isShow) {
                // 每次显示重置
                if (!isShow) {
                    this.check = "0";
                   console.log("cancel should reset");
                }
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
                this.target.dinnerClazzName = v;
                this.target.dinnerClazzId = k;
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
