## labelType props
-data:Array
     --传递的数据 数据格式如下
        theData: [
                          {
                              id: '001',
                              menuName: '增加',
                              children: [
                                  {
                                      menuName: '用户管理',
                                      id: '001.001',
                                      children: []
                                  },
                                  {
                                      menuName: '角色管理',
                                      children: []
                                  },
                                  {
                                      menuName: '权限管理',
                                      children: []
                                  }
                              ]
                          },
                          {
                              id: '002',
                              menuName: '减少',
                              children: [
                                  {
                                      menuName: '商品一',
                                      children: []
                                  },
                                  {
                                      menuName: '商品二',
                                      children: [
                                          {
                                              menuName: '子类商品1',
                                              children: []
                                          },
                                          {
                                              menuName: '子类商品2',
                                              children: []
                                          }
                                      ]
                                  }
                              ]
                          },
                      ],
-没有下一级  ：children: []     
   
-newItem:Boolean 控制组件加号图标的显示隐藏
       可选项: `false`（默认）,  `true`
       
-deleteItem:Boolean 控制组件删除图标的显示隐藏
       可选项: `false`（默认）,  `true`     
         
## labelType event      
-addItem ：添加子项事件

## labelType Demo

 <tree :data="theData" :newItem="newItem" :deleteItem="deleteItem" @addItem="addItem"></tree>
