<template>
  <div class="user">
    <transition name="component-fade" mode="out-in">
      <component :is="view" @change="handleChange" @login="handleToLogin"></component>
    </transition>
  </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import WebStorage from "web-storage-cache";
import axios from "axios";
import moveFile from "@/common/move.js";

let mySessionSt = new WebStorage({storage: 'sessionStorage'});

export default {
  name: "user",
  components: {
    login: Login,
    register: Register
  },
  data() {
    return {
      view: "login",
      userNum: 0
    };
  },
  methods: {
    // 动态组件切换
    handleChange(comName) {
      this.view = comName;
    },
    // 注册页面通过单击返回登陆页面按钮返回
    handleToLogin(login) {
      this.view = login;
    }
    // 通过axios获取登录信息
    // getData() {
    //   axios
    //     .get("/static/mock/user.json")
    //     .then(this.getDataSuccess)
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // getDataSuccess(res) {
    //   if (res) {
    //     let myStorage = new WebStorage();
    //     let data = res.data;
    //     this.userNum = data.length;
    //     data.forEach(value => {
    //       myStorage.set("user" + value.id, value);
    //     });
    //   }
    // },
    // downloadObjectAsJson(exportObj, exportName) {
    //   var dataStr =
    //     "data:text/json;charset=utf-8," +
    //     encodeURIComponent(JSON.stringify(exportObj));
    //   var downloadAnchorNode = document.createElement("a");
    //   downloadAnchorNode.setAttribute("href", dataStr);
    //   downloadAnchorNode.setAttribute("download", exportName + ".json");
    //   document.body.appendChild(downloadAnchorNode); // required for firefox

    //   downloadAnchorNode.click();
    //   downloadAnchorNode.remove();
    // }
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    if (mySessionSt.get("loginState")) {
      next({ path: "home"});
    } else {
      next();
    }
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
