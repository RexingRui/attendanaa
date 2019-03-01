<template>
  <div class="home">
    <div class="home-header">
      <div class="home-header-left">
        <i class="el-icon-edit-outline"></i>
        <div class="home-title">Scheduler</div>
      </div>
      <div class="home-header-right">
        <el-dropdown>
          <span class="el-dropdown-link">
            User
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
        <keep-alive>
          <component :is="currentPage"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeSide from "@/components/HomeSide.vue";
import StaffInformation from "@/components/staffInformation.vue";
import WebStorage from "web-storage-cache";
import staffAttendance from "@/components/staffAttendance.vue";

export default {
  name: "home",
  components: {
    HomeSide,
    StaffInformation,
    staffAttendance
  },
  computed: {
    currentPage() {
      return this.$store.state.pageIndex;
    }
  },
  methods: {
    /**
     * 获取员工数据，并将数据存入至vuex
     */
    getStaffData() {
      // 获取员工数量，初始化
      let myStorage = new WebStorage();
      let staffNum = myStorage.get("staffNum") ? myStorage.get("staffNum") : 0;
      this.$store.dispatch("initialStaffNum", { staffNum: staffNum });
      // 获取员工信息,初始化
      let staffDatas = [];
      // 已经删除的员工数量
      let deletNum = myStorage.get("deleteNum")
        ? myStorage.get("deleteNum")
        : 0;
      let num = staffNum + deletNum;
      for (let i = 0; i < num; i++) {
        let staff = myStorage.get("staff" + i);
        if (staff) {
          staffDatas.push(staff);
        }
      }
      this.$store.dispatch("initialStaffData", { staffDatas: staffDatas });
    }
  },
  mounted() {
    this.getStaffData();

  }
};
</script>
<style lang="less" scoped>
  .home-header {
    position: fixed;
    z-index: 10;
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
      top: 0.4rem;
      right: 1rem;
      .el-dropdown {
        color: #e1e1e1;
      }
    }
  }
  .home-main {
    z-index: 1;
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
      padding: 0.5rem;
      box-sizing: border-box;
      margin-left: 5rem;
      background-color: #fbfbfb;
      min-height: calc(100vh - 1.2rem);
    }
  }
</style>

