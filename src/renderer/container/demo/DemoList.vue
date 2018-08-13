<template>
    <div class="demo-list">
        <grid v-for="(link, index) in demoLinks" :key="index">
            <grid-item :link="link.path">
                <span class="grid-center">{{link.title}}</span>
            </grid-item>
        </grid>
    </div>
</template>

<script>
    import { routes } from '../../router/demo'
    import { Grid, GridItem } from 'vux'

    export default {
        name: 'DemoList',
        components: {
            Grid,
            GridItem
        },
        data () {
            return {
                demoLinks: []
            }
        },
        created () {
            this.demoLinks = routes[0].children.map(item => {
                let path
                let title
                if (item.path) {
                    path = item.path.indexOf('/') === 0 ? item.path : '/demo/' + item.path
                    title = item.path
                } else {
                    path = item.redirect
                    title = item.redirect
                }
                return { path: path, title: title }
            })
        }
    }
</script>

<style scoped>
    .demo-list {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    li {
        list-style: initial;
    }
    li > a {
        color: #3a8ee6;
    }
</style>
