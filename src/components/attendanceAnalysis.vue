<template>
  <div class="attendance-analysis">
    <div class="title">分析页面</div>
    <div class="month-buttons">
      <span>
        <el-button
          type="primary"
          v-for="item in months"
          :key="item.id"
          @click="handleMonthsClick(item.id)"
        >{{item.name}}</el-button>
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
      months: [],
      columns: [
        { field: "attendId", title: "考勤号" },
        { field: "name", title: "姓名" },
        { field: "work", title: "工作(d)" },
        { field: "overtime", title: "加班(h)" },
        { field: "leave", title: "请假(h)" },
        { field: "annualLeave", title: "年假(d)" },
        { field: "abnormal", title: "异常考勤" },
        { field: "remarks", title: "备注" }
      ],
      dataAnalysis: [],
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
      this.tableData = [];
      this.dataAnalysis.forEach(item => {
        let staffData = {
          attendId: item.attendId,
          name: item.name,
          work: 0,
          overtime: 0,
          leave: 0,
          annualLeave: item.annualLeave,
          abnormal: 0,
          remarks: ""
        };
        try {
          item.staffDataAna[month].forEach(val => {
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
                } else if (val.indexOf("加班") > -1) {
                  staffData.overtime += parseFloat(val.replace("加班", ""));
                }
                break;
            }
          });
          this.tableData.push(staffData);
        } catch {
          console.log("该月没有数据");
        }
      });
    },
    /**
     * 收集需要统计的数据
     */
    getAnalysisData() {
      this.staffDatas.forEach(staff => {
        let staffDataAna = [];
        staff.attendRecord.forEach(attendanceObj => {
          if (!staffDataAna[attendanceObj.month]) {
            staffDataAna[attendanceObj.month] = [];
          }
          // 对请假和加班做处理，根据记录的时间统计加班/请假是半天还是一天
          let addFlag = "";
          if (
            attendanceObj.state === "加班" ||
            attendanceObj.state === "请假"
          ) {
            let time =
              attendanceObj.punchInTime[1] -
              attendanceObj.punchInTime[0];
            // 减去吃饭时间0.5小时
            addFlag = (time / 3600000).toFixed(1) - 0.5;
            // 力度设为0.5个小时
            let decimal = parseInt(("" + addFlag).split(".")[1]);
            addFlag =
              decimal > 5
                ? parseInt(("" + addFlag).split(".")[0]) + 0.5
                : parseInt(("" + addFlag).split(".")[0]);
          }
          staffDataAna[attendanceObj.month].push(
            attendanceObj.state + addFlag
          );
        });

        this.dataAnalysis.push({
          name: staff.name,
          attendId: staff.attendId,
          annualLeave: staff.annualLeave,
          staffDataAna: staffDataAna
        });
      });
    },
    /**
     * 渲染表格
     * @param {string} flag
     */
    handleTableData(flag) {
      let $table = $("#table");
      if (flag === "initial") {
        this.handleMonthsClick(1);
        $table.bootstrapTable({ columns: this.columns, data: this.tableData });
      } else {
        $table.bootstrapTable("refreshOptions", {
          columns: this.columns,
          data: this.tableData
        });
      }
    }
  },
  mounted() {
    let numberOfChiese = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二"
    ];
    for (let i = 1; i <= 12; i++) {
      let monthField = { id: i, name: numberOfChiese[i - 1] + "月" };
      this.months.push(monthField);
    }
    this.getAnalysisData();
    this.handleTableData("initial");
  }
};
</script>
<style lang="less" scoped>
  .attendance-analysis {
    .title {
      font-size: .4rem;
      font-weight: 550;
      height: 1rem;
      line-height: 1rem;
    }
    .month-buttons {
      display: flex;
      margin-bottom: .65rem;
    }
  }
</style>

