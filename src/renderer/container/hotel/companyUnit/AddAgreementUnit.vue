<template>
  <div class="dialog">
    <el-dialog title="新增协议单位" :visible.sync="visible" :before-close="handleClose" width="40%" append-to-body>
      <el-form :model="agreeUnitData" :rules="rules" ref="agreeUnitData" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="agreeUnitName">
              <el-input v-model="agreeUnitData.agreeUnitName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号" prop="contractNumber">
              <el-input v-model="agreeUnitData.contractNumber" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="agreeUnitData.linkman" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="agreeUnitData.telephone" type="number"
                        onkeypress="return !(/^1[3456789]\d{9}$/.test(String.fromCharCode(event.keyCode)))"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传真" prop="unitFAX">
              <el-input v-model="agreeUnitData.unitFAX" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="unitPC">
              <el-input v-model="agreeUnitData.unitPC" type="number" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="unitADD">
          <el-input v-model="agreeUnitData.unitADD" size="small"></el-input>
        </el-form-item>
        <el-form-item label="生效日期">
          <el-col :span="10">
            <el-form-item prop="startTime">
              <el-date-picker type="date" size="small" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"
                              v-model="agreeUnitData.startTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="text-align: center" :span="2">-</el-col>
          <el-col :span="12">
            <el-form-item prop="endTime">
              <el-date-picker type="date" size="small" :picker-options="disableTime" value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="结束日期" v-model="agreeUnitData.endTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行帐号" prop="bankAccount">
              <el-input v-model="agreeUnitData.bankAccount" type="number" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科目" prop="explorerName">
              <el-input placeholder="请选择科目" @focus="selectSubject" size="small"
                        v-model="agreeUnitData.explorerName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="comments">
          <el-input type="textarea" v-model="agreeUnitData.comments" size="small"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售员">
              <el-input placeholder="请选择销售员" @focus="selectUser" size="small" v-model="agreeUnitData.soler"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-checkbox v-model="isAgreementUnit" label="是否启用" @change="isEnable"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm('agreeUnitData')" size="small">提交</el-button>
        <el-button @click="handleClose" size="small">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 组件引用集 -->
    <div>
      <subject-picker :showPicker="showSubject" @picked="getSubjectData" @abort="showSubject = false"></subject-picker>
      <org-member-picker :showTab="showTab" :initialSelected="[]" :showPicker="showOrgSelectModal"
                         :multiple="false" @picked="okSelectMember"
                         @abort="showOrgSelectModal=false"></org-member-picker>
    </div>

  </div>
</template>

<script>
  import SubjectPicker from '@/components/subjectpicker/SubjectPicker';
  import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";

  export default {
    components: {
      SubjectPicker,
      OrgMemberPicker
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        visible: false,
        showSubject: false,  //科目选择组件
        showOrgSelectModal: false,   //选人组件
        showTab: ["colleague"],   //选人组件tab显示
        agreeUnitData: {
          agreeState: "1"
        },
        isAgreementUnit: false,   //是否启用协议单位
        AgreementUnitForm: {},
        rules: {
          agreeUnitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
          contractNumber: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
          linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
          telephone: [{ required: true, message: '请输入正确的电话号码', trigger: 'blur' }],
          explorerName: [{ required: true, message: '请选择科目', trigger: 'blur' }],
//          unitPC: [{ type: 'number', message: '请输入正确的邮政编号', trigger: ['blur', 'change'] }]
        },
      }
    },
    watch: {
      show: function (isShow) {
        this.visible = isShow;
        if (isShow) {
          this.agreeUnitData = Object.assign({}, this.data);
        } else {
          this.$refs.agreeUnitData.resetFields();
        }
      },
    },
    methods: {
      submitAddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = "/zingbiz/hotel/hotelAgreeUnitService/addAgreeUnitId";
            this.loadingInstance = this.$loading({});
            this.$httpSilent
              .post(url, this.agreeUnitData)
              .then(() => {
                this.loadingInstance.close();
                this.$message({ type: "success", message: "保存成功" });
                this.$emit("confirm", true);
              })
              .catch(() => {
                this.loadingInstance.close();
                this.$message({ type: "error", message: "提交失败，请重试！" })
              })
          }
        })
      },
      isEnable(state) {
        if (state) {
          this.agreeUnitData.agreeState = "0";
        } else {
          this.agreeUnitData.agreeState = "1";
        }
      },
      selectSubject() {
        this.showSubject = true;
      },
      getSubjectData(pickedData) {
        this.agreeUnitData.explorerName = pickedData.text;
        this.showSubject = false;
      },
      selectUser() {
        this.showOrgSelectModal = true;
      },
      okSelectMember(list) {
        this.agreeUnitData.soler = list[0].userName;
        this.showOrgSelectModal = false;
      },
      handleClose() {
        this.agreeUnitData = {
          agreeState: "1"
        };
        this.isAgreementUnit = false;
        this.$emit("cancel", false);
      },
    }
  }
</script>
<style scoped>

</style>
