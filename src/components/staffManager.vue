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
  methods: {
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
            duration: 1500
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
          // this.$store.dispatch("addAttendanceData", {
          //   currentMonthAttend: {
          //     year: currentYear,
          //     month: currentMonth,
          //     data: currentMonthAttend
          //   }
          // });

          this.$store.dispatch("initialStaffData", { currentMonthAttend: {
              year: currentYear,
              month: currentMonth,
              data: currentMonthAttend
            },
            flag: 'input'});
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