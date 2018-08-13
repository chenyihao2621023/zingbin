<template>
  <!-- 弹框模板 -->
  <div class="taskSelection"> 
    <popup v-model="showTaskSelection" position="right" class="popModel" height="100%" width="100%">
      <zing-head :title="'任务选择'" :isComeBack="false" @doSome="goBackShow"></zing-head>
      <div class="content">
        <group>
          <selector title="任务集名称" placeholder="请选择" :options="boardData" @on-change="onChangeBoard"></selector>
          <selector title="任务名称" placeholder="请选择" @click.native="isChooseBoard" @on-change="chooseCard" :options="cardData"></selector>
        </group>
      </div>

      <flexbox :gutter="0">
        <flexbox-item>
          <x-button class="btn-common" @click.native="cancleTaskSelection" type="warn">取消</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button class="btn-save" @click.native="confirmTaskSelection" type="primary">确定</x-button>
        </flexbox-item>
      </flexbox>
    </popup>
    <org-member-picker :initialSelected="orgMemberRowId" :showPicker="showMemberPicker" @picked="getMemberPickedData" @abort="onMemberPickAbort"></org-member-picker>
  </div>
</template>


<script>
import _ from "lodash";
import ZingHead from "@/components/zingHead/ZingHead";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
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
  GroupTitle
} from "vux";

export default {
  name: "taskSelection",
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
    GroupTitle,
    ZingHead,
    OrgMemberPicker
  },
  props: {
    showTaskSelection: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      screenHeight: "0", //页面高度
      showMemberPicker: false, //控制选人组件隐藏显示
      orgMemberType: "", //人员类型
      orgMemberRowId: [], //人员id列表
      orgMemberRWJData: [], //任务集创建人
      orgMemberRWJNames: "", //任务集创建人名称以逗号分隔
      orgMemberRWJId: [], //任务集创建人id
      orgMemberRWData: [], //任务创建人
      orgMemberRWNames: "", //任务创建人名称以逗号分隔
      orgMemberRWId: [], //任务创建人id
      clazzList: [
        //分类类型
        { key: "0", value: "请选择" },
        { key: "work", value: "私有分类" },
        { key: "superWork", value: "共有分类" }
      ],
      clazzListData: [], //分类下数据根据clazzList变化
      lodeCardParam: {}, //获得任务子集所需参数
      lodeBoardParam: {}, //获得任务集所需参数
      boardData: [], //任务集数据
      cardData: [], //任务子集数据
      cardRealData: [], //
      backData: null,
      partakeData: [
        //任务相关性
        { key: "0", value: "请选择" },
        { key: "partake", value: "自己参与的任务" },
        { key: "notPartake", value: "自己未参与的任务" }
      ]
    };
  },
  created: function() {
    this.screenHeight = document.documentElement.clientHeight - 100;
    lodeBoardListData(this);
  },
  methods: {
    goBackShow() {
      //返回方法
      this.$emit("cancleTaskSelection");
    },
    onChangeClazz(val) {
      //根据分类加载数据
      let that = this;
      lodeCardListData(this);
      let url = "/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl";
      this.$http.post(url, { tagType: val, isCompanyId: true }).then(res => {
        if (res.data.success) {
          console.log(res.data);
          that.clazzListData = res.data.data.data;
        } else {
          that.$message({ type: "error", message: "加载失败，请重试" });
        }
      });
    },
    onChangeBoard(val) {
      //根据任务集加载任务子集
      this.lodeCardParam.boardId = val;
      lodeCardListData(this);
    },
    onChangePartake(val) {
      //根据任务相关性载任务子集
      this.lodeCardParam.partakeType = val;
      lodeCardListData(this);
    },
    onChooseZRW(val) {
      //根据子任务载任务子集
      this.lodeCardParam.listId = val;
      lodeCardListData(this);
    },
    isChooseBoard() {
      if (!this.lodeCardParam.boardId) {
        this.$message({ type: "error", message: "请选择任务集" });
        return false;
      }
    },
    chooseCard(val) {
      this.backData = this.cardRealData[val];
    },
    showMemberDialog(rowIds, type) {
      /* 选择组织机构人员 */
      this.orgMemberType = type;
      if (rowIds) {
        this.orgMemberRowId = rowIds;
      }
      this.showMemberPicker = true;
    },
    getMemberPickedData(data) {
      //获取组织机构人员数据
      let orgMemberName = [];
      let orgMemberIdArry = [];
      for (let i = 0; i < data.length; i++) {
        orgMemberName.push(data[i].userName);
        orgMemberIdArry.push(data[i].rowId);
      }
      if (this.orgMemberType === "RWJ") {
        this.orgMemberRWJNames = orgMemberName.join(",");
        this.orgMemberRWJId = orgMemberIdArry;
        this.orgMemberRWJData = data;
        this.lodeBoardParam.createName = this.orgMemberRWJNames;
        lodeBoardListData(this);
      } else {
        this.orgMemberRWNames = orgMemberName.join(",");
        this.orgMemberRWId = orgMemberIdArry;
        this.orgMemberRWData = data;
        this.lodeCardParam.cardCreateName = this.orgMemberRWNames;
        lodeCardListData(this);
      }
      this.showMemberPicker = false;
    },
    onMemberPickAbort() {
      //隐藏组织机构人员弹框
      this.showMemberPicker = false;
    },
    confirmTaskSelection() {
      //获取本页面数据
      if (!this.backData && !this.backData.cardId) {
        this.$message({ type: "error", message: "请选择任务集" });
        return false;
      }
      this.$emit("confirmTaskSelection", this.backData);
      this.dialogShow = false;
    },
    cancleTaskSelection() {
      //隐藏本页面
      this.$emit("cancleTaskSelection");
    }
  }
};

function lodeCardListData(that) {
  let url = "/zingbiz/report/tast_set/selectCardIdsByCon";
  that.$http.post(url, that.lodeCardParam).then(res => {
    if (res.data.success) {
      console.log(res.data);
      that.cardData = [];
      that.cardRealData = res.data.data;
      for (let i = 0; i < res.data.data.length; i++) {
        that.cardData.push({ key: i, value: res.data.data[i].title });
      }
    } else {
      that.$message({ type: "error", message: "加载失败，请重试" });
    }
  });
}

function lodeBoardListData(that) {
  //加载Board数据http://192.168.0.109:7300/mock/5a976dd9e7a152243e3092f9/report/zingbiz/report/tast_set/selectCardIdsByCon
  let urlBoard =
    "/ZingMH/ZDesk/board/mater/loadBoardByUser.action?tag=trello&pageNumber=1&pageSize=10";
  // that.lodeBoardParam.companyId = that.$store.state.ui.userInfo.companyId;
  that.$http.get(urlBoard).then(res => {
    let boardList = res.data.data[0].data || [];
    that.boardData = [];
    console.log(res.data.data[0].data || []);

    _.each(boardList, board => {
      that.boardData.push({
        key: board.boardId,
        value: board.title
      });
    });
    // that.boardData = [];
    // for (let i = 0; i < res.data.data.length; i++) {
    //   that.boardData.push({
    //     key: res.data.data[i].boardId,
    //     value: res.data.data[i].title
    //   });
    // }
  });
}
</script>
</script>

<style scoped lang="stylus">
.taskSelection {
  .popModel {
    height: 100% !important;
    background: #fbf9fe !important;

    &::-webkit-scrollbar {
      display: none;
    }

    .content {
      height: calc(100% -100px);
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>