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

/**
 * 
 * @param {array} arr 
 */
function uniqueTime(arr) {
  // 先把不同的人的考勤数据分开
  let id = '';
  let date = '';
  let arrHead = arr.fliter((val, index) => {
    if (index !== 0) {
      id = arr[index-1].attendId;
      date = arr[index-1].attendDate;
    }

    return val.id !== id && val.attendDate !== date;
  });

  arr = arr.reverse();

  let arrEnd = arr.fliter((val, index) => {
    if (index !== 0) {
      id = arr[index - 1].attendId;
      date = arr[index - 1].attendDate;
    }

    return val.id !== id && val.attendDate !== date;
  });

  return arrHead.concat(arrEnd);

}

export default {
  getUserNum,
  getStaffData
};