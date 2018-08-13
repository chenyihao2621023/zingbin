## tag props
- searchFlag: Boolean

    default:false
    
    是否显示搜索框
        
## tag Events

- cancelInput(event) 

  点击关闭搜索框
  
- confirmInput(event) 

  点击发送请求

## demo

  ```html
  <search
     :searchFlag="searchFlag"
     @cancelInput ="cancelInput"
     @confirmInput="confirmInput"
 >
 </search>
  ```
