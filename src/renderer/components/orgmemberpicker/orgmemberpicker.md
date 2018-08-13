## orgmemberpicker props

    - showTab :Array
        tab显示控制器,用于控制tab的显示,默认显示3个:["org","colleague","role"],
        如果传此参数,则只显示传参控制的,
        注: 目前支持的所有参数:["org","colleague","role","friends"] ,后期根据选人组件的需求进行增减

    - companyId : String
        公司的id,如果传此参数,会查询对应公司的组织,人员,角色 数据
        一般不传此参数, 除非你有选择其他公司人员的需求

    - showPicker: boolean
        控制选择组件显示状态
        可选项: `false`（默认）,  `true`

    - initialSelected: array
        初始选中的成员，传用户数据 [{type:"",value:""}]
        type:dept、user、role（dept对应组织、user对应：人员，role对应角色）
        value:唯一标识

    - initialSelectedType: string
        初始选中的成员数据对应字段类型，默认为'rowId'，如果要传cardUrl，则传入'cardUrl'

    - multiple: boolean
        是否多选
        可选项: `true`（默认）,  `false`
    - title ：String
        头部标题
        默认是选择成员

## orgmemberpicker Events

    - picked(items: Array)
        选中的回调, items为成员的原始数据
        数据类似：[{title:"",id:"",type:""}]
        title：部门名称、角色名称、人名
        id：唯一标识
        type：dept、role、user
    - abort
      取消选择的回调

## orgmemberpicker Demo

    ```html
    <org-member-picker :initialSelected="initialSelected" :showPicker="showPicker" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
    ```

demo效果见 [orgmemberpicker demo](http://localhost:8080/#/demo/orgmemberpicker)
