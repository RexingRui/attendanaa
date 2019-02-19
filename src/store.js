import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userNum: 0
  },
  mutations: {
    changeUserNum(state, payload) {
      state.userNum = payload.userNum;
    }
  },
  actions: {

  }
})
