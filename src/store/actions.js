import WebStorage from "web-storage-cache";
import jsonFile from "jsonfile";
import FileSaver from "file-saver";
let myStorage = new WebStorage();

export default {
  // 初始化账号信息
  initialUserNum({ commit }, payload) {
    new Promise((resolve, reject) => {
      if (payload.userData) {
        myStorage.add("userNum", payload.userNum);
        payload.userData.forEach(el => {
          myStorage.set("user" + el.id, el);
        });
      } else {
        myStorage.replace("userNum", payload.userNum);
      }
      resolve(payload.userNum);
    }).then(value => {
      commit("initialUserNum", value);
    });
  },
  // 增加账号
  changeUserNum({ commit }, payload) {
    new Promise((resolve, reject) => {
      // 存入localStorage
      let userNum = payload.userNum + 1;
      myStorage.replace("userNum", userNum);
      myStorage.set("user" + payload.userNum, payload.userData);
      // 存入本地json文件
      let userAllData = [];
      for (let i = 0; i < userNum; i++) {
        userAllData.push(myStorage.get("user" + i));
      }
      let jsonData = JSON.stringify(userAllData);
      var file = new File([jsonData], {
        type: "text/plain;charset=utf-8"
      });
      setTimeout(() => {
        FileSaver.saveAs(file);
      }, 2000);

      resolve(payload.userNum);
    }).then(value => {
      commit("changeUserNum", value);
    });
  },
  // 初始化员工数量
  initialStaffNum({ commit }, payload) {
    new Promise((resolve, reject) => {
      console.log("add");
      myStorage.add("staffNum", payload.staffNum);
      resolve(payload.staffNum);
    }).then(value => {
      commit("initialStaffNum", value);
    });
  },
  // 更改员工数量
  changeStaffNum({ commit }, payload) {
    new Promise((resolve, reject) => {
      myStorage.replace("staffNum", payload.staffNum);
      resolve(payload.staffNum);
    }).then(value => {
      commit("changeStaffNum", value);
    });
  },
  // 初始化员工信息
  initialStaffData({ commit }, payload) {
    new Promise((resolve, reject) => {
      if (payload.deleteIndex) {
        payload.deleteIndex.forEach(value => {
          myStorage.delete("staff" + value);
        });
      }
      resolve(payload.staffDatas);
    }).then(value => {
      commit("initialStaffData", value);
    });
  },
  // 更改员工信息
  changeStaffData({ commit }, payload) {
    new Promise((resolve, reject) => {
      // 判断是添加员工信息还是更改
      if (payload.flag == 'add') {
        myStorage.set("staff" + payload.staffData.id, payload.staffData);
      } else {
        myStorage.replace("staff" + payload.staffData.id, payload.staffData);
      }

      resolve(payload.staffData);
    }).then(value => {
      commit("changeStaffData", value);
    });
  },
  // 更改当前显示的页面
  changeCurrentPage({ commit }, payload) {
    commit("changeCurrentPage", payload.pageIndex);
  }
};