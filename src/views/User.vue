<template>
  <div class="user">
    <transition name="component-fade" mode="out-in">
      <component :is="view" @change="handleChange"></component>
    </transition>
  </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import utils from "@/common/index.js";

export default {
  name: "user",
  components: {
    login: Login,
    register: Register
  },
  data() {
    return {
      view: "login"
    };
  },
  methods: {
    handleChange(comName) {
      this.view = comName;
    }
  },
  mounted() {
    // 获取账号数量
    utils.getUserNum("userNum", this);
  }
};
</script>
<style lang="less" scoped>
  .user {
    width: 100%;
    height: 100vh;
    background-color: rgba(61, 85, 100, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    .component-fade-enter-active,
    .component-fade-leave-active {
      transition: opacity 0.3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
      opacity: 0;
    }
  }
</style>
