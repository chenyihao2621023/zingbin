<template>
    <div class="flex">
        <div class="togglePicker" @click="togglePicker">点击选择同事</div>
        <div class="togglePicker" @click="togglePickerType">切换模式:rowId -- cardurl,当前:{{initialSelectedType}}</div>
        <div class="togglePicker" @click="toggleMultiple">切换 单选(false),多选(true)模式,当前:{{multiple}}</div>
        <div class="p10">---输出选中---</div>
        <pre class="output1 output">{{output}}</pre>
        <org-member-picker :showTab="showTab" :initialSelected="initialSelected" :initialSelectedType="initialSelectedType" :showPicker="showPicker"
                           :multiple="multiple" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
    </div>
</template>

<script>
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker'

    export default {
        name: 'OrgMemberPickerDemo',
        components: {
            OrgMemberPicker
        },
        data () {
            return {
                initialSelected: ["77457459000000101"],
                initialSelectedType: 'rowId',
                showPicker: false,
                multiple: true,
                output: '',
                showTab:["org","colleague","role","friends"]
            }
        },
        methods: {
            //确定的回调
            onPicked (list) {
                console.log('onPicked', list);
                this.output = list;
                this.showPicker = false
                if (this.initialSelectedType === 'rowId') {
                    this.initialSelected = list.map(item => item.rowId)
                } else {
                    this.initialSelected = list.map(item => item.cardUrl)
                }
            },
            //取消的回调
            onPickAbort () {
                this.showPicker = false
            },
            togglePicker () {
                this.flag = 1
                this.output = ''
                this.output2 = ''
                this.showPicker = true
            },
            togglePickerType () {
                if (this.initialSelectedType === 'rowId') {
                    this.initialSelectedType = 'cardUrl'
                    this.initialSelected = ['VJjqe26FVjumFvUruebAbAZv']
                } else {
                    this.initialSelectedType = 'rowId'
                    this.initialSelected = ["77457459000000101"]
                }
            },
            toggleMultiple () {
                this.multiple = !this.multiple
                if (!this.multiple) {
                    if (this.initialSelectedType === 'rowId') {
                        this.initialSelected = ['77457459000000101']
                    } else {
                        this.initialSelected = ["VJjqe26FVjumFvUruebAbAZv"]
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .flex
        display flex;
        flex-direction column;
        height:100%
    .p10
        padding 10px

    .togglePicker
        padding 30px
        background-color #1ca2ff

    .output
        min-height 100px
        overflow-x auto

    .output1
        background-color #0086b3

    .output2
        background-color #795da3
</style>
