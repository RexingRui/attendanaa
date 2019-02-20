<template>
  <div class="menu-home-side">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>人员管理</span>
        </template>
        <el-menu-item index="1-1">人员信息</el-menu-item>
        <el-menu-item index="1-2">人员管理</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>排班管理</span>
        </template>
        <el-menu-item index="2-1">班次设置</el-menu-item>
        <el-menu-item index="2-2" disabled>排班分类</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">考勤统计</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>统计报表</span>
        </template>
        <el-menu-item index="4-1">数据分析</el-menu-item>
        <el-menu-item index="4-2" disabled>导出报表</el-menu-item>
      </el-submenu>
      <el-menu-item index="5">
        <i class="el-icon-question"></i>
        <span slot="title">帮助</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="el-icon-phone"></i>
        <span slot="title">联系</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "homeSide"
};
</script>
<style lang="less" scoped>
</style>

