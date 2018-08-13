<template>
    <div  class="attenExamine">
        <!-- 头部 -->
        <zing-head  title="考勤审核">
        </zing-head>
        <!-- tab页 -->
        <div class="vue-tab">
            <tab :line-width="2">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="changeTab"
                          @click="defTab = item" :key="index">{{item}}
                </tab-item>
                <badge v-if="wqshRedPoint" style="position: absolute;top:10px;left: 45%"></badge>
            </tab>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">
            <div class="scroll-list-wrap">
                <scroll ref="scroll"
                  :data="attenExamineList"
                  :scrollbar="true"
                  :startY="0"
                  >
                  <div v-if="attenExamineList.length > 0">
                        <GridCard v-for="(item ,index) in attenExamineList" :key="index"  @click.native="goDetail(item)">
                          <div slot="cardLeft" class="left">
                                  <div class="left-wrapper">
                                      <div v-if="item.isWQ == 'true'">
                                          <p class="left-wrapper-title">{{item.realName}}-外勤打卡</p>
                                          <p class="left-wrapper-title">打卡时间: {{item.generate_time}}</p>
                                      </div>
                                      <div v-else>
                                          <p class="left-wrapper-title">{{item.realName}}-补卡申请</p>
                                          <p class="left-wrapper-title">补卡时间：{{item.bk_date}}</p>
                                      </div>
                                  </div>
                                  
                           </div>
                           <div  slot="cardRight">
                                  <div v-if="item.isWQ == 'true'">
                                        <tag v-if="item.resultCode == '0'" color="#ff8000">正常</tag>
                                        <tag v-if="item.resultCode == '1'" color="#ff8000">迟到</tag>
                                        <tag v-if="item.resultCode == '2'" color="#ff8000">早退</tag>
                                        <tag v-if="item.resultCode == '4'" color="#ff8000">范围外</tag>
                                  </div>
                                  <div v-else>
                                        <tag v-if="item.isReview == '0'" color="#ff8000">待审核</tag>
                                        <tag v-if="item.isReview == '1'" color="#ff8000">通过</tag>
                                        <tag v-if="item.isReview == '2'" color="#ff8000">拒绝</tag>
                                  </div>
                            </div>
                      </GridCard>
                  </div>
                  <div v-else>
                      <p class="noData" v-if="tabIndex == 0">暂无考勤审核数据</p>
                      <p class="noData" v-if="tabIndex == 1">暂无已审核数据</p>
                  </div>
                </scroll>
            </div>
        </div>
    </div>
</template>


<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Tag from "@/components/tag/Tag";
    import { mapState} from "vuex";
    import { Search ,Tab, TabItem,Badge} from 'vux'
    import {Z_IsEmpty20} from "utils/fn";

    export default {
        components: {
          ZingHead,Scroll,GridCard,Tag,
          Search ,Tab, TabItem,Badge,
          Z_IsEmpty20
        },
        data() {
            return {
                tabTitle: ["未审核", "已审核"],
                defTab: "未审核",
                tabIndex: 0,
                attenExamineList: [],//列表数据
                initData:{},
                wqshRedPoint:false
            }
        },
        created() {
            this.getAttenExamineList()
        },
        computed: {
            ...mapState({
                redPoint: state => state.ui.redPoint,
            })
        },
        watch: {
            redPoint(rpData) {
                if (!rpData) {
                    //console.warn("error redPoint data", rpData);
                    return;
                }
                let sArr = rpData.split("_ZSP_");
                for (let i = 0; i < sArr.length; i++) {
                      if (!Z_IsEmpty20(sArr[i])) {
                          if(sArr[i].substring(0, sArr[i].indexOf(":")) === "hr"){//hr红点
                               let jsonStr = sArr[i].substring(sArr[i].indexOf(":") + 1,sArr[i].length)
                               let hrObj = JSON.parse(jsonStr)

                                if(hrObj["HR_WQSH"].length > 0){
                                        this.wqshRedPoint  = true   
                                }
                          }
                      }
                }
            }
        },
        methods: {
            getAttenExamineList(){
                let url = "/zingbiz/attendance/attenPunch/getAttenExamineList"
                let params = {
                   pageSize:"500"
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    let dshArr = []
                    let yshArr = []
                    retData.forEach(item => {
                          if(item.isReview == "0" ){//未审核
                              dshArr.push(item)
                          }else if(item.isReview == "1" || item.isReview == "2"){//已审核
                              yshArr.push(item)
                          }
                    })
                    this.initData.dsh = dshArr
                    this.initData.ysh = yshArr
                    this.attenExamineList = dshArr
                })

            },
            goDetail(item){
                if(item.isWQ == 'true'){//外勤
                    this.$router.push({
                        path: "/attendanceHome/attenExamineDetail",
                        query:{
                          rowId:item.rowId,
                          companyId:item.companyId
                        }
                    })
                }else if(item.isWQ == 'false'){//补卡
                    this.$router.push({
                        path: "/attendanceHome/attendanceRepairDetail",
                        query:{
                          rowId:item.rowId,
                          cardUrl:item.cardUrl,
                          pageType:"exmine"
                        }
                    })
                }
                
            },
            changeTab(index){
                if (index === 0){//未审核
                    this.attenExamineList = this.initData.dsh
                    this.tabIndex = 0
                }else if (index === 1) {//已审核
                    this.attenExamineList = this.initData.ysh
                    this.tabIndex = 1
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
    .tab-content {
         height 100%;
    }
    .attenExamine {
        height 100%;
        height calc(100% - 94px);
    }
</style>
