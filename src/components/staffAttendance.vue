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
        <!-- 考勤图标 -->
        <template slot-scope="scope">
          <div
            class="cell-bg"
            :class="{holidbg: item.isHoliday, weekbg: item.isWeekend, weekdiebg: item.isWeekDie}"
          >
            <span class="edit-attendance">
              <el-button type="info" icon="el-icon-edit" size="mini" @click="handleAttendanceClick"></el-button>
            </span>
            <span class="attendance-record">{{scope.row.attendance[item.name]}}</span>
          </div>
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
import adjustDays from "@/common/holiday.js";

export default {
  name: "staffAttendance",
  components: {
    attendanceDialog
  },
  data() {
    return {
      isHoliday: false,
      isWeekend: false,
      isWeekDie: false,
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
      let currentSelectMonthNum = this.monthMatchDays[this.currentPage];

      for (let i = 1; i < currentSelectMonthNum + 1; i++) {
        let dateObj = {
          id: i,
          name: String(i),
          isHoliday: false,
          isWeekend: false,
          isWeekDie: false
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
      this.handleTableData();
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
    handleTableData() {
      // 获取当前月份，对应的当前的分页的当前页
      let currentMonth = this.currentPage;
      let tableData = [];
      // 遍历所有员工数据
      this.staffDatas.forEach((value, index, array) => {
        // 获取表单所需的数据
        let staffObj = {};
        // 第一列中填入姓名
        staffObj.name = value.name;
        staffObj.id = value.id;
        // 将员工的信息放在staff属性
        let staffSelf = JSON.parse(JSON.stringify(value));
        staffObj.staff = staffSelf;
        // 拿出当前月的考勤数据
        let currentMonthData = value.attendRecord.filter(el => {
          if (el.month) {
            return el.month == currentMonth;
          }
        });
        // 其他列填入考勤数据
        staffObj.attendance = [];
        for (let i = 1; i < this.monthMatchDays[currentMonth] + 1; i++) {
          let currentAttendance = {};
          currentMonthData.forEach(value => {
            if (value.day == i) {
              currentAttendance = value;
            }
          });
          staffObj.attendance[0] = "";
          // 存入考勤数据
          staffObj.attendance[i] = currentAttendance.attendance
            ? currentAttendance.attendance.state
            : "";
        }
        tableData.push(staffObj);
      });
      this.tableData = tableData;
    },
    /**
     * 打开对话框执行考勤操作
     */
    handleAttendanceClick() {
      this.dialogFormVisible = true;
    },
    handleAttendanceData(attendanceData) {
      // 获取当前考勤人员的数据，并根据考勤结果更改
      let changeStaff = this.currentRecordStaff.staff;
      console.log(changeStaff);
      // 修改考勤数据
      let changeAttendFlag = false;
      changeStaff.attendRecord.forEach((staffAttend, index) => {
        if (
          staffAttend.year == this.date.year &&
          staffAttend.month == this.currentPage &&
          staffAttend.day == this.currentRecordDay
        ) {
          console.log(staffAttend.year, staffAttend.month, staffAttend.day);
          changeStaff.attendRecord[index].attendance = attendanceData;
          changeStaff.attendRecord[index].year = this.date.year;
          changeStaff.attendRecord[index].month = this.currentPage;
          changeStaff.attendRecord[index].day = this.currentRecordDay;
          changeAttendFlag = true;
        }
      });
      // 添加考勤数据
      if (!changeAttendFlag) {
        changeStaff.attendRecord.push({
          attendance: attendanceData,
          year: this.date.year,
          month: this.currentPage,
          day: this.currentRecordDay
        });
      }
      this.$store.dispatch("changeStaffData", {
        flag: "change",
        staffData: changeStaff
      });
      // 跟新table中的数据
      this.tableData.forEach((value, index) => {
        if (value.id == changeStaff.id) {
          let tableAttendance = JSON.parse(
            JSON.stringify(this.tableData[index].attendance)
          );
          tableAttendance[this.currentRecordDay] = attendanceData.state;
          this.tableData[index].attendance = tableAttendance;
        }
      });
    }
  },
  mounted() {
    // 加载当前日期
    console.log(adjustDays);
    let currentDate = new Date().toLocaleDateString().split("/");
    this.date.year = currentDate[0];
    this.date.month = currentDate[1];
    this.date.day = currentDate[2];
    this.currentPage = parseInt(this.date.month);
    // 渲染表中的数据
    this.handleTableData();
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
      .cell-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 48px;
        // background-color: rgba(245, 245, 245, .8);
        line-height: 48px;
      }
      .holidbg {
        background-color: rgba(112, 168, 168, 0.6);
      }
      .weekbg {
        background-color: rgba(163, 185, 81, 0.6);
      }
      .weekdiebg {
        background-color: rgba(218, 77, 147, 0.6);
      }
      .edit-attendance {
        position: absolute;
        top: -16px;
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