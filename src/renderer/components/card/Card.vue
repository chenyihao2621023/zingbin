<template>
    <div class="card" :style="bg != undefined ? setBg() : {backgroundColor: '#fff'}">
        <div class="cardTop">
            <span class="left">
                <span>
                    <avatar class="leftImg" :src="cardImg" alt=""></avatar>
                </span>
                <span class="content">
                    <span class="cardName">{{cardName != undefined ? cardName : defaultCardName}}</span>
                    <span class="cardType">{{cardType != undefined ? cardType : defaultCardType}}</span>
                </span>
            </span>
            <span class="right">
                <avatar v-if="!QRCode" :icon="'erweima'" alt=""></avatar>
                <avatar v-else :src="QRCode" alt=""></avatar>
            </span>
        </div>
        <div class="cardBottom">
            <span class="cardNum">卡号：{{cardNum != undefined ? cardNum : defaultCardNum}}</span>
        </div>
    </div>
</template>
<script>
    import Avatar from '../avatar/Avatar.vue';
    export default {
        components: {
            Avatar,
        },
        props: {
            cardImg: {},
            QRCode: {},
            bg: {},
            cardName: {
                type: String,
            },
            cardType: {
                type: String,
            },
            cardNum: {
                type: String,
            },
        },
        data() {
            return {
                backGround: '#fff',
                defaultCardName: '英立讯',
                defaultCardType: '会员卡',
                defaultCardNum: '8888 8888 8888'
            }
        },
        computed: {},
        methods: {
            setBg() {
                let cur = this.bg.lastIndexOf('.');

                let img = this.bg.substr(cur + 1);

                if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(img)) {
                    return { backgroundImage: 'url(' + this.bg + ')' }
                } else {
                    return { backgroundColor: this.bg }
                }
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    @import '../../assets/stylus/unify.styl';

    .card {
        height: 180px;
        max-width: 350px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        padding: 10px;
        justify-content: space-between;
        border: 1px solid #ccc;
        .cardTop {
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                flex-direction: row;
                flex: 3;
                .leftImg {
                    height: 70px;
                    width: 70px;
                }
                .content {
                    margin-left: 10px;
                    min-height: 70px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    .cardName, .cardType {
                        font-size: 18px;
                    }
                }
            }
            .right {
                img {
                    height: 50px;
                    width: 50px;
                }
            }
        }
        .cardBottom {

        }
    }

</style>
