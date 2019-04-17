import WebStorage from "web-storage-cache";
// 存储账号信息以及员工信息
let myStorage = new WebStorage();
import {
  INITIAL_USER,
  CHANGE_USER,
  INITIAL_STAFF_NUM,
  CHANGE_STAFF_NUM,
  INITIAL_STAFF_DATA,
  CHANGE_STAFF_DATA,
  CHANGE_CURRENT_PAGE,
  UPDATE_LOGIN_USER,
  CHANGE_LOGIN_STATE,
  GET_DATEDATA_OFYEAR,
  CHANGE_STANDARD_DATA,
  CHANGE_DELETE_NUM
} from "@/common/mutation-types.js";

export default {
  [INITIAL_USER](state, payload) {
    state.user.userNum = payload.userNum;
    state.user.userData = payload.userData;
  },

  [CHANGE_USER](state, payload) {
    state.user.userNum = payload.userNum + 1;
    state.user.userData = payload.userData;

  },

  [INITIAL_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [CHANGE_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [CHANGE_DELETE_NUM](state, deleteNum) {
    state.deleteNum = deleteNum;
  },

  [INITIAL_STAFF_DATA](state, payload) {
    let currentMonthAttend = payload.currentMonthAttend;
    // 判断是导入数据/初始化数据
    if (payload.flag === 'initial') {
      state.staffDatas = payload.staffDatas;
    } else if (payload.flag === 'load' || payload.flag === 'reload') {
      state.loadData = currentMonthAttend;
      state.staffDatas.forEach(item => {
        // 如果是重复导入需要删除之前的考勤记录
        if (payload.flag === 'reload') {
          item.attendRecord = item.attendRecord.filter(value => {
            return value.month != currentMonthAttend.month;
          })
        }
        // 取出当前员工的考勤数据
        let currentStaffData = currentMonthAttend.data.filter(val => {
          return item.attendId === val.attendId;
        });
        // 根据日期数据进行排序，
        currentStaffData.sort((a, b) => {
          return parseInt(a.attendDate.split('/')[2]) - parseInt(b.attendDate.split('/')[2]);
        });
        // 同一日期的上下午考勤放在一起 {如果数据只有一次考勤记录则表示为9:30-9:30}
        currentStaffData.forEach((val, index) => {
          if (index > 0) {
            if (val.attendDate === currentStaffData[index - 1].attendDate) {
              currentStaffData[index - 1].attendTime += '-' + val.attendTime;
              currentStaffData.splice(index, 1);
            }
          }
        });
        // 将考勤数据添加至员工数据中
        currentStaffData.forEach(val => {
          // 日期
          let arrayDate = val.attendDate.split('/');
          // 时间
          let attendanceTimeArray = val.attendTime.split("-");
          // 通过时间判断迟到与早退现象
          let startWorkTime = attendanceTimeArray[0].split(":");
          let endWorkTime = attendanceTimeArray[1].split(":");
          item.attendRecord.push({
            year: arrayDate[0],
            month: arrayDate[1],
            day: arrayDate[2],
            isEdit: 'load',
            state: '',
            reason: '',
            punchInTime: [new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]), parseInt(startWorkTime[0]), parseInt(startWorkTime[1])).getTime(), new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]), parseInt(endWorkTime[0]), parseInt(endWorkTime[1])).getTime()]
          });
        });
        myStorage.replace("staff" + item.id, item);
      });

    }

  },

  [CHANGE_STAFF_DATA](state, payload) {
    if (payload.flag == "change") {
      // 替换员工信息 1.基本资料更改 2.考勤信息更改
      state.staffDatas.forEach((value, index) => {
        if (value.id == payload.staffData.id) {
          state.staffDatas.splice(index, 1, payload.staffData);
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

  [UPDATE_LOGIN_USER](state, payload) {
    state.loginUser = payload.loginUser;
    if (payload.flag === 'password') {
      state.user.userData.forEach(val => {
        if (val.id === payload.loginUser.id) {
          val.password = payload.loginUser.password;
        }
      })
    }
  },

  [CHANGE_LOGIN_STATE](state, loginState) {
    state.loginState = loginState;
  },

  [GET_DATEDATA_OFYEAR](state, dateDataOfYear) {
    state.dateDataOfYear = dateDataOfYear;
  },

  [CHANGE_STANDARD_DATA](state, standardData) {
    state.standardData = standardData;
  }
};