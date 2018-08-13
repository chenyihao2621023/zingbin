<template>
  <div>
    <zing-head :isComeBack="!isReferenced" @doSome="doSome" :title="'凭证汇总单'">
      <div slot="header-right">
        <span v-show="isShowButton && voucherCollect.dataStatus==='WTJ'" class="header-jiahao">
          <dropdown ref="dropdownRef" :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">

              <i class="iconfont icon-gengduo"></i>

            </a>
          </dropdown>
        </span>
      </div>
    </zing-head>
    <div class="root-div vue-tab">
      <tab :line-width="2">
        <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="chengeTab" @click="defTab = item" :key="index">{{item}}
        </tab-item>
      </tab>
      <div v-show="ywShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <group label-width="4.5em">
          <x-input title="编号" v-model="voucherCollect.pzNo" :disabled="true" placeholder="" class="fontColor"></x-input>
          <x-input title="日期" v-model="voucherCollect.createDate" :disabled="true" placeholder="" class="fontColor"></x-input>
          <x-input title="创建者" v-model="voucherCollect.createName" :disabled="true" placeholder="" class="fontColor"></x-input>
        </group>
        <group style="margin-top:18px;" label-width="4.5em" v-for="(item, index) in ywVoucherInfoItems" :key="index">
          <!--  <image-picker :files="item.imageListYW" :companyId="voucherInfo.companyId" selectable multiple /> -->
          <div class="vux-x-input weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label" style="width: 5em;">图片</label>
            </div>
            <div class="weui-cell__bd">
              <img style="height:50px;width:50px;" v-if="item.imageListYW && item.imageListYW.length > 0" :src="item.imageListYW[0]" />
            </div>
          </div>
          <x-input title="单据类型" placeholder="请选择单据类型" :readonly="false" :value="getDocTypeName(item.docType)"></x-input>
          <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" placeholder="" v-model="item.pzSummary" class="fontColor"></x-textarea>
          <x-input title="原币金额<span style='color: red;'>*</span>" :show-clear="false" :disabled="disabled" placeholder="0.00" v-model="item.pzOriginalAccount" class="fontColor"></x-input>
          <x-input title="本币金额<span style='color: red;'>*</span>" :show-clear="false" :disabled="disabled" placeholder="0.00" v-model="item.pzAccount" class="fontColor"></x-input>
          <x-input title="业务描述" :show-clear="false" placeholder="请选择业务描述" :disabled="true" v-model="item.pzServiceDesc" class="fontColor"></x-input>
          <x-input title="科目代码<span style='color: red;'>*</span>" placeholder="请选择科目代码" :show-clear="false" v-model="item.projectId" :disabled="true" class="fontColor"></x-input>
          <x-input title="科目名称<span style='color: red;'>*</span>" placeholder="请选择科目名称" :show-clear="false" v-model="item.projectName" :disabled="true" class="fontColor"></x-input>
          <x-input title="财务库<span style='color: red;'>*</span>" :show-clear="false" v-model="item.ckName" :disabled="true" placeholder="" class="fontColor"></x-input>
          <x-input title="原凭证<span style='color: red;'>*</span>" :show-clear="false" v-model="item.pzId" :disabled="true" placeholder="" class="fontColor"></x-input>
        </group>
        <!-- 科目 -->
        <group v-if="ywVoucherInfoItems && ywVoucherInfoItems.length > 0" style="margin:18px 0px;">
          <flexbox>
            <flexbox-item>
              <x-input title="￥" v-model="pzFirstMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
            </flexbox-item>
          </flexbox>
        </group>
      </div>
      <div v-show="shShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <group style="margin-bottom:18px;" v-for="(item, index) in shVoucherInfoItems" :key="index" label-width="5em">
          <div class="vux-x-input weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label" style="width: 5em;">图片</label>
            </div>
            <div class="weui-cell__bd">
              <img style="height:50px;width:50px;" v-if="item.imageListYW && item.imageListYW.length > 0" :src="item.imageListYW[0]" />
            </div>
          </div>
          <x-textarea title="摘要<span style='color: red;'>*</span>" :max="2000" v-model="item.pzSummary" :readonly="disabled" placeholder=""></x-textarea>
          <x-input title="金额<span style='color: red;'>*</span>" v-model="item.pzPrice" :show-clear="false" :disabled="disabled" placeholder="0.00"></x-input>
          <x-input title="业务描述" v-model="item.pzServiceDesc" :show-clear="false" :disabled="true" placeholder=""></x-input>
          <x-input title="科目代码<span style='color: red;'>*</span>" v-model="item.projectId" :show-clear="false" :disabled="true" placeholder=""></x-input>
          <x-input title="科目名称<span style='color: red;'>*</span>" v-model="item.projectName" :show-clear="false" :disabled="true" placeholder=""></x-input>
          <x-input title="原来凭证<span style='color: red;'>*</span>" v-model="item.pzId" :show-clear="false" :disabled="true" placeholder=""></x-input>
        </group>

        <group v-if="shVoucherInfoItems && shVoucherInfoItems.length > 0" style="margin-bottom:18px;">
          <flexbox>
            <flexbox-item>
              <x-input title="￥" v-model="pzFirstMoney" keyboard="number" :show-clear="false" :disabled="true" placeholder=""></x-input>
            </flexbox-item>
          </flexbox>
        </group>
      </div>
      <div v-show="jlShow" class="cw-div" :style="{ height: screenHeight + 'px'}">
        <collection-add-record></collection-add-record>
      </div>
    </div>
    <group v-if="isShowButton">
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button class="btn-common" type="warn" @click.native="save('QX')">取消汇总</x-button>
        </flexbox-item>
        <flexbox-item v-show="voucherCollect.dataStatus === 'WTJ'">
          <x-button class="btn-save" type="primary" @click.native="save('WTJ')">保存</x-button>
        </flexbox-item>
        <flexbox-item v-show="voucherCollect.dataStatus==='WTJ'">
          <x-button class="btn-common" type="warn" @click.native="save('YSH')">提交</x-button>
        </flexbox-item>
      </flexbox>
    </group>

    <popup v-model="collectionVoucherChoiseShow" style="background-color: #fff;" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <collection-voucher-choise @choosed="choosed" @voucherChoiseBack="voucherChoiseBack"></collection-voucher-choise>
    </popup>
  </div>
</template>


<script>
import {
  Tab,
  TabItem,
  XButton,
  Popup,
  XTextarea,
  XInput,
  Group,
  Cell,
  Flexbox,
  FlexboxItem,
  XSwitch,
  GroupTitle
} from "vux";
import CollectionAddRecord from "./collectionAddRecord";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
import CollectionVoucherChoise from "./collectionVoucherChoise";

export default {
  name: "financialManage",
  components: {
    Tab,
    TabItem,
    XButton,
    Popup,
    XTextarea,
    XInput,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    XSwitch,
    GroupTitle,
    CollectionAddRecord,
    ZingHead,
    Dropdown,
    CollectionVoucherChoise
  },
  directives: {
    //自定义标签属性
  },
  props: {
    isReferenced: {
      type: Boolean,
      default: false
    },
    voucherInfoItems: {
      type: "Object"
    },
    pzRowIds: {
      type: String
    }
  },
  data() {
    return {
      datas: [{ content: "新建明细" }],
      tabTitle: ["业务", "审核", "记录"],
      defTab: "业务",
      collectionVoucherChoiseShow: false,
      ywShow: true,
      shShow: false,
      jlShow: false,
      isShowButton: true,
      pzFirstMoney: "",
      pzSecondMoney: "",
      screenHeight: "0",
      voucherCollect: {
        createName: "",
        createDate: "",
        hzAccount: "",
        pzNo: "",
        dataStatus: "WTJ",
        pzRowIds: ""
      },
      ywVoucherInfoItems: [],
      shVoucherInfoItems: [],
      cwkDatas: [],
      pzDatas: {},
      ckInfo: {},
      pzDatasForVS: {} //审核与财务页面凭证数据
    };
  },
  watch: {
    voucherInfoItems(val, oldVal) {
      this.$refs.dropdownRef.setPosition();
      this.setVoucherInfoItems(val);
    }
  },
  //钩子加载完触发
  created: function() {
    if (this.isReferenced) {
      this.screenHeight = document.documentElement.clientHeight - 50 - 44 - 44;
    } else {
      this.screenHeight = document.documentElement.clientHeight - 50 - 44 - 44;
    }
    let rowId = this.$route.query.pzRowId;
    this.voucherCollect.rowId = rowId;
    this.loadVoucherDetail(rowId, false);
  },
  methods: {
    voucherChoiseBack() {
      this.collectionVoucherChoiseShow = false;
    },
    choosed(pzRowIds, items) {
      this.voucherCollect.pzRowIds = pzRowIds;
      this.setVoucherInfoItems(items);
    },
    setVoucherInfoItems(val) {
      this.ywVoucherInfoItems.splice(0, this.ywVoucherInfoItems.length);
      this.shVoucherInfoItems.splice(0, this.shVoucherInfoItems.length);
      let ywAccount = 0;
      let shAccount = 0;
      val.forEach(item => {
        if (typeof item.pzImgs === "string" && item.pzImgs.length > 0) {
          item.imageListYW = [];
          item.pzImgs.split(" ").forEach((img, imgIndex) => {
            if (img.trim().length > 0) {
              item.imageListYW.push(img);
            }
          });
        }
        if (item.pzType === "inPz") {
          ywAccount += parseFloat(item.pzOriginalAccount);
          this.ywVoucherInfoItems.push(item);
        } else {
          shAccount += parseFloat(item.pzOriginalAccount);
          this.shVoucherInfoItems.push(item);
        }
      });
      this.pzFirstMoney = isNaN(ywAccount) ? 0 : ywAccount;
      this.pzSecondMoney = isNaN(shAccount) ? 0 : shAccount;
    },
    doSome() {
      this.$emit("collectionAddBack");
    },
    handleMenu() {
      this.collectionVoucherChoiseShow = true;
    },
    chengeTab(index) {
      if (index === 0) {
        this.ywShow = true;
        this.shShow = false;
        this.jlShow = false;
        if (!this.isShowButton) {
          this.screenHeight -= 44;
          this.isShowButton = true;
        }
      } else if (index === 1) {
        this.ywShow = false;
        this.shShow = true;
        this.jlShow = false;
        if (!this.isShowButton) {
          this.screenHeight -= 44;
          this.isShowButton = true;
        }
      } else {
        this.ywShow = false;
        this.shShow = false;
        this.jlShow = true;
        if (this.isShowButton) {
          this.screenHeight += 44;
          this.isShowButton = false;
        }
      }
    },
    loadVoucherDetail(rowId) {
      let urlNum = "/zingbiz/resourceLibrary/collection/getPzHzInfo";
      var params = {
        rowId
      };
      this.$http.get(urlNum, { params }).then(res => {
        //加载编号
        if (res.data.success) {
          this.voucherCollect = res.data.data;
          if (typeof rowId !== "undefined" && rowId.length > 0) {
            this.setVoucherInfoItems(res.data.data.voucherInfoItems);
          } else {
            this.voucherCollect.pzRowIds = this.pzRowIds;
          }
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    },
    save(type) {
      this.voucherCollect.dataStatus = type;
      this.voucherCollect.hzAccount = this.pzFirstMoney;
      let url = "/zingbiz/resourceLibrary/collection/insertVoucherCollect";
      if (
        typeof this.voucherCollect.rowId !== "undefined" &&
        this.voucherCollect.rowId !== null &&
        this.voucherCollect.rowId.length > 0
      ) {
        url = "/zingbiz/resourceLibrary/collection/updateVoucherCollect";
      } else if ("QX" === type) {
        this.$emit("collectionSave");
        return;
      }
      this.$http.post(url, this.voucherCollect).then(res => {
        //加载编号
        if (res.data.success) {
          if (this.isReferenced) {
            this.$emit("collectionSave");
          } else {
            let query = {
              companyId: this.$route.query.companyId
            };

            this.$router.push({
              path: "/resourceLibrary/financeWarehouse/collectionList",
              query
            });
          }
        } else {
          this.$vux.toast.text("加载失败，请重试");
        }
      });
    },
    getDocTypeName(key) {
      //单据类型数组
      let key2DocType = {
        CLBXD: "差旅报销单",
        ZCPZ: "支出凭证",
        FYBX: "费用报销",
        QT: "其它"
      };
      //选择单据类型
      return key2DocType[key];
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';

.root-div {
  height: 100%;
  background: #F5F5F5;
}

.cw-div {
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>