<template>
    <div class="newcaseone">
        <div class="newcaseone-inner">
           <GridCard v-for="(item,index) in subject" :key="index">
               <div slot="cardLeft" class="left">
                   <div class="left-wrapper">
                       <p class="left-wrapper-title">{{item.fileId}}-{{item.filename}}</p>
                   </div>
               </div>
               <div slot="cardRight" class="right">
                   <i class="iconfont icon-shanchu3" @click="deleteItem(item,index)"></i>
               </div>
           </GridCard>
           <div class="addSubjectWrapper" @click="changeSubject">
               <x-button plain type="primary" class="addSubject">增加</x-button>
           </div>

        </div>

        <!--选择科目代码-->
        <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
    </div>
</template>

<script>
    import GridCard from '@/components/gridcard/GridCard'
    import scroll from '@/components/scroll/Scroll'
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import { XButton } from 'vux'
    export default {
        name: "new-case-one",
        components:{
            GridCard,
            scroll,
            SubjectPicker,
            XButton,
        },
        props:{
            original:{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data() {
            return {
                showPicker:false,
                subject:[]
            }
        },
        watch:{
            original: {
                handler:function (newValue) {
                    newValue.forEach((val) => {
                        this.subject.push(val)
                    })
                }
            }
        },
        methods:{
            getPickedData(data) {
                this.subject.push(data)
                this.showPicker = false;
                this.$emit("PickedData",this.subject)
            },
            subjectAbort() {
                this.showPicker = false;
            },
            changeSubject() {
                this.showPicker = true
            },
            //删除所选科目或者初始化科目
            deleteItem(item,index) {
                this.subject.splice(index,1)
            }
        }
    }
</script>
<style>
    .newcaseone .left-wrapper-title{
        font-size: 14px !important;
        margin-bottom: 0px !important;
        padding: 5px 0;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .newcaseone{
        overflow hidden
        height 100%
        &-inner{
            height 100%
        }
    }
    .addSubjectWrapper{
        position relative
        text-align left
        height 40px
        margin-top 15px
        .addSubject{
            position absolute
            left 0
            border-color #ff8000
            color:#ff8000
            width 125px
            line-height 40px
            line-height 40px
        }
    }
</style>
