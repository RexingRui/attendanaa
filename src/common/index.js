/**
 * 获取注册账号/员工数量
 * @param {object} myStorage localStorage
 */
function getStaffData(myStorage) {
  let staffData = [];
  // 若员工存在，将所有员工的信息存入到staffNum中并返回
  if (staffNum) {
    for (let i = 0; i < staffNum; i++) {
      staffData.push(myStorage.get("staff" + i));
    }
  }

  return {
    staffData: staffData
  };
}

export default {
  getUserNum,
  getStaffData
};
