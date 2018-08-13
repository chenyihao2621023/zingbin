### 创建群聊插件使用

1. 在main.js中引入插件
```vue
import CreateChatPlugin from './plugins/createchat/create-chat'
Vue.use(CreateChatPlugin)
```

2. 代码中调用
```vue
this.$zingp.createChat.show()
```

3. 在fn中封装了一个工具方法方便直接调用
```javascript
import { createChat } from '@/utils/fn'
createChat(this)
```
