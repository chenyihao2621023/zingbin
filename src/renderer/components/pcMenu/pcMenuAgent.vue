<template>
    <div style="position: relative">
        <el-header style="background:#fff">
            <OBJECT ID="DAgent1" style="position:absolute;top:-200px"
                    CLASSID="CLSID:C3E9E351-88B2-462A-8035-55522CB2A8D8" CODEBASE="agent.cab#version=1,0,23,0"
                    width="900" height="66">
                <param name="_Version" value="65536">
                <param name="_ExtentX" value="23813">
                <param name="_ExtentY" value="1588">
                <param name="_StockProps" value="0">
            </OBJECT>
            <ul>
                <li class="nav-agent-li">
                    <el-button v-if="!loginSucces" style="width:58px;height:58px;" class="agent-button" @click="loginDialog = true">
                        <i class="icon iconfont icon-denglu agent-icon"></i>
                        <div class="agent-button-text">登录</div>
                    </el-button>
                    <el-button v-else style="width:68px;height:58px;" @click="logout">
                        <i class="icon iconfont icon-084tuichu agent-icon"></i>

                    </el-button>
                </li>
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="openWorkListNav">
                        <i class="icon iconfont icon-xiewrite18 agent-icon"></i>
                        <div class="agent-button-text" style="margin-left: -5px;">客服工单</div>
                    </el-button>
                </li>
                <!-- <li class="nav-agent-li">
                    <el-dropdown @command="action">
                        <el-button style="width:58px;height:58px;" class="agent-button">
                            <i class="icon iconfont icon-drxx48 agent-icon"></i>
                            <div class="agent-button-text">坐席</div>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="就绪">就绪</el-dropdown-item>
                            <el-dropdown-item command="未就绪">未就绪</el-dropdown-item>
                            <el-dropdown-item command="话务整理">话务整理</el-dropdown-item>
                            <el-dropdown-item command="临时签退">临时签退</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li> -->
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="IvrDialog = true">
                        <i class="icon iconfont icon-IVR agent-icon"></i>
                        <div class="agent-button-text">IVR</div>
                    </el-button>
                </li>
                <!-- 召集(会议) 应答才能召集？-->
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="zhaoji" :disabled="btnStatus.zhaojiBtn">
                        <i class="icon iconfont icon-meeting agent-icon"></i>
                        <div class="agent-button-text">会议</div>
                    </el-button>
                </li>
                <!-- 转接 -->
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="zhaojiDialog = true" :disabled="btnStatus.zhuanjieBtn">
                        <i class="icon iconfont icon-zhuanjie agent-icon"></i>
                        <div class="agent-button-text">转接</div>
                        <!-- 转接 找不到event -->
                    </el-button>
                </li>
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="baochi('保持')" :disabled="btnStatus.baochiBtn">
                        <i v-if="holdStatus === '保持'" class="icon iconfont icon-baochi agent-icon"></i>
                        <div v-if="holdStatus === '保持'" class="agent-button-text">保持</div>
                        <i v-else>恢复</i>
                        <div v-if="holdStatus === '恢复'" class="agent-button-text">恢复</div>
                    </el-button>
                </li>
                <li class="nav-agent-li">
                    <el-button style="width:60px;height:58px;" @click="answer" :disabled="btnStatus.answerBtn">
                        <i class="icon iconfont icon-jieting agent-icon"></i>
                        <div class="agent-button-text">接听</div>
                    </el-button>
                </li>
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="guaji" :disabled="btnStatus.guajiBtn">
                        <i class="icon iconfont icon-guaji agent-icon"></i>
                        <div class="agent-button-text">挂断</div>
                    </el-button>
                </li>
                <li class="nav-agent-li">
                    <el-button style="width:58px;height:58px;" class="agent-button" @click="bohao">

                        <i class="icon iconfont icon-dianhuazhengzaibohao agent-icon"></i>
                        <div class="agent-button-text">拨号</div>
                    </el-button>
                </li>

                <li style="width:150px;height:60px;float:right;margin-right:5px;position: relative;top: 10px">
                    <el-input v-model="bohaoNumber" placeholder="请输入呼叫号码"></el-input>
                </li>
                <li style="width:150px;height:60px;float:right;margin-right:5px;position: relative;top: 10px ">
                    <el-input v-model="agentCall.caller" placeholder="来电号码"></el-input>
                </li>
                <li style="width:230px;height:60px;float:right;margin-right:5px；;position: relative;top: 11px">
                    坐席状态 ：<el-select v-model="agentCallStatus"  @change="action" placeholder="请选择" style="width:110px">
                                <el-option

                                v-for="item in agentCallStatusArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                     <!-- {{agentCallStatus}} -->
                </li>
                <li style="width:100px;height:60px;float:right;margin-right:5px;position: relative;top: 22px">
                    坐席名称 ：
                    <div v-if="loginSucces" style="color:red">{{agent.user}}</div>
                </li>
            </ul>
        </el-header>

        <el-dialog
            title="登录"
            :visible.sync="loginDialog"
            width="30%"
            @keyup.enter.native="login"
            center>
            <el-form ref="loginFrom" :model="form" label-width="80px">
                <el-form-item label="serverip">
                    <el-input v-model="agent.servIp"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="agent.user"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input v-model="agent.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="loginDialog = false">取 消</el-button>
            <el-button type="primary" @click="login">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
            title="转接IVR"
            :visible.sync="IvrDialog"
            width="30%"
            center>
            <el-form ref="IvrFrom" :model="IvrForm" label-width="80px">
                <el-form-item label="IVR名称">
                    <el-input v-model="agent.IVRname"></el-input>
                </el-form-item>
                <el-form-item label="IVR节点">
                    <el-input v-model="agent.IVRnode"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="IvrDialog = false">取 消</el-button>
            <el-button type="primary" @click="IVR">确 定</el-button>
        </span>
        </el-dialog>


        <el-dialog
            title="转接"
            :visible.sync="zhaojiDialog"
            width="30%"
            center>
            <el-form ref="zixunFrom" :model="zixunForm" label-width="80px">
                <el-form-item label="转接号码">
                    <el-input v-model="agent.PhoneNumber"></el-input>
                </el-form-item>
                <el-form-item label="技能组">
                    <el-input v-model="agent.SkillGroup"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="zhaojiDialog = false">取 消</el-button>
            <el-button type="primary" @click="zhuanjie">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog title="电话客服工单" :visible.sync="workListDialog" width="40%" center>
            <el-form ref="sheetForm" :model="sheetForm" label-width="80px">
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="工单编号">
                            <el-input v-model="sheetForm.rowId" disabled placeholder="自动生成、累加"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="工单时间">
                            <el-date-picker disabled v-model="sheetForm.sheetTime" type="date" value-format="yyyy-MM-dd" :picker-options="disableTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="座席编号">
                            <el-input disabled v-model="sheetForm.seatNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="客户名称" prop="customerName" :rules="{ required: true, message: '请选择或创建客户名称！', trigger: 'blur' }">
                            <el-input v-model="sheetForm.customerName" @focus="showCustormerList"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="相关任务">
                            <el-input disabled v-model="sheetForm.relatedTask" placeholder="暂时不实现"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="客户电话" prop="caller" :rules="{ required: true, message: '请填写客户手机号！', trigger: 'blur' }">
                            <el-input v-model="sheetForm.caller"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="语音记录">
                            <i class="icon iconfont icon-yuyin2 agent-icon" @click="playAudio"></i>
                            <audio id="openAudio" controls
                                   name="MessageFromaudio" style="display: none; width: 0px; height: 0px;">
                                <!--<source src="http://www.qmenhu.com/checkJpg/group/2018/03/28/1152223566298111.mp3?zIsCacheOnly=true" type="audio/mp3"/>-->
                                <source :src="'http://192.168.0.6/record_data'+audioData" type="audio/mp3"/>
                            </audio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="工单记录" prop="record" :rules="{ required: true, message: '请填写工单记录！', trigger: 'blur' }">
                    <el-input v-model="sheetForm.record" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入工单记录">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-show="showWorkListBtn" type="primary" @click="openAddMan">新建客户</el-button>
                <el-button type="primary" @click="openCustomerList">工单记录</el-button>
                <el-button v-show="showWorkListBtn" type="primary" @click="outerOps">外派任务</el-button>
                <el-button v-show="showWorkListBtn" type="primary" @click="subAndEnd('sheetForm')">提交并结束</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="customerTitle" :visible.sync="newCustomer" append-to-body>
            <el-form size="small" ref="form" :model="form" v-loading="loading" :label-position="'right'"
                     label-width="100px" class="demo-dynamic">
                <el-row style="margin-bottom: 5px">
                    <el-col :span="formItemWidth">
                        <el-form-item label="姓名" prop="contactsName" :rules="[{ required: true, message: '请填写姓名！', trigger: 'blur' }]">
                            <el-input v-model="form.contactsName"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="form.gender">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手机" prop="telPhone" :rules="[{ required: true, message: '请填写手机号！', trigger: 'blur' }]">
                            <el-input v-model="form.telPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth" class="headImg">
                        <el-upload :limit="1" :visible.sync="dialogVisible"
                                   action="/zingbiz/common/UploadFile/uploadFile.action" list-type="picture-card"
                                   :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="固定电话" prop="landLine">
                            <el-input v-model="form.landLine"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="传真" prop="faxNo">
                            <el-input v-model.number="form.faxNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="证件类型" prop="idCardType">
                            <el-select v-model="form.idCardType" placeholder="请选择证件类型">
                                <el-option :label="card" :value="card" v-for="card in cardTypes" :key="card"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="证件号" prop="idCard">
                            <el-input v-model="form.idCard"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker v-model="form.birthday" :picker-options="disableTime" type="date"
                                            value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="国籍" prop="nationality">
                            <el-input v-model="form.nationality"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="民族" prop="nation">
                            <el-input v-model="form.nation"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="籍贯" prop="hometown">
                            <el-input v-model="form.hometown"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="微信" prop="weChat">
                            <el-input v-model="form.weChat"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="QQ" prop="qq">
                            <el-input v-model="form.qq"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="formItemWidth">
                        <el-form-item label="公司" prop="companyName">
                            <el-input v-model="form.companyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="车牌号" prop="plateNumber">
                            <el-input v-model="form.plateNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="formItemWidth">
                        <el-form-item label="爱好" prop="hobby">
                            <el-input v-model="form.hobby"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="formItemWidth">
                        <el-form-item label="特殊要求" prop="specialRequire">
                            <el-input v-model="form.specialRequire"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newCustomer = false">取 消</el-button>
                <el-button type="primary" @click="createList('form')">提交并创建工单</el-button>
            </div>
        </el-dialog>

        <el-dialog title="客服工单" :visible.sync="customerList" width="50%" append-to-body>
            <el-table :data="listOfWorkList" style="width: 100%">
                <el-table-column prop="customerName" label="客户名称" width="180"></el-table-column>
                <el-table-column prop="seatNumber" label="座席编号" width="180"></el-table-column>
                <el-table-column prop="sheetType" label="工单状态" :formatter="formatState"></el-table-column>
                <el-table-column prop="record" label="工单记录"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="lookCustomerList(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newWorkList">新建工单</el-button>
            </span>
        </el-dialog>
        <el-dialog title="客服列表" :visible.sync="customerServerList" width="50%">
            <el-row>
                <el-col :span="7">
                    <el-input clearable v-model="search_text" @keyup.enter.native="getContactsList" placeholder="查询: 姓名,电话" size="small" suffix-icon="el-icon-search"></el-input>
                </el-col>
                <el-col :span="3">
                    &nbsp;<el-button type="primary" size="small" @click="getContactsList">搜索</el-button>
                </el-col>
                <el-col :span="5" :offset="9">
                    <el-button type="primary" size="small" @click="openAddMan">新建客户</el-button>
                    <el-button type="primary" size="small" @click="openWorkList">客服工单</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="workListTable" style="width: 100%">
                <el-table-column label="姓名" prop="contactsName"></el-table-column>
                <el-table-column label="联系方式" prop="telPhone"></el-table-column>
                <el-table-column label="证件类型" prop="idCardType"></el-table-column>
                <el-table-column label="证件号" prop="idCard"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="selectCustomer(scope.row)">选择</el-button>
                        <el-button size="mini" type="text" @click="lookCustomer(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>


<script>
import _ from "lodash";
import ImagePicker from "components/imagepicker/ImagePicker";
import { dateFormat } from "../../utils/date";
export default {
  components: { ImagePicker },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginFrom.checkPass !== "") {
          this.$refs.loginFrom.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      formItemWidth: 10,
      agentStatus: window.AgentStatus,
      agentCall: { callSID: "", caller: "", called: "" },
      agentCallStatus: window.AgentCallStatus,
      holdStatus: "保持", // 可能存在  ‘恢复’  状态
      btnStatus: {
        answerBtn: true,
        guajiBtn: true,
        baochiBtn: true,
        zhuanjieBtn: true,
        zhaojiBtn: true,
        IVRBtn: true
      },
      agent: {
        servIp: "",
        user: "",
        password: [{ validator: validatePass, trigger: "blur" }],
        ret: null,
        IVRname: "",
        IVRnode: "",
        PhoneNumber: "",
        bohaoNumber: "",
        SkillGroup: "",
        /** ----- agent argument params ---- */
        change: 0,
        lineStatus: null,
        conferenceStatus: -1, //-1：默认摘机；0：通话；1：召集会议；2：会议
        transferFlag: -1, //转接标志
        muteFlag: -1, //静音标志
        debug: -1,
        callid: null,
        callSID: -1,
        iConference: null // 会议相关状态
        /** ----- --------------------- ---- */
      },
      agentCallStatusArr: [
        { label: "就绪", value: "就绪" },
        { label: "未就绪", value: "未就绪" },
        { label: "话务整理", value: "话务整理" },
        { label: "临时签退", value: "临时签退" }
      ],
      loginDialog: false,
      loginSucces: false,
      IvrDialog: false,
      zhaojiDialog: false,
      workListDialog: false,
      customerList: false,
      customerServerList: false,
      newCustomer: false,
      dialogVisible: false,
      listOfWorkList: [], //客户工单列表
      cardTypes: [
        "居民身份证",
        "户口薄",
        "港澳通行证",
        "台湾通行证",
        "护照",
        "驾驶证",
        "警官证",
        "军官证",
        "士兵证",
        "其他"
      ],
      form: {}, //外联人表单
      pageNumber: 1,
      pageSize: 100,
      workListTable: [], //客服工单
      search_text: "", //外联人搜索关键词
      sheetForm: {},
      customerTitle:"新建客户",
      showWorkListBtn:true,
      audioData:"",
        contactsInfo:{},
    };
  },
  created() {
//      window.document.DAgent1 = DAgent1
    let self = this;
    window.setInterval(() => {
      if (!_.isUndefined(window.AgentStatus)) {
        this.AgentStatus = window.AgentStatus;
      }
      if (!_.isUndefined(window.AgentCall)) {
        this.agentCall = window.AgentCall;
        this.$set(this.agentCall, "caller", window.AgentCall.caller);
        this.$set(this.sheetForm, "caller", window.AgentCall.caller)
      }
      //                console.log('来电号码 ：'+this.agentCall.caller);
      if (!_.isUndefined(window.AgentCallStatus)) {
        this.agentCallStatus = window.AgentCallStatus;
      }
      this.$set(this.sheetForm, "seatNumber", this.agent.user);

      // console.log(window.AgentStatus);
      switch (this.AgentStatus) {
        case 0x40: //空闲
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          //document.getElementById("work_mode").disabled = false;
          // if (transferFlag == 1) {
          //leon add, for huicong 2009-11-4
          // document.getElementById("zxtransfer").value = "取消转接";
          // document.getElementById("zxtransfer").disabled = false;
          // }
          break;
        case 0x41: //摘机
          // alert("摘机");
//          console.log(self.btnStatus);
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          //document.getElementById("transfer").disabled = true;
          // if (transferFlag == 0) {
          // document.getElementById("zxtransfer").value = "询问转接";
          // document.getElementById("zxtransfer").disabled = true;
          // } else if (transferFlag == 1) {
          // document.getElementById("zxtransfer").value = "取消转接";
          // document.getElementById("zxtransfer").disabled = false;
          // } else {
          // document.getElementById("zxtransfer").value = "询问转接";
          // document.getElementById("zxtransfer").disabled = true;
          // }

          // if (iConference == 0) {
          // document.getElementById("conference").value = "召集会议";
          // document.getElementById("conference").disabled = false;
          // } else if (iConference == 1) {
          // document.getElementById("conference").value = "返回会议";
          // document.getElementById("conference").disabled = false;
          // } else if (iConference == 2) {
          // document.getElementById("conference").value = "加入会议";
          // document.getElementById("conference").disabled = false;
          // } else {
          // document.getElementById("conference").value = "召集会议";
          // document.getElementById("conference").disabled = true;
          // }

          break;
        case 0x42: //拨号中
          // alert("拨号中");

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x43: //回铃
          // alert("回铃");

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x44: //异地应答
          // alert("异地应答");

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x45: //通话
          // alert("通话");
          // this.holdStatus = "保持";
          self.btnStatus.baochiBtn = false;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = false;
          self.btnStatus.zhaojiBtn = false;

          // if (transferFlag == 1) {
          // document.getElementById("zxtransfer").value = "确认转接";
          // } else {
          // document.getElementById("zxtransfer").value = "询问转接";
          // }
          // document.getElementById("zxtransfer").disabled = false;

          // if (iConference == 1) {
          // document.getElementById("conference").value = "加入会议";
          // } else {
          // document.getElementById("conference").value = "召集会议";
          // }
          // document.getElementById("conference").disabled = false;

          break;
        case 0x46: //被保留
          // alert("被保留");
          self.holdStatus = "恢复";

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          //document.frames("flowFrame").document.getElementById("ivrTransfer").disabled  = true;
          break;
        case 0x47: //会议
          // alert("会议");
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          // document.getElementById("conference").value = "召集会议";

          // document.getElementById("conference").disabled = true;

          break;
        case 0x48: //等待会议
          // alert("等待会议");

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x49: //转接
          // alert("转接");

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x4a: //振铃
          // alert("振铃");
          this.notification(
            "来电提醒",
            `来电号码 : ${window.AgentCall.caller}  将在5秒后关闭`
          );
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x4b: //持线
          // alert("持线");
          self.holdStatus = "恢复";
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          self.btnStatus.baochiBtn = false;
          break;
        case 0x4c: //来电等待
          // alert("来电等待");
//          console.log(self.btnStatus);
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = false;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;
          break;
        case 0x4d: //持线
          // alert("持线");
          self.btnStatus.baochiBtn = false;
          self.holdStatus = "恢复";
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;

          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x4e: //IVR
          // alert("IVR");
          //恢复- 》 保持
          self.holdStatus = "保持";
          self.btnStatus.baochiBtn = false;
          // 编程 恢复  增加恢复方法
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;

          self.btnStatus.zhuanjieBtn = false;
          self.btnStatus.zhaojiBtn = false;

          break;
        case 0x4f: //忙音
          // alert("忙音");
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.zhaojiBtn = true;

          //???????
          // if (transferFlag == 1) {
          //document.getElementById("zxtransfer").value = "取消转接";
          // document.getElementById("zxtransfer").disabled = true;
          // document.getElementById("hangup").disabled = true;
          // } else {
          // document.getElementById("zxtransfer").value = "询问转接";
          // document.getElementById("transfer").disabled = true;
          // document.getElementById("hangup").disabled = false;
          // }

          break;
        case 0x50: //外拨
          // alert("外拨");
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;

          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x51: //外拨
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = true;

          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x52: //临时状态，不刷新
          break;
        case 0x53: //暂不使用
          break;
        case 0x54: //通话
          // alert("通话");
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.baochiBtn = false;
          self.btnStatus.zhuanjieBtn = false;
          self.btnStatus.zhaojiBtn = false;

          // if (iConference == 1) {
          // document.getElementById("conference").value = "加入会议";
          // } else {
          // document.getElementById("conference").value = "返回会议";
          // }

          break;
        case 0x55: //来电
          // alert("来电");
          this.$message({ message: `来电号码 : ${window.AgentCall.caller} `, type: "success" });

          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = false;
          self.btnStatus.guajiBtn = true;

          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x56: //监听
          // alert("监听");
          self.btnStatus.baochiBtn = false;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = false;
          self.btnStatus.zhaojiBtn = false;

          break;
        case 0x57: //摘机
          // alert("摘机");
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = false;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x58: //拨号
          // alert("拨号");
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x59: //其他
          break;
        case 0x5a: //外拨
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x5b: //来电
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = false;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x5c: //其他
          break;
        case 0x5d: //其他
          break;
        case 0x5e: //来电
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = false;
          self.btnStatus.guajiBtn = true;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x5f: //外拨
          self.btnStatus.baochiBtn = true;
          self.btnStatus.answerBtn = true;
          self.btnStatus.guajiBtn = false;
          self.btnStatus.zhuanjieBtn = true;
          self.btnStatus.zhaojiBtn = true;

          break;
        case 0x60: //其他
          break;
        case 0x61: //其他
          break;
          defalut: break;
      }
    }, 1000);
  },
  methods: {
      formatState(row, column, cellValue) {
          if (row.sheetType === '0') {
              return '处理中';
          } else if (row.sheetType === '1') {
              return '已完成';
          }
      },
      //语音播放
      playAudio() {
          let obj = document.getElementById('openAudio');
          if (obj.paused) {
              try {
                  obj.play()
              } catch (e) {
                  console.error(e.message, e.stack)
              }
          } else {
              obj.pause();
              obj.currentTime = 0
          }
      },
      //新建工单
      newWorkList() {
          this.showWorkListBtn = true;
          this.customerList = false;
          this.sheetForm = {};
          this.sheetForm.caller = "";
          this.sheetForm.sheetTime = dateFormat(new Date(),"yyyy-MM-dd");
      },
      //查看客服工单详情
      lookCustomerList(row) {
          console.log('查看工单详情',row);
          this.customerList = false;
          this.workListDialog = true;
          this.sheetForm = {
              sheetNum:row,
              sheetTime:row.sheetTime,
              seatNumber:row.seatNumber,
              customerName:row.customerName,
              relatedTask:row.relatedTask,
              customerTel:row.customerTel,
              record:row.record,
              rowId:row.rowId
          };
          this.sheetForm.caller = row.customerTel;
          this.showWorkListBtn = false;
          this.audioData = row.fileName;
      },
      //客服列表查看人员详情
      lookCustomer(row) {
          this.newCustomer = true;
          this.customerTitle = "查看客户";
          this.form = {
              contactsName:row.contactsName,
              gender:row.gender,
              telPhone:row.telPhone,
              landLine:row.landLine,
              faxNo:row.faxNo,
              idCardType:row.idCardType,
              idCard:row.idCard,
              birthday:row.birthday,
              nationality:row.nationality,
              nation:row.nation,
              hometown:row.hometown,
              address:row.address,
              email:row.email,
              weChat:row.weChat,
              qq:row.qq,
              companyName:row.companyName,
              plateNumber:row.plateNumber,
              hobby:row.hobby,
              specialRequire:row.specialRequire
          }

      },
      //选择客服工单人员
      selectCustomer(row) {
          this.contactsInfo = row;
          this.$set(this.sheetForm, "customerName", row.contactsName);
          this.sheetForm.customerId = row.contactsId;
          this.customerServerList = false;
      },
      openWorkListNav () {
          this.workListDialog = true;
          this.showWorkListBtn = true;
          this.sheetForm.sheetTime = dateFormat(new Date(),"yyyy-MM-dd");
          if (this.agentCall.caller !== "") {
              let url = "/zingbiz/ExternalContacts/ExternalContactsRest/getContactsList";
              let params = {
                  pageNumber:this.pageNumber,
                  pageSize:this.pageSize
              };
              this.$http
                  .post(url,params)
                  .then((res) => {
                      res.data.data.data.forEach((item,index) => {
                          if (item.telPhone === this.agentCall.caller) {
                              this.$set(this.sheetForm, "customerName", item.contactsName);
                              this.sheetForm.customerId = this.contactsInfo.contactsId;
                          }
                      })
                  })
                  .catch(() => {
                      this.$message({ message: '人员查询失败', type: 'error' });
                  })
          } else {
              this.$message({ message: '人员未匹配到,请手动选择', type: 'warning' });
          }
      },
      openCustomerList () {
          this.customerList = true;
          let url = "/zingbiz/hotel/hotelWorkSheet/selSheet";
          let params = {
              pageNumber:this.pageNumber,
              pageSize:this.pageSize
          };
          this.$http
              .get(url,{ params:params })
              .then(res => {
                  if (res.data.success) {
                      this.listOfWorkList = res.data.data
                  }
              })
              .catch(() => {
                  this.$message({ message: '工单列表获取失败，请刷新重试！', type: 'error' });
              })
      },
      subAndEnd (formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  if (window.document.DAgent1 == null) {
                      return;
                  }
                  let url = "/zingbiz/hotel/hotelWorkSheet/insertSheet";
                  this.sheetForm.fileName = '/' + dateFormat(new Date(),"yyyyMMdd") + '/'+DAgent1.GetRecordFileName();
                  this.sheetForm.servIp = this.agent.servIp;
                  this.sheetForm.seatNumber = this.agent.user;
                  this.sheetForm.customerTel = this.agentCall.caller;
                  this.sheetForm.sheetType = "1";
                  this.sheetForm.customerId = this.contactsInfo.contactsId;
                  this.$http
                      .post(url, this.sheetForm)
                      .then((res) => {
                          if (res.data.success) {
                              this.workListDialog = false;
                              this.$message({ message: '创建成功！', type: 'success' });
                              this.sheetForm = {
                                  record:"",
                                  caller:"",
                                  customerName:""
                              };
                          }
                      })
                      .catch(() => {
                          this.$message({ message: '创建失败！', type: 'error' });
                      })
              }
          });
      },
      //客户名称，选择客户
      showCustormerList () {
          this.customerServerList = true;
          this.getContactsList();
      },
      //创建外联人
      createList (formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  if (Object.keys(this.form).length === 0) {
                      this.$message({message: '请填写表单信息！', type: 'warning'});
                      return
                  }
                  let url = "/zingbiz/ExternalContacts/ExternalContactsRest/addExternalContacts";
                  this.form.contactsType = "酒店客户";
                  this.$http
                      .post(url, this.form)
                      .then(res => {
                          if (res.data.success) {
                              this.$message({message: '创建成功！', type: 'success'});
                              this.newCustomer = false;
                              this.form = {};
                          }
                      })
                      .catch(() => {
                          this.$message({message: '创建失败，请重试', type: 'error'});
                          this.form = {};
                      })
              }
          })
      },
      //获取外联人列表
      getContactsList () {
          let url = "/zingbiz/ExternalContacts/ExternalContactsRest/getContactsList";
          let params = {
              pageNumber:this.pageNumber,
              pageSize:this.pageSize
          };
          if (this.search_text) {
              if (!Number.isNaN(Number(this.search_text))) {
                  params['telPhone'] = this.search_text;
              } else {
                  params['contactsName'] = this.search_text
              }
          }
          this.$http
              .post(url,params)
              .then((res) => {
                  this.workListTable = res.data.data.data
              })
              .catch(() => {
                  this.$message({ message: '外联人获取失败', type: 'error' });
              })
      },
    openWorkList() {
      this.customerServerList = false;
    },
    openAddMan() {
      this.newCustomer = true;
      this.form = {};
    },
    changeSelectBox(flag, item) {
      let tag = false; //判断是否已存在
      let num = 0; //所在的索引
      this.selectedData.forEach((val, index) => {
        if (val.contactsId === item.contactsId) {
          tag = true;
          num = index;
        }
      });
      if (flag) {
        if (!tag) this.selectedData.push(item);
      } else {
        if (tag) this.selectedData.splice(num, 1);
      }
    },
    outerOps() {
      this.$message({ message: "功能正在开发中，敬请期待！", type: "info" });
    },
    handlePictureCardPreview(file) {
      console.log("file", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log("remove", file, fileList);
      this.form.contactsPhoto = "";
    },
    login() {
      if (this.agent.servIp === "") this.agent.servIp = "192.168.2.31";
      this.agent.ret = DAgent1.Initial(this.agent.servIp);
      this.agent.ret = DAgent1.Login(this.agent.user, this.agent.password);

      if (this.agent.ret == 0) {
        this.loginSucces = true;
        alert("登陆成功!");
      } else {
        alert("登陆失败!");
      }
      this.loginDialog = false;
    },
    logout() {
      this.agent.ret = DAgent1.Logout();
      if (this.agent.ret == 0) {
        alert("退出成功!");
        this.loginSucces = false;
        this.agentCallStatus = "座席未登陆";
        // document.getElementById("Agentstatus").innerHTML =
        //   "状态: <font color='red'>" + "座席未登陆" + "</font>";
      } else alert("退出失败!");
    },
    IVR() {
      let ivr = this.agent.IVRname;
      let node = this.agent.IVRnode;
      if (ivr == null || node == null || ivr.length == 0 || node.length == 0) {
        alert("IVR流程和节点名都不能为空!");
        return;
      }
      if (window.document.DAgent1 == null) {
        return;
      }
      window.document.DAgent1.TransferToIVR(ivr, node);
      this.IvrDialog = false;
    },
    zhuanjie() {
      if (window.document.DAgent1 == null) {
        return;
      }

      //   var phone = this.bohaoNumber;
      var phone = this.agent.PhoneNumber;
      var skillgroup = this.agent.skillgroup;
      if (phone.length == 0) {
        alert("转接号码不能为空!");
        return;
      }

      var target = "";
      if (phone.length != 0) {
        target = phone;
      } else {
        target = skillgroup;
      }

      window.document.DAgent1.LeaveConference();
      msleep(500);
      window.document.DAgent1.dial(target);
      this.agent.transferFlag = 1;
    },
    baochi() {
      if (window.document.DAgent1 == null) {
        return;
      }
      console.log('当前hotelStatus状态 ： ' + this.holdStatus)
      console.log('当前Hold是否存在 ？ ： ' + window.document.DAgent1)
      if (this.holdStatus === "保持") {
        window.document.DAgent1.Hold();
      } else {
        window.document.DAgent1.Resume();
      }
    },
    guaji() {
      // iConference = -1;
      if (window.document.DAgent1 == null) {
        return;
      }
      window.document.DAgent1.HangUp();
      // document.getElementById("setOutcallResult").disabled = true;
    },
    answer() {
      if (window.document.DAgent1 == null) {
        return;
      }
      window.document.DAgent1.answer();
    },
    bohao() {
      var bohaoNumber = this.bohaoNumber;
      if (bohaoNumber === "") {
        alert("分机不能为空!");
        return;
      }

      if (window.document.DAgent1 == null) {
        alert("无法获取控件信息");
        return;
      }
      //document.getElementById("dial").disabled=true;
      //window.document.DAgent1.dial(phone);
      //alert("##################");
      DAgent1.dial(bohaoNumber);
      // isStatusC = true;
      // window.setTimeout('dial_time_out()',2000);
    },
    zhaoji() {
      window.document.DAgent1.LeaveConference();
      iConference = 1;
      this.zhaojiDialog = false;
    },

    action(status) {
      if (status === "就绪") {
        DAgent1.SetAgentStatus(0);
        this.agentCallStatus = "就绪";
      } else if (status === "未就绪") {
        DAgent1.SetAgentStatus(1);
        this.agentCallStatus = "未就绪";
      } else if (status === "话务整理") {
        DAgent1.SetAgentStatus(3);
        this.agentCallStatus = "话务整理";
      } else if (status === "临时签退") {
        DAgent1.SetAgentStatus(4);
        this.agentCallStatus = "临时签退";
      } else if (status === "MUTE") {
        let MUTE = document.getElementById("MUTE").innerHTML;

        if (window.document.DAgent1 == null) {
          return;
        }
        if (MUTE === "静音") {
          window.document.DAgent1.SetLineMessage("IPKEY", "MUTE");
          document.getElementById("MUTE").innerHTML = "取消静音";

          this.agent.muteFlag = 1;
        } else if (MUTE === "取消静音") {
          window.document.DAgent1.SetLineMessage("IPKEY", "MUTE");
          document.getElementById("MUTE").innerHTML = "静音";
          //		document.getElementById("MUTE").disabled = true;
          this.agent.muteFlag = 0;
        }
      } else if (status === "拒接") {
        this.iConference = -1;
        if (window.document.DAgent1 == null) {
          return;
        }
        window.document.DAgent1.HangUp();
      }
    }
  }
};
</script>
<style scoped lang="stylus">
.nav-agent-li {
    width: 60px;
    height: 60px;
    float: right;
    /* border-right: 1px solid #aaa; */
}

.agent-icon {
    font-size: 30px;
}

.el-dropdown {
    position: relative;
    left: 0px;
    top: 3px;
    z-index: 1050;
    display: block;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    -webkit-transition: all 0.1s ease;
    transition: all 0.1s ease;
}

.headImg {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
}

.agent-button-text {
    font-size: 10px;
    margin-top: 4px;
    margin-left: 4px;
}

.agent-button {
    width: 58px;
    height: 58px;
    padding-top: 6px;
    padding-left: 15px;
}
</style>
