<template>
    <ul class="ant-cascader-menu">
        <slot></slot>
        <template v-for="(item,index) in data">
        <li v-if="item" :key="index" 
            :class="['ant-cascader-menu-item', {[prefix+'-item-expand']: item.children, },{[prefix+'-item-disabled']: item.disabled, }, {[prefix+'-item-active']: value == index}]" 
            :title="item.text" @click.stop="select(item, index,item.disabled)">
            {{item.text}}
        </li>
        <li :class="['ant-cascader-menu-item', {[prefix+'-item-expand']: item.children, },{[prefix+'-item-disabled']: item.disabled, }, {[prefix+'-item-active']: value == index}]" :key="index" v-else @click="handleLeaf(item)">{{`${item.text}`}}</li>
        </template>
    </ul>
</template>
<script>
    export default {
        data: () => ({
            prefix: 'ant-cascader-menu',
        }),
        props: {
            _key: Number,
            value: {
                type: Number,
                default: -1,
            },
            data: {
                type: Array,
                default: () => [],
            },
        },
        watch: {
            data(val) {
            },
            value(val) {
            }
        },
        methods: {
            select(item, i, disabled) {
                if (disabled || !item.children) return;
                this.$emit('input', i);
                this.$emit('change', this._key, i);
            },
            handleLeaf(leaf) {
                this.$emit('selectLeaf', leaf)
            }
        },
        mounted() {

        }
    };
</script>