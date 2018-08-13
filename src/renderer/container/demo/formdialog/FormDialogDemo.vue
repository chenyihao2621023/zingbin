<template>
    <div class="form-dialog-demo">
        <!-- 简单输入框 -->
        <form-dialog
            ref="dialog1"
            v-model="show1"
            :title="'操作提示'"
            :showForm="true"
            :formAttrs="formAttrs1"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <x-button @click.native="show1 = true">简单输入框</x-button>
        <!-- 简单选择框 -->
        <form-dialog
            ref="dialog2"
            v-model="show2"
            :title="'操作提示'"
            :showForm="true"
            :formAttrs="formAttrs2"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <x-button @click.native="show2 = true">简单选择框</x-button>
        <!-- 多项表单 -->
        <form-dialog
            ref="dialog3"
            v-model="show3"
            :title="'操作提示'"
            :showForm="true"
            :formAttrs="formAttrs3"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <x-button @click.native="show3 = true">多项表单</x-button>
        <!-- 多项表单（带初始值） -->
        <form-dialog
            ref="dialog4"
            v-model="show4"
            :title="'操作提示'"
            :showForm="true"
            :formAttrs="formAttrs4"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <x-button @click.native="showDialog4">多项表单（带初始值）</x-button>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import FormDialog from 'components/formdialog/FormDialog'

    export default {
        name: 'FormDialogDemo',
        components: {
            XButton,
            FormDialog
        },
        data () {
            return {
                show1: false,
                formAttrs1: [
                    {
                        type: 'text',
                        placeholder: '输入内容'
                    }
                ],
                show2: false,
                formAttrs2: [
                    {
                        type: 'select',
                        placeholder: '输入内容',
                        options: [
                            { key: 'a', value: '选项一' },
                            { key: 'b', value: '选项二' },
                            { key: 'c', value: '选项三' },
                        ]
                    }
                ],
                show3: false,
                formAttrs3: [
                    {
                        title: '内容',
                        type: 'text',
                        placeholder: '输入内容'
                    },
                    {
                        title: '内容2',
                        type: 'select',
                        placeholder: '选择内容',
                        options: [
                            { key: 'a', value: '选项一' },
                            { key: 'b', value: '选项二' },
                            { key: 'c', value: '选项三' },
                        ]
                    }
                ],
                show4: false,
                formAttrs4: [
                    {
                        title: '内容',
                        type: 'text',
                        placeholder: '输入内容'
                    },
                    {
                        title: '内容2',
                        type: 'select',
                        placeholder: '选择内容',
                        options: [
                            { key: 'a', value: '选项一' },
                            { key: 'b', value: '选项二' },
                            { key: 'c', value: '选项三' },
                        ]
                    }
                ],
                initialVals: ['123', 'b']
            }
        },
        methods: {
            onCancel() {
                console.log('onCancel')
            },
            onConfirm(msg) {
                console.log('onConfirm', msg)
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            showDialog4() {
                this.$refs.dialog4.setFormValues(this.initialVals)
                this.show4 = true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .form-dialog-demo
        width 100%
        height 100%
</style>
