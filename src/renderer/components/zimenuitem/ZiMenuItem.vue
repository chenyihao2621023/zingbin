<template>
    <div class="zi-menu-item">
        <template v-for="item in routes">

            <el-menu-item v-if="!item.children" :index="item.name"
                          :route=" {path: item.name, query: item.query ? item.query : ''} " :key="item.name">
                <i v-if="item.icon" :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
            </el-menu-item>

            <el-submenu v-else :index="item.name" :key="item.name">
                <template slot="title">
                    <i v-if="item.icon" :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                </template>
                <template v-for="child in item.children">
                    <zi-menu-item class="nest-menu" v-if="child.children && child.children.length>0" :routes="[child]"
                                  :key="child.name"></zi-menu-item>

                    <el-menu-item v-else :index="child.name" :key="child.name"
                                  :route="{path: child.name, query: child.query ? child.query : ''}">
                        <i v-if="child.icon" :class="item.icon"></i>
                        <span slot="title">{{child.title}}</span>
                    </el-menu-item>

                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>


    export default {
        name: 'ZiMenuItem',
        props: {
            routes: {
                type: Array
            }
        },
        mounted() {
            console.log(1)
        },
        methods: {},
    }
</script>
