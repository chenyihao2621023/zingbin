<template>
    <div class="explorer-picker">
        <popup v-model="showCabinets" height="100%" width="100%" position="right"
               :popup-style="{'overflow-y': 'auto','zIndex':1002}">
          <div class="explorer-picker-my">
              <zing-head title="文件柜" @doSome="onDoSome" :isComeBack="false" class="explorer-picker-head">
              </zing-head>
              <div class="explorer-picker-content">
                  <div class="explorer-picker-content-my">
                      <zi-tree
                          :props="defaultProps"
                          :data="orgData"
                          :explorerBtn="true"
                          @explorer="explorer"
                          @select="select"
                          :defaultExpandAll="true"
                      />
                  </div>
          </div>
         </div>
            <popup v-model="showExplorerPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden','zIndex':2000}">
               <explorer-component
                   botm="40px"
                   @getParentId="getParentId"
                   :initialTid="initialTid"
                   :currentCompanyId="currentCompanyId"
                   :companyIdAndRecordType="companyIdAndRecordType"
                   @backClick="backClick"
                   :pickMode="true"
                   :multipleMode = "!showUploadFile"
                   @onChangeSelect="changeSelect"
               >
               </explorer-component>
               <x-button v-if = "!showUploadFile"
                   @click.native="clickDetermine"
                   :disabled="disabled"
                   class="explorer-button"
                   type="primary">确定
               </x-button>
                <x-button v-else
                    @click.native="clickUploadFile"
                    class="explorer-button"
                    type="primary">保存到当前目录
                </x-button>
           </popup>
        </popup>
    </div>
</template>
<script>
    import ExplorerComponent from "./Explorer.vue"
    import ZiTree from '@/components/zitree/ZiTree';
    import ZingHead from "../../components/zingHead/ZingHead.vue"  //公共头部
    import Qs from "qs"
    import { deepCopy } from "../../utils/fn";
    import { mapMutations } from 'vuex';
    import { XButton, Popup } from "vux"
    export default {
        name: 'ExplorerPicker',
        components: {
            XButton,
            Popup,
            ExplorerComponent,
            ZiTree,
            ZingHead
        },
        props: {
            showCabinets: {
                type: Boolean,
                default: false
            },
            showUploadFile: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dataList: [],
                companyId:'',
                recordType:'',
                showExplorerPicker: false,
                defaultProps: {
                    title: "title",
                    children: "children",
                    src: "src",
                    auth: "auth"
                },
                parentId:'',
                companyIdAndRecordType:'',
                orgData:[]
            }
        },
        computed: {
//            total() {
//                return this.dataList.length
//            },
            disabled() {
                return !this.dataList.length
            }
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.setMode(false)
            })
        },

        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例
            this.setMode(true);
            next();
        },
        created() {
          this.getOrgUserData()
        },
        methods: {
            ...mapMutations({
                setMode: 'SET_MODE'
            }),
            onDoSome() {
//              this.showCabinets = false;
              this.$emit('goBack')
            },
            explorer(item) {
               if (!item) return;
                let { companyId,flag }  = item.origin;
               let recordType;
                if (flag) {
                    recordType = `explorer_company_${companyId}`;
                } else {
                    recordType = `explorer_department_${companyId}`;
                }
                this.currentCompanyId = item.origin.source.companyId;
                this.recordType = recordType;
                this.companyIdAndRecordType = `${companyId} ${recordType}`
                this.showExplorerPicker = true;
                // this.showCabinets = false
            },
            backClick() {
               this.showExplorerPicker = false;
            },
            changeSelect(dataList) {
                this.dataList = dataList;
            },
            getParentId(val) {
                this.parentId = val;
            },
            clickDetermine() {
                console.log('clickDetermine', this.dataList);
                this.$emit('picked', deepCopy(this.dataList))
            },
            clickUploadFile() {
                this.$emit('uploadFile',this.recordType,this.parentId,this.backClick)
            },
            getOrgUserData() {
                let url = 'ZingMH/ZDesk/MENHUWX/MHHelper/getAllCompanyAndOrg.action';
                let params = {
                    recordType: 'org'
                };
                this.$http.post(url,Qs.stringify(params)).then(res => {
                    if (res.data.success) {
                        this.orgData = this.handleOrgData(res.data.data,this);
                    }
                })
            },
            handleOrgData(orgUserDatas,_this) {
                let tmpTreeData = orgUserDatas.map(orgData => {
                    let treeOrgData = {};
                    orgData.flag = true;
                    _this.handleOrgItem(treeOrgData, orgData, _this, "", "");
                    return treeOrgData;
                });
                return tmpTreeData;
            },
           handleOrgItem(treeOrgData, orgData, _this, searchType, searchVal) {
                treeOrgData.title = orgData["text"];
                treeOrgData.type = "dept";
                treeOrgData.auth = true;
                treeOrgData.flag = orgData.flag || false;
               treeOrgData.companyId = orgData.flag ? orgData.companyId : orgData.id
                // 原始数据
                treeOrgData.source = deepCopy(orgData);

                let children = [];
                treeOrgData.children = children;
                // 处理成员
                let users = orgData["users"];
                if (!users) users = [];
                users.forEach(user => {
                    let treeUserData = {};
                    treeUserData.id = user["rowId"];
                    // 姓名取'userName'
                    treeUserData.title = user["userName"];
                    treeUserData.src = user["headImg"];
                    treeUserData.type = "user";
                    treeUserData.auth = user["file_status"] === "通过" ? true : false;
                    treeUserData.source = user;
                    if (searchType === "search") {
                        if (treeUserData.title.indexOf(searchVal) >= 0) {
                            children.push(treeUserData);
                        }
                    } else {
                        children.push(treeUserData);
                    }
                });

                // 处理子部门
                if (orgData["children"]) {
                    orgData["children"].forEach(childOrgData => {
                        let treeChildOrgData = {};
                        children.push(treeChildOrgData);
                        // 尾递归处理数据
                        _this.handleOrgItem(
                            treeChildOrgData,
                            childOrgData,
                            _this,
                            searchType,
                            searchVal
                        );
                    });
                }
            },
        },
    }
</script>
<style>
    .explorer-picker .iconfont.icon-icon_folder{
        color: #ff8000 !important;
    }
    .explorer-picker .zi-tree .span-wrapper-right {
        margin-right: 13px !important;
    }
</style>
<style lang="stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';

    /*.explorer-picker*/
        /*display flex*/
        /*flex-direction column*/
        /*width 100%*/
        /*height 100%*/
        /*.explorer-picker-head*/
            /*flex-shrink 0*/
            /*position:fixed*/
            /*top:0*/
            /*left:0*/
            /*width:100%*/
            /*z-index:100*/
        /*.explorer-picker-content*/
            /*flex-grow 1*/
            /*overflow-y auto*/
            /*margin-top:50px*/
            /*background-color:#fff*/


    .explorer-picker-my
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%
        .explorer-picker-head
            flex-shrink: 0
        .explorer-picker-content
            background #fff
            flex-grow 2
            overflow auto
            .explorer-picker-content-my
                background #fff
                min-width: 100%
                height: 100%


      .explorer-button
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

