<template>
    <div class="customField">
        <ZingHead title="工资项管理">
            <div slot="header-right">
                <span class="addfield" @click="addField()">新建</span>
            </div>
        </ZingHead>
        <div class="scroll-list-wrap">
            <div v-if="customFieldData.length > 0">
                <Scroll ref="scroll"
                 :data="customFieldData"
                 :scrollbar="true"
                 :startY="0">
                    <GridCard v-for="(item,index) in customFieldData" :key="index">
                        <div slot="cardLeft" class="left">
                            <div class="left-wrapper">
                                <p  v-if="item.fieldType == '0'" class="left-wrapper-title userName" style="color:#71C671;">{{item.fieldName}}</p>
                                <p  v-if="item.fieldType == '1'" class="left-wrapper-title userName" style="color:#D81E06;">{{item.fieldName}}</p>
                            </div>
                        </div>
                        <div slot="cardRight" class="right">
                            <i class="iconfont icon-gengduo" @click="selItem(item)"></i>
                            <p v-if="item.fieldStatus == '0'" class="wqy">未启用</p>
                            <p v-if="item.fieldStatus == '1'" class="yqy">已启用</p>                            
                        </div>
                    </GridCard>
                </Scroll>
            </div>
            <div v-else>
                <p class="noData">暂无工资项数据</p>
            </div>
        </div>
        <form-dialog
            ref="dialog1"
            v-model="formShow"
            :title="formTitle"
            :showForm="true"
            :formAttrs="formAttrs"
            @on-confirm="onConfirm"
          >
        </form-dialog>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import Scroll from "@/components/scroll/Scroll";
    import FormDialog from '@/components/formdialog/FormDialog';
    import {Group,Cell,XInput,PopupPicker,Flexbox, FlexboxItem,XButton,XDialog} from 'vux'
    const formAttrs = [{
                        title: '工资项名称',
                        type: 'text',
                        placeholder: "请输入名称"
                    },{
                        title: '工资项属性',
                        type: 'select',
                        placeholder: "请选择属性",
                        options: ['增项','减项']
                    }];
    export default {
        name: "custom-field",
        components: {
            ZingHead,GridCard,Scroll,FormDialog,
            Group,Cell,XInput,PopupPicker,Flexbox, FlexboxItem,XButton,XDialog
        },
        data() {
            return {
               customFieldData:[],
               curItem:{},
               doName:"启用",

               //弹出框表单数据
               formShow:false,
               formAttrs:formAttrs,
               pageType:"add"

               
               

            }
        },
        created() {
            this.getCustomFieldList()
        },
        methods: {
            getCustomFieldList(){
                let url = "/zingbiz/hrManager/customField/getCustomFieldList"
                this.$http.post(url,{}).then(res => {
                    let retData = res.data.data
                    retData = retData.filter(obj => {
                      return obj.fieldStatus != "2"
                    })
                    this.customFieldData = retData
                })
            },
            addField() {
               this.formTitle = "新建工资项"
               this.pageType = "add"
               this.formShow = true
            },
            updateFieldStatus(params){
                let _this = this
                params.fieldStatus = this.curItem.fieldStatus
                params.rowId = this.curItem.rowId
                let url = "/zingbiz/hrManager/customField/updateCustomField"
                this.$http.post(url,params).then(res => {
                        this.$vux.toast.show({text:"修改成功！",type:"success",onHide () {
                            _this.getCustomFieldList()
                        }})
                })
            },
            addCustomField(params) {
                let _this = this
                params.fieldStatus = "1"
                let url = "/zingbiz/hrManager/customField/addCustomField"
                this.$http.post(url,params).then(res => {
                        if(res.data.data == "existence"){
                             this.$vux.toast.text("名称已存在!", 'bottom')
                        }else{
                            this.$vux.toast.show({text:"添加成功！",type:"success",onHide () {
                                _this.getCustomFieldList()
                            }})
                        }
                        
                })
            },
            onConfirm(valList){
                    if(valList[0] == undefined || valList[0] == ""){
                        this.$vux.toast.text("名称不能为空!", 'bottom')
                        return
                    }
                    if(valList[1] == undefined || valList[1] == ""){
                        this.$vux.toast.text("请选择属性!", 'bottom')
                        return
                    }
                    let fieldName = valList[0]
                    let fieldType
                    if(valList[1] == "增项"){
                        fieldType = "1"
                    }else if(valList[1] == "减项"){
                        fieldType = "0"
                    }
                    let params = {
                        fieldName:fieldName,
                        fieldType:fieldType
                    }
                    if(this.pageType && this.pageType == "add"){
                        this.addCustomField(params)
                    }else if(this.pageType && this.pageType == "edit"){
                        this.updateFieldStatus(params)
                    }
            },
            selItem(item){
                let dialogMenus
                if(item.fieldStatus == '0'){
                    dialogMenus = ["启用","编辑","删除"]
                }else if(item.fieldStatus == '1'){
                    dialogMenus = ["禁用","编辑","删除"]
                }
                let _this = this
                this.$vux.actionsheet.show({
                        menus: dialogMenus,
                        onMenuClick(text, key) {
                            if(text == "启用"){
                                 _this.qyBtn(item)
                            }else if(text == "禁用"){
                                 _this.jyBtn(item)
                            }else if(text == "编辑"){
                                _this.editBtn(item)
                            }else if(text == "删除"){
                                _this.delBtn(item)
                            }
                            this.show = false;
                        }
                });
            },
            editBtn(item){
                this.formTitle = "编辑工资项"
                this.curItem = item
                this.pageType = "edit"
                let fieldTypeName
                if(item.fieldType == '0'){
                    fieldTypeName = "减项"
                }else if(item.fieldType == '1'){
                    fieldTypeName = "增项"
                }
                this.$nextTick(() => {
                    this.$refs.dialog1.setFormValues([item.fieldName,fieldTypeName])
                    this.formShow = true
                })
            },
            qyBtn(item){
                let _this = this
                let params = {
                    rowId:item.rowId,
                    fieldStatus:"1"
                }
                let url = "/zingbiz/hrManager/customField/updateCustomField"
                this.$http.post(url,params).then(res => {
                    this.customFieldData.forEach(obj =>{
                        if(item.rowId == obj.rowId){
                            obj.fieldStatus =  "1"
                        }
                        this.$vux.toast.show({text:"启用成功！",type:"success",onHide () {
                                _this.getCustomFieldList()
                        }})
                    })
                })
            },
            jyBtn(item){
                let _this = this
                let params = {
                    rowId:item.rowId,
                    fieldStatus:"0"
                }
                let url = "/zingbiz/hrManager/customField/updateCustomField"
                this.$http.post(url,params).then(res => {
                    this.customFieldData.forEach(obj =>{
                        this.$vux.toast.show({text:"禁用成功！",type:"success",onHide () {
                                _this.getCustomFieldList()
                        }})
                    })
                })
            },
            delBtn(item){
                let params = {
                    rowId:item.rowId,
                    fieldStatus:"2"
                }
                let url = "/zingbiz/hrManager/customField/updateCustomField"
                this.$http.post(url,params).then(res => {
                    this.$vux.toast.show({text:"删除成功！",type:"success",onHide () {}})
                    this.customFieldData = this.customFieldData.filter(obj => {
                          return item.rowId !== obj.rowId
                    })
                })
            }
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .customField{
         height 100%;
    }
    .content{
        height calc(100% - 50px);
    }
    .edit {
        min-height: 40px;
        line-height: 40px;
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        margin-top: 15px;
    }
    .addfield{
        display inline-block
        padding-right 10px
        color #428BCA
    }
    .yqy{
        color: #17c295;
        background-color:#dcf6ef;
        border-radius: 5px;
        width: 50px;
        height: 25px
        font-size: 13px;
        line-height: 25px;
        text-align: center;
    }
    .wqy{
        color: #f2725e;
        background-color:#fcdad4;
        border-radius: 5px;
        width: 50px;
        height: 25px
        font-size: 13px;
        line-height: 25px;
        text-align: center;

    }
    .right{
        webkit-box-flex: unsert;
        flex: unset;
    }
</style>
