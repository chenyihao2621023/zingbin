<template>
    <el-container>
        <el-main>
            <p class="main-title" style="font-size: 20px">房态图颜色配置</p>
            <el-form class="form">
                <el-row>
                    <el-col :span="6" :offset="2">
                    <el-form-item label="空净房">
                        <el-color-picker
                            :predefine="initColor"
                            show-alpha
                            v-model="findColor('115').configValue"></el-color-picker>
                    </el-form-item>
                </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="住净房">
                            <el-color-picker :predefine="initColor"
                             show-alpha
                                v-model="findColor('117').configValue">
                            </el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="住脏房">
                            <el-color-picker  show-alpha :predefine="initColor"
                                v-model="findColor('118').configValue">
                            </el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="空脏房">
                            <el-color-picker   show-alpha :predefine="initColor"
                                v-model="findColor('116').configValue">
                            </el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="预订房">
                            <el-color-picker   show-alpha :predefine="initColor"
                                v-model="findColor('119').configValue">
                            </el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="维修房">
                            <el-color-picker   show-alpha  :predefine="initColor" v-model="findColor('120').configValue">
                            </el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="2">
                        <el-form-item label="锁定房">
                    <el-color-picker  
                                     show-alpha :predefine="initColor"
                                     v-model="findColor('121').configValue">
                    </el-color-picker>
                </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="16">
                        <el-button v-show="!hasConfigList" type="primary" @click="submitColorConfig">提交</el-button>
                        <el-button v-show="hasConfigList" type="primary" @click="submitColorConfig">修改</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>

    </el-container>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      hasConfigList: false,
      oldConfig: [
        { configCode: "115", configValue: "#FFFFFF" },
        { configCode: "116", configValue: "#C9C9C9" },
        { configCode: "117", configValue: "#40AFFC" },
        { configCode: "118", configValue: "#996600" },
        { configCode: "119", configValue: "#18C34D" },
        { configCode: "120", configValue: "#D81E06" },
        { configCode: "121", configValue: "#88147F" }
      ],

      predefineColors: [
        { configCode: "115", configValue: "#FFFFFF" },
        { configCode: "116", configValue: "#C9C9C9" },
        { configCode: "117", configValue: "#40AFFC" },
        { configCode: "118", configValue: "#996600" },
        { configCode: "119", configValue: "#18C34D" },
        { configCode: "120", configValue: "#D81E06" },
        { configCode: "121", configValue: "#88147F" }
      ],
      initColor: [
        "#FFFFFF",
        "#C9C9C9",
        "#40AFFC",
        "#996600",
        "#18C34D",
        "#D81E06",
        "#88147F"
      ]
    };
  },
  created() {
    this.loadColorConfig();
  },
  methods: {
    loadColorConfig() {
      let self = this;
      let url = "/zingbiz/hotel/hotelNew/getRoomStateConfigList";
      this.$http
        .get(url)
        .then(res => {
          if (res.data.length > 0) {
            console.log(res);

            self.hasConfigList = true;
            self.predefineColors = res.data;
          }
        })
        .catch(error => {
          self.$message({ type: "error", message: "请求数据失败，请重试" });
        });
    },
    submitColorConfig() {
      let self = this;
      let url = "/zingbiz/hotel/hotelNew/saveHotelConfigList";
      let params = this.predefineColors;
      this.$http
        .post(url, params)
        .then(res => {
          if (res.data.success) {
            self.$message({ type: "success", message: "保存成功" });
            this.loadColorConfig();
          } else {
            self.$message({ type: "error", message: "保存失败" });
          }
        })
        .catch(error => {
          self.$message({ type: "error", message: "保存失败" });
        });
    },
    findColor(code) {
      let thisConfig = _.find(this.predefineColors, config => {
        return config.configCode === code;
      });
      if (_.isUndefined(thisConfig) || thisConfig === null) {
        thisConfig = _.find(this.oldConfig, old => {
          return old.configCode === code;
        });
      }
      return thisConfig;
    }
  },
  computed: {},

  components: {}
};
</script>

<style scoped>
.form {
  margin: 20px 0;
}
</style>
