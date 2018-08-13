 <template>
    <div class="tjReport">
        <zing-head title="查询考勤报表"></zing-head>
        <group  label-margin-right="2em" label-align="left">
               <popup-picker title="报表类型" :data="reportType" v-model="selReport" placeholder="请选择报表类型"></popup-picker>
               <datetime   :min-year="1900" format = "YYYY-MM-DD" v-model="startDate" @on-change="startChange" placeholder="请选择开始时间">
                   <span slot="title">开始时间</span>
               </datetime>
               <datetime   :min-year="1900" format = "YYYY-MM-DD" v-model="endDate" @on-change="endChange" placeholder="请选择结束时间">
                   <span slot="title">结束时间</span>
               </datetime>
               <cell title="查询范围" is-link  @click.native="selectUser" value="请选择范围"></cell>
        </group>
        <tag-group :items="attenUserList"></tag-group>
        <div style="padding: 13px;">
            <p class="messInfo">1, 按照查询条件查询。</p>
            <p class="messInfo">2, 手机端只支持在线预览,如需下载,请在电脑上使用该功能。</p>
            <p class="messInfo">3, 查询范围包含，人员.组织.部门。</p>
        </div>
        <flexbox :gutter="0" style="position: absolute;bottom: 0px;">
                   <flexbox-item>
                       <x-button type="warn btn-common" @click.native="showReport">查询报表</x-button>
                   </flexbox-item>
        </flexbox>
        <!-- 选人组件 -->
        <org-member-picker ref="picker"
                :showPicker="showPersonPicker"
                :showTab ="showTab"
                @picked="onPicked"
                @abort="onPickAbort">
        </org-member-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import TagGroup from "components/taggroup/TagGroup";
    import {Group,XButton,Flexbox,FlexboxItem,Datetime,PopupPicker,Cell} from 'vux'
    export default {
        name: "tjReport",
        components: {
            ZingHead,OrgMemberPicker,TagGroup,
            Group,XButton,Flexbox,FlexboxItem,Datetime,PopupPicker,Cell
        },
        directives: {
            //自定义标签属性

        },
        data() {
            return {
                reportType:[['日统计', '月统计']],
                selReport:['日统计'],

                //选人组件
                showPersonPicker: false,
                showTab:["org","colleague",'role'],
                attenUserList:[],

                startDate:"",
                endDate:"",
                orgStr:"",
                userStr:"",
                roleStr:""
            }
        },
        created: function () {

        },
        methods: {
            startChange(val){
                this.startDate = val
            },
            endChange(val){
                this.endDate = val
            },
            showReport(){
                if(this.startDate == ""){
                    this.$vux.toast.text("开始时间不能为空！", 'center')
                    return false
                }
                if(this.endDate == ""){
                    this.$vux.toast.text("结束时间不能为空！", 'center')
                    return false
                }
                let status = this.compareDate(this.startDate,this.endDate)
                if(status){
                    this.$vux.toast.text("开始时间不能大于结束时间！", 'center')
                    return false
                }
                let  se = new Date(this.endDate).getTime() - new Date(this.startDate).getTime()
                if(se > 30 * 24 * 60 * 60000){
                    this.$vux.toast.text("时间间隔不能超过30天！", 'center')
                    return false
                }
                if(this.attenUserList.length <= 0){
                    this.$vux.toast.text("请选择时间范围！", 'center')
                    return false
                }
                let path = ''
                if(this.selReport[0] === '日统计'){
                    path = "/attendanceHome/tjReportDay"
                }else if(this.selReport[0] === '月统计'){
                    path = "/attendanceHome/tjReportMonth"
                }
                this.$router.push({
                        path: path,
                        query:{
                            startDate:this.startDate,
                            endDate:this.endDate,
                            roleStr:this.roleStr,
                            userStr:this.userStr,
                            orgStr:this.orgStr
                        }
                })
            },
            selectUser(){
                this.showPersonPicker = true;
            },
            onPicked(list) {
                let orgArr = []
                let userArr = []
                let roleArr = []
                let retMap = list.map(item => {
                    if(item.type === "dept"){//组织
                        orgArr.push(item.id)
                    }else if(item.type ===  "user"){//人员
                        userArr.push(item.id)
                    }else if(item.type ===  "role"){//角色
                        roleArr.push(item.id)
                    }
                    let map = {
                        key: item.title,
                        value: item.id,
                        level: this.$refs.picker.getLevel(item.type)
                    };
                    return map;
                });
                this.showPersonPicker = false;
                this.attenUserList = retMap;
                this.orgStr = orgArr.join(",");
                this.userStr = userArr.join(",");
                this.roleStr = roleArr.join(",");

            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            compareDate(s1,s2){
              return ((new Date(s1.replace(/-/g,"\/")))>(new Date(s2.replace(/-/g,"\/"))));
            }
        }
    }
</script>
<style type="text/css">
    .tjReport .weui-cell__ft {
        color: #999 !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .tjReport{
        height: 100%;
    }
    .messInfo{
        font-size: 16px;
        height: 45px;
        line-height: 20px;
    }
</style>
