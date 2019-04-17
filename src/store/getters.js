import WebStorage from "web-storage-cache";
let myStorage = new WebStorage();

export default {
  // 刷新以后数据消失，将其放在localeStorage中
  dateDataOfYear (state) {
    if (!state.dateDataOfYear) {
      state.dateDataOfYear = myStorage.get('dateDataOfYear');
    }
    return state.dateDataOfYear;
  },
  standardData (state) {
    if (!state.standardData) {
      state.standardData = myStorage.get('standardData');
    } 
    return state.standardData;
  }
}