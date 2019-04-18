<template>
  <div class="standard-input">
    <div class="form-input">
      <el-form label-width="80px" ref="holidayForm">
        <el-form-item label="年假标准" prop="annualLeave">
          <el-slider v-model="daysOfAnnual" :format-tooltip="formatAnnualLeave" :min="16" :max="80"></el-slider>
        </el-form-item>
        <el-form-item label="加班起始" prop="overtime">
          <el-time-picker
            v-model="startTime"
            format='H:mm'
            :picker-options="{ selectableRange: '17:30:00 - 20:30:00',format: 'H:mm'}"
          ></el-time-picker>
        </el-form-item>
        <el-form-item class="holiday-form-button">
          <div class="form-button-area">
            <el-button type="primary" @click="handleStandardInput">录入</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import webStorage from "web-storage-cache";
let myStorage = new webStorage();

export default {
  name: "standardInput",
  data() {
    return {
      daysOfAnnual: 40,
      startTime: new Date(2016, 9, 10, 18, 30), 
    };
  },
  computed: {
    standardData () {
      return this.$store.getters.standardData;
    }
  },
  methods: {
    handleStandardInput() {
      let minutes = ('' + this.startTime.getMinutes()).length < 2 ? '0' + this.startTime.getMinutes() : this.startTime.getMinutes();
      if (this.standardData) {
        this.$confirm('考勤标准数据已存在，需要重新导入么', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
          this.$store.dispatch('changeStandardData', {flag: 'change', standardData: {annualLeave: this.daysOfAnnual, overtime: this.startTime.getHours() + ":" + minutes}});
          this.$message('导入成功');
        }).catch(() => {
          this.$message('取消重新导入');
        })
      } else {
        this.$store.dispatch('changeStandardData', {flag: 'initial', standardData: {annualLeave: this.daysOfAnnual, overtime: this.startTime.getHours() + ":" + minutes}});
        this.$message('导入成功');
      }
    },
    formatAnnualLeave(val) {
      return val + "小时";
    }
  }
};
</script>
<style lang="less" scoped>
.form-input {
  width: 350px;
  background-color: #5db694;
  box-shadow: 2px 2px 5px rgba(11, 11, 11, 0.6);
  border-radius: 5px;
  padding: 20px;
  padding-bottom: 0;
  /deep/ .el-form-item {
    height: 45px;
    .form-button-area {
      position: relative;
      top: -5px;
      left: 148px;
    }
  }
}
</style>

