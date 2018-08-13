<template>

  <div class="type-manage-add">
    <zing-head v-bind:title="title">

    </zing-head>
    <el-form :model="classValidateForm" label-width="100px" :rules="rules" ref="classValidateForm" style="margin-top:10px;">
      <el-form-item label="分类名称" prop="cl_Name">
        <el-input v-model="classValidateForm.cl_Name"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="cl_Sort">
        <el-input v-model="classValidateForm.cl_Sort"></el-input>
      </el-form-item>
    </el-form>
    <x-button class="btn-save" @click.native="subBtnForm('classValidateForm')">保存</x-button>
  </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead.vue";
import { XInput, Group, XButton, Cell, Toast } from "vux";
export default {
  name: "addClass",
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    ZingHead,
    Toast
  },
  data() {
    return {
      classType: "",
      orderFileId: "",
      title: "新建分类",
      cl_Name: "",
      cl_Sort: "",
      formType: "",
      items: [],
      addMessage: "",
      classValidateForm: { invoice: false },
      rules: {
        cl_Name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        cl_Sort: [
          { required: true, message: "请输入分类顺序", trigger: "blur" },
          {
            min: 1,
            max: 3,
            message: "只允许输入1~999的整数！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    console.log(this.$route.query.sort);
    this.classType = this.$route.query.classType;
    this.formType = this.$route.query.router;
    this.title = this.formType == "add" ? "新建分类" : "修改分类";
    this.rowId = this.$route.query.rowId;
    if (this.$route.query.sort != undefined) {
      this.classValidateForm.cl_Sort = this.$route.query.sort;
    }
    if (this.$route.query.name != undefined) {
      this.classValidateForm.cl_Name = this.$route.query.name;
    }
  },
  methods: {
    callBackR() {
      this.$router.push({
        path: "/classmain",
        query: {
          classType: this.classType
        }
      });
    },
    subBtnForm(formName) {
      let self = this;
      console.log(formName);
      self.$refs[formName].validate(valid => {
        if (valid) {
          if (self.formType == "add") {
            let url =
              "/ZingMH/ZDesk/MENHUWX/MHServiceN/addNewType.action?tags=" +
              self.classValidateForm.cl_Name +
              "&sordId=" +
              self.classValidateForm.cl_Sort +
              "&tagType=" +
              self.classType;
            self.$http
              .post(url)
              .then(function(response) {
                console.log(response);
                if (response.data.success == true) {
                  self.$message({ message: "添加成功", type: "success" });
                  self.callBackR();
                } else {
                  self.$message({
                    message: response.data.msg,
                    type: "success"
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else if (self.formType == "edit") {
            self.$http
              .post(
                "/ZingMH/ZDesk/MENHUWX/MHServiceN/updateNewType.action?tags=" +
                  self.classValidateForm.cl_Name +
                  "&sordId=" +
                  self.classValidateForm.cl_Sort +
                  "&tagType=" +
                  self.classType +
                  "&rowId=" +
                  self.rowId
              )
              .then(function(response) {
                console.log(response);
                if (response.data.success == true) {
                  self.$message({ message: "修改成功", type: "success" });
                  self.callBackR();
                } else {
                  self.$message({
                    message: response.data.msg,
                    type: "success"
                  });
                }
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.type-manage-add {
  height: 100%;
  overflow-y: auto;

  >div:last-child {
    margin-bottom: 20px;
  }

  .weui-cells {
    margin-top: 0;
  }
}
</style>