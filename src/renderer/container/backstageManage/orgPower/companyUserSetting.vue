<template>
  <div id="companyUserSetting" class="companyUserSetting">
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
      class="user-setting-content"
      ref="roleTree"
      :props="defaultProps"
      :data="roleUserData"
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
    <form-dialog
      ref="dialog1"
      v-model="show1"
      :title="operatingTitle"
      :showForm="true"
      :formAttrs="formAttrs1"
      @on-confirm="onConfirm"
    >
    </form-dialog>
    <form-dialog
      ref="dialog4"
      v-model="show4"
      title="角色设置"
      :showForm="true"
      :formAttrs="formAttrs4"
      @on-confirm="confirmRole"
    >
    </form-dialog>
  </div>
</template>

<script>
  import {
    Group, Tab, TabItem, XButton
  } from 'vux';
  import ZingHead from "@/components/zingHead/ZingHead";
  import ZiTree from '@/components/zitree/ZiTree';
  import FormDialog from '@/components/formdialog/FormDialog';

  export default {
    name: "companyUserSetting",
    components: {
      Group,
      XButton,
      Tab,
      TabItem,
      ZingHead,
      ZiTree,
      FormDialog
    },
    directives: {
      //自定义标签属性
    },
    props: [
      'roleUserData', 'roleOrgData', 'companyId'
    ],
    data() {
      return {
        defTab: "基本信息",
        trigger: true,
        workShow: false,
        falseType: false,
        defaultExpandAll: true,
        moreBtn: true,
        multiple: false,
        showMemberPicker: false,
        orgMemberRowId: [],
        dialogMenus: ["权限", "编辑", "删除"],
        defaultProps: {
          title: "title",
          children: "children",
          src: "url",
          auth: "auth"
        },
        show1: false,
        operatingTitle: '',
        operatingType: '',
        formAttrs1: [
          {
            title: '角色',
            type: 'text',
            placeholder: ''
          },
          {
            title: '描述',
            type: 'text',
            placeholder: ''
          }
        ],
        show4: false,
        roleInfoId: '',
        roleInfoName: '',
        roleInfoDesc: ''
      }
    },
    computed: {
      formAttrs4() {
        let {role} = this.roleOrgData;
        let roleObj = {
          title: '角色',
          type: 'select',
          isShowTitle: 'true',
          placeholder: '角色',
          options: role ? role : []
        };
        return [roleObj]
      }
    },
    //钩子加载完触发
    created: function () {
      let that = this
      console.log(this.roleOrgData)
    },
    methods: {
      clickMenu(item) {
        console.log(item);
        let self = this;
        let data = item.params.node;
        if (data.isLeaf) {
          let initialVals = [];
          initialVals[0] = data.roleInfoId;
          self.$refs.dialog4.setFormValues(initialVals)
          self.show4 = true;
          self.upCardUrl = data.cardUrl;
          console.log(this.roleOrgData);
        } else {
          self.roleInfoId = data.roleInfoId;
          self.roleInfoName = data.roleInfoName;
          self.roleInfoDesc = data.roleInfoDesc;
          this.$vux.actionsheet.show({
            menus: this.dialogMenus,
            onMenuClick(text, key) {
              self.dialogMenuClick(key);
              this.show = false;
            }
          });
        }
      },
      openDialog(data) {
        console.log(data);
        this.showMemberPicker = true;
      },
      confirmSubmit() {
        let self = this;
        let url = "";
        console.log("confirmSubmit");
        this.evaluationModal = false;
      },
      select(data) {
        let selected, arr
        arr = data.selectedNodes
        if (data.node.selected) {
          this.$refs.roleTree.filterSelect(arr, 'id')
        } else {
          this.$refs.roleTree.clearSelect()
        }
      },
      dialogMenuClick(index) {
        switch (index) {
          case 0:
            this.power();
            break;
          case 1:
            this.editRole();
            break;
          default:
            this.delRole();
        }
      },

      power() {
        console.log("power...........");
        let self = this;
        self.$router.push({
          path: "/backstageManage/powerChoose",
          query: {
            cardUrl: self.$route.query.cardUrl,
            roleInfoId: self.roleInfoId,
            roleInfoName: self.roleInfoName,
            /*companyId:data.companyId,*/
          }
        });
      },

      editRole() {
        this.operatingTitle = '编辑角色'
        this.show1 = true;
        this.operatingType = 'upDate';
        this.formAttrs1[0].placeholder = this.roleInfoName;
        this.formAttrs1[1].placeholder = this.roleInfoDesc;
      },

      onConfirm(valList) {
        if (Array.isArray(valList) && valList.length > 0) {
          let that = this;
          let roleInfoName = valList[0] || this.roleInfoName;
          let roleInfoDesc = valList[1] || this.roleInfoDesc;
          console.log(roleInfoName, roleInfoDesc);
          let exp = /^[\u4e00-\u9fa5]+$/;
          /*let exp = /[\u4E00-\u9FA5]/;*/
          if (!exp.test(roleInfoName)) {
            that.$vux.toast.text("角色名称只可为汉字", "top");
            return;
          }
          let roleList = this.roleOrgData.role;
          let isRepeat = false;
          roleList.forEach(item => {
            if (item.value === roleInfoName) {
              isRepeat = true;
            }
          });
          if (isRepeat) {
            that.$vux.toast.text("角色名称已存在", "top");
            return;
          }
          let urlOperating;
          let params = {
            roleInfoName, roleInfoDesc
          };
          if (this.operatingType === 'upDate') {
            urlOperating = '/zingbiz/auth/role/updateOneRole';
            params.roleInfoId = this.roleInfoId;
            this.$http.post(urlOperating, params).then(res => {
              if (res.data.success && (Object.keys(res.data.ret).length > 0)) {
                that.$emit('on-upDateItemRole', res.data.ret)
                this.$vux.toast.show({
                  text: "成功更新角色信息",
                  type: 'text',
                  position: 'default',
                })
              } else {
                this.$vux.toast.show({
                  text: "更新角色信息失败",
                  type: 'text',
                  position: 'default',
                })
              }
            })
          } else if (this.operatingType === 'add') {
            urlOperating = '/zingbiz/auth/role/addOneRole';
            this.$http.post(urlOperating, params).then(res => {
              console.log(res);
              if (res.data.success && (Object.keys(res.data.ret).length > 0)) {
                that.$emit('on-addItemRole', res.data.ret)
                this.$vux.toast.show({
                  text: "添加角色成功",
                  type: 'text',
                  position: 'default',
                  /*onHide() {
                      that.$emit('on-addItemRole',res.data.ret)
                  }*/
                })
              } else {
                this.$vux.toast.show({
                  text: "添加角色失败",
                  type: 'text',
                  position: 'default',
                })
              }
            });
          }
        }
      },
      delRole() {
        const that = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '确定删除该角色吗？',
          onConfirm() {
            let url = '/zingbiz/auth/role/delOneRole';
            let params = {
              roleInfoId: that.roleInfoId
            };
            that.$http.post(url, params).then(res => {
              if (res.data.retcode === 0) {
                that.$emit('on-removeItemRole', that.roleInfoId)
                that.$vux.toast.show({
                  text: "成功删除角色",
                  type: 'text',
                  position: 'default',
                })
              } else if (res.data.retcode === -2) {
                that.$vux.toast.show({
                  text: "该角色不能删除",
                  type: 'text',
                  position: 'default',
                })
              }
            })
          }
        })
      },

      addRole() {
        this.formAttrs1[0].placeholder = '角色名称';
        this.formAttrs1[0].redDot = true
        this.formAttrs1[1].placeholder = '角色描述';
        this.operatingTitle = '新建角色';
        this.show1 = true;
        this.operatingType = 'add';
      },
      confirmRole(valList) {
        if (Array.isArray(valList) && valList.length > 0) {
          let roleCode = valList[0];
          console.log(roleCode);
          let params = {
            roleCode,
            upCardUrl: this.upCardUrl,
            companyId: this.companyId
          };
          let that = this;
          let url = '/zingbiz/auth/user/updateCardUserById';
          this.$http.post(url, params).then(res => {
            console.log(res);
            if (res) {
              that.$emit('on-updateCardUserById')
              this.$vux.toast.show({
                text: "角色修改成功",
                type: 'text',
                position: 'default',
              })
            } else {
              this.$vux.toast.show({
                text: "角色修改失败",
                type: 'text',
                position: 'default',
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/variable.styl';

  .companyUserSetting
    display flex
    flex-direction column
    width 100%
    height 100%
    .user-setting-head
      flex-shrink 0
    .user-setting-content
      flex-grow 1
      overflow-y auto

</style>
