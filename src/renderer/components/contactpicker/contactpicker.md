## contactpicker props

- currentCompanyMode: Boolean

    是否只选择当前公司同事，可选值: `false`(默认),  `true`
    
- companyId: String

    当前companyId， currentCompanyMode为`true`时需要传  
      
- friendAndPhoneContactMode: Boolean

    好友和手机通讯录选择模式，可选值: `false`(默认),  `true`
    
- initialSelected： Array

    初始选中人员
    
- refreshSeed： boolean

    有的场景初次没有获取到数据，用于刷新状态，及时再次查询数据，用法如下
    ```this.refreshSeed = !this.refreshSeed```
    
## contactpicker Events

- picked(addGroupMembers: Array, addPeopleName: string, hasFriendSelected: number, selectedCompanyId: Array)
 
    选中事件
    `addGroupMembers` 选中的成员, `addPeopleName` 成员的名字，用逗号分隔，
    `hasFriendSelected` 是否有好友选中，`selectedCompanyId` 选中成员归属公司列表


- goBack

    点击返回按钮时触发的回调
