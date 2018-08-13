## classSelection props

- showPicker: boolean
    选择组件显示状态
    可选项: `false`（默认）,  `true`

-  title1,title2
    标题

-  tagType1，tagType2
    tagType标识

- abort
   取消选择的回调

- checkSelected
   提交的回调

##  Demo

```html
       <classSelection
                 :showPicker="showClassSetter"
                 :title1="title1"
                 :title2="title2"
                 :tagType1="tagType1"
                 :tagType2="tagType2"
                 @abort="classAbort"
                 @checkSelected="checkSelected"
                 >
             </classSelection>
```


