<template>
    <div class="explorer-component">
        <zing-head class="explorer-component-head"
                   :title="editMode ? `已选择 ( ${this.currentSelected.length} )` : myTitle"
                   :isComeBack="false"
                   @doSome="backClick"
                   :style="{backgroundColor:(editMode &&! pickMode) ? '#000':'',color:(editMode && !pickMode) ? '#fff':''}">
            <div slot="header-right" v-show="!editMode">

                <span style="margin-right:10px;display:inline-block;margin-bottom:3px"
                      v-show="(pickMode || noteMode) && multipleMode">
                    <i style="font-size:24px;color:#000;" class="iconfont icon-fangdajing"
                       @click="changeShowSearch"></i>
                </span>
                <span class="header-jiahao" v-show="!pickMode && !showSearch"
                      style="width: 37.5px; margin-right: 7.5px; padding-left: 5px; padding-right: 5px;">
                    <dropdown style="margin-top:-9px" :data="menuData" trigger="click" placement="bottomRight"
                              @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
            </div>
            <div slot="header-right" v-show="editMode && !pickMode">
                <!--<span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="chargeSearch"></i>
                </span>-->
                <span v-show="!pickMode" @click="toggleCheckAll"
                      style="width: 37.5px; margin-right: 7.5px; padding-left: 5px; padding-right: 5px;">
                    <span style="font-size: 16px; vertical-align: middle;">{{checkToggleName}}</span>
                </span>
            </div>
        </zing-head>
        <search
            ref="search"
            class="searchStyle"
            :searchFlag="showSearch"
            @cancelInput ="onCancelSearch"
            @confirmInput="onSubmitSearch"
        ></search>
        <tree-nav class="explorer-component-nav"
                  :navList="treeNavList"
                  :showLock="readOnlyMode"
                  @navClicked="onNavClicked">
        </tree-nav>
       <div class="explorer-component-detail" v-show="treeList.length" :style="{ marginBottom: botm ,height: screenHeight+'px'}">
           <tree-detail-panel ref="treeDetail"
                              :branchSelectable="(!readOnlyMode&&multipleMode)"
                              :branchListType="'6'"
                              :multipleMode="(!readOnlyMode&&multipleMode)"
                              :leafListType="'6'"
                              :list="treeList"
                              @branchClicked="onBranchClicked"
                              @leafClicked="onLeafClicked"
                              @checkChange="onCheckChange">
           </tree-detail-panel>
       </div>
        <p :style="{height: saveHeight}" class="explorer-component-nav explorer-component-nav-text" v-show="!treeList.length">暂无文件</p>
        <img v-show="false" class="previewer-demo-img" v-for="(item, index) in imagePreviewList" :key="index" :src="item.src"
             width="100" @click="show(index)">
        <previewer :list="imagePreviewList" ref="previewer" :options="previewerOptions"></previewer>
       <popup v-model="showDocx"
                      :popup-style="{'max-width': '100%', width: '100%', height: '100%','z-index':5000}">
                <zing-head :isComeBack="false" @doSome="onDoSome">
                </zing-head>
                <div class="my_iframe_form_data">
                    <iframe :src="docxSrc" :height="explorerHeight" :width="explorerWidth" id="my_iframepage" frameborder="0" @load="iFrameHeight"></iframe>
                </div>
            </popup>
        <form-dialog
            ref="dialog"
            maskZIndex="5000"
            v-model="showFormDialog"
            :title="dialogTitle"
            :showForm="true"
            :formAttrs="dialogFormAttrs"
            @on-cancel="onCancel"
            @on-show="onShow"
            @on-hide="onHide"
            @on-confirm="onDialogConfirm">
        </form-dialog>
        <div class="explorer-my-footer" v-show="editMode && !pickMode">
            <a v-for="(menuDataItem,index) in menuData" @click="handleMenu(menuDataItem, $event)" :key="index">
                {{menuDataItem.content}}
            </a>
        </div>
    </div>
</template>

<script>
    import ZingHead from '../zingHead/ZingHead'
    import Dropdown from '../../components/dropdown/Dropdown'
    import TreeNav from '../flattree/TreeNav'
    import TreeDetailPanel from '../flattree/TreeDetailPanel'
    import FormDialog from '../formdialog/FormDialog'
    import search from '@/components/search/search'
    import { round10, isWeiXin, deepCopy, isIos, formatFileSize } from '../../utils/fn'
    import { dateFormat } from '../../utils/date'
    import { Popup,XButton, Previewer, XDialog, TransferDomDirective as TransferDom } from "vux"
    import Qs from 'qs'
    import Uploader from "../../utils/upload"

    let isInitUploader = false

    const pickerId = 'upPicker'
    const folderMenus = [
        {
            content: "上传",
            value: 'upload',
            idSepc: pickerId,
            show(_this) {
                if (_this.noteMode) return false;
                return !_this.pickMode
            },
            disable(_this) {
                return _this.readOnlyMode
            }
        },
        {
            content: "新建文本",
            value: 'newText',
            show(_this) {
                if (!_this.noteMode) return false;
                return !_this.pickMode
            },
            disable(_this) {
                return _this.readOnlyMode
            }
        },
        {
            content: "新建文件夹",
            value: 'newFolder',
            show(_this) {
                return !_this.pickMode
            },
            disable(_this) {
                return _this.readOnlyMode
            }
        },
    ]
    const fileMenus = [
        {
            content: "下载",
            value: 'download',
            show(_this) {
                if (_this.noteMode) return;
                for (let i = 0; i < _this.currentSelected.length; i++) {
                    let f = _this.currentSelected[i]
                    if (f.fileType === 'folder') {
                        return false
                    }
                }
                return _this.currentSelected.length === 1
            }
        },
        {
            content: "重命名",
            value: 'rename',
            show(_this) {
                return _this.currentSelected.length === 1
            },
            disable(_this) {
                return _this.readOnlyMode
            }
        },
        {
            content: "删除",
            value: 'delete',
            disable(_this) {
                return _this.readOnlyMode
            }
        },
    ]

    const newFolderDialogTitle = '新建文件夹'
    const newFolderFormAttrs = [
        {
            isShowTitle: true,
            title: '文件夹名称',
            type: 'text',
            placeholder: '输入文件夹名称'
        }
    ]
    const newTextDialogTitle = '新建文本'
    const newTextFormAttrs = [
        {
            isShowTitle: true,
            title: '文本名称',
            type: 'text',
            placeholder: '输入文本名称'
        }
    ]

    const renameDialogTitle = '重命名'
    const renameFormAttrs = [
        {
            isShowTitle: true,
            title: '文件夹名称',
            type: 'text',
            placeholder: '输入新文件名'
        }
    ]
    const renameFileAttrs = [
        {
            isShowTitle: true,
            title: '文本名称',
            type: 'text',
            placeholder: '输入新文本名'
        }
    ]
    export default {
        name: 'ExplorerComponent',
        directives: {
            TransferDom
        },
        components: {
            XButton,
            search,
            ZingHead,
            Dropdown,
            TreeNav,
            TreeDetailPanel,
            FormDialog,
            Previewer,
            XDialog,
            Popup
        },
        props: {
            currentCompanyId:{
                type: String,
                default: ''
            },
            initialTid: {
                type: String,
                default: ''
            },
            companyIdAndRecordType: {
                type: String,
                default: '',
            },
//            treeNavData: {},
            // 是否选择文件模式
            pickMode: {
                type: Boolean,
                default: false
            },
            myTitle: {
                type: String,
                default: '文件管理'
            },
            // 是否文档模式
            noteMode: {
                type: Boolean,
                default: false
            },
            multipleMode: {
                type: Boolean,
                default: true
            },
            botm:{
                type: String,
                default: 0
            }
        },
        data () {
            return {
                screenHeight:'0',
                showDocx: false,
                companyId: '',
                recordType: '',
                treeNavData: {},
                // 只读模式
                readOnlyMode: false,
                menuData: folderMenus,
                currentT: '',
                treeNavList: [],
                treeList: [],
                currentSelected: [],
                // 新建文件对话框
                currentDialog: 'newFolder',
                showFormDialog: false,
                dialogTitle: newFolderDialogTitle,
                dialogFormAttrs: newFolderFormAttrs,
                // 选择按钮
                checkToggleName: '全选',
                //搜索
                showSearch: false,
                goBackFlag:false,
                searchValue: '',
                explorerWidth:0,
                explorerHeight:0,
                saveDictionary: [],
                imagePreviewList: [],
                docxSrc: '',
                fileType:'',
                titleDocx: '标题',
                saveDocxSrc:[],
                newTimer:null,
                // addClassFlag:false,
                saveHeight:'',
                previewerOptions: {
                    getThumbBoundsFn(index) {
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                        // find thumbnail element
                        // get window scroll Y
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        // optionally get horizontal scroll
                        // get position of element relative to viewport
                        let rect = thumbnail.getBoundingClientRect()
                        // w = width
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                        // Good guide on how to get element coordinates:
                        // http://javascript.info/tutorial/coordinates
                    }
                }
            }
        },
        computed: {
            editMode () {
                if ( this.currentSelected.length > 0) {
                    this.screenHeight = this.saveHeight - 50
                } else {
                    this.screenHeight = this.saveHeight
                }
                return this.currentSelected.length > 0
            },
            screenHeight () {
                console.log(this.editMode ? this.saveHeight - 50 + 'px' : this.saveHeight + 'px');
                return this.editMode ? this.saveHeight - 50 + 'px' : this.saveHeight + 'px'
            },
        },
        watch: {
            companyIdAndRecordType: {
                handler (val) {
                    if (val) {
                        let [companyId, recordType] = val.split(' ')
                        this.companyId = companyId
                        this.recordType = recordType
                        console.log('initPCUploader companyIdAndRecordType', val)
                        this.$nextTick(() => {
                            this.initPCUploader()
                        })
                        this.loadPath(this.initialTid)
                    }
                },
                immediate: true
            },
            treeNavData: {
                handler(data) {
                    console.log('watch treeNavData', data)
                    this.doLoadPath(data)
                },
                deep: true
            },
        },
        created() {
            this.screenHeight = document.documentElement.clientHeight - 90;
            this.saveHeight = JSON.parse(JSON.stringify(this.screenHeight));
        },
        methods: {
            backClick () {
                if (this.editMode) {
                    this.quitEditMode()
                } else {
                    if (this.goBackFlag) {
                        this.$emit('backClick')
                    }
                    this.$emit('backClick')
                }
            },
            onNavClicked (nav) {
//                console.log('onNavClicked', nav)
//                this.$emit('loadPath', nav.tid)
                this.loadPath(nav.tid)
            },
            onBranchClicked (item) {
                console.log('folder click', item)
//                this.$emit('loadPath', item.tid)
                this.loadPath(item.tid)
            },
            onDoSome() {
                this.explorerWidth = 0;
                this.explorerHeight = 0;
                this.showDocx = false;
                this.docxSrc = '';
            },
            onLeafClicked (item) {
                this.id = item.id;
                if (!this.pickMode) {
                    if (this.noteMode) {
                        // 文档模式打开此文档
                      // window.location = `/SRender?jsLoader=appnote%2FappnoteLoader&tpl=appnote%2Fnote&id=${this.id}&companyId=${item.source.companyId}&cardUrl=test`
                        this.$router.push({
                            name: 'viewText',
                            query: {
                                id: this.id,
                                companyId: item.source.companyId
                            }
                        })
                    } else {
                        // todo 图片，doc等文件预览
                        if (item.fileType === 'file') return;
                        this.getFileContent(item);
                    }
                }
            },

            getFileContent(item) {
                if (!item) return;
                this.saveDictionaryItem = this.saveDictionary.find(item => item[this.id]);

                if (this.saveDictionaryItem) {
                    this.onProcessingFile(item, this.saveDictionaryItem[this.id]);
                    return;
                }
                // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/imgPreview.action';
                let url = '/zingbiz/explorer/imgPreview';
                let params = {
                    id: this.id,
                    companyId: item.source.companyId,
                    recordType: this.recordType
                };
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                this.$http.post(url, params).then(res => {
                    if (res.data.success) {
                        if (!this.saveDictionaryItem) {
                            this.saveDictionary.push({ [this.id]: res.data.data })
                        }
                        this.onProcessingFile(item, res.data.data);
                    }
                })
            },
            onProcessingFile(item, data) {
              let docxUrl = this.saveDocxSrc.find(docxItem => docxItem[item.id]);
                if (docxUrl) {
                  this.iFrameHeight ();
                  this.docxSrc = docxUrl[item.id].url;
                  return
              }
                switch (item.fileType) {
                    case 'image':
                        this.onViewPictures(data);
                        break;
                    case 'doc':
                        this.onViewDocx(data);
                        break;
                    case 'txt':
                        this.onViewDocx(data);
                        break;
                    case 'pdf':
                        this.onViewDocx(data);
                        break
                }
            },
            onViewPictures(data) {
                this.imagePreviewList = [
                    {
                        msrc: data.relativePath,
                        src: data.relativePath,
                    }
                ];
                this.$nextTick(() => {
                    this.$refs.previewer.show(0)
                })
            },
            onViewDocx(data) {
                this.goBackFlag = true;
                let { relativePath, fileName } = data;
                this.titleDocx = fileName || '标题';
                let url = '/ZingMH/ZDesk/previewFile/getPreviewPath.action';
                let params = {
                    src: relativePath
                };
                this.$http.post(url, Qs.stringify(params)).then(res => {
                    if (res.data.success) {
                        let { url } = res.data.data;
                        this.docxSrc = url;
                        this.saveDocxSrc.push({ [this.id]: res.data.data });
                        // this.iFrameHeight()
                    }
                })
            },
            iFrameHeight () {
                if (!this.docxSrc) return;
                // word-break:break-all
                // let t = document.getElementsByClassName('my_iframe_form_data')[0].clientWidth;
               this.$nextTick(() => {
                   let ifr = document.getElementById('my_iframepage');
                   let my_body = ifr.contentWindow.document.body;
                   my_body.style.wordBreak = "break-all";
                   let imgList = ifr.contentWindow.document.getElementsByTagName('img');
                   if (isIos()) {
                       // my_div.style.overflowY = 'scroll';
                       my_body.style.touchAction = 'pan-y';
                       my_body.style.position = 'static';
                       my_body.style.overflow = 'scroll';
                       my_body.style.webkitOverflowScrolling = 'touch';
                       //-webkitOverflowScrolling: touch

                       /*-webkit-overflow-scrolling: touch*/
                       /*overflow-y: scroll*/
                   }
                   let item , cd , ht , cls;
                   for (let i = 0 , t = imgList.length; i < t; i++) {
                       item = imgList[i];
                       cd = item.clientWidth;
                       ht = item.clientHeight;
                       cls = document.documentElement.clientWidth || document.body.clientWidth;
                       item.style.width = cd * (cls / cd) - 20;
                       item.style.maxWidth = '100%';
                       item.style.height = ht * (cls / cd);
                   }
                   this.showDocx = true;
               })
                // var bHeight = ifr.contentWindow.document.body.scrollHeight;
                // var dHeight = ifr.contentWindow.document.documentElement.scrollHeight;
                // var height = Math.max(bHeight, dHeight);
                // ifr.height = Math.max(height,400);
                // console.log(imgList);
                // let wd = ifr.contentWindow.document.documentElement.scrollWidth;
                // let ht = document.documentElement.clientHeight * 0.9 - 50;
                // if (!t && !wd) return;
                // let x = t / wd;
                // wd = wd < 365 ? 365 : wd;
                // this.explorerWidth = wd;
                // this.explorerHeight = ht;
                // // ifr.style.width = `${wd}px`;
                // // ifr.style.height = `${ht}px`;
                // // ifr.height = `${ht}px`;
                // ifr.style.transform = `scale(${x})`;
                // ifr.style.transformOrigin = '0 0';
                // document.getElementsByClassName('iframe_box')[0].style.height = ht*x + 'px'
            },
            onCheckChange (list, dataList) {
                console.log('onCheckChange', list, dataList)
//                 this.currentSelected = dataList.map(item => item.source)
                this.currentSelected = dataList;
                if (this.currentSelected.length < this.treeList.length) {
                    this.checkToggleName = '全选'
                } else {
                    this.checkToggleName = '全不选'
                }

                if (this.currentSelected.length > 0) {
                    this.setFileMenu();
                } else {
                    this.resetFolderMenu()
                }

                if (this.pickMode) {
                    this.$emit('onChangeSelect', dataList);
                }
            },
            toggleCheckAll () {
                this.$nextTick(() => {
                    if (this.currentSelected.length < this.treeList.length) {
                        this.$refs.treeDetail.checkAll()
                    } else {
                        this.$refs.treeDetail.uncheckAll()
                    }
                })
            },
            quitEditMode () {
                if (this.currentSelected.length) {
                    this.$refs.treeDetail.uncheckAll();
                }
                this.currentSelected = [];
            },
            resetFolderMenu() {
                let saveFolderMenus = deepCopy(folderMenus);
                this.menuData = saveFolderMenus.filter(menu => menu.show(this)).map(menu => {
                    if (menu.disable(this)) {
                        menu.disabled = true
                    }
                    return menu
                });
                if (this.menuData.length > 0 && this.menuData[0].value === 'upload') {
                    if (!this.menuData[0].disabled) {
                        this.$nextTick(() => {
                            console.log('initPCUploader menuData', this.menuData)
                            this.initPCUploader()
                        })
                    } else {
                        console.log('destroy Uploader')
                        Uploader.destroy()
                    }
                }
            },
            setFileMenu() {
                console.log('setFileMenu');
                this.menuData = fileMenus.filter(menu => {
                    if (typeof menu.show === 'function') {
                        return menu.show(this)
                    }
                    return true
                }).map(menu => {
                    if (typeof menu.disable === 'function' && menu.disable(this)) {
                        menu.disabled = true
                    }
                    return menu
                })
                console.log(this.currentSelected.length);
            },
            handleMenu(data, $event) {
                console.log('handleMenu', data, $event)
                switch (data.value) {
                    // folder menu
                    case 'upload':
//                        Uploader.prepareUpload.bind(this)(null, $event)
                        // do nothing
                        break
                    case 'newFolder':
                        this.openNewFolderDialog()
                        break
                    case 'newText':
                        this.openNewTextDialog()
                        break
                    // file menu
                    case 'rename':
                        this.fileType = this.currentSelected[0].fileType;
                        this.openRenameDialog(this.currentSelected[0].title)
                        break
                    case 'delete':
                        this.openDeleteDialog()
                        break
                    case 'download':
                        this.download(this.currentSelected[0].id)
                        break
                    default:
                        console.warn('unsolved menu', data)
                }
            },
            openNewFolderDialog(titleData) {
                this.currentDialog = 'newFolder';
                this.fileType = "folder";
                this.dialogTitle = newFolderDialogTitle
                this.dialogFormAttrs = newFolderFormAttrs
                this.$nextTick(() => {
                    this.$refs.dialog.setFormValues([titleData || this.newFolderTitleMaker()])
                    this.showFormDialog = true
                })
            },
            openNewTextDialog(titleData) {
                this.currentDialog = 'newText'
                this.fileType = "file";
                this.dialogTitle = newTextDialogTitle
                this.dialogFormAttrs = newTextFormAttrs
                this.$nextTick(() => {
                    this.$refs.dialog.setFormValues([titleData || this.newTextTitleMaker()])
                    this.showFormDialog = true
                })
            },
            openRenameDialog(title) {
                this.currentDialog = 'rename'
                this.dialogTitle = renameDialogTitle;
                this.dialogFormAttrs = this.fileType === 'folder' ? renameFormAttrs : renameFileAttrs;
                this.$nextTick(() => {
                    this.$refs.dialog.setFormValues([title])
                    this.showFormDialog = true
                })
            },
            openDeleteDialog() {
                let that = this
                this.currentDialog = 'rename'
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确认要删除选中的文件吗',
                    /*onCancel () {
                     console.log('plugin cancel')
                     },*/
                    onConfirm () {
                        that.delete(that.currentSelected.map(file => {
                            return file.id
                        }))
                    }
                })
            },
            onCancel() {
                console.log('onCancel');
//                this.showFormDialog = false
            },
            onCancelSearch() {

            },
            onShow() {
                console.log('onShow');
            },
            onHide() {
                console.log('onHide');
            },
            onDialogConfirm(vals) {
                console.log('onDialogConfirm', this.currentDialog, vals)
                if (this.currentDialog === 'newFolder') {
                    let title = vals[0]
                    this.newFolder(title)
                } else if (this.currentDialog === 'rename') {
                    let title = vals[0]
                    this.rename(this.currentSelected[0].id, title)
                } else if (this.currentDialog === 'newText') {
                    let title = vals[0]
                    this.newText(title)
                }
            },
            //搜索
            changeShowSearch() {
                this.showSearch = !this.showSearch;
            },
            getCompanyId (tid) {
                let url = '/zingbiz/ExternalContacts/ExternalContactsRest/getCurrentCardUrl';
                this.$http.post(url,{}).then(res => {
                    if (res.data.success) {
                        this.cardUrl = res.data.data.cardUrl;
                        this.companyId = res.data.data.companyId;
                        this.loadPath(tid)
                    }
                },err => {
                    console.log(err);
                });
            },
            /**
             * 加载目录数据
             * @param tid 当前目录id
             */
            loadPath(tid) {
                if (this.companyId === 'undefined') {
                    this.getCompanyId(tid)
                    return
                }
                let parentId
                if (!tid) {
                    parentId = ''
                } else {
                    parentId = tid
                }
                // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/getPathFilesN.action'
                let url = '/zingbiz/explorer/getPathFilesN'
                let params = {
                    parentId: parentId,
                    companyId: this.currentCompanyId || this.companyId,
                    recordType: this.recordType,
                }
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                this.$http.post(url, params).then(res => {
                    if (res.data.success) {

                        this.treeNavData = res.data.data;
                    }
                })
                // reset uploader
                Uploader.resetUploader.bind(this)(tid)
            },
            /**
             * 加载目录
             * @param data 目录数据，见接口：'/ZingMH/ZDesk/MENHUWX/Explorer/getPathFilesN.action'
             */
            doLoadPath(data) {
                console.log(data,'目录');
                if (!data) {
                    console.error('empty treeData', data)
                    return
                }
                // 只读
                if (data['isReadOnly'] === false) {
                    this.readOnlyMode = false
                } else {
                    this.readOnlyMode = true
                }
                // 导航数据
                if (!data.parentNames || (!data.parentIds && !(data.parentNames === '全部文件' && data.parentIds === ''))) {
                    console.error('treeData error', data)
                    return
                }

                // { name: '科目设置', tid: 'kemushezhi' }
                let names = data.parentNames.split('/')
                let tids = data.parentIds.split(' ')
                if (names.length !== tids.length) {
                    console.error('treeData parentName or parentIds error', data)
                    return
                }

                let treeNavList = []
                let currentT = ''
                let idx = 0
                while (idx < names.length) {
                    treeNavList.push({
                        name: names[idx],
                        tid: tids[idx]
                    })

                    if (idx === names.length - 1) {
                        currentT = tids[idx]
                    }

                    idx++
                }

                this.treeNavList = treeNavList
                this.currentT = currentT
                if (!this.multipleMode) {
                    this.$emit('getParentId',this.currentT)
                }
                // 列表数据
                if (!data.fileList) {
                    console.error('treeData fileList empty', data)
                    return
                }

                // { id: '32', type: 'branch', title: '资产', tid: '2', source: {...} }
                let treeList = data.fileList.map(file => {
                    let o = {
                        id: file.id,
                        type: file.type === 'folder' ? 'branch' : 'leaf',
                        fileType: file.type,
                        tid: file.type === 'folder' ? file.id : file.parentId,
                        title: file.title,
                        desc: this.formatFileInfo(file),
                        source: file
                    }
                    switch (file.type) {
                        case 'folder':
                            o.src = require('../../assets/img/explorer/folder.png')
                            break
                        case 'txt':
                            o.src = require('../../assets/img/explorer/txt.png')
                            break
                        case 'pdf':
                            o.src = require('../../assets/img/explorer/pdf.png')
                            break
                        case 'zip':
                            o.src = require('../../assets/img/explorer/zip.png')
                            break
                        case 'rar':
                            o.src = require('../../assets/img/explorer/rar.png')
                            break
                        case 'image':
                            o.src = require('../../assets/img/explorer/jpg.png')
                            break
                        case 'audio':
                            o.src = require('../../assets/img/explorer/mp3.png')
                            break
                        case 'video':
                            o.src = require('../../assets/img/explorer/avi.png')
                            break
                        case 'doc':
                            o.src = require('../../assets/img/explorer/doc.png')
                            break
                        case 'xls':
                            o.src = require('../../assets/img/explorer/xls.png')
                            break
                        case 'ppt':
                            o.src = require('../../assets/img/explorer/ppt.png')
                            break
                        default:
                            o.src = require('../../assets/img/explorer/file.png')
                    }

                    return o
                })
                this.treeList = treeList
                console.log('resetFolderMenu loadPath', data)
                this.resetFolderMenu()
            },
            /**
             * 搜索
             * @param data 文本数据'
             */
            onSubmitSearch(value) {
                if (!value) return;
                if (this.noteMode) {
                    console.log('getAppnoteBooks');
                    // let url = '/ZingMH/ZDesk/Appnote/getAppnoteBooks.action';
                    let url = '/zingbiz/appnote/getAppnoteBooks';
                    let params = {
                        noteparam: value
                    };
                    // this.$http.post(url, Qs.stringify(params)).then(res => {
                    this.$http.post(url,params).then(res => {
                        if (res.data.success) {
                            let treeNavData = res.data.data;
                            treeNavData.parentNames = '全部文件/搜索结果';
                            treeNavData.parentIds = ` ${this.companyId}`;
                            this.treeNavData = treeNavData;
                        }
                    });
                } else if (this.pickMode) {
                    // let url = 'ZingMH/ZDesk/MENHUWX/Explorer/searchFilesN.action';
                    let url = '/zingbiz/explorer/searchFilesN';
                    let params = {
                        recordType: this.recordType,
                        companyId: this.currentCompanyId || this.companyId,
                        keyword: value
                    };
                    console.log(params);
                    // this.$http.post(url, Qs.stringify(params)).then(res => {
                    this.$http.post(url, params).then(res => {
                        if (res.data.success) {
                            let treeNavData = res.data.data;
                            treeNavData.parentNames = '全部文件/搜索结果';
                            treeNavData.parentIds = ` ${this.companyId}`;
                            this.treeNavData = treeNavData;
                        }
                    });
                }
            },

            newTextTitleMaker () {
                let base = '新建文本'
                let suffix = 0
                let title = base
                outer: while (true) {
                    for (let i = 0; i < this.treeList.length; i++) {
                        let data = this.treeList[i]
                        if (title === data.title) {
                            title = base + ++suffix
                            continue outer
                        }
                    }

                    return title
                }
            },
            // 文件夹名称自动生成器
            newFolderTitleMaker () {
                let base = '新建文件夹'
                let suffix = 0
                let title = base
                outer: while (true) {
                    for (let i = 0; i < this.treeList.length; i++) {
                        let data = this.treeList[i]
                        if (title === data.title) {
                            title = base + ++suffix
                            continue outer
                        }
                    }

                    return title
                }
            },
            // 新建文件夹名称校验
            fileTitleCheck (title) {
                let tmp = title.replace(/(^\s*)|(\s*$)/g, "")
                if (tmp.length === 0) {
                    return [false, '文件名不能为空']
                }
                // 重名校验
                for (let i = 0; i < this.treeList.length; i++) {
                    let data = this.treeList[i]
                    if (tmp === data.title && data.fileType === this.fileType) {
                        return [false, '文件名重名']
                    }
                }
                // 合法性校验
                if (/[\/\\"<>\?\*]/gi.test(tmp)) {
                    return [false, '文件名不能包含非法字符']
                }
                return [true, '', tmp]
            },
            /**
             * 新建文件夹
             * @param title 文件夹名称
             */
            newFolder(title) {
                // 校验文件名
                let [checkPass, msg, retTitle] = this.fileTitleCheck(title);
                if (!checkPass) {
                    this.bottomToast(msg,'warn')
                    this.$nextTick(() => {
                        this.openNewFolderDialog(title)
                    })
                    return
                }
                // 新建文件夹
                this.$vux.loading.show()

                let params = {
                    title: retTitle,
                    parentId: this.currentT,
                    recordType: this.recordType,
                    companyId: this.currentCompanyId || this.companyId
                }
                // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/newFolderN.action'
                let url = '/zingbiz/explorer/newFolderN'
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                this.$http.post(url, params).then(res => {
                    /* todo ajax 不刷新目录的方式
                     let o = {
                     id: file.id,
                     type: file.type === 'folder' ? 'branch' : 'leaf',
                     fileType: file.type,
                     tid: file.type === 'folder' ? file.id : file.parentId,
                     title: file.title,
                     desc: this.formatFileInfo(file),
                     source: file
                     }
                     this.treeList.push(o)
                     */
                    if (res.data.success) {
                        this.bottomToast('新建文件夹成功')
                        // 目前暂时刷新目录
                        this.loadPath(this.currentT)
                        this.$vux.loading.hide()
                    } else {
                        this.bottomToast('新建文件夹失败', 'warn')
                        // this.$vux.loading.hide()
                        this.openNewFolderDialog(title)
                    }

                }).catch(err => {
                    console.error(err)
                    this.bottomToast('新建文件夹失败', 'warn')
                    this.$vux.loading.hide()
                    this.openNewFolderDialog(title)
                })
            },
            /**
             * 新建文本
             * @param title 文本名称
             */
            newText(title) {
                // 校验文本名
                let [checkPass, msg, retTitle] = this.fileTitleCheck(title)
                if (!checkPass) {
                    this.bottomToast(msg,'warn')
                    this.$nextTick(() => {
                        this.openNewTextDialog(title)
                    })
                    return
                }
                // 新建文本
                this.$vux.loading.show()
                let params = {
                    title: retTitle,
                    parentId: this.currentT,
                    recordType: this.recordType,
                    companyId: this.currentCompanyId || this.companyId,
                    notifier: this.recordType,
                    isDuplication: true
                }
                // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/newFileN.action'
                let url = '/zingbiz/explorer/newFileN'
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                this.$http.post(url, params).then(res => {
                    this.bottomToast('新建文本成功')
                    // 目前暂时刷新目录
                    this.loadPath(this.currentT)
                    this.$vux.loading.hide()
                }).catch(err => {
                    console.error(err)
                    this.bottomToast('新建文本失败')
                    this.$vux.loading.hide()
                    this.openNewTextDialog(title)
                })
            },
            /**
             * 重命名
             * @param title 文件夹名称
             */
            rename(id, title) {
                // 校验文件名
                let [checkPass, msg, retTitle] = this.fileTitleCheck(title)
                if (!checkPass) {
                    this.bottomToast(msg, 'warn')
                    this.$nextTick(() => {
                        this.openRenameDialog(title)
                    })
                    return
                }
                // 重命名
                this.$vux.loading.show()

                let params = {
                    id: id,
                    title: retTitle,
                    parentId: this.currentT,
                    recordType: this.recordType,
                    companyId: this.currentCompanyId || this.companyId
                }

                if (this.recordType === 'appnote') {
                    params.notifier = 'notifier';
                    params.isDuplication = false;
                }

                // let url = '/ZingMH/ZDesk/MENHUWX/Explorer/renameFileN.action'
                let url = '/zingbiz/explorer/renameFileN'
                // this.$http.post(url, Qs.stringify(params)).then(res => {
                this.$http.post(url, params).then(res => {
                    // 本地更新
                    let index = -1
                    for (let i = 0; i < this.treeList.length; i++) {
                        if (this.treeList[i].id === id) {
                            index = i
                            break
                        }
                    }

                    if (index >= 0) {
                        let o = this.treeList[index]
                        o.title = retTitle
                        o.updateTime = dateFormat(new Date())
                        o.desc = this.formatFileInfo(o)
                        this.$set(this.treeList, index, JSON.parse(JSON.stringify(o)))
                    }

                    this.bottomToast('重命名成功')
                    this.$vux.loading.hide()
                }).catch(err => {
                    console.error(err)
                    this.bottomToast('重命名失败', 'warn')
                    this.$vux.loading.hide()
                    this.openRenameDialog(title)
                })
            },
            /**
             * 删除
             * @param idList
             */
            delete(idList) {
                console.log('delete', idList, this.treeList)
                console.log(idList.join(','));
                let removeData = idList.join(',');
//                let removeData = ``, item;
//                for (let i = 0; i < idList.length; i++) {
//                         item = idList[i];
//                    if (i === idList.length - 1) {
//                        removeData += `${item}`
//                    } else {
//                        removeData += `${item},`
//                    }
//                }
//                 let url = '/ZingMH/ZDesk/MENHUWX/Explorer/remove.action'
                let url = '/zingbiz/explorer/remove'
                let postData = {
                    removeData: removeData,
                    parentId: this.currentT,
                    recordType: this.recordType,
                    companyId: this.currentCompanyId || this.companyId
                }

                if (this.recordType === 'appnote') {
                    postData.notifier = 'appnote'
                }
                // this.$http.post(url, Qs.stringify(postData)).then(res => {
                this.$http.post(url, postData).then(res => {
                    if (res.data.success) {
                        this.bottomToast("删除成功")
                        this.treeList = this.treeList.filter(tree => {
                            return idList.indexOf(tree.id) === -1
                        });
                    } else {
                        this.bottomToast("删除失败", 'warn')
                    }
                }).catch(err => {
                    console.error(err)
                    this.bottomToast("删除失败", 'warn')
                })
            },
            download (id) {
                console.log(id,'下载');
                if (isWeiXin()) {
                    window.location.href = "/ZingMH/zh_cn/explorer/download.htm?id=" + id + "&t=" + new Date().getTime()
                } else {
                    // window.location.href = "/ZingMH/ZDesk/MENHUWX/Explorer/downFile.action?id=" + id;
                    window.location.href = "/zingbiz/explorer/downFile?id=" + id;
                }
            },
            formatFileInfo (file) {
                let fileInfo = ''

                if (file.type !== 'folder') {
                    if (file.fileSize && file.fileSize > 0) {
                        fileInfo += formatFileSize(file.fileSize)
                    } else {
                        fileInfo += '0B'
                    }
                    fileInfo += ' '
                }

                if (!file.updateTime) {
                    console.warn('formatFileInfo: incorrect updateTime ', file)
                }

                fileInfo += file.updateTime

                return fileInfo
            },
            bottomToast (msg, type) {
                let _this = this
                if (!msg) return
                let tp = type ? type : 'success';
                this.$vux.toast.show({
                    text: msg,
                    type: tp,
                    position: 'middle',
                    width: '10em',
                    onHide() {
                        _this.bottomToast('')
                    }
                })
            },
            initPCUploader() {
                if (this.isInitUploader) return
                this.isInitUploader = true

                Uploader.destroy()

                let _this = this
                // let url = `/ZingMH/ZDesk/MENHUWX/Explorer/uploadFileN.action?recordType=${this.recordType}&companyId=${this.currentCompanyId}`
                let url = `/zingbiz/explorer/uploadFileN?recordType=${this.recordType}`
                Uploader.init({
//                    uploaderSwfPath:
//                        "https://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf",
                    pickDom: document.getElementById(pickerId),
                    uploaderServer: url,
                    folderPath: this.currentT,
                    onUploadStart: function (isError, refs) {
                        /*if (isError === true) {
                         } else {
                         //showBottomPrompt("正在上传请稍后")
                         }*/
                        _this.$vux.loading.show()
                    },
                    onMessage: function (msg, refs) {
                        console.log(msg);
                        // _this.bottomToast(msg)
                    },
                    onServerFailed: function (msg, refs) {
                        //hideBottomPrompt();
                        _this.bottomToast('上传失败：' + msg.mgs, 'warn')
                        _this.$vux.loading.hide()
                    },
                    onServerSuccess: function (data, refs) {
                        _this.bottomToast('上传成功')
                        // 目前暂时刷新目录 todo
                        _this.loadPath(_this.currentT)
                        _this.$vux.loading.hide()
                    }
                })
            },
        }
    }
</script>
<style>
    .explorer-component .vux-prompt {
        padding-bottom: 0 !important;
        border-bottom: none;
    }

    .explorer-component .weui-cells:after {
        border-bottom: none;
    }

    .explorer-component .weui-check:checked + .weui-icon-checked:before {
        color: #108EE9 !important;
    }

    .explorer-component .weui-cell__primary {
        color: #888888 !important;
    }

    .explorer-component .weui-dialog__btn_primary {
        color: #ff8000 !important;
    }

    .explorer-component .vux-fade-leave-active, .vux-fade-leave-to, .vux-dialog-leave-active, .vux-dialog-leave-to {
        animation-duration: 0.2s !important;
        animation-name: none !important;
    }
    .weui-toast.weui-toast_forbidden {
        color: #e5e5e5
    }
    .explorer-component .weui-dialog__hd {
        border-bottom: none !important;
    }
    .weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before{
        color: #e5e5e5
    }
    .explorer-component .tree-nav{
        overflow-x: visible
    }
</style>
<style lang="stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    .explorer-component
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        background #fff
        & > div
            width: 100%
        .explorer-component-nav
            width 100%
        .explorer-component-nav-text
            width 100%
            height 100%
            text-align: center
            color: #ff8000
            font-size 16px
            background #fff
        .explorer-component-detail
            flex-grow 2
            overflow auto
    .explorer-my-footer
        position: fixed
        bottom: 0
        left: 0
        width: 100%
        height: 50px
        background-color: black
        z-index: 10000 !important
        display: flex
        a
            display: flex;
            flex: 1;
            color: #fff
            align-items: center
            justify-content: center


    .my_iframe_form_data
        width: 100%
        max-width 100%
        height 92%
        font-size 16px!important
        -webkit-overflow-scrolling: touch
        overflow: scroll
        #my_iframepage
            /*-webkit-overflow-scrolling: touch*/
            /*overflow-y: scroll*/
            height: 100%;
            width: 100%;
</style>

