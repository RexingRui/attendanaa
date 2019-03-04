<template>
  <div class="staff-attendance">
    <div class="attendance-title">
      <div class="words-title">
        <span class="words-title-year">{{date.year}}</span>年
        <span class="words-title-month">{{currentPage}}</span>月份考勤表
      </div>
      <div class="attendance-pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="31"
          layout="prev, pager, next, jumper"
          :total="365"
        ></el-pagination>
      </div>
    </div>
    <el-table
      style="width: 100%"
      height="290"
      border
      :data="tableData"
      @cell-click="handleCellClick"
    >
      <el-table-column fixed label="姓名" width="100" height="20">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in dateData"
        :key="item.id"
        :label="item.name"
        width="100"
        :prop="item.name"
      >
        <template>
          <span class="edit-attendance">
            <el-button type="info" icon="el-icon-edit" size="mini" @click="handleAttendanceClick"></el-button>
          </span>
          <span>12</span>
        </template>
      </el-table-column>
      <el-table-column label="总计" width="100"></el-table-column>
    </el-table>
    <attendance-dialog v-model="dialogFormVisible" @record="handleAttendanceData"></attendance-dialog>
  </div>
</template>
<script>
import attendanceDialog from "@/components/attendanceDialog";
import WebStorage from "web-storage-cache";

export default {
  name: "staffAttendance",
  components: {
    attendanceDialog
  },
  data() {
    return {
      date: { year: "", month: "", day: "" },
      currentPage: 1,
      currentRecordStaff: {},
      currentRecordDay: "",
      tableData: [],
      dialogFormVisible: false
    };
  },
  computed: {
    monthMatchDays() {
      let monthMatchDays = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
      };
      if (!this.date.year % 4) {
        monthMatchDays["2"] = 29;
      }
      return monthMatchDays;
    },
    dateData() {
      let dateNum = [];
      for (let i = 1; i < this.monthMatchDays[this.currentPage] + 1; i++) {
        let dateObj = {
          id: i,
          name: String(i)
        };
        dateNum.push(dateObj);
      }
      return dateNum;
    },
    staffDatas() {
      return this.$store.state.staffDatas;
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.handleStaffData();
      console.log(this.tableData);
    },
    /**
     * 表格单元单机的事件处理函数
     * @param [object] row 当前行的数据
     * @param [object] column 当前列的数据
     * @param [object] cell 当前元素dom
     * @param [object] event 事件
     */
    handleCellClick(row, column, cell, event) {
      this.currentRecordStaff = row;
      this.currentRecordDay = column.label;
    },
    /**
     * 将当前选择的月份考勤数据渲染到表格中
     */
    handleStaffData() {
      // 获取当前月份，对应的当前的分页的当前页
      let currentMonth = this.currentPage;
      // 遍历所有员工数据
      this.staffDatas.forEach((value, index, array) => {
        // 拿出当前选中月考勤数据
        // let currentMonthData = value.attendRecord.filter(el => {
        //   if (el.month) {
        //     return el.month == currentMonth;
        //   }
        // });
        let existData = this.tableData.some(el => {
          return el == existData;
        });
        if (existData) {
          value.attendRecord.forEach(el => {
            if (el.month == currentMonth) {
              this.tableData.push(value);
            }
          });
        }

        // // 写入默认的考勤值
        // for (let i = 1; i < this.monthMatchDays[currentMonth] + 1; i++) {
        //   let currentAttendance = {};
        //   currentMonthData.forEach(value => {
        //     if (value.day == i) {
        //       currentAttendance = value;
        //       console.log(currentAttendance);

        //     }
        //   });
        //   console.log(currentAttendance);
        //   staffObj.attendance[i] = currentAttendance.attendance ? currentAttendance.attendance.state : '未考勤';
        // }
      });
    },
    handleChange($event) {
      let staffAttendance = {};
      // 执行考勤操作
      if (this.currentRecordDay == this.date.day) {
        staffAttendance.year = this.date.year;
        staffAttendance.month = this.date.month;
        staffAttendance.day = this.date.day;
        staffAttendance.attendance = $event.target.value;
        console.log(this.currentRecordStaff.attendance);
        this.currentRecordStaff.attendance.push(staffAttendance);
        this.$store.dispatch("changeStaffData", {
          staffData: this.currentRecordStaff,
          flag: change
        });
      }
    },
    /**
     * 打开对话框执行考勤操作
     */
    handleAttendanceClick() {
      this.dialogFormVisible = true;
    },
    handleAttendanceData(attendanceData) {
      this.$store.dispatch("changeStaffData", { flag: "change" });
      this.currentRecordStaff.attendance[this.currentRecordDay] =
        attendanceData.state;
      console.log(this.tableData);
      console.log("ok");
    }
  },
  mounted() {
    // 加载当前日期
    let currentDate = new Date().toLocaleDateString().split("/");
    this.date.year = currentDate[0];
    this.date.month = currentDate[1];
    this.date.day = currentDate[2];
    this.currentPage = parseInt(this.date.month);
    // 渲染表中的数据
    this.handleStaffData();
    console.log(this.tableData);
  }
};
</script>
<style lang="less" scoped>
  .staff-attendance {
    .attendance-title {
      position: relative;
      height: 48px;
      .words-title {
        font-size: 18px;
        .words-title-year {
          color: #141ea1;
        }
        .words-title-month {
          color: #f70a59;
        }
      }
      .attendance-pages {
        position: absolute;
        right: 20px;
        top: 15px;
      }
    }
    /deep/ .cell {
      overflow: none;
      text-align: center;
      .edit-attendance {
        position: absolute;
        top: -3px;
        right: 0;
        .el-button {
          padding: 2px 5px;
          border-top: none;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }
  }
</style>
"{"c":1551699698818,"e":253402300799000,"v":"{\"id\":0,\"name\":\"rjj\",\"gender\":\"男\",\"phone\":\"15212351687\",\"email\":\"jko@asd.com\",\"date\":\"2019/3/12\",\"select\":false,\"attendance\":[{\"year\":2019,\"month\":2,\"day\":1,\"attendance\":{\"state\":\"\",\"date\":[],\"reason\":\"\"}}]}"}"
