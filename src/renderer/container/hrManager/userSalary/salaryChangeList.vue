<template>
    <div class="salaryChangeList">
        <ZingHead title="工资变动记录"></ZingHead>
        <div class="scroll-list-wrap">
                <scroll 
                  ref="scroll"
                  :data="personnelFileList" 
                  :scrollbar="true"
                  :startY="0"
                  >
                  <div v-if="personnelFileList.length > 0">
                       <!--  <GridCard v-for="(item ,index) in personnelFileList" :key="index"  @click.native="goDetail(item.cardUrl)">
                         <div slot="cardLeft" class="left">
                                 <avatar shape="square" :src="item.headImg"></avatar>
                                 <div class="left-wrapper">
                                     <p class="left-wrapper-title">{{item.userName}}</p>
                                     <div class="left-wrapper-desc">
                                         <a href="tel:">{{item.telPhone}}</a>
                                     </div>
                                 </div>
                         </div>
                                             </GridCard> -->
                  </div>
                  <div v-else>
                      <p class="noData">暂无工资变动记录</p>
                  </div>
                </scroll>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
 
    export default {
        name: "salaryChangeList",
        components: {
            ZingHead,Scroll
        },
        data() {
            return {
               personnelFileList: [],//列表数据
            }
        },
        created() {
            
        },
        methods:{
            onPullingUp() {
                // setTimeout(() => {
                //     if (this._isDestroyed) {
                //         return;
                //     }
                //     let pageN = parseInt(this.personnelFileList.length / 10) + 1
                //     if (pageN > this.pageNumber) {
                //         this.pageNumber = pageN
                //         this.getPersonnelFiles(this.pageNumber,this.file_status);
                //     }
                //     if (Math.random() > 0.5) {
                //         // 如果有新数据
                //         this.$refs.scroll.forceUpdate();
                //     } else {
                //         // 如果没有新数据
                //         this.$refs.scroll.forceUpdate();
                //     }
                // }, 1500);
            },
            scroll(val) {
                //let y = Math.abs(Math.round(val.y))
                //this.isShowTop = y > 425 ? true : false
            },
            gotoTop(){
                //this.$refs.scroll.scrollTo(0, 0, 300)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/unify.styl';
    .salaryChangeList {
        height 100%;
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow hidden
    }
    .noData{
        text-align: center;
        font-size: 18px;
        color: #ff8000;
        min-height: 100px;
        padding-top: 15px;
    }
</style>
