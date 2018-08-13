<template>
    <div class="axios-demo">
        <flexbox>
            <flexbox-item :span="1/6"><x-button mini="true" @click.native="doExport">导出</x-button></flexbox-item>
            <flexbox-item :span="1/6"><x-button mini="true" @click.native="triggerImport">导入</x-button></flexbox-item>
            <input type="file" id="my_file" style="display: none;" @change="doImport">
        </flexbox>
        <div class="form-box">
            <group title="url">
                <x-input v-model="url"></x-input>
            </group>
            <group title="method">
                <radio :options="methodList" v-model="method"></radio>
            </group>
            <group title="data">
                <x-textarea rows="10"
                            v-model="postData"
                            autosize>
                </x-textarea>
            </group>
            <x-button @click.native="doRequest">发送请求</x-button>
        </div>
        <div class="result-box">
            <pre v-html="result"></pre>
        </div>
    </div>
</template>

<script>
    import { Group, XInput, XTextarea, XButton, Radio, Flexbox, FlexboxItem } from 'vux'
    import { Z_IsEmpty20, createId } from '../../utils/fn'
    import Qs from 'qs'

    export default {
        name: 'AxiosDemo',
        components: {
            Group,
            XInput,
            XTextarea,
            XButton,
            Radio,
            Flexbox,
            FlexboxItem
        },
        data() {
            return {
                url: '',
                method: 'get',
                methodList: ['get', 'post'],
                postData: '{}',
                result: ''
            }
        },
        methods: {
            doRequest() {
                if (Z_IsEmpty20(this.url)) {
                    this.$vux.toast.text('url不能为空', 'bottom')
                    return
                }

                let url = this.url
                let postData

                if (this.method === 'post') {
                    postData = JSON.parse(this.postData)

                    if (url.indexOf('/ZingMH') !== -1) {
                        postData = Qs.stringify(postData)
                    }
                }

                this.result = '...'
                let itv = setInterval(() => {
                    this.result += '.'
                }, 200)

                let ret
                if (this.method === 'get') {
                    try {
                        let config = { params: JSON.parse(this.postData) }
                        ret = this.$http.get(url, config)
                    } catch (err) {
                        console.error(err)
                    }
                }
                else if (this.method === 'post') {
                    ret = this.$http.post(url, postData)
                }

                if (ret) {
                    ret.then(res => {
                        clearInterval(itv)

                        this.result = this.formatJson(res.data)
                    }).catch(err => {
                        clearInterval(itv)

                        this.result = err.message + ' - ' + err.stack
                    })
                }
            },
            doExport() {
                let content = {
                    url: encodeURIComponent(this.url || ''),
                    method: encodeURIComponent(this.method || 'get'),
                    postData: encodeURIComponent(this.postData || '{}'),
                    result: encodeURIComponent(this.result || '')
                }
                this.downloadFile(`axios-demo-${createId()}.json`, JSON.stringify(content))
            },
            triggerImport() {
                let evt = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                })
                document.getElementById('my_file').dispatchEvent(evt)
            },
            doImport() {
                let file = document.getElementById('my_file').files[0]
                let reader = new FileReader()

                //将文件以文本形式读入页面
                let vm = this
                reader.readAsText(file, 'gb2312')
                reader.onload = function (e) {
                    let fileText = e.target.result
                    console.log('file content: ', fileText)
                    let json = JSON.parse(fileText)
                    vm.url = decodeURIComponent(json.url)
                    vm.method = decodeURIComponent(json.method)
                    vm.postData = decodeURIComponent(json.postData)
                    vm.result = decodeURIComponent(json.result)
                }
            },
            formatJson (json, options) {
                let reg = null
                let formatted = ''
                let pad = 0
                let PADDING = ''
                // one can also use '\t' or a different number of spaces
                // optional settings
                options = options || {}
                // remove newline where '{' or '[' follows ':'
                options.newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true
                // use a space after a colon
                options.spaceAfterColon = options.spaceAfterColon === false
                // begin formatting...
                if (typeof json !== 'string') {
                    // make sure we start with the JSON as a string
                    json = JSON.stringify(json)
                } else {
                    // is already a string, so parse and re-stringify
                    // in order to remove extra whitespace
                    json = JSON.parse(json)
                    json = JSON.stringify(json)
                }
                // add newline before and after curly braces
                reg = /([{}])/g
                json = json.replace(reg, '\r\n$1\r\n')
                // add newline before and after square brackets
                reg = /([[]])/g
                json = json.replace(reg, '\r\n$1\r\n')
                // add newline after comma
                reg = /(,)/g
                json = json.replace(reg, '$1\r\n')
                // remove multiple newlines
                reg = /(\r\n\r\n)/g
                json = json.replace(reg, '\r\n')
                // remove newlines before commas
                reg = /\r\n,/g
                json = json.replace(reg, ',')
                // optional formatting...
                if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
                    reg = /:\r\n\{/g
                    json = json.replace(reg, ':{')
                    reg = /:\r\n\[/g
                    json = json.replace(reg, ':[')
                }
                if (options.spaceAfterColon) {
                    reg = /:/g
                    json = json.replace(reg, ': ')
                }
                $.each(json.split('\r\n'), (index, node) => {
                    let i = 0
                    let indent = 0
                    let padding = ''
                    if (node.match(/\{$/) || node.match(/\[$/)) {
                        indent = 1
                    } else if (node.match(/\}/) || node.match(/\]/)) {
                        if (pad !== 0) {
                            pad -= 1
                        }
                    } else {
                        indent = 0
                    }
                    for (i = 0; i < pad; i++) {
                        padding += PADDING
                    }
                    formatted += padding + node + '\r\n'
                    pad += indent
                })
                return formatted
            },
            downloadFile (fileName, content, ext) {
                let a = document.createElement('a')
                let defaultType = {
                    type: 'application/json'
                }
                if (ext) defaultType.type = ext
                let blob = new Blob([content], {
                    type: defaultType
                })
                let url = window.URL.createObjectURL(blob)
                a.href = url
                a.download = fileName
                a.click()
                window.URL.revokeObjectURL(url)
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .axios-demo
        .weui-cell__bd input, .weui-cell__bd textarea
            text-align left !important
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .axios-demo
        width 100%
        height 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width 100%
        .form-box
            flex-shrink 0
        .result-box
            flex-grow 2
            overflow auto
</style>

