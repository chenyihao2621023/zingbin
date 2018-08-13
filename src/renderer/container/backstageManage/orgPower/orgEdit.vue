<template>
  <div id="orgEdit" class="orgEdit">
    <!--<zi-tree
        class="org-edit-content"
        ref="roleTree"
        :props="defaultProps"
        :data="treeData"
        :menuData="menuData"
        :checkable="falseType"
        :deleteBtn="falseType"
        :show-line="falseType"
        :defaultExpandAll="falseType"
        moreBtn
        editBtn
        addBtn
    />-->
    <zi-tree
      class="org-edit-content"
      ref="roleTree"
      :props="defaultProps"
      :data="orgUserData"
      @select="select"
      @click-menu="clickMenu"
      :checkable="falseType"
      :deleteBtn="falseType"
      :show-line="falseType"
      :defaultExpandAll="defaultExpandAll"
      moreBtn
      editBtn
      addBtn
    />
    <org-member-picker ref="orgMemberPicker" :title="title" :showTab="showTab" :initialSelected="orgMemberRowId"
                       :showPicker="showMemberPicker" :multiple="multiple" :initialSelectedType="'cardUrl'"
                       @picked="getMemberPickedData"
                       @abort="onMemberPickAbort"></org-member-picker>
    <form-dialog
      ref="dialog1"
      v-model="show1"
      :title="operatingTitle"
      :showForm="true"
      :formAttrs="formAttrs1"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide">
    </form-dialog>
  </div>
</template>

<script>
  import {
    Group, Tab, TabItem, XButton
  } from 'vux';
  import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
  import ZingHead from "@/components/zingHead/ZingHead";
  import ZiTree from '@/components/zitree/ZiTree';
  import FormDialog from '@/components/formdialog/FormDialog';

  export default {
    name: "orgEdit",
    components: {
      Group,
      XButton,
      Tab,
      TabItem,
      ZingHead,
      ZiTree,
      OrgMemberPicker,
      FormDialog
    },
    directives: {
      //自定义标签属性
    },
    props: [
      'orgUserData', 'roleOrgData', 'cardUrl'
    ],
    data() {
      return {
        defTab: "基本信息",
        trigger: true,
        workShow: false,
        falseType: false,
        defaultExpandAll: true,
        moreBtn: true,
        showTab: ["org", "colleague"],
        title: "选择成员",
        multiple: false,
        showMemberPicker: false,
        orgMemberRowId: [],
        dialogMenus: ["编辑部门名称", "新建子部门", "删除部门", "设置部门领导"],
        dialogMenusLeaf: ["调部门", "离职"],
        id: '',
        type: '',
        text: '',
        parentId: '',
        upCardUrl: '',
        defaultProps: {
          title: "title",
          children: "children",
          src: "url",
          auth: "auth"
        },
        operatingTitle: '',
        show1: false,
        formAttrs1: [
          {
            type: 'text',
            placeholder: ''
          }
        ],
      }
    },
    //钩子加载完触发
    created: function () {
      let that = this
    },
    methods: {
      onCancel() {
        console.log('onCancel');
      },
      onShow() {
        console.log('onShow');
      },
      onConfirm(valList) {
        console.log(valList);
        let val = valList[0] || '';
        let that = this;
        let exp = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
        /*let exp = /[\u4E00-\u9FA5]/;*/
        if (!exp.test(val)) {
          that.$vux.toast.text("部门名称只可为汉字", "top");
          return;
        }
        let orgList = this.roleOrgData.org;
        let isRepeat = false;
        orgList.forEach(item => {
          if (item.value === val) {
            isRepeat = true;
          }
        });
        if (isRepeat) {
          that.$vux.toast.text("部门名称已存在", "top");
          return;
        }
        if (val && (val !== this.text)) {
          let url = '/zingbiz/auth/org/updateOneOrg';
          let params = {};
          if (this.type === 'upDate') {
            params.id = this.id;
            params.text = val;
            this.$http.post(url, params).then(res => {
              if (res.data.success) {
                that.$emit('on-updateOneOrg', res.data.data)
                that.$vux.toast.show({
                  text: "成功更新部门",
                  type: 'text',
                  position: 'default',
                })
              }
            })
          } else {
            url = '/zingbiz/auth/org/addDepartment';
            params.text = val;
            params.parentId = this.parentId;
            console.log(params);
            this.$http.post(url, params).then(res => {
              if (res.data.success) {
                that.$emit('on-addDepartment')
                that.$vux.toast.show({
                  text: "添加部门成功",
                  type: 'text',
                  position: 'default',
                  onHide() {
                    /*that.$emit('on-addDepartment')*/
                  }
                })
              }
            })
          }
        }
      },
      onHide() {
        console.log('onHide');
      },
      clickMenu(item) {
        console.log(item);
        let self = this;
        let data = item.params.node;
        if (data.isLeaf) {
          this.upCardUrl = data.source.cardUrl;
          this.$vux.actionsheet.show({
            menus: this.dialogMenusLeaf,
            onMenuClick(text, key) {
              self.dialogMenuLeafClick(key);
              this.show = false;
            }
          });
        } else {
          this.id = data.source.id;
          this.text = data.title;
          this.parentId = data.source.id;
          this.$vux.actionsheet.show({
            menus: this.dialogMenus,
            onMenuClick(text, key) {
              self.dialogMenuClick(key);
              this.show = false;
            }
          });
        }
      },
      select(data) {
        console.log(data);
        let selected, arr
        arr = data.selectedNodes
        if (data.node.selected) {
          this.$refs.roleTree.filterSelect(arr, 'id')
        } else {
          this.$refs.roleTree.clearSelect()
        }
      },
      getMemberPickedData(data) { //获取部门领导数据
        console.log(data);
        this.showMemberPicker = false;
        if (this.showTab[0] === "org") {
          this.updateCardUserById(data);
        } else if (this.showTab[0] === "colleague") {
          this.updateCommonTreeDetail(data);
        }
      },
      onMemberPickAbort() { //隐藏组织机构人员页面
        this.showMemberPicker = false;
      },
      dialogMenuLeafClick(index) {
        switch (index) {
          case 0:
            this.transferDepartment();
            break;
          default:
            this.QuitPrompt();
        }
      },
      dialogMenuClick(index) {
        switch (index) {
          case 0:
            this.editDepartmentName();
            break;
          case 1:
            this.addSonDepartment();
            break;
          case 2:
            this.delDepartment();
            break;
          default:
            this.departmentLeader();
        }
      },
      editDepartmentName(val) {
        this.show1 = true;
        this.operatingTitle = '编辑部门';
        this.type = 'upDate';
        this.formAttrs1[0].placeholder = this.text
        this.formAttrs1[0].isShowTitle = 'true'
        this.formAttrs1[0].title = '部门名称'
      },
      addSonDepartment() {
        this.show1 = true;
        this.operatingTitle = '新建子部门';
        this.type = 'addSon';
        this.formAttrs1[0].placeholder = '请输入部门名称';
        this.formAttrs1[0].isShowTitle = 'true'
        this.formAttrs1[0].title = '部门名称'
        console.log("addSonDepartment...........");
      },
      delDepartment() {
        const that = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '确定删除该部门吗？',
          onConfirm() {
            let url = '/zingbiz/auth/org/deleteDepartmentById';
            let params = {
              id: that.id
            };
            console.log(params);
            that.$http.post(url, params).then(res => {
              console.log(res);
              if (res.data.success) {
                that.$emit('on-deleteDepartment', that.id)
                that.$vux.toast.show({
                  text: "成功删除部门",
                  type: 'text',
                  position: 'default',
                })
              } else if (!res.data.success) {
                that.$vux.toast.show({
                  text: res.data.mgs,
                  type: 'text',
                  position: 'default',
                })
              }
            })
          }
        })
      },
      departmentLeader() {
        console.log("departmentLeader...........");
        this.$store.dispatch('updateTokenSeed')
        this.$refs.orgMemberPicker.initOrgRoleUser();
        this.showMemberPicker = true;
        this.multiple = false;
        this.showTab = ["colleague"];
        this.title = "选择成员";
      },
      transferDepartment() {
        console.log("transferDepartment...........");
        this.$store.dispatch('updateTokenSeed')
        this.$refs.orgMemberPicker.initOrgRoleUser();
        this.showMemberPicker = true;
        this.multiple = true;
        this.showTab = ["org"];
        this.title = "选择部门";
      },
      QuitPrompt() {
        console.log("QuitPrompt...........");
        let that = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '确定将该员工变为离职状态吗？',
          onShow() {
            console.log('plugin show')
          },
          onHide() {
            console.log('plugin hide')
          },
          onCancel() {
            console.log('plugin cancel')
          },
          onConfirm() {
            console.log('plugin confirm')
            that.Quit();
          }
        })
      },
      Quit() {
        console.log("Quit...........");
        console.log(this.cardUrl);
        console.log(this.upCardUrl);

        let curCardUrl = this.cardUrl
        let turnoverCardUrl = this.upCardUrl
        if (curCardUrl === turnoverCardUrl) {
          this.$vux.toast.text("用户不能给自己离职！", 'bottom')
          return false
        }
        let _this = this
        let url = "/zingbiz/hrManager/EmployeeTurnover/turnover"
        let params = {
          cardUrl: turnoverCardUrl
        }
        this.$http.post(url, params).then(res => {
          console.log(res);
          if (res.data.success) {
            _this.$emit('on-addDepartment');
            _this.$emit('on-getQuitEmployeeData');
            this.$vux.toast.show({
              text: "离职成功！",
              type: "success",
            })
          } else {
            this.$vux.toast.show({
              text: '离职失败',
              type: 'text',
              position: 'default'
            })
          }
        })
      },
      addDepartment(companyId) {
        this.show1 = true;
        this.operatingTitle = '新建部门';
        this.formAttrs1[0].placeholder = '部门名称';
        this.formAttrs1[0].isShowTitle = 'true'
        this.formAttrs1[0].title = '部门名称'
        this.type = 'add';
        this.parentId = companyId;
        console.log("addDepartment...........");
      },
      updateCommonTreeDetail(data) {
        console.log("updateCommonTreeDetail...........");
        let upleader = data[0];
        let url = "/zingbiz/auth/org/updateCommonTreeDetail";
        let params = {};
        /*params.rowId = upleader.rowId;*/
        params.rowId = this.id;
        params.orgLeader = upleader.cardUrl + "#" + upleader.userName;
        console.log(params);
        this.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              this.$vux.toast.show({
                text: '修改成功',
                type: 'text',
                position: 'default'
              })
            } else {
              this.$vux.toast.show({
                text: '修改失败',
                type: 'text',
                position: 'default'
              })
            }
          })
          .catch(err => {
            console.error(err);
          });
      },
      updateCardUserById(data) {
        console.log("updateCardUserById...........");
        let that = this;
        let orgIds = "";
        data.forEach(item => {
          orgIds += item.id + " "
        })
        if (orgIds.length > 0) {
          orgIds = orgIds.substr(0, orgIds.length - 1);
        }
        console.log(data);
        let url = "/zingbiz/auth/user/updateCardUserById";
        let params = {};
        params.upCardUrl = this.upCardUrl;
        params.orgIds = orgIds;
        console.log(params);
        this.$http
          .post(url, params)
          .then(res => {
            if (res.data.success) {
              that.$emit('on-addDepartment');
              that.$vux.toast.show({
                text: "调部门成功",
                type: 'text',
                position: 'default',
              })
            } else {
              this.$vux.toast.show({
                text: '调部门失败',
                type: 'text',
                position: 'default'
              })
            }
          })
          .catch(err => {
            console.error(err);
          });
      },
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
    .org-edit-head
      flex-shrink 0
    .org-edit-content
      flex-grow 1
      overflow-y auto

  /*.vux-actionsheet
      .weui-skin_android
          .weui-actionsheet
              width: 100%;
              padding-left: 30px;
              padding-right: 30px;*/

</style>
