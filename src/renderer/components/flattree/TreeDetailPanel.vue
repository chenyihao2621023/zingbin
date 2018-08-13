<template>
    <div class="tree-detail-panel">
        <check-panel class="branch-list" v-model="branchChecklist" :max="multipleMode ? NaN : 1"
                     :disabled="!branchSelectable" @on-change="branchCheckChange"
                     :labelPosition="labelPosition"
                     :list="branchList" :type="branchListType" @on-img-error="onImgError"
                     @on-click-item="onClickItem"></check-panel>
        <check-panel class="leaf-list" v-model="leafChecklist" :max="multipleMode ? NaN : 1"
                     @on-change="leafCheckChange" :disabled="!multipleMode"
                     :labelPosition="labelPosition"
                     :list="leafList" :type="leafListType" @on-img-error="onImgError" @on-click-item="onClickItem"></check-panel>
    </div>
</template>

<script>
    import { Panel } from 'vux'
    import CheckPanel from '../checkpanel/CheckPanel'
    import { deepCopy } from '../../utils/fn'

    export default {
        name: 'TreeDetailPanel',
        components: {
            Panel,
            CheckPanel
        },
        props: {
            branchSelectable: {
                type: Boolean,
                default: false
            },
            branchListType: {
                type: String,
                default: '3'
            },
            multipleMode: {
                type: Boolean,
                default: false
            },
            leafListType: {
                type: String,
                default: '2'
            },
            labelPosition: {
                type: String,
                default: 'left'
            },
            list: {  // 树列表
                type: Array,
                default: function () {
                    return [
                        /*
                         {
                         src: 'http://somedomain.somdomain/x.jpg',
                         fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                         title: '标题一',
                         },
                         {
                         src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                         fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                         title: '标题二',
                         }
                         */
                    ]
                }
            }
        },
        data () {
            return {
                branchChecklist: [],
                leafChecklist: []
            }
        },
        computed: {
            keyMap () {
                let map = {}
                this.list.forEach(item => {
                    map[item.id] = item
                })
                return map
            },
            branchList () {
                let list = this.list.filter(item => {
                    return item.type && item.type === 'branch'
                })
                list.forEach(item => {
                    item.key = item.id
                })
                return list
            },
            branchKeyList () {
                return this.branchList.map(item => {
                    return item.key
                })
            },
            leafList () {
                let list = this.list.filter(item => {
                    return !item.type || item.type !== 'branch'
                })
                list.forEach(item => {
                    item.key = item.id
                })
                return list
            },
            leafKeyList () {
                return this.leafList.map(item => {
                    return item.key
                })
            },
            checkList () {
                return this.branchChecklist.concat(this.leafChecklist)
            }
        },
        watch: {
            list () {
                this.branchChecklist = []
                this.leafChecklist = []
            },
            checkList (list) {
                let that = this
                this.$emit('checkChange', list, list.map(key => that.keyMap[key]))
            }
        },
        methods: {
            onImgError (item, $event) {
                console.error(item, $event)
            },
            onClickItem (item) {
//        console.log(item)
                if (item.type && item.type === 'branch') {
                    this.$emit('branchClicked', item)
                } else {
                    this.$emit('leafClicked', item)
                }
            },
            branchCheckChange (vals) {
//                console.log('branchCheckChange', vals)
                this.$emit('branchCheckChange', vals)
            },
            leafCheckChange (vals) {
//                console.log('leafCheckChange', vals)
                this.$emit('leafCheckChange', vals)
            },
            /**
             * 选中所有
             */
            checkAll () {
                this.leafChecklist = deepCopy(this.leafKeyList)
                if (this.branchSelectable) {
                    this.branchChecklist = deepCopy(this.branchKeyList)
                }
            },
            /**
             * 取消选中所有
             */
            uncheckAll () {
                this.leafChecklist = []
                if (this.branchSelectable) {
                    this.branchChecklist = []
                }
            }
        }
    }
</script>

<style lang="stylus">
    .tree-detail-panel
        display block !important
        .weui-panel
            margin-top 0
        .branch-list
            .weui-media-box_small-appmsg
                .weui-cell__hd
                    display none
        .leaf-list
            .weui-media-box_text
                padding 10px 15px
                .weui-media-box__title
                    margin-bottom 0
</style>
