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
          let array = reader.result.trim().split("\r\n");
          // 去掉表头
          array.shift();
          let attendanceData = [];
          let staffAtendance = { name: "", attendId: "", attendance: [] };

          array.forEach((val, index) => {
            let attendArray = val.split(",");
            let attendDate = attendArray[3].split(" ")[0];

            staffAtendance.name = attendArray[1];
            staffAtendance.attendId = attendArray[2];

            if (index > 0) {
              // 上一条考勤记录
              let preAttendArray = array[index - 1].split(",");
              let preAttendDate = preAttendArray[3].split(" ")[0];
              if (
                attendArray[2] === preAttendArray[2] &&
                attendDate === preAttendDate
              ) {
                // 同一个员工同一天的考勤数据
                // 判断在该时间段是否多次考勤
                staffAtendance.attendance.push(attendDate);

              } else {
                
                staffAtendance.attendance.push(attendDate);
              }
            } else {
              // 添加第一条数据
              staffAtendance.attendance.push(attendDate);
            }
          });
        };
      }
    }
  }
};
</script>