<template>
    <div class="task_renwupingzhengform">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="任务凭证统计"></zing-head>

        <group>
            <selector title="任务集类型" placeholder="选择任务集分类" v-model="taskSetType" name="taskSetType"
                      :options="taskSetTypeList" @on-change="onChange"></selector>

            <selector title="子分类名称" placeholder="选择自定义子分类" v-model="taskSetType" name="taskSetType"
                      :options="taskSetTypeList" @on-change="onChange"></selector>

            <x-input title="任务集创建人" placeholder="选择任务集创建人" v-model="cardUrl"></x-input>

            <selector title="任务集名称" placeholder="选择任务集名称" v-model="taskSetType" name="taskSetType"
                      :options="taskSetTypeList" @on-change="onChange"></selector>

            <selector title="报表名称" placeholder="选择报表名称" v-model="taskSetType" name="taskSetType"
                      :options="taskSetTypeList" @on-change="onChange"></selector>

            <x-input title="凭证类型" placeholder="选择凭证类型，默认为全部" v-model="cardUrl"></x-input>

            <x-input title="统计科目" placeholder="选择科目，默认为全部" v-model="cardUrl"></x-input>

            <selector title="凭证范围" placeholder="选择凭证范围" v-model="ckType" name="taskSetType"
                      :options="ckTypeList" @on-change="onChange"></selector>


            <flexbox>
                <flexbox-item>
                    <x-button :gradients="['#40AFFC','#40AFFC']">重置</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button :gradients="['#FF8000','#FF8000']">查询</x-button>
                </flexbox-item>
            </flexbox>
        </group>
    </div>
</template>

<script>
    import {
        Selector , TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton,XInput
    } from 'vux'

    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'

    export default {
        name: "task_renwupingzhengform",
        components: {
            ZingHead, Selector, TransferDom, Confirm, Datetime, Cell, Group, Popup,
            Flexbox, FlexboxItem, XButton, FormDialog,XInput
        },
        data() {
            return {
                taskSetTypeList:[{key: 'gd', value: '广东'}, {key: 'gx', value: '广西'}],
                ckTypeList:[{key: '1', value: '全部凭证'}, {key: '2', value: '已结账凭证'},{key: '3', value: '已审核凭证'}, {key: '4', value: '未审核凭证'}],
                taskSetType:null,
                ckType:'全部凭证'
            }
        }, created() {

        },
        methods: {
            onChange (val) {
                console.log(val)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../../assets/stylus/variable.styl';
    @import '../../../../assets/stylus/mixin.styl';


    .task_renwupingzhengform {
        height 100%;

        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;

            .left {
                flex: 1;
                flex-center(row, start, center);

                .iconfont {
                    font-size: 36px;
                }

                &-wrapper {
                    margin-left: 10px;
                    flex: 1;

                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }

                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }

    }
</style>
<style type="text/css">

</style>


