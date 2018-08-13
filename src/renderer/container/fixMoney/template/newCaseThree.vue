<template>
    <div class="newcasethree">
        <div class="newcasethree-inner">
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
        name: "new-case-three",
        components:{
            GridCard,
            scroll,
            SubjectPicker,
            XButton,
        },
        props:{
            impairment:{
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
            impairment: {
                handler:function (newValue) {
                    newValue.forEach((val) => {
                        this.subject.push(val)
                    })
                },
                deep:true
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
            deleteItem(item,index) {
                this.subject.splice(index,1)
            }
        }
    }
</script>

<style>
    .newcasethree .left-wrapper-title{
        font-size: 14px !important;
        margin-bottom: 0px !important;
        padding: 5px 0;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .newcasethree{
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
