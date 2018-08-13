<template>
    <div id="otherSettingEdit" class="otherSettingEdit">
        <!--<x-header :left-options="{showBack: false}">{{ headTitle }}</x-header>-->
        <!--<zing-head :isShowQuery="true" :title="'新建其他应用'"></zing-head>
        <group label-align="justify" label-margin-right="2em" label-width="4.5em">
            <div class="headImgDiv">
                <x-img class="headImg" :src="headImgSrc"></x-img>
                &lt;!&ndash;<x-button mini plain>姓名</x-button>&ndash;&gt;
                <div class="nameDiv">{{bindName}}</div>
                <x-button mini class="confirmation">确定申请人信息正确，并指定用户角色及组织机构</x-button>
            </div>

            &lt;!&ndash;<cell value="value">姓名</cell>&ndash;&gt;
            <selector title="组织机构" v-model="org" :options="orgType" placeholder="请选择组织机构"></selector>
            <selector title="角色" v-model="role" :options="roleType" placeholder="请选择角色"></selector>
            <flexbox :gutter="0">
                <flexbox-item><x-button type="btn-common" class="noAdoptbtn" @click.native="noAdopt">绑定未通过</x-button></flexbox-item>
                <flexbox-item><x-button type="primary" class="adoptbtn" @click.native="adopt">绑定通过</x-button></flexbox-item>
            </flexbox>
        </group>
        <form-dialog
            ref="dialog1"
            v-model="showForm"
            :title="operatingTitle"
            :showForm="true"
            :formAttrs="formAttrs1"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>-->
        <div v-transfer-dom>
            <popup position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="'确定'" :title="'新建其他应用'" :show-bottom-border="false"
                              @on-click-left="addClazzModal = false" @on-click-right="confirmSubmit"></popup-header>
                <group gutter="0">
                    <x-input title="分类名称" placeholder="输入分类名称" v-model="editTarget.dinnerClazzName"></x-input>
                    <x-input title="显示顺序" mask="999999999" type="number" placeholder="只允许输入数字"
                             v-model="editTarget.clazzSort" @on-change="changeNum"></x-input>
                    <x-switch v-model="editTarget.isDiscount" title="是否可优惠"></x-switch>
                </group>
            </popup>
        </div>
    </div>
</template>


<script>
    import { PopupHeader,Popup,Selector,Flexbox, FlexboxItem,XImg ,XButton,XInput,Group,TransferDomDirective as TransferDom } from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog';

    export default {
        name: "otherSettingEdit",
        components: {
            PopupHeader,Popup,FormDialog,Selector,Flexbox, FlexboxItem,XImg,XButton,XInput,Group,ZingHead
        },
        directives: {
            //自定义标签属性
            TransferDom
        },
        data() {
            return {
                /*headImgSrc: "/JsLib/dist/app/images/defaultImgs/userDef_.jpg",*/
                headImgSrc: "./static/images/userDef_.jpg",
                multiple: false,
                bindName: "",
                org: "",
                role: "",
                orgType:[],
                roleType:[],
                operatingTitle:'绑定未通过原因',
                showForm:false,
                formAttrs1: [
                    {
                        type: 'text',
                        placeholder: ''
                    }
                ],
            }
        },
        //钩子加载完触发
        created() {
            this.getData();
            this.bindName = this.$route.query.bindName;
            this.cardUrl = this.$route.query.cardUrl;
            this.companyId = this.$route.query.companyId;
            this.headImgSrc = "/checkJpg/" + this.cardUrl.substr(0,2) + "/" + this.cardUrl + this.companyId + "Bind.jpg";
        },
        methods: {
            getData() {
                console.log("getOrgRoleUser .......");
                let self = this;
                let url = "/zingbiz/auth/org/getOrgRoleUser";
                let params = {};
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (!res.data.success) {
                            console.error("getOrgRoleUser error", res);
                            return;
                        }
                        let retData = res.data.data;
                        // 组织
                        self.orgType = self.handleOrg(retData.orgUserDatas);
                        // 角色
                        self.roleType = self.handleRole(retData.roleDatas);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            noAdopt() {
                this.showForm = true;
            },
            adopt() {
                console.log("绑定通过");
                let self = this;
                let url = "/zingbiz/hrManager/BindingAuditRest/saveBind";
                let params = {};
                params.loginPwd = "000000";
                params.companyId = self.$route.query.companyId;
                params.cardUrl = self.$route.query.cardUrl;
                params.role = self.role;
                params.orgId = self.org;
                params.bindFileName = self.headImgSrc;
                console.log(params);
                /*params.loginPwd = "000000";
                params.companyId = "company52589551100001";
                params.cardUrl = "JGQifkTAM9Vig70vSeXvpcfc";
                params.role = "52591759100001";
                params.orgId = "52591212100001";
                params.bindFileName = "/JsLib/dist/app/images/askBind/askBind.png";*/
                if (params.orgId === "") {
                    self.$vux.toast.text("请选择组织机构");
                    return;
                }
                if (params.role === "") {
                    self.$vux.toast.text("请选择角色");
                    return;
                }
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            this.$router.go(-1);
                            /*this.$router.push({
                                path: "/backstageManage/noBindingList",
                                query: {
                                    /!*cardUrl:self.$route.query.cardUrl,
                                    companyId:data.companyId,
                                    attestation:this.$route.query.attestation *!/
                                }
                            });*/
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            onCancel() {
                console.log('onCancel');
            },
            onShow() {
                console.log('onShow');
            },
            onConfirm(valList) {
                console.log(valList);
                let val = valList[0] || '';
                let self = this;
                if (val != undefined && val != null && val != "") {
                    let url = '/zingbiz/hrManager/BindingAuditRest/saveAskBind';
                    let params = {};
                    params.companyId = self.$route.query.companyId;
                    params.cardUrl = self.$route.query.cardUrl;
                    params.failMsg = val;
                    params.status = '1'; //管理员回绝绑定请求
                    console.log(params);
                    this.$http.post(url,params).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            self.showForm = false;
                            self.$router.push({
                                path: "/backstageManage/noBindingList",
                                query: {
                                    /*cardUrl:self.$route.query.cardUrl,
                                    companyId:data.companyId,
                                    attestation:this.$route.query.attestation */
                                }
                            });
                        }
                    })
                } else {
                    self.$vux.toast.text("未通过原因不能为空", "top");
                    return;
                }
            },
            onHide() {
                console.log('onHide');
            },
            handleOrg(orgDatas, _this) {
                for (let i = 0; i < orgDatas.length; i++) {
                    let roleData = orgDatas[i];
                    let role = {};
                    role.key = roleData["id"];
                    role.value = roleData["text"];
                    orgDatas[i] = role;
                }
                return orgDatas;
            },
            handleRole(roleDatas) {
                for (let i = 0; i < roleDatas.length; i++) {
                    let roleData = roleDatas[i];
                    let role = {};
                    role.key = roleData["roleInfoId"];
                    role.value = roleData["roleInfoName"];
                    roleDatas[i] = role;
                }
                return roleDatas;
            },
        }
    }
</script>

<style scoped>
    .headImgDiv {
        text-align:center;
    }
    .headImg {
        border: 1px solid #CCC;
        background-color: #FFF;
        padding: 4px;
        display: inline-block;
        width: 200px;
        height: 200px;
    }
    .nameDiv {
        padding: 4px;
    }
    .confirmation {
        color: #F2725E;
        background-color: #FCDAD4;
    }
    .noAdoptbtn {
        background-color: #4DA9EB;
    }
    .adoptbtn {
        background-color: #FF8000 ;
    }
</style>
