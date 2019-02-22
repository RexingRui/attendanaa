import WebStorage from "web-storage-cache";
import { WSAEWOULDBLOCK } from "constants";

    /**
     * 获取注册账号/员工数量
     * @param {string} name 账号/员工
     * @param {object} component 当前组件
     */
    function getUserNum(name, component) {
      let myStorage = new WebStorage();
      let userNum = myStorage.get(name);
      if (userNum && userNum != 0) {
        userNum = parseInt(userNum);
      } else {
        userNum = 0;
      }
      myStorage.add(name, userNum);
      component.$store.commit("change" + name.replace(/^[a-z]/, name.slice(0,1).toUpperCase()), { userNum: userNum });
      return {
        userNum: userNum,
        storage: myStorage
      };
    }

    function getStaffData(myStorage) {
      let staffData = [];
      // 获取员工数量
      let staffNum = myStorage.get('staffNum');
      // 若员工存在，将所有员工的信息存入到staffNum中并返回
      if (staffNum) {
        for (let i = 0; i < staffNum; i++) {
          staffData.push(myStorage.get('staff' + i));
        }
      }

      return {
        staffData: staffData
      }
    }

    export default {
      getUserNum,
      getStaffData
    }