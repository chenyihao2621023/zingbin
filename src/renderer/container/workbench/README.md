zingMainPage：为主标签页面
配置方法：menuData: [{
                  name: '任务管理',
                  link: '/taskManage', //没有子页面的直接填写自己的路径
                  icon: 'bianji1',
                  color: '#40AFFC',
                  role: ['admin', 'editor']
              },{
                  name: '餐饮',    //有子页面的固定地址及参数名，参数值应唯一，且为子页面childData的属性名称
                  link: '/zingMainChild?childItem=dinner',
                  icon: 'shenpi1',
                  color: '#F59324',
                  role: ['admin', 'editor']
              },]
zingMainChild：为子标签页面
配置方法：childData : {
                      isnull:[],
                      dinner:{ //必须与主标签页面传的值相同
                        title:"餐饮", //页面名称
                        data:[ //餐饮
                             {
                                 name: '点菜及账单',
                                 link: '/dinner/deskList',
                                 icon: 'bianji1',
                                 color: '#40AFFC',
                                 role: ['admin', 'editor']
                             },{
                                 name: '菜品管理',
                                 link: '/dinner/dinnerManage',
                                 icon: 'shenpi1',
                                 color: '#F59324',
                                 role: ['admin', 'editor']
                              },              
                        ]},         
