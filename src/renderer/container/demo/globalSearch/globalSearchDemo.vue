<template>
    <div class="global-search-demo">
        <zing-head :title="'各个页面'" class="vue-head">
            <div slot="header-right">
                <span class="header-search">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </span>
            </div>
        </zing-head>
        <!--<global-search v-model="isShowSearch"></global-search>-->
        <!--<explorer-component :initialTid="initialTid" :companyIdAndRecordType="companyIdAndRecordType" @backClick="backClick"></explorer-component>
        <org-member-picker :showTab="['org']" :multiple="false"
                           :showPicker="showOrgMemberPicker" :companyId="companyId"
                           @picked="chooseExplorer"></org-member-picker>-->

        <!--<popup v-model="showCoPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'auto'}">
            <check-panel :max="1" :disabled="true" :labelPosition="'left'" :type="'2'"
                         :list="companyDataListMapped" @on-click-item="chooseCompany">
            </check-panel>
        </popup>-->
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GlobalSearch from "../../../container/globalSearch/globalSearch";
    /*import { MH_changeUserCompany } from "@/utils/fn";*/
    import Popup from "vux/src/components/popup/index";
    /*import CheckPanel from "../../../components/checkpanel/CheckPanel";*/

    export default {
        name: 'globalSearchDemo',
        components: {
            GlobalSearch,
            ZingHead,
            Popup,
        },
        data () {
            return {
                isShowSearch: false,



                companyDataList: [],
                showOrgMemberPicker: false,
                companyId: '',
                initialTid: '',
                companyIdAndRecordType: ''
            }
        },
        computed: {
            /*companyDataListMapped() {
                return this.companyDataList.map(data => {
                    let o = {
                        title: data.companyName,
                        desc: data.companyId,
                        source: data
                    }
                    return o
                })
            }*/
        },
        mounted() {
            // load companyData
            /*let urlAllBingdingCompany = "/ZingMH/ZKM/myGroup/loadCompanys.action";
            this.$http.post(urlAllBingdingCompany).then(res => {
                this.companyDataList = res.data.data
            })*/
        },
        methods: {
            backClick() {
                this.$router.go(-1)
            },
            search() {
                console.log("search.........")
                /*this.isShowSearch = true;*/

                this.$router.push({
                    path: "/globalSearch",
                    query:{
                    }
                });
            },
            /*chooseCompany(data) {
                console.log('chooseCompany', data)
                this.companyId = data.source.companyId
                /!*this.showOrgMemberPicker = true*!/
                /!*this.showCoPicker = false*!/
                console.log(this.companyId)
                this.$router.push({
                    path: "/orgList",
                    query:{
                        companyId:data.source.companyId,
                    }
                });
            },*/
            /*chooseExplorer(arr) {
                console.log('chooseExplorer', arr)
                if (arr && arr instanceof Array && arr.length > 0) {
                    let dept = arr[0]
                    let recordType = 'explorer_department_' + dept.id
                    MH_changeUserCompany(this.companyId).then(() => {
                        this.initialTid = ''
                        this.companyIdAndRecordType = this.companyId + ' ' + recordType
                        this.showOrgMemberPicker = false
                    })
                }
            },*/
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
    .global-search-demo
        width 100%
        height 100%
</style>
