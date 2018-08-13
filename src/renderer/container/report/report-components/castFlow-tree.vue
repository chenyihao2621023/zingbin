<template>
    <div>
        <ul class="tree-menu">
            <li v-for="(item, index) in data" :key="index">

                <check-icon v-if="item.isdel !== 'false'" v-show="deleteItem" type="plain" :value.sync="item.check" @click.native="checkIcon(item)"></check-icon>
                <x-icon v-if="item.parentId !== 'xianjinliuliang'" v-show="newItem" type="ios-plus-outline" size="24" @click="addItem(item)" class="circle"></x-icon>
                <span @click="editItem(item)">{{item.fileId}} {{ item[text] || item.text }} </span>
                <i v-if="item.flag" class="iconfont icon-iconfontjiantou5" @click="toggle(item, index)" :class="{ down:!scope[index],up: scope[index]}" ></i>
                <cast-flow-tree v-if="scope[index]"
                      :data="item.children"
                      :newItem="newItem"
                      :deleteItem="deleteItem"
                      :deleteArray="deleteArray"
                      :searchType="searchType"
                      @addItem="addItem"
                      @editItem="editItem"
                      @deleteItem="deleteItem"
                      @checkIcon="checkIcon"
                ></cast-flow-tree>
            </li>
        </ul>
    </div>
</template>

<script>
    import { CheckIcon,XButton } from 'vux'
    import { Z_IsEmpty20 } from '../../../utils/fn'
    export default {
        name: "cast-flow-tree",
        components:{
            CheckIcon,
            XButton
        },
        props: {
            data:{
                type:Array,
                default: () => []
            },
            deleteItem:{
                type:Boolean,
                default: false
            },
            newItem:{
                type:Boolean,
                default: false
            },
            deleteArray:{
                type:Array,
                default: () => []
            },
            searchType:{
                type:Boolean,
                default:true
            }
        },
        data () {
            return {
                scope: {},
                new:true,
            }
        },
        watch: {
            newItem:{
                handler(newValue) {
                    this.newItem = newValue
                    this.deleteItem = false
                },
                deep:true
            },
            deleteItem:{
                handler(newValue) {
                    this.data.forEach((item, index) => {
                        this.$set(item, "check", false);
                    });
                    this.deleteItem = newValue
                    this.newItem = false
                },
                deep:true
            },
            data:{
                handler(newValue) {
                    if (newValue.length !== 0) {
                        newValue.forEach((item, index) => {
                            // this.$set(item, "check", false);
                            if ((item.children && !item.children.length) || Z_IsEmpty20(item.children)) {
                                item.flag = false
                            } else {
                                item.flag = true
                            }
                        });
                    }
                },
                deep:true
            }
        },
        mounted () {
            this.clientWidth = document.body.clientWidth
            if (this.data.length !== 0) {
                this.data.forEach((item, index) => {
                    this.$set(item, "check", false);
                    if ((item.children && !item.children.length) || Z_IsEmpty20(item.children)) {
                        item.flag = false
                    } else {
                        item.flag = true
                    }
                });
            }
        },
        methods: {
            doTask (index) {
                this.$set(this.scope, index, !this.scope[index]);
            },

            toggle (item, index) {
                if (item.children && item.children.length) {
                    this.doTask(index);
                }
            },
            addItem(item) {
                this.$emit("addItem",item)
            },
            //递归算法
            recursive (data,id) {
                data.forEach((item,index) => {
                    this.$set(item, "check", false);
                    if ((item.children && item.children.length)) {
                        this.recursive(item.children)
                    }
                })
            },
            checkIcon(val) {
                if (this.searchType) {
                    let iconCheck = val.check
                    this.recursive(this.data,val.id)
                    this.$set(val,"check",iconCheck);
                    this.$emit("checkIcon",val)
                    // if (item.check && !this.deleteArray.includes(item)) {
                    //     this.deleteArray.push(item)
                    // } else if (!item.check && this.deleteArray.includes(item)) {
                    //     this.deleteArray.splice(this.deleteArray.indexOf(item),1)
                    // }

                } else {
                    this.$emit("checkIcon",val)
                }
            },
            //跳转到编辑界面 001 和 002 不可添加跳转
            editItem(item) {
                this.$emit("editItem",item)
            },
            //单选还是多选
        }
    }

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .tree-menu li {
        width 100%
        position relative
        line-height: 3;
        padding-left  13px
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: left;
        font-family: Arial;

    }

    .icon-iconfontjiantou5{
        position absolute
        right 13px
    }
    .down{
        display: inline-block;
        transform rotate(90deg)
    }
    .up{
        display: inline-block;
        transform rotate(270deg)
    }
    .circle{
        transform translateY(25%)
    }
</style>
