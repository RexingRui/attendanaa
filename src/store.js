import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userNum: 0,
    staffNum: 0,
    staffData: []
  },
  mutations: {
    changeUserNum(state, payload) {
      state.userNum = payload.userNum;
    },
    changeStaffNum(state, payload) {
      state.staffNum = payload.userNum;
    },
    changeStaffData(state, payload) {
      state.staffData = payload.staffData;
    }
  },
  actions: {

  }
})
