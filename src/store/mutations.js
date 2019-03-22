import {
  INITIAL_USER_NUM,
  CHANGE_USER_NUM,
  INITIAL_STAFF_NUM,
  CHANGE_STAFF_NUM,
  INITIAL_STAFF_DATA,
  CHANGE_STAFF_DATA,
  CHANGE_CURRENT_PAGE,
  DO_ATTENDANCE,
  UPDATE_LOGIN_USER,
  CHANGE_LOGIN_STATE,
  GET_DATEDATA_OFYEAR,
  ADD_ATTENDANCE_DATA
} from "@/common/mutation-types.js";

export default {
  [INITIAL_USER_NUM](state, payload) {
    state.user.userNum = payload.userNum;
    state.user.userData = payload.userData;
  },

  [CHANGE_USER_NUM](state, payload) {
    state.user.userNum = payload.userNum + 1;
    state.user.userData = payload.userData;

  },

  [INITIAL_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [CHANGE_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [INITIAL_STAFF_DATA](state, payload) {
     let currentMonthAttend =payload.currentMonthAttend;
    if (payload.flag === 'initial') {
      state.staffDatas = payload.staffDatas;
    } else if (payload.flag === 'input') {
      state.staffDatas.forEach(item => {
        // 取出当前员工的考勤数据
        let currentStaffData = currentMonthAttend.filter(val => {
          return item.attendId === val.attendId;
        });
        // 添加日期属性，key为日期，value为考勤的时间，如 '2019/1/1': 9:01, 目的是为了将同一天的考勤数据连接在一起
        currentStaffData.forEach(val => {
          if (val[val.attendDate]) {
            va[val.attendDate] += '-' + val.attendTime;
          } else {
            val[val.attendDate] = val.attendTime;
          }
        });
        // 将考勤数据添加至员工数据中
        currentStaffData.forEach(val => {
          let arrayDate = val.attendDate.split('/');
          let year = arrayDate[0];
          let month = arrayDate[1];
          let day = arrayDate[2];

          // 通过时间判断员工正常上班，迟到，早退等现象
          
        });

         

      })
    }
    
  },

  [CHANGE_STAFF_DATA](state, payload) {
    if (payload.flag == "change") {
      // 替换员工信息 1.基本资料更改 2.考勤信息更改
      state.staffDatas.forEach((value, index) => {
        if (value.id == payload.staffData.id) {
          state.staffDatas.splice(index, 1, payload.staffData)
        }
      });
    } else if (payload.flag == "add") {
      state.staffDatas.push(payload.staffData);
    } else if (payload.flag == "remove") {
      if (payload.deleteIndex) {
        state.staffDatas = state.staffDatas.filter(staff => {
          return !payload.deleteIndex.some(x => {
            return x == staff.id;
          })
        })
      }
    }
  },

  [CHANGE_CURRENT_PAGE](state, pageIndex) {
    state.pageIndex = pageIndex;
  },

  [DO_ATTENDANCE](state, staffAttendance) {
    state.currentStaffAttend = staffAttendance;
  },

  [UPDATE_LOGIN_USER](state, payload) {
    state.loginUser = payload.loginUser;
  },

  [CHANGE_LOGIN_STATE](state, loginState) {
    state.loginState = loginState;
  },

  [GET_DATEDATA_OFYEAR](state, dateDataOfYear) {
    state.dateDataOfYear = dateDataOfYear;
  },

  [ADD_ATTENDANCE_DATA](state, currentMonthAttend) {
    state.attendanceData.push(currentMonthAttend);
  }
};