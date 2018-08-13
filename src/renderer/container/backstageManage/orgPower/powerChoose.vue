<template>
  <div class="powerChoose">
    <zing-head :title="'权限选择'" class="vue-head"></zing-head>
    <!--<div class="vue-tab">
        <tab class="" :line-width="3">
            <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab"
                      @click="defTab = item" :key="index">{{item}}
            </tab-item>
        </tab>
    </div>

    <div class="tab-content">
        <div class="tabDiv" v-show="orgEditShow" :style="{ height: screenHeight + 'px'}">
            <div v-if="baseDataInfo && baseDataInfo.length > 0">
                <GridCard v-for="(data, index) in baseDataInfo" :key="index">
                    <div slot="cardLeft" class="left">
                        <check-icon :value.sync="data.isCheck"> {{ data.userName }}</check-icon>
                    </div>
                </GridCard>
            </div>
        </div>
        <div class="tabDiv" v-show="companyUserSettingShow" :style="{ height: screenHeight + 'px'}">
            <div v-if="menuDataInfo && menuDataInfo.length > 0">
                <GridCard v-for="(data, index) in menuDataInfo" :key="index">
                    <div slot="cardLeft" class="left">
                        <check-icon :value.sync="data.isCheck"> {{ data.userName }}</check-icon>
                    </div>
                </GridCard>
            </div>
        </div>
        <div class="tabDiv" v-show="quitEmployeeShow" :style="{ height: screenHeight + 'px'}">
            <div v-if="agentDataInfo && agentDataInfo.length > 0">
                <GridCard v-for="(data, index) in agentDataInfo" :key="index">
                    <div slot="cardLeft" class="left">
                        <check-icon :value.sync="data.isCheck"> {{ data.userName }}</check-icon>
                    </div>
                </GridCard>
            </div>
        </div>
    </div>-->
    <div class="content">
      <zi-tree
        class="user-setting-content"
        ref="powerChooseTree"
        :props="defaultProps"
        :data="treeData"
        @select="select"
        @check="checked"
        :pc="trueType"
        :checkable="trueType"
        :multiple="trueType"
        :deleteBtn="falseType"
        :show-line="falseType"
        :moreBtn="falseType"
        :defaultExpandAll="trueType"
        editBtn
        addBtn
      />
    </div>
    <x-button class="btn-choose" :style="{backgroundColor: '#ff8000',color: '#fff'}" @click.native="choose">选择
    </x-button>
  </div>
</template>

<script>
  import {Tab, TabItem, CheckIcon, XButton} from 'vux';
  import ZingHead from "@/components/zingHead/ZingHead";
  import GridCard from "@/components/gridcard/GridCard";
  import ZiTree from '@/components/zitree/ZiTree';
  import {mapActions} from "vuex";

  export default {
    name: "powerChoose",
    components: {
      ZiTree,
      Tab,
      TabItem,
      GridCard,
      CheckIcon,
      XButton,
      ZingHead,
    },
    directives: {
      //自定义标签属性
    },
    data() {
      return {
        screenHeight: "0px",
        roleArr: [],

        falseType: false,
        trueType: true,
        defaultProps: {
          title: "resInfoName",
          children: "children",
        },
        treeData: [
          {
            "_routing": "",
            "resInfoDesc": "全部选择",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525749329732",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "全部选择",
            "resInfoVal": "allType",
            "_id": "1525749329732",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "考勤模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686168836",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "考勤",
            "resInfoVal": "attendanceType",
            "_id": "1525686168836",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "考勤设置",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24889138100001",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-05-13 01:38:58",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "考勤设置",
                "resInfoVal": "40-70",
                "_id": "24889138100001",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "考勤统计",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24888998100001",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-05-13 01:36:38",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "考勤统计",
                "resInfoVal": "40-50",
                "_id": "24888998100001",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "外勤审核",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24274339100201",
                "resInfoLink": "",
                "resInfoTerminalType": "mobile",
                "genTime": "2016-05-09 16:00:04",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "外勤审核",
                "resInfoVal": "40-80",
                "_id": "24274339100201",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "请假统计权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686239353",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "请假统计",
                "resInfoVal": "leaveCountPower",
                "_id": "1525686239353",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "人力资源",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2016-05-05 22:37:29",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "人力资源",
            "resInfoVal": "",
            "_id": "",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "档案管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686275136",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "档案管理",
                "resInfoVal": "fileManagementPower",
                "_id": "1525686275136",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "待交接工作",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24889086100001",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-05-13 01:38:06",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "待交接工作",
                "resInfoVal": "40-60",
                "_id": "24889086100001",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "薪酬设置权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686289180",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "薪酬设置",
                "resInfoVal": "paySettingPower",
                "_id": "1525686289180",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "部门薪酬查询权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686304856",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "部门薪酬查询",
                "resInfoVal": "departmentPayQueryPower",
                "_id": "1525686304856",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "当前角色是否具备客服功能",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "24094656100001",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2016-05-03 20:58:59",
            "resInfoType": "agentConf",
            "resInfoIcon": "",
            "resInfoName": "客服功能",
            "resInfoVal": "isAgent",
            "_id": "24094656100001",
            "resInfoSubVal": "ms-duplex-checked=isAgent",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "语音客服权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686317233",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "语音客服",
                "resInfoVal": "voiceServicePower",
                "_id": "1525686317233",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "文本客服权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686327472",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "文本客服",
                "resInfoVal": "textCustomerServicePower",
                "_id": "1525686327472",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "通讯录模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686339257",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "通讯录",
            "resInfoVal": "mailListType",
            "_id": "1525686339257",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "外联人管理员权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "54563785100001",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2017-04-21 12:36:25",
                "resInfoType": "baseConf",
                "resInfoIcon": "",
                "resInfoName": "外联人管理员",
                "resInfoVal": "externalContactsAdmin",
                "_id": "54563785100001",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "英客管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686350159",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "英客管理",
                "resInfoVal": "customerManagePower",
                "_id": "1525686350159",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "财务相关管理权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "24274339103221",
            "resInfoLink": "",
            "resInfoTerminalType": "both",
            "genTime": "2016-12-01 12:44:40",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "财务管理",
            "resInfoVal": "53-02",
            "_id": "24274339103221",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "科目设置权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686361381",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "科目设置",
                "resInfoVal": "subjectSettingPower",
                "_id": "1525686361381",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "凭证快速审批权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686378358",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "凭证快速审批",
                "resInfoVal": "voucherFastApprovalPower",
                "_id": "1525686378358",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "财务库管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686390456",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "财务库管理",
                "resInfoVal": "financeTreasuryManagePower",
                "_id": "1525686390456",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "进销存模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686420127",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "进销存",
            "resInfoVal": "imporAndExportType",
            "_id": "1525686420127",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "采购相关管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "26274339103222",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-12-01 12:44:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "采购管理",
                "resInfoVal": "53-03",
                "_id": "26274339103222",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "销售相关管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "26274339103223",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-12-01 12:44:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "销售管理",
                "resInfoVal": "53-04",
                "_id": "26274339103223",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "仓库相关管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "26274339103224",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-12-01 12:44:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "仓库管理",
                "resInfoVal": "53-05",
                "_id": "26274339103224",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "任务管理权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686429621",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "任务管理",
            "resInfoVal": "taskManagePower",
            "_id": "1525686429621",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "项目管理权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686440308",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "项目管理",
            "resInfoVal": "projectManagePower",
            "_id": "1525686440308",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "审批模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686450852",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "审批",
            "resInfoVal": "approvalType",
            "_id": "1525686450852",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "审批模板管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686544947",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "审批模板管理",
                "resInfoVal": "approvalTemplateManagePower",
                "_id": "1525686544947",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "审批模板授权权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686645264",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "审批模板授权",
                "resInfoVal": "approvalTemplateAuthorizationPower",
                "_id": "1525686645264",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "查看工作流情况",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24274178100001",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-05-05 22:49:38",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "查询审批流",
                "resInfoVal": "20-40",
                "_id": "24274178100001",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "编辑公告权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "24273449100101",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2016-11-04 17:23:00",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "公告编辑",
            "resInfoVal": "80-10",
            "_id": "24273449100101",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "欢迎公告编辑权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686677510",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "欢迎公告编辑",
                "resInfoVal": "welcomeNoticeEditorPower",
                "_id": "1525686677510",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "全体公告编辑权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686687777",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "全体公告编辑",
                "resInfoVal": "allNoticeEditorTypePower",
                "_id": "1525686687777",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "自定义公告编辑权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686697643",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "自定义公告编辑",
                "resInfoVal": "customNoticeEditorTypePower",
                "_id": "1525686697643",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "网站编辑功能权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "24094584100001",
            "resInfoLink": "",
            "resInfoTerminalType": "both",
            "genTime": "2016-05-03 20:56:24",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "网站编辑",
            "resInfoVal": "00-10",
            "_id": "24094584100001",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "文件柜管理员权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "29644543100001",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2016-07-07 02:35:43",
            "resInfoType": "baseConf",
            "resInfoIcon": "",
            "resInfoName": "文件柜管理员",
            "resInfoVal": "fileManageAdmin",
            "_id": "29644543100001",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "文档协作管理权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686710372",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "文档协作管理",
            "resInfoVal": "fileCooperationManagePower",
            "_id": "1525686710372",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "报表模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686720448",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "报表",
            "resInfoVal": "reportFormType",
            "_id": "1525686720448",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "报表设置权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686838445",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "报表设置",
                "resInfoVal": "reportFormSettingPower",
                "_id": "1525686838445",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "报表查询权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686849262",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "报表查询",
                "resInfoVal": "reportFormQueryPower",
                "_id": "1525686849262",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "具备管理商号的功能",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "25155486100001",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2016-05-16 03:38:06",
            "resInfoType": "baseConf",
            "resInfoIcon": "",
            "resInfoName": "商号管理",
            "resInfoVal": "serviceNumber",
            "_id": "25155486100001",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "组织管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686894448",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "组织管理",
                "resInfoVal": "organizationManagePower",
                "_id": "1525686894448",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "商号编辑权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686904862",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "商号编辑",
                "resInfoVal": "businessEditorPower",
                "_id": "1525686904862",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "同组商号权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "24274339171109",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2017-11-09 16:26:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "同组商号",
                "resInfoVal": "17-01",
                "_id": "24274339171109",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "管理其他应用权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1525686917769",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "管理其他应用",
                "resInfoVal": "managingOtherApplicationsPower",
                "_id": "1525686917769",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "商城管理权限",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686929167",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "menuConf",
            "resInfoIcon": "",
            "resInfoName": "商城管理",
            "resInfoVal": "shoppingMallManagePower",
            "_id": "1525686929167",
            "resInfoSubVal": ""
          },
          {
            "_routing": "",
            "resInfoDesc": "餐饮管理模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1525686954834",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "餐饮管理",
            "resInfoVal": "restaurantManageType",
            "_id": "1525686954834",
            "resInfoSubVal": "",
            children: [
              /*{
                  "_routing": "",
                  "resInfoDesc": "退菜功能权限",
                  "es_score": "1.0",
                  "resInfoSubType": "",
                  "resInfoId": "1525686968103",
                  "resInfoLink": "",
                  "resInfoTerminalType": "",
                  "genTime": "2018-05-07 13:00:00",
                  "resInfoType": "",
                  "resInfoIcon": "",
                  "resInfoName": "退菜功能",
                  "resInfoVal": "retireFunctionPower",
                  "_id": "1525686968103",
                  "resInfoSubVal": ""
              },
              {
                  "_routing": "",
                  "resInfoDesc": "结账功能权限",
                  "es_score": "1.0",
                  "resInfoSubType": "",
                  "resInfoId": "1525686977009",
                  "resInfoLink": "",
                  "resInfoTerminalType": "",
                  "genTime": "2018-05-07 13:00:00",
                  "resInfoType": "",
                  "resInfoIcon": "",
                  "resInfoName": "结账功能",
                  "resInfoVal": "checkOutFunctionPower",
                  "_id": "1525686977009",
                  "resInfoSubVal": ""
              },*/
              {
                "_routing": "",
                "resInfoDesc": "退菜相关管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "26274339103229",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-12-01 12:44:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "餐饮退菜管理",
                "resInfoVal": "13-11",
                "_id": "26274339103229",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "结账相关管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "26274339103228",
                "resInfoLink": "",
                "resInfoTerminalType": "both",
                "genTime": "2016-12-01 12:44:40",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "餐饮结账管理",
                "resInfoVal": "13-10",
                "_id": "26274339103228",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "打卡结班功能权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528961631889",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "打卡结班功能",
                "resInfoVal": "knottingClassFunctionPower",
                "_id": "1528961631889",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "换台功能权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528962075304",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "换台功能",
                "resInfoVal": "changeTableFcunctionPower",
                "_id": "1528962075304",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "清台功能权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528962088025",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "清台功能",
                "resInfoVal": "cleanTableFunctionPower",
                "_id": "1528962088025",
                "resInfoSubVal": ""
              },
            ]
          },
          // {
          //     "_routing": "",
          //     "resInfoDesc": "酒店管理权限",
          //     "es_score": "1.0",
          //     "resInfoSubType": "",
          //     "resInfoId": "1525686987451",
          //     "resInfoLink": "",
          //     "resInfoTerminalType": "",
          //     "genTime": "2018-05-07 13:00:00",
          //     "resInfoType": "menuConf",
          //     "resInfoIcon": "",
          //     "resInfoName": "酒店管理",
          //     "resInfoVal": "hotelManagePower",
          //     "_id": "1525686987451",
          //     "resInfoSubVal": ""
          // },
          {
            "_routing": "",
            "resInfoDesc": "点菜模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1529841187159",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "点菜",
            "resInfoVal": "orderType",
            "_id": "1529841187159",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "点菜管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1526370984750",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "点菜管理",
                "resInfoVal": "orderManagePower",
                "_id": "1526370984750",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "点菜及账单权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841205515",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "点菜及账单",
                "resInfoVal": "orderAndBillPower",
                "_id": "1529841205515",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "菜品管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841216570",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "菜品管理",
                "resInfoVal": "foodManagePower",
                "_id": "1529841216570",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "打印机管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841247792",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "打印机管理",
                "resInfoVal": "printerManagePower",
                "_id": "1529841247792",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "标签设置权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841258125",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "标签设置",
                "resInfoVal": "labelSettingPower",
                "_id": "1529841258125",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "桌位管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841267002",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "桌位管理",
                "resInfoVal": "tableManagePower",
                "_id": "1529841267002",
                "resInfoSubVal": ""
              }, {
                "_routing": "",
                "resInfoDesc": "分类管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1529841274983",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "分类管理",
                "resInfoVal": "classifyManagePower",
                "_id": "1529841274983",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "酒店模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1529841285750",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "订房管理",
            "resInfoVal": "hotelType",
            "_id": "1529841285750",
            "resInfoSubVal": "",
            "children": [

              {
                "_routing": "",
                "resInfoDesc": "预定管理",//酒店预定|房态图:制卡|备注|预定按钮
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120405",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-06-29 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "预定管理",
                "resInfoVal": "hotelReservationManagePower",
                "_id": "1528176120405",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "入住管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120406",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-06-29 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "入住管理",
                "resInfoVal": "hotelCheckInManagePower",
                "_id": "1528176120406",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "宾客管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120407",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-06-29 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "宾客管理",
                "resInfoVal": "hotelGuestManagePower",
                "_id": "1528176120407",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "账单管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120408",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "账单管理",
                "resInfoVal": "hotelBillManagePower",
                "_id": "1528176120408",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "实时状态管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120409",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "实时状态管理",
                "resInfoVal": "hotelStatusManagePower",
                "_id": "1528176120409",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "客房配置管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120410",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "客房配置管理",
                "resInfoVal": "hotelRoomSettingManagePower",
                "_id": "1528176120410",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "前台管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120411",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "前台管理",
                "resInfoVal": "hotelReceptionManagePower",
                "_id": "1528176120411",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "协议单位管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120412",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "酒店协议单位管理",
                "resInfoVal": "hotelBargainingUnitManagePower",
                "_id": "1528176120412",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "系统信息配置管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120413",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "系统信息配置管理",
                "resInfoVal": "hotelSystemSettingManagePower",
                "_id": "1528176120413",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "报表管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120414",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "酒店报表管理",
                "resInfoVal": "hotelReportManagePower",
                "_id": "1528176120414",
                "resInfoSubVal": ""
              },
              {
                "_routing": "",
                "resInfoDesc": "房态管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120415",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "房态管理",
                "resInfoVal": "hotelRoomStatusManagePower",
                "_id": "1528176120415",
                "resInfoSubVal": ""
              },
              // {
              //     "_routing": "",
              //     "resInfoDesc": "手机订房管理",
              //     "es_score": "1.0",
              //     "resInfoSubType": "",
              //     "resInfoId": "1528176120416",
              //     "resInfoLink": "",
              //     "resInfoTerminalType": "",
              //     "genTime": "2018-05-07 13:00:00",
              //     "resInfoType": "menuConf",
              //     "resInfoIcon": "",
              //     "resInfoName": "手机订房管理",
              //     "resInfoVal": "hotelMobileManagePower",
              //     "_id": "1528176120416",
              //     "resInfoSubVal": ""
              // },
              {
                "_routing": "",
                "resInfoDesc": "交易费用配置管理",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176120417",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "交易费用配置管理",
                "resInfoVal": "hotelDealSettingManagePower",
                "_id": "1528176120417",
                "resInfoSubVal": ""
              },
            ]
          },
          {
            "_routing": "",
            "resInfoDesc": "发现模块",
            "es_score": "1.0",
            "resInfoSubType": "",
            "resInfoId": "1528175835781",
            "resInfoLink": "",
            "resInfoTerminalType": "",
            "genTime": "2018-05-07 13:00:00",
            "resInfoType": "",
            "resInfoIcon": "",
            "resInfoName": "发现",
            "resInfoVal": "discoveryType",
            "_id": "1528175835781",
            "resInfoSubVal": "",
            children: [
              {
                "_routing": "",
                "resInfoDesc": "发现管理权限",
                "es_score": "1.0",
                "resInfoSubType": "",
                "resInfoId": "1528176035194",
                "resInfoLink": "",
                "resInfoTerminalType": "",
                "genTime": "2018-05-07 13:00:00",
                "resInfoType": "menuConf",
                "resInfoIcon": "",
                "resInfoName": "发现管理",
                "resInfoVal": "discoveryManagePower",
                "_id": "1528176035194",
                "resInfoSubVal": ""
              }
            ]
          },
        ]
      }
    },
    computed: {
      roleInfoId() {
        return this.$route.query.roleInfoId || ''
      },
      roleInfoName() {
        return this.$route.query.roleInfoName || ''
      }
    },
    watch: {
      $route() {
        this.initData();
      }
    },
    //钩子加载完触发
    created() {
      let that = this
      /*this.screenHeight = document.documentElement.clientHeight - 188;*/
      this.initData();
    },
    methods: {
      ...mapActions(["loadRedPoint", "loadPowerList"]),
      initData() {
        let that = this;
        let url = '/zingbiz/auth/role/loadRoleRes';
        let params = {
          roleInfoId: this.roleInfoId
        };
        console.log(params);
        this.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              let loadRole = res.data.data.roleResList;
              /*selectAry = loadRole.map(item => item.resInfoId)*/
              console.log(loadRole);
              loadRole.forEach(item => {
                let delId = item.resInfoId;
                let targets = null;
                that.$nextTick(() => {
                  targets = that.$refs.powerChooseTree.getNodeById('_id', delId)
                  targets.forEach(target => {
                    /*that.$set(target, "selected", true);*/
                    that.$set(target, "checked", true);
                  });
                })
              });
            } else {
              /*this.$vux.toast.show({
                  text: '调部门失败',
                  type: 'text',
                  position: 'bottom'
              })*/
            }
          })
          .catch(err => {
            console.error(err);
          });
      },

      select(data) {
        console.log("select............");
        console.log(data);
        let selected = data.node.source;
        /*this.orgMemberCardUrl = selected.cardUrl
        this.showOrgMemberDetail = true*/
      },
      checked(data) {
        console.log("checked............");
        console.log(data);
        let that = this;
        if (data.currentNode.resInfoName === "全部选择" && data.currentNode.checked === true) {
          console.log("111............");
          that.treeData.forEach(item => {
            let delId = item.resInfoId;
            let targets = null;
            if (typeof (item.children) !== "undefined") {
              item.children.forEach(item => {
                let delId2 = item.resInfoId;
                targets = that.$refs.powerChooseTree.getNodeById('_id', delId2)
                targets.forEach(target => {
                  that.$set(target, "checked", true);
                });
              });
            } else {
              targets = that.$refs.powerChooseTree.getNodeById('_id', delId)
              targets.forEach(target => {
                that.$set(target, "checked", true);
              });
            }
          });
        } else if (data.currentNode.resInfoName === "全部选择" && data.currentNode.checked === false) {
          that.treeData.forEach(item => {
            let delId = item.resInfoId;
            let targets = null;
            if (typeof (item.children) !== "undefined") {
              item.children.forEach(item => {
                let delId2 = item.resInfoId;
                targets = that.$refs.powerChooseTree.getNodeById('_id', delId2)
                targets.forEach(target => {
                  console.log("1............1");
                  /*that.$set(target, "selected", true);*/
                  that.$set(target, "checked", false);
                  /*that.$set(target, "childrenCheckedStatus", 2);*/
                });
              });
            } else {
              targets = that.$refs.powerChooseTree.getNodeById('_id', delId)
              targets.forEach(target => {
                that.$set(target, "checked", false);
              });
            }
          });
        }
      },
      choose() {
        this.roleArr = this.$refs.powerChooseTree.getCheckedNodes()
        console.log(this.roleArr);
        if (this.roleArr.length > 0) {
          let url = '/zingbiz/auth/role/editRoleRes';
          let params = {
            roleInfoId: this.roleInfoId,
            roleInfoName: this.roleInfoName,
            roleArr: this.roleArr
          };
          console.log(params);
          this.$http.post(url, params).then(res => {
            console.log(res);
            if (res.data.retcode === 0) {
              /*this.$router.go(-1)*/
              this.$router.push({
                path: "/backstageManage/orgPower",
                query: {
                  tab: 1,
                }
              });
              /*setTimeout(() => {
                  this.loadPowerList();
              },2000)*/
            }
          })
        }
      },
    }
  }
</script>
<style lang="stylus">
  .zi-tree li span.zi-tree-switcher.zi-tree-switcher_close {
    margin-right: 17px;
  }

  .zi-tree li span.zi-tree-switcher.zi-tree-switcher_open {
    margin-right: 17px;
  }
</style>
<style lang="stylus" scoped>
  @import '../../../assets/stylus/variable.styl';

  .powerChoose
    display flex
    flex-direction column
    width 100%
    height 100%

    .vue-head
    .btn-choose
      flex-shrink 0
    .content
      flex-grow 1
      overflow-y auto
</style>
