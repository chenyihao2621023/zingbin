<template>
    <div style="background-color: #fff; height: 150px; overflow-y: auto">
        <tag-group :items="items" @onChange="tagChanged"></tag-group>
    </div>
</template>

<script>
    import TagGroup from 'components/taggroup/TagGroup'

    export default {
        name: 'TagGroupDemo',
        components: {
            TagGroup
        },
        data () {
            return {
                items: [
                    { key: '澹澹', value: '77457459000000101' },
                    { key: '高佳睿', value: '76348858000001101' },
                    { key: '王雪颖', value: '64683887000000101' },
                    { key: '王国兴', value: '69372067000000101' },
                    { key: '宋丽妹', value: '64511982000001101' },
                    { key: '王锐测试号', value: '65190790000000101' },
                    { key: '小澹', value: '75383400000001101' },
                    { key: '王锐', value: '76953308000001101' },
                    { key: '安飞', value: '77543338000000101' },
                    { key: '同贺', value: '77543362000000101' },
                    { key: '王锐22', value: '77543383000000101' },
                    { key: '武究竟', value: '76348877000001101' },
                    { key: 'drggg', value: '77567787000000101' },
                    { key: '澹澹2', value: '87457459000000101' },
                    { key: '高佳睿2', value: '86348858000001101' },
                    { key: '王雪颖2', value: '84683887000000101' },
                    { key: '王国兴2', value: '89372067000000101' },
                    { key: '宋丽妹2', value: '84511982000001101' },
                    { key: '王锐测试号2', value: '85190790000000101' },
                    { key: '小澹2', value: '85383400000001101' },
                    { key: '王锐2', value: '86953308000001101' },
                    { key: '安飞2', value: '87543338000000101' },
                    { key: '同贺2', value: '87543362000000101' },
                    { key: '王锐33', value: '87543383000000101' },
                    { key: '武究竟2', value: '86348877000001101' },
                    { key: 'drggg2', value: '87567787000000101' }
                ]
            }
        },
        methods: {
            tagChanged (arr) {
                this.items = arr
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .togglePicker
        padding 50px
        background-color #1ca2ff
</style>
