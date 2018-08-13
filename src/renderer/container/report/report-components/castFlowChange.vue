<template>
    <div>
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <ZingHead :title="'流量项目'" :isComeBack="false" @doSome="backClick">
                    </ZingHead>
                    <scroll :observeDOM="true" class="list-warp">
                        <cast-flow-tree :data="menu" :deleteItem="deleteItem" @checkIcon="checkIcon" :searchType="searchType"></cast-flow-tree>
                    </scroll>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup } from "vux";
    import ZingHead from "components/zingHead/ZingHead.vue";
    import Scroll from "@/components/scroll/Scroll";
    import CastFlowTree from "../report-components/castFlow-tree";
    export default {
        components: {
            Popup,
            Scroll,
            CastFlowTree,
            ZingHead
        },
        props: {
            showPopup: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            recordType: {
              type: String,
              default: function() {
                return '';
              }
            },
        },
        data() {
            return {
                searchType:false,
                deleteItem: false,
                menu:[],
            };
        },
        watch: {
            showPopup:{
                handler(item) {
                    if (item) {
                        this.deleteItem = true;
                    } else {
                        this.deleteItem = false
                    }
                },
                deep:true
            },
          recordType:{
            handler(item) {
              if (item) {
                this.deleteItem = true;
                 this.getChangeData();
              } else {
                this.deleteItem = false
              }
            },
            deep:true
          }
        },
        created() {
        },
        methods: {
            checkIcon(item) {
                //将数据保存
                this.$emit('checkItem', item)
            },
            backClick() {
                this.$emit("backClick");
            },
            //获取变动方式
            getChangeData() {
              this.$http.post("/zingbiz/report/finance_report/getCashFlowProject", { "recordType":this.recordType }).then((res) => {
                this.menu = res.data.data

              })
            }
        }
    };
</script>

