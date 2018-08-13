## labelType props
-popup:Boolean 控制组件状态
       可选项: `false`（默认）,  `true`
       
## labelType event      
-cancle ：返回时的会掉

-confirm（items: Object）确定时返回数据
     返回的数据格式
     let  externalContactsData = {
                                     contactsState:this.stateText,
                                     contactsType: this.typeText,
                                     contactsLevel:this.levelText
                                }
## labelType Demo

<labelType  :popup="popup"  @cancle="cancle"  @confirm="confirm" > </labelType>
