<template>
    <div class="post-pictures">
        <zing-head title="发现" :isComeBack="false" @doSome="onGoBack">
        </zing-head>
        <div>
            <div class="post-pictures-title">
                <group>
                    <x-textarea
                                :height="screenHeight"
                                placeholder="输入您想发表的内容..."
                                ref="input"
                                v-model="publishTitle"
                                class="fontColor" max="1500">
                   <span slot="label" style="margin-right: 5px">
                        标题
                    </span>
                    </x-textarea>
                </group>
            </div>
            <div v-show="showPublishImage" class="post-pictures-image">
                <span style="font-size: 17px">图片</span>
                <image-picker
                    :enlargeFlag="true"
                    :imageNum="imageNum"
                    @viewEnlarge="onViewEnlarge"
                    :bId = "bId"
                    :bType = "bType"
                    :multiple="true"
                    :files="files"
                    :selectable="selectable"
                    :companyId="companyId"
                    @onChange="fliesChange"

                />
            </div>
        </div>
        <x-button
            @click.native="clickDetermine"
            class="post-pictures-button"
            type="primary">发布
        </x-button>
        <div v-transfer-dom>
            <previewer :list="viewImgList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
    </div>
</template>

<script>
    import ZingHead from '@/components/zingHead/ZingHead.vue';
    import ImagePicker from '@/components/imagepicker/ImagePicker';
    import { Cell,XTextarea,XButton,Group,Previewer, TransferDom} from 'vux'
    export default {
        name: "PostPictures",
        directives: {
            TransferDom,
        },
        components: {
            ZingHead,
            Cell,
            XTextarea,
            ImagePicker,
            XButton,
            Group,
            Previewer
        },
        props: {
            showPublishImage: {
                type: Boolean,
                default: false
            },
            companyId: {
                type:String,
                default:''
            },
            screenHeight: {
                type: Number,
                default:200
            }
        },
        data () {
            return {
                imageNum:3,
                files:[],
                imageList:[],
                publishImage:'',
                publishTitle:'',
                bId:"id",
                bType:"imgContent",
                options: {
                    getThumbBoundsFn (index) {
                        let thumbnail = document.querySelectorAll('.post-previewer-box-img')[index];
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        let rect = thumbnail.getBoundingClientRect()
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                    }
                },
                viewImgList:[]
            }
        },
        computed: {
            selectable () {
                return this.imageList.length < 9
            }
        },

        // created() {
        //     this.$nextTick(() => {
        //        if (!this.showPublishImage) {
        //            this.screenHeight = document.documentElement.clientHeight - 100;
        //            console.log(this.screenHeight);
        //        }
        //     });
        // },
        methods: {
            onGoBack () {
                this.$emit('goBack');
                this.publishTitle = '';
                this.publishImage = '';
                this.imageList = [];
                this.files = [];
            },
            onViewEnlarge(index,i) {
                this.$refs.previewer.show(index * this.imageNum + i)
            },
            fliesChange(files, operationType, index) {
                this.imageList = files;
                this.viewImgList = files.map(item => {
                    item.src = item.url;
                    item.msrc = item.url
                    return item
                })
            },
            // fliesChange(files, operationType, index) {
            //     let _this = this
            //     files.forEach(obj => {
            //         if (obj.url.indexOf("/checkFile/") < 0){
            //             obj.url = "/checkJpg/"+obj.url
            //         }
            //         _this.imgArr.push(obj.url)
            //         _this.imgList.push({src:obj.url})
            //     });
            //     this.files = []
            // },
            bottomToast (msg, type,wh) {
                let _this = this
                if (!msg) return
                let tp = type ? type : 'success';
                let width = wh ? wh : '8em';
                this.$vux.toast.show({
                    text: msg,
                    type: tp,
                    position: 'middle',
                    width,
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            clickDetermine() {
                let _this = this;
                if (!_this.showPublishImage && !_this.publishTitle) {
                    _this.bottomToast('请输入发表内容','warn')
                    return;
                }
                if (!_this.publishTitle && !_this.imageList.length) {
                    _this.bottomToast('请输入发表内容','warn')
                    return;
                }
                if (_this.imageList.length) {
                    _this.imageList.forEach(item => {
                        this.publishImage += `${item.url} `
                    })
                }
                let url = '/zingbiz/discovery/discoveryinfo/insertDiscoveryInfo';
                let params = {
                    discoveryContent:_this.publishTitle,
                    discoveryImg:_this.publishImage
                };
                _this.$http.post(url,params).then(res => {
                    if (res.data.success) {
                        _this.bottomToast('发表成功');
                        _this.publishTitle = '';
                        _this.publishImage = '';
                        _this.imageList = [];
                        _this.viewImgList = [];
                        _this.files = [];
                        _this.$emit('postPict')
                    }
                })
            }
        }
    }
</script>
<style>
    .post-pictures .weui-cell__bd textarea {
        text-align: left !important;
    }
    .post-pictures .weui-btn_primary:not(.weui-btn_disabled):active{
        background: #ff8000;
    }
    .post-pictures .weui-cells:before{
        border-top:0 !important;
    }
    .post-pictures-title .weui-cell {
        padding: 0 !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    .post-pictures
        background: #fff
        width: 100%
        height: 100%
        .post-pictures-title
            padding 10px 13px
            margin-top 2px
        .post-pictures-image
            margin-top 10px
            padding-left 13px
        .post-pictures-button
            position: fixed
            bottom: 0
            left: 0
            height: 40px
            font-size: 18px
            color: #fff
            flex-shrink: 0;
            width: calc(100%);
            border: none
</style>
