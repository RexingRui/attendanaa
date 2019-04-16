<template>
  <div class="staff-manager">
    <read-data @readdata="handleReadData" format=".csv">导入数据</read-data>
  </div>
</template>
<script>
import readData from "@/components/readData.vue";

export default {
  name: "staffManager",
  components: {
    readData
  },
  computed: {
    staffDatas() {
      return this.$store.state.staffDatas;
    }
  },
  methods: {
    /**
     * 读入考勤数据
     * @param {dom} file dom元素
     */
    handleReadData(file) {
      if (file) {
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
          // 提示读取成功
          this.$notify({
            title: "成功",
            message: "数据读取成功！",
            position: "top-left",
            type: "success",
            duration: 1000
          });
          // 处理读入数据
          let arrayData = reader.result.trim().split("\r\n");
          // 去掉表头
          arrayData.shift();
          // 存放当月考勤数据
          let attendanceData = [];

          arrayData.forEach((val, index) => {
            let attendArray = val.split(",");
            let staffAtendance = {
              name: "",
              attendId: "",
              attendDate: "",
              attendTime: ""
            };
            staffAtendance.name = attendArray[1];
            staffAtendance.attendId = attendArray[2];
            // 处理日期中有0的时候
            let dateArray = attendArray[3].split(" ")[0].split("/");
            dateArray.forEach(item => {
              item = item.replace(/^0/, "");
            });
            staffAtendance.attendDate = dateArray.join("/");
            // 处理时间中有0的时候
            let timeArray = attendArray[3].split(" ")[1].split("/");
            timeArray.forEach(item => {
              item = item.replace(/^0/, "");
            });
            staffAtendance.attendTime = attendArray[3].split(" ")[1];
            attendanceData.push(staffAtendance);
          });
          let currentMonthAttend = this.uniqueTime(attendanceData);
          let currentYear = currentMonthAttend[0].attendDate.split("/")[0];
          let currentMonth = currentMonthAttend[0].attendDate.split("/")[1];
          // 判断是否是重复导入
          let reloadFlag = this.staffDatas.some(staff => {
            return staff.attendRecord.some(val => {
              return val.month === currentMonth;
            });
          });

          if (reloadFlag) {
            this.$confirm("当月数据已存在，是否再次导入", "提示", {
              confirmButtonText: "再次导入",
              cancleButtonText: "取消导入",
              type: "warning"
            })
              .then(() => {
                this.$store.dispatch("initialStaffData", {
                  currentMonthAttend: {
                    year: currentYear,
                    month: currentMonth,
                    data: currentMonthAttend
                  },
                  flag: "reload"
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "取消导入",
                  duration: 500
                });
              });
          } else {
            // 分发数据
            this.$store.dispatch("initialStaffData", {
              currentMonthAttend: {
                year: currentYear,
                month: currentMonth,
                data: currentMonthAttend
              },
              flag: "load"
            });
          }
        };
      }
    },
    /**
     * 去除当天考勤多余的数据，保留第一次和最后一次
     * @param {array} arr
     * @return {array}
     */
    uniqueTime(arr) {
      // 取数据中的第一组数据
      let id = "";
      let date = "";
      let arrHead = arr.filter((val, index) => {
        if (index !== 0) {
          id = arr[index - 1].attendId;
          date = arr[index - 1].attendDate;
        }

        return val.id !== id && val.attendDate !== date;
      });
      // 数组反转，取数据中的第二组数据
      arr = arr.reverse();
      date = "";
      id = "";
      let arrEnd = arr.filter((val, index) => {
        if (index !== 0) {
          id = arr[index - 1].attendId;
          date = arr[index - 1].attendDate;
        }

        return val.id !== id && val.attendDate !== date;
      });

      return arrHead.concat(arrEnd);
    }
  }
};
</script>