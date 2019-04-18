<template>
  <div class="attendance-analysis">
    <div class="title">分析页面</div>
    <div class="month-buttons">
      <span>
        <el-button
          type="primary"
          v-for="item in monthsName"
          :key="item"
          @click="handleMonthsClick(item)"
        >{{item}}</el-button>
      </span>
    </div>
    <table id="table" data-height="460"></table>
  </div>
</template>
<script>
export default {
  name: "attendanceAnalysis",
  data() {
    return {
      activeName2: "first",
      columns: [
        [
          {
            field: "attendId",
            title: "考勤号",
            rowspan: 2,
            align: "center",
            valign: "middle",
          },
          {
            field: "name",
            title: "姓名",
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "work",
            title: "工作(d)",
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "overtime",
            title: "加班(h)",
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "leave",
            title: "请假(h)",
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "annualLeave",
            title: "年假(h)",
            colspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "abnormal",
            title: "异常考勤",
            rowspan: 2,
            align: "center",
            valign: "middle"
          },
          {
            field: "remarks",
            title: "备注",
            rowspan: 2,
            align: "center",
            valign: "middle"
          }
        ],
        [
          {
            field: "leaveBefore",
            title: "月前",
            align: "center",
            valign: "middle"
          },
          {
            field: "leaveAfter",
            title: "月后",
            align: "center",
            valign: "middle"
          }
        ]
      ],

      monthsName: [
        "Jan",
        "Feb",
        "Mar",
        "April",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
      containerOfTableData: {},
      tableData: []
    };
  },
  computed: {
    staffDatas() {
      return this.$store.state.staffDatas;
    }
  },
  watch: {
    tableData() {
      this.handleTableData("refesh");
    }
  },
  methods: {
    /**
     * 切换不同的月份，统计不同的数据
     * @param {number} month 月份
     */
    handleMonthsClick(month) {
      this.tableData = this.containerOfTableData[month];
    },
    /**
     * 收集需要统计的数据
     */
    getAnalysisData() {
      // 从员工数据中统计考勤数据
      let staffDatas = JSON.parse(JSON.stringify(this.staffDatas));
      let dataAnalysis = [];
      staffDatas.forEach(staff => {
        let staffDataAna = [];
        staff.attendRecord.forEach(attendanceRecordItem => {
          // 每个月的数据为一个数组，存储每日分析结果
          if (!staffDataAna[attendanceRecordItem.month]) {
            staffDataAna[attendanceRecordItem.month] = [];
          }
          //
          // 对请假和加班做处理
          let time =
            attendanceRecordItem.punchInTime[1] -
            attendanceRecordItem.punchInTime[0];
          let overtimeHours = "";
          if (
            attendanceRecordItem.state === "加班" &&
            (attendanceRecordItem.dateForm === "holiday" ||
              attendanceRecordItem.dateForm === "weekend")
          ) {
            // 周末或者节假日加班
            overtimeHours = this.handleOvertime(time);
          } else if (
            attendanceRecordItem.state === "加班" &&
            attendanceRecordItem.dateForm === "workdays"
          ) {
            // 工作日加班
            overtimeHours = this.handleOvertime(time) - 8;
            attendanceRecordItem.state = "工作";
          } else if (attendanceRecordItem.state === "请假") {
            overtimeHours = this.handleOvertime(time);
          }
          staffDataAna[attendanceRecordItem.month].push(
            attendanceRecordItem.state + overtimeHours
          );
        });

        dataAnalysis.push({
          name: staff.name,
          attendId: staff.attendId,
          annualLeave: staff.annualLeave,
          staffDataAna: staffDataAna
        });
      });
      // 将数据放在一个容器作为表格数据的父集
      this.monthsName.forEach(val => {
        this.containerOfTableData[val] = [];
      });

      dataAnalysis.forEach(item => {
        for (let i = 1; i <= 12; i++) {
          let staffData = {
            attendId: item.attendId,
            name: item.name,
            work: 0,
            overtime: 0,
            leave: 0,
            annualLeave: parseInt(item.annualLeave),
            abnormal: 0,
            remarks: ""
          };

          try {
            item.staffDataAna[i].forEach(val => {
              switch (val) {
                case "工作":
                  staffData.work++;
                  break;
                case "异常":
                  staffData.abnormal++;
                  break;
                default:
                  if (val.indexOf("请假") > -1) {
                    staffData.leave += parseFloat(val.replace("请假", ""));
                    staffData.work++;
                  } else if (val.indexOf("加班") > -1) {
                    staffData.overtime += parseFloat(val.replace("加班", ""));
                  } else if (val.indexOf("工作") > -1) {
                    staffData.work++;
                    staffData.overtime += parseFloat(val.replace("工作", ""));
                  }
                  break;
              }
            });
            this.containerOfTableData[this.monthsName[i - 1]].push(staffData);
          } catch {
            console.log("该月没有数据");
          }
        }
      });
    },
    /**
     * 处理加班时间
     * @param {number} time 工作时间
     */
    handleOvertime(time) {
      // 减去吃饭时间0.5小时
      let overtimeHours = (time / 3600000).toFixed(1) - 0.5;
      // 力度设为0.5个小时
      let decimal = parseInt(("" + overtimeHours).split(".")[1]);
      overtimeHours =
        decimal > 5
          ? parseInt(("" + overtimeHours).split(".")[0]) + 0.5
          : parseInt(("" + overtimeHours).split(".")[0]);
      return overtimeHours;
    },
    /**
     * 渲染表格
     * @param {string} flag
     */
    handleTableData(flag) {
      let $table = $("#table");
      if (flag === "initial") {
        this.handleMonthsClick("Jan");
        $table.bootstrapTable({ columns: this.columns, data: this.tableData });
      } else {
        $table.bootstrapTable("refreshOptions", {
          columns: this.columns,
          data: this.tableData,
          rowStyle: this.rowStyle
        });
      }
    },
    handleRest() {
      // 优先根据加班时间来调休
      this.tableData.forEach(item => {
        if (item.overtime >= item.leave) {
          item.overtime -= item.leave;
          item.leave = 0;
        } else {
          item.leave -= item.overtime;
          item.overtime = 0;
          // 使用年假来调休
          if (item.leave > 0) {
            if (item.annualLeave >= item.leave) {
              item.annualLeave -= item.leave;
              item.leave = 0;
              item.restDays = item.leave;
            } else {
              item.leave -= item.annualLeave;
              item.annualLeave = 0;
              item.restDays = item.annualLeave;
            }

            // 分发数据
            let staffData = this.staffDatas.find(value => {
              return value.attendId === item.attendId;
            });
            staffData.annualLeave = item.annualLeave;
            if (staffData) {
              this.$store.dispatch("changeStaffData", {
                staffData: staffData,
                flag: "change"
              });
            }
          }
        }
      });
      this.handleTableData("refesh");
    },
    rowStyle(row, index) {
    return {
      css: {
        color: 'blue'
      }
    }
  }
  },
  mounted() {
    this.getAnalysisData();
    this.handleTableData("initial");
  }
};
</script>
<style lang="less" scoped>
.attendance-analysis {
  .title {
    font-size: 0.4rem;
    font-weight: 550;
    height: 1rem;
    line-height: 1rem;
  }
  .month-buttons {
    display: flex;
    margin-bottom: 0.65rem;
  }
}
</style>

