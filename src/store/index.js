import Vue from 'vue';
import Vuex from 'vuex';
import mutations from '@/store/mutations.js';
import actions from '@/store/actions.js';
import getters from '@/store/getters.js';


  Vue.use(Vuex);

  export default new Vuex.Store({
    state: {
      // 用户信息
      user: {
        userNum: 0,
        userData: []
      },
      // 当前登陆的用户
      loginUser: {},
      // 登陆状态
      loginState: false,
      // 员工数量
      staffNum: 0,
      // 员工信息
      staffDatas: [],
      // 被删除员工的id
      deleteNum: 0,
      // 当前页面
      pageIndex: 'staffInformation',
      // 某年的节假日与周末日期
      dateDataOfYear: null,
      // 标准数据
      standardData: {annualLeave: 40, overtime: "17:30"},
      // 由指纹打卡记录数据的导入
      loadData: {}
    },
  getters,
  mutations,
  actions,
});

