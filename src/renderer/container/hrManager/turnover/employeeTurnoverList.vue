<template>
    <div  class="employeeTurnoverList">
        <zing-head :isComeBack="false" :title="headTitle" @doSome="goBack">
        </zing-head>
        <div class="scroll-list-wrap" v-show="modelTypte == 'list'">
            <scroll 
                  ref="scroll"
                  :observeDOM="true"
                  :data="personnelFileList" 
                  :scrollbar="true"
                  :startY="0"
                  :listenScroll="true"
                  :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }"
                  @scroll="scroll"
                  @pullingUp="onPullingUp">
                    <div v-if="employeesList.length > 0">
                         <GridCard v-for="(item, index) in employeesList" :key="index">
                            <div slot="cardLeft" class="left" v-if="item.turnOverExecutor == 'transferWork'" @click="djjBtn(item)">
                                <avatar shape="square" :src="item.headImg"></avatar>
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">{{item.userName}}</p>
                                    <div class="left-wrapper-desc">离职时间：{{item.generate_time}}</div>
                                </div>
                            </div>
                            <div slot="cardLeft" class="left" v-else-if="item.turnOverExecutor == 'noTransferWork'">
                                <avatar shape="square" :src="item.headImg"></avatar>
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">{{item.userName}}</p>
                                    <div class="left-wrapper-desc">离职时间：{{item.generate_time}}</div>
                                </div>
                            </div>
                            <div slot="cardLeft" class="left" v-else @click="yjjBtn(item)">
                                <avatar shape="square" :src="item.headImg"></avatar>
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">{{item.userName}}</p>
                                    <div class="left-wrapper-desc">离职时间：{{item.generate_time}}</div>
                                </div>
                            </div>
                            <div slot="cardRight" class="right" v-if="item.turnOverExecutor == 'transferWork'" @click="djjBtn(item)">
                                <div class="tag-wrapper">
                                    <tag color="#d15b47">待交接</tag>
                                </div>
                            </div>
                            <div slot="cardRight" class="right" v-else-if="item.turnOverExecutor == 'noTransferWork'">
                                <div class="tag-wrapper">
                                    <tag color="#89bf85">无交接</tag>
                                </div>
                            </div>
                            <div slot="cardRight" class="right" v-else @click="yjjBtn(item)">
                                <div class="tag-wrapper">
                                    <tag color="#3380b7">已交接</tag>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                    <div v-else>
                        <p class="noData">暂无离职人员</p>
                    </div>
            </scroll>
        </div>
        <div v-show="modelTypte == 'desc'">
              <group>
                <cell title="工作已交接" style="background-color: #ff9000;color: #eee;"></cell>
                <cell-form-preview :list="cellList"></cell-form-preview>
              </group>
        </div>
        <img v-show="isShowTop"
             style="width: 50px;vertical-align: baseline;position: fixed;bottom: 50px;right: 10px;z-index: 10;"
             @click="gotoTop" src="~assets/img/ReturnTop.png"/>
    </div>
</template>


<script>
    import { CellFormPreview, Group, Cell } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar";
    import Tag from "@/components/tag/Tag";

    export default {
        name: "employeeTurnoverList",
        components: {
            Scroll, GridCard, Avatar, Tag, ZingHead ,CellFormPreview ,Group,Cell
        },
        data() {
            return {
                headTitle: "离职员工",
                modelTypte:"list",//list - 列表    desc-描述
                employeesList:[],
                cellList:[],
                pageNumber:1,
                isShowTop:false
            }
        },
        //钩子加载完触发
        created() {
            this.getEmployeesWorkList(1);
        },
        methods: {
            getEmployeesWorkList(pageNumber) {
                let url = "/zingbiz/hrManager/EmployeeTurnover/getHandleData";
                let params = {
                    pageNumber : pageNumber,
                    pageSize : "10"
                }
                this.$http.post(url, params).then(res => {
                    let retData = res.data.data
                    if(pageNumber == 1){
                        this.employeesList = retData
                    }else{
                        retData.forEach(item =>{
                            this.employeesList.push(item)
                        })
                    }
                });
            },
            yjjBtn(data){
                this.headTitle = "交接记录"
                this.modelTypte = "desc"
                this.cellList = [{
                    label: '处理人员',
                    value: data.turnOverExecutor
                  },{
                    label: '交接时间',
                    value: data.turnOverPeo
                  },{
                    label: '交接时间',
                    value: data.turnOverDate
                  }]
            },
            goBack(){
                if(this.modelTypte == "list"){
                    this.$router.go(-1)
                }else if(this.modelTypte == "desc"){
                    this.headTitle = "离职员工"
                    this.modelTypte = "list"
                }
            },
            djjBtn(data){
                this.$router.push({
                    path:'transferOfWorkList',
                    query:{cardUrl:data.cardUrl,companyId:data.companyId,rowId:data.rowId}
                });
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    
                    let pageN = parseInt(this.employeesList.length / 10) + 1
                    if (pageN > this.pageNumber) {
                        this.pageNumber = pageN
                        this.getEmployeesWorkList(this.pageNumber);
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

<style lang="stylus" rel="stylesheet/stylus" scoped >
    .employeeTurnoverList{
        height calc(100% - 50px);
    }
    .left-wrapper-desc{
        width: 200px;
        color: #606266;
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
</style>
