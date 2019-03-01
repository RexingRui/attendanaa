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
        <template slot-scope="scope">
          <span class="edit-attendance">
            <el-button
              type="info"
              icon="el-icon-edit"
              size="mini"
              @click="handleAttendanceClick"
            ></el-button>
          </span>
          <span>{{scope.row.attendance[item.name]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总计" width="100"></el-table-column>
    </el-table>
    <attendance-dialog v-model='dialogFormVisible'></attendance-dialog>
  </div>
</template>
<script>
import attendanceDialog from '@/components/attendanceDialog';

export default {
  name: "staffAttendance",
  components: {
    attendanceDialog
  },
  data () {
    return {
      date: {},
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
      if ( !this.date.year % 4) {
        monthMatchDays['2'] = 29;
      }
      return monthMatchDays
    },
    dateData () {
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
    staffDatas () {
      return this.$store.state.staffDatas;
    }
  },
  methods: {

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.handleStaffData();
    },
    /**
     * 表格单元单机的事件处理函数
     * @param [object] row 当前行的数据
     * @param [object] column 当前列的数据
     * @param [object] cell 当前元素dom
     * @param [object] event 事件
     */
    handleCellClick (row, column, cell, event) {
      this.currentRecordStaff = row;
      this.currentRecordDay = column.label;
    },
    /**
     * 将当前选择的月份考勤数据渲染到表格中
     */
    handleStaffData () {
      // 获取当前月份，对应的当前的分页的当前页
      let currentMonth = this.currentPage;
      // 考勤匹配值
      let valueMatchAttendance = {
        0: "未考勤",
        1: "工作",
        2: "病假",
        3: "婚假",
        4: "事假"
      };
      //
      let tableData = [];
      // 遍历所有员工数据
      this.staffDatas.forEach((value, index, array) => {
        // 获取表单所需的数据
        let staffObj = {};
        // 第一列中填入姓名
        staffObj.name = value.name;
        // 拿出当前月的考勤数据
        let currentMonthData = value.attendance.filter(el => {
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
          staffObj.attendance[i] = currentAttendance
            ? valueMatchAttendance[currentAttendance.attendance]
            : "未考勤";
        }
        tableData.push(staffObj);
      });
      this.tableData = tableData;
    },
    handleChange ($event) {
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
    }
  },
  mounted () {
    // 加载当前日期
    let currentDate = new Date().toLocaleDateString().split("/");
    this.date.year = currentDate[0];
    this.date.month = currentDate[1];
    this.date.day = currentDate[2];
    this.currentPage = parseInt(this.date.month);
    // 渲染表中的数据
    this.handleStaffData();
  }
};
</script>
<style lang="less" scoped>
.staff-attendance {
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
}
</style>
