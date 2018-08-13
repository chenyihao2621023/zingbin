<template>
    <div class="memberCard">
        <zing-head title="会员卡"></zing-head>
        <div class="TopContent">
            <card></card>
            <div class="balanceOrIntegral">
                <div class="balance">
                    <span>余额</span>
                    <span>100.0元</span>
                </div>
                <div class="integral">
                    <span>积分</span>
                    <span>10</span>
                </div>
            </div>
        </div>
        <div class="bottomContent">
            <div @click="toMemberPower">会员权益</div>
            <div @click="toGradeExplain">等级说明</div>
            <div @click="toCardDetail">会员卡详情</div>
            <div @click="toFirm">商号</div>
        </div>
    </div>
</template>
<script>
    import ZingHead from '../../components/zingHead/ZingHead.vue';
    import Card from '../../components/card/Card.vue';
    export default {
        components: {
            ZingHead,
            Card,
        },
        data() {
            return {}
        },
        computed: {},
        methods: {
            toMemberPower() {
                this.$router.push({
                    path:'/memberPower',
                })
            },
            toGradeExplain() {
                this.$router.push({
                    path:'/gradeExplain',
                })
            },
            toCardDetail() {
                this.$router.push({
                    path:'cardDetail',
                })
            },
            toFirm() {
                this.$router.push({
                    path:'',
                })
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';
    .memberCard {
        height: 100%;
        .TopContent{
            padding: 10px;
            .balanceOrIntegral{
                margin-top: 10px;
                display:flex;
                height: 50px;
                text-align:center;
                .balance,.integral{
                    flex:1;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-around;
                    span:last-child{
                        color:red;
                    }
                }
                .balance{
                    border-right:1px solid #ccc;
                    
                }
                .integral{
                
                }
                
            }
        }
        .bottomContent{
            position: absolute;
            bottom: 50px;
            width: 100%;
            div{
                padding-left: 10px;
                height: 50px;
                line-height:50px;
                border-top:1px solid #ccc;
            }
        }
    }
</style>