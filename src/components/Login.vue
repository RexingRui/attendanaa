<template>
  <div class="login">
    <div class="login-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="账号" prop="name">
          <el-input v-model="form.name" size="medium" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            size="medium"
            clearable
            :type="inputStyle"
            placeholder="请输入密码"
          >
            <i slot="prefix" class="el-icon-view" @click="handlePassWordClick"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.region" placeholder="请选择级别">
            <el-option label="部门经理" value="manager"></el-option>
            <el-option label="普通员工" value="staff"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox label="记住我的登陆" v-model="form.loginState"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">登陆</el-button>
          <el-button @click="handleToRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import WebStorage from "web-storage-cache";

export default {
  name: "login",
  data() {
    return {
      form: {
        name: "",
        region: "",
        loginState: false,
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "姓名格式错误", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      inputStyle: "password",
      userStorage: {}
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          //  登陆数据验证，账号和密码的匹配度
          let myStorage = new WebStorage();
          let userNum = this.$store.state.userNum;
          let flag = false;
          for (let i = 0; i < userNum; i++) {
            let user = myStorage.get("user" + i);
            console.log(user);
            if (
              user.name == this.form.name &&
              user.password == this.form.password &&
              user.region == this.form.region
            ) {
              // 登陆成功message框
              this.$message({
                showClose: true,
                message: "登陆账号成功",
                type: "success",
                duration: 1500
              });
              flag = true;
              this.$router.push({name: 'home'});
              break;
            }
          }
          if (!flag) {
            // 验证错误Notification框
            this.$notify.error({
              title: "登陆出错",
              message: "账号、密码或等级选择错误"
            });
          }
        } else {
          return false;
        }
      });
    },
    handlePassWordClick() {
      this.inputStyle = this.inputStyle == "password" ? "text" : "password";
    },
    handleToRegister() {
      this.$emit("change", "register");
    }
  }
};
</script>
<style lang="less" scoped>
  .login {
    .login-wrap {
      padding-top: 0.48rem;
      box-sizing: border-box;
      width: 8rem;
      height: 6.8rem;
      background-color: #ebe6e6;
      border-radius: 0.32rem;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
      /deep/ input {
        width: 6rem;
      }
      .el-icon-view {
        color: #161414;
        cursor: pointer;
        margin-left: 0.05rem;
      }
    }
  }
</style>
