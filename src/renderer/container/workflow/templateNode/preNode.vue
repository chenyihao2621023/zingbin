<template>
    <div class="preNode-picker" v-transfer-dom>
        <popup v-model="showPreNode"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="preNode-picker-popup">
                <zing-head class="preNode-picker-head"
                           title=""
                           :isComeBack="false"
                           @doSome="cancleClick">
                </zing-head>
                <div v-if="preNodeData!=undefined && preNodeData.length>0" class="preNode">
                    <group>
                        <checklist required
                                   :options="preNodeData"
                                   v-model="checkItem"
                                   @on-change="change"
                        ></checklist>
                    </group>
                </div>
                <div v-else class="preNode">
                  <div style="font-size: 16px;color: #ff8000;text-align: center;width:100%;margin-top:10px;">暂无可选节点！</div>
                </div>
                <flexbox>
                  <flexbox-item style="margin-left: 0px !important;">
                      <x-button type="primary" class="btn-save" @click.native="cancleClick">取消</x-button>
                  </flexbox-item>
                  <flexbox-item style="margin-left: 0px !important;">
                      <x-button type="primary" class="btn-common" @click.native="submit">确定</x-button>
                  </flexbox-item>
                </flexbox>
            </div>

        </popup>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"

    import { XHeader,XTextarea,Group, Flexbox, FlexboxItem,XButton,XInput,Checklist,
        Popup,
        Cell,
        Selector,
        XSwitch,
        TransferDomDirective as TransferDom
    } from 'vux'

    export default {
        name: "preNode",
        components: {
            ZingHead,XTextarea, Group, XButton, Flexbox, FlexboxItem,XInput,
            Popup, Cell,Selector,XSwitch,Checklist,
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                checkItem:[],
                itemShowData:{}
            }
        },
        props:{
            showPreNode: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            preNodeData: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            initSel:{
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        watch: {
            initSel () {
                this.checkItem = this.initSel;
            }
        },
        created() {
            let self  = this;

            self.initPage();

        },
        methods: {
            initPage(){
                let self  = this;


            },
            change(value, label){

            },
            submit() {
                this.$emit("handleSelData",this.checkItem);
            },
            cancleClick() {
                this.checkItem = [];
                this.$emit("cancleClick");
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .preNode-picker {
    .vux-popup-dialog {
        z-index: 900;
    }

    .preNode-picker-popup {
        display: flex;
        flex-direction: column;
        background-color: $component-background;
        width: 100%;
        height: 100%;
    }
    }

    .preNode {
        height: 85.2%;
        overflow-y: scroll;
    }

    .formFontSize{
        font-size: 16px !important;
    }

</style>

