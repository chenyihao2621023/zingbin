<template>
    <el-container>
        <el-main>
            <p style="font-size: 20px"> 酒店时间配置</p>
            <el-form class="form" labelWidth="300px">
                <el-form-item label="夜审时间">
                    <el-time-picker v-model="findValByCode('110').configValue"
                    value-format="HH:mm:ss"
                    :disabled="getDisabled('110')"
                                    ></el-time-picker>
                    <el-radio  v-model="findValByCode('110').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio   v-model="findValByCode('110').isStart" label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                <el-form-item label="退房提醒时间">
                  <!-- {{findValByCode('111')}} -->
                    <el-time-picker   v-model="findValByCode('111').configValue" value-format="HH:mm:ss" :disabled="getDisabled('111')"
                                     ></el-time-picker>
                    <el-radio    v-model="findValByCode('111').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio   v-model="findValByCode('111').isStart" label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                 <el-form-item label="退房时间">
                  <!-- {{findValByCode('122')}} -->
                    <el-time-picker   v-model="findValByCode('122').configValue" value-format="HH:mm:ss" :disabled="getDisabled('122')"
                                     ></el-time-picker>
                    <el-radio    v-model="findValByCode('122').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio   v-model="findValByCode('122').isStart" label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                <el-form-item label="订单作废时间">
                    <el-time-picker   v-model="findValByCode('112').configValue" value-format="HH:mm:ss" :disabled="getDisabled('112')"></el-time-picker>
                    <el-radio   v-model="findValByCode('112').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio  v-model="findValByCode('112').isStart"  label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                <el-form-item label="全天房当天入住当日退房">
                    <el-time-picker  v-model="findValByCode('113').configValue" value-format="HH:mm:ss" :disabled="getDisabled('113')"></el-time-picker>
                    <el-radio   v-model="findValByCode('113').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio    v-model="findValByCode('113').isStart" label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                <el-form-item label="住净房转住脏房时间">
                    <el-time-picker   v-model="findValByCode('114').configValue" value-format="HH:mm:ss" :disabled="getDisabled('114')"></el-time-picker>
                    <el-radio    v-model="findValByCode('114').isStart" label="1" style="margin-left: 20px">启用
                    </el-radio>
                    <el-radio    v-model="findValByCode('114').isStart" label="0" style="margin-left: 20px">禁用
                    </el-radio>
                </el-form-item>
                <el-row>
                    <el-col :span="2" :offset="16">
                        <el-button v-show="!hasConfigList"  @click="submitHotelConfig">提交</el-button>
                        <el-button v-show="hasConfigList" type="primary" @click="submitHotelConfig">修改</el-button>
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
      initDate: "00:00:00",
      hasConfigList: false,
      configList: [
        {
          rowId: "",
          configCode: "110", //夜审时间
          configValue: this.initDate, //如：12时12分
          isStart: "1" //1 启用 0 禁用
        },
        {
          rowId: "",
          configCode: "111", //夜审时间
          configValue: this.initDate, //如：12时12分
          isStart: "1" //1 启用 0 禁用
        },
        {
          rowId: "",
          configCode: "112", //夜审时间
          configValue: this.initDate, //如：12时12分
          isStart: "1" //1 启用 0 禁用
        },
        {
          rowId: "",
          configCode: "113", //夜审时间
          configValue: this.initDate, //如：12时12分
          isStart: "1" //1 启用 0 禁用
        },
        {
          rowId: "",
          configCode: "114", //夜审时间
          configValue: this.initDate, //如：12时12分
          isStart: "1" //1 启用 0 禁用
        }
      ]
    };
  },
  created: function() {
    this.loadHotelConfig(); //加载酒店配置信息
  },
  methods: {
    loadHotelConfig() {
      let url = "/zingbiz/hotel/hotelNew/getHotelConfigList";
      this.$httpSilent
        .get(url)
        .then(res => {
          if (res.data.length > 0) {
            this.hasConfigList = true;
            this.configList = res.data;
          } else {
            this.hasConfigList = false;
            for (i = 0; i < 6; i++) {
              this.configList.push({ isStart: false, configValue: "" });
            }
          }
          //这里需要按照code排序
        })
        .catch(error => {
          this.$message({ type: "error", message: "请求数据失败，请重试" });
        });
    },
    findValByCode(code) {
      let config = _.find(this.configList, config => {
        return config.configCode === code;
      });
      if (_.isUndefined(config) || config === null) {
        config = {
          isStart: "0",
          configValue: "",
          configCode: code,
          cardUrl: this.$store.state.ui.userInfo.cardUrl,
          companyId: this.$store.state.ui.userInfo.companyId
        };
        this.configList.push(config);
      }

      return config;
    },
    getDisabled(code) {
      let config = this.findValByCode(code);
      if (!config.isStart || config.isStart === "0") {
        return true;
      } else {
        return false;
      }
    },
    //提交酒店配置信息
    submitHotelConfig() {
      let self = this;
      let params = this.configList;
      let url = "/zingbiz/hotel/hotelNew/saveHotelTaskConfig";
      this.loadingInstance = this.$loading({});
      this.$httpSilent
        .post(url, params)
        .then(res => {
          this.loadingInstance.close();
          if (res.data.success) {
            self.$message({ type: "success", message: "保存成功" });
          } else {
            self.$message({ type: "error", message: "保存失败" });
          }
        })
        .catch(error => {
          self.$message({ type: "error", message: "保存失败" });
        });
    }
  }
};
</script>

<style>
</style>
