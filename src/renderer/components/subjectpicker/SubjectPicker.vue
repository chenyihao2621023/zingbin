<template>
    <div class="subject-picker" v-transfer-dom>
        <popup v-model="showPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="subject-picker-popup">
                <zing-head class="subject-picker-head" :title="'选择科目类别'" :isComeBack="false"
                           @doSome="backClick"></zing-head>
                <tree-nav class="subject-picker-nav" :navList="treeNavList" @navClicked="onNavClicked"></tree-nav>
                <tree-detail-panel class="subject-picker-detail" :multipleMode="multipleMode"
                                   :branchSelectable="branchSelectable" :list="treeListMapped"
                                   @branchClicked="onBranchClicked" @leafClicked="onLeafClicked"
                                   @checkChange="onCheckChange"></tree-detail-panel>
                <x-button class="subject-picker-button" type="primary" v-show="pickButtonAvalible"
                          :disabled="currentSelected.length === 0" @click.native="checkSelected">选择
                </x-button>
            </div>
        </popup>
    </div>
</template>

<script>
    import { Popup, TransferDomDirective as TransferDom, XButton } from 'vux'
    import ZingHead from '../zingHead/ZingHead'
    import TreeNav from '../flattree/TreeNav'
    import TreeDetailPanel from '../flattree/TreeDetailPanel'
    import { deepCopy } from '../../utils/fn'

    export default {
        name: 'SubjectPicker',
        components: {
            Popup,
            XButton,
            ZingHead,
            TreeNav,
            TreeDetailPanel
        },
        directives: {
            TransferDom
        },
        props: {
            multipleMode: {  // 是否多选
                type: Boolean,
                default: false
            },
            parentSubjectSelectable: {  // 是否可选父级科目
                type: Boolean,
                default: false
            },
            showPicker: {  // 是否显示
                type: Boolean,
                default: function () {
                    return false
                }
            },
            showDesc: {   // 是否内容显示为业务描述
                type: Boolean,
                default: function () {
                    return false
                }
            }
        },
        data () {
            return {
                currentT: '',
                treeNavData: {},
                treeNavList: [
                    /*
                     { name: '科目设置', tid: '1', hasChild: true },
                     { name: '资产', tid: '2' }
                     */
                ],
                treeList: [
                    /*
                     {
                        id: '32',
                        type: 'branch',
                        title: '资产',
                        tid: '2',
                        source: {...}
                     },
                     {
                        id: '33',
                        type: 'leaf',
                        title: '1002(银行存款)'
                        tid: '1',
                        source: {...}
                     },
                     */
                ],
                branchSelectable: false,
                currentSelected: []
            }
        },
        computed: {
            pickButtonAvalible () {
                if (!this.treeNavData[this.currentT]) return false
                let curNav = this.treeNavData[this.currentT]
                return curNav['hasChild'] ? this.branchSelectable : this.multipleMode
            },
            treeListMapped () {
                return this.treeList.map(item => {
                    /*if (item.type && item.type === 'branch') {
                     item.src = require('../../assets/img/folder.png')
                     } else {
                     item.src = require('../../assets/img/file.png')
                     }*/
//          item.fallbackSrc = 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff'
                    return item;
                })
            }
        },
        watch: {
            showPicker (isShown) {
                // 每次显示重置
                if (!isShown && this.treeNavData['kemushezhi']) {
                    this.doLoadNav()
                }
            }
        },
        beforeMount () {
//      console.log('subjectpicker beforeMount')

           // let url = 'https://easy-mock.com/mock/5a6840b43d63972d717dc5b4/webapp/subject/tree/queryall'
//            let url = '/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action'
            let url = '/ZingMH/ZDesk/measureUnit/mater/selectTreeNode.action?recordType=subject'
//            this.$http.post(url, { recordType: 'subject' })
            this.$http.post(url, {})
                .then(res => {
                    if (!res.data.success) {
                        console.error('loadsubject error', res)
                        return
                    }

                    let data = res.data.data.data.data
                    this.handleData(data)
                    this.doLoadNav()
                })
                .catch(err => {
                    console.error(err);
                });
        },
        methods: {
            backClick () {
//        console.log('onBack')
                this.$emit('abort')
            },
            onNavClicked (nav) {
//        console.log('onNavClicked', nav)
                this.doLoadNav(nav.tid)
            },
            onBranchClicked (item) {
//        console.log('onBranchClicked', item)
                this.doLoadNav(item.tid)
            },
            onLeafClicked (item) {
//        console.log('onLeafClicked', item)
                // 多选情况下失效
                if (this.multipleMode) return
                let dt = deepCopy(item.source)
                dt.tid = item.tid
                this.$emit('picked', dt)
            },
            checkSelected () {
                if (this.currentSelected.length === 0) return

                if (!this.multipleMode) {
                    if (this.currentSelected.length > 0) {
                        let dt = deepCopy(this.currentSelected[0].source)
                        dt.tid = this.currentSelected[0].tid
                        this.$emit('picked', dt)
                    }
                } else {
                    // console.log('checkSelected: ', this.currentSelected)
                    let retArr = this.currentSelected.map(item => {
                        let dt = deepCopy(item.source)
                        dt.tid = item.tid
                        return dt
                    })
                    this.$emit('picked', retArr)
                }
//                console.log('vm', this)
            },
            onCheckChange (list, dataList) {
//        console.log('onCheckChange', list, dataList)
//                 this.currentSelected = dataList.map(item => item.source)
                this.currentSelected = dataList
            },
            doLoadNav (tid) {
                if (!tid) {
                    this.currentT = 'kemushezhi'
                    this.treeNavList = this.treeNavData['kemushezhi'].treeNav
                    this.treeList = this.treeNavData['kemushezhi'].treeList
                    // 分支可选中判断
                    if (!this.parentSubjectSelectable) this.branchSelectable = false
                    else this.branchSelectable = this.treeNavData['kemushezhi'].selectable
                } else {
//          console.log(tid, this.treeNavData[tid])
                    this.currentT = tid
                    this.treeNavList = this.treeNavData[tid].treeNav
                    this.treeList = this.treeNavData[tid].treeList
                    // 分支可选中判断
                    if (!this.parentSubjectSelectable) this.branchSelectable = false
                    else this.branchSelectable = this.treeNavData[tid].selectable
                }
//        console.log('doLoadNav', this.branchSelectable)
            },
            handleData (data) {
                let tmpNavData = {}
                let tmpObjList = []
                let tmpObjMap = {}
                data.forEach(item => {
                    let tid = item.parentId

                    if (!tmpNavData[tid]) {
                        let navObj = {}
                        // 判断层级是否为固定层级
                        if (item['level']) {
                            navObj.selectable = true
                        } else {
                            navObj.selectable = false
                        }
                        tmpNavData[tid] = navObj
                    }

                    let obj = {}
                    obj.id = item.fileId
                    obj.tid = tid
                    // 没有level则显示filename，有leval并且showDesc显示业务描述，其它显示fileId + '(' + filename + ')'
                    obj.title = item['level'] ? this.showDesc ? item.description : item.fileId + '(' + item.filename + ')' : item.text
                    if (!obj.title) console.log(obj)
                    obj.source = item

                    if (!tmpNavData[tid]['treeList']) {
                        tmpNavData[tid]['treeList'] = []
                    }
                    tmpNavData[tid]['treeList'].push(obj)
                    tmpObjList.push(obj)
                    tmpObjMap[item.fileId] = obj
                })

                // 生成路径导航
//          console.log('tmpNavData', tmpNavData)
                Object.keys(tmpNavData).forEach(key => {
                    let navObj = tmpNavData[key]
                    let treeNav = []

                    if (key && key !== 'kemushezhi') {
                        let obj = tmpObjMap[key]
                        if (!tmpObjMap[key]) {
                            return
                        }
                        genTreeNav(obj, treeNav, tmpObjMap)
                    }
                    treeNav.push({ name: '科目设置', tid: 'kemushezhi' })
                    treeNav = treeNav.reverse()

                    navObj['treeNav'] = treeNav
//            console.log('treeNav', navObj['treeNav'])
                })

                // 确定枝还是叶
                tmpObjList.forEach(item => {
                    if (tmpNavData[item.source.fileId]) {
                        item.type = 'branch'
                        item.tid = item.source.fileId
                        // 标识对应父目录层级关系
                        let pid = item.source.parentId
                        let navObj = tmpNavData[pid]
                        if (!navObj['hasChild']) {
                            navObj['hasChild'] = true
                        }
                    } else {
                        item.type = 'leaf'
                    }
                })

                this.treeNavData = tmpNavData
                console.log('treeNavData', tmpNavData)
            }
        }
    }

    function genTreeNav (obj, lst, tmpObjMap) {
//    console.log(obj)
        let nav = {}
        nav.tid = obj.id
        // 路径名称显示为filename
        nav.name = obj.source['level'] ? obj.source.filename : obj.source.text
        lst.push(nav)

        let pid = obj.tid
        if (pid && pid !== 'kemushezhi') {
//      console.log('genTreeNav', obj, tmpObjMap[pid])
            genTreeNav(tmpObjMap[pid], lst, tmpObjMap)
        }
    }
</script>

<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .subject-picker
        .vux-popup-dialog{
            z-index :20000;
        }
        .subject-picker-popup
            display flex
            flex-direction column
            background-color $component-background
            width 100%
            height 100%
            .subject-picker-head
                flex-shrink 0
                margin-bottom $line-height-computed * 0.5
            .subject-picker-head-left
                flex-center(row, space-between, left)
                .subject-picker-back
                    font-size 25px !important
                    color #000000 !important
                    padding-right 3px
            .subject-picker-title
                font-weight 400
                font-size 18px
            .subject-picker-nav
                flex-shrink 0
            .subject-picker-detail
                flex-grow 1
                overflow-y auto
            .subject-picker-button
                flex-shrink 0
                width calc(100% - 6px)
                margin-bottom 3px
</style>
