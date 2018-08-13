<template>
    <div  class="hrManagerList">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="档案管理">
            <div slot="header-right">
                  <span class="header-search">
                      <i class="iconfont icon-fangdajing" @click="hrSearch"></i>
                  </span>
            </div>
        </zing-head>
        <!-- 搜索 -->
        <search-com 
                :searchFlag="showSearch" 
                @cancelInput="cancelInput" 
                @confirmInput="confirmInput">
        </search-com>
        <!-- tab页 -->
        <div class="vue-tab" style="position: relative">
            <tab>
                <tab-item  selected  @on-item-click="changeTab(0)">已认证档案</tab-item>
                <tab-item  @on-item-click="changeTab(1)">待认证档案</tab-item>
            </tab>
            <badge v-if="dshRedPoint" style="position: absolute;top:10px;right: 10px"></badge>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">
            <div class="scroll-list-wrap">
                <scroll 
                  ref="scroll"
                  :observeDOM="true"
                  :data="personnelFileList" 
                  :scrollbar="true"
                  :startY="0"
                  :listenScroll="true"
                  :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }"
                  @scroll="scroll"
                  @pullingUp="onPullingUp"
                  >
                  <div v-if="personnelFileList.length > 0">
                        <GridCard v-for="(item ,index) in personnelFileList" :key="index"  @click.native="goDetail(item.cardUrl)">
                          <div slot="cardLeft" class="left">
                                  <avatar shape="square" :src="item.headImg"></avatar>
                                  <div class="left-wrapper">
                                      <p class="left-wrapper-title">{{item.userName}}</p>
                                      <div class="left-wrapper-desc">
                                          <a href="tel:">{{item.telPhone}}</a>
                                      </div>
                                  </div>
                          </div>
                      </GridCard>
                  </div>
                  <div v-else>
                      <p class="noData" v-if="file_status == '通过'">暂无已认证档案信息</p>
                      <p class="noData" v-if="file_status == '待审核'">暂无待认证档案信息</p>
                  </div>
                </scroll>
            </div>
        </div>
        <img v-show="isShowTop"
             style="width: 50px;vertical-align: baseline;position: fixed;bottom: 50px;right: 10px;z-index: 10;"
             @click="gotoTop" src="~assets/img/ReturnTop.png"/>
    </div>
</template>


<script>
    import {Tab, TabItem,Badge} from 'vux'
    import { mapState} from "vuex";
    import {Z_IsEmpty20} from "utils/fn";
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import SearchCom from "components/search/search.vue";

    export default {
        components: {
            Scroll, GridCard, Avatar, ZingHead,Tab, TabItem,Badge,
            SearchCom,Z_IsEmpty20
        },
        data() {
            return {
                showSearch:false,
                isShowTop:false,
                pageNumber: 1, 
                file_status:"通过",//默认通过
                personnelFileList: [],//列表数据
                userName:"",
                dshRedPoint:false
            }
        },
        created() {
            this.getPersonnelFiles(1,'通过')
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
                               console.log("红点提示",hrObj)

                                if(hrObj["HR_SH"].length > 0){
                                        this.dshRedPoint  = true   
                                }
                          }
                      }
                }
            }
        },
        methods: {
            getPersonnelFiles(pageNumber,file_status,userName){
                let url = "/zingbiz/hrManager/PersonnelFile/getPersonnelFileList"
                let params = {
                    file_status: file_status,
                    pageNumber: pageNumber,
                    pageSize: 10
                }
                if(userName){
                    params.userName = userName
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(pageNumber == 1){
                        this.personnelFileList = retData
                    }else{
                        retData.forEach(item =>{
                              this.personnelFileList.push(item)
                        })
                    }
                })
            },
            hrSearch(){
                this.showSearch = !this.showSearch
            },
            goDetail(cardUrl){
                this.$router.push({
                    path: "/hrManager/employeeInfoDetails",
                    query:{cardUrl:cardUrl}
                })
            },
            changeTab(index){
                if (index === 0){//已认证
                    this.file_status = '通过'
                    this.getPersonnelFiles(1,'通过')

                }else if (index === 1) {//待认证
                    this.file_status = '待审核'
                    this.getPersonnelFiles(1,'待审核')
                }
                this.pageNumber = 1
                this.$refs.scroll.scrollTo(0, 0, 300)
                
            },
            cancelInput(val){
                val = ""
                this.hrSearch()
                this.pageNumber = 1
                this.getPersonnelFiles(this.pageNumber,this.file_status);
            },
            confirmInput(val){
                this.pageNumber = 1
                this.getPersonnelFiles(this.pageNumber,this.file_status,val);
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    
                    let pageN = parseInt(this.personnelFileList.length / 10) + 1
                    if (pageN > this.pageNumber) {
                        this.pageNumber = pageN
                        this.getPersonnelFiles(this.pageNumber,this.file_status);
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
            scroll(val) {
                let y = Math.abs(Math.round(val.y))
                this.isShowTop = y > 425 ? true : false
            },
            gotoTop(){
                this.$refs.scroll.scrollTo(0, 0, 300)
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
    .hrManagerList {
        height calc(100% - 100px);
    }
</style>
