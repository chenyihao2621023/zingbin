<template>
    <div>
        <div class="prompt" v-show="prompt">该状态下没有数据</div>
        <scroll ref="scroll">
            <GridCard class="scroll-list-wrap" v-for="(item,index) in list" :key="index">
                <div slot="cardLeft" class="left">
                    <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="present"></avatar>
                    <div class="left-wrapper">
                        <p class="left-wrapper-title">{{item.pzId}}</p>
                        <div class="left-wrapper-desc">金额:{{item.pzFirstMoney}}</div>
                    </div>
                </div>
                <div slot="cardRight" class="right">
                    <i class="iconfont icon-gengduo"></i>
                </div>
            </GridCard>
        </scroll>
    </div>
</template>

<script>
    import Avatar from "@/components/avatar/Avatar";
    import GridCard from "@/components/gridcard/GridCard";
    import scroll from "@/components/scroll/Scroll";
    export default {
        name: "audited",
        components:{
            Avatar,
            GridCard,
            scroll
        },
        data() {
            return {
                list:[],
                prompt:false,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.$http.get("/zingbiz/resourceLibrary/voucher/queryVoucher?pzStatus=YSH&voucherType=CW&pageNumber=0&pageSize=2000",{
                }).then((res) => {
                    if (parseInt(res.data.total) !== 0) {
                        let data = res.data.data;
                        this.list = data;
                    } else {
                        this.prompt = true;
                    }
                })
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .prompt {
        text-align: center;
        color: #ff8000;
        margin-top: 20px;
        font-size: 18px;
    }
</style>
