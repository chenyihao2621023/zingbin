## 菜品分类选择组件
## prop
    - showSelectClazz : boolean
         选择组件显示状态 : `false`（默认）,  `true`

    - clazzData : Array
         分类数据Array， 目前组件暂未支持数据自动查询获取，需要自己传过来

## Events
    - selected ：function
            确定选择的回调事件，返回object ｛dinnerClazzName:"xxx",dinnerClazzId:"xxx"｝

    - cancel : function
            取消选择的回调

## 使用方法
    1.引用注册
    2.使用
        使用样例：
    <select-clazz :showSelectClazz="isShow" :clazzData="data" @selected="confirm" @cancel="cancel"></select-clazz>
