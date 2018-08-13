## 桌位选择组件
## prop
    - showSelectDesk : boolean
         选择组件显示状态 : `false`（默认）,  `true`

    - deskData : Array
         分类数据Array， 目前组件暂未支持数据自动查询获取，需要自己传过来
## Events
    - selected ：function
            确定选择的回调事件，返回object ｛deskName:"xxx",deskId:"xxx"｝

    - cancel : function
            取消选择的回调
## 使用方法
    1.引用注册
    2.使用
        使用样例：
    <select-desk :showSelectDesk="isShow" :deskData="data" @selected="confirm" @cancel="cancel"></select-desk>
