<template>
  <div class="holidays-input">
    <div class="holidays-input-title">假期录入</div>
    <div class="info-wrapper">
      <div class="form-input">
        <el-form label-width="80px" :model="holidayForm" ref="holidayForm" :rules="rules">
          <el-form-item label="节日名称" prop="holidayName">
            <el-input v-model="holidayForm.holidayName" class="holiday-name"></el-input>
          </el-form-item>
          <el-form-item label="日期选择" prop="holidayDate">
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
          <el-form-item label="调班日期" prop="holidayAdjust" disabled>
            <el-date-picker
              v-model="holidayForm.holidayAdjust"
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
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-display">
        <el-table :data="tableDataForHolidays" height="250" border stripe>
          <el-table-column prop="holidayName" label="节日名称" width="100" align="center"></el-table-column>
          <el-table-column label="假期时间" align="center">
            <el-table-column prop="holidayDateStart" label="起始时间" align="center"></el-table-column>
            <el-table-column prop="holidayDateEnd" label="结束时间" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="holidayNumber" label="天数" width="100" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="holidays-adjust-title">假期调班</div>
    <div class="holidays-adjust">
      <el-table :data="tableDataForHolidaysAd" height="200" border stripe>
        <el-table-column prop="holidayName" label="节日名称" width="100" align="center"></el-table-column>
        <el-table-column label="假期时间" align="center">
          <el-table-column prop="holidayDateStart" label="起始时间" align="center"></el-table-column>
          <el-table-column prop="holidayDateEnd" label="结束时间" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="holidayNumber" label="调整天数" width="100" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
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
        holidayAdjust: "",
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
        }
      },
      tableDataForHolidays: [],
      tableDataForHolidaysAd: []
    };
  },
  methods: {
    onSubmit() {
      this.$refs["holidayForm"].validate(valid => {
        if (valid) {
          this.tableDataForHolidays.push({
            holidayName: this.holidayForm.holidayName,
            holidayDateStart: this.holidayForm.holidayDate[0].toLocaleDateString(),
            holidayDateEnd: this.holidayForm.holidayDate[1].toLocaleDateString(),
            holidayNumber: Math.ceil(
              (this.holidayForm.holidayDate[1].getTime() -
                this.holidayForm.holidayDate[0].getTime()) /
                86400000
            )
          });
        }
      });
    },
    handleResetRegister() {
      this.$refs['holidayForm'].resetFields();
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
  .info-wrapper {
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
      width: 700px;
    }
  }
  .holidays-adjust-title {
    padding-bottom: 20px;
  }
}
</style>