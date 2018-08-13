## SelectRoom 房间选择组件
## props
    - enterTime: String
        入住时间, 2018-04-09 12:00:00

    - outerTime: String
        离店时间, 2018-04-09 12:00:00

    - tags :Array
       已选房间数组,数组元素是房间对象,[{},{}]

    - show : Boolean
        控制组件显示与否的boolean控制器

    - maxSelect: Number
        最多可选的个数.

    - isReserve :Boolean
        是否是预订, 如果是预订,则显示预订输入框,可按数量预订

    - unSelect : Array
        不可选的房间

## Events

    - callback(obj)
        选中的回调, 不再是数组,,而是Object对象 {planed :[], unPlaned:{}}
        Obj说明: planed是数组,包含了已选房间的对象列表
                unPlaned是对象,key是房型id-房型desc, value是数字Number,代表预订房型的数量. --仅用于预订时按数量预订

    - cancel
      取消选择的回调

## Demo

   <select-room :show="selectRoomModal" :enterTime="enterTime" :outerTime="outerTime"
        :tags="form.hotelOrderRoomList" @cancel="selectRoomModal=false" @callback="getRoomInfo">
   </select-room>
