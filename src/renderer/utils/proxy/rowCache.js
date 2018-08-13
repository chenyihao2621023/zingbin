import Loki from 'lokijs'
import { isMhApp } from '../fn'

/**
 * 缓存需要排序、分页等无法用key val缓存的数据 如聊天记录
 * 【注意】整个数据库全局一份与PSMU生命周期相同
 * todo 事件、缓存、更新demo
 */
export class RowCache {

  constructor(option) {
    this.option = option || {}
    this.db = new Loki('rowCache')
    this.delimiter='_zsp_'
  }

  /**
   * [serializeCollection 序列化collection 返回collection string]
   * @param {collection:分类类似数据表}
   * 【注意】collection不要简单用表名 一张表可能在多个页面都要使用 应该设置为表名+唯一id 如:GroupChatMsg77821603000002801
   */
  serializeCollection(params) {
    if(typeof params.collection !=='undefined') {
      let collection = this.getCollection(params.collection);
      if (collection === null) {
        PSMU.error("Exception serializeCollection null collection" ,params)
        return null;
      }

      let doccount = collection.data.length;

      let resultlines = [];

      for(let docidx=0; docidx<doccount; docidx++) {
        resultlines.push(collection.data[docidx]);
      }
      let ret=PSMU.stringify(resultlines);
      if(isMhApp()){
        MHAppapi.saveDLC(params.collection,ret,"true");
      }
      return ret;
    }else{
      PSMU.error("Exception serializeCollection null collection key" ,params)
    }
  }

  /**
   * [deserializeCollection 序列化collection转对象 并添合并到db中]
   * @param  val collection string 原生环境可以传null 数据从原生层加载
   * @param  {collection:反序列化集合名称} params
   * 【注意】会用反序列化的数据替换当前集合的所有数据，全量方式
   * 如果需要可以扩展增量方式
   */
  deserializeCollection(val,params) {
    if(PSMU.isEmtVal(val) && isMhApp()){
      val=MHAppapi.loadDLC(params.collection);
    }

    if(typeof params.collection !=='undefined' && !PSMU.isEmtVal(val)){
      let collection = this.getCollection(params.collection);
      // let collection = this.db.getCollection(params.collection);
      // if (collection === null) {
      //   this.db.addCollection(params.collection);
      // }
      // let collectionAdd = this.db.deserializeCollection(val/*, { delimited: true, delimiter:that.delimiter}*/);
      let collectionData=PSMU.parseJSON(val);
      /*【注意】不是标准函数 参考了 lokijs loadDatabase*/
      collection.data=collectionData;
      // this.insert(collectionAdd,params.collection)
      PSMU.debug("deserializeCollection",this.db)
    }else{
      PSMU.error("Exception deserializeCollection null collection key" ,params)
    }
  }

  removeCollection(collectionName) {
    this.db.removeCollection(collectionName)
  }

  /**
   *
   * @param collectionName
   * @param query {'Name': { '$eq' : 'Odin' }}
   * 查询例子参考
   * https://github.com/techfort/LokiJS/wiki/Query-Examples
   */
  find(collectionName,query) {
    let collection = this.getCollection(collectionName);
    if(collection!==null){
      return collection.find(query);
    }
    return null
  }

  insert(val,collectionName) {
    let collection = this.getCollection(collectionName);
    if(typeof val ==='string'){
      val=PSMU.parseJSON(val);
    }
    collection.insert(val)
  }

  getCollection(collectionName) {
    let collection = this.db.getCollection(collectionName);
    if (collection === null) {
      collection=this.db.addCollection(collectionName);
    }
    return collection;
  }

}
