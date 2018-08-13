<template>
    <div>
        <div id="printBillFrame" hidden>
            <div v-for="index in pageNumber" :key="index" style="page-break-after: always;margin: 50px">
                <div class="printHead">
                    <div style="width: 100%;height: 100px;display: flex;justify-content: center">
                        <img src="./天柱山观云山庄logo-ok_1.png" alt="" width="20%" height="100px">
                    </div>
                    <div style="text-align: center">
                        <div style="font-size: 23px">宾客账单</div>
                        <div style="font-size: 23px;margin-top: 5px">GUEST FOLIO</div>
                        <div style="display: flex">
                        <span style="width: 50%;text-align: left">
                            <div style="padding: 3px">客人姓名 GUEST NAME： {{data.checkInPersonName?data.checkInPersonName:''}}</div>
                            <div style="padding: 3px">抵店日期 ARRIVAL： {{data.actualEnterTime}}</div>
                            <div style="padding: 3px">离店日期 DEPARTURE： {{data.actualOuterTime}}</div>
                            <div style="padding: 3px">打印时间 PRINTING: {{data.printTime}}</div>
                        </span>
                            <span style="width: 50%;text-align: left">
                            <div style="padding: 3px">订单号 ORDER NO： {{data.orderId}}</div>
                            <div style="padding: 3px">房号 ROOM NO： {{data.roomNo}}</div>
                            <div style="padding: 3px">操作员 OPERATOR:  {{data.operatorName}}</div>
                        </span>
                        </div>
                    </div>
                </div>
                <div class="data">
                    <table style="width: 100%;text-align: left">
                        <tr style="border:none;border-bottom:2px solid black;border-top:2px solid black;padding: 10px">
                            <th style="padding: 10px">序号</th>
                            <th style="padding: 10px">状态</th>
                            <th style="padding: 10px">日期</th>
                            <th style="padding: 10px">交易详情</th>
                            <th style="padding: 10px">数量</th>
                            <th style="padding: 10px">金额</th>
                            <th style="padding: 10px">房号</th>
                        </tr>
                        <tr v-for="(row,i) in pageData[index-1]" :key="row.billItemId">
                            <td style="padding: 10px">{{(index-1) * pageSize + i+1}}</td>
                            <td style="padding: 10px">{{formatBillType(row)}}</td>

                            <td style="padding: 10px">{{row.genTime}}</td>
                            <td style="padding: 10px">{{row.businessItemDesc}}</td>
                            <td style="padding: 10px">{{row.businessCounts}}</td>
                            <td style="padding: 10px">{{row.amount}}</td>
                            <td style="padding: 10px">{{row.roomNo}}</td>
                        </tr>
                    </table>
                </div>
                <div v-if="(index) === pageNumber" style="margin-top: 15px;display: flex;flex-direction: row">
                    <div>
                        <div style="padding: 3px">付款合计 PAYMENT：{{data.payment}}</div>
                        <div style="padding: 3px">消费合计 CONSUMPTION：{{data.consumption}}</div>
                    </div>
                </div>
                <div style="position: fixed;left: 0;right: 0;bottom: 60px;text-align: center">
                    <span style="display:inline-block;border-top: 1px solid black;">
                        宾客签字 GUEST SIGNATURE
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { dateFormat } from "../../../utils/date";
    import hotelFormatJs from "../commonJs/formatHotelJs";
    export default {
        name: "print-bill-template",
        props: {
            printData: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                data: {},
                pageNumber: 1,      //页数
                pageSize:12,        //每页打印条数
                pageData: [],       //分页后的数组
            }
        },
        watch: {
            printData: function () {
                console.log("total",this.printData.billItemList.length);
                this.pageData = [];
                this.data = Object.assign({}, this.printData);
                this.data.printTime = dateFormat(new Date());
                this.pageNumber = Math.ceil(this.data.billItemList.length / this.pageSize);

                if (this.pageNumber === 0) {
                    this.pageNumber = 1;
                }
                for (let i = 0; i < this.pageNumber; i++) {
                    let start = i * this.pageSize;
                    let end = start + this.pageSize;
                    this.pageData.push(this.data.billItemList.slice(start, end));
                }
            }
        },
        methods:{
            formatBillType(row) {
                return hotelFormatJs.formatBillItemType(row.settlementState);
            },
        }
    }
</script>

<style scoped>

</style>
