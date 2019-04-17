<template>
  <div class="staff-attendance">
    <div class="attendance-title">
      <div class="words-title">
        <span class="words-title-year">{{date.year}}</span>年
        <span class="words-title-month">{{currentPage}}</span>月份考勤表
      </div>
      <div class="attendance-pages" ref="pagination">
        <el-pagination
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
      ref="table"
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
          <el-popover trigger="focus" placement="bottom">
            <p>{{ scope.row.attendanceReason[item.id]}}</p>

            <div
              slot="reference"
              class="cell-bg"
              :class="{holidbg: item.isHoliday, weekbg: item.isWeekend, weekdiebg: item.isWeekDie}"
            >
              <span class="edit-attendance">
                <el-button
                  :type="scope.row.attendanceStyle[item.id]"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleAttendanceClick"
                ></el-button>
              </span>
              <span
                class="attendance-record"
                :class="{abnormal: scope.row.attendanceState[item.id] !== '工作'}"
              >{{scope.row.attendanceState[item.id]}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="总计" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.numbersOfWorkdays}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="handle-table">
      <input type="button" value="导出" class="export-button" @click="handleExportExcel">
    </div>
    <attendance-dialog
      v-model="dialogFormVisible"
      @record="handleAttendanceData"
      :isHoliday="isHoliday"
      :isWeekend="isWeekend"
      :isWeekDie="isWeekDie"
      :currentAttendDate="currentAttendDate"
    ></attendance-dialog>
  </div>
</template>
<script>
import attendanceDialog from "@/components/attendanceDialog";
// 导出excle文件
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { mapState } from "vuex";

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
    adjustDays() {
      return this.$store.getters.dateDataOfYear;
    },
    /**
     * 表单的表头日期
     */
    dateData() {
      let dateNum = [];
      // 当前月的天数
      let month = this.currentPage;
      let currentSelectMonthNum = this.monthMatchDays[month];
      // 当前月的假期、周末、调假
      let currentMonthH = this.adjustDays.holiday.filter(value => {
        return value.month == month;
      });
      let currentMontW = this.adjustDays.weekend.filter(value => {
        return value.month == month;
      });
      let currentMonthWD = this.adjustDays.weekdie.filter(value => {
        return value.month == month;
      });

      // 遍历当前月的每一天，标识假期与周末
      for (let i = 1; i < currentSelectMonthNum + 1; i++) {
        let dateObj = {
          id: i,
          name: String(i),
          isHoliday: false,
          isWeekend: false,
          isWeekDie: false
        };
        // 判断今日是否是节假日
        currentMonthH.forEach(value => {
          if (value.day == i) {
            dateObj.name = i + value.name;
            dateObj.isHoliday = true;
          }
        });

        // 判断今日是否周末
        let isWeekends = currentMontW.some(value => {
          return value.day == i;
        });
        dateObj.name = isWeekends ? i + "周末" : dateObj.name;
        dateObj.isWeekend = isWeekends ? true : false;

        // 判断今日是否调假日
        let isWeekendDie = currentMonthWD.some(value => {
          return value.day == i;
        });
        dateObj.isWeekDie = isWeekendDie ? true : false;
        dateObj.name = isWeekendDie ? i + "调班" : dateObj.name;
        dateNum.push(dateObj);
      }
      return dateNum;
    },
    currentAttendDate() {
      return (
        this.date.year + "/" + this.currentPage + "/" + this.currentRecordDay
      );
    },
    ...mapState([
      'staffDatas',
      'loadData'
    ])
  },
  methods: {
    /**
     * 切换月份回调
     */
    handleCurrentChange(val) {
      this.handleTableData();
    },
    /**
     * 表格单元单击事件处理函数
     * @param {object} row 当前行的数据
     * @param {object} column 当前列的数据
     * @param {object} cell 当前元素dom
     * @param {object} event 事件
     */
    handleCellClick(row, column, cell, event) {
      // 判断当前日期是不是节假期/周末/调班/工作日
      this.isWeekend = false;
      this.isHoliday = false;
      this.weekDie = false;
      let currentDateLabe = column.label;
      if (currentDateLabe.length > 2) {
        if (currentDateLabe.search("班") > -1) {
          this.isWeekDie = true;
        } else if (currentDateLabe.search("周") > -1) {
          this.isWeekend = true;
        } else {
          this.isHoliday = true;
        }
      }
      this.currentRecordStaff = row;
      this.currentRecordDay =
        column.label.length > 2
          ? column.label.match(/[0-9]+/)[0]
          : column.label;
      console.log(row);
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
        staffObj.attendId = value.attendId;
        // 将员工的信息设置staff属性
        let staffSelf = JSON.parse(JSON.stringify(value));
        staffObj.staff = staffSelf;

        // 拿出当前月的考勤数据
        let currentMonthData = value.attendRecord.filter(el => {
          if (el.month) {
            return el.month == currentMonth;
          }
        });
        // 其他列填入考勤信息
        staffObj.attendanceState = [];
        // 用于提示考情异常，迟到的信息
        staffObj.attendanceReason = [];
        // 用于提示未修改的数据
        staffObj.attendanceStyle = [];
        // 每月总计正常工作天数
        staffObj.numbersOfWorkdays = 0;

        // 数据第一项不填入信息
        staffObj.attendanceState[0] = "";
        staffObj.attendanceReason[0] = "";
        staffObj.attendanceStyle[0] = false;
        for (let i = 1; i < this.monthMatchDays[currentMonth] + 1; i++) {
          let currentAttendance = {};
          currentMonthData.forEach(value => {
            if (value.day == i) {
              currentAttendance = value;
            }
          });
          if (currentAttendance.isEdit === 'loadEdit') {
              staffObj.attendanceStyle[i] = 'info';
          } else if (currentAttendance.isEdit === 'edit' || currentAttendance.isEdit === 'mannual') {
              staffObj.attendanceStyle[i] = 'success';
          } else {
              staffObj.attendanceStyle[i] = '';
          }
          staffObj.attendanceReason[i] = currentAttendance.reason
            ? currentAttendance.reason
            : "";
          staffObj.attendanceState[i] = currentAttendance.state
            ? currentAttendance.state
            : "";
          staffObj.numbersOfWorkdays =
            staffObj.attendanceState[i] === "工作" || staffObj.attendanceState[i] === "加班"
              ? staffObj.numbersOfWorkdays + 1
              : staffObj.numbersOfWorkdays;
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
    /**
     * 手动执行考勤操作
     * @param {object} attendanceDataOfIndivid 执行当前考勤操作的个人数据
     */
    handleAttendanceData(attendanceDataOfIndivid) {
      // 获取当前考勤人员的数据，并根据考勤结果更改
      let changeStaff = this.currentRecordStaff.staff;
      // 修改考勤数据
      let changeAttendFlag = false;
      changeStaff.attendRecord.forEach((staffAttend, index) => {
        if (
          staffAttend.year == this.date.year &&
          staffAttend.month == this.currentPage &&
          staffAttend.day == this.currentRecordDay
        ) {
          changeStaff.attendRecord[index].punchInTime =
            attendanceDataOfIndivid.punchInTime;
          changeStaff.attendRecord[index].state = attendanceDataOfIndivid.state;
          changeStaff.attendRecord[index].reason =
            attendanceDataOfIndivid.reason;
          changeStaff.attendRecord[index].isEdit = "edit";
          changeAttendFlag = true;
        }
      });
      // 添加考勤数据
      if (!changeAttendFlag) {
        // 假期与周末处理
        let dateForm = 'workdays';
        let currentDay = this.dateData[parseInt(this.currentRecordDay) - 1];
        for (let item in currentDay) {
          if (currentDay.hasOwnProperty(item) && currentDay[item] === true) {
            dateForm = item.replace('is', '').toLowerCase();
          }
        }
        changeStaff.attendRecord.push({
          state: attendanceDataOfIndivid.state,
          reason: attendanceDataOfIndivid.reason,
          punchInTime: attendanceDataOfIndivid.punchInTime,
          year: this.date.year,
          month: this.currentPage,
          day: this.currentRecordDay,
          isEdit: "manual",
          dateForm: dateForm
        });
      }
      this.$store.dispatch("changeStaffData", {
        flag: "change",
        staffData: changeStaff
      });

      // 由于在vuex中的异步处理，在这需要添加异步，使vuex处理完后在执行后续程序
      setTimeout(() => {
        this.handleTableData();
      }, 100);
    },
    /**
     * 导出到execl
     */
    handleExportExcel() {
      // 由于设置了固定了，数据渲染的时候会渲染出两组相同数据，故首先需要去除
      let tableDom = this.$refs["table"].$el.cloneNode(true);
      tableDom.removeChild(tableDom.querySelector(".el-table__fixed"));
      // 从表单中获取数据
      let table = XLSX.utils.table_to_book(tableDom);
      // get binary string as output
      let tableOut = XLSX.write(table, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });

      //设置文件名
      let execlName = `${this.date.year}年${this.currentPage}月考勤.xlsx`;
      // 保存文件
      try {
        FileSaver.saveAs(new Blob([tableOut]), execlName, {
          type: "application/octet-stream"
        });
      } catch (e) {
        console.log(e, wbout);
      }
      return tableOut;
    },
    /**
     * 处理导入数据
     */
    handleLoadData() {
      // 导入的数据需要根据指纹打卡时间做处理
      let staffDatas = JSON.parse(JSON.stringify(this.staffDatas));
      staffDatas.forEach(staff => {
        staff.attendRecord.forEach(currentAttendance => {
          if (currentAttendance.isEdit === "load") {
            // 打卡时间
            let workTime = currentAttendance.punchInTime;           
            // 假期与周末处理
            currentAttendance.dateForm = 'workdays';
            let currentMonth = new Date(workTime[0]).getMonth() + 1;
            let currentDate = new Date(workTime[0]).getDate();
            for(let item in this.adjustDays) {
              if (this.adjustDays.hasOwnProperty(item) && item !== 'year') {
                this.adjustDays[item].forEach(value => {
                  if (value.month == currentMonth && value.day == currentDate) {
                    currentAttendance.dateForm = item;
                  }
                })
              }
            }
          
            // 上班记录时间
            let startWorkTime = new Date(workTime[0]).getHours();
            // 下班记录时间
            let endWorkTime = new Date(workTime[1]).getHours();

            // 正常打卡时的考勤
            if (startWorkTime !== endWorkTime) {
              let startWork = new Date(workTime[0]);
              let endWork = new Date(workTime[1]);
              let lateTime =
                workTime[0] -
                new Date(
                  parseInt(startWork.getFullYear()),
                  parseInt(startWork.getMonth()),
                  parseInt(startWork.getDate()),
                  9,
                  0
                );
              let leaveTime =
                workTime[1] -
                new Date(
                  parseInt(endWork.getFullYear()),
                  parseInt(endWork.getMonth()),
                  parseInt(endWork.getDate()),
                  17,
                  30
                );

              if (lateTime > 1800000) {
                // 排除提前打卡的情况以及迟到时间小于半小时的情况
                let minutesOfLate = Math.floor(lateTime / 60000);
                currentAttendance.state = "异常"; // false
                currentAttendance.reason = `迟到${Math.floor(
                  minutesOfLate / 60
                )}小时 ${minutesOfLate % 60}分钟`;
              } else if (leaveTime < -1800000) {
                // 早退处理
                let minutesOfLeave = Math.floor(leaveTime / 60000);
                currentAttendance.state = "异常";
                currentAttendance.reason = `早退${Math.floor(
                  Math.abs(minutesOfLeave) / 60
                )}小时 ${Math.abs(minutesOfLeave) % 60}分钟`;
              } else {
                // 既不迟到也不早退
                // 判断当天是不是周末或者节假日，若是按照加班处理

                let holidays = this.adjustDays.holiday.concat(
                  this.adjustDays.weekend
                );
                let isHoliday = holidays.some(val => {
                  return (
                    val.month == currentAttendance.month &&
                    val.day == currentAttendance.day
                  );
                });
                currentAttendance.state = isHoliday ? "加班" : "工作";
                // 工日日加班处理
                if (leaveTime > 1800000) {
                  currentAttendance.state = "加班";
                }
              }
            } else if (parseInt(endWorkTime) < 13) {
              // 只要上班时打了卡
              currentAttendance.state = "异常";
              currentAttendance.reason = "下班未打卡";
            } else if (parseInt(startWorkTime) > 13) {
              currentAttendance.state = "异常";
              currentAttendance.reason = "上班未打卡";
            }
            // 对导入的数据处理过要进行标记
            currentAttendance.isEdit = "loadEdit";
          }
        });
      });
      this.$store.dispatch("initialStaffData", {
        flag: "initial",
        staffDatas: staffDatas
      });
    }
  },
  mounted() {
    // 加载当前日期
    let currentDate = new Date().toLocaleDateString().split("/");
    this.date.year = currentDate[0];
    this.date.month = currentDate[1];
    this.date.day = currentDate[2];
    this.currentPage = parseInt(this.date.month);
    // 处理从文件中导入的考勤数据
    this.handleLoadData();
    // 渲染表中的数据
    this.handleTableData();

    // 将分页中的“页”改为“月”
    let domPage = this.$refs["pagination"].getElementsByClassName(
      "el-pagination__jump"
    )[0];
    domPage.removeChild(domPage.lastChild);
    let textLabel = document.createTextNode("月");
    domPage.appendChild(textLabel);
  }
};
</script>
<style lang="less" scoped>
.staff-attendance {
  position: relative;
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
    .abnormal {
      color: #f10b0b;
    }
    .style {
      color: #2f3cf0;
    }
  }
  .handle-table {
    float: right;
    margin-top: 20px;
    .export-button {
      font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-weight: 600;
      color: #4b4747;
      width: 60px;
      height: 32px;
      background-color: #67c23a;
      border-radius: 5px;
    }
  }
}
</style>