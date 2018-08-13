<template>
    <el-container>
        <el-main>
            <div class="padding">{{dateTime}}</div>
            <ul class="padding headLine">
                <li>房间总数：{{tableData && tableData.roomTotal}}</li>
                <li>入住总数：{{tableData && tableData.checkInRoomNum}}</li>
                <li>空房总数：{{tableData && tableData.blankRoomNum}}</li>
                <li>维修房数：{{tableData && tableData.repairRoomNum}}</li>
                <li>锁定房数：{{tableData && tableData.lockRoomNum}}</li>
                <li>预定房数：{{tableData && tableData.reserveRoomNum}}</li>
                <li>房费总额：{{tableData && tableData.inRoomCharge}}</li>
                <li>开房率：{{tableData && tableData.roomRate}}</li>
            </ul>
            <el-col :span="24">
                <el-col :span="10">
                    <ul class="table hotelCurrentStates">
                        <li>
                            <span></span>
                            <span>房数</span>
                            <span>人数</span>
                        </li>
                        <li>
                            <span>预计离店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.predictLeave && hotelCurrentStates.predictLeave.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.predictLeave && hotelCurrentStates.predictLeave.personNum}}</span>
                        </li>
                        <li>
                            <span>实际离店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.actualLeave && hotelCurrentStates.actualLeave.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.actualLeave && hotelCurrentStates.actualLeave.personNum}}</span>
                        </li>
                        <li>
                            <span>预计到店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.predictCome && hotelCurrentStates.predictCome.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.predictCome && hotelCurrentStates.predictCome.personNum}}</span>
                        </li>
                        <li>
                            <span>实际到店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.actualCome && hotelCurrentStates.actualCome.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.actualCome && hotelCurrentStates.actualCome.personNum}}</span>
                        </li>
                        <li>
                            <span>当日续住</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.continueLive && hotelCurrentStates.continueLive.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.continueLive && hotelCurrentStates.continueLive.personNum}}</span>
                        </li>
                        <li>
                            <span>当日离店续住</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.continueLeaveLive && hotelCurrentStates.continueLeaveLive.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.continueLeaveLive && hotelCurrentStates.continueLeaveLive.personNum}}</span>
                        </li>
                        <li>
                            <span>提前离店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.advanceLeave && hotelCurrentStates.advanceLeave.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.advanceLeave && hotelCurrentStates.advanceLeave.personNum}}</span>
                        </li>
                        <li>
                            <span>当日预定当日到店</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.currentReserveAndLive && hotelCurrentStates.currentReserveAndLive.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.currentReserveAndLive && hotelCurrentStates.currentReserveAndLive.personNum}}</span>
                        </li>
                        <li>
                            <span>散客入住</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.guest && hotelCurrentStates.guest.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.guest && hotelCurrentStates.guest.personNum}}</span>
                        </li>
                        <li>
                            <span>团队入住</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.groupLive && hotelCurrentStates.groupLive.roomNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.groupLive && hotelCurrentStates.groupLive.personNum}}</span>
                        </li>
                        <!--<li>
                            <span>免费房</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.freeRoom && hotelCurrentStates.freeRoom.personNum}}</span>
                            <span>{{hotelCurrentStates && hotelCurrentStates.freeRoom && hotelCurrentStates.freeRoom.roomNum}}</span>
                        </li>-->
                    </ul>
                </el-col>
                <el-col :span="14">
                    <ul class="table rightUpTable">
                        <li>
                            <span></span>
                            <span>预抵</span>
                            <span></span>
                            <span>在店</span>
                            <span></span>
                            <span>预离</span>
                            <span></span>
                        </li>
                        <li>
                            <span></span>
                            <span>房数</span>
                            <span>人数</span>
                            <span>房数</span>
                            <span>人数</span>
                            <span>房数</span>
                            <span>人数</span>
                        </li>
                        <!--<li>
                            <span>自用</span>
                            <span>{{predictComeInfo && predictComeInfo.ourUse && predictComeInfo.ourUse.roomNum}}</span>
                            <span>{{predictComeInfo && predictComeInfo.ourUse && predictComeInfo.ourUse.personNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.ourUse && inRoomInfo.ourUse.roomNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.ourUse && inRoomInfo.ourUse.personNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.ourUse && predictLeaveInfo.ourUse.roomNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.ourUse && predictLeaveInfo.ourUse.personNum}}</span>
                        </li>-->
                        <li>
                            <span>散客</span>
                            <span>{{predictComeInfo && predictComeInfo.guest && predictComeInfo.guest.roomNum}}</span>
                            <span>{{predictComeInfo && predictComeInfo.guest && predictComeInfo.guest.personNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.guest && inRoomInfo.guest.roomNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.guest && inRoomInfo.guest.personNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.guest && predictLeaveInfo.guest.roomNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.guest && predictLeaveInfo.guest.personNum}}</span>
                        </li>
                        <li>
                            <span>团队</span>
                            <span>{{predictComeInfo && predictComeInfo.groupLive && predictComeInfo.groupLive.roomNum}}</span>
                            <span>{{predictComeInfo && predictComeInfo.groupLive && predictComeInfo.groupLive.personNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.groupLive && inRoomInfo.groupLive.roomNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.groupLive && inRoomInfo.groupLive.personNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.groupLive && predictLeaveInfo.groupLive.roomNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.groupLive && predictLeaveInfo.groupLive.personNum}}</span>
                        </li>
                        <li>
                            <span>总计</span>
                            <span>{{predictComeInfo && predictComeInfo.total && predictComeInfo.total.roomNum}}</span>
                            <span>{{predictComeInfo && predictComeInfo.total && predictComeInfo.total.personNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.total && inRoomInfo.total.roomNum}}</span>
                            <span>{{inRoomInfo && inRoomInfo.total && inRoomInfo.total.personNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.total && predictLeaveInfo.total.roomNum}}</span>
                            <span>{{predictLeaveInfo && predictLeaveInfo.total && predictLeaveInfo.total.personNum}}</span>
                        </li>
                    </ul>
                    <ul class="table rightDownTable">
                        <li>
                            <span></span>
                            <span>房数</span>
                            <span>人数</span>
                            <span>预计出租率</span>
                        </li>
                        <li>
                            <span>预计占用</span>
                            <span>{{onUse && onUse.reserveUse && onUse.reserveUse.roomNum}}</span>
                            <span>{{onUse && onUse.reserveUse && onUse.reserveUse.personNum}}</span>
                            <span>{{onUse && onUse.reserveUse && onUse.reserveUse.rentalRate}}</span>
                        </li>
                        <li>
                            <span>散客占用</span>
                            <span>{{onUse && onUse.guest && onUse.guest.roomNum}}</span>
                            <span>{{onUse && onUse.guest && onUse.guest.personNum}}</span>
                            <span>{{onUse && onUse.guest && onUse.guest.rentalRate}}</span>
                        </li>
                        <li>
                            <span>团队占用</span>
                            <span>{{onUse && onUse.groupLive && onUse.groupLive.roomNum}}</span>
                            <span>{{onUse && onUse.groupLive && onUse.groupLive.personNum}}</span>
                            <span>{{onUse && onUse.groupLive && onUse.groupLive.rentalRate}}</span>
                        </li>
                    </ul>
                </el-col>
            </el-col>
        </el-main>
    </el-container>
</template>
<script>
    import ElContainer from "../../../../../node_modules/element-ui/packages/container/src/main";
    import {dateFormat} from '../../../utils/date';
    export default {
        components: {
            ElContainer,
        },
        data() {
            return {
                dateTime: null,
                tableData: {},
                hotelCurrentStates: {},
                predictComeInfo: {},
                inRoomInfo: {},
                predictLeaveInfo: {},
                onUse: {},
                showLoading: false,
                date: null,
                Time: null,
            }
        },
        mounted() {
            this.showTime();
        },
        created() {
            this.initData();
            this.Time = setInterval(() => {
                this.showTime()
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.Time);
        },
        methods: {
            showTime() {
                this.dateTime = dateFormat(new Date())
            },
            //当前状态所有表单
            initData() {
                let url = '/zingbiz/hotel/hotelNew/countNowState';
                let queryParams = {};
                this.loadingInstance = this.$loading({});
                this.$httpSilent
                    .get(url, {params: queryParams})
                    .then((res) => {
                        this.loadingInstance.close();
                        this.tableData = res.data.data;
                        this.hotelCurrentStates = res.data.data.hotelCurrentStates;
                        this.predictComeInfo = res.data.data.predictComeInfo;
                        this.inRoomInfo = res.data.data.inRoomInfo;
                        this.predictLeaveInfo = res.data.data.predictLeaveInfo;
                        this.onUse = res.data.data.onUse;
                    })
                    .catch(() => {
                        this.$message({type: "error", message: "请求数据失败，请刷新重试"});
                    })
            },
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .padding {
        padding: 10px;
    }

    .headLine {
        display: flex;
        li {
            flex: 1;
        }
    }

    .table {
        border: 1px solid #ccc;
        li {
            display: flex;
            span {
                flex: 1;
                border: 1px solid #ccc;
                line-height: 21px;
            }
        }
    }

    .rightUpTable {
        li:first-child {
            span:nth-child(2) {
                border-right: none;
            }
            span:nth-child(4) {
                border-right: none;
            }
            span:nth-child(6) {
                border-right: none;
            }
            span:nth-child(3) {
                border-left: none;
            }
            span:nth-child(5) {
                border-left: none;
            }
            span:nth-child(7) {
                border-left: none;
            }
        }

    }
</style>
