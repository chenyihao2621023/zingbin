import * as types from '../mutation-types'
import axios from 'axios'


let state = { 
  hotelList: []
}

//  getters
const getters = {};

//  actions

const actions = {

 searchHotelAcion : ({ commit }, payload) => {
    if (payload.params.hotelBlock === '全部楼栋') payload.params.hotelBlock = null
  axios.get('/zingbiz/hotel/hotelOrders/getRoomList',payload) //获取酒店房间
    .then(function(res) { 
     commit(types.SET_HOTEL_LIST,res.data.data.data)       

    })
    .catch(function(err) {
      console.log(err);
    });

}

};

//  mutations

const mutations = { 
  SET_HOTEL_LIST: (state, value) => {   
    state.hotelList = value
  }
}

export default {
    state,
    getters,
    actions,
    mutations
}