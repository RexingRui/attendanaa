<template>
  <div class="home">
    <div class="home-header">
      <div class="home-header-left">
        <i class="el-icon-edit-outline"></i>
        <div class="home-title">Schuduler</div>
      </div>
      <div class="home-header-right">
        <el-dropdown>
          <span class="el-dropdown-link">User
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="home-main">
      <div class="home-side">
        <home-side></home-side>
      </div>
      <div class="home-content">
        <staff-information></staff-information>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeSide from "@/components/HomeSide.vue";
import StaffInformation from "@/components/staffInformation.vue";

export default {
  name: "home",
  components: {
    HomeSide,
    StaffInformation
  }
};
</script>
<style lang="less" scoped>
  .home-header {
    position: fixed;
    height: 1.2rem;
    width: 100%;
    background-color: #4a648b;
    color: #e1e1e1;
    .home-header-left {
      margin: 0.42rem 0 0 0.48rem;
      .el-icon-edit-outline {
        transform: scale(2);
      }
      .home-title {
        margin: -0.34rem 0 0 0.5rem;
        font-size: 0.4rem;
      }
    }
    .home-header-right {
      position: absolute;
      top: .4rem;
      right: 1rem;
      .el-dropdown {
        color: #e1e1e1;
      }
    }
  }
  .home-main {
    width: 100%;
    padding-top: 1.2rem;
    min-height: 100vh;
    background-color: #e9e9f0;
    .home-side {
      position: fixed;
      overflow-y: auto;
      width: 5rem;
      height: 100%;
    }
    .home-content {
      padding: .5rem;
      box-sizing: border-box;
      margin-left: 5rem;
      background-color: #f1f1f1;
      height: 100%;
    }
  }
</style>

