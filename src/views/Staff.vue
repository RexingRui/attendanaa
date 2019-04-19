<template>
  <div class="staff-item">
    <div class="staff-chart">
      <v-chart :options="attendanceData" class="attendance-pie"/>
    </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
let myStorage = new WebStorage();
export default {
  name: "staff",
  data() {
    return {
      attendanceData: {
        title: {
          text: "个人考勤数据"
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: []
        },
        series: []
      }
    };
  },
  computed: {
    attendanceAnalysisData() {
      return this.$store.getters.attendanceAnalysisData;
    }
  },
  methods: {
    getStaffAnalysisData() {
      let xLable = ['months'];
      let workTime = ['工作'];
      let overTime = ['加班'];
      let leaveTime =  ['请假']
      for (let month in this.attendanceAnalysisData) {
        xLable.push(month);
        let staffAnalysisData = this.attendanceAnalysisData[month].filter(staff => {
          return staff.attendId == this.$route.params.id;
        })[0];
        if (!staffAnalysisData) {
          workTime.push(undefined);
          overTime.push(undefined);
          leaveTime.push(undefined);
        } else {
          workTime.push(staffAnalysisData['work']);
          overTime.push(staffAnalysisData['overtime']);
          leaveTime.push(staffAnalysisData['leave']);
        }
      }
      this.attendanceData.dataset.source.push(xLable);
      this.attendanceData.dataset.source.push(workTime);
      this.attendanceData.dataset.source.push(overTime);
      this.attendanceData.dataset.source.push(leaveTime);
    },
    getEchartSeries() {
      this.attendanceData.series =  [
          {
            type: "pie",
            radius: 40,
            center: ["15%", "30%"]
            // No encode specified, by default, it is '2012'.
          },
          {
            type: "pie",
            radius: 40,
            center: ["35%", "30%"],
            encode: {
              itemName: "months",
              value: "Feb"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["55%", "30%"],
            encode: {
              itemName: "months",
              value: "Mar"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["75%", "30%"],
            encode: {
              itemName: "months",
              value: "April"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["15%", "55%"],
            encode: {
              itemName: "months",
              value: "May"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["35%", "55%"],
            encode: {
              itemName: "months",
              value: "Jun"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["55%", "55%"],
            encode: {
              itemName: "months",
              value: "Jul"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["75%", "55%"],
            encode: {
              itemName: "months",
              value: "Aug"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["15%", "80%"],
            encode: {
              itemName: "months",
              value: "Sept"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["35%", "80%"],
            encode: {
              itemName: "months",
              value: "Oct"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["55%", "80%"],
            encode: {
              itemName: "months",
              value: "Nov"
            }
          },
          {
            type: "pie",
            radius: 40,
            center: ["75%", "80%"],
            encode: {
              itemName: "months",
              value: "Dec"
            }
          }
        ]
    }
  },
  mounted() {
    this.getStaffAnalysisData();
    this.getEchartSeries();
  }
};
</script>
<style lang="less" scoped>
.staff-item {
  padding-top: 100px;
  .staff-back-home {
    position: absolute;
    right: 50px;
    button {
      cursor: pointer;
    }
  }
}
.staff-chart {
  width: 90%;
  height: 80vh;
  .attendance-pie {
    width: 65%;
    height: 100%;
  }
}
</style>
