<template>
    <div class="attendanceCardList">
        <ZingHead :title="title">
            <div slot="header-right"></div>
        </ZingHead>

        <div class="scroll-list-wrap">
            <scroll ref="scrollForKqz">
                <ul>
                    <li v-for="(data, index) in commonData" :key="index">
                        <div v-if="data.identification == 'WQKQ'" @click="clickOneData(data.rowId,data.identification)">
                            <GridCard>
                                <div slot="cardLeft" class="left">
                                    <div class="left-wrapper" >
                                        <p class="left-wrapper-title">{{data.groupName}}</p>
                                    </div>
                                </div>

                            </GridCard>
                        </div>
                        <div v-if="!data.identification && (data.isClick == 'true' || !data.isClick)" @click="clickOneData(data.rowId,data.identification)">
                            <GridCard>
                                <div slot="cardLeft" class="left">
                                    <div class="left-wrapper" >
                                        <p class="left-wrapper-title">{{data.groupName}}</p>
                                    </div>
                                </div>

                            </GridCard>
                        </div>
                         <div v-if="!data.identification &&  data.isClick == 'false'" style="background-color: #dcdfe6;">
                            <GridCard >
                                <div slot="cardLeft" class="left" >
                                    <div class="left-wrapper" >
                                        <p class="left-wrapper-title">{{data.groupName}}</p>
                                    </div>
                                </div>
                            </GridCard>
                        </div>
                    </li>
                </ul>
            </scroll>
        </div>
    </div>
</template>

<script>
    import Scroll from "../../components/scroll/Scroll";
    import Avatar from "../../components/avatar/Avatar";
    import Tag from "../../components/tag/Tag";
    import GridCard from "../../components/gridcard/GridCard";
    import ZingHead from "../../components/zingHead/ZingHead"
    import Dropdown from "../../components/dropdown/Dropdown";


    import { XHeader/*,Checklist,XButton,Flexbox, FlexboxItem*/ } from 'vux'

    export default {
        components: {
            Scroll,
            Avatar,
            XHeader,
            GridCard,
            ZingHead,
            Dropdown,
            Tag
        },
        data() {
            return {
                reqIp:"",
                curPage: 1,
                pageSize: 10,
                companyId:"company52589645100001",
                title:"考勤打卡",
                items: [],
                commonData: [
                    {
                        rowId:"",
                        groupName:"外勤考勤",
                        identification:"WQKQ"   //标识该数据为外勤考勤 其他数据无需加此标识
                    }
                ]
            };
        },
        created() {
            this.getData();
        },
        methods: {
            onPullingUp() {
                // 更新数据
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            getData() {
                let params = {
                    "pageNumber": "1",
                    "pageSize": "10"
                };
//                params.companyId = this.companyId;
                let url = "/zingbiz/attendance/attenPunch/getAttenSetByCardurl";
                this.$http
                    .post(url,params)
                    .then(res => {
                        let data = res.data.data;
                        for (let i = 0; i < data.length; i++) {
                            this.commonData.push(data[i]);
                        }
                        this.$refs.scrollForKqz.refresh();
                    });
            },
            clickOneData(id,identification) {

                if(identification!=undefined && identification=="WQKQ"){
                    //跳转外勤考勤页面
                    this.$router.push({
                        path:"/attendanceHome/fieldAttendance"
                    })
                }else{
                    //跳转正常考勤页面
                    this.$router.push({
                        path:"/attendanceHome/attendanceCard",
                        query:{
                            kqzId:id
                        }
                    })
                }

            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .attendanceCardList {
        height: 100%;
    }
    .left{
        padding:5px 0px 5px 0px;
    }
</style>

