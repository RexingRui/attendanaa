import {
  INITIAL_USER_NUM,
  CHANGE_USER_NUM,
  INITIAL_STAFF_NUM,
  CHANGE_STAFF_NUM,
  INITIAL_STAFF_DATA,
  CHANGE_STAFF_DATA,
  CHANGE_CURRENT_PAGE,
  DOATTENDANCE
} from "@/common/mutation-types.js";

export default {
  [INITIAL_USER_NUM](state, userNum) {
    state.userNum = userNum;
  },

  [CHANGE_USER_NUM](state, userNum) {
    state.userNum = userNum + 1;
  },

  [INITIAL_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [CHANGE_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [INITIAL_STAFF_DATA] (state, staffDatas) {
    state.staffDatas = [];
    state.staffDatas = staffDatas;
  },

  [CHANGE_STAFF_DATA] (state, payload) {
    if (payload.flag == "change") {
      console.log('change');
      state.staffDatas.forEach((value, index) => {
        if (value.id == payload.staffData.id) {
          state.staffDatas.splice(index, 1, payload.staffData)
        }
      });
    } else {
      state.staffDatas.push(payload.staffData);
    }
  },

  [CHANGE_CURRENT_PAGE] (state, pageIndex) {
    state.pageIndex = pageIndex;
  },

  [DOATTENDANCE](state, staffAttendance) {
    state.currentStaffAttend = staffAttendance;
  }
};
