<template>
  <div id="quitEmployee" class="quitEmployee">
    <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
    <!--<zing-head :isShowQuery="true" :title="'离职员工'"></zing-head>-->
    <div class="quitEmployeeContent">
      <!--<scroll ref="scroll" :data="items" :scrollbar="true"
              :pullUpLoad="{threshold: 0, txt: { noMore: 'noMore'} }" :startY="0"
              @pullingUp="onPullingUp">-->
      <!--<scroll ref="scroll" :data="items" :scrollbar="true" :startY="0">-->
        <div v-if="getDataInfo && getDataInfo.length > 0">
          <GridCard v-for="(data, index) in getDataInfo" :key="index">
            <div slot="cardLeft" class="left" @click="gotoPage(data)">
              <!--<avatar shape="square" :src="require('../../../assets/img/tou.png')"></avatar>-->
              <!--<avatar shape="square" :src="'/checkJpg/Fv/company52589551100001FvyEfyyQRrUr2ArAJzBvY7r2HR.jpg?v=1491365658801'"></avatar>-->
              <avatar shape="square" :src="data.headImg"></avatar>
              <div class="left-wrapper">
                <p class="left-wrapper-title">{{data.userName}}</p>
                <div class="left-wrapper-desc">
                  {{'离职时间：'+ data.generate_time}}
                </div>
              </div>
            </div>
            <div slot="cardRight" class="right">
              <div class="tag-wrapper">
                <!--<tag color="#20a0ff">复职</tag>-->
                <x-button mini @click.native="openDialog(data)">复职</x-button>
              </div>
            </div>
          </GridCard>
        </div>
        <div v-else class="prompt" :style="{ height: screenHeight + 'px'}">暂无离职员工</div>
      <!--</scroll>-->
    </div>
    <org-member-picker ref="orgMemberPicker" :showTab="showTab" :initialSelected="orgMemberSelected" :showPicker="showMemberPicker"
                       :multiple="multiple" :initialSelectedType="'cardUrl'"
                       @picked="getMemberPickedData"
                       @abort="onMemberPickAbort"></org-member-picker>
  </div>
</template>


<script>
  import {XButton, XInput, Group} from 'vux'
  import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
  import ZingHead from "@/components/zingHead/ZingHead";
  import Scroll from "@/components/scroll/Scroll";
  import GridCard from "@/components/gridcard/GridCard";
  import Avatar from "@/components/avatar/Avatar";
  import Tag from "@/components/tag/Tag";

  export default {
    name: "quitEmployee",
    components: {
      OrgMemberPicker, XButton, XInput, Group, Scroll, GridCard, Avatar, Tag, ZingHead
    },
    directives: {
      //自定义标签属性
    },
    data() {
      return {
        headTitle: "档案列表",
        multiple: true,
        cardUrl: "",
        companyId: "",
        screenHeight: "0px",
        showMemberPicker: false,
        showTab: ["org", "role"],
        orgMemberSelected: [],
        getDataInfo: [
          {
            userName: "张三",
            generate_time: "2018-03-22 18:28:32",
            userNam: "张三",
          }
        ],
        sourceEmployeeTurnoverData: [],
        items: [],
      }
    },
    //钩子加载完触发
    created() {
      this.getData();
      this.screenHeight = document.documentElement.clientHeight - 145;
    },
    methods: {
      getData() {
        console.log("getEmployeeTurnover .......");
        let self = this;
        /*let url = "/zingbiz/hrManager/transferOfWork/getFormerEmployees";*/
        let url = "/zingbiz/hrManager/EmployeeTurnover/getEmployeeTurnover";
        let params = {
          pageNumber: "1",
          pageSize: "50",
        };
        self.$http.post(url, params).then(res => {
          console.log(res);
          if (res.data.success === true) {
            self.getDataInfo = res.data.data;
            self.sourceEmployeeTurnoverData = res.data.data;
          }
        });
      },
      searchQuitEmployee(val, type) {
        console.log("searchQuitEmployee");
        console.log(val);
        if (type === "search") {
          let searchArr = []
          this.getDataInfo.forEach(item => {
            if (item.userName.indexOf(val) >= 0) {
              searchArr.push(item)
            }
          })
          this.getDataInfo = searchArr
        } else {
          this.getDataInfo = this.sourceEmployeeTurnoverData;
        }
      },
      openDialog(data) {
        console.log("openDialog............")
        this.$store.dispatch('updateTokenSeed')
        this.$refs.orgMemberPicker.initOrgRoleUser();
        this.showMemberPicker = true;
        this.cardUrl = data.cardUrl;
        this.companyId = data.companyId;
      },
      getMemberPickedData(data) {
        console.log(data);
        let orgIds = "";
        let roleCode = "";
        data.forEach(item => {
          if (item.recordType === "org") {
            orgIds += item.id + " "
          }
          if (item.type === "role") {
            roleCode = item.id
          }
        })
        if (orgIds.length > 0) {
          orgIds = orgIds.substr(0, orgIds.length - 1);
        }
        console.log(orgIds);
        console.log(roleCode);
        if (orgIds !== "" && roleCode !== "") {
          this.recoveryBackupData(orgIds, roleCode);
        } else {
          this.$vux.toast.show({
            text: '请选择部门和角色',
            type: 'text',
            position: 'default'
          })
        }

        this.showMemberPicker = false;
      },
      onMemberPickAbort() {
        this.showMemberPicker = false;
      },
      onPullingDown() {
        // 模拟更新数据
        console.log("pulling down and load data");
        setTimeout(() => {
          if (this._isDestroyed) {
            return;
          }
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.$refs.scroll.forceUpdate();
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
          }
        }, 2000);
      },
      onPullingUp() {
        // 更新数据
        console.log("pulling up and load data");
        setTimeout(() => {
          if (this._isDestroyed) {
            return;
          }
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.$refs.scroll.forceUpdate();
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
          }
        }, 1500);
      },
      gotoPage(data) {
        console.log(data);
        this.$router.push({
          path: "/hrManager/userInfoDetails",
          query: {
            cardUrl: data.cardUrl,
          }
        });
      },
      recoveryBackupData(orgIds, roleCode) {
        let _this = this
        let url = "/zingbiz/hrManager/EmployeeTurnover/reinstatement"
        /*let params = {
            cardUrl:"iyy2y22aeyau7Zzq2qIr6bYf",
            companyId:"company52589677100001",
            roleCode:"52589689100001",
            orgIds:"company525896771000011",
        }*/
        let params = {
          cardUrl: this.cardUrl,
          companyId: this.companyId,
          roleCode: roleCode,
          orgIds: orgIds,
        }
        this.$http.post(url, params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$vux.toast.show({
              text: "复职成功！",
              type: "success",
              onHide() {
                _this.getData();
                _this.$emit('on-reinstatement');
              }
            })
          } else {
            this.$vux.toast.show({
              text: '复职失败',
              type: 'text',
              position: 'default'
            })
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../assets/stylus/variable.styl';

  .orgEdit
    display flex
    flex-direction column
    width 100%
    height 100%
    /*.org-edit-head
      flex-shrink 0*/
    .quitEmployeeContent
      flex-grow 1
      overflow-y auto

</style>
<style scoped>
  .quitEmployee {
    height: 100%;
  }

  body .weui-btn {
    color: #fff;
    background-color: #ff8000;
    width: 50px;
    height: 30px;
    padding-right: 10px;
    padding-left: 10px;
  }

  .prompt {
    background: #fbf9fe;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #ff8000;
  }
</style>
