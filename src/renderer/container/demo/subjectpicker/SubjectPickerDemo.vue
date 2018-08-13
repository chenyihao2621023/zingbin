<template>
    <div>
        <div class="togglePicker" @click="togglePicker">点击选择科目</div>
        <div class="togglePicker" @click="togglePickerToTarget">点击选择科目（跳转到某个目录）</div>
        <div class="togglePicker" @click="togglePicker2">点击选择科目2</div>
        <pre class="output1 output">{{output}}</pre>
        <pre class="output2 output">{{output2}}</pre>
        <subject-picker ref="subPicker" :showPicker="showPicker" :multipleMode="true" :parentSubjectSelectable="true" :showDesc="false"
                        v-on:picked="onPicked" @abort="onPickAbort"></subject-picker>
    </div>
</template>

<script>
    import SubjectPicker from 'components/subjectpicker/SubjectPicker'

    export default {
        name: 'FlatTreeDemo',
        components: {
            SubjectPicker
        },
        data () {
            return {
                showPicker: false,
                output: '',
                output2: '',
                flag: NaN
            }
        },
        methods: {
            onPicked (item) {
//        console.log('vm', this)
                console.log('onPicked', item)
                if (this.flag === 1) {
                    this.output = JSON.stringify(item)
                } else if (this.flag === 2) {
                    this.output2 = JSON.stringify(item)
                }
                this.showPicker = false
            },
            onPickAbort () {
                this.showPicker = false
            },
            togglePicker () {
                this.flag = 1
                this.output = ''
                this.output2 = ''
                this.showPicker = true
            },
            togglePickerToTarget () {
                this.flag = 1
                this.output = ''
                this.output2 = ''
                this.$refs.subPicker.doLoadNav('suoyouzhequanyi')
                this.showPicker = true
            },
            togglePicker2 () {
                this.flag = 2
                this.output = ''
                this.output2 = ''
                this.showPicker = true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .togglePicker
        padding 50px
        background-color #1ca2ff

    .output
        min-height 100px
        overflow-x auto

    .output1
        background-color #0086b3

    .output2
        background-color #795da3
</style>
