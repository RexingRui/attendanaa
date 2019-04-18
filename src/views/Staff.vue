<template>
  <div class="staff-item">
    <div class="staff-back-home">
      <el-button type="success" @click="handleBackButtonClick">123</el-button>
    </div>
    <div class="staff-chart">
      <v-chart :options="attendanceData"/>11
    </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
let myStorage = new WebStorage();
export default {
  name: "staff",
  data() {
    return {
      attendanceData: {
      }
    };
  },
  methods: {
    handleBackButtonClick() {
      myStorage.set('attendanceId', 0);
      this.$router.push({name: 'home'});
    }
  },
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
</style>
