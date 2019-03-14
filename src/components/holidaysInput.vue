<template>
  <div class="holidays-input">
    <div class="holidays-input-title">假期录入</div>
    <div class="info-wrapper-holiday">
      <div class="form-input">
        <el-form label-width="80px" :model="holidayForm" ref="holidayForm" :rules="rules">
          <el-form-item label="节日名称" prop="holidayName">
            <el-input v-model="holidayForm.holidayName" class="holiday-name" clearable></el-input>
          </el-form-item>
          <el-form-item label="假日日期" prop="holidayDate" v-if="holidayForm.radio == '否'">
            <el-date-picker
              v-model="holidayForm.holidayDate"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="holiday-form-adjust" label="是否调班">
            <el-radio v-model="holidayForm.radio" label="是">是</el-radio>
            <el-radio v-model="holidayForm.radio" label="否">否</el-radio>
          </el-form-item>
          <el-form-item label="调班日期" prop="holidayDateAd" v-if="holidayForm.radio == '是'">
            <el-date-picker
              v-model="holidayForm.holidayDateAd"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="holiday-form-button">
            <el-button @click="handleResetRegister">重置</el-button>
            <el-button type="primary" @click="handleHolidayAdd" v-show="holidayForm.radio == '否'">添加</el-button>
            <el-button
              type="primary"
              @click="handleHolidayAdjust"
              v-show="holidayForm.radio == '是'"
            >添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-display">
        <el-table :data="tableDataForHolidays" height="250" border stripe size="small">
          <el-table-column prop="holidayName" label="节日名称" width="100" align="center"></el-table-column>
          <el-table-column label="假期时间" align="center">
            <el-table-column prop="holidayDateStart" label="起始时间" align="center"></el-table-column>
            <el-table-column prop="holidayDateEnd" label="结束时间" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="holidayNumber" label="天数" width="100" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleHolidayDelete(scope.$index, tableDataForHolidays)"
              >Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="holidays-adjust-title">假期调班</div>
    <div class="info-wrapper-holiday-adjust">
      <div class="holidays-adjust">
        <el-table :data="tableDataForHolidaysAd" height="200" border stripe size="small">
          <el-table-column prop="holidayName" label="节日名称" width="100" align="center"></el-table-column>
          <el-table-column label="假期调整日期" align="center">
            <el-table-column prop="holidayDateAdStart" label="起始时间" align="center"></el-table-column>
            <el-table-column prop="holidayDateAdEnd" label="结束时间" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="holidayAdNumber" label="调整天数" width="100" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleHolidayDelete(scope.$index, tableDataForHolidaysAd)"
              >Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-upload">
        <el-button type="primary" @click="handleHolidayDataUp">
          上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";
let myStorage = new WebStorage();

export default {
  name: "holidaysInput",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      holidayForm: {
        holidayName: "",
        holidayDate: "",
        holidayDateAd: "",
        radio: "否"
      },
      rules: {
        holidayName: {
          required: true,
          message: "请输入节日名称",
          trigger: "blur"
        },
        holidayDate: {
          required: true,
          message: "请选择节假日日期",
          trigger: "blur"
        },
        holidayDateAd: {
          required: true,
          message: "请选择调班日日期",
          trigger: "blur"
        }
      },
      tableDataForHolidays: [],
      tableDataForHolidaysAd: []
    };
  },
  methods: {
    handleHolidayAdd() {
      this.$refs["holidayForm"].validate(valid => {
        if (valid) {
          this.tableDataForHolidays.push({
            holidayName: this.holidayForm.holidayName,
            holidayDateStart: this.holidayForm.holidayDate[0].toLocaleDateString(),
            holidayDateEnd: this.holidayForm.holidayDate[1].toLocaleDateString(),
            holidayNumber: Math.ceil(
              (this.holidayForm.holidayDate[1].getTime() -
                this.holidayForm.holidayDate[0].getTime() +
                1) /
                86400000
            )
          });
          this.holidayForm.holidayDate = "";
          this.holidayForm.radio = "否";
        }
      });
    },
    handleHolidayAdjust() {
      this.$refs["holidayForm"].validate(valid => {
        if (valid) {
          this.tableDataForHolidaysAd.push({
            holidayName: this.holidayForm.holidayName,
            holidayDateAdStart: this.holidayForm.holidayDateAd[0].toLocaleDateString(),
            holidayDateAdEnd: this.holidayForm.holidayDateAd[1].toLocaleDateString(),
            holidayAdNumber: Math.ceil(
              (this.holidayForm.holidayDateAd[1].getTime() -
                this.holidayForm.holidayDateAd[0].getTime() +
                1) /
                86400000
            )
          });
          this.holidayForm.holidayDateAd = "";
          this.holidayForm.radio = "是";
        }
      });
    },
    handleResetRegister() {
      // 重置表单
      this.holidayForm.holidayDateAd = "";
      this.holidayForm.holidayDate = "";
      this.holidayForm.holidayName = "";
      this.$refs["holidayForm"].clearValidate();
    },
    handleHolidayDelete(index, tableData) {
      tableData.splice(index, 1);
    },
    handleHolidayAdDelete(index, tableData) {
      tableData.splice(index, 1);
    },
    handleTableData() {
      let dateDataOfYear = {
        year: "",
        holiday: [],
        weekdie: [],
        weekend: []
      };
      let currentYear = new Date().getFullYear();
      dateDataOfYear.year = currentYear;

      // 存入假期数据
      this.tableDataForHolidays.forEach(el => {
        let holidayDateStartTime = new Date(el.holidayDateStart).getTime();
        for (let i = 0; i < el.holidayNumber; i++) {
          let nextDate = holidayDateStartTime + i * 86400000;
          dateDataOfYear.holiday.push({
            name: el.holidayName,
            month: new Date(nextDate).getMonth() + 1,
            day: new Date(nextDate).getDate()
          });
        }
      });

      // 存入假期调班数据
      this.tableDataForHolidaysAd.forEach(el => {
        let holidayDateAdStartTime = new Date(el.holidayDateAdStart).getTime();
        for (let i = 0; i < el.holidayAdNumber; i++) {
          let nextAdDate = holidayDateAdStartTime + i * 86400000;
          dateDataOfYear.weekdie.push({
            name: el.holidayName,
            month: new Date(nextAdDate).getMonth() + 1,
            day: new Date(nextAdDate).getDate()
          });
        }
      });

      // 存入周末
      let dateStartOfYear = new Date(`${currentYear}/1/1`).getTime();
      let allDaysOfYear =
        (new Date(`${currentYear}/12/31`).getTime() - dateStartOfYear) /
          86400000 +
        1;
      for (let i = 0; i < allDaysOfYear; i++) {
        let currentDateOfWeek = new Date(
          dateStartOfYear + 86400000 * i
        ).getDay();
        let currentDate = new Date(dateStartOfYear + 86400000 * i)
          .toLocaleDateString()
          .split("/");
        // 判断是否是周末
        if (currentDateOfWeek == 0 || currentDateOfWeek == 6) {
          // 判断当前的周末是不是在节假日或者节假日调班内
          let isHolidayInWeek = dateDataOfYear.holiday.some(value => {
            return value.month == currentDate[1] && value.day == currentDate[2];
          });
          let isHolidayInWeekdie = dateDataOfYear.weekdie.some(value => {
            return value.month == currentDate[1] && value.day == currentDate[2];
          });

          if (!isHolidayInWeek && !isHolidayInWeekdie) {
            dateDataOfYear.weekend.push({
              month: currentDate[1],
              day: currentDate[2]
            });
          }
        }
      }

      // 分发数据
      this.$store.dispatch("getDateDataOfYear", {
        dateDataOfYear: dateDataOfYear
      });
    },
    handleHolidayDataUp() {
      if (myStorage.get("dateDataOfYear")) {
        this.$confirm("需要重新导入假日信息么", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            myStorage.delete("dateDataOfYear");
            this.handleTableData();
          })
          .catch(() => {
            this.$message("取消重新导入");
          });
      } else {
        this.handleTableData();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.holidays-input {
  .holidays-input-title,
  .holidays-adjust-title {
    padding-top: 15px;
    color: #121212;
    font-size: 18px;
    font-weight: 550;
  }
  .info-wrapper-holiday {
    padding-top: 20px;
    display: flex;
    justify-content: space-around;

    .form-input {
      width: 350px;
      background-color: #5db694;
      box-shadow: 2px 2px 5px rgba(11, 11, 11, 0.6);
      border-radius: 5px;
      padding: 10px;
      padding-bottom: 0;
      .holiday-form-button {
        position: relative;
        left: 100px;
        margin-top: -15px;
      }
      /deep/ .el-form-item {
        height: 45px;
        .holiday-name {
          width: 250px;
        }
        .el-form-item__content {
          height: 45px;
        }
        .el-form-item__error {
          top: 100%;
        }
        .el-date-editor--daterange {
          width: 250px;
          .el-range-separator {
            padding: 0;
            width: 8%;
          }
        }
      }
    }
    .form-display {
      width: 600px;
    }
  }

  .info-wrapper-holiday-adjust {
    display: flex;
    justify-content: space-between;
    .holidays-adjust {
      width: 500px;
    }
    .data-upload {
      align-self: flex-end;
      margin-right: 50px;
    }
  }
  .holidays-adjust-title {
    padding-bottom: 20px;
  }
}
</style>