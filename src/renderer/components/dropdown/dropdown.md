## dropdown props
- data: Array<Object>
  
    数据源
    ```js 
    [
            {content: '选项1'},
            {content: '选项2'},
            {
                content: '选项3(含有子选项)',
                    children: [
                        {content: '子选项1'},
                        {content: '子选项2'},
                    ],
                },
            },
    ]
    ```
- placement: string

    定位位置， 可选值 `bottomRight(默认)`,  `bottomLeft`， `topRight(暂未实现，有需求再说)`
   
- placementXAbs: Number

    横向定位位置偏移， 默认0
    
- trigger: string
    
    触发方式， 可选值 `hover(默认)`,  `click`

## dropdown Events

- item-click(data: Object)

    点击菜单项触发
    
## data:props
    
```js
[
    {
        content: '选项1', // 单项内容
        children: [       // 子选项
            { content: '子选项' }
        ],
        disabled: true,   // 禁用子选项，默认false
        divided: true     // 显示分割线, 默认false
        
    }
]
```

## demon 

  ```html
    <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
            <i class="iconfont icon-filter"></i>
        </a>
    </dropdown>
  ```
