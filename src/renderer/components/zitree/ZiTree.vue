<template>
    <ul :class="treeCls" class="zi-tree-ul">
        <li v-for="(item, index) in data"
            :key="index"
            class="zi-tree-li"
            :class="{[`${prefixCls}-treenode-disabled`]: item.disabled,[dropOverCls]: dragOverIndex === index,
        'filter-node': item.filter}"
            @dragover="dragover"
            @drop="drop(index,$event)"
            @dragenter="dragenter(index,$event)"
            @dragleave="dragleave(index,$event)"
            ref="node">
            <div class="span-wrapper" @click.prevent="setExpand(item.disabled, index, $event) && setSelect(item.disabled, index, $event)">
                <div class="span-wrapper-left">
            <span
                v-if="pc"
                :class="[
            `${prefixCls}-switcher`,
            {
                [`${prefixCls}-switcher-disabled`]: item.disabled,
                [`${prefixCls}-switcher-noop`]: item.isLeaf,
                [`${prefixCls}-switcher_${item.expanded ? 'open' : 'close'}`]: !item.isLeaf}]"
                @click="setExpand(item.disabled, index, $event)">
            </span>
                    <span
                        v-if="!item.isLeaf && showLine && !pc"
                        :class="[
            `${prefixCls}-switcher`,
            {
                [`${prefixCls}-switcher-disabled`]: item.disabled,
                [`${prefixCls}-switcher-noop`]: item.isLeaf,
                [`${prefixCls}-switcher_${item.expanded ? 'open' : 'close'}`]: !item.isLeaf}]"
                        @click="setExpand(item.disabled, index, $event)">
            </span>
                    <div class="avatar-wrapper" v-if="item.isLeaf && item[props.src] && showLine && !pc">
                        <avatar size="default" :src="item[props.src]"></avatar>
                    </div>
                    <div class="avatar-wrapper" v-if="item.isLeaf && !item[props.src] && showLine && !pc">
                        <avatar size="default" icon="myfill"></avatar>
                    </div>

                    <span
                        v-if="!showLine && !pc"
                        :class="[
            `${prefixCls}-switcher`,
            {
                [`${prefixCls}-switcher-disabled`]: item.disabled,
                [`${prefixCls}-switcher-noop`]: item.isLeaf,
                [`${prefixCls}-switcher_${item.expanded ? 'open' : 'close'}`]: !item.isLeaf}]"
                        @click="setExpand(item.disabled, index, $event)">
            </span>
                    <div class="avatar-wrapper" v-if="item.isLeaf && item[props.src] && !showLine && !pc">
                        <avatar size="default" :src="item[props.src]" :style="{backgroundColor: '#EA3C40'}"></avatar>
                    </div>
                    <div class="avatar-wrapper" v-if="item.isLeaf && !item[props.src] && !showLine && !pc">
                        <avatar v-if="item.icon && item.style" size="default" :icon="item.icon"
                                :style="item.style"></avatar>
                        <avatar v-else :size="'default'" icon="myfill"></avatar>
                    </div>

                    <span v-if="checkable && !radio" :class="checkboxCls(item)"
                          @click.prevent="setCheck(item.disabled || item.disableCheckbox, index, $event)">
                <span :class="prefixCls + '-checkbox-inner'"></span>
            </span>
                    <span v-if="!checkable && radio && item.isLeaf" :class="radioClasses(item)"
                          @click.prevent="setSelect(item.disabled, index, $event)">
                <span :class="prefixCls + '-radio-inner'">

                </span>

            </span>
                    <span :title="item[props.title]" :class="selectHandleCls(item)"
                          @click.prevent="setSelect(item.disabled, index, $event)" :draggable="draggable"
                          @dragstart="dragstart(index,$event)" @dragend="dragend">
                <span :class="`${prefixCls}-iconEle ${prefixCls}-icon_loading ${prefixCls}-icon__open`"
                      v-if="item.loading"></span>
                <span :class="prefixCls + '-title'" v-html="item[props.title]"></span>
            </span>
                    <span v-if="!item[props.auth] && item.isLeaf && !pc" :class="prefixCls + '-no-auth'">(未认证)</span>
                    <!--<span v-else-if="item[props.auth] == true && item.isLeaf && !pc">(认证)</span>-->
                    <span v-else-if="item[props.auth] == 'noShowAuth' && item.isLeaf && !pc"></span>

                </div>
                <div class="span-wrapper-right">
            <span v-if="moreBtn" class="more-btn" :ref="'editBtn'" @click.prevent="handleMenu($event, item)">
                <!--<dropdown height="auto" line-height="auto" :data="menuData" trigger="click" placement="bottomRight"-->
                <!--@item-click="handleMenu($event, item)"-->
                <!--:popupContainer="popupFun(index)">-->
                <!--<a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger" >-->
                <!--<i class="iconfont icon-gengduo"></i>-->
                <!--</a>-->
                <!--</dropdown>-->
                <i class="iconfont icon-gengduo"></i>
            </span>
                    <span v-if="editBtn" class="edit-btn" :ref="'editBtn'" @click.prevent="handleEdit(item,index,$event)">
                <i class="iconfont icon-gongzuo"></i>
            </span>

                    <span v-if="deleteBtn" @click.prevent="handleDelete(item,index,$event)">
                <i class="iconfont icon-shanchu"></i>
            </span>
                    <span v-if="addBtn" @click.prevent="handleAdd(item,index,$event)">
                <i class="iconfont icon-add"></i>
            </span>
                    <span v-if="item.isLeaf && chatBtn && item.source.cardUrl !== cardUrl" @click.prevent="handleChat(item,index,$event)">
                <i class="iconfont icon-icon--"></i>
            </span>
                    <span v-if="!item.isLeaf && explorerBtn" @click.prevent="handleExplorer(item,index,$event)">
                <i class="iconfont icon-icon_folder"></i>
            </span>

                </div>
            </div>

            <transition name="slide-up">
                <tree
                    v-if="!item.isLeaf"
                    :radio="radio"
                    :pc="pc"
                    :showLine="showLine"
                    :moreBtn="moreBtn"
                    :editBtn="editBtn"
                    :deleteBtn="deleteBtn"
                    :addBtn="addBtn"
                    :chatBtn="chatBtn"
                    :cardUrl="cardUrl"
                    :explorerBtn="explorerBtn"
                    :prefix-cls="prefixCls"
                    :data="item[props.children]"
                    :menuData="menuData"
                    :clue="`${clue}-${index}`"
                    :multiple="multiple"
                    :checkable="checkable"
                    :class="`${prefixCls}-child-tree-open`"
                    :props="props"
                    :defaultExpandAll="defaultExpandAll"
                    :selectedClue="selectedClue"
                    v-show="item.expanded"
                    :draggable="draggable"
                    :async="async"></tree>
            </transition>
        </li>
    </ul>
</template>
<script>
    import Avatar from '../avatar/Avatar'
    import Dropdown from '../dropdown/Dropdown'
    import emitter from '../../mixins/emitter';
    import { getOffset } from '../../utils/fn';
    import '../style/tree.css';

    export default {
        name: 'Tree',
        components: {
            Avatar,
            Dropdown
        },
        mixins: [emitter],
        props: {
            props: {
                type: Object,
                default() {
                    return {
                        title: 'title',
                        children: 'children',
                        src: 'src',
                        auth: 'auth'
                    }

                }
            },
            radio: {
                type: Boolean,
                default() {
                    return false
                }
            },
            pc: {
                type: Boolean,
                default() {
                    return false
                }
            },
            moreBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            editBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            deleteBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            addBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            chatBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            cardUrl: {
                type: String,
                default: '',
            },
            explorerBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            defaultExpandAll: {
                type: Boolean,
                default() {
                    return false
                }
            },
            selectedClue: {
                type: Number,
                default() {
                    return 1
                }
            },
            prefixCls: {
                type: String,
                default: 'zi-tree',
            },
            clue: {
                type: String,
                default: '0',
            },
            data: {
                type: Array,
                default: () => [],
            },
            menuData: {
                type: Array,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            checkable: {
                type: Boolean,
                default: false,
            },
            draggable: {
                type: Boolean,
                default: false,
            },
            canDrop: {
                type: Function,
                default: () => true,
            },
            showLine: {
                type: Boolean,
                default: false,
            },
            async: Function,
        },
        data: () => ({
            dragIndex: -1,
            dragOverIndex: -1,
            dropPosition: 0,
            dragCrossSameTree: false,

        }),
        computed: {
            treeCls() {
                if (this.clue === '0') {
                    return [
                        this.prefixCls,
                        { [`${this.prefixCls}-show-line`]: this.showLine },
                    ];
                }
                return [
                    `${this.prefixCls}-child-tree`,
                    { [`${this.prefixCls}-line`]: this.showLine },
                ];
            },
            dropOverCls() {
                let res;
                switch (this.dropPosition) {
                    case 0:
                        res = 'drag-over';
                        break;
                    case 1:
                        res = 'drag-over-gap-bottom';
                        break;
                    case -1:
                        res = 'drag-over-gap-top';
                        break;
                    default:
                }
                return res;
            },
        },
        watch: {
            data: {
                handler(now, old) {
                    this.setKey();
                    this.preHandle();
                },
                deep: true,
                immediate: true
            }

        },
        mounted() {
            this.setKey();
            this.preHandle();

            this.$on('nodeSelected', (params) => {
                if (this.clue !== '0') {
                    this.dispatch('Tree', 'nodeSelected', params);
                }

                if (!this.multiple && params.status) {
                    if (this !== params.origin) {

                        for (let i = 0; i < this.data.length; i++) {

                            this.$set(this.data[i], 'selected', false);
                        }
                    }
                    this.broadcast('Tree', 'cancelSelected', params.origin);
                }

                this.$emit('select', { selectedNodes: this.getSelectedNodes(), node: params.node });
            });
            this.$on('handleMenu', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'handleMenu', params);
                this.$emit('click-menu', { params })
            })
            this.$on('deleteNode', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'deleteNode', params);

                this.$emit('delete', params)
            })
            this.$on('editNode', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'editNode', params);

                this.$emit('edit', params)
            })
            this.$on('addNode', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'addNode', params);

                this.$emit('add', params)
            })
            this.$on('chatNode', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'chatNode', params);

                this.$emit('chat', params)
            })
            this.$on('explorerNode', (params) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'explorerNode', params);

                this.$emit('explorer', params)
            })
            this.$on('cancelSelected', (ori) => {
                this.broadcast('Tree', 'cancelSelected', ori);

                if (this !== ori) {
                    for (let i = 0; i < this.data.length; i++) {
                        this.$set(this.data[i], 'selected', false);
                    }
                }
            });

            this.$on('parentChecked', (params) => {

                if (this.clue === params.clue || this.clue.startsWith(`${params.clue}-`)) {
                    for (let i = 0; i < this.data.length; i++) {
                        this.$set(this.data[i], 'checked', params.status);
                        this.$set(this.data[i], 'childrenCheckedStatus', params.status ? 2 : 0);
                    }
                    this.broadcast('Tree', 'parentChecked', params);
                }
            });

            this.$on('childChecked2', (params) => {

//                let that = params.origin
                if (this.clue === '0') {
                    this.$nextTick(() => {
                        this.$emit('check2', {
                            checkedArr: this.getCheckedNodes(),
                            currentNode: params.node,
                            origin: params.origin
                        });
                    });
                }

                if (this === params.origin) return;

                for (const [i, item] of this.data.entries()) {
                    if (`${this.clue}-${i}` === params.clue) {
                        const temp = this.getChildrenCheckedStatus(item[this.props.children]);

                        if (temp !== item.childrenCheckedStatus) {
                            this.$set(this.data[i], 'checked', !!temp);
                            this.$set(this.data[i], 'childrenCheckedStatus', temp);
                        }

                        if (this.clue !== '0') {
                            this.dispatch('Tree', 'childChecked2', {
                                origin: params.origin,
                                clue: this.clue,
                                node: params.node
                            });
                        }
                    }
                }
            });
            this.$on('childChecked', (params) => {

//                let that = params.origin
                if (this.clue === '0') {
                    this.$nextTick(() => {
                        this.$emit('check', {
                            checkedArr: this.getCheckedNodes(),
                            currentNode: params.node,
                            origin: params.origin
                        });
                    });
                }
                if (this === params.origin) return;

                for (const [i, item] of this.data.entries()) {
                    if (`${this.clue}-${i}` === params.clue) {
                        // console.log(111)
                        const temp = this.getChildrenCheckedStatus(item[this.props.children]);

                        if (temp !== item.childrenCheckedStatus) {
                            this.$set(this.data[i], 'checked', !!temp);
                            this.$set(this.data[i], 'childrenCheckedStatus', temp);
                        }

                        if (this.clue !== '0') {
                            this.dispatch('Tree', 'childChecked', {
                                origin: params.origin,
                                clue: this.clue,
                                node: params.node
                            });
                        }
                    }
                }
            });
            this.$on('dragdrop', (sourceClue, targetClue, dropPosition) => {
                if (this.clue !== '0') return this.dispatch('Tree', 'dragdrop', [sourceClue, targetClue, dropPosition]);
                // 直接父级是否是同一个
                const sameTree = sourceClue.substr(0, sourceClue.length - 1) === targetClue.substr(0, targetClue.length - 1);
                sourceClue = sourceClue.split('-'); // [0,0,0,1]
                let sourceData = this.data;

                let _sourceData;
                let lastSourceIndex = sourceClue[sourceClue.length - 1] * 1; // 1
                for (let i = 1; i < sourceClue.length - 1; i++) {
                    const index = sourceClue[i];
                    if (i === 1) {
                        sourceData = sourceData[index];
                    } else {
                        sourceData = sourceData[this.props.children][index];

                    }
                }

                if (sourceClue.length > 2) {
                    _sourceData = JSON.parse(JSON.stringify(sourceData[this.props.children][lastSourceIndex])); // 0-0-0-0

                } else {
                    _sourceData = JSON.parse(JSON.stringify(sourceData[lastSourceIndex]));
                }

                targetClue = targetClue.split('-'); // [0,0,0,0]

                let targetData = this.data;

                const targetIndex = targetClue[targetClue.length - 1] * 1; //0

                for (let i = 1; i < targetClue.length - 1; i++) {
                    const index = targetClue[i];
                    if (i === 1) {
                        targetData = targetData[index];
                    } else {

                        targetData = targetData[this.props.children][index];
                    }
                }
                let syncDrop = function () {
                    let sourcePositionChange = false;
                    switch (dropPosition) {
                        case 0:
                            if (targetClue.length > 2) {

                                targetData = targetData[this.props.children][targetIndex];

                            } else {
                                targetData = targetData[targetIndex];
                            }

                            if (targetData[this.props.children]) {

                                targetData[this.props.children].push(_sourceData);
                            } else {

                                this.$set(targetData, this.props.children, [_sourceData]);
                            }
                            break;
                        case 1:
                            const p = targetIndex + (dropPosition === -1 ? 0 : dropPosition);
                            if (targetClue.length > 2) {
                                targetData[this.props.children].splice(p, 0, _sourceData);
                            } else {
                                targetData.splice(p, 0, _sourceData);
                            }
                            sourcePositionChange = sameTree && p <= lastSourceIndex;
                            break;
                        case -1: //
                            const p1 = targetIndex + (dropPosition === -1 ? 0 : dropPosition);
                            if (targetClue.length > 2) {
                                targetData[this.props.children].splice(p1, 0, _sourceData);
                            } else {
                                targetData.splice(p1, 0, _sourceData);
                            }
                            sourcePositionChange = sameTree && p1 <= lastSourceIndex;
                            break;
                        default:
                    }

                    if (sourcePositionChange) lastSourceIndex++;
                    if (sourceClue.length > 2) {
                        if (sourceData[this.props.children].length === 1) {
                            this.$delete(sourceData, this.props.children);
                        } else {
                            sourceData[this.props.children].splice(lastSourceIndex, 1);
                        }
                    } else {
                        sourceData.splice(lastSourceIndex, 1);
                    }
                }
                let canDrop; //true
                if (targetClue.length > 2 && !this.canDrop().then) {
                    canDrop = this.canDrop(_sourceData, targetData[this.props.children][targetIndex], dropPosition);
                    syncDrop.call(this)
                } else if (targetClue.length <= 2 && !this.canDrop().then) {
                    canDrop = this.canDrop(_sourceData, targetData[targetIndex], dropPosition);
                    syncDrop.call(this)
                } else if (targetClue.length > 2 && this.canDrop().then) {
                    canDrop = this.canDrop(_sourceData, targetData[this.props.children][targetIndex], dropPosition);
                    canDrop.then(res => {
                        if (res) {
                            syncDrop.call(this)
                        }
                    })
                } else if (targetClue.length <= 2 && this.canDrop().then) {
                    canDrop = this.canDrop(_sourceData, targetData[targetIndex], dropPosition);
                    canDrop.then(res => {
                        if (res) {
                            syncDrop.call(this)
                        }
                    })
                }
            });
        },
        methods: {
            popupFun(index) {
                return () => {
                    return this.$refs['editBtn'][index]
                }
            },
            handleMenu(menu, node) {
                menu.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('handleMenu', { menuItem: menu, node: node });
                } else {
                    this.dispatch('Tree', 'handleMenu', { menuItem: menu, node: node });
                }
            },
            handleDelete(item, index, ev) {
                ev.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('deleteNode', { origin: item });
                } else {
                    this.dispatch('Tree', 'deleteNode', { origin: item });
                }
            },
            handleEdit(item, index, ev) {
                ev.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('editNode', { origin: item });
                } else {
                    this.dispatch('Tree', 'editNode', { origin: item });
                }
            },
            handleAdd(item, index, ev) {
                ev.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('addNode', { origin: item });
                } else {
                    this.dispatch('Tree', 'addNode', { origin: item });
                }
            },
            handleChat(item, index, ev) {
                ev.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('chatNode', { origin: item });
                } else {
                    this.dispatch('Tree', 'chatNode', { origin: item });
                }
            },
            handleExplorer(item, index, ev) {
                ev.stopPropagation();
                if (this.clue === '0') {
                    this.$emit('explorerNode', { origin: item });
                } else {
                    this.dispatch('Tree', 'explorerNode', { origin: item });
                }
            },
            dragstart(index, ev) {
                ev.stopPropagation();
                this.dragIndex = index;
                ev.dataTransfer.setData('dragClue', `${this.clue}-${index}`);
            },
            dragover(ev) {
                ev.preventDefault();
                ev.stopPropagation();
            },
            drop(index, ev) {
                ev.stopPropagation();
                this.dragOverIndex = -1;
                const dragClue = ev.dataTransfer.getData('dragClue');
                const selfClue = `${this.clue}-${index}`;

                // 如果拖拽的对象不是自己的父辈级
                if (!selfClue.startsWith(dragClue)) {
                    if (this.clue === '0') {
                        this.$emit('dragdrop', dragClue, selfClue, this.dropPosition);
                    } else {
                        this.dispatch('Tree', 'dragdrop', [dragClue, selfClue, this.dropPosition]);
                    }
                }
            },
            dragenter(index, ev) {
                ev.preventDefault();
                ev.stopPropagation();
                if (this.dragIndex === index) return;
                if (this.dragOverIndex > -1) this.dragCrossSameTree = true;
                this.dragOverIndex = index;
                const offset = getOffset(this.$refs.node[index]);
                const offsetTop = offset.top;
                const offsetHeight = offset.bottom - offset.top;
                const pageY = ev.pageY;
                const gapHeight = 2;

                if (pageY > offsetTop + offsetHeight - gapHeight) {
                    this.dropPosition = 1;
                } else if (pageY < offsetTop + gapHeight) {
                    this.dropPosition = -1;
                } else {
                    this.dropPosition = 0;
                }
                this.$set(this.data[index], 'expanded', true);
            },
            dragleave(index, ev) {
                ev.stopPropagation();
                if (this.dragIndex === index) return;
                if (this.dragCrossSameTree) {
                    this.dragCrossSameTree = false;
                } else {
                    this.dragOverIndex = -1;
                }
            },
            dragend(ev) {
                ev.stopPropagation();
                this.dragIndex = -1;
            },
            treeNodeCls(item) {
                return {
                    [`${this.prefixCls}-treenode-disabled`]: item.disabled,
                };
            },
            checkboxCls(item) {
                return [
                    `${this.prefixCls}-checkbox`,
                    {
                        [`${this.prefixCls}-checkbox-disabled`]: item.disabled || item.disableCheckbox,
                        [`${this.prefixCls}-checkbox-checked`]: item.checked && item.childrenCheckedStatus === 2,
                        [`${this.prefixCls}-checkbox-indeterminate`]: item.checked && item.childrenCheckedStatus === 1,
                    },
                ];
            },
            radioClasses(item) {
                return [
                    `${this.prefixCls}-radio`,
                    { [`${this.prefixCls}-radio-checked`]: item.selected },
                    { [`${this.prefixCls}-radio-checked-${item.selected ? 1 : 0}`]: !!item.selected },
                    { [`${this.prefixCls}-radio-disabled`]: item.disabled },
                ];
            },
            radioCls(item) {
                let result = item.checked ? 1 : 0
                return result
            },
            selectHandleCls(item) {
                const wrap = `${this.prefixCls}-node-content-wrapper`;

                return [
                    wrap,
                    `${wrap}-normal`,
                    {
                        [`${this.prefixCls}-node-selected`]: !item.disable && item.selected,
                        draggable: this.draggable,
                    },
                ];
            },
            setKey() {
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i].clue = `${this.clue}-${i}`;
                }
            },
            preHandle() {

                for (const [i, item] of this.data.entries()) {
                    if (!item[this.props.children]) {
                        this.$set(item, 'isLeaf', true);
                        this.$set(item, 'childrenCheckedStatus', 2);
                        this.dispatch('Tree', 'childChecked2', { origin: this, clue: this.clue, node: this.data[i] })
                        continue;
                    }
                    this.dispatch('Tree', 'childChecked2', { origin: this, clue: this.clue, node: this.data[i] })
                    this.$set(item, 'isLeaf', false);
                    if (this.defaultExpandAll && !item.hasOwnProperty('expanded')) {
                        this.$set(item, 'expanded', true);
                    }
                    if (this.clue.split('-').length < this.selectedClue) {
                        this.$set(item, 'expanded', true);
                    }
                    if (item.checked && !item.childrenCheckedStatus) {
                        this.$set(item, 'childrenCheckedStatus', 2);
                        this.broadcast('Tree', 'parentChecked', {status: true, clue: `${this.clue}-${i}`});
                    } else if (item[this.props.children].length) {
                        const status = this.getChildrenCheckedStatus(item[this.props.children]);
                        status && this.$set(item, 'childrenCheckedStatus', status)
                        if (status !== 0) {
                            this.$set(item, 'checked', true);
                        }
                    }
                }
            },
            async setExpand(disabled, index, ev) {
                ev.stopPropagation();
                if (!disabled) {
                    const expanded = !this.data[index].expanded;
                    this.$set(this.data[index], 'expanded', expanded);
                    if (expanded && this.data[index][this.props.children] && !this.data[index][this.props.children].length && this.async) {
                        this.$set(this.data[index], 'loading', true);
                        const data = await this.async(this.data[index]);
                        this.data[index][this.props.children] = data;
                        this.$set(this.data[index], 'loading', false);
                    }
                }
            },
            setSelect(disabled, index, ev) {
                ev.stopPropagation();
                if (!disabled) {
                    const selected = !this.data[index].selected;

                    if (this.multiple || !selected) {
                        this.$set(this.data[index], 'selected', selected);
                    } else {
                        for (let i = 0; i < this.data.length; i++) {
                            if (i === index) {
                                this.$set(this.data[i], 'selected', true);
                            } else {
                                this.$set(this.data[i], 'selected', false);
                            }
                        }
                    }

                    if (this.clue === '0') {
                        this.$emit('nodeSelected', { origin: this, status: selected, node: this.data[index] });
                    } else {
                        this.dispatch('Tree', 'nodeSelected', { origin: this, status: selected, node: this.data[index] });
                    }
                }
            },
            setCheck(disabled, index, ev) {
                ev.stopPropagation();
                if (disabled) return;
                const checked = !this.data[index].checked;
                if (this.radio) {
                    for (let i = 0; i < this.data.length; i++) {
                        if (i === index) {
                            this.$set(this.data[i], 'checked', true);
                        } else {
                            this.$set(this.data[i], 'checked', false);
                        }
                    }
                } else {
                    this.$set(this.data[index], 'checked', checked);
                    this.$set(this.data[index], 'childrenCheckedStatus', checked ? 2 : 0);
                }

                if (this.clue === '0') {
                    this.$emit('childChecked', { origin: this, clue: this.clue, node: this.data[index] });
                } else {
                    this.dispatch('Tree', 'childChecked', { origin: this, clue: this.clue, node: this.data[index] });
                }

                this.broadcast('Tree', 'parentChecked', {
                    status: checked,
                    clue: `${this.clue}-${index}`,
                    node: this.data[index]
                });
            },

            getNodes(data, opt) {

                data = data || this.data;
                let res = [];

                for (const node of data) {
                    let tmp = true;
                    for (const [key, value] of Object.entries(opt)) {
                        if (node[key] !== value) {
                            tmp = false;
                            break;
                        }
                    }
                    if (tmp) {
                        res.push(node);
                    }
                    if (node[this.props.children] && node[this.props.children].length) {
                        res = res.concat(this.getNodes(node[this.props.children], opt));
                    }
                }
                return res;
            },
            setCheckedNodes(opt) {
                this.setIsLeaf({children2: this.data}, "研发部")
            },
            setIsLeaf(leaf, name) {
                if (leaf.leaf === name) {
                    this.$set(leaf, 'checked', true)
                }
                if (leaf.children2) {
                    leaf.children2.forEach(leaf => this.setIsLeaf(leaf, name))
                }
            },
            getSelectedNodes() {
                return this.getNodes(this.data, { selected: true });
            },
            getCheckedNodes() {
                return this.getNodes(this.data, { checked: true, childrenCheckedStatus: 2 });
            },
            getNoCheckedNodes() {
                return this.getNodes(this.data, { checked: false });
            },
            getNodeById(key, id) {
                return this.getNodes(this.data, { [key]: id });
            },
            getLeafChecked(node) {
                return this.getNodes([node], node.checked ? {
                    checked: node.checked,
                    isLeaf: true,
                    childrenCheckedStatus: 2
                } : { checked: node.checked, isLeaf: true })
            },
            filterCheck(arr, checked, key) {

                arr.forEach(item => {
                    if (item.hasOwnProperty(key)) {
                        this.getNodeById(key, item[key]).forEach(node => {
                            this.$set(node, 'checked', checked)
                        })
                    }

                })
            },
            filterSelect(selectedArr, key) {
                selectedArr.forEach(item => {
                    if (item.hasOwnProperty(key)) {
                        this.getNodeById(key, item[key]).forEach(node => {
                            this.$set(node, 'selected', item.selected)
                        })
                    }
                })
            },
            clearSelect() {
                this.getSelectedNodes().forEach(item => {
                    this.$set(item, 'selected', false)
                })
            },
            getHalfCheckedNodes() {
                return this.getNodes(this.data, { checked: true, childrenCheckedStatus: 1 });
            },
            getChildrenCheckedStatus(children) {
                let checkNum = 0;
                let childChildrenAllChecked = true;
                for (const child of children) {
                    if (child.checked) {
                        checkNum++;
                    }
                    if (child.childrenCheckedStatus !== 2) {
                        childChildrenAllChecked = false;
                    }
                }
                // 全选
                if (checkNum === children.length) {
                    return childChildrenAllChecked ? 2 : 1;
                    // 部分选择
                } else if (checkNum > 0) {
                    return 1;
                }
                return 0;
            },
            edit(path, action, data) {

                path = path.split('-');
                const isTopNode = path.length === 2;

                let node = this.data;
                const lastIndex = path.pop();

                if (!isTopNode) node = node[path[1]];
                path.splice(0, 2);

                for (const i of path) {
                    node = node[this.props.children][i];
                }
                switch (action) {
                    case 'delete':
                        if (isTopNode) {
                            node.splice(lastIndex, 1);
                        } else {
                            node[this.props.children].splice(lastIndex, 1);
                            if (node[this.props.children] === 0) {
                                this.$delete(node, this.props.children);
                            }
                        }
                        break;
                    case 'add':
                        let child;
                        if (isTopNode) {
                            child = node[lastIndex];
                        } else {
                            child = node[this.props.children][lastIndex];
                        }
                        if (child[this.props.children]) {
                            child[this.props.children].push(data);
                        } else {
                            this.$set(child, this.props.children, [data]);
                        }
                        break;
                    case 'edit':
                        node = isTopNode ? node[lastIndex] : node[this.props.children][lastIndex];

                        for (const [key, val] of Object.entries(data)) {
                            node[key] = val;
                        }
                        break;
                    default:
                        break;
                }
            },
            editNode(path, data) {
                this.edit(path, 'edit', data);
            },
            addNode(path, data) {
                if (path === '0') return this.data.push(data);
                this.edit(path, 'add', data);
            },
            delNode(path) {
                this.edit(path, 'delete');
            },
        },
    };
</script>
