<template>
  <div>
    <group label-width="4.5em">
      <x-input title="编号" v-model="voucherInfo.pzId" :show-clear="false" :disabled="true" placeholder="" class="fontColor"></x-input>
      <x-input title="凭证名称" :disabled="isCommit" v-model="voucherInfo.voucherName" :show-clear="false" placeholder="请输入凭证名称" class="fontColor"></x-input>
      <x-input title="操作日期" :disabled="true" v-model="voucherInfo.inOrOutTime" :show-clear="false" placeholder="" class="fontColor"></x-input>
    </group>
    <div v-for="(item, index) in voucherInfoItems" :key="index">
      <group label-width="5em">
        <div slot="title" style="height: 32px;padding-top:2px">
          <i v-if="voucherInfoItems.length > 1 && !isCommit" class="iconfont icon-shanchu2" v-on:click="delEntry(index)" style="float: right;font-size: 30px;"></i>
        </div>
        <image-picker :files="item.imageListYW ? item.imageListYW : []" :companyId="voucherInfo.companyId" selectable multiple @onChange="fliesChange(arguments,index)" @onImageClick="onImageClick" />
        <selector title="单据类型" placeholder="请选择单据类型" :readonly="isCommit" @on-change="choseDJLX(item.docType,index)" v-model="item.docType" :options="docTypeList"></selector>
        <x-input title="财务库&nbsp;<span style='color: red;'>*</span>" :show-clear="false" v-model="item.ckName" :disabled="true" @click.native="openWareHoseList(index)" placeholder="请选择财务库" class="fontColor"></x-input>
        <x-input title="业务描述" :show-clear="false" placeholder="请选择业务描述" :disabled="true" v-model="item.pzServiceDesc" @click.native="selectPickedDialog(index)" class="fontColor"></x-input>
        <x-input @on-change="calculateAccount(index)" title="科目代码&nbsp;<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="item.projectId" :disabled="true" @click.native="selectPickedDialog(index)" class="fontColor"></x-input>
        <x-input title="科目名称&nbsp;<span style='color: red;'>*</span>" placeholder="请选择科目名称" :show-clear="false" v-model="item.projectName" :disabled="true" @click.native="selectPickedDialog(index)" class="fontColor"></x-input>
        <x-input :disabled="isCommit" @on-change="calculateAccount(index)" title="原币金额&nbsp;<span style='color: red;'>*</span>" :show-clear="false" placeholder="0.00" v-model="item.pzOriginalAccount" class="fontColor"></x-input>
        <x-input disabled title="本币金额&nbsp;<span style='color: red;'>*</span>" :show-clear="false" placeholder="根据原币金额自动计算" v-model="item.pzAccount" class="fontColor"></x-input>
        <x-textarea :disabled="isCommit" title="摘要&nbsp;<span style='color: red;'>*</span>" :max="2000" placeholder="" v-model="item.pzSummary" class="fontColor"></x-textarea>
      </group>
      <group class="vux-1px-b">
        <div style="float:left;line-height:49px;margin-left:13px;width: 4.5em;">借贷方向</div>
        <checker v-model="item.examineAspect" radio-required="true" type="radio" style="float:right;margin:7px 0px;" default-item-class="examineAspectItem" selected-item-class="examineAspectItem-selected">
          <!--
          <checker-item :disabled="isCommit && item.examineAspect!=='借'" value="借">借</checker-item>
          <checker-item :disabled="isCommit && item.examineAspect!=='贷'" value="贷">贷</checker-item>
           -->
          <checker-item value="借">借</checker-item>
          <checker-item value="贷">贷</checker-item>
        </checker>
      </group>
    </div>
    <!-- 科目 -->
    <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>

    <group style="margin-top:20px;">
      <flexbox>
        <flexbox-item v-if="!isCommit">
          <x-button style="color:#ff8000" @click.native="addEntry">新增明细</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-input title="￥" v-model="pzFirstMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </flexbox-item>
      </flexbox>
    </group>

    <group style="margin:20px 0px;background-color:#fff" v-if="taskData.length > 0 || !isCommit">
      <group-title slot="title" style="height: 44px;line-height:44px;">
        <span style="font-size:17px;color:#40AFFC">任务核算</span>
        <x-button mini plain style="float: right;margin-top: 7px;color:#FF8000;border:1px solid #FF8000;" v-show="!isCommit" @click.native="addRenwu">添加</x-button>
      </group-title>
      <div v-for="(item,index) in taskData" :key="index">
        <flexbox>
          <flexbox-item @click.native="taskShow(index)">
            <div style="padding-left: 15px;">{{item.cardName}}</div>
          </flexbox-item>
          <flexbox-item>
            <x-input type="text" :disabled="isCommit" :show-clear="false" v-model="item.taskPrice" placeholder="0.00"></x-input>
          </flexbox-item>
          <i v-if="!isCommit" class="iconfont icon-shanchu" style="color: red;font-size: 25px;" @click="delRenwu(index)"></i>
        </flexbox>
        <div style="height: 10px;width: 100%;background: #fbf9fe"></div>
      </div>
    </group>

    <group>
      <flexbox :gutter="0" v-show="voucherInfo.pzStatus !== 'DSH' && voucherInfo.pzStatus !== 'YHZ' && !isQuote">
        <flexbox-item v-show="voucherInfo.pzStatus === 'WTJ' || voucherInfo.pzStatus ==='DSH'">
          <x-button class="btn-save" type="primary" @click.native="savePZ('SAVE')">保存</x-button>
        </flexbox-item>
        <flexbox-item v-show="voucherInfo.pzStatus === 'YSH'">
          <x-button class="btn-save" type="primary" @click.native="voucherPost(true)">过账</x-button>
        </flexbox-item>
        <flexbox-item v-show="voucherInfo.pzStatus === 'YGZ'">
          <x-button class="btn-common" type="warn" @click.native="voucherPost(false)">反过账</x-button>
        </flexbox-item>
        <flexbox-item v-show="voucherInfo.pzStatus !== 'YGZ' && voucherInfo.pzStatus !== 'YJZ'">
          <x-button class="btn-common" type="warn" @click.native="savePZ('SUBMIT')">{{pzStatusText}}</x-button>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" v-show="voucherInfo.pzStatus === 'DSH'">
        <flexbox-item>
          <x-button class="btn-common" type="warn" @click.native="updateDate">保存</x-button>
        </flexbox-item>
      </flexbox>
    </group>

    <!-- 弹框模板 -->
    <task-selection :showTaskSelection="financialRenwuShow" @confirmTaskSelection="getDialogData" @cancleTaskSelection="goBackShow"></task-selection>

    <popup v-model="showWarehoseList" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <warehouse-list :isReferenced="true" @financeItemClick="financeItemClick" :isComeBack="false" @warehoseListBack="warehoseListBack"></warehouse-list>
    </popup>

    <popup should-rerender-on-show="true" v-model="showTaskDetail" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <task-detail ref="taskDetailRef" :loadingSelf="true" :transboardId="voucherInfo.companyId" :transListId="currentListId" :transCardId="currentCardId" :transRouting="currentRouting" :defaultBack="false" @taskDetailBack="taskDetailBack"></task-detail>
    </popup>
  </div>
</template>


<script>
import TaskSelection from "../../common/task/taskSelection";
import ZingHead from "@/components/zingHead/ZingHead";
import SubjectPicker from "components/subjectpicker/SubjectPicker";
import ImagePicker from "components/imagepicker/ImagePicker";
import WarehouseList from "./warehouseList";
import TaskDetail from "@/container/taskManage/taskDetail";
import { Z_IsEmpty20 } from "@/utils/fn";
import {
  XTextarea,
  XInput,
  Group,
  XButton,
  Popup,
  Cell,
  Flexbox,
  FlexboxItem,
  Selector,
  XSwitch,
  GroupTitle,
  Checker,
  CheckerItem
} from "vux";

export default {
  name: "financialVocational",
  components: {
    XInput,
    Group,
    XButton,
    Popup,
    Cell,
    XTextarea,
    Flexbox,
    FlexboxItem,
    Selector,
    XSwitch,
    GroupTitle,
    TaskSelection,
    ZingHead,
    ImagePicker,
    SubjectPicker,
    WarehouseList,
    Checker,
    CheckerItem,
    TaskDetail
  },
  props: {
    voucherInfoParam: { type: "Object" },
    code2Suject: {
      type: "Object",
      default: {}
    },
    voucherInfoInPzItemsParam: { type: "Object" },
    isQuote: {
      type: "Boolean",
      default: false
    }
  },
  data() {
    return {
      showWarehoseList: false,
      showTaskDetail: false,
      currentBoardId: "",
      currentListId: "",
      currentCardId: "",
      boradIdArr: [],
      cardIdArr: [],
      listIdListArr: [],
      ckId: "",
      ckName: "",
      pzStatusText: "提交审核",
      financialRenwuShow: false, //控制弹框的隐藏显示
      showPicker: false, //控制显示科目代码
      clickKMIndex: 0, //点击的条目下标
      docTypeList: [
        //单据类型数组
        { key: "CLBXD", value: "差旅报销单" },
        { key: "ZCPZ", value: "支出凭证" },
        { key: "FYBX", value: "费用报销" },
        { key: "QT", value: "其它" }
      ],
      voucherInfo: {
        pzId: "",
        voucherName: "",
        pzType: "inPz",
        withTrello: "true",
        pzStatus: "WTJ",
        voucherType: "CW",
        dataType: "CW"
      }, //凭证数据
      voucherInfoItems: [
        {
          rowId: "",
          pzCount: "",
          docType: "CLBXD", //单据类型
          imageListYW: [], //图片列表,pzImgs
          pzImgs: "",
          pzAccount: "", //总金额
          examineAspect: "借",
          pzPrice: "",
          pzSummary: "", //摘要
          pzType: "inPz",
          dataType: "CW"
        }
      ],
      isNeedTask: false,
      taskData: [] //任务列表
    };
  },
  computed: {
    isCommit() {
      return this.voucherInfo.pzStatus !== "WTJ";
    },
    pzFirstMoney: {
      //pzFirstMoney为业务方总金额
      get: function() {
        let sum = 0;
        this.voucherInfoItems.forEach(function(item) {
          sum = (parseFloat(sum) + parseFloat(item.pzAccount)).toFixed(2);
        });
        return isNaN(sum) ? 0 : sum;
      },
      set: function() {}
    }
  },
  watch: {
    voucherInfoParam(val, oldVal) {
      let rowId = this.$route.query.pzRowId;
      let pzId = this.voucherInfo.pzId;
      let voucherName = this.voucherInfo.voucherName
        ? this.voucherInfo.voucherName
        : "";
      val.voucherName = val.voucherName ? val.voucherName : "";
      this.voucherInfo = val;
      if ((typeof rowId !== "string" || rowId.length === 0) && !this.isQuote) {
        this.voucherInfo.pzId = pzId;
        this.voucherInfo.voucherName = voucherName;
        delete this.voucherInfo.rowId;
      }
      if (this.voucherInfo) {
        if (this.voucherInfo.pzStatus === "DSH") {
          this.pzStatusText = "提交审核";
        } else if (this.voucherInfo.pzStatus === "YSH") {
          this.pzStatusText = "反审核";
        }
        if (
          typeof this.voucherInfo.pzCardIdSpace === "string" &&
          this.voucherInfo.pzCardIdSpace.trim().length > 0
        ) {
          this.cardIdArr = this.voucherInfo.pzCardIdSpace.split(" ");
          this.listIdListArr = this.voucherInfo.pzListIdSpace.split(" ");
          this.boradIdArr = this.voucherInfo.pzBoradIdSpace.split(" ");
          this.taskData = [];
          this.voucherInfo.pzPriceSpace
            .trim()
            .split(" ")
            .forEach(item => {
              let arr = item.split("#");
              this.taskData.push({
                cardId: arr[0],
                cardName: arr[1],
                taskPrice: arr[2]
              });
            });
        }
      }
    },
    voucherInfoInPzItemsParam(val, oldVal) {
      this.voucherInfoItems = val;
      //this.voucherInfoItems = val;
    }
  },
  created: function() {
    this.ckId = this.$route.query.ckId;
    this.ckName = this.$route.query.ckName;
    this.voucherInfo.companyId = this.$route.query.companyId;

    let rowId = this.$route.query.pzRowId;
    if (typeof rowId !== "string" && !this.isQuote) {
      let voucherType = this.$route.query.voucherType;
      if (typeof voucherType === "string" && voucherType.trim().length > 0) {
        this.voucherInfo.voucherType = voucherType;
      }
      this.loadVoucherNum();
      //获取当前时间
      this.getNewDate();
      this.voucherInfoItems[0].ckId = this.ckId;
      this.voucherInfoItems[0].ckName = this.ckName;
    }
    this.getCKSetting();
  },
  methods: {
    calculateAccount(index) {
      if (
        Z_IsEmpty20(this.voucherInfoItems[index].projectId) ||
        Z_IsEmpty20(this.voucherInfoItems[index].pzOriginalAccount)
      ) {
        return;
      }
      let convertWay = "multiplication";
      let rate = "1";
      if (!Z_IsEmpty20(this.voucherInfoItems[index].projectId)) {
        let subject = this.code2Suject[this.voucherInfoItems[index].projectId];
        if (!Z_IsEmpty20(subject)) {
          convertWay = subject.convertWay;
          rate = subject.rate;
        }
      }
      if (convertWay === "multiplication") {
        this.voucherInfoItems[index].pzAccount = (
          parseFloat(this.voucherInfoItems[index].pzOriginalAccount) *
          parseFloat(rate)
        ).toFixed(2);
      } else {
        this.voucherInfoItems[index].pzAccount = (
          parseFloat(this.voucherInfoItems[index].pzOriginalAccount) /
          parseFloat(rate)
        ).toFixed(2);
      }
    },
    //获取当前时间
    getNewDate() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let date = new Date().getDate();
      date = date > 9 ? date : "0" + date;
      this.voucherInfo.inOrOutTime = year + "-" + month + "-" + date;
    },
    choseDJLX(key, val) {
      //选择单据类型
      this.voucherInfoItems[val].docType = key;
    },
    loadVoucherNum() {
      let urlNum = "/zingbiz/resourceLibrary/voucher/getVoucherNumber";
      this.$http
        .get(urlNum, { params: { voucherType: this.voucherInfo.voucherType } })
        .then(res => {
          //加载编号
          if (res.data.success) {
            this.voucherInfo.pzId = res.data.data.pzId;
          } else {
            this.$vux.toast.text("加载失败，请重试");
          }
        });
    },
    addEntry() {
      //添加一组条目
      this.voucherInfoItems.push({
        rowId: "",
        pzCount: "",
        docType: "CLBXD", //单据类型
        imageListYW: [], //图片列表,pzImgs
        pzImgs: "",
        pzAccount: "", //总金额
        examineAspect: "借",
        pzPrice: "",
        projectId: this.voucherInfo.ckProjectId, //科目代码
        projectName: this.voucherInfo.ckProjectName, //科目名称
        projectPath: this.voucherInfo.ckProjectPath, //科目地址
        pzServiceDesc: this.voucherInfo.pzServiceDesc, //业务描述
        pzSummary: "", //摘要
        pzType: "inPz",
        dataType: "CW",
        voucherType: this.voucherInfo.voucherType,
        ckId: this.ckId,
        ckName: this.ckName
      });
    },
    delEntry(val) {
      let _this = this;
      //删除一组条目
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          if (_this.voucherInfoItems.length > 1) {
            _this.voucherInfoItems.splice(val, 1);
          }
        }
      });
    },
    addRenwu() {
      //显示任务页面
      this.financialRenwuShow = true;
    },
    getDialogData(data) {
      //获得任务页面返回数据
      if (
        this.cardIdArr.length > 0 &&
        this.cardIdArr.join(" ").indexOf(data.cardId) >= 0
      ) {
        this.$vux.toast.text("任务已存在，请重新选择");
        return false;
      }
      this.taskData.push({
        cardId: data.cardId,
        cardName: data.title,
        taskPrice: ""
      });
      this.boradIdArr.push(data.boardId);
      this.cardIdArr.push(data.cardId);
      this.listIdListArr.push(data.listId);
      this.financialRenwuShow = false;
    },
    goBackShow() {
      //隐藏任务页面
      this.financialRenwuShow = false;
    },
    hideDialogData() {
      //隐藏任务页面
      this.financialRenwuShow = false;
    },
    taskShow(index) {
      //查看crad
      //this.dialogShow = true;
      this.currentBoardId = this.boradIdArr[index];
      this.currentListId = this.listIdListArr[index];
      this.currentCardId = this.cardIdArr[index];

      this.showTaskDetail = true;
      this.$refs.taskDetailRef.loading();
    },
    taskDetailBack() {
      this.showTaskDetail = false;
    },
    delRenwu(index) {
      //删除一个任务
      let _this = this;
      this.$vux.confirm.show({
        title: "提示",
        content: "确认删除吗？",
        // 组件除show外的属性
        onConfirm() {
          _this.taskData.splice(index, 1);
          _this.cardIdArr.splice(index, 1);
          _this.listIdListArr.splice(index, 1);
          _this.boradIdArr.splice(index, 1);
        }
      });
    },
    selectPickedDialog(index) {
      //显示科目页面
      this.clickKMIndex = index;
      this.showPicker = true;
    },
    getPickedData(pickedData) {
      //获取科目代码数据
      this.voucherInfoItems[this.clickKMIndex].projectId = pickedData.fileId;
      this.voucherInfoItems[this.clickKMIndex].projectName =
        pickedData.filename;
      this.voucherInfoItems[this.clickKMIndex].projectPath = pickedData.modleId;
      this.voucherInfoItems[this.clickKMIndex].pzServiceDesc =
        pickedData.description;
      this.showPicker = false;
    },
    subjectAbort() {
      this.showPicker = false;
    },
    //上传图片组件方法
    fliesChange(args, clickKMIndex) {
      let imgs = this.voucherInfoItems[clickKMIndex].imageListYW;
      imgs.forEach(img => {
        this.voucherInfoItems[clickKMIndex].pzImgs = img.url + " ";
      });
    },
    onImageClick(index, files) {
      //
    },
    savePZ(operate) {
      let isToFlow = false;
      if (operate === "SUBMIT" && this.voucherInfo.pzStatus !== "YSH") {
        isToFlow = true;
      }

      if (
        this.voucherInfo.pzStatus !== "YSH" &&
        this.isNeedTask &&
        this.cardIdArr.length === 0
      ) {
        this.$vux.toast.text("请添加任务核算项");
        return;
      }
      for (let i = 0; i < this.voucherInfoItems.length; i++) {
        //imageListYW
        if (this.voucherInfoItems[i].imageListYW.length <= 0) {
          this.$vux.toast.text("请上传图片");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].pzSummary !== "string" ||
          this.voucherInfoItems[i].pzSummary.length === 0
        ) {
          this.$vux.toast.text("请填写摘要");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].pzOriginalAccount !== "string" ||
          this.voucherInfoItems[i].pzOriginalAccount.length === 0
        ) {
          this.$vux.toast.text("请填写金额");
          return false;
        }
        let reg1 = /^[+-]?\d*\.?\d{0,3}$/;
        if (!reg1.test(this.voucherInfoItems[i].pzOriginalAccount)) {
          this.$vux.toast.text("金额必须是数字");
          result = false;
        }
        if (
          typeof this.voucherInfoItems[i].projectId !== "string" ||
          this.voucherInfoItems[i].projectId.length === 0
        ) {
          this.$vux.toast.text("请选择科目");
          return false;
        }
        if (
          typeof this.voucherInfoItems[i].ckId !== "string" ||
          this.voucherInfoItems[i].ckId.length === 0
        ) {
          this.$vux.toast.text("请选择财务库");
          return false;
        }
      }
      this.voucherInfo.pzBoradIdSpace = this.boradIdArr.join(" ");
      this.voucherInfo.pzCardIdSpace = this.cardIdArr.join(" ");
      this.voucherInfo.pzListIdSpace = this.listIdListArr.join(" ");
      this.voucherInfo.pzPriceSpace = "";
      let reg1 = /^[+-]?\d*\.?\d{0,2}$/;
      let flag = false;
      let total = 0;
      this.taskData.forEach(item => {
        if (!reg1.test(item.taskPrice)) {
          flag = true;
        } else {
          total += parseFloat(item.taskPrice);
          this.voucherInfo.pzPriceSpace +=
            item.cardId + "#" + item.taskPrice + " ";
        }
      });
      if (this.taskData.length > 0) {
        if (flag) {
          this.$vux.toast.text("请输入任务金额");
          return;
        } else if (total != this.pzFirstMoney) {
          this.$vux.toast.text("任务金额与总金额不一致!");
          return;
        }
      }
      this.voucherInfo.pzPriceSpace = this.voucherInfo.pzPriceSpace.trim();
      this.voucherInfo.pzFirstMoney = this.pzFirstMoney;
      this.voucherInfo.operate = operate;
      this.voucherInfo.pzShowImg = this.voucherInfoItems[0]["imageListYW"][0][
        "url"
      ];
      this.voucherInfo.voucherInfoItems = this.voucherInfoItems;

      if (operate === "SUBMIT" && !isToFlow) {
        let _this = this;
        this.$vux.confirm.show({
          title: "提示",
          content: "确认进行反审核操作吗？",
          // 组件除show外的属性
          onConfirm() {
            _this.voucherInfo.pzStatus = "WTJ";
            _this.saveOrUpdateData(isToFlow);
          }
        });
      } else {
        this.voucherInfo.pzStatus = "WTJ";
        this.saveOrUpdateData(isToFlow);
      }
    },
    updateDate() {
      let url = "/zingbiz/resourceLibrary/voucher/updateVoucher";
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          this.$vux.toast.text("数据修改成功");
        } else {
          this.$vux.toast.text("数据修改失败，请重试");
        }
      });
    },
    saveOrUpdateData(isToFlow) {
      let url = "/zingbiz/resourceLibrary/voucher/insertVoucherFinance";
      let rowId = this.$route.query.pzRowId;
      if (typeof rowId !== "undefined") {
        url = "/zingbiz/resourceLibrary/voucher/updateVoucher";
      }
      this.$http.post(url, this.voucherInfo).then(res => {
        if (res.status === 200) {
          if (isToFlow) {
            //跳转发起审批页面
            this.$router.push({
              path: "/workflow/workflowMain",
              query: {
                pzRowId: res.data.data.rowId,
                voucherType: this.voucherInfo.voucherType,
                companyId: this.voucherInfo.companyId,
                wfType: "MODULE_TYPE_ZYK"
              }
            });
          } else {
            this.$router.back(-1);
          }
        } else {
          this.$message({ type: "error", message: "保存失败，请重试" });
        }
      });
    },
    openWareHoseList(index) {
      this.clickKMIndex = index;
      this.showWarehoseList = true;
    },
    financeItemClick(data) {
      this.voucherInfoItems[this.clickKMIndex].ckId = data.rowId;
      this.voucherInfoItems[this.clickKMIndex].ckName = data.ckName;
      this.showWarehoseList = false;
    },
    warehoseListBack() {
      this.showWarehoseList = false;
    },
    getCKSetting() {
      this.$http
        .get("/zingbiz/resourceLibrary/setting/selectResourceLibrarySetting", {
          params: {
            settingType: "WITHTRELLO",
            ckType: "CW"
          }
        })
        .then(res => {
          if (
            res.data.data.length > 0 &&
            res.data.data[0]["withTrello"] === "true"
          ) {
            this.isNeedTask = true;
          } else {
            this.isNeedTask = false;
          }
        });
    },
    voucherPost(flag) {
      let params = {
        rowId: this.voucherInfo.rowId,
        flag
      };
      this.$http
        .get("/zingbiz/resourceLibrary/voucher/voucherPost.action", {
          params
        })
        .then(res => {
          if (res.data.success) {
            this.$vux.toast.text((flag ? "过账" : "反过账") + "成功");
            this.voucherInfo.pzStatus = flag ? "YGZ" : "YSH";
            this.pzStatusText = flag ? "" : "反审核";
          }
        });
    }
  }
};
</script>

<style scoped>
.examineAspectItem {
  width: 50px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 13px;
}
.examineAspectItem-selected {
  background: #ffffff bottom;
  border-color: #ff8000;
}
</style>
