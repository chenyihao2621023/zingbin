
var change = 0;
var lineStatus;
var conferenceStatus = -1; //-1：默认摘机；0：通话；1：召集会议；2：会议
var transferFlag = -1; //转接标志
var muteFlag = -1; //静音标志
var debug = -1;
var callid;
var callSID = -1;

function msleep(milisecond) {
    var currentDate, beginDate = new Date();
    var beginHour, beginMinute, beginSecond, beginMs;
    var hourGaps, minuteGaps, secondGaps, msGaps, gaps;
    beginHour = beginDate.getHours();
    beginMinute = beginDate.getMinutes();
    beginSecond = beginDate.getSeconds();
    beginMs = beginDate.getMilliseconds();
    do {
        currentDate = new Date();
        hourGaps = currentDate.getHours() - beginHour;
        minuteGaps = currentDate.getMinutes() - beginMinute;
        secondGaps = currentDate.getSeconds() - beginSecond;
        msGaps = currentDate.getMilliseconds() - beginMs;
        //考虑进时进分进秒的特殊情况 
        if (hourGaps < 0)
            hourGaps += 24;
        gaps = hourGaps * 3600 + minuteGaps * 60 + secondGaps;
        gaps = gaps * 1000 + msGaps;
    } while (gaps < milisecond);
}

function sleep(obj, iMinSecond) {
    if (window.eventList == null)
        window.eventList = new Array();
    var ind = -1;
    for (var i = 0; i < window.eventList.length; i++) {
        if (window.eventList[i] == null) {
            window.eventList[i] = obj;
            ind = i;
            break;
        }
    }
    if (ind == -1) {
        ind = window.eventList.length;
        window.eventList[ind] = obj;
    }
    setTimeout("goOn(" + ind + ")", iMinSecond);
}

//通话时长
var se, elapseMinute = 0, elapseHour = 0, elapseSecond = 0;
var isTiming = false;
function goClock() {
    var showHour, showMinute, showSecond;
    if (elapseSecond > 0 && (elapseSecond % 60) === 0) {
        elapseMinute += 1; elapseSecond = 0;
    }
    if (elapseMinute > 0 && (elapseMinute % 60) === 0) {
        elapseHour += 1; elapseMinute = 0;
    }

    if (elapseHour >= 0 && elapseHour <= 9) {
        showHour = "0" + elapseHour;
    } else {
        showHour = elapseHour;
    }
    if (elapseMinute >= 0 && elapseMinute <= 9) {
        showMinute = "0" + elapseMinute;
    }
    else {
        showMinute = elapseMinute;
    }
    if (elapseSecond >= 0 && elapseSecond <= 9) {
        showSecond = "0" + elapseSecond;
    }
    else {
        showSecond = elapseSecond;
    }

    t = showHour + ":" + showMinute + ":" + showSecond;

    document.getElementById("CallDuration")[0].innerText = t;
    //    setcookie('timeDuration', t, 0.5);
    //    $("#timerMemo").val(t);
    elapseSecond += 1;
}

function fn_SetPhoneStatus(aiStatus) {
    switch (parseInt(aiStatus)) {
        case 0x40: 											//空闲
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            //document.getElementById("work_mode").disabled = false;
            if (transferFlag == 1) {//leon add, for huicong 2009-11-4
                document.getElementById("zxtransfer").value = "取消转接";
                document.getElementById("zxtransfer").disabled = false;
            }
            break;
        case 0x41: 										//摘机
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            //document.getElementById("transfer").disabled = true;
            if (transferFlag == 0) {
                document.getElementById("zxtransfer").value = "询问转接";
                document.getElementById("zxtransfer").disabled = true;
            } else if (transferFlag == 1) {
                document.getElementById("zxtransfer").value = "取消转接";
                document.getElementById("zxtransfer").disabled = false;
            } else {
                document.getElementById("zxtransfer").value = "询问转接";
                document.getElementById("zxtransfer").disabled = true;
            }

            if (iConference == 0) {
                document.getElementById("conference").value = "召集会议";
                document.getElementById("conference").disabled = false;
            }
            else if (iConference == 1) {
                document.getElementById("conference").value = "返回会议";
                document.getElementById("conference").disabled = false;
            }
            else if (iConference == 2) {
                document.getElementById("conference").value = "加入会议";
                document.getElementById("conference").disabled = false;

            } else {
                document.getElementById("conference").value = "召集会议";
                document.getElementById("conference").disabled = true;

            }

            break;
        case 0x42: 										//拨号中
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            break;
        case 0x43: 										//回铃
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            break;
        case 0x44: 										//异地应答
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            break;
        case 0x45: 										//通话
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").value = "保持";
            document.getElementById("hold").disabled = false;
            if (transferFlag == 1) {
                document.getElementById("zxtransfer").value = "确认转接";
            } else {
                document.getElementById("zxtransfer").value = "询问转接";
            }
            document.getElementById("zxtransfer").disabled = false;

            if (iConference == 1) {
                document.getElementById("conference").value = "加入会议";
            } else {
                document.getElementById("conference").value = "召集会议";
            }
            document.getElementById("conference").disabled = false;

            break;
        case 0x46: 										//被保留
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").value = "恢复";
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            //document.frames("flowFrame").document.getElementById("ivrTransfer").disabled  = true;
            break;
        case 0x47: 										//会议
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").value = "召集会议";
            /*
            if (iConference == 0 || iConference == -1){
                document.getElementById("conference").value = "召集会议";        			
            }
            else{
                document.getElementById("conference").value = "返回会议";        			
            } 
            */
            document.getElementById("conference").disabled = false;

            break;
        case 0x48: 										//等待会议
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x49: 										//转接
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x4A: 										//振铃
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x4B: 										//持线
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").value = "恢复";
            document.getElementById("hold").disabled = false;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;
            break;
        case 0x4C: 										//来电等待
            document.getElementById("answer").disabled = false;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x4D: 										//持线
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").value = "恢复";
            document.getElementById("hold").disabled = false;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x4E: 										//IVR
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").value = "保持";//leon add,2008-11-28
            document.getElementById("hold").disabled = false;
            document.getElementById("zxtransfer").disabled = false;
            document.getElementById("conference").disabled = false;

            break;
        case 0x4F: 										//忙音
            document.getElementById("answer").disabled = true;
            document.getElementById("hold").disabled = true;
            if (transferFlag == 1) {
                //document.getElementById("zxtransfer").value = "取消转接";
                document.getElementById("zxtransfer").disabled = true;
                document.getElementById("hangup").disabled = true;
            } else {
                document.getElementById("zxtransfer").value = "询问转接";
                document.getElementById("transfer").disabled = true;
                document.getElementById("hangup").disabled = false;
            }
            document.getElementById("conference").disabled = true;

            break;
        case 0x50: 										//外拨
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x51: 										//外拨
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x52: 										//临时状态，不刷新        
            break;
        case 0x53: 										//暂不使用  
            break;
        case 0x54: 										//通话
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = false;
            document.getElementById("zxtransfer").disabled = false;
            //leon delete, for huicong 2009-11-4
        	/*	if (transferFlag == 1){ 
        			document.getElementById("zxtransfer").value = "确认转接";
        		}else{
        			document.getElementById("zxtransfer").value = "取消转接";
        			
        		} */
            document.getElementById("conference").disabled = false;
            if (iConference == 1) {
                document.getElementById("conference").value = "加入会议";
            } else {
                document.getElementById("conference").value = "返回会议";

            }

            break;
        case 0x55: 										//来电
            document.getElementById("answer").disabled = false;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x56: 										//监听
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = false;
            document.getElementById("zxtransfer").disabled = false;
            document.getElementById("conference").disabled = false;

            break;
        case 0x57: 										//摘机
            document.getElementById("answer").disabled = false;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x58: 										//拨号
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x59: 										//其他        		
            break;
        case 0x5A: 										//外拨
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x5B: 										//来电
            document.getElementById("answer").disabled = false;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x5C: 										//其他        		
            break;
        case 0x5D: 										//其他        		
            break;
        case 0x5E: 										//来电
            document.getElementById("answer").disabled = false;
            document.getElementById("hangup").disabled = true;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x5F: 										//外拨
            document.getElementById("answer").disabled = true;
            document.getElementById("hangup").disabled = false;
            document.getElementById("hold").disabled = true;
            document.getElementById("zxtransfer").disabled = true;
            document.getElementById("conference").disabled = true;

            break;
        case 0x60: 										//其他        		
            break;
        case 0x61: 										//其他        		
            break;
            defalut:

            break;
    }

}

function getStatusString(status) {
    var ret;
    switch (status) {
        case -0x1:
            ret = "INVALID";
            break;
        case 0x40:
            ret = "空闲";
            break;
        case 0x41:
            ret = "摘机";
            break;
        case 0x42:
            ret = "拨号中";
            break;
        case 0x43:
            ret = "回铃";
            break;
        case 0x44:
            ret = "异地应答";
            break;
        case 0x45:
            ret = "通话";
            break;
        case 0x46:
            ret = "被保留";
            break;
        case 0x47:
            ret = "会议";
            break;
        case 0x48:
            ret = "等待会议";
            break;
        case 0x49:
            ret = "转接";
            break;
        case 0x4a:
            ret = "振铃";
            break;
        case 0x4b:
            ret = "持线";
            break;
        case 0x4c:
            ret = "来电等待";
            break;
        case 0x4d:
            ret = "持线";
            break;
        case 0x4e:
            ret = "IVR";
            break;
        case 0x4f:
            ret = "忙音";
            break;
        case 0x50:
            ret = "外拨";
            break;
        case 0x51:
            ret = "外拨";
            break;
        case 0x52:
            ret = "TEST";
            break;
        case 0x53:
            ret = "CONNECTING";
            break;
        case 0x54:
            ret = "通话";
            break;
        case 0x55:
            ret = "来电";
            break;
        case 0x56:
            ret = "监听";
            break;
        case 0x57:
            ret = "摘机";
            break;
        case 0x58:
            ret = "拨号";
            break;
        case 0x59:
            ret = "其他";
            break;
        case 0x5a:
            ret = "外拨";
            break;
        case 0x5b:
            ret = "来电";
            break;
        case 0x5c:
            ret = "RECPLAY";
            break;
        case 0x5d:
            ret = "RESERVED";
            break;
        case 0x5e:
            ret = "来电";
            break;
        case 0x5f:
            ret = "外拨";
            break;
        case 0x60:
            ret = "DCONNECTREQ";
            break;
        case 0x61:
            ret = "DCLOSE";
            break;
        case 0x62:
            ret = "ZSLEEPED";
            break;
        case 0x63:
            ret = "RESET1";
            break;
        case 0x64:
            ret = "RESET2";
            break;
        case 0x65:
            ret = "RESET3";
            break;
        case 0x66:
            ret = "CODEC_RESET1";
            break;
        case 0x67:
            ret = "CODEC_RESET2";
            break;
        case 0x68:
            ret = "CODEC_RESET3";
            break;
        case 0x69:
            ret = "WAITTRANS";
            break;
        case 0x6a:
            ret = "LOUTGO";
            break;
        case 0x6b:
            ret = "LINCOME";
            break;
        case 0x6c:
            ret = "LCONN";
            break;
        case 0x6d:
            ret = "VCONN";
            break;
        default:
            ret = "INVALID";
            break;
    }
    return ret;
}

function OnBtnTest() {
    alert(DAgent1.GetRecordFileName());
}

function Login() {
    servIP = document.getElementById("serverip").value;
    user1 = document.getElementById("user").value;
    passwd1 = document.getElementById("password").value;

    ret = DAgent1.Initial(servIP);
    ret = DAgent1.Login(user1, passwd1);
    /*
            if (ret == 0)
                alert("登陆成功!");
            else
                alert("登陆失败!");			
        */
    //DAgent1.SetAgentStatus(0);
}

function fn_logout() {
    ret = DAgent1.Logout();
    if (ret == 0) {
        alert("退出成功!");
        document.getElementById("Agentstatus").innerHTML = "状态: <font color='red'>" + "座席未登陆" + "</font>";
    }
    else
        alert("退出失败!");
}

function ConferenceCall() {
    target1 = document.getElementById("target").value;

    ret = DAgent1.ConferenceCall(target1);
    if (ret == 0)
        alert("成功!");
    else
        alert("失败!");
}

function SetlineMsg() {
    var1 = document.getElementById("variable1").value;
    msg = document.getElementById("message").value;
    //给ivr传随路数据
    ret = DAgent1.SetLineMessage(var1, msg);
    alert("var1=" + var1 + "；msg=" + msg);
    if (ret == 0)
        alert("发送成功!");
    else
        alert("发送失败!");
}

function GetlineMsg() {
    var msg
    var1 = document.getElementById("variable1").value;
    msg = DAgent1.GetLineMessage(var1);

    if (msg != "") {
        document.getElementById("LineMessages").innerHTML = msg;
        alert("接收消息成功!\n" + msg);
    }
    else
        alert("接收消息失败!");
}

function DoneMsg() {
    user1 = document.getElementById("user").value;

    ret = DAgent1.DoneMessage();

    if (ret == 0)
        alert("成功!\n");
    else
        alert("失败!");
}

function GetCallingNumber() {
    var calling = DAgent1.GetCallingNumber();
    alert(calling);
}

function GetCalledNumber() {
    var calling = DAgent1.GetCalledNumber();
    alert(calling);
}

function GetPeerNumber() {
    var calling = DAgent1.GetPeerNumber();
    alert(calling);
}

function SetAgentReady() {
    DAgent1.SetAgentStatus(0);
}

function SetAgentRest() {
    DAgent1.SetAgentStatus(1);
}

function SetAgentDelay() {
    DAgent1.SetAgentStatus(2);
}

function SetAgentBusy() {
    DAgent1.SetAgentStatus(3);
}

function AgentReject() {
    iConference = -1;
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.HangUp();
}

function SetMUTE() {
    if (window.document.DAgent1 == null) {
        return;
    }
    var comm = document.getElementById("MUTE").value;
    if (comm == "静音") {
        window.document.DAgent1.SetLineMessage("IPKEY", "MUTE");
        document.getElementById("MUTE").value = "取消静音";
        muteFlag = 1;
    } else if (comm == "取消静音") {
        window.document.DAgent1.SetLineMessage("IPKEY", "MUTE");
        document.getElementById("MUTE").value = "静音";
        //		document.getElementById("MUTE").disabled = true;
        muteFlag = 0;
    }
}

function SetKey(key) {
    window.document.DAgent1.SetLineMessage("IPKEY", key);
    if (key == "POUND") {
        key = "#";
    }
    Calc.Input.value += key;
}

function GetAgentInfo() {
    if (window.document.DAgent1 == null) {
        return;
    }
    var AgentInfo = DAgent1.GetAgentInfo();
    alert(AgentInfo);
}

function GetAgentWaitingMsg() {
    if (window.document.DAgent1 == null) {
        return;
    }
    target1 = document.getElementById("target").value;
    var msg = DAgent1.GetAgentWaitingMsg(target1);
    alert(msg);
}

function GetAgentWaitingMsgNum() {
    if (window.document.DAgent1 == null) {
        return;
    }
    target1 = document.getElementById("target").value;
    var msg = DAgent1.GetAgentWaitingMsgNum(target1);
    alert(msg);
}

function ConferenceFlag() {
    if (window.document.DAgent1 == null) {
        return;
    }

    var msg = DAgent1.GetConfFlag();
    if (msg == 0)
        alert("坐席不在会议中");
    else if (msg == 1)
        alert("坐席在会议中");
    else
        alert("坐席会议标识未知" + msg);
}

function SetCalledNumber() {
    //电话咨询转接时，会使用到
    DAgent1.SetCalledNumber("501");
}

function GetCallSessionID() {
    var callSID = DAgent1.GetCallSessionID();
    document.getElementById("Csessionid").innerHTML = "<font color='red'>" + callSID + "</font>";
    alert(callSID);
}

function GetAgentChannel() {
    var AgentChannel = DAgent1.GetAgentChannel();
    alert("坐席通道号为：" + AgentChannel);
}

function GetAgentSRNIP() {
    var AgentSRNIP = DAgent1.GetAgentSRNIP();
    alert("坐席通道号为：" + AgentSRNIP);
}

function GetChannelInfo() {
    var AgentSRNIP = DAgent1.GetAgentSRNIP();
    var AgentChannel = DAgent1.GetAgentChannel();
    alert("坐席分机信息为,IP:" + AgentSRNIP + "通道号：" + AgentChannel);
    var ChannelInfo = DAgent1.GetChannelInfo(AgentSRNIP, AgentChannel); //接口已取消2012/11/08
    alert(ChannelInfo);
}

function startclock() {
    if (isTiming === false) {
        se = setInterval("goClock()", 1000);
        isTiming = true;
    }
}

function pauseclock() { clearInterval(se); }

function stopclock() {
    if (isTiming === true) {
        clearInterval(se); elapseMinute = elapseHour = elapseSecond = 0;
        isTiming = false;
    }
}

function fn_HandleEvent(curStatus, preStatus) {
    try {
        if (document.getElementById("status") != null) {
            var temp = getStatusString(curStatus);
            document.getElementById("status").innerHTML = "<font color='red'>" + temp + "</font>";
        }
        isStatusC = false;
        liStatus = curStatus;
        fn_SetPhoneStatus(curStatus);
        if (ivr_flow_flag == 1)
            fn_SetIvrTransferStatus(curStatus);
        if (soft_dial_flag == 1)
            fn_SetDialStatus(curStatus);
        if (curStatus == 0x4C && bAutoAnswer) {
            fn_answer();
        }

        if (curStatus == 0x41) {
            if (window.document.DAgent1.GetConfFlag() == 1) {//leon delete "&& iConference == 1", 2010-01-07 for can not return conference.
                document.getElementById("conference").value = "返回会议";
                document.getElementById("conference").disabled = false;
            } else {
                document.getElementById("conference").value = "召集会议";
                document.getElementById("conference").disabled = true;
            }
        }

        fn_dowith_incomingcall(curStatus);

        if ((curStatus == 0x4a && preStatus != 0x4a) || (curStatus == 0x4c && preStatus != 0x4c) || (curStatus == 0x5b && preStatus != 0x5b)) {
            //fn_incoming_call();
            fn_display_workpage();
            if (set_ivr_var_flag == 1) {
                fn_display_ivr_var_content();
            }
        }
        if (curStatus == 0x40 || curStatus == 0x41) {
            if (set_ivr_var_flag == 1) {
                fn_clear_ivr_data_display();
            }
        }
        if ((curStatus == 0x45) && (preStatus != 0x45)) {
            fn_transfer_record_file_name();
        }
    } catch (e) {
        if (debug > 0) {
            alert("name: " + e.name +
                "message: " + e.message +
                "lineNumber: " + e.lineNumber +
                "fileName: " + e.fileName +
                "stack: " + e.stack);
        }
    }
}

function TransferToIVR() {
    ivr = document.getElementById("IVRname").value;
    node = document.getElementById("IVRnode").value;
    if (ivr == null || node == null || ivr.length == 0 || node.length == 0) {
        alert("IVR流程和节点名都不能为空!");
        return;
    }
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.TransferToIVR(ivr, node);
}

function TransferToEXT() { //2016-10-28 设置分机呼转
    t_ext = document.getElementById("Trans_ext").value;
    if (t_ext == null || t_ext.length == 0) {
        alert("设置呼转分机不能为空!");
        return;
    }
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.AutoTransferA2a(t_ext);
}

function SetCustomer(callSID) {  //2016-10-28 设置客户信息
    var callid = document.getElementById("Csessionid1").value;
    info1 = document.getElementById("C_name").value;
    info2 = document.getElementById("C_gov").value;
    if (callid == null || callid.length == 0) {
        alert("请对sessionid框进行赋值");
        return;
    } else {
        alert("callSID=" + callid);
    }
    if (info1 == null || info1.length == 0) {
        alert("设置客户名称不能为空!");
        return;
    }
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.SetCustomerInfo(callid, info1, info2);
}

function GetSgQueue() {  //2016-10-28 获取坐席技能组排队信息
    var msg
    var1 = document.getElementById("user").value;
    msg = DAgent1.GetAgentSgQueue(var1);

    if (msg != "") {
        document.getElementById("GetSGQueueInfo").innerHTML = msg;
        alert("接收消息成功!\n" + msg);
    }
    else
        alert("接收消息失败!");
}

function fn_transfer() { //2014-10-09 transfer()接口方法取消
    if (window.document.DAgent1 == null) {
        return;
    }

    var phone = document.getElementById("PhoneNumber").value;
    var skillgroup = document.getElementById("SkillGroup").value;
    if (phone.length == 0 && skillgroup.length == 0) {
        alert("转接号码不能为空!");
        return;
    }
    if (phone.length != 0 && skillgroup.length != 0) {
        alert("转接号码和转接技能组不能同时选择!");
        return;
    }

    if (window.document.DAgent1 == null) {
        return;
    }
    if (phone != "") {
        var ret = window.document.DAgent1.transfer(phone);
        alert("转接失败1111");
    } else {
        var ret = window.document.DAgent1.transfer(skillgroup);
        alert("转接失败2222");
    }
    if (ret != 0) {
        alert("转接失败");
    }
}
function fn_zixun_transfer() {
    if (window.document.DAgent1 == null) {
        return;
    }

    var comm = document.getElementById("zxtransfer").value;

    if (comm == "询问转接") {
        var phone = document.getElementById("PhoneNumber").value;
        var skillgroup = document.getElementById("skillgroup").value;
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
        transferFlag = 1;
    } else if (comm == "确认转接") {
        window.document.DAgent1.ConsultTransfer();
        window.document.DAgent1.EnterConference();
        transferFlag = 0;
        window.setTimeout("fn_hangup()", 1000);
    } else if (comm == "取消转接") {
        window.document.DAgent1.ConsultTransfer();
        window.document.DAgent1.EnterConference();
        if (liStatus == 0x41) {
            document.getElementById("zxtransfer").value = "询问转接";
            document.getElementById("zxtransfer").disabled = true;
        }
        transferFlag = 0;
    }

    /*
    if (phone != "") {
        var ret = window.document.DAgent1.transfer(phone);
    } else {
        var ret = window.document.DAgent1.transfer(skillgroup);
    }
    if (ret != 0) {
        alert("转接失败");
    }
    */
}

function dial_time_out() {
    if (isStatusC && document.getElementById("dial").disabled) {
        document.getElementById("dial").disabled = false;
        isStatusC = false;
    }
}

function fn_leave_conference() {
    var comm = document.getElementById("conference").value;
    if (window.document.DAgent1 == null) {
        return;
    }
    if (comm == "召集会议") {
        window.document.DAgent1.LeaveConference();
        iConference = 1;
    } else if (comm == "返回会议") {
        window.document.DAgent1.EnterConference();
        iConference = 0;
    } else if (comm == "加入会议") {
        window.document.DAgent1.EnterConference();
        iConference = 0;
    }
}

function fn_dial() {
    var phone = document.getElementById("PhoneNumber").value;
    if (phone.length == 0) {
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
    DAgent1.dial(phone);
    isStatusC = true;
    window.setTimeout('dial_time_out()', 2000);
}

function fn_answer() {
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.answer();
    //	window.setTimeout("fn_answer1()",200);
}

function fn_answer1() {
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.answer();
}

function fn_hangup() {
    iConference = -1;
    if (window.document.DAgent1 == null) {
        return;
    }
    window.document.DAgent1.HangUp();
    document.getElementById("setOutcallResult").disabled = true;
}

function fn_hold() {
    var comm = document.getElementById("hold").value;
    if (window.document.DAgent1 == null) {
        return;
    }
    if (comm == '保持') {
        window.document.DAgent1.Hold();
    }
    else {
        window.document.DAgent1.Resume();
    }
}

function fn_force_switch_status(special_event) {
    var mode = -1;
    if (window.document.DAgent1 == null) {
        return;
    }
    try {
        if (special_event == 2 || special_event == 3) {
            if (special_event == 2) {
                mode = 3;
            } else if (special_event == 3) {
                mode = 0;
            }
            var ret = window.document.DAgent1.SetAgentStatus(parseInt(mode));
            if (ret == 0) {
                var disp_workmode = "";
                if (mode == 3) {
                    disp_workmode = "临时签退";
                } else if (mode == 0) {
                    disp_workmode = "就绪";
                }
                var opt = new Option(disp_workmode, mode, true, true);
                var s = document.getElementById('work_mode');
                s.options[mode] = opt;
                currWorkMode = mode;
            }
        }
    } catch (e) {

    }
}

// 2016-08-18 增加外线挂断事件测试
function fn_HandleSpecialEvent(special_event) {
    try {
        var msg = "";
        var ret = 0;
        if (special_event == 1) {
            fn_logout();
            //window.document.DAgent1.Logout();
            //parent.location.href="<%=request.getContextPath()%>";
            alert("该座席已经被强制签出,细节请咨询班长席!");
            ret = 1;
        }
        else if (special_event == 2 || special_event == 3) {
            fn_force_switch_status(special_event);
            ret = 1;
        }
        else if (special_event == 6) {
            alert("控件触发AgentSpecEvent 6,外线接通");
            ret = 1;
        }
        else if (special_event == 7) {
            alert("控件触发AgentSpecEvent 7,外线振铃");
            ret = 1;
        }
        else if (special_event == 8) {
            alert("控件触发AgentSpecEvent 8,外线挂断");
            ret = 1;
        }

        return ret;
    } catch (e) { }
}

function fn_OutdialEvent(event) {
    var image = "";
    if (event == 1) {
        alert("控件触发OutdialEvent ,锁坐席外呼");
    }

}


