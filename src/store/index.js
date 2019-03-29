  import Vue from 'vue';
  import Vuex from 'vuex';
  import mutations from '@/store/mutations.js';
  import actions from '@/store/actions.js';
  //可以暂时不用这个插件
  // import vuexAlong from 'vuex-along';

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
      deleteId: 0,
      // 当前页面
      pageIndex: 'staffInformation',
      // 当前操作的员工信息
      curentStaffInfo: {},
      // 当前员工的考勤数据  这个数据暂时没有使用，由于是父子组件关系，数据直接通过$emit的形式发到父组件
      currentStaffAttend: {
        state: '',
        date: [],
        reason: ''
      },
      // 某年的节假日与周末日期
      dateDataOfYear: {},
      // 考勤数据
      attendanceData: []
    },
    getters: {
},
    mutations,
    actions,
    // plugins: [vuexAlong]

  })