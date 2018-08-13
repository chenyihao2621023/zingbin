<template>
    <div class="explorer-demo">
        <explorer-component :initialTid="initialTid" :companyIdAndRecordType="companyIdAndRecordType" @backClick="backClick"></explorer-component>
        <org-member-picker :showTab="['org']" :multiple="false"
                           :showPicker="showOrgMemberPicker" :companyId="companyId"
                           @abort="abort"
                           @picked="chooseExplorer">
        </org-member-picker>
        <popup v-model="showCoPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'auto'}">
            <check-panel :max="1" :disabled="true" :labelPosition="'left'" :type="'2'"
                         :list="companyDataListMapped" @on-click-item="chooseCompany">
            </check-panel>
        </popup>
        <popup v-model="showTypePicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'auto'}">
            <button @click="clickItem('company')">公司</button>
            <button @click="clickItem('department')">部门</button>
            <button @click="onShowCabinets">选择</button>
        </popup>
        <explorer-picker :showCabinets="showCabinets" @goBack="goBack">

        </explorer-picker>
    </div>
</template>

<script>
    import ExplorerComponent from 'components/explorer/Explorer'
    import { MH_changeUserCompany } from "@/utils/fn";
    import OrgMemberPicker from "../../../components/orgmemberpicker/OrgMemberPicker";
    import Popup from "vux/src/components/popup/index";
    import CheckPanel from "../../../components/checkpanel/CheckPanel";
    import ExplorerPicker from "../../../components/explorer/ExplorerPicker.vue";

    export default {
        name: 'FlatTreeDemo',
        components: {
            CheckPanel,
            Popup,
            OrgMemberPicker,
            ExplorerComponent,
            ExplorerPicker
        },
        data () {
            return {
                showTypePicker: true,
                showCoPicker: false,
                companyDataList: [],
                showOrgMemberPicker: false,
//                treeNavData: {},
                companyId: '',
//                recordType: '',
                initialTid: '',
                companyIdAndRecordType: '',
                recordType:'',
                showCabinets:false
            }
        },
        computed: {
            companyDataListMapped() {
                return this.companyDataList.map(data => {
                    let o = {
                        title: data.companyName,
                        desc: data.companyId,
                        source: data
                    }
                    return o
                })
            }
        },
        mounted() {
            // load companyData

            let urlAllBingdingCompany = "/ZingMH/ZKM/myGroup/loadCompanys.action";
            this.$http.post(urlAllBingdingCompany).then(res => {
                this.companyDataList = res.data.data
            })
        },
        methods: {
            backClick() {
                this.$router.go(-1)
            },
            onShowCabinets() {
                this.showCabinets = true;
            },
            goBack() {
                this.showCabinets = false;
            },
            chooseCompany(data) {
                console.log('chooseCompany', data)
                this.showOrgMemberPicker = true
                this.showCoPicker = false
                this.companyId = data.source.companyId
                switch ( this.recordType ) {
                    case 'company':
                        let recordType = 'explorer_company_' + this.companyId
                        this.companyIdAndRecordType = this.companyId + ' ' + recordType
                        this.pathName = 'explorer'
                        this.goFileCabinet();
                        break;
                    case 'department':
                        this.pathName = 'explorer'
                        this.showOrgMemberPicker = true
                        this.showCoPicker = false
                        break;
                    case 'companyFile':
                        this.pathName = 'explorerPicker'
                        let recordTypeA = 'explorer_company_' + this.companyId
                        this.companyIdAndRecordType = this.companyId + ' ' + recordTypeA
                        this.goFileCabinet();
                        break;
                    case 'departmentFile':
                        this.pathName = 'explorerPicker'
                        this.showOrgMemberPicker = true
                        this.showCoPicker = false
                        break;
                }
            },
            chooseExplorer(arr) {
                console.log('chooseExplorer', arr)
                if (arr && arr instanceof Array && arr.length > 0) {
                    let dept = arr[0]
                    let recordType = 'explorer_department_' + dept.id
                    this.companyIdAndRecordType = this.companyId + ' ' + recordType
                    this.initialTid = ''
                    this.showOrgMemberPicker = false
                    this.goFileCabinet()
                }
            },
            clickItem(type) {
                this.showCoPicker = true;
                this.showTypePicker = false;
                this.recordType = type;
            },
            goFileCabinet() {
                MH_changeUserCompany(this.companyId).then(() => {
                    this.$router.push({
                        name:this.pathName,
                        query: {
                            companyIdAndRecordType: this.companyIdAndRecordType,
                            initialTid: this.initialTid
                        }
                    })
                })
            },
            abort() {
                this.showOrgMemberPicker = false
                this.showCoPicker = true
            }
            /*doLoadPath(tid) {
                console.log('doLoadPath', tid)
                let parentId
                if (!tid) {
                    parentId = ''
                } else {
                    parentId = tid
                }
                let url = '/ZingMH/ZDesk/MENHUWX/Explorer/getPathFilesN.action'
                let params = {
                    parentId: parentId,
                    companyId: this.companyId,
                    recordType: this.recordType,
                }
                console.log('doLoadPath params', params)
                this.$http.post(url, Qs.stringify(params)).then(res => {
                    if (res.data.success) {
                        this.treeNavData = res.data.data
                    }
                })
            }*/
        }
    }
</script>

<style lang="stylus" scoped>
    .explorer-demo
        width 100%
        height 100%
</style>
