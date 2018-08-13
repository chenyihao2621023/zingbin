<!--任务管理-->
<template>
    <div class="page-content">
       <!--首页头部-->
        <zing-head
          v-if="!isGuidang"
          :isComeBack="isComeBack"
          :popupPickerData="listB"
          :popupTitle="titleB"
          @popup-change="classfiyChange"
          @popup-onhide="onHide"
          @doSome="getInfo()"
          >
            <div slot="header-right">
                <span class="header-search">
                   <i class="iconfont icon-fangdajing" @click="task_search"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                 </span>
            </div>
        </zing-head>
        <!--已归档任务集头部-->
        <zing-head
            v-if="isGuidang"
            :isComeBack="isComeBack"
            :title="'已归档任务集'"
            @doSome="getInfo()">
            <slot v-if="!title" name="center"></slot>
            <div v-else-if="!popupPickerData.length">{{taskManageTitle}}</div>
            <div slot="header-right">
                <span class="header-search">
                   <i class="iconfont icon-fangdajing" @click="task_search"></i>
                </span>
                <span class="header-jiahao">
                    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                 </span>
            </div>
        </zing-head>
       <!--搜索-->
         <search
            class="searchStyle"
            :searchFlag="isShow"
            @cancelInput ="onCancel"
            @confirmInput="onSubmit"
        ></search>
       <!--任务集-->
        <div class="taskManageActivityAitema">
            <scroll ref="scroll"
                    :scrollbar="true"
                    :observeDOM="true"
                    :data="mergeTask"
                    :startY="0"
                    :listenScroll="true"
                 >
                <div>
                    <!--置顶任务-->
                    <div v-show="starUnits" v-for="(starUnit,index) in starUnits" :key="index" class="taskManageGridCard" style="background:rgb(150,150,150)">
                        <GridCard>
                            <div slot="cardLeft" class="taskManageGridCardLeft" @click="gotoList(starUnit)">
                                <div :class="'leftImg iconfont icon-'+starUnit.workType" style="color: #fff;font-size: 40px;padding-left: 5px;padding-top: 5px;border-radius: 5px" >
                                    <badge class="taskManageBadge" v-if="boardIdArr.indexOf(starUnit.boardId)!==(-1)"></badge>
                                </div>
                                <div class="taskManageCardtext">
                                    <p class="personnel">{{starUnit.title}}</p>
                                    <p class="personne2">{{starUnit.userName}}</p>
                                </div>
                            </div>
                            <div slot="cardRight" class="taskManageGridCardRight" @click="gotoList(starUnit)">
                                <span class="taskManageIcon">
                                    <i class="iconfont icon-gengduo" @click.stop="gotoUpdateDelPage(starUnit,index)"></i>
                                </span>
                                <div class="tag-wrapper">
                                    <div v-if="starUnit.boardProperty">
                                        <span class="tag-wrapper" v-for="(typeTag,num) in starUnit.boardProperty.trim().split(' ') " :key="num">
                                            <tag v-if="starUnit.boardProperty" type="success">{{typeTag}}</tag>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                    <!--非置顶-->
                    <div v-for="(taskUnit,item) in unStarUnits" :key="item" class="taskManageGridCard">
                        <GridCard>
                            <div slot="cardLeft" class="taskManageGridCardLeft" @click="gotoList(taskUnit)">
                                <div :class="'leftImg iconfont icon-'+taskUnit.workType" style="color: #fff;font-size: 40px;padding-left: 5px;padding-top: 5px;border-radius: 5px" >
                                    <badge class="taskManageBadge" v-if="boardIdArr.indexOf(taskUnit.boardId)!==(-1)"></badge>
                                </div>
                                <div class="taskManageCardtext">
                                    <p class="personnel">{{taskUnit.title}}</p>
                                    <p class="personne2">{{taskUnit.userName}}</p>
                                </div>
                            </div>
                            <div slot="cardRight" class="taskManageGridCardRight" @click="gotoList(taskUnit)">
                                <span class="taskManageIcon">
                                     <i class="iconfont icon-gengduo" @click.stop="gotoUpdateDelPage(taskUnit,item)"></i>
                                </span>
                                <div v-if="taskUnit.boardProperty">
                                    <span class="tag-wrapper" v-for="(typeTag,index) in taskUnit.boardProperty.trim().split(' ') " :key="index">
                                        <tag v-if="taskUnit.boardProperty" type="success">{{typeTag}}</tag>
                                    </span>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                    <p class="nav-text" v-if="starUnits.length<=0 && unStarUnits.length<=0">暂无数据，请添加</p>
                </div>
            </scroll>
        </div>
        <!--点点-->
        <x-dialog v-model="showDialog" hide-on-blur :mask-transition="maskTransition">
            <div class="edit" v-if="isCreaturl" @click="editMethod()">编辑属性</div>
            <div class="edit" v-if="Top" @click="editTop()">置顶</div>
            <div class="edit" v-if="cancelTop " @click="editTop()">取消置顶</div>
            <div class="edit" v-if="!isGuidang && isCreaturl" @click="editFile()">归档</div>
            <div class="edit" v-if="isGuidang && isCreaturl" @click="delatEditFile()">取消归档</div>
            <div class="edit" @click="edelDetle()" v-if ="isCreaturl">删除</div>
            <div class="edit" @click="editclazz()">分类</div>
        </x-dialog>
        <!--选择分类组件-->
        <classSelection

            :showPicker="showClassSetter"
            :title1="title1"
            :title2="title2"
            :tagType1="tagType1"
            :tagType2="tagType2"
            @abort="classAbort"
            @checkSelected="checkSelected"
             >
        </classSelection>
    </div>
</template>
<script>
import {
  XDialog,
  PopupPicker,
  // Search,
  Group,
  Confirm,
  XInput,
  XButton,
  Badge
} from "vux";
import Tag from "@/components/tag/Tag";
import GridCard from "@/components/gridcard/GridCard";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import Scroll from "@/components/scroll/Scroll";
import iconPicker from "@/components/iconpicker/IconPicker";
import classSelection from "../common/classSelection/classSelection";
import search from "@/components/search/search";
import Qs from "qs";
import {Z_IsEmpty20} from "utils/fn";
import taskDetail from "./taskDetail";
import _ from "lodash";
import store from "../../store";

export default {
    components: {
        XDialog,
        Tag,
        search,
        Dropdown,
        ZingHead,
        PopupPicker,
        Group,
        GridCard,
        Scroll,
        classSelection,
        Confirm,
        XInput,
        iconPicker,
        XButton,
        taskDetail,
        Z_IsEmpty20,
        store,
        Badge
    },
    data() {
        return {
            taskManageTitle: '',//头部标题
            isComeBack: false,//头部是否显示返回按钮
            isGuidang:false,//是否已归档
            isCreaturl:false,//是否是creatUrl
            currentTask: {}, // 缓存当前点击的task
            isShow: false,
            showDialog: false,
            datas: [
                { content: "新建任务集" },
                { content: "全体分类", url: "/classmain?classType=superWork" },
                { content: "个人分类", url: "/classmain?classType=work " },
                { content: "已归档任务集" },
            ],

            //分类
            valueB: [],
            titleB: "全部分类",
            listB: [
                {
                    name: "全部分类",
                    value: "all",
                    parent: 0
                },
                {
                    name: "所有分类",
                    value: "all001",
                    parent: "all"
                },
                {
                    name: "全体分类",
                    value: "publicWorkType",
                    parent: 0
                },
                {
                    name: "个人分类",
                    value: "privateWorkType",
                    parent: 0
                },

            ],

            taskUnits: [],
            showClassSetter: false,
            bgColor: "",
            dialogIcon: false,
            title1: "个人分类",
            title2: "全体分类",
            tagType1: "work",
            tagType2: "superWork",
            item: 0,
            starUnits: [], //置顶的taskUnit
            Top: true,  //是否显示置顶字样
            cancelTop: false,//是否显示取消置顶字样
            unStarUnits: [],  //非置顶的taskUnit
            mergeTask:[],//合并的置顶与非置顶
            classfiy: {},
            boardIdArr:[],//未读的boardId
            buildFileUrl:[],//服务号下已建档信息
            maskTransition:'vux-fade'//弹窗遮罩动画
        };
    },
    computed: {
        cardUrl() {
            return this.$store.state.ui.userInfo.cardUrl;
        },
        realName() {
            return this.$store.state.ui.userInfo.RealName;
        },
        companyId() {
            return this.$store.state.ui.userInfo.companyId;
        }
    },
    created() {
        this.initClassfiy()
        let r = store.getters.isPrototypeOf("")
        console.log(r)
    },
    mounted() {
        this.hongidan()
        this.getPersonnelFile()
        console.log("第一屏cardurl", this.$store.state.ui.userInfo.cardUrl);
        console.log("第一屏RealName", this.$store.state.ui.userInfo.RealName);
        console.log("第一屏companyId", this.$store.state.ui.userInfo.companyId);
    },
    methods: {
            //获取服务号下所有建档信息，同事名字
            getPersonnelFile() {
                let url = "/zingbiz/auth/user/getHrUserMapByCardUrlList";
                this.$http.get(url)
                    .then(res => {
                       let buildFileUrls = res.data.data //对象
                       let values = [];
                        Object.keys(buildFileUrls).forEach((key)=>{
                            values.push(buildFileUrls[key]);
                        })
                       this.buildFileUrl = values
                       this._getboardInfo();
                    })
            },
            //红点请求
            hongidan() {
                 let param =
                 { bType:'ZINGJOB',alertState:'1isAlert'}
                 let url = "/ZingMH/ZDesk/MENHUWX/MHHelper/getMH_DispAlertData.action";
                 this.$http.get(url, { params: param })
                     .then(res => {
                         let jobArr = res.data
                         for (let i=0; i<jobArr.length; i++) {
                             let arr = jobArr[i].tarId.split("#")
                             this.boardIdArr.push(arr[0])
                         }
                     });
             } ,
            //头部返回
            getInfo() {
               //未归档头部，返回消息列表
                if (!this.isGuidang) {
                    this.isGuidang = true
//                    this.$router.go(-1);
                    this.$router.push("../workbench");
                } else {
                  //归档头部
                    // this.$router.go(0);
                    this.isGuidang = false
                    this._getboardInfo('', false)
                }
            },
            //左上角所有分类
            initClassfiy(){
                let url =
                    "/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl";
                let params = {
                    tagType: "superWork",
                    pageNumber: 1,
                    pageSize: 200
                };
                this.$http.post(url, Qs.stringify(params)).then(response => {
                    if (response.data.success === true) {

                        _.each(response.data.data.data, classfiy => {
                            this.listB.push({parent: 'privateWorkType', name: classfiy.tags, value: classfiy.tags})
                        })
                        params.tagType = 'superWork'
                        this.$http.post(url, Qs.stringify(params)).then(response => {
                            if (response.data.success === true) {

                                _.each(response.data.data.data, classfiy => {
                                    this.listB.push({
                                        parent: 'publicWorkType',
                                        name: classfiy.tags,
                                        value: classfiy.tags
                                    })
                                })

                            } else {
                                console.error('错误')
                            }
                        });

                    } else {
                        console.error('错误')
                    }
                });
            },
            //左所有分类
            classfiyChange(val) {
                this.classfiy.workType = val[0]           //左全体或个人分类
                this.classfiy.secondedWorkType = val[1]   //左全体或个人分类具体名称

                if (val[0] === 'privateWorkType') {       //个人分类
                    val[1] = this.$store.state.ui.userInfo.cardUrl + '&&' + val[1]
                }
                this._getboardInfo(val)
            },
            onHide(type, refInstance) {
                if (type) {
                    this.titleB = refInstance.getNameValues().split(" ")[1];
                }
            },
            handleMenu(data) {
                if (data.url) this.$router.push(data.url);
                if (data.content === "新建任务集") {
                    this.$router.push({
                        name: "addMange", query: {
                            boardId: '',
                            routing: '',
                        }
                    });
                }
                if (data.content === "已归档任务集") {
                    let isfiled = true
                    this._getboardInfo('', isfiled)
                    this.taskManageTitle = '已归档任务集'
                    //不在这里改变状态
                    // this.isGuidang = false
                }
            },
            showSearch() {
                this.isShow = !this.isShow;
            },
            //搜索
            onCancel() {
                this.isShow = false;
            },
            task_search() {
                this.isShow = !this.isShow;
            },

            getResult(val) {
                console.log(val);
            },
            onSubmit(val) {
                console.log(val);
            },
            //跳转
            gotoList(taskUnit) {
                this.$router.push({
                    name: "taskList",
                    query: {
                        boardId: taskUnit.boardId,
                    }
                });
            },
            _getboardInfo(workType, isfiled) {
                let url = "/ZingMH/ZDesk/board/mater/loadBoardByUser.action";
                let params = {};
                if (isfiled) {
                    params = {
                        tag: "trello",
                        status: 2,  //已归档任务集
                        pageNumber: 1,
                        pageSize: 10
                    }
                } else {
                    params = {
                        tag: "trello",
                        pageNumber: 1,
                        pageSize: 10
                    }
                }
                if (!_.isUndefined(workType)) {
                    params[workType[0]] = workType[1]
                }
                this.$http
                    .get(url, {params: params})
                    .then(res => {
                        if (isfiled) {
                            this.isGuidang = true
                        } else {
                            this.isGuidang = false
                        }
                        this.taskUnits = res.data.data[0].data || [];
                        this.starUnits = [];
                        this.unStarUnits = [];
                        for (let k = 0; k < this.taskUnits.length; k++) {
                            //添加username属性
                            this.buildFileUrl.forEach((item, index) => {
                                let buildFileUrl = item
                                if (this.taskUnits[k].createCardUrl === buildFileUrl.cardUrl) {
                                    this.taskUnits[k].userName = buildFileUrl.userName
                                }
                            })

                            if (_.isEmpty(this.taskUnits[k].workType) || this.taskUnits[k].workType === 'tianjia1' || this.taskUnits[k].workType.substring(0, 16) === "zingIcon-zingJob") {
                                //图标若是空的默认为 xiaoshougendanguanli icon class 样式
                                this.taskUnits[k].workType = "xiaoshougendanguanli";
                            }
                        }
                        for (let i = 0; i < this.taskUnits.length; i++) {
                            let isStar = ''
                            if (this.taskUnits[i].isStar !== undefined) {
                                isStar = this.taskUnits[i].isStar.trim()
                            }
                            //置顶
                            if (
                                isStar !== "" && isStar.indexOf(this.cardUrl ) > -1
                            ) {
                                if (this.classfiy.workType === 'all') {
                                    this.starUnits.push(this.taskUnits[i]);
                                } else if (this.classfiy.workType === 'publicWorkType') {    //左上角全体分类
                                    if (this.classfiy.secondedWorkType === this.taskUnits[i].superWorkType) {
                                        this.starUnits.push(this.taskUnits[i]);
                                    }
                                } else if (this.classfiy.workType === 'privateWorkType') {   //左上角个人分类
                                    let arr = this.taskUnits[i].privateWorkType.split("&&")
                                    //arr[arr.length-1]取汉字
                                    if (this.classfiy.secondedWorkType === arr[arr.length - 1]) {
                                        this.starUnits.push(this.taskUnits[i]);
                                    }
                                } else {
                                    this.starUnits.push(this.taskUnits[i]);
                                }
                            }//非置顶
                            else {
                                if (this.classfiy.workType === 'all') {
                                    this.unStarUnits.push(this.taskUnits[i]);
                                } else if (this.classfiy.workType === 'publicWorkType') {
                                    if (this.classfiy.secondedWorkType === this.taskUnits[i].superWorkType) {
                                        this.unStarUnits.push(this.taskUnits[i]);
                                    }
                                } else if (this.classfiy.workType === 'privateWorkType') {
                                    let arr = this.taskUnits[i].privateWorkType.split("&&")
                                    if (this.classfiy.secondedWorkType === arr[arr.length - 1]) {
                                        this.unStarUnits.push(this.taskUnits[i]);
                                    }
                                } else {
                                    this.unStarUnits.push(this.taskUnits[i]);
                                }
                            }
                        }
                        //刷新scroll
                        this.$nextTick(() => {
                            this.$refs.scroll.refresh();
                        });
                    })
                    .catch(err => {
//                         this.$message({message: "请求失败", type: "error"});
                    });
            },
            //编辑（同添加）
            editMethod() {
                let taskUnit = this.currentTask;
                if (taskUnit.privateWorkType) {
                    this.$router.push({
                        name: "addMange",
                        query: {
                            boardId: taskUnit.boardId,
                            routing: taskUnit._routing,
                        }
                    });
                } else {
                    this.$router.push({
                        name: "addMange",
                        query: {
                            boardId: taskUnit.boardId,
                            taskName: taskUnit.title,
                            routing: taskUnit.routing,
                            selectWorkType: '',
                            privateWorkType: '',
                            superWorkType: taskUnit.superWorkType
                        }
                    });
                }
                this.showDialog = false;
            },
            editTop() {
                let that = this;
                this.showDialog = false;
                let bId = this.currentTask.boardId;
                let companyId = this.$store.state.ui.userInfo.companyId

                let param1 = {
                    boardId: bId,
                    routing: companyId,
                    property: "isstar"
                };
                let url1 = "/ZingMH/ZDesk/board/mater/updataEsBoard.action";
                that.$http.get(url1, {params: param1}).then(res => {
                        // that._getboardInfo();

                        setTimeout(() => {
                            that._getboardInfo();
                        }, 3000);

//                        this.statTop1 = setTimeout(() => {
//                            let url5 =
//                                "/ZingMH/ZDesk/board/mater/loadStarBoardByUser.action";
//                            let params5 = {tag: "trello"};
//                            that.$http.get(url5, {params: params5}).then(res => {
//                                that._getboardInfo();
//                            });
//                        }, 2000);
                }).catch(err => {
                    that.$vux.toast.show({text: "置顶失败"});
                    console.log(err)
                })
            },
            //归档
            editFile() {
                let that = this;
                this.showDialog = false;
                let bId = this.currentTask.boardId;
                let companyId = this.$store.state.ui.userInfo.companyId;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "确认归档该任务集吗",
                    onCancel() {
                    },
                    onConfirm() {
                        let param = {
                            boardId: bId,
                            companyId: companyId
                        };
                        let url = "/ZingMH/ZDesk/board/mater/archiveBoardById.action";
                        that.$http.get(url, {params: param}).then(res => {
                            if (res.data.success) {
                                that.$vux.toast.show({text: "归档成功", type: "success"});
                                setTimeout(function () {
                                    that._getboardInfo();
                                }, 2500);
                            } else {
                                that.$vux.toast.show({text: "归档失败"});
                            }
                        });
                    }
                });
            },
            //取消归档
            delatEditFile() {
                let that = this;
                this.showDialog = false;
                let bId = this.currentTask.boardId;
                let companyId = this.$store.state.ui.userInfo.companyId;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "确定取消归档吗",
                    onCancel(){
                    },
                    onConfirm() {
                        let param = {
                            boardId: bId,
                            companyId: companyId,
                            status: 1
                        };
                        let url = "/ZingMH/ZDesk/board/mater/archiveBoardById.action";
                        that.$http.get(url, {params: param}).then(res => {
                            if (res.data.success) {
                                that.$vux.toast.show({text: "取消归档成功", type: "success"});
//                          setTimeout(function() {
//                              that._getboardInfo();
//                          }, 2500);
                            } else {
                                that.$vux.toast.show({text: "取消归档失败"});
                            }
                        });
                    }
                });
            },
            edelDetle() {
                let that = this;
                this.showDialog = false;
                let bId = this.currentTask.boardId;
                let companyId = this.$store.state.ui.userInfo.companyId;
                this.$vux.confirm.show({
                    title: "提示",
                    content: "删除后该任务集无法被找回，确认删除吗",
                    onCancel() {
                    },
                    onConfirm() {
                        let param = {
                            boardId: bId,
                            companyId: companyId
                        };
                        let url = "/ZingMH/ZDesk/board/mater/deleteBoardById.action";
                        that.$http.get(url, {params: param})
                            .then(res => {
//                                that.$vux.toast.show({text: "删除成功", type: "success"});
//                                    setTimeout(function () {
//                                        that._getboardInfo();
//                                    }, 2500);
//                            });
                            if (res.data.success){
                                that.$vux.toast.show({text:"删除成功",type:"success"})
                                setTimeout(function () {
                                            that._getboardInfo();
                                        }, 2500)
                            } else {
                                that.$vux.toast.text("当前任务集存在未结束任务，不可删除")
                            }
                       });
                    }
                });
            },
            //分类选择
            classAbort() {
                this.showClassSetter = false;
            },
            editclazz(selected) {
                this.showClassSetter = true;
                this.showDialog = false;
            },
            //分类选择
            checkSelected(selected, taskUnits) {
                let bId = this.currentTask.boardId;
                let routing = this.$store.state.ui.userInfo.companyId;
                let url4 = "/ZingMH/ZDesk/board/mater/updataEsBoard.action";
                let params4 = {
                    boardId: bId,
                    routing: routing,
                    property: "nostar"
                };
                if (!_.isEmpty(selected.superWorkType)) {
                    params4.superWorkType = selected.superWorkType;

                    //更新superWorkType
                    for (let i in taskUnits) {
                        this.taskUnits[i].superWorkType = selected.superWorkType
                    }
                }
                //  ↓ 私有分类 需要拿到原来数据的 值 替换自己的cardUrl&&私有分类 append到老数据，更新
                if (!_.isEmpty(selected.privateWorkType)) {
                    params4.privateWorkType =
                        this.$store.state.ui.userInfo.cardUrl +
                        "&&" +
                        selected.privateWorkType;
                    //更新privateWorkType
                    for (let i in taskUnits) {
                        let arr = this.taskUnits[i].privateWorkType.split("&&")
                        arr[arr.length - 1] = selected.privateWorkType
                    }
                }
                if (
                    _.isEmpty(selected.superWorkType) ||
                    !_.isEmpty(selected.privateWorkType)
                ) {
                    this.$http
                        .get(url4, {params: params4})
                        .then(res => {
                            this.$vux.toast.show({text: "分类成功", type: "success"});
                            this.showClassSetter = false;
                            this._getboardInfo()
                        })
                        .catch(err => {
                            this.$vux.toast.show({text: "分类失败", type: "false"});
                        });
                } else {
                    this.$message({message: "请选择分类", type: "error"});
                }
            },
            //点击点点
            gotoUpdateDelPage(taskUnit, item) {
                    this.currentTask = taskUnit;
                    this.item = item;
                    this.cancelTop = false    //显示取消置顶字样
                    this.Top = true
                    if (this.currentTask.isStar.trim() !== "" &&
                        this.currentTask.isStar.trim().indexOf(this.cardUrl ) > -1) {
                          this.cancelTop = true   //显示取消置顶字样
                          this.Top = false        //隐藏置顶字样
                    }
                    this.showDialog = true;
                    if (this.currentTask.createCardUrl === this.cardUrl) {
                          this.isCreaturl = true
                    } else if (this.currentTask.createCardUrl !== this.cardUrl) {
                          this.isCreaturl = false
                    }
            }
        }
   };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';
.page-content
  height: 100%;
  .taskManageActivityAitema
    height: calc(100% -50px);
    margin-right 0 !important
    .taskManageGridCard
        width 100%
        display flex
        display:-webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        height 60px
        .grid-card
            width 100%
        .taskManageGridCardLeft
            overflow: hidden;
            margin-left 5px
            .leftImg
                position relative
                float left;
                height: 50px;
                width: 50px;
                background-color: rgb(65, 177, 255);
                background-size: 800px 50px;
                background-position: -550px 0
                .taskManageBadge
                   position absolute
                   top 0
                   right 0
            .taskManageCardtext
                float: left !important
                .personne2
                    margin-top 10px
                .personne1
                    margin-top 5px !important
                .personnel,.personne2
                    display: block;
                    height 17px
                    width: 180px;
                    word-break: keep-all;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-left: 20px
        .taskManageGridCardRight
            margin-bottom 15px
            overflow height
            .taskManageIcon
               float right
            i
              font-size 30px
    .nav-text
       text-align: center
       color: #ff8000
       width 100%
       margin-top: 15px
    .scroll-content
       margin-top -5px
  .weui-dialog
    .edit
      height 25px;
      text-align center;
      margin-top 15px;
      border-bottom 1px solid rgba(58, 77, 118, 0.4);
</style>



