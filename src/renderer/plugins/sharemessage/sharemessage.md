### 创建群聊插件使用

1. 在main.js中引入插件
```vue
import ShareMessagePlugin from './plugins/sharemessage/share-message'
Vue.use(ShareMessagePlugin)
```

2. 代码中调用
```vue
this.$zingp.shareMessage.show()
```

3. 在fn中封装了一个工具方法方便直接调用
```javascript
import { shareMessage } from '@/utils/fn'
shareMessage(this)
```
