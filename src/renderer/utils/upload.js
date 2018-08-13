/**
 * Created by trto1987 on 16/9/12.
 * conf.onUploadStart(isErrorOccurred)
 * 上传图片conf.imageOnly = true
 * 禁用压缩conf.noCompress = true
 * 上传文件数量conf.fileNumLimit = 10
 * 总上传大小conf.fileSizeLimit = 1024 * 1024 * 20 * 10
 * 单个文件大小conf.fileSingleSizeLimit = 1024 * 1024 * 20
 * 文件过滤conf.accept = {
                title: '图片文件(*.gif,*.jpg,*.jpeg,*.bmp,*.png)',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
            }
 */
/*
 todo 参考vux插件改造成插件
 */
const $ = require('jquery')
const WebUploader = require('../../../static/js/webuploader.custom')
// console.log('uploader', WebUploader)

function Uploader () {
    let initState = false
    let currentPercentage = 0
    let $this = this
    let $ref = {}

    let percentageMap = {}
    let totalPercentage = 0
    // events
    this.__onMessage = function () { console.log('explorerUploader: onMessage not support') }

    this.__onUploadStart = function () { console.log('explorerUploader: onUploadStart not support') }

    this.__onServerSuccess = function () { console.log('explorerUploader: onServerSuccess not support') }

    this.__onServerFailed = function () { console.log('explorerUploader: onServerFailed not support') }

    this.__isDetailShown = function () {}
    this.__showDetail = function () {}
    this.__hideDetail = function () {}
    this.__hide = function () {}
    this.__resetFolderPath = function (folderPath) {
        if (folderPath) {
            $this._conf.folderPath = folderPath
            $this._uploader.option('server', $this.__getServer())
        }
    }
    this.resetUploader = function (folderPath) {
        if (!$this._uploader) return;

        $this._uploader.reset()
        $this.__resetFolderPath(folderPath)
        percentageMap = {}
        totalPercentage = 0
    }
    this.create = function () {
        return new Uploader()
    }
    this.__getServer = function () {
        if ($this._conf.uploaderServer.indexOf('?') !== -1) {
            return $this._conf.uploaderServer + '&folderPath=' + $this._conf.folderPath + '&maxSize=' + $this._conf.fileSingleSizeLimit
        } else {
            return $this._conf.uploaderServer + '?folderPath=' + $this._conf.folderPath + '&maxSize=' + $this._conf.fileSingleSizeLimit
        }
    }
    this.prepareUpload = function (callback) {
        console.log('prepareUpload')
        $this._uploaderPicker.find('.webuploader-element-invisible').trigger('click')
        $this._isError = false
        if (callback) {
            $this._callback = callback
        }
    }
    this.prepareUpload.bind = function (ref) {
        $ref = ref
        return $this.prepareUpload
    }
    //uploader init

    this.isInit = function () {
        return initState
    }

    this.init = function (conf) {
        if (typeof conf !== 'object') {
            console.error('explorerUploader: 参数不正确')
            return
        }

        $this._id = new Date().getTime()
        if (typeof conf.pickDom !== 'string') {
            $('body').append('<div id="picker' + $this._id + '" class="explorerFilePicker" style="display: none;"></div>')
        }

        if (typeof conf.onMessage === 'function') {
            $this.__onMessage = conf.onMessage
        }
        if (typeof conf.onUploadStart === 'function') {
            $this.__onUploadStart = conf.onUploadStart
        }
        if (typeof conf.onServerSuccess === 'function') {
            $this.__onServerSuccess = conf.onServerSuccess
        }
        if (typeof conf.onServerFailed === 'function') {
            $this.__onServerFailed = conf.onServerFailed
        }

        /*if (typeof conf.uploaderSwfPath !== 'string' || typeof conf.uploaderServer !== 'string'
         || !conf.uploaderSwfPath || !conf.uploaderServer) {
         console.error('explorerUploader: 没有设置上传组件swf路径和上传接口地址');
         return;
         }*/
        if (typeof conf.folderPath !== 'string') {
            console.error('explorerUploader: 没有设置目录路径')
            return
        }
        if (typeof conf.fileNumLimit === 'undefined') {
            // default file num limit
            conf.fileNumLimit = 10
        }
        if (typeof conf.fileSizeLimit === 'undefined') {
            // default file size limit
            conf.fileSizeLimit = 1024 * 1024 * 20 * 10
        }
        if (typeof conf.fileSingleSizeLimit === 'undefined') {
            // default single file size limit
            conf.fileSingleSizeLimit = 1024 * 1024 * 20
        }
        if (typeof conf.imageOnly !== 'undefined' && (conf.imageOnly || conf.imageOnly === 'true')) {
            conf.accept = {
                title: '图片文件(*.gif,*.jpg,*.jpeg,*.bmp,*.png)',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
            }
        }
        $this._conf = conf

        // $this.__createUploader(window.WebUploader);
        if (typeof conf.pickDom === 'undefined' || !conf.pickDom) {
            $this.__createUploader()
        } else {
            $this.__createUploader(conf.pickDom)
        }


        initState = true
    }
    this.__createUploader = function (pickDom) {
        let customPick = false;
        if (pickDom) customPick = true;
        // let pickDom = '.explorerFilePicker';
        if (!customPick) pickDom = '#picker' + $this._id
        if (parent) {
            // let idVal = $(parent).attr("id");
            // if(typeof idVal != "undefined" && idVal != null && idVal != ""){
            //     pickDom = "#" + idVal + " " + pickDom;
            // }
        }
        let pickConf = {
            id: pickDom,
            multiple: true
        }
        if (typeof $this._conf.multiple === 'boolean' && !$this._conf.multiple) {
            pickConf.multiple = false
        }
        let compressConf = {
            width: 1600,
            height: 1600,
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 90,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,
            // 是否允许裁剪。
            crop: false,
            // 是否保留头部meta信息。
            preserveHeaders: true,
            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false,
            // 单位字节，如果图片大小小于此值，不会采用压缩。
            compressSize: 0
        }
        if (typeof $this._conf.noCompress === 'boolean' && $this._conf.noCompress) {
            compressConf = false
        }
        let uploaderConf = {
            swf: $this._conf.uploaderSwfPath,
            server: $this.__getServer(),
            timeout: 0,
            pick: pickConf,
            resize: false,
            fileNumLimit: $this._conf.fileNumLimit,
            fileSizeLimit: $this._conf.fileSizeLimit,
            fileSingleSizeLimit: $this._conf.fileSingleSizeLimit,
            compress: compressConf
        }
        if (typeof $this._conf.accept === 'object') {
            uploaderConf.accept = $this._conf.accept
        }

        // console.log('uploaderConf', uploaderConf)
        $this._uploader = new WebUploader.Uploader(uploaderConf)
        $this._uploaderPicker = $(pickDom)

        if (customPick) {
            window.setTimeout(() => {
                console.log('custom pickDomInner',
                    $(pickDom).find('.webuploader-pick + div'),
                    $(pickDom).find('.webuploader-pick + div input'))
                $(pickDom).find('.webuploader-pick + div').css({
                    'width': 'auto',
                    'height': 'auto',
                    'right': '0px',
                    'bottom': '0px',
                    'opacity': '0'
                })
                $(pickDom).find('.webuploader-pick + div input').css({
                    'width': '100%',
                    'height': '100%'
                })
            }, 100)
        }

        // console.log('_uploaderPicker', $(pickDom))
        $this._uploader.on('fileQueued', function (file) {
            console.log(file.id + ' 等待上传')
            percentageMap[file.id] = {
                percentage: 0,
                state: 0
            }
        })
        // 设置header
        $this._uploader.on('uploadBeforeSend', function (object, data, headers) {
            console.log('uploadBeforeSend', headers)
            if (!PSMU.isEmtVal(PSMU.token)) {
                headers[PSMU.tokenName] = PSMU.token
            }
            console.log('uploadBeforeSend after', headers)
            return true;
        })
        $this._uploader.on('filesQueued', function (files) {
            console.log('开始上传')

            totalPercentage += files.length * 100
            $this._uploader.upload()

            if ($this._isError) $this.__onUploadStart(true, $ref)
            else $this.__onUploadStart(false, $ref)
        })
        $this._uploader.on('uploadProgress', function (file, percentage) {
            // console.log('上传中');

            percentageMap[file.id].percentage = percentage * 100
            currentPercentage = 0
            for (let p in percentageMap) {
                if (percentageMap.hasOwnProperty(p)) {
                    currentPercentage += percentageMap[p].percentage
                }
            }

            if (currentPercentage / totalPercentage * 100 === 100) {
                $this.__onMessage('upload100', $ref)
            }
        })
        $this._uploader.on('uploadSuccess', function (file, response) {
            console.log('上传成功')
            if (response && response.success) {
                console.info('ssss')
                percentageMap[file.id].state = 1
                $this.__onServerSuccess(response, $ref)
                console.info($ref)
            } else {
                percentageMap[file.id].state = -1

                $this.__onServerFailed(response, $ref)
            }
        })
        $this._uploader.on('uploadError', function (file) {
            console.log('上传失败')
            percentageMap[file.id].state = -1

            $this.__onServerFailed('上传失败', $ref)
        })
        $this._uploader.on('uploadFinished', function () {
            console.log('上传结束')

            if ($this._callback) {
                $this._callback()
            }
        })
        // $this._uploader.on('uploadComplete', function() {
        //     console.log('上传完成');
        // });
        $this._uploader.on('error', function (type) {
            console.error('error: ' + type)
            $this._isError = true
            $this._uploader.reset()
            let msg = ''
            switch (type) {
                case 'F_DUPLICATE':
                    msg = '上传文件重复'
                    break

                case 'F_EXCEED_SIZE':
                    msg = '超出上传文件大小限制' + ($this._conf.fileSingleSizeLimit / 1024 / 1024) + 'M'
                    break

                case 'Q_EXCEED_SIZE_LIMIT':
                    msg = '超出上传文件总大小限制'
                    break

                case 'Q_EXCEED_NUM_LIMIT':
                    msg = '超出上传文件个数限制'
                    break

                case 'Q_TYPE_DENIED':
                    msg = '不允许上传的文件类型'
                    break

                default:
                    msg = '上传文件出错'
            }
            $this.__onServerFailed(msg, $ref)
        })
    }
    this.destroy = function() {
        if (this._uploader) {
            try {
                this._uploader.destroy()
            } catch (err) {
                console.error(err)

                if (this._uploaderPicker) {
                    this._uploaderPicker.find('input').off()
                }
            }
        }
        this._uploader = null
    }
}

export default new Uploader()
