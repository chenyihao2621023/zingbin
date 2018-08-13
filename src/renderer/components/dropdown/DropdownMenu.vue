<template lang="html">
    <transition name="fade">
        <ul ref="list"
            class="el-dropdown-menu el-dropdown-menu-vertical"
            :class="dropdownMenuCls"
            @mouseenter="mouseEnter($event)"
            @mouseleave="mouseLeave($event)">
            <template v-for="(item, index) in data">
                <li v-if="item.divided" class="el-dropdown-menu-item-divider"></li>
                <li :class="getItemCls(item)" :id="item.idSepc ? item.idSepc : getItemId(item)" :trigger="trigger" @click="clickMenuItem(item, $event)">
                    <template v-if="item.children && item.children.length">
                        <div ref="submenu"
                             class="el-dropdown-menu-submenu-title"
                             @mouseenter="toggleOpen(true)"
                             @mouseout="toggleOpen(false)"
                             @click="clickSubmenu(item, $event)">{{item.content}}</div>
                            <dropdown-menu :data="item.children" :trigger="trigger" type="sub"></dropdown-menu>
                    </template>
                    <template v-else>
                        {{item.content}}
                    </template>
                    <i class="red-dot" v-if="item.isRed"></i>
                </li>
            </template>
        </ul>
    </transition>
</template>

<script lang="babel">
    import emitter from '../../mixins/emitter.js';
    import { createId } from '../../utils/fn.js';

    const Trigger = ['click', 'hover'];
    export default {
        name: 'DropdownMenu',
        mixins: [emitter],
        props: {
            type: {
                required: false,
                type: String,
                default: 'root',
            },
            data: {
                required: false,
                type: Array,
            },
            hide: {
                type: Boolean,
                default: true,
            },
            trigger: {
                required: false,
                type: String,
                default: 'hover',
                validator: (value) => {
                    const find = Trigger.indexOf(value) !== -1;
                    return find;
                },
            },
        },
        data: () => ({
            isOpen: false,
        }),
        computed: {
            dropdownMenuCls() {
                if (this.type === 'root') {
                    return ['el-dropdown-menu-light', 'el-dropdown-menu-root'];
                } else if (this.type === 'sub') {
                    return [
                        'el-dropdown-menu-sub',
                        { 'el-dropdown-menu-hidden': !this.isOpen },
                    ];
                }
            },
        },
        mounted() {
            if (this.trigger === 'hover') {
                const { mouseEnter, mouseLeave } = this;
                const listElm = this.$refs.list;
                listElm.addEventListener('mouseenter', mouseEnter);
                listElm.addEventListener('mouseleave', mouseLeave);
            }
        },
        created() {
            this.$on('showSubmenu', (source) => {
                if (this === source) {
                    return;
                }
                clearTimeout(this.timeout);
                this.isOpen = true;
                this.dispatch('DropdownMenu', 'showSubmenu', this);
            });
            this.$on('hideSubmenu', (source) => {
                if (source === this) {
                    return;
                }
                this.timeout = setTimeout(() => {
                    this.isOpen = false;
                }, 0);
            });
            this.$on('toggleSubmenu', () => {
                this.isOpen = !this.isOpen;
            });
        },
        methods: {
            mouseEnter() {
                if (this.trigger === 'hover') {
                    this.$nextTick(() => {
                        clearTimeout(this.timeout);
                    });
                }
            },
            mouseLeave() {
                if (this.trigger === 'hover') {
                    this.timeout = setTimeout(() => {
                        this.isOpen = false;
                    }, 0);
                }
            },
            getItemCls(item) {
                if (item.children) {
                    return [
                        'el-dropdown-menu-submenu-vertical',
                        'el-dropdown-menu-submenu',
                    ];
                }
                return [
                    {
                        'el-dropdown-menu-item-disabled': item.disabled,
                    },
                    'el-dropdown-menu-item',
                ];
            },
            getItemId(item) {
                if (item.children) {
                    return 'el-dropdown-menu-submenu-' + createId();
                }
                return 'el-dropdown-menu-item' + createId();
            },
            clickMenuItem(item, $event) {
                // console.log('clickMenuItem', item, $event)
                if (!item.children && !item.disabled) {
                    this.dispatch('Dropdown', 'itemClicked', [item, $event]);
                }
            },
            toggleOpen(value) {
                if (this.trigger === 'hover') {
                    this.broadcast('DropdownMenu', value ? 'showSubmenu' : 'hideSubmenu', this);
                }
            },
            clickSubmenu(item, event) {
                event.stopPropagation();
                this.dispatch('Dropdown', 'itemClicked', item);
                if (this.trigger === 'click') {
                    this.isOpen = !this.isOpen;
                    this.broadcast('DropdownMenu', this.isOpen ? 'showSubmenu' : 'hideSubmenu', this);
                }
            },
        },
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .red-dot {
        position: absolute;
        height: 10px;
        width: 10px;
        z-index: 2;
        right: 1px;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        background-color: #f43531;
        font-size: 0;
    }
</style>
