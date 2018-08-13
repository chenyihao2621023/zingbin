<template>
    <div id="depositBillTemplate" hidden>
        <div style="width: 801px; height:362px;position: relative; background: url('../../../../../static/images/Deposit-data.jpg') no-repeat;">
            <div style="position: absolute;width: 160px;height:35px;font-size: 16px;left: 100px;top: 95px;">
                {{data.roomNo}}
            </div>
            <div style=" position: absolute;width: 155px;height:35px;font-size: 16px;left: 355px;top: 95px;">
              {{data.guestName}}
            </div>
            <div style="position: absolute;width: 155px;height:35px;font-size: 13px;right: 55px;top: 95px;">
                {{data.orderId}}
            </div>
            <div type="text" style="position: absolute;width: 170px;height:35px;font-size: 16px;right: 45px;top:135px;">
                {{data.deposit}}  <!--小写金额-->
            </div>
            <div type="text" style="position: absolute;width: 343px;height:35px;font-size: 16px;left: 170px;top: 135px;">
                {{data.capitalMoney}} <!--大写金额-->
            </div>
            <div type="text" style="position: absolute;width: 656px;height: 50px;font-size: 16px;left: 100px;top: 180px;">
                    {{data.note}}
            </div>
            <div type="text" style="position: absolute;width: 280px;height:39px;font-size: 16px;left: 115px;top: 235px;">
                {{data.operatorName}}
            </div>
            <div type="text" style="position: absolute;width: 60px;height: 34px;font-size: 15px;right: 145px;top: 55px;">
                {{new Date().getFullYear()}}
            </div>
            <div type="text" style="position: absolute;width: 23px;height: 34px;font-size: 15px;right: 113px;top: 55px;">
                {{new Date().getMonth()+1}}
            </div>
            <div type="text" style="position: absolute;width: 23px;height: 34px;font-size: 15px;right: 73px;top: 55px;">
                {{new Date().getDate()}}
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        components: {},
        props: {
            printDepositData: {
                type: Object,
                default: function () {
                    return {}
                }
            },
        },
        data() {
            return {
                data:{}
            }
        },
        watch:{
            printDepositData:function () {
                this.data = Object.assign({},this.printDepositData);
                this.data.capitalMoney = this.transformNumberToChinese(this.data.deposit);
            }
        },
        methods:{
            //数字转大写
            transformNumberToChinese(n) {
                if (Number.isNaN(Number(n))) {
                    return;
                }
                let fraction = ['角', '分'];
                let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                let unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
                let head = n < 0 ? '欠' : '';
                n = Math.abs(n);
                let s = '';
                for (let i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);
                for (let j = 0; j < unit[0].length && n > 0; j++) {
                    let p = '';
                    for (let k = 0; k < unit[1].length && n > 0; k++) {
                        p = digit[n % 10] + unit[1][k] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][j] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            },
        }
    }
</script>
<style scoped>

</style>
