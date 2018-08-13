<template>
    <div>
        <div v-show="discountMain">
           <ZingHead title="折旧方法">
               <div slot="header-right">
                <span class="header-jiahao">
                    <dropdown :data="list" trigger="click" placement="bottomRight" :placementXAbs="-8" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>
               </div>
           </ZingHead>
           <div>
               <div class="title">折旧方法公式</div>
               <ul class="content">
                   <li>平均年限法（基于入账原值和入账预计使用期间）</li>
                   <li>平均年限法（基于入账净值和入账剩余使用期间）</li>
                   <li>年数总和法</li>
                   <li>双倍余额递减法（按年折旧率和年初净值计提）</li>
                   <li>双倍余额递减法（按月折旧率和月初净值计提）</li>
                   <li>动态平均年限法</li>
                   <li>动态双倍余额递减法（按年折旧率和年初净值计提）</li>
                   <li>动态双倍余额递减法（按月折旧率和月初净值计提）</li>
                   <li>动态年数总和法</li>
                   <li>工作量法</li>
               </ul>
           </div>
        </div>
        <popup position="right" v-model="popup1" width="100%" :popup-style="{'overflow-y': 'auto'}">
            <ZingHead title="折旧方法定义说明" :isComeBack="false" @doSome="cancle()"></ZingHead>
            <article class="explainMain">
                <p>
                    1、平均年限法（基于入账原值和入账预计使用期间）：该方法是一种静态直线折旧法，
                    固定资产每期折旧额是根据建立卡片时的入账原值、入账预计净残值、预计使用期间计算的。
                    公式计算没有考虑入账前的累计折旧及已提折旧期间数的影响。在以后使用期间，
                    折旧要素的变动也不会影响各月计提的折旧金额。该折旧方法计算简单，能够保证月折旧额一直保持不变，
                    但如果在固定资产使用期间内发生了折旧要素的调整，需要同时将折旧公式调整为动态平均年限法。
                </p>
                <p>
                    2、平均年限法（基于入账净值和入账剩余使用期间）：与方法一相同，
                    区别是该公式计算折旧时是基于入账净值和入账剩余使用期间考虑的。
                    如果你在使用过程中发生了原值等折旧要素的调整，并且希望相应的调整各月折旧额，
                    请在变动的同时选择平均年限法。
                </p>
                <p>
                    3、年数总和法：一种加速折旧法，该折旧法以年为计算基础。
                </p>
                <p>
                    4、双倍余额递减法（按年折旧率和年初净值计提）：一种加速折旧法，该折旧法以年为计算基础。
                </p>
                <p>
                    5、动态平均年限法：该折旧法考虑了固定资产变动时折旧要素的影响，
                    其目的是当折旧要素变动后，折旧金额会自动按调整后因素计算。
                    例如：有一台设备原值调整增加10000元，则以后各期折旧金额会相应调整，
                    以保证在折旧期间内把增加的金额提完。并且这种直线法符合会计制度，推荐用户选用。
                </p>
                <p>
                    6、动态双倍余额递减法（按年折旧率和年初净值计提）：该折旧法考虑了固定资产变动时折旧要素的影响，
                    其目的是当折旧要素变动后，折旧金额会自动按调整后要素继续使用双倍余额法计算。
                </p>
                <p>
                    7、动态双倍余额递减法(按月折旧率和月初净值计提)：一种加速折旧法，该折旧法以月（即期间）为计算基础。
                </p>
                <p>
                    8、动态年数总和法：该折旧法考虑了固定资产变动时折旧要素的影响，
                    其目的是当折旧要素变动后，折旧金额会自动按调整后要素继续使用年数总和法计算。
                </p>
                <p>
                    9、工作量法：该折旧法考虑了固定资产变动时折旧要素的影响，其目的是当折旧要素变动后，
                    折旧金额会自动按调整后要素继续使用工作量法计算。
                </p>
            </article>
        </popup>
        <popup position="right" v-model="popup2" width="100%" :popup-style="{'overflow-y': 'auto'}">
            <ZingHead title="折旧方法公式说明" :isComeBack="false" @doSome="cancle()"></ZingHead>
            <main class="formulaMain">
                <article>
                    <h2>1、平均年限法（基于原值和预计使用期间）</h2>
                    <p>公式: 每期折旧额 = （入账原值 - 入账预计净残值）/入账预计使用期间</p>
                </article>
                <article>
                    <h2>2、平均年限法（基于净值和剩余使用期间）</h2>
                    <p>
                        公式: 每期折旧额 = （入账原值 - 入账累计折旧 - 入账固定资产减值准备 - 入账预计净残值）
                        /（入账预计使用期间 - 入账已使用期间）
                    </p>
                </article>
                <article>
                    <h2>
                        3、年数总和法
                    </h2>
                    <p>
                        年数总和法的折旧计算是要先计算各年折旧率/额，再计算年内各个会计期间的折旧率/额。其折旧计算公式是：
                        折旧率（年） = （预计使用年限 - 已使用年限）/[预计使用年限×（预计使用年限+1）/2] × 100%
                        折旧率（月） = 折旧率（年）/12
                        某年折旧额 = 该年折旧率 × （固定资产入账原值 - 入账净残值）
                        月折旧额 = 该年折旧额/12
                    </p>
                </article>
               <article>
                   <h2>
                       5、动态平均年限法
                   </h2>
                   <p>
                       变动前，公式同2
                       变动后公式:
                       月折旧额 = （调整后原值 - 调整后累计折旧 - 调整后减值准备 - 调整后净残值）/调整后剩余使用期间
                   </p>
               </article>
                <article>
                    <h2>
                        4、双倍余额递减法（按年折旧率和年初净值计提）
                    </h2>
                    <p>
                        1） 在该固定资产预计使用年限到期的两年前：
                        年折旧率 = 2/固定资产预计使用年限
                        期折旧率 = 年折旧率/一年中的会计期间数
                        各年折旧额 = 年折旧率×该固定资产账面净值
                        各年每期折旧额 = 各年折旧额/一年中的会计期间数
                        2） 在该固定资产预计使用年限到期的两年内（含两年）改用直线法：
                        每年折旧额 = （到期两年的年初净值 - 预计净残值）/2
                        每期折旧额 = 每年折旧额/一年中的会计期间数
                    </p>
                </article>
               <article>
                   <h2>
                       6、动态双倍余额递减法（按年折旧率和年初净值计提）
                   </h2>
                   <p>
                       变动前，公式同4
                       变动后公式:
                       年折旧率＝2/调整后预计使用年限×100%；
                       月折旧额＝（调整后账面净值－调整后减值准备）×年折旧率/12；
                       最后两年 月折旧额＝（调整后原值－调整后累计折旧－调整后预计净残值－调整后减值准备）/2/12；
                   </p>
               </article>
               <article>
                   <h2>
                       7、动态双倍余额递减法(按月折旧率和月初净值计提)
                   </h2>
                   <p>
                       变动前公式：
                       1） 在该固定资产预计使用年限到期的两年前：
                       年折旧率 = 2/固定资产预计使用年限
                       期折旧率 = 年折旧率/一年中的会计期间数
                       各年每期折旧额 = （期初净值-减值准备）*期折旧率
                       2） 在该固定资产预计使用年限到期的两年内（含两年）改用直线法：
                       每年折旧额 = （到期两年的年初净值-减值准备 - 预计净残值）/2
                       每期折旧额 = 每年折旧额/一年中的会计期间数
                       变动后公式：
                       1）在该固定资产调整后预计使用年限到期的两年前：
                       年折旧率＝2/调整后预计使用年限×100%；
                       各年每期折旧额＝（调整后期初净值－调整后减值准备）×年折旧率/一年中的会计期间数
                       2）在该固定资产调整后预计使用年限到期的两年内（含两年）改用直线法：
                       每期折旧额＝（调整后原值－调整后累计折旧－调整后预计净残值－调整后减值准备）/调整后剩余期间数
                   </p>
               </article>
                <article>
                    <h2>
                        8、动态年数总和法
                    </h2>
                    <p>
                        变动前，公式同3
                        变动后公式:
                        年折旧率＝（调整后预计使用年限-已使用年限）/【（调整后预计使用年限＋1）×调整后预计使用年限/2】
                        月折旧额 = （调整后原值 - 调整后净残值 - 调整后减值准备） × 年折旧率/12
                    </p>
                </article>
                <article>
                    <h2>
                        9、工作量法
                    </h2>
                    <p>
                        变动前公式:
                        月折旧额 = （入账原值 - 入账累计折旧 - 入账减值准备 - 入账净残值）/（入账工作总量 - 入账已使用工作量） × 本月工作量
                        变动后公式:
                        月折旧额＝（调整后原值－调整后的累计折旧－调整后的减值准备－调整后的净残值）/调整后剩余工作总量×本月工作量
                        1-4种折旧方法是静态折旧法，折旧要素的变动不会影响月折旧金额。
                        5-9种折旧法是动态折旧法，当折旧要素变动后，折旧金额会自动按调整后的因素计算。
                    </p>
                </article>
            </main>
        </popup>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import Dropdown from "@/components/dropdown/Dropdown";
    import { Popup } from 'vux'
    export default {
        name: "depreciation",
        components:{
            ZingHead,
            Dropdown,
            Popup
        },
        data() {
            return {
                list:[
                    { content:"定义说明" },
                    { content:"公式说明" }
                ],
                discountMain:true,
                popup1:false,
                popup2:false
            }
        },
        methods:{
            handleMenu(data) {
                if (data.content === "定义说明") {
                    this.discountMain = false
                    this.popup1 = true
                } else {
                    this.discountMain = false
                    this.popup2 = true
                }
            },
            cancle() {
                this.popup1 = false
                this.popup2 = false
                this.discountMain = true
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .title{
        margin-left 13px
        margin-top 10px
        margin-bottom 10px
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        font-family: Arial;
    }
    .content li{
        padding 10px 0
        padding-left 26px
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        font-family: Arial;
        border-bottom 1px solid #f5f5f5
    }
    .content li:first-child{
        border-top 1px solid #f5f5f5
    }
    .explainMain{
        height calc(100%-50px)
        padding-top 10px
        background-color white
        p{
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            font-family: Arial;
            margin 10px 13px
            line-height 20px
            text-align: justify;
        }
    }
    .formulaMain{
        height calc(100%-50px)
        background-color white
        padding  0 13px
        padding-top 10px
        article{
            margin 5px 0
            h2{
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                font-family: Arial;
                text-align: justify;
                margin-bottom 5px
            }
            p{
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                font-family: Arial;
                text-align: justify;
                line-height 20px
            }
        }

    }
</style>
