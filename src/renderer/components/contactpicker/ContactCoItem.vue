<template>
    <div class="contact-co-item">
        <cell
            is-link
            :border-intent="false"
            :arrow-direction="showContent ? 'up' : 'down'"
            @click.native="showContent = !showContent" class="my-cell-settings">
            <h5 slot="title">{{data.companyName}}</h5>
            <img slot="icon" class="my-img-increase"
                 :src="data.headimgurl" onerror="this.src='./static/images/weicard.jpg'"
            />
        </cell>
        <template v-if="showContent">
            <cell class="my-cell-settings" title="同事名录" @click.native="itemClick('colleague', data)"
                  is-link>
                <i slot="icon" class="iconfont icon-zuoxiajiao my-icon-increase-min"></i>
            </cell>
            <cell class="my-cell-settings" title="客户" @click.native="itemClick('externalContact', data)"
                  is-link>
                <i slot="icon" class="iconfont icon-zuoxiajiao my-icon-increase-min"></i>
            </cell>
            <template v-if="data['childrens']">
                <div class="contact-co-child-item">
                    <contact-co-item :data="data.childrens" @itemClick="itemClick"></contact-co-item>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
    import { Cell } from 'vux'
    import { getImageUrl } from '../../utils/fn'

    export default {
        name: "ContactCoItem",
        components: {
            Cell
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                showContent: false
            };
        },
        watch: {
            data: {
                handler() {
                    this.data.headimgurl = this.data.headimgurl ? getImageUrl(this.data.headimgurl.indexOf('.jpg') === -1 ? this.data.headimgurl + '.jpg' : this.data.headimgurl, '/JsLib/dist/app/images/weicard.jpg') : './static/images/weicard.jpg'
                },
                immediate: true
            }
        },
        methods: {
            itemClick(type, data) {
                this.$emit('itemClick', type, data)
            }
        },

    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .contact-co-child-item
        margin-left: 20px
    .my-cell-settings
        font-size: 18px;
        color: #2a2a2a;
        height: 60px;
        white-space: nowrap;
        /*border-bottom: 1px solid #e2e2e2;*/
        h5
            font-size: 18px;
            font-weight: normal
        .my-icon-increase, .my-img-increase, .my-icon-increase-min
            font-size: 40px !important;
            text-align: center;
            width: 50px;
            height: 45px;
            display: block;
            margin-right: 20px;
            color: #ff8000;
            line-height: 45px;
        .my-icon-increase-min
            position: relative
            right: 0
            top: 0
            font-size: 15px !important;
</style>
