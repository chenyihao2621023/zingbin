<template>
    <div class="attenWeekTem">
        <popup v-model="showAttenWeekPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="subject-picker-popup">
                <ZingHead title="考勤日期" :isComeBack="false" @doSome="doSome">
                </ZingHead>
                <div class="tree-detail-panel subject-picker-detail">
                        <checklist  :options="commonList" v-model="fullValues" ></checklist>
                </div>
                <x-button style="margin-bottom: 0px;" class="subject-picker-button" type="primary" :disabled="fullValues.length === 0" 
                        @click.native="getFullValue">保存
                </x-button>
            </div>
        </popup>
    </div>
</template>


<script>
    import {Popup ,Checklist ,XButton} from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead"
    export default {
        components: {
            ZingHead,Popup,Checklist,XButton
        },
        props:{
            showAttenWeekPicker: {//日历是否显示的标识
                type: Boolean,
                default: function () {
                    return false
                }
            },
            selWeekKey:""
        },
        data () {
            return {
                commonList: [{key: '0', value: '星期日'}, 
                             {key: '1', value: '星期一'}, 
                             {key: '2', value: '星期二'},
                             {key: '3', value: '星期三'},
                             {key: '4', value: '星期四'},
                             {key: '5', value: '星期五'},
                             {key: '6', value: '星期六'}],
                fullValues: []
                
            }
        },
        watch: {
            selWeekKey(val){
                 this.fullValues = val.split(",")
            }
        },
        created: function () {
        },
        methods: {
           doSome () {
                this.$emit('goAttenSetting')
           },
           getFullValue () {
                let map = {}
                this.commonList.forEach(item => {
                    map[item.key] = item.value
                })
                let valueList = []
                this.fullValues.forEach(id => {
                    valueList.push(map[id])
                })
                this.$emit('selWeekClicked',this.fullValues.join(","),valueList.join(","))
           }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .attenWeekTem
        .subject-picker-popup
            display flex
            flex-direction column
            background-color $component-background
            width 100%
            height 100%
            .subject-picker-detail
                flex-grow 1
                overflow-y auto
            .subject-picker-button
                flex-shrink 0
                width calc(100% - 6px)
                margin-bottom 3px
</style>
