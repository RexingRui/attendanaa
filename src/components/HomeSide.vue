<template>
  <div class="menu-home-side">
    <el-menu
      default-active="one"
      class="el-menu-vertical-demo"
      @select= "handleMenuSelect"
    >
      <el-submenu index="one">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>人员管理</span>
        </template>
        <el-menu-item index="staffInformation">人员信息</el-menu-item>
        <el-menu-item index="staffManager">人员管理</el-menu-item>
      </el-submenu>
      <el-submenu index="two">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>排班管理</span>
        </template>
        <el-menu-item index="attendanceSet">班次设置</el-menu-item>
        <el-menu-item index="attendanceCategory" disabled>排班分类</el-menu-item>
      </el-submenu>
      <el-menu-item index="staffAttendance">
        <i class="el-icon-document"></i>
        <span slot="title">考勤统计</span>
      </el-menu-item>
      <el-submenu index="four">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>统计报表</span>
        </template>
        <el-menu-item index="dataAnalysis">数据分析</el-menu-item>
        <el-menu-item index="exportReport" disabled>导出报表</el-menu-item>
      </el-submenu>
      <el-menu-item index="help">
        <i class="el-icon-question"></i>
        <span slot="title">帮助</span>
      </el-menu-item>
      <el-menu-item index="contact">
        <i class="el-icon-phone"></i>
        <span slot="title">联系</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "homeSide",
  methods: {
    handleMenuSelect(index) {
      if (index) {
        this.$store.dispatch('changeCurrentPage', {pageIndex: index});
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>

