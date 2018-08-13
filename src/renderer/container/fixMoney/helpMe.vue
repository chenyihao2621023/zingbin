<template>
    <div class="help">
        <ZingHead title="帮助信息"></ZingHead>
        <scroll :observeDOM="true" class="scroll-wrap">
            <div class="help-content">
                <article>
                    <p class="help-title"> 一、基础设置</p>
                    <p class="help-describe">
                        根据实际情况正确设定，否则无法正常新建固定资产和计提折旧等操作，
                        影响到最终折旧额等信息
                    </p>
                    <ul class="help-content-item">
                        <li> <span> 初始参数：</span> 固定资产使用初始配置的参数信息</li>
                        <li> <span> 资产类别：</span> 设置固定资产使用的资产类别信息</li>
                        <li> <span> 变动方式：</span> 设置固定资产使用时的变动方式</li>
                        <li><span> 使用状态：</span> 设置固定资产使用时的使用状态</li>
                        <li><span> 存放地点：</span> 设置固定资产使用时的存放地点</li>
                        <li><span> 折旧方法：</span> 系统提供的折旧方法计算公式</li>
                    </ul>
                </article>
                <artical>
                    <p class="help-title common">二、 日常处理</p>
                    <ul class="help-content-item">
                        <li><span> 资产管理：</span> 对固定资产进行新建、编辑、删除、变动、清理等操作。</li>
                        <li><span> 资产生产凭证：</span> 针对当期新建、清理、变动等业务资料生成凭证，并对凭证有效的管理，包括：生成凭证、修改凭证、审核凭证等操作。
                            生成的凭证传递到总账系统，以保证固定资产系统与总账系统的固定资产科目、累计折旧科目数据一致。</li>
                        <li><span> 工作量管理：</span> 固定资产折旧方法有采用工作量法进行计提折旧的，则在计提折旧之前需要输入本期完成的实际工作量。</li>
                        <li><span> 计提折旧：</span>计提折旧主要根据固定资产卡片上的折旧方法生成计提折旧凭证（初始参数设定不折旧时，则无法进行计提折旧，另对于资产类别、使用状态设定的计提折旧方式也会影响是否进行计提折旧）</li>
                        <li><span> 折旧管理：</span> 折旧管理是对已折旧的金额进行查看和修改，修改后的数据会自动更新所提的计提折旧凭证金额。</li>
                        <li> <span> 工作量查询：</span> 提供各项固定资产，在各会计期间的工作量及累计工作量的数据（仅涉及工作量法的固定资产）</li>
                        <li> <span> 自动对账：</span> 固定资产管理系统实现了固定资产业务处理和总账财务核算处理的无缝连接，但为了防止用户不通过固定资产系统，
                            直接在总账系统录入固定资产凭证，导致业务与财务数据核对不上，系统提供了自动对账功能，
                            帮助用户将固定资产系统的业务数据与总账系统的财务数据进行核对，及时发现错误。</li>
                        <li>
                            <span> 报表查询：</span>固定资产统计报表，帮助企业从多角度查询固定资产信息，进行资产统计分析及各种折旧费用和成本分析。
                        </li>
                    </ul>
                </artical>
            </div>
        </scroll>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import Scroll from "components/scroll/Scroll";
    export default {
        name: "help-me",
        components:{
            ZingHead,
            Scroll
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .help{
        height 100%
        &-content{
            margin 15px 13px
            &-item{
                span{
                    font-size 14px
                    font-weight bold
                    line-height 20px
                }
            }
        }
        &-title{
            font-size 14px
            font-weight bold
            margin-bottom 5px
        }
        &-describe{
            text-indent 32px
            text-align justify
            line-height 20px
            margin-bottom 15px
        }
    }
    li {
        text-align justify
        margin-bottom 5px
    }
    .scroll-wrap{
        height calc(100% - 50px)
    }
    .common{
        margin 15px
        margin-left 0
    }
</style>
