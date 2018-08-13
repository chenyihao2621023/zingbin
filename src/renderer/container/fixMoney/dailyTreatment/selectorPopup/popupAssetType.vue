<template>
    <div class="wrapper">
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%" class="inner">
            <div class="popupDate-picker-popup">
                <ZingHead :title="'资产类别'" :isComeBack="false" @doSome="backClick">
                </ZingHead>
                <scroll :observeDOM="true" class="list-warp">
                    <tree :data="menu" :deleteItem="deleteItem" @checkIcon="checkIcon" :searchType="searchType"></tree>
                </scroll>
                <x-button type="primary" class="btn-common">选择</x-button>
            </div>
        </popup>
    </div>
</template>
<script>
import { Popup, XButton } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
export default {
    components: {
        Popup,
        Scroll,
        Tree,
        ZingHead,
        XButton
    },
    props: {
        showPopup: {
            type: Boolean,
            default: function () {
                return false;
            }
        }
    },
    data() {
        return {
            deleteItem: false,
            searchType: false,
            menu: []
        };
    },
    watch: {
        showPopup: {
            handler(item) {
                if (item) {
                    this.deleteItem = true;
                } else {
                    this.deleteItem = false;
                }
            },
        },
    },
    created() {
        this.getAllAssetsClassConfiguration()
    },
    methods: {
        checkIcon(item) {
            this.$emit("checkItem", item);
        },
        backClick() {
            this.$emit("backClick");
        },
        //获取资产类别
        getAllAssetsClassConfiguration() {
            this.$http.get("/zingbiz/fixedAssets/configuration/getAllAssetsClassConfiguration", {}).then((res) => {
                this.menu = res.data.data
            })
        }
    },
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.wrapper {
    height: 100%;

    .popupDate-picker-popup {
        height: 100%;

        .list-warp {
            height: calc(100% - 50px);
            background-color: white;
        }
    }
}
</style>

